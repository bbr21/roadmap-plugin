// Le compactage au-delà du seuil (#657, BBR le 2026-11-25, plan #656 leviers 1 et 8) : à la fin de chaque tour, une
// session dont le contexte du dernier appel passe ~350 k (Maestro et le gardien : ~250 k) met /compact en file, au lieu
// de relire jusqu'au million tout ce qu'elle a déjà fait. Fonctions pures : `socle.tsx` lit l'usage et met la commande en file.

/** Le rôle d'une session pour son seuil : une tâche, ou Maestro et son gardien, réveillés sans fin par les sessions. */
export type CompactRole = 'tache' | 'maestro' | 'gardien'

/** Le seuil d'une session de tâche, en jetons. */
export const COMPACT_AT = 350_000
/** Le seuil de Maestro et du gardien, en jetons. */
export const COMPACT_AT_LEAD = 250_000
/** Ce que le contexte doit reprendre au-dessus de sa mesure d'après compactage avant un compactage de plus. */
export const COMPACT_REGROW = 100_000

/** Les seuils en jetons : celui d'une tâche, celui de Maestro et du gardien (options `compactAt` et `compactAtLead`, #664). */
export type CompactLimits = { task: number; lead: number }

/** Des milliers de jetons en texte (« 300 ») → jetons ; illisible, vide ou pas positif : le défaut. */
function limitOf(text: unknown, fallback: number): number {
  const n = typeof text === 'string' ? Number(text.trim()) : NaN
  return Number.isFinite(n) && n > 0 ? Math.round(n * 1000) : fallback
}

/** Les seuils d'après les options du plugin, en milliers de jetons (#664). */
export function compactLimits(o: { compactAt?: unknown; compactAtLead?: unknown }): CompactLimits {
  return { task: limitOf(o.compactAt, COMPACT_AT), lead: limitOf(o.compactAtLead, COMPACT_AT_LEAD) }
}

/** Le seuil du rôle ; sans seuils donnés, ceux de #657. */
export function compactThreshold(role: CompactRole, limits?: CompactLimits): number {
  return role === 'tache' ? (limits?.task ?? COMPACT_AT) : (limits?.lead ?? COMPACT_AT_LEAD)
}

/**
 * À compacter ? `tokens` : le contexte du dernier appel (absent : pas mesuré, rien). `floor` : -1 quand un compactage
 * est demandé et pas encore mesuré, 0 sans compactage demandé, sinon le contexte mesuré juste après le dernier : un
 * socle au-dessus du seuil (adBricks, 260 k) ne compacte pas à chaque tour. `enabled: false` (interrupteurs « Partout »
 * et « Cette session », #664) : jamais. `limits` : les seuils réglés.
 */
export function compactDue(o: { tokens: number | undefined; role: CompactRole; floor: number; limits?: CompactLimits; enabled?: boolean }): boolean {
  if (o.enabled === false) return false
  if (o.tokens === undefined || o.floor === -1) return false
  if (o.tokens < compactThreshold(o.role, o.limits)) return false
  return o.floor <= 0 || o.tokens >= o.floor + COMPACT_REGROW
}

/** Le plancher après une mesure : la première mesure qui suit une demande le devient. */
export function compactFloorAfter(floor: number, tokens: number | undefined): number {
  return floor === -1 && tokens !== undefined ? tokens : floor
}

/** Les consignes du résumé, passées à /compact : ce qui ne se relit nulle part ailleurs. */
export function compactArgs(role: CompactRole): string {
  const base =
    "Garde : la tâche (#id, ligne de roadmap, branche), l'étape en cours et les suivantes, les décisions prises et par qui, les fichiers touchés, ce qui attend une réponse. Le reste se relit : roadmap, spec, plan, liste d'étapes, commits."
  return role === 'tache' ? base : `${base} En plus : les sessions ouvertes et leur état, les PR en attente et l'ordre des fusions.`
}

/** Des jetons en milliers entiers : 362 400 → « 362 k ». */
function kilo(n: number): string {
  return `${Math.round(n / 1000)} k`
}

/** Le toast qui dit le compactage, hors du contexte. */
export function compactToast(tokens: number, threshold: number): string {
  return `Contexte à ${kilo(tokens)} (seuil ${kilo(threshold)}) : la session se compacte (#657).`
}
