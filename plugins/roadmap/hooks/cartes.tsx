// Les cartes des tâches écrites (#371, maquette A de docs/plans/feat-cartes-taches-ecrites/maquettes.html) :
// les lignes « - Roadmap : #N … » que le plugin donne après une écriture de la roadmap (#244) et que Claude
// recopie dans son message se dessinent en une carte par tâche. Ce fichier lit les lignes et les dessine ;
// il ne les écrit pas (`renderReport`, `reportOf`, `changeText` restent à parse.ts), et le texte que lit le modèle ne change pas.

import type { EngineInterface, RenderElement } from 'claude-code'

import { checkIcon, cloudIcon, laptopIcon, mixOver } from './icons'
import { daysBetween, dueLabel, isPriority, isThirdParty, queueRank, roadmapAxes, shortAttend, testTitle, type Bilan, type Sessions, type Task } from './parse'
import { SIZE, SPACE, type Palette } from './tokens'

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

/** La couleur d'une échéance ou de « qui » : la même famille que les pastilles du panneau. */
export type WrittenDue = { text: string; tone: 'late' | 'soon' | 'none' }
/** `session` : une session tient la tâche, le bouton de la carte ouvre cette session (« en session », « t'attend », « en test »). */
export type WrittenWho = { text: string; tone: 'live' | 'wait' | 'soon'; session?: true }

/** L'encre d'un morceau du pied : les couleurs du panneau, sans fond. */
export type FootInk = 'text' | 'text2' | 'late' | 'soon' | 'wait' | 'live'
/** Un morceau de texte du pied, dans son encre ; `strong` : poids doux (le nom de l'axe). */
export type FootRun = { text: string; ink: FootInk; strong?: true }

/**
 * Une carte prête à dessiner (maquette R2, version 4) : le titre, la description (`change`) et le pied, une liste de
 * morceaux (« Axe sessions », « livrée 0.232.2 », « en 2 j »…) que le dessin sépare par « · ». `session` : le bouton ouvre la session.
 */
export type WrittenCard = {
  id: string
  kind: WrittenKind
  title: string
  change: string
  foot: FootRun[][]
  session?: true
  /** #388 : une nouvelle tâche ouverte que personne ne tient : le pied porte « Start » à côté de « Ouvrir la task ». */
  start?: true
  /** #436 : où tourne la tâche (`lieu:cloud`, sinon le Mac) ; absent pour une tâche introuvable. */
  lieu?: Sessions
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

/** L'échéance relative d'un morceau du pied : « 2 j de retard » rouge, « aujourd'hui », « demain » et « après-demain » orange, sinon neutre. */
function dueOf(due: string, today: string): WrittenDue {
  const label = dueLabel(due, today)
  if (!label.late && daysBetween(today, due) === 2) return { text: 'après-demain', tone: 'soon' }
  return { text: label.text, tone: label.late ? 'late' : label.text === "aujourd'hui" || label.text === 'demain' ? 'soon' : 'none' }
}

/** Le numéro de la première prérequise (`après:`) encore ouverte. */
function openPrereq(task: Task, tasks: readonly Task[]): string | undefined {
  for (const raw of (task.apres ?? '').split(',')) {
    const n = /^\s*#?(\d+)\s*$/.exec(raw)?.[1]
    if (n && tasks.some(t => t.id === n && !t.done)) return n
  }
  return undefined
}

const DUE_INK: Record<WrittenDue['tone'], FootInk> = { late: 'late', soon: 'soon', none: 'text2' }
const WHO_INK: Record<WrittenWho['tone'], FootInk> = { live: 'live', wait: 'wait', soon: 'soon' }

/** Le « fait » d'un bilan : la version entre parenthèses à la fin (`0.232.2`) lue puis retirée, et une phrase terminée par un point. */
export function doneFait(fait: string): { text: string; version?: string } {
  const m = /\s*\(([^()]*\b\d+\.\d+\.\d+\b[^()]*)\)\s*$/.exec(fait)
  if (!m) return { text: fait }
  const head = fait.slice(0, m.index).trimEnd()
  return { text: /[.!?…]$/.test(head) ? head : `${head}.`, version: /\d+\.\d+\.\d+/.exec(m[1]!)![0] }
}

/** Les jours de `ouvert:` à `fait:` d'une tâche faite, dits : « en 2 j », « le jour même ». */
function tookDays(task: Task): string | undefined {
  if (!task.ouvert || !task.fait) return undefined
  const n = daysBetween(task.ouvert.slice(0, 10), task.fait.slice(0, 10))
  return Number.isNaN(n) || n < 0 ? undefined : n === 0 ? 'le jour même' : `en ${n} j`
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
  /** Les bilans de la roadmap (`ROADMAP-bilans.csv`, déjà en mémoire du panneau) : la description et la version d'une faite. */
  bilans?: ReadonlyMap<string, Bilan>
  /** #479 : le lieu où part le Start d'une Nouvelle (la cible de l'interrupteur, sinon la reco) ; absent : celui de sa ligne. */
  reco?: (t: Task) => Sessions | undefined
}

/**
 * Chaque ligne enrichie de sa tâche (trouvée par `id:`) : nom court, description et pied (maquette R2). Le pied, une liste
 * de morceaux : « Axe <nom> » d'abord, puis selon la sorte : nouvelle → échéance, « prioritaire », « attend #N » ou « n'attend
 * rien » ; mise à jour → échéance, qui, « attend #N » ; faite → « livrée <version> », « en N j » ; annulée → l'axe seul.
 * Une tâche introuvable se dessine quand même, avec le libellé de la ligne et sans axe.
 */
export function writtenCards(lines: readonly WrittenLine[], tasks: readonly Task[], o: WrittenCardsOptions): WrittenCard[] {
  return lines.map(line => {
    const task = line.id === '?' ? undefined : tasks.find(t => t.id === line.id)
    const title = task ? o.short(task) : line.label || `#${line.id}`
    const open = line.kind === 'new' || line.kind === 'upd'
    const live = task !== undefined && open && !task.done
    const dueIso = task ? (live ? task.due : undefined) : line.due ? isoOfDdmm(line.due, o.today) : undefined
    const due = dueIso ? dueOf(dueIso, o.today) : undefined
    const who = live ? (o.who?.(task) ?? (isThirdParty(task.attend, o.me ?? []) ? { text: `attend ${shortAttend(task.attend as string)}`, tone: 'wait' as const } : undefined)) : undefined
    const known = task ? o.before?.get(line.id) : undefined
    const bilan = line.kind === 'done' && task ? o.bilans?.get(line.id) : undefined
    const fait = bilan && bilan.fait.trim() !== '' ? doneFait(bilan.fait.trim()) : undefined
    const change =
      line.kind === 'new'
        ? [line.label !== '' && line.label !== title ? line.label : '', dueIso ? '' : 'sans échéance'].filter(x => x !== '').join(' · ')
        : line.kind === 'upd' && task && known
          ? beforeAfter(line.change, known, task)
          : (fait?.text ?? line.change)
    const foot: FootRun[][] = []
    if (task && task.axis !== '') foot.push([{ text: 'Axe ', ink: 'text2' }, { text: task.axis, ink: 'text', strong: true }])
    if (open && due) foot.push([{ text: due.text, ink: DUE_INK[due.tone] }])
    if (line.kind === 'new' && live && isPriority(task)) foot.push([{ text: 'prioritaire', ink: 'late' }])
    if (live && line.kind === 'upd' && who) foot.push([{ text: who.text, ink: WHO_INK[who.tone] }])
    if (live) {
      const n = openPrereq(task, tasks)
      if (n) foot.push([{ text: 'attend ', ink: 'text2' }, { text: `#${n}`, ink: 'text' }])
      else if (line.kind === 'new' && task.sansApres) foot.push([{ text: "n'attend rien", ink: 'text2' }])
    }
    if (line.kind === 'done' && task) {
      foot.push(fait?.version ? [{ text: 'livrée ', ink: 'text2' }, { text: fait.version, ink: 'text' }] : [{ text: 'livrée', ink: 'text2' }])
      const took = tookDays(task)
      if (took) foot.push([{ text: took, ink: 'text2' }])
    }
    const startable = line.kind === 'new' && live && !who?.session
    return {
      id: line.id,
      kind: line.kind,
      title,
      change,
      foot,
      ...(who?.session ? { session: true as const } : {}),
      ...(startable ? { start: true as const } : {}),
      // #479 : une Nouvelle que personne ne tient dit le lieu recommandé, celui où part son Start.
      ...(task ? { lieu: task.lieu === 'cloud' ? ('cloud' as const) : startable ? (o.reco?.(task) ?? ('mac' as const)) : ('mac' as const) } : {}),
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

/** La clé du store qui garde les cartes fermées par la croix : `<empreinte du texte du message>:<id>`, les plus récentes en dernier. */
export const CLOSED_KEY = 'written-closed'
const CLOSED_MAX = 200

/** Les clés de cartes fermées lues du store, sans ce qui n'est pas du texte. */
export function closedKeys(stored: unknown): Set<string> {
  return new Set(Array.isArray(stored) ? stored.filter((x): x is string => typeof x === 'string') : [])
}

/** La liste des fermées avec une de plus : sans doublon, la plus récente en dernier, 200 au plus. */
export function keepClosed(stored: unknown, key: string): string[] {
  return [...closedKeys(stored)].filter(k => k !== key).concat(key).slice(-CLOSED_MAX)
}

/** Les parts du message sans les cartes fermées (`closed` : clés `<fingerprint>:<id>`) ; une pile vidée disparaît. */
export function withoutClosed(parts: readonly MessagePart[], fingerprint: string, closed: ReadonlySet<string>): MessagePart[] {
  if (closed.size === 0) return [...parts]
  return parts.flatMap((part): MessagePart[] => {
    if (part.kind === 'text') return [part]
    const lines = part.lines.filter(l => !closed.has(`${fingerprint}:${l.id}`))
    return lines.length > 0 ? [{ kind: 'cards', lines }] : []
  })
}

/**
 * #436 : la clé du store qui garde les tâches dont la carte native « New session » est posée : `<projet>|<id>`, les plus
 * récentes en dernier. Leur carte Nouvelle ne se dessine plus : la native la remplace, même quand le message se redessine.
 */
export const NATIVE_KEY = 'native-cards'

/** Les clés de cartes natives posées lues du store, sans ce qui n'est pas du texte. */
export function nativeKeys(stored: unknown): Set<string> {
  return closedKeys(stored)
}

/** La liste des cartes natives posées avec une de plus : sans doublon, la plus récente en dernier, 200 au plus. */
export function keepNative(stored: unknown, key: string): string[] {
  return keepClosed(stored, key)
}

/** Les parts du message sans les cartes Nouvelle dont la carte native est posée (`ids` : les `#N` de ce projet) ; une pile vidée disparaît. */
export function withoutNative(parts: readonly MessagePart[], ids: ReadonlySet<string>): MessagePart[] {
  if (ids.size === 0) return [...parts]
  return parts.flatMap((part): MessagePart[] => {
    if (part.kind === 'text') return [part]
    const lines = part.lines.filter(l => l.kind !== 'new' || !ids.has(l.id))
    return lines.length > 0 ? [{ kind: 'cards', lines }] : []
  })
}

/** Les sessions « Tester #N · X.Y.Z » ouvertes (archivées exclues), par `#N` : leur version, leur session et leur titre. */
export function testSessions(rows: readonly unknown[]): Map<string, { version: string; sessionId: string; title: string }> {
  const out = new Map<string, { version: string; sessionId: string; title: string }>()
  for (const raw of rows) {
    if (typeof raw !== 'object' || raw === null) continue
    const r = raw as { title?: unknown; isArchived?: unknown; sessionId?: unknown }
    if (r.isArchived === true || typeof r.title !== 'string' || typeof r.sessionId !== 'string') continue
    const t = testTitle(r.title)
    if (t) out.set(t.id, { version: t.version, sessionId: r.sessionId, title: r.title })
  }
  return out
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

/** L'encre d'un morceau du pied. */
const footInk = (p: Palette, ink: FootInk): string => ({ text: p.text, text2: p.text2, late: p.lateOn, soon: p.blockOn, wait: p.waitOn, live: p.liveOn })[ink]

/** Ce que le hook donne au dessin en plus des cartes : l'ouverture de la fiche d'une tâche (le bouton « Ouvrir la task ») et la croix qui ferme la carte. */
export type WrittenDrawOptions = {
  open?: (id: string) => void
  openSession?: (id: string) => void
  close?: (id: string) => void
  /** #388 : le clic sur « Start » d'une carte Nouvelle. */
  start?: (id: string) => void
  /** #388 : ce que le clic a fait de la carte (en file chez Maestro, ou carte « New session » proposée) ; sans état, « Start » reste cliquable. */
  started?: (id: string) => WrittenStart | undefined
}

/** #388 : l'état d'une carte après « Start » : en file chez un Maestro (rang, 1 pour la prochaine), ou la carte « New session » posée. */
export type WrittenStart = { state: 'queued'; rank: number; maestro: string } | { state: 'proposed' }

/** L'encre du point et du mot de la sorte (version 5) : nouvelle verte, mise à jour bleue, faite violette, annulée grise. */
const kindInk = (p: Palette, kind: WrittenKind): string => ({ new: p.ok, upd: p.liveOn, done: p.finishedOn, cancel: p.text3 })[kind]

/** Le point de 8 px de la sorte : un disque plein de son encre. */
const dotSource = (hex: string): string => `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="${hex}"/></svg>`

/**
 * Le message redessiné : le texte en Markdown, les lignes du compte rendu en une carte par tâche, à leur place
 * (maquette n1b, la forme de la carte « New session » de l'app) : le bandeau qui dit la sorte, le titre « #N · Nom », la
 * description, puis le pied en un seul `Text` coupé d'une ellipse (maquette R2 : « Axe sessions · livrée 0.232.2 · en 2 j » ;
 * à droite « Ouvrir la task », ou « Ouvrir la session » quand `session`). `cards` enrichit les lignes d'une pile ;
 * `el` est ce que rend `$.ui.resolve(e)` ; `o.open(id)` ouvre la fiche, `o.openSession(id)` la session qui tient la tâche (au clic).
 */
export function drawWrittenMessage(el: ReturnType<EngineInterface['ui']['resolve']>, parts: readonly MessagePart[], cards: (lines: WrittenLine[]) => WrittenCard[], palette: Palette, o: WrittenDrawOptions = {}): RenderElement {
  const { Box, Text, Markdown, Button, Svg } = el
  const seen = new Map<string, number>()
  const card = (c: WrittenCard) => {
    const n = seen.get(c.id) ?? 0
    seen.set(c.id, n + 1)
    const suffix = n === 0 ? '' : `:${n}`
    const cancelled = c.kind === 'cancel'
    // #436 (maquette A) : la faite ressort au violet de fin : fond, filet, bandeau mêlé, coche, titre en heading, croix encadrée.
    const done = c.kind === 'done'
    const ink = kindInk(palette, c.kind)
    const bandBg = done ? mixOver(palette.finished, palette.finishedTint, 0.22) : palette.hover
    // #436 : l'icône et le mot du lieu à droite du bandeau ; sur une Nouvelle aussi, le lieu où part son Start (#479).
    const place = c.lieu !== undefined && (() => {
      const cloud = c.lieu === 'cloud'
      const word = cloud ? 'cloud' : 'Mac'
      const alt = cloud ? 'Dans le cloud' : 'Sur le Mac'
      const iconInk = done ? palette.finishedOn : cloud ? palette.live : palette.text2
      return (
        <Box key={`written-place:${c.id}${suffix}`} flexDirection="row" alignItems="center" gap={SPACE.tight} flexShrink={0}>
          {Svg ? <Svg key="written-place-icon" source={cloud ? cloudIcon(iconInk, SIZE.icon.sm, alt) : laptopIcon(iconInk, SIZE.icon.sm, alt)} alt={alt} width={SIZE.icon.sm} height={SIZE.icon.sm} /> : null}
          <Text size="caption" color={done ? palette.finishedOn : palette.text2}>{word}</Text>
        </Box>
      )
    })()
    // Le pied : un seul Text coupé d'une ellipse, un Text imbriqué par morceau, « · » en text3 entre eux.
    const foot = c.foot.flatMap((part, i) => {
      const runs = part.map((r, j) => (
        <Text key={`r${i}-${j}`} color={footInk(palette, r.ink)} {...(r.strong ? { weight: 'medium' as const } : {})}>{r.text}</Text>
      ))
      return i === 0 ? runs : [<Text key={`dot${i}`} color={palette.text3}>{' · '}</Text>, ...runs]
    })
    const started = c.start ? o.started?.(c.id) : undefined
    const note = started && (
      <Box key={`written-note:${c.id}${suffix}`} paddingLeft="lg" paddingBottom="md">
        {started.state === 'queued' ? (
          <Text size="body" color={palette.text2}>
            <Text color={palette.waitOn}>{`En file chez ${started.maestro}`}</Text>
            <Text color={palette.text2}>{` · ${queueRank(started.rank)}, part seule à son tour`}</Text>
          </Text>
        ) : (
          <Text size="body" color={palette.text2}>La carte « New session » est posée plus bas : Start pour lancer</Text>
        )}
      </Box>
    )
    return (
      <Box key={`written:${c.id}${suffix}`} flexDirection="column" width="60%" borderStyle="round" borderColor={done ? palette.finished : palette.border} paddingX={0} paddingY={0} {...(done ? { backgroundColor: palette.finishedTint } : {})}>
        {/* Le filet du bandeau est de la couleur de son fond : ses coins s'arrondissent dans ceux de la carte. */}
        <Box key={`written-band:${c.id}${suffix}`} backgroundColor={bandBg} borderStyle="round" borderColor={bandBg} paddingX="lg" paddingY="sm">
          <Box key={`written-band-row:${c.id}${suffix}`} flexDirection="row" alignItems="center" justifyContent="space-between" gap={SPACE.tight}>
            <Box key="written-kind" flexDirection="row" alignItems="center" gap={SPACE.tight}>
              {done
                ? (Svg ? <Svg key="written-dot" source={checkIcon(ink, SIZE.icon.sm)} alt={KIND_WORD[c.kind]} width={SIZE.icon.sm} height={SIZE.icon.sm} /> : <Text key="written-dot" size="footnote" color={ink}>✓</Text>)
                : (Svg ? <Svg key="written-dot" source={dotSource(ink)} alt={KIND_WORD[c.kind]} width={8} height={8} /> : <Text key="written-dot" size="footnote" color={ink}>●</Text>)}
              <Text size="footnote" weight="bold" color={ink}>{KIND_WORD[c.kind]}</Text>
            </Box>
            {place || null}
          </Box>
        </Box>
        <Box key="written-body" flexDirection="column" gap={SPACE.tight} paddingX="lg" paddingTop="md" paddingBottom="xs">
          <Box key="written-title" flexDirection="row" alignItems="center" justifyContent="space-between" gap={SPACE.tight}>
            <Box key="written-title-text" flexGrow={1} flexShrink={1} minWidth={0}>
              <Text {...(done ? { size: 'heading' as const, weight: 'semibold' as const, color: palette.finishedOn } : { size: 'body' as const, weight: 'medium' as const })} wrap="truncate-end" {...(cancelled ? { strikethrough: true, color: palette.text3 } : done ? {} : { color: palette.text })}>{`#${c.id} · ${c.title}`}</Text>
            </Box>
            {done ? (
              <Box key={`written-close-frame:${c.id}${suffix}`} borderStyle="round" borderColor={palette.finished} paddingX={0} paddingY={0} flexShrink={0}>
                <Button key={`written-close:${c.id}${suffix}`} plain onPress={() => o.close?.(c.id)}>
                  <Text color={palette.finishedOn}>×</Text>
                </Button>
              </Box>
            ) : (
              <Button key={`written-close:${c.id}${suffix}`} plain onPress={() => o.close?.(c.id)}>
                <Text color={palette.text3}>×</Text>
              </Button>
            )}
          </Box>
          {c.change !== '' && <Text size="body" color={palette.text2} wrap="wrap">{clampDescription(c.change)}</Text>}
        </Box>
        <Box key="written-foot" flexDirection="row" alignItems="center" justifyContent="space-between" gap={SPACE.block} paddingLeft="lg" paddingRight="md" paddingTop="xs" paddingBottom={note ? 'xs' : 'md'}>
          <Box key="written-foot-left" flexDirection="row" alignItems="center" flexGrow={1} flexShrink={1} minWidth={0}>
            {foot.length > 0 && (
              <Text key={`written-meta:${c.id}${suffix}`} size="body" color={palette.text2} wrap="truncate-end">
                {foot as never}
              </Text>
            )}
          </Box>
          <Box key="written-foot-actions" flexDirection="row" alignItems="center" gap={SPACE.tight} flexShrink={0}>
            <Button
              key={n === 0 ? `written-open:${c.id}` : `written-open:${c.id}${suffix}`}
              {...(c.start ? { plain: true } : { variant: 'primary' as const })}
              label={c.session ? 'Ouvrir la session' : 'Ouvrir la task'}
              onPress={() => (c.session ? o.openSession?.(c.id) : o.open?.(c.id))}
            />
            {c.start && (
              <Button
                key={n === 0 ? `written-start:${c.id}` : `written-start:${c.id}${suffix}`}
                {...(started ? {} : { variant: 'primary' as const })}
                label={started ? (started.state === 'queued' ? `En file · ${queueRank(started.rank)}` : 'Proposée') : 'Start'}
                onPress={() => (started ? undefined : o.start?.(c.id))}
              />
            )}
          </Box>
        </Box>
        {note}
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
