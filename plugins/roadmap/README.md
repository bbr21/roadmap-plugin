# Plugin roadmap

Panneau Claude Code à côté du chat : la roadmap du projet de la session, filtrable, avec le détail d'une tâche et son lancement dans une nouvelle session

C'est un mod Claude Code (module de hooks, `hooks/register.tsx`), avec sept skills, `roadmap-panel` pour y brancher un projet, `tasks` pour tenir sa roadmap au quotidien, `audit` pour en auditer le contenu, `onboarding` pour poser dans un dépôt de code sa structure et sa roadmap, `doctor` pour vérifier qu'un projet est branché, `reglages-session` pour les réglages de session et `maestro` pour tenir une session Maestro : il
dessine un panneau dans l'onglet Code de l'app de bureau (et dans le terminal). Il ne sert à rien
dans Cowork ni dans le chat de claude.ai.

## Contenu

**7 skills**

| Skill | Rôle |
|---|---|
| `roadmap-panel` | Branche un projet sur le panneau (`.claude/roadmap.json`, `ROADMAP.md` à la racine) et le dépanne. Tapée seule, `/roadmap:roadmap-panel` ouvre le panneau comme `/roadmap`, d'une ligne. |
| `onboarding` | Un projet de code (le dossier le dit, #176) : pose dans un dépôt de code la structure de Splitmybill (CLAUDE.md, roadmap numérotée dans `roadmap/` avec ses bilans, docs, `check.mjs`, hook de démarrage, worktree par session), propose de reconstituer la roadmap depuis l'historique du dépôt (PR, fusions ou commits des 6 derniers mois), ou remet un projet existant au format sans rien écraser. Sans code : un dossier simple, git en option, des tâches complètes. |
| `doctor` | Checklist en lecture seule d'un projet (d'abord la ligne « Travail », ce que le dossier est ; sans code : python3, roadmap, réglages, champs exigés, sans GitHub, Superpowers facultatif) ; d'un projet de code : outils, GitHub, roadmap, structure, `check.mjs`, plugin roadmap, Superpowers et chacune de ses skills de méthode, sa mise à jour automatique, `swiftui-pro` sur un projet iOS ; une ligne OK, KO ou À voir avec la commande qui corrige. |
| `audit` | Le seul audit de la roadmap (#159) : la structure (paquets découpés en parent et enfants datés, dépendances, fusions de doublons, regroupements, trous), puis une question par tâche en retard ou sans date et par `prio:` posée sur un enfant, la recommandation en premier (redater, faite, en pause, abandonner), et les clôtures sur preuve là où le projet le dit (`preuves`). `scripts/audit.py` (`survey`, `apply`, `pending`) écrit la structure tout ou rien, sauvegardée, avec un bilan qui retrouve chaque fragment ; les réponses s'écrivent par la skill `tasks`, qui suit `ecriture`. En tâche planifiée, seule une clôture sur preuve nette s'écrit : le reste attend dans `ROADMAP-questions.json`, compté par priorité. Lancée en fin d'onboarding. |
| `tasks` | Tient la roadmap au quotidien, avec ou sans code (#158) : rapproche chaque action des tâches du même sujet (jamais de tâche neuve sur un sujet qui en a une), puis ajoute, complète, redate, coche sur preuve (`fait:` à la date de la preuve, ligne de bilan), abandonne ou met en pause (#159), par `scripts/tasks.py` (`context`, `match`, `write`) : essai à blanc, puis écriture tout ou rien après sauvegarde, sur le moteur de l'audit. Lit `regles`, `ecriture` et `preuves` de `.claude/roadmap.json` ; avec `ecriture`, passe les lignes à l'outil du projet au lieu d'écrire. |
| `reglages-session` | Lit et change les réglages de session (questions par formulaire, mode ADHD, français, mode autonome) de `~/.claude/reglages-session.json`, pour le projet de la session (#102). Lancée, elle ouvre aussi le volet Réglages ; tapée seule, `/roadmap:reglages-session` l'ouvre comme `/reglages`, d'une ligne. |
| `maestro` | Tient une session Maestro (`/maestro`), la session mère qui lance et suit des tâches menées en parallèle, même une seule : lignes et découpage, une session par tâche, lecture de leurs comptes rendus, main donnée sur le simulateur iOS et les autres ressources uniques, ordre des fusions calculé depuis git (`scripts/etat_maestro.py`), chaque tâche suivie dans la liste d'étapes de Maestro (une étape par tâche, son état en mots), une fusion à la fois. |

Le panneau lit `ROADMAP.md` et `ROADMAP-fait.md` (grammaire des dossiers Cowork : une ligne par
tâche, `[axe | attend:… | ouvert:… | due:… | src:… | fiche:… | après:… | prio:… | feedback:… | tous:… | relance:…]`), relit les fichiers et
les sessions toutes les 3 s (le dossier de la roadmap toutes les 15 s), et montre :

- la part faite, une barre par axe (cliquable), la légende des axes repliée derrière elle en une
  ligne « › 7 axes · … » qu'un clic déplie (#149), et à droite du pourcentage « N Done sur M » (#162, #174) ;
- en pied, la roue qui ouvre les Réglages, la version du plugin et « Rafraîchir » (#138, #162) : un clic relit
  tout et compare la version de la session, celle de l'app et la dernière publiée (dépôt public, par `curl` ou
  `gh`) ; si l'app retarde, un lien vers claude.ai › Plugins et le reste du geste ; si seule la session
  retarde, « Recharger » pose `/reload-plugins` dans la saisie (le plugin ne peut pas le lancer lui-même) ;
- chez Maestro, la ligne « En cours » (#149) : le compte de ses sessions et un point par voie ;
  la choisir montre l'arbre des sessions (barre et étape sous chaque voie) à la place de la liste.
  À l'ouverture, le panneau de Maestro la choisit si une session t'attend, sinon Ma journée, sinon
  les récentes ;
- les filtres en une rangée de pastilles (#115, #149) : une icône de trait dans leur couleur, le
  nom, le nombre ; la choisie prend sa teinte et un second clic la retire. Ma journée, En cours (sauf chez Maestro), En retard, Cette semaine, À relancer, Retours (`feedback:`), dans tout projet, chacune cachée à 0 (#176) ;
- « Plus › », au bout de la rangée : les autres états non vides (Récentes, ouvertes aujourd'hui ou hier ;
  À moi ; Attend un tiers ; et le menu « Qui » dès qu'une autre personne est nommée, #176) ; il reste ouvert tant qu'un de ses filtres est choisi ;
- une recherche par mots ou par numéro (#47), dans les ouvertes et les faites, qui filtre à la frappe,
  et à côté le menu « Ranger » qui montre le rangement en cours ;
- par défaut, l'arbre par axe (#168), dans tout projet : une section par axe, dans
  l'ordre de la légende, la flèche dans le carré de l'axe ; dedans, ce qui est en session d'abord,
  puis ce qui attend quelqu'un, puis la plus récente ; une mère au niveau des tâches seules, sa
  flèche dans son carré, ses filles un cran à droite, reliées par des coudes ; un rond devant le
  numéro (qui le suit, à l'écart fixe de la ligne, #179) coche la tâche, qui se barre et reste à sa
  place ; un premier clic sur le rond arme la ligne, un second, sur le bouton de son encart, le fait
  (#179) ;
- les tâches par sujet (au menu « Ranger ») en sections repliables, une ligne par tâche (pastilles échéance, tiers,
  « à revoir », âge), triées : en session, puis par échéance, puis de la plus récente à la plus
  ancienne ; une tâche se range sous sa prérequise ; au bout de chaque tâche ouverte (ni en session,
  ni bloquée, ni déjà demandée), un ▶ lance sa session sans ouvrir la fiche (#149 : à la place du
  chevron ›) : même brief et même carte que « Lancer » (un bouton de l'app, sans zone de clic : il
  tient sur toutes les lignes) ; chez Maestro, une tâche en session n'y porte que la pastille
  « en session », sa barre et son étape sont dans l'arbre ;
- toutes les faites, rangées par jour de clôture ou par sujet ;
- dans toutes les vues, le menu « Ranger » (En arbre, Par sujet, Par jour ; Par échéance et Par responsable quand une ouverte a `due:` ou `resp:`, #176 ; un bouton sur mobile) : un seul choix pour toutes les vues ;
  par jour, une ouverte se range au jour de son `ouvert:` (« En retard » reste en tête), une faite
  au jour de son `fait:` ; sans choix ni `vue` déclarée par le projet, les ouvertes vont en arbre
  (#168) et les faites par jour ;
- la modification d'une tâche ouverte depuis sa fiche (#161) : le crayon à droite du titre met la
  fiche en édition, champs en place dans ses cartes, préremplis de la ligne (libellé dans la Mission,
  Attend, Après et Parent, Axe, Responsable (`resp:`, la personne, #176), les clés
  que le projet déclare dans `cles`, Échéance en `AAAA-MM-JJ`) ; un menu sur bureau quand le projet
  liste les valeurs admises ; « N changements », puis « Enregistrer » réécrit la seule ligne, les
  autres champs et la note gardés à leur place, contrôlée par les règles du projet : un refus nomme
  le champ, rien n'est écrit, la saisie reste ; « Annuler » ne touche à rien. L'écriture suit celle
  de « Marquer faite » : `cowork.py roadmap update` dans un dossier Cowork, sinon, avec `ecriture`,
  la demande à Claude (#164, voir « Les règles du projet »), sinon le panneau écrit ROADMAP.md, sur
  main seulement dans git, puis `roadmap: edit #N`, commit et push ;
- dans la fiche d'une tâche, la flèche retour `←` en tête, à la place de la marque (#165) : elle
  ramène à la roadmap entière, filtres gardés, dans la session de la tâche comme au clic dans la
  roadmap (« ← Roadmap » au terminal) ;
- le détail d'une tâche (voir la ligne, ouvrir la fiche ou la source, la lancer dans une nouvelle
  session ou la faire vérifier, au premier clic, avec un « Message additionnel » facultatif ajouté
  au brief, la marquer faite ou l'annuler) ; « Marquer faite » (#73) et « Annuler la tâche » (#267)
  restent visibles même quand une session tient la tâche, et l'encart de confirmation le rappelle ;
  « Marquer faite », après une confirmation sans champ, la coche et la fait descendre en tête de
  ROADMAP-fait.md avec le bilan « Marquée faite depuis le panneau Roadmap » ; « Annuler la tâche »
  ne l'efface pas : après une confirmation et une raison facultative, elle est cochée
  « (abandonné) » et descend en tête de ROADMAP-fait.md avec son bilan (« Annulée : <raison> ») ;
  les deux passent par `cowork.py roadmap close` (`--abandon` pour une annulation) dans un dossier
  Cowork (Python isolé, `-I`) ; ailleurs le panneau écrit les deux fichiers et le journal, et dans
  git il ne le fait que sur main, sans modification en attente sur ces fichiers, puis les committe
  seuls (`roadmap: done #N` ou `roadmap: abandon #N`) et les pousse ; le détail la montre « faite »
  ou « annulée » ; une tâche faite s'ouvre sur sa boîte « Conclusion » (#264) : une
  ligne sur ce qui a été fait, une ligne sur le souci rencontré ou « Tout a roulé, aucun souci 🎉 »,
  l'emoji du ressenti ; « Tout voir » (un bouton de l'app, sans zone de clic) ajoute cause,
  corrections et la note. Toute roadmap tient ce bilan : le log que nomme cowork.json « bilan »,
  sinon `ROADMAP-bilans.csv` à côté de `ROADMAP.md` (tâches closes depuis le 2026-10-25, colonnes
  `date,id,fait,souci,ressenti,cause,corrections,note`). Une ligne d'avant `fait` montre le début
  de sa note. Le brief de lancement dit où écrire le bilan, et la fin de tour le réclame avant de
  proposer l'archivage (écrit par `cowork.py` dans un dossier Cowork, à la main dans un projet de
  code comme Splitmybill).

Une tâche passe « en session » (roue) quand une session y travaille : lancée depuis le panneau, ou
qui a ouvert sa ligne et elle seule (une session qui ajoute plusieurs tâches prend des notes), tant que la session n'est pas
archivée. Seule compte la ligne que l'outil de la session a lui-même ajoutée : la roadmap se relit
juste avant chaque écriture, et une ligne qu'une autre session a écrite entre-temps n'est ni « en
session » ni l'objet du rappel « une session, une tâche » (2026-10-28, #70). Les sessions se lisent toutes les 3 s : la liste de l'app (100 sessions), qui exclut la
session qui la demande, plus la fiche de la session du panneau (`get_session self`), sans quoi
chaque panneau voyait toutes les sessions sauf la sienne (2026-10-27, #345). La roue ou la main de
la session du panneau suit ses propres tours sans attendre la relecture ; une liste refusée ou
illisible se dit sous la recherche, et seule cette session reste alors suivie. Le titre d'une session, « #N · titre court », se pose à son lancement puis ne change
plus (2026-10-25) : le panneau ne renomme aucune session. Une session, une tâche (2026-10-23) :
une session « #N · … » qui ouvre une autre tâche n'y travaille pas, et Claude reçoit le rappel de
la proposer dans une session à part (sauf un correctif du lot #N). Une session Maestro (titre qui
commence par « Maestro », ou par l'ancien « Lot » gardé en alias, marque Maestro, ou session qui a
lancé au moins deux sessions encore ouvertes, depuis le 2026-10-26 ; un seul nom depuis #112) coordonne les sessions de ses features : elle ouvre et coche leurs
lignes sans jamais être en cours sur aucune, une ligne qu'elle ouvre lui rappelle de lancer sa
session, et le numéro de son titre ne lui fait pas proposer l'archivage ; ses sessions « #N · … »
restent rattachées à leur tâche, et celles lancées par son ▶ reçoivent la clause de Maestro : elles ne
fusionnent pas, ne prennent une ressource unique (simulateur iOS…) qu'avec la main de Maestro et disent
leur état en tête de chaque compte rendu. Une carte New task (`own_initiative`) que Claude pose
dans une sous-session d'un Maestro remonte à Maestro (2026-10-28) : par message, ou, le message refusé,
gardée et donnée à Maestro à son message suivant ; la sous-session lit qu'elle est transmise, et
Maestro ouvre sa ligne et la propose à Bertrand. Les cartes `offer` et `user_asked`, le ▶ et une
session sans Maestro posent la leur comme avant. La doctrine entière est dans la skill `maestro`. La section « ## En cours » du fichier n'est pas un état : le détail dit en session,
bloquée ou à faire. `après:<début du libellé>` désigne la tâche à faire d'abord : la tâche est bloquée
(cadenas) tant que l'autre n'est pas faite.

**Chaînes** (2026-10-27). Une chaîne de tâches reliées par `après:` reste d'un bloc,
dans l'ordre d'exécution : elle se range sous le sujet (ou le jour) de sa tête, même quand les
tâches suivantes ont un autre sujet, et chaque ligne porte le trait qui la relie aux autres et son
étape (1 pour la tête ; deux suites de la même tâche partagent leur étape, elles se font en
parallèle). Le trait fait partie de la marque de la ligne : un dessin par ligne, comme avant. Le
détail dit « étape 2 sur 4 de la chaîne ».

**Priorité** (#130, 2026-10-30). `prio:` (1, 2 ou 3) reste lu sur la ligne et contrôlé, mais il
est facultatif et ne se montre plus : ni pastille P1, P2, P3, ni filtre « Prioritaires », ni
section P1 dans « Ma journée », ni mention par Maestro. Il ne range plus rien non plus : l'ordre
d'un sujet et des tâches à lancer ne dépend pas d'un critère qu'on ne voit pas.

**Retours** (2026-10-27, id:227 de Splitmybill). `feedback:12,15` porte les numéros des retours
envoyés depuis l'app d'où vient la tâche, ou qu'elle a reçus : une pastille violette « Feedback »
sur la ligne ouverte et au détail, qui donne les numéros (« Retours #12, #15 ») ; l'état « Retours »
filtre ces tâches. Le contrôle de grammaire refuse une autre forme que des numéros séparés par des
virgules.

Un titre court et un sujet par tâche sont écrits par un
modèle, une fois par tâche, et gardés. Le design (thèmes sombre et clair, pastilles, coins
arrondis) suit le handoff de design du 2026-10-21 ; les limites de l'app de bureau et leurs
contournements sont écrits en commentaire dans `hooks/register.tsx` et `hooks/icons.ts`.

## Maestro

Demande de Bertrand du 27/10/2026 : « Maestro » en tête d'un message ouvre le panneau. Seul
(« Maestro », `/maestro`), il ne scanne rien (#126) : une carte d'accueil prend la place du message
(#141, 31/10/2026), comptée par le plugin sur la roadmap seule : le bonjour du jour (« Bonjour
Bertrand, on est vendredi. »), les tâches faites sur le total avec leur barre, les closes de la
semaine, les pastilles du jour (en retard, aujourd'hui ou demain, tiers à relancer ou sessions qui
tournent), puis quatre boutons : « Ma journée », « Quoi lancer », « À relancer » s'il y en a, sinon « Mes sessions » (cachés à zéro, #176), « Tout scanner ». Maestro ne dit qu'une phrase
d'encouragement. Un clic envoie son message (« Maestro journée », « Maestro quoi lancer »,
« Maestro relances », « Maestro sessions », « Maestro scan ») par la boîte d'envoi de #140, que vide
le dessin du panneau : il passe ainsi par le hook `prompt.submit`, qui joint la part à lire (la
journée par sections, les relances, ce qu'on peut lancer, les sessions, ou l'état entier). Sur
« Maestro scan », « Maestro go » ou une demande (« Maestro, on en est où ? »), Claude reçoit, en contexte additionnel, l'état d'avancement du projet, orienté objectif : faire
avancer les tâches, qu'aucune ne reste bloquée des heures. Les nouvelles des sessions enfants qui
coincent arrivent à chaque message, scan ou non.
La tête du message se lit après les blocs `<system-reminder>` que l'app met devant le texte de
Bertrand (premier message d'une session en worktree, #69) ; « Maestro » au milieu du texte ne
déclenche rien.

1. **Ce qui attend Bertrand**, la plus ancienne en tête : les sessions qui ont fini leur tour sans
   réponse (la main orange), avec depuis combien de temps et leur lien ; au-delà de 15 min (#84),
   elles sont « coincées » et se débloquent avant tout lancement.
2. **Ce qui tourne**, avec depuis quand.
3. **Ce qu'on peut lancer** : ni bloqué par sa prérequise, ni en session, ni déjà demandé ; rangé
   par ce qui ne dort pas chez un tiers, puis ce qui débloque le plus de tâches,
   puis l'échéance, puis la plus ancienne. Les quatre premières arrivent avec leur carte de session
   prête (même brief que « Lancer »).

Claude ouvre sur une phrase de verdict, puis demande lesquelles lancer par un formulaire à choix
multiples (quatre au plus, la première recommandée) et pose la carte de chaque tâche choisie ;
« Maestro go » ou « Maestro, lance » pose directement les cartes des trois premières. Rien n'est
lancé sans le clic de Bertrand sur « Start », et rien n'est écrit dans la roadmap, sauf la ligne
d'une tâche que propose une session lancée.

**Les tâches que proposent les sessions lancées** (#71) : Maestro coordonne les sessions qu'il
lance, même une seule. La session où Bertrand dit « Maestro » est marquée pour 30 jours (pas une
session de tâche « #N · … »), et un titre « Maestro … » suffit. Une carte New task posée par une
de ses sessions, ou par une session lancée depuis l'une d'elles, ne reste pas dans leur transcript :
elle remonte à Maestro (skill `maestro`, § 3), qui ouvre sa ligne, pose sa propre carte et dit à
Bertrand en une ligne quelle session la propose et qu'il clique Start.

**Les nouvelles des enfants** (#84) : Bertrand pilote depuis le parent (Maestro, ou toute session qui en
a lancé d'autres). Chaque enfant note dans le store du plugin sa liste d'étapes
(`update_plan`), sa question en attente (`AskUserQuestion`) et son dernier récap (`wrap_up`). À
chaque message de Bertrand, le parent reçoit, sous « Roadmap — nouvelles de tes sessions enfants »,
une ligne par enfant qui coince depuis 15 min (attend Bertrand, silencieux avec son étape, ou prêt)
et la liste des enfants à archiver, vérifiés finis (ligne close et commits arrivés, ou branche
fusionnée et liste d'étapes faite ; rien de non commité, aucune question ni session ouverte ; dans un dossier sans code, la ligne seule) ; rien quand tout avance. Une session épinglée n'est pas proposée à
l'archivage, une session distante n'est jamais dite finie d'ici, et la branche de base est celle de
la session (`main` sans elle) ; les notes de plus de 30 jours sortent du store (#90). Il relance une fois un enfant silencieux
(pas encore s'il a répondu sans changer d'étape), et propose d'archiver les finis d'un seul clic
(« Archive-les »). Toute session reçoit aussi la consigne de tenir sa liste d'étapes, et un
rappel en fin de tour quand elle travaille sans (#98, #104) ; le parent tient la sienne, une étape
par session lancée, son état en mots (#104). Il n'y a plus de carte HTML de Maestro. La liste d'étapes
native est le seul affichage des étapes : la bande que le plugin dessinait au-dessus de la saisie
(#104, #107) la doublait et est retirée (#109). La consigne la veut lisible : trois à sept étapes,
un verbe et son objet chacune, jamais recopiée dans le message, à jour à chaque changement.
Chez Maestro, la bande au-dessus de la saisie porte l'arbre de ses sessions (#147) : une ligne par
tâche lancée, son état en couleur, son étape en cours, sa jauge, le nom qui ouvre la session. Elle
reste visible quand le fil défile, cède à un sondage, et s'efface tant que la boîte de fin pose une
question ; la liste native reste dans le fil. Une session close et à l'arrêt, encore ouverte, porte au
bout de sa ligne l'icône d'archivage : un clic l'archive (#174). L'en-tête dit « Contexte 40 % » pour
Maestro seul, sans tokens ni jauge ; les lignes n'ont plus de contexte (#174). La jauge, le compte et
l'état se serrent au bord droit, chacun à la largeur de son plus long texte, alignés d'une ligne à
l'autre (#174).

**Les mots d'état du panneau** (#174) : « Completed » pour une tâche close (bande de Maestro, voies,
pastille violette de sa fiche) et « Done » pour ce qui est fait (« 7/7 Done », « N Done » de l'en-tête,
« Done » d'une tâche de la chaîne). Seuls les mots affichés changent : les textes envoyés à Claude, la
roadmap et les docs restent en français.

**Le réglage autonome** (#77, #105, réglage de session `autonome`, éteint par défaut) :
Maestro ne pose plus le menu « Je lance lesquelles ? ». Il pose les cartes des trois premières
tâches, comme « Maestro go », et Bertrand clique Start sur celles qu'il veut. Il fusionne seul la
branche prête d'une de ses sessions (tests verts, à jour de `main`, diff relu par lui), une à la
fois, tests rejoués après chaque fusion. Il publie seul aussi (release d'un plugin, déploiement)
et donne seul la main sur une ressource unique (#105). Il répond lui-même à une session qui
attend, sauf pour une question d'architecture ou un geste qui revient à Bertrand. Sans le réglage,
la fusion et la publication attendent le clic de Bertrand.

**Le récap au fil des fusions** (#136) : après chaque `git merge` réussi dans le dossier principal
et chaque `release.py release`, le panneau rappelle dans le résultat de la commande de renvoyer la
liste d'étapes entière avant la suivante ; chez Maestro, l'étape de la tâche dit `· livrée <version>`,
et un tour lancé par Bertrand dit aussi une ligne par tâche livrée (`#N livrée · version · ce qui
change`), un tour réveillé par une session rien de plus (#133). Liste toujours pas renvoyée à la fin du tour : le rappel
revient une fois. Plusieurs branches prêtes se fusionnent à la suite, une à la fois, avec une
publication par fusion. Maestro finit sur la fiche de fin de #123 suivie du tableau de ses tâches
(`| Tâche | Livré | Version | État |`, maquette B), que le contrôle de fin de tour réclame.

Une session lancée (par le panneau ou par Maestro) reçoit le **cap** dans son brief : finir la
task dans la session ; décider seule ce que les fichiers, le code ou un défaut raisonnable
tranchent ; ne poser à Bertrand que ce qui est à lui, en une fois ; écrire un blocage sur la ligne
(`attend:`, `après:`) au lieu de l'attendre.

## Un seul mode (#176)

Décidé par Bertrand le 01/11/2026 : plus de mode Code ni de mode Projet. Le panneau, l'accueil et
Maestro sont les mêmes dans tout projet : les sept filtres en pastilles (Toutes, Ma journée, En
cours, En retard, Cette semaine, À relancer, Retours), chacun caché quand il vaut 0, « Qui » dès
qu'une autre personne est nommée, « Par échéance » et « Par responsable » seulement si une tâche
ouverte a `due:` ou `resp:`, et le filtre choisi qui tient quand on change d'axe. Le panneau s'ouvre
sur « En cours » quand une session travaille une tâche, sinon sur « Ma journée », sinon sur tout.

Ce qui change d'un projet à l'autre, c'est la façon de travailler, et c'est le dossier de la
session qui la dit : un dépôt git qui voit au moins un fichier de code travaille en worktree, sur
une branche que Maestro fusionne, avec le rappel de méthode ; tout autre dossier (Cowork, AAFES, la
roadmap de Caro) travaille dans le dossier même, et une tâche y est finie quand sa ligne est cochée.
`"mode"` de `.claude/roadmap.json` reste lu : `auto` (le défaut) laisse le dossier décider, `code`
ou `projet` le force, pour corriger une détection fausse ; la ligne « Travail » du doctor dit ce
qu'il a vu. `qui:` désigne la session qui tient une tâche, `resp:` la personne qui la porte, dans
tout projet ; une tâche qu'une autre personne porte se relance au lieu de se lancer.

## Tâche lancée tracée

Demande de Bertrand du 28/10/2026 (#80) : une tâche lancée (sa ligne porte `qui:` ou
`branche:`) porte `ouvert:`, `due:`, `qui:` et `après:` (`après:-` si rien ne la précède),
signalés au modèle à l'écriture, comptés par le doctor, jamais refusés ; `requis` de
`.claude/roadmap.json` remplace la liste, `[]` l'éteint, et `"requis_sur": "ouvertes"` l'exige de
toute tâche ouverte (#176, ce qu'écrit l'onboarding d'un dossier sans code). La détection ne change
jamais les champs exigés ; un ancien `"mode": "projet"` garde les siens. Les idées du
Prochain et du Plus tard n'en ont pas besoin. Le brief d'une session lancée le rappelle.

## Dossier sans code

Demande de Bertrand du 28/10/2026 (#76) : un même plugin pilote aussi des projets sans code.
Premiers usages : la roadmap de Caro et le dossier AAFES Cowork, depuis l'onglet Code. Depuis #176,
ce n'est plus un mode choisi : le dossier le dit, et ce qui suit sur l'affichage (Ma journée, les
filtres, « Qui », les rangements) vaut dans tout projet.

- **Des tâches complètes** : `resp:` (la personne qui porte la tâche, collègue compris),
  `parent:N` ou `parent:#N` (la tâche mère), `après:N,M` (plusieurs prérequises), `-` pour
  « aucune » (pas pour `resp:`, que le contrôle signale). Les champs de `requis` (défaut : `id`,
  `ouvert`, `due`, `resp`, `parent`, `après`) sont signalés au modèle à chaque écriture d'une tâche
  ouverte, jamais refusés ; le doctor compte les lignes incomplètes.
- **Les tags d'un projet** : des clés déclarées dans `cles`, avec leurs valeurs admises ; le
  détail les montre, la recherche les lit. `"cles_visibles": ["dept", "statut"]` les montre en
  pastilles pleines sur la ligne (#125) ; `statut` tait sa première valeur (Todo) et une attente
  dont le tiers est déjà en pastille. En arbre (#163), une seule pastille par ligne : le
  département, la première clé montrée hors du statut (sans `cles_visibles` ni `ranger_par`, aucune :
  l'arbre est rangé par axe, #168). `"ranger_par": "projet"` range
  l'arbre en bandes repliables, une par valeur de la clé (les déclarées dans leur ordre, puis les
  autres, puis « Sans projet »), les blocs sous la valeur de leur parent. Une clé non déclarée
  dans `cles` est ignorée, et le doctor le dit.
- **Les règles du projet** (#158), dans tout projet. Tout projet a son fichier de règles,
  `ROADMAP-REGLES.md`, à côté de `ROADMAP.md` (#167) : ce qui devient une tâche, ce qui n'en
  devient jamais une, les règles du projet et ses preuves. L'onboarding le pose depuis un modèle
  (`onboarding.py regles <dossier>` pour un projet déjà onboardé), le doctor est KO s'il manque, et
  les skills `tasks`, `audit` et Maestro le lisent à chaque passage ; ses règles l'emportent sur
  leurs défauts. Le panneau le rappelle (#171) : le brief d'une session lancée par ▶ ou « Vérifier »
  dit de le lire avant d'écrire une ligne, et une écriture qui ajoute une ligne à `ROADMAP.md` reçoit
  une phrase qui le nomme, sans refus. `"regles": "<chemin>"` le range ailleurs, `"ecriture": {"outil": "50-tools/dossier/patch.py",
  "consigne": "essai à blanc, puis --apply"}` (le projet écrit sa roadmap par son propre outil :
  `tasks` lui passe les lignes au lieu d'écrire) et `"preuves": ["_inbox/_traite/",
  "gmail:in:sent"]` (où chercher qu'une tâche est faite : des chemins, des sources
  `source:requête`, ou `"#Preuves"`, une section du fichier de règles). Le doctor contrôle les
  chemins (ligne « Règles du projet »), l'onboarding les propose (réponse « Règles »). Avec
  `ecriture` (#164), le panneau n'écrit plus la roadmap : « Marquer faite », « Annuler la tâche »
  et « Enregistrer » gardent leur confirmation, puis envoient la demande dans la session
  (« Coche #N par la skill tasks », « Abandonne #N : <raison> », « Modifie #N par la skill tasks :
  due:…, sans attend »), et l'encart dit « Confié à Claude : ce projet écrit sa roadmap par
  <outil> ». La skill `tasks` cherche la preuve, puis écrit par l'outil du projet. Une récurrente
  seule (`tous:`) n'est alors plus reconduite par le panneau : `tasks` le dit. Dans un dossier
  Cowork, `cowork.py` garde la main, `ecriture` posé ou non.
- **Ma journée** (#99) : quand aucune session ne travaille une tâche, le panneau s'ouvre sur « Ma journée », les tâches à moi en retard, dues
  aujourd'hui ou demain, ou récurrentes qui tombent dans les 2 jours, rangées dans cet ordre (la
  priorité n'y entre plus, #130). Un parent n'y entre jamais en ligne propre : ses enfants dus y
  entrent, et en arbre il les coiffe, en gris (#125).
- **Le modèle** (#125) : une tâche est seule, parent (d'autres la citent en `parent:`) ou enfant,
  sur deux niveaux au plus ; `après:` relie deux enfants d'un même parent, ou deux parents. Une
  ligne qui en sort (troisième niveau, `après:` hors des sœurs, enfant dû après l'échéance posée de
  son parent) est signalée à l'écriture et par le doctor (« Parents et enfants », qui dit aussi un
  parent resté ouvert aux enfants faits, ou de plus de 8 enfants ouverts), jamais refusée ; la
  skill `audit` ne crée pas de troisième niveau.
- **La date d'un parent** (#125) : l'échéance la plus proche de ses enfants ouverts ; filtres, tri
  et pastilles la lisent. `due:` n'est plus exigé d'un parent (sauf `tous:`) ; posé, il reste
  l'échéance finale du sujet.
  Sous les axes, les filtres en pastilles cliquables (#115, #149, #176), cachés à 0 : Ma journée (soleil, bleu), En
  cours, En retard (horloge, rouge), Cette semaine (calendrier, orange, échéance dans les 7 jours), Retours et À
  relancer (cloche, violet, une attente de tiers sans nouvelle depuis 14 jours, `"relance": N` dans
  `.claude/roadmap.json` pour un autre seuil). Les autres états et le menu « Qui » passent sous
  « Plus › » ; « Qui » se combine avec l'axe et la ligne choisie, et les nombres suivent. La date d'une ligne est rouge en retard (« 23/10 · 6 j »), orange dans
  les 7 jours, grise au-delà ; la pastille d'un tiers attendu dit son attente à partir de 7 jours
  (« Rong · 16 j », orange, rouge à 14). « Tout afficher » revient à toutes les tâches.
- **Récurrence et relance** (#99) : `tous:semaine|2semaines|mois|trimestre|an`, avec `due:` à la
  prochaine occurrence (pastille « ↻ mensuel ») ; « Marquer faite » envoie l'occurrence dans
  ROADMAP-fait sous un numéro neuf (`src:#N`) et avance `due:` d'une période, « Annuler la tâche »
  arrête la récurrence ; `cowork.py` ne la reconduit pas encore, et le panneau le dit.
  `relance:AAAA-MM-JJ` date la dernière relance du tiers attendu ; le brief demande de la poser.
- **La fin d'un parent** (#125) : « Marquer faite » sur son dernier enfant ouvert ferme aussi le
  parent, dans la même écriture, avec son bilan (« parent #375 fait aussi ») ; un parent `tous:`
  est reconduit à la place, depuis son `due:` écrit (« parent #411 reconduit au 10/11 »). Une
  annulation ou un enfant récurrent ne ferment rien d'autre ; par `cowork.py`, la note dit le parent
  à cocher.
- **La vue** : par échéance (en retard, cette semaine, plus tard, sans échéance) quand le projet
  déclare `"vue": "echeance"` (l'onboarding sans code l'écrit) ; le menu « Ranger » propose aussi le
  responsable (si une tâche a `resp:`), l'arbre des tâches, le sujet, le jour.
  Une roadmap qui a des mères s'ouvre en arbre (#163) quand le projet ne déclare pas de `vue` ; un
  choix dans « Ranger » reste.
  L'arbre « Le fil » (#125, redessiné par #163, maquette A) : une tâche est seule, mère ou étape ; un
  bloc par mère, sa ligne en tête une seule fois, en gras, avec sa case, son département, sa barre
  d'avancement (`1/3`), la date de sa prochaine étape et son ▶ ; ses étapes dessous, en retrait sur
  un fil fin qui porte leur rang (1, 2 : en séquence par `après:` ; 1, 1 : en parallèle), avec leur
  case, leur département, puis « Rodney · 29/10 » (responsable et date en texte, rouge en retard,
  orange dans les 7 jours) ou le cadenas « après #437 ». Lignes de 30 px, plus d'âge sur la ligne.
  **Cocher** : la case (○) d'une étape la clôt comme « Marquer faite » ; l'étape cochée (●) reste à
  sa place, barrée, et sa case la rouvre (sa ligne revient dans ROADMAP.md, son bilan est
  retiré) ; la dernière étape cochée coche sa mère, rouvrir une étape rouvre sa mère. **Double
  confirmation** (#179, maquette A) : le premier clic sur la case n'écrit rien, il arme la ligne
  (fond orangé) et pose sous elle un encart qui dit ce qui va se passer (« Rouvrir #267 Licences ? »,
  « Cocher #437 … ? », et ce qui s'écrira) avec « Rouvrir », « Cocher » ou « Tout clore », et
  « Annuler » ; seul ce bouton écrit. Un second clic sur la case, un clic ailleurs dans le panneau
  ou 8 s sans rien désarment ; une seule ligne armée. La case d'une mère qui a des étapes ouvertes
  arme « Clore #12 Mocap et ses 3 étapes ouvertes ? » (Tout clore, Annuler). La liste « N faites »
  porte le même rond ●, devant le numéro, qui rouvre de la même façon. Un projet qui déclare
  `ecriture` (#164) : la case n'écrit pas, après la confirmation elle le demande à Claude (« Coche
  #N par la skill tasks », « Rouvre #N … »). Une mère cochée aujourd'hui garde son
  bloc jusqu'au lendemain. Un dossier Cowork ne
  rouvre pas : `cowork.py` ne le sait pas, le toast le dit. « Tout replier » / « Tout déplier »,
  à droite au-dessus de la liste (sous un filtre, à côté de « Tout afficher »), replie ou déplie
  toutes les mères. Une mère bloquée dit « après #12 » à la place de sa date ; les tâches seules
  ont la même ligne, sans fil. Une mère hors du filtre reste
  en tête, en gris, sans case ; les tâches sans mère ni étape sous « Tâches seules ». Hors de
  l'arbre, une pastille dit le responsable quand ce n'est pas « moi » ; « À moi » compte `resp:` ; le détail montre responsable, parent, sous-tâches,
  prérequises et clés déclarées. Une tâche est bloquée tant qu'une de ses prérequises est ouverte,
  ou que son parent attend la sienne (#125) ; le cadenas dit quoi : « après #601 », « parent après
  #12 ». Les titres courts gardent la langue du libellé.
- **Les sessions** (dossier sans code) : ▶ pose une carte sans worktree (reposée sans le champ si l'app le refuse) ; le
  brief ne cite ni TDD ni plan de code, dit que la tâche passe par les connecteurs MCP et que rien
  ne part chez un tiers sans accord ; la clause de Maestro n'a ni branche ni fusion ; le rappel
  « commit sans test » se tait ; Maestro garde son menu avec le réglage `autonome` ; la publication sans demander
  y vaut quand même, par le texte injecté (#105).
- **L'onboarding** pose un dossier simple : `CLAUDE.md` court, la roadmap et ses bilans,
  `.claude/roadmap.json` ; git en option ; ni `check.mjs`, ni hook, ni historique. **Le doctor** y
  vérifie python3, la roadmap, les réglages, les champs exigés, le plugin et les skills du brief
  Projet, sans GitHub.

## Onboarding et doctor

Demande de Bertrand du 27/10/2026 : tout projet de code (adBricks mis à part, dont la roadmap reste
dans son dossier Cowork) entre dans le système par la skill `onboarding`, et la skill `doctor` dit
s'il est bien branché.

- **La roadmap vit dans le dépôt, donc sur GitHub** : un dossier `roadmap/` à la racine
  (`ROADMAP.md`, `ROADMAP-fait.md`, `ROADMAP-bilans.csv`), que `.claude/roadmap.json` désigne au
  panneau (`"dir": "roadmap"`). Un projet qui la tient déjà à sa racine (Splitmybill) la garde là.
- **L'historique, au choix** : sur un dépôt existant, l'onboarding propose de reconstituer la
  roadmap des 6 derniers mois. Une tâche faite par PR fusionnée (sinon par fusion, sinon par jour
  de commits), avec `src:` vers la PR ou le commit et un bilan « reconstituée, sans bilan » ; une
  tâche ouverte par PR ouverte, avec sa branche. Claude écrit les libellés et les axes, le script
  numérote et écrit.
- **Le doctor** lit, sans rien changer : outils, `main` poussé, roadmap trouvée et conforme,
  `check.mjs`, plugin roadmap, Superpowers et chaque skill de méthode que cite le brief des
  sessions (une skill renommée par Superpowers se voit là), sa mise à jour (suivie par l'app pour
  un plugin du compte, à allumer pour un catalogue tiers du terminal), `swiftui-pro` dans un projet
  Swift. Il juge les plugins que l'app charge, lus dans son magasin, et non la copie `synced` du
  terminal, qui peut retarder. Un test garde sa liste alignée sur celle de `hooks/parse.ts`.
- **Superpowers n'est pas déclaré en dépendance du plugin** : le plugin est installé par la
  synchro du compte et Superpowers vient d'un autre catalogue ; une dépendance non résolue
  pourrait empêcher le plugin de se charger. Le doctor la vérifie et donne la commande.
- **Aucune dépendance au plugin cowork** : la façon de poser une question (réglage Questions,
  questions de l'onboarding) est écrite dans ce plugin.

## Capter les tasks

Règle de Bertrand du 21/10/2026, écrite dans `~/.claude/CLAUDE.md` : un travail demandé sans task
ouvre sa ligne dans `ROADMAP.md` dès le départ, et la clôt à la livraison. Le plugin la tient dans
chaque projet qui a une roadmap :

- **à chaque écriture** (Edit, Write, NotebookEdit, commande Bash qui n'est pas en lecture seule),
  il relit `ROADMAP.md` et `ROADMAP-fait.md` et renvoie au modèle les lignes nouvelles ou changées
  qui sortent de la grammaire : bloc `[…]` absent, axe manquant ou non déclaré dans l'en-tête (« Axes
  en usage : … » ou « - **axe** … »), clé inconnue, date qui n'est pas AAAA-MM-JJ, `[x]` sans `fait:`,
  task cochée restée dans `ROADMAP.md` ou non cochée dans `ROADMAP-fait.md`. Une ligne ancienne
  hors grammaire ne revient pas à chaque écriture ;
- **en fin de tour**, si le tour a modifié des fichiers du projet (ou changé l'état git de son
  dépôt) et que la roadmap n'a pas bougé depuis le début de la session, il bloque l'arrêt une fois
  et rappelle la règle ; le modèle inscrit la task, ou termine s'il n'y a rien à inscrire ;
- **idée sans ligne** (règle du 28/10/2026, #83) : une question n'ouvre pas de ligne, mais une
  question dont la réponse fait naître une chose à coder se termine par la proposition d'ouvrir sa
  ligne. En fin de tour, si la dernière réponse ou la boîte de fin propose de construire quelque
  chose (« je peux coder », « je cadre si tu veux », « on pourrait ajouter », « veux-tu que je… »,
  « une suite possible »), que la roadmap n'a pas bougé pendant le tour et qu'aucune carte de
  session n'a été posée, le plugin bloque l'arrêt une fois : le modèle termine par la boîte de fin
  avec « J'ouvre la ligne de … ? » et son bouton, ou dit en une ligne pourquoi non. Des motifs de
  texte, pas un modèle : une idée tournée autrement passe, une fausse alerte coûte une phrase. Une
  réponse qui parle déjà d'ouvrir la ligne, le code et les citations « … » ne comptent pas ;
- **chantier fini** (règle du 23/10/2026) : quand la tâche que porte la session (« #N · … ») vient
  d'être cochée, bilan écrit, la fin de tour bloque une fois et demande au modèle de terminer par la
  boîte de fin avec « Archiver cette session ? » et le bouton de réponse « Oui, archiver » (l'app
  ne propose jamais le bouton d'app `archive`, #87), ou de dire ce qui reste. Sur ce clic, et sur
  lui seul, le modèle appelle `archive_session` (`self`). Le rappel du bilan passe d'abord ; une
  seule fois par tâche.
- **bloc de fin de tour** (règle du 28/10/2026, #85, dans tout projet, roadmap ou non) : en mode
  ADHD, un tour de travail (le tour a appelé la boîte de fin ou la liste d'étapes) dont la
  dernière réponse n'a pas ses trois lignes `État`, `À toi`, `Session` (sans casse, accents, gras,
  puces, citation ni emoji de tête, chacune en début de ligne et suivie de « : »), ou dont la ligne Session dit « à
  archiver » sans le bouton « Oui, archiver » dans la boîte, bloque l'arrêt une fois ; le rappel
  nomme ce qui manque et redonne le format. Les étiquettes comptent, pas leurs valeurs ;
- **méthode** (2026-10-23) : le brief d'une session lancée du panneau dit quelle skill superpowers
  appelle quelle situation (`writing-plans` pour un lot de plusieurs fichiers,
  `test-driven-development` pour un changement de comportement, `systematic-debugging` pour un
  bug, `verification-before-completion` avant de cocher, `brainstorming` seulement si Bertrand
  répond). En fin de tour, si le tour a enregistré un commit qui touche du code (ses commits,
  sans les merges) sans aucun fichier de test, ou si la session n'a lancé aucune skill de méthode
  (vue par l'expansion de la skill, `skill.prompt`, ou par l'outil Skill et la commande tapée),
  le plugin le rappelle, une fois par commit.
  C'est un rappel : un commit sans comportement (doc, config, renommage) se dit et termine.
  Depuis 0.23.0, un écran ou une vue SwiftUI créé ou modifié appelle `swiftui-pro` sur les
  fichiers touchés avant de dire fini : le brief le dit, et un commit qui touche un fichier
  `*.swift` (hors tests : dossier `…Tests/`, fichier `…Tests.swift`) sans que la session ait lancé
  `swiftui-pro` (avec ou sans préfixe de plugin) ajoute la ligne au même rappel.
  Depuis #96 (29/10/2026), un commit du tour qui crée un fichier d'interface (`.tsx`, `.jsx`,
  `.swift`, `.css`, `.scss`, `.sass`, `.less`, `.html`, `.vue`, `.svelte`, hors tests) ou y ajoute
  au moins 40 lignes, alors que la session n'a montré aucune maquette (`show_widget`, un
  formulaire dont une option porte un `preview`, une page `.html` ou `file://` ouverte dans le
  volet navigateur), ajoute la ligne des maquettes au même rappel ; une feuille de style seule y
  entre aussi. Le brief dit qu'un choix visuel passe par 2 ou 3 maquettes avant le code.

Pour adBricks, le repo et ses worktrees comptent comme le projet du dossier Adbricks Cowork, qui
porte la roadmap. Le réglage `capture` coupe les deux.

## Sur un compte Team ou Enterprise (#116)

Claude Code y pose devant les plugins installés son plugin intégré `cc-plugin-sec-default`, qui saute
leurs hooks `classic.*` et `skill.prompt` (le transcript le dit en lignes grises, « hook was
skipped »). Le plugin passe alors par les événements qui restent aux plugins installés : le message
(`prompt.submit`) porte les réglages de session, le rappel du mode ADHD et l'état de Maestro ; l'outil
Skill et la commande tapée notent les skills et ouvrent les volets ; le rappel de fin de tour, si Stop
n'a pas tourné, arrive en message du plugin, qui ouvre un tour de plus. Une compaction, que
sec-default cache aussi, se voit au contexte qui fond entre deux messages (moitié moins, ou plus
mesuré du tout, `$.session.usage()`) : les réglages complets reviennent au message suivant (#119).
Le doctor le dit (ligne « Hooks du plugin »), avec la voie
admin : `roadmap@roadmap` en `appendPlugins` dans les réglages gérés.

## Réglages de session

Demande de Bertrand du 23/10/2026 : les mêmes réglages dans chaque session, sans les répéter. Au
démarrage de chaque session (et après `/clear` ou un compactage), dans tout projet, roadmap ou
non, le plugin lit `~/.claude/reglages-session.json` et donne au modèle, en contexte additionnel,
les réglages allumés (sur un compte Team ou Enterprise : au premier message, et au message qui suit
une compaction, voir plus haut). Un réglage changé en cours de session (le volet, la skill, une autre
session du projet) revient au message suivant de chaque session ouverte du projet, le nouveau bloc
remplaçant le précédent (#119) :

- `questions` : toute question à Bertrand par l'outil AskUserQuestion, jamais en texte libre, et
  jamais pour un geste qu'un outil fait : un volet de l'app fermé ou masqué (navigateur, fichier,
  diff) s'ouvre par la session elle-même (`preview_start`, `mcp__ccd_view__show_pane`), depuis le
  28/10/2026 (#74). Éteint, Maestro pose aussi son menu « Je lance lesquelles ? » dans son message,
  sans formulaire (#119) ;
- `adhd` : chaque message commence par une ligne en gras, emoji d'état + étape sur le total + nom
  (en cours `⏳ **2/4 Écrire le plan**` ; finie `✅ **2/4 Écrire le plan**` ; détour
  `⚠️ **3/4 Coder et tester** ↳ test rouge` ; fin `✅ **4/4 Publier la version**`, #107) ; les
  étapes sont celles de la liste d'étapes native, même ordre, même nom (un verbe et son objet,
  « Écrire le plan », jamais renommé) ; pas de ligne pour une réponse courte hors tâche, puis une phrase de constat et, s'il en reste une, la seule
  action ou décision qui revient à Bertrand, listes et gras, pas de pavé. Donnée seulement au démarrage, la consigne s'effaçait au
  fil d'une longue session : depuis le 24/10/2026, une ligne de rappel l'accompagne à chaque
  message de Bertrand (hook `prompt.submit` depuis #116). Depuis le 29/10/2026 (#85), un tour de travail
  (boîte de fin ou liste d'étapes) se termine, après la boîte de fin, par le **bloc de fin de
  tour**, trois lignes sans emoji depuis #123 : `**État**` (fini, pas fini, bloqué) et une phrase,
  `**À toi**` (rien, ou une à trois actions avec où et comment), `**Session**` (à archiver, avec
  la boîte « Archiver cette session ? » et le bouton de réponse « Oui, archiver » ; à garder, et
  pourquoi). Au dernier tour d'une session, une fiche en tableau les remplace (#123) : Mission,
  Livré, État, À toi, Session. Éteint, Maestro ne demande plus
  que des réponses courtes (#119) ;
- `francais` : réponses en français ;
- `autonome` (#77, #105, avec ou sans code, éteint par défaut) : Claude suit sa
  recommandation au lieu de poser la question, sauf pour une question d'architecture, c'est-à-dire
  un choix qui s'écrirait dans `docs/decisions.md`. Le réglage est l'autorisation durable de
  fusionner et de publier (release d'un plugin, déploiement, push de `main`) : aucune session ne
  demande « je fusionne ? » ni « je publie ? », elle le fait puis le dit en une ligne. Un Maestro ou
  Maestro fusionne seul la branche prête d'une de ses sessions (tests verts, à jour de `main`,
  diff relu par lui), une à la fois, tests rejoués après chaque fusion, et donne seul la main sur
  une ressource unique, publication comprise ; la clause de Maestro le dit à la sous-session. Lancer
  et archiver gardent le clic de Bertrand ; un message en son nom ou un paiement se demandent
  toujours.

Toujours dite, réglages éteints compris, avec ou sans code : la règle des gestes
hors du code (#82, 28/10/2026). Un geste qu'une tâche demande hors du dépôt (tâche planifiée,
réglage d'un service, formulaire) se fait par la session : d'abord par un connecteur MCP ou une
API (une tâche planifiée : `mcp__scheduled-tasks__create_scheduled_task`), sinon dans le volet
navigateur, jamais par un texte que Bertrand colle. Ne lui reste que ce qu'aucun outil ne fait (un
secret, la connexion à son compte), la page ouverte au bon endroit. `autonome` allumé, le geste se
fait sans confirmation ; éteint, la session demande son oui avant d'écrire. Les règles de sécurité
du modèle restent au-dessus (envoyer un message en son nom, payer, valider un formulaire dans le
navigateur sans qu'il l'ait demandé).

Toujours dite aussi, avec ou sans code : la règle des maquettes (#96, 29/10/2026). Tout choix
dont le résultat se voit (dans un projet de code : écran, vue, panneau, volet, composant, mise en page, graphique ; sans code : la mise en page d'un document, d'un tableau, d'une présentation)
passe par 2 ou 3 maquettes simples, chacune avec son parti et son compromis, la recommandation en
premier ; Bertrand choisit, puis la session code ou décide. Le support est le plus léger qui
permet de décider : l'aperçu (`preview`) des options d'un formulaire, un widget `mockup`
(`mcp__visualize__show_widget`), ou une page HTML statique du dossier du projet ouverte dans le
volet navigateur. `autonome` ne s'y applique pas. Sous un Maestro, la sous-session écrit ses
maquettes dans une page, dit « attend une réponse : choix de maquette » et Maestro les montre à
Bertrand.

Sans fichier, les trois premiers sont allumés et `autonome` est éteint. Depuis #102 (29/10/2026,
« quand je suis dans Roadmap, je veux des réglages potentiellement différents de Splitmybill »),
chaque projet a les siens : un bloc par projet sous `projets`, sa clé le dossier principal du
dépôt (un worktree compte pour son projet), en `~/`. Un projet sans bloc prend les clés du haut du
fichier, sinon les valeurs par défaut ; le dossier personnel n'est pas un projet. Un fichier
illisible laisse les réglages par défaut et le dit. La skill `reglages-session` les lit et les change.

### Le volet Réglages

Demande de Bertrand du 28/10/2026 (#81) : voir chaque réglage et le changer d'un clic, sans
retenir de phrase. Refait le 29/10/2026 sur la maquette qu'il a choisie (#91, « juste On / Off »).
`/reglages` ouvre le volet « Réglages » dans tout projet, roadmap ou non ; la roue en haut à droite
du panneau (le bouton « Réglages » au terminal) et la skill `reglages-session` l'ouvrent aussi.

Rangé en sections par sujet depuis #118 (29/10/2026, maquette A1) : un titre, sa portée en
dessous, un filet et un grand écart entre deux sections.

- **Une ligne par réglage** : le nom et son ⓘ à gauche, le contrôle à droite. Un oui/non a deux
  boutons côte à côte, « On » et « Off », le choix actif en bouton principal ; un clic sur l'autre
  change la valeur, un clic sur l'actif ne fait rien. Le ⓘ ouvre sous la ligne son explication (ce
  qu'il fait, ce que fait Off, le défaut, quand il prend effet), une seule à la fois ; plus rien au
  survol.
- **Claude et toi** : les quatre réglages de session du projet où l'on est, sa portée le nomme
  (« ce projet (Roadmap) · au prochain message », « hors projet · … » hors projet) ; un clic change
  ce projet seulement (#102), sans section
  « Par défaut », écartée par Bertrand (« le projet c'est le projet »). Le volet relit le
  fichier avant chaque écriture et garde tout ce qu'il ne touche pas ; un fichier illisible n'est
  jamais réécrit. Il suit aussi le fichier écrit ailleurs (la skill, une autre session) : il le
  relit toutes les 2 s tant qu'il est ouvert. Un changement vaut au message suivant, dans chaque
  session ouverte du projet (le plugin y redonne le bloc, #119), et dans les sessions ouvertes ensuite.
- **Sessions lancées, Roadmap, Panneau** : les options ci-dessous, sous un nom court, avec
  l'explication du menu de configuration de Claude Code ; portée « partout · tout de suite ». Une
  option qu'aucune section ne range encore tombe dans « Autres » : les oui/non d'abord, puis les
  listes (un choix), puis les textes (un champ). Le volet les reconnaît à leur clé (`roadmap.<option>`) : dans l'app, leur
  fournisseur s'écrit `roadmap@inline`. Un changement recharge le plugin, et les panneaux se
  redessinent. Une option verrouillée par l'organisation se montre sans contrôle.

Sur l'application mobile, qui ne dessine ni choix ni champ, un bouton passe à la valeur suivante.

## Trouver la roadmap d'un projet

Dans cet ordre, pour le projet de la session (un worktree remonte à son dossier principal) :

1. `.claude/roadmap.json` dans le projet, tout facultatif :
   `{ "name": "Clipping", "dir": "docs", "me": ["Alex"], "subjects": ["Montage", "Diffusion"] }`
   (`dir` relatif au projet ou absolu ; sans `subjects`, le modèle choisit ses sujets), et les
   réglages : `mode` (`auto` par défaut, voir « Un seul mode »), `requis`, `requis_sur`, `cles`, `vue` (voir « Dossier sans code »), et `rangement`
   (#101) : `{ "skill": "aafes-memory", "ligne": "Rangé dans" }`, la tâche de la session cochée,
   la fin de tour ne propose l'archivage qu'une fois la ligne de rangement (ou « Rien à ranger »)
   écrite dans une réponse de la session, et rappelle sinon la règle de rangement de la skill ;
   sans ce réglage, l'archivage se propose comme avant.
2. Les `sources` du fichier local de l'utilisateur, `~/.claude/roadmap-perso.json` : une roadmap
   que montrent plusieurs dossiers, reconnus au début de leur chemin (`match`, `dir`, `name`,
   `subjects`, `me`). Le plugin publié n'en porte aucune (#79).
3. Un `ROADMAP.md` à la racine du projet.

Rien de tout ça : pas de panneau, et `/roadmap` dit quoi ajouter (la skill `onboarding` la pose).

## Réglages

Dans le volet `/reglages` (voir plus haut) ou dans les réglages du plugin (menu de configuration de Claude Code) : `me` (tes noms : le premier est celui que Claude emploie avec toi, tous comptent « À moi » ;
vide par défaut, et alors ceux de `me` dans `~/.claude/roadmap-perso.json`, que pose l'onboarding ;
sans nom, Claude dit « l'utilisateur »), `autoOpen` (« Panneau toujours ouvert », défaut oui : le panneau
s'ouvre au démarrage, se rouvre au message suivant s'il n'est pas dessiné ou a disparu, et sa croix ne le
ferme pas, un toast renvoie à ce réglage ; éteint, seul `/roadmap` l'ouvre, et il se ferme, #117),
`titleModel` (modèle des titres courts, défaut sonnet), `capture` (contrôle de grammaire et rappel de fin de tour,
défaut oui), `theme` (thème du panneau : auto suit le thème de Claude Code, sombre ou clair l'imposent),
`launchEffort` (effort d'une session lancée du panneau, défaut high, borné par l'app à celui de la session
qui lance ; une carte refusée avec son effort est reposée sans lui ; « hérite » n'en passe aucun),
`launchBypass` (« Lancer en bypass », défaut non : les sessions lancées du panneau, ou par une carte
que pose Claude, Maestro compris, demandent le mode bypass ; l'app ne l'accorde que depuis une session déjà en bypass, sinon
la carte est reposée sans lui et la session lancée demande elle-même le bypass à son démarrage, par
la carte d'approbation de l'app ; il faut d'abord activer le bypass dans Réglages → Claude Code).
`axisPill` (« Axe en pastille », défaut non depuis #177 ; #156) : allumé, chaque tâche ouverte de la
liste porte son axe en pastille grise, à droite du titre, avant l'âge ; jamais dans « En cours » (le bloc
de Maestro ou le filtre, où le carré d'axe suffit et le titre garde sa place), ni sous un axe choisi, ni
quand les sections se rangent par axe en attendant les titres, ni dans un projet qui montre ses propres
clés (`cles_visibles`). L'arbre suit le même réglage ; la fiche d'une tâche et l'en-tête de sa session
gardent leur axe. Allumée, le panneau dessine 20 lignes d'un coup au lieu de 40, puis « Voir les N autres ».
`capture` éteint coupe tous les contrôles et rappels de la roadmap : la grammaire, et en fin de tour
le travail à inscrire, le bilan d'une tâche cochée, son rangement et l'archivage de la session,
l'idée à coder sans ligne, et après un commit les tests, les skills de méthode et les maquettes ; la
liste d'étapes et le bloc de fin de tour restent (#119). Les noms (`me`) : Claude emploie le premier
de l'option, sinon du fichier local ; « À moi » compte, dans cet ordre, les noms du
`.claude/roadmap.json` du projet, de sa source dans le fichier local, de l'option, puis du fichier
local (#119).
Le **garde-fou du dossier principal** vaut dans tous les modes : dans un dépôt qui a au moins deux
worktrees, le plugin refuse dans le dossier principal `git reset --hard`, `git clean`, `git stash`,
`git checkout <branche>`, `git add -A`, `git commit -a` et un `push` forcé, et partout un `push`
forcé vers `main`.
Un refus du mode auto ne tient pas à l'effort : la carte n'est pas reposée, Claude la pose dans la
conversation, et les lancements des 30 minutes suivantes passent droit par lui. Le détail le dit en
une phrase, qui s'efface dès que la session tourne ; le refus brut de l'app va au relevé `perf`
(rangée `kind: 'launch'`), jamais à l'écran.

## Développer

```bash
claude plugin validate plugins/roadmap
claude plugin test plugins/roadmap
```

Les couleurs et mesures du panneau viennent de `hooks/tokens.ts` (#108) : une couleur ou une part de mélange écrite en dur ailleurs est refusée par `node design/scripts/check.mjs`. Le même fichier nourrit le design system de `design/` (composants React, `styles.css`), que `/design-sync` publie dans claude.ai : un changement de `tokens.ts` se reporte par `npm run tokens` dans `design/`. `tests/rendu.test.tsx` garde l'empreinte du dessin : un rendu changé exprès les relève à nouveau.

## Historique

- **0.118.4 (2026-11-01)** : panneau : un refus du mode auto sur la liste des sessions garde le bloc « En cours » de Maestro (#185)
- **0.118.3 (2026-11-01)** : panneau : l'encart de confirmation du rond devient une carte au filet orange, sans aplat (#184)
- **0.118.2 (2026-11-01)** : panneau : le titre de la fiche d'une tâche à la hauteur de son crayon (#181)
- **0.118.1 (2026-11-01)** : panneau : la carte Fin aligne ses valeurs sur la carte Détails (#183)
- **0.118.0 (2026-11-01)** : maestro : ne relaie plus la question d'une de ses sessions, Bertrand y répond dans la session ; rappel après 15 min seulement (#151)
- **0.117.0 (2026-11-01)** : panneau, skills : un seul mode ; tous les filtres et rangements partout, cachés quand vides ; le travail (worktree, fusion, rappel de méthode) déduit du dossier, git avec du code ou non ; l'onboarding ne demande plus de mode (#176)
- **0.116.0 (2026-11-01)** : panneau : le rond d'une tâche se confirme en deux temps (cocher, rouvrir une faite, tout clore), et le numéro suit le rond à écart fixe (#179)
- **0.115.2 (2026-11-01)** : panneau : plus de pastille d'axe dans « En cours », où le compte d'étapes n'est plus coupé ; la pastille d'axe de la liste devient un réglage, éteint par défaut (#177)
- **0.115.1 (2026-11-01)** : panneau : le pied lit le catalogue local de Claude Code et propose « Mettre à jour » quand l'app retarde (#178)
- **0.115.0 (2026-11-01)** : panneau : bande Maestro serrée et collée à droite, icône pour archiver une session close, Completed et Done à la place de close et faites, le contexte de Maestro seul (#174)
- **0.114.4 (2026-11-01)** : panneau : le brief d'une session lancée et le contrôle d'une ligne neuve rappellent ROADMAP-REGLES.md (#171)
- **0.114.3 (2026-11-01)** : panneau : le Livré de la carte Fin s'affiche en blocs, sans puce devant (#173)
- **0.114.2 (2026-11-01)** : panneau : les notes d'attente (titres courts en préparation, carte de session posée) deviennent une bande bleue avec titre et explication (#169)
- **0.114.1 (2026-11-01)** : panneau : la fiche d'une tâche close tient dans la largeur ; la Chaîne ne déborde plus, Tout voir est aligné, Livré s'affiche sans puce isolée ni code coupé à son tiret (#173)
- **0.114.0 (2026-11-01)** : panneau : la roadmap s'ouvre en arbre par axe, en mode Code comme en mode Projet ; une section par axe dans l'ordre de la légende, les mères et leurs filles reliées par des coudes, un rond pour cocher (#168)
- **0.113.2 (2026-11-01)** : panneau : les étapes d'une session suivent la conversation après une boîte de fin en cours de tâche, et les barres du bloc Maestro partent toutes de la même colonne (#172)
- **0.113.1 (2026-11-01)** : panneau : un lancement par ▶ part au nom de la personne, sans l'habillage « The roadmap plugin sent a message » (#170)
- **0.113.0 (2026-11-01)** : skills : tout projet a son ROADMAP-REGLES.md à côté de ROADMAP.md, posé par l'onboarding, exigé par le doctor, lu par tasks, audit et Maestro (#167)
- **0.112.1 (2026-11-01)** : panneau : le panneau ne remonte plus tout seul pendant qu'on fait défiler la liste (#154)
- **0.112.0 (2026-10-31)** : panneau : N faites à droite de l'en-tête, la roue des réglages dans le pied à côté de Rafraîchir ; quand l'app retarde, l'encart ouvre la page Plugins de claude.ai et Recharger pose /reload-plugins dans la saisie (#162)
- **0.111.0 (2026-10-31)** : panneau : la fiche d'une tâche a une flèche retour en tête, à la place de la marque, qui ramène à la roadmap ; plus de bouton Toute la roadmap ni de Retour à la liste en bas (#165)
- **0.110.0 (2026-10-31)** : panneau : la roadmap s'ouvre en arbre dès qu'elle a une tâche mère ; arbre redessiné « Le fil » (une case par ligne pour cocher ou rouvrir, mère nette, étapes légères), « Tout replier » et « Tout clore » (#163)
- **0.109.0 (2026-10-31)** : audit : seul audit de la roadmap, en anglais : structure, puis retards, tâches sans date et priorités (une question par tâche), clôtures sur preuve là où le projet le dit (preuves), écriture par la skill tasks ; en tâche planifiée, ses questions restent en attente et comptées (#159)
- **0.108.0 (2026-10-31)** : panneau : quand le projet déclare ecriture, Marquer faite, Annuler la tâche et Enregistrer de la fiche sont confiés à Claude (Coche #N par la skill tasks), l'encart dit Confié à Claude par <outil> (#164)
- **0.107.0 (2026-10-31)** : panneau : chez Maestro, le bloc En cours montre ses tâches en lignes de la liste, toujours ouvert, la roadmap visible dessous ; pastille Toutes qui garde l'axe ; axes toujours dépliés (#160)
- **0.106.0 (2026-10-31)** : skills : doctor, maestro, onboarding, reglages-session et roadmap-panel passent en anglais, comportement inchangé ; elles parlent et écrivent la roadmap en français ; contrôle de langue tools/test_langue.py (#166)
- **0.105.0 (2026-10-31)** : panneau : éditer une tâche depuis sa fiche : le crayon ouvre ses champs en place (libellé, attente, prérequises, parent, axe, responsable, clés du projet, échéance), Enregistrer réécrit la ligne contrôlée par les règles du projet (#161)
- **0.104.0 (2026-10-31)** : tasks : nouvelle skill qui tient la roadmap au quotidien (ajouter, compléter, redater, cocher sur preuve, abandonner, rapprocher par sujet) ; .claude/roadmap.json déclare regles, ecriture et preuves ; skills du plugin en anglais (#158)
- **0.103.0 (2026-10-31)** : bande de Maestro : le contexte utilisé de Maestro dans l'en-tête (13 % · 132,5k / 1M, jauge orange à 70 %, rouge à 85 %), et celui de chaque session en jauge fine sous ses étapes (#157)
- **0.102.0 (2026-10-31)** : panneau : chaque tâche ouverte porte son département en pastille à droite du titre (réglage Département en pastille, allumé), et « #N · » se colle au titre (#156)
- **0.101.0 (2026-10-31)** : panneau : la fiche montre la mission seule, puis une carte Fin en tableau mis en forme (Fait, Livré, Souci, État, À toi) ; toute tâche close a son récap, gardé ou tiré de la roadmap et du bilan (#150)
- **0.100.1 (2026-10-31)** : panneau : « Marquer faite » et « Annuler la tâche » acceptent les clés déclarées par le projet (cles), comme « projet: » (#155)
- **0.100.0 (2026-10-31)** : panneau : « En cours » répond au clic (zones de clic remontées après une démolition par l'app), « N faites » devient le lien vers les faites, bande de Maestro à une jauge par ligne avec la roue (#152)
- **0.99.0 (2026-10-31)** : maestro : là où l'app ne dessine pas la carte d'accueil (compte Team), Claude dit l'accueil et pose ses boutons ; le plugin note ce que la carte a vu sur la machine (#153)
- **0.98.0 (2026-10-31)** : panneau : le pied montre la version du plugin et un bouton Rafraîchir qui relit tout et dit si l'app retarde sur la version publiée, avec le geste (#138)
- **0.97.0 (2026-10-31)** : panneau : chez Maestro, « En cours » est l'arbre des sessions ; axes repliés, filtres en pastilles, ▶ au bout de la ligne, plus de redite (#149)
- **0.96.0 (2026-10-31)** : maestro : l'arbre des sessions de Maestro se tient au-dessus de la saisie (bande AbovePrompt, style C), à jour et cliquable (#147)
- **0.95.0 (2026-10-31)** : panneau : plus de vue Tableau ni de sélecteur Liste | Tableau, le panneau n'a plus que la liste (#148)
- **0.94.0 (2026-10-31)** : panneau, maestro : carte d'étapes opaque au-dessus de tout, barres alignées ; t'attend en orange, finie en violet ; étapes d'une tâche finie toutes cochées (#145)
- **0.93.0 (2026-10-31)** : panneau : la fiche d'une ligne longue tient en une phrase coupée avec « Tout voir », et la voie vide (un point seul) ne paraît plus (#146)
- **0.92.0 (2026-10-31)** : panneau : la fiche de tâche garde le récap de fin de sa session (Mission, Livré, État, À toi) dans le cadre de la mission, même la session archivée ; bouton Maquettes à côté de Spec et Plan (#144)
- **0.91.0 (2026-10-31)** : panneau, maestro : les étapes des sessions de Maestro en direct, en barre sous chaque voie et ligne en session, la liste au survol ou épinglée, dans la fiche ; l'arbre rangé par création (#143)
- **0.90.0 (2026-10-31)** : maestro : « Maestro » seul ouvre une carte d'accueil chiffrée sans scan (le jour, les faites sur le total, ce qui attend) et quatre boutons d'action directe (#141)
- **0.89.0 (2026-10-30)** : panneau : une seule fiche par tâche, en cartes, dans sa session comme au clic dans la roadmap : titre cliquable, mission dans un cadre, cartes selon l'état ; design/ : TaskFiche remplace TaskFocus (#142)
- **0.88.0 (2026-10-30)** : panneau, Maestro : sous sec-default, un lancement depuis le panneau n'affiche plus qu'une ligne (« Lancement de #N… »), le brief en contexte caché ; le rappel de fin de tour ne s'affiche plus en message, il rejoint le message suivant, et aucun rappel après un tour qui n'a posé qu'une carte (#140)
- **0.87.0 (2026-10-30)** : panneau, doctor, audit : les règles du modèle seule, parent, enfant sur deux niveaux, signalées à l'écriture et comptées par le doctor ; l'audit ne crée plus de troisième niveau (#125, lot 5)
- **0.86.0 (2026-10-30)** : panneau : un parent se ferme avec son dernier enfant (un parent récurrent se reconduit depuis son due: écrit), le cadenas dit ce qu'il attend, un parent bloqué bloque ses enfants, et les titres courts gardent la langue du libellé (#125, lot 4)
- **0.85.0 (2026-10-30)** : panneau : identité Roadmap au style Voies chez Maestro et chez une tâche, vue de tâche dans une session #N, Maestro voit ses tâches lancées (#137)
- **0.84.0 (2026-10-30)** : maestro : récap au fil des fusions, rappel de liste d'étapes après chaque fusion ou publication, ligne de récap par tâche livrée, fiche finale de Maestro avec le tableau de ses tâches (#136)
- **0.83.1 (2026-10-30)** : maestro : chez Maestro, la boîte de fin sans question est refusée tant que sa liste d'étapes suit des sessions en cours, pour que le menu reste visible (#133)
- **0.83.0 (2026-10-30)** : panneau : la date d'un parent est celle de son enfant ouvert le plus proche, due: n'y est plus exigé, et Ma journée ne montre que les enfants dus, sous leur parent en gris (#125, lot 3)
- **0.82.0 (2026-10-30)** : maestro : un tour réveillé par une session n'écrit rien à Bertrand sauf un besoin, ne repose pas une question en attente, et l'en-tête ADHD de Maestro devient un repère stable (#133)
- **0.81.0 (2026-10-30)** : panneau : les clés de cles_visibles (département, statut) en pastilles sur la ligne, l'arbre rangé en bandes par la clé ranger_par, et le doctor signale une clé non déclarée (#125, lot 2)
- **0.80.0 (2026-10-30)** : maestro : toute création de session demandée sous Maestro, carte, offer ou lancement, part au Maestro racine qui la pose ; une fille de Maestro n'en devient jamais un (#132)
- **0.79.0 (2026-10-30)** : maestro : une session lancée par Maestro le prévient par message de l'état où elle finit chaque tour (prête, bloquée, en attente, question, finie), une fois par état (#131)
- **0.78.0 (2026-10-30)** : panneau : la priorité ne s'affiche plus (ni pastille ni filtre Prioritaires), ne range plus et n'est plus demandée ; prio: reste lu et contrôlé (#130)
- **0.77.0 (2026-10-30)** : panneau : identité Roadmap à l'ouverture, carte Roadmap à la place du message « Maestro » ou du brief d'une tâche, en-tête Roadmap du panneau (#127)
- **0.76.0 (2026-10-30)** : panneau : en arbre, un bloc par parent, sa ligne en tête une seule fois avec son avancement, ses enfants en retrait et numérotés par rang, un parent hors filtre gardé en gris (#125, lot 1)
- **0.75.0 (2026-10-30)** : onboarding, doctor, réglages : toute maquette s'appuie sur le design system que déclare le projet (clé design de .claude/roadmap.json), ou propose d'en poser un (#129)
- **0.74.1 (2026-10-30)** : maestro : l'atome maestroIntro déclaré dans l'état du plugin, la validation repasse (#126)
- **0.74.0 (2026-10-30)** : maestro : « Maestro » seul ouvre le panneau et se présente, le scan de la roadmap attend un oui (#126)
- **0.73.0 (2026-10-30)** : maestro : rappel de roadmap muet chez un enfant de Maestro, archivage refusé tant que la ligne #N est ouverte, ligne État « fini : #N close le … » lue dans ROADMAP-fait, et un enfant archivé avant la clôture remonte à Maestro (#124)
- **0.72.0 (2026-10-30)** : reglages-session : mode ADHD, bloc de fin de tour sans emoji, et au dernier tour d'une session une fiche en tableau (Mission, Livré, État, À toi, Session) ; un rappel qui ne réclame que le bouton d'archivage ne fait plus réécrire le message (#123)
- **0.71.0 (2026-10-30)** : panneau : seconde vue, le tableau des sessions (T'attend, En cours, Prête, À lancer, Livrées), bascule Liste · Tableau en tête du panneau, compteurs cliquables par colonne, une session au repos sans question reste En cours (#120)
- **0.70.0 (2026-10-30)** : maestro : la carte est la question, la boîte de fin de Maestro qui redemande de lancer une carte posée dans le tour ou une session liée qui tourne est refusée une fois (#122)
- **0.69.0 (2026-10-30)** : maestro : « en attente » veut dire une question ouverte (boîte de fin, formulaire), au repos sans question n'attend pas, seules ses sessions comptent, et Maestro relit l'état d'une session avant de relayer sa question (#121)
- **0.68.0 (2026-10-29)** : réglages : audit des 11 réglages (#119), un réglage changé revient au message suivant de chaque session du projet, réglages redonnés après une compaction sous sec-default, Maestro suit questions et adhd, descriptions de capture et launchBypass justes
- **0.67.0 (2026-10-29)** : panneau : toujours ouvert, il se rouvre au message s'il n'est pas dessiné et sa croix est refusée tant que le réglage est allumé, son ouverture non dessinée part au journal (#117)
- **0.66.0 (2026-10-29)** : hooks et volet Réglages : les hooks du plugin tournent sous sec-default sur un compte Team ou Enterprise, par prompt.submit et des secours de Stop et skill.prompt (#116) ; le volet Réglages en quatre sections, l'explication derrière un ⓘ (#118)
- **0.65.0 (2026-10-29)** : panneau : le bas refait en maquette C (#115) — « À traiter » en quatre lignes à icône cliquables, la choisie surlignée ; « Plus de filtres » replié avec Qui ; roue des réglages en haut à droite ; menu « Ranger » qui montre le rangement en cours ; recherche sans bouton « chercher »
- **0.64.3 (2026-10-29)** : maquettes : une maquette du plugin s'appuie sur son design system roadmap-design, publié dans claude.ai par /design-sync (#113)
- **0.64.2 (2026-10-29)** : panneau : le relevé d'un défilement porte le refus du moteur et la durée de sa réponse (#111)
- **0.64.1 (2026-10-29)** : panneau : le relevé du défilement et du focus se garde à part des dessins, pour prouver le saut en haut (#111)
- **0.64.0 (2026-10-29)** : maestro : la session mère s'appelle Maestro partout, la skill lot devient maestro (/maestro), les textes du panneau disent « Maestro » et « la clause de Maestro », « Lot … » reste reconnu en alias des anciens titres (#112)
- **0.63.2 (2026-10-29)** : lot : archivage sans doublon ni retard : la boîte de fin du Lot qui propose d'archiver une session déjà archivée est refusée, et les nouvelles des enfants demandent de proposer dans le tour même après avoir relu list_sessions (#110)
- **0.63.1 (2026-10-29)** : panneau : « Voir les N autres » se déplie au clic de l'app de bureau (clés de bouton sans espace), chaque défilement du panneau relevé dans les mesures pour trouver le saut en haut (#106)
- **0.63.0 (2026-10-29)** : panneau et réglages : la bande des étapes au-dessus de la saisie retirée, elle doublait la liste native ; la consigne fait de la liste native le seul affichage des étapes, lisible (3 à 7 étapes, verbe et objet, jamais recopiée dans le message, à jour à chaque changement) (#109)
- **0.62.0 (2026-10-29)** : panneau et réglages : repères plus clairs : ligne ADHD à emoji d'état (⏳ en cours, ✅ finie, ⚠️ détour) et noms de la liste native (verbe et objet), bloc de fin à emoji de valeur, bande des étapes aux icônes de la liste native et barre d'avancement (#107)
- **0.61.0 (2026-10-29)** : audit : nouvelle skill qui audite le contenu de la roadmap (paquets découpés en tâche mère et sous-tâches datées, dépendances, doublons, trous), validée paquet par paquet, écrite tout ou rien avec sauvegarde et bilan par fragment ; proposée en fin d'onboarding (#103)
- **0.60.0 (2026-10-29)** : panneau et lot : la liste d'étapes native partout (rappel de fin de tour en mode Code aussi, liste entière dans une bande fixe au-dessus de la saisie), le Lot suit ses sessions par sa propre liste, la carte HTML du Lot retirée (#104)
- **0.59.0 (2026-10-29)** : reglages-session : avec autonome, fusion et publication sans demander dans les deux modes ; lot : le Lot donne seul la main, publication comprise (#105)
- **0.58.0 (2026-10-29)** : panneau : en mode Projet, le panneau s'ouvre sur Ma journée, avec quatre compteurs d'urgence (Ma journée, En retard, Cette semaine, À relancer), dates et attentes en couleur, filtre Qui combinable, récurrence tous: reconduite à la coche, date de relance relance: (#99)
- **0.57.0 (2026-10-29)** : reglages-session : les réglages de session sont propres à chaque projet ; le volet montre ceux du projet où l'on est (Session · Roadmap), un On/Off par réglage, sans section Par défaut ; le bloc du démarrage et le rappel suivent le projet de la session (#102)
- **0.56.0 (2026-10-29)** : onboarding : import d'une roadmap existante (checklist, CSV, Notion, tableau Markdown) par script, avec analyse, sauvegarde, numérotation et bilan sans ligne perdue ; verifier contrôle aussi ROADMAP-fait.md (#100)
- **0.55.0 (2026-10-29)** : roadmap : prêt pour un nouvel utilisateur : nom et sources dans ~/.claude/roadmap-perso.json, textes neutres, onboarding et doctor posent le nom, dépôt public bbr21/roadmap-plugin (#79)
- **0.54.0 (2026-10-29)** : roadmap : l'archivage d'une session attend la ligne de rangement réglée par projet (rangement dans .claude/roadmap.json, #101)
- **0.53.0 (2026-10-29)** : mode Projet : la liste d'étapes native exigée par le brief et rappelée en fin de tour (#98)
- **0.52.0 (2026-10-29)** : lot : le panneau demande la carte de l'état du lot quand une branche enfant est prête ou que deux tournent, dans les nouvelles des enfants et le brief de Maestro (#97)
- **0.51.1 (2026-10-29)** : doctor : le dossier AAFES Cowork n'en est plus exclu, il s'y contrôle en mode Projet (#78)
- **0.51.0 (2026-10-29)** : reglages-session : un choix visuel passe par 2 ou 3 maquettes que Bertrand choisit avant le code, dit à toute session, dans le brief, le Lot et les modèles de CLAUDE.md ; fin de tour : de l'interface committée sans maquette ajoute une ligne au rappel (#96)
- **0.50.0 (2026-10-29)** : lot : l'état du Lot en carte cliquable dans le chat (show_widget) : graphe de chaque branche face à main, conflits réels, ordre de fusion, boutons Fusionner et Résoudre les conflits, texte en repli (#95)
- **0.49.0 (2026-10-29)** : brief et doctor : Superpowers facultatif en mode Projet, plan et brainstorm proposés à la demande, vérification de fin simple, doctor en À voir (#94)
- **0.48.0 (2026-10-29)** : capture : en mode Code, une tâche lancée porte ouvert:, due:, qui: et après:, signalés à l'écriture, comptés par le doctor, rappelés par le brief (#80)
- **0.47.0 (2026-10-29)** : fin de tour et panneau : bloc de fin de tour en mode ADHD (État, À toi, Session) contrôlé dans tout projet (#85) ; brief de lancement : fiche: et spec: lus depuis la racine du projet, src: cité en texte sauf fichier existant, aucun chemin absent donné à lire (#93)
- **0.46.0 (2026-10-29)** : reglages-session : le volet Réglages refait sur maquette, On | Off côte à côte, explication au survol, options du panneau retrouvées (dont Lancer en bypass), plus d'exception par projet (#91)
- **0.45.0 (2026-10-29)** : roadmap : option « Lancer en bypass » (le ▶, Maestro et le Lot demandent le bypass, sinon la session lancée se relève d'un clic) ; archivage d'un clic par « Oui, archiver » et archive_session ; garde-fou des commandes git interdites dans le dossier principal (#87)
- **0.44.3 (2026-10-29)** : onboarding : le check.mjs posé tolère un spec: ou une fiche: absent sur une ligne prise (branche:) et l'exige sur une ligne libre ou close (#92)
- **0.44.2 (2026-10-29)** : roadmap : nouvelles des enfants polies : le parent lit ses enfants en parallèle, git borné à 5 s et sans verrou ; question périmée, enfant épinglé, session distante, dossier absent et base de la session pris en compte ; notes sérialisées, validées et purgées après 30 jours (#90)
- **0.44.1 (2026-10-29)** : roadmap : la ligne qu'une autre session ajoute pendant une commande longue (les tests du panneau) ne passe plus « en session » ni au rappel « une session, une tâche » ; un Bash ne compte que s'il nomme ROADMAP.md ou lance cowork.py (#89)
- **0.44.0 (2026-10-29)** : roadmap : une réponse qui propose une chose à coder, sans ligne de roadmap ni carte de session, renvoie Claude une fois en fin de tour pour proposer d'ouvrir la ligne en bouton ; la consigne de fin de tour le dit (#83)
- **0.43.0 (2026-10-28)** : roadmap : le parent prend des nouvelles de ses enfants (une ligne par enfant coincé depuis 15 min, relance unique, enfants vérifiés finis à archiver d'un clic), 15 min partout, liste d'étapes demandée à toute session ; lot : prendre des nouvelles, archiver d'un clic (#84)
- **0.42.1 (2026-10-28)** : roadmap : mode Projet poli : une section de l'arbre reste dépliée quand une sous-tâche se clôt, resp: vide ou - sans pastille (resp:- signalé), « faite » une fois au parent, pas de ↳ sous une recherche, check.mjs accepte les clés déclarées à chiffre ou tiret et parent:#N (#86)
- **0.42.0 (2026-10-28)** : roadmap : mode Projet dans .claude/roadmap.json (mode, requis, cles, vue) ; resp:, parent:, après: multiple ; champs exigés signalés à l'écriture ; vue par échéance, responsable ou arbre ; sessions sans worktree ni fusion ; onboarding et doctor du mode Projet (#76)
- **0.41.0 (2026-10-28)** : reglages-session : le volet Réglages (/reglages, bouton du panneau, la skill l'ouvre) montre chaque réglage de session et option du panneau, son état et son explication, et le change d'un clic, partout ou pour ce projet (#81)
- **0.40.0 (2026-10-28)** : reglages-session : un geste hors du code (tâche planifiée, réglage d'un service) se fait par MCP ou API, sinon dans le volet navigateur, jamais par un texte à coller ; autonome allumé sans confirmation, éteint un oui avant d'écrire, en mode Code comme en mode Projet (#82)
- **0.39.0 (2026-10-28)** : reglages-session : réglage autonome (mode Code, éteint par défaut), Claude suit sa recommandation sauf question d'architecture ; roadmap : avec lui, Maestro pose ses cartes sans menu, fusionne seul une branche prête et répond aux sessions qui attendent (#77)
- **0.38.0 (2026-10-28)** : roadmap : bouton Marquer faite au détail d'une tâche ouverte, confirmation d'un clic, même écriture que l'annulation ; Marquer faite et Annuler la tâche restent visibles quand une session tient la tâche, avec un avertissement (#73)
- **0.37.0 (2026-10-28)** : roadmap-panel : /roadmap:roadmap-panel tapée seule ouvre le panneau d'une ligne, sans diagnostic ; réglages de session : une session ouvre elle-même un volet masqué au lieu de demander à Bertrand de l'afficher (#74)
- **0.36.0 (2026-10-28)** : roadmap : Maestro reçoit et relaie les tâches que proposent ses sessions, même une seule et ses petites-filles (#71)
- **0.35.2 (2026-10-28)** : roadmap : Maestro reconnu au premier message d'une session en worktree, après les blocs <system-reminder> que l'app met en tête (#69)
- **0.35.1 (2026-10-28)** : roadmap : une tâche ajoutée n'est qu'à la session dont l'outil l'a écrite, plus celle qu'une autre session a ouverte entre-temps (#70)
- **0.35.0 (2026-10-28)** : roadmap : la carte New task d'une sous-session remonte à son Lot (message, sinon au message suivant du Lot) ; skill lot : le Lot ouvre la ligne et la propose à Bertrand
- **0.34.1 (2026-10-28)** : doctor : juge les plugins que l'app charge (son magasin), plus la copie synced du terminal ; mise à jour d'un plugin du compte suivie par l'app
- **0.34.0 (2026-10-27)** : onboarding : corrections du test 1 sur le plugin lui-meme, une tache par commit quand le depot n a ni PR ni fusion, liens des modeles ignores par check.mjs (cle ignorer), lignes en plus dans .gitignore (cle gitignore), commentaires des commandes alignes
- **0.33.0 (2026-10-27)** : onboarding : remplace projet-init, roadmap dans roadmap/ du depot avec ses bilans, reconstitution au choix depuis les PR des 6 derniers mois ; doctor : checklist du projet (GitHub, roadmap, Superpowers et ses skills, swiftui-pro) ; plus de dependance au plugin cowork
- **0.32.1 (2026-10-27)** : roadmap : lancement refuse par le mode auto : note courte en francais effacee des que la session tourne, pas de second essai sans effort, lancements suivants droit par Claude pendant 30 min, refus brut au releve perf (id:354)
- **0.32.0 (2026-10-27)** : roadmap : cle feedback (numeros des retours de l app) lue et controlee, pastille Feedback sur la ligne et au detail avec les numeros, etat Retours qui filtre ces taches (id:227 de Splitmybill)
- **0.31.0 (2026-10-27)** : roadmap : chaines apres reliees par un trait et numerotees sous le sujet de leur tete ; prio 1 2 3 en pastille, tri et filtre Prioritaires ; Maestro en tete d un message ouvre le panneau et propose ce qu on peut lancer, sessions coincees d abord ; cap des sessions lancees
- **0.30.0 (2026-10-27)** : roadmap : le panneau voit la session ou il est ouvert (list_sessions l exclut, sa fiche get_session self rejoint la liste) ; sessions et fichiers relus toutes les 3 s, 100 sessions ; roue ou main de la session selon ses tours ; refus de liste reessaye chaque minute, panne dite au panneau
- **0.29.0 (2026-10-26)** : lot : nouvelle skill, doctrine de la session Lot qui orchestre ses sous-sessions (lecture, ordre des fusions, main sur le simulateur iOS) ; le panneau reconnait un Lot a son titre ou a ses deux sessions lancees encore ouvertes ; le ▶ lance depuis un Lot donne sa clause ; gabarit projet-init
- **0.28.1 (2026-10-26)** : roadmap : reglage Questions - quand Bertrand pose une question ou dit qu il ne comprend pas, explication en texte dans le message, tour arrete sans formulaire, question reposee seulement apres sa reponse ; le mode ADHD laisse sa place a une explication demandee (boucle de la session 301)
- **0.28.0 (2026-10-26)** : roadmap : bouton Annuler la tache au detail d une tache ouverte - confirmation, raison facultative, ligne cochee (abandonne) en tete de ROADMAP-fait.md avec son bilan, par cowork.py dans un dossier Cowork, sinon ecrite puis committee et poussee sur main ; le detail la montre annulee
- **0.27.0 (2026-10-25)** : roadmap : plus de renommage de session en cours de route ; une session Lot n est jamais en cours sur une tache ; bouton ▶ devant chaque tache ouverte qui lance sa session sans ouvrir le detail ; Lancer et Verifier au premier clic, avec un Message additionnel facultatif
- **0.26.0 (2026-10-25)** : roadmap : boite Conclusion en tete du detail d une tache faite (ce qui a ete fait, le souci ou Tout a roule, emoji du ressenti ; Tout voir deplie cause, corrections, note) ; journal ROADMAP-bilans.csv par defaut pour toute roadmap, reclame avant l archivage, rappele par le brief
- **0.25.0 (2026-10-24)** : roadmap : bouton Verifier au detail d une tache ouverte - meme confirmation et meme carte que Lancer, session #id · Verifier · titre qui dit si la tache est encore a jour (deja faite, a moitie, perimee, a faire) sans coder ; le panneau la rattache a sa tache, une session de realisation l emporte
- **0.24.1 (2026-10-24)** : reglages-session : le mode ADHD ouvre chaque message par une seule ligne en gras, emoji + etape en cours/total + nom (🔄 2/3 Cle, detour ⚠️ ... ↳ raison, fin ✅ 3/3 Fait), rien pour une reponse courte hors tache ; plus de fil complet ni de Ou on en est
- **0.24.0 (2026-10-24)** : roadmap : panneau - toutes les vues se rangent par jour ou par sujet, au choix d un bouton Par jour / Par sujet garde d une vue a l autre ; par jour, une ouverte va au jour de son ouvert: (En retard en tete), une faite au jour de son fait: ; sans choix, ouvertes par sujet, faites par jour
- **0.23.0 (2026-10-24)** : roadmap : methode SwiftUI - le brief de lancement envoie un ecran ou une vue SwiftUI vers swiftui-pro avant de dire fini ; fin de tour : un commit qui touche un fichier .swift hors tests sans swiftui-pro dans la session ajoute la ligne au rappel de methode, une fois par commit
- **0.22.0 (2026-10-24)** : reglages-session : le mode ADHD ouvre chaque message par un fil des etapes (faites cochees, en cours en gras, noms figes, detour en fleche, Tout fait a la fin), et un rappel d une ligne l accompagne a chaque message de Bertrand (hook UserPromptSubmit)
- **0.21.0 (2026-10-23)** : reglages-session : reglages de session injectes au demarrage de chaque session (questions par AskUserQuestion, mode ADHD, francais), lus dans ~/.claude/reglages-session.json, par projet possible ; nouvelle skill reglages-session pour les lire et les changer
- **0.20.0 (2026-10-23)** : roadmap : une session lancee du panneau part en effort high par defaut (reglage launchEffort, borne par l app a l effort de la session qui lance) ; carte refusee avec son effort, reposee sans lui
- **0.19.0 (2026-10-23)** : roadmap : clic #N sans lecture d etat avant l outil ; sessions lues par la liste puis fiches absentes en parallele (11 fiches en serie -> 0 a 4 ensemble) ; relecture toutes les 3 s pendant 30 s apres un clic, 60 s apres un lancement ; releves perf open et refresh
- **0.18.1 (2026-10-23)** : roadmap : le rappel d archivage exige le bouton archive (actions archive), la question seule ne suffit pas
- **0.18.0 (2026-10-23)** : roadmap : methode superpowers - le brief de lancement dit quelle skill appelle quelle situation (plan, test rouge, debogage, verification, brainstorming si Bertrand repond) ; fin de tour : rappel d un commit de code sans test ou d une session sans skill de methode, une fois par commit
- **0.17.0 (2026-10-23)** : roadmap : un clic, un dessin - l'etat d'un clic s'ecrit en une fois (avant 4-5 ecritures et 2 a 4 dessins par clic, le premier a moitie a jour) ; releves perf de chaque session gardes
- **0.16.0 (2026-10-23)** : roadmap : clics rapides - donnees gardees en memoire (aucune lecture au clic), budget de 40 lignes par dessin (Voir les N autres), moins de Svg (plus de coins de survol, cale fusionnee), dessins memoises, releves perf dans le store
- **0.15.0 (2026-10-23)** : roadmap : cadenas gris pour une tache qui attend sa prerequise, main orange quand sa session a fini son tour et attend Bertrand ; En cours compte aussi les taches bloquees
- **0.14.2 (2026-10-23)** : roadmap : le numero d une tache passe avant ses pastilles, les numeros restent alignes
- **0.14.1 (2026-10-23)** : roadmap : une main levee remplace le cadenas d une tache bloquee ; le numero cliquable garde la taille et la place des autres (texte et zone de clic au lieu d un bouton)
- **0.14.0 (2026-10-23)** : roadmap : relance automatique des zones de clic quand leur cadre ne charge pas (signal pret par module, cles en -gN, 15 s sans pret, 3 relances au plus)
- **0.13.3 (2026-10-23)** : roadmap : un axe dont toutes les taches sont faites quitte la legende et la barre (il compte dans Faites) ; un filtre reste sur un tel axe revient a tous
- **0.13.2 (2026-10-23)** : roadmap : pastilles d attente courtes (nom sans la precision entre parentheses, id:N en #N, 16 caracteres au plus), precision entiere au detail ; A moi reconnait le nom avant la precision
- **0.13.1 (2026-10-23)** : roadmap : le suivi des sessions est range par roadmap ; la #N d un autre projet ne fait plus tourner la #N d ici, ni n ouvre sa session
- **0.13.0 (2026-10-23)** : roadmap : tache de la session cochee, la fin de tour propose d archiver la session (boite de fin, bouton archive), apres le bilan, une fois par tache
- **0.12.2 (2026-10-23)** : roadmap : le point colle au numero, colonne des numeros calee a droite, titres toujours alignes
- **0.12.1 (2026-10-23)** : roadmap : le numero cliquable d une tache en session n est plus tronque
- **0.12.0 (2026-10-23)** : roadmap : une session, une tache : une session sans numero qui ouvre sa premiere tache prend son nom #M · titre court ; une session #N · qui ouvre une autre tache ne la met pas en cours et Claude recoit le rappel de la proposer dans une session a part (sauf correctif du lot #N)
- **0.11.0 (2026-10-23)** : projet-init : nouvelle skill qui pose dans un depot de code la structure de Splitmybill (CLAUDE.md, ROADMAP numerotee, docs, check.mjs, hook de demarrage, worktree par session) ou remet un projet au format ; deja partie avec 0.10.1, annoncee ici ; roadmap-panel y renvoie
- **0.10.1 (2026-10-23)** : roadmap : une session lancee s appelle #N · titre court (les anciens titres Roadmap #N · restent reconnus)
- **0.10.0 (2026-10-23)** : roadmap : detail d une tache en session en carte bleue (Session en cours, duree, Ouvrir la session), fiche en icone devant le titre, Ouverte le JJ/MM en bas ; le numero d une tache en session ouvre la session
- **0.9.4 (2026-10-23)** : roadmap : au detail, En cours et sa duree ne sont plus decales a droite dans leur fond bleu
- **0.9.3 (2026-10-23)** : roadmap : au detail, Fiche et Source a cote du sujet, Voir dans la roadmap a la hauteur du retour, Ouvrir la session seule sur sa ligne, une croix pour retirer une session deduite (jamais une session lancee du panneau)
- **0.9.2 (2026-10-23)** : roadmap : au detail, etat reduit a En cours et sa duree, sans retour a la ligne ; Detacher sur la meme ligne
- **0.9.1 (2026-10-23)** : roadmap : au detail, l etat en session porte le fond bleu et la duree (plus d encart en double), et Detacher de la tache remplace Pas en cours
- **0.9.0 (2026-10-23)** : roadmap : en cours ne se deduit plus que d une seule tache ajoutee par une session (des notes ou une ligne reecrite ne comptent pas), bouton Pas en cours, le panneau s ouvre sur les taches en cours (toutes s il n y en a aucune)
- **0.8.0 (2026-10-23)** : roadmap : recherche par mots ou numero ; toutes les faites, par jour ou par sujet ; icones de session des faites cliquables et seulement quand la session est surement ouverte
- **0.7.0 (2026-10-22)** : roadmap : bilan de cloture : rappel des qu une task se coche sans lui, fin de tour bloquee tant qu il manque, bilan affiche au detail (ressenti, cause, corrections, note)
- **0.6.0 (2026-10-22)** : roadmap : Lancer pose directement la carte de session (l app ne lance jamais sur un clic de plugin), consigne facultative ajoutee au brief, faites d un jour rangees par heure de cloture, colonne des numeros alignee
- **0.5.1 (2026-10-22)** : roadmap : Confirmer le lancement en bouton de l app (le second clic se perdait), roue et Lancement... grises pendant les appels, raison des refus de l app quand la demande passe a Claude
- **0.5.0 (2026-10-22)** : roadmap : une tache faite dont la session reste ouverte se rouvre ou s archive depuis sa ligne et son detail ; numero #N plus petit et discret, suivi d un point
- **0.4.3 (2026-10-22)** : roadmap : le numero de la tache (#N) devant son titre, dans la liste et les liens Apres et Debloque
- **0.4.2 (2026-10-22)** : roadmap : plus de roue en tete de section, seules les taches en session en portent une
- **0.4.1 (2026-10-22)** : roadmap : roues calees sur l horloge, bouton Lancer grise une fois le lancement demande (Relancer pour le rendre), zone de clic sur tout le bouton, proposition de session sans tour de Claude
- **0.4.0 (2026-10-22)** : roadmap : chaque tache a un numero id: ; le panneau suit taches et sessions par ce numero (titre Roadmap #N), apres:N, #N au detail, controle id manquant ou en double
- **0.3.9 (2026-10-22)** : roadmap : confirmation du lancement remise ; le premier clic d un bouton n est plus perdu ; une session Roadmap · titre se reconnait dans tous les panneaux
- **0.3.8 (2026-10-22)** : roadmap : Lancer demarre la session au premier clic, sans etape de confirmation
- **0.3.7 (2026-10-22)** : roadmap : noms d axes en capitales (MCP, Produit, Revlon, Dossier) et etats sans part, seulement leur nombre
- **0.3.6 (2026-10-22)** : roadmap : dans la legende, la part vient d abord, puis le nombre de taches en petite pastille comme le compte des sections
- **0.3.5 (2026-10-22)** : roadmap : nouvel etat En cours dans la legende, roue fixe, qui compte et filtre les taches en session
- **0.3.4 (2026-10-22)** : roadmap : un lancement refuse par le mode auto est reessaye une fois, puis la demande passe a Claude dans la conversation, qui lance la session
- **0.3.3 (2026-10-22)** : roadmap : une session ouverte dans le projet dont le titre designe une seule tache la met en session, meme lancee ailleurs ou avec une ancienne version du plugin
- **0.3.2 (2026-10-22)** : roadmap : quand l app refuse un lancement direct depuis le panneau, la session est proposee par une carte New task au lieu d echouer
- **0.3.1 (2026-10-22)** : roadmap : une session qui ouvre ou reecrit la ligne d une tache la met en session dans tous les panneaux ; le detail montre l etat (en session, bloquee, a faire) au lieu de la section En cours
- **0.3.0 (2026-10-22)** : roadmap : refonte du panneau sur le handoff de design (themes sombre et clair, pastilles, barre cliquable, etats Recentes, sessions en cours, taches enchainees par apres:, detail retravaille), plus recentes en haut
- **0.2.0 (2026-10-21)** : roadmap : capture des tasks, la grammaire est controlee a chaque ecriture de la roadmap et un rappel bloque la fin du tour quand le projet a change sans que la roadmap bouge ; reglage capture
- **0.1.0 (2026-10-21)** : roadmap : nouveau plugin, le panneau Claude Code de la roadmap du projet de la session, et la skill roadmap-panel qui y branche un projet

