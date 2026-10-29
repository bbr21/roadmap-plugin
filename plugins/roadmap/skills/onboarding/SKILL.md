---
name: onboarding
description: "Onboarde un projet dans le système roadmap, en mode Code ou Projet. Code, un dépôt : CLAUDE.md de règles, roadmap numérotée avec ses bilans, docs, check.mjs, hook de démarrage, worktree par session ; reconstitue au choix la roadmap depuis l'historique (PR, fusions ou commits) ; crée le dépôt GitHub privé après accord. Projet, de la gestion de projet sans code : dossier simple, git en option, tâches complètes, sans worktree, verrou ni fusion. Vérifie, passe le doctor ; remet un projet existant au format sans rien écraser. Importe une roadmap existante (Markdown, CSV, Notion) sans perdre de ligne. Déclenche sur « onboarding », « onboarde ce projet », « importe ma roadmap », « nouveau projet de code », « initialise ce repo », « mets ce projet au format », « reconstitue la roadmap depuis les PR », « onboarde ce dossier sans code », « Maestro dit qu'il n'y a pas de roadmap ». Pas pour le panneau seul (roadmap-panel), ni pour tenir la roadmap au quotidien, ni pour une roadmap tenue dans Cowork même."
---

# Onboarder un projet

Deux modes, choisis par projet dans `.claude/roadmap.json` : **Code** (un dépôt de code, tout ce
qui suit jusqu'à « Le mode Projet ») et **Projet** (de la gestion de projet sans code, section
« Le mode Projet » en fin de fichier). Le premier envoi de `references/questions.md` le demande,
sauf si la demande ou le dossier le disent.

## Ce que la skill garantit

Tous les projets de code partagent la même structure : les mêmes règles
de session, la même roadmap que lisent le panneau Roadmap et Maestro, les mêmes contrôles. Une
session qui ouvre l'un d'eux sait où tout se trouve sans le connaître d'avance. Ce qui est propre à
un projet (commandes de test, déploiement, verrous, axes, langue, secrets) vient des réponses aux
questions, et seulement d'elles.

La roadmap vit dans le dépôt, donc sur GitHub : un dossier `roadmap/` à la racine, avec
`ROADMAP.md` (tâches ouvertes), `ROADMAP-fait.md` (tâches closes) et `ROADMAP-bilans.csv` (le bilan
de chaque tâche close), que `.claude/roadmap.json` désigne au panneau. Un projet qui tient déjà sa
roadmap à sa racine la garde là : le script le voit et n'en pose pas une seconde.

Les modèles sont dans `references/modeles/`, les questions et le format des réponses dans
`references/questions.md`, et `scripts/onboarding.py` écrit, reconstitue et vérifie. Le script se
lance depuis le dossier de cette skill (le chemin donné au chargement de la skill) :

```bash
python3 "<dossier de la skill>/scripts/onboarding.py" init ~/Projects/Clipping --reponses <réponses.json>
```

Trois garanties, qu'on ne contourne pas :

- **Rien n'est écrasé.** `init` refuse un dossier qui contient déjà un fichier de la structure ;
  `--manquants` n'écrit que les absents.
- **Rien ne s'écrit avant la validation du plan**, une seule fois.
- **Le projet sort vert** de `node scripts/check.mjs`, de `verifier` et du doctor, ou la skill
  n'a pas fini.

## Le nom de l'utilisateur, d'abord

Dans l'un ou l'autre mode : lis `~/.claude/roadmap-perso.json`. Sans nom dans `me`, demande-le en
texte libre (« Quel nom veux-tu dans tes roadmaps ? »), puis écris-le dans `me` en gardant le reste
du fichier (`{"me": ["Alex"]}` s'il n'existe pas). C'est le nom que Claude emploie avec
l'utilisateur, la valeur de `qui` et celui que le panneau compte « À moi ». Le réglage « Tes noms
dans les roadmaps » du plugin, rempli, l'emporte.

## 1. Situer le projet

- Dossier absent ou vide : **nouveau projet**.
- Dossier qui a déjà du code ou des commits : **projet existant**. Commence par
  `verifier <dossier>` : « Conforme au format. » veut dire qu'il n'y a rien à poser, passe
  directement au doctor (étape 7).

## 2. Cadrer

Lis `references/questions.md` en entier. Prends dans la demande ce qu'elle dit (nom, dossier,
résumé, cap) et, pour un projet existant, dans le dépôt (README, `package.json`, dossiers,
`.gitignore`) : ne demande que le reste. Pose les envois de questions à choix de ce fichier, chacun
bâti sur les réponses du précédent. Pour un projet existant dont la roadmap naît maintenant, l'envoi
« Historique » en fait partie.

## 3. Montrer le plan, une fois

En un message : le dossier, la liste des fichiers posés (et, pour un projet existant, ce qui manque
aux fichiers déjà là), l'emplacement de la roadmap, les axes, les verrous, les commandes de test, le
déploiement, la règle de langue, GitHub, et l'historique retenu. Une question à choix : « Je pose
cette structure ? » (Oui (recommandé) / Changer quelque chose). Changement : refaire le plan, pas
tout le cadrage.

## 4. Écrire

1. Les réponses en JSON dans le scratchpad (format : `references/questions.md`, modèle complet par
   `python3 scripts/onboarding.py exemple`).
2. Nouveau projet : `init <dossier> --reponses <fichier>` crée le dépôt git sur `main` s'il manque
   et écrit tout. Projet existant : `init <dossier> --reponses <fichier> --manquants`, dans un
   worktree du projet si d'autres sessions y travaillent, sinon sur `main`. Les fichiers présents
   ne se remplacent jamais : une section qui leur manque s'ajoute à la main depuis le modèle rendu
   (pose-le dans un dossier vide du scratchpad avec `init`, puis recopie les sections), en gardant
   tout ce que le projet avait. `CLAUDE.md` reste sous 150 lignes : le détail part dans `docs/`.
3. Une roadmap existante (celle du projet sans `id:`, ou un autre fichier : checklist, CSV, export
   Notion, tableau Markdown) s'importe par le script, jamais à la main : voir « Importer une roadmap
   existante » plus bas.
4. Un `check.mjs` propre au projet se garde : compare-le au modèle et ajoute seulement ce qui lui
   manque (clés du panneau, `id:` uniques, secrets).

## 5. Reconstituer l'historique, si la réponse est oui

1. `historique <dossier> --mois 6` (sans `--mois` pour 6, un grand nombre pour tout) écrit en JSON
   ce que le dépôt raconte : les PR fusionnées et ouvertes si GitHub en a, sinon les fusions de la
   branche, sinon les commits groupés par jour. Range-le dans le scratchpad.
2. Complète chaque item, comme le dit sa `consigne` : `libelle` (verbe à l'infinitif + objet, court,
   tiré du titre et du résumé), `axe` (un des axes déclarés), `conclusion` (une ligne sur ce qui a
   été livré). Retire un item sans intérêt (montée de version, coquille). Un jour de commits qui
   mélange plusieurs sujets garde un libellé sur le principal.
   Sans PR ni fusion, il prend une tâche par commit (jusqu'à 200 sur la période, par jour au-delà ;
   `--par commit` ou `--par jour` l'impose) : un dépôt qui publie une version par commit garde une
   tâche par version.
3. `historique-ecrire <dossier> --lignes <fichier>` numérote les tâches de la plus ancienne à la
   plus récente, écrit les faites en tête de `ROADMAP-fait.md` (`src:` vers la PR ou le commit), leur
   bilan dans `ROADMAP-bilans.csv` (souci : reconstituée, sans bilan), et les PR ouvertes en tête de
   « Prochain » avec leur branche. Il refuse une roadmap qui porte déjà des tâches closes.

## 6. Vérifier et committer

1. Dans le dossier : `node scripts/check.mjs` (doit finir par « Tout est en ordre. »), puis
   `sh scripts/session-start.sh` (le hook affiche le prochain `id:`), puis
   `python3 "<dossier de la skill>/scripts/onboarding.py" verifier <dossier>` (« Conforme au
   format. »). Un échec se corrige avant d'aller plus loin.
2. Nouveau projet, premier commit : `git add -A && git commit -m "chore: project structure (onboarding)"`
   (message en français si la langue l'a voulu). C'est le seul moment où `git add -A` est permis
   dans le dossier principal : il n'y a encore aucune autre session. Projet existant : un commit qui
   ne prend que les fichiers posés ou touchés.

## 7. GitHub et doctor

1. Si les réponses ont un dépôt GitHub qui n'existe pas encore : une question à choix, « Je crée le
   dépôt privé `<compte>/<nom>` et j'y pousse `main` ? ». Sur le oui seulement :
   `gh repo create <compte>/<nom> --private --source <dossier> --push`. Sans `gh` connecté, donne la
   commande. Un dépôt déjà existant sous ce nom : ne pousse rien, demande. Projet existant déjà sur
   GitHub : pousse le commit de l'onboarding sur `main`, comme ses règles le disent.
2. Une roadmap importée ou déjà remplie : l'audit (étape 7 de « Importer une roadmap existante »)
   passe avant le doctor.
3. Lance le doctor (skill `doctor` de ce plugin) sur le dossier. Un KO qui tient à la machine
   (Superpowers absent, `gh` non connecté) se dit avec sa commande ; un KO qui tient au projet se
   corrige ici. En mode Projet, Superpowers absent n'est qu'À voir : il y est facultatif.

## 8. Rendre compte

Ce qui a été posé (dossier, emplacement de la roadmap, nombre de fichiers, tâches reconstituées,
GitHub, verdict du doctor), puis comment s'en servir :

- ouvrir le dossier dans Claude Code : le hook affiche les chantiers, les verrous et le prochain
  `id:` ; le panneau Roadmap trouve la roadmap et s'ouvre seul ;
- dire « Maestro » dans une session du projet : l'état d'avancement et ce qu'on peut lancer ;
- la première tâche ouverte, `id:1`, est d'écrire `docs/vision.md` avec l'utilisateur ;
- chaque chantier : sa ligne dans « En cours » sur `main`, puis `./scripts/new-session.sh feat/<slug> "<titre>"`
  (ou `--here` dans un worktree de l'app), `--plan` pour une spec.

## Le mode Projet

Pour un projet sans code : les tâches passent par les connecteurs de la session (messagerie,
agenda, documents), et ni worktree, ni verrou, ni fusion n'ont de sens. Le panneau s'y ouvre par
échéance, chaque tâche porte ses champs exigés, et une session lancée par ▶ travaille dans le
dossier même.

1. **Cadrer** : l'envoi « Mode », puis l'envoi « Projet » de `references/questions.md`. Le dossier
   peut contenir des espaces ; `qui` est le nom de la personne qui pilote.
2. **Montrer le plan**, une fois : le dossier, les fichiers posés (`CLAUDE.md`, la roadmap et ses
   bilans, `.claude/roadmap.json`, `.gitignore` avec git), les axes, les champs exigés, les clés
   déclarées, git ou non.
3. **Écrire** : les réponses (modèle : `python3 scripts/onboarding.py exemple --mode projet`), puis
   `init <dossier> --reponses <fichier>`, ou `--manquants` pour un dossier existant (il ne pose que
   ce qui manque, `.claude/roadmap.json` compris, et garde une roadmap tenue à la racine). Une
   roadmap déjà tenue (dans le dossier ou ailleurs) s'importe : « Importer une roadmap existante ».
4. **Pas d'historique** : `historique` refuse un dossier en mode Projet.
5. **Vérifier** : `verifier <dossier>` (« Conforme au format. »). Avec git, un premier commit des
   seuls fichiers posés. Pas de `check.mjs` : le panneau contrôle chaque ligne écrite.
6. **Doctor** (skill `doctor`) : il lit le mode et passe la checklist du mode Projet.
7. **Rendre compte** : ce qui a été posé, puis comment s'en servir : ouvrir le dossier dans
   l'onglet Code, le panneau par échéance (le bouton passe au responsable et à l'arbre), ▶ sur une
   tâche, « Maestro » pour ce qu'on peut lancer ; la tâche `id:1` liste les tâches en cours.

## Importer une roadmap existante

Quand la personne a déjà une roadmap : le `ROADMAP.md` du dossier, ou un autre fichier (checklist
Markdown, CSV, export Notion en CSV ou en Markdown, tableau Markdown). On repart d'elle, sans perdre
une ligne. L'original n'est jamais modifié sans sa copie de sauvegarde.

1. **Poser la structure** d'abord (`init … --manquants`) : `.claude/roadmap.json` porte le mode, `me`
   et les champs exigés que l'analyse lit.
2. **Analyser** : `analyser <fichier> --dossier <dossier> [--fait <ROADMAP-fait.md>] > <scratchpad>/analyse.json`.
3. **Montrer l'analyse** en un message, puis un formulaire à choix sur ce qui se décide : le format
   reconnu, les comptes (ouvertes, closes, à numéroter), la correspondance (colonne → champ, statut →
   section ou close, tags → axe ou clé déclarée, `prio` en mots → 1, 2, 3, sous-titres → `projet` et
   `dept`), les valeurs non reconnues, les champs exigés qui manquent et les valeurs par défaut
   proposées pour eux. Une ligne illisible se corrige dans la source avant d'aller plus loin. Un choix
   qui se voit (la mise en page de la roadmap) passe par des maquettes.
4. **Corriger** la `correspondance` du JSON selon les réponses (une valeur par défaut refusée s'en
   retire : la ligne restera signalée par le panneau).
5. **Importer** : `importer <dossier> --analyse <scratchpad>/analyse.json`. Le script refuse, sans rien
   écrire, si une ligne se perd, si un libellé change ou si deux tâches partagent un `id:`. Sinon il
   copie les originaux dans `sauvegarde-import-…/` à côté de la roadmap, écrit, et affiche le bilan
   avant/après : le montrer tel quel.
6. **Vérifier** : `verifier <dossier>` (« Conforme au format. »). La sauvegarde ne se committe pas ;
   la proposer à la suppression une fois la roadmap relue.
7. **Auditer** : l'import ne touche pas aux libellés. Une question à choix, « Je lance l'audit de la
   roadmap ? » (Oui (recommandé) / Plus tard) ; oui → skill `audit` de ce plugin, qui propose de
   découper les paquets en sous-tâches, les dépendances, les doublons et les trous, et n'écrit
   qu'après validation.

## Ce que la skill ne fait pas

- Elle ne remplace pas les règles du projet : une fois posé, le projet vit par son `CLAUDE.md`.
- Elle ne touche pas à une roadmap déclarée dans `~/.claude/roadmap-perso.json` (`roadmap-panel`).
- Elle ne découpe aucun libellé : c'est l'audit (skill `audit`), proposé en fin d'import.
- Elle n'écrit aucun secret : `.env.example` ne porte que des noms de variables.
- Elle n'installe aucun plugin : le doctor dit ce qui manque et la commande pour l'ajouter.
