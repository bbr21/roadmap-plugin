#!/usr/bin/env python3
"""Doctor d'un projet de code : tout ce qu'il faut pour que la roadmap, le panneau et Maestro
marchent, ligne par ligne, OK, KO ou À voir, avec la commande qui corrige.

  python3 doctor.py [DOSSIER]          le dossier du projet (défaut : le dossier courant)
  python3 doctor.py [DOSSIER] --json   le même diagnostic en JSON

Lecture seule : il ne change rien, ni au projet ni à la machine. Il lit sur le réseau les empreintes
publiées du plugin roadmap (CHECKSUMS.txt du dépôt public, par curl, #274). Code de retour 1 s'il y a un KO.
Ce qu'il exige (outils, skills de Superpowers, skill iOS) est dans references/requis.json : la liste
des skills y suit celle que le plugin cite (hooks/parse.ts), et un test le garde.

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import glob
import hashlib
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
# Les empreintes de chaque version, publiées avec le miroir public du plugin (#271, #274).
DEPOT_PUBLIC = "bbr21/roadmap-plugin"
CHECKSUMS_MAIN = "https://raw.githubusercontent.com/%s/main/CHECKSUMS.txt" % DEPOT_PUBLIC
CHECKSUMS_AU = "https://raw.githubusercontent.com/" + DEPOT_PUBLIC + "/%s/CHECKSUMS.txt"
COMMITS_API = "https://api.github.com/repos/%s/commits?path=CHECKSUMS.txt&per_page=100" % DEPOT_PUBLIC



DEPOT_GITHUB = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_.-]*/[A-Za-z0-9][A-Za-z0-9_.-]*$")
ADRESSE_GITHUB = re.compile(
    r"^(?:git@github\.com:|(?:ssh://git@|https?://|git://)github\.com[:/])"
    r"[A-Za-z0-9][A-Za-z0-9_.-]*/[A-Za-z0-9][A-Za-z0-9_.-]*?(?:\.git)?/?$"
)


def depot_valide(v):
    """`depot` de roadmap.json (#444) : la même lecture que `depotOf` du panneau."""
    return isinstance(v, str) and bool(DEPOT_GITHUB.match(v.strip()) or ADRESSE_GITHUB.match(v.strip()))

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


def _version(p):
    return tuple(int(n) for n in re.findall(r"\d+", str(p.get("version", ""))))


def _retirer(p):
    """Le geste qui retire cette copie : dans claude.ai pour un plugin du compte, sinon au terminal."""
    if _de_l_app(p):
        return "claude.ai, Réglages, Plugins : retirer %s (plugin du compte)" % p.get("id")
    portee = p.get("scope") if p.get("scope") in ("user", "project", "local") else "user"
    return "claude plugin uninstall %s --scope %s" % (p.get("id"), portee)


def python_intercepte(plugins, which=None):
    """Un shim `python3` posé par un plugin en tête du PATH (modern-python de trailofbits, #279) :
    il refuse `python3 <script>`, la forme de toutes les skills du plugin roadmap, et avec pyenv
    réglé sur « system » les deux shims se renvoient la main sans fin. `which` : la recherche du
    `python3` de la machine, seulement quand le doctor juge les outils (sinon le PATH du test)."""
    actifs = [p for p in plugins or [] if p.get("enabled") and _nom(p) == "modern-python"]
    if actifs:
        return ligne(KO, "Python", "%s pose un shim python3 qui refuse « python3 <script> » des skills, et se fige "
                     "avec pyenv : le retirer" % ", ".join(str(p.get("id")) for p in actifs),
                     " ; ".join(_retirer(p) for p in actifs))
    trouve = which("python3") if which else None
    if trouve and "/.claude/plugins/" in trouve.replace(os.sep, "/"):
        return ligne(KO, "Python", "le python3 du PATH est le shim d'un plugin (%s) : les scripts des skills "
                     "peuvent être refusés" % trouve, "retirer le plugin qui le pose (which -a python3)")
    return None


def roadmap_en_double(roadmap):
    """Deux copies actives du plugin roadmap (#229) : le moteur renomme alors leurs options
    roadmap@<source>.<champ> (#227). On garde celle du compte, que l'app met à jour elle-même,
    sinon la plus récente ; le doctor dit le geste pour l'autre, sans le faire."""
    actifs = [p for p in roadmap if p.get("enabled")]
    if len(actifs) < 2:
        return None
    garde = max(actifs, key=lambda p: (_de_l_app(p), _version(p)))
    autres = [p for p in actifs if p is not garde]
    avance = [p for p in autres if _version(p) > _version(garde)]
    detail = "%d copies actives : %s ; leurs options se renomment (roadmap@<source>.<champ>). Garder %s%s" % (
        len(actifs), ", ".join("%s %s (%s)" % (p.get("id"), p.get("version", "?"), _source(p)) for p in actifs),
        garde.get("id"), ", que l'app met à jour elle-même" if _de_l_app(garde) else ", la plus récente")
    if avance:
        detail += " ; %s est en avance : le magasin du compte la rattrape par Check for updates dans claude.ai" % (
            ", ".join(p.get("id") for p in avance))
    return ligne(VOIR, "Plugin roadmap en double", detail, " ; ".join(_retirer(p) for p in autres))


def plugins_et_skills(requis, plugins, home, skills=None, facultatif=False):
    """`skills` : les skills de méthode exigées ; par défaut celles du brief d'une session de code.
    `facultatif` (dossier sans code, #94) : le brief propose ces skills sans les exiger, donc Superpowers
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
        double = roadmap_en_double(roadmap)
        if double:
            out.append(double)

    sp = requis["superpowers"]
    trouves = [p for p in plugins if _nom(p) == sp["plugin"]]
    installer = "claude plugin marketplace add %s && claude plugin install %s@%s" % (sp["depot"], sp["plugin"], sp["catalogue"])
    if not trouves:
        out.append(ligne(manque_sp, "Superpowers",
                         "absent : facultatif dans un dossier sans code, le brief propose plan et brainstorm à la demande" if facultatif
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


# ---------------------------------------------------------------- empreintes (#274)
# La lecture de CHECKSUMS.txt est celle de tools/securite.py (parse_checksums), qui n'est pas installé ;
# le relevé des fichiers est plus strict que le sien (rien n'est sauté) : un test du dépôt les compare.


class Injoignable(Exception):
    """Les empreintes publiées n'ont pas pu être lues (réseau, curl absent, limite de GitHub)."""


def _bruit(rel):
    """Ce que le Finder pose partout : rien qui se charge."""
    base = os.path.basename(rel)
    return base == ".DS_Store" or base.startswith("._")


def fichiers_installes(dossier):
    """Tout ce que contient une copie installée du plugin, chemins relatifs, triés : fichiers et liens
    symboliques (un dossier lié compte pour une entrée, jamais suivi). Seuls le bruit du Finder et le
    dossier `.in_use` que l'app pose à la racine sont laissés : un fichier caché dans un cache, un
    `node_modules` ou un test compte (revue de sécurité de #274)."""
    out = []
    for base, dirs, files in os.walk(dossier):
        if base == dossier:
            dirs[:] = [d for d in dirs if d != ".in_use"]
        for nom in dirs + files:
            chemin = os.path.join(base, nom)
            if nom in files or os.path.islink(chemin):
                rel = os.path.relpath(chemin, dossier).replace(os.sep, "/")
                if not _bruit(rel):
                    out.append(rel)
    return sorted(out)


def _cache_admis(rel, voulues):
    """Le cache que Python écrit lui-même à côté d'un script publié qu'il a lancé :
    <dossier>/__pycache__/<module>.<interpréteur>.pyc, seulement si <dossier>/<module>.py est publié."""
    m = re.match(r"^(?:(.*)/)?__pycache__/([A-Za-z_][A-Za-z0-9_]*)\.[A-Za-z0-9_-]+\.pyc$", rel)
    return bool(m) and ("%s/%s.py" % (m.group(1), m.group(2)) if m.group(1) else "%s.py" % m.group(2)) in voulues


def lire_empreintes(texte):
    """CHECKSUMS.txt : {nom: (version, {chemin: sha256})}."""
    out, courant = {}, None
    for l in texte.split("\n"):
        tete = re.match(r"^# (\S+) (\d+\.\d+\.\d+) : ", l)
        if tete:
            courant = tete.group(1)
            out[courant] = (tete.group(2), {})
        elif courant and re.match(r"^[0-9a-f]{64}  ", l):
            out[courant][1][l[66:]] = l[:64]
    return out


def _sha256(chemin):
    h = hashlib.sha256()
    with open(chemin, "rb") as f:
        for bloc in iter(lambda: f.read(65536), b""):
            h.update(bloc)
    return h.hexdigest()


def _curl(url):
    """Le texte d'une adresse publique, par curl (aucun shell) ; None si la lecture échoue."""
    if not shutil.which("curl"):
        raise Injoignable("curl absent")
    r = lancer(["curl", "-fsSL", "--max-time", "20", url], timeout=30)
    return r.stdout if r is not None and r.returncode == 0 else None


def empreintes_publiees(version, nom="roadmap", curl=None):
    """{chemin: sha256} de `version`, lu dans CHECKSUMS.txt du dépôt public : celui de main, sinon
    celui du commit « <nom> <version> » du miroir. None si la version n'a pas d'empreintes publiées
    (avant 0.176.0) ; lève Injoignable si le dépôt public ne répond pas."""
    curl = curl or _curl
    texte = curl(CHECKSUMS_MAIN)
    if texte is None:
        raise Injoignable("CHECKSUMS.txt du dépôt public %s illisible" % DEPOT_PUBLIC)
    trouve = lire_empreintes(texte).get(nom)
    if trouve and trouve[0] == version:
        return trouve[1]
    liste = curl(COMMITS_API)
    try:
        commits = json.loads(liste) if liste is not None else None
    except ValueError:
        commits = None
    if not isinstance(commits, list):
        raise Injoignable("historique du dépôt public %s illisible (limite de l'API GitHub ?)" % DEPOT_PUBLIC)
    voulu = "%s %s" % (nom, version)
    sha = next((c.get("sha") for c in commits if isinstance(c, dict)
                and str((c.get("commit") or {}).get("message", "")).split("\n")[0].strip() == voulu), None)
    if not sha:
        return None
    texte = curl(CHECKSUMS_AU % sha)
    if texte is None:
        raise Injoignable("CHECKSUMS.txt de %s illisible" % voulu)
    trouve = lire_empreintes(texte).get(nom)
    return trouve[1] if trouve and trouve[0] == version else None


def _reinstaller(p):
    if _de_l_app(p):
        return "claude.ai, Réglages, Plugins : retirer puis réajouter %s (plugin du compte)" % p.get("id")
    portee = p.get("scope") if p.get("scope") in ("user", "project", "local") else "user"
    return "claude plugin uninstall %s --scope %s && claude plugin install %s --scope %s" % (
        p.get("id"), portee, p.get("id"), portee)


def _liste(fichiers, n=5):
    return ", ".join(fichiers[:n]) + (" et %d autres" % (len(fichiers) - n) if len(fichiers) > n else "")


def empreintes(roadmap, chercher):
    """Une ligne par copie installée du plugin roadmap : identique aux empreintes publiées de sa
    version, ou les fichiers changés, en trop et manquants. `chercher(version)` : {chemin: sha256},
    None sans empreintes publiées, ou lève Injoignable ; lu une fois par version."""
    out, lus = [], {}
    sujet = "Empreintes du plugin roadmap"
    for p in roadmap:
        base = p.get("installPath") or ""
        if not base or not os.path.isdir(base):
            continue
        version = str(p.get("version", "?"))
        copie = "%s %s" % (_source(p), version)
        if version not in lus:
            try:
                lus[version] = chercher(version)
            except Injoignable as e:
                lus[version] = e
        voulues = lus[version]
        if isinstance(voulues, Injoignable):
            out.append(ligne(VOIR, sujet, "%s : empreintes publiées injoignables (%s)" % (copie, voulues),
                             "relancer le doctor avec le réseau ; à la main : plugins/roadmap/SECURITE.md, "
                             "« Vérifier que ta copie est une vraie version »"))
            continue
        if voulues is None:
            out.append(ligne(VOIR, sujet, "%s : aucune empreinte publiée pour cette version "
                             "(CHECKSUMS.txt existe depuis la 0.176.0)" % copie,
                             "mettre le plugin à jour, puis relancer le doctor"))
            continue
        avoir = fichiers_installes(base)
        liens = [f for f in avoir if os.path.islink(os.path.join(base, f))]
        avoir = [f for f in avoir if f not in liens]
        changes = [f for f in avoir if f in voulues and voulues[f] != _sha256(os.path.join(base, f))]
        en_trop = [f for f in avoir if f not in voulues and not _cache_admis(f, voulues)]
        manquants = sorted(f for f in voulues if f not in avoir and f not in liens)
        if not (liens or changes or en_trop or manquants):
            out.append(ligne(OK, sujet, "%s : identique aux empreintes publiées (%d fichiers)" % (copie, len(voulues))))
            continue
        ecarts = []
        for mots, fichiers in ((("lien symbolique", "liens symboliques"), liens), (("changé", "changés"), changes),
                               (("en trop", "en trop"), en_trop), (("manquant", "manquants"), manquants)):
            if fichiers:
                ecarts.append("%d %s (%s)" % (len(fichiers), mots[len(fichiers) > 1], _liste(fichiers)))
        out.append(ligne(KO, sujet, "%s : différente de la version publiée, %s" % (copie, " ; ".join(ecarts)),
                         _reinstaller(p)))
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
    requis, sur = ob.requis_du_dossier(main)
    if requis:
        out.append(champs_exiges(rdir, requis, lancees=sur == "lancees"))
    out.append(priorites(rdir))
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


# ---------------------------------------------------------------- dossier sans code (#76, #176)

def reglages_projet(main):
    """Les réglages de `.claude/roadmap.json` que le panneau ne comprendrait pas : il les ignore."""
    chemin = os.path.join(main, ".claude", "roadmap.json")
    if not os.path.exists(chemin):
        # #176 : un dossier sans code peut s'en passer (Life Cowork, sa roadmap à la racine).
        return ligne(OK, "Réglages", "pas de .claude/roadmap.json : les défauts"), {}
    try:
        with open(chemin, encoding="utf-8") as f:
            cfg = json.load(f)
    except (OSError, ValueError):
        return ligne(KO, "Réglages", ".claude/roadmap.json illisible", "corriger son JSON, ou la skill onboarding"), {}
    if not isinstance(cfg, dict):
        return ligne(KO, "Réglages", ".claude/roadmap.json n'est pas un objet JSON", "la skill onboarding"), {}
    soucis = []
    # #238 : le panneau s'ouvre par sujet dans tout projet ; `vue` ne sert plus.
    if "vue" in cfg:
        soucis.append("vue ignorée depuis #238 (le panneau s'ouvre par sujet) : la retirer")
    cles = cfg.get("cles") or {}
    if not isinstance(cles, dict):
        soucis.append("cles n'est pas un objet")
        cles = {}
    for k, v in cles.items():
        if k in ob.CLES_GRAMMAIRE or not ob.CLE_DECLAREE.match(k):
            soucis.append("clé déclarée « %s » ignorée (clé de la grammaire ou mal écrite)" % k)
        elif not isinstance(v, list):
            soucis.append("cles.%s n'est pas une liste" % k)
    # #125 : les clés montrées en pastilles et la clé de rangement doivent être déclarées.
    visibles = cfg.get("cles_visibles", [])
    if not isinstance(visibles, list):
        soucis.append("cles_visibles n'est pas une liste")
    else:
        non_declarees = [str(k) for k in visibles if k not in cles]
        if non_declarees:
            soucis.append("cles_visibles : %s non déclarée(s) dans cles, ignorée(s)" % ", ".join(non_declarees))
    ranger = cfg.get("ranger_par")
    if ranger is not None and ranger not in cles:
        soucis.append("ranger_par « %s » non déclarée dans cles, ignorée" % ranger)
    # #278 : le cadre Mission de la fiche, en phrase (défaut) ou en puces.
    mission = cfg.get("mission")
    if mission is not None and mission not in ("phrase", "puces"):
        soucis.append("mission « %s » inconnue (phrase ou puces), le panneau montre la phrase" % mission)
    # #444 : le dépôt GitHub du code d'une roadmap qui vit hors de lui, `owner/repo` ou son adresse GitHub.
    depot = cfg.get("depot")
    if depot is not None and not depot_valide(depot):
        soucis.append("depot « %s » illisible (owner/repo d'un dépôt GitHub), ignoré : la carte cloud part de "
                      "l'origine git du dossier" % depot)
    # #277 : les ref: des coquilles « à preuve », dont les étapes de semaine ne passent pas seules.
    a_preuve = cfg.get("a_preuve")
    if a_preuve is not None and not (isinstance(a_preuve, list) and all(isinstance(r, str) and r.strip() for r in a_preuve)):
        soucis.append("a_preuve n'est pas une liste de ref: de coquilles, ignorée : toutes les étapes de semaine passent seules")
    rangement = cfg.get("rangement")
    if rangement is not None and not (isinstance(rangement, dict) and isinstance(rangement.get("skill"), str) and rangement["skill"]):
        soucis.append("rangement sans skill, ignoré : l'archivage ne l'attend pas")
    soucis += soucis_de_mode(cfg)
    requis = cfg.get("requis", ob.requis_du_dossier(main, cfg)[0])
    if not isinstance(requis, list):
        soucis.append("requis n'est pas une liste")
    else:
        inconnues = [k for k in requis if k not in ob.CLES_GRAMMAIRE and k not in cles]
        if inconnues:
            soucis.append("requis : %s ni de la grammaire ni déclarée(s), ignorée(s)" % ", ".join(map(str, inconnues)))
    if soucis:
        return ligne(VOIR, "Réglages", " ; ".join(soucis), "corriger .claude/roadmap.json : le panneau ignore ces réglages"), cfg
    return ligne(OK, "Réglages", "%d clé(s) déclarée(s)" % len(cles)), cfg


def champs_exiges(rdir, requis, lancees=False):
    """Les tâches ouvertes à qui manque un champ exigé : écrites hors de Claude Code, ou avant.

    `lancees` (#80, `requis_sur`, #176) : seules comptent les tâches lancées, qui portent `qui:` ou `branche:`.
    """
    try:
        with open(os.path.join(rdir, "ROADMAP.md"), encoding="utf-8") as f:
            lignes = [l for l in ob.lignes_de_taches(f.read()) if l.startswith("- [ ]")]
    except OSError:
        return ligne(KO, "Champs exigés", "ROADMAP.md illisible")
    quelles = "lancée(s)" if lancees else "ouverte(s)"
    # #125 : la date d'un parent se calcule sur ses enfants ; due: ne s'y exige pas, sauf récurrent.
    parents = set(re.findall(r"\|\s*parent:\s*#?([1-9]\d*)\s*[|\]]", "\n".join(lignes)))
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
        parent = champs.get("id") in parents and "tous" not in champs
        absents = [k for k in requis if not champs.get(k) and not (k == "due" and parent)]
        if absents:
            incompletes += 1
            manquants.update(absents)
    if incompletes:
        return ligne(VOIR, "Champs exigés", "%d tâche(s) %s incomplète(s) sur %d (manquent : %s)" % (
            incompletes, quelles, comptees, ", ".join(k for k in requis if k in manquants)),
            "compléter ces lignes : le panneau ne signale que les lignes écrites dans Claude Code")
    return ligne(OK, "Champs exigés", "%d tâche(s) %s, toutes complètes" % (comptees, quelles))


ENFANTS_MAX = 8


def _champs_de(ligne_):
    bloc = re.findall(r"`\[([^`]*)\]`", ligne_)
    champs = {}
    for f in (bloc[-1].split("|")[1:] if bloc else []):
        k, _, v = f.strip().partition(":")
        champs[k.strip()] = v.strip().lstrip("#") if k.strip() == "parent" else v.strip()
    return champs


def parents_enfants(rdir):
    """#125 : les règles du modèle seule, parent, enfant, signalées sans rien refuser."""
    def lire(nom):
        try:
            with open(os.path.join(rdir, nom), encoding="utf-8") as f:
                return ob.lignes_de_taches(f.read())
        except OSError:
            return []
    ouvertes = [_champs_de(l) for l in lire("ROADMAP.md") if l.startswith("- [ ]")]
    faites = [_champs_de(l) for l in lire("ROADMAP-fait.md") if l.startswith("- [x]")]
    par_id = {c["id"]: c for c in ouvertes if c.get("id")}
    parent_de = lambda c: c.get("parent") if c.get("parent") not in (None, "", "-") else None
    enfants = {}
    for c in ouvertes:
        if parent_de(c):
            enfants.setdefault(parent_de(c), []).append(c)
    soucis = []
    for c in ouvertes:
        p = par_id.get(parent_de(c) or "")
        if p and parent_de(p):
            soucis.append("troisième niveau : #%s sous #%s, lui-même enfant de #%s" % (c.get("id", "?"), p["id"], parent_de(p)))
        for n in re.findall(r"\d+", c.get("après", "")):
            if n in par_id and parent_de(par_id[n]) != parent_de(c):
                soucis.append("après: hors des sœurs : #%s après #%s" % (c.get("id", "?"), n))
        if p and p.get("due") and c.get("due") and c["due"] > p["due"]:
            soucis.append("#%s dû après l'échéance de son parent #%s" % (c.get("id", "?"), p["id"]))
    faits_par_parent = {parent_de(c) for c in faites if parent_de(c)}
    for i, c in par_id.items():
        if i in faits_par_parent and i not in enfants:
            soucis.append("#%s ouvert, tous ses enfants faits : le cocher" % i)
        if len(enfants.get(i, [])) > ENFANTS_MAX:
            soucis.append("#%s a %d enfants ouverts : des étapes plus larges ?" % (i, len(enfants[i])))
    if soucis:
        return ligne(VOIR, "Parents et enfants", " ; ".join(soucis[:3]) + (" (et %d autre(s))" % (len(soucis) - 3) if len(soucis) > 3 else ""),
                     "corriger ces lignes, ou la skill audit : deux niveaux, après: entre sœurs ou entre parents")
    nb_enfants = sum(len(v) for k, v in enfants.items() if k in par_id)
    return ligne(OK, "Parents et enfants", "%d parent(s), %d enfant(s)" % (len([k for k in enfants if k in par_id]), nb_enfants))


def _prio_migree(texte):
    """#308 : la grammaire en tête (son exemple en bloc de code, ou sa prose) dit prio:oui : la roadmap est migrée (#300)."""
    bloc = False
    for l in texte.split("\n"):
        if l.lstrip().startswith("```"):
            bloc = not bloc
        if (bloc or not l.startswith("- [")) and "prio:oui" in l:
            return True
    return False


def priorites(rdir):
    """#300 : la priorité est oui ou non ; `prio:1`, `2`, `3` (l'échelle de #130) se migrent par la skill tasks."""
    try:
        with open(os.path.join(rdir, "ROADMAP.md"), encoding="utf-8") as f:
            texte = f.read()
    except OSError:
        texte = ""
    ouvertes = [_champs_de(l) for l in ob.lignes_de_taches(texte) if l.startswith("- [ ]")]
    anciennes = sum(1 for c in ouvertes if c.get("prio") in ("1", "2", "3"))
    oui = sum(1 for c in ouvertes if c.get("prio") == "oui")
    if anciennes and _prio_migree(texte):
        return ligne(KO, "Priorités", "%d ligne(s) revenue(s) à l'ancienne échelle après la migration (la grammaire dit prio:oui)" % anciennes,
                     "skill tasks : python3 scripts/tasks.py prio-oui <dossier>, puis write ; la ligne s'écrit prio:oui ou sans prio:")
    if anciennes:
        return ligne(VOIR, "Priorités", "%d ligne(s) à l'ancienne échelle prio:1, 2, 3 ; la priorité est oui ou non" % anciennes,
                     "skill tasks : python3 scripts/tasks.py prio-oui <dossier>, puis write (prio:1 devient oui, 2 et 3 s'effacent)")
    return ligne(OK, "Priorités", "%d tâche(s) prioritaire(s) (prio:oui)" % oui)


def roadmap_projet(main):
    out = []
    rdir = ob.trouver_roadmap(main)
    if rdir is None or not os.path.isfile(os.path.join(rdir, "ROADMAP.md")):
        out.append(ligne(KO, "Roadmap", "introuvable : .claude/roadmap.json ne désigne pas de ROADMAP.md",
                         "lancer la skill onboarding sur %s" % main))
        return out
    ou = "racine du dossier" if os.path.normpath(rdir) == os.path.normpath(main) else os.path.relpath(rdir, main) + "/"
    with open(os.path.join(rdir, "ROADMAP.md"), encoding="utf-8") as f:
        ouvertes = sum(1 for l in ob.lignes_de_taches(f.read()) if l.startswith("- [ ]"))
    out.append(ligne(OK, "Roadmap", "%s : %d ouverte(s)" % (ou, ouvertes)))
    ecarts = ob.verifier(main)
    if ecarts:
        out.append(ligne(VOIR, "Structure", "%d écart(s) au format, dont : %s" % (len(ecarts), ecarts[0]),
                         "lancer la skill onboarding : elle complète sans rien écraser"))
    else:
        out.append(ligne(OK, "Structure", "conforme au format sans code (CLAUDE.md, roadmap, .claude/roadmap.json)"))
    reglages, cfg = reglages_projet(main)
    out.append(reglages)
    requis, sur = ob.requis_du_dossier(main, cfg)
    out.append(champs_exiges(rdir, requis, lancees=sur == "lancees"))
    out.append(parents_enfants(rdir))
    out.append(priorites(rdir))
    return out


def soucis_de_mode(cfg):
    """`mode` et `requis_sur` que le panneau ne connaît pas (« Projet », « toutes ») : il les ignore sans rien dire."""
    soucis = []
    mode = cfg.get("mode")
    if mode is not None and mode not in ("auto",) + ob.MODES_FORCES:
        soucis.append("mode « %s » inconnu (auto, code ou projet) : le travail se déduit du dossier" % mode)
    sur = cfg.get("requis_sur")
    if sur is not None and sur not in ob.REQUIS_SUR:
        soucis.append("requis_sur « %s » inconnu (%s), ignoré" % (sur, " ou ".join(ob.REQUIS_SUR)))
    return soucis


def reglages_inconnus(main):
    """Les réglages inconnus d'un projet de code, en une ligne « À voir » ; rien s'il n'y en a pas."""
    try:
        with open(os.path.join(main, ".claude", "roadmap.json"), encoding="utf-8") as f:
            cfg = json.load(f)
    except (OSError, ValueError):
        return None
    soucis = soucis_de_mode(cfg) if isinstance(cfg, dict) else []
    if not soucis:
        return None
    return ligne(VOIR, "Réglages", " ; ".join(soucis), "corriger .claude/roadmap.json")


def travail(main):
    """Le travail du dossier (#176), et ce qui le dit : `mode`, sinon ce que le doctor a vu. Une
    détection fausse se voit ici et se corrige par `mode`."""
    force = ob.mode_force(main)
    if force:
        return ligne(OK, "Travail", "%s (forcé par mode dans .claude/roadmap.json)" % force.capitalize())
    t, raison = ob.detecter_travail(main)
    return ligne(OK, "Travail", "%s (%s)" % (t.capitalize(), raison))


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


def design_system(main):
    """Le design system que déclare `.claude/roadmap.json` (#129), sur lequel s'appuie toute maquette.

    Dans les deux modes. Absent : « À voir », avec ce que le projet a déjà (un `design/`, un modèle de
    deck) ou la proposition d'en poser un. Un chemin local doit exister ; une adresse ne se vérifie pas.
    """
    commande = 'python3 "<dossier de la skill onboarding>/scripts/onboarding.py" design %s --poser \'[…]\'' % main
    try:
        with open(os.path.join(main, ".claude", "roadmap.json"), encoding="utf-8") as f:
            cfg = json.load(f)
    except (OSError, ValueError):
        cfg = None
    design = cfg.get("design") if isinstance(cfg, dict) else None
    if design == "aucun":
        return ligne(OK, "Design system", "aucun, choisi : les maquettes ne proposent pas d'en poser un")
    if design is None or design == []:
        candidats = ob.reperer_design(main)
        if candidats:
            return ligne(VOIR, "Design system", "pas déclaré ; déjà là : %s" % ", ".join(candidats[:5]),
                         "le déclarer pour que toute maquette s'y appuie : " + commande)
        return ligne(VOIR, "Design system", "pas déclaré, et aucun trouvé dans le projet",
                     "en poser un (composants et variables, ou modèles de document et de deck), puis le déclarer : "
                     + commande + ' ; ou « "aucun" » si le projet s\'en passe')
    try:
        entrees = ob.normaliser_design(design)
    except ob.Erreur as e:
        return ligne(VOIR, "Design system", "illisible, ignoré par le panneau : %s" % e, "corriger « design » : " + commande)
    absents = [e["chemin"] for e in entrees if not re.match(r"^https?://", e["chemin"])
               and not os.path.exists(os.path.join(main, os.path.expanduser(e["chemin"])))]
    if absents:
        return ligne(VOIR, "Design system", "introuvable(s) : %s" % ", ".join(absents),
                     "corriger le chemin dans « design » : " + commande)
    return ligne(OK, "Design system", ", ".join(e["chemin"] for e in entrees))


def regles_du_projet(main):
    """Les règles de la roadmap (#167) et ce que le projet déclare sur elle (#158 : `regles`,
    `ecriture`, `preuves`), dans les deux modes. Le fichier des règles manque, ou une écriture
    illisible bloque la skill tasks : KO. Ni roadmap ni rien de déclaré : pas de ligne."""
    d = ob.declarations(main)
    if d["regles"] is None and d["ecriture"] is None and not d["ecriture_illisible"] and not d["preuves"] and not d["soucis"]:
        return None
    correction = "corriger .claude/roadmap.json (regles, ecriture {outil, consigne}, preuves), ou poser le fichier qui manque"
    regles = d["regles"]
    if regles and not regles["existe"]:
        pose = "python3 %s regles %s" % (os.path.abspath(ob.__file__), main)
        correction = (pose if regles["defaut"]
                      else "corriger « regles » de .claude/roadmap.json, ou y poser le fichier : " + pose)
        return ligne(KO, "Règles du projet", " ; ".join(d["soucis"]), correction)
    if d["ecriture_illisible"]:
        return ligne(KO, "Règles du projet", " ; ".join(d["soucis"]), correction)
    if d["soucis"]:
        return ligne(VOIR, "Règles du projet", " ; ".join(d["soucis"]), correction)
    parties = []
    if regles:
        parties.append("règles %s" % regles["chemin"])
    if d["ecriture"]:
        parties.append("écriture par %s" % d["ecriture"]["outil"])
    if d["preuves"]:
        parties.append("preuves : %s" % ", ".join(p["lieu"] for p in d["preuves"]))
    return ligne(OK, "Règles du projet", " ; ".join(parties))


def regles_de_l_outil(main):
    """La section « Règles de l'outil » du fichier des règles (#290), comparée à celle du modèle du mode :
    à jour, OK ; absente ou différente, « À voir », avec la commande qui la pose seule. Sans fichier des
    règles, pas de ligne : « Règles du projet » est déjà KO, avec la commande qui pose le fichier entier."""
    e = ob.etat_regles_outil(main)
    if e is None:
        return None
    mode = "Projet" if e["mode"] == "projet" else "Code"
    if e["etat"] == "a_jour":
        return ligne(OK, "Règles de l'outil", "%s : à jour avec le modèle du mode %s" % (e["chemin"], mode))
    pose = "python3 %s regles --outil %s" % (os.path.abspath(ob.__file__), main)
    quoi = "absente" if e["etat"] == "absente" else "différente du modèle du mode %s" % mode
    return ligne(VOIR, "Règles de l'outil", "%s : section « Règles de l'outil » %s" % (e["chemin"], quoi),
                 pose + " (la seule section, les règles du projet gardées)")


# Les couleurs d'axe du panneau (#286), dans l'ordre de `AXIS_NAMES` de hooks/parse.ts.
COULEURS_AXE = ("bleu", "orange", "vert", "jaune", "violet", "turquoise", "rose", "gris")
SLUG_AXE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
NOM_AXE_MAX = 40


def axes_declares(main, home=None):
    """`axes` (#286) de `.claude/roadmap.json`, sinon de l'entrée de `~/.claude/roadmap-perso.json` dont un
    `match` contient le dossier ; et d'où il vient. Rien de déclaré : (None, None)."""
    chemin = os.path.join(main, ".claude", "roadmap.json")
    if os.path.isfile(chemin):
        try:
            with open(chemin, encoding="utf-8") as f:
                cfg = json.load(f)
        except (OSError, ValueError):
            cfg = None
        if isinstance(cfg, dict) and "axes" in cfg:
            return cfg["axes"], ".claude/roadmap.json"
        return None, None
    perso = os.path.join(home or os.path.expanduser("~"), ".claude", "roadmap-perso.json")
    try:
        with open(perso, encoding="utf-8") as f:
            sources = (json.load(f) or {}).get("sources") or []
    except (OSError, ValueError, AttributeError):
        return None, None
    principal = os.path.normpath(main)
    for src in sources if isinstance(sources, list) else []:
        if not isinstance(src, dict) or "axes" not in src:
            continue
        matchs = [m for m in src.get("match") or [] if isinstance(m, str) and m]
        if any(principal.startswith(os.path.normpath(os.path.expanduser(m))) for m in matchs):
            return src["axes"], "roadmap-perso.json (source %s)" % src.get("name", "?")
    return None, None


def axes_portes(rdir):
    """Les axes que portent les lignes de ROADMAP.md et ROADMAP-fait.md."""
    out = set()
    for nom in ("ROADMAP.md", "ROADMAP-fait.md"):
        try:
            with open(os.path.join(rdir, nom), encoding="utf-8") as f:
                lignes = ob.lignes_de_taches(f.read())
        except OSError:
            continue
        for l in lignes:
            bloc = re.findall(r"`\[([^`]*)\]`", l)
            if bloc:
                out.add(bloc[-1].split("|")[0].strip())
    return out


def axes_du_projet(main, home=None):
    """La couleur et le nom choisis des axes (#286, `axes`), que le panneau ignore sans rien dire quand ils
    sont mal écrits : une clé qui n'est pas un slug, une couleur inconnue, un nom vide ; un nom de plus de
    40 caractères, il le coupe. Un axe qu'aucune ligne ne porte ne se voit nulle part. Rien de déclaré : pas de ligne."""
    axes, ou = axes_declares(main, home)
    if axes is None:
        return None
    correction = "corriger « axes » de %s, ou rééditer l'axe au crayon du panneau" % ou
    if not isinstance(axes, dict):
        return ligne(VOIR, "Axes", "axes n'est pas un objet (slug d'axe → { couleur, nom }), ignoré", correction)
    rdir = ob.trouver_roadmap(main)
    portes = axes_portes(rdir) if rdir else set()
    soucis = []
    for axe, style in axes.items():
        if not SLUG_AXE.match(axe):
            soucis.append("« %s » n'est pas un slug d'axe (minuscules, chiffres, tirets), ignoré" % axe)
            continue
        if not isinstance(style, dict):
            soucis.append("%s : ni couleur ni nom (un objet { couleur, nom } attendu), ignoré" % axe)
            continue
        couleur = style.get("couleur")
        if couleur is not None and couleur not in COULEURS_AXE:
            soucis.append("%s : couleur « %s » inconnue (%s), ignorée" % (axe, couleur, ", ".join(COULEURS_AXE)))
        nom = style.get("nom")
        if nom is not None:
            if not isinstance(nom, str) or not nom.strip():
                soucis.append("%s : nom vide, ignoré" % axe)
            elif len(" ".join(nom.split())) > NOM_AXE_MAX:
                soucis.append("%s : nom de plus de 40 caractères, coupé par le panneau" % axe)
        if rdir and axe not in portes:
            soucis.append("« %s » : aucune ligne ne le porte (axe renommé ou retiré ?)" % axe)
    if soucis:
        return ligne(VOIR, "Axes", " ; ".join(soucis), correction)
    return ligne(OK, "Axes", "%d axe(s) à couleur ou nom choisi, dans %s" % (len(axes), ou))


# ---------------------------------------------------------------- réglage cloud (#408, #444, #453)

PERSO = "~/.claude/roadmap-perso.json"
# Les clés d'une entrée de roadmap-perso.json qui ne se recopient pas d'un .claude/roadmap.json : elles disent où.
CLES_DE_PLACE = ("dir", "name", "match")


def depot_de(v):
    """`owner/repo` d'un `depot` ou d'une adresse GitHub, comme `depotOf` du panneau ; None sinon."""
    if not isinstance(v, str):
        return None
    v = v.strip()
    if DEPOT_GITHUB.match(v):
        return re.sub(r"\.git$", "", v)
    if ADRESSE_GITHUB.match(v):
        return re.sub(r"(\.git)?/?$", "", re.split(r"github\.com[:/]", v, maxsplit=1)[1])
    return None


def _chemin(p):
    return os.path.normpath(os.path.expanduser(p))


def _dans(p, racine):
    return p == racine or p.startswith(racine.rstrip(os.sep) + os.sep)


def sources_perso(home):
    """Les entrées lisibles de `sources` de ~/.claude/roadmap-perso.json, comme `parseSources` du panneau."""
    try:
        with open(os.path.join(home, ".claude", "roadmap-perso.json"), encoding="utf-8") as f:
            sources = (json.load(f) or {}).get("sources") or []
    except (OSError, ValueError, AttributeError):
        return []
    return [s for s in sources if isinstance(s, dict) and isinstance(s.get("name"), str)
            and isinstance(s.get("dir"), str) and isinstance(s.get("match"), list)]


def _matchs(src):
    return [_chemin(m) for m in src.get("match") or [] if isinstance(m, str) and m]


def entrees_du_projet(main, home):
    """Les entrées de roadmap-perso.json du même projet : leur roadmap ou l'un de leurs dossiers est dans `main`."""
    racine = _chemin(main)
    return [s for s in sources_perso(home)
            if _dans(_chemin(s["dir"]), racine) or any(_dans(m, racine) for m in _matchs(s))]


def reglages_effectifs(main, home):
    """Les réglages que lit une session ouverte dans `main`, dans l'ordre du panneau (`localSource`) :
    `.claude/roadmap.json`, sinon l'entrée de roadmap-perso.json au plus long préfixe. Et où les écrire."""
    chemin = os.path.join(main, ".claude", "roadmap.json")
    if os.path.isfile(chemin):
        try:
            with open(chemin, encoding="utf-8") as f:
                cfg = json.load(f)
        except (OSError, ValueError):
            return None, None, None
        return (cfg, ".claude/roadmap.json", None) if isinstance(cfg, dict) else (None, None, None)
    racine, meilleure = _chemin(main), None
    for src in sources_perso(home):
        for m in _matchs(src):
            if _dans(racine, m) and (meilleure is None or len(m) > meilleure[0]):
                meilleure = (len(m), src)
    if meilleure:
        src = meilleure[1]
        return src, "l'entrée « %s » de %s" % (src["name"], PERSO), src
    return {}, ".claude/roadmap.json", None


def _origine(dossier):
    return depot_de(git(dossier, "remote", "get-url", "origin").stdout.strip()) if os.path.isdir(dossier) else None


def clone_local(depot, candidats):
    """Le premier dossier des candidats dont l'origine git est `depot` (sans tenir à la casse)."""
    for c in candidats:
        o = _origine(c)
        if o and o.lower() == depot.lower():
            return c
    return None


def _cle(k, v):
    texte = json.dumps(v, ensure_ascii=False)
    return "%s: %s" % (json.dumps(k), texte if len(texte) <= 60 else "…")


def cloud_du_projet(main, home):
    """Le réglage cloud du projet (#453) : `sessions:cloud` sans dépôt GitHub (ni origine git ni `depot`), KO ;
    un dépôt sans docs/session-cloud.md, KO ; un projet sur GitHub sans `sessions:cloud`, « À voir » (cloud
    possible). Une ligne, avec le geste, écrit là où la session lit ses réglages."""
    eff, ou, entree = reglages_effectifs(main, home)
    if eff is None:
        return None  # .claude/roadmap.json illisible : la ligne Réglages le dit déjà.
    cloud = eff.get("cloud")
    if cloud is not None:
        if cloud != "missions":
            return ligne(VOIR, "Cloud", "cloud « %s » inconnu (missions) : ignoré" % cloud,
                         "écrire \"cloud\": \"missions\" dans %s, ou retirer la clé" % ou)
        porte = depot_de(eff.get("depot")) or _origine(main)
        if porte:
            return ligne(OK, "Cloud", "missions cloud par carte depuis le dépôt porte %s : ni branche, ni PR, ni "
                         "docs/session-cloud.md (réglage lu dans %s)" % (porte, ou))
        return ligne(KO, "Cloud", "cloud:missions sans dépôt porte sur GitHub (ni depot, ni origine git) : la carte de "
                     "mission n'a rien d'où partir",
                     "créer le dépôt porte privé (git init, .gitignore à *, gh repo create <compte>/<nom>-porte "
                     "--private --source %s --push), puis ajouter \"depot\": \"<compte>/<nom>-porte\" à %s" % (main, ou))
    sessions = eff.get("sessions")
    if sessions is not None and sessions not in ("mac", "cloud"):
        return ligne(VOIR, "Cloud", "sessions « %s » inconnu (mac ou cloud) : le panneau lance sur le Mac" % sessions,
                     "écrire \"sessions\": \"cloud\" ou \"mac\" dans %s" % ou)
    depot_declare = depot_de(eff.get("depot"))
    depot = depot_declare or _origine(main)
    candidats = [main] + [m for e in ([entree] if entree else entrees_du_projet(main, home)) for m in _matchs(e)]
    if depot_declare:
        clone = clone_local(depot, candidats)
    else:
        clone = main if depot else None
    doc = clone and os.path.isfile(os.path.join(clone, "docs", "session-cloud.md"))
    copier = ("copier docs/session-cloud.md de bbr21/roadmap dans %s/docs/, l'adapter au projet, committer et pousser"
              % (clone or depot))
    if sessions != "cloud":
        if not depot:
            return ligne(OK, "Cloud", "sessions de tâche sur le Mac (pas de dépôt GitHub : rien à cloner) ; une mission qui "
                         "n'a besoin que des connecteurs part en cloud sans dépôt, par Maestro (#467)")
        geste = "ajouter \"sessions\": \"cloud\" à %s" % ou
        if clone and not doc:
            geste += ", puis " + copier
        return ligne(VOIR, "Cloud", "cloud possible : dépôt GitHub %s, sans sessions:cloud ; les tâches partent sur le Mac" % depot,
                     geste)
    if not depot:
        return ligne(KO, "Cloud", "sessions:cloud sans dépôt GitHub joignable (ni origine git sur GitHub, ni depot) : "
                     "le ▶ Cloud n'a rien à cloner",
                     "ajouter \"depot\": \"<owner>/<repo>\" (le dépôt GitHub du code) à %s, ou pousser le dossier sur "
                     "GitHub (gh repo create <compte>/<nom> --private --source %s --push), ou retirer sessions (une mission par "
                     "connecteurs part sans dépôt, par Maestro, #467)" % (ou, main))
    if not clone:
        return ligne(VOIR, "Cloud", "sessions:cloud sur %s : aucun clone local, docs/session-cloud.md non vérifié" % depot,
                     "vérifier que %s a docs/session-cloud.md à sa racine (copie de celui de bbr21/roadmap)" % depot)
    if not doc:
        return ligne(KO, "Cloud", "sessions:cloud sur %s, sans docs/session-cloud.md : une session cloud n'y trouve pas ses "
                     "règles" % depot, copier)
    return ligne(OK, "Cloud", "sessions:cloud sur %s, docs/session-cloud.md présent (réglage lu dans %s)" % (depot, ou))


def reglages_masques(main, home):
    """Une clé de .claude/roadmap.json sans effet dans les sessions ouvertes hors de `main` que couvre l'entrée
    du même projet dans roadmap-perso.json : là, l'entrée fait foi (cas d'adBricks, 2026-11-11). « À voir »."""
    eff, ou, entree = reglages_effectifs(main, home)
    if not eff or ou != ".claude/roadmap.json":
        return None
    racine = _chemin(main)
    soucis, gestes = [], []
    for src in entrees_du_projet(main, home):
        dehors = [m for m in _matchs(src) if not _dans(m, racine)]
        cles = [k for k in eff if k not in CLES_DE_PLACE and src.get(k) != eff[k]]
        if not dehors or not cles:
            continue
        soucis.append("%s de .claude/roadmap.json sans effet dans les sessions ouvertes de %s : l'entrée « %s » de %s "
                      "y fait foi" % (", ".join(cles), ", ".join(dehors), src["name"], PERSO))
        gestes.append("copier dans l'entrée « %s » de %s : %s" % (src["name"], PERSO, ", ".join(_cle(k, eff[k]) for k in cles)))
    if not soucis:
        return None
    return ligne(VOIR, "Réglages masqués", " ; ".join(soucis), " ; ".join(gestes))


def diagnostiquer(dossier, plugins="lire", home=None, avec_outils=True, gere=None, empreintes_de=None):
    """`empreintes_de` : la lecture des empreintes publiées ; par défaut le réseau, seulement quand le
    doctor juge les outils de la machine."""
    dossier = os.path.abspath(os.path.expanduser(dossier))
    home = home or os.path.expanduser("~")
    requis = charger_requis()
    if plugins == "lire":
        plugins = lire_plugins(home)
    if empreintes_de is None and avec_outils:
        empreintes_de = empreintes_publiees
    copies = empreintes([p for p in plugins or [] if _nom(p) == "roadmap"], empreintes_de) if empreintes_de else []
    lignes = []
    principal = ob.principal(dossier)
    if ob.travail_du_dossier(principal) == "projet":
        # Un dossier sans code (#76, #176) : ni GitHub, ni check.mjs, ni swiftui-pro ; la roadmap et ses champs.
        est_git = git(principal, "rev-parse", "--git-dir").returncode == 0
        if avec_outils:
            lignes += outils(requis, "projet", est_git)
        lignes.append(travail(principal))
        lignes += roadmap_projet(principal)
        lignes += [l for l in [regles_du_projet(principal), regles_de_l_outil(principal), axes_du_projet(principal, home),
                               cloud_du_projet(principal, home), reglages_masques(principal, home)] if l]
        lignes.append(design_system(principal))
        lignes += plugins_et_skills(requis, plugins, home, requis["projet"]["skills"], facultatif=True)
        lignes += copies
        lignes += [l for l in [python_intercepte(plugins, shutil.which if avec_outils else None)] if l]
        lignes.append(sec_default(home, gere))
        lignes.append(nom_utilisateur(home))
        return {"dossier": principal, "lignes": lignes,
                "ko": sum(1 for l in lignes if l["statut"] == KO), "a_voir": sum(1 for l in lignes if l["statut"] == VOIR)}
    if avec_outils:
        lignes += outils(requis)
    lignes.append(travail(principal))
    inconnu = reglages_inconnus(principal)
    if inconnu:
        lignes.append(inconnu)
    faits, main = depot(dossier)
    lignes += faits
    if git(dossier, "rev-parse", "--git-dir").returncode == 0:
        lignes += roadmap(main)
    lignes += [l for l in [regles_du_projet(main), regles_de_l_outil(main), axes_du_projet(main, home),
                           cloud_du_projet(main, home), reglages_masques(main, home)] if l]
    lignes.append(design_system(main))
    lignes += plugins_et_skills(requis, plugins, home)
    lignes += copies
    lignes += [l for l in [python_intercepte(plugins, shutil.which if avec_outils else None)] if l]
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
