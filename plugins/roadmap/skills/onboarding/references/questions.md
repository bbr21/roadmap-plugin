# The onboarding questions

Convention: text in « » is shown to the person as is, in French (question headers, option labels, questions); everything else is guidance for Claude, including what each option's description says, which Claude writes in French in the form. A « (recommandé) » inside a label is always shown; a condition in English after the label, like (recommended when …), means Claude adds « (recommandé) » to that label when the condition holds.

Asked with the multiple-choice question tool (AskUserQuestion), under these rules:

- four questions at most per round, each built on the answers of the previous round;
- two to four options that truly exclude each other; multiple choice only when they add up;
- each option says what it does and what it leaves aside, the trade-off in its description;
- the recommendation first, marked « (recommandé) », its reason in the description;
- never a mere « tu valides ? » nor an « Autre » option: the tool always lets the person write a
  free answer, and a written answer counts exactly as written;
- when the person asks a question or says they do not understand: the explanation is written as
  text in the message, the turn stops without a form, the question comes back after their answer.

Do not ask a question whose answer is already in the conversation or in the repository.

## Round 0: code or not (empty folder only)

Since #176 there is no mode to choose: `onboarding.py` reads the folder (a git repository that sees
code files: with code; anything else: without code). Ask only when the folder is empty or missing
and the request does not say it (« projet de code », « initialise ce repo »: `code: true`;
« gestion de projet », « sans code »: `code: false`).

1. **Code** (« Code »)
   - « Oui, du code » (recommended for an app, a tool, a plugin): the structure below, one worktree
     per session, merge, `check.mjs`, GitHub
   - « Non, sans code » (recommended for project management): a plain folder, git optional,
     complete tasks (due date, owner, parent, dependencies); then the « Projet » round at the end
     of this file, and nothing else

## What is taken from the request, without a question

- **nom**: the project's title (« Clipping »). Failing that, a free-text question.
- **dossier**: `~/Projects/<Nom>`, without spaces. Another location only if it is said.
- **resume**: one sentence that says what the project does, taken from the request; shown in the
  plan.
- **qui**: the first name in `me` in `~/.claude/roadmap-perso.json` (the one the Roadmap panel
  counts as « À moi »); without it, a free-text question: « Quel nom veux-tu dans tes roadmaps ? ».
- **cap**: one sentence if the request gives it; otherwise the template leaves « à écrire », and
  task `id:1` (write the vision) reminds of it.

## Round 1: the shape of the project

1. **Type** (« Type »): used to propose axes, tests and locks in round 2.
   - « App iOS et son service » (recommended when the request talks about iPhone)
   - « Service ou API web »
   - « App web »
   - « Outil ou script local »
2. **Deployment** (« Déploiement »)
   - « Chaque push sur `main` déploie (Coolify) »: `deploiement.mode = push`, `outil = Coolify`
   - « Par une commande »: `mode = commande`, the command asked next in free text
   - « Aucun pour l'instant »: `mode = aucun` (recommended for a local tool)
3. **GitHub** (« GitHub »)
   - « Dépôt privé `<compte>/<nom-en-minuscules>` (recommandé) »: created after approval, at the
     end; `<compte>` is what `gh api user --jq .login` returns
   - « Local seulement »: `github = ""`; no push in the rules
4. **Language** (« Langue »)
   - « Docs en français, code et commits en anglais (recommandé) »: `langue_code = anglais`
   - « Tout en français, sauf les identifiants »: `langue_code = français`
5. **Design system** (« Design »): the one every mockup will rely on (#129). For an existing
   project, first run `onboarding.py design <dossier>`: its `candidats` (a `design/`, the folder of
   a `.design-sync/config.json`, a document template) make the options.
   - « Déclarer celui qui est là » (recommended when a candidate exists): `design = [{"chemin": "design/", "pour": "…"}]`
   - « En poser un » (recommended for an app without a design system): a task `id:2` « Poser le
     design system » is added to the roadmap after the init, and `design` is declared once it exists
   - « S'en passer » (a tool without an interface): `design = "aucun"`, mockups no longer propose it

## Round 2: what depends on the type

Propose the type's values first (recommended), the others as options.

| Type | Axes | Tests | Locks | Extra secrets | Extra end-of-chantier steps |
|---|---|---|---|---|---|
| « App iOS et son service » | `produit`, `app-ios`, `service`, `dossier` | `ios/test.sh`, `cd service && npm test` | `deploiement`, `base`, `donnees-test`, `iphone-bbr` | `Secrets.swift`, `*.mobileprovision` | « Build TestFlight à chaque fois que l'app change » |
| « Service ou API web » | `produit`, `service`, `donnees`, `dossier` | `npm test` | `deploiement`, `base`, `donnees-test` | none | none |
| « App web » | `produit`, `app`, `service`, `dossier` | `npm test` | `deploiement`, `base` | none | none |
| « Outil ou script local » | `outil`, `dossier` | `npm test` or `python3 -m pytest` | none | none | none |

1. **Axes** (« Axes », multiple choice): the type's axes pre-checked as options; `dossier` is
   always added (the script enforces it), for what touches the repository itself.
2. **Locks** (« Verrous », multiple choice): the unique resources to reserve before touching them.
   What each one covers:
   - `deploiement`: « réglages du déploiement (app, variables, domaine, sauvegardes) »;
   - `base`: « une migration du schéma de la base »;
   - `donnees-test`: « tout envoi de données de test sur l'environnement partagé, et leur nettoyage »;
   - `iphone-bbr`: « ce qui s'installe sur l'iPhone de BBR (raccourcis, app de développement) »;
   - `secret`: « un changement de secret partagé ».
3. **Tests** (« Tests »): the type's command (recommended), another one, or « pas encore » (the
   command line will be added with the first test).
4. **Migrations** (« Migrations »), only if `base` is chosen: the migrations folder
   (`service/migrations`), which the start hook watches.

## Round 3: the history (existing project only)

Asked when the repository already has commits and its roadmap is born with the onboarding (no
closed task in `ROADMAP-fait.md`). A roadmap already kept is not rebuilt.

1. **History** (« Historique »): « Reconstituer la roadmap depuis l'historique du dépôt ? »
   - « Oui, les 6 derniers mois (recommandé) »: one done task per merged PR (or, without PRs, per
     merge, then per day of commits), one open task per open PR, each numbered and with its
     bilan; this is what immediately gives the panel and Maestro something to read
   - « Oui, tout l'historique »: complete, but a big repository gives hundreds of lines
   - « Non, partir de zéro »: only task `id:1` (write the vision)

## « Projet » round (without code only)

Instead of rounds 1 to 3. The name, the folder (spaces are allowed in it), the summary and the cap
are taken from the request as above; `qui` is the name of the person who leads (the first name in
`me` in `~/.claude/roadmap-perso.json`, otherwise asked), the one the panel counts as « À moi ».

1. **Axes** (« Axes », multiple choice): the project's main areas (« client », « interne »,
   « reporting »…); `dossier` is always added.
2. **Required fields** (« Champs »): on every open task.
   - « Tous (recommandé) »: `id`, `ouvert`, `due`, `resp`, `parent`, `après`; a task is born
     complete, the panel flags a line written without them
   - « Sans hiérarchie »: `id`, `ouvert`, `due`, `resp`; lighter, but neither tree nor dependencies
     guaranteed
3. **Keys** (« Clés »): the project's tags (those of a Notion, of a spreadsheet) become declared
   keys, each with its allowed values; the list is asked next in free text.
   - « Aucune pour l'instant » (recommended when they are not known): they are added later in
     `.claude/roadmap.json`
   - « Déclarer des clés maintenant »
4. **Git** (« Git »)
   - « Sans git » (recommended for a local folder kept by one person): nothing to install beyond
     python3
   - « Avec git »: the roadmap's history, and a possible GitHub repository; the panel commits
     closures on `main`
5. **Templates** (« Modèles »): the design system of a folder without code, what every mockup of a document,
   a table or a deck relies on (#129). `onboarding.py design <dossier>` gives the templates already
   there (`.potx`, `.dotx`, a deck stored in `modeles/` or `templates/`).
   - « Déclarer ces modèles » (recommended when there are some): `design = [{"chemin": "modeles/deck-qbr.pptx", "pour": "les decks de QBR"}]`,
     one entry per task type
   - « En poser plus tard »: nothing declared; the first mockup will offer to set some
   - « S'en passer »: `design = "aucun"`
6. **Project rules** (« Règles »): what the project declares so that the plugin's skills keep its
   roadmap its own way (#158). Skipped if the request says nothing about it and the folder has
   neither a rules file nor a writing tool.
   - « Les règles du plugin suffisent » (recommended for a new project): nothing declared; the
     `tasks` skill writes by itself, following `ROADMAP-REGLES.md` as set up from the template
     (to fill with the person later), and looks for the proof in the conversation
   - « Déclarer les règles du projet »: `regles` (only if its rules file lives elsewhere than
     `ROADMAP-REGLES.md` next to `ROADMAP.md`, which is always set up, #167), `ecriture`
     (`{"outil": "<script>", "consigne": "<comment l'appeler>"}` when the project writes its
     roadmap through its own tool) and `preuves` (the places to look for proof that a task is
     done, or `"#Preuves"`, a section of the rules file); the values are asked next in free text

## The answers, as JSON

Written in the session's scratchpad, then passed to `init --reponses`. The full template:
`python3 scripts/onboarding.py exemple` from the skill's folder.

| Key | Value |
|---|---|
| `nom`, `dossier`, `resume`, `cap`, `qui` | text; `dossier` without spaces |
| `axes` | list of lowercase names |
| `langue_code` | `anglais` or `français` |
| `tests` | list of `{"commande": "npm test", "quoi": "tests unitaires"}` |
| `deploiement` | `{"mode": "push", "outil": "Coolify", "verifier": "<commande>"}`; `mode` is `push`, `commande` (with `"commande"`) or `aucun` |
| `verrous` | list of `{"nom": "base", "couvre": "…"}` |
| `migrations` | migrations folder, or `""` |
| `env` | `true` if the project has a `.env` (not versioned, linked in each worktree) |
| `secrets` | file patterns in addition to `.env`, `*.pem`, `*.key`, `*.p8`, `*.p12` |
| `regles`, `ecriture`, `preuves` | what the project declares about its roadmap (#158): the path of its rules file when it is not `ROADMAP-REGLES.md` next to `ROADMAP.md` (#167: the template then goes there); `{"outil": "…", "consigne": "…"}`; a list of places (paths, or `source:requête` such as `gmail:in:sent`) or `"#<titre>"`. Absent: nothing declared. Written into `.claude/roadmap.json`, in both modes; whether they exist on disk is the doctor's job |
| `design` | list of `{"chemin": "design/", "pour": "…"}` (a string stands for its path; relative to the project, absolute or `https://`), or `"aucun"`; absent: nothing declared. Written into `.claude/roadmap.json`, in both modes |
| `fin_en_plus` | steps in addition to « Finir un chantier », one sentence each |
| `github` | `<compte>/<nom>` or `""` |
| `ignorer` | folders whose links `check.mjs` does not check: Markdown templates, like those of a plugin (`[]` by default) |
| `gitignore` | extra lines in `.gitignore`, for what the project's tooling produces (`[]` by default) |
| `roadmap` | `roadmap` (`roadmap/` folder, by default); `--manquants` keeps the root of a project that already keeps its own there |
| `code` | `true` or `false`; absent: read from the folder (refused for an empty folder). `mode` (`code`, `projet`) is still read, never written |

Without code (`python3 scripts/onboarding.py exemple --sans-code`): `code: false`, `nom`, `dossier`,
`resume`, `cap`, `qui`, `axes`, `roadmap`, and:

| Key | Value |
|---|---|
| `requis` | the keys required on every open task (default: `id`, `ouvert`, `due`, `resp`, `parent`, `après`); written with `requis_sur: "ouvertes"` (#176) |
| `cles` | `{"type": ["Réunion", "Email"], "client": []}`: declared keys and their allowed values (empty list: free) |
| `git` | `true` for a git repository (and `.gitignore`); `false` by default |
| `github` | `<compte>/<nom>`, only with `git` |
