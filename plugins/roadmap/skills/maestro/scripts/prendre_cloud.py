#!/usr/bin/env python3
"""La prise d'une ligne de roadmap pour une session cloud que la personne vient de démarrer (#458) : Maestro la lance
au message de l'app « The user started your suggested background task "<titre>" in a separate cloud session », et
jamais avant (une ligne prise d'avance bloque le ▶ du panneau). La bande montre alors la session cloud dès son
départ, avant sa PR.

  python3 prendre_cloud.py DEPOT ID|TITRE BRANCHE
  python3 prendre_cloud.py DEPOT ID|TITRE --mission

Une mission (projet sans code, #476) se prend de même au départ, sans branche : `qui:mission | lieu:cloud`, comme
`takeMissionLine` du panneau (#510).

ID est le numéro de la tâche (« 458 », « #458 ») ou le titre de la carte, que redit le message de l'app
(« #458 · Ligne prise au départ · cloud ») ; BRANCHE est celle que nomme le brief de la carte (`brief_cloud.py
--branche`). La prise est celle du panneau (`takeCloudLine` de hooks/parse.ts) : `qui:` et `branche:` à la branche,
`lieu:cloud`, `ouvert:` (aujourd'hui) et `après:-` s'ils manquent, et la ligne monte au bas de « En cours ». Une ligne
close, absente ou tenue par une autre branche est refusée ; déjà prise en cloud par cette branche, rien ne change.

Écrit DEPOT/roadmap/ROADMAP.md (ou DEPOT/ROADMAP.md), puis donne les deux commandes qui committent ce seul fichier
et le poussent. Code de retour 2 (message sur stderr) pour un refus ou une roadmap introuvable.

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import datetime
import os
import re
import sys
import unicodedata


MISSION = "mission"  # le qui: d'une mission (MISSION_QUI du panneau)


class ErreurPrise(Exception):
    """La ligne ne se prend pas."""


def _champs(brut):
    i = brut.rfind("`[")
    fin = -2 if brut.endswith("]`") else len(brut)
    return i, [f.strip() for f in brut[i + 2:fin].split("|")]


def _trouver(lignes, ident):
    motif = re.compile(r"\| id:%s( |\|)" % re.escape(ident))
    for n, l in enumerate(lignes):
        if l.startswith("- [ ] ") and motif.search(l[l.rfind("`["):] + " "):
            return n
    return -1


def _deplacer(texte, ident, aujourdhui, revendiquer):
    """Le déplacement commun des prises, comme `takeLine` du panneau : `revendiquer(champs)` rend les champs à poser
    (ou None : la ligne reste telle quelle) ou lève ErreurPrise ; les anciens `qui:` et `lieu:` partent, `ouvert:` et
    `après:-` s'ajoutent s'ils manquent, et la ligne monte au bas de « En cours »."""
    lignes = texte.split("\n")
    at = _trouver(lignes, ident)
    if at < 0:
        raise ErreurPrise("#%s introuvable dans la roadmap" % ident)
    brut = lignes[at]
    coupe, champs = _champs(brut)
    poses = revendiquer(champs)
    if poses is None:
        return texte, brut
    gardes = [f for f in champs if not re.match(r"^(qui|lieu):", f)]
    if not any(f.startswith("ouvert:") for f in gardes):
        gardes.append("ouvert:%s" % aujourdhui)
    if not any(f.startswith("après:") for f in gardes):
        gardes.append("après:-")
    gardes += poses
    ligne = "%s`[%s]`" % (brut[:coupe], " | ".join(gardes))
    del lignes[at]
    tete = next((n for n, l in enumerate(lignes) if re.match(r"^## En cours\s*$", l)), -1)
    if tete < 0:
        lignes.insert(at, ligne)
        return "\n".join(lignes), ligne
    fin = tete + 1
    while fin < len(lignes) and not lignes[fin].startswith("## "):
        fin += 1
    dernier = fin - 1
    while dernier > tete and lignes[dernier].strip() == "":
        dernier -= 1
    lignes[dernier + 1:dernier + 1] = ["", ligne] if dernier == tete else [ligne]
    return "\n".join(lignes), ligne


def prendre(texte, ident, branche, aujourdhui):
    """(texte réécrit, ligne prise), comme `takeCloudLine` ; ErreurPrise sinon. Déjà prise en cloud par cette
    branche : rien ne change."""
    def revendiquer(champs):
        tenue = next((f for f in champs if f.startswith("branche:")), None)
        if tenue:
            if tenue[8:].strip() == branche and "lieu:cloud" in champs:
                return None
            raise ErreurPrise("#%s est déjà tenue par %s" % (ident, tenue[8:]))
        return ["qui:%s" % branche, "branche:%s" % branche, "lieu:cloud"]
    return _deplacer(texte, ident, aujourdhui, revendiquer)


def prendre_mission(texte, ident, aujourdhui):
    """(texte réécrit, ligne prise) pour une mission (#476, #510), comme `takeMissionLine` : `qui:mission` et
    `lieu:cloud`, jamais de `branche:` ; une ligne tenue, déjà en mission, close ou absente est refusée."""
    def revendiquer(champs):
        tenue = next((f for f in champs if f.startswith("branche:")), None)
        if tenue:
            raise ErreurPrise("#%s est déjà tenue par %s" % (ident, tenue[8:]))
        if "qui:%s" % MISSION in champs:
            raise ErreurPrise("#%s est déjà partie en mission" % ident)
        return ["qui:%s" % MISSION, "lieu:cloud"]
    return _deplacer(texte, ident, aujourdhui, revendiquer)


def id_de(texte):
    """Le numéro de tâche d'un « 458 », « #458 » ou d'un titre « #458 · … » ; None sans numéro."""
    t = texte.strip()
    if re.fullmatch(r"#?\d+", t):
        return t.lstrip("#")
    m = re.match(r"^#(\d+)\s*·", t)
    return m.group(1) if m else None


def branche_cloud(nom, ident):
    """La branche cloud d'une tâche, comme `cloudBranchOf` du panneau : `feat/` et le slug de son nom court
    (sinon de son libellé), 40 signes au plus, coupés à un tiret."""
    slug = "".join(c for c in unicodedata.normalize("NFD", nom) if not unicodedata.combining(c)).lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug).strip("-")
    coupe = slug if len(slug) <= 40 else re.sub(r"-[^-]*$", "", slug[:40])
    return "feat/%s" % (coupe or "tache-%s" % ident)


def chemin_roadmap(depot):
    for rel in ("roadmap/ROADMAP.md", "ROADMAP.md"):
        if os.path.isfile(os.path.join(depot, rel)):
            return rel
    raise ErreurPrise("roadmap introuvable dans %s" % depot)


def main(argv=None):
    p = argparse.ArgumentParser(description="Prendre la ligne d'une tâche démarrée en cloud.")
    p.add_argument("depot")
    p.add_argument("id", help="le numéro (458, #458) ou le titre de la carte (« #458 · … · cloud »)")
    p.add_argument("branche", nargs="?", help="la branche du brief ; absente avec --mission")
    p.add_argument("--mission", action="store_true", help="une mission (#476, #510) : qui:mission, sans branche")
    a = p.parse_args(argv)
    ident = id_de(a.id)
    if ident is None:
        print("prendre_cloud : « %s » ne donne aucun #N" % a.id, file=sys.stderr)
        return 2
    if bool(a.mission) == bool(a.branche):
        print("prendre_cloud : une BRANCHE, ou --mission sans branche", file=sys.stderr)
        return 2
    try:
        rel = chemin_roadmap(a.depot)
        chemin = os.path.join(a.depot, rel)
        with open(chemin, encoding="utf-8") as f:
            texte = f.read()
        jour = datetime.date.today().isoformat()
        nouveau, ligne = prendre_mission(texte, ident, jour) if a.mission else prendre(texte, ident, a.branche, jour)
    except ErreurPrise as e:
        print("prendre_cloud : %s" % e, file=sys.stderr)
        return 2
    if nouveau == texte:
        print("#%s déjà prise en cloud par %s : rien à écrire.\n%s" % (ident, a.branche, ligne))
        return 0
    with open(chemin, "w", encoding="utf-8") as f:
        f.write(nouveau)
    qui = MISSION if a.mission else a.branche
    slug = MISSION if a.mission else re.sub(r"^feat/", "", a.branche)
    print("#%s prise pour %s (lieu:cloud) dans %s :\n%s\n\nCommitte ce seul fichier, puis pousse :\n"
          "git -C %s commit %s -m \"roadmap: take %s (#%s, cloud)\"\ngit -C %s push"
          % (ident, qui, rel, ligne, a.depot, rel, slug, ident, a.depot))
    return 0


if __name__ == "__main__":
    sys.exit(main())
