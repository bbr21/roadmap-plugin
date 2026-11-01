---
name: roadmap-panel
description: "Wires a project to the Roadmap panel of Claude Code (roadmap plugin) and troubleshoots it: where the panel looks for the roadmap, the .claude/roadmap.json file to write, its settings. Triggers on « ajoute ce projet au panneau roadmap », « le panneau roadmap ne s'ouvre pas », « /roadmap dit qu'il n'y a pas de roadmap », « change les sujets du panneau », « le panneau doit lire une autre roadmap ». Not for keeping the roadmap itself (adding, updating or marking a task done), which belongs to the tasks skill, nor for a roadmap kept in Cowork itself, nor for setting up the structure and roadmap of a project, code or Projet mode (onboarding), nor for checking that a project is wired (doctor)."
---

# Wire a project to the Roadmap panel

The person speaks French: talk to them in French, and write `.claude/roadmap.json` values (names,
subjects) in French when they are theirs. Only this skill is in English.

## Run on its own: open the panel

The user types `/roadmap:roadmap-panel` with nothing else when the panel did not open by itself:
it must be shown, not diagnosed. The mod answers by itself, like `/roadmap`, without going through
the model. If this text arrives anyway, a line at the top says the panel has just opened: answer
in a single line, « Panneau de la roadmap <nom> ouvert. », without checking anything. The rest of
the skill only serves a further request (wiring, changing subjects, troubleshooting).

The `roadmap` plugin is a Claude Code mod: a panel next to the chat, in the Code tab of the desktop
app, that shows the roadmap of the session's project. It only reads; the roadmap is kept through
this plugin's `tasks` skill (add, update, reschedule, mark done, drop), which follows the rules the
project declares (`regles`, `ecriture`, `preuves`).

## Where the panel looks for the roadmap

For the session's project, a worktree always going back up to its main folder:

1. `.claude/roadmap.json` in the project;
2. the sources declared in the user's local file, `~/.claude/roadmap-perso.json`
   (a roadmap shown by several folders, recognised by the start of their path);
3. a `ROADMAP.md` at the root of the project.

None of the three: no panel, and `/roadmap` says so.

## Wire a project

The roadmap is at the root of the project, named `ROADMAP.md`: nothing to do, the panel finds it.
A code project gets it with its whole structure through the `onboarding` skill, in a `roadmap/`
folder that `.claude/roadmap.json` points to. Its closed tasks go into `ROADMAP-fait.md`, next to
it. The `doctor` skill says whether everything is wired.

It is elsewhere, or it needs a name, subjects or other names for « À moi »: write
`.claude/roadmap.json` at the root of the project, all fields optional.

```json
{
  "name": "Clipping",
  "dir": "docs",
  "me": ["Alex"],
  "subjects": ["Montage", "Diffusion", "Contrats"]
}
```

- `dir`: the folder that contains `ROADMAP.md`, relative to the project or absolute (a Cowork
  folder, for example). Absent: the root of the project.
- `subjects`: the closed list of subjects that sort the tasks. Absent: the model picks short
  subjects itself.
- `me`: the values of « attend » (and of `resp:`) that mean the user. Absent: the plugin's `me`
  setting, otherwise `me` from the local file.

The mode and its settings (#76), optional too:

```json
{
  "mode": "projet",
  "requis": ["id", "ouvert", "due", "resp", "parent", "après"],
  "cles": { "type": ["Réunion", "Email"], "client": [] },
  "vue": "echeance"
}
```

- `mode`: `code` (default, a code project) or `projet` (project management without code: sessions
  launched without a worktree, brief without a coding method, no « commit sans test » reminder,
  Maestro that only proposes the person's tasks).
- `requis`: the fields required on every open task; the panel flags a line written without them,
  without refusing it. Default: none in Code mode, the six above in Projet mode.
- `cles`: keys on top of the grammar (the tags of a Notion), each with its allowed values (empty
  list: free); a task's detail shows them, the search reads them.
- `vue`: how tasks are sorted: `echeance`, `responsable`, `arbre`, `sujet` or `jour`.
  Default: `echeance` in Projet mode, by subject in Code mode. The panel's button switches to the
  others. In Projet mode, the panel opens on « Ma journée »; `vue` applies from « Tout afficher ».
- `relance`: in Projet mode, the number of days without news from an awaited third party beyond
  which its task is « À relancer » (integer; default 14). The count starts from `relance:` on the
  line, otherwise from `ouvert:`.

Tidying up before archiving (#101), optional: a project that tidies its memory away at the end of
a subject (AAFES, skill `aafes-memory`) says so, and the end of turn only proposes archiving the
session, its task marked done, once the tidy-up line is written in one of the session's answers.

```json
{ "rangement": { "skill": "aafes-memory", "ligne": "Rangé dans" } }
```

- `skill`: the skill that tidies the memory away, named in the reminder. Without it, no setting.
- `ligne`: the start of the line that reports the tidy-up, at the start of a line of an answer or
  of the end box (ignoring case, accents, bold and bullet). Default: « Rangé dans ».
  « Rien à ranger » always counts, for a subject with nothing durable.
- Line absent: the end of turn reminds the tidy-up rule instead of proposing archiving, then
  proposes it as soon as the line is written. Without this setting, nothing changes.

The design system (#129), optional: the one every mockup of the project relies on, in Code mode
(components, variables) as in Projet mode (document or deck templates, one per task type). The
session settings cite it in the rule « Maquettes avant un choix visuel »; without it, the rule
proposes setting one up, except for a demo mockup.

```json
{ "design": [{ "chemin": "design/", "pour": "le panneau et ses composants" }] }
```

- `chemin`: relative to the project, absolute, or an `https://` address; a plain string counts as
  its path. `pour`: what the entry covers. An entry without a path is ignored.
- `"design": "aucun"`: the project does without one, the rule no longer proposes setting one up.
- `onboarding.py design <dossier> --poser '<JSON>'` (skill `onboarding`) writes it; the doctor
  checks it.

An unknown setting or one of the wrong type is ignored, and the `doctor` skill flags it.

A line is read if it follows the grammar of the plugin's roadmaps, the axis first:

```
- [ ] Libellé à l'infinitif `[axe | attend:Qui | ouvert:AAAA-MM-JJ | due:AAAA-MM-JJ | src:… | fiche:…]`
```

In Projet mode, add `resp:Nom` (the person who carries the task, never `-`), `parent:N` or
`parent:#N` (the parent task, `-` without one) and `après:N,M` (the prerequisites, `-` without).

Show the user the file before writing it into a repository that is not theirs.

## Plugin settings

In the Claude Code configuration menu: `me` (empty by default: the names from the local file),
`autoOpen` (open the panel at startup, default yes), `titleModel` (model for the short titles,
default sonnet). A change reloads the panel.

## The user's local file

`~/.claude/roadmap-perso.json`, outside any repository, specific to the machine (#79); onboarding
writes `me` into it if missing. Both keys are optional.

```json
{
  "me": ["Alex", "AL"],
  "sources": [
    { "name": "Client X", "match": ["/Users/alex/Projects/client-x", "/Users/alex/Projects/client-x-"],
      "dir": "/Users/alex/Projects/Client X Cowork", "subjects": ["Commercial", "Données"] }
  ]
}
```

- `me`: the user's names; the first is the one Claude uses with them, the others also count for
  « À moi ». The plugin's `me` setting, when filled, wins. Without a name, Claude says
  « l'utilisateur ».
- `sources`: a roadmap shown by several folders without `.claude/roadmap.json` (the worktrees of a
  repository, for example): `match`, the recognised path starts (the longest wins); `dir`, the
  folder of `ROADMAP.md`; `name`, `subjects` and `me` as in `.claude/roadmap.json`.

## Troubleshoot

- The panel does not open: the session is in none of the three cases above, or `autoOpen` is off;
  `/roadmap` opens it and says what is missing.
- The panel is empty (« Nothing to show yet »): the app refused a render; the reason is on a grey
  line of the conversation, or in the debug log (`claude --debug`).
- The tasks are all « À classer »: the short titles are being written; they arrive as the model
  answers and are only requested again for a new or modified task.
- A task does not switch to « en cours » although a session writes its line: the session is a
  Maestro, named « Maestro … » (or with an old title « Lot … », kept as an alias), marked Maestro,
  or that has launched at least two sessions still open (it coordinates features, never attached
  to a task; skill `maestro`), or it already carries another number « #N · … ». The panel renames
  no session: the title « #N · titre court » is set at launch (▶ of the list, « Lancer » or
  « Vérifier » of the detail).
- « Ouvrir la fiche » opens the Mac's default app: the file is not in a folder of the session,
  which the Files panel of Claude Code does not display.
- « Annuler la tâche » refuses and says so under the confirmation, without writing anything:
  `cowork.py` refused (label contained in that of another open task, invalid bilan), the
  repository is not on main, ROADMAP has uncommitted changes there, `git pull` failed, or the line
  moved since it was displayed. « Annulée, mais pas committée » or « pas poussée »: the line has
  already gone down, the commit or the push remains to be done by hand.
- Clicks are slow: each session records its last 40 renders under the `perf` key of the plugin's
  store (`~/.claude/plugins/store/roadmap_inline-*.json`, 120 records in all, `mod` says which
  session): `clickMs` (from the click to the end of the render), `ms` and `loadMs` (render
  duration, including reading the data), `cached` (data in memory), `elements`, `svg`, `clients`,
  `kb`. Beyond about 250 Svg or 200 KB per render, the app freezes. Two other kinds of records:
  `kind: 'open'` (click on `#N` or « Ouvrir la session »: `openMs` from the click to the tool's
  return, `via` = `focus` | `link` | `note`) and `kind: 'refresh'` (re-reading the sessions:
  `listMs`, `probeMs`, `calls` = tool calls, `fast` = close-together re-read).
