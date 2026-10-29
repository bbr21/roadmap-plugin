---
name: doctor
description: "Checklist d'un projet branché sur le système roadmap, en lecture seule. Mode Code : outils (git, node, python3, gh connecté), dépôt sur main et poussé sur GitHub, roadmap trouvée et conforme, node scripts/check.mjs, plugin roadmap actif, Superpowers et chaque skill de méthode que citent les sessions lancées, sa mise à jour, swiftui-pro sur un projet iOS. Mode Projet (sans code) : python3, roadmap, réglages de .claude/roadmap.json, champs exigés des tâches ouvertes, plugin roadmap, et Superpowers en À voir s'il manque : il y est facultatif. Une ligne OK, KO ou À voir par point, avec la commande qui corrige. Lancé en fin d'onboarding. Déclenche sur « doctor », « lance le doctor sur ce projet », « tout est branché ? », « checklist du projet », « le projet est prêt pour Maestro ? », « Superpowers est bien installé ? », « pourquoi Maestro ne voit rien ». Pas pour un dossier Cowork (son propre doctor), ni pour corriger : le doctor dit quoi faire."
---

# Doctor d'un projet

## Ce qu'il vérifie

Tout ce dont la roadmap, le panneau et Maestro ont besoin pour marcher dans un projet, et rien de
plus. Il ne change rien : ni au projet, ni à la machine.

| Point | OK quand |
|---|---|
| Outils | `git`, `node`, `python3` et `gh` sont là, et `gh` est connecté à un compte |
| Dépôt git | le dossier principal est sur `main` |
| GitHub | `origin` pointe sur GitHub, et `main` n'a rien de plus ni de moins qu'`origin/main` (d'après le dernier fetch) |
| Roadmap | le panneau la trouve (`.claude/roadmap.json`, sinon `ROADMAP.md` à la racine), dans le dépôt donc sur GitHub |
| Structure | le format de l'onboarding est complet (CLAUDE.md, roadmap, hook de démarrage, scripts) |
| Contrôle du projet | `node scripts/check.mjs` du projet passe |
| Champs exigés | chaque tâche lancée (`qui:` ou `branche:`) porte `ouvert`, `due`, `qui` et `après`, ou les champs de `requis` de `.claude/roadmap.json` (`[]` : pas de ligne) ; sinon À voir, avec le compte |
| Plugin roadmap | installé et allumé, dans la version que l'app charge |
| Superpowers | installé et allumé |
| Skills de méthode | chaque skill que citent les sessions lancées existe dans la version installée : une skill renommée par Superpowers se voit ici |
| Mise à jour de Superpowers | installé par l'app : suivie par l'app, avec la date de la dernière ; installé par le terminal : automatique, sinon la date de la dernière et comment l'allumer |
| Skill swiftui-pro | seulement dans un projet Swift : installée |
| Nom de l'utilisateur | `me` de `~/.claude/roadmap-perso.json` porte un nom (sinon À voir : Claude dit « l'utilisateur ») |

### En mode Projet

Quand `.claude/roadmap.json` dit `"mode": "projet"` (#76), la checklist change : ni dépôt git, ni
GitHub, ni `check.mjs`, ni `swiftui-pro`.

| Point | OK quand |
|---|---|
| Outils | `python3` ; `git` seulement si le dossier est un dépôt |
| Roadmap | le panneau la trouve |
| Structure | `CLAUDE.md` de règles Projet, la roadmap et `ROADMAP-fait.md`, des `id:` sur chaque ligne |
| Réglages | `vue`, `cles` et `requis` de `.claude/roadmap.json` compris par le panneau ; sinon À voir |
| Champs exigés | chaque tâche ouverte porte les champs de `requis` ; sinon À voir, avec le compte (une ligne écrite hors de Claude Code n'est signalée qu'ici) |
| Plugin roadmap | comme en mode Code |
| Superpowers, sa mise à jour | facultatif (#94) : absent ou éteint, À voir avec la commande, jamais KO |
| Nom de l'utilisateur | comme en mode Code |
| Skills de méthode | celles que le brief Projet propose sans les exiger : `brainstorming`, `writing-plans` ; une qui manque est À voir |

La liste de ce qui est exigé est dans `references/requis.json` (`projet` pour le mode Projet). Les skills de méthode y suivent
celles que le plugin cite dans le brief des sessions (`hooks/parse.ts` du plugin) : un test du
plugin refuse la publication si les deux listes divergent.

## Le lancer

Depuis le dossier de cette skill (le chemin donné au chargement de la skill) :

```bash
python3 "<dossier de la skill>/scripts/doctor.py" <dossier du projet>
```

Sans dossier, il prend le dossier courant ; d'un worktree, il remonte au dossier principal.
`--json` rend le même diagnostic en JSON. Code de retour 1 s'il y a un KO. Le script est dans
`scripts/doctor.py` ; il se lance sur la machine de l'utilisateur (terminal, Claude Code, ou l'outil
« Control your Mac »), pas dans un conteneur.

Les plugins qu'il juge sont ceux que l'app charge : d'abord son magasin
(`~/Library/Application Support/Claude/local-agent-mode-sessions/<compte>/<org>/rpm/`, celui du
compte de la session, sinon le plus récent), puis `claude plugin list --json` pour les plugins
installés par le terminal. La copie `synced` du terminal n'est lue que sans magasin : elle n'est
rafraîchie qu'au démarrage de `claude` dans un terminal et peut retarder sur l'app.

## Rendre compte

Un tableau court : une ligne par point, l'emoji et le détail ; sous chaque KO ou À voir, la
commande qui corrige, telle que le script la donne. Puis le verdict en une phrase.

- Un KO qui tient au projet (roadmap absente, structure incomplète, `check.mjs` en erreur) :
  propose la skill `onboarding`, qui complète sans rien écraser.
- Un KO qui tient à la machine (Superpowers absent, `gh` non connecté) : la commande, que l'utilisateur
  lance lui-même ; une installation de plugin ne se fait pas sans lui.
- Une skill de méthode introuvable : Superpowers l'a peut-être renommée. Après
  `claude plugin update`, si elle reste introuvable, la liste du plugin roadmap est à mettre à
  jour, dans `hooks/parse.ts` et dans `references/requis.json`, par la mise à jour du dépôt du
  plugin.
- Tout est vert : dis-le en une phrase, et que « Maestro » marche dans ce projet.
