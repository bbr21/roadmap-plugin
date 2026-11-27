#!/usr/bin/env python3
"""Le banc de `tasks.py write` (#649) : une roadmap synthétique de la taille des plus grosses (plusieurs centaines de
lignes ouvertes, plusieurs milliers de closes, libellés longs), puis le chrono d'un `write` d'un seul ajout, et, avec
`--profil`, les fonctions qui prennent le temps (cProfile).

python3 banc_tasks.py [--ouvertes 600] [--closes 4000] [--graine 649] [--apply] [--profil] [--dossier DIR]

Aucune donnée réelle : les mots viennent d'un vocabulaire inventé, tiré au hasard d'une graine fixe, la même roadmap à
chaque lancement. Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import cProfile
import hashlib
import io
import json
import os
import pstats
import random
import shutil
import sys
import tempfile
import time

ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ICI)
import tasks  # noqa: E402

JOUR = "2026-11-27"
AXES = ["budget", "creatif", "media", "contrat", "reporting", "equipe", "outil", "client"]
SECTIONS = ["En cours", "Prochain", "Plus tard"]
VERBES = ["Envoyer", "Préparer", "Relancer", "Valider", "Corriger", "Mettre à jour", "Vérifier", "Rédiger", "Planifier",
          "Lancer", "Clore", "Analyser", "Répondre à", "Caler", "Chiffrer", "Livrer", "Relire", "Négocier"]
COMMUNS = ("le la les du des de un une pour avec sans sur dans au aux et puis ou mais donc car par en à ne pas "
           "plus moins tout tous chaque même autre").split()
BASE = ("budget plan média campagne devis facture contrat brief créa bannière vidéo audience ciblage rapport "
        "pacing livraison palier enchère flight trafic format maquette version export tableau semaine mois "
        "trimestre réunion point appel email relance accord validation signature dossier fiche livrable "
        "écart dépense marge tarif remise commande stock produit fournisseur partenaire agence équipe "
        "calendrier date échéance retard priorité risque blocage test essai mesure conversion clic vue").split()


def _vocabulaire(rng, n=2500):
    """Des mots inventés (syllabes), plus les mots de métier : une rareté réaliste, quelques mots très fréquents et
    une longue traîne de noms propres et de codes."""
    syl = ["ba", "ri", "lo", "ve", "tan", "mor", "sel", "qui", "dra", "pon", "lu", "ce", "nar", "vio", "zen", "tor",
           "fa", "mi", "gul", "res"]
    mots = set(BASE)
    while len(mots) < n:
        w = "".join(rng.choice(syl) for _ in range(rng.randint(2, 4)))
        mots.add(w.capitalize() if rng.random() < 0.3 else w)
    return sorted(mots)


def _zipf(rng, vocab):
    # Rang tiré en loi de puissance : les premiers mots reviennent souvent, la traîne rarement.
    i = int(len(vocab) * (rng.random() ** 2.2))
    return vocab[min(i, len(vocab) - 1)]


def _libelle(rng, vocab, mots_min=25, mots_max=110, code=True):
    n = rng.randint(mots_min, mots_max)
    sortie = [rng.choice(VERBES)]
    for k in range(n):
        if rng.random() < 0.35:
            sortie.append(rng.choice(COMMUNS))
        else:
            sortie.append(_zipf(rng, vocab))
        if rng.random() < 0.04:
            sortie[-1] += ","
        if rng.random() < 0.015:
            sortie.append("(%s %d)" % (rng.choice(["PO", "IO", "réf"]), rng.randint(1000, 99999)))
    if rng.random() < 0.15:
        sortie.append("; voir 40-deliverables/%s/%s.md" % (rng.choice(AXES), _zipf(rng, vocab).lower()))
    # Des lieux nommés en code, comme dans une roadmap de code : un identifiant, un fichier, une commande.
    if code and rng.random() < 0.35:
        sortie.append("dans `%s`" % _zipf(rng, IDENTIFIANTS))
    if code and rng.random() < 0.25:
        sortie.append("(%s)" % _zipf(rng, FICHIERS))
    return " ".join(sortie).replace("`", "")


IDENTIFIANTS, FICHIERS = [], []


def generer(dossier, ouvertes=600, closes=4000, graine=649, code=True, niveau=None):
    """Écrit dans `dossier` un projet (.claude/roadmap.json, ROADMAP.md, ROADMAP-fait.md, ROADMAP-bilans.csv) ; rend
    le prochain numéro. `code` : des libellés qui nomment des identifiants et des fichiers, comme une roadmap de code ;
    sinon de la prose seule, comme un projet sans code. `niveau` : le grain du fichier de règles (#566), aucun par
    défaut."""
    rng = random.Random(graine)
    vocab = _vocabulaire(rng)
    petits = [w.lower() for w in vocab if w.lower() not in BASE]
    IDENTIFIANTS[:] = sorted({"%s_%s" % (rng.choice(petits), rng.choice(petits)) for _ in range(500)})
    FICHIERS[:] = sorted({"%s/%s.%s" % (rng.choice(["src", "app", "lib", "tools"]), rng.choice(petits),
                                         rng.choice(["py", "ts", "tsx", "md"])) for _ in range(400)})
    os.makedirs(os.path.join(dossier, ".claude"), exist_ok=True)
    with open(os.path.join(dossier, ".claude", "roadmap.json"), "w", encoding="utf-8") as f:
        json.dump({"mode": "projet", "me": "Caroline", "requis": ["id", "ouvert", "due", "resp", "parent", "après"],
                   "cles": {"dept": ["Bidding", "Staffing", "Media", "Finance"]}}, f)
    ids_clos = list(range(1, closes + 1))
    ids_ouverts = list(range(closes + 1, closes + ouvertes + 1))
    fait = ["# Roadmap : fait", "", "## Fait", ""]
    for i in reversed(ids_clos):
        jour = "2026-%02d-%02d" % (rng.randint(1, 11), rng.randint(1, 27))
        parent = rng.choice(ids_clos[:max(1, i - 1)]) if i > 5 and rng.random() < 0.3 else "-"
        champs = [rng.choice(AXES), "id:%d" % i, "ouvert:2026-01-02", "resp:Caroline", "parent:%s" % parent,
                  "après:-", "dept:%s" % rng.choice(["Bidding", "Staffing", "Media", "Finance"]), "fait:%s" % jour]
        if rng.random() < 0.3:
            champs.append("src:email de %s du %s" % (_zipf(rng, vocab), jour))
        fait.append("- [x] %s `[%s]`" % (_libelle(rng, vocab, 15, 80, code), " | ".join(champs)))
    entete = ["# Roadmap", "", "## Grammaire d'une ligne", "", "```",
              "- [ ] <Verbe> `[axe | id:N | ouvert:AAAA-MM-JJ]`", "```", "",
              "Axes en usage : %s." % ", ".join("`%s`" % a for a in AXES), "", "## Cap", "", "Tenir le compte.", ""]
    par_section = {s: [] for s in SECTIONS}
    meres = []
    for i in ids_ouverts:
        axe = rng.choice(AXES)
        parent = "-"
        if meres and rng.random() < 0.45:
            parent, axe = rng.choice(meres)
        apres = rng.choice(ids_ouverts[:max(1, i - closes - 1)]) if i > closes + 3 and rng.random() < 0.2 else "-"
        champs = [axe, "id:%d" % i, "ouvert:2026-10-%02d" % rng.randint(1, 27),
                  "due:2026-12-%02d" % rng.randint(1, 28), "resp:Caroline", "parent:%s" % parent, "après:%s" % apres,
                  "dept:%s" % rng.choice(["Bidding", "Staffing", "Media", "Finance"])]
        if rng.random() < 0.25:
            champs.append("attend:%s" % _zipf(rng, vocab))
        if rng.random() < 0.3:
            champs.append("src:email de %s" % _zipf(rng, vocab))
        if parent == "-" and rng.random() < 0.25:
            meres.append((i, axe))
        section = rng.choice(SECTIONS) if parent == "-" else "Prochain"
        par_section[section].append("- [ ] %s `[%s]`" % (_libelle(rng, vocab, code=code), " | ".join(champs)))
    ouvert = list(entete)
    for s in SECTIONS:
        ouvert += ["## %s" % s, ""] + par_section[s] + [""]
    with open(os.path.join(dossier, "ROADMAP.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(ouvert))
    with open(os.path.join(dossier, "ROADMAP-fait.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(fait) + "\n")
    with open(os.path.join(dossier, "ROADMAP-bilans.csv"), "w", encoding="utf-8") as f:
        f.write("date,id,fait,souci,ressenti,cause,corrections,note\n")
    if niveau:
        with open(os.path.join(dossier, "ROADMAP-REGLES.md"), "w", encoding="utf-8") as f:
            f.write("# Règles\n\n## Grain\n\n- niveau : %s\n" % niveau)
    with open(os.path.join(dossier, "perso.json"), "w", encoding="utf-8") as f:
        json.dump({"me": ["Caroline"]}, f)
    return closes + ouvertes + 1


AJOUT = {"op": "add", "key": "a", "axis": "budget", "section": "Prochain",
         "label": "Relancer le fournisseur sur la facture du palier de décembre et caler la date de livraison du "
                  "rapport de pacing avec l'agence, puis valider le devis de la campagne vidéo",
         "fields": {"due": "2026-12-04", "après": "-", "resp": "Caroline", "dept": "Finance"}}


def operations_types(dossier):
    """Les jeux d'opérations du test de non-régression : l'ajout neuf, un ajout du même sujet qu'une tâche ouverte
    (son libellé repris), la clôture d'une feuille avec la mise à jour d'une autre."""
    ctx = tasks.contexte(dossier, jour=JOUR, perso=os.path.join(dossier, "perso.json"))
    feuilles = [t for t in ctx["taches"] if not t.get("enfants")]
    proche = feuilles[len(feuilles) // 3]
    reprise = dict(AJOUT, key="b", axis=proche.get("axe") or "budget",
                   label="Relancer " + " ".join(proche["libelle"].split()[1:30]))
    return {
        "ajout": [AJOUT],
        "ajout_neuf": [dict(AJOUT, key="n", label="Commander les badges xylophonique du salon quadrimestriel")],
        "meme_sujet": [reprise],
        "cloture": [{"op": "done", "id": feuilles[1]["id"], "date": JOUR, "proof": "livré au client",
                     "bilan": {"fait": "livré", "ressenti": "fluide", "cause": "aucune", "corrections": 0, "note": "Livré sans souci.", "lieu": "mac",
                               "type": "sans-code"}},
                    {"op": "update", "id": feuilles[2]["id"], "fields": {"due": "2026-12-20"}}],
    }


def empreinte(dossier, operations):
    """L'empreinte de ce que `preparer` rend pour ces opérations : les fichiers rendus et ce que dit le bilan
    (questions, versements, notes, lignes, compte rendu), les chemins du dossier ôtés ; ou le texte du refus."""
    ctx = tasks.contexte(dossier, jour=JOUR, perso=os.path.join(dossier, "perso.json"))
    try:
        fichiers, bilan = tasks.preparer(ctx, {"operations": operations},
                                         tasks.datetime.datetime(2026, 11, 27, 10, 0))
        rendu = {"fichiers": {os.path.basename(p): t for p, t in fichiers.items()},
                 "bilan": {k: bilan.get(k) for k in ("questions", "versees", "notes", "lignes", "compte_rendu",
                                                     "ids_crees")}}
    except tasks.Erreur as e:
        rendu = {"refus": str(e)}
    texte = json.dumps(rendu, sort_keys=True, ensure_ascii=False, default=sorted).replace(dossier, "<dossier>")
    return hashlib.sha256(texte.encode("utf-8")).hexdigest()


def chronometrer(dossier, operations=None, appliquer=False, profil=False):
    """Le contexte puis le `write` des opérations (par défaut, un ajout) ; rend (secondes du write, bilan, profil
    texte ou None). Le contexte n'est pas compté : il se prend avant, comme Maestro le fait."""
    perso = os.path.join(dossier, "perso.json")
    ctx = tasks.contexte(dossier, jour=JOUR, perso=perso)
    chemin_ctx = os.path.join(dossier, "contexte.json")
    with open(chemin_ctx, "w", encoding="utf-8") as f:
        json.dump(ctx, f)
    chemin_ops = os.path.join(dossier, "operations.json")
    with open(chemin_ops, "w", encoding="utf-8") as f:
        json.dump({"context": chemin_ctx, "operations": operations or [AJOUT]}, f)
    maintenant = tasks.datetime.datetime(2026, 11, 27, 10, 0)
    pr = cProfile.Profile() if profil else None
    debut = time.perf_counter()
    sortie = io.StringIO()
    stdout, sys.stdout = sys.stdout, sortie
    try:
        if pr:
            pr.enable()
        bilan = tasks.ecrire(dossier, chemin_ops, appliquer=appliquer, maintenant=maintenant, en_json=True)
    finally:
        if pr:
            pr.disable()
        sys.stdout = stdout
    duree = time.perf_counter() - debut
    texte = None
    if pr:
        s = io.StringIO()
        pstats.Stats(pr, stream=s).sort_stats("cumulative").print_stats(30)
        texte = s.getvalue()
    return duree, bilan, texte


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("--ouvertes", type=int, default=600)
    p.add_argument("--closes", type=int, default=4000)
    p.add_argument("--graine", type=int, default=649)
    p.add_argument("--sans-code", action="store_true", help="de la prose seule, comme un projet sans code")
    p.add_argument("--niveau", choices=["regroupé", "équilibré", "découpé"])
    p.add_argument("--apply", action="store_true")
    p.add_argument("--profil", action="store_true")
    p.add_argument("--dossier")
    a = p.parse_args(argv)
    dossier = a.dossier or tempfile.mkdtemp(prefix="banc-tasks-")
    try:
        generer(dossier, a.ouvertes, a.closes, a.graine, not a.sans_code, a.niveau)
        duree, bilan, texte = chronometrer(dossier, appliquer=a.apply, profil=a.profil)
        print("write %s : %.2f s (%d ouvertes, %d closes), état %s"
              % ("--apply" if a.apply else "à blanc", duree, a.ouvertes, a.closes, bilan["etat"]))
        if texte:
            print(texte)
    finally:
        if not a.dossier:
            shutil.rmtree(dossier, ignore_errors=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
