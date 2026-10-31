---
name: reglages-session
description: "Lit et change les réglages de session que le plugin roadmap injecte au démarrage de chaque session : questions par le formulaire AskUserQuestion, mode ADHD (une ligne d'étape en tête de chaque message, réponses courtes), réponses en français, et mode autonome (éteint par défaut, dans les deux modes : Claude suit sa recommandation sauf question d'architecture, fusionne et publie seul). Les allume ou les éteint pour le projet de la session, chacun les siens, dans ~/.claude/reglages-session.json, et répare ce fichier s'il est illisible. Ouvre aussi le volet Réglages (/reglages). Déclenche sur « mes réglages de session », « coupe le mode ADHD », « arrête les questions en formulaire », « réponds en anglais », « mets Maestro en autonome », « coupe l'autonomie », « quels réglages sont allumés », « mes réglages sont illisibles ». Pas pour les options du panneau (me, autoOpen, theme, launchBypass…), changées dans ce volet ou le menu du plugin, ni pour les règles d'un projet, qui vivent dans son CLAUDE.md."
---

# Réglages de session

Le plugin `roadmap` lit `~/.claude/reglages-session.json` et en donne le texte au modèle au
démarrage de chaque session, après `/clear` et après une compaction. Sur un compte Team ou
Enterprise, où son démarrage est sauté (#116), le texte part avec le premier message, et avec le
message qui suit une compaction, que le plugin voit au contexte qui fond (#119). Un réglage changé
en cours de session (le volet, cette skill, une autre session du projet) revient au message suivant
de chaque session ouverte du projet : le bloc redonné remplace le précédent (#119). Une ligne de
rappel du mode ADHD accompagne chaque message. Quatre réglages : les trois premiers sont allumés quand le
fichier n'existe pas, `autonome` est éteint.

| Clé | Ce qu'elle demande |
|---|---|
| `questions` | Toute question à l'utilisateur par l'outil AskUserQuestion, jamais en texte libre : deux à quatre options qui s'excluent, chacune avec son compromis, la recommandation en premier marquée « (recommandé) », quatre questions au plus par envoi. Sauf quand la demande vient de l'utilisateur (une question, « je ne comprends pas », « explique-moi ») : l'explication s'écrit en texte, le tour s'arrête sans formulaire, et la question ne revient qu'après sa réponse. Jamais de question pour un geste qu'un outil fait : un volet de l'app fermé ou masqué (navigateur, fichier, diff, terminal) s'ouvre par la session elle-même (`preview_start`, `mcp__ccd_view__show_pane`). Éteint, le menu de Maestro (« Je lance lesquelles ? ») se pose aussi en texte (#119). |
| `adhd` | Chaque message commence par une ligne en gras : emoji d'état, étape sur le total, nom (en cours `⏳ **2/4 Écrire le plan**` ; finie `✅ **2/4 Écrire le plan**` ; détour `⚠️ **3/4 Coder et tester** ↳ test rouge` ; fin `✅ **4/4 Publier la version**`) ; les étapes sont celles de la liste d'étapes native, même ordre et même nom, un verbe et son objet, jamais renommées ; pas de ligne pour une réponse courte hors tâche (#107) ; puis une phrase de constat et, s'il en reste une, la seule action ou décision qui revient à l'utilisateur (jamais un geste qu'un outil fait) ; réponses très courtes, listes et gras, pas de pavé. Un tour de travail finit par le bloc de fin de tour (#85), trois lignes sans emoji depuis #123 : `**État**`, `**À toi**`, `**Session**` ; au dernier tour d'une session (à archiver), une fiche en tableau les remplace : Mission, Livré, État, À toi, Session (#123) ; son État dit, lu dans ROADMAP-fait, « fini : #N close le AAAA-MM-JJ » (« par Maestro » pour un enfant), et une ligne #N encore ouverte empêche de proposer l'archivage (#124). Une ligne de rappel l'accompagne à chaque message de l'utilisateur, et la fin de tour renvoie Claude une fois quand le bloc manque. Éteint, Maestro ne demande plus que des réponses courtes (#119). |
| `francais` | Réponses en français, récaps et boîte de fin compris. |
| `autonome` | En mode Code comme en mode Projet, éteint par défaut (#77, #105). Claude suit sa recommandation au lieu de poser la question et dit en une ligne ce qu'il a choisi. Il ne pose plus que les questions d'architecture : un choix qui s'écrirait dans `docs/decisions.md` (contrat entre composants, nouvelle dépendance ou service, vision ou non-objectif touché). Le réglage est l'autorisation durable de fusionner et de publier (release d'un plugin, déploiement, push de `main`) : aucune session ne demande « je fusionne ? » ni « je publie ? », elle le fait puis le dit en une ligne ; une skill de publication qui demande de valider le fond le tient pour validé par la tâche. Maestro fusionne seul la branche prête d'une de ses sessions (tests verts, à jour de `main`, diff relu par lui), une à la fois, tests rejoués après chaque fusion, et donne seul la main sur une ressource unique, publication comprise. Éteint, la fusion et la publication attendent le clic de l'utilisateur. Lancer une session et archiver gardent son clic ; un message envoyé en son nom ou un paiement se demandent toujours. |

Le plugin dit aussi, dans toute session, la règle des **gestes hors du code** (#82) : un geste
qu'une tâche demande hors du dépôt (tâche planifiée, réglage d'un service, formulaire) se fait par
la session, d'abord par un connecteur MCP ou une API, sinon dans le volet navigateur, jamais par un
texte à coller. Ce n'est pas un réglage : elle ne s'éteint pas. Seule sa confirmation suit
`autonome`, en mode Code comme en mode Projet : allumé, aucune ; éteint, un oui avant d'écrire.

## Le volet Réglages

`/reglages`, le bouton « Réglages » du panneau Roadmap, et cette skill quand elle est lancée
ouvrent le volet du plugin : la section « Claude et toi » porte les réglages de session du projet
où l'on est (sa portée le nomme : « ce projet (Roadmap) · au prochain message »), On et Off côte à
côte ; puis les options du plugin, en trois sections (Sessions lancées, Roadmap, Panneau). Le ⓘ
d'une ligne ouvre son explication sous elle (#118). L'utilisateur y change un réglage d'un clic ;
le volet suit aussi le fichier quand cette skill l'écrit. Après un changement fait ici, dis-lui que le volet le montre. Tapée seule,
`/roadmap:reglages-session` ouvre le volet, d'une ligne, sans dérouler la skill.

## Le fichier

```json
{
  "autonome": true,
  "projets": {
    "~/Projects/Roadmap": { "adhd": false },
    "~/Projects/Splitmybill": { "autonome": false }
  }
}
```

- Chaque projet a ses réglages (#102, 2026-10-29) : son bloc sous `projets`, de clé le dossier
  principal du dépôt en `~/` (un worktree compte pour son projet : prends le premier `worktree` de
  `git worktree list --porcelain`). Un bloc ne porte que les réglages changés dans ce projet.
- Un réglage absent du bloc prend la clé du haut du fichier, sinon son défaut : `true`, sauf
  `autonome`, qui vaut `false`. Une valeur qui n'est pas `true` ou `false` est ignorée.
- Hors dépôt git, le projet est le dossier de la session. Le dossier personnel ou `/` n'est pas
  un projet : seules les clés du haut comptent, et elles valent aussi pour les projets sans bloc.
- Deux blocs du même dossier (`~/…` et absolu) : le dernier l'emporte ; n'en crée pas un second.
- Fichier illisible (JSON cassé) : les valeurs par défaut s'appliquent (`autonome` éteint) et la
  session le dit.

## Lire

Lis le fichier (`cat ~/.claude/reglages-session.json`) ; absent, tout est allumé sauf `autonome`.
Montre l'état du projet de la session en quatre lignes, une par réglage, son nom en tête.

## Changer

1. Ce qu'il faut changer est clair (« coupe le mode ADHD ») : fais-le sans demander. Sinon,
   pose la question par AskUserQuestion, selon le réglage `questions` ci-dessus : une question à
   choix multiples « Quels réglages garder allumés ? ». Le changement vaut pour le projet de
   la session ; une demande pour un autre projet : son bloc ; « partout » : la clé du haut et la même clé dans chaque bloc qui la porte.
2. Écris le fichier en JSON valide, dans le bloc du projet, en gardant ce qui n'est pas touché.
3. Relis-le : `python3 -c "import json,os;print(json.load(open(os.path.expanduser('~/.claude/reglages-session.json'))))"`.
4. Dis que le changement vaut dès le message suivant, dans chaque session ouverte du projet (le
   plugin y redonne le bloc), et dans les sessions ouvertes ensuite. Applique-le tout de suite dans
   la conversation en cours.

## Réparer

Le démarrage a dit « illisible » : montre la ligne fautive, réécris le fichier valide avec les
valeurs qu'il portait, relis-le.
