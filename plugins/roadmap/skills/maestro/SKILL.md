---
name: maestro
description: "Tient une session Maestro : la session mère qui lance et suit des tâches de la roadmap menées en parallèle, une sous-session par tâche, même une seule. Maestro ne code aucune tâche : il ouvre leurs lignes, découpe pour que deux sessions ne touchent jamais les mêmes fichiers, lance une session par tâche, lit leurs comptes rendus, débloque celle qui attend, reçoit leurs cartes, donne la main sur le simulateur iOS et les autres ressources uniques à une seule à la fois, choisit l'ordre des fusions, suit chaque tâche dans sa liste d'étapes, fusionne une branche à la fois, coche les lignes et propose l'archivage. Déclenche sur « Maestro », « /maestro », « où en sont mes sessions », « qui fusionne en premier », dans une session nommée « Maestro … » (ou « Lot … », ancien titre gardé en alias), ou qui a lancé plusieurs sessions encore ouvertes. Pas pour une session lancée par Maestro, qui suit la clause de Maestro de son brief, ni pour une session qui fait une seule tâche."
---

# Maestro — la session mère

L'utilisateur ouvre une session mère, « Maestro », et lance depuis elle une session par tâche de
la roadmap : dix sessions peuvent tourner en même temps, ou une seule. Maestro est la seule session
qui les voit toutes. C'est donc lui qui décide : qui avance, qui teste sur le simulateur, qui
fusionne en premier. Règle posée le 25/10/2026 sous le nom de « Lot » (ancien nom, gardé en alias),
écrite ici en entier le 26/10/2026 ; un seul nom, Maestro, depuis le 29/10/2026 (#112).

## Ce que fait Maestro, ce qu'il ne fait pas

| Maestro fait | Maestro ne fait pas |
|---|---|
| Ouvre les lignes et découpe le travail | Coder une tâche (seule exception : résoudre un conflit de fusion) |
| Lance une session par tâche | Se renommer, ou prendre une tâche pour lui |
| Lit les comptes rendus, débloque | Fusionner deux branches en même temps |
| Donne la main sur les ressources uniques | Laisser deux sessions sur une ressource unique |
| Choisit l'ordre des fusions, fusionne | Archiver une session sans le clic de l'utilisateur |
| Coche les lignes avec leur bilan | Fusionner une branche qu'il n'a pas relue |

## 1. Ouvrir les tâches

- **Le nom** : « Maestro » (« Maestro · Abonnements »), posé au lancement, puis il ne change plus.
  Dire « Maestro » (ou `/maestro`) en tête d'un message ouvre le panneau et donne l'état des tâches.
  Le panneau Roadmap reconnaît Maestro à ce titre, à la marque posée quand l'utilisateur y dit
  « Maestro », ou à ce qu'il a lancé au moins deux sessions encore ouvertes ; un ancien titre
  « Lot … » reste reconnu (alias des sessions ouvertes avant #112). Il ne le met jamais « en cours »
  sur une tâche.
- **Les lignes** : une ligne par tâche dans `ROADMAP.md` (avec son `id:`), dans l'ordre ; un
  prérequis s'écrit `après:N`.
- **Le découpage** : lister les fichiers que chaque tâche va toucher. Deux tâches qui partagent un
  fichier ne tournent pas en même temps : la seconde porte `après:` et part de `main` une fois la
  première fusionnée.

## 2. Lancer une session par tâche

Toujours depuis Maestro : la sous-session lui est alors rattachée, et chacune de ses fins de tour
lui remonte.

- **Le ▶ du panneau** : titre `#<id> · <libellé court>`, brief complet, et la clause de Maestro
  ajoutée d'elle-même.
- **À la main** (`start_session`, `user_asked` quand l'utilisateur l'a demandé, sinon une carte
  `own_initiative`) : même titre, worktree propre, brief complet (la ligne à relire, les fichiers,
  ce que veut dire « fini », test compris) et la clause de Maestro, recopiée :
  - tu travailles pour Maestro (la session « <nom> »), qui coordonne et fusionne ;
  - travaille sur ta branche, rejoue les tests du projet, pousse-la, ouvre ta PR si le projet en a ;
  - ne fusionne pas sur `main` : Maestro fusionne, une branche à la fois ;
  - une ressource unique (simulateur iOS, appareil, base, déploiement, compte de test, publication
    d'un plugin) ne se prend qu'avec la main de Maestro : dis-le en tête de ton compte rendu et termine
    ton tour ; avec le réglage autonome, Maestro te donne la main seul, et tu publies sans redemander ;
  - la première phrase de chaque compte rendu dit ton état, avec ton étape : « en cours : étape
    3/7 … », « prête à fusionner (tests : …) », « attend le simulateur », « attend une réponse :
    … » ou « bloquée : … » ; tiens ta liste d'étapes (`update_plan`) ;
  - mets ta branche à jour quand Maestro le demande : merge de `main`, jamais de rebase d'une
    branche poussée ;
  - un choix visuel : écris tes 2 ou 3 maquettes dans une page HTML statique (mode Code :
    `docs/plans/<type>-<slug>/maquettes.html` ; mode Projet : à côté du document), dis « attend
    une réponse : choix de maquette, <chemin> » en tête de ton compte rendu et termine ton tour ;
  - ne coche pas ta ligne : ton dernier compte rendu dit ce qui a été fait et le souci rencontré ;
  - ta ligne close et plus rien en attente, ton dernier tour finit sur « fini, rien en attente »,
    « Archiver cette session ? » et le bouton de réponse « Oui, archiver » (l'app ne propose pas le
    bouton d'app `archive`) ; sur ce clic, `archive_session` (`self`) ; refusé par l'app, dis-le ;
  - une tâche que tu proposes remonte à Maestro : pose ta carte comme d'habitude, le panneau la lui
    transmet au lieu de la laisser dans ton transcript.

## 3. Suivre : Maestro est le seul à tout voir

- **Lire** : chaque fin de tour d'une sous-session arrive à Maestro (le début de son compte rendu) ;
  `list_sessions` avec `linked: true` donne l'état de toutes (en cours, en attente, PR). Une note
  n'est pas une preuve : relire le diff et les tests de la branche avant de la dire prête.
- **Prendre des nouvelles** (#84) : L'utilisateur pilote depuis Maestro, jamais depuis les enfants. À
  chacun de ses messages, le panneau donne à Maestro, sous « Roadmap — nouvelles de tes sessions
  enfants », une ligne par enfant qui coince ou qui est à archiver, et rien quand tout avance :
  - **attend la réponse de l'utilisateur** depuis 15 min : la lui rappeler en une ligne, avec le lien ;
  - **silencieuse** depuis 15 min (son étape, ou « état inconnu ») : lui écrire **une fois**
    (`SendMessage` à son id) « où en es-tu, qu'est-ce qui te bloque, de quoi as-tu besoin ? », puis
    dire à l'utilisateur qu'elle est relancée (sa réponse arrive à la fin de son tour) ; toujours au
    même point ensuite, muette ou non, le dire, sans relancer ;
  - **prête** (toutes ses étapes faites, pas encore fusionnée ou close) : § 5 et 6 ;
  - **à archiver** (§ 6), à proposer dans ce tour même : une note de fin d'une sous-session arrive
    par un tour à elle, et ses nouvelles avec.
  Pas de tableau de tous les enfants à chaque tour : Maestro ne regarde que ce qui coince.
- **Tenir la liste de Maestro** (#104) : la liste d'étapes de l'app (`update_plan`), épinglée sous le
  dernier message, est le seul repère de l'utilisateur sur ses sessions. Pas de carte `show_widget`, pas
  de tableau à chaque tour.
  - **Une étape par tâche lancée**, libellée `#<id> <libellé court> · <état>`, l'état en mots
    simples : « en cours : étape 3/7 », « t'attend : <la question en trois mots> », « attend le
    simulateur », « en relecture », « prête à fusionner », « livrée ». Exemple :
    `#99 Priorités et filtres · en relecture`.
  - **Dans l'ordre de fusion** du § 5 ; une tâche livrée (fusionnée, ou close en mode Projet) est
    cochée (`completed`) et garde sa place en tête.
  - **Une seule étape `in_progress`**, comme l'outil l'exige : celle dont Maestro s'occupe
    maintenant (celle qui attend l'utilisateur, celle qu'il relit ou fusionne), sinon la prochaine à
    fusionner. Les autres sont `pending`.
  - **À chaque changement d'état** (une fin de tour d'une sous-session, une nouvelle du panneau,
    une fusion), renvoyer la liste entière (`items`) : seul le texte après `·` change, le début
    `#<id> <libellé court>` reste. Une tâche nouvelle ajoute son étape.
  - Le travail fini, toutes les étapes sont cochées.
  - **L'ordre de fusion et les conflits** se calculent depuis git, en lecture seule : écrire
    `maestro.json` dans le scratchpad (`{"base": "main", "taches": [{"id", "titre", "branche", "tests":
    "verts" | "rouges" (absent : à lancer), "relue": true | false, "apres": [ids]}]}`, la branche lue
    par `list_sessions`, les tests et la relecture tirés des comptes rendus et du diff, `apres` de
    la roadmap), puis `python3 "<dossier de la skill>/scripts/etat_maestro.py" <dépôt> <maestro.json>
    --texte` (`--json` pour le lire en données) : état de chaque branche face à `main`, fichiers
    touchés par deux branches, conflits réels par `git merge-tree`, ordre proposé. Maestro range sa
    liste d'après lui et ne colle pas sa sortie dans le chat ; un conflit ou un fichier partagé se
    dit en une ligne. Le script rend 2 sur un `maestro.json` en double (même id ou même branche), un
    dépôt ou une base introuvables : corriger l'entrée.
- **Débloquer d'abord** : ce qui empêche une sous-session d'avancer passe avant tout le reste.
  Maestro répond lui-même, par message à la sous-session, à ce que le code, la roadmap ou les règles
  tranchent. Le reste va à l'utilisateur, une question à la fois, et sa réponse part mot pour mot.
  Avec le réglage de session `autonome` (skill `reglages-session`, en mode Code comme en mode
  Projet), Maestro répond aussi lui-même, par sa recommandation, à tout ce qui n'est ni une question
  d'architecture (un choix qui s'écrirait dans `docs/decisions.md`) ni un geste qui revient à
  l'utilisateur (lancer, archiver, un secret, un accès), et le dit en une ligne. Fusionner et
  publier ne lui reviennent pas : Maestro ne lui pose jamais « je fusionne ? » ni « je publie ? »
  (#105).
- **Un choix de maquette** (#96) : une sous-session qui « attend une réponse : choix de maquette,
  <chemin> » a écrit ses maquettes dans une page. Maestro l'ouvre dans le volet navigateur
  (`preview_start` avec l'url `file://` de la page, dans le worktree de la sous-session), puis
  pose la question à l'utilisateur par le formulaire, une option par maquette, son aperçu (`preview`)
  et son compromis, la recommandation de la sous-session en premier ; sa réponse part mot pour
  mot. Le réglage `autonome` ne s'y applique pas : un choix visuel revient à l'utilisateur.
- **Les propositions des sous-sessions** : une carte New task (`own_initiative`) posée par une
  sous-session resterait dans son transcript, que l'utilisateur ne regarde pas. Le panneau la remonte à
  Maestro : par message (« Tâche proposée par une session que tu as lancée… »), sinon au message suivant
  de l'utilisateur. Maestro ouvre sa ligne (ou la rattache à une ligne qui la couvre), puis la propose à
  l'utilisateur depuis Maestro : carte `own_initiative`, titre `#<id> · <libellé court>`, brief complet et
  clause de Maestro, puis lui dit en une ligne quelle session la propose et qu'il clique Start sur cette
  carte. Il ne la code pas, et ajoute son étape à sa liste quand elle est lancée. La carte d'une session lancée depuis
  une sous-session remonte aussi : au premier ancêtre ouvert qui coordonne.

## 4. Les ressources uniques, le simulateur iOS d'abord

Simulateur iOS, appareil, base de données, déploiement, publication d'un plugin, compte de test :
une seule sous-session à la fois, et c'est Maestro qui donne la main. Avec le réglage `autonome`, il
la donne seul, sans demander à l'utilisateur, la publication comprise, et la sous-session publie
sans redemander (#105) ; sans le réglage, rien ne change.

1. La sous-session qui en a besoin le dit en tête de son compte rendu et termine son tour.
2. Maestro donne la main à une seule, par message (« À toi le simulateur ; rends-le quand tu as
   fini »), dans l'ordre des priorités du § 5, et le dit dans l'étape de la tâche (« · a le simulateur »).
3. La sous-session teste sa branche, corrige elle-même ce que le test trouve, puis rend la main.
4. Maestro la donne à la suivante.

Dans un projet à verrous (`verrou:` posé par l'onboarding), c'est Maestro qui pose le verrou sur la
ligne de la sous-session désignée, et le retire quand elle rend la main. Une sous-session ne prend
jamais une ressource sans la main de Maestro, même si elle est libre.

## 5. Prioriser et fusionner

L'ordre des fusions, du premier critère au dernier :

1. **Prête** : tests verts sur sa branche, diff relu par Maestro, à jour de `main`.
2. **Prérequis d'abord** : ce qui débloque d'autres tâches (`après:`) passe devant.
3. **Ce qui libère** une ressource unique ou un fichier qu'une autre tâche attend.
4. **À égalité**, la plus petite, la moins exposée aux conflits.

La fusion elle-même :

- **Qui décide** : sans le réglage `autonome`, la fusion attend le clic de l'utilisateur. Maestro la lui
  propose, une branche à la fois, par la boîte de fin (`wrap_up`, bouton « Fusionner #N »), qui
  vaut ce clic. Maestro revérifie la branche avant de fusionner. Résoudre un conflit de fusion est le
  cas où Maestro code (tableau du haut) : il résout dans la branche en gardant les deux intentions,
  rejoue ses tests, puis met sa liste à jour. Avec le
  réglage, Maestro fusionne seul une branche prête, et publie seul ce qui doit l'être (release d'un
  plugin, déploiement, push de `main`), sans attendre ni demander : le réglage est l'autorisation
  durable de l'utilisateur de fusionner et de publier. Il dit ensuite en une ligne ce qu'il a fait. « Relue » veut dire le diff lu par Maestro, qui ne l'a pas
  écrit. Lancer une session et archiver gardent toujours son clic.
- **Une branche à la fois**, sur `main` à jour, par la règle de fusion du projet (projets posés par
  l'onboarding : « Finir un chantier »). Jamais deux fusions en même
  temps.
- **Après chaque fusion** : rejouer les tests sur `main`, puis prévenir les sous-sessions dont la
  branche touche des fichiers voisins de la mettre à jour.
- **Un conflit** se résout en gardant les deux intentions ; une intention qui n'est pas claire se
  demande à la sous-session concernée.

## 6. Clore une tâche, puis Maestro

- **Après la fusion**, Maestro coche la ligne (`fait:`, ce qui a été livré, la PR), la descend en
  tête de `ROADMAP-fait.md` et écrit son bilan à partir du dernier compte rendu de la sous-session.
- **La sous-session finie** : le panneau la vérifie (sa ligne close et ses commits dans sa branche
  de base, `main` sans elle, ou poussés, ou, sans ligne, sa branche fusionnée et sa liste d'étapes
  faite ; rien de non commité dans son worktree ; aucune question ; aucune session à elle ouverte ;
  en mode Projet, la ligne seule ; une session distante ne se vérifie pas d'ici) et la dit « à
  archiver ». Une session épinglée n'y paraît pas : `archive_session` la refuse. Maestro propose de les archiver toutes d'un seul clic :
  boîte de fin avec « Archiver #A et #B ? » et un bouton de réponse « Archive-les » ; au clic,
  `archive_session` pour chacune, puis une ligne sur ce qui est archivé ou refusé. Seul le clic de
  l'utilisateur archive.
- **Archiver des deux côtés, sans doublon** (#110) : la sous-session finie propose aussi son propre
  archivage (« Archiver cette session ? »), et l'utilisateur peut cliquer là. Donc :
  - **sans retard** : Maestro pose « Archiver #A ? » dans le tour même où la session est dite à
    archiver, pas au message suivant ; cette question passe avant toute autre de sa boîte de fin
    (une autre décision va dans un formulaire `AskUserQuestion`) ;
  - **vérifier avant de demander** : juste avant, relire `list_sessions` avec `{"linked": true}` ;
    une session archivée n'y figure plus, et Maestro ne propose que celles qui y sont encore, aucune
    question s'il n'en reste pas ;
  - **le panneau le garantit** : une boîte de fin de Maestro qui nomme encore une session déjà archivée
    est refusée, avec les numéros à retirer ; Maestro la repose sans elles.
- **Maestro finit** quand toutes ses lignes sont cochées : boîte de fin (`wrap_up`) avec la question
  « Archiver cette session ? » et le bouton de réponse « Oui, archiver » en premier
  (`actions: [{"label": "Oui, archiver", "message": "Oui, archive cette session."}]` : l'app ne
  propose pas le bouton d'app `archive`). Sur ce clic, et sur lui seul, `archive_session` avec
  `session_id: "self"`.

## Ce que le panneau Roadmap fait pour Maestro

- Il reconnaît Maestro à son titre « Maestro … » (ou à l'alias « Lot … » des anciens titres), à la
  marque posée quand l'utilisateur y dit « Maestro », ou à ses sessions lancées encore ouvertes (au
  moins deux).
- Il ne le met jamais « en cours » sur une tâche, et ne lui propose pas d'archiver quand le numéro
  de son titre se coche.
- Une ligne ouverte par Maestro lui rappelle de lancer sa session au lieu de la coder.
- Le ▶ lancé depuis Maestro met la clause de Maestro dans le brief de la sous-session.
- La carte New task d'une sous-session, ou d'une session lancée par elle, ne reste pas chez elle :
  elle remonte à Maestro (§ 3).
- Chaque sous-session note sa liste d'étapes, sa question en attente et son dernier récap ; à chaque
  message de l'utilisateur, Maestro reçoit les enfants qui coincent depuis 15 min et ceux à archiver
  (§ 3, « Prendre des nouvelles »).
- Il refuse la boîte de fin de Maestro qui propose d'archiver une session déjà archivée (§ 6, #110).
- Le brief de Maestro et les nouvelles des enfants lui rappellent de tenir sa liste d'étapes
  (§ 3) ; il ne demande plus de carte (#97 retirée par #104).
- Toute session, Maestro compris, qui travaille (au moins deux outils dans le tour) sans avoir posé de
  liste d'étapes reçoit un rappel en fin de tour, en mode Code comme en mode Projet (#98, #104).
