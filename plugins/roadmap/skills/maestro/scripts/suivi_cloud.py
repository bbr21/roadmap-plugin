#!/usr/bin/env python3
"""Suivi des sessions cloud de Maestro : pour chaque ligne de roadmap prise avec `lieu:cloud`, la PR de sa branche,
son état (aucune, ouverte, en cours, rouges, prête, fusionnée, fermée, ou inconnu si `gh` ne répond pas ; sur une
PR ouverte, « attend une réponse » ou « bloquée » quand la session le dit en tête de son dernier compte rendu, #580) et la
première phrase de son dernier commentaire, l'état que dit la session elle-même (skill maestro, « Mode cloud »).
Une session cloud n'envoie aucune note et n'est pas dans list_sessions : on la suit par sa PR (#408).
Une session cloud lancée hors du ▶ du panneau (carte native, Options puis cloud) n'a pas de ligne prise : une PR dont le
titre porte « #N » en tête (ou « (#N) » en fin) la rattache à la tâche N ouverte et non prise, sa branche tenant lieu
de `branche:` (#445) ; la ligne texte le dit « sans ligne prise ». Une tâche que porte une session du Mac ne se
rattache pas (#573) : la PR « #N » d'un correctif, ouverte par sa session du Mac, n'en fait pas une session cloud. Ces
tâches se lisent dans l'index `task-session-ids` du store du plugin (`~/.claude/plugins/store/roadmap_*.json`, clés
`<projet>:<id>`, archivées comprises), que le panneau tient et applique à sa bande (`macHeldIds`, #571).

#621 (réveil manqué, gardien au repos) : quatre lectures de plus, jumelles de celles du panneau (`reveil-cloud.ts`,
`parse.ts`). (1) `mot_du_compte_rendu` lit l'état aussi sur la dernière ligne ENTIÈRE du bloc de fin « #N prête à
fusionner, PR M » (ou « bloquée », « attend une réponse »), sans Markdown ni accents, une ligne citée (`>`) exceptée,
quand la tête du compte rendu ne le dit pas (« L'étude #428 est livrée … »). (2) `titre_id` lit aussi « N · … » en tête
et « (id:N) » en fin. (3) `lignes_rattachees` rattache aussi une tâche libre à la PR dont la branche est
`prendre_cloud.branche_cloud(nom, id)`, la branche du brief, quel que soit le titre. (4) Avec `avec_orphelines`
(`suivre`, et `main` toujours), une PR OUVERTE (pas d'un fork) que rien ne rattache (sa branche n'est celle d'aucune
ligne, son titre ne donne ni tâche du Mac ni ligne cloud suivie) et dont le dernier compte rendu de son auteur, hors
Maestro, dit un état, se liste : entrée `{"id": None, "orpheline": True, "nom": <titre>, "branche", "etat", …}`, ligne
« PR 51 sans ligne · prête · « … » · <url> ». `suivre` sans `avec_orphelines` ne rend jamais d'entrée à `id` None :
`brief_cloud`, `reco_cloud`, `repli_mac`, `suite_cloud` et `findings` n'en demandent pas. Une entrée prête (état de
la PR ou mot du compte rendu, contrôles rouges ou en cours exceptés) dont le dernier compte rendu prêt a 2 h ou plus
porte `pret_depuis` (la date ISO de ce commentaire, None sinon) et le texte dit « prête depuis 3 h » (heures sous
48 h, puis « depuis 2 j ») ; le « maintenant » s'injecte (`suivre(maintenant=)`, `ligne_texte(t, maintenant)`).

  python3 suivi_cloud.py DEPOT [--json]

Lit DEPOT/roadmap/ROADMAP.md (ou DEPOT/ROADMAP.md) et lance `gh pr list --head <branche> --state all --json …`
pour chaque ligne, dans DEPOT, avec un délai de 20 s. Les appels partent en même temps (8 au plus), en deux phases :
les titres des PR et la PR de chaque ligne cloud, puis la PR de chaque tâche rattachée ; l'ordre du résultat reste
celui de la roadmap. Si DEPOT/.claude/roadmap.json nomme un dépôt GitHub (`depot`, une
roadmap qui vit hors de son dépôt de code, #444), `gh` le vise par `-R`. Lecture seule : rien n'est écrit, aucune PR n'est touchée. `gh`
absent, non connecté, trop lent ou illisible : l'état de la ligne est « inconnu », rien ne lève. Code de retour 2
quand le dépôt ou sa roadmap sont introuvables. Sortie en texte, une ligne par tâche :

  #413 Purger les vieilles sauvegardes · prête · Maestro fusionne · « Prête à fusionner (tests : verts). » · <url>

Une PR dont les comptes rendus portent des findings (#531, `findings.py`) le dit : « 2 findings : findings.py
relever --pr 107 » ; le JSON en donne le nombre (`findings`). Une PR fusionnée ou fermée que le registre ne dit pas
relevée depuis (#558, la trace de `findings.py relever --pr`) le dit aussi, findings ou non : « à relever avant la
clôture : findings.py relever --pr 147 », la clôture de sa ligne étant refusée d'ici là (`tasks.py`) ; le JSON le
donne par `releve`.

Le texte dit le mot du vocabulaire (`mots_etat.mot_pr`, #509) et son détail ; le JSON garde le champ `etat` (le code
d'avant : aucune, ouverte, en cours, rouges, prête, fusionnée, fermée, inconnu, attend une réponse, bloquée) et ajoute
`mot` et `detail`. Un commentaire de Maestro (même compte GitHub que la session) n'est pas son compte rendu : il est
sauté pour `dit`, l'état et les findings (#580).

L'analyse (`etat_pr`, `lignes_cloud`) est pure : elle se teste sur des sorties de `gh` gardées, la commande est
injectée (`run=`).

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import datetime
import json
import os
import re
import subprocess
import sys
import time
import unicodedata
from concurrent.futures import ThreadPoolExecutor

from findings import lire as lire_findings
from mots_etat import ROUGES, mot_pr
from prendre_cloud import branche_cloud

DELAI = 20
MAX_FILS = 8  # appels `gh` simultanés au plus
CHAMPS = "number,url,state,isDraft,mergeable,statusCheckRollup,createdAt,comments,author,isCrossRepository"
# ROUGES vient de mots_etat (#509) : une seule liste des contrôles rouges, celle du panneau.
EN_ATTENTE = {"PENDING", "EXPECTED"}
LIGNE = re.compile(r"^- \[( |x|X)\] (.*)$")
# #445 : le « #N » d'un titre de PR, en tête (« #500 · … », « [#500] … ») ou « (#N) » en fin ; même règle que
# `cloudTitleId` du panneau (hooks/parse.ts).
TITRE_TETE = re.compile(r"^\s*\[?#([1-9]\d*)(?![\d\w])")
TITRE_FIN = re.compile(r"\(#([1-9]\d*)\)\s*$")
# #621 : un numéro nu en tête suivi de « · » (« 428 · Solo mode … ») et « (id:N) » en fin (« … (id:429) »), comme `cloudTitleId`.
TITRE_NU = re.compile(r"^\s*([1-9]\d*)\s*·")
TITRE_ID_FIN = re.compile(r"\(id:([1-9]\d*)\)\s*$")
# #621 : la ligne d'état du bloc de fin d'un compte rendu, entière : « #428 prête à fusionner, PR 50 ».
LIGNE_ETAT = re.compile(r"^#\d+\s+(prete a fusionner|bloquee|attend une reponse)\s*,\s*pr\s+\d+$")
MOTS_ETAT = {"prete a fusionner": "prête", "bloquee": "bloquée", "attend une reponse": "attend une réponse"}
PRETE_APRES_S = 2 * 3600  # une prête plus vieille que ça dit son âge (#621)
CHAMPS_TITRES = "headRefName,title,state,createdAt,isCrossRepository"
CHAMPS_OUVERTES = "number,url,title,headRefName,state,isDraft,createdAt,comments,author,isCrossRepository"
ADOPTION_S = 7 * 24 * 3600
# #573 : le store du plugin, un fichier par copie (`roadmap_<source>.json`), et la clé de son index des sessions du Mac.
STORE = os.path.expanduser("~/.claude/plugins/store")
INDEX_SESSIONS = "task-session-ids"


class ErreurDepot(Exception):
    """Le dépôt ou sa roadmap ne se lisent pas : aucun suivi ne vaut."""


# ---------------------------------------------------------------- analyse (pure)


def lire_ligne(texte):
    """Une ligne de roadmap en `{"close", "libelle", "cles", "brut"}`, ou None. Seul le dernier bloc entre accents
    graves (`[axe | clé:valeur | …]`) fait foi ; le libellé peut citer d'autres blocs."""
    m = LIGNE.match(texte.rstrip())
    if not m:
        return None
    reste = m.group(2)
    if not reste.endswith("]`"):
        return None
    i = reste.rfind("`[")
    if i < 0:
        return None
    cles = {}
    axe = ""
    for n, champ in enumerate(reste[i + 2:-2].split("|")):
        champ = champ.strip()
        if n == 0 and ":" not in champ:
            axe = champ
        if ":" in champ:
            k, v = champ.split(":", 1)
            cles[k.strip()] = v.strip()
    return {"close": m.group(1) != " ", "libelle": reste[:i].strip(), "cles": cles, "axe": axe, "brut": texte.rstrip()}


def lignes_cloud(texte_roadmap):
    """Les lignes non cochées, prises (`branche:`), avec `lieu:cloud` (cette valeur seule) : id, nom, branche."""
    rendu = []
    for brut in texte_roadmap.splitlines():
        ligne = lire_ligne(brut)
        if not ligne or ligne["close"]:
            continue
        c = ligne["cles"]
        if c.get("lieu") != "cloud" or not c.get("branche"):
            continue
        try:
            ident = int(c.get("id", ""))
        except ValueError:
            continue
        rendu.append({"id": ident, "nom": c.get("nom") or ligne["libelle"], "branche": c["branche"]})
    return rendu


def titre_id(titre):
    """Le numéro de tâche d'un titre de PR (#445), ou None : « #N » en tête, « (#N) » en fin et, depuis #621, « N · » nu
    en tête et « (id:N) » en fin. Même règle que `cloudTitleId` du panneau."""
    if not isinstance(titre, str):
        return None
    m = TITRE_TETE.match(titre) or TITRE_NU.match(titre) or TITRE_FIN.search(titre) or TITRE_ID_FIN.search(titre)
    return int(m.group(1)) if m else None


def _date(texte):
    try:
        return datetime.datetime.strptime(texte, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=datetime.timezone.utc).timestamp()
    except (TypeError, ValueError):
        return None


def lignes_rattachees(texte_roadmap, prs, maintenant, tenues=frozenset()):
    """Les tâches ouvertes non prises (sans `branche:`) qu'une PR rattache par le « #N » de son titre (#445) ou, depuis
    #621, par sa branche, celle que le brief a donnée (`branche_cloud` du `nom:` de la ligne, sinon de son libellé) : id,
    nom, branche de la PR. Pas une PR d'un fork, ni celle d'une branche qu'une ligne porte déjà ; l'ouverte l'emporte, sinon
    la plus récente ; une close de plus de 7 jours ne rattache plus. `tenues` : les numéros des tâches qu'une session
    du Mac porte (`tenues_mac`), qu'aucune PR ne rattache (#573 : les correctifs de #510, ouverts par sa session du Mac
    archivée, la listaient en session cloud). Même règle que `cloudAdopted` du panneau."""
    libres, prises, par_branche = {}, set(), {}
    for brut in texte_roadmap.splitlines():
        ligne = lire_ligne(brut)
        if not ligne:
            continue
        c = ligne["cles"]
        if c.get("branche"):
            prises.add(c["branche"])
            continue
        if ligne["close"]:
            continue
        try:
            ident = int(c.get("id", ""))
        except ValueError:
            continue
        if ident not in tenues:
            libres[ident] = c.get("nom") or ligne["libelle"]
            par_branche.setdefault(branche_cloud(libres[ident], ident), ident)
    meilleure = {}
    for p in prs if isinstance(prs, list) else []:
        if not isinstance(p, dict) or p.get("isCrossRepository"):
            continue
        ident, tete = titre_id(p.get("title")), p.get("headRefName")
        if ident not in libres and isinstance(tete, str):
            ident = par_branche.get(tete)
        if ident not in libres or not isinstance(tete, str) or not tete or tete in prises:
            continue
        quand = _date(p.get("createdAt"))
        ouverte = p.get("state") == "OPEN"
        if not ouverte and (quand is None or maintenant - quand > ADOPTION_S):
            continue
        rang = (1 if ouverte else 0, quand if quand is not None else float("-inf"))
        if ident not in meilleure or rang > meilleure[ident][0]:
            meilleure[ident] = (rang, tete)
    return [{"id": i, "nom": libres[i], "branche": meilleure[i][1], "rattachee": True} for i in sorted(meilleure)]


def premiere_phrase(corps):
    """La première phrase d'un commentaire, sans le Markdown de tête (`**`, `#`, `>`), ou « »."""
    for ligne in (corps or "").splitlines():
        ligne = ligne.replace("*", "").strip().lstrip("#> ").strip()
        if not ligne:
            continue
        m = re.search(r"[.!?…](\s|$)", ligne)
        return ligne[:m.start() + 1].strip() if m else ligne
    return ""


def _controles(pr):
    """(rouge, en cours) d'après `statusCheckRollup` : des CheckRun (status, conclusion) et des StatusContext (state)."""
    rouge = attente = False
    for c in pr.get("statusCheckRollup") or []:
        etat = (c.get("state") or "").upper()
        conclusion = (c.get("conclusion") or "").upper()
        if conclusion in ROUGES or etat in ROUGES:
            rouge = True
        elif etat in EN_ATTENTE or (etat == "" and conclusion == ""):
            attente = True
    return rouge, attente


def _tete(corps):
    """La première ligne non vide d'un commentaire, sans Markdown (`*`, `_`, `>`, `#` de titre) ni accents, en minuscules
    (même lecture que `headLine` de hooks/reveil-cloud.ts)."""
    for ligne in (corps or "").splitlines():
        ligne = ligne.replace("*", "").replace("_", "").strip()
        ligne = re.sub(r"^[>\s]+", "", ligne)
        ligne = re.sub(r"^#+\s+", "", ligne).strip()
        if ligne:
            sans = unicodedata.normalize("NFD", ligne)
            return "".join(c for c in sans if not unicodedata.combining(c)).lower()
    return ""


def commentaire_maestro(corps):
    """Vrai quand le commentaire est de Maestro et non de la session (#580) : Maestro commente sous le même compte
    GitHub que la session (PR 156 de #566, « Maestro → session de #566 : … » ; PR 164). Sa première ligne commence par
    « Maestro » ou « Gardien », par « ligne close par Maestro » (#483) ou par « #N publiée » (#409). Jumelle de
    `isMaestroComment` de hooks/reveil-cloud.ts."""
    t = _tete(corps)
    return bool(re.match(r"(maestro|gardien)\b", t) or t.startswith("ligne close par maestro")
                or re.match(r"#\d+\s+publiee\b", t))


def mot_du_compte_rendu(corps):
    """L'état que dit la session en tête de son compte rendu : « prête », « bloquée », « attend une réponse », ou None.
    Un « #N » de tête se tolère (« #576 attend une réponse, PR 164 »). Sinon (#621), la dernière ligne ENTIÈRE du bloc de
    fin de la forme « #N prête à fusionner, PR M » (ou « bloquée », « attend une réponse »), sans Markdown ni accents :
    la première phrase d'un compte rendu ne dit pas toujours l'état (« L'étude #428 est livrée … »). Une ligne citée
    (`>`) ne compte pas. Jumelle de `wakeWordOf` de reveil-cloud.ts."""
    t = re.sub(r"^#\d+\s*[·:-]?\s*", "", _tete(corps))
    for debut, mot in (("attend une reponse", "attend une réponse"), ("bloquee", "bloquée"),
                       ("prete a fusionner", "prête")):
        if t.startswith(debut):
            return mot
    trouve = None
    for ligne in (corps or "").splitlines():
        if ligne.strip().startswith(">"):
            continue
        ligne = unicodedata.normalize("NFD", ligne.replace("*", "").replace("_", "").strip())
        m = LIGNE_ETAT.match("".join(c for c in ligne if not unicodedata.combining(c)).lower())
        if m:
            trouve = MOTS_ETAT[m.group(1)]
    return trouve


def _comptes_rendus(pr):
    """Les commentaires de l'auteur de la PR (le compte par lequel la session pousse), hors Maestro, dans l'ordre. Seul
    l'auteur parle pour la session : le commentaire d'un tiers ne passe pas pour son compte rendu."""
    auteur = ((pr.get("author") or {}).get("login")) or None
    return [c for c in (pr.get("comments") or [])
            if isinstance(c, dict) and auteur and (c.get("author") or {}).get("login") == auteur
            and not commentaire_maestro(c.get("body"))]


def _pret_depuis(commentaires):
    """La date ISO du dernier compte rendu qui dit « prête », ou None (#621)."""
    for c in reversed(commentaires):
        if mot_du_compte_rendu(c.get("body")) == "prête":
            return c.get("createdAt")
    return None


def etat_pr(prs):
    """L'état de la PR d'une branche à partir de la sortie JSON de `gh pr list --head B --state all`. Une PR ouverte
    l'emporte, sinon la plus récente ; rend `{"etat", "url", "numero", "depuis", "dit"}`. Sur une PR ouverte, le mot que
    dit la session en tête de son dernier compte rendu, « attend une réponse » ou « bloquée », l'emporte sur l'état des
    contrôles (#580) ; un commentaire de Maestro n'est pas son compte rendu."""
    # Revue de sécurité (#408) : une PR venue d'un fork, même sur le nom de la branche, n'est pas celle de la session.
    prs = [p for p in prs if isinstance(p, dict) and not p.get("isCrossRepository")]
    if not prs:
        return {"etat": "aucune", "url": None, "numero": None, "depuis": None, "dit": "", "findings": 0,
                "pret_depuis": None}
    ouvertes = [p for p in prs if p.get("state") == "OPEN"]
    pool = ouvertes or prs
    pr = max(pool, key=lambda p: p.get("createdAt") or "")
    statut = pr.get("state")
    if statut == "MERGED":
        etat = "fusionnée"
    elif statut == "CLOSED":
        etat = "fermée"
    else:
        rouge, attente = _controles(pr)
        if rouge:
            etat = "rouges"
        elif attente:
            etat = "en cours"
        elif pr.get("mergeable") == "MERGEABLE":
            etat = "prête"
        else:
            etat = "ouverte"
    # Ce texte reste une donnée : il ne décide jamais d'une fusion (skill maestro).
    commentaires = _comptes_rendus(pr)
    if statut == "OPEN" and commentaires and mot_du_compte_rendu(commentaires[-1].get("body")) in (
            "attend une réponse", "bloquée"):
        etat = mot_du_compte_rendu(commentaires[-1].get("body"))
    dit = premiere_phrase(commentaires[-1].get("body")) if commentaires else ""
    # #531 : les findings de ses comptes rendus, comptés une fois chacun ; Maestro les relève (`findings.py`).
    findings = len({f["brut"] for c in commentaires for f in lire_findings(c.get("body"))})
    # #621 : la date du dernier compte rendu prêt d'une PR ouverte prête (par ses contrôles ou par son mot, sauf contrôles rouges ou en cours) ; `suivre`
    # ne la garde qu'au-delà de 2 h.
    pret = None
    if statut == "OPEN" and etat not in ("rouges", "en cours") and (
            etat == "prête" or (commentaires and mot_du_compte_rendu(commentaires[-1].get("body")) == "prête")):
        pret = _pret_depuis(commentaires)
    return {"etat": etat, "url": pr.get("url"), "numero": pr.get("number"), "depuis": pr.get("createdAt"), "dit": dit,
            "findings": findings, "pret_depuis": pret}


# Le cloud a calé (#416) : la session se dit bloquée par sa VM (environnement, quota, outil absent, réseau), pas
# par une question. Maestro replie alors la tâche sur le Mac (`repli_mac.py`), sa branche gardée.
CALEE = re.compile(r"environnement|quota|limite d'usage|usage|outil absent|introuvable|absent|vm\b|réseau|reseau|"
                   r"installation|non installé|command not found")


def calee(dit):
    """Vrai quand le compte rendu de la session cloud dit qu'elle est bloquée par le cloud lui-même."""
    t = (dit or "").strip().lower()
    return t.startswith("bloquée") and bool(CALEE.search(t))


# ---------------------------------------------------------------- entrées-sorties


def run_gh(cmd, cwd):
    """Lance la commande et rend sa sortie ; lève si elle échoue, est absente ou dépasse le délai."""
    return subprocess.run(cmd, cwd=cwd, check=True, capture_output=True, text=True, timeout=DELAI).stdout


def lire_roadmap(depot):
    for rel in (os.path.join("roadmap", "ROADMAP.md"), "ROADMAP.md"):
        chemin = os.path.join(depot, rel)
        if os.path.isfile(chemin):
            with open(chemin, encoding="utf-8") as f:
                return f.read()
    raise ErreurDepot("roadmap introuvable dans %s" % depot)


DEPOT_GITHUB = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_.-]*/[A-Za-z0-9][A-Za-z0-9_.-]*$")
ADRESSE_GITHUB = re.compile(
    r"^(?:git@github\.com:|(?:ssh://git@|https?://|git://)github\.com[:/])"
    r"([A-Za-z0-9][A-Za-z0-9_.-]*)/([A-Za-z0-9][A-Za-z0-9_.-]*?)(?:\.git)?/?$"
)


def depot_github(depot):
    """`owner/repo` que nomme `depot` de DEPOT/.claude/roadmap.json (#444) ; None sans clé, ou valeur douteuse."""
    try:
        with open(os.path.join(depot, ".claude", "roadmap.json"), encoding="utf-8") as f:
            v = json.load(f).get("depot")
    except (OSError, ValueError, AttributeError):
        return None
    if not isinstance(v, str):
        return None
    v = v.strip()
    if DEPOT_GITHUB.match(v):
        return re.sub(r"\.git$", "", v)
    m = ADRESSE_GITHUB.match(v)
    return "%s/%s" % (m.group(1), m.group(2)) if m else None


def nom_projet(depot):
    """Le nom du projet, celui des clés de l'index du store : `name` de DEPOT/.claude/roadmap.json, sinon le nom du
    dossier (même règle que le panneau, `parseProjectConfig`)."""
    try:
        with open(os.path.join(depot, ".claude", "roadmap.json"), encoding="utf-8") as f:
            v = json.load(f).get("name")
    except (OSError, ValueError, AttributeError):
        v = None
    return v if isinstance(v, str) and v else os.path.basename(os.path.abspath(depot))


def tenues_mac(depot, store=None):
    """Les numéros des tâches du projet qu'une session du Mac porte, archivées comprises (#573) : les clés
    `<projet>:<id>` de l'index `task-session-ids`, dans chaque copie du store du plugin (`roadmap_*.json`). Une session
    cloud n'y entre jamais : le panneau ne le remplit que de `list_sessions`. Store absent ou illisible (une VM, un
    Mac sans le plugin) : aucune, rien ne lève."""
    store = STORE if store is None else store
    tete, rendu = nom_projet(depot) + ":", set()
    try:
        noms = sorted(os.listdir(store))
    except OSError:
        return rendu
    for nom in noms:
        if not (nom.startswith("roadmap_") and nom.endswith(".json")):
            continue
        try:
            with open(os.path.join(store, nom), encoding="utf-8") as f:
                index = json.load(f).get(INDEX_SESSIONS)
        except (OSError, ValueError, AttributeError):
            continue
        if isinstance(index, dict) and isinstance(index.get("value"), dict):
            index = index["value"]
        for cle in index if isinstance(index, dict) else ():
            if isinstance(cle, str) and cle.startswith(tete) and cle[len(tete):].isdigit():
                rendu.add(int(cle[len(tete):]))
    return rendu


def prs_relevees(depot):
    """Les numéros des PR relevées une fois fusionnées ou fermées (#558) : les traces du registre des findings.
    Registre absent ou illisible : aucune."""
    from findings import FINIE, REGISTRE, est_trace

    for rel in ("roadmap", ""):
        try:
            with open(os.path.join(depot, rel, REGISTRE), encoding="utf-8") as f:
                registre = json.load(f)
        except (OSError, ValueError):
            continue
        return {e["pr"] for e in registre if isinstance(e, dict) and est_trace(e) and e.get("etat") in FINIE} \
            if isinstance(registre, list) else set()
    return set()


def pr_de(depot, branche, run, repo=None):
    cmd = ["gh", "pr", "list", "--head", branche, "--state", "all", "--limit", "20", "--json", CHAMPS]
    if repo:
        cmd += ["-R", repo]
    try:
        prs = json.loads(run(cmd, depot))
    except (OSError, subprocess.SubprocessError, ValueError):
        return {"etat": "inconnu", "url": None, "numero": None, "depuis": None, "dit": "", "findings": 0,
                "pret_depuis": None}
    if not isinstance(prs, list):
        return {"etat": "inconnu", "url": None, "numero": None, "depuis": None, "dit": "", "findings": 0,
                "pret_depuis": None}
    return etat_pr(prs)


def titres_prs(depot, run, repo=None):
    """Les PR du dépôt avec leur titre (#445), lues sur `repo` s'il est nommé (#444) ; [] si `gh` ne répond pas."""
    cmd = ["gh", "pr", "list", "--state", "all", "--limit", "100", "--json", CHAMPS_TITRES]
    if repo:
        cmd += ["-R", repo]
    try:
        prs = json.loads(run(cmd, depot))
    except (OSError, subprocess.SubprocessError, ValueError):
        return []
    return prs if isinstance(prs, list) else []


def prs_ouvertes(depot, run, repo=None):
    """Les PR ouvertes du dépôt avec leurs commentaires (#621) ; [] si `gh` ne répond pas, rien ne lève."""
    cmd = ["gh", "pr", "list", "--state", "open", "--limit", "100", "--json", CHAMPS_OUVERTES]
    if repo:
        cmd += ["-R", repo]
    try:
        prs = json.loads(run(cmd, depot))
    except (OSError, subprocess.SubprocessError, ValueError):
        return []
    return prs if isinstance(prs, list) else []


def _age_prete(pret_depuis, maintenant):
    """La date ISO du dernier compte rendu prêt si elle a 2 h ou plus, sinon None (#621)."""
    quand = _date(pret_depuis)
    return pret_depuis if quand is not None and maintenant - quand >= PRETE_APRES_S else None


def _orpheline(p, maintenant):
    """L'entrée d'une PR ouverte sans ligne : son dernier compte rendu dit un état, sinon None (#621). `id` est None."""
    commentaires = _comptes_rendus(p)
    mot = mot_du_compte_rendu(commentaires[-1].get("body")) if commentaires else None
    if mot is None:
        return None
    t = {"id": None, "nom": p.get("title") or p["headRefName"], "branche": p["headRefName"], "orpheline": True,
         "etat": mot, "url": p.get("url"), "numero": p.get("number"), "depuis": p.get("createdAt"),
         "dit": premiere_phrase(commentaires[-1].get("body")),
         "findings": len({f["brut"] for c in commentaires for f in lire_findings(c.get("body"))}),
         "pret_depuis": _pret_depuis(commentaires) if mot == "prête" else None}
    t["mot"], t["detail"] = mot_pr(mot)
    return t


def branches_prises(texte_roadmap):
    """Les `branche:` de toutes les lignes de la roadmap, closes comprises : la PR d'une ligne n'est jamais « sans ligne »."""
    rendu = set()
    for brut in texte_roadmap.splitlines():
        ligne = lire_ligne(brut)
        if ligne and ligne["cles"].get("branche"):
            rendu.add(ligne["cles"]["branche"])
    return rendu


def suivre(depot, run=None, maintenant=None, store=None, avec_orphelines=False):
    """Une entrée par ligne `lieu:cloud` prise, puis par tâche non prise qu'une PR « #N » rattache (#445), sauf celle
    qu'une session du Mac porte (#573, `tenues_mac`, lu dans `store`) : id, nom, branche et l'état de sa PR. Avec
    `avec_orphelines` (#621), puis une entrée à `id` None (`orpheline: True`) par PR ouverte du dépôt que rien ne
    rattache (ni ligne, ni branche d'une ligne, ni titre, ni tâche du Mac) et dont le compte rendu dit un état ; les
    consommateurs d'entrées à `id` ne le demandent pas."""
    run = run or run_gh
    repo = depot_github(depot)
    texte = lire_roadmap(depot)
    cloud = lignes_cloud(texte)
    vues = {l["id"] for l in cloud}
    quand = time.time() if maintenant is None else maintenant
    # Les appels `gh` partent en même temps (2,9 s à la suite, audit #514), en deux phases : les titres et la
    # PR de chaque ligne cloud ; puis la PR de chaque rattachée, qui dépend des titres. `map` garde l'ordre des lignes.
    with ThreadPoolExecutor(max_workers=max(1, min(MAX_FILS, len(cloud) + 2))) as pool:
        futur_titres = pool.submit(titres_prs, depot, run, repo)
        futur_ouvertes = pool.submit(prs_ouvertes, depot, run, repo) if avec_orphelines else None
        etats = list(pool.map(lambda l: pr_de(depot, l["branche"], run, repo), cloud))
        titres = futur_titres.result()
        ouvertes = futur_ouvertes.result() if futur_ouvertes else []
    rattachees = [l for l in lignes_rattachees(texte, titres, quand) if l["id"] not in vues]
    tenues = None
    if rattachees:  # #573 : le store ne se lit que si une PR rattacherait une tâche.
        tenues = tenues_mac(depot, store)
        rattachees = [l for l in rattachees if l["id"] not in tenues]
    if rattachees:
        with ThreadPoolExecutor(max_workers=min(MAX_FILS, len(rattachees))) as pool:
            etats += list(pool.map(lambda l: pr_de(depot, l["branche"], run, repo), rattachees))
    rendu, relevees = [], prs_relevees(depot)
    for l, e in zip(cloud + rattachees, etats):
        t = dict(l, **e)
        t["releve"] = t["numero"] in relevees
        t["mot"], t["detail"] = mot_pr(t["etat"])
        t["pret_depuis"] = _age_prete(t.get("pret_depuis"), quand)
        rendu.append(t)
    if ouvertes:
        suivies = {t["branche"] for t in rendu} | branches_prises(texte)
        candidates = [p for p in ouvertes if isinstance(p, dict) and not p.get("isCrossRepository")
                      and p.get("state", "OPEN") == "OPEN" and isinstance(p.get("headRefName"), str)
                      and p["headRefName"] and p["headRefName"] not in suivies]
        orphelines = [(p, _orpheline(p, quand)) for p in candidates]
        orphelines = [(p, t) for p, t in orphelines if t]
        if orphelines:
            if tenues is None:
                tenues = tenues_mac(depot, store)
            for p, t in orphelines:
                if titre_id(p.get("title")) in tenues or titre_id(p.get("title")) in vues:
                    continue  # la tâche d'une session du Mac (#573) ou d'une ligne cloud suivie : pas « sans ligne »
                t["pret_depuis"] = _age_prete(t["pret_depuis"], quand)
                rendu.append(t)
    return rendu


def _depuis(pret_depuis, maintenant):
    """« depuis 3 h » (heures en dessous de 48 h), puis « depuis 2 j » ; vide sans date (#621)."""
    quand = _date(pret_depuis)
    if quand is None:
        return ""
    s = max(0, (time.time() if maintenant is None else maintenant) - quand)
    return " depuis %d h" % (s // 3600) if s < 48 * 3600 else " depuis %d j" % (s // 86400)


def ligne_texte(t, maintenant=None):
    """La ligne texte d'une entrée ; `maintenant` (secondes) sert à l'âge d'une prête (#621), l'heure courante sinon."""
    age = _depuis(t.get("pret_depuis"), maintenant)
    if t.get("orpheline"):
        parts = ["PR %s sans ligne" % t["numero"], (t["mot"] + age) if t["mot"] == "prête" else t["mot"], t["detail"]]
        if t["dit"]:
            parts.append("« %s »" % t["dit"])
        if t.get("findings"):
            parts.append("%d finding%s : findings.py relever --pr %s" % (
                t["findings"], "s" if t["findings"] > 1 else "", t["numero"]))
        parts.append(t["url"] or t["branche"])
        return " · ".join(p for p in parts if p)
    parts = ["#%d %s" % (t["id"], t["nom"])]
    if t.get("rattachee"):
        parts.append("sans ligne prise (%s)" % t["branche"])
    mot, detail = mot_pr(t["etat"])
    parts += [mot, detail]
    if age and t["etat"] != "fusionnée":
        parts.append("prête" + age)
    if t["etat"] not in ("aucune", "inconnu"):
        if t["dit"]:
            parts.append("« %s »" % t["dit"])
        if calee(t["dit"]):
            parts.append("calée : repli_mac.py")
        if t.get("findings"):
            parts.append("%d finding%s : findings.py relever --pr %s" % (
                t["findings"], "s" if t["findings"] > 1 else "", t["numero"]))
        elif t["etat"] in ("fusionnée", "fermée") and t.get("releve") is False:
            parts.append("à relever avant la clôture : findings.py relever --pr %s" % t["numero"])
        if t["url"]:
            parts.append(t["url"])
    return " · ".join(parts)


def main(argv=None, run=None):
    p = argparse.ArgumentParser(description="Suivi des sessions cloud de Maestro, par leur PR.")
    p.add_argument("depot")
    p.add_argument("--json", action="store_true", dest="en_json")
    a = p.parse_args(argv)
    try:
        taches = suivre(a.depot, run=run, avec_orphelines=True)
    except ErreurDepot as e:
        print("suivi_cloud : %s" % e, file=sys.stderr)
        return 2
    if a.en_json:
        print(json.dumps(taches, ensure_ascii=False, indent=2))
    elif not taches:
        print("Aucune ligne lieu:cloud prise, ni PR « #N » d'une tâche non prise, ni PR ouverte sans ligne qui dise son état.")
    else:
        quand = time.time()
        print("\n".join(ligne_texte(t, quand) for t in taches))
    return 0


if __name__ == "__main__":
    sys.exit(main())
