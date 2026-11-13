// Le gardien de Maestro (#528, BBR le 2026-11-12) : une session permanente « Gardien · <projet> », lancée par Maestro,
// qui seule relit, fusionne, publie et clôt, pendant que Maestro garde la conversation, les lignes et les lancements.
// Les « prête à fusionner » des sessions et le réveil cloud (#496) vont à elle ; sans gardien ouvert, à Maestro.
// Fonctions pures : `register.tsx` lit la liste des sessions et envoie les messages. Le gardien se reconnaît à son
// titre et à la liste des sessions, sans clé de store : un gardien archivé rend seul la main à Maestro.

import { sessionTitleId, type ChildWake } from './parse'

/** Le premier mot du titre, « Gardien », que ne suit ni lettre, ni chiffre, ni souligné. */
const GARDIEN_TITLE = /^\s*gardien(?![\p{L}\p{N}_])/iu

/** Une session gardien, à son titre « Gardien … », comme Maestro au sien. */
export function isGardienSession(title: string): boolean {
  return GARDIEN_TITLE.test(title)
}

/** Le titre de la carte du gardien : « Gardien · <dossier du projet> » ; sans dossier, « Gardien ». */
export function gardienTitle(folder: string): string {
  const name = folder.replace(/\/+$/, '').split('/').pop()?.trim() ?? ''
  return name === '' ? 'Gardien' : `Gardien · ${name}`
}

/** La rangée du gardien ouvert d'un Maestro (la recherche que `gardienOf` et `gardienBandRow` partagent, #561). */
function gardienRow(rows: readonly unknown[], maestroId: string): { sessionId: string; title: string } | undefined {
  for (const raw of rows) {
    if (typeof raw !== 'object' || raw === null) continue
    const r = raw as { sessionId?: unknown; title?: unknown; startedBy?: unknown; isArchived?: unknown }
    if (typeof r.sessionId !== 'string' || typeof r.title !== 'string') continue
    if (r.startedBy === maestroId && r.isArchived === false && isGardienSession(r.title)) return { sessionId: r.sessionId, title: r.title }
  }
  return undefined
}

/**
 * Le gardien ouvert d'un Maestro, d'après les rangées de `list_sessions` : lancé par lui (`startedBy`), pas archivé,
 * titré Gardien. Une rangée sans `isArchived` ne compte pas : on ne sait pas si elle est ouverte.
 */
export function gardienOf(rows: readonly unknown[], maestroId: string): string | undefined {
  return gardienRow(rows, maestroId)?.sessionId
}

/**
 * La ligne du gardien dans la bande de Maestro (#561) : le même gardien que `gardienOf`, avec son titre, et son état
 * (`wait` quand il pose une question, sinon `live`). Rien sans gardien ouvert.
 */
export function gardienBandRow(rows: readonly unknown[], maestroId: string, o: { asking?: boolean } = {}): { sessionId: string; title: string; state: 'live' | 'wait' } | undefined {
  const row = gardienRow(rows, maestroId)
  return row === undefined ? undefined : { sessionId: row.sessionId, title: row.title.trim(), state: o.asking ? 'wait' : 'live' }
}

/** Les états d'une fin de tour qui vont au gardien : une livraison à faire. Le reste est la conversation de Maestro. */
export function goesToGardien(kind: ChildWake['kind']): boolean {
  return kind === 'ready' || kind === 'partial'
}

/** Le refus d'une carte Gardien : posée hors d'un Maestro, ou alors que ce Maestro a déjà son gardien ouvert. */
export function gardienCardRefusal(o: { title: string; maestro: boolean; open: boolean }): string | undefined {
  if (!isGardienSession(o.title)) return undefined
  const head = 'Carte refusée (#528, un gardien par Maestro) :'
  if (!o.maestro) return `${head} seul Maestro pose la carte de son gardien. Une session de tâche n'en a pas.`
  if (o.open) return `${head} ton gardien est déjà ouvert. Écris-lui par message ce qu'il doit savoir, sans en lancer un second.`
  return undefined
}

/**
 * Le rappel fait à Maestro quand il pose une carte de tâche (« #N · … ») dans un projet de code sans gardien ouvert :
 * poser aussi la carte du gardien. Une fois par session ; rien pour une carte qui n'est pas une tâche.
 */
export function gardienReminder(o: { maestro: boolean; code: boolean; cardTitle: string; open: boolean; told: boolean; script: string }): string | undefined {
  if (!o.maestro || !o.code || o.open || o.told || sessionTitleId(o.cardTitle) === undefined) return undefined
  return [
    "Plugin roadmap (#528) : tu lances une tâche de code et tu n'as pas de gardien ouvert.",
    `Pose aussi sa carte, dans ce tour : \`python3 "${o.script}" carte <dossier principal>\` rend son titre, son modèle, son effort, \`use_worktree\` et son brief ; pose-la telle quelle (\`start_session\`, \`own_initiative\`, \`fresh\`). Le clic sur Start reste à l'utilisateur.`,
    'Une fois ouvert, lui seul relit, fusionne, publie et clôt ; toi, tu gardes la conversation, les lignes et les lancements (skill roadmap:maestro, « Le gardien »). Sans gardien, tu fusionnes comme avant.',
  ].join('\n')
}

/** Après une fusion ou une publication faite par le gardien : sa ligne à Maestro, la seule nouvelle qu'il lui doit. */
export function gardienDeliveryNote(maestroId: string): string {
  return `Tu es le gardien (#528) : la ligne close, écris à Maestro (SendMessage, ${maestroId}) une seule ligne par tâche, « #N livrée X.Y.Z : ce qui change » (sans publication, « #N fusionnée : ce qui change »), avec ce qui lui revient s'il y a lieu (« rendu : ouvre sa preuve »). Rien d'autre ne lui est dit.`
}

/**
 * Les enfants de Maestro sans son gardien : il n'est ni « silencieux », ni « prêt », ni « à archiver » dans les
 * nouvelles des enfants (#84). Il est au repos entre deux livraisons par nature, et ne s'archive qu'à la demande.
 */
export function withoutGardien<T extends { title: string }>(children: readonly T[]): T[] {
  return children.filter(c => !isGardienSession(c.title))
}
