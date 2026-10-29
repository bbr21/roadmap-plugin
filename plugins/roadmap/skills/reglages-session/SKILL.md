---
name: reglages-session
description: "Lit et change les réglages de session que le plugin roadmap injecte au démarrage de chaque session : questions par le formulaire AskUserQuestion, mode ADHD (une ligne d'étape en tête de chaque message, réponses courtes), réponses en français, et mode autonome (mode Code, éteint par défaut : Claude suit sa recommandation sauf question d'architecture, Maestro fusionne seul une branche prête). Les allume ou les éteint, pour toutes les sessions, dans ~/.claude/reglages-session.json, et répare ce fichier s'il est illisible. Ouvre aussi le volet Réglages (/reglages). Déclenche sur « mes réglages de session », « coupe le mode ADHD », « arrête les questions en formulaire », « réponds en anglais », « mets Maestro en autonome », « coupe l'autonomie », « quels réglages sont allumés », « mes réglages sont illisibles ». Pas pour les options du panneau (me, autoOpen, theme, launchBypass…), changées dans ce volet ou le menu du plugin, ni pour les règles d'un projet, qui vivent dans son CLAUDE.md."
---

# Réglages de session

Le plugin `roadmap` lit `~/.claude/reglages-session.json` au démarrage de chaque session (et
après `/clear` ou un compactage) et en donne le texte au modèle comme contexte additionnel. Quatre
réglages : les trois premiers sont allumés quand le fichier n'existe pas, `autonome` est éteint.

| Clé | Ce qu'elle demande |
|---|---|
| `questions` | Toute question à l'utilisateur par l'outil AskUserQuestion, jamais en texte libre : deux à quatre options qui s'excluent, chacune avec son compromis, la recommandation en premier marquée « (recommandé) », quatre questions au plus par envoi. Sauf quand la demande vient de l'utilisateur (une question, « je ne comprends pas », « explique-moi ») : l'explication s'écrit en texte, le tour s'arrête sans formulaire, et la question ne revient qu'après sa réponse. Jamais de question pour un geste qu'un outil fait : un volet de l'app fermé ou masqué (navigateur, fichier, diff, terminal) s'ouvre par la session elle-même (`preview_start`, `mcp__ccd_view__show_pane`). |
| `adhd` | Chaque message commence par une ligne en gras : emoji, étape en cours sur le total, nom (`🔄 **2/3 Clé**` ; détour `⚠️ **2/3 Clé** ↳ nom refusé` ; fin `✅ **3/3 Fait**` ; noms figés ; pas de ligne pour une réponse courte hors tâche) ; puis une phrase de constat et, s'il en reste une, la seule action ou décision qui revient à l'utilisateur (jamais un geste qu'un outil fait) ; réponses très courtes, listes et gras, pas de pavé. Un tour de travail finit par le bloc de fin de tour : `**État**`, `**À toi**`, `**Session**` (#85). Une ligne de rappel l'accompagne à chaque message de l'utilisateur, et la fin de tour renvoie Claude une fois quand le bloc manque. |
| `francais` | Réponses en français, récaps et boîte de fin compris. |
| `autonome` | Mode Code seulement, éteint par défaut (#77). Claude suit sa recommandation au lieu de poser la question et dit en une ligne ce qu'il a choisi. Il ne pose plus que les questions d'architecture : un choix qui s'écrirait dans `docs/decisions.md` (contrat entre composants, nouvelle dépendance ou service, vision ou non-objectif touché). Un Lot ou Maestro fusionne seul la branche prête d'une de ses sessions (tests verts, à jour de `main`, diff relu par lui), une à la fois, tests rejoués après chaque fusion ; éteint, la fusion attend le clic de l'utilisateur. Lancer une session et archiver gardent son clic. En mode Projet, sans fusion, il ne vaut que pour les gestes hors du code (plus bas). |

Le plugin dit aussi, dans toute session, la règle des **gestes hors du code** (#82) : un geste
qu'une tâche demande hors du dépôt (tâche planifiée, réglage d'un service, formulaire) se fait par
la session, d'abord par un connecteur MCP ou une API, sinon dans le volet navigateur, jamais par un
texte à coller. Ce n'est pas un réglage : elle ne s'éteint pas. Seule sa confirmation suit
`autonome`, en mode Code comme en mode Projet : allumé, aucune ; éteint, un oui avant d'écrire.

## Le volet Réglages

`/reglages`, le bouton « Réglages » du panneau Roadmap, et cette skill quand elle est lancée
ouvrent le volet du plugin : chaque réglage de session avec On et Off côte à côte, puis les
options du panneau ; l'explication d'une ligne s'affiche au survol. L'utilisateur y change un réglage d'un clic ; le volet suit aussi le fichier quand
cette skill l'écrit. Après un changement fait ici, dis-lui que le volet le montre. Tapée seule,
`/roadmap:reglages-session` ouvre le volet, d'une ligne, sans dérouler la skill.

## Le fichier

```json
{
  "questions": true,
  "adhd": true,
  "francais": true,
  "autonome": true
}
```

- Une clé absente vaut `true`, sauf `autonome`, qui vaut `false` ; une valeur qui n'est pas `true`
  ou `false` est ignorée.
- Une seule valeur par réglage, pour toutes les sessions : plus d'exception par projet (#91,
  2026-10-29). Un ancien `projets` est ignoré ; ne le recrée pas.
- Fichier illisible (JSON cassé) : les valeurs par défaut s'appliquent (`autonome` éteint) et la
  session le dit.

## Lire

Lis le fichier (`cat ~/.claude/reglages-session.json`) ; absent, tout est allumé sauf `autonome`.
Montre l'état en quatre lignes, une par réglage.

## Changer

1. Ce qu'il faut changer est clair (« coupe le mode ADHD ») : fais-le sans demander. Sinon,
   pose la question par AskUserQuestion, selon le réglage `questions` ci-dessus : une question à
   choix multiples « Quels réglages garder allumés ? ». Une demande « pour ce projet » : dis
   que les réglages valent pour toutes les sessions, et qu'une règle propre à un projet va dans
   son `CLAUDE.md`.
2. Écris le fichier en JSON valide, en gardant ce qui n'est pas touché.
3. Relis-le : `python3 -c "import json,os;print(json.load(open(os.path.expanduser('~/.claude/reglages-session.json'))))"`.
4. Dis que le changement vaut pour les sessions ouvertes après (ou après `/clear`), et applique-le
   tout de suite dans la conversation en cours.

## Réparer

Le démarrage a dit « illisible » : montre la ligne fautive, réécris le fichier valide avec les
valeurs qu'il portait, relis-le.
