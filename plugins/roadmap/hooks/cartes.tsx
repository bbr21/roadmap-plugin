// Les cartes des tâches écrites (#371, maquette A de docs/plans/feat-cartes-taches-ecrites/maquettes.html) :
// les lignes « - Roadmap : #N … » que le plugin donne après une écriture de la roadmap (#244) et que Claude
// recopie dans son message se dessinent en une carte par tâche. Ce fichier lit les lignes et les dessine ;
// il ne les écrit pas (`renderReport`, `reportOf`, `changeText` restent à parse.ts), et le texte que lit le modèle ne change pas.

import type { EngineInterface, RenderElement } from 'claude-code'

import { axisColor } from './icons'
import { daysBetween, dueLabel, isPriority, isThirdParty, roadmapAxes, shortAttend, testTitle, type Task } from './parse'
import { RADIUS, SPACE, type Palette } from './tokens'

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

/** La couleur d'une pastille d'échéance ou de « qui » : la même famille que les pastilles du panneau. */
export type WrittenDue = { text: string; tone: 'late' | 'soon' | 'none' }
export type WrittenWho = { text: string; tone: 'live' | 'wait' | 'soon' }

/** Une carte prête à dessiner : la ligne, enrichie de sa tâche dans la roadmap (maquette A2, version 3). */
export type WrittenCard = {
  id: string
  kind: WrittenKind
  title: string
  change: string
  axis?: { name: string; index: number }
  due?: WrittenDue
  who?: WrittenWho
  /** « sous #P », sinon « après #N » : sa place dans la chaîne. */
  chain?: string
}

/** Ce que la mémoire de l'avant garde d'une tâche (#371) : les trois champs que la carte montre en « avant → après ». */
export type WrittenBefore = Pick<Task, 'due' | 'attend' | 'prio'>

/** « 2026-11-12 » → « 12/11 » : les cartes disent les dates en jour/mois, comme les lignes du compte rendu. */
const ddmm = (iso: string): string => {
  const [, m, d] = iso.slice(0, 10).split('-')
  return m && d ? `${d}/${m}` : iso
}

/** La date `JJ/MM` d'une nouvelle introuvable, ramenée à l'année qui la rend proche d'aujourd'hui. */
function isoOfDdmm(text: string, today: string): string | undefined {
  const m = /^(\d{2})\/(\d{2})$/.exec(text)
  if (!m) return undefined
  const year = Number(today.slice(0, 4))
  const at = (y: number) => `${y}-${m[2]}-${m[1]}`
  return daysBetween(today, at(year)) < -180 ? at(year + 1) : at(year)
}

/** L'échéance relative d'une pastille : « 2 j de retard » rouge, « aujourd'hui » et « demain » orange, sinon neutre. */
function dueOf(due: string, today: string): WrittenDue {
  const label = dueLabel(due, today)
  return { text: label.text, tone: label.late ? 'late' : label.text === "aujourd'hui" || label.text === 'demain' ? 'soon' : 'none' }
}

/** Sa place dans la chaîne : le parent d'abord, sinon la première prérequise (`après:`) encore ouverte. */
function chainOf(task: Task, tasks: readonly Task[]): string | undefined {
  if (task.parent) return `sous #${task.parent}`
  for (const raw of (task.apres ?? '').split(',')) {
    const n = /^\s*#?(\d+)\s*$/.exec(raw)?.[1]
    if (n && tasks.some(t => t.id === n && !t.done)) return `après #${n}`
  }
  return undefined
}

/**
 * « ce qui a changé » avec l'avant gardé : `redatée au …` / `due retiré` deviennent `échéance 12/11 → 13/11` à leur place,
 * les clés `prio` et `attend` de `complétée : …` (ou `… retiré`) deviennent `priorité non → oui` et `attend X → Y` en fin de
 * ligne. Un morceau que la ligne ne dit pas, ou dont l'avant égale l'état d'aujourd'hui, garde son texte.
 */
export function beforeAfter(change: string, before: WrittenBefore, now: Task): string {
  const dueB = before.due
  const dueN = now.ownDue ?? now.due
  const dueDiffers = dueB !== dueN
  const prioB = isPriority(before) ? 'oui' : 'non'
  const prioN = isPriority(now) ? 'oui' : 'non'
  const attendB = before.attend === undefined ? 'aucun' : shortAttend(before.attend)
  const attendN = now.attend === undefined ? 'aucun' : shortAttend(now.attend)
  const swap = { prio: prioB !== prioN, attend: attendB !== attendN }
  const out: string[] = []
  const tail: string[] = []
  const pushed = new Set<string>()
  const add = (key: 'prio' | 'attend') => {
    if (pushed.has(key)) return
    pushed.add(key)
    tail.push(key === 'prio' ? `priorité ${prioB} → ${prioN}` : `attend ${attendB} → ${attendN}`)
  }
  for (const part of change.split(' · ')) {
    if (dueDiffers && (/^redatée au \d{2}\/\d{2}$/.test(part) || part === 'due retiré')) {
      out.push(`échéance ${dueB ? ddmm(dueB) : 'aucune'} → ${dueN ? ddmm(dueN) : 'aucune'}`)
      continue
    }
    const retired = /^(prio|attend) retiré$/.exec(part)?.[1] as 'prio' | 'attend' | undefined
    if (retired && swap[retired]) {
      add(retired)
      continue
    }
    const keys = /^complétée : (.+)$/.exec(part)?.[1]
    if (keys) {
      const kept = keys.split(', ').filter(k => {
        if ((k === 'prio' || k === 'attend') && swap[k]) {
          add(k)
          return false
        }
        return true
      })
      if (kept.length > 0) out.push(`complétée : ${kept.join(', ')}`)
      continue
    }
    out.push(part)
  }
  return [...out, ...tail].join(' · ')
}

export type WrittenCardsOptions = {
  /** Le nom court d'une tâche. */
  short: (t: Task) => string
  /** Aujourd'hui, `AAAA-MM-JJ` : l'échéance se dit en jours. */
  today: string
  /** Qui tient la tâche (une session, un test, la personne) : un état déjà en mémoire du module, jamais un nouvel appel. */
  who?: (t: Task) => WrittenWho | undefined
  /** Mes noms : l'attente d'un autre dit « attend <Nom> ». */
  me?: readonly string[]
  /** L'avant de chaque tâche mise à jour (mémoire `written-before`). */
  before?: ReadonlyMap<string, WrittenBefore>
}

/**
 * Chaque ligne enrichie de sa tâche (trouvée par `id:`) : nom court, axe (son rang parmi ceux de la roadmap), échéance
 * relative, « qui » et chaîne. Une tâche introuvable se dessine quand même, avec le libellé de la ligne et sans axe.
 */
export function writtenCards(lines: readonly WrittenLine[], tasks: readonly Task[], o: WrittenCardsOptions): WrittenCard[] {
  const axes = roadmapAxes(tasks)
  return lines.map(line => {
    const task = line.id === '?' ? undefined : tasks.find(t => t.id === line.id)
    const title = task ? o.short(task) : line.label || `#${line.id}`
    const open = line.kind === 'new' || line.kind === 'upd'
    const dueIso = task ? (open && !task.done ? task.due : undefined) : line.due ? isoOfDdmm(line.due, o.today) : undefined
    const due = dueIso ? dueOf(dueIso, o.today) : undefined
    const who = task && open && !task.done ? (o.who?.(task) ?? (isThirdParty(task.attend, o.me ?? []) ? { text: `attend ${shortAttend(task.attend as string)}`, tone: 'wait' as const } : undefined)) : undefined
    const chain = task ? chainOf(task, tasks) : line.parent ? `sous #${line.parent}` : undefined
    const axisIndex = task && task.axis !== '' ? axes.indexOf(task.axis) : -1
    const known = task ? o.before?.get(line.id) : undefined
    const change =
      line.kind === 'new'
        ? [line.label !== '' && line.label !== title ? line.label : '', dueIso ? '' : 'sans échéance'].filter(x => x !== '').join(' · ')
        : line.kind === 'upd' && task && known
          ? beforeAfter(line.change, known, task)
          : line.change
    return {
      id: line.id,
      kind: line.kind,
      title,
      change,
      ...(task && axisIndex >= 0 ? { axis: { name: task.axis, index: axisIndex } } : {}),
      ...(due ? { due } : {}),
      ...(who ? { who } : {}),
      ...(chain ? { chain } : {}),
    }
  })
}

// ── La mémoire de l'avant et les sessions de test (#371) ─────────────────────

/** La clé du store qui garde l'avant des tâches mises à jour : `[id, avant][]`, les plus récentes en dernier. */
export const BEFORE_KEY = 'written-before'
const BEFORE_MAX = 200

/** Une liste `[id, avant][]` lue dans le store, sans ce qui n'en a pas la forme. */
function beforeEntries(stored: unknown): [string, WrittenBefore][] {
  if (!Array.isArray(stored)) return []
  return stored.flatMap(x => {
    if (!Array.isArray(x) || typeof x[0] !== 'string' || typeof x[1] !== 'object' || x[1] === null) return []
    const b = x[1] as Record<string, unknown>
    return [[x[0], { ...(typeof b.due === 'string' ? { due: b.due } : {}), ...(typeof b.attend === 'string' ? { attend: b.attend } : {}), ...(b.prio === 'oui' || b.prio === '1' || b.prio === '2' || b.prio === '3' ? { prio: b.prio } : {}) }] as [string, WrittenBefore]]
  })
}

/** La mémoire de l'avant, lue du store : `id` → ce que la tâche était avant l'écriture. */
export function beforeMap(stored: unknown): Map<string, WrittenBefore> {
  return new Map(beforeEntries(stored))
}

/**
 * La mémoire de l'avant après un tour : l'avant de chaque tâche mise à jour (échéance, attente, priorité seulement),
 * les plus récentes en dernier, 200 au plus. Une liste en liste de paires, non un objet : les clés « 375 » d'un objet
 * se rangent par numéro, et l'ordre d'écriture se perdrait.
 */
export function keepBefore(stored: unknown, fresh: readonly (readonly [string, WrittenBefore])[]): [string, WrittenBefore][] {
  const out = beforeEntries(stored)
  for (const [id, b] of fresh) {
    const at = out.findIndex(([k]) => k === id)
    if (at >= 0) out.splice(at, 1)
    out.push([id, { ...(b.due !== undefined ? { due: b.due } : {}), ...(b.attend !== undefined ? { attend: b.attend } : {}), ...(b.prio !== undefined ? { prio: b.prio } : {}) }])
  }
  return out.slice(-BEFORE_MAX)
}

/** Les `#N` en test et leur version, d'après les titres « Tester #N · X.Y.Z » des sessions listées (archivées exclues). */
export function testVersions(rows: readonly unknown[]): Map<string, string> {
  const out = new Map<string, string>()
  for (const raw of rows) {
    if (typeof raw !== 'object' || raw === null) continue
    const r = raw as { title?: unknown; isArchived?: unknown }
    if (r.isArchived === true || typeof r.title !== 'string') continue
    const t = testTitle(r.title)
    if (t) out.set(t.id, t.version)
  }
  return out
}

// ── Le dessin (maquette n1b : la carte native, version 3) ────────────────────

/** Le mot du bandeau : la sorte de la ligne, dite en mots. */
export const KIND_WORD: Record<WrittenKind, string> = { new: 'Nouvelle tâche', upd: 'Tâche mise à jour', done: 'Tâche faite', cancel: 'Tâche annulée' }

/**
 * La longueur au-delà de laquelle la description est coupée : deux lignes de `body` dans la carte (~65 signes par ligne).
 * Le kit n'a pas de nombre de lignes maximal : le texte se coupe ici, au mot, par « … ».
 */
export const DESCRIPTION_MAX = 130

/** La description tenue en deux lignes : coupée au dernier mot entier avant `max`, puis « … ». */
export function clampDescription(text: string, max = DESCRIPTION_MAX): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max + 1)
  const at = cut.lastIndexOf(' ')
  return `${(at > 0 ? cut.slice(0, at) : cut.slice(0, max)).trimEnd().replace(/[,;:.\s]+$/, '')}…`
}

/** Le ton d'une échéance et de « qui » : l'encre du texte, sans fond (la carte native n'a pas de pastille). */
const dueInk = (p: Palette, tone: WrittenDue['tone']): string => (tone === 'late' ? p.lateOn : tone === 'soon' ? p.blockOn : p.text2)
const whoInk = (p: Palette, tone: WrittenWho['tone']): string => (tone === 'live' ? p.liveOn : tone === 'wait' ? p.waitOn : p.blockOn)

/** Le carré de l'axe, 10 × 10, à sa couleur. */
const axisSquare = (hex: string): string => `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"><rect width="10" height="10" rx="${RADIUS.square}" fill="${hex}"/></svg>`

/** Ce que le hook donne au dessin en plus des cartes : l'ouverture de la fiche d'une tâche (le bouton « Ouvrir la fiche »). */
export type WrittenDrawOptions = { open?: (id: string) => void }

/**
 * Le message redessiné : le texte en Markdown, les lignes du compte rendu en une carte par tâche, à leur place
 * (maquette n1b, la forme de la carte « New session » de l'app) : le bandeau qui dit la sorte, le titre « #N · Nom », la
 * description, puis le pied (l'axe, l'échéance, qui, la chaîne ; à droite « Ouvrir la fiche »). `cards` enrichit les lignes
 * d'une pile ; `el` est ce que rend `$.ui.resolve(e)` ; `o.open(id)` ouvre la fiche de la tâche.
 */
export function drawWrittenMessage(el: ReturnType<EngineInterface['ui']['resolve']>, parts: readonly MessagePart[], cards: (lines: WrittenLine[]) => WrittenCard[], palette: Palette, o: WrittenDrawOptions = {}): RenderElement {
  const { Box, Text, Markdown, Button } = el
  const Svg = 'Svg' in el ? el.Svg : undefined
  const seen = new Map<string, number>()
  const dot = (key: string) => <Text key={key} color={palette.text3}>·</Text>
  const card = (c: WrittenCard) => {
    const n = seen.get(c.id) ?? 0
    seen.set(c.id, n + 1)
    const suffix = n === 0 ? '' : `:${n}`
    const cancelled = c.kind === 'cancel'
    const closed = c.kind === 'done' || cancelled
    const accent = c.axis ? axisColor(palette, c.axis.index) : undefined
    const axisItem =
      c.axis && accent !== undefined ? (
        <Box key="axis" flexDirection="row" alignItems="center" gap={SPACE.tight}>
          {Svg && <Svg key="sq" source={axisSquare(accent)} alt={`Axe ${c.axis.name}`} width={10} height={10} />}
          <Text color={palette.text2}>{c.axis.name}</Text>
        </Box>
      ) : null
    const items = [
      axisItem,
      !closed && c.due ? <Text key="due" color={dueInk(palette, c.due.tone)}>{c.due.text}</Text> : null,
      !closed && c.who ? <Text key="who" color={whoInk(palette, c.who.tone)}>{c.who.text}</Text> : null,
      !closed && c.chain ? (
        <Text key="chain" color={palette.text2}>
          {c.chain.split(/(#\d+)/).filter(x => x !== '').map((x, i) => (/^#\d+$/.test(x) ? <Text key={i} color={palette.text}>{x}</Text> : x)) as never}
        </Text>
      ) : null,
    ].filter(x => x !== null)
    const meta = items.flatMap((x, i) => (i === 0 ? [x] : [dot(`dot${i}`), x]))
    return (
      <Box key={`written:${c.id}${suffix}`} flexDirection="column" borderStyle="round" borderColor={palette.border} paddingX={0} paddingY={0}>
        <Box key={`written-band:${c.id}${suffix}`} backgroundColor={palette.hover} paddingX="lg" paddingY="sm">
          <Text size="footnote" color={palette.text2}>{KIND_WORD[c.kind]}</Text>
        </Box>
        <Box key="written-body" flexDirection="column" gap={SPACE.tight} paddingX="lg" paddingTop="md" paddingBottom="xs">
          <Text size="body" weight="medium" wrap="truncate-end" {...(cancelled ? { strikethrough: true, color: palette.text3 } : { color: palette.text })}>{`#${c.id} · ${c.title}`}</Text>
          {c.change !== '' && <Text size="body" color={palette.text2} wrap="wrap">{clampDescription(c.change)}</Text>}
        </Box>
        <Box key="written-foot" flexDirection="row" alignItems="center" justifyContent="space-between" gap={SPACE.block} paddingLeft="lg" paddingRight="md" paddingTop="xs" paddingBottom="md">
          <Box key={meta.length > 0 ? `written-meta:${c.id}${suffix}` : 'written-space'} flexDirection="row" alignItems="center" gap={SPACE.tight} flexGrow={1} flexShrink={1} minWidth={0} flexWrap="wrap">
            {meta}
          </Box>
          <Button key={n === 0 ? `written-open:${c.id}` : `written-open:${c.id}${suffix}`} variant="primary" label="Ouvrir la fiche" onPress={() => o.open?.(c.id)} />
        </Box>
      </Box>
    )
  }
  return (
    <Box flexDirection="column" gap={SPACE.block}>
      {parts.map((part, i) => {
        if (part.kind === 'text') return <Markdown key={`text:${i}`} text={part.text} />
        return (
          <Box key={`cards:${i}`} flexDirection="column" gap={SPACE.block}>
            {cards(part.lines).map(card)}
          </Box>
        )
      })}
    </Box>
  )
}
