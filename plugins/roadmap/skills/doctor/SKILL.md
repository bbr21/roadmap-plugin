---
name: doctor
description: "Read-only checklist of a project wired to the roadmap system; says first if the folder has code (#176). With code: tools (git, node, python3, gh logged in), repo on main and pushed to GitHub, roadmap found and valid, node scripts/check.mjs, roadmap plugin enabled and matching its fingerprints, Superpowers and every method skill the launched sessions cite, its updates, swiftui-pro on an iOS project. Without code: python3, roadmap, settings of .claude/roadmap.json, required fields of open tasks, roadmap plugin, and Superpowers as « À voir » if missing: it is optional there. One OK, KO or « À voir » line per item, with the command that fixes it. Run at the end of onboarding. Triggers on « doctor », « lance le doctor sur ce projet », « tout est branché ? », « checklist du projet », « le projet est prêt pour Maestro ? », « Superpowers est bien installé ? », « pourquoi Maestro ne voit rien ». Not for a Cowork folder (its own doctor), nor for fixing: it says what to do, nor for the content of tasks (audit)."
---

# Doctor of a project

The person speaks French: talk to them in French, and report the checklist in French, with the
script's labels (OK, KO, « À voir ») as they come. Only this skill is in English.

## What it checks

Everything the roadmap, the panel and Maestro need to work in a project, and nothing more. It
changes nothing: neither the project nor the machine. Its only network read is the plugin's
published fingerprints (`CHECKSUMS.txt` of the public repo `bbr21/roadmap-plugin`, by `curl`).

| Item | OK when |
|---|---|
| Tools | `git`, `node`, `python3` and `gh` are there, and `gh` is logged in to an account |
| Python | no plugin puts a `python3` shim at the head of the PATH: `modern-python` (trailofbits) enabled, or the `python3` found inside `~/.claude/plugins/`, is KO (#279): its shim refuses `python3 <script>`, the form of every skill of this plugin, and loops forever with pyenv set to « system ». No line when there is none |
| Git repo | the main checkout is on `main` |
| GitHub | `origin` points to GitHub, and `main` has nothing more and nothing less than `origin/main` (as of the last fetch) |
| Roadmap | the panel finds it (`.claude/roadmap.json`, otherwise `ROADMAP.md` at the root), in the repo and therefore on GitHub |
| Structure | the onboarding layout is complete (CLAUDE.md, roadmap, start hook, scripts) |
| Project check | the project's `node scripts/check.mjs` passes |
| Rules of the roadmap | `ROADMAP-REGLES.md` next to `ROADMAP.md` (or the file `regles` declares) is there (#167); missing: KO, with the `onboarding.py regles` command that sets it from the template. Also lists `ecriture` and `preuves` when declared; an unreadable `ecriture` is KO, a missing place « À voir » |
| Rules of the tool | the « Règles de l'outil » section of that rules file matches the template of the folder's mode, Code or Projet (#290), trailing blanks aside: « à jour », OK; absent or different: « À voir », with `onboarding.py regles --outil <dossier>`, which replaces that section only and keeps the project's own rules. No line when the rules file is missing (« Rules of the roadmap » is KO) |
| Axes | the chosen colour and name of axes (`axes` of `.claude/roadmap.json`, or of the project's entry in `roadmap-perso.json`, #286), which the panel otherwise ignores silently: a key that is not an axis slug, a `couleur` other than `bleu`, `orange`, `vert`, `jaune`, `violet`, `turquoise`, `rose`, `gris`, an empty `nom` or one over 40 characters (cut), an axis no line of the roadmap carries: « À voir ». No line without `axes` |
| Work | first line: « Code (dépôt git, N fichiers de code) », « Projet (pas de dépôt git) », « Projet (dépôt git sans fichier de code) », or « … (forcé par mode dans .claude/roadmap.json) » (#176). A wrong detection is fixed with `mode` |
| Settings | an unknown `mode` (other than `auto`, `code`, `projet`) or `requis_sur` (other than `ouvertes`, `lancees`), or `mission` (other than `phrase`, `puces`), or an `a_preuve` that is not a list of `ref:` (#277): « À voir » |
| Required fields | every launched task (`qui:` or `branche:`) carries `ouvert`, `due`, `qui` and `après`, or the fields of `requis` in `.claude/roadmap.json` (`[]`: no line), on every open task when `requis_sur` is `ouvertes`; otherwise « À voir », with the count |
| Roadmap plugin | installed and enabled, in the version the app loads |
| Roadmap plugin twice | one enabled copy only; two (the account's store and the local catalog `roadmap@roadmap`), « À voir » (#229): keep the account's copy, which the app updates, otherwise the most recent, with the exact gesture that removes the other |
| Plugin fingerprints | one line per installed copy of the roadmap plugin (account's store, local catalog `~/.claude/plugins/cache/roadmap/roadmap/<version>`): its files match the SHA-256 published for its version in `CHECKSUMS.txt` of the public repo `bbr21/roadmap-plugin` (#274), read from `main`, otherwise from the mirror commit « roadmap <version> »; only the Finder's `.DS_Store` and `._*`, the app's `.in_use` at the root, and Python's own `__pycache__/<module>.*.pyc` next to a published `<module>.py` are left out: a test, a `node_modules` or any other cache counts as extra, and a symbolic link is always KO. Identical: OK. Changed, extra or missing files, or a link: KO, naming them, with the gesture that reinstalls the copy. No fingerprints for that version (before 0.176.0), or the public repo unreachable: « À voir » |
| Superpowers | installed and enabled |
| Method skills | every skill the launched sessions cite exists in the installed version: a skill renamed by Superpowers shows up here |
| Superpowers updates | installed by the app: tracked by the app, with the date of the last one; installed from the terminal: automatic, otherwise the date of the last one and how to turn it on |
| swiftui-pro skill | only in a Swift project: installed |
| Plugin hooks | no `cc-plugin-sec-default`, or the plugin set by the admin in `appendPlugins`; on a Team or Enterprise account, or with managed settings, « À voir » (the plugin goes through its fallbacks) |
| User name | `me` in `~/.claude/roadmap-perso.json` holds a name (otherwise « À voir »: Claude says « l'utilisateur ») |
| Cloud | the settings a session opened in the project reads, in the panel's order (`.claude/roadmap.json`, otherwise the longest-prefix entry of `roadmap-perso.json`): `sessions: "cloud"` without a reachable GitHub repo (no GitHub `origin`, no `depot`), KO; a repo without `docs/session-cloud.md`, KO (the `depot` repo is looked for as a local clone among the project and its entry's folders, otherwise « À voir », not checked); a project on GitHub without `sessions: "cloud"`, « À voir », cloud possible; neither, OK, task sessions on the Mac, while a connectors-only mission still runs in the cloud without a repo, through Maestro (#467) (#453). Each line gives the gesture, written where the session reads its settings |
| Masked settings | a key of `.claude/roadmap.json` that the entry of the same project in `roadmap-perso.json` masks: sessions opened in one of that entry's folders outside the project read the entry, not the file (adBricks, 2026-11-11: `sessions` set in the folder, no effect): « À voir », naming the keys and the values to copy into the entry. No line when the entry carries them or covers only the project |
| Design system | `design` in `.claude/roadmap.json` declares the one every mockup relies on (#129), each local path present, or `"aucun"`; not declared: « À voir », with what is already there (a `design/`, a deck template) or the proposal to set one up, and the `onboarding.py design` command that declares it |

### Without code

In a folder without code (#76, #176: no git repository, a repository without code files, or
`"mode": "projet"`), the checklist changes: no git repo, no GitHub, no `check.mjs`, no `swiftui-pro`.

| Item | OK when |
|---|---|
| Tools | `python3`; `git` only if the folder is a repo |
| Python | as with code |
| Roadmap | the panel finds it |
| Work | as with code |
| Structure | a `CLAUDE.md` with the rules of a folder without code, the roadmap, `ROADMAP-fait.md` and `ROADMAP-REGLES.md`, `id:` on every line |
| Rules of the roadmap | `ROADMAP-REGLES.md` next to `ROADMAP.md` (or the file `regles` declares) is there (#167); missing: KO, with the `onboarding.py regles` command that sets it from the template. Also lists `ecriture` and `preuves` when declared; an unreadable `ecriture` is KO, a missing place « À voir » |
| Rules of the tool | the « Règles de l'outil » section of that rules file matches the template of the folder's mode, Code or Projet (#290), trailing blanks aside: « à jour », OK; absent or different: « À voir », with `onboarding.py regles --outil <dossier>`, which replaces that section only and keeps the project's own rules. No line when the rules file is missing (« Rules of the roadmap » is KO) |
| Axes | as with code |
| Settings | `mode`, `requis_sur`, `cles`, `requis`, `cles_visibles`, `ranger_par`, `mission` and `a_preuve` in `.claude/roadmap.json` understood by the panel; a leftover `vue` (ignored since #238) or anything else: « À voir » |
| Required fields | the fields of `requis` on every open task (`requis_sur: "ouvertes"`, written by the onboarding; an old `mode: "projet"` too), else on every launched task; otherwise « À voir », with the count (a line written outside Claude Code is flagged only here) |
| Roadmap plugin | as with code |
| Roadmap plugin twice | as with code |
| Plugin fingerprints | as with code |
| Superpowers, its updates | optional (#94): missing or disabled, « À voir » with the command, never KO |
| Plugin hooks | as with code |
| User name | as with code |
| Design system | as with code: its document or deck templates, one per task type |
| Cloud, masked settings | as with code: a folder without git reaches the cloud only through `depot` |
| Method skills | those the Projet brief suggests without requiring them: `brainstorming`, `writing-plans`; a missing one is « À voir » |

The list of what is required is in `references/requis.json` (`projet` for a folder without code). The method
skills there follow those the plugin cites in the sessions' brief (`hooks/parse.ts` of the
plugin): a plugin test refuses the release if the two lists diverge.

## Running it

From this skill's folder (the path given when the skill loads):

```bash
python3 "<dossier de la skill>/scripts/doctor.py" <dossier du projet>
```

Without a folder, it takes the current folder; from a worktree, it goes up to the main checkout.
`--json` gives the same diagnosis in JSON. Exit code 1 if there is a KO. The script is in
`scripts/doctor.py`; it runs on the user's machine (terminal, Claude Code, or the
« Control your Mac » tool), not in a container.

If `python3` answers « Use `uv run python …` » or hangs, a plugin shim stands in front of it (#279):
run the script with the first real interpreter of `which -a python3` (one outside `/shims/`, such as
`/opt/homebrew/bin/python3` or `/usr/bin/python3`), and report that shim as the first KO.

The plugins it judges are those the app loads: first its store
(`~/Library/Application Support/Claude/local-agent-mode-sessions/<compte>/<org>/rpm/`, the one of
the session's account, otherwise the most recent), then `claude plugin list --json` for the
plugins installed from the terminal. The terminal's `synced` copy is read only when there is no
store: it is refreshed only when `claude` starts in a terminal and can lag behind the app.

## Reporting

A short table: one line per item, the emoji and the detail; under each KO or « À voir », the
command that fixes it, as the script gives it. Then the verdict in one sentence.

- A KO due to the project (roadmap missing, incomplete structure, `check.mjs` failing): offer the
  `onboarding` skill, which completes without overwriting anything.
- A KO due to the machine (Superpowers missing, `gh` not logged in): the command, which the user
  runs themselves; a plugin is never installed without them.
- A method skill not found: Superpowers may have renamed it. After `claude plugin update`, if it
  is still not found, the roadmap plugin's list needs updating, in `hooks/parse.ts` and in
  `references/requis.json`, through an update of the plugin's repo.
- Plugin hooks « À voir »: the account (Team or Enterprise) or the machine (managed settings) has
  `cc-plugin-sec-default`, which skips the plugin's classic hooks. Nothing is broken: the plugin
  goes through its fallbacks, and only the full settings after a compaction are missing. To get
  everything back, the fix is a gesture of the organisation's admin, not of the user; never
  suggest setting `appendPlugins` in the user's settings.
- Roadmap plugin twice « À voir »: the engine renames both copies' options
  `roadmap@<source>.<champ>` (#227), so a setting written by one is not read by the other. Give
  the copy to keep and the script's gesture for the other one, which the user does themselves:
  the doctor never uninstalls a plugin.
- Plugin fingerprints KO: the installed copy is not the published version (edited by hand, damaged,
  or tampered with). Name the files, and give the reinstall gesture, which the user does
  themselves; never edit or delete the copy. « À voir » for an old version: updating the plugin
  is enough.
- Cloud KO or « À voir »: the gesture is a line of settings or a copy of `docs/session-cloud.md`, which
  the user approves; a project without any GitHub repo has no cloud task session, but Maestro's connectors-only missions (#467) need none: say so.
- Everything green: say so in one sentence, and that « Maestro » works in this project.
- The doctor does not read the content of tasks. Tasks bundled together, duplicated or without a
  deadline: offer the `audit` skill, which splits, merges and completes after validation.
