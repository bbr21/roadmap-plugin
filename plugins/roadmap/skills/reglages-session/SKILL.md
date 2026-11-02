---
name: reglages-session
description: "Reads and changes the session settings the roadmap plugin injects at each session start: questions through the AskUserQuestion form, ADHD mode (a step line at the top of every message, then Fait · Trouvé · Suite bullets), answers in French, and autonomous mode (off by default, in both modes: Claude follows its own recommendation except on architecture questions, merges and publishes on its own). Turns them on or off for the session's project, each project its own, in ~/.claude/reglages-session.json, and repairs that file when unreadable. Also opens the Réglages pane (/reglages). Triggers on « mes réglages de session », « coupe le mode ADHD », « arrête les questions en formulaire », « réponds en anglais », « mets Maestro en autonome », « coupe l'autonomie », « quels réglages sont allumés », « mes réglages sont illisibles ». Not for the panel options (me, autoOpen, theme, launchBypass…), changed in that pane or the plugin menu, nor for a project's rules, which live in its CLAUDE.md."
---

# Session settings

The person speaks French: talk to them in French, and keep the setting names and the pane's
labels in French, as the plugin shows them. Only this skill is in English.

The `roadmap` plugin reads `~/.claude/reglages-session.json` and gives its text to the model at
the start of every session, after `/clear` and after a compaction. On a Team or Enterprise
account, where its start hook is skipped (#116), the text goes with the first message, and with
the message that follows a compaction, which the plugin detects from the shrinking context (#119).
A setting changed during a session (the pane, this skill, another session of the project) comes
back at the next message of every open session of the project: the block given again replaces the
previous one (#119). A reminder line for ADHD mode comes with every message. Four settings: the
first three are on when the file does not exist, `autonome` is off.

| Key | What it asks for |
|---|---|
| `questions` | Every question to the user through the AskUserQuestion tool, never in free text: two to four mutually exclusive options, each with its trade-off, the recommendation first, marked « (recommandé) », four questions at most per send. Except when the request comes from the user (a question, « je ne comprends pas », « explique-moi »): the explanation is written as text, the turn stops without a form, and the question comes back only after their answer. Never a question for a gesture a tool does: an app pane that is closed or hidden (browser, file, diff, terminal) is opened by the session itself (`preview_start`, `mcp__ccd_view__show_pane`). When off, Maestro's menu (« Je lance lesquelles ? ») is also asked in text (#119). |
| `adhd` | Every task message opens on its step card (#196), a one-column markdown table that the app draws as a grey band, three lines: `| ⏳ Étape 2/4 · Écrire le plan · ▰▱▱▱ en cours |`, `|---|`, `| <one sentence stating where things stand> |`; the header gives the status icon, the step over the total, its name, a bar (one cell per step, ▰ per finished step) and the status in words: ⏳ en cours, ✅ faite, ⚠️ détour (the reason after ↳ in the cell below), 🎉 tâche finie on the last step; the steps are those of the native step list, same order and same name, a verb and its object, never renamed; no card for a short answer outside a task (#107); then, in a work turn, three bold headings, `**Fait**`, `**Trouvé**`, `**Suite**`, each with one to four one-sentence bullets, the why included, an empty heading left out (#128: the native step list already says where things stand, so the message says what was done, found and decided); then, if one remains, the only action or decision that is up to the user (never a gesture a tool does); bullets and bold, no wall of text. A work turn ends with the end-of-turn block (#85), three lines without emoji since #123: `**État**`, `**À toi**`, `**Session**`; at every end of a session, the last turn (to be archived) or a turn that stops blocked (État bloqué), a card in a table replaces them (#123, #128): État first, a verdict, `✅ Tout est bon : …` or `⛔ Bloqué : …`, then Mission, Livré (blocked: Fait), Bloque (blocked only: what blocks, who unblocks, what follows), À toi, Session; a closed task's État says, as read in ROADMAP-fait, « ✅ Tout est bon, fini : #N close le AAAA-MM-JJ » (« par Maestro » for a child), and a #N line still open prevents offering to archive (#124). A turn waiting for the user's answer is not blocked: the three lines are enough. A reminder line comes with every message of the user, and the end of turn sends Claude back once when the block is missing. When off, nothing limits the length of answers, Maestro's included (#128). For Maestro (#133), the marker is stable, `⏳ **Maestro · 2 en cours · 1 t'attend**`, never the step of a task; and a turn woken up by one of its sessions writes nothing to the user, no line, no block, no box, except a need for them, in one line, whether ADHD mode is on or not. |
| `francais` | Answers in French, recaps and end box included. |
| `autonome` | With or without code, off by default (#77, #105). Claude follows its own recommendation instead of asking the question and says in one line what it chose. It only asks architecture questions: a choice that would be written in `docs/decisions.md` (a contract between components, a new dependency or service, the vision or a non-goal touched). The setting is the standing permission to merge and publish (a plugin release, a deployment, a push of `main`): no session asks « je fusionne ? » or « je publie ? », it does it and then says so in one line; a publishing skill that asks to validate the substance treats it as validated by the task. Maestro merges on its own the ready branch of one of its sessions (tests green, up to date with `main`, diff reviewed by it), one at a time, tests rerun after each merge, and hands over a unique resource on its own, publishing included. When off, merging and publishing wait for the user's click. Launching a session and archiving still need their click; a message sent on their behalf or a payment is always asked for. |

The plugin also states, in every session, the rule of **gestures outside the code** (#82): a
gesture a task requires outside the repo (scheduled task, setting of a service, form) is done by
the session, first through an MCP connector or an API, otherwise in the browser pane, never as a
text to paste. It is not a setting: it cannot be turned off. Only its confirmation follows
`autonome`, with or without code: on, none; off, a yes before writing.

## The Réglages pane

`/reglages`, the « Réglages » button of the Roadmap panel, and this skill when it is launched open
the plugin's pane: the « Claude et toi » section holds the session settings of the current
project (its scope names it: « ce projet (Roadmap) · au prochain message »), On and Off side by
side; then the plugin's options, in three sections (« Sessions lancées », « Roadmap »,
« Panneau »). A line's ⓘ opens its explanation below it (#118). The user changes a setting there
with one click; the pane also follows the file when this skill writes it. After a change made
here, tell them the pane shows it. Typed alone, `/roadmap:reglages-session` opens the pane, in one
line, without running through the skill.

## The file

```json
{
  "autonome": true,
  "projets": {
    "~/Projects/Roadmap": { "adhd": false },
    "~/Projects/Splitmybill": { "autonome": false }
  }
}
```

- Each project has its own settings (#102, 2026-10-29): its block under `projets`, keyed by the
  repo's main checkout written with `~/` (a worktree counts for its project: take the first
  `worktree` of `git worktree list --porcelain`). A block only holds the settings changed in that
  project.
- A setting missing from the block takes the key at the top of the file, otherwise its default:
  `true`, except `autonome`, which is `false`. A value that is not `true` or `false` is ignored.
- Outside a git repo, the project is the session's folder. The home folder or `/` is not a
  project: only the top keys count, and they also apply to projects without a block.
- Two blocks for the same folder (`~/…` and absolute): the last one wins; do not create a second.
- Unreadable file (broken JSON): the defaults apply (`autonome` off) and the session says so.

## Read

Read the file (`cat ~/.claude/reglages-session.json`); if it is missing, everything is on except
`autonome`. Show the state of the session's project in four lines, one per setting, its name
first.

## Change

1. What to change is clear (« coupe le mode ADHD »): do it without asking. Otherwise, ask through
   AskUserQuestion, following the `questions` setting above: a multiple-choice question
   « Quels réglages garder allumés ? ». The change applies to the session's project; a request
   for another project: its block; « partout »: the top key and the same key in every block that
   holds it.
2. Write the file as valid JSON, in the project's block, keeping what is not touched.
3. Read it back: `python3 -c "import json,os;print(json.load(open(os.path.expanduser('~/.claude/reglages-session.json'))))"`.
4. Say that the change applies from the next message, in every open session of the project (the
   plugin gives the block again there), and in sessions opened afterwards. Apply it right away in
   the current conversation.

## Repair

The start said « illisible »: show the faulty line, rewrite the file as valid JSON with the values
it held, read it back.
