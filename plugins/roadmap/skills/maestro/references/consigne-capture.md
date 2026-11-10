# The capture instruction (#406)

After the publication of a task that changes a render, and never for a task without one, the
session that coded it writes the person one message: the instruction for the fidelity captures
(#357, #377, #396). The person takes the captures and pastes them in the chat; the session never
captures the screen. The person asked for steps « limpide, limite que n'importe qui peut faire »,
then, on the first draft:
« pas besoin de répéter comment faire une capture, je sais. Juste quelle version checker, ensuite quoi faire (mais c'est là où il faut être clair) ».
This page is the template they validated on 2026-11-10.

## When

- Only once Maestro has sent back the published version (« #N publiée X.Y.Z : demande la
  capture »): the panel shows only a published version.
- Never for a task that changes no render: no capture, no instruction.

## The rules

1. The first line names « captures de fidélité » and the version: « attend une réponse : captures
   de fidélité (X.Y.Z) », or, in ADHD mode, « **J'ai besoin de toi : captures de fidélité en
   X.Y.Z, … ** ».
2. One numbered list, top to bottom, nothing outside it but the closing line.
3. The version (or the build) to check comes first, once, with where to read it: for the roadmap
   plugin, the panel footer of a new session (a session opened before the update keeps the old
   version); for an app, the installed build:
   « une fois le build … installé depuis TestFlight ». Older: stop and say so.
4. Then the gestures that put the state on screen, in order, named as they are written on
   screen: where to click, what to type. Either one gesture per step (the #385 example), or
   chained in the step of their capture (the #315 example). A label you have not seen is not
   invented: say where it sits.
5. One step per capture: the zone between two visible landmarks (« du mot « En cours » jusqu'à
   la dernière session »), and what it must show: « Tu dois y voir : … » under it, or in the
   same sentence (« capture la feuille avec ses lignes Venmo, Cash App, Zelle et Message »).
6. Then « Colle-les ici. » (« Colle-la ici. » for a single one), at the end or in the opening
   sentence.
7. The closing line, as is:
   `Pas pareil, ou rien à cet endroit ? Colle quand même et dis « pas pareil » : c'est un écart, je le corrige.`
8. Never explain how to take or paste a capture (no shortcut, no dragging, no paste key): the
   person knows.

At the end of the turn, the plugin reads a message whose first line names « captures de
fidélité » (or that asks to paste a capture through a numbered list, a quoted « À toi » block
included) and reminds the session of what makes it unclear (`captureConsigneGaps`,
`hooks/parse.ts`): no version or build, no numbered list, nothing said of what to see, nowhere
to paste, or the how-to of a capture. Both examples below pass it as they are.

## The skeleton

```
**J'ai besoin de toi : captures de fidélité en X.Y.Z, <ce qu'on capture>.**

1. Ouvre une nouvelle session dans le projet <projet>[, tape <ce qu'il faut>].
2. Regarde le pied du panneau <nom> : X.Y.Z ou plus. Moins : arrête-toi et dis-le-moi.
3. <un geste qui met l'état à l'écran : où cliquer, quoi taper, nommé comme c'est écrit à l'écran>.
4. Capture <la zone>, de <repère visible> jusqu'à <repère visible>.
   Tu dois y voir : <ce qui doit paraître>.
5. Colle-les ici.

Pas pareil, ou rien à cet endroit ? Colle quand même et dis « pas pareil » : c'est un écart, je le corrige.
```

## The example: #385, written for the person on 2026-11-10

The duration of each session in Maestro's « En cours » line and in its band above the input,
published in 0.246.0. Validated by the person at the framing of #406.

```
**J'ai besoin de toi : captures de fidélité en 0.246.0, la ligne En cours et la bande de Maestro.**

1. Ouvre une nouvelle session dans le projet Roadmap, tape Maestro.
2. Regarde le pied du panneau Roadmap : 0.246.0 ou plus. Moins : arrête-toi et dis-le-moi.
3. Clique sur la flèche › à côté de « En cours », en haut du panneau.
4. Capture la ligne En cours, du mot « En cours » jusqu'à la dernière session.
   Tu dois y voir : ◷ 42 min là où il y avait « 6/8 ».
5. Capture la bande juste au-dessus de la saisie (elle commence par « Maestro · »).
   Tu dois y voir : une ligne par session, « ◷ 42 min · 6/7 · étape ».
6. Colle-les ici.

Pas pareil, ou rien à cet endroit ? Colle quand même et dis « pas pareil » : c'est un écart, je le corrige.
```

## The example: #315, an app, written for the person on 2026-11-10

Zelle and Cash App in the Splitmybill iOS app. The person showed it as the model:
« Par exemple ça c'était super clair! ».
The build first, then one step per capture that chains its path up to the capture, what to see in
the same sentence. Its message opened on the build just sent, as an « À toi » block: in a
fidelity task, the first line also names « captures de fidélité » (rule 1), and the closing line
(rule 7) still follows the list.

```
> **À toi :** sur l'iPhone, une fois le build `202611100021` installé depuis TestFlight, prends trois captures et colle-les ici :
> 1. ouvre une dépense partagée avec des amis, touche « Request » sur une part, et capture la feuille avec ses lignes Venmo, Cash App, Zelle et Message ;
> 2. ouvre « Settle up » et capture la ligne « Paid with » une fois Cash App choisi ;
> 3. va dans Settings › Payments et capture la section avec le champ « Your Cash App ».
```

What the first draft of #385 lacked: « colle l'image ici » came while the person was in the new
session (« ici » was another session), the shortcut and the dragging were spelled out, and what
to see sat in a table below the steps instead of under each capture.
