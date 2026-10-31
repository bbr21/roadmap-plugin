# Roadmap

Les tâches ouvertes de {{NOM}}. Ce fichier ne se modifie que dans le dossier principal (`{{DOSSIER}}`), sur `main`, jamais dans un worktree, et chaque modification se committe aussitôt (`git -C {{DOSSIER}} commit {{RM}}ROADMAP.md -m …`{{PUSH_PRISE}}). C'est ce qui permet à plusieurs sessions de savoir qui tient quoi. Une tâche close part en tête de [ROADMAP-fait.md](ROADMAP-fait.md) avec `fait:AAAA-MM-JJ`, et son bilan s'ajoute à `ROADMAP-bilans.csv` (le panneau Roadmap le réclame).

## Grammaire d'une ligne

```
- [ ] <Verbe à l'infinitif + objet> `[axe | id:N | qui:… | attend:… | branche:… | verrou:…@AAAA-MM-JJ | ouvert:AAAA-MM-JJ | due:AAAA-MM-JJ | après:N | prio:1 | feedback:N | fait:AAAA-MM-JJ | spec:… | fiche:… | src:…]`
```

- **axe** (premier champ, sans clé) : {{AXES}}.
- **id** (juste après l'axe) : le numéro de la tâche, unique sur ROADMAP.md et ROADMAP-fait.md, jamais réutilisé, gardé quand la ligne descend dans ROADMAP-fait. Une ligne neuve prend le plus grand des deux fichiers plus un : le hook de démarrage l'affiche, `node scripts/check.mjs` le vérifie. Le panneau Roadmap montre ce numéro (#N) et suit la tâche par lui.
- **qui** : la branche de la session qui tient la tâche, ou {{QUI}}. Une ligne avec `qui:` et `branche:` est prise : une autre session ne la reprend pas. Une ligne prise est toujours dans « En cours ».
- **attend** : ce qui bloque, et qui doit agir (souvent {{QUI}}).
- **verrou** : ressource unique réservée, datée, par exemple `verrou:{{VERROU_EXEMPLE}}@AAAA-MM-JJ`. Liste des verrous : [CLAUDE.md]({{RM_UP}}CLAUDE.md#verrous).
- **due** : échéance. **après** : le numéro de la tâche à faire d'abord ; le panneau Roadmap range la chaîne dans l'ordre d'exécution, reliée par un trait et numérotée.
- **feedback** : les numéros des retours reçus (`feedback:12,15`).
- **prio** : facultatif, `1` (urgent), `2` (important) ou `3` (quand on a le temps). Lu et contrôlé, mais le panneau ne l'affiche pas et ne range pas par lui.
- **spec** : dossier `docs/plans/<type>-<slug>/`. **fiche** : document de contexte. Sur une ligne prise, ils peuvent n'exister que sur sa branche jusqu'à la fusion ; `node scripts/check.mjs` les exige sur `main` pour une ligne libre ou close. **src** : d'où vient la demande.
- **fait** : date de clôture (et son heure, `fait:AAAA-MM-JJ HH:MM`), dans ROADMAP-fait seulement, suivie de ce qui a été livré.
- Seuls l'axe, `id:` et le libellé sont obligatoires. Une ligne prise porte aussi `ouvert:`, `due:`, `qui:` et `après:` (`après:-` si rien ne la précède) : le panneau Roadmap les rappelle à l'écriture.

## Cap

{{CAP}}

## En cours

## Prochain

- [ ] Écrire la vision de {{NOM}} : le cap, pour qui, le critère de réussite, les principes et les non-objectifs (docs/vision.md) `[dossier | id:1 | attend:{{QUI}} | ouvert:{{AUJOURDHUI}}]`

## Plus tard

## Attend {{QUI}}
