# Plugin roadmap

Panneau Claude Code à côté du chat : la roadmap du projet de la session, filtrable, avec le détail d'une tâche et son lancement dans une nouvelle session

C'est un mod Claude Code (module de hooks, `hooks/register.tsx`), avec huit skills, `roadmap-panel` pour y brancher un projet, `mockups` pour dessiner les maquettes à partir du design system du projet, `tasks` pour tenir sa roadmap au quotidien, `audit` pour en auditer le contenu, `onboarding` pour poser dans un dépôt de code sa structure et sa roadmap, `doctor` pour vérifier qu'un projet est branché, `reglages-session` pour les réglages de session et `maestro` pour tenir une session Maestro : il
dessine un panneau dans l'onglet Code de l'app de bureau (et dans le terminal). Il ne sert à rien
dans Cowork ni dans le chat de claude.ai.

Ce que fait le plugin sur ta machine (hooks, programmes lancés, fichiers écrits, ce qui sort de la
machine), vérifié à chaque version : [SECURITE.md](SECURITE.md).

## Contenu

**Une commande, `/roadmap`** (#378) : seule, elle ouvre le panneau ; son argument, en anglais, mène au reste.

| Commande | Ouvre | Ancien nom, encore accepté |
|---|---|---|
| `/roadmap` | le panneau de la roadmap du projet | |
| `/roadmap settings` | le volet Réglages, dans tout projet | `/reglages` |
| `/roadmap control` | le centre de contrôle des sessions de tâche du Mac | `/controle` |
| `/roadmap bar` | la bande de Maestro au-dessus de la saisie, ou pourquoi elle ne paraît pas | `/maestro-bar` |
| `/roadmap help` | la liste des sous-commandes | |

L'argument se lit sans casse, et le mot français passe aussi (`/roadmap reglages`) ; un mot inconnu répond
par la liste. Les anciens noms restent dans le menu « / », leur description dit « Ancien nom de /roadmap … ».

**9 skills**

| Skill | Rôle |
|---|---|
| `roadmap-panel` | Branche un projet sur le panneau (`.claude/roadmap.json`, `ROADMAP.md` à la racine) et le dépanne. Tapée seule, `/roadmap:roadmap-panel` ouvre le panneau comme `/roadmap`, d'une ligne. |
| `onboarding` | Un projet de code (le dossier le dit, #176) : pose dans un dépôt de code la structure de Splitmybill (CLAUDE.md, roadmap numérotée dans `roadmap/` avec ses bilans, docs, `check.mjs`, hook de démarrage, worktree par session), propose de reconstituer la roadmap depuis l'historique du dépôt (PR, fusions ou commits des 6 derniers mois), ou remet un projet existant au format sans rien écraser. Sans code : un dossier simple, git en option, des tâches complètes. |
| `doctor` | Checklist en lecture seule d'un projet (d'abord la ligne « Travail », ce que le dossier est ; sans code : python3, roadmap, réglages, champs exigés, sans GitHub, Superpowers facultatif) ; d'un projet de code : outils, GitHub, roadmap, structure, `check.mjs`, plugin roadmap, Superpowers et chacune de ses skills de méthode, sa mise à jour automatique, `swiftui-pro` sur un projet iOS ; une ligne OK, KO ou À voir avec la commande qui corrige. |
| `audit` | Le seul audit de la roadmap (#159) : la structure (paquets découpés en parent et enfants datés, dépendances, fusions de doublons, regroupements, trous), puis une question par tâche en retard ou sans date et par `prio:` posée sur un enfant, la recommandation en premier (redater, faite, en pause, abandonner), et les clôtures sur preuve là où le projet le dit (`preuves`). `scripts/audit.py` (`survey`, `apply`, `pending`) écrit la structure tout ou rien, sauvegardée, avec un bilan qui retrouve chaque fragment ; les réponses s'écrivent par la skill `tasks`, qui suit `ecriture`. En tâche planifiée, seule une clôture sur preuve nette s'écrit : le reste attend dans `ROADMAP-questions.json`, compté par priorité. Lancée en fin d'onboarding. |
| `tasks` | Tient la roadmap au quotidien, avec ou sans code (#158) : rapproche chaque action des tâches du même sujet (jamais de tâche neuve sur un sujet qui en a une), puis ajoute, complète, redate, coche sur preuve (`fait:` à la date de la preuve, ligne de bilan), abandonne ou met en pause (#159), par `scripts/tasks.py` (`context`, `match`, `write`) : essai à blanc, puis écriture tout ou rien après sauvegarde, sur le moteur de l'audit. Lit `regles`, `ecriture` et `preuves` de `.claude/roadmap.json` ; avec `ecriture`, passe les lignes à l'outil du projet au lieu d'écrire. |
| `reglages-session` | Lit et change les réglages de session (questions par formulaire, mode ADHD, français, mode autonome) de `~/.claude/reglages-session.json`, pour le projet de la session (#102). Lancée, elle ouvre aussi le volet Réglages ; tapée seule, `/roadmap:reglages-session` l'ouvre comme `/roadmap settings`, d'une ligne. |
| `mockups` | Dessine les maquettes d'un choix visuel à partir du design system que déclare le projet (`design` de `.claude/roadmap.json`) : inventaire de ses tokens, composants et motifs, deux ou trois partis qui réutilisent un motif avant d'en créer un, les ajouts nommés comme des propositions au design system, puis la critique (hiérarchie, cohérence, accessibilité) et la relecture par `web-design-guidelines`. Le réglage des maquettes la fait lancer quand le projet a un design system, `frontend-design` quand il n'en a pas (#294). |
| `maestro` | Tient une session Maestro (`/maestro`), la session mère qui lance et suit des tâches menées en parallèle, même une seule : lignes et découpage, une session par tâche, lecture de leurs comptes rendus, main donnée sur le simulateur iOS et les autres ressources uniques, ordre des fusions calculé depuis git (`scripts/etat_maestro.py`), chaque tâche suivie dans la liste d'étapes de Maestro (une étape par tâche, son état en mots), une fusion à la fois. |
| `impact` | La carte de ce que touche une modification (#305), avant de coder et sur le diff avant de dire fini : pour chaque fichier changé, ce qui le cite par son nom ou l'importe ; pour chaque symbole changé (fonction, type, constante, clé, cas d'enum Swift), ce qui le nomme ; les tests d'abord, rangés par le nombre de changements qui les touchent. `scripts/impact.py`, lecture seule, sans dépendance ni réseau. Le brief d'une session de code la demande. |

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
  À l'ouverture, le panneau de Maestro montre toutes ses tâches (#188) ;
- les filtres en une rangée de pastilles (#115, #149) : une icône de trait dans leur couleur, le
  nom, le nombre ; la choisie prend sa teinte et un second clic la retire. Ma journée, En cours (sauf chez Maestro), En retard, Cette semaine, À relancer, Retours (`feedback:`), dans tout projet, chacune cachée à 0 (#176) ;
- « Plus › », au bout de la rangée : les autres états non vides (À moi ; Attend un tiers ; et le menu « Qui » dès qu'une autre personne est nommée, #176) ; il reste ouvert tant qu'un de ses filtres est choisi ;
- une recherche par mots ou par numéro (#47), dans les ouvertes et les faites, qui filtre à la frappe,
  et à côté le menu « Ranger » qui montre le rangement en cours ;
- par défaut, l'arbre par axe (#168), dans tout projet : une section par axe, dans
  l'ordre de la légende, la flèche dans le carré de l'axe ; dedans, ce qui est en session d'abord,
  puis ce qui attend quelqu'un, puis la plus récente ; une mère au niveau des tâches seules, sa
  flèche dans son carré, ses filles un cran à droite, reliées par des coudes ; plus de rond
  (#198) : le carré d'axe de la tâche la choisit (#316), mère comprise avec ses étapes ; la barre
  de sélection, à la place de la ligne de la liste, coche les choisies (« Faites ») ou les édite
  (Date ▾ : raccourcis, mois et « Répéter » ; Statut ▾) ; toutes les lignes s'alignent en colonnes : carré, numéro, tags, échéance,
  titre, département, âge, ▶ (une colonne vide pour toute la liste laisse sa place à la suivante) ;
- les tâches par sujet (au menu « Ranger ») en sections repliables, une ligne par tâche (pastilles échéance, tiers,
  « à revoir », âge), triées : en session, puis par échéance, puis de la plus récente à la plus
  ancienne ; une tâche se range sous sa prérequise ; au bout de chaque tâche ouverte (ni en session,
  ni bloquée, ni déjà demandée), un ▶ lance sa session sans ouvrir la fiche (#149 : à la place du
  chevron ›) : même brief et même carte que « Lancer » (un bouton de l'app, sans zone de clic : il
  tient sur toutes les lignes) ; chez Maestro, une tâche en session n'y porte que la pastille
  « en session », sa barre et son étape sont dans l'arbre ;
- toutes les faites, rangées par jour de clôture ou par sujet ;
- dans toutes les vues, le menu « Ranger » (Par sujet, le défaut ; Par jour et Par échéance quand une ouverte a `due:`, Par responsable quand une a `resp:`, #176 ; Par numéro, la vue « Récentes », partout, #192 ; un bouton sur mobile) : un seul choix pour toutes les vues ; les ouvertes sont toujours en arbre, que le rangement trie sans le couper, et par jour chaque arbre se range à sa prochaine échéance, l'étape du jour sous sa mère repliée (#189) ;
  par jour, une ouverte se range au jour de son `ouvert:` (« En retard » reste en tête), une faite
  au jour de son `fait:` ; sans choix, les ouvertes vont en arbre par sujet, dans tout projet
  (#168, #238 : plus de `vue` déclarée) et les faites par jour ;
- la modification d'une tâche ouverte depuis sa fiche (#161, en place depuis #342) : le petit crayon
  à droite du titre devient « Terminé » ; la fiche garde sa mise en page et chaque valeur (nom,
  mission (au carton « À lancer » seulement), Après, Parent, Axe, Responsable (`resp:`, la personne, #176), les clés que le
  projet déclare dans `cles`, Échéance en `AAAA-MM-JJ`) s'ouvre d'un clic, un champ à la fois, préremplie
  de la ligne (un menu sur bureau quand le projet liste les valeurs admises) ; Entrée enregistre ce
  champ seul, réécrit la seule ligne, les autres champs et la note gardés à leur place, contrôlée par
  les règles du projet, et la valeur montre « ✓ enregistré » ; un refus s'écrit en rouge sous le champ,
  rien n'est écrit, la saisie reste. Pas de bouton Enregistrer ni Annuler, et la bande d'état ne
  s'édite pas. L'écriture suit celle
  de « Marquer faite » : `cowork.py roadmap update` dans un dossier Cowork (sauf celui dont `cowork.json`
  confie la roadmap au plugin, `"roadmap": "plugin-roadmap"`, #262), sinon, avec `ecriture`,
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
  Cowork (Python isolé, `-I`), sauf quand son `cowork.json` confie la roadmap au plugin
  (`"roadmap": "plugin-roadmap"`, #262) ; ailleurs le panneau écrit les deux fichiers et le journal, et dans
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
la session (`main` sans elle) ; les notes de plus d'une semaine sortent du store (#90, #518). Il relance une fois un enfant silencieux
(pas encore s'il a répondu sans changer d'étape), et dit les finis en une ligne, que Bertrand archive
par leur icône dans la bande, sans question dans la boîte de fin, qui cacherait la bande (#267). Toute session reçoit aussi la consigne de tenir sa liste d'étapes, et un
rappel en fin de tour quand elle travaille sans (#98, #104) ; le parent tient la sienne, une étape
par session lancée, son état en mots (#104). Il n'y a plus de carte HTML de Maestro. La liste d'étapes
native est le seul affichage des étapes : la bande que le plugin dessinait au-dessus de la saisie
(#104, #107) la doublait et est retirée (#109). La consigne la veut lisible : trois à sept étapes,
un verbe et son objet chacune, jamais recopiée dans le message, à jour à chaque changement.
Chez Maestro, la bande au-dessus de la saisie porte l'arbre des sessions du projet (#147 ; depuis
#385, tous Maestro du même dossier confondus, comme la ligne « En cours » de #381 : elle paraît dès
qu'une session tourne, même chez un Maestro qui n'a rien lancé) : une ligne par tâche, comme celles de la
ligne « En cours » du panneau (#385, retour de test) : la case de son axe, cochée quand la tâche est close,
le numéro, le nom qui ouvre la session, puis au bord droit l'icône de son état (roue, main, branche ou
coche, sans mot), sa jauge, « 6/7 · étape en cours », et tout au bout « ◷ 42 min », depuis quand sa
session tourne, sous « Contexte 40 % ». Elle
reste visible quand le fil défile, cède à un sondage, et s'efface tant que la boîte de fin pose une
question ; la liste native reste dans le fil. Une session close et à l'arrêt, encore ouverte, porte
l'icône d'archivage entre sa case et son numéro : un clic l'archive (#174, #385) ; la ligne « En cours »
dépliée du panneau la porte au même endroit. L'en-tête dit « Contexte 40 % » pour
Maestro seul, sans tokens ni jauge (#174) ; sous la jauge d'étapes de chaque ligne, une jauge fine dit le
contexte de sa session, noté à la fin de chacun de ses tours, orange à 70 %, rouge à 85 % (#157, revenue par #217). La jauge, l'info (compte et
étape) et la durée se serrent au bord droit, chacun à la largeur de son plus long texte, alignés d'une
ligne à l'autre (#174, #211, #385). Dans la ligne « En cours » dépliée du panneau, chaque session dit
de même depuis quand elle tourne, l'horloge devant, à la place du compte « 6/8 », la main, la barre et
la durée au bord droit de la carte, sans « Done » ni ▶ (#385).
`/roadmap bar` (ancien nom `/maestro-bar`, #378) force la bande (#225, demande de Bertrand du 02/11/2026) : la commande relit la fiche
de la session, pose la marque Maestro (comme dire « Maestro »), relit les sessions, redessine la bande
et dit en une ligne ce qu'elle montre, ou pourquoi rien : session de tâche ou lancée par un Maestro
(son Maestro porte la bande), aucune session en cours dans le projet (#385), roadmap absente ou illisible, question de la
boîte de fin à l'écran, app qui n'a jamais demandé la bande. Une session renommée « Maestro … » ou
qui vient de dire « Maestro » voit aussi sa bande paraître seule, sans attendre qu'une session bouge.
Une session qui dit « Maestro » prend le seul nom court de son projet (`name` de son
`.claude/roadmap.json` : « AAFES », pas « AAFES Cowork »), que l'app l'ait titrée « Maestro » d'après ce
premier message ou qu'elle porte un titre laissé à la main (#597, suite de #439), une fois : renommée
ensuite, elle garde son nom ; un titre de tâche ne change pas. Elle reste reconnue par sa marque.

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
la fusion et la publication attendent le clic de Bertrand (tableau « Autonome éteint », #304).

**Le gardien** (#528) : en projet de code, Maestro pose avec sa première carte de tâche la carte de
son gardien, une session permanente « Gardien · <projet> » (modèle qui code, dossier principal, sans
worktree) ; Bertrand clique Start une fois. Gardien ouvert, lui seul relit, fusionne une branche à la
fois, publie et clôt les lignes ; Maestro garde la conversation, les lignes et les lancements, et
reçoit une ligne par livraison (« #N livrée X.Y.Z : ce qui change »). Les « prête à fusionner » des
sessions et le réveil cloud (#496) vont au gardien ; sans gardien ouvert, ou muet depuis 3 minutes
pour le réveil cloud, ils reviennent à Maestro, qui livre comme avant. En projet sans code, le gardien
se lance à la demande et tient le suivi (relances, échéances, preuve avant clôture, point du jour).

**Le récap au fil des fusions** (#136) : après chaque `git merge` réussi dans le dossier principal
et chaque `release.py release`, le panneau rappelle dans le résultat de la commande de renvoyer la
liste d'étapes entière avant la suivante ; chez Maestro, l'étape de la tâche dit `· livrée <version>`,
et un tour lancé par Bertrand met aussi une ligne par tâche livrée dans son journal
(`- #N livrée <version> : ce qui change`, #275), un tour réveillé par une session rien de plus (#133). Liste toujours pas renvoyée à la fin du tour : le rappel
revient une fois. Plusieurs branches prêtes se fusionnent à la suite, une à la fois, avec une
publication par fusion. Maestro finit sur la fiche de fin de #123 suivie du tableau de ses tâches
(`| Tâche | Livré | Version | État |`, maquette B), que le contrôle de fin de tour réclame.

Une session lancée (par le panneau ou par Maestro) reçoit le **cap** dans son brief : finir la
task dans la session ; décider seule ce que les fichiers, le code ou un défaut raisonnable
tranchent ; ne poser à Bertrand que ce qui est à lui, en une fois ; écrire un blocage sur la ligne
(`attend:`, `après:`) au lieu de l'attendre.

## Expliquer une tâche : « why N » (#529)

« why 527 », « why #527 » ou « pourquoi 527 », seul dans le message, dans Maestro comme dans toute session d'un
projet à roadmap : Claude répond par une fiche courte, toujours la même, en mots de tous les jours, pour une tâche
ouverte comme pour une tâche close.

```
### #527 · un_test rouge si ça ne compile pas

**Un test cassé ne passera plus pour réussi.**

| | |
|---|---|
| Le problème | Un fichier de test qui ne compile pas ne lance aucun test, et le script dit « vert ». |
| En image | Un correcteur qui met 20/20 à une copie blanche. |
| La tâche | Compter rouge un rapport en erreur ou vide, et nommer le fichier fautif. |
| Pour toi | Plus de fichier cassé découvert après la fusion. |

`À lancer` · cloud · petite · ne bloque rien
```

Le plugin joint au message, sans le montrer, la ligne de la tâche, sa fiche, sa mère, ses sœurs, ce qu'elle attend,
ce qu'elle débloque et son état (à lancer, en session et où, fusionnée, livrée et en quelle version) ; Claude écrit
la fiche d'après eux. Un numéro que la roadmap n'a pas se dit en une ligne. Le mot dans une phrase (« why not »,
« pourquoi 3 sessions ? ») ne déclenche rien.

## Quelles sessions archiver : « quoi archiver » (#560)

« quoi archiver » (ou « quoi archiver ? »), seul dans le message, dans Maestro comme dans toute session d'un projet à
roadmap : Claude répond par un tableau toujours le même (gabarit A, choisi par Bertrand le 2026-11-12), une ligne par
session ouverte du projet, quel que soit le Maestro qui l'a lancée, plus les sessions cloud.

```
### Quoi archiver · 3 sessions

**1 à archiver, 1 bientôt, 1 reste.**

| Session | Verdict | Pourquoi | Geste |
|---|---|---|---|
| #548 Règle publication · Mac | `oui` | close le 12/11, publiée en 0.291.0 | bouton Archiver de la bande |
| #510 Un seul tronc · Mac | `pas encore` | PR 122 fusionnée, pas encore publiée | attendre la publication |
| #558 Clôture gardée · cloud | `non` | PR 150 ouverte | — |
```

Le verdict ne vient pas du mot « livrée » mais des faits que relève le plugin : la ligne close dans les faites, la
PR de sa branche (fusionnée, encore ouverte), la version publiée (`livré:`, ou « sans version »), les findings pas
encore au registre (ceux qu'une session du Mac a écrits ; pour une session cloud, la trace du relevé de sa PR, #558), ce
que la ligne attend (`attend:`), et si la session tourne encore. Une session de rôle (Maestro, son gardien) dit
`non`. Une session cloud n'est pas dans la liste de l'app : elle vient des lignes `lieu:cloud`, ouvertes avec leur
branche ou closes depuis moins de 48 h, et son geste se fait sur claude.ai/code. Dans un projet sans code, la ligne
close et rien en attente suffisent. Une phrase qui parle d'archiver (« quoi archiver demain ? ») ne déclenche rien.

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
`"travail"` de `.claude/roadmap.json` (`code`, `projet` ou `hybride`, #508) déclare cette nature : l'onboarding
l'écrit, le doctor dit KO sans lui, et la détection du dossier ne fait plus que la proposer. Un hybride dit la
nature de chaque ligne par la clé déclarée `travail:` (`projet` part sans branche ni worktree, en mission en
cloud). `mode`, `cloud: "missions"` et `sessions: "cloud"` sont d'anciennes formes (les deux premières encore lues
quand `travail` manque, la troisième sans effet) ; le cloud est ouvert à tout projet, sans réglage. `qui:` désigne la session qui tient une tâche, `resp:` la personne qui la porte, dans
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
  dans `cles` est ignorée, et le doctor le dit. Le contrôle de chaque écriture relit `cles` dans
  `.claude/roadmap.json` au moment où il contrôle (#591) : une clé déclarée pendant un tour vaut dès
  l'écriture suivante, dans cette session comme dans celles ouvertes avant.
- **La clé `routine:`** (#591) : déclarée dans `cles` (`"routine": []`), elle relie une récurrente à la
  routine cloud qui l'exécute seule (sa valeur, le nom de la routine). Au démarrage, une fois par jour
  (comme les étapes de journée, #277), une telle ligne dont le `due:` est passé avance au premier
  `due + période × k` qui n'est pas avant aujourd'hui, quel que soit son rythme `tous:` et avec ou sans
  parent : ni occurrence close, ni retard. Restent à leur date une ligne à `cycle:` et une étape sous
  une coquille `a_preuve`. Sans `routine:`, seules les étapes `tous:semaine` et `tous:2semaines` sous
  un parent avancent ainsi ; une quotidienne ou une mensuelle reste en retard.
- **Les règles du projet** (#158), dans tout projet. Tout projet a son fichier de règles,
  `ROADMAP-REGLES.md`, à côté de `ROADMAP.md` (#167) : ce qui devient une tâche, ce qui n'en
  devient jamais une, les règles du projet et ses preuves. L'onboarding le pose depuis un modèle
  (`onboarding.py regles <dossier>` pour un projet déjà onboardé), le doctor est KO s'il manque, il
  dit si sa section « Règles de l'outil » est à jour avec le modèle du mode (#290 ; sinon « À voir »,
  et `onboarding.py regles --outil <dossier>` remplace cette seule section), et
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
  et l'édition d'un champ gardent leur confirmation, puis envoient la demande dans la session
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
- **Récurrence et relance** (#99) : `tous:jour|ouvré|semaine|2semaines|mois|trimestre|an` (#280 :
  `jour` chaque jour, `ouvré` du lundi au vendredi), avec `due:` à la prochaine occurrence (pastille
  rose « mensuel », ses flèches en boucle devant) ; « Marquer faite » envoie l'occurrence dans
  ROADMAP-fait sous un numéro neuf (`src:#N`) et avance `due:` d'une période, « Annuler la tâche »
  arrête la récurrence ; `cowork.py` ne la reconduit pas encore, et le panneau le dit.
  `relance:AAAA-MM-JJ` date la dernière relance du tiers attendu ; le brief demande de la poser.
- **Routine d'un clic** (#280) : une récurrente qui porte `skill:<nom>` (ou `plugin:nom`) ou
  `fiche:<chemin>` est une routine. Due, son ▶ est bleu : un clic coche l'occurrence (comme « Marquer
  faite »), passe la ligne à sa prochaine date (une quotidienne en retard : une seule occurrence, puis
  le jour après aujourd'hui) et pose la carte d'une session « #N · Routine du AAAA-MM-JJ · … », dont
  le brief lance d'abord la skill, puis suit la fiche, sans bilan ni archivage. Pas due, le ▶ pose la
  carte seule. Avec `ecriture`, le panneau n'écrit rien : la coche ouvre le brief.
- **La fin d'un parent** (#125) : « Marquer faite » sur son dernier enfant ouvert ferme aussi le
  parent, dans la même écriture, avec son bilan (« parent #375 fait aussi ») ; un parent `tous:`
  est reconduit à la place, depuis son `due:` écrit (« parent #411 reconduit au 10/11 »). Une
  annulation ou un enfant récurrent ne ferment rien d'autre ; par `cowork.py`, la note dit le parent
  à cocher.
- **La vue** : par sujet à l'ouverture, dans tout projet (#238 : `vue` de `.claude/roadmap.json`
  ne sert plus, le doctor dit de la retirer) ; le menu « Ranger » propose aussi l'échéance (en
  retard, cette semaine, plus tard, sans échéance), le responsable (si une tâche a `resp:`), le jour
  et le numéro ; un choix dans « Ranger » reste. Hors sujet, chaque section est un bandeau teinté à
  son icône (#238).
  L'arbre « Le fil » (#125, redessiné par #163, maquette A) : une tâche est seule, mère ou étape ; un
  bloc par mère, sa ligne en tête une seule fois, au poids d'une tâche seule (#447), avec sa case, son département, sa barre
  d'avancement (`1/3`) et la date de sa prochaine étape, sans ▶ ni « Lancer » : elle n'a rien à livrer seule (#447) ; ses étapes dessous, en retrait sur
  un fil fin qui porte leur rang (1, 2 : en séquence par `après:` ; 1, 1 : en parallèle), avec leur
  case, leur département, puis « Rodney · 29/10 » (responsable et date en texte, rouge en retard,
  orange dans les 7 jours) ou le cadenas « après #437 ». Lignes de 30 px, plus d'âge sur la ligne.
  **Choisir, puis cocher ou éditer** (#316, maquette C) : le carré d'axe d'une ligne la choisit,
  sans rien écrire (fond et filet bleus) ; une mère emmène ses étapes, une étape se choisit seule,
  à travers sujets et filtres. La barre de sélection compte les choisies : « ✓ Faites » les clôt
  comme « Marquer faite » (la dernière étape cochée coche sa mère ; une faite se rouvre par
  Statut ▾ « Ouverte », sa ligne revient dans ROADMAP.md, son bilan est retiré) ; Éditer ouvre
  Date ▾ (Aujourd'hui, Demain, Lundi prochain, le mois, « Répéter » : jamais, chaque jour, chaque
  semaine, chaque mois) et Statut ▾ ; chaque choix s'écrit aussitôt, tâche par tâche : une ligne
  prise par une session ne change que de date, une communication pas partie ne se coche pas, et
  le bilan sous la barre dit chaque refus. ✕ vide la sélection. La flèche d'une mère la replie ; sa
  fiche peut aussi la clore avec ses étapes ouvertes, où
  « Marquer faite » demande « Clore #12 « Mocap » et ses 3 étapes ouvertes ? » (Tout clore). La
  liste « N faites » porte le même carré, qui choisit de la même façon. Un projet qui déclare
  `ecriture` (#164) : la barre n'écrit pas, elle le demande à Claude (« Coche
  #N par la skill tasks », « Rouvre #N … »). Une mère cochée aujourd'hui garde son
  bloc jusqu'au lendemain. Un dossier Cowork ne
  rouvre pas : `cowork.py` ne le sait pas, le toast le dit. « Déplier les sous-tâches » /
  « Replier les sous-tâches », à droite au-dessus de la liste, à côté de l'action de la liste,
  déplie ou replie toutes les mères, dans toutes les vues (#203). En vue Done, une sous-tâche
  reste sous sa mère, par jour comme par sujet, et la mère s'ouvre repliée avec « 3/3 ». Une mère bloquée dit « après #12 » à la place de sa date ; les tâches seules
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
- **conclusion de fin de session** (règle du 28/10/2026, #85, refaite par #243, dans tout projet,
  roadmap ou non) : en mode ADHD, un tour de travail ordinaire n'est plus contrôlé. Une fin de
  session (la boîte de fin propose « Archiver cette session ? », ou la réponse porte une conclusion
  `### ✅ #N · … : c'est livré`) bloque l'arrêt une fois quand il manque la conclusion, le tableau
  des tâches de Maestro, le bouton « Oui, archiver » dans la boîte, ou, ligne close, « close » dans
  la conclusion ; une conclusion bloquée (`### ⛔ … : bloquée`) sans sa ligne `| Bloque |` aussi.
  Le rappel nomme ce qui manque et redonne le format ;
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

## Document à valider ouvert d'un clic (#587)

Règle fixe, jointe à chaque message d'un projet à roadmap avec « Proposer une task » : tout document qu'une
session demande à lire ou à valider (note, task file, email, plan, classeur, PDF, maquette, fichier MD) arrive
avec un lien Markdown, `[le nom du document](chemin)`, qui l'ouvre à côté du chat dans la session où la
personne lit. Le document vit dans le dossier du projet, jamais dans le scratchpad, `/tmp`,
`side-session-notes` ni « Claude outputs/ » ; sous Maestro, une sous-session le copie dans le dossier de
Maestro (`.claude/a-valider/<id>/`) et Maestro recopie le lien tel quel ; le volet ouvre le Markdown, le xlsx, le PDF et
le HTML, un docx se double d'une version lisible ; en cloud, le document se publie en Artifact privé (un lien GitHub d'un dépôt privé s'ouvre en 404 dans le navigateur de l'app). En fin de tour,
un message qui demande une validation (« valide », « relis », « je te laisse lire ») sans lien ouvrable reçoit
son rappel (`reviewLinkGap`). La matrice des essais : `docs/plans/feat-document-a-valider/matrice.md`.

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
- `adhd` (refait par #275, parti A choisi par Bertrand : le verdict, puis la preuve) : chaque
  message d'une tâche s'ouvre sur son verdict, une phrase en gras qui dit l'état et ce qui en sort
  (« **Tout concorde : …** », « **En cours, étape 4/6 : …** », « **J'ai besoin de toi : …** »,
  « **Prête à fusionner : tests verts, branche poussée.** »), puis la preuve : un fait sûr en une
  puce de mots, sans chiffre ni identifiant ; ce qui a été vérifié et chiffré en petit tableau
  (l'objet, l'attendu, le vu) ; et à part, en fin de message, chacun sa citation : `> **À toi :**`,
  `> **Une question :**`, `> **Hors de ma tâche :**`. Un lien par son nom, rien de répété d'un
  message à l'autre. Les lignes de la roadmap changée (`- Roadmap : #N …`) vont sous le verdict,
  dans le même message. La liste d'étapes native reste le seul repère d'avancement. À la fin de
  la session (ligne close, ou bloquée), une conclusion à part : `---`, `### ✅ #N · <la tâche> :
  c'est livré` (ou `### ⛔ … : bloquée`), une phrase, puis un tableau Livré, À essayer, En route
  (bloquée : Fait, Bloque, À toi). Maestro garde son verdict
  compté, écrit seulement quand il change, et finit sur sa conclusion et le tableau de ses tâches. Une ligne de rappel accompagne
  chaque message de Bertrand (hook `prompt.submit` depuis #116). Éteint, rien ne bride la longueur
  des réponses, celles de Maestro comprises (#128) ;
- `francais` : réponses en français ;
- le cadrage de départ (#303, dit à toute session, pas un réglage) : au début de chaque tâche, avant
  le premier geste qui code ou exécute, la session relit la ligne, sa fiche et son dossier ; rien
  d'ambigu, elle le dit en une ligne et part ; sinon un seul formulaire d'une à quatre questions
  (rendu et style, architecture, périmètre, ce qui est en place), puis l'accord en une ligne. Un
  brief de Maestro qui porte déjà le cadrage ne se recadre pas : la session ne demande que ce qui manque ;
- `autonome` (#77, #105, avec ou sans code, éteint par défaut) : après le cadrage de départ
  (#303, ci-dessous), Claude suit sa recommandation au lieu de poser la question, jusqu'à la
  fusion, sauf un fait nouveau qui change la direction, comme une question d'architecture que le
  cadrage n'a pas vue, c'est-à-dire un choix qui s'écrirait dans `docs/decisions.md`. Le réglage est l'autorisation durable de
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

### Autonome éteint : ce qui attend (#304)

Demande de Bertrand du 04/11/2026 (« si le mode auto n'est pas activé, sur la partie code, je pense
que ça bloque le merge ou peut-être d'autres étapes »). Relevé le 05/11 : éteint, le texte des
réglages ne disait rien de l'autonomie. Une session seule suivait la règle de son projet (« Finir un
chantier … sans attendre ») et pouvait fusionner et publier sans demander, alors que ce guide et le
volet disaient l'inverse ; seuls la confirmation des gestes hors du code et le menu de Maestro en
dépendaient. Depuis, réglage éteint, toute session reçoit le paragraphe « Autonome éteint » : ce qui
attend le oui de Bertrand, demandé une fois par geste quand il est prêt, par la question de la
boîte de fin et son bouton (« Fusionner #N », « Publier ») ; ce qui avance sans demander ; et qu'une
règle du projet qui dit « sans attendre » dit comment, pas quand. Sous Maestro, c'est lui qui demande.

Le tableau reprend mot pour mot la liste `AUTONOME_OFF_STEPS` de `hooks/parse.ts`, dont le
paragraphe est tiré ; `tools/test_reglages.py` refuse un écart entre les deux (une étape s'ajoute aux
deux). La colonne Éteint s'ouvre par « attend » ou « avance ».

| Étape | Éteint | Allumé |
|---|---|---|
| Fusionner sur main une branche prête | attend son oui, par le bouton de la boîte de fin | seul, puis dit en une ligne |
| Publier (release d'un plugin, déploiement, push d'un code sur main) | attend son oui, par le bouton de la boîte de fin | seul, puis dit en une ligne |
| Écrire hors du code (un service, un formulaire, une tâche planifiée) | attend son oui, une fois pour tout le geste ; lire et ouvrir la page avancent | sans confirmation, puis dit en une ligne |
| Trancher un choix qui lui revient, vu en cours de route | attend sa réponse, par le formulaire | sa recommandation suivie, sauf un choix d'architecture |
| Maestro : choisir les tâches à lancer | attend son choix, par le menu « Je lance lesquelles ? » | les cartes des trois premières, sans menu (mode Code ; en mode Projet, le menu reste) |
| Maestro : répondre à la question d'une session | attend sa réponse, dans la session | Maestro répond, sauf architecture ou geste qui lui revient (mode Code) |
| Maestro : donner la main sur une publication | attend son oui | Maestro la donne seul |
| Lire, chercher, ouvrir une page | avance | pareil |
| Coder, tester, committer et pousser sa branche | avance | pareil |
| Prendre sa ligne de roadmap (commit et push du seul fichier de la roadmap) | avance : c'est du suivi, pas une publication | pareil |
| Trancher ce que les fichiers, le code ou un défaut raisonnable tranchent | avance, dit en une ligne (cap du brief du ▶) | pareil |
| Maestro : donner la main sur le simulateur ou un appareil | avance : Maestro la donne seul, une session à la fois | pareil |
| Poser la carte d'une tâche proposée | avance : la carte est la question, Start reste à son clic | pareil |

Allumé ou non, attendent toujours Bertrand : le cadrage de départ, un choix sur maquettes, lancer une
session et archiver, un message en son nom ou un paiement. En mode Projet, rien ne fusionne : les
lignes de fusion ne s'y appliquent pas ; l'envoi à un tiers reste au oui de Bertrand dans les deux
réglages.

### Le volet Réglages

Demande de Bertrand du 28/10/2026 (#81) : voir chaque réglage et le changer d'un clic, sans
retenir de phrase. Refait le 29/10/2026 sur la maquette qu'il a choisie (#91, « juste On / Off »).
`/roadmap settings` (ancien nom `/reglages`, #378) ouvre le volet « Réglages » dans tout projet, roadmap ou non ; la roue en haut à droite
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
   réglages : `travail` (`code`, `projet` ou `hybride`, la nature déclarée, #508 ; les anciens `mode`, `sessions: "cloud"` et `cloud: "missions"` sont des anciennes formes), `requis`, `requis_sur`, `cles`, `impact`
   (#418, les tests que la carte d'impact cite pour un fichier qui ne les nomme pas, voir la skill `impact`), et `rangement`
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

Dans le volet `/roadmap settings` (voir plus haut) ou dans les réglages du plugin (menu de configuration de Claude Code) : `me` (tes noms : le premier est celui que Claude emploie avec toi, tous comptent « À moi » ;
vide par défaut, et alors ceux de `me` dans `~/.claude/roadmap-perso.json`, que pose l'onboarding ;
sans nom, Claude dit « l'utilisateur »), `autoOpen` (« Panneau toujours ouvert », défaut oui : le panneau
s'ouvre au démarrage, se rouvre au message suivant s'il n'est pas dessiné ou a disparu, et sa croix ne le
ferme pas, un toast renvoie à ce réglage ; éteint, seul `/roadmap` l'ouvre, et il se ferme, #117),
`titleModel` (modèle des titres courts, défaut sonnet), `capture` (contrôle de grammaire et rappel de fin de tour,
défaut oui), `theme` (thème du panneau : auto suit l'apparence de l'app de bureau, ou le Mac quand elle le suit, sinon le thème de Claude Code, #417 ; sombre ou clair l'imposent),
`launchEffort` (effort d'une session lancée du panneau, défaut high, borné par l'app à celui de la session
qui lance ; une carte refusée avec son effort est reposée sans lui ; « hérite » n'en passe aucun),
`launchModel` (« Modèle qui cadre », défaut opus : le modèle d'une session lancée du panneau ou par Maestro,
qui cadre, planifie, relit et débogue ; borné par l'app au modèle de la session qui lance, refusé il tombe ;
« hérite » n'en passe aucun), `codeModel` (« Modèle qui code », défaut sonnet : le modèle des sous-agents
qui codent chaque étape du plan, que le brief nomme ; jamais plus cher que le modèle qui cadre, #327),
`launchBypass` (« Lancer en bypass », défaut non : les sessions lancées du panneau, ou par une carte
que pose Claude, Maestro compris, demandent le mode bypass ; l'app ne l'accorde que depuis une session déjà en bypass, sinon
la carte est reposée sans lui et la session lancée demande elle-même le bypass à son démarrage, par
la carte d'approbation de l'app ; il faut d'abord activer le bypass dans Réglages → Claude Code).
Depuis une session en mode auto, l'option ne vaut pas (#248) : le contrôle du mode auto refuse un agent
qui doit se relever en bypass, la carte part donc sans le mode ni la consigne. Une carte cloud ne les porte
jamais (#494) : l'outil qui relève une session n'existe pas dans la VM.
`pruneBranches` (« Branches nettoyées », défaut oui, #313) : dans un projet de code, les branches fusionnées sur main que rien ne tient (ni un worktree, ni une ligne ouverte, ni la pointe de main) partent, sur le Mac par `git branch -d` et sur GitHub par un seul `git push origin :refs/heads/…`, après l'archivage d'une session et au démarrage d'une session (au plus toutes les 10 minutes) ; « Rouvrir la session » recrée la branche depuis main.
`launchQueue` (« File de lancement », défaut oui, #372) : chez Maestro, les lancements passent par la file commune au Mac de #345 (plafonds `projectSessions` et `macSessions`, sessions vivantes du Mac au plafond `macSessions`, mémoire tendue et charge, #403) ; éteint, plus de plafond ni d'attente, chaque carte et chaque ▶ partent tout de suite et les tâches déjà en file démarrent. Allumée, une entrée d'un autre Maestro qui peut partir et ne part pas en deux minutes ne retient plus la file, et le premier Maestro qui tourne la reprend et la lance (#374) ; une tâche en file part seule à son tour, qu'elle vienne d'un ▶ ou d'une carte de Maestro, et un départ refusé reste en file, avec son motif et son heure au centre de contrôle.

`testSlots` (« Suites de tests sur le Mac », défaut 1, #323) : combien de suites de tests lourdes tournent en même temps sur le Mac, tous projets confondus. La file des tests est une seule pour le Mac (`~/.claude/locks/heavy-tests/mac`) : une suite de `main`, de Maestro ou de `release.py release` passe devant, puis `tools/un_test.sh` (un fichier de test seul), qui a en plus une place à lui et part ainsi en quelques secondes même pendant une suite entière (#521), puis le reste, sans couper celle qui tourne ; chaque suite tourne en priorité basse (`renice` 10). Sa place prise, une suite attend aussi, 3 min au plus, que la charge retombe (elle part dès que la charge ne baisse plus) et que la mémoire se détende (moins de 5 % libres, ou swap à 90 % et plus avec moins de 10 % libres, #403), en disant laquelle la retient ; une attente dont la session est morte quitte la file.
`idleMinutes` (« Repos avant de rendre sa place », défaut 10, #374) : les minutes après lesquelles une session de tâche au repos rend sa place dans la file, et une carte posée pas encore démarrée cesse de réserver la sienne ; avant, 15 min fixes.
`queueAlertMinutes` (« File bloquée après », défaut 30, #400) : les minutes après lesquelles une entrée de la file de lancement qui n'est pas partie paraît en tête de la bande de chaque Maestro ouvert, tous projets compris : une ligne par entrée, sa cause réelle (retenue par une session qui n'est pas un Maestro, pas lancée à sa relève, Remote Control, carte posée, départ raté, place qui manque) et le geste qui la débloque ; un clic ouvre le Maestro où se fait le geste. La relève la calcule sur ce qu'elle lit déjà, sans lecture du store de plus.
`axisPill` (« Axe en pastille », défaut non depuis #177 ; #156) : allumé, chaque tâche ouverte de la
liste porte son axe en pastille grise, à droite du titre, avant l'âge ; jamais dans « En cours » (le bloc
de Maestro ou le filtre, où le carré d'axe suffit et le titre garde sa place), ni sous un axe choisi, ni
quand les sections se rangent par axe en attendant les titres, ni dans un projet qui montre ses propres
clés (`cles_visibles`). L'arbre suit le même réglage ; la fiche d'une tâche et l'en-tête de sa session
gardent leur axe. Allumée, le panneau dessine 20 lignes d'un coup au lieu de 40, puis « Voir les N autres ».
`priorities` (« Priorités », défaut non ; #300) : allumé, une tâche prioritaire (`prio:oui`, ou `prio:1`
de l'ancienne échelle avant sa migration) porte un drapeau blanc dans un carré rouge de 16 px juste
devant son titre, et sa fiche, à gauche du crayon, un carré de 22 px qui pose ou ôte la priorité d'un
clic (gris clair quand elle est ôtée), par la voie d'écriture du projet. Éteint, ni l'un ni l'autre ;
la priorité ne range jamais les tâches.
`dateFormat` (« Format des dates », défaut `us` ; #201) : `us` écrit les dates du panneau, de la fiche
et de l'en-tête d'une session à l'américaine, « Nov 4 », l'heure sur 12 h (« Nov 1 à 8:11 PM ») ; `fr`
à la française, « 04/11 », « 4 nov. » et « 01/11 à 20:11 ». Les mots (aujourd'hui, hier, dans 4 j)
restent en français ; les fichiers de la roadmap gardent leurs dates en AAAA-MM-JJ.
`account` (« Compte », défaut `auto` ; #219, #223) : le compte Claude de ce Mac, que le volet Réglages
nomme Auto, Perso ou Team / Enterprise. `auto` : le plugin passe aussi par les hooks classiques (début
de session, fin de tour, skills, compaction) ; sur un compte Team ou Enterprise, le plugin intégré
`cc-plugin-sec-default` les saute et l'app affiche « hook was skipped » : le plugin le voit au deuxième
tour fini sans Stop et passe seul le réglage sur `team`. `perso` : les hooks restent, rien ne change
seul. `team` : aucun de ces hooks, dès la première session et sans ligne grise ; ses secours par
message prennent le relais (le rappel de fin de tour arrive au message suivant). Un `classicHooks`
éteint par la 0.142 vaut `team` tant que `account` n'est pas posé. Deux plugins « roadmap » actifs (magasin
du compte et catalogue local) ont chacun leur clé, `roadmap@<source>.account` : la bascule et le volet les
écrivent toutes, et le sort de la bascule se lit au store, clé `account-switch` (#227).
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
conversation, et les lancements des 30 minutes suivantes passent droit par lui. Une session en mode
auto (fiche de la session, `permissionMode`) n'essaie même pas depuis le panneau : le ▶ va droit à Claude,
une seule ligne « Lancement de #N… » dans la conversation (#248). Si le mode auto refuse encore la carte
de Claude, la fiche le dit aussitôt, avec le bouton « Passer en bypass » (la carte d'approbation de
l'app ; refusé, la note dit le sélecteur de mode sous la saisie), puis on relance avec ▶. Le détail le dit en
une phrase, qui s'efface dès que la session tourne ; le refus brut de l'app va au relevé `perf`
(rangée `kind: 'launch'`), jamais à l'écran.

## Développer

```bash
claude plugin validate plugins/roadmap
claude plugin test plugins/roadmap
```

Les couleurs et mesures du panneau viennent de `hooks/tokens.ts` (#108) : une couleur ou une part de mélange écrite en dur ailleurs est refusée par `node design/scripts/check.mjs`. Le même fichier nourrit le design system de `design/` (composants React, `styles.css`), que `/design-sync` publie dans claude.ai : un changement de `tokens.ts` se reporte par `npm run tokens` dans `design/`. `tests/rendu.test.tsx` garde l'empreinte du dessin : un rendu changé exprès les relève à nouveau.

## Historique

- **0.301.0 (2026-11-13)** : roadmap : le grain des tâches se règle par projet, l'audit le lit (#566)
- **0.300.1 (2026-11-13)** : roadmap : la suite directe dans la tâche (#330), les sessions au-delà des 100 premières (#562)
- **0.300.0 (2026-11-13)** : roadmap : document à valider d'un clic (#587), nom court de Maestro (#597), Centre de contrôle cloud et dossiers (#583), noms distincts mère/filles (#598), marquer faite mère et compteur (#596), clé routine (#591), fausse alerte d'archivage (#602), archivage refusé via Claude (#601)
- **0.299.3 (2026-11-13)** : roadmap : la jauge d'une mère est calée à droite, avant le ▶ (#595, suite de #552)
- **0.299.2 (2026-11-13)** : roadmap : la clôture d'une ligne cloud poste le signal sur sa PR (#588), la carte cloud demandée en user_asked garde son modèle (#575)
- **0.299.1 (2026-11-13)** : roadmap : la durée du bloc En session ne coupe plus le titre étroit trop tôt (#579)
- **0.299.0 (2026-11-13)** : roadmap : une mère vide lance ses enfants (#552), rappels de Maestro pendant une mission cloud (#581)
- **0.298.0 (2026-11-13)** : roadmap : le Gardien du projet dans la bande (#577), le détail de la bande large (#578), une tâche close reprise n'est plus barrée (#582), le réveil d'une PR cloud rattachée par son titre (#580), preuve de #561 (#576)
- **0.297.1 (2026-11-13)** : roadmap : la carte cloud d'une tâche porte le modèle et l'effort de sa charge (#575)
- **0.297.0 (2026-11-13)** : roadmap : la ligne de session du bloc En session et de la bande tient à toute largeur (#561)
- **0.296.2 (2026-11-13)** : roadmap : le bloc de fin d'une session cloud en trois lignes, sans demande de changer de modèle (#559)
- **0.296.1 (2026-11-13)** : roadmap : le suivi cloud de Maestro ne rattache plus une tâche portée par une session du Mac (#573)
- **0.296.0 (2026-11-13)** : roadmap : l'audit se lit hors de main (#570), la bande de Maestro ne rattache plus une session du Mac comme cloud (#571), release.py dit qui prend la version publiée (#572)
- **0.295.0 (2026-11-12)** : roadmap : l'audit relit toutes les règles du projet et vérifie chaque tâche ouverte (#567)
- **0.294.0 (2026-11-12)** : roadmap : annuler le dernier « Marquer faite » pendant 10 s, sur une tâche ou un lot (#556)
- **0.293.0 (2026-11-12)** : roadmap : la commande « quoi archiver » dit quelles sessions archiver au gabarit fixe (#560)
- **0.292.0 (2026-11-12)** : roadmap : un lot confié à Claude part en une seule demande (#555), commandes sous /roadmap settings, control, bar, help (#378), brief cloud sans consigne bypass (#494), clôture gardée par les findings (#558)
- **0.291.2 (2026-11-12)** : roadmap : la bande Finies au gabarit des lignes (#544), la carte posée par Claude reçoit un contexte pour la mission et le cloud (#510)
- **0.291.1 (2026-11-12)** : roadmap : une mission lancée en direct prend sa ligne à l'appel (#510)
- **0.291.0 (2026-11-12)** : roadmap : le mode prio passe devant tout (pause des autres sessions, file des tests en voie 0), suite de main fichier par fichier (#536)
- **0.290.0 (2026-11-12)** : un tronc local et cloud, gardien des fusions, findings, bloc fixe du compte rendu, why dans la fiche, tâches mises à jour avant d'en créer ; perf : minuterie, dessins, zones de clic, panneau sans la liste (#510 #528 #531 #537 #535 #538 #522 #519 #520 #516 #539 #530 #527 #498)
- **0.289.0 (2026-11-12)** : commande why, ▶ Cloud par Claude, réveil de Maestro par le cloud, nature des projets, mots d'état, clôture partielle, fiche sans roue ; perf : store, hooks, scripts (#529 #515 #496 #508 #509 #487 #532 #518 #523 #525 #526 #533)
- **0.288.0 (2026-11-12)** : file des tests : une seconde place pour les tests ciblés (un_test.sh), plafond de charge à 180 s, départ quand la charge cesse de baisser, place d'un shell mort rendue, historique des attentes (#521)
- **0.287.0 (2026-11-12)** : panneau : le ▶ Cloud de mission passe par Claude hors Bypass, sa consigne imposée (#512) ; en-tête En session identique plié ou déplié (#513) ; budgets du panneau qui rougissent à toute dérive d'appels (#524)
- **0.286.1 (2026-11-12)** : doctor : le geste du dépôt porte ne pousse plus, règle « worktree toujours off » pour AAFES et Sharp Cowork (#475)
- **0.286.0 (2026-11-11)** : panneau : version du pied prise du module chargé, vue Faites légère pour un grand projet (#505, #497)
- **0.285.1 (2026-11-11)** : panneau : la date de publication d'une livraison collée au bord droit de sa rangée (#504)
- **0.285.0 (2026-11-11)** : panneau et cloud : contexte de la bande remis à jour après /compact, conclusion de fin d'une session cloud comme au Mac (#491, #483)
- **0.284.0 (2026-11-11)** : panneau : pastilles des livraisons successives d'une tâche dans la fiche, la bande et le bloc En session (#480)
- **0.283.0 (2026-11-11)** : panneau et maestro : En session compté par lieu, ligne cloud prise au départ, modèle et effort selon la charge jugée, cartes depuis le cloud, Fille de sans gras, croix ronde (#468, #474, #486, #488, #489, #490, #492, #493)
- **0.282.0 (2026-11-11)** : maestro : reco_cloud lit le réglage missions, le garde-fou laisse passer les missions (#476) ; panneau : le lieu choisi dans le panneau prime sur la reco, la carte Nouvelle tâche dit le lieu (#479)
- **0.281.0 (2026-11-11)** : panneau, doctor, maestro : réglage de projet « cloud : missions » pour un dossier sans code, le bouton Cloud pose une carte de mission sans branche ni PR (#476)
- **0.280.0 (2026-11-11)** : maestro : les missions cloud des projets sans code partent par carte de l'app, leur « Fait » remonte par le rappel « #N · retour » (mission_cloud.py carte et retour, #473)
- **0.279.0 (2026-11-11)** : maestro : un départ suit toujours la reco, carte refusée sinon, la reco reconnaît une tâche au Mac (#465) ; panneau : la pastille dit « Tape go dans Maestro : #N … attend » (#472) ; doctor : contrôle le réglage cloud de chaque projet (#453)
- **0.278.0 (2026-11-11)** : panneau : bloc En session, pastille Remote Control seulement quand une tâche attend en file (#464) ; tests : roadmap.test.tsx découpé en 11 fichiers par thème (#433) ; maestro : missions cloud sans dépôt par RemoteTrigger, mission_cloud.py (#467)
- **0.277.1 (2026-11-11)** : release.py : status répond en une seconde, sans lancer le contrôle ; status --check le lance (#463)
- **0.277.0 (2026-11-11)** : panneau : la fiche d'une ligne cloud dit l'état de sa PR au lieu de « À lancer » (#440)
- **0.276.0 (2026-11-11)** : cloud : plugin muet en VM, skills seules (#457) ; bilans comptables, causes en liste fermée (#460) ; reco à profil de besoins (#461)
- **0.275.0 (2026-11-11)** : fidélité : une tâche de rendu se clôt à sa publication, sa preuve part en tâche à part (#455)
- **0.274.0 (2026-11-11)** : maestro : carte de tâche en cloud selon la reco, ligne prise au départ de la session cloud (#458)
- **0.273.0 (2026-11-11)** : maestro : la suite entière de main tourne dans une session cloud, le Mac ne garde que la publication (#450)
- **0.272.0 (2026-11-11)** : cloud : tes réglages et la méthode du Mac dans le brief cloud (#449) ; ▶ Cloud d'un projet à depot sans champ repository (#454)
- **0.271.0 (2026-11-11)** : panneau : le ▶ reconnaît le refus de l'app sous Remote Control (#452) ; état « en test » d'une tâche publiée (#375)
- **0.270.0 (2026-11-11)** : tests ciblés par session, suite entière une fois sur main avant publication (#448)
- **0.269.0 (2026-11-11)** : tests hors de GitHub Actions (#446) ; cloud pour une roadmap hors du dépôt, clé depot (#444) ; suivi d'une session cloud lancée par la carte (#445) ; tâche mère sans gras ni ▶ (#447)
- **0.268.0 (2026-11-11)** : maestro : la session Maestro prend le nom du dossier de son projet (#439)
- **0.267.0 (2026-11-11)** : panneau : cartes de tâche sans doublon, cible cloud ou Mac dans le titre de la carte native, icône sur les cartes custom, carte faite en violet (#436)
- **0.266.0 (2026-11-11)** : tasks : regroupement à l'écriture (#438) ; impact : tests lourds laissés à la CI de la PR (#434) ; doctor : règles de l'outil à jour (#290)
- **0.265.0 (2026-11-11)** : maestro : une branche dont la PR est verte se fusionne sans rejouer la CI de PR ; plusieurs branches prêtes passent d'affilée, une seule CI de main (#431)
- **0.264.2 (2026-11-11)** : maestro : une entrée de la file retenue chez une session archivée, absente ou qui n'est pas un Maestro est reprise par un Maestro ouvert, son projet d'abord (#424)
- **0.264.1 (2026-11-11)** : panneau : le titre d'une ligne cloud ouvre la fiche de la tâche, qui porte « Ouvrir la PR N » (#435)
- **0.264.0 (2026-11-11)** : maestro et panneau : la reco cloud ou Mac se juge par le modèle sur la tâche entière (ligne, spec, fiche, fichiers), gardée en cache dès qu'une tâche apparaît, la règle de mots en secours (#430)
- **0.263.1 (2026-11-11)** : panneau : l'archive d'une ligne cloud lit sa session dans la PR et l'archive, sinon dit de l'archiver dans la liste de gauche (#435)
- **0.263.0 (2026-11-11)** : panneau et maestro : une PR fusionnée par Maestro finit « Merged » (gh pr merge, #428) ; la durée d'une ligne cloud part de sa prise (#426) ; une tâche à maquettes est recommandée cloud (#427)
- **0.262.0 (2026-11-11)** : panneau : une tâche parent dépliée montre sa date finale (son due:, sinon l'échéance de son dernier enfant), repliée la prochaine échéance de ses enfants (#319)
- **0.261.0 (2026-11-11)** : maestro : la carte cloud part du panneau lui-même, qui prend la ligne ; l'interrupteur Cloud | Mac redessine sans recharger ; une carte cloud refuse une branche absente de GitHub (#416)
- **0.260.0 (2026-11-11)** : panneau : la bande Maestro dit l'état en mot et en couleur (en session, t'attend, à fusionner, Done), la durée à la couleur de l'état, une tâche faite toute en violet (#425)
- **0.259.0 (2026-11-10)** : panneau, maestro : reco cloud ou Mac pour chaque tâche, interrupteur Cloud | Mac dans la fiche, repli sur le Mac (#416)
- **0.258.1 (2026-11-10)** : panneau : centre de contrôle, une session mise en pause à la main se montre et reprend même la file de lancement éteinte (#415)
- **0.258.0 (2026-11-10)** : panneau : « Start » sur la carte d'une tâche nouvelle, qui la met dans la file du Maestro racine ou fait le ▶ sans Maestro (#388)
- **0.257.3 (2026-11-10)** : panneau : la case cause et geste d'une entrée bloquée tient la cause entière, écart étroit autour du « · » (#400) ; « Tester les maquettes » laisse la barre latérale de l'app ouverte (#401)
- **0.257.2 (2026-11-10)** : maestro, mockups : maquettes en Artifact et preuve de fidélité depuis une session cloud (#409)
- **0.257.1 (2026-11-10)** : impact : la carte cite les tests que le projet déclare pour un fichier, même sans nom qui les relie (#418)
- **0.257.0 (2026-11-10)** : panneau : la bande de chaque Maestro ouvert dit en tête, tous projets compris, une entrée de la file de lancement bloquée au-delà du seuil (option « File bloquée après », 30 min par défaut), avec sa cause réelle et le geste qui la débloque ; un clic ouvre le Maestro où se fait le geste (#400)
- **0.256.0 (2026-11-10)** : panneau : « Tester les maquettes » ouvre la page à chaque clic, en http par le serveur de maquettes que le panneau lance lui-même et qui ne sert que le dossier de la page ; le bouton ne se change plus en « Fermer » (#401)
- **0.255.0 (2026-11-10)** : panneau : centre de contrôle, « Tout en pause » et « Tout reprendre » dans le titre, « Retirer » sur une entrée en attente, session en pause sous un nœud pause (#415)
- **0.254.5 (2026-11-10)** : panneau : en thème auto, le panneau suit l'apparence de l'app de bureau (clair, sombre, ou le Mac quand elle le suit) au lieu de rester sombre ; seul le réglage du thème est lu dans le fichier de l'app, jamais le reste (#417)
- **0.254.4 (2026-11-10)** : panneau : une session qui reprend du travail après la clôture de sa tâche garde ses vraies étapes, sans Done ni « Archiver cette session », et Maestro la suit comme ouverte (#395)
- **0.254.3 (2026-11-10)** : panneau : un clic sur une carte de tâche met l'onglet Roadmap devant, ouvre la bonne fiche chez un enfant de Maestro, et la fiche fait ses lectures ensemble (#387)
- **0.254.2 (2026-11-10)** : release : la publication du plugin part d'une action GitHub, lancée et suivie depuis le Mac par release.py remote ; chaque version porte son étiquette (#410)
- **0.254.1 (2026-11-10)** : panneau : le bouton des maquettes montre le volet, ou passe la main à Claude avec l'url seule quand l'app ne voit pas la session dans une fenêtre ; plus aucune commande bâtie sur un nom de fichier ; trace de chaque clic au store (#401)
- **0.254.0 (2026-11-10)** : maestro, panneau : mode cloud de Maestro (réglage sessions, clé lieu:cloud, brief et suivi par la PR) et sessions cloud visibles dans le bloc En cours et la bande, nuage et état de la PR (#408)
- **0.253.0 (2026-11-10)** : maestro, file des tests : un lancement et une suite de tests attendent aussi la mémoire du Mac et le nombre de sessions vivantes, et disent la vraie raison de l'attente (#403)
- **0.252.2 (2026-11-10)** : maestro : un « lance #N » tapé au téléphone par Remote Control part en lancement direct, jamais en carte ; la retenue de la file dit « tape un mot ici ou depuis ton téléphone » (#392)
- **0.252.1 (2026-11-10)** : panneau : chaque dessin porte un texte de remplacement, les marques des têtes de section et les icônes du bouton des maquettes s'affichent enfin sur le bureau ; un test refuse tout dessin à alt vide (#370)
- **0.252.0 (2026-11-10)** : panneau : le bouton des maquettes d'une fiche ouvre la page en http par le serveur de serve.py quand il tourne pour le projet, en file:// sinon ; en mode auto, Claude sert la page lui-même (#401)
- **0.251.3 (2026-11-10)** : maestro : le panneau de Maestro éteint lui-même Remote Control sur chaque session qu'il lance, une fois, depuis Bypass ou Auto ; la consigne du brief reste en secours (#402)
- **0.251.2 (2026-11-10)** : maestro : la suite entière tourne sur GitHub Actions à chaque PR et sur main, Maestro y lit le résultat ; deux tests passent sous root et sur un clone superficiel (#407)
- **0.251.1 (2026-11-10)** : panneau : un dessin trop gros pour l'app se replie et s'allège au lieu de laisser le volet vide (bandes repliées d'office passé 40 lignes, pesée de l'arbre, carte « trop gros ») (#414)
- **0.251.0 (2026-11-10)** : maestro : une session de tâche lancée par Maestro éteint Remote Control à sa naissance, pour que l'app puisse la mettre en pause au repos ; Maestro garde le sien (#402)
- **0.250.0 (2026-11-10)** : audit, tasks : les vieilles sauvegardes se purgent seules, au-delà de 7 jours et hors des 20 dernières (#413)
- **0.249.0 (2026-11-10)** : panneau : la bande de Maestro au style du bloc En cours (case d'axe, archive entre la case et le numéro, plus de mots d'état, durée au bord droit) ; dans le bloc, l'archive aussi (#385, retour de test)
- **0.248.0 (2026-11-10)** : maestro : la consigne de capture de fidélité suit un gabarit court (version à vérifier, gestes numérotés, ce qu'on doit voir, quoi faire si ça diffère), relue en fin de tour (#406)
- **0.247.1 (2026-11-09)** : panneau : le Bilan de la fiche en noms courts, Souci et Essai, chaque étiquette sur la ligne de sa valeur (#368)
- **0.247.0 (2026-11-09)** : mockups : maquettes interactives servies en http local par serve.py (jeton, 127.0.0.1), maquette finale réunie avant le code (#369)
- **0.246.0 (2026-11-09)** : panneau : la ligne En cours et la bande de Maestro disent depuis quand chaque session tourne, à la place du compte d'étapes ; la bande paraît pour toutes les sessions du projet (#385)
- **0.245.0 (2026-11-09)** : maestro : une seule file des tests lourds pour tout le Mac, avec des places réglables (« Suites de tests sur le Mac »), la fusion et la publication de Maestro en tête, chaque suite en priorité basse, et tools/un_test.sh pour un fichier seul (#323)
- **0.244.7 (2026-11-09)** : maestro : sous Remote Control, hors mode Auto, la relève de la file pose elle-même la carte de la tâche (plus de message refusé par l'app) ; le centre de contrôle dit « carte posée · clique Start » (#393)
- **0.244.6 (2026-11-09)** : maestro : une session ne demande plus jamais à BBR de tester un rendu non publié ; elle demande elle-même à Maestro « fusionne et publie #N », Maestro publie aussitôt et lui renvoie la version, puis vient la capture (#396)
- **0.244.5 (2026-11-09)** : panneau : les valeurs de Détails et de la carte Bilan sur le guide des titres de la famille, une colonne d'étiquettes de la largeur de la marque d'une fille (#368)
- **0.244.4 (2026-11-09)** : maestro : un lancement refusé sous Remote Control dit ses deux conditions (Remote Control allumé, départ non tapé), et le panneau de Maestro le montre par une pastille, avec « Passer en bypass » en mode Auto (#390)
- **0.244.3 (2026-11-09)** : panneau : la valeur de Détails et son appoint sur une rangée ; un test refuse tout groupe sans boîte posé dans une rangée, que le bureau dessinait en colonne (#391)
- **0.244.2 (2026-11-09)** : panneau : la famille au pied de la fiche reprend l'arbre de la liste, une rangée par ligne, coude et case d'une fille en un seul dessin, jauge de la mère à côté de son compte (#368)
- **0.244.1 (2026-11-09)** : maestro : seul un Maestro tient la file de lancement commune, une entrée prise à tort lui revient et une entrée retenue ne bloque plus celles qui suivent (#389)
- **0.244.0 (2026-11-09)** : panneau : au centre de contrôle, le numéro et le titre d'une carte ouvrent la fiche de sa tâche ; une tâche d'un autre projet ouvre sa session (#386)
- **0.243.1 (2026-11-09)** : maestro : la Pause du centre de contrôle arrête la session dès le clic, et un état unique de la session sert le centre de contrôle, la ligne En cours, la bande et la fiche (en test, en pause) (#383)
- **0.243.0 (2026-11-09)** : panneau : une tâche n'est « à fusionner » que quand sa session s'est dite prête ou a coché ses étapes ; pendant ses tests elle reste en session (#384)
- **0.242.0 (2026-11-09)** : maestro : une Pause cliquée arrête vraiment la session et libère sa place, une tâche n'a qu'une place, la file dit la vraie raison d'attente, et une tâche qu'on refuse de lancer ne revient plus qu'au ▶ (#383)
- **0.241.1 (2026-11-09)** : audit : une mère de regroupement neuve prend qui: la personne et n'exige pas de due: dans un projet qui exige qui: (#346)
- **0.241.0 (2026-11-09)** : maestro : sous Remote Control, une tâche débloquée de la file part sur le prochain mot tapé dans Maestro, et le geste n'est dit qu'une fois (#382)
- **0.240.0 (2026-11-09)** : maestro : la capture de fidélité se prend par Bertrand sur la consigne exacte de la session, posée par fidelite.py poser --capture ; la session ne capture plus l'écran (#377)
- **0.239.0 (2026-11-09)** : panneau : la carte d'une tâche écrite fait 60 % de large, se ferme d'une croix, ouvre la tâche (« Ouvrir la task ») et dit sa sorte en couleur dans le bandeau (#371)
- **0.238.0 (2026-11-09)** : fiche : « Archiver cette session » dans la fiche close de la session de sa tâche, « Ouvrir la session » retiré de son propre panneau (#336)
- **0.237.1 (2026-11-09)** : fiche : la durée se cale au bord droit de la ligne du titre (#341)
- **0.237.0 (2026-11-08)** : fiche : son pied reprend celui de la liste, la roue des Réglages et la version à gauche, « N en file » et le centre de contrôle à droite (#380)
- **0.236.0 (2026-11-08)** : fiche : édition en place, un champ à la fois (Entrée, V « enregistré »), sans bouton Enregistrer ; crayon plus petit ; l'état ne s'édite plus à la main (#342)
- **0.235.1 (2026-11-08)** : fiche : durée sur la ligne du titre, durée d'une étape cochée d'un coup, « tourne depuis » compté depuis la création de la session, libellés longs coupés à trois lignes (#341)
- **0.235.0 (2026-11-08)** : maestro : la file de lancement avance seule (un Maestro qui tourne reprend l'entrée d'un Maestro au repos, une carte en file part seule, un départ refusé reste en file avec sa trace), délai de repos réglable (10 min), « Ouvrir » du centre de contrôle réparé (#374)
- **0.234.0 (2026-11-08)** : panneau : la carte d'une tâche écrite dit son axe en clair, des infos selon le cas (version et bilan, échéance, avant → après) et « Ouvrir la session » quand une session la tient (#371)
- **0.233.0 (2026-11-08)** : panneau : les tâches écrites dans un message se dessinent en cartes façon « New session » (bandeau, titre, description), avec l'avant → après et un clic qui ouvre la fiche (#371)
- **0.232.3 (2026-11-08)** : fiche : le bouton d'archive de la bande Done ne déborde plus (#341)
- **0.232.2 (2026-11-08)** : centre de contrôle : flèches ↑ ↓ au lieu de la poignée, « Prioritaire » reste un bouton simple (#362)
- **0.232.1 (2026-11-08)** : sessions : la carte de test dit quoi essayer, fait les essais elle-même et lit la version par le dossier principal (#366)
- **0.232.0 (2026-11-07)** : panneau : le haut de la fiche dit depuis quand une tâche tourne, la durée de chaque étape, ce qu'on va lancer, et le donut monte en haut à droite du carton Livré ; la carte Bilan s'ouvre sur Accroché (#341)
- **0.231.0 (2026-11-07)** : panneau : les lignes « - Roadmap : #N … » d'un message de Claude deviennent une carte par tâche, numéro, sorte, axe et échéance (#371)
- **0.230.0 (2026-11-07)** : sessions : une tâche publiée passe en test, Maestro pose la carte Tester #N, les retours de la session de test vont à la session d'origine et la tâche se coche au « c'est bon » (#366)
- **0.229.1 (2026-11-07)** : sessions : une session qui attend son sous-agent ou sa commande de fond ne s'annonce plus arrêtée à Maestro, et ne le réveille qu'une fois (#347)
- **0.229.0 (2026-11-07)** : panneau : centre de contrôle des sessions, une tâche prioritaire passe devant et met en pause la session qui cède, le bloc En cours devient une ligne de compteurs (#367)
- **0.228.1 (2026-11-06)** : panneau : le nom et la couleur d'un axe, et le nom d'une tâche, s'affichent dès Enregistrer, l'écriture tourne en fond (#354)
- **0.228.0 (2026-11-06)** : panneau : option File de lancement, et la file ne retient plus une tâche quand les places sont libres (#372)
- **0.227.0 (2026-11-06)** : panneau : la case pose sa question en haut avant de cocher, le bandeau de sélection simplifié, Tout choisir sur le bloc en cours, survol du numéro à marges égales (#355)
- **0.226.1 (2026-11-06)** : panneau : l'anneau du survol de la case paraît et la case reprend le clic sur le bureau (#364)
- **0.226.0 (2026-11-06)** : panneau : un clic sur la case coche ou rouvre la tâche, un clic sur son numéro la choisit (#355)
- **0.225.1 (2026-11-06)** : panneau : la case des lignes redevient le carré seul au repos, l'anneau ne paraît qu'au survol (#364)
- **0.225.0 (2026-11-06)** : sessions : file de lancement commune à tout le Mac, deux plafonds (par projet, sur le Mac), rang et Retirer dans le bloc En cours, départ par Maestro (#345)
- **0.224.2 (2026-11-06)** : panneau : la fiche n'ouvre plus qu'un document rangé dans le projet, sinon la rangée cliquée dit pourquoi (#349)
- **0.224.1 (2026-11-06)** : panneau : le volet Réglages retrouve son ⓘ et ses options, lues dans plugin.json quand /config n'en liste aucune (#356)
- **0.224.0 (2026-11-06)** : maestro : preuve de fidélité à la maquette avant la fusion d'un rendu (capture du vrai panneau à côté de la maquette validée) (#357)
- **0.223.0 (2026-11-06)** : panneau : titres de section en blanc, une seule tête pour Récentes et les jours, vue Done comprise (#353)
- **0.222.0 (2026-11-06)** : panneau : la case vivante : anneau au survol, rebond et éclat à la coche, ligne teintée, plus de fond gris après un clic (#351)
- **0.221.0 (2026-11-06)** : panneau : la fiche fidèle à la maquette A3 : mission entière, un seul retrait, Quand sur une ligne, boutons de même forme (#352)
- **0.220.0 (2026-11-06)** : panneau : une session cachée se repose, relue une fois par minute et réveillée à son retour (#348)
- **0.219.2 (2026-11-06)** : panneau : une écriture du store refusée par le verrou d'une autre session se réessaie (#350)
- **0.219.1 (2026-11-06)** : panneau : la source et la fiche d'une tâche ne s'ouvrent que si ce sont des documents du projet (#343)
- **0.219.0 (2026-11-06)** : panneau : « Maestro » mal tapé d'une lettre (Mastero, Maestor) ouvre l'accueil et compte comme Maestro (#344)
- **0.218.0 (2026-11-06)** : panneau : le bas de la fiche en un bloc soudé, la famille reliée en arbre puis Détails, et deux vrais boutons (#343)
- **0.217.0 (2026-11-06)** : panneau : la roadmap n'est relue que quand elle change, garde-fous de budget du panneau, sonde de visibilité des sessions (#337)
- **0.216.2 (2026-11-05)** : panneau : les lignes de la file du bloc En cours de Maestro reprennent la hauteur d'une ligne, plus de trou géant (#340)
- **0.216.1 (2026-11-05)** : panneau : sous un filtre, la mère close du jour ne paraît que si elle ou une de ses filles passe le filtre (#339)
- **0.216.0 (2026-11-05)** : panneau : l'accueil de Maestro montre une grille d'un an façon GitHub, un bouton Faites ou Ajoutées, le jour et son chiffre au survol (#335)
- **0.215.0 (2026-11-05)** : sessions : l'heure locale du Mac jointe à chaque message, « hier » se mesure contre elle (#331)
- **0.214.0 (2026-11-05)** : maestro : optimiseur de tokens, un modèle qui cadre et un modèle qui code, les étapes du plan codées par des sous-agents, le coût de chaque tâche dans son bilan (#327)
- **0.213.0 (2026-11-05)** : maestro : Maestro dose ses sessions, un plafond réglable de sessions au travail sur le Mac et un lancement différé sous la charge, la file montrée dans le bloc En cours (#324)
- **0.212.0 (2026-11-05)** : panneau : la carte d'accueil de Maestro montre la frise d'activité des deux derniers mois, faites et ajoutées ; Maestro raconte les derniers travaux par thème (#325)
- **0.211.0 (2026-11-05)** : panneau : la bande de Maestro alignée en colonnes fixes, la liste des axes aux % calés à droite et au crayon après le nom (#326)
- **0.210.0 (2026-11-05)** : reglages-session : réglage autonome éteint, la fusion, la publication et les gestes hors du code attendent le oui ; tableau « Autonome éteint » (#304)
- **0.209.0 (2026-11-05)** : mockups : un rendu ne se code qu'après le oui sur la maquette exacte, le plugin rappelle une édition de rendu faite sans oui (#322)
- **0.208.0 (2026-11-05)** : panneau : la file des tests lourds se voit dans le bloc En cours de Maestro (#321) ; le crayon d'un axe change sa couleur et son nom en place, et le doctor contrôle la clé axes (#286)
- **0.207.0 (2026-11-05)** : panneau : la fiche d'une tâche close dit sa durée et où ce temps est passé (travail, attente de BBR, file des tests, Mac chargé, attente de fusion), en petit donut cliquable (#314)
- **0.206.1 (2026-11-05)** : garde-fou git : un clone frais n'exempte plus les règles qui valent partout, une configuration, un remote ou un worktree coupe la chaîne du clone, et un shell déguisé dans un here-doc est repéré (#315)
- **0.206.0 (2026-11-04)** : panneau : la case d'une ligne choisit au lieu de cocher ; une barre de sélection coche, date, statut et récurrence en lot, à travers les axes, une mère prenant ses enfants (#316)
- **0.205.0 (2026-11-04)** : panneau : une recherche se range comme la liste, sous ses sujets et leur trait coloré, et une tâche trouvée amène toute sa chaîne, faites comprises (#318)
- **0.204.0 (2026-11-04)** : tasks, maestro : à l'écriture, une action qui touche le même endroit qu'une tâche ouverte se propose d'y être versée, une suite d'une tâche close se reconnaît, et tasks.py lots repasse sur toutes les ouvertes (#320)
- **0.203.0 (2026-11-04)** : panneau : la fiche d'une tâche refaite (carton par état, jauges horizontales des étapes et de la chaîne, carte Détails repliée, Tout lire pour la mission) (#291)
- **0.202.0 (2026-11-04)** : panneau, tools : les branches fusionnées que rien ne tient sont supprimées, sur le Mac et sur GitHub, après l'archivage d'une session et au démarrage (option Branches nettoyées) ; la réouverture recrée la branche ; release.py ne committe plus que ses fichiers (#313, #287)
- **0.201.0 (2026-11-04)** : panneau : une tâche close rouvre sa session par l'icône d'archive de la bande Done, avec une confirmation, même sur une très longue liste de sessions ; le brief de l'arbre relit aussi cette liste (#302)
- **0.200.0 (2026-11-04)** : tasks, maestro : un sujet, une tâche et une mère au titre court tenus par des questions de write (#288) ; la note d'un ajout et la raison d'un abandon dans le libellé (#285) ; à la fin d'une étude, une task proposée par étape recommandée (#293)
- **0.199.1 (2026-11-04)** : tasks, onboarding : l'ancienne échelle de priorité (prio:1, 2, 3) est refusée à l'écriture et au contrôle, après la migration des roadmaps à prio:oui
- **0.199.0 (2026-11-04)** : reglages-session : la conclusion de fin de session s'ouvre sur « Ce qu'on a fait » (le problème, ce qu'on a construit, ce que ça change), que la carte Fin de la fiche montre
- **0.198.2 (2026-11-04)** : garde-fou git : moins de refus à tort (here-docs, clones d'essai, accolades, $ littéraux, texte entre guillemets), les vrais risques toujours refusés
- **0.198.1 (2026-11-04)** : impact : la carte relève les symboles du code avant la doc, dit ce que son plafond coupe, cherche les noms banals par leur chemin et lit Swift, Kotlin et Rust
- **0.198.0 (2026-11-04)** : impact : nouvelle skill roadmap:impact, la carte de ce que touche une modification (fichiers, symboles, tests à lire d'abord), branchée au brief de code et à la fin de chantier
- **0.197.0 (2026-11-04)** : reglages-session : toute session cadre au départ (zéro à quatre questions en un formulaire, puis l'accord en une ligne) avant d'avancer en autonome jusqu'à la fusion
- **0.196.0 (2026-11-04)** : panneau : une priorité oui ou non (prio:oui), un drapeau dans un carré rouge devant le titre quand l'option Priorités est allumée (éteinte par défaut), posée d'un clic dans la fiche
- **0.195.0 (2026-11-04)** : panneau : la fiche d'une tâche ouvre ses maquettes d'un clic dans le volet navigateur (bande « Voir les maquettes »), et sa ligne Dossier lit spec: à la racine du projet
- **0.194.0 (2026-11-04)** : maestro : le brief d'une session lancée donne le dossier du projet (règles, carte, structure), sa place dans la chaîne et demande une ligne « Lu : » au premier compte rendu
- **0.193.0 (2026-11-04)** : reglages-session : les messages du mode ADHD passent au verdict en gras, puis la preuve (faits en mots, chiffres en petit tableau, ce qui te revient en citation)
- **0.192.1 (2026-11-04)** : panneau : les dates, résumés et compteurs en text3 lisibles (contraste 4,5:1 en sombre et en clair)
- **0.192.0 (2026-11-04)** : mockups : avant une maquette, la nouvelle skill roadmap:mockups part du design system du projet ; frontend-design seulement sans lui
- **0.191.1 (2026-11-04)** : panneau : le nom d'une section est aligné dans Toutes comme dans Ma journée (plus de bouton natif décalé, en-tête à chevron compris) ; la mère gardée pour ses filles sous un filtre n'est plus grisée (#295, #296)
- **0.191.0 (2026-11-04)** : maquettes : le réglage fait lancer frontend-design puis web-design-guidelines (ou la skill de design du projet) avant la première maquette, et le plugin rappelle en fin de tour une maquette dessinée sans skill de design (#292)
- **0.190.0 (2026-11-04)** : check.mjs et le contrôle du hook refusent les fautes de structure que tasks refuse (troisième niveau, prio sur un enfant, après entre deux sujets, parent clos ou introuvable) ; une ligne neuve à plusieurs actions est signalée (#289)
- **0.189.0 (2026-11-04)** : doctor : vérifie chaque copie installée du plugin roadmap contre les empreintes publiées de sa version (CHECKSUMS.txt du dépôt public) : identique, ou fichiers changés, en trop, manquants et liens symboliques (#274)
- **0.188.0 (2026-11-04)** : onboarding : le modèle ROADMAP-REGLES.md s'ouvre sur les « Règles de l'outil », les mêmes dans tout projet (un sujet, une tâche ; fille ; mère au titre court ; clôture) ; tasks et audit les tiennent au-dessus des règles du projet (#276)
- **0.187.0 (2026-11-04)** : audit : regroupe par sujet les tâches à plat d'un axe (mères proposées, axe et après: entre sœurs gardés, doublon à garder et mots à reprendre, fusion avec sa raison) (#284)
- **0.186.0 (2026-11-04)** : panneau : la case et la flèche d'une ligne alignées (survol de la case centré sur le carré, flèche au milieu entre le carré et le #) (#282)
- **0.185.0 (2026-11-04)** : release : plus de clé types dans plugin.json, que le magasin claude.ai ôtait en avertissant ; check la refuse (#283)
- **0.184.0 (2026-11-04)** : release : status et le panneau lisent le magasin du compte sous le nom du dépôt public, roadmap-plugin (#281)
- **0.183.0 (2026-11-04)** : panneau : les étapes de journée passées avancent seules à la semaine suivante au démarrage (tous:semaine et 2semaines, a_preuve pour les coquilles qui attendent la preuve) (#277)
- **0.182.0 (2026-11-04)** : panneau : la récurrente d'un clic (tous:jour et tous:ouvré, skill: et fiche:, ▶ bleu qui coche, redate et lance la session du jour ; pastille rose de récurrence) (#280)
- **0.181.0 (2026-11-04)** : doctor : signale un shim python3 posé par un plugin (modern-python), qui refuse les scripts des skills (#279)
- **0.180.0 (2026-11-04)** : panneau : la mission de la fiche en puces ou en phrase, au choix du projet (réglage mission dans roadmap.json et le volet Réglages) (#278)
- **0.179.0 (2026-11-03)** : tasks, maestro : la skill tasks ouvre une ligne quand qui: est exigé, le rapprochement pèse les mots rares (noms propres, codes), et Maestro est averti quand il écrit ROADMAP.md à la main (#255)
- **0.178.0 (2026-11-03)** : panneau : les filtres de temps rangés comme la liste, Ma journée (le jour, toute l'équipe, récurrentes à part), Demain neuf, Cette semaine, En retard et À relancer par sujet (#268)
- **0.177.0 (2026-11-03)** : panneau, maestro : la carte « Ce qui a changé » dans la fiche (#269), les lignes de la liste gardent leur place au dépli et la tête de section respire sous son trait (#266), l'encart « Derniers travaux » à l'ouverture de Maestro (#270)
- **0.176.0 (2026-11-03)** : roadmap : la page « Est-il sûr de l'installer ? » (SECURITE.md) tenue vraie par un test, et l'empreinte de chaque fichier installé (CHECKSUMS.txt) publiée avec le miroir, à chaque version (#271)
- **0.175.0 (2026-11-03)** : maestro : plus de question d'archivage d'autres sessions dans la boîte de fin, qui cachait la bande au-dessus de la saisie ; les finies s'archivent par leur icône dans la bande (#267)
- **0.174.0 (2026-11-03)** : panneau, maestro : une carte de session au #N faux, clos ou déjà pris est refusée, le titre se tire de la ligne écrite (nom:), et la bande comme le panneau disent le nom du titre de la session (#263)
- **0.173.0 (2026-11-03)** : panneau : la tête de section B3 dans tous les rangements et Ma journée (marque dans la colonne des carrés, nom, compte au bout, trait de couleur dessous), les lignes ne redisent plus le jour ni la personne de leur section, ligne de l'arbre rapprochée (#265)
- **0.172.1 (2026-11-03)** : panneau : un jeton de pièce jointe du brouillon n'ouvre qu'un document dont le chemin réel reste dans le projet, lien symbolique refusé (#264)
- **0.172.0 (2026-11-03)** : panneau : l'aperçu d'un email montre l'objet, À, Cc, les pièces jointes en jetons et le corps à puces, titre # et étiquettes en gras compris (#264)
- **0.171.0 (2026-11-03)** : cowork : le plugin écrit seul la roadmap d'un dossier Cowork qui la lui confie (cowork.json « roadmap »: « plugin-roadmap ») : clôture par le panneau et tasks.py done avec bilan entier et heure, sauvegardes de tasks.py et audit.py hors de la racine (#262)
- **0.170.0 (2026-11-03)** : lancement : en mode auto, le ▶ passe droit par Claude sans demander le bypass, et une carte refusée propose « Passer en bypass » (#248)
- **0.169.0 (2026-11-03)** : clôture : une tâche dont un livrable est une communication pas encore partie (email, message, invitation) ne se coche ni ne s'archive avant son « Statut : envoyé » (#242)
- **0.168.0 (2026-11-03)** : tests : la file des tests lourds attend que la charge du Mac retombe, et tools/rejouer_delais.py rejoue seuls les tests tombés en délai dépassé (#249)
- **0.167.0 (2026-11-03)** : maestro : une demande de travail neuve se cadre par formulaire puis se délègue à une session fille, et la garde de fin de tour rappelle à Maestro de ne rien exécuter lui-même (#250)
- **0.166.1 (2026-11-03)** : bande de Maestro : la jauge de contexte se tient à 2 px sous la jauge d'étapes (#241)
- **0.166.0 (2026-11-03)** : panneau : toutes les vues suivent la vue de référence (marque sur 32 px, # serré, retard seul), la carte Chaîne d'une fille devient l'arbre de la liste (#259)
- **0.165.0 (2026-11-03)** : messages : une ligne d'état en italique et un journal court à glyphes, le compte rendu de la roadmap fondu dedans, plus de second message ni de tableau, une tâche abandonnée dite « annulée » (#261)
- **0.164.0 (2026-11-03)** : panneau : la liste Par sujet devient la vue de référence (flèche de dépli devant le #, jauge et x/x après le titre, « 1 j de retard » seul) (#258)
- **0.163.2 (2026-11-03)** : panneau : l'échéance du jour s'écrit « aujourd'hui » au bout d'une ligne de la liste (#257)
- **0.163.1 (2026-11-03)** : panneau : fin de la cohérence du design, jauges de 6 px partout, « aujourd'hui » dans la vue Done, dates des comptes rendus en « Oct 21 », un seul bouton plein quand l'encart de confirmation est ouvert (#256)
- **0.163.0 (2026-11-03)** : panneau : la cohérence du design, parti A (un seul dessin par rôle : compte « N Done sur M », dates « Nov 5 · dans 4 j », têtes de bloc, pastilles de 20 px, un seul bouton plein, jauge de 6 px), bande au-dessus de la saisie inchangée (#252, #253, #254)
- **0.162.1 (2026-11-02)** : panneau : le bloc « En cours » de Maestro s'ouvre replié, la bande au-dessus de la saisie redit ses sessions (#251)
- **0.162.0 (2026-11-02)** : tasks, maestro : la clôture partielle, notre part close et sa suite ouverte chez le tiers en une écriture (handoff), proposée par les sessions et rappelée en fin de tour (#245)
- **0.161.1 (2026-11-02)** : panneau : la pastille du responsable reprend une couleur (teinte d'attente) et l'icône personne (#247)
- **0.161.0 (2026-11-02)** : format-adhd : les messages s'ouvrent sur une phrase de tête qui dit où on en est, une conclusion à part en fin de session ; fin du gabarit carte d'étape, Fait/Trouvé/Suite et bloc État/À toi/Session (#243)
- **0.160.0 (2026-11-02)** : panneau : la carte Chaîne d'une fille montre sa mère et son avancement, la jauge de ses sœurs, Avant, Ici, Ensuite (#246)
- **0.159.0 (2026-11-02)** : panneau : le plugin rend lui-même le compte rendu de toute écriture de la roadmap, quelle que soit la skill, et refuse une fois la boîte de fin tant que ce qui attend n'est pas passé par un formulaire (#244)
- **0.158.1 (2026-11-02)** : panneau : sous une tâche mère, seules les filles faites aujourd'hui restent visibles, le compte de la mère les comptant toutes (#240)
- **0.158.0 (2026-11-02)** : maestro : « Maestro <axe> » ouvre le panneau, l'accueil et les briefs de la session sur cet axe, gardé par défaut ; « Maestro » seul rouvre tout (#239)
- **0.157.0 (2026-11-02)** : brief : toute session lancée sur une tâche reçoit le contexte de son arbre (parente, sœurs, prérequises et ce qu'elles ont livré, suites, closes qui la citent, sessions passées), au ▶ comme dans les cartes de Maestro (#237)
- **0.156.0 (2026-11-02)** : panneau : les vues de la liste remises à plat : par sujet partout à l'ouverture (clé vue retirée), bandeaux à icône hors sujet, filles à faire par échéance, puis en cours, puis faites barrées (#238)
- **0.155.0 (2026-11-02)** : fiche : clé livrable: (les sorties d'une tâche, leur carte, chemins de fichiers en lien) et aperçu du brouillon dans la fiche, montré en entier avant toute validation (#234, #236)
- **0.154.0 (2026-11-02)** : panneau : une session lancée par Maestro ne montre que la fiche de sa tâche, sans retour vers la liste (#233)
- **0.153.0 (2026-11-02)** : panneau : le nom court d'une tâche se choisit à la main (clé nom:, depuis la fiche ou la skill tasks) et l'emporte partout sur le titre tiré (#235)
- **0.152.0 (2026-11-02)** : tasks : un compte rendu fixe après chaque écriture (Ajoutées, Mises à jour, T'attendent), puis un seul formulaire pour ce qui attend (#232)
- **0.151.2 (2026-11-02)** : hooks : le garde-fou git relit largement une ligne qu'il ne comprend pas et la refuse dans le dossier principal, au lieu d'apprendre bash cas par cas (#230)
- **0.151.1 (2026-11-02)** : panneau : une tâche parent repliée prend le même espacement qu'une tâche seule (#231)
- **0.151.0 (2026-11-02)** : doctor : signale un plugin roadmap actif en double, la copie à garder et le geste pour retirer l'autre (#229)
- **0.150.7 (2026-11-02)** : panneau : un bouton cliqué ou un menu choisi quitte le focus au dessin suivant, la remontée ne bloque plus sur un élément tenu en bas (#228)
- **0.150.6 (2026-11-02)** : hooks : le garde-fou arrête un commentaire au retour à la ligne et lit $$' comme un guillemet simple (#226)
- **0.150.5 (2026-11-02)** : hooks : le garde-fou lit l'antislash et les guillemets $'…' comme bash, une commande ne se cache plus dans une chaîne (#226, 5e relecture de sécurité)
- **0.150.4 (2026-11-02)** : hooks : le garde-fou ne suit plus les variables d'une ligne qui a un antislash, un commentaire, eval, $[…] ou W[…] (#226, 3e et 4e relectures de sécurité)
- **0.150.3 (2026-11-02)** : hooks : le garde-fou ne suit une variable que sur une ligne de commandes sûres (liste blanche), et lit 2>&1 comme une redirection (#226, seconde relecture de sécurité)
- **0.150.2 (2026-11-02)** : réglages : deux plugins « roadmap » actifs (magasin du compte et catalogue local) n'empêchent plus le choix Compte de basculer sur Team ni ne vident le volet Réglages (#227)
- **0.150.1 (2026-11-02)** : hooks : le garde-fou du dossier principal ne prend plus un worktree de l'app pour lui et lit une variable affectée plus tôt dans la ligne (#226)
- **0.150.0 (2026-11-02)** : panneau : la carte d'ouverture de Maestro ne liste plus ses tâches lancées, que le panneau et la bande portent déjà (#215)
- **0.149.0 (2026-11-02)** : panneau : l'arbre au rendu de la maquette #212 C partout (titre en texte, mère en gras et son carré gardé, date au bout, faite barrée, « Replier les sections », responsable gris) (#224)
- **0.148.0 (2026-11-02)** : panneau : /maestro-bar fait paraître la bande de Maestro au-dessus de la saisie, ou dit pourquoi elle ne paraît pas (#225)
- **0.147.1 (2026-11-02)** : panneau : une mère lancée par Maestro ne vide plus le panneau (zone de clic posée deux fois) (#220)
- **0.147.0 (2026-11-02)** : hooks : les tests lourds passent un par un par projet (one-at-a-time.sh), le hook Bash met en file claude plugin test, release.py check et npm test (#222)
- **0.146.0 (2026-11-02)** : réglages : le choix Compte (Auto, Perso, Team / Enterprise) remplace « Hooks classiques », sans ligne grise dès la première session sur un compte Team (#223)
- **0.145.0 (2026-11-02)** : panneau : la jauge fine de contexte de chaque session revient sous sa jauge d'étapes dans la bande de Maestro (#217)
- **0.144.0 (2026-11-02)** : maestro, tasks : proposer une task dès qu'une idée neuve ou une action sort de l'échange, règle fixe dite à chaque message d'un projet à roadmap (#216)
- **0.143.0 (2026-11-02)** : panneau : le bloc En cours garde une session Completed tant qu'elle n'est pas archivée, avec son icône d'archivage, comme la bande (#218)
- **0.142.1 (2026-11-02)** : panneau : une panne du dessin montre une carte d'erreur (message, version, Réessayer) au lieu d'un panneau vide, et se note au store (pane-draw) (#220)
- **0.142.0 (2026-11-02)** : hooks : sous sec-default (compte Team), plus de lignes « hook was skipped », les hooks classic s'éteignent seuls et leurs secours font le travail (#219)
- **0.141.0 (2026-11-02)** : panneau : liste chez Maestro, fiche chez un enfant à coup sûr, la tâche retrouvée dans le projet où elle vit, une fiche « introuvable » plutôt que la liste en silence (#213)
- **0.140.0 (2026-11-02)** : panneau : « Rouvrir la session » au pied de la carte Fin d'une tâche close, désarchive et ouvre sa session (#206)
- **0.139.0 (2026-11-02)** : panneau : la carte Étapes de la fiche en fil, l'étape en cours mise en avant, sans tableau (#214)
- **0.138.0 (2026-11-02)** : panneau : mission et carte Fin en fondu avec flèche (#205), Completed en étiquette (#207), boutons Fichiers à 20 px (#208)
- **0.137.0 (2026-11-02)** : panneau : bande de Maestro resserrée, numéro sans case fixe, jauge puis étape, état en icône et en mot (#211)
- **0.136.0 (2026-11-02)** : panneau : la voie de la fiche compte toutes les prérequises et débloquées (#209), Étapes repliées sur une tâche Done (#210)
- **0.135.0 (2026-11-02)** : panneau : le titre suit le numéro, l'échéance en texte coloré au bout de la ligne, les étiquettes après le titre (#212)
- **0.134.0 (2026-11-02)** : panneau : pièces jointes d'une tâche (pj:), carte de la fiche à vignettes, lues par le brief (#204)
- **0.133.0 (2026-11-01)** : panneau : vue Done en familles, sous-tâche sous sa mère, mères repliées, bouton « Déplier les sous-tâches » (#203)
- **0.132.1 (2026-11-01)** : panneau : à 0 tâche ouverte, le panneau s'ouvre sur les Done par jour, barre verte (#202)
- **0.132.0 (2026-11-01)** : panneau : au-delà de 65 % de contexte, le pourcentage de la bande de Maestro passe en rouge et une pastille « Compacter » lance /compact (#197)
- **0.131.0 (2026-11-01)** : reglages-session : messages de travail plus fournis (Fait · Trouvé · Suite sous la carte d'étape), fiche de fin de session à verdict en tête, due aussi quand la session est bloquée (#128)
- **0.130.0 (2026-11-01)** : panneau : la fiche d'une tâche en cartes repliables à tête, un filet par ligne, l'état en bande sous l'en-tête, un seul état « Completed » dans toute la fiche (#199)
- **0.129.0 (2026-11-01)** : panneau : la ligne de tâche refaite : plus de rond, le carré d'axe coche et décoche après un tag « Confirmer » sur la même ligne ; une faite grisée et barrée, son carré garde la couleur de l'axe ; colonnes alignées (#198)
- **0.128.1 (2026-11-01)** : panneau : les tâches lancées par Maestro restent à la place de leur premier lancement, dans la bande et le bloc En cours (#195)
- **0.128.0 (2026-11-01)** : panneau : dates à l'américaine par défaut (« Nov 4 », heure sur 12 h), réglage dateFormat us | fr ; le contrôle refuse une date fait: ou ouvert: dans le futur, comptée à l'heure locale (#201)
- **0.127.0 (2026-11-01)** : reglages-session : l'en-tête du mode ADHD devient une carte d'étape (icône d'état, étape N/total, nom, barre ▰▱, état en mots), le constat dessous (#196)
- **0.126.0 (2026-11-01)** : panneau : une tâche de code n'est finie qu'une fois fusionnée : étape « Fusionner » (et « Publier » avec la clé publier) cochée par git, état « à fusionner » à la place de « t'attend » dans la fiche, la bande et le bloc En cours (#191)
- **0.125.0 (2026-11-01)** : panneau : « Ranger › Par numéro » range les arbres par le numéro de leur tâche racine, le plus récent en haut ; le filtre « Récentes » quitte « Plus › » (#192)
- **0.124.0 (2026-11-01)** : panneau, maestro : le brief de lancement s'ouvre par sa mission, ses fichiers et « Fini quand », lisibles d'un coup d'œil sur la carte (#194)
- **0.123.0 (2026-11-01)** : panneau : les ouvertes toujours en arbre, que « Ranger » (par sujet, par jour, par échéance, par responsable) trie sans le couper ; par jour, chaque arbre à sa prochaine échéance, l'étape du jour sous sa mère (#189)
- **0.122.1 (2026-11-01)** : panneau : le titre de la fiche d'une tâche en texte de 22 px (un bouton natif ignorait sa taille), le crayon en petit bouton gris de 24 px (#193)
- **0.122.0 (2026-11-01)** : contrôle, tasks, onboarding : une sous-tâche prend l'axe de sa tâche parente, un autre axe est refusé ; changer l'axe d'une mère emmène ses sous-tâches (#190)
- **0.121.0 (2026-11-01)** : panneau : s'ouvre sur toutes les tâches, en arbre, « Plus › » replié, chez Maestro comme ailleurs (#188)
- **0.120.0 (2026-11-01)** : panneau : la case s'anime quand on coche (rebond du carré, coche tracée) et une tâche cochée reste un instant à sa place avant de partir dans les Done (#182)
- **0.119.1 (2026-11-01)** : panneau : le bloc « En cours » de Maestro montre aussi les tâches en cours dans d'autres sessions, même chez un Maestro neuf (#187)
- **0.119.0 (2026-11-01)** : panneau : les Done en vert, la barre des seules ouvertes (pleine en vue Done), la case d'une faite en carré d'axe coché (#180)
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

