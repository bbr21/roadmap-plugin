#!/usr/bin/env python3
"""La carte du gardien de Maestro (#528).

Maestro garde la conversation, les lignes et les lancements ; son gardien, une session permanente qu'il lance, seul
relit, fusionne, publie et clôt. Maestro pose la carte du gardien avec sa première carte de tâche, en projet de
code (à la demande en projet sans code), et l'utilisateur clique Start.

  python3 gardien.py carte DEPOT [--maestro ID]

Écrit la carte en JSON : `titre` (« Gardien · <dossier du projet> », par où le panneau reconnaît le gardien),
`model` et `effort` (le modèle qui code, effort haut : le gardien suit une procédure et tourne longtemps),
`use_worktree` (faux : il fusionne et publie dans le dossier principal), `travail` (`code` ou `projet`) et
`prompt`, le brief, ouvert par Mission, Fichiers, Fini quand (#194). Maestro pose la carte telle quelle
(`start_session`, `own_initiative`, `fresh`).

Le travail est `projet` quand la nature du projet l'est (#508, `reco_cloud.nature_du_depot` : `travail` de
DEPOT/.claude/roadmap.json, sinon les anciennes formes `mode` et `cloud: "missions"`, sinon la détection) : le
brief est alors celui du suivi sans code (relances, échéances, preuve avant clôture, point du jour). Un projet
hybride a des branches à fusionner : son gardien est celui du code.

Codes : 0, ou 2 quand DEPOT n'a pas de roadmap (DEPOT/roadmap/ROADMAP.md ou DEPOT/ROADMAP.md).

Python 3.9 et plus, bibliothèque standard seulement.
"""

import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import reco_cloud  # noqa: E402

MODEL = "claude-sonnet-5-5"
EFFORT = "high"


def roadmap_de(depot):
    """Le chemin de la roadmap du projet, sinon None."""
    for chemin in (os.path.join(depot, "roadmap", "ROADMAP.md"), os.path.join(depot, "ROADMAP.md")):
        if os.path.isfile(chemin):
            return chemin
    return None


def travail_de(depot):
    """`projet` pour un projet sans code, `code` sinon (hybride compris) : la nature du dépôt, lue comme la reco."""
    return "projet" if reco_cloud.nature_du_depot(depot) == "projet" else "code"


def titre_de(depot):
    nom = os.path.basename(os.path.normpath(depot)).strip()
    return f"Gardien · {nom}" if nom else "Gardien"


def brief_code(depot, a_maestro):
    return "\n".join([
        f"Mission : Tenir la livraison des tâches de ce Maestro (gardien, #528) : relire, fusionner une branche à la fois, publier et clore les lignes, pendant que Maestro garde la conversation.",
        f"Fichiers : le dossier principal {depot} (sa roadmap, ses branches, ses PR) ; aucun fichier de code à toi.",
        "Fini quand : tu ne finis pas tant que Maestro a des tâches en route ; chaque tâche prête est fusionnée, publiée, sa ligne close avec son bilan, et dite à Maestro en une ligne.",
        "---",
        "",
        "Tu es le gardien de Maestro. Charge d'abord la skill `roadmap:maestro` par l'outil Skill et lis-la en entier, puis suis sa section « Le gardien » : elle te donne les § 5 et § 6 (ordre des fusions, relecture, fusion, suite de main, publication, clôture), que tu fais à la place de Maestro.",
        "",
        "Ce que tu fais, toi seul :",
        "- tu reçois les « prête à fusionner » des sessions (message « Roadmap — nouvelle de ta session … ») et le réveil cloud des PR ; tu les traites dès qu'ils arrivent, dans l'ordre de fusion de la skill ;",
        "- tu relis le diff, tu vérifies les tests nommés par la session, tu fusionnes une branche à la fois par la règle du projet (« Finir un chantier » de son CLAUDE.md), tu fais rejouer la suite de main après une série, tu publies, tu clos la ligne avec son bilan ;",
        "- un conflit ou un test rouge repart à la session fautive, par message (ou par commentaire de PR pour une session cloud), le fichier et le test nommés ; tu ne corriges pas son code ;",
        "- clore une ligne par `tasks.py write --apply` poste lui-même sur la PR d'une tâche cloud le signal « ligne close par Maestro » (#588) : passe `version` dans l'opération `done`, et lis sa sortie ; un signal « NON posté » se poste à la main par la commande qu'elle donne, car une session cloud ne conclut que sur ce commentaire ;",
        f"- la ligne close, tu écris à {a_maestro} une seule ligne par tâche : « #N livrée X.Y.Z : ce qui change » (sans publication, « #N fusionnée : ce qui change »), avec ce qui lui revient s'il y a lieu (« rendu : ouvre sa preuve »).",
        "",
        "Ce que tu ne fais jamais : tu n'ouvres aucune ligne, tu ne poses aucune carte de tâche et tu ne lances aucune session (Maestro seul le fait) ; tu ne parles à l'utilisateur que pour un besoin de lui (un secret, un clic de fusion quand le réglage autonome est éteint), dans ta session.",
        "",
        "Tu n'as pas le contexte de Maestro : lis la roadmap, les PR, git et les comptes rendus des sessions. Ce que l'utilisateur décide avec Maestro et qui touche une livraison t'arrive par message de Maestro.",
        "",
        "Pour commencer : lis « En cours » de la roadmap et `list_sessions` (`linked: true`), pose ta liste d'étapes (`update_plan`), une étape par tâche en route dans l'ordre de fusion, puis traite ce qui est déjà prêt. Rien de prêt : finis ton tour en une ligne, les sessions te réveilleront.",
    ])


def brief_projet(depot, a_maestro):
    return "\n".join([
        "Mission : Tenir le suivi des tâches de ce Maestro (gardien, #528) : relances des tiers, échéances, preuve avant clôture et point du jour, pendant que Maestro garde la conversation.",
        f"Fichiers : le dossier {depot} (sa roadmap, ses fiches, ses livrables) ; tu n'y écris que les clôtures et leurs bilans.",
        "Fini quand : tu ne finis pas tant que Maestro a des tâches en route ; chaque tâche finie est close sur preuve avec son bilan, chaque relance due est signalée, et le point du jour est dit à Maestro.",
        "---",
        "",
        "Tu es le gardien de Maestro, dans un projet sans code. Charge d'abord la skill `roadmap:maestro` par l'outil Skill et lis-la en entier, puis suis sa section « Le gardien », partie « Sans code ».",
        "",
        "Ce que tu fais, toi seul :",
        "- les relances : chaque ligne qui attend un tiers (`attend:`) depuis plus longtemps que le délai de relance du projet ;",
        "- les échéances : chaque ligne dont l'échéance (`due:`) est passée ou tombe aujourd'hui ;",
        "- la preuve avant clôture : une session se dit finie, tu vérifies sa preuve (le livrable, le message parti, « Statut : envoyé le … »), puis tu clos la ligne avec son bilan par la skill `roadmap:tasks` ; une clôture partielle s'écrit en `handoff` ;",
        f"- le point du jour : à ta première lecture de la journée, puis à chaque changement, une ligne à {a_maestro} par sujet (« #N close : … », « #N à relancer chez <tiers> depuis J jours », « #N en retard de J jours »).",
        "",
        "Ce que tu ne fais jamais : tu n'ouvres aucune ligne, tu ne poses aucune carte et tu ne lances aucune session (Maestro seul le fait) ; tu n'envoies aucun message à un tiers ; tu ne parles à l'utilisateur que pour un besoin de lui, dans ta session.",
        "",
        "Tu n'as pas le contexte de Maestro : lis la roadmap, les fiches et les comptes rendus des sessions. Ce que l'utilisateur décide avec Maestro t'arrive par message de Maestro.",
        "",
        "Pour commencer : lis la roadmap et `list_sessions` (`linked: true`), pose ta liste d'étapes (`update_plan`), puis dis ton premier point du jour à Maestro.",
    ])


def carte(depot, maestro=None):
    """La carte du gardien de DEPOT : titre, modèle, effort, worktree, travail et brief."""
    depot = os.path.normpath(depot)
    travail = travail_de(depot)
    a_maestro = f"Maestro (SendMessage, {maestro})" if maestro else "Maestro (SendMessage vers la session qui t'a lancé)"
    brief = brief_projet(depot, a_maestro) if travail == "projet" else brief_code(depot, a_maestro)
    return {
        "titre": titre_de(depot),
        "model": MODEL,
        "effort": EFFORT,
        "use_worktree": False,
        "travail": travail,
        "prompt": brief,
    }


def main(argv=None):
    p = argparse.ArgumentParser(description="La carte du gardien de Maestro (#528).")
    sous = p.add_subparsers(dest="commande", required=True)
    c = sous.add_parser("carte", help="écrit la carte en JSON")
    c.add_argument("depot", help="le dossier principal du projet")
    c.add_argument("--maestro", help="l'id de la session Maestro, pour les messages du gardien")
    args = p.parse_args(argv)
    if roadmap_de(args.depot) is None:
        print(f"gardien : pas de roadmap dans {args.depot} (roadmap/ROADMAP.md ou ROADMAP.md)", file=sys.stderr)
        return 2
    print(json.dumps(carte(args.depot, args.maestro), ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
