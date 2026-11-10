#!/usr/bin/env python3
"""Le repli sur le Mac d'une tâche lancée en cloud (#416) : quand le cloud cale (carte refusée faute
d'environnement cloud, quota, outil absent, ou la session cloud qui se dit bloquée pour cela, `suivi_cloud.calee`),
la ligne perd `lieu:cloud` et garde sa branche (`qui:`, `branche:`) : le travail poussé n'est pas perdu.

  python3 repli_mac.py DEPOT ID

Réécrit la ligne #ID de DEPOT/roadmap/ROADMAP.md (ou DEPOT/ROADMAP.md) sans `lieu:cloud`, puis écrit la consigne à
joindre au brief de la session du Mac, qui reprend la branche. Ne committe pas : Maestro committe et pousse `main`,
puis relance la tâche sur le Mac avec cette consigne en message additionnel. Code de retour 2 pour une ligne
absente, close, non prise ou qui n'est pas en cloud, ou une roadmap introuvable.

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import os
import sys

import suivi_cloud


def sans_cloud(brut):
    """La ligne sans son champ `lieu:cloud`, le reste à l'identique."""
    debut = brut.rfind("`[")
    tete, bloc = brut[:debut + 2], brut[debut + 2:]
    champs = [c for c in bloc[:-2].split("|") if c.strip() != "lieu:cloud"]
    return tete + "|".join(champs) + "]`"


def consigne(ident, branche):
    return ("Reprise sur le Mac de #%s, partie en cloud : le cloud a calé. Ta branche de travail est `%s`, déjà "
            "poussée : `git fetch origin %s && git switch %s` (dans ton worktree), puis continue là où le dernier "
            "commentaire de sa PR s'arrête. La ligne garde cette branche ; ne la reprends pas sous une autre."
            % (ident, branche, branche, branche))


def main(argv=None):
    p = argparse.ArgumentParser(description="Repli sur le Mac d'une tâche lancée en cloud.")
    p.add_argument("depot")
    p.add_argument("id")
    a = p.parse_args(argv)
    ident = a.id.lstrip("#")
    for rel in (os.path.join("roadmap", "ROADMAP.md"), "ROADMAP.md"):
        chemin = os.path.join(a.depot, rel)
        if os.path.isfile(chemin):
            break
    else:
        print("repli_mac : roadmap introuvable dans %s" % a.depot, file=sys.stderr)
        return 2
    with open(chemin, encoding="utf-8") as f:
        lignes = f.read().split("\n")
    for i, brut in enumerate(lignes):
        ligne = suivi_cloud.lire_ligne(brut)
        if ligne and ligne["cles"].get("id") == ident:
            break
    else:
        print("repli_mac : #%s : ligne absente" % ident, file=sys.stderr)
        return 2
    c = ligne["cles"]
    if ligne["close"] or not c.get("branche") or c.get("lieu") != "cloud":
        print("repli_mac : #%s : ligne ouverte, prise et en lieu:cloud attendue" % ident, file=sys.stderr)
        return 2
    lignes[i] = sans_cloud(brut)
    with open(chemin, "w", encoding="utf-8") as f:
        f.write("\n".join(lignes))
    print(consigne(ident, c["branche"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
