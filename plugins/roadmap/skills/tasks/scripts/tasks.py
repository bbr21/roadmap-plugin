#!/usr/bin/env python3
"""Tenir la roadmap au quotidien (#158) : le contexte (règles, déclarations, prochain numéro), le
rapprochement d'une action avec les tâches du même sujet, puis l'écriture des opérations validées
(ajouter, compléter, redater, cocher sur preuve, abandonner, mettre en pause), essai à blanc d'abord, tout ou rien.

python3 tasks.py context FOLDER [--day YYYY-MM-DD] > context.json
python3 tasks.py match FOLDER --text "…" [--text "…"]
python3 tasks.py write FOLDER --operations operations.json [--apply] [--json]

`write` finit par le compte rendu (#232), en lignes de journal depuis #261 : une puce par tâche, son glyphe devant.

Python 3.9 et plus, bibliothèque standard seulement. Hérite du moteur d'écriture de l'audit
(`audit._Preparation`) et lit la grammaire par l'import de la skill onboarding : les trois skills
lisent et écrivent une ligne de la même façon.
"""

import csv
import datetime
import io
import json
import os
import re
import sys
import unicodedata

ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ICI, "..", "..", "onboarding", "scripts"))
sys.path.insert(0, os.path.join(ICI, "..", "..", "audit", "scripts"))
import audit  # noqa: E402
import importer as im  # noqa: E402
import onboarding as ob  # noqa: E402

Erreur = im.Erreur

# Les sections de ROADMAP.md qui ne reçoivent pas de tâche.
SECTIONS_FERMEES = {"Grammaire d'une ligne", "Cap"}
# Part des mots d'une action retrouvés dans une tâche à partir de laquelle elle couvre le même sujet.
SEUIL = 0.5

# Le contrat d'operations.json, en anglais comme la skill (#158) ; le code garde le vocabulaire de l'audit.
OPS = {
    "add": {"op", "key", "label", "axis", "section", "parent", "note", "fields"},
    "update": {"op", "id", "fields"},
    "reschedule": {"op", "id", "due"},
    "done": {"op", "id", "date", "proof", "bilan"},
    "drop": {"op", "id", "reason", "bilan"},
    "pause": {"op", "id", "until", "reason"},
    "handoff": {"op", "id", "date", "proof", "delivered", "key", "label", "waiting", "src", "fields", "bilan"},
}
# Le bilan d'une clôture (#262), au contrat de `cowork.py roadmap close --bilan-b64` : ses colonnes, les
# valeurs admises du journal par défaut, la borne d'une ligne de conclusion.
BILAN_COLS = ("date", "id", "fait", "souci", "ressenti", "cause", "corrections", "note")
BILAN_CLES = {"fait", "souci", "ressenti", "cause", "corrections", "note"}
JOURNAL_DEFAUT = "ROADMAP-bilans.csv"
RESSENTIS = ["fluide", "accroché", "bloqué"]
CAUSES = ["aucune", "spec-floue", "attente-tiers", "bug-outil", "refait", "périmètre-élargi", "autre"]
CONCLUSION_MAX = 140
# Un dossier Cowork dont `cowork.json` confie la roadmap au plugin (`"roadmap": "plugin-roadmap"`, #262).
COWORK_PLUGIN = "plugin-roadmap"
# La section où part une tâche en pause (#159) : sa date de reprise la range, aucune clé nouvelle.
SECTION_PAUSE = "Plus tard"
# Ce que `fields` ne pose jamais : le numéro, la session, la clôture ; `parent` d'un ajout passe par `parent`.
INTERDITS_AJOUT = {"id", "qui", "branche", "verrou", "fait", "parent"}
INTERDITS_COMPLETER = {"id", "qui", "branche", "verrou", "fait"}
# La suite d'une clôture partielle (#245) : l'opération pose elle-même son parent, son ordre, le tiers,
# la demande et la fiche.
INTERDITS_SUITE = INTERDITS_AJOUT | {"après", "attend", "src", "fiche"}
# Les questions qui attendent la personne (#232), au format de l'audit (#159) : leur genre, et sa raison dite.
RAISONS = {"conflict": "conflit", "undated": "date manquante", "late": "en retard", "partial_proof": "preuve partielle",
           "rhythm": "rythme", "reopen": "réouverture", "prio_on_child": "priorité sur un enfant", "structure": "structure"}
# Le libellé d'une tâche dans le compte rendu : coupé au mot au-delà.
LIBELLE_COURT = 60
# Une communication (#242) : un segment du chemin qui la nomme (`emails/`, `message-martial.md`), ou des
# en-têtes d'email ; partie quand son « Statut : » dit « envoyé ». La même règle que `commState` du panneau.
MOTS_COMM = {"email", "emails", "mail", "mails", "message", "messages", "msg", "invitation", "invitations", "invite",
             "invites", "courrier", "courriers", "lettre", "lettres", "letter", "letters", "slack", "sms", "dm"}
ETIQUETTES = {"a": "to", "to": "to", "destinataire": "to", "destinataires": "to", "objet": "subject",
              "sujet": "subject", "subject": "subject", "statut": "status", "status": "status"}
EN_TETE = re.compile(r"^\s*(?:\*\*|__)?([^\W\d_][^\W\d_ -]{0,24}?)\s*:\s*(?:\*\*|__)?\s*(.*)$")
NON_PARTI = re.compile(r"\b(?:non|pas|not)\s+(?:encore\s+|yet\s+)?(?:envoye|sent)\b|\bunsent\b|\bbrouillon\b|\bdraft\b")
PARTI = re.compile(r"\b(?:envoye|sent)\b")
LISIBLE = (".md", ".markdown", ".txt")
LISIBLE_MAX = 262144


def _lire(chemin):
    return audit._lire_fichier(chemin) or ""


def _sans_parent(t):
    return (t.get("parent") or "-").lstrip("#")


def qui_attend(attend):
    """Qui une tâche attend, sans la précision entre parenthèses : « Jason (devis) » → « Jason »."""
    return re.sub(r"\s*\([^)]*\)?", "", attend or "").strip()


def est_un_tiers(attend, me):
    """Un tiers (#245) : une personne ou une organisation qui n'est ni un des noms `me`, ni une tâche."""
    qui = qui_attend(attend)
    if qui in ("", "-") or re.match(r"^(id:|#)\d+$", qui):
        return False
    return audit._sans_accents(qui).lower() not in {audit._sans_accents(m).lower() for m in me}


def _jj_mm(iso):
    return "%s/%s" % (iso[8:10], iso[5:7])


def _court(libelle, n=LIBELLE_COURT):
    if len(libelle) <= n:
        return libelle
    return libelle[:n].rsplit(" ", 1)[0].rstrip(" ,;:") + "…"


def _cowork(dossier):
    """Le `cowork.json` du dossier, ou None."""
    try:
        with open(os.path.join(dossier, "cowork.json"), encoding="utf-8") as f:
            cfg = json.load(f)
        return cfg if isinstance(cfg, dict) else None
    except (OSError, ValueError):
        return None


def journal_de_bilan(dossier, rdir):
    """Le journal des bilans (#262) : `bilan.log` de `cowork.json`, à côté de lui, et les valeurs
    admises de ses colonnes ; sinon `ROADMAP-bilans.csv` à côté de la roadmap. `exige` : un dossier
    Cowork qui confie sa roadmap au plugin demande un bilan à chaque clôture, comme `cowork.py`."""
    cfg = _cowork(dossier) or {}
    out = {"chemin": os.path.join(rdir, JOURNAL_DEFAUT), "ressentis": RESSENTIS, "causes": CAUSES,
           "exige": cfg.get("roadmap") == COWORK_PLUGIN}
    b = cfg.get("bilan")
    if isinstance(b, dict) and isinstance(b.get("log"), str) and b["log"].strip():
        log = b["log"].strip()
        racine = os.path.realpath(dossier)
        chemin = os.path.realpath(os.path.join(racine, log))
        if os.path.isabs(log) or ".." in log.replace("\\", "/").split("/") or not chemin.startswith(racine + os.sep):
            raise Erreur("le journal des bilans « %s » de cowork.json sort du dossier : rien ne s'écrit" % log)
        out["chemin"] = os.path.join(dossier, log)
        spec = (cfg.get("logs") or {}).get(b["log"]) if isinstance(cfg.get("logs"), dict) else None
        colonnes = spec.get("columns") if isinstance(spec, dict) else None
        for cle, nom in (("ressentis", "ressenti"), ("causes", "cause")):
            enum = next((c.get("enum") for c in colonnes or [] if isinstance(c, dict) and c.get("name") == nom), None)
            if isinstance(enum, list) and enum:
                out[cle] = [str(x) for x in enum]
    return out


# ---------------------------------------------------------------- envoi d'une communication (#242)


def _plie(texte):
    return "".join(c for c in unicodedata.normalize("NFD", texte) if not unicodedata.combining(c)).lower().strip()


def _en_tetes(texte):
    """Les en-têtes d'un brouillon (#236) : front matter, ou lignes « Étiquette : valeur » en tête."""
    lignes = texte.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    vus = {}
    i = 0
    while i < len(lignes) and not lignes[i].strip():
        i += 1
    if i < len(lignes) and lignes[i].strip() == "---":
        fin = next((k for k in range(i + 1, len(lignes)) if lignes[k].strip() == "---"), None)
        bloc = lignes[i + 1:fin] if fin is not None else []
        motif = re.compile(r"^\s*([^\W\d_][^\W\d_ -]*?)\s*:\s*(.*)$")
    else:
        bloc, motif = [], EN_TETE
        for l in lignes[i:]:
            if l.strip() and not EN_TETE.match(l):
                break
            bloc.append(l)
    for l in bloc:
        m = motif.match(l)
        cle = ETIQUETTES.get(_plie(m.group(1))) if m else None
        valeur = m.group(2).strip().strip("\"'") if m else ""
        if cle and valeur:
            vus[cle] = valeur
    return vus


def etat_envoi(ecrit, texte, existe):
    """`none` (pas une communication, ou illisible), `unsent` ou `sent` : la règle de `commState`."""
    nomme = any(w in MOTS_COMM for w in re.split(r"[^a-z0-9]+", _plie("/".join(ecrit.split("/")[-2:]))))
    if texte is None:
        return "unsent" if nomme and not existe else "none"
    vus = _en_tetes(texte)
    if not nomme and "to" not in vus and "subject" not in vus:
        return "none"
    statut = _plie(vus.get("status", ""))
    return "sent" if statut and not NON_PARTI.search(statut) and PARTI.search(statut) else "unsent"


def envois_en_attente(livrables, bases):
    """Les livrables (`livrable:` d'une ligne) qui sont des communications pas encore parties."""
    attente = []
    for ecrit in [x.strip() for x in (livrables or "").split(",") if x.strip()]:
        texte, existe = None, False
        for base in ([""] if os.path.isabs(ecrit) else bases):
            chemin = os.path.join(base, ecrit)
            if os.path.isfile(chemin):
                existe = True
                if chemin.lower().endswith(LISIBLE) and os.path.getsize(chemin) <= LISIBLE_MAX:
                    texte = _lire(chemin)
                break
        if etat_envoi(ecrit, texte, existe) == "unsent":
            attente.append(ecrit)
    return attente


# ---------------------------------------------------------------- contexte et rapprochement


def contexte(dossier, jour=None, perso="~/.claude/roadmap-perso.json"):
    """Le relevé de l'audit, plus ce qu'il faut pour tenir la roadmap : les déclarations du projet,
    le prochain numéro, les axes, les sections ouvertes, la date de chaque parent (celle de son
    prochain enfant ouvert), les valeurs admises des clés déclarées et les tâches closes."""
    c = audit.releve(dossier, jour, perso)
    texte_o, texte_f = _lire(c["roadmap"]), _lire(c["fait"])
    ids = [int(im.champ(t, "id")) for texte in (texte_o, texte_f)
           for t in im.lire_checklist(texte)[0] if (im.champ(t, "id") or "").isdigit()]
    parents = {}
    for t in c["taches"]:
        if t["parent"]:
            due = t["champs"].get("due")
            p = parents.setdefault(t["parent"], {"date": None})
            if due and (p["date"] is None or due < p["date"]):
                p["date"] = due
    cfg = audit._cfg(c["dossier"])
    cles = cfg.get("cles") if isinstance(cfg.get("cles"), dict) else {}
    closes = [t for t in im.lire_checklist(texte_o)[0] if t["fait"]] + im.lire_checklist(texte_f)[0]
    me_projet = cfg.get("me")
    me_projet = [me_projet] if isinstance(me_projet, str) else [m for m in me_projet or [] if isinstance(m, str)]
    c.update({
        "me": list(dict.fromkeys(list(c.get("me") or []) + me_projet)),
        "prochain_id": max(ids or [0]) + 1,
        "axes": ob._axes_declares(texte_o),
        "sections": [l[3:].strip() for l in texte_o.split("\n")
                     if l.startswith("## ") and l[3:].strip() not in SECTIONS_FERMEES],
        "parents": parents,
        "cles_valeurs": {k: v for k, v in cles.items() if isinstance(v, list)},
        "closes": [{"id": im.champ(t, "id"), "libelle": t["libelle"], "fait": im.champ(t, "fait")} for t in closes],
        "declarations": ob.declarations(c["dossier"], cfg),
    })
    return c


def rapprocher(ctx, texte, n=5):
    """Les tâches ouvertes et closes du même sujet qu'une action, par la part de ses mots qu'elles
    portent (celle d'un enfant compte le libellé de son parent), et le cas probable. Claude tranche."""
    cible = audit.mots(texte)
    par_id = {t["id"]: t for t in ctx["taches"]}

    def score(libelle):
        return round(len(cible & audit.mots(libelle)) / len(cible), 2) if cible else 0.0

    ouvertes = []
    for t in ctx["taches"]:
        p = t["parent"]
        role = "enfant" if p else ("parent" if t["enfants"] else "seule")
        s = score(t["libelle"] + " " + (par_id[p]["libelle"] if p in par_id else ""))
        if s > 0:
            ouvertes.append({"id": t["id"], "libelle": t["libelle"], "role": role, "parent": p, "score": s,
                             "due": t["champs"].get("due")})
    closes = [dict(t, score=score(t["libelle"])) for t in ctx.get("closes") or []]
    closes = [t for t in closes if t["score"] > 0]
    for liste in (ouvertes, closes):
        liste.sort(key=lambda t: (-t["score"], int(t["id"]) if (t["id"] or "").isdigit() else 0))
    if ouvertes and ouvertes[0]["score"] >= SEUIL:
        cas = "couverte_ou_a_etoffer"
    elif closes and closes[0]["score"] >= SEUIL:
        cas = "deja_faite"
    else:
        cas = "nouvelle"
    return {"texte": texte, "ouvertes": ouvertes[:n], "closes": closes[:n], "cas_probable": cas}


# ---------------------------------------------------------------- écrire


def _date(v, quoi, cle):
    val = audit._propre(v)
    try:
        datetime.date.fromisoformat(val)
        assert im.DATE.match(val)
    except (ValueError, AssertionError):
        raise Erreur("%s : date invalide %s:%r (AAAA-MM-JJ)" % (quoi, cle, val))
    return val


def _date_fait(v, quoi, cle):
    """Une date de clôture : AAAA-MM-JJ, ou AAAA-MM-JJ HH:MM (#262)."""
    val = audit._propre(v)
    if im.DATE_FAIT.match(val) and im.DATE.match(val[:10]):
        try:
            datetime.date.fromisoformat(val[:10])
            return val
        except ValueError:
            pass
    raise Erreur("%s : date invalide %s:%r (AAAA-MM-JJ, ou AAAA-MM-JJ HH:MM)" % (quoi, cle, val))


def _refs(v, quoi):
    if isinstance(v, str):
        v = [x for x in v.split(",") if x.strip() not in ("", "-")]
    if not isinstance(v, list):
        raise Erreur("%s : après est une liste de numéros ou de clés" % quoi)
    return [str(x).strip() for x in v]


class _Tenue(audit._Preparation):
    """La préparation de l'audit, avec les opérations du quotidien et leurs règles (#125, #158)."""

    def __init__(self, ctx, maintenant=None):
        super().__init__(ctx, {})
        self.maintenant = maintenant
        self.journal = journal_de_bilan(ctx["dossier"], os.path.dirname(ctx["roadmap"]))
        self.cles_valeurs = ctx.get("cles_valeurs") or {}
        self.axes = ctx.get("axes") or []
        self.sections = ctx.get("sections") or []
        self.notes = []
        self.tenue = {"ajoutees": [], "completees": [], "redatees": [], "cochees": [], "abandonnees": [],
                      "en_pause": [], "suites": []}
        # Le compte rendu (#232) : une entrée par tâche ajoutée, une par changement d'une tâche ; les
        # clôtures partielles (#245) en une ligne chacune, sous son titre.
        self.compte = {"ajoutees": [], "mises_a_jour": [], "t_attendent": [], "suites": self.tenue["suites"]}
        self.me = ctx.get("me") or []
        self.closes = {c["id"]: c["libelle"] for c in ctx.get("closes") or []}
        self.blanc_apres = set()  # ancres d'une section vide : une ligne vide après les tâches posées
        self.section_de = {t["ligne"]: t["section"] for t in im.lire_checklist(self.texte_o)[0]}

    # -- règles

    def champ_propose(self, k, v, quoi, interdits=audit.CHAMPS_INTERDITS):
        val = super().champ_propose(k, v, quoi, interdits)
        admises = self.cles_valeurs.get(k)
        if admises:
            hors = [x.strip() for x in val.split(",") if x.strip() not in admises]
            if hors:
                raise Erreur("%s : %s:%s hors des valeurs admises (%s)" % (quoi, k, hors[0], ", ".join(admises)))
        return val

    def enfants_ouverts(self, t):
        return [e for e in self.ouvertes() if e is not t and _sans_parent(e) == t.id]

    def poser_apres(self, t, refs, quoi):
        """`après:` entre deux sœurs, ou entre deux tâches sans parent (#125)."""
        nums = []
        for ref in _refs(refs, quoi):
            cible = self.tache(ref, quoi)
            if cible is t:
                raise Erreur("%s : #%s ne peut pas venir après elle-même" % (quoi, t.id))
            if _sans_parent(cible) != _sans_parent(t):
                raise Erreur("%s : après:%s relierait l'enfant d'un sujet à une tâche d'un autre "
                             "(après: relie deux sœurs, ou deux tâches sans parent)" % (quoi, cible.id))
            if cible.id not in nums:
                nums.append(cible.id)
        t.set("après", ",".join(nums) or "-")

    def refuser_prio_enfant(self, t, quoi):
        if _sans_parent(t) != "-" and t.get("prio"):
            raise Erreur("%s : prio se pose sur le parent #%s, jamais sur un enfant" % (quoi, _sans_parent(t)))

    def refuser_sans_envoi(self, t, quoi):
        """#242 : ni clôture ni clôture partielle tant qu'une communication de la tâche n'est pas partie."""
        attente = envois_en_attente(t.get("livrable"), list(dict.fromkeys([self.r.get("dossier") or self.rdir, self.rdir])))
        if attente:
            raise Erreur("%s : %s pas encore parti (%s) : envoie-le d'abord (l'envoi se demande à la personne), puis "
                         "écris en tête du fichier « Statut : envoyé le AAAA-MM-JJ (par où) », la preuve d'envoi"
                         % (quoi, "livrable" if len(attente) == 1 else "livrables", ", ".join(attente)))

    def changer(self, t, change):
        self.compte["mises_a_jour"].append({"id": t.id, "libelle": _court(t.libelle), "change": change})

    # -- opérations

    def ajouter(self, op):
        libelle = audit._propre(op.get("label"))
        quoi = "ajout « %s »" % libelle[:40]
        if not libelle:
            raise Erreur("ajout : libellé vide")
        brut = dict(op.get("fields") or {})
        apres = brut.pop("après", None)
        champs = {k: self.champ_propose(k, v, quoi, INTERDITS_AJOUT) for k, v in brut.items()}
        champs.setdefault("ouvert", self.jour)
        p = op.get("parent")
        mere = None
        if p not in (None, "", "-"):
            p = str(p)
            if p in self.ids_fait:
                raise Erreur("%s : le parent #%s est close ; rouvre-la d'abord (une question)" % (quoi, p))
            mere = self.tache(p, quoi)
            self.deux_niveaux(mere, quoi)
            if "prio" in champs:
                raise Erreur("%s : prio se pose sur le parent #%s, jamais sur un enfant" % (quoi, mere.id))
            champs["parent"] = mere.id
            for k in self.heritage:
                if k not in champs and mere.get(k):
                    champs[k] = mere.get(k)
        elif "parent" in self.requis:
            champs["parent"] = "-"
        axe = audit._propre(op.get("axis")) or (mere.axe if mere else "")
        # Un enfant n'a pas d'axe à lui (#190) : il prend celui de son parent.
        if mere is not None and axe != mere.axe:
            raise Erreur("%s : axe « %s » différent de celui du parent #%s (« %s ») : un enfant prend l'axe de son parent, omets axis"
                         % (quoi, axe, mere.id, mere.axe))
        if not im.AXE.match(axe) or (self.axes and axe not in self.axes):
            raise Erreur("%s : axe « %s » inconnu (axes : %s)" % (quoi, axe, ", ".join(self.axes) or "minuscules, chiffres, tirets"))
        self.completer(champs, mere, quoi)
        champs["id"] = self.numero(op.get("key"))
        t = audit._Tache(id=champs["id"], libelle=libelle, note=audit._propre(op.get("note")), axe=axe,
                         champs=audit._ordonnes(champs))
        self.cles[op["key"]] = t
        if apres is not None:
            self.poser_apres(t, apres, quoi)
        self.placer(t, mere, op.get("section"), quoi)
        self.bilan["enfants"] += 1
        self.tenue["ajoutees"].append(t.id)
        self.compte["ajoutees"].append({"id": t.id, "libelle": _court(libelle), "parent": mere.id if mere else None,
                                        "due": t.get("due")})

    def placer(self, t, mere, section, quoi):
        """Un enfant sous son parent, après ses autres enfants ; une autre tâche au bout de sa section."""
        if mere is not None and mere.ligne is None:
            liste = next(l for l in self.apres_ligne.values() if mere in l)
            i = liste.index(mere) + 1
            while i < len(liste) and _sans_parent(liste[i]) == mere.id:
                i += 1
            liste.insert(i, t)
            return
        if mere is not None:
            ancre = max([e.ligne for e in self.taches.values() if _sans_parent(e) == mere.id and e.ligne]
                        + [mere.ligne])
            self.apres_ligne.setdefault(ancre, []).append(t)
            return
        if not section:
            section = "Prochain" if "Prochain" in self.sections else (self.sections or [""])[0]
        if section not in self.sections:
            raise Erreur("%s : section « %s » inconnue (sections : %s)" % (quoi, section, ", ".join(self.sections)))
        lignes = [n for n, s in self.section_de.items() if s == section]
        if lignes:
            ancre = max(lignes)
        else:
            ancre = next(n for n, l in enumerate(self.lignes, 1) if l.strip() == "## " + section)
            if ancre < len(self.lignes) and self.lignes[ancre].strip() == "":
                ancre += 1
            self.blanc_apres.add(ancre)
        self.apres_ligne.setdefault(ancre, []).append(t)

    def completer_tache(self, op):
        t = self.tache(op.get("id"), "complément")
        quoi = "complément de #%s" % t.id
        self.libre(t, quoi)
        brut = dict(op.get("fields") or {})
        apres = brut.pop("après", None)
        parent = brut.pop("parent", None)
        for k, v in brut.items():
            if v is None:
                # `null` retire une clé facultative (#159 : la `prio:` posée sur un enfant).
                if k in self.requis or k in INTERDITS_COMPLETER:
                    raise Erreur("%s : %s est un champ exigé ou réservé, il ne se retire pas" % (quoi, k))
                t.champs = [(c, x) for c, x in t.champs if c != k]
                t.touche = True
                continue
            t.set(k, self.champ_propose(k, v, quoi, INTERDITS_COMPLETER))
        if parent is not None:
            p = str(parent).lstrip("#")
            if p in ("", "-"):
                t.set("parent", "-")
            else:
                mere = self.tache(p, quoi)
                self.deux_niveaux(mere, quoi)
                if self.enfants_ouverts(t):
                    raise Erreur("%s : #%s a des enfants, elle ne devient pas enfant (deux niveaux au plus)" % (quoi, t.id))
                t.set("parent", mere.id)
                # Rattachée, elle prend l'axe de son parent (#190).
                t.axe = mere.axe
        if apres is not None:
            self.poser_apres(t, apres, quoi)
        self.refuser_prio_enfant(t, quoi)
        self.tenue["completees"].append(t.id)
        dit = ["%s retiré" % k if v is None else "%s:%s" % (k, t.get(k)) for k, v in (op.get("fields") or {}).items()]
        self.changer(t, "complétée : %s" % ", ".join(dit))

    def redater(self, op):
        t = self.tache(op.get("id"), "redate")
        t.set("due", _date(op.get("due"), "redate de #%s" % t.id, "due"))
        self.tenue["redatees"].append(t.id)
        self.changer(t, "redatée au %s" % _jj_mm(t.get("due")))

    def moment(self, date):
        """`fait:` porte l'heure de la clôture (#262) quand elle a lieu le jour même ; une date passée
        reste sans heure inventée."""
        if len(date) == 10 and self.maintenant is not None and date == self.maintenant.date().isoformat():
            return "%s %s" % (date, self.maintenant.strftime("%H:%M"))
        return date

    def bilan_de(self, op, quoi):
        """Le bilan entier d'une clôture (#262), contrôlé comme `cowork.py` ; exigé dans un dossier
        Cowork qui confie sa roadmap au plugin."""
        b = op.get("bilan")
        if b is None:
            if self.journal["exige"]:
                raise Erreur("%s : ce dossier demande un bilan à chaque clôture : bilan {fait, souci, ressenti (%s), "
                             "cause (%s), corrections, note}" % (quoi, "|".join(self.journal["ressentis"]),
                                                                 "|".join(self.journal["causes"])))
            return None
        if not isinstance(b, dict):
            raise Erreur("%s : le bilan est un objet {fait, souci, ressenti, cause, corrections, note}" % quoi)
        inconnues = set(b) - BILAN_CLES
        if inconnues:
            raise Erreur("%s : bilan, clé inconnue %s (admises : %s)" % (quoi, ", ".join(sorted(inconnues)),
                                                                        ", ".join(sorted(BILAN_CLES))))
        r = {k: str(b.get(k) if b.get(k) is not None else "").strip() for k in BILAN_CLES}
        for k, admises in (("ressenti", self.journal["ressentis"]), ("cause", self.journal["causes"])):
            if r[k] not in admises:
                raise Erreur("%s : bilan, %s « %s » hors des valeurs admises (%s)" % (quoi, k, r[k], ", ".join(admises)))
        fluide = r["ressenti"] == "fluide"
        if fluide != (r["cause"] == "aucune"):
            raise Erreur("%s : bilan, ressenti « fluide » va avec cause « aucune », et seulement lui" % quoi)
        for k in ("fait", "souci"):
            if "\n" in r[k] or "\r" in r[k]:
                raise Erreur("%s : bilan, %s tient en une ligne" % (quoi, k))
            if len(r[k]) > CONCLUSION_MAX:
                raise Erreur("%s : bilan, %s fait %d caractères, %d au plus" % (quoi, k, len(r[k]), CONCLUSION_MAX))
        if not r["fait"]:
            raise Erreur("%s : bilan, fait manque (ce qui a été fait, une ligne)" % quoi)
        if not r["souci"] and not fluide:
            raise Erreur("%s : bilan, souci manque : un ressenti %s dit un souci, en une ligne" % (quoi, r["ressenti"]))
        if not r["corrections"].isdigit():
            raise Erreur("%s : bilan, corrections est un nombre entier, 0 ou plus" % quoi)
        if not r["note"]:
            raise Erreur("%s : bilan, note manque (une phrase)" % quoi)
        return r

    def fermer_tache(self, t, date, suffixe, souci, raison="", bilan=None):
        t.retiree = True
        fait = self.moment(date)
        champs = [(k, v) for k, v in t.champs if k not in ("fait", "attend")] + [("fait", fait)]
        note = (t.note + " " + raison).strip() if raison else t.note
        self.vers_fait.append(im.rendre_ligne(True, t.libelle + suffixe, t.axe, champs, note))
        rang = dict(bilan) if bilan else {"fait": t.libelle, "souci": souci}
        rang.update(date=fait[:10], id=t.id)
        self.bilans.append(rang)
        self.bilan["fermetures"] += 1

    def rendre_bilans(self, chemin):
        """Les bilans au bout du journal, rangés par ses colonnes (#262) ; un journal absent ne se crée
        que quand le dossier exige le bilan."""
        texte = audit._lire_fichier(chemin)
        if not self.bilans or (texte is None and not self.journal["exige"]):
            return texte
        texte = texte if texte is not None else ",".join(BILAN_COLS) + "\n"
        entete = next(csv.reader(io.StringIO(texte)), None) or list(BILAN_COLS)
        sortie = io.StringIO()
        csv.writer(sortie, lineterminator="\n").writerows([[r.get(c, "") for c in entete] for r in self.bilans])
        return texte + ("" if texte.endswith("\n") or not texte else "\n") + sortie.getvalue()

    def cocher(self, op):
        t = self.tache(op.get("id"), "clôture")
        quoi = "clôture de #%s" % t.id
        date = _date_fait(op.get("date"), quoi, "date")
        preuve = audit._propre(op.get("proof"))
        if not preuve:
            raise Erreur("%s : la preuve manque (ce qui prouve que c'est fait, et où)" % quoi)
        self.refuser_sans_envoi(t, quoi)
        bilan = self.bilan_de(op, quoi)
        ouverts = self.enfants_ouverts(t)
        if ouverts:
            raise Erreur("%s : #%s a un enfant ouvert (#%s)" % (quoi, t.id, ouverts[0].id))
        if t.get("tous"):
            raise Erreur("%s : tâche récurrente (tous:%s) : le bouton « Marquer faite » du panneau la reconduit"
                         % (quoi, t.get("tous")))
        self.fermer_tache(t, date, "", "Faite : %s" % preuve, bilan=bilan)
        self.tenue["cochees"].append(t.id)
        self.changer(t, "cochée le %s : %s" % (_jj_mm(date), preuve))
        p = _sans_parent(t)
        mere = self.taches.get(p) or self.cles.get(p)
        if mere is None or getattr(mere, "retiree", False) or self.enfants_ouverts(mere):
            return
        if mere.get("tous"):
            self.notes.append("#%s, récurrente (tous:%s), reste ouverte : ajoute les étapes de la période suivante"
                              % (mere.id, mere.get("tous")))
            self.changer(mere, "reste ouverte (récurrente, tous:%s) : ajouter les étapes de la période suivante"
                         % mere.get("tous"))
            return
        dernier = "Close avec son dernier enfant #%s" % t.id
        self.fermer_tache(mere, date, "", dernier, bilan=dict(bilan, fait=dernier) if bilan else None)
        self.tenue["cochees"].append(mere.id)
        self.changer(mere, "close avec son dernier enfant #%s, le %s" % (t.id, _jj_mm(date)))

    def passer_la_main(self, op):
        """La clôture partielle (#245) : #A close sur ce qui est fait, sa suite #B ouverte chez le tiers
        attendu (même parent, après:A, attend:, src:, même fiche:), à la place de #A, et les renvois
        des lignes ouvertes à #A passés à #B ; jamais dans les lignes closes."""
        t = self.tache(op.get("id"), "clôture partielle")
        quoi = "clôture partielle de #%s" % t.id
        date = _date_fait(op.get("date"), quoi, "date")
        dits = {k: audit._propre(op.get(k)) for k in ("proof", "delivered", "label", "src", "waiting")}
        for k, ce in (("proof", "la preuve (le message parti au tiers, et où)"), ("delivered", "ce qui a été livré"),
                      ("label", "le libellé de la suite"), ("src", "src (le message qui a fait la demande au tiers)")):
            if not dits[k]:
                raise Erreur("%s : %s manque" % (quoi, ce))
        self.refuser_sans_envoi(t, quoi)
        tiers = dits["waiting"]
        if not est_un_tiers(tiers, self.me):
            raise Erreur("%s : attend:%s n'est pas un tiers (ni %s, ni une tâche) : coche la tâche (done) ou "
                         "laisse-la ouverte" % (quoi, tiers or "(vide)", ", ".join(self.me) or "toi"))
        ouverts = self.enfants_ouverts(t)
        if ouverts:
            raise Erreur("%s : #%s a un enfant ouvert (#%s) : notre part n'est pas faite" % (quoi, t.id, ouverts[0].id))
        if t.get("tous"):
            raise Erreur("%s : tâche récurrente (tous:%s) : le bouton « Marquer faite » du panneau la reconduit"
                         % (quoi, t.get("tous")))
        bilan = self.bilan_de(op, quoi)
        champs = {k: self.champ_propose(k, v, quoi, INTERDITS_SUITE) for k, v in (op.get("fields") or {}).items()}
        champs.update({"attend": tiers, "src": dits["src"]})
        if t.get("fiche"):
            champs["fiche"] = t.get("fiche")
        champs.setdefault("ouvert", self.jour)
        p = _sans_parent(t)
        mere = self.taches.get(p) or self.cles.get(p) if p != "-" else None
        if p != "-":
            champs["parent"] = p
        elif "parent" in self.requis:
            champs["parent"] = "-"
        for k in self.heritage + ([] if mere else ["prio"]):
            if k not in champs and t.get(k):
                champs[k] = t.get(k)
        self.completer(champs, t, quoi)
        champs["après"] = t.id
        champs["id"] = self.numero(op.get("key"))
        suite = audit._Tache(id=champs["id"], libelle=dits["label"], axe=t.axe, champs=audit._ordonnes(champs))
        self.cles[op["key"]] = suite
        if t.ligne is not None:
            self.apres_ligne.setdefault(t.ligne, []).append(suite)
        else:
            self.placer(suite, mere, None, quoi)
        self.bilan["enfants"] += 1
        chez = qui_attend(tiers)
        self.fermer_tache(t, date, " ; livré : %s" % dits["delivered"],
                          "Faite : %s ; suite chez %s en #%s" % (dits["proof"], chez, suite.id), bilan=bilan)
        self.tenue["cochees"].append(t.id)
        self.tenue["ajoutees"].append(suite.id)
        self.tenue["suites"].append({"close": t.id, "suite": suite.id, "tiers": chez})
        self.changer(t, "close le %s : %s ; suite chez %s en #%s" % (_jj_mm(date), dits["proof"], chez, suite.id))
        self.compte["ajoutees"].append({"id": suite.id, "libelle": _court(suite.libelle),
                                        "parent": p if p != "-" else None, "due": suite.get("due")})
        self.remplacer_renvois(t.id, suite)

    def remplacer_renvois(self, ancien, suite):
        """Dans les lignes ouvertes, `parent:`, `après:` et « #ancien » du libellé et de la note mènent à la suite."""
        motif = re.compile(r"#%s(?!\d)" % ancien)
        for o in self.ouvertes():
            if o is suite:
                continue
            avant = (o.libelle, o.note, o.get("parent"), o.get("après"))
            for k in ("parent", "après"):
                v = o.get(k)
                if not v or ancien not in [x.strip() for x in v.split(",")]:
                    continue
                nums = []
                for x in v.split(","):
                    x = suite.id if x.strip() == ancien else x.strip()
                    if x not in nums and x != o.id:
                        nums.append(x)
                o.set(k, ",".join(nums) or "-")
            o.libelle, o.note = motif.sub("#" + suite.id, o.libelle), motif.sub("#" + suite.id, o.note)
            if (o.libelle, o.note, o.get("parent"), o.get("après")) != avant:
                o.touche = True
                self.changer(o, "renvoi à #%s remplacé par #%s" % (ancien, suite.id))

    def abandonner(self, op):
        t = self.tache(op.get("id"), "abandon")
        quoi = "abandon de #%s" % t.id
        self.libre(t, quoi)
        raison = audit._propre(op.get("reason"))
        if not raison:
            raise Erreur("%s : la raison manque" % quoi)
        ouverts = self.enfants_ouverts(t)
        if ouverts:
            raise Erreur("%s : #%s a un enfant ouvert (#%s) : abandonne ou coche d'abord ses enfants"
                         % (quoi, t.id, ouverts[0].id))
        bilan = self.bilan_de(op, quoi)
        self.fermer_tache(t, self.jour, " (abandonné)", "Abandonnée : %s" % raison, raison, bilan)
        self.tenue["abandonnees"].append(t.id)
        self.changer(t, "annulée : %s" % raison)

    def mettre_en_pause(self, op):
        """En pause (#159) : `due:` devient la date de reprise, la note le dit, et la tâche passe en
        « Plus tard » ; un enfant reste sous son parent."""
        t = self.tache(op.get("id"), "pause")
        quoi = "pause de #%s" % t.id
        self.libre(t, quoi)
        reprise = _date(op.get("until"), quoi, "until")
        raison = audit._propre(op.get("reason"))
        if not raison:
            raise Erreur("%s : la raison manque" % quoi)
        ouverts = self.enfants_ouverts(t)
        if ouverts:
            raise Erreur("%s : #%s a un enfant ouvert (#%s) : mets en pause ses enfants" % (quoi, t.id, ouverts[0].id))
        t.set("due", reprise)
        jour = datetime.date.fromisoformat(self.jour)
        t.note = (t.note + " (en pause depuis le %s : %s)" % (jour.strftime("%d/%m"), raison)).strip()
        if _sans_parent(t) == "-" and SECTION_PAUSE in self.sections and self.section_de.get(t.ligne) != SECTION_PAUSE:
            t.deplacee = True
            self.placer(t, None, SECTION_PAUSE, quoi)
        self.tenue["en_pause"].append(t.id)
        self.changer(t, "en pause jusqu'au %s : %s" % (_jj_mm(reprise), raison))

    def attendre(self, q):
        """Une question qui attend la personne (#232) : au format de l'audit, sur une tâche (ouverte,
        ajoutée par ce lot sous sa clé, ou close) ou sur une action sans tâche (`about`)."""
        audit._verifier_question(q)
        quoi = "question %s" % q["key"]
        if q["kind"] not in RAISONS:
            raise Erreur("%s : kind « %s » inconnu (admis : %s)" % (quoi, q["kind"], ", ".join(RAISONS)))
        ref = q.get("task")
        if ref in (None, ""):
            libelle = audit._propre(q.get("about"))
            if not libelle:
                raise Erreur("%s : ni task (la tâche visée) ni about (l'action, sans tâche)" % quoi)
            num = None
        else:
            ref = str(ref).lstrip("#")
            t = self.cles.get(ref) or self.taches.get(ref)
            if t is not None:
                num, libelle = t.id, t.libelle
            elif ref in self.closes:
                num, libelle = ref, self.closes[ref]
            else:
                raise Erreur("%s : tâche #%s inconnue (ni ouverte, ni ajoutée par ce lot, ni close)" % (quoi, ref))
        reco = q["options"][0]["label"].replace("(recommandé)", "").strip()
        self.compte["t_attendent"].append({"key": q["key"], "id": num, "libelle": _court(libelle),
                                           "raison": RAISONS[q["kind"]], "question": q["question"], "recommande": reco})

    def ouvertes(self):
        vues, sortie = set(), []
        for t in super().ouvertes():
            if id(t) not in vues:
                vues.add(id(t))
                sortie.append(t)
        return sortie

    # -- rendu

    def rendre_ouvert(self):
        sortie = []
        for n, ligne in enumerate(self.lignes, 1):
            t = self.par_ligne.get(n)
            sortie.extend(m.rendre() for m in self.avant_ligne.get(n, []))
            if t is None:
                sortie.append(ligne)
            elif not getattr(t, "retiree", False) and not getattr(t, "deplacee", False):
                sortie.append(t.rendre())
            sortie.extend(e.rendre() for e in self.apres_ligne.get(n, []))
            if n in self.blanc_apres and self.apres_ligne.get(n) and n < len(self.lignes) and self.lignes[n].strip():
                sortie.append("")
        return "\n".join(sortie)


def _verifier_operation(op):
    if not isinstance(op, dict):
        raise Erreur("operations : chaque opération est un objet, pas %r" % (op,))
    nom = op.get("op")
    if nom not in OPS:
        raise Erreur("opération inconnue « %s » (admises : %s)" % (nom, ", ".join(sorted(OPS))))
    inconnues = set(op) - OPS[nom]
    if inconnues:
        raise Erreur("%s : clé inconnue %s (admises : %s)" % (nom, ", ".join(sorted(inconnues)), ", ".join(sorted(OPS[nom]))))
    if "fields" in op and not isinstance(op["fields"], dict):
        raise Erreur("%s : fields est un objet" % nom)


def preparer(ctx, props, maintenant=None):
    """Les fichiers préparés ({chemin: texte}) et le bilan ; `Erreur` au premier écart, rien d'écrit.
    `maintenant` donne l'heure d'une clôture du jour (`fait:AAAA-MM-JJ HH:MM`, #262)."""
    rdir = os.path.dirname(ctx["roadmap"])
    if audit.empreinte(rdir) != ctx.get("empreinte"):
        raise Erreur("la roadmap a changé depuis le contexte : relance tasks.py context, puis refais les opérations")
    operations = props.get("operations")
    if not isinstance(operations, list):
        raise Erreur("operations : une liste d'opérations")
    prep = _Tenue(ctx, maintenant)
    for op in operations:
        _verifier_operation(op)
        {"add": prep.ajouter, "update": prep.completer_tache, "reschedule": prep.redater,
         "done": prep.cocher, "drop": prep.abandonner, "pause": prep.mettre_en_pause,
         "handoff": prep.passer_la_main}[op["op"]](op)
    questions = props.get("questions") or []
    if not isinstance(questions, list):
        raise Erreur("questions : une liste de questions (le format de l'audit)")
    for q in questions:
        prep.attendre(q)
    prep.boucles()
    apres_o = prep.rendre_ouvert()
    apres_f = prep.rendre_fait()
    prep.controler(apres_o, apres_f or "")
    fichiers = {ctx["roadmap"]: apres_o}
    if apres_f is not None:
        fichiers[ctx["fait"]] = apres_f
    chemin_bilans = prep.journal["chemin"]
    bilans = prep.rendre_bilans(chemin_bilans)
    if bilans is not None:
        fichiers[chemin_bilans] = bilans
    fichiers = {p: t for p, t in fichiers.items() if audit._lire_fichier(p) != t}
    bilan = dict(prep.tenue, ids_crees=prep.bilan["ids_crees"], notes=prep.notes, comptes=prep.bilan.get("comptes"),
                 compte_rendu=prep.compte, jour=prep.jour,
                 lignes={os.path.basename(p): audit.lignes_changees(audit._lire_fichier(p), t) for p, t in fichiers.items()})
    return fichiers, bilan


def ecrire(dossier, chemin_ops, appliquer=False, maintenant=None, en_json=False):
    """L'essai à blanc (les lignes rendues, rien d'écrit), ou, avec `appliquer`, l'écriture tout ou
    rien après sauvegarde ; refusée quand le projet écrit sa roadmap par son outil (`ecriture`)."""
    maintenant = maintenant or datetime.datetime.now()
    try:
        with open(chemin_ops, encoding="utf-8") as f:
            props = json.load(f)
        with open(props["context"], encoding="utf-8") as f:
            ctx = json.load(f)
    except (OSError, ValueError, KeyError, TypeError) as e:
        raise Erreur("opérations ou contexte illisibles (%s) : %s" % (chemin_ops, e))
    _, rdir, _ = audit.situer(dossier)
    if os.path.realpath(os.path.dirname(ctx["roadmap"])) != os.path.realpath(rdir):
        raise Erreur("le contexte porte sur %s, pas sur la roadmap de %s" % (ctx["roadmap"], dossier))
    decl = ob.declarations(ctx["dossier"])
    fichiers, bilan = preparer(ctx, props, maintenant)
    bilan.update(ecrit=False, sauvegarde=None)
    if appliquer:
        if decl["ecriture_illisible"]:
            raise Erreur("ecriture de .claude/roadmap.json est illisible : rien ne s'écrit tant qu'elle n'est pas "
                         "corrigée (skill doctor)")
        if decl["ecriture"]:
            raise Erreur("ce projet écrit sa roadmap par %s (%s) : passe-lui les lignes de l'essai à blanc"
                         % (decl["ecriture"]["outil"], decl["ecriture"]["consigne"]))
        if fichiers:
            lieu = audit.lieu_de_sauvegarde(ctx["dossier"], rdir)
            bilan["sauvegarde"] = audit._sauvegarder(lieu, maintenant, fichiers, prefixe="sauvegarde-tasks-")
            im._ecrire_tout(fichiers)
            bilan["ecrit"] = True
    outil = decl["ecriture"]["outil"] if decl["ecriture"] else None
    bilan["etat"] = "ecrit" if bilan["ecrit"] else ("outil" if outil else "essai")
    bilan["markdown"] = rendre_compte_rendu(bilan["compte_rendu"], bilan["etat"], bilan["jour"], outil,
                                            bilan["sauvegarde"])
    afficher(bilan, decl, en_json)
    return bilan


def _plat(texte):
    return str(texte).replace("\n", " ")


def _glyphe(change):
    """Le glyphe d'une mise à jour dans le journal (#261) : ✓ close, ✕ annulée ou retirée, ↻ le reste."""
    if re.match(r"(cochée|close|ajoutée et cochée)\b", change):
        return "✓"
    if re.match(r"(annulée|abandonnée|retirée)\b", change):
        return "✕"
    return "↻"


def rendre_compte_rendu(cr, etat, jour, outil=None, sauvegarde=None):
    """Le compte rendu d'une écriture en lignes de journal (#261, parti B, après #232) : une puce par
    tâche, son glyphe devant ; ni titre, ni rubrique, ni « rien ». `jour` reste pour la signature."""
    suites = cr.get("suites") or []
    closes = {s["close"] for s in suites}
    lignes = ["- ✓ #%s close, la suite chez %s passe en #%s" % (s["close"], s["tiers"], s["suite"]) for s in suites]
    for a in cr["ajoutees"]:
        extra = [x for x in ("sous #" + a["parent"] if a["parent"] else "",
                             "due " + _jj_mm(a["due"]) if a["due"] else "") if x]
        lignes.append("- ＋ #%s ajoutée — %s%s" % (a["id"], _plat(a["libelle"]), " (%s)" % ", ".join(extra) if extra else ""))
    for m in cr["mises_a_jour"]:
        if m["id"] not in closes:
            lignes.append("- %s #%s %s — %s" % (_glyphe(m["change"]), m["id"], _plat(m["change"]), _plat(m["libelle"])))
    for q in cr["t_attendent"]:
        lignes.append("- ? %s%s (%s) — recommandé : %s" % ("#%s " % q["id"] if q["id"] else "", _plat(q["question"]),
                                                       q["raison"], _plat(q["recommande"])))
    corps = "\n".join(lignes) if lignes else "Roadmap : rien ne change."
    tete = {"ecrit": "", "essai": "Essai à blanc, rien n'est écrit :", "outil": "À passer à %s :" % outil}[etat]
    md = "%s\n\n%s" % (tete, corps) if tete and lignes else corps
    if sauvegarde:
        md += "\n\nSauvegarde : `%s`" % sauvegarde
    return md


def afficher(bilan, decl, en_json=False):
    """Les lignes changées et la consigne pour le modèle d'abord, le compte rendu en dernier : la
    skill le recopie tel quel (#232). `en_json` : le bilan entier, compte rendu compris."""
    if en_json:
        print(json.dumps(bilan, ensure_ascii=False, indent=2))
        return
    for nom, lignes in bilan["lignes"].items():
        print("%s :" % nom)
        for l in lignes:
            print("  %s" % l)
    if bilan["ecrit"]:
        print("Écrit.")
    elif decl["ecriture"]:
        print("Essai à blanc : rien n'est écrit. Ce projet écrit sa roadmap par %s : %s. Passe-lui ces lignes ; --apply est refusé."
              % (decl["ecriture"]["outil"], decl["ecriture"]["consigne"]))
    else:
        print("Essai à blanc : rien n'est écrit. Relance avec --apply pour écrire.")
    print()
    print(bilan["markdown"])


def main(argv=None):
    import argparse
    p = argparse.ArgumentParser(prog="tasks.py", description="Tenir la roadmap au quotidien (#158).")
    sous = p.add_subparsers(dest="commande", required=True)
    c = sous.add_parser("context", help="rules, declarations, next id and tasks, as JSON")
    c.add_argument("dossier")
    r = sous.add_parser("match", help="the tasks on the same subject as an action, as JSON")
    r.add_argument("dossier")
    r.add_argument("--text", dest="texte", action="append", required=True)
    e = sous.add_parser("write", help="dry run of the operations, or write them with --apply")
    e.add_argument("dossier")
    e.add_argument("--operations", required=True)
    e.add_argument("--apply", dest="appliquer", action="store_true")
    e.add_argument("--json", dest="en_json", action="store_true", help="the bilan and its report as JSON")
    for s in (c, r, e):
        s.add_argument("--day", dest="jour", help="YYYY-MM-DD (today by default)")
        s.add_argument("--perso", default="~/.claude/roadmap-perso.json", help=argparse.SUPPRESS)
    args = p.parse_args(argv)
    try:
        if args.commande == "context":
            print(json.dumps(contexte(args.dossier, args.jour, args.perso), ensure_ascii=False, indent=2))
        elif args.commande == "match":
            ctx = contexte(args.dossier, args.jour, args.perso)
            print(json.dumps([rapprocher(ctx, t) for t in args.texte], ensure_ascii=False, indent=2))
        else:
            maintenant = datetime.datetime.now()
            if args.jour:
                maintenant = datetime.datetime.combine(datetime.date.fromisoformat(args.jour), maintenant.time())
            ecrire(args.dossier, args.operations, args.appliquer, maintenant, args.en_json)
    except Erreur as err:
        print("Refusé : %s" % err, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
