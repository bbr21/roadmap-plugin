---
name: reglages-session
description: "Reads and changes the session settings the roadmap plugin injects at each session start: questions through the AskUserQuestion form, ADHD mode (an italic state line and a short glyph journal, then a separate conclusion at the end), answers in French, and autonomous mode (off by default, both modes: after the starting framing, Claude follows its own recommendation until the merge, merges and publishes alone). Turns them on or off for the session's project, each project its own, in ~/.claude/reglages-session.json, and repairs that file when unreadable. Also opens the Réglages pane (/reglages). Triggers on « mes réglages de session », « coupe le mode ADHD », « arrête les questions en formulaire », « réponds en anglais », « mets Maestro en autonome », « coupe l'autonomie », « quels réglages sont allumés », « mes réglages sont illisibles ». Not for the panel options (me, autoOpen, theme, launchBypass…), changed in that pane or the plugin menu, nor for a project's rules, which live in its CLAUDE.md."
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
| `adhd` | Since #275 (option A chosen by the user, 2026-11-04: the verdict, then the proof; it replaced #261's state line and journal). Every task message opens on its verdict, one sentence in bold, no emoji, that says the state and what comes out of it: `**Tout concorde : les budgets baissés de 15 % sont en place.**`, `**En cours, étape 4/6 : je relis les budgets chez Google.**`, `**Détour : un test casse sur le compte de la mère.**`, `**J'ai besoin de toi : la vue des faites.**` (then the form), `**Prête à fusionner : tests verts (…), branche poussée.**`. One verdict per message. Then the proof, in the form of what it is: a sure fact is one plain bullet of words, one line, no number, no identifier, no glyph or bold at its start; what was checked and counted is a small table, one row per object, three columns at most (object, expected, seen), the only place numbers go (intermediate amounts and conversions are not written). What is up to the user leaves the flow, at the end, each in its own quote: `> **À toi :** …` (an action or decision that is up to them, only that), `> **Une question :** …` (then the form), `> **Hors de ma tâche :** …` (a doubt or idea outside the task, with its card). A link is given by its name, never its address. Five bullets at most, no sub-bullet: no title, no heading, no paragraph; nothing repeated from one message to the next (a fact, a question or an « À toi » already said does not come back). The roadmap lines the plugin hands (`- Roadmap : #N …`) go under the verdict, in the same message. The native step list stays the only progress marker. A short answer outside a task: no verdict required. At the end of a session, once (the line closed, read in ROADMAP-fait, or the session stopping blocked), the conclusion, in another layout: `---`, a title `### ✅ #<id> · <la tâche> : c'est livré` (blocked: `### ⛔ … : bloquée`, then one sentence), then `**Ce qu'on a fait.**` and two or three plain sentences: the starting problem, what was built, what it changes for the user (#307); then a two-column table: `| Livré | <version>, close le AAAA-MM-JJ |` (« close par Maestro le » for a child; without a version, the deliverable and where it is), `| À essayer |`, `| En route |` (the problem met, if any), and the end box's recap does not repeat « fini : … »; blocked: `| Fait |`, `| Bloque |` (what blocks, who unblocks, what follows), `| À toi |`. Then the end box « Archiver cette session ? » with the « Oui, archiver » reply button (not when blocked, nor while the #N line is open). Maestro's verdict is counted, `**Maestro · 2 en cours · 1 t'attend**` (`**Maestro · tout est livré**`), written only when it changed since its previous message; its conclusion is `### ✅ Maestro · <le lot> : tout est livré`, one sentence, the table `| Tâche | Ce qui change | Version |`, one row per task launched, then `**À essayer :** …`; a delivered task adds `- #<id> livrée <version> : <ce qui change>` under its verdict; and a turn woken up by one of its sessions writes nothing to the user except a need for them, in one line. A reminder line comes with every message; the end of turn sends Claude back once only for an end of session (never to copy the roadmap report, which comes with the write's result, #261) that lacks its conclusion, its Bloque row, Maestro's task table, the archive button, or « close » for a closed line. When off, nothing limits the length of answers. |
| `francais` | Answers in French, recaps and end box included. |
| `autonome` | With or without code, off by default (#77, #105). After the starting framing (below, #303), Claude follows its own recommendation instead of asking the question, until the merge, and says in one line what it chose. No more question, except a new fact that changes the direction; an architecture choice the framing did not see is one: a choice that would be written in `docs/decisions.md` (a contract between components, a new dependency or service, the vision or a non-goal touched). The setting is the standing permission to merge and publish (a plugin release, a deployment, a push of `main`): no session asks « je fusionne ? » or « je publie ? », it does it and then says so in one line; a publishing skill that asks to validate the substance treats it as validated by the task. Maestro merges on its own the ready branch of one of its sessions (tests green, up to date with `main`, diff reviewed by it), one at a time, tests rerun after each merge, and hands over a unique resource on its own, publishing included. When off, the session gets an « Autonome éteint » paragraph instead (#304): merging, publishing, writing outside the code, a choice that belongs to the user met along the way, and for Maestro the launch menu, answering a session and handing over publishing wait for the user's yes, asked once per gesture when it is ready, through the end box's question and button; reading, coding, testing, committing and pushing one's own branch, taking one's roadmap line, what the files settle, handing over the simulator and posting a card go on without asking. A project rule that says « sans attendre » says how, not when. The table is in the plugin README (« Autonome éteint »), held to the code by `tools/test_reglages.py`. Launching a session and archiving still need their click; a message sent on their behalf or a payment is always asked for. |

The plugin also states, in every session, the rule **« Maquettes avant un choix visuel »**: 2 or 3
mockups on the project's design system, the person chooses, only the validated version is coded
(#96, #322). In a code project, the coded render is then compared to the validated mockup before
saying it is ready (#357): the capture of the real render next to it, taken by the user on the session's exact instruction
and posed by `fidelite.py poser --capture` (skill `roadmap:maestro`, in the chantier's folder; #377), gaps listed then fixed, `fidelite.py verifier` green;
no merge without that proof. A session that says « prête à fusionner » without it gets a reminder
at the end of its turn.

The plugin also states, in every session, the **starting framing** (« Cadrage de départ », #303):
at the start of each task (▶, Maestro card, request in the conversation), before the first gesture
that codes or executes, the session rereads the line, its fiche and its folder, then decides.
Nothing ambiguous: it says so in one line and goes. Otherwise one AskUserQuestion form of one to
four short questions, only those whose answer changes what it will do (rendering and style,
architecture, scope, what is already in place), the recommendation first, a `preview` when an
option is visual; then the agreement in one line, and only then the work. A brief that already
carries a framing (Maestro's) is not framed again: only what is missing is asked. It is not a
setting and holds with `autonome` on: the setting only applies after it.

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
