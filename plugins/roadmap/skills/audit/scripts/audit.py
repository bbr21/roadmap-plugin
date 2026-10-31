#!/usr/bin/env python3
"""Audit du contenu de la roadmap (#103) : un relevé mécanique (paquets et leurs fragments, trous,
doublons possibles), puis l'application des propositions validées (découpages, regroupements,
fusions, fermetures, dépendances, valeurs), tout ou rien, sauvegardée et prouvée par un bilan qui
retrouve chaque fragment du texte d'origine.

python3 audit.py releve DOSSIER [--jour AAAA-MM-JJ] > releve.json
python3 audit.py appliquer DOSSIER --propositions propositions.json [--jour AAAA-MM-JJ]

Python 3.9 et plus, bibliothèque standard seulement. Lit la grammaire avec `importer.py` de la skill
onboarding, pour que les deux skills lisent une ligne de la même façon.
"""

import csv
import datetime
import hashlib
import io
import itertools
import json
import os
import re
import shutil
import sys
import unicodedata

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "onboarding", "scripts"))
import importer as im  # noqa: E402
import onboarding as ob  # noqa: E402

Erreur = im.Erreur
FICHIER_OUVERT, FICHIER_FAIT = im.FICHIER_OUVERT, im.FICHIER_FAIT

# Comme le panneau (#99) : sans `relance` dans roadmap.json, une attente se relance à 14 jours.
RELANCE_JOURS = 14
REQUIS_PROJET = ["id", "ouvert", "due", "resp", "parent", "après"]
SEUIL_DOUBLON = 0.3

# Les mots qu'une reformulation change sans rien perdre du sens : articles et déterminants,
# prépositions, conjonctions. Une liste fermée ; tout autre mot compte dans le bilan, la négation
# (« ne », « pas », « sans ») comprise.
MOTS_VIDES = frozenset("""
a au aux avec ce ces cet cette d de des du en et l la le les leur leurs ou par pour puis qu que
sa ses son sur un une dans sous chez vers entre ni mais donc car the of to and for in on at with by from
""".split())


def _sans_accents(texte):
    return "".join(c for c in unicodedata.normalize("NFD", texte) if unicodedata.category(c) != "Mn")


def mots(texte):
    """Les mots d'un texte qui comptent : lettres et chiffres, en minuscules, sans accents, hors
    mots vides et lettres seules (l', d', qu')."""
    jetons = re.findall(r"[a-z0-9]+", _sans_accents(texte or "").lower())
    return {j for j in jetons if j not in MOTS_VIDES and (len(j) > 1 or j.isdigit())}


def fragments(libelle):
    """Le libellé coupé à chaque « ; » hors parenthèses (une parenthèse est un seul aparté), espaces
    réduits, morceaux vides retirés. Une parenthèse jamais refermée : coupé à chaque « ; »."""
    libelle = libelle or ""
    morceaux, debut, prof = [], 0, 0
    for i, c in enumerate(libelle):
        prof += (c == "(") - (c == ")" and prof > 0)
        if c == ";" and prof == 0:
            morceaux.append(libelle[debut:i])
            debut = i + 1
    morceaux.append(libelle[debut:])
    if prof:
        morceaux = libelle.split(";")
    return [m for m in (re.sub(r"\s+", " ", m).strip() for m in morceaux) if m]


def _lire_fichier(chemin):
    if not os.path.isfile(chemin):
        return None
    with open(chemin, encoding="utf-8") as f:
        return f.read()


def empreinte(rdir):
    """L'empreinte des deux fichiers de la roadmap : elle change dès que l'un d'eux change."""
    h = hashlib.sha256()
    for nom in (FICHIER_OUVERT, FICHIER_FAIT):
        h.update(nom.encode() + b"\0" + (_lire_fichier(os.path.join(rdir, nom)) or "").encode("utf-8") + b"\0")
    return h.hexdigest()


def _cfg(dossier):
    try:
        with open(os.path.join(dossier, ".claude", "roadmap.json"), encoding="utf-8") as f:
            cfg = json.load(f)
        return cfg if isinstance(cfg, dict) else {}
    except (OSError, ValueError):
        return {}


def _me(perso):
    try:
        with open(os.path.expanduser(perso), encoding="utf-8") as f:
            me = (json.load(f) or {}).get("me") or []
    except (OSError, ValueError, AttributeError):
        return []
    return [me] if isinstance(me, str) else [x for x in me if isinstance(x, str)]


def situer(dossier):
    """(dossier du projet, dossier de la roadmap, mode). En mode Code, le dossier principal sur `main`."""
    dossier = os.path.abspath(os.path.expanduser(dossier))
    mode = ob.mode_du_dossier(dossier)
    if mode == "code":
        dossier = ob.principal(dossier)
        mode = ob.mode_du_dossier(dossier)
        res = ob.git(dossier, "rev-parse", "--abbrev-ref", "HEAD")
        if mode == "code" and res.returncode == 0 and res.stdout.strip() != "main":
            raise Erreur("le dossier principal %s n'est pas sur main (%s) : la roadmap ne s'écrit que sur main"
                         % (dossier, res.stdout.strip()))
    rdir = ob.trouver_roadmap(dossier)
    if not rdir or not os.path.isfile(os.path.join(rdir, FICHIER_OUVERT)):
        raise Erreur("pas de ROADMAP.md dans %s : lance d'abord l'onboarding" % dossier)
    return dossier, rdir, mode


def _dico(t):
    return {k: v for k, v in t["champs"] if v is not None}


def _jours(de, a):
    try:
        return (datetime.date.fromisoformat(a) - datetime.date.fromisoformat(de)).days
    except ValueError:
        return None


def _signifiants(texte, longueur, exclus):
    """Les mots qui disent le sujet : hors parenthèses (attributions, dates de qui a parlé), hors
    nombres et noms de la personne, d'au moins `longueur` lettres."""
    texte = re.sub(r"\([^)]*\)", " ", texte)
    return {m for m in mots(texte) if len(m) >= longueur and not m.isdigit()} - exclus


def _jaccard(a, b):
    return len(a & b) / len(a | b) if a and b else 0.0


def releve(dossier, jour=None, perso="~/.claude/roadmap-perso.json"):
    """Le relevé du contenu de la roadmap (le JSON de la spec). Lecture seule."""
    jour = jour or datetime.date.today().isoformat()
    dossier, rdir, mode = situer(dossier)
    cfg = _cfg(dossier)
    requis = cfg.get("requis") if isinstance(cfg.get("requis"), list) else (REQUIS_PROJET if mode == "projet" else [])
    relance = cfg.get("relance") if isinstance(cfg.get("relance"), int) else RELANCE_JOURS
    me = _me(perso)
    texte_o = _lire_fichier(os.path.join(rdir, FICHIER_OUVERT)) or ""
    texte_f = _lire_fichier(os.path.join(rdir, FICHIER_FAIT)) or ""
    ecarts = im.ecarts_ids(texte_o, texte_f, exiger=True)
    if ecarts:
        raise Erreur("numérotation incomplète (%s) : lance d'abord l'import (skill onboarding)" % " ; ".join(ecarts))
    ouvertes = [t for t in im.lire_checklist(texte_o)[0] if not t["fait"]]
    closes = [t for t in im.lire_checklist(texte_o)[0] if t["fait"]] + im.lire_checklist(texte_f)[0]
    tous_ids = {im.champ(t, "id") for t in ouvertes + closes}
    enfants = {}
    for t in ouvertes + closes:
        p = im.champ(t, "parent")
        if p and p != "-":
            enfants.setdefault(p, []).append(t)

    taches = []
    for t in ouvertes:
        i = im.champ(t, "id")
        p = im.champ(t, "parent")
        taches.append({
            "id": i, "ligne": t["ligne"], "libelle": t["libelle"], "note": t["note"], "axe": t["axe"],
            "champs": _dico(t), "fragments": fragments(t["libelle"]),
            "parent": p if p and p != "-" else None,
            "enfants": [im.champ(e, "id") for e in enfants.get(i, [])],
        })

    trous = {k: [] for k in ("sans_due", "en_retard", "sans_resp", "a_relancer",
                             "mere_sans_enfant_ouvert", "parent_introuvable")}
    for t in taches:
        c, i = t["champs"], t["id"]
        if not c.get("due"):
            trous["sans_due"].append(i)
        elif c["due"] < jour:
            trous["en_retard"].append(i)
        if "resp" in requis and not c.get("resp"):
            trous["sans_resp"].append(i)
        qui = (c.get("attend") or "").split(",")[0].strip()
        if qui and qui not in me:
            attente = _jours(c.get("relance") or c.get("ouvert") or jour, jour)
            if attente is not None and attente >= relance:
                trous["a_relancer"].append(i)
        if t["enfants"] and all(e["fait"] for e in enfants[i]):
            trous["mere_sans_enfant_ouvert"].append(i)
        if t["parent"] and t["parent"] not in tous_ids:
            trous["parent_introuvable"].append(i)

    noms = mots(" ".join(me))
    corps = {t["id"]: _signifiants(t["libelle"], 4, noms) for t in taches}
    sujets = {t["id"]: _signifiants(t["libelle"].split(" : ")[0] if " : " in t["libelle"] else "", 3, noms)
              for t in taches}
    doublons = []
    for a, b in itertools.combinations(taches, 2):
        notes = [(_jaccard(x[a["id"]], x[b["id"]]), x[a["id"]] & x[b["id"]]) for x in (corps, sujets)]
        score, communs = max(notes, key=lambda n: n[0])
        if score >= SEUIL_DOUBLON:
            doublons.append({"a": a["id"], "b": b["id"], "score": round(score, 2), "mots": sorted(communs)})
    doublons.sort(key=lambda d: -d["score"])

    # Les clés qu'une sous-tâche reprend de sa mère, à valider : `fiche:` (où vit le sujet) et les clés
    # déclarées dont une valeur revient sur plusieurs tâches (une catégorie, pas un identifiant).
    declarees = cfg.get("cles") if isinstance(cfg.get("cles"), dict) else {}
    heritage = {"fiche"} if any(t["champs"].get("fiche") for t in taches) else set()
    for k in declarees:
        valeurs = [t["champs"][k] for t in taches if t["champs"].get(k)]
        if len(valeurs) > len(set(valeurs)):
            heritage.add(k)

    return {
        "roadmap": os.path.join(rdir, FICHIER_OUVERT), "fait": os.path.join(rdir, FICHIER_FAIT),
        "dossier": dossier, "jour": jour, "mode": mode, "requis": requis, "me": me, "relance": relance,
        "empreinte": empreinte(rdir), "taches": taches,
        "paquets": [t["id"] for t in taches if len(t["fragments"]) > 1],
        "trous": trous, "doublons_possibles": doublons, "heritage": sorted(heritage),
        "cles": sorted(declarees),
    }


# ---------------------------------------------------------------- appliquer

# L'ordre des champs d'une ligne écrite par l'audit : celui de la grammaire, puis les autres.
ORDRE = ["id", "ouvert", "due", "resp", "parent", "après", "attend", "relance", "prio"]
# Ce qu'une proposition ne pose jamais dans `champs` : le numéro, la session, la clôture, et les
# liens que l'audit écrit lui-même (`parent:` par découpage ou regroupement, `après:` par `apres`).
CHAMPS_INTERDITS = {"id", "qui", "branche", "verrou", "fait", "parent", "après"}
CLES_PANNEAU = set(im.CLES_GRAMMAIRE) | {"tous", "relance"}
NON_HERITES = {"id", "ouvert", "parent", "après", "qui", "branche", "verrou", "fait", "ref"}
# Les clés permises dans propositions.json, par niveau : une faute de frappe perdrait un choix validé.
SCHEMA = {
    "": {"releve", "decoupages", "regroupements", "fusions", "fermetures", "apres", "valeurs", "heritage"},
    "decoupages": {"id", "mere", "fragments_mere", "enfants"},
    "decoupages.mere": {"libelle", "note", "champs"},
    "decoupages.enfants": {"cle", "libelle", "note", "fragments", "champs"},
    "regroupements": {"mere", "enfants"},
    "regroupements.mere": {"cle", "libelle", "note", "axe", "champs"},
    "fusions": {"garde", "part", "libelle"},
    "fermetures": {"id"},
    "apres": {"id", "apres"},
    "valeurs": {"id", "champ", "valeur"},
}
VALEURS_PERMISES = ("due", "resp", "relance", "attend", "prio", "ouvert", "parent")


class _Tache:
    """Une tâche de ROADMAP.md en cours de préparation : ses champs dans l'ordre, et si elle change."""

    def __init__(self, t=None, **kw):
        t = t or {}
        self.id = im.champ(t, "id") if t else kw.get("id")
        self.fait = t.get("fait", False)
        self.libelle = t.get("libelle", kw.get("libelle", ""))
        self.origine = self.libelle
        self.note = t.get("note", kw.get("note", ""))
        self.axe = t.get("axe", kw.get("axe", ""))
        self.champs = list(t.get("champs", kw.get("champs", [])))
        self.ligne = t.get("ligne")
        self.ancre = None  # pour une tâche créée : la ligne sous laquelle elle s'écrit
        self.brut = t.get("brut")
        self.touche = not t

    def get(self, k):
        return next((v for c, v in self.champs if c == k), None)

    def set(self, k, v):
        self.touche = True
        for n, (c, _) in enumerate(self.champs):
            if c == k:
                self.champs[n] = (k, v)
                return
        self.champs.append((k, v))

    def texte(self):
        """Le libellé, la note et les valeurs des champs : ce où un mot peut se retrouver."""
        return " ".join([self.libelle, self.note] + [v for _, v in self.champs if v])

    def rendre(self):
        if not self.touche:
            return self.brut
        retrait = self.brut[:len(self.brut) - len(self.brut.lstrip())] if self.brut else ""
        return retrait + im.rendre_ligne(self.fait, self.libelle, self.axe, self.champs, self.note)


def _propre(v):
    return im.valeur_propre(str(v)) if v is not None else ""


def _ordonnes(champs):
    """Les champs dans l'ordre de la grammaire, puis ceux qui n'y sont pas, dans l'ordre donné."""
    connus = [(k, champs[k]) for k in ORDRE if k in champs]
    return connus + [(k, v) for k, v in champs.items() if k not in ORDRE]


def _charger_props(chemin):
    try:
        with open(chemin, encoding="utf-8") as f:
            props = json.load(f)
        with open(props["releve"], encoding="utf-8") as f:
            return props, json.load(f)
    except (OSError, ValueError, KeyError, TypeError) as e:
        raise Erreur("propositions ou relevé illisibles (%s) : %s" % (chemin, e))


class _Preparation:
    def __init__(self, releve, props):
        self.r, self.p = releve, props
        self.rdir = os.path.dirname(releve["roadmap"])
        self.jour = releve["jour"]
        self.requis = releve.get("requis") or []
        self.heritage = [k for k in props.get("heritage", releve.get("heritage") or []) if k not in NON_HERITES]
        self.declarees = set(releve.get("cles") or [])
        self.gardes = set()
        self.texte_o = _lire_fichier(releve["roadmap"]) or ""
        self.texte_f = _lire_fichier(releve["fait"])
        self.lignes = self.texte_o.split("\n")
        self.taches = {}
        for t in im.lire_checklist(self.texte_o)[0]:
            if not t["fait"]:
                self.taches[im.champ(t, "id")] = _Tache(t)
        self.par_ligne = {t.ligne: t for t in self.taches.values()}
        self.apres_ligne = {}  # numéro de ligne → tâches nouvelles écrites dessous
        self.avant_ligne = {}  # numéro de ligne → mères nouvelles écrites dessus
        self.vers_fait, self.bilans, self.decoupees = [], [], set()
        ids = [int(im.champ(t, "id")) for texte in (self.texte_o, self.texte_f or "")
               for t in im.lire_checklist(texte)[0] if (im.champ(t, "id") or "").isdigit()]
        self.prochain = max(ids or [0]) + 1
        self.ids_fait = {im.champ(t, "id") for t in im.lire_checklist(self.texte_f or "")[0]} | \
            {im.champ(t, "id") for t in im.lire_checklist(self.texte_o)[0] if t["fait"]}
        self.cles = {}
        self.bilan = {"decoupages": 0, "enfants": 0, "fragments": {"verifies": 0, "total": 0},
                      "regroupements": 0, "nouvelles_meres": 0, "fusions": 0, "fermetures": 0, "apres": 0, "valeurs": 0,
                      "ids_crees": []}

    # -- aides

    def champ_propose(self, k, v, quoi, interdits=CHAMPS_INTERDITS):
        """Une valeur proposée, contrôlée comme le panneau la contrôlerait ; `Erreur` sinon."""
        val = _propre(v)
        if k in interdits:
            raise Erreur("%s : le champ %s ne se pose pas par l'audit" % (quoi, k))
        if k not in CLES_PANNEAU and k not in self.declarees:
            raise Erreur("%s : clé inconnue %s (ni de la grammaire, ni déclarée dans roadmap.json)" % (quoi, k))
        if k in ("due", "relance", "ouvert"):
            try:
                datetime.date.fromisoformat(val)
                assert im.DATE.match(val)
            except (ValueError, AssertionError):
                raise Erreur("%s : date invalide %s:%r (AAAA-MM-JJ)" % (quoi, k, val))
        if k == "prio" and val not in ("1", "2", "3"):
            raise Erreur("%s : prio vaut 1, 2 ou 3, pas %r" % (quoi, val))
        if not val:
            raise Erreur("%s : valeur vide pour %s" % (quoi, k))
        return val

    def champs_proposes(self, champs, quoi):
        return {k: self.champ_propose(k, v, quoi) for k, v in (champs or {}).items()}

    def tache(self, ref, quoi):
        ref = str(ref)
        t = self.cles.get(ref) or self.taches.get(ref)
        if t is None:
            raise Erreur("%s : tâche #%s inconnue dans ROADMAP.md (ouverte)" % (quoi, ref))
        if getattr(t, "retiree", False):
            raise Erreur("%s : #%s est déjà fusionnée ou fermée par cet audit : vise la tâche gardée" % (quoi, t.id))
        return t

    def libre(self, t, quoi):
        if t.get("qui") and t.get("branche"):
            raise Erreur("%s : #%s est prise par une session (qui:%s) : on n'y touche pas" % (quoi, t.id, t.get("qui")))

    def numero(self, cle):
        if not cle or cle in self.cles or cle.isdigit():
            raise Erreur("clé de tâche nouvelle absente, en double ou numérique : %r" % cle)
        i = str(self.prochain)
        self.prochain += 1
        self.bilan["ids_crees"].append(i)
        return i

    def completer(self, champs, mere, quoi):
        """Les champs exigés qui manquent, pris à la mère (`après:` à `-`) ; refus s'il en manque encore."""
        for k in self.requis:
            if k in champs or k == "id":
                continue
            v = "-" if k == "après" else (mere.get(k) if mere else None)
            if not v:
                raise Erreur("%s : champ exigé %s sans valeur (ni proposée ni à hériter)" % (quoi, k))
            champs[k] = v

    # -- opérations

    def deux_niveaux(self, mere, quoi):
        """#125 : deux niveaux au plus ; une tâche qui a déjà un parent ne reçoit pas d'enfants."""
        p = (mere.get("parent") or "-").lstrip("#")
        if p != "-":
            raise Erreur("%s : #%s est déjà l'enfant de #%s, ses enfants feraient un troisième niveau "
                         "(deux niveaux au plus : propose-les en sœurs sous #%s)" % (quoi, mere.id, p, p))

    def decouper(self, d):
        mere = self.tache(d.get("id"), "découpage")
        quoi = "découpage de #%s" % mere.id
        self.libre(mere, quoi)
        self.deux_niveaux(mere, quoi)
        frags = fragments(mere.libelle)
        avant_mere = mere.libelle + " " + mere.note
        m = d.get("mere") or {}
        if m.get("libelle"):
            mere.libelle = _propre(m["libelle"])
            mere.touche = True
        if "note" in m and m["note"] is not None:
            mere.note = _propre(m["note"])
            mere.touche = True
        for k, v in self.champs_proposes(m.get("champs"), quoi).items():
            mere.set(k, v)
        cibles = {}
        for n in d.get("fragments_mere") or []:
            cibles.setdefault(n, []).append(mere)
        enfants = []
        for e in d.get("enfants") or []:
            champs = self.champs_proposes(e.get("champs"), quoi)
            champs.update({"ouvert": mere.get("ouvert") or self.jour, "parent": mere.id})
            for k in self.heritage:
                if k not in champs and mere.get(k):
                    champs[k] = mere.get(k)
            self.completer(champs, mere, quoi)
            champs["id"] = self.numero(e.get("cle"))
            enfant = _Tache(id=champs["id"], libelle=_propre(e.get("libelle")), note=_propre(e.get("note")),
                            axe=mere.axe, champs=_ordonnes(champs))
            enfant.ancre = mere.ligne
            self.cles[e["cle"]] = enfant
            enfants.append(enfant)
            for n in e.get("fragments") or []:
                cibles.setdefault(n, []).append(enfant)
        for n in cibles:
            if not isinstance(n, int) or not 0 <= n < len(frags):
                raise Erreur("%s : fragment %r inexistant (%d fragments)" % (quoi, n, len(frags)))
        for n, frag in enumerate(frags):
            if n not in cibles:
                raise Erreur("%s : fragment %d sans cible : « %s »" % (quoi, n, frag[:80]))
            if len(cibles[n]) > 1:
                raise Erreur("%s : fragment %d attribué deux fois : « %s »" % (quoi, n, frag[:80]))
            manque = mots(frag) - mots(cibles[n][0].texte()) - mots(mere.texte())
            if manque:
                raise Erreur("%s : fragment %d, mot perdu « %s » : « %s »" % (quoi, n, sorted(manque)[0], frag[:80]))
        manque = mots(avant_mere) - mots(" ".join([mere.texte()] + [e.texte() for e in enfants]))
        if manque:
            raise Erreur("%s : mot perdu « %s » du libellé ou de la note d'origine" % (quoi, sorted(manque)[0]))
        self.apres_ligne.setdefault(mere.ligne, []).extend(enfants)
        self.decoupees.add(mere.id)
        self.bilan["decoupages"] += 1
        self.bilan["enfants"] += len(enfants)
        self.bilan["fragments"]["verifies"] += len(frags)
        self.bilan["fragments"]["total"] += len(frags)

    def regrouper(self, g):
        m = g.get("mere")
        if isinstance(m, dict):
            quoi = "regroupement sous « %s »" % (m.get("libelle") or "")[:40]
            champs = self.champs_proposes(m.get("champs"), quoi)
            champs.setdefault("ouvert", self.jour)
            for k in ("parent", "après"):
                if k in self.requis:
                    champs.setdefault(k, "-")
            self.completer(champs, None, quoi)
            champs["id"] = self.numero(m.get("cle"))
            mere = _Tache(id=champs["id"], libelle=_propre(m.get("libelle")), note=_propre(m.get("note")),
                          axe=_propre(m.get("axe")) or "dossier", champs=_ordonnes(champs))
            self.cles[m["cle"]] = mere
            enfants = [self.tache(e, quoi) for e in g.get("enfants") or []]
            if not enfants:
                raise Erreur("%s : aucun enfant" % quoi)
            ancre = min(t.ligne or t.ancre for t in enfants)
            self.avant_ligne.setdefault(ancre, []).append(mere)
            self.bilan["nouvelles_meres"] += 1
        else:
            mere = self.tache(m, "regroupement")
            enfants = [self.tache(e, "regroupement sous #%s" % mere.id) for e in g.get("enfants") or []]
            # Son parent parmi les enfants regroupés : une boucle, que la relecture nomme.
            if (mere.get("parent") or "-").lstrip("#") not in [e.id for e in enfants]:
                self.deux_niveaux(mere, "regroupement sous #%s" % mere.id)
        for e in enfants:
            if e is mere:
                raise Erreur("regroupement : #%s ne peut pas être sa propre mère" % e.id)
            e.set("parent", mere.id)
        self.bilan["regroupements"] += 1

    def _clore(self, t, suffixe, souci):
        t.retiree = True
        champs = [(k, v) for k, v in t.champs if k != "fait"] + [("fait", self.jour)]
        libelle = t.libelle + suffixe
        self.vers_fait.append(im.rendre_ligne(True, libelle, t.axe, champs, t.note))
        self.bilans.append([self.jour, t.id, t.libelle, souci, "", "", "", ""])

    def fusionner(self, f):
        if str(f.get("part")) in self.cles:
            raise Erreur("fusion : #%s est créée par cet audit, elle ne se fusionne pas" % f.get("part"))
        part = self.tache(f.get("part"), "fusion")
        garde = self.tache(f.get("garde"), "fusion de #%s" % part.id)
        quoi = "fusion de #%s dans #%s" % (part.id, garde.id)
        if part is garde:
            raise Erreur("%s : une tâche ne se fusionne pas dans elle-même" % quoi)
        if part.id in self.decoupees:
            raise Erreur("%s : #%s est déjà découpée" % (quoi, part.id))
        self.libre(part, quoi)
        if f.get("libelle"):
            nouveau = _propre(f["libelle"])
            manque = mots(garde.libelle) - mots(nouveau + " " + garde.note)
            if manque:
                raise Erreur("%s : le nouveau libellé perd « %s »" % (quoi, sorted(manque)[0]))
            garde.libelle, garde.touche = nouveau, True
        dates = [d for d in (garde.get("ouvert"), part.get("ouvert")) if d]
        if dates and min(dates) != garde.get("ouvert"):
            garde.set("ouvert", min(dates))
        self._clore(part, " (fusionnée dans #%s)" % garde.id, "Fusionnée dans #%s par l'audit" % garde.id)
        for t in self.ouvertes():
            for k in ("parent", "après"):
                v = t.get(k)
                if not v or part.id not in [x.strip() for x in v.split(",")]:
                    continue
                nums = []
                for x in v.split(","):
                    x = garde.id if x.strip() == part.id else x.strip()
                    if x not in nums and x != t.id:
                        nums.append(x)
                t.set(k, ",".join(nums) or "-")
        self.gardes.add(garde.id)
        self.bilan["fusions"] += 1

    def fermer(self, f):
        t = self.tache(f.get("id"), "fermeture")
        quoi = "fermeture de #%s" % t.id
        if t.id not in (self.r.get("trous") or {}).get("mere_sans_enfant_ouvert", []):
            raise Erreur("%s : seule une mère dont tous les enfants sont faits se ferme par l'audit" % quoi)
        if t.id in self.decoupees:
            raise Erreur("%s : #%s est déjà découpée" % (quoi, t.id))
        if t.id in self.gardes:
            raise Erreur("%s : #%s vient de recevoir une fusion, son travail n'est pas fait" % (quoi, t.id))
        ouverts = [e.id for e in self.ouvertes() if e is not t and e.get("parent") == t.id]
        if ouverts:
            raise Erreur("%s : #%s a un enfant ouvert (#%s)" % (quoi, t.id, ouverts[0]))
        self.libre(t, quoi)
        self._clore(t, "", "Close par l'audit : enfants tous faits")
        self.bilan["fermetures"] += 1

    def dependre(self, a):
        t = self.tache(a.get("id"), "dépendance")
        nums = [x.strip() for x in (t.get("après") or "-").split(",") if x.strip() not in ("-", "")]
        for ref in a.get("apres") or []:
            n = self.tache(ref, "dépendance de #%s" % t.id).id
            if n == t.id:
                raise Erreur("dépendance : #%s ne peut pas venir après elle-même" % t.id)
            if n not in nums:
                nums.append(n)
        t.set("après", ",".join(nums) or "-")
        self.bilan["apres"] += 1

    def valoir(self, v):
        t = self.tache(v.get("id"), "valeur")
        k = v.get("champ")
        quoi = "valeur %s de #%s" % (k, t.id)
        if k not in VALEURS_PERMISES:
            raise Erreur("%s : seuls %s se posent par l'audit" % (quoi, ", ".join(VALEURS_PERMISES)))
        val = self.champ_propose(k, v.get("valeur"), quoi, interdits=set())
        if k == "parent" and val != "-":
            if val in self.ids_fait:
                pass  # une mère close : permis, la tâche existe
            else:
                val = self.tache(val, quoi).id
        t.set(k, val)
        self.bilan["valeurs"] += 1

    def ouvertes(self):
        nouvelles = [e for l in list(self.apres_ligne.values()) + list(self.avant_ligne.values()) for e in l]
        return [t for t in list(self.taches.values()) + nouvelles if not getattr(t, "retiree", False)]

    def boucles(self):
        apres = {t.id: [x.strip() for x in (t.get("après") or "-").split(",") if x.strip() not in ("-", "")]
                 for t in self.ouvertes()}
        etat = {}

        def visiter(n, chemin):
            if etat.get(n) == 1:
                raise Erreur("boucle de dépendances : %s" % " → ".join("#" + x for x in chemin + [n]))
            if etat.get(n) == 2 or n not in apres:
                return
            etat[n] = 1
            for m in apres[n]:
                visiter(m, chemin + [n])
            etat[n] = 2

        for n in sorted(apres):
            visiter(n, [])
        parents = {t.id: t.get("parent") for t in self.ouvertes()}
        for n in sorted(parents):
            vus, x = [n], parents[n]
            while x and x != "-" and x in parents:
                if x in vus:
                    raise Erreur("boucle de parents : %s" % " → ".join("#" + y for y in vus + [x]))
                vus.append(x)
                x = parents[x]

    # -- rendu et contrôles

    def rendre_ouvert(self):
        sortie = []
        for n, ligne in enumerate(self.lignes, 1):
            t = self.par_ligne.get(n)
            sortie.extend(m.rendre() for m in self.avant_ligne.get(n, []))
            if t is None:
                sortie.append(ligne)
            elif not getattr(t, "retiree", False):
                sortie.append(t.rendre())
            sortie.extend(e.rendre() for e in self.apres_ligne.get(n, []))
        return "\n".join(sortie)

    def rendre_fait(self):
        if not self.vers_fait:
            return self.texte_f
        if self.texte_f is None:
            return "# Roadmap : fait\n\n## Fait\n\n" + "\n".join(self.vers_fait) + "\n"
        lignes = self.texte_f.split("\n")
        h = next((i for i, l in enumerate(lignes) if l.strip() == "## Fait"), None)
        if h is None:
            return self.texte_f.rstrip("\n") + "\n\n## Fait\n\n" + "\n".join(self.vers_fait) + "\n"
        at = h + 2 if h + 1 < len(lignes) and lignes[h + 1].strip() == "" else h + 1
        return "\n".join(lignes[:at] + self.vers_fait + lignes[at:])

    def rendre_bilans(self, chemin):
        texte = _lire_fichier(chemin)
        if texte is None or not self.bilans:
            return texte
        sortie = io.StringIO()
        csv.writer(sortie, lineterminator="\n").writerows(self.bilans)
        return texte + ("" if texte.endswith("\n") or not texte else "\n") + sortie.getvalue()

    def controler(self, apres_o, apres_f):
        comptes = {}
        b = self.bilan
        attendu = {FICHIER_OUVERT: ("ouvertes", b["enfants"] + b["nouvelles_meres"] - b["fusions"] - b["fermetures"]),
                   FICHIER_FAIT: ("closes", b["fusions"] + b["fermetures"])}
        for nom, avant, apres in ((FICHIER_OUVERT, self.texte_o, apres_o), (FICHIER_FAIT, self.texte_f or "", apres_f)):
            ca, cp = im._comptes(avant), im._comptes(apres)
            comptes[nom] = {"avant": ca, "apres": cp}
            cle, delta = attendu[nom]
            autre = "closes" if cle == "ouvertes" else "ouvertes"
            if cp[cle] != ca[cle] + delta or cp[autre] != ca[autre]:
                raise Erreur("%s : %d %s attendues, %d après : une ligne se perdrait"
                             % (nom, ca[cle] + delta, cle, cp[cle]))
        # Les libellés qui ne sont ni découpés, ni fusionnés, ni fermés restent identiques.
        touches = {t.origine for t in self.taches.values() if t.touche or getattr(t, "retiree", False)}
        gardes = sorted(t["libelle"] for t in im.lire_checklist(self.texte_o)[0] if t["libelle"] not in touches)
        apres_lib = [t["libelle"] for t in im.lire_checklist(apres_o)[0]]
        for lib in gardes:
            if lib not in apres_lib:
                raise Erreur("%s : libellé perdu ou changé : « %s »" % (FICHIER_OUVERT, lib[:80]))
        ecarts = im.ecarts_ids(apres_o, apres_f, exiger=True)
        if ecarts:
            raise Erreur("numérotation : %s" % " ; ".join(ecarts))
        for t in im.lire_checklist(apres_o)[0] + im.lire_checklist(apres_f)[0]:
            if not t["meta"]:
                raise Erreur("ligne hors grammaire après l'audit : %s" % t["brut"][:80])
        # Une référence déjà cassée avant l'audit est un trou du relevé ; l'audit n'en casse aucune.
        cassees = _references_cassees(apres_o, apres_f) - _references_cassees(self.texte_o, self.texte_f or "")
        if cassees:
            i, k, v = sorted(cassees)[0]
            raise Erreur("#%s : %s:%s ne mène à aucune tâche" % (i, k, v))
        self.bilan["comptes"] = comptes


LISTES = {"decoupages", "regroupements", "fusions", "fermetures", "apres", "valeurs", "heritage",
          "decoupages.enfants", "decoupages.fragments_mere", "decoupages.enfants.fragments",
          "regroupements.enfants", "apres.apres"}
DICOS = {"decoupages.mere", "decoupages.mere.champs", "decoupages.enfants.champs", "regroupements.mere.champs"}


def _verifier_schema(props):
    def types(obj, niveau):
        for k, v in obj.items():
            sous = "%s.%s" % (niveau, k) if niveau else k
            if sous in LISTES and not isinstance(v, list):
                raise Erreur("propositions : %s doit être une liste, pas %r" % (sous, v))
            if sous in DICOS and not isinstance(v, dict):
                raise Erreur("propositions : %s doit être un objet, pas %r" % (sous, v))
            if sous.endswith("fragments") or sous == "decoupages.fragments_mere":
                if not all(isinstance(n, int) and not isinstance(n, bool) for n in v):
                    raise Erreur("propositions : %s doit lister des numéros de fragment" % sous)
            if sous.endswith(".champs"):
                types(v, sous)

    def voir(obj, niveau):
        if not isinstance(obj, dict):
            if niveau:
                raise Erreur("propositions : un élément de %s doit être un objet, pas %r" % (niveau, obj))
            raise Erreur("propositions : un objet JSON attendu")
        types(obj, niveau)
        inconnues = set(obj) - SCHEMA[niveau]
        if inconnues:
            raise Erreur("propositions : clé inconnue %s%s (admises : %s)" % (
                ", ".join(sorted(inconnues)), " dans %s" % niveau if niveau else "", ", ".join(sorted(SCHEMA[niveau]))))
        for k, v in obj.items():
            sous = "%s.%s" % (niveau, k) if niveau else k
            if sous in SCHEMA and not (sous == "regroupements.mere" and not isinstance(v, dict)):
                for x in (v if isinstance(v, list) else [v]):
                    voir(x, sous)

    voir(props, "")


def _references_cassees(*textes):
    """Les (id, clé, numéro) dont `parent:` ou `après:` ne mène à aucune tâche des fichiers donnés."""
    lues = [t for texte in textes for t in im.lire_checklist(texte)[0]]
    ids = {im.champ(t, "id") for t in lues}
    return {(im.champ(t, "id"), k, v.strip()) for t in lues for k in ("parent", "après")
            for v in (im.champ(t, k) or "-").split(",") if v.strip() not in ("-", "") and v.strip() not in ids}


def preparer(releve, props):
    """Les fichiers préparés ({chemin: texte}) et le bilan ; `Erreur` au premier écart, rien d'écrit."""
    rdir = os.path.dirname(releve["roadmap"])
    if empreinte(rdir) != releve.get("empreinte"):
        raise Erreur("la roadmap a changé depuis le relevé : relance le relevé, puis refais les propositions")
    _verifier_schema(props)
    prep = _Preparation(releve, props)
    for d in props.get("decoupages") or []:
        prep.decouper(d)
    for g in props.get("regroupements") or []:
        prep.regrouper(g)
    for f in props.get("fusions") or []:
        prep.fusionner(f)
    for f in props.get("fermetures") or []:
        prep.fermer(f)
    for a in props.get("apres") or []:
        prep.dependre(a)
    for v in props.get("valeurs") or []:
        prep.valoir(v)
    prep.boucles()
    apres_o = prep.rendre_ouvert()
    apres_f = prep.rendre_fait()
    prep.controler(apres_o, apres_f or "")
    fichiers = {releve["roadmap"]: apres_o}
    if apres_f is not None:
        fichiers[releve["fait"]] = apres_f
    chemin_bilans = os.path.join(rdir, "ROADMAP-bilans.csv")
    bilans = prep.rendre_bilans(chemin_bilans)
    if bilans is not None:
        fichiers[chemin_bilans] = bilans
    return {p: t for p, t in fichiers.items() if _lire_fichier(p) != t}, prep.bilan


def _sauvegarder(rdir, maintenant, chemins):
    base = os.path.join(rdir, "sauvegarde-audit-" + maintenant.strftime("%Y-%m-%d-%H%M%S"))
    sauvegarde, n = base, 1
    while os.path.exists(sauvegarde):
        n += 1
        sauvegarde = "%s-%d" % (base, n)
    os.makedirs(sauvegarde)
    for p in sorted(chemins):
        if os.path.isfile(p):
            shutil.copy2(p, os.path.join(sauvegarde, os.path.basename(p)))
    return sauvegarde


def appliquer(dossier, chemin_props, maintenant=None):
    """Prépare, vérifie, sauvegarde puis écrit les propositions validées ; affiche et rend le bilan."""
    maintenant = maintenant or datetime.datetime.now()
    props, rel = _charger_props(chemin_props)
    _, rdir, _ = situer(dossier)
    if os.path.realpath(os.path.dirname(rel["roadmap"])) != os.path.realpath(rdir):
        raise Erreur("le relevé porte sur %s, pas sur la roadmap de %s" % (rel["roadmap"], dossier))
    fichiers, bilan = preparer(rel, props)
    bilan["sauvegarde"] = None
    if fichiers:
        bilan["sauvegarde"] = _sauvegarder(rdir, maintenant, fichiers)
        im._ecrire_tout(fichiers)
    afficher_bilan(bilan)
    return bilan


def afficher_bilan(bilan):
    print("Bilan de l'audit :")
    print("  Paquets découpés : %d, sous-tâches créées : %d ; fragments retrouvés : %d sur %d" % (
        bilan["decoupages"], bilan["enfants"], bilan["fragments"]["verifies"], bilan["fragments"]["total"]))
    print("  Regroupements : %d ; fusions : %d ; fermetures : %d ; dépendances : %d ; valeurs : %d" % (
        bilan["regroupements"], bilan["fusions"], bilan["fermetures"], bilan["apres"], bilan["valeurs"]))
    for nom, c in bilan.get("comptes", {}).items():
        print("  %s : %d ouvertes, %d closes avant ; %d ouvertes, %d closes après" % (
            nom, c["avant"]["ouvertes"], c["avant"]["closes"], c["apres"]["ouvertes"], c["apres"]["closes"]))
    if bilan["ids_crees"]:
        print("  Numéros créés : #%s" % ", #".join(bilan["ids_crees"]))
    print("  Numéros uniques, parents et dépendances valides, chaque ligne dans la grammaire.")
    print("Sauvegarde : %s" % bilan["sauvegarde"] if bilan["sauvegarde"] else "Rien à changer.")


def main(argv=None):
    import argparse
    p = argparse.ArgumentParser(prog="audit.py", description="Audit du contenu de la roadmap (#103).")
    sous = p.add_subparsers(dest="commande", required=True)
    r = sous.add_parser("releve", help="relevé du contenu, en JSON, sans rien écrire")
    r.add_argument("dossier")
    a = sous.add_parser("appliquer", help="applique les propositions validées, tout ou rien")
    a.add_argument("dossier")
    a.add_argument("--propositions", required=True)
    for s in (r, a):
        s.add_argument("--jour", help="AAAA-MM-JJ (aujourd'hui par défaut)")
        s.add_argument("--perso", default="~/.claude/roadmap-perso.json", help=argparse.SUPPRESS)
    args = p.parse_args(argv)
    try:
        if args.commande == "releve":
            print(json.dumps(releve(args.dossier, args.jour, args.perso), ensure_ascii=False, indent=2))
        else:
            maintenant = datetime.datetime.now()
            if args.jour:
                maintenant = datetime.datetime.combine(datetime.date.fromisoformat(args.jour), maintenant.time())
            appliquer(args.dossier, args.propositions, maintenant)
    except Erreur as e:
        print("Refusé : %s" % e, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
