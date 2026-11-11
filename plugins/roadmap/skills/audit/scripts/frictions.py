#!/usr/bin/env python3
"""La lecture des frictions (#462) : ce qui revient dans les bilans devient une tâche proposée.

Chaque clôture laisse son bilan (`ROADMAP-bilans.csv`, ou le journal que déclare `cowork.json`), avec sa
cause, prise dans la liste fermée de `tasks.py` (#460), son lieu (cloud, mac) et son type (code, doc, rendu,
sans-code). La lecture croise les trois sur une fenêtre (28 jours par défaut) : dès qu'un même croisement
revient trois fois, elle propose sa tâche, sous la forme d'une question de l'audit (`kind` « friction »), la
recommandation « Ouvrir la tâche » en premier, avec l'opération `add` de `tasks.py write` toute prête.

- **Une seule proposition par friction.** La tâche ouverte porte dans son libellé sa marque
  « (friction <cause> · <lieu> · <type> : #a, #b, #c) » : le compte de ce croisement repart de son `ouvert:`.
  « Pas maintenant » l'écarte (`ecarter`) : il repart de ce jour. Il faut trois nouvelles occurrences.
- **Le juge de la reco apprend** (#461) : dans le dépôt du plugin, une friction « environnement » en cloud
  (une tâche calée faute du Mac) propose d'ajouter ses tâches à `RECO_STALLED_EXAMPLES` de `hooks/parse.ts`,
  celles qui y sont déjà mises à part.
- **Un journal pas encore rangé** (sans `lieu` ni `type`, `tools/ranger_bilans.py`) se lit quand même : le
  compte rendu le dit et les causes se comptent seules (« tous ») ; une cause hors de la liste est montrée
  à part, jamais proposée.

Lancée par l'audit (son relevé porte `frictions`) et chaque semaine par Maestro (`hebdo`). La lecture
n'écrit rien ; `hebdo` et `ecarter` tiennent leur mémoire hors du dépôt suivi : `<git>/roadmap-frictions.json`
(comme `roadmap-reco.json`), sinon `~/.claude/roadmap-frictions.json`.

    python3 frictions.py <dossier> [lire] [--json] [--jours 28] [--seuil 3] [--max 3]
    python3 frictions.py <dossier> hebdo [--json]
    python3 frictions.py <dossier> ecarter <clé> [<clé> …]
"""
import argparse
import collections
import csv
import datetime
import io
import json
import os
import re
import subprocess
import sys

ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ICI)
sys.path.insert(0, os.path.join(ICI, "..", "..", "tasks", "scripts"))
sys.path.insert(0, os.path.join(ICI, "..", "..", "onboarding", "scripts"))
import audit  # noqa: E402
import importer as im  # noqa: E402
import tasks  # noqa: E402

JOURS = 28
SEUIL = 3
MAXI = 3
SEMAINE = 7
TOUS = "tous"
PAS_UNE_FRICTION = {"aucune", "sans-bilan"}
FICHIER_ETAT = "roadmap-frictions.json"
PARSE_TS = os.path.join("plugins", "roadmap", "hooks", "parse.ts")
RANGER = os.path.join("tools", "ranger_bilans.py")

# Ce que la tâche proposée fait, par cause : un verbe et son objet, puis « des tâches <type> <lieu> ».
ACTIONS = {
    "spec-floue": "Préciser le cadrage",
    "attente-tiers": "Réduire l'attente d'un tiers dans le travail",
    "bug-outil": "Corriger les défauts d'outil qui freinent le travail",
    "refait": "Éviter le travail refait",
    "périmètre-élargi": "Tenir le périmètre",
    "charge-mac": "Alléger la charge du Mac pendant le travail",
    "conflit-parallèle": "Éviter les conflits entre sessions parallèles dans le travail",
    "environnement": "Compléter l'environnement",
}
TYPES_MOTS = {"code": "de code", "doc": "de doc", "rendu": "de rendu", "sans-code": "sans code"}
LIEUX_MOTS = {"cloud": "en cloud", "mac": "sur le Mac"}
MARQUE = re.compile(r"\(friction (\S+) · (\S+) · (\S+?)(?: :|\))")


Erreur = audit.Erreur


def cle(cause, lieu, type_):
    return "friction-%s-%s-%s" % (cause, lieu or TOUS, type_ or TOUS)


def _moins(jour, jours):
    return (datetime.date.fromisoformat(jour) - datetime.timedelta(days=jours)).isoformat()


def _jj_mm(date):
    return datetime.date.fromisoformat(date).strftime("%d/%m")


# ---------------------------------------------------------------- la mémoire (hebdo, écartées)


def etat_par_defaut(dossier):
    """`<git>/roadmap-frictions.json` (le dossier git commun, hors du dépôt suivi), sinon ~/.claude."""
    try:
        res = subprocess.run(["git", "-C", dossier, "rev-parse", "--path-format=absolute", "--git-common-dir"],
                             capture_output=True, text=True, timeout=10)
        if res.returncode == 0 and res.stdout.strip():
            return os.path.join(res.stdout.strip(), FICHIER_ETAT)
    except (OSError, subprocess.SubprocessError):
        pass
    return os.path.join(os.path.expanduser("~/.claude"), FICHIER_ETAT)


def _lire_etat(etat):
    try:
        with open(etat, encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, dict) and isinstance(data.get("dossiers"), dict) else {"dossiers": {}}
    except (OSError, ValueError):
        return {"dossiers": {}}


def _du_dossier(data, dossier):
    return data["dossiers"].setdefault(os.path.realpath(dossier), {})


def _ecrire_etat(etat, data):
    os.makedirs(os.path.dirname(etat), exist_ok=True)
    data["version"] = 1
    tmp = etat + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1, sort_keys=True)
    os.replace(tmp, etat)


# ---------------------------------------------------------------- la lecture


def _lignes(rdir):
    """Les lignes ouvertes et closes de la roadmap : [{id, axe, libelle, ouvert}]."""
    out = []
    for nom in (audit.FICHIER_OUVERT, audit.FICHIER_FAIT):
        texte = audit._lire_fichier(os.path.join(rdir, nom)) or ""
        for t in im.lire_checklist(texte)[0]:
            out.append({"id": im.champ(t, "id"), "axe": t["axe"], "texte": "%s %s" % (t["libelle"], t["note"] or ""),
                        "ouvert": im.champ(t, "ouvert") or ""})
    return out


def _couvertes(lignes):
    """{clé: date} : le dernier `ouvert:` d'une tâche qui porte la marque de sa friction."""
    out = {}
    for ligne in lignes:
        for cause, lieu, type_ in MARQUE.findall(ligne["texte"]):
            k = cle(cause, None if lieu == TOUS else lieu, None if type_ == TOUS else type_)
            out[k] = max(out.get(k, ""), ligne["ouvert"][:10])
    return out


def _exemples_reco(dossier):
    """Les ids déjà dans `RECO_STALLED_EXAMPLES` (#461), ou None hors du dépôt du plugin."""
    texte = audit._lire_fichier(os.path.join(dossier, PARSE_TS))
    if texte is None:
        return None
    m = re.search(r"RECO_STALLED_EXAMPLES\b[^=]*=\s*\[(.*?)\n\]", texte, re.S)
    return set(re.findall(r"\bid:\s*'(\d+)'", m.group(1))) if m else set()


def _journal(dossier, rdir):
    j = tasks.journal_de_bilan(dossier, rdir)
    texte = audit._lire_fichier(j["chemin"])
    if texte is None:
        return j, None, []
    lecteur = csv.DictReader(io.StringIO(texte))
    return j, list(lecteur.fieldnames or []), [r for r in lecteur]


def _axe(ids, lignes):
    """L'axe le plus fréquent des tâches de la friction, sinon le premier de la roadmap."""
    par_id = {l["id"]: l["axe"] for l in lignes if l["axe"]}
    axes = collections.Counter(par_id[i] for i in ids if i in par_id)
    if axes:
        return axes.most_common(1)[0][0]
    return next((l["axe"] for l in lignes if l["axe"]), "")


def _proposition(f, jour, lignes, reco):
    cause, lieu, type_, ids = f["cause"], f["lieu"], f["type"], f["ids"]
    marque = "friction %s · %s · %s : %s" % (cause, lieu or TOUS, type_ or TOUS, ", ".join("#" + i for i in ids))
    if reco:
        label = ("Ajouter aux exemples du juge de la reco (RECO_STALLED_EXAMPLES de hooks/parse.ts) les tâches "
                 "lancées en cloud qui ont calé faute du Mac")
        quoi = "des tâches en cloud calées sur leur environnement"
    else:
        quoi = " ".join(x for x in ("des tâches", TYPES_MOTS.get(type_ or ""), LIEUX_MOTS.get(lieu or "")) if x)
        action = ACTIONS.get(cause)
        label = ("%s %s" % (action, quoi)) if action else "Lever la friction « %s » %s" % (cause, quoi)
    add = {"op": "add", "key": "f1", "label": label, "axis": _axe(ids, lignes), "section": "Prochain",
           "note": marque, "zone": "bilans " + " ".join("#" + i for i in ids),
           "distinct": "friction relevée dans les bilans (#462)"}
    k = cle(cause, lieu, type_)
    question = "La friction « %s » revient %d fois %s depuis le %s (%s) : ouvrir sa tâche ?" % (
        cause, len(ids), quoi, _jj_mm(f["depuis"]), ", ".join("#" + i for i in ids))
    return {"key": k, "kind": "friction", "priority": None, "asked": jour, "about": label,
            "question": question, "soucis": f["soucis"],
            "options": [{"label": "Ouvrir la tâche (recommandé)", "operations": [add]},
                        {"label": "Pas maintenant", "operations": [], "ecarter": k}]}


def lire(dossier, jour=None, jours=JOURS, seuil=SEUIL, maxi=MAXI, etat=None):
    """La lecture des frictions, sans rien écrire (le relevé du module)."""
    jour = jour or datetime.date.today().isoformat()
    dossier, rdir, _mode = audit.situer(dossier)
    etat = etat or etat_par_defaut(dossier)
    ecartees = _du_dossier(_lire_etat(etat), dossier).get("ecartees") or {}
    j, entete, rangs = _journal(dossier, rdir)
    manque = [c for c in tasks.BILAN_COMPTE if c not in (entete or [])]
    out = {"journal": j["chemin"], "jour": jour, "fenetre": _moins(jour, jours), "seuil": seuil,
           "range": entete is not None and not manque, "manque": manque if entete is not None else [],
           "message": None, "tableau": [], "hors_liste": [], "propositions": [], "a_suivre": [],
           "couvertes": {}, "ecartees": dict(ecartees)}
    if entete is None:
        out["message"] = "pas de journal des bilans (%s) : rien à lire" % j["chemin"]
        return out
    if manque:
        rangement = " (python3 %s --apply les pose)" % RANGER if os.path.isfile(os.path.join(dossier, RANGER)) else ""
        out["message"] = "journal pas encore rangé : colonnes %s absentes, les causes se comptent seules%s" % (
            ", ".join(manque), rangement)
    lignes = _lignes(rdir)
    couvertes = _couvertes(lignes)
    out["couvertes"] = couvertes
    exemples = _exemples_reco(dossier)
    causes = set(j["causes"]) - PAS_UNE_FRICTION

    groupes, hors = collections.OrderedDict(), collections.OrderedDict()
    for r in sorted(rangs, key=lambda r: (r.get("date") or "")[:10]):
        date = (r.get("date") or "")[:10]
        cause = (r.get("cause") or "").strip()
        ident = (r.get("id") or "").strip()
        if not re.match(r"\d{4}-\d{2}-\d{2}$", date) or date <= out["fenetre"] or date > jour:
            continue
        if cause in PAS_UNE_FRICTION or (not cause and (r.get("ressenti") or "").strip() in ("", "fluide")):
            continue
        if cause not in causes:
            hors.setdefault(cause or "(vide)", []).append(ident)
            continue
        lieu = (r.get("lieu") or "").strip() or None if "lieu" not in manque else None
        type_ = (r.get("type") or "").strip() or None if "type" not in manque else None
        reco = exemples is not None and cause == "environnement" and lieu == "cloud"
        if reco:
            type_ = None
        k = cle(cause, lieu, type_)
        depart = max(out["fenetre"], couvertes.get(k, ""), (ecartees.get(k) or "")[:10])
        if date <= depart or (reco and ident in exemples):
            continue
        g = groupes.setdefault(k, {"cause": cause, "lieu": lieu, "type": type_, "ids": [], "soucis": [],
                                   "depuis": date, "reco": reco})
        g["ids"].append(ident)
        souci = (r.get("souci") or "").strip()
        if souci:
            g["soucis"].append("#%s : %s" % (ident, souci))

    tableau = sorted(groupes.items(), key=lambda kv: (-len(kv[1]["ids"]), kv[0]))
    out["tableau"] = [{"cle": k, "cause": g["cause"], "lieu": g["lieu"], "type": g["type"], "n": len(g["ids"]),
                       "ids": g["ids"]} for k, g in tableau]
    out["hors_liste"] = [{"cause": c, "ids": ids} for c, ids in hors.items()]
    dues = [(k, g) for k, g in tableau if len(g["ids"]) >= seuil]
    out["propositions"] = [_proposition(g, jour, lignes, g["reco"]) for _k, g in dues[:maxi]]
    out["a_suivre"] = [k for k, _g in dues[maxi:]]
    return out


def hebdo(dossier, jour=None, etat=None, **kw):
    """La lecture de la semaine (Maestro) : une fois tous les 7 jours, la date retenue ; sinon `due` faux."""
    jour = jour or datetime.date.today().isoformat()
    vrai = audit.situer(dossier)[0]
    etat = etat or etat_par_defaut(vrai)
    data = _lire_etat(etat)
    derniere = (_du_dossier(data, vrai).get("hebdo") or "")[:10]
    if derniere and _moins(jour, SEMAINE) < derniere:
        prochaine = (datetime.date.fromisoformat(derniere) + datetime.timedelta(days=SEMAINE)).isoformat()
        return {"due": False, "derniere": derniere, "prochaine": prochaine}
    out = dict(lire(vrai, jour=jour, etat=etat, **kw), due=True, derniere=derniere or None)
    data = _lire_etat(etat)
    _du_dossier(data, vrai)["hebdo"] = jour
    _ecrire_etat(etat, data)
    return out


def ecarter(dossier, cles, jour=None, etat=None):
    """« Pas maintenant » : chaque clé attend trois nouvelles occurrences, comptées après ce jour."""
    jour = jour or datetime.date.today().isoformat()
    vrai = audit.situer(dossier)[0]
    etat = etat or etat_par_defaut(vrai)
    data = _lire_etat(etat)
    ecartees = _du_dossier(data, vrai).setdefault("ecartees", {})
    for k in cles:
        if not re.match(r"friction-\S+$", k):
            raise Erreur("clé « %s » : une clé de friction commence par « friction- »" % k)
        ecartees[k] = jour
    _ecrire_etat(etat, data)
    return ecartees


# ---------------------------------------------------------------- le compte rendu


def _croisement(l):
    return "%s · %s · %s" % (l["cause"], l["lieu"] or TOUS, l["type"] or TOUS)


def rendre(r):
    out = []
    if r.get("due") is False:
        return "Lecture des frictions déjà faite le %s : la prochaine le %s." % (r["derniere"], r["prochaine"])
    out.append("Frictions des bilans depuis le %s (seuil : %d fois)." % (_jj_mm(r["fenetre"]), r["seuil"]))
    if r["message"]:
        out.append("Attention : %s." % r["message"])
    if not r["tableau"]:
        out.append("Aucune friction dans la fenêtre.")
    for l in r["tableau"]:
        out.append("- %s : %d (%s)" % (_croisement(l), l["n"], ", ".join("#" + i for i in l["ids"])))
    for h in r["hors_liste"]:
        cause = h["cause"] if len(h["cause"]) <= 60 else h["cause"][:59] + "…"
        out.append("- hors de la liste des causes, « %s » : %s" % (cause, ", ".join("#" + i for i in h["ids"])))
    for q in r["propositions"]:
        out.append("Proposée : %s (%s)" % (q["about"], q["key"]))
    if r["a_suivre"]:
        out.append("À la prochaine lecture : %s." % ", ".join(r["a_suivre"]))
    return "\n".join(out)


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("dossier")
    p.add_argument("action", nargs="?", default="lire", choices=("lire", "hebdo", "ecarter"))
    p.add_argument("cles", nargs="*")
    p.add_argument("--jour")
    p.add_argument("--jours", type=int, default=JOURS)
    p.add_argument("--seuil", type=int, default=SEUIL)
    p.add_argument("--max", dest="maxi", type=int, default=MAXI)
    p.add_argument("--etat")
    p.add_argument("--json", action="store_true")
    a = p.parse_args(argv)
    try:
        if a.action == "ecarter":
            if not a.cles:
                raise Erreur("ecarter : au moins une clé de friction")
            r = {"ecartees": ecarter(a.dossier, a.cles, jour=a.jour, etat=a.etat)}
            print(json.dumps(r, ensure_ascii=False, indent=1) if a.json else
                  "Écartée%s jusqu'à trois nouvelles occurrences : %s." % ("s" if len(a.cles) > 1 else "",
                                                                          ", ".join(a.cles)))
            return 0
        kw = dict(jour=a.jour, etat=a.etat, jours=a.jours, seuil=a.seuil, maxi=a.maxi)
        r = hebdo(a.dossier, **kw) if a.action == "hebdo" else lire(a.dossier, **kw)
    except Erreur as e:
        print("Refusé : %s" % e, file=sys.stderr)
        return 1
    print(json.dumps(r, ensure_ascii=False, indent=1) if a.json else rendre(r))
    return 0


if __name__ == "__main__":
    sys.exit(main())
