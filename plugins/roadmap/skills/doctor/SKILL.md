---
name: doctor
description: "Read-only checklist of a project wired to the roadmap system. Code mode: tools (git, node, python3, gh logged in), repo on main and pushed to GitHub, roadmap found and valid, node scripts/check.mjs, roadmap plugin enabled, Superpowers and every method skill the launched sessions cite, its updates, swiftui-pro on an iOS project. Projet mode (no code): python3, roadmap, settings of .claude/roadmap.json, required fields of open tasks, roadmap plugin, and Superpowers as « À voir » if missing: it is optional there. One OK, KO or « À voir » line per item, with the command that fixes it. Run at the end of onboarding. Triggers on « doctor », « lance le doctor sur ce projet », « tout est branché ? », « checklist du projet », « le projet est prêt pour Maestro ? », « Superpowers est bien installé ? », « pourquoi Maestro ne voit rien ». Not for a Cowork folder (it has its own doctor), nor for fixing: the doctor says what to do, nor for the content of tasks (audit skill)."
---

# Doctor of a project

The person speaks French: talk to them in French, and report the checklist in French, with the
script's labels (OK, KO, « À voir ») as they come. Only this skill is in English.

## What it checks

Everything the roadmap, the panel and Maestro need to work in a project, and nothing more. It
changes nothing: neither the project nor the machine.

| Item | OK when |
|---|---|
| Tools | `git`, `node`, `python3` and `gh` are there, and `gh` is logged in to an account |
| Git repo | the main checkout is on `main` |
| GitHub | `origin` points to GitHub, and `main` has nothing more and nothing less than `origin/main` (as of the last fetch) |
| Roadmap | the panel finds it (`.claude/roadmap.json`, otherwise `ROADMAP.md` at the root), in the repo and therefore on GitHub |
| Structure | the onboarding layout is complete (CLAUDE.md, roadmap, start hook, scripts) |
| Project check | the project's `node scripts/check.mjs` passes |
| Required fields | every launched task (`qui:` or `branche:`) carries `ouvert`, `due`, `qui` and `après`, or the fields of `requis` in `.claude/roadmap.json` (`[]`: no line); otherwise « À voir », with the count |
| Roadmap plugin | installed and enabled, in the version the app loads |
| Superpowers | installed and enabled |
| Method skills | every skill the launched sessions cite exists in the installed version: a skill renamed by Superpowers shows up here |
| Superpowers updates | installed by the app: tracked by the app, with the date of the last one; installed from the terminal: automatic, otherwise the date of the last one and how to turn it on |
| swiftui-pro skill | only in a Swift project: installed |
| Plugin hooks | no `cc-plugin-sec-default`, or the plugin set by the admin in `appendPlugins`; on a Team or Enterprise account, or with managed settings, « À voir » (the plugin goes through its fallbacks) |
| User name | `me` in `~/.claude/roadmap-perso.json` holds a name (otherwise « À voir »: Claude says « l'utilisateur ») |
| Design system | `design` in `.claude/roadmap.json` declares the one every mockup relies on (#129), each local path present, or `"aucun"`; not declared: « À voir », with what is already there (a `design/`, a deck template) or the proposal to set one up, and the `onboarding.py design` command that declares it |

### In Projet mode

When `.claude/roadmap.json` says `"mode": "projet"` (#76), the checklist changes: no git repo, no
GitHub, no `check.mjs`, no `swiftui-pro`.

| Item | OK when |
|---|---|
| Tools | `python3`; `git` only if the folder is a repo |
| Roadmap | the panel finds it |
| Structure | a `CLAUDE.md` with Projet rules, the roadmap and `ROADMAP-fait.md`, `id:` on every line |
| Settings | `vue`, `cles`, `requis`, `cles_visibles` and `ranger_par` in `.claude/roadmap.json` understood by the panel; otherwise « À voir » |
| Required fields | every open task carries the fields of `requis`; otherwise « À voir », with the count (a line written outside Claude Code is flagged only here) |
| Roadmap plugin | as in Code mode |
| Superpowers, its updates | optional (#94): missing or disabled, « À voir » with the command, never KO |
| Plugin hooks | as in Code mode |
| User name | as in Code mode |
| Design system | as in Code mode: its document or deck templates, one per task type |
| Method skills | those the Projet brief suggests without requiring them: `brainstorming`, `writing-plans`; a missing one is « À voir » |

The list of what is required is in `references/requis.json` (`projet` for Projet mode). The method
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
- Everything green: say so in one sentence, and that « Maestro » works in this project.
- The doctor does not read the content of tasks. Tasks bundled together, duplicated or without a
  deadline: offer the `audit` skill, which splits, merges and completes after validation.
