#!/usr/bin/env python3
"""Mission cloud (#467, #473) : une tâche qui n'a besoin que des connecteurs (adBricks, Gmail, Sheets…) part en
mission, par la carte cloud de l'app lancée depuis un dépôt porte (`depot` de .claude/roadmap.json, le dépôt GitHub
du projet sans code). La carte est visible dans la barre latérale, BBR y écrit, sans branche ni PR : la mission pose
son rappel de retour `#ID · retour`, et Maestro relit sa fin (voir `docs/session-cloud.md`, « Une mission par carte »,
et la décision #473 de `docs/decisions.md`). La routine claude.ai à un seul passage reste la voie d'une tâche
planifiée, sans carte.

Le lancement et la lecture passent par l'outil RemoteTrigger de Claude Code (le jeton reste dans l'outil) : ce script
ne parle à aucun réseau, il prépare et il lit.

  python3 mission_cloud.py corps ID NOM [--connecteur UUID NOM URL]… [--modele M] [--environnement E] < consigne
      Le corps JSON de `RemoteTrigger create` : routine « #ID · NOM · mission », sans cron, éteinte (elle ne part que
      par `run`), sans dépôt, les connecteurs nommés, et la consigne suivie de la phrase de fin attendue.
  python3 mission_cloud.py fin [--ecrire ID --racine DOSSIER] < journal
      Lit la sortie de `RemoteTrigger get_run_log` : `en cours`, `fait`, `echec` ou `sans phrase`, et la phrase.
      Avec `--ecrire ID --racine DOSSIER`, garde aussi cet état pour le panneau (#469) dans `roadmap-missions.json`,
      sous `DOSSIER/.git/` s'il existe, sinon `DOSSIER/.claude/` (sans l'un ni l'autre : message et sortie 2). Le
      fichier fusionne avec l'existant, garde les 50 missions les plus récentes et s'écrit par un fichier temporaire
      renommé ; illisible, il est remplacé. Contrat : {"version": 1, "missions": {"<id>": {"etat": …, "phrase"?: …,
      "at": "<ISO UTC>"}}}. Maestro l'appelle ainsi à chaque relecture d'une mission.
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
import datetime
import json
import os
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
MISSIONS_FICHIER = "roadmap-missions.json"  # lu par le panneau (MISSIONS_FILE de hooks/parse.ts)
MISSIONS_MAX = 50
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


def consigne_de_ligne(id_tache, projet, libelle):
    """La consigne d'une carte de mission tirée de sa ligne (#510), celle que pose le ▶ Cloud du panneau
    (`missionCardPrompt`) : le libellé aplati (accents graves en apostrophes, blancs en un espace), puis l'ordre de
    ne faire que lui."""
    plat = " ".join(libelle.replace("`", "'").split()).rstrip(".")
    return consigne_carte(id_tache, "Mission #%s du projet %s : %s. Fais exactement ce que dit cette ligne, rien "
                                    "d'autre : une écriture qu'elle ne nomme pas ne se fait pas." % (id_tache, projet, plat))


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
    """L'état d'une mission d'après son journal : sa dernière ligne `result:` et la dernière phrase « Fait : » ou
    « Échec : » de la session, cherchée dans les fins de tour de Claude (#581 : une question posée après la phrase,
    et sa réponse, ne la font pas lire « sans phrase » ; cas de la mission AAFES #644)."""
    session = _json_tete(journal).get("session_id")
    # Seule la dernière ligne d'événement dit si la mission tourne encore : une ligne « result: » plus haut finit un
    # tour, pas la session (la personne a pu relancer la mission).
    evenements = [l.strip() for l in journal.splitlines() if EVENEMENT.match(l.strip())]
    resultat = RESULT.match(evenements[-1]) if evenements else None
    if resultat is None:
        return {"etat": "en cours", "phrase": None, "session": session}
    phrase = None
    # Du tour le plus récent au plus ancien : seules les fins de tour (`result:`) parlent pour Claude, jamais un
    # message de la personne ni une sortie d'outil.
    for ligne in reversed(evenements):
        tour = RESULT.match(ligne)
        texte = (tour.group(3) or "") if tour else ""
        debuts = [m.start() for m in PHRASE.finditer(texte)]
        if debuts:
            phrase = texte[debuts[-1]:].strip()[:PHRASE_MAX]
            break
    if resultat.group(2) == "true":
        etat = "echec"
    elif phrase is None:
        etat = "sans phrase"
    else:
        etat = "fait" if phrase.startswith("Fait") else "echec"
    return {"etat": etat, "phrase": phrase, "session": session}


def ecrire_etat(racine, id_tache, etat, maintenant=None, session=None):
    """Garde l'état d'une mission pour le panneau (#469) : `racine`/.git/ sinon `racine`/.claude/. Rend le chemin écrit.
    `session` : la session cloud lue au retour (`retour`), par laquelle le panneau archive la mission (#510, C8) ; une
    session déjà gardée reste quand elle n'est pas redite."""
    dossier = next((os.path.join(racine, d) for d in (".git", ".claude") if os.path.isdir(os.path.join(racine, d))), None)
    if dossier is None:
        raise ValueError("ni .git ni .claude dans %s" % racine)
    chemin = os.path.join(dossier, MISSIONS_FICHIER)
    missions = {}
    try:
        with open(chemin, encoding="utf-8") as f:
            lu = json.load(f)
        if isinstance(lu, dict) and lu.get("version") == 1 and isinstance(lu.get("missions"), dict):
            missions = {k: v for k, v in lu["missions"].items() if isinstance(v, dict)}
    except (OSError, ValueError):
        pass
    entree = {"etat": etat["etat"]}
    if etat.get("phrase"):
        entree["phrase"] = etat["phrase"]
    avant = missions.get(str(id_tache), {}).get("session")
    if session or avant:
        entree["session"] = session or avant
    quand = maintenant or datetime.datetime.now(datetime.timezone.utc)
    entree["at"] = quand.strftime("%Y-%m-%dT%H:%M:%SZ")
    missions[str(id_tache)] = entree
    recentes = sorted(missions.items(), key=lambda kv: str(kv[1].get("at", "")), reverse=True)[:MISSIONS_MAX]
    temporaire = "%s.%d.tmp" % (chemin, os.getpid())
    with open(temporaire, "w", encoding="utf-8") as f:
        json.dump({"version": 1, "missions": dict(recentes)}, f, ensure_ascii=False, indent=1)
    os.replace(temporaire, chemin)
    return chemin


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
    f = sub.add_parser("fin")
    f.add_argument("--ecrire", metavar="ID")
    f.add_argument("--racine", metavar="DOSSIER")
    f.add_argument("--session", metavar="SESSION", help="la session lue par `retour`, gardée pour l'archivage (#510)")
    t = sub.add_parser("trouver")
    t.add_argument("id")
    k = sub.add_parser("carte")
    k.add_argument("id")
    k.add_argument("--depot", metavar="DOSSIER", help="la consigne tirée de la ligne #id, celle du ▶ Cloud du panneau (#510)")
    r = sub.add_parser("retour")
    r.add_argument("id")
    a = p.parse_args(argv)
    if a.cmd == "fin" and bool(a.ecrire) != bool(a.racine):
        print("mission_cloud : --ecrire et --racine vont ensemble", file=sys.stderr)
        return 2
    if a.cmd == "carte" and a.depot:
        import brief_cloud  # noqa: E402 : la ligne et le nom du projet, lus comme le brief cloud
        try:
            ligne = brief_cloud.ligne_de(a.depot, a.id)
        except (brief_cloud.ErreurLigne, OSError, ValueError) as e:
            print("mission_cloud : %s" % e, file=sys.stderr)
            return 2
        print(consigne_de_ligne(a.id, brief_cloud.nom_projet(a.depot), ligne["libelle"]))
        return 0
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
        if a.ecrire:
            try:
                ecrire_etat(a.racine, a.ecrire, f, session=a.session)
            except (ValueError, OSError) as e:
                print("mission_cloud : %s" % e, file=sys.stderr)
                return 2
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
