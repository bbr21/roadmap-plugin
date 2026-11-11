#!/usr/bin/env python3
"""Brief d'une session cloud de Maestro : écrit sur la sortie standard le brief entier d'une ligne de roadmap
`lieu:cloud`, qui se suffit sans plugin (la session cloud n'en charge pas) : les lignes Mission, Fichiers (si le
plan de la spec cite des chemins) et Fini quand, `---`, la ligne recopiée, la branche, puis les règles de
`docs/session-cloud.md` par leur chemin (skill maestro, « Mode cloud », #408), et les réglages de session de la
personne pour ce projet (#449), que la VM ne reçoit pas du plugin.

  python3 brief_cloud.py DEPOT ID [--branche BRANCHE] [--reglages FICHIER]

#458 : Maestro pose sa carte cloud avant la prise, qui n'a lieu qu'au départ de la session (`prendre_cloud.py`) :
une ligne pas encore prise (sans `branche:`) se brief avec `--branche`, la branche que la prise posera ; la ligne
citée est celle qu'écrira la prise (`prendre_cloud.prendre`), et rien n'est écrit ici. Une ligne déjà prise garde sa
branche (`--branche` doit alors la redire).

Les réglages se lisent dans ~/.claude/reglages-session.json (ou FICHIER) comme le plugin les lit (sessionPrefs de
hooks/parse.ts) : les clés du haut, puis le bloc de `projets` dont la clé désigne DEPOT ; sans fichier, les défauts
(tout oui, autonome non). Le panneau écrit la même ligne (cloudPrefsLine).

Lit DEPOT/roadmap/ROADMAP.md (ou DEPOT/ROADMAP.md) et, pour le nom du projet, DEPOT/.claude/roadmap.json (clé
« name », sinon le nom du dossier). Lecture seule. Code de retour 2 (message sur stderr) pour une ligne absente,
close, non prise sans `--branche` (le message propose la branche du panneau), prise par une autre branche ou sans
`lieu:cloud`, ou une roadmap introuvable.

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import datetime
import json
import os
import re
import sys

import prendre_cloud
import suivi_cloud


FICHIER_REGLAGES = "~/.claude/reglages-session.json"
DEFAUTS = {"questions": True, "adhd": True, "francais": True, "autonome": False}
ENTETE_REGLAGES = "Tes réglages de session (lus au Mac au lancement) : "
CONSIGNE_REGLAGES = ". Leur consigne en cloud : `docs/session-cloud.md`, « La méthode et les réglages »."


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


def fichiers_du_plan(depot, spec):
    """Les chemins que cite le plan de la spec entre accents graves, sans doublon, dans l'ordre."""
    try:
        with open(os.path.join(depot, spec, "plan.md"), encoding="utf-8") as f:
            texte = f.read()
    except OSError:
        return []
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
    rel, ligne, prise = trouver_ligne(depot, ident, branche, aujourdhui)
    c = ligne["cles"]
    branche = c["branche"]
    spec = c.get("spec")
    sortie = ["Mission : %s (tâche #%s de %s)." % (ligne["libelle"].rstrip("."), ident, nom_projet(depot))]
    fichiers = fichiers_du_plan(depot, spec) if spec else []
    if fichiers:
        sortie.append("Fichiers : " + ", ".join(fichiers))
    # #444 : une roadmap hors du dépôt de code (`depot` de roadmap.json) : les tests sont ceux du dépôt, et la
    # ligne ne se voit pas depuis la VM.
    repo = suivi_cloud.depot_github(depot)
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
        else "Ta ligne, telle qu'écrite dans %s (prise pour toi, ne la modifie pas) :" % rel
        if prise
        else "Ta ligne, telle qu'elle sera prise pour toi dans %s au départ de ta session (ne la modifie pas) :" % rel
    )
    sortie += [
        "Fini quand : ce que dit la ligne #%s est livré, %s sur ta branche à jour de origin/main, la branche %s "
        "est poussée et sa PR vers main ouverte, un commentaire y colle ces tests et leur résultat, "
        "le dernier porte ton compte rendu." % (ident, tests, branche),
        "---",
        "",
        entete,
        "",
        "> " + ligne["brut"],
        "",
        "Travaille sur la branche `%s`, partie de `origin/main`." % branche,
        "",
        "Tes règles : lis `docs/session-cloud.md` à la racine du dépôt avant tout geste ; elles remplacent les "
        "règles du Mac de CLAUDE.md.",
        "",
        ligne_reglages(*reglages(depot, fichier_reglages, maison)),
    ]
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
