#!/usr/bin/env python3
"""Brief d'une session cloud de Maestro : écrit sur la sortie standard le brief entier d'une ligne de roadmap
`lieu:cloud`, qui se suffit sans plugin (la session cloud n'en charge pas) : les lignes Mission, Fichiers (si le
plan de la spec cite des chemins) et Fini quand, `---`, la ligne recopiée, la branche, puis les règles de
`docs/session-cloud.md` par leur chemin (skill maestro, « Mode cloud », #408).

  python3 brief_cloud.py DEPOT ID

Lit DEPOT/roadmap/ROADMAP.md (ou DEPOT/ROADMAP.md) et, pour le nom du projet, DEPOT/.claude/roadmap.json (clé
« name », sinon le nom du dossier). Lecture seule. Code de retour 2 (message sur stderr) pour une ligne absente,
close, non prise (sans `qui:` et `branche:`) ou sans `lieu:cloud`, ou une roadmap introuvable.

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import json
import os
import re
import sys

import suivi_cloud


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


def trouver_ligne(depot, ident):
    """(chemin relatif de la roadmap, ligne lue) ; ErreurLigne si elle ne se lance pas en cloud."""
    for rel in ("roadmap/ROADMAP.md", "ROADMAP.md"):
        chemin = os.path.join(depot, rel)
        if os.path.isfile(chemin):
            break
    else:
        raise suivi_cloud.ErreurDepot("roadmap introuvable dans %s" % depot)
    with open(chemin, encoding="utf-8") as f:
        for brut in f.read().splitlines():
            ligne = suivi_cloud.lire_ligne(brut)
            if ligne and ligne["cles"].get("id") == str(ident):
                break
        else:
            raise ErreurLigne("#%s : ligne absente de %s" % (ident, rel))
    c = ligne["cles"]
    if ligne["close"]:
        raise ErreurLigne("#%s : ligne close" % ident)
    if not (c.get("qui") and c.get("branche")):
        raise ErreurLigne("#%s : ligne non prise (qui: et branche: attendus)" % ident)
    if c.get("lieu") != "cloud":
        raise ErreurLigne("#%s : pas de lieu:cloud" % ident)
    return rel, ligne


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


def construire(depot, ident):
    rel, ligne = trouver_ligne(depot, ident)
    c = ligne["cles"]
    branche = c["branche"]
    spec = c.get("spec")
    sortie = ["Mission : %s (tâche #%s de %s)." % (ligne["libelle"].rstrip("."), ident, nom_projet(depot))]
    fichiers = fichiers_du_plan(depot, spec) if spec else []
    if fichiers:
        sortie.append("Fichiers : " + ", ".join(fichiers))
    sortie += [
        "Fini quand : ce que dit la ligne #%s est livré, les tests de ta carte d'impact et node scripts/check.mjs "
        "sont verts, la branche %s est poussée et sa PR vers main ouverte, son dernier commentaire porte ton "
        "compte rendu." % (ident, branche),
        "---",
        "",
        "Ta ligne, telle qu'écrite dans %s (prise pour toi, ne la modifie pas) :" % rel,
        "",
        "> " + ligne["brut"],
        "",
        "Travaille sur la branche `%s`, partie de `origin/main`." % branche,
        "",
        "Tes règles : lis `docs/session-cloud.md` à la racine du dépôt avant tout geste ; elles remplacent les "
        "règles du Mac de CLAUDE.md.",
    ]
    if spec:
        sortie += ["", "Ta spec et ton plan : `%s`" % spec]
    return "\n".join(sortie) + "\n"


def main(argv=None):
    p = argparse.ArgumentParser(description="Brief d'une session cloud de Maestro.")
    p.add_argument("depot")
    p.add_argument("id")
    a = p.parse_args(argv)
    try:
        ident = int(a.id)
    except ValueError:
        print("brief_cloud : id « %s » non numérique" % a.id, file=sys.stderr)
        return 2
    try:
        brief = construire(a.depot, ident)
    except (ErreurLigne, suivi_cloud.ErreurDepot) as e:
        print("brief_cloud : %s" % e, file=sys.stderr)
        return 2
    sys.stdout.write(brief)
    return 0


if __name__ == "__main__":
    sys.exit(main())
