---
name: tasks
description: "Keeps the roadmap of a roadmap-plugin project up to date day to day, with or without code: adds, updates, reschedules, marks done on proof (or partially: follow-up at the third party it waits on) or drops a task, after matching it against the tasks on the same subject (never a new task for a subject that already has one). Reads what the project declares in .claude/roadmap.json: its own rules (regles), which win, its writing tool (ecriture) and where to look for proof that a task is done (preuves). Writes all or nothing, dry run first. Triggers on « ajoute ça à la roadmap », « rappelle-moi de… », « mets une tâche pour… », « coche », « c'est fait », « marque #12 faite », « redate », « décale à lundi », « abandonne cette tâche », add this to the roadmap, mark it done, and on its own when a new idea or action comes out (#216). Not for auditing the roadmap (audit), setting up a project (onboarding), checking it is wired (doctor), nor a folder keeping its roadmap by its own skill without .claude/roadmap.json."
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
  Except its « Règles de l'outil » section (#276): the plugin's own rules, the same in every
  project, which no project rule overrides.
- **All or nothing.** The script prepares in memory, checks, shows (dry run), then writes in one go
  after a backup, or hands the lines to the project's tool.
- **A task is marked done on proof**, at the date of the proof, with its bilan row.
- **The same report after every write** (#232): the script prints it as plain lines (#275),
  one `- Roadmap :` bullet per task, each question in its own quote; they go as is under the
  verdict of the answer, then one form
  settles what waits. With the roadmap plugin (#244), the plugin computes those lines itself from
  what the turn wrote, whatever wrote it, and hands them with the write's result: put the plugin's
  lines then, not the script's as well, and never in a second message.

**The model** (#125): a task is **standalone**, **parent** (a subject: short title, keys, rhythm,
no action) or **child** (a step, `parent:N`), two levels at most. `après:` links two
siblings, or two tasks without a parent; never the child of one subject to the child of another.
A parent's date is the date of its next open child: the panel computes it, never write it (a
`due:` set on a parent stays the subject's final deadline). Priority is yes or no, on any task,
child included (#300): `prio:oui`, or no `prio:` at all; the old scale `prio:1`, `2`, `3` is no
longer written (see « Migrating the old priorities »). Marking the last open child done closes its parent too, except
a recurring parent (`tous:`), which stays open for the next period's steps. A child has no axis
of its own (#190): it takes its parent's, and the roadmap check refuses a child whose axis differs
from its parent's; a parent whose axis changes in the panel takes its open children with it.

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
python3 "<skill folder>/scripts/tasks.py" match <project folder> --text "<action 1>" --text "<action 2>" \
  --field client=Martin --field attend=Martin
```

For each action: the nearby open and closed tasks (`score`: the share of the action's words they
carry, each word weighed by its rarity in the roadmap; a child also counts its parent's label), the
words they share (`communs`), their `role` and a `cas_probable` (`couverte_ou_a_etoffer`,
`deja_faite`, `nouvelle`). A word's weight is ln(1 + N/df)², over the open and closed labels (#255):
a name, a code or a supplier that few tasks carry weighs much more than « point », « envoyer » or
« message », and a word no task carries weighs as a frequent one. A task covers the action from a
score of 0.5 with at least two shared words (one, for a one-word action): a rare name alone shows
the task, without calling the action covered.

**Words are not enough: match by what structures the project (#538).** Two tasks on one subject
said with different words share no telling word (« Relancer Martin pour le devis », « Obtenir le
chiffrage de Martin »), above all in a project without files. So `match` also compares **marks**:
the keys the project declares (`cles`: `client`, `type`…), `attend` (without its parenthesis,
never a `#N` nor yourself) and `resp` (never yourself). A task carries a mark by its field (its
parent's for an inherited key) or because its label says a known value in whole words; the action
carries its own by `--field key=value` (repeat it; give every field the `add` will have) and by
the known values its text says. A mark carried by more than 3 open tasks and more than a quarter
of them says nothing. `match` gives `meme_structure`: the open tasks on the **same subject** (the
word rule above, or two shared marks, or one mark and a shared word outside the shared values),
each with its `marques`, its words `hors` the values, and `net`: the word rule, or two marks and
a shared word, or one mark and two shared words worth 0.25 of the action's, and no candidate of
another family (a parent and its children). `closes_meme_structure` gives the closed ones.
`cas_probable` says `couverte_ou_a_etoffer` as soon as an open task is on the same subject.

**Update before creating.** When an open task is on the same subject, the action goes into it: an
`update` with `append` (and the new facts in `fields`), a `reschedule`, or a child under it when
it is a parent. An `add` is the exception, and it says why in `distinct`, naming the nearest task
(« #12 is the quote, this is the invoice »). The score and the marks are leads: read the labels of
the five nearest tasks and judge the meaning, then put each action in **exactly one case**:

| Case | What happens |
|---|---|
| Already covered | nothing, except a more precise date (`reschedule`) |
| To expand | one more child under the existing parent; a standalone task never becomes a parent: an empty parent is created and both go under it (#552) |
| Already done | nothing |
| New | a task, with its date (and `prio:oui` when it is said to be a priority) |
| Contrary to an open task, with no reason given | a question |

**Never a new task for a subject that already has one.** Two actions of the same batch on one
subject: the second goes under the first (`parent` set to its `key`).

`write` holds this rule (#288, #538), in both kinds of project: an `add` without `parent` whose
subject an open task already has (`meme_structure` above) is not written as a new line.

| The match | What `write` does |
|---|---|
| Clear (`net`), the task is a free leaf | pours the action into it without a question: `append` to its label, the `add`'s new marks set as fields, its `src:` joined; the report says « complétée d'office (même sujet : …) » and the bilan lists it in `versees` |
| Clear, the task is a parent | writes the `add` under it, without a question |
| Clear, the task is taken by a session (`qui:` and `branche:`) | a `subject` question, never a silent write (the task may be tested already): « Tâche à part, suite de #N (recommandé) », « Verser dans #N, tenue par la session de … » (a relay, as in #320), « Ne rien ajouter » |
| Same subject, not clear | a `subject` question: « Mettre à jour #N (recommandé) » (two candidates at most; « Sous #M » for a parent), « Tâche à part » (the same `add`, with `distinct`), « Ne rien ajouter » |

An `add` that other operations of the batch point to (its `key` as their `parent` or `après:`)
is never poured silently: it and they become the question (an `add` with children of its own
leaves its place to them, two levels at most). A task the batch closes covers nothing. The rest
of the batch is written. `distinct` skips the rule only when it names the nearest task (`#N`) or
is the person's choice (« Tâche à part »): any other `distinct` gets the question. Tell the person
in one line what was poured where; if they say it was a task of its own, undo the `append` and
write the `add` with `distinct`.

**A closed task on the same subject (#538).** With no open task on the subject, a closed one (by
words or by marks) gives a `followup` question: « Suite de #N (recommandé) », « Déjà fait par #N :
ne rien ajouter », « Tâche à part ». Nothing is reopened or re-created silently.

**A parent is an empty shell (#552).** A standalone task (no parent, no open child, it carries an
action) never becomes the parent of a linked task. An `add` whose `parent` is a standalone task, or
an `update` whose `fields.parent` is one (several such operations on the same task make one
question), is not written: `write` returns one `group` question, key `group-<id of the standalone
task>`: « Regrouper #N et « … » sous une mère nouvelle « … » (recommandé) » (an `add` of an empty
parent, key `mere-<id>`, with the latest `due:` of its children and an `après:` outside the group,
then the standalone task and the new task under it, the `update`s keeping what else they change),
« Tâche à part » (the `add`s without `parent`, the `update`s without the `parent` field), « Ne rien
ajouter ». A standalone task taken by a session (`qui:` and `branche:`) does not move: the parent is
created with the new task only and the question says #N goes under it at its closing. The same
holds in the same-subject case of #288 (an `add` of the same subject as a standalone task that has
children of its own in the batch): the option is « Regrouper #N et l'ajout sous une mère nouvelle »,
the `add`'s children go under the new parent, two levels at most. An existing parent still takes
its new children without a question. Before asking, replace the proposed parent name with a subject
name of 2 to 5 words, as for #438. Case of #546 and #550: #550 added under #546 made #546 the
parent although it had its own work; now both go under a new empty parent.

**A child is named by what sets it apart (#598).** A parent is named by its subject; each child by
what distinguishes it, without repeating the parent's subject: under #411 « Fiche d'une tâche », not
« Fichiers de la fiche » but « Fichiers ». `write` refuses (nothing written) a batch that gives a
child a `nom:` repeating a subject word of its parent's name (its `nom:`, or its first five words),
or equal or nearly equal to it (nothing of its own left once those words are removed): an `add`
under a parent with `fields.nom`, an `update` that renames a child or moves a named task under a
parent, an `update` that renames a parent one of whose open children would then repeat it. The
message names the repeated words and the proposed name (`audit.nom_distinct`): use it, or name the
child yourself. A family already confused that the batch does not touch passes; the audit raises it.
The groupings of #438 and #552 already put the distinct `nom` on each child they move.

**One theme, one parent (#438).** `write` first looks for a **theme**: the open tasks and the other
`add`s of the batch that share a rare place (a file, function, command or area carried by 8 open
tasks at most) plus a second sign (another place, a chain link, a `#N` or a `src:` they both cite,
such as the same study, or a quarter of the shorter label's weighted words), same axis. When the
theme has several siblings (two `add`s, two open tasks, or a task already under its parent), its
`add`s are not written as lines of their own: they become one `group` question: « Regrouper sous une
mère nouvelle « … » (recommandé) » (an `add` of the parent, key `mere-<key>`, with the latest `due:`
of its children, then the children: the `add`s and the free open tasks without a parent, by
`update` with `parent`; an `après:` outside the group moves to the parent) or « Ranger sous #P
(recommandé) » when one of them is already under P; « Verser dans #T » for a single `add`; « Tâche à
part » (« Tâches à part »); « Ne rien ajouter ». A task taken by a session is never moved: the
question says it goes under the parent at its closing. **A `distinct` set by the writer does not
skip it**, only « Tâche à part », the person's choice: on 2026-11-10, Maestro wrote #433 and #434
with `distinct` while #419 and #423 (tests and CI) were open, and BBR had to create the parent #437
by hand. Before asking, replace the proposed parent name (the option's label, the `add`'s `label`
and `nom`) with a subject name of 2 to 5 words (« Tests et CI plus légers »). A pair (one `add`, one
open task) stays with the rules below.

**Pour into an open task what touches the same place (#320).** Words miss it when two tasks act at
the same place for the same purpose: on 2026-11-04, #313 (delete a closed task's branch) shared no
telling word with #287 (`release.py` commits only its files, no more `git add -A` in the main
folder), though both are the git clean-up of the main folder and Maestro gave them one session.
So, before writing an `add`, say where it acts: `zone`, a list of places (files, functions,
commands, or an area in words: `"git branch -d"`, `"pruneBranches"`, `"dossier principal"`), and
`--zone` on `match` (repeated; it applies to every `--text`). `match` then reads each open task's
context: its label and `nom:`, its `fiche:` and `spec:` (`spec.md` and `plan.md` of the folder),
the places they name, its chain and its session, and gives `a_verser`: at most two tasks, each with
its reasons (`lieux_communs`, `fichiers_communs`, `chaine`, `score_contexte`, `branche`, `fiche`,
`spec`). A task is listed only when the three hold:

- **same place**: a shared place that is a function, a command or an area, carried by 3 open tasks
  at most (or a quarter of them): a shared file alone never counts, since almost everything touches
  `register.tsx`;
- **same purpose or direct follow-up**: two shared places, or a chain link (the action cites `#N`
  or follows it by `après:`), or 0.5 of the action's weighted words found in the task's context with
  two shared words;
- **a small result**: the task has no open child, and both labels hold in 1,200 characters.

**A task in progress on the same files (#366).** `match` also gives `en_cours_memes_fichiers`: the
open tasks held by a session (`qui:` and `branche:`) whose branch changes a file of the action
(`git diff --name-only main...<branche>`), or whose context names it; here a single shared file is
enough, since two sessions on the same file collide (#365 opened apart on 2026-11-06 while #355, in
progress, changed the same selection in `register.tsx`). Each entry: `id`, `libelle`, `branche`,
`fichiers_communs`, `meme_but` (a chain link, or the context's words). Give `--zone` the files, not
only words. When `a_verser` finds nothing, `write` turns the first entry into the same `merge`
question: « Verser dans #N, tenue par la session de <branch> » (recommended when `meme_but`), or
« Tâche à part » (recommended otherwise). Say it to the person before writing.

Read their context before writing (the purpose is yours to judge, the script only shows where).
`write` holds it as a question, never a refusal: an `add` without `parent`, without `distinct`,
that the subject rule did not hold and that nothing else in the batch points to, becomes a `merge`
question: « Verser dans #N (recommandé) » (`{"op": "update", "id": N, "append": "<the action>"}`,
its `src` joined to the task's), or, for a task taken by a session,
« Verser dans #N, tenue par la session de <branch> »
with no operation and a `relay` (`id`, `branche`, `action`): Maestro checks
that the session is open and sends it the action instead of opening a session; then the second
task if any, then « Tâche à part » (the same `add`, with `distinct`). Without `zone`, and with no
code named in its label, an `add` is matched by words only, as before.

**What was done counts too.** `match` also gives `faites_au_meme_endroit`: the closed tasks at the
same place and for the same purpose (same rules, no size limit), read in their label, their bilan
(`fait` of `ROADMAP-bilans.csv`, in `livre`) and their fiche or spec. When no open task receives
the action, `write` asks a `followup` question: « Suite de #N (recommandé) » (the same `add`, with
the note « suite de #N » and `distinct`), « Déjà fait par #N : ne rien ajouter », « Tâche à part ».

**An outside look at all the open tasks.** `python3 "<skill folder>/scripts/tasks.py" lots <project
folder>` replays each open leaf as an action, with the places its context names for zone, and
returns `{"questions": [...]}` (the audit's format, kind `merge`, on the task to pour): two tasks at
the same place, for the same purpose, with a small result. The one poured in is the newer of two
free tasks, or the free one when the other is taken; two taken tasks give nothing. Two leaves
clearly on the same subject (#538) that share a mark of their own give the same question, which
names the marks instead of the places: the same `parent` counts as one more mark, but the parent,
its marks and shared words alone never do (sisters written on one template, « Prouver la fidélité
de #N », are not duplicates). Options:
« Verser #V dans #R » (`update` with `append` on R, `drop` of V with its bilan), or for a taken R
the same with `relay` and only the `drop`, then « Les garder à part ». Ask them with the batch's
other questions; the chosen option's operations go to `write`.

**The same on written lines (#438).** `python3 "<skill folder>/scripts/tasks.py" groupes <project
folder>` returns `{"questions": [...]}`, kind `group`, one per theme that has a free task without a
parent to put away: « Ranger #a sous #P » or « Regrouper #a, #b sous une mère nouvelle « … » »
(recommended, the parent's name to replace as above), then « Les laisser à part ». Ask them with
`lots`'s; the chosen option's operations go to `write`. The audit groups a whole flat axis by its
expressions (#284).

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

**A communication not sent yet is never done** (#242). A deliverable of the line (`livrable:`) that
is an email (« À : » or « Objet : » headers), or whose path names a message, an invitation, a letter,
Slack or SMS (`emails/`, `message-martial.md`), keeps the task open until its « Statut : » header says
it left: `Statut : envoyé le AAAA-MM-JJ (par où)`. That line, in the file itself, is the proof of
sending that the panel, the end-of-turn hooks and `write` read. Sending is always asked of the person
first; once it is sent, write the `Statut :` line, then mark the task done. `write` refuses `done` and
`handoff` on such a task (« pas encore parti »), the panel's « Marquer faite » says so, and the session
does not offer « Archiver cette session ? ». `drop` is never held back.

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
    {"op": "done", "id": "12", "date": "2026-10-30", "proof": "email envoyé à Jason le 30/10 (40-deliverables/emails/…)", "bilan": {"fait": "Plan envoyé à Jason", "souci": "", "ressenti": "fluide", "cause": "aucune", "corrections": 0, "note": "Envoyé du premier coup."}},
    {"op": "drop", "id": "7", "reason": "remplacée par le vendor agreement"},
    {"op": "pause", "id": "22", "until": "2026-11-30", "reason": "budget gelé jusqu'à la clôture"},
    {"op": "handoff", "id": "529", "date": "2026-11-02", "proof": "récap envoyé à DaVinci le 02/11 (40-deliverables/emails/…)", "delivered": "preview contrôlée, récap envoyé à DaVinci", "key": "s1", "label": "Recevoir de DaVinci l'activation du qualifier et la correction du 300x250", "waiting": "Navneet", "src": "40-deliverables/emails/2026-11-02-…-navneet.md", "fields": {"due": "2026-11-06"}},
    {"op": "handoff", "id": "684", "date": "2026-11-11", "proof": "plan envoyé, interface TTD non ouverte", "delivered": "plan envoyé", "key": "r1", "missing": "ouvrir l'interface TTD (connexion)"}
  ],
  "questions": [
    {"key": "conflict-18", "task": "18", "kind": "conflict",
     "question": "« Deck du call mensuel » (#18) : Jason dit le 06/11, la roadmap le 05/11 : quelle date ?",
     "options": [{"label": "Le 06/11 (recommandé)", "operations": [{"op": "reschedule", "id": "18", "due": "2026-11-06"}]},
                 {"label": "Garder le 05/11", "operations": []}]}
  ]
}
```

- **questions** (#232, optional): every question of « What gets asked » below, in the audit's
  format (`ROADMAP-questions.json`, #159), so the report lists them under « T'attendent ».
  `key` (unique), `kind` (`conflict`, `undated`, `partial_proof`, `rhythm`, `reopen`, or one of
  the audit's: `late`, `structure`), `question` (readable on its own: the task's
  label in it), `options` (the recommendation first, marked « (recommandé) », each with the
  `operations` that answer it, `[]` for « change nothing »), and `task` (an open id, the `key` of
  an `add` of this batch, or a closed id for `reopen`) or, for an action with no task, `about`
  (its text). Nothing is written for a question: its answer goes through a new `write`.
  `write` adds its own (#288), kinds `subject` and `name` (« What gets asked »): the `questions` of
  its output (printed under « Questions du lot », or in `--json`), with their options' `operations`
  ready for the next `write`; ask them in the same form as yours.

- **add**: `key` (unique, not a number), `label` (in French: an infinitive verb and its object; a
  parent carries a subject name), `axis` (a child's is its parent's: leave it out, another one is
  refused), `parent` (an `id`
  or a `key`), `section` (default « Prochain », else the first open section), `distinct` (#288: why this action
  is a task of its own though an open task looks like the same subject, naming that task (`#N`,
  #538: without its number the subject question is still asked); never written in the
  line; it skips #288 and #320, never the theme of #438: only « Tâche à part » does), `zone` (#320: the places the action touches, files, functions, commands or an area in
  words, used to match it with the open tasks; never written), `note` (written in the label,
  between parentheses: « Réserver le studio son (demandé par Linda) », never after the field block,
  which the cowork doctor refuses, #285), `fields`.
  The id is the next free one. A child is written under its parent, after its other children, and
  takes the required fields it lacks (`après:-` otherwise) and the parent's category keys. When the
  project requires `qui:` (a code project, #255), a new line gets the person, the first `me` name
  of `.claude/roadmap.json`; `fields.qui` only takes one of the `me` names: a new line is never
  taken, a session takes it by hand (`qui:<branch>` and `branche:<branch>`).
- **update**: `fields` (never `id`, `qui`, `branche`, `verrou`, `fait`); `append` (#320: text
  added to the label after « ; », the action poured into the task; refused on a taken task like any
  update); `parent` and `après` are
  allowed, and checked; a task given a `parent` takes that parent's axis. `null` removes an optional key (a `prio:`, an `attend:` lifted); a required key
  is never removed.
  `pj` (attachments, #204) is a field like the others: project file paths (screenshots, PDFs,
  photos), comma-separated, relative to the project root; copy the file into the project first.
  `livrable` (deliverables, #234) has the same format and holds what the task produces (a drafted
  email, a deck, an export), while `pj` holds its sources. When a session writes a draft for a
  task, set `livrable` to its file: the panel shows a preview of a text or Markdown deliverable
  (#236). A deliverable not written yet is allowed.
  `nom` (the task's short name, #235) is the name the panel shows in its list, the task's card and
  the title of the sessions it launches, instead of the one it draws from the label. When the
  person asks to rename a task (« change le nom », « appelle-la … », « renomme »), set `nom` and
  never rewrite the label, which keeps the whole mission. 40 characters at most, clear: 2 to 5
  words that say what the task is about (« DCO Veterans Prospects »); `null` removes it and the
  panel draws its own again. It is written right after `id:` and stays when the label changes.
- **reschedule**: `due`.
- **done**: `date` (the date of the proof, `AAAA-MM-JJ` or `AAAA-MM-JJ HH:MM`), `proof` (what
  proves it, and where), `bilan` (#262). The line moves to the top of `ROADMAP-fait.md` with
  `fait:AAAA-MM-JJ HH:MM` (the time of the write when the date is today; a past date gets no
  invented time), its bilan row to the bilan journal. Optional `version` (X.Y.Z): for a `lieu:cloud` line or one tied
  to a PR, `--apply` also posts on that PR « ligne close par Maestro le AAAA-MM-JJ, version X.Y.Z » (« sans version »
  without one; not reposted; a failure never blocks and prints the `gh pr comment` command, #588). A recurring standalone task (`tous:`) is
  marked done with the panel's « Marquer faite » button, which carries it over. **A task whose
  requested step could not be done is never done (#487)** (no connection, the person absent, a
  tool or connector unavailable): `done` is refused when the bilan's `manque` says so, or, without
  `manque`, when the bilan's `souci` or `note`, or the `proof`, match the words of
  `ETAPE_MANQUEE` (« n'a pas pu », « faute de connexion », « non ouverte », « BBR absent »,
  « outil indisponible »…). If everything requested is in fact done, set `manque: "aucun"` in the
  bilan; otherwise close in part with `handoff` and `missing`, or leave the task open. The refusal
  holds with or without a bilan. **A line with a cloud PR closes only once its PR's findings are
  collected (#558)**: on a line that carries `lieu:cloud` and `branche:`, `done` and `handoff` are
  refused until the findings ledger (`ROADMAP-findings.json`, next to the roadmap) holds the trace
  that `findings.py relever <folder> --pr <n°>` of the `maestro` skill leaves, written with the PR
  merged or closed; zero finding found counts as collected, and the refusal gives the command. A **routine**
  (#280) is a recurring task that carries its instructions: `skill:<name>` (or `plugin:name`), the
  skill its session loads first, and/or `fiche:<path>`, the detail; the panel's blue ▶ ticks the
  occurrence, moves the line to its next date and launches the session. Never write « tick the
  task at the end » in a routine's fiche: the panel does it.
- **bilan** (#262, on `done`, `drop` and `handoff`), the contract of `cowork.py roadmap close
  --bilan-b64`: `fait` (one line, 140 characters at most: what was done), `souci` (one line: the
  problem met, empty only with `fluide`), `ressenti` (`fluide`, `accroché`, `bloqué`), `cause`
  (`aucune` with `fluide` and only with it, else `spec-floue`, `attente-tiers`, `bug-outil`,
  `refait`, `périmètre-élargi`, `charge-mac` (load of the Mac, timeouts, test queue),
  `conflit-parallèle` (parallel sessions on the same files, merge conflicts), `environnement`
  (what the machine lacks: cloud VM, shim, missing plugin); a closed list, no « autre », #460),
  `corrections` (the number of rework requests from the person, 0 or more), `note` (one sentence),
  `manque` (#487, one line, 140 characters at most, optional: the requested step that could not
  be done; `aucun`, `rien` or `-` say that nothing is missing; **not a journal column**, it only
  decides `done` and `handoff`), and in a **countable journal** (#460: its header carries `type`, as `ROADMAP-bilans.csv` of
  Roadmap) `type` (`code`, `doc`, `rendu`, `sans-code`) and optionally `lieu` (`cloud`, `mac`;
  default: `cloud` when the line carries `lieu:cloud`, else `mac`). Written by the journal's own
  columns; `lieu` and `type` are ignored by a journal without those columns. The journal is
  `bilan.log` of the folder's `cowork.json` (its allowed values come from that log's columns),
  else `ROADMAP-bilans.csv` next to the roadmap. **Required** in a Cowork folder whose
  `cowork.json` says `"roadmap": "plugin-roadmap"` (Adbricks Cowork, AAFES Cowork): its doctor
  checks every row. **Required** too in a countable journal, with its `type`. Elsewhere optional: without it, the row says the label and « Faite : <proof> ».
  A parent closed with its last child gets the child's bilan, its `fait` naming that child.
- **drop**: `reason`, `bilan`; the reason goes into the label after « ; », then « (abandonné) » at
  its end (« Préparer le budget mocap ; budget repris par Linda (abandonné) », #285), like the panel's « Annuler la tâche ».
- **pause** (#159): `until` (the resume date), `reason`. `due:` becomes `until`, the label gets
  « (en pause depuis le JJ/MM : <reason>) » (#285), and a task without a parent moves to « Plus tard »; a
  child stays under its parent. Refused on a line taken by a session and on a parent with an open
  child.
- **handoff** (#245, « Partial closure » below): `date`, `proof` and the optional `version` (closure signal on the PR, #588) as for `done`, `delivered`
  (what was delivered, added at the end of the closed label: « ; livré : … »), and the follow-up:
  `key`, `label` (only what remains with the third party), `waiting` (the third party: its
  `attend:`), `src` (the message that asked the third party), `fields` (`due`, `nom`…; never
  `après`, `parent`, `attend`, `src`, `fiche`, which the operation sets). With **`missing`**
  (#487, what remains to be redone: the « à relancer » variant, no third party needed), `waiting`,
  `src` and `label` become optional (`label` defaults to « Relancer : <missing> »; `missing`
  defaults to the bilan's `manque`); `proof` and `delivered` stay required. A `waiting` that is a
  third party still puts `attend:` (and `src:`) on the follow-up; absent, or one of our names, the
  follow-up has no `attend:`. The closed label ends « ; à relancer : <missing> en #B ; livré : … ».
  In one write: the task
  moves to `ROADMAP-fait.md` with its bilan row (« Faite : <proof> ; suite chez <tiers> en #B »),
  the follow-up opens in its place (same parent, same axis, `après:` the closed task, same
  `fiche:`, the project's inherited keys), and in every other **open** line `après:`, `parent:` and
  « #A » in the label or note point to the follow-up; closed lines are never touched. Refused when
  `waiting` is not a third party, on a task with an open child, and on a recurring task.

Then the **dry run**, always:

```bash
python3 "<skill folder>/scripts/tasks.py" write <project folder> --operations <scratchpad>/operations.json
```

It shows the rendered lines, then the report (step 5), and writes nothing. A refusal (« Refusé : … ») leaves nothing written
and names the problem: missing required field, undeclared key or value outside its list, unknown
axis or section, a child's axis other than its parent's, wrong date, third level, `prio:` other than `oui`, `après:` to another parent's child
or in a loop, a line taken by a session (`qui:` and `branche:`, which can only be rescheduled or
marked done), a parent with an open child, a communication deliverable not sent yet (#242), the roadmap changed since the context (run `context`
again). Fix the operations, or ask the missing question, and run it again.

Then:

- **without `ecriture`**: run again with `--apply`. It backs the files up in
  `sauvegarde-tasks-…/` (in the folder's `_to_delete/` when it has one; for a Cowork folder without it, outside it,
  in `~/.claude/roadmap-sauvegardes/<folder>/`, where its doctor does not take it for a fiche;
  else next to the roadmap, #262; older `sauvegarde-tasks-…/` there are deleted when both more than
  7 days old and not among the 20 most recent, #413), then writes everything in one go;
- **with `ecriture`**: `--apply` is refused. Hand the dry run's lines to the project's tool
  (`ecriture.outil`), as `ecriture.consigne` says (at Blur: `patch.py <spec>`, dry run then
  `--apply`, the note, the fiches and the roadmap in one go).

## 5. Check and report

1. `python3 "<onboarding skill folder>/scripts/onboarding.py" verifier <folder>`
   (« Conforme au format. »).
2. In a repository: a commit of the roadmap files only (`ROADMAP.md`, `ROADMAP-fait.md`,
   `ROADMAP-bilans.csv`), on `main` in the main checkout with code, then push. The backup is
   not committed.
3. **The report, under the verdict** (#232, #275). The last block `write` prints, after the
   changed lines, is the report: one bullet per task, `- Roadmap :` first, no glyph, and it goes
   into the answer (ADHD mode, after the verdict) **without rewriting, reordering or summing it
   up**, with no title and no table:

   - `- Roadmap : #N ajoutée — <short label> (sous #P, due JJ/MM)`;
   - `- Roadmap : #N cochée le JJ/MM … — <short label>` (closed), `- Roadmap : #N annulée … — …`
     (dropped or removed), `- Roadmap : #N <what changed> — …` (completed, rescheduled, paused,
     recurring parent left open); « complétée » names the keys only (`complétée : qui, branche`),
     never their raw values;
   - `> **Une question :** #N <question> (<reason>) — recommandé : <option>`, each its own quote
     after the lines, for what waits (« T'attendent »: conflict, missing date, partial proof,
     rhythm, reopening; no `#N` for an action with no task).

   Nothing changed: « Roadmap : rien ne change. ». A dry run starts with « Essai à blanc, rien
   n'est écrit : », a project tool with « À passer à <outil> : » (with `ecriture`: give the lines
   once the project's tool has written them). A caller that keeps a conclusion file (a catch-up, a
   dispatch) writes that same block in it, or the `--json` output (`compte_rendu`, `markdown`)
   when it wants the data. When the roadmap plugin hands its own lines (#244, computed from every
   write of the turn, the script's questions included), use those instead, once. Before them, in
   one line each, what they cannot say: an action written nowhere (« rien : déjà couverte par
   #M », « déjà faite », excluded by the `regles` file).
4. **Then one form for « T'attendent »**, and nothing else (« What gets asked » below): one
   multiple-choice form (`AskUserQuestion`), one question per row, the row's own `question` and
   `options` (the recommendation first), four questions at most per round; more than four, the
   next round right after the answers. The chosen options' `operations` go into a new
   `operations.json`, then `write` again (dry run, then `--apply`), which prints a new report.
   No `- ?` line: no form. The roadmap plugin refuses the end-of-turn box once while questions
   wait and no form was asked (#244).
5. **What will be launched** (#341). For each task this run adds, and for an open task it updates
   that has never had one, write in the answer, after the report, one block per task:
   `**Ce qu'on va lancer (#N).** …`, two or three everyday sentences (in the person's language)
   that say what the task will do and what it will change for them, no file name, no field, no
   id in the text. The block ends at the first blank line. The roadmap plugin keeps it in its
   store (`pitch:<project>#<id>`) and shows it in the task's « À lancer » card, the roadmap line
   folded under « ▸ Mission » ; a new block for the same task replaces the old one.

## Partial closure (#245)

When our part of a task is done but its label still waits on a **third party** (a validation, an
activation, an answer, a fix at a vendor or a client), the line does not stay open: close it on
what is done and open, in the same turn, a follow-up that carries only the wait (`handoff`).

- **A third party**: `attend:` names someone who is neither one of the project's `me` names
  (`.claude/roadmap.json`, then `~/.claude/roadmap-perso.json`) nor a task (`id:N`). `attend:BBR`
  is not a third party: the task is ours, it stays open or is marked done.
- **Triggers**: a session that reports its task finished while its line still has `attend:` to a
  third party; or the panel, which reminds Maestro of a finished session whose line stays open
  after 15 min, and reminds the session at the end of its turn.
- **Proof**: the message sent to the third party (it is often the proof itself). A communication
  not sent yet is not a proof: no partial closure before it leaves.
- **Under Maestro**, a session does not tick its line: its report says « clôture partielle
  proposée : #A, suite chez <tiers> », with the proof and the request's message; Maestro writes
  both lines (at the merge with code, right away without code). Outside Maestro, the session
  writes them itself.
- **Said in one line**, which the report prints under its title: « #A close, la suite chez
  <tiers> passe en #B ». The plugin's report (#244) prints it too, from the turn's changes.
- **To relaunch (#487)**: when a requested step could not be done on our side (no connection, the
  person absent, a tool unavailable), no third party is waiting but the task is not done either.
  Close in part with `handoff` and `missing`: the done part closes (« ; à relancer : <missing>
  en #B ; livré : … »), the follow-up « Relancer : <missing> » opens in its place, without
  `attend:` unless a third party is named. The line printed is « #A close en partie, à relancer
  en #B : <missing> ».

## What gets asked, and nothing else

Each question goes into `operations.json` (`questions`, step 4), so the report lists it under
« T'attendent »; then it is asked through the one form of step 5: four questions at most per
round, the recommendation first, each question readable on its own (the task's label in it, not
« the previous one »):

- an action **contrary** to an open task, with no reason given;
- the **date** of a new task that the source does not give (recommendation: the next occasion,
  for instance the next call);
- a **partial proof** (« Cocher », « Laisser ouverte », « Réécrire sur ce qui reste »);
- the **rhythm** of an ongoing subject (`tous:jour`, `tous:ouvré` Monday to Friday, `tous:semaine`,
  `tous:mois`…);
- **reopening** a closed task;
- **the same subject** (`subject`, #288, set by `write`): an action an open task covers;
- **the same theme** (`group`, #438, set by `write` and `groupes`): siblings to put under one parent; and, #552, a task linked to a standalone task, to put with it under a new empty parent;
- **a mother's short title** (`name`, #288, set by `write`): a task without `nom:` that gets its
  first child. `write` proposes its first five words; before asking, replace that proposal (the
  option's label and its `nom`) with a short title of 2 to 5 words in the label's language, which
  says what the subject is (« Vendor agreement Little Zoo »). Better still, give `nom` in the same
  batch (an `update` of the mother, or `fields.nom` of a new one): no question then.

Everything else is done without a question and said in one line: the case of a clear match, what
a child inherits, the id, the default section.

## Propose a task (#216)

A rule of the plugin, not only of this skill: the plugin states it in full with every message of
a project that has a roadmap, because the skill is not always loaded when the idea goes by.

- **When**: a new idea that needs work (tool, rule, document, setting), or an action to do outside
  the scope of the task in progress, whoever says it, the person or Claude. In the turn where it
  appears, without waiting to be asked.
- **Not**: a reflection, an answered question, an explanation; a fix within the scope of the
  task in progress (it is done there); a decision without an action (it goes into the project's
  memory); a subject that already has its task (§ 2: enrich it, and say so in one line).
- **The project's rules win** (`regles`): what they exclude never becomes a task (at Blur, an
  action that is not Caroline's becomes a follow-up « qui doit parler à qui »).
- **How**: write the line (§ 2 to 5) with its short name in `nom:`, then post the session card
  (`start_session`, `own_initiative`), titled `#<id> · <nom>` as reread from the written line
  (never a number foreseen before writing: the panel refuses it, #263), its brief opened by Mission, Fichiers,
  Fini quand. Under Maestro, a sub-session posts its card only, without writing the line: the panel
  sends it up to Maestro, who opens the line and posts it again. Work done elsewhere (another
  repository, another person): the line alone, said in one line.
- **A study's steps** (#293): a study, a spike or an audit that ends on a recommendation in steps
  proposes one task per step that has none (its line, then its card; under Maestro, the card only;
  never `distinct` to keep the steps apart: steps of one study are a theme, `write` offers them one
  parent, #438),
  attaches each other step to its existing task (said in one line) and says why a step is set
  aside. The plugin's end-of-turn reminder catches a numbered list of steps announced as
  recommended (« je recommande », « prochaines étapes », « next steps ») when no card was posted.
- **One card per idea, no duplicate**: reread the roadmap and the linked sessions
  (`list_sessions` with `linked: true`) first. The app shows three cards per turn at most: beyond
  that, the lines are written and the answer says so. Launching keeps the person's click on Start,
  even with the autonomous setting: the card is the proposal.

## Unattended (scheduled task)

Nobody answers: write only what is clear, show no form. The questions still go into
`operations.json`, so the report keeps them under « T'attendent ». Each one also waits where the
`regles` file says; otherwise the report is where it waits. The report ends with the number of
pending questions, by priority (prioritaires, then sans priorité; a child counts its parent's).

## Migrating the old priorities

The old scale (`prio:1` urgent, `2` important, `3` when there is time, #130) becomes yes or no
(#300): `prio:1` becomes `prio:oui`, `prio:2` and `prio:3` are removed. The doctor reports a roadmap
that still carries them. `python3 scripts/tasks.py prio-oui <folder>` prints, as JSON, the
`operations` that do it (`update` with `prio: "oui"` or `prio: null`) and the `skipped` lines (no
`id:`, or taken by a session); pass the operations to `write` like any others, dry run first, and
say which lines were skipped. The grammar written at the top of the roadmap (`prio:1` in its
example, the `**prio**` bullet) is edited by hand in the same go: `prio:oui`, yes or no, any task.
Once the grammar says `prio:oui`, the roadmap is migrated and the old scale is refused (#308): the
panel's write check refuses a line whose priority becomes `1`, `2` or `3`, `check.mjs` refuses one on
an open task, and the doctor reports it as KO; a line that keeps its earlier value is let through.

## What the skill does not do

- It does not audit the whole roadmap (bundles to split, duplicates, gaps): `audit` skill.
- It does not recompute or carry over a recurring task: the panel does (« Marquer faite »).
- It never reopens, renumbers or rewrites a closed task without a question.
- It never writes next to the project's tool when `ecriture` is declared.
