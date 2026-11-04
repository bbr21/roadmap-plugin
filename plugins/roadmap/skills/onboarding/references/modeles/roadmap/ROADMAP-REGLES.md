# Règles de la roadmap de {{NOM}}

Ce fichier dit **quoi** relever dans la roadmap ; la skill `tasks` du plugin roadmap dit **comment** l'écrire, et [ROADMAP.md](ROADMAP.md) dit **où** en est chaque tâche. Toute skill qui touche la roadmap (`tasks`, `audit`, Maestro) le lit en entier à chaque passage, et ses règles l'emportent sur les siennes, sauf les « Règles de l'outil », qui viennent du plugin et valent pour tout projet. {{QUI}} le tient à jour : une règle nouvelle s'ajoute ici, une ligne, avec sa date.

## Règles de l'outil

Fixées par le plugin roadmap, les mêmes dans tout projet : elles ne se changent ni ne se contredisent ici. Les règles propres au projet viennent plus bas.

### Le modèle

- Un sujet, une tâche : avant d'écrire, une action se rapproche des tâches ouvertes et closes du même sujet ; déjà couverte, elle complète cette tâche au lieu d'en ouvrir une autre.
- Une étape d'un sujet suivi devient une fille de sa tâche (`parent:N`) ; une tâche seule qui reçoit une étape devient une mère.
- Un sujet de plusieurs tâches devient une mère : un titre court qui nomme le sujet (son `nom:`, 40 caractères au plus), sans action à elle ; ses filles portent les actions.
- Deux niveaux au plus : une fille n'a pas de filles.
- Une ligne, une action : un verbe à l'infinitif et son objet ; plusieurs actions liées par « ; » se découpent en filles.
- Une fille prend l'axe de sa mère ; la priorité (`prio:`) se pose sur la mère ou la tâche seule, jamais sur une fille ; la date d'une mère est celle de sa prochaine fille ouverte.
- `après:` relie deux sœurs, ou deux tâches sans parent, jamais en boucle.

### Numéros et champs

- Chaque tâche a son `id:`, unique sur la roadmap et ses tâches closes, jamais réutilisé, gardé à la clôture ; une ligne neuve prend le plus grand plus un.
- L'axe vient en premier champ, parmi ceux que déclare l'en-tête de la roadmap ; une clé est connue ou déclarée ; une date s'écrit AAAA-MM-JJ, et `ouvert:` comme `fait:` ne sont jamais dans le futur.
- Une ligne neuve n'est jamais prise : une session la prend à la main (`qui:<branche>` et `branche:<branche>`), dans « En cours », avec `ouvert:`, `due:`, `qui:` et `après:` (`après:-` si rien ne la précède).

### Clôture

- Une tâche se coche sur preuve, à la date de la preuve, et descend en tête de `ROADMAP-fait.md` avec `fait:` et son bilan.
- Une mère se coche avec sa dernière fille ouverte, sauf une mère récurrente (`tous:`) ; tant qu'elle a une fille ouverte, elle ne se coche, ne s'abandonne ni ne se met en pause.
- Une communication pas encore partie (email, message, invitation) ne se coche jamais : son fichier dit d'abord « Statut : envoyé le AAAA-MM-JJ (par où) ».
- Clôture partielle : une tâche faite de notre côté mais dont la ligne attend encore un tiers (validation, activation, réponse, correction chez un vendor ou un client) se clôt sur ce qui est fait, et sa suite, qui ne porte que l'attente du tiers, s'ouvre dans le même tour (skill `tasks`, opération `handoff`) ; on le dit en une ligne, « #A close, la suite chez <tiers> passe en #B ».
- Une tâche close ne se rouvre, ne se renumérote ni ne se réécrit sans question.

## Ce qui devient une tâche

- Un travail demandé qui change le code, la doc d'architecture ou le déploiement : une fonction, un correctif, une refonte, une migration.
- Un engagement daté, même hors du code : une réponse à donner, un rendez-vous à préparer.
- Une idée de code qui naît d'une question ou d'une livraison : sa ligne s'ouvre avant d'être codée, dans sa propre session.

## Ce qui n'en devient jamais une

- Une question, une lecture, une explication : elles se règlent dans la conversation.
- Une retouche d'une ligne, ou une modification de la roadmap elle-même.
- Un défaut trouvé au test du lot qu'une session vient de livrer : il se corrige dans cette session, sous la même ligne.
- Une action déjà couverte par une tâche du même sujet : elle complète cette tâche.

## Règles du projet

- _Les règles propres à {{NOM}} : les axes et ce qu'ils couvrent, les préfixes, le jour d'une revue, qui tranche quoi. Une ligne chacune._

## Preuves

Une tâche se coche sur preuve, à la date de la preuve :

- la fusion sur `main` (commit ou PR) qui livre la tâche ;
- le déploiement vérifié, quand la tâche se déploie.
