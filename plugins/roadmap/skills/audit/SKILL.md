---
name: audit
description: "The single audit of a roadmap-plugin project's roadmap, with or without code (#176: the folder says which): structure (split bundles into a parent and dated children, two levels, après: dependencies, groupings, duplicates, gaps), then one question per late or undated task and per misplaced priority, the recommendation first (reschedule, done, pause, drop), and closing on proof where the project says (preuves). Writes through the tasks skill, which follows ecriture. Runs as a scheduled task too: only what is clear gets written, the rest waits in ROADMAP-questions.json, counted by priority. Triggers on « audite ma roadmap », « fais le ménage dans ma roadmap », « nettoie ma roadmap », « fais le doctor de ma roadmap », « découpe mes tâches », « cherche les doublons dans ma roadmap », « qu'est-ce qui est en retard », and at the end of onboarding. Not for the project's structure (doctor), importing a roadmap (onboarding), nor adding or marking done one named task (tasks)."
---

# Audit the roadmap

The person speaks French: talk to them in French, and write task labels, notes, questions and
proofs in French, as the roadmap does. Only this skill is in English.

## What the skill guarantees

The doctor says whether the project is **wired**. The audit says whether its roadmap is
**steerable**: one task per action, dated, with its owner and dependencies, one copy of each
subject, every delay settled by a question, every task done on proof marked done.

- **Nothing is written without validation**, except, unattended, a done on clear proof.
- **No word is lost.** A split is refused if a fragment of the original label is not found, word
  for word (stop words aside), in the task that receives it or in its parent.
- **All or nothing, with a backup.** Files are prepared in memory, checked, backed up, then written
  in one go.
- **The project's rules win.** `ROADMAP-REGLES.md` (#167, next to `ROADMAP.md`, or the file the
  `regles` key declares) and what `.claude/roadmap.json` declares (`ecriture`, `preuves`,
  `requis`, `cles`) are read on every pass, never copied here. Read the rules file **in full**
  before proposing anything: a task it says should never exist is proposed for dropping.

**The model** (#125): a task is **standalone**, **parent** (a subject: other tasks name it in
`parent:`) or **child** (it carries `parent:`), two levels at most. A parent carries a subject
name, not an action; its children are work steps (2 to 6), not gestures. `après:` links two
siblings, or two parents; never one subject's child to another's. A parent's date is the date of
its next open child: never propose one (a `due:` set on it stays the subject's final deadline).
Priority goes on a parent or a standalone task, never on a child, and is never proposed where
there is none (#130).

The script is `scripts/audit.py`, run from this skill's folder (the path given when the skill
loads). It reads the grammar through the `onboarding` skill's importer; answers are written by
the `tasks` skill's `tasks.py`. With code both read and write the roadmap of the main
checkout, on `main`.

## 1. Survey

```bash
python3 "<skill folder>/scripts/audit.py" survey <project folder> > <scratchpad>/survey.json
```

A roadmap where a task has no `id:` is refused: run the import first (`onboarding` skill,
« Importer une roadmap existante »).

Then read the project's rules file in full (`tasks.py context` gives its path under
`declarations.regles`). Missing: as in the `tasks` skill, set it from the template
(`onboarding.py regles <project folder>`) and say so, unless a declared `regles` path is missing:
then stop.

It returns (French keys, shared with `tasks`): each open task with its `fragments` (the label cut
at « ; » outside parentheses), `paquets` (two fragments or more), `trous` by type (a parent with
an open child is never `sans_due`), `doublons_possibles` (pairs with close words or subject,
threshold 0.3: a lead, not a verdict), `heritage` (the keys a child takes from its parent),
`pistes_preuve`, `questions` and `en_attente` (below).

## 2. Pending questions first

`en_attente` lists the questions left by an earlier unattended run (`ROADMAP-questions.json`,
next to `ROADMAP.md`; those whose task is no longer open are dropped). Ask them first (step 5),
then mark them answered:

```bash
python3 "<skill folder>/scripts/audit.py" pending <project folder> --resolve <key> [<key> …]
```

## 3. Structure proposals

Claude reads **all** the tasks of the survey, not only the computed pairs, and writes
`<scratchpad>/proposals.json`:

```json
{
  "survey": "<scratchpad>/survey.json",
  "inherit": ["fiche", "projet", "dept"],
  "splits": [{
    "id": "30",
    "parent": {"label": "Vendor agreement de Little Zoo", "note": "(regroupement validé par Caroline, 27/10)", "fields": {}},
    "parent_fragments": [],
    "children": [
      {"key": "n1", "label": "Plan envoyé à Jason", "fragments": [0]},
      {"key": "n2", "label": "Attendre leur bid et les payment milestones", "fragments": [1], "fields": {"attend": "Little Zoo"}},
      {"key": "n3", "label": "Puis envoyer la Deal Request à Linda et le vendor agreement", "fragments": [2]}
    ]
  }],
  "groups": [{"parent": "20", "children": ["21", "23"]}],
  "merges": [{"keep": "12", "drop": "31", "label": null}],
  "closures": [{"id": "7"}],
  "after": [{"id": "n3", "after": ["n2"]}],
  "values": [{"id": "18", "field": "resp", "value": "Caroline"}]
}
```

An existing task is named by its `id:`, a task created by the audit by its `key` (`n1`, `n2`…,
unique in the file). An unknown key is refused, as is a wrong type (`"after": "12"` instead of
`["12"]`). A task merged or closed by the audit can no longer be targeted: target the kept one.

`fields` are checked as the panel checks them: dates as YYYY-MM-DD, `prio` 1, 2 or 3, keys of the
grammar or declared in `roadmap.json`. They never carry `id`, `qui`, `branche`, `verrou`, `fait`,
`parent` or `après`: the audit sets `parent:` itself (split, group) and `après:` goes through
`after`.

**Splitting a bundle**:

- **One child per work step**, 2 to 6 per parent: a step one ticks
  (« Analyser la data et checker l'EFC »), not each gesture. The common subject (often the text before the first « : ») becomes
  the parent's label: a subject name, without an action.
- **A child is not split**: its pieces become siblings under its parent (no third level).
- **Each fragment has one target**: a child (`fragments`) or the parent (`parent_fragments`). Its
  words stay: rephrase (order, infinitive verb added), never cut. A word may move into a field
  (« Thierry : envoyer… » → `attend:Thierry`), but a weekday moved into `due:` stays in the label
  (« lundi » is not in `2026-11-02`).
- **A date in parentheses with a name** (« (Caroline, 28/10) ») says who spoke and when: not a
  deadline. A child gets its own `due:` only if its fragment names a real deadline (« lundi
  02/11 », « d'ici le 05/11 », « la semaine du 09/11 » → that Monday); otherwise it inherits its
  parent's `due:`.
- **Context** (an attribution, « (regroupement validé par Caroline, 27/10) ») goes into the
  parent's note or label; a fragment that is only a state (« accès ShotGrid confirmé ») goes into
  the note of the task it explains.
- Children take from their parent `ouvert:`, the axis, the required fields they lack (`après:-`
  otherwise) and the `inherit` keys; never `ref:`.

**Dependencies**: those the text states (« puis », « après », « une fois… », « attendre … avant »),
between siblings (two siblings without `après:` run in parallel) or between parents.

**Groupings and duplicates**: two open tasks on the same subject → a **merge** (keep the more
precise label; the other closes « (fusionnée dans #N) »); distinct tasks of one piece of work → a
**group** under a parent, existing or new (`{"key", "label", "axis", "fields"}`). Two parallel
tasks of different projects (ROB and DET) are not duplicates.

**Other gaps** (`sans_resp`, `a_relancer`, `parent_introuvable`): one value per task, taken from
the text, in `values`. A parent whose children are all done goes in `closures`. Dates are not
values any more: they are per-task questions (step 4).

## 4. Per-task questions and proofs

The survey's `questions` hold one question per task, already sorted by priority (`prio:1` first;
a child counts its parent's), each with its `options`, the recommended one first, each option
carrying its `operations` for `tasks.py write`:

| `kind` | When | Options |
|---|---|---|
| `late` | `due:` before today | reschedule to next Monday, done, pause, drop |
| `undated` | no `due:` (a parent with an open child never is) | date to next Monday, done, pause, drop |
| `prio_on_child` | a child carries `prio:` | move it to the parent, or remove it |

The recommendation: a proof lead → « Faite » at the lead's date; more than 30 days late → « En
pause »; otherwise the date. A line taken by a session only offers reschedule and done; a parent
with an open child only offers two dates. **Pause** (#159): `due:` becomes the resume date (the
Monday after four weeks), the task moves to « Plus tard », its note says « (en pause depuis le
JJ/MM : raison) ».

**Look for proof** where `preuves` says, before asking about a late task:

- a **path**: the survey's `pistes_preuve` lists files dated between the task's opening and today
  that carry most of its words. Read each lead;
- a **source** `<source>:<query>` (`gmail:in:sent`): through the session's matching connector;
  without one, say so;
- `#<title>`: the section of the `regles` file, which says where to look;
- nothing declared: with code, `git log` and PRs.

A **clear** proof (the email sent, the deliverable filed) → the `done` option, `date` = the date
of the proof, `proof` = what proves it and where; adjust the option if you found it elsewhere. A
**partial** proof → a `partial_proof` question: « Cocher », « Laisser ouverte », « Réécrire sur ce
qui reste ». Correct an option when the context says better (a closer call day, the project's
`regles`), and say so.

## 5. Validate

Through the multiple-choice form, the recommendation first, **four questions at most per round**,
each readable on its own (the task's label in it, never « the previous one »); the person may
answer in writing, and their answer corrects the proposal:

1. Pending questions (step 2), in priority order.
2. **Inheritance**, one question: « Les sous-tâches reprennent de leur mère : fiche, projet, dept ? ».
3. **One bundle per question**: the preview shows the parent and its children, one line each with
   `due:`, `resp:`, `attend:` and its `après:`. « Découper ainsi (recommandé) », « Laisser tel quel ».
4. **One question per merge and per group**, both labels in the preview.
5. **Dependencies** outside bundles, by group; the **other gaps**, one question per type.
6. **The per-task questions** (step 4), in the survey's order.

On a large roadmap (more than 40 bundles or 60 tasks), offer a scope first (an axis, the longest
bundles, the late tasks); the scope the person names wins. Drop from the JSON what is refused,
fix what is changed.

## 6. Write

**Structure** first:

```bash
python3 "<skill folder>/scripts/audit.py" apply <project folder> --proposals <scratchpad>/proposals.json
```

A refusal (« Refusé : … ») leaves nothing written and names the problem: a fragment without a
target, a lost word, the roadmap changed since the survey (run the survey again and redo the
proposals), a line taken by a session, an unknown id, a loop, a wrong date. Fix and run again.
Otherwise it shows the bilan as is: bundles split and children created, fragments found (n of n),
groups, merges, closures, dependencies, values, counts before and after, ids created, backup.
When the project declares `ecriture`, it writes nothing and prints the lines: hand them to the
project's tool, as `ecriture.consigne` says.

**Answers** next, through the `tasks` skill (it follows `ecriture` itself): run `tasks.py context`
again (the structure changed the roadmap), put the chosen options' `operations` into
`<scratchpad>/operations.json` (`{"context": …, "operations": […]}`), then `tasks.py write`, dry
run first, then `--apply` or the project's tool, as the `tasks` skill says. Never write those
lines another way.

## 7. Check and report

1. `python3 "<onboarding skill folder>/scripts/onboarding.py" verifier <folder>`
   (« Conforme au format. »).
2. In a repository: a commit of the roadmap files only (`ROADMAP.md`, `ROADMAP-fait.md`,
   `ROADMAP-bilans.csv`, `ROADMAP-questions.json`), on `main` in the main checkout with code,
   then push. Backups are not committed; offer to delete them once the roadmap is read in the panel.
3. A short report, in French: what was written (the bilans), what was refused and stays a gap,
   and the pending questions' summary line (« Questions en attente : 3 (prio:1 : 1, sans
   priorité : 2) »).

## Unattended (scheduled task)

When a scheduled task runs the audit (the prompt says so) or nobody can answer, show no form:

1. Survey; look for proofs (step 4). Write only the `done` operations whose proof is **clear**,
   through `tasks.py write` (step 6). Apply no structure change.
2. Every other question waits: the survey's `questions` you did not settle, the `partial_proof`
   ones, and each structure proposal as a `structure` question (its options carry `proposals`, a
   piece of proposals.json, instead of `operations`). Write them to a JSON list and add them:

   ```bash
   python3 "<skill folder>/scripts/audit.py" pending <project folder> --add <scratchpad>/questions.json
   ```

   A key already waiting is replaced, so the next run asks the latest version. When the `regles`
   file names another place for pending questions (at Blur, the `_inbox/` sas), put them there,
   as it says, instead.
3. The report ends with the `resume` line `pending` prints: how many questions wait, by priority.
   The next attended audit asks them first (step 2).

## What the skill does not do

- It never reopens, renumbers or rewrites a closed task.
- It does not touch a line taken by a session, except its values, dependencies, reschedule and
  done.
- It does not carry over a recurring task (`tous:`): the panel does (« Marquer faite »).
- It never writes next to the project's tool when `ecriture` is declared.
