// Les couleurs et les dessins du panneau, en SVG pour l'app de bureau (le terminal garde des glyphes).
// Un bouton impose sa couleur de texte : tout ce qui porte une couleur se dessine hors des boutons.
// Valeurs du handoff de design (README « Tokens » et « Icônes ») ; un SVG dessiné en image ne
// connaît pas `currentColor`, d'où la couleur passée à chaque dessin.

export type ThemeName = 'dark' | 'light'

export type Palette = {
  /** Fond du panneau. */
  bg: string
  /** Survol des lignes. */
  hover: string
  /** Pastilles grises. */
  sel: string
  /** Filets. */
  border: string
  text: string
  /** Texte secondaire. */
  text2: string
  /** Texte tertiaire, chevrons. */
  text3: string
  late: string
  lateTint: string
  lateOn: string
  /** À moi, point « En cours ». */
  mine: string
  /** Attend un tiers. */
  wait: string
  waitTint: string
  waitOn: string
  /** Coche, session lancée. */
  ok: string
  /** Segment et carré « Faites ». */
  done: string
  /** Bouton Lancer. */
  pri: string
  priText: string
  /** Boutons icône. */
  btn: string
  btnHover: string
  /** Fond de la note du détail. */
  note: string
  /** Tâche en cours dans une session. */
  live: string
  liveTint: string
  liveOn: string
  /** Tâche bloquée par sa prérequise. */
  block: string
  blockTint: string
  blockOn: string
  /** Couleurs d'axe, dans l'ordre de déclaration des axes, modulo 8. */
  axes: readonly string[]
  /** Part de la couleur d'axe dans le fond de la pastille d'axe (`color-mix` du design). */
  axisTintRatio: number
}

export const PALETTES: Record<ThemeName, Palette> = {
  dark: {
    // Le fond réel du panneau dans l'app (relevé sur capture, 2026-10-22) ; le design disait #1F1E1D.
    // Les masques des coins arrondis prennent cette couleur : elle doit être exacte, sinon ils se voient.
    bg: '#191919',
    hover: '#2A2927',
    sel: '#353330',
    border: '#3A3835',
    text: '#ECEBE7',
    text2: '#A6A39C',
    text3: '#6F6C66',
    late: '#E5534B',
    lateTint: '#47231F',
    lateOn: '#FF928A',
    mine: '#6E9CF0',
    wait: '#A781F0',
    waitTint: '#2F2742',
    waitOn: '#C7AEFA',
    ok: '#5BAE6A',
    done: '#7D8590',
    pri: '#ECEBE7',
    priText: '#1F1E1D',
    btn: '#2D2C29',
    btnHover: '#383633',
    note: '#27292C',
    live: '#6E9CF0',
    liveTint: '#1F2C45',
    liveOn: '#9DBCF5',
    block: '#F0A24B',
    blockTint: '#45301A',
    blockOn: '#F4B36A',
    axes: ['#6E9CF0', '#D97757', '#5BAE6A', '#E2B04A', '#A781F0', '#3DB6B0', '#E07AA8', '#8C9BB0'],
    axisTintRatio: 0.24,
  },
  light: {
    bg: '#FFFFFF',
    hover: '#F5F3EE',
    sel: '#ECE9E1',
    border: '#E3DFD5',
    text: '#1F1E1D',
    text2: '#6B6862',
    text3: '#A9A59D',
    late: '#C4372F',
    lateTint: '#FCE7E5',
    lateOn: '#B0261E',
    mine: '#2F6BD8',
    wait: '#7C4FD6',
    waitTint: '#EFE9FC',
    waitOn: '#5F35BF',
    ok: '#2E8540',
    done: '#848B95',
    pri: '#1F1E1D',
    priText: '#FFFFFF',
    btn: '#F1EFE9',
    btnHover: '#E7E4DB',
    note: '#F2F2F1',
    live: '#2F6BD8',
    liveTint: '#E6EEFC',
    liveOn: '#1F55B8',
    block: '#C46A12',
    blockTint: '#FDEBD8',
    blockOn: '#A34A00',
    axes: ['#3F74D9', '#C8603F', '#3C9150', '#C9961F', '#8A5FE0', '#20958E', '#CC5590', '#6E7C91'],
    axisTintRatio: 0.16,
  },
}

/** Les couleurs d'axe en couleurs du thème, pour le terminal, dans le même ordre. */
export const AXIS_THEME = ['suggestion', 'claude', 'success', 'warning', 'permission', 'ide', 'merged', 'planMode']

/**
 * Le thème du panneau : le réglage du plugin s'il en impose un (`sombre`, `clair`), sinon le thème
 * de Claude Code (`dark`, `light`, `dark-daltonized`, `light-ansi`…). Un thème qui ne dit ni clair
 * ni sombre (« auto », absent, illisible) donne le sombre.
 */
export function resolveTheme(choice: string, configured: unknown): ThemeName {
  if (choice === 'sombre') return 'dark'
  if (choice === 'clair') return 'light'
  if (typeof configured === 'string' && configured.toLowerCase().includes('light')) return 'light'
  return 'dark'
}

/** La couleur d'un axe, par son rang dans l'ordre de déclaration. */
export function axisColor(palette: Palette, index: number): string {
  return palette.axes[(index < 0 ? 0 : index) % palette.axes.length] ?? palette.done
}

function channels(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [0, 2, 4].map(i => Number.parseInt(h.slice(i, i + 2), 16)) as [number, number, number]
}

/** `color-mix(in srgb, <hex> <ratio>, transparent)` posé sur `under` : la couleur obtenue, en hex. */
export function mixOver(hex: string, under: string, ratio: number): string {
  const top = channels(hex)
  const bottom = channels(under)
  return `#${top
    .map((c, i) => Math.round(c * ratio + (bottom[i] ?? 0) * (1 - ratio)))
    .map(c => c.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`
}

/** Le fond de la pastille d'axe du détail. */
export function axisTint(palette: Palette, hex: string): string {
  return mixOver(hex, palette.bg, palette.axisTintRatio)
}

// --- Dessins ---------------------------------------------------------------------------------

/**
 * Même entrée, même dessin : un dessin se calcule une fois par jeu d'arguments, puis vient de la
 * mémoire (un panneau redessiné à chaque clic en demande des centaines, presque toujours les mêmes).
 */
export function memo<A extends unknown[], R>(fn: (...args: A) => R, max = 4000): (...args: A) => R {
  const cache = new Map<string, R>()
  return (...args: A): R => {
    const key = JSON.stringify(args)
    const hit = cache.get(key)
    if (hit !== undefined) return hit
    const out = fn(...args)
    if (cache.size >= max) cache.clear()
    cache.set(key, out)
    return out
  }
}

/**
 * Une icône posée au milieu d'une case de `height` px de haut : elle fixe seule la hauteur de sa
 * ligne, sans cale à côté (un Svg de moins par ligne de légende et par en-tête de section).
 */
export const rowMark = memo(function rowMark(source: string, size: number = 16, height: number = 24): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${height}" viewBox="0 0 ${size} ${height}">${source.replace('<svg ', `<svg y="${(height - size) / 2}" `)}</svg>`
})

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function svg(size: number, viewBox: number, body: string, title?: string): string {
  const label = title === undefined ? '' : `<title>${escapeXml(title)}</title>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${viewBox} ${viewBox}">${label}${body}</svg>`
}

/** Une icône de trait en viewBox 24, aux bouts ronds. */
function line(hex: string, size: number, width: number, body: string, title?: string): string {
  return svg(
    size,
    24,
    `<g fill="none" stroke="${hex}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${body}</g>`,
    title,
  )
}

/** Épaisseurs du design : 1,8 pour les icônes de 16, 2,4 dans les pastilles, 2,2 en 12-14 px, 2 pour les coches. */
export const STROKE = { base: 1.8, pill: 2.4, small: 2.2, check: 2 } as const

export function clockIcon(hex: string, size = 12, width: number = STROKE.pill): string {
  return line(hex, size, width, '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3 2"/>')
}

export function personIcon(hex: string, size = 12, width: number = STROKE.pill): string {
  return line(hex, size, width, '<circle cx="12" cy="8" r="3.75"/><path d="M4.75 20c1.2-3.6 4-5.5 7.25-5.5s6.05 1.9 7.25 5.5"/>')
}

/** Lecture, plein. */
export function playIcon(hex: string, size = 14): string {
  return svg(size, 24, `<path d="M7 4.5v15l12.5-7.5z" fill="${hex}"/>`)
}

export function listIcon(hex: string, size = 16, width: number = STROKE.base): string {
  return line(hex, size, width, '<path d="M4 6.5h9M4 12h16M4 17.5h9"/>')
}

export function documentIcon(hex: string, size = 16, width: number = STROKE.base): string {
  return line(hex, size, width, '<path d="M6.5 3.5h7.5l4 4v13H6.5z"/><path d="M14 3.5v4h4M9.5 12.5h5M9.5 16h5"/>')
}

export function externalIcon(hex: string, size = 16, width: number = STROKE.base): string {
  return line(hex, size, width, '<path d="M14 4.5h5.5V10M19.5 4.5L11 13"/><path d="M18 14v5.5H4.5V6H10"/>')
}

/** Boîte d'archive : archiver la session d'une tâche faite. */
export function archiveIcon(hex: string, size = 16, width: number = STROKE.base): string {
  return line(hex, size, width, '<rect x="3.5" y="4.5" width="17" height="4" rx="1"/><path d="M5.5 8.5v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-10M10 12.5h4"/>')
}

export function checkIcon(hex: string, size = 16, width: number = STROKE.check): string {
  return line(hex, size, width, '<path d="M5 12.5l4.5 4.5L19 7.5"/>')
}

export function alertIcon(hex: string, size = 16, width: number = STROKE.base): string {
  return line(hex, size, width, `<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5.5"/><circle cx="12" cy="16.6" r="0.6" fill="${hex}"/>`)
}

/** Cadenas : tâche bloquée par sa prérequise. `title` en fait une infobulle (Svg interactif). */
/** Main levée : tâche bloquée par sa prérequise (« stop, attends l'autre »). `title` en fait une infobulle. */
export function handIcon(hex: string, size = 14, width: number = STROKE.pill, title?: string): string {
  return line(
    hex,
    size,
    width,
    '<path d="M8 12.5V6a1.5 1.5 0 0 1 3 0v5.5"/><path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 11V6a1.5 1.5 0 0 1 3 0v7.5c0 3.8-2.6 6.5-6.3 6.5H10c-2 0-3.4-.9-4.5-2.5L3.6 14.6a1.5 1.5 0 0 1 2.5-1.7L8 15"/>',
    title,
  )
}

export function lockIcon(hex: string, size = 14, width: number = STROKE.pill, title?: string): string {
  return line(hex, size, width, '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>', title)
}

/** Dossier : l'écran « aucune roadmap ». */
export function folderIcon(hex: string, size = 24): string {
  return line(hex, size, 1.5, '<path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>')
}

export function chevronIcon(hex: string, isOpen: boolean, size = 16): string {
  return line(hex, size, STROKE.base, isOpen ? '<path d="M6 9.5l6 6 6-6"/>' : '<path d="M9.5 6l6 6-6 6"/>')
}

/**
 * La roue d'une tâche en session : cercle estompé et arc d'un quart. Elle ne tourne que dans un
 * Svg interactif (animation SMIL, 0,9 s par tour) ; dessinée en image, elle reste immobile.
 */
/** Un tour de roue, en millisecondes. */
export const SPIN_MS = 900

/**
 * Le départ d'une roue, calé sur l'horloge : chaque Svg anime sa propre horloge, qui part à son
 * chargement, et des roues montées à des rendus différents tournaient décalées. Un départ négatif
 * de `now` modulo un tour les remet toutes à la même phase, celle de l'horloge.
 */
export function spinBegin(now: number): string {
  return `-${((now % SPIN_MS) / 1000).toFixed(3)}s`
}

export function spinnerIcon(hex: string, size = 14, title?: string, still = false, now?: number): string {
  const begin = now === undefined ? '' : ` begin="${spinBegin(now)}"`
  return svg(
    size,
    24,
    `<circle cx="12" cy="12" r="9" fill="none" stroke="${hex}" stroke-opacity="0.25" stroke-width="3"/>` +
      `<path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="${hex}" stroke-width="3" stroke-linecap="round">` +
      (still ? '' : `<animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="${SPIN_MS / 1000}s"${begin} repeatCount="indefinite"/>`) +
      '</path>',
    title,
  )
}

/** L'arc des titres en cours de calcul : trois quarts de cercle qui tournent (1,1 s par tour, Svg interactif). */
export function pendingIcon(hex: string, size = 16): string {
  return svg(
    size,
    24,
    `<path d="M12 3.5a8.5 8.5 0 1 1-8.5 8.5" fill="none" stroke="${hex}" stroke-width="${STROKE.base}" stroke-linecap="round">` +
      '<animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1.1s" repeatCount="indefinite"/>' +
      '</path>',
  )
}

export type Corner = 'tl' | 'tr' | 'bl' | 'br'

/**
 * Le masque d'un coin arrondi : une Box n'a pas d'arrondi, alors on peint, dans la couleur de ce qui
 * l'entoure, le petit morceau qui dépasse de l'arc. Posé dans chaque coin, il arrondit la Box.
 */
export function cornerIcon(corner: Corner, radius: number, hex: string): string {
  const r = radius
  const path = {
    tl: `M0 0H${r}A${r} ${r} 0 0 0 0 ${r}Z`,
    tr: `M${r} 0V${r}A${r} ${r} 0 0 0 0 0Z`,
    bl: `M0 ${r}V0A${r} ${r} 0 0 0 ${r} ${r}Z`,
    br: `M${r} ${r}H0A${r} ${r} 0 0 0 ${r} 0Z`,
  }[corner]
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${r}" height="${r}" viewBox="0 0 ${r} ${r}"><path d="${path}" fill="${hex}"/></svg>`
}

// --- Pastilles ----------------------------------------------------------------------------
// Une Box n'a pas d'arrondi : les pastilles se dessinent en SVG, texte compris, à la police
// système. Leur largeur s'estime d'après les caractères (le SVG ne mesure pas son texte).

const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"

/** Largeur estimée d'un texte, en px, à la police système, `size` px, gras ou non. */
export function textWidth(text: string, size: number, bold = false): number {
  let em = 0
  for (const ch of text) {
    if (/[0-9]/.test(ch)) em += 0.6
    else if (ch === '%') em += 0.92
    else if (/[iljftrI.,:;'’!|/ ]/.test(ch)) em += ch === ' ' ? 0.28 : 0.33
    else if (/[mwMW@]/.test(ch)) em += 0.88
    else if (/[A-ZÀ-ÖØ-Þ]/.test(ch)) em += 0.68
    else em += 0.56
  }
  return Math.ceil(em * size * (bold ? 1.05 : 1))
}

export type PillMark = 'clock' | 'person' | 'spinner' | 'check'

/**
 * Une pastille : 18 px de haut (20 au détail), rayon de la moitié, texte de 12 px gras, chiffres
 * tabulaires, une icône de 12 px devant (horloge, personne, roue, coche).
 */
function pillIconRaw(o: {
  text: string
  bg: string
  fg: string
  mark?: PillMark
  height?: number
  weight?: 500 | 600
  /** Taille du texte, 12 px par défaut. */
  size?: number
}): { source: string; width: number; height: number } {
  const height = o.height ?? 18
  const size = o.size ?? 12
  const padX = height <= 18 ? (size < 12 ? 6 : 7) : 8
  const icon = o.mark ? 12 + 4 - 2 : 0
  const width = padX * 2 + icon + textWidth(o.text, size, (o.weight ?? 600) === 600)
  const mid = height / 2
  const x0 = padX - (o.mark ? 2 : 0)
  const mark =
    o.mark === undefined
      ? ''
      : `<g transform="translate(${x0} ${mid - 6}) scale(0.5)" fill="none" stroke="${o.fg}" stroke-width="${STROKE.pill}" stroke-linecap="round" stroke-linejoin="round">${MARK_PATHS[o.mark]}</g>`
  const text = `<text x="${padX + icon}" y="${mid}" dominant-baseline="central" font-family="${FONT}" font-size="${size}" font-weight="${o.weight ?? 600}" fill="${o.fg}" style="font-variant-numeric:tabular-nums">${escapeXml(o.text)}</text>`
  return {
    source: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" rx="${mid}" fill="${o.bg}"/>${mark}${text}</svg>`,
    width,
    height,
  }
}

export const pillIcon = memo(pillIconRaw)

// Les tracés des icônes de pastille, en viewBox 24.
const MARK_PATHS: Record<PillMark, string> = {
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3 2"/>',
  person: '<circle cx="12" cy="8" r="3.75"/><path d="M4.75 20c1.2-3.6 4-5.5 7.25-5.5s6.05 1.9 7.25 5.5"/>',
  spinner: '<circle cx="12" cy="12" r="9" stroke-opacity="0.25"/><path d="M12 3a9 9 0 0 1 9 9"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
}

/** Le grand pourcentage d'avancement : 28 px, gras 600, sur une ligne de 32 (la taille « title » de l'app est plus petite). */
function percentIconRaw(text: string, hex: string): { source: string; width: number; height: number } {
  // Une marge de quelques pixels : le texte est estimé, jamais mesuré, et un caractère coupé se voit.
  const width = textWidth(text, 28, true) + 8
  return {
    source:
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="32" viewBox="0 0 ${width} 32">` +
      `<text x="0" y="16" dominant-baseline="central" font-family="${FONT}" font-size="28" font-weight="600" fill="${hex}" style="font-variant-numeric:tabular-nums">${escapeXml(text)}</text></svg>`,
    width,
    height: 32,
  }
}

export const percentIcon = memo(percentIconRaw)

/** La pastille d'axe du détail : 22 px, rayon 6, carré de 10, nom de l'axe en gras de 13 px. */
function axisPillIconRaw(o: { name: string; hex: string; bg: string; fg: string }): { source: string; width: number; height: number } {
  const height = 22
  const width = 6 + 10 + 6 + textWidth(o.name, 13, true) + 8
  return {
    source:
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
      `<rect width="${width}" height="${height}" rx="6" fill="${o.bg}"/>` +
      `<rect x="6" y="6" width="10" height="10" rx="2.5" fill="${o.hex}"/>` +
      `<text x="22" y="11" dominant-baseline="central" font-family="${FONT}" font-size="13" font-weight="600" fill="${o.fg}">${escapeXml(o.name)}</text></svg>`,
    width,
    height,
  }
}

export const axisPillIcon = memo(axisPillIconRaw)

// Icônes d'état, en viewBox 16.

/** En retard : disque plein. */
export function discIcon(hex: string, size = 16): string {
  return svg(size, 16, `<circle cx="8" cy="8" r="4.5" fill="${hex}"/>`)
}

/** Récentes : une petite étoile à quatre branches, pleine. */
export function sparkIcon(hex: string, size = 16): string {
  return svg(size, 16, `<path d="M8 2.75c.45 2.6 1.65 3.8 4.25 4.25-2.6.45-3.8 1.65-4.25 4.25-.45-2.6-1.65-3.8-4.25-4.25 2.6-.45 3.8-1.65 4.25-4.25z" fill="${hex}"/>`)
}

/** À moi : anneau. */
export function ringIcon(hex: string, size = 16): string {
  return svg(size, 16, `<circle cx="8" cy="8" r="3.75" fill="none" stroke="${hex}" stroke-width="1.5"/>`)
}

/** Attend un tiers : anneau et demi-disque gauche plein. */
export function halfDiscIcon(hex: string, size = 16): string {
  return svg(
    size,
    16,
    `<circle cx="8" cy="8" r="3.75" fill="none" stroke="${hex}" stroke-width="1.5"/><path d="M8 4.25a3.75 3.75 0 0 0 0 7.5z" fill="${hex}"/>`,
  )
}

/** Le carré d'un axe : 10 × 10, rx 2,5, centré dans une case de 16. */
export function squareIcon(hex: string, size = 16): string {
  return svg(size, 16, `<rect x="3" y="3" width="10" height="10" rx="2.5" fill="${hex}"/>`)
}

// Les marques d'une ligne de tâche, dessinées sur 16 × 24 : elles fixent seules la hauteur de la
// ligne, sans cale à côté. Un dessin de moins par ligne compte : « Tout déplier » en pose des
// centaines.

/** Le carré d'axe d'une ligne de tâche, centré sur 24 px de haut. */
export function squareRowIcon(hex: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 16 24"><rect x="3" y="7" width="10" height="10" rx="2.5" fill="${hex}"/></svg>`
}

/**
 * Une marque de ligne (le carré d'axe ou la coche, 16 × 24) précédée du trait de sa chaîne
 * (`après:`) et de son étape, en un seul dessin de 32 × 24 : un Svg par ligne, comme une ligne
 * hors chaîne (le poids d'un dessin est compté). Le trait descend de la première tâche, traverse
 * les suivantes et s'arrête sur la dernière ; les lignes d'une section se touchent, les traits se
 * rejoignent d'une ligne à l'autre.
 */
export function chainRowIcon(mark: string, pos: 'first' | 'mid' | 'last', step: number, lineHex: string, textHex: string): string {
  const top = pos === 'first' ? 12 : 0
  const bottom = pos === 'last' ? 12 : 24
  const inner = mark.replace(/^<svg /, '<svg x="16" y="0" ')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 32 24"><path d="M4 ${top}V${bottom}M4 12H7" fill="none" stroke="${lineHex}" stroke-width="1.6"/><text x="12.5" y="15.5" text-anchor="middle" font-family="${FONT}" font-size="10" font-weight="500" fill="${textHex}">${step}</text>${inner}</svg>`
}

/** Le drapeau des tâches prioritaires (P1, P2), plein, sur 16 px. */
export function flagIcon(hex: string, size = 16): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 16 16"><path d="M4 2.5v11.5" stroke="${hex}" stroke-width="1.6" stroke-linecap="round"/><path d="M4.6 2.8h8.2l-2.2 3.1 2.2 3.1H4.6z" fill="${hex}"/></svg>`
}

/** Les tâches nées d'un retour de l'app (`feedback:`) : une bulle de parole, pleine, sur 16 px. */
export function bubbleIcon(hex: string, size = 16): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 16 16"><path d="M3.5 3h9a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H8l-3 2.5V11H3.5A1.5 1.5 0 0 1 2 9.5v-5A1.5 1.5 0 0 1 3.5 3z" fill="${hex}"/></svg>`
}

/** La coche d'une tâche faite, centrée sur 24 px de haut. */
export function checkRowIcon(hex: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 -6 24 36"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="${hex}" stroke-width="${STROKE.check}" stroke-linecap="round" stroke-linejoin="round"/></svg>`
}

/**
 * Un Svg sans largeur prend celle de son dessin, « jusqu'à la place » : dessiné un peu plus large
 * que le panneau et étiré sans garder ses proportions, il remplit toute la largeur. Le panneau ne
 * dit sa largeur qu'en colonnes de police mono ; 9 px par colonne la dépasse toujours un peu.
 */
export function fullWidth(columns: number): number {
  return Math.max(BAR_WIDTH, Math.round(columns * 9))
}

/** Le filet au-dessus de la ligne de filtre : 1 px, pleine largeur. */
export function ruleIcon(hex: string, width = BAR_WIDTH): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="1" viewBox="0 0 ${width} 1" preserveAspectRatio="none"><rect width="${width}" height="1" fill="${hex}"/></svg>`
}

/** Largeur de dessin de la barre par défaut : le panneau de 400 px moins ses marges. */
export const BAR_WIDTH = 384

type BarSegment = { name?: string; hex: string; n: number; dim?: boolean }

/** La géométrie de la barre : la place de chaque segment non vide, en unités de dessin. */
function barLayout(segments: BarSegment[], width: number): { segment: BarSegment; x: number; w: number }[] {
  const shown = segments.filter(s => s.n > 0)
  const total = shown.reduce((a, s) => a + s.n, 0)
  if (total === 0) return []
  const room = width - BAR_GAP * (shown.length - 1)
  let x = 0
  return shown.map(segment => {
    const w = Math.max((segment.n / total) * room, BAR_MIN)
    const placed = { segment, x, w }
    x += w + BAR_GAP
    return placed
  })
}

const BAR_GAP = 3
const BAR_MIN = 3

/**
 * La barre de composition : segments de 6 px de haut, rx 3, 3 px entre segments, largeur
 * proportionnelle au nombre de tâches, 3 px au moins. Un segment `dim` (filtre sur un autre axe)
 * passe à l'opacité 0,3.
 */
function barIconRaw(segments: BarSegment[], empty: string, width = BAR_WIDTH): string {
  const height = 6
  const frame = (body: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">${body}</svg>`
  const layout = barLayout(segments, width)
  if (layout.length === 0) return frame(`<rect width="${width}" height="${height}" rx="3" fill="${empty}" opacity="0.3"/>`)
  return frame(
    layout
      .map(({ segment, x, w }) => {
        const opacity = segment.dim ? ' opacity="0.3"' : ''
        return `<rect x="${x.toFixed(1)}" y="0" width="${w.toFixed(1)}" height="${height}" rx="3" fill="${segment.hex}"${opacity}/>`
      })
      .join(''),
  )
}

export const barIcon = memo(barIconRaw)

/** Les zones de clic de la barre : le bord droit de chaque segment, au milieu de l'écart, en part de la largeur. */
export function barCuts(segments: BarSegment[], width = BAR_WIDTH): { cuts: number[]; names: string[] } {
  const layout = barLayout(segments, width)
  return {
    cuts: layout.map(({ x, w }) => Math.min((x + w + BAR_GAP / 2) / width, 1)),
    names: layout.map(({ segment }) => segment.name ?? ''),
  }
}
