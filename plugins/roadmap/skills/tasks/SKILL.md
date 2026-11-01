---
name: tasks
description: "Keeps the roadmap of a roadmap-plugin project up to date day to day, with or without code (#176: the folder says which): adds, updates, reschedules, marks done on proof or drops a task, after matching it against the tasks on the same subject (never a new task for a subject that already has one). Reads what the project declares in .claude/roadmap.json: its own rules (regles), which win, its writing tool (ecriture) and where to look for proof that a task is done (preuves). A script writes all or nothing, dry run first. Triggers on « ajoute ça à la roadmap », « rappelle-moi de… », « mets une tâche pour… », « coche », « c'est fait », « marque #12 faite », « redate », « décale à lundi », « abandonne cette tâche », add this to the roadmap, mark it done, and when a conversation produces a dated action not to lose. Not for auditing the whole roadmap (audit), setting up a project (onboarding), checking it is wired (doctor), nor a folder that keeps its roadmap through its own skill without .claude/roadmap.json."
---

# Keep the roadmap

The person speaks French: talk to them in French, and write task labels, notes and proofs in
French, as the roadmap does. Only this skill is in English.

## What the skill guarantees

- **One subject, one task.** Before writing, every action is matched against the open and closed
  tasks on the same subject; an action already covered never creates another task.
- **Three places, three jobs** (#167): this skill says *how* to write a task; the project's
  `ROADMAP-REGLES.md`, next to `ROADMAP.md`, says *what* becomes a task and what never does; the
  roadmap says *where* each task stands.
- **The project's rules win.** `ROADMAP-REGLES.md` and what `.claude/roadmap.json` declares
  (`regles`, `ecriture`, `preuves`, `requis`, `cles`) are read on every pass, never copied here.
- **All or nothing.** The script prepares in memory, checks, shows (dry run), then writes in one go
  after a backup, or hands the lines to the project's tool.
- **A task is marked done on proof**, at the date of the proof, with its bilan row.

**The model** (#125): a task is **standalone**, **parent** (a subject: short title, keys, rhythm,
priority, no action) or **child** (a step, `parent:N`), two levels at most. `après:` links two
siblings, or two tasks without a parent; never the child of one subject to the child of another.
A parent's date is the date of its next open child: the panel computes it, never write it (a
`due:` set on a parent stays the subject's final deadline). Priority goes on the parent or the
standalone task, never on a child. Marking the last open child done closes its parent too, except
a recurring parent (`tous:`), which stays open for the next period's steps.

The script is `scripts/tasks.py`, run from this skill's folder (the path given when the skill
loads). It inherits the `audit` skill's writing engine and reads the grammar through the
`onboarding` skill's importer. With code it reads and writes the roadmap of the main checkout,
on `main`.

## 1. Context

```bash
python3 "<skill folder>/scripts/tasks.py" context <project folder> > <scratchpad>/context.json
```

It returns (French keys, shared with the audit): `prochain_id`, `requis`, `cles` and
`cles_valeurs`, `axes`, `sections`, the open tasks (`taches`, with `parent` and `enfants`), the
closed ones (`closes`), `parents` (each one's date) and `declarations`:

- **`regles`**: the project's rules file, always there (#167): `ROADMAP-REGLES.md` next to
  `ROADMAP.md` (`defaut: true`), or the file the `regles` key declares. Read it **in full**, on
  every pass, before anything else: what becomes a task, what never does, the project's rules.
  They win over this skill's (a filter on what becomes a task, key prefixes, a call day). An
  action it says never becomes a task is not written; say so in one line.
  Missing with `defaut: true`: set it from the template with
  `python3 "<skill folder>/../onboarding/scripts/onboarding.py" regles <project folder>`, say so
  in one line (to fill with the person, committed with the roadmap), read it, go on. Missing with
  `defaut: false` (a declared path): stop and say so; writing without them would go against the
  project.
- **`ecriture`** set: you will not write yourself (step 4). `ecriture_illisible`: nothing gets
  written; ask to fix `.claude/roadmap.json` (the `doctor` skill names the problem).
- **`preuves`**: where to look for proof that a task is done (step 3).

A roadmap where a task has no `id:` is refused: run the import first (`onboarding` skill,
« Importer une roadmap existante »).

## 2. Match by subject, before writing

```bash
python3 "<skill folder>/scripts/tasks.py" match <project folder> --text "<action 1>" --text "<action 2>"
```

For each action: the nearby open and closed tasks (`score`: the share of the action's words they
carry; a child also counts its parent's label), their `role` and a `cas_probable`
(`couverte_ou_a_etoffer`, `deja_faite`, `nouvelle`). The score is a lead: read the labels, and put
each action in **exactly one case**:

| Case | What happens |
|---|---|
| Already covered | nothing, except a more precise date (`reschedule`) |
| To expand | one more child under the existing parent; a standalone task that gets a step becomes a parent |
| Already done | nothing |
| New | a task, with its date and priority |
| Contrary to an open task, with no reason given | a question |

**Never a new task for a subject that already has one.** Two actions of the same batch on one
subject: the second goes under the first (`parent` set to its `key`).

## 3. Mark done on proof

A task is done when clear proof says so: an email sent, a deliverable filed, a commit, a note. Look
for it where `preuves` says:

- a **path** (`_inbox/_traite/`, `40-deliverables/emails/`): read what is dated after the task
  was opened;
- a **source** `<source>:<query>` (`gmail:in:sent`): through the matching connector of the
  session; without a connector, say so and ask;
- `#<title>`: the section of that name in the `regles` file, which says where to look;
- nothing declared: the conversation and the action's source; with code, `git log` and PRs.

The `date` is **the date of the proof**, not today. A partial proof is asked about.

## 4. Write

Write `<scratchpad>/operations.json`:

```json
{
  "context": "<scratchpad>/context.json",
  "operations": [
    {"op": "add", "key": "n1", "label": "Vendor agreement de Little Zoo", "axis": "rob", "section": "Prochain", "fields": {"due": "2026-11-06", "resp": "Caroline", "prio": "2"}},
    {"op": "add", "key": "n2", "parent": "n1", "label": "Envoyer le plan à Jason", "fields": {"due": "2026-11-03"}},
    {"op": "add", "key": "n3", "parent": "n1", "label": "Envoyer la Deal Request à Linda", "fields": {"après": ["n2"]}},
    {"op": "update", "id": "41", "fields": {"attend": "Jason", "dept": "Bidding"}},
    {"op": "reschedule", "id": "18", "due": "2026-11-05"},
    {"op": "done", "id": "12", "date": "2026-10-30", "proof": "email envoyé à Jason le 30/10 (40-deliverables/emails/…)"},
    {"op": "drop", "id": "7", "reason": "remplacée par le vendor agreement"},
    {"op": "pause", "id": "22", "until": "2026-11-30", "reason": "budget gelé jusqu'à la clôture"}
  ]
}
```

- **add**: `key` (unique, not a number), `label` (in French: an infinitive verb and its object; a
  parent carries a subject name), `axis` (inherited from the parent for a child), `parent` (an `id`
  or a `key`), `section` (default « Prochain », else the first open section), `note`, `fields`.
  The id is the next free one. A child is written under its parent, after its other children, and
  takes the required fields it lacks (`après:-` otherwise) and the parent's category keys.
- **update**: `fields` (never `id`, `qui`, `branche`, `verrou`, `fait`); `parent` and `après` are
  allowed, and checked. `null` removes an optional key (a `prio:` set on a child); a required key
  is never removed.
- **reschedule**: `due`.
- **done**: `date` (the date of the proof), `proof` (what proves it, and where). The line moves to
  the top of `ROADMAP-fait.md`, its bilan row to `ROADMAP-bilans.csv` (« Faite : <proof> »). A
  recurring standalone task (`tous:`) is marked done with the panel's « Marquer faite » button,
  which carries it over.
- **drop**: `reason`; « (abandonné) » at the end of the label, like the panel's « Annuler la tâche ».
- **pause** (#159): `until` (the resume date), `reason`. `due:` becomes `until`, the note gets
  « (en pause depuis le JJ/MM : <reason>) », and a task without a parent moves to « Plus tard »; a
  child stays under its parent. Refused on a line taken by a session and on a parent with an open
  child.

Then the **dry run**, always:

```bash
python3 "<skill folder>/scripts/tasks.py" write <project folder> --operations <scratchpad>/operations.json
```

It shows the rendered lines and writes nothing. A refusal (« Refusé : … ») leaves nothing written
and names the problem: missing required field, undeclared key or value outside its list, unknown
axis or section, wrong date, third level, `prio:` on a child, `après:` to another parent's child
or in a loop, a line taken by a session (`qui:` and `branche:`, which can only be rescheduled or
marked done), a parent with an open child, the roadmap changed since the context (run `context`
again). Fix the operations, or ask the missing question, and run it again.

Then:

- **without `ecriture`**: run again with `--apply`. It backs the files up in
  `sauvegarde-tasks-…/` next to the roadmap, then writes everything in one go;
- **with `ecriture`**: `--apply` is refused. Hand the dry run's lines to the project's tool
  (`ecriture.outil`), as `ecriture.consigne` says (at Blur: `patch.py <spec>`, dry run then
  `--apply`, the note, the fiches and the roadmap in one go).

## 5. Check and report

1. `python3 "<onboarding skill folder>/scripts/onboarding.py" verifier <folder>`
   (« Conforme au format. »).
2. In a repository: a commit of the roadmap files only (`ROADMAP.md`, `ROADMAP-fait.md`,
   `ROADMAP-bilans.csv`), on `main` in the main checkout with code, then push. The backup is
   not committed.
3. A short report, in French: for each action, its case and what was written (`#N` ajoutée sous
   `#P`, cochée au …, rien : déjà couverte par `#M`); then the pending questions.

## What gets asked, and nothing else

Through the multiple-choice form: four questions at most per round, the recommendation first,
each question readable on its own (the task's label in it, not « the previous one »):

- an action **contrary** to an open task, with no reason given;
- the **date** of a new task that the source does not give (recommendation: the next occasion,
  for instance the next call);
- a **partial proof** (« Cocher », « Laisser ouverte », « Réécrire sur ce qui reste »);
- the **rhythm** of an ongoing subject (`tous:semaine`, `tous:mois`…);
- **reopening** a closed task.

Everything else is done without a question and said in one line: the case of a clear match, what
a child inherits, the id, the default section.

## Unattended (scheduled task)

Nobody answers: write only what is clear, show no form. Each question waits where the `regles`
file says; otherwise in the report, with the task it concerns. The report ends with the number of
pending questions, by priority (`prio:1`, `prio:2`, `prio:3`, no priority; a child counts its
parent's).

## What the skill does not do

- It does not audit the whole roadmap (bundles to split, duplicates, gaps): `audit` skill.
- It does not recompute or carry over a recurring task: the panel does (« Marquer faite »).
- It never reopens, renumbers or rewrites a closed task without a question.
- It never writes next to the project's tool when `ecriture` is declared.
