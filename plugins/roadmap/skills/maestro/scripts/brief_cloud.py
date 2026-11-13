#!/usr/bin/env python3
"""Brief d'une session cloud de Maestro : écrit sur la sortie standard le brief entier d'une ligne de roadmap
`lieu:cloud`, qui se suffit sans plugin (la session cloud n'en charge pas) : les lignes Mission, Fichiers (si le
plan de la spec cite des chemins) et Fini quand, `---`, la ligne recopiée, la branche, puis les règles de
`docs/session-cloud.md` par leur chemin (skill maestro, « Mode cloud », #408), et les réglages de session de la
personne pour ce projet (#449), que la VM ne reçoit pas du plugin.

  python3 brief_cloud.py DEPOT ID [--branche BRANCHE] [--reglages FICHIER]

#458 : Maestro pose sa carte cloud avant la prise, qui n'a lieu qu'au départ de la session (`prendre_cloud.py`) :
une ligne pas encore prise (sans `branche:`) se brief avec `--branche`, la branche que la prise posera ; la ligne
citée est celle qu'écrira la prise (`prendre_cloud.prendre`), et rien n'est écrit ici. #474 : sous la branche, la
consigne `REGLE_DEPART` fait pousser la branche dans la première minute, que le panneau guette pour prendre la ligne. Une ligne déjà prise garde sa
branche (`--branche` doit alors la redire).

Les réglages se lisent dans ~/.claude/reglages-session.json (ou FICHIER) comme le plugin les lit (sessionPrefs de
hooks/parse.ts) : les clés du haut, puis le bloc de `projets` dont la clé désigne DEPOT ; sans fichier, les défauts
(tout oui, autonome non). Le panneau écrit la même ligne (cloudPrefsLine).

Une tâche de rendu se clôt à sa publication et sa preuve de fidélité part en tâche à part, « Prouver la fidélité
de #N » (#455) : chaque brief le rappelle en une ligne, et celui d'une telle tâche dit ce qu'elle attend (la capture
collée dans la session), le chantier de #N (son `spec:`, lu dans ROADMAP-fait.md ou ROADMAP.md) et son « Fini
quand » à elle : `fidelite.py verifier` vert, chaque écart confié à sa tâche de correctif.

Lit DEPOT/roadmap/ROADMAP.md (ou DEPOT/ROADMAP.md) et, pour le nom du projet, DEPOT/.claude/roadmap.json (clé
« name », sinon le nom du dossier). Lecture seule. Code de retour 2 (message sur stderr) pour une ligne absente,
close, non prise sans `--branche` (le message propose la branche du panneau), prise par une autre branche ou sans
`lieu:cloud`, ou une roadmap introuvable.

#490 : la carte cloud ne porte ni `model` ni `effort` (start_session les ignore en cloud) : la ligne qui suit « Fini quand »
dit ce que BBR choisit dans les Options de la carte (la charge et le modèle de `reco_cloud.py`), et un paragraphe
« Ton modèle » redit la charge, puis la consigne #327 : chaque étape du plan chez un sous-agent Sonnet. Il ne demande
plus à la session de changer de modèle elle-même (#559 : `set_session_model` et `set_session_effort` manquent dans la
VM). Mêmes textes que `cloudBriefText` du panneau.

#559 : le compte rendu finit par un bloc de trois lignes que la personne colle dans Maestro (`REGLE_BLOC_DE_FIN`) :
l'état et la PR, le compte des findings avec la commande qui les relève, ce qui revient à Maestro.

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import datetime
import json
import os
import re
import sys

import prendre_cloud
import reco_cloud
import suivi_cloud


FICHIER_REGLAGES = "~/.claude/reglages-session.json"
DEFAUTS = {"questions": True, "adhd": True, "francais": True, "autonome": False}
ENTETE_REGLAGES = "Tes réglages de session (lus au Mac au lancement) : "
CONSIGNE_REGLAGES = ". Leur consigne en cloud : `docs/session-cloud.md`, « La méthode et les réglages »."

PREUVE = re.compile(r"^Prouver la fidélité de #(\d+)\b")
REGLE_RENDU = (
    "Un rendu codé d'après une maquette : ta ligne se clôt à sa publication et sa preuve de fidélité part en tâche "
    "à part, « Prouver la fidélité de #N » (#455), qui ne retient ni ta tâche ni aucune autre (docs/session-cloud.md, "
    "« Un chantier de rendu »)."
)

# #537 : le bloc fixe qui ouvre le compte rendu « prête », que Maestro lit sans ouvrir la session. `REGLE_BLOC` est la
# ligne du brief, mot pour mot celle du panneau (`CLOUD_REPORT_BLOCK_RULE`, hooks/parse.ts). `BLOC` est son gabarit,
# tel que le définit `reportBlockLines` du plugin et que le citent docs/session-cloud.md et la skill maestro
# (`%(qui)s` : la personne, sous son nom) ; `test_brief_cloud.py` compare les quatre.
REGLE_BLOC = (
    "Ton compte rendu « prête » s'ouvre, sous sa première phrase, par le bloc fixe que Maestro lit sans ouvrir ta "
    "session (#537) : la ligne `**Compte rendu**`, puis six puces, toutes, dans cet ordre : PR (son numéro et sa "
    "tête), Tests (chaque commande, verte ou rouge, son compte), Écarts au brief, Pour Maestro, Pour la personne "
    "(sous son nom), Méthode non suivie ; une puce sans rien à dire le dit d'un mot. Son gabarit : "
    "`docs/session-cloud.md`, « Le bloc fixe du compte rendu »."
)
BLOC = (
    "**Compte rendu**",
    "- **PR** : #<numéro>, tête <sha court>",
    "- **Tests** : <chaque commande, verte ou rouge, son compte de tests passés sur lancés>",
    "- **Écarts au brief** : <ce que le brief demandait et qui manque ou diffère, et pourquoi>",
    "- **Pour Maestro** : <ce qui lui revient en plus de la fusion : une ligne pas prise, un fichier à régénérer>",
    "- **Pour %(qui)s** : <son geste ou son choix, avec où et comment>",
    "- **Méthode non suivie** : <la skill ou l'étape de méthode sautée, et pourquoi>",
)

# #474 : la branche poussée au départ, le panneau la voit sur origin et prend la ligne sans attendre que Maestro se
# réveille ; `briefBranchOf` de hooks/prise-cloud.ts lit la branche dans la phrase « Travaille sur la branche … ».
REGLE_DEPART = (
    "Pousse cette branche dans ta première minute, avant tout autre geste qui dure : `git commit --allow-empty -m "
    "\"Départ de la session cloud\"` puis `git push -u origin %(branche)s`. C'est ce départ que voit le panneau du Mac "
    "pour prendre ta ligne (#474)."
)


# #490 : le modèle de la tâche, dit dans le brief (la carte cloud ne le porte pas).
OPTIONS_SUITE = ", à choisir dans Options avant Start : la carte cloud ne les porte pas."
CONSIGNE_327 = (
    "Économie (#327) : le cadrage, la spec et le plan se font ici ; chaque étape du plan part chez un sous-agent avec "
    "`model: \"sonnet\"` passé à l'outil Agent. Tu relis le diff de chaque étape et reprends la main sur un test rouge "
    "qui résiste à deux essais."
)
NOMS_CHARGES = {"retouche": "une retouche", "normale": "une tâche normale", "lourde": "une tâche lourde"}


def ligne_options(mots):
    return "Options de la carte (#490) : " + mots + OPTIONS_SUITE


def paragraphe_modele(charge):
    m, e = reco_cloud.modele(charge)
    return "Ton modèle (#490) : cette tâche est %s, prévue en %s, effort %s. %s" % (
        NOMS_CHARGES[charge], reco_cloud.NOMS_MODELES[m], e, CONSIGNE_327)


# #496, #559 : le bloc de fin que la personne colle dans Maestro, même texte que `cloudEndBlockRule` du panneau. Sa
# première ligne reste celle de #496, la seule que lit le panneau ; les findings n'y sont qu'en compte et en commande.
REGLE_BLOC_DE_FIN = (
    "Ton compte rendu « prête », « bloquée » ou « attend une réponse » (dernier commentaire de ta PR et message "
    "de fin) finit par un bloc de trois lignes à coller dans Maestro, rien après lui : `#%s prête à fusionner, PR "
    "<numéro>` (ou « bloquée », « attend une réponse »), que le panneau du Mac lit aussi ; puis `Findings : <n> à "
    "relever (findings.py relever --pr <numéro>)` ou `Findings : aucun` ; puis `Pour Maestro : <ce qui lui revient>` "
    "ou `Pour Maestro : rien`. Tes findings n'y sont qu'en compte et en commande, jamais recopiés : ta PR reste leur "
    "seule source."
)


def regle_bloc_de_fin(ident):
    return REGLE_BLOC_DE_FIN % ident


class ErreurLigne(Exception):
    """La ligne demandée ne se lance pas en cloud."""


def nom_projet(depot):
    try:
        with open(os.path.join(depot, ".claude", "roadmap.json"), encoding="utf-8") as f:
            nom = json.load(f).get("name")
        if isinstance(nom, str) and nom.strip():
            return nom.strip()
    except (OSError, ValueError, AttributeError):
        pass
    return os.path.basename(os.path.abspath(depot))


def ligne_de(depot, ident):
    """La ligne ouverte #ident de DEPOT, lue (ErreurLigne si absente ou close), sans rien exiger de sa prise."""
    for rel in ("roadmap/ROADMAP.md", "ROADMAP.md"):
        chemin = os.path.join(depot, rel)
        if os.path.isfile(chemin):
            break
    else:
        raise ErreurLigne("roadmap introuvable dans %s" % depot)
    with open(chemin, encoding="utf-8") as f:
        for brut in f.read().splitlines():
            ligne = suivi_cloud.lire_ligne(brut)
            if ligne and ligne["cles"].get("id") == str(ident):
                if ligne["close"]:
                    raise ErreurLigne("#%s : ligne close" % ident)
                return ligne
    raise ErreurLigne("#%s : ligne absente de %s" % (ident, rel))


def trouver_ligne(depot, ident, branche=None, aujourdhui=None):
    """(chemin relatif de la roadmap, ligne lue, prise ou non) ; ErreurLigne si elle ne se lance pas en cloud.
    Une ligne pas encore prise rend la ligne qu'écrira la prise à `branche` (#458), sans rien écrire."""
    for rel in ("roadmap/ROADMAP.md", "ROADMAP.md"):
        chemin = os.path.join(depot, rel)
        if os.path.isfile(chemin):
            break
    else:
        raise suivi_cloud.ErreurDepot("roadmap introuvable dans %s" % depot)
    with open(chemin, encoding="utf-8") as f:
        texte = f.read()
    for brut in texte.splitlines():
        ligne = suivi_cloud.lire_ligne(brut)
        if ligne and ligne["cles"].get("id") == str(ident):
            break
    else:
        raise ErreurLigne("#%s : ligne absente de %s" % (ident, rel))
    c = ligne["cles"]
    if ligne["close"]:
        raise ErreurLigne("#%s : ligne close" % ident)
    if not c.get("branche"):
        if not branche:
            propre = prendre_cloud.branche_cloud(c.get("nom") or ligne["libelle"], ident)
            raise ErreurLigne("#%s : ligne non prise : passe --branche %s (la branche que la prise posera au départ "
                              "de la session)" % (ident, propre))
        try:
            _, prise = prendre_cloud.prendre(texte, str(ident), branche,
                                             aujourdhui or datetime.date.today().isoformat())
        except prendre_cloud.ErreurPrise as e:
            raise ErreurLigne(str(e))
        return rel, suivi_cloud.lire_ligne(prise), False
    if not c.get("qui"):
        raise ErreurLigne("#%s : ligne non prise (qui: et branche: attendus)" % ident)
    if branche and branche != c["branche"]:
        raise ErreurLigne("#%s : ligne déjà prise par %s, pas par %s" % (ident, c["branche"], branche))
    if c.get("lieu") != "cloud":
        raise ErreurLigne("#%s : pas de lieu:cloud" % ident)
    return rel, ligne, True


def chantier_de(depot, rel, ident):
    """Le `spec:` de la ligne #ident, lue dans la roadmap puis dans ROADMAP-fait.md à côté ; None sinon."""
    dossier = os.path.dirname(rel)
    for nom in ("ROADMAP.md", "ROADMAP-fait.md"):
        try:
            with open(os.path.join(depot, dossier, nom), encoding="utf-8") as f:
                texte = f.read()
        except OSError:
            continue
        for brut in texte.splitlines():
            ligne = suivi_cloud.lire_ligne(brut)
            if ligne and ligne["cles"].get("id") == str(ident):
                return ligne["cles"].get("spec") or None
    return None


def fichiers_du_plan(depot, spec):
    """Les chemins que cite le plan de la spec entre accents graves, sans doublon, dans l'ordre."""
    try:
        with open(os.path.join(depot, spec, "plan.md"), encoding="utf-8") as f:
            return chemins_cites(f.read())
    except OSError:
        return []


def chemins_cites(texte):
    """Les chemins cités entre accents graves d'un plan, sans doublon, dans l'ordre (jumelle de `planFiles`, #510)."""
    vus = []
    for m in re.finditer(r"`([^`\n]+)`", texte):
        t = m.group(1)
        if re.search(r"\s", t) or ":" in t:
            continue
        if ("/" in t or re.search(r"\.\w{1,5}$", t)) and t not in vus:
            vus.append(t)
    return vus


def _booleens(bloc):
    if not isinstance(bloc, dict):
        return {}
    return {k: v for k, v in bloc.items() if k in DEFAUTS and isinstance(v, bool)}


def _dossier(cle, maison):
    if cle.startswith("~/"):
        cle = maison.rstrip("/") + "/" + cle[2:]
    return cle.rstrip("/")


def reglages(depot, fichier=None, maison=None):
    """(réglages du projet DEPOT, True si le fichier est illisible), comme sessionPrefs du plugin."""
    maison = maison if maison is not None else os.path.expanduser("~")
    fichier = fichier or os.path.expanduser(FICHIER_REGLAGES)
    prefs = dict(DEFAUTS)
    try:
        with open(fichier, encoding="utf-8") as f:
            texte = f.read()
    except OSError:
        return prefs, False
    try:
        brut = json.loads(texte)
    except ValueError:
        return prefs, True
    if not isinstance(brut, dict):
        return prefs, False
    prefs.update(_booleens(brut))
    projets = brut.get("projets")
    if isinstance(projets, dict):
        ici = os.path.abspath(depot).rstrip("/")
        for cle, bloc in projets.items():
            if isinstance(cle, str) and _dossier(cle, maison) == ici:
                prefs.update(_booleens(bloc))
    return prefs, False


def ligne_reglages(prefs, illisible=False):
    oui = lambda b: "oui" if b else "non"  # noqa: E731
    return (ENTETE_REGLAGES + "questions en formulaire %s, mode ADHD %s, français %s, autonome %s"
            % (oui(prefs["questions"]), oui(prefs["adhd"]), oui(prefs["francais"]), oui(prefs["autonome"]))
            + (" (fichier des réglages illisible : réglages par défaut)" if illisible else "")
            + CONSIGNE_REGLAGES)


def construire(depot, ident, fichier_reglages=None, maison=None, branche=None, aujourdhui=None):
    return texte_brief(entree_brief(depot, ident, fichier_reglages, maison, branche, aujourdhui))


NOMS_COURTS = {"opus": "Opus 5.5", "sonnet": "Sonnet 5.5"}


def entree_brief(depot, ident, fichier_reglages=None, maison=None, branche=None, aujourdhui=None):
    """Ce que le brief dit de la ligne #ident de DEPOT, lu une fois : l'entrée de `texte_brief`, la même que celle de
    `cloudBriefText` du panneau (#510, jumelles : `tests/jumelles-cas.ts`)."""
    rel, ligne, prise = trouver_ligne(depot, ident, branche, aujourdhui)
    c = ligne["cles"]
    charge = reco_cloud.charge(ligne["libelle"])
    modele, effort = reco_cloud.modele(charge)
    prefs, illisible = reglages(depot, fichier_reglages, maison)
    entree = {
        "project": nom_projet(depot), "id": str(ident), "label": ligne["libelle"], "line": ligne["brut"],
        "branch": c["branche"], "rel": rel, "taken": prise,
        "files": fichiers_du_plan(depot, c["spec"]) if c.get("spec") else [],
        "prefs": prefs, "prefsError": illisible,
        "launch": {"charge": charge, "model": "sonnet" if "sonnet" in modele else "opus", "effort": effort},
    }
    if c.get("spec"):
        entree["spec"] = c["spec"]
    repo = suivi_cloud.depot_github(depot)
    if repo:
        entree["depot"] = repo
    preuve = PREUVE.match(ligne["libelle"])
    chantier = chantier_de(depot, rel, preuve.group(1)) if preuve else None
    if chantier:
        entree["proofSpec"] = chantier
    return entree


def texte_brief(e):
    """Le brief d'une session cloud d'après son entrée (`entree_brief`), mot pour mot celui de `cloudBriefText`."""
    ident, branche, spec, repo = e["id"], e["branch"], e.get("spec"), e.get("depot")
    sortie = ["Mission : %s (tâche #%s de %s)." % (e["label"].rstrip("."), ident, e["project"])]
    if e["files"]:
        sortie.append("Fichiers : " + ", ".join(e["files"]))
    # #444 : une roadmap hors du dépôt de code (`depot` de roadmap.json) : les tests sont ceux du dépôt, et la
    # ligne ne se voit pas depuis la VM.
    tests = (
        "les seuls tests que nomme ta carte d'impact, lancés dans ta VM comme le dit docs/session-cloud.md, "
        "sont verts"
        if repo
        else "les seuls tests que nomme ta carte d'impact (node scripts/check.mjs seul pour une tâche sans code) "
        "sont verts dans ta VM"
    )
    entete = (
        "Ta ligne, telle qu'écrite dans la roadmap du projet, qui vit sur le Mac hors du dépôt %s (prise pour toi, "
        "tu ne la vois pas d'ici) :" % repo
        if repo
        else "Ta ligne, telle qu'écrite dans %s (prise pour toi, ne la modifie pas) :" % e["rel"]
        if e["taken"]
        else "Ta ligne, telle qu'elle sera prise pour toi dans %s au départ de ta session (ne la modifie pas) :" % e["rel"]
    )
    preuve = PREUVE.match(e["label"])
    if preuve:
        # #455 : la preuve de fidélité d'une tâche close à sa publication ; rien d'autre ne l'attend.
        rendu = preuve.group(1)
        chantier = e.get("proofSpec") or "docs/plans/<type>-<slug>/ (le spec: de #%s)" % rendu
        livre = (
            "la capture collée dans ta session est posée à côté de la maquette validée de #%s par fidelite.py, "
            "`fidelite.py verifier %s` est vert (chaque écart corrigé ou confié à sa tâche de correctif, "
            "`data-ecart=\"tache\"` et son numéro, la tâche proposée sous « Hors de ma tâche : »), la page et sa "
            "capture committées, %s" % (rendu, chantier, tests)
        )
    else:
        livre = "ce que dit la ligne #%s est livré, %s" % (ident, tests)
    l = e["launch"]
    nom = NOMS_COURTS[l["model"]]
    sortie += [
        "Fini quand : %s sur ta branche à jour de origin/main, la branche %s "
        "est poussée et sa PR vers main ouverte, un commentaire y colle ces tests et leur résultat, "
        "le dernier porte ton compte rendu." % (livre, branche),
        ligne_options("Model %s, Effort %s" % (nom, l["effort"])),
        "---",
        "",
        entete,
        "",
        "> " + e["line"],
        "",
        "Travaille sur la branche `%s`, partie de `origin/main`." % branche,
        REGLE_DEPART % {"branche": branche},
        "",
        "Tes règles : lis `docs/session-cloud.md` à la racine du dépôt avant tout geste ; elles remplacent les "
        "règles du Mac de CLAUDE.md.",
        "",
        ligne_reglages(e["prefs"], e["prefsError"]),
        "",
        "Ton modèle (#490) : cette tâche est %s, prévue en %s, effort %s. %s" % (
            NOMS_CHARGES[l["charge"]], nom, l["effort"], CONSIGNE_327),
        "",
        REGLE_BLOC,
        "",
        # #496, #559 : le bloc de fin que la personne colle dans Maestro.
        regle_bloc_de_fin(ident),
        "",
    ]
    if preuve:
        sortie.append(
            "Ta tâche est une preuve de fidélité (#455) : #%s est close et publiée, rien d'autre ne t'attend. "
            "Le chantier : `%s`. Si la capture n'est pas encore dans ta session, écris la consigne de capture au "
            "gabarit (docs/session-cloud.md, « Une preuve de fidélité à part ») et attends-la ; un écart trouvé "
            "ouvre sa tâche de correctif, il ne rouvre pas #%s." % (rendu, chantier, rendu)
        )
    else:
        sortie.append(REGLE_RENDU)
    if spec:
        sortie += ["", "Ta spec et ton plan : `%s`" % spec]
    return "\n".join(sortie) + "\n"


def main(argv=None):
    p = argparse.ArgumentParser(description="Brief d'une session cloud de Maestro.")
    p.add_argument("depot")
    p.add_argument("id")
    p.add_argument("--branche", help="la branche de la session, pour une ligne pas encore prise (#458)")
    p.add_argument("--reglages", help="fichier des réglages de session (défaut : %s)" % FICHIER_REGLAGES)
    a = p.parse_args(argv)
    try:
        ident = int(a.id)
    except ValueError:
        print("brief_cloud : id « %s » non numérique" % a.id, file=sys.stderr)
        return 2
    try:
        brief = construire(a.depot, ident, a.reglages, branche=a.branche)
    except (ErreurLigne, suivi_cloud.ErreurDepot) as e:
        print("brief_cloud : %s" % e, file=sys.stderr)
        return 2
    sys.stdout.write(brief)
    return 0


if __name__ == "__main__":
    sys.exit(main())
