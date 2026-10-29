---
name: lot
description: "Tient une session Lot : la session principale qui orchestre un lot de tâches de la roadmap menées en parallèle, une sous-session par tâche. Le Lot ne code aucune tâche : il ouvre leurs lignes, découpe pour que deux sessions ne touchent jamais les mêmes fichiers, lance une session par tâche, lit les comptes rendus de toutes, débloque celle qui attend, donne la main sur le simulateur iOS et les autres ressources uniques à une seule à la fois, choisit l'ordre des fusions selon les tests et les prérequis, le montre en carte cliquable dans le chat (un bouton Fusionner par branche), fusionne une branche à la fois et coche les lignes. Déclenche sur « Lot 1 », « ouvre un lot », « lance le lot », « où en est le lot », « montre l'état du lot », « qui fusionne en premier », « priorise les merges », dans une session nommée « Lot … », ou dans une session qui a lancé plusieurs sessions encore ouvertes. Pas pour une sous-session du lot, qui suit la clause du Lot de son brief, ni pour une session qui fait une seule tâche."
---

# Session Lot — l'orchestrateur

L'utilisateur ouvre une session principale, « Lot 1 », et lance depuis elle une session par tâche de
la roadmap : dix sessions peuvent tourner en même temps. Le Lot est la seule session qui les voit
toutes. C'est donc lui qui décide : qui avance, qui teste sur le simulateur, qui fusionne en
premier. Règle posée le 25/10/2026, écrite ici en entier le 26/10/2026.

## Ce que fait le Lot, ce qu'il ne fait pas

| Le Lot fait | Le Lot ne fait pas |
|---|---|
| Ouvre les lignes et découpe le lot | Coder une tâche (seule exception : résoudre un conflit de fusion) |
| Lance une session par tâche | Se renommer, ou prendre une tâche pour lui |
| Lit les comptes rendus, débloque | Fusionner deux branches en même temps |
| Donne la main sur les ressources uniques | Laisser deux sessions sur une ressource unique |
| Choisit l'ordre des fusions, fusionne | Archiver une session sans le clic de l'utilisateur |
| Coche les lignes avec leur bilan | Fusionner une branche qu'il n'a pas relue |

## 1. Ouvrir le lot

- **Le nom** : « Lot N » (« Lot 2 · Abonnements »), posé au lancement, puis il ne change plus.
  Le panneau Roadmap reconnaît un Lot à ce titre, à ce qu'il a lancé au moins deux sessions
  encore ouvertes, ou à une session Maestro (titre « Maestro … », ou l'utilisateur y a dit « Maestro »),
  même avec une seule ; il ne le met jamais « en cours » sur une tâche.
- **Les lignes** : une ligne par tâche dans `ROADMAP.md` (avec son `id:`), dans l'ordre ; un
  prérequis s'écrit `après:N`.
- **Le découpage** : lister les fichiers que chaque tâche va toucher. Deux tâches qui partagent un
  fichier ne tournent pas en même temps : la seconde porte `après:` et part de `main` une fois la
  première fusionnée.

## 2. Lancer une session par tâche

Toujours depuis le Lot : la sous-session lui est alors rattachée, et chacune de ses fins de tour
lui remonte.

- **Le ▶ du panneau** : titre `#<id> · <libellé court>`, brief complet, et la clause du Lot
  ajoutée d'elle-même.
- **À la main** (`start_session`, `user_asked` quand l'utilisateur l'a demandé, sinon une carte
  `own_initiative`) : même titre, worktree propre, brief complet (la ligne à relire, les fichiers,
  ce que veut dire « fini », test compris) et la clause du Lot, recopiée :
  - tu fais partie du Lot « <nom> », qui coordonne et fusionne ;
  - travaille sur ta branche, rejoue les tests du projet, pousse-la, ouvre ta PR si le projet en a ;
  - ne fusionne pas sur `main` : le Lot fusionne, une branche à la fois ;
  - une ressource unique (simulateur iOS, appareil, base, déploiement, compte de test, publication
    d'un plugin) ne se prend qu'avec la main du Lot : dis-le en tête de ton compte rendu et termine
    ton tour ; avec le réglage autonome, le Lot te donne la main seul, et tu publies sans redemander ;
  - la première phrase de chaque compte rendu dit ton état, avec ton étape : « en cours : étape
    3/7 … », « prête à fusionner (tests : …) », « attend le simulateur », « attend une réponse :
    … » ou « bloquée : … » ; tiens ta liste d'étapes (`update_plan`) ;
  - mets ta branche à jour quand le Lot le demande : merge de `main`, jamais de rebase d'une
    branche poussée ;
  - un choix visuel : écris tes 2 ou 3 maquettes dans une page HTML statique (mode Code :
    `docs/plans/<type>-<slug>/maquettes.html` ; mode Projet : à côté du document), dis « attend
    une réponse : choix de maquette, <chemin> » en tête de ton compte rendu et termine ton tour ;
  - ne coche pas ta ligne : ton dernier compte rendu dit ce qui a été fait et le souci rencontré ;
  - ta ligne close et plus rien en attente, ton dernier tour finit sur « fini, rien en attente »,
    « Archiver cette session ? » et le bouton de réponse « Oui, archiver » (l'app ne propose pas le
    bouton d'app `archive`) ; sur ce clic, `archive_session` (`self`) ; refusé par l'app, dis-le ;
  - une tâche que tu proposes remonte au Lot : pose ta carte comme d'habitude, le panneau la lui
    transmet au lieu de la laisser dans ton transcript.

## 3. Suivre : le Lot est le seul à tout voir

- **Lire** : chaque fin de tour d'une sous-session arrive au Lot (le début de son compte rendu) ;
  `list_sessions` avec `linked: true` donne l'état de toutes (en cours, en attente, PR). Une note
  n'est pas une preuve : relire le diff et les tests de la branche avant de la dire prête.
- **Prendre des nouvelles** (#84) : L'utilisateur pilote depuis le Lot, jamais depuis les enfants. À
  chacun de ses messages, le panneau donne au Lot, sous « Roadmap — nouvelles de tes sessions
  enfants », une ligne par enfant qui coince ou qui est à archiver, et rien quand tout avance :
  - **attend la réponse de l'utilisateur** depuis 15 min : la lui rappeler en une ligne, avec le lien ;
  - **silencieuse** depuis 15 min (son étape, ou « état inconnu ») : lui écrire **une fois**
    (`SendMessage` à son id) « où en es-tu, qu'est-ce qui te bloque, de quoi as-tu besoin ? », puis
    dire à l'utilisateur qu'elle est relancée (sa réponse arrive à la fin de son tour) ; toujours au
    même point ensuite, muette ou non, le dire, sans relancer ;
  - **prête** (toutes ses étapes faites, pas encore fusionnée ou close) : § 5 et 6 ;
  - **à archiver** (§ 6).
  Pas de tableau de tous les enfants à chaque tour : le Lot ne regarde que ce qui coince.
- **Montrer l'état du lot en carte** (#95) à chaque point fait à l'utilisateur sur les branches, et
  quand il demande où en est le lot ou qui fusionne en premier. Le panneau la demande de lui-même
  (#97), une fois par état du lot, quand une branche enfant est prête ou que deux branches ou plus
  tournent : sa consigne arrive avec les nouvelles des enfants (ou sous « Roadmap — état de ton
  lot ») et dans le brief de Maestro ; la suivre avant le reste du point :
  1. écrire `lot.json` dans le scratchpad : `{"base": "main", "taches": [{"id", "titre",
     "branche", "tests": "verts" | "rouges" (absent : à lancer), "relue": true | false, "apres":
     [ids]}]}`, une tâche par sous-session, la branche lue par `list_sessions`, les tests et la
     relecture tirés des comptes rendus et de ton propre examen du diff, `apres` de la roadmap ;
  2. `python3 "<dossier de la skill>/scripts/etat_lot.py" <dépôt> <lot.json> --html --nom "<nom du
     Lot>"` : le script lit git en lecture seule (avance et retard face à `main`, fichiers touchés,
     conflits réels avec `main` et entre deux branches par `git merge-tree`) et range l'ordre de
     fusion du § 5 ;
  3. passer sa sortie, telle quelle, en `widget_code` à `show_widget` (outil `visualize`, appeler
     d'abord son `read_me` une fois dans la session), titre `etat_<nom du lot>` ; rien à ajouter
     dans la carte, le commentaire va dans le message ;
  4. sans `show_widget` (terminal, outil absent ou refusé), lancer la même commande avec `--texte`
     et coller sa sortie : le tableau Markdown, les fichiers partagés, l'ordre proposé.
  La carte donne une fiche par branche, dans l'ordre proposé : son état (prête, attend #N, tests
  rouges, à relire, à mettre à jour, conflit avec main…), son graphe face à `main` (ses commits et
  ceux arrivés sur `main` depuis son départ, auteur et âge, ceux de `main` qui causent le conflit
  surlignés, le départ commun), ses lignes `+/−`, et en pied « N conflits avec main » ou « Fusion
  propre » avec le bouton **Fusionner #N**, plus **Résoudre les conflits** quand il y en a ; puis
  les fichiers touchés par deux branches (la paire en conflit nommée) et l'ordre proposé. Le reste
  du tableau (attend une réponse, attend une ressource) se dit en une ligne sous la carte. Le
  script rend 2, et rien d'autre, sur un `lot.json` en double (même id ou même branche), un dépôt
  ou une base introuvables : corriger l'entrée, ne pas montrer de carte.
- **Débloquer d'abord** : ce qui empêche une sous-session d'avancer passe avant tout le reste. Le
  Lot répond lui-même, par message à la sous-session, à ce que le code, la roadmap ou les règles
  tranchent. Le reste va à l'utilisateur, une question à la fois, et sa réponse part mot pour mot.
  Avec le réglage de session `autonome` (skill `reglages-session`, en mode Code comme en mode
  Projet), le Lot répond aussi lui-même, par sa recommandation, à tout ce qui n'est ni une question
  d'architecture (un choix qui s'écrirait dans `docs/decisions.md`) ni un geste qui revient à
  l'utilisateur (lancer, archiver, un secret, un accès), et le dit en une ligne. Fusionner et
  publier ne lui reviennent pas : le Lot ne lui pose jamais « je fusionne ? » ni « je publie ? »
  (#105).
- **Un choix de maquette** (#96) : une sous-session qui « attend une réponse : choix de maquette,
  <chemin> » a écrit ses maquettes dans une page. Le Lot l'ouvre dans le volet navigateur
  (`preview_start` avec l'url `file://` de la page, dans le worktree de la sous-session), puis
  pose la question à l'utilisateur par le formulaire, une option par maquette, son aperçu (`preview`)
  et son compromis, la recommandation de la sous-session en premier ; sa réponse part mot pour
  mot. Le réglage `autonome` ne s'y applique pas : un choix visuel revient à l'utilisateur.
- **Les propositions des sous-sessions** : une carte New task (`own_initiative`) posée par une
  sous-session resterait dans son transcript, que l'utilisateur ne regarde pas. Le panneau la remonte au
  Lot : par message (« Tâche proposée par une session que tu as lancée… »), sinon au message suivant
  de l'utilisateur. Le Lot ouvre sa ligne (ou la rattache à une ligne qui la couvre), puis la propose à
  l'utilisateur depuis le Lot : carte `own_initiative`, titre `#<id> · <libellé court>`, brief complet et
  clause du Lot, puis lui dit en une ligne quelle session la propose et qu'il clique Start sur cette
  carte. Il ne la code pas, et la note dans le tableau du lot. La carte d'une session lancée depuis
  une sous-session remonte aussi : au premier ancêtre ouvert qui coordonne.

## 4. Les ressources uniques, le simulateur iOS d'abord

Simulateur iOS, appareil, base de données, déploiement, publication d'un plugin, compte de test :
une seule sous-session à la fois, et c'est le Lot qui donne la main. Avec le réglage `autonome`, il
la donne seul, sans demander à l'utilisateur, la publication comprise, et la sous-session publie
sans redemander (#105) ; sans le réglage, rien ne change.

1. La sous-session qui en a besoin le dit en tête de son compte rendu et termine son tour.
2. Le Lot donne la main à une seule, par message (« À toi le simulateur ; rends-le quand tu as
   fini »), dans l'ordre des priorités du § 5, et note dans le tableau qui la tient.
3. La sous-session teste sa branche, corrige elle-même ce que le test trouve, puis rend la main.
4. Le Lot la donne à la suivante.

Dans un projet à verrous (`verrou:` posé par l'onboarding), c'est le Lot qui pose le verrou sur la
ligne de la sous-session désignée, et le retire quand elle rend la main. Une sous-session ne prend
jamais une ressource sans la main du Lot, même si elle est libre.

## 5. Prioriser et fusionner

L'ordre des fusions, du premier critère au dernier :

1. **Prête** : tests verts sur sa branche, diff relu par le Lot, à jour de `main`.
2. **Prérequis d'abord** : ce qui débloque d'autres tâches (`après:`) passe devant.
3. **Ce qui libère** une ressource unique ou un fichier qu'une autre tâche attend.
4. **À égalité**, la plus petite, la moins exposée aux conflits.

La fusion elle-même :

- **Qui décide** : sans le réglage `autonome`, la fusion attend le clic de l'utilisateur. Le Lot la lui
  propose, une branche à la fois, par la boîte de fin (`wrap_up`, bouton « Fusionner #N ») ou par
  la carte du lot (§ 3) : son bouton envoie « Fusionne #N (branche …) », qui vaut ce clic. Le Lot
  revérifie la branche avant de fusionner ; un message qui ajoute « la carte la dit … » vient d'une
  branche pas prête : dire ce qui manque au lieu de fusionner. « Résous les conflits de #N avec
  main » est le cas où le Lot code (tableau du haut) : il résout dans la branche en gardant les deux
  intentions, rejoue ses tests, puis remontre la carte. Avec le
  réglage, le Lot fusionne seul une branche prête, et publie seul ce qui doit l'être (release d'un
  plugin, déploiement, push de `main`), sans attendre ni demander : le réglage est l'autorisation
  durable de l'utilisateur de fusionner et de publier. Il dit ensuite en une ligne ce qu'il a fait. « Relue » veut dire le diff lu par le Lot, qui ne l'a pas
  écrit. Lancer une session et archiver gardent toujours son clic.
- **Une branche à la fois**, sur `main` à jour, par la règle de fusion du projet (projets posés par
  l'onboarding : « Finir un chantier »). Jamais deux fusions en même
  temps.
- **Après chaque fusion** : rejouer les tests sur `main`, puis prévenir les sous-sessions dont la
  branche touche des fichiers voisins de la mettre à jour.
- **Un conflit** se résout en gardant les deux intentions ; une intention qui n'est pas claire se
  demande à la sous-session concernée.

## 6. Clore une tâche, puis le lot

- **Après la fusion**, le Lot coche la ligne (`fait:`, ce qui a été livré, la PR), la descend en
  tête de `ROADMAP-fait.md` et écrit son bilan à partir du dernier compte rendu de la sous-session.
- **La sous-session finie** : le panneau la vérifie (sa ligne close et ses commits dans sa branche
  de base, `main` sans elle, ou poussés, ou, sans ligne, sa branche fusionnée et sa liste d'étapes
  faite ; rien de non commité dans son worktree ; aucune question ; aucune session à elle ouverte ;
  en mode Projet, la ligne seule ; une session distante ne se vérifie pas d'ici) et la dit « à
  archiver ». Une session épinglée n'y paraît pas : `archive_session` la refuse. Le Lot propose de les archiver toutes d'un seul clic :
  boîte de fin avec « Archiver #A et #B ? » et un bouton de réponse « Archive-les » ; au clic,
  `archive_session` pour chacune, puis une ligne sur ce qui est archivé ou refusé. Seul le clic de
  l'utilisateur archive.
- **Le lot finit** quand toutes ses lignes sont cochées : boîte de fin (`wrap_up`) avec la question
  « Archiver cette session ? » et le bouton de réponse « Oui, archiver » en premier
  (`actions: [{"label": "Oui, archiver", "message": "Oui, archive cette session."}]` : l'app ne
  propose pas le bouton d'app `archive`). Sur ce clic, et sur lui seul, `archive_session` avec
  `session_id: "self"`.

## Ce que le panneau Roadmap fait pour le Lot

- Il reconnaît le Lot à son titre « Lot … », à ses sessions lancées encore ouvertes (au moins
  deux), ou à Maestro (titre « Maestro … », ou l'utilisateur y a dit « Maestro »).
- Il ne le met jamais « en cours » sur une tâche, et ne lui propose pas d'archiver quand le numéro
  de son titre se coche.
- Une ligne ouverte par le Lot lui rappelle de lancer sa session au lieu de la coder.
- Le ▶ lancé depuis le Lot met la clause du Lot dans le brief de la sous-session.
- La carte New task d'une sous-session, ou d'une session lancée par elle, ne reste pas chez elle :
  elle remonte au Lot (§ 3).
- Chaque sous-session note sa liste d'étapes, sa question en attente et son dernier récap ; à chaque
  message de l'utilisateur, le Lot reçoit les enfants qui coincent depuis 15 min et ceux à archiver
  (§ 3, « Prendre des nouvelles »).
- Une branche enfant prête, ou deux branches enfants ou plus en cours : il demande la carte de
  l'état du lot (§ 3), une fois par état, en mode Code seulement.
