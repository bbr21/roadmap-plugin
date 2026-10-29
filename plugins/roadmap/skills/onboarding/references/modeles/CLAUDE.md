# {{NOM}} : règles pour toute session

{{RESUME}} Le cap, les principes et les non-objectifs sont dans [docs/vision.md](docs/vision.md). Une demande qui les contredit se signale à {{QUI}} avant d'être codée.

Ce fichier ne garde que les règles et les pointeurs. Le détail vit dans `docs/`, dont l'index est [docs/README.md](docs/README.md). Plafond : 150 lignes.

Dossier principal : `{{DOSSIER}}`, toujours sur `main`. Plusieurs sessions travaillent en même temps, chacune dans son worktree.

## Démarrer une session

1. {{PULL}}lire `{{DOSSIER}}/{{RM}}ROADMAP.md`, celui du dossier principal et jamais la copie d'un worktree, section « En cours » : qui tient quoi, quels verrous sont posés. Le hook `scripts/session-start.sh` en affiche déjà les chantiers, les verrous, le prochain `id:` et les worktrees au démarrage.
2. Prendre sa ligne : dans ce même fichier, la déplacer (ou l'ajouter, avec le prochain `id:` que donne le hook) dans « En cours » avec `qui:<branche>`, `branche:<branche>`, `ouvert:`, `due:` et `après:` (ou `après:-`), puis `git -C {{DOSSIER}} commit {{RM}}ROADMAP.md -m "roadmap: take <slug>"`{{PUSH_PRISE}}. Ce commit est la prise du chantier.{{PUSH_REFUS}}
3. Créer sa copie de travail : `scripts/new-session.sh feat/<slug> "<titre>"` crée `{{DOSSIER}}-feat-<slug>`{{ENV_LIEN}}. Si la session tourne déjà dans un worktree créé par l'app : `scripts/new-session.sh --here feat/<slug> "<titre>"`, et c'est la branche de l'app qui va dans ROADMAP.
4. Ensuite, tout se fait dans le worktree : chemins absolus, ou changer le dossier de la session.
5. Pour un chantier qui n'est pas trivial, ajouter `--plan` : il crée `docs/plans/<type>-<slug>/spec.md` et `plan.md`. La spec s'écrit avant le code.

## Finir un chantier

Un chantier fini se ferme en entier, dans cet ordre, sans attendre :

{{ETAPES_FIN}}

## Carte

```
CLAUDE.md          ces règles
{{CARTE_ROADMAP}}docs/              vision, architecture, décisions, guides, plans
scripts/           check.mjs, session-start.sh, new-session.sh
```

Les dossiers du code s'ajoutent ici, une ligne chacun, dès qu'ils existent.

## Commandes

```bash
node scripts/check.mjs                   # avant un commit : liens des docs, grammaire de ROADMAP, CLAUDE.md ≤ 150 lignes, aucun secret suivi
{{COMMANDES}}scripts/new-session.sh [--here] [--plan] feat/<slug> "<titre>"   # copie de travail d'une session
```

## Travailler en parallèle

- **Une session = une branche = un worktree.** Préfixes : `feat/`, `fix/`, `spike/`, `docs/`. La règle vaut quelle que soit la taille de la tâche, parce que le dossier principal est partagé.
- **Le dossier principal reste sur `main`.** On n'y touche qu'à `{{RM}}ROADMAP.md`, `{{RM}}ROADMAP-fait.md`, `{{RM}}ROADMAP-bilans.csv` et `docs/plans/inbox/ideas.md`, et on y fusionne. Committer le seul fichier modifié, `git -C {{DOSSIER}} commit <fichier> -m …`{{PUSH_PRISE}}. Jamais `git add -A`, `git commit -a`, `git clean`, `git stash`, `git reset --hard` ni `git checkout <branche>` dans ce dossier : ils emportent ou détruisent le travail d'une autre session.
- **Dans un worktree**, ne jamais modifier `{{RM}}ROADMAP.md`, `{{RM}}ROADMAP-fait.md`, `{{RM}}ROADMAP-bilans.csv` ni `ideas.md` : ces fichiers ne vivent que sur `main`.
- **Fusionner** : toujours par les étapes de « Finir un chantier » plus haut.
- **Maestro coordonne** : la session mère, nommée « Maestro » (`/maestro`), lance une session par tâche, lit leurs comptes rendus, choisit l'ordre des fusions et fusionne pour elles, une branche à la fois (skill `roadmap:maestro`). Sous Maestro, une session ne fusionne pas, et ne touche une ressource unique qu'avec la main de Maestro : c'est lui qui pose et retire son verrou.
{{GITHUB_PUCE}}
### Verrous

Une ressource qui n'existe qu'une fois (déploiement, base, données de test, appareil) se réserve avant d'y toucher : poser le verrou sur sa ligne de ROADMAP, daté, committé sur `main`, par exemple `verrou:{{VERROU_EXEMPLE}}@AAAA-MM-JJ`. Une autre session ne touche pas à une ressource verrouillée.

{{VERROUS_TABLE}}

Le verrou tombe quand la session le retire (commit sur `main`), au plus tard à la fermeture de la ligne. Un verrou dont la branche n'apparaît plus dans `git worktree list` peut être abandonné : demander à {{QUI}} avant de le lever. Une nouvelle ressource unique ajoute sa ligne au tableau ; `node scripts/check.mjs` refuse un verrou qui n'y est pas.

## Règles

1. **Secrets.** L'agent ne saisit ni ne lit aucun jeton, clé ou secret : {{QUI}} les colle lui-même là où ils servent. {{REGLE_SECRETS}}
2. **La doc suit le code dans le même commit.** Voir « Où écrire quoi ». Une règle tient en une ou deux phrases ici, avec un lien vers le détail.
3. {{REGLE_LANGUE}}
4. **Maquettes avant un choix visuel.** Un écran, une vue, un composant ou une mise en page passe par 2 ou 3 maquettes simples, la recommandation en premier, que {{QUI}} choisit avant qu'on le code.

## Pièges

Aucun encore. Un piège rencontré s'écrit ici en une ligne : le symptôme, puis ce qu'il faut faire.

## Où écrire quoi

| Ce qui change | Où l'écrire |
|---|---|
| Cap, principes, non-objectifs | [docs/vision.md](docs/vision.md) |
| Fonctionnement actuel : composants, contrats, données | [docs/architecture.md](docs/architecture.md) |
| Une décision et son pourquoi | [docs/decisions.md](docs/decisions.md), une entrée datée |
| Procédure faite à la main par {{QUI}} | [docs/guides/](docs/guides/README.md) |
| Conception d'un chantier | `docs/plans/<type>-<slug>/spec.md` puis `plan.md` |
| Idée pas encore prise | [docs/plans/inbox/ideas.md](docs/plans/inbox/ideas.md), une ligne, sur `main` |
| Contexte long rattaché à une idée | `docs/plans/inbox/fiches/<slug>.md` |
| Tâche ouverte et qui la tient | [ROADMAP.md]({{RM}}ROADMAP.md), sur `main` ; une fois close, en tête de [ROADMAP-fait.md]({{RM}}ROADMAP-fait.md), son bilan dans `{{RM}}ROADMAP-bilans.csv` |
| Piège rencontré | « Pièges » ci-dessus, une ligne |

Les skills Superpowers (brainstorming, writing-plans) écrivent leurs specs et plans dans `docs/plans/<type>-<slug>/`, pas dans `docs/superpowers/`.

## Vocabulaire

- **Chantier** : une ligne de ROADMAP avec sa branche, son worktree et, si besoin, son dossier `docs/plans/<type>-<slug>/`.
- **Verrou** : champ `verrou:` d'une ligne de ROADMAP, qui réserve une ressource unique à une session.
- **Dossier principal** : `{{DOSSIER}}`, sur `main` ; les worktrees sont les copies de travail des sessions.
