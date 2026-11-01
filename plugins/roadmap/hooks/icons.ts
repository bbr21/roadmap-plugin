// Les couleurs et les dessins du panneau, en SVG pour l'app de bureau (le terminal garde des glyphes).
// Un bouton impose sa couleur de texte : tout ce qui porte une couleur se dessine hors des boutons.
// Couleurs et mesures : tokens.ts (#108) ; dessins du handoff de design (README « Icônes »). Un SVG
// dessiné en image ne connaît pas `currentColor`, d'où la couleur passée à chaque dessin.

import type { ContextView, StepSegment, TodoIcon } from './parse'
import { FONT, MIX, PALETTES, RADIUS, SIZE, STROKE, TEXT, type Palette, type ThemeName } from './tokens'

// Les palettes et les traits sont des tokens du design system (#108) ; on les sert aussi d'ici.
export { PALETTES, STROKE, type Palette, type ThemeName }

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


export function clockIcon(hex: string, size = 12, width: number = STROKE.pill): string {
  return line(hex, size, width, '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3 2"/>')
}

// Les lignes de « À traiter » (#115, maquette C, version « colorée au trait ») et la roue des
// réglages : des icônes de trait, comme l'horloge, dans la couleur de leur ligne.

/** Ma journée : un soleil. */
export function sunIcon(hex: string, size = 16, width: number = STROKE.base): string {
  return line(hex, size, width, '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>')
}

/** Cette semaine : un calendrier. */
export function calendarIcon(hex: string, size = 16, width: number = STROKE.base): string {
  return line(hex, size, width, '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>')
}

/** À relancer : une cloche. */
export function bellIcon(hex: string, size = 16, width: number = STROKE.base): string {
  return line(hex, size, width, '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>')
}

/** Retours, au trait : une bulle de parole. */
export function bubbleLineIcon(hex: string, size = 16, width: number = STROKE.base): string {
  return line(hex, size, width, '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>')
}

/** Trois lignes à puces : le filtre « Toutes » (#160). */
export function listLineIcon(hex: string, size = 16, width: number = STROKE.base): string {
  return line(hex, size, width, '<path d="M3 6h.01M3 12h.01M3 18h.01M8 6h13M8 12h13M8 18h13"/>')
}

/** La roue des réglages, en haut à droite du panneau. */
export function gearIcon(hex: string, size = 16, width: number = STROKE.base): string {
  return line(
    hex,
    size,
    width,
    '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  )
}

export function personIcon(hex: string, size = 12, width: number = STROKE.pill): string {
  return line(hex, size, width, '<circle cx="12" cy="8" r="3.75"/><path d="M4.75 20c1.2-3.6 4-5.5 7.25-5.5s6.05 1.9 7.25 5.5"/>')
}

/** L'icône d'une ligne de « À traiter » (#115), 16 px au trait, dans la couleur de la ligne : le panneau et le design system. */
export function todoIcon(icon: TodoIcon, hex: string): string {
  switch (icon) {
    case 'sun':
      return sunIcon(hex)
    case 'clock':
      return clockIcon(hex, 16, STROKE.base)
    case 'calendar':
      return calendarIcon(hex)
    case 'bell':
      return bellIcon(hex)
    case 'spin':
      return spinnerIcon(hex, 16, undefined, true)
    case 'bubble':
      return bubbleLineIcon(hex)
    case 'list':
      return listLineIcon(hex)
  }
}

/**
 * La marque Roadmap (#127) : trois voies de longueur décroissante aux couleurs des trois premiers axes,
 * celles de la barre du panneau, dans un carré arrondi au fond des boutons.
 */
export function brandMarkIcon(palette: Palette, size = 20): string {
  const lane = (y: number, w: number, hex: string) => `<rect x="4" y="${y}" width="${w}" height="2.4" rx="1.2" fill="${hex}"/>`
  return svg(
    size,
    20,
    `<rect x="0.5" y="0.5" width="19" height="19" rx="5" fill="${palette.btn}" stroke="${palette.border}"/>` +
      lane(5, 12, axisColor(palette, 0)) +
      lane(8.8, 8.5, axisColor(palette, 1)) +
      lane(12.6, 5, axisColor(palette, 2)),
  )
}

/**
 * Les voies de Maestro (#137, style Voies) : le moyeu, la marque en grand, et une courbe vers chaque
 * rangée de la liste qui le suit, à la couleur de l'état de sa tâche (close : en pointillé). Le dessin
 * a la hauteur des rangées (ou du moyeu, s'il est plus haut) : la liste se pose à côté.
 */
export function brandLanesIcon(
  palette: Palette,
  // `finished` : toute finie, violette pointillée (#145) ; `wait` : t'attend, orange.
  states: readonly ('wait' | 'live' | 'done' | 'finished')[],
  row = 24,
  hub = 32,
): { source: string; width: number; height: number } {
  const height = Math.max(states.length * row, hub)
  const top = (height - states.length * row) / 2
  const cy = height / 2
  const width = hub + 52
  const hex = { wait: palette.block, live: palette.live, done: palette.done, finished: palette.finished }
  const lanes = states
    .map((state, i) => {
      const y = top + i * row + row / 2
      const dash = state === 'done' || state === 'finished' ? ' stroke-dasharray="1 4"' : ''
      return (
        `<path class="lane" d="M${hub} ${cy}C${hub + 26} ${cy} ${hub + 16} ${y} ${hub + 44} ${y}" fill="none" stroke="${hex[state]}" stroke-width="2.4" stroke-linecap="round"${dash}/>` +
        `<circle cx="${hub + 46}" cy="${y}" r="3.2" fill="${hex[state]}"/>`
      )
    })
    .join('')
  const u = hub / 20
  const hy = cy - hub / 2
  const bar = (y: number, w: number, i: number) =>
    `<rect x="${4 * u}" y="${hy + y * u}" width="${w * u}" height="${2.4 * u}" rx="${1.2 * u}" fill="${axisColor(palette, i)}"/>`
  const mark =
    `<rect x="${0.5 * u}" y="${hy + 0.5 * u}" width="${19 * u}" height="${19 * u}" rx="${5 * u}" fill="${palette.btn}" stroke="${palette.border}"/>` +
    bar(5, 12, 0) +
    bar(8.8, 8.5, 1) +
    bar(12.6, 5, 2)
  return {
    source: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${lanes}${mark}</svg>`,
    width,
    height,
  }
}

/**
 * La voie d'une tâche (#137, style Voies) : la station d'avant (faite : pleine et cochée ; ouverte :
 * creuse, à la couleur du blocage), la sienne en grand à la couleur de l'axe, et celle qu'elle débloque,
 * reliées par la voie (pleine jusqu'à elle, pointillée après). Les mots sont ceux de `brandText`.
 */
export function brandStationsIcon(
  palette: Palette,
  accent: string,
  o: { before?: { text: string; done: boolean }; here: string; next?: string },
  width: number,
): { source: string; width: number; height: number } {
  const height = 52
  const y = 20
  const pad = 14
  const a = pad
  const c = width - pad
  const b = o.before && o.next ? width / 2 : o.before ? c : a
  const label = (x: number, text: string, anchor: string, fill: string, weight: number) =>
    `<text x="${x}" y="${y + 26}" text-anchor="${anchor}" font-family="${FONT}" font-size="${TEXT.pill}" font-weight="${weight}" fill="${fill}">${escapeXml(text)}</text>`
  const anchorOf = (x: number) => (x === a ? 'start' : x === c ? 'end' : 'middle')
  let body = ''
  if (o.before) {
    body += `<path d="M${a} ${y}H${b}" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>`
  }
  if (o.next) {
    body += `<path d="M${b} ${y}H${c}" stroke="${accent}" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 7" stroke-opacity="0.6"/>`
    body += `<circle cx="${c}" cy="${y}" r="6" fill="${palette.bg}" stroke="${accent}" stroke-width="2"/>`
    body += label(c, o.next, 'end', palette.text2, TEXT.weight.soft)
  }
  if (o.before) {
    body += o.before.done
      ? `<circle cx="${a}" cy="${y}" r="6" fill="${palette.done}"/><path d="M${a - 2.6} ${y}l2 2 3.4-3.6" fill="none" stroke="${palette.bg}" stroke-width="1.6"/>`
      : `<circle cx="${a}" cy="${y}" r="6" fill="${palette.bg}" stroke="${palette.block}" stroke-width="2"/>`
    body += label(a, o.before.text, 'start', o.before.done ? palette.text2 : palette.block, TEXT.weight.soft)
  }
  body += `<circle cx="${b}" cy="${y}" r="12" fill="${axisTint(palette, accent)}"/><circle cx="${b}" cy="${y}" r="7" fill="${accent}"/>`
  body += label(b, o.here, anchorOf(b), palette.text, TEXT.weight.strong)
  return {
    source: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`,
    width,
    height,
  }
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

/** Crayon : modifier la tâche depuis sa fiche (#161). */
export function pencilIcon(hex: string, size = 16, width: number = STROKE.base): string {
  return line(hex, size, width, '<path d="M15.5 4.5l4 4L8.5 19.5H4.5v-4z"/><path d="M13 7l4 4"/>')
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
    `<circle cx="12" cy="12" r="9" fill="none" stroke="${hex}" stroke-opacity="${MIX.spinnerTrack}" stroke-width="3"/>` +
      `<path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="${hex}" stroke-width="3" stroke-linecap="round">` +
      (still ? '' : `<animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="${SPIN_MS / 1000}s"${begin} repeatCount="indefinite"/>`) +
      '</path>',
    title,
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
  const height = o.height ?? SIZE.pill.row
  const size = o.size ?? TEXT.pill
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

/**
 * Une pastille de filtre (#149, maquette C′) : l'icône de trait de sa ligne d'avant, son nom, son compte,
 * sur une rangée qui remplace les lignes de « À traiter ». 22 px de haut, texte de 13 px.
 */
function filterPillIconRaw(o: {
  icon: TodoIcon
  name: string
  n: number
  /** L'icône et le nom. */
  ink: string
  bg: string
  /** Le compte. */
  countInk: string
  /** Le filtre choisi : nom et compte en gras. */
  strong: boolean
}): { source: string; width: number; height: number } {
  const height = SIZE.pill.axis
  const size = TEXT.axis
  const weight = o.strong ? TEXT.weight.strong : TEXT.weight.soft
  const padX = 9
  const icon = 14
  const gap = 5
  const nameW = textWidth(o.name, size, o.strong)
  const count = String(o.n)
  const width = padX * 2 + icon + gap + nameW + gap + textWidth(count, size, o.strong)
  const mid = height / 2
  // L'icône de ligne, imbriquée à sa place : sa largeur et sa hauteur remplacées, x et y posés.
  const glyph = todoIcon(o.icon, o.ink).replace(/ width="[^"]*" height="[^"]*"/, ` x="${padX}" y="${mid - icon / 2}" width="${icon}" height="${icon}"`)
  const text = (x: number, fill: string, t: string) =>
    `<text x="${x}" y="${mid}" dominant-baseline="central" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" style="font-variant-numeric:tabular-nums">${escapeXml(t)}</text>`
  return {
    source:
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" rx="${mid}" fill="${o.bg}"/>` +
      glyph +
      text(padX + icon + gap, o.ink, o.name) +
      text(padX + icon + gap + nameW + gap, o.countInk, count) +
      '</svg>',
    width,
    height,
  }
}

export const filterPillIcon = memo(filterPillIconRaw)

// Les tracés des icônes de pastille, en viewBox 24.
const MARK_PATHS: Record<PillMark, string> = {
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3 2"/>',
  person: '<circle cx="12" cy="8" r="3.75"/><path d="M4.75 20c1.2-3.6 4-5.5 7.25-5.5s6.05 1.9 7.25 5.5"/>',
  spinner: `<circle cx="12" cy="12" r="9" stroke-opacity="${MIX.spinnerTrack}"/><path d="M12 3a9 9 0 0 1 9 9"/>`,
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
}

/** Le grand pourcentage d'avancement : 28 px, gras 600, sur une ligne de 32 (la taille « title » de l'app est plus petite). */
function percentIconRaw(text: string, hex: string): { source: string; width: number; height: number } {
  // Une marge de quelques pixels : le texte est estimé, jamais mesuré, et un caractère coupé se voit.
  const width = textWidth(text, TEXT.percent, true) + 8
  return {
    source:
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${SIZE.percent}" viewBox="0 0 ${width} ${SIZE.percent}">` +
      `<text x="0" y="16" dominant-baseline="central" font-family="${FONT}" font-size="${TEXT.percent}" font-weight="${TEXT.weight.strong}" fill="${hex}" style="font-variant-numeric:tabular-nums">${escapeXml(text)}</text></svg>`,
    width,
    height: SIZE.percent,
  }
}

export const percentIcon = memo(percentIconRaw)

/** La pastille d'axe du détail : 22 px, rayon 6, carré de 10, nom de l'axe en gras de 13 px. */
function axisPillIconRaw(o: { name: string; hex: string; bg: string; fg: string }): { source: string; width: number; height: number } {
  const height = SIZE.pill.axis
  const width = 6 + 10 + 6 + textWidth(o.name, TEXT.axis, true) + 8
  return {
    source:
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
      `<rect width="${width}" height="${height}" rx="${RADIUS.axisPill}" fill="${o.bg}"/>` +
      `<rect x="6" y="6" width="10" height="10" rx="${RADIUS.square}" fill="${o.hex}"/>` +
      `<text x="22" y="11" dominant-baseline="central" font-family="${FONT}" font-size="${TEXT.axis}" font-weight="${TEXT.weight.strong}" fill="${o.fg}">${escapeXml(o.name)}</text></svg>`,
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
  return svg(size, 16, `<rect x="3" y="3" width="10" height="10" rx="${RADIUS.square}" fill="${hex}"/>`)
}

// Les marques d'une ligne de tâche, dessinées sur 16 × 24 : elles fixent seules la hauteur de la
// ligne, sans cale à côté. Un dessin de moins par ligne compte : « Tout déplier » en pose des
// centaines.

/** Le carré d'axe d'une ligne de tâche, centré sur 24 px de haut. */
export function squareRowIcon(hex: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 16 24"><rect x="3" y="7" width="10" height="10" rx="${RADIUS.square}" fill="${hex}"/></svg>`
}

/**
 * Le carré d'axe d'une tâche close (#180, maquette C) : à pleine couleur, un peu plus grand que celui
 * d'une ouverte (12 au lieu de 10) pour porter sa coche, en `inkHex` (blanc, `onAxis`), centré sur 24.
 */
export function squareCheckRowIcon(hex: string, inkHex: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 16 24"><rect x="2" y="6" width="12" height="12" rx="${RADIUS.square}" fill="${hex}"/><path d="M5.2 12.2l1.9 1.9 3.7-3.9" fill="none" stroke="${inkHex}" stroke-width="${STROKE.check}" stroke-linecap="round" stroke-linejoin="round"/></svg>`
}

/**
 * La case qui bouge (#182, maquette A) : le carré coché de `squareCheckRowIcon`, animé en SMIL, figé
 * à la fin sur le dessin fixe. Cocher (`done`) : le carré passe de 10 à 12 avec un petit rebond, puis
 * la coche se trace ; rouvrir : la coche s'efface, puis le carré revient au carré de 10 d'une ouverte.
 * `elapsedMs` recule le début : un redessin reprend le mouvement où il en est.
 */
export function squareCheckMoveIcon(hex: string, inkHex: string, done: boolean, elapsedMs: number): string {
  const begin = `begin="-${(elapsedMs / 1000).toFixed(3)}s" fill="freeze"`
  const ease = 'calcMode="spline" keySplines="0.2 0.8 0.3 1;0.2 0.8 0.3 1"'
  // Le carré se dessine autour de son centre (8, 12) : l'échelle le garde centré sur la ligne.
  const square = done
    ? `<rect x="-6" y="-6" width="12" height="12" rx="${RADIUS.square}" fill="${hex}"><animateTransform attributeName="transform" type="scale" values="0.833;1.12;1" keyTimes="0;0.5;1" ${ease} dur="0.28s" ${begin}/></rect>`
    : `<rect x="-6" y="-6" width="12" height="12" rx="3" fill="${hex}" transform="scale(0.833)"><animateTransform attributeName="transform" type="scale" values="1;1;0.833" keyTimes="0;0.4;1" ${ease} dur="0.25s" ${begin}/></rect>`
  const trace = done
    ? `<animate attributeName="stroke-dashoffset" values="9;9;0" keyTimes="0;0.333;1" calcMode="spline" keySplines="0 0 1 1;0.3 0 0.2 1" dur="0.36s" ${begin}/>`
    : `<animate attributeName="stroke-dashoffset" values="0;9" dur="0.15s" ${begin}/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 16 24"><g transform="translate(8 12)">${square}</g><path d="M5.2 12.2l1.9 1.9 3.7-3.9" fill="none" stroke="${inkHex}" stroke-width="${STROKE.check}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="9" stroke-dashoffset="${done ? 0 : 9}">${trace}</path></svg>`
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
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 32 24"><path d="M4 ${top}V${bottom}M4 12H7" fill="none" stroke="${lineHex}" stroke-width="1.6"/><text x="12.5" y="15.5" text-anchor="middle" font-family="${FONT}" font-size="${TEXT.chainStep}" font-weight="${TEXT.weight.soft}" fill="${textHex}">${step}</text>${inner}</svg>`
}

/**
 * La tête d'un bloc de l'arbre (#125) : le chevron (déplié ou replié) sur 0-16, puis la marque de
 * la ligne (carré d'axe) sur 16-32, en un seul dessin de 32 × 24. Le carré tombe au-dessus de ceux
 * de ses enfants (`chainRowIcon`), et leur trait descend sous le chevron.
 */
export function treeHeadRowIcon(mark: string, open: boolean, chevronHex: string): string {
  const chevron = chevronIcon(chevronHex, open).replace(/^<svg /, '<svg x="0" y="4" ')
  const inner = mark.replace(/^<svg /, '<svg x="16" y="0" ')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 32 24">${chevron}${inner}</svg>`
}

// L'arbre par axe (#168, maquettes choisies par Bertrand le 2026-11-01) : la flèche dans le carré,
// pour la section comme pour la mère ; les filles reliées par un coude qui part du carré de la mère.

/** La flèche d'un carré d'axe, en `inkHex` (`onAxis`), centrée en (cx, cy), sur `half` de demi-largeur. */
function innerChevron(cx: number, cy: number, half: number, open: boolean, inkHex: string): string {
  const d = open
    ? `M${cx - half} ${cy - half / 2}L${cx} ${cy + half / 2}L${cx + half} ${cy - half / 2}`
    : `M${cx - half / 2} ${cy - half}L${cx + half / 2} ${cy}L${cx - half / 2} ${cy + half}`
  return `<path d="${d}" fill="none" stroke="${inkHex}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`
}

/** Le carré d'une mère de l'arbre par axe (#168), 16 × 24 : le carré de son axe, sa flèche dedans. */
export function treeMotherRowIcon(hex: string, open: boolean, inkHex: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 16 24"><rect x="2" y="6" width="12" height="12" rx="${RADIUS.square}" fill="${hex}"/>${innerChevron(8, 12, 3, open, inkHex)}</svg>`
}

/**
 * Une fille de l'arbre par axe (#168), 32 × 24 : le coude (├, └ pour la dernière) sous le carré de
 * sa mère, puis sa marque (carré d'axe ou coche) un cran à droite.
 */
export function treeChildRowIcon(mark: string, last: boolean, lineHex: string): string {
  const inner = mark.replace(/^<svg /, '<svg x="16" y="0" ')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 32 24"><path d="M8 0V${last ? 12 : 24}M8 12H15" fill="none" stroke="${lineHex}" stroke-width="1.2"/>${inner}</svg>`
}

/** Le carré d'une section d'axe (#168), 16 × 24 : un peu plus grand que celui des lignes, sa flèche dedans. */
export function axisBandIcon(hex: string, open: boolean, inkHex: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 16 24"><rect x="1" y="5" width="14" height="14" rx="3" fill="${hex}"/>${innerChevron(8, 12, 3.5, open, inkHex)}</svg>`
}

// L'arbre « Le fil » (#163, maquette A choisie par Bertrand le 2026-10-31) : lignes de 30 px. La
// case à cocher est un bouton du kit à côté (un bouton ne porte pas de dessin) ; la marque garde le
// fil et le rang, un seul dessin par étape.

/** La marque d'une étape de l'arbre (#163), 22 × 30 : le fil de sa mère (arrêté à mi-hauteur sur la dernière) et son rang. */
export function treeStepIcon(o: { rank: number; last: boolean; lineHex: string; textHex: string }): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="30" viewBox="0 0 22 30"><path d="M4 0V${o.last ? 15 : 30}" fill="none" stroke="${o.lineHex}" stroke-width="1"/><text x="15" y="18.5" text-anchor="middle" font-family="${FONT}" font-size="${TEXT.chainStep}" font-weight="${TEXT.weight.soft}" fill="${o.textHex}">${o.rank}</text></svg>`
}

/** La marque d'une mère de l'arbre (#163), 16 × 30 : son chevron, déplié ou replié. */
export function treeHeadIcon(o: { open: boolean; chevronHex: string }): string {
  const chevron = chevronIcon(o.chevronHex, o.open, 14).replace(/^<svg /, '<svg x="1" y="8" ')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="30" viewBox="0 0 16 30">${chevron}</svg>`
}

/** La barre d'avancement d'une mère de l'arbre (#163), 34 × 4 : le fond `trackHex`, la part faite en `okHex`. */
export function progressIcon(done: number, total: number, okHex: string, trackHex: string): string {
  const w = total === 0 ? 0 : Math.round((34 * done * 10) / total) / 10
  return `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="4" viewBox="0 0 34 4"><rect width="34" height="4" rx="2" fill="${trackHex}"/>${w > 0 ? `<rect width="${w}" height="4" rx="2" fill="${okHex}"/>` : ''}</svg>`
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
  if (layout.length === 0) return frame(`<rect width="${width}" height="${height}" rx="${RADIUS.bar}" fill="${empty}" opacity="${MIX.track}"/>`)
  return frame(
    layout
      .map(({ segment, x, w }) => {
        const opacity = segment.dim ? ` opacity="${MIX.track}"` : ''
        return `<rect x="${x.toFixed(1)}" y="0" width="${w.toFixed(1)}" height="${height}" rx="${RADIUS.bar}" fill="${segment.hex}"${opacity}/>`
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

/**
 * La barre d'étapes d'une session (#143, maquette C + A) : un segment par étape, 1 px entre eux, 2 px
 * au moins chacun (la barre s'élargit au-delà de `width`) ; vert fait, bleu en cours (orange quand la
 * session t'attend), `sel` à faire ; toute violette quand la tâche est toute finie (#145).
 */
export function stepsBarIcon(
  palette: Palette,
  segments: readonly StepSegment[],
  opts: { width: number; height?: number; waiting?: boolean; finished?: boolean },
): { source: string; width: number; height: number } {
  const height = opts.height ?? 6
  const gap = 1
  const n = Math.max(1, segments.length)
  const width = Math.max(opts.width, n * 2 + (n - 1) * gap)
  const w = (width - (n - 1) * gap) / n
  // Toute finie, toute violette ; la session t'attend, l'étape en cours orange (#145).
  const fill = (s: StepSegment) =>
    opts.finished ? palette.finished : s === 'done' ? palette.ok : s === 'now' ? (opts.waiting ? palette.block : palette.live) : palette.sel
  const body = segments
    .map((s, i) => `<rect x="${(i * (w + gap)).toFixed(1)}" y="0" width="${w.toFixed(1)}" height="${height}" rx="${Math.min(RADIUS.bar, height / 2)}" fill="${fill(s)}"/>`)
    .join('')
  return {
    source: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`,
    width,
    height,
  }
}

/**
 * La jauge fine du contexte d'une session (#157) : le fond gris, la part utilisée à la couleur du seuil
 * (bleu, orange, rouge), pleine au-delà de la fenêtre.
 */
export function contextBarIcon(
  palette: Palette,
  view: ContextView,
  opts: { width: number; height: number },
): { source: string; width: number; height: number } {
  const { width, height } = opts
  const rx = Math.min(RADIUS.bar, height / 2)
  const used = (Math.min(100, Math.max(0, view.percent)) * width) / 100
  const fill = view.tone === 'full' ? palette.late : view.tone === 'high' ? palette.block : palette.live
  return {
    source: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect x="0" y="0" width="${width}" height="${height}" rx="${rx}" fill="${palette.sel}"/>${used > 0 ? `<rect x="0" y="0" width="${used.toFixed(1)}" height="${height}" rx="${rx}" fill="${fill}"/>` : ''}</svg>`,
    width,
    height,
  }
}

/** La marque d'une étape dans la carte (#143) : disque vert coché, roue bleue immobile, cercle à faire. */
export function stepIcon(palette: Palette, status: StepSegment, size = 16): string {
  if (status === 'done') {
    return svg(size, 16, `<circle cx="8" cy="8" r="7" fill="${palette.ok}"/><path d="M4.8 8.2l2.1 2.1 4.3-4.4" fill="none" stroke="${palette.bg}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`)
  }
  if (status === 'now') return spinnerIcon(palette.live, size)
  return svg(size, 16, `<circle cx="8" cy="8" r="6" fill="none" stroke="${palette.text3}" stroke-width="1.4"/>`)
}
