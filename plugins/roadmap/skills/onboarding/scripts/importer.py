#!/usr/bin/env python3
"""Import d'une roadmap existante à l'onboarding (#100) : lecture des formats (checklist Markdown,
CSV, export Notion, tableau Markdown), analyse et correspondance avec la grammaire, puis écriture
numérotée, sauvegardée et prouvée par un bilan avant/après. Appelé par onboarding.py (`analyser`,
`importer`, et le contrôle des numéros de `verifier`).

Python 3.9 et plus, bibliothèque standard seulement.
"""

import datetime
import io
import json
import os
import re
import shutil
import unicodedata


class Erreur(Exception):
    pass


FICHIER_OUVERT = "ROADMAP.md"
FICHIER_FAIT = "ROADMAP-fait.md"

# Une case à cocher, à toute profondeur : puce -, * ou +, ou liste numérotée (`1.`, `2)`).
CASE = re.compile(r"^(\s*)(?:[-*+]|\d+[.)])[ \t]+\[([ xX])\][ \t]+(\S.*)$")
# Ce qui ressemble à une case sans en être une bonne (`- [?] x`, `- [ ]` sans libellé) ; ni un lien
# `- [texte](url)` ni une note `- [1] …` n'en sont.
CASE_DOUTEUSE = re.compile(r"^\s*(?:[-*+]|\d+[.)])[ \t]+\[[^\]\w]?\](?!\()")
# Comme le panneau : le libellé est gourmand, seul le dernier bloc `[…]` fait foi.
META = re.compile(r"^(.*)\s+`\[([^`]+)\]`(.*)$")
# Un bloc de code s'ouvre sur ``` ou ~~~ ; une ligne qui referme ses ``` est du code en ligne.
FENCE = re.compile(r"^\s*(?:```(?!.*```)|~~~)")
CLE_CHAMP = re.compile(r"^[a-zà-ÿ][a-zà-ÿ0-9-]*$")
ID = re.compile(r"^[1-9]\d*$")


def _champs(bloc):
    """`axe | clé:valeur | …` → (axe, [(clé, valeur)]) ; un champ sans clé garde valeur None."""
    morceaux = [m.strip() for m in bloc.split("|")]
    champs = []
    for m in morceaux[1:]:
        if m == "":
            continue
        k, sep, v = m.partition(":")
        champs.append((k.strip(), v.strip()) if sep else (m, None))
    return morceaux[0], champs


def _est_meta(bloc):
    """Un bloc `[…]` de la grammaire, et non un texte entre crochets du libellé (`[Bug #12]`) : un
    axe bien écrit suivi de champs `clé:valeur`, ou au moins un champ `clé:valeur`."""
    axe, champs = _champs(bloc)
    avec_cle = [k for k, v in champs if v is not None and CLE_CHAMP.match(k)]
    if re.match(r"^[a-z0-9][a-z0-9-]*$", axe):
        return all(v is not None for _, v in champs)
    return bool(avec_cle)


def _blocs_de_code(lignes):
    """Les numéros (depuis 0) des lignes dans un bloc de code ; un bloc jamais refermé ne cache rien."""
    ouvertures = [i for i, l in enumerate(lignes) if FENCE.match(l)]
    if len(ouvertures) % 2:
        ouvertures = ouvertures[:-1]
    dedans = set()
    for a, b in zip(ouvertures[::2], ouvertures[1::2]):
        dedans.update(range(a, b + 1))
    return dedans


def lire_checklist(texte):
    """Les tâches d'un fichier en cases à cocher, et les lignes qui en ont l'air sans en être.

    Chaque tâche : `ligne` (numéro, depuis 1), `fait`, `libelle`, `axe`, `champs` [(clé, valeur)],
    `note` (ce qui suit le bloc), `section` (titre ##), `sous_titre` (titre ###), `profondeur`,
    `mere` (indice de la tâche mère, pour une case indentée), `meta` (porte un bloc `[…]`),
    `brut` (la ligne telle quelle)."""
    taches, illisibles = [], []
    section = sous_titre = ""
    pile = []  # (retrait, indice) des tâches ouvertes au-dessus
    lignes = [l.rstrip("\r") for l in texte.split("\n")]
    code = _blocs_de_code(lignes)
    for n, ligne in enumerate(lignes, 1):
        if n - 1 in code:
            continue
        if ligne.startswith("## "):
            section, sous_titre, pile = ligne[3:].strip(), "", []
            continue
        if ligne.startswith("### "):
            sous_titre, pile = ligne[4:].strip(), []
            continue
        m = CASE.match(ligne)
        if not m:
            if CASE_DOUTEUSE.match(ligne):
                illisibles.append((n, ligne))
            continue
        retrait = len(m.group(1).expandtabs(4))
        while pile and pile[-1][0] >= retrait:
            pile.pop()
        reste = m.group(3)
        mm = META.match(reste)
        if mm and not _est_meta(mm.group(2)):
            mm = None
        if mm:
            libelle, (axe, champs), note = mm.group(1).strip(), _champs(mm.group(2)), mm.group(3).strip()
        else:
            libelle, axe, champs, note = reste.strip(), "", [], ""
        taches.append({
            "ligne": n, "fait": m.group(2) != " ", "libelle": libelle, "axe": axe, "champs": champs,
            "note": note, "section": section, "sous_titre": sous_titre, "profondeur": len(pile),
            "mere": pile[-1][1] if pile else None, "meta": bool(mm), "brut": ligne,
        })
        pile.append((retrait, len(taches) - 1))
    return taches, illisibles


def champ(tache, cle):
    """La valeur d'un champ d'une tâche, None s'il manque."""
    for k, v in tache["champs"]:
        if k == cle:
            return v
    return None


def ecarts_ids(ouvert, fait, exiger=False):
    """Les écarts de numérotation des deux fichiers : lignes sans `id:` (dès qu'une ligne en porte,
    ou toujours si `exiger`) et numéros portés deux fois. Une tâche en train de descendre (ouverte
    dans ROADMAP.md, cochée dans ROADMAP-fait.md, même `ouvert:`) n'est pas un double."""
    lus = [(FICHIER_OUVERT, lire_checklist(ouvert or "")), (FICHIER_FAIT, lire_checklist(fait or ""))]
    fichiers = [(nom, lu[0]) for nom, lu in lus]
    tout = [(nom, t, champ(t, "id") if ID.match(champ(t, "id") or "") else None) for nom, taches in fichiers for t in taches]
    if not exiger and not any(i for _, _, i in tout):
        return []
    ecarts = []
    for nom, (_, illisibles) in lus:
        sans = [(t["ligne"], t["brut"]) for f, t, i in tout if f == nom and not i] + list(illisibles)
        if sans:
            ecarts.append("%s : %d ligne(s) sans id: (la première : %s)" % (nom, len(sans), min(sans)[1][:80]))
    par_id = {}
    for f, t, i in tout:
        if i:
            par_id.setdefault(i, []).append((f, t))
    for i, porteurs in sorted(par_id.items(), key=lambda x: int(x[0]) if x[0].isdigit() else 0):
        if len(porteurs) < 2:
            continue
        if len(porteurs) == 2:
            (f1, t1), (f2, t2) = porteurs
            descend = {f1, f2} == {FICHIER_OUVERT, FICHIER_FAIT} and champ(t1, "ouvert") and \
                champ(t1, "ouvert") == champ(t2, "ouvert") and \
                any(f == FICHIER_OUVERT and not t["fait"] for f, t in porteurs) and \
                any(f == FICHIER_FAIT and t["fait"] for f, t in porteurs)
            if descend:
                continue
        ecarts.append("id:%s porté %d fois : %s" % (i, len(porteurs), ", ".join(
            "%s L%d" % (f, t["ligne"]) for f, t in porteurs)))
    return ecarts


# ---------------------------------------------------------------- correspondance

# Les clés de la grammaire (celles du panneau, plus `verrou`) : une clé déclarée n'en reprend aucune.
CLES_GRAMMAIRE = {"id", "qui", "attend", "resp", "branche", "verrou", "ouvert", "due", "parent", "après", "prio",
                  "feedback", "fait", "spec", "fiche", "src"}
AXE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
DATE_FAIT = re.compile(r"^\d{4}-\d{2}-\d{2}( ([01]\d|2[0-3]):[0-5]\d)?$")
AXE_DEFAUT = "dossier"
# Les priorités en mots, vers l'échelle 1, 2, 3 du panneau.
PRIOS = {"1": "1", "2": "2", "3": "3", "p1": "1", "p2": "2", "p3": "3",
         "haute": "1", "high": "1", "urgent": "1", "urgente": "1", "élevée": "1",
         "normale": "2", "moyenne": "2", "medium": "2", "normal": "2",
         "basse": "3", "low": "3", "faible": "3"}
# Les champs exigés que l'analyse sait compléter : « aucune » pour les liens, la personne pour resp.
DEFAUTS_LIENS = {"parent": "-", "après": "-"}


def _slug(texte):
    """Une valeur libre en clé ou en axe : minuscules, sans accent, tirets."""
    t = unicodedata.normalize("NFKD", texte or "").encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")


def valeur_propre(v):
    """Une valeur sûre dans un bloc `[…]` : ni barre (séparateur), ni accent grave (fin du bloc),
    sauts de ligne réduits."""
    return re.sub(r"\s+", " ", (v or "").replace("|", "/").replace("`", "")).strip()


def _valeur_cle_declaree(v):
    """Une valeur de clé déclarée tirée d'un titre : sa tête avant « : », sans virgule (le panneau
    y coupe les valeurs multiples)."""
    return valeur_propre(v.split(" : ")[0].replace(",", " ")).strip()


def _sous_titres(taches):
    """Les ### « Projet · Département » portés par des tâches : les clés et leurs valeurs."""
    titres = []
    for t in taches:
        if t.get("sous_titre") and t["sous_titre"] not in titres:
            titres.append(t["sous_titre"])
    if not titres:
        return {"cles": [], "valeurs": {}}
    deux = any(" · " in s for s in titres)
    cles = ["projet", "dept"] if deux else ["projet"]
    valeurs = {}
    for s in titres:
        parts = s.split(" · ", 1)
        v = {"projet": _valeur_cle_declaree(parts[0])}
        if deux and len(parts) > 1:
            v["dept"] = _valeur_cle_declaree(parts[1])
        valeurs[s] = v
    return {"cles": cles, "valeurs": valeurs}


def appliquer(tache, c, avec_defauts=True):
    """L'axe et les champs d'une tâche une fois la correspondance `c` appliquée (sans `id:`)."""
    axe = tache["axe"]
    axe = c.get("axes", {}).get(axe, axe) if axe else c.get("axe_defaut") or AXE_DEFAUT
    champs = []
    for k, v in tache["champs"]:
        if v is not None and k in c.get("valeurs", {}):
            v = c["valeurs"][k].get(v, v)
        champs.append((k, v))
    presentes = {k for k, _ in champs}
    st = c.get("sous_titres") or {}
    for k, v in (st.get("valeurs", {}).get(tache.get("sous_titre") or "", {})).items():
        if k in st.get("cles", []) and k not in presentes and v:
            champs.append((k, v))
            presentes.add(k)
    if avec_defauts:
        for k, v in (c.get("defauts") or {}).items():
            if k not in presentes and v and _defaut_vaut(k, tache):
                champs.append((k, v))
    return axe, champs


def _defaut_vaut(k, tache):
    """`fait:` ne se complète que sur une close, les autres champs que sur une ouverte."""
    return tache["fait"] == (k == "fait")


def _manquants(taches, c):
    """Par champ exigé, le nombre de tâches ouvertes qui ne l'ont pas (sans les valeurs par défaut),
    et `fait` : les closes sans date de clôture."""
    out = {}

    def manque(t, k):
        _, champs = appliquer(t, c, avec_defauts=False)
        return not dict((a, b) for a, b in champs if b is not None).get(k)

    for k in [k for k in c.get("requis") or [] if k != "id"] + ["fait"]:
        n = sum(1 for t in taches if (t["fait"] == (k == "fait")) and manque(t, k))
        if n:
            out[k] = n
    return out


def _inconnues(taches):
    compte = {}
    for t in taches:
        for k, v in t["champs"]:
            if v is None:
                mauvais = True
            elif k in ("ouvert", "due"):
                mauvais = not DATE.match(v) or lire_date(v) is None
            elif k == "fait":
                mauvais = not DATE_FAIT.match(v) or lire_date(v) is None
            elif k == "prio":
                mauvais = v.lower() not in PRIOS
            elif k == "id":
                mauvais = not ID.match(v)
            else:
                mauvais = False
            if mauvais:
                cle = (k if v is not None else "", v if v is not None else k)
                compte[cle] = compte.get(cle, 0) + 1
    return [{"cle": k, "valeur": v, "lignes": n} for (k, v), n in compte.items()]


def _lire(chemin):
    try:
        with open(chemin, encoding="utf-8-sig") as f:
            return f.read()
    except OSError as e:
        raise Erreur("illisible : %s (%s)" % (chemin, e))
    except UnicodeDecodeError:
        raise Erreur("%s n'est pas en UTF-8 : l'enregistrer en UTF-8 (CSV UTF-8 dans Excel ou Numbers) puis relancer" % chemin)


# ---------------------------------------------------------------- tableaux (CSV, Notion, Markdown)

MOIS = {"january": 1, "jan": 1, "janvier": 1, "janv": 1, "february": 2, "feb": 2, "fevrier": 2, "fevr": 2, "fev": 2,
        "march": 3, "mar": 3, "mars": 3, "april": 4, "apr": 4, "avril": 4, "avr": 4, "may": 5, "mai": 5,
        "june": 6, "jun": 6, "juin": 6, "july": 7, "jul": 7, "juillet": 7, "juil": 7, "august": 8, "aug": 8,
        "aout": 8, "september": 9, "sep": 9, "sept": 9, "septembre": 9, "october": 10, "oct": 10, "octobre": 10,
        "november": 11, "nov": 11, "novembre": 11, "december": 12, "dec": 12, "decembre": 12}


def lire_date(v):
    """Une date en AAAA-MM-JJ, depuis ISO, JJ/MM/AAAA, « October 29, 2026 » ou « 29 octobre 2026 »
    (heure et fin d'intervalle ignorées) ; None si elle ne se lit pas."""
    v = (v or "").split("→")[0].strip()
    t = _slug(v).replace("-", " ")
    essais = []
    m = re.match(r"^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?!\d)", v)
    if m:
        essais.append((m.group(1), m.group(2), m.group(3)))
    m = re.match(r"^(\d{1,2})[/.](\d{1,2})[/.](\d{4})(?!\d)", v)
    if m:
        essais.append((m.group(3), m.group(2), m.group(1)))
    m = re.match(r"^([a-z]+) (\d{1,2}) (\d{4})\b", t)
    if m and m.group(1) in MOIS:
        essais.append((m.group(3), MOIS[m.group(1)], m.group(2)))
    m = re.match(r"^(\d{1,2}) ([a-z]+) (\d{4})\b", t)
    if m and m.group(2) in MOIS:
        essais.append((m.group(3), MOIS[m.group(2)], m.group(1)))
    for a, mo, j in essais:
        try:
            return datetime.date(int(a), int(mo), int(j)).isoformat()
        except ValueError:
            return None
    return None


TABLEAU_SEP = re.compile(r"^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$")


def _cellules(ligne):
    ligne = ligne.strip().replace("\\|", "\x00")
    if ligne.startswith("|"):
        ligne = ligne[1:]
    if ligne.endswith("|"):
        ligne = ligne[:-1]
    return [c.strip().replace("\x00", "|") for c in ligne.split("|")]


def _uniques(entetes):
    """Deux colonnes de même nom gardent chacune la sienne : la seconde devient « Nom (2) »."""
    vus, out = {}, []
    for e in entetes:
        vus[e] = vus.get(e, 0) + 1
        out.append(e if vus[e] == 1 else "%s (%d)" % (e, vus[e]))
    return out


def lire_tableau(texte):
    """(en-têtes, [(numéro de ligne, {en-tête: cellule})]) d'un CSV (virgule, point-virgule ou
    tabulation) ou du premier tableau Markdown du texte."""
    import csv
    lignes = texte.split("\n")
    for i in range(len(lignes) - 1):
        if lignes[i].lstrip().startswith("|") and TABLEAU_SEP.match(lignes[i + 1]):
            entetes = _uniques(_cellules(lignes[i]))
            rangs = []
            for n in range(i + 2, len(lignes)):
                if not lignes[n].lstrip().startswith("|"):
                    break
                cell = _cellules(lignes[n])
                rangs.append((n + 1, dict(zip(entetes, cell + [""] * (len(entetes) - len(cell))))))
            return entetes, rangs
    try:
        dialecte = csv.Sniffer().sniff(texte[:4096], delimiters=",;\t")
    except csv.Error:
        dialecte = csv.excel
    tout = list(csv.reader(io.StringIO(texte), dialecte))
    if not tout:
        return [], []
    entetes = _uniques([e.strip() for e in tout[0]])
    rangs = []
    for n, rang in enumerate(tout[1:], 2):
        rangs.append((n, dict(zip(entetes, [c.strip() for c in rang] + [""] * (len(entetes) - len(rang))))))
    return entetes, rangs


ROLES = {
    "libelle": ["name", "nom", "title", "titre", "task", "tache", "taches", "libelle", "intitule", "sujet", "action", "item"],
    "statut": ["status", "statut", "etat", "state", "avancement", "done", "fait"],
    "axe": ["tags", "tag", "categorie", "category", "axe", "projet", "project", "domaine", "area"],
    "resp": ["assignee", "assign", "assigned-to", "owner", "responsable", "resp", "porteur", "personne", "person"],
    "due": ["due", "due-date", "echeance", "deadline", "date-limite", "date-d-echeance", "date"],
    "ouvert": ["created", "created-time", "created-at", "cree", "cree-le", "creation", "date-de-creation", "ouvert"],
    "fait": ["completed", "completed-at", "completed-on", "done-date", "date-de-fin", "termine-le", "closed-at"],
    "prio": ["priority", "priorite", "prio", "importance"],
    "attend": ["attend", "blocked-by", "bloque-par", "en-attente-de", "waiting-for"],
    "src": ["src", "source", "lien", "url", "link"],
    "fiche": ["fiche", "doc", "document"],
    "cle:ref": ["id", "ref", "reference"],
}
COLONNES_NOTION = {"last-edited-time", "last-edited-by", "created-by"}
STATUTS = {
    "fait": ["done", "fait", "faite", "termine", "terminee", "complete", "completed", "closed", "clos", "close",
             "archive", "archived", "livre", "resolu", "resolved", "annule", "cancelled", "canceled", "yes", "oui",
             "true", "x", "checked"],
    "en-cours": ["in-progress", "en-cours", "doing", "started", "commence", "wip", "in-review", "en-revue", "a-valider"],
    "plus-tard": ["later", "plus-tard", "someday", "backlog", "on-hold", "en-pause", "pause"],
    "prochain": ["not-started", "to-do", "todo", "a-faire", "next", "prochain", "open", "ouvert", "nouveau", "new",
                 "no", "non", "false", ""],
}
SECTIONS = {"en-cours": "En cours", "prochain": "Prochain", "plus-tard": "Plus tard"}


def _format(chemin, texte):
    if chemin.lower().endswith((".csv", ".tsv")):
        entetes, _ = lire_tableau(texte)
        notion = {"name", "status"} <= {_slug(e) for e in entetes} or any(_slug(e) in COLONNES_NOTION | {"created-time"} for e in entetes)
        return "notion-csv" if notion else "csv"
    if any(CASE.match(l) for l in texte.split("\n")):
        return "checklist"
    lignes = texte.split("\n")
    if any(lignes[i].lstrip().startswith("|") and TABLEAU_SEP.match(lignes[i + 1]) for i in range(len(lignes) - 1)):
        return "tableau-markdown"
    return "checklist"


def _proposer_tableau(entetes, rangs):
    """La correspondance proposée d'un tableau : rôle de chaque colonne, statuts, axes, valeurs."""
    colonnes, pris = {}, set()
    for e in entetes:
        s = _slug(e)
        role = next((r for r, syn in ROLES.items() if s in syn and r not in pris), None)
        if role is None:
            role = "ignorer" if (s in COLONNES_NOTION or not s or s in CLES_GRAMMAIRE) else "cle:" + s
        if role != "ignorer" and not role.startswith("cle:"):
            pris.add(role)
        colonnes[e] = role
    if "libelle" not in colonnes.values() and entetes:
        colonnes[entetes[0]] = "libelle"
    col = {r: e for e, r in colonnes.items()}
    statuts = {}
    if "statut" in col:
        for _, r in rangs:
            v = r.get(col["statut"], "")
            if v and v not in statuts:
                statuts[v] = next((k for k, syn in STATUTS.items() if _slug(v) in syn), "prochain")
    axes = {}
    if "axe" in col:
        for _, r in rangs:
            v = (r.get(col["axe"], "").split(",")[0]).strip()
            if v and v not in axes:
                axes[v] = _slug(v) or AXE_DEFAUT
    valeurs = {}
    if "prio" in col:
        prios = {r.get(col["prio"], "") for _, r in rangs} - {""}
        table = {v: PRIOS[v.lower()] for v in sorted(prios) if v.lower() in PRIOS}
        if table:
            valeurs["prio"] = table
    cles = {r[4:]: [] for r in colonnes.values() if r.startswith("cle:")}
    return colonnes, statuts, axes, valeurs, cles


def taches_du_tableau(rangs, c):
    """Les tâches d'un tableau, une par rang, la correspondance appliquée ; les rangs avec des
    cellules mais sans titre (illisibles) ; les valeurs non reconnues."""
    taches, illisibles, compte = [], [], {}
    col = {r: e for e, r in c["colonnes"].items()}
    for n, rang in rangs:
        if not any(v.strip() for v in rang.values()):
            continue
        libelle = LIBELLE_ESPACES.sub(" ", rang.get(col.get("libelle", ""), "")).strip()
        if not libelle:
            illisibles.append((n, " ; ".join(v for v in rang.values() if v.strip())))
            continue
        statut = c.get("statuts", {}).get(rang.get(col.get("statut", ""), ""), "prochain")
        if "statut" in col and rang.get(col["statut"], "") and rang[col["statut"]] not in c.get("statuts", {}):
            compte[("statut", rang[col["statut"]])] = compte.get(("statut", rang[col["statut"]]), 0) + 1
        axe, champs = "", []
        for e, role in c["colonnes"].items():
            v = rang.get(e, "").strip()
            if not v or role in ("libelle", "statut", "ignorer"):
                continue
            if role == "axe":
                if "," in v:
                    compte[("axe", v)] = compte.get(("axe", v), 0) + 1
                premier = v.split(",")[0].strip()
                axe = c.get("axes", {}).get(premier, _slug(premier))
                continue
            if role in ("due", "ouvert", "fait"):
                d = lire_date(v)
                if d is None:
                    compte[(role, v)] = compte.get((role, v), 0) + 1
                    continue
                v = d
            elif role == "prio":
                p = c.get("valeurs", {}).get("prio", {}).get(v) or PRIOS.get(v.lower())
                if p is None:
                    compte[("prio", v)] = compte.get(("prio", v), 0) + 1
                    continue
                v = p
            else:
                v = valeur_propre(v)
            champs.append((role[4:] if role.startswith("cle:") else role, v))
        taches.append({
            "ligne": n, "fait": statut == "fait", "libelle": libelle, "axe": axe, "champs": champs, "note": "",
            "section": SECTIONS.get(statut, "Prochain"), "sous_titre": "", "profondeur": 0, "mere": None,
            "meta": False, "brut": libelle,
        })
    return taches, illisibles, [{"cle": k, "valeur": v, "lignes": n} for (k, v), n in compte.items()]


def charger(chemin, origine, fmt, c):
    """Les tâches d'un fichier source dans son format, la correspondance `c` appliquée aux tableaux."""
    texte = _lire(chemin)
    if fmt in ("grammaire", "checklist"):
        taches, ills = lire_checklist(texte)
        inconnues = _inconnues(taches)
    else:
        taches, ills, inconnues = taches_du_tableau(lire_tableau(texte)[1], c)
    for t in taches:
        t["origine"] = origine
    return taches, ills, inconnues


def analyser(source, fait=None, qui="", requis=None, jour=None):
    """Ce que la source contient et la correspondance proposée avec la grammaire, en dict JSON."""
    jour = jour or datetime.date.today().isoformat()
    source = os.path.abspath(os.path.expanduser(source))
    lus = [("source", source)] + ([("fait", os.path.abspath(os.path.expanduser(fait)))] if fait else [])
    fmt = _format(source, _lire(source))
    c = {"colonnes": {}, "statuts": {}, "valeurs": {}, "axes": {}, "axe_defaut": AXE_DEFAUT,
         "sous_titres": {"cles": [], "valeurs": {}}, "cles": {}, "requis": list(requis or ["id"]), "defauts": {}}
    if fmt not in ("grammaire", "checklist"):
        c["colonnes"], c["statuts"], c["axes"], c["valeurs"], c["cles"] = _proposer_tableau(*lire_tableau(_lire(source)))
    taches, illisibles, inconnues, comptes = [], [], [], {}
    for origine, chemin in lus:
        ts, ills, inc = charger(chemin, origine, fmt if origine == "source" else "checklist", c)
        taches += ts
        inconnues += inc
        illisibles += [{"fichier": origine, "ligne": n, "texte": l} for n, l in ills]
        comptes[origine] = {"ouvertes": sum(1 for t in ts if not t["fait"]), "closes": sum(1 for t in ts if t["fait"])}
    if not taches and not illisibles:
        raise Erreur("aucune tâche trouvée dans %s" % source)
    if fmt == "checklist" and taches and all(t["meta"] for t in taches):
        fmt = "grammaire"
    if fmt in ("grammaire", "checklist"):
        for t in taches:
            if t["axe"] and t["axe"] not in c["axes"]:
                c["axes"][t["axe"]] = t["axe"] if AXE.match(t["axe"]) else _slug(t["axe"]) or AXE_DEFAUT
        prios = {v for t in taches for k, v in t["champs"] if k == "prio" and v}
        table = {v: PRIOS[v.lower()] for v in sorted(prios) if v.lower() in PRIOS and v != PRIOS[v.lower()]}
        if table:
            c["valeurs"]["prio"] = table
        c["sous_titres"] = _sous_titres(taches)
        for t in taches:
            for k, v in t["champs"]:
                if v is not None and k not in CLES_GRAMMAIRE:
                    c["cles"].setdefault(k, [])
        for k in c["sous_titres"]["cles"]:
            c["cles"].setdefault(k, [])
    manquants = _manquants(taches, c)
    for k in manquants:
        if k in DEFAUTS_LIENS:
            c["defauts"][k] = DEFAUTS_LIENS[k]
        elif k == "resp" and qui:
            c["defauts"][k] = qui
        elif k in ("ouvert", "fait"):
            c["defauts"][k] = jour
    return {
        "format": fmt,
        "qui": qui,
        "source": source,
        "fait_source": lus[1][1] if fait else None,
        "comptes": comptes,
        "a_numeroter": sum(1 for t in taches if not champ(t, "id")),
        "correspondance": c,
        "manquants": manquants,
        "inconnues": inconnues,
        "illisibles": illisibles,
    }


# ---------------------------------------------------------------- écriture

SECTIONS_OUVERTES = ["En cours", "Prochain", "Plus tard"]
LIBELLE_ESPACES = re.compile(r"\s+")
AXES_DECLARES = re.compile(r"^(?:Axes en usage|- \*\*axe\*\*)", re.I)


def _libelle(t):
    return LIBELLE_ESPACES.sub(" ", t["libelle"]).strip()


def rendre_ligne(case, libelle, axe, champs, note=""):
    """Une ligne de la grammaire : `- [ ] Libellé `[axe | clé:valeur | …]` note`."""
    morceaux = [axe] + [k if v is None else "%s:%s" % (k, v) for k, v in champs]
    return "- [%s] %s `[%s]`%s" % ("x" if case else " ", libelle, " | ".join(morceaux), (" " + note) if note else "")


def _numeroter(taches):
    """Les numéros : ceux déjà portés se gardent ; les autres suivent le plus grand, de la plus
    ancienne à la plus récente (`ouvert:`, sinon `fait:`), closes d'abord, puis l'ordre du fichier."""
    portes = [champ(t, "id") for t in taches]
    n = max([int(i) for i in portes if i and i.isdigit()] or [0])

    def cle(t):
        quand = champ(t, "ouvert") or (champ(t, "fait") or "")[:10] or "9999-99-99"
        return (quand, 0 if t["fait"] else 1, t["ligne"])

    for t in sorted((t for t in taches if not champ(t, "id")), key=cle):
        n += 1
        t["id"] = str(n)
    for t in taches:
        t.setdefault("id", champ(t, "id"))


def _ligne_importee(t, taches, c):
    """La ligne d'une tâche une fois numérotée : `id:` après l'axe, la correspondance appliquée,
    `parent:` vers la tâche mère d'une case indentée, puis les valeurs par défaut validées."""
    axe, champs = appliquer(t, c, avec_defauts=False)
    champs = [(k, v) for k, v in champs if k != "id"]
    presentes = {k for k, _ in champs}
    parent = taches[t["mere"]]["id"] if t.get("mere") is not None else None
    ajouts = []
    for k, v in (c.get("defauts") or {}).items():
        if k in presentes or not v or not _defaut_vaut(k, t):
            continue
        if k == "parent" and parent:
            v, parent = parent, None
        ajouts.append((k, v))
    if parent and "parent" not in presentes:
        ajouts.append(("parent", parent))
    champs = [("id", t["id"])] + champs + ajouts
    t["fait_le"] = dict((k, v) for k, v in champs if v is not None).get("fait", "")
    return rendre_ligne(t["fait"], t["libelle"], axe, champs, t["note"])


def _grammaire(c):
    cles = "".join(" | %s:…" % k for k in c.get("cles") or {})
    return [
        "- [ ] <Verbe à l'infinitif + objet> `[axe | id:N | ouvert:AAAA-MM-JJ | due:AAAA-MM-JJ | resp:Nom | parent:N "
        "| après:N,M | attend:… | qui:… | prio:1 | fiche:… | src:…%s]`" % cles,
        "- [x] <Verbe à l'infinitif + objet> `[axe | id:N | ouvert:AAAA-MM-JJ | fait:AAAA-MM-JJ | src:…%s]`" % cles,
    ]


def _fin_section(lignes, debut):
    return next((i for i in range(debut + 1, len(lignes)) if lignes[i].startswith("## ")), len(lignes))


def _entete(texte, axes, c, jour, qui=""):
    """L'en-tête d'un ROADMAP.md converti sur place : l'exemple de la grammaire du plugin, les axes
    déclarés en tête de ligne, une ligne qui dit l'import, et les sections qui manquent."""
    lignes = texte.split("\n")
    if not any(l.startswith("## Grammaire") for l in lignes):
        at = next((i for i, l in enumerate(lignes) if l.startswith("## ")), len(lignes))
        lignes[at:at] = ["## Grammaire d'une ligne", "", "```", "```", ""]
    g = next(i for i, l in enumerate(lignes) if l.startswith("## Grammaire"))
    fin_g = _fin_section(lignes, g)
    ouv = next((i for i in range(g + 1, fin_g) if FENCE.match(lignes[i])), None)
    ferm = next((i for i in range(ouv + 1, fin_g) if FENCE.match(lignes[i])), None) if ouv is not None else None
    if ferm is not None:
        lignes[ouv + 1:ferm] = _grammaire(c)
    fin_g = _fin_section(lignes, g)
    declare = next((i for i, l in enumerate(lignes) if AXES_DECLARES.match(l.strip())), None)
    if declare is None:
        while fin_g > g + 1 and lignes[fin_g - 1].strip() == "":
            fin_g -= 1
        lignes[fin_g:fin_g] = [
            "", "- **axe** (premier champ, sans clé) : %s." % ", ".join("`%s`" % a for a in axes), "",
            "Importée le %s : chaque tâche porte son `id:`, unique sur ROADMAP.md et ROADMAP-fait.md ; `prio` vaut "
            "1, 2 ou 3 ; les clés déclarées sont dans `.claude/roadmap.json`." % jour]
    else:
        manquent = [a for a in axes if "`%s`" % a not in lignes[declare]]
        if manquent:
            l = lignes[declare].rstrip()
            point = l.endswith(".")
            lignes[declare] = (l[:-1] if point else l) + "".join(", `%s`" % a for a in manquent) + ("." if point else "")
    if not any(l.startswith("## Cap") for l in lignes):
        g = next(i for i, l in enumerate(lignes) if l.startswith("## Grammaire"))
        at = _fin_section(lignes, g)
        lignes[at:at] = ["## Cap", "", "_À écrire : ce que le projet doit avoir livré, et quand._", ""]
    texte = "\n".join(lignes)
    for s in SECTIONS_OUVERTES + ["Attend"]:
        if not any(l.startswith("## " + s) for l in lignes):
            texte = texte.rstrip("\n") + "\n\n## %s\n" % (s + (" " + qui if s == "Attend" and qui else ""))
    return texte


def _convertir(texte, taches):
    """Le texte avec chaque ligne de tâche remplacée par sa ligne importée, à sa place."""
    lignes = texte.split("\n")
    for t in taches:
        lignes[t["ligne"] - 1] = t["rendu"]
    return "\n".join(lignes)


def _comptes(texte):
    ts = lire_checklist(texte or "")[0]
    return {"ouvertes": sum(1 for t in ts if not t["fait"]), "closes": sum(1 for t in ts if t["fait"])}


def _dossier_roadmap(dossier):
    import onboarding  # import tardif : onboarding importe ce module
    rdir = onboarding.trouver_roadmap(dossier)
    if rdir is None:
        raise Erreur("pas de roadmap dans %s : poser la structure d'abord (init)" % dossier)
    return rdir


def _taches_du_fichier(nom, texte, origine, taches, refuser=True):
    ts, ills = lire_checklist(texte)
    if ills and refuser:
        raise Erreur("%s : ligne %d illisible, à corriger avant l'import : %s" % (nom, ills[0][0], ills[0][1]))
    base = len(taches)
    for t in ts:
        t["origine"] = origine
        if t["mere"] is not None:
            t["mere"] += base
    taches += ts
    return ts


def preparer(dossier, analyse, rdir=None, jour=None):
    """Les fichiers de la roadmap après import, en mémoire, et leur bilan. Lève Erreur, sans rien
    écrire, sur une case illisible, un `id:` en double, une ligne perdue ou un libellé changé.

    Une source qui est le ROADMAP.md du dossier se convertit sur place ; une autre s'insère dans la
    roadmap posée par init : ouvertes dans leur section, closes en tête de « ## Fait »."""
    jour = jour or datetime.date.today().isoformat()
    dossier = os.path.abspath(os.path.expanduser(dossier))
    rdir = rdir or _dossier_roadmap(dossier)
    c = analyse["correspondance"]
    p_ouvert, p_fait = os.path.join(rdir, FICHIER_OUVERT), os.path.join(rdir, FICHIER_FAIT)
    sur_place = os.path.realpath(analyse["source"]) == os.path.realpath(p_ouvert)
    fait_src = analyse.get("fait_source")
    if sur_place and fait_src and os.path.realpath(fait_src) != os.path.realpath(p_fait):
        raise Erreur("la source des tâches closes doit être %s" % p_fait)
    if not os.path.isfile(p_ouvert):
        raise Erreur("pas de %s dans %s : poser la structure d'abord (init)" % (FICHIER_OUVERT, rdir))
    textes = {FICHIER_OUVERT: _lire(p_ouvert),
              FICHIER_FAIT: _lire(p_fait) if os.path.isfile(p_fait) else ("" if sur_place else "# Roadmap : fait\n\n## Fait\n")}
    taches = []
    if sur_place:
        par_fichier = {nom: _taches_du_fichier(nom, textes[nom], o, taches)
                       for nom, o in ((FICHIER_OUVERT, "source"), (FICHIER_FAIT, "fait")) if textes[nom]}
        sources = []
    else:
        for nom in (FICHIER_OUVERT, FICHIER_FAIT):
            _taches_du_fichier(nom, textes[nom], "cible", taches, refuser=False)
        sources = []
        for origine, chemin, fmt in (("source", analyse["source"], analyse["format"]),
                                     ("fait", fait_src, "checklist")):
            if not chemin:
                continue
            ts, ills, _ = charger(chemin, origine, fmt, c)
            if ills:
                raise Erreur("%s : ligne %d illisible, à corriger avant l'import : %s" % (
                    os.path.basename(chemin), ills[0][0], ills[0][1]))
            base = len(taches)
            for t in ts:
                if t["mere"] is not None:
                    t["mere"] += base
            taches += ts
            sources += ts
    for t in taches:
        ids = [v for k, v in t["champs"] if k == "id"]
        if len(ids) > 1:
            raise Erreur("deux id: sur une même ligne (ligne %d) : %s" % (t["ligne"], t["brut"][:80]))
        if ids and not ID.match(ids[0] or ""):
            raise Erreur("id:%s n'est pas un numéro (ligne %d) : un entier, sans # ni zéro devant" % (ids[0], t["ligne"]))
    doubles = [e for e in ecarts_ids(textes[FICHIER_OUVERT], textes[FICHIER_FAIT]) if "porté" in e]
    pris = {champ(t, "id") for t in taches if t["origine"] == "cible" and champ(t, "id")}
    for t in sources:
        i = champ(t, "id")
        if i and i in pris:
            doubles.append("id:%s de la source déjà porté" % i)
        pris.add(i)
    if doubles:
        raise Erreur("numéros en double : %s" % " ; ".join(doubles))
    _numeroter(taches)
    axes = []
    for t in taches:
        if t["origine"] == "cible":
            continue
        t["rendu"] = _ligne_importee(t, taches, c)
        a, _ = appliquer(t, c, avec_defauts=False)
        if a not in axes:
            axes.append(a)
    nouveaux, ajouts = {}, None
    if sur_place:
        for nom, ts in par_fichier.items():
            texte = _convertir(textes[nom], ts)
            nouveaux[nom] = _entete(texte, axes, c, jour, analyse.get("qui") or "") if nom == FICHIER_OUVERT else texte
    else:
        import onboarding  # import tardif : onboarding importe ce module
        ouvert = textes[FICHIER_OUVERT]
        for section in ["En cours", "Prochain", "Plus tard"]:
            lignes = [t["rendu"] for t in sources if not t["fait"] and (t["section"] if t["section"] in SECTIONS_OUVERTES else "Prochain") == section]
            if lignes:
                ouvert = onboarding._inserer(ouvert, section, lignes)
        closes = sorted((t for t in sources if t["fait"]), key=lambda t: t["fait_le"], reverse=True)
        nouveaux[FICHIER_OUVERT] = _ajouter_axes(ouvert, axes)
        nouveaux[FICHIER_FAIT] = onboarding._inserer(textes[FICHIER_FAIT], "Fait", [t["rendu"] for t in closes]) \
            if closes else textes[FICHIER_FAIT]
        ajouts = {FICHIER_OUVERT: [_libelle(t) for t in sources if not t["fait"]],
                  FICHIER_FAIT: [_libelle(t) for t in sources if t["fait"]]}
    bilan = verifier_bilan(textes, nouveaux, ajouts)
    if not sur_place:
        bilan["source"] = {"ouvertes": sum(1 for t in sources if not t["fait"]),
                           "closes": sum(1 for t in sources if t["fait"])}
    return {os.path.join(rdir, nom): t for nom, t in nouveaux.items()}, bilan


def _ajouter_axes(texte, axes):
    """Les axes importés qui manquent à la ligne qui déclare les axes, ajoutés à sa fin."""
    lignes = texte.split("\n")
    at = next((i for i, l in enumerate(lignes) if AXES_DECLARES.match(l.strip())), None)
    if at is None:
        return texte
    manquent = [a for a in axes if "`%s`" % a not in lignes[at]]
    if manquent:
        l = lignes[at].rstrip()
        point = l.endswith(".")
        lignes[at] = (l[:-1] if point else l) + "".join(", `%s`" % a for a in manquent) + ("." if point else "")
    return "\n".join(lignes)


def verifier_bilan(avant, apres, ajouts=None):
    """Comptes par fichier, libellés, numéros uniques : l'avant et l'après d'un import. `ajouts` :
    les libellés insérés par fichier (ouvertes dans ROADMAP.md, closes dans ROADMAP-fait.md)."""
    from collections import Counter
    ajouts = ajouts or {}
    bilan = {"avant": {}, "apres": {}}
    for nom in (FICHIER_OUVERT, FICHIER_FAIT):
        if avant.get(nom) is None:
            continue
        texte_apres = apres.get(nom, avant[nom])
        bilan["avant"][nom], bilan["apres"][nom] = _comptes(avant[nom]), _comptes(texte_apres)
        attendu = dict(bilan["avant"][nom])
        attendu["closes" if nom == FICHIER_FAIT else "ouvertes"] += len(ajouts.get(nom, []))
        if attendu != bilan["apres"][nom]:
            raise Erreur("%s : %s attendues, %s après : une ligne se perdrait" % (nom, attendu, bilan["apres"][nom]))
        l_avant = Counter(_libelle(t) for t in lire_checklist(avant[nom])[0]) + Counter(ajouts.get(nom, []))
        l_apres = Counter(_libelle(t) for t in lire_checklist(texte_apres)[0])
        if l_avant != l_apres:
            perdus = list((l_avant - l_apres).elements())
            raise Erreur("%s : libellé perdu ou changé : « %s »" % (nom, (perdus or list((l_apres - l_avant).elements()))[0][:80]))
    o, f = apres.get(FICHIER_OUVERT, avant.get(FICHIER_OUVERT)), apres.get(FICHIER_FAIT, avant.get(FICHIER_FAIT))
    ecarts = ecarts_ids(o, f, exiger=True)
    if ecarts:
        raise Erreur("numérotation : %s" % " ; ".join(ecarts))
    for nom, texte in ((FICHIER_OUVERT, o), (FICHIER_FAIT, f)):
        for t in lire_checklist(texte or "")[0]:
            if not t["meta"] or not t["brut"].startswith("- ["):
                raise Erreur("%s ligne %d hors grammaire après import : %s" % (nom, t["ligne"], t["brut"][:80]))
    ids = sorted(int(champ(t, "id")) for texte in (o, f) for t in lire_checklist(texte or "")[0])
    bilan["ids"] = [ids[0], ids[-1]] if ids else None
    return bilan


def importer(dossier, chemin_analyse, maintenant=None, rdir=None):
    """Prépare, vérifie, sauvegarde puis écrit l'import ; affiche et renvoie le bilan."""
    maintenant = maintenant or datetime.datetime.now()
    try:
        with open(chemin_analyse, encoding="utf-8") as f:
            analyse = json.load(f)
    except (OSError, ValueError) as e:
        raise Erreur("analyse illisible (%s) : %s" % (chemin_analyse, e))
    dossier = os.path.abspath(os.path.expanduser(dossier))
    rdir = rdir or _dossier_roadmap(dossier)
    fichiers, bilan = preparer(dossier, analyse, rdir, maintenant.date().isoformat())
    p_cfg = os.path.join(dossier, ".claude", "roadmap.json")
    if os.path.isfile(p_cfg):
        with open(p_cfg, encoding="utf-8") as f:
            cfg = json.load(f)
        cles = dict(cfg.get("cles") if isinstance(cfg.get("cles"), dict) else {})
        for k, v in (analyse["correspondance"].get("cles") or {}).items():
            cles.setdefault(k, v)
        if cles != (cfg.get("cles") or {}):
            cfg["cles"] = cles
            fichiers[p_cfg] = json.dumps(cfg, ensure_ascii=False, indent=2) + "\n"
    changes = {p: t for p, t in fichiers.items() if not os.path.isfile(p) or _lire(p) != t}
    bilan["inchange"], bilan["sauvegarde"] = not changes, None
    if changes:
        for p in changes:
            if not os.access(os.path.dirname(p), os.W_OK) or (os.path.exists(p) and not os.access(p, os.W_OK)):
                raise Erreur("%s n'est pas modifiable : rien n'a été écrit" % p)
        bilan["sauvegarde"] = _sauvegarder(rdir, maintenant, changes, analyse)
        _ecrire_tout(changes)
    afficher_bilan(bilan, list(changes))
    return bilan


def _sauvegarder(rdir, maintenant, changes, analyse):
    """Les fichiers remplacés sous leur nom, la source sous `source-<nom>` (`source-fait-<nom>`)."""
    base = os.path.join(rdir, "sauvegarde-import-" + maintenant.strftime("%Y-%m-%d-%H%M%S"))
    sauvegarde, n = base, 1
    while os.path.exists(sauvegarde):
        n += 1
        sauvegarde = "%s-%d" % (base, n)
    os.makedirs(sauvegarde)
    for p in sorted(changes):
        if os.path.isfile(p):
            shutil.copy2(p, os.path.join(sauvegarde, os.path.basename(p)))
    remplaces = {os.path.realpath(x) for x in changes}
    for prefixe, p in (("source-", analyse["source"]), ("source-fait-", analyse.get("fait_source"))):
        if p and os.path.realpath(p) not in remplaces:
            shutil.copy2(p, os.path.join(sauvegarde, prefixe + os.path.basename(p)))
    return sauvegarde


def _ecrire_tout(changes):
    """Écrit chaque fichier à côté de sa cible, puis les met tous en place : une erreur d'écriture
    ne laisse aucun fichier à moitié importé."""
    temporaires = {}
    try:
        for p, t in changes.items():
            tmp = p + ".import-en-cours"
            with open(tmp, "w", encoding="utf-8") as f:
                f.write(t)
            temporaires[p] = tmp
    except OSError as e:
        for tmp in temporaires.values():
            os.remove(tmp)
        raise Erreur("écriture impossible, rien n'a été remplacé : %s" % e)
    for p, tmp in temporaires.items():
        os.replace(tmp, p)


def afficher_bilan(bilan, ecrits):
    print("Bilan de l'import :")
    if bilan.get("source"):
        print("  Source : %d ouvertes, %d closes, toutes reprises" % (bilan["source"]["ouvertes"], bilan["source"]["closes"]))
    for nom, avant in bilan["avant"].items():
        apres = bilan["apres"][nom]
        print("  %s : %d ouvertes, %d closes avant ; %d ouvertes, %d closes après" % (
            nom, avant["ouvertes"], avant["closes"], apres["ouvertes"], apres["closes"]))
    print("  Libellés identiques ; numéros uniques%s." % (" (#%d à #%d)" % tuple(bilan["ids"]) if bilan["ids"] else ""))
    if bilan["inchange"]:
        print("Déjà au format : rien à changer.")
        return
    print("Sauvegarde : %s" % bilan["sauvegarde"])
    print("Import écrit (%d fichier(s)) : %s" % (len(ecrits), ", ".join(os.path.basename(p) for p in ecrits)))
