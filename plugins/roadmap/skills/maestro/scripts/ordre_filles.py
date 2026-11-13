#!/usr/bin/env python3
"""The launch order of a parent task's daughters (#552), for Maestro.

  python3 ordre_filles.py FOLDER PARENT_ID [--json]

A parent task is an empty shell: launching it means launching its open daughters. This reads the roadmap of FOLDER
(through tasks.py) and sorts the open daughters of PARENT_ID into waves; a wave starts in parallel.

- A daughter with `qui:` and `branche:` is already in a session: listed apart (`en_session`), never launched again,
  but its files and its state count (a sister that waits for it by `après:` goes after it).
- Prerequisites: `après:` toward open sisters. An `après:` toward an open task outside the parent goes to `attend`
  (the daughter does not start before it); toward a done or unknown task, ignored.
- Files: the places of `tasks.contexte_tache` (label, note, sheet, spec) that look like a file path.
- Waves: topological order. A daughter's wave is 1 + the highest wave of its open sister prerequisites to launch
  (a sister in session counts as wave 0), 1 without any. If it shares a file with a daughter already placed in that
  wave (or in session), it moves to the next wave and an `après:` is to be set: `apres_a_poser`. A loop of `après:`
  is reported in `boucle` and its daughters go to the last wave; nothing crashes.
- Empty waves are dropped.

With --json: {"mere": {"id", "nom"}, "vagues": [[{"id", "nom", "apres", "fichiers", "attend"}]], "apres_a_poser":
[{"id", "apres", "fichiers"}], "en_session": [{"id", "nom", "branche"}], "boucle": [ids]}. Without: a short text.
Exit code 0, 1 for a parent not found or without any open daughter, 2 for an unreadable roadmap. Read-only.

Python 3.9 and later, standard library only.
"""

import argparse
import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "tasks", "scripts"))
import tasks  # noqa: E402

EXTENSIONS = ("py", "ts", "tsx", "md", "json", "mjs", "sh", "js", "css", "csv", "yml", "yaml", "swift", "html")
FICHIER_RE = re.compile(r"/|\.(?:%s)$" % "|".join(EXTENSIONS))


def _numero(i):
    return (0, int(i)) if str(i).isdigit() else (1, str(i))


def _nom(t):
    nom = (t["champs"].get("nom") or "").strip()
    return nom or t["libelle"]


def _fichiers(dossier, t):
    lieux = tasks.contexte_tache(dossier, t)["lieux"]
    return sorted(l for l, genre in lieux.items() if genre == "fichier" or FICHIER_RE.search(l))


def _liste(valeur):
    return [x.strip().lstrip("#") for x in (valeur or "").split(",") if x.strip() not in ("", "-")]


def _boucle(prereq):
    """Les filles qu'un tri topologique ne peut pas poser : dans une boucle, ou derrière elle."""
    restantes = set(prereq)
    while True:
        prets = {f for f in restantes if not (prereq[f] & restantes)}
        if not prets:
            return sorted(restantes, key=_numero)
        restantes -= prets


def ordre(dossier, mere):
    """Le résultat décrit plus haut, ou None quand la mère est introuvable ; ValueError sans fille ouverte."""
    ctx = tasks.contexte(dossier)
    par_id = {t["id"]: t for t in ctx["taches"]}
    m = par_id.get(str(mere).lstrip("#"))
    if m is None:
        return None
    filles = [par_id[i] for i in m["enfants"] if i in par_id]
    if not filles:
        raise ValueError("la mère #%s n'a aucune fille ouverte" % m["id"])
    ids = {t["id"] for t in filles}
    session = {t["id"] for t in filles if t["champs"].get("qui") and t["champs"].get("branche")}
    a_lancer = sorted(ids - session, key=_numero)
    fichiers = {t["id"]: _fichiers(dossier, t) for t in filles}
    prereq, attend = {}, {}
    for t in filles:
        refs = _liste(t["champs"].get("après"))
        prereq[t["id"]] = {r for r in refs if r in ids and r != t["id"]}
        attend[t["id"]] = [r for r in refs if r in par_id and r not in ids]
    boucle = _boucle({f: {p for p in prereq[f] if p not in session} for f in a_lancer})
    vague, parmi, a_poser = {}, {}, {}
    for f in session:
        vague[f] = 0
    # Les filles sans boucle d'abord, en ordre topologique ; celles de la boucle à la fin, leurs liens entre elles ignorés.
    restantes = [f for f in a_lancer if f not in boucle]
    while restantes:
        f = next(x for x in restantes if all(p in vague for p in prereq[x]))
        restantes.remove(f)
        _placer(f, prereq, vague, parmi, fichiers, session, a_poser)
    derniere = max(parmi, default=0) + 1
    for f in boucle:
        vague[f] = derniere
        parmi.setdefault(derniere, []).append(f)
    nombre = max(parmi) if parmi else 0
    vagues = []
    for n in range(1, nombre + 1):
        membres = []
        for f in parmi.get(n, []):
            apres = sorted(prereq[f] | set(a_poser.get(f, {}).get("apres", [])), key=_numero)
            membres.append({"id": f, "nom": _nom(par_id[f]), "apres": apres, "fichiers": fichiers[f],
                            "attend": sorted(attend[f], key=_numero)})
        if membres:
            vagues.append(membres)
    return {
        "mere": {"id": m["id"], "nom": _nom(m)},
        "vagues": vagues,
        "apres_a_poser": [{"id": f, "apres": sorted(v["apres"], key=_numero), "fichiers": sorted(v["fichiers"])}
                          for f, v in sorted(a_poser.items(), key=lambda kv: _numero(kv[0]))],
        "en_session": [{"id": f, "nom": _nom(par_id[f]), "branche": par_id[f]["champs"]["branche"]}
                       for f in sorted(session, key=_numero)],
        "boucle": boucle,
    }


def _placer(f, prereq, vague, parmi, fichiers, session, a_poser):
    n = 1 + max([vague[p] for p in prereq[f] if p in vague] or [0])
    while True:
        voisines = list(parmi.get(n, [])) + (sorted(session) if n == 1 else [])
        communs = {g: sorted(set(fichiers[f]) & set(fichiers[g])) for g in voisines if g != f}
        communs = {g: c for g, c in communs.items() if c}
        if not communs:
            break
        a = a_poser.setdefault(f, {"apres": set(), "fichiers": set()})
        a["apres"].update(communs)
        for c in communs.values():
            a["fichiers"].update(c)
        n += 1
    vague[f] = n
    parmi.setdefault(n, []).append(f)


def texte(r):
    lignes = []
    for n, membres in enumerate(r["vagues"], 1):
        morceaux = []
        for f in membres:
            s = "#" + f["id"]
            dits = []
            if f["apres"]:
                dits.append("après " + ", ".join("#" + a for a in f["apres"]))
            if f["attend"]:
                dits.append("attend " + ", ".join("#" + a for a in f["attend"]))
            morceaux.append(s + (" (%s)" % " ; ".join(dits) if dits else ""))
        tete = "Vague %d%s" % (n, " (en parallèle)" if len(membres) > 1 and n == 1 else "")
        lignes.append("%s : %s" % (tete, ", ".join(morceaux)))
    for p in r["apres_a_poser"]:
        lignes.append("À poser : %s sur #%s (fichier commun : %s)" % (
            ", ".join("après:#" + a for a in p["apres"]), p["id"], ", ".join(p["fichiers"])))
    if r["en_session"]:
        lignes.append("En session : " + ", ".join("#" + e["id"] for e in r["en_session"]))
    if r["boucle"]:
        lignes.append("Boucle d'après: : " + ", ".join("#" + b for b in r["boucle"]))
    return "\n".join(lignes)


def main(argv=None):
    p = argparse.ArgumentParser(description="Launch order of the open daughters of a parent task (#552).")
    p.add_argument("dossier")
    p.add_argument("mere", help="id of the parent task, with or without #")
    p.add_argument("--json", action="store_true")
    a = p.parse_args(argv)
    try:
        r = ordre(a.dossier, a.mere)
    except ValueError as e:
        print(str(e), file=sys.stderr)
        return 1
    except tasks.Erreur as e:
        print(str(e), file=sys.stderr)
        return 2
    if r is None:
        print("mère #%s introuvable dans les tâches ouvertes" % a.mere.lstrip("#"), file=sys.stderr)
        return 1
    print(json.dumps(r, ensure_ascii=False, indent=2) if a.json else texte(r))
    return 0


if __name__ == "__main__":
    sys.exit(main())
