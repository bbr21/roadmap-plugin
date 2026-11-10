---
name: mockups
description: "Designs the mockups of a visual choice from the project's own design system, before the first mockup is drawn: reads the system that .claude/roadmap.json declares (design), takes stock of its tokens, components and patterns, composes each option from them, reuses an existing pattern before inventing one, names what it adds as a proposed addition to the system, then critiques hierarchy, consistency and accessibility and has web-design-guidelines review the result. Launched by the « Maquettes avant un choix visuel » rule when the project declares a design system. Triggers on « fais les maquettes », « propose 2 ou 3 maquettes », « maquette de l'écran », « refais les maquettes », and before any mockup page or mockup widget in a project with a design system. Not for a project without a design system (frontend-design gives the direction there), nor for coding the chosen option."
---

# Mockups from the design system

The person speaks French: talk to them in French, write the mockup page in French. Only this
skill is in English.

The roadmap plugin's « Maquettes avant un choix visuel » rule launches this skill before the first
mockup when the project declares a design system (`design` in `.claude/roadmap.json`, #294). It
replaces `frontend-design` there: that skill pushes toward a distinct brand identity and aesthetic
risk, which a tool that already has its system must refuse (#291, #294). This skill gives the way
to compose; the system gives the colors, the type and the components.

Chosen by the user on 2026-11-04 from three series of mockups of the same card, one per skill
(`docs/plans/spike-skills-design/maquettes.html` in the Roadmap repository). It draws on Anthropic's
`design-system` (mode `extend`: a new pattern that fits the existing system) and `design-critique`,
and on impeccable's `normalize`.

## 1. Read the system

Read every entry of `design` (`chemin`, `pour`, `skill`): its README, its tokens (colors, type
scale, spacing, radii, icon sizes), its components and their variants, and its model page if it has
one. When `.design-sync/config.json` names a claude.ai project, that is the published copy. An
entry's `skill` is the project's own charter: launch it too, after this one.

Then read the screen being changed, as it renders today, and its neighbours: the cards, rows and
bands it sits among.

## 2. Take stock

Write down, for this screen, before drawing:

- the tokens it may use (by name, never a raw value),
- the patterns its neighbours already use (a card with its head, a row of label and value, a
  band, a pill, a list with rules),
- what the screen must show: its real content, short and long, empty and full.

## 3. Compose

Two or three options, each a clear stance with its trade-off, the recommendation first.

- **Reuse before inventing.** Each option starts from a pattern of the inventory. An option that
  needs something the system lacks says so, and that piece is named as a proposed addition to the
  system, never slipped in as a one-off.
- **One move per option.** What differs between options is one decision (reuse the sibling card,
  borrow a table, cut by typography). The rest of the screen stays as it is, rendered by the
  system's own components.
- **Density is the system's.** Spacing, type sizes and radii come from its scale. No size below
  its smallest step, no new font, no colour outside its tokens.
- **Real content.** The longest real case and the shortest, from the project's own data.
- **Within the renderer's limits.** When the screen is drawn by a constrained kit (a Claude Code
  mod panel, a native widget set), an option it cannot render is not an option: name the limit.

The page itself follows the plugin rule (#369): an interactive HTML page in the task's folder
(`docs/plans/<type>-<slug>/maquettes.html`). It clicks (hover, tabs, folds, empty and full states)
and may carry its script inline or next to it, with the system's tokens copied in. Serve it with
`python3 scripts/serve.py <page>` (the script of this skill, which prints an
`http://127.0.0.1:<port>/…` url), open that url with `preview_start`, never `file://` (the pane
shows a frozen copy there: no linked file, no reload), and check it by clicking through it, then on
a screenshot. The panel's « Tester les maquettes » button does the same at each click: it runs
`serve.py <page> --root <the page's folder>`, which reuses that folder's server or starts it, and
opens the url it prints: the button's server serves the page's folder only, so keep a page's linked
files next to it (`file://` when the script fails or the page lies outside the project).

**Without a browser pane** (a claude.ai cloud session, #409: no `preview_start`, and a server in the VM is out
of the person's reach), publish the same page as a claude.ai Artifact with the `Artifact` tool (load the
`artifact-design` skill first, as that tool asks) and give the person its link: it opens and clicks on the
Mac and on the phone (trial #404). Republish from the same `file_path` for each new version, so the link stays
the same; the page file stays committed in the task's folder. The Artifact url, with the option's anchor, is
what `fidelite.py poser --maquette` takes later.

## 4. Critique, then review

For each option, before showing it:

- **Hierarchy**: what the eye reads first, second, third; is that the right order.
- **Consistency**: every value is a token, every element a component or a named addition, and
  similar things look and behave alike.
- **Accessibility**: contrast of every text against its background (4.5:1 under 18 px), hit sizes,
  focus and hover states, truncation of long text.

Then launch `web-design-guidelines` on the page and apply what it finds. Write in the page what the
critique and the review changed, and what they flagged that the system itself would have to change
(a token too pale, a missing size): that goes to the user as a proposal, not as a silent fix.

## 5. Ask

The user chooses on the page, through the question form (AskUserQuestion), the recommendation
first. Nothing is coded before their choice.

Only the exact version the user approved with a yes is coded (#322). A correction (« plutôt X »,
« plus petit », « oui mais… ») is not a yes: redraw the mockup with it, show the new version, ask
« Je code cette version ? », and code only after the yes. The plugin reminds, in the result of the
edit itself, any edit of a render file made without a yes since the last mockup drawn.

When the choice was split into several mockups (one element chosen after the other), end with a
final mockup (#369): one clickable page that gathers the validated pieces into the whole screen.
The user tries it in the pane, and only their yes to « Je code cette version ? » on it opens the
code; a correction redraws the final mockup.
