#!/usr/bin/env python3
"""La série de fusions qu'une CI de main rouge met en cause, et comment trouver la fautive (#431).

Maestro fusionne plusieurs branches prêtes l'une après l'autre sans attendre la CI de main entre elles,
puis lit une seule CI de main, celle du dernier envoi (le `concurrency` de main remplace le passage qui
attend). Rouge, il arrête les fusions suivantes et lance ce script :

  python3 serie_main.py DEPOT AVANT [APRES] [--echec FICHIER ...] [--json]

AVANT : le dernier commit de main dont la CI est verte (avant la série) ; APRES : la tête de main lue rouge
(défaut : origin/main). --echec : les fichiers de test que la CI rouge nomme (`gh run view <id>
--log-failed`). Le script liste les commits de main entre les deux (premier parent, du plus ancien au plus
récent), chacun avec sa PR et sa branche quand c'est une fusion de PR, et les fichiers qu'il change. Il
désigne la fautive :

- une seule fusion de PR dans la série : c'est elle, sans bissection ;
- sinon, la bissection : rejouer les seuls tests en échec sur le commit du milieu (une copie détachée,
  `git worktree add --detach`, puis `tools/un_test.sh` ou `python3`), rouge : la fautive est à ce commit ou
  avant ; vert : après. Le script donne le commit à essayer d'abord, et les fusions qui touchent un
  fichier en échec, à essayer en premier.

La fautive repart à sa session, le job et le test nommés ; une fautive verte seule et rouge après la
précédente vient d'un mélange : sa session fusionne main dans sa branche et corrige. Lecture seule sur le
dépôt : rien n'est fusionné, annulé ni lancé. Code de retour 2 sur un dépôt ou un commit introuvables.

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import json
import re
import subprocess
import sys

SEP = "\x1f"
FUSION_PR = re.compile(r"^Merge pull request #(\d+) from [^/\s]+/(\S+)")


class ErreurDepot(Exception):
    """Le dépôt ou un commit ne se lisent pas."""


# ---------------------------------------------------------------- analyse (pure)


def lire_commit(sha, sujet, fichiers):
    m = FUSION_PR.match(sujet)
    return {"sha": sha, "court": sha[:7], "sujet": sujet, "pr": int(m.group(1)) if m else None,
            "branche": m.group(2) if m else None, "fichiers": sorted(fichiers)}


def analyser(commits, echecs=()):
    """La série (du plus ancien au plus récent) et la fautive ou le plan de bissection."""
    echecs = set(echecs)
    fusions = [c for c in commits if c["pr"]]
    for c in commits:
        c["touche_echec"] = sorted(echecs & set(c["fichiers"]))
    if not commits:
        return {"commits": [], "fautive": None, "milieu": None, "a_essayer": [],
                "avis": "aucun commit entre les deux : la CI rouge ne vient pas d'une fusion de cette série"}
    if len(fusions) == 1:
        return {"commits": commits, "fautive": fusions[0]["sha"], "milieu": None, "a_essayer": [],
                "avis": "une seule fusion dans la série : #PR %d (%s) est la fautive" % (fusions[0]["pr"], fusions[0]["branche"])}
    milieu = commits[(len(commits) - 1) // 2]
    a_essayer = [c["sha"] for c in fusions if c["touche_echec"]]
    return {"commits": commits, "fautive": None, "milieu": milieu["sha"], "a_essayer": a_essayer,
            "avis": "bissection : rejoue les tests en échec sur %s ; rouge, la fautive est à ce commit ou avant ; vert, après" % milieu["court"]}


# ---------------------------------------------------------------- faits git


def git(depot, *args):
    try:
        r = subprocess.run(["git", "-C", depot] + list(args), capture_output=True, text=True)
    except OSError as err:
        raise ErreurDepot("git introuvable : %s" % err)
    if r.returncode != 0:
        raise ErreurDepot("git %s : %s" % (" ".join(args), r.stderr.strip() or "échec"))
    return r.stdout


def collecter(depot, avant, apres):
    for ref in (avant, apres):
        git(depot, "rev-parse", "--verify", "--quiet", ref + "^{commit}")
    log = git(depot, "log", "--first-parent", "--reverse", "--format=%H" + SEP + "%s", "%s..%s" % (avant, apres))
    commits = []
    for ligne in log.splitlines():
        if SEP not in ligne:
            continue
        sha, sujet = ligne.split(SEP, 1)
        noms = git(depot, "diff", "--name-only", sha + "^1", sha)
        commits.append(lire_commit(sha, sujet, [n for n in noms.splitlines() if n.strip()]))
    return commits


# ---------------------------------------------------------------- rendu


def texte(analyse, depot, echecs):
    out = []
    for n, c in enumerate(analyse["commits"], 1):
        quoi = "fusion de la PR %d (%s)" % (c["pr"], c["branche"]) if c["pr"] else "commit"
        marque = " ← touche %s" % ", ".join(c["touche_echec"]) if c["touche_echec"] else ""
        out.append("%d. %s %s : %s, %d fichier(s)%s" % (n, c["court"], quoi, c["sujet"], len(c["fichiers"]), marque))
    out.append("")
    out.append(analyse["avis"] + ".")
    if analyse["milieu"]:
        essai = (analyse["a_essayer"] or [analyse["milieu"]])[0]
        tests = " ".join(echecs) if echecs else "<les tests en échec>"
        out.append("Essai : git -C %s worktree add --detach <brouillon>/bissect-%s %s, puis dans ce dossier "
                   "tools/un_test.sh %s (un test Python : python3 <fichier>), puis git -C %s worktree remove <dossier>."
                   % (depot, essai[:7], essai, tests, depot))
        if analyse["a_essayer"]:
            out.append("À essayer d'abord : %s, qui touche un fichier en échec." % ", ".join(s[:7] for s in analyse["a_essayer"]))
    return "\n".join(out)


def main(argv=None):
    p = argparse.ArgumentParser(description="La série de fusions qu'une CI de main rouge met en cause (#431).")
    p.add_argument("depot")
    p.add_argument("avant")
    p.add_argument("apres", nargs="?", default="origin/main")
    p.add_argument("--echec", nargs="*", default=[])
    p.add_argument("--json", action="store_true")
    a = p.parse_args(argv)
    try:
        commits = collecter(a.depot, a.avant, a.apres)
    except ErreurDepot as err:
        print(str(err), file=sys.stderr)
        return 2
    analyse = analyser(commits, a.echec)
    print(json.dumps(analyse, ensure_ascii=False, indent=2) if a.json else texte(analyse, a.depot, a.echec))
    return 0


if __name__ == "__main__":
    sys.exit(main())
