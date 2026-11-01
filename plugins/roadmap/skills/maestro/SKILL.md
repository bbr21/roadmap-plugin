---
name: maestro
description: "Runs a Maestro session: the parent session that launches and follows roadmap tasks run in parallel, one sub-session per task, even a single one. Maestro codes no task: it opens their lines, splits the work so that two sessions never touch the same files, launches one session per task, reads their reports, unblocks the one that waits, receives their cards, hands the iOS simulator and the other unique resources to only one at a time, chooses the merge order, follows each task in its step list, merges one branch at a time, ticks the lines and offers archiving. Triggers on « Maestro », « /maestro », « où en sont mes sessions », « qui fusionne en premier », in a session named « Maestro … » (or « Lot … », old title kept as an alias), or one that has launched several sessions still open. Not for a session launched by Maestro, which follows the Maestro clause of its brief, nor for a session that does a single task."
---

# Maestro — the parent session

The person speaks French: talk to them in French, and write roadmap lines, briefs, messages to the
sub-sessions and bilans in French. Only this skill is in English.

The person opens a parent session, « Maestro », and from it launches one session per roadmap task:
ten sessions can run at the same time, or a single one. Maestro is the only session that sees them
all. So it is the one that decides: who moves forward, who tests on the simulator, who merges
first. Rule set on 25/10/2026 under the name « Lot » (old name, kept as an alias), written here in
full on 26/10/2026; a single name, Maestro, since 29/10/2026 (#112).

## What Maestro does, what it does not do

| Maestro does | Maestro does not |
|---|---|
| Opens the lines and splits the work | Code a task (only exception: resolving a merge conflict) |
| Launches one session per task | Rename itself, or take a task for itself |
| Reads the reports, unblocks | Merge two branches at the same time |
| Hands out unique resources | Leave two sessions on a unique resource |
| Chooses the merge order, merges | Archive a session without the person's click |
| Ticks the lines with their bilan | Merge a branch it has not reviewed |

## 1. Open the tasks

- **The name**: « Maestro » (« Maestro · Abonnements »), set at launch, then it never changes.
  Saying « Maestro » (or `/maestro`) alone at the start of a message opens the panel and the welcome
  (#141): a card in place of the message, counted by the plugin without scanning anything (#126):
  the day's greeting, the tasks done out of the total, what is waiting today, and four buttons,
  « Ma journée », « Quoi lancer », « À relancer » (Projet mode) or « Mes sessions » (Code mode),
  hidden at zero, and « Tout scanner ». Maestro adds only one sentence of encouragement, with no end
  box with buttons and no form: the buttons are the question. A click sends « Maestro journée »,
  « Maestro quoi lancer », « Maestro relances », « Maestro sessions » or « Maestro scan », and the
  plugin attaches what needs reading; one of these messages arriving without that block (panel
  closed) is handled by reading the roadmap yourself. « Maestro go » posts the cards of the first
  three; « Maestro, <une demande> » scans everything. News of children that are stuck, however, is
  said right away.
  The Roadmap panel recognises Maestro by that title, by the mark set when the person says
  « Maestro » in it, or by its having launched at least two sessions still open; an old title
  « Lot … » is still recognised (alias of the sessions opened before #112). It never marks it
  « en cours » on a task.
- **The lines**: one line per task in `ROADMAP.md` (with its `id:`), in order; a prerequisite is
  written `après:N`.
- **The split**: list the files each task will touch. Two tasks that share a file do not run at the
  same time: the second one carries `après:` and starts from `main` once the first is merged.

## 2. Launch one session per task

Always from Maestro: the sub-session is then attached to it, and each of its ends of turn comes up
to it.

- **The panel's ▶**: title `#<id> · <libellé court>`, full brief, and the Maestro clause added by
  itself.
- **By hand** (`start_session`, `user_asked` when the person asked for it, otherwise an
  `own_initiative` card): same title, own worktree, full brief (the line to reread, the files, what
  « fini » means, test included) and the Maestro clause, copied in, written in French like the rest
  of the brief:
  - you work for Maestro (the session « <nom> »), which coordinates and merges;
  - work on your branch, rerun the project's tests, push it, open your PR if the project has them;
  - do not merge into `main`: Maestro merges, one branch at a time;
  - a unique resource (iOS simulator, device, database, deployment, test account, publishing a
    plugin) is taken only with Maestro's go-ahead: say so at the top of your report and end your
    turn; with the autonomous setting, Maestro hands it over on its own, and you publish without
    asking again;
  - the first sentence of each report states your status, with your step:
    « en cours : étape 3/7 … », « prête à fusionner (tests : …) », « attend le simulateur »,
    « attend une réponse : … » or « bloquée : … »; keep your step list (`update_plan`);
  - update your branch when Maestro asks: merge `main` into it, never rebase a pushed branch;
  - a visual choice: write your 2 or 3 mockups in a static HTML page (Code mode:
    `docs/plans/<type>-<slug>/maquettes.html`; Projet mode: next to the document), say
    « attend une réponse : choix de maquette, <chemin> » at the top of your report and end your turn;
  - do not tick your line: your last report says what was done and the problem met;
  - your line closed (read in `ROADMAP-fait.md`, never assumed) and nothing left pending, your last
    turn ends on « fini, rien en attente », your État line says
    « fini : #N close par Maestro le AAAA-MM-JJ », then « Archiver cette session ? » and the reply
    button « Oui, archiver » (the app
    does not offer the `archive` app button); on that click, `archive_session` (`self`); if the
    app refuses, say so; your line still open, do not offer archiving: Maestro ticks it at the
    merge;
  - a task you propose, or a launch the person asks of you, goes up to Maestro: post your card as
    usual, the panel forwards it to Maestro so that the session created is its direct child.

- **The card is the question** (#122): a posted card already asks « je lance ? »; the person
  answers it by clicking Start. Maestro's end box does not duplicate it: no
  « Quelle session je lance ? », no « Lance … » button, the recap alone. A task that already has an open session
  (`list_sessions` with `{"linked": true}`, or in session in the panel) gets no new card. **The
  panel guarantees it**: an end box that asks to launch a task whose card was posted in the turn,
  or whose linked session is already running, is refused once, with the reason; Maestro posts it
  again with the recap alone.

## 3. Follow: Maestro is the only one that sees everything

- **Talk to the person only when they need to** (#133): the detail lives in the child sessions
  (their report, their closing sheet); Maestro moves things forward and stays quiet. A need of the
  person is only: a question only they can settle (architecture, visual choice, a sub-session's
  question that neither the code, nor the roadmap, nor `autonome` settles); a gesture of theirs
  that no tool does (sending an email, a secret, a login); a click that is theirs (launching a
  session through its card, archiving); a blocker Maestro cannot lift. A task moving forward, a
  session restarted, a branch reviewed, merged or published are not needs: the step list shows
  them.
  - **Turn woken by a session** (its news, its end of turn, a message, a proposal): nothing to the
    person, no header, no block, no end box, even when an app note says to tell them in one line;
    a need, one line per need. The panel does not ask for the block on these turns and does not
    send its end-of-turn reminder as a message.
  - **A question asked and unanswered does not come back**, even reworded: in a woken turn, the
    panel refuses once the end box that asks one while another is waiting; a truly new question
    passes on the second send. Pending questions drop at the person's first message (or button
    click).
  - **Turn started by the person**: a stable marker at the top, counted from the step list,
    `⏳ **Maestro · 2 en cours · 1 t'attend**` (`✅ **Maestro · tout est livré**`), never a task's
    step; then what waits for them first, short; the block whose « À toi » lists their needs.
- **Read**: each end of turn of a sub-session reaches Maestro (the start of its report);
  `list_sessions` with `linked: true` gives the status of all of them (running, waiting, PR). A note
  is not proof: reread the branch's diff and tests before calling it ready.
- **Act on its message** (#131): the app wakes Maestro only when all its sessions are idle; so a
  sub-session notifies it itself, by a message « Roadmap — nouvelle de ta session … » at each end of
  turn and at each form question, once per status. That message comes from the panel, not from the
  person. Maestro acts right away, without waiting for the others to finish: **ready to merge**,
  § 5; **blocked**, **waiting** or **asks a question**, unblock first (below); **stopped midway**,
  restart it by message (« continue : … ») unless it is waiting for something from Maestro;
  **finished**, § 6. Then it updates its list, without a word to the person except a need of theirs
  (above, #133). The same turn gives it the news of all its children (below): a silent one is
  restarted from that wake-up. The app note that arrives next on the same status is not handled
  twice.
- **Check in** (#84): the person drives from Maestro, never from the children. At each of their
  messages, and of its sessions' messages (#131), the panel gives Maestro, under
  « Roadmap — nouvelles de tes sessions enfants », one line per child that is stuck or to archive, and nothing
  when everything moves forward:
  - **waiting for the person's answer** for 15 min: remind them in one line, with the link, on a
    turn they start, or on wake-up if it is not already asked and unanswered (#133);
  - **silent** for 15 min (its step, or « état inconnu »): write to it **once** (`SendMessage` to
    its id) « où en es-tu, qu'est-ce qui te bloque, de quoi as-tu besoin ? », without telling the
    person (its answer arrives at the end of its turn, #133); still at the same point afterwards,
    silent or not, it is a blocker: tell the person in one line, without restarting it;
  - **ready** (all its steps done, not yet merged or closed): § 5 and 6;
  - **to archive** (§ 6), to offer in this very turn: a sub-session's end note arrives through a
    turn of its own, and its news with it.
  No table of all the children each turn: Maestro looks only at what is stuck.
- **Keep Maestro's list** (#104): the app's step list (`update_plan`), pinned under the last
  message, is the person's only marker on their sessions. No `show_widget` card, no table each
  turn.
  - **One step per launched task**, labelled `#<id> <libellé court> · <état>`, the status in plain
    words: « en cours : étape 3/7 », « t'attend : <la question en trois mots> »,
    « attend le simulateur », « en relecture », « prête à fusionner », « livrée ». Example:
    `#99 Priorités et filtres · en relecture`.
  - **In the merge order** of § 5; a delivered task (merged, or closed in Projet mode) is ticked
    (`completed`) and keeps its place at the top.
  - **A single `in_progress` step**, as the tool requires: the one Maestro is dealing with now (the
    one waiting for the person, the one it is reviewing or merging), otherwise the next to merge.
    The others are `pending`.
  - **At each status change** (a sub-session's end of turn, news from the panel, a merge), send the
    whole list again (`items`): only the text after `·` changes, the start `#<id> <libellé court>`
    stays. A new task adds its step.
  - **After each merge or publication, before the next command** (#136): send the whole list
    again, the delivered task ticked with its version (`#130 Sans priorités · livrée 0.78.0`;
    without publication, `· fusionnée`), the next one in progress. In a turn started by the person,
    also say the recap line in the message, without emoji: `#<id> livrée · <version> · <ce qui
    change>`; in a turn woken by a session, nothing more (#133): the list shows it.
    Four merges in a turn means four lists: the box above the input must never call « en cours » a
    task already on `main`. **The panel reminds of it**: it adds the instruction to the result of a
    successful `git merge` in the main folder or of a `release.py release`, and repeats it at the
    end of the turn if the list has not moved since.
  - **No end box without a question while a step remains open** (#133): the app's end box ticks the
    whole list, and the person loses their marker
    (« je n'ai pas le petit menu qui me dit où on en est »). The panel refuses it every time; the turn ends on the message. A question for the
    person goes through a box with `ask`: then post the whole list again (`items`) on the next turn.
  - Once the work is done, all the steps are ticked.
  - **The merge order and the conflicts** are computed from git, read-only: write `maestro.json` in
    the scratchpad (`{"base": "main", "taches": [{"id", "titre", "branche", "tests":
    "verts" | "rouges" (absent: to run), "relue": true | false, "apres": [ids]}]}`, the branch read
    from `list_sessions`, the tests and the review taken from the reports and the diff, `apres` from
    the roadmap), then `python3 "<dossier de la skill>/scripts/etat_maestro.py" <dépôt> <maestro.json>
    --texte` (`--json` to read it as data): status of each branch against `main`, files touched by
    two branches, real conflicts through `git merge-tree`, proposed order. Maestro orders its list
    from it and does not paste its output into the chat; a conflict or a shared file is said in one
    line. The script returns 2 on a `maestro.json` with a duplicate (same id or same branch), or a
    repository or base not found: fix the input.
- **Unblock first**: whatever keeps a sub-session from moving forward comes before everything else.
  Maestro answers itself, by message to the sub-session, what the code, the roadmap or the rules
  settle. The rest goes to the person, one question at a time, and their answer is passed on word
  for word. With the session setting `autonome` (skill `reglages-session`, in Code mode as in Projet
  mode), Maestro also answers itself, with its recommendation, everything that is neither an
  architecture question (a choice that would be written in `docs/decisions.md`) nor a gesture that
  belongs to the person (launching, archiving, a secret, an access), and says so in one line.
  Merging and publishing are not the person's to decide: Maestro never asks them « je fusionne ? »
  or « je publie ? » (#105).
- **Reread before relaying** (#121): right before putting a sub-session's question to the person
  (form, mockup choice), reread its status: `get_session` (`isRunning`) and `list_events` (its last
  message). If it is running, or the answer is already in its transcript: ask nothing, the question
  is settled. An idle session that asks no question (« à archiver », « fini, rien en attente ») is
  not waiting for the person. Same rule as archiving (§ 6, #110). Relay only the questions of its
  own sessions: those of another open Maestro belong to that one.
- **A mockup choice** (#96): a sub-session that is
  « attend une réponse : choix de maquette, <chemin> » has written its mockups in a page. Maestro first rereads its status (above), then opens
  it in the browser pane (`preview_start` with the page's `file://` url, in the sub-session's
  worktree), then puts the question to the person through the form, one option per mockup, its
  preview (`preview`) and its trade-off, the sub-session's recommendation first; their answer is
  passed on word for word. The `autonome` setting does not apply: a visual choice belongs to the
  person.
- **The sub-sessions' proposals** (#67, #132): any session creation a sub-session asks for, its New
  task card (`own_initiative`, `offer`) or the launch the person asked of it (`user_asked`), would
  make a grandchild of Maestro, and the person wants only one level under Maestro. The panel sends
  it up to the root Maestro: by message (« Tâche proposée… » or « Lancement demandé… »), otherwise
  at the person's next message. Maestro opens its line (or attaches it to a line that covers it),
  then proposes it from Maestro: an `own_initiative` card, title `#<id> · <libellé court>`, full
  brief, Maestro clause and the settings of the original card, then says in one line which session
  proposes it and that the person clicks Start. A launch the person asked for counts as consent:
  the card is posted in this turn, without asking them again whether they want it; it is a card and
  not a launch, because the app refuses `user_asked` on a turn woken by a session's message. Maestro
  does not code it, and adds its step to its list once it is launched.
- **The root Maestro** (#132): the highest open ancestor recognised as Maestro by its title or its
  mark, otherwise the highest one that has launched at least two sessions still open. A session
  that has a Maestro above it is never one, even with two sessions launched: its creations go up,
  and its panel treats it as a task session. A session titled or marked Maestro is demoted only by
  a Maestro titled or marked above it. Only a launch elsewhere (another folder, SSH, cloud) stays
  with the sub-session: a card cannot carry it. Grandchildren already born stay where they are.

## 4. Unique resources, the iOS simulator first

iOS simulator, device, database, deployment, publishing a plugin, test account: only one
sub-session at a time, and Maestro is the one that hands it over. With the `autonome` setting, it
hands it over on its own, without asking the person, publishing included, and the sub-session
publishes without asking again (#105); without the setting, nothing changes.

1. The sub-session that needs it says so at the top of its report and ends its turn.
2. Maestro hands it to only one, by message
   (« À toi le simulateur ; rends-le quand tu as fini »), in the priority order of § 5, and says so in the task's step (« · a le simulateur »).
3. The sub-session tests its branch, fixes by itself what the test finds, then hands it back.
4. Maestro hands it to the next one.

In a project with locks (`verrou:` set by onboarding), Maestro is the one that sets the lock on the
designated sub-session's line, and removes it when the sub-session hands back. A sub-session never
takes a resource without Maestro's go-ahead, even if it is free.

## 5. Prioritise and merge

The merge order, from the first criterion to the last:

1. **Ready**: tests green on its branch, diff reviewed by Maestro, up to date with `main`.
2. **Prerequisites first**: what unblocks other tasks (`après:`) goes ahead.
3. **What frees** a unique resource or a file another task is waiting for.
4. **When tied**, the smallest, the least exposed to conflicts.

The merge itself:

- **Who decides**: without the `autonome` setting, the merge waits for the person's click. Maestro
  proposes it to them, one branch at a time, through the end box (`wrap_up`, button
  « Fusionner #N »), which counts as that click. Maestro checks the branch again before merging.
  Resolving a merge conflict is the case where Maestro codes (table at the top): it resolves in the
  branch keeping both intentions, reruns its tests, then updates its list. With the setting,
  Maestro merges a ready branch on its own, and publishes on its own what needs publishing (a
  plugin release, a deployment, a push of `main`), without waiting or asking: the setting is the
  person's standing authorisation to merge and publish. It then says in one line what it did.
  « Relue » means the diff read by Maestro, which did not write it. Launching a session and
  archiving always keep the person's click.
- **One branch at a time**, on an up-to-date `main`, by the project's merge rule (projects set up
  by onboarding: « Finir un chantier »). Never two merges at the same time.
- **As soon as a branch is ready** (#131): its session's message is enough, Maestro reviews it and
  merges it (without the `autonome` setting, proposes it) without waiting for the other sessions to
  finish.
- **Fast but right, several ready at the same time** (#136): merge them one after the other, in the
  order above, without waiting to have finished everything, but one at a time and each one in
  full: update it from `main` (after the previous one's merge), review its diff, rerun its tests on
  that updated branch, merge, publish, send the list again and say the recap line, and only then
  the next one. **One publication per merge** (the person's choice, 2026-10-30, rule
  « Finir un chantier » of the projects set up by onboarding): each task has its version, which its recap line
  and the final sheet state, and a mistake is undone task by task. A branch that is red on an
  up-to-date `main` leaves the series: it goes back to its session, the others continue.
- **After each merge**: rerun the tests on `main`, then notify right away, by message, the
  sub-sessions whose line carries `après:` on the merged task (it can start or resume) and those
  whose branch touches neighbouring files (update it).
- **A conflict** is resolved keeping both intentions; an intention that is not clear is asked of
  the sub-session concerned.

## 6. Close a task, then Maestro

- **After the merge**, Maestro ticks the line (`fait:`, what was delivered, the PR), moves it to the
  top of `ROADMAP-fait.md` and writes its bilan from the sub-session's last report.
- **The finished sub-session**: the panel checks it (its line closed and its commits in its base
  branch, `main` without it, or pushed, or, without a line, its branch merged and its step list
  done; nothing uncommitted in its worktree; no question; no open session of its own; in Projet
  mode, the line alone; a remote session cannot be checked from here) and calls it « à archiver ».
  A pinned session does not appear there: `archive_session` refuses it. Maestro offers to archive
  them all in a single click: end box with « Archiver #A et #B ? » and a reply button
  « Archive-les »; on the click, `archive_session` for each, then one line on what is archived or
  refused. Only the person's click archives.
- **Archive on both sides, without duplicates** (#110): the finished sub-session also offers its
  own archiving (« Archiver cette session ? »), and the person can click there. So:
  - **without delay**: Maestro asks « Archiver #A ? » in the very turn where the session is called
    to archive, not at the next message; this question comes before any other in its end box
    (another decision goes into an `AskUserQuestion` form);
  - **check before asking**: right before, reread `list_sessions` with `{"linked": true}`; an
    archived session no longer appears there, and Maestro offers only those still there, no
    question if none remain;
  - **the panel guarantees it**: a Maestro end box that still names an already archived session is
    refused, with the numbers to remove; Maestro posts it again without them.
- **Archiving closes nothing, and loses nothing** (#124): a task's line is ticked only by Maestro,
  after the merge. A sub-session whose line is still open does not offer its archiving (the panel
  refuses its end box), and its closing sheet says « #N close par Maestro le AAAA-MM-JJ » once the
  line is closed. Archived anyway (sidebar, click too early), it appears in Maestro's news for 7
  days: « archivée avant la clôture de sa ligne », with its branch merged or not. Merged, Maestro
  ticks the line with its bilan (the last report stays readable through
  `search_session_transcripts`); not merged, its branch stays: Maestro reviews it and merges it
  (§ 5), or unarchives it (`unarchive_session`) if it has work left.
- **Maestro's final sheet** (#136, mockup B): on the turn where it offers its archiving, in ADHD
  mode, its answer ends on the closing sheet of #123 (`| Fin | Maestro · <le lot> |`, Mission,
  Livré, État, À toi, Session), then the table of its tasks, one row per task it launched:
  `| Tâche | Livré | Version | État |` (`| #130 Sans priorités | plus de pastille P1/P2/P3 | 0.78.0 |
  close |`). The panel refuses Maestro's « à archiver » end of turn without that table. A task still
  open is not « close » in it: the sheet is posted only once all its lines are ticked.
- **Maestro finishes** when all its lines are ticked: end box (`wrap_up`) with the question
  « Archiver cette session ? » and the reply button « Oui, archiver » first
  (`actions: [{"label": "Oui, archiver", "message": "Oui, archive cette session."}]`: the app does
  not offer the `archive` app button). On that click, and on it alone, `archive_session` with
  `session_id: "self"`.

## What the Roadmap panel does for Maestro

- It recognises Maestro by its title « Maestro … » (or by the alias « Lot … » of old titles), by
  the mark set when the person says « Maestro » in it, or by its launched sessions still open (at
  least two).
- Its brief (« Maestro ») counts only its own sessions: those of another open Maestro fit on a
  separate line, with no question to relay. « Attendent la réponse » means idle with an open
  question (form, end-box question, « attend une réponse : … » at the top of the recap), quoted in
  full; idle without a question, the session is « au repos, aucune question » (#121).
- It never marks it « en cours » on a task, and does not offer it archiving when the number in its
  title gets ticked.
- A line opened by Maestro reminds it to launch its session instead of coding it.
- The ▶ launched from Maestro puts the Maestro clause into the sub-session's brief.
- Any session creation asked for in a sub-session or further down (New task card, `offer`,
  `user_asked` launch) does not stay there: it goes up to the root Maestro (§ 3); an `offer`
  without a brief or a `fork` card goes back to the sub-session, to be posted again as
  `own_initiative` `fresh`.
- Each sub-session records its step list, its pending question and its last recap; at each of the
  person's messages, Maestro receives the children stuck for 15 min and those to archive (§ 3,
  "Check in").
- Each sub-session notifies Maestro by message of the status in which it ends its turn, and of its
  form question, once per status, even while others are still running (§ 3,
  "Act on its message", #131).
- It recognises a Maestro turn woken by a session (§ 3, #133): it reminds it to write nothing
  except a need of the person, does not ask for the block, does not send its end-of-turn reminder
  as a message, and refuses once the box that asks a pending question again. It also refuses the
  end box without a question while Maestro's step list has an open step (it would tick all of it).
  On the person's turns, its ADHD-mode reminder asks for the stable marker
  « Maestro · N en cours · N t'attend ».
- It refuses Maestro's end box that offers to archive an already archived session (§ 6, #110).
- It does not restart a sub-session with the reminder « la roadmap n'a pas bougé »: Maestro keeps
  its line (#124). It refuses its end box « Archiver cette session ? » while its line is open, and
  gives it the État sentence once closed; it flags to Maestro a sub-session archived before its
  line was closed (§ 6).
- It refuses once the end box that asks again to launch a card posted in the turn or a linked
  session already running (§ 2, #122).
- Maestro's brief and the children's news remind it to keep its step list (§ 3); it no longer asks
  for a card (#97 removed by #104).
- After a merge into `main` or a publication, it reminds Maestro to send its step list again and
  say its recap line (in the command's result), then says it again at the end of the turn if the
  list has not moved (§ 3, #136); it refuses its « à archiver » end without the table of its tasks
  (§ 6).
- Any session, Maestro included, that works (at least two tools in the turn) without having posted
  a step list gets a reminder at the end of the turn, in Code mode as in Projet mode (#98, #104).
