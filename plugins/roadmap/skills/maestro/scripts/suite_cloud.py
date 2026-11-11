#!/usr/bin/env python3
"""La suite entière de `main` dans une session cloud, au lieu du Mac (#450).

Après une série de fusions, Maestro ne lance plus la suite entière sur le Mac : il pose une carte cloud dont le
brief sort de `brief`, la VM part du commit de `main` nommé, lance la suite par `lancer` et colle le résultat en
commentaire de l'issue « Suite de main » du dépôt ; au Mac, `lire` le relit, et `serie_main.py --cloud` en tire
les fichiers en échec. Le Mac ne garde que la publication : `lire --marquer` inscrit l'arbre vert à l'empreinte
de `release.py` (`roadmap-check-vert`), qui ne relance pas ses tests pour lui.

  python3 suite_cloud.py brief DEPOT [--sha SHA] [--issue N]     (Mac) le brief de la carte cloud
  python3 suite_cloud.py lancer [--depot D] [--sortie FICHIER]   (VM) la suite, puis le corps du commentaire
  python3 suite_cloud.py lire DEPOT [--sha SHA] [--issue N] [--json] [--marquer]   (Mac) le dernier résultat

Le commentaire porte un marqueur lisible par machine, `<!-- suite-main {json} -->` : sha, arbre, état (verte,
rouge, bloquee), fichiers en échec (tests du plugin `tests/x.test.tsx`, tests Python par leur chemin). `lire`
prend le dernier commentaire à marqueur de l'issue (celui du SHA demandé s'il est donné), par `gh api`, avec un
délai de 20 s ; sans `gh` ou sans réponse : « inconnu », code 3. `--marquer` n'écrit que pour un résultat vert
dont l'arbre est celui de HEAD du DEPOT, worktree propre. Codes : 0 verte, 1 rouge, 2 dépôt ou commit
introuvables, 3 aucun résultat lisible, 4 bloquée.

L'analyse (`corps`, `echecs_suite`, `echecs_check`, `lire_marqueur`, `dernier_resultat`) est pure : elle se teste
sur des sorties gardées, les commandes sont injectées (`run=`).

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import suivi_cloud  # noqa: E402

TITRE_ISSUE = "Suite de main"
MARQUEUR = re.compile(r"<!-- suite-main (\{.*?\}) -->", re.S)
DELAI_GH = 20
FICHIER_VERT = "roadmap-check-vert"
GARDE_VERT = 20
# Sorties de tools/rejouer_delais.py (vrais échecs « tests/x :: test », rejeu encore rouge) et de release.py check
# (« - plugins/…/test_x.py : test en échec … »).
VRAI_ECHEC = re.compile(r"^\s+(tests/\S+\.test\.tsx?) :: ")
ENCORE_ROUGE = re.compile(r"^rejouer_delais : encore rouge au rejeu : (.*)$")
TEST_PY = re.compile(r"^\s+- (\S+/test_\w+\.py) : ")
QUEUE = 40


class ErreurDepot(Exception):
    """Le dépôt ou un commit ne se lisent pas."""


# ---------------------------------------------------------------- analyse (pure)


def echecs_suite(sortie):
    """Les fichiers de test du plugin restés rouges dans la sortie de rejouer_delais.py, sans doublon."""
    vus = []
    for ligne in sortie.splitlines():
        m = VRAI_ECHEC.match(ligne)
        noms = [m.group(1)] if m else []
        m = ENCORE_ROUGE.match(ligne)
        if m:
            noms = [n.split(" :: ")[0].strip() for n in m.group(1).split(", ")]
        for n in noms:
            if n.startswith("tests/") and n not in vus:
                vus.append(n)
    return vus


def echecs_check(sortie):
    """Les tests Python en échec dans la sortie de release.py check, par leur chemin depuis la racine."""
    vus = []
    for ligne in sortie.splitlines():
        m = TEST_PY.match(ligne)
        if m and m.group(1) not in vus:
            vus.append(m.group(1))
    return vus


def _queue(sortie):
    lignes = [l for l in sortie.rstrip().splitlines() if l.strip() and not l.startswith("(pass) ")]
    return "\n".join(lignes[-QUEUE:]).replace("```", "'''")


def corps(sha, arbre, code_suite, sortie_suite, code_check, sortie_check, duree_s=None, raison=None):
    """Le corps du commentaire : la phrase d'état, le marqueur, puis le détail. `raison` : la VM n'a pas pu lancer
    la suite (bloquee)."""
    if raison:
        etat, echecs = "bloquee", []
    else:
        echecs = ["plugins/roadmap/" + f for f in echecs_suite(sortie_suite)] + echecs_check(sortie_check)
        etat = "verte" if code_suite == 0 and code_check == 0 else "rouge"
    court = (sha or "?")[:7]
    if etat == "bloquee":
        tete = "Suite de main bloquée sur %s : %s." % (court, raison)
    elif etat == "verte":
        tete = "Suite de main verte sur %s." % court
    else:
        tete = "Suite de main rouge sur %s : %s." % (
            court, ", ".join(echecs) if echecs else "aucun fichier nommé, voir les sorties")
    marque = {"sha": sha, "arbre": arbre, "etat": etat, "echecs": echecs,
              "suite": code_suite, "check": code_check}
    if duree_s is not None:
        marque["duree_s"] = int(duree_s)
    out = [tete, "", "<!-- suite-main %s -->" % json.dumps(marque, ensure_ascii=False), ""]
    if etat != "bloquee":
        out.append("- `python3 tools/rejouer_delais.py plugins/roadmap` : %s (code %s)"
                   % ("vert" if code_suite == 0 else "rouge", code_suite))
        out.append("- `python3 tools/release.py check` : %s (code %s)"
                   % ("vert" if code_check == 0 else "rouge", code_check))
        if duree_s is not None:
            out.append("- durée : %d min" % round(duree_s / 60))
        for titre, sortie in (("rejouer_delais.py", sortie_suite), ("release.py check", sortie_check)):
            out += ["", "<details><summary>Fin de la sortie de %s</summary>" % titre, "", "```", _queue(sortie),
                    "```", "", "</details>"]
    out += ["", "Lu au Mac par `suite_cloud.py lire` et `serie_main.py --cloud` (#450)."]
    return "\n".join(out) + "\n"


def lire_marqueur(texte):
    """Le dict du marqueur d'un commentaire, ou None."""
    m = MARQUEUR.search(texte or "")
    if not m:
        return None
    try:
        d = json.loads(m.group(1))
    except ValueError:
        return None
    if not isinstance(d, dict) or d.get("etat") not in ("verte", "rouge", "bloquee"):
        return None
    d.setdefault("echecs", [])
    return d


def dernier_resultat(commentaires, sha=None):
    """Le dernier commentaire à marqueur (pour `sha`, préfixe accepté, s'il est donné) : le marqueur, plus `url` et
    `date` ; None sinon. `commentaires` : la sortie JSON de l'API GitHub, du plus ancien au plus récent."""
    for c in reversed(commentaires or []):
        d = lire_marqueur(c.get("body"))
        if not d:
            continue
        lu = str(d.get("sha") or "")
        if sha and not (lu and (lu.startswith(sha) or sha.startswith(lu))):
            continue
        return dict(d, url=c.get("html_url"), date=c.get("created_at"))
    return None


def brief(repo, sha, issue=None, projet="Roadmap"):
    ou = ("l'issue #%d de %s" % (issue, repo)) if issue else (
        "l'issue ouverte de %s titrée « %s » (crée-la si elle n'existe pas, sans étiquette)" % (repo, TITRE_ISSUE))
    return "\n".join([
        "Mission : faire tourner la suite entière de main de %s sur le commit %s et en coller le résultat en "
        "commentaire de %s (#450)." % (projet, sha[:12], ou),
        "Fini quand : le commentaire de la suite est posté, son marqueur intact, et ton dernier mot le dit en une "
        "ligne (verte, rouge ou bloquée, avec le lien du commentaire).",
        "---",
        "Tu n'as ni ligne de roadmap, ni branche, ni PR : tu ne commites rien, tu ne corriges rien. Tes règles : "
        "`docs/session-cloud.md`, section « Une session de suite de main (#450) ». Les étapes :",
        "1. `git fetch origin main && git switch --detach %s` ; `git status --porcelain` vide." % sha,
        "2. `cd design && npm ci && cd ..` (les tests du design system).",
        "3. `python3 plugins/roadmap/skills/maestro/scripts/suite_cloud.py lancer --sortie /tmp/suite-main.md`, en "
        "arrière-plan (15 à 25 min) : il lance `tools/rejouer_delais.py plugins/roadmap` puis `tools/release.py "
        "check`, et écrit le corps du commentaire.",
        "4. Poste le fichier `/tmp/suite-main.md` tel quel en commentaire de %s, par l'outil GitHub "
        "(`add_issue_comment`), sans en changer une ligne : Maestro lit son marqueur `<!-- suite-main … -->`." % ou,
        "5. Ton dernier mot : la première ligne du fichier et le lien du commentaire.",
        "La VM ne peut pas lancer la suite (outil absent, réseau, disque, quota) : `suite_cloud.py lancer` écrit "
        "un commentaire « bloquée » ; poste-le de même : Maestro relance alors la suite au Mac.",
    ]) + "\n"


# ---------------------------------------------------------------- faits git et gh


def run_cmd(cmd, cwd=None, timeout=None, echo=False):
    """(code, sortie) d'une commande, sortie et erreurs mêlées ; recopiée au fil de l'eau si `echo`."""
    try:
        if not echo:
            r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=timeout)
            return r.returncode, (r.stdout or "") + (r.stderr or "")
        p = subprocess.Popen(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        lignes = []
        for ligne in p.stdout:
            sys.stdout.write(ligne)
            lignes.append(ligne)
        sys.stdout.flush()
        return p.wait(), "".join(lignes)
    except (OSError, subprocess.TimeoutExpired) as err:
        return 127, str(err)


def git(depot, *args, run=None):
    code, out = (run or run_cmd)(["git", "-C", depot] + list(args), cwd=None)
    if code != 0:
        raise ErreurDepot("git %s : %s" % (" ".join(args), out.strip() or "échec"))
    return out.strip()


def nom_projet(depot):
    try:
        with open(os.path.join(depot, ".claude", "roadmap.json"), encoding="utf-8") as f:
            nom = json.load(f).get("name")
        if isinstance(nom, str) and nom.strip():
            return nom.strip()
    except (OSError, ValueError, AttributeError):
        pass
    return os.path.basename(os.path.abspath(depot))


def depot_github(depot, run=None):
    """owner/repo : `depot` de .claude/roadmap.json (#444), sinon le remote origin."""
    repo = suivi_cloud.depot_github(depot)
    if repo:
        return repo
    try:
        url = git(depot, "remote", "get-url", "origin", run=run)
    except ErreurDepot:
        return None
    m = re.search(r"github\.com[:/]([^/\s]+/[^/\s]+?)(?:\.git)?/?$", url)
    if m:
        return m.group(1)
    m = re.search(r"/git/([^/\s]+/[^/\s]+?)(?:\.git)?/?$", url)  # le proxy git d'une VM claude.ai
    return m.group(1) if m else None


def gh_json(args, run=None):
    """La sortie JSON de `gh …`, ou None si gh manque, échoue ou se tait."""
    if not run and not shutil.which("gh"):
        return None
    code, out = (run or run_cmd)(["gh"] + args, timeout=DELAI_GH)
    if code != 0:
        return None
    try:
        return json.loads(out)
    except ValueError:
        return None


def trouver_issue(repo, run=None):
    """Le numéro de l'issue ouverte titrée « Suite de main », ou None."""
    # L'API REST et non `gh issue list` : GraphQL est refusé depuis une VM claude.ai.
    issues = gh_json(["api", "repos/%s/issues?state=open&per_page=100" % repo], run=run)
    for i in issues if isinstance(issues, list) else []:
        if "pull_request" in i:
            continue
        if str(i.get("title", "")).strip().lower().startswith(TITRE_ISSUE.lower()):
            return int(i["number"])
    return None


def commentaires(repo, issue, run=None):
    pages = gh_json(["api", "--paginate", "--slurp", "repos/%s/issues/%d/comments?per_page=100" % (repo, issue)],
                    run=run)
    if pages is None:
        return None
    if pages and isinstance(pages[0], list):
        return [c for page in pages for c in page]
    return pages


def resultat(depot, sha=None, issue=None, run=None):
    """(résultat ou None, raison) : le dernier commentaire de suite de l'issue."""
    repo = depot_github(depot, run=run)
    if not repo:
        return None, "dépôt GitHub introuvable (remote origin)"
    issue = issue or trouver_issue(repo, run=run)
    if not issue:
        return None, "aucune issue ouverte « %s » sur %s (ou gh ne répond pas)" % (TITRE_ISSUE, repo)
    cs = commentaires(repo, issue, run=run)
    if cs is None:
        return None, "gh ne répond pas pour l'issue #%d de %s" % (issue, repo)
    d = dernier_resultat(cs, sha)
    if not d:
        return None, "aucun résultat de suite%s sur l'issue #%d" % (" pour %s" % sha[:7] if sha else "", issue)
    return dict(d, issue=issue, repo=repo), None


def marquer(depot, d, run=None):
    """Inscrit l'arbre vert du résultat à l'empreinte de release.py si c'est celui de HEAD, worktree propre.
    Rend le texte de ce qui a été fait."""
    if d.get("etat") != "verte":
        return "rien inscrit : la suite n'est pas verte"
    arbre = git(depot, "rev-parse", "HEAD^{tree}", run=run)
    if d.get("arbre") != arbre:
        return "rien inscrit : l'arbre testé (%s) n'est pas celui de HEAD (%s)" % (str(d.get("arbre"))[:7], arbre[:7])
    if git(depot, "status", "--porcelain", "--untracked-files=all", run=run):
        return "rien inscrit : le worktree n'est pas propre"
    chemin = os.path.join(git(depot, "rev-parse", "--path-format=absolute", "--git-common-dir", run=run), FICHIER_VERT)
    try:
        with open(chemin, encoding="utf-8") as f:
            arbres = [l.strip() for l in f if l.strip()]
    except OSError:
        arbres = []
    arbres = [a for a in arbres if a != arbre] + [arbre]
    tmp = "%s.%d.tmp" % (chemin, os.getpid())
    with open(tmp, "w", encoding="utf-8") as f:
        f.write("\n".join(arbres[-GARDE_VERT:]) + "\n")
    os.replace(tmp, chemin)
    return "arbre %s inscrit vert : release.py ne relancera pas ses tests pour lui" % arbre[:7]


def lancer(depot, run=None, horloge=time.time, which=shutil.which):
    """Lance la suite dans la VM ; rend (corps, code de sortie)."""
    run = run or run_cmd
    try:
        sha = git(depot, "rev-parse", "HEAD", run=run)
        arbre = git(depot, "rev-parse", "HEAD^{tree}", run=run)
        sale = git(depot, "status", "--porcelain", "--untracked-files=no", run=run)
    except ErreurDepot as err:
        return corps(None, None, None, "", None, "", raison=str(err)), 4
    if sale:
        return corps(sha, arbre, None, "", None, "", raison="le worktree n'est pas propre"), 4
    if not which(os.environ.get("ROADMAP_CLAUDE") or "claude"):
        return corps(sha, arbre, None, "", None, "", raison="la commande claude est absente de la VM"), 4
    debut = horloge()
    code_suite, sortie_suite = run([sys.executable, "tools/rejouer_delais.py", "plugins/roadmap"], cwd=depot, echo=True)
    code_check, sortie_check = run([sys.executable, "tools/release.py", "check"], cwd=depot, echo=True)
    texte = corps(sha, arbre, code_suite, sortie_suite, code_check, sortie_check, horloge() - debut)
    return texte, (0 if code_suite == 0 and code_check == 0 else 1)


def texte_resultat(d, depot):
    out = ["Suite de main %s sur %s (%s, %s)." % (
        {"verte": "verte", "rouge": "rouge", "bloquee": "bloquée"}[d["etat"]], str(d.get("sha"))[:7],
        d.get("date") or "?", d.get("url") or "?")]
    if d["etat"] == "rouge":
        out.append("En échec : %s." % (", ".join(d["echecs"]) or "aucun fichier nommé, voir le commentaire"))
        out.append("Fautive : python3 serie_main.py %s <dernier sha vert de main> %s --cloud" % (depot, d.get("sha")))
    elif d["etat"] == "bloquee":
        out.append("La VM n'a pas pu la lancer : relance-la au Mac (python3 tools/rejouer_delais.py plugins/roadmap).")
    return "\n".join(out)


# ---------------------------------------------------------------- commandes


def main(argv=None, run=None):
    p = argparse.ArgumentParser(description="La suite entière de main dans une session cloud (#450).")
    sub = p.add_subparsers(dest="cmd", required=True)
    b = sub.add_parser("brief")
    b.add_argument("depot")
    b.add_argument("--sha")
    b.add_argument("--issue", type=int)
    la = sub.add_parser("lancer")
    la.add_argument("--depot", default=".")
    la.add_argument("--sortie")
    li = sub.add_parser("lire")
    li.add_argument("depot")
    li.add_argument("--sha")
    li.add_argument("--issue", type=int)
    li.add_argument("--json", action="store_true")
    li.add_argument("--marquer", action="store_true")
    a = p.parse_args(argv)

    if a.cmd == "brief":
        try:
            sha = git(a.depot, "rev-parse", (a.sha or "HEAD") + "^{commit}", run=run)
        except ErreurDepot as err:
            print(str(err), file=sys.stderr)
            return 2
        repo = depot_github(a.depot, run=run)
        if not repo:
            print("dépôt GitHub introuvable (remote origin de %s)" % a.depot, file=sys.stderr)
            return 2
        sys.stdout.write(brief(repo, sha, a.issue, nom_projet(a.depot)))
        return 0

    if a.cmd == "lancer":
        texte, code = lancer(a.depot, run=run)
        if a.sortie:
            with open(a.sortie, "w", encoding="utf-8") as f:
                f.write(texte)
            print("\nCommentaire écrit dans %s : %s" % (a.sortie, texte.splitlines()[0]))
        else:
            sys.stdout.write(texte)
        return code

    d, raison = resultat(a.depot, a.sha, a.issue, run=run)
    if not d:
        print(json.dumps({"etat": "inconnu", "raison": raison}, ensure_ascii=False) if a.json
              else "Suite de main : inconnu (%s)." % raison)
        return 3
    if a.marquer:
        try:
            d["marque"] = marquer(a.depot, d, run=run)
        except (ErreurDepot, OSError) as err:
            d["marque"] = "rien inscrit : %s" % err
    if a.json:
        print(json.dumps(d, ensure_ascii=False, indent=2))
    else:
        print(texte_resultat(d, a.depot) + ("\n" + d["marque"].capitalize() + "." if a.marquer else ""))
    return {"verte": 0, "rouge": 1, "bloquee": 4}[d["etat"]]


if __name__ == "__main__":
    sys.exit(main())
