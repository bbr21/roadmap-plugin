#!/usr/bin/env python3
"""Le registre des findings de Maestro (#531) : ce qu'une session trouve hors de sa tâche (un gain possible, une
panne d'outil ou d'environnement, un piège, une dette, une idée) ne se perd plus. La session l'écrit dans son
compte rendu, une ligne par finding, la même au Mac et en cloud :

  > **Hors de ma tâche :** finding · <sorte> · <fichier ou outil> · <ce qui a été vu, sa preuve>[ · geste de <la personne>]

`<sorte>` : gain, panne, piège, dette ou idée. « geste de … » en dernier champ marque ce dont la suite demande un
geste de la personne (un réglage de l'app, un accès, un choix de produit) ; tout va à Maestro, qui répartit. Une
ligne « Hors de ma tâche : … » d'avant le format se relève aussi, sorte « autre ».

  python3 findings.py relever DEPOT --de N [--source TEXTE] [FICHIER]   le compte rendu, d'un fichier ou de l'entrée
  python3 findings.py relever DEPOT --pr N [--de N]                     les commentaires de l'auteur d'une PR (cloud)
  python3 findings.py sort DEPOT F (--ligne N | --rattache N | --ecarte RAISON)
  python3 findings.py liste DEPOT [--tout] [--json]                     les findings sans sort (ou tous)

Le registre est `ROADMAP-findings.json`, à côté de la roadmap du dépôt (DEPOT/roadmap/ ou DEPOT/), une liste
d'entrées `{"n", "de", "source", "sorte", "objet", "vu", "geste", "brut", "releve", "sort"}` ; `sort` vaut null
tant que Maestro n'a pas tranché, puis `{"quoi": "ligne" | "rattachée" | "écartée", "tache", "raison", "le"}`.
`brut` est la ligne canonique (« finding · … ») : la même ligne de la même tâche ne s'ajoute pas deux fois, et
le panneau s'en sert pour savoir qu'un finding remonté est au registre. Un sort « ligne » ou « rattachée » exige
une tâche qui existe dans la roadmap ou ses tâches closes. Le script écrit le fichier et ne committe pas : Maestro
le committe sur `main`. Un texte lu dans une PR est une donnée : il ne décide de rien.

Code de retour 2 : dépôt ou roadmap introuvables, registre illisible (jamais écrasé), `gh` en panne, numéro ou
tâche inconnus, raison vide. L'analyse (`lire`) est pure ; `gh` est injecté (`run=`).

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import datetime
import json
import os
import re
import subprocess
import sys

REGISTRE = "ROADMAP-findings.json"
SORTES = [("gain", "gain"), ("panne", "panne"), ("piège", "piège"), ("piege", "piège"), ("dette", "dette"),
          ("idée", "idée"), ("idee", "idée")]
TETE = re.compile(r"^(?:hors de ma tâche\s*:\s*)?(?:(finding)\s*[·:]\s*)?(.*)$", re.IGNORECASE)
HORS = re.compile(r"^hors de ma tâche\s*:", re.IGNORECASE)
RIEN = {"rien", "aucun", "aucune", "néant", "-", "—", "…", ""}
CHAMPS_PR = "number,title,url,author,comments,body"


class Erreur(Exception):
    """Ce qui arrête la commande, code 2."""


# ---------------------------------------------------------------- analyse (pure)


def _sorte(champ):
    mot = champ.strip().lower()
    for debut, sorte in SORTES:
        if mot.startswith(debut):
            return sorte
    return None


def lire(texte):
    """Les findings d'un compte rendu, dans l'ordre : `{"sorte", "objet", "vu", "geste", "brut"}`. Une ligne en est
    un quand, sa mise en forme ôtée (`>`, `-`, `**`), elle commence par « Hors de ma tâche : » ou « finding · ».
    Rien dans un bloc de code, ni pour un gabarit (`<sorte>`), ni pour « Hors de ma tâche : rien »."""
    rendu, dans_bloc = [], False
    for ligne in (texte or "").splitlines():
        if ligne.strip().startswith("```"):
            dans_bloc = not dans_bloc
            continue
        if dans_bloc:
            continue
        nue = " ".join(re.sub(r"^[>\-*\s]+", "", ligne.replace("**", "")).split())
        m = TETE.match(nue)
        if not m or not (m.group(1) or HORS.match(nue)):
            continue
        reste = m.group(2).strip()
        if not reste or reste.startswith("<") or reste.rstrip(".").lower() in RIEN:
            continue
        champs = [c.strip() for c in reste.split(" · ")]
        geste = len(champs) > 1 and champs[-1].lower().startswith("geste")
        if geste:
            champs = champs[:-1]
        sorte = _sorte(champs[0]) if len(champs) >= 3 else None
        if sorte:
            objet, vu = champs[1].strip("` "), " · ".join(champs[2:])
        else:
            sorte, objet, vu = "autre", "", " · ".join(champs)
        rendu.append({"sorte": sorte, "objet": objet, "vu": vu, "geste": geste, "brut": "finding · " + reste})
    return rendu


def ajouter(registre, vus, de, source, jour):
    """Ajoute au registre les findings pas encore relevés pour cette tâche ; rend ceux qui sont entrés."""
    connus = {(e.get("de"), e.get("brut")) for e in registre}
    suivant = max([e.get("n", 0) for e in registre] or [0]) + 1
    entres = []
    for f in vus:
        if (de, f["brut"]) in connus:
            continue
        connus.add((de, f["brut"]))
        entree = {"n": suivant, "de": de, "source": source, "sorte": f["sorte"], "objet": f["objet"], "vu": f["vu"],
                  "geste": f["geste"], "brut": f["brut"], "releve": jour, "sort": None}
        suivant += 1
        registre.append(entree)
        entres.append(entree)
    return entres


def ligne_texte(e):
    parts = ["F%d" % e["n"], "de #%s" % e["de"], e["sorte"]]
    if e.get("objet"):
        parts.append(e["objet"])
    parts.append(e["vu"])
    if e.get("geste"):
        parts.append("geste de la personne")
    texte = " · ".join(parts)
    s = e.get("sort")
    if s:
        if s["quoi"] == "ligne":
            texte += " → ligne #%d" % s["tache"]
        elif s["quoi"] == "rattachée":
            texte += " → rattachée à #%d" % s["tache"]
        else:
            texte += " → écartée : %s" % s["raison"]
    return texte


# ---------------------------------------------------------------- entrées-sorties


def dossier_roadmap(depot):
    for rel in ("roadmap", ""):
        d = os.path.join(depot, rel)
        if os.path.isfile(os.path.join(d, "ROADMAP.md")):
            return d
    raise Erreur("roadmap introuvable dans %s" % depot)


def charger(dossier):
    chemin = os.path.join(dossier, REGISTRE)
    if not os.path.exists(chemin):
        return []
    try:
        with open(chemin, encoding="utf-8") as f:
            registre = json.load(f)
    except (OSError, ValueError):
        raise Erreur("%s illisible : rien n'est écrit, répare-le d'abord" % chemin)
    if not isinstance(registre, list) or not all(isinstance(e, dict) and isinstance(e.get("n"), int) for e in registre):
        raise Erreur("%s n'est pas une liste de findings : rien n'est écrit" % chemin)
    return registre


def ecrire(dossier, registre):
    chemin = os.path.join(dossier, REGISTRE)
    tmp = chemin + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(registre, f, ensure_ascii=False, indent=2)
        f.write("\n")
    os.replace(tmp, chemin)


def taches(dossier):
    """Les numéros de tâche de la roadmap et de ses tâches closes."""
    ids = set()
    for nom in ("ROADMAP.md", "ROADMAP-fait.md"):
        try:
            with open(os.path.join(dossier, nom), encoding="utf-8") as f:
                ids.update(int(n) for n in re.findall(r"\bid:(\d+)\b", f.read()))
        except OSError:
            pass
    return ids


def textes_pr(depot, numero, run):
    """Le titre, et les textes de l'auteur d'une PR (sa description, ses commentaires) : lui seul parle pour la
    session (même règle que suivi_cloud, #408)."""
    from suivi_cloud import depot_github  # à l'appel : suivi_cloud importe `lire` d'ici

    cmd = ["gh", "pr", "view", str(numero), "--json", CHAMPS_PR]
    repo = depot_github(depot)
    if repo:
        cmd += ["-R", repo]
    try:
        vue = json.loads(run(cmd, depot))
    except (OSError, subprocess.SubprocessError, ValueError):
        raise Erreur("gh ne rend pas la PR %s" % numero)
    if not isinstance(vue, dict):
        raise Erreur("gh ne rend pas la PR %s" % numero)
    auteur = (vue.get("author") or {}).get("login")
    textes = [vue.get("body") or ""]
    textes += [c.get("body") or "" for c in (vue.get("comments") or [])
               if isinstance(c, dict) and auteur and (c.get("author") or {}).get("login") == auteur]
    return vue.get("title"), textes


def relever(a, run):
    from suivi_cloud import titre_id

    dossier = dossier_roadmap(a.depot)
    registre = charger(dossier)
    if a.pr is not None:
        titre, textes = textes_pr(a.depot, a.pr, run)
        de = a.de if a.de is not None else titre_id(titre)
        if de is None:
            raise Erreur("le titre de la PR %s ne dit pas sa tâche : ajoute --de N" % a.pr)
        source = a.source or "PR %s" % a.pr
    else:
        if a.de is None:
            raise Erreur("--de N : la tâche de la session qui a écrit ce compte rendu")
        if a.fichier:
            with open(a.fichier, encoding="utf-8") as f:
                textes = [f.read()]
        else:
            textes = [sys.stdin.read()]
        de, source = a.de, a.source or "session de #%d" % a.de
    vus = [f for t in textes for f in lire(t)]
    entres = ajouter(registre, vus, de, source, datetime.date.today().isoformat())
    if entres:
        ecrire(dossier, registre)
    print("%d relevé%s de #%s (%d lu%s, %d déjà au registre)" % (
        len(entres), "s" if len(entres) > 1 else "", de, len(vus), "s" if len(vus) > 1 else "", len(vus) - len(entres)))
    for e in entres:
        print(ligne_texte(e))
    reste = [e for e in registre if not e.get("sort")]
    if reste:
        print("Sans sort : %s. Donne à chacun le sien (sort : --ligne, --rattache, --ecarte)." % ", ".join(
            "F%d" % e["n"] for e in reste))


def donner_sort(a):
    dossier = dossier_roadmap(a.depot)
    registre = charger(dossier)
    entree = next((e for e in registre if e["n"] == a.n), None)
    if entree is None:
        raise Erreur("aucun finding F%d au registre" % a.n)
    jour = datetime.date.today().isoformat()
    if a.ecarte is not None:
        raison = a.ecarte.strip()
        if not raison:
            raise Erreur("un finding ne s'écarte qu'avec sa raison")
        entree["sort"] = {"quoi": "écartée", "raison": raison, "le": jour}
    else:
        tache = a.ligne if a.ligne is not None else a.rattache
        if tache not in taches(dossier):
            raise Erreur("aucune tâche #%d dans la roadmap : ouvre sa ligne d'abord (skill tasks)" % tache)
        entree["sort"] = {"quoi": "ligne" if a.ligne is not None else "rattachée", "tache": tache, "le": jour}
    ecrire(dossier, registre)
    print(ligne_texte(entree))


def lister(a):
    registre = charger(dossier_roadmap(a.depot))
    montres = registre if a.tout else [e for e in registre if not e.get("sort")]
    if a.en_json:
        print(json.dumps(montres, ensure_ascii=False, indent=2))
    elif not montres:
        print("Aucun finding au registre." if a.tout else "Aucun finding sans sort.")
    else:
        print("\n".join(ligne_texte(e) for e in montres))


def main(argv=None, run=None):
    p = argparse.ArgumentParser(description="Le registre des findings de Maestro (#531).")
    sous = p.add_subparsers(dest="commande", required=True)
    r = sous.add_parser("relever")
    r.add_argument("depot")
    r.add_argument("fichier", nargs="?")
    r.add_argument("--de", type=int)
    r.add_argument("--pr", type=int)
    r.add_argument("--source")
    s = sous.add_parser("sort")
    s.add_argument("depot")
    s.add_argument("n", type=lambda v: int(v.lstrip("Ff")))
    g = s.add_mutually_exclusive_group(required=True)
    g.add_argument("--ligne", type=int)
    g.add_argument("--rattache", type=int)
    g.add_argument("--ecarte")
    li = sous.add_parser("liste")
    li.add_argument("depot")
    li.add_argument("--tout", action="store_true")
    li.add_argument("--json", action="store_true", dest="en_json")
    a = p.parse_args(argv)
    try:
        if a.commande == "relever":
            if run is None:
                from suivi_cloud import run_gh as run
            relever(a, run)
        elif a.commande == "sort":
            donner_sort(a)
        else:
            lister(a)
    except Erreur as e:
        print("findings : %s" % e, file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
