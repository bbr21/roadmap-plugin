# Documentation

Un fait vit dans un seul fichier ; les autres pointent vers lui. Les documents sans date dans leur nom décrivent l'état actuel ; l'historique est dans `decisions.md` et les dossiers de `plans/`.

## Par où commencer

| Document | Contenu | L'ouvrir quand |
|---|---|---|
| [vision.md](vision.md) | Cap, critère de réussite, principes, non-objectifs | Avant de cadrer une demande ; pour vérifier qu'elle va dans le bon sens |
| [architecture.md](architecture.md) | Composants, contrats, données, déploiement | Avant de toucher au code |
| [decisions.md](decisions.md) | Journal daté des décisions, avec le pourquoi et ce qui a été écarté | Quand on se demande « pourquoi c'est comme ça ? » |
| [../{{RM}}ROADMAP.md](../{{RM}}ROADMAP.md) | Tâches ouvertes, qui les tient, verrous | En début de session |

## Guides

| Guide | Contenu | L'ouvrir quand |
|---|---|---|
| [guides/](guides/README.md) | Les procédures faites à la main par {{QUI}} | Pour faire une de ces procédures |

## Chantiers

| Dossier | Contenu |
|---|---|
| [plans/_template/](plans/_template/spec.md) | Modèles de spec et de plan |
| [plans/inbox/ideas.md](plans/inbox/ideas.md) | Idées en une ligne |
| [plans/inbox/fiches/](plans/inbox/fiches/README.md) | Contexte long d'une idée |

Un nouveau chantier crée `plans/<type>-<slug>/spec.md` et `plan.md`, par exemple `plans/feat-export/` pour la branche `feat/export` (`scripts/new-session.sh --plan` le fait).
