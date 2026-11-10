#!/usr/bin/env python3
"""Suivi des sessions cloud de Maestro : pour chaque ligne de roadmap prise avec `lieu:cloud`, la PR de sa branche,
son état (aucune, ouverte, en cours, rouges, prête, fusionnée, fermée, ou inconnu si `gh` ne répond pas) et la
première phrase de son dernier commentaire, l'état que dit la session elle-même (skill maestro, « Mode cloud »).
Une session cloud n'envoie aucune note et n'est pas dans list_sessions : on la suit par sa PR (#408).

  python3 suivi_cloud.py DEPOT [--json]

Lit DEPOT/roadmap/ROADMAP.md (ou DEPOT/ROADMAP.md) et lance `gh pr list --head <branche> --state all --json …`
par ligne, dans DEPOT, avec un délai de 20 s. Lecture seule : rien n'est écrit, aucune PR n'est touchée. `gh`
absent, non connecté, trop lent ou illisible : l'état de la ligne est « inconnu », rien ne lève. Code de retour 2
quand le dépôt ou sa roadmap sont introuvables. Sortie en texte, une ligne par tâche :

  #413 Purger les vieilles sauvegardes · prête · « Prête à fusionner (tests : verts). » · <url>

L'analyse (`etat_pr`, `lignes_cloud`) est pure : elle se teste sur des sorties de `gh` gardées, la commande est
injectée (`run=`).

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import json
import os
import re
import subprocess
import sys

DELAI = 20
CHAMPS = "number,url,state,isDraft,mergeable,statusCheckRollup,createdAt,comments,author,isCrossRepository"
ROUGES = {"FAILURE", "ERROR", "CANCELLED", "TIMED_OUT"}
EN_ATTENTE = {"PENDING", "EXPECTED"}
LIGNE = re.compile(r"^- \[( |x|X)\] (.*)$")


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
    for champ in reste[i + 2:-2].split("|"):
        champ = champ.strip()
        if ":" in champ:
            k, v = champ.split(":", 1)
            cles[k.strip()] = v.strip()
    return {"close": m.group(1) != " ", "libelle": reste[:i].strip(), "cles": cles, "brut": texte.rstrip()}


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


def etat_pr(prs):
    """L'état de la PR d'une branche à partir de la sortie JSON de `gh pr list --head B --state all`. Une PR ouverte
    l'emporte, sinon la plus récente ; rend `{"etat", "url", "numero", "depuis", "dit"}`."""
    # Revue de sécurité (#408) : une PR venue d'un fork, même sur le nom de la branche, n'est pas celle de la session.
    prs = [p for p in prs if isinstance(p, dict) and not p.get("isCrossRepository")]
    if not prs:
        return {"etat": "aucune", "url": None, "numero": None, "depuis": None, "dit": ""}
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
    # Seul l'auteur de la PR (le compte par lequel la session pousse) parle pour elle : le commentaire d'un tiers ne
    # passe pas pour son compte rendu. Ce texte reste une donnée : il ne décide jamais d'une fusion (skill maestro).
    auteur = ((pr.get("author") or {}).get("login")) or None
    commentaires = [c for c in (pr.get("comments") or [])
                    if isinstance(c, dict) and auteur and (c.get("author") or {}).get("login") == auteur]
    dit = premiere_phrase(commentaires[-1].get("body")) if commentaires else ""
    return {"etat": etat, "url": pr.get("url"), "numero": pr.get("number"), "depuis": pr.get("createdAt"), "dit": dit}


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


def pr_de(depot, branche, run):
    cmd = ["gh", "pr", "list", "--head", branche, "--state", "all", "--limit", "20", "--json", CHAMPS]
    try:
        prs = json.loads(run(cmd, depot))
    except (OSError, subprocess.SubprocessError, ValueError):
        return {"etat": "inconnu", "url": None, "numero": None, "depuis": None, "dit": ""}
    if not isinstance(prs, list):
        return {"etat": "inconnu", "url": None, "numero": None, "depuis": None, "dit": ""}
    return etat_pr(prs)


def suivre(depot, run=None):
    """Une entrée par ligne `lieu:cloud` prise : id, nom, branche et l'état de sa PR."""
    run = run or run_gh
    return [dict(l, **pr_de(depot, l["branche"], run)) for l in lignes_cloud(lire_roadmap(depot))]


def ligne_texte(t):
    parts = ["#%d %s" % (t["id"], t["nom"])]
    if t["etat"] == "inconnu":
        parts.append("état inconnu")
    elif t["etat"] == "aucune":
        parts.append("aucune PR")
    else:
        parts.append(t["etat"])
        if t["dit"]:
            parts.append("« %s »" % t["dit"])
        if t["url"]:
            parts.append(t["url"])
    return " · ".join(parts)


def main(argv=None, run=None):
    p = argparse.ArgumentParser(description="Suivi des sessions cloud de Maestro, par leur PR.")
    p.add_argument("depot")
    p.add_argument("--json", action="store_true", dest="en_json")
    a = p.parse_args(argv)
    try:
        taches = suivre(a.depot, run=run)
    except ErreurDepot as e:
        print("suivi_cloud : %s" % e, file=sys.stderr)
        return 2
    if a.en_json:
        print(json.dumps(taches, ensure_ascii=False, indent=2))
    elif not taches:
        print("Aucune ligne lieu:cloud prise.")
    else:
        print("\n".join(ligne_texte(t) for t in taches))
    return 0


if __name__ == "__main__":
    sys.exit(main())
