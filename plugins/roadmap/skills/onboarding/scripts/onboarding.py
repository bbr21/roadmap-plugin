#!/usr/bin/env python3
"""Onboarding d'un projet de code : pose la structure commune (modèle : Splitmybill) et sa roadmap,
reconstitue au besoin la roadmap depuis l'historique du dépôt, et vérifie le format.

  python3 onboarding.py exemple                            réponses d'exemple, en JSON
  python3 onboarding.py init DOSSIER --reponses R.json     écrit la structure dans DOSSIER
          [--manquants]                                    n'écrit que les fichiers absents (projet existant)
  python3 onboarding.py verifier DOSSIER                   dit ce qui manque ou s'écarte du format
  python3 onboarding.py historique DOSSIER [--mois 6]      relève l'historique (PR, sinon fusions, sinon
          [--sans-gh] [--par auto|commit|jour]             commits), en JSON, à compléter
  python3 onboarding.py historique-ecrire DOSSIER --lignes H.json
                                                           écrit dans la roadmap l'historique complété
  python3 onboarding.py analyser FICHIER [--fait F]        analyse une roadmap existante (checklist, CSV,
          [--dossier D] [--qui NOM] [--requis a,b]         Notion, tableau Markdown) : correspondance en JSON
  python3 onboarding.py importer DOSSIER --analyse A.json  l'importe : sauvegarde, numéros, bilan avant/après

La roadmap d'un nouveau projet vit dans `roadmap/` (ROADMAP.md, ROADMAP-fait.md, ROADMAP-bilans.csv),
que `.claude/roadmap.json` désigne au panneau. Un projet qui la tient déjà à sa racine la garde là.

`init` refuse d'écraser un fichier : sans --manquants, il refuse tout dossier qui contient déjà un
des fichiers de la structure. Il crée le dépôt git (branche main) s'il n'existe pas, ne committe rien.

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import csv
import datetime
import io
import json
import os
import re
import stat
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importer  # noqa: E402
from importer import Erreur  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
MODELES = os.path.join(os.path.dirname(HERE), "references", "modeles")
# Le mode Projet (#76) : un dossier simple, sans code, git en option.
MODELES_PROJET = os.path.join(os.path.dirname(HERE), "references", "modeles-projet")
REQUIS_PROJET = ["id", "ouvert", "due", "resp", "parent", "après"]
# Le mode Code (#80) : une tâche lancée (`qui:` ou `branche:`) porte sa date, son échéance, qui la tient, ses dépendances.
REQUIS_CODE = ["ouvert", "due", "qui", "après"]
# Les clés de la grammaire : une clé déclarée (`cles`) ne peut en reprendre aucune.
CLES_GRAMMAIRE = {"id", "qui", "attend", "resp", "branche", "verrou", "ouvert", "due", "parent", "après", "prio",
                  "feedback", "fait", "spec", "fiche", "src"}
CLE_DECLAREE = re.compile(r"^[a-zà-ÿ][a-zà-ÿ0-9-]*$")
SECTIONS_CLAUDE_PROJET = ["Démarrer une session", "Une tâche complète", "Finir une tâche", "Règles", "Carte"]

AXE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
VERROU = re.compile(r"^[a-z0-9-]+$")
SECRETS_DE_BASE = [".env", ".env.*", "*.pem", "*.key", "*.p8", "*.p12"]
DOSSIER_ROADMAP = "roadmap"
BILANS = "ROADMAP-bilans.csv"
ENTETE_BILANS = ["date", "id", "fait", "souci", "ressenti", "cause", "corrections", "note"]
CONCLUSION_MAX = 140
SOUCI_HISTORIQUE = "Reconstituée depuis l'historique du dépôt, sans bilan"
# Sans PR ni fusion, une tâche par commit jusqu'à ce nombre de commits sur la période, par jour au-delà.
PAR_COMMIT_MAX = 200
CHEMIN_REL = re.compile(r"^(?!/)(?!.*\.\.)[\w./-]+$")
LIGNE_GITIGNORE = re.compile(r"^(?!.*\.\.)[!\w.*?/\[\]-]+$")

# Sections que la vérification attend, dans l'ordre où le modèle les écrit.
SECTIONS_CLAUDE = ["Démarrer une session", "Finir un chantier", "Carte", "Commandes", "Travailler en parallèle",
                   "Règles", "Pièges", "Où écrire quoi", "Vocabulaire"]
SECTIONS_ROADMAP = ["Grammaire d'une ligne", "Cap", "En cours", "Prochain", "Plus tard"]
# Posés par init, mais leur absence n'est pas un écart : un dossier de docs se passe de son README, et
# le journal des bilans naît à la première clôture.
FACULTATIFS = {"docs/guides/README.md", "docs/plans/inbox/fiches/README.md"}

EXEMPLE = {
    "nom": "Clipping",
    "dossier": "~/Projects/Clipping",
    "resume": "Clipping découpe les vidéos longues en extraits prêts à publier.",
    "cap": "Une première version qui sort trois extraits d'une vidéo de moins d'une heure, sans retouche.",
    "qui": "BBR",
    "axes": ["produit", "app", "service", "dossier"],
    "langue_code": "anglais",
    "tests": [{"commande": "npm test", "quoi": "tests unitaires, sans réseau"}],
    "deploiement": {"mode": "push", "outil": "Coolify", "verifier": ""},
    "verrous": [
        {"nom": "deploiement", "couvre": "Réglages du déploiement : app, variables, domaine"},
        {"nom": "base", "couvre": "Une migration du schéma de la base"},
    ],
    "migrations": "",
    "env": True,
    "secrets": [],
    "fin_en_plus": [],
    "github": "bbr21/clipping",
}


EXEMPLE_PROJET = {
    "mode": "projet",
    "nom": "Roadmap de Caro",
    "dossier": "~/Documents/Roadmap de Caro",
    "resume": "Les tâches de Caro, tirées de ses emails et de ses réunions, menées depuis Claude Code.",
    "cap": "",
    "qui": "Caro",
    "axes": ["client", "interne", "dossier"],
    "requis": REQUIS_PROJET,
    "cles": {"type": ["Réunion", "Email", "Livrable"]},
    "git": False,
}


# ---------------------------------------------------------------- où vit la roadmap


def principal(dossier):
    """Le dossier principal d'un dépôt (premier worktree listé), sinon le dossier lui-même."""
    res = git(dossier, "worktree", "list", "--porcelain")
    if res.returncode == 0:
        for ligne in res.stdout.splitlines():
            if ligne.startswith("worktree "):
                return ligne[len("worktree "):].strip()
    return dossier


def trouver_roadmap(dossier):
    """Le dossier qui porte ROADMAP.md, dans l'ordre du panneau : `.claude/roadmap.json` (son `dir`),
    puis la racine. None : pas de roadmap."""
    dossier = os.path.abspath(os.path.expanduser(dossier))
    cfg = os.path.join(dossier, ".claude", "roadmap.json")
    if os.path.isfile(cfg):
        try:
            with open(cfg, encoding="utf-8") as f:
                rel = (json.load(f) or {}).get("dir") or ""
        except (OSError, ValueError):
            rel = ""
        if isinstance(rel, str) and rel:
            cible = rel if rel.startswith("/") else os.path.join(dossier, rel)
            return os.path.normpath(os.path.expanduser(cible))
        if os.path.isfile(os.path.join(dossier, "ROADMAP.md")):
            return dossier
    if os.path.isfile(os.path.join(dossier, "ROADMAP.md")):
        return dossier
    return None


def emplacement(dossier):
    """« . » si le projet tient déjà sa roadmap à sa racine, sinon le dossier `roadmap`."""
    dossier = os.path.abspath(os.path.expanduser(dossier))
    if os.path.isfile(os.path.join(dossier, "ROADMAP.md")) and not os.path.isfile(
            os.path.join(dossier, DOSSIER_ROADMAP, "ROADMAP.md")):
        return "."
    return DOSSIER_ROADMAP


# ---------------------------------------------------------------- réponses


def charger_reponses(chemin):
    try:
        with open(chemin, encoding="utf-8") as f:
            r = json.load(f)
    except (OSError, ValueError) as e:
        raise Erreur("réponses illisibles (%s) : %s" % (chemin, e))
    return valider(r)


def valider_projet(r):
    """Les réponses du mode Projet : pas de tests, de déploiement ni de verrou ; un dossier peut
    contenir des espaces (ses règles ne citent aucune commande git)."""
    for cle in ("nom", "dossier", "resume", "qui"):
        if not str(r.get(cle, "")).strip():
            raise Erreur("réponse manquante : %s" % cle)
    axes = [a.strip() for a in r.get("axes") or []]
    for a in axes:
        if not AXE.match(a):
            raise Erreur("axe « %s » : minuscules, chiffres et tirets" % a)
    if "dossier" not in axes:
        axes.append("dossier")
    r["axes"] = axes
    requis = r.get("requis", REQUIS_PROJET)
    if not isinstance(requis, list) or not all(isinstance(x, str) and x.strip() for x in requis):
        raise Erreur("requis : une liste de clés de la grammaire ou déclarées")
    cles = r.get("cles") or {}
    if not isinstance(cles, dict):
        raise Erreur("cles : un objet, clé → liste des valeurs admises (vide : libre)")
    for k, v in cles.items():
        if not CLE_DECLAREE.match(k) or k in CLES_GRAMMAIRE:
            raise Erreur("clé déclarée « %s » : minuscules, et pas une clé de la grammaire" % k)
        if not isinstance(v, list) or not all(isinstance(x, str) and x.strip() for x in v):
            raise Erreur("cles.%s : une liste de valeurs" % k)
    inconnues = [k for k in requis if k not in CLES_GRAMMAIRE and k not in cles]
    if inconnues:
        raise Erreur("requis : clé inconnue %s" % ", ".join(inconnues))
    r["requis"] = [x.strip() for x in requis]
    r["cles"] = cles
    r["git"] = bool(r.get("git"))
    github = r.get("github") or ""
    if github and not (r["git"] and re.match(r"^[\w.-]+/[\w.-]+$", github)):
        raise Erreur("github : propriétaire/dépôt, et seulement avec git")
    roadmap = r.get("roadmap") or DOSSIER_ROADMAP
    if roadmap not in (DOSSIER_ROADMAP, "."):
        raise Erreur("roadmap : « roadmap » (dossier roadmap/) ou « . » (racine)")
    r["roadmap"] = roadmap
    r["gitignore"] = [x.strip() for x in r.get("gitignore") or [] if isinstance(x, str) and x.strip()]
    return r


def valider(r):
    if not isinstance(r, dict):
        raise Erreur("les réponses sont un objet JSON")
    if r.get("mode", "code") not in ("code", "projet"):
        raise Erreur("mode : code ou projet")
    if r.get("mode") == "projet":
        return valider_projet(r)
    for cle in ("nom", "dossier", "resume", "qui"):
        if not str(r.get(cle, "")).strip():
            raise Erreur("réponse manquante : %s" % cle)
    if re.search(r"\s", r["dossier"]):
        raise Erreur("le dossier principal ne doit pas contenir d'espace (les commandes git -C le citent sans guillemets)")
    axes = [a.strip() for a in r.get("axes") or []]
    for a in axes:
        if not AXE.match(a):
            raise Erreur("axe « %s » : minuscules, chiffres et tirets" % a)
    if "dossier" not in axes:
        axes.append("dossier")
    r["axes"] = axes
    deploiement = r.get("deploiement") or {}
    if deploiement.get("mode", "aucun") not in ("push", "commande", "aucun"):
        raise Erreur("deploiement.mode : push, commande ou aucun")
    r["deploiement"] = deploiement
    for v in r.get("verrous") or []:
        if not VERROU.match(v.get("nom", "")) or not v.get("couvre", "").strip():
            raise Erreur("verrou %r : un nom en minuscules et ce qu'il couvre" % v)
    if r.get("langue_code", "anglais") not in ("anglais", "français"):
        raise Erreur("langue_code : anglais ou français")
    github = r.get("github") or ""
    if github and not re.match(r"^[\w.-]+/[\w.-]+$", github):
        raise Erreur("github : propriétaire/dépôt, par exemple bbr21/clipping")
    for cle, forme in (("ignorer", CHEMIN_REL), ("gitignore", LIGNE_GITIGNORE)):
        valeurs = r.get(cle) or []
        if not isinstance(valeurs, list) or not all(isinstance(x, str) and forme.match(x.strip()) for x in valeurs):
            raise Erreur("%s : une liste de %s" % (cle, "chemins relatifs au dépôt" if cle == "ignorer" else "motifs .gitignore, un par ligne"))
        r[cle] = [x.strip() for x in valeurs if x.strip()]
    roadmap = r.get("roadmap") or DOSSIER_ROADMAP
    if roadmap not in (DOSSIER_ROADMAP, "."):
        raise Erreur("roadmap : « roadmap » (dossier roadmap/) ou « . » (racine)")
    r["roadmap"] = roadmap
    return r


def liste_numerotee(items):
    return "\n".join("%d. %s" % (i + 1, t) for i, t in enumerate(items))


def variables(r, aujourdhui=None):
    """Les valeurs des {{CLÉS}} des modèles, calculées depuis les réponses."""
    aujourdhui = aujourdhui or datetime.date.today().isoformat()
    dossier = r["dossier"].rstrip("/")
    qui = r["qui"].strip()
    github = r.get("github") or ""
    dep = r["deploiement"]
    mode = dep.get("mode", "aucun")
    outil = dep.get("outil", "").strip()
    verif = dep.get("verifier", "").strip()
    commande_dep = dep.get("commande", "").strip()
    tests = r.get("tests") or []
    verrous = r.get("verrous") or []
    rm = "" if r.get("roadmap") == "." else DOSSIER_ROADMAP + "/"

    pousse = bool(github)
    v = {
        "NOM": r["nom"].strip(),
        "DOSSIER": dossier,
        "RESUME": r["resume"].strip(),
        "CAP": (r.get("cap") or "").strip() or "_À écrire avec %s : ce que la première version doit faire, et le critère qui dira qu'elle est réussie._" % qui,
        "QUI": qui,
        "AUJOURDHUI": aujourdhui,
        "AXES": ", ".join("`%s`" % a for a in r["axes"]),
        "PULL": ("`git -C %s pull --ff-only`, puis " % dossier) if pousse else "",
        "PUSH_PRISE": (", puis `git -C %s push`" % dossier) if pousse else "",
        "PUSH_REFUS": (" Un push refusé veut dire qu'un autre clone a avancé : `pull --rebase`, vérifier que la ligne est toujours libre, repousser." if pousse else ""),
        "ENV_LIEN": " et y relie `.env`" if r.get("env") else "",
        "VERROU_EXEMPLE": verrous[0]["nom"] if verrous else "deploiement",
        "RM": rm,
        "RM_UP": "../" if rm else "",
    }
    if rm:
        v["CARTE_ROADMAP"] = (
            "roadmap/           ROADMAP.md : tâches ouvertes (cap, en cours, prochain, plus tard, attend %s)\n"
            "                   ROADMAP-fait.md : tâches closes, récentes en tête (grep, ne pas lire en entier)\n"
            "                   ROADMAP-bilans.csv : le bilan de chaque tâche close\n" % qui)
    else:
        v["CARTE_ROADMAP"] = (
            "ROADMAP.md         tâches ouvertes : cap, en cours (qui, branche, verrous), prochain, plus tard, attend %s\n"
            "ROADMAP-fait.md    tâches closes, récentes en tête (chercher avec grep, ne pas lire en entier)\n"
            "ROADMAP-bilans.csv le bilan de chaque tâche close\n" % qui)

    # Finir un chantier
    etapes = []
    cmds_tests = ["`node scripts/check.mjs`"] + ["`%s`" % t["commande"] for t in tests if t.get("commande")]
    etapes.append("Tests : %s." % ", ".join(cmds_tests))
    fusion = ("Fusion sur `main`, en le disant%s : `git -C %s pull --ff-only`, dans le worktree `git rebase main`, "
              "puis `git -C %s merge --ff-only <branche>`%s." % (
                  " (chaque push déploie)" if mode == "push" else "", dossier, dossier,
                  " et `git -C %s push`" % dossier if pousse else ""))
    fusion += (" Un conflit avec une session parallèle se résout en gardant les deux travaux, et les tests se relancent "
               "avant la fusion. Un refus du `merge --ff-only` veut dire que `main` a bougé : refaire le rebase.")
    etapes.append(fusion)
    if mode == "push":
        etapes.append("Déploiement vérifié%s : %s." % (" (%s)" % outil if outil else "",
                                                      "`%s`" % verif if verif else "la commande de vérification s'écrit ici dès qu'elle existe"))
    elif mode == "commande":
        etapes.append("Déploiement : `%s`, puis vérifié : %s." % (commande_dep or "<commande>",
                                                                  "`%s`" % verif if verif else "la vérification s'écrit ici dès qu'elle existe"))
    etapes.append("Ménage : dans le dossier principal, la ligne de ROADMAP part en tête de ROADMAP-fait avec "
                  "`fait:AAAA-MM-JJ` et ce qui a été livré, son bilan s'ajoute à `%sROADMAP-bilans.csv`, le tout committé%s ; "
                  "puis `git -C %s worktree remove <dossier>` et `branch -d <branche>`%s. Un worktree créé par l'app se laisse à l'app." % (
                      rm, " et poussé" if pousse else "", dossier,
                      " (et la branche distante si elle a été poussée)" if pousse else ""))
    etapes += [e.strip() for e in r.get("fin_en_plus") or [] if e.strip()]
    etapes.append("Dire à %s ce qui a été livré et ce qu'il lui reste à essayer." % qui)
    v["ETAPES_FIN"] = liste_numerotee(etapes)
    v["RAPPEL_FIN"] = "tests, fusion sur main (conflits réglés)%s, ménage de la branche, ligne close dans ROADMAP-fait avec son bilan." % (
        ", déploiement vérifié" if mode != "aucun" else "")

    # Commandes
    largeur = 41

    def col(cmd):
        return cmd.ljust(largeur) if len(cmd) < largeur else cmd + "  "

    lignes = []
    for t in tests:
        if t.get("commande"):
            lignes.append("%s# %s" % (col(t["commande"]), t.get("quoi", "")))
    if mode == "commande" and commande_dep:
        lignes.append("%s# déploiement" % col(commande_dep))
    if verif:
        lignes.append("%s# vérifie le déploiement" % col(verif))
    v["COMMANDES"] = "".join(l.rstrip() + "\n" for l in lignes)

    # GitHub et déploiement
    puce = ""
    if github:
        puce = ("- **GitHub** : dépôt privé `%s`. Tout commit sur `main` se pousse aussitôt, roadmap comprise : "
                "c'est ainsi que les autres sessions la voient." % github)
        if mode == "push":
            puce += (" **Chaque push sur `main` redéploie**%s : une fusion vaut une mise en production, "
                     "à vérifier par l'étape de « Finir un chantier »." % (" par %s" % outil if outil else ""))
        puce += (" Une branche de travail peut être poussée pour la reprendre ailleurs. Jamais `push --force` "
                 "sur `main` ; `--force-with-lease` seulement sur sa propre branche.\n")
    v["GITHUB_PUCE"] = puce
    if mode == "push":
        v["DEPLOIEMENT_DOC"] = "Chaque push sur `main` déploie%s. Vérification : %s." % (
            " par %s" % outil if outil else "", "`%s`" % verif if verif else "_à écrire_")
    elif mode == "commande":
        v["DEPLOIEMENT_DOC"] = "Déploiement par `%s`." % (commande_dep or "<commande>")
    else:
        v["DEPLOIEMENT_DOC"] = "Aucun déploiement pour l'instant."

    # Verrous
    if verrous:
        rows = ["| Verrou | Couvre |", "|---|---|"] + ["| `%s` | %s |" % (x["nom"], x["couvre"].strip()) for x in verrous]
        v["VERROUS_TABLE"] = "\n".join(rows)
    else:
        v["VERROUS_TABLE"] = "Aucune ressource unique pour l'instant : la première ajoute ici un tableau « | Verrou | Couvre | », une ligne par verrou."

    # Secrets et langue
    secrets = list(SECRETS_DE_BASE) + [s for s in r.get("secrets") or [] if s not in SECRETS_DE_BASE]
    v["SECRETS_JSON"] = json.dumps(secrets, ensure_ascii=False)
    regle = "Un secret vit hors de git : "
    regle += "dans `.env`, non versionné (`.env.example` n'en porte que les noms), relié dans chaque worktree par `scripts/new-session.sh`" if r.get("env") else "dans le service qui l'utilise, jamais dans un fichier du dépôt"
    regle += ". `node scripts/check.mjs` refuse un fichier secret suivi (%s)." % ", ".join("`%s`" % s for s in secrets)
    v["REGLE_SECRETS"] = regle
    en_plus = [s for s in r.get("secrets") or [] if s not in (".env", ".env.*")]
    en_plus += [g for g in r.get("gitignore") or [] if g not in en_plus]
    v["GITIGNORE_EN_PLUS"] = "".join(s + "\n" for s in en_plus)
    v["IGNORE_JSON"] = json.dumps(r.get("ignorer") or [], ensure_ascii=False)
    if r.get("langue_code", "anglais") == "anglais":
        v["REGLE_LANGUE"] = "**Langue** : docs et échanges en français ; code, identifiants et messages de commit en anglais."
    else:
        v["REGLE_LANGUE"] = "**Langue** : docs, échanges et messages de commit en français ; identifiants du code en anglais."

    migrations = (r.get("migrations") or "").strip().strip("/")
    if migrations:
        v["MIGRATIONS_SH"] = (
            'last=$(ls "$root/%s" 2>/dev/null | grep -E \'^[0-9]+-\' | sort | tail -1)\n'
            '[ -n "$last" ] && echo "Dernière migration sur cette branche : $last (une nouvelle prend le numéro suivant ; à revérifier contre main avant de fusionner)"\n'
            % migrations)
    else:
        v["MIGRATIONS_SH"] = ""
    return v


# ---------------------------------------------------------------- modèles


def destination(rel, roadmap=DOSSIER_ROADMAP):
    """Chemin dans le projet d'un fichier de modèle : `dot-x` devient `.x`, et les fichiers de
    `roadmap/` vont à la racine quand le projet y tient sa roadmap."""
    rel = "/".join(("." + p[4:]) if p.startswith("dot-") else p for p in rel.split("/"))
    if roadmap == "." and rel.startswith(DOSSIER_ROADMAP + "/"):
        rel = rel[len(DOSSIER_ROADMAP) + 1:]
    return rel


def modeles(roadmap=DOSSIER_ROADMAP, racine_modeles=MODELES):
    """(chemin du modèle, chemin dans le projet), triés."""
    out = []
    for base, dirs, files in os.walk(racine_modeles):
        dirs.sort()
        for f in sorted(files):
            if f == ".DS_Store":
                continue
            rel = os.path.relpath(os.path.join(base, f), racine_modeles).replace(os.sep, "/")
            out.append((os.path.join(base, f), destination(rel, roadmap)))
    return out


def rendre(texte, v):
    def remplace(m):
        cle = m.group(1)
        if cle not in v:
            raise Erreur("clé de modèle inconnue : {{%s}}" % cle)
        return v[cle]
    return re.sub(r"\{\{([A-Z_]+)\}\}", remplace, texte)


def variables_projet(r, aujourdhui=None):
    """Les valeurs des {{CLÉS}} des modèles du mode Projet."""
    aujourdhui = aujourdhui or datetime.date.today().isoformat()
    semaine = (datetime.date.fromisoformat(aujourdhui) + datetime.timedelta(days=7)).isoformat()
    qui = r["qui"].strip()
    rm = "" if r.get("roadmap") == "." else DOSSIER_ROADMAP + "/"
    cles = r.get("cles") or {}
    return {
        "NOM": r["nom"].strip(),
        "RESUME": r["resume"].strip(),
        "CAP": (r.get("cap") or "").strip() or "_À écrire avec %s : ce que le projet doit avoir livré, et quand._" % qui,
        "QUI": qui,
        "AUJOURDHUI": aujourdhui,
        "DANS_UNE_SEMAINE": semaine,
        "AXES": ", ".join("`%s`" % a for a in r["axes"]),
        "RM": rm,
        "REQUIS": ", ".join("`%s`" % k for k in r["requis"]) or "aucun champ en plus de l'axe et du libellé",
        "CLES_GRAMMAIRE": "".join(" | %s:…" % k for k in cles),
        "CLES_PUCES": "".join(
            "\n- **%s** : %s ; plusieurs valeurs séparées par des virgules." % (
                k, ("valeurs admises : " + ", ".join("`%s`" % x for x in v)) if v else "valeur libre")
            for k, v in cles.items()),
        "CARTE_ROADMAP": ("roadmap/           ROADMAP.md (tâches ouvertes), ROADMAP-fait.md (closes), ROADMAP-bilans.csv (bilans)"
                          if rm else "ROADMAP.md         tâches ouvertes ; ROADMAP-fait.md : closes ; ROADMAP-bilans.csv : bilans"),
        "GITIGNORE_EN_PLUS": "\n".join(r.get("gitignore") or []),
    }


def fichiers_projet(r, aujourdhui=None):
    """{chemin dans le projet: contenu} pour un dossier du mode Projet."""
    v = variables_projet(r, aujourdhui)
    out = {}
    for src, dest in modeles(r.get("roadmap", DOSSIER_ROADMAP), MODELES_PROJET):
        if dest == ".gitignore" and not r.get("git"):
            continue
        with open(src, encoding="utf-8") as f:
            out[dest] = rendre(f.read(), v)
    cfg = {"name": v["NOM"], "me": [v["QUI"]]}
    if r.get("roadmap", DOSSIER_ROADMAP) != ".":
        cfg["dir"] = DOSSIER_ROADMAP
    cfg.update({"mode": "projet", "requis": r["requis"]})
    if r.get("cles"):
        cfg["cles"] = r["cles"]
    cfg["vue"] = "echeance"
    out[".claude/roadmap.json"] = json.dumps(cfg, ensure_ascii=False, indent=2) + "\n"
    return out


def fichiers(r, aujourdhui=None):
    """{chemin dans le projet: contenu} pour toute la structure."""
    if r.get("mode") == "projet":
        return fichiers_projet(r, aujourdhui)
    v = variables(r, aujourdhui)
    out = {}
    for src, dest in modeles(r.get("roadmap", DOSSIER_ROADMAP)):
        if dest == ".env.example" and not r.get("env"):
            continue
        with open(src, encoding="utf-8") as f:
            out[dest] = rendre(f.read(), v)
    if r.get("env"):
        out.setdefault(".env.example", "# Les noms des variables du .env (jamais leurs valeurs). Le .env n'est pas versionné.\n")
    cfg = {"name": v["NOM"], "me": [v["QUI"]]}
    if r.get("roadmap", DOSSIER_ROADMAP) != ".":
        cfg["dir"] = DOSSIER_ROADMAP
    out[".claude/roadmap.json"] = json.dumps(cfg, ensure_ascii=False, indent=2) + "\n"
    return out


# ---------------------------------------------------------------- init et vérification


def git(dossier, *args):
    return subprocess.run(["git", "-C", dossier] + list(args), capture_output=True, text=True)


def init(dossier, r, manquants=False, aujourdhui=None):
    dossier = os.path.abspath(os.path.expanduser(dossier))
    if manquants:
        r = dict(r, roadmap=emplacement(dossier))
    contenu = fichiers(r, aujourdhui)
    deja = [p for p in contenu if os.path.exists(os.path.join(dossier, p))]
    if deja and not manquants:
        raise Erreur("déjà présents, rien n'a été écrit : %s. Pour un projet existant : --manquants, après verifier." % ", ".join(sorted(deja)))
    os.makedirs(dossier, exist_ok=True)
    # En mode Projet, git seulement si on l'a voulu.
    veut_git = r.get("mode") != "projet" or r.get("git")
    if veut_git and not os.path.isdir(os.path.join(dossier, ".git")) and git(dossier, "rev-parse", "--git-dir").returncode != 0:
        res = git(dossier, "init", "-q", "-b", "main")
        if res.returncode != 0:
            raise Erreur("git init a échoué : %s" % res.stderr.strip())
        print("Dépôt git créé, branche main.")
    ecrits = []
    for rel, texte in sorted(contenu.items()):
        chemin = os.path.join(dossier, rel)
        if os.path.exists(chemin):
            continue
        os.makedirs(os.path.dirname(chemin), exist_ok=True)
        with open(chemin, "w", encoding="utf-8") as f:
            f.write(texte)
        if rel.endswith(".sh"):
            os.chmod(chemin, os.stat(chemin).st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
        ecrits.append(rel)
    print("Écrits (%d) :" % len(ecrits))
    for rel in ecrits:
        print("  " + rel)
    if deja:
        print("Gardés tels quels (%d) : %s" % (len(deja), ", ".join(sorted(deja))))
    return ecrits


def titres(texte, niveau):
    return [m.group(1).strip() for m in re.finditer(r"^%s (.+)$" % ("#" * niveau), texte, re.M)]


def lignes_de_taches(texte):
    """Les lignes de tâche hors blocs de code (la grammaire en montre une en exemple)."""
    out, bloc = [], False
    for l in texte.split("\n"):
        if l.lstrip().startswith("```"):
            bloc = not bloc
        elif not bloc and l.startswith("- ["):
            out.append(l)
    return out


def mode_du_dossier(dossier):
    """Le mode que dit `.claude/roadmap.json` : « projet », sinon « code »."""
    try:
        with open(os.path.join(dossier, ".claude", "roadmap.json"), encoding="utf-8") as f:
            return "projet" if (json.load(f) or {}).get("mode") == "projet" else "code"
    except (OSError, ValueError, AttributeError):
        return "code"


def verifier_projet(dossier):
    """Les écarts d'un dossier du mode Projet : ses règles, sa roadmap et ses numéros, sans git."""
    ecarts = []
    rdir = trouver_roadmap(dossier)
    if rdir is None or not os.path.isfile(os.path.join(rdir, "ROADMAP.md")):
        return ["absent : ROADMAP.md (dans roadmap/ ou à la racine) : pas de roadmap"]

    def lire(chemin):
        try:
            with open(chemin, encoding="utf-8") as f:
                return f.read()
        except OSError:
            return None

    if not os.path.isfile(os.path.join(rdir, "ROADMAP-fait.md")):
        ecarts.append("absent : ROADMAP-fait.md, à côté de ROADMAP.md")
    claude = lire(os.path.join(dossier, "CLAUDE.md"))
    if claude is None:
        ecarts.append("absent : CLAUDE.md")
    else:
        presentes = titres(claude, 2)
        for sec in SECTIONS_CLAUDE_PROJET:
            if not any(t.startswith(sec) for t in presentes):
                ecarts.append("CLAUDE.md : section « ## %s » absente" % sec)
    roadmap = lire(os.path.join(rdir, "ROADMAP.md")) or ""
    presentes = titres(roadmap, 2)
    for sec in SECTIONS_ROADMAP:
        if not any(t.startswith(sec) for t in presentes):
            ecarts.append("ROADMAP.md : section « ## %s » absente" % sec)
    if not re.search(r"^(- \*\*axe\*\*|Axes en usage)", roadmap, re.M):
        ecarts.append("ROADMAP.md : puce « - **axe** » qui déclare les axes absente de la grammaire")
    ecarts += importer.ecarts_ids(roadmap, lire(os.path.join(rdir, "ROADMAP-fait.md")), exiger=True)
    return ecarts


def verifier(dossier):
    """Les écarts au format, une ligne chacun ; une liste vide veut dire conforme."""
    dossier = os.path.abspath(os.path.expanduser(dossier))
    if mode_du_dossier(dossier) == "projet":
        return verifier_projet(dossier)
    ecarts = []
    rdir = trouver_roadmap(dossier)
    rangee = os.path.join(dossier, DOSSIER_ROADMAP)
    if rdir is None and os.path.isfile(os.path.join(rangee, "ROADMAP.md")):
        rdir = rangee
    racine = rdir is not None and os.path.normpath(rdir) == os.path.normpath(dossier)
    rel_rm = "" if (rdir is None or racine) else os.path.relpath(rdir, dossier).replace(os.sep, "/") + "/"
    for _, rel in modeles("." if racine else DOSSIER_ROADMAP):
        if rel in FACULTATIFS or rel.endswith(BILANS) or rel == ".env.example":
            continue
        if rel.startswith(DOSSIER_ROADMAP + "/") and rdir is not None and not racine:
            rel = rel_rm + rel[len(DOSSIER_ROADMAP) + 1:]
        if not os.path.exists(os.path.join(dossier, rel)):
            if rel.endswith("ROADMAP.md") and rdir is None:
                ecarts.append("absent : roadmap/ROADMAP.md (ou ROADMAP.md à la racine) : pas de roadmap")
            else:
                ecarts.append("absent : %s" % rel)
    if rdir is not None and not racine and not os.path.isfile(os.path.join(dossier, ".claude", "roadmap.json")):
        ecarts.append("absent : .claude/roadmap.json (le panneau ne trouve pas une roadmap rangée hors de la racine)")

    def lire(chemin):
        try:
            with open(chemin, encoding="utf-8") as f:
                return f.read()
        except OSError:
            return None

    claude = lire(os.path.join(dossier, "CLAUDE.md"))
    if claude is not None:
        n = len(claude.rstrip("\n").split("\n"))
        if n > 150:
            ecarts.append("CLAUDE.md : %d lignes, plafond 150" % n)
        presentes = titres(claude, 2)
        for s in SECTIONS_CLAUDE:
            if not any(t.startswith(s) for t in presentes):
                ecarts.append("CLAUDE.md : section « ## %s » absente" % s)
        if "### Verrous" not in claude:
            ecarts.append("CLAUDE.md : sous-section « ### Verrous » absente")
    roadmap = lire(os.path.join(rdir, "ROADMAP.md")) if rdir else None
    if roadmap is not None:
        presentes = titres(roadmap, 2)
        for s in SECTIONS_ROADMAP:
            if not any(t.startswith(s) for t in presentes):
                ecarts.append("ROADMAP.md : section « ## %s » absente" % s)
        if not any(t.startswith("Attend") for t in presentes):
            ecarts.append("ROADMAP.md : section « ## Attend <qui> » absente")
        if not re.search(r"^- \*\*axe\*\*", roadmap, re.M):
            ecarts.append("ROADMAP.md : puce « - **axe** » qui déclare les axes absente de la grammaire")
        ecarts += importer.ecarts_ids(roadmap, lire(os.path.join(rdir, "ROADMAP-fait.md")), exiger=True)
    reglages = lire(os.path.join(dossier, ".claude", "settings.json"))
    if reglages is not None:
        try:
            hooks = json.loads(reglages).get("hooks", {}).get("SessionStart", [])
        except ValueError:
            hooks = None
            ecarts.append(".claude/settings.json : JSON invalide")
        if hooks is not None and "session-start.sh" not in json.dumps(hooks):
            ecarts.append(".claude/settings.json : hook SessionStart vers scripts/session-start.sh absent")
    for rel in ("scripts/session-start.sh", "scripts/new-session.sh"):
        p = os.path.join(dossier, rel)
        if os.path.exists(p) and not os.access(p, os.X_OK):
            ecarts.append("%s : pas exécutable (chmod +x)" % rel)
    if git(dossier, "rev-parse", "--git-dir").returncode != 0:
        ecarts.append("pas de dépôt git")
    else:
        branche = git(dossier, "branch", "--show-current").stdout.strip()
        if branche and branche != "main":
            ecarts.append("dossier principal sur la branche %s, pas sur main" % branche)
    return ecarts


# ---------------------------------------------------------------- historique


def _jour_heure(iso):
    """« 2026-10-12T14:05:00Z » → (« 2026-10-12 », « 2026-10-12 14:05 »), à l'heure locale."""
    if not iso:
        return "", ""
    try:
        d = datetime.datetime.fromisoformat(iso.replace("Z", "+00:00"))
    except ValueError:
        return iso[:10], iso[:10]
    if d.tzinfo is not None:
        d = d.astimezone()
    return d.strftime("%Y-%m-%d"), d.strftime("%Y-%m-%d %H:%M")


def _resume(texte, n=300):
    texte = re.sub(r"<!--.*?-->", " ", texte or "", flags=re.S)
    texte = re.sub(r"\s+", " ", texte).strip()
    return texte[:n]


def _gh(dossier, *args):
    try:
        res = subprocess.run(["gh"] + list(args), cwd=dossier, capture_output=True, text=True, timeout=120)
    except (OSError, subprocess.TimeoutExpired):
        return None
    if res.returncode != 0:
        return None
    try:
        return json.loads(res.stdout or "[]")
    except ValueError:
        return None


def _depuis(mois, aujourdhui=None):
    jour = aujourdhui or datetime.date.today()
    an, m = jour.year, jour.month - mois
    while m <= 0:
        an, m = an - 1, m + 12
    return datetime.date(an, m, min(jour.day, 28)).isoformat()


def _prs(dossier, depuis):
    champs = "number,title,url,createdAt,mergedAt,headRefName,body"
    faites = _gh(dossier, "pr", "list", "--state", "merged", "--search", "merged:>=%s" % depuis,
                 "--limit", "500", "--json", champs)
    if faites is None:
        return None
    ouvertes = _gh(dossier, "pr", "list", "--state", "open", "--limit", "100",
                   "--json", "number,title,url,createdAt,headRefName,body,isDraft") or []
    items = []
    for p in faites:
        ouvert, _ = _jour_heure(p.get("createdAt"))
        _, fait = _jour_heure(p.get("mergedAt"))
        items.append({"cle": "pr-%s" % p.get("number"), "etat": "fait", "titre": p.get("title", ""),
                      "resume": _resume(p.get("body")), "ouvert": ouvert, "fait": fait,
                      "src": p.get("url", ""), "branche": p.get("headRefName", "")})
    for p in ouvertes:
        ouvert, _ = _jour_heure(p.get("createdAt"))
        items.append({"cle": "pr-%s" % p.get("number"), "etat": "ouvert", "titre": p.get("title", ""),
                      "resume": _resume(p.get("body")), "ouvert": ouvert, "fait": "",
                      "src": p.get("url", ""), "branche": p.get("headRefName", "")})
    return items


def _fusions(dossier, depuis):
    res = git(dossier, "log", "--merges", "--first-parent", "--since=%s" % depuis,
              "--format=%H%x1f%cI%x1f%s%x1f%b%x1e", "HEAD")
    if res.returncode != 0:
        return []
    items = []
    for bloc in res.stdout.split("\x1e"):
        champs = bloc.strip("\n").split("\x1f")
        if len(champs) < 3 or not champs[0]:
            continue
        sha, quand, sujet = champs[0], champs[1], champs[2]
        corps = champs[3] if len(champs) > 3 else ""
        m = re.search(r"Merge (?:branch|pull request #\d+ from) '?([^'\s]+)'?", sujet)
        branche = m.group(1) if m else ""
        debut = git(dossier, "log", "--reverse", "--format=%cI", "%s^1..%s^2" % (sha, sha))
        premier = (debut.stdout.split("\n")[0] if debut.returncode == 0 else "") or quand
        sujets = git(dossier, "log", "--no-merges", "--format=%s", "%s^1..%s^2" % (sha, sha))
        detail = "; ".join(sujets.stdout.split("\n")[:5]) if sujets.returncode == 0 else ""
        ouvert, _ = _jour_heure(premier)
        _, fait = _jour_heure(quand)
        items.append({"cle": "fusion-%s" % sha[:7], "etat": "fait", "titre": sujet,
                      "resume": _resume(corps + " " + detail), "ouvert": ouvert, "fait": fait,
                      "src": "commit %s" % sha[:7], "branche": branche})
    return items


def _commits(dossier, depuis):
    """Une entrée par commit (hors fusions) : le dépôt qui publie un changement par commit."""
    res = git(dossier, "log", "--no-merges", "--since=%s" % depuis, "--format=%h%x1f%cI%x1f%s%x1f%b%x1e", "HEAD")
    if res.returncode != 0:
        return []
    items = []
    for bloc in res.stdout.split("\x1e"):
        champs = bloc.strip("\n").split("\x1f")
        if len(champs) < 3 or not champs[0]:
            continue
        jour, heure = _jour_heure(champs[1])
        corps = champs[3] if len(champs) > 3 else ""
        corps = "\n".join(l for l in corps.split("\n") if not re.match(r"^[A-Za-z-]+: ", l))
        items.append({"cle": "commit-%s" % champs[0], "etat": "fait", "titre": champs[2],
                      "resume": _resume(champs[2] + " " + corps), "ouvert": jour, "fait": heure,
                      "src": "commit %s" % champs[0], "branche": ""})
    return items


def _commits_par_jour(dossier, depuis):
    res = git(dossier, "log", "--no-merges", "--since=%s" % depuis, "--format=%h%x1f%cI%x1f%s", "HEAD")
    if res.returncode != 0:
        return []
    jours = {}
    for ligne in res.stdout.splitlines():
        champs = ligne.split("\x1f")
        if len(champs) < 3:
            continue
        jour, heure = _jour_heure(champs[1])
        j = jours.setdefault(jour, {"shas": [], "sujets": [], "heure": heure})
        j["shas"].append(champs[0])
        j["sujets"].append(champs[2])
        j["heure"] = max(j["heure"], heure)
    items = []
    for jour in sorted(jours):
        j = jours[jour]
        premier = j["shas"][-1]
        items.append({"cle": "jour-%s" % jour, "etat": "fait", "titre": j["sujets"][0],
                      "resume": _resume(" ; ".join(j["sujets"][:8])), "ouvert": jour, "fait": j["heure"],
                      "src": "commit %s" % premier, "branche": "", "commits": len(j["shas"])})
    return items


def relever(dossier, mois=6, avec_gh=True, aujourdhui=None, par="auto"):
    """L'historique des `mois` derniers mois : les PR (fusionnées et ouvertes) si GitHub en a,
    sinon les fusions de la branche courante, sinon les commits : un par tâche jusqu'à
    PAR_COMMIT_MAX commits (`par` = auto), ou toujours (`commit`), ou groupés par jour (`jour`)."""
    if par not in ("auto", "commit", "jour"):
        raise Erreur("par : auto, commit ou jour")
    dossier = os.path.abspath(os.path.expanduser(dossier))
    if mode_du_dossier(dossier) == "projet":
        raise Erreur("historique : un dossier en mode Projet n'a ni PR ni fusions ; ses tâches s'écrivent à la main")
    if git(dossier, "rev-parse", "--git-dir").returncode != 0:
        raise Erreur("pas de dépôt git dans %s" % dossier)
    depuis = _depuis(mois, aujourdhui)
    source, items = "aucun", []
    prs = _prs(dossier, depuis) if avec_gh else None
    if prs and any(i["etat"] == "fait" for i in prs):
        source, items = "pr", prs
    else:
        items = _fusions(dossier, depuis)
        if items:
            source = "fusions"
        else:
            items = _commits(dossier, depuis) if par != "jour" else []
            if par == "jour" or (par == "auto" and len(items) > PAR_COMMIT_MAX):
                items, source = _commits_par_jour(dossier, depuis), "jours"
            else:
                source = "commits"
            if not items:
                source = "aucun"
        items += [i for i in (prs or []) if i["etat"] == "ouvert"]
    items.sort(key=lambda i: (i["etat"] != "fait", i["fait"] or i["ouvert"], i["cle"]))
    return {
        "source": source,
        "depuis": depuis,
        "consigne": ("Pour chaque item, ajoute libelle (verbe à l'infinitif + objet, sans accent grave, "
                     "barre verticale ni crochet), axe (un axe déclaré dans ROADMAP.md) et conclusion "
                     "(une ligne de %d caractères au plus : ce qui a été livré). Retire un item qui ne "
                     "mérite pas sa ligne. Puis : historique-ecrire DOSSIER --lignes <ce fichier>." % CONCLUSION_MAX),
        "items": items,
    }


def _axes_declares(texte):
    for ligne in texte.split("\n"):
        if re.match(r"^(?:Axes en usage|- \*\*axe\*\*)", ligne.strip(), re.I):
            return re.findall(r"`([a-z0-9][a-z0-9-]*)`", ligne)
    return []


def _plus_grand_id(*textes):
    ids = [int(x) for t in textes for x in re.findall(r"[\[|]\s*id:(\d+)\s*[|\]]", t)]
    return max(ids) if ids else 0


def _propre(texte):
    return re.sub(r"\s+", " ", re.sub(r"[`|\[\]]", "", texte or "")).strip()


def _inserer(texte, titre_section, nouvelles):
    """Les lignes `nouvelles` en tête de la section `## titre_section` (créée en fin de fichier si absente)."""
    lignes = texte.rstrip("\n").split("\n")
    at = next((i for i, l in enumerate(lignes) if l.strip() == "## " + titre_section), None)
    if at is None:
        lignes += ["", "## " + titre_section, ""] + nouvelles
        return "\n".join(lignes) + "\n"
    fin = at + 1
    while fin < len(lignes) and lignes[fin].strip() == "":
        fin += 1
    bloc = [""] + nouvelles + ([""] if fin < len(lignes) else [])
    return "\n".join(lignes[:at + 1] + bloc + lignes[fin:]) + "\n"


def ecrire_historique(dossier, chemin_lignes):
    """Écrit l'historique complété : une ligne cochée par item fait dans ROADMAP-fait.md (les plus
    récentes en tête) avec son bilan, une ligne ouverte par PR ouverte dans « Prochain »."""
    dossier = os.path.abspath(os.path.expanduser(dossier))
    rdir = trouver_roadmap(dossier)
    if rdir is None:
        raise Erreur("pas de roadmap dans %s : poser la structure d'abord (init)" % dossier)
    p_open, p_done, p_bilans = (os.path.join(rdir, f) for f in ("ROADMAP.md", "ROADMAP-fait.md", BILANS))
    with open(p_open, encoding="utf-8") as f:
        ouvert = f.read()
    try:
        with open(p_done, encoding="utf-8") as f:
            fait = f.read()
    except OSError:
        fait = "# Roadmap : fait\n\n## Fait\n"
    if any(l.startswith("- [x]") or l.startswith("- [X]") for l in lignes_de_taches(fait)):
        raise Erreur("ROADMAP-fait.md porte déjà des tâches : la reconstitution ne sert qu'à une roadmap neuve")
    try:
        with open(chemin_lignes, encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, ValueError) as e:
        raise Erreur("historique illisible (%s) : %s" % (chemin_lignes, e))
    items = data.get("items") if isinstance(data, dict) else data
    if not isinstance(items, list) or not items:
        raise Erreur("aucun item à écrire")
    axes = _axes_declares(ouvert)
    for i in items:
        lib, axe = _propre(i.get("libelle")), (i.get("axe") or "").strip()
        if not lib:
            raise Erreur("item %s : libelle manquant" % i.get("cle"))
        if not AXE.match(axe) or (axes and axe not in axes):
            raise Erreur("item %s : axe « %s » absent des axes déclarés (%s)" % (i.get("cle"), axe, ", ".join(axes)))
        if i.get("etat") == "fait" and not re.match(r"^\d{4}-\d{2}-\d{2}( \d{2}:\d{2})?$", i.get("fait") or ""):
            raise Erreur("item %s : fait « %s » n'est pas une date" % (i.get("cle"), i.get("fait")))
    faits = sorted([i for i in items if i.get("etat") == "fait"], key=lambda i: i["fait"])
    ouverts = sorted([i for i in items if i.get("etat") == "ouvert"], key=lambda i: i.get("ouvert") or "")
    n = _plus_grand_id(ouvert, fait)
    lignes_faites, rangs, lignes_ouvertes = [], [], []
    for i in faits:
        n += 1
        champs = [i["axe"].strip(), "id:%d" % n]
        if i.get("ouvert"):
            champs.append("ouvert:%s" % i["ouvert"])
        champs.append("fait:%s" % i["fait"])
        if i.get("src"):
            champs.append("src:%s" % _propre(i["src"]))
        lignes_faites.append("- [x] %s `[%s]` ; reconstituée de l'historique" % (_propre(i["libelle"]), " | ".join(champs)))
        conclusion = _propre(i.get("conclusion") or i.get("libelle"))[:CONCLUSION_MAX]
        rangs.append([i["fait"][:10], str(n), conclusion, SOUCI_HISTORIQUE, "", "", "", _propre(i.get("src"))])
    for i in ouverts:
        n += 1
        champs = [i["axe"].strip(), "id:%d" % n]
        if i.get("ouvert"):
            champs.append("ouvert:%s" % i["ouvert"])
        if i.get("branche"):
            champs.append("branche:%s" % _propre(i["branche"]))
        if i.get("src"):
            champs.append("src:%s" % _propre(i["src"]))
        lignes_ouvertes.append("- [ ] %s `[%s]`" % (_propre(i["libelle"]), " | ".join(champs)))
    if lignes_faites:
        fait = _inserer(fait, "Fait", list(reversed(lignes_faites)))
        with open(p_done, "w", encoding="utf-8") as f:
            f.write(fait)
        neuf = not os.path.isfile(p_bilans) or os.path.getsize(p_bilans) == 0
        tampon = io.StringIO()
        w = csv.writer(tampon, lineterminator="\n")
        if neuf:
            w.writerow(ENTETE_BILANS)
        w.writerows(rangs)
        with open(p_bilans, "a", encoding="utf-8") as f:
            f.write(tampon.getvalue())
    if lignes_ouvertes:
        ouvert = _inserer(ouvert, "Prochain", lignes_ouvertes)
        with open(p_open, "w", encoding="utf-8") as f:
            f.write(ouvert)
    premier = n - len(lignes_faites) - len(lignes_ouvertes) + 1
    print("Historique écrit : %d tâche(s) faite(s)%s, %d ouverte(s)." % (
        len(lignes_faites), " (#%d à #%d)" % (premier, premier + len(lignes_faites) - 1) if lignes_faites else "",
        len(lignes_ouvertes)))
    return len(lignes_faites), len(lignes_ouvertes)


# ---------------------------------------------------------------- import d'une roadmap existante


def reglages_import(dossier):
    """(qui, requis) d'un dossier déjà posé, lus dans `.claude/roadmap.json` : la personne (`me`) et
    les champs exigés ; sans dossier, personne et `id` seul."""
    if not dossier:
        return "", ["id"]
    dossier = os.path.abspath(os.path.expanduser(dossier))
    try:
        with open(os.path.join(dossier, ".claude", "roadmap.json"), encoding="utf-8") as f:
            cfg = json.load(f) or {}
    except (OSError, ValueError):
        cfg = {}
    me = cfg.get("me") or []
    qui = me[0] if isinstance(me, list) and me else (me if isinstance(me, str) else "")
    requis = cfg.get("requis") or (REQUIS_PROJET if cfg.get("mode") == "projet" else ["id"])
    return qui, requis


# ---------------------------------------------------------------- ligne de commande


def main(argv=None):
    p = argparse.ArgumentParser(description="Onboarding d'un projet de code.")
    sub = p.add_subparsers(dest="cmd", required=True)
    px = sub.add_parser("exemple")
    px.add_argument("--mode", choices=("code", "projet"), default="code")
    pi = sub.add_parser("init")
    pi.add_argument("dossier")
    pi.add_argument("--reponses", required=True)
    pi.add_argument("--manquants", action="store_true")
    pv = sub.add_parser("verifier")
    pv.add_argument("dossier")
    ph = sub.add_parser("historique")
    ph.add_argument("dossier")
    ph.add_argument("--mois", type=int, default=6)
    ph.add_argument("--sans-gh", action="store_true")
    ph.add_argument("--par", choices=("auto", "commit", "jour"), default="auto")
    pe = sub.add_parser("historique-ecrire")
    pe.add_argument("dossier")
    pe.add_argument("--lignes", required=True)
    pa = sub.add_parser("analyser")
    pa.add_argument("fichier")
    pa.add_argument("--fait")
    pa.add_argument("--dossier")
    pa.add_argument("--qui")
    pa.add_argument("--requis")
    pm = sub.add_parser("importer")
    pm.add_argument("dossier")
    pm.add_argument("--analyse", required=True)
    a = p.parse_args(argv)
    try:
        if a.cmd == "exemple":
            print(json.dumps(EXEMPLE_PROJET if a.mode == "projet" else EXEMPLE, ensure_ascii=False, indent=2))
        elif a.cmd == "init":
            init(a.dossier, charger_reponses(a.reponses), a.manquants)
        elif a.cmd == "historique":
            print(json.dumps(relever(a.dossier, a.mois, not a.sans_gh, par=a.par), ensure_ascii=False, indent=2))
        elif a.cmd == "historique-ecrire":
            ecrire_historique(a.dossier, a.lignes)
        elif a.cmd == "analyser":
            qui, requis = reglages_import(a.dossier)
            requis = [x.strip() for x in a.requis.split(",") if x.strip()] if a.requis else requis
            print(json.dumps(importer.analyser(a.fichier, a.fait, a.qui or qui, requis), ensure_ascii=False, indent=2))
        elif a.cmd == "importer":
            importer.importer(a.dossier, a.analyse)
        else:
            ecarts = verifier(a.dossier)
            if ecarts:
                print("Écarts au format (%d) :" % len(ecarts))
                for e in ecarts:
                    print("  - " + e)
                return 1
            print("Conforme au format.")
    except Erreur as e:
        print("ÉCHEC : %s" % e)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
