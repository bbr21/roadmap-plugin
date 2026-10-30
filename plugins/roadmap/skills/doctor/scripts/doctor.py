#!/usr/bin/env python3
"""Doctor d'un projet de code : tout ce qu'il faut pour que la roadmap, le panneau et Maestro
marchent, ligne par ligne, OK, KO ou À voir, avec la commande qui corrige.

  python3 doctor.py [DOSSIER]          le dossier du projet (défaut : le dossier courant)
  python3 doctor.py [DOSSIER] --json   le même diagnostic en JSON

Lecture seule : il ne change rien, ni au projet ni à la machine. Code de retour 1 s'il y a un KO.
Ce qu'il exige (outils, skills de Superpowers, skill iOS) est dans references/requis.json : la liste
des skills y suit celle que le plugin cite (hooks/parse.ts), et un test le garde.

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import glob
import json
import os
import re
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REQUIS = os.path.join(os.path.dirname(HERE), "references", "requis.json")
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(HERE)), "onboarding", "scripts"))
import onboarding as ob  # noqa: E402

OK, KO, VOIR = "OK", "KO", "À voir"
MARQUE = {OK: "✅", KO: "❌", VOIR: "⚠️"}
IGNORES = {".git", "node_modules", ".build", "Pods", "DerivedData", "build", "dist", ".venv", "venv"}
# Le magasin de plugins de l'app de bureau, sous le home : <compte>/<org>/rpm/manifest.json.
MAGASIN = ("Library", "Application Support", "Claude", "local-agent-mode-sessions")
# Les réglages gérés de la machine (managed-settings.json, managed-settings.d/, managed-mcp.json).
GERE = "/Library/Application Support/ClaudeCode" if sys.platform == "darwin" else "/etc/claude-code"
# Le plugin intégré de sécurité de Claude Code, sous ses deux noms (#116).
SEC_DEFAULT = ("sec-default@builtin", "cc-plugin-sec-default@builtin")


def charger_requis():
    with open(REQUIS, encoding="utf-8") as f:
        return json.load(f)


def lancer(args, cwd=None, timeout=60):
    try:
        r = subprocess.run(args, cwd=cwd, capture_output=True, text=True, timeout=timeout)
    except (OSError, subprocess.TimeoutExpired):
        return None
    return r


def ligne(statut, sujet, detail, correction=""):
    return {"statut": statut, "sujet": sujet, "detail": detail, "correction": correction}


# ---------------------------------------------------------------- machine


def outils(requis, mode="code", est_git=True):
    """Les outils du mode : en Code, git, node, python3 et gh connecté ; en Projet (#76), python3,
    et git seulement si le dossier est un dépôt."""
    if mode == "projet":
        voulus = dict(requis["projet"]["outils"])
        if est_git:
            voulus["git"] = requis["outils"]["git"]
    else:
        voulus = requis["outils"]
    out, manquants = [], []
    for nom, installe in voulus.items():
        if not shutil.which(nom):
            manquants.append((nom, installe))
    if manquants:
        out.append(ligne(KO, "Outils", "absents : " + ", ".join(n for n, _ in manquants),
                         " ; ".join(c for _, c in manquants)))
    else:
        out.append(ligne(OK, "Outils", ", ".join(voulus)))
    if mode == "projet":
        return out
    if shutil.which("gh"):
        jeton = lancer(["gh", "auth", "token"])
        if jeton is None or jeton.returncode != 0:
            out.append(ligne(KO, "GitHub CLI", "gh n'est connecté à aucun compte", "gh auth login"))
        else:
            qui = lancer(["gh", "config", "get", "-h", "github.com", "user"])
            compte = qui.stdout.strip() if qui is not None and qui.returncode == 0 else ""
            out.append(ligne(OK, "GitHub CLI", "connecté" + (" (%s)" % compte if compte else "")))
    return out


def _json(chemin):
    try:
        with open(chemin, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return None


def plugins_de_l_app(home, env=None):
    """Les plugins que charge l'app de bureau, lus dans son magasin (rpm/manifest.json), au format
    de `claude plugin list --json` avec la portée `app` ; None sans magasin lisible.

    Le magasin est celui du compte de la session (variables d'environnement d'une session de l'app),
    sinon le plus récemment mis à jour : un terminal n'a pas ces variables."""
    env = os.environ if env is None else env
    racine = os.path.join(home, *MAGASIN)
    manifestes = []
    try:
        for compte in sorted(os.listdir(racine)):
            for org in sorted(os.listdir(os.path.join(racine, compte))):
                chemin = os.path.join(racine, compte, org, "rpm", "manifest.json")
                if os.path.isfile(chemin):
                    manifestes.append(((compte, org), chemin))
    except OSError:
        return None
    voulu = (env.get("CLAUDE_CODE_ACCOUNT_UUID"), env.get("CLAUDE_CODE_ORGANIZATION_UUID"))
    lus = [(cle, chemin, _json(chemin)) for cle, chemin in manifestes]
    lus = [(cle, chemin, m) for cle, chemin, m in lus if isinstance(m, dict) and isinstance(m.get("plugins"), list)]
    if not lus:
        return None
    du_compte = [l for l in lus if l[0] == voulu]
    _, chemin, manifeste = du_compte[0] if du_compte else max(lus, key=lambda l: l[2].get("lastUpdated") or 0)
    rpm = os.path.dirname(chemin)
    out = []
    for p in manifeste["plugins"]:
        base = os.path.join(rpm, str(p.get("id", "")))
        decl = _json(os.path.join(base, ".claude-plugin", "plugin.json")) or {}
        out.append({"id": "%s@%s" % (p.get("name", "?"), p.get("marketplaceName", "?")),
                    "version": decl.get("version", "?") if isinstance(decl, dict) else "?",
                    "enabled": True, "installPath": base, "lastUpdated": p.get("updatedAt"), "scope": "app"})
    return out


def fusionner(app, terminal):
    """Les plugins de l'app d'abord ; du terminal, tout sauf sa copie `synced` des plugins de l'app,
    rafraîchie seulement au démarrage de `claude` dans un terminal, donc parfois en retard."""
    if app is None:
        return terminal
    return app + [p for p in terminal or [] if p.get("scope") != "synced"]


def lire_plugins(home):
    return fusionner(plugins_de_l_app(home), plugins_du_terminal())


def plugins_du_terminal():
    """La liste de `claude plugin list --json`, ou None quand la commande manque ou échoue."""
    if not shutil.which("claude"):
        return None
    r = lancer(["claude", "plugin", "list", "--json"], timeout=90)
    if r is None or r.returncode != 0:
        return None
    try:
        data = json.loads(r.stdout)
    except ValueError:
        return None
    return data if isinstance(data, list) else None


def _nom(p):
    return str(p.get("id", "")).split("@")[0]


def _catalogue(p):
    ident = str(p.get("id", ""))
    return ident.split("@", 1)[1] if "@" in ident else ""


def _de_l_app(p):
    """Un plugin du compte, que l'app installe et met à jour : lu dans son magasin, ou dans la
    copie `synced` du terminal quand le magasin manque."""
    return p.get("scope") in ("app", "synced")


def _source(p):
    if p.get("scope") == "app":
        return "magasin de l'app"
    if p.get("scope") == "synced":
        return "copie synced du terminal, peut-être en retard sur l'app"
    return "installé par le terminal"


def plugins_et_skills(requis, plugins, home, skills=None, facultatif=False):
    """`skills` : les skills de méthode exigées ; par défaut celles du brief d'une session de code.
    `facultatif` (mode Projet, #94) : le brief propose ces skills sans les exiger, donc Superpowers
    absent, éteint ou incomplet est À voir, pas KO."""
    out = []
    manque_sp = VOIR if facultatif else KO
    if plugins is None:
        out.append(ligne(VOIR, "Plugins", "liste illisible : `claude plugin list --json` ne répond pas ici",
                         "lancer le doctor depuis un terminal où la commande claude marche"))
        return out
    roadmap = [p for p in plugins if _nom(p) == "roadmap"]
    if not roadmap:
        out.append(ligne(KO, "Plugin roadmap", "absent", "l'ajouter depuis son catalogue (réglages des plugins)"))
    elif not any(p.get("enabled") for p in roadmap):
        out.append(ligne(KO, "Plugin roadmap", "installé mais éteint", "claude plugin enable %s" % roadmap[0].get("id")))
    else:
        actif = next(p for p in roadmap if p.get("enabled"))
        out.append(ligne(OK, "Plugin roadmap", "version %s (%s)" % (actif.get("version", "?"), _source(actif))))

    sp = requis["superpowers"]
    trouves = [p for p in plugins if _nom(p) == sp["plugin"]]
    installer = "claude plugin marketplace add %s && claude plugin install %s@%s" % (sp["depot"], sp["plugin"], sp["catalogue"])
    if not trouves:
        out.append(ligne(manque_sp, "Superpowers",
                         "absent : facultatif en mode Projet, le brief propose plan et brainstorm à la demande" if facultatif
                         else "absent : les sessions lancées citent ses skills de méthode", installer))
        return out
    actif = next((p for p in trouves if p.get("enabled")), None)
    if actif is None:
        out.append(ligne(manque_sp, "Superpowers", "installé mais éteint", "claude plugin enable %s" % trouves[0].get("id")))
        return out
    cat = _catalogue(actif)
    out.append(ligne(OK, "Superpowers", "version %s (%s, catalogue %s)" % (actif.get("version", "?"), _source(actif), cat or "?")))
    base = actif.get("installPath") or ""
    voulues = sp["skills"] if skills is None else skills
    manque = [s for s in voulues if not os.path.isfile(os.path.join(base, "skills", s, "SKILL.md"))]
    if manque:
        out.append(ligne(manque_sp, "Skills de méthode", "introuvables dans Superpowers %s : %s (renommées ou retirées ?)" % (
            actif.get("version", "?"), ", ".join(manque)),
            "claude plugin update %s ; si elles restent introuvables, mettre à jour leur liste dans le plugin roadmap "
            "(hooks/parse.ts et la skill doctor)" % actif.get("id")))
    else:
        out.append(ligne(OK, "Skills de méthode", "%d sur %d présentes" % (len(voulues), len(voulues))))
    depuis = (actif.get("lastUpdated") or "")[:10]
    if _de_l_app(actif):
        # known_marketplaces.json ne connaît que les catalogues du terminal : un plugin de l'app
        # suit le catalogue du compte, que l'app synchronise elle-même.
        out.append(ligne(OK, "Mise à jour de Superpowers", "suivie par l'app (%s)%s" % (
            "catalogue %s du compte" % cat if cat and cat != "synced" else "plugin du compte",
            ", dernière le %s" % depuis if depuis else "")))
        return out
    auto = None
    try:
        with open(os.path.join(home, ".claude", "plugins", "known_marketplaces.json"), encoding="utf-8") as f:
            auto = (json.load(f).get(cat) or {}).get("autoUpdate")
    except (OSError, ValueError, AttributeError):
        auto = None
    if auto is True:
        out.append(ligne(OK, "Mise à jour de Superpowers", "automatique"))
    else:
        out.append(ligne(VOIR, "Mise à jour de Superpowers",
                         "pas automatique (réglage par défaut d'un catalogue tiers)%s" % (
                             ", dernière le %s" % depuis if depuis else ""),
                         "/plugin, Marketplaces, %s, Enable auto-update ; ou à la main : claude plugin update %s" % (
                             cat, actif.get("id"))))
    return out


# ---------------------------------------------------------------- projet


def est_ios(dossier, profondeur=4):
    """Un projet Swift : un .xcodeproj, un Package.swift ou un fichier .swift, hors dossiers de build."""
    base = os.path.abspath(dossier)
    for racine, dirs, fichiers in os.walk(base):
        niveau = racine[len(base):].count(os.sep)
        if any(d.endswith(".xcodeproj") for d in dirs) or "Package.swift" in fichiers or any(f.endswith(".swift") for f in fichiers):
            return True
        dirs[:] = [d for d in dirs if d not in IGNORES and not d.startswith(".")] if niveau < profondeur else []
    return False


def skill_ios(requis, plugins, home):
    nom = requis["ios"]["skill"]
    if os.path.isfile(os.path.join(home, ".claude", "skills", nom, "SKILL.md")):
        return ligne(OK, "Skill %s" % nom, "installée (~/.claude/skills)")
    for p in plugins or []:
        base = p.get("installPath") or ""
        if p.get("enabled") and (_nom(p) == nom or os.path.isfile(os.path.join(base, "skills", nom, "SKILL.md"))):
            return ligne(OK, "Skill %s" % nom, "installée (%s)" % p.get("id"))
    return ligne(KO, "Skill %s" % nom, "absente : le brief des sessions l'exige sur un écran SwiftUI",
                 "l'installer dans ~/.claude/skills/%s" % nom)


def git(dossier, *args):
    r = lancer(["git", "-C", dossier] + list(args))
    return r if r is not None else subprocess.CompletedProcess(args, 1, "", "")


def depot(dossier):
    out = []
    if git(dossier, "rev-parse", "--git-dir").returncode != 0:
        out.append(ligne(KO, "Dépôt git", "le dossier n'est pas un dépôt git", "la skill onboarding le crée"))
        return out, dossier
    main = ob.principal(dossier)
    branche = git(main, "branch", "--show-current").stdout.strip()
    if branche and branche != "main":
        out.append(ligne(KO, "Dépôt git", "dossier principal sur la branche %s, pas sur main" % branche,
                         "git -C %s checkout main" % main))
    else:
        out.append(ligne(OK, "Dépôt git", "dossier principal %s, sur main" % main))
    url = git(main, "remote", "get-url", "origin").stdout.strip()
    nom = os.path.basename(main.rstrip("/")).lower()
    if not url:
        out.append(ligne(KO, "GitHub", "aucun dépôt distant : la roadmap n'est pas sur GitHub",
                         "gh repo create <compte>/%s --private --source %s --push" % (nom, main)))
        return out, main
    if "github.com" not in url:
        out.append(ligne(VOIR, "GitHub", "dépôt distant hors de GitHub : %s" % url))
    else:
        out.append(ligne(OK, "GitHub", url.replace("https://github.com/", "").replace("git@github.com:", "").replace(".git", "")))
    if git(main, "rev-parse", "--verify", "-q", "refs/remotes/origin/main").returncode != 0:
        out.append(ligne(VOIR, "main poussé", "origin/main inconnu : main n'a jamais été poussé (ou pas encore récupéré)",
                         "git -C %s push -u origin main" % main))
    else:
        compte = git(main, "rev-list", "--left-right", "--count", "origin/main...main").stdout.split()
        derriere, devant = (int(compte[0]), int(compte[1])) if len(compte) == 2 else (0, 0)
        if devant:
            out.append(ligne(VOIR, "main poussé", "%d commit(s) de main pas encore sur GitHub (d'après le dernier fetch)" % devant,
                             "git -C %s push" % main))
        elif derriere:
            out.append(ligne(VOIR, "main poussé", "GitHub a %d commit(s) de plus que main ici" % derriere,
                             "git -C %s pull --ff-only" % main))
        else:
            out.append(ligne(OK, "main poussé", "à jour avec origin/main (d'après le dernier fetch)"))
    return out, main


def roadmap(main):
    out = []
    rdir = ob.trouver_roadmap(main)
    if rdir is None:
        out.append(ligne(KO, "Roadmap", "introuvable : ni .claude/roadmap.json, ni ROADMAP.md à la racine ; Maestro n'a rien à lire",
                         "lancer la skill onboarding sur %s" % main))
        return out
    if not os.path.isfile(os.path.join(rdir, "ROADMAP.md")):
        out.append(ligne(KO, "Roadmap", ".claude/roadmap.json désigne %s, qui n'a pas de ROADMAP.md" % rdir,
                         "corriger dir dans .claude/roadmap.json, ou la skill onboarding"))
        return out
    ou = "racine du dépôt" if os.path.normpath(rdir) == os.path.normpath(main) else os.path.relpath(rdir, main) + "/"
    if os.path.relpath(rdir, main).startswith(".."):
        ou = rdir + " (hors du dépôt : pas sur GitHub)"

    def compte(fichier, marque):
        try:
            with open(os.path.join(rdir, fichier), encoding="utf-8") as f:
                return sum(1 for l in ob.lignes_de_taches(f.read()) if l.startswith(marque))
        except OSError:
            return None
    ouvertes, faites = compte("ROADMAP.md", "- [ ]"), compte("ROADMAP-fait.md", "- [x]")
    statut = VOIR if ou.endswith("(hors du dépôt : pas sur GitHub)") else OK
    out.append(ligne(statut, "Roadmap", "%s : %d ouverte(s), %s faite(s)" % (ou, ouvertes or 0, faites if faites is not None else "fichier des faites absent")))
    ecarts = ob.verifier(main)
    if ecarts:
        out.append(ligne(VOIR, "Structure", "%d écart(s) au format, dont : %s" % (len(ecarts), ecarts[0]),
                         "lancer la skill onboarding (projet existant) : elle complète sans rien écraser"))
    else:
        out.append(ligne(OK, "Structure", "conforme au format (CLAUDE.md, roadmap, hook de démarrage, scripts)"))
    requis = requis_code(main)
    if requis:
        out.append(champs_exiges(rdir, requis, lancees=True))
    check = os.path.join(main, "scripts", "check.mjs")
    if os.path.isfile(check) and shutil.which("node"):
        r = lancer(["node", "scripts/check.mjs"], cwd=main, timeout=120)
        if r is None:
            out.append(ligne(VOIR, "Contrôle du projet", "node scripts/check.mjs ne répond pas"))
        elif r.returncode == 0:
            out.append(ligne(OK, "Contrôle du projet", "node scripts/check.mjs : tout est en ordre"))
        else:
            erreurs = [l.strip() for l in r.stdout.splitlines() if l.startswith("    ")]
            out.append(ligne(KO, "Contrôle du projet", "node scripts/check.mjs : %d erreur(s), dont %s" % (
                len(erreurs), erreurs[0] if erreurs else r.stdout.strip()[-200:]), "corriger les lignes citées, puis relancer"))
    return out


# ---------------------------------------------------------------- mode Projet (#76)

VUES = {"echeance", "responsable", "arbre", "sujet", "jour"}


def reglages_projet(main):
    """Les réglages de `.claude/roadmap.json` que le panneau ne comprendrait pas : il les ignore."""
    try:
        with open(os.path.join(main, ".claude", "roadmap.json"), encoding="utf-8") as f:
            cfg = json.load(f)
    except (OSError, ValueError):
        return ligne(KO, "Réglages", ".claude/roadmap.json illisible", "corriger son JSON, ou la skill onboarding"), {}
    if not isinstance(cfg, dict):
        return ligne(KO, "Réglages", ".claude/roadmap.json n'est pas un objet JSON", "la skill onboarding"), {}
    soucis = []
    vue = cfg.get("vue")
    if vue is not None and vue not in VUES:
        soucis.append("vue « %s » inconnue (%s)" % (vue, ", ".join(sorted(VUES))))
    cles = cfg.get("cles") or {}
    if not isinstance(cles, dict):
        soucis.append("cles n'est pas un objet")
        cles = {}
    for k, v in cles.items():
        if k in ob.CLES_GRAMMAIRE or not ob.CLE_DECLAREE.match(k):
            soucis.append("clé déclarée « %s » ignorée (clé de la grammaire ou mal écrite)" % k)
        elif not isinstance(v, list):
            soucis.append("cles.%s n'est pas une liste" % k)
    rangement = cfg.get("rangement")
    if rangement is not None and not (isinstance(rangement, dict) and isinstance(rangement.get("skill"), str) and rangement["skill"]):
        soucis.append("rangement sans skill, ignoré : l'archivage ne l'attend pas")
    requis = cfg.get("requis", ob.REQUIS_PROJET)
    if not isinstance(requis, list):
        soucis.append("requis n'est pas une liste")
    else:
        inconnues = [k for k in requis if k not in ob.CLES_GRAMMAIRE and k not in cles]
        if inconnues:
            soucis.append("requis : %s ni de la grammaire ni déclarée(s), ignorée(s)" % ", ".join(map(str, inconnues)))
    if soucis:
        return ligne(VOIR, "Réglages", " ; ".join(soucis), "corriger .claude/roadmap.json : le panneau ignore ces réglages"), cfg
    return ligne(OK, "Réglages", "mode Projet, vue %s, %d clé(s) déclarée(s)" % (vue or "echeance", len(cles))), cfg


def champs_exiges(rdir, requis, lancees=False):
    """Les tâches ouvertes à qui manque un champ exigé : écrites hors de Claude Code, ou avant.

    `lancees` (mode Code, #80) : seules comptent les tâches lancées, qui portent `qui:` ou `branche:`.
    """
    try:
        with open(os.path.join(rdir, "ROADMAP.md"), encoding="utf-8") as f:
            lignes = [l for l in ob.lignes_de_taches(f.read()) if l.startswith("- [ ]")]
    except OSError:
        return ligne(KO, "Champs exigés", "ROADMAP.md illisible")
    quelles = "lancée(s)" if lancees else "ouverte(s)"
    comptees, incompletes, manquants = 0, 0, set()
    for l in lignes:
        bloc = re.findall(r"`\[([^`]*)\]`", l)
        champs = {}
        for f in (bloc[-1].split("|")[1:] if bloc else []):
            k, _, v = f.strip().partition(":")
            champs[k.strip()] = v.strip()
        if lancees and "qui" not in champs and "branche" not in champs:
            continue
        comptees += 1
        absents = [k for k in requis if not champs.get(k)]
        if absents:
            incompletes += 1
            manquants.update(absents)
    if incompletes:
        return ligne(VOIR, "Champs exigés", "%d tâche(s) %s incomplète(s) sur %d (manquent : %s)" % (
            incompletes, quelles, comptees, ", ".join(k for k in requis if k in manquants)),
            "compléter ces lignes : le panneau ne signale que les lignes écrites dans Claude Code")
    return ligne(OK, "Champs exigés", "%d tâche(s) %s, toutes complètes" % (comptees, quelles))


def requis_code(main):
    """Les champs exigés d'une tâche lancée en mode Code : `requis` de .claude/roadmap.json s'il est une liste."""
    try:
        with open(os.path.join(main, ".claude", "roadmap.json"), encoding="utf-8") as f:
            requis = (json.load(f) or {}).get("requis", ob.REQUIS_CODE)
    except (OSError, ValueError, AttributeError):
        return ob.REQUIS_CODE
    return requis if isinstance(requis, list) else ob.REQUIS_CODE


def roadmap_projet(main):
    out = []
    rdir = ob.trouver_roadmap(main)
    if rdir is None or not os.path.isfile(os.path.join(rdir, "ROADMAP.md")):
        out.append(ligne(KO, "Roadmap", "introuvable : .claude/roadmap.json ne désigne pas de ROADMAP.md",
                         "lancer la skill onboarding (mode Projet) sur %s" % main))
        return out
    ou = "racine du dossier" if os.path.normpath(rdir) == os.path.normpath(main) else os.path.relpath(rdir, main) + "/"
    with open(os.path.join(rdir, "ROADMAP.md"), encoding="utf-8") as f:
        ouvertes = sum(1 for l in ob.lignes_de_taches(f.read()) if l.startswith("- [ ]"))
    out.append(ligne(OK, "Roadmap", "%s : %d ouverte(s)" % (ou, ouvertes)))
    ecarts = ob.verifier(main)
    if ecarts:
        out.append(ligne(VOIR, "Structure", "%d écart(s) au format, dont : %s" % (len(ecarts), ecarts[0]),
                         "lancer la skill onboarding (mode Projet) : elle complète sans rien écraser"))
    else:
        out.append(ligne(OK, "Structure", "conforme au mode Projet (CLAUDE.md, roadmap, .claude/roadmap.json)"))
    reglages, cfg = reglages_projet(main)
    out.append(reglages)
    requis = cfg.get("requis", ob.REQUIS_PROJET) if isinstance(cfg.get("requis", []), list) else ob.REQUIS_PROJET
    out.append(champs_exiges(rdir, requis))
    return out


def mode_inconnu(main):
    """Un `mode` que le panneau ne connaît pas (« Projet », « project ») : il le lit comme Code, sans rien dire."""
    try:
        with open(os.path.join(main, ".claude", "roadmap.json"), encoding="utf-8") as f:
            mode = (json.load(f) or {}).get("mode")
    except (OSError, ValueError, AttributeError):
        return None
    if mode is None or mode in ("code", "projet"):
        return None
    return ligne(VOIR, "Réglages", "mode « %s » inconnu (code ou projet) : le panneau lit ce projet en mode Code" % mode,
                 "corriger mode dans .claude/roadmap.json")


# ---------------------------------------------------------------- ensemble


def nom_utilisateur(home):
    """Le nom de l'utilisateur dans ~/.claude/roadmap-perso.json (#79) : sans lui, Claude dit
    « l'utilisateur » et rien ne compte « À moi ». Le réglage `me` du plugin, que le doctor ne lit
    pas, peut aussi le donner : d'où À voir, pas KO."""
    chemin = os.path.join(home, ".claude", "roadmap-perso.json")
    donnees = _json(chemin)
    me = donnees.get("me") if isinstance(donnees, dict) else None
    noms = [me] if isinstance(me, str) else me if isinstance(me, list) else []
    noms = [n.strip() for n in noms if isinstance(n, str) and n.strip()]
    if noms:
        return ligne(OK, "Nom de l'utilisateur", "%s (~/.claude/roadmap-perso.json)" % ", ".join(noms))
    return ligne(VOIR, "Nom de l'utilisateur", "aucun nom : Claude dira « l'utilisateur » et rien ne comptera « À moi »",
                 "écrire {\"me\": [\"Ton nom\"]} dans ~/.claude/roadmap-perso.json (l'onboarding le fait), "
                 "ou remplir le réglage « Tes noms dans les roadmaps » du plugin")


def _est_roadmap(plugin_id):
    return plugin_id.startswith("roadmap@")


def _place(liste, est):
    """La place du premier id de `liste` qui vérifie `est`, ou la longueur de la liste."""
    return next((i for i, p in enumerate(liste or []) if isinstance(p, str) and est(p)), len(liste or []))


def sec_default(home, gere=None):
    """sec-default (#116) : Claude Code pose son plugin intégré cc-plugin-sec-default devant les plugins
    installés sur une machine aux réglages gérés et pour une organisation Team ou Enterprise, sauf si
    des réglages gérés posent prependPlugins. Il saute alors les hooks classiques du plugin roadmap, qui
    passe par ses voies de secours : À voir, jamais KO. L'admin peut poser le plugin en appendPlugins."""
    gere = GERE if gere is None else gere
    fichiers = [os.path.join(gere, "managed-settings.json")] + sorted(glob.glob(os.path.join(gere, "managed-settings.d", "*.json")))
    # Les réglages gérés à distance (console d'admin), que Claude Code garde dans ~/.claude.
    fichiers.append(os.path.join(home, ".claude", "remote-settings.json"))
    lus = [_json(f) for f in fichiers if os.path.isfile(f)]
    reglages = [d.get("settings") if isinstance(d.get("settings"), dict) else d for d in lus if isinstance(d, dict)]
    # Les ajouts de managed-settings.d passent après le fichier de base : le dernier qui pose une clé l'emporte.
    prepend = append = None
    for d in reglages:
        if isinstance(d.get("prependPlugins"), list):
            prepend = d["prependPlugins"]
        if isinstance(d.get("appendPlugins"), list):
            append = d["appendPlugins"]
    # Posé en appendPlugins, le plugin est au rang où sec-default rend la main ; en prependPlugins,
    # seulement devant sec-default (derrière lui, il serait sauté comme un plugin installé).
    if _place(append, _est_roadmap) < len(append or []):
        return ligne(OK, "Hooks du plugin", "roadmap posé par l'admin en appendPlugins : tous ses hooks tournent")
    if _place(prepend, _est_roadmap) < _place(prepend, lambda p: p in SEC_DEFAULT):
        return ligne(OK, "Hooks du plugin", "roadmap posé par l'admin en prependPlugins : tous ses hooks tournent")
    compte = _json(os.path.join(home, ".claude.json"))
    org = (compte.get("oauthAccount") or {}).get("organizationType") if isinstance(compte, dict) else None
    if prepend is not None and not any(p in SEC_DEFAULT for p in prepend):
        return ligne(OK, "Hooks du plugin", "les réglages gérés posent prependPlugins sans sec-default : tous les hooks tournent")
    if prepend is not None:
        raison = "listé dans prependPlugins"
    elif org in ("claude_team", "claude_enterprise"):
        raison = "compte %s" % ("Enterprise" if org == "claude_enterprise" else "Team")
    elif reglages or os.path.isfile(os.path.join(gere, "managed-mcp.json")):
        raison = "réglages gérés sur cette machine"
    else:
        return ligne(OK, "Hooks du plugin", "ni réglages gérés ni compte Team ou Enterprise : pas de sec-default")
    return ligne(VOIR, "Hooks du plugin",
                 "sec-default (%s) saute les hooks classiques du plugin, qui passe par ses voies de secours : "
                 "après une compaction, les réglages de session complets ne reviennent pas, et le rappel de fin "
                 "de tour arrive en message, un tour de plus" % raison,
                 "rien d'obligatoire ; pour tout retrouver, l'admin de l'organisation ajoute aux réglages gérés "
                 "\"enabledPlugins\": {\"roadmap@roadmap\": true} et \"appendPlugins\": [\"roadmap@roadmap\"] "
                 "(catalogue bbr21/roadmap-plugin), sec-default restant en place")


def diagnostiquer(dossier, plugins="lire", home=None, avec_outils=True, gere=None):
    dossier = os.path.abspath(os.path.expanduser(dossier))
    home = home or os.path.expanduser("~")
    requis = charger_requis()
    if plugins == "lire":
        plugins = lire_plugins(home)
    lignes = []
    principal = ob.principal(dossier)
    if ob.mode_du_dossier(principal) == "projet":
        # Mode Projet (#76) : ni GitHub, ni check.mjs, ni swiftui-pro ; la roadmap et ses champs.
        est_git = git(principal, "rev-parse", "--git-dir").returncode == 0
        if avec_outils:
            lignes += outils(requis, "projet", est_git)
        lignes += roadmap_projet(principal)
        lignes += plugins_et_skills(requis, plugins, home, requis["projet"]["skills"], facultatif=True)
        lignes.append(sec_default(home, gere))
        lignes.append(nom_utilisateur(home))
        return {"dossier": principal, "lignes": lignes,
                "ko": sum(1 for l in lignes if l["statut"] == KO), "a_voir": sum(1 for l in lignes if l["statut"] == VOIR)}
    if avec_outils:
        lignes += outils(requis)
    inconnu = mode_inconnu(principal)
    if inconnu:
        lignes.append(inconnu)
    faits, main = depot(dossier)
    lignes += faits
    if git(dossier, "rev-parse", "--git-dir").returncode == 0:
        lignes += roadmap(main)
    lignes += plugins_et_skills(requis, plugins, home)
    lignes.append(sec_default(home, gere))
    lignes.append(nom_utilisateur(home))
    if est_ios(main):
        lignes.append(skill_ios(requis, plugins, home))
    return {"dossier": main, "lignes": lignes,
            "ko": sum(1 for l in lignes if l["statut"] == KO), "a_voir": sum(1 for l in lignes if l["statut"] == VOIR)}


def texte(d):
    out = ["Doctor · %s" % d["dossier"]]
    for l in d["lignes"]:
        out.append("%s %-7s %s : %s" % (MARQUE[l["statut"]], l["statut"], l["sujet"], l["detail"]))
        if l["correction"] and l["statut"] != OK:
            out.append("           → %s" % l["correction"])
    if d["ko"] == 0 and d["a_voir"] == 0:
        out.append("Verdict : tout est branché, Maestro peut tourner.")
    else:
        out.append("Verdict : %d KO, %d à voir." % (d["ko"], d["a_voir"]))
    return "\n".join(out)


def main(argv=None):
    p = argparse.ArgumentParser(description="Doctor d'un projet de code (plugin roadmap).")
    p.add_argument("dossier", nargs="?", default=".")
    p.add_argument("--json", action="store_true")
    a = p.parse_args(argv)
    d = diagnostiquer(a.dossier)
    print(json.dumps(d, ensure_ascii=False, indent=2) if a.json else texte(d))
    return 1 if d["ko"] else 0


if __name__ == "__main__":
    sys.exit(main())
