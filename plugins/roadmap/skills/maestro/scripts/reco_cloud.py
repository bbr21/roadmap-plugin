#!/usr/bin/env python3
"""La cible recommandée d'une tâche (#416) : « cloud » sauf quand il y faut une ressource du Mac (le simulateur iOS,
le volet navigateur pour un vrai site, le trousseau, launchd…), avec sa raison en une ligne. Maquettes et preuve de
fidélité se font depuis le cloud depuis #409 : une tâche qui n'a besoin que d'elles part en cloud, avec sa raison à
elle (#427). Le Mac chargé ou non n'y entre pas. Maestro la lit avant de poser une carte ; BBR choisit la cible.

  python3 reco_cloud.py DEPOT ID

Lit la ligne #ID de DEPOT/roadmap/ROADMAP.md (ou DEPOT/ROADMAP.md), sa spec (`spec.md` du dossier, ou le fichier)
et sa fiche, et écrit `#ID · cloud · <raison>` ou `#ID · Mac · <raison>`. Lecture seule. Code de retour 2 pour une
ligne absente ou une roadmap introuvable. Les marqueurs sont ceux de `CLOUD_MAC_MARKERS` et `CLOUD_RENDER_MARKERS`
de hooks/parse.ts, le panneau : `test_reco_cloud.py` vérifie qu'ils restent les mêmes.

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import os
import re
import sys
import unicodedata

import suivi_cloud

MARQUEURS = [
    {"words": ["simulateur", "simulator", "xcode", "ios\\b", "iphone"], "why": "le simulateur iOS et Xcode sont sur le Mac"},
    {"words": ["volet navigateur", "browser pane", "preview_start", "vrai site", "site reel"], "why": "le volet navigateur, pour un vrai site, est sur le Mac"},
    {"words": ["trousseau", "keychain", "launchd", "osascript", "computer-use", "reglages systeme"], "why": "une ressource du Mac (trousseau, launchd, réglages système)"},
]
RENDU = {"words": ["maquette", "mockup", "capture", "fidelite", "screenshot"], "why": "maquettes et preuve de fidélité : faites depuis le cloud (Artifact, capture collée, #409)"}
LOGIQUE = "tâche de logique : ni simulateur, ni volet navigateur pour un vrai site, ni ressource du Mac"


def plier(texte):
    """Le texte en minuscules, sans accents (comme `foldText` du panneau)."""
    return "".join(c for c in unicodedata.normalize("NFD", texte) if not unicodedata.combining(c)).lower()


def reco(*textes):
    """`{"lieu": "cloud"|"mac", "why": …}` d'après le libellé et les documents de la tâche."""
    t = plier("\n".join(textes))
    for m in MARQUEURS:
        if any(re.search(r"\b" + w, t) for w in m["words"]):
            return {"lieu": "mac", "why": m["why"]}
    if any(re.search(r"\b" + w, t) for w in RENDU["words"]):
        return {"lieu": "cloud", "why": RENDU["why"]}
    return {"lieu": "cloud", "why": LOGIQUE}


def _lire(chemin):
    try:
        with open(chemin, encoding="utf-8") as f:
            return f.read()
    except OSError:
        return ""


def documents(depot, cles):
    """Le texte de la spec et de la fiche de la ligne, ce qui s'en lit."""
    textes = []
    spec = cles.get("spec")
    if spec:
        chemin = os.path.join(depot, spec)
        textes.append(_lire(os.path.join(chemin, "spec.md")) if os.path.isdir(chemin) else _lire(chemin))
    if cles.get("fiche"):
        textes.append(_lire(os.path.join(depot, cles["fiche"])))
    return textes


def main(argv=None):
    p = argparse.ArgumentParser(description="La cible recommandée d'une tâche : cloud ou Mac.")
    p.add_argument("depot")
    p.add_argument("id")
    a = p.parse_args(argv)
    try:
        texte = suivi_cloud.lire_roadmap(a.depot)
    except suivi_cloud.ErreurDepot as e:
        print("reco_cloud : %s" % e, file=sys.stderr)
        return 2
    for brut in texte.splitlines():
        ligne = suivi_cloud.lire_ligne(brut)
        if ligne and ligne["cles"].get("id") == a.id.lstrip("#"):
            break
    else:
        print("reco_cloud : #%s : ligne absente" % a.id.lstrip("#"), file=sys.stderr)
        return 2
    r = reco(ligne["libelle"], *documents(a.depot, ligne["cles"]))
    print("#%s · %s · %s" % (a.id.lstrip("#"), "cloud" if r["lieu"] == "cloud" else "Mac", r["why"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
