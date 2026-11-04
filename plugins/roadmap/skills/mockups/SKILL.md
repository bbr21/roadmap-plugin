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

The page itself follows the plugin rule: a static HTML page in the task's folder
(`docs/plans/<type>-<slug>/maquettes.html`), with no script and no linked file (the browser pane
shows a snapshot), the system's tokens copied in, then opened with `preview_start` and checked on a
screenshot.

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
