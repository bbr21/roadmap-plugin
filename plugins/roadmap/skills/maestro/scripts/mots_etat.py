#!/usr/bin/env python3
"""Les mots de l'état, les mêmes pour le panneau et pour Maestro (#509).

Ce module est la jumelle de `STATE_WORDS` et de `CLOUD_FAILED` de `hooks/parse.ts` : `MOTS` dit les huit mots du
vocabulaire (un par état, quelle que soit la nature de la ligne), `ROUGES` la liste unique des conclusions de contrôle
qui rendent une PR rouge. `test_mots_etat.py` lit `parse.ts` et vérifie que les deux disent la même chose.

`mot_pr(etat)` traduit un état de `suivi_cloud.etat_pr` en `(mot, détail)`, comme `cloudWords` du panneau.

Python 3.9 et plus, bibliothèque standard seulement.
"""

MOTS = {
    "todo": "à lancer",
    "live": "en session",
    "wait": "t'attend",
    "ready": "prête",
    "merged": "fusionnée",
    "test": "en test",
    "done": "livrée",
    "cancelled": "annulée",
}

ROUGES = frozenset({"FAILURE", "ERROR", "CANCELLED", "TIMED_OUT", "ACTION_REQUIRED", "STARTUP_FAILURE"})

# état de `suivi_cloud.etat_pr` -> (clé de MOTS, détail)
_PR = {
    "aucune": ("live", "pas encore de PR"),
    "ouverte": ("live", "contrôles en cours"),
    "en cours": ("live", "contrôles en cours"),
    "rouges": ("wait", "contrôles rouges"),
    "prête": ("ready", "Maestro fusionne"),
    "fusionnée": ("merged", "suite de main, puis publication"),
    "fermée": ("wait", "PR fermée sans fusion"),
    "inconnu": ("live", "état de la PR inconnu"),
    "attend une réponse": ("wait", "attend une réponse"),  # #580 : le mot de la session sur une PR ouverte
    "bloquée": ("wait", "bloquée"),
}


def mot_pr(etat):
    """`(mot, détail)` d'un état de PR ; un état inattendu se lit comme « inconnu »."""
    cle, detail = _PR.get(etat, _PR["inconnu"])
    return MOTS[cle], detail
