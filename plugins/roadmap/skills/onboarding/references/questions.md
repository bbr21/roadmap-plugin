# Les questions de l'onboarding

Posées par l'outil de questions à choix (AskUserQuestion), selon ces règles :

- quatre questions au plus par envoi, chacune bâtie sur les réponses de l'envoi précédent ;
- deux à quatre options qui s'excluent vraiment ; choix multiple seulement quand elles se cumulent ;
- chaque option dit ce qu'elle fait et ce qu'elle laisse de côté, le compromis dans sa description ;
- la recommandation en premier, marquée « (recommandé) », sa raison dans la description ;
- jamais de simple « tu valides ? » ni d'option « Autre » : l'outil laisse toujours écrire une
  réponse libre, et une réponse écrite fait foi telle qu'elle est écrite ;
- quand la personne pose une question ou dit qu'elle ne comprend pas : l'explication s'écrit en
  texte dans le message, le tour s'arrête sans formulaire, la question revient après sa réponse.

Ne pas poser une question dont la réponse est déjà dans la conversation ou dans le dépôt.

## Envoi 0 : le mode

Une seule question, sauf si la demande le dit (« projet de code », « gestion de projet », « sans
code ») ou si le dossier le montre (du code, des commits : Code ; des notes, des documents, une
roadmap d'un dossier Cowork : Projet).

1. **Mode** (« Mode »)
   - Code (recommandé pour un dépôt de code) : la structure ci-dessous, worktree par session,
     fusion, `check.mjs`, GitHub
   - Projet (recommandé pour de la gestion de projet sans code) : un dossier simple, git en option,
     des tâches complètes (échéance, responsable, parent, dépendances) ; puis l'envoi « Projet »
     à la fin de ce fichier, et rien d'autre

## Ce qui se prend dans la demande, sans question

- **nom** : le titre du projet (« Clipping »). À défaut, une question en texte libre.
- **dossier** : `~/Projects/<Nom>`, sans espace. Un autre emplacement seulement s'il est dit.
- **resume** : une phrase qui dit ce que fait le projet, tirée de la demande ; montrée dans le plan.
- **qui** : le premier nom de `me` dans `~/.claude/roadmap-perso.json` (celui que le panneau Roadmap
  compte « À moi ») ; sans lui, une question en texte libre : « Quel nom veux-tu dans tes roadmaps ? ».
- **cap** : une phrase si la demande la donne ; sinon le modèle laisse « à écrire », et la tâche
  `id:1` (écrire la vision) le rappelle.

## Envoi 1 : la forme du projet

1. **Type** (« Type ») : sert à proposer axes, tests et verrous à l'envoi 2.
   - App iOS et son service (recommandé quand la demande parle d'iPhone)
   - Service ou API web
   - App web
   - Outil ou script local
2. **Déploiement** (« Déploiement »)
   - Chaque push sur `main` déploie (Coolify) : `deploiement.mode = push`, `outil = Coolify`
   - Par une commande : `mode = commande`, la commande demandée ensuite en texte libre
   - Aucun pour l'instant : `mode = aucun` (recommandé pour un outil local)
3. **GitHub** (« GitHub »)
   - Dépôt privé `<compte>/<nom-en-minuscules>` (recommandé) : créé après accord, à la fin ; `<compte>`
     est celui que `gh api user --jq .login` renvoie
   - Local seulement : `github = ""` ; pas de push dans les règles
4. **Langue** (« Langue »)
   - Docs en français, code et commits en anglais (recommandé) : `langue_code = anglais`
   - Tout en français, sauf les identifiants : `langue_code = français`
5. **Design system** (« Design ») : celui sur lequel s'appuiera toute maquette (#129). Pour un
   projet existant, lancer d'abord `onboarding.py design <dossier>` : ses `candidats` (un
   `design/`, le dossier d'un `.design-sync/config.json`, un modèle de document) font les options.
   - Déclarer celui qui est là (recommandé quand un candidat existe) : `design = [{"chemin": "design/", "pour": "…"}]`
   - En poser un (recommandé pour une app sans design system) : une tâche `id:2` « Poser le design
     system » s'ajoute à la roadmap après l'init, et `design` se déclare quand il existe
   - S'en passer (un outil sans interface) : `design = "aucun"`, les maquettes ne le proposent plus

## Envoi 2 : ce qui dépend du type

Proposer les valeurs du type en premier (recommandé), les autres en options.

| Type | Axes | Tests | Verrous | Secrets en plus | Fin de chantier en plus |
|---|---|---|---|---|---|
| App iOS et son service | `produit`, `app-ios`, `service`, `dossier` | `ios/test.sh`, `cd service && npm test` | `deploiement`, `base`, `donnees-test`, `iphone-bbr` | `Secrets.swift`, `*.mobileprovision` | Build TestFlight à chaque fois que l'app change |
| Service ou API web | `produit`, `service`, `donnees`, `dossier` | `npm test` | `deploiement`, `base`, `donnees-test` | aucun | aucune |
| App web | `produit`, `app`, `service`, `dossier` | `npm test` | `deploiement`, `base` | aucun | aucune |
| Outil ou script local | `outil`, `dossier` | `npm test` ou `python3 -m pytest` | aucun | aucun | aucune |

1. **Axes** (« Axes », choix multiple) : les axes du type cochés d'avance en options ; `dossier`
   s'ajoute toujours (le script l'impose), pour ce qui touche le dépôt lui-même.
2. **Verrous** (« Verrous », choix multiple) : les ressources uniques à réserver avant d'y toucher.
   Ce que couvre chacun :
   - `deploiement` : réglages du déploiement (app, variables, domaine, sauvegardes) ;
   - `base` : une migration du schéma de la base ;
   - `donnees-test` : tout envoi de données de test sur l'environnement partagé, et leur nettoyage ;
   - `iphone-bbr` : ce qui s'installe sur l'iPhone de BBR (raccourcis, app de développement) ;
   - `secret` : un changement de secret partagé.
3. **Tests** (« Tests ») : la commande du type (recommandé), une autre, ou « pas encore » (la
   ligne de commande s'ajoutera avec le premier test).
4. **Migrations** (« Migrations »), seulement si `base` est retenu : le dossier des migrations
   (`service/migrations`), que le hook de démarrage surveille.

## Envoi 3 : l'historique (projet existant seulement)

Posé quand le dépôt a déjà des commits et que sa roadmap naît avec l'onboarding (aucune tâche
close dans `ROADMAP-fait.md`). Une roadmap déjà tenue ne se reconstitue pas.

1. **Historique** (« Historique ») : « Reconstituer la roadmap depuis l'historique du dépôt ? »
   - Oui, les 6 derniers mois (recommandé) : une tâche faite par PR fusionnée (ou, sans PR, par
     fusion, puis par jour de commits), une tâche ouverte par PR ouverte, chacune numérotée et
     avec son bilan ; c'est ce qui donne tout de suite de quoi lire au panneau et à Maestro
   - Oui, tout l'historique : complet, mais un gros dépôt donne des centaines de lignes
   - Non, partir de zéro : seule la tâche `id:1` (écrire la vision)

## Envoi « Projet » (mode Projet seulement)

À la place des envois 1 à 3. Le nom, le dossier (les espaces y sont permis), le résumé et le cap
se prennent dans la demande comme plus haut ; `qui` est le nom de la personne qui pilote (le
premier nom de `me` dans `~/.claude/roadmap-perso.json`, sinon demandé), celui que le panneau compte
« À moi ».

1. **Axes** (« Axes », choix multiple) : les grands domaines du projet (client, interne,
   reporting…) ; `dossier` s'ajoute toujours.
2. **Champs exigés** (« Champs ») : sur chaque tâche ouverte.
   - Tous (recommandé) : `id`, `ouvert`, `due`, `resp`, `parent`, `après` ; une tâche naît
     complète, le panneau signale une ligne écrite sans eux
   - Sans hiérarchie : `id`, `ouvert`, `due`, `resp` ; plus léger, mais ni arbre ni dépendances
     garantis
3. **Clés** (« Clés ») : les tags du projet (ceux d'un Notion, d'un tableur) deviennent des clés
   déclarées, chacune avec ses valeurs admises ; la liste se demande ensuite en texte libre.
   - Aucune pour l'instant (recommandé quand on ne les connaît pas) : elles s'ajoutent plus tard
     dans `.claude/roadmap.json`
   - Déclarer des clés maintenant
4. **Git** (« Git »)
   - Sans git (recommandé pour un dossier local tenu par une personne) : rien à installer en plus
     de python3
   - Avec git : l'historique de la roadmap, et un dépôt GitHub possible ; le panneau committe
     les clôtures sur `main`
5. **Modèles** (« Modèles ») : le design system du mode Projet, ce sur quoi s'appuie toute
   maquette d'un document, d'un tableau ou d'un deck (#129). `onboarding.py design <dossier>`
   donne les modèles déjà là (`.potx`, `.dotx`, un deck rangé dans `modeles/` ou `templates/`).
   - Déclarer ces modèles (recommandé quand il y en a) : `design = [{"chemin": "modeles/deck-qbr.pptx", "pour": "les decks de QBR"}]`,
     une entrée par type de tâche
   - En poser plus tard : rien de déclaré ; la première maquette proposera d'en poser
   - S'en passer : `design = "aucun"`
6. **Règles du projet** (« Règles ») : ce que le projet déclare pour que les skills du plugin
   tiennent sa roadmap à sa façon (#158). Sautée si la demande n'en dit rien et que le dossier n'a
   ni fichier de règles ni outil d'écriture.
   - Les règles du plugin suffisent (recommandé pour un projet neuf) : rien de déclaré ; la skill
     `tasks` écrit elle-même et cherche la preuve dans la conversation
   - Déclarer les règles du projet : `regles` (le fichier de ses règles, qui l'emportent), `ecriture`
     (`{"outil": "<script>", "consigne": "<comment l'appeler>"}` quand le projet écrit sa roadmap
     par son propre outil) et `preuves` (les lieux où chercher qu'une tâche est faite, ou
     `"#Preuves"`, une section du fichier de règles) ; les valeurs se demandent ensuite en texte libre

## Les réponses, en JSON

Écrites dans le scratchpad de la session, puis passées à `init --reponses`. Le modèle complet :
`python3 scripts/onboarding.py exemple` depuis le dossier de la skill.

| Clé | Valeur |
|---|---|
| `nom`, `dossier`, `resume`, `cap`, `qui` | textes ; `dossier` sans espace |
| `axes` | liste de noms en minuscules |
| `langue_code` | `anglais` ou `français` |
| `tests` | liste de `{"commande": "npm test", "quoi": "tests unitaires"}` |
| `deploiement` | `{"mode": "push", "outil": "Coolify", "verifier": "<commande>"}` ; `mode` vaut `push`, `commande` (avec `"commande"`) ou `aucun` |
| `verrous` | liste de `{"nom": "base", "couvre": "…"}` |
| `migrations` | dossier des migrations, ou `""` |
| `env` | `true` si le projet a un `.env` (non versionné, relié dans chaque worktree) |
| `secrets` | motifs de fichiers en plus de `.env`, `*.pem`, `*.key`, `*.p8`, `*.p12` |
| `regles`, `ecriture`, `preuves` | ce que le projet déclare sur sa roadmap (#158) : le chemin de son fichier de règles ; `{"outil": "…", "consigne": "…"}` ; une liste de lieux (chemins, ou `source:requête` comme `gmail:in:sent`) ou `"#<titre>"`. Absents : rien de déclaré. Écrits dans `.claude/roadmap.json`, dans les deux modes ; leur présence sur le disque, c'est le doctor |
| `design` | liste de `{"chemin": "design/", "pour": "…"}` (une chaîne vaut son chemin ; relatif au projet, absolu ou `https://`), ou `"aucun"` ; absent : rien de déclaré. Écrit dans `.claude/roadmap.json`, dans les deux modes |
| `fin_en_plus` | étapes en plus de « Finir un chantier », une phrase chacune |
| `github` | `<compte>/<nom>` ou `""` |
| `ignorer` | dossiers dont `check.mjs` ne contrôle pas les liens : des modèles Markdown, comme ceux d'un plugin (`[]` par défaut) |
| `gitignore` | lignes en plus dans `.gitignore`, pour ce que l'outillage du projet produit (`[]` par défaut) |
| `roadmap` | `roadmap` (dossier `roadmap/`, par défaut) ; `--manquants` garde la racine d'un projet qui y tient déjà la sienne |
| `mode` | `code` (par défaut) ou `projet` |

En mode Projet (`python3 scripts/onboarding.py exemple --mode projet`) : `mode`, `nom`, `dossier`,
`resume`, `cap`, `qui`, `axes`, `roadmap`, et :

| Clé | Valeur |
|---|---|
| `requis` | les clés exigées sur chaque tâche ouverte (défaut : `id`, `ouvert`, `due`, `resp`, `parent`, `après`) |
| `cles` | `{"type": ["Réunion", "Email"], "client": []}` : clés déclarées et leurs valeurs admises (liste vide : libre) |
| `git` | `true` pour un dépôt git (et `.gitignore`) ; `false` par défaut |
| `github` | `<compte>/<nom>`, seulement avec `git` |
