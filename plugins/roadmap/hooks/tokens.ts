// Les tokens du design system (#108) : couleurs, mesures et pas du panneau, du volet Réglages et de
// la bande d'étapes, en un seul endroit. Le panneau les lit (par `icons.ts` et directement) ; le
// paquet React de `design/` aussi, qui en tire `styles.css` pour /design-sync.
// Données seules, sans import ni syntaxe que Node ne sait pas effacer : `design/scripts` les lit tel quel.

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
  /** Attend un tiers (attend : Martial), les retours ; sa couleur propre depuis #145. */
  wait: string
  waitTint: string
  waitOn: string
  /** Tâche toute finie dans l'arbre de Maestro : ligne close, session finie ou archivée (#145). */
  finished: string
  finishedTint: string
  finishedOn: string
  /** Coche, session lancée. */
  ok: string
  /** Les Done : la barre pleine de la vue Done, le compte « x Done » montré ; le vert de `ok` depuis #180. */
  done: string
  /** Bouton Lancer. */
  pri: string
  priText: string
  /** La flèche posée dans un carré d'axe (#168) : blanche dans les deux thèmes. */
  onAxis: string
  /** Boutons icône. */
  btn: string
  btnHover: string
  /** Fond de la note du détail. */
  note: string
  /** Tâche en cours dans une session. */
  live: string
  liveTint: string
  liveOn: string
  /** Tâche bloquée par sa prérequise, et session qui t'attend (#145). */
  block: string
  blockTint: string
  blockOn: string
  /** Couleurs d'axe, dans l'ordre de déclaration des axes, modulo 8. */
  axes: readonly string[]
  /** Part de la couleur d'axe dans le fond de la pastille d'axe (`color-mix` du design). */
  axisTintRatio: number
}

// Valeurs du handoff de design (README « Tokens »).
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
    // Bleu-vert, ni l'orange de « t'attend » et « bloquée », ni le violet de fin (#145).
    wait: '#45B5C4',
    waitTint: '#1B3236',
    waitOn: '#8DD3DD',
    finished: '#A781F0',
    finishedTint: '#2F2742',
    finishedOn: '#C7AEFA',
    ok: '#5BAE6A',
    // Le vert de `ok` (#180) : les Done se voient, même dans leur vue.
    done: '#5BAE6A',
    pri: '#ECEBE7',
    priText: '#1F1E1D',
    onAxis: '#FFFFFF',
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
    wait: '#1A8496',
    waitTint: '#E1F2F5',
    waitOn: '#136878',
    finished: '#7C4FD6',
    finishedTint: '#EFE9FC',
    finishedOn: '#5F35BF',
    ok: '#2E8540',
    done: '#2E8540',
    pri: '#1F1E1D',
    priText: '#FFFFFF',
    onAxis: '#FFFFFF',
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

/** La police des dessins SVG : celle du système, comme le texte de l'app. */
export const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"

/** Épaisseurs de trait des icônes : base 16 px, pastille 12 px, petite icône 12-14 px, coche. */
export const STROKE = { base: 1.8, pill: 2.4, small: 2.2, check: 2 } as const

/** Les parts de mélange (`mixOver`) et les opacités des dessins. */
export const MIX = {
  /** `sel` sur `bg` : fond des pastilles de compte. */
  countBg: 0.6,
  /** Texte d'une ligne estompée sur `bg`. */
  faded: 0.4,
  /** `ok` sur `bg` : pastille « fluide » du bilan. */
  smooth: 0.2,
  /** `liveOn` sur `bg` : bordure de la carte de session. */
  sessionBorder: 0.3,
  /** Fond du bouton principal sur son entourage, au survol. */
  primaryHover: 0.88,
  /** Opacité d'un élément estompé. */
  faint: 0.4,
  /** Opacité de la barre vide et d'un segment estompé. */
  track: 0.3,
  /** Opacité du cercle de fond de la roue. */
  spinnerTrack: 0.25,
} as const

/** Rayons, en px : boutons et cartes, puce de chemin, pastille d'axe, carré d'axe, barre. Une pastille a le rayon de sa demi-hauteur. */
export const RADIUS = { control: 8, chip: 6, axisPill: 6, square: 2.5, bar: 3 } as const

/** Mesures fixes, en px. */
export const SIZE = {
  /** Hauteur des pastilles : compte de section, ligne, détail, axe. */
  pill: { count: 16, row: 18, detail: 20, axis: 22 },
  /** Côté des icônes. */
  icon: { xs: 12, sm: 14, md: 16, lg: 24 },
  /** Hauteurs tenues par une cale : ligne, champ du détail, bouton et bandeau. */
  strut: { row: 24, field: 28, control: 32 },
  /** Hauteur du grand pourcentage. */
  percent: 32,
  /** Hauteur de la barre de composition. */
  bar: 6,
} as const

/** Texte des dessins SVG, en px, et ses deux graisses. Le texte de l'app passe par `size` (caption, footnote, body, heading, title). */
export const TEXT = { pill: 12, count: 10, axis: 13, percent: 28, chainStep: 10, weight: { strong: 600, soft: 500 } } as const

/**
 * Les pas d'espacement du panneau, dans l'unité du mod : un nombre compte des cellules de caractère,
 * un nom suit l'échelle de la surface. Par rôle : écart dans une rangée, retrait standard, retrait
 * des écrans vide et erreur, rangée de boutons texte, retrait des tiers ; pile serrée, bloc, racine,
 * et l'écart entre deux sections du volet Réglages (#118).
 */
export const SPACE = { row: 1, indent: 1, screen: 2, textButtons: 2, nest: 4, tight: 'xs', block: 'sm', root: 'md', section: 'xl' } as const

/**
 * L'échelle en pixels du paquet React (`design/`), qui ne dessine pas en cellules. Cellule et ligne
 * sont relevées dans l'app ; les pas nommés et les tailles de texte de l'app de bureau ne sont
 * publiés nulle part : valeurs retenues, à recaler sur capture.
 */
export const PX = {
  cell: 9,
  line: 20,
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  text: { caption: 12, footnote: 13, body: 14, heading: 16, title: 22 },
} as const
