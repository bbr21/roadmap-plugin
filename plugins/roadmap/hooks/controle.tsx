import { atom, read, update } from 'claude-code'
import type { EngineInterface, RenderElement, RenderInput } from 'claude-code'

import { archiveIcon, checkIcon, controlIcon, controlNodeIcon, pauseIcon, pausedIcon, pausingIcon, pillIcon, playIcon, priorityIcon, spinnerIcon, squareIcon, stepsBarIcon, axisColor, externalIcon, handIcon, clockIcon, type Palette } from './icons'
import { SPACE } from './tokens'
import {
  controlView,
  globalQueueOrder,
  pausingPill,
  keyPart,
  queueAtBetween,
  queueCardKey,
  queuedLine,
  queueRank,
  type ChildStatus,
  type ControlCard,
  type GlobalQueued,
  type SessionPause,
  type StepSegment,
} from './parse'

// Le volet Centre de contrôle (#367, maquette jouable docs/plans/feat-centre-controle/interactive.html, validée par BBR) :
// toutes les sessions de tâche du Mac en une liste, En cours en haut, la file d'attente sous son palier. Il ne fait
// rien lui-même : chaque geste écrit une demande dans le store (pauses, ordre de la file, marques de priorité) que le
// Maestro de la session exécute à son pas. Il existe dans toute session, Maestro ou non.

export const CONTROL_PANE = 'controle'

/** Monte quand ce que montre le volet change, ou après chaque geste : le volet se redessine. */
export const controlStampAtom = atom({ plugin: 'roadmap', key: 'controlStamp' } as const, 0)

/** Ce que le volet demande à l'extérieur : injecté par `register.tsx`, qui tient la liste des sessions, le store et les outils de l'app. */
export type ControlDeps = {
  /** La liste des sessions (la dernière lue quand elle ne se lit plus) et le mot sur son état. */
  rows: () => Promise<{ rows: unknown[]; note: string }>
  pauses: () => Promise<Record<string, SessionPause>>
  writePause: (sessionId: string, p: SessionPause | undefined) => Promise<void>
  /** La file commune, telle que stockée. */
  queue: () => Promise<GlobalQueued[]>
  writeQueue: (next: GlobalQueued[]) => Promise<void>
  /** Les marques de priorité du store (`<racine du projet>#<numéro>`). */
  marks: () => Promise<Set<string>>
  writeMarks: (next: string[]) => Promise<void>
  /** Les tâches `prio:oui` de la roadmap du projet de cette session, s'il y en a un. */
  ownPrio: () => Promise<{ project: string; ids: ReadonlySet<string> } | undefined>
  /** Bascule `prio:oui` sur la ligne de cette tâche du projet de cette session (#300). */
  togglePriority: (id: string) => Promise<void>
  statusOf: (sessionId: string) => Promise<ChildStatus | undefined>
  /** Apprend la date de création des sessions (une lecture par session, gardée). */
  learnCreated: (sessionIds: readonly string[]) => Promise<void>
  createdOf: (sessionId: string) => number | undefined
  heavyBranches: () => Promise<Set<string>>
  maestros: (rows: readonly unknown[]) => Promise<Set<string>>
  /** Les places tenues sur le Mac et son plafond. */
  places: (rows: readonly unknown[], statusOf: (sessionId: string) => ChildStatus | undefined, pauses: Record<string, SessionPause>) => Promise<{ taken: number; max: number }>
  /** La racine du projet d'un dossier de session ; `queue` donne les projets connus. */
  projectOf: (queue: readonly GlobalQueued[]) => (cwd: string) => string
  /** L'identifiant de cette session, pour une demande dont la session n'a pas de Maestro. */
  ownId: () => Promise<string>
  /** Cette session est-elle un Maestro (#383) ? Alors c'est elle qui exécute la Pause qu'on y clique. */
  ownIsMaestro: () => Promise<boolean>
  /**
   * Arrête la session tout de suite, au clic (#383, retour de test) : l'outil de l'app, puis la pause exécutée et son
   * entrée de reprise. Refusé (mode auto, Remote Control) : `false`, la demande reste au Maestro.
   */
  stopNow: (sessionId: string, p: SessionPause) => Promise<boolean>
  /** Ouvre la session ; le lien `claude://` sert de repli (#374). Ratée, elle lève, et le volet le dit. */
  open: (sessionId: string, title: string, link?: string) => Promise<void>
  /** Les tâches closes de la roadmap de cette session (`<racine>#<numéro>`) : leur session est finie. */
  closed: () => Promise<Set<string>>
  /** Archive la session (l'outil de l'app) ; lève avec le motif d'un refus. */
  archive: (sessionId: string) => Promise<void>
  /** Pose la zone de clic d'un texte : enregistre son geste et rend la clé de sa région Client. */
  pressZone: (id: string, onPress: () => void) => Promise<string>
}

/** Tout ce que lit le volet en un passage : la liste, la file, les pauses, les marques et ce qui s'en déduit. */
export type ControlData = {
  rows: unknown[]
  note: string
  pauses: Record<string, SessionPause>
  queue: GlobalQueued[]
  marks: Set<string>
  own: { project: string; ids: ReadonlySet<string> } | undefined
  projectOf: (cwd: string) => string
  view: { running: ControlCard[]; queued: ControlCard[] }
  taken: number
  max: number
}

export async function controlData(deps: ControlDeps): Promise<ControlData> {
  const { rows, note } = await deps.rows()
  const [pauses, queue, stored, own, heavy, maestros, closed] = await Promise.all([deps.pauses(), deps.queue(), deps.marks(), deps.ownPrio(), deps.heavyBranches(), deps.maestros(rows), deps.closed()])
  // la priorité posée dans la roadmap (la fiche, le clic d'une autre session) compte comme une marque
  const marks = new Set(stored)
  if (own) for (const id of own.ids) marks.add(`${own.project}#${id}`)
  const ids = [
    ...rows.flatMap(r => {
      const row = r as { sessionId?: unknown; title?: unknown }
      return typeof row.sessionId === 'string' && typeof row.title === 'string' && /^#\d+\s*·/.test(row.title) ? [row.sessionId] : []
    }),
    ...queue.flatMap(e => (e.kind === 'resume' && e.sessionId ? [e.sessionId] : [])),
  ]
  const [pairs] = await Promise.all([Promise.all(ids.map(async id => [id, await deps.statusOf(id)] as const)), deps.learnCreated(ids)])
  const statuses = new Map(pairs)
  const statusOf = (id: string) => statuses.get(id)
  const projectOf = deps.projectOf(queue)
  const view = controlView({ rows, queue, pauses, marks, statusOf, createdOf: deps.createdOf, heavyBranches: heavy, maestros, projectOf, closed })
  const places = await deps.places(rows, statusOf, pauses)
  return { rows, note, pauses, queue, marks, own, projectOf, view, taken: places.taken, max: places.max }
}

/** Ce que dessine le volet, en une chaîne : change, le volet se redessine. */
function signatureOf(d: ControlData): string {
  return JSON.stringify([d.view, d.taken, d.max, d.note])
}

// ---------------------------------------------------------------- les gestes

/** Les gestes, l'un après l'autre : deux clics rapprochés ne s'écrasent pas ; le volet se redessine après chacun. */
let acting: Promise<void> = Promise.resolve()
/** Ce qu'a dit le dernier geste quand il a échoué ; vide sinon. */
let controlNote = ''
/** Ce qu'a fait le dernier geste qui change l'ordre (#362) : « #N est maintenant 2e » ; vide sinon. */
let controlInfo = ''

function act($: EngineInterface, work: () => Promise<void>, failPrefix = "Rien d'écrit : "): Promise<void> {
  acting = acting.then(async () => {
    try {
      controlInfo = ''
      await work()
      controlNote = ''
    } catch (err) {
      controlNote = `${failPrefix}${err instanceof Error ? err.message : String(err)}`
    }
    await update($, controlStampAtom, v => v + 1)
  })
  return acting
}

/** L'entrée de la file d'une carte, relue de la file stockée. */
const entryOf = (queue: readonly GlobalQueued[], key: string) => queue.find(e => queueCardKey(e) === key)

/**
 * Pause : un arrêt net « à la main ». Depuis le retour de test de #383, le clic arrête la session lui-même quand l'app
 * le laisse faire ; sinon la demande reste au Maestro qui l'exécute à son pas. Un second clic ne l'annule jamais : une
 * demande en cours a son propre bouton, « Annuler la pause » (`cancelPause`).
 */
async function pauseNow($: EngineInterface, deps: ControlDeps, card: ControlCard): Promise<void> {
  const id = card.sessionId
  if (!id) return
  const d = await controlData(deps)
  if (d.pauses[id] !== undefined) return
  const startedBy = (d.rows.find(r => (r as { sessionId?: unknown }).sessionId === id) as { startedBy?: unknown } | undefined)?.startedBy
  // #383 : le Maestro qui reçoit le clic l'exécute ; ailleurs, le Maestro de la session (tout Maestro ouvert la reprend).
  const here = await deps.ownIsMaestro().catch(() => false)
  const maestro = !here && typeof startedBy === 'string' && startedBy !== '' ? startedBy : await deps.ownId()
  const asked: SessionPause = { mode: 'stop', state: 'asked', by: 'hand', maestro, at: await $.clock.now() }
  await deps.writePause(id, asked)
  const stopped = await deps.stopNow(id, asked).catch(() => false)
  controlInfo = stopped ? `#${card.id} est arrêtée et passe en pause` : `#${card.id} : arrêt demandé, Maestro l'exécute à son pas`
}

/** Annuler la pause : une demande pas encore exécutée s'efface. */
async function cancelPause(deps: ControlDeps, card: ControlCard): Promise<void> {
  const id = card.sessionId
  if (!id) return
  const d = await controlData(deps)
  if (d.pauses[id]?.state === 'asked') await deps.writePause(id, undefined)
}

/** Le `at` d'une entrée remise en tête de son groupe (les prioritaires d'un côté, le reste de l'autre). */
function headAt(ordered: readonly GlobalQueued[], entry: GlobalQueued, now: number): number {
  const group = ordered.filter(e => e !== entry && Boolean(e.prio) === Boolean(entry.prio))
  return queueAtBetween(undefined, group[0]?.at, now)
}

/** Réécrit la file avec un autre `at` pour une entrée. */
async function moveEntry(deps: ControlDeps, entry: GlobalQueued, at: number, release = false): Promise<void> {
  const key = queueCardKey(entry)
  await deps.writeQueue(
    (await deps.queue()).map(e => {
      if (queueCardKey(e) !== key) return e
      // #383 : « Reprendre » vaut le ▶ de la personne : l'entrée retenue repart.
      const { held: _held, ...rest } = e
      return release ? { ...rest, at } : { ...e, at }
    }),
  )
}

/**
 * Passer en cours, ou reprendre : l'entrée passe en tête. Le Mac plein, la dernière lancée qui n'est pas
 * prioritaire finit son tour et se met en pause (demande douce) ; une place libre, personne ne cède.
 */
async function passIn($: EngineInterface, deps: ControlDeps, key: string): Promise<void> {
  const d = await controlData(deps)
  const entry = entryOf(d.queue, key)
  if (!entry) return
  const now = await $.clock.now()
  if (d.taken >= d.max) {
    const victims = d.view.running.filter(c => !c.prio && (c.state === 'run' || c.state === 'wait') && c.sessionId)
    // la dernière lancée : la plus récente par sa création ; à défaut de date, la dernière de la liste
    const last = victims.reduce<ControlCard | undefined>((best, c) => (best === undefined || (deps.createdOf(c.sessionId as string) ?? -1) >= (deps.createdOf(best.sessionId as string) ?? -1) ? c : best), undefined)
    if (last?.sessionId) {
      const startedBy = (d.rows.find(r => (r as { sessionId?: unknown }).sessionId === last.sessionId) as { startedBy?: unknown } | undefined)?.startedBy
      const maestro = typeof startedBy === 'string' && startedBy !== '' ? startedBy : await deps.ownId()
      await deps.writePause(last.sessionId, { mode: 'soft', state: 'asked', by: 'order', for: entry.id, maestro, at: now })
    }
  }
  await moveEntry(deps, entry, headAt(globalQueueOrder(d.queue), entry, now), true)
}

/**
 * Monter ou descendre d'un rang (#362, flèches de la maquette A) : l'entrée échange sa place avec sa voisine de
 * son groupe (les prioritaires entre elles, les autres entre elles) ; sans voisine, rien ne bouge.
 */
async function moveByOne($: EngineInterface, deps: ControlDeps, key: string, by: -1 | 1): Promise<void> {
  const d = await controlData(deps)
  const entry = entryOf(d.queue, key)
  if (!entry) return
  const ordered = globalQueueOrder(d.queue)
  const group = ordered.filter(e => Boolean(e.prio) === Boolean(entry.prio))
  const i = group.indexOf(entry)
  const j = i + by
  if (i < 0 || j < 0 || j >= group.length) return
  const at = by < 0 ? queueAtBetween(group[j - 1]?.at, group[j].at, await $.clock.now()) : queueAtBetween(group[j].at, group[j + 1]?.at, await $.clock.now())
  await moveEntry(deps, entry, at)
  const rank = globalQueueOrder(await deps.queue()).findIndex(e => queueCardKey(e) === key) + 1
  if (rank > 0) controlInfo = `#${entry.id} est maintenant ${queueRank(rank)}`
}

/** Prioritaire : la marque du projet, la priorité de l'entrée de la file, et `prio:oui` dans la roadmap de cette session si la tâche en est. */
async function togglePrio(deps: ControlDeps, card: ControlCard): Promise<void> {
  const d = await controlData(deps)
  const entry = card.sessionId && card.state !== 'paused' ? undefined : entryOf(d.queue, card.key)
  const rowOf = card.sessionId ? d.rows.find(r => (r as { sessionId?: unknown }).sessionId === card.sessionId) : undefined
  const cwd = typeof (rowOf as { cwd?: unknown } | undefined)?.cwd === 'string' ? ((rowOf as { cwd: string }).cwd) : ''
  // la marque d'une entrée de la file porte le projet de l'entrée ; celle d'une session, le projet de son dossier
  const root = entry ? entry.project : d.projectOf(cwd)
  const mark = `${root}#${card.id}`
  const on = d.marks.has(mark)
  const stored = await deps.marks()
  const next = new Set(stored)
  if (on) next.delete(mark)
  else next.add(mark)
  await deps.writeMarks([...next])
  const queueEntry = (await deps.queue()).find(e => e.project === root && e.id === card.id)
  if (queueEntry) {
    const key = queueCardKey(queueEntry)
    await deps.writeQueue(
      (await deps.queue()).map(e => {
        if (queueCardKey(e) !== key) return e
        const { prio: _prio, ...rest } = e
        return on ? rest : { ...rest, prio: true as const }
      }),
    )
  }
  // la roadmap de cette session ne dit rien d'une tâche d'un autre projet
  if (d.own && d.own.project === root && d.own.ids.has(card.id) === on) await deps.togglePriority(card.id)
}

// ---------------------------------------------------------------- le suivi du volet ouvert

/** Toutes les 3 secondes, tant que le volet est ouvert. */
const WATCH_MS = 3_000

let watchTimer: { cancel: () => void } | undefined
let lastSignature = ''
/** Les dépendances du dernier dessin : le suivi relit ce que le volet lit, sans que `register.tsx` ait à le lui passer. */
let liveDeps: ControlDeps | undefined

/**
 * Les autres sessions écrivent aussi la file, les pauses et la liste : tant que le volet est ouvert, un seul minuteur
 * relit ce que le volet montre et le redessine quand cela change. Il s'arrête de lui-même quand le volet n'est plus
 * ouvert, quelle que soit la façon dont il s'est fermé.
 */
function watchControl($: EngineInterface): void {
  if (watchTimer) return
  watchTimer = $.clock.every(WATCH_MS, () => {
    void (async () => {
      if (!(await $.ui.panes()).some(p => p.id === CONTROL_PANE)) {
        watchTimer?.cancel()
        watchTimer = undefined
        return
      }
      if (!liveDeps) return
      const sig = signatureOf(await controlData(liveDeps))
      if (sig !== lastSignature) {
        lastSignature = sig
        await update($, controlStampAtom, v => v + 1)
      }
    })().catch(() => undefined)
  })
}

export async function openControl($: EngineInterface): Promise<{ text: string }> {
  await $.ui.open({ id: CONTROL_PANE, title: 'Centre de contrôle' })
  watchControl($)
  return { text: 'Centre de contrôle ouvert.' }
}

/** Redessine le volet : après un rechargement du module, ses boutons étant ceux de l'ancien. */
export async function redrawControl($: EngineInterface): Promise<void> {
  watchControl($)
  await update($, controlStampAtom, v => v + 1)
}

// ---------------------------------------------------------------- le dessin

const STEP_BAR_WIDTH = 96

/** Les segments d'une barre d'étapes d'après le compte de la carte : faites, l'étape en cours, à faire. */
function segmentsOf(steps: { done: number; total: number }): StepSegment[] {
  return Array.from({ length: steps.total }, (_, i): StepSegment => (i < steps.done ? 'done' : i === steps.done ? 'now' : 'todo'))
}

export async function drawControl($: EngineInterface, e: RenderInput<'Pane'>, palette: Palette, deps: ControlDeps): Promise<RenderElement> {
  const resolved = $.ui.resolve(e)
  const { Box, Text, Button } = resolved
  const Svg = 'Svg' in resolved ? resolved.Svg : undefined
  const Client = 'Client' in resolved && Svg ? resolved.Client : undefined
  await read($, controlStampAtom)
  liveDeps = deps
  const d = await controlData(deps)
  lastSignature = signatureOf(d)
  watchControl($)
  const { running, queued } = d.view
  const full = d.taken >= d.max
  // la zone de clic du numéro de chaque carte qui a une session : une seule par carte et par dessin
  const numberZones = new Map<string, string>()
  if (Client) {
    for (const c of [...running, ...queued]) {
      if (!c.sessionId || numberZones.has(c.key)) continue
      numberZones.set(c.key, await deps.pressZone(`ctl:num:${keyPart(c.key)}`, () => void act($, () => deps.open(c.sessionId as string, c.title, c.link), '')))
    }
  }

  const icon = (source: string, alt: string, width: number, height = width) => Svg && <Svg source={source} alt={alt} width={width} height={height} />
  const pill = (text: string, bg: string, fg: string) => {
    const p = pillIcon({ text, bg, fg, height: 18, weight: 500 })
    return Svg ? <Svg key={`pill:${text}`} source={p.source} alt={text} width={p.width} height={p.height} /> : <Text key={`pill:${text}`} size="caption" color={fg}>{text}</Text>
  }
  const caption = (t: string, color = palette.text2) => (
    <Text size="caption" color={color} wrap="wrap">
      {t}
    </Text>
  )

  /**
   * Un geste : son icône, puis un bouton écrit. Allumé, il reste simple (#362, fidélité à la maquette) : son icône
   * dit l'état (le drapeau rouge), le bouton principal du bureau le dessinait en gros bouton blanc.
   */
  const gesture = (key: string, mark: string | false, markAlt: string, label: string, onPress: () => void) => (
    <Box key={`g:${key}`} flexDirection="row" alignItems="center" flexShrink={0}>
      {mark && icon(mark, markAlt, 14)}
      <Button key={key} plain label={label} onPress={onPress} />
    </Box>
  )

  const tag = (c: ControlCard) => (
    <Box flexDirection="row" alignItems="center" gap={SPACE.tight} flexShrink={0}>
      {icon(squareIcon(axisColor(palette, c.tone), 8), `projet ${c.project}`, 8)}
      <Text size="caption" color={palette.text2} wrap="truncate-end">
        {c.project}
      </Text>
    </Box>
  )

  const stateMark = (c: ControlCard): [string, string] => {
    if (c.state === 'done') return [checkIcon(palette.finished, 14), 'finie']
    if (c.state === 'wait') return [handIcon(palette.wait, 14), "t'attend"]
    if (c.state === 'paused') return [pausedIcon(palette.block, 14), 'en pause']
    if (c.state === 'queued') return [clockIcon(palette.text3, 14), 'en file']
    if (c.state === 'pausing') return [pausingIcon(palette.block, 14), c.pause?.mode === 'stop' ? "s'arrête" : 'se met en pause']
    return [spinnerIcon(palette.live, 14), 'tourne']
  }

  /** Le numéro « #N » : s'il y a une session, il l'ouvre (un texte et sa zone de clic ; au terminal, un bouton). */
  const number = (c: ControlCard) => {
    const text = `#${c.id}`
    const zone = numberZones.get(c.key)
    if (!c.sessionId) return <Text color={palette.text3} tabular>{text}</Text>
    if (!Client || !zone) return <Button key={`ctl:num:${keyPart(c.key)}`} plain label={text} onPress={() => void act($, () => deps.open(c.sessionId as string, c.title, c.link), '')} />
    return (
      <Box key={`num:${c.key}`} flexShrink={0}>
        <Text color={palette.text3} tabular>{text}</Text>
        <Box position="absolute" top={0} left={0} right={0}>
          <Client key={zone} module="./press-hit.tsx" props={{ id: `ctl:num:${keyPart(c.key)}` }} width="100%" height={1} />
        </Box>
      </Box>
    )
  }

  const card = (c: ControlCard, rank: number, zone: 'run' | 'queue', moves: { up: boolean; down: boolean } = { up: false, down: false }) => {
    const [mark, markAlt] = stateMark(c)
    const done = c.state === 'done'
    const nodeKind = done ? 'done' : c.prio ? 'prio' : c.state === 'wait' ? 'wait' : c.state === 'pausing' ? 'pausing' : zone === 'queue' ? 'queued' : 'run'
    const node = controlNodeIcon(palette, { kind: nodeKind, n: rank })
    const border = done ? palette.finished : c.prio ? palette.late : c.state === 'pausing' ? palette.block : palette.border
    const pills: RenderElement[] = []
    if (done) pills.push(pill(c.test ? `en test ${c.test}` : 'Done', palette.finishedTint, palette.finishedOn))
    else if (c.state === 'pausing') pills.push(pill(pausingPill(c.pause?.mode ?? 'soft'), palette.blockTint, palette.blockOn))
    else if (c.prio) pills.push(pill('prioritaire', palette.lateTint, palette.lateOn))
    else if (c.state === 'wait') pills.push(pill("t'attend", palette.waitTint, palette.waitOn))
    if (c.heavy && c.state === 'run') pills.push(pill('tests lourds', palette.btn, palette.text2))
    if (c.state === 'paused') pills.push(pill('en pause', palette.blockTint, palette.blockOn))

    const refusedStop = c.pause?.failed ? `arrêt refusé · ${c.pause.failed.reason} · réessaie chaque minute` : undefined
    const progress = refusedStop ? refusedStop : done
      ? c.steps
        ? `${c.steps.done}/${c.steps.total} · ${c.steps.current || 'prête à fusionner'}`
        : 'prête à fusionner'
      : c.steps
        ? `${c.steps.done}/${c.steps.total}${c.steps.current ? ` · ${c.steps.current}` : ''}`
        : undefined
    const waitLine =
      c.state === 'paused'
        ? `en pause${c.steps ? ` · ${c.steps.done}/${c.steps.total} faites` : ''} · ${c.held ? 'reprend à ton « Reprendre »' : 'reprend seule à son tour'}`
        : queuedLine(c)
    const bar =
      c.steps && zone === 'run' && Svg
        ? (() => {
            const b = stepsBarIcon(palette, segmentsOf(c.steps), { width: STEP_BAR_WIDTH, waiting: c.state === 'wait' || c.state === 'pausing', ...(done ? { finished: true } : {}) })
            return <Svg key="bar" source={b.source} alt={`étapes ${c.steps.done}/${c.steps.total}`} width={b.width} height={b.height} />
          })()
        : null

    const buttons: RenderElement[] = []
    // #383 : une tâche en test garde sa session ouverte (les retours de test y arrivent) : pas d'archivage d'ici.
    if (done && c.test) {
      // la session attend les retours de test
    } else if (done) {
      buttons.push(gesture(`ctl:archive:${keyPart(c.key)}`, archiveIcon(palette.text3, 14), 'Archiver', 'Archiver', () => void act($, () => deps.archive(c.sessionId as string))))
    } else {
      buttons.push(gesture(`ctl:prio:${keyPart(c.key)}`, Svg ? priorityIcon(c.prio, palette, 14) : false, c.prio ? 'Prioritaire' : 'Sans priorité', 'Prioritaire', () => void act($, () => togglePrio(deps, c))))
    }
    if (done) {
      // rien à mettre en pause : la session est finie
    } else if (zone === 'run') {
      // #383 : Pause et Annuler ont chacun leur clé : un double clic ne défait plus la pause qu'il vient de poser.
      if (c.state === 'pausing') buttons.push(gesture(`ctl:unpause:${c.sessionId}`, playIcon(palette.live, 14), 'Annuler la pause', 'Annuler la pause', () => void act($, () => cancelPause(deps, c))))
      else if (c.state !== 'paused') buttons.push(gesture(`ctl:pause:${c.sessionId}`, pauseIcon(palette.text3, 14), 'Pause', 'Pause', () => void act($, () => pauseNow($, deps, c))))
    } else {
      buttons.push(gesture(`ctl:pass:${keyPart(c.key)}`, playIcon(palette.live, 14), 'Reprendre', c.state === 'paused' ? 'Reprendre' : 'Passer en cours', () => void act($, () => passIn($, deps, c.key))))
    }
    if (c.sessionId) buttons.push(gesture(`ctl:open:${keyPart(c.key)}`, externalIcon(palette.text3, 14), 'Ouvrir la session', 'Ouvrir', () => void act($, () => deps.open(c.sessionId as string, c.title, c.link), '')))
    if (zone === 'queue') {
      buttons.push(
        <Box key={`move:${c.key}`} flexDirection="row" alignItems="center" flexGrow={1} justifyContent="flex-end" gap={SPACE.tight}>
          <Button key={`ctl:up:${keyPart(c.key)}`} plain dimColor={!moves.up} label="↑" onPress={() => void (moves.up && act($, () => moveByOne($, deps, c.key, -1)))} />
          <Button key={`ctl:down:${keyPart(c.key)}`} plain dimColor={!moves.down} label="↓" onPress={() => void (moves.down && act($, () => moveByOne($, deps, c.key, 1)))} />
        </Box>,
      )
    }

    return (
      <Box key={`card:${c.key}`} flexDirection="row" alignItems="flex-start" gap={SPACE.row}>
        <Box flexShrink={0}>{icon(node.source, c.prio ? 'prioritaire' : `rang ${rank}`, node.width, node.height)}</Box>
        <Box flexGrow={1} flexShrink={1} minWidth={0} flexDirection="column" gap={SPACE.tight} borderStyle="round" borderColor={border} paddingX="sm" paddingY="xs">
          <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
            <Box flexShrink={0}>{icon(mark, markAlt, 14)}</Box>
            {number(c)}
            <Box flexGrow={1} flexShrink={1} minWidth={0}>
              <Text weight="semibold" wrap="truncate-end">{c.title}</Text>
            </Box>
            {tag(c)}
          </Box>
          <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
            {bar}
            <Box flexGrow={1} flexShrink={1} minWidth={0}>
              {zone === 'run' ? (
                progress ? <Text size="caption" color={palette.text2} wrap="truncate-end">{progress}</Text> : null
              ) : (
                <Text size="caption" color={palette.text3} wrap="truncate-end">{waitLine}</Text>
              )}
            </Box>
            {pills}
          </Box>
          <Box flexDirection="row" alignItems="center" gap={SPACE.tight} flexWrap="wrap">
            {buttons}
          </Box>
        </Box>
      </Box>
    )
  }

  const unreadable = d.note !== ''
  const queueBody: RenderElement[] = []
  queued.forEach((c, i) => {
    // une voisine du même groupe : les prioritaires montent et descendent entre elles, les autres aussi
    const same = (o: ControlCard | undefined) => o !== undefined && Boolean(o.prio) === Boolean(c.prio)
    queueBody.push(card(c, i + 1, 'queue', { up: same(queued[i - 1]), down: same(queued[i + 1]) }))
  })

  return (
    <Box flexDirection="column" gap={SPACE.block} paddingX={SPACE.indent} paddingTop="sm" paddingBottom="md">
      <Box key="title" flexDirection="row" alignItems="center" justifyContent="space-between" gap={SPACE.row}>
        <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
          {icon(controlIcon(palette.text2, 16), 'centre de contrôle', 16)}
          <Text size="heading" weight="semibold">
            Centre de contrôle
          </Text>
        </Box>
        {pill(`Mac ${d.taken}/${d.max} · ${queued.length} en file`, full ? palette.blockTint : palette.liveTint, full ? palette.blockOn : palette.liveOn)}
      </Box>
      {unreadable && <Box key="note">{caption(d.note, palette.lateOn)}</Box>}
      {controlNote !== '' && <Box key="act-note">{caption(controlNote, palette.lateOn)}</Box>}
      {controlInfo !== '' && <Box key="act-info">{caption(controlInfo, palette.text2)}</Box>}

      <Box key="run-head" flexDirection="row" alignItems="center" gap={SPACE.row}>
        {icon(spinnerIcon(palette.live, 14), 'en cours', 14)}
        <Text size="heading" weight="semibold">
          En cours
        </Text>
        <Box flexShrink={1} minWidth={0}>
          {caption(`${running.length} · prioritaires en tête, puis par ordre de lancement`, palette.text3)}
        </Box>
      </Box>
      <Box key="run-list" flexDirection="column" gap={SPACE.tight}>
        {running.map((c, i) => card(c, i + 1, 'run'))}
        {running.length === 0 && (unreadable ? null : caption('Rien ne tourne.', palette.text3))}
      </Box>

      <Box key="palier" flexDirection="row" alignItems="center" gap={SPACE.row} paddingX="sm" backgroundColor={palette.blockTint}>
        <Text size="caption" weight="semibold" color={palette.blockOn}>
          {`File d'attente · ${queued.length}`}
        </Text>
        <Text size="caption" color={palette.blockOn}>
          {queued.length > 0 ? 'partent dans cet ordre' : 'vide'}
        </Text>
      </Box>
      <Box key="queue-zone" flexDirection="column" gap={SPACE.tight} paddingX="sm" paddingY="xs" backgroundColor={palette.note}>
        {queueBody}
        {queued.length === 0 && caption("Personne n'attend : chaque tâche lancée part tout de suite.", palette.text3)}
        {queued.some(c => c.state === 'paused') && caption('Une session cédée à une autre reprend seule quand une place se libère ; mise en pause à la main, elle attend « Reprendre ».', palette.blockOn)}
      </Box>
    </Box>
  )
}
