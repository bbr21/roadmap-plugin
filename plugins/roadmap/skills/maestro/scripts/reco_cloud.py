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

Avant la règle des mots, le verdict du modèle (#430) : le panneau fait juger chaque tâche ouverte sur la tâche entière
(ligne, note, spec, fiche, fichiers nommés) et le garde dans DEPOT/.git/roadmap-reco.json ; tant que le libellé de la
ligne est celui qu'il a jugé, ce verdict répond, suivi de « (jugée sur la tâche entière) ». Sans lui (panneau fermé,
modèle indisponible, ligne changée), la règle répond, suivie de « (règle des mots : pas encore jugée) ».

La reco rend un profil de besoins (#461), liste fermée de BESOINS (celle de RECO_NEEDS du panneau) : état du Mac,
vrai rendu, ressource unique, secrets, maquettes, code seul ; le lieu en découle (`lieu_des_besoins`).

Avec `--carte` (#458), la carte que Maestro pose, en JSON : `target` « cloud » quand la reco dit cloud et que le projet
a `"sessions": "cloud"` dans DEPOT/.claude/roadmap.json, « mac » sinon ; `titre` « #ID · <nom:> · cloud » (ou
« · Mac »), coupé à 58 signes comme `targetTitle` du panneau ; `branche`, celle que nommeront le brief
(`brief_cloud.py --branche`) et la prise (`prendre_cloud.py`) pour une carte cloud, sinon null ; `reco`, `besoins`,
`raison` et `par`.

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import json
import os
import re
import sys
import unicodedata

import prendre_cloud
import suivi_cloud

# Le profil de besoins (#461) : chaque besoin et son lieu, dans l'ordre de RECO_NEEDS du panneau.
BESOINS = {
    "etat_mac": "mac",
    "vrai_rendu": "mac",
    "ressource_unique": "mac",
    "secrets": "mac",
    "maquettes": "cloud",
    "code_seul": "cloud",
}
MARQUEURS = [
    {"need": "vrai_rendu", "words": ["simulateur", "simulator", "xcode", "ios\\b", "iphone"], "why": "le simulateur iOS et Xcode sont sur le Mac"},
    {"need": "vrai_rendu", "words": ["volet navigateur", "browser pane", "preview_start", "vrai site", "site reel"], "why": "le volet navigateur, pour un vrai site, est sur le Mac"},
    {"need": "secrets", "words": ["trousseau", "keychain"], "why": "les secrets et le trousseau sont sur le Mac"},
    {"need": "ressource_unique", "words": ["base locale", "appareil branche", "verrou:"], "why": "une ressource unique du Mac (verrou, base locale, appareil)"},
    {"need": "etat_mac", "words": ["launchd", "osascript", "computer-use", "reglages systeme", "installed_plugins", "plugins installes", "version chargee", "catalogue local", "claude plugin update", "main\\.log"], "why": "état du Mac (~/.claude, plugins installés, version chargée par Claude, launchd) : lisible sur le Mac seul"},
]
RENDU = {"words": ["maquette", "mockup", "capture", "fidelite", "screenshot"], "why": "maquettes et preuve de fidélité : faites depuis le cloud (Artifact, capture collée, #409)"}
CACHE = "roadmap-reco.json"
LOGIQUE = "tâche de logique : ni simulateur, ni volet navigateur pour un vrai site, ni ressource du Mac"


def plier(texte):
    """Le texte en minuscules, sans accents (comme `foldText` du panneau)."""
    return "".join(c for c in unicodedata.normalize("NFD", texte) if not unicodedata.combining(c)).lower()


def lieu_des_besoins(besoins):
    """Le lieu qui découle d'un profil (#461) : « mac » dès qu'un besoin du Mac y est, sinon « cloud »."""
    return "mac" if any(BESOINS.get(b) == "mac" for b in besoins) else "cloud"


def reco(*textes):
    """`{"lieu": "cloud"|"mac", "why": …, "besoins": [...]}` d'après le libellé et les documents de la tâche : tous les
    besoins lus, le lieu en découle, la raison est celle du premier marqueur du Mac (#461)."""
    t = plier("\n".join(textes))
    trouves = [m for m in MARQUEURS if any(re.search(r"\b" + w, t) for w in m["words"])]
    besoins = []
    for m in trouves:
        if m["need"] not in besoins:
            besoins.append(m["need"])
    if any(re.search(r"\b" + w, t) for w in RENDU["words"]):
        besoins.append("maquettes")
    if not besoins:
        besoins.append("code_seul")
    why = trouves[0]["why"] if trouves else (RENDU["why"] if "maquettes" in besoins else LOGIQUE)
    return {"lieu": lieu_des_besoins(besoins), "why": why, "besoins": besoins}


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


def verdict(depot, id_, libelle):
    """Le verdict du modèle gardé par le panneau pour la ligne #id_ (#430), s'il porte sur ce libellé ; sinon None."""
    try:
        with open(os.path.join(depot, ".git", CACHE), encoding="utf-8") as f:
            v = json.load(f).get("recos", {}).get(id_)
    except (OSError, ValueError, AttributeError):
        return None
    if not isinstance(v, dict) or v.get("label") != libelle.strip():
        return None
    if not isinstance(v.get("why"), str) or not v["why"].strip():
        return None
    if isinstance(v.get("besoins"), list):
        # #461 : le profil fait foi, le lieu en découle ; un besoin inconnu tombe, une liste vide vaut « code seul ».
        besoins = [] if v["besoins"] else ["code_seul"]
        for b in v["besoins"]:
            if b in BESOINS and b not in besoins:
                besoins.append(b)
        if not besoins:
            return None
        return {"lieu": lieu_des_besoins(besoins), "why": v["why"].strip(), "besoins": besoins}
    if v.get("lieu") not in ("cloud", "mac"):
        return None
    return {"lieu": v["lieu"], "why": v["why"].strip()}


def projet_cloud(depot):
    """Le projet ouvre-t-il le cloud (`"sessions": "cloud"` de DEPOT/.claude/roadmap.json) ?"""
    try:
        with open(os.path.join(depot, ".claude", "roadmap.json"), encoding="utf-8") as f:
            return json.load(f).get("sessions") == "cloud"
    except (OSError, ValueError, AttributeError):
        return False


def titre_carte(id_, nom, target):
    """Le titre de la carte, la cible au bout, comme `targetTitle` du panneau (#436)."""
    marque = " · %s" % ("cloud" if target == "cloud" else "Mac")
    base = "#%s · %s" % (id_, nom)
    place = 58 - len(marque)
    if len(base) > place:
        base = base[:place - 1].rstrip() + "…"
    return base + marque


def carte(depot, id_, ligne, r, par):
    """La carte de Maestro pour la ligne #id_ (#458) : cloud quand la reco le dit et que le projet l'ouvre."""
    nom = ligne["cles"].get("nom") or ligne["libelle"]
    ouvert = projet_cloud(depot)
    target = "cloud" if r["lieu"] == "cloud" and ouvert else "mac"
    raison = r["why"] if ouvert else "%s ; mais le projet n'a pas \"sessions\": \"cloud\"" % r["why"]
    return {
        "id": id_,
        "target": target,
        "titre": titre_carte(id_, nom, target),
        "branche": prendre_cloud.branche_cloud(nom, id_) if target == "cloud" else None,
        "reco": r["lieu"],
        "besoins": r.get("besoins", []),
        "raison": raison,
        "par": par,
    }


def main(argv=None):
    p = argparse.ArgumentParser(description="La cible recommandée d'une tâche : cloud ou Mac.")
    p.add_argument("depot")
    p.add_argument("id")
    p.add_argument("--carte", action="store_true", help="la carte à poser, en JSON (#458)")
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
    id_ = a.id.lstrip("#")
    r = verdict(a.depot, id_, ligne["libelle"])
    par = "jugée sur la tâche entière" if r else "règle des mots : pas encore jugée"
    r = r or reco(ligne["libelle"], *documents(a.depot, ligne["cles"]))
    if a.carte:
        print(json.dumps(carte(a.depot, id_, ligne, r, par), ensure_ascii=False))
        return 0
    print("#%s · %s · %s (%s)" % (id_, "cloud" if r["lieu"] == "cloud" else "Mac", r["why"], par))
    return 0


if __name__ == "__main__":
    sys.exit(main())
