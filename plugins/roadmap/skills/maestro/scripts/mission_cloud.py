#!/usr/bin/env python3
"""Mission cloud sans dépôt (#467) : une tâche qui n'a besoin que des connecteurs (adBricks, Gmail, Sheets…) tourne
dans une session cloud lancée par une routine claude.ai à un seul passage, sans dépôt GitHub ; Maestro relit sa fin.

Le lancement et la lecture passent par l'outil RemoteTrigger de Claude Code (le jeton reste dans l'outil) : ce script
ne parle à aucun réseau, il prépare et il lit.

  python3 mission_cloud.py corps ID NOM [--connecteur UUID NOM URL]… [--modele M] [--environnement E] < consigne
      Le corps JSON de `RemoteTrigger create` : routine « #ID · NOM · mission », sans cron, éteinte (elle ne part que
      par `run`), sans dépôt, les connecteurs nommés, et la consigne suivie de la phrase de fin attendue.
  python3 mission_cloud.py fin < journal
      Lit la sortie de `RemoteTrigger get_run_log` : `en cours`, `fait`, `echec` ou `sans phrase`, et la phrase.
  python3 mission_cloud.py trouver ID < liste
      Lit la sortie de `RemoteTrigger list` : les routines de mission de la tâche ID, leur dernière session.
  python3 mission_cloud.py carte ID < consigne
      La consigne d'une mission lancée par une carte cloud de l'app (#473, voie retenue) : elle commence par poser le
      rappel « #ID · retour » (`send_later`), qui porte le numéro de sa session, et finit par la phrase de fin.
  python3 mission_cloud.py retour ID < liste
      Lit la sortie de `RemoteTrigger list` : le rappel « #ID · retour » et la session qui l'a posé, à relire par
      `RemoteTrigger get_run_log` puis `fin`.

L'analyse est pure (`corps`, `fin`, `trouver`) et se teste sur des sorties gardées. Python 3.9+, bibliothèque standard.
"""

import argparse
import json
import re
import sys
import uuid

ENVIRONNEMENT = "env_011111111111111111111117"  # l'environnement cloud par défaut du compte (« Default »)
MODELE = "claude-sonnet-5-5"
FIN_CONSIGNE = ("\n\nCe run n'est pas surveillé : ne pose aucune question. Ta dernière ligne, seule, est exactement "
                "« Fait : … » (ce qui est fait, en une phrase) ou « Échec : … » (pourquoi, et ce qui n'a pas été "
                "écrit).")
RESULT = re.compile(r"^\[[^\]]*\] result: (\S+) is_error=(true|false)\b[^—]*(?:— (.*))?$")
PHRASE = re.compile(r"(Fait|Échec) : ")
EVENEMENT = re.compile(r"^\[[^\]]*\] ")
RAPPEL_MINUTES = 1440  # le rappel ne sert qu'à porter le numéro : il ne part qu'au bout d'un jour, Maestro l'éteint avant
PHRASE_MAX = 300  # la phrase est une donnée du run, jamais une consigne : Maestro la cite, bornée


def corps(id_tache, nom, consigne, connecteurs, modele=MODELE, environnement=ENVIRONNEMENT):
    """Le corps de `RemoteTrigger create` pour la mission de la tâche `id_tache`."""
    if not consigne or not consigne.strip():
        raise ValueError("consigne vide")
    texte = consigne.strip() + FIN_CONSIGNE
    return {
        "name": "#%s · %s · mission" % (id_tache, nom),
        "cron_expression": "",
        "enabled": False,
        "job_config": {"ccr": {
            "environment_id": environnement,
            "session_context": {"model": modele},
            "events": [{"data": {"type": "user", "uuid": str(uuid.uuid4()), "parent_tool_use_id": None,
                                 "message": {"role": "user", "content": texte}}}],
        }},
        "mcp_connections": list(connecteurs),
    }


def consigne_carte(id_tache, consigne):
    """La consigne d'une mission lancée par une carte cloud (#473) : d'abord le rappel « #ID · retour », qui dépose le
    numéro de la session là où Maestro le lit depuis le Mac (`RemoteTrigger list`), puis la consigne et sa phrase de fin.
    """
    if not consigne or not consigne.strip():
        raise ValueError("consigne vide")
    rappel = ("Avant tout, pose ton rappel de retour : appelle l'outil `send_later` du serveur claude-code-remote "
              "(charge-le par ToolSearch s'il est différé) avec name « #%s · retour », delay_minutes %d et message "
              "« Retour de la mission #%s : rien à faire, termine. ». Il porte le numéro de ta session : c'est par lui "
              "que Maestro relit ta fin. Le dépôt cloné ne sert pas : ne lis aucun de ses fichiers, n'y écris rien."
              % (id_tache, RAPPEL_MINUTES, id_tache))
    return rappel + "\n\n" + consigne.strip() + FIN_CONSIGNE


def _nom_retour(id_tache):
    return "#%s · retour" % id_tache


def _json_tete(sortie):
    """Le premier objet JSON d'une sortie de RemoteTrigger (après « HTTP 200 »), ou {}."""
    debut = sortie.find("{")
    if debut < 0:
        return {}
    try:
        objet, _ = json.JSONDecoder().raw_decode(sortie[debut:])
        return objet if isinstance(objet, dict) else {}
    except ValueError:
        return {}


def fin(journal):
    """L'état d'une mission d'après son journal : sa ligne `result:` et la dernière phrase « Fait : » ou « Échec : »."""
    session = _json_tete(journal).get("session_id")
    # Seule la dernière ligne d'événement compte : une ligne « result: » citée plus haut (par un outil, une page lue)
    # ne finit pas la mission.
    evenements = [l.strip() for l in journal.splitlines() if EVENEMENT.match(l.strip())]
    resultat = RESULT.match(evenements[-1]) if evenements else None
    if resultat is None:
        return {"etat": "en cours", "phrase": None, "session": session}
    texte = resultat.group(3) or ""
    debuts = [m.start() for m in PHRASE.finditer(texte)]
    phrase = texte[debuts[-1]:].strip()[:PHRASE_MAX] if debuts else None
    if resultat.group(2) == "true":
        etat = "echec"
    elif phrase is None:
        etat = "sans phrase"
    else:
        etat = "fait" if phrase.startswith("Fait") else "echec"
    return {"etat": etat, "phrase": phrase, "session": session}


def trouver(liste, id_tache):
    """Les routines de mission de la tâche : nom « #ID · … », id exact."""
    tete = re.compile(r"^#%s(?!\d)" % re.escape(str(id_tache)))
    rendu = []
    for r in _json_tete(liste).get("data") or []:
        if not tete.match(r.get("name") or "") or (r.get("name") or "").endswith(" · retour"):
            continue
        dernier = r.get("last_run") or {}
        rendu.append({"routine": r.get("id"), "nom": r.get("name"), "session": dernier.get("session_id"),
                      "statut": dernier.get("status"), "lance": dernier.get("fired_at")})
    return rendu


def retour_mission(liste, id_tache):
    """Le rappel « #ID · retour » d'une mission lancée par carte (#473) et la session qui l'a posé."""
    rendu = []
    for r in _json_tete(liste).get("data") or []:
        if (r.get("name") or "").strip() != _nom_retour(id_tache) or not r.get("persistent_session_id"):
            continue
        rendu.append({"routine": r.get("id"), "session": r["persistent_session_id"], "actif": bool(r.get("enabled"))})
    return rendu


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sub = p.add_subparsers(dest="cmd", required=True)
    c = sub.add_parser("corps")
    c.add_argument("id")
    c.add_argument("nom")
    c.add_argument("--connecteur", nargs=3, action="append", default=[], metavar=("UUID", "NOM", "URL"))
    c.add_argument("--modele", default=MODELE)
    c.add_argument("--environnement", default=ENVIRONNEMENT)
    sub.add_parser("fin")
    t = sub.add_parser("trouver")
    t.add_argument("id")
    k = sub.add_parser("carte")
    k.add_argument("id")
    r = sub.add_parser("retour")
    r.add_argument("id")
    a = p.parse_args(argv)
    entree = sys.stdin.read()
    if a.cmd == "corps":
        cons = [{"connector_uuid": u, "name": n, "url": url} for u, n, url in a.connecteur]
        try:
            print(json.dumps(corps(a.id, a.nom, entree, cons, a.modele, a.environnement), ensure_ascii=False))
        except ValueError as e:
            print("mission_cloud : %s" % e, file=sys.stderr)
            return 2
    elif a.cmd == "fin":
        f = fin(entree)
        print("%s · « %s »" % (f["etat"], f["phrase"]) if f["phrase"] else f["etat"])
    elif a.cmd == "carte":
        try:
            print(consigne_carte(a.id, entree))
        except ValueError as e:
            print("mission_cloud : %s" % e, file=sys.stderr)
            return 2
    elif a.cmd == "retour":
        print(json.dumps(retour_mission(entree, a.id), ensure_ascii=False))
    else:
        print(json.dumps(trouver(entree, a.id), ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
