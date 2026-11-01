import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderElement, RenderInput, ToolCallResult } from 'claude-code'

import type { LiveEntry, ShortTitle, VersionCheck, View } from '../types'
import {
  AXIS_THEME,
  PALETTES,
  axisColor,
  brandLanesIcon,
  brandMarkIcon,
  brandStationsIcon,
  barCuts,
  barIcon,
  axisPillIcon,
  axisTint,
  percentIcon,
  pillIcon,
  filterPillIcon,
  type PillMark,
  checkIcon,
  chainRowIcon,
  treeMotherRowIcon,
  treeChildRowIcon,
  axisBandIcon,
  progressIcon,
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
  playIcon,
  externalIcon,
  documentIcon,
  archiveIcon,
  pencilIcon,
  clockIcon,
  gearIcon,
  todoIcon,
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
  stepIcon,
  stepsBarIcon,
  squareIcon,
  STROKE,
  type Palette,
} from './icons'
import { MIX, RADIUS, SIZE, SPACE, TEXT } from './tokens'
import { SETTINGS_PANE, drawSettings, openSettings, prefsFile, redrawSettings, sessionProject, watchSettings } from './reglages'
import {
  ageLabel,
  axisLabel,
  branchGap,
  branchText,
  brandText,
  briefTaskOf,
  bandColumns,
  maestroBand,
  type MaestroBand,
  type StepsView,
  maestroBrandTasks,
  maestroTaskSessions,
  openingBrand,
  paneFocus,
  sessionBrand,
  type Brand,
  type BrandTask,
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
  pinnedPaneToast,
  refusesPaneClose,
  PANE_ID,
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
  archivedInAsk,
  archivedAskRefusal,
  isLaunchAsk,
  launchInBox,
  launchBoxRefusal,
  dueLabel,
  findSelected,
  ficheCards,
  missionCut,
  finCard,
  codeKeptWhole,
  foldCell,
  livreOfNote,
  missionFrame,
  parseEndFiche,
  recapKey,
  recapOf,
  type FicheCard,
  type EditField,
  type EditSpec,
  type TaskEdit,
  taskBrandOf,
  byDay,
  doneByDay,
  groupingOf,
  nextGrouping,
  groupingLabel,
  byDeadline,
  byOwner,
  byTree,
  axisTree,
  parentLeftAlone,
  blockerOf,
  closeCaption,
  closeRoute,
  checkRoute,
  closeWithParentInTexts,
  editInTexts,
  editRoute,
  entrustedNote,
  editableFields,
  editDiff,
  declaredAxes,
  withParentDates,
  bandsOf,
  keyPills,
  axisPillText,
  fitRowPills,
  pxCells,
  ROW_STEPS,
  rowStepsCells,
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
  type TreeBlock,
  type Mode,
  type Travail,
  groupingData,
  heldByOther,
  workOf,
  unlockedBy,
  launchable,
  maestroCall,
  maestroContext,
  maestroDayContext,
  maestroIntro,
  maestroRelaunchContext,
  welcomeCardShown,
  welcomeFacts,
  welcomeText,
  type MaestroAction,
  type Welcome,
  type WelcomeCardSeen,
  type WelcomePill,
  MAESTRO_MENU,
  listPills,
  rowPills,
  sortTasks,
  type Pill,
  hashLabel,
  keyPart,
  integerShares,
  launchBrief,
  launchPrompt,
  ownLaunch,
  panelSubmit,
  checkBrief,
  briefPaths,
  reglesNote,
  reglesPath,
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
  sessionParentIn,
  oneTaskStep,
  isMaestroSession,
  maestroSessionIds,
  withSelfRow,
  sessionScanNote,
  maestroTasksNote,
  liveBlockIds,
  openingFilter,
  otherTaskNote,
  problemsText,
  sourceFor,
  titlePrompt,
  todayOf,
  type SessionPrefs,
  type Source,
  type Task,
  zoneDrawn,
  zoneFault,
  zoneReady,
  zoneReload,
  zoneWatch,
  heldFocus,
  noteHeldFocus,
  retireFocusKeys,
  retireHeldFocus,
  DEFAULT_SESSION_PREFS,
  sessionPrefs,
  sessionPrefsText,
  sessionPrefsReminder,
  maestroPrefsReminder,
  maestroWakeReminder,
  pendingAskRefusal,
  openListBox,
  openListRefusal,
  wakeTurn,
  prefsChangedLead,
  contextShrank,
  contextUseOf,
  contextView,
  type ContextUse,
  type ContextView,
  closingBlockGaps,
  archivedChildrenOf,
  archivedOpenText,
  type ArchivedOpen,
  ownLineState,
  lineOpenRefusal,
  type OwnLineContext,
  STEP_LIST_MIN_TOOLS,
  stepListReminder,
  deliveries,
  deferredReminder,
  deliveryReminder,
  closingBlockReminder,
  isAbandoned,
  closeInTexts,
  dropBilanCsv,
  reopenInTexts,
  treeCheck,
  ARM_MS,
  armAsk,
  armShown,
  checkArm,
  pressDisarms,
  treeNumberBox,
  treeSteps,
  treeDepartment,
  foldAllView,
  duePill,
  abandonBilan,
  doneBilan,
  type CloseKind,
  bilanCsvRow,
  appendBilanCsv,
  utf8Base64,
  isInsideRelative,
  isAutoModeRefusal,
  viaClaudeNote,
  maestroParentOf,
  maestroRootOf,
  PROPOSAL_OPTIONS,
  ELSEWHERE_OPTIONS,
  proposalRetryNote,
  maestroProposalText,
  proposalSentNote,
  type MaestroProposal,
  childWake,
  childWakeText,
  type ChildWake,
  applyPlan,
  boxSteps,
  childAlerts,
  stepsStamp,
  stepsView,
  childAlertText,
  childrenOf,
  finishedCheck,
  isChildStep,
  liveQuestion,
  boxQuestion,
  maestroSplit,
  type MaestroTracked,
  type ChildRelaunch,
  type ChildRow,
  type ChildStatus,
  type StepSegment,
  type ChildStep,
  type FinishedFacts,
  BYPASS_MODE,
  withBypassClause,
  bypassCard,
  isModeRefusal,
  forbiddenGit,
  type Delivery,
  guardText,
  type GitHit,
  isToday,
  todaySections,
  isDueSoon,
  isToRelaunch,
  waitDays,
  matchesWho,
  peopleOf,
  todoCounters,
  secondaryFilters,
  groupings,
  type TodoCounter,
  type Design,
  publishedVersionOf,
  PLUGINS_LINK,
  PLUGINS_URL,
  RELOAD_COMMAND,
  reloadOutcome,
  versionNote,
  LOCAL_UPDATE_REQUEST,
  localAppVersion,
  updateLocalOutcome,
  titlesNote,
  waitNote,
  type WaitNote,
  type Armed,
} from './parse'

const PANE = PANE_ID
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
/** Le même budget quand chaque ligne porte sa pastille de département (#156) : un Svg de plus par ligne ; 20, choix de Bertrand (2026-10-31). */
const ROW_BUDGET_AXIS_PILL = 20
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
// L'élément du panneau que la personne tient, et ceux qu'un défilement a fait quitter (#154).
const focusHeld = heldFocus()
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
// `titles-langue` (#125) : les titres gardent la langue du libellé, les anciens (en français) se refont.
const STORE_KEY = 'titles-langue'
// L'outil de l'app de bureau qui démarre une session à part.
const START_SESSION_TOOL = 'mcp__ccd_session__start_session'
/** Le message d'une session à une autre : la proposition d'une sous-session part à son Maestro. */
const SEND_MESSAGE_TOOL = 'mcp__ccd_session_mgmt__send_message'
/** Les propositions gardées pour leur Maestro quand le message direct est refusé (#67). */
const PROPOSALS_KEY = 'lot-proposals'
/** Une proposition gardée plus d'une semaine sans que son Maestro reprenne la main : retirée. */
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
/** Ce que le hook de la carte d'accueil a vu sur cette machine (#153) : `WelcomeCardSeen`. */
const WELCOME_CARD_KEY = 'welcome-card'
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
  // `auto` (#176) : les tâches en cours s'il y en a, sinon Ma journée, sinon toutes ; un clic sur un filtre le remplace.
  attend: 'auto',
  who: 'all',
  moreFilters: false,
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
const versionNoteAtom = atom({ plugin: 'roadmap', key: 'versionNote' } as const, { state: 'none', text: '', foot: '' } as VersionCheck)
/**
 * Le bloc des réglages de session donné en dernier à la conversation (#116), vide sinon : un bloc qui
 * a changé depuis (#119) se redonne. L'état de session survit au rechargement du module.
 */
const prefsGivenAtom = atom({ plugin: 'roadmap', key: 'prefsGivenText' } as const, '')
/**
 * Les questions que les boîtes de fin de Maestro ont posées depuis le dernier message de la personne
 * (#133) : un tour réveillé par une session ne les repose pas. L'état de session survit au rechargement.
 */
const pendingAsksAtom = atom({ plugin: 'roadmap', key: 'pendingAsks' } as const, [] as readonly string[])
/** Le contexte du message précédent, en jetons (#119) : 0 quand rien n'est mesuré depuis le dernier vidage. */
const contextSeenAtom = atom({ plugin: 'roadmap', key: 'contextSeen' } as const, 0)
/** Le contexte de cette session à la fin de son dernier tour (#157), pour l'en-tête de la bande de Maestro. */
const bandContextAtom = atom({ plugin: 'roadmap', key: 'bandContext' } as const, null as ContextUse | null)

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
const faint = memo((source: string): string => source.replace('<svg ', `<svg opacity="${MIX.faint}" `))

function axisCount(tasks: Task[], axis: string): number {
  return tasks.filter(t => t.axis === axis).length
}

/** Les réglages du plugin (userConfig), relus à chaque chargement du module. */
let settings = { me: [] as string[], autoOpen: true, titleModel: 'sonnet', capture: true, theme: 'auto', launchEffort: 'high', launchBypass: false, axisPill: false }

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

/** La place d'une ligne dans l'arbre (#125) : la tête d'un bloc, ou un enfant avec son rang. */
// Une ligne de l'arbre par axe (#168) : la mère (sa flèche dans son carré, son bloc pour
// l'avancement), une fille (son coude), une tâche seule ; toutes portent leur rond à cocher.
type TreeMark =
  | { kind: 'head'; id: string; open: boolean; ghost: boolean; block: TreeBlock }
  | { kind: 'child'; last: boolean; parent?: Task }
  | { kind: 'alone' }

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

/** Le dossier est-il dans un dépôt git ? (« Vérifier » sans code, #76.) */
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
  // Sans code (#76, #176) : pas de rappel de méthode de code.
  if (projectSettings(c.source).travail === 'projet') return undefined
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
    // Un Maestro coche les lignes de ses tâches : le numéro de son titre n'est pas son chantier.
    if (await ownIsMaestro($, own)) return undefined
    // Un projet qui range sa mémoire en fin de sujet (#101) : pas d'archivage avant la ligne de rangement.
    const r = c.source.rangement
    if (r && !c.rangeSeen) {
      if (c.rangementAsked.has(id)) return undefined
      c.rangementAsked.add(id)
      return rangementReminder(id, r)
    }
    c.archiveAsked.add(id)
    return archiveReminder(id, ownLineState(id, now.open, now.done).fait, await parentIsMaestro($))
  }
  const git = c.gitAtTurn === undefined ? undefined : await gitState($)
  const changed = c.wroteThisTurn || (git !== undefined && git !== c.gitAtTurn)
  // Un enfant de Maestro ne touche pas la roadmap : le rappel ne lui ferait écrire qu'une justification (#124).
  return changed && !(await parentIsMaestro($)) ? captureReminder(c.source) : undefined
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
let closingTurn = { work: false, box: '', wake: false, maestro: false }
/**
 * La liste d'étapes de cette session telle que l'app la montre (#133) : chez Maestro, une boîte de fin
 * sans question la cocherait toute. Une boîte acceptée la coche ici aussi.
 */
let ownSteps: ChildStep[] = []
/** La boîte qui reposait une question en attente, déjà refusée dans ce tour réveillé (#133) : une fois, jamais deux. */
let wakeRefused = false

/** Cette session est-elle un Maestro (#133) ? Fiche ou liste illisible : non, rien ne change. */
async function maestroHere($: EngineInterface): Promise<boolean> {
  try {
    return await ownIsMaestro($, await readOwnSession($))
  } catch {
    return false
  }
}

/**
 * La boîte de fin d'un tour réveillé qui repose une question en attente (#133) : refusée une fois par
 * tour ; une question vraiment nouvelle passe au second envoi.
 */
async function pendingAsk($: EngineInterface, ask: unknown): Promise<string | undefined> {
  if (!closingTurn.wake || wakeRefused || typeof ask !== 'string' || ask.trim() === '') return undefined
  const pending = await read($, pendingAsksAtom).catch(() => [] as readonly string[])
  if (pending.length === 0) return undefined
  wakeRefused = true
  return pendingAskRefusal(pending)
}

/**
 * Le rappel du bloc de fin de tour : mode ADHD, tour de travail, une ligne ou le bouton d'archivage
 * manquant. Rangement en attente (#101) : le bouton d'archivage ne se réclame pas.
 */
async function closingNote($: EngineInterface, last: string | undefined, rangementPending = false): Promise<string | undefined> {
  if (!closingTurn.work) return undefined
  // Un réveil de Maestro n'écrit rien à la personne, sauf un besoin : pas de bloc (#133).
  if (closingTurn.wake) return undefined
  if (!(await readSessionPrefs($)).prefs.adhd) return undefined
  // La ligne #N de la session (#124) : ouverte, l'archivage vient trop tôt ; close, l'État le dit.
  const line = await ownLine($).catch(() => undefined)
  // Maestro finit sur le tableau de ses tâches (#136).
  const maestro = await maestroHere($)
  const gaps = closingBlockGaps(last, closingTurn.box, line, maestro).filter(g => !(rangementPending && (g === 'archiver' || g === 'mission' || g === 'etat-close' || g === 'taches')))
  return gaps.length === 0 ? undefined : closingBlockReminder(gaps, line, maestro)
}

/**
 * La ligne `#N` de cette session dans la roadmap de la capture (#124), lue à chaque fois : Maestro la
 * coche pendant que l'enfant attend. Aucune sans capture, sans numéro, pour une session de
 * vérification (elle ne porte pas la tâche), ou quand la ligne est dans une autre roadmap.
 */
async function ownLine($: EngineInterface): Promise<OwnLineContext | undefined> {
  const c = capture
  if (!settings.capture || !c) return undefined
  const title = (await readOwnSession($)).title
  const id = sessionTitleId(title)
  if (id === undefined || sessionTitleKind(title) === 'check') return undefined
  const now = await roadmapNow($, c.source)
  const line = ownLineState(id, now.open, now.done)
  if (line.state === 'absent') return undefined
  return { ...line, id, file: files(c.source).open, maestro: await parentIsMaestro($) }
}

/**
 * La fiche de fin d'une session (#123) gardée pour la fiche de sa tâche (#144) : dans le store, sous
 * le projet et le numéro du titre de la session (sinon celui de la ligne Fin), sans purge, pour
 * survivre à l'archivage. Une session de vérification ne remplace pas le récap de celle de travail.
 */
async function saveEndFiche($: EngineInterface, answer: string | undefined): Promise<void> {
  const c = capture
  if (!settings.capture || !c || !answer) return
  const fiche = parseEndFiche(answer)
  if (!fiche) return
  try {
    const title = (await readOwnSession($)).title
    if (sessionTitleKind(title) === 'check') return
    const id = sessionTitleId(title) ?? fiche.id
    if (id === undefined) return
    await $.store.set(recapKey(c.source.name, id), { ...fiche, at: await $.clock.now() })
  } catch {
    // store ou fiche de session illisibles : la fiche de tâche garde son cadre
  }
}

/**
 * La garde de l'archivage à la boîte de fin (#124) : « Archiver cette session ? » alors que la ligne de
 * la session est encore ouverte. Une boîte sans cette question, ou une roadmap illisible, passe.
 */
async function openLineAsk($: EngineInterface, ask: unknown): Promise<string | undefined> {
  if (typeof ask !== 'string' || !/archiver cette session/i.test(ask)) return undefined
  try {
    const line = await ownLine($)
    return line?.state === 'open' ? lineOpenRefusal(line.id, line.file, line.maestro) : undefined
  } catch {
    return undefined
  }
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
/**
 * Les cartes de session posées pendant le tour (leur « #N ») et le refus déjà donné (#122) : une boîte de
 * fin qui redemande de les lancer est refusée une fois par tour, jamais deux, pour ne pas enfermer le modèle.
 */
let launchTurn: { cards: string[]; refused: boolean; fromPanel: boolean } = { cards: [], refused: false, fromPanel: false }
/** Le message du plugin qui lance depuis le panneau (#140) est entré : le tour qu'il ouvre ne laisse aucun rappel. */
let launchPending = false
/**
 * Sous sec-default, le rappel de fin de tour attend le message suivant (#140) : `pendingReminder` le
 * garde, `reminderCarried` dit que le message qui ouvre le tour l'a reçu (le tour tient alors le rôle
 * du deuxième arrêt d'un tour, `stop_hook_active`).
 */
let pendingReminder: string | undefined
let reminderCarried = false

/** Le rappel de la liste d'étapes : tour de travail, aucune liste posée dans la session, dans tout projet (#104). */
function stepListNote(): string | undefined {
  return stepList.planned || stepList.tools < STEP_LIST_MIN_TOOLS ? undefined : stepListReminder()
}

/**
 * Les livraisons (#136) dont la liste d'étapes n'a pas encore été renvoyée : une fusion sur main ou une
 * publication les note, un `update_plan` avec sa liste entière les efface, la fin de tour les redit une fois.
 */
let delivered: { kinds: Delivery['kind'][]; maestro: boolean } = { kinds: [], maestro: false }

/** Les livraisons d'une commande Bash réussie : une fusion seulement dans le dossier principal du dépôt. */
async function deliveredBy($: EngineInterface, command: unknown): Promise<Delivery['kind'][]> {
  if (typeof command !== 'string' || !/\bmerge\b|release\.py/.test(command)) return []
  const kinds: Delivery['kind'][] = []
  for (const d of deliveries(command, await $.session.cwd(), (await $.env.get('HOME')) ?? '')) {
    if (d.kind === 'publication') {
      kinds.push('publication')
      continue
    }
    const repo = /[$`]/.test(d.dir) ? undefined : await repoOf($, d.dir)
    if (repo !== undefined && repo.top === repo.main) kinds.push('fusion')
  }
  return kinds
}

/** Le rappel de fin de tour d'une livraison sans liste renvoyée (#136), une seule fois. */
function deliveryNote(): string | undefined {
  if (delivered.kinds.length === 0) return undefined
  const text = deliveryReminder(delivered.kinds, delivered.maestro, true, closingTurn.wake)
  delivered = { kinds: [], maestro: false }
  return text
}

/**
 * Le tour du fil principal, pour le rappel de fin de tour (#116) : son id, si Stop a tourné pendant lui
 * (sinon sec-default l'a sauté), et si son message a reçu le rappel du tour d'avant (#140 ; il tient alors le rôle du
 * deuxième arrêt d'un tour, `stop_hook_active`).
 */
let stopTurn = { id: '', stopRan: false, fromReminder: false }

/**
 * Le rappel de fin de tour, ou rien : roadmap, méthode, idée, liste d'étapes, bloc de fin, rangement.
 * `active` : le modèle a déjà eu le rappel de ce tour ; `blocked` : un autre rappel bloque déjà l'arrêt.
 * Le hook Stop le rend en `block` ; sous sec-default, `turn.complete` le garde pour le message suivant (#140).
 */
async function endOfTurnBlock($: EngineInterface, last: string | undefined, active: boolean, blocked: boolean): Promise<string | undefined> {
  // Le tour d'un lancement depuis le panneau n'a fait que poser une carte : aucun rappel (#140).
  if (launchTurn.fromPanel) return undefined
  const c = capture
  // Un autre rappel bloque déjà l'arrêt : la ligne se note, l'archivage attend l'arrêt suivant.
  const ranged = settings.capture ? rangementNote(c, last, active && !blocked) : undefined
  if (ranged !== undefined) return ranged
  // Deuxième arrêt du même tour : le modèle a déjà eu le rappel, il a tranché.
  if (active || blocked) return undefined
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
      notes.push(await ideaNote($, c, last))
    } catch {
      // pas de rappel d'idée
    }
  }
  // La liste d'étapes (#98, #104) : dans tout projet ; après une fusion ou une publication (#136).
  notes.push(stepListNote())
  notes.push(deliveryNote())
  // Le bloc de fin de tour (#85) : dans tout projet.
  try {
    notes.push(await closingNote($, last, settings.capture && c !== undefined && rangementWaiting(c) !== undefined))
  } catch {
    // réglages illisibles : pas de rappel du bloc
  }
  const block = notes.filter((b): b is string => b !== undefined).join('\n\n')
  return block === '' ? undefined : block
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
      const added = addedOpenTasks((before ?? c.seen).open, after)
      const step = await markWorking($, c.source, added)
      if (step) notes.push(step)
      // #171 : une ligne neuve rappelle le fichier des règles, s'il existe ; jamais un refus.
      const regles = reglesPath(c.source)
      const rule = added.length > 0 && (await $.fs.exists(regles).catch(() => false)) ? reglesNote(regles, added) : undefined
      if (rule) notes.push(rule)
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

/** Le travail d'un dossier gardé 5 minutes (#176) : un `git init` ou un premier fichier de code se voit au plus tard après. */
const WORK_TTL_MS = 5 * 60_000
const workSeen = new Map<string, { travail: Travail; at: number }>()

/**
 * Le travail d'un dossier (#176) : `git ls-files` voit-il un fichier de code (`workOf`) ? Mémorisé par
 * dossier. Un git lent ou en échec garde la valeur gardée, sinon `code`, le défaut d'avant : un git
 * qui tarde ne retire pas son worktree à une session de code.
 */
async function detectWork($: EngineInterface, dir: string): Promise<Travail> {
  const seen = workSeen.get(dir)
  try {
    const now = await $.clock.now()
    if (seen && now - seen.at < WORK_TTL_MS) return seen.travail
    const ran = await $.process.run(['git', '--no-optional-locks', '-C', dir, 'ls-files', '--cached', '--others', '--exclude-standard'], { timeoutMs: GIT_TIMEOUT_MS })
    const travail = workOf(ran.exitCode, ran.stdout)
    workSeen.set(dir, { travail, at: now })
    return travail
  } catch {
    return seen?.travail ?? 'code'
  }
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
        if (found) return await withWork($, found, bases[0]!)
      }
    }

    const known = sourceFor(perso.sources, cwd) ?? sourceFor(perso.sources, root)
    if (known) return await withWork($, known, bases[0]!)

    for (const base of bases) {
      if (await $.fs.exists(`${base}/ROADMAP.md`)) return await withWork($, { ...defaults, match: [base], dir: base, subjects: [] }, bases[0]!)
    }
    return undefined
  } catch {
    return undefined
  }
}

/**
 * La source, avec le travail du dossier de la session (#176) : son dossier principal, pas celui de la
 * roadmap (adBricks : la roadmap dans Adbricks Cowork, le code dans Work/Adbricks). `mode` l'emporte.
 */
async function withWork($: EngineInterface, source: Source, dir: string): Promise<Source> {
  return source.mode ? source : { ...source, travail: await detectWork($, dir) }
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
 * relit : Bertrand peut la nommer après le chargement du panneau (« Maestro »).
 */
let ownSession: { id: string | undefined; title: string; parent?: string | null } | null = null

async function readOwnSession($: EngineInterface, fresh = false): Promise<{ id: string | undefined; title: string; parent?: string | null }> {
  if (ownSession !== null && !fresh) return ownSession
  try {
    const ran = await $.tool.call({ tool: GET_SESSION_TOOL, session_id: 'self' })
    const text = ran.deny === undefined && !ran.isError ? (ran.text ?? '') : ''
    ownSession = { id: sessionIdIn(text), title: sessionTitleIn(text), parent: sessionParentIn(text) }
  } catch {
    ownSession = { id: undefined, title: '' }
  }
  return ownSession
}

async function ownAppSession($: EngineInterface): Promise<string | undefined> {
  return (await readOwnSession($)).id
}

/**
 * Cette session est-elle un Maestro ? Son titre (« Maestro … », ou son alias « Lot … »), sa marque, ou
 * sa famille : au moins deux sessions qu'elle a lancées encore ouvertes (`maestroSessionIds`). Une
 * session qui a un Maestro au-dessus n'en est jamais un (#132). Un Maestro titré ou marqué sans parent
 * (`parent: null`, fiche lue) n'a personne au-dessus : la liste ne se relit pas. Sinon elle se relit
 * à la demande — une ligne ouverte, une fin de tour qui cocherait sa tâche, un ▶ — et une liste
 * refusée ou illisible laisse le titre et la marque juger seuls.
 */
async function ownIsMaestro($: EngineInterface, own: { id: string | undefined; title: string; parent?: string | null }): Promise<boolean> {
  const marks = await loadMaestros($)
  const named = isMaestroSession(own.title) || (own.id !== undefined && marks[own.id] !== undefined)
  if (named && own.parent === null) return true
  if (!own.id || listDenied) return named
  try {
    toolCalls++
    const ran = await $.tool.call({ tool: LIST_SESSIONS_TOOL, limit: LIST_LIMIT })
    if (ran.deny !== undefined || ran.isError) return named
    const listedRows: unknown = JSON.parse(ran.text ?? '[]')
    if (!Array.isArray(listedRows)) return named
    // La liste exclut cette session : sa rangée, avec son parent, la rejoint.
    const rows = typeof own.parent === 'string'
      ? withSelfRow(listedRows, { sessionId: own.id, title: own.title, startedBy: own.parent, isArchived: false })
      : listedRows
    const maestros = new Set(Object.keys(marks))
    if (maestroRootOf(own.id, undefined, rows, maestros, named)) return false
    return named || maestroSessionIds(rows, maestros).has(own.id)
  } catch {
    return named
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

/** Les propositions gardées pour les Maestros ; seules les entrées bien formées comptent. */
async function loadProposals($: EngineInterface): Promise<MaestroProposal[]> {
  const stored = await $.store.get(PROPOSALS_KEY)
  if (!Array.isArray(stored)) return []
  return stored.filter((p): p is MaestroProposal => {
    const v = p as Partial<MaestroProposal> | null
    return !!v && typeof v.lot === 'string' && typeof v.from === 'string' && typeof v.title === 'string'
      && typeof v.prompt === 'string' && typeof v.at === 'number'
  })
}

/**
 * Bertrand ne pilote ses sessions que par Maestro (demande du 2026-10-27) et ne veut qu'un niveau sous
 * lui (#132, 2026-10-30) : toute création de session que le modèle demande dans un descendant de
 * Maestro, carte `own_initiative`, `offer` ou lancement `user_asked`, part à son Maestro racine
 * (`maestroParentOf`), qui pose la carte : la session créée est sa fille directe. Un lancement ailleurs
 * (`ELSEWHERE_OPTIONS` : autre dossier, SSH, cloud) reste ici, l'app ne le prenant qu'en `user_asked`. Elle part par message
 * (il se réveille et la lit dans son transcript) ; un message refusé la garde dans le store, et Maestro
 * la reçoit à son prochain tour. Une `offer` sans brief ou une carte `fork` revient à la sous-session,
 * à reposer en `own_initiative` `fresh` : le brief s'écrit là où est le contexte. Le modèle lit, à la
 * place de sa carte, où elle est partie. Tout le reste passe : le ▶ du panneau, une carte à
 * `proposal_id`, une session sans Maestro, et toute panne. Le moteur ne fait pas passer les
 * `$.tool.call` du panneau par ses propres hooks (mesuré en test le 2026-10-28) : l'origine vérifiée
 * ici garde le ▶ si cela changeait.
 */
async function forwardProposal(
  $: EngineInterface,
  e: unknown,
  origin: string,
  pass: () => Promise<ToolCallResult>,
): Promise<ToolCallResult> {
  const card = e as Record<string, unknown> & { initiation?: unknown; title?: unknown; prompt?: unknown; background?: unknown; context?: unknown; proposal_id?: unknown }
  const initiation = card.initiation
  if (origin !== 'engine' || card.proposal_id !== undefined) return pass()
  if (initiation !== 'own_initiative' && initiation !== 'user_asked' && initiation !== 'offer') return pass()
  if (typeof card.title !== 'string') return pass()
  // Un lancement ailleurs ne tient que dans un user_asked : une carte de Maestro ne le porterait pas.
  if (ELSEWHERE_OPTIONS.some(k => card[k] !== undefined)) return pass()
  let maestro: { id: string; title: string } | undefined
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
    maestro = maestroParentOf(self, Array.isArray(rows) ? rows : [], new Set(Object.keys(await loadMaestros($))))
  } catch {
    return pass()
  }
  if (!maestro || typeof self?.sessionId !== 'string') return pass()
  const name = maestro.title || 'Maestro'
  if (card.context === 'fork') return { deny: proposalRetryNote(name, 'fork', initiation) }
  if (typeof card.prompt !== 'string' || card.prompt === '') {
    return initiation === 'offer' ? { deny: proposalRetryNote(name, 'offer', initiation) } : pass()
  }
  const options = Object.fromEntries(PROPOSAL_OPTIONS
    .filter(k => typeof card[k] === 'string' || typeof card[k] === 'boolean')
    .map(k => [k, card[k] as string | boolean]))
  const proposal: MaestroProposal = {
    lot: maestro.id,
    from: self.sessionId,
    fromTitle: typeof self.title === 'string' ? self.title : '',
    title: card.title,
    prompt: card.prompt,
    ...(typeof card.background === 'string' && card.background !== '' ? { background: card.background } : {}),
    at: await $.clock.now(),
    ...(initiation !== 'own_initiative' ? { initiation } : {}),
    ...(Object.keys(options).length > 0 ? { options } : {}),
  }
  try {
    const sent = await $.tool.call({ tool: SEND_MESSAGE_TOOL, session_id: maestro.id, message: maestroProposalText([proposal]) })
    if (sent.deny === undefined && !sent.isError) return { deny: proposalSentNote(name, card.title, 'message', proposal.initiation) }
  } catch {
    // outil absent : la proposition est gardée pour Maestro
  }
  try {
    await $.store.set(PROPOSALS_KEY, [...(await loadProposals($)), proposal])
    return { deny: proposalSentNote(name, card.title, 'store', proposal.initiation) }
  } catch {
    return pass()
  }
}

/**
 * Option « Lancer en bypass » (#87) : la carte que pose Claude (Maestro, repli du panneau)
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
 * Les propositions gardées pour ce Maestro, à donner au modèle en tête de son tour ; elles sortent
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
  return mine.length > 0 ? maestroProposalText(mine) : undefined
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

/** Le parent de cette session est un Maestro : gardé, un parent ne cesse pas de l'être (#124). */
let parentMaestro = false

/**
 * Cette session a-t-elle été lancée par un Maestro (#124) ? Sa ligne est alors tenue par lui, qui la
 * coche à la fusion : la clause lui interdit d'y toucher. Le parent se juge comme Maestro lui-même :
 * son titre, sa marque, ou sa famille. Une fiche illisible dit non, sans se garder.
 */
async function parentIsMaestro($: EngineInterface): Promise<boolean> {
  if (parentMaestro) return true
  try {
    const me = await ownParent($)
    if (!me) return false
    const ran = await $.tool.call({ tool: GET_SESSION_TOOL, session_id: me.parent })
    const title = ran.deny === undefined && !ran.isError ? sessionTitleIn(ran.text ?? '') : ''
    parentMaestro = await ownIsMaestro($, { id: me.parent, title })
  } catch {
    // fiche illisible : pas un enfant de Maestro
  }
  return parentMaestro
}

// --- Réveil de Maestro (#131) ------------------------------------------------------------------

/** La clé du dernier état dit à Maestro : le même ne repart pas tant qu'aucun vrai message n'a relancé la session. */
let toldMaestro: string | undefined

/** Ce que la boîte de fin du tour a dit (récap et question), lu à la fin du tour. */
let wakeBox: { recap?: string; ask?: string } = {}

/**
 * Une session lancée par Maestro lui dit, par message, l'état où elle s'arrête (#131) : l'app ne le
 * réveille que quand toutes ses sessions sont au repos. Une fois par état ; rien sans Maestro pour
 * parent ; aucune panne (fiche, message refusé) ne bloque le tour.
 */
async function tellMaestro($: EngineInterface, wake: ChildWake): Promise<void> {
  if (wake.key === toldMaestro) return
  try {
    if (!(await parentIsMaestro($))) return
    const me = await ownParent($)
    if (!me) return
    const ran = await $.tool.call({ tool: GET_SESSION_TOOL, session_id: 'self' })
    const fiche = ran.deny === undefined && !ran.isError ? (JSON.parse(ran.text ?? '{}') as { title?: unknown; branch?: unknown }) : {}
    const child = {
      id: me.id,
      title: typeof fiche.title === 'string' ? fiche.title : '',
      ...(typeof fiche.branch === 'string' && fiche.branch !== '' ? { branch: fiche.branch } : {}),
    }
    const sent = await $.tool.call({ tool: SEND_MESSAGE_TOOL, session_id: me.parent, message: childWakeText(wake, child) })
    if (sent.deny === undefined && !sent.isError) toldMaestro = wake.key
  } catch {
    // fiche illisible ou outil absent : Maestro l'apprendra par l'app ou au message suivant
  }
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
  // Un contexte d'un autre format tombe seul : la note garde ses étapes (#157).
  if ((value as { context?: unknown }).context !== undefined && !contextUseOf((value as { context?: unknown }).context)) {
    const { context: _, ...rest } = value as ChildStatus
    return rest
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
 * `keepAt` garde l'heure de la note (#157 : le contexte n'est pas une nouvelle de ses étapes) ; un
 * `change` qui rend la note telle quelle n'écrit rien.
 */
function noteChild($: EngineInterface, change: (s: ChildStatus, now: number) => ChildStatus, opts: { keepAt?: boolean } = {}): Promise<void> {
  noting = noting.then(async () => {
    try {
      const me = await ownParent($)
      if (!me) return
      const key = `${CHILD_STATUS_PREFIX}${me.id}`
      const prev = childStatusOf(await $.store.get(key)) ?? { steps: [], at: 0 }
      const now = await $.clock.now()
      const changed = change(prev, now)
      if (changed === prev) return
      await $.store.set(key, { ...changed, at: opts.keepAt && prev.at > 0 ? prev.at : now })
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

/** Ce que le parent lit de sa roadmap pour juger ses enfants : les numéros ouverts et clos, le `mode` qui force, ses dossiers. */
type ParentLines = { open: Set<string>; done: Set<string>; mode?: Mode; match: string[] }

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
 * fiche (`sourceBranch`), sinon `main` (#90). Sans code (#176), un enfant dans le dossier partagé du
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
  // Sans code (#76, #176) : les sessions partagent le dossier du projet, sans branche ; seule la ligne
  // compte. Le dossier de l'enfant le dit, sauf `mode` de la roadmap qui force.
  if (inProject && !cwd.includes('/.claude/worktrees/') && (known?.mode ?? (await detectWork($, cwd))) === 'projet') {
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
  // Les archivées comprises : le filet de #124 voit un enfant archivé avant la clôture de sa ligne.
  const listed = await $.tool.call({ tool: LIST_SESSIONS_TOOL, linked: true, include_archived: true, limit: LIST_LIMIT })
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
  let archived: ChildRow[] = []
  try {
    archived = archivedChildrenOf(rows, id, await $.clock.now())
  } catch {
    // horloge illisible : pas de filet ce message-ci
  }
  if (children.length === 0 && archived.length === 0) return undefined
  let known: Promise<ParentLines | undefined> | undefined
  const lines = () => {
    known ??= (async () => {
      const source = await sourceNow($)
      if (!source) return undefined
      const ids = (tasks: Task[] | string) => new Set(typeof tasks === 'string' ? [] : tasks.flatMap(t => (t.id ? [t.id] : [])))
      return { open: ids(await load($, files(source).open, 'ROADMAP.md')), done: ids(await load($, files(source).done, 'ROADMAP-fait.md')), ...(source.mode ? { mode: source.mode } : {}), match: source.match }
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
  const lost = await archivedOpen($, archived, lines).catch(() => [])
  const text = [childAlertText(alerts), archivedOpenText(lost)].filter((t): t is string => t !== undefined).join('\n\n')
  return text === '' ? undefined : text
}

/**
 * Le filet (#124) : les enfants archivés dont la ligne `#N` est encore ouverte dans la roadmap de
 * Maestro, et leur branche fusionnée ou non dans leur base, lue dans le dépôt de Maestro (le worktree
 * de l'enfant a pu partir avec l'archivage, sa branche reste). Hors du projet de Maestro : rien.
 */
async function archivedOpen($: EngineInterface, archived: readonly ChildRow[], lines: () => Promise<ParentLines | undefined>): Promise<ArchivedOpen[]> {
  if (archived.length === 0) return []
  const known = await lines()
  if (!known) return []
  const root = await $.session.root()
  const out: ArchivedOpen[] = []
  for (const child of archived) {
    const n = sessionTitleId(child.title)
    const cwd = child.cwd
    if (!n || !known.open.has(n) || known.done.has(n) || !cwd || !known.match.some(prefix => cwd.startsWith(prefix))) continue
    let merged: boolean | undefined
    if (child.branch) {
      try {
        const base = (await childFiche($, child.id)).base
        const code = (await gitIn($, root, 'merge-base', '--is-ancestor', child.branch, base)).code
        merged = code === 0 ? true : code === 1 ? false : undefined
      } catch {
        // git illisible : la ligne ouverte suffit à le dire
      }
    }
    out.push({ child, ...(merged !== undefined ? { merged } : {}) })
  }
  return out
}

/**
 * La question d'archivage d'un Maestro relue au moment de la poser (#110) : ses nouvelles datent du début
 * du tour, et Bertrand a pu archiver une session depuis sa propre boîte de fin entre-temps. Le refus
 * nomme celles déjà archivées ; une question qui n'archive rien, ou une liste illisible, passe.
 */
async function archivedAsk($: EngineInterface, ask: unknown): Promise<string | undefined> {
  if (typeof ask !== 'string' || !/archiv/i.test(ask) || !/#\d|local_/.test(ask)) return undefined
  try {
    const listed = await $.tool.call({ tool: LIST_SESSIONS_TOOL, linked: true, include_archived: true, limit: LIST_LIMIT })
    if (listed.deny !== undefined || listed.isError) return undefined
    const rows: unknown = JSON.parse(listed.text ?? '[]')
    const id = Array.isArray(rows) ? (await readOwnSession($)).id : undefined
    const names = Array.isArray(rows) && id ? archivedInAsk(ask, rows, id) : []
    return names.length > 0 ? archivedAskRefusal(names) : undefined
  } catch {
    return undefined
  }
}

/**
 * La boîte de fin qui redemande de lancer une session (#122) : sa carte est posée dans ce tour, ou sa
 * session liée tourne déjà. La famille ne se relit que pour une question de lancement ; illisible,
 * seules les cartes du tour comptent. Refusée une fois par tour.
 */
async function launchAsk($: EngineInterface, box: { ask?: unknown; actions?: unknown }): Promise<string | undefined> {
  if (launchTurn.refused || !isLaunchAsk(box)) return undefined
  let rows: unknown[] = []
  let selfId = ''
  try {
    const listed = await $.tool.call({ tool: LIST_SESSIONS_TOOL, linked: true, include_archived: true, limit: LIST_LIMIT })
    const parsed: unknown = listed.deny === undefined && !listed.isError ? JSON.parse(listed.text ?? '[]') : []
    if (Array.isArray(parsed) && parsed.length > 0) {
      rows = parsed
      selfId = (await readOwnSession($)).id ?? ''
    }
  } catch {
    rows = []
  }
  const found = launchInBox(box, launchTurn.cards, rows, selfId)
  if (found.card.length === 0 && found.live.length === 0) return undefined
  launchTurn.refused = true
  return launchBoxRefusal(found)
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
 * Une session Maestro ouvre et coche les lignes de ses features sans travailler sur aucune : elle
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
    const own = await readOwnSession($, true)
    const { id: sessionId, title } = own
    if (!sessionId) return undefined
    const live = await loadLive($)
    const ignored = await loadIgnored($)
    const mine = Object.keys(live).filter(k => live[k]?.via === 'write' && live[k]?.sessionId === sessionId)
    const keys = new Set([...mine, ...added.map(t => liveKeyOf(source, t))])
    // Un Maestro (titre ou famille) n'est sur aucune tâche : il les lance.
    const maestro = await ownIsMaestro($, own)
    if (maestro) note = maestroTasksNote(added)
    const step = oneTaskStep(title, added)
    if (!maestro && step.kind === 'other') return otherTaskNote(step.own, step.task, await shortTitleOf($, step.task))
    if (maestro || keys.size > 1) {
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
/** La session qui a lancé chaque session listée (`startedBy`) : Maestro ne compte que les siennes (#121). */
const startedBySession = new Map<string, string>()
/** Les sessions ouvertes (non archivées) de la dernière relecture : le parent d'une session suivie est-il encore là (#121) ? */
let openSessionIds = new Set<string>()
// Les sessions archivées par le panneau ou la bande (#174) : fermées avant la relecture suivante des sessions.
const archivedSessionIds = new Set<string>()
/** Les rangées de la dernière relecture, fiche de cette session comprise : les filles de Maestro s'y lisent (#137). */
let sessionRows: unknown[] = []
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
 * La liste des autres sessions de l'app. Refusée par les réglages : vide, jusqu'au nouvel essai d'une
 * minute plus tard ; refusée par le contrôle du mode auto, en panne ou illisible : la dernière lue (#185 :
 * vidée, Maestro perdait ses sessions et son bloc « En cours »). Un outil absent ne dit rien.
 */
async function readListRows($: EngineInterface): Promise<{ rows: unknown[]; note: string }> {
  const kept = () => ({ rows: lastListRows, note: lastListRows.length > 0 ? '' : sessionScanNote('denied') })
  if (listDenied && pollTick - listDeniedTick < LIST_RETRY_TICKS) return kept()
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
    if (!isAutoModeRefusal(ran.deny)) lastListRows = []
    return kept()
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
 * tient aussi à jour l'identifiant et le titre gardés (`ownSession`) : une session nommée « Maestro · … »
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
    ownSession = { id: sessionIdIn(text), title: sessionTitleIn(text), parent: sessionParentIn(text) }
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
    const maestros = maestroSessionIds(sessions, new Set(Object.keys(await loadMaestros($))))
    // Une session qui finit son tour (ou le reprend) change sa marque : la main ou la roue.
    let runningChanged = false
    const open = new Set<string>()
    for (const raw of sessions) {
      const sess = raw as { sessionId?: unknown; title?: unknown; cwd?: unknown; isArchived?: unknown; lastActivityAt?: unknown; link?: unknown; startedBy?: unknown }
      if (typeof sess.sessionId === 'string' && sess.isArchived !== true) open.add(sess.sessionId)
      if (typeof sess.sessionId === 'string' && typeof sess.startedBy === 'string') startedBySession.set(sess.sessionId, sess.startedBy)
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
      // Une session Maestro (titre ou famille) coordonne ses features : aucune n'est la sienne.
      if (isMaestroSession(sess.title) || maestros.has(sess.sessionId)) continue
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
    openSessionIds = open
    sessionRows = sessions
    const same = next.size === sessionMatches.size && [...next].every(([k, v]) => sessionMatches.get(k)?.sessionId === v.sessionId)
    sessionMatches = next
    // Les étapes des sessions suivies (#143) : une étape cochée en plein tour redessine le panneau.
    const stepsChanged = await stepsMoved($)
    if (!same || runningChanged || stepsChanged) await update($, liveVersionAtom, v => v + 1)
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

// ── Rafraîchir (#138) ─────────────────────────────────────────────────────

/**
 * Où la dernière version publiée se lit : le `plugin.json` du dépôt public, que `tools/release.py` publie
 * à chaque version (`PUBLIC_REPO`). Le dépôt de travail, privé, n'est pas lisible des autres comptes.
 */
const PUBLISHED_RAW = 'https://raw.githubusercontent.com/bbr21/roadmap-plugin/main/plugins/roadmap/.claude-plugin/plugin.json'
const PUBLISHED_API = 'repos/bbr21/roadmap-plugin/contents/plugins/roadmap/.claude-plugin/plugin.json'
/**
 * Les lectures, dans l'ordre : `curl`, sans compte ; puis `gh`, en secours. Chacune par le PATH, puis à sa
 * place sur le Mac (l'app lance les commandes sans le PATH du terminal).
 */
const PUBLISHED_READS: readonly (readonly string[])[] = [
  ...['curl', '/usr/bin/curl'].map(c => [c, '-fsSL', '--max-time', '10', PUBLISHED_RAW]),
  ...['gh', '/opt/homebrew/bin/gh', '/usr/local/bin/gh'].map(g => [g, 'api', '-H', 'Accept: application/vnd.github.raw', PUBLISHED_API]),
]

/** La version que tourne cette session : lue au chargement du module, avant qu'une synchro de l'app ne réécrive le fichier. */
let sessionVersion: string | undefined

async function pluginVersionAt($: EngineInterface, root: string): Promise<string | undefined> {
  return publishedVersionOf((await readOr($, `${root}/.claude-plugin/plugin.json`)) ?? '')
}

async function loadSessionVersion($: EngineInterface): Promise<string> {
  // Illisible, elle vaut « ? » une fois pour toutes : un dessin ne relit pas le fichier (un clic ne relit rien).
  sessionVersion ??= (await pluginVersionAt($, $.plugin.root)) ?? '?'
  return sessionVersion
}

/**
 * La version de l'app, que prendra la prochaine session, et d'où elle la tient. D'abord le magasin du compte :
 * le `manifest.json` du dossier `rpm` qui contient ce plugin dit le dossier de l'entrée roadmap. Sinon le
 * catalogue local de Claude Code (#178) : l'entrée `roadmap@roadmap` de `installed_plugins.json`.
 * Ni l'un ni l'autre (`--plugin-dir`, terminal) : rien.
 */
async function appVersion($: EngineInterface): Promise<{ version?: string; source?: 'store' | 'local' }> {
  const rpm = $.plugin.root.replace(/\/[^/]+\/?$/, '')
  try {
    const manifest = JSON.parse(await $.fs.read(`${rpm}/manifest.json`)) as { plugins?: { id?: unknown; name?: unknown; marketplaceName?: unknown }[] }
    const entry = (manifest.plugins ?? []).find(p => p.name === 'roadmap' && p.marketplaceName === 'roadmap')
    if (entry && typeof entry.id === 'string') return { version: await pluginVersionAt($, `${rpm}/${entry.id}`), source: 'store' }
  } catch {
    // pas de magasin : le catalogue local
  }
  const config = ((await $.env.get('CLAUDE_CONFIG_DIR')) || `${(await $.env.get('HOME')) ?? ''}/.claude`).replace(/\/+$/, '')
  const version = localAppVersion((await readOr($, `${config}/plugins/installed_plugins.json`)) ?? '')
  return version ? { version, source: 'local' } : {}
}

/** La dernière version publiée, ou pourquoi elle ne se lit pas (la raison de la dernière lecture qui a démarré). */
async function publishedVersion($: EngineInterface): Promise<{ version?: string; error?: string }> {
  let error = 'ni curl ni gh'
  // Un outil qui a démarré et échoué (hors ligne, refus) ne se relance pas par un autre chemin.
  const started = new Set<string>()
  for (const argv of PUBLISHED_READS) {
    const tool = (argv[0] ?? '').replace(/^.*\//, '')
    if (started.has(tool)) continue
    try {
      const r = await $.process.run(argv, { timeoutMs: 15_000 })
      started.add(tool)
      const version = r.exitCode === 0 ? publishedVersionOf(r.stdout) : undefined
      if (version) return { version }
      error = (r.stderr.trim().split('\n')[0] ?? '').slice(0, 80) || 'réponse de GitHub illisible'
    } catch {
      // cette commande ne démarre pas : la suivante
    }
  }
  return { error }
}

/**
 * « Recharger » (#162) : le moteur refuse /reload-plugins lancé par un plugin dans une session de l'app ;
 * le bouton pose la commande dans la saisie (sinon la copie), puis redevient « Rafraîchir » et l'encart dit
 * ce qui s'est passé.
 */
async function reloadPlugin($: EngineInterface): Promise<void> {
  let filled = false
  let copied = false
  try {
    filled = (await $.prompt.fill({ text: RELOAD_COMMAND })).isFilled
  } catch {
    // pas de saisie : la copie
  }
  if (!filled) {
    try {
      copied = (await $.ui.copy({ text: RELOAD_COMMAND })).isCopied
    } catch {
      // ni saisie ni presse-papiers : le texte seul
    }
  }
  await update($, versionNoteAtom, note => ({ ...note, action: undefined, gesture: reloadOutcome({ filled, copied }) }))
}

/**
 * « Mettre à jour » (#178, maquette A) : le catalogue local se met à jour par deux commandes que le panneau ne
 * peut pas lancer ; le bouton pose dans la saisie la demande à Claude (sinon la copie), puis redevient
 * « Rafraîchir » et l'encart dit ce qui s'est passé.
 */
async function updateLocal($: EngineInterface): Promise<void> {
  let filled = false
  let copied = false
  try {
    filled = (await $.prompt.fill({ text: LOCAL_UPDATE_REQUEST })).isFilled
  } catch {
    // pas de saisie : la copie
  }
  if (!filled) {
    try {
      copied = (await $.ui.copy({ text: LOCAL_UPDATE_REQUEST })).isCopied
    } catch {
      // ni saisie ni presse-papiers : le texte seul
    }
  }
  await update($, versionNoteAtom, note => ({ ...note, action: undefined, gesture: updateLocalOutcome({ filled, copied }) }))
}

let refreshing = false

/** Le bouton Rafraîchir : tout se relit (fichiers, titres, sessions), puis les versions se comparent. */
async function refreshAll($: EngineInterface): Promise<void> {
  if (refreshing) return
  refreshing = true
  try {
    const session = await loadSessionVersion($)
    await update($, versionNoteAtom, () => ({ state: 'checking', text: '', foot: `roadmap ${session} · vérification…` }))
    paneCache = undefined
    await update($, retryAtom, v => v + 1)
    await refresh($)
    const [app, published] = await Promise.all([appVersion($), publishedVersion($)])
    const note = versionNote({ session, app: app.version, source: app.source, published: published.version, publishedError: published.error })
    await update($, versionNoteAtom, () => note)
  } catch {
    const session = await loadSessionVersion($)
    await update($, versionNoteAtom, () => ({ state: 'unknown', text: '', foot: `roadmap ${session} · non vérifiée` }))
  } finally {
    refreshing = false
  }
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
  const projet = projectSettings(source).travail === 'projet'
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
    // Bertrand, 2026-10-23 ; borné à celui de la session qui lance), puis, sans code (#76, #176), le
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
 * de Maestro quand la session qui lance en est un (elle ne fusionne pas).
 */
async function workBrief($: EngineInterface, source: Source, task: Task, shortTitle: string): Promise<{ title: string; prompt: string; background: string }> {
  const bilanLog = bilanConfigFor(await readOr($, `${source.dir}/cowork.json`)).log
  const own = await readOwnSession($, true)
  const maestro = own && (await ownIsMaestro($, own)) ? own.title || 'Maestro' : undefined
  return launchBrief(source, task, shortTitle, bilanLog, maestro, await briefFound($, source, task))
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
async function maestroText($: EngineInterface, go: boolean, only?: 'launch' | 'sessions'): Promise<string> {
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
  // Au repos n'est pas « en attente » : il y faut une question notée et vivante ; et seules ses
  // sessions comptent, celles d'un autre Maestro ouvert se disent à part (#121).
  const followed: MaestroTracked[] = []
  for (const t of open.filter(x => !x.done)) {
    const s = tracked(t)
    if (!s) continue
    const sid = s.entry.sessionId
    const parent = sid ? startedBySession.get(sid) : undefined
    followed.push({
      task: t,
      title: titleOf(t),
      ...(sid ? { id: sid } : {}),
      running: !sid || runningBySession.get(sid) !== false,
      startedAt: s.entry.startedAt,
      lastActivityAt: (sid && lastActivityBySession.get(sid)) || s.entry.startedAt,
      ...(parent ? { startedBy: parent } : {}),
      ...(s.entry.link ? { link: s.entry.link } : {}),
    })
  }
  const statuses: Record<string, ChildStatus | undefined> = {}
  for (const f of followed) if (f.id) statuses[f.id] = childStatusOf(await $.store.get(`${CHILD_STATUS_PREFIX}${f.id}`).catch(() => undefined))
  const me = ownSession?.id
  const { waiting, running, others } = maestroSplit({ tracked: followed, ...(me ? { me } : {}), openSessions: openSessionIds, statuses, now })
  // #76, #176 : une tâche qu'une autre personne porte (`resp:`) ne se lance pas, elle se relance.
  const projet = projectSettings(source).travail === 'projet'
  const ready = launchable(open, { prereqOf: prereq, isLive: t => tracked(t) !== undefined, me: source.me }).filter(
    t => !view.launched.includes(taskKey(t)) && !heldByOther(t, source.me),
  )
  const openTasks = open.filter(t => !t.done)
  const othersLate = openTasks.filter(t => heldByOther(t, source.me) && isOverdue(t, todayOf(now))).length
  // Les réglages de session du projet (#119) : `questions` et `adhd` règlent le texte de Maestro.
  // Illisibles : les défauts, `autonome` éteint.
  const prefs = await readSessionPrefs($).then(r => r.prefs, () => DEFAULT_SESSION_PREFS)
  // Le réglage autonome (#77) : les cartes sans menu, comme « Maestro go ». Sans code, Maestro
  // garde son menu : seules la fusion et la publication sans demander y valent, par le bloc des
  // réglages (#105, README « Mode Projet »).
  const autonome = !projet && prefs.autonome
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
    others,
    candidates,
    more: ready.length - candidates.length,
    go,
    autonome,
    questions: prefs.questions,
    adhd: prefs.adhd,
    ...(othersLate > 0 ? { othersLate } : {}),
    ...(LAUNCH_EFFORTS.has(settings.launchEffort) ? { launchEffort: settings.launchEffort } : {}),
    ...(only ? { only } : {}),
  })
}

/** Sans roadmap dans ce projet, « Maestro » propose l'onboarding. */
async function noRoadmapText($: EngineInterface): Promise<string> {
  return `${Person()} a dit « Maestro », mais ce projet (${await $.session.root()}) n'a pas de roadmap : dis-le en une phrase, et propose la skill roadmap:onboarding, qui la pose dans le dépôt (et peut la reconstituer depuis son historique).`
}

/**
 * L'accueil de Maestro (#141), compté sur la roadmap seule : la carte et le contexte de « Maestro »
 * le partagent. Rien des sessions n'est relu (#126) : seules les tâches de Maestro déjà connues comptent.
 */
async function welcomeOf($: EngineInterface, data: NonNullable<Awaited<ReturnType<typeof brandData>>>): Promise<Welcome> {
  const ms = await $.clock.now()
  const settings = projectSettings(data.source)
  const facts = welcomeFacts({
    tasks: data.tasks,
    today: todayOf(ms),
    me: data.source.me ?? [],
    relanceDays: settings.relanceDays,
    sessions: data.maestroTasks.filter(t => t.state !== 'done').length,
  })
  return welcomeText(facts, { person: Person(), now: new Date(ms) })
}

/**
 * « Maestro » seul (#126, #141) : le panneau s'ouvre, la carte d'accueil porte les chiffres et les
 * boutons, et Maestro ne dit que l'encouragement ; rien n'est lu des sessions avant un clic.
 */
async function maestroIntroText($: EngineInterface): Promise<string> {
  const source = await sourceNow($)
  if (!source) return noRoadmapText($)
  void openPane($, source)
  const data = await brandData($)
  if (!data) throw new Error('roadmap illisible')
  return maestroIntro({ source, welcome: await welcomeOf($, data), cardShown: welcomeCardShown(await loadWelcomeCard($)) })
}

/** Ce que la carte d'accueil a vu sur cette machine ; store illisible : la carte compte pour vue. */
async function loadWelcomeCard($: EngineInterface): Promise<WelcomeCardSeen | undefined> {
  try {
    const stored = await $.store.get(WELCOME_CARD_KEY)
    return typeof stored === 'object' && stored !== null && !Array.isArray(stored) ? (stored as WelcomeCardSeen) : undefined
  } catch {
    return { reachedAt: 0 }
  }
}

/** Le dessin d'un message se note une fois par module ; une carte, dessinée ou en panne, à chaque fois (#153). */
let welcomeCardReached = false
/** Les écritures du sort, l'une après l'autre : deux dessins ne s'effacent pas leurs champs. */
let welcomeCardWrites: Promise<void> = Promise.resolve()

/** Note le sort de la carte d'accueil (#153) ; jamais bloquant. */
function noteWelcomeCard($: EngineInterface, kind: 'reachedAt' | 'drawnAt' | 'failedAt', error?: string): Promise<void> {
  if (kind === 'reachedAt') {
    if (welcomeCardReached) return welcomeCardWrites
    welcomeCardReached = true
  }
  welcomeCardWrites = welcomeCardWrites.then(async () => {
    try {
      const at = await $.clock.now()
      const seen = (await loadWelcomeCard($)) ?? {}
      await $.store.set(WELCOME_CARD_KEY, { ...seen, [kind]: at, ...(error !== undefined ? { error } : {}) })
    } catch {
      // store illisible : le sort se notera au prochain chargement du module
    }
  })
  return welcomeCardWrites
}

/** Une action de l'accueil (#141) : ce que lit son bouton, à la place du scan entier. */
async function maestroActionText($: EngineInterface, action: MaestroAction): Promise<string> {
  if (action === 'lancer') return maestroText($, false, 'launch')
  if (action === 'sessions') return maestroText($, false, 'sessions')
  const source = await sourceNow($)
  if (!source) return noRoadmapText($)
  void openPane($, source)
  const data = await brandData($)
  if (!data) throw new Error('roadmap illisible')
  const today = todayOf(await $.clock.now())
  const me = source.me ?? []
  if (action === 'journee') return maestroDayContext({ source, sections: todaySections(data.tasks, today, me), titleOf: data.short, today })
  const relanceDays = projectSettings(source).relanceDays
  return maestroRelaunchContext({ source, tasks: data.tasks.filter(t => isToRelaunch(t, today, me, relanceDays)), titleOf: data.short, today, me })
}

/**
 * Un bouton de l'accueil envoie son message au nom de la personne (#141). Parti d'un clic, l'envoi
 * sauterait les hooks de ce plugin (#140) : il attend dans la boîte d'envoi, que le dessin du panneau
 * vide ; le panneau se redessine tout de suite.
 */
async function submitWelcome($: EngineInterface, text: string): Promise<void> {
  queueSubmit($, text)
  await update($, liveVersionAtom, v => v + 1)
}

/** Sans outil de lancement utilisable, la demande part à Claude dans la conversation en cours. */
async function askClaude($: EngineInterface, brief: { title: string; prompt: string; background: string }, refusals: readonly string[] = []): Promise<void> {
  try {
    const source = await sourceNow($)
    await submitLaunch($, brief, viaClaudeNote(refusals), source ? projectSettings(source).travail : 'code')
  } catch (err) {
    await setView($, () => ({ launchNote: `Lancement impossible : ${err instanceof Error ? err.message : String(err)}` }))
  }
}

/**
 * Le lancement par Claude en attente d'envoi (#140). Un envoi parti d'un bouton du panneau saute tous
 * les hooks de ce plugin (vérifié au kit, 2026-10-30) : le hook prompt.submit n'y réduirait pas le
 * brief à une ligne. Le bouton dépose donc le texte ici, et le dessin du panneau qui suit l'envoie.
 */
let launchOutbox: string | undefined
/** Sans dessin du panneau dans ce délai, le lancement part quand même, le brief entier visible. */
const LAUNCH_FALLBACK_MS = 3000

/** Envoie le lancement en attente, une seule fois : depuis le dessin du panneau, ou le secours ; au nom de la personne (#170). */
function sendLaunch($: EngineInterface, text?: string): void {
  if (launchOutbox === undefined || (text !== undefined && launchOutbox !== text)) return
  const out = launchOutbox
  launchOutbox = undefined
  void $.prompt.submit(panelSubmit(out)).catch(() => undefined)
}

/** Dépose un envoi dans la boîte d'envoi : le prochain dessin du panneau l'envoie, sinon le secours. */
function queueSubmit($: EngineInterface, text: string): void {
  launchOutbox = text
  try {
    $.clock.after(LAUNCH_FALLBACK_MS, () => sendLaunch($, text))
  } catch {
    // horloge refusée : le prochain dessin du panneau l'envoie seul
  }
}

async function submitLaunch($: EngineInterface, brief: { title: string; prompt: string; background: string }, note: string, travail: Travail = 'code'): Promise<void> {
  // La conversation n'en montre que la première ligne : le hook prompt.submit passe le reste en contexte (#140).
  const text = launchPrompt(
    brief.title,
    [
      `Propose cette session sous forme de carte (${cardTool(LAUNCH_EFFORTS.has(settings.launchEffort) ? settings.launchEffort : undefined, travail)}), titre « ${brief.title} », avec ce brief. Pose la carte sans essayer de la lancer, puis réponds en une phrase au plus :`,
      '',
      brief.prompt,
      '',
      `Contexte : ${brief.background}`,
    ].join('\n'),
  )
  queueSubmit($, text)
  // La note change la vue : le panneau se redessine et envoie le lancement.
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
async function archiveSession($: EngineInterface, key: string, entry: LiveEntry): Promise<boolean> {
  await setView($, () => ({ openNote: '' }))
  if (!entry.sessionId) return false
  try {
    const ran = await $.tool.call({ tool: ARCHIVE_SESSION_TOOL, session_id: entry.sessionId })
    if (ran.deny !== undefined || ran.isError) {
      await setView($, () => ({ openNote: `Archivage refusé : ${ran.deny ?? ran.text ?? 'sans motif'}` }))
      return false
    }
    // La session est archivée : le panneau cesse d'y pointer tout de suite, puis oublie son suivi ; la
    // bande de Maestro la compte archivée avant la relecture des sessions (#174).
    archivedSessionIds.add(entry.sessionId)
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
    return true
  } catch (err) {
    await setView($, () => ({ openNote: `Archivage impossible : ${err instanceof Error ? err.message : String(err)}` }))
    return false
  }
}

/** L'icône d'archivage d'une ligne de la bande de Maestro (#174) : la session de sa tâche, par son suivi s'il y en a un. */
async function archiveBandSession($: EngineInterface, t: BrandTask, now: number): Promise<void> {
  if (!t.sessionId) return
  const live = await loadLive($).catch(() => ({}) as Record<string, LiveEntry>)
  const key = Object.keys(live).find(k => live[k]?.sessionId === t.sessionId)
  await archiveSession($, key ?? `session:${t.sessionId}`, (key ? live[key] : undefined) ?? { sessionId: t.sessionId, startedAt: now, title: t.label })
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
    // cowork.py ne ferme pas le parent d'un dernier enfant (#125) : la note le dit.
    const alone = abandon ? undefined : parentLeftAlone(await readOr($, files(source).open) ?? '', task)
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
    if (task.tous !== undefined && !abandon) return { id, note: 'récurrence non reconduite par cowork.py' }
    return alone ? { id, note: `parent #${alone} à cocher : cowork.py ne le ferme pas` } : { id }
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
  // Le dernier enfant fait ferme (ou reconduit) son parent dans la même écriture (#125), contrôlé avec les clés du projet (#155).
  const out = closeWithParentInTexts(await $.fs.read(open), doneText, task, moment, kind, reason, projectSettings(source).cles)
  if ('error' in out) return out
  const closedParent = out.parent !== undefined && out.parent.next === undefined ? out.parent.id : undefined
  const parentNote = out.parent === undefined ? undefined : out.parent.next !== undefined ? `parent #${out.parent.id} reconduit au ${frDate(out.parent.next)}` : `parent #${out.parent.id} fait aussi`
  // Les faites d'abord : une ligne perdue entre les deux écritures ne se retrouve pas.
  await $.fs.write(done, out.done)
  await $.fs.write(open, out.open)
  if (written.length > 2) {
    const log = `${source.dir}/${config.log}`
    const withChild = appendBilanCsv(await readOr($, log), bilanCsvRow(day, out.id, bilan))
    await $.fs.write(log, closedParent ? appendBilanCsv(withChild, bilanCsvRow(day, closedParent, doneBilan())) : withChild)
  }
  const done1 = (id: string, note?: string) => ({ id, ...(note ? { note } : {}) })
  if (!inGit) return done1(out.id, parentNote)
  if (written.length > 2) await git('add', '--', config.log)
  const commit = await git('commit', '-q', '-m', `roadmap: ${abandon ? 'abandon' : 'done'} #${out.id}${out.parent ? `, #${out.parent.id}` : ''}`, '--', ...written)
  if (commit.exitCode !== 0) return { id: out.id, note: `${closed}, mais pas committée : ${lastLine(commit.stderr || commit.stdout)}` }
  if (!upstream) return done1(out.id, parentNote)
  if ((await git('push', '-q')).exitCode === 0) return done1(out.id, parentNote)
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
    // Un projet qui écrit sa roadmap par son propre outil (`ecriture`, #164) : le panneau n'écrit pas,
    // il demande à Claude, par la boîte d'envoi (#140), pour passer par les hooks du plugin.
    const cowork = await $.fs.exists(`${source.dir}/_cowork/cowork.py`).catch(() => false)
    const route = closeRoute({ ecriture: source.ecriture, cowork, task, kind, reason: kind === 'abandon' ? cancelReason : '' })
    if (route.via === 'claude') {
      cancelReason = ''
      queueSubmit($, route.text)
      await setView($, () => ({ cancelAsk: '', cancelNote: `Demandé à Claude : ${route.text}` }))
      try {
        $.ui.toast(`Demandé à Claude : ${route.text}`)
      } catch {
        // pas de toast sur cette surface : le détail le montre
      }
      return
    }
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
 * Rouvre une tâche faite ou annulée (#163, sa case décochée dans l'arbre) : `reopenInTexts`, sa
 * mère faite comprise, et son bilan (et celui de sa mère) retiré du journal. Mêmes gardes que
 * `closeTask` : sur main, sans modification en attente, committé seul et poussé. Un dossier Cowork
 * n'a pas de réouverture dans `cowork.py` : rien ne s'écrit, la note le dit.
 */
async function reopenTask($: EngineInterface, source: Source, task: Task): Promise<{ id?: string; note?: string } | { error: string }> {
  if (await $.fs.exists(`${source.dir}/_cowork/cowork.py`).catch(() => false)) {
    return { error: `cowork.py ne sait pas rouvrir une tâche : demande-le à Claude (« rouvre #${task.id ?? ''} »). Rien n'a été écrit.` }
  }
  const day = (task.fait ?? '').slice(0, 10)
  const config = bilanConfigFor(await readOr($, `${source.dir}/cowork.json`))
  if (!isInsideRelative(config.log)) return { error: `Le journal des bilans « ${config.log} » sort du dossier de la roadmap : rien n'a été écrit.` }
  const written = ['ROADMAP.md', 'ROADMAP-fait.md', config.log]
  const git = (...args: string[]) => $.process.run(['git', '-C', source.dir, ...args], { timeoutMs: 60_000 })
  // Les gardes de `closeTask` : sur main, rien en attente, à jour de l'amont.
  const head = await git('rev-parse', '--abbrev-ref', 'HEAD')
  const inGit = head.exitCode === 0
  let upstream = false
  if (inGit) {
    const branch = head.stdout.trim()
    if (branch !== 'main' && branch !== 'master') return { error: `${source.name} est sur « ${branch} », pas sur main : sa roadmap ne s'écrit que sur main. Rien n'a été écrit.` }
    const status = await git('status', '--porcelain', '--', ...written)
    if (status.stdout.trim() !== '') return { error: `La roadmap a des modifications non committées (${lastLine(status.stdout)}) : une session l'écrit peut-être. Rien n'a été écrit.` }
    upstream = (await git('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}')).exitCode === 0
    if (upstream) {
      const pull = await git('pull', '--ff-only', '-q')
      if (pull.exitCode !== 0) return { error: `git pull a échoué, rien n'a été écrit : ${lastLine(pull.stderr || pull.stdout)}` }
    }
  }
  const { open, done } = files(source)
  const doneText = await readOr($, done)
  if (doneText === undefined) return { error: "ROADMAP-fait.md est introuvable : rien n'a été écrit." }
  const out = reopenInTexts(await $.fs.read(open), doneText, task, projectSettings(source).cles)
  if ('error' in out) return out
  // L'ouverte d'abord : une ligne perdue entre les deux écritures ne se retrouverait pas.
  await $.fs.write(open, out.open)
  await $.fs.write(done, out.done)
  const log = `${source.dir}/${config.log}`
  const before = await readOr($, log)
  if (before !== undefined && day !== '') {
    const after = [out.id, ...(out.parent ? [out.parent] : [])].reduce((text, id) => dropBilanCsv(text, id, day), before)
    if (after !== before) await $.fs.write(log, after)
  }
  const note = out.parent ? `sa mère #${out.parent} rouverte aussi` : undefined
  const result = { id: out.id, ...(note ? { note } : {}) }
  if (!inGit) return result
  await git('add', '--', config.log)
  const commit = await git('commit', '-q', '-m', `roadmap: reopen #${out.id}${out.parent ? `, #${out.parent}` : ''}`, '--', ...written)
  if (commit.exitCode !== 0) return { id: out.id, note: `rouverte, mais pas committée : ${lastLine(commit.stderr || commit.stdout)}` }
  if (!upstream || (await git('push', '-q')).exitCode === 0) return result
  const rebase = await git('pull', '--rebase', '-q')
  const push = rebase.exitCode === 0 ? await git('push', '-q') : rebase
  return push.exitCode === 0 ? result : { id: out.id, note: `rouverte et committée, mais pas poussée : ${lastLine(push.stderr || push.stdout)}` }
}

let checking = false

/**
 * Un projet qui écrit sa roadmap par son propre outil (`ecriture`, #164) : la case ne l'écrit pas,
 * elle le demande à Claude par la boîte d'envoi, comme « Marquer faite ». Rend `true` si c'est fait.
 */
async function checkByClaude($: EngineInterface, source: Source, task: Task, action: 'done' | 'reopen' | 'family', open = 0): Promise<boolean> {
  const cowork = await $.fs.exists(`${source.dir}/_cowork/cowork.py`).catch(() => false)
  const route = checkRoute({ ecriture: source.ecriture, cowork, task, action, open })
  if (route.via !== 'claude') return false
  queueSubmit($, route.text)
  try {
    $.ui.toast(`Demandé à Claude : ${route.text}`)
  } catch {
    // pas de toast sur cette surface
  }
  return true
}

/** Ce qu'a donné une case de l'arbre, en toast ; l'arbre se relit. */
async function afterCheck($: EngineInterface, out: { id?: string; note?: string } | { error: string }, said: string): Promise<void> {
  const text = 'error' in out ? out.error : `${out.id ? `#${out.id} ` : ''}${said}${out.note ? ` : ${out.note}` : ''}`
  await update($, retryAtom, v => v + 1)
  try {
    $.ui.toast(text)
  } catch {
    // pas de toast sur cette surface
  }
}

/** L'armement de la vue (#179), lu pour `checkArm`. */
const armedOf = (v: View): Armed | undefined => (v.armed ? { key: v.armed, at: v.armedAt ?? 0 } : undefined)
const DISARMED = { armed: '', armedAt: 0 } as const

/**
 * La ligne armée, gardée aussi en mémoire (#179) : un clic ailleurs ne lit la vue que si une ligne
 * l'est ; sans elle, chaque bouton du panneau payait une lecture d'état avant son geste.
 */
let armedNow = ''

/** Un clic ailleurs (#179) : la ligne armée se désarme ; sans ligne armée, aucune écriture. */
async function disarm($: EngineInterface): Promise<void> {
  if (armedNow === '') return
  armedNow = ''
  await setView($, v => (v.armed ? DISARMED : {}))
}

/**
 * Le rond d'une ligne (#179, maquette A) : un premier clic arme sa ligne et pose son encart, un
 * second sur le même rond la désarme ; rien ne s'écrit. Passé `ARM_MS`, une minuterie retire
 * l'encart (et `checkArm` refuse de toute façon un bouton trop tardif).
 */
async function armCheck($: EngineInterface, task: Task): Promise<void> {
  const now = await $.clock.now()
  const out = checkArm(armedOf(await read($, viewAtom)), { kind: 'round', key: taskKey(task) }, now)
  await setView($, () => (out.armed ? { armed: out.armed.key, armedAt: out.armed.at } : DISARMED))
  armedNow = out.armed?.key ?? ''
  const armed = out.armed
  if (armed === undefined || typeof setTimeout !== 'function') return
  setTimeout(() => {
    if (armedNow === armed.key) armedNow = ''
    void setView($, v => (v.armed === armed.key && v.armedAt === armed.at ? DISARMED : {})).catch(() => {
      // le panneau a pu se fermer : rien à retirer
    })
  }, ARM_MS)
}

/**
 * Le bouton de l'encart (#179) : la ligne encore armée s'exécute, comme la case de #163 : une faite
 * se rouvre, une ouverte se clôt (comme « Marquer faite »), une mère à étapes ouvertes passe par
 * « Tout clore » ; avec `ecriture` (#164), la demande part à Claude. Une écriture à la fois.
 */
async function checkTask($: EngineInterface, source: Source, task: Task, openKids: number): Promise<void> {
  const out0 = checkArm(armedOf(await read($, viewAtom)), { kind: 'confirm', key: taskKey(task) }, await $.clock.now())
  armedNow = ''
  await setView($, () => DISARMED)
  if (out0.run === undefined) {
    try {
      $.ui.toast('Délai passé : reclique sur le rond.')
    } catch {
      // pas de toast sur cette surface
    }
    return
  }
  if (!task.done && openKids > 0) return closeFamily($, source, task)
  if (checking) return
  checking = true
  try {
    if (await checkByClaude($, source, task, task.done ? 'reopen' : 'done')) return
    const out = task.done
      ? await reopenTask($, source, task).catch((err: unknown) => ({ error: `Réouverture impossible : ${err instanceof Error ? err.message : String(err)}` }))
      : await closeTask($, source, task, 'done', '').catch((err: unknown) => ({ error: `Clôture impossible : ${err instanceof Error ? err.message : String(err)}` }))
    await afterCheck($, out, task.done ? 'rouverte' : 'faite')
  } finally {
    checking = false
  }
}

/**
 * « Tout clore » (#163, règle choisie par Bertrand) : les filles ouvertes d'abord, une par une par
 * `closeTask` (qui ferme la mère avec la dernière), puis la mère si elle reste ouverte (un dossier
 * Cowork ne la ferme pas). Chaque tâche est relue avant sa clôture : les lignes bougent.
 */
async function closeFamily($: EngineInterface, source: Source, mother: Task): Promise<void> {
  if (checking) return
  checking = true
  try {
    const listed = await load($, files(source).open, 'ROADMAP.md')
    const open = typeof listed === 'string' ? 0 : listed.filter(t => !t.done && t.parent === mother.id && t.id !== mother.id).length
    if (await checkByClaude($, source, mother, 'family', open)) return
    const fresh = async (id: string | undefined) => {
      const tasks = await load($, files(source).open, 'ROADMAP.md')
      return typeof tasks === 'string' ? undefined : withParentDates(tasks).find(t => !t.done && t.id === id)
    }
    const all = await load($, files(source).open, 'ROADMAP.md')
    const kids = typeof all === 'string' ? [] : all.filter(t => !t.done && t.parent === mother.id && t.id !== undefined && t.id !== mother.id).map(t => t.id)
    let out: { id?: string; note?: string } | { error: string } = { id: mother.id }
    for (const id of kids) {
      const kid = await fresh(id)
      if (kid === undefined) continue
      out = await closeTask($, source, kid, 'done', '').catch((err: unknown) => ({ error: `Clôture impossible : ${err instanceof Error ? err.message : String(err)}` }))
      if ('error' in out) return void (await afterCheck($, out, ''))
    }
    const head = await fresh(mother.id)
    if (head !== undefined) out = await closeTask($, source, head, 'done', '').catch((err: unknown) => ({ error: `Clôture impossible : ${err instanceof Error ? err.message : String(err)}` }))
    if ('error' in out) return void (await afterCheck($, out, ''))
    await afterCheck($, { id: mother.id }, `faite, avec ses ${kids.length} étape${kids.length > 1 ? 's' : ''} ouverte${kids.length > 1 ? 's' : ''}`)
  } finally {
    checking = false
  }
}

/** Les valeurs tapées dans la fiche en édition (#161), par `<taskKey>|<champ>` : un redessin ne les perd pas. */
const editDrafts = new Map<string, string>()
const SAVE_BUSY = '…'
let saving = false

/** Les brouillons d'une tâche, par champ. */
function draftsOf(key: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of editDrafts) if (k.startsWith(`${key}|`)) out[k.slice(key.length + 1)] = v
  return out
}

function clearDrafts(key: string): void {
  for (const k of [...editDrafts.keys()]) if (k.startsWith(`${key}|`)) editDrafts.delete(k)
}

/**
 * Réécrit la ligne d'une tâche ouverte depuis sa fiche (#161), par le chemin de « Marquer faite »
 * (`closeTask`) : `cowork.py roadmap update` dans un dossier Cowork ; sinon le panneau écrit
 * ROADMAP.md, dans git seulement sur main, sans modification en attente, puis commit et push. La
 * ligne se contrôle d'abord (`editInTexts`, règles du projet) : refusée, rien ne s'écrit. Un projet
 * qui déclare `ecriture` (#164) : la ligne contrôlée, la demande part à Claude (`asked`), rien ne s'écrit ici.
 */
async function saveEdit(
  $: EngineInterface,
  source: Source,
  task: Task,
  edit: TaskEdit,
): Promise<{ id?: string; warnings: string[]; note?: string; asked?: string } | { error: string; field?: EditField }> {
  const settings = projectSettings(source)
  const rules = { requis: settings.requis, requiredOn: settings.requiredOn, cles: settings.cles }
  const { open } = files(source)
  const cowork = await $.fs.exists(`${source.dir}/_cowork/cowork.py`).catch(() => false)
  const route = editRoute({ ecriture: source.ecriture, cowork, task, edit })
  if (route.via === 'claude') {
    // `ecriture` (#164) : la ligne se contrôle ici, puis Claude l'écrit par l'outil du projet ; refusée, rien ne part.
    const out = editInTexts(await $.fs.read(open), task, edit, rules)
    if ('error' in out) return out
    if (!out.changed) return { ...(task.id ? { id: task.id } : {}), warnings: [] }
    queueSubmit($, route.text)
    return { ...(task.id ? { id: task.id } : {}), warnings: out.warnings, asked: route.text }
  }
  if (route.via === 'cowork') {
    const out = editInTexts(await $.fs.read(open), task, edit, rules)
    if ('error' in out) return out
    if (!out.changed) return { ...(task.id ? { id: task.id } : {}), warnings: [] }
    const run = await runPython(
      $,
      [`${source.dir}/_cowork/cowork.py`, 'roadmap', 'update', source.dir, '--match-b64', utf8Base64(task.label), '--line-b64', utf8Base64(out.line)],
      source.dir,
    )
    if (run.exitCode !== 0) return { error: `cowork.py a refusé, rien n'a été écrit : ${lastLine(run.stderr || run.stdout)}` }
    return { ...(task.id ? { id: task.id } : {}), warnings: out.warnings }
  }
  const git = (...args: string[]) => $.process.run(['git', '-C', source.dir, ...args], { timeoutMs: 60_000 })
  const head = await git('rev-parse', '--abbrev-ref', 'HEAD')
  const inGit = head.exitCode === 0
  let upstream = false
  if (inGit) {
    const branch = head.stdout.trim()
    if (branch !== 'main' && branch !== 'master') {
      return { error: `${source.name} est sur « ${branch} », pas sur main : sa roadmap ne s'écrit que sur main. Rien n'a été écrit.` }
    }
    const status = await git('status', '--porcelain', '--', 'ROADMAP.md')
    if (status.stdout.trim() !== '') {
      return { error: `La roadmap a des modifications non committées (${lastLine(status.stdout)}) : une session l'écrit peut-être. Rien n'a été écrit.` }
    }
    upstream = (await git('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}')).exitCode === 0
    if (upstream) {
      const pull = await git('pull', '--ff-only', '-q')
      if (pull.exitCode !== 0) return { error: `git pull a échoué, rien n'a été écrit : ${lastLine(pull.stderr || pull.stdout)}` }
    }
  }
  const out = editInTexts(await $.fs.read(open), task, edit, rules)
  if ('error' in out) return out
  const done = { ...(task.id ? { id: task.id } : {}), warnings: out.warnings }
  if (!out.changed) return done
  await $.fs.write(open, out.open)
  if (!inGit) return done
  const commit = await git('commit', '-q', '-m', `roadmap: edit ${task.id ? `#${task.id}` : clip(task.label, 40)}`, '--', 'ROADMAP.md')
  if (commit.exitCode !== 0) return { ...done, note: `Enregistrée, mais pas committée : ${lastLine(commit.stderr || commit.stdout)}` }
  if (!upstream || (await git('push', '-q')).exitCode === 0) return done
  // Un autre clone a avancé : on se remet dessus, puis un seul nouvel essai.
  const rebase = await git('pull', '--rebase', '-q')
  const push = rebase.exitCode === 0 ? await git('push', '-q') : rebase
  return push.exitCode === 0 ? done : { ...done, note: `Enregistrée et committée, mais pas poussée : ${lastLine(push.stderr || push.stdout)}` }
}

/** Le clic sur « Enregistrer » (#161) : une écriture à la fois ; rien de changé, la fiche se referme. */
async function confirmEdit($: EngineInterface, source: Source, task: Task, specs: readonly EditSpec[]): Promise<void> {
  if (saving) return
  saving = true
  const key = taskKey(task)
  try {
    const { edit, count } = editDiff(specs, draftsOf(key))
    if (count === 0) {
      clearDrafts(key)
      await setView($, () => ({ editing: '', editNote: '', editField: '' }))
      return
    }
    await setView($, () => ({ editNote: SAVE_BUSY, editField: '' }))
    const out = await saveEdit($, source, task, edit).catch((err: unknown) => ({
      error: `Enregistrement impossible : ${err instanceof Error ? err.message : String(err)}`,
    }))
    if ('error' in out) {
      await setView($, () => ({ editNote: out.error, editField: 'field' in out && out.field ? out.field : '' }))
      return
    }
    clearDrafts(key)
    const note = [...(out.asked ? [`Demandé à Claude : ${out.asked}`] : []), ...out.warnings, ...(out.note ? [out.note] : [])].join(' ; ')
    await setView($, () => ({ editing: '', editNote: note, editField: '', ...(out.id ? { selected: `id:${out.id}` } : {}) }))
    await update($, retryAtom, v => v + 1)
    try {
      $.ui.toast(out.asked ? `Demandé à Claude : ${out.asked}` : `${out.id ? `#${out.id} ` : 'Tâche '}enregistrée${out.note ? ` : ${out.note}` : ''}`)
    } catch {
      // pas de toast sur cette surface : la fiche le montre
    }
  } finally {
    saving = false
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
/** Un clic sur un axe garde le compteur ou l'état choisi, pour les combiner (#99, partout depuis #176) ; posé à chaque dessin. */
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
/**
 * Les déplacements de la fenêtre et du focus gardés en plus, à part (#111) : chaque cran redemande un
 * dessin, et les 40 relevés ne tenaient qu'une vingtaine de crans, le saut chassé par les dessins.
 */
const MOVE_ROWS = 80
/** Les relevés gardés au store, toutes sessions confondues. */
const PERF_KEPT = 200
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
  /** Où l'app tenait la fenêtre quand elle a demandé ce dessin (#111) : le premier rang montré. */
  offset?: number
  bodyRows?: number
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
/**
 * Un déplacement de la fenêtre du panneau (#106 : il remontait seul en haut pendant qu'on faisait
 * défiler, sans que rien du panneau ne le déplace) : où le moteur la pose, de combien elle bouge, sur
 * quelle hauteur, et qui le demande. Un saut se voit à `offset` loin de la position d'avant plus `by`.
 */
type ScrollRow = PerfBase & {
  kind: 'scroll'
  offset: number
  by: number
  bodyRows: number
  contentRows: number
  /** `person` : la molette ou les touches ; `plugin` : un `$.ui.scroll`. */
  origin: string
  /** Le refus du moteur (#111) : l'app remet alors la fenêtre à sa position d'avant. */
  deny?: string
  /** Du crochet à la réponse du moteur (#111). */
  answerMs?: number
}
/**
 * Un mouvement du focus dans le panneau (#111) : l'app de bureau refocalise, sans `preventScroll`,
 * l'élément que le moteur dit tenu quand ce n'est pas celui qu'elle a, et le navigateur fait défiler
 * jusqu'à lui. L'élément qui prend le focus, qui le déplace, et le refus du moteur s'il y en a un.
 */
type FocusRow = PerfBase & {
  kind: 'focus'
  element?: string
  origin: string
  deny?: string
}
type PerfRow = DrawRow | OpenRow | RefreshRow | LaunchRow | ScrollRow | FocusRow
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

/** Le relevé d'un déplacement de la fenêtre, parti au store comme celui d'un dessin. */
function noteScroll(
  e: { offset: number; by: number; bodyRows: number; contentRows: number; origin: { kind: string } },
  result: { deny?: string },
  answerMs: number,
): void {
  pushPerf({
    mod: PERF_MOD,
    at: tick(),
    kind: 'scroll',
    offset: e.offset,
    by: e.by,
    bodyRows: e.bodyRows,
    contentRows: e.contentRows,
    origin: e.origin.kind,
    ...(result.deny !== undefined ? { deny: result.deny } : {}),
    answerMs,
  })
  perfFlush?.()
}

/** Le relevé d'un mouvement du focus, avec la réponse du moteur. */
function noteFocus(e: { element?: string; origin: { kind: string } }, result: { deny?: string }): void {
  pushPerf({
    mod: PERF_MOD,
    at: tick(),
    kind: 'focus',
    ...(e.element !== undefined ? { element: e.element } : {}),
    origin: e.origin.kind,
    ...(result.deny !== undefined ? { deny: result.deny } : {}),
  })
  perfFlush?.()
}

const isMove = (r: PerfRow) => r.kind === 'scroll' || r.kind === 'focus'

/** Garde les `max` derniers relevés que `keep` retient, sans toucher aux autres. */
function trimPerf(keep: (r: PerfRow) => boolean, max: number): void {
  const kept = perfRows.filter(keep)
  for (const r of kept.slice(0, Math.max(0, kept.length - max))) perfRows.splice(perfRows.indexOf(r), 1)
}

function pushPerf(row: PerfRow): void {
  perfRows.push(row)
  trimPerf(r => !isMove(r), PERF_ROWS)
  trimPerf(isMove, MOVE_ROWS)
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

function notePerf(t0: number, tree: unknown, scroll?: { offset: number; bodyRows: number }): void {
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
    ...(scroll ? { offset: scroll.offset, bodyRows: scroll.bodyRows } : {}),
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

/**
 * Les réglages de session du projet de la session (#102), son nom pour le bloc du démarrage, et le
 * design system que déclare son `.claude/roadmap.json` (#129), que cite la règle des maquettes.
 */
async function readSessionPrefs($: EngineInterface): Promise<{ prefs: SessionPrefs; error?: string; project?: string; design?: Design }> {
  await readPerso($)
  const file = await prefsFile($)
  const text = file && (await $.fs.exists(file.path)) ? await $.fs.read(file.path) : undefined
  const project = await sessionProject($)
  const design = (await currentSource($))?.design
  const read = { ...sessionPrefs(text, project.key, project.home), ...(design ? { design } : {}) }
  return project.name === undefined ? read : { ...read, project: project.name }
}

/** Le bloc des réglages de session complets ; une panne de lecture ne bloque jamais le démarrage ni le message. */
async function sessionPrefsBlock($: EngineInterface): Promise<string | undefined> {
  try {
    const { prefs, error, project, design } = await readSessionPrefs($)
    return sessionPrefsText(prefs, error, project, design)
  } catch {
    return undefined
  }
}

// Le moteur ne dessine une ouverture « non demandée » (démarrage, minuteur) qu'à partir de 144 colonnes,
// 110 pour un volet déjà ouvert à la main ; en dessous, le volet attend sans rien dire. La raison part au
// journal de débogage : chez Caro (#117), c'est elle qui dit pourquoi le panneau ne paraissait pas.
async function openPane($: EngineInterface, source: Source) {
  // Un panneau qui s'ouvre (pas déjà dessiné) reprend son filtre d'ouverture (#149) ; ouvert, il garde le
  // filtre choisi. Liste des volets illisible (le kit de test ne la donne pas) : rien ne change.
  try {
    if (!(await $.ui.panes()).some(p => p.id === PANE && p.isPlaced)) await setView($, () => ({ attend: 'auto' }))
  } catch {
    // liste des volets illisible
  }
  const opened = await $.ui.open({ id: PANE, title: `Roadmap ${source.name}`, columns: COLUMNS })
  if (!opened.isPlaced) $.ui.log(`roadmap : panneau ouvert sans être dessiné (${opened.reason})`, { to: 'debug' })
  return opened
}

/**
 * Le panneau toujours ouvert (#117) : absent ou pas dessiné, il se rouvre. Appelé depuis le message de la
 * personne, l'ouverture est « demandée » et le moteur la dessine à toute largeur. La roadmap vient de celle
 * que le démarrage a lue : pas de lecture de fichier par message.
 */
async function ensurePane($: EngineInterface): Promise<void> {
  if (!settings.autoOpen) return
  try {
    const source = knownSource === undefined ? await sourceNow($) : knownSource ?? undefined
    if (!source) return
    if ((await $.ui.panes()).some(p => p.id === PANE && p.isPlaced)) return
    void openPane($, source)
  } catch {
    // liste des volets ou roadmap illisible : le message passe, le panneau attend le suivant
  }
}

/** Une skill a rendu son texte (skill.prompt) pendant l'appel de l'outil Skill en cours : sec-default ne l'a pas sautée (#116). */
let skillPrompted = false

/** Une skill lancée, par quelque chemin que ce soit : une skill de méthode ou `swiftui-pro` compte pour le rappel. */
function noteSkill(name: string): void {
  if (capture && isMethodSkill(name)) capture.methodUsed = true
  if (capture && isSwiftUISkill(name)) capture.swiftUIUsed = true
}

/**
 * La skill des réglages ou du panneau lancée : son volet s'ouvre, et la note que Claude lit en tête de
 * la skill ; une autre skill, ou un projet sans roadmap pour le panneau : rien.
 */
async function skillPaneNote($: EngineInterface, name: string): Promise<string | undefined> {
  if (SETTINGS_SKILL.test(name)) {
    await openSettings($)
    return settingsSkillNote()
  }
  if (!PANEL_SKILL.test(name)) return undefined
  const source = await sourceNow($)
  if (!source) return undefined
  await refresh($)
  await openPane($, source)
  return panelSkillNote(source.name)
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
    axisPill: typeof options.axisPill === 'boolean' ? options.axisPill : false,
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
    // La version de ce module, avant qu'une synchro de l'app ne réécrive son plugin.json (#138).
    void loadSessionVersion($).catch(() => undefined)
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
    let paneOpen = false
    try {
      const panes = await $.ui.panes()
      settingsOpen = panes.some(p => p.id === SETTINGS_PANE)
      paneOpen = panes.some(p => p.id === PANE)
      if (settingsOpen) {
        await redrawSettings($)
        await watchSettings($)
      }
    } catch {
      // liste des volets indisponible : le volet se redessinera au prochain clic
    }
    const source = await sourceNow($)
    if (source) {
      // Le panneau toujours ouvert (#117) s'ouvre s'il manque, rechargement compris (une option allumée
      // dans le volet Réglages doit se voir) ; déjà là, il reste tel quel, le volet Réglages devant.
      if (settings.autoOpen && !paneOpen) void openPane($, source)
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
  // Sous sec-default (compte Team ou Enterprise, #116), ce hook est sauté : le premier message les porte.
  on('classic.SessionStart', async ($, e, next) => {
    const result = await next(e)
    const text = await sessionPrefsBlock($)
    try {
      await update($, prefsGivenAtom, () => text ?? '')
    } catch {
      // état de session illisible : le premier message les redonnera aussi
    }
    return text === undefined ? result : { ...result, additionalContext: [...(result.additionalContext ?? []), text] }
  })

  // Un /clear ou une compaction efface les réglages donnés : le démarrage classique qui suit les redonne,
  // sinon le message suivant. Sous sec-default, la compaction est sautée aussi (#116).
  // Le contexte mesuré repart de zéro avec elles : la chute qui suit n'est pas une compaction cachée (#119).
  on('session.end', async ($, e, next) => {
    if (e.reason === 'clear') {
      await update($, prefsGivenAtom, () => '')
      await update($, contextSeenAtom, () => 0)
    }
    return next(e)
  })
  on('session.compact', async ($, e, next) => {
    // `precompute` n'installe rien, et la compaction d'un agent laisse la conversation principale.
    if (e.trigger !== 'precompute' && e.agentId === undefined) {
      await update($, prefsGivenAtom, () => '')
      await update($, contextSeenAtom, () => 0)
    }
    return next(e)
  })

  // Le contexte à la fin de chaque tour (#157) : l'en-tête de la bande de Maestro le lit, et une
  // session lancée par Maestro l'écrit dans sa note, à côté de ses étapes, sans en changer l'heure.
  on('session.measure', async ($, e, next) => {
    const result = await next(e)
    const use = contextUseOf(e.context)
    try {
      await update($, bandContextAtom, () => use ?? null)
    } catch {
      // état illisible : la bande relit le contexte à son dessin
    }
    if (use) {
      void noteChild(
        $,
        prev => (prev.at === 0 || (prev.context?.tokens === use.tokens && prev.context.window === use.window) ? prev : { ...prev, context: use }),
        { keepAt: true },
      )
    }
    return result
  })

  // Le rappel du mode ADHD, à chaque message : la consigne du démarrage s'efface au fil de la session.
  // « Maestro » en tête du message : le panneau s'ouvre et Claude reçoit l'état d'avancement.
  // Par prompt.submit, que sec-default laisse aux plugins installés (#116), le contexte joint à la descente.
  on('prompt.submit', async ($, e, next) => {
    // Le panneau toujours ouvert (#117) : le message de la personne rouvre le panneau qui manque ou attend.
    // Un seul hook prompt.submit par module (le moteur refuse le second) : l'appel vit ici.
    await ensurePane($)
    const texts: string[] = []
    // Le lancement du panneau, envoyé par ce plugin : une ligne à montrer, le brief en contexte (#140).
    const launch = ownLaunch(e.text, e.origin as typeof e.origin | undefined)
    if (launch) {
      texts.push(launch.context)
      launchPending = true
    }
    // Le rappel de fin de tour laissé par le tour précédent sous sec-default (#140).
    if (pendingReminder !== undefined) {
      texts.push(deferredReminder(pendingReminder))
      pendingReminder = undefined
      reminderCarried = true
    }
    // Une compaction que sec-default cache à session.compact (#119) : le contexte a fondu depuis le
    // message précédent, et les réglages complets sont à redonner.
    try {
      const tokens = (await $.session.usage()).context.tokens
      if (contextShrank(await read($, contextSeenAtom), tokens)) await update($, prefsGivenAtom, () => '')
      await update($, contextSeenAtom, () => tokens ?? 0)
    } catch {
      // contexte non mesuré : les réglages suivent la seule règle du démarrage
    }
    // Les réglages complets : quand aucun démarrage ne les a donnés à cette conversation, ou quand ils
    // ont changé depuis le dernier bloc donné (#119 : le volet, la skill, une autre session du projet) ;
    // le nouveau bloc remplace alors l'ancien. Puis le rappel du mode ADHD.
    try {
      const current = await readSessionPrefs($)
      const block = sessionPrefsText(current.prefs, current.error, current.project, current.design)
      const given = await read($, prefsGivenAtom)
      if (block !== given) {
        texts.push(given === '' ? block : `${prefsChangedLead()}\n\n${block}`)
        await update($, prefsGivenAtom, () => block)
      }
      // Chez Maestro (#133) : au réveil, le rappel du réveil ; aux tours de la personne, l'en-tête stable.
      const maestro = await maestroHere($)
      const reminder = maestro && wakeTurn(e.text)
        ? maestroWakeReminder(await read($, pendingAsksAtom))
        : maestro ? maestroPrefsReminder(current.prefs) : sessionPrefsReminder(current.prefs)
      if (reminder !== undefined) texts.push(reminder)
    } catch {
      // réglages ou état de session illisibles : le message passe sans eux
    }
    // Un Maestro reçoit les propositions de ses sous-sessions que le message direct n'a pas portées.
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
    // « Maestro » seul accueille (#126, #141) ; un bouton de l'accueil lit sa part ; une demande ou « Maestro go » scannent.
    const call = maestroCall(e.text)
    if (call) {
      try {
        await markMaestro($)
      } catch {
        // fiche ou store illisible : le titre et la famille jugent seuls
      }
      try {
        texts.push(call.action ? await maestroActionText($, call.action) : call.scan ? await maestroText($, call.go) : await maestroIntroText($))
      } catch (err) {
        texts.push(`${Person()} a dit « Maestro », mais l'état de la roadmap n'a pas pu être lu (${err instanceof Error ? err.message : String(err)}) : dis-le en une phrase.`)
      }
    }
    const text = launch ? launch.line : e.text
    return next(texts.length === 0 ? e : { ...e, text, context: [...(e.context ?? []), ...texts] })
  })

  // Capture des tasks : la grammaire contrôlée à chaque écriture, le rappel en fin de tour.
  on('tool.call', { tool: 'Edit' }, ($, e, next) => written($, () => next(e), e.file_path))
  on('tool.call', { tool: 'Write' }, ($, e, next) => written($, () => next(e), e.file_path))
  on('tool.call', { tool: 'NotebookEdit' }, ($, e, next) => written($, () => next(e), e.notebook_path))
  // La carte New task d'une sous-session remonte à son Maestro (#67).
  // Option « Lancer en bypass » : la carte qui reste ici demande le bypass (#87).
  on('tool.call', { tool: START_SESSION_TOOL }, async ($, e, next) => {
    const ran = await forwardProposal($, e, next.origin.plugin, () =>
      next.origin.plugin === 'engine' ? launchWithMode(e, card => next(card as typeof e)) : next(e),
    )
    // Une carte posée (ou remontée à Maestro) : l'idée du tour a sa suite (#83).
    if (capture && !ran.isError) capture.cardThisTurn = true
    // Sa carte est la question de lancement : la boîte de fin du tour ne la redemande pas (#122).
    const title = (e as { title?: unknown }).title
    const id = !ran.isError && !fromAgent(e) && typeof title === 'string' ? sessionTitleId(title) : undefined
    if (id !== undefined) launchTurn.cards.push(`#${id}`)
    return ran
  })
  // Un enfant note son état pour son parent (#84) : sa liste d'étapes, sa question, son récap.
  on('tool.call', { tool: UPDATE_PLAN_TOOL }, async ($, e, next) => {
    if (!fromAgent(e)) {
      closingTurn.work = true
      stepList.planned = true
      // La liste renvoyée entière : la livraison est dite (#136).
      if (Array.isArray((e as { items?: unknown }).items)) delivered = { kinds: [], maestro: false }
      ownSteps = applyPlan(ownSteps, e as never)
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
    // La question attend dans un transcript que Bertrand ne regarde pas : Maestro l'apprend tout de suite (#131).
    await tellMaestro($, childWake({ question: text }))
    try {
      return await next(e)
    } finally {
      await noteChild($, withoutQuestion)
    }
  })
  on('tool.call', { tool: WRAP_UP_TOOL }, async ($, e, next) => {
    const ask = (e as { ask?: unknown }).ask
    const refusal = fromAgent(e) ? undefined : ((await archivedAsk($, ask)) ?? (await openLineAsk($, ask)) ?? (await launchAsk($, e as never)) ?? (await pendingAsk($, ask)))
    if (refusal !== undefined) return { deny: refusal }
    // Chez Maestro, la boîte sans question cocherait sa liste ouverte : refusée à chaque fois (#133).
    if (!fromAgent(e) && closingTurn.maestro && openListBox(ownSteps, ask)) return { deny: openListRefusal() }
    if (!fromAgent(e)) ownSteps = boxSteps(ownSteps)
    noteBox(e)
    if (!fromAgent(e)) closingTurn = { ...closingTurn, work: true, box: boxText(e) }
    // La question de Maestro attend la personne : un réveil ne la reposera pas (#133).
    if (!fromAgent(e) && closingTurn.maestro && typeof ask === 'string' && ask.trim() !== '') {
      await update($, pendingAsksAtom, asks => (asks.includes(ask) ? asks : [...asks, ask])).catch(() => undefined)
    }
    const recap = (e as { recap?: unknown }).recap
    if (!fromAgent(e)) wakeBox = { ...(typeof recap === 'string' ? { recap } : {}), ...(typeof ask === 'string' ? { ask } : {}) }
    // La question de la boîte, ou « attend une réponse : … » en tête du récap, attend jusqu'au tour suivant (#121).
    const asked = boxQuestion((e as { ask?: unknown }).ask, recap)
    if (!fromAgent(e)) {
      await noteChild($, (s, now) => ({
        ...withoutQuestion(s),
        ...(typeof recap === 'string' ? { recap: clip(recap, 200) } : {}),
        ...(asked !== undefined ? { question: { text: asked, since: now, from: 'box' as const } } : {}),
      }))
    }
    const ran = await next(e)
    // Acceptée sur sa dernière étape, la boîte coche la liste de l'app sans passer par update_plan : la note
    // aussi (#145). En cours de tâche, l'app garde sa liste, la note aussi (#172). Refusée, rien ne change.
    if (!fromAgent(e) && ran.deny === undefined && ran.isError !== true) {
      await noteChild($, s => ({ ...s, steps: boxSteps(s.steps) }))
    }
    return ran
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
    if (refusal !== undefined) return { deny: refusal }
    const ran = await written($, () => next(e), undefined, writesRoadmap(e.command))
    if (fromAgent(e) || ran.deny !== undefined || ran.isError === true) return ran
    // Une fusion sur main ou une publication (#136) : la liste d'étapes se renvoie avant la commande suivante.
    try {
      const kinds = await deliveredBy($, e.command)
      if (kinds.length === 0) return ran
      const maestro = await maestroHere($)
      delivered = { kinds: [...new Set([...delivered.kinds, ...kinds])], maestro: maestro || delivered.maestro }
      return { ...ran, context: [...(ran.context ?? []), deliveryReminder(kinds, maestro, false, closingTurn.wake)] }
    } catch {
      return ran
    }
  })

  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) {
      stopTurn = { id: e.turnId, stopRan: false, fromReminder: reminderCarried }
      reminderCarried = false
    }
    if (e.agentId === undefined) {
      // Le genre du tour (#133) : un réveil de Maestro par une de ses sessions, ou un tour de la personne,
      // qui fait tomber les questions en attente.
      const maestro = await maestroHere($)
      const wake = maestro && wakeTurn(e.text)
      closingTurn = { work: false, box: '', wake, maestro }
      wakeRefused = false
      if (maestro && !wake) await update($, pendingAsksAtom, () => []).catch(() => undefined)
    }
    if (e.agentId === undefined) stepList.tools = 0
    if (e.agentId === undefined) {
      launchTurn = { cards: [], refused: false, fromPanel: launchPending }
      launchPending = false
    }
    // Un vrai message (de Maestro ou de Bertrand) relance la session : sa réponse sera une nouvelle à dire (#131).
    if (e.agentId === undefined) wakeBox = {}
    if (e.agentId === undefined) toldMaestro = undefined
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
    // La réponse est arrivée (de Bertrand ou de Maestro) : la question de sa boîte de fin tombe (#121).
    if (e.agentId === undefined) await noteChild($, s => (s.question?.from === 'box' ? withoutQuestion(s) : s))
    return next(e)
  })

  // Fin d'un tour de cette session (pas d'un agent) : sa tâche « attend ta réponse » tout de suite.
  // Sous sec-default, Stop est sauté (#116) : le rappel de fin de tour attend le message suivant, en contexte (#140).
  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (e.agentId !== undefined) return result
    await markOwnRunning($, false)
    // La fiche de fin de la session se garde pour la fiche de sa tâche (#144).
    if (!e.isAborted) await saveEndFiche($, e.answer)
    // Une session de Maestro prévient Maestro de l'état où elle s'arrête (#131) ; interrompue, la personne est là.
    if (!e.isAborted) await tellMaestro($, childWake({ ...wakeBox, answer: e.answer }))
    // Un réveil de Maestro ne laisse pas de rappel, qui ferait écrire son fil (#133).
    if (e.turnId === stopTurn.id && !stopTurn.stopRan && e.reason === 'answer' && !closingTurn.wake) {
      const block = await endOfTurnBlock($, e.answer, stopTurn.fromReminder, false)
      if (block !== undefined) pendingReminder = block
    }
    return result
  })

  // Une skill de méthode superpowers, ou swiftui-pro, lancée (outil Skill, commande, préchargement) : notée pour le rappel.
  on('skill.prompt', async ($, e, next) => {
    skillPrompted = true
    noteSkill(e.skill)
    return next(e)
  })
  // Sous sec-default, skill.prompt est sauté (#116) : l'outil Skill et la commande tapée notent la skill
  // aussi, et l'outil ouvre le volet des skills Réglages et panneau, la note dans le contexte du résultat.
  on('tool.call', { tool: 'Skill' }, async ($, e, next) => {
    noteSkill(e.skill)
    skillPrompted = false
    const result = await next(e)
    if (result.deny !== undefined || result.isError === true || skillPrompted) return result
    const note = await skillPaneNote($, e.skill)
    return note === undefined ? result : { ...result, context: [...(result.context ?? []), note] }
  })
  on('command.run', async ($, e, next) => {
    noteSkill(e.command)
    return next(e)
  })

  on('classic.Stop', async ($, e, next) => {
    stopTurn.stopRan = true
    const result = await next(e)
    const block = await endOfTurnBlock($, e.last_assistant_message, e.stop_hook_active === true, result.block !== undefined)
    return block === undefined ? result : { ...result, block }
  })

  // Une zone de clic démolie par l'app, même après son « prêt » (#152) : nouvelles clés, de nouvelles instances.
  on('ui.fault', async ($, e, next) => {
    if (zoneFault(zones, e.module, e.element, await read($, zoneGenAtom))) await update($, zoneGenAtom, v => v + 1)
    return next(e)
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
        if (pressDisarms(id)) await disarm($)
        pressHandlers.get(id)?.()
      }
      return {}
    }
    if (!e.element.startsWith(BAR_HIT)) return next(e)
    const segment = (e.data as { segment?: unknown } | null)?.segment
    if (typeof segment === 'string') notePress(`bar:${segment}`)
    await disarm($)
    if (segment === DONE_SEGMENT) pressDone($)
    else if (typeof segment === 'string' && segment !== '') pressAxis($, segment)
    return {}
  })

  // Un bouton de l'app : noté pour la mesure du délai jusqu'au dessin suivant.
  on('ui.press', async ($, e, next) => {
    if (e.plugin === 'roadmap') {
      notePress(e.element)
      // Un clic ailleurs désarme le rond armé (#179).
      if (pressDisarms(e.element)) await disarm($)
    }
    return next(e)
  })

  on('command.run', { command: 'roadmap' }, async $ => openCommand($))

  // Sa fermeture à la main est refusée tant que le réglage est allumé ; un toast dit comment la permettre.
  on('ui.close', { id: PANE }, async ($, e, next) => {
    if (!refusesPaneClose(settings.autoOpen, e.id, e.origin.kind)) return next(e)
    $.ui.toast(pinnedPaneToast())
  })

  on('command.run', { command: 'reglages' }, async $ => openSettings($))

  // La skill des réglages tapée seule ouvre le volet sans passer par le modèle ; suivie d'une demande
  // (« coupe le mode ADHD »), la skill la traite. Lancée par le modèle, le volet s'ouvre aussi.
  // Suivie d'une demande, le volet s'ouvre dès la commande : sous sec-default, skill.prompt ne l'ouvre pas (#116).
  on('command.run', { command: SETTINGS_SKILL }, async ($, e, next) => {
    if (e.args.trim() === '') return openSettings($)
    await skillPaneNote($, e.command)
    return next(e)
  })

  on('skill.prompt', { skill: SETTINGS_SKILL }, async ($, e, next) => {
    const result = await next(e)
    const note = await skillPaneNote($, e.skill)
    return note === undefined ? result : { ...result, text: `${note}\n\n${result.text}` }
  })

  // /roadmap:roadmap-panel tapée seule (Splitmybill, 2026-10-28) : Bertrand la tape pour faire paraître
  // le panneau, et le modèle déroulait la skill jusqu'à un diagnostic. Elle répond comme /roadmap, sans
  // passer par le modèle ; suivie d'une demande (« change les sujets »), la skill la traite.
  on('command.run', { command: PANEL_SKILL }, async ($, e, next) => {
    if (e.args.trim() === '') return openCommand($)
    await skillPaneNote($, e.command)
    return next(e)
  })

  // La même skill lancée par le modèle, ou tapée sous un nom que le hook ci-dessus n'a pas pris : le
  // panneau s'ouvre aussi, et le texte de la skill le dit en tête.
  on('skill.prompt', { skill: PANEL_SKILL }, async ($, e, next) => {
    const result = await next(e)
    const note = await skillPaneNote($, e.skill)
    return note === undefined ? result : { ...result, text: `${note}\n\n${result.text}` }
  })

  // L'identité Roadmap à l'ouverture (#127, maquette A) : « Maestro » ou le brief d'une tâche lancée
  // deviennent la carte Roadmap ; le modèle lit toujours le message d'origine. Déplié (ctrl+o), le texte
  // entier d'un brief suit la carte. Tout autre message, ou une lecture en panne, garde sa rangée.
  on('ui.render', { component: 'UserMessage' }, async ($, e, next) => {
    // L'app confie ses messages au plugin : la carte d'accueil peut paraître ici (#153).
    void noteWelcomeCard($, 'reachedAt')
    if (!maestroCall(e.props.text) && !briefTaskOf(e.props.text)) return next(e)
    const welcomeCall = maestroCall(e.props.text)
    try {
      const data = await brandData($)
      const opened = data?.shorten(openingBrand({ text: e.props.text, source: data.source, tasks: data.tasks, maestroTasks: data.maestroTasks }))
      if (!data || !opened) {
        if (welcomeCall && !welcomeCall.scan) void noteWelcomeCard($, 'failedAt', data ? 'pas de carte' : 'roadmap illisible')
        return next(e)
      }
      // « Maestro » seul ouvre l'accueil (#141) : le bonjour, les chiffres et les boutons.
      const brand = opened.kind === 'maestro' && !maestroCall(e.props.text)?.scan ? { ...opened, welcome: await welcomeOf($, data) } : opened
      const card = brandTree($, e, brand, data.palette, 'card', todayOf(await $.clock.now()))
      if ('welcome' in brand && brand.welcome) void noteWelcomeCard($, 'drawnAt')
      if (!e.props.isExpanded || brand.kind === 'maestro') return card
      const { Box, Text } = $.ui.resolve(e)
      return (
        <Box flexDirection="column" gap={SPACE.block}>
          {card}
          <Text size="footnote" color={data.palette.text2} wrap="wrap">{e.props.text}</Text>
        </Box>
      )
    } catch (err) {
      // Une carte d'accueil en panne : « Maestro » passera par Claude tant qu'elle n'aura pas reparu (#153).
      const reason = err instanceof Error ? err.message : String(err)
      $.ui.log(`roadmap : carte d'ouverture non dessinée (${reason})`, { to: 'debug' })
      if (welcomeCall && !welcomeCall.scan) void noteWelcomeCard($, 'failedAt', reason)
      return next(e)
    }
  })

  // L'arbre de Maestro au-dessus de la saisie (#147, style C) : toujours visible, chez Maestro avec au
  // moins une session, jamais pendant un sondage ; sinon la bande reste à l'app. La boîte de fin qui
  // pose une question prend sa place (l'app) : l'arbre revient quand elle est répondue.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    try {
      const found = await sessionBrandOf($)
      const band = maestroBand({ brand: found?.brand, hasSurvey: e.props.hasSurvey, shown: BRAND_TASKS_SHOWN })
      if (!found || !band) return next(e)
      const now = await $.clock.now()
      const statuses = await Promise.all(band.tasks.map(t => readSteps($, t.sessionId)))
      const views = statuses.map((status, i) => (status ? stepsView(status.steps, { now, at: status.at, closed: band.tasks[i]?.closed === true }) : undefined))
      // Le contexte de Maestro (#157) : la mesure du dernier tour, ou celle du moment avant la première.
      // Celui des sessions ne se montre plus (#174).
      const mine = (await read($, bandContextAtom)) ?? contextUseOf((await $.session.usage().catch(() => undefined))?.context)
      return maestroBandTree($, e, band, found.data.palette, views, {
        open: t => void (t.sessionId ? openSession($, { sessionId: t.sessionId, startedAt: now, title: t.label }) : undefined),
        archive: t => void archiveBandSession($, t, now),
      }, now, contextView(mine ?? undefined), await read($, zoneGenAtom))
    } catch {
      return next(e)
    }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    // Un lancement déposé par un bouton part d'ici, où le hook prompt.submit du plugin tourne (#140).
    sendLaunch($)
    const t0 = tick()
    perfLoaded = t0
    perfCached = false
    const tree = retireFocusKeys(await drawPane($, e), focusHeld.epochs)
    notePerf(t0, tree, e.props.scroll)
    return tree
  })

  // Le défilement du panneau, relevé : le moteur pose la fenêtre (#106). Celui de la personne fait
  // quitter l'élément qu'elle tenait (#154) : sa clé change, l'app ne remonte plus jusqu'à lui.
  on('ui.scroll', { component: 'Pane', requestId: PANE }, async ($, e, next) => {
    const t0 = tick()
    const result = await next(e)
    noteScroll(e, result, tick() - t0)
    if (e.origin.kind === 'person' && result.deny === undefined) retireHeldFocus(focusHeld, e.by)
    return result
  })

  // Le focus du panneau, relevé avec la réponse du moteur (#111), et l'élément tenu retenu (#154).
  on('ui.focus', { component: 'Pane', requestId: PANE }, async ($, e, next) => {
    const result = await next(e)
    noteFocus(e, result)
    if (result.deny === undefined) noteHeldFocus(focusHeld, e.element)
    return result
  })

  on('ui.render', { component: 'Pane', requestId: SETTINGS_PANE }, async ($, e) => drawSettings($, e, await paletteOf($)))
}

/** Le dessin du panneau : la vue d'ensemble, le détail d'une tâche, ou ce qui manque. */
// --- Identité Roadmap à l'ouverture (#127) ---------------------------------------------------
// La carte qui prend la place du message d'ouverture (maquette A) et l'en-tête du panneau (maquette B).

/**
 * La date de création de chaque session, lue une fois par session (`get_session` : `list_sessions` ne la
 * donne pas) et gardée dans le module ; illisible, `NaN`, et l'arbre de Maestro se range par numéro (#143).
 */
const createdBySession = new Map<string, number>()

async function learnCreated($: EngineInterface, ids: readonly string[]): Promise<void> {
  const missing = ids.filter(id => !createdBySession.has(id))
  await Promise.all(
    missing.map(async id => {
      createdBySession.set(id, Number.NaN)
      try {
        const ran = await $.tool.call({ tool: GET_SESSION_TOOL, session_id: id })
        const created = (JSON.parse(ran.text ?? '{}') as { createdAt?: unknown }).createdAt
        const at = typeof created === 'number' ? created : typeof created === 'string' ? Date.parse(created) : Number.NaN
        createdBySession.set(id, at)
      } catch {
        // fiche illisible : rangée par numéro, sans redemander à chaque dessin
      }
    }),
  )
}

/** Les tâches des sessions que cette session a lancées, avec leur état : ce que Maestro montre. */
async function maestroTasksOf(
  $: EngineInterface,
  source: Source,
  tasks: readonly Task[],
  live: Record<string, LiveEntry>,
  me: string | undefined,
  short: (t: Task) => string,
): Promise<BrandTask[]> {
  if (!me) return []
  // Le suivi du panneau, ou la session trouvée par son titre ; les filles « #N · … » d'abord (#137).
  const tracked = (t: Task) => live[liveKeyOf(source, t)]?.sessionId ?? sessionMatches.get(taskKey(t))?.sessionId
  const rows = [...sessionRows, ...[...startedBySession].map(([sessionId, startedBy]) => ({ sessionId, startedBy }))]
  const found = maestroTaskSessions({ tasks, me, rows, tracked })
  await learnCreated($, found.map(f => f.sessionId))
  return maestroBrandTasks(
    found.map(({ task: t, sessionId: sid }) => ({
      id: t.id as string,
      label: short(t),
      running: runningBySession.get(sid) ?? false,
      // Avant la première relecture des sessions, une session suivie compte pour ouverte.
      open: !archivedSessionIds.has(sid) && (openSessionIds.size === 0 || openSessionIds.has(sid)),
      done: t.done,
      sessionId: sid,
      createdAt: createdBySession.get(sid) ?? Number.NaN,
    })),
  )
}

/**
 * Ce que la marque lit : la roadmap et les sessions suivies, celles du panneau (même clé de cache), et
 * cette session. Lire les atomes du panneau abonne le dessin : une session qui avance le redessine.
 */
async function brandData($: EngineInterface) {
  const source = knownSource === undefined ? await sourceNow($) : (knownSource ?? undefined)
  if (!source) return undefined
  const version = await Promise.all([read($, stampAtom), read($, titlesVersionAtom), read($, themeStampAtom), read($, retryAtom), read($, liveVersionAtom)])
  const data = await paneData($, source, version.join('|'))
  if (typeof data.open === 'string') return undefined
  const tasks = [...data.open, ...data.done]
  const own = await readOwnSession($)
  const short = (t: Task) => data.titles[hashLabel(t.label)]?.titre ?? fallbackTitle(t.label)
  // Le titre court d'une tâche à la place de son libellé : la carte se lit d'un coup d'œil.
  const shorten = (brand: Brand | undefined): Brand | undefined => {
    if (brand?.kind !== 'task') return brand
    const task = tasks.find(t => t.id === brand.id)
    return task ? { ...brand, label: short(task) } : brand
  }
  return { source, tasks, palette: data.palette, own, shorten, short, maestroTasks: await maestroTasksOf($, source, tasks, data.live, own.id, short) }
}

/** La largeur de la barre de l'accueil, en px. */
const WELCOME_BAR = 160

/**
 * L'accueil de Maestro sous son bonjour (#141, maquette A) : les faites sur le total et leur barre, les
 * closes de la semaine, « Aujourd'hui » et ses pastilles, puis les boutons. Un bouton envoie son message
 * au nom de la personne, par la boîte d'envoi (`submitWelcome`).
 */
function welcomeTree(
  $: EngineInterface,
  e: RenderInput<'UserMessage'> | RenderInput<'Pane'>,
  w: Welcome,
  palette: Palette,
  pill: (label: string, bg: string, fg: string) => RenderElement,
): RenderElement {
  const { Box, Text, Button } = $.ui.resolve(e)
  const resolved = $.ui.resolve(e)
  const Svg = 'Svg' in resolved && e.surface !== 'terminal' ? resolved.Svg : undefined
  const { done, total, pct } = w.progress
  const tone: Record<WelcomePill['tone'], [string, string]> = {
    late: [palette.lateTint, palette.lateOn],
    soon: [palette.blockTint, palette.blockOn],
    wait: [palette.waitTint, palette.waitOn],
    live: [palette.liveTint, palette.liveOn],
    none: [palette.sel, palette.text2],
  }
  return (
    <Box key="welcome" flexDirection="column" gap={SPACE.tight}>
      <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexWrap="wrap">
        <Text size="footnote" color={palette.text2}>{w.counts}</Text>
        {Svg && total > 0 && (
          <Svg source={barIcon([{ hex: palette.ok, n: done }, { hex: palette.sel, n: total - done }], palette.done, WELCOME_BAR)} alt={`${pct} % fait`} width={WELCOME_BAR} height={6} />
        )}
        {total > 0 && <Text size="footnote" color={palette.text2}>{`${pct} %`}</Text>}
        {w.week && <Text size="caption" weight="semibold" color={palette.ok}>{w.week}</Text>}
      </Box>
      <Box flexDirection="row" alignItems="center" gap={SPACE.tight} flexWrap="wrap">
        <Text size="footnote" color={palette.text2}>Aujourd'hui</Text>
        {w.pills.map(p => pill(p.text, ...tone[p.tone]))}
      </Box>
      <Box flexDirection="row" alignItems="center" gap={SPACE.tight} flexWrap="wrap" paddingTop="xs">
        {w.actions.map(a => (
          <Button
            key={`welcome:${a.key}`}
            {...(a.primary ? { variant: 'primary' as const } : {})}
            label={a.n !== undefined ? `${a.label} ${a.n}` : a.label}
            onPress={() => void submitWelcome($, a.message)}
          />
        ))}
      </Box>
    </Box>
  )
}

/** Les tâches lancées montrées sur la carte et l'en-tête ; les suivantes se comptent. */
const BRAND_TASKS_SHOWN = 6

/** La largeur de dessin d'une surface : ses colonnes (le panneau les donne), moins `margin` colonnes. */
function surfaceWidth(e: RenderInput<'UserMessage'> | RenderInput<'Pane'>, margin: number, max = Infinity): number {
  const columns = (e.props as { bodyColumns?: number }).bodyColumns ?? 56
  return Math.min(max, fullWidth(Math.max(24, columns - margin)))
}

/**
 * L'identité Roadmap au style Voies (#137, maquette A choisie par Bertrand le 2026-10-30), sans cadre ni
 * filet : chez Maestro, le moyeu d'où part une voie vers chaque tâche lancée, à la couleur de son état ;
 * chez une tâche, sa ligne de marque, son titre, son axe et son échéance, et (carte, vue de tâche) sa
 * voie : la station d'avant, la sienne, celle qu'elle débloque. Les mots sont ceux de `brandText`.
 * `card` : à la place du message d'ouverture ; `header` : en haut du panneau ; `focus` : la tête de la
 * vue de tâche. Sans Svg (terminal), la liste et les mots restent.
 */
/** Ce que l'arbre de Maestro montre des étapes de ses tâches (#143) : leurs notes par numéro, l'épinglée, ses gestes. */
type BrandSteps = {
  of: Record<string, ChildStatus>
  now: number
  /** Le numéro de la tâche dont la carte est épinglée ; vide : aucune. */
  pin: string
  setPin: (id: string) => void
  open: (t: BrandTask) => void
}

function brandTree(
  $: EngineInterface,
  e: RenderInput<'UserMessage'> | RenderInput<'Pane'>,
  brand: Brand,
  palette: Palette,
  variant: 'card' | 'header' | 'focus',
  today = '',
  state?: BrandTask['state'],
  // Le titre « #N … » d'une tâche, cliquable (#142) : la clé de son bouton et ce qu'il fait.
  onTitle?: { key: string; press: () => void },
  // Chez Maestro, dans l'en-tête du panneau (#143) : les notes d'étapes de ses tâches, l'épingle, l'ouverture.
  steps?: BrandSteps,
  // Les voies seules, sans la ligne « Maestro … » : l'arbre que montre le filtre « En cours » (#149).
  bare = false,
  // Au bout du titre d'une tâche, dans sa fiche : le crayon qui la fait passer en édition (#161).
  titleEnd?: RenderElement,
  // En tête de la fiche, à la place de la marque : la flèche retour vers la roadmap (#165, maquette A).
  onBack?: { key: string; press: () => void },
): RenderElement {
  const { Box, Text, Button } = $.ui.resolve(e)
  const resolved = $.ui.resolve(e)
  const Svg = 'Svg' in resolved && e.surface !== 'terminal' ? resolved.Svg : undefined
  const words = brandText(brand, today)
  const card = variant === 'card'
  const strut = (height: number) =>
    Svg ? <Svg source={`<svg xmlns="http://www.w3.org/2000/svg" width="1" height="${height}"/>`} alt="espace" width={1} height={height} /> : null
  const pill = (label: string, bg: string, fg: string) => {
    if (!Svg) return <Text key={label} size="caption" color={fg}>{` ${label} `}</Text>
    const p = pillIcon({ text: label, bg, fg, height: SIZE.pill.row, weight: TEXT.weight.soft })
    return <Svg key={label} source={p.source} alt={label} width={p.width} height={p.height} />
  }
  // « T'attend » en orange, celui de « bloquée » ; une tâche toute finie en violet (#145).
  const tone = (s: BrandTask['state'], finished = false): [string, string] =>
    finished
      ? [palette.finishedTint, palette.finishedOn]
      : s === 'wait'
        ? [palette.blockTint, palette.blockOn]
        : s === 'live'
          ? [palette.liveTint, palette.liveOn]
          : [palette.sel, palette.text2]
  const mark = (size: number) => Svg && <Svg source={brandMarkIcon(palette, size)} alt="Roadmap" width={size} height={size} />

  if (brand.kind === 'maestro') {
    const shown = brand.tasks.slice(0, BRAND_TASKS_SHOWN)
    const more = brand.tasks.length - shown.length
    // Les étapes de chaque voie (#143), seulement dans l'en-tête du panneau : une voie qui en a prend deux lignes.
    const stepsOf = (t: BrandTask) => {
      const status = steps?.of[t.id]
      const view = status && steps ? stepsView(status.steps, { now: steps.now, at: status.at, closed: t.closed === true }) : undefined
      return status && view ? { status, view } : undefined
    }
    const anySteps = !card && shown.some(t => stepsOf(t) !== undefined)
    const row = card ? 28 : anySteps ? SIZE.strut.row + 20 : SIZE.strut.row
    const lanes = Svg && shown.length > 0 ? brandLanesIcon(palette, shown.map(t => (t.finished ? 'finished' : t.state)), row, card ? 40 : 32) : undefined
    const laneName = (t: BrandTask) =>
      steps && t.sessionId ? (
        <Button key={`brand-open:${keyPart(t.id)}`} plain onPress={() => steps.open(t)}>
          <Text size="footnote" wrap="truncate-end">{t.label}</Text>
        </Button>
      ) : (
        <Text size="footnote" wrap="truncate-end">{t.label}</Text>
      )
    const laneSteps = (t: BrandTask) => {
      const found = stepsOf(t)
      if (!found || !steps) return null
      const { status, view } = found
      const pinned = steps.pin === t.id
      const bar = stepsBarIcon(palette, view.segments, { width: 120, height: 4, waiting: t.state === 'wait', finished: t.finished === true })
      const label = view.current ? `${view.count} · ${clip(view.current, 40)}` : view.count
      return (
        <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
          {Svg && <Svg source={bar.source} alt={`étapes ${view.count}`} width={bar.width} height={bar.height} />}
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            <Button key={`brand-pin:${keyPart(t.id)}`} plain dimColor onPress={() => steps.setPin(pinned ? '' : t.id)}>
              <Text size="caption" color={palette.text2} wrap="truncate-end">{label}</Text>
            </Button>
          </Box>
          {stepsCard($, e, palette, {
            key: `steps-card:${keyPart(t.id)}`,
            id: t.id,
            status,
            now: steps.now,
            top: 2,
            pinned,
            closed: t.closed === true,
            actions: (
              <Box flexDirection="row" gap={SPACE.row}>
                {t.sessionId && <Button key={`steps-open:${keyPart(t.id)}`} label="Ouvrir la session" onPress={() => steps.open(t)} />}
                <Button key={`steps-close:${keyPart(t.id)}`} plain dimColor label="Fermer" onPress={() => steps.setPin('')} />
              </Box>
            ),
          })}
        </Box>
      )
    }
    const list = shown.length > 0 && (
      <Box key="brand-lanes" flexDirection="row" alignItems="center" gap={SPACE.row}>
        {lanes && Svg && <Svg source={lanes.source} alt="voies" width={lanes.width} height={lanes.height} />}
        {/* La dernière voie d'abord dans l'arbre, la colonne renversée : la carte d'une voie se peint
            après celles du dessous (#145), l'ordre à l'œil reste celui de la création. */}
        <Box flexDirection="column-reverse" flexGrow={1} flexShrink={1} minWidth={0}>
          {more > 0 && <Text size="caption" color={palette.text3}>{`et ${more} de plus`}</Text>}
          {[...shown.entries()].reverse().map(([i, t]) => (
            <Box key={`brand:${t.id}`} flexDirection="row" alignItems="center" gap={SPACE.row}>
              {strut(row)}
              <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
                <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
                  <Text size="footnote" tabular color={palette.text2}>{`#${t.id}`}</Text>
                  <Box flexGrow={1} flexShrink={1} minWidth={0}>
                    {laneName(t)}
                  </Box>
                  {pill(words.states[i] ?? '', ...tone(t.state, t.finished === true))}
                </Box>
                {!card && laneSteps(t)}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    )
    if (card) {
      return (
        <Box flexDirection="column" gap={SPACE.block} paddingY="xs">
          <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
            {(shown.length === 0 || brand.welcome) && mark(28)}
            <Box flexDirection="column" flexShrink={1} minWidth={0}>
              <Text size="title" weight="semibold" wrap="wrap">{words.title}</Text>
              <Text size="footnote" color={palette.text2} wrap="wrap">{words.sub}</Text>
            </Box>
          </Box>
          {brand.welcome && welcomeTree($, e, brand.welcome, palette, pill)}
          {list}
        </Box>
      )
    }
    if (bare) return list || <Box />
    // Les voies, qui portent les cartes d'étapes, en dernier dans l'arbre et en haut à l'œil : un absolu
    // se peint sous ce qui le suit (#145).
    return (
      <Box flexDirection="column-reverse" gap={SPACE.tight}>
        <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
          {shown.length === 0 && mark(18)}
          <Text size="heading" weight="semibold">{words.title}</Text>
          <Text size="footnote" color={palette.text2}>{words.foot}</Text>
        </Box>
        {list}
      </Box>
    )
  }

  const accent = axisColor(palette, brand.axisIndex)
  const axis = Svg ? (
    (() => {
      const a = axisPillIcon({ name: axisLabel(brand.axis), hex: accent, bg: axisTint(palette, accent), fg: palette.text })
      return <Svg key="axis" source={a.source} alt={brand.axis} width={a.width} height={a.height} />
    })()
  ) : (
    <Text key="axis" size="caption" color={accent}>{axisLabel(brand.axis)}</Text>
  )
  // Une ligne sans `id:` (#142) : ni numéro, ni voie.
  const numbered = brand.id !== ''
  const stations =
    variant !== 'header' && Svg && words.stations && numbered
      ? brandStationsIcon(palette, accent, words.stations, surfaceWidth(e, variant === 'focus' ? 4 : 6, card ? 520 : Infinity))
      : undefined
  // Le titre en `title` sur la carte et dans la fiche, à la hauteur de son crayon (#181) ; `heading` dans la bande.
  const titleSize = variant === 'header' ? 'heading' : 'title'
  const title = onTitle ? (
    // Un bouton de l'app ne tient que du texte : le numéro et le titre, deux Text dedans.
    <Box key={`title:${onTitle.key}`} flexDirection="row" flexShrink={1} minWidth={0}>
      <Button key={onTitle.key} plain hover={{ underline: true }} onPress={onTitle.press}>
        {numbered && <Text size={titleSize} weight="semibold" color={accent}>{`#${brand.id} `}</Text>}
        <Text size={titleSize} weight="semibold" wrap="wrap">{brand.label}</Text>
      </Button>
    </Box>
  ) : (
    <Box flexDirection="row" gap={SPACE.row}>
      {numbered && <Text size={titleSize} weight="semibold" color={accent}>{`#${brand.id}`}</Text>}
      <Box flexShrink={1} minWidth={0}>
        <Text size={titleSize} weight="semibold" wrap="wrap">{brand.label}</Text>
      </Box>
    </Box>
  )
  return (
    <Box flexDirection="column" gap={SPACE.tight} paddingY={card ? 'xs' : undefined}>
      <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
        {onBack ? (
          // Un bouton de l'app, à texte seul : pas de zone de clic de plus (`ZONE_LIMIT`) ; au terminal, il dit où il mène.
          <Button key={onBack.key} plain onPress={onBack.press}>
            <Text size={Svg ? 'heading' : undefined}>{Svg ? '←' : '← Roadmap'}</Text>
          </Button>
        ) : (
          mark(variant === 'focus' ? 16 : 18)
        )}
        <Box flexGrow={1} flexShrink={1} minWidth={0}>
          <Text size="footnote" color={palette.text2} wrap="truncate-end">{words.sub}</Text>
        </Box>
        {/* Une tâche close : « Completed » en violet, comme dans la bande de Maestro (#174). */}
        {state && pill(BRAND_STATE_WORDS[state], ...tone(state, state === 'done'))}
      </Box>
      {titleEnd ? (
        <Box key="title-row" flexDirection="row" alignItems="flex-start" gap={SPACE.row}>
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            {title}
          </Box>
          {titleEnd}
        </Box>
      ) : (
        title
      )}
      <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
        {axis}
        {words.meta.map(m => pill(m, palette.sel, palette.text2))}
      </Box>
      {stations && Svg && <Svg source={stations.source} alt={words.stations?.here ?? ''} width={stations.width} height={stations.height} />}
    </Box>
  )
}

/** Les mots d'état d'une tâche lancée, ceux des pastilles de Maestro. */
const BRAND_STATE_WORDS: Record<BrandTask['state'], string> = { wait: "t'attend", live: 'en session', done: 'Completed' }

/**
 * La marque de cette session : chez Maestro (son titre ou sa marque), Maestro et ses tâches ; chez une
 * session « #N · … », sa tâche et son Maestro ; rien ailleurs, ni sur une lecture en panne.
 */
async function sessionBrandOf($: EngineInterface): Promise<{ brand: Brand; data: NonNullable<Awaited<ReturnType<typeof brandData>>> } | undefined> {
  try {
    const data = await brandData($)
    if (!data) return undefined
    const { own } = data
    const isMaestro = isMaestroSession(own.title) || (own.id !== undefined && (await loadMaestros($))[own.id] !== undefined)
    const brand = data.shorten(
      sessionBrand({ title: own.title, isMaestro, source: data.source, tasks: data.tasks, maestroTasks: data.maestroTasks, ...(parentMaestro ? { maestro: 'Maestro' } : {}) }),
    )
    return brand ? { brand, data } : undefined
  } catch {
    return undefined
  }
}

/**
 * L'arbre de Maestro dans la bande au-dessus de la saisie (#147, style C retouché) : sur le fond du
 * panneau, « Maestro » et ses sessions ; puis une ligne par tâche, sans voies : le point de son état, le
 * numéro, le nom (ouvre la session), l'étape en cours, sa jauge, « 2/6 », l'état : la roue des lignes de
 * la liste pour une session qui tourne, le mot pour les autres (#152 : plus de jauge d'ensemble, une seule
 * jauge par ligne). Colonnes de largeur fixe, la ligne s'éclaire au survol. Au terminal, le texte seul.
 */
function maestroBandTree(
  $: EngineInterface,
  e: RenderInput<'AbovePrompt'>,
  band: MaestroBand,
  palette: Palette,
  views: readonly (StepsView | undefined)[],
  act: { open: (t: BrandTask) => void; archive: (t: BrandTask) => void },
  now: number,
  mine?: ContextView,
  zoneGen = 0,
): RenderElement {
  const resolved = $.ui.resolve(e)
  const { Box, Text, Button } = resolved
  const Svg = 'Svg' in resolved && e.surface !== 'terminal' ? resolved.Svg : undefined
  const Client = 'Client' in resolved && Svg ? resolved.Client : undefined
  const words = brandText(band.brand)
  // Les couleurs de #145 : t'attend en orange, toute finie en violet.
  const hue = (t: BrandTask): [string, string] =>
    t.finished ? [palette.finished, palette.finishedOn] : t.state === 'wait' ? [palette.block, palette.blockOn] : t.state === 'live' ? [palette.live, palette.liveOn] : [palette.done, palette.text2]
  const strut = Svg && <Svg source={`<svg xmlns="http://www.w3.org/2000/svg" width="1" height="${SIZE.strut.row}"/>`} alt="espace" width={1} height={SIZE.strut.row} />
  // L'icône d'archivage d'une session close (#174) : un dessin et sa zone de clic ; au terminal ou sans
  // zone, un bouton de texte. Archiver garde le clic de Bertrand : l'icône est ce clic.
  const archiveButton = (t: BrandTask) => {
    const id = `band-archive:${keyPart(t.id)}`
    if (!Svg || !Client) return <Button key={id} plain dimColor label="Archiver" onPress={() => act.archive(t)} />
    pressHandlers.set(id, () => act.archive(t))
    zoneDrawn(zones, 'press-hit', now)
    return (
      <Box key={id} flexDirection="row" alignItems="center">
        <Svg source={archiveIcon(palette.text2, 14)} alt="Archiver la session" width={SIZE.icon.sm} height={SIZE.icon.sm} />
        {/* Une ligne de haut : sous une icône, une zone sans hauteur ne reçoit aucun clic (2026-10-23). */}
        <Box position="absolute" top={0} left={0} right={0}>
          <Client key={`${pressKey(id)}-g${zoneGen}`} module="./press-hit.tsx" props={{ id }} width="100%" height={1} />
        </Box>
      </Box>
    )
  }
  // La roue pour une session qui tourne, le mot pour les autres.
  const spins = (t: BrandTask) => Boolean(Svg) && t.state === 'live' && !t.finished
  const cols = bandColumns({
    counts: views.map(v => v?.count ?? ''),
    states: band.tasks.map((t, i) => (spins(t) ? 'spinner' : (words.states[i] ?? ''))),
    archive: band.tasks.some(t => t.archivable && t.sessionId),
  })
  return (
    <Box flexDirection="column" gap={SPACE.tight} backgroundColor={palette.bg} padding="sm">
      <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
        <Text size="footnote" weight="semibold">{words.title}</Text>
        {words.foot !== '' && <Text size="caption" color={palette.text3}>{`· ${words.foot}`}</Text>}
        {/* Le contexte de Maestro, seul : « Contexte 40 % », sans tokens ni jauge (#174). */}
        {mine && <Box flexGrow={1} />}
        {mine && <Text size="caption" color={palette.text3}>Contexte</Text>}
        {mine && <Text size="caption" tabular color={palette.text2}>{`${mine.percent} %`}</Text>}
      </Box>
      <Box flexDirection="column">
        {band.tasks.map((t, i) => {
          const view = views[i]
          const [dot, word] = hue(t)
          const bar = view && Svg ? stepsBarIcon(palette, view.segments, { width: BAND_GAUGE.row, height: 4, waiting: t.state === 'wait', finished: t.finished === true }) : undefined
          const name = <Text size="footnote" wrap="truncate-end">{t.label}</Text>
          return (
            <Box key={`band-row:${keyPart(t.id)}`} flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={1} hover={{ backgroundColor: palette.hover }}>
              {strut}
              {Svg && <Svg source={discIcon(dot, 12)} alt={words.states[i] ?? ''} width={12} height={12} />}
              <Box width={5}>
                <Text size="caption" tabular color={palette.text3}>{`#${t.id}`}</Text>
              </Box>
              <Box flexShrink={1} minWidth={0}>
                {t.sessionId ? (
                  <Button key={`band-open:${keyPart(t.id)}`} plain hover={{ underline: true }} onPress={() => act.open(t)}>
                    {name}
                  </Button>
                ) : (
                  name
                )}
              </Box>
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                {view?.current && !t.finished && <Text size="caption" color={palette.text3} wrap="truncate-end">{`· ${view.current}`}</Text>}
              </Box>
              {/* Jauge, compte et état à largeur fixe, sur chaque ligne (#172) : les barres partent de la même
                  colonne, quels que soient le titre, l'étape ou le compte (« 5/7 », « 7/7 Done »). */}
              {Svg && (
                <Box key={`band-gauge:${keyPart(t.id)}`} width={BAND_COLUMNS.gauge} flexShrink={0} flexDirection="column" gap={SPACE.tight}>
                  {bar && <Svg source={bar.source} alt={`étapes ${view?.count ?? ''}`} width={bar.width} height={bar.height} />}
                </Box>
              )}
              {/* Compte, état et archivage serrés à la largeur de leur plus long texte (#174). */}
              {cols.count > 0 && (
                <Box key={`band-count:${keyPart(t.id)}`} width={cols.count} flexShrink={0} alignItems="flex-end">
                  {view && <Text size="caption" tabular color={palette.text3}>{view.count}</Text>}
                </Box>
              )}
              <Box key={`band-state:${keyPart(t.id)}`} width={cols.state} flexShrink={0} alignItems="flex-end">
                {Svg && spins(t) ? (
                  <Svg source={spinnerIcon(palette.live, 14, words.states[i], false, now)} alt={words.states[i] ?? ''} width={SIZE.icon.sm} height={SIZE.icon.sm} isInteractive />
                ) : (
                  <Text size="caption" color={word}>{words.states[i] ?? ''}</Text>
                )}
              </Box>
              {/* La case de l'archivage, sur chaque ligne pour garder les colonnes, dès qu'une ligne en a besoin ;
                  l'icône sur une session close à l'arrêt (#174). Au terminal, le bouton prend sa largeur. */}
              {cols.archive > 0 && (
                <Box key={`band-archive-slot:${keyPart(t.id)}`} width={Svg ? cols.archive : undefined} flexShrink={0} alignItems="flex-end">
                  {t.archivable && t.sessionId && archiveButton(t)}
                </Box>
              )}
            </Box>
          )
        })}
        {band.more > 0 && <Text size="caption" color={palette.text3}>{`et ${band.more} de plus`}</Text>}
      </Box>
    </Box>
  )
}

/** La largeur de la jauge d'une ligne de la bande de Maestro, en px (#147) ; celle du contexte de Maestro est partie (#174). */
const BAND_GAUGE = { row: 64 }

/**
 * La case de la jauge de la bande de Maestro, en cellules de l'app (~7,8 px, #172) : 64 px tiennent dans
 * 9 cellules. Celles du compte, de l'état et de l'archivage suivent le texte réel (`bandColumns`, #174).
 */
const BAND_COLUMNS = { gauge: 9 }

/**
 * L'en-tête du panneau, au-dessus de la roadmap : Maestro et ses voies ; chez une tâche dont on a demandé
 * toute la roadmap, sa ligne de marque, dont le titre ramène à sa fiche (#137, #142).
 */
async function paneBrand(
  $: EngineInterface,
  e: RenderInput<'Pane'>,
  found: Awaited<ReturnType<typeof sessionBrandOf>>,
  today: string,
  pin: string,
  now: number,
): Promise<RenderElement | null> {
  if (!found) return null
  // Chez Maestro, rien en tête (#149) : ses sessions vivent dans la ligne « En cours » et son arbre.
  if (found.brand.kind !== 'task') return null
  return brandTree($, e, found.brand, found.data.palette, 'header', today, undefined, {
    key: 'task-focus',
    press: () => void setView($, () => ({ whole: false, selected: '' })),
  })
}

/** Ce que la vue de tâche lit hors de la roadmap, dans sa session : l'écart de la branche ; relu au plus toutes les 30 s. */
let focusFacts: { key: string; at: number; branch: string[]; base: string } | undefined
const FOCUS_FACTS_MS = 30_000

async function readFocusFacts($: EngineInterface, source: Source, task: Task, ownId: string | undefined, now: number) {
  const root = await $.session.root()
  const key = `${root}|${task.id ?? ''}|${task.spec ?? ''}`
  if (focusFacts && focusFacts.key === key && now - focusFacts.at < FOCUS_FACTS_MS) return focusFacts
  let branch: string[] = []
  const base = ownId ? (await childFiche($, ownId)).base : 'main'
  try {
    const counts = await gitIn($, root, 'rev-list', '--left-right', '--count', `${base}...HEAD`)
    const names = await gitIn($, root, 'diff', '--name-only', `${base}...HEAD`)
    const gap = counts.code === 0 && names.code === 0 ? branchGap(counts.out, names.out) : undefined
    if (gap) branch = branchText(gap, base)
  } catch {
    // pas de git (mode Projet, dossier hors dépôt) : pas de ligne Branche
  }
  focusFacts = { key, at: now, branch, base }
  return focusFacts
}

/** La note d'étapes d'une session (`child-status:<id>`), écrite par une session lancée par Maestro ; illisible : rien. */
async function readSteps($: EngineInterface, sessionId: string | undefined): Promise<ChildStatus | undefined> {
  if (!sessionId) return undefined
  try {
    return childStatusOf(await $.store.get(`${CHILD_STATUS_PREFIX}${sessionId}`))
  } catch {
    return undefined
  }
}

/** L'empreinte des notes d'étapes au dernier pas du sondage (#143). */
let lastStepsStamp = ''

/**
 * Les notes d'étapes des sessions suivies ont-elles bougé depuis le pas d'avant (#143) ? Le store est
 * partagé entre les sessions, mais une écriture d'une autre ne redessine pas ce panneau : on compare.
 */
async function stepsMoved($: EngineInterface): Promise<boolean> {
  const ids = new Set<string>()
  for (const entry of sessionMatches.values()) if (entry.sessionId) ids.add(entry.sessionId)
  for (const entry of Object.values(await loadLive($).catch(() => ({}) as Record<string, LiveEntry>))) if (entry.sessionId) ids.add(entry.sessionId)
  if (ownSession?.id) ids.add(ownSession.id)
  const statuses: Record<string, ChildStatus | undefined> = {}
  await Promise.all([...ids].map(async id => (statuses[id] = await readSteps($, id))))
  const stamp = stepsStamp(statuses)
  // Au premier pas, l'empreinte d'avant est inconnue : un redessin de trop, jamais un de moins.
  const moved = stamp !== lastStepsStamp
  lastStepsStamp = stamp
  return moved
}

/** Le dossier de la tâche (`spec:`) : Spec, Plan et Maquettes (#144), dans sa session comme au clic ; relu au plus toutes les 30 s. */
let ficheDocs: { key: string; at: number; docs: { label: string; path: string }[] } | undefined

async function readFicheDocs($: EngineInterface, source: Source, task: Task, now: number) {
  const key = `${source.dir}|${task.spec ?? ''}`
  if (ficheDocs && ficheDocs.key === key && now - ficheDocs.at < FOCUS_FACTS_MS) return ficheDocs.docs
  const docs: { label: string; path: string }[] = []
  if (task.spec) {
    const at = `${source.dir}/${task.spec.replace(/\/$/, '')}`
    for (const [label, path] of [['Spec', `${at}/spec.md`], ['Spec', at], ['Plan', `${at}/plan.md`], ['Maquettes', `${at}/maquettes.html`]] as const) {
      if (docs.some(d => d.label === label)) continue
      try {
        if ((await $.fs.stat(path)).kind === 'file') docs.push({ label, path })
      } catch {
        // absent
      }
    }
  }
  ficheDocs = { key, at: now, docs }
  return docs
}

/**
 * Le bloc « Étapes » de la fiche (#142, #143 maquette C + A), sous la mission : « Étapes », le compte et
 * l'âge de la note, la barre, puis toutes les étapes. Rien sans note lisible.
 */
function ficheSteps($: EngineInterface, e: RenderInput<'Pane'>, palette: Palette, status: ChildStatus | undefined, now: number, closed = false): RenderElement | null {
  const view = status ? stepsView(status.steps, { now, at: status.at, fold: Infinity, closed }) : undefined
  if (!status || !view) return null
  const { Box, Text } = $.ui.resolve(e)
  const Svg = e.surface === 'terminal' ? undefined : $.ui.resolve(e).Svg
  const bar = stepsBarIcon(palette, view.segments, { width: 240, waiting: status.question !== undefined })
  return (
    <Box key="fiche-steps" flexDirection="column" gap={SPACE.tight} paddingX={SPACE.indent}>
      <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
        <Text size="caption" weight="medium" color={palette.text2}>Étapes</Text>
        <Text size="caption" color={palette.text3}>{`${view.count} · ${view.age}`}</Text>
      </Box>
      {Svg && <Svg source={bar.source} alt={`étapes ${view.count}`} width={bar.width} height={bar.height} />}
      {view.rows.map((r, i) =>
        r.kind === 'folded' ? (
          <Text key={`fiche-step:${i}`} size="footnote" color={palette.text2}>{r.text}</Text>
        ) : (
          <Box key={`fiche-step:${i}`} flexDirection="row" alignItems="center" gap={SPACE.row}>
            {Svg ? (
              <Svg source={stepIcon(palette, r.status)} alt={STEP_WORDS[r.status]} width={SIZE.icon.md} height={SIZE.icon.md} />
            ) : (
              <Text size="footnote" color={palette.text2}>{STEP_MARKS[r.status]}</Text>
            )}
            <Text size="footnote" weight={r.status === 'now' ? 'semibold' : undefined} color={r.status === 'now' ? palette.text : palette.text2} wrap="wrap">
              {r.content}
            </Text>
          </Box>
        ),
      )}
    </Box>
  )
}

/**
 * La carte des étapes d'une session (#143, maquette C + A) : « #N · étape 2/6 · il y a 40 s », les
 * étapes (les faites repliées au-delà de trois), la question quand la session attend. Posée en
 * absolu sous la voie de l'arbre de Maestro qui la porte, seul endroit où elle vit (#145) : cachée,
 * elle paraît au survol de cette voie ; `pinned` la garde ouverte. Fond plein, mais un absolu se peint
 * sous ce qui le suit dans l'arbre : `drawPane` dessine l'en-tête en dernier. `actions` : ses boutons,
 * quand elle est épinglée. Rien au terminal sans `pinned`.
 */
function stepsCard(
  $: EngineInterface,
  e: RenderInput<'Pane'> | RenderInput<'UserMessage'>,
  palette: Palette,
  card: { key: string; id?: string; status: ChildStatus; now: number; top?: number; pinned?: boolean; closed?: boolean; actions?: RenderElement },
): RenderElement | null {
  const view = stepsView(card.status.steps, { now: card.now, at: card.status.at, closed: card.closed === true })
  if (!view) return null
  const { Box, Text } = $.ui.resolve(e)
  const Svg = e.surface === 'terminal' ? undefined : $.ui.resolve(e).Svg
  if (!Svg && !card.pinned) return null
  const head = `${card.id ? `#${card.id} · ` : ''}${view.current ? `étape ${view.count}` : view.count} · ${view.age}`
  const question = card.status.question?.text
  return (
    // Sans clé : la Box à clé qui la porte (la voie) est la portée du survol.
    <Box
      position="absolute"
      top={card.top ?? 1}
      left={2}
      width={40}
      flexDirection="column"
      gap={SPACE.tight}
      paddingX={SPACE.indent}
      paddingY="xs"
      backgroundColor={palette.bg}
      borderStyle="round"
      borderColor={question ? palette.block : palette.border}
      // Épinglée, elle est déjà là : le survol n'a rien à montrer (le moteur refuse un survol qui ne révèle rien).
      display={card.pinned ? 'flex' : 'none'}
      {...(card.pinned ? {} : { hover: { display: 'flex' as const } })}
    >
      <Text size="caption" color={palette.text2}>{head}</Text>
      {view.rows.map((r, i) =>
        r.kind === 'folded' ? (
          <Text key={`${card.key}:${i}`} size="footnote" color={palette.text2}>{r.text}</Text>
        ) : (
          <Box key={`${card.key}:${i}`} flexDirection="row" alignItems="center" gap={SPACE.row}>
            {Svg ? (
              <Svg source={stepIcon(palette, r.status)} alt={STEP_WORDS[r.status]} width={SIZE.icon.md} height={SIZE.icon.md} />
            ) : (
              <Text size="footnote" color={palette.text2}>{STEP_MARKS[r.status]}</Text>
            )}
            <Text size="footnote" weight={r.status === 'now' ? 'semibold' : undefined} color={r.status === 'now' ? palette.text : palette.text2} wrap="truncate-end">
              {r.content}
            </Text>
          </Box>
        ),
      )}
      {question && <Text size="footnote" color={palette.blockOn} wrap="wrap">{question}</Text>}
      {card.pinned && card.actions}
    </Box>
  )
}

/** Ce que dit la marque d'une étape, et sa marque au terminal (#143). */
const STEP_WORDS: Record<StepSegment, string> = { done: 'faite', now: 'en cours', todo: 'à faire' }
const STEP_MARKS: Record<StepSegment, string> = { done: '✓', now: '›', todo: '○' }

async function drawPane($: EngineInterface, e: RenderInput<'Pane'>): Promise<RenderElement> {
  // Les gestionnaires de clic ne se vident pas ici : un rendu attend ses lectures, et un clic
  // arrivé pendant ce temps ne trouvait plus son bouton. Chaque rendu réécrit ceux qu'il dessine.
  const { Box, Text, Button, Link } = $.ui.resolve(e)
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
    <Box alignSelf="flex-start" paddingX={SPACE.indent} backgroundColor={bg}>
      {corners(RADIUS.chip, around)}
      <Text mono size="caption" wrap="wrap">{path}</Text>
    </Box>
  )

  const source = knownSource === undefined ? await sourceNow($) : (knownSource ?? undefined)
  if (!source) {
    // Pas de roadmap pour le dossier de la session : ce qui en déclare une.
    const p = await paletteOf($)
    return (
      <Box flexDirection="column" gap={SPACE.block} paddingX={SPACE.screen} paddingTop="sm">
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
    axis: axisRaw, attend: attendRaw, who: whoRaw = 'all', moreFilters = false, showDone, groupBy, selected, openGroups, closedGroups, moreGroups,
    launchNote, launched, openNote, conclusionOpen, missionOpen = '', cancelAsk = '', closeKind = 'abandon', cancelNote = '',
    editing: editingKey = '', editNote = '', editField = '', editCount = 0,
  } = view
  const data = await paneData($, source, [stamp, titlesVersion, themeStamp, retry, liveVersion].join('|'))
  const { palette, bilan: bilanData, titles, live: liveEntries, ignored } = data
  const [versionCheck, ownVersion] = await Promise.all([read($, versionNoteAtom), loadSessionVersion($)])
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
      <Box flexDirection="column" gap={SPACE.block} paddingX={SPACE.screen} paddingTop="sm">
        <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
          {SvgEl ? <SvgEl source={alertIcon(palette.late)} alt="erreur" width={SIZE.icon.md} height={SIZE.icon.md} /> : <Text color="error">!</Text>}
          <Text weight="semibold">Lecture impossible</Text>
        </Box>
        <Text color={palette.text2}>Le fichier de la roadmap est introuvable ou illisible.</Text>
        {pathChip(paths.open, palette.btn, palette.bg)}
        <Text mono size="caption" color={palette.late}>{open}</Text>
        <Box flexDirection="row" alignItems="center" gap={SPACE.textButtons} marginTop="sm">
          <Box key="retry-row" paddingX={SPACE.indent} paddingY="xs" alignItems="center" backgroundColor={palette.btn} hover={{ backgroundColor: palette.btnHover }}>
            {corners(RADIUS.control, palette.bg)}
            <Button key="retry" plain label="Réessayer" onPress={() => void update($, retryAtom, v => v + 1)} />
          </Box>
          <Text size="caption" color={palette.text2}>Nouvel essai seul toutes les 15 s</Text>
        </Box>
      </Box>
    )
  }
  const done = data.done

  // Dans une session « #N · … » : la fiche de sa tâche plutôt que toute la roadmap (#137, #142).
  const ownBrand = await sessionBrandOf($)
  const focusBrand = ownBrand?.brand.kind === 'task' && paneFocus(ownBrand.brand, view) === 'task' ? ownBrand.brand : undefined

  // La date d'un parent est celle de son enfant ouvert le plus proche (#125) : filtres, tri et pastilles la lisent.
  const openTasks = withParentDates(open.filter(t => !t.done))
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
  // Les notes d'étapes des tâches en session (#143) : la mini-barre et la carte de leur ligne.
  const rowSteps = new Map<string, ChildStatus>()
  await Promise.all(
    openTasks.map(async t => {
      const found = await readSteps($, liveOf(t)?.entry.sessionId)
      if (found) rowSteps.set(taskKey(t), found)
    }),
  )
  // Tâches enchaînées : `après:` désigne la prérequise ; une tâche est bloquée tant qu'elle n'est pas faite.
  const allTasks = [...openTasks, ...doneTasks]
  // Un seul calcul des prérequises par tâche : la chaîne prend la première, « Débloque » toutes.
  const prereqsCache = new Map<Task, Task[]>()
  const prereqsFor = (t: Task): Task[] => {
    if (!prereqsCache.has(t)) prereqsCache.set(t, prereqsOf(t, allTasks, x => titles[hashLabel(x.label)]?.titre))
    return prereqsCache.get(t) ?? []
  }
  const prereqFor = (t: Task): Task | undefined => firstPrereq(prereqsFor(t))
  // Un parent bloqué bloque ses enfants (#125) : `blockerOf` dit la prérequise qui bloque, et par quel parent.
  const openById = new Map(openTasks.filter(t => t.id !== undefined).map(t => [t.id as string, t]))
  const parentOf = (t: Task) => (t.parent === undefined ? undefined : openById.get(t.parent))
  const blockerFor = (t: Task) => blockerOf(t, prereqFor, parentOf)
  const blocked = (t: Task) => blockerFor(t) !== undefined
  const sortOrder = { isLive, prereqOf: prereqFor }
  const select = (key: string) => () => {
    launchExtra = ''
    void setView($, () => ({ selected: key, launchNote: '', openNote: '', cancelAsk: '', cancelNote: '', editing: '', editNote: '', editField: '' }))
  }

  // Dessins et couleurs, partagés par la liste et le détail.
  // Sur l'app de bureau (et VS Code, mobile), les couleurs et icônes sont des SVG ; le terminal
  // garde des glyphes. Un bouton impose sa couleur : rien de coloré n'y entre.
  const Svg = e.surface === 'terminal' ? undefined : $.ui.resolve(e).Svg
  // Une note d'attente (#169, maquette A) : une bande bleue aux coins arrondis, la roue, le titre en
  // gras et son explication dessous ; `after` à droite (« Relancer »). Au terminal, le texte seul.
  const waitBand = (key: string, note: WaitNote, after?: RenderElement) => (
    <Box key={key} flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent} paddingY="xs" backgroundColor={Svg ? palette.liveTint : undefined}>
      {corners(RADIUS.control, palette.bg)}
      {Svg && <Svg source={spinnerIcon(palette.liveOn, 16, undefined, false, now)} alt="en cours" width={SIZE.icon.md} height={SIZE.icon.md} isInteractive />}
      <Box flexDirection="column" flexGrow={1} flexShrink={1}>
        <Text weight="semibold" color={palette.liveOn}>{note.title}</Text>
        <Text size="caption" color={palette.liveOn} wrap="wrap">{note.detail}</Text>
      </Box>
      {after}
    </Box>
  )
  const elements = $.ui.resolve(e)
  const Client = 'Client' in elements ? elements.Client : undefined
  // Le markdown de la carte Fin (#150) : rendu comme une réponse, code et puces compris.
  const Markdown = elements.Markdown
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
  const countPill = (n: number | string, dim: boolean, ink: string) => {
    if (!Svg) return <Text tabular color={ink}>{String(n)}</Text>
    const pill = pillIcon({ text: String(n), bg: mixOver(palette.sel, palette.bg, MIX.countBg), fg: palette.text2, weight: TEXT.weight.soft, size: TEXT.count, height: SIZE.pill.count })
    return <Svg source={fade(pill.source, dim)} alt={String(n)} width={pill.width} height={pill.height} />
  }
  // Le numéro d'une tâche devant son titre : petit, discret, suivi d'un point de séparation. Hors du
  // bouton, qui imposerait sa couleur au texte.
  // `open` : la tâche a une session ouverte, et un clic sur son numéro y mène.
  const taskNumber = (id: string, open?: () => void, afterCheck = false) => (
    // Une colonne de 6 de large (un numéro cliquable est un bouton, dont la marge intérieure
    // tronquait « #133 » dans 4), calée à droite : le point colle au numéro et les titres restent
    // alignés ; l'écart des numéros courts passe à gauche, contre le carré (2026-10-23). Derrière un
    // rond (#179), le numéro le suit, à l'écart fixe de la ligne (`treeNumberBox`).
    <Box key={`n:${id}`} {...treeNumberBox(afterCheck)}>
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
  const faded = (hex: string, dim: boolean) => (dim ? mixOver(hex, palette.bg, MIX.faded) : hex)
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
      <Box flexDirection="row" paddingX={SPACE.indent} flexShrink={0} backgroundColor={o.bg}>
        <Text color={o.fg} wrap="end">{o.text}</Text>
      </Box>
    )
  }
  // Une pastille du détail : grise (date relative), rouge (retard, horloge) ou violette (tiers, personne).
  const tag = (text: string, kind: 'soft' | 'late' | 'soon' | 'wait') =>
    kind === 'late'
      ? drawnPill({ text, bg: palette.lateTint, fg: palette.lateOn, mark: 'clock', height: SIZE.pill.detail })
      : kind === 'soon'
        ? drawnPill({ text, bg: palette.blockTint, fg: palette.blockOn, height: SIZE.pill.detail })
      : kind === 'wait'
        ? drawnPill({ text, bg: palette.waitTint, fg: palette.waitOn, mark: 'person', height: SIZE.pill.detail })
        : drawnPill({ text, bg: palette.sel, fg: palette.text2, height: SIZE.pill.detail, weight: TEXT.weight.soft })
  // Une tâche née d'un retour de l'app, ou qui en a reçu (`feedback:`) : violette, la voix d'un testeur.
  const feedbackPill = (height?: number) =>
    drawnPill({ text: 'Feedback', bg: palette.waitTint, fg: palette.waitOn, weight: TEXT.weight.soft, ...(height ? { height } : {}) })

  // --- La fiche d'une tâche (#142) : celle de la session, ou celle du clic ---------
  // Sa tâche introuvable (ligne retirée), la session voit toute la roadmap.
  const ownTask = focusBrand ? allTasks.find(t => t.id === focusBrand.id) : undefined
  const inSession = ownTask !== undefined
  const current = ownTask ?? findSelected([...openTasks, ...doneTasks], selected)
  if (current) {
    // Dans sa session : le dossier, la branche et son écart, lus hors de la roadmap.
    const facts = inSession && ownBrand ? await readFocusFacts($, ownBrand.data.source, current, ownBrand.data.own.id, now) : undefined
    // Son dossier (Spec, Plan, Maquettes) et le récap de fin de sa session (#144), dans les deux contextes.
    const ficheSource = inSession && ownBrand ? ownBrand.data.source : source
    const docs = await readFicheDocs($, ficheSource, current, now)
    const storedRecap = current.id ? recapOf(await $.store.get(recapKey(ficheSource.name, current.id)).catch(() => undefined)) : undefined
    const frame = missionFrame(current.label, storedRecap)
    // Le morceau « livré : … » de la note d'une close va dans la carte Fin (#150) ; le reste de la note reste.
    const noteShown = current.done ? livreOfNote(current.note).rest : current.note
    // Sans récap, une ligne longue tient en trois lignes, le reste derrière « Tout voir » (#146, maquette B).
    const cut = frame.recap ? undefined : missionCut(frame.text)
    const missionShown = missionOpen === current.key
    const s = short(current)
    const days = age(current)
    const line = Number(current.key.split(':').pop())
    const fichePath = current.fiche ? `${source.dir}/${current.fiche}` : undefined
    const srcPath = current.src ? `${source.dir}/${current.src}` : undefined
    const due = current.due && !current.done ? dueLabel(current.due, today) : undefined
    const live = liveOf(current)
    const kept = doneSessionOf(current)
    const abandoned = isAbandoned(current)
    const asking = cancelAsk === taskKey(current)
    const pre = prereqFor(current)
    // Ce qui la bloque : sa prérequise, ou celle de son parent (#125).
    const holder = blockerFor(current)
    const { cles } = projectSettings(source)
    // En édition (#161, maquette C) : les champs en place dans les cartes, préremplis de la ligne brute,
    // les valeurs tapées gardées hors de l'état (`editDrafts`) pour qu'un redessin ne les perde pas.
    const editKey = taskKey(current)
    const editing = !current.done && editingKey === editKey
    const editText = editing ? (await readOr($, paths.open)) ?? '' : ''
    const editSpecs = editing
      ? editableFields(current, editText.split('\n')[line - 1] ?? '', { axes: declaredAxes(editText), cles })
      : []
    const unlocks = allTasks.filter(t => prereqsFor(t).includes(current))
    // Sa place dans sa chaîne d'ouvertes : « étape 2 sur 4 ».
    const openSet = new Set(openTasks)
    const head = current.done ? current : chainHead(current, prereqFor, openSet)
    const chain = current.done ? [] : [head, ...unlockedBy(head, openTasks, prereqFor)]
    const steps = chain.length > 1 ? chainSteps(sortTasks(chain, sortOrder), prereqFor) : new Map<Task, ChainStep>()
    const stepOf = steps.get(current)
    const lastStep = Math.max(0, ...[...steps.values()].map(x => x.step))
    // Un lien vers une tâche enchaînée : carré d'axe, titre (cliquable), et son état. Le titre rétrécit et
    // se coupe, l'état garde sa largeur : un titre long poussait la carte hors du panneau (#173).
    const link = (x: Task) => (
      <Box key={`link-row:${x.key}`} flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={1} minWidth={0}>
        {icon(squareIcon(axisHex(x.axis)), x.axis, 16, '■', axisTheme(x.axis))}
        {x.id && taskNumber(x.id)}
        <Box key={`link-title:${x.key}`} flexShrink={1} minWidth={0}>
          <Button key={`link:${x.key}`} plain hover={{ underline: true }} onPress={select(selectionOf(x))}>
            <Text wrap="truncate-end">{short(x).titre}</Text>
          </Button>
        </Box>
        <Box key={`link-state:${x.key}`} flexShrink={0}>
          {x.done ? (
            <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
              {icon(checkIcon(palette.ok, 12, STROKE.pill), 'faite', 12, '✓', 'success')}
              <Text size="caption" weight="medium" color={palette.ok}>Done</Text>
            </Box>
          ) : isLive(x) ? (
            drawnPill({ text: 'en session', bg: palette.liveTint, fg: palette.liveOn, mark: 'spinner', height: SIZE.pill.detail })
          ) : (
            drawnPill({ text: 'à faire', bg: palette.sel, fg: palette.text2, height: SIZE.pill.detail, weight: TEXT.weight.soft })
          )}
        </Box>
      </Box>
    )
    // « Tout voir », « Replier » d'un cadre (#173) : sur le bureau, un texte aligné sur le reste de la carte et
    // sa zone de clic ; le bouton de l'app, même `plain`, y est natif et sa marge le décalait. Au terminal, le bouton.
    const moreLink = (id: string, label: string, onPress: () => void) => (
      <Box flexDirection="row">
        {graphic && Client ? (
          <Box key={`hit:${id}`} hover={{ backgroundColor: palette.hover }}>
            <Text color={palette.text2}>{label}</Text>
            {hit(id, onPress, 1)}
          </Box>
        ) : (
          <Button key={id} plain dimColor label={label} onPress={onPress} />
        )}
      </Box>
    )
    // Un champ : son nom sur 10 unités, la valeur à côté ; absent, rien.
    const field = (name: string, value: RenderElement | undefined | false, key = name) =>
      value ? (
        <Box key={`field:${key}`} flexDirection="row" alignItems="center">
          <Box width={10} flexShrink={0} flexDirection="row" alignItems="center">
            {strut(SIZE.strut.field)}
            <Text color={palette.text2}>{name}</Text>
          </Box>
          <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={1} minWidth={0}>
            {value}
          </Box>
        </Box>
      ) : null
    const plain = (text: string | undefined) => text !== undefined && text !== '' && <Text wrap="truncate-end">{text}</Text>
    const strong = (text: string) => <Text weight="semibold" tabular>{text}</Text>
    // La carte Fin (#150, maquette C) : la Conclusion (#264) et le récap de fin de sa session (#144) fondus,
    // tirés de la roadmap et du bilan quand la session n'a pas gardé sa fiche de fin.
    const bilan = current.done && current.id ? bilanData.bilans.get(current.id) : undefined
    const conclusionDue = current.done && current.id !== undefined && (current.fait ?? '').slice(0, 10) >= bilanData.config.depuis
    const fin = finCard({ ...(storedRecap ? { recap: storedRecap } : {}), task: current, ...(bilan ? { bilan } : {}), due: conclusionDue })
    const finBox = (): RenderElement | null => {
      if (!fin) return null
      const opened = conclusionOpen === current.key
      const shown = [...fin.rows, ...(opened ? fin.more : [])].map(r => ({ ...r, fold: opened ? { md: r.md, cut: false } : foldCell(r.md) }))
      const canOpen = fin.more.length > 0 || shown.some(r => r.fold.cut)
      const tone =
        fin.ressenti === 'fluide'
          ? { bg: mixOver(palette.ok, palette.bg, MIX.smooth), fg: palette.ok }
          : fin.ressenti === 'bloqué'
            ? { bg: palette.lateTint, fg: palette.lateOn }
            : { bg: palette.sel, fg: palette.text }
      return (
        <Box key="fin-box" paddingX={SPACE.indent}>
          <Box flexDirection="column" gap={SPACE.tight} paddingX={SPACE.indent} paddingY="sm" flexGrow={1} borderStyle="round" borderColor={palette.border}>
            <Box flexDirection="row" justifyContent="space-between" alignItems="center" gap={SPACE.row}>
              <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
                {fin.emoji && <Text>{fin.emoji}</Text>}
                <Text weight="semibold">Fin</Text>
                {fin.ressenti && drawnPill({ text: fin.ressenti, ...tone, height: SIZE.pill.detail, weight: TEXT.weight.soft })}
                {fin.missing && drawnPill({ text: 'conclusion manquante', bg: palette.lateTint, fg: palette.lateOn, height: SIZE.pill.detail, weight: TEXT.weight.soft })}
              </Box>
              <Text size="caption" color={palette.text2}>{fin.when}</Text>
            </Box>
            {/* Le tableau : la colonne d'étiquettes des champs de la carte Détails, sans écart de plus, pour que
                les valeurs des deux cartes commencent au même endroit (#183) ; un trait entre les lignes. */}
            {shown.map((r, i) => (
              <Box key={`fin:${r.name}`} flexDirection="column" gap={SPACE.tight}>
                {i > 0 && Svg && <Svg source={ruleIcon(palette.border, fullWidth((e.props as { bodyColumns?: number }).bodyColumns ?? 48))} alt="séparateur" height={1} />}
                <Box key={`fin-row:${r.name}`} flexDirection="row">
                  <Box width={10} flexShrink={0}>
                    <Text color={palette.text2}>{r.name}</Text>
                  </Box>
                  <Box flexShrink={1} minWidth={0} flexGrow={1}>
                    {r.tone === 'ok' ? <Text wrap="wrap" color={palette.ok}>{r.fold.md}</Text> : <Markdown text={codeKeptWhole(r.fold.md)} {...(r.tone === 'dim' ? { dimColor: true } : {})} />}
                  </Box>
                </Box>
              </Box>
            ))}
            {canOpen &&
              moreLink('fin', opened ? 'Replier' : 'Tout voir', () => void setView($, v => ({ conclusionOpen: v.conclusionOpen === current.key ? '' : current.key })))}
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
        <Box key="launch-requested" flexDirection="row" justifyContent="center" alignItems="center" gap={SPACE.row} flexGrow={1} backgroundColor={palette.btn}>
          {corners(RADIUS.control, palette.bg)}
          <Box flexDirection="row" alignItems="center">
            {strut(SIZE.strut.control)}
            {pending ? (
              <Svg source={spinnerIcon(palette.text2, 14, undefined, false, now)} alt="lancement" width={SIZE.icon.sm} height={SIZE.icon.sm} isInteractive />
            ) : (
              <Svg source={checkIcon(palette.text2, 14)} alt="demandé" width={SIZE.icon.sm} height={SIZE.icon.sm} />
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
          gap={SPACE.row}
          flexGrow={1}
          backgroundColor={tone.bg}
          hover={{ backgroundColor: mixOver(tone.bg, tone.around, MIX.primaryHover) }}
        >
          {corners(RADIUS.control, tone.around)}
          <Box flexDirection="row" alignItems="center">
            {strut(SIZE.strut.control)}
            {Svg && <Svg source={mark} alt="icône" width={SIZE.icon.sm} height={SIZE.icon.sm} />}
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
          paddingX={SPACE.indent}
          backgroundColor={palette.btn}
          hover={{ backgroundColor: palette.btnHover, ...(scope ? { scope } : {}) }}
        >
          {corners(RADIUS.control, palette.bg)}
          {strut(SIZE.strut.control)}
          {Svg && <Svg source={mark} alt={label} width={SIZE.icon.md} height={SIZE.icon.md} />}
        </Box>,
        <Button key={key} plain label={label} onPress={onPress} />,
      )
    // La fiche (#142, maquette C) : l'en-tête Voies, la mission dans son cadre, puis les cartes que
    // l'état rend utiles (`ficheCards`), dans sa session comme au clic dans la roadmap.
    const children = allTasks.filter(x => x !== current && current.id !== undefined && x.parent === current.id)
    const links =
      prereqsFor(current).length + missingPrereqs(current, allTasks).length + unlocks.length + (current.parent !== undefined ? 1 : 0) + children.length
    const detailCount = [
      current.done,
      s.sujet !== '…',
      current.section !== '' && current.section !== 'En cours',
      stepOf,
      current.feedback,
      current.resp,
      ...Object.keys(cles).map(k => current.extra?.[k]?.length),
      current.qui,
      current.branche,
      current.due,
      current.fait,
      current.src,
      current.spec,
      fichePath ?? srcPath,
      current.ouvert,
    ].filter(Boolean).length
    const layout = ficheCards({
      context: inSession ? 'session' : 'roadmap',
      done: current.done,
      live: live !== undefined,
      blocked: holder !== undefined,
      kept: kept !== undefined,
      attend: current.attend !== undefined,
      docs: docs.length,
      branch: facts?.branch.length ?? 0,
      links,
      details: detailCount,
      editing,
    })
    // L'état en pastille : celui que Maestro voit dans sa session, celui de la session qui y travaille ailleurs.
    const ownRunning = focusBrand && ownBrand?.data.own.id !== undefined ? runningBySession.get(ownBrand.data.own.id) : undefined
    const headState: BrandTask['state'] | undefined = current.done
      ? 'done'
      : focusBrand
        ? focusBrand.maestro && ownRunning !== undefined
          ? ownRunning
            ? 'live'
            : 'wait'
          : undefined
        : live
          ? live.entry.sessionId && runningBySession.get(live.entry.sessionId) === false
            ? 'wait'
            : 'live'
          : undefined
    const headBrand = focusBrand ?? taskBrandOf(current, source, allTasks, { label: s.titre })
    // Une carte : sa légende, puis ses lignes, dans un cadre à bord fin, qui ne grandit pas au-delà du panneau (#173).
    const card = (name: string, body: RenderElement) => (
      <Box key={`card:${name}`} paddingX={SPACE.indent}>
        <Box key={`card-frame:${name}`} flexDirection="column" gap={SPACE.tight} paddingX={SPACE.indent} paddingY="xs" flexGrow={1} flexShrink={1} minWidth={0} borderStyle="round" borderColor={palette.border}>
          <Text size="caption" weight="medium" color={palette.text2}>{name}</Text>
          {body}
        </Box>
      </Box>
    )
    const cards: Record<FicheCard, () => RenderElement> = {
      avancement: () =>
        card(
          'Avancement',
          <Box flexDirection="column" gap={SPACE.block}>
            <Box flexDirection="column">
              {docs.length > 0 &&
                field(
                  'Dossier',
                  <Box flexDirection="row" gap={SPACE.row}>
                    {docs.map(d => (
                      <Button key={`focus-doc:${d.label}`} label={d.label} onPress={() => void openFile($, d.path)} />
                    ))}
                  </Box>,
                )}
              {facts &&
                facts.branch.length > 0 &&
                field(
                  'Branche',
                  <Box flexDirection="column">
                    {facts.branch.map(l => (
                      <Text key={`focus-branch:${l}`} wrap="wrap">{l}</Text>
                    ))}
                  </Box>,
                  'focus-branch',
                )}
              {field(
                'Attend',
                // Au détail, la pastille courte puis la précision entière, sur plusieurs lignes s'il le faut.
                current.attend !== undefined &&
                  (me.includes(attendWho(current.attend)) && current.attend === attendWho(current.attend) ? (
                    plain(current.attend)
                  ) : (
                    <Box flexDirection="column" gap={SPACE.tight} flexShrink={1}>
                      {me.includes(attendWho(current.attend)) ? plain(attendWho(current.attend)) : tag(shortAttend(current.attend), 'wait')}
                      {current.attend.trim() !== attendWho(current.attend) && (
                        <Text size="caption" color={palette.text2} wrap="wrap">{current.attend}</Text>
                      )}
                    </Box>
                  )),
              )}
            </Box>
            {!inSession && (
              <Box flexDirection="column" gap={SPACE.block}>
                {/* Bloquée : l'avertissement au-dessus des actions ; « Lancer » reste possible. */}
                {holder && (
                  <Box flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent} backgroundColor={palette.blockTint}>
                    {corners(RADIUS.control, palette.bg)}
                    {strut(SIZE.strut.control)}
                    {Svg ? (
                      <Svg source={lockIcon(palette.blockOn, 14, STROKE.small)} alt="bloquée" width={SIZE.icon.sm} height={SIZE.icon.sm} />
                    ) : (
                      <Text color="warning">⊘</Text>
                    )}
                    <Box flexShrink={1}>
                      <Text weight="semibold" color={palette.blockOn}>
                        {holder.parent
                          ? `Bloquée : son parent « ${short(holder.parent).titre} » attend « ${short(holder.pre).titre} ».`
                          : `Bloquée : « ${short(holder.pre).titre} » n'est pas encore faite.`}
                      </Text>
                    </Box>
                  </Box>
                )}
                {/* En session : une carte bleue, l'état et depuis quand, puis « Ouvrir la session ». */}
                {live && (
                  <Box key="live-card" flexDirection="column" gap={SPACE.block} padding="sm" borderStyle="round" borderColor={mixOver(palette.liveOn, palette.bg, MIX.sessionBorder)} backgroundColor={palette.liveTint}>
                    <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                      <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
                        {live.state === 'open' && Svg && (live.entry.sessionId && runningBySession.get(live.entry.sessionId) === false ? (
                          <Svg source={handIcon(palette.liveOn, 16)} alt="attend ta réponse" width={SIZE.icon.md} height={SIZE.icon.md} />
                        ) : (
                          <Svg source={spinnerIcon(palette.liveOn, 16, undefined, false, now)} alt="en cours" width={SIZE.icon.md} height={SIZE.icon.md} isInteractive />
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
                {kept && (
                  <Box flexDirection="row" alignItems="stretch" gap={SPACE.row}>
                    {kept && primary('open-session', externalIcon(palette.priText, 14), 'Ouvrir la session', () => void openSession($, kept.entry))}
                    {kept && action('archive-session', archiveIcon(palette.text), 'Archiver la session', () => void archiveSession($, kept.key, kept.entry))}
                  </Box>
                )}
                {live && (
                  <Box flexDirection="column" gap={SPACE.block}>
                    {/* « Marquer faite » (#73) et « Annuler la tâche » : la tâche ne s'efface pas, elle descend en
                        tête des faites, avec son bilan ; une confirmation d'abord (décisions de Bertrand du
                        2026-10-26 et du 2026-10-28). Visibles même quand une session tient la tâche : elle a pu
                        livrer sans cocher ; l'encart le rappelle. Une rangée à eux : avec « Lancer » et
                        « Vérifier », quatre boutons débordent du panneau étroit. */}
                    {!current.done && !(asking && cancelNote === CANCEL_BUSY) && (
                      <Box key="close-row" flexDirection="row" alignItems="center" gap={SPACE.row}>
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
                      <Box key="cancel-box" flexDirection="column" gap={SPACE.block} padding="sm" borderStyle="round" borderColor={palette.border}>
                        <Text weight="semibold" wrap="wrap">
                          {closeKind === 'done'
                            ? `Marquer${current.id ? ` #${current.id}` : ''} « ${s.titre} » faite ?`
                            : `Annuler${current.id ? ` #${current.id}` : ''} « ${s.titre} » ?`}
                        </Text>
                        <Text size="caption" color={palette.text2} wrap="wrap">
                          {closeCaption(closeKind, { ecriture: source.ecriture, cowork: bilanData.viaCowork })}
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
                        <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
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
                      <Box paddingX={SPACE.indent}>
                        <Text size="caption" color={palette.lateOn} wrap="wrap">{cancelNote}</Text>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Box>,
        ),
      lancer: () =>
        card(
          'Lancer',
          <Box flexDirection="column" gap={SPACE.block}>
              <Box flexDirection="row" alignItems="stretch" gap={SPACE.row}>
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
              {/* Un message en plus du brief, facultatif ; Entrée lance comme « Lancer ». Sa clé suit la
                  tâche : un message tapé pour l'une ne reste pas affiché sur une autre. */}
              {!current.done && !live && !launched.includes(taskKey(current)) && Input && (
                <Box paddingX={SPACE.indent}>
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
                waitBand(
                  'launched-note',
                  waitNote('launched'),
                  <Button
                    key="launch-again"
                    plain
                    label="Relancer"
                    onPress={() => void setView($, v => ({ launched: v.launched.filter(k => k !== taskKey(current)) }))}
                  />,
                )
              )}
              {/* La session tourne : le bloc « Session en cours » dit tout, la note de lancement se tait. */}
              {live ? null : launchNote === LAUNCHED ? (
                <Box flexDirection="row" alignItems="center" gap={SPACE.row} padding="sm" borderStyle="round" borderColor={palette.border}>
                  {icon(checkIcon(palette.ok), 'lancée', 16, '✓', 'success')}
                  <Text>{LAUNCHED}</Text>
                </Box>
              ) : (
                launchNote !== '' && launchNote !== LAUNCHING && <Text color={palette.text2}>{launchNote}</Text>
              )}
              {/* « Marquer faite » (#73) et « Annuler la tâche » : la tâche ne s'efface pas, elle descend en
                  tête des faites, avec son bilan ; une confirmation d'abord (décisions de Bertrand du
                  2026-10-26 et du 2026-10-28). Visibles même quand une session tient la tâche : elle a pu
                  livrer sans cocher ; l'encart le rappelle. Une rangée à eux : avec « Lancer » et
                  « Vérifier », quatre boutons débordent du panneau étroit. */}
              {!current.done && !(asking && cancelNote === CANCEL_BUSY) && (
                <Box key="close-row" flexDirection="row" alignItems="center" gap={SPACE.row}>
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
                <Box key="cancel-box" flexDirection="column" gap={SPACE.block} padding="sm" borderStyle="round" borderColor={palette.border}>
                  <Text weight="semibold" wrap="wrap">
                    {closeKind === 'done'
                      ? `Marquer${current.id ? ` #${current.id}` : ''} « ${s.titre} » faite ?`
                      : `Annuler${current.id ? ` #${current.id}` : ''} « ${s.titre} » ?`}
                  </Text>
                  <Text size="caption" color={palette.text2} wrap="wrap">
                    {closeCaption(closeKind, { ecriture: source.ecriture, cowork: bilanData.viaCowork })}
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
                  <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
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
                <Box paddingX={SPACE.indent}>
                  <Text size="caption" color={palette.lateOn} wrap="wrap">{cancelNote}</Text>
                </Box>
              )}
          </Box>,
        ),
      chaine: () =>
        card(
          'Chaîne',
          <Box flexDirection="column">
              {prereqsFor(current).map((x, i) => field(i === 0 ? 'Après' : '', link(x), `Après:${x.key}`))}
              {missingPrereqs(current, allTasks).map((n, i) =>
                field(i === 0 && prereqsFor(current).length === 0 ? 'Après' : '', plain(`#${n} introuvable`), `Après:#${n}`),
              )}
              {unlocks.map((d, i) => field(i === 0 ? 'Débloque' : '', link(d), `Débloque:${d.key}`))}
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
          </Box>,
        ),
      details: () =>
        card(
          'Détails',
          <Box flexDirection="column">
            {/* Close : faite (la coche verte) ou annulée (⊘). */}
            {current.done &&
              field(
                'État',
                <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
                  {abandoned ? <Text color={palette.text2}>⊘</Text> : icon(checkIcon(palette.ok, 14), 'faite', 14, '✓', 'success')}
                  <Text color={abandoned ? palette.text2 : palette.ok}>{abandoned ? 'annulée' : 'Done'}</Text>
                </Box>,
              )}
            {s.sujet !== '…' && field('Sujet', plain(s.sujet))}
              {current.section !== '' && current.section !== 'En cours' && field('Section', plain(current.section))}
              {stepOf && field('Étape', plain(`${stepOf.step} sur ${lastStep} de la chaîne`))}
              {field('Retours', current.feedback && plain(current.feedback.map(n => `#${n}`).join(', ')))}
              {/* La personne qui porte la tâche, sa mère et ses sous-tâches, les clés déclarées : montrées quand la ligne les a (#76, #176). */}
              {field(
                'Responsable',
                current.resp !== undefined && (me.includes(attendWho(current.resp)) ? plain(current.resp) : tag(shortAttend(current.resp), 'wait')),
              )}
              {Object.keys(cles).map(k =>
                field(`${k.charAt(0).toUpperCase()}${k.slice(1)}`, plain(current.extra?.[k]?.join(', ')), `cle:${k}`),
              )}
              {field('Qui', plain(current.qui))}
              {field('Branche', mono(current.branche))}
              {field(
                'Échéance',
                current.due !== undefined && (
                  <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
                    {strong(frDate(current.due))}
                    {due && current.due && tag(due.text, due.late ? 'late' : isDueSoon(current, today) ? 'soon' : 'soft')}
                  </Box>
                ),
              )}
              {field(abandoned ? 'Annulée le' : 'Faite le', current.fait !== undefined && strong(doneLabel(current.fait)))}
              {field('Source', mono(current.src))}
              {field('Spec', mono(current.spec))}
            {(fichePath || srcPath) &&
              field(
                'Fichiers',
                <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
                  {fichePath && action('open-fiche', documentIcon(palette.text), 'Fiche', () => void openFile($, fichePath))}
                  {srcPath && action('open-src', externalIcon(palette.text), 'Source', () => void openFile($, srcPath))}
                </Box>,
              )}
            {current.ouvert !== undefined &&
              field(
                'Ouverte le',
                <Box key="opened" flexDirection="row" alignItems="center" gap={SPACE.row}>
                  <Text weight="semibold" tabular>{frDate(current.ouvert)}</Text>
                  {days !== undefined && <Text color={palette.text2}>{`· ${openedLabel(days)}`}</Text>}
                </Box>,
              )}
          </Box>,
        ),
    }
    // L'édition (#161, maquette C) : un champ par ligne éditable, à côté de son étiquette ; un menu sur
    // bureau quand le projet liste ses valeurs (`—` : vide). Le refus rougit l'étiquette et se dit dessous.
    const saveBusy = editNote === SAVE_BUSY
    const editInput = (spec: EditSpec) => {
      const draftKey = `${editKey}|${spec.field}`
      const value = editDrafts.get(draftKey) ?? spec.value
      const key = `edit:${keyPart(editKey)}:${keyPart(spec.field)}`
      const onValue = (v: string) => {
        editDrafts.set(draftKey, v)
        // Le compte ne redessine qu'à son changement : la frappe ne redessine pas à chaque lettre.
        const count = editDiff(editSpecs, draftsOf(editKey)).count
        if (count !== editCount) void setView($, () => ({ editCount: count }))
      }
      if (Select && spec.options) {
        const none = '—'
        const options = [...(value === '' ? [none] : []), ...(spec.options.includes(value) || value === '' ? [] : [value]), ...spec.options]
        return (
          <Select key={key} label={spec.name} options={options.map(o => ({ value: o }))} value={value === '' ? none : value} onSelect={(v: string) => onValue(v === none ? '' : v)} />
        )
      }
      if (!Input) return <Text wrap="wrap">{value}</Text>
      return (
        <Input
          key={key}
          {...(spec.field === 'label' ? { rows: 3 } : {})}
          placeholder={spec.field === 'due' ? 'AAAA-MM-JJ' : spec.options ? spec.options.join(', ') : spec.field === 'apres' || spec.field === 'parent' ? 'N, ou -' : ''}
          value={value}
          submitLabel="enregistrer"
          onInput={onValue}
          onSubmit={(v: string) => {
            onValue(v)
            void confirmEdit($, source, current, editSpecs)
          }}
        />
      )
    }
    const editBad = (spec: EditSpec) => !saveBusy && editNote !== '' && editField === spec.field
    const editRows = (where: EditSpec['card']) => (
      <Box flexDirection="column" gap={SPACE.tight}>
        {editSpecs
          .filter(spec => spec.card === where)
          .map(spec => (
            <Box key={`edit-row:${keyPart(spec.field)}`} flexDirection="column" gap={SPACE.tight}>
              <Box flexDirection="row" alignItems="center">
                <Box width={10} flexShrink={0} flexDirection="row" alignItems="center">
                  {strut(SIZE.strut.field)}
                  <Text color={editBad(spec) ? palette.lateOn : palette.text2}>{spec.name}</Text>
                </Box>
                <Box flexGrow={1} flexShrink={1} minWidth={0}>
                  {editInput(spec)}
                </Box>
              </Box>
              {editBad(spec) && <Text size="caption" color={palette.lateOn} wrap="wrap">{editNote}</Text>}
            </Box>
          ))}
      </Box>
    )
    const editCards: Partial<Record<FicheCard, () => RenderElement>> = editing
      ? {
          avancement: () => card('Avancement', editRows('avancement')),
          chaine: () => card('Chaîne', editRows('chaine')),
          details: () => card('Détails', editRows('details')),
        }
      : {}
    const stopEditing = () => {
      clearDrafts(editKey)
      void setView($, () => ({ editing: '', editNote: '', editField: '', editCount: 0 }))
    }
    // Sous l'en-tête : « N changements » (ou le refus), Annuler, Enregistrer.
    const editBar = () => {
      const named = editSpecs.find(spec => spec.field === editField)
      const said = saveBusy
        ? 'Enregistrement…'
        : editNote !== ''
          ? named
            ? `Pas enregistré : voir ${named.name}`
            : `Pas enregistré : ${editNote}`
          : editCount === 0
            ? 'Aucun changement'
            : `${editCount} changement${editCount > 1 ? 's' : ''}`
      return (
        <Box key="edit-bar" paddingX={SPACE.indent}>
          <Box flexDirection="column" gap={SPACE.tight} paddingX={SPACE.indent} paddingY="xs" flexGrow={1} borderStyle="round" borderColor={palette.border}>
            <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                <Text size="caption" color={editNote !== '' && !saveBusy ? palette.lateOn : palette.text2} wrap="wrap">{said}</Text>
              </Box>
              <Button key="edit-cancel" plain dimColor label="Annuler" onPress={stopEditing} />
              <Button key="edit-save" variant="primary" label={saveBusy ? 'Enregistrement…' : 'Enregistrer'} onPress={() => void confirmEdit($, source, current, editSpecs)} />
            </Box>
            {(live || launched.includes(editKey)) && (
              <Text size="caption" color={palette.lateOn} wrap="wrap">Une session tient cette tâche : elle peut encore l'écrire.</Text>
            )}
            {source.ecriture && !bilanData.viaCowork && (
              <Text size="caption" color={palette.text2} wrap="wrap">{entrustedNote(source.ecriture)}</Text>
            )}
          </Box>
        </Box>
      )
    }
    // Le crayon, à droite du titre d'une ouverte (#161) : « Modifier » ferme l'encart de clôture.
    const pencil =
      !current.done && !editing
        ? action('edit-task', pencilIcon(palette.text), 'Modifier', () => {
            clearDrafts(editKey)
            void setView($, () => ({ editing: editKey, editNote: '', editField: '', editCount: 0, cancelAsk: '', cancelNote: '' }))
          })
        : undefined
    const labelSpec = editSpecs.find(spec => spec.field === 'label')
    return (
      <Box flexDirection="column" gap={SPACE.root} paddingX={SPACE.indent}>
        {/* L'en-tête Voies (#137) ; son titre ouvre la ligne dans la roadmap, sa flèche ramène à la
            roadmap entière (#165) : dans la session, la vue d'ensemble ; au clic, la liste d'où l'on vient. */}
        <Box paddingX={SPACE.indent}>
          {brandTree(
            $,
            e,
            headBrand,
            palette,
            'focus',
            today,
            headState,
            {
              key: 'open-line',
              press: () => void openFile($, current.done ? paths.done : paths.open, line),
            },
            undefined,
            false,
            pencil,
            {
              key: 'back',
              press: inSession
                ? () => void setView($, () => ({ whole: true, editing: '', editNote: '', editField: '' }))
                : select(''),
            },
          )}
        </Box>
        {/* En édition (#161) : la barre sous l'en-tête, à la place du crayon. */}
        {editing && editBar()}
        {/* La mission seule dans son cadre (#150, maquette C) : celle de la fiche de fin de sa session, sa
            ligne de la roadmap derrière « La ligne de la roadmap » ; sans, la ligne, longue coupée (#146). */}
        <Box paddingX={SPACE.indent}>
          <Box flexDirection="column" gap={SPACE.tight} paddingX={SPACE.indent} paddingY="sm" flexGrow={1} backgroundColor={palette.note}>
            {corners(RADIUS.control, palette.bg)}
            <Text size="caption" weight="medium" color={labelSpec && editBad(labelSpec) ? palette.lateOn : palette.text2}>Mission</Text>
            {labelSpec ? editInput(labelSpec) : <Text wrap="wrap">{cut?.cut && !missionShown ? cut.text : frame.text}</Text>}
            {labelSpec && editBad(labelSpec) && <Text size="caption" color={palette.lateOn} wrap="wrap">{editNote}</Text>}
            {!editing &&
              (frame.recap || cut?.cut) &&
              moreLink('mission-line', missionShown ? 'Replier' : frame.recap ? 'La ligne de la roadmap' : 'Tout voir', () =>
                void setView($, v => ({ missionOpen: v.missionOpen === current.key ? '' : current.key })),
              )}
            {!editing && frame.recap && missionShown && <Text size="caption" wrap="wrap">{current.label}</Text>}
            {!editing && noteShown && (cut ? !cut.cut || missionShown : missionShown) && <Text color={palette.text2} wrap="wrap">{noteShown}</Text>}
          </Box>
        </Box>
        {finBox()}
        {ficheSteps($, e, palette, await readSteps($, inSession ? ownBrand?.data.own.id : liveOf(current)?.entry.sessionId), now, current.done)}
        {layout.cards.map(c => (editCards[c] ?? cards[c])())}
        <Box flexDirection="column" gap={SPACE.block} paddingX={SPACE.indent}>
          {openNote !== '' && <Text size="caption" color={palette.text2}>{openNote}</Text>}
          {/* Après l'enregistrement : les avertissements du modèle (#125), ou ce qui n'est pas allé au bout. */}
          {!editing && editNote !== '' && !saveBusy && <Text size="caption" color={palette.lateOn} wrap="wrap">{editNote}</Text>}
        </Box>
      </Box>
    )
  }

  // --- Vue d'ensemble, façon carte « Context » --------------------------------
  const total = openTasks.length + doneTasks.length
  const pct = (n: number, of: number) => (of === 0 ? 0 : Math.round((n * 100) / of))

  // Un seul mode (#176) : Ma journée à l'ouverture, les sept pastilles et le filtre « Qui » partout,
  // chacun caché quand il n'a rien ; un clic sur un axe garde le filtre choisi (#99).
  const { relanceDays, cles, clesVisibles, rangerPar } = projectSettings(source)
  axisKeepsState = true
  // « Qui » dès qu'une autre personne que moi est nommée (`resp:` ou `attend:`).
  const named = peopleOf(openTasks.filter(t => matches(t, axis, 'all', me)), me)
  const people = named.some(p => !me.includes(p)) ? named : []
  // Une personne qui n'est plus dans la vue (un autre axe choisi) : tout le monde.
  const who = people.includes(whoRaw) ? whoRaw : 'all'
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
  // « Retours » : les tâches nées d'un retour de l'app, ou qui en ont reçu.
  const feedbackAll = inAxis.filter(t => t.feedback !== undefined)
  // Par défaut (#176) : les tâches en cours, sinon Ma journée, sinon toutes. Chez Maestro (#149) : Ma
  // journée, sinon les récentes.
  const maestroBrand = ownBrand?.brand.kind === 'maestro' ? ownBrand.brand : undefined
  // Le bloc « En cours » de Maestro (#160) : ses sessions qui tournent ou t'attendent, en lignes ; la
  // liste de la roadmap dessous ne les redit pas.
  const blockIds = maestroBrand ? liveBlockIds(maestroBrand.tasks) : []
  const blockOf = new Map((maestroBrand?.tasks ?? []).filter(bt => blockIds.includes(bt.id)).map(bt => [bt.id, bt]))
  const inBlock = (t: Task) => t.id !== undefined && blockOf.has(t.id)
  const blockTasks = blockIds.flatMap(id => openTasks.filter(t => t.id === id))
  const blockSteps = new Map<string, ChildStatus>()
  await Promise.all(
    [...blockOf.values()].map(async bt => {
      const found = await readSteps($, bt.sessionId)
      if (found) blockSteps.set(bt.id, found)
    }),
  )
  const attend =
    // Chez Maestro, « En cours » n'est plus un filtre (#160) : une vue gardée dessus montre toutes les tâches.
    attendRaw === 'live' && maestroBrand
      ? 'all'
      : attendRaw !== 'auto'
      ? attendRaw
      : // Les tâches qu'une session travaille, sans les bloquées : une chaîne `après:` n'ouvre pas sur « En cours ».
        openingFilter({ today: todayAll.length, live: inAxis.filter(isLive).length, recent: recentAll.length, maestro: maestroBrand !== undefined })
  // Le bloc « En cours » de Maestro (#149, #160) : dès qu'il a lancé une tâche, il remplace le filtre « En cours ».
  const maestroLine = maestroBrand !== undefined && maestroBrand.tasks.length > 0
  const mineCount = inAxis.filter(t => isMine(t, me)).length
  const thirdParties = countBy(inAxis.filter(t => !isMine(t, me)), t => (t.attend === undefined ? undefined : attendWho(t.attend)))
  const tierChosen = thirdParties.some(([who]) => who === attend)

  const shown = (
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
          : attend === 'feedback'
            ? feedbackAll
            : openTasks.filter(t => matches(t, axis, attend, me) && matchesWho(t, who, me))
  ).filter(t => !inBlock(t))
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
  // En arbre, par jour ou par sujet, le même choix dans toutes les vues ; en mode Projet, aussi par
  // échéance ou par responsable (#76). La vue que le projet déclare l'emporte ; sans elle, l'arbre,
  // mères ou pas (#168). L'échéance et le responsable seulement si la roadmap en a (#176).
  const rangeable = groupingData(openTasks)
  const by = groupingOf(groupBy, showDone, source.vue, rangeable)
  const titlesNow = titlesNote(pending, by)
  // Seules les ouvertes rangées par sujet ont des sections de sujet.
  const subjects: [string, number][] = by === 'subject' ? countBy(unsorted, groupOf) : []
  // L'arbre : ses sections, et la profondeur de chaque ligne, marquée devant son titre.
  // L'arbre garde les tâches en retard à leur place (une mère en retard garde ses filles) : pas de
  // section « En retard » à part, la pastille de retard reste sur la ligne. Sous une recherche, pas
  // d'arbre : ses résultats n'ont pas de « ↳ » (#86).
  const tree = by === 'tree' && !showDone && !searching ? byTree(sortTasks(shown, sortOrder), allTasks, t => short(t).titre, prereqsFor, today) : []

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
        paddingX={SPACE.indent}
        hover={o.onPress ? { backgroundColor: palette.hover } : undefined}
      >
        {/* Pas de coins arrondis au survol, comme les lignes de tâches : quatre Svg de moins par
            ligne (2026-10-23, un tiers des Svg d'un dessin). La marque de 16 × 24 tient la hauteur. */}
        {/* Dans un panneau étroit, c'est le nom qui se tronque : l'icône et les chiffres gardent leur place. */}
        <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={1} minWidth={0}>
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
      <Svg source={handIcon(palette.block, 14, STROKE.pill, 'Attend ta réponse')} alt="Attend ta réponse" width={SIZE.icon.sm} height={SIZE.icon.sm} isInteractive />
    ) : (
      <Text color="permission">✋</Text>
    )
  const spinner = () =>
    Svg ? (
      <Svg source={spinnerIcon(palette.live, 14, 'En cours dans une session', false, now)} alt="En cours dans une session" width={SIZE.icon.sm} height={SIZE.icon.sm} isInteractive />
    ) : (
      <Text color="suggestion">◌</Text>
    )

  // Le cadenas d'une tâche bloquée, avec son infobulle (Svg interactif).
  const lock = (title: string) =>
    // Gris : la tâche attend une autre tâche, pas toi (la main orange, elle, t'attend).
    Svg ? <Svg source={lockIcon(palette.text2, 14, STROKE.pill, title)} alt={title} width={SIZE.icon.sm} height={SIZE.icon.sm} isInteractive /> : <Text dimColor>⊘</Text>

  const rowPill = (p: Pill) => {
    const c = pillColors[p.kind]
    const mark: PillMark | undefined = p.kind === 'late' ? 'clock' : p.kind === 'wait' || p.kind === 'waitAging' || p.kind === 'waitOld' || p.kind === 'owner' ? 'person' : undefined
    return drawnPill({ text: p.text, bg: c.bg, fg: c.fg, ...(mark ? { mark } : {}), weight: c.strong ? 600 : 500 })
  }

  // Une tâche en session (#143) : la roue (ou la main qui t'attend), la mini-barre et le compte, dans une
  // colonne de largeur fixe (#145) : d'une ligne à l'autre, la roue et la barre gardent leur place et leur
  // taille, quels que soient le titre, le compte (« 2/7 », « 8/11 ») ou l'absence de note ; seule la
  // découpe de la barre change. Pas de carte au survol (#145) : la ligne la coupait ; la fiche montre les étapes.
  // Une ligne du bloc « En cours » de Maestro (#160) lit les étapes et l'attente de sa session à lui.
  // La colonne tient tout son contenu, à la largeur du plus long compte montré (#177) : jamais coupé.
  const stepsCells = rowStepsCells([...blockSteps.values(), ...rowSteps.values()].map(st => stepsView(st.steps, { now, at: st.at, closed: false }).count))
  const sessionColumn = (t: Task, block?: BrandTask) => {
    const status = block ? blockSteps.get(block.id) : rowSteps.get(taskKey(t))
    const waiting = block ? block.state === 'wait' : waitingOn(t)
    const view = status ? stepsView(status.steps, { now, at: status.at, closed: t.done }) : undefined
    const bar = status && view ? stepsBarIcon(palette, view.segments, { width: ROW_STEPS.bar, height: 4, waiting: waiting || status.question !== undefined }) : undefined
    return (
      <Box key={`steps:${t.key}`} flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0} {...(Svg ? { width: stepsCells.columns } : {})}>
        <Box width={ROW_STEPS.icon} flexShrink={0} flexDirection="row" justifyContent="center">
          {waiting ? hand() : spinner()}
        </Box>
        {Svg &&
          (bar && view ? (
            <Svg source={bar.source} alt={`étapes ${view.count}`} width={bar.width} height={bar.height} />
          ) : (
            <Svg source={`<svg xmlns="http://www.w3.org/2000/svg" width="${ROW_STEPS.bar}" height="4"/>`} alt="espace" width={ROW_STEPS.bar} height={4} />
          ))}
        <Box width={stepsCells.count} flexShrink={0} flexDirection="row" justifyContent="flex-end">
          {view && <Text size="caption" tabular color={palette.text3}>{view.count}</Text>}
        </Box>
      </Box>
    )
  }

  // Une tâche, toujours sur une ligne : carré d'axe, pastilles, titre tronqué, âge, ▶ (#149).
  // Une tâche faite : la coche, le titre et son axe à droite.
  const row = (t: Task, chain?: ChainStep, tree?: TreeMark, block?: BrandTask) => {
    const s = short(t)
    const days = age(t)
    const head = tree?.kind === 'head' ? tree : undefined
    const child = tree?.kind === 'child' ? tree : undefined
    const ghost = head?.ghost === true
    // Une marque de 16 × 24 tient la hauteur de la ligne : ni cale ni coins arrondis par ligne de
    // tâche (sur une roadmap de 120 tâches dépliées, 870 dessins figeaient le panneau).
    // Une tâche d'une chaîne : le trait et son étape font partie de la marque, un seul dessin.
    // Dans l'arbre (#168), et dans la liste des faites depuis #179, le carré de l'axe reste sur une
    // ligne faite, estompé : c'est son rond qui se coche.
    const markSource = squareRowIcon(axisHex(t.axis))
    // L'arbre par axe (#168) : la mère porte sa flèche dans son carré, une fille son coude.
    const drawn = head
      ? treeMotherRowIcon(axisHex(t.axis), head.open, palette.onAxis)
      : child
        ? treeChildRowIcon(markSource, child.last, palette.border)
        : chain
          ? chainRowIcon(markSource, chain.pos, chain.step, palette.text3, palette.text2)
          : markSource
    const markAlt = `${isAbandoned(t) ? 'annulée' : t.done ? 'faite' : t.axis}${chain ? `, étape ${chain.step}` : ''}${head ? (head.open ? ', replier' : ', déplier') : ''}`
    const mark = Svg ? (
      <Svg source={ghost || t.done ? fade(drawn, true) : drawn} alt={markAlt} width={chain || child ? 32 : 16} height={24} />
    ) : head ? (
      <Text color={axisTheme(t.axis)}>{head.open ? '⌄' : '›'}</Text>
    ) : (
      <Text color={axisTheme(t.axis)}>■</Text>
    )
    // Le rond de l'arbre (#168, système A), et d'une faite de la liste (#179) : devant le numéro. Un
    // premier clic arme la ligne et pose son encart sous elle (#179, maquette A), dont le bouton
    // rouvre, coche ou, pour une mère à filles ouvertes, « Tout clore » (#163). Un bouton du kit en
    // glyphe : aucune zone de clic de plus.
    const openKids = head ? head.block.tasks.length : 0
    const armedHere = armShown(armedOf(view), taskKey(t), now)
    const check = (tree || t.done) && !ghost && block === undefined ? (
      <Button key={`check:${t.id ?? keyPart(t.key)}`} plain onPress={() => void armCheck($, t)}>
        <Text color={armedHere ? palette.blockOn : t.done ? palette.ok : palette.text3} {...(armedHere ? { weight: 'semibold' as const } : {})}>{treeCheck(t.done)}</Text>
      </Button>
    ) : null
    const ask = check && armedHere
      ? armAsk({ task: t, title: s.titre, action: t.done ? 'reopen' : openKids > 0 ? 'family' : 'done', open: openKids, ...(source.ecriture ? { ecriture: source.ecriture } : {}), cowork: bilanData.viaCowork })
      : undefined
    const right = tree ? (t.done ? 'fait' : days === undefined ? '' : ageLabel(days)) : t.done ? axisLabel(t.axis) : days === undefined ? '' : ageLabel(days)
    // Une tâche faite dont la session reste ouverte : y retourner, ou l'archiver, d'un clic.
    const kept = sessionRows.has(taskKey(t)) ? doneSessionOf(t) : undefined
    const inSession = isLive(t) || block !== undefined
    // La session de la tâche, ouverte ou faite : son numéro y mène ; dans le bloc, celle de Maestro.
    const blockEntry = block?.sessionId ? { sessionId: block.sessionId, startedAt: now, title: block.label } : undefined
    const rowSession = liveOf(t) ?? doneSessionOf(t) ?? (blockEntry ? { entry: blockEntry } : undefined)
    // La roue l'emporte sur le cadenas : une tâche en session n'attend plus sa prérequise.
    const blocker = inSession ? undefined : blockerFor(t)
    const locked = blocker !== undefined
    const pre = blocker?.pre
    // Le ▶ lance la session de la tâche sans passer par le détail : même brief, même carte que
    // « Lancer ». Un bouton de l'app, sans zone de clic : il tient sur toutes les lignes sous
    // ZONE_LIMIT. Ni sur une tâche en session, bloquée ou déjà demandée ; sa colonne reste, vide,
    // pour garder les carrés alignés.
    const playable = !t.done && !ghost && !inSession && !locked && !launched.includes(taskKey(t))
    // Les pastilles entre le numéro et le titre : retour, échéance, attente…, puis les clés montrées
    // (#125 : département, statut… en pastilles pleines, cadenas compris ; un enfant de l'arbre ne
    // reprend pas celles de son parent).
    const feedback = !ghost && !t.done && t.feedback !== undefined
    // Les pastilles de clé, dessinées : dans l'arbre, une seule, le département, sur chaque ligne, faite
    // comprise (#163).
    const keySpecs = [
      ...(!ghost && clesVisibles && tree
        ? [treeDepartment(t, { enabled: settings.axisPill, axisFilter: axis, clesVisibles })].filter((x): x is string => x !== undefined).map(text => ({ text, bg: palette.sel, fg: t.done ? palette.text3 : palette.text2, weight: 600 as const }))
        : []),
      ...(!ghost && !t.done && clesVisibles && !tree ? keyPills(t, clesVisibles, cles, child?.parent).map(p => ({ text: p.text, bg: palette.sel, fg: palette.text2, weight: 600 as const })) : []),
    ]
    const allPills = [
      ...(feedback ? [feedbackPill()] : []),
      ...(!ghost && !inSession && !locked ? listPills(t, today, me).map(rowPill) : []),
      ...keySpecs.map(spec => drawnPill(spec)),
    ]
    // En session, la ligne tient dans la largeur (#177, #248 de Splitmybill) : une pastille qui ne laisse
    // pas sa place au titre part, avant que la colonne de session ne soit poussée hors du panneau. Ses
    // pastilles sont la Feedback et les clés (sans `listPills`), dans cet ordre. Le retrait compte les
    // marges du panneau, du cadre du bloc et de la ligne.
    const pills =
      inSession && Svg
        ? allPills.slice(
            0,
            fitRowPills({
              columns: (e.props as { bodyColumns?: number }).bodyColumns ?? 56,
              inset: 6,
              steps: stepsCells.columns,
              pills: [
                ...(feedback ? [pillIcon({ text: 'Feedback', bg: palette.waitTint, fg: palette.waitOn, weight: TEXT.weight.soft }).width] : []),
                ...keySpecs.map(spec => pillIcon(spec).width),
              ].map(pxCells),
            }).kept,
          )
        : allPills
    const number = t.id ? taskNumber(t.id, rowSession ? () => void openSession($, rowSession.entry) : undefined, check !== null) : undefined
    // Jamais dans « En cours » (#177) : le bloc de Maestro ou le filtre ; le carré d'axe suffit.
    const department = ghost ? undefined : axisPillText(t, { enabled: settings.axisPill, axisFilter: axis, live: block !== undefined || attend === 'live', groupedByAxis: (pending && by === 'subject') || (tree !== undefined && !rangerPar), clesVisibles })
    const line = (
      <Box
        key={`hit:${t.key}`}
        flexDirection="row"
        alignItems="center"
        gap={SPACE.row}
        paddingX={SPACE.indent}
        hover={{ backgroundColor: palette.hover }}
      >
        {/* Une tâche d'une chaîne, au terminal : le trait en glyphe et son étape (1 pour la tête). */}
        {(chain || child) && !Svg && (
          <Box key={`c:${t.key}`} flexDirection="row" alignItems="center" flexShrink={0}>
            <Text color={palette.text3}>{child ? (child.last ? '└' : '├') : chain?.pos === 'first' ? '┌' : chain?.pos === 'last' ? '└' : '├'}</Text>
            {chain && <Text size="caption" tabular color={palette.text2}>{String(chain.step)}</Text>}
          </Box>
        )}
        {/* La tête d'un bloc : son chevron replie le bloc, par la zone de l'en-tête quand le dessin
            en a la place, sinon par un bouton en glyphe. */}
        {/* La mère (#168) : sa flèche est dans son carré ; le carré la replie, par la zone de
            l'en-tête quand le dessin en a la place, sinon par un bouton en glyphe. */}
        {head && !(Svg && headZones) ? (
          <Button key={`group:${keyPart(head.id)}`} plain dimColor onPress={toggleGroup(head.id)}>
            {head.open ? '⌄' : '›'}
          </Button>
        ) : (
          <Box flexShrink={0}>
            {mark}
            {head && Svg && headZones && hit(`group:${head.id}`, toggleGroup(head.id), 1)}
          </Box>
        )}
        {check && <Box key={`c:${t.key}`} flexShrink={0}>{check}</Box>}
        {/* Le numéro d'abord, à sa colonne : les pastilles suivent, les numéros restent alignés. Sans
            pastille, le numéro entre dans le bloc du titre, sans écart (#156) : sur le bureau, la marge
            du bouton du titre fait l'espace d'un mot ; au terminal, sans marge, l'écart d'une cellule
            reste. Aucun élément de plus par ligne. */}
        {t.id && pills.length > 0 && number}
        {pills}
        <Box key={`lead:${t.key}`} flexDirection="row" alignItems="center" gap={graphic ? 0 : SPACE.row} flexGrow={1} flexShrink={1} minWidth={0}>
          {t.id && pills.length === 0 && number}
          <Button key={t.key} plain dimColor={ghost || (!t.done && !titled(t))} onPress={select(selectionOf(t))}>
            <Text wrap="truncate-end" {...(tree && t.done ? { strikethrough: true, color: palette.text3 } : {})}>{s.titre}</Text>
          </Button>
        </Box>
        {/* Le département (#156, maquette A) : l'axe en pastille, à droite du titre, avant l'âge ; un réglage. */}
        {department !== undefined && (
          <Box key={`axis:${t.key}`} flexShrink={0}>
            {drawnPill({ text: department, bg: palette.sel, fg: palette.text2, weight: 600 })}
          </Box>
        )}
        {/* En session : la roue ou la main qui t'attend, la barre et le compte (#143, #145), chez Maestro
            aussi, dans son bloc « En cours », sans arbre (#160). */}
        {inSession && sessionColumn(t, block)}
        {/* Le cadenas dit ce qu'il attend (#125) : « après » et le numéro de sa prérequise, ou « parent après » celui qu'attend son parent. */}
        {locked && pre && (
          <Box key={`lock:${t.key}`} flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0}>
            {lock(blocker?.parent ? `Bloquée : son parent attend ${short(pre).titre}, pas encore faite` : `Bloquée : ${short(pre).titre} n'est pas encore faite`)}
            <Text size="caption" color={palette.text2} wrap="end">{`${blocker?.parent ? 'parent ' : ''}après ${pre.id ? `#${pre.id}` : short(pre).titre}`}</Text>
          </Box>
        )}
        {kept && (
          <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0}>
            <Box key={`so:${t.key}`} flexDirection="row" alignItems="center" flexShrink={0}>
              {strut(SIZE.strut.row)}
              {Svg && <Svg source={externalIcon(palette.text2, 16)} alt="Ouvrir la session" width={SIZE.icon.md} height={SIZE.icon.md} />}
              {hit(`row-open:${taskKey(t)}`, () => void openSession($, kept.entry), 1)}
            </Box>
            <Box key={`sa:${t.key}`} flexDirection="row" alignItems="center" flexShrink={0}>
              {strut(SIZE.strut.row)}
              {Svg && <Svg source={archiveIcon(palette.text2, 16)} alt="Archiver la session" width={SIZE.icon.md} height={SIZE.icon.md} />}
              {hit(`row-archive:${taskKey(t)}`, () => void archiveSession($, kept.key, kept.entry), 1)}
            </Box>
          </Box>
        )}
        {/* L'avancement de la mère (#163) : sa barre et ses filles faites sur leur total. */}
        {head && (
          <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0}>
            {Svg ? <Svg source={progressIcon(head.block.done, head.block.total, palette.ok, palette.sel)} alt={`${head.block.done}/${head.block.total}`} width={34} height={4} /> : null}
            <Text size="caption" tabular color={palette.text2}>{`${head.block.done}/${head.block.total}`}</Text>
          </Box>
        )}
        {!head && !kept && !inSession && !locked && right !== '' && (
          <Box flexShrink={0}>
            <Text size="caption" tabular color={palette.text2} wrap="end">
              {right}
            </Text>
          </Box>
        )}
        {/* Le ▶ au bout de la ligne, à la place du chevron (#149) : le titre ouvre la fiche. */}
        {!t.done && (
          <Box key={`p:${t.key}`} width={3} flexShrink={0} flexDirection="row" justifyContent="center">
            {playable && (
              <Button key={`play:${t.key}`} plain dimColor onPress={() => void launchSession($, source, t, s.titre)}>
                ▶
              </Button>
            )}
          </Box>
        )}
      </Box>
    )
    if (ask === undefined) return line
    // L'encart de la ligne armée (#179, maquette A, celui de « Tout clore ») : la question, ce qui va
    // s'écrire, puis le bouton qui le fait et « Annuler ». Une carte au filet orange sur le fond du
    // panneau, sans aplat ; la ligne armée n'a plus de fond, seul son rond dit l'armement (#184, maquette C).
    return (
      <Box key={`armed:${t.key}`} flexDirection="column">
        {line}
        <Box key={`ask:${t.key}`} flexDirection="column" gap="xs" marginLeft={SPACE.nest} paddingX={SPACE.indent} paddingY="xs" borderStyle="round" borderColor={palette.block}>
          <Text size="footnote" weight="semibold" color={palette.blockOn} wrap="wrap">{ask.question}</Text>
          <Text size="caption" color={palette.text2} wrap="wrap">{ask.detail}</Text>
          <Box flexDirection="row" gap={SPACE.row}>
            <Button key="arm-confirm" variant="primary" label={ask.button} onPress={() => void checkTask($, source, t, openKids)} />
            <Button key="arm-cancel" label="Annuler" onPress={() => void disarm($)} />
          </Box>
        </Box>
      </Box>
    )
  }

  // Une section repliable : chevron, nom, et à droite le compte (et le disque rouge d'« En retard »).
  // `shownRows` : les lignes que le budget du dessin lui laisse ; au-delà, « Voir les N autres ».
  // `id` tient l'état de la section (dépliée, repliée, « Voir les N autres ») ; `name` est son libellé.
  const section = (id: string, name: string, tasks: Task[], shownRows: number, lead?: RenderElement, mark?: RenderElement, block?: TreeBlock, bare = false) => {
    const isOpen = bare || isOpenGroup(id)
    const rest = tasks.length - shownRows
    // Une suite de tâches seules d'une section d'axe (#168) : sans en-tête, toujours dépliée.
    if (bare) {
      return (
        <Box key={`section:${id}`} flexDirection="column">
          {tasks.slice(0, shownRows).map(t => row(t, undefined, { kind: 'alone' }))}
          {rest > 0 && (
            <Box key={`more-row:${id}`} flexDirection="row" paddingX={SPACE.indent} paddingLeft={SPACE.nest}>
              <Button
                key={`more:${keyPart(id)}`}
                plain
                dimColor
                label={shownRows === 0 ? `Voir les ${rest} tâches` : `Voir les ${rest} autres`}
                onPress={() => void setView($, v => ({ moreGroups: v.moreGroups.includes(id) ? v.moreGroups : [...v.moreGroups, id] }))}
              />
            </Box>
          )}
        </Box>
      )
    }
    // Un bloc de l'arbre (#163 ; #168, maquettes de Bertrand) : la mère en tête, une seule fois, au
    // niveau des tâches seules, sa flèche dans son carré, son rond et son avancement ; « Tout clore »
    // dessous quand son rond est armé (l'encart de la ligne, #179) ; ses filles, ouvertes et faites, par rang, un cran à droite,
    // reliées par leur coude.
    if (block?.head) {
      const mother = block.head
      const shown = tasks.slice(0, shownRows)
      return (
        <Box key={`section:${id}`} flexDirection="column" paddingTop="xs">
          <Box key={`hit:group:${id}`} flexDirection="column">
            {row(mother, undefined, { kind: 'head', id, open: isOpen, ghost: block.ghost, block })}
          </Box>
          {isOpen && (
            <Box flexDirection="column" paddingBottom="sm">
              {shown.map((t, i) => row(t, undefined, { kind: 'child', last: i === shown.length - 1 && rest <= 0, parent: mother }))}
              {rest > 0 && (
                <Box key={`more-row:${id}`} flexDirection="row" paddingX={SPACE.indent} paddingLeft={SPACE.nest}>
                  <Button
                    key={`more:${keyPart(id)}`}
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
    return (
      <Box key={`section:${id}`} flexDirection="column" paddingTop="xs">
        <Box
          key={`hit:group:${id}`}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingX={SPACE.indent}
          hover={{ backgroundColor: palette.hover }}
        >
          <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={1} minWidth={0}>
            {/* Le chevron dessiné sur 16 × 24, aligné sur le carré des lignes : il tient seul la hauteur. */}
            {Svg ? (
              <Box flexDirection="row" alignItems="center" flexShrink={0}>
                <Svg source={rowMark(chevronIcon(palette.text3, isOpen))} alt={isOpen ? 'replier' : 'déplier'} width={16} height={24} />
              </Box>
            ) : (
              <Button key={`group:${keyPart(id)}:chevron`} plain dimColor onPress={toggleGroup(id)}>
                {isOpen ? '⌄' : '›'}
              </Button>
            )}
            {mark}
            {headZones ? <Text wrap="truncate-end">{name}</Text> : <Button key={`group:${keyPart(id)}`} plain label={name} onPress={toggleGroup(id)} />}
          </Box>
          <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0}>
            {lead}
            {/* Le compte en petite pastille arrondie, d'un gris discret (choix de Bertrand, 2026-10-22). */}
            {Svg ? (
              drawnPill({ text: String(tasks.length), bg: mixOver(palette.sel, palette.bg, MIX.countBg), fg: palette.text2, weight: TEXT.weight.soft, size: TEXT.count, height: SIZE.pill.count })
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
              // Les tâches seules de l'arbre (#163) : la ligne « Le fil », sa case et son seul département.
              return tasks.slice(0, shownRows).map(t => (block ? row(t, undefined, { kind: 'alone' }) : row(t, chains.get(t))))
            })()}
            {rest > 0 && (
              <Box key={`more-row:${id}`} flexDirection="row" paddingX={SPACE.indent} paddingLeft={SPACE.nest}>
                <Button
                  key={`more:${keyPart(id)}`}
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
  const foundOpen = searching ? sortTasks(searchTasks(openTasks.filter(t => !inBlock(t)), search, titleOf), sortOrder) : []
  const foundDone = searching
    ? searchTasks(doneTasks, search, titleOf).sort((a, b) => (b.fait ?? '').localeCompare(a.fait ?? ''))
    : []
  const foundCount = foundOpen.length + foundDone.length
  const foundShown = foundOpen.slice(0, SEARCH_MAX)
  const foundDoneShown = foundDone.slice(0, Math.max(0, SEARCH_MAX - foundShown.length))

  // L'arbre, rangé en bandes par la valeur de `ranger_par` (#125) : une bande par valeur, les blocs
  // sous la valeur de leur tête, les tâches seules coupées par bande. Une bande se replie à part.
  // Sans `ranger_par`, l'arbre se range par axe (#168) : une bande par axe, dans l'ordre de la
  // légende, la flèche dans son carré ; dedans, les mères et les suites de tâches seules, triées
  // en C (`axisTree`) ; une suite de seules est un groupe sans en-tête (`bare`).
  type ListGroup = { key?: string; name: string; tasks: Task[]; lead?: RenderElement; mark?: RenderElement; block?: TreeBlock; band?: { count: number; lead?: RenderElement; axis?: string }; under?: string; bare?: boolean }
  const bandValue = (t: Task) => (rangerPar ? t.extra?.[rangerPar]?.[0] : undefined)
  const aloneBlock = (key: string, tasks: Task[]): TreeBlock => ({ key, label: '', ghost: false, tasks, rank: new Map(), done: 0, total: 0, doneTasks: [], closed: false })
  const treeGroups: ListGroup[] = !rangerPar
    ? axisTree(tree, order, isLive).flatMap(sec => {
        const id = `axe:${sec.axis}`
        const out: ListGroup[] = [{ key: id, name: axisLabel(sec.axis), tasks: [], band: { count: sec.count, axis: sec.axis } }]
        let run: Task[] = []
        const flush = () => {
          if (run.length === 0) return
          const key = `${id}:seules:${out.length}`
          out.push({ key, name: '', tasks: run, block: aloneBlock(key, run), under: id, bare: true })
          run = []
        }
        for (const it of sec.items) {
          if (it.kind === 'alone') run.push(it.task)
          else {
            flush()
            out.push({ key: it.block.key, name: it.block.label, tasks: treeSteps(it.block), block: it.block, under: id })
          }
        }
        flush()
        return out
      })
    : bandsOf(
        tree.flatMap(g =>
          g.head
            ? [{ block: g, value: bandValue(g.head) }]
            : bandsOf(g.tasks, bandValue, [], '').map(b => ({
                block: { ...g, key: `${g.key}:${b.items[0] ? (bandValue(b.items[0]) ?? '-') : '-'}`, tasks: b.items },
                value: b.items[0] ? bandValue(b.items[0]) : undefined,
              })),
        ),
        u => u.value,
        cles[rangerPar] ?? [],
        `Sans ${rangerPar}`,
      ).flatMap(band => {
        const id = `bande:${band.label}`
        const count = band.items.reduce((n, u) => n + (u.block.head && !u.block.ghost ? 1 : 0) + u.block.tasks.length, 0)
        return [
          { key: id, name: band.label, tasks: [], band: { count } },
          ...band.items.map(u => ({ key: u.block.key, name: u.block.label, tasks: u.block.head ? treeSteps(u.block) : u.block.tasks, block: u.block, under: id })),
        ]
      })
  const bandOpen = (id: string) => !closedGroups.includes(id)
  const toggleBand = (id: string) => () => void setView($, v => ({ closedGroups: toggleIn(v.closedGroups, id) }))
  const bandRow = (id: string, name: string, count: number, lead?: RenderElement, axisOf?: string) => (
    <Box key={`band:${id}`} flexDirection="row" justifyContent="space-between" alignItems="center" paddingX={SPACE.indent} paddingTop="sm">
      {/* Une section d'axe (#168) : la flèche dans le carré de l'axe, aligné sur ceux des lignes ; le carré et le nom la replient. */}
      {axisOf !== undefined && Svg ? (
        <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={1} minWidth={0}>
          <Box flexShrink={0}>
            <Svg source={axisBandIcon(axisHex(axisOf), bandOpen(id), palette.onAxis)} alt={bandOpen(id) ? 'replier' : 'déplier'} width={16} height={24} />
            {headZones && hit(`band:${id}`, toggleBand(id), 1)}
          </Box>
          <Button key={`bande:${keyPart(name)}`} plain label={name} onPress={toggleBand(id)} />
        </Box>
      ) : (
        <Button key={`bande:${keyPart(name)}`} plain label={`${bandOpen(id) ? '⌄' : '›'} ${name}`} onPress={toggleBand(id)} />
      )}
      <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0}>
        {lead}
        {countPill(count, false, palette.text2)}
      </Box>
    </Box>
  )

  // Les groupes de la liste : « En retard » d'abord, puis les sujets ; les faites par jour.
  // `key` suit l'état d'une section quand son libellé bouge (l'avancement d'un arbre) ; sans lui, son nom.
  const allGroups: ListGroup[] = searching
    ? [
        ...(foundShown.length > 0 ? [{ name: 'Ouvertes', tasks: foundShown }] : []),
        ...(foundDoneShown.length > 0 ? [{ name: 'Done', tasks: foundDoneShown }] : []),
      ]
    : showDone
    ? by === 'subject'
      ? doneBySubject()
      : doneByDay(doneShown, today).map(day => ({ name: day.label, tasks: day.tasks }))
    : attend === 'relaunch'
    ? // À relancer (#99) : les attentes les plus vieilles en haut.
      [{ name: 'À relancer', tasks: [...shown].sort((x, y) => (waitDays(y, today, me) ?? 0) - (waitDays(x, today, me) ?? 0)) }]
    : attend === 'today' && by === 'tree'
    ? // Ma journée en arbre (#125) : ses sections en bandes, et dans chacune les blocs de ses tâches,
      // leur parent en gris ; la clé d'un bloc porte sa section (un parent peut être dans deux).
      todaySections(sortTasks(shown, sortOrder), today, me).flatMap(g => {
        const id = `jour:${g.label}`
        const lead = g.label === 'En retard' ? icon(discIcon(palette.late), 'en retard', 16, '●', 'error') : undefined
        return [
          { key: id, name: g.label, tasks: [], band: { count: g.tasks.length, ...(lead ? { lead } : {}) } },
          ...byTree(g.tasks, allTasks, t => short(t).titre, prereqsFor).map(b => ({ key: `${id}:${b.key}`, name: b.label, tasks: b.tasks, block: b, under: id })),
        ]
      })
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
        ...treeGroups,
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
  // Les groupes d'une bande repliée ne se dessinent pas, et ne prennent rien au budget.
  const groups = allGroups.filter(g => g.under === undefined || bandOpen(g.under))
  // Dans l'arbre par axe, la bande tait la pastille d'axe : le budget plein (#168).
  let budget = settings.axisPill && attend !== 'live' && !showDone && !clesVisibles?.length && axis === 'all' && (by !== 'tree' || rangerPar) ? ROW_BUDGET_AXIS_PILL : ROW_BUDGET
  const rowsOf = new Map<string, number>()
  const idOf = (g: { key?: string; name: string }) => g.key ?? g.name
  for (const g of groups) {
    if (!g.bare && !isOpenGroup(idOf(g))) continue
    const n = moreGroups.includes(idOf(g)) ? g.tasks.length : Math.min(g.tasks.length, Math.max(budget, 0))
    rowsOf.set(idOf(g), n)
    budget -= n
  }
  // La tête d'un bloc de l'arbre est une ligne de tâche dessinée, comme ses enfants (#125).
  const drawnTasks = groups.flatMap(g => [...(g.block?.head ? [g.block.head] : []), ...g.tasks.slice(0, rowsOf.get(idOf(g)) ?? 0)])
  // Les sections qui se déplient, celles des bandes repliées comprises. Un arbre sans mère (#168) :
  // « Tout replier » replie ses bandes d'axe ; avec des mères, il ne replie qu'elles (#163).
  const names = allGroups.filter(g => !g.band && !g.bare).map(idOf)
  const bandIds = by === 'tree' && !searching && !showDone && names.length === 0 ? allGroups.filter(g => g.band).map(idOf) : []
  // Les mères de l'arbre (#163) : « Tout replier » les ferme toutes, « Tout déplier » les rouvre.
  const motherKeys = by === 'tree' && !searching && !showDone ? groups.filter(g => g.block?.head !== undefined).map(idOf) : []
  const mothersOpen = motherKeys.some(isOpenGroup)
  const allOpen = bandIds.length > 0 ? bandIds.every(b => !closedGroups.includes(b)) : names.length > 0 && names.every(n => openGroups.includes(n))
  const action = searching
    ? { label: 'Effacer', run: () => void update($, searchAtom, () => '') }
    : filtered
    ? { label: 'Tout afficher', run: showAll }
    : allOpen
      ? {
          label: 'Tout replier',
          run: () => void setView($, v => ({ openGroups: [], moreGroups: [], closedGroups: [...v.closedGroups.filter(c => !bandIds.includes(c)), ...bandIds] })),
        }
      : { label: 'Tout déplier', run: () => void setView($, v => ({ openGroups: names, closedGroups: v.closedGroups.filter(c => !bandIds.includes(c)) })) }

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
  // « À traiter » (#115, maquette C) : quatre lignes (trois en mode Code, #130) du gabarit des axes,
  // une icône de trait dans la couleur de la ligne ; la choisie prend sa teinte, son encre et une pastille pleine. Au terminal, des boutons.
  const countOf: Record<string, number> = {
    all: inAxis.filter(t => !inBlock(t)).length,
    today: todayAll.length,
    late: lateAll.length,
    soon: soonAll.length,
    relaunch: relaunchAll.length,
    live: liveAll.length,
    feedback: feedbackAll.length,
    recent: recentAll.length,
    mine: mineCount,
    others: inAxis.length - mineCount,
  }
  const tones = {
    live: { hex: palette.live, tint: palette.liveTint, on: palette.liveOn },
    late: { hex: palette.late, tint: palette.lateTint, on: palette.lateOn },
    block: { hex: palette.block, tint: palette.blockTint, on: palette.blockOn },
    wait: { hex: palette.wait, tint: palette.waitTint, on: palette.waitOn },
    // « Toutes » (#160) : choisie, le gris de la sélection et l'encre du texte.
    neutral: { hex: palette.text2, tint: palette.sel, on: palette.text },
  }
  // Sous les faites, les pastilles restent, estompées : un clic revient aux ouvertes, filtrées (#152).
  // Un seul mode (#176, maquette A) : une pastille à 0 se cache, sauf choisie (un clic la retire) ; « Toutes » reste.
  const todo = todoCounters(maestroLine).filter(c => c.key === 'all' || (countOf[c.key] ?? 0) > 0 || attend === c.key)
  // Une ligne à 0 ne se clique plus, sauf choisie : un second clic la retire.
  const todoClickable = (c: TodoCounter) => (countOf[c.key] ?? 0) > 0 || attend === c.key
  const todoRow = (c: TodoCounter) => {
    const n = countOf[c.key] ?? 0
    const on = attend === c.key
    const zero = n === 0 && !on
    const tone = tones[c.tone]
    if (!graphic) {
      return zero ? (
        <Text key={`count:${c.key}`} color={palette.text3}>{`${c.name} 0`}</Text>
      ) : (
        <Button key={`attend:${c.key}`} plain dimColor={anyState && !on} label={`${c.name} ${n}`} onPress={setAttend(c.key)} />
      )
    }
    // Une pastille par filtre (#149, maquette C′) : l'icône, le nom et le compte ; la choisie à la teinte de son ton.
    const pill = filterPillIcon({
      icon: c.icon,
      name: c.name,
      n,
      ink: faded(zero ? palette.text3 : on ? tone.on : palette.text, showDone),
      bg: on ? tone.tint : palette.btn,
      countInk: faded(on ? tone.on : zero ? palette.text3 : palette.text2, showDone),
      strong: on,
    })
    return (
      <Box key={`hit:attend:${c.key}`} flexDirection="row" flexShrink={0}>
        <Svg source={pill.source} alt={`${c.name} : ${n}`} width={pill.width} height={pill.height} />
        {todoClickable(c) && hit(`attend:${c.key}`, setAttend(c.key))}
      </Box>
    )
  }
  // « Plus de filtres » (#115) : les autres filtres non vides, et le menu « Qui » (#176). Il
  // reste ouvert tant qu'un de ses filtres, un tiers ou une personne est choisi.
  // Un filtre choisi garde sa ligne à 0, comme une ligne de « À traiter » : un clic le retire.
  const secondary = showDone ? [] : secondaryFilters(maestroLine).flatMap(k => states.filter(st => st.key === k && (st.n > 0 || attend === k)))
  const moreForced = secondaryFilters(maestroLine).includes(attend) || tierChosen || who !== 'all'
  const moreOpen = moreFilters || moreForced
  // Ouvert de force, le clic ne change rien : ni l'affichage, ni l'état caché.
  const toggleMore = () => {
    if (!moreForced) void setView($, v => ({ moreFilters: !(v.moreFilters ?? false) }))
  }
  const WHO_ALL = 'Tout le monde'
  const whoLabel = who === 'all' ? WHO_ALL : who
  const setWho = (v: string) => void setView($, () => ({ who: v === WHO_ALL ? 'all' : v, closedGroups: [], moreGroups: [] }))
  const whoOptions = [WHO_ALL, ...people]
  const moreRow = graphic && Svg ? (
    (() => {
      const label = moreOpen ? 'Moins ‹' : 'Plus ›'
      const p = pillIcon({ text: label, bg: palette.bg, fg: palette.text2, height: SIZE.pill.axis, size: TEXT.axis, weight: TEXT.weight.soft })
      return (
        <Box key="hit:more-filters" flexDirection="row" flexShrink={0}>
          <Svg source={p.source} alt="Plus de filtres" width={p.width} height={p.height} />
          {hit('more-filters', toggleMore)}
        </Box>
      )
    })()
  ) : (
    <Button key="more-filters" plain dimColor label={`Plus de filtres ${moreOpen ? '▾' : '▸'}`} onPress={toggleMore} />
  )
  const moreBody = (
    <Box flexDirection="column">
      {secondary.map(st => (
        <Box key={`more:${st.key}`} flexDirection="row" justifyContent="space-between" alignItems="center" paddingLeft={SPACE.nest} paddingRight={SPACE.indent}>
          <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={1} minWidth={0}>
            <Box flexDirection="row" alignItems="center" flexShrink={0}>
              {st.mark(anyState && !stateOn(st.key))}
            </Box>
            <Button key={`attend:${st.key}`} plain dimColor={anyState && !stateOn(st.key)} label={st.name} onPress={setAttend(st.key)} />
          </Box>
          <Box width={numCol} justifyContent="flex-end" flexShrink={0}>
            {countPill(st.n, anyState && !stateOn(st.key), palette.text2)}
          </Box>
        </Box>
      ))}
      {people.length > 0 && (
        <Box flexDirection="row" alignItems="center" paddingLeft={SPACE.nest} paddingTop="xs">
          {Select ? (
            <Select key="who" label="Qui" options={whoOptions.map(value => ({ value }))} value={whoLabel} onSelect={(v: string) => setWho(v)} />
          ) : (
            <Button
              key="who"
              plain
              label={`Qui : ${whoLabel} ▸`}
              onPress={() => setWho(whoOptions[(whoOptions.indexOf(whoLabel) + 1) % whoOptions.length] ?? WHO_ALL)}
            />
          )}
        </Box>
      )}
    </Box>
  )
  // Les filtres en une rangée de pastilles (#149), « Plus › » au bout ; ses filtres dépliés dessous.
  const todoBlock = (
    <Box flexDirection="column" gap={SPACE.tight}>
      <Box flexDirection="row" flexWrap="wrap" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent}>
        {todo.map(todoRow)}
        {secondary.length > 0 || people.length > 0 ? moreRow : null}
      </Box>
      {moreOpen && moreBody}
    </Box>
  )
  // Les zones de clic de ce dessin : légende, roue et « À traiter », puis les en-têtes de section s'il reste de la place.
  if (graphic) sessionRows = new Set(doneTasks.filter(t => doneSessionOf(t) !== undefined).slice(0, SESSION_ROWS).map(taskKey))
  // Seules les lignes cliquables de « À traiter » ont une zone ; les filtres repliés sont des boutons de l'app (#115).
  // Les axes toujours dépliés (#160) : plus de ligne repliée (#149) ; les faites s'ouvrent par le lien de l'en-tête (#152).
  // Les zones fixes : le compte des faites, les axes, le chevron du bloc « En cours », la roue, les
  // pastilles cliquables et « Plus › » (#115), les boutons de session des faites.
  const liveOpen = !(view.liveFolded ?? false)
  const fixedZones = 1 + axes.length + (blockTasks.length > 0 ? 1 : 0) + 1 + todo.filter(todoClickable).length + (todoBlock && (secondary.length > 0 || people.length > 0) ? 1 : 0) + 2 * sessionRows.size
  if (graphic) {
    // Les lignes du bloc « En cours » de Maestro d'abord (#160) : leur numéro ouvre leur session.
    const shownWithSession = [...(liveOpen ? blockTasks : []), ...drawnTasks.filter(t => t.id && (liveOf(t) ?? doneSessionOf(t)))]
    numberZones = new Set(shownWithSession.slice(0, Math.max(0, ZONE_LIMIT - fixedZones)).map(t => t.id as string))
  }
  headZones = graphic && fixedZones + numberZones.size + groups.filter(g => !g.bare).length <= ZONE_LIMIT

  // Le bloc « En cours » de Maestro (#160, maquette A) : encadré, en tête des filtres, ses sessions en
  // lignes de la liste (roue ou main, barre, compte) ; toujours là, quels que soient filtre, axe ou recherche.
  // Son chevron, centré sur le titre, le replie.
  const toggleLive = () => void setView($, v => ({ liveFolded: !(v.liveFolded ?? false) }))
  const liveBlock =
    blockTasks.length > 0 ? (
      <Box flexDirection="column" borderStyle="round" borderColor={palette.border} paddingY="xs">
        <Box key="hit:live-fold" flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent} hover={{ backgroundColor: palette.hover }}>
          {graphic && Svg ? (
            <Box flexDirection="row" alignItems="center" flexShrink={0}>
              <Svg source={rowMark(chevronIcon(palette.text3, liveOpen))} alt={liveOpen ? 'replier' : 'déplier'} width={16} height={24} />
            </Box>
          ) : (
            <Button key="live-fold" plain dimColor label={liveOpen ? '⌄' : '›'} onPress={toggleLive} />
          )}
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            <Text weight="semibold">En cours</Text>
          </Box>
          <Box flexShrink={0}>
            {drawnPill({ text: `${blockTasks.length} session${blockTasks.length > 1 ? 's' : ''}`, bg: palette.liveTint, fg: palette.liveOn, weight: TEXT.weight.soft })}
          </Box>
          {graphic && hit('live-fold', toggleLive)}
        </Box>
        {liveOpen && blockTasks.map(t => row(t, undefined, undefined, blockOf.get(t.id as string)))}
      </Box>
    ) : null

  // L'en-tête Roadmap de la session (#127), au-dessus de l'avancement.
  const brandHead = await paneBrand($, e, ownBrand, today, view.stepsPin ?? '', now)
  // Le kit n'a pas de zIndex : un absolu se peint sous ses frères suivants (#145). L'en-tête, qui porte la
  // carte d'étapes de Maestro, vient donc en dernier dans l'arbre, remis en haut par la colonne renversée.
  const page = (body: RenderElement) =>
    brandHead ? (
      <Box flexDirection="column-reverse" gap={SPACE.root} paddingX={SPACE.indent}>
        {body}
        {brandHead}
      </Box>
    ) : (
      body
    )
  const bodyPad = brandHead ? {} : { paddingX: SPACE.indent }
  // L'avancement et sa barre font un seul bloc : la barre colle aux chiffres. La liste et le tableau le partagent.
  const tight = ((e.props as { bodyColumns?: number }).bodyColumns ?? 76) < 40
  const head = (
      <Box flexDirection="column">
      {/* Deux éléments : le pourcentage à gauche, « N Done » à droite (#174) (#162, la roue est descendue dans le pied). */}
      <Box key="pane-head" flexDirection="row" justifyContent="space-between" alignItems="flex-end" paddingX={SPACE.indent}>
        {Svg ? (
          (() => {
            const big = percentIcon(`${pct(doneTasks.length, total)} %`, palette.text)
            return <Svg source={big.source} alt={`${pct(doneTasks.length, total)} %`} width={big.width} height={big.height} />
          })()
        ) : (
          <Text size="title" weight="semibold" tabular>{`${pct(doneTasks.length, total)} %`}</Text>
        )}
        {/* Toujours sur une ligne, sans l'heure de lecture (retirée, 2026-10-22) ; forme courte si très étroit. */}
        {/* « N Done » (#174) est le lien vers les faites (#152, maquette C) : souligné, en gras une fois choisi. */}
        <Box key="hit:done-count" flexDirection="row" flexShrink={1} minWidth={0} marginLeft={1} hover={{ backgroundColor: palette.hover }}>
          {graphic && (
            <Text size="caption" tabular underline color={showDone ? palette.text : palette.text2} weight={showDone ? 'semibold' : undefined} wrap="truncate-end">
              {tight ? `${doneTasks.length}` : `${doneTasks.length} Done`}
            </Text>
          )}
          {graphic && <Text size="caption" tabular color={palette.text2} wrap="truncate-end">{tight ? `/${total}` : ` sur ${total}`}</Text>}
          {!graphic && (
            <Button key="done-count" plain dimColor={!showDone} label={tight ? `${doneTasks.length}/${total}` : `${doneTasks.length} Done sur ${total}`} onPress={toggleDone} />
          )}
          {hit('done-count', toggleDone)}
        </Box>
      </Box>

      <Box paddingX={SPACE.indent} paddingY="xs" justifyContent="center">
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
  )
  return page(
    <Box flexDirection="column" gap={SPACE.root} {...bodyPad}>
      {head}

      {titlesNow && <Box paddingX={SPACE.indent}>{waitBand('titles-note', titlesNow)}</Box>}

      {/* Les axes toujours dépliés (#160) ; les faites s'ouvrent par « N faites » de l'en-tête (#152). */}
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
      </Box>

      {liveBlock}

      {todoBlock}

      <Box flexDirection="column" gap={SPACE.block}>
        {Svg && <Svg source={ruleIcon(palette.border, wide)} alt="séparateur" height={1} />}
        {/* La recherche, qui filtre à la frappe, et le menu « Ranger » qui montre le rangement en cours (#115). */}
        <Box flexDirection="row" alignItems="center" gap={SPACE.textButtons} paddingX={SPACE.indent}>
          {/* Un numéro (« 47 », « #47 ») ou des mots du libellé, ouvertes et faites. */}
          {Input && (
            <Box flexGrow={1} flexShrink={1} minWidth={0}>
              <Input
                key="search"
                placeholder="Rechercher : mots ou #numéro"
                value={search}
                submitLabel="↵"
                onInput={(value: string) => void update($, searchAtom, () => value)}
                onSubmit={(value: string) => void update($, searchAtom, () => value)}
              />
            </Box>
          )}
          {!Input && <Box flexGrow={1} />}
          {/* Un menu ou un bouton de l'app, pas une zone de clic : il ne compte pas dans ZONE_LIMIT. Sur
              mobile, sans menu, le bouton montre le rangement en cours et passe au suivant. */}
          <Box flexShrink={0}>
            {Select ? (
              <Select
                key="group-by"
                label="Ranger"
                options={(groupings(rangeable, showDone).includes(by) ? groupings(rangeable, showDone) : [by, ...groupings(rangeable, showDone)]).map(g => ({ value: groupingLabel(g) }))}
                value={groupingLabel(by)}
                onSelect={(v: string) => {
                  const g = [by, ...groupings(rangeable, showDone)].find(x => groupingLabel(x) === v)
                  if (g) void setView($, () => ({ groupBy: g }))
                }}
              />
            ) : (
              <Button
                key="group-by"
                plain
                label={groupingLabel(by)}
                onPress={() => void setView($, () => ({ groupBy: nextGrouping(by, rangeable, showDone) }))}
              />
            )}
          </Box>
        </Box>
        {/* La ligne de la liste, discrète : ce qui est montré, et une seule action selon le cas. */}
        <Box flexDirection="row" justifyContent="space-between" alignItems="center" paddingX={SPACE.indent}>
          <Text size="caption" color={palette.text2} wrap="truncate-end">
            {searching
              ? `${foundCount} résultat${foundCount > 1 ? 's' : ''}${foundCount > SEARCH_MAX ? ` (${SEARCH_MAX} affichés)` : ''}`
              : filterSummary({ axis, attend, showDone, shown: shown.length, doneShown: doneShown.length, groupBy: by, who })}
          </Text>
          {/* En arbre sous un filtre (#163, choix de Bertrand) : replier ou déplier d'un coup toutes les
              mères, à côté de « Tout afficher » ; hors filtre, l'action de la liste le fait déjà. */}
          {motherKeys.length > 0 && filtered ? (
            <Box flexDirection="row" gap={SPACE.row} flexShrink={0}>
              <Button
                key="tree-fold"
                plain
                dimColor
                label={mothersOpen ? 'Tout replier' : 'Tout déplier'}
                onPress={() => void setView($, v => foldAllView(v, filtered, motherKeys, !mothersOpen))}
              />
              <Button key="list-action" plain dimColor label={action.label} onPress={action.run} />
            </Box>
          ) : (
            <Box flexShrink={0}>
              <Button key="list-action" plain dimColor label={action.label} onPress={action.run} />
            </Box>
          )}
        </Box>
      </Box>

      {titleNote !== '' && <Text color={palette.text2}>{titleNote}</Text>}
      {scanNote !== '' && <Text color={palette.text2}>{scanNote}</Text>}
      {searching && foundCount === 0 && <Text color={palette.text2}>Aucune tâche ne correspond.</Text>}
      {!searching && !showDone && shown.length === 0 && (
        <Text color={palette.text2}>{attend === 'today' ? "Rien d'urgent aujourd'hui." : 'Aucune tâche ouverte pour ce filtre.'}</Text>
      )}

      <Box flexDirection="column">{groups.map(g => (g.band ? bandRow(idOf(g), g.name, g.band.count, g.band.lead, g.band.axis) : section(idOf(g), g.name, g.tasks, rowsOf.get(idOf(g)) ?? 0, g.lead, g.mark, g.block, g.bare)))}</Box>

      {/* Le pied (#138, puis #162, maquette B) : la roue des réglages, la version de cette session, et à droite
          « Rafraîchir », qui relit tout et la compare à la publiée, « Recharger » quand seule la session retarde, ou « Mettre à jour » quand l'app retarde sur le catalogue local (#178). */}
      <Box flexDirection="column" gap="xs">
        {Svg && <Svg source={ruleIcon(palette.border, wide)} alt="séparateur" height={1} />}
        <Box key="pane-foot" flexDirection="row" justifyContent="space-between" alignItems="center" paddingX={SPACE.indent}>
          <Box flexDirection="row" alignItems="center" flexShrink={1} minWidth={0}>
            {/* La roue (#115), au terminal le bouton « Réglages » : elle ouvre le volet Réglages. */}
            {graphic && Svg ? (
              <Box key="hit:open-settings" flexDirection="row" alignItems="center" flexShrink={0} hover={{ backgroundColor: palette.hover }}>
                {strut(SIZE.strut.row)}
                <Svg source={gearIcon(palette.text2)} alt="Réglages" width={SIZE.icon.md} height={SIZE.icon.md} />
                {hit('open-settings', () => void openSettings($), 1)}
              </Box>
            ) : (
              <Box flexShrink={0}>
                <Button key="open-settings" plain label="Réglages" onPress={() => void openSettings($)} />
              </Box>
            )}
            <Box flexShrink={1} minWidth={0} marginLeft={1}>
              <Text size="caption" tabular color={versionCheck.state === 'late' ? palette.blockOn : palette.text3} wrap="truncate-end">
                {versionCheck.state === 'none' ? `roadmap ${ownVersion}` : versionCheck.foot}
              </Text>
            </Box>
          </Box>
          {versionCheck.action === 'reload' ? (
            <Box flexShrink={0} marginLeft={1}>
              <Button key="version-reload" variant="primary" label="Recharger" onPress={() => void reloadPlugin($)} />
            </Box>
          ) : versionCheck.action === 'update-local' ? (
            <Box flexShrink={0} marginLeft={1}>
              <Button key="version-update" variant="primary" label="Mettre à jour" onPress={() => void updateLocal($)} />
            </Box>
          ) : (
            <Box key="version-refresh-row" flexShrink={0} marginLeft={1} paddingX={SPACE.indent} alignItems="center" backgroundColor={palette.btn} hover={{ backgroundColor: palette.btnHover }}>
              {corners(RADIUS.control, palette.bg)}
              <Button key="version-refresh" plain label={versionCheck.state === 'checking' ? 'Rafraîchir…' : '↻ Rafraîchir'} onPress={() => void refreshAll($)} />
            </Box>
          )}
        </Box>
        {/* L'encart (#162) : pourquoi, puis le geste ; quand l'app retarde, le lien vers la page Plugins de claude.ai. */}
        {versionCheck.state === 'late' && versionCheck.gesture && (
          <Box paddingX={SPACE.indent}>
            <Box key="version-callout" paddingX={SPACE.indent} paddingY="xs" backgroundColor={palette.blockTint}>
              {corners(RADIUS.control, palette.bg)}
              <Text size="caption" color={palette.blockOn} wrap="wrap">
                {`${versionCheck.text} `}
                {versionCheck.action === 'open-plugins' && <Link href={PLUGINS_URL} label={PLUGINS_LINK} />}
                {versionCheck.action === 'open-plugins' ? ` ${versionCheck.gesture}.` : versionCheck.gesture}
              </Text>
            </Box>
          </Box>
        )}
      </Box>
    </Box>,
  )
}
