---
name: onboarding
description: "Onboards a project into the roadmap system, with or without code (one mode since #176: the folder says which). With code, a repository: CLAUDE.md of rules, numbered roadmap with its bilans, docs, check.mjs, start hook, a worktree per session; optionally rebuilds the roadmap from history (PRs, merges or commits); creates the private GitHub repository once approved. Without code, project management: plain folder, git optional, complete tasks, no worktree, lock or merge. Checks, runs the doctor; brings an existing project to the format, overwriting nothing. Imports an existing roadmap (Markdown, CSV, Notion), losing no line. Triggers on « onboarding », « onboarde ce projet », « importe ma roadmap », « nouveau projet de code », « initialise ce repo », « mets ce projet au format », « reconstitue la roadmap depuis les PR », « onboarde ce dossier sans code », « Maestro dit qu'il n'y a pas de roadmap ». Not for the panel alone (roadmap-panel), nor day-to-day roadmap upkeep, nor a roadmap kept in Cowork itself."
---

# Onboard a project

The person speaks French: talk to them in French, ask the questions in French, and write the
roadmap and task labels in French; the files set up keep the language of their templates and of
the « Langue » answer. Only this skill is in English.

One mode since #176. What the project is comes from its folder, never from a question: a git
repository that sees code files gets the code structure (everything that follows up to "Without
code"); any other folder gets the structure of project management without code (section "Without
code" at the end of the file). `onboarding.py` reads it itself (`code` of the answers, else the
folder's content). Only an empty or missing folder needs the answer: take it from the request
(« nouveau projet de code », « initialise ce repo »: `code: true`; « gestion de projet », « sans
code »: `code: false`), else round 0 of `references/questions.md`. Nothing about it is written to
`.claude/roadmap.json`: the panel and the other skills read the same folder. `mode` (`code` or
`projet`) is written by hand only to force a wrong detection.

## What the skill guarantees

All code projects share the same structure: the same session rules, the same roadmap read by the
Roadmap panel and Maestro, the same checks. A session that opens one of them knows where
everything is without knowing it beforehand. What is specific to a project (test commands,
deployment, locks, axes, language, secrets) comes from the answers to the questions, and only from
them.

The roadmap lives in the repository, hence on GitHub: a `roadmap/` folder at the root, with
`ROADMAP.md` (open tasks), `ROADMAP-fait.md` (closed tasks), `ROADMAP-bilans.csv` (the bilan of
each closed task) and `ROADMAP-REGLES.md` (#167: what becomes a task, what never does, the
project's rules, where to find proof; set from the template, with or without code, then filled with the
person), which `.claude/roadmap.json` points the panel to. A project onboarded before #167 gets
its rules file with `onboarding.py regles <dossier>`. A project that already keeps
its roadmap at its root keeps it there: the script sees it and does not set up a second one.

The templates are in `references/modeles/`, the questions and the answer format in
`references/questions.md`, and `scripts/onboarding.py` writes, rebuilds and checks. The script is
run from this skill's folder (the path given when the skill loads):

```bash
python3 "<dossier de la skill>/scripts/onboarding.py" init ~/Projects/Clipping --reponses <réponses.json>
```

Three guarantees, never bypassed:

- **Nothing is overwritten.** `init` refuses a folder that already contains a file of the
  structure; `--manquants` writes only the missing ones.
- **Nothing is written before the plan is approved**, once.
- **The project comes out green** from `node scripts/check.mjs`, from `verifier` and from the
  doctor, or the skill is not done.

## The user's name, first

In every project: read `~/.claude/roadmap-perso.json`. Without a name in `me`, ask for it in free
text (« Quel nom veux-tu dans tes roadmaps ? »), then write it into `me`, keeping the rest of the
file (`{"me": ["Alex"]}` if it does not exist). It is the name Claude uses with the user, the
value of `qui` and the one the panel counts as « À moi ». The plugin setting
« Tes noms dans les roadmaps », when filled in, wins.

## 1. Place the project

- Folder missing or empty: **new project**.
- Folder that already has code or commits: **existing project**. Start with
  `verifier <dossier>`: « Conforme au format. » means there is nothing to set up, go straight to
  the doctor (step 7).

## 2. Scope

Read `references/questions.md` in full. Take from the request what it says (name, folder, summary,
cap) and, for an existing project, from the repository (README, `package.json`, folders,
`.gitignore`): ask only for the rest. Send the multiple-choice question rounds of that file, each
built on the answers to the previous one. For an existing project whose roadmap is born now, the
« Historique » round is one of them.

## 3. Show the plan, once

In one message: the folder, the list of files set up (and, for an existing project, what the
files already there are missing), the roadmap location, the axes, the locks, the test commands,
the deployment, the language rule, GitHub, and the history chosen. One multiple-choice question:
« Je pose cette structure ? » (« Oui (recommandé) » / « Changer quelque chose »). A change: redo
the plan, not the whole scoping.

## 4. Write

1. The answers as JSON in the scratchpad (format: `references/questions.md`, full template from
   `python3 scripts/onboarding.py exemple`).
2. New project: `init <dossier> --reponses <fichier>` creates the git repository on `main` if it
   is missing and writes everything. Existing project: `init <dossier> --reponses <fichier> --manquants`,
   in a worktree of the project if other sessions work in it, otherwise on `main`. Files already
   present are never replaced: a section they lack is added by hand from the rendered template
   (render it into an empty scratchpad folder with `init`, then copy the sections over), keeping
   everything the project had. `CLAUDE.md` stays under 150 lines: the detail goes into `docs/`.
3. An existing roadmap (the project's one without `id:`, or another file: checklist, CSV, Notion
   export, Markdown table) is imported by the script, never by hand: see "Import an existing
   roadmap" below.
4. A project-specific `check.mjs` is kept: compare it with the template and add only what it
   lacks (panel keys, unique `id:`, secrets).

## 5. Rebuild the history, if the answer is yes

1. `historique <dossier> --mois 6` (without `--mois` for 6, a large number for everything) writes
   as JSON what the repository tells: the merged and open PRs if GitHub has any, otherwise the
   merges of the branch, otherwise the commits grouped by day. Store it in the scratchpad.
2. Complete each item, as its `consigne` says: `libelle` (French verb in the infinitive + object,
   short, taken from the title and summary), `axe` (one of the declared axes), `conclusion` (one
   line on what was delivered). Remove an item of no interest (version bump, typo). A day of
   commits that mixes several subjects keeps a label on the main one.
   Without PRs or merges, it takes one task per commit (up to 200 over the period, per day beyond
   that; `--par commit` or `--par jour` forces it): a repository that publishes one version per
   commit keeps one task per version.
3. `historique-ecrire <dossier> --lignes <fichier>` numbers the tasks from oldest to newest,
   writes the done ones at the top of `ROADMAP-fait.md` (`src:` to the PR or the commit), their
   bilan in `ROADMAP-bilans.csv` (souci: « reconstituée, sans bilan »), and the open PRs at the top
   of « Prochain » with their branch. It refuses a roadmap that already holds closed tasks.

## 6. Check and commit

1. In the folder: `node scripts/check.mjs` (must end with « Tout est en ordre. »), then
   `sh scripts/session-start.sh` (the hook shows the next `id:`), then
   `python3 "<dossier de la skill>/scripts/onboarding.py" verifier <dossier>` (« Conforme au
   format. »). A failure is fixed before going further.
2. New project, first commit: `git add -A && git commit -m "chore: project structure (onboarding)"`
   (message in French if the language answer asked for it). It is the only time `git add -A` is
   allowed in the main checkout: there is no other session yet. Existing project: a commit that
   takes only the files set up or touched.

## 7. GitHub and doctor

1. If the answers have a GitHub repository that does not exist yet: one multiple-choice question,
   « Je crée le dépôt privé `<compte>/<nom>` et j'y pousse `main` ? ». On yes only:
   `gh repo create <compte>/<nom> --private --source <dossier> --push`. Without `gh` signed in,
   give the command. A repository that already exists under that name: push nothing, ask. An
   existing project already on GitHub: push the onboarding commit to `main`, as its rules say.
2. An imported or already filled roadmap: the audit (step 7 of "Import an existing roadmap") comes
   before the doctor.
3. **Design system** (#129): every mockup of the project relies on the one declared by `design` in
   `.claude/roadmap.json`. The « Design » answer of round 1 set it at `init`. For a project already
   onboarded, `python3 "<dossier de la skill>/scripts/onboarding.py" design <dossier>` gives the
   declaration and the candidates (a `design/`, a `.design-sync/config.json`, a document template);
   `design <dossier> --poser '<JSON>'` writes the field without touching the rest of the file.
   Neither declared nor refused (`"aucun"`): offer to set one, with a multiple-choice question
   (« Je déclare `design/` ? », « J'ouvre la tâche « Poser le design system » ? », « S'en passer »).
4. Run the doctor (this plugin's `doctor` skill) on the folder. A KO due to the machine
   (Superpowers missing, `gh` not signed in) is reported with its command; a KO due to the project
   is fixed here. Without code, Superpowers missing is only « À voir »: it is optional there.

## 8. Report

What was set up (folder, roadmap location, number of files, rebuilt tasks, GitHub, doctor
verdict), then how to use it:

- open the folder in Claude Code: the hook shows the chantiers, the locks and the next `id:`; the
  Roadmap panel finds the roadmap and opens by itself;
- say « Maestro » in a session of the project: the progress status and what can be launched;
- the first open task, `id:1`, is to write `docs/vision.md` with the user;
- each chantier: its line in « En cours » on `main`, then `./scripts/new-session.sh feat/<slug> "<titre>"`
  (or `--here` in an app worktree), `--plan` for a spec.

## Without code

For a project without code: tasks go through the session's connectors (mail, calendar,
documents), and neither worktree, nor lock, nor merge makes sense. The panel opens there by due
date, each task carries its required fields, and a session launched by ▶ works in the folder
itself.

1. **Scope**: the « Projet » round of `references/questions.md` (round 0 only for an empty folder). The
   folder may contain spaces; `qui` is the name of the person who leads.
2. **Show the plan**, once: the folder, the files set up (`CLAUDE.md`, the roadmap and its bilans,
   `.claude/roadmap.json`, `.gitignore` with git), the axes, the required fields, the declared
   keys, git or not.
3. **Write**: the answers (template: `python3 scripts/onboarding.py exemple --sans-code`), then
   `init <dossier> --reponses <fichier>`, or `--manquants` for an existing folder (it sets up only
   what is missing, `.claude/roadmap.json` included, and keeps a roadmap kept at the root). A
   roadmap already kept (in the folder or elsewhere) is imported: "Import an existing roadmap".
4. **No history**: `historique` refuses a folder without code.
5. **Check**: `verifier <dossier>` (« Conforme au format. »). With git, a first commit of only the
   files set up. No `check.mjs`: the panel checks each line written.
6. **Templates** (#129): the « Modèles » answer declares the document or deck templates, one per
   task type, in `design`; then `onboarding.py design <dossier> [--poser …]` as with code
   (step 7.3).
7. **Doctor** (`doctor` skill): it sees a folder without code and runs that checklist; its « Travail » line says what it saw.
8. **Report**: what was set up, then how to use it: open the folder in the Code tab, the panel by
   due date (the button switches to owner and to tree), ▶ on a task, « Maestro » for what can be
   launched; task `id:1` lists the tasks in progress; day to day, the `tasks` skill adds, updates,
   reschedules, marks done and drops a task (it reads `ROADMAP-REGLES.md` on every pass, and
   `ecriture` and `preuves`, set by the « Règles » answer).

## Import an existing roadmap (« Importer une roadmap existante »)

When the person already has a roadmap: the folder's `ROADMAP.md`, or another file (Markdown
checklist, CSV, Notion export as CSV or Markdown, Markdown table). We start from it, without
losing a line. The original is never modified without its backup copy.

1. **Set up the structure** first (`init … --manquants`): `.claude/roadmap.json` carries `me`
   and the required fields (`requis`, `requis_sur`) the analysis reads.
2. **Analyse**: `analyser <fichier> --dossier <dossier> [--fait <ROADMAP-fait.md>] > <scratchpad>/analyse.json`.
3. **Show the analysis** in one message, then a multiple-choice form on what needs deciding: the
   format recognised, the counts (open, closed, to number), the mapping (column → field, status →
   section or closed, tags → axis or declared key, `prio` in words → 1, 2, 3, subheadings →
   `projet` and `dept`), the unrecognised values, the missing required fields and the default
   values proposed for them. An unreadable line is fixed in the source before going further. A
   visible choice (the roadmap's layout) goes through mockups.
4. **Correct** the JSON's `correspondance` according to the answers (a refused default value is
   removed from it: the line will stay flagged by the panel).
5. **Import**: `importer <dossier> --analyse <scratchpad>/analyse.json`. The script refuses,
   writing nothing, if a line gets lost, if a label changes or if two tasks share an `id:`.
   Otherwise it copies the originals into `sauvegarde-import-…/` next to the roadmap, writes, and
   prints the before/after summary: show it as is.
6. **Check**: `verifier <dossier>` (« Conforme au format. »). The backup is not committed; offer
   to delete it once the roadmap has been reread.
7. **Audit**: the import does not touch labels. One multiple-choice question, « Je lance l'audit
   de la roadmap ? » (« Oui (recommandé) » / « Plus tard »); yes → this plugin's `audit` skill,
   which proposes splitting bundles into subtasks, dependencies, duplicates and gaps, and writes
   only after approval.

## What the skill does not do

- It does not replace the project's rules: once set up, the project lives by its `CLAUDE.md`.
- It does not touch a roadmap declared in `~/.claude/roadmap-perso.json` (`roadmap-panel`).
- It splits no label: that is the audit (`audit` skill), offered at the end of an import.
- It does not keep the roadmap day to day (adding, marking a task done): that is the `tasks` skill.
- It writes no secret: `.env.example` carries only variable names.
- It installs no plugin: the doctor says what is missing and the command to add it.
