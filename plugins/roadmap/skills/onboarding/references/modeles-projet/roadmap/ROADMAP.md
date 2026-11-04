# Roadmap

Les tâches de {{NOM}}, une ligne par tâche. Une tâche close part en tête de [ROADMAP-fait.md](ROADMAP-fait.md) avec `fait:AAAA-MM-JJ`, et son bilan s'ajoute à `ROADMAP-bilans.csv` (le panneau Roadmap le réclame).

## Grammaire d'une ligne

```
- [ ] <Verbe à l'infinitif + objet> `[axe | id:N | nom:… | ouvert:AAAA-MM-JJ | due:AAAA-MM-JJ | resp:Nom | parent:N | après:N,M | attend:… | qui:… | prio:oui | tous:mois | relance:AAAA-MM-JJ | fait:AAAA-MM-JJ | fiche:… | pj:… | src:…{{CLES_GRAMMAIRE}}]`
```

- **axe** (premier champ, sans clé) : {{AXES}}.
- **id** (juste après l'axe) : le numéro de la tâche, unique sur ROADMAP.md et ROADMAP-fait.md, jamais réutilisé, gardé quand la ligne descend dans ROADMAP-fait. Une ligne neuve prend le plus grand des deux fichiers plus un.
- **nom** (juste après `id:`) : le nom court de la tâche, choisi à la main, 40 caractères au plus, clair (2 à 5 mots qui disent de quoi elle parle) ; le panneau Roadmap le montre dans la liste, la fiche et le titre des sessions à la place du nom qu'il tire du libellé, et le garde quand le libellé change. Sans `nom:`, le panneau tire le sien.
- **ouvert** : le jour où la tâche naît. **due** : son échéance.
- **resp** : la personne qui porte la tâche, {{QUI}} ou une autre ; un nom pour suivre, pas une assignation, jamais `-`.
- **parent** : le numéro de sa tâche parent (`12` ou `#12`), ou `-` si elle n'en a pas. Une tâche est seule, parent (d'autres la citent) ou enfant, sur deux niveaux au plus ; un parent porte un sujet, ses enfants sont ses étapes et prennent son axe (le panneau Roadmap refuse un autre axe), et sa date est celle de son enfant ouvert le plus proche (`due:` facultatif sur lui). **après** : les numéros des tâches à faire d'abord, séparés par des virgules, ou `-` si elle n'en a aucune : entre enfants d'un même parent, ou entre parents ; le panneau Roadmap la bloque tant qu'une est ouverte, et un parent bloqué bloque ses enfants.
- **attend** : ce qui bloque, et qui doit agir. **qui** : la session qui tient la tâche.
- **prio** : facultatif, `oui` pour une tâche prioritaire, quelle que soit son échéance, mère, fille ou seule ; sans `prio:`, pas de priorité. Le panneau la montre par un drapeau devant le titre quand son réglage « Priorités » est allumé, et ne range pas par elle (#300).
- **tous** : la tâche revient au calendrier, `semaine`, `2semaines`, `mois`, `trimestre` ou `an` ; `due:` dit sa prochaine occurrence. Cochée, elle se reconduit : l'occurrence part dans ROADMAP-fait sous un numéro neuf (`src:#N`), la ligne reste avec la `due:` suivante.
- **relance** : la date de la dernière relance du tiers attendu (`attend:`) ; le panneau compte l'attente depuis elle, sinon depuis `ouvert:`.
- **fiche** : document de contexte. **pj** : les pièces jointes, des fichiers du dossier (captures, PDF, photos) séparés par des virgules ; le panneau Roadmap les montre dans la fiche de la tâche. **src** : d'où vient la tâche (email, réunion, note).{{CLES_PUCES}}
- **fait** : date de clôture (et son heure, `fait:AAAA-MM-JJ HH:MM`), dans ROADMAP-fait seulement, suivie de ce qui a été fait.
- Champs exigés sur chaque tâche ouverte : {{REQUIS}}. Le panneau Roadmap signale une ligne écrite sans eux.

## Cap

{{CAP}}

## En cours

## Prochain

- [ ] Lister les tâches en cours de {{NOM}}, chacune avec son échéance, son responsable, son parent et ses dépendances `[dossier | id:1 | ouvert:{{AUJOURDHUI}} | due:{{DANS_UNE_SEMAINE}} | resp:{{QUI}} | parent:- | après:-]`

## Plus tard

## Attend {{QUI}}
