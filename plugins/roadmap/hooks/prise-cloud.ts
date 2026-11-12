// La ligne prise seule au départ d'une session cloud (#474, suite de #458) : une carte cloud que pose Maestro attend le
// Start de la personne, et l'app ne dit ce départ à Maestro qu'à son réveil suivant (le 2026-11-11, #468 est restée hors
// de la bande jusqu'au message suivant de BBR). Le brief cloud fait pousser sa branche à la session dans sa première
// minute ; le panneau, qui a vu passer la carte, regarde cette branche sur origin une fois par minute au plus, tant
// qu'une carte attend, et prend la ligne dès qu'elle paraît. La prise de Maestro au message de l'app reste en filet :
// les deux sont la même (`takeCloudLine`), et la seconde ne change rien. Fonctions pures : `register.tsx` les appelle.

/** Une carte cloud surveillée : sa tâche, la branche que son brief nomme, le dépôt où la chercher, et quand. */
export type CloudWatch = {
  /** `<racine du projet>|<id>` : une carte par tâche. */
  key: string
  /** La racine du projet (`source.root ?? source.dir`) : seul un panneau de ce projet prend la ligne. */
  root: string
  id: string
  branch: string
  /** Le dossier git dont `origin` porte la branche (le dépôt de code, `depot` compris). */
  repo: string
  /** La tête de la branche sur origin quand la carte a été posée ('' : absente) : seule une poussée nouvelle compte. */
  base: string
  at: number
  checkedAt: number
}

/** La clé du store où vivent les cartes surveillées, partagée par tous les panneaux ouverts. */
export const CLOUD_WATCH_KEY = 'cloud-watch'

/** Le rythme du regard sur origin : une fois par minute au plus, toutes sessions confondues. */
export const CLOUD_WATCH_EVERY_MS = 60_000

/** Une carte jamais démarrée (ou démarrée sur le Mac) cesse d'être surveillée au bout de 12 h. */
export const CLOUD_WATCH_TTL_MS = 12 * 3_600_000

/** Au plus tant de cartes gardées : les plus récentes. */
const CLOUD_WATCH_MAX = 20

/** La branche que nomme un brief cloud (« Travaille sur la branche `feat/x` »), sinon `undefined`. */
export function briefBranchOf(prompt: unknown): string | undefined {
  if (typeof prompt !== 'string') return undefined
  return /Travaille sur la branche `([^`\s]+)`/.exec(prompt)?.[1]
}

/** La liste gardée au store, les entrées mal formées écartées. */
export function watchList(stored: unknown): CloudWatch[] {
  if (!Array.isArray(stored)) return []
  return stored.filter((w): w is CloudWatch => {
    const o = w as Record<string, unknown> | null
    return (
      !!o &&
      ['key', 'root', 'id', 'branch', 'repo', 'base'].every(k => typeof o[k] === 'string') &&
      typeof o.at === 'number' &&
      typeof o.checkedAt === 'number'
    )
  })
}

/** Une carte de plus : elle remplace celle de la même tâche ; les plus anciennes tombent au-delà du plafond. */
export function addWatch(list: readonly CloudWatch[], entry: CloudWatch): CloudWatch[] {
  return [...list.filter(w => w.key !== entry.key), entry].slice(-CLOUD_WATCH_MAX)
}

/** Les cartes encore vivantes (`kept`), et parmi elles celles qu'il est temps de regarder (`due`). */
export function dueWatches(list: readonly CloudWatch[], now: number): { due: CloudWatch[]; kept: CloudWatch[] } {
  const kept = list.filter(w => now - w.at < CLOUD_WATCH_TTL_MS)
  return { kept, due: kept.filter(w => now - w.checkedAt >= CLOUD_WATCH_EVERY_MS) }
}

/** Les têtes de branche d'une sortie de `git ls-remote --heads` : branche → sha. */
export function remoteHeads(stdout: string): Record<string, string> {
  const heads: Record<string, string> = {}
  for (const line of stdout.split('\n')) {
    const m = /^([0-9a-f]{7,64})\s+refs\/heads\/(\S+)\s*$/.exec(line.trim())
    if (m) heads[m[2]!] = m[1]!
  }
  return heads
}

/** La branche a paru sur origin depuis la carte : présente, et à une autre tête que celle d'alors. */
export function pushedSince(w: CloudWatch, heads: Record<string, string>): boolean {
  const sha = heads[w.branch]
  return sha !== undefined && sha !== w.base
}

/**
 * Ce que la roadmap dit de la ligne #id pour la branche : `take` si elle est ouverte et libre, `taken` si elle est déjà
 * prise en cloud par cette branche (Maestro, ou un autre panneau, est passé avant), `gone` sinon (close, absente, tenue
 * par une autre branche, prise sur le Mac) : la surveillance s'arrête.
 */
export function lineVerdict(text: string, id: string, branch: string): 'take' | 'taken' | 'gone' {
  for (const raw of text.split('\n')) {
    const cut = raw.lastIndexOf('`[')
    if (cut < 0 || !/^- \[[ xX]\] /.test(raw)) continue
    const fields = raw.slice(cut + 2, raw.endsWith(']`') ? -2 : undefined).split('|').map(f => f.trim())
    if (!fields.includes(`id:${id}`)) continue
    if (!raw.startsWith('- [ ] ')) return 'gone'
    const held = fields.find(f => f.startsWith('branche:'))
    if (!held) return 'take'
    return held.slice(8).trim() === branch && fields.includes('lieu:cloud') ? 'taken' : 'gone'
  }
  return 'gone'
}

// --- La prise au départ d'une mission (#510, C4) --------------------------------------------------------------------
// Une mission (projet sans code, #476) n'a pas de branche à guetter : sa ligne se prend au message de départ que l'app
// envoie à la session qui a posé la carte, comme le fait Maestro (`prendre_cloud.py --mission`). La carte posée se
// garde ici, au store, partagée par les panneaux ; une carte jamais démarrée tombe au bout de 12 h, la ligne libre.

/** Une carte de mission posée, pas encore démarrée. */
export type MissionStart = { key: string; root: string; id: string; at: number }

/** La clé du store des cartes de mission posées. */
export const MISSION_START_KEY = 'mission-starts'

/**
 * Les titres que cite le message de départ de l'app : « The user started your suggested background task "<titre>" in
 * a separate cloud session » (un par carte démarrée).
 */
export function startedCardTitles(text: unknown): string[] {
  if (typeof text !== 'string') return []
  return [...text.matchAll(/started your suggested background task "([^"\n]+)"/g)].map(m => m[1]!)
}

/** La liste gardée au store, les entrées mal formées écartées. */
export function missionStartList(stored: unknown): MissionStart[] {
  if (!Array.isArray(stored)) return []
  return stored.filter((w): w is MissionStart => {
    const o = w as Record<string, unknown> | null
    return !!o && ['key', 'root', 'id'].every(k => typeof o[k] === 'string') && typeof o.at === 'number'
  })
}

/** Une carte de plus : elle remplace celle de la même tâche ; les autres posées il y a plus de 12 h tombent. */
export function addMissionStart(list: readonly MissionStart[], entry: MissionStart, now: number): MissionStart[] {
  return [...list.filter(w => w.key !== entry.key && now - w.at <= CLOUD_WATCH_TTL_MS), entry].slice(-CLOUD_WATCH_MAX)
}
