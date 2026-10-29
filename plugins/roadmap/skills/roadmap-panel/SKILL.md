---
name: roadmap-panel
description: "Branche un projet sur le panneau Roadmap de Claude Code (plugin roadmap) et le dépanne : où le panneau cherche la roadmap, le fichier .claude/roadmap.json à écrire, ses réglages. Déclenche sur « ajoute ce projet au panneau roadmap », « le panneau roadmap ne s'ouvre pas », « /roadmap dit qu'il n'y a pas de roadmap », « change les sujets du panneau », « le panneau doit lire une autre roadmap ». Pas pour tenir la roadmap elle-même (ajouter, compléter ou cocher une tâche), qui relève de cowork-roadmap, ni pour une roadmap tenue dans Cowork même, ni pour poser la structure et la roadmap d'un projet, de code ou en mode Projet (onboarding), ni pour vérifier qu'un projet est branché (doctor)."
---

# Brancher un projet sur le panneau Roadmap

## Lancée seule : ouvrir le panneau

L'utilisateur tape `/roadmap:roadmap-panel` sans rien d'autre quand le panneau ne s'est pas ouvert
seul : il faut le montrer, pas un diagnostic. Le mod répond lui-même, comme `/roadmap`, sans passer par le
modèle. Si ce texte arrive quand même, une ligne en tête dit que le panneau vient de s'ouvrir :
réponds d'une seule ligne, « Panneau de la roadmap <nom> ouvert. », sans rien vérifier. Le reste de
la skill ne sert qu'à une demande de plus (brancher, changer les sujets, dépanner).

Le plugin `roadmap` est un mod Claude Code : un panneau à côté du chat, dans l'onglet Code de
l'app de bureau, qui montre la roadmap du projet de la session. Il ne fait que lire ; la roadmap
se tient comme d'habitude (`cowork-roadmap`, ou les règles du dépôt).

## Où le panneau cherche la roadmap

Pour le projet de la session, un worktree remontant toujours à son dossier principal :

1. `.claude/roadmap.json` dans le projet ;
2. les sources déclarées dans le fichier local de l'utilisateur, `~/.claude/roadmap-perso.json`
   (une roadmap que montrent plusieurs dossiers, reconnus au début de leur chemin) ;
3. un `ROADMAP.md` à la racine du projet.

Rien des trois : pas de panneau, et `/roadmap` le dit.

## Brancher un projet

La roadmap est à la racine du projet, sous le nom `ROADMAP.md` : rien à faire, le panneau la
trouve. Un projet de code la reçoit avec toute sa structure par la skill `onboarding`, dans un dossier `roadmap/` que désigne `.claude/roadmap.json`. Ses tâches closes vont dans `ROADMAP-fait.md`, à côté. La skill `doctor` dit si tout est branché.

Elle est ailleurs, ou il faut un nom, des sujets ou d'autres noms pour « À moi » : écrire
`.claude/roadmap.json` à la racine du projet, tous les champs facultatifs.

```json
{
  "name": "Clipping",
  "dir": "docs",
  "me": ["Alex"],
  "subjects": ["Montage", "Diffusion", "Contrats"]
}
```

- `dir` : le dossier qui contient `ROADMAP.md`, relatif au projet ou absolu (un dossier Cowork,
  par exemple). Absent : la racine du projet.
- `subjects` : la liste fermée des sujets qui rangent les tâches. Absent : le modèle choisit des
  sujets courts lui-même.
- `me` : les valeurs d'« attend » (et de `resp:`) qui veulent dire l'utilisateur. Absent : le réglage `me` du plugin, sinon `me` du fichier local.

Le mode et ses réglages (#76), facultatifs aussi :

```json
{
  "mode": "projet",
  "requis": ["id", "ouvert", "due", "resp", "parent", "après"],
  "cles": { "type": ["Réunion", "Email"], "client": [] },
  "vue": "echeance"
}
```

- `mode` : `code` (défaut, un projet de code) ou `projet` (gestion de projet sans code : sessions
  lancées sans worktree, brief sans méthode de code, pas de rappel « commit sans test », Maestro
  qui ne propose que les tâches de la personne).
- `requis` : les champs exigés sur chaque tâche ouverte ; le panneau signale une ligne écrite sans
  eux, sans la refuser. Défaut : aucun en mode Code, les six ci-dessus en mode Projet.
- `cles` : des clés en plus de la grammaire (les tags d'un Notion), chacune avec ses valeurs
  admises (liste vide : libre) ; le détail d'une tâche les montre, la recherche les lit.
- `vue` : le rangement à l'ouverture : `echeance`, `responsable`, `arbre`, `sujet` ou `jour`.
  Défaut : `echeance` en mode Projet, par sujet en mode Code. Le bouton du panneau passe aux autres.

Le rangement avant l'archivage (#101), facultatif : un projet qui range sa mémoire en fin de
sujet (AAFES, skill `aafes-memory`) le dit, et la fin de tour ne propose l'archivage de la session,
sa tâche cochée, qu'une fois la ligne de rangement écrite dans une réponse de la session.

```json
{ "rangement": { "skill": "aafes-memory", "ligne": "Rangé dans" } }
```

- `skill` : la skill qui range la mémoire, nommée dans le rappel. Sans elle, pas de réglage.
- `ligne` : le début de la ligne qui dit le rangement, en début de ligne d'une réponse ou de la
  boîte de fin (sans casse, accents, gras ni puce). Défaut : « Rangé dans ». « Rien à ranger »
  vaut toujours, pour un sujet sans rien de durable.
- Ligne absente : la fin de tour rappelle la règle de rangement au lieu de proposer l'archivage,
  puis le propose dès que la ligne est écrite. Sans ce réglage, rien ne change.

Un réglage inconnu ou d'un mauvais type est ignoré, et la skill `doctor` le signale.

Une ligne se lit si elle suit la grammaire des roadmaps du plugin, l'axe en premier :

```
- [ ] Libellé à l'infinitif `[axe | attend:Qui | ouvert:AAAA-MM-JJ | due:AAAA-MM-JJ | src:… | fiche:…]`
```

En mode Projet s'y ajoutent `resp:Nom` (la personne qui porte la tâche, jamais `-`), `parent:N` ou
`parent:#N` (la tâche mère, `-` sans) et `après:N,M` (les prérequises, `-` sans).

Montrer à l'utilisateur le fichier avant de l'écrire dans un dépôt qui n'est pas le sien.

## Réglages du plugin

Dans le menu de configuration de Claude Code : `me` (vide par défaut : les noms du fichier local), `autoOpen`
(ouvrir le panneau au démarrage, défaut oui), `titleModel` (modèle des titres courts, défaut
sonnet). Un changement recharge le panneau.

## Le fichier local de l'utilisateur

`~/.claude/roadmap-perso.json`, hors de tout dépôt, propre à la machine (#79) ; l'onboarding y
écrit `me` s'il manque. Les deux clés sont facultatives.

```json
{
  "me": ["Alex", "AL"],
  "sources": [
    { "name": "Client X", "match": ["/Users/alex/Projects/client-x", "/Users/alex/Projects/client-x-"],
      "dir": "/Users/alex/Projects/Client X Cowork", "subjects": ["Commercial", "Données"] }
  ]
}
```

- `me` : les noms de l'utilisateur ; le premier est celui que Claude emploie avec lui, les autres
  comptent aussi « À moi ». Le réglage `me` du plugin, rempli, l'emporte. Sans nom, Claude dit
  « l'utilisateur ».
- `sources` : une roadmap que montrent plusieurs dossiers sans `.claude/roadmap.json` (les
  worktrees d'un dépôt, par exemple) : `match`, les débuts de chemin reconnus (le plus long
  l'emporte) ; `dir`, le dossier de `ROADMAP.md` ; `name`, `subjects` et `me` comme dans
  `.claude/roadmap.json`.

## Dépanner

- Le panneau ne s'ouvre pas : la session n'est dans aucun des trois cas ci-dessus, ou `autoOpen`
  est coupé ; `/roadmap` l'ouvre et dit ce qui manque.
- Le panneau est vide (« Nothing to show yet ») : l'app a refusé un dessin ; la raison est sur une
  ligne grise de la conversation, ou dans le journal de débogage (`claude --debug`).
- Les tâches sont toutes « À classer » : les titres courts sont en cours d'écriture ; ils arrivent
  au fil des réponses du modèle et ne se redemandent que pour une tâche nouvelle ou modifiée.
- Une tâche ne passe pas « en cours » alors qu'une session écrit sa ligne : la session est un Lot,
  nommée « Lot … » ou qui a lancé au moins deux sessions encore ouvertes (elle coordonne des
  features, jamais rattachée à une tâche ; skill `lot`), ou elle porte déjà un autre
  numéro « #N · … ». Le panneau ne renomme aucune session : le titre « #N · titre court » se pose
  au lancement (▶ de la liste, « Lancer » ou « Vérifier » du détail).
- « Ouvrir la fiche » ouvre l'app par défaut du Mac : le fichier n'est pas dans un dossier de la
  session, que le panneau Fichiers de Claude Code n'affiche pas.
- « Annuler la tâche » refuse et le dit sous la confirmation, sans rien écrire : `cowork.py` a
  refusé (libellé contenu dans celui d'une autre tâche ouverte, bilan invalide), le dépôt n'est pas
  sur main, ROADMAP y a des modifications non committées, `git pull` a échoué, ou la ligne a bougé
  depuis l'affichage. « Annulée, mais pas committée » ou « pas poussée » : la ligne est déjà
  descendue, il reste le commit ou le push à faire à la main.
- Les clics sont lents : chaque session note ses 40 derniers dessins sous la clé `perf` du store du
  plugin (`~/.claude/plugins/store/roadmap_inline-*.json`, 120 relevés en tout, `mod` dit quelle
  session) : `clickMs` (du clic à la fin du dessin),
  `ms` et `loadMs` (durée du dessin, dont la lecture des données), `cached` (données en mémoire),
  `elements`, `svg`, `clients`, `kb`. Au-delà d'environ 250 Svg ou 200 Ko par dessin, l'app gèle.
  Deux autres sortes de relevés : `kind: 'open'` (clic sur `#N` ou « Ouvrir la session » : `openMs`
  du clic au retour de l'outil, `via` = `focus` | `link` | `note`) et `kind: 'refresh'` (relecture
  des sessions : `listMs`, `probeMs`, `calls` = appels d'outil, `fast` = relecture rapprochée).
