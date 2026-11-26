// Les réglages à la reprise d'une session (#663, finding F118 de #657) : une reprise (`resume`, un nouveau
// processus sur le même fil) recharge le fil, qui porte déjà le bloc des réglages donné à son démarrage ;
// le redonner en entier le faisait relire deux fois jusqu'au compactage. L'état de session ne survit pas à un
// nouveau processus (« Persist through $.store », types du moteur) : l'empreinte du bloc donné se garde au
// store, par session. Fonctions pures : `register.tsx` lit le store et injecte le texte.

/** La clé du store : par id de session, l'empreinte du dernier bloc donné au démarrage et quand. */
export const PREFS_START_KEY = 'prefs-start'
/** Les sessions gardées au plus, les plus récentes : une entrée pèse une soixantaine d'octets. */
export const PREFS_START_KEEP = 60

/** Ce que garde le store, par id de session. */
export type PrefsStartMemo = Record<string, { h: string; at: number }>

/** Ce que le démarrage donne : le bloc entier, ses lignes changées, une ligne courte, ou le bloc court d'après compaction (#665). */
export type StartPrefsKind = 'full' | 'change' | 'short' | 'compact'

/** L'empreinte d'un bloc : FNV-1a 32 bits en hexadécimal, et sa longueur. */
export function prefsHash(text: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return `${h.toString(16).padStart(8, '0')}-${text.length}`
}

/**
 * Que donner au démarrage ? Hors reprise (startup, clear, compact, fork) : le bloc entier, que le fil n'a plus
 * (compact, clear) ou n'a jamais eu sous cet id (startup, fork). À une reprise : `given`, le bloc que l'état de
 * session garde encore (même processus), sinon `stored`, l'empreinte gardée au store pour cette session ; le
 * même bloc, une ligne courte ; un autre bloc connu, ses lignes changées ; rien de connu, le bloc entier.
 */
export function startPrefsKind(o: { source: string | undefined; block: string; given: string; stored: string | undefined }): StartPrefsKind {
  // #665 : le résumé d'une compaction ne garde pas les réglages fidèlement ; le bloc court, une ligne par réglage.
  if (o.source === 'compact') return 'compact'
  if (o.source !== 'resume') return 'full'
  if (o.given !== '') return o.given === o.block ? 'short' : 'change'
  return o.stored !== undefined && o.stored === prefsHash(o.block) ? 'short' : 'full'
}

/** La ligne courte d'une reprise : le bloc entier est déjà dans le fil. */
export function resumePrefsLine(): string {
  return 'Réglages de session (plugin roadmap) : inchangés depuis le bloc « Réglages de session » donné plus haut dans cette conversation ; il vaut toujours.'
}

/** L'id d'une session lu sur l'événement, absent s'il n'est pas une chaîne. */
export function startSessionId(e: unknown): string | undefined {
  const id = (e as { session_id?: unknown } | null)?.session_id
  return typeof id === 'string' && id !== '' ? id : undefined
}

/** Le store lu : seules les entrées bien formées. */
export function readPrefsStartMemo(value: unknown): PrefsStartMemo {
  const out: PrefsStartMemo = {}
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return out
  for (const [id, v] of Object.entries(value as Record<string, unknown>)) {
    const entry = v as { h?: unknown; at?: unknown } | null
    if (entry && typeof entry.h === 'string' && typeof entry.at === 'number') out[id] = { h: entry.h, at: entry.at }
  }
  return out
}

/** Le store après un démarrage : l'entrée de la session à jour, les `keep` plus récentes gardées. */
export function prefsStartMemoAfter(memo: PrefsStartMemo, id: string, hash: string, at: number, keep = PREFS_START_KEEP): PrefsStartMemo {
  const entries = Object.entries({ ...memo, [id]: { h: hash, at } })
  entries.sort((a, b) => b[1].at - a[1].at)
  return Object.fromEntries(entries.slice(0, keep))
}
