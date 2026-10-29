import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderElement, RenderInput, ToolCallResult } from 'claude-code'

import type { LiveEntry, ShortTitle, View } from '../types'
import {
  AXIS_THEME,
  PALETTES,
  axisColor,
  barCuts,
  barIcon,
  axisPillIcon,
  axisTint,
  percentIcon,
  pillIcon,
  type PillMark,
  checkIcon,
  checkRowIcon,
  chainRowIcon,
  flagIcon,
  bubbleIcon,
  squareRowIcon,
  cornerIcon,
  memo,
  rowMark,
  type Corner,
  chevronIcon,
  lockIcon,
  handIcon,
  folderIcon,
  alertIcon,
  pendingIcon,
  playIcon,
  externalIcon,
  documentIcon,
  archiveIcon,
  clockIcon,
  discIcon,
  halfDiscIcon,
  mixOver,
  personIcon,
  resolveTheme,
  ringIcon,
  sparkIcon,
  ruleIcon,
  fullWidth,
  spinnerIcon,
  squareIcon,
  STROKE,
  type Palette,
} from './icons'
import { SETTINGS_PANE, drawSettings, openSettings, prefsFile, redrawSettings, sessionProject, watchSettings } from './reglages'
import {
  ageLabel,
  axisLabel,
  axisOrder,
  archiveReminder,
  rangementReminder,
  rangementSeen,
  captureReminder,
  ideaOffer,
  ideaReminder,
  codeWithoutTests,
  isMethodSkill,
  isSwiftUISkill,
  PANEL_SKILL,
  panelSkillNote,
  SETTINGS_SKILL,
  settingsSkillNote,
  methodReminder,
  isMockupCall,
  uiFilesToMock,
  MOCKUP_TOOLS,
  swiftUIFiles,
  countBy,
  daysBetween,
  durationLabel,
  sessionIdIn,
  sessionState,
  dueLabel,
  findSelected,
  byDay,
  doneByDay,
  groupingOf,
  nextGrouping,
  groupingLabel,
  byDeadline,
  byOwner,
  byTree,
  treePrefix,
  filterSummary,
  fallbackTitle,
  openedLabel,
  selectionOf,
  frDate,
  doneLabel,
  firstPrereq,
  prereqsOf,
  cardTool,
  missingPrereqs,
  projectSettings,
  chainHead,
  chainSteps,
  type ChainStep,
  type Mode,
  unlockedBy,
  launchable,
  maestroCall,
  maestroContext,
  MAESTRO_MENU,
  type MaestroSession,
  type Prio,
  rowPills,
  sortTasks,
  type Pill,
  hashLabel,
  integerShares,
  launchBrief,
  checkBrief,
  briefPaths,
  type BriefFound,
  mainCheckout,
  baseName,
  clip,
  parseProjectConfig,
  splitNames,
  isBlocked,
  isMine,
  attendWho,
  shortAttend,
  isRecent,
  isOverdue,
  matches,
  newProblems,
  bilanConfigFor,
  conclusionOf,
  parseBilans,
  doneIds,
  missingBilans,
  bilanReminder,
  type Bilan,
  type BilanConfig,
  idProblems,
  taskKey,
  parseRoadmap,
  parsePerso,
  setPerson,
  person,
  Person,
  parseTitles,
  addedOpenTasks,
  writesRoadmap,
  taskForSessionTitle,
  searchTasks,
  sessionTitleId,
  sessionTitleKind,
  sessionTitleIn,
  oneTaskStep,
  isLotSession,
  isMaestroSession,
  lotSessionIds,
  withSelfRow,
  sessionScanNote,
  lotTasksNote,
  otherTaskNote,
  problemsText,
  sourceFor,
  titlePrompt,
  todayOf,
  type SessionPrefs,
  type Source,
  type Task,
  zoneDrawn,
  zoneReady,
  zoneReload,
  zoneWatch,
  sessionPrefs,
  sessionPrefsText,
  sessionPrefsReminder,
  closingBlockGaps,
  STEP_LIST_MIN_TOOLS,
  stepListReminder,
  closingBlockReminder,
  isAbandoned,
  closeInTexts,
  abandonBilan,
  doneBilan,
  type CloseKind,
  bilanCsvRow,
  appendBilanCsv,
  utf8Base64,
  isInsideRelative,
  isAutoModeRefusal,
  viaClaudeNote,
  lotParentOf,
  lotProposalText,
  proposalSentNote,
  type LotProposal,
  applyPlan,
  stepBand,
  childAlerts,
  childAlertText,
  childrenOf,
  finishedCheck,
  isChildStep,
  liveQuestion,
  type ChildRelaunch,
  type ChildRow,
  type ChildStatus,
  type ChildStep,
  type FinishedFacts,
  BYPASS_MODE,
  withBypassClause,
  bypassCard,
  isModeRefusal,
  forbiddenGit,
  guardText,
  type GitHit,
  isToday,
  todaySections,
  isDueSoon,
  isToRelaunch,
  waitDays,
  matchesWho,
  peopleOf,
} from './parse'

const PANE = 'roadmap'
const BAR_HIT = 'bar-hit'
// Les zones de clic des lignes et des boutons dessinés : `press-<empreinte>`, et ce que chaque id déclenche,
// reposé à chaque dessin.
const PRESS = 'press-'
/** Lignes de texte que couvre la zone de clic d'un bouton dessiné de 32 px. */
const BUTTON_HIT_ROWS = 2
// Les zones de clic (régions Client) sont réservées à la légende, aux états et aux en-têtes de
// section, au plus ZONE_LIMIT par dessin, toujours les mêmes d'un dessin à l'autre. Monter plus de
// ~30 régions d'un coup (une par tâche, sections dépliées) faisait démonter toutes les régions par
// l'app (« flooded the page with messages », 2026-10-22, deux fois) et figeait le panneau. Les
// tâches et les tiers gardent leurs boutons : le texte se clique.
const ZONE_LIMIT = 26
/**
 * Lignes de tâches dessinées au plus par dessin, toutes sections ouvertes comprises : au-delà,
 * chaque section dit « Voir les N autres ». Une ligne pèse ~14 éléments et 1 à 3 Svg.
 */
const ROW_BUDGET = 40
/**
 * La clé d'une zone de clic : lettres, chiffres et tiret seulement. Un nom de section porte des
 * espaces, des accents ou des deux-points, et l'app de bureau a cessé de dessiner le panneau
 * quand ces clés ont rejoint la liste (la barre, à clé simple, se dessinait).
 */
function pressKey(id: string): string {
  return `${PRESS}${hashLabel(id)}`
}
// Les zones de clic de ce chargement du module : la relance quand leur cadre ne dit pas « prêt ».
const zones = zoneWatch()
// Où se pose chaque masque de coin, en cellules depuis les bords de la Box.
const CORNERS: [Corner, { top?: number; bottom?: number; left?: number; right?: number }][] = [
  ['tl', { top: 0, left: 0 }],
  ['tr', { top: 0, right: 0 }],
  ['bl', { bottom: 0, left: 0 }],
  ['br', { bottom: 0, right: 0 }],
]
const pressHandlers = new Map<string, () => void>()
// Ce que dit le détail quand la session est lancée ; il le dessine dans un encart.
const LAUNCHED = 'Session lancée : elle apparaît dans la barre latérale.'
// Quand l'app n'accepte qu'une proposition : la carte attend le clic de la personne.
const LAUNCHING = 'Lancement…'
const PROPOSED = 'Session proposée : clique « Start » sur sa carte dans la conversation pour la démarrer.'
// Le segment des faites ; « # » n'entre dans aucun nom d'axe.
const DONE_SEGMENT = '#faites'
// La largeur demandée à l'ouverture, en colonnes de la police mono de l'app (~7,8 px, estimé) :
// ~450 px (choix de Bertrand, 2026-10-22). Une demande : la largeur que la personne a tirée l'emporte.
const COLUMNS = 58
/** Toutes les 15 s, le dossier de la roadmap se recherche (un projet peut changer de source). */
const POLL_MS = 15_000
/**
 * Le pas de la minuterie : 3 s. À chaque pas, les sessions (liste de l'app et fiche de celle-ci) et
 * l'empreinte des fichiers se relisent (2026-10-27 : avant, toutes les 15 s, sauf 30 à 60 s après un
 * clic ; une session ouverte ailleurs attendait jusqu'à 15 s sa roue). Mesuré : ~230 ms la liste.
 */
const TICK_MS = 3_000
const BATCH = 30
// Titres de Sonnet : une clé neuve les régénère tous une fois, ceux de Haiku restent ignorés.
const STORE_KEY = 'titles-sonnet'
// L'outil de l'app de bureau qui démarre une session à part.
const START_SESSION_TOOL = 'mcp__ccd_session__start_session'
/** Le message d'une session à une autre : la proposition d'une sous-session part à son Lot. */
const SEND_MESSAGE_TOOL = 'mcp__ccd_session_mgmt__send_message'
/** Les propositions gardées pour leur Lot quand le message direct est refusé (#67). */
const PROPOSALS_KEY = 'lot-proposals'
/** Une proposition gardée plus d'une semaine sans que son Lot reprenne la main : retirée. */
const PROPOSAL_MAX_MS = 7 * 86_400_000
/** Les outils d'où un enfant tire son état (#84) : sa liste d'étapes, sa question, son récap. */
const UPDATE_PLAN_TOOL = 'mcp__ccd_turn__update_plan'
const WRAP_UP_TOOL = 'mcp__ccd_turn__wrap_up' // aussi le texte de la boîte, pour le rappel d'une idée sans ligne (#83)
const ASK_TOOL = 'AskUserQuestion'
/** La note d'un enfant (`ChildStatus`), une clé par session : deux enfants n'écrasent pas la note l'un de l'autre. */
const CHILD_STATUS_PREFIX = 'child-status:'
/** Les relances faites par un parent : enfant → `lastActivityAt` de l'attente relancée. */
const CHILD_ALERTED_PREFIX = 'child-alerted:'
/**
 * Une note d'enfant, ou des relances, sans nouvelle depuis 30 jours sortent du store, comme
 * `maestro-sessions` (#90) : un enfant fini qui attend Bertrand une semaine garde sa note.
 */
const CHILD_NOTE_MAX_MS = 30 * 86_400_000
/** Les sessions où Bertrand a dit « Maestro » : elles coordonnent ce qu'elles lancent (#71). */
const MAESTROS_KEY = 'maestro-sessions'
/** Une marque sans nouveau « Maestro » depuis 30 jours tombe. */
const MAESTRO_MARK_MS = 30 * 86_400_000
/** Les efforts que l'outil de lancement accepte ; « hérite » (ou toute autre valeur) n'en passe pas. */
const LAUNCH_EFFORTS = new Set(['low', 'medium', 'high', 'xhigh', 'max'])
/**
 * Le dernier refus du mode auto : la carte posée par le panneau est refusée à chaque fois tant que
 * la session reste en mode auto. Pendant cette fenêtre, le lancement passe droit par Claude, sans
 * deux appels perdus (2026-10-27) ; passé ce délai, le panneau réessaie (le mode a pu changer).
 */
let autoModeRefusal: { at: number; text: string } | undefined
const AUTO_MODE_SKIP_MS = 30 * 60_000
// Celui qui montre un fichier dans le panneau Fichiers.
const SHOW_PANE_TOOL = 'mcp__ccd_view__show_pane'
// Ceux qui lisent la fiche d'une session et la montrent.
const GET_SESSION_TOOL = 'mcp__ccd_session_mgmt__get_session'
const OPEN_SESSION_TOOL = 'mcp__ccd_window__open_session_in'
const ARCHIVE_SESSION_TOOL = 'mcp__ccd_session_mgmt__archive_session'
/** Lignes de tâches faites qui portent les boutons de leur session (2 zones de clic chacune). */
const SESSION_ROWS = 4
// Celui qui liste les autres sessions de l'app.
const LIST_SESSIONS_TOOL = 'mcp__ccd_session_mgmt__list_sessions'
// Les sessions lancées depuis le panneau, gardées entre les sessions par empreinte du libellé.
const LIVE_KEY = 'live-sessions'
// Une session suivie au plus 7 jours ; sans fiche lisible, 12 heures.
const LIVE_MAX_MS = 7 * 86_400_000
const UNKNOWN_MAX_MS = 12 * 3_600_000

/**
 * L'état qu'un clic change, en une seule valeur : filtres, sections, tâche choisie, lancement.
 * Un clic l'écrit une fois (`setView`). En valeurs séparées, un clic en écrivait jusqu'à cinq, l'une
 * après l'autre, et l'app dessinait deux ou trois fois, la première avec un état à moitié écrit
 * (relevés du 2026-10-23 : l'ancienne vue revenait le temps d'un dessin).
 */
const VIEW: View = {
  axis: 'all',
  // `auto` : en mode Projet, Ma journée (#99) ; sinon les tâches en cours s'il y en a, sinon toutes ; un clic sur un filtre le remplace.
  attend: 'auto',
  who: 'all',
  showDone: false,
  // `auto` : les ouvertes par sujet, les faites par jour ; un clic sur « Par jour / Par sujet » vaut pour toutes les vues.
  groupBy: 'auto',
  selected: '',
  openGroups: [],
  closedGroups: [],
  moreGroups: [],
  launchNote: '',
  launched: [],
  openNote: '',
  conclusionOpen: '',
  cancelAsk: '',
  closeKind: 'abandon',
  cancelNote: '',
}
const viewAtom = atom({ plugin: 'roadmap', key: 'view' } as const, VIEW)
const searchAtom = atom({ plugin: 'roadmap', key: 'search' } as const, '')
/** Au plus tant de résultats de recherche affichés : au-delà, le dessin alourdit le panneau. */
const SEARCH_MAX = 40
const stampAtom = atom({ plugin: 'roadmap', key: 'stamp' } as const, 0)
const titlesVersionAtom = atom({ plugin: 'roadmap', key: 'titlesVersion' } as const, 0)
const titleNoteAtom = atom({ plugin: 'roadmap', key: 'titleNote' } as const, '')
const themeStampAtom = atom({ plugin: 'roadmap', key: 'themeStamp' } as const, 0)
const liveVersionAtom = atom({ plugin: 'roadmap', key: 'liveVersion' } as const, 0)
const retryAtom = atom({ plugin: 'roadmap', key: 'retry' } as const, 0)
const zoneGenAtom = atom({ plugin: 'roadmap', key: 'zoneGen' } as const, 0)
/** Pourquoi les autres sessions manquent (liste refusée ou illisible) ; vide quand elle se lit. */
const scanNoteAtom = atom({ plugin: 'roadmap', key: 'scanNote' } as const, '')
/** La liste d'étapes de la session, dessinée dans la bande au-dessus de la saisie (#104). */
const stepsAtom = atom({ plugin: 'roadmap', key: 'steps' } as const, [] as ChildStep[])

/**
 * Change l'état d'un clic en une écriture : `patch` dit les champs qui changent, d'après l'état
 * courant. Rien ne change vraiment : aucune écriture, donc aucun dessin.
 */
async function setView($: EngineInterface, patch: (v: View) => Partial<View>): Promise<void> {
  const same = (v: View, p: Partial<View>) =>
    (Object.keys(p) as (keyof View)[]).every(k => JSON.stringify(p[k]) === JSON.stringify(v[k]))
  const current = await read($, viewAtom)
  if (same(current, patch(current))) return
  await update($, viewAtom, v => ({ ...v, ...patch(v) }))
}

/** Un dessin à l'opacité 0,4 : une ligne estompée sous un filtre. */
const faint = memo((source: string): string => source.replace('<svg ', '<svg opacity="0.4" '))

function axisCount(tasks: Task[], axis: string): number {
  return tasks.filter(t => t.axis === axis).length
}

/** Les réglages du plugin (userConfig), relus à chaque chargement du module. */
let settings = { me: [] as string[], autoOpen: true, titleModel: 'sonnet', capture: true, theme: 'auto', launchEffort: 'high', launchBypass: false }

/**
 * La palette du panneau. Le mod ne reçoit pas l'apparence de l'app : il lit le thème de Claude
 * Code dans la configuration, et le réglage « Thème du panneau » l'impose quand ce thème ment.
 */
async function paletteOf($: EngineInterface): Promise<Palette> {
  let configured: unknown
  if (settings.theme === 'auto') {
    try {
      configured = (await $.config.list()).find(row => row.key === 'theme')?.value
    } catch {
      // configuration illisible : le sombre par défaut
    }
  }
  return PALETTES[resolveTheme(settings.theme, configured)]
}

/**
 * La capture des tasks, pour la session : la roadmap telle qu'au début de la session et telle que
 * vue à la dernière écriture, et ce que le tour en cours a modifié. Remise à zéro à chaque
 * rechargement du module, comme ses autres variables.
 */
type Capture = {
  source: Source
  /** Dossiers dont une écriture compte comme du travail sur le projet. */
  roots: string[]
  atStart: string
  seen: { open?: string; done?: string }
  wroteThisTurn: boolean
  gitAtTurn?: string
  /** Les tâches dont l'archivage de la session a déjà été proposé : une fois par tâche. */
  archiveAsked: Set<string>
  /** Les tâches dont le rangement a été rappelé avant l'archivage (#101) : une fois par tâche. */
  rangementAsked: Set<string>
  /** La ligne de rangement du projet vue dans une réponse de la session (#101 ; perdu au rechargement du module). */
  rangeSeen: boolean
  /** HEAD au début du tour : les commits du tour se lisent depuis lui. */
  headAtTurn?: string
  /** Une skill de méthode superpowers lancée dans la session (perdu au rechargement du module). */
  methodUsed: boolean
  /** `swiftui-pro` lancée dans la session (perdu au rechargement du module). */
  swiftUIUsed: boolean
  /** Une maquette montrée dans la session (#96 ; perdu au rechargement du module). */
  mockupShown: boolean
  /** Les HEAD dont le rappel de méthode a déjà été donné : une fois par commit. */
  methodAsked: Set<string>
  /** La roadmap au début du tour : une idée à coder n'appelle sa ligne que si elle n'a pas bougé (#83). */
  roadmapAtTurn?: string
  /** Une carte de session posée pendant le tour (`start_session` sans erreur). */
  cardThisTurn: boolean
  /** Le texte de la boîte de fin du tour : récap, question, boutons. */
  boxThisTurn: string
}
let capture: Capture | undefined

async function readOr($: EngineInterface, path: string): Promise<string | undefined> {
  try {
    return await $.fs.read(path)
  } catch {
    return undefined
  }
}

async function roadmapNow($: EngineInterface, source: Source): Promise<{ open?: string; done?: string }> {
  const { open, done } = files(source)
  return { open: await readOr($, open), done: await readOr($, done) }
}

const joined = (r: { open?: string; done?: string }) => `${r.open ?? ''}\u0000${r.done ?? ''}`

async function startCapture($: EngineInterface, source: Source): Promise<void> {
  const cwd = await $.session.cwd()
  const root = await $.session.root()
  const now = await roadmapNow($, source)
  capture = {
    source,
    roots: [...new Set([cwd, root, mainCheckout(root), source.dir])].map(r => r.replace(/\/+$/, '')),
    atStart: joined(now),
    seen: now,
    wroteThisTurn: false,
    archiveAsked: new Set(),
    rangementAsked: new Set(),
    rangeSeen: false,
    methodUsed: false,
    swiftUIUsed: false,
    mockupShown: false,
    methodAsked: new Set(),
    cardThisTurn: false,
    boxThisTurn: '',
  }
}

const inProject = (c: Capture, path: string) => c.roots.some(r => path === r || path.startsWith(`${r}/`))

/** HEAD et fichiers modifiés du dépôt de la session ; hors dépôt git, rien. */
async function gitState($: EngineInterface): Promise<string | undefined> {
  try {
    const root = await $.session.root()
    const head = await $.process.run(['git', '-C', root, 'rev-parse', 'HEAD'])
    if (head.exitCode !== 0) return undefined
    const status = await $.process.run(['git', '-C', root, 'status', '--porcelain'])
    return status.exitCode === 0 ? `${head.stdout}${status.stdout}` : undefined
  } catch {
    return undefined
  }
}

/** Le dossier est-il dans un dépôt git ? (« Vérifier » en mode Projet, #76.) */
async function isGitDir($: EngineInterface, dir: string): Promise<boolean> {
  try {
    return (await $.process.run(['git', '-C', dir, 'rev-parse', '--git-dir'])).exitCode === 0
  } catch {
    return false
  }
}

/** HEAD du dépôt de la session ; hors dépôt git, rien. */
async function gitHead($: EngineInterface): Promise<string | undefined> {
  try {
    const head = await $.process.run(['git', '-C', await $.session.root(), 'rev-parse', 'HEAD'])
    return head.exitCode === 0 ? head.stdout.trim() : undefined
  } catch {
    return undefined
  }
}

/**
 * Le rappel de méthode, en fin de tour : le tour a enregistré des commits (les siens, chaîne
 * principale, sans les merges qui apportent le travail des autres) qui touchent du code sans
 * fichier de test, ou la session n'a lancé aucune skill de méthode, ou des fichiers Swift sans
 * `swiftui-pro`. Une fois par HEAD.
 */
async function methodNote($: EngineInterface, c: Capture): Promise<string | undefined> {
  // Mode Projet (#76) : pas de code, pas de rappel de méthode de code.
  if (projectSettings(c.source).mode === 'projet') return undefined
  const before = c.headAtTurn
  if (before === undefined) return undefined
  const now = await gitHead($)
  if (now === undefined || now === before || c.methodAsked.has(now)) return undefined
  const log = await $.process.run(['git', '-C', await $.session.root(), 'log', '--first-parent', '--no-merges', '--format=', '--name-only', `${before}..${now}`])
  if (log.exitCode !== 0) return undefined
  const files = [...new Set(log.stdout.split('\n').map(l => l.trim()).filter(l => l !== ''))]
  const code = files.some(f => codeWithoutTests([f]) !== undefined)
  // #96 : de l'interface créée ou très modifiée, sans aucune maquette montrée dans la session.
  const unmocked = c.mockupShown ? undefined : await uiToMock($, before, now)
  if (!code && !unmocked) return undefined
  const note = methodReminder(codeWithoutTests(files), code && !c.methodUsed, c.swiftUIUsed ? undefined : swiftUIFiles(files), unmocked)
  if (note) c.methodAsked.add(now)
  return note
}

/** Les fichiers d'interface créés ou très modifiés par les commits du tour (#96). */
async function uiToMock($: EngineInterface, before: string, now: string): Promise<string[] | undefined> {
  const stat = await $.process.run(['git', '-C', await $.session.root(), 'log', '--first-parent', '--no-merges', '--numstat', '--summary', '--format=', `${before}..${now}`])
  return stat.exitCode === 0 ? uiFilesToMock(stat.stdout) : undefined
}

/** Le rappel de roadmap de fin de tour : bilan manquant, archivage, ou task non inscrite ; rien sinon. */
async function roadmapBlock($: EngineInterface, c: Capture): Promise<string | undefined> {
  const now = await roadmapNow($, c.source)
  if (joined(now) !== c.atStart) {
    // La roadmap a bougé : une task cochée pendant la session sans son bilan ne passe pas.
    const atStartDone = c.atStart.split('\u0000')[1] ?? ''
    const bilan = await bilanNote($, c.source, atStartDone, now.done)
    if (bilan) return bilan
    // Bilan en place : la tâche de la session, cochée pendant la session, appelle l'archivage.
    const own = await readOwnSession($)
    const id = sessionTitleId(own.title)
    if (id === undefined || c.archiveAsked.has(id) || !doneIds(now.done).has(id) || doneIds(atStartDone).has(id)) return undefined
    // Un Lot coche les lignes de ses tâches : le numéro de son titre n'est pas son chantier.
    if (await ownIsLot($, own)) return undefined
    // Un projet qui range sa mémoire en fin de sujet (#101) : pas d'archivage avant la ligne de rangement.
    const r = c.source.rangement
    if (r && !c.rangeSeen) {
      if (c.rangementAsked.has(id)) return undefined
      c.rangementAsked.add(id)
      return rangementReminder(id, r)
    }
    c.archiveAsked.add(id)
    return archiveReminder(id)
  }
  const git = c.gitAtTurn === undefined ? undefined : await gitState($)
  const changed = c.wroteThisTurn || (git !== undefined && git !== c.gitAtTurn)
  return changed ? captureReminder(c.source) : undefined
}

/**
 * Le rappel d'une idée à coder restée sans ligne (#83) : la dernière réponse ou la boîte de fin
 * propose une chose à construire, et ni la roadmap ni une carte de session n'ont bougé pendant le tour.
 */
async function ideaNote($: EngineInterface, c: Capture, last: string | undefined): Promise<string | undefined> {
  if (c.cardThisTurn || c.roadmapAtTurn === undefined) return undefined
  const phrase = ideaOffer(`${last ?? ''}\n\n${c.boxThisTurn}`)
  if (phrase === undefined) return undefined
  if (joined(await roadmapNow($, c.source)) !== c.roadmapAtTurn) return undefined
  return ideaReminder(c.source, phrase)
}

/** Ce que dit une boîte de fin : récap, question, boutons. */
function boxText(e: unknown): string {
  const box = e as { recap?: unknown; ask?: unknown; actions?: unknown }
  const actions = Array.isArray(box.actions) ? (box.actions as { label?: unknown; message?: unknown }[]) : []
  const texts = [box.recap, box.ask, ...actions.flatMap(a => [a?.label, a?.message])]
  return texts.filter((t): t is string => typeof t === 'string').join('\n')
}

/** Ce que dit la boîte de fin du tour, gardé pour le rappel d'une idée sans ligne. */
function noteBox(e: unknown): void {
  if (capture) capture.boxThisTurn = boxText(e)
}

/**
 * Le tour en cours de cette session, pour le bloc de fin de tour (#85) : hors de `Capture`, il vaut
 * dans tout projet, roadmap ou non. Un tour de travail a appelé la boîte de fin ou la liste d'étapes.
 */
let closingTurn = { work: false, box: '' }

/**
 * Le rappel du bloc de fin de tour : mode ADHD, tour de travail, une ligne ou le bouton d'archivage
 * manquant. Rangement en attente (#101) : le bouton d'archivage ne se réclame pas.
 */
async function closingNote($: EngineInterface, last: string | undefined, rangementPending = false): Promise<string | undefined> {
  if (!closingTurn.work) return undefined
  if (!(await readSessionPrefs($)).prefs.adhd) return undefined
  const gaps = closingBlockGaps(last, closingTurn.box).filter(g => !(rangementPending && g === 'archiver'))
  return gaps.length === 0 ? undefined : closingBlockReminder(gaps)
}

/** Une tâche de la session dont le rangement a été rappelé et dont l'archivage attend encore (#101). */
const rangementWaiting = (c: Capture) => (c.rangeSeen ? undefined : [...c.rangementAsked].find(id => !c.archiveAsked.has(id)))

/**
 * La ligne de rangement du projet dans la réponse ou la boîte de fin du tour (#101). Écrite au
 * deuxième arrêt du tour, à la demande du rappel : l'archivage se propose aussitôt, sans attendre
 * le tour suivant.
 */
function rangementNote(c: Capture | undefined, last: string | undefined, active: boolean): string | undefined {
  const r = c?.source.rangement
  if (!c || !r || c.rangeSeen) return undefined
  const waiting = rangementWaiting(c)
  if (!rangementSeen(`${last ?? ''}\n${closingTurn.box}`, r)) return undefined
  c.rangeSeen = true
  if (!active || waiting === undefined) return undefined
  c.archiveAsked.add(waiting)
  return archiveReminder(waiting)
}

/**
 * La liste d'étapes de la session, pour son rappel (#98, partout depuis #104) : posée une fois (crochet
 * `update_plan` des nouvelles des enfants, #84), et les outils du tour en cours, ceux de la session seule.
 */
let stepList = { planned: false, tools: 0 }

/** Le rappel de la liste d'étapes : tour de travail, aucune liste posée dans la session, dans tout projet (#104). */
function stepListNote(): string | undefined {
  return stepList.planned || stepList.tools < STEP_LIST_MIN_TOOLS ? undefined : stepListReminder()
}

type BilanData = { config: BilanConfig; bilans: Map<string, Bilan>; viaCowork: boolean }

/**
 * Le bilan de clôture de la roadmap : sa configuration (cowork.json « bilan », sinon le journal par
 * défaut), les bilans déjà écrits, et si `_cowork/cowork.py` est là pour les écrire.
 */
async function loadBilan($: EngineInterface, source: Source): Promise<BilanData> {
  const [cow, tool] = await Promise.all([
    readOr($, `${source.dir}/cowork.json`),
    $.fs.exists(`${source.dir}/_cowork/cowork.py`).catch(() => false),
  ])
  const config = bilanConfigFor(cow)
  return { config, bilans: parseBilans((await readOr($, `${source.dir}/${config.log}`)) ?? ''), viaCowork: tool }
}

/** Les tasks cochées depuis `before` (texte de ROADMAP-fait.md) qui n'ont pas leur bilan : le rappel, ou rien. */
async function bilanNote($: EngineInterface, source: Source, before: string | undefined, after: string | undefined): Promise<string | undefined> {
  if (after === undefined || after === before) return undefined
  const b = await loadBilan($, source)
  const missing = missingBilans(after, doneIds(before), b.bilans, b.config)
  return missing.length > 0 ? bilanReminder(source, b.config, missing, b.viaCowork) : undefined
}

/**
 * Après une écriture : contrôle les lignes de la roadmap qui ont changé depuis la dernière vue.
 * `before`, la roadmap relue juste avant l'outil (juste après un Bash qui ne l'écrit pas, #89) :
 * seules les tâches que lui a ajoutées sont à la session, pas celles qu'une autre session a écrites
 * depuis sa dernière écriture (#70).
 */
async function checkRoadmap($: EngineInterface, c: Capture, before?: { open?: string }): Promise<string[]> {
  const now = await roadmapNow($, c.source)
  const ids = idProblems(now.open, now.done)
  const notes: string[] = []
  for (const [key, file, done] of [['open', 'ROADMAP.md', false], ['done', 'ROADMAP-fait.md', true]] as const) {
    const after = now[key]
    if (after === undefined || after === c.seen[key]) continue
    const old = new Set((c.seen[key] ?? '').split('\n').map(l => l.replace(/\r$/, '')))
    const { requis, requiredOn, cles } = projectSettings(c.source)
    const problems = [...newProblems(c.seen[key], after, done, { requis, requiredOn, cles }), ...ids[key].filter(p => !old.has(p.text))]
    if (problems.length > 0) notes.push(problemsText(file, problems))
    if (!done) {
      const step = await markWorking($, c.source, addedOpenTasks((before ?? c.seen).open, after))
      if (step) notes.push(step)
    }
  }
  const bilan = await bilanNote($, c.source, c.seen.done, now.done)
  if (bilan) notes.push(bilan)
  c.seen = now
  return notes
}

/** Ce qu'une écriture réussie ajoute pour le modèle : les erreurs de grammaire de la roadmap. */
async function afterWrite(
  $: EngineInterface,
  ran: ToolCallResult,
  path: string | undefined,
  before?: { open?: string },
): Promise<ToolCallResult> {
  if (!settings.capture || !capture || ran.deny !== undefined || ran.isError === true) return ran
  try {
    if (path !== undefined && inProject(capture, path)) capture.wroteThisTurn = true
    const notes = await checkRoadmap($, capture, before)
    // Une roadmap écrite se voit tout de suite, sans attendre la relecture de 15 s.
    void restamp($, capture.source).catch(() => undefined)
    return notes.length > 0 ? { ...ran, context: [...(ran.context ?? []), ...notes] } : ran
  } catch {
    // L'outil a déjà tourné : son résultat passe tel quel, le contrôle seul est perdu.
    return ran
  }
}

/**
 * Un outil qui peut écrire : la roadmap relue juste avant lui, puis contrôlée après (#70).
 * `own` faux, l'outil n'écrit pas la roadmap (un Bash qui ne la nomme pas) : elle se relit après
 * lui, et une ligne apparue pendant qu'il tournait reste à la session qui l'a écrite (#89).
 */
async function written($: EngineInterface, run: () => Promise<ToolCallResult>, path: string | undefined, own = true): Promise<ToolCallResult> {
  const reread = async () => (settings.capture && capture ? await roadmapNow($, capture.source) : undefined)
  const before = own ? await reread() : undefined
  const ran = await run()
  // Une commande en lecture seule n'écrit rien : rien à relire.
  return ran.isReadOnly === true ? ran : afterWrite($, ran, path, own ? before : await reread())
}

/**
 * Garde-fou du dossier principal (#87, Bertrand, 2026-10-28) : en bypass, plus rien ne demande la
 * permission, et les règles du dossier principal partagé ne tenaient plus que par les consignes. Le
 * plugin refuse donc lui-même, dans tous les modes, les commandes git qu'elles y interdisent. Une
 * commande sans git interdit ne coûte aucun appel ; un dépôt sans autre worktree garde son git libre.
 */
async function guardBash($: EngineInterface, command: unknown): Promise<string | undefined> {
  if (typeof command !== 'string' || !command.includes('git')) return undefined
  let hits: GitHit[]
  try {
    hits = forbiddenGit(command, await $.session.cwd(), (await $.env.get('HOME')) ?? '')
  } catch {
    return undefined
  }
  for (const hit of hits) {
    const repo = /[$`]/.test(hit.dir) ? undefined : await repoOf($, hit.dir)
    if (repo) {
      if (repo.shared && (hit.anywhere || repo.top === repo.main)) return guardText(hit, repo.main)
      continue
    }
    // Un dossier qu'on ne sait pas lire (variable, hors dépôt) : refusé si le dépôt de la session
    // est partagé, plutôt que laissé passer (relecture de sécurité du 2026-10-29).
    const own = await repoOf($, await $.session.cwd())
    if (own?.shared) return guardText(hit, own.main)
  }
  return undefined
}

/**
 * Le dépôt de `dir` : son dossier principal (le premier de `git worktree list`), le haut de la copie
 * où se trouve `dir`, et s'il est partagé (au moins deux worktrees) ; hors dépôt, rien.
 */
async function repoOf($: EngineInterface, dir: string): Promise<{ main: string; top: string; shared: boolean } | undefined> {
  try {
    const list = await $.process.run(['git', '-C', dir, 'worktree', 'list', '--porcelain'])
    if (list.exitCode !== 0) return undefined
    const trees = list.stdout.split('\n').filter(l => l.startsWith('worktree ')).map(l => l.slice('worktree '.length))
    if (trees.length === 0) return undefined
    const top = await $.process.run(['git', '-C', dir, 'rev-parse', '--show-toplevel'])
    return top.exitCode === 0 ? { main: trees[0]!, top: top.stdout.trim(), shared: trees.length >= 2 } : undefined
  } catch {
    return undefined
  }
}

/**
 * La roadmap du projet de la session, dans cet ordre :
 * 1. `.claude/roadmap.json` du projet (ou de son dossier principal, pour un worktree) ;
 * 2. une source déclarée dans le fichier local de la personne, `~/.claude/roadmap-perso.json` (#79) ;
 * 3. un `ROADMAP.md` à la racine du dossier principal du projet, puis du worktree.
 * Rien de tout ça : pas de panneau.
 */
async function currentSource($: EngineInterface): Promise<Source | undefined> {
  try {
    const cwd = await $.session.cwd()
    const root = await $.session.root()
    const bases = [...new Set([mainCheckout(root), root])]
    const perso = await readPerso($)
    const defaults = { name: baseName(mainCheckout(root)), me: settings.me.length > 0 ? settings.me : perso.me }

    for (const base of bases) {
      const path = `${base}/.claude/roadmap.json`
      if (await $.fs.exists(path)) {
        const found = parseProjectConfig(await $.fs.read(path), base, defaults)
        if (found) return found
      }
    }

    const known = sourceFor(perso.sources, cwd) ?? sourceFor(perso.sources, root)
    if (known) return known

    for (const base of bases) {
      if (await $.fs.exists(`${base}/ROADMAP.md`)) return { ...defaults, match: [base], dir: base, subjects: [] }
    }
    return undefined
  } catch {
    return undefined
  }
}

function files(source: Source): { open: string; done: string } {
  return { open: `${source.dir}/ROADMAP.md`, done: `${source.dir}/ROADMAP-fait.md` }
}

async function stampOf($: EngineInterface, source: Source): Promise<number> {
  let sum = 0
  const { open, done } = files(source)
  // Le log des bilans aussi : un bilan écrit redessine le détail de sa task.
  const bilanLog = bilanConfigFor(await readOr($, `${source.dir}/cowork.json`)).log
  for (const path of [open, done, `${source.dir}/${bilanLog}`]) {
    try {
      sum += (await $.fs.stat(path)).mtimeMs
    } catch {
      // fichier absent : le panneau le dira au rendu
    }
  }
  return sum
}

async function load($: EngineInterface, path: string, file: string): Promise<Task[] | string> {
  try {
    return parseRoadmap(await $.fs.read(path), file)
  } catch (err) {
    return err instanceof Error ? err.message : String(err)
  }
}

async function loadTitles($: EngineInterface): Promise<Record<string, ShortTitle>> {
  const stored = await $.store.get(STORE_KEY)
  return typeof stored === 'object' && stored !== null ? (stored as Record<string, ShortTitle>) : {}
}

let summarizing = false

/** Demande au modèle un titre court et un sujet pour chaque libellé jamais vu, puis les garde. */
async function summarize($: EngineInterface, source: Source): Promise<void> {
  if (summarizing) return
  summarizing = true
  try {
    const { open, done } = files(source)
    const openTasks = await load($, open, 'ROADMAP.md')
    const doneTasks = await load($, done, 'ROADMAP-fait.md')
    const tasks = [
      ...(typeof openTasks === 'string' ? [] : openTasks.filter(t => !t.done)),
      // Toutes les faites : elles se rangent par sujet et se cherchent par leur titre court.
      ...(typeof doneTasks === 'string' ? [] : doneTasks.filter(t => t.done)),
    ]
    const titles = await loadTitles($)
    const missing = new Map<string, string>()
    for (const t of tasks) {
      const id = hashLabel(t.label)
      if (!titles[id]) missing.set(id, t.label)
    }
    const items = [...missing].map(([id, label]) => ({ id, label }))
    for (let i = 0; i < items.length; i += BATCH) {
      const reply = await $.model.complete({
        model: settings.titleModel,
        prompt: titlePrompt(items.slice(i, i + BATCH), source.subjects),
        maxTokens: 4000,
      })
      if (!reply.isAnswered) {
        await update($, titleNoteAtom, () => `Titres courts indisponibles (${reply.reason}).`)
        return
      }
      Object.assign(titles, parseTitles(reply.text, source.subjects))
      await $.store.set(STORE_KEY, titles)
      await update($, titlesVersionAtom, v => v + 1)
    }
    await update($, titleNoteAtom, () => '')
  } catch (err) {
    await update($, titleNoteAtom, () =>
      `Titres courts indisponibles (${err instanceof Error ? err.message : String(err)}).`,
    )
  } finally {
    summarizing = false
  }
}

type LiveState = 'open' | 'closed' | 'unknown'

async function loadLive($: EngineInterface): Promise<Record<string, LiveEntry>> {
  const stored = await $.store.get(LIVE_KEY)
  if (typeof stored !== 'object' || stored === null) return {}
  // Seules les entrées bien formées comptent : une valeur abîmée ne met aucune tâche en session.
  const out: Record<string, LiveEntry> = {}
  for (const [hash, value] of Object.entries(stored as Record<string, unknown>)) {
    const v = value as Partial<LiveEntry> | null
    if (v && typeof v.startedAt === 'number' && typeof v.title === 'string') {
      out[hash] = {
        startedAt: v.startedAt,
        title: v.title,
        ...(typeof v.sessionId === 'string' ? { sessionId: v.sessionId } : {}),
        ...(typeof v.link === 'string' ? { link: v.link } : {}),
        ...(v.via === 'write' ? { via: 'write' as const } : {}),
      }
    }
  }
  return out
}

/** L'état de chaque session suivie, relu toutes les 15 s ; vide au chargement du module. */
const liveStatus = new Map<string, LiveState>()
/** Une lecture de fiche refusée (réglage de permissions) : plus de sondage pour cette session. */
let probeDenied = false

/** Ce qu'on sait d'une session par la liste ou sa fiche : ouverte ou close, si elle tourne, son lien. */
type SessionSeen = { state: LiveState; running?: boolean; link?: string }

/** Lit l'état d'une session dans sa fiche ou dans une rangée de la liste. */
function seenIn(data: unknown): SessionSeen {
  const d = (data ?? {}) as { isArchived?: unknown; isRunning?: unknown; link?: unknown }
  return {
    state: d.isArchived === true ? 'closed' : d.isArchived === false ? 'open' : 'unknown',
    ...(typeof d.isRunning === 'boolean' ? { running: d.isRunning } : {}),
    ...(typeof d.link === 'string' ? { link: d.link } : {}),
  }
}

/** Les sessions vues dans la dernière liste de l'app (`list_sessions`) : leur fiche ne se relit pas. */
let listed = new Map<string, SessionSeen>()
/** Les appels d'outil de la relecture en cours, pour son relevé. */
let toolCalls = 0

/**
 * Relit l'état de chaque session lancée depuis le panneau : ouverte tant qu'elle n'est pas
 * archivée. Une session archivée, introuvable ou trop vieille cesse d'être suivie.
 *
 * La liste de l'app, lue juste avant (`matchSessions`), dit déjà l'état des 40 dernières sessions ;
 * seules les autres se relisent par leur fiche, une lecture par session, toutes en même temps
 * (2026-10-23 : 11 fiches lues l'une après l'autre, dont 5 en double et 9 déjà dans la liste).
 */
async function probeLive($: EngineInterface): Promise<void> {
  const live = await loadLive($)
  const entries = Object.entries(live)
  if (entries.length === 0) return
  const now = await $.clock.now()
  const toRead = new Set<string>()
  for (const [, entry] of entries) {
    if (entry.sessionId && now - entry.startedAt <= LIVE_MAX_MS && !listed.has(entry.sessionId)) toRead.add(entry.sessionId)
  }
  const cards = new Map<string, SessionSeen>()
  if (!probeDenied) {
    await Promise.all([...toRead].map(async sessionId => {
      try {
        toolCalls++
        const ran = await $.tool.call({ tool: GET_SESSION_TOOL, session_id: sessionId })
        if (ran.deny !== undefined) probeDenied = true
        else if (ran.isError) cards.set(sessionId, { state: 'closed' })
        else {
          let data: unknown
          try {
            data = JSON.parse(ran.text ?? '')
          } catch {
            // réponse qui n'est pas la fiche attendue : état inconnu
          }
          cards.set(sessionId, seenIn(data))
        }
      } catch {
        // outil absent (terminal, autre hôte) : état inconnu
      }
    }))
  }
  let changed = false
  let pruned = false
  for (const [hash, entry] of entries) {
    let state: LiveState = 'unknown'
    if (now - entry.startedAt > LIVE_MAX_MS) state = 'closed'
    else if (entry.sessionId) {
      const seen = listed.get(entry.sessionId) ?? cards.get(entry.sessionId)
      if (seen) {
        state = seen.state
        if (seen.running !== undefined && runningBySession.get(entry.sessionId) !== seen.running) {
          runningBySession.set(entry.sessionId, seen.running)
          changed = true
        }
        if (seen.link && seen.link !== entry.link && state !== 'closed') {
          live[hash] = { ...entry, link: seen.link }
          pruned = true
        }
      }
    }
    if (state === 'closed') {
      delete live[hash]
      pruned = true
    }
    if (liveStatus.get(hash) !== state) {
      liveStatus.set(hash, state)
      changed = true
    }
  }
  if (pruned) await $.store.set(LIVE_KEY, live)
  if (changed || pruned) await update($, liveVersionAtom, v => v + 1)
}

/**
 * Cette session dans l'app : son identifiant (`local_…`) et son titre, lus sur sa fiche. `fresh` la
 * relit : Bertrand peut la nommer après le chargement du panneau (« Lot #1 »).
 */
let ownSession: { id: string | undefined; title: string } | null = null

async function readOwnSession($: EngineInterface, fresh = false): Promise<{ id: string | undefined; title: string }> {
  if (ownSession !== null && !fresh) return ownSession
  try {
    const ran = await $.tool.call({ tool: GET_SESSION_TOOL, session_id: 'self' })
    const text = ran.deny === undefined && !ran.isError ? (ran.text ?? '') : ''
    ownSession = { id: sessionIdIn(text), title: sessionTitleIn(text) }
  } catch {
    ownSession = { id: undefined, title: '' }
  }
  return ownSession
}

async function ownAppSession($: EngineInterface): Promise<string | undefined> {
  return (await readOwnSession($)).id
}

/**
 * Cette session coordonne-t-elle un Lot ? Son titre (« Lot … »), sinon sa famille : au moins deux
 * sessions qu'elle a lancées encore ouvertes (`lotSessionIds`). La liste se relit à la demande —
 * une ligne ouverte, une fin de tour qui cocherait sa tâche, un ▶ — et une liste refusée ou
 * illisible laisse le titre seul juger.
 */
async function ownIsLot($: EngineInterface, own: { id: string | undefined; title: string }): Promise<boolean> {
  if (isLotSession(own.title) || isMaestroSession(own.title)) return true
  if (own.id && (await loadMaestros($))[own.id] !== undefined) return true
  if (!own.id || listDenied) return false
  try {
    toolCalls++
    const ran = await $.tool.call({ tool: LIST_SESSIONS_TOOL, limit: LIST_LIMIT })
    if (ran.deny !== undefined || ran.isError) return false
    const rows: unknown = JSON.parse(ran.text ?? '[]')
    return Array.isArray(rows) && lotSessionIds(rows).has(own.id)
  } catch {
    return false
  }
}

/** Les marques Maestro (identifiant → dernier « Maestro ») ; store illisible : aucune. */
async function loadMaestros($: EngineInterface): Promise<Record<string, number>> {
  try {
    const stored = await $.store.get(MAESTROS_KEY)
    if (typeof stored !== 'object' || stored === null || Array.isArray(stored)) return {}
    return Object.fromEntries(Object.entries(stored).filter((e): e is [string, number] => typeof e[1] === 'number'))
  } catch {
    return {}
  }
}

/**
 * Bertrand dit « Maestro » : la session coordonne ce qu'elle lance, même une seule session (#71).
 * Une session de tâche (« #12 · … ») qui demande l'état reste sur sa tâche ; les marques de plus de
 * 30 jours tombent à chaque écriture.
 */
async function markMaestro($: EngineInterface): Promise<void> {
  const own = await readOwnSession($, true)
  if (!own.id || sessionTitleId(own.title) !== undefined) return
  const now = await $.clock.now()
  const kept = Object.entries(await loadMaestros($)).filter(([, at]) => now - at <= MAESTRO_MARK_MS)
  await $.store.set(MAESTROS_KEY, { ...Object.fromEntries(kept), [own.id]: now })
}

/** Les propositions gardées pour les Lots ; seules les entrées bien formées comptent. */
async function loadProposals($: EngineInterface): Promise<LotProposal[]> {
  const stored = await $.store.get(PROPOSALS_KEY)
  if (!Array.isArray(stored)) return []
  return stored.filter((p): p is LotProposal => {
    const v = p as Partial<LotProposal> | null
    return !!v && typeof v.lot === 'string' && typeof v.from === 'string' && typeof v.title === 'string'
      && typeof v.prompt === 'string' && typeof v.at === 'number'
  })
}

/**
 * Bertrand ne pilote un lot que par le Lot (demande du 2026-10-27) : la carte New task que le modèle
 * pose dans une sous-session (`own_initiative`) resterait dans un transcript qu'il ne regarde pas.
 * Elle remonte donc au Lot, par message (il se réveille et la lit dans son transcript) ; un message
 * refusé la garde dans le store, et le Lot la reçoit à son prochain tour. Le modèle lit, à la place
 * de sa carte, qu'elle est au Lot. Tout le reste passe : `offer` et `user_asked` (Bertrand parle à
 * la sous-session), le ▶ du panneau, une session sans Lot, et toute panne. Le moteur ne fait pas
 * passer les `$.tool.call` du panneau par ses propres hooks (mesuré en test le 2026-10-28) :
 * l'origine vérifiée ici garde le ▶ si cela changeait.
 */
async function forwardProposal(
  $: EngineInterface,
  e: unknown,
  origin: string,
  pass: () => Promise<ToolCallResult>,
): Promise<ToolCallResult> {
  const card = e as { initiation?: unknown; title?: unknown; prompt?: unknown; background?: unknown }
  if (origin !== 'engine' || card.initiation !== 'own_initiative') return pass()
  if (typeof card.title !== 'string' || typeof card.prompt !== 'string') return pass()
  let lot: { id: string; title: string } | undefined
  let self: { sessionId?: unknown; title?: unknown } | undefined
  try {
    const selfRan = await $.tool.call({ tool: GET_SESSION_TOOL, session_id: 'self' })
    if (selfRan.deny !== undefined || selfRan.isError) return pass()
    self = JSON.parse(selfRan.text ?? '') as typeof self
    if (typeof (self as { parentSessionId?: unknown } | undefined)?.parentSessionId !== 'string') return pass()
    // Les archivées comprises : la remontée passe un parent archivé (#71).
    const listRan = await $.tool.call({ tool: LIST_SESSIONS_TOOL, linked: true, include_archived: true, limit: LIST_LIMIT })
    if (listRan.deny !== undefined || listRan.isError) return pass()
    const rows: unknown = JSON.parse(listRan.text ?? '[]')
    lot = lotParentOf(self, Array.isArray(rows) ? rows : [], new Set(Object.keys(await loadMaestros($))))
  } catch {
    return pass()
  }
  if (!lot || typeof self?.sessionId !== 'string') return pass()
  const proposal: LotProposal = {
    lot: lot.id,
    from: self.sessionId,
    fromTitle: typeof self.title === 'string' ? self.title : '',
    title: card.title,
    prompt: card.prompt,
    ...(typeof card.background === 'string' && card.background !== '' ? { background: card.background } : {}),
    at: await $.clock.now(),
  }
  const name = lot.title || 'Lot'
  try {
    const sent = await $.tool.call({ tool: SEND_MESSAGE_TOOL, session_id: lot.id, message: lotProposalText([proposal]) })
    if (sent.deny === undefined && !sent.isError) return { deny: proposalSentNote(name, card.title, 'message') }
  } catch {
    // outil absent : la proposition est gardée pour le Lot
  }
  try {
    await $.store.set(PROPOSALS_KEY, [...(await loadProposals($)), proposal])
    return { deny: proposalSentNote(name, card.title, 'store') }
  } catch {
    return pass()
  }
}

/**
 * Option « Lancer en bypass » (#87) : la carte que pose Claude (Maestro, Lot, repli du panneau)
 * demande le bypass et porte la consigne de relève. L'app n'accorde le bypass que depuis une session
 * déjà en bypass : refusée pour son mode, la carte repart sans lui, et la session lancée se relèvera
 * elle-même. Tout autre refus (Bertrand refuse la carte, le mode auto) revient tel quel : la carte
 * n'est pas reposée (relecture de sécurité du 2026-10-29).
 */
async function launchWithMode(e: unknown, post: (card: Record<string, unknown>) => Promise<ToolCallResult>): Promise<ToolCallResult> {
  const card = e as Record<string, unknown>
  const changed = settings.launchBypass ? bypassCard(card) : undefined
  if (!changed) return post(card)
  const ran = await post(changed.card)
  const refused = ran.deny !== undefined || ran.isError === true
  if (!changed.addedMode || !refused || !isModeRefusal(ran.deny ?? ran.text ?? '')) return ran
  const { permission_mode: _, ...without } = changed.card
  return post(without)
}

/**
 * Les propositions gardées pour ce Lot, à donner au modèle en tête de son tour ; elles sortent
 * alors du store, avec celles de plus d'une semaine. Store vide : aucune lecture de fiche.
 */
async function receiveProposals($: EngineInterface): Promise<string | undefined> {
  const kept = await loadProposals($)
  if (kept.length === 0) return undefined
  const now = await $.clock.now()
  const id = (await readOwnSession($)).id
  const mine = kept.filter(p => p.lot === id && now - p.at <= PROPOSAL_MAX_MS)
  const rest = kept.filter(p => p.lot !== id && now - p.at <= PROPOSAL_MAX_MS)
  if (rest.length !== kept.length) await $.store.set(PROPOSALS_KEY, rest)
  return mine.length > 0 ? lotProposalText(mine) : undefined
}

// --- Nouvelles des enfants (#84) ------------------------------------------------------------------
// Chaque enfant note son état dans le store ; le parent le lit à chaque message de Bertrand.

/** Cette session n'a pas de parent, ou en est détachée : ça ne change plus, la fiche ne se relit pas (#90). */
let noParent = false

/**
 * Cette session et son parent, d'après sa fiche ; aucun sans parent, ou détachée. Un parent se relit à
 * chaque fois (on peut la détacher) ; son absence se garde. Une fiche en erreur ne se garde pas.
 */
async function ownParent($: EngineInterface): Promise<{ id: string; parent: string } | undefined> {
  if (noParent) return undefined
  const ran = await $.tool.call({ tool: GET_SESSION_TOOL, session_id: 'self' })
  if (ran.deny !== undefined || ran.isError) return undefined
  const me = JSON.parse(ran.text ?? '') as { sessionId?: unknown; parentSessionId?: unknown; detached?: unknown }
  if (typeof me.sessionId !== 'string') return undefined
  if (typeof me.parentSessionId !== 'string' || me.parentSessionId === '' || me.detached === true) {
    noParent = true
    return undefined
  }
  return { id: me.sessionId, parent: me.parentSessionId }
}

/**
 * Une note d'enfant lue du store ; illisible, aucune : une étape ou une question d'un autre format
 * ferait lever la lecture du parent et couperait les nouvelles de tous ses enfants (#90).
 */
function childStatusOf(value: unknown): ChildStatus | undefined {
  if (typeof value !== 'object' || value === null) return undefined
  const v = value as { steps?: unknown; question?: unknown }
  if (!Array.isArray(v.steps) || !v.steps.every(isChildStep)) return undefined
  if (v.question !== undefined) {
    const q = v.question as { text?: unknown; since?: unknown } | null
    if (typeof q !== 'object' || q === null || typeof q.text !== 'string' || typeof q.since !== 'number' || !Number.isFinite(q.since)) return undefined
  }
  return value as ChildStatus
}

/** La note sans sa question : l'outil a rendu sa réponse, ou le tour a repris. */
function withoutQuestion(s: ChildStatus): ChildStatus {
  const { question: _, ...rest } = s
  return rest
}

/** Les notes de cette session, l'une après l'autre : deux outils du même message ne s'écrasent pas (#90). */
let noting: Promise<void> = Promise.resolve()

/**
 * Change la note de cette session, si elle a un parent ; une erreur, horloge comprise, ne bloque
 * jamais l'outil. Chaque note attend la précédente : elle relit ce que l'autre vient d'écrire.
 */
function noteChild($: EngineInterface, change: (s: ChildStatus, now: number) => ChildStatus): Promise<void> {
  noting = noting.then(async () => {
    try {
      const me = await ownParent($)
      if (!me) return
      const key = `${CHILD_STATUS_PREFIX}${me.id}`
      const prev = childStatusOf(await $.store.get(key)) ?? { steps: [], at: 0 }
      const now = await $.clock.now()
      await $.store.set(key, { ...change(prev, now), at: now })
    } catch {
      // fiche, horloge ou store illisible : rien de noté, l'outil passe
    }
  })
  return noting
}

/** Un appel d'un sous-agent : son état n'est pas celui de la session. */
function fromAgent(e: unknown): boolean {
  return (e as { agentId?: unknown }).agentId !== undefined
}

/** Ce que le parent lit de sa roadmap pour juger ses enfants : les numéros ouverts et clos, le mode, ses dossiers. */
type ParentLines = { open: Set<string>; done: Set<string>; mode: Mode; match: string[] }

/** git lit le dossier d'un enfant en 5 s au plus : le message de Bertrand attend la réponse (#90). */
const GIT_TIMEOUT_MS = 5_000

/**
 * Le code de sortie d'une commande git dans le dossier d'un enfant, et sa sortie. Sans verrou
 * optionnel : lire l'état ne prend pas l'index d'une session qui y travaille. Passé le délai, rejette.
 */
async function gitIn($: EngineInterface, cwd: string, ...args: string[]): Promise<{ code: number; out: string }> {
  const ran = await $.process.run(['git', '--no-optional-locks', '-C', cwd, ...args], { timeoutMs: GIT_TIMEOUT_MS })
  return { code: ran.exitCode, out: ran.stdout }
}

/**
 * Ce que dit la fiche d'un enfant pour juger son dossier : distante ou locale (`undefined` : fiche
 * illisible), et sa branche de base, celle d'où l'app a tiré son worktree (`main` sans elle).
 */
async function childFiche($: EngineInterface, id: string): Promise<{ remote?: boolean; base: string }> {
  try {
    const ran = await $.tool.call({ tool: GET_SESSION_TOOL, session_id: id })
    if (ran.deny !== undefined || ran.isError) return { base: 'main' }
    const fiche = JSON.parse(ran.text ?? '') as { isRemote?: unknown; sourceBranch?: unknown }
    return {
      ...(typeof fiche.isRemote === 'boolean' ? { remote: fiche.isRemote } : {}),
      base: typeof fiche.sourceBranch === 'string' && fiche.sourceBranch !== '' ? fiche.sourceBranch : 'main',
    }
  } catch {
    return { base: 'main' }
  }
}

/** Le dossier qui contient celui-ci (`/` à la racine). */
function parentDir(path: string): string {
  const trimmed = path.replace(/\/+$/, '')
  const at = trimmed.lastIndexOf('/')
  return at > 0 ? trimmed.slice(0, at) : '/'
}

/**
 * Ce que le parent sait d'un enfant qui ne tourne pas, pour le dire fini (l'archivage nettoie son
 * worktree : un doute ne dit jamais fini). La ligne `#N` de son titre ne compte que si l'enfant
 * travaille dans le projet du parent (deux roadmaps ont chacune leur #76) ; close, ses commits
 * doivent aussi être arrivés, dans sa base ou poussés sur leur branche distante. Sans ligne, sa
 * branche à lui (pas sa base) fusionnée, et sa liste d'étapes toute faite. Sa base est celle de sa
 * fiche (`sourceBranch`), sinon `main` (#90). En mode Projet, un enfant dans le dossier partagé du
 * projet est jugé par sa ligne seule. Une session distante ne se juge pas par le git d'ici. Une
 * question encore vivante ou un enfant ouvert suffisent à dire non : git ne tourne pas pour rien.
 */
async function finishedFacts(
  $: EngineInterface,
  child: ChildRow,
  status: ChildStatus | undefined,
  openChildren: number,
  lines: () => Promise<ParentLines | undefined>,
): Promise<FinishedFacts> {
  const id = sessionTitleId(child.title)
  const facts: FinishedFacts = { running: child.running, question: liveQuestion(status, child) !== undefined, openChildren, dirty: undefined, landed: undefined, ...(id ? { line: `#${id}` } : {}) }
  if (facts.running || facts.question || openChildren > 0 || !child.cwd) return facts
  const cwd = child.cwd
  const known = await lines()
  const inProject = known !== undefined && known.match.some(prefix => cwd.startsWith(prefix))
  const line = id && inProject && (known.done.has(id) || known.open.has(id)) ? (known.done.has(id) ? 'closed' : 'open') : undefined
  // Mode Projet (#76) : les sessions partagent le dossier du projet, sans branche ; seule la ligne compte.
  if (known?.mode === 'projet' && inProject && !cwd.includes('/.claude/worktrees/')) {
    facts.dirty = 0
    if (line) facts.landed = line === 'closed'
    return facts
  }
  const fiche = await childFiche($, child.id)
  if (fiche.remote === true) {
    facts.remote = true
    return facts
  }
  try {
    if (!(await $.fs.exists(cwd))) {
      // Plus de dossier : rien à perdre au nettoyage s'il a été retiré (son dossier parent est là)
      // d'une session locale ; la ligne close suffit. Un volume démonté, une fiche illisible : le doute.
      if (fiche.remote === false && (await $.fs.exists(parentDir(cwd)))) {
        facts.dirty = 0
        if (line) facts.landed = line === 'closed'
      }
      return facts
    }
    // Les fichiers non suivis comptent, quel que soit le réglage git (`status.showUntrackedFiles`).
    const st = await gitIn($, cwd, 'status', '--porcelain', '--untracked-files=normal')
    facts.dirty = st.code === 0 ? st.out.split('\n').filter(l => l.trim() !== '').length : undefined
    if (facts.dirty !== 0) return facts
    const inBase = (await gitIn($, cwd, 'merge-base', '--is-ancestor', 'HEAD', fiche.base)).code
    if (line === 'open') {
      facts.landed = false
    } else if (line === 'closed') {
      // Ligne close, mais un correctif commité après se perdrait : dans la base, ou poussé, sinon pas fini.
      if (inBase === 0 || (await gitIn($, cwd, 'rev-list', '--count', '@{u}..HEAD')).out.trim() === '0') {
        facts.landed = true
      } else {
        const ahead = await gitIn($, cwd, 'rev-list', '--count', `${fiche.base}..HEAD`)
        facts.landed = false
        if (ahead.code === 0 && /^\d+$/.test(ahead.out.trim())) facts.ahead = Number(ahead.out.trim())
      }
    } else {
      // Sans ligne : HEAD dans la base ne prouve rien d'une session sur sa base ou qui n'a rien fait.
      const own = child.branch !== undefined && child.branch !== fiche.base && child.branch !== 'main'
      const allDone = (status?.steps.length ?? 0) > 0 && (status?.steps ?? []).every(s => s.status === 'completed')
      facts.landed = inBase === 0 ? own && allDone : inBase === 1 ? false : undefined
    }
  } catch {
    // git ou fichier illisible : le doute ne dit jamais fini
  }
  return facts
}

/**
 * L'alerte du parent (#84) : ses enfants qui coincent ou sont à archiver, rien quand tout avance ou
 * qu'il n'a pas d'enfant. Note les relances faites, pour n'en faire qu'une par attente.
 */
async function childAlertContext($: EngineInterface): Promise<string | undefined> {
  const listed = await $.tool.call({ tool: LIST_SESSIONS_TOOL, linked: true, limit: LIST_LIMIT })
  if (listed.deny !== undefined || listed.isError) return undefined
  const rows: unknown = JSON.parse(listed.text ?? '[]')
  if (!Array.isArray(rows)) return undefined
  // La liste exclut cette session : une rangée lancée par une session absente de la liste est peut-être
  // son enfant. Sans aucune, pas d'enfant, et la fiche ne se lit pas (un message reste léger).
  const ids = new Set(rows.map(r => (r as { sessionId?: unknown } | null)?.sessionId))
  if (!rows.some(r => typeof (r as { startedBy?: unknown } | null)?.startedBy === 'string' && !ids.has((r as { startedBy: string }).startedBy))) return undefined
  const id = (await readOwnSession($)).id
  if (!id) return undefined
  const children = childrenOf(rows, id)
  if (children.length === 0) return undefined
  let known: Promise<ParentLines | undefined> | undefined
  const lines = () => {
    known ??= (async () => {
      const source = await sourceNow($)
      if (!source) return undefined
      const ids = (tasks: Task[] | string) => new Set(typeof tasks === 'string' ? [] : tasks.flatMap(t => (t.id ? [t.id] : [])))
      return { open: ids(await load($, files(source).open, 'ROADMAP.md')), done: ids(await load($, files(source).done, 'ROADMAP-fait.md')), mode: source.mode ?? 'code', match: source.match }
    })()
    return known
  }
  const statuses: Record<string, ChildStatus | undefined> = {}
  const finished: Record<string, { ok: boolean; why?: string }> = {}
  // Tous les enfants à la fois (#90) : le message de Bertrand attend le plus lent, pas leur somme.
  // Un enfant illisible compte sans note et pas fini ; il ne coupe pas les nouvelles des autres.
  await Promise.all(
    children.map(async child => {
      try {
        statuses[child.id] = childStatusOf(await $.store.get(`${CHILD_STATUS_PREFIX}${child.id}`))
      } catch {
        statuses[child.id] = undefined
      }
      if (child.running) return
      try {
        finished[child.id] = finishedCheck(await finishedFacts($, child, statuses[child.id], childrenOf(rows, child.id).length, lines))
      } catch {
        // roadmap ou fiche illisible : le doute ne dit jamais fini
      }
    }),
  )
  const alertedKey = `${CHILD_ALERTED_PREFIX}${id}`
  const stored = await $.store.get(alertedKey)
  const alerted: Record<string, ChildRelaunch> = {}
  if (typeof stored === 'object' && stored !== null) {
    for (const [k, v] of Object.entries(stored as Record<string, unknown>)) {
      if (typeof v === 'object' && v !== null && typeof (v as ChildRelaunch).at === 'number') alerted[k] = v as ChildRelaunch
    }
  }
  const alerts = childAlerts({ children, statuses, finished, alerted, now: await $.clock.now() })
  // Les relances de cette fois s'ajoutent, avec l'étape de l'enfant ; un enfant qui n'est plus listé sort.
  const next: Record<string, ChildRelaunch> = {}
  for (const child of children) if (alerted[child.id] !== undefined) next[child.id] = alerted[child.id] as ChildRelaunch
  for (const a of alerts) if (a.kind === 'silent' && !a.relaunched) next[a.child.id] = { at: a.child.lastActivityAt, ...(a.step ? { step: a.step } : {}) }
  if (Object.keys(next).length === 0) {
    if (stored !== undefined) await $.store.delete(alertedKey)
  } else if (JSON.stringify(next) !== JSON.stringify(alerted)) {
    await $.store.set(alertedKey, next)
  }
  return childAlertText(alerts)
}

/** La purge des notes d'enfant tourne une fois par chargement du module, au premier message. */
let childNotesPurged = false

/**
 * Les notes `child-status:` et `child-alerted:` d'une session archivée resteraient pour toujours (#90) :
 * une note sans écriture depuis 30 jours sort, illisible aussi ; des relances sortent quand la plus
 * récente attente relancée a plus de 30 jours.
 */
async function purgeChildNotes($: EngineInterface): Promise<void> {
  if (childNotesPurged) return
  childNotesPurged = true
  const now = await $.clock.now()
  const fresh = (at: unknown) => typeof at === 'number' && now - at <= CHILD_NOTE_MAX_MS
  for (const key of await $.store.keys()) {
    if (key.startsWith(CHILD_STATUS_PREFIX)) {
      if (!fresh(childStatusOf(await $.store.get(key))?.at)) await $.store.delete(key)
    } else if (key.startsWith(CHILD_ALERTED_PREFIX)) {
      const value = await $.store.get(key)
      const ats = typeof value === 'object' && value !== null ? Object.values(value).map(v => (v as { at?: unknown } | null)?.at) : []
      if (!ats.some(fresh)) await $.store.delete(key)
    }
  }
}

/** Le titre court d'une tâche : celui du cache, sinon les premiers mots du libellé. */
async function shortTitleOf($: EngineInterface, task: Task): Promise<string> {
  return (await loadTitles($))[hashLabel(task.label)]?.titre ?? fallbackTitle(task.label)
}

/**
 * Une session qui ouvre la ligne d'UNE tâche y travaille (règle : un travail ouvre sa ligne dès le
 * départ) : la tâche passe « en session » dans tous les panneaux, jusqu'à l'archivage de la session
 * ou la clôture de la tâche. Une session qui ajoute plusieurs tâches les note pour plus tard : elle
 * ne travaille sur aucune, et ses déductions précédentes tombent (2026-10-23 : trois notes ajoutées
 * d'un coup passaient « en cours »). Une ligne réécrite ne compte pas, ni une session sans identifiant.
 *
 * Une session, une tâche (2026-10-23) : une session « #N · … » qui ouvre une autre tâche n'y
 * travaille pas, et la note rendue rappelle au modèle de proposer une session à part. Le titre se
 * pose au lancement, puis ne change plus (2026-10-25) : le panneau ne renomme aucune session.
 * Une session « Lot » ouvre et coche les lignes de ses features sans travailler sur aucune : elle
 * n'est jamais en cours, et ce qu'elle tenait d'avant tombe.
 */
/**
 * La clé d'une tâche dans le suivi des sessions, partagé par tous les panneaux : son numéro préfixé
 * du dossier de sa roadmap (deux roadmaps ont chacune leur #142 : sans le dossier, une session
 * Splitmybill faisait tourner la #142 d'adBricks, 2026-10-23), sinon l'empreinte de son libellé.
 */
/**
 * La session qui travaille une tâche : lancée depuis le panneau (`live`), ou trouvée par son titre
 * dans la liste de l'app. Une session écartée à la main, archivée, ou d'état inconnu depuis plus de
 * 12 heures ne compte pas.
 */
function trackedSession(
  source: Source,
  t: Task,
  liveEntries: Record<string, LiveEntry>,
  ignored: Record<string, string[]>,
  now: number,
): { entry: LiveEntry; state: LiveState; key: string; inferred: boolean } | undefined {
  // Suivie sous son numéro ; une entrée d'avant les numéros reste sous l'empreinte du libellé.
  // Une entrée d'avant le dossier dans la clé (« #142 » seul) ne dit pas de quelle roadmap elle
  // vient : elle est ignorée.
  const hash = liveEntries[liveKeyOf(source, t)] ? liveKeyOf(source, t) : hashLabel(t.label)
  const matched = sessionMatches.get(taskKey(t))
  const entry = liveEntries[hash] ?? matched
  if (!entry) return undefined
  // Une session écartée à la main de cette tâche ne la rattache plus.
  const sid = entry.sessionId ?? ''
  if (sid !== '' && (ignored[taskKey(t)]?.includes(sid) || ignored[hash]?.includes(sid))) return undefined
  // Une session trouvée par son titre est ouverte par construction (non archivée, listée).
  const state = liveEntries[hash] ? (liveStatus.get(hash) ?? (entry.sessionId ? 'open' : 'unknown')) : 'open'
  if (state === 'closed' || (state === 'unknown' && now - entry.startedAt > UNKNOWN_MAX_MS)) return undefined
  // Déduite (ligne écrite par la session, ou titre de session) plutôt que lancée du panneau.
  return { entry, state, key: hash, inferred: !liveEntries[hash] || entry.via === 'write' }
}

function liveKeyOf(source: Source, task: Task): string {
  return task.id ? `${source.dir}|#${task.id}` : hashLabel(task.label)
}

async function markWorking($: EngineInterface, source: Source, added: Task[]): Promise<string | undefined> {
  if (added.length === 0) return undefined
  let note: string | undefined
  try {
    const { id: sessionId, title } = await readOwnSession($, true)
    if (!sessionId) return undefined
    const live = await loadLive($)
    const ignored = await loadIgnored($)
    const mine = Object.keys(live).filter(k => live[k]?.via === 'write' && live[k]?.sessionId === sessionId)
    const keys = new Set([...mine, ...added.map(t => liveKeyOf(source, t))])
    // Un Lot (titre ou famille) n'est sur aucune tâche : il les lance.
    const lot = await ownIsLot($, { id: sessionId, title })
    if (lot) note = lotTasksNote(added)
    const step = oneTaskStep(title, added)
    if (!lot && step.kind === 'other') return otherTaskNote(step.own, step.task, await shortTitleOf($, step.task))
    if (lot || keys.size > 1) {
      for (const k of mine) {
        delete live[k]
        liveStatus.delete(k)
      }
    } else {
      const task = added[0] as Task
      const key = liveKeyOf(source, task)
      if (ignored[taskKey(task)]?.includes(sessionId)) return undefined
      live[key] = { sessionId, startedAt: await $.clock.now(), title: clip(task.label, 58), via: 'write' }
      liveStatus.set(key, 'open')
    }
    await $.store.set(LIVE_KEY, live)
    await update($, liveVersionAtom, v => v + 1)
  } catch {
    // stockage indisponible : la tâche ne passe pas « en session », l'écriture reste valable
  }
  return note
}

/** Les sessions écartées à la main d'une tâche (« Pas en cours ») : clé de tâche → identifiants. */
const IGNORED_KEY = 'live-ignored'

async function loadIgnored($: EngineInterface): Promise<Record<string, string[]>> {
  const stored = await $.store.get(IGNORED_KEY)
  if (typeof stored !== 'object' || stored === null) return {}
  const out: Record<string, string[]> = {}
  for (const [k, v] of Object.entries(stored as Record<string, unknown>)) {
    if (Array.isArray(v)) out[k] = v.filter((x): x is string => typeof x === 'string')
  }
  return out
}



/**
 * Les sessions de l'app qui travaillent sur une tâche sans l'avoir signalé (lancées ailleurs, ou
 * avec une version du plugin qui ne le faisait pas) : une session non archivée, ouverte dans le
 * projet depuis moins de 7 jours, dont le titre désigne une seule tâche ouverte. Clé : empreinte
 * du libellé.
 */
let sessionMatches = new Map<string, LiveEntry>()
/**
 * Si chaque session tourne (`isRunning`), relevé à chaque sondage : une session ouverte qui ne
 * tourne pas a fini son tour et attend Bertrand — sa tâche porte la main au lieu de la roue.
 */
const runningBySession = new Map<string, boolean>()
/** La dernière activité de chaque session listée (ms) : depuis quand une session qui ne tourne pas attend Bertrand. */
const lastActivityBySession = new Map<string, number>()
let listDenied = false

/** Les sessions lues par relecture : au-delà des 40 d'avant, une journée chargée en laissait dehors. */
const LIST_LIMIT = 100
/** La dernière liste lue : une panne passagère la garde, au lieu de vider « En cours » le temps d'un pas. */
let lastListRows: unknown[] = []
/**
 * Ce que la fin d'un tour de cette session a dit (`turn.start` / `turn.complete`) et quand : pendant
 * OWN_EVENT_MS, il l'emporte sur `isRunning` de sa fiche, que l'app pose un peu après l'événement.
 */
let ownRunningEvent: { running: boolean; at: number } | undefined
const OWN_EVENT_MS = 5_000

/**
 * Un refus de la liste se réessaie au bout de tant de pas (une minute) : avant, un seul refus (le
 * classificateur du mode auto qui ne répond pas, par exemple) coupait la détection jusqu'au
 * rechargement du module.
 */
const LIST_RETRY_TICKS = 20
let listDeniedTick = 0

/**
 * La liste des autres sessions de l'app. Refusée : vide, jusqu'au nouvel essai d'une minute plus
 * tard ; en panne ou illisible : la dernière lue. Un outil absent (terminal, autre hôte) ne dit rien.
 */
async function readListRows($: EngineInterface): Promise<{ rows: unknown[]; note: string }> {
  if (listDenied && pollTick - listDeniedTick < LIST_RETRY_TICKS) return { rows: [], note: sessionScanNote('denied') }
  let ran: ToolCallResult
  try {
    toolCalls++
    ran = await $.tool.call({ tool: LIST_SESSIONS_TOOL, limit: LIST_LIMIT })
  } catch {
    return { rows: lastListRows, note: '' }
  }
  if (ran.deny !== undefined) {
    listDenied = true
    listDeniedTick = pollTick
    lastListRows = []
    return { rows: [], note: sessionScanNote('denied') }
  }
  listDenied = false
  if (ran.isError) return { rows: lastListRows, note: sessionScanNote('error', ran.text ?? '') }
  try {
    const rows: unknown = JSON.parse(ran.text ?? '[]')
    if (!Array.isArray(rows)) return { rows: lastListRows, note: sessionScanNote('error', 'réponse inattendue') }
    lastListRows = rows
    return { rows, note: '' }
  } catch {
    return { rows: lastListRows, note: sessionScanNote('error', 'réponse illisible') }
  }
}

/**
 * La fiche de cette session, relue à chaque relecture : la liste de l'app ne la rend jamais. Elle
 * tient aussi à jour l'identifiant et le titre gardés (`ownSession`) : une session nommée « Lot · … »
 * après coup se reconnaît au pas suivant.
 */
async function readSelfRow($: EngineInterface): Promise<unknown> {
  try {
    toolCalls++
    const ran = await $.tool.call({ tool: GET_SESSION_TOOL, session_id: 'self' })
    if (ran.deny !== undefined || ran.isError) return undefined
    const text = ran.text ?? ''
    const row: unknown = JSON.parse(text)
    if (typeof row !== 'object' || row === null) return undefined
    ownSession = { id: sessionIdIn(text), title: sessionTitleIn(text) }
    return row
  } catch {
    return undefined
  }
}

/** Pose la note de relecture des sessions ; inchangée, rien ne se redessine. */
async function setScanNote($: EngineInterface, note: string): Promise<void> {
  if ((await read($, scanNoteAtom)) !== note) await update($, scanNoteAtom, () => note)
}

/**
 * L'état « tourne / t'attend » de cette session, posé dès l'événement de tour : la relecture de 3 s
 * le confirme ensuite. Sans identifiant connu (fiche pas encore lue), la relecture s'en charge.
 */
async function markOwnRunning($: EngineInterface, running: boolean): Promise<void> {
  try {
    ownRunningEvent = { running, at: await $.clock.now() }
    const id = ownSession?.id
    if (!id || runningBySession.get(id) === running) return
    runningBySession.set(id, running)
    await update($, liveVersionAtom, v => v + 1)
  } catch {
    // horloge ou état indisponibles : la relecture de 3 s le dira
  }
}

async function matchSessions($: EngineInterface, source: Source): Promise<void> {
  // Une liste refusée ou illisible ne dit rien des autres : leurs fiches se relisent.
  listed = new Map()
  try {
    // La liste et la fiche de cette session, ensemble : la liste l'exclut (2026-10-27).
    const [list, self] = await Promise.all([readListRows($), readSelfRow($)])
    await setScanNote($, list.note)
    const sessions = withSelfRow(list.rows, self)
    const selfId = typeof (self as { sessionId?: unknown } | undefined)?.sessionId === 'string'
      ? (self as { sessionId: string }).sessionId
      : undefined
    const tasks = await load($, files(source).open, 'ROADMAP.md')
    if (typeof tasks === 'string') return
    const doneTasks = await load($, files(source).done, 'ROADMAP-fait.md')
    // Une session « Roadmap #N · … » se rattache à sa tâche par le numéro, faite ou non : une
    // tâche close dont la session reste ouverte garde le lien vers elle.
    const numbered = [...tasks, ...(typeof doneTasks === 'string' ? [] : doneTasks)]
    const titles = await loadTitles($)
    const now = await $.clock.now()
    const next = new Map<string, LiveEntry>()
    const lots = lotSessionIds(sessions)
    // Une session qui finit son tour (ou le reprend) change sa marque : la main ou la roue.
    let runningChanged = false
    for (const raw of sessions) {
      const sess = raw as { sessionId?: unknown; title?: unknown; cwd?: unknown; isArchived?: unknown; lastActivityAt?: unknown; link?: unknown }
      // Une rangée qui dit l'archivage vaut la fiche de la session : `probeLive` ne la relit pas.
      if (typeof sess.sessionId === 'string' && typeof sess.isArchived === 'boolean') listed.set(sess.sessionId, seenIn(raw))
      if (typeof sess.sessionId === 'string' && typeof (raw as { isRunning?: unknown }).isRunning === 'boolean') {
        const running = (raw as { isRunning: boolean }).isRunning
        // L'événement de tour de cette session, tout frais, l'emporte sur sa fiche un peu en retard.
        const fresh = sess.sessionId === selfId && ownRunningEvent !== undefined && now - ownRunningEvent.at < OWN_EVENT_MS
        const value = fresh ? (ownRunningEvent as { running: boolean }).running : running
        if (runningBySession.get(sess.sessionId) !== value) runningChanged = true
        runningBySession.set(sess.sessionId, value)
      }
      if (typeof sess.sessionId === 'string' && typeof sess.lastActivityAt === 'string' && !Number.isNaN(Date.parse(sess.lastActivityAt))) {
        lastActivityBySession.set(sess.sessionId, Date.parse(sess.lastActivityAt))
      }
      if (sess.isArchived === true || typeof sess.title !== 'string' || typeof sess.sessionId !== 'string') continue
      if (typeof sess.cwd !== 'string' || !source.match.some(prefix => (sess.cwd as string).startsWith(prefix))) continue
      // Une session « Lot » (titre ou famille) coordonne ses features : aucune n'est la sienne.
      if (isLotSession(sess.title) || lots.has(sess.sessionId)) continue
      const last = typeof sess.lastActivityAt === 'string' ? Date.parse(sess.lastActivityAt) : Number.NaN
      if (Number.isNaN(last) || now - last > LIVE_MAX_MS) continue
      const id = sessionTitleId(sess.title)
      const task = id !== undefined ? numbered.find(t => t.id === id) : taskForSessionTitle(sess.title, tasks, t => titles[hashLabel(t.label)]?.titre)
      if (!task) continue
      // Une session de réalisation l'emporte sur une session de vérification de la même tâche.
      const prev = next.get(taskKey(task))
      if (prev && sessionTitleKind(prev.title) === 'work' && sessionTitleKind(sess.title) === 'check') continue
      next.set(taskKey(task), {
        sessionId: sess.sessionId,
        startedAt: last,
        title: sess.title,
        ...(typeof sess.link === 'string' ? { link: sess.link } : {}),
      })
    }
    const same = next.size === sessionMatches.size && [...next].every(([k, v]) => sessionMatches.get(k)?.sessionId === v.sessionId)
    sessionMatches = next
    if (!same || runningChanged) await update($, liveVersionAtom, v => v + 1)
  } catch {
    // réponse illisible : rien
  }
}

/**
 * La source du panneau, gardée en mémoire du module : cherchée au premier dessin, puis relue au
 * début de session, toutes les 15 s et par /roadmap. `null` : aucune roadmap pour ce dossier.
 */
let knownSource: Source | null | undefined

async function sourceNow($: EngineInterface): Promise<Source | undefined> {
  const found = await currentSource($)
  knownSource = found ?? null
  return found
}

/**
 * Ce que le panneau dessine, lu une fois et gardé en mémoire du module : les deux fichiers parsés,
 * les titres courts, le suivi des sessions, les bilans, la palette. Un dessin qui suit un clic n'en
 * relit rien (2026-10-23 : 12 lectures de fichiers, du store et de la configuration par dessin) ;
 * tout se relit quand la version change (empreinte des fichiers, titres, thème, « Réessayer »,
 * sessions suivies). Une roadmap illisible ne se garde pas : le dessin suivant réessaie.
 */
type PaneData = {
  key: string
  palette: Palette
  open: Task[] | string
  done: Task[]
  titles: Record<string, ShortTitle>
  live: Record<string, LiveEntry>
  ignored: Record<string, string[]>
  bilan: BilanData
}
let paneCache: PaneData | undefined

async function paneData($: EngineInterface, source: Source, version: string): Promise<PaneData> {
  const key = `${source.dir}\u0000${version}`
  if (paneCache?.key === key) {
    perfCached = true
    return paneCache
  }
  const paths = files(source)
  const [palette, open, done, titles, live, ignored, bilan] = await Promise.all([
    paletteOf($),
    load($, paths.open, 'ROADMAP.md'),
    load($, paths.done, 'ROADMAP-fait.md'),
    loadTitles($),
    loadLive($),
    loadIgnored($).catch(() => ({}) as Record<string, string[]>),
    loadBilan($, source),
  ])
  const data: PaneData = { key, palette, open, done: typeof done === 'string' ? [] : done, titles, live, ignored, bilan }
  paneCache = typeof open === 'string' ? undefined : data
  return data
}

/** Relit l'empreinte des fichiers ; changée, le panneau relit ses données et se redessine. */
async function restamp($: EngineInterface, source: Source): Promise<boolean> {
  const next = await stampOf($, source)
  if (next === (await read($, stampAtom))) return false
  await update($, stampAtom, () => next)
  return true
}

/** Des zones dessinées dont le cadre n'a pas dit « prêt » : nouvelles clés, l'app recharge le cadre. */
async function checkZones($: EngineInterface): Promise<void> {
  if (zones.drawnAt.size > 0 && zoneReload(zones, await $.clock.now())) await update($, zoneGenAtom, v => v + 1)
}

/**
 * Les sessions seules : la liste de l'app, puis les fiches de celles qui n'y sont pas. Le relevé
 * dit la durée de chaque étape et le nombre d'appels d'outil.
 */
async function refreshSessions($: EngineInterface, source: Source, fast: boolean): Promise<void> {
  toolCalls = 0
  const t0 = tick()
  await matchSessions($, source)
  const t1 = tick()
  await probeLive($)
  const t2 = tick()
  noteRefresh({ fast, totalMs: t2 - t0, listMs: t1 - t0, probeMs: t2 - t1, calls: toolCalls })
}

async function refresh($: EngineInterface): Promise<void> {
  await checkZones($)
  // Rien n'a changé : aucun dessin. Chaque étape ne redessine que ce qu'elle a vu bouger.
  const before = knownSource?.dir
  const source = await sourceNow($)
  if (!source) return
  if (before !== undefined && before !== source.dir) await update($, themeStampAtom, v => v + 1)
  await refreshSessions($, source, false)
  if (await restamp($, source)) await summarize($, source)
}

/** Le numéro du pas, pour la recherche du dossier ; une relecture en vol fait sauter le pas suivant. */
let pollTick = 0
let polling = false

/**
 * Un pas de la minuterie : les zones, les sessions et l'empreinte des fichiers ; tous les POLL_MS,
 * la relecture complète, qui recherche aussi le dossier.
 */
async function poll($: EngineInterface): Promise<void> {
  if (polling) return
  polling = true
  try {
    pollTick++
    const full = pollTick % (POLL_MS / TICK_MS) === 0
    if (full || !knownSource) await refresh($)
    else {
      await checkZones($)
      await refreshSessions($, knownSource, true)
      if (await restamp($, knownSource)) await summarize($, knownSource)
    }
  } catch {
    // un pas raté (module rechargé, état indisponible) : le suivant réessaie, sans rejet laissé en l'air
  } finally {
    polling = false
  }
}

/**
 * Démarre une session à part sur la task, par l'outil de l'app de bureau ; le clic de la
 * personne est la demande. Sans cet outil (terminal, autre hôte), la demande passe à Claude
 * dans la conversation en cours, qui la lance lui-même.
 */
/** Le « Message additionnel » tapé dans le détail, ajouté au brief ; vidé à chaque changement de tâche. */
let launchExtra = ''

async function launchSession($: EngineInterface, source: Source, task: Task, shortTitle: string, extra = '', kind = ''): Promise<void> {
  // `check` : le bouton « Vérifier », une session qui contrôle la tâche sans la faire.
  // Le brief de lancement dit où écrire le bilan de clôture : le journal du dossier, ou celui par défaut.
  const key = taskKey(task)
  // Le bouton se grise et dit « Lancement… » : une seule écriture.
  await setView($, v => ({ launched: v.launched.includes(key) ? v.launched : [...v.launched, key], launchNote: LAUNCHING }))
  const projet = projectSettings(source).mode === 'projet'
  const base =
    kind === 'check'
      ? checkBrief(source, task, shortTitle, !projet || (await isGitDir($, source.dir)), await briefFound($, source, task))
      : await workBrief($, source, task, shortTitle)
  const brief = extra.trim() === '' ? base : { ...base, prompt: `${base.prompt}\n\nMessage additionnel :\n${extra.trim()}` }
  // Un refus net de l'app ou une panne : rien n'est parti, le bouton redevient cliquable.
  const release = () => setView($, v => ({ launched: v.launched.filter(k => k !== key) }))
  // Ce que l'app a répondu à chaque essai : la note en tire sa cause, le relevé le garde tel quel.
  const refusals: string[] = []
  const reasonOf = (r: ToolCallResult) => (r.deny ?? r.text ?? 'sans motif').replace(/\s+/g, ' ').trim()
  const started = tick()
  const noteLaunch = (via: LaunchRow['via'], skipped = false) => {
    pushPerf({
      mod: PERF_MOD,
      at: tick(),
      kind: 'launch',
      via,
      launchMs: tick() - started,
      ...(refusals.length > 0 ? { refusal: clip(refusals.join(' ; '), 300) } : {}),
      ...(skipped ? { skipped } : {}),
    })
    perfFlush?.()
  }
  // Le mode auto vient de refuser la carte du panneau : elle passe droit par Claude.
  if (autoModeRefusal && tick() - autoModeRefusal.at < AUTO_MODE_SKIP_MS) {
    refusals.push(autoModeRefusal.text)
    noteLaunch('claude', true)
    await askClaude($, brief, refusals)
    if ((await read($, viewAtom)).launchNote.startsWith('Lancement impossible')) await release()
    return
  }
  try {
    // L'app ne démarre jamais une session sur un clic de plugin : elle n'accepte qu'une
    // proposition, la carte « New session » que la personne démarre d'un clic sur « Start ».
    // On la pose donc directement, sans essayer de lancer (deux refus mesurés le 2026-10-22).
    const card = {
      tool: START_SESSION_TOOL,
      initiation: 'own_initiative',
      context: 'fresh',
      title: brief.title,
      // Option « Lancer en bypass » (#87) : la session lancée se relève elle-même si l'app ne l'y
      // lance pas. La consigne n'entre que dans la carte : envoyée dans la conversation qui lance
      // (repli par Claude), elle aurait pu y relever cette session-ci ; là, le crochet l'ajoute à la
      // carte que pose Claude (relecture de sécurité du 2026-10-29).
      prompt: settings.launchBypass ? withBypassClause(brief.prompt) : brief.prompt,
      background: brief.background,
    } as const
    // Les champs que l'app peut refuser, dans l'ordre où ils tombent, un par refus : le mode (#87 :
    // l'app n'accorde le bypass que depuis une session déjà en bypass), l'effort (haut par défaut,
    // Bertrand, 2026-10-23 ; borné à celui de la session qui lance), puis, en mode Projet (#76), le
    // dossier du projet sans worktree (le panneau ne lit pas la copie d'un worktree). Un champ tombé
    // hérite de la session qui lance.
    const effort = LAUNCH_EFFORTS.has(settings.launchEffort) ? settings.launchEffort : undefined
    const optional: [field: string, value: unknown, note: string][] = []
    if (settings.launchBypass) optional.push(['permission_mode', BYPASS_MODE, `en ${BYPASS_MODE}`])
    if (effort) optional.push(['effort', effort, `avec effort ${effort}`])
    if (projet) optional.push(['use_worktree', false, 'sans worktree'])
    const withFields = () => ({ ...card, ...Object.fromEntries(optional.map(([field, value]) => [field, value])) })
    // Un refus du mode auto ne tient à aucun de ces champs : reposer la carte ne change rien.
    const refused = (r: ToolCallResult) => (r.deny !== undefined || r.isError === true) && !isAutoModeRefusal(reasonOf(r))
    let proposed = await $.tool.call(withFields())
    while (optional.length > 0 && refused(proposed)) {
      refusals.push(`${optional.shift()![2]} : ${reasonOf(proposed)}`)
      proposed = await $.tool.call(withFields())
    }
    if (proposed.deny === undefined && !proposed.isError) {
      noteLaunch('panel')
      await setView($, () => ({ launchNote: PROPOSED }))
      return
    }
    // Refusée depuis le panneau : Claude la pose dans la conversation.
    refusals.push(reasonOf(proposed))
    if (isAutoModeRefusal(reasonOf(proposed))) autoModeRefusal = { at: tick(), text: reasonOf(proposed) }
    noteLaunch('claude')
    await askClaude($, brief, refusals)
  } catch {
    noteLaunch('claude')
    await askClaude($, brief)
  }
  if ((await read($, viewAtom)).launchNote.startsWith('Lancement impossible')) await release()
}

/**
 * Le brief d'une session de travail sur une tâche : le journal des bilans du dossier, et la clause
 * du Lot quand la session qui lance en est un (elle ne fusionne pas).
 */
async function workBrief($: EngineInterface, source: Source, task: Task, shortTitle: string): Promise<{ title: string; prompt: string; background: string }> {
  const bilanLog = bilanConfigFor(await readOr($, `${source.dir}/cowork.json`)).log
  const own = await readOwnSession($, true)
  const lot = own && (await ownIsLot($, own)) ? own.title || 'Lot' : undefined
  return launchBrief(source, task, shortTitle, bilanLog, lot, await briefFound($, source, task))
}

/** Les chemins de la ligne (`fiche:`, `spec:`, `src:`) qui existent : le brief ne donne à lire que ceux-là (#93). */
async function briefFound($: EngineInterface, source: Source, task: Task): Promise<BriefFound> {
  const found: Record<string, 'file' | 'dir'> = {}
  for (const path of briefPaths(source, task)) {
    try {
      found[path] = (await $.fs.stat(path)).kind === 'file' ? 'file' : 'dir'
    } catch {
      // absent : le brief le nomme sans le donner à lire
    }
  }
  return found
}

/**
 * « Maestro » (Bertrand, 2026-10-27) : ouvre le panneau et rend à Claude l'état d'avancement,
 * orienté objectif — les sessions qui attendent Bertrand, celles qui tournent, et les tâches à
 * lancer, la plus utile d'abord, avec leur carte prête. Rien n'est lancé ni écrit ici.
 */
async function maestroText($: EngineInterface, go: boolean): Promise<string> {
  const source = await sourceNow($)
  if (!source) {
    return `${Person()} a dit « Maestro », mais ce projet (${await $.session.root()}) n'a pas de roadmap : dis-le en une phrase, et propose la skill roadmap:onboarding, qui la pose dans le dépôt (et peut la reconstituer depuis son historique).`
  }
  void openPane($, source)
  // La liste des sessions relue maintenant : qui tourne, qui attend, depuis quand.
  await matchSessions($, source)
  await probeLive($)
  const [open, done, titles, live, ignored, view, now] = await Promise.all([
    load($, files(source).open, 'ROADMAP.md'),
    load($, files(source).done, 'ROADMAP-fait.md'),
    loadTitles($),
    loadLive($),
    loadIgnored($),
    read($, viewAtom),
    $.clock.now(),
  ])
  if (typeof open === 'string') return `${Person()} a dit « Maestro », mais la roadmap ${source.name} est illisible (${open}) : dis-le en une phrase.`
  const all = [...open, ...(typeof done === 'string' ? [] : done)]
  const titleOf = (t: Task) => titles[hashLabel(t.label)]?.titre ?? fallbackTitle(t.label)
  // Toutes les prérequises (#76) : une tâche est bloquée tant qu'une est ouverte, et débloque toutes ses dépendantes.
  const prereq = (t: Task) => prereqsOf(t, all, x => titles[hashLabel(x.label)]?.titre)
  const tracked = (t: Task) => (t.done ? undefined : trackedSession(source, t, live, ignored, now))
  const waiting: MaestroSession[] = []
  const running: MaestroSession[] = []
  for (const t of open.filter(x => !x.done)) {
    const s = tracked(t)
    if (!s) continue
    const sid = s.entry.sessionId
    const last = (sid && lastActivityBySession.get(sid)) || s.entry.startedAt
    const link = s.entry.link
    if (sid && runningBySession.get(sid) === false) waiting.push({ task: t, title: titleOf(t), since: now - last, ...(link ? { link } : {}) })
    else running.push({ task: t, title: titleOf(t), since: now - s.entry.startedAt })
  }
  // Mode Projet (#76) : seules mes tâches se lancent ; celles d'autres personnes se relancent.
  const projet = projectSettings(source).mode === 'projet'
  const ready = launchable(open, { prereqOf: prereq, isLive: t => tracked(t) !== undefined, me: source.me }).filter(
    t => !view.launched.includes(taskKey(t)) && (!projet || isMine(t, source.me)),
  )
  const openTasks = open.filter(t => !t.done)
  const othersLate = projet ? openTasks.filter(t => !isMine(t, source.me) && isOverdue(t, todayOf(now))).length : 0
  // Le réglage autonome (#77) : les cartes sans menu, comme « Maestro go ». Illisible : éteint. Il
  // ne vaut qu'en mode Code (décision du 2026-10-28 : le mode Projet n'a pas de fusion).
  const autonome = !projet && (await readSessionPrefs($).then(r => r.prefs.autonome, () => false))
  const shown = ready.slice(0, go || autonome ? 3 : MAESTRO_MENU)
  const candidates = await Promise.all(
    shown.map(async t => ({
      task: t,
      title: titleOf(t),
      unlocks: unlockedBy(t, openTasks, prereq).length,
      brief: await workBrief($, source, t, titleOf(t)),
    })),
  )
  return maestroContext({
    source,
    today: todayOf(now),
    waiting,
    running,
    candidates,
    more: ready.length - candidates.length,
    go,
    autonome,
    ...(othersLate > 0 ? { othersLate } : {}),
    ...(LAUNCH_EFFORTS.has(settings.launchEffort) ? { launchEffort: settings.launchEffort } : {}),
  })
}

/** Sans outil de lancement utilisable, la demande part à Claude dans la conversation en cours. */
async function askClaude($: EngineInterface, brief: { title: string; prompt: string; background: string }, refusals: readonly string[] = []): Promise<void> {
  try {
    const source = await sourceNow($)
    await submitLaunch($, brief, viaClaudeNote(refusals), source ? projectSettings(source).mode : 'code')
  } catch (err) {
    await setView($, () => ({ launchNote: `Lancement impossible : ${err instanceof Error ? err.message : String(err)}` }))
  }
}

async function submitLaunch($: EngineInterface, brief: { title: string; prompt: string; background: string }, note: string, mode: Mode = 'code'): Promise<void> {
  await $.prompt.submit({
    text: [
      `Propose cette session sous forme de carte (${cardTool(LAUNCH_EFFORTS.has(settings.launchEffort) ? settings.launchEffort : undefined, mode)}), titre « ${brief.title} », avec ce brief. Pose la carte sans essayer de la lancer, puis réponds en une phrase au plus :`,
      '',
      brief.prompt,
      '',
      `Contexte : ${brief.background}`,
    ].join('\n'),
  })
  await setView($, () => ({ launchNote: note }))
}

/**
 * Montre la session d'une tâche : dans la fenêtre si cette session l'a lancée, sinon par son lien
 * (qui ouvre l'app sur elle), sinon un mot dit où la trouver.
 *
 * L'outil part en premier, sans rien lire ni écrire devant (2026-10-23 : la note vidée d'abord
 * coûtait un aller-retour d'état avant l'appel) ; la note se vide après, sans être attendue. Le
 * relevé dit le chemin pris et le temps du clic au retour de l'outil.
 */
async function openSession($: EngineInterface, entry: LiveEntry): Promise<void> {
  const press = lastPress
  const from = press?.at ?? tick()
  const opened = (via: OpenRow['via']) => {
    pushPerf({ mod: PERF_MOD, at: tick(), kind: 'open', ...(press ? { press: press.id } : {}), openMs: tick() - from, via })
    perfFlush?.()
  }
  if (entry.sessionId) {
    try {
      const ran = await $.tool.call({ tool: OPEN_SESSION_TOOL, session_id: entry.sessionId, target: 'focus' })
      if (ran.deny === undefined && !ran.isError) {
        opened('focus')
        void setView($, () => ({ openNote: '' })).catch(() => undefined)
        return
      }
    } catch {
      // outil absent : repli plus bas
    }
  }
  if (entry.link) {
    await $.process.run(['open', entry.link])
    opened('link')
    void setView($, () => ({ openNote: '' })).catch(() => undefined)
    return
  }
  await setView($, () => ({ openNote: `Session « ${entry.title} » : ouvre-la depuis la barre latérale.` }))
  opened('note')
}

/**
 * Archive la session d'une tâche faite. L'archivage se défait depuis la barre latérale ; la tâche
 * cesse aussitôt de pointer vers la session.
 */
async function archiveSession($: EngineInterface, key: string, entry: LiveEntry): Promise<void> {
  await setView($, () => ({ openNote: '' }))
  if (!entry.sessionId) return
  try {
    const ran = await $.tool.call({ tool: ARCHIVE_SESSION_TOOL, session_id: entry.sessionId })
    if (ran.deny !== undefined || ran.isError) {
      await setView($, () => ({ openNote: `Archivage refusé : ${ran.deny ?? ran.text ?? 'sans motif'}` }))
      return
    }
    // La session est archivée : le panneau cesse d'y pointer tout de suite, puis oublie son suivi.
    liveStatus.set(key, 'closed')
    for (const [k, v] of sessionMatches) if (v.sessionId === entry.sessionId) sessionMatches.delete(k)
    await setView($, () => ({ openNote: `Session « ${entry.title} » archivée.` }))
    await update($, liveVersionAtom, v => v + 1)
    try {
      const live = await loadLive($)
      for (const k of Object.keys(live)) if (live[k]?.sessionId === entry.sessionId) delete live[k]
      await $.store.set(LIVE_KEY, live)
      await update($, liveVersionAtom, v => v + 1)
    } catch {
      // stockage indisponible : l'entrée reste, marquée close ; le sondage suivant la retire
    }
  } catch (err) {
    await setView($, () => ({ openNote: `Archivage impossible : ${err instanceof Error ? err.message : String(err)}` }))
  }
}

/** La clôture en cours, au bouton de confirmation : un second clic n'écrit pas deux fois. */
const CANCEL_BUSY = '…'
let cancelling = false
/** La raison tapée dans la confirmation d'annulation ; vidée à chaque nouvelle confirmation. */
let cancelReason = ''

/** La dernière ligne utile d'une sortie d'outil, pour dire un refus sans le recopier en entier. */
function lastLine(text: string): string {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '')
  return clip(lines[lines.length - 1] ?? 'sans message', 300)
}

/** python3 du PATH de l'app, sinon celui du Mac ; isolé (-I) : rien n'est importé du dossier du script ni du dossier courant. */
async function runPython($: EngineInterface, args: string[], cwd: string): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  try {
    return await $.process.run(['python3', '-I', ...args], { cwd, timeoutMs: 60_000 })
  } catch {
    return await $.process.run(['/usr/bin/python3', '-I', ...args], { cwd, timeoutMs: 60_000 })
  }
}

/**
 * Clôt une tâche ouverte : faite (« Marquer faite », #73) ou annulée (« Annuler la tâche », décision
 * de Bertrand du 2026-10-26, cochée « (abandonné) »), en tête de ROADMAP-fait.md, avec son bilan.
 * Dossier Cowork : par `cowork.py roadmap close` (`--abandon` pour une annulée), qui valide et écrit
 * dans l'ordre. Projet sans cowork.py : le panneau écrit les deux fichiers et le journal ; dans git,
 * seulement sur main, sans modification en attente sur ces fichiers, puis il les committe seuls et
 * les pousse (règle de Splitmybill). Rend le numéro de la tâche et, quand tout n'est pas allé au
 * bout, ce qui reste à faire.
 */
async function closeTask(
  $: EngineInterface,
  source: Source,
  task: Task,
  kind: CloseKind,
  reason: string,
): Promise<{ id?: string; note?: string } | { error: string }> {
  const now = new Date(await $.clock.now())
  const day = todayOf(now.getTime())
  const moment = `${day} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const abandon = kind === 'abandon'
  const bilan = abandon ? abandonBilan(reason) : doneBilan()
  const closed = abandon ? 'Annulée' : 'Faite'
  if (await $.fs.exists(`${source.dir}/_cowork/cowork.py`).catch(() => false)) {
    const out = await runPython(
      $,
      [
        `${source.dir}/_cowork/cowork.py`, 'roadmap', 'close', source.dir, '--match-b64', utf8Base64(task.label), '--fait', day,
        ...(abandon ? ['--abandon'] : []),
        '--bilan-b64', utf8Base64(JSON.stringify(bilan)),
      ],
      source.dir,
    )
    if (out.exitCode !== 0) return { error: `cowork.py a refusé, rien n'a été écrit : ${lastLine(out.stderr || out.stdout)}` }
    // Le numéro sur la ligne close qu'imprime cowork.py, pas dans les avertissements qui la précèdent.
    const id = /- \[x\][^\n]*\bid:(\d+)/.exec(out.stdout)?.[1] ?? task.id
    // cowork.py ne connaît pas `tous:` (#99) : il ferme la récurrente, et le panneau le dit.
    return task.tous !== undefined && !abandon ? { id, note: 'récurrence non reconduite par cowork.py' } : { id }
  }
  const config = bilanConfigFor(await readOr($, `${source.dir}/cowork.json`))
  if (!isInsideRelative(config.log)) return { error: `Le journal des bilans « ${config.log} » sort du dossier de la roadmap : rien n'a été écrit.` }
  const written = ['ROADMAP.md', 'ROADMAP-fait.md', ...(day >= config.depuis ? [config.log] : [])]
  const git = (...args: string[]) => $.process.run(['git', '-C', source.dir, ...args], { timeoutMs: 60_000 })
  const head = await git('rev-parse', '--abbrev-ref', 'HEAD')
  const inGit = head.exitCode === 0
  let upstream = false
  if (inGit) {
    const branch = head.stdout.trim()
    if (branch !== 'main' && branch !== 'master') {
      return { error: `${source.name} est sur « ${branch} », pas sur main : sa roadmap ne s'écrit que sur main. Rien n'a été écrit.` }
    }
    const status = await git('status', '--porcelain', '--', ...written)
    if (status.stdout.trim() !== '') {
      return { error: `La roadmap a des modifications non committées (${lastLine(status.stdout)}) : une session l'écrit peut-être. Rien n'a été écrit.` }
    }
    upstream = (await git('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}')).exitCode === 0
    if (upstream) {
      const pull = await git('pull', '--ff-only', '-q')
      if (pull.exitCode !== 0) return { error: `git pull a échoué, rien n'a été écrit : ${lastLine(pull.stderr || pull.stdout)}` }
    }
  }
  const { open, done } = files(source)
  const doneText = await readOr($, done)
  if (doneText === undefined) return { error: "ROADMAP-fait.md est introuvable : rien n'a été écrit." }
  const out = closeInTexts(await $.fs.read(open), doneText, task, moment, kind, reason)
  if ('error' in out) return out
  // Les faites d'abord : une ligne perdue entre les deux écritures ne se retrouve pas.
  await $.fs.write(done, out.done)
  await $.fs.write(open, out.open)
  if (written.length > 2) {
    const log = `${source.dir}/${config.log}`
    await $.fs.write(log, appendBilanCsv(await readOr($, log), bilanCsvRow(day, out.id, bilan)))
  }
  if (!inGit) return { id: out.id }
  if (written.length > 2) await git('add', '--', config.log)
  const commit = await git('commit', '-q', '-m', `roadmap: ${abandon ? 'abandon' : 'done'} #${out.id}`, '--', ...written)
  if (commit.exitCode !== 0) return { id: out.id, note: `${closed}, mais pas committée : ${lastLine(commit.stderr || commit.stdout)}` }
  if (!upstream) return { id: out.id }
  if ((await git('push', '-q')).exitCode === 0) return { id: out.id }
  // Un autre clone a avancé : on se remet dessus, puis un seul nouvel essai.
  const rebase = await git('pull', '--rebase', '-q')
  const push = rebase.exitCode === 0 ? await git('push', '-q') : rebase
  return push.exitCode === 0 ? { id: out.id } : { id: out.id, note: `${closed} et committée, mais pas poussée : ${lastLine(push.stderr || push.stdout)}` }
}

/** Le clic sur « Confirmer » de l'encart : une écriture à la fois, puis le détail montre la tâche faite ou annulée. */
async function confirmClose($: EngineInterface, source: Source, task: Task, kind: CloseKind): Promise<void> {
  if (cancelling) return
  cancelling = true
  try {
    await setView($, () => ({ cancelNote: CANCEL_BUSY }))
    // La raison ne vaut que pour une annulation : tapée puis abandonnée pour « Marquer faite », elle ne passe pas.
    const out = await closeTask($, source, task, kind, kind === 'abandon' ? cancelReason : '').catch((err: unknown) => ({
      error: `${kind === 'abandon' ? 'Annulation' : 'Clôture'} impossible : ${err instanceof Error ? err.message : String(err)}`,
    }))
    if ('error' in out) {
      await setView($, () => ({ cancelNote: out.error }))
      return
    }
    cancelReason = ''
    await setView($, () => ({ cancelAsk: '', cancelNote: out.note ?? '', selected: out.id ? `id:${out.id}` : '' }))
    await update($, retryAtom, v => v + 1)
    try {
      $.ui.toast(`${out.id ? `#${out.id} ` : 'Tâche '}${kind === 'abandon' ? 'annulée' : 'faite'}${out.note ? ` : ${out.note}` : ''}`)
    } catch {
      // pas de toast sur cette surface : le détail le montre
    }
  } finally {
    cancelling = false
  }
}

/**
 * Ouvre un fichier dans le panneau Fichiers de Claude Code, à la ligne voulue. Ce panneau n'ouvre
 * que les dossiers de la session : hors de ceux-là, le fichier part dans l'app par défaut du Mac.
 */
async function openFile($: EngineInterface, path: string, line?: number): Promise<void> {
  await setView($, () => ({ openNote: '' }))
  try {
    const ran = await $.tool.call({ tool: SHOW_PANE_TOOL, pane: 'file', path, ...(line ? { line } : {}) })
    if (ran.deny === undefined && !ran.isError) return
  } catch {
    // outil absent (terminal, autre hôte) : repli plus bas
  }
  await $.process.run(['open', path])
  await setView($, () => ({
    openNote: "Ouvert dans l'app par défaut : ce dossier n'est pas un dossier de la session, le panneau Fichiers ne l'affiche pas.",
  }))
}

// Les filtres d'axe, partagés par la légende et la barre. Un filtre change : les sections se rouvrent.
/** Mode Projet (#99) : un clic sur un axe garde le compteur ou l'état choisi, pour les combiner ; posé à chaque dessin. */
let axisKeepsState = false

function pressAxis($: EngineInterface, a: string): void {
  void setView($, v => ({ axis: v.axis === a ? 'all' : a, attend: axisKeepsState ? v.attend : 'all', showDone: false, closedGroups: [], moreGroups: [] }))
}

function pressDone($: EngineInterface): void {
  void setView($, v => ({ showDone: !v.showDone, axis: 'all', attend: 'all', closedGroups: [], moreGroups: [] }))
}

// --- Mesures du rendu (2026-10-23) ------------------------------------------------------------
// Chaque dessin du panneau note sa durée, son poids et, s'il suit un clic, le délai depuis ce clic ;
// les derniers relevés vont dans le store (clé `perf`), pour les lire pendant qu'on clique.
const PERF_KEY = 'perf'
const PERF_ROWS = 40
/** Les relevés gardés au store, toutes sessions confondues. */
const PERF_KEPT = 120
/**
 * Ce chargement du module : le store est partagé par toutes les sessions, et chacune écrasait les
 * relevés des autres (2026-10-23). Chaque relevé porte la marque de son chargement ; l'écriture
 * remplace les siens et garde ceux des autres.
 */
const PERF_MOD = Math.random().toString(36).slice(2, 8)
type PerfBase = {
  /** Le chargement du module qui l'a noté (une session, jusqu'à son rechargement). */
  mod: string
  /** Heure de fin (ms depuis l'époque). */
  at: number
}
/** Un clic qui mène à une session : du clic au retour de l'outil, et le chemin pris. */
type OpenRow = PerfBase & {
  kind: 'open'
  press?: string
  openMs: number
  /** `focus` : l'outil de la fenêtre ; `link` : le lien de la session ; `note` : ni l'un ni l'autre. */
  via: 'focus' | 'link' | 'note'
}
/** Une relecture des sessions : la liste, les fiches, et les appels d'outil en tout. */
type RefreshRow = PerfBase & {
  kind: 'refresh'
  /** Relecture rapprochée (fenêtre après un clic ou un lancement), sinon celle des 15 s. */
  fast: boolean
  totalMs: number
  listMs: number
  probeMs: number
  calls: number
}
/** Un dessin du panneau. */
type DrawRow = PerfBase & {
  kind?: undefined
  /** Le clic qui l'a provoqué, s'il y en a un depuis le dessin précédent. */
  press?: string
  /** Du clic à la fin du dessin. */
  clickMs?: number
  /** Durée du hook, dont la lecture des données (le reste : construire l'arbre). */
  ms: number
  loadMs: number
  /** Les données venaient de la mémoire du module (aucune lecture de fichier ni du store). */
  cached: boolean
  elements: number
  svg: number
  clients: number
  kb: number
}
/**
 * Un lancement : la carte posée par le panneau, ou demandée à Claude dans la conversation, et le
 * refus brut de l'app, que le panneau n'affiche jamais.
 */
type LaunchRow = PerfBase & {
  kind: 'launch'
  via: 'panel' | 'claude'
  launchMs: number
  /** Les refus de l'app, tels quels, coupés à 300 caractères. */
  refusal?: string
  /** Le panneau n'a pas essayé : le mode auto venait de refuser sa carte. */
  skipped?: boolean
}
type PerfRow = DrawRow | OpenRow | RefreshRow | LaunchRow
const perfRows: PerfRow[] = []
let perfPress: { id: string; at: number } | undefined
/** Le dernier clic, que le dessin ne consomme pas : le trajet jusqu'à la session part de lui. */
let lastPress: { id: string; at: number } | undefined
let perfLoaded = 0
let perfCached = false
let perfFlush: (() => unknown) | undefined
// L'horloge du module : `$.clock.now()` est un aller-retour par appel, et le banc de test la fige.
const tick = () => Date.now()

function notePress(id: string): void {
  perfPress = { id, at: tick() }
  lastPress = perfPress
}

function pushPerf(row: PerfRow): void {
  perfRows.push(row)
  if (perfRows.length > PERF_ROWS) perfRows.splice(0, perfRows.length - PERF_ROWS)
}

/** Les relevés de relecture gardés au plus, pour qu'ils ne chassent pas ceux des dessins. */
const REFRESH_ROWS = 10
/** Une relecture des 15 s part au store au plus une fois par minute ; une rapprochée, toujours. */
const REFRESH_FLUSH_MS = 60_000
let refreshFlushed = 0

function noteRefresh(row: Omit<RefreshRow, 'mod' | 'at' | 'kind'>): void {
  const at = tick()
  pushPerf({ mod: PERF_MOD, at, kind: 'refresh', ...row })
  const refreshes = perfRows.filter(r => r.kind === 'refresh')
  if (refreshes.length > REFRESH_ROWS) perfRows.splice(perfRows.indexOf(refreshes[0] as PerfRow), 1)
  if (row.fast || at - refreshFlushed >= REFRESH_FLUSH_MS) {
    refreshFlushed = at
    perfFlush?.()
  }
}

/** Le poids d'un arbre : ses éléments, ses Svg, ses zones de clic, sa taille sérialisée. */
export function weighTree(tree: unknown): { elements: number; svg: number; clients: number; kb: number } {
  let elements = 0
  let svg = 0
  let clients = 0
  const walk = (n: unknown): void => {
    if (Array.isArray(n)) {
      for (const c of n) walk(c)
      return
    }
    if (!n || typeof n !== 'object') return
    const node = n as { type?: unknown; children?: unknown }
    if (typeof node.type === 'string') {
      elements++
      if (node.type === 'Svg') svg++
      else if (node.type === 'Client') clients++
    }
    walk(node.children)
  }
  walk(tree)
  let size = 0
  try {
    size = JSON.stringify(tree).length
  } catch {
    // arbre non sérialisable : taille inconnue
  }
  return { elements, svg, clients, kb: Math.round(size / 102.4) / 10 }
}

function notePerf(t0: number, tree: unknown): void {
  const end = tick()
  const press = perfPress
  perfPress = undefined
  pushPerf({
    mod: PERF_MOD,
    at: end,
    ...(press ? { press: press.id, clickMs: end - press.at } : {}),
    ms: end - t0,
    loadMs: Math.max(0, perfLoaded - t0),
    cached: perfCached,
    ...weighTree(tree),
  })
  perfFlush?.()
}

let perfWritten = 0

/** Les relevés au store, s'il y en a de nouveaux ; sans attendre l'écriture. */
function writePerf($: EngineInterface): void {
  const last = perfRows[perfRows.length - 1]
  if (!last || last.at === perfWritten) return
  perfWritten = last.at
  void (async () => {
    const stored = await $.store.get(PERF_KEY)
    const others = Array.isArray(stored) ? (stored as PerfRow[]).filter(r => r && r.mod !== PERF_MOD) : []
    const rows = [...others, ...perfRows].sort((a, b) => a.at - b.at).slice(-PERF_KEPT)
    await $.store.set(PERF_KEY, rows)
  })().catch(() => undefined)
}

/**
 * Le fichier local de la personne (#79) : ses noms et ses sources. Relu à chaque besoin, il pose la
 * personne des textes : le réglage `me` du plugin d'abord, sinon les noms du fichier.
 */
async function readPerso($: EngineInterface): Promise<{ me: string[]; sources: Source[] }> {
  let perso: { me: string[]; sources: Source[] } = { me: [], sources: [] }
  let home = ''
  try {
    home = ((await $.env.get('HOME')) ?? '').replace(/\/+$/, '')
  } catch {
    // sans HOME, le chemin part de la racine et la lecture échoue sans bruit
  }
  try {
    perso = parsePerso(await $.fs.read(`${home}/.claude/roadmap-perso.json`))
  } catch {
    // absent ou illisible : pas de nom, aucune source
  }
  setPerson(settings.me.length > 0 ? settings.me : perso.me)
  return perso
}

/** Les réglages de session du projet de la session (#102), et son nom pour le bloc du démarrage. */
async function readSessionPrefs($: EngineInterface): Promise<{ prefs: SessionPrefs; error?: string; project?: string }> {
  await readPerso($)
  const file = await prefsFile($)
  const text = file && (await $.fs.exists(file.path)) ? await $.fs.read(file.path) : undefined
  const project = await sessionProject($)
  const read = sessionPrefs(text, project.key, project.home)
  return project.name === undefined ? read : { ...read, project: project.name }
}

function openPane($: EngineInterface, source: Source) {
  return $.ui.open({ id: PANE, title: `Roadmap ${source.name}`, columns: COLUMNS })
}

/** La réponse de /roadmap (et de /roadmap:roadmap-panel tapée seule) : le panneau ouvert, ou ce qui manque. */
async function openCommand($: EngineInterface): Promise<{ text: string }> {
  const source = await sourceNow($)
  if (!source) {
    return {
      text: `Aucune roadmap pour ce projet (${await $.session.root()}) : la skill onboarding la pose dans le dépôt, ou ajoute un ROADMAP.md à sa racine, ou un .claude/roadmap.json qui dit où elle est.`,
    }
  }
  await refresh($)
  await openPane($, source)

  return { text: `Panneau de la roadmap ${source.name} ouvert.` }
}

export const register: Register = (on, options) => {
  // Un chargement neuf relit tout : les données gardées en mémoire viennent du chargement d'avant.
  paneCache = undefined
  knownSource = undefined
  // La session et le droit de lister les sessions se relisent aussi (un refus de la liste ne survit pas).
  ownSession = null
  listDenied = false
  lastListRows = []
  listDeniedTick = 0
  ownRunningEvent = undefined
  pollTick = 0
  polling = false
  refreshFlushed = 0
  autoModeRefusal = undefined
  settings = {
    me: typeof options.me === 'string' ? splitNames(options.me) : [],
    autoOpen: typeof options.autoOpen === 'boolean' ? options.autoOpen : true,
    titleModel: typeof options.titleModel === 'string' && options.titleModel !== '' ? options.titleModel : 'sonnet',
    capture: typeof options.capture === 'boolean' ? options.capture : true,
    theme: typeof options.theme === 'string' && options.theme !== '' ? options.theme : 'auto',
    launchEffort: typeof options.launchEffort === 'string' && options.launchEffort !== '' ? options.launchEffort : 'high',
    launchBypass: options.launchBypass === true,
  }

  // Le thème de Claude Code a changé : le panneau se redessine dans l'autre palette.
  on('config.set', { key: 'theme' }, async ($, e, next) => {
    const result = await next(e)
    await update($, themeStampAtom, v => v + 1)
    return result
  })

  on('session.start', async ($, e, next) => {
    // Les relevés de mesure partent au store une demi-seconde après un dessin, jamais pendant un
    // clic : l'écriture relit d'abord le store, pour garder les relevés des autres sessions.
    let flushing = false
    perfFlush = () => {
      if (flushing) return
      flushing = true
      $.clock.after(500, () => {
        flushing = false
        writePerf($)
      })
    }
    await $.command.register({
      name: 'roadmap',
      description: 'Ouvrir le panneau de la roadmap du projet',
    })
    // Le volet Réglages vaut dans tout projet, roadmap ou non : les réglages de session valent partout.
    await $.command.register({
      name: 'reglages',
      description: 'Ouvrir le volet des réglages : chaque réglage, son état, changé d\'un clic',
    })
    // Un rechargement (une option changée dans le volet, une mise à jour) garde le volet dessiné avec
    // les boutons de l'ancien module : il se redessine, comme le panneau plus bas.
    let settingsOpen = false
    try {
      settingsOpen = (await $.ui.panes()).some(p => p.id === SETTINGS_PANE)
      if (settingsOpen) {
        await redrawSettings($)
        await watchSettings($)
      }
    } catch {
      // liste des volets indisponible : le volet se redessinera au prochain clic
    }
    const source = await sourceNow($)
    if (source) {
      // Volet Réglages ouvert : ce démarrage est le rechargement d'une option changée, pas une session
      // neuve ; le panneau que Bertrand a fermé reste fermé.
      if (settings.autoOpen && !settingsOpen) void openPane($, source)
      $.clock.every(TICK_MS, () => void poll($))
      void summarize($, source)
      void matchSessions($, source)
      await startCapture($, source)
      // Un rechargement du module (mise à jour, mod en développement) garde le panneau dessiné, avec
      // les boutons de l'ancien module : leurs clics tombaient dans le vide (« ui_press not handled »,
      // 2026-10-22) jusqu'au prochain redessin. On redessine tout de suite.
      await update($, themeStampAtom, v => v + 1)
    }

    return next(e)
  })

  // Réglages de session : ceux du projet de la session (#102), injectés comme contexte additionnel au
  // démarrage (startup, resume, clear, compact), dans tout projet, roadmap ou non. Une panne de lecture ne bloque jamais le démarrage.
  on('classic.SessionStart', async ($, e, next) => {
    const result = await next(e)
    let text: string | undefined
    try {
      const { prefs, error, project } = await readSessionPrefs($)
      text = sessionPrefsText(prefs, error, project)
    } catch {
      text = undefined
    }
    return text === undefined ? result : { ...result, additionalContext: [...(result.additionalContext ?? []), text] }
  })

  // Le rappel du mode ADHD, à chaque message : la consigne du démarrage s'efface au fil de la session.
  // « Maestro » en tête du message : le panneau s'ouvre et Claude reçoit l'état d'avancement.
  on('classic.UserPromptSubmit', async ($, e, next) => {
    const result = await next(e)
    const texts: string[] = []
    try {
      const reminder = sessionPrefsReminder((await readSessionPrefs($)).prefs)
      if (reminder !== undefined) texts.push(reminder)
    } catch {
      // réglages illisibles : pas de rappel
    }
    // Un Lot reçoit les propositions de ses sous-sessions que le message direct n'a pas portées.
    try {
      const proposals = await receiveProposals($)
      if (proposals !== undefined) texts.push(proposals)
    } catch {
      // store illisible : elles attendent le message suivant
    }
    // Un parent reçoit les nouvelles de ses enfants qui coincent ou sont à archiver (#84).
    try {
      const children = await childAlertContext($)
      if (children !== undefined) texts.push(children)
    } catch {
      // liste ou store illisible : pas de nouvelles ce tour-ci
    }
    try {
      await purgeChildNotes($)
    } catch {
      // store illisible : les vieilles notes attendent le prochain chargement
    }
    const prompt = (e as { prompt?: unknown }).prompt
    const call = typeof prompt === 'string' ? maestroCall(prompt) : undefined
    if (call) {
      try {
        await markMaestro($)
      } catch {
        // fiche ou store illisible : le titre et la famille jugent seuls
      }
      try {
        texts.push(await maestroText($, call.go))
      } catch (err) {
        texts.push(`${Person()} a dit « Maestro », mais l'état de la roadmap n'a pas pu être lu (${err instanceof Error ? err.message : String(err)}) : dis-le en une phrase.`)
      }
    }
    return texts.length === 0 ? result : { ...result, additionalContext: [...(result.additionalContext ?? []), ...texts] }
  })

  // Capture des tasks : la grammaire contrôlée à chaque écriture, le rappel en fin de tour.
  on('tool.call', { tool: 'Edit' }, ($, e, next) => written($, () => next(e), e.file_path))
  on('tool.call', { tool: 'Write' }, ($, e, next) => written($, () => next(e), e.file_path))
  on('tool.call', { tool: 'NotebookEdit' }, ($, e, next) => written($, () => next(e), e.notebook_path))
  // La carte New task d'une sous-session remonte à son Lot (#67).
  // Option « Lancer en bypass » : la carte qui reste ici demande le bypass (#87).
  on('tool.call', { tool: START_SESSION_TOOL }, async ($, e, next) => {
    const ran = await forwardProposal($, e, next.origin.plugin, () =>
      next.origin.plugin === 'engine' ? launchWithMode(e, card => next(card as typeof e)) : next(e),
    )
    // Une carte posée (ou remontée au Lot) : l'idée du tour a sa suite (#83).
    if (capture && !ran.isError) capture.cardThisTurn = true
    return ran
  })
  // Un enfant note son état pour son parent (#84) : sa liste d'étapes, sa question, son récap.
  on('tool.call', { tool: UPDATE_PLAN_TOOL }, async ($, e, next) => {
    if (!fromAgent(e)) {
      closingTurn.work = true
      stepList.planned = true
      await update($, stepsAtom, steps => applyPlan(steps, e as never))
      await noteChild($, s => ({ ...withoutQuestion(s), steps: applyPlan(s.steps, e as never) }))
    }
    return next(e)
  })
  // Une maquette montrée à Bertrand (#96) : le rappel de fin de tour se tait pour la session.
  for (const tool of MOCKUP_TOOLS) {
    on('tool.call', { tool }, ($, e, next) => {
      if (capture && !fromAgent(e) && isMockupCall(tool, e)) capture.mockupShown = true
      return next(e)
    })
  }
  on('tool.call', { tool: ASK_TOOL }, async ($, e, next) => {
    if (fromAgent(e)) return next(e)
    if (capture && isMockupCall(ASK_TOOL, e)) capture.mockupShown = true
    const first = (e as { questions?: { question?: unknown }[] }).questions?.[0]?.question
    const text = clip(typeof first === 'string' ? first : '', 160)
    await noteChild($, (s, now) => ({ ...s, question: { text, since: now } }))
    try {
      return await next(e)
    } finally {
      await noteChild($, withoutQuestion)
    }
  })
  on('tool.call', { tool: WRAP_UP_TOOL }, async ($, e, next) => {
    noteBox(e)
    if (!fromAgent(e)) closingTurn = { work: true, box: boxText(e) }
    const recap = (e as { recap?: unknown }).recap
    if (!fromAgent(e)) await noteChild($, s => ({ ...withoutQuestion(s), ...(typeof recap === 'string' ? { recap: clip(recap, 200) } : {}) }))
    return next(e)
  })
  // Les outils du tour, ceux du modèle de la session seule (ni sous-agent, ni appel d'un plugin) :
  // un tour de travail sans liste d'étapes (#98).
  on('tool.call', ($, e, next) => {
    const tool = (e as { tool?: unknown }).tool
    if (next.origin.plugin === 'engine' && !fromAgent(e) && tool !== UPDATE_PLAN_TOOL && tool !== WRAP_UP_TOOL) stepList.tools += 1
    return next(e)
  })
  // Garde-fou du dossier principal (#87) : une commande git interdite n'est pas lancée.
  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const refusal = await guardBash($, (e as { command?: unknown }).command)
    return refusal !== undefined ? { deny: refusal } : written($, () => next(e), undefined, writesRoadmap(e.command))
  })

  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) closingTurn = { work: false, box: '' }
    if (e.agentId === undefined) stepList.tools = 0
    if (e.agentId === undefined && settings.capture && capture) {
      capture.wroteThisTurn = false
      capture.gitAtTurn = await gitState($)
      capture.headAtTurn = await gitHead($)
      capture.roadmapAtTurn = joined(await roadmapNow($, capture.source))
      capture.cardThisTurn = false
      capture.boxThisTurn = ''
    }
    // Cette session reprend la main : sa tâche passe à la roue sans attendre la relecture.
    if (e.agentId === undefined) await markOwnRunning($, true)
    return next(e)
  })

  // Fin d'un tour de cette session (pas d'un agent) : sa tâche « attend ta réponse » tout de suite.
  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (e.agentId === undefined) await markOwnRunning($, false)
    return result
  })

  // Une skill de méthode superpowers, ou swiftui-pro, lancée (outil Skill, commande, préchargement) : notée pour le rappel.
  on('skill.prompt', async ($, e, next) => {
    if (capture && isMethodSkill(e.skill)) capture.methodUsed = true
    if (capture && isSwiftUISkill(e.skill)) capture.swiftUIUsed = true
    return next(e)
  })

  on('classic.Stop', async ($, e, next) => {
    const result = await next(e)
    const c = capture
    // Un autre rappel bloque déjà l'arrêt : la ligne se note, l'archivage attend l'arrêt suivant.
    const ranged = settings.capture ? rangementNote(c, e.last_assistant_message, e.stop_hook_active === true && result.block === undefined) : undefined
    if (ranged !== undefined) return { ...result, block: ranged }
    // Deuxième arrêt du même tour : le modèle a déjà eu le rappel, il a tranché.
    if (e.stop_hook_active || result.block !== undefined) return result
    const notes: (string | undefined)[] = []
    // Les rappels de la roadmap : seulement dans un projet qui en a une, capture allumée.
    if (settings.capture && c) {
      try {
        notes.push(await roadmapBlock($, c))
      } catch {
        // roadmap illisible : pas de rappel de roadmap
      }
      try {
        notes.push(await methodNote($, c))
      } catch {
        // git illisible : pas de rappel de méthode
      }
      try {
        notes.push(await ideaNote($, c, e.last_assistant_message))
      } catch {
        // pas de rappel d'idée
      }
    }
    // La liste d'étapes (#98, #104) : dans tout projet.
    notes.push(stepListNote())
    // Le bloc de fin de tour (#85) : dans tout projet.
    try {
      notes.push(await closingNote($, e.last_assistant_message, settings.capture && c !== undefined && rangementWaiting(c) !== undefined))
    } catch {
      // réglages illisibles : pas de rappel du bloc
    }
    const block = notes.filter((b): b is string => b !== undefined).join('\n\n')
    return block === '' ? result : { ...result, block }
  })

  // Un clic sur la barre : la zone de clic dit quel segment ; un second clic retire le filtre.
  on('ui.message', async ($, e, next) => {
    const ready = (e.data as { ready?: unknown } | null)?.ready
    if (typeof ready === 'string') {
      zoneReady(zones, ready, await $.clock.now())
      return {}
    }
    if (e.element.startsWith(PRESS)) {
      const id = (e.data as { press?: unknown } | null)?.press
      if (typeof id === 'string') {
        notePress(id)
        pressHandlers.get(id)?.()
      }
      return {}
    }
    if (!e.element.startsWith(BAR_HIT)) return next(e)
    const segment = (e.data as { segment?: unknown } | null)?.segment
    if (typeof segment === 'string') notePress(`bar:${segment}`)
    if (segment === DONE_SEGMENT) pressDone($)
    else if (typeof segment === 'string' && segment !== '') pressAxis($, segment)
    return {}
  })

  // Un bouton de l'app : noté pour la mesure du délai jusqu'au dessin suivant.
  on('ui.press', async ($, e, next) => {
    if (e.plugin === 'roadmap') notePress(e.element)
    return next(e)
  })

  on('command.run', { command: 'roadmap' }, async $ => openCommand($))

  on('command.run', { command: 'reglages' }, async $ => openSettings($))

  // La skill des réglages tapée seule ouvre le volet sans passer par le modèle ; suivie d'une demande
  // (« coupe le mode ADHD »), la skill la traite. Lancée par le modèle, le volet s'ouvre aussi.
  on('command.run', { command: SETTINGS_SKILL }, async ($, e, next) => (e.args.trim() === '' ? openSettings($) : next(e)))

  on('skill.prompt', { skill: SETTINGS_SKILL }, async ($, e, next) => {
    const result = await next(e)
    await openSettings($)
    return { ...result, text: `${settingsSkillNote()}\n\n${result.text}` }
  })

  // /roadmap:roadmap-panel tapée seule (Splitmybill, 2026-10-28) : Bertrand la tape pour faire paraître
  // le panneau, et le modèle déroulait la skill jusqu'à un diagnostic. Elle répond comme /roadmap, sans
  // passer par le modèle ; suivie d'une demande (« change les sujets »), la skill la traite.
  on('command.run', { command: PANEL_SKILL }, async ($, e, next) => (e.args.trim() === '' ? openCommand($) : next(e)))

  // La même skill lancée par le modèle, ou tapée sous un nom que le hook ci-dessus n'a pas pris : le
  // panneau s'ouvre aussi, et le texte de la skill le dit en tête.
  on('skill.prompt', { skill: PANEL_SKILL }, async ($, e, next) => {
    const result = await next(e)
    const source = await sourceNow($)
    if (!source) return result
    await refresh($)
    await openPane($, source)
    return { ...result, text: `${panelSkillNote(source.name)}\n\n${result.text}` }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const t0 = tick()
    perfLoaded = t0
    perfCached = false
    const tree = await drawPane($, e)
    notePerf(t0, tree)
    return tree
  })

  on('ui.render', { component: 'Pane', requestId: SETTINGS_PANE }, async ($, e) => drawSettings($, e, await paletteOf($)))

  // La liste d'étapes de la session, fixe au-dessus de la saisie (#104, maquette B) : elle cède à une enquête de l'app.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const band = e.props.hasSurvey ? undefined : stepBand(await read($, stepsAtom))
    if (!band) return next(e)
    const { Box, Text } = $.ui.resolve(e)
    return (
      <Box flexDirection="column">
        <Box flexDirection="row" justifyContent="space-between">
          <Text dimColor>Étapes</Text>
          <Text dimColor>{band.count}</Text>
        </Box>
        {band.rows.map(r =>
          r.status === 'completed' ? (
            <Text dimColor strikethrough>{`${r.mark} ${r.text}`}</Text>
          ) : r.status === 'in_progress' ? (
            <Text bold>{`${r.mark} ${r.text}`}</Text>
          ) : (
            <Text dimColor>{`${r.mark} ${r.text}`}</Text>
          ),
        )}
      </Box>
    )
  })
}

/** Le dessin du panneau : la vue d'ensemble, le détail d'une tâche, ou ce qui manque. */
async function drawPane($: EngineInterface, e: RenderInput<'Pane'>): Promise<RenderElement> {
  // Les gestionnaires de clic ne se vident pas ici : un rendu attend ses lectures, et un clic
  // arrivé pendant ce temps ne trouvait plus son bouton. Chaque rendu réécrit ceux qu'il dessine.
  const { Box, Text, Button } = $.ui.resolve(e)
  const resolved = $.ui.resolve(e)
  // Le champ de saisie n'existe pas sur toutes les surfaces : sans lui, pas de consigne.
  const Input = 'Input' in resolved ? resolved.Input : undefined
  // Le choix de « Qui » (#99) ; sans lui (l'application mobile), un bouton qui passe au nom suivant.
  const Select = e.surface !== 'mobile' && 'Select' in resolved ? resolved.Select : undefined
  const SvgEl = e.surface === 'terminal' ? undefined : $.ui.resolve(e).Svg
  // Les coins arrondis d'une Box à fond : quatre masques de la couleur qui l'entoure, posés dans
  // ses coins (une Box n'a pas d'arrondi). Rien au terminal.
  // Une cale : un Svg de 1 px de large et de la hauteur voulue, qui fixe la hauteur d'une ligne au
  // pixel près (une unité verticale vaut une ligne de texte, un pas d'espacement ne se règle pas).
  // Un Svg sans `alt` ne se dessine pas. Rien au terminal.
  const strut = (height: number) =>
    SvgEl ? <SvgEl source={`<svg xmlns="http://www.w3.org/2000/svg" width="1" height="${height}"/>`} alt="espace" width={1} height={height} /> : null
  const corners = (radius: number, around: string) =>
    SvgEl
      ? CORNERS.map(([corner, at]) => (
          <Box position="absolute" {...at}>
            <SvgEl source={cornerIcon(corner, radius, around)} alt="coin" width={radius} height={radius} />
          </Box>
        ))
      : null
  const pathChip = (path: string, bg: string, around: string) => (
    <Box alignSelf="flex-start" paddingX={1} backgroundColor={bg}>
      {corners(6, around)}
      <Text mono size="caption" wrap="wrap">{path}</Text>
    </Box>
  )

  const source = knownSource === undefined ? await sourceNow($) : (knownSource ?? undefined)
  if (!source) {
    // Pas de roadmap pour le dossier de la session : ce qui en déclare une.
    const p = await paletteOf($)
    return (
      <Box flexDirection="column" gap="sm" paddingX={2} paddingTop="sm">
        {SvgEl && <SvgEl source={folderIcon(p.text2)} alt="dossier" width={24} height={24} />}
        <Text weight="semibold">Pas de roadmap pour ce dossier</Text>
        <Text color={p.text2}>
          Le panneau s'ouvre seul dans un projet qui a une roadmap : un ROADMAP.md à sa racine, un .claude/roadmap.json qui dit où elle est, ou un projet déclaré dans ~/.claude/roadmap-perso.json. La skill onboarding la pose. Puis tape /roadmap.
        </Text>
        {pathChip(await $.session.root(), p.btn, p.bg)}
      </Box>
    )
  }

  // Toutes les lectures d'état d'un coup : une à une, chacune attendait la précédente. Les quatre
  // premières ne servent qu'à redessiner (empreinte des fichiers, titres courts, thème, « Réessayer »,
  // sessions suivies) et disent si les données gardées en mémoire valent encore.
  const [stamp, titlesVersion, themeStamp, retry, liveVersion, view, search, titleNote, zoneGen, now, scanNote] = await Promise.all([
    read($, stampAtom), read($, titlesVersionAtom), read($, themeStampAtom), read($, retryAtom), read($, liveVersionAtom),
    read($, viewAtom), read($, searchAtom), read($, titleNoteAtom), read($, zoneGenAtom), $.clock.now(), read($, scanNoteAtom),
  ])
  const {
    axis: axisRaw, attend: attendRaw, who: whoRaw = 'all', showDone, groupBy, selected, openGroups, closedGroups, moreGroups,
    launchNote, launched, openNote, conclusionOpen, cancelAsk = '', closeKind = 'abandon', cancelNote = '',
  } = view
  const data = await paneData($, source, [stamp, titlesVersion, themeStamp, retry, liveVersion].join('|'))
  const { palette, bilan: bilanData, titles, live: liveEntries, ignored } = data
  const searching = search.trim() !== ''
  const today = todayOf(now)
  const me = source.me
  // La clé d'une zone de clic, à la génération courante ; son premier dessin compte pour la relance.
  const zoneKey = (base: string, module: string) => {
    zoneDrawn(zones, module, now)
    return `${base}-g${zoneGen}`
  }

  const paths = files(source)
  const open = data.open
  if (typeof open === 'string') {
    // Fichier introuvable ou illisible : le chemin, l'erreur, un nouvel essai.
    return (
      <Box flexDirection="column" gap="sm" paddingX={2} paddingTop="sm">
        <Box flexDirection="row" alignItems="center" gap={1}>
          {SvgEl ? <SvgEl source={alertIcon(palette.late)} alt="erreur" width={16} height={16} /> : <Text color="error">!</Text>}
          <Text weight="semibold">Lecture impossible</Text>
        </Box>
        <Text color={palette.text2}>Le fichier de la roadmap est introuvable ou illisible.</Text>
        {pathChip(paths.open, palette.btn, palette.bg)}
        <Text mono size="caption" color={palette.late}>{open}</Text>
        <Box flexDirection="row" alignItems="center" gap={2} marginTop="sm">
          <Box key="retry-row" paddingX={1} paddingY="xs" alignItems="center" backgroundColor={palette.btn} hover={{ backgroundColor: palette.btnHover }}>
            {corners(8, palette.bg)}
            <Button key="retry" plain label="Réessayer" onPress={() => void update($, retryAtom, v => v + 1)} />
          </Box>
          <Text size="caption" color={palette.text2}>Nouvel essai seul toutes les 15 s</Text>
        </Box>
      </Box>
    )
  }
  const done = data.done

  const openTasks = open.filter(t => !t.done)
  const doneTasks = done.filter(t => t.done)
  const short = (t: Task): ShortTitle =>
    titles[hashLabel(t.label)] ?? { titre: fallbackTitle(t.label), sujet: '…' }
  const age = (t: Task): number | undefined => (t.ouvert ? daysBetween(t.ouvert, today) : undefined)
  // Une tâche en session : lancée depuis le panneau, session pas archivée. Sans fiche lisible
  // (outil absent ou refusé), on la croit en session 12 heures, sans le garantir.
  perfLoaded = tick()
  const sessionOf = (t: Task) => trackedSession(source, t, liveEntries, ignored, now)
  // En session : une tâche ouverte qu'une session non archivée travaille (la roue).
  const liveOf = (t: Task) => (t.done ? undefined : sessionOf(t))
  // Une tâche faite dont la session est sûrement ouverte : on peut y retourner, ou l'archiver.
  // Un état inconnu (fiche de session illisible) ne suffit pas : la session est peut-être déjà
  // archivée, et proposer de l'archiver serait faux (2026-10-23).
  const doneSessionOf = (t: Task) => {
    if (!t.done) return undefined
    const found = sessionOf(t)
    return found && found.state === 'open' ? found : undefined
  }
  const isLive = (t: Task) => liveOf(t) !== undefined
  // Tâches enchaînées : `après:` désigne la prérequise ; une tâche est bloquée tant qu'elle n'est pas faite.
  const allTasks = [...openTasks, ...doneTasks]
  // Un seul calcul des prérequises par tâche : la chaîne prend la première, « Débloque » toutes.
  const prereqsCache = new Map<Task, Task[]>()
  const prereqsFor = (t: Task): Task[] => {
    if (!prereqsCache.has(t)) prereqsCache.set(t, prereqsOf(t, allTasks, x => titles[hashLabel(x.label)]?.titre))
    return prereqsCache.get(t) ?? []
  }
  const prereqFor = (t: Task): Task | undefined => firstPrereq(prereqsFor(t))
  const blocked = (t: Task) => isBlocked(t, prereqFor(t))
  const sortOrder = { isLive, prereqOf: prereqFor }
  const select = (key: string) => () => {
    launchExtra = ''
    void setView($, () => ({ selected: key, launchNote: '', openNote: '', cancelAsk: '', cancelNote: '' }))
  }

  // Dessins et couleurs, partagés par la liste et le détail.
  // Sur l'app de bureau (et VS Code, mobile), les couleurs et icônes sont des SVG ; le terminal
  // garde des glyphes. Un bouton impose sa couleur : rien de coloré n'y entre.
  const Svg = e.surface === 'terminal' ? undefined : $.ui.resolve(e).Svg
  const elements = $.ui.resolve(e)
  const Client = 'Client' in elements ? elements.Client : undefined
  // Une zone de clic posée sur une ligne, en dernier enfant (peinte par-dessus) : toute la ligne se
  // clique, et son texte prend sa vraie couleur (un bouton impose la sienne). La légende et les
  // états en ont ; les en-têtes de section aussi, si le total tient sous ZONE_LIMIT (décidé plus
  // bas, une fois les sections connues). Au terminal, les boutons.
  const graphic = Boolean(Client && Svg)
  let headZones = false
  // Les tâches faites dont la ligne porte les boutons de leur session : SESSION_ROWS au plus, les
  // plus récentes ; les autres les gardent dans leur détail.
  let sessionRows = new Set<string>()
  // Les numéros cliquables (tâche avec une session) : une zone chacun, dans ce qui reste sous
  // ZONE_LIMIT après la légende, les états et les boutons de session des faites.
  let numberZones = new Set<string>()
  // Colonnes des chiffres de la légende : 6 et 7 unités ; dans un panneau étroit (moins de 46
  // colonnes, ~360 px), 4 et 5, pour laisser au nom (« Attend un tiers ») la place d'être lu.
  const narrow = ((e.props as { bodyColumns?: number }).bodyColumns ?? 76) < 46
  const numCol = narrow ? 5 : 6
  const shareCol = narrow ? 5 : 7
  // Un nombre de tâches en petite pastille (10 px, fond discret), comme le compte des sections ;
  // estompée avec sa ligne. Au terminal, le nombre seul.
  const countPill = (n: number, dim: boolean, ink: string) => {
    if (!Svg) return <Text tabular color={ink}>{String(n)}</Text>
    const pill = pillIcon({ text: String(n), bg: mixOver(palette.sel, palette.bg, 0.6), fg: palette.text2, weight: 500, size: 10, height: 16 })
    return <Svg source={fade(pill.source, dim)} alt={String(n)} width={pill.width} height={pill.height} />
  }
  // Le numéro d'une tâche devant son titre : petit, discret, suivi d'un point de séparation. Hors du
  // bouton, qui imposerait sa couleur au texte.
  // `open` : la tâche a une session ouverte, et un clic sur son numéro y mène.
  const taskNumber = (id: string, open?: () => void) => (
    // Une colonne de 6 de large (un numéro cliquable est un bouton, dont la marge intérieure
    // tronquait « #133 » dans 4), calée à droite : le point colle au numéro et les titres restent
    // alignés ; l'écart des numéros courts passe à gauche, contre le carré (2026-10-23).
    <Box key={`n:${id}`} width={6} flexDirection="row" justifyContent="flex-end" alignItems="center" flexShrink={0}>
      {open && !graphic ? (
        <Button key={`num:${id}`} plain dimColor onPress={open}>{`#${id}`}</Button>
      ) : open && numberZones.has(id) ? (
        // Un bouton de l'app imposait sa taille de texte : le numéro cliquable sortait plus gros
        // que les autres (2026-10-23). Il reste du texte, et une zone de clic se pose dessus.
        <Text size="caption" tabular color={palette.text2} hover={{ underline: true }}>{`#${id}`}</Text>
      ) : null}
      {/* Sans clic, le numéro et le point en un seul texte : un élément de moins par ligne. */}
      <Text size="caption" tabular color={palette.text2}>{open && (numberZones.has(id) || !graphic) ? ' ·' : `#${id} ·`}</Text>
      {open && numberZones.has(id) && hit(`num:${id}`, open, 1)}
    </Box>
  )
  // `rows` : la hauteur de la zone en lignes de texte (20 px). Sans elle, la zone prend la hauteur
  // de ce qu'elle couvre — sous une ligne (une icône de 16 px), elle tombait à zéro et ne
  // recevait aucun clic (2026-10-23).
  const hit = (id: string, onPress: () => void, rows?: number) => {
    if (!graphic || !Client) return null
    pressHandlers.set(id, onPress)
    return rows === undefined ? (
      <Box position="absolute" top={0} left={0} right={0} bottom={0}>
        <Client key={zoneKey(pressKey(id), 'press-hit')} module="./press-hit.tsx" props={{ id }} width="100%" height="100%" />
      </Box>
    ) : (
      <Box position="absolute" top={0} left={0} right={0}>
        <Client key={zoneKey(pressKey(id), 'press-hit')} module="./press-hit.tsx" props={{ id }} width="100%" height={rows} />
      </Box>
    )
  }
  const icon = (source: string, alt: string, size: number, glyph: string, color: string) =>
    Svg ? <Svg source={source} alt={alt} width={size} height={size} /> : <Text color={color}>{glyph}</Text>
  // La même, au milieu d'une case de 24 px de haut : la hauteur de la ligne, sans cale à côté.
  const tallIcon = (source: string, alt: string, size: number, glyph: string, color: string) =>
    Svg ? <Svg source={rowMark(source, size, 24)} alt={alt} width={size} height={24} /> : <Text color={color}>{glyph}</Text>
  // Sélection sans fond : sous un filtre, les autres lignes du groupe passent à l'opacité 0,4. Une
  // Box n'a pas d'opacité : le texte prend la couleur mélangée au fond, le dessin une opacité.
  const faded = (hex: string, dim: boolean) => (dim ? mixOver(hex, palette.bg, 0.4) : hex)
  const fade = (source: string, dim: boolean) => (dim ? faint(source) : source)

  // Couleur d'axe : les axes les plus chargés d'abord, comme les captures du design.
  const order = axisOrder(openTasks, doneTasks)
  // Un axe dont toutes les tâches sont faites n'a plus de ligne dans la légende ni de segment :
  // il compte dans « Faites » (sa couleur, tirée de `order`, ne bouge pas pour autant).
  const axes = order.filter(a => axisCount(openTasks, a) > 0)
  // Un axe choisi qui n'a plus de tâche ouverte ne filtre plus rien : retour à tous les axes.
  const axis = axisRaw === 'all' || axes.includes(axisRaw) ? axisRaw : 'all'
  const axisHex = (a: string): string => axisColor(palette, order.indexOf(a))
  const axisTheme = (a: string): string => AXIS_THEME[Math.max(order.indexOf(a), 0) % AXIS_THEME.length] ?? 'subtle'
  const square = (hex: string, theme: string, alt: string) => icon(squareIcon(hex), alt, 16, '■', theme)
  // Une pastille arrondie, dessinée en SVG ; le terminal, sans SVG, garde un fond de texte.
  const drawnPill = (o: { text: string; bg: string; fg: string; mark?: PillMark; height?: number; weight?: 500 | 600; size?: number }) => {
    if (Svg) {
      const pill = pillIcon(o)
      return <Svg source={pill.source} alt={o.text} width={pill.width} height={pill.height} />
    }
    return (
      <Box flexDirection="row" paddingX={1} flexShrink={0} backgroundColor={o.bg}>
        <Text color={o.fg} wrap="end">{o.text}</Text>
      </Box>
    )
  }
  const axisPill = (t: Task) => {
    const bg = axisTint(palette, axisHex(t.axis))
    if (Svg) {
      const pill = axisPillIcon({ name: axisLabel(t.axis), hex: axisHex(t.axis), bg, fg: palette.text })
      return <Svg source={pill.source} alt={axisLabel(t.axis)} width={pill.width} height={pill.height} />
    }
    return (
      <Box flexDirection="row" alignItems="center" gap="xs" paddingX={1} backgroundColor={bg}>
        {icon(squareIcon(axisHex(t.axis)), t.axis, 16, '■', axisTheme(t.axis))}
        <Text weight="semibold" color={palette.text}>{axisLabel(t.axis)}</Text>
      </Box>
    )
  }
  // Une pastille du détail : grise (date relative), rouge (retard, horloge) ou violette (tiers, personne).
  const tag = (text: string, kind: 'soft' | 'late' | 'soon' | 'wait') =>
    kind === 'late'
      ? drawnPill({ text, bg: palette.lateTint, fg: palette.lateOn, mark: 'clock', height: 20 })
      : kind === 'soon'
        ? drawnPill({ text, bg: palette.blockTint, fg: palette.blockOn, height: 20 })
      : kind === 'wait'
        ? drawnPill({ text, bg: palette.waitTint, fg: palette.waitOn, mark: 'person', height: 20 })
        : drawnPill({ text, bg: palette.sel, fg: palette.text2, height: 20, weight: 500 })
  // La priorité (`prio:`) : P1 rouge, P2 orange, P3 grise. Elle reste sur la ligne d'une tâche en
  // session ou bloquée : un P1 bloqué est justement ce qu'il faut voir.
  const prioColors: Record<Prio, { bg: string; fg: string; weight: 500 | 600 }> = {
    '1': { bg: palette.lateTint, fg: palette.lateOn, weight: 600 },
    '2': { bg: palette.blockTint, fg: palette.blockOn, weight: 600 },
    '3': { bg: palette.sel, fg: palette.text2, weight: 500 },
  }
  const prioPill = (p: Prio, height?: number) => drawnPill({ text: `P${p}`, ...prioColors[p], ...(height ? { height } : {}) })
  // Une tâche née d'un retour de l'app, ou qui en a reçu (`feedback:`) : violette, la voix d'un testeur.
  const feedbackPill = (height?: number) =>
    drawnPill({ text: 'Feedback', bg: palette.waitTint, fg: palette.waitOn, weight: 500, ...(height ? { height } : {}) })

  // --- Détail d'une task ---------------------------------------------------
  const current = findSelected([...openTasks, ...doneTasks], selected)
  if (current) {
    const s = short(current)
    const days = age(current)
    const subject = s.sujet === '…' ? 'À classer' : s.sujet
    const line = Number(current.key.split(':').pop())
    const fichePath = current.fiche ? `${source.dir}/${current.fiche}` : undefined
    const srcPath = current.src ? `${source.dir}/${current.src}` : undefined
    const due = current.due && !current.done ? dueLabel(current.due, today) : undefined
    const live = liveOf(current)
    const kept = doneSessionOf(current)
    const abandoned = isAbandoned(current)
    const asking = cancelAsk === taskKey(current)
    const pre = prereqFor(current)
    const { cles } = projectSettings(source)
    const unlocks = allTasks.filter(t => prereqsFor(t).includes(current))
    // Sa place dans sa chaîne d'ouvertes : « étape 2 sur 4 ».
    const openSet = new Set(openTasks)
    const head = current.done ? current : chainHead(current, prereqFor, openSet)
    const chain = current.done ? [] : [head, ...unlockedBy(head, openTasks, prereqFor)]
    const steps = chain.length > 1 ? chainSteps(sortTasks(chain, sortOrder), prereqFor) : new Map<Task, ChainStep>()
    const stepOf = steps.get(current)
    const lastStep = Math.max(0, ...[...steps.values()].map(x => x.step))
    // Un lien vers une tâche enchaînée : carré d'axe, titre (cliquable), et son état.
    const link = (x: Task) => (
      <Box flexDirection="row" alignItems="center" gap={1}>
        {icon(squareIcon(axisHex(x.axis)), x.axis, 16, '■', axisTheme(x.axis))}
        {x.id && taskNumber(x.id)}
        <Button key={`link:${x.key}`} plain hover={{ underline: true }} onPress={select(selectionOf(x))}>
          <Text wrap="truncate-end">{short(x).titre}</Text>
        </Button>
        {x.done ? (
          <Box flexDirection="row" alignItems="center" gap={1}>
            {icon(checkIcon(palette.ok, 12, STROKE.pill), 'faite', 12, '✓', 'success')}
            <Text size="caption" weight="medium" color={palette.ok}>faite</Text>
          </Box>
        ) : isLive(x) ? (
          drawnPill({ text: 'en session', bg: palette.liveTint, fg: palette.liveOn, mark: 'spinner', height: 20 })
        ) : (
          drawnPill({ text: 'à faire', bg: palette.sel, fg: palette.text2, height: 20, weight: 500 })
        )}
      </Box>
    )
    // Un champ : son nom sur 10 unités, la valeur à côté ; absent, rien.
    const field = (name: string, value: RenderElement | undefined | false, key = name) =>
      value ? (
        <Box key={`field:${key}`} flexDirection="row" alignItems="center">
          <Box width={10} flexShrink={0} flexDirection="row" alignItems="center">
            {strut(28)}
            <Text color={palette.text2}>{name}</Text>
          </Box>
          <Box flexDirection="row" alignItems="center" gap={1} flexShrink={1} minWidth={0}>
            {value}
          </Box>
        </Box>
      ) : null
    const plain = (text: string | undefined) => text !== undefined && text !== '' && <Text wrap="truncate-end">{text}</Text>
    const strong = (text: string) => <Text weight="semibold" tabular>{text}</Text>
    // Le bilan d'une task faite, déplié dans sa conclusion : ressenti en pastille, cause, corrections.
    const bilan = current.done && current.id ? bilanData.bilans.get(current.id) : undefined
    const bilanView = (): RenderElement | false => {
      if (bilan) {
        const tone =
          bilan.ressenti === 'fluide'
            ? { bg: mixOver(palette.ok, palette.bg, 0.2), fg: palette.ok }
            : bilan.ressenti === 'bloqué'
              ? { bg: palette.lateTint, fg: palette.lateOn }
              : { bg: palette.sel, fg: palette.text }
        const n = Number(bilan.corrections)
        return (
          <Box flexDirection="row" alignItems="center" gap={1}>
            {drawnPill({ text: bilan.ressenti, ...tone, height: 20, weight: 500 })}
            {bilan.cause !== '' && bilan.cause !== 'aucune' && <Text>{bilan.cause}</Text>}
            {bilan.corrections !== '' && (
              <Text color={palette.text2}>{`· ${n} correction${n > 1 ? 's' : ''}`}</Text>
            )}
          </Box>
        )
      }
      return false
    }
    // La boîte « Conclusion » d'une faite (#264) : ce qui a été fait, le souci ou une phrase sympa ;
    // « Tout voir », un bouton de l'app (aucune zone de clic de plus), ajoute ressenti, cause,
    // corrections et la note entière. Sans bilan alors qu'il est dû : « Conclusion manquante ».
    const conclusionDue = current.done && current.id !== undefined && (current.fait ?? '').slice(0, 10) >= bilanData.config.depuis
    const conclusionBox = (): RenderElement | null => {
      if (!current.done || (!bilan && !conclusionDue)) return null
      if (!bilan) {
        return (
          <Box key="conclusion-box" paddingX={1}>
            <Box flexDirection="row" alignItems="center" gap={1} paddingX={1} flexGrow={1} backgroundColor={palette.lateTint}>
              {corners(8, palette.bg)}
              {strut(32)}
              <Text weight="semibold" color={palette.lateOn}>Conclusion manquante</Text>
            </Box>
          </Box>
        )
      }
      const c = conclusionOf(bilan, isAbandoned(current))
      const opened = conclusionOpen === current.key
      return (
        <Box key="conclusion-box" paddingX={1}>
          <Box flexDirection="column" gap="xs" paddingX={1} paddingY="sm" flexGrow={1} backgroundColor={palette.note}>
            {corners(8, palette.bg)}
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <Box flexDirection="row" alignItems="center" gap={1}>
                <Text>{c.emoji}</Text>
                <Text weight="semibold">Conclusion</Text>
              </Box>
              <Button
                key="conclusion"
                plain
                dimColor
                label={opened ? 'Replier' : 'Tout voir'}
                onPress={() => void setView($, v => ({ conclusionOpen: v.conclusionOpen === current.key ? '' : current.key }))}
              />
            </Box>
            <Text wrap="wrap">{c.fait}</Text>
            <Text wrap="wrap" color={c.smooth ? palette.ok : palette.text2}>{c.souci}</Text>
            {opened && bilanView()}
            {opened && bilan.note !== '' && <Text wrap="wrap" color={palette.text2}>{bilan.note}</Text>}
          </Box>
        </Box>
      )
    }
    const mono = (text: string | undefined) =>
      text !== undefined && text !== '' && (
        <Text mono size="caption" color={palette.text2} wrap="wrap">
          {text}
        </Text>
      )
    // Un bouton dessiné (Box et Svg), recouvert d'une zone de clic : un bouton de l'app ne porte
    // que du texte et ne s'étire pas. Au terminal, sans Svg, le bouton de l'app.
    const pressable = (id: string, onPress: () => void, look: RenderElement, fallback: RenderElement, grow = false) => {
      if (!Client || !Svg) return fallback
      pressHandlers.set(id, onPress)
      return (
        <Box key={`pressable:${id}`} flexGrow={grow ? 1 : 0} flexShrink={0}>
          {look}
          {/* La zone de clic se compte en lignes de texte (20 px) : à 100 % d'un bouton de 32 px,
              elle pouvait n'en couvrir que le haut, et un clic dans le bas se perdait. Deux
              lignes couvrent le bouton entier ; elles débordent de 8 px sur l'espace dessous. */}
          <Box position="absolute" top={0} left={0} right={0}>
            <Client key={zoneKey(pressKey(id), 'press-hit')} module="./press-hit.tsx" props={{ id }} width="100%" height={BUTTON_HIT_ROWS} />
          </Box>
        </Box>
      )
    }
    // Le bouton principal : pleine largeur, fond `pri`, icône et texte `priText`.
    // Le bouton principal une fois le lancement demandé : grisé, sans zone de clic, pour qu'un
    // second clic ne fasse pas une seconde session. « Relancer », dessous, le rend s'il le faut.
    // Pendant les appels à l'app, la roue et « Lancement… » : rien n'est cliquable.
    const requested = () => {
      const pending = launchNote === LAUNCHING
      const label = pending ? 'Lancement…' : 'Lancement demandé'
      return Svg ? (
        <Box key="launch-requested" flexDirection="row" justifyContent="center" alignItems="center" gap={1} flexGrow={1} backgroundColor={palette.btn}>
          {corners(8, palette.bg)}
          <Box flexDirection="row" alignItems="center">
            {strut(32)}
            {pending ? (
              <Svg source={spinnerIcon(palette.text2, 14, undefined, false, now)} alt="lancement" width={14} height={14} isInteractive />
            ) : (
              <Svg source={checkIcon(palette.text2, 14)} alt="demandé" width={14} height={14} />
            )}
          </Box>
          <Text weight="semibold" color={palette.text2}>{label}</Text>
        </Box>
      ) : (
        <Text dimColor>{label}</Text>
      )
    }
    // `tone` : d'autres couleurs que `pri` (le bleu de la carte d'une session), et le fond qui
    // l'entoure pour ses coins.
    const primary = (
      id: string,
      mark: string,
      label: string,
      onPress: () => void,
      tone: { bg: string; fg: string; around: string } = { bg: palette.pri, fg: palette.priText, around: palette.bg },
    ) =>
      pressable(
        id,
        onPress,
        <Box
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          gap={1}
          flexGrow={1}
          backgroundColor={tone.bg}
          hover={{ backgroundColor: mixOver(tone.bg, tone.around, 0.88) }}
        >
          {corners(8, tone.around)}
          <Box flexDirection="row" alignItems="center">
            {strut(32)}
            {Svg && <Svg source={mark} alt="icône" width={14} height={14} />}
          </Box>
          <Text weight="semibold" color={tone.fg}>{label}</Text>
        </Box>,
        <Button key={id} variant="primary" label={label} onPress={onPress} />,
        true,
      )
    // Un bouton icône : carré, fond `btn`, icône de 16 ; au terminal, le mot.
    const action = (key: string, mark: string, label: string, onPress: () => void, scope?: string) =>
      pressable(
        key,
        onPress,
        <Box
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          paddingX={1}
          backgroundColor={palette.btn}
          hover={{ backgroundColor: palette.btnHover, ...(scope ? { scope } : {}) }}
        >
          {corners(8, palette.bg)}
          {strut(32)}
          {Svg && <Svg source={mark} alt={label} width={16} height={16} />}
        </Box>,
        <Button key={key} plain label={label} onPress={onPress} />,
      )
    return (
      <Box flexDirection="column" gap="md" paddingX={1}>
        <Box key="back-row" flexDirection="row" justifyContent="space-between" paddingX={1} alignItems="center">
          <Box flexDirection="row" alignItems="center">
            {strut(24)}
            <Button key="back" plain dimColor label="‹ Retour à la liste" onPress={select('')} />
          </Box>
          <Button
            key="open-line"
            plain
            dimColor
            label="Voir dans la roadmap"
            onPress={() => void openFile($, `${source.dir}/${current.done ? 'ROADMAP-fait.md' : 'ROADMAP.md'}`, line)}
          />
        </Box>

        <Box flexDirection="column" gap="xs" paddingX={1}>
          <Box flexDirection="row" alignItems="center" gap={1}>
            {axisPill(current)}
            {current.prio && !current.done && prioPill(current.prio, 20)}
            {current.feedback && feedbackPill(20)}
            {current.id && <Text tabular color={palette.text2}>{`#${current.id}`}</Text>}
            <Text color={palette.text2} wrap="truncate-end">{subject}</Text>
            {current.done && !abandoned && icon(checkIcon(palette.ok, 14), 'faite', 14, '✓', 'success')}
            {current.done && !abandoned && <Text color={palette.ok}>faite</Text>}
            {abandoned && <Text color={palette.text2}>⊘</Text>}
            {abandoned && <Text color={palette.text2}>annulée</Text>}
          </Box>
          {/* La fiche (et la source) devant le titre : ce qu'on lit avant de lancer. */}
          <Box flexDirection="row" alignItems="center" gap={1}>
            {fichePath && action('open-fiche', documentIcon(palette.text), 'Fiche', () => void openFile($, fichePath))}
            {srcPath && action('open-src', externalIcon(palette.text), 'Source', () => void openFile($, srcPath))}
            <Text size="heading" weight="semibold">{s.titre}</Text>
          </Box>
        </Box>

        {conclusionBox()}

        {/* La note, au retrait du texte : 2 colonnes de marge intérieure, fond `note`. */}
        <Box paddingX={1}>
          <Box flexDirection="column" gap="xs" paddingX={1} paddingY="sm" flexGrow={1} backgroundColor={palette.note}>
            {corners(8, palette.bg)}
            <Text>{current.label}</Text>
            {current.note && <Text color={palette.text2}>{current.note}</Text>}
          </Box>
        </Box>

        <Box flexDirection="column" paddingX={1}>
          {/* « En cours » veut dire : une session y travaille. La section « ## En cours » du fichier
              est la liste à faire, elle ne s'affiche pas comme un état (choix de Bertrand, 2026-10-22). */}
          {!current.done &&
            !live &&
            field(
              'État',
              <Box flexDirection="row" alignItems="center" gap={1}>
                {pre && isBlocked(current, pre) && Svg && <Svg source={lockIcon(palette.block, 14)} alt="bloquée" width={14} height={14} />}
                <Text color={pre && isBlocked(current, pre) ? palette.block : palette.text}>
                  {pre && isBlocked(current, pre) ? 'Bloquée' : 'À faire'}
                </Text>
              </Box>,
            )}
          {current.section !== '' && current.section !== 'En cours' && field('Section', plain(current.section))}
          {stepOf && field('Étape', plain(`${stepOf.step} sur ${lastStep} de la chaîne`))}
          {prereqsFor(current).map((x, i) => field(i === 0 ? 'Après' : '', link(x), `Après:${x.key}`))}
          {missingPrereqs(current, allTasks).map((n, i) =>
            field(i === 0 && prereqsFor(current).length === 0 ? 'Après' : '', plain(`#${n} introuvable`), `Après:#${n}`),
          )}
          {unlocks.map((d, i) => field(i === 0 ? 'Débloque' : '', link(d), `Débloque:${d.key}`))}
          {field(
            'Attend',
            // Au détail, la pastille courte puis la précision entière, sur plusieurs lignes s'il le faut.
            current.attend !== undefined &&
              (me.includes(attendWho(current.attend)) && current.attend === attendWho(current.attend) ? (
                plain(current.attend)
              ) : (
                <Box flexDirection="column" gap="xs" flexShrink={1}>
                  {me.includes(attendWho(current.attend)) ? plain(attendWho(current.attend)) : tag(shortAttend(current.attend), 'wait')}
                  {current.attend.trim() !== attendWho(current.attend) && (
                    <Text size="caption" color={palette.text2} wrap="wrap">{current.attend}</Text>
                  )}
                </Box>
              )),
          )}
          {field('Retours', current.feedback && plain(current.feedback.map(n => `#${n}`).join(', ')))}
          {/* Mode Projet (#76) : la personne qui porte la tâche, sa mère et ses sous-tâches, les clés déclarées. */}
          {field(
            'Responsable',
            current.resp !== undefined && (me.includes(attendWho(current.resp)) ? plain(current.resp) : tag(shortAttend(current.resp), 'wait')),
          )}
          {current.parent !== undefined &&
            (() => {
              const mother = allTasks.find(x => x !== current && x.id === current.parent)
              return field(
                'Parent',
                // Son lien dit déjà « faite » (#86).
                mother ? link(mother) : plain(`#${current.parent} introuvable`),
              )
            })()}
          {allTasks
            .filter(x => x !== current && current.id !== undefined && x.parent === current.id)
            .map((x, i) => field(i === 0 ? 'Sous-tâches' : '', link(x), `Sous-tâches:${x.key}`))}
          {Object.keys(cles).map(k =>
            field(`${k.charAt(0).toUpperCase()}${k.slice(1)}`, plain(current.extra?.[k]?.join(', ')), `cle:${k}`),
          )}
          {field('Qui', plain(current.qui))}
          {field('Branche', mono(current.branche))}
          {field(
            'Échéance',
            current.due !== undefined && (
              <Box flexDirection="row" alignItems="center" gap={1}>
                {strong(frDate(current.due))}
                {due && current.due && tag(due.text, due.late ? 'late' : isDueSoon(current, today) ? 'soon' : 'soft')}
              </Box>
            ),
          )}
          {field(abandoned ? 'Annulée le' : 'Faite le', current.fait !== undefined && strong(doneLabel(current.fait)))}
          {field('Source', mono(current.src))}
          {field('Spec', mono(current.spec))}
        </Box>

        <Box flexDirection="column" gap="sm">
          {/* Bloquée : l'avertissement au-dessus des actions ; « Lancer » reste possible. */}
          {pre && isBlocked(current, pre) && (
            <Box flexDirection="row" alignItems="center" gap={1} paddingX={1} backgroundColor={palette.blockTint}>
              {corners(8, palette.bg)}
              {strut(32)}
              {Svg ? (
                <Svg source={lockIcon(palette.blockOn, 14, STROKE.small)} alt="bloquée" width={14} height={14} />
              ) : (
                <Text color="warning">⊘</Text>
              )}
              <Box flexShrink={1}>
                <Text weight="semibold" color={palette.blockOn}>{`Bloquée : « ${short(pre).titre} » n'est pas encore faite.`}</Text>
              </Box>
            </Box>
          )}
          {/* En session : une carte bleue, l'état et depuis quand, puis « Ouvrir la session ». */}
          {live && (
            <Box key="live-card" flexDirection="column" gap="sm" padding="sm" borderStyle="round" borderColor={mixOver(palette.liveOn, palette.bg, 0.3)} backgroundColor={palette.liveTint}>
              <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                <Box flexDirection="row" alignItems="center" gap={1}>
                  {live.state === 'open' && Svg && (live.entry.sessionId && runningBySession.get(live.entry.sessionId) === false ? (
                    <Svg source={handIcon(palette.liveOn, 16)} alt="attend ta réponse" width={16} height={16} />
                  ) : (
                    <Svg source={spinnerIcon(palette.liveOn, 16, undefined, false, now)} alt="en cours" width={16} height={16} isInteractive />
                  ))}
                  <Text color={palette.liveOn}>
                    {live.state !== 'open'
                      ? sessionTitleKind(live.entry.title) === 'check' ? 'Vérification lancée' : 'Session lancée'
                      : live.entry.sessionId && runningBySession.get(live.entry.sessionId) === false
                        ? sessionTitleKind(live.entry.title) === 'check' ? 'La vérification attend ta réponse' : 'La session attend ta réponse'
                        : sessionTitleKind(live.entry.title) === 'check' ? 'Vérification en cours' : 'Session en cours'}
                  </Text>
                </Box>
                <Text tabular color={palette.liveOn}>{durationLabel(now - live.entry.startedAt)}</Text>
              </Box>
              <Box flexDirection="row">
                {primary('open-session', externalIcon(palette.bg, 14), 'Ouvrir la session', () => void openSession($, live.entry), {
                  bg: palette.live,
                  fg: palette.bg,
                  around: palette.liveTint,
                })}
              </Box>
            </Box>
          )}
          <Box flexDirection="row" alignItems="stretch" gap={1}>
            {kept && primary('open-session', externalIcon(palette.priText, 14), 'Ouvrir la session', () => void openSession($, kept.entry))}
            {kept && action('archive-session', archiveIcon(palette.text), 'Archiver la session', () => void archiveSession($, kept.key, kept.entry))}
            {!current.done && !live && launched.includes(taskKey(current)) && requested()}
            {/* Un clic lance : plus de confirmation (2026-10-25) ; le message additionnel suit. */}
            {!current.done &&
              !live &&
              !launched.includes(taskKey(current)) &&
              primary('launch', playIcon(palette.priText, 14), 'Lancer', () => void launchSession($, source, current, s.titre, launchExtra))}
            {/* « Vérifier » : une session qui dit si la tâche est encore à jour, sans la faire. Un
                bouton de l'app, sans zone de clic : le dessin en compte au plus ZONE_LIMIT. */}
            {!current.done && !live && !launched.includes(taskKey(current)) && (
              <Box key="check-row" flexDirection="row" alignItems="center">
                <Button key="check" label="Vérifier" onPress={() => void launchSession($, source, current, s.titre, launchExtra, 'check')} />
              </Box>
            )}
          </Box>
          {/* « Marquer faite » (#73) et « Annuler la tâche » : la tâche ne s'efface pas, elle descend en
              tête des faites, avec son bilan ; une confirmation d'abord (décisions de Bertrand du
              2026-10-26 et du 2026-10-28). Visibles même quand une session tient la tâche : elle a pu
              livrer sans cocher ; l'encart le rappelle. Une rangée à eux : avec « Lancer » et
              « Vérifier », quatre boutons débordent du panneau étroit. */}
          {!current.done && !(asking && cancelNote === CANCEL_BUSY) && (
            <Box key="close-row" flexDirection="row" alignItems="center" gap={1}>
              {(['done', 'abandon'] as const)
                .filter(kind => !(asking && closeKind === kind))
                .map(kind => (
                  <Button
                    key={kind === 'done' ? 'done' : 'cancel'}
                    plain
                    dimColor
                    label={kind === 'done' ? 'Marquer faite' : 'Annuler la tâche'}
                    onPress={() => {
                      cancelReason = ''
                      void setView($, () => ({ cancelAsk: taskKey(current), closeKind: kind, cancelNote: '' }))
                    }}
                  />
                ))}
            </Box>
          )}
          {asking && !current.done && (
            <Box key="cancel-box" flexDirection="column" gap="sm" padding="sm" borderStyle="round" borderColor={palette.border}>
              <Text weight="semibold" wrap="wrap">
                {closeKind === 'done'
                  ? `Marquer${current.id ? ` #${current.id}` : ''} « ${s.titre} » faite ?`
                  : `Annuler${current.id ? ` #${current.id}` : ''} « ${s.titre} » ?`}
              </Text>
              <Text size="caption" color={palette.text2} wrap="wrap">
                {`${
                  closeKind === 'done'
                    ? 'Elle descend en tête des faites, avec le bilan « Marquée faite depuis le panneau Roadmap ».'
                    : "Elle ne s'efface pas : cochée « (abandonné) », elle descend en tête des faites, avec son bilan."
                }${bilanData.viaCowork ? '' : ' Dans git : commit et push sur main.'}`}
              </Text>
              {(live || launched.includes(taskKey(current))) && (
                <Text size="caption" color={palette.lateOn} wrap="wrap">Une session tient cette tâche : elle peut encore l'écrire.</Text>
              )}
              {closeKind === 'abandon' && Input && (
                <Input
                  key={`cancel-reason:${current.key}`}
                  rows={2}
                  placeholder="Raison (facultatif)"
                  submitLabel="annuler"
                  onInput={(value: string) => {
                    cancelReason = value
                  }}
                  onSubmit={(value: string) => {
                    cancelReason = value
                    void confirmClose($, source, current, 'abandon')
                  }}
                />
              )}
              <Box flexDirection="row" alignItems="center" gap={1}>
                {closeKind === 'done' ? (
                  <Button
                    key="done-confirm"
                    label={cancelNote === CANCEL_BUSY ? 'Écriture…' : 'Confirmer'}
                    onPress={() => void confirmClose($, source, current, 'done')}
                  />
                ) : (
                  <Button
                    key="cancel-confirm"
                    label={cancelNote === CANCEL_BUSY ? 'Annulation…' : "Confirmer l'annulation"}
                    onPress={() => void confirmClose($, source, current, 'abandon')}
                  />
                )}
                <Button key="cancel-keep" plain dimColor label="Garder" onPress={() => void setView($, () => ({ cancelAsk: '', cancelNote: '' }))} />
              </Box>
              {cancelNote !== '' && cancelNote !== CANCEL_BUSY && (
                <Text color={palette.lateOn} wrap="wrap">{cancelNote}</Text>
              )}
            </Box>
          )}
          {!asking && cancelNote !== '' && cancelNote !== CANCEL_BUSY && (
            <Box paddingX={1}>
              <Text size="caption" color={palette.lateOn} wrap="wrap">{cancelNote}</Text>
            </Box>
          )}
          {/* Un message en plus du brief, facultatif ; Entrée lance comme « Lancer ». Sa clé suit la
              tâche : un message tapé pour l'une ne reste pas affiché sur une autre. */}
          {!current.done && !live && !launched.includes(taskKey(current)) && Input && (
            <Box paddingX={1}>
              <Input
                key={`launch-extra:${current.key}`}
                rows={2}
                placeholder="Message additionnel (facultatif)"
                submitLabel="lancer"
                onInput={(value: string) => {
                  launchExtra = value
                }}
                onSubmit={(value: string) => {
                  launchExtra = value
                  void launchSession($, source, current, s.titre, value)
                }}
              />
            </Box>
          )}
          {!current.done && !live && launched.includes(taskKey(current)) && (
            <Box flexDirection="row" alignItems="center" gap={1} paddingX={1}>
              <Text size="caption" color={palette.text2}>La session est demandée : sa carte attend dans la conversation.</Text>
              <Button
                key="launch-again"
                plain
                dimColor
                label="Relancer"
                onPress={() => void setView($, v => ({ launched: v.launched.filter(k => k !== taskKey(current)) }))}
              />
            </Box>
          )}
          {/* La session tourne : le bloc « Session en cours » dit tout, la note de lancement se tait. */}
          {live ? null : launchNote === LAUNCHED ? (
            <Box flexDirection="row" alignItems="center" gap={1} padding="sm" borderStyle="round" borderColor={palette.border}>
              {icon(checkIcon(palette.ok), 'lancée', 16, '✓', 'success')}
              <Text>{LAUNCHED}</Text>
            </Box>
          ) : (
            launchNote !== '' && launchNote !== LAUNCHING && <Text color={palette.text2}>{launchNote}</Text>
          )}
          {openNote !== '' && <Text size="caption" color={palette.text2}>{openNote}</Text>}
          {/* L'ouverture, en bas, en une phrase : « Ouverte le 23/10 · aujourd'hui ». */}
          {current.ouvert !== undefined && (
            <Box key="opened" flexDirection="row" alignItems="center" gap={1} paddingX={1}>
              <Text color={palette.text2}>Ouverte le</Text>
              <Text weight="semibold" tabular>{frDate(current.ouvert)}</Text>
              {days !== undefined && <Text color={palette.text2}>{`· ${openedLabel(days)}`}</Text>}
            </Box>
          )}
        </Box>
      </Box>
    )
  }

  // --- Vue d'ensemble, façon carte « Context » --------------------------------
  const total = openTasks.length + doneTasks.length
  const pct = (n: number, of: number) => (of === 0 ? 0 : Math.round((n * 100) / of))

  // Mode Projet (#99) : Ma journée à l'ouverture, quatre compteurs d'urgence, et le filtre « Qui ».
  const { mode, vue, relanceDays } = projectSettings(source)
  const projet = mode === 'projet'
  axisKeepsState = projet
  const people = projet ? peopleOf(openTasks.filter(t => matches(t, axis, 'all', me)), me) : []
  // Une personne qui n'est plus dans la vue (un autre axe choisi) : tout le monde.
  const who = projet && people.includes(whoRaw) ? whoRaw : 'all'
  // Les compteurs et les états comptent la vue : l'axe et la personne choisis.
  const inAxis = openTasks.filter(t => matches(t, axis, 'all', me) && matchesWho(t, who, me))
  const todayAll = inAxis.filter(t => isToday(t, today, me))
  const soonAll = inAxis.filter(t => isDueSoon(t, today))
  const relaunchAll = inAxis.filter(t => isToRelaunch(t, today, me, relanceDays))
  const lateAll = inAxis.filter(t => isOverdue(t, today))
  const recentAll = inAxis.filter(t => isRecent(t, today))
  // « En cours » : les tâches qu'une session travaille (roue, ou main quand elle t'attend) et
  // celles bloquées par leur prérequise (cadenas).
  const liveAll = inAxis.filter(t => isLive(t) || blocked(t))
  // « Prioritaires » : P1 et P2 (P3 veut dire « quand on a le temps »).
  const prioAll = inAxis.filter(t => t.prio === '1' || t.prio === '2')
  // « Retours » : les tâches nées d'un retour de l'app, ou qui en ont reçu.
  const feedbackAll = inAxis.filter(t => t.feedback !== undefined)
  // Par défaut, les tâches en cours ; aucune en cours, toutes.
  const attend = attendRaw === 'auto' ? (projet ? 'today' : liveAll.length > 0 ? 'live' : 'all') : attendRaw
  const mineCount = inAxis.filter(t => isMine(t, me)).length
  const thirdParties = countBy(inAxis.filter(t => !isMine(t, me)), t => (t.attend === undefined ? undefined : attendWho(t.attend)))
  const tierChosen = thirdParties.some(([who]) => who === attend)
  // En mode Projet, « Qui » remplace la liste des tiers.
  const showThirdParties = !projet && !showDone && (attend === 'others' || tierChosen)

  const shown =
    attend === 'late'
      ? lateAll
      : attend === 'today'
        ? todayAll
        : attend === 'soon'
          ? soonAll
          : attend === 'relaunch'
            ? relaunchAll
      : attend === 'recent'
        ? recentAll
        : attend === 'live'
          ? liveAll
          : attend === 'prio'
            ? prioAll
            : attend === 'feedback'
              ? feedbackAll
              : openTasks.filter(t => matches(t, axis, attend, me) && matchesWho(t, who, me))
  const filtered = axis !== 'all' || attend !== 'all' || who !== 'all' || showDone || searching
  const unsorted = shown.filter(t => attend === 'late' || !isOverdue(t, today))
  const late = sortTasks(shown.filter(t => isOverdue(t, today)), sortOrder)
  // Titres en cours : tant qu'aucune tâche ouverte n'a son titre court (premier calcul), les
  // sections se rangent par axe ; ensuite une tâche nouvelle attend son titre dans « À classer ».
  const titled = (t: Task) => titles[hashLabel(t.label)] !== undefined
  const pending = openTasks.length > 0 && !openTasks.some(titled)
  const subjectOf = (t: Task) => (pending ? t.axis : short(t).sujet === '…' ? 'À classer' : short(t).sujet)
  // Une chaîne (`après:`) reste d'un bloc, dans l'ordre d'exécution : rangée sous le sujet (ou le
  // jour) de sa tête, même quand les tâches suivantes ont un autre sujet (Bertrand, 2026-10-27).
  const unsortedSet = new Set(unsorted)
  const headOf = (t: Task) => chainHead(t, prereqFor, unsortedSet)
  const groupOf = (t: Task) => subjectOf(headOf(t))
  // Par jour ou par sujet, le même choix dans toutes les vues ; en mode Projet, aussi par échéance,
  // par responsable ou en arbre, et la vue du projet à l'ouverture (#76).
  const by = groupingOf(groupBy, showDone, vue, mode)
  // Seules les ouvertes rangées par sujet ont des sections de sujet.
  const subjects: [string, number][] = by === 'subject' ? countBy(unsorted, groupOf) : []
  // L'arbre : ses sections, et la profondeur de chaque ligne, marquée devant son titre.
  // L'arbre garde les tâches en retard à leur place (une mère en retard garde ses filles) : pas de
  // section « En retard » à part, la pastille de retard reste sur la ligne. Sous une recherche, pas
  // d'arbre : ses résultats n'ont pas de « ↳ » (#86).
  const tree = by === 'tree' && !showDone && !searching ? byTree(sortTasks(shown, sortOrder), allTasks, t => short(t).titre) : []
  const treeDepth = new Map(tree.flatMap(g => [...g.depth]))

  const setAxis = (a: string) => () => pressAxis($, a)
  const toggleDone = () => pressDone($)
  // Un tiers choisi revient, au second clic, à « Attend un tiers ».
  const setAttend = (v: string, back = 'all') => () => {
    void setView($, () => ({ attend: attend === v ? back : v, showDone: false, closedGroups: [], moreGroups: [] }))
  }
  const showAll = () => {
    void setView($, () => ({ axis: 'all', attend: 'all', who: 'all', showDone: false, closedGroups: [], moreGroups: [] }))
  }
  // Sous un filtre tout est déplié et l'on replie ; sans filtre tout est replié et l'on déplie.
  const isOpenGroup = (name: string) => (filtered ? !closedGroups.includes(name) : openGroups.includes(name))
  const toggleIn = (list: string[], name: string) => (list.includes(name) ? list.filter(g => g !== name) : [...list, name])
  const toggleGroup = (name: string) => () =>
    void setView($, v => (filtered ? { closedGroups: toggleIn(v.closedGroups, name) } : { openGroups: toggleIn(v.openGroups, name) }))

  // Une ligne de légende : l'icône, le nom (cliquable), le nombre et la part alignés à droite.
  // Pas de fond : sous un filtre, les autres lignes du groupe s'estompent.
  const legend = (o: {
    key: string
    mark: (dim: boolean) => RenderElement
    name: string
    n: number
    share: string
    dim: boolean
    onPress?: () => void
    muted?: boolean
  }) => {
    const ink2 = o.muted ? palette.text3 : faded(palette.text2, o.dim)
    return (
      <Box
        key={`hit:${o.key}`}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingX={1}
        hover={o.onPress ? { backgroundColor: palette.hover } : undefined}
      >
        {/* Pas de coins arrondis au survol, comme les lignes de tâches : quatre Svg de moins par
            ligne (2026-10-23, un tiers des Svg d'un dessin). La marque de 16 × 24 tient la hauteur. */}
        {/* Dans un panneau étroit, c'est le nom qui se tronque : l'icône et les chiffres gardent leur place. */}
        <Box flexDirection="row" alignItems="center" gap={1} flexShrink={1} minWidth={0}>
          <Box flexDirection="row" alignItems="center" flexShrink={0}>
            {o.mark(o.dim)}
          </Box>
          {o.onPress ? (
            graphic ? (
              <Text color={faded(palette.text, o.dim)} wrap="truncate-end">{o.name}</Text>
            ) : (
              <Button key={o.key} plain dimColor={o.dim} label={o.name} onPress={o.onPress} />
            )
          ) : (
            <Text color={palette.text3}>{o.name}</Text>
          )}
        </Box>
        <Box flexDirection="row" flexShrink={0}>
          {/* La part d'abord, puis le nombre de tâches en petite pastille, comme le compte des sections. */}
          <Box width={shareCol} justifyContent="flex-end">
            <Text tabular color={o.muted ? palette.text3 : faded(palette.text, o.dim)}>{o.share}</Text>
          </Box>
          <Box width={numCol} justifyContent="flex-end">
            {countPill(o.n, o.dim || Boolean(o.muted), ink2)}
          </Box>
        </Box>
        {o.onPress && hit(o.key, o.onPress)}
      </Box>
    )
  }

  // Une pastille : échéance dépassée (horloge), échéance à venir, tiers attendu (personne), « à revoir ».
  const pillColors: Record<Pill['kind'], { bg: string; fg: string; strong: boolean }> = {
    late: { bg: palette.lateTint, fg: palette.lateOn, strong: true },
    due: { bg: palette.sel, fg: palette.text2, strong: false },
    // Dans les 7 jours (#99) : orange.
    soon: { bg: palette.blockTint, fg: palette.blockOn, strong: true },
    recur: { bg: palette.sel, fg: palette.text2, strong: false },
    wait: { bg: palette.waitTint, fg: palette.waitOn, strong: true },
    // Une attente qui dort (#99) : orange à 7 jours, rouge à 14.
    waitAging: { bg: palette.blockTint, fg: palette.blockOn, strong: true },
    waitOld: { bg: palette.lateTint, fg: palette.lateOn, strong: true },
    stale: { bg: palette.sel, fg: palette.text2, strong: false },
    // Le responsable quand ce n'est pas moi (#76) : la teinte d'une attente, sans gras.
    owner: { bg: palette.waitTint, fg: palette.waitOn, strong: false },
  }
  // La roue d'une tâche en session ; elle tourne dans un Svg interactif, qui porte aussi l'infobulle.
  // Une session ouverte qui ne tourne pas : son tour est fini, elle attend la réponse de Bertrand.
  const waitingOn = (t: Task) => {
    const sid = liveOf(t)?.entry.sessionId
    return sid !== undefined && runningBySession.get(sid) === false
  }
  const hand = () =>
    Svg ? (
      <Svg source={handIcon(palette.block, 14, STROKE.pill, 'Attend ta réponse')} alt="Attend ta réponse" width={14} height={14} isInteractive />
    ) : (
      <Text color="permission">✋</Text>
    )
  const spinner = () =>
    Svg ? (
      <Svg source={spinnerIcon(palette.live, 14, 'En cours dans une session', false, now)} alt="En cours dans une session" width={14} height={14} isInteractive />
    ) : (
      <Text color="suggestion">◌</Text>
    )

  // Le cadenas d'une tâche bloquée, avec son infobulle (Svg interactif).
  const lock = (title: string) =>
    // Gris : la tâche attend une autre tâche, pas toi (la main orange, elle, t'attend).
    Svg ? <Svg source={lockIcon(palette.text2, 14, STROKE.pill, title)} alt={title} width={14} height={14} isInteractive /> : <Text dimColor>⊘</Text>

  const rowPill = (p: Pill) => {
    const c = pillColors[p.kind]
    const mark: PillMark | undefined = p.kind === 'late' ? 'clock' : p.kind === 'wait' || p.kind === 'waitAging' || p.kind === 'waitOld' || p.kind === 'owner' ? 'person' : undefined
    return drawnPill({ text: p.text, bg: c.bg, fg: c.fg, ...(mark ? { mark } : {}), weight: c.strong ? 600 : 500 })
  }

  // Une tâche, toujours sur une ligne : carré d'axe, pastilles, titre tronqué, âge, chevron.
  // Une tâche faite : la coche, le titre et son axe à droite.
  const row = (t: Task, chain?: ChainStep) => {
    const s = short(t)
    const days = age(t)
    // Une marque de 16 × 24 tient la hauteur de la ligne : ni cale ni coins arrondis par ligne de
    // tâche (sur une roadmap de 120 tâches dépliées, 870 dessins figeaient le panneau).
    // Une tâche d'une chaîne : le trait et son étape font partie de la marque, un seul dessin.
    const markSource = t.done ? checkRowIcon(palette.ok) : squareRowIcon(axisHex(t.axis))
    const mark = Svg ? (
      <Svg
        source={chain ? chainRowIcon(markSource, chain.pos, chain.step, palette.text3, palette.text2) : markSource}
        alt={`${isAbandoned(t) ? 'annulée' : t.done ? 'faite' : t.axis}${chain ? `, étape ${chain.step}` : ''}`}
        width={chain ? 32 : 16}
        height={24}
      />
    ) : t.done ? (
      <Text color="success">✓</Text>
    ) : (
      <Text color={axisTheme(t.axis)}>■</Text>
    )
    const right = t.done ? axisLabel(t.axis) : days === undefined ? '' : ageLabel(days)
    // Une tâche faite dont la session reste ouverte : y retourner, ou l'archiver, d'un clic.
    const kept = sessionRows.has(taskKey(t)) ? doneSessionOf(t) : undefined
    const inSession = isLive(t)
    // La session de la tâche, ouverte ou faite : son numéro y mène.
    const rowSession = liveOf(t) ?? doneSessionOf(t)
    // La roue l'emporte sur le cadenas : une tâche en session n'attend plus sa prérequise.
    const locked = !inSession && blocked(t)
    const pre = locked ? prereqFor(t) : undefined
    // Le ▶ lance la session de la tâche sans passer par le détail : même brief, même carte que
    // « Lancer ». Un bouton de l'app, sans zone de clic : il tient sur toutes les lignes sous
    // ZONE_LIMIT. Ni sur une tâche en session, bloquée ou déjà demandée ; sa colonne reste, vide,
    // pour garder les carrés alignés.
    const playable = !t.done && !inSession && !locked && !launched.includes(taskKey(t))
    return (
      <Box
        key={`hit:${t.key}`}
        flexDirection="row"
        alignItems="center"
        gap={1}
        paddingX={1}
        hover={{ backgroundColor: palette.hover }}
      >
        {!t.done && (
          <Box key={`p:${t.key}`} width={3} flexShrink={0} flexDirection="row" justifyContent="center">
            {playable && (
              <Button key={`play:${t.key}`} plain dimColor onPress={() => void launchSession($, source, t, s.titre)}>
                ▶
              </Button>
            )}
          </Box>
        )}
        {/* Une tâche d'une chaîne, au terminal : le trait en glyphe et son étape (1 pour la tête). */}
        {chain && !Svg && (
          <Box key={`c:${t.key}`} flexDirection="row" alignItems="center" flexShrink={0}>
            <Text color={palette.text3}>{chain.pos === 'first' ? '┌' : chain.pos === 'last' ? '└' : '├'}</Text>
            <Text size="caption" tabular color={palette.text2}>{String(chain.step)}</Text>
          </Box>
        )}
        <Box flexShrink={0}>{mark}</Box>
        {/* Le numéro d'abord, à sa colonne : les pastilles suivent, les numéros restent alignés. */}
        {t.id && taskNumber(t.id, rowSession ? () => void openSession($, rowSession.entry) : undefined)}
        {!t.done && t.prio && prioPill(t.prio)}
        {!t.done && t.feedback && feedbackPill()}
        {!inSession && !locked && rowPills(t, today, me).map(rowPill)}
        <Box flexGrow={1} flexShrink={1} minWidth={0}>
          <Button key={t.key} plain dimColor={!t.done && !titled(t)} onPress={select(selectionOf(t))}>
            <Text wrap="truncate-end">{`${treePrefix(treeDepth.get(t) ?? 0)}${s.titre}`}</Text>
          </Button>
        </Box>
        {inSession && (waitingOn(t) ? hand() : spinner())}
        {locked && pre && lock(`Bloquée : ${short(pre).titre} n'est pas encore faite`)}
        {kept && (
          <Box flexDirection="row" alignItems="center" gap={1} flexShrink={0}>
            <Box key={`so:${t.key}`} flexDirection="row" alignItems="center" flexShrink={0}>
              {strut(24)}
              {Svg && <Svg source={externalIcon(palette.text2, 16)} alt="Ouvrir la session" width={16} height={16} />}
              {hit(`row-open:${taskKey(t)}`, () => void openSession($, kept.entry), 1)}
            </Box>
            <Box key={`sa:${t.key}`} flexDirection="row" alignItems="center" flexShrink={0}>
              {strut(24)}
              {Svg && <Svg source={archiveIcon(palette.text2, 16)} alt="Archiver la session" width={16} height={16} />}
              {hit(`row-archive:${taskKey(t)}`, () => void archiveSession($, kept.key, kept.entry), 1)}
            </Box>
          </Box>
        )}
        {!kept && !inSession && !locked && right !== '' && (
          <Box flexShrink={0}>
            <Text size="caption" tabular color={palette.text2} wrap="end">
              {right}
            </Text>
          </Box>
        )}
        <Button key={`${t.key}:go`} plain dimColor onPress={select(selectionOf(t))}>
          ›
        </Button>
      </Box>
    )
  }

  // Une section repliable : chevron, nom, et à droite le compte (et le disque rouge d'« En retard »).
  // `shownRows` : les lignes que le budget du dessin lui laisse ; au-delà, « Voir les N autres ».
  // `id` tient l'état de la section (dépliée, repliée, « Voir les N autres ») ; `name` est son libellé.
  const section = (id: string, name: string, tasks: Task[], shownRows: number, lead?: RenderElement, mark?: RenderElement) => {
    const isOpen = isOpenGroup(id)
    const rest = tasks.length - shownRows
    return (
      <Box key={`section:${id}`} flexDirection="column" paddingTop="xs">
        <Box
          key={`hit:group:${id}`}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingX={1}
          hover={{ backgroundColor: palette.hover }}
        >
          <Box flexDirection="row" alignItems="center" gap={1} flexShrink={1} minWidth={0}>
            {/* Le chevron dessiné sur 16 × 24, aligné sur le carré des lignes : il tient seul la hauteur. */}
            {Svg ? (
              <Box flexDirection="row" alignItems="center" flexShrink={0}>
                <Svg source={rowMark(chevronIcon(palette.text3, isOpen))} alt={isOpen ? 'replier' : 'déplier'} width={16} height={24} />
              </Box>
            ) : (
              <Button key={`group:${id}:chevron`} plain dimColor onPress={toggleGroup(id)}>
                {isOpen ? '⌄' : '›'}
              </Button>
            )}
            {mark}
            {headZones ? <Text wrap="truncate-end">{name}</Text> : <Button key={`group:${id}`} plain label={name} onPress={toggleGroup(id)} />}
          </Box>
          <Box flexDirection="row" alignItems="center" gap={1} flexShrink={0}>
            {lead}
            {/* Le compte en petite pastille arrondie, d'un gris discret (choix de Bertrand, 2026-10-22). */}
            {Svg ? (
              drawnPill({ text: String(tasks.length), bg: mixOver(palette.sel, palette.bg, 0.6), fg: palette.text2, weight: 500, size: 10, height: 16 })
            ) : (
              <Text tabular color={palette.text2}>{String(tasks.length)}</Text>
            )}
          </Box>
          {headZones && hit(`group:${id}`, toggleGroup(id))}
        </Box>
        {isOpen && (
          <Box flexDirection="column" paddingBottom="sm">
            {(() => {
              // En arbre, la profondeur tient la place du trait des chaînes.
              const chains = by === 'tree' ? new Map<Task, ChainStep>() : chainSteps(tasks, prereqFor)
              return tasks.slice(0, shownRows).map(t => row(t, chains.get(t)))
            })()}
            {rest > 0 && (
              <Box key={`more-row:${id}`} flexDirection="row" paddingX={1} paddingLeft={4}>
                <Button
                  key={`more:${id}`}
                  plain
                  dimColor
                  label={shownRows === 0 ? `Voir les ${rest} tâches` : `Voir les ${rest} autres`}
                  onPress={() => void setView($, v => ({ moreGroups: v.moreGroups.includes(id) ? v.moreGroups : [...v.moreGroups, id] }))}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    )
  }

  // Toutes les faites de l'axe, la plus récente d'abord ; rangées par jour ou par sujet.
  const doneShown = doneTasks
    .filter(t => matches(t, axis, 'all', me))
    .sort((a, b) => (b.fait ?? '').localeCompare(a.fait ?? ''))
  const doneBySubject = () =>
    countBy(doneShown, t => (short(t).sujet === '…' ? 'À classer' : short(t).sujet)).map(([name]) => ({
      name,
      tasks: doneShown.filter(t => (short(t).sujet === '…' ? 'À classer' : short(t).sujet) === name),
    }))
  // La recherche : ouvertes puis faites, toutes, quels que soient les filtres.
  const titleOf = (t: Task) => titles[hashLabel(t.label)]?.titre
  const foundOpen = searching ? sortTasks(searchTasks(openTasks, search, titleOf), sortOrder) : []
  const foundDone = searching
    ? searchTasks(doneTasks, search, titleOf).sort((a, b) => (b.fait ?? '').localeCompare(a.fait ?? ''))
    : []
  const foundCount = foundOpen.length + foundDone.length
  const foundShown = foundOpen.slice(0, SEARCH_MAX)
  const foundDoneShown = foundDone.slice(0, Math.max(0, SEARCH_MAX - foundShown.length))

  // Les groupes de la liste : « En retard » d'abord, puis les sujets ; les faites par jour.
  // `key` suit l'état d'une section quand son libellé bouge (l'avancement d'un arbre) ; sans lui, son nom.
  const groups: { key?: string; name: string; tasks: Task[]; lead?: RenderElement; mark?: RenderElement }[] = searching
    ? [
        ...(foundShown.length > 0 ? [{ name: 'Ouvertes', tasks: foundShown }] : []),
        ...(foundDoneShown.length > 0 ? [{ name: 'Faites', tasks: foundDoneShown }] : []),
      ]
    : showDone
    ? by === 'subject'
      ? doneBySubject()
      : doneByDay(doneShown, today).map(day => ({ name: day.label, tasks: day.tasks }))
    : attend === 'relaunch'
    ? // À relancer (#99) : les attentes les plus vieilles en haut.
      [{ name: 'À relancer', tasks: [...shown].sort((x, y) => (waitDays(y, today, me) ?? 0) - (waitDays(x, today, me) ?? 0)) }]
    : attend === 'today'
    ? // Ma journée (#99) : ses quatre sections, dans l'ordre, chaque tâche une fois.
      todaySections(sortTasks(shown, sortOrder), today, me).map(g => ({
        name: g.label,
        tasks: g.tasks,
        ...(g.label === 'En retard' ? { lead: icon(discIcon(palette.late), 'en retard', 16, '●', 'error') } : {}),
      }))
    : [
        ...(attend !== 'late' && by !== 'tree' && late.length > 0
          ? [{ name: 'En retard', tasks: late, lead: icon(discIcon(palette.late), 'en retard', 16, '●', 'error') }]
          : []),
        // Par jour d'ouverture ; dans un jour, l'ordre de la vue.
        ...(by === 'day' ? byDay(sortTasks(unsorted, sortOrder), today, t => headOf(t).ouvert).map(day => ({ name: day.label, tasks: day.tasks })) : []),
        ...(by === 'deadline' ? byDeadline(sortTasks(unsorted, sortOrder), today).map(g => ({ name: g.label, tasks: g.tasks })) : []),
        ...(by === 'owner' ? byOwner(sortTasks(unsorted, sortOrder), me).map(g => ({ name: g.label, tasks: g.tasks })) : []),
        ...tree.map(g => ({ key: g.key, name: g.label, tasks: g.tasks })),
        ...subjects.map(([name]) => {
          const tasks = sortTasks(unsorted.filter(t => groupOf(t) === name), sortOrder)
          return {
          name,
          tasks,
          // Pas de roue en tête de section : seules les tâches en session en portent une.
          // Rangées par axe : le carré de l'axe devant son nom.
          ...(pending ? { mark: icon(squareIcon(axisHex(name)), name, 16, '■', axisTheme(name)) } : {}),
          }
        }),
      ]
  // Le budget de lignes du dessin : les sections ouvertes, dans l'ordre, en prennent tant qu'il en
  // reste ; une section dépliée en entier (« Voir les N autres ») prend toutes les siennes. Sans
  // lui, une vue filtrée ou « Tout déplier » posait ~2 000 éléments et ~330 Svg par clic (260 Ko),
  // au seuil où le panneau gèle (2026-10-23).
  let budget = ROW_BUDGET
  const rowsOf = new Map<string, number>()
  const idOf = (g: { key?: string; name: string }) => g.key ?? g.name
  for (const g of groups) {
    if (!isOpenGroup(idOf(g))) continue
    const n = moreGroups.includes(idOf(g)) ? g.tasks.length : Math.min(g.tasks.length, Math.max(budget, 0))
    rowsOf.set(idOf(g), n)
    budget -= n
  }
  const drawnTasks = groups.flatMap(g => g.tasks.slice(0, rowsOf.get(idOf(g)) ?? 0))
  const names = groups.map(idOf)
  const allOpen = names.length > 0 && names.every(n => openGroups.includes(n))
  const action = searching
    ? { label: 'Effacer', run: () => void update($, searchAtom, () => '') }
    : filtered
    ? { label: 'Tout afficher', run: showAll }
    : allOpen
      ? {
          label: 'Tout replier',
          run: () => void setView($, () => ({ openGroups: [], moreGroups: [] })),
        }
      : { label: 'Tout déplier', run: () => void setView($, () => ({ openGroups: names })) }

  const anyAxis = axis !== 'all' || showDone
  const axisOn = (a: string) => axis === a && !showDone
  const segments = [
    ...axes.map(a => ({ name: a, hex: axisHex(a), theme: axisTheme(a), n: axisCount(openTasks, a), dim: anyAxis && !axisOn(a) })),
    { name: DONE_SEGMENT, hex: palette.done, theme: 'inactive', n: doneTasks.length, dim: anyAxis && !showDone },
  ]
  const shares = integerShares(segments.map(seg => seg.n))
  // La barre et le filet se dessinent un peu plus larges que le panneau, et l'app les y ramène.
  const wide = fullWidth((e.props as { bodyColumns?: number }).bodyColumns ?? 48)

  // Les états : part sur les tâches ouvertes de la vue ; un état à 0 en gris, sans clic, en dernier.
  const stateOn = (key: string) => !showDone && (attend === key || (key === 'others' && tierChosen))
  const anyState = !showDone && attend !== 'all'
  const states = [
    // En cours : une session y travaille ; la roue de la légende reste fixe (un dessin en image).
    { key: 'live', name: 'En cours', n: liveAll.length, mark: (d: boolean) => tallIcon(fade(spinnerIcon(palette.live, 16, undefined, true), d), 'en cours', 16, '◌', 'suggestion') },
    { key: 'prio', name: 'Prioritaires', n: prioAll.length, mark: (d: boolean) => tallIcon(fade(flagIcon(palette.late), d), 'prioritaires', 16, '⚑', 'error') },
    { key: 'feedback', name: 'Retours', n: feedbackAll.length, mark: (d: boolean) => tallIcon(fade(bubbleIcon(palette.wait), d), 'retours', 16, '❝', 'permission') },
    { key: 'late', name: 'En retard', n: lateAll.length, mark: (d: boolean) => tallIcon(fade(discIcon(palette.late), d), 'en retard', 16, '●', 'error') },
    // Récentes : ouvertes aujourd'hui ou hier.
    { key: 'recent', name: 'Récentes', n: recentAll.length, mark: (d: boolean) => tallIcon(fade(sparkIcon(palette.ok), d), 'récentes', 16, '✦', 'success') },
    { key: 'mine', name: 'À moi', n: mineCount, mark: (d: boolean) => tallIcon(fade(ringIcon(palette.mine), d), 'à moi', 16, '○', 'suggestion') },
    {
      key: 'others',
      name: 'Attend un tiers',
      n: inAxis.length - mineCount,
      mark: (d: boolean) => tallIcon(fade(halfDiscIcon(palette.wait), d), 'attend un tiers', 16, '◐', 'permission'),
    },
  ]
  // Mode Projet (#99) : les quatre compteurs d'urgence, en couleur pleine même non choisis.
  const counters = [
    { key: 'today', name: 'Ma journée', n: todayAll.length, bg: palette.liveTint, fg: palette.liveOn },
    { key: 'late', name: 'En retard', n: lateAll.length, bg: palette.lateTint, fg: palette.lateOn },
    { key: 'soon', name: 'Cette semaine', n: soonAll.length, bg: palette.blockTint, fg: palette.blockOn },
    { key: 'relaunch', name: 'À relancer', n: relaunchAll.length, bg: palette.waitTint, fg: palette.waitOn },
  ]
  // Les autres états, en petite ligne, dans l'ordre de la maquette A.
  const smallOrder = ['prio', 'mine', 'others', 'recent', 'live', 'feedback']
  const smallStates = smallOrder.flatMap(k => states.filter(st => st.key === k && st.n > 0))
  const WHO_ALL = 'Tout le monde'
  const whoLabel = who === 'all' ? WHO_ALL : who
  const setWho = (v: string) => void setView($, () => ({ who: v === WHO_ALL ? 'all' : v, closedGroups: [], moreGroups: [] }))
  const whoOptions = [WHO_ALL, ...people]
  const urgency = (
    <Box flexDirection="column" gap="sm">
      <Box flexDirection="row" gap={1}>
        {counters.map(c => {
          const zero = c.n === 0
          const on = !showDone && attend === c.key
          if (!graphic) {
            return zero ? (
              <Text key={`count:${c.key}`} color={palette.text3}>{`${c.name} 0`}</Text>
            ) : (
              <Button key={`attend:${c.key}`} plain dimColor={anyState && !on} label={`${c.name} ${c.n}`} onPress={setAttend(c.key)} />
            )
          }
          return (
            <Box
              key={`hit:attend:${c.key}`}
              flexDirection="column"
              flexGrow={1}
              minWidth={0}
              paddingX={1}
              paddingY="xs"
              backgroundColor={zero ? palette.sel : c.bg}
              borderStyle={on ? 'round' : undefined}
              borderColor={on ? c.fg : undefined}
            >
              <Text key={`count:${c.key}`} size="title" weight="semibold" tabular color={zero ? palette.text3 : c.fg}>
                {String(c.n)}
              </Text>
              <Text size="caption" color={zero ? palette.text3 : c.fg} wrap="truncate-end">
                {c.name}
              </Text>
              {!zero && hit(`attend:${c.key}`, setAttend(c.key))}
            </Box>
          )
        })}
      </Box>
      <Box flexDirection="row" alignItems="center" gap={2} paddingX={1}>
        <Box flexDirection="row" alignItems="center" gap={2} flexShrink={1} minWidth={0} flexWrap="wrap">
          {smallStates.map(st => (
            <Button key={`attend:${st.key}`} plain dimColor={anyState && !stateOn(st.key)} label={`${st.name} ${st.n}`} onPress={setAttend(st.key)} />
          ))}
        </Box>
        <Box flexGrow={1} />
        {people.length > 0 &&
          (Select ? (
            <Select key="who" options={whoOptions.map(value => ({ value }))} value={whoLabel} onSelect={(v: string) => setWho(v)} />
          ) : (
            <Button
              key="who"
              plain
              label={`Qui : ${whoLabel} ▸`}
              onPress={() => setWho(whoOptions[(whoOptions.indexOf(whoLabel) + 1) % whoOptions.length] ?? WHO_ALL)}
            />
          ))}
      </Box>
    </Box>
  )
  // Les zones de clic de ce dessin : légende et états, puis les en-têtes de section s'il reste de la place.
  if (graphic) sessionRows = new Set(doneTasks.filter(t => doneSessionOf(t) !== undefined).slice(0, SESSION_ROWS).map(taskKey))
  // En mode Projet, seuls les compteurs non nuls ont une zone ; la petite ligne d'états, ce sont des boutons de l'app.
  const fixedZones = axes.length + 1 + (projet && !showDone ? counters.filter(c => c.n > 0).length : states.filter(st => st.n > 0).length) + 2 * sessionRows.size
  if (graphic) {
    const shownWithSession = drawnTasks.filter(t => t.id && (liveOf(t) ?? doneSessionOf(t)))
    numberZones = new Set(shownWithSession.slice(0, Math.max(0, ZONE_LIMIT - fixedZones)).map(t => t.id as string))
  }
  headZones = graphic && fixedZones + numberZones.size + groups.length <= ZONE_LIMIT

  return (
    <Box flexDirection="column" gap="md" paddingX={1}>
      {/* L'avancement et sa barre font un seul bloc : la barre colle aux chiffres. */}
      <Box flexDirection="column">
      <Box flexDirection="row" justifyContent="space-between" alignItems="flex-end" paddingX={1}>
        {Svg ? (
          (() => {
            const big = percentIcon(`${pct(doneTasks.length, total)} %`, palette.text)
            return <Svg source={big.source} alt={`${pct(doneTasks.length, total)} %`} width={big.width} height={big.height} />
          })()
        ) : (
          <Text size="title" weight="semibold" tabular>{`${pct(doneTasks.length, total)} %`}</Text>
        )}
        {/* Toujours sur une ligne, sans l'heure de lecture (retirée, 2026-10-22) ; forme courte si très étroit. */}
        <Box flexShrink={1} minWidth={0} marginLeft={1}>
          <Text size="caption" tabular color={palette.text2} wrap="truncate-end">
            {((e.props as { bodyColumns?: number }).bodyColumns ?? 76) < 40
              ? `${doneTasks.length}/${total}`
              : `${doneTasks.length} faites sur ${total}`}
          </Text>
        </Box>
      </Box>

      <Box paddingX={1} paddingY="xs" justifyContent="center">
        {Svg ? (
          <Svg source={barIcon(segments, palette.done, wide)} alt={`${pct(doneTasks.length, total)} % fait`} height={6} />
        ) : (
          <Box flexDirection="row" width="100%" height={1}>
            {segments.map((seg, i) =>
              (shares[i] ?? 0) === 0 ? null : (
                <Box key={`bar-${seg.name}`} width={`${shares[i] ?? 0}%`} height={1} backgroundColor={seg.theme} />
              ),
            )}
          </Box>
        )}
        {/* Posée sur la barre, la zone de clic ne dessine rien : un clic filtre l'axe touché. */}
        {Client && (
          <Box position="absolute" top={0} left={1} right={1} bottom={0}>
            <Client key={zoneKey(BAR_HIT, 'bar-hit')} module="./bar-hit.tsx" props={barCuts(segments, wide)} width="100%" height="100%" />
          </Box>
        )}
      </Box>
      </Box>

      {pending && (
        <Box flexDirection="row" alignItems="center" gap={1} paddingX={1}>
          {Svg && <Svg source={pendingIcon(palette.text2)} alt="en cours" width={16} height={16} isInteractive />}
          <Text size="caption" color={palette.text2}>Titres en cours de calcul : rangées par axe en attendant</Text>
        </Box>
      )}

      <Box flexDirection="column">
        {axes.map(a => {
          const n = axisCount(openTasks, a)
          const dim = anyAxis && !axisOn(a)
          return legend({
            key: `axis:${a}`,
            mark: d => tallIcon(fade(squareIcon(axisHex(a)), d), a, 16, '■', axisTheme(a)),
            name: axisLabel(a),
            n,
            share: `${pct(n, total)} %`,
            dim,
            onPress: setAxis(a),
          })
        })}
        {legend({
          key: 'toggle-done',
          mark: d => tallIcon(fade(squareIcon(palette.done), d), 'faites', 16, '■', 'inactive'),
          name: 'Faites',
          n: doneTasks.length,
          share: `${pct(doneTasks.length, total)} %`,
          dim: anyAxis && !showDone,
          onPress: toggleDone,
        })}
      </Box>

      {projet && !showDone ? urgency : (
      <Box flexDirection="column">
        {states
          .filter(st => st.n > 0)
          .map(st =>
            legend({
              key: `attend:${st.key}`,
              mark: st.mark,
              name: st.name,
              n: st.n,
              // Les états n'ont pas de part, seulement leur nombre (choix de Bertrand, 2026-10-22).
              share: '',
              dim: anyState && !stateOn(st.key),
              onPress: setAttend(st.key),
            }),
          )}
        {states
          .filter(st => st.n === 0)
          .map(st =>
            legend({
              key: `attend:${st.key}`,
              mark: () => tallIcon(ringIcon(palette.text3), st.name, 16, '○', 'inactive'),
              name: st.name,
              n: 0,
              share: '',
              dim: false,
              muted: true,
            }),
          )}
        {showThirdParties && (
          <Box flexDirection="column">
            {thirdParties.map(([who, n]) => {
              const chosen = attend === who
              const ink = chosen ? palette.waitOn : tierChosen ? palette.text3 : palette.text2
              return (
                <Box
                  key={`hit:attend:${who}`}
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  paddingLeft={4}
                  paddingRight={1}
                  backgroundColor={chosen ? palette.waitTint : undefined}
                  hover={{ backgroundColor: chosen ? palette.waitTint : palette.hover }}
                >
                  <Box flexDirection="row" alignItems="center" gap={1} flexShrink={1} minWidth={0}>
                    <Box flexDirection="row" alignItems="center" flexShrink={0}>
                      {tallIcon(personIcon(ink, 12, STROKE.small), who, 12, '·', 'permission')}
                    </Box>
                    <Button key={`attend:${who}`} plain dimColor={tierChosen && !chosen} onPress={setAttend(who, 'others')}>
                      <Text wrap="truncate-end">{who}</Text>
                    </Button>
                  </Box>
                  <Box flexDirection="row" flexShrink={0}>
                    <Box width={shareCol} />
                    <Box width={numCol} justifyContent="flex-end">
                      {countPill(n, tierChosen && !chosen, ink)}
                    </Box>
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}
      </Box>
      )}

      <Box flexDirection="column" gap="sm">
        {Svg && <Svg source={ruleIcon(palette.border, wide)} alt="séparateur" height={1} />}
        <Box flexDirection="row" justifyContent="space-between" alignItems="center" paddingX={1}>
          <Text color={palette.text2} wrap="truncate-end">
            {searching
              ? `${foundCount} résultat${foundCount > 1 ? 's' : ''}${foundCount > SEARCH_MAX ? ` (${SEARCH_MAX} affichés)` : ''}`
              : filterSummary({ axis, attend, showDone, shown: shown.length, doneShown: doneShown.length, groupBy: by, who })}
          </Text>
          <Box flexDirection="row" alignItems="center" gap={2} flexShrink={0}>
            {/* Un bouton de l'app, pas une zone de clic : il ne compte pas dans ZONE_LIMIT. */}
            {!searching && (
              <Button
                key="group-by"
                plain
                label={groupingLabel(nextGrouping(by, mode, showDone))}
                onPress={() => void setView($, () => ({ groupBy: nextGrouping(by, mode, showDone) }))}
              />
            )}
            <Button key="list-action" plain label={action.label} onPress={action.run} />
            <Button key="open-settings" plain label="Réglages" onPress={() => void openSettings($)} />
          </Box>
        </Box>
        {/* La recherche : un numéro (« 47 », « #47 ») ou des mots du libellé, ouvertes et faites. */}
        {Input && (
          <Box paddingX={1}>
            <Input
              key="search"
              placeholder="Rechercher une tâche : mots ou #numéro"
              value={search}
              submitLabel="chercher"
              onInput={(value: string) => void update($, searchAtom, () => value)}
              onSubmit={(value: string) => void update($, searchAtom, () => value)}
            />
          </Box>
        )}
      </Box>

      {titleNote !== '' && <Text color={palette.text2}>{titleNote}</Text>}
      {scanNote !== '' && <Text color={palette.text2}>{scanNote}</Text>}
      {searching && foundCount === 0 && <Text color={palette.text2}>Aucune tâche ne correspond.</Text>}
      {!searching && !showDone && shown.length === 0 && (
        <Text color={palette.text2}>{attend === 'today' ? "Rien d'urgent aujourd'hui." : 'Aucune tâche ouverte pour ce filtre.'}</Text>
      )}

      <Box flexDirection="column">{groups.map(g => section(idOf(g), g.name, g.tasks, rowsOf.get(idOf(g)) ?? 0, g.lead, g.mark))}</Box>
    </Box>
  )
}
