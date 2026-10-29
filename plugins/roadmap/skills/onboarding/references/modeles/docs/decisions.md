# Décisions

Journal daté, les plus récentes en tête. Une entrée : la décision, pourquoi, qui l'a prise, ce qui a été écarté. Une décision remplacée reste dans le journal, marquée « remplacée par ».

## {{AUJOURDHUI}} : {{NOM}} suit la structure commune des projets de code

- **Décision** : règles dans `CLAUDE.md` (150 lignes au plus), tâches dans `{{RM}}ROADMAP.md` numérotées par `id:` et tenues sur `main`, docs rangées sous `docs/`, une session = une branche = un worktree, verrous pour les ressources uniques, contrôle par `node scripts/check.mjs` et accueil par le hook `scripts/session-start.sh`.
- **Pourquoi** : plusieurs sessions travaillent en parallèle ; la roadmap sur `main` dit qui tient quoi, et le panneau Roadmap de Claude Code la montre.
- **Qui** : {{QUI}}, à la création du projet (skill `onboarding` du plugin roadmap).
- **Écarté** : une roadmap par branche (les sessions ne se verraient pas).
