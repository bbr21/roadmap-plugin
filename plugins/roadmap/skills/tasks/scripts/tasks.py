#!/usr/bin/env python3
"""Tenir la roadmap au quotidien (#158) : le contexte (règles, déclarations, prochain numéro), le
rapprochement d'une action avec les tâches du même sujet, puis l'écriture des opérations validées
(ajouter, compléter, redater, cocher sur preuve, abandonner, mettre en pause), essai à blanc d'abord, tout ou rien.

python3 tasks.py context FOLDER [--day YYYY-MM-DD] > context.json
python3 tasks.py match FOLDER --text "…" [--text "…"]
python3 tasks.py lots FOLDER       (#320 : les tâches ouvertes à verser l'une dans l'autre)
python3 tasks.py groupes FOLDER    (#438 : les tâches ouvertes d'un même thème à ranger sous une mère)
python3 tasks.py write FOLDER --operations operations.json [--apply] [--json]

`write` finit par le compte rendu (#232), en lignes de journal depuis #261 : une puce par tâche, son glyphe devant.

Python 3.9 et plus, bibliothèque standard seulement. Hérite du moteur d'écriture de l'audit
(`audit._Preparation`) et lit la grammaire par l'import de la skill onboarding : les trois skills
lisent et écrivent une ligne de la même façon.
"""

import csv
import datetime
import io
import json
import math
import os
import re
import subprocess
import sys
import unicodedata

ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ICI, "..", "..", "onboarding", "scripts"))
sys.path.insert(0, os.path.join(ICI, "..", "..", "audit", "scripts"))
import audit  # noqa: E402
import cout  # noqa: E402
import importer as im  # noqa: E402
import onboarding as ob  # noqa: E402

Erreur = im.Erreur

# Les sections de ROADMAP.md qui ne reçoivent pas de tâche.
SECTIONS_FERMEES = {"Grammaire d'une ligne", "Cap"}
# Part des mots d'une action retrouvés dans une tâche, pondérés par leur rareté (#255), à partir de
# laquelle elle couvre le même sujet ; et le nombre de mots partagés qu'il y faut (un seul suffit à une
# action d'un mot) : un nom rare seul ne fait pas d'une action neuve une tâche couverte.
SEUIL = 0.5
MOTS_PARTAGES_MIN = 2
# Le poids d'un mot que la roadmap ne porte nulle part : celui d'un mot fréquent, il ne rapproche rien.
POIDS_INCONNU = 1.0

# Le contrat d'operations.json, en anglais comme la skill (#158) ; le code garde le vocabulaire de l'audit.
OPS = {
    "add": {"op", "key", "label", "axis", "section", "parent", "note", "fields", "distinct", "zone"},
    "update": {"op", "id", "fields", "append"},
    "reschedule": {"op", "id", "due"},
    "done": {"op", "id", "date", "proof", "bilan"},
    "drop": {"op", "id", "reason", "bilan"},
    "pause": {"op", "id", "until", "reason"},
    "handoff": {"op", "id", "date", "proof", "delivered", "key", "label", "waiting", "src", "fields", "bilan"},
}
# Le bilan d'une clôture (#262), au contrat de `cowork.py roadmap close --bilan-b64` : ses colonnes, les
# valeurs admises du journal par défaut, la borne d'une ligne de conclusion.
BILAN_COLS = ("date", "id", "fait", "souci", "ressenti", "cause", "corrections", "note", "tokens", "sonnet")
BILAN_CLES = {"fait", "souci", "ressenti", "cause", "corrections", "note", "lieu", "type"}
JOURNAL_DEFAUT = "ROADMAP-bilans.csv"
RESSENTIS = ["fluide", "accroché", "bloqué"]
# Une liste fermée (#460) : « autre » n'y est plus, ses 59 bilans disaient surtout la charge du Mac, les sessions
# parallèles sur les mêmes fichiers et ce qui manque à la machine (VM cloud, shim, plugin absent).
CAUSES = ["aucune", "spec-floue", "attente-tiers", "bug-outil", "refait", "périmètre-élargi", "charge-mac",
          "conflit-parallèle", "environnement"]
# Un journal comptable (#460) : son en-tête porte `type`, que pose `tools/ranger_bilans.py`. Le bilan y est
# exigé, avec son type ; le lieu vient de la ligne (`lieu:cloud`, sinon mac) quand le bilan ne le dit pas.
BILAN_COMPTE = ("lieu", "type")
LIEUX = ["cloud", "mac"]
TYPES = ["code", "doc", "rendu", "sans-code"]
CONCLUSION_MAX = 140
# Un dossier Cowork dont `cowork.json` confie la roadmap au plugin (`"roadmap": "plugin-roadmap"`, #262).
COWORK_PLUGIN = "plugin-roadmap"
# La section où part une tâche en pause (#159) : sa date de reprise la range, aucune clé nouvelle.
SECTION_PAUSE = "Plus tard"
# Ce que `fields` ne pose jamais : le numéro, la session, la clôture ; `parent` d'un ajout passe par `parent`.
INTERDITS_AJOUT = {"id", "qui", "branche", "verrou", "fait", "parent"}
INTERDITS_COMPLETER = {"id", "qui", "branche", "verrou", "fait"}
# La suite d'une clôture partielle (#245) : l'opération pose elle-même son parent, son ordre, le tiers,
# la demande et la fiche.
INTERDITS_SUITE = INTERDITS_AJOUT | {"après", "attend", "src", "fiche"}
# Les questions qui attendent la personne (#232), au format de l'audit (#159) : leur genre, et sa raison dite.
RAISONS = {"conflict": "conflit", "undated": "date manquante", "late": "en retard", "partial_proof": "preuve partielle",
           "rhythm": "rythme", "reopen": "réouverture", "prio_on_child": "priorité sur un enfant", "structure": "structure",
           "subject": "même sujet", "name": "titre court", "merge": "même endroit", "followup": "déjà fait",
           "group": "même thème"}
# Verser une action dans une tâche ouverte (#320). Un lieu (fichier, fonction, commande, zone en mots) porté
# par plus de 3 tâches ouvertes et plus du quart d'entre elles est commun : il ne rapproche rien
# (`register.tsx` quand tout le nomme). Une tâche reste petite quand les deux libellés tiennent en
# 1 200 caractères ; sans lieu partagé en plus, le but se lit dans les mots du contexte, dès 0,5 comme #288.
LIEU_COMMUN_MIN = 3
LIEU_COMMUN_PART = 0.25
PETIT_MAX = 1200
SEUIL_CONTEXTE = 0.5
CANDIDATES_MAX = 2
# Ce qui se lit d'une fiche ou d'une spec, par fichier.
CONTEXTE_MAX = 20000
EXTENSIONS = r"py|tsx?|jsx?|mjs|cjs|md|json|sh|swift|csv|css|ya?ml|toml|html"
FICHIER_RE = re.compile(r"(?<![\w/.-])((?:[\w.-]+/)*[\w-]+(?:\.[\w-]+)*\.(?:%s))(?![\w-])" % EXTENSIONS)
SYMBOLE_RE = re.compile(r"(?<![\w.])([a-z][a-z0-9]*[A-Z][A-Za-z0-9]*|[a-z][a-z0-9]*_[a-z0-9_]+)(?!\w)")
CODE_RE = re.compile(r"`([^`\n]+)`")
CITE_RE = re.compile(r"#(\d+)")
# Une tâche à part choisie par la personne (#288) : la raison que porte l'option « Tâche à part ».
A_PART = "tâche à part, choisie par la personne"
# Le titre court proposé à une mère sans `nom:` (#288) : ses premiers mots, comme `fallbackTitle` du panneau.
NOM_MAX = 40
NOM_MOTS = 5
# Le libellé d'une tâche dans le compte rendu : coupé au mot au-delà.
LIBELLE_COURT = 60
# Une communication (#242) : un segment du chemin qui la nomme (`emails/`, `message-martial.md`), ou des
# en-têtes d'email ; partie quand son « Statut : » dit « envoyé ». La même règle que `commState` du panneau.
MOTS_COMM = {"email", "emails", "mail", "mails", "message", "messages", "msg", "invitation", "invitations", "invite",
             "invites", "courrier", "courriers", "lettre", "lettres", "letter", "letters", "slack", "sms", "dm"}
ETIQUETTES = {"a": "to", "to": "to", "destinataire": "to", "destinataires": "to", "objet": "subject",
              "sujet": "subject", "subject": "subject", "statut": "status", "status": "status"}
# Toutes les étiquettes d'un en-tête d'email, pour couper une ligne de plusieurs champs (#264).
ETIQUETTES_TOUTES = set(ETIQUETTES) | {"cc", "cci", "bcc", "de", "from", "pieces jointes", "piece jointe", "pj",
                                       "attachments", "attachment"}
# Une étiquette d'en-tête, un nom de script compris (« Contrôle email_check.py --recap : OK », #264).
EN_TETE = re.compile(r"^\s*(?:\*\*|__)?([^\W\d_][\w .-]{0,40}?)\s*:\s*(?:\*\*|__)?\s*(.*)$")
# Plusieurs champs sur une ligne (« **À :** … · **Cc :** … », #264).
SEP_CHAMPS = re.compile(r"\s+·\s+")
NON_PARTI = re.compile(r"\b(?:non|pas|not)\s+(?:encore\s+|yet\s+)?(?:envoye|sent)\b|\bunsent\b")
PARTI = re.compile(r"\b(?:envoye|sent)\b")
LISIBLE = (".md", ".markdown", ".txt")
LISIBLE_MAX = 262144


def _lire(chemin):
    return audit._lire_fichier(chemin) or ""


def _sans_parent(t):
    return (t.get("parent") or "-").lstrip("#")


def qui_attend(attend):
    """Qui une tâche attend, sans la précision entre parenthèses : « Jason (devis) » → « Jason »."""
    return re.sub(r"\s*\([^)]*\)?", "", attend or "").strip()


def est_un_tiers(attend, me):
    """Un tiers (#245) : une personne ou une organisation qui n'est ni un des noms `me`, ni une tâche."""
    qui = qui_attend(attend)
    if qui in ("", "-") or re.match(r"^(id:|#)\d+$", qui):
        return False
    return audit._sans_accents(qui).lower() not in {audit._sans_accents(m).lower() for m in me}


def _jj_mm(iso):
    return "%s/%s" % (iso[8:10], iso[5:7])


def _aparte(libelle, texte):
    """#285 : un texte ajouté par l'écriture va dans le libellé, entre parenthèses (un aparté, que la
    règle « une ligne, une action » de #289 ne compte pas), jamais après le bloc de champs, que le
    doctor de cowork refuse hors grammaire."""
    texte = audit._propre(texte)
    return "%s (%s)" % (libelle, texte) if texte else libelle


def _court(libelle, n=LIBELLE_COURT):
    if len(libelle) <= n:
        return libelle
    return libelle[:n].rsplit(" ", 1)[0].rstrip(" ,;:") + "…"


def _cowork(dossier):
    """Le `cowork.json` du dossier, ou None."""
    try:
        with open(os.path.join(dossier, "cowork.json"), encoding="utf-8") as f:
            cfg = json.load(f)
        return cfg if isinstance(cfg, dict) else None
    except (OSError, ValueError):
        return None


def journal_de_bilan(dossier, rdir):
    """Le journal des bilans (#262) : `bilan.log` de `cowork.json`, à côté de lui, et les valeurs
    admises de ses colonnes ; sinon `ROADMAP-bilans.csv` à côté de la roadmap. `exige` : un dossier
    Cowork qui confie sa roadmap au plugin demande un bilan à chaque clôture, comme `cowork.py`."""
    cfg = _cowork(dossier) or {}
    out = {"chemin": os.path.join(rdir, JOURNAL_DEFAUT), "ressentis": RESSENTIS, "causes": CAUSES,
           "exige": cfg.get("roadmap") == COWORK_PLUGIN, "comptable": False}
    b = cfg.get("bilan")
    if isinstance(b, dict) and isinstance(b.get("log"), str) and b["log"].strip():
        log = b["log"].strip()
        racine = os.path.realpath(dossier)
        chemin = os.path.realpath(os.path.join(racine, log))
        if os.path.isabs(log) or ".." in log.replace("\\", "/").split("/") or not chemin.startswith(racine + os.sep):
            raise Erreur("le journal des bilans « %s » de cowork.json sort du dossier : rien ne s'écrit" % log)
        out["chemin"] = os.path.join(dossier, log)
        spec = (cfg.get("logs") or {}).get(b["log"]) if isinstance(cfg.get("logs"), dict) else None
        colonnes = spec.get("columns") if isinstance(spec, dict) else None
        for cle, nom in (("ressentis", "ressenti"), ("causes", "cause")):
            enum = next((c.get("enum") for c in colonnes or [] if isinstance(c, dict) and c.get("name") == nom), None)
            if isinstance(enum, list) and enum:
                out[cle] = [str(x) for x in enum]
        return out
    entete = next(csv.reader(io.StringIO(audit._lire_fichier(out["chemin"]) or "")), None) or []
    if "type" in entete:
        out.update(comptable=True, exige=True)
    return out


# ---------------------------------------------------------------- envoi d'une communication (#242)


def _plie(texte):
    return "".join(c for c in unicodedata.normalize("NFD", texte) if not unicodedata.combining(c)).lower().strip()


def _en_tetes(texte):
    """Les en-têtes d'un brouillon (#236) : front matter, ou lignes « Étiquette : valeur » en tête, un titre `#`
    avant elles toléré, plusieurs champs sur une ligne séparés par « · » (#264)."""
    lignes = texte.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    vus = {}
    i = 0
    while i < len(lignes) and not lignes[i].strip():
        i += 1
    if i < len(lignes) and re.match(r"#\s+", lignes[i]):
        i += 1
        while i < len(lignes) and not lignes[i].strip():
            i += 1
    if i < len(lignes) and lignes[i].strip() == "---":
        fin = next((k for k in range(i + 1, len(lignes)) if lignes[k].strip() == "---"), None)
        bloc = lignes[i + 1:fin] if fin is not None else []
        motif = re.compile(r"^\s*([^\W\d_][^\W\d_ -]*?)\s*:\s*(.*)$")
    else:
        bloc, motif = [], EN_TETE
        for l in lignes[i:]:
            if l.strip() and not EN_TETE.match(l):
                break
            morceaux = SEP_CHAMPS.split(l)
            plusieurs = len(morceaux) > 1 and all(
                (m := EN_TETE.match(x)) and _plie(m.group(1)) in ETIQUETTES_TOUTES for x in morceaux)
            bloc.extend(morceaux if plusieurs else [l])
    for l in bloc:
        m = motif.match(l)
        cle = ETIQUETTES.get(_plie(m.group(1))) if m else None
        valeur = m.group(2).strip().strip("\"'") if m else ""
        if cle and valeur:
            vus[cle] = valeur
    return vus


def etat_envoi(ecrit, texte, existe):
    """`none` (pas une communication, ou illisible), `unsent` ou `sent` : la règle de `commState`."""
    nomme = any(w in MOTS_COMM for w in re.split(r"[^a-z0-9]+", _plie("/".join(ecrit.split("/")[-2:]))))
    if texte is None:
        return "unsent" if nomme and not existe else "none"
    vus = _en_tetes(texte)
    if not nomme and "to" not in vus and "subject" not in vus:
        return "none"
    statut = _plie(vus.get("status", ""))
    # « brouillon » ou « draft » sans « envoyé » : pas parti ; avec, il est cité (« corps identique au brouillon », #264).
    return "sent" if statut and not NON_PARTI.search(statut) and PARTI.search(statut) else "unsent"


def envois_en_attente(livrables, bases):
    """Les livrables (`livrable:` d'une ligne) qui sont des communications pas encore parties."""
    attente = []
    for ecrit in [x.strip() for x in (livrables or "").split(",") if x.strip()]:
        texte, existe = None, False
        for base in ([""] if os.path.isabs(ecrit) else bases):
            chemin = os.path.join(base, ecrit)
            if os.path.isfile(chemin):
                existe = True
                if chemin.lower().endswith(LISIBLE) and os.path.getsize(chemin) <= LISIBLE_MAX:
                    texte = _lire(chemin)
                break
        if etat_envoi(ecrit, texte, existe) == "unsent":
            attente.append(ecrit)
    return attente


# ---------------------------------------------------------------- contexte et rapprochement


def contexte(dossier, jour=None, perso="~/.claude/roadmap-perso.json"):
    """Le relevé de l'audit, plus ce qu'il faut pour tenir la roadmap : les déclarations du projet,
    le prochain numéro, les axes, les sections ouvertes, la date de chaque parent (celle de son
    prochain enfant ouvert), les valeurs admises des clés déclarées et les tâches closes."""
    c = audit.releve(dossier, jour, perso)
    texte_o, texte_f = _lire(c["roadmap"]), _lire(c["fait"])
    ids = [int(im.champ(t, "id")) for texte in (texte_o, texte_f)
           for t in im.lire_checklist(texte)[0] if (im.champ(t, "id") or "").isdigit()]
    parents = {}
    for t in c["taches"]:
        if t["parent"]:
            due = t["champs"].get("due")
            p = parents.setdefault(t["parent"], {"date": None})
            if due and (p["date"] is None or due < p["date"]):
                p["date"] = due
    cfg = audit._cfg(c["dossier"])
    cles = cfg.get("cles") if isinstance(cfg.get("cles"), dict) else {}
    closes = [t for t in im.lire_checklist(texte_o)[0] if t["fait"]] + im.lire_checklist(texte_f)[0]
    livres = _livres(c["dossier"], os.path.dirname(c["roadmap"]))
    me_projet = cfg.get("me")
    me_projet = [me_projet] if isinstance(me_projet, str) else [m for m in me_projet or [] if isinstance(m, str)]
    c.update({
        # Le nom de la roadmap d'abord (#255) : `qui:` d'une ligne neuve le prend.
        "me": list(dict.fromkeys(me_projet + list(c.get("me") or []))),
        "prochain_id": max(ids or [0]) + 1,
        "axes": ob._axes_declares(texte_o),
        "sections": [l[3:].strip() for l in texte_o.split("\n")
                     if l.startswith("## ") and l[3:].strip() not in SECTIONS_FERMEES],
        "parents": parents,
        "cles_valeurs": {k: v for k, v in cles.items() if isinstance(v, list)},
        # #320 : ce qui a été fait, pour reconnaître une suite : la fiche, la spec et le bilan d'une tâche close.
        "closes": [{"id": im.champ(t, "id"), "libelle": t["libelle"], "fait": im.champ(t, "fait"),
                    "champs": {k: im.champ(t, k) for k in ("fiche", "spec") if im.champ(t, k)},
                    "livre": livres.get(im.champ(t, "id") or "")} for t in closes],
        "declarations": ob.declarations(c["dossier"], cfg),
    })
    return c


def _livres(dossier, rdir):
    """Ce que chaque tâche close a livré, d'après son bilan (#262) : la colonne `fait`, la dernière ligne
    l'emporte. Un journal absent ou illisible ne donne rien."""
    try:
        chemin = journal_de_bilan(dossier, rdir)["chemin"]
        with open(chemin, encoding="utf-8", newline="") as f:
            return {r.get("id", ""): (r.get("fait") or "").strip() for r in csv.DictReader(f) if (r.get("fait") or "").strip()}
    except (OSError, Erreur, csv.Error, UnicodeDecodeError):
        return {}


def poids_des_mots(libelles):
    """Le poids de chaque mot des libellés (#255) : sa rareté, ln(1 + N/df)², N les libellés, df ceux
    qui le portent. Un nom propre, un code, un fournisseur pèsent lourd ; « point », « envoyer », peu."""
    df = {}
    for l in libelles:
        for w in audit.mots(l):
            df[w] = df.get(w, 0) + 1
    n = len(libelles)
    return {w: math.log(1 + n / c) ** 2 for w, c in df.items()}


def rapprocher(ctx, texte, n=5, zone=None, apres=None):
    """Les tâches ouvertes et closes du même sujet qu'une action, par la part pondérée de ses mots
    qu'elles portent (celle d'un enfant compte le libellé de son parent), les mots partagés, et le
    cas probable. Un mot pèse sa rareté dans la roadmap (#255). Plus, par le contexte des tâches
    ouvertes et la zone de l'action, celles où la verser (`a_verser`, #320). Et `en_cours_memes_fichiers`
    (#366) : les tâches prises dont la branche change, ou dont le contexte nomme, un fichier que l'action
    touche, avec `meme_but` quand l'action les cite ou leur ressemble. Claude tranche."""
    cible = audit.mots(texte)
    par_id = {t["id"]: t for t in ctx["taches"]}
    closes_ctx = ctx.get("closes") or []
    poids = poids_des_mots([t["libelle"] for t in ctx["taches"]] + [t["libelle"] for t in closes_ctx])
    total = sum(poids.get(w, POIDS_INCONNU) for w in cible)

    def mesure(libelle):
        communs = cible & audit.mots(libelle)
        return round(sum(poids[w] for w in communs) / total, 2) if total else 0.0, sorted(communs)

    ouvertes = []
    for t in ctx["taches"]:
        p = t["parent"]
        role = "enfant" if p else ("parent" if t["enfants"] else "seule")
        s, communs = mesure(t["libelle"] + " " + (par_id[p]["libelle"] if p in par_id else ""))
        if s > 0:
            ouvertes.append({"id": t["id"], "libelle": t["libelle"], "role": role, "parent": p, "score": s,
                             "communs": communs, "due": t["champs"].get("due")})
    closes = []
    for t in closes_ctx:
        s, communs = mesure(t["libelle"])
        if s > 0:
            closes.append(dict(t, score=s, communs=communs))
    for liste in (ouvertes, closes):
        liste.sort(key=lambda t: (-t["score"], int(t["id"]) if (t["id"] or "").isdigit() else 0))
    assez = min(MOTS_PARTAGES_MIN, len(cible))

    def couvre(liste):
        return any(t["score"] >= SEUIL and len(t["communs"]) >= assez for t in liste)

    if couvre(ouvertes):
        cas = "couverte_ou_a_etoffer"
    elif couvre(closes):
        cas = "deja_faite"
    else:
        cas = "nouvelle"
    return {"texte": texte, "ouvertes": ouvertes[:n], "closes": closes[:n], "cas_probable": cas,
            "a_verser": a_verser(ctx, texte, zone, apres),
            "en_cours_memes_fichiers": en_cours_memes_fichiers(ctx, texte, zone, apres),
            "faites_au_meme_endroit": faites_au_meme_endroit(ctx, texte, zone, apres)}


# ---------------------------------------------------------------- le contexte d'une tâche (#320)


def _norme(texte):
    """Un texte comparable : sans accents, en minuscules, guillemets et espaces réduits."""
    t = audit._sans_accents(texte or "").lower()
    return re.sub(r"\s+", " ", re.sub(r"[«»“”\"'’]", " ", t)).strip()


def _fichier_seul(texte):
    m = FICHIER_RE.fullmatch(texte.strip())
    return os.path.basename(m.group(1)).lower() if m else None


def _commande(contenu):
    """Les lieux d'un bout de code : une commande (`git add -A`, `release.py release`) donne « git add »
    et sa famille « git » ; un identifiant seul (`pruneBranches`) se donne lui-même."""
    mots, sortie = contenu.split(), {}
    if len(mots) == 1 and re.fullmatch(r"[A-Za-z_][\w-]{2,}", mots[0]):
        sortie[mots[0].lower()] = "zone"
    elif len(mots) >= 2 and re.fullmatch(r"[a-z][\w.-]*", mots[0]):
        fichier = _fichier_seul(mots[0])
        if fichier or any(m.startswith("-") for m in mots[1:]):
            if re.fullmatch(r"[a-z][\w-]*", mots[1]):
                sortie["%s %s" % (mots[0].lower(), mots[1].lower())] = "zone"
            sortie[fichier or mots[0].lower()] = "fichier" if fichier else "zone"
    return sortie


def lieux_du_texte(texte):
    """Les lieux qu'un texte nomme (#320), {lieu: genre} : un fichier (`fichier`, par son nom de base),
    une fonction, un identifiant ou une commande (`zone`)."""
    texte = texte or ""
    sortie = {}
    for m in SYMBOLE_RE.finditer(texte):
        sortie[m.group(1).lower()] = "zone"
    for m in CODE_RE.finditer(texte):
        sortie.update(_commande(m.group(1)))
    for m in FICHIER_RE.finditer(texte):
        sortie[os.path.basename(m.group(1)).lower()] = "fichier"
    return sortie


def lieux_de_zone(zone):
    """Les lieux d'une zone donnée par l'écrivain (#320) : chaque entrée entière (un fichier par son nom
    de base, une expression en mots), plus ce qu'elle nomme en code."""
    sortie = {}
    for entree in zone or []:
        entree = audit._propre(entree)
        if not entree:
            continue
        fichier = _fichier_seul(entree)
        sortie[fichier or _norme(entree)] = "fichier" if fichier else "zone"
        sortie.update(lieux_du_texte(entree))
        if "`" not in entree:
            sortie.update(_commande(entree))
    return sortie


def _lire_borne(chemin):
    try:
        with open(chemin, encoding="utf-8") as f:
            return f.read(CONTEXTE_MAX)
    except (OSError, UnicodeDecodeError):
        return ""


def contexte_tache(dossier, t):
    """Ce qu'on fait d'une tâche ouverte (#320) : son libellé et son nom, sa fiche et sa spec lues sur
    disque (`spec.md` et `plan.md` d'un dossier), et les lieux qu'ils nomment. Une fiche ou une spec
    introuvable se passe."""
    champs = t.get("champs") or {}
    morceaux = [t.get("libelle") or "", champs.get("nom") or "", t.get("livre") or ""]
    lus = {"fiche": None, "spec": None}
    for cle in ("fiche", "spec"):
        v = audit._propre(champs.get(cle))
        if not v or v == "…":
            continue
        chemin = os.path.join(dossier, v)
        fichiers = [chemin] if os.path.isfile(chemin) else [os.path.join(chemin, f) for f in ("spec.md", "plan.md")]
        textes = [_lire_borne(f) for f in fichiers if os.path.isfile(f)]
        if any(textes):
            lus[cle] = v
            morceaux += textes
    texte = "\n".join(morceaux)
    return dict(lus, texte=texte, norme=" %s " % _norme(texte), lieux=lieux_du_texte(texte))


def _porte(c, lieu):
    """Une tâche porte un lieu quand elle le nomme en code, ou que son contexte le dit en mots entiers."""
    return lieu in c["lieux"] or re.search(r"(?<!\w)%s(?!\w)" % re.escape(lieu), c["norme"]) is not None


def _lieux_et_chaine(texte, zone, apres):
    lieux = dict(lieux_de_zone(zone))
    lieux.update(lieux_du_texte(texte))
    cites = set(CITE_RE.findall(texte or ""))
    if apres not in (None, "", "-"):
        try:
            cites |= set(_refs(apres, "après"))
        except Erreur:
            pass
    return lieux, cites


def _au_meme_endroit(dossier, taches, texte, lieux, cites, feuilles):
    """Les tâches (ouvertes, ou closes) au même endroit qu'une action et au même but, avec leurs raisons ;
    `feuilles` : seulement celles où le résultat reste petit (une feuille, 1 200 caractères à deux)."""
    if not lieux or not taches:
        return []
    contextes = {t["id"]: contexte_tache(dossier, t) for t in taches}
    porteurs = {l: sum(1 for c in contextes.values() if _porte(c, l)) for l in lieux}
    borne = max(LIEU_COMMUN_MIN, LIEU_COMMUN_PART * len(taches))
    rares = {l: g for l, g in lieux.items() if porteurs[l] <= borne}
    cible = audit.mots(texte)
    poids = poids_des_mots([c["texte"] for c in contextes.values()])
    total = sum(poids.get(w, POIDS_INCONNU) for w in cible)
    sortie = []
    for t in taches:
        c = contextes[t["id"]]
        communs = sorted(l for l in rares if _porte(c, l))
        zones = [l for l in communs if rares[l] == "zone"]
        if not zones:
            continue
        fichiers = [l for l in communs if rares[l] == "fichier"]
        mots_communs = cible & audit.mots(c["texte"])
        score = round(sum(poids[w] for w in mots_communs) / total, 2) if total else 0.0
        chaine = t["id"] in cites
        if not (len(communs) >= 2 or chaine or (score >= SEUIL_CONTEXTE and len(mots_communs) >= 2)):
            continue
        petit = not t.get("enfants") and len(t["libelle"]) + len(texte or "") + 3 <= PETIT_MAX
        if feuilles and not petit:
            continue
        champs = t.get("champs") or {}
        prise = champs.get("branche") if champs.get("qui") and champs.get("branche") else None
        sortie.append({"id": t["id"], "libelle": t["libelle"], "lieux_communs": zones, "fichiers_communs": fichiers,
                       "chaine": chaine, "score_contexte": score, "petit": petit, "branche": prise,
                       "fiche": c["fiche"], "spec": c["spec"], "parent": t.get("parent"),
                       "apres": champs.get("après"), "src": champs.get("src"), "livre": t.get("livre")})
    sortie.sort(key=lambda x: (-len(x["lieux_communs"]) - len(x["fichiers_communs"]), not x["chaine"],
                               x["branche"] is not None, -x["score_contexte"], int(x["id"]) if x["id"].isdigit() else 0))
    return sortie[:CANDIDATES_MAX]


def a_verser(ctx, texte, zone=None, apres=None):
    """#320 : les tâches ouvertes où verser une action, quand trois choses tiennent : même endroit (un lieu
    de genre zone partagé et non commun ; un fichier seul jamais), même but ou suite directe (deux lieux
    partagés, un lien de chaîne, ou 0,5 des mots de l'action dans le contexte avec deux mots communs),
    résultat petit (une feuille, les deux libellés en 1 200 caractères). Deux au plus, rangées par lieux,
    chaîne, tâche libre d'abord, mots. Chacune avec ses raisons : la personne juge."""
    lieux, cites = _lieux_et_chaine(texte, zone, apres)
    return _au_meme_endroit(ctx["dossier"], ctx["taches"], texte, lieux, cites, feuilles=True)


def fichiers_de_branche(dossier, branche):
    """#366 : les fichiers qu'une branche change (noms de base, en minuscules), par `git diff --name-only
    <base>...<branche>`, base `main` puis `master`. Toute erreur (git absent, branche inconnue, pas un dépôt) : vide."""
    branche = audit._propre(branche)
    if not branche or branche.startswith("-"):
        return set()
    for base in ("main", "master"):
        try:
            r = subprocess.run(["git", "-C", dossier, "diff", "--name-only", "%s...%s" % (base, branche)],
                               capture_output=True, text=True, timeout=10)
        except (OSError, subprocess.SubprocessError, ValueError):
            return set()
        if r.returncode == 0:
            return {os.path.basename(l).lower() for l in r.stdout.splitlines() if l.strip()}
    return set()


def en_cours_memes_fichiers(ctx, texte, zone=None, apres=None):
    """#366 : les tâches ouvertes prises (`qui:` et `branche:`) dont la branche change, ou dont le contexte
    nomme, un fichier que l'action touche (genre `fichier` de sa zone et de son texte). `meme_but` : l'action
    cite la tâche, ou l'action et le contexte citent un même `#N`, ou le score de contexte atteint
    SEUIL_CONTEXTE avec deux mots communs. Rangées par but puis nombre de fichiers, CANDIDATES_MAX au plus."""
    lieux, cites = _lieux_et_chaine(texte, zone, apres)
    fichiers = {l for l, g in lieux.items() if g == "fichier"}
    prises = [t for t in ctx["taches"] if t["champs"].get("qui") and t["champs"].get("branche")]
    if not fichiers or not prises:
        return []
    contextes = {t["id"]: contexte_tache(ctx["dossier"], t) for t in ctx["taches"]}
    cible = audit.mots(texte)
    poids = poids_des_mots([c["texte"] for c in contextes.values()])
    total = sum(poids.get(w, POIDS_INCONNU) for w in cible)
    sortie = []
    for t in prises:
        c = contextes[t["id"]]
        branche = t["champs"]["branche"]
        du_contexte = {l for l, g in c["lieux"].items() if g == "fichier"}
        communs = sorted(fichiers & (fichiers_de_branche(ctx["dossier"], branche) | du_contexte))
        if not communs:
            continue
        mots = cible & audit.mots(c["texte"])
        score = round(sum(poids[w] for w in mots) / total, 2) if total else 0.0
        meme_but = (t["id"] in cites or bool(cites & set(CITE_RE.findall(c["texte"])))
                    or (score >= SEUIL_CONTEXTE and len(mots) >= 2))
        sortie.append({"id": t["id"], "libelle": t["libelle"], "branche": branche, "fichiers_communs": communs,
                       "meme_but": meme_but})
    sortie.sort(key=lambda x: (not x["meme_but"], -len(x["fichiers_communs"]),
                               int(x["id"]) if x["id"].isdigit() else 0))
    return sortie[:CANDIDATES_MAX]


def faites_au_meme_endroit(ctx, texte, zone=None, apres=None):
    """#320 : ce qui a été fait. Les tâches closes au même endroit et au même but qu'une action (leur
    libellé, leur bilan, leur fiche ou leur spec) : l'action en est la suite, ou elle est déjà faite."""
    lieux, cites = _lieux_et_chaine(texte, zone, apres)
    closes = [dict(t, champs=t.get("champs") or {}) for t in ctx.get("closes") or [] if t.get("id")]
    return _au_meme_endroit(ctx["dossier"], closes, texte, lieux, cites, feuilles=False)


def lots(ctx):
    """#320 : un regard extérieur sur toutes les tâches ouvertes. Chaque feuille rejouée comme une action,
    avec les lieux que son contexte nomme pour zone : deux tâches au même endroit, au même but, au résultat
    petit, deviennent une question (kind `merge`, sur la tâche versée) : « Verser #V dans #R » (`append` à
    #R, `drop` de #V), par sa session quand #R est prise (`relay`), ou « Les garder à part ». La tâche versée
    est la plus récente des deux libres, ou la libre quand l'autre est prise ; deux tâches prises, rien."""
    par_id = {t["id"]: t for t in ctx["taches"]}
    paires = {}
    for t in ctx["taches"]:
        if t["enfants"]:
            continue
        c = contexte_tache(ctx["dossier"], t)
        autres = dict(ctx, taches=[x for x in ctx["taches"] if x["id"] != t["id"]])
        for cand in a_verser(autres, t["libelle"], list(c["lieux"]), t["champs"].get("après")):
            paires.setdefault(frozenset((t["id"], cand["id"])), cand)

    def prise(t):
        return t["champs"].get("branche") if t["champs"].get("qui") and t["champs"].get("branche") else None

    def rang(i):
        return int(i) if i.isdigit() else 0

    par_versee = {}
    for paire, raisons in paires.items():
        a, b = sorted(paire, key=rang)
        if prise(par_id[a]) and prise(par_id[b]):
            continue
        r, v = (b, a) if prise(par_id[b]) else (a, b)
        par_versee.setdefault(v, []).append((r, raisons))
    questions = []
    for v in sorted(par_versee, key=rang):
        tv = par_id[v]
        recus = sorted(par_versee[v], key=lambda x: (prise(par_id[x[0]]) is not None, rang(x[0])))[:CANDIDATES_MAX]
        options = []
        for r, _ in recus:
            tr = par_id[r]
            abandon = {"op": "drop", "id": v, "reason": "versée dans #%s" % r,
                       "bilan": {"fait": "versée dans #%s" % r, "souci": "", "ressenti": "fluide", "cause": "aucune",
                                 "corrections": "0",
                                 "note": "Même endroit et même but que #%s : l'action y est versée (#320)." % r}}
            if prise(tr):
                options.append({"label": "Verser #%s dans #%s, tenue par la session de %s" % (v, r, prise(tr)),
                                "operations": [abandon], "relay": {"id": r, "branche": prise(tr), "action": tv["libelle"]}})
                continue
            op = {"op": "update", "id": r, "append": tv["libelle"]}
            src = tv["champs"].get("src")
            if src:
                op["fields"] = {"src": "%s ; %s" % (tr["champs"]["src"], src) if tr["champs"].get("src") else src}
            options.append({"label": "Verser #%s dans #%s" % (v, r), "operations": [op, abandon]})
        options[0] = dict(options[0], label=options[0]["label"] + " (recommandé)")
        options.append({"label": "Les garder à part", "operations": []})
        r0, raisons = recus[0]
        questions.append({
            "key": "merge-%s" % v, "task": v, "kind": "merge",
            "question": "#%s « %s » et #%s « %s » touchent le même endroit (%s) ; verser #%s dans #%s ?"
                        % (v, _court(tv["libelle"]), r0, _court(par_id[r0]["libelle"]),
                           ", ".join(raisons["lieux_communs"] + raisons["fichiers_communs"]), v, r0),
            "options": options})
    return questions


# ---------------------------------------------------------------- un sujet, une tâche (#288)


def titre_court(libelle):
    """Le titre court proposé à une mère : ses cinq premiers mots, coupés au mot sous 40 caractères."""
    mots, sortie = libelle.replace("`", "").split()[:NOM_MOTS], []
    for m in mots:
        if len(" ".join(sortie + [m])) > NOM_MAX:
            break
        sortie.append(m)
    return " ".join(sortie) or libelle[:NOM_MAX]


def _sans_ref(v):
    return v in (None, "", "-")


def _refs_op(op):
    """Les numéros et clés qu'une opération vise : son parent et ses `après:`."""
    champs = op.get("fields") or {}
    refs = {str(x).lstrip("#") for x in (op.get("parent"), champs.get("parent")) if not _sans_ref(x)}
    apres = champs.get("après")
    if apres is not None:
        try:
            refs |= set(_refs(apres, "après"))
        except Erreur:
            pass
    return refs


def _sans_cle_apres(op, cle):
    champs = dict(op.get("fields") or {})
    if "après" in champs:
        try:
            champs["après"] = [x for x in _refs(champs["après"], "après") if x != cle]
        except Erreur:
            pass
    return dict(op, fields=champs) if op.get("fields") is not None else op


def un_sujet(ctx, operations, deja=frozenset()):
    """#288 : les ajouts sans parent que `rapprocher` trouve couverts par une tâche ouverte (score ≥ 0,5
    et deux mots communs), sauf `distinct`, retenus avec ce qui les vise dans le lot ; chacun devient une
    question (kind `subject`) : « Sous #N (recommandé) », « Tâche à part », « Ne rien ajouter ». Une tâche
    que le lot close ne couvre rien. Rend (clés retenues, questions)."""
    fermees = {str(op.get("id")) for op in operations if op.get("op") in ("drop", "done", "handoff")}
    ctx_ouvert = dict(ctx, taches=[t for t in ctx["taches"] if t["id"] not in fermees])
    retenues, questions = set(), []
    for a in operations:
        if (a.get("op") != "add" or not _sans_ref(a.get("parent")) or audit._propre(a.get("distinct"))
                or a.get("key") in retenues or a.get("key") in deja):
            continue
        libelle = audit._propre(a.get("label"))
        r = rapprocher(ctx_ouvert, libelle)
        if r["cas_probable"] != "couverte_ou_a_etoffer":
            continue
        assez = min(MOTS_PARTAGES_MIN, len(audit.mots(libelle)))
        meilleure = next(t for t in r["ouvertes"] if t["score"] >= SEUIL and len(t["communs"]) >= assez)
        cible = meilleure["parent"] if meilleure["role"] == "enfant" and meilleure["parent"] else meilleure["id"]
        k = a.get("key")
        groupe, cles = [a], {k}
        for op in operations:
            if op is not a and _refs_op(op) & cles:
                groupe.append(op)
                if op.get("key"):
                    cles.add(op["key"])
        retenues |= cles
        enfants = [op for op in groupe if op is not a and str(op.get("parent") or "").lstrip("#") == k]
        if enfants:
            # Deux niveaux au plus : ses enfants passent sous la cible, la mère proposée s'efface.
            sous = [dict(_sans_cle_apres(op, k), parent=cible) if op in enfants else _sans_cle_apres(op, k)
                    for op in groupe if op is not a]
        else:
            sous = [dict({c: v for c, v in a.items() if c not in ("axis", "section", "distinct")}, parent=cible)] + groupe[1:]
        a_part = [dict(a, distinct=A_PART)] + groupe[1:]
        questions.append({
            "key": "subject-%s" % k, "about": libelle, "kind": "subject",
            "question": "« %s » : même sujet que #%s « %s » ; l'ajouter sous #%s, ou en tâche à part ?"
                        % (_court(libelle), meilleure["id"], _court(meilleure["libelle"]), cible),
            "options": [{"label": "Sous #%s (recommandé)" % cible, "operations": sous},
                        {"label": "Tâche à part", "operations": a_part},
                        {"label": "Ne rien ajouter : #%s couvre déjà l'action" % meilleure["id"], "operations": []}]})
    return retenues, questions


def _question_memes_fichiers(k, libelle, texte, ajout, entrees):
    """#366 : l'action touche les fichiers d'une tâche en cours (kind `merge`) : « Verser dans #N, tenue par la
    session de <branche> » (`relay`, sans opération) pour chacune, puis « Tâche à part » ; « (recommandé) » sur
    la première quand elle a le même but, sinon sur « Tâche à part »."""
    options = [{"label": "Verser dans #%s, tenue par la session de %s" % (e["id"], e["branche"]),
                "operations": [], "relay": {"id": e["id"], "branche": e["branche"], "action": texte}} for e in entrees]
    a_part = {"label": "Tâche à part", "operations": [dict(ajout, distinct=A_PART)]}
    if entrees[0]["meme_but"]:
        options[0]["label"] += " (recommandé)"
    else:
        a_part["label"] += " (recommandé)"
    e = entrees[0]
    return {"key": "merge-%s" % k, "about": libelle, "kind": "merge",
            "question": "« %s » touche les fichiers de #%s en cours (%s, session de %s) ; la verser dans #%s, ou en tâche à part ?"
                        % (_court(libelle), e["id"], ", ".join(e["fichiers_communs"]), e["branche"], e["id"]),
            "options": options + [a_part]}


def un_lot(ctx, operations, retenues):
    """#320 : un ajout sans parent, sans `distinct`, que #288 n'a pas retenu et que rien dans le lot ne vise,
    devient une question (kind `merge`) quand `a_verser` lui trouve une tâche ouverte : « Verser dans #N »
    (`update` avec `append`, et sa `src:` jointe), ou, pour une tâche prise, l'action renvoyée à sa session
    (`relay`, sans opération) ; puis « Tâche à part ». Une tâche que le lot close ne reçoit rien."""
    fermees = {str(op.get("id")) for op in operations if op.get("op") in ("drop", "done", "handoff")}
    ctx_ouvert = dict(ctx, taches=[t for t in ctx["taches"] if t["id"] not in fermees])
    visees = set().union(*(_refs_op(op) for op in operations)) if operations else set()
    cles, questions = set(), []
    for a in operations:
        k = a.get("key")
        if (a.get("op") != "add" or not _sans_ref(a.get("parent")) or audit._propre(a.get("distinct"))
                or k in retenues or k in visees):
            continue
        libelle = audit._propre(a.get("label"))
        texte = _aparte(libelle, audit._propre(a.get("note")))
        zone = a.get("zone")
        if zone is not None and (not isinstance(zone, list) or not all(isinstance(z, str) for z in zone)):
            raise Erreur("ajout « %s » : zone est une liste de lieux (fichiers, fonctions, zones en mots)" % libelle[:40])
        apres = (a.get("fields") or {}).get("après")
        candidates = a_verser(ctx_ouvert, texte, zone, apres)
        if not candidates:
            en_cours = en_cours_memes_fichiers(ctx_ouvert, texte, zone, apres)
            if en_cours:
                questions.append(_question_memes_fichiers(k, libelle, texte, a, en_cours))
                cles.add(k)
                continue
            faites = faites_au_meme_endroit(ctx, texte, zone, apres)
            if faites:
                f = faites[0]
                questions.append({
                    "key": "followup-%s" % k, "about": libelle, "kind": "followup",
                    "question": "« %s » touche le même endroit que #%s « %s », close (%s) ; en est-ce la suite, ou est-ce déjà fait ?"
                                % (_court(libelle), f["id"], _court(f["libelle"]),
                                   ", ".join(f["lieux_communs"] + f["fichiers_communs"])),
                    "options": [{"label": "Suite de #%s (recommandé)" % f["id"],
                                 "operations": [dict(a, note="; ".join(x for x in (audit._propre(a.get("note")),
                                                                                 "suite de #%s" % f["id"]) if x),
                                                     distinct=A_PART)]},
                                {"label": "Déjà fait par #%s : ne rien ajouter" % f["id"], "operations": []},
                                {"label": "Tâche à part", "operations": [dict(a, distinct=A_PART)]}]})
                cles.add(k)
            continue
        options = []
        for c in candidates:
            if c["branche"]:
                options.append({"label": "Verser dans #%s, tenue par la session de %s" % (c["id"], c["branche"]),
                                "operations": [], "relay": {"id": c["id"], "branche": c["branche"], "action": texte}})
                continue
            op = {"op": "update", "id": c["id"], "append": texte}
            src = audit._propre((a.get("fields") or {}).get("src"))
            if src:
                op["fields"] = {"src": "%s ; %s" % (c["src"], src) if c["src"] else src}
            options.append({"label": "Verser dans #%s" % c["id"], "operations": [op]})
        options[0] = dict(options[0], label=options[0]["label"] + " (recommandé)")
        options.append({"label": "Tâche à part", "operations": [dict(a, distinct=A_PART)]})
        meilleure = candidates[0]
        pourquoi = ", ".join(meilleure["lieux_communs"] + meilleure["fichiers_communs"])
        tenue = (" ; #%s est tenue par la session de %s : si elle est ouverte, l'action lui est renvoyée"
                 % (meilleure["id"], meilleure["branche"]) if meilleure["branche"] else "")
        questions.append({
            "key": "merge-%s" % k, "about": libelle, "kind": "merge",
            "question": "« %s » touche le même endroit que #%s « %s » (%s)%s ; la verser dans #%s, ou en tâche à part ?"
                        % (_court(libelle), meilleure["id"], _court(meilleure["libelle"]), pourquoi, tenue, meilleure["id"]),
            "options": options})
        cles.add(k)
    return cles, questions


# ---------------------------------------------------------------- un thème, une mère (#438)

# Un lieu porté par plus de GROUPE_MAX tâches ouvertes (et plus du quart d'entre elles) ne dit pas un thème : une mère
# garde 8 filles au plus (le doctor relève au-delà). Le second signe d'un même thème, en mots : la part des mots
# pondérés du plus court des deux libellés que l'autre porte, avec deux mots communs.
GROUPE_MAX = 8
MERE_DE_GROUPE = "mère d'un regroupement par thème (#438)"
SEUIL_THEME = 0.25


def _cites_de(texte, *ignores):
    return set(CITE_RE.findall(texte or "")) - {i for i in ignores if i}


def _noeud_tache(ctx, t, contextes):
    c = contextes[t["id"]]
    champs = t.get("champs") or {}
    apres = set()
    try:
        apres = set(_refs(champs.get("après"), "après")) if champs.get("après") not in (None, "", "-") else set()
    except Erreur:
        pass
    prise = champs.get("branche") if champs.get("qui") and champs.get("branche") else None
    return {"ref": t["id"], "id": t["id"], "libelle": t["libelle"], "axe": t.get("axe"), "parent": t.get("parent"),
            "lieux": c["lieux"], "norme": c["norme"], "texte": c["texte"], "cites": _cites_de(c["texte"], t["id"]),
            "apres": apres, "src": audit._propre(champs.get("src")), "due": champs.get("due"), "prise": prise,
            "champs": champs, "op": None}


def _noeud_ajout(a):
    libelle = audit._propre(a.get("label"))
    texte = _aparte(libelle, audit._propre(a.get("note")))
    champs = a.get("fields") or {}
    lieux, cites = _lieux_et_chaine(texte, a.get("zone"), champs.get("après"))
    apres = set()
    try:
        apres = set(_refs(champs.get("après"), "après")) if champs.get("après") not in (None, "", "-") else set()
    except Erreur:
        pass
    return {"ref": a.get("key"), "id": None, "libelle": libelle, "axe": audit._propre(a.get("axis")) or None,
            "parent": None, "lieux": lieux, "norme": " %s " % _norme(texte), "texte": texte, "cites": cites,
            "apres": apres, "src": audit._propre(champs.get("src")), "due": champs.get("due"), "prise": None,
            "champs": champs, "op": a}


def _meme_theme(x, y, rares, poids):
    """Deux nœuds (tâche ouverte ou ajout) du même thème : même axe, un lieu rare en commun, et un second signe : un
    autre lieu, une chaîne (l'un cite l'autre, ou `après:`), une même étude citée (un `#N` commun, ou la même `src:`),
    ou des mots (SEUIL_THEME du plus court, deux mots communs). Rend les lieux communs, ou rien."""
    if x["axe"] and y["axe"] and x["axe"] != y["axe"]:
        return None
    communs = sorted(l for l in rares if (l in x["lieux"] or _porte(x, l)) and (l in y["lieux"] or _porte(y, l)))
    if not communs:
        return None
    chaine = bool({x["ref"], x["id"]} & (y["cites"] | y["apres"]) or {y["ref"], y["id"]} & (x["cites"] | x["apres"]))
    etude = bool((x["cites"] - {y["id"]}) & (y["cites"] - {x["id"]})) or bool(x["src"] and x["src"] == y["src"])
    mx, my = audit.mots(x["libelle"]), audit.mots(y["libelle"])
    total = min(sum(poids.get(w, POIDS_INCONNU) for w in mx), sum(poids.get(w, POIDS_INCONNU) for w in my))
    com = mx & my
    mots_ok = bool(total) and len(com) >= 2 and sum(poids.get(w, POIDS_INCONNU) for w in com) / total >= SEUIL_THEME
    return communs if (len(communs) >= 2 or chaine or etude or mots_ok) else None


def _themes(ctx, ajouts=()):
    """Les grappes du même thème (#438) parmi les feuilles ouvertes et les ajouts : union des paires `_meme_theme`.
    Rend (nœuds par réf, grappes : listes de réfs, lieux communs par grappe)."""
    feuilles = [t for t in ctx["taches"] if not t.get("enfants")]
    contextes = {t["id"]: contexte_tache(ctx["dossier"], t) for t in feuilles}
    noeuds = [_noeud_tache(ctx, t, contextes) for t in feuilles] + [_noeud_ajout(a) for a in ajouts]
    par_ref = {n["ref"]: n for n in noeuds}
    tous = set().union(*(n["lieux"] for n in noeuds)) if noeuds else set()
    borne = max(GROUPE_MAX, LIEU_COMMUN_PART * len(noeuds))
    rares = {l for l in tous if sum(1 for n in noeuds if l in n["lieux"] or _porte(n, l)) <= borne}
    poids = poids_des_mots([t["libelle"] for t in ctx["taches"]] + [t["libelle"] for t in ctx.get("closes") or []])
    chef = {n["ref"]: n["ref"] for n in noeuds}

    def racine(r):
        while chef[r] != r:
            chef[r] = chef[chef[r]]
            r = chef[r]
        return r

    lieux = {}
    for i, x in enumerate(noeuds):
        for y in noeuds[i + 1:]:
            communs = _meme_theme(x, y, rares, poids)
            if communs:
                chef[racine(x["ref"])] = racine(y["ref"])
                lieux.setdefault((x["ref"], y["ref"]), communs)
    grappes = {}
    for n in noeuds:
        grappes.setdefault(racine(n["ref"]), []).append(n["ref"])
    sortie = []
    for refs in grappes.values():
        if len(refs) < 2:
            continue
        dedans = set(refs)
        communs = sorted({l for (a, b), ls in lieux.items() if a in dedans and b in dedans for l in ls})
        sortie.append((refs, communs))
    return par_ref, sortie


def _rang_ref(r):
    return (0, int(r)) if str(r).isdigit() else (1, 0)


def _nom_de_mere(membres):
    """Le titre proposé à une mère nouvelle : l'expression la plus partagée des libellés, sinon les premiers mots du
    premier ; Claude le remplace par un nom de sujet avant de poser la question."""
    porteurs = {}
    for n in membres:
        for e, (_, ecrit) in audit._expressions(n["libelle"], frozenset()).items():
            # Un nom de fichier ou de code n'est pas un nom de sujet (« test.tsx »).
            if not re.search(r"[./_`]", ecrit):
                porteurs.setdefault(e, [0, ecrit])[0] += 1
    meilleure = max(((c, e) for e, (c, _) in porteurs.items() if c >= 2), default=None)
    if meilleure:
        ecrit = porteurs[meilleure[1]][1]
        return (ecrit[:1].upper() + ecrit[1:])[:NOM_MAX]
    return titre_court(membres[0]["libelle"])


def _options_de_groupe(ctx, par_ref, refs, cle_mere, ajouts_du_lot):
    """Les opérations d'un regroupement : « Ranger sous #P » quand une fille de la grappe a déjà une mère, sinon une
    mère nouvelle (son axe, son échéance finale, les clés exigées que ses filles partagent). Seules bougent les tâches
    libres sans parent (une tâche prise ne se touche pas) ; un `après:` hors de la grappe passe à la mère. Rend
    (cible, libellé de l'option, opérations, réfs rangées) ou None quand rien ne se range."""
    membres = [par_ref[r] for r in sorted(refs, key=_rang_ref)]
    meres = {}
    for n in membres:
        if n["parent"]:
            meres[n["parent"]] = meres.get(n["parent"], 0) + 1
    ajouts = [n for n in membres if n["op"] is not None]
    libres = [n for n in membres if n["op"] is None and not n["parent"] and not n["prise"]]
    dedans = {n["ref"] for n in membres} | {n["id"] for n in membres if n["id"]}
    if meres:
        cible = max(meres, key=lambda p: (meres[p], -int(p) if p.isdigit() else 0))
        par_id = {t["id"]: t for t in ctx["taches"]}
        axe = (par_id.get(cible) or {}).get("axe")
        libres = [n for n in libres if not axe or n["axe"] == axe]
        ops = [dict({c: v for c, v in n["op"].items() if c not in ("axis", "section", "distinct", "zone")}, parent=cible)
               for n in ajouts]
        ops += [{"op": "update", "id": n["id"], "fields": {"parent": cible}} for n in libres]
        if not ops:
            return None
        ranges = [n["ref"] for n in ajouts + libres]
        quoi = "sous #%s" % cible if ajouts and not libres else "%s sous #%s" % (", ".join("#%s" % n["id"] for n in libres)
                                                                                 + (" et l'ajout" if ajouts else ""), cible)
        return cible, "Ranger %s" % quoi, ops, ranges
    if len(ajouts) + len(libres) < 2:
        return None
    ranges_n = ajouts + libres
    axe = next((n["axe"] for n in ranges_n if n["axe"]), None)
    hors = set()
    for n in ranges_n:
        hors |= {r for r in n["apres"] if r not in dedans}
    dues = [n["due"] for n in ranges_n if n["due"] and im.DATE.match(str(n["due"]))]
    nom = _nom_de_mere(ranges_n)
    champs = {"nom": nom}
    if dues:
        champs["due"] = max(dues)
    champs["après"] = sorted(hors, key=_rang_ref) or "-"
    for k in ctx.get("requis") or []:
        if k in champs or k in ("id", "ouvert", "parent", "après", "qui", "fait", "due"):
            continue
        valeurs = {audit._propre(n["champs"].get(k)) for n in ranges_n}
        if len(valeurs) == 1 and next(iter(valeurs)):
            champs[k] = next(iter(valeurs))
    # La mère porte les mots de ses filles : sans `distinct`, #288 la trouverait couverte par elles.
    mere = {"op": "add", "key": cle_mere, "label": nom, "axis": axe, "fields": champs, "distinct": MERE_DE_GROUPE}
    section = next((n["op"].get("section") for n in ajouts if n["op"].get("section")), None)
    if section:
        mere["section"] = section
    ops = [mere]
    for n in ajouts:
        op = dict({c: v for c, v in n["op"].items() if c not in ("axis", "section", "distinct", "zone")}, parent=cle_mere)
        if n["apres"] & hors:
            op["fields"] = dict(op.get("fields") or {}, **{"après": sorted(n["apres"] - hors, key=_rang_ref) or "-"})
        ops.append(op)
    for n in libres:
        f = {"parent": cle_mere}
        if n["apres"] & hors:
            f["après"] = sorted(n["apres"] - hors, key=_rang_ref) or "-"
        ops.append({"op": "update", "id": n["id"], "fields": f})
    return None, "Regrouper sous une mère nouvelle « %s »" % nom, ops, [n["ref"] for n in ranges_n]


def _tenues(membres):
    prises = [n for n in membres if n["prise"]]
    return "".join(" ; #%s est tenue par la session de %s : elle se range à sa clôture" % (n["id"], n["prise"])
                   for n in prises)


def un_groupe(ctx, operations, retenues):
    """#438 : un ajout sans parent, que #288 et #320 n'ont pas retenu et que rien dans le lot ne vise, du même thème
    que des tâches ouvertes ou que d'autres ajouts du lot (`_themes`), n'empile pas une ligne à part : il devient une
    question (kind `group`) : « Regrouper sous une mère nouvelle » ou « Ranger sous #P » (recommandé), « Verser dans
    #T » pour un ajout seul, « Tâche(s) à part », « Ne rien ajouter ». Un `distinct` de l'écrivain ne l'en dispense
    pas (le 2026-11-10, Maestro l'avait forcé sur #433 et #434) ; seul le choix de la personne (`A_PART`) le fait."""
    fermees = {str(op.get("id")) for op in operations if op.get("op") in ("drop", "done", "handoff")}
    ctx_ouvert = dict(ctx, taches=[t for t in ctx["taches"] if t["id"] not in fermees])
    visees = set().union(*(_refs_op(op) for op in operations)) if operations else set()
    ajouts = [a for a in operations
              if a.get("op") == "add" and _sans_ref(a.get("parent")) and audit._propre(a.get("distinct")) != A_PART
              and a.get("key") not in retenues and a.get("key") not in visees]
    if not ajouts:
        return set(), []
    par_ref, grappes = _themes(ctx_ouvert, ajouts)
    cles, questions = set(), []
    for refs, communs in sorted(grappes, key=lambda g: min(_rang_ref(r) for r in g[0])):
        les_ajouts = [r for r in refs if par_ref[r]["op"] is not None]
        ouvertes = [r for r in refs if par_ref[r]["op"] is None]
        meres = [r for r in ouvertes if par_ref[r]["parent"]]
        # Un thème de plusieurs sœurs : deux ajouts, deux tâches ouvertes, ou une fille déjà sous sa mère.
        if not les_ajouts or (len(les_ajouts) < 2 and len(ouvertes) < 2 and not meres):
            continue
        k = next(a.get("key") for a in ajouts if a.get("key") in les_ajouts)
        rangement = _options_de_groupe(ctx_ouvert, par_ref, refs, "mere-%s" % k, ajouts)
        if rangement is None:
            continue
        cible, libelle_opt, ops, _ = rangement
        n_ajouts = [par_ref[r] for r in les_ajouts]
        taches = [par_ref[r] for r in sorted(refs, key=_rang_ref) if par_ref[r]["op"] is None]
        options = [{"label": libelle_opt + " (recommandé)", "operations": ops}]
        if len(n_ajouts) == 1:
            libres = [n for n in taches if not n["parent"] and not n["prise"]]
            direct = [n for n in libres if _meme_theme(n, n_ajouts[0], set(communs), {})] or libres
            if direct:
                t = direct[0]
                op = {"op": "update", "id": t["id"], "append": n_ajouts[0]["texte"]}
                src = n_ajouts[0]["src"]
                if src:
                    op["fields"] = {"src": "%s ; %s" % (t["src"], src) if t["src"] else src}
                options.append({"label": "Verser dans #%s" % t["id"], "operations": [op]})
        options.append({"label": "Tâche à part" if len(n_ajouts) == 1 else "Tâches à part",
                        "operations": [dict(n["op"], distinct=A_PART) for n in n_ajouts]})
        if taches:
            options.append({"label": "Ne rien ajouter : le thème a déjà ses tâches (%s)"
                                     % ", ".join("#%s" % n["id"] for n in taches), "operations": []})
        options = options[:4]
        quoi = " et ".join("« %s »" % _court(n["libelle"]) for n in n_ajouts)
        avec = ", ".join("#%s « %s »" % (n["id"], _court(n["libelle"])) for n in taches)
        but = ("ranger sous #%s" % cible) if cible else "les regrouper sous une mère commune"
        questions.append({
            "key": "group-%s" % k, "about": n_ajouts[0]["libelle"], "kind": "group",
            "question": "%s : même thème que %s (%s)%s ; %s, plutôt qu'en lignes à part ?"
                        % (quoi, avec or "l'un l'autre", ", ".join(communs), _tenues(taches), but),
            "options": options})
        cles |= set(les_ajouts)
    return cles, questions


def groupes(ctx):
    """#438 : le regroupement sur les lignes déjà écrites. Chaque grappe du même thème parmi les feuilles ouvertes qui
    a quelque chose à ranger (une tâche libre sans parent) devient une question (kind `group`, sur la première tâche à
    ranger) : « Ranger #a sous #P » quand une fille de la grappe a déjà sa mère, sinon « Regrouper #a, #b sous une mère
    nouvelle « X » » (recommandé), puis « Les laisser à part »."""
    par_ref, grappes = _themes(ctx)
    questions = []
    for refs, communs in sorted(grappes, key=lambda g: min(_rang_ref(r) for r in g[0])):
        premier = min(refs, key=_rang_ref)
        rangement = _options_de_groupe(ctx, par_ref, refs, "mere-%s" % premier, [])
        if rangement is None:
            continue
        cible, libelle_opt, ops, ranges = rangement
        ranges = sorted(ranges, key=_rang_ref)
        liste = ", ".join("#%s" % r for r in ranges)
        if cible is None:
            libelle_opt = "Regrouper %s sous une mère nouvelle « %s »" % (liste, ops[0]["label"])
        membres = [par_ref[r] for r in sorted(refs, key=_rang_ref)]
        questions.append({
            "key": "group-%s" % ranges[0], "task": ranges[0], "kind": "group",
            "question": "%s : même thème (%s)%s ; %s ?"
                        % (", ".join("#%s « %s »" % (n["id"], _court(n["libelle"])) for n in membres),
                           ", ".join(communs), _tenues(membres),
                           "ranger %s sous #%s" % (liste, cible) if cible else "les regrouper sous une mère commune"),
            "options": [{"label": libelle_opt + " (recommandé)", "operations": ops},
                        {"label": "Les laisser à part", "operations": []}]})
    return questions


# ---------------------------------------------------------------- écrire


def _date(v, quoi, cle):
    val = audit._propre(v)
    try:
        datetime.date.fromisoformat(val)
        assert im.DATE.match(val)
    except (ValueError, AssertionError):
        raise Erreur("%s : date invalide %s:%r (AAAA-MM-JJ)" % (quoi, cle, val))
    return val


def _date_fait(v, quoi, cle):
    """Une date de clôture : AAAA-MM-JJ, ou AAAA-MM-JJ HH:MM (#262)."""
    val = audit._propre(v)
    if im.DATE_FAIT.match(val) and im.DATE.match(val[:10]):
        try:
            datetime.date.fromisoformat(val[:10])
            return val
        except ValueError:
            pass
    raise Erreur("%s : date invalide %s:%r (AAAA-MM-JJ, ou AAAA-MM-JJ HH:MM)" % (quoi, cle, val))


def _refs(v, quoi):
    if isinstance(v, str):
        v = [x for x in v.split(",") if x.strip() not in ("", "-")]
    if not isinstance(v, list):
        raise Erreur("%s : après est une liste de numéros ou de clés" % quoi)
    return [str(x).strip() for x in v]


class _Tenue(audit._Preparation):
    """La préparation de l'audit, avec les opérations du quotidien et leurs règles (#125, #158)."""

    def __init__(self, ctx, maintenant=None):
        super().__init__(ctx, {})
        self.maintenant = maintenant
        self.dossier_projet = ctx.get("dossier")
        self.journal = journal_de_bilan(ctx["dossier"], os.path.dirname(ctx["roadmap"]))
        self.cles_valeurs = ctx.get("cles_valeurs") or {}
        self.axes = ctx.get("axes") or []
        self.sections = ctx.get("sections") or []
        self.notes = []
        self.tenue = {"ajoutees": [], "completees": [], "redatees": [], "cochees": [], "abandonnees": [],
                      "en_pause": [], "suites": []}
        # Le compte rendu (#232) : une entrée par tâche ajoutée, une par changement d'une tâche ; les
        # clôtures partielles (#245) en une ligne chacune, sous son titre.
        self.compte = {"ajoutees": [], "mises_a_jour": [], "t_attendent": [], "suites": self.tenue["suites"]}
        self.me = ctx.get("me") or []
        self.closes = {c["id"]: c["libelle"] for c in ctx.get("closes") or []}
        self.blanc_apres = set()  # ancres d'une section vide : une ligne vide après les tâches posées
        self.section_de = {t["ligne"]: t["section"] for t in im.lire_checklist(self.texte_o)[0]}
        # #288 : les mères qui reçoivent une fille dans ce lot (leur numéro ou leur clé), et celles qui en avaient.
        self.meres_du_lot = []
        self.meres_avant = {t["parent"] for t in ctx["taches"] if t.get("parent")}

    # -- règles

    def champ_propose(self, k, v, quoi, interdits=audit.CHAMPS_INTERDITS):
        val = super().champ_propose(k, v, quoi, interdits)
        admises = self.cles_valeurs.get(k)
        if admises:
            hors = [x.strip() for x in val.split(",") if x.strip() not in admises]
            if hors:
                raise Erreur("%s : %s:%s hors des valeurs admises (%s)" % (quoi, k, hors[0], ", ".join(admises)))
        return val

    def enfants_ouverts(self, t):
        return [e for e in self.ouvertes() if e is not t and _sans_parent(e) == t.id]

    def poser_apres(self, t, refs, quoi):
        """`après:` entre deux sœurs, ou entre deux tâches sans parent (#125)."""
        nums = []
        for ref in _refs(refs, quoi):
            cible = self.tache(ref, quoi)
            if cible is t:
                raise Erreur("%s : #%s ne peut pas venir après elle-même" % (quoi, t.id))
            if _sans_parent(cible) != _sans_parent(t):
                raise Erreur("%s : après:%s relierait l'enfant d'un sujet à une tâche d'un autre "
                             "(après: relie deux sœurs, ou deux tâches sans parent)" % (quoi, cible.id))
            if cible.id not in nums:
                nums.append(cible.id)
        t.set("après", ",".join(nums) or "-")

    def refuser_sans_envoi(self, t, quoi):
        """#242 : ni clôture ni clôture partielle tant qu'une communication de la tâche n'est pas partie."""
        attente = envois_en_attente(t.get("livrable"), list(dict.fromkeys([self.r.get("dossier") or self.rdir, self.rdir])))
        if attente:
            raise Erreur("%s : %s pas encore parti (%s) : envoie-le d'abord (l'envoi se demande à la personne), puis "
                         "écris en tête du fichier « Statut : envoyé le AAAA-MM-JJ (par où) », la preuve d'envoi"
                         % (quoi, "livrable" if len(attente) == 1 else "livrables", ", ".join(attente)))

    def changer(self, t, change):
        self.compte["mises_a_jour"].append({"id": t.id, "libelle": _court(t.libelle), "change": change})

    # -- opérations

    def ajouter(self, op):
        libelle = audit._propre(op.get("label"))
        quoi = "ajout « %s »" % libelle[:40]
        if not libelle:
            raise Erreur("ajout : libellé vide")
        brut = dict(op.get("fields") or {})
        apres = brut.pop("après", None)
        qui = brut.pop("qui", None)
        champs = {k: self.champ_propose(k, v, quoi, INTERDITS_AJOUT) for k, v in brut.items()}
        champs.setdefault("ouvert", self.jour)
        self.poser_qui(champs, qui, quoi)
        p = op.get("parent")
        mere = None
        if p not in (None, "", "-"):
            p = str(p)
            if p in self.ids_fait:
                raise Erreur("%s : le parent #%s est close ; rouvre-la d'abord (une question)" % (quoi, p))
            mere = self.tache(p, quoi)
            self.deux_niveaux(mere, quoi)
            champs["parent"] = mere.id
            if p.lstrip("#") not in [r for r, _ in self.meres_du_lot]:
                self.meres_du_lot.append((p.lstrip("#"), mere))
            for k in self.heritage:
                if k not in champs and mere.get(k):
                    champs[k] = mere.get(k)
        elif "parent" in self.requis:
            champs["parent"] = "-"
        axe = audit._propre(op.get("axis")) or (mere.axe if mere else "")
        # Un enfant n'a pas d'axe à lui (#190) : il prend celui de son parent.
        if mere is not None and axe != mere.axe:
            raise Erreur("%s : axe « %s » différent de celui du parent #%s (« %s ») : un enfant prend l'axe de son parent, omets axis"
                         % (quoi, axe, mere.id, mere.axe))
        if not im.AXE.match(axe) or (self.axes and axe not in self.axes):
            raise Erreur("%s : axe « %s » inconnu (axes : %s)" % (quoi, axe, ", ".join(self.axes) or "minuscules, chiffres, tirets"))
        self.completer(champs, mere, quoi)
        champs["id"] = self.numero(op.get("key"))
        t = audit._Tache(id=champs["id"], libelle=_aparte(libelle, op.get("note")), axe=axe,
                         champs=audit._ordonnes(champs))
        self.cles[op["key"]] = t
        if apres is not None:
            self.poser_apres(t, apres, quoi)
        self.placer(t, mere, op.get("section"), quoi)
        self.bilan["enfants"] += 1
        self.tenue["ajoutees"].append(t.id)
        self.compte["ajoutees"].append({"id": t.id, "libelle": _court(libelle), "parent": mere.id if mere else None,
                                        "due": t.get("due")})

    def placer(self, t, mere, section, quoi):
        """Un enfant sous son parent, après ses autres enfants ; une autre tâche au bout de sa section."""
        if mere is not None and mere.ligne is None:
            liste = next(l for l in self.apres_ligne.values() if mere in l)
            i = liste.index(mere) + 1
            while i < len(liste) and _sans_parent(liste[i]) == mere.id:
                i += 1
            liste.insert(i, t)
            return
        if mere is not None:
            ancre = max([e.ligne for e in self.taches.values() if _sans_parent(e) == mere.id and e.ligne]
                        + [mere.ligne])
            self.apres_ligne.setdefault(ancre, []).append(t)
            return
        if not section:
            section = "Prochain" if "Prochain" in self.sections else (self.sections or [""])[0]
        if section not in self.sections:
            raise Erreur("%s : section « %s » inconnue (sections : %s)" % (quoi, section, ", ".join(self.sections)))
        lignes = [n for n, s in self.section_de.items() if s == section]
        if lignes:
            ancre = max(lignes)
        else:
            ancre = next(n for n, l in enumerate(self.lignes, 1) if l.strip() == "## " + section)
            if ancre < len(self.lignes) and self.lignes[ancre].strip() == "":
                ancre += 1
            self.blanc_apres.add(ancre)
        self.apres_ligne.setdefault(ancre, []).append(t)

    def completer_tache(self, op):
        t = self.tache(op.get("id"), "complément")
        quoi = "complément de #%s" % t.id
        self.libre(t, quoi)
        if "append" in op:
            # #320 : une action versée dans la tâche, après « ; ».
            ajout = audit._propre(op.get("append"))
            if not ajout:
                raise Erreur("%s : append vide" % quoi)
            t.libelle = "%s ; %s" % (t.libelle.rstrip(" ;"), ajout)
            t.touche = True
        brut = dict(op.get("fields") or {})
        apres = brut.pop("après", None)
        parent = brut.pop("parent", None)
        for k, v in brut.items():
            if v is None:
                # `null` retire une clé facultative (une `prio:`, un `attend:` levé).
                if k in self.requis or k in INTERDITS_COMPLETER:
                    raise Erreur("%s : %s est un champ exigé ou réservé, il ne se retire pas" % (quoi, k))
                t.champs = [(c, x) for c, x in t.champs if c != k]
                t.touche = True
                continue
            t.set(k, self.champ_propose(k, v, quoi, INTERDITS_COMPLETER))
        if parent is not None:
            p = str(parent).lstrip("#")
            if p in ("", "-"):
                t.set("parent", "-")
            else:
                mere = self.tache(p, quoi)
                self.deux_niveaux(mere, quoi)
                if self.enfants_ouverts(t):
                    raise Erreur("%s : #%s a des enfants, elle ne devient pas enfant (deux niveaux au plus)" % (quoi, t.id))
                t.set("parent", mere.id)
                # Rattachée, elle prend l'axe de son parent (#190).
                t.axe = mere.axe
        if apres is not None:
            self.poser_apres(t, apres, quoi)
        self.tenue["completees"].append(t.id)
        # #275 : les noms des clés, jamais leurs valeurs brutes (un src: de trois lignes dans le compte rendu).
        dit = (["libellé"] if "append" in op else []) + [
            "%s retiré" % k if v is None else k for k, v in (op.get("fields") or {}).items()]
        self.changer(t, "complétée : %s" % ", ".join(dit))

    def redater(self, op):
        t = self.tache(op.get("id"), "redate")
        t.set("due", _date(op.get("due"), "redate de #%s" % t.id, "due"))
        self.tenue["redatees"].append(t.id)
        self.changer(t, "redatée au %s" % _jj_mm(t.get("due")))

    def moment(self, date):
        """`fait:` porte l'heure de la clôture (#262) quand elle a lieu le jour même ; une date passée
        reste sans heure inventée."""
        if len(date) == 10 and self.maintenant is not None and date == self.maintenant.date().isoformat():
            return "%s %s" % (date, self.maintenant.strftime("%H:%M"))
        return date

    def bilan_de(self, op, quoi):
        """Le bilan entier d'une clôture (#262), contrôlé comme `cowork.py` ; exigé dans un dossier
        Cowork qui confie sa roadmap au plugin."""
        b = op.get("bilan")
        if b is None:
            if self.journal["exige"]:
                raise Erreur("%s : ce dossier demande un bilan à chaque clôture : bilan {fait, souci, ressenti (%s), "
                             "cause (%s), corrections, note%s}" % (
                                 quoi, "|".join(self.journal["ressentis"]), "|".join(self.journal["causes"]),
                                 ", type (%s), lieu (%s, sinon celui de la ligne)" % ("|".join(TYPES), "|".join(LIEUX))
                                 if self.journal["comptable"] else ""))
            return None
        if not isinstance(b, dict):
            raise Erreur("%s : le bilan est un objet {fait, souci, ressenti, cause, corrections, note}" % quoi)
        inconnues = set(b) - BILAN_CLES
        if inconnues:
            raise Erreur("%s : bilan, clé inconnue %s (admises : %s)" % (quoi, ", ".join(sorted(inconnues)),
                                                                        ", ".join(sorted(BILAN_CLES))))
        r = {k: str(b.get(k) if b.get(k) is not None else "").strip() for k in BILAN_CLES}
        comptes = [("type", TYPES)] + ([("lieu", LIEUX)] if r["lieu"] else [])
        for k, admises in [("ressenti", self.journal["ressentis"]), ("cause", self.journal["causes"])] + (
                comptes if self.journal["comptable"] else []):
            if r[k] not in admises:
                raise Erreur("%s : bilan, %s « %s » hors des valeurs admises (%s)" % (quoi, k, r[k], ", ".join(admises)))
        fluide = r["ressenti"] == "fluide"
        if fluide != (r["cause"] == "aucune"):
            raise Erreur("%s : bilan, ressenti « fluide » va avec cause « aucune », et seulement lui" % quoi)
        for k in ("fait", "souci"):
            if "\n" in r[k] or "\r" in r[k]:
                raise Erreur("%s : bilan, %s tient en une ligne" % (quoi, k))
            if len(r[k]) > CONCLUSION_MAX:
                raise Erreur("%s : bilan, %s fait %d caractères, %d au plus" % (quoi, k, len(r[k]), CONCLUSION_MAX))
        if not r["fait"]:
            raise Erreur("%s : bilan, fait manque (ce qui a été fait, une ligne)" % quoi)
        if not r["souci"] and not fluide:
            raise Erreur("%s : bilan, souci manque : un ressenti %s dit un souci, en une ligne" % (quoi, r["ressenti"]))
        if not r["corrections"].isdigit():
            raise Erreur("%s : bilan, corrections est un nombre entier, 0 ou plus" % quoi)
        if not r["note"]:
            raise Erreur("%s : bilan, note manque (une phrase)" % quoi)
        if not self.journal["comptable"]:
            for k in BILAN_COMPTE:
                r.pop(k)
        return r

    def fermer_tache(self, t, date, suffixe, souci, raison="", bilan=None):
        """`raison` (un abandon) va dans le libellé, après « ; » et avant le suffixe (#285), comme la reprise
        à la main d'Adbricks Cowork ; une note déjà portée par la ligne reste où elle était."""
        t.retiree = True
        fait = self.moment(date)
        champs = [(k, v) for k, v in t.champs if k not in ("fait", "attend")] + [("fait", fait)]
        libelle = "%s ; %s" % (t.libelle, raison) if raison else t.libelle
        self.vers_fait.append(im.rendre_ligne(True, libelle + suffixe, t.axe, champs, t.note))
        rang = dict(bilan) if bilan else {"fait": t.libelle, "souci": souci}
        rang.update(date=fait[:10], id=t.id)
        if self.journal["comptable"] and not rang.get("lieu"):
            rang["lieu"] = "cloud" if dict(t.champs).get("lieu") == "cloud" else "mac"
        rang.update(self.cout_de(t))
        self.bilans.append(rang)
        self.bilan["fermetures"] += 1

    def cout_de(self, t):
        """Les colonnes tokens et sonnet d'une tâche à `branche:` (#327) ; aucune erreur ne bloque la clôture."""
        branche = dict(t.champs).get("branche")
        if not branche:
            return {}
        try:
            depuis = None
            try:
                depuis = datetime.datetime.strptime(dict(t.champs).get("ouvert", ""), "%Y-%m-%d").timestamp()
            except ValueError:
                pass
            c = cout.cout_branche(branche, depuis=depuis, projet=self.dossier_projet)
            if not c:
                return {}
            return {"tokens": "%.1f" % ((c["relus"] + c["ecrits"]) / 1e6), "sonnet": str(round(c["sonnet"]))}
        except Exception:
            return {}

    def rendre_bilans(self, chemin):
        """Les bilans au bout du journal, rangés par ses colonnes (#262) ; un journal absent ne se crée
        que quand le dossier exige le bilan."""
        texte = audit._lire_fichier(chemin)
        if not self.bilans or (texte is None and not self.journal["exige"]):
            return texte
        texte = texte if texte is not None else ",".join(BILAN_COLS) + "\n"
        entete = next(csv.reader(io.StringIO(texte)), None) or list(BILAN_COLS)
        neuves = [c for c in BILAN_COLS if c not in entete and any(r.get(c) for r in self.bilans)]
        if neuves:
            entete = entete + neuves
            premiere, _, reste = texte.partition("\n")
            ligne = io.StringIO()
            csv.writer(ligne, lineterminator="").writerow(entete)
            texte = ligne.getvalue() + ("\n" + reste if _ else "")
        sortie = io.StringIO()
        csv.writer(sortie, lineterminator="\n").writerows([[r.get(c, "") for c in entete] for r in self.bilans])
        return texte + ("" if texte.endswith("\n") or not texte else "\n") + sortie.getvalue()

    def cocher(self, op):
        t = self.tache(op.get("id"), "clôture")
        quoi = "clôture de #%s" % t.id
        date = _date_fait(op.get("date"), quoi, "date")
        preuve = audit._propre(op.get("proof"))
        if not preuve:
            raise Erreur("%s : la preuve manque (ce qui prouve que c'est fait, et où)" % quoi)
        self.refuser_sans_envoi(t, quoi)
        bilan = self.bilan_de(op, quoi)
        ouverts = self.enfants_ouverts(t)
        if ouverts:
            raise Erreur("%s : #%s a un enfant ouvert (#%s)" % (quoi, t.id, ouverts[0].id))
        if t.get("tous"):
            raise Erreur("%s : tâche récurrente (tous:%s) : le bouton « Marquer faite » du panneau la reconduit"
                         % (quoi, t.get("tous")))
        self.fermer_tache(t, date, "", "Faite : %s" % preuve, bilan=bilan)
        self.tenue["cochees"].append(t.id)
        self.changer(t, "cochée le %s : %s" % (_jj_mm(date), preuve))
        p = _sans_parent(t)
        mere = self.taches.get(p) or self.cles.get(p)
        if mere is None or getattr(mere, "retiree", False) or self.enfants_ouverts(mere):
            return
        if mere.get("tous"):
            self.notes.append("#%s, récurrente (tous:%s), reste ouverte : ajoute les étapes de la période suivante"
                              % (mere.id, mere.get("tous")))
            self.changer(mere, "reste ouverte (récurrente, tous:%s) : ajouter les étapes de la période suivante"
                         % mere.get("tous"))
            return
        dernier = "Close avec son dernier enfant #%s" % t.id
        self.fermer_tache(mere, date, "", dernier, bilan=dict(bilan, fait=dernier) if bilan else None)
        self.tenue["cochees"].append(mere.id)
        self.changer(mere, "close avec son dernier enfant #%s, le %s" % (t.id, _jj_mm(date)))

    def passer_la_main(self, op):
        """La clôture partielle (#245) : #A close sur ce qui est fait, sa suite #B ouverte chez le tiers
        attendu (même parent, après:A, attend:, src:, même fiche:), à la place de #A, et les renvois
        des lignes ouvertes à #A passés à #B ; jamais dans les lignes closes."""
        t = self.tache(op.get("id"), "clôture partielle")
        quoi = "clôture partielle de #%s" % t.id
        date = _date_fait(op.get("date"), quoi, "date")
        dits = {k: audit._propre(op.get(k)) for k in ("proof", "delivered", "label", "src", "waiting")}
        for k, ce in (("proof", "la preuve (le message parti au tiers, et où)"), ("delivered", "ce qui a été livré"),
                      ("label", "le libellé de la suite"), ("src", "src (le message qui a fait la demande au tiers)")):
            if not dits[k]:
                raise Erreur("%s : %s manque" % (quoi, ce))
        self.refuser_sans_envoi(t, quoi)
        tiers = dits["waiting"]
        if not est_un_tiers(tiers, self.me):
            raise Erreur("%s : attend:%s n'est pas un tiers (ni %s, ni une tâche) : coche la tâche (done) ou "
                         "laisse-la ouverte" % (quoi, tiers or "(vide)", ", ".join(self.me) or "toi"))
        ouverts = self.enfants_ouverts(t)
        if ouverts:
            raise Erreur("%s : #%s a un enfant ouvert (#%s) : notre part n'est pas faite" % (quoi, t.id, ouverts[0].id))
        if t.get("tous"):
            raise Erreur("%s : tâche récurrente (tous:%s) : le bouton « Marquer faite » du panneau la reconduit"
                         % (quoi, t.get("tous")))
        bilan = self.bilan_de(op, quoi)
        champs = {k: self.champ_propose(k, v, quoi, INTERDITS_SUITE) for k, v in (op.get("fields") or {}).items()}
        champs.update({"attend": tiers, "src": dits["src"]})
        if t.get("fiche"):
            champs["fiche"] = t.get("fiche")
        champs.setdefault("ouvert", self.jour)
        p = _sans_parent(t)
        mere = self.taches.get(p) or self.cles.get(p) if p != "-" else None
        if p != "-":
            champs["parent"] = p
        elif "parent" in self.requis:
            champs["parent"] = "-"
        for k in self.heritage + ["prio"]:
            if k not in champs and t.get(k):
                champs[k] = t.get(k)
        self.poser_qui(champs, None, quoi)
        self.completer(champs, t, quoi)
        champs["après"] = t.id
        champs["id"] = self.numero(op.get("key"))
        suite = audit._Tache(id=champs["id"], libelle=dits["label"], axe=t.axe, champs=audit._ordonnes(champs))
        self.cles[op["key"]] = suite
        if t.ligne is not None:
            self.apres_ligne.setdefault(t.ligne, []).append(suite)
        else:
            self.placer(suite, mere, None, quoi)
        self.bilan["enfants"] += 1
        chez = qui_attend(tiers)
        self.fermer_tache(t, date, " ; livré : %s" % dits["delivered"],
                          "Faite : %s ; suite chez %s en #%s" % (dits["proof"], chez, suite.id), bilan=bilan)
        self.tenue["cochees"].append(t.id)
        self.tenue["ajoutees"].append(suite.id)
        self.tenue["suites"].append({"close": t.id, "suite": suite.id, "tiers": chez})
        self.changer(t, "close le %s : %s ; suite chez %s en #%s" % (_jj_mm(date), dits["proof"], chez, suite.id))
        self.compte["ajoutees"].append({"id": suite.id, "libelle": _court(suite.libelle),
                                        "parent": p if p != "-" else None, "due": suite.get("due")})
        self.remplacer_renvois(t.id, suite)

    def remplacer_renvois(self, ancien, suite):
        """Dans les lignes ouvertes, `parent:`, `après:` et « #ancien » du libellé et de la note mènent à la suite."""
        motif = re.compile(r"#%s(?!\d)" % ancien)
        for o in self.ouvertes():
            if o is suite:
                continue
            avant = (o.libelle, o.note, o.get("parent"), o.get("après"))
            for k in ("parent", "après"):
                v = o.get(k)
                if not v or ancien not in [x.strip() for x in v.split(",")]:
                    continue
                nums = []
                for x in v.split(","):
                    x = suite.id if x.strip() == ancien else x.strip()
                    if x not in nums and x != o.id:
                        nums.append(x)
                o.set(k, ",".join(nums) or "-")
            o.libelle, o.note = motif.sub("#" + suite.id, o.libelle), motif.sub("#" + suite.id, o.note)
            if (o.libelle, o.note, o.get("parent"), o.get("après")) != avant:
                o.touche = True
                self.changer(o, "renvoi à #%s remplacé par #%s" % (ancien, suite.id))

    def abandonner(self, op):
        t = self.tache(op.get("id"), "abandon")
        quoi = "abandon de #%s" % t.id
        self.libre(t, quoi)
        raison = audit._propre(op.get("reason"))
        if not raison:
            raise Erreur("%s : la raison manque" % quoi)
        ouverts = self.enfants_ouverts(t)
        if ouverts:
            raise Erreur("%s : #%s a un enfant ouvert (#%s) : abandonne ou coche d'abord ses enfants"
                         % (quoi, t.id, ouverts[0].id))
        bilan = self.bilan_de(op, quoi)
        self.fermer_tache(t, self.jour, " (abandonné)", "Abandonnée : %s" % raison, raison, bilan)
        self.tenue["abandonnees"].append(t.id)
        self.changer(t, "annulée : %s" % raison)

    def mettre_en_pause(self, op):
        """En pause (#159) : `due:` devient la date de reprise, la note le dit, et la tâche passe en
        « Plus tard » ; un enfant reste sous son parent."""
        t = self.tache(op.get("id"), "pause")
        quoi = "pause de #%s" % t.id
        self.libre(t, quoi)
        reprise = _date(op.get("until"), quoi, "until")
        raison = audit._propre(op.get("reason"))
        if not raison:
            raise Erreur("%s : la raison manque" % quoi)
        ouverts = self.enfants_ouverts(t)
        if ouverts:
            raise Erreur("%s : #%s a un enfant ouvert (#%s) : mets en pause ses enfants" % (quoi, t.id, ouverts[0].id))
        t.set("due", reprise)
        jour = datetime.date.fromisoformat(self.jour)
        t.libelle = _aparte(t.libelle, "en pause depuis le %s : %s" % (jour.strftime("%d/%m"), raison))
        if _sans_parent(t) == "-" and SECTION_PAUSE in self.sections and self.section_de.get(t.ligne) != SECTION_PAUSE:
            t.deplacee = True
            self.placer(t, None, SECTION_PAUSE, quoi)
        self.tenue["en_pause"].append(t.id)
        self.changer(t, "en pause jusqu'au %s : %s" % (_jj_mm(reprise), raison))

    def attendre(self, q):
        """Une question qui attend la personne (#232) : au format de l'audit, sur une tâche (ouverte,
        ajoutée par ce lot sous sa clé, ou close) ou sur une action sans tâche (`about`)."""
        audit._verifier_question(q)
        quoi = "question %s" % q["key"]
        if q["kind"] not in RAISONS:
            raise Erreur("%s : kind « %s » inconnu (admis : %s)" % (quoi, q["kind"], ", ".join(RAISONS)))
        ref = q.get("task")
        if ref in (None, ""):
            libelle = audit._propre(q.get("about"))
            if not libelle:
                raise Erreur("%s : ni task (la tâche visée) ni about (l'action, sans tâche)" % quoi)
            num = None
        else:
            ref = str(ref).lstrip("#")
            t = self.cles.get(ref) or self.taches.get(ref)
            if t is not None:
                num, libelle = t.id, t.libelle
            elif ref in self.closes:
                num, libelle = ref, self.closes[ref]
            else:
                raise Erreur("%s : tâche #%s inconnue (ni ouverte, ni ajoutée par ce lot, ni close)" % (quoi, ref))
        reco = q["options"][0]["label"].replace("(recommandé)", "").strip()
        self.compte["t_attendent"].append({"key": q["key"], "id": num, "libelle": _court(libelle),
                                           "raison": RAISONS[q["kind"]], "question": q["question"], "recommande": reco})

    def questions_de_titre(self):
        """#288 : une mère sans `nom:` qui reçoit sa première fille reçoit une question qui propose un titre
        court (kind `name`) ; rien pour une mère nommée, close par le lot ou prise par une session."""
        sortie = []
        for ref, mere in self.meres_du_lot:
            if mere.id in self.meres_avant or mere.get("nom") or getattr(mere, "retiree", False) or (
                    mere.get("qui") and mere.get("branche")):
                continue
            nom = titre_court(mere.libelle)
            sortie.append({
                "key": "name-%s" % ref, "task": ref, "kind": "name",
                "question": "« %s » (#%s) reçoit sa première sous-tâche : quel titre court pour elle ?"
                            % (_court(mere.libelle), mere.id),
                "options": [{"label": "« %s » (recommandé)" % nom,
                             "operations": [{"op": "update", "id": mere.id, "fields": {"nom": nom}}]},
                            {"label": "Garder le titre tiré du libellé", "operations": []}]})
        return sortie

    def ouvertes(self):
        vues, sortie = set(), []
        for t in super().ouvertes():
            if id(t) not in vues:
                vues.add(id(t))
                sortie.append(t)
        return sortie

    # -- rendu

    def rendre_ouvert(self):
        sortie = []
        for n, ligne in enumerate(self.lignes, 1):
            t = self.par_ligne.get(n)
            sortie.extend(m.rendre() for m in self.avant_ligne.get(n, []))
            if t is None:
                sortie.append(ligne)
            elif not getattr(t, "retiree", False) and not getattr(t, "deplacee", False):
                sortie.append(t.rendre())
            sortie.extend(e.rendre() for e in self.apres_ligne.get(n, []))
            if n in self.blanc_apres and self.apres_ligne.get(n) and n < len(self.lignes) and self.lignes[n].strip():
                sortie.append("")
        return "\n".join(sortie)


def _verifier_operation(op):
    if not isinstance(op, dict):
        raise Erreur("operations : chaque opération est un objet, pas %r" % (op,))
    nom = op.get("op")
    if nom not in OPS:
        raise Erreur("opération inconnue « %s » (admises : %s)" % (nom, ", ".join(sorted(OPS))))
    inconnues = set(op) - OPS[nom]
    if inconnues:
        raise Erreur("%s : clé inconnue %s (admises : %s)" % (nom, ", ".join(sorted(inconnues)), ", ".join(sorted(OPS[nom]))))
    if "fields" in op and not isinstance(op["fields"], dict):
        raise Erreur("%s : fields est un objet" % nom)


def preparer(ctx, props, maintenant=None):
    """Les fichiers préparés ({chemin: texte}) et le bilan ; `Erreur` au premier écart, rien d'écrit.
    `maintenant` donne l'heure d'une clôture du jour (`fait:AAAA-MM-JJ HH:MM`, #262)."""
    rdir = os.path.dirname(ctx["roadmap"])
    if audit.empreinte(rdir) != ctx.get("empreinte"):
        raise Erreur("la roadmap a changé depuis le contexte : relance tasks.py context, puis refais les opérations")
    operations = props.get("operations")
    if not isinstance(operations, list):
        raise Erreur("operations : une liste d'opérations")
    prep = _Tenue(ctx, maintenant)
    for op in operations:
        _verifier_operation(op)
    # #438 d'abord : un thème de plusieurs sœurs se range sous une mère commune ; une paire reste à #288 et #320.
    retenues, du_lot = un_groupe(ctx, operations, set())
    sujet_cles, sujet_questions = un_sujet(ctx, operations, retenues)
    retenues |= sujet_cles
    du_lot += sujet_questions
    a_verser_cles, a_verser_questions = un_lot(ctx, operations, retenues)
    retenues |= a_verser_cles
    du_lot += a_verser_questions
    for op in operations:
        if op.get("key") in retenues:
            continue
        {"add": prep.ajouter, "update": prep.completer_tache, "reschedule": prep.redater,
         "done": prep.cocher, "drop": prep.abandonner, "pause": prep.mettre_en_pause,
         "handoff": prep.passer_la_main}[op["op"]](op)
    questions = props.get("questions") or []
    if not isinstance(questions, list):
        raise Erreur("questions : une liste de questions (le format de l'audit)")
    for q in questions:
        ref = str(q.get("task") or "").lstrip("#") if isinstance(q, dict) else ""
        if ref in retenues:
            # Sa tâche attend la question du sujet (#288) : la question vise l'action, sans tâche.
            q = dict({c: v for c, v in q.items() if c != "task"},
                     about=next(audit._propre(o.get("label")) for o in operations if o.get("key") == ref))
        prep.attendre(q)
    du_lot += prep.questions_de_titre()
    for q in du_lot:
        prep.attendre(q)
    prep.boucles()
    apres_o = prep.rendre_ouvert()
    apres_f = prep.rendre_fait()
    prep.controler(apres_o, apres_f or "")
    fichiers = {ctx["roadmap"]: apres_o}
    if apres_f is not None:
        fichiers[ctx["fait"]] = apres_f
    chemin_bilans = prep.journal["chemin"]
    bilans = prep.rendre_bilans(chemin_bilans)
    if bilans is not None:
        fichiers[chemin_bilans] = bilans
    fichiers = {p: t for p, t in fichiers.items() if audit._lire_fichier(p) != t}
    bilan = dict(prep.tenue, ids_crees=prep.bilan["ids_crees"], notes=prep.notes, comptes=prep.bilan.get("comptes"),
                 questions=du_lot,
                 compte_rendu=prep.compte, jour=prep.jour,
                 lignes={os.path.basename(p): audit.lignes_changees(audit._lire_fichier(p), t) for p, t in fichiers.items()})
    return fichiers, bilan


def ecrire(dossier, chemin_ops, appliquer=False, maintenant=None, en_json=False):
    """L'essai à blanc (les lignes rendues, rien d'écrit), ou, avec `appliquer`, l'écriture tout ou
    rien après sauvegarde ; refusée quand le projet écrit sa roadmap par son outil (`ecriture`)."""
    maintenant = maintenant or datetime.datetime.now()
    try:
        with open(chemin_ops, encoding="utf-8") as f:
            props = json.load(f)
        with open(props["context"], encoding="utf-8") as f:
            ctx = json.load(f)
    except (OSError, ValueError, KeyError, TypeError) as e:
        raise Erreur("opérations ou contexte illisibles (%s) : %s" % (chemin_ops, e))
    _, rdir, _ = audit.situer(dossier)
    if os.path.realpath(os.path.dirname(ctx["roadmap"])) != os.path.realpath(rdir):
        raise Erreur("le contexte porte sur %s, pas sur la roadmap de %s" % (ctx["roadmap"], dossier))
    decl = ob.declarations(ctx["dossier"])
    fichiers, bilan = preparer(ctx, props, maintenant)
    bilan.update(ecrit=False, sauvegarde=None)
    if appliquer:
        if decl["ecriture_illisible"]:
            raise Erreur("ecriture de .claude/roadmap.json est illisible : rien ne s'écrit tant qu'elle n'est pas "
                         "corrigée (skill doctor)")
        if decl["ecriture"]:
            raise Erreur("ce projet écrit sa roadmap par %s (%s) : passe-lui les lignes de l'essai à blanc"
                         % (decl["ecriture"]["outil"], decl["ecriture"]["consigne"]))
        if fichiers:
            lieu = audit.lieu_de_sauvegarde(ctx["dossier"], rdir)
            bilan["sauvegarde"] = audit._sauvegarder(lieu, maintenant, fichiers, prefixe="sauvegarde-tasks-")
            im._ecrire_tout(fichiers)
            bilan["ecrit"] = True
    outil = decl["ecriture"]["outil"] if decl["ecriture"] else None
    bilan["etat"] = "ecrit" if bilan["ecrit"] else ("outil" if outil else "essai")
    bilan["markdown"] = rendre_compte_rendu(bilan["compte_rendu"], bilan["etat"], bilan["jour"], outil,
                                            bilan["sauvegarde"])
    afficher(bilan, decl, en_json)
    return bilan


def _plat(texte):
    return str(texte).replace("\n", " ")


def rendre_compte_rendu(cr, etat, jour, outil=None, sauvegarde=None):
    """Le compte rendu d'une écriture, sous le verdict du message (#275, parti A, après #261 et #232) :
    une ligne « - Roadmap : #N … » par tâche, sans glyphe ; chaque question à part, en citation
    « > **Une question :** … ». Ni titre, ni rubrique, ni « rien ». `jour` reste pour la signature."""
    suites = cr.get("suites") or []
    closes = {s["close"] for s in suites}
    lignes = ["- Roadmap : #%s close, la suite chez %s passe en #%s" % (s["close"], s["tiers"], s["suite"]) for s in suites]
    for a in cr["ajoutees"]:
        extra = [x for x in ("sous #" + a["parent"] if a["parent"] else "",
                             "due " + _jj_mm(a["due"]) if a["due"] else "") if x]
        lignes.append("- Roadmap : #%s ajoutée — %s%s" % (a["id"], _plat(a["libelle"]), " (%s)" % ", ".join(extra) if extra else ""))
    for m in cr["mises_a_jour"]:
        if m["id"] not in closes:
            lignes.append("- Roadmap : #%s %s — %s" % (m["id"], _plat(m["change"]), _plat(m["libelle"])))
    questions = ["> **Une question :** %s%s (%s) — recommandé : %s" % ("#%s " % q["id"] if q["id"] else "", _plat(q["question"]),
                                                                      q["raison"], _plat(q["recommande"])) for q in cr["t_attendent"]]
    blocs = (["\n".join(lignes)] if lignes else []) + questions
    lignes = blocs
    corps = "\n\n".join(lignes) if lignes else "Roadmap : rien ne change."
    tete = {"ecrit": "", "essai": "Essai à blanc, rien n'est écrit :", "outil": "À passer à %s :" % outil}[etat]
    md = "%s\n\n%s" % (tete, corps) if tete and lignes else corps
    if sauvegarde:
        md += "\n\nSauvegarde : `%s`" % sauvegarde
    return md


def afficher(bilan, decl, en_json=False):
    """Les lignes changées et la consigne pour le modèle d'abord, le compte rendu en dernier : la
    skill le recopie tel quel (#232). `en_json` : le bilan entier, compte rendu compris."""
    if en_json:
        print(json.dumps(bilan, ensure_ascii=False, indent=2))
        return
    for nom, lignes in bilan["lignes"].items():
        print("%s :" % nom)
        for l in lignes:
            print("  %s" % l)
    if bilan["ecrit"]:
        print("Écrit.")
    elif decl["ecriture"]:
        print("Essai à blanc : rien n'est écrit. Ce projet écrit sa roadmap par %s : %s. Passe-lui ces lignes ; --apply est refusé."
              % (decl["ecriture"]["outil"], decl["ecriture"]["consigne"]))
    else:
        print("Essai à blanc : rien n'est écrit. Relance avec --apply pour écrire.")
    if bilan.get("questions"):
        print()
        print("Questions du lot (#288), à poser par le formulaire ; l'option choisie part dans un nouveau write :")
        print(json.dumps(bilan["questions"], ensure_ascii=False, indent=2))
    print()
    print(bilan["markdown"])


def migration_prio(ctx):
    """#300 : les opérations de `write` qui passent une roadmap à `prio:oui` : `prio:1` devient `oui`,
    `prio:2` et `prio:3` s'effacent. Une ligne sans `id:` ou prise par une session est laissée, dite
    dans `skipped` ; la reprendre à la main, ou une fois libre."""
    operations, laissees = [], []
    for t in ctx["taches"]:
        p = t["champs"].get("prio")
        if p not in ("1", "2", "3"):
            continue
        pourquoi = ("sans id:" if not t.get("id") else
                    "prise par une session" if t["champs"].get("qui") and t["champs"].get("branche") else None)
        if pourquoi:
            laissees.append({"id": t.get("id") or "", "libelle": t["libelle"], "pourquoi": pourquoi})
        else:
            operations.append({"op": "update", "id": t["id"], "fields": {"prio": "oui" if p == "1" else None}})
    return {"operations": operations, "skipped": laissees}


def main(argv=None):
    import argparse
    p = argparse.ArgumentParser(prog="tasks.py", description="Tenir la roadmap au quotidien (#158).")
    sous = p.add_subparsers(dest="commande", required=True)
    c = sous.add_parser("context", help="rules, declarations, next id and tasks, as JSON")
    c.add_argument("dossier")
    r = sous.add_parser("match", help="the tasks on the same subject as an action, as JSON")
    r.add_argument("dossier")
    r.add_argument("--text", dest="texte", action="append", required=True)
    r.add_argument("--zone", action="append", help="a place the action touches (file, function, command, area); "
                                                   "repeat it, it applies to every --text (#320)")
    lo = sous.add_parser("lots", help="the open tasks that should be poured into one another, as questions (#320)")
    lo.add_argument("dossier")
    gr = sous.add_parser("groupes", help="the open tasks of one theme that should share a parent, as questions (#438)")
    gr.add_argument("dossier")
    m = sous.add_parser("prio-oui", help="the write operations that move prio:1, 2, 3 to prio:oui (#300), as JSON")
    m.add_argument("dossier")
    e = sous.add_parser("write", help="dry run of the operations, or write them with --apply")
    e.add_argument("dossier")
    e.add_argument("--operations", required=True)
    e.add_argument("--apply", dest="appliquer", action="store_true")
    e.add_argument("--json", dest="en_json", action="store_true", help="the bilan and its report as JSON")
    for s in (c, r, lo, gr, m, e):
        s.add_argument("--day", dest="jour", help="YYYY-MM-DD (today by default)")
        s.add_argument("--perso", default="~/.claude/roadmap-perso.json", help=argparse.SUPPRESS)
    args = p.parse_args(argv)
    try:
        if args.commande == "context":
            print(json.dumps(contexte(args.dossier, args.jour, args.perso), ensure_ascii=False, indent=2))
        elif args.commande == "lots":
            print(json.dumps({"questions": lots(contexte(args.dossier, args.jour, args.perso))}, ensure_ascii=False, indent=2))
        elif args.commande == "groupes":
            print(json.dumps({"questions": groupes(contexte(args.dossier, args.jour, args.perso))}, ensure_ascii=False, indent=2))
        elif args.commande == "prio-oui":
            print(json.dumps(migration_prio(contexte(args.dossier, args.jour, args.perso)), ensure_ascii=False, indent=2))
        elif args.commande == "match":
            ctx = contexte(args.dossier, args.jour, args.perso)
            print(json.dumps([rapprocher(ctx, t, zone=args.zone) for t in args.texte], ensure_ascii=False, indent=2))
        else:
            maintenant = datetime.datetime.now()
            if args.jour:
                maintenant = datetime.datetime.combine(datetime.date.fromisoformat(args.jour), maintenant.time())
            ecrire(args.dossier, args.operations, args.appliquer, maintenant, args.en_json)
    except Erreur as err:
        print("Refusé : %s" % err, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
