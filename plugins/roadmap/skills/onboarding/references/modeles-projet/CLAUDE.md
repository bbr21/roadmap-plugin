# {{NOM}} : règles pour toute session

{{RESUME}}

Ce dossier se pilote en mode Projet du plugin roadmap : de la gestion de projet, sans code. Les tâches passent par les connecteurs de la session (messagerie, agenda, documents…). Ni branche, ni worktree, ni verrou, ni fusion.

## Démarrer une session

1. Lire `{{RM}}ROADMAP.md`, section « En cours » : ce que tiennent les autres sessions.
2. Prendre sa ligne : la mettre dans « En cours » avec `qui:<titre de la session>`. Un travail qui n'a pas sa ligne l'ouvre, avec le prochain `id:` (le plus grand des deux fichiers plus un).
3. Travailler dans ce dossier.

## Une tâche complète

Chaque tâche ouverte porte {{REQUIS}}. `parent:-` et `après:-` disent qu'elle n'a ni parent ni prérequise ; un parent porte un sujet et ses enfants ses étapes, sur deux niveaux au plus. Le panneau Roadmap signale une ligne écrite sans eux ; la grammaire est en tête de `{{RM}}ROADMAP.md`.

## Finir une tâche

1. Cocher la ligne, avec `fait:AAAA-MM-JJ HH:MM` et ce qui a été fait, et la descendre en tête de `{{RM}}ROADMAP-fait.md`.
2. Ajouter son bilan à `{{RM}}ROADMAP-bilans.csv` (`date,id,fait,souci,ressenti,cause,corrections,note`) : le panneau en tire sa Conclusion.
3. Dire à {{QUI}} ce qui a été fait et ce qui reste.

## Règles

1. **Rien ne part chez un tiers sans accord** : un email, un message, une invitation ou un document partagé se montrent à {{QUI}} avant l'envoi.
2. **La roadmap fait foi** : une tâche, une ligne ; rien d'important ne vit seulement dans une conversation.
3. **Secrets** : aucun jeton, mot de passe ni clé dans ce dossier.
4. **Maquettes avant un choix visuel** : la mise en page d'un document, d'un tableau ou d'une présentation passe par 2 ou 3 maquettes simples, la recommandation en premier, que {{QUI}} choisit avant qu'on la fasse. Elles s'appuient sur les modèles que déclare `design` de `.claude/roadmap.json` ; sans eux, on propose d'en poser (sauf maquette de démo).

## Carte

```
CLAUDE.md          ces règles
{{CARTE_ROADMAP}}
.claude/           roadmap.json : le mode Projet, les champs exigés, les clés déclarées, la vue du panneau
```
