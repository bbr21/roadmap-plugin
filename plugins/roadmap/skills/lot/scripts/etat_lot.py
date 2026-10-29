#!/usr/bin/env python3
"""État d'un Lot : chaque branche face à main (ses commits, ses conflits), les fichiers touchés par
deux branches à la fois, les tests, l'ordre de fusion proposé. Le Lot le lit pour ranger sa liste
d'étapes (skill lot, § 3 et 5) ; plus de carte HTML depuis #104. Rendu en texte ou en JSON.

  python3 etat_lot.py DEPOT LOT.json [--texte | --json]

LOT.json (« - » : l'entrée standard), écrit par le Lot :
  {"base": "main", "taches": [{"id": 95, "titre": "Carte du Lot", "branche": "feat/x",
   "tests": "verts" | "rouges" (absent : à lancer), "relue": true, "apres": [94]}]}

Lecture seule sur le dépôt : git log, rev-list, diff et merge-tree (conflits réels, git 2.38 et
plus ; plus ancien, ils sont dits inconnus). Rien n'est fusionné, aucun test n'est lancé. Code de
retour 2 sur un LOT.json illisible, vide ou en double, ou sur un dépôt ou une base introuvables.

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import json
import re
import subprocess
import sys

INTROUVABLE, RIEN, CONFLIT, INCONNU = "introuvable", "rien à fusionner", "conflit avec main", "conflits inconnus"
ROUGES, A_LANCER, A_RELIRE, RETARD, PRETE = "tests rouges", "tests à lancer", "à relire", "à mettre à jour", "prête"
HORS_ORDRE = (INTROUVABLE, RIEN)
SEP = "\x1f"
FORMAT_COMMIT = "%h" + SEP + "%an" + SEP + "%ct" + SEP + "%s"


class ErreurDepot(Exception):
    """Le dépôt, git ou la base ne se lisent pas : aucun état ne vaut."""


# ---------------------------------------------------------------- analyse (pure)


def paire(a, b):
    return tuple(sorted((a, b)))


def ids_de(apres):
    """`apres` tel que le Lot l'écrit (liste, nombre seul, texte « 12,15 ») : des ids entiers."""
    if apres is None or apres == "":
        return []
    brut = apres if isinstance(apres, list) else re.split(r"[,\s]+", str(apres))
    ids = []
    for x in brut:
        try:
            ids.append(int(x))
        except (TypeError, ValueError):
            continue
    return ids


def vide():
    return {"existe": False, "avance": 0, "retard": 0, "fichiers": [], "conflits_main": [],
            "commits": [], "plus": 0, "moins": 0, "depart": None}


def analyser(lot, faits, conflits):
    """L'état du lot à partir des faits git de chaque branche (`collecter`) et des conflits entre
    deux branches (clé : la paire triée de leurs noms ; valeur : fichiers en conflit, None si
    inconnu). Rend les tâches enrichies (etat, pret, partages), les fichiers touchés par deux
    branches ou en conflit entre deux, l'ordre de fusion et la boucle de dépendances s'il y en a."""
    base = lot.get("base") or "main"
    taches = [dict(t, apres=ids_de(t.get("apres"))) for t in lot["taches"]]
    for t in taches:
        t["faits"] = dict(vide(), **(faits.get(t["branche"]) or {}))
    ids_lot = {t["id"] for t in taches}
    vivantes = [t for t in taches if t["faits"]["existe"] and t["faits"]["avance"] > 0]
    ids_vivants = {t["id"] for t in vivantes}
    # Une prérequise n'est fusionnée que si sa branche n'a plus rien à fusionner ; introuvable, elle attend.
    non_fusionnees = {t["id"] for t in taches if not (t["faits"]["existe"] and t["faits"]["avance"] == 0)}
    inconnus = any(t["faits"]["conflits_main"] is None for t in vivantes)

    par_fichier, en_conflit, verdicts = {}, {}, {}
    for t in vivantes:
        for f in t["faits"]["fichiers"]:
            par_fichier.setdefault(f, set()).add(t["id"])
    for i, a in enumerate(vivantes):
        for b in vivantes[i + 1:]:
            communs = set(a["faits"]["fichiers"]) & set(b["faits"]["fichiers"])
            cle = paire(a["branche"], b["branche"])
            if cle not in conflits and not communs:
                continue
            c = conflits.get(cle)
            ids = sorted((a["id"], b["id"]))
            if c is None:
                inconnus = True
                for f in communs:
                    verdicts.setdefault(f, []).append(None)
                continue
            for f in communs:
                verdicts.setdefault(f, []).append(f in c)
            for f in c:
                en_conflit.setdefault(f, []).append(ids)
                par_fichier.setdefault(f, set()).update(ids)
                verdicts.setdefault(f, []).append(True)
    chevauchements = []
    for f in sorted(par_fichier):
        qui = par_fichier[f]
        if len(qui) < 2 and f not in en_conflit:
            continue
        v = verdicts.get(f, [None])
        conflit = True if True in v else (None if None in v else False)
        chevauchements.append({"fichier": f, "ids": sorted(qui), "conflit": conflit,
                               "en_conflit": sorted(en_conflit.get(f, []))})
    partages = {f["fichier"] for f in chevauchements}

    for t in taches:
        fa = t["faits"]
        attend = [i for i in t["apres"] if i in non_fusionnees and i in ids_lot and i != t["id"]]
        tests = t.get("tests")
        if not fa["existe"]:
            etat = INTROUVABLE
        elif fa["avance"] == 0:
            etat = RIEN
        elif fa["conflits_main"]:
            etat = CONFLIT
        elif fa["conflits_main"] is None:
            etat = INCONNU
        elif attend:
            etat = "attend " + ", ".join("#%s" % i for i in attend)
        elif tests == "rouges":
            etat = ROUGES
        elif tests != "verts":
            etat = A_LANCER
        elif not t.get("relue"):
            etat = A_RELIRE
        elif fa["retard"] > 0:
            etat = RETARD
        else:
            etat = PRETE
        t["etat"] = etat
        t["pret"] = etat == PRETE
        t["attend"] = attend
        t["partages"] = len([f for f in fa["fichiers"] if f in partages]) if t["id"] in ids_vivants else 0

    ordre, boucle = ordonner(taches)
    return {"base": base, "taches": taches, "chevauchements": chevauchements,
            "ordre": ordre, "boucle": boucle, "conflits_inconnus": inconnus}


def ordonner(taches):
    """L'ordre de fusion du § 5 de la skill : prête d'abord, ce qui débloque d'autres tâches, ce qui
    libère des fichiers partagés, la plus petite ; puis chaque tâche après ses prérequises du lot.
    Rend aussi les ids pris dans une boucle de dépendances (rangés quand même, au plus tôt)."""
    cand = [t for t in taches if t["etat"] not in HORS_ORDRE]
    ids = {t["id"] for t in cand}
    debloque = {t["id"]: sum(1 for u in cand if t["id"] in u["apres"]) for t in cand}
    reste = sorted(cand, key=lambda t: (not t["pret"], -debloque[t["id"]], -t["partages"], len(t["faits"]["fichiers"]), t["id"]))
    ordre, boucle = [], set()
    while reste:
        libre = next((t for t in reste if all(i in ordre or i not in ids for i in t["apres"])), None)
        if libre is None:
            boucle.update(t["id"] for t in reste if any(i in ids and i not in ordre for i in t["apres"]))
            libre = reste[0]
        ordre.append(libre["id"])
        reste.remove(libre)
    return ordre, sorted(boucle)


# ---------------------------------------------------------------- faits git


def lancer_git(depot, *args):
    try:
        return subprocess.run(["git", "-C", depot, "-c", "core.quotePath=false", *args],
                              capture_output=True, text=True, timeout=60)
    except (OSError, subprocess.TimeoutExpired):
        return None


_MERGE_TREE = None


def merge_tree_ok():
    """git merge-tree --write-tree existe depuis git 2.38."""
    global _MERGE_TREE
    if _MERGE_TREE is None:
        r = lancer_git(".", "--version")
        m = re.search(r"(\d+)\.(\d+)", r.stdout if r else "")
        _MERGE_TREE = bool(m) and (int(m.group(1)), int(m.group(2))) >= (2, 38)
    return _MERGE_TREE


def conflits_entre(depot, a, b):
    """Les fichiers en conflit si on fusionnait b dans a ([] : fusion propre ; None : inconnu)."""
    if not merge_tree_ok():
        return None
    r = lancer_git(depot, "merge-tree", "--write-tree", "--name-only", "--no-messages", a, b)
    if r is None or r.returncode not in (0, 1):
        return None
    if r.returncode == 0:
        return []
    # Code 1 sans aucun nom : une référence invalide, pas un conflit lisible.
    return sorted({l for l in r.stdout.splitlines()[1:] if l.strip()}) or None


def commit_lu(ligne, cote):
    h, auteur, date, sujet = (ligne.split(SEP) + ["", "", "0", ""])[:4]
    return {"hash": h, "auteur": auteur, "date": int(date) if date.isdigit() else 0, "sujet": sujet, "cote": cote, "conflit": False}


def commits_de(depot, plage, cote, *chemins):
    r = lancer_git(depot, "log", "--format=" + FORMAT_COMMIT, plage, "--", *chemins)
    return [commit_lu(l, cote) for l in (r.stdout.splitlines() if r and r.returncode == 0 else []) if l]


def depart_de(depot, base, b):
    """Le dernier commit commun à la base et à la branche : là où la branche est partie."""
    mb = lancer_git(depot, "merge-base", base, b)
    if not mb or mb.returncode != 0 or not mb.stdout.strip():
        return None
    un = lancer_git(depot, "log", "-1", "--format=" + FORMAT_COMMIT, mb.stdout.strip())
    return commit_lu(un.stdout.strip(), "depart") if un and un.returncode == 0 and un.stdout.strip() else None


def collecter(depot, lot):
    """Les faits git de chaque branche face à la base (avance, retard, fichiers, lignes, commits de
    chaque côté depuis le départ commun, conflits avec la base), et les conflits entre deux branches."""
    base = lot.get("base") or "main"
    r = lancer_git(depot, "rev-parse", "--git-dir")
    if r is None:
        raise ErreurDepot("git introuvable")
    if r.returncode != 0:
        raise ErreurDepot("%s n'est pas un dépôt git" % depot)
    r = lancer_git(depot, "rev-parse", "--verify", "--quiet", base + "^{commit}")
    if r is None or r.returncode != 0:
        raise ErreurDepot("base %s introuvable dans %s" % (base, depot))
    faits = {}
    for t in lot["taches"]:
        b = t["branche"]
        if b in faits:
            continue
        r = lancer_git(depot, "rev-parse", "--verify", "--quiet", b + "^{commit}")
        if r is None or r.returncode != 0:
            faits[b] = vide()
            continue
        compte = lancer_git(depot, "rev-list", "--left-right", "--count", "%s...%s" % (base, b))
        retard, avance = (int(x) for x in compte.stdout.split()) if compte and compte.returncode == 0 else (0, 0)
        stat = lancer_git(depot, "diff", "--numstat", "%s...%s" % (base, b))
        fichiers, plus, moins = [], 0, 0
        for l in (stat.stdout.splitlines() if stat and stat.returncode == 0 else []):
            p, m, nom = (l.split("\t", 2) + ["", "", ""])[:3]
            if not nom:
                continue
            fichiers.append(nom)
            plus += int(p) if p.isdigit() else 0
            moins += int(m) if m.isdigit() else 0
        conflits_main = conflits_entre(depot, base, b) if avance else []
        cote_base = commits_de(depot, "%s..%s" % (b, base), "base")
        if conflits_main:
            touchent = {c["hash"] for c in commits_de(depot, "%s..%s" % (b, base), "base", *conflits_main)}
            for c in cote_base:
                c["conflit"] = c["hash"] in touchent
        commits = sorted(cote_base + commits_de(depot, "%s..%s" % (base, b), "branche"), key=lambda c: -c["date"])
        faits[b] = {"existe": True, "avance": avance, "retard": retard, "fichiers": sorted(fichiers),
                    "conflits_main": conflits_main, "commits": commits, "plus": plus, "moins": moins,
                    "depart": depart_de(depot, base, b)}
    vivantes = [b for b, f in faits.items() if f["existe"] and f["avance"]]
    conflits = {}
    for i, a in enumerate(vivantes):
        for b in vivantes[i + 1:]:
            conflits[paire(a, b)] = conflits_entre(depot, a, b)
    return faits, conflits


# ---------------------------------------------------------------- rendus


def tests_dits(t):
    return {"verts": "verts", "rouges": "rouges"}.get(t.get("tests"), "à lancer")


def dans_l_ordre(analyse):
    par_id = {t["id"]: t for t in analyse["taches"]}
    rang = {i: n + 1 for n, i in enumerate(analyse["ordre"])}
    return [(rang.get(t["id"]), t) for t in [par_id[i] for i in analyse["ordre"]] + [t for t in analyse["taches"] if t["id"] not in rang]]


def verdict(f):
    """Le mot d'un fichier partagé : la ou les paires en conflit, sinon fusion propre ou inconnu."""
    if f["conflit"]:
        return "conflit entre " + ", ".join("#%s et #%s" % tuple(p) for p in f["en_conflit"])
    return "conflit inconnu" if f["conflit"] is None else "fusion propre"


def cellule(x):
    return re.sub(r"\s+", " ", str(x)).replace("|", "/").strip()


def texte(analyse):
    """Le repli pour le terminal : le même état en tableau Markdown."""
    base = analyse["base"]
    out = ["| Ordre | Tâche | Titre | Branche | Face à %s | Tests | État |" % base, "|---|---|---|---|---|---|---|"]
    for rang, t in dans_l_ordre(analyse):
        fa = t["faits"]
        face = "introuvable" if not fa["existe"] else "+%d / -%d commits, +%d -%d lignes" % (fa["avance"], fa["retard"], fa["plus"], fa["moins"])
        out.append("| %s | #%s | %s | %s | %s | %s | %s |" % (
            rang or "-", t["id"], cellule(t.get("titre") or ""), cellule(t["branche"]), face, tests_dits(t), t["etat"]))
    out.append("")
    if analyse["chevauchements"]:
        out.append("Fichiers touchés par deux branches :")
        for f in analyse["chevauchements"]:
            out.append("- %s : %s (%s)" % (f["fichier"], ", ".join("#%s" % i for i in f["ids"]), verdict(f)))
    else:
        out.append("Aucun fichier touché par deux branches.")
    out.append("")
    out.append("Ordre de fusion proposé : %s" % (", ".join("#%s" % i for i in analyse["ordre"]) or "aucune branche à fusionner"))
    if analyse["boucle"]:
        out.append("Dépendances en boucle : %s" % ", ".join("#%s" % i for i in analyse["boucle"]))
    if analyse["conflits_inconnus"]:
        out.append("Certains conflits sont inconnus : git 2.38 ou plus les calcule.")
    return "\n".join(out)


# ---------------------------------------------------------------- ligne de commande


def lire_lot(chemin):
    if chemin == "-":
        return json.load(sys.stdin)
    with open(chemin, encoding="utf-8") as f:
        return json.load(f)


def doublon(taches):
    """Le message d'une tâche ou d'une branche donnée deux fois, sinon None."""
    vus_ids, vues = set(), set()
    for t in taches:
        if t["id"] in vus_ids:
            return "#%s donné pour deux tâches" % t["id"]
        if t["branche"] in vues:
            return "branche %s donnée pour deux tâches" % t["branche"]
        vus_ids.add(t["id"])
        vues.add(t["branche"])
    return None


def main(argv=None):
    p = argparse.ArgumentParser(description="État d'un Lot : texte ou JSON.")
    p.add_argument("depot")
    p.add_argument("lot")
    g = p.add_mutually_exclusive_group()
    g.add_argument("--texte", action="store_const", const="texte", dest="rendu")
    g.add_argument("--json", action="store_const", const="json", dest="rendu")
    a = p.parse_args(argv)
    try:
        lot = lire_lot(a.lot)
        taches = lot.get("taches") if isinstance(lot, dict) else None
    except (OSError, ValueError) as err:
        print("%s illisible : %s" % (a.lot, err), file=sys.stderr)
        return 2
    if not taches or not all(isinstance(t, dict) and "id" in t and t.get("branche") for t in taches):
        print("%s : aucune tâche dans le lot (chaque tâche porte id et branche)" % a.lot, file=sys.stderr)
        return 2
    double = doublon(taches)
    if double:
        print("%s : %s" % (a.lot, double), file=sys.stderr)
        return 2
    try:
        faits, conflits = collecter(a.depot, lot)
    except ErreurDepot as err:
        print(str(err), file=sys.stderr)
        return 2
    analyse = analyser(lot, faits, conflits)
    if a.rendu == "json":
        print(json.dumps(analyse, ensure_ascii=False, indent=2))
    else:
        print(texte(analyse))
    return 0


if __name__ == "__main__":
    sys.exit(main())
