// Les cartes des tâches écrites (#371, maquette A de docs/plans/feat-cartes-taches-ecrites/maquettes.html) :
// les lignes « - Roadmap : #N … » que le plugin donne après une écriture de la roadmap (#244) et que Claude
// recopie dans son message se dessinent en une carte par tâche. Ce fichier lit les lignes et les dessine ;
// il ne les écrit pas (`renderReport`, `reportOf`, `changeText` restent à parse.ts), et le texte que lit le modèle ne change pas.

import type { EngineInterface, RenderElement } from 'claude-code'

import { axisColor, axisPillIcon, pillIcon } from './icons'
import { roadmapAxes, type Task } from './parse'
import { SIZE, SPACE, TEXT, type Palette } from './tokens'

/** La sorte d'une ligne : une tâche neuve, mise à jour, faite ou annulée. */
export type WrittenKind = 'new' | 'upd' | 'done' | 'cancel'

/** Une ligne du compte rendu, lue. `due` est en `JJ/MM`, seulement pour une nouvelle. */
export type WrittenLine = { id: string; kind: WrittenKind; change: string; label: string; parent?: string; due?: string }

/** Un morceau du message : du texte à garder tel quel, ou une pile de lignes à dessiner en cartes. */
export type MessagePart = { kind: 'text'; text: string } | { kind: 'cards'; lines: WrittenLine[] }

const LINE = /^- Roadmap : #(\S+) (.+)$/
const NEW_SUFFIX = /\s+\((?:sous #(\d+))?(?:,\s*)?(?:due (\d{2}\/\d{2}))?\)$/

/** « - Roadmap : #375 ajoutée — Afficher le compteur (sous #367, due 12/11) » lue ; `undefined` pour toute autre ligne. */
export function writtenLine(line: string): WrittenLine | undefined {
  const m = LINE.exec(line.trim())
  if (!m) return undefined
  const id = m[1]!
  const body = m[2]!
  // Seul le premier « — » sépare ce qui a changé du libellé : un libellé peut en porter d'autres.
  const cut = body.indexOf(' — ')
  const said = (cut < 0 ? body : body.slice(0, cut)).trim()
  const label = cut < 0 ? '' : body.slice(cut + 3).trim()
  if (said === 'ajoutée') {
    const suffix = NEW_SUFFIX.exec(label)
    const parent = suffix?.[1]
    const due = suffix?.[2]
    return {
      id,
      kind: 'new',
      change: '',
      label: suffix ? label.slice(0, suffix.index) : label,
      ...(parent ? { parent } : {}),
      ...(due ? { due } : {}),
    }
  }
  if (/^(ajoutée et )?cochée\b/.test(said) || /^close,/.test(said)) {
    return { id, kind: 'done', change: said.replace(/^ajoutée et /, ''), label }
  }
  if (/^(annulée|retirée)\b/.test(said)) return { id, kind: 'cancel', change: said, label }
  return { id, kind: 'upd', change: said.replace(/ ; /g, ' · '), label }
}

/**
 * Le texte d'un bloc de message coupé en parts : des lignes qui se suivent forment une pile de cartes, le
 * reste reste du texte. Une ligne dans un bloc de code (```) n'est pas lue ; une part de texte vide est retirée.
 */
export function splitWritten(text: string): MessagePart[] {
  const parts: MessagePart[] = []
  let buffer: string[] = []
  let fenced = false
  const flush = () => {
    const joined = buffer.join('\n').replace(/^\n+|\n+$/g, '')
    if (joined.trim() !== '') parts.push({ kind: 'text', text: joined })
    buffer = []
  }
  for (const raw of text.split('\n')) {
    if (/^\s*```/.test(raw)) fenced = !fenced
    const line = fenced ? undefined : writtenLine(raw)
    if (!line) {
      buffer.push(raw)
      continue
    }
    flush()
    const last = parts.at(-1)
    if (last?.kind === 'cards') last.lines.push(line)
    else parts.push({ kind: 'cards', lines: [line] })
  }
  flush()
  return parts
}

/** Une carte prête à dessiner : la ligne, enrichie de sa tâche dans la roadmap. */
export type WrittenCard = { id: string; kind: WrittenKind; title: string; change: string; axis?: { name: string; index: number }; due?: string }

/** « 2026-11-12 » → « 12/11 » : les cartes disent les dates en jour/mois, comme les lignes du compte rendu. */
const ddmm = (iso: string): string => {
  const [, m, d] = iso.slice(0, 10).split('-')
  return m && d ? `${d}/${m}` : iso
}

/**
 * Chaque ligne enrichie de sa tâche (trouvée par `id:`) : nom court, axe (son rang parmi ceux de la roadmap) et
 * échéance. Une tâche introuvable se dessine quand même, avec le libellé de la ligne et sans axe.
 */
export function writtenCards(lines: readonly WrittenLine[], tasks: readonly Task[], short: (t: Task) => string): WrittenCard[] {
  const axes = roadmapAxes(tasks)
  return lines.map(line => {
    const task = line.id === '?' ? undefined : tasks.find(t => t.id === line.id)
    const title = task ? short(task) : line.label || `#${line.id}`
    const open = line.kind === 'new' || line.kind === 'upd'
    const due = task ? (open && !task.done && task.due ? ddmm(task.due) : undefined) : line.due
    const axisIndex = task && task.axis !== '' ? axes.indexOf(task.axis) : -1
    const change =
      line.kind === 'new'
        ? [line.parent ? `sous #${line.parent}` : '', line.label !== '' && line.label !== title ? line.label : '', due ? '' : 'sans échéance'].filter(x => x !== '').join(' · ')
        : line.change
    return {
      id: line.id,
      kind: line.kind,
      title,
      change,
      ...(task && axisIndex >= 0 ? { axis: { name: task.axis, index: axisIndex } } : {}),
      ...(due ? { due } : {}),
    }
  })
}

const KIND_WORD: Record<WrittenKind, string> = { new: '+ Nouvelle', upd: 'Mise à jour', done: 'Done', cancel: 'Annulée' }

/** Le fond et l'encre de la pastille d'une sorte, puis la couleur du numéro. */
function kindTones(palette: Palette, kind: WrittenKind): { bg: string; fg: string; num: string } {
  switch (kind) {
    case 'new':
      return { bg: palette.doneTint, fg: palette.ok, num: palette.ok }
    case 'upd':
      return { bg: palette.liveTint, fg: palette.liveOn, num: palette.liveOn }
    case 'done':
      return { bg: palette.finishedTint, fg: palette.finishedOn, num: palette.finishedOn }
    case 'cancel':
      return { bg: palette.sel, fg: palette.text2, num: palette.text3 }
  }
}

/**
 * Le message redessiné : le texte en Markdown, les lignes du compte rendu en une pile de cartes à leur place
 * (maquette A). `cards` enrichit les lignes d'une pile ; `el` est ce que rend `$.ui.resolve(e)`.
 */
export function drawWrittenMessage(el: ReturnType<EngineInterface['ui']['resolve']>, parts: readonly MessagePart[], cards: (lines: WrittenLine[]) => WrittenCard[], palette: Palette): RenderElement {
  const { Box, Text, Markdown } = el
  const Svg = 'Svg' in el ? el.Svg : undefined
  const seen = new Map<string, number>()
  const pill = (text: string, bg: string, fg: string, weight?: 500 | 600) => {
    if (!Svg) return <Text key={text} size="caption" color={fg}>{` ${text} `}</Text>
    const p = pillIcon({ text, bg, fg, height: SIZE.pill.row, ...(weight ? { weight } : {}) })
    return <Svg key={text} source={p.source} alt={text} width={p.width} height={p.height} />
  }
  const card = (c: WrittenCard) => {
    const tones = kindTones(palette, c.kind)
    const n = seen.get(c.id) ?? 0
    seen.set(c.id, n + 1)
    const cancelled = c.kind === 'cancel'
    const accent = c.axis ? axisColor(palette, c.axis.index) : undefined
    // La pastille d'axe de la maquette A : le carré de l'axe sur un fond de bouton, le nom en texte secondaire.
    const axisPill =
      c.axis && accent !== undefined ? (
        Svg ? (
          (() => {
            const a = axisPillIcon({ name: c.axis.name, hex: accent, bg: palette.btn, fg: palette.text2 })
            return <Svg key="axis" source={a.source} alt={c.axis.name} width={a.width} height={a.height} />
          })()
        ) : (
          <Text key="axis" size="caption" color={accent}>{c.axis.name}</Text>
        )
      ) : null
    const duePill = c.due ? pill(`due ${c.due}`, palette.sel, palette.text2, TEXT.weight.soft) : null
    return (
      <Box key={n === 0 ? `written:${c.id}` : `written:${c.id}:${n}`} flexDirection="row" alignItems="flex-start" gap={SPACE.row} borderStyle="round" borderColor={palette.border} paddingX="sm" paddingY="xs">
        <Box minWidth={6} flexShrink={0} alignItems="flex-end">
          <Text size="title" weight="semibold" color={tones.num}>{`#${c.id}`}</Text>
        </Box>
        <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0} gap={SPACE.tight}>
          <Box flexDirection="row" alignItems="center" gap={SPACE.block}>
            <Box key="written-title" flexGrow={1} flexShrink={1} minWidth={0}>
              <Text size="heading" weight="semibold" wrap="truncate-end" {...(cancelled ? { strikethrough: true, color: palette.text3 } : {})}>{c.title}</Text>
            </Box>
            {pill(KIND_WORD[c.kind], tones.bg, tones.fg)}
          </Box>
          {c.change !== '' && <Text size="footnote" color={palette.text2} wrap="truncate-end">{inkRefs(c.change, Text, palette.text)}</Text>}
          {(axisPill || duePill) && (
            <Box flexDirection="row" alignItems="center" gap={SPACE.block}>
              {axisPill}
              {duePill}
            </Box>
          )}
        </Box>
      </Box>
    )
  }
  return (
    <Box flexDirection="column" gap={SPACE.block}>
      {parts.map((part, i) =>
        part.kind === 'text' ? (
          <Markdown key={`text:${i}`} text={part.text} />
        ) : (
          <Box key={`cards:${i}`} flexDirection="column" gap={SPACE.block}>
            {cards(part.lines).map(card)}
          </Box>
        ),
      )}
    </Box>
  )
}

/** « ce qui a changé » : les `#N` et les dates `JJ/MM` en encre pleine, le reste en texte secondaire. */
function inkRefs(text: string, Text: ReturnType<EngineInterface['ui']['resolve']>['Text'], ink: string): RenderElement[] | string {
  const pieces = text.split(/(#\d+|\b\d{2}\/\d{2}\b)/)
  if (pieces.length === 1) return text
  return pieces.filter(x => x !== '').map((x, i) => (/^(#\d+|\d{2}\/\d{2})$/.test(x) ? <Text key={i} color={ink}>{x}</Text> : x)) as never
}
