# Règles de la roadmap de {{NOM}}

Ce fichier dit **quoi** relever dans la roadmap ; la skill `tasks` du plugin roadmap dit **comment** l'écrire, et [ROADMAP.md](ROADMAP.md) dit **où** en est chaque tâche. Toute skill qui touche la roadmap (`tasks`, `audit`, Maestro) le lit en entier à chaque passage, et ses règles l'emportent sur les siennes. {{QUI}} le tient à jour : une règle nouvelle s'ajoute ici, une ligne, avec sa date.

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
