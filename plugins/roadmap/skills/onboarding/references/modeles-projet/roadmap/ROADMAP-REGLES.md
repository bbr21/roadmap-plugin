# Règles de la roadmap de {{NOM}}

Ce fichier dit **quoi** relever dans la roadmap ; la skill `tasks` du plugin roadmap dit **comment** l'écrire, et [ROADMAP.md](ROADMAP.md) dit **où** en est chaque tâche. Toute skill qui touche la roadmap (`tasks`, `audit`) le lit en entier à chaque passage, et ses règles l'emportent sur les siennes, sauf les « Règles de l'outil », qui viennent du plugin et valent pour tout projet. {{QUI}} le tient à jour : une règle nouvelle s'ajoute ici, une ligne, avec sa date.

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
- Une tâche prise par une session passe dans « En cours », avec `qui:<titre de la session>`.

### Clôture

- Une tâche se coche sur preuve, à la date de la preuve, et descend en tête de `ROADMAP-fait.md` avec `fait:` et son bilan.
- Une mère se coche avec sa dernière fille ouverte, sauf une mère récurrente (`tous:`) ; tant qu'elle a une fille ouverte, elle ne se coche, ne s'abandonne ni ne se met en pause.
- Une communication pas encore partie (email, message, invitation) ne se coche jamais : son fichier dit d'abord « Statut : envoyé le AAAA-MM-JJ (par où) ».
- Clôture partielle : une tâche faite de notre côté mais dont la ligne attend encore un tiers (validation, activation, réponse, correction chez un vendor ou un client) se clôt sur ce qui est fait, et sa suite, qui ne porte que l'attente du tiers, s'ouvre dans le même tour (skill `tasks`, opération `handoff`) ; on le dit en une ligne, « #A close, la suite chez <tiers> passe en #B ».
- Une tâche close ne se rouvre, ne se renumérote ni ne se réécrit sans question.

## Ce qui devient une tâche

- Une action que {{QUI}} (ou une personne de l'équipe) doit faire, avec un résultat qu'on peut constater : un livrable, un email envoyé, une décision prise.
- Un engagement daté, pris en réunion, par email ou en conversation.
- Une étape d'un sujet déjà suivi : elle va sous sa tâche parente, jamais en tâche de plus.

## Ce qui n'en devient jamais une

- Un simple « qui doit parler à qui », sans action de {{QUI}} derrière.
- Une information, un constat, une question sans suite : ils vont dans les notes, pas dans la roadmap.
- Une action déjà couverte par une tâche du même sujet : elle complète cette tâche.

## Règles du projet

- _Les règles propres à {{NOM}} : les axes ou départements, le jour d'une revue, ce qui s'écrit d'office et ce qui se demande d'abord, où attend une question sans réponse. Une ligne chacune._

## Preuves

Une tâche se coche sur preuve, à la date de la preuve :

- _où chercher qu'une tâche est faite : les notes rangées, les emails envoyés, un dossier de livrables._
