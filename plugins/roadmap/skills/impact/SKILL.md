---
name: impact
description: "Maps what a code change touches before it is coded and again before it is called done: for each changed file, the files that cite it by name or import it; for each changed symbol (function, type, constant, object key, Swift enum case), the files that name it; tests first, ranked by how many changes hit them. Read-only, no dependency, offline, always fresh (git and a text scan, under a second). Triggers in a code session before the first edit (« avant de coder », « qu'est-ce que ça touche », « carte d'impact », « blast radius », « what does this change affect ») and on the diff before saying a task is finished, as the session brief asks (#305). Not a replacement for running the project's whole test suite, nor a call graph: it does not follow calls through intermediate functions."
---

# Impact map of a change

The person speaks French: report in French. Only this skill is in English.

Why it exists (#305): the changes that shipped half-done were not missed function calls but a
constant read as a property (`tokens.ts` → the render fingerprints of `rendu.test.tsx`), a file
cited by its path from another package (`design/scripts/tokens-css.mjs`), and a renamed enum case
compared in a test (`WidgetLinkTests.swift`, Splitmybill). Graph indexes (GitNexus, trailmark)
found none of them; a systematic text scan found all three. Comparison:
`docs/plans/spike-carte-impact/comparaison.md` in the plugin's repository.

## When

1. **Before the first edit**, with what you plan to touch:

   ```bash
   python3 "<skill folder>/scripts/impact.py" --repo <project> --files <file…> --symbols <name…>
   ```

2. **Before saying the task is done**, on your whole diff: the working tree (untracked files
   included) against the point where your branch left `main`, so that commits `main` gained since
   do not show up as yours:

   ```bash
   python3 "<skill folder>/scripts/impact.py" --repo <worktree> --base "$(git -C <worktree> merge-base main HEAD)"
   ```

   Without `--base`, the map covers only what is not committed yet (against `HEAD`).

`<skill folder>` is the base directory the skill announces when it loads. `--json` gives `{"base", "ranked", "files", "symbols"}` for a script. Exit 2 outside a git repository.

## How to read it

- **« Tests à lire d'abord »**: tests hit by several changes. Open each one: it is the likeliest to
  break or to need an update (a fingerprint, an expected label, a renamed case).
- **Tests** under each file or symbol are never cut: every test named either runs green or is
  updated in the same change. A symbol whose behaviour changed and that no test names gets a new
  test, red first (`superpowers:test-driven-development`).
- **Code** (cut at 15) is what to re-read: a caller, a generated file, another package that reads
  the changed file by its path. A common word (`points`, `text`) brings noise: skim it, keep what
  really depends on the change.
- **Docs** are only counted: the project's rule « la doc suit le code » says which to update.
- **Symbols** are read on code files only (not Markdown, HTML, CSS or data files), modified files
  before new ones, 40 at most. When the cap is reached, the report says how many were left out:
  name the ones that matter with `--symbols`. A generic file name (`index.ts`, `utils.py`) is looked
  for with its folder (`a/index`), so other files of the same name do not count as citing it.

Then run the project's whole test suite (its CLAUDE.md, « Commandes »), whatever the map says: the
map tells what to read and which test to write, not which tests may be skipped.

## What it does not do

No call graph (a test reaching the change through an intermediate function is covered by the whole
suite), no index, no network, no write.
