#!/usr/bin/env python3
"""Le coût d'une tâche d'après les transcripts de Claude Code (#327).

cout_branche(branche) additionne les appels des sessions (et de leurs sous-agents) qui ont travaillé sur
la branche : tokens relus et écrits, part des appels Sonnet, part des appels de sous-agents.
"""
import datetime
import glob
import json
import os


def _lignes(chemin, branche):
    # Un test de sous-chaîne avant json.loads : la plupart des lignes sont d'autres branches ou d'autres types.
    motifs = ('"gitBranch":%s' % json.dumps(branche), '"gitBranch": %s' % json.dumps(branche))
    try:
        with open(chemin, encoding="utf-8") as f:
            for brut in f:
                if motifs[0] not in brut and motifs[1] not in brut:
                    continue
                try:
                    ligne = json.loads(brut)
                except ValueError:
                    continue
                if isinstance(ligne, dict):
                    yield ligne
    except OSError:
        return


def _instant(texte):
    try:
        return datetime.datetime.fromisoformat(str(texte).replace("Z", "+00:00")).timestamp()
    except ValueError:
        return None


def _echappe(chemin):
    """Le nom de dossier que Claude Code donne à un chemin : « / » et « . » deviennent « - »."""
    return chemin.replace("/", "-").replace(".", "-")


def cout_branche(branche, racine="~/.claude/projects", depuis=None, projet=None):
    """`depuis` (secondes epoch) saute les fichiers plus anciens ; `projet` (chemin) ne garde que ses dossiers
    de transcripts, worktrees compris. {"appels", "relus", "ecrits", "sonnet", "sous_agents", "duree_s"} ou None sans aucun appel."""
    racine = os.path.expanduser(racine)
    fichiers = [(c, False) for c in sorted(glob.glob(os.path.join(racine, "*", "*.jsonl")))]
    fichiers += [(c, True) for c in sorted(glob.glob(os.path.join(racine, "*", "*", "subagents", "*.jsonl")))]
    if projet:
        prefixe = _echappe(os.path.abspath(os.path.expanduser(projet)))
        fichiers = [(c, a) for c, a in fichiers
                    if os.path.relpath(c, racine).split(os.sep)[0].startswith(prefixe)]
    if depuis is not None:
        fichiers = [(c, a) for c, a in fichiers if os.path.getmtime(c) >= depuis]
    vus = set()
    appels = relus = ecrits = sonnet = sous = 0
    instants = []
    for chemin, sous_agent in fichiers:
        for ligne in _lignes(chemin, branche):
            if ligne.get("type") != "assistant" or ligne.get("gitBranch") != branche:
                continue
            msg = ligne.get("message")
            if not isinstance(msg, dict) or not isinstance(msg.get("usage"), dict):
                continue
            if msg.get("id"):
                if msg["id"] in vus:
                    continue
                vus.add(msg["id"])
            u = msg["usage"]
            nombre = lambda k: u[k] if isinstance(u.get(k), (int, float)) else 0  # noqa: E731
            appels += 1
            relus += nombre("input_tokens") + nombre("cache_read_input_tokens") + nombre("cache_creation_input_tokens")
            ecrits += nombre("output_tokens")
            sonnet += "sonnet" in str(msg.get("model", "")).lower()
            sous += sous_agent
            t = _instant(ligne.get("timestamp"))
            if t is not None:
                instants.append(t)
    if not appels:
        return None
    return {"appels": appels, "relus": int(relus), "ecrits": int(ecrits),
            "sonnet": round(100 * sonnet / appels), "sous_agents": round(100 * sous / appels),
            "duree_s": int(max(instants) - min(instants)) if instants else 0}
