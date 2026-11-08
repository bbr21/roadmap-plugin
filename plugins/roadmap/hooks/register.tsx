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
  axisSwatchIcon,
  axisTint,
  percentIcon,
  pillIcon,
  filterPillIcon,
  type PillMark,
  checkIcon,
  fadeIcon,
  foldArrowIcon,
  chainRowIcon,
  treeMotherRowIcon,
  treeChildRowIcon,
  treeAloneRowIcon,
  TREE_CHILD_PX,
  TREE_MARK_PX,
  TREE_FOLD_PX,
  treeFoldIcon,
  MARK_SQUARE_PX,
  MARK_SQUARE_CENTER,
  axisHeadIcon,
  sectionRuleIcon,
  bandGlyphIcon,
  progressIcon,
  bubbleIcon,
  squareCheckRowIcon,
  squareArmedRowIcon,
  squareGhostRingIcon,
  calendarDayIcon,
  DAY_CELL_PX,
  squareCheckMoveIcon,
  squareRowIcon,
  cornerIcon,
  memo,
  rowMark,
  type Corner,
  chevronIcon,
  controlIcon,
  lockIcon,
  handIcon,
  mergeIcon,
  folderIcon,
  alertIcon,
  playIcon,
  externalIcon,
  browserIcon,
  closeIcon,
  envelopeTile,
  documentIcon,
  imageIcon,
  archiveIcon,
  unarchiveIcon,
  pencilIcon,
  priorityIcon,
  PRIORITY_PX,
  gearIcon,
  todoIcon,
  discIcon,
  halfDiscIcon,
  mixOver,
  activityFills,
  activityGridIcon,
  personIcon,
  resolveTheme,
  ringIcon,
  ruleIcon,
  fullWidth,
  spinnerIcon,
  stepIcon,
  stepRailIcon,
  stepsBarIcon,
  contextBarIcon,
  squareIcon,
  STROKE,
  gaugeIcon,
  FAMILY_MARK_PX,
  familyChevronIcon,
  familyElbowIcon,
  familyLeadIcon,
  familySquareIcon,
  type Palette,
  donutDotIcon,
  donutIcon,
} from './icons'
import { MIX, PX, RADIUS, SIZE, SPACE, TEXT } from './tokens'
import { drawWrittenMessage, splitWritten, writtenCards } from './cartes'
import { CONTROL_PANE, drawControl, openControl, redrawControl, type ControlDeps } from './controle'
import { SETTINGS_PANE, drawSettings, openSettings, prefsFile, redrawSettings, rememberLoadedOptions, sessionProject, watchSettings, type SettingsProject } from './reglages'
import {
  CLASSIC_SKIPS_OFF,
  retryOnLock,
  squareHitWidth,
  TREE_LEAD_CELLS,
  declaredAccount,
  ownOptions,
  type Account,
  ageLabel,
  axisLabel,
  branchGap,
  branchText,
  brandText,
  briefTaskOf,
  bandColumns,
  bandState,
  maestroBand,
  maestroBarText,
  type MaestroBand,
  type StepsView,
  maestroBrandTasks,
  firstLaunch,
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
  studySteps,
  studyStepsReminder,
  proposeTaskText,
  localClockText,
  codeWithoutTests,
  isMethodSkill,
  isSwiftUISkill,
  isDesignSkill,
  isMockupPage,
  mockupPagesOf,
  mockupToggle,
  previewOpenIn,
  fileUrl,
  mockupAskText,
  designReminder,
  designSkills,
  PANEL_SKILL,
  panelSkillNote,
  pinnedPaneToast,
  refusesPaneClose,
  PANE_ID,
  SETTINGS_SKILL,
  settingsSkillNote,
  methodReminder,
  isMockupCall,
  isRenderFile,
  fidelityGaps,
  fidelityImage,
  fidelityNoteText,
  fidelityRequired,
  mockupApproval,
  formApproval,
  mockupYesReminder,
  uiFilesToMock,
  MOCKUP_TOOLS,
  swiftUIFiles,
  countBy,
  daysBetween,
  durationLabel,
  sessionIdIn,
  sessionState,
  othersArchiveAsk,
  othersArchiveRefusal,
  isLaunchAsk,
  launchInBox,
  launchBoxRefusal,
  dueLabel,
  findSelected,
  cardFolded,
  cardSummary,
  chainOf,
  ficheCards,
  missionBullets,
  missionShown as missionVisible,
  MISSION_FOLD,
  finCard,
  type FinRow,
  codeKeptWhole,
  foldCell,
  livreOfNote,
  missionFrame,
  parseEndFiche,
  recapKey,
  recapOf,
  pitchBlocks,
  pitchKey,
  pitchOf,
  liveHead,
  stepTimes,
  stepsSpent,
  bilanRows,
  askedOf,
  changeZones,
  changesCard,
  changesKey,
  durationView,
  heavyTest,
  spanLabel,
  timingAsk,
  timingBash,
  timingKey,
  timingOf,
  timingTurnEnd,
  timingTurnStart,
  type StoredTiming,
  changesMissingNote,
  changesOf,
  mergeZones,
  parseChangeBlock,
  type ChangeZone,
  type FicheCard,
  type EditField,
  type LintRules,
  type BatchChange,
  type BatchStep,
  batchDays,
  batchPlan,
  batchSummary,
  monthGrid,
  pickPrune,
  pickToggle,
  caseGesture,
  caseConfirmKeys,
  numberPickHover,
  numberLabel,
  shiftMonth,
  type EditSpec,
  type TaskEdit,
  taskBrandOf,
  DONE_TREE_PREFIX,
  doneRight,
  doneTree,
  dueInk,
  groupingOf,
  nextGrouping,
  groupingLabel,
  byTree,
  viewKeeps,
  axisTree,
  bandLook,
  bandQuiet,
  dayTree,
  deadlineTree,
  ownerTree,
  numberTree,
  type AxisItem,
  parentLeftAlone,
  blockerOf,
  closeCaption,
  closeRoute,
  isRoutine,
  nextDue,
  rollDaySteps,
  rollRoute,
  routineBrief,
  routineDue,
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
  cachedTitle,
  fallbackTitle,
  openedLabel,
  selectionOf,
  shortDate,
  doneLabel,
  firstPrereq,
  prereqsOf,
  cardTool,
  delegationNote,
  isCodeEdit,
  isPlanLine,
  launchModelOf,
  codeModelOf,
  MODEL_IDS,
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
  maestroAxisNote,
  maestroContext,
  maestroExecAction,
  maestroExecReminder,
  handWriteReminder,
  handWritesRoadmap,
  maestroDayContext,
  maestroIntro,
  maestroRelaunchContext,
  welcomeCardShown,
  welcomeFacts,
  welcomeText,
  type MaestroAction,
  type Welcome,
  type ActivityMode,
  type WelcomeCardSeen,
  type WelcomePill,
  MAESTRO_MENU,
  listPills,
  rowPills,
  sortTasks,
  type Pill,
  hashLabel,
  keyPart,
  attachmentKind,
  fileLinks,
  draftPreview,
  commState,
  unsentRefusal,
  unsentNote,
  isPreviewable,
  PREVIEW,
  type DraftPreview,
  isDocumentPath,
  openRefusal,
  openVerdict,
  pathCandidates,
  thumbSvg,
  integerShares,
  briefDocs,
  launchBrief,
  treeContext,
  TREE_MARK,
  withTreeContext,
  FOLDER_MARK,
  folderContext,
  folderPaths,
  withFolderContext,
  launchPrompt,
  namedFiles,
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
  isOverdue,
  matches,
  newProblems,
  bilanConfigFor,
  coworkPyWrites,
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
  partialCloseNote,
  parsePerso,
  setDateFormat,
  setPerson,
  person,
  Person,
  parseTitles,
  addedOpenTasks,
  writesRoadmap,
  taskForSessionTitle,
  launchTitleRefusal,
  originSession,
  publishedRelease,
  releaseCommandIds,
  testLaterReminder,
  testReminder,
  testSessionNote,
  testsUnder,
  testTitle,
  withoutTests,
  sessionName,
  searchSummary,
  searchTasks,
  searchTree,
  shownLines,
  sessionTitleId,
  pickTaskSource,
  taskIdIn,
  discoveredSource,
  sessionTitleKind,
  taskSessionRow,
  sessionRowsOf,
  taskSessionIndex,
  taskTitle,
  reopenOutcome,
  branchesToPrune,
  openBranchesOf,
  parseRefTips,
  parseWorktreeBranches,
  sweepNote,
  type TaskSessionRow,
  sessionTitleIn,
  sessionParentIn,
  sessionModeIn,
  oneTaskStep,
  isMaestroSession,
  maestroSessionIds,
  withSelfRow,
  sessionScanNote,
  maestroTasksNote,
  liveBlockRows,
  heavyQueueDir,
  launchPlaces,
  PLACE_IDLE_MS,
  macLoad,
  launchGate,
  projectTaken,
  globalQueueOrder,
  liveQueue,
  PRIO_MARKS_KEY,
  QUEUE_STUCK_MS,
  rootOfCwd,
  SESSION_PAUSES_KEY,
  pickYield,
  prioMarksOf,
  queueAtBetween,
  resumeText,
  sessionPausesOf,
  sessionWeight,
  type SessionPause,
  type YieldCandidate,
  queueHead,
  queueEntryText,
  releasePrompt,
  queuedRefusal,
  countersLine,
  type QueuedLaunch,
  type GlobalQueued,
  type MacLoad,
  type DoseWhy,
  readHeavyQueue,
  queueMarks,
  OPENING_VIEW,
  openingView,
  roadmapAxes,
  doneViewOn,
  moreFiltersForced,
  otherTaskNote,
  problemsText,
  sourceFor,
  titlePrompt,
  todayOf,
  toggleFold,
  unlocksOf,
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
  retireActedFocus,
  focusBase,
  retirePressedFocus,
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
  CHECK_OVERLAY,
  checkMoveAt,
  checkLingers,
  CHECK_HOLD_MS,
  treeNumberCells,
  AGE_CELLS,
  splitRowPills,
  treeSteps,
  treeDepartment,
  foldAllView,
  sectionFold,
  subtaskFold,
  titleOverlay,
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
  AUTO_VIA_CLAUDE,
  AUTO_BLOCKED,
  autoBypassNote,
  maestroParentOf,
  maestroRootOf,
  PROPOSAL_OPTIONS,
  ELSEWHERE_OPTIONS,
  proposalRetryNote,
  maestroProposalText,
  proposalSentNote,
  type MaestroProposal,
  type BackgroundWork,
  backgroundWork,
  shellsAfterNotice,
  childWake,
  childWakeText,
  type ChildWake,
  applyPlan,
  boxSteps,
  mergeSteps,
  childAlerts,
  stepsStamp,
  stateBand,
  filRows,
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
  wantsBypass,
  isModeRefusal,
  forbiddenGit,
  queuedCommand,
  type Delivery,
  guardText,
  type GitHit,
  isToday,
  isDueTomorrow,
  isRecurringSoon,
  dayFilterQuiet,
  relaunchSections,
  todaySections,
  isDueSoon,
  isPriority,
  isToRelaunch,
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
  STORE_MARKETS,
  updateLocalOutcome,
  waitNote,
  type WaitNote,
  type CheckMove,
  mergeChanges,
  newQuestions,
  renderReport,
  reportOf,
  reportQuestions,
  reportRefusal,
  reportReminder,
  roadmapChanges,
  cartonOf,
  detailsStory,
  familyOf,
  srcFile,
  gaugeLine,
  stepGauge,
  type Gauge,
  type GaugeKind,
  type TaskChange,
  type Waiting,
  AXIS_NAMES,
  axisName,
  axisPalette,
  axisSlug,
  renameAxisInTexts,
  renameAxisRoute,
  withAxisStyle,
  withPersoAxisStyle,
  type AxisStyle,
} from './parse'
import type { HeavyQueue, QueueMark } from './parse'

/**
 * L'attente du moteur entre deux essais d'une écriture du store (#350) : son horloge, sinon `setTimeout` ;
 * sans l'une ni l'autre, l'essai suivant part aussitôt.
 */
function engineWait($: EngineInterface, ms: number): Promise<void> {
  return new Promise(resolve => {
    try {
      $.clock.after(ms, () => resolve())
      return
    } catch {
      // horloge refusée : on tente la minuterie de l'environnement
    }
    if (typeof setTimeout === 'function') setTimeout(resolve, ms)
    else resolve()
  })
}

type StoreValue = Parameters<EngineInterface['store']['set']>[1]

/**
 * Toute écriture du store passe par ici (#350) : le store est un fichier partagé par les sessions ouvertes,
 * et une écriture refusée parce qu'une autre session tient son verrou se réessaie au lieu d'échouer.
 */
function storeSet($: EngineInterface, key: string, value: StoreValue): Promise<void> {
  return retryOnLock(async () => {
    await $.store.set(key, value)
  }, ms => engineWait($, ms))
}

function storeDelete($: EngineInterface, key: string): Promise<void> {
  return retryOnLock(async () => {
    await $.store.delete(key)
  }, ms => engineWait($, ms))
}

const PANE = PANE_ID
const BAR_HIT = 'bar-hit'
/** La zone de clic du donut de la durée (#314). */
const DONUT_HIT = 'donut-hit'
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
/** La section à part des récurrentes qui tombent, au bas de Ma journée (#268). */
const TODAY_RECURRING = 'jour:Récurrentes qui tombent'
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
/** Les clés des boutons sans encre d'une ligne (sa case, son titre) sur le bureau, relevées au dessin (#351). */
const ghostPressKeys = new Set<string>()
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
/** L'arrêt net d'une session (#367) : la pause d'une session cédée à une prioritaire ou mise en pause à la main. */
export const STOP_SESSION_TOOL = 'mcp__ccd_session_mgmt__stop_session'
/** Les propositions gardées pour leur Maestro quand le message direct est refusé (#67). */
const PROPOSALS_KEY = 'lot-proposals'
/** Une proposition gardée plus d'une semaine sans que son Maestro reprenne la main : retirée. */
const PROPOSAL_MAX_MS = 7 * 86_400_000
/** Les outils d'où un enfant tire son état (#84) : sa liste d'étapes, sa question, son récap. */
const UPDATE_PLAN_TOOL = 'mcp__ccd_turn__update_plan'
const WRAP_UP_TOOL = 'mcp__ccd_turn__wrap_up' // aussi le texte de la boîte, pour le rappel d'une idée sans ligne (#83)
const ASK_TOOL = 'AskUserQuestion'
/** Le côté du petit donut de la durée, en px (#314). */
const DURATION_DONUT = 44
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
// Ceux du bouton des maquettes (#306) : le volet navigateur, la disposition, la barre latérale.
const PREVIEW_START_TOOL = 'mcp__Claude_Browser__preview_start'
const GET_LAYOUT_TOOL = 'mcp__ccd_view__get_layout'
const CLOSE_PANE_TOOL = 'mcp__ccd_view__close_pane'
const WINDOW_LAYOUT_TOOL = 'mcp__ccd_window__get_window_layout'
const SIDEBAR_TOOL = 'mcp__ccd_window__set_sidebar_collapsed'
// Ceux qui lisent la fiche d'une session et la montrent.
const GET_SESSION_TOOL = 'mcp__ccd_session_mgmt__get_session'
const SET_MODE_TOOL = 'mcp__ccd_session_mgmt__set_session_permission_mode'
const OPEN_SESSION_TOOL = 'mcp__ccd_window__open_session_in'
const ARCHIVE_SESSION_TOOL = 'mcp__ccd_session_mgmt__archive_session'
const UNARCHIVE_SESSION_TOOL = 'mcp__ccd_session_mgmt__unarchive_session'
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
  // Toutes les tâches (#188) ; un clic sur un filtre le remplace jusqu'à la prochaine ouverture.
  attend: 'all',
  who: 'all',
  moreFilters: false,
  // Pas choisie : la vue Done d'office à 0 tâche ouverte (#202).
  showDone: undefined,
  // `auto` : les ouvertes par sujet, les faites par jour ; un clic sur « Par jour / Par sujet » vaut pour toutes les vues.
  groupBy: 'auto',
  selected: '',
  openGroups: [],
  closedGroups: [],
  moreGroups: [],
  launchNote: '',
  launched: [],
  openNote: '',
  openAt: '',
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
const checkMoveAtom = atom({ plugin: 'roadmap', key: 'checkMove' } as const, 0)
/** Pourquoi les autres sessions manquent (liste refusée ou illisible) ; vide quand elle se lit. */
const scanNoteAtom = atom({ plugin: 'roadmap', key: 'scanNote' } as const, '')
/** La page de maquettes que le bouton de la fiche a ouverte (#306), vide sinon. */
const mockupOpenAtom = atom({ plugin: 'roadmap', key: 'mockupOpen' } as const, '')
/** Ce que montre la grille de l'accueil (#335) : les faites ou les ajoutées, au choix du bouton ; vaut pour toute la session. */
const welcomeGridAtom = atom({ plugin: 'roadmap', key: 'welcomeGrid' } as const, 'done' as ActivityMode)
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
 * L'axe que « Maestro <axe> » a posé pour cette session (#239), vide pour tous : le filtre du panneau à
 * chaque ouverture et la portée des briefs de Maestro, jusqu'au prochain « Maestro <axe> » ou « Maestro »
 * seul. Un atome est l'état de la session : deux Maestro sur deux axes ne se gênent pas.
 */
const maestroAxisAtom = atom({ plugin: 'roadmap', key: 'maestroAxis' } as const, '')

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
let settings = { me: [] as string[], autoOpen: true, titleModel: 'sonnet', capture: true, theme: 'auto', launchEffort: 'high', launchModel: 'opus', codeModel: 'sonnet', launchBypass: false, pruneBranches: true, launchQueue: true, projectSessions: '3', macSessions: '12', axisPill: false, priorities: false, dateFormat: 'us', account: 'auto' as Account }

/** L'identifiant du modèle qui cadre (#327), ou undefined s'il hérite de la session qui lance. */
function launchModelId(): string | undefined {
  const m = launchModelOf(settings.launchModel)
  return m === 'hérite' ? undefined : MODEL_IDS[m]
}

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
// l'avancement), une fille (son coude), une tâche seule ; leur carré coche, sauf celui de la mère, qui la replie (#198).
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
  /** Une skill de design lancée dans la session (#292 ; perdu au rechargement du module). */
  designUsed: boolean
  /** Le dernier `read_me` du visualiseur a chargé le module `mockup` : un widget est une maquette (#292). */
  mockupModule: boolean
  /** La maquette dessinée pendant le tour (une page, ou « un widget de maquette ») ; remise à zéro à chaque tour (#292). */
  mockupDrawn?: string
  /** La dernière maquette dessinée que la personne n'a pas encore validée d'un oui (#322) ; vide sinon. */
  mockupAwaiting?: string
  /** Le rappel du oui déjà donné pour cette maquette (#322) : une fois par maquette dessinée. */
  mockupYesWarned: boolean
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

/** Le visualiseur (#292) : son `read_me` dit le module chargé, son widget dessine. */
const VISUALIZE_README = 'mcp__visualize__read_me'
const VISUALIZE_WIDGET = 'mcp__visualize__show_widget'

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
    designUsed: false,
    mockupModule: false,
    mockupYesWarned: false,
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

/**
 * Les fichiers de code que le fil principal a édités pendant le tour, et ses appels à un sous-agent (#327) :
 * remis à zéro au début de chaque tour de la session principale.
 */
let delegation = { files: new Set<string>(), agentCalls: 0 }

/** Un `plan.md` sous `docs/plans/` change-t-il sur la branche (commité depuis main, ou pas encore) ? */
async function planChanged($: EngineInterface): Promise<boolean> {
  const root = await $.session.root()
  const isPlan = isPlanLine
  const branch = await $.process.run(['git', '-C', root, 'diff', '--name-only', 'main...HEAD'])
  if (branch.exitCode !== 0) throw new Error('git illisible')
  if (branch.stdout.split('\n').some(isPlan)) return true
  const pending = await $.process.run(['git', '-C', root, 'status', '--porcelain'])
  return pending.exitCode === 0 && pending.stdout.split('\n').some(isPlan)
}

/** Le rappel de déléguer (#327) : le tour a codé lui-même après le plan, sans sous-agent. */
async function delegationReminder($: EngineInterface): Promise<string | undefined> {
  if (delegation.files.size < 3 || delegation.agentCalls > 0) return undefined
  const note = (planned: boolean) =>
    delegationNote({ edits: delegation.files.size, agentCalls: delegation.agentCalls, planChanged: planned, codeModel: codeModelOf(settings.codeModel, launchModelOf(settings.launchModel)) })
  return note(await planChanged($))
}

/** Le rappel de design (#292) : une maquette dessinée pendant le tour, aucune skill de design dans la session. */
function designNote(c: Capture): string | undefined {
  if (c.mockupDrawn === undefined || c.designUsed) return undefined
  return designReminder(c.mockupDrawn, designSkills(c.source.design), Array.isArray(c.source.design))
}

/** Un fichier de code édité par le fil principal (#327), pour le rappel de déléguer. */
function noteCodeEdit(e: { agentId?: unknown }, path: unknown): void {
  if (e.agentId !== undefined || typeof path !== 'string' || !isCodeEdit(path)) return
  delegation.files.add(path)
}

/** Une maquette dessinée par le fil principal (#292) : une page `maquettes*.html` écrite, ou un widget du module `mockup`. */
function noteMockupDrawn(e: { agentId?: unknown; file_path?: unknown }): void {
  if (!capture || e.agentId !== undefined) return
  if (isMockupPage(typeof e.file_path === 'string' ? e.file_path : undefined)) {
    capture.mockupDrawn = `\`${baseName(e.file_path as string)}\``
    awaitYes(capture.mockupDrawn)
  }
}

/** Une maquette dessinée (#322) : jusqu'au oui de la personne, un fichier de rendu édité se rappelle, une fois. */
function awaitYes(what: string): void {
  if (!capture) return
  capture.mockupAwaiting = what
  capture.mockupYesWarned = false
}

/** Un fichier de rendu édité par le fil principal sans oui depuis la dernière maquette (#322) : le rappel, au tour même. */
function yesNote(e: { agentId?: unknown; file_path?: unknown }, ran: ToolCallResult): ToolCallResult {
  const c = capture
  if (!c || e.agentId !== undefined || c.mockupAwaiting === undefined || c.mockupYesWarned) return ran
  if (ran.deny !== undefined || ran.isError === true || !isRenderFile(typeof e.file_path === 'string' ? e.file_path : undefined)) return ran
  c.mockupYesWarned = true
  return { ...ran, context: [...(ran.context ?? []), mockupYesReminder(`\`${baseName(e.file_path as string)}\``, c.mockupAwaiting)] }
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
  // Le parent Maestro mémorisé par le message (prompt.submit, #216) : pas d'appel d'outil en fin de tour.
  return ideaReminder(c.source, phrase, parentMaestro)
}

/** #293 : une réponse qui recommande des étapes, sans carte ni roadmap changée pendant le tour. */
async function studyNote($: EngineInterface, c: Capture, last: string | undefined): Promise<string | undefined> {
  if (c.cardThisTurn || c.roadmapAtTurn === undefined) return undefined
  const steps = studySteps(last ?? '')
  if (steps === undefined) return undefined
  if (joined(await roadmapNow($, c.source)) !== c.roadmapAtTurn) return undefined
  return studyStepsReminder(c.source, steps, parentMaestro)
}

/** Ce que dit une boîte de fin : récap, question, boutons. */
function boxText(e: unknown, withRecap = true): string {
  const box = e as { recap?: unknown; ask?: unknown; actions?: unknown }
  const actions = Array.isArray(box.actions) ? (box.actions as { label?: unknown; message?: unknown }[]) : []
  const texts = [withRecap ? box.recap : undefined, box.ask, ...actions.flatMap(a => [a?.label, a?.message])]
  return texts.filter((t): t is string => typeof t === 'string').join('\n')
}

/** Ce que dit la boîte de fin du tour, gardé pour le rappel d'une idée sans ligne. */
function noteBox(e: unknown): void {
  if (capture) capture.boxThisTurn = boxText(e)
}

/**
 * Le compte rendu du tour (#244), quelle que soit la skill qui écrit : les tâches que les écritures
 * de la session ont changées (relues juste avant et juste après chaque outil, #70), les questions de
 * `ROADMAP-questions.json` au début du tour et celles qu'a imprimées `tasks.py write`, le formulaire
 * posé, la boîte déjà refusée, et le compte rendu déjà remis au modèle.
 */
type ReportTurn = { changes: TaskChange[]; touched: boolean; questionsAtTurn?: string; fromTasks: Waiting[]; asked: boolean; refused: boolean; given: string }
const freshReport = (): ReportTurn => ({ changes: [], touched: false, fromTasks: [], asked: false, refused: false, given: '' })
let reportTurn: ReportTurn = freshReport()

const questionsPath = (source: Source) => files(source).open.replace(/[^/]*$/, 'ROADMAP-questions.json')

/** Le compte rendu du tour, ou rien quand le tour n'a écrit ni la roadmap ni une question. */
async function turnReport($: EngineInterface): Promise<{ markdown: string; waiting: number } | undefined> {
  if (!settings.capture || !capture) return undefined
  const fromFile = reportTurn.touched ? newQuestions(reportTurn.questionsAtTurn, await readOr($, questionsPath(capture.source))) : []
  if (reportTurn.changes.length === 0 && fromFile.length === 0) return undefined
  const waiting = [...reportTurn.fromTasks, ...fromFile.filter(q => !reportTurn.fromTasks.some(w => w.question === q.question))]
  // #245 : une close et sa suite chez un tiers, dites en une ligne ; le tiers se juge par les noms `me` du projet.
  const data = reportOf(reportTurn.changes, waiting, capture.source.me)
  if (data.ajoutees.length + data.mises_a_jour.length + data.t_attendent.length === 0) return undefined
  let now = Date.now()
  try {
    now = await $.clock.now()
  } catch {
    // horloge du moteur illisible : celle du module
  }
  return { markdown: renderReport(data, 'ecrit', todayOf(now)), waiting: data.t_attendent.length }
}

/**
 * Le journal du tour remis avec le résultat d'une écriture (#261), s'il n'a pas déjà été remis tel quel :
 * le modèle l'a avant d'écrire son message, et le rappel de fin de tour ne le relance plus pour un second.
 */
async function reportNote($: EngineInterface): Promise<string | undefined> {
  const report = await turnReport($)
  if (report === undefined || report.markdown === reportTurn.given) return undefined
  reportTurn.given = report.markdown
  return reportReminder(report.markdown)
}

/**
 * Le tour en cours de cette session, pour le bloc de fin de tour (#85) : hors de `Capture`, il vaut
 * dans tout projet, roadmap ou non. Un tour de travail a appelé la boîte de fin ou la liste d'étapes.
 */
let closingTurn = { work: false, box: '', asked: '', wake: false, maestro: false }
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
 * Le rappel de la fin de session (#85, #243) : mode ADHD, tour de travail, la conclusion ou le bouton
 * d'archivage manquant. Rangement en attente (#101) : ni l'un ni l'autre ne se réclament.
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
  const gaps = closingBlockGaps(last, closingTurn.asked, line, maestro).filter(g => !(rangementPending && (g === 'archiver' || g === 'conclusion' || g === 'etat-close' || g === 'taches')))
  return gaps.length === 0 ? undefined : closingBlockReminder(gaps, line, maestro)
}

/**
 * Le rappel de clôture partielle d'une session (#245) : elle se dit finie, et sa ligne `#N`, encore
 * ouverte, attend un tiers. Sous Maestro elle la propose, seule elle l'écrit.
 */
async function partialNote($: EngineInterface, last: string | undefined): Promise<string | undefined> {
  const c = capture
  if (!c || closingTurn.wake) return undefined
  const title = (await readOwnSession($)).title
  const id = sessionTitleId(title)
  if (id === undefined || sessionTitleKind(title) === 'check') return undefined
  const open = await load($, files(c.source).open, 'ROADMAP.md')
  const task = typeof open === 'string' ? undefined : open.find(t => t.id === id && !t.done)
  if (!task) return undefined
  return partialCloseNote({ id, attend: task.attend, me: c.source.me, maestro: await parentIsMaestro($), ...(wakeBox.recap !== undefined ? { recap: wakeBox.recap } : {}), ...(last !== undefined ? { answer: last } : {}) })
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
    await storeSet($, recapKey(c.source.name, id), { ...fiche, at: await $.clock.now() })
  } catch {
    // store ou fiche de session illisibles : la fiche de tâche garde son cadre
  }
}

/**
 * Les phrases « Ce qu'on va lancer » d'un message de Claude (#341, C1), gardées sous leur tâche dans le store,
 * comme « Ce qu'on a fait » : un bloc `**Ce qu'on va lancer (#N).** …` par tâche ouverte ou reprise.
 */
async function savePitches($: EngineInterface, answer: string | undefined): Promise<void> {
  const c = capture
  if (!settings.capture || !c || !answer) return
  const blocks = pitchBlocks(answer)
  if (blocks.length === 0) return
  try {
    const at = await $.clock.now()
    for (const b of blocks) await storeSet($, pitchKey(c.source.name, b.id), { text: b.text, at })
  } catch {
    // store illisible : la fiche garde la mission seule
  }
}

/**
 * Les zones du diff de la branche de cette session contre sa base (#269), et ses commits : capture allumée,
 * pour une session qui porte le numéro de sa tâche (pas une vérification). Sans git (le mode Projet, le plus
 * souvent), ou git en échec : rien, comme la ligne Branche de la fiche (`readFocusFacts`).
 */
async function branchZones($: EngineInterface): Promise<{ id: string; key: string; zones: ChangeZone[]; commits: number } | undefined> {
  const c = capture
  if (!settings.capture || !c) return undefined
  const own = await readOwnSession($)
  if (sessionTitleKind(own.title) === 'check') return undefined
  const id = sessionTitleId(own.title)
  if (id === undefined) return undefined
  const root = await $.session.root()
  const base = own.id ? (await childFiche($, own.id)).base : 'main'
  const names = await gitIn($, root, 'diff', '--name-only', `${base}...HEAD`)
  if (names.code !== 0) return undefined
  const count = await gitIn($, root, 'rev-list', '--count', `${base}..HEAD`)
  return { id, key: changesKey(c.source.name, id), zones: changeZones(names.out.split('\n')), commits: count.code === 0 ? Number(count.out.trim()) || 0 : 0 }
}

/**
 * Le relevé « Ce qui a changé » de la tâche de cette session (#269), gardé à chaque fin de tour : les zones
 * du diff, fondues avec le bloc de la session et les phrases d'avant. Une branche sans diff ni bloc : rien.
 */
async function saveChanges($: EngineInterface, answer: string | undefined): Promise<void> {
  try {
    const branch = await branchZones($)
    if (!branch) return
    const said = parseChangeBlock(answer ?? '')
    if (branch.zones.length === 0 && !said) return
    const prev = changesOf(await $.store.get(branch.key).catch(() => undefined))
    const zones = mergeZones(branch.zones, said, prev?.zones)
    if (zones.length === 0) return
    await storeSet($, branch.key, { zones, commits: branch.commits, at: await $.clock.now() })
  } catch {
    // store ou git illisibles : la fiche garde le relevé d'avant
  }
}

/** La clé du relevé des temps de la tâche de cette session (#314), trouvée une fois : capture allumée, session numérotée, pas une vérification. */
let timingTarget: string | null | undefined
/** La boîte de fin de ce tour laisse une question à BBR (#314) : son attente court jusqu'au tour suivant. */
let timingAsked = false
async function timingKeyHere($: EngineInterface): Promise<string | undefined> {
  if (timingTarget !== undefined) return timingTarget ?? undefined
  const c = capture
  if (!settings.capture || !c) return undefined
  const title = (await readOwnSession($)).title
  const id = sessionTitleId(title)
  if (id === undefined) return undefined
  timingTarget = sessionTitleKind(title) === 'check' ? null : timingKey(c.source.name, id)
  return timingTarget ?? undefined
}

/** L'heure, ou rien quand l'horloge ne répond pas : le relevé des temps (#314) ne doit jamais faire sauter un hook. */
async function timingNow($: EngineInterface): Promise<number | undefined> {
  try {
    return await $.clock.now()
  } catch {
    return undefined
  }
}

/** Le relevé des temps (#314) passé par un réducteur et regardé ; store ou session illisibles : rien ne change. */
async function noteTiming($: EngineInterface, step: (t: StoredTiming | undefined, now: number) => StoredTiming | undefined): Promise<void> {
  try {
    const key = await timingKeyHere($)
    if (key === undefined) return
    const next = step(timingOf(await $.store.get(key).catch(() => undefined)), await $.clock.now())
    if (next !== undefined) await storeSet($, key, next)
  } catch {
    // le relevé garde son état d'avant
  }
}

/** Le rappel du bloc « Ce qui a changé » (#269) : prête sans bloc, les zones de sa branche encore sans phrase. */
async function changesNote($: EngineInterface, last: string | undefined): Promise<string | undefined> {
  if (closingTurn.wake) return undefined
  const branch = await branchZones($)
  if (!branch || branch.zones.length === 0) return undefined
  const prev = changesOf(await $.store.get(branch.key).catch(() => undefined))
  const missing = mergeZones(branch.zones, undefined, prev?.zones).filter(z => !z.why)
  return changesMissingNote({ zones: missing, ...(wakeBox.recap !== undefined ? { recap: wakeBox.recap } : {}), ...(last !== undefined ? { answer: last } : {}) })
}

/**
 * Le rappel de fidélité (#357) : la session se dit prête à fusionner, sa branche (commits et fichiers pas
 * encore commités) code un rendu d'après une maquette, et aucune page `fidelite.html` n'est complète.
 */
async function fidelityNote($: EngineInterface, last: string | undefined): Promise<string | undefined> {
  const c = capture
  if (closingTurn.wake || !settings.capture || !c || projectSettings(c.source).travail === 'projet') return undefined
  const said = { ...(wakeBox.recap !== undefined ? { recap: wakeBox.recap } : {}), ...(last !== undefined ? { answer: last } : {}) }
  if (childWake(said).kind !== 'ready') return undefined
  const root = await $.session.root()
  const names = await gitIn($, root, 'diff', '--name-only', 'main...HEAD')
  if (names.code !== 0) return undefined
  const pending = await gitIn($, root, 'status', '--porcelain', '--untracked-files=all')
  const files = [...new Set([
    ...names.out.split('\n'),
    ...(pending.code === 0 ? pending.out.split('\n').map(l => l.slice(3).replace(/^.* -> /, '')) : []),
  ].map(f => f.trim()).filter(f => f !== ''))]
  if (!fidelityRequired(files)) return undefined
  const proofs: string[][] = []
  for (const page of files.filter(f => /(^|\/)fidelite\.html$/.test(f))) {
    const html = await $.fs.read(`${root}/${page}`).catch(() => undefined)
    const image = fidelityImage(html)
    const dir = page.includes('/') ? page.slice(0, page.lastIndexOf('/') + 1) : ''
    const found = image !== undefined && (await $.fs.exists(`${root}/${dir}${image}`).catch(() => false))
    proofs.push(fidelityGaps(html, found))
  }
  return fidelityNoteText({ ...said, files, proofs, script: `${$.plugin.root}/skills/maestro/scripts/fidelite.py` })
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

/**
 * La garde de l'envoi à la boîte de fin (#242) : « Archiver cette session ? » alors qu'un livrable de sa
 * tâche, ouverte ou close, est une communication pas encore partie. Roadmap illisible : passe.
 */
async function unsentAsk($: EngineInterface, ask: unknown): Promise<string | undefined> {
  const c = capture
  if (typeof ask !== 'string' || !/archiver cette session/i.test(ask) || !settings.capture || !c) return undefined
  try {
    const title = (await readOwnSession($)).title
    const id = sessionTitleId(title)
    if (id === undefined || sessionTitleKind(title) === 'check') return undefined
    const now = await roadmapNow($, c.source)
    const task = [...parseRoadmap(now.done ?? '', 'ROADMAP-fait.md'), ...parseRoadmap(now.open ?? '', 'ROADMAP.md')].find(t => t.id === id)
    if (task === undefined) return undefined
    const unsent = await unsentDeliverables($, c.source, task)
    return unsent.length > 0 ? unsentRefusal(id, unsent, 'archive') : undefined
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
/** Les gestes d'exécution d'un tour de la personne chez Maestro (#250) : redits une fois en fin de tour. */
let maestroExec: string[] = []

/** Le rappel de la skill tasks déjà donné ce tour-ci à un Maestro qui écrit la roadmap à la main (#255). */
let handWarned = false

/**
 * #255 : Maestro qui écrit ROADMAP.md à la main, hors de `tasks.py`, reçoit le rappel de la skill tasks
 * dans le résultat, une fois par tour ; jamais un refus. Un sous-agent, un appel refusé ou en échec : rien.
 */
async function handWriteNote($: EngineInterface, e: unknown, tool: string, ran: ToolCallResult): Promise<ToolCallResult> {
  if (handWarned || fromAgent(e) || ran.deny !== undefined || ran.isError === true || !handWritesRoadmap(tool, e)) return ran
  try {
    if (!(await maestroHere($))) return ran
  } catch {
    return ran
  }
  handWarned = true
  return { ...ran, context: [...(ran.context ?? []), handWriteReminder()] }
}

/** Le rappel « Maestro n'exécute pas » (#250), une fois par tour qui a exécuté. */
function maestroExecNote(): string | undefined {
  if (maestroExec.length === 0) return undefined
  const text = maestroExecReminder(maestroExec)
  maestroExec = []
  return text
}
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

/** #366 : les #N publiés par ce Maestro dans ce chargement, en test jusqu'au « c'est bon » de la personne. */
let publishedTests: string[] = []

/**
 * Le rappel « en test » d'une publication de Maestro (#366) : la version et les #N ouverts lus dans la
 * sortie de `release.py release`, la session d'origine de chacun, la carte de test entière. Publication
 * lancée en arrière-plan (pas de sortie) : le rappel de la poser à sa fin. Rien sans #N ouvert.
 */
async function testAfterRelease($: EngineInterface, command: string, stdout: string): Promise<string | undefined> {
  const pub = publishedRelease(stdout)
  const ids = pub ? pub.ids : releaseCommandIds(command)
  if (ids.length === 0) return undefined
  const source = await sourceNow($)
  if (!source) return undefined
  const open = await load($, files(source).open, 'ROADMAP.md')
  if (typeof open === 'string') return undefined
  const kept = ids.flatMap(id => open.filter(t => t.id === id && !t.done))
  if (kept.length === 0) return undefined
  publishedTests = [...new Set([...publishedTests, ...kept.map(t => t.id as string)])]
  if (!pub) return testLaterReminder(kept.map(t => t.id as string))
  const titles = await loadTitles($)
  const rows = (await readListRows($)).rows
  const own = await readOwnSession($)
  // Ce que la tâche a changé (#269, gardé dans le store à chaque fin de tour) : la session de test dit quoi essayer.
  const tasks = await Promise.all(kept.map(async t => {
    const id = t.id as string
    const origin = originSession(rows, id)
    const changes = changesOf(await $.store.get(changesKey(source.name, id)).catch(() => undefined))?.zones ?? []
    return {
      id,
      name: t.nom ?? cachedTitle(t, titles) ?? fallbackTitle(t.label),
      label: t.label,
      changes: changes.map(z => ({ name: z.name, ...(z.why !== undefined ? { why: z.why } : {}) })),
      ...(origin ? { origin } : {}),
    }
  }))
  return testReminder({ version: pub.version, tasks, main: source.root ?? source.dir, ...(own.id ? { maestro: own.id } : {}) })
}

/** La consigne d'une session de test (#366), à chaque message de la personne : rien hors d'une session « Tester #N · X.Y.Z ». */
async function testSessionText($: EngineInterface): Promise<string | undefined> {
  // La fiche déjà lue seulement : un message ne relit pas la fiche de la session (le brief porte les règles d'ici là).
  const own = ownSession
  const test = own ? testTitle(own.title) : undefined
  if (!own || !test) return undefined
  const origin = originSession((await readListRows($)).rows, test.id)
  return testSessionNote({ ...test, ...(origin ? { origin } : {}), ...(own.parent ? { maestro: own.parent } : {}) })
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
let stopTurn: { id: string; stopRan: boolean; fromReminder: boolean; background?: unknown } = { id: '', stopRan: false, fromReminder: false }

/** Les commandes `run_in_background` du fil principal encore en vol (identifiant → heure de départ), #347. */
let backgroundShells = new Map<string, number>()
/** Une commande de fond suivie plus d'une heure est tenue pour finie (sa notification a pu se perdre). */
const BACKGROUND_SHELL_MAX_MS = 3_600_000
/** Le message qui lance le tour est la notification d'une tâche de fond : pas un vrai message (#347). */
let noticeTurn = false

/**
 * Les tours finis sans Stop de ce chargement (#219) : sous sec-default, l'app dit « hook was skipped » pour
 * chaque hook classic enregistré. En Compte Auto, au `CLASSIC_SKIPS_OFF`-ième sans qu'un seul Stop ait tourné,
 * le module passe son option Compte à `team` ; rechargé, il n'enregistre plus ces hooks. Une demande par chargement.
 */
let classicSkips = { skipped: 0, stopSeen: false, asked: false }

/** Un tour du fil principal fini par une réponse : Stop a-t-il tourné ? Le deuxième saut passe le Compte Auto à Team (#219, #223). */
async function noteClassicSkip($: EngineInterface, stopRan: boolean): Promise<void> {
  if (settings.account !== 'auto' || classicSkips.asked) return
  if (stopRan) {
    classicSkips.stopSeen = true
    return
  }
  classicSkips.skipped += 1
  if (classicSkips.stopSeen || classicSkips.skipped < CLASSIC_SKIPS_OFF) return
  classicSkips.asked = true
  // Deux plugins « roadmap » actifs : la ligne s'appelle `roadmap@<id>.account`, et la clé courte est refusée (#227).
  const name = $.plugin.name
  let keys = [`${name}.account`]
  try {
    keys = ownOptions(await $.config.list(), name).find(o => o.field === 'account')?.keys ?? keys
  } catch {
    // liste illisible : la clé d'un plugin seul
  }
  await noteAccountSwitch($, { keys })
  const outcome: Record<string, string> = {}
  for (const key of keys) {
    try {
      const { deny } = await $.config.set({ key, value: 'team' })
      outcome[key] = deny === undefined ? 'team' : `refusé : ${deny}`
    } catch (err) {
      // option non écrite : les hooks restent, et leurs secours tiennent
      outcome[key] = `refusé : ${err instanceof Error ? err.message : String(err)}`
    }
  }
  await noteAccountSwitch($, { outcome })
}

const ACCOUNT_SWITCH_KEY = 'account-switch'

/**
 * Le sort de la bascule du Compte Auto sur Team (#227), au store, clé `account-switch` : les clés visées, puis ce que le
 * moteur a répondu pour chacune. Une ligne grise restée sur une autre machine se lit dans `~/.claude/plugins/store/roadmap_*.json`.
 */
async function noteAccountSwitch($: EngineInterface, part: Record<string, unknown>): Promise<void> {
  try {
    const stored = await $.store.get(ACCOUNT_SWITCH_KEY)
    const seen = typeof stored === 'object' && stored !== null && !Array.isArray(stored) ? stored : {}
    await storeSet($, ACCOUNT_SWITCH_KEY, { ...seen, ...part, at: await $.clock.now(), version: sessionVersion ?? '?' })
  } catch {
    // store illisible, ou module déjà rechargé par l'écriture : la bascule tient sans sa note
  }
}

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
  // Les rappels de la roadmap : seulement dans un projet qui en a une, capture allumée. Le compte rendu
  // n'en est plus (#261) : remis avec l'écriture, il ne relance plus le modèle pour un second message.
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
      // #327 : mode Code seulement ; git illisible, pas de note.
      if (projectSettings(c.source).travail !== 'projet') notes.push(await delegationReminder($))
    } catch {
      // git illisible : pas de rappel de délégation
    }
    notes.push(designNote(c))
    try {
      // Des étapes recommandées (#293) : leur rappel prend la place de celui d'une idée.
      notes.push((await studyNote($, c, last)) ?? (await ideaNote($, c, last)))
    } catch {
      // pas de rappel d'idée
    }
  }
  // Le bloc « Ce qui a changé » (#269) : prête sans lui, les zones de sa branche sans phrase.
  if (settings.capture && c) {
    try {
      notes.push(await changesNote($, last))
    } catch {
      // git ou store illisibles : pas de rappel
    }
  }
  // La fidélité à la maquette (#357) : prête, un rendu tiré d'une maquette sans sa preuve.
  try {
    notes.push(await fidelityNote($, last))
  } catch {
    // git illisible : pas de rappel de fidélité
  }
  // La clôture partielle (#245) : finie, sa ligne attend encore un tiers.
  if (settings.capture && c) {
    try {
      notes.push(await partialNote($, last))
    } catch {
      // roadmap illisible : pas de rappel de clôture partielle
    }
  }
  // La liste d'étapes (#98, #104) : dans tout projet ; après une fusion ou une publication (#136).
  notes.push(stepListNote())
  notes.push(deliveryNote())
  // Maestro qui a exécuté lui-même (#250) : la session fille à la place.
  notes.push(maestroExecNote())
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
 * défaut), les bilans déjà écrits, et si `_cowork/cowork.py` les écrit (pas quand cowork.json confie
 * la roadmap au plugin, #262).
 */
async function loadBilan($: EngineInterface, source: Source): Promise<BilanData> {
  const [cow, tool] = await Promise.all([
    readOr($, `${source.dir}/cowork.json`),
    $.fs.exists(`${source.dir}/_cowork/cowork.py`).catch(() => false),
  ])
  const config = bilanConfigFor(cow)
  return { config, bilans: parseBilans((await readOr($, `${source.dir}/${config.log}`)) ?? ''), viaCowork: coworkPyWrites(tool, cow) }
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
    const problems = [...newProblems(c.seen[key], after, done, { requis, requiredOn, cles, today: todayOf(Date.now()), closed: doneIds(now.done) }), ...ids[key].filter(p => !old.has(p.text))]
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
  // #242 : une ligne cochée dont une communication n'est pas partie.
  if (now.done !== undefined && now.done !== c.seen.done) {
    const before = doneIds(c.seen.done)
    for (const t of parseRoadmap(now.done, 'ROADMAP-fait.md')) {
      if (!t.done || t.id === undefined || before.has(t.id)) continue
      const unsent = await unsentDeliverables($, c.source, t).catch(() => [])
      if (unsent.length > 0) notes.push(unsentRefusal(t.id, unsent, 'close'))
    }
  }
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
async function written(
  $: EngineInterface,
  run: () => Promise<ToolCallResult>,
  path: string | undefined,
  own = true,
  read?: (ran: ToolCallResult) => void,
): Promise<ToolCallResult> {
  const reread = async () => (settings.capture && capture ? await roadmapNow($, capture.source) : undefined)
  const before = own ? await reread() : undefined
  const ran = await run()
  if (ran.deny === undefined && ran.isError !== true) read?.(ran)
  // Une commande en lecture seule n'écrit rien : rien à relire.
  if (ran.isReadOnly === true) return ran
  const done = await afterWrite($, ran, path, own ? before : await reread())
  // #244 : ce que cette écriture-ci a changé, ajouté au compte rendu du tour ; `seen` vient d'être relu.
  if (own && before !== undefined && capture && ran.deny === undefined && ran.isError !== true) {
    try {
      reportTurn.changes = mergeChanges(reportTurn.changes, roadmapChanges(before, capture.seen))
      if (path === undefined || /roadmap-questions\.json$/i.test(path)) reportTurn.touched = true
      // #261 : le journal du tour, cumulé, vient avec l'écriture.
      const note = await reportNote($)
      if (note !== undefined) return { ...done, context: [...(done.context ?? []), note] }
    } catch {
      // roadmap illisible : cette écriture manque au compte rendu
    }
  }
  return done
}

/** Ce que l'outil Bash donne d'un appel : la commande, et son délai (ms) au premier plan. */
type BashCall = { command: string; timeout?: number; run_in_background?: boolean }

/** L'attente plus la suite tiennent dans les 10 min que l'outil Bash accorde au plus à un appel au premier plan. */
const QUEUE_TIMEOUT_MS = 600_000

/**
 * La file des tests lourds (#222, BBR, 2026-11-02) : une suite lourde passe par `one-at-a-time.sh` du
 * plugin, une à la fois par projet ; au premier plan, son délai monte à 10 min. Une réécriture en
 * échec laisse la commande telle quelle.
 */
function inQueue<E extends BashCall>($: EngineInterface, e: E): E {
  try {
    const command = queuedCommand(e.command, $.plugin.root)
    if (command === undefined) return e
    return e.run_in_background === true ? { ...e, command } : { ...e, command, timeout: Math.max(e.timeout ?? 0, QUEUE_TIMEOUT_MS) }
  } catch {
    return e
  }
}

/**
 * Garde-fou du dossier principal (#87, Bertrand, 2026-10-28) : en bypass, plus rien ne demande la
 * permission, et les règles du dossier principal partagé ne tenaient plus que par les consignes. Le
 * plugin refuse donc lui-même, dans tous les modes, les commandes git qu'elles y interdisent. Une
 * commande sans git interdit ne coûte aucun appel ; un dépôt sans autre worktree garde son git libre.
 * Toute ligne se lit, même sans le mot `git` tel quel (`g\it`, `$'\x67it'`, #230).
 */
async function guardBash($: EngineInterface, command: unknown): Promise<string | undefined> {
  if (typeof command !== 'string') return undefined
  let hits: GitHit[]
  const cwd = await $.session.cwd()
  try {
    hits = forbiddenGit(command, cwd, (await $.env.get('HOME')) ?? '')
  } catch {
    // Une ligne qui fait échouer la lecture se refuse dans un dépôt partagé, comme un dossier illisible (#230).
    hits = [{ rule: 'ligne illisible', dir: `${cwd}/$?`, anywhere: false, loose: true }]
  }
  for (const hit of hits) {
    const repo = /[$`]/.test(hit.dir) ? undefined : await repoOf($, hit.dir)
    if (repo) {
      if (repo.shared && (hit.anywhere || repo.top === repo.main)) return guardText(hit, repo.main)
      continue
    }
    // Le clone qu'un `git clone` réussi vient de créer dans la ligne : un dépôt à lui (#309).
    if (hit.fresh) continue
    // Un dossier qu'on ne sait pas lire (variable, hors dépôt) : refusé si le dépôt de la session
    // est partagé, plutôt que laissé passer (relecture de sécurité du 2026-10-29).
    const own = await repoOf($, cwd)
    if (own?.shared) return guardText(hit, own.main, true)
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
async function localSource($: EngineInterface): Promise<Source | undefined> {
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
 * Les réglages du projet que le volet Réglages change (#278) : seulement quand sa roadmap est déclarée par
 * un `.claude/roadmap.json`, celui que lit le panneau. Une écriture redessine le panneau.
 */
async function settingsProject($: EngineInterface): Promise<SettingsProject | undefined> {
  const source = await localSource($)
  if (!source?.root) return undefined
  const path = `${source.root}/.claude/roadmap.json`
  if (!(await $.fs.exists(path).catch(() => false))) return undefined
  return { name: source.name, path, mission: projectSettings(source).mission, changed: () => update($, stampAtom, v => v + 1) }
}

/**
 * La source de la session : celle de son dossier, sauf pour une session « #N · … » (pas un Maestro)
 * dont la tâche vit dans la roadmap d'un autre projet (#213 : la #266 de Splitmybill, lancée par Maestro
 * dans un worktree de Roadmap) ; c'est alors la roadmap de ce projet, celle où elle travaille.
 */
async function currentSource($: EngineInterface): Promise<Source | undefined> {
  const local = await localSource($)
  // Le titre déjà lu, sans appel : un message ne relit pas la fiche de la session ; le panneau, qui la
  // lit, relance la source quand le titre change (`sourceTitle`).
  sourceTitle = ownSession?.title
  if (!ownSession) return local
  try {
    const own = ownSession
    const id = sessionTitleId(own.title)
    if (id === undefined || isMaestroSession(own.title) || (own.id !== undefined && (await loadMaestros($))[own.id] !== undefined)) return local
    return (await taskSource($, id, own.title, local)) ?? local
  } catch {
    return local
  }
}

/**
 * Où vit la tâche #N d'une session (#213) : trouvée, gardée pour la session ; absente partout, relue
 * au plus toutes les 15 s, et `missingSearch` dit les roadmaps lues (l'alerte « #N introuvable »).
 */
let taskSourceMemo: { key: string; source: Source | null } | undefined
let sourceTitle: string | undefined
let missingSearch: { id: string; names: string[]; at: number } | undefined
const MISSING_RETRY_MS = 15_000

async function taskSource($: EngineInterface, id: string, title: string, local: Source | undefined): Promise<Source | undefined> {
  const key = `${id}\u0000${title}\u0000${local?.dir ?? ''}`
  if (taskSourceMemo?.key === key) return taskSourceMemo.source ?? undefined
  const now = await $.clock.now()
  if (missingSearch?.id === id && now - missingSearch.at < MISSING_RETRY_MS) return undefined
  const has = async (s: Source) => {
    const texts = await Promise.all(Object.values(files(s)).map(path => readOr($, path)))
    return texts.some(text => text !== undefined && taskIdIn(text, id))
  }
  if (local && (await has(local))) {
    taskSourceMemo = { key, source: null }
    return undefined
  }
  const candidates: { source: Source; tasks: Task[] }[] = []
  for (const s of await otherSources($, local)) {
    if (!(await has(s))) continue
    const { open, done } = files(s)
    const [a, b] = await Promise.all([load($, open, 'ROADMAP.md'), load($, done, 'ROADMAP-fait.md')])
    candidates.push({ source: s, tasks: [...(typeof a === 'string' ? [] : a), ...(typeof b === 'string' ? [] : b)] })
  }
  const root = await $.session.root()
  const ran = await $.process.run(['git', '-C', root, 'branch', '--show-current']).catch(() => undefined)
  const branch = ran?.exitCode === 0 ? ran.stdout.trim() : undefined
  const found = pickTaskSource({ id, title, ...(branch ? { branch } : {}), candidates })
  if (!found) {
    const others = (await otherSources($, local)).map(s => s.name)
    missingSearch = { id, names: [...(local ? [local.name] : []), ...others], at: now }
    return undefined
  }
  missingSearch = undefined
  const source = await withWork($, found, mainCheckout(found.root ?? found.dir))
  taskSourceMemo = { key, source }
  return source
}

/**
 * Les autres roadmaps du Mac (#213) : celles de `~/.claude/roadmap-perso.json`, puis les projets voisins
 * du dossier principal qui en ont une (`.claude/roadmap.json` ou `ROADMAP.md`), sans les copies de
 * travail (leur `.git` est un fichier), réduites à leur roadmap et à leurs clés (`discoveredSource`).
 */
async function otherSources($: EngineInterface, local: Source | undefined): Promise<Source[]> {
  const perso = await readPerso($)
  const home = mainCheckout(await $.session.root())
  const parent = home.replace(/\/[^/]+\/?$/, '')
  const me = settings.me.length > 0 ? settings.me : perso.me
  const found: Source[] = [...perso.sources]
  const entries = parent === '' ? [] : await $.fs.list(parent).catch(() => [])
  for (const entry of entries) {
    if (entry.kind !== 'dir' || entry.name.startsWith('.')) continue
    const base = `${parent}/${entry.name}`
    if (base === home) continue
    const git = await $.fs.stat(`${base}/.git`).catch(() => undefined)
    if (git?.kind === 'file') continue
    const config = `${base}/.claude/roadmap.json`
    const parsed = (await $.fs.exists(config)) ? parseProjectConfigSafe(await readOr($, config), base, { name: baseName(base), me }) : undefined
    // Un voisin que personne n'a déclaré : sa roadmap, pas ses consignes.
    const declared = parsed && discoveredSource(parsed, base)
    if (parsed && !declared) continue
    if (declared) found.push(declared)
    else if (await $.fs.exists(`${base}/ROADMAP.md`)) found.push({ name: baseName(base), me, match: [base], dir: base, subjects: [] })
  }
  const seen = new Set(local ? [local.dir] : [])
  return found.filter(s => !seen.has(s.dir) && (seen.add(s.dir), true))
}

function parseProjectConfigSafe(text: string | undefined, base: string, defaults: { name: string; me: string[] }): Source | undefined {
  try {
    return text === undefined ? undefined : parseProjectConfig(text, base, defaults)
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

/**
 * Le nom du journal des bilans d'un dossier (lu dans `cowork.json`), gardé par dossier : la minuterie ne
 * relit plus `cowork.json` toutes les 3 s (#337, O1) ; le pas complet de 15 s (`refresh`) l'oublie.
 */
const bilanLogs = new Map<string, string>()

async function bilanLogOf($: EngineInterface, source: Source): Promise<string> {
  const kept = bilanLogs.get(source.dir)
  if (kept !== undefined) return kept
  const log = bilanConfigFor(await readOr($, `${source.dir}/cowork.json`)).log
  bilanLogs.set(source.dir, log)
  return log
}

/**
 * Les `fs.stat` d'un pas de minuterie, mis en commun (#337, O1) : `matchSessions` et `stampOf` regardent les
 * mêmes fichiers dans le même pas. Hors d'un pas (`poll`), chaque appel lit.
 */
let tickStats: Map<string, Promise<{ mtimeMs: number; size: number }>> | undefined

function statOnce($: EngineInterface, path: string): Promise<{ mtimeMs: number; size: number }> {
  if (!tickStats) return $.fs.stat(path)
  const memo = tickStats
  let stat = memo.get(path)
  if (!stat) {
    stat = $.fs.stat(path)
    memo.set(path, stat)
    stat.catch(() => memo.delete(path))
  }
  return stat
}

async function stampOf($: EngineInterface, source: Source): Promise<number> {
  let sum = 0
  const { open, done } = files(source)
  // Le log des bilans aussi : un bilan écrit redessine le détail de sa task.
  const bilanLog = await bilanLogOf($, source)
  for (const path of [open, done, `${source.dir}/${bilanLog}`]) {
    try {
      sum += (await statOnce($, path)).mtimeMs
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

/**
 * Le parse d'un fichier de la roadmap, gardé tant que sa date et sa taille ne bougent pas (#337, O1) : un pas
 * de 3 s sans changement ne relit plus les deux fichiers (250 Ko sur 600 tâches). Une lecture en panne, ou un
 * fichier dont la date est illisible, ne se garde pas : la suivante relit. Seule la minuterie (`matchSessions`)
 * s'en sert : un dessin dont la version a changé (« Réessayer », une écriture du plugin) relit toujours.
 */
const parsedFiles = new Map<string, { stamp: string; tasks: Task[] }>()

async function loadParsed($: EngineInterface, path: string, file: string): Promise<Task[] | string> {
  let stamp: string | undefined
  try {
    const st = await statOnce($, path)
    stamp = `${st.mtimeMs}:${st.size}`
  } catch {
    stamp = undefined
  }
  const kept = parsedFiles.get(path)
  if (stamp !== undefined && kept?.stamp === stamp) return kept.tasks
  const tasks = await load($, path, file)
  if (typeof tasks === 'string' || stamp === undefined) parsedFiles.delete(path)
  else parsedFiles.set(path, { stamp, tasks })
  return tasks
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
      await storeSet($, STORE_KEY, titles)
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
  if (pruned) await storeSet($, LIVE_KEY, live)
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

/**
 * Le mode de permission de cette session, relu à chaque fois : la personne le change sous la saisie.
 * Fiche refusée ou illisible : `undefined`, et rien ne change (#248).
 */
async function ownMode($: EngineInterface): Promise<string | undefined> {
  try {
    const ran = await $.tool.call({ tool: GET_SESSION_TOOL, session_id: 'self' })
    return ran.deny === undefined && !ran.isError ? sessionModeIn(ran.text ?? '') : undefined
  } catch {
    return undefined
  }
}

/**
 * « Passer en bypass » (#248) : la carte refusée par le mode auto, la fiche propose ce geste. L'app
 * montre sa carte d'approbation ; accordé, le ▶ de la tâche revient, sinon la note dit le sélecteur.
 */
async function switchToBypass($: EngineInterface, key: string): Promise<void> {
  let granted = false
  try {
    const ran = await $.tool.call({ tool: SET_MODE_TOOL, session_id: 'self', mode: BYPASS_MODE })
    granted = ran.deny === undefined && !ran.isError
  } catch {
    // outil absent : la note dit le geste à faire à la main
  }
  await setView($, v => ({ launchNote: autoBypassNote(granted), launched: granted ? v.launched.filter(k => k !== key) : v.launched }))
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
  await storeSet($, MAESTROS_KEY, { ...Object.fromEntries(kept), [own.id]: now })
  // La marque n'est pas un atome : sans ce redessin, la bande attendait qu'une session bouge (#225).
  await update($, liveVersionAtom, v => v + 1)
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
    await storeSet($, PROPOSALS_KEY, [...(await loadProposals($)), proposal])
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
async function launchWithMode($: EngineInterface, e: unknown, post: (card: Record<string, unknown>) => Promise<ToolCallResult>): Promise<ToolCallResult> {
  const card = e as Record<string, unknown>
  // Depuis le mode auto, pas de bypass : son contrôle refuserait la carte (#248).
  const changed = settings.launchBypass && wantsBypass(true, await ownMode($)) ? bypassCard(card) : undefined
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
  if (rest.length !== kept.length) await storeSet($, PROPOSALS_KEY, rest)
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

/** Le panneau a déjà demandé si le parent est un Maestro (#233) : une fois, ensuite les hooks le tiennent. */
let parentAsked = false

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

/** L'heure du moteur, sinon celle du processus : une horloge en panne ne coupe pas le suivi (#347). */
async function clockOrDate($: EngineInterface): Promise<number> {
  try {
    return await $.clock.now()
  } catch {
    return Date.now()
  }
}

/**
 * Le travail de fond en vol à la fin du tour (#347) : le `background_tasks` du Stop du même tour fait foi ;
 * sans lui (Stop sauté), les agents de `$.agent.list()` et les commandes suivies depuis moins d'une heure.
 * Ne lève jamais : une panne ou un refus compte pour « rien en vol ».
 */
async function inFlight($: EngineInterface, turnId: string): Promise<BackgroundWork | undefined> {
  try {
    if (stopTurn.id === turnId && Array.isArray(stopTurn.background)) return backgroundWork({ stopTasks: stopTurn.background })
    let agents: unknown = []
    try {
      agents = await $.agent.list()
    } catch {
      agents = []
    }
    const now = await clockOrDate($)
    backgroundShells = new Map([...backgroundShells].filter(([, at]) => now - at < BACKGROUND_SHELL_MAX_MS))
    return backgroundWork({ agents, commands: [...backgroundShells.keys()] })
  } catch {
    return undefined
  }
}

/**
 * Une session lancée par Maestro lui dit, par message, l'état où elle s'arrête (#131) : l'app ne le
 * réveille que quand toutes ses sessions sont au repos. Une fois par état ; rien sans Maestro pour
 * parent ; aucune panne (fiche, message refusé) ne bloque le tour.
 */
async function tellMaestro($: EngineInterface, said: ChildWake | (() => Promise<ChildWake>)): Promise<void> {
  if (typeof said !== 'function' && said.key === toldMaestro) return
  try {
    if (!(await parentIsMaestro($))) return
    // Lue seulement chez une fille de Maestro : le travail de fond coûte un appel au moteur (#347).
    const wake = typeof said === 'function' ? await said() : said
    if (wake.key === toldMaestro) return
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
      await storeSet($, key, { ...changed, at: opts.keepAt && prev.at > 0 ? prev.at : now })
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
type ParentLines = { open: Set<string>; done: Set<string>; mode?: Mode; match: string[]; attend: Map<string, string | undefined>; me: string[] }

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
      const open = await load($, files(source).open, 'ROADMAP.md')
      // #245 : l'`attend:` de chaque ligne ouverte, pour la clôture partielle.
      const attend = new Map(typeof open === 'string' ? [] : open.flatMap(t => (t.id && !t.done ? [[t.id, t.attend] as const] : [])))
      return { open: ids(open), done: ids(await load($, files(source).done, 'ROADMAP-fait.md')), ...(source.mode ? { mode: source.mode } : {}), match: source.match, attend, me: [...source.me] }
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
  // #245 : la ligne encore ouverte de chaque enfant au repos qui a fini ses étapes, pour la clôture partielle.
  const openLines: Record<string, { id: string; attend?: string }> = {}
  let me: string[] = []
  const resting = children.filter(c => !c.running && (statuses[c.id]?.steps.length ?? 0) > 0 && (statuses[c.id]?.steps ?? []).every(s => s.status === 'completed'))
  if (resting.length > 0) {
    try {
      const known = await lines()
      if (known) {
        me = known.me
        for (const c of resting) {
          const n = sessionTitleId(c.title)
          if (n && known.attend.has(n) && !known.done.has(n)) openLines[c.id] = { id: n, ...(known.attend.get(n) ? { attend: known.attend.get(n) as string } : {}) }
        }
      }
    } catch {
      // roadmap illisible : les nouvelles d'avant, sans la clôture partielle
    }
  }
  // #366 : une tâche en test (sa session d'origine, sa session de test) attend la personne : ni « prête » ni « silencieuse ».
  const alerts = withoutTests(childAlerts({ children, statuses, finished, alerted, now: await $.clock.now(), lines: openLines, me }), testsUnder(rows, publishedTests))
  // Les relances de cette fois s'ajoutent, avec l'étape de l'enfant ; un enfant qui n'est plus listé sort.
  const next: Record<string, ChildRelaunch> = {}
  for (const child of children) if (alerted[child.id] !== undefined) next[child.id] = alerted[child.id] as ChildRelaunch
  for (const a of alerts) if (a.kind === 'silent' && !a.relaunched) next[a.child.id] = { at: a.child.lastActivityAt, ...(a.step ? { step: a.step } : {}) }
  if (Object.keys(next).length === 0) {
    if (stored !== undefined) await storeDelete($, alertedKey)
  } else if (JSON.stringify(next) !== JSON.stringify(alerted)) {
    await storeSet($, alertedKey, next)
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
      if (!fresh(childStatusOf(await $.store.get(key))?.at)) await storeDelete($, key)
    } else if (key.startsWith(CHILD_ALERTED_PREFIX)) {
      const value = await $.store.get(key)
      const ats = typeof value === 'object' && value !== null ? Object.values(value).map(v => (v as { at?: unknown } | null)?.at) : []
      if (!ats.some(fresh)) await storeDelete($, key)
    }
  }
}

/**
 * Le nom montré d'une tâche (#263) : celui du titre de sa session ouverte (`sessionName`), que dit la liste
 * latérale de l'app, sinon son titre court (`taskTitle`). Le titre d'une session ne change jamais : c'est
 * l'écran qui s'aligne sur lui (AAFES Cowork, 2026-11-03 : la bande disait « Campagne DCO 26… » pour
 * « #565 · Lancer la Weekly Deals »).
 */
function shownTitle(task: Task, titles: Readonly<Record<string, { titre: string }>>, sessionTitle = sessionMatches.get(taskKey(task))?.title): string {
  return sessionName(sessionTitle ?? '') ?? taskTitle(task, titles)
}

/** Le titre d'une session parmi les rangées lues de l'app. */
function rowTitle(sessionId: string): string | undefined {
  const row = sessionRows.find(r => (r as { sessionId?: unknown } | null)?.sessionId === sessionId) as { title?: unknown } | undefined
  return typeof row?.title === 'string' ? row.title : undefined
}

/** Le titre court d'une tâche : son `nom:` (#235), sinon celui du cache, sinon les premiers mots du libellé. */
async function shortTitleOf($: EngineInterface, task: Task): Promise<string> {
  return taskTitle(task, await loadTitles($))
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
    await storeSet($, LIVE_KEY, live)
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
    const before = ownSession
    ownSession = { id: sessionIdIn(text), title: sessionTitleIn(text), parent: sessionParentIn(text) }
    // Une session renommée « Maestro … » (ou une fiche enfin lue) : la bande se redessine (#225).
    if (before?.id !== ownSession.id || before?.title !== ownSession.title) await update($, liveVersionAtom, v => v + 1)
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
    const tasks = await loadParsed($, files(source).open, 'ROADMAP.md')
    if (typeof tasks === 'string') return
    const doneTasks = await loadParsed($, files(source).done, 'ROADMAP-fait.md')
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
      const task = id !== undefined ? numbered.find(t => t.id === id) : taskForSessionTitle(sess.title, tasks, t => cachedTitle(t, titles))
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

function parsePending(text: string, file: string): Task[] | string {
  try {
    return parseRoadmap(text, file)
  } catch (err) {
    return err instanceof Error ? err.message : String(err)
  }
}

async function paneData($: EngineInterface, source: Source, version: string): Promise<PaneData> {
  // L'attente d'affichage (#354) entre dans la clé ici, pas chez l'appelant : la marque (`brandData`) partage
  // ce cache, et deux clés différentes pour les mêmes données le faisaient relire à chaque dessin.
  const key = `${source.dir}\u0000${version}\u0000${pendingRev}`
  if (paneCache?.key === key) {
    perfCached = true
    return paneCache
  }
  const paths = files(source)
  // Une édition enregistrée et pas encore écrite (#354) : le panneau montre ce que la roadmap dira.
  const pending = pendingFor(source)
  const [palette, open, done, titles, live, ignored, bilan] = await Promise.all([
    paletteOf($),
    pending?.open !== undefined ? parsePending(pending.open, 'ROADMAP.md') : load($, paths.open, 'ROADMAP.md'),
    pending?.done !== undefined ? parsePending(pending.done, 'ROADMAP-fait.md') : load($, paths.done, 'ROADMAP-fait.md'),
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

// ── La sonde de visibilité (#337, préalable d'O12) ─────────────────────────────

/**
 * Le journal des surfaces de l'app vues par chaque session (`surface-log`, toutes sessions confondues, les
 * `SURFACE_LOG_ROWS` dernières lignes) : une arrivée (`session.attach`), un départ (`session.detach`), et au
 * pas complet de 15 s les surfaces que dit `$.session.surfaces()` quand elles ont changé. Il dira, dans
 * l'app, si une session prévient le plugin quand elle quitte l'écran : la condition d'O12.
 */
const SURFACE_LOG_KEY = 'surface-log'
const SURFACE_LOG_ROWS = 60
type SurfaceRow = { at: number; session?: string; event: 'attach' | 'detach' | 'tick'; surface?: string; reason?: string; surfaces?: string[] }
let surfacesSeen: string | undefined

async function noteSurface($: EngineInterface, row: Omit<SurfaceRow, 'at' | 'session'>): Promise<void> {
  try {
    const own = await readOwnSession($)
    const stored = await $.store.get(SURFACE_LOG_KEY)
    const rows = Array.isArray(stored) ? (stored as SurfaceRow[]) : []
    const next = [...rows, { at: await $.clock.now(), ...(own.id ? { session: own.id } : {}), ...row }]
    await storeSet($, SURFACE_LOG_KEY, next.slice(-SURFACE_LOG_ROWS))
  } catch {
    // store ou fiche illisible : la sonde se tait, rien d'autre ne change
  }
}

// ── Le repos d'une session cachée (#348, O12 de l'audit #337) ─────────────────

/**
 * Une session que l'app ne dessine plus nulle part (`$.session.surfaces()` vide : ni fenêtre de l'app, ni
 * terminal, qui compte comme une surface) est au repos : sa minuterie ne relit plus rien qu'une fois par
 * `REST_MS`. Une arrivée (`session.attach`) la réveille et la relit aussitôt. Une lecture des surfaces qui
 * échoue ne change rien : sans signal, la session reste à 3 s, comme avant (décision de BBR, 2026-11-06).
 */
const REST_MS = 60_000
let resting = false
/** L'heure de la dernière relecture faite au repos, ou de la mise au repos. */
let restReadAt = 0
/** Réveillée par une arrivée : le pas qui suit relit tout, sans attendre le pas complet. */
let wokeUp = false
/** Un réveil arrivé pendant un pas en vol : un pas repart dès qu'il finit. */
let pollAgain = false

/** Lit les surfaces et met la session au repos (aucune) ou à l'écran ; rend les surfaces, ou rien sur un échec. */
async function readVisibility($: EngineInterface): Promise<string[] | undefined> {
  let surfaces: string[]
  try {
    surfaces = [...(await $.session.surfaces())]
  } catch {
    return undefined
  }
  const hidden = surfaces.length === 0
  if (hidden && !resting) restReadAt = await $.clock.now()
  resting = hidden
  return surfaces
}

/** Une arrivée de l'app : la session sort du repos et se relit tout de suite. */
function wake($: EngineInterface): void {
  resting = false
  wokeUp = true
  if (polling) pollAgain = true
  else void poll($)
}

/** Les surfaces de cette session, notées au journal quand elles ont changé depuis le dernier pas complet. */
async function noteSurfacesSeen($: EngineInterface): Promise<void> {
  const surfaces = await readVisibility($)
  if (!surfaces) return
  const seen = JSON.stringify(surfaces)
  if (seen === surfacesSeen) return
  surfacesSeen = seen
  await noteSurface($, { event: 'tick', surfaces })
}

async function refresh($: EngineInterface): Promise<void> {
  await checkZones($)
  // Rien n'a changé : aucun dessin. Chaque étape ne redessine que ce qu'elle a vu bouger.
  const before = knownSource?.dir
  const source = await sourceNow($)
  if (!source) return
  // Le pas complet relit `cowork.json` : un journal des bilans renommé se voit dans les 15 s.
  bilanLogs.delete(source.dir)
  if (before !== undefined && before !== source.dir) await update($, themeStampAtom, v => v + 1)
  await refreshSessions($, source, false)
  if (await restamp($, source)) await summarize($, source)
  await noteSurfacesSeen($)
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
 * le `manifest.json` du dossier `rpm` qui contient ce plugin dit le dossier de l'entrée roadmap, rangée sous
 * `roadmap` ou sous le dépôt public `roadmap-plugin` (`STORE_MARKETS`, #281). Sinon le
 * catalogue local de Claude Code (#178) : l'entrée `roadmap@roadmap` de `installed_plugins.json`.
 * Ni l'un ni l'autre (`--plugin-dir`, terminal) : rien.
 */
async function appVersion($: EngineInterface): Promise<{ version?: string; source?: 'store' | 'local' }> {
  const rpm = $.plugin.root.replace(/\/[^/]+\/?$/, '')
  try {
    const manifest = JSON.parse(await $.fs.read(`${rpm}/manifest.json`)) as { plugins?: { id?: unknown; name?: unknown; marketplaceName?: unknown }[] }
    const entry = (manifest.plugins ?? []).find(p => p.name === 'roadmap' && STORE_MARKETS.includes(String(p.marketplaceName)))
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

// ---------------------------------------------------------------- la file des tests lourds (#321)

/** Les PID vivants de la file, relus par `ps` au plus toutes les 30 s et quand la file change ; `undefined` : `ps` illisible, tout PID vit. */
let queuePids: { key: string; at: number; alive?: Set<number> } = { key: '', at: 0 }
const QUEUE_PS_MS = 30_000
/** Ce que le dernier pas a vu de la file (et la minute) : changé, le panneau se redessine. */
let queueSeen = ''
/** Vrai quand le dernier dessin était celui de Maestro, seul à montrer la file : les pas ne la relisent que pour lui. */
let queueWanted = false

/**
 * La file des tests lourds du projet (#222, #249), lue des fichiers de one-at-a-time.sh (#321) : le dossier
 * qu'il nomme d'après le dossier git commun du dossier principal (ou ce dossier, sans git). Trois lectures de
 * fichiers ; un `ps` borné, seulement quand la file n'est pas vide, dit les PID morts. Rien ne lève.
 */
async function readQueue($: EngineInterface): Promise<HeavyQueue | undefined> {
  try {
    // Le dossier par défaut du script ; ROADMAP_LOCKS_DIR ne sert qu'à ses tests.
    const locks = `${((await $.env.get('HOME').catch(() => undefined)) ?? '').replace(/\/+$/, '')}/.claude/locks`
    const home = mainCheckout(await $.session.root())
    const git = await $.fs.stat(`${home}/.git`).catch(() => undefined)
    const dir = heavyQueueDir(locks, git?.kind === 'dir' ? `${home}/.git` : home)
    const text = (path: string) => $.fs.read(path).catch(() => undefined)
    const names = (await $.fs.list(`${dir}/queue`).catch(() => [])).filter(e => e.kind === 'file' && !e.name.startsWith('.')).map(e => e.name)
    const [owner, load, tickets] = await Promise.all([
      text(`${dir}/lock/owner`),
      text(`${dir}/lock/load`),
      Promise.all(names.map(async name => ({ name, text: (await text(`${dir}/queue/${name}`)) ?? '' }))),
    ])
    const now = await $.clock.now()
    const files = { ...(owner !== undefined ? { owner } : {}), ...(load !== undefined ? { load } : {}), tickets }
    const all = readHeavyQueue(files, Math.floor(now / 1000))
    if (!all) return undefined
    const pids = [...(all.owner ? [all.owner.pid] : []), ...all.waiting.map(w => w.pid)].sort((a, b) => a - b)
    const key = pids.join(',')
    if (key !== queuePids.key || now - queuePids.at >= QUEUE_PS_MS) {
      queuePids = { key, at: now }
      const ran = await $.process.run(['ps', '-o', 'pid=', '-p', key], { timeoutMs: 5_000 }).catch(() => undefined)
      // `ps -p` sort en 1 quand aucun PID ne vit ; tout autre code : illisible.
      if (ran && (ran.exitCode === 0 || ran.exitCode === 1)) queuePids.alive = new Set(ran.stdout.split(/\s+/).filter(Boolean).map(Number))
    }
    const alive = queuePids.alive
    return alive ? readHeavyQueue(files, Math.floor(now / 1000), pid => alive.has(pid)) : all
  } catch {
    return undefined
  }
}

/** Un pas de la minuterie chez Maestro : la file relue ; changée (ou une minute passée tant qu'elle n'est pas vide), le panneau se redessine. */
async function restampQueue($: EngineInterface): Promise<void> {
  if (!queueWanted) return
  const q = await readQueue($)
  const seen = q ? JSON.stringify([q, Math.floor((await $.clock.now()) / 60_000)]) : ''
  if (seen === queueSeen) return
  queueSeen = seen
  await update($, liveVersionAtom, v => v + 1)
}

// ---------------------------------------------------------------- Maestro dose ses sessions (#324)

/**
 * La file des lancements, commune à tous les Maestro du Mac (#345), et les cartes posées pas encore démarrées :
 * dans le store, ils survivent au rechargement. `launch-queue:<id>` est la file par Maestro de #324, versée une fois.
 */
const LAUNCH_QUEUE_KEY = 'launch-queue'
const LAUNCH_QUEUE_PREFIX = 'launch-queue:'
const LAUNCH_CARDS_KEY = 'launch-cards'
/** La charge du Mac, relue au plus toutes les 30 s, et seulement quand un lancement se décide. */
let doseLoad: { at: number; load?: MacLoad } = { at: -Infinity }
const DOSE_LOAD_MS = 30_000
/** Un départ raté (le message n'a pas pu se préparer) : la tête de file se réessaie une minute plus tard. */
let doseRetryAt = 0
const DOSE_RETRY_MS = 60_000
/** Les tâches que la relève vient de lancer : leur carte passe la décision (repli par Claude compris). */
const doseAllowed = new Map<string, number>()
/** Depuis quand chaque entrée d'un autre Maestro peut partir sans partir (#372, `liveQueue`). */
const queueSince = new Map<string, number>()
/** Ce que le dernier pas a vu de la file de ce Maestro, pour le bloc « En cours » ; changé, le panneau se redessine. */
type DoseView = { queue: (GlobalQueued & { rank: number })[]; projectTaken: number; projectMax: number; macTaken: number; macMax: number; queued: number; why: DoseWhy; load?: MacLoad }
let doseView: DoseView | undefined
let doseSeenKey = ''
/** La liste des sessions que le dernier pas à file vide a comptée (#367) : la même, rien à recompter. */
let idleRowsSeen: unknown[] | undefined
let relieving = false

/** Les deux plafonds réglés (options `projectSessions` et `macSessions`), 3 et 12 par défaut. */
function doseMaxes(): { projectMax: number; macMax: number } {
  const pos = (v: unknown, fallback: number) => (Number.isInteger(Number(v)) && Number(v) > 0 ? Number(v) : fallback)
  return { projectMax: pos(settings.projectSessions, 3), macMax: pos(settings.macSessions, 12) }
}

async function readMacLoad($: EngineInterface, now: number): Promise<MacLoad | undefined> {
  if (now - doseLoad.at < DOSE_LOAD_MS) return doseLoad.load
  doseLoad = { at: now }
  try {
    const ran = await $.process.run(['sysctl', '-n', 'vm.loadavg', 'hw.ncpu'], { timeoutMs: 5_000 })
    if (ran.exitCode === 0) doseLoad.load = macLoad(ran.stdout)
  } catch {
    // sysctl absent (hors macOS) : seul le plafond décide
  }
  return doseLoad.load
}

function globalQueueOf(value: unknown): GlobalQueued[] {
  if (!Array.isArray(value)) return []
  return value.filter((q): q is GlobalQueued => {
    const v = q as Partial<GlobalQueued> | null
    return (
      !!v && typeof v.id === 'string' && typeof v.title === 'string' && typeof v.at === 'number' && typeof v.maestro === 'string' && typeof v.project === 'string' &&
      Array.isArray(v.match) && Array.isArray(v.after) &&
      (typeof v.card === 'object' || typeof v.launch === 'object' || (v.kind === 'resume' && typeof v.sessionId === 'string'))
    )
  })
}

async function readGlobalQueue($: EngineInterface): Promise<GlobalQueued[]> {
  return globalQueueOf(await $.store.get(LAUNCH_QUEUE_KEY).catch(() => undefined))
}

/** Les sessions que la liste donne pour archivées : leurs entrées de la file n'ont plus de Maestro pour les lancer. */
function archivedIds(rows: readonly unknown[]): Set<string> {
  return new Set(rows.flatMap(r => {
    const row = r as { sessionId?: unknown; isArchived?: unknown }
    return typeof row.sessionId === 'string' && row.isArchived === true ? [row.sessionId] : []
  }))
}

/**
 * Écrit la file commune : relue juste avant, `change` ne s'applique qu'aux entrées de ce Maestro, celles d'un
 * Maestro archivé s'ôtent, celles des autres restent telles quelles. Rend la file écrite.
 */
async function writeOwnQueue($: EngineInterface, ownId: string, change: (own: GlobalQueued[]) => GlobalQueued[], rows?: readonly unknown[]): Promise<GlobalQueued[]> {
  const stored = await readGlobalQueue($)
  const gone = archivedIds(rows ?? (await readListRows($)).rows)
  const others = stored.filter(e => e.maestro !== ownId && !gone.has(e.maestro))
  const next = [...others, ...change(stored.filter(e => e.maestro === ownId))]
  if (JSON.stringify(next) !== JSON.stringify(stored)) await storeSet($, LAUNCH_QUEUE_KEY, next as unknown as StoreValue)
  return next
}

/** Les prérequis d'une tâche (`après:`), pour l'ordre de la file. */
function prereqsIn(tasks: readonly Task[]): (id: string) => readonly string[] {
  return id => (tasks.find(t => t.id === id)?.apres ?? '').split(/[,\s]+/).filter(Boolean)
}

/** Le projet de ce Maestro : sa racine, les préfixes de ses dossiers et son nom (le dernier segment de la racine). */
function doseProject(): { project: string; match: string[]; name: string } {
  const project = knownSource ? (knownSource.root ?? knownSource.dir) : ''
  return { project, match: knownSource?.match ?? [], name: project.split('/').filter(Boolean).pop() ?? '' }
}

/** La file de #324 de ce Maestro, versée une fois dans la file commune, puis effacée. */
async function migrateOldQueue($: EngineInterface, ownId: string): Promise<void> {
  const oldKey = `${LAUNCH_QUEUE_PREFIX}${ownId}`
  const old = queuedOf(await $.store.get(oldKey).catch(() => undefined))
  if (old.length === 0 || !knownSource) return
  const tasks = await load($, files(knownSource).open, 'ROADMAP.md')
  const after = prereqsIn(typeof tasks === 'string' ? [] : tasks)
  const { project, match } = doseProject()
  await writeOwnQueue($, ownId, own => [...own, ...old.filter(q => !own.some(o => o.id === q.id)).map(q => ({ ...q, maestro: ownId, project, match, after: [...after(q.id)] }))])
  await storeDelete($, oldKey)
}

function queuedOf(value: unknown): QueuedLaunch[] {
  if (!Array.isArray(value)) return []
  return value.filter((q): q is QueuedLaunch => {
    const v = q as Partial<QueuedLaunch> | null
    return !!v && typeof v.id === 'string' && typeof v.title === 'string' && typeof v.at === 'number' && (typeof v.card === 'object' || typeof v.launch === 'object')
  })
}

type DoseCard = { title: string; at: number; project: string }

async function doseCards($: EngineInterface, now: number): Promise<DoseCard[]> {
  const stored: unknown = await $.store.get(LAUNCH_CARDS_KEY).catch(() => undefined)
  if (!Array.isArray(stored)) return []
  return stored.filter((c): c is DoseCard => !!c && typeof c.title === 'string' && typeof c.at === 'number' && now - c.at < PLACE_IDLE_MS).map(c => ({ ...c, project: typeof c.project === 'string' ? c.project : '' }))
}

/** Une carte posée par Maestro réserve sa place, pour son projet et pour le Mac, jusqu'au Start de BBR (15 min au plus). */
async function reserveCard($: EngineInterface, title: string): Promise<void> {
  try {
    const now = await $.clock.now()
    const kept = (await doseCards($, now)).filter(c => c.title !== title)
    await storeSet($, LAUNCH_CARDS_KEY, [...kept, { title, at: now, project: doseProject().project }])
  } catch {
    // store illisible : la place se lira à l'ouverture de la session
  }
}

/** Les pauses du store (#367) : `session-pauses`, les valeurs mal formées ignorées. */
export async function readPauses($: EngineInterface): Promise<Record<string, SessionPause>> {
  return sessionPausesOf(await $.store.get(SESSION_PAUSES_KEY).catch(() => undefined))
}

/** Pose (ou, sans `p`, ôte) la pause d'une session (#367) : la clé relue juste avant, écrite par `storeSet`, effacée quand elle se vide. */
export async function writePause($: EngineInterface, sessionId: string, p: SessionPause | undefined): Promise<void> {
  const current = await readPauses($)
  const next = { ...current }
  if (p) next[sessionId] = p
  else delete next[sessionId]
  if (JSON.stringify(next) === JSON.stringify(current)) return
  if (Object.keys(next).length === 0) await storeDelete($, SESSION_PAUSES_KEY)
  else await storeSet($, SESSION_PAUSES_KEY, next as unknown as StoreValue)
}

/** Ce que les décisions de ce pas lisent : les places du Mac, les cartes réservées, la charge, les plafonds. */
type DoseState = { pauses: Record<string, SessionPause>; maestros: Set<string>; statuses: Map<string, ChildStatus | undefined>; rows: unknown[]; cwds: string[]; reserved: string[]; cards: DoseCard[]; macTaken: number; load?: MacLoad; projectMax: number; macMax: number }

async function doseState($: EngineInterface, now: number, read?: Record<string, SessionPause>, cached = false): Promise<DoseState> {
  const pauses = read ?? (await readPauses($))
  // `cached` (#367) : la dernière liste lue, sans appel d'outil ; la file vide ne fait pas relire la liste à chaque pas (#348).
  const rows = cached ? lastListRows : (await readListRows($)).rows
  const statuses = new Map<string, ChildStatus | undefined>()
  for (const raw of rows) {
    const r = raw as { sessionId?: unknown; title?: unknown; isRunning?: unknown }
    if (typeof r.sessionId === 'string' && typeof r.title === 'string' && r.isRunning !== true && sessionTitleId(r.title) !== undefined) {
      statuses.set(r.sessionId, childStatusOf(await $.store.get(`${CHILD_STATUS_PREFIX}${r.sessionId}`).catch(() => undefined)))
    }
  }
  const maestros = maestroSessionIds(rows, new Set(Object.keys(await loadMaestros($))))
  const cards = await doseCards($, now)
  // #367 : une session en pause ne tient aucune place
  const paused = new Set(Object.entries(pauses).flatMap(([id, p]) => (p.state === 'paused' ? [id] : [])))
  const places = launchPlaces(rows, id => statuses.get(id), cards, now, maestros, doseProject().match, paused)
  const { projectMax, macMax } = doseMaxes()
  const load = places.taken < macMax ? await readMacLoad($, now) : doseLoad.load
  return { pauses, maestros, statuses, rows, cwds: places.cwds, reserved: places.reserved, cards, macTaken: places.taken, ...(load ? { load } : {}), projectMax, macMax }
}

/** Les places d'un projet : ses sessions (par `cwd`) et ses cartes réservées dont la session n'est pas ouverte. */
function placesOf(state: DoseState, project: string, match: readonly string[]): number {
  const cards = state.cards.filter(c => c.project === project && state.reserved.includes(sessionTitleId(c.title) ?? '')).length
  return projectTaken(state.cwds, match) + cards
}

/** La décision pour un projet : son plafond, celui du Mac, puis la charge. */
function gateFor(state: DoseState, project: string, match: readonly string[]) {
  return launchGate({ projectTaken: placesOf(state, project, match), projectMax: state.projectMax, macTaken: state.macTaken, macMax: state.macMax, ...(state.load ? { load: state.load } : {}) })
}

/**
 * Le lancement d'une tâche chez Maestro passe-t-il (#324, #345) ? Il passe quand aucune entrée de la file commune
 * qui peut partir n'est devant lui et que son projet a une place ; sinon il entre dans la file, à son rang du Mac,
 * et la réponse est le refus à dire. Une entrée devant retenue par son projet plein, ou lâchée par son Maestro
 * (`liveQueue`), ne le retient pas (#372). Hors Maestro, sans numéro, lancé par la relève, ou l'option « File de
 * lancement » éteinte (#372) : il passe.
 */
async function doseLaunch($: EngineInterface, id: string | undefined, entry: Omit<QueuedLaunch, 'at' | 'id'>): Promise<{ refusal?: string; ownId?: string }> {
  if (id === undefined || !settings.launchQueue) return {}
  try {
    if (!(await maestroHere($))) return {}
    const own = await readOwnSession($)
    if (!own.id) return {}
    const ownId = own.id
    const now = await $.clock.now()
    const allowed = doseAllowed.get(id)
    if (allowed !== undefined && now < allowed) return { ownId }
    await migrateOldQueue($, ownId)
    const { project, match, name } = doseProject()
    const state = await doseState($, now)
    const gate = gateFor(state, project, match)
    const queue = await readGlobalQueue($)
    const gateOf = (e: GlobalQueued) => gateFor(state, e.project, e.match)
    const head = queueHead(liveQueue(globalQueueOrder(queue), gateOf, ownId, queueSince, now), gateOf)
    if (gate.go && (!head || (head.maestro === ownId && head.id === id))) {
      if (queue.some(q => q.maestro === ownId && q.id === id && q.kind !== 'resume')) await writeOwnQueue($, ownId, own => own.filter(q => q.id !== id || q.kind === 'resume'), state.rows)
      return { ownId }
    }
    const tasks = knownSource ? await load($, files(knownSource).open, 'ROADMAP.md') : []
    const after = [...prereqsIn(typeof tasks === 'string' ? [] : tasks)(id)]
    // #367 : une tâche `prio:oui` entre en file prioritaire.
    const prio = typeof tasks !== 'string' && tasks.some(t => t.id === id && isPriority(t))
    const written = await writeOwnQueue(
      $,
      ownId,
      own => [...own.filter(q => q.id !== id || q.kind === 'resume'), { ...entry, id, at: queue.find(q => q.maestro === ownId && q.id === id && q.kind !== 'resume')?.at ?? now, maestro: ownId, project, match, after, ...(prio ? { prio: true as const } : {}) }],
      state.rows,
    )
    doseSeenKey = ''
    const rank = liveQueue(globalQueueOrder(written), gateOf, ownId, queueSince, now).findIndex(q => q.maestro === ownId && q.id === id) + 1
    const text = { id, rank, projectName: name, projectTaken: placesOf(state, project, match), projectMax: state.projectMax, macTaken: state.macTaken, macMax: state.macMax, why: gate.go ? ('project' as const) : gate.why, ...(state.load ? { load: state.load } : {}) }
    // Au ▶, le panneau dit l'entrée en file dans la conversation de Maestro ; à la carte du modèle, le refus est ce message.
    if (entry.launch) queueSubmit($, queueEntryText(text))
    return { refusal: queuedRefusal(text) }
  } catch {
    return {}
  }
}

/** Le brief que la relève donne à Maestro pour lancer l'entrée de tête : la carte stockée, ou celui du ▶ rejoué. */
async function releaseBrief($: EngineInterface, head: GlobalQueued, source: Source | null | undefined, open: readonly Task[] | undefined): Promise<Parameters<typeof releasePrompt>[0] | undefined> {
  // Seul un ▶ part seul (#345) : son brief se refait de la roadmap, jamais d'un texte gardé dans le store.
  const task = open?.find(t => t.id === head.id)
  if (!head.launch || !source || !task) return undefined
  const brief = await briefOf($, source, task, head.launch.shortTitle, head.launch.extra ?? '', head.launch.kind ?? '')
  const bypass = wantsBypass(settings.launchBypass, await ownMode($))
  const effort = LAUNCH_EFFORTS.has(settings.launchEffort) ? settings.launchEffort : undefined
  const model = launchModelId()
  return {
    id: head.id,
    title: brief.title,
    prompt: bypass ? withBypassClause(brief.prompt) : brief.prompt,
    background: brief.background,
    ...(effort ? { effort } : {}),
    ...(model ? { model } : {}),
    travail: projectSettings(source).travail,
    bypass,
  }
}

/** Une session en pause relancée à la main tourne dès qu'elle a reçu son arrêt : sa pause ne s'efface qu'après ce délai, le temps que la liste le dise (#367). */
const PAUSE_SETTLE_MS = 15_000

/**
 * Le `at` de l'entrée `resume` d'une session mise en pause (#367) : cédée à une prioritaire, devant la première non
 * prioritaire ; cédée à une tâche passée devant, juste après son entrée (devant les non prioritaires si elle est
 * déjà partie) ; à la main, en bout de file.
 */
function resumeAt(queue: readonly GlobalQueued[], p: Pick<SessionPause, 'by' | 'for'>, now: number): number {
  const plain = queue.filter(e => !e.prio)
  const front = () => queueAtBetween(undefined, plain.length > 0 ? Math.min(...plain.map(e => e.at)) : undefined, now)
  if (p.by === 'hand') return queueAtBetween(queue.length > 0 ? Math.max(...queue.map(e => e.at)) : undefined, undefined, now)
  const target = p.by === 'order' ? queue.find(e => e.id === p.for && e.kind !== 'resume') : undefined
  if (!target) return front()
  const later = plain.filter(e => e.at > target.at).map(e => e.at)
  return queueAtBetween(target.at, later.length > 0 ? Math.min(...later) : undefined, now)
}

/** La rangée de la liste d'une session ouverte (#367). */
type PauseRow = { sessionId: string; title: string; cwd: string; startedBy?: string; isRunning: boolean }
function openRowOf(rows: readonly unknown[], sessionId: string): PauseRow | undefined {
  for (const raw of rows) {
    const r = raw as { sessionId?: unknown; title?: unknown; cwd?: unknown; startedBy?: unknown; isArchived?: unknown; isRunning?: unknown }
    if (r.sessionId !== sessionId || r.isArchived === true) continue
    return { sessionId, title: typeof r.title === 'string' ? r.title : '', cwd: typeof r.cwd === 'string' ? r.cwd : '', ...(typeof r.startedBy === 'string' ? { startedBy: r.startedBy } : {}), isRunning: r.isRunning === true }
  }
  return undefined
}

/**
 * Qui cède sa place à la prioritaire `first` (#367) : parmi les sessions de tâche ouvertes du Mac qui tiennent une
 * place et ne sont pas déjà en pause, `pickYield` (jamais une prioritaire, d'abord celle qui ne tourne pas, puis la
 * plus lourde, puis la dernière lancée). La demande revient au Maestro parent de la session (`startedBy`), sinon à
 * celui-ci. Une prioritaire se reconnaît à la marque du centre de contrôle, ou à `prio:` dans la roadmap de ce Maestro.
 */
async function pickVictim(
  $: EngineInterface,
  ownId: string,
  state: DoseState,
  queue: readonly GlobalQueued[],
  first: GlobalQueued,
  pauses: Record<string, SessionPause>,
  tasks: readonly Task[] | string,
  now: number,
): Promise<{ sessionId: string; maestro: string } | undefined> {
  const gate = gateFor(state, first.project, first.match)
  if (gate.go) return undefined
  const mine = doseProject()
  const marks = prioMarksOf(await $.store.get(PRIO_MARKS_KEY).catch(() => undefined))
  const heavyQueue = await readQueue($)
  const heavy = new Set([...(heavyQueue?.owner ? [heavyQueue.owner.branch] : []), ...(heavyQueue?.waiting.map(w => w.branch) ?? [])])
  const known = [{ project: mine.project, match: mine.match }, ...queue.map(e => ({ project: e.project, match: e.match }))]
  const open = typeof tasks === 'string' ? [] : tasks
  const found: { row: Record<string, unknown>; sessionId: string; id: string }[] = []
  for (const raw of state.rows) {
    const row = raw as Record<string, unknown>
    const sessionId = row.sessionId
    const id = typeof row.title === 'string' ? sessionTitleId(row.title) : undefined
    if (typeof sessionId !== 'string' || id === undefined || pauses[sessionId] || row.isArchived === true) continue
    // seule une session qui tient une place en libère une en la quittant (ni Maestro, ni au repos depuis plus de 15 min)
    if (launchPlaces([raw], sid => state.statuses.get(sid), [], now, state.maestros, [], undefined).taken !== 1) continue
    found.push({ row, sessionId, id })
  }
  await learnCreated($, found.map(f => f.sessionId), now)
  const candidates: YieldCandidate[] = found.map(({ row, sessionId, id }) => {
    const cwd = typeof row.cwd === 'string' ? row.cwd : ''
    const root = cwd.split('/.claude/worktrees')[0].replace(/\/+$/, '')
    const owner = known.find(k => k.match.some(prefix => cwd.startsWith(prefix)))
    const project = owner?.project ?? root
    const prio = marks.has(`${project}#${id}`) || (project === mine.project && open.some(t => t.id === id && isPriority(t)))
    // la rangée de la liste ne porte pas toujours sa branche : celle de la ligne de roadmap (`branche:`) de ce projet
    const branch = typeof row.branch === 'string' ? row.branch : project === mine.project ? (open.find(t => t.id === id)?.branche ?? '') : ''
    return { sessionId, id, running: row.isRunning === true, prio, weight: sessionWeight(cwd, branch !== '' && heavy.has(branch)), createdAt: createdBySession.get(sessionId) ?? 0, cwd }
  })
  const picked = pickYield(candidates, gate.why, first.match)
  if (!picked) return undefined
  const parent = found.find(f => f.sessionId === picked.sessionId)?.row.startedBy
  return { sessionId: picked.sessionId, maestro: typeof parent === 'string' && parent !== '' ? parent : ownId }
}

/**
 * Ce que le volet Centre de contrôle (#367) demande à ce module : la liste des sessions, la file, les pauses, les
 * marques de priorité, la roadmap de ce projet et l'ouverture d'une session. `controle.tsx` n'importe pas ce fichier.
 */
function controlDeps($: EngineInterface): ControlDeps {
  const ownSource = async () => (knownSource !== undefined ? knownSource : await sourceNow($))
  return {
    rows: () => readListRows($),
    pauses: () => readPauses($),
    writePause: (sessionId, p) => writePause($, sessionId, p),
    queue: () => readGlobalQueue($),
    writeQueue: next => storeSet($, LAUNCH_QUEUE_KEY, next as unknown as StoreValue),
    marks: async () => prioMarksOf(await $.store.get(PRIO_MARKS_KEY).catch(() => undefined)),
    writeMarks: next => (next.length === 0 ? storeDelete($, PRIO_MARKS_KEY) : storeSet($, PRIO_MARKS_KEY, next)),
    ownPrio: async () => {
      const source = await ownSource()
      if (!source) return undefined
      const tasks = await loadParsed($, files(source).open, 'ROADMAP.md')
      if (typeof tasks === 'string') return undefined
      return { project: source.root ?? source.dir, ids: new Set(tasks.flatMap(t => (!t.done && t.id && isPriority(t) ? [t.id] : []))) }
    },
    togglePriority: async id => {
      const source = await ownSource()
      if (!source) return
      const tasks = await loadParsed($, files(source).open, 'ROADMAP.md')
      const task = typeof tasks === 'string' ? undefined : tasks.find(t => !t.done && t.id === id)
      if (task) await togglePriority($, source, task)
    },
    statusOf: sessionId => readSteps($, sessionId),
    learnCreated: async ids => learnCreated($, ids, await $.clock.now()),
    createdOf: sessionId => createdBySession.get(sessionId),
    heavyBranches: async () => {
      const queue = await readQueue($)
      return new Set([...(queue?.owner ? [queue.owner.branch] : []), ...(queue?.waiting.map(w => w.branch) ?? [])])
    },
    maestros: async rows => maestroSessionIds(rows, new Set(Object.keys(await loadMaestros($)))),
    places: async (rows, statusOf, pauses) => {
      const now = await $.clock.now()
      const maestros = maestroSessionIds(rows, new Set(Object.keys(await loadMaestros($))))
      const paused = new Set(Object.entries(pauses).flatMap(([id, p]) => (p.state === 'paused' ? [id] : [])))
      return { taken: launchPlaces(rows, statusOf, await doseCards($, now), now, maestros, [], paused).taken, max: doseMaxes().macMax }
    },
    projectOf: queue => {
      const mine = doseProject()
      const known = [{ project: mine.project, match: mine.match }, ...queue.map(e => ({ project: e.project, match: e.match }))].filter(k => k.project !== '')
      return cwd => known.find(k => k.match.some(prefix => cwd.startsWith(prefix)))?.project ?? rootOfCwd(cwd)
    },
    ownId: async () => (await readOwnSession($)).id ?? '',
    open: (sessionId, title) => openSession($, { sessionId, title } as LiveEntry),
    closed: async () => {
      const source = await ownSource()
      if (!source) return new Set<string>()
      const tasks = await loadParsed($, files(source).done, 'ROADMAP-fait.md')
      if (typeof tasks === 'string') return new Set<string>()
      return new Set(tasks.flatMap(t => (t.done && t.id ? [`${source.root ?? source.dir}#${t.id}`] : [])))
    },
    archive: async sessionId => {
      const ran = await $.tool.call({ tool: ARCHIVE_SESSION_TOOL, session_id: sessionId })
      if (ran.deny !== undefined || ran.isError) throw new Error(`archivage refusé : ${ran.deny ?? ran.text ?? 'sans motif'}`)
      archivedSessionIds.add(sessionId)
      sweepAfterArchive($, await sourceNow($).catch(() => undefined))
    },
    pressZone: async (id, onPress) => {
      pressHandlers.set(id, onPress)
      zoneDrawn(zones, 'press-hit', await $.clock.now())
      return `${pressKey(id)}-g${await read($, zoneGenAtom)}`
    },
  }
}

/**
 * La relève (#324, #345), à chaque pas chez Maestro : la file commune relue ; une tâche de ce Maestro close ou
 * déjà en session en sort ; la tête éligible (la première dont le projet a une place, le Mac aussi), si elle est
 * à ce Maestro, sort de la file et le panneau écrit dans Maestro « La file est débloquée » avec son brief. Une
 * entrée d'un autre Maestro qui peut partir et ne part pas en deux minutes ne retient plus la file (#372,
 * `liveQueue`). L'option « File de lancement » éteinte (#372) : chaque tâche de ce Maestro en file part à son
 * tour de pas, sans plafond ni charge, une par pas (le message d'un ▶ part au dessin), et le bloc ne montre
 * plus de file.
 */
async function relieveLaunches($: EngineInterface): Promise<void> {
  if (relieving) return
  const ownId = ownSession?.id
  if (!ownId) return
  relieving = true
  try {
    await migrateOldQueue($, ownId)
    let queue = await readGlobalQueue($)
    const pauses = await readPauses($)
    if (queue.length === 0 && Object.keys(pauses).length === 0) {
      // #367 : même file vide, la ligne des compteurs du panneau a besoin des places du Mac.
      // Sans relecture de la liste ni du store tant que la liste n'a pas changé (le repos de #348 tient).
      if (doseView && doseView.queue.length === 0 && doseView.queued === 0 && lastListRows === idleRowsSeen) return
      idleRowsSeen = lastListRows
      const now0 = await $.clock.now()
      const idle = await doseState($, now0, pauses, true)
      const at = doseProject()
      const gate0 = gateFor(idle, at.project, at.match)
      await showDose($, { queue: [], projectTaken: placesOf(idle, at.project, at.match), projectMax: idle.projectMax, macTaken: idle.macTaken, macMax: idle.macMax, queued: 0, why: gate0.go ? 'project' : gate0.why, ...(idle.load ? { load: idle.load } : {}) })
      return
    }
    const source = knownSource
    const now = await $.clock.now()
    const state = await doseState($, now, pauses)
    const tasks = source ? await load($, files(source).open, 'ROADMAP.md') : []
    const open = typeof tasks === 'string' ? undefined : tasks
    const held = new Set(state.rows.flatMap(r => {
      const row = r as { title?: unknown; isArchived?: unknown }
      const id = typeof row.title === 'string' && row.isArchived !== true ? sessionTitleId(row.title) : undefined
      return id !== undefined ? [id] : []
    }))
    const gone = archivedIds(state.rows)
    // #367 : l'entrée `resume` d'une session en pause n'est jamais « déjà en session » : sa session est ouverte, c'est tout son sens.
    const stale = (q: GlobalQueued) => q.kind !== 'resume' && (held.has(q.id) || (open !== undefined && !open.some(t => t.id === q.id && !t.done)))
    if (queue.some(q => (q.maestro === ownId && stale(q)) || gone.has(q.maestro))) {
      queue = await writeOwnQueue($, ownId, own => own.filter(q => !stale(q)), state.rows)
    }
    const fileOn = settings.launchQueue
    const gateOf = fileOn ? (e: GlobalQueued) => gateFor(state, e.project, e.match) : () => ({ go: true as const })
    const counted = (q: readonly GlobalQueued[]) => (fileOn ? liveQueue(globalQueueOrder(q), gateOf, ownId, queueSince, now) : globalQueueOrder(q).filter(e => e.maestro === ownId))
    // --- les pauses (#367) ---
    // Des rangées illisibles (liste en panne) ne disent rien d'une session : ni pause effacée, ni victime choisie.
    const listed = state.rows.length > 0
    let changed = false
    const dropResume = async (sessionId: string) => {
      queue = await writeOwnQueue($, ownId, own => own.filter(q => !(q.kind === 'resume' && q.sessionId === sessionId)), state.rows)
    }
    const clearPause = async (sessionId: string) => {
      await writePause($, sessionId, undefined)
      delete pauses[sessionId]
      await dropResume(sessionId)
      changed = true
    }
    // (b) une session en pause qui tourne de nouveau (relancée à la main), ou fermée : pause et entrée s'effacent
    if (listed) {
      for (const [sessionId, p] of Object.entries(pauses)) {
        if (p.state !== 'paused') continue
        const row = openRowOf(state.rows, sessionId)
        if (!row || (row.isRunning && now - p.at > PAUSE_SETTLE_MS)) await clearPause(sessionId)
      }
      // une entrée `resume` de ce Maestro sans pause exécutée (reprise faite ailleurs, pause ôtée) n'a plus de raison d'être
      const orphans = queue.filter(q => q.maestro === ownId && q.kind === 'resume' && pauses[q.sessionId ?? '']?.state !== 'paused')
      if (orphans.length > 0) queue = await writeOwnQueue($, ownId, own => own.filter(q => !orphans.includes(q)), state.rows)
    }
    // (a) les demandes de pause de ce Maestro (et celles d'un autre, restées deux minutes sans réponse)
    const runPauses = async () => {
      for (const [sessionId, p] of Object.entries(pauses)) {
        if (p.state !== 'asked' || (p.maestro !== ownId && now - p.at <= QUEUE_STUCK_MS)) continue
        const row = openRowOf(state.rows, sessionId)
        if (!row) {
          if (listed) await clearPause(sessionId)
          continue
        }
        if (p.mode === 'soft' && row.isRunning) continue
        if (p.mode === 'stop') {
          try {
            const ran = await $.tool.call({ tool: STOP_SESSION_TOOL, session_id: sessionId })
            if (ran.deny !== undefined || ran.isError) continue
          } catch {
            continue
          }
        }
        const taskId = sessionTitleId(row.title)
        // L'entrée avant la pause : une pause sans entrée ne reprendrait jamais ; une entrée sans pause s'ôte au pas suivant.
        if (fileOn && taskId !== undefined && !queue.some(q => q.kind === 'resume' && q.sessionId === sessionId)) {
          const mine = doseProject()
          const inMine = mine.match.some(prefix => row.cwd.startsWith(prefix))
          const root = row.cwd.split('/.claude/worktrees')[0].replace(/\/+$/, '')
          const at = resumeAt(queue, p, now)
          queue = await writeOwnQueue(
            $,
            ownId,
            own => [...own, { id: taskId, title: row.title, at, kind: 'resume', sessionId, maestro: ownId, project: inMine ? mine.project : root, match: inMine ? mine.match : [root], after: [] }],
            state.rows,
          )
        }
        const done: SessionPause = { ...p, state: 'paused', maestro: ownId, at: now }
        await writePause($, sessionId, done)
        pauses[sessionId] = done
        changed = true
      }
    }
    await runPauses()
    // (c) la tête prioritaire est refusée et personne n'a déjà demandé de pause pour elle : une session cède sa place
    const first = fileOn && !changed ? counted(queue)[0] : undefined
    if (first?.prio && first.kind !== 'resume' && !gateFor(state, first.project, first.match).go) {
      const fresh = await readPauses($)
      if (!Object.values(fresh).some(p => p.state === 'asked' && p.for === first.id)) {
        const victim = await pickVictim($, ownId, state, queue, first, fresh, tasks, now)
        if (victim) {
          const ask: SessionPause = { mode: 'stop', state: 'asked', by: 'prio', for: first.id, maestro: victim.maestro, at: now }
          await writePause($, victim.sessionId, ask)
          pauses[victim.sessionId] = ask
          await runPauses()
          changed = true
        }
      }
    }
    // (d) et (e) : la tête, une entrée `resume` à reprendre ou une tâche à lancer ; un pas qui vient de poser ou lever une pause attend le suivant
    const head = changed ? undefined : queueHead(counted(queue), gateOf)
    if (head && head.maestro === ownId && now >= doseRetryAt) {
      try {
        if (head.kind === 'resume') {
          const p = pauses[head.sessionId ?? '']
          if (p && head.sessionId) {
            const ran = await $.tool.call({ tool: SEND_MESSAGE_TOOL, session_id: head.sessionId, message: resumeText(p.by, p.for) })
            if (ran.deny !== undefined || ran.isError) throw new Error('reprise refusée')
            await writePause($, head.sessionId, undefined)
            delete pauses[head.sessionId]
          }
          queue = await writeOwnQueue($, ownId, own => own.filter(q => q.id !== head.id || q.kind !== 'resume'), state.rows)
        } else if (head.card) {
          // Une carte du modèle (#345, relecture de sécurité) n'a jamais eu le clic de Bertrand : elle
          // redevient une carte, qu'il démarre d'un clic sur Start ; seul un ▶ vaut accord pour partir seul.
          doseAllowed.set(head.id, now + PLACE_IDLE_MS)
          const ran = await launchWithMode($, head.card, card => $.tool.call(card as never))
          if (ran.deny !== undefined || ran.isError) throw new Error('carte refusée')
          await reserveCard($, head.title)
        } else {
          const brief = await releaseBrief($, head, source, open)
          if (!brief) throw new Error('brief introuvable')
          doseAllowed.set(head.id, now + PLACE_IDLE_MS)
          await reserveCard($, brief.title)
          queueSubmit($, releasePrompt(brief))
        }
        if (head.kind !== 'resume') queue = await writeOwnQueue($, ownId, own => own.filter(q => q.id !== head.id || q.kind === 'resume'), state.rows)
      } catch {
        doseAllowed.delete(head.id)
        doseRetryAt = now + DOSE_RETRY_MS
      }
    }
    const mine = doseProject()
    const ordered = counted(queue)
    // #367 : une entrée `resume` compte au rang du Mac mais ne se montre pas comme une tâche en file
    const ownQueue = fileOn ? ordered.flatMap((q, i) => (q.maestro === ownId && q.kind !== 'resume' ? [{ ...q, rank: i + 1 }] : [])) : []
    const gate = gateFor(state, mine.project, mine.match)
    await showDose($, { queue: ownQueue, projectTaken: placesOf(state, mine.project, mine.match), projectMax: state.projectMax, macTaken: state.macTaken, macMax: state.macMax, queued: ordered.filter(q => q.kind !== 'resume').length, why: gate.go ? 'project' : gate.why, ...(state.load ? { load: state.load } : {}) })
  } catch {
    // un pas raté : le suivant relit
  } finally {
    relieving = false
  }
}

/** Ce que le dernier pas a vu (#345, #367) : le panneau se redessine seulement si un compteur a changé. */
async function showDose($: EngineInterface, next: DoseView): Promise<void> {
  const key = JSON.stringify([next.queue.map(q => [q.id, q.rank]), next.queued, next.projectTaken, next.projectMax, next.macTaken, next.macMax, next.why, next.why === 'load' ? Math.round(next.load?.load ?? 0) : 0])
  doseView = next
  if (key !== doseSeenKey) {
    doseSeenKey = key
    await update($, liveVersionAtom, v => v + 1)
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
  tickStats = new Map()
  try {
    pollTick++
    if (resting) {
      // Au repos (#348) : la file de lancement de Maestro avance quand même ; le reste attend sa minute.
      await checkZones($)
      await relieveLaunches($)
      const now = await $.clock.now()
      if (now - restReadAt < REST_MS) return
      restReadAt = now
      await refresh($)
      await retryCreated($)
      return
    }
    const full = wokeUp || pollTick % (POLL_MS / TICK_MS) === 0
    wokeUp = false
    if (full || !knownSource) await refresh($)
    else {
      await checkZones($)
      await refreshSessions($, knownSource, true)
      if (await restamp($, knownSource)) await summarize($, knownSource)
      await restampQueue($)
    }
    await relieveLaunches($)
    await retryCreated($)
  } catch {
    // un pas raté (module rechargé, état indisponible) : le suivant réessaie, sans rejet laissé en l'air
  } finally {
    polling = false
    tickStats = undefined
    if (pollAgain) {
      pollAgain = false
      void poll($)
    }
  }
}

/**
 * Démarre une session à part sur la task, par l'outil de l'app de bureau ; le clic de la
 * personne est la demande. Sans cet outil (terminal, autre hôte), la demande passe à Claude
 * dans la conversation en cours, qui la lance lui-même.
 */
/** Le brief d'un lancement : la vérification, la routine ou le travail, avec le « Message additionnel » (#324 : la relève le rejoue). */
async function briefOf($: EngineInterface, source: Source, task: Task, shortTitle: string, extra = '', kind = '', routineClosed = false): Promise<{ title: string; prompt: string; background: string }> {
  const projet = projectSettings(source).travail === 'projet'
  const base =
    kind === 'check'
      ? checkBrief(source, task, shortTitle, !projet || (await isGitDir($, source.dir)), await briefFound($, source, task))
      : kind === 'routine'
        ? routineBrief(source, task, shortTitle, { today: todayOf(await $.clock.now()), closed: routineClosed, found: await briefFound($, source, task) })
        : await workBrief($, source, task, shortTitle)
  return extra.trim() === '' ? base : { ...base, prompt: `${base.prompt}\n\nMessage additionnel :\n${extra.trim()}` }
}

/** Le « Message additionnel » tapé dans le détail, ajouté au brief ; vidé à chaque changement de tâche. */
let launchExtra = ''

async function launchSession($: EngineInterface, source: Source, task: Task, shortTitle: string, extra = '', kind = '', routineClosed = false): Promise<void> {
  // `check` : le bouton « Vérifier », une session qui contrôle la tâche sans la faire.
  // Le brief de lancement dit où écrire le bilan de clôture : le journal du dossier, ou celui par défaut.
  const key = taskKey(task)
  // Le bouton se grise et dit « Lancement… » : une seule écriture.
  await setView($, v => ({ launched: v.launched.includes(key) ? v.launched : [...v.launched, key], launchNote: LAUNCHING }))
  const projet = projectSettings(source).travail === 'projet'
  const brief = await briefOf($, source, task, shortTitle, extra, kind, routineClosed)
  // Un refus net de l'app ou une panne : rien n'est parti, le bouton redevient cliquable.
  const release = () => setView($, v => ({ launched: v.launched.filter(k => k !== key) }))
  // #263 : le titre vient de la ligne, mais une session ouverte (endormie, le ▶ revenu) peut déjà porter son #N.
  const titleRefused = await launchRefusal($, { title: brief.title })
  if (titleRefused !== undefined) {
    await setView($, v => ({ launched: v.launched.filter(k => k !== key), launchNote: `Lancement impossible : ${titleRefused}` }))
    return
  }
  // #324 : chez Maestro, plus de place ou le Mac chargé, la tâche entre dans la file ; la relève rejouera ce ▶.
  const dose = kind === 'routine' ? {} : await doseLaunch($, task.id, { title: brief.title, launch: { shortTitle, ...(extra.trim() ? { extra } : {}), ...(kind ? { kind } : {}) } })
  if (dose.refusal !== undefined) {
    const held = dose.refusal
    await setView($, v => ({ launched: v.launched.filter(k => k !== key), launchNote: `En file : ${held}` }))
    await update($, liveVersionAtom, v => v + 1)
    return
  }
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
  // En mode auto, le panneau n'essaie pas : son contrôle refuse un appel qu'aucun message de la
  // personne ne demande (un clic lui est invisible), et l'essai coûtait ~40 s avant le repli (#248).
  const mode = await ownMode($)
  if (mode === 'auto') {
    noteLaunch('claude', true)
    await askClaude($, brief, [], AUTO_VIA_CLAUDE)
    if ((await read($, viewAtom)).launchNote.startsWith('Lancement impossible')) await release()
    return
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
      prompt: wantsBypass(settings.launchBypass, mode) ? withBypassClause(brief.prompt) : brief.prompt,
      background: brief.background,
    } as const
    // Les champs que l'app peut refuser, dans l'ordre où ils tombent, un par refus : le mode (#87 :
    // l'app n'accorde le bypass que depuis une session déjà en bypass), l'effort (haut par défaut,
    // Bertrand, 2026-10-23 ; borné à celui de la session qui lance), puis, sans code (#76, #176), le
    // dossier du projet sans worktree (le panneau ne lit pas la copie d'un worktree). Un champ tombé
    // hérite de la session qui lance.
    const effort = LAUNCH_EFFORTS.has(settings.launchEffort) ? settings.launchEffort : undefined
    const optional: [field: string, value: unknown, note: string][] = []
    if (wantsBypass(settings.launchBypass, mode)) optional.push(['permission_mode', BYPASS_MODE, `en ${BYPASS_MODE}`])
    if (effort) optional.push(['effort', effort, `avec effort ${effort}`])
    // #327 : le modèle qui cadre (« hérite » n'en pose aucun) ; un refus qui le nomme le fait tomber seul.
    const launchModel = launchModelOf(settings.launchModel)
    if (launchModel !== 'hérite') optional.push(['model', MODEL_IDS[launchModel], `avec le modèle ${launchModel}`])
    if (projet) optional.push(['use_worktree', false, 'sans worktree'])
    const withFields = () => ({ ...card, ...Object.fromEntries(optional.map(([field, value]) => [field, value])) })
    // Un refus du mode auto ne tient à aucun de ces champs : reposer la carte ne change rien.
    const refused = (r: ToolCallResult) => (r.deny !== undefined || r.isError === true) && !isAutoModeRefusal(reasonOf(r))
    let proposed = await $.tool.call(withFields())
    while (optional.length > 0 && refused(proposed)) {
      const modelAt = optional.findIndex(([field]) => field === 'model')
      const dropped = optional.splice(modelAt >= 0 && /\bmodel\b/i.test(reasonOf(proposed)) ? modelAt : 0, 1)[0]!
      refusals.push(`${dropped[2]} : ${reasonOf(proposed)}`)
      proposed = await $.tool.call(withFields())
    }
    if (proposed.deny === undefined && !proposed.isError) {
      if (dose.ownId) await reserveCard($, brief.title)
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
  const found = await briefFound($, source, task)
  // #194 : les fichiers que nomment la spec et la fiche ouvrent le brief, sous la mission.
  const named: string[] = []
  for (const doc of briefDocs(source, task, found)) for (const f of namedFiles((await readOr($, doc)) ?? '')) if (!named.includes(f)) named.push(f)
  return launchBrief(source, task, shortTitle, bilanLog, maestro, found, named, await treeFor($, source, task), await folderFor($, source), codeModelOf(settings.codeModel, launchModelOf(settings.launchModel)))
}

/**
 * Le bloc du dossier (#301) : ses règles et ses cartes qui existent, et ses dossiers du premier niveau,
 * relevés maintenant. Une lecture en panne ôte sa part ; le bloc part toujours.
 */
async function folderFor($: EngineInterface, source: Source): Promise<string[]> {
  const found: Record<string, 'file' | 'dir'> = {}
  for (const path of folderPaths(source)) {
    try {
      if ((await $.fs.stat(path)).kind === 'file') found[path] = 'file'
    } catch {
      // absent : le bloc ne le cite pas
    }
  }
  const entries = await $.fs.list(source.root ?? source.dir).catch(() => [])
  return folderContext({ source, found, entries })
}

/**
 * La section de l'arbre d'une tâche (#237) : les deux fichiers de la roadmap, le journal des bilans et
 * la liste des sessions, archivées comprises, relus maintenant. Un fichier de la roadmap en panne ôte sa
 * part (un `deny` ne lève pas, #195), le reste du brief part ; la liste des sessions se relit dans son
 * fichier quand elle est trop grosse, et sa panne se dit dans la rubrique (#302).
 */
async function treeFor($: EngineInterface, source: Source, task: Task): Promise<string[]> {
  const { open, done } = files(source)
  const [openTasks, doneTasks, bilan, listed] = await Promise.all([
    load($, open, 'ROADMAP.md'),
    load($, done, 'ROADMAP-fait.md'),
    loadBilan($, source).catch(() => undefined),
    allSessionRows($),
  ])
  return treeContext({
    source,
    task,
    open: typeof openTasks === 'string' ? [] : openTasks,
    done: typeof doneTasks === 'string' ? [] : doneTasks,
    ...(bilan ? { bilans: bilan.bilans } : {}),
    ...('rows' in listed ? { sessions: listed.rows } : { sessionsFail: listed.fail }),
  })
}

/**
 * Une carte que le modèle écrit lui-même (Maestro, ou une session qui propose), titrée « #N · … » :
 * le même générateur que le ▶ y ajoute la section de l'arbre, si elle ne l'a pas (#237). Sans
 * roadmap, sans tâche #N ou en panne : la carte part telle quelle.
 */
async function withTree($: EngineInterface, e: unknown): Promise<unknown> {
  const card = e as { title?: unknown; prompt?: unknown }
  const id = typeof card.title === 'string' ? sessionTitleId(card.title) : undefined
  if (id === undefined || typeof card.prompt !== 'string' || (card.prompt.includes(TREE_MARK) && card.prompt.includes(FOLDER_MARK))) return e
  try {
    const source = await sourceNow($)
    if (!source) return e
    const { open, done } = files(source)
    const tasks = [open, done].map(async (p, i) => load($, p, i === 0 ? 'ROADMAP.md' : 'ROADMAP-fait.md'))
    const task = (await Promise.all(tasks)).flatMap(t => (typeof t === 'string' ? [] : t)).find(t => t.id === id)
    if (!task) return e
    // #301 : le dossier, puis l'arbre ; chacun seulement s'il manque à la carte.
    const withFolder = card.prompt.includes(FOLDER_MARK) ? card.prompt : withFolderContext(card.prompt, await folderFor($, source))
    const prompt = card.prompt.includes(TREE_MARK) ? withFolder : withTreeContext(withFolder, await treeFor($, source, task))
    return prompt === card.prompt ? e : { ...(e as object), prompt }
  } catch {
    return e
  }
}

/** Les sessions ouvertes (non archivées) du projet, parmi les rangées de `list_sessions`. */
function openProjectSessions(rows: readonly unknown[], match: readonly string[]): { sessionId: string; title: string }[] {
  return rows.flatMap(r => {
    const o = r as { sessionId?: unknown; title?: unknown; cwd?: unknown; isArchived?: unknown } | null
    if (typeof o !== 'object' || o === null || typeof o.sessionId !== 'string' || typeof o.title !== 'string') return []
    if (o.isArchived === true || typeof o.cwd !== 'string' || !match.some(p => (o.cwd as string).startsWith(p))) return []
    return [{ sessionId: o.sessionId, title: o.title }]
  })
}

/**
 * Le refus d'une carte de session dont le titre ne vient pas de la ligne écrite, ou dont le #N tient
 * déjà une session ouverte (#263, `launchTitleRefusal`) : la roadmap et la liste relues à l'instant.
 * Sans roadmap, roadmap illisible ou sans numéros, lancement ailleurs, proposition à démarrer : rien.
 */
async function launchRefusal($: EngineInterface, e: unknown): Promise<string | undefined> {
  const card = e as Record<string, unknown>
  if (typeof card.title !== 'string' || card.proposal_id !== undefined) return undefined
  if (ELSEWHERE_OPTIONS.some(k => card[k] !== undefined)) return undefined
  try {
    const source = await sourceNow($)
    if (!source) return undefined
    const [open, done] = await Promise.all([load($, files(source).open, 'ROADMAP.md'), load($, files(source).done, 'ROADMAP-fait.md')])
    if (typeof open === 'string') return undefined
    const closed = typeof done === 'string' ? [] : done
    if (![...open, ...closed].some(t => t.id !== undefined)) return undefined
    const titles = await loadTitles($)
    const sessions = openProjectSessions((await readListRows($)).rows, source.match)
    return launchTitleRefusal({ title: card.title, open, done: closed, sessions, titleOf: t => cachedTitle(t, titles) })
  } catch {
    return undefined
  }
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
async function maestroText($: EngineInterface, go: boolean, only?: 'launch' | 'sessions', request?: string): Promise<string> {
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
  const titleOf = (t: Task) => taskTitle(t, titles)
  // Toutes les prérequises (#76) : une tâche est bloquée tant qu'une est ouverte, et débloque toutes ses dépendantes.
  const prereq = (t: Task) => prereqsOf(t, all, x => cachedTitle(x, titles))
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
  // Les candidates de l'axe de la session (#239) ; les sessions, elles, se disent toutes.
  const axis = await sessionAxis($)
  const ready = launchable(open, { prereqOf: prereq, isLive: t => tracked(t) !== undefined, me: source.me }).filter(
    t => !view.launched.includes(taskKey(t)) && !heldByOther(t, source.me) && (!axis || t.axis === axis),
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
  const context = maestroContext({
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
    ...(launchModelId() ? { launchModel: launchModelId() } : {}),
    ...(only ? { only } : {}),
    ...(request !== undefined ? { request } : {}),
  })
  return withAxisNote(context, only === 'sessions' ? undefined : axis)
}

/** Sans roadmap dans ce projet, « Maestro » propose l'onboarding. */
async function noRoadmapText($: EngineInterface): Promise<string> {
  return `${Person()} a dit « Maestro », mais ce projet (${await $.session.root()}) n'a pas de roadmap : dis-le en une phrase, et propose la skill roadmap:onboarding, qui la pose dans le dépôt (et peut la reconstituer depuis son historique).`
}

/**
 * L'accueil de Maestro (#141), compté sur la roadmap seule : la carte et le contexte de « Maestro »
 * le partagent. Rien des sessions n'est relu (#126) : seules les tâches de Maestro déjà connues comptent.
 */
async function welcomeOf($: EngineInterface, data: NonNullable<Awaited<ReturnType<typeof brandData>>>, axis?: string): Promise<Welcome> {
  const ms = await $.clock.now()
  const settings = projectSettings(data.source)
  const facts = welcomeFacts({
    // « Maestro <axe> » compte sur son axe (#239).
    tasks: onAxis(data.tasks, axis),
    today: todayOf(ms),
    me: data.source.me ?? [],
    relanceDays: settings.relanceDays,
    sessions: data.maestroTasks.filter(t => t.state !== 'done').length,
    // Les derniers travaux (#270) : le livré d'une ligne qui ne le dit pas vient de son bilan.
    bilans: (await loadBilan($, data.source).catch(() => undefined))?.bilans ?? new Map(),
    titleOf: data.short,
  })
  return welcomeText(facts, { person: Person(), now: new Date(ms) })
}

/**
 * « Maestro » seul (#126, #141) : le panneau s'ouvre, la carte d'accueil porte les chiffres et les
 * boutons, et Maestro ne dit que l'encouragement ; rien n'est lu des sessions avant un clic.
 */
async function maestroIntroText($: EngineInterface, axis?: string): Promise<string> {
  const source = await sourceNow($)
  if (!source) return noRoadmapText($)
  void openPane($, source)
  const data = await brandData($)
  if (!data) throw new Error('roadmap illisible')
  return withAxisNote(maestroIntro({ source, welcome: await welcomeOf($, data, axis), cardShown: welcomeCardShown(await loadWelcomeCard($)) }), axis)
}

/** Les tâches d'un axe ; sans axe, toutes (#239). */
function onAxis<T extends { axis: string }>(tasks: readonly T[], axis: string | undefined): T[] {
  return axis ? tasks.filter(t => t.axis === axis) : [...tasks]
}

/** Un brief limité à l'axe de la session le dit en tête (#239). */
function withAxisNote(text: string, axis: string | undefined): string {
  return axis ? `${maestroAxisNote(axis)}\n\n${text}` : text
}

/** L'axe de la session (#239) ; état illisible : tous. */
async function sessionAxis($: EngineInterface): Promise<string | undefined> {
  return (await read($, maestroAxisAtom).catch(() => '')) || undefined
}

/** Les axes de la roadmap, pour reconnaître « Maestro <axe> » (#239) ; roadmap illisible : aucun. */
async function knownAxes($: EngineInterface): Promise<string[]> {
  try {
    const data = await brandData($)
    return data ? roadmapAxes(data.tasks) : []
  } catch {
    return []
  }
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
      await storeSet($, WELCOME_CARD_KEY, { ...seen, [kind]: at, ...(error !== undefined ? { error } : {}) })
    } catch {
      // store illisible : le sort se notera au prochain chargement du module
    }
  })
  return welcomeCardWrites
}

/**
 * Le sort du dessin du panneau (#220), noté au store comme celui de la carte d'accueil (#153) : sa première
 * arrivée, son premier dessin réussi, sa dernière panne (le message, la pile, la version). Un panneau resté
 * vide sur une autre machine se lit là, dans `~/.claude/plugins/store/roadmap_*.json`, clé `pane-draw`.
 */
const PANE_DRAW_KEY = 'pane-draw'
type PaneFailure = { kind: 'throw' | 'timeout'; message: string; stack?: string }
let paneDrawReached = false
let paneDrawDrawn = false
let paneDrawWrites: Promise<void> = Promise.resolve()

/** Note le sort du dessin du panneau ; jamais bloquant. Une arrivée et un dessin réussi se notent une fois, une panne à chaque fois. */
function notePaneDraw($: EngineInterface, kind: 'reachedAt' | 'drawnAt' | 'failedAt', failure?: PaneFailure): Promise<void> {
  if (kind === 'reachedAt') {
    if (paneDrawReached) return paneDrawWrites
    paneDrawReached = true
  }
  if (kind === 'drawnAt') {
    if (paneDrawDrawn) return paneDrawWrites
    paneDrawDrawn = true
  }
  // Après une panne, le dessin réussi suivant se note de nouveau.
  if (kind === 'failedAt') paneDrawDrawn = false
  paneDrawWrites = paneDrawWrites.then(async () => {
    try {
      const at = await $.clock.now()
      const stored = await $.store.get(PANE_DRAW_KEY)
      const seen = typeof stored === 'object' && stored !== null && !Array.isArray(stored) ? stored : {}
      const why = failure ? { error: failure.message, kind: failure.kind, stack: (failure.stack ?? '').split('\n').slice(0, 8).join('\n') } : {}
      await storeSet($, PANE_DRAW_KEY, { ...seen, [kind]: at, version: sessionVersion ?? '?', ...why })
    } catch {
      // store illisible : le sort se notera au dessin suivant
    }
  })
  return paneDrawWrites
}

/**
 * La carte d'un dessin du panneau en panne (#220) : ce qui s'est passé, le message, la version du plugin et
 * « Réessayer », plutôt que « has not drawn in this pane ». Rien de ce que le dessin lit d'ordinaire n'est
 * exigé : la palette illisible, les couleurs du thème de l'app.
 */
async function paneFailure($: EngineInterface, e: RenderInput<'Pane'>, failure: PaneFailure): Promise<RenderElement> {
  void notePaneDraw($, 'failedAt', failure)
  const { Box, Text, Button } = $.ui.resolve(e)
  const version = await loadSessionVersion($).catch(() => sessionVersion ?? '?')
  const palette = await paletteOf($).catch(() => undefined)
  // Lu pour que « Réessayer » redessine le panneau.
  await read($, retryAtom).catch(() => 0)
  const retry = () => {
    knownSource = undefined
    paneCache = undefined
    void update($, retryAtom, v => v + 1)
  }
  const what = failure.kind === 'timeout' ? 'Le dessin a dépassé le temps que lui laisse l\'app.' : 'Une erreur a interrompu le dessin.'
  return (
    <Box flexDirection="column" gap={SPACE.block} paddingX={SPACE.screen} paddingTop="sm">
      <Text weight="semibold" {...(palette ? { color: palette.late } : { color: 'error' })}>Le panneau n'a pas pu se dessiner</Text>
      <Text wrap="wrap" {...(palette ? { color: palette.text2 } : {})}>{what}</Text>
      {failure.message !== '' && <Text mono size="caption" wrap="wrap">{failure.message}</Text>}
      <Text size="caption" {...(palette ? { color: palette.text2 } : {})}>{`Version du plugin : roadmap ${version}`}</Text>
      <Box flexDirection="row">
        <Button key="pane-error-retry" label="Réessayer" onPress={retry} />
      </Box>
      <Text size="caption" wrap="wrap" {...(palette ? { color: palette.text2 } : {})}>Une capture de ce cadre suffit pour corriger le panneau.</Text>
    </Box>
  )
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
  // La journée et les relances de l'axe de la session (#239).
  const axis = await sessionAxis($)
  const tasks = onAxis(data.tasks, axis)
  if (action === 'journee') return withAxisNote(maestroDayContext({ source, sections: todaySections(tasks, today, me), titleOf: data.short, today }), axis)
  const relanceDays = projectSettings(source).relanceDays
  return withAxisNote(maestroRelaunchContext({ source, tasks: tasks.filter(t => isToRelaunch(t, today, me, relanceDays)), titleOf: data.short, today, me }), axis)
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
async function askClaude($: EngineInterface, brief: { title: string; prompt: string; background: string }, refusals: readonly string[] = [], note = viaClaudeNote(refusals)): Promise<void> {
  try {
    const source = await sourceNow($)
    await submitLaunch($, brief, note, source ? projectSettings(source).travail : 'code')
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
      `Propose cette session sous forme de carte (${cardTool(LAUNCH_EFFORTS.has(settings.launchEffort) ? settings.launchEffort : undefined, travail, launchModelId())}), titre « ${brief.title} », avec ce brief. Pose la carte sans essayer de la lancer, puis réponds en une phrase au plus :`,
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
        void setView($, () => ({ openAt: '', openNote: '' })).catch(() => undefined)
        return
      }
    } catch {
      // outil absent : repli plus bas
    }
  }
  if (entry.link) {
    await $.process.run(['open', entry.link])
    opened('link')
    void setView($, () => ({ openAt: '', openNote: '' })).catch(() => undefined)
    return
  }
  await setView($, () => ({ openAt: '', openNote: `Session « ${entry.title} » : ouvre-la depuis la barre latérale.` }))
  opened('note')
}

/**
 * Archive la session d'une tâche faite. L'archivage se défait depuis la barre latérale ; la tâche
 * cesse aussitôt de pointer vers la session.
 */
async function archiveSession($: EngineInterface, key: string, entry: LiveEntry): Promise<boolean> {
  await setView($, () => ({ openAt: '', openNote: '' }))
  if (!entry.sessionId) return false
  try {
    const ran = await $.tool.call({ tool: ARCHIVE_SESSION_TOOL, session_id: entry.sessionId })
    if (ran.deny !== undefined || ran.isError) {
      await setView($, () => ({ openAt: '', openNote: `Archivage refusé : ${ran.deny ?? ran.text ?? 'sans motif'}` }))
      return false
    }
    // La session est archivée : le panneau cesse d'y pointer tout de suite, puis oublie son suivi ; la
    // bande de Maestro la compte archivée avant la relecture des sessions (#174).
    archivedSessionIds.add(entry.sessionId)
    liveStatus.set(key, 'closed')
    // #313 : la session archivée libère son worktree ; sa branche fusionnée part au ménage qui suit.
    sweepAfterArchive($, await sourceNow($).catch(() => undefined))
    for (const [k, v] of sessionMatches) if (v.sessionId === entry.sessionId) sessionMatches.delete(k)
    await setView($, () => ({ openAt: '', openNote: `Session « ${entry.title} » archivée.` }))
    await update($, liveVersionAtom, v => v + 1)
    try {
      const live = await loadLive($)
      for (const k of Object.keys(live)) if (live[k]?.sessionId === entry.sessionId) delete live[k]
      await storeSet($, LIVE_KEY, live)
      await update($, liveVersionAtom, v => v + 1)
    } catch {
      // stockage indisponible : l'entrée reste, marquée close ; le sondage suivant la retire
    }
    return true
  } catch (err) {
    await setView($, () => ({ openAt: '', openNote: `Archivage impossible : ${err instanceof Error ? err.message : String(err)}` }))
    return false
  }
}

/**
 * La session d'une tâche close, archivée comprise (#206, #302) : lue à l'ouverture de sa fiche, une fois par
 * minute au plus. D'abord par l'index du store (`task-session-ids`) et `get_session`, une petite réponse ;
 * sinon par toute la liste, archivées comprises, que l'outil range dans un fichier quand elle est trop
 * grosse (#302 : 109 175 caractères dès 200 rangées) et qui se relit alors par `$.fs.read`. Cette lecture
 * remplit l'index de tout le projet. Un refus, une panne ou une réponse illisible se disent (`fail`).
 */
type TaskSessionLook = { row?: TaskSessionRow; fail?: string }
const taskSessions = new Map<string, TaskSessionLook & { at: number }>()
const taskSessionsAsked = new Set<string>()
const TASK_SESSION_MS = 60_000
/** Toutes les sessions de l'app, ou presque : BBR en avait 1 716 le 2026-11-04 (#302). */
const TASK_SESSION_LIMIT = 2000
const TASK_SESSION_IDS_KEY = 'task-session-ids'

async function loadTaskSessionIds($: EngineInterface): Promise<Record<string, string>> {
  const stored = await $.store.get(TASK_SESSION_IDS_KEY).catch(() => undefined)
  return typeof stored === 'object' && stored !== null ? (stored as Record<string, string>) : {}
}

/** La session de l'index, relue par sa fiche : rien quand elle n'y est pas ou ne se lit plus. */
async function indexedTaskSession($: EngineInterface, source: Source, t: Task, ids: Record<string, string>): Promise<TaskSessionRow | undefined> {
  const id = ids[`${source.name}:${t.id}`]
  if (id === undefined) return undefined
  try {
    const ran = await $.tool.call({ tool: GET_SESSION_TOOL, session_id: id })
    if (ran.deny !== undefined || ran.isError || !ran.text) return undefined
    return taskSessionRow(t, [JSON.parse(ran.text)], source.match)
  } catch {
    return undefined
  }
}

/**
 * Toute la liste des sessions, archivées comprises (#302) : relue par `$.fs.read` quand l'outil l'a rangée
 * dans un fichier. Sert la fiche d'une close et le contexte de l'arbre du brief (#237). Un refus, une
 * erreur ou une réponse illisible rendent leur cause, que l'appelant dit.
 */
async function allSessionRows($: EngineInterface): Promise<{ rows: unknown[] } | { fail: string }> {
  try {
    toolCalls++
    const ran = await $.tool.call({ tool: LIST_SESSIONS_TOOL, include_archived: true, limit: TASK_SESSION_LIMIT })
    if (ran.deny !== undefined) return { fail: `liste refusée${ran.deny ? ` (${ran.deny})` : ''}` }
    if (ran.isError) return { fail: ran.text || 'liste en erreur' }
    let read = sessionRowsOf(ran.text ?? '')
    if ('path' in read) read = sessionRowsOf(await $.fs.read(read.path))
    if ('error' in read) return { fail: read.error }
    if ('path' in read) return { fail: 'la liste des sessions est illisible' }
    return { rows: read.rows }
  } catch (err) {
    return { fail: err instanceof Error ? err.message : String(err) }
  }
}

/** Toute la liste des sessions (#302), et l'index du projet remis à jour. */
async function listedTaskSession($: EngineInterface, source: Source, t: Task, ids: Record<string, string>): Promise<TaskSessionLook> {
  try {
    const read = await allSessionRows($)
    if ('fail' in read) return { fail: read.fail }
    const found = taskSessionIndex(read.rows, source.match)
    const next = { ...ids }
    for (const [n, sid] of Object.entries(found)) next[`${source.name}:${n}`] = sid
    await storeSet($, TASK_SESSION_IDS_KEY, next).catch(() => undefined)
    const row = taskSessionRow(t, read.rows, source.match)
    return row ? { row } : {}
  } catch (err) {
    return { fail: err instanceof Error ? err.message : String(err) }
  }
}

function taskSessionOf($: EngineInterface, source: Source, t: Task, now: number): TaskSessionLook | undefined {
  if (!t.done || !t.id) return undefined
  const key = `${source.name}:${t.id}`
  const kept = taskSessions.get(key)
  if ((!kept || now - kept.at > TASK_SESSION_MS) && !taskSessionsAsked.has(key)) {
    taskSessionsAsked.add(key)
    void (async () => {
      const ids = await loadTaskSessionIds($)
      const indexed = await indexedTaskSession($, source, t, ids)
      const look = indexed ? { row: indexed } : await listedTaskSession($, source, t, ids)
      taskSessions.set(key, { ...look, at: now })
      taskSessionsAsked.delete(key)
      await update($, liveVersionAtom, v => v + 1).catch(() => undefined)
    })()
  }
  return kept
}

/** La tâche dont la confirmation « désarchiver la session » est ouverte (#302), gardée aussi en mémoire : un clic ailleurs la referme. */
let reopenAskNow = ''

/** Un clic ailleurs que l'icône et sa confirmation referme la confirmation ouverte (#302). */
async function closeReopenAsk($: EngineInterface, element: string): Promise<void> {
  if (reopenAskNow === '' || element.includes('reopen-')) return
  reopenAskNow = ''
  await setView($, () => ({ reopenAsk: '' }))
}

/** Ouvre ou referme la confirmation du désarchivage de la session de cette tâche (#302). */
async function askReopen($: EngineInterface, key: string): Promise<void> {
  reopenAskNow = reopenAskNow === key ? '' : key
  await setView($, () => ({ reopenAsk: reopenAskNow }))
}

/** Le relevé du dernier ménage des branches (#313), au store : heure, branches parties, refus. */
const BRANCH_SWEEP_KEY = 'branch-sweep'
/** Au démarrage, un ménage au plus toutes les 10 minutes par projet ; après un archivage, toujours. */
const BRANCH_SWEEP_EVERY_MS = 10 * 60_000
/** Le délai entre un archivage et son ménage : l'app libère le worktree de la session une seconde après. */
const BRANCH_SWEEP_DELAYS_MS = [5_000, 30_000] as const
let sweeping = false

/**
 * Le ménage des branches (#313) : en mode code, l'option `pruneBranches` allumée, les branches fusionnées
 * dans la base que rien ne tient partent du Mac (`git branch -d`, qui refuse encore une branche non
 * fusionnée) puis de GitHub (un seul `git push origin --delete`). Décision : `branchesToPrune`. Rend la
 * ligne qui le dit, vide quand rien n'est parti.
 */
async function sweepBranches($: EngineInterface, source: Source, why: 'start' | 'archive'): Promise<string> {
  if (!settings.pruneBranches || sweeping || projectSettings(source).travail !== 'code') return ''
  sweeping = true
  try {
    const now = await $.clock.now()
    if (why === 'start') {
      const last = (await $.store.get(BRANCH_SWEEP_KEY).catch(() => undefined)) as { at?: number } | undefined
      if (typeof last?.at === 'number' && now - last.at < BRANCH_SWEEP_EVERY_MS) return ''
    }
    const run = (dir: string, ...args: string[]) => $.process.run(['git', '-C', dir, ...args], { timeoutMs: 60_000 })
    const listed = await run(source.root ?? source.dir, 'worktree', 'list', '--porcelain')
    if (listed.exitCode !== 0) return ''
    const main = /^worktree (.+)$/m.exec(listed.stdout)?.[1]?.trim()
    if (!main) return ''
    const current = (await run(main, 'rev-parse', '--abbrev-ref', 'HEAD')).stdout.trim()
    const base = ['main', 'master'].find(b => b === current)
    if (!base) return ''
    const baseTip = (await run(main, 'rev-parse', '--verify', '--quiet', `refs/heads/${base}`)).stdout.trim()
    const hasOrigin = (await run(main, 'remote')).stdout.split('\n').some(r => r.trim() === 'origin')
    if (hasOrigin) await run(main, 'fetch', '--prune', '--quiet', 'origin')
    const format = '--format=%(objectname) %(refname)'
    const refs = await run(main, 'for-each-ref', '--merged', base, format, 'refs/heads')
    if (refs.exitCode !== 0 || !baseTip) return ''
    // Sur GitHub, une branche ne part que fusionnée dans la base de GitHub elle-même : un main local en
    // avance, pas encore poussé, ne suffit pas.
    const remoteRefs = hasOrigin ? await run(main, 'for-each-ref', '--merged', `origin/${base}`, format, 'refs/remotes/origin') : undefined
    const open = await load($, files(source).open, 'ROADMAP.md')
    const plan = branchesToPrune({
      base,
      current,
      baseTip,
      local: parseRefTips(refs.stdout, 'refs/heads/'),
      remote: remoteRefs?.exitCode === 0 ? parseRefTips(remoteRefs.stdout, 'refs/remotes/origin/') : new Map(),
      held: parseWorktreeBranches(listed.stdout),
      open: typeof open === 'string' ? [] : openBranchesOf(open),
    })
    if (typeof open === 'string') return '' // roadmap illisible : on ne sait pas ce que tiennent les lignes ouvertes
    const local: string[] = []
    const failed: string[] = []
    for (const name of plan.local) ((await run(main, 'branch', '-d', '--', name)).exitCode === 0 ? local : failed).push(name)
    let remote: string[] = []
    if (plan.remote.length > 0) {
      // Des refspecs complets (`:refs/heads/<nom>`) : un nom ne se lit jamais comme une option.
      const pushed = await run(main, 'push', 'origin', ...plan.remote.map(n => `:refs/heads/${n}`))
      remote = pushed.exitCode === 0 ? plan.remote : []
      if (pushed.exitCode !== 0) failed.push(...plan.remote.map(n => `origin/${n}`))
    }
    await storeSet($, BRANCH_SWEEP_KEY, { at: now, why, local, remote, failed, kept: plan.kept.length }).catch(() => undefined)
    return sweepNote({ local, remote, failed })
  } catch {
    return ''
  } finally {
    sweeping = false
  }
}

/** Le ménage qui suit un archivage (#313) : après la libération du worktree, puis une seconde fois plus tard. */
function sweepAfterArchive($: EngineInterface, source: Source | undefined): void {
  if (!source || !settings.pruneBranches || projectSettings(source).travail !== 'code') return
  for (const ms of BRANCH_SWEEP_DELAYS_MS) {
    try {
      $.clock.after(ms, () => {
        void sweepBranches($, source, 'archive').then(note => {
          if (note) $.ui.toast(note)
        })
      })
    } catch {
      // horloge indisponible : le démarrage suivant fera le ménage
    }
  }
}

/**
 * « Rouvrir la session » d'une tâche close (#206 ; confirmée depuis #302) : désarchive sa session, puis l'ouvre comme
 * « Ouvrir la session » (le lien, quand l'app ne la range pas d'ici). Un refus s'écrit sous la fiche.
 */
async function reopenSession($: EngineInterface, source: Source, t: Task, row: TaskSessionRow, now: number): Promise<void> {
  reopenAskNow = ''
  await setView($, () => ({ openAt: '', openNote: '', reopenAsk: '' }))
  // #313 : l'app rattache un worktree à la branche de la session par son nom ; supprimée par le ménage,
  // elle se recrée d'abord depuis la base, où son travail est déjà fusionné.
  const branch = row.branch ?? t.branche
  if (branch) await restoreBranch($, source, branch)
  let outcome: ReturnType<typeof reopenOutcome>
  try {
    outcome = reopenOutcome(await $.tool.call({ tool: UNARCHIVE_SESSION_TOOL, session_id: row.sessionId }))
  } catch (err) {
    outcome = { open: false, note: `Réouverture impossible : ${err instanceof Error ? err.message : String(err)}` }
  }
  if (!outcome.open) return void (await setView($, () => ({ openAt: '', openNote: outcome.note })))
  archivedSessionIds.delete(row.sessionId)
  taskSessions.set(`${source.name}:${t.id}`, { row: { ...row, isArchived: false }, at: now })
  await update($, liveVersionAtom, v => v + 1)
  await openSession($, { sessionId: row.sessionId, startedAt: now, title: row.title, ...(row.link ? { link: row.link } : {}) })
}

/**
 * La branche d'une session qu'on rouvre (#313) : présente, rien ; absente (le ménage l'a supprimée),
 * recréée à la pointe de la base (`main`, sinon `master`) dans le dossier principal. Un nom qui se lirait
 * comme une option n'est jamais passé à git. Un échec n'empêche pas la réouverture.
 */
async function restoreBranch($: EngineInterface, source: Source, name: string): Promise<void> {
  if (name.startsWith('-')) return
  try {
    const run = (dir: string, ...args: string[]) => $.process.run(['git', '-C', dir, ...args], { timeoutMs: 30_000 })
    const dir = source.root ?? source.dir
    const listed = await run(dir, 'worktree', 'list', '--porcelain')
    const main = (listed.exitCode === 0 ? /^worktree (.+)$/m.exec(listed.stdout)?.[1]?.trim() : undefined) || dir
    if ((await run(main, 'show-ref', '--verify', '--quiet', `refs/heads/${name}`)).exitCode === 0) return
    for (const base of ['main', 'master']) {
      if ((await run(main, 'rev-parse', '--verify', '--quiet', `refs/heads/${base}`)).exitCode !== 0) continue
      await run(main, 'branch', name, base)
      return
    }
  } catch {
    // git indisponible : l'app dira elle-même si la branche manque
  }
}

/** Un /compact lancé par la bande et pas encore répondu : un second clic n'en lance pas un autre (#197). */
let compactAsked = false

/**
 * « Compacter » de la bande de Maestro (#197) : /compact comme si la personne le tapait, mis en file
 * jusqu'au repos de la session. Un refus se dit en toast.
 */
async function compactFromBand($: EngineInterface): Promise<void> {
  if (compactAsked) return
  compactAsked = true
  try {
    await $.command.run({ command: 'compact' })
  } catch (err) {
    $.ui.toast(`Compaction impossible : ${err instanceof Error ? err.message : String(err)}`)
  } finally {
    compactAsked = false
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

/** `_cowork/cowork.py` écrit la roadmap de ce dossier, sauf quand son `cowork.json` la confie au plugin (#262). */
async function coworkPyFor($: EngineInterface, source: Source): Promise<boolean> {
  const [tool, cow] = await Promise.all([
    $.fs.exists(`${source.dir}/_cowork/cowork.py`).catch(() => false),
    readOr($, `${source.dir}/cowork.json`),
  ])
  return coworkPyWrites(tool, cow)
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
  await afterBackgroundWrites()
  const now = new Date(await $.clock.now())
  const day = todayOf(now.getTime())
  const moment = `${day} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const abandon = kind === 'abandon'
  // #242 : pas de clôture tant qu'une communication de la tâche n'est pas partie.
  const unsent = abandon ? undefined : await unsentClose($, source, task)
  if (unsent !== undefined) return { error: unsent }
  const bilan = abandon ? abandonBilan(reason) : doneBilan()
  const closed = abandon ? 'Annulée' : 'Faite'
  if (await coworkPyFor($, source)) {
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
  const parentNote = out.parent === undefined ? undefined : out.parent.next !== undefined ? `parent #${out.parent.id} reconduit au ${shortDate(out.parent.next)}` : `parent #${out.parent.id} fait aussi`
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

/**
 * Le ▶ d'une routine (#280) : due, il coche son occurrence par la voie de « Marquer faite » (le panneau
 * ou `cowork.py` ; avec `ecriture`, la coche ouvre le brief, Claude seul écrivant par cet outil), puis
 * pose la carte de sa session au brief léger. Pas due (déjà faite aujourd'hui), la carte seule.
 */
async function launchRoutine($: EngineInterface, source: Source, task: Task, shortTitle: string): Promise<void> {
  const today = todayOf(await $.clock.now())
  if (!routineDue(task, today) || source.ecriture !== undefined) return launchSession($, source, task, shortTitle, '', 'routine')
  if (cancelling) return
  cancelling = true
  let out: { id?: string; note?: string } | { error: string }
  try {
    out = await closeTask($, source, task, 'done', '').catch((err: unknown) => ({ error: `Routine non lancée : ${err instanceof Error ? err.message : String(err)}` }))
  } finally {
    cancelling = false
  }
  if ('error' in out) {
    await setView($, () => ({ launchNote: out.error }))
    return
  }
  await update($, retryAtom, v => v + 1)
  const next = task.due !== undefined && task.tous !== undefined ? nextDue(task.due, task.tous, today) : undefined
  try {
    $.ui.toast(`${task.id ? `#${task.id}` : 'Routine'} lancée · cochée${next ? `, revient le ${next}` : ''}${out.note ? ` : ${out.note}` : ''}`)
  } catch {
    // pas de toast sur cette surface : la carte suit
  }
  await launchSession($, source, task, shortTitle, '', 'routine', true)
}

/** Le clic sur « Confirmer » de l'encart : une écriture à la fois, puis le détail montre la tâche faite ou annulée. */
async function confirmClose($: EngineInterface, source: Source, task: Task, kind: CloseKind): Promise<void> {
  if (cancelling) return
  cancelling = true
  try {
    // Un projet qui écrit sa roadmap par son propre outil (`ecriture`, #164) : le panneau n'écrit pas,
    // il demande à Claude, par la boîte d'envoi (#140), pour passer par les hooks du plugin.
    // #242 : la route par Claude aussi attend l'envoi.
    const unsent = kind === 'done' ? await unsentClose($, source, task) : undefined
    if (unsent !== undefined) return void (await setView($, () => ({ cancelNote: unsent })))
    const cowork = await coworkPyFor($, source)
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
  await afterBackgroundWrites()
  if (await coworkPyFor($, source)) {
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
  const cowork = await coworkPyFor($, source)
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

/**
 * Les mouvements de case demandés (#182), par `taskKey` : posés à la confirmation, joués par la ligne
 * au premier dessin où elle a changé (`checkMoveAt`), puis oubliés. En mémoire : un rechargement les perd.
 */
const checkMoves = new Map<string, CheckMove>()

/**
 * Le temps passé du mouvement de cette ligne au dessin de `now`, s'il joue (#182). À son départ, une
 * minuterie redessine le panneau une fois, `CHECK_HOLD_MS` plus tard : la case redevient fixe, et une
 * tâche cochée quitte les ouvertes.
 */
function checkMoveOf($: EngineInterface, key: string, done: boolean, now: number): number | undefined {
  const out = checkMoveAt(checkMoves.get(key), done, now)
  if (out.move) checkMoves.set(key, out.move)
  else checkMoves.delete(key)
  if (out.elapsed === 0 && typeof setTimeout === 'function') {
    setTimeout(() => {
      void update($, checkMoveAtom, v => v + 1).catch(() => {
        // le panneau a pu se fermer : rien à redessiner
      })
    }, CHECK_HOLD_MS)
  }
  return out.elapsed
}

/** L'écriture d'un lot en cours (#316) : un second lot attend la fin du premier. */
let batching = false

/**
 * La case d'une ligne (#316, maquette C) : elle choisit sa tâche ou la retire, sans rien écrire ; une
 * mère emmène ses étapes dessinées (`kids`). Le bilan du dernier lot s'efface.
 */
async function togglePick($: EngineInterface, task: Task, kids: readonly Task[]): Promise<void> {
  await setView($, v => {
    const picked = pickToggle(v.picked ?? [], task, kids)
    return { picked, batchNote: '', confirmDone: [], ...(picked.length === 0 ? { batchMenu: '' } : {}) }
  })
}

/** Le ✕ de la barre (#316) : la sélection se vide, la ligne de la liste revient. */
async function clearPick($: EngineInterface): Promise<void> {
  await setView($, () => ({ picked: [], batchMenu: '', batchNote: '', confirmDone: [] }))
}

/** Les tâches de la roadmap, ouvertes (dates de parent comprises) et faites, relues pour un lot. */
async function batchTasks($: EngineInterface, source: Source): Promise<Task[]> {
  const [open, done] = await Promise.all([load($, files(source).open, 'ROADMAP.md'), load($, files(source).done, 'ROADMAP-fait.md')])
  return [...(typeof open === 'string' ? [] : withParentDates(open.filter(t => !t.done))), ...(typeof done === 'string' ? [] : done.filter(t => t.done))]
}

/**
 * Une édition en lot (#316) : le plan de `batchPlan`, puis chaque tâche relue et écrite par les voies
 * existantes, une à la fois : `saveEdit` pour sa date et sa récurrence, `closeTask` ou `reopenTask`
 * (ou Claude, avec `ecriture`) pour son statut. Un refus ne bloque pas les autres ; le bilan se pose
 * sous la barre, et la sélection ne garde que les tâches refusées.
 */
async function applyBatch($: EngineInterface, source: Source, change: BatchChange, what: string, keys?: readonly string[]): Promise<void> {
  if (batching || checking) {
    try {
      $.ui.toast('Une écriture est en cours : réessaie dans un instant.')
    } catch {
      // pas de toast sur cette surface
    }
    return
  }
  batching = true
  checking = true
  try {
    await afterBackgroundWrites()
    await setView($, () => ({ batchNote: SAVE_BUSY, confirmDone: [] }))
    const picked = (await read($, viewAtom)).picked ?? []
    // La question d'une coche (#355) dit ses tâches ; sans sélection ouverte, la sélection reste vide.
    const steps = batchPlan(await batchTasks($, source), keys ?? picked, change)
    const at = await $.clock.now()
    const outcomes: { task: Task; ok: boolean; why?: string }[] = []
    for (const step of steps) {
      const whys = await runBatchStep($, source, step, at)
      outcomes.push({ task: step.task, ok: whys.length === 0, ...(whys.length > 0 ? { why: whys.join(' ; ') } : {}) })
    }
    const keep = outcomes.filter(o => !o.ok).map(o => taskKey(o.task))
    await update($, retryAtom, v => v + 1)
    // Une coche seule (#355) n'ouvre pas de sélection : ses refus se lisent au bilan.
    const kept = picked.length === 0 ? [] : keep
    await setView($, () => ({ picked: kept, batchNote: batchSummary(outcomes, what), ...(kept.length === 0 ? { batchMenu: '' } : {}) }))
  } finally {
    batching = false
    checking = false
  }
}

/**
 * Un pas d'un lot (#316), ou d'un clic sur une case (#355) : la tâche relue, ses champs réécrits par
 * `saveEdit`, puis sa clôture (`closeTask`) ou sa réouverture (`reopenTask`), ou Claude avec `ecriture` ;
 * la case joue son mouvement (#182). Rend ce qui ne s'est pas fait, vide quand tout a pris.
 */
async function runBatchStep($: EngineInterface, source: Source, step: BatchStep, at: number): Promise<string[]> {
  const key = taskKey(step.task)
  const fresh = async () => (await batchTasks($, source)).find(t => taskKey(t) === key)
  const whys: string[] = step.refused ? [step.refused] : []
  if (Object.keys(step.edit).length > 0) {
    const task = await fresh()
    const out = task === undefined ? { error: 'a quitté la roadmap' } : await saveEdit($, source, task, step.edit).catch((err: unknown) => ({ error: err instanceof Error ? err.message : String(err) }))
    if ('error' in out) whys.push(out.error)
  }
  if (step.close || step.reopen) {
    const task = await fresh()
    if (task === undefined) whys.push('a quitté la roadmap')
    else if (!(await checkByClaude($, source, task, step.close ? 'done' : 'reopen'))) {
      checkMoves.set(key, { done: step.close, at })
      const out = step.close
        ? await closeTask($, source, task, 'done', '').catch((err: unknown) => ({ error: `Clôture impossible : ${err instanceof Error ? err.message : String(err)}` }))
        : await reopenTask($, source, task).catch((err: unknown) => ({ error: `Réouverture impossible : ${err instanceof Error ? err.message : String(err)}` }))
      if ('error' in out) {
        checkMoves.delete(key)
        whys.push(out.error)
      }
    }
  }
  // Une mère qui attend sa dernière étape : fermée avec elle, ou encore ouverte si une étape a refusé.
  if (step.motherWaits && (await fresh())?.done === false) whys.push('se cochera avec sa dernière étape')
  return whys
}

/**
 * Le clic sur une ligne (#355, maquette C ; retours de Bertrand du 2026-11-06) : son numéro choisit
 * (`togglePick`) ; sa case pose la question d'une coche en haut (`confirmDone` : la tâche seule, ou le lot
 * qu'elle rejoint), et le panneau remonte jusqu'à elle ; sans sélection, la case d'une faite la rouvre, sans
 * question, par les gardes d'un lot (`batchPlan`), ce qu'il a donné en toast.
 */
async function caseClick($: EngineInterface, source: Source, task: Task, kids: readonly Task[], via: 'case' | 'number'): Promise<void> {
  const picked = (await read($, viewAtom)).picked ?? []
  const gesture = caseGesture({ task, picked, via })
  if (gesture === 'pick') return togglePick($, task, kids)
  if (gesture === 'ask') return askDone($, caseConfirmKeys(picked, task))
  if (batching || checking) {
    try {
      $.ui.toast('Une écriture est en cours : réessaie dans un instant.')
    } catch {
      // pas de toast sur cette surface
    }
    return
  }
  batching = true
  checking = true
  try {
    await afterBackgroundWrites()
    const [step] = batchPlan(await batchTasks($, source), [taskKey(task)], { status: 'open' })
    if (step === undefined) return void (await afterCheck($, { error: 'a quitté la roadmap' }, ''))
    const whys = await runBatchStep($, source, step, await $.clock.now())
    await afterCheck($, whys.length > 0 ? { error: `${task.id ? `#${task.id} ` : ''}${whys.join(' ; ')}` } : { id: task.id }, 'rouverte')
  } finally {
    batching = false
    checking = false
  }
}

/**
 * La question d'une coche (#355) : le bandeau la pose en haut pour ces tâches, et le panneau remonte jusqu'à
 * lui (`nearest` : rien ne bouge s'il se voit déjà). « ✓ Faites » écrit par `applyBatch`, « Annuler » la retire.
 */
async function askDone($: EngineInterface, keys: readonly string[]): Promise<void> {
  await setView($, () => ({ confirmDone: [...keys], batchNote: '', batchMenu: '' }))
  try {
    await $.ui.scroll({ to: { key: 'confirm-bar' }, in: PANE, block: 'nearest' })
  } catch {
    // le panneau a pu se fermer, ou la surface ne défile pas : la question reste posée
  }
}

/** Le geste d'une date dans le bilan d'un lot (#316) : « date au lun. 9 nov. », ou « sans date ». */
function batchDueWord(day: string): string {
  if (day === '') return 'sans date'
  const [y, m, d] = day.split('-').map(Number) as [number, number, number]
  const at = new Date(Date.UTC(y, m - 1, d))
  const wd = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'][at.getUTCDay()]
  const mo = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'][m - 1]
  return `date au ${wd} ${d} ${mo}`
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
    const openKids = typeof listed === 'string' ? [] : listed.filter(t => !t.done && t.parent === mother.id && t.id !== mother.id)
    const open = openKids.length
    // Chaque fille cochée joue son mouvement (#182), à son premier dessin faite.
    const at = await $.clock.now()
    for (const kid of openKids) checkMoves.set(taskKey(kid), { done: true, at })
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

/**
 * L'édition affichée sans attendre (#354). Enregistrer pose ici ce que la roadmap dira une fois écrite, le
 * panneau le dessine aussitôt, et l'écriture (pull, fichiers, commit, push) tourne en fond, une à la fois
 * (`inBackground`). D'affichage seul : les écritures relisent toujours les vrais fichiers, jamais ceci.
 * `open` et `done` sont les textes des deux fichiers à montrer, `axes` les styles d'axe à appliquer dans l'ordre.
 */
type AxisMove = { from: string; to: string; style: AxisStyle }
type PendingEdit = { dir: string; open?: string; done?: string; axes: AxisMove[] }
let pendingEdit: PendingEdit | undefined
/** Change à chaque pose ou retrait de l'attente : la clé des données gardées en mémoire. */
let pendingRev = 0
let backgroundJobs = 0
let backgroundChain: Promise<unknown> = Promise.resolve()

function setPending(next: PendingEdit | undefined): void {
  pendingEdit = next
  pendingRev++
  paneCache = undefined
}

/** L'attente de cette source, s'il y en a une. */
function pendingFor(source: { dir: string }): PendingEdit | undefined {
  return pendingEdit && pendingEdit.dir === source.dir ? pendingEdit : undefined
}

/** Les styles d'axe d'une source, les mouvements en attente appliqués : `from` retiré, `to` reçoit son style. */
function applyAxisMoves(axes: Readonly<Record<string, AxisStyle>> | undefined, moves: readonly AxisMove[]): Record<string, AxisStyle> {
  const out: Record<string, AxisStyle> = { ...(axes ?? {}) }
  for (const m of moves) {
    delete out[m.from]
    if (m.style.color !== undefined || m.style.label !== undefined) out[m.to] = m.style
    else delete out[m.to]
  }
  return out
}

/** Les textes que le panneau montre : l'attente d'abord, sinon les fichiers. */
async function shownTexts($: EngineInterface, source: Source): Promise<{ open: string; done: string | undefined }> {
  const { open, done } = files(source)
  const pending = pendingFor(source)
  return { open: pending?.open ?? (await $.fs.read(open)), done: pending?.done ?? (await readOr($, done)) }
}

/**
 * Une écriture en fond, après les précédentes. `job` rend `true` quand elle a réussi. Elle ne lève jamais.
 * Succès : plus rien en attente que pour les écritures qui suivent, les données se relisent. Échec : l'attente
 * s'efface tout de suite (`job` a rouvert l'édition), les fichiers relus font foi.
 */
/**
 * Attend la fin des écritures en fond (#354) : une autre écriture de la roadmap (clore, rouvrir, cocher, le
 * drapeau) part après elles, jamais en même temps. Jamais depuis un job de la chaîne : il s'attendrait lui-même.
 */
async function afterBackgroundWrites(): Promise<void> {
  await backgroundChain.catch(() => undefined)
}

function inBackground($: EngineInterface, job: () => Promise<boolean>): void {
  backgroundJobs++
  backgroundChain = backgroundChain
    .then(job)
    .catch(() => false)
    .then(async ok => {
      backgroundJobs--
      if (!ok || backgroundJobs === 0) setPending(undefined)
      else paneCache = undefined
      knownSource = undefined
      await update($, retryAtom, v => v + 1).catch(() => undefined)
    })
}

/** Les brouillons d'une tâche, par champ. */
function draftsOf(key: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of editDrafts) if (k.startsWith(`${key}|`)) out[k.slice(key.length + 1)] = v
  return out
}

function clearDrafts(key: string): void {
  for (const k of [...editDrafts.keys()]) if (k.startsWith(`${key}|`)) editDrafts.delete(k)
}

/** Les règles du projet qui contrôlent la ligne éditée (#155), les parents clos compris : refusés à la fiche comme à l'écriture (#289). */
async function editRules($: EngineInterface, source: Source): Promise<Partial<LintRules>> {
  const settings = projectSettings(source)
  return { requis: settings.requis, requiredOn: settings.requiredOn, cles: settings.cles, closed: doneIds(await readOr($, files(source).done)) }
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
  const { open } = files(source)
  const rules = await editRules($, source)
  const cowork = await coworkPyFor($, source)
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
    const writeLine = (label: string, line: string) =>
      runPython($, [`${source.dir}/_cowork/cowork.py`, 'roadmap', 'update', source.dir, '--match-b64', utf8Base64(label), '--line-b64', utf8Base64(line)], source.dir)
    const run = await writeLine(task.label, out.line)
    if (run.exitCode !== 0) return { error: `cowork.py a refusé, rien n'a été écrit : ${lastLine(run.stderr || run.stdout)}` }
    // Les sous-tâches emmenées par le nouvel axe de leur mère (#190), une ligne à la fois.
    for (const child of out.cascade ?? []) {
      const sub = await writeLine(child.label, child.line)
      if (sub.exitCode !== 0) return { error: `Axe changé, mais cowork.py a refusé la sous-tâche « ${clip(child.label, 60)} » : ${lastLine(sub.stderr || sub.stdout)}` }
    }
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

/**
 * Les fichiers de la roadmap réécrits par le panneau, par le chemin de l'édition d'une fiche (#161) : dans git,
 * seulement sur main, sans modification en attente de ces fichiers, un pull avant, puis commit et push (un
 * second essai après un rebase). Hors de git, l'écriture seule. `write` rend les textes à écrire, par nom.
 */
async function writeRoadmapFiles(
  $: EngineInterface,
  source: Source,
  names: readonly string[],
  message: string,
  write: () => Promise<Record<string, string> | { error: string }>,
): Promise<{ note?: string } | { error: string }> {
  const git = (...args: string[]) => $.process.run(['git', '-C', source.dir, ...args], { timeoutMs: 60_000 })
  const head = await git('rev-parse', '--abbrev-ref', 'HEAD')
  const inGit = head.exitCode === 0
  let upstream = false
  if (inGit) {
    const branch = head.stdout.trim()
    if (branch !== 'main' && branch !== 'master') return { error: `${source.name} est sur « ${branch} », pas sur main : sa roadmap ne s'écrit que sur main. Rien n'a été écrit.` }
    const status = await git('status', '--porcelain', '--', ...names)
    if (status.stdout.trim() !== '') return { error: `La roadmap a des modifications non committées (${lastLine(status.stdout)}) : une session l'écrit peut-être. Rien n'a été écrit.` }
    upstream = (await git('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}')).exitCode === 0
    if (upstream) {
      const pull = await git('pull', '--ff-only', '-q')
      if (pull.exitCode !== 0) return { error: `git pull a échoué, rien n'a été écrit : ${lastLine(pull.stderr || pull.stdout)}` }
    }
  }
  const texts = await write()
  if ('error' in texts) return texts
  const changed = Object.keys(texts)
  for (const name of changed) await $.fs.write(`${source.dir}/${name}`, texts[name] as string)
  if (!inGit || changed.length === 0) return {}
  const commit = await git('commit', '-q', '-m', message, '--', ...changed)
  if (commit.exitCode !== 0) return { note: `Enregistré, mais pas committé : ${lastLine(commit.stderr || commit.stdout)}` }
  if (!upstream || (await git('push', '-q')).exitCode === 0) return {}
  const rebase = await git('pull', '--rebase', '-q')
  const push = rebase.exitCode === 0 ? await git('push', '-q') : rebase
  return push.exitCode === 0 ? {} : { note: `Enregistré et committé, mais pas poussé : ${lastLine(push.stderr || push.stdout)}` }
}

/**
 * Où vit le style des axes d'une roadmap (#286) : son `.claude/roadmap.json` ; une source déclarée dans
 * `~/.claude/roadmap-perso.json`, son entrée ; une roadmap seule, un `.claude/roadmap.json` à créer à sa racine.
 */
async function axisConfigOf($: EngineInterface, source: Source): Promise<{ path: string; perso?: string }> {
  const project = `${source.root ?? source.dir}/.claude/roadmap.json`
  if (await $.fs.exists(project).catch(() => false)) return { path: project }
  const perso = await readPerso($)
  if (perso.sources.some(s => s.name === source.name)) {
    let home = ''
    try {
      home = ((await $.env.get('HOME')) ?? '').replace(/\/+$/, '')
    } catch {
      // sans HOME, le chemin part de la racine et l'écriture échoue, dite sous le champ
    }
    return { path: `${home}/.claude/roadmap-perso.json`, perso: source.name }
  }
  return { path: project }
}

let axisSaving = false

/** Un toast, sans lever sur une surface qui n'en a pas. */
function sayToast($: EngineInterface, text: string): void {
  try {
    $.ui.toast(text)
  } catch {
    // pas de toast sur cette surface
  }
}

/**
 * Enregistre l'édition d'un axe (#286) : le renommage d'abord, quand le slug du nom change (le panneau écrit
 * ROADMAP.md et ROADMAP-fait.md ; Cowork et `ecriture` : la demande part à Claude), puis la couleur et le
 * libellé dans la config. Un refus connu d'avance (nom sans slug, axe déjà pris) se dit sous le champ, l'édition
 * reste ouverte. Le reste s'affiche aussitôt et s'écrit en fond (#354) : l'édition se ferme, le nouveau nom est
 * dessiné ; un échec remet l'ancien nom, rouvre l'édition avec le brouillon et l'erreur, et le dit en toast.
 * La voie `claude` n'attend rien : la roadmap est écrite plus tard par Claude, la config ici, comme avant.
 */
async function saveAxisEdit($: EngineInterface, source: Source, from: string, label: string, color: AxisStyle['color']): Promise<void> {
  if (axisSaving) return
  axisSaving = true
  const fail = (why: string) => setView($, () => ({ axisNote: why }))
  try {
    const name = label.replace(/\s+/g, ' ').trim()
    const to = axisSlug(name)
    if (to === '') return void (await fail('Ce nom ne donne aucun slug : mets-y au moins une lettre ou un chiffre.'))
    await setView($, () => ({ axisNote: SAVE_BUSY }))
    const origin = (await read($, viewAtom)).axisEdit ?? ''
    const shown = await shownTexts($, source)
    const check = to !== from ? renameAxisInTexts(shown.open, shown.done, from, to) : undefined
    if (check && 'error' in check) return void (await fail(check.error))
    const route = to !== from ? renameAxisRoute({ ecriture: source.ecriture, cowork: await coworkPyFor($, source), from, to }) : undefined
    // Le libellé ne se garde que s'il dit autre chose que l'axe à majuscule.
    const style: AxisStyle = { ...(color ? { color } : {}), ...(name !== axisName(to, undefined) ? { label: name } : {}) }
    const before = source.axes?.[from] ?? {}
    const styleChanged = to !== from || before.color !== style.color || before.label !== style.label
    const closeEdit = () =>
      setView($, v => ({ axisEdit: '', axisDraft: undefined, axisPick: '', axisNote: '', ...(v.axis === from ? { axis: to } : {}) }))
    if (!styleChanged) return void (await closeEdit())
    /** Les écritures : les fichiers de la roadmap (voie du panneau), puis la config. */
    const write = async (): Promise<{ note: string } | { error: string }> => {
      try {
        let note = ''
        if (route?.via === 'panel') {
          const out = await writeRoadmapFiles($, source, ['ROADMAP.md', 'ROADMAP-fait.md'], `roadmap: axe ${from} → ${to}`, async () => {
            const { open, done } = files(source)
            const fresh = renameAxisInTexts(await $.fs.read(open), await readOr($, done), from, to)
            if ('error' in fresh) return fresh
            return { 'ROADMAP.md': fresh.open, ...(fresh.done !== undefined ? { 'ROADMAP-fait.md': fresh.done } : {}) }
          })
          if ('error' in out) return out
          note = out.note ?? ''
        }
        const where = await axisConfigOf($, source)
        const text = await readOr($, where.path)
        const next = where.perso !== undefined && text !== undefined ? withPersoAxisStyle(text, where.perso, { from, to, style }) : withAxisStyle(text, { from, to, style })
        await $.fs.write(where.path, next)
        return { note }
      } catch (err) {
        return { error: `Rien d'écrit : ${err instanceof Error ? err.message : String(err)}` }
      }
    }
    if (route?.via === 'claude') {
      // Claude écrit la roadmap, le panneau la config, tout de suite : rien à afficher en attente.
      queueSubmit($, route.text)
      const out = await write()
      if ('error' in out) return void (await fail(out.error))
      knownSource = undefined
      await update($, stampAtom, v => v + 1)
      await closeEdit()
      sayToast($, [route.note, out.note].filter(n => n !== '').join(' ; '))
      return
    }
    // Le nouveau nom se dessine aussitôt (#354) ; l'écriture suit en fond, derrière les précédentes.
    const prev = pendingFor(source)
    const open = check ? check.open : prev?.open
    const done = check ? (check.done ?? prev?.done) : prev?.done
    setPending({ dir: source.dir, ...(open !== undefined ? { open } : {}), ...(done !== undefined ? { done } : {}), axes: [...(prev?.axes ?? []), { from, to, style }] })
    await closeEdit()
    inBackground($, async () => {
      const out = await write()
      if ('error' in out) {
        setPending(undefined)
        await setView($, v => ({
          axisEdit: origin !== '' ? origin : `head:${from}`,
          axisDraft: label,
          axisPick: color ?? '',
          axisNote: out.error,
          ...(to !== from && v.axis === to ? { axis: from } : {}),
        }))
        sayToast($, `Pas enregistré : ${out.error}`)
        return false
      }
      await update($, stampAtom, v => v + 1)
      if (out.note !== '') sayToast($, out.note)
      return true
    })
  } catch (err) {
    await fail(`Rien d'écrit : ${err instanceof Error ? err.message : String(err)}`)
  } finally {
    axisSaving = false
  }
}

/** La clé du store qui garde le jour du dernier report des étapes de journée d'une roadmap (#277). */
function dayStepsKey(source: Source): string {
  return `day-steps:${source.dir}`
}

/**
 * Les étapes de journée qui passent (#277), une fois par jour au démarrage d'une session : le jour
 * se pose au store avant d'écrire (deux sessions ouvertes ensemble n'écrivent qu'une fois), puis les
 * étapes passées avancent par la voie du projet : Claude pour `cowork.py` et l'outil d'`ecriture`
 * (aucun script du projet ne se lance sans geste), sinon le panneau, avec les gardes de `saveEdit` (sur main, rien en
 * attente, à jour de l'amont), committé seul et poussé. Rien n'est demandé ; une panne se tait.
 */
async function rollDayStepsOnStart($: EngineInterface, source: Source): Promise<void> {
  const today = todayOf(await $.clock.now())
  const key = dayStepsKey(source)
  if ((await $.store.get(key).catch(() => undefined)) === today) return
  const { open } = files(source)
  const aPreuve = projectSettings(source).aPreuve
  const first = rollDaySteps((await readOr($, open)) ?? '', today, aPreuve)
  await storeSet($, key, today)
  if (first.moves.length === 0) return
  const cowork = await coworkPyFor($, source)
  // Aucun script du projet ne se lance seul au démarrage : cowork.py et `ecriture` passent par Claude.
  const route = rollRoute({ ecriture: source.ecriture, cowork, moves: first.moves })
  if (route === undefined) return
  if (route.via === 'claude') return queueSubmit($, route.text)
  const git = (...args: string[]) => $.process.run(['git', '-C', source.dir, ...args], { timeoutMs: 60_000 })
  const head = await git('rev-parse', '--abbrev-ref', 'HEAD')
  const inGit = head.exitCode === 0
  let upstream = false
  if (inGit) {
    const branch = head.stdout.trim()
    if (branch !== 'main' && branch !== 'master') return
    if ((await git('status', '--porcelain', '--', 'ROADMAP.md')).stdout.trim() !== '') return
    upstream = (await git('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}')).exitCode === 0
    if (upstream && (await git('pull', '--ff-only', '-q')).exitCode !== 0) return
  }
  // Relue après le pull : une autre machine a pu reporter ou cocher entre-temps.
  const out = rollDaySteps(await $.fs.read(open), today, aPreuve)
  if (out.moves.length === 0) return
  await $.fs.write(open, out.open)
  await update($, retryAtom, v => v + 1)
  if (!inGit) return
  const ids = out.moves.map(m => (m.id ? `#${m.id}` : clip(m.label, 30))).join(', ')
  if ((await git('commit', '-q', '-m', `roadmap: report des étapes de journée ${ids}`, '--', 'ROADMAP.md')).exitCode !== 0) return
  if (!upstream || (await git('push', '-q')).exitCode === 0) return
  // Un autre clone a avancé : on se remet dessus, puis un seul nouvel essai.
  if ((await git('pull', '--rebase', '-q')).exitCode === 0) await git('push', '-q')
}

/**
 * Le clic sur « Enregistrer » (#161) : une écriture à la fois ; rien de changé, la fiche se referme. La ligne se
 * contrôle d'abord sur le texte affiché : refusée, le refus se dit sous le champ, la fiche reste ouverte. Sinon
 * (#354) la fiche se ferme et montre la ligne éditée aussitôt, l'écriture tourne en fond ; un échec rouvre la
 * fiche avec le brouillon et l'erreur, et le dit en toast. La voie `claude` (`ecriture`) n'attend rien : comme avant.
 */
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
    const refuse = (out: { error: string; field?: EditField }) => setView($, () => ({ editNote: out.error, editField: out.field ?? '' }))
    const shown = await shownTexts($, source).catch(() => undefined)
    const rules = await editRules($, source)
    const first = shown ? editInTexts(shown.open, task, edit, rules) : undefined
    if (first && 'error' in first) return void (await refuse(first))
    const route = editRoute({ ecriture: source.ecriture, cowork: await coworkPyFor($, source), task, edit })
    const finish = async (out: { id?: string; warnings: string[]; note?: string; asked?: string }, inFront: boolean) => {
      clearDrafts(key)
      // En fond, la fiche est déjà fermée (peut-être rouverte sur une autre tâche) : seul le toast le dit.
      if (inFront) {
        const note = [...(out.asked ? [`Demandé à Claude : ${out.asked}`] : []), ...out.warnings, ...(out.note ? [out.note] : [])].join(' ; ')
        await setView($, () => ({ editing: '', editNote: note, editField: '', ...(out.id ? { selected: `id:${out.id}` } : {}) }))
      }
      await update($, retryAtom, v => v + 1)
      sayToast($, out.asked ? `Demandé à Claude : ${out.asked}` : `${out.id ? `#${out.id} ` : 'Tâche '}enregistrée${out.note ? ` : ${out.note}` : ''}`)
    }
    const caught = (err: unknown) => ({ error: `Enregistrement impossible : ${err instanceof Error ? err.message : String(err)}` })
    if (!first || !first.changed || route.via === 'claude') {
      // Rien à écrire, ou Claude l'écrit plus tard : pas d'attente d'affichage, l'écriture se fait ici.
      const out = await saveEdit($, source, task, edit).catch(caught)
      if ('error' in out) return void (await refuse(out))
      return void (await finish(out, true))
    }
    const prev = pendingFor(source)
    setPending({ dir: source.dir, open: first.open, ...(prev?.done !== undefined ? { done: prev.done } : {}), axes: prev?.axes ?? [] })
    await setView($, () => ({ editing: '', editNote: '', editField: '', ...(task.id ? { selected: `id:${task.id}` } : {}) }))
    inBackground($, async () => {
      const out = await saveEdit($, source, task, edit).catch(caught)
      if ('error' in out) {
        setPending(undefined)
        await setView($, () => ({ editing: key, editNote: out.error, editField: out.field ?? '', editCount: 0 }))
        sayToast($, `Pas enregistré : ${out.error}`)
        return false
      }
      await finish(out, false)
      return true
    })
  } finally {
    saving = false
  }
}

/**
 * Le clic sur le drapeau de la fiche (#300, F1) : pose `prio:oui`, ou retire `prio:` d'une prioritaire
 * (`prio:1` de l'ancienne échelle comprise), par `saveEdit`, la voie d'écriture du projet ; une à la fois.
 */
async function togglePriority($: EngineInterface, source: Source, task: Task): Promise<void> {
  if (saving) return
  saving = true
  try {
    await afterBackgroundWrites()
    const out = await saveEdit($, source, task, { prio: isPriority(task) ? '' : 'oui' }).catch((err: unknown) => ({
      error: `Enregistrement impossible : ${err instanceof Error ? err.message : String(err)}`,
    }))
    if (!('error' in out)) await update($, retryAtom, v => v + 1)
    try {
      $.ui.toast('error' in out ? out.error : out.asked ? `Demandé à Claude : ${out.asked}` : `${out.id ? `#${out.id} ` : 'Tâche '}enregistrée${out.note ? ` : ${out.note}` : ''}`)
    } catch {
      // pas de toast sur cette surface : la ligne redessinée le montre
    }
  } finally {
    saving = false
  }
}

/**
 * Ouvre un fichier dans le panneau Fichiers de Claude Code, à la ligne voulue. Ce panneau n'ouvre
 * que les dossiers de la session : hors de ceux-là, le fichier part dans l'app par défaut du Mac.
 */
async function openFile($: EngineInterface, source: Source, path: string, opts: { line?: number; at?: string } = {}): Promise<void> {
  await setView($, () => ({ openNote: '', openAt: '' }))
  // #349 : `open` lance un programme comme il ouvre un document. Rien ne part avant que le chemin réel (liens
  // résolus) soit un fichier ordinaire, d'une extension de document, sous le dossier du projet.
  const realOf = async (p: string | undefined): Promise<string | undefined> => {
    if (p === undefined) return undefined
    try {
      return (await $.fs.stat(p, { resolve: true })).realPath
    } catch {
      return undefined
    }
  }
  const real = await realOf(path)
  let kind: string | undefined
  if (real !== undefined) {
    try {
      kind = (await $.fs.stat(real)).kind
    } catch {
      kind = undefined
    }
  }
  const bases = [...new Set([await realOf(source.root ?? source.dir), await realOf(source.dir)])]
  const verdict = openVerdict(real !== undefined && kind !== undefined ? { path: real, kind } : undefined, bases)
  if (verdict !== 'ok') {
    const note = openRefusal(verdict, path)
    await setView($, () => ({ openNote: note, openAt: opts.at ?? '' }))
    return
  }
  const target = real!
  const line = opts.line
  try {
    const ran = await $.tool.call({ tool: SHOW_PANE_TOOL, pane: 'file', path: target, ...(line ? { line } : {}) })
    if (ran.deny === undefined && !ran.isError) return
  } catch {
    // outil absent (terminal, autre hôte) : repli plus bas
  }
  await $.process.run(['open', target])
  await setView($, () => ({
    openNote: "Ouvert dans l'app par défaut : ce dossier n'est pas un dossier de la session, le panneau Fichiers ne l'affiche pas.",
  }))
}

/** La page de maquettes d'une tâche (#306) : la plus récente, relue au plus toutes les 30 s. */
let mockupRead: { key: string; at: number; page: { path: string; name: string } | undefined } | undefined

async function readMockupPage($: EngineInterface, source: Source, task: Task, now: number): Promise<{ path: string; name: string } | undefined> {
  const base = source.root ?? source.dir
  const key = `${base}|${task.key}|${task.spec ?? ''}|${(task.livrable ?? []).join(',')}`
  if (mockupRead && mockupRead.key === key && now - mockupRead.at < FOCUS_FACTS_MS) return mockupRead.page
  const dir = task.spec ? `${base}/${task.spec.replace(/\/+$/, '')}` : undefined
  const names = dir ? (await $.fs.list(dir).catch(() => [])).filter(e => e.kind === 'file').map(e => e.name) : []
  let best: { path: string; name: string; mtime: number } | undefined
  for (const rel of mockupPagesOf(task, names)) {
    for (const path of pathCandidates(source, rel)) {
      try {
        const st = await $.fs.stat(path)
        if (st.kind !== 'file') continue
        if (!best || st.mtimeMs > best.mtime) best = { path, name: baseName(path), mtime: st.mtimeMs }
        break
      } catch {
        // absent ici : le candidat suivant
      }
    }
  }
  const page = best ? { path: best.path, name: best.name } : undefined
  mockupRead = { key, at: now, page }
  return page
}

/** Le texte d'un appel d'outil réussi ; refusé (mode auto, #248), en erreur ou absent : `undefined`. */
async function toolText($: EngineInterface, call: { tool: string } & Record<string, unknown>): Promise<string | undefined> {
  try {
    const ran = await $.tool.call(call)
    return ran.deny === undefined && !ran.isError ? (ran.text ?? '') : undefined
  } catch {
    return undefined
  }
}

/** La barre latérale repliée par le bouton des maquettes (#306) : il la rouvre en fermant, et seulement elle. */
let mockupFoldedSidebar = false

/**
 * Le bouton des maquettes (#306) : ouvre la page dans le volet navigateur et replie la barre latérale,
 * le plus grand que l'app laisse prendre à un plugin (le ↗ du volet n'a pas d'appel) ; ou referme le
 * volet et rouvre la barre. En mode auto, ou l'ouverture refusée, la demande passe par Claude (#248).
 */
async function toggleMockup($: EngineInterface, path: string): Promise<void> {
  await setView($, () => ({ openAt: '', openNote: '' }))
  const viaClaude = async () => {
    queueSubmit($, mockupAskText(path))
    // La note redessine le panneau, et ce dessin envoie le message.
    await setView($, () => ({ openAt: '', openNote: 'Demandé à Claude : ouvrir les maquettes dans son volet navigateur.' }))
  }
  if ((await ownMode($)) === 'auto') return viaClaude()
  const opened = await read($, mockupOpenAtom)
  const layout = await toolText($, { tool: GET_LAYOUT_TOOL })
  if (mockupToggle(layout === undefined ? undefined : previewOpenIn(layout), opened, path) === 'close') {
    await toolText($, { tool: CLOSE_PANE_TOOL, pane: 'preview' })
    if (mockupFoldedSidebar) await toolText($, { tool: SIDEBAR_TOOL, collapsed: false })
    mockupFoldedSidebar = false
    await update($, mockupOpenAtom, () => '')
    return
  }
  if ((await toolText($, { tool: PREVIEW_START_TOOL, url: fileUrl(path) })) === undefined) return viaClaude()
  await toolText($, { tool: SHOW_PANE_TOOL, pane: 'preview' })
  const win = await toolText($, { tool: WINDOW_LAYOUT_TOOL })
  if (!mockupFoldedSidebar && win !== undefined && !/"sidebar_collapsed"\s*:\s*true/.test(win)) {
    mockupFoldedSidebar = (await toolText($, { tool: SIDEBAR_TOOL, collapsed: true })) !== undefined
  }
  await update($, mockupOpenAtom, () => path)
}

// Les filtres d'axe, partagés par la légende et la barre. Un filtre change : les sections se rouvrent.
/** Un clic sur un axe garde le compteur ou l'état choisi, pour les combiner (#99, partout depuis #176) ; posé à chaque dessin. */
let axisKeepsState = false

function pressAxis($: EngineInterface, a: string): void {
  void setView($, v => ({ axis: v.axis === a ? 'all' : a, attend: axisKeepsState ? v.attend : 'all', showDone: false, closedGroups: [], moreGroups: [] }))
}

/** `shown` : la vue Done telle que dessinée, d'office comprise (#202) : le clic en sort. */
function pressDone($: EngineInterface, shown: boolean): void {
  void setView($, () => ({ showDone: !shown, axis: 'all', attend: 'all', closedGroups: [], moreGroups: [] }))
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
    await storeSet($, PERF_KEY, rows)
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
async function readSessionPrefs($: EngineInterface): Promise<{ prefs: SessionPrefs; error?: string; project?: string; design?: Design; roadmap: boolean }> {
  await readPerso($)
  const file = await prefsFile($)
  const text = file && (await $.fs.exists(file.path)) ? await $.fs.read(file.path) : undefined
  const project = await sessionProject($)
  const source = await currentSource($)
  const design = source?.design
  // Un projet à roadmap reçoit la règle « Proposer une task » (#216).
  const read = { ...sessionPrefs(text, project.key, project.home), ...(design ? { design } : {}), roadmap: source !== undefined }
  return project.name === undefined ? read : { ...read, project: project.name }
}

/** Le bloc des réglages de session complets ; une panne de lecture ne bloque jamais le démarrage ni le message. */
async function sessionPrefsBlock($: EngineInterface): Promise<string | undefined> {
  try {
    const { prefs, error, project, design, roadmap } = await readSessionPrefs($)
    return sessionPrefsText(prefs, error, project, design, roadmap)
  } catch {
    return undefined
  }
}

// Le moteur ne dessine une ouverture « non demandée » (démarrage, minuteur) qu'à partir de 144 colonnes,
// 110 pour un volet déjà ouvert à la main ; en dessous, le volet attend sans rien dire. La raison part au
// journal de débogage : chez Caro (#117), c'est elle qui dit pourquoi le panneau ne paraissait pas.
async function openPane($: EngineInterface, source: Source) {
  // Un panneau qui s'ouvre (pas déjà dessiné) reprend la vue d'ouverture (#188) : toutes les tâches, en
  // arbre, « Plus › » replié ; ouvert, il garde le filtre choisi. Liste des volets illisible (le kit de
  // test ne la donne pas) : rien ne change.
  try {
    if (!(await $.ui.panes()).some(p => p.id === PANE && p.isPlaced)) {
      const axis = await read($, maestroAxisAtom).catch(() => '')
      await setView($, () => openingView(axis))
    }
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
  if (capture && isDesignSkill(name, designSkills(capture.source.design))) capture.designUsed = true
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
  // Les valeurs des options de ce chargement : le volet Réglages s'en sert quand /config n'en liste aucune (#356).
  rememberLoadedOptions(options as Readonly<Record<string, unknown>>)
  // Un chargement neuf relit tout : les données gardées en mémoire viennent du chargement d'avant.
  paneCache = undefined
  knownSource = undefined
  taskSourceMemo = undefined
  missingSearch = undefined
  sourceTitle = undefined
  // La session et le droit de lister les sessions se relisent aussi (un refus de la liste ne survit pas).
  ownSession = null
  bandAsked = undefined
  listDenied = false
  lastListRows = []
  listDeniedTick = 0
  ownRunningEvent = undefined
  pollTick = 0
  polling = false
  queuePids = { key: '', at: 0 }
  queueSeen = ''
  queueWanted = false
  refreshFlushed = 0
  autoModeRefusal = undefined
  settings = {
    me: typeof options.me === 'string' ? splitNames(options.me) : [],
    autoOpen: typeof options.autoOpen === 'boolean' ? options.autoOpen : true,
    titleModel: typeof options.titleModel === 'string' && options.titleModel !== '' ? options.titleModel : 'sonnet',
    capture: typeof options.capture === 'boolean' ? options.capture : true,
    theme: typeof options.theme === 'string' && options.theme !== '' ? options.theme : 'auto',
    launchEffort: typeof options.launchEffort === 'string' && options.launchEffort !== '' ? options.launchEffort : 'high',
    launchModel: typeof options.launchModel === 'string' && options.launchModel !== '' ? options.launchModel : 'opus',
    codeModel: typeof options.codeModel === 'string' && options.codeModel !== '' ? options.codeModel : 'sonnet',
    launchBypass: options.launchBypass === true,
    pruneBranches: typeof options.pruneBranches === 'boolean' ? options.pruneBranches : true,
    launchQueue: typeof options.launchQueue === 'boolean' ? options.launchQueue : true,
    projectSessions: typeof options.projectSessions === 'string' && options.projectSessions !== '' ? options.projectSessions : '3',
    macSessions: typeof options.macSessions === 'string' && options.macSessions !== '' ? options.macSessions : '12',
    axisPill: typeof options.axisPill === 'boolean' ? options.axisPill : false,
    priorities: options.priorities === true,
    dateFormat: options.dateFormat === 'fr' ? 'fr' : 'us',
    account: declaredAccount(options.account, options.classicHooks) ?? 'auto',
  }
  classicSkips = { skipped: 0, stopSeen: false, asked: false }
  setDateFormat(settings.dateFormat)

  // Le thème de Claude Code a changé : le panneau se redessine dans l'autre palette.
  on('config.set', { key: 'theme' }, async ($, e, next) => {
    const result = await next(e)
    await update($, themeStampAtom, v => v + 1)
    return result
  })

  // La sonde de visibilité (#337) : chaque arrivée et chaque départ d'une surface de l'app, au journal.
  // Le repos (#348) : une arrivée réveille la session ; un départ qui ne laisse aucune surface la met au repos.
  on('session.attach', async ($, e, next) => {
    void noteSurface($, { event: 'attach', surface: e.surface })
    wake($)
    return next(e)
  })
  on('session.detach', async ($, e, next) => {
    void noteSurface($, { event: 'detach', surface: e.surface, reason: e.reason })
    if (e.reason !== 'end') void readVisibility($)
    return next(e)
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
    await $.command.register({
      name: BAR_COMMAND,
      description: 'Faire paraître la bande de Maestro au-dessus de la saisie, ou dire pourquoi elle ne paraît pas',
    })
    // Le volet Réglages vaut dans tout projet, roadmap ou non : les réglages de session valent partout.
    await $.command.register({
      name: 'reglages',
      description: 'Ouvrir le volet des réglages : chaque réglage, son état, changé d\'un clic',
    })
    // Le centre de contrôle (#367) vaut dans toute session : il lit la liste des sessions du Mac et la file commune.
    await $.command.register({
      name: 'controle',
      description: 'Ouvrir le centre de contrôle : toutes les sessions de tâche du Mac, leur file, pause et priorité',
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
      if (panes.some(p => p.id === CONTROL_PANE)) await redrawControl($)
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
      // #277 : les étapes de journée passées avancent, une fois par jour, sans retenir le démarrage.
      void rollDayStepsOnStart($, source).catch(() => undefined)
      // #313 : le filet du ménage des branches, au plus toutes les 10 minutes, sans retenir le démarrage.
      void sweepBranches($, source, 'start').then(note => {
        if (note) $.ui.toast(note)
      })
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
  // En Compte Team / Enterprise (#219, #223), il n'est pas enregistré, et l'app n'a plus de saut à dire.
  if (settings.account !== 'team') {
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
  }

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
  if (settings.account !== 'team') {
    on('session.compact', async ($, e, next) => {
      // `precompute` n'installe rien, et la compaction d'un agent laisse la conversation principale.
      if (e.trigger !== 'precompute' && e.agentId === undefined) {
        await update($, prefsGivenAtom, () => '')
        await update($, contextSeenAtom, () => 0)
      }
      return next(e)
    })
  }

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
    // #347 : le retour d'une tâche de fond relance la session ; ses commandes citées sont finies.
    if ((e.origin as { kind?: string } | undefined)?.kind === 'task-notification' || (typeof e.text === 'string' && e.text.includes('<task-notification>'))) {
      backgroundShells = shellsAfterNotice(backgroundShells, e.text ?? '')
      noticeTurn = true
    }
    const texts: string[] = []
    // L'heure locale du Mac à chaque message, projet à roadmap ou non (#331) : « hier » se mesure contre elle.
    try {
      texts.push(localClockText(await $.clock.now()))
    } catch {
      // horloge illisible : le message passe sans l'heure
    }
    // Le lancement du panneau, envoyé par ce plugin : une ligne à montrer, le brief en contexte (#140).
    const launch = ownLaunch(e.text, e.origin as typeof e.origin | undefined)
    if (launch) {
      texts.push(launch.context)
      launchPending = true
    }
    // #366 : dans une session « Tester #N · X.Y.Z », chaque message de la personne reçoit la consigne de relais.
    try {
      const test = await testSessionText($)
      if (test) texts.push(test)
    } catch {
      // fiche ou liste illisible : le message passe sans la consigne
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
      const block = sessionPrefsText(current.prefs, current.error, current.project, current.design, current.roadmap)
      const given = await read($, prefsGivenAtom)
      if (block !== given) {
        texts.push(given === '' ? block : `${prefsChangedLead()}\n\n${block}`)
        await update($, prefsGivenAtom, () => block)
      }
      // Chez Maestro (#133) : au réveil, le rappel du réveil ; aux tours de la personne, l'en-tête stable.
      const maestro = await maestroHere($)
      const wake = maestro && wakeTurn(e.text)
      const reminder = wake
        ? maestroWakeReminder(await read($, pendingAsksAtom))
        : maestro ? maestroPrefsReminder(current.prefs) : sessionPrefsReminder(current.prefs)
      if (reminder !== undefined) texts.push(reminder)
      // Proposer une task (#216) : la règle entière à chaque message d'un projet à roadmap, selon la
      // session ; pas au réveil de Maestro, où la personne n'a rien dit.
      if (current.roadmap && !wake) texts.push(proposeTaskText(maestro ? 'maestro' : (await parentIsMaestro($)) ? 'child' : 'solo'))
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
    // « Maestro <axe> » (#239) : les axes de la roadmap départagent un axe d'une demande.
    const call = maestroCall(e.text) && maestroCall(e.text, await knownAxes($))
    if (call) {
      try {
        await markMaestro($)
      } catch {
        // fiche ou store illisible : le titre et la famille jugent seuls
      }
      // L'appel nu ou d'axe pose l'axe de la session, et le panneau ouvert bascule tout de suite.
      if (!call.scan) {
        try {
          const axis = call.axis ?? ''
          await update($, maestroAxisAtom, () => axis)
          await setView($, () => ({ axis: axis || 'all', attend: 'all', showDone: false, closedGroups: [], moreGroups: [] }))
        } catch {
          // état de session illisible : le panneau garde sa vue
        }
      }
      try {
        texts.push(call.action ? await maestroActionText($, call.action) : call.scan ? await maestroText($, call.go, undefined, call.request) : await maestroIntroText($, call.axis))
      } catch (err) {
        texts.push(`${Person()} a dit « Maestro », mais l'état de la roadmap n'a pas pu être lu (${err instanceof Error ? err.message : String(err)}) : dis-le en une phrase.`)
      }
    }
    const text = launch ? launch.line : e.text
    return next(texts.length === 0 ? e : { ...e, text, context: [...(e.context ?? []), ...texts] })
  })

  // Capture des tasks : la grammaire contrôlée à chaque écriture, le rappel en fin de tour.
  // #255 : chez Maestro, une ligne écrite à la main reçoit le rappel de la skill tasks.
  // #292 : une page de maquettes écrite se note pour le rappel de design.
  on('tool.call', { tool: 'Edit' }, async ($, e, next) => {
    noteCodeEdit(e, e.file_path)
    noteMockupDrawn(e)
    return yesNote(e, await handWriteNote($, e, 'Edit', await written($, () => next(e), e.file_path)))
  })
  on('tool.call', { tool: 'Write' }, async ($, e, next) => {
    noteCodeEdit(e, e.file_path)
    noteMockupDrawn(e)
    return yesNote(e, await handWriteNote($, e, 'Write', await written($, () => next(e), e.file_path)))
  })
  on('tool.call', { tool: 'NotebookEdit' }, ($, e, next) => {
    noteCodeEdit(e, e.notebook_path)
    return written($, () => next(e), e.notebook_path)
  })
  // #327 : un appel à un sous-agent dispense du rappel de déléguer.
  on('tool.call', { tool: 'Agent' }, ($, e, next) => {
    if (!fromAgent(e)) delegation.agentCalls += 1
    return next(e)
  })
  // La carte New task d'une sous-session remonte à son Maestro (#67).
  // Option « Lancer en bypass » : la carte qui reste ici demande le bypass (#87).
  on('tool.call', { tool: START_SESSION_TOOL }, async ($, raw, next) => {
    // Une carte du modèle reçoit la section de l'arbre, comme le ▶ (#237).
    const e = next.origin.plugin === 'engine' && !fromAgent(raw) ? ((await withTree($, raw)) as typeof raw) : raw
    // #263 : la carte qui se pose ici (pas remontée à Maestro) part seulement si son titre vient de la ligne écrite.
    let titleRefused = false
    const ran = await forwardProposal($, e, next.origin.plugin, async () => {
      if (next.origin.plugin !== 'engine') return next(e)
      const refusal = await launchRefusal($, e)
      if (refusal !== undefined) {
        titleRefused = true
        return { deny: refusal }
      }
      // #324 : chez Maestro, la carte ne part que s'il reste une place ; sinon elle entre dans la file.
      const cardTitle = (e as { title?: unknown }).title
      const dose = fromAgent(e) || typeof cardTitle !== 'string' ? {} : await doseLaunch($, sessionTitleId(cardTitle), { title: cardTitle, card: e as Record<string, unknown> })
      if (dose.refusal !== undefined) {
        titleRefused = true
        return { deny: dose.refusal }
      }
      const posted = await launchWithMode($, e, card => next(card as typeof e))
      if (dose.ownId && typeof cardTitle === 'string' && posted.deny === undefined && !posted.isError) await reserveCard($, cardTitle)
      return posted
    })
    if (titleRefused) return ran
    // La carte de Claude refusée par le mode auto : la fiche le dit tout de suite, avec le geste (#248).
    if (next.origin.plugin === 'engine' && (ran.deny !== undefined || ran.isError) && isAutoModeRefusal(ran.deny ?? ran.text ?? '')) {
      await setView($, () => ({ launchNote: AUTO_BLOCKED }))
    }
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
      await noteChild($, (s, now) => ({ ...withoutQuestion(s), steps: applyPlan(s.steps, e as never, now) }))
    }
    return next(e)
  })
  // Une maquette montrée à Bertrand (#96) : le rappel de fin de tour se tait pour la session.
  for (const tool of MOCKUP_TOOLS) {
    on('tool.call', { tool }, ($, e, next) => {
      if (capture && !fromAgent(e) && isMockupCall(tool, e)) capture.mockupShown = true
      // #292 : un widget après un read_me du module mockup est une maquette dessinée.
      if (capture && !fromAgent(e) && tool === VISUALIZE_WIDGET && capture.mockupModule) {
        capture.mockupDrawn ??= 'un widget de maquette'
        awaitYes('un widget de maquette')
      }
      return next(e)
    })
  }
  // #313 : une session qui s'archive (« Oui, archiver »), ou qui archive une autre session : le ménage
  // des branches suit, si la session vit encore ; sinon le démarrage suivant s'en charge.
  on('tool.call', { tool: ARCHIVE_SESSION_TOOL }, async ($, e, next) => {
    const result = await next(e)
    const ran = result as { deny?: string; isError?: boolean }
    if (next.origin.plugin === 'engine' && !fromAgent(e) && ran.deny === undefined && !ran.isError) {
      sweepAfterArchive($, await sourceNow($).catch(() => undefined))
    }
    return result
  })
  // #292 : le module que charge le visualiseur dit si le widget suivant est une maquette.
  on('tool.call', { tool: VISUALIZE_README }, ($, e, next) => {
    const modules = (e as { modules?: unknown }).modules
    if (capture && !fromAgent(e)) capture.mockupModule = Array.isArray(modules) && modules.includes('mockup')
    return next(e)
  })
  on('tool.call', { tool: ASK_TOOL }, async ($, e, next) => {
    if (fromAgent(e)) return next(e)
    // « T'attendent » passe par ce formulaire (#244).
    reportTurn.asked = true
    if (capture && isMockupCall(ASK_TOOL, e)) {
      capture.mockupShown = true
      awaitYes('les aperçus du formulaire')
    }
    const first = (e as { questions?: { question?: unknown }[] }).questions?.[0]?.question
    const text = clip(typeof first === 'string' ? first : '', 160)
    await noteChild($, (s, now) => ({ ...s, question: { text, since: now } }))
    // La question attend dans un transcript que Bertrand ne regarde pas : Maestro l'apprend tout de suite (#131).
    await tellMaestro($, childWake({ question: text }))
    const asked = await timingNow($)
    try {
      const ran = await next(e)
      // #322 : une option choisie telle quelle, sans note, vaut le oui de la maquette en attente.
      if (capture?.mockupAwaiting !== undefined && ran.deny === undefined && formApproval(e, ran.result ?? ran.text)) capture.mockupAwaiting = undefined
      return ran
    } finally {
      await noteChild($, withoutQuestion)
      // Le formulaire a attendu BBR : de l'attente, pas du travail (#314).
      if (asked !== undefined) await noteTiming($, (t, now) => (t ? timingAsk(t, now - asked) : t))
    }
  })
  on('tool.call', { tool: WRAP_UP_TOOL }, async ($, e, next) => {
    const ask = (e as { ask?: unknown }).ask
    const refusal = fromAgent(e) ? undefined : ((othersArchiveAsk(ask) ? othersArchiveRefusal() : undefined) ?? (await unsentAsk($, ask)) ?? (await openLineAsk($, ask)) ?? (await launchAsk($, e as never)) ?? (await pendingAsk($, ask)))
    if (refusal !== undefined) return { deny: refusal }
    // #244 : le compte rendu du tour ; des questions sans formulaire refusent la boîte, une fois par tour.
    const report = fromAgent(e) ? undefined : await turnReport($).catch(() => undefined)
    if (report !== undefined && report.waiting > 0 && !reportTurn.asked && !reportTurn.refused) {
      reportTurn.refused = true
      reportTurn.given = report.markdown
      return { deny: reportRefusal(report.markdown) }
    }
    // Chez Maestro, la boîte sans question cocherait sa liste ouverte : refusée à chaque fois (#133).
    if (!fromAgent(e) && closingTurn.maestro && openListBox(ownSteps, ask)) return { deny: openListRefusal() }
    if (!fromAgent(e)) ownSteps = boxSteps(ownSteps)
    noteBox(e)
    if (!fromAgent(e)) closingTurn = { ...closingTurn, work: true, box: boxText(e), asked: boxText(e, false) }
    // La question de Maestro attend la personne : un réveil ne la reposera pas (#133).
    if (!fromAgent(e) && closingTurn.maestro && typeof ask === 'string' && ask.trim() !== '') {
      await update($, pendingAsksAtom, asks => (asks.includes(ask) ? asks : [...asks, ask])).catch(() => undefined)
    }
    const recap = (e as { recap?: unknown }).recap
    if (!fromAgent(e)) wakeBox = { ...(typeof recap === 'string' ? { recap } : {}), ...(typeof ask === 'string' ? { ask } : {}) }
    // La question de la boîte, ou « attend une réponse : … » en tête du récap, attend jusqu'au tour suivant (#121).
    const asked = boxQuestion((e as { ask?: unknown }).ask, recap)
    if (!fromAgent(e)) timingAsked = asked !== undefined
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
      await noteChild($, (s, now) => ({ ...s, steps: boxSteps(s.steps, now) }))
    }
    // Le message de fin suit la boîte : le compte rendu à recopier vient avec elle (#244).
    if (report !== undefined && report.markdown !== reportTurn.given && ran.deny === undefined) {
      reportTurn.given = report.markdown
      return { ...ran, context: [...(ran.context ?? []), reportReminder(report.markdown)] }
    }
    return ran
  })
  // Les outils du tour, ceux du modèle de la session seule (ni sous-agent, ni appel d'un plugin) :
  // un tour de travail sans liste d'étapes (#98).
  on('tool.call', ($, e, next) => {
    const tool = (e as { tool?: unknown }).tool
    if (next.origin.plugin === 'engine' && !fromAgent(e) && tool !== UPDATE_PLAN_TOOL && tool !== WRAP_UP_TOOL) stepList.tools += 1
    // Maestro n'exécute pas (#250) : à un tour de la personne, un geste d'exécution se note pour la fin du tour.
    if (next.origin.plugin === 'engine' && !fromAgent(e) && closingTurn.maestro && !closingTurn.wake && typeof tool === 'string') {
      const done = maestroExecAction(tool, e, capture ? [questionsPath(capture.source)] : [])
      if (done !== undefined && !maestroExec.includes(done)) maestroExec.push(done)
    }
    return next(e)
  })
  // Garde-fou du dossier principal (#87) : une commande git interdite n'est pas lancée.
  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const refusal = await guardBash($, (e as { command?: unknown }).command)
    if (refusal !== undefined) return { deny: refusal }
    // #244 : les questions que `tasks.py write` a imprimées attendent la personne ; la dernière sortie l'emporte.
    // Relues avant le journal que l'écriture remet (#261).
    const tasksOut = (r: ToolCallResult) => {
      if (fromAgent(e) || !/tasks\.py\b.*\bwrite\b/.test(e.command)) return
      const stdout = (r.result as { stdout?: unknown } | undefined)?.stdout
      if (typeof stdout === 'string') reportTurn.fromTasks = reportQuestions(stdout)
    }
    const heavy = !fromAgent(e) && e.run_in_background !== true && heavyTest(e.command)
    const began = heavy ? await timingNow($) : undefined
    const ran = await handWriteNote($, e, 'Bash', await written($, () => next(inQueue($, e)), undefined, writesRoadmap(e.command, capture?.source.ecriture?.outil), tasksOut))
    // Une suite lourde : l'attente de la file et une suite tombée en délai dépassé vont au relevé des temps (#314).
    if (began !== undefined && ran.deny === undefined) {
      const result = ran.result as { stdout?: unknown; stderr?: unknown } | undefined
      const said = [result?.stdout, result?.stderr].filter((x): x is string => typeof x === 'string').join('\n')
      await noteTiming($, (t, now) => (t ? timingBash(t, said, now - began) : t))
    }
    // #347 : une commande lancée en arrière-plan reste en vol jusqu'à sa notification.
    const shellId = (ran.result as { backgroundTaskId?: unknown } | undefined)?.backgroundTaskId
    if (!fromAgent(e) && ran.deny === undefined && typeof shellId === 'string' && shellId !== '') {
      backgroundShells.set(shellId, await clockOrDate($))
    }
    if (fromAgent(e) || ran.deny !== undefined || ran.isError === true) return ran
    // Une fusion sur main ou une publication (#136) : la liste d'étapes se renvoie avant la commande suivante.
    try {
      const kinds = await deliveredBy($, e.command)
      if (kinds.length === 0) return ran
      const maestro = await maestroHere($)
      delivered = { kinds: [...new Set([...delivered.kinds, ...kinds])], maestro: maestro || delivered.maestro }
      // #366 : chez Maestro, la tâche publiée passe en test ; le rappel porte sa carte.
      const said = (ran.result as { stdout?: unknown } | undefined)?.stdout
      const test = maestro && kinds.includes('publication')
        ? await testAfterRelease($, e.command, typeof said === 'string' ? said : (ran.text ?? '')).catch(() => undefined)
        : undefined
      return { ...ran, context: [...(ran.context ?? []), deliveryReminder(kinds, maestro, false, closingTurn.wake), ...(test ? [test] : [])] }
    } catch {
      return ran
    }
  })

  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) {
      stopTurn = { id: e.turnId, stopRan: false, fromReminder: reminderCarried }
      reminderCarried = false
      // Le même retour, quand le message ne passe pas par prompt.submit (#347).
      if (typeof e.text === 'string' && e.text.includes('<task-notification>')) {
        backgroundShells = shellsAfterNotice(backgroundShells, e.text)
        noticeTurn = true
      }
    }
    if (e.agentId === undefined) {
      // Le genre du tour (#133) : un réveil de Maestro par une de ses sessions, ou un tour de la personne,
      // qui fait tomber les questions en attente.
      const maestro = await maestroHere($)
      const wake = maestro && wakeTurn(e.text)
      closingTurn = { work: false, box: '', asked: '', wake, maestro }
      maestroExec = []
      handWarned = false
      wakeRefused = false
      if (maestro && !wake) await update($, pendingAsksAtom, () => []).catch(() => undefined)
    }
    if (e.agentId === undefined) stepList.tools = 0
    if (e.agentId === undefined) delegation = { files: new Set(), agentCalls: 0 }
    if (e.agentId === undefined) {
      launchTurn = { cards: [], refused: false, fromPanel: launchPending }
      launchPending = false
    }
    // Un vrai message (de Maestro ou de Bertrand) relance la session : sa réponse sera une nouvelle à dire (#131).
    if (e.agentId === undefined) wakeBox = {}
    // Sauf le tour relancé par le retour d'une tâche de fond, qui n'est pas un vrai message (#347).
    if (e.agentId === undefined && !noticeTurn) toldMaestro = undefined
    if (e.agentId === undefined) noticeTurn = false
    if (e.agentId === undefined) {
      reportTurn = freshReport()
      if (settings.capture && capture) reportTurn.questionsAtTurn = await readOr($, questionsPath(capture.source))
    }
    if (e.agentId === undefined && settings.capture && capture) {
      capture.wroteThisTurn = false
      capture.gitAtTurn = await gitState($)
      capture.headAtTurn = await gitHead($)
      capture.roadmapAtTurn = joined(await roadmapNow($, capture.source))
      capture.cardThisTurn = false
      capture.boxThisTurn = ''
      capture.mockupDrawn = undefined
      // #322 : le oui de la personne, sans correction, valide la dernière maquette dessinée.
      if (capture.mockupAwaiting !== undefined && mockupApproval(e.text ?? '')) capture.mockupAwaiting = undefined
    }
    // Le relevé des temps (#314) : le tour commence, une question de la boîte prend fin.
    if (e.agentId === undefined) {
      timingAsked = false
      await noteTiming($, timingTurnStart)
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
    // Et ce qu'elle va lancer, pour la fiche d'une tâche à lancer (#341).
    if (!e.isAborted) await savePitches($, e.answer)
    // Et ce que la session a changé, zone par zone (#269).
    if (!e.isAborted) await saveChanges($, e.answer)
    // Et le temps du tour (#314), même interrompu.
    await noteTiming($, (t, now) => (t ? timingTurnEnd(t, now, { asked: timingAsked && !e.isAborted, ...(typeof e.answer === 'string' && !e.isAborted ? { answer: e.answer } : {}) }) : t))
    // Une session de Maestro prévient Maestro de l'état où elle s'arrête (#131) ; interrompue, la personne est là.
    if (!e.isAborted) await tellMaestro($, async () => childWake({ ...wakeBox, answer: e.answer, background: await inFlight($, e.turnId) }))
    // Un réveil de Maestro ne laisse pas de rappel, qui ferait écrire son fil (#133).
    if (e.turnId === stopTurn.id && !stopTurn.stopRan && e.reason === 'answer' && !closingTurn.wake) {
      const block = await endOfTurnBlock($, e.answer, stopTurn.fromReminder, false)
      if (block !== undefined) pendingReminder = block
    }
    // Stop sauté deux tours de suite, jamais vu tourner : sec-default, l'option s'éteint (#219).
    if (e.turnId === stopTurn.id && e.reason === 'answer') await noteClassicSkip($, stopTurn.stopRan)
    return result
  })

  // Une skill de méthode superpowers, ou swiftui-pro, lancée (outil Skill, commande, préchargement) : notée pour le rappel.
  if (settings.account !== 'team') {
    on('skill.prompt', async ($, e, next) => {
      skillPrompted = true
      noteSkill(e.skill)
      return next(e)
    })
  }
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

  if (settings.account !== 'team') {
    on('classic.Stop', async ($, e, next) => {
      stopTurn.stopRan = true
      stopTurn.background = (e as { background_tasks?: unknown }).background_tasks
      // La conclusion se garde ici (#307) : si ce Stop relance Claude, la fin de tour ne lira que la réponse relancée.
      await saveEndFiche($, e.last_assistant_message)
      await savePitches($, e.last_assistant_message)
      const result = await next(e)
      const block = await endOfTurnBlock($, e.last_assistant_message, e.stop_hook_active === true, result.block !== undefined)
      return block === undefined ? result : { ...result, block }
    })
  }

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
        await closeReopenAsk($, id)
        pressHandlers.get(id)?.()
      }
      return {}
    }
    // Un clic sur le donut de la durée (#314) : sa part se choisit, un second clic (ou le trou) revient au total.
    if (e.element.startsWith(DONUT_HIT)) {
      const pick = (e.data as { donut?: unknown } | null)?.donut
      if (typeof pick === 'string' && pick !== '') {
        notePress(`donut:${pick}`)
        const prefix = pick.slice(0, pick.lastIndexOf(':') + 1)
        await setView($, v => ({ gaugePick: pick === prefix || v.gaugePick === pick ? '' : pick }))
      }
      return {}
    }
    if (!e.element.startsWith(BAR_HIT)) return next(e)
    const segment = (e.data as { segment?: unknown } | null)?.segment
    if (typeof segment === 'string') notePress(`bar:${segment}`)
    // Le segment des Done n'existe qu'en vue Done : son clic en sort.
    if (segment === DONE_SEGMENT) pressDone($, true)
    else if (typeof segment === 'string' && segment !== '') pressAxis($, segment)
    return {}
  })

  // Un bouton de l'app : noté pour la mesure du délai jusqu'au dessin suivant.
  on('ui.press', async ($, e, next) => {
    if (e.plugin === 'roadmap') {
      notePress(e.element)
      await closeReopenAsk($, e.element)
    }
    // Un bouton fantôme (la case ou le titre d'une ligne, #351) quitte le focus avant le dessin que son clic
    // déclenche : l'app ne lève pas ui.focus pour un clic, rien n'est tenu à retirer, le fond gris restait.
    const ghostPressed =
      e.plugin === 'roadmap' && e.component === 'Pane' && e.requestId === PANE && e.surface === 'desktop' && ghostPressKeys.has(focusBase(e.element))
    if (ghostPressed) retirePressedFocus(focusHeld, e.element)
    const result = await next(e)
    // Le bouton cliqué dans le panneau quitte le focus au dessin suivant (#228).
    if (e.plugin === 'roadmap' && e.component === 'Pane' && e.requestId === PANE && e.surface === 'desktop' && !ghostPressed) retireActedFocus(focusHeld, e.element)
    return result
  })

  // Un choix dans un menu du panneau (« Ranger », « Qui ») : le menu quitte le focus au dessin suivant (#228).
  on('ui.select', { component: 'Pane', requestId: PANE }, async ($, e, next) => {
    const result = await next(e)
    if (e.surface === 'desktop') retireActedFocus(focusHeld, e.element)
    return result
  })

  on('command.run', { command: 'roadmap' }, async $ => openCommand($))

  // Sa fermeture à la main est refusée tant que le réglage est allumé ; un toast dit comment la permettre.
  on('ui.close', { id: PANE }, async ($, e, next) => {
    if (!refusesPaneClose(settings.autoOpen, e.id, e.origin.kind)) return next(e)
    $.ui.toast(pinnedPaneToast())
  })

  on('command.run', { command: 'reglages' }, async $ => openSettings($))

  on('command.run', { command: 'controle' }, async $ => openControl($))

  on('command.run', { command: BAR_COMMAND }, async $ => forceBar($))

  // La skill des réglages tapée seule ouvre le volet sans passer par le modèle ; suivie d'une demande
  // (« coupe le mode ADHD »), la skill la traite. Lancée par le modèle, le volet s'ouvre aussi.
  // Suivie d'une demande, le volet s'ouvre dès la commande : sous sec-default, skill.prompt ne l'ouvre pas (#116).
  on('command.run', { command: SETTINGS_SKILL }, async ($, e, next) => {
    if (e.args.trim() === '') return openSettings($)
    await skillPaneNote($, e.command)
    return next(e)
  })

  if (settings.account !== 'team') {
    on('skill.prompt', { skill: SETTINGS_SKILL }, async ($, e, next) => {
      const result = await next(e)
      const note = await skillPaneNote($, e.skill)
      return note === undefined ? result : { ...result, text: `${note}\n\n${result.text}` }
    })
  }

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
  if (settings.account !== 'team') {
    on('skill.prompt', { skill: PANEL_SKILL }, async ($, e, next) => {
      const result = await next(e)
      const note = await skillPaneNote($, e.skill)
      return note === undefined ? result : { ...result, text: `${note}\n\n${result.text}` }
    })
  }

  // L'identité Roadmap à l'ouverture (#127, maquette A) : « Maestro » ou le brief d'une tâche lancée
  // deviennent la carte Roadmap ; le modèle lit toujours le message d'origine. Déplié (ctrl+o), le texte
  // entier d'un brief suit la carte. Tout autre message, ou une lecture en panne, garde sa rangée.
  on('ui.render', { component: 'UserMessage' }, async ($, e, next) => {
    // L'app confie ses messages au plugin : la carte d'accueil peut paraître ici (#153).
    void noteWelcomeCard($, 'reachedAt')
    if (!maestroCall(e.props.text) && !briefTaskOf(e.props.text)) return next(e)
    let welcomeCall = maestroCall(e.props.text)
    try {
      const data = await brandData($)
      // « Maestro <axe> » (#239) : l'axe du message lui-même, pas celui de la session à cette heure.
      if (data) welcomeCall = maestroCall(e.props.text, roadmapAxes(data.tasks))
      const opened = data?.shorten(openingBrand({ text: e.props.text, source: data.source, tasks: data.tasks, maestroTasks: data.maestroTasks }))
      if (!data || !opened) {
        if (welcomeCall && !welcomeCall.scan) void noteWelcomeCard($, 'failedAt', data ? 'pas de carte' : 'roadmap illisible')
        return next(e)
      }
      // « Maestro » seul ouvre l'accueil (#141) : le bonjour, les chiffres et les boutons ; « Maestro <axe> », compté sur l'axe.
      const welcome = opened.kind === 'maestro' && welcomeCall && !welcomeCall.scan ? await welcomeOf($, data, welcomeCall.axis) : undefined
      // Le choix du bouton de la grille (#335) : lu ici, son écriture redessine la carte.
      if (welcome?.activity) welcome.activity = { ...welcome.activity, mode: await read($, welcomeGridAtom) }
      const brand = welcome ? { ...opened, welcome } : opened
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

  // Les lignes « - Roadmap : #N … » du compte rendu (#244), dessinées en une carte par tâche (#371, maquette A).
  // Sans ligne, résumé de bloc ou lecture en panne, le message garde son dessin : le texte reste lisible.
  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    if (e.props.isSummary) return next(e)
    const parts = splitWritten(e.props.text)
    if (!parts.some(part => part.kind === 'cards')) return next(e)
    try {
      const source = knownSource === undefined ? await sourceNow($) : (knownSource ?? undefined)
      if (!source) return next(e)
      const version = await Promise.all([read($, stampAtom), read($, titlesVersionAtom), read($, themeStampAtom), read($, retryAtom), read($, liveVersionAtom)])
      const data = await paneData($, source, version.join('|'))
      if (typeof data.open === 'string') return next(e)
      const tasks = [...data.open, ...data.done]
      return drawWrittenMessage($.ui.resolve(e), parts, lines => writtenCards(lines, tasks, t => shownTitle(t, data.titles)), data.palette)
    } catch (err) {
      $.ui.log(`roadmap : cartes des tâches écrites non dessinées (${err instanceof Error ? err.message : String(err)})`, { to: 'debug' })
      return next(e)
    }
  })

  // L'arbre de Maestro au-dessus de la saisie (#147, style C) : toujours visible, chez Maestro avec au
  // moins une session, jamais pendant un sondage ; sinon la bande reste à l'app. La boîte de fin qui
  // pose une question prend sa place (l'app) : l'arbre revient quand elle est répondue.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    bandAsked = { survey: e.props.hasSurvey }
    if (e.props.hasSurvey) return next(e)
    try {
      const found = await sessionBrandOf($)
      const band = maestroBand({ brand: found?.brand, hasSurvey: e.props.hasSurvey, shown: BRAND_TASKS_SHOWN })
      if (!found || !band) return next(e)
      const now = await $.clock.now()
      const statuses = await Promise.all(band.tasks.map(t => readSteps($, t.sessionId)))
      const views = statuses.map((status, i) => {
        const t = band.tasks[i]
        return status ? stepsView(shownStatus(status, t?.sessionId, t?.closed === true).steps, { now, at: status.at, closed: t?.closed === true }) : undefined
      })
      // Le contexte de Maestro (#157) : la mesure du dernier tour, ou celle du moment avant la première ;
      // celui de chaque session, noté à la fin de ses tours, sous sa jauge d'étapes (#157, revenu par #217).
      const mine = (await read($, bandContextAtom)) ?? contextUseOf((await $.session.usage().catch(() => undefined))?.context)
      const contexts = { mine: contextView(mine ?? undefined), rows: statuses.map(status => contextView(status?.context)) }
      return maestroBandTree($, e, band, found.data.palette, views, {
        open: t => void (t.sessionId ? openSession($, { sessionId: t.sessionId, startedAt: now, title: t.label }) : undefined),
        archive: t => void archiveBandSession($, t, now),
        compact: () => void compactFromBand($),
      }, now, contexts, await read($, zoneGenAtom))
    } catch {
      return next(e)
    }
  })

  // Le panneau ne reste jamais vide en silence (#220) : une erreur du dessin montre sa carte d'erreur ; un
  // dessin qui dépasse son temps ou un arbre refusé par l'app passe par `.catch`, qui montre la même.
  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    // Un lancement déposé par un bouton part d'ici, où le hook prompt.submit du plugin tourne (#140).
    sendLaunch($)
    void notePaneDraw($, 'reachedAt')
    const t0 = tick()
    perfLoaded = t0
    perfCached = false
    let tree: RenderElement
    try {
      tree = retireFocusKeys(await drawPane($, e), focusHeld.epochs)
    } catch (err) {
      return paneFailure($, e, { kind: 'throw', message: err instanceof Error ? err.message : String(err), ...(err instanceof Error && err.stack ? { stack: err.stack } : {}) })
    }
    notePerf(t0, tree, e.props.scroll)
    void notePaneDraw($, 'drawnAt')
    return tree
  }).catch(async ($, e, next) => paneFailure($, e, { kind: next.error.kind, message: next.error.message ?? '' }))

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

  on('ui.render', { component: 'Pane', requestId: SETTINGS_PANE }, async ($, e) => drawSettings($, e, await paletteOf($), await settingsProject($)))
  on('ui.render', { component: 'Pane', requestId: CONTROL_PANE }, async ($, e) => drawControl($, e, await paletteOf($), controlDeps($)))
}

/** Le dessin du panneau : la vue d'ensemble, le détail d'une tâche, ou ce qui manque. */
// --- Identité Roadmap à l'ouverture (#127) ---------------------------------------------------
// La carte qui prend la place du message d'ouverture (maquette A) et l'en-tête du panneau (maquette B).

/**
 * La date de création de chaque session, lue une fois par session (`get_session` : `list_sessions` ne la
 * donne pas) et gardée dans le module. Seule une date lisible se garde (#195) : un refus (le contrôle du
 * mode auto en rend au hasard, sans lever), une erreur ou une date illisible se réessaie CREATED_RETRY_MS
 * plus tard, à l'horloge ; avant, un seul refus gardait `NaN` et renversait l'arbre de Maestro au tri par numéro.
 */
const createdBySession = new Map<string, number>()
/** L'heure du dernier essai de chaque session restée sans date : pas de nouvel essai avant CREATED_RETRY_MS. */
const createdTriedAt = new Map<string, number>()
const CREATED_RETRY_MS = 60_000

async function learnCreated($: EngineInterface, ids: readonly string[], now: number): Promise<void> {
  const missing = ids.filter(id => {
    const tried = createdTriedAt.get(id)
    return !createdBySession.has(id) && (tried === undefined || now - tried >= CREATED_RETRY_MS)
  })
  await Promise.all(
    missing.map(async id => {
      createdTriedAt.set(id, now)
      try {
        const ran = await $.tool.call({ tool: GET_SESSION_TOOL, session_id: id })
        if (ran.deny !== undefined || ran.isError) return
        const created = (JSON.parse(ran.text ?? '{}') as { createdAt?: unknown }).createdAt
        const at = typeof created === 'number' ? created : typeof created === 'string' ? Date.parse(created) : Number.NaN
        if (Number.isFinite(at)) createdBySession.set(id, at)
      } catch {
        // fiche illisible : un nouvel essai plus tard
      }
    }),
  )
}

/**
 * Un pas de la minuterie relit les dates restées illisibles, à leur heure : la bande ne se redessine
 * que quand un état qu'elle lit change, et sans ce pas une tâche restait hors de sa place (#195).
 */
async function retryCreated($: EngineInterface): Promise<void> {
  const pending = [...createdTriedAt.keys()].filter(id => !createdBySession.has(id))
  if (pending.length === 0) return
  await learnCreated($, pending, await $.clock.now())
  if (pending.some(id => createdBySession.has(id))) await update($, liveVersionAtom, v => v + 1)
}

/**
 * La place figée de chaque tâche lancée (#195), par `taskKey` : la bande de Maestro et son bloc « En cours »
 * rangent par elle, et elle ne bouge plus quand la tâche avance, attend, finit ou se relance.
 */
const launchByTask = new Map<string, number>()

function launchOf(t: Task, sessionId: string | undefined, now: number): number {
  const at = firstLaunch(launchByTask.get(taskKey(t)), sessionId !== undefined ? (createdBySession.get(sessionId) ?? Number.NaN) : Number.NaN, now)
  launchByTask.set(taskKey(t), at)
  return at
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
  const now = await $.clock.now()
  await learnCreated($, found.map(f => f.sessionId), now)
  // #191 : l'avance de leur branche, et la question qui attend, séparent « à fusionner » de « t'attend ».
  await refreshAhead($, source, found.map(f => f.sessionId), now)
  const asking = new Map(await Promise.all(found.map(async f => [f.sessionId, (await readSteps($, f.sessionId))?.question !== undefined] as const)))
  return maestroBrandTasks(
    found.map(({ task: t, sessionId: sid }) => ({
      id: t.id as string,
      // #263 : le nom du titre de sa session, celui de la liste latérale de l'app.
      label: sessionName(rowTitle(sid) ?? '') ?? short(t),
      running: runningBySession.get(sid) ?? false,
      // Avant la première relecture des sessions, une session suivie compte pour ouverte.
      open: !archivedSessionIds.has(sid) && (openSessionIds.size === 0 || openSessionIds.has(sid)),
      done: t.done,
      sessionId: sid,
      launchedAt: launchOf(t, sid, now),
      ...(aheadBySession.get(sid)?.ahead !== undefined ? { ahead: aheadBySession.get(sid)?.ahead as number } : {}),
      asking: asking.get(sid) === true,
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
  const short = (t: Task) => shownTitle(t, data.titles)
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

/** La largeur de la grille d'activité de l'accueil, en px : celle de la carte, 520 au plus (#325, #335). */
const activityWidth = (e: RenderInput<'UserMessage'> | RenderInput<'Pane'>) => surfaceWidth(e, 6, 520)

/** Les deux positions du bouton de la grille (#335), dans l'ordre de la ligne. */
const GRID_MODES: readonly ActivityMode[] = ['done', 'added']

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
  const Client = 'Client' in resolved && Svg ? resolved.Client : undefined
  const a = w.activity
  const mode: ActivityMode = a?.mode ?? 'done'
  // Le bouton de la grille (#335, maquette A retouchée) : les chiffres de la semaine, le choisi sur un fond de
  // bouton et en gras ; sur le bureau, un texte et sa zone de clic (un Button natif décale son texte), au
  // terminal un bouton. Un clic écrit le choix, qui redessine la carte.
  const choose = (to: ActivityMode) => () => void update($, welcomeGridAtom, () => to)
  const chip = (to: ActivityMode) => {
    if (!a) return null
    const on = to === mode
    const id = `welcome-grid:${to}`
    const label = <Text size="caption" {...(on ? { weight: 'semibold' as const } : {})} color={to === 'done' ? palette.ok : palette.live}>{a.week[to]}</Text>
    if (!Client) return <Button key={id} plain onPress={choose(to)}>{label}</Button>
    pressHandlers.set(id, choose(to))
    zoneDrawn(zones, 'press-hit', Date.now())
    return (
      <Box key={id} paddingX={SPACE.indent} {...(on ? { backgroundColor: palette.btn } : { hover: { backgroundColor: palette.hover } })}>
        {label}
        <Box position="absolute" top={0} left={0} right={0}>
          <Client key={pressKey(id)} module="./press-hit.tsx" props={{ id }} width="100%" height={1} />
        </Box>
      </Box>
    )
  }
  // La grille d'un an (#335) : un seul dessin interactif, pour que le survol d'une case dise son jour et son
  // chiffre sur la ligne du bas ; au terminal, la ligne du bas seule, le total de l'année.
  const grid = () => {
    if (!a) return null
    if (!Svg) return <Text size="caption" color={palette.text2}>{a.total[mode]}</Text>
    const source = activityGridIcon({
      days: a.days,
      mode,
      total: a.total[mode],
      fills: activityFills(mode === 'done' ? palette.ok : palette.live, palette),
      ink: palette.text2,
      strong: palette.text,
      ring: palette.text,
      width: activityWidth(e),
    })
    const width = Number(/width="(\d+)"/.exec(source)?.[1] ?? 475)
    const height = Number(/height="(\d+)"/.exec(source)?.[1] ?? 80)
    return <Svg source={source} alt={`Tâches ${mode === 'done' ? 'faites' : 'ajoutées'} par jour sur un an : ${a.total[mode]}`} width={width} height={height} isInteractive />
  }
  // Le texte du bouton, la grille et sa ligne du bas partent du même bord (#335) : la marge du fond du choisi.
  const inset = a && Client ? { paddingLeft: SPACE.indent } : {}
  return (
    <Box key="welcome" flexDirection="column" gap={SPACE.tight}>
      <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexWrap="wrap" {...inset}>
        <Text size="footnote" color={palette.text2}>{w.counts}</Text>
        {Svg && total > 0 && (
          <Svg source={barIcon([{ hex: palette.ok, n: done }, { hex: palette.sel, n: total - done }], palette.done, WELCOME_BAR)} alt={`${pct} % fait`} width={WELCOME_BAR} height={6} />
        )}
        {total > 0 && <Text size="footnote" color={palette.text2}>{`${pct} %`}</Text>}
      </Box>
      {/* Le bloc des faites (#335) : les chiffres de la semaine, qui font le bouton, puis la grille d'un an. */}
      {a ? (
        <Box key="welcome:week" flexDirection="row" alignItems="center" gap={Client ? 0 : SPACE.row} flexWrap="wrap">
          {GRID_MODES.map(chip)}
        </Box>
      ) : (
        w.week && (
          <Box key="welcome:week" flexDirection="row" alignItems="center" gap={SPACE.row} flexWrap="wrap">
            <Text size="caption" weight="semibold" color={palette.ok}>{w.week}</Text>
          </Box>
        )
      )}
      {a && (
        <Box key="welcome:activity" flexDirection="column" {...inset}>
          {grid()}
        </Box>
      )}
      <Box flexDirection="row" alignItems="center" gap={SPACE.tight} flexWrap="wrap" {...inset}>
        <Text size="footnote" color={palette.text2}>Aujourd'hui</Text>
        {w.pills.map(p => pill(p.text, ...tone[p.tone]))}
      </Box>
      <Box flexDirection="row" alignItems="center" gap={SPACE.tight} flexWrap="wrap" paddingTop="xs">
        {w.actions.map(a => (
          <Button
            key={`welcome:${a.key}`}
            {...(a.primary ? { variant: 'primary' as const } : { plain: true, dimColor: true })}
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
 * filet : chez Maestro, le moyeu d'où part une voie vers chaque tâche lancée, à la couleur de son état
 * (la carte d'ouverture ne montre pas ses tâches, #215) ;
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
  // Le titre « #N … » d'une tâche, cliquable (#142) : la clé de son bouton et ce qu'il fait ; avec `hit`,
  // sa zone de clic, posée sur le titre en texte au lieu du bouton (#193).
  onTitle?: { key: string; press: () => void; hit?: RenderElement | null },
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
  const pill = (label: string, bg: string, fg: string, mark?: PillMark) => {
    if (!Svg) return <Text key={label} size="caption" color={fg}>{` ${label} `}</Text>
    const p = pillIcon({ text: label, bg, fg, height: SIZE.pill.row, weight: TEXT.weight.soft, ...(mark ? { mark } : {}) })
    return <Svg key={label} source={p.source} alt={label} width={p.width} height={p.height} />
  }
  // « T'attend » en orange, celui de « bloquée » ; une tâche toute finie en violet (#145) ; « à fusionner »
  // dans le bleu-vert de « attend un tiers » : c'est Maestro qui fusionne (#191, maquette A).
  const tone = (s: BrandTask['state'], finished = false): [string, string] =>
    finished
      ? [palette.finishedTint, palette.finishedOn]
      : s === 'wait'
        ? [palette.blockTint, palette.blockOn]
        : s === 'live'
          ? [palette.liveTint, palette.liveOn]
          : s === 'merge'
            ? [palette.waitTint, palette.waitOn]
            : [palette.sel, palette.text2]
  const mark = (size: number) => Svg && <Svg source={brandMarkIcon(palette, size)} alt="Roadmap" width={size} height={size} />

  if (brand.kind === 'maestro') {
    const shown = brand.tasks.slice(0, BRAND_TASKS_SHOWN)
    const more = brand.tasks.length - shown.length
    // Les étapes de chaque voie (#143), seulement dans l'en-tête du panneau : une voie qui en a prend deux lignes.
    const stepsOf = (t: BrandTask) => {
      const own = steps?.of[t.id]
      const status = own ? shownStatus(own, t.sessionId, t.closed === true) : undefined
      const view = status && steps ? stepsView(status.steps, { now: steps.now, at: status.at, closed: t.closed === true }) : undefined
      return status && view ? { status, view } : undefined
    }
    const anySteps = !card && shown.some(t => stepsOf(t) !== undefined)
    const row = anySteps ? SIZE.strut.row + 20 : SIZE.strut.row
    const lanes = Svg && shown.length > 0 ? brandLanesIcon(palette, shown.map(t => (t.finished ? 'finished' : t.state)), row, 32) : undefined
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
      const bar = stepsBarIcon(palette, view.segments, { width: 120, height: 4, waiting: t.state === 'wait', merging: t.state === 'merge', finished: t.finished === true })
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
                  {pill(words.states[i] ?? '', ...tone(t.state, t.finished === true), t.state === 'merge' && !t.finished ? 'merge' : undefined)}
                </Box>
                {laneSteps(t)}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    )
    // La carte d'ouverture ne montre pas ses tâches (#215) : le panneau et la bande au-dessus de la saisie
    // les portent déjà ; elle garde la marque, les mots et l'accueil.
    if (card) {
      return (
        <Box flexDirection="column" gap={SPACE.block} paddingY="xs">
          <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
            {mark(28)}
            <Box flexDirection="column" flexShrink={1} minWidth={0}>
              <Text size="title" weight="semibold" wrap="wrap">{words.title}</Text>
              <Text size="footnote" color={palette.text2} wrap="wrap">{words.sub}</Text>
            </Box>
          </Box>
          {brand.welcome && welcomeTree($, e, brand.welcome, palette, pill)}
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
      const a = axisPillIcon({ name: brand.axisText ?? axisLabel(brand.axis), hex: accent, bg: axisTint(palette, accent), fg: palette.text })
      return <Svg key="axis" source={a.source} alt={brand.axis} width={a.width} height={a.height} />
    })()
  ) : (
    <Text key="axis" size="caption" color={accent}>{brand.axisText ?? axisLabel(brand.axis)}</Text>
  )
  // Une ligne sans `id:` (#142) : ni numéro, ni voie.
  const numbered = brand.id !== ''
  const stations =
    variant !== 'header' && Svg && words.stations && numbered
      ? brandStationsIcon(palette, accent, words.stations, surfaceWidth(e, variant === 'focus' ? 4 : 6, card ? 520 : Infinity))
      : undefined
  // Le titre en `title` sur la carte et dans la fiche (#181) ; `heading` dans la bande.
  const titleSize = variant === 'header' ? 'heading' : 'title'
  const plainTitle = (
    <Box flexDirection="row" gap={SPACE.row}>
      {numbered && <Text size={titleSize} weight="semibold" color={accent}>{`#${brand.id}`}</Text>}
      <Box flexShrink={1} minWidth={0}>
        <Text size={titleSize} weight="semibold" wrap="wrap" hover={onTitle?.hit ? { underline: true } : undefined}>{brand.label}</Text>
      </Box>
    </Box>
  )
  const title = onTitle?.hit ? (
    // Sur le bureau, un bouton de l'app est natif : il écrit son texte à sa taille et ignore celle des Text
    // (#181 resté sans effet) ; le titre en texte et sa zone de clic, comme « Tout voir » (#173, #193).
    <Box key={`hit:${onTitle.key}`} flexShrink={1} minWidth={0}>
      {plainTitle}
      {onTitle.hit}
    </Box>
  ) : onTitle ? (
    // Un bouton de l'app ne tient que du texte : le numéro et le titre, deux Text dedans.
    <Box key={`title:${onTitle.key}`} flexDirection="row" flexShrink={1} minWidth={0}>
      <Button key={onTitle.key} plain hover={{ underline: true }} onPress={onTitle.press}>
        {numbered && <Text size={titleSize} weight="semibold" color={accent}>{`#${brand.id} `}</Text>}
        <Text size={titleSize} weight="semibold" wrap="wrap">{brand.label}</Text>
      </Button>
    </Box>
  ) : (
    plainTitle
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

/** La commande qui force la bande de Maestro (#225). */
const BAR_COMMAND = 'maestro-bar'

/** Le dernier dessin de la bande demandé par l'app depuis le chargement du module, et s'il cédait à une question (#225). */
let bandAsked: { survey: boolean } | undefined

/**
 * `/maestro-bar` (#225) : la bande ne se redessine qu'à un atome lu, et la fiche de la session se garde
 * entre deux relectures. La commande relit la fiche (un titre changé, une fiche refusée par le mode
 * auto), pose la marque Maestro (choix de Bertrand : la commande vaut « Maestro »), sauf dans une
 * session de tâche ou lancée par un Maestro, relit les sessions, redessine, et dit en une ligne ce que
 * la bande montre, ou pourquoi rien.
 */
async function forceBar($: EngineInterface): Promise<{ text: string }> {
  const own = await readOwnSession($, true)
  const id = sessionTitleId(own.title)
  if (id !== undefined) return { text: maestroBarText({ kind: 'task', id }) }
  if (await parentIsMaestro($)) return { text: maestroBarText({ kind: 'child' }) }
  const source = await sourceNow($)
  if (!source) return { text: maestroBarText({ kind: 'no-roadmap' }) }
  const marked = own.id !== undefined && (await loadMaestros($))[own.id] === undefined && !isMaestroSession(own.title)
  try {
    await markMaestro($)
  } catch {
    // store illisible : le titre juge seul
  }
  await refreshSessions($, source, true)
  const found = await sessionBrandOf($)
  await update($, liveVersionAtom, v => v + 1)
  $.ui.invalidate('ui.render')
  if (found?.brand.kind !== 'maestro') return { text: maestroBarText({ kind: 'unread' }) }
  return {
    text: maestroBarText({ kind: 'maestro', tasks: found.brand.tasks.length, marked, survey: bandAsked?.survey === true, drawn: bandAsked !== undefined }),
  }
}

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

// La bande au-dessus de la saisie garde ses mesures et ses mots d'avant #254 (Bertrand : « je ne veux rien
// changer pour Above the prompt ») : sa pastille reste à 18 px, sa close dit « Completed ».
const BAND_PILL = 18

/**
 * L'arbre de Maestro dans la bande au-dessus de la saisie (#147, style C retouché) : sur le fond du
 * panneau, « Maestro » et ses sessions ; puis une ligne par tâche, sans voies : le point de son état, le
 * numéro, le nom (ouvre la session), sa jauge, « 2/6 », l'étape en cours, l'état en icône et en mot (#211,
 * maquette D : l'étape après la jauge, les icônes du bloc « En cours ») ; une seule jauge par ligne (#152).
 * Colonnes de largeur fixe à droite, la ligne s'éclaire au survol. Au terminal, le texte seul.
 */
function maestroBandTree(
  $: EngineInterface,
  e: RenderInput<'AbovePrompt'>,
  band: MaestroBand,
  palette: Palette,
  views: readonly (StepsView | undefined)[],
  act: { open: (t: BrandTask) => void; archive: (t: BrandTask) => void; compact: () => void },
  now: number,
  contexts: { mine?: ContextView; rows: readonly (ContextView | undefined)[] } = { rows: [] },
  zoneGen = 0,
): RenderElement {
  const resolved = $.ui.resolve(e)
  const { Box, Text, Button } = resolved
  const Svg = 'Svg' in resolved && e.surface !== 'terminal' ? resolved.Svg : undefined
  const Client = 'Client' in resolved && Svg ? resolved.Client : undefined
  const words = brandText(band.brand)
  const mine = contexts.mine
  // Les couleurs de #145 : t'attend en orange, toute finie en violet ; à fusionner en bleu-vert (#191).
  const hue = (t: BrandTask): [string, string] =>
    t.finished
      ? [palette.finished, palette.finishedOn]
      : t.state === 'wait'
        ? [palette.block, palette.blockOn]
        : t.state === 'live'
          ? [palette.live, palette.liveOn]
          : t.state === 'merge'
            ? [palette.wait, palette.waitOn]
            : [palette.done, palette.text2]
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
  // « Compacter » au-delà de 65 % de contexte (#197, maquette B) : une pastille rouge et sa zone de clic ;
  // au terminal ou sans zone, un bouton de texte.
  const compactButton = () => {
    const id = 'band-compact'
    if (!Svg || !Client) return <Button key={id} plain label="Compacter" onPress={act.compact} />
    pressHandlers.set(id, act.compact)
    zoneDrawn(zones, 'press-hit', now)
    const pill = pillIcon({ text: 'Compacter', bg: palette.lateTint, fg: palette.lateOn, height: BAND_PILL })
    return (
      <Box key={id} flexDirection="row" alignItems="center">
        <Svg source={pill.source} alt="Compacter" width={pill.width} height={pill.height} />
        <Box position="absolute" top={0} left={0} right={0}>
          <Client key={`${pressKey(id)}-g${zoneGen}`} module="./press-hit.tsx" props={{ id }} width="100%" height={1} />
        </Box>
      </Box>
    )
  }
  // L'étape en cours d'une tâche pas finie, et l'état de chaque ligne en icône et en mot (#211).
  const stepOf = (t: BrandTask, i: number) => (t.finished ? '' : (views[i]?.current ?? ''))
  const marks = band.tasks.map(bandState)
  const cols = bandColumns({
    counts: views.map(v => v?.count ?? ''),
    states: marks.map(m => m.word),
    archive: band.tasks.some(t => t.archivable && t.sessionId),
    steps: band.tasks.map(stepOf),
  })
  // L'icône de l'état, celles du bloc « En cours » (#211) ; au terminal, son signe.
  const stateIcon = (icon: ReturnType<typeof bandState>['icon'], word: string, hex: string) => {
    if (!Svg) return <Text size="caption" color={hex}>{{ spinner: '◌', hand: '✋', merge: '⑂', check: '✓' }[icon]}</Text>
    const source =
      icon === 'spinner'
        ? spinnerIcon(palette.live, 14, word, false, now)
        : icon === 'hand'
          ? handIcon(palette.block, 14, STROKE.pill, word)
          : icon === 'merge'
            ? mergeIcon(palette.wait, 14, STROKE.pill, word)
            : checkIcon(hex, 14, STROKE.pill)
    return <Svg source={source} alt={word} width={SIZE.icon.sm} height={SIZE.icon.sm} {...(icon === 'spinner' ? { isInteractive: true } : {})} />
  }
  // Le titre ouvre la session : sur le bureau, un texte et sa zone de clic, sans la marge du bouton natif
  // qui creusait l'écart après le numéro (#211) ; au terminal, le bouton.
  const titleOf = (t: BrandTask) => {
    const graphic = Boolean(t.sessionId && Svg && Client)
    const name = (
      <Text size="footnote" wrap="truncate-end" {...(graphic ? { hover: { underline: true } } : {})}>
        {t.label}
      </Text>
    )
    if (!t.sessionId) return name
    const id = `band-open:${keyPart(t.id)}`
    if (!Svg || !Client) {
      return (
        <Button key={id} plain hover={{ underline: true }} onPress={() => act.open(t)}>
          {name}
        </Button>
      )
    }
    pressHandlers.set(id, () => act.open(t))
    zoneDrawn(zones, 'press-hit', now)
    return (
      <Box key={id} minWidth={0}>
        {name}
        <Box position="absolute" top={0} left={0} right={0}>
          <Client key={`${pressKey(id)}-g${zoneGen}`} module="./press-hit.tsx" props={{ id }} width="100%" height={1} />
        </Box>
      </Box>
    )
  }
  return (
    <Box flexDirection="column" gap={SPACE.tight} backgroundColor={palette.bg} padding="sm">
      {/* L'en-tête commence comme une ligne, par le même trait d'espace : « Maestro » au droit des pastilles (#326). */}
      <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
        {strut}
        <Text size="footnote" weight="semibold">{words.title}</Text>
        {words.foot !== '' && <Text size="caption" color={palette.text3}>{`· ${words.foot}`}</Text>}
        {/* Le contexte de Maestro, seul : « Contexte 40 % », sans tokens ni jauge (#174) ; au-delà de 65 %,
            le % en rouge, suivi de « Compacter » (#197). */}
        {mine && <Box flexGrow={1} />}
        {mine && <Text size="caption" color={palette.text3}>Contexte</Text>}
        {mine && (
          <Text size="caption" tabular {...(mine.compact ? { weight: 'semibold' as const } : {})} color={mine.compact ? palette.late : palette.text2}>
            {`${mine.percent} %`}
          </Text>
        )}
        {mine?.compact && compactButton()}
      </Box>
      <Box flexDirection="column">
        {band.tasks.map((t, i) => {
          const view = views[i]
          const [dot, word] = hue(t)
          const bar = view && Svg ? stepsBarIcon(palette, view.segments, { width: BAND_GAUGE.row, height: 4, waiting: t.state === 'wait', merging: t.state === 'merge', finished: t.finished === true }) : undefined
          // Le contexte de la session en jauge fine sous sa jauge d'étapes (#157, revenu par #217) ; sans mesure, rien.
          // L'écart entre les deux est dessiné dans l'image, à BAND_GAUGE.gap px (#241).
          const ctx = contexts.rows[i]
          const ctxBar = ctx && Svg ? contextBarIcon(palette, ctx, { width: bar?.width ?? BAND_GAUGE.row, height: 2, top: BAND_GAUGE.gap }) : undefined
          const mark = marks[i] ?? bandState(t)
          const step = stepOf(t, i)
          return (
            <Box key={`band-row:${keyPart(t.id)}`} flexDirection="row" alignItems="center" gap={SPACE.row} hover={{ backgroundColor: palette.hover }}>
              {strut}
              {Svg && <Svg source={discIcon(dot, 12)} alt={t.state === 'done' ? bandState(t).word : (words.states[i] ?? '')} width={12} height={12} />}
              {/* Le numéro à sa largeur, à un écart du titre : plus de case de 5 cellules (#211). */}
              <Box flexShrink={0}>
                <Text size="caption" tabular color={palette.text3}>{`#${t.id}`}</Text>
              </Box>
              <Box flexShrink={1} minWidth={0}>
                {titleOf(t)}
              </Box>
              <Box flexGrow={1} />
              {/* Jauge, compte et état à largeur fixe, sur chaque ligne (#172) : les barres partent de la même
                  colonne, quels que soient le titre, l'étape ou le compte (« 5/7 », « 7/7 Done »). La case de la
                  jauge suit son dessin, qui va jusqu'au compte (#326). */}
              {Svg && (
                <Box key={`band-gauge:${keyPart(t.id)}`} flexShrink={0} flexDirection="column" gap={0}>
                  {bar && <Svg source={bar.source} alt={`étapes ${view?.count ?? ''}`} width={bar.width} height={bar.height} />}
                  {/* Sans note, la case garde la largeur d'une jauge : le compte et l'étape restent en colonne (#326). */}
                  {!bar && <Svg source={`<svg xmlns="http://www.w3.org/2000/svg" width="${BAND_GAUGE.row}" height="4"/>`} alt="espace" width={BAND_GAUGE.row} height={4} />}
                  {ctxBar && ctx && <Svg source={ctxBar.source} alt={`contexte ${ctx.text}`} width={ctxBar.width} height={ctxBar.height} />}
                </Box>
              )}
              {/* Compte, état et archivage serrés à la largeur de leur plus long texte (#174). */}
              {cols.count > 0 && (
                <Box key={`band-count:${keyPart(t.id)}`} width={cols.count} flexShrink={0} alignItems="flex-end">
                  {view && <Text size="caption" tabular color={palette.text3}>{view.count}</Text>}
                </Box>
              )}
              {/* L'étape en cours, après la jauge et son compte, dans sa colonne (#211, maquette D). Elle ne
                  rétrécit pas : seul le titre cède sa place, sinon un titre long poussait la jauge (#326). */}
              {cols.step > 0 && (
                <Box key={`band-step:${keyPart(t.id)}`} width={cols.step} flexShrink={0} minWidth={0}>
                  {step !== '' && <Text size="caption" color={palette.text3} wrap="truncate-end">{step}</Text>}
                </Box>
              )}
              {/* L'état en icône et en mot, pour tous les états (#211). */}
              <Box key={`band-state:${keyPart(t.id)}`} width={cols.state} flexShrink={0} flexDirection="row" alignItems="center" justifyContent="flex-end" gap={SPACE.row}>
                {stateIcon(mark.icon, mark.word, word)}
                <Text size="caption" color={word}>{mark.word}</Text>
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

/**
 * La largeur des jauges d'une ligne de la bande de Maestro, étapes et contexte, en px (#147, #217) ; celle de
 * Maestro est partie (#174). Leur case suit ce dessin, jusqu'au compte (#326) ; celles du compte, de l'état et
 * de l'archivage suivent le texte réel (`bandColumns`, #174). `gap` : l'écart en px entre les deux jauges,
 * dessiné dans la jauge de contexte (#241).
 */
const BAND_GAUGE = { row: 80, gap: 2 }

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
  return brandTree($, e, found.brand, found.data.palette, 'header', today, {
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
    // #191 : l'avance de sa propre branche coche « Fusionner » dans sa fiche.
    const settings = projectSettings(source)
    mergeProject = { git: settings.travail === 'code', ...(settings.publier ? { publish: settings.publier } : {}) }
    if (ownId && mergeProject.git) aheadBySession.set(ownId, { at: now, ahead: gap?.ahead })
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

/** Ce que `mergeSteps` lit du projet (#191) : du code (git), et l'étape de `publier` ; posé à chaque relecture des avances. */
let mergeProject: { git: boolean; publish?: string } = { git: false }

/** L'avance de la branche de chaque session sur sa base (#191) : ses commits hors de la base ; inconnue sans git. */
const aheadBySession = new Map<string, { at: number; ahead: number | undefined }>()

/**
 * Relit, au plus toutes les 30 s par session, l'avance de la branche des sessions (#191) : la branche de
 * la liste des sessions contre sa base (`childFiche`), dans le dépôt de cette session, qui voit les
 * branches des worktrees. Sans code, session distante, branche absente ou égale à sa base, git en
 * échec : inconnue, et rien ne change à l'affichage.
 */
async function refreshAhead($: EngineInterface, source: Source, sessionIds: readonly (string | undefined)[], now: number): Promise<void> {
  const settings = projectSettings(source)
  mergeProject = { git: settings.travail === 'code', ...(settings.publier ? { publish: settings.publier } : {}) }
  if (!mergeProject.git) return
  const root = await $.session.root()
  await Promise.all(
    sessionIds.map(async sid => {
      if (!sid) return
      const known = aheadBySession.get(sid)
      if (known && now - known.at < FOCUS_FACTS_MS) return
      let ahead: number | undefined
      try {
        const row = sessionRows.find(r => typeof r === 'object' && r !== null && (r as { sessionId?: unknown }).sessionId === sid) as { branch?: unknown } | undefined
        const branch = typeof row?.branch === 'string' && row.branch !== '' ? row.branch : undefined
        const fiche = await childFiche($, sid)
        if (branch && fiche.remote !== true && branch !== fiche.base) {
          const r = await gitIn($, root, 'rev-list', '--count', `${fiche.base}..${branch}`)
          if (r.code === 0 && /^\d+$/.test(r.out.trim())) ahead = Number(r.out.trim())
        }
      } catch {
        // git ou fiche illisible : inconnue
      }
      aheadBySession.set(sid, { at: now, ahead })
    }),
  )
}

/** Les étapes d'une session telles que le panneau les dessine (#191) : les siennes, puis « Fusionner » (et « Publier »). */
function shownStatus(status: ChildStatus, sessionId: string | undefined, closed: boolean): ChildStatus {
  const ahead = sessionId ? aheadBySession.get(sessionId)?.ahead : undefined
  return { ...status, steps: mergeSteps(status.steps, { ...mergeProject, ...(ahead !== undefined ? { ahead } : {}), closed }) }
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
  // `spec:` se lit à la racine du projet (#93), pas dans le dossier de la roadmap (#306).
  const base = source.root ?? source.dir
  const key = `${base}|${task.spec ?? ''}`
  if (ficheDocs && ficheDocs.key === key && now - ficheDocs.at < FOCUS_FACTS_MS) return ficheDocs.docs
  const docs: { label: string; path: string }[] = []
  if (task.spec) {
    const at = `${base}/${task.spec.replace(/\/$/, '')}`
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

/** Une pièce jointe de la ligne (`pj:`, #204) : son nom, le chemin trouvé (absent : introuvable), son aperçu. */
type Attachment = { name: string; written: string; kind: 'image' | 'pdf' | 'file'; path?: string; thumb?: string }

/** La vignette d'une image dans la fiche (#204, maquette B en plus petit) : 48 × 64 px, tirée à 2× par `sips`. */
const THUMB = { width: 48, height: 64, px: 128 }
/** Au-delà, un `Svg` est refusé (131 072 caractères) : l'image garde sa ligne, sans aperçu. */
const THUMB_SVG_MAX = 120_000

/** Les pièces jointes (et les livrables, #234) de la tâche ouverte, relues au plus toutes les 30 s ; les aperçus, par fichier et date de modification. */
const attachmentsRead = new Map<'pj' | 'livrable', { key: string; at: number; list: Attachment[] }>()
const thumbs = new Map<string, string | null>()
/** Le dossier privé des vignettes, tiré une fois par `mktemp -d` (sous le `$TMPDIR` de l'utilisateur, mode 700). */
let thumbDir: Promise<string | undefined> | undefined

async function privateThumbDir($: EngineInterface): Promise<string | undefined> {
  thumbDir ??= $.process
    .run(['mktemp', '-d', '-t', 'roadmap-pj'], { timeoutMs: 5_000 })
    .then(ran => (ran.exitCode === 0 && ran.stdout.trim().startsWith('/') ? ran.stdout.trim() : undefined))
    .catch(() => undefined)
  const dir = await thumbDir
  // Un échec se retente au dessin suivant.
  if (dir === undefined) thumbDir = undefined
  return dir
}

async function readAttachments($: EngineInterface, source: Source, task: Task, now: number, which: 'pj' | 'livrable' = 'pj'): Promise<Attachment[]> {
  const pj = task[which] ?? []
  if (pj.length === 0) return []
  const key = `${source.dir}|${task.key}|${pj.join(',')}`
  const kept = attachmentsRead.get(which)
  if (kept && kept.key === key && now - kept.at < FOCUS_FACTS_MS) return kept.list
  const list: Attachment[] = []
  for (const written of pj) {
    let found: { path: string; mtime: number } | undefined
    for (const path of pathCandidates(source, written)) {
      try {
        const st = await $.fs.stat(path)
        if (st.kind === 'file') {
          found = { path, mtime: st.mtimeMs }
          break
        }
      } catch {
        // absent ici : le candidat suivant
      }
    }
    const kind = attachmentKind(written)
    const thumb = found && kind === 'image' ? await thumbOf($, found.path, found.mtime) : undefined
    list.push({ name: written.split('/').pop() || written, written, kind, ...(found ? { path: found.path } : {}), ...(thumb ? { thumb } : {}) })
  }
  attachmentsRead.set(which, { key, at: now, list })
  return list
}

/** La colonne des étiquettes d'en-tête du brouillon (« À », « Cc », « Cci », « PJ », #264), en cellules. */
const DRAFT_LABEL_CELLS = 3

/**
 * Un chemin tel qu'écrit dans un fichier du projet (une pièce jointe, #264) : le premier candidat qui existe,
 * ouvert par `openFile`, qui contrôle le chemin réel (#349). Le chemin vient du texte d'un brouillon : ni absolu,
 * ni `~`, ni `..`, et d'une extension de document.
 */
async function openWritten($: EngineInterface, source: Source, written: string, at: string): Promise<void> {
  const inside = !written.startsWith('/') && !written.startsWith('~') && !written.split(/[\\/]/).includes('..')
  if (!inside || !isDocumentPath(written)) return void (await setView($, () => ({ openNote: `Pas ouvert depuis l'aperçu : ${written}`, openAt: at })))
  for (const path of pathCandidates(source, written)) {
    try {
      await $.fs.stat(path)
    } catch {
      continue // absent ici : le suivant
    }
    return void (await openFile($, source, path, { at }))
  }
  const note = openRefusal('missing', written)
  await setView($, () => ({ openNote: note, openAt: at }))
}

/** Le brouillon que montre la fiche (#236) : le plus récent des livrables texte trouvés, son aperçu, ou trop gros pour être lu. */
type DraftRead = { path: string; name: string; mtime: number; preview?: DraftPreview; tooBig?: true }
/** L'aperçu lu, gardé par chemin et date de modification : un fichier inchangé ne se relit pas. */
let draftRead: { key: string; preview: DraftPreview } | undefined

/** Le dernier texte lu de chaque livrable, par chemin et date de modification : l'aperçu (#236) et la garde de l'envoi (#242) le partagent, un fichier inchangé ne se relit pas. */
const textRead = new Map<string, { mtime: number; text: string }>()

async function readText($: EngineInterface, path: string, mtime: number): Promise<string> {
  const kept = textRead.get(path)
  if (kept && kept.mtime === mtime) return kept.text
  const text = await $.fs.read(path)
  textRead.set(path, { mtime, text })
  return text
}

async function readDraft($: EngineInterface, list: readonly Attachment[]): Promise<DraftRead | undefined> {
  let best: { path: string; name: string; mtime: number; size: number } | undefined
  for (const a of list) {
    if (a.path === undefined || !isPreviewable(a.path)) continue
    try {
      // Relu à chaque dessin : la version que la session vient d'écrire est celle qu'on voit.
      const st = await $.fs.stat(a.path)
      if (st.kind === 'file' && (best === undefined || st.mtimeMs > best.mtime)) best = { path: a.path, name: a.name, mtime: st.mtimeMs, size: st.size }
    } catch {
      // effacé depuis : le suivant
    }
  }
  if (best === undefined) return undefined
  const head = { path: best.path, name: best.name, mtime: best.mtime }
  if (best.size > PREVIEW.bytes) return { ...head, tooBig: true }
  const key = `${best.path}|${best.mtime}`
  if (draftRead?.key !== key) {
    try {
      draftRead = { key, preview: draftPreview(await readText($, best.path, best.mtime)) }
    } catch {
      return head
    }
  }
  return { ...head, preview: draftRead.preview }
}

/** Les livrables de la tâche qui sont des communications pas encore parties (#242), tels qu'écrits sur la ligne. */
async function unsentDeliverables($: EngineInterface, source: Source, task: Task): Promise<string[]> {
  const unsent: string[] = []
  for (const written of task.livrable ?? []) {
    let state: ReturnType<typeof commState> | undefined
    for (const path of pathCandidates(source, written)) {
      try {
        const st = await $.fs.stat(path)
        if (st.kind !== 'file') continue
        const text = isPreviewable(path) && st.size <= PREVIEW.bytes ? await readText($, path, st.mtimeMs) : undefined
        state = commState(written, text, true)
        break
      } catch {
        // absent ici : le candidat suivant
      }
    }
    if ((state ?? commState(written, undefined, false)) === 'unsent') unsent.push(written)
  }
  return unsent
}

/** La garde de l'envoi au panneau (#242) : la clôture d'une tâche dont une communication n'est pas partie. */
async function unsentClose($: EngineInterface, source: Source, task: Task): Promise<string | undefined> {
  const unsent = await unsentDeliverables($, source, task).catch(() => [])
  return unsent.length > 0 ? unsentNote(unsent) : undefined
}

/** Les chemins de fichiers écrits dans les champs de la fiche (#234) et le fichier trouvé pour chacun, relus au plus toutes les 30 s. */
let linksRead: { key: string; at: number; found: Map<string, string> } | undefined

async function readLinks($: EngineInterface, source: Source, texts: readonly (string | undefined)[], now: number): Promise<Map<string, string>> {
  const written = [...new Set(texts.flatMap(t => (t ? fileLinks(t) : [])).flatMap(x => ('path' in x ? [x.path] : [])))]
  if (written.length === 0) return new Map()
  const key = `${source.dir}|${written.join(',')}`
  if (linksRead && linksRead.key === key && now - linksRead.at < FOCUS_FACTS_MS) return linksRead.found
  const found = new Map<string, string>()
  for (const w of written) {
    for (const path of pathCandidates(source, w)) {
      try {
        if ((await $.fs.stat(path)).kind === 'file') {
          found.set(w, path)
          break
        }
      } catch {
        // absent ici : le candidat suivant
      }
    }
  }
  linksRead = { key, at: now, found }
  return found
}

/**
 * L'aperçu d'une image (#204) : `sips` (macOS) la réduit en JPEG dans un dossier privé tiré au hasard
 * (jamais un nom prévisible de `/tmp`, qu'un autre compte pourrait piéger d'un lien), lue en octets,
 * effacée, et posée dans un SVG. Sans `sips`, un échec ou un aperçu trop lourd : rien, retenu jusqu'à
 * ce que le fichier change.
 */
async function thumbOf($: EngineInterface, path: string, mtime: number): Promise<string | undefined> {
  const key = `${path}|${mtime}`
  if (thumbs.has(key)) return thumbs.get(key) ?? undefined
  let svg: string | null = null
  try {
    const dir = await privateThumbDir($)
    if (dir === undefined) return undefined
    const out = `${dir}/${hashLabel(key)}.jpg`
    const ran = await $.process.run(['sips', '-Z', String(THUMB.px), '-s', 'format', 'jpeg', '-s', 'formatOptions', '70', path, '--out', out], { timeoutMs: 10_000 })
    if (ran.exitCode === 0) {
      const { base64 } = await $.fs.read(out, { as: 'bytes' })
      const drawn = thumbSvg(base64, THUMB.width, THUMB.height)
      if (drawn.length <= THUMB_SVG_MAX) svg = drawn
    }
    await $.process.run(['rm', '-f', out], { timeoutMs: 5_000 }).catch(() => undefined)
  } catch {
    // pas de sips (hors macOS), fichier illisible : pas d'aperçu
  }
  thumbs.set(key, svg)
  return svg ?? undefined
}

/**
 * Le corps de la carte « Étapes » de la fiche (#142, #143 ; carte repliable #199 ; le fil #214, maquette
 * A) : un point par étape sur un fil vert jusqu'à l'étape en cours, gris ensuite ; l'étape en cours dans
 * une bande teintée, son mot à droite (« en cours », « t'attend » orange avec la question dessous,
 * « à fusionner » bleu-vert, #191). Le rail a une hauteur fixe : un libellé tient sur une ligne, pour que
 * le fil reste continu. Son résumé, le compte et l'âge de la note. Rien sans note lisible.
 */
function ficheSteps(
  $: EngineInterface,
  e: RenderInput<'Pane'>,
  palette: Palette,
  own: ChildStatus | undefined,
  now: number,
  closed = false,
  // #191 : la session qui tient ces étapes, pour « Fusionner », et l'état de la bande, pour la couleur.
  sessionId?: string,
  state?: BrandTask['state'],
): { summary: string; body: RenderElement } | null {
  const status = own ? shownStatus(own, sessionId, closed) : undefined
  const view = status ? stepsView(status.steps, { now, at: status.at, fold: Infinity, closed }) : undefined
  if (!status || !view) return null
  const { Box, Text } = $.ui.resolve(e)
  const Svg = e.surface === 'terminal' ? undefined : $.ui.resolve(e).Svg
  const question = status.question?.text
  const tone =
    question !== undefined
      ? { line: palette.block, tint: palette.blockTint, on: palette.blockOn, word: "t'attend" }
      : state === 'merge'
        ? { line: palette.wait, tint: palette.waitTint, on: palette.waitOn, word: 'à fusionner' }
        : { line: palette.live, tint: palette.liveTint, on: palette.liveOn, word: 'en cours' }
  const rail = (o: Parameters<typeof stepRailIcon>[1], alt: string) => {
    if (!Svg) return null
    const icon = stepRailIcon(palette, { ...o, tone: tone.line })
    return <Svg source={icon.source} alt={alt} width={icon.width} height={icon.height} />
  }
  const corners = Svg
    ? CORNERS.map(([corner, at]) => (
        <Box position="absolute" {...at}>
          <Svg source={cornerIcon(corner, RADIUS.control, palette.bg)} alt="coin" width={RADIUS.control} height={RADIUS.control} />
        </Box>
      ))
    : null
  return {
    summary: cardSummary('etapes', { steps: { count: view.count, age: view.age } }),
    body: (
      <Box key="fiche-steps" flexDirection="column">
        {filRows(view, question).map((r, i) =>
          r.kind === 'ask' ? (
            <Box key="fiche-step-ask" flexDirection="row" alignItems="flex-start" gap={SPACE.row}>
              {rail({ ...(r.line ? { top: r.line, bottom: r.line } : {}), height: 20 }, 'fil')}
              <Text size="caption" color={palette.blockOn} wrap="wrap">{r.text}</Text>
            </Box>
          ) : (
            <Box key={`fiche-step:${i}`} flexDirection="row" alignItems="center" gap={SPACE.row}>
              {rail({ node: r.status, ...(r.top ? { top: r.top } : {}), ...(r.bottom ? { bottom: r.bottom } : {}) }, `étape ${STEP_WORDS[r.status]}`)}
              {!Svg && <Text size="footnote" color={palette.text2}>{STEP_MARKS[r.status]}</Text>}
              {r.status === 'now' ? (
                <Box key="fiche-step-now" flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent} flexGrow={1} flexShrink={1} minWidth={0} backgroundColor={tone.tint}>
                  {corners}
                  <Box flexGrow={1} flexShrink={1} minWidth={0}>
                    <Text size="footnote" weight="semibold" color={palette.text} wrap="truncate-end">{r.content}</Text>
                  </Box>
                  <Text size="caption" weight="medium" color={tone.on}>{tone.word}</Text>
                </Box>
              ) : (
                <Box flexGrow={1} flexShrink={1} minWidth={0} paddingX={SPACE.indent}>
                  <Text size="footnote" color={palette.text2} wrap="truncate-end">{r.content}</Text>
                </Box>
              )}
            </Box>
          ),
        )}
      </Box>
    ),
  }
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
/** Ce que dit l'icône de la bande d'état de la fiche (#199). */
const BAND_MARK_WORDS: Record<NonNullable<ReturnType<typeof stateBand>['mark']>, string> = { person: 'attend ta réponse', spinner: 'en cours', merge: 'fusion', check: 'faite' }

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

  // La source se relit quand le titre de la session arrive ou change : « #N · … » cherche sa tâche (#213).
  const ownTitle = (await readOwnSession($)).title
  const fromDisk = knownSource === undefined || sourceTitle !== ownTitle ? await sourceNow($) : (knownSource ?? undefined)
  // Les axes enregistrés et pas encore écrits (#354) : leur nom et leur couleur se montrent aussitôt.
  const pendingAxes = fromDisk ? pendingFor(fromDisk)?.axes ?? [] : []
  const source = fromDisk && pendingAxes.length > 0 ? { ...fromDisk, axes: applyAxisMoves(fromDisk.axes, pendingAxes) } : fromDisk
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
    // Lu pour être redessiné à la fin d'un mouvement de case (#182), sans relire les fichiers.
    read($, checkMoveAtom),
  ])
  const {
    axis: axisRaw, attend: attendRaw, who: whoRaw = 'all', moreFilters = false, showDone: doneChosen, groupBy, selected, openGroups, closedGroups, moreGroups,
    launchNote, launched, openNote, openAt = '', conclusionOpen, missionOpen = '', draftOpen = '', draftFolded = '', reopenAsk = '', cancelAsk = '', closeKind = 'abandon', cancelNote = '',
    editing: editingKey = '', editNote = '', editField = '', editCount = 0, foldedCards = [], openedCards = [], gaugePick = '', briefOpen = '',
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

  // Dans une session « #N · … » : la fiche de sa tâche plutôt que toute la roadmap (#137, #142) ; Maestro,
  // toujours la liste ; sa tâche introuvable partout, l'alerte, jamais la liste en silence (#213).
  const own = await readOwnSession($)
  const titleId = sessionTitleId(own.title)
  // Lancée par Maestro (#233) : sa fiche seule. Demandé une fois au premier dessin d'une session « #N · … »,
  // sans attendre le premier message ; ensuite, les hooks le tiennent.
  if (titleId !== undefined && !parentAsked) {
    parentAsked = true
    await parentIsMaestro($)
  }
  const ownBrand = await sessionBrandOf($)
  const isMaestro = isMaestroSession(own.title) || (own.id !== undefined && (await loadMaestros($))[own.id] !== undefined)
  const child = parentMaestro && !isMaestro
  const focus = paneFocus(ownBrand?.brand, view, { ...(titleId !== undefined ? { titleId } : {}), isMaestro, child })
  const focusBrand = ownBrand?.brand.kind === 'task' && focus === 'task' ? ownBrand.brand : undefined
  if (focus === 'missing' && titleId !== undefined) {
    const others = (missingSearch?.id === titleId ? missingSearch.names : [source.name]).filter(n => n !== source.name)
    const where = others.length > 0 ? `absente de la roadmap de ${source.name} et des autres projets (${others.join(', ')})` : `absente de la roadmap de ${source.name}`
    const retryMissing = () => {
      missingSearch = undefined
      void sourceNow($).then(() => update($, retryAtom, v => v + 1))
    }
    return (
      <Box flexDirection="column" gap={SPACE.block} paddingX={SPACE.screen} paddingTop="sm">
        <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
          {SvgEl ? <SvgEl source={alertIcon(palette.late)} alt="introuvable" width={SIZE.icon.md} height={SIZE.icon.md} /> : <Text color="error">!</Text>}
          <Text weight="semibold">{`#${titleId} introuvable`}</Text>
        </Box>
        <Text color={palette.text2} wrap="wrap">{`Cette session travaille sur #${titleId}, ${where}.`}</Text>
        <Box flexDirection="row" alignItems="center" gap={SPACE.textButtons} marginTop="sm">
          <Box key="missing-retry-row" paddingX={SPACE.indent} paddingY="xs" alignItems="center" backgroundColor={palette.btn} hover={{ backgroundColor: palette.btnHover }}>
            {corners(RADIUS.control, palette.bg)}
            <Button key="missing-retry" plain label="Réessayer" onPress={retryMissing} />
          </Box>
          {/* Chez un enfant de Maestro, pas de chemin vers la liste : elle reste à Maestro (#233). */}
          {!child && (
            <Box key="missing-whole-row" paddingX={SPACE.indent} paddingY="xs" alignItems="center" backgroundColor={palette.btn} hover={{ backgroundColor: palette.btnHover }}>
              {corners(RADIUS.control, palette.bg)}
              <Button key="missing-whole" plain label="Toute la roadmap" onPress={() => void setView($, () => ({ whole: true }))} />
            </Box>
          )}
        </Box>
        <Text size="caption" color={palette.text2}>Nouvel essai seul toutes les 15 s</Text>
      </Box>
    )
  }

  // La date d'un parent est celle de son enfant ouvert le plus proche (#125) : filtres, tri et pastilles la lisent.
  const openTasks = withParentDates(open.filter(t => !t.done))
  const doneTasks = done.filter(t => t.done)
  // Le # de l'arbre (#258) : sa colonne à la largeur du plus long numéro, contre la flèche.
  const treeNumCells = treeNumberCells([...openTasks, ...doneTasks].flatMap(t => (t.id ? [t.id] : [])))
  // Toutes faites : les Done par jour, barre verte, plutôt qu'une liste vide (#202) ; la dernière
  // cochée compte encore le temps de son mouvement, dans les ouvertes (#182).
  const settling = doneTasks.filter(t => checkLingers(checkMoves.get(taskKey(t)), now)).length
  const showDone = doneViewOn(doneChosen, openTasks.length + settling, doneTasks.length)
  // Le nom posé à la main (`nom:`, #235) l'emporte sur le titre tiré ; le sujet vient toujours du modèle.
  const short = (t: Task): ShortTitle => ({ sujet: '…', ...titles[hashLabel(t.label)], titre: shownTitle(t, titles) })
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
  // Avec « Fusionner » ajoutée dans un dossier à git (#191).
  const rowSteps = new Map<string, ChildStatus>()
  await refreshAhead($, source, openTasks.map(t => liveOf(t)?.entry.sessionId), now)
  await Promise.all(
    openTasks.map(async t => {
      const sid = liveOf(t)?.entry.sessionId
      const found = await readSteps($, sid)
      if (found) rowSteps.set(taskKey(t), shownStatus(found, sid, t.done))
    }),
  )
  // Tâches enchaînées : `après:` désigne la prérequise ; une tâche est bloquée tant qu'elle n'est pas faite.
  const allTasks = [...openTasks, ...doneTasks]
  // La sélection de la liste (#316) : les tâches choisies encore dans la roadmap.
  const picked = pickPrune(view.picked ?? [], allTasks)
  const pickedSet = new Set(picked)
  // La question d'une coche (#355) : ses tâches encore dans la roadmap.
  const asking = pickPrune(view.confirmDone ?? [], allTasks)
  const askedSet = new Set(asking)
  // Un seul calcul des prérequises par tâche : la chaîne prend la première, « Débloque » toutes.
  const prereqsCache = new Map<Task, Task[]>()
  const prereqsFor = (t: Task): Task[] => {
    if (!prereqsCache.has(t)) prereqsCache.set(t, prereqsOf(t, allTasks, x => cachedTitle(x, titles)))
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
    void setView($, () => ({ selected: key, launchNote: '', openNote: '', openAt: '', cancelAsk: '', cancelNote: '', editing: '', editNote: '', editField: '' }))
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
  // Les zones de clic déjà posées dans ce dessin : l'app refuse tout l'arbre qui dessine deux fois la même
  // (« Client "press-…" is drawn twice »), et le panneau restait vide. Chez Caroline, une mère lancée par
  // Maestro, dans le bloc « En cours » et en tête de ses sous-tâches dans la liste (#220) : la seconde
  // fois, son numéro est un texte, et toute zone répétée ne se pose pas.
  const drawnZones = new Set<string>()
  const firstZone = (id: string) => !drawnZones.has(id) && (drawnZones.add(id), true)
  // Colonnes des chiffres de la légende : 6 et 7 unités ; dans un panneau étroit (moins de 46
  // colonnes, ~360 px), 4 et 5, pour laisser au nom (« Attend un tiers ») la place d'être lu.
  const narrow = ((e.props as { bodyColumns?: number }).bodyColumns ?? 76) < 46
  const numCol = narrow ? 5 : 6
  const shareCol = narrow ? 5 : 7
  // Un nombre de tâches en petite pastille (10 px, fond discret), comme le compte des sections ;
  // estompée avec sa ligne. Au terminal, le nombre seul.
  const countPillWidth = (n: number | string) => pillIcon({ text: String(n), bg: '', fg: '', weight: TEXT.weight.soft, size: TEXT.count, height: SIZE.pill.count }).width
  const countPill = (n: number | string, dim: boolean, ink: string) => {
    if (!Svg) return <Text tabular color={ink}>{String(n)}</Text>
    const pill = pillIcon({ text: String(n), bg: mixOver(palette.sel, palette.bg, MIX.countBg), fg: palette.text2, weight: TEXT.weight.soft, size: TEXT.count, height: SIZE.pill.count })
    return <Svg source={fade(pill.source, dim)} alt={String(n)} width={pill.width} height={pill.height} />
  }
  // Le numéro d'une tâche devant son titre : petit, discret, suivi d'un point de séparation. Hors du
  // bouton, qui imposerait sa couleur au texte.
  // `open` : la tâche a une session ouverte, et un clic sur son numéro y mène.
  // `fit` (#282), dans le groupe de l'arbre qui tient la colonne : `content`, à la largeur de son texte (après la
  // flèche d'une mère) ; `grow`, il prend la place qui reste et se cale à droite (une tâche seule).
  // `pickIt` (#355, maquette C, survol C2) : le numéro d'une ligne sans session la choisit ; au survol, le fond
  // `liveTint` et l'encre `liveOn`, sans dessin ; choisie, sa pastille `live`. Sur le bureau, un bouton sans
  // encre posé dessus, sans zone de clic, dont le survol allume le numéro (même portée de survol).
  const taskNumber = (id: string, open?: () => void, done = false, fit?: 'content' | 'grow', pickIt?: { press: () => void; chosen: boolean }) => {
    // Une fois cliquable par dessin (#220) : la même tâche dessinée deux fois n'a qu'un numéro qui ouvre.
    const opens = open && (graphic ? numberZones.has(id) : true) && firstZone(`num:${id}`) ? open : undefined
    // Une tâche en session garde son numéro qui mène à sa session (#220) : elle se choisit par sa case.
    const picking = opens ? undefined : pickIt
    if (picking && Svg) ghostPressKeys.add(`pick:${id}`)
    const chosenPill = pillIcon({ text: `#${id}`, bg: palette.live, fg: palette.onAxis, size: PX.text.caption, height: 18 })
    return (
      // Sa colonne (#198), calée à droite, sur toutes les lignes : les tags, l'échéance et le titre suivent,
      // alignés ; à la largeur du plus long numéro (#258), dans la liste comme dans la fiche (#259). Un
      // numéro cliquable est un bouton au terminal ; sur le bureau, un texte et sa zone de clic (un bouton
      // imposait sa taille de texte, 2026-10-23). Une faite : gris clair, barré.
      <Box key={`n:${id}`} {...(fit === 'grow' ? { flexGrow: 1 } : fit === 'content' ? {} : { width: treeNumCells })} flexDirection="row" justifyContent="flex-end" alignItems="center" flexShrink={0}>
        {opens && !graphic ? (
          <Button key={`num:${id}`} plain dimColor onPress={opens}>{`#${id}`}</Button>
        ) : picking && !Svg ? (
          <Button key={`pick:${id}`} plain dimColor onPress={picking.press}>{picking.chosen ? `[#${id}]` : `#${id}`}</Button>
        ) : picking?.chosen && Svg ? (
          <Svg source={chosenPill.source} alt={`#${id} choisi`} width={chosenPill.width} height={chosenPill.height} />
        ) : (
          <Text size="caption" tabular color={done ? palette.text3 : palette.text2} {...(done ? { strikethrough: true } : {})} {...(opens ? { hover: { underline: true } } : picking ? { hover: numberPickHover(id, palette) } : {})}>{numberLabel(id, pickIt !== undefined)}</Text>
        )}
        {opens && hitOnce(`num:${id}`, opens, 1)}
        {picking && Svg ? (
          // Le bouton sans encre qui choisit, calé à droite comme le numéro ; son survol allume le numéro (même portée).
          <Box position="absolute" top={0} bottom={0} left={0} right={0} flexDirection="row" justifyContent="flex-end" alignItems="center">
            <Button key={`pick:${id}`} plain hover={{ scope: numberPickHover(id, palette).scope }} onPress={picking.press}>
              {CHECK_OVERLAY}
            </Button>
          </Box>
        ) : null}
      </Box>
    )
  }
  // `rows` : la hauteur de la zone en lignes de texte (20 px). Sans elle, la zone prend la hauteur
  // de ce qu'elle couvre — sous une ligne (une icône de 16 px), elle tombait à zéro et ne
  // recevait aucun clic (2026-10-23).
  // Le refus d'une ouverture (#349), dit sous la rangée cliquée (`openAt` vaut sa clé) et non plus en bas de la fiche.
  const noteUnder = (at: string) =>
    openAt === at && openNote !== '' ? (
      <Text key={`open-note:${at}`} size="caption" color={palette.lateOn} wrap="wrap">
        {openNote}
      </Text>
    ) : null
  const hit = (id: string, onPress: () => void, rows?: number) => (firstZone(id) ? hitOnce(id, onPress, rows) : null)
  // `hit` sans le contrôle du doublon, pour qui l'a déjà fait (`taskNumber`).
  const hitOnce = (id: string, onPress: () => void, rows?: number) => {
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
  // La couleur choisie d'un axe (#286, `axes` de la config), sinon la première libre dans l'ordre.
  const ranks = axisPalette(order, source.axes)
  const axisHex = (a: string): string => axisColor(palette, ranks.get(a) ?? 0)
  const axisTheme = (a: string): string => AXIS_THEME[(ranks.get(a) ?? 0) % AXIS_THEME.length] ?? 'subtle'
  // Le nom affiché d'un axe (#286) : son libellé choisi, sinon l'axe à majuscule.
  const axisShown = (a: string): string => axisName(a, source.axes)
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

  // --- La fiche d'une tâche (#142) : celle de la session, ou celle du clic ---------
  // Sa tâche introuvable, la session a vu l'alerte plus haut (#213).
  const ownTask = focusBrand ? allTasks.find(t => t.id === focusBrand.id) : undefined
  const inSession = ownTask !== undefined
  const current = ownTask ?? findSelected([...openTasks, ...doneTasks], selected)
  if (current) {
    // Une mère à étapes ouvertes (#198) : « Marquer faite » la clôt avec elles, « Tout clore » (#163),
    // depuis que son carré, qui porte sa flèche, ne fait que la replier.
    const kidsOpen = current.id && !current.done ? openTasks.filter(t => t.parent === current.id && t.id !== current.id).length : 0
    const closeAll = () => void setView($, () => ({ cancelAsk: '', cancelNote: '' })).then(() => closeFamily($, source, current))
    // Dans sa session : le dossier, la branche et son écart, lus hors de la roadmap.
    const facts = inSession && ownBrand ? await readFocusFacts($, ownBrand.data.source, current, ownBrand.data.own.id, now) : undefined
    // Son dossier (Spec, Plan, Maquettes) et le récap de fin de sa session (#144), dans les deux contextes.
    const ficheSource = inSession && ownBrand ? ownBrand.data.source : source
    const docs = await readFicheDocs($, ficheSource, current, now)
    const mockupPage = await readMockupPage($, ficheSource, current, now)
    const mockupOpened = await read($, mockupOpenAtom)
    const attachments = await readAttachments($, ficheSource, current, now)
    const deliverables = await readAttachments($, ficheSource, current, now, 'livrable')
    const draft = await readDraft($, deliverables)
    const unsentNow = current.done ? undefined : await unsentClose($, ficheSource, current)
    const noteForLinks = current.done ? livreOfNote(current.note).rest : current.note
    const fileHits = await readLinks($, ficheSource, [current.attend, noteForLinks, current.src], now)
    const storedRecap = current.id ? recapOf(await $.store.get(recapKey(ficheSource.name, current.id)).catch(() => undefined)) : undefined
    // #307 (maquette A) : la Mission garde la demande ; le récap de fin ouvre la carte Fin.
    const frame = missionFrame(current.label)
    const storedChanges = current.id ? changesOf(await $.store.get(changesKey(ficheSource.name, current.id)).catch(() => undefined)) : undefined
    // Le relevé des temps de sa session (#314) : la durée d'une close et où elle est passée.
    const storedTiming = current.done && current.id ? timingOf(await $.store.get(timingKey(ficheSource.name, current.id)).catch(() => undefined)) : undefined
    // Ce qu'on va lancer (#341, C1) : les phrases simples qu'a écrites Claude en ouvrant la ligne.
    const storedPitch = !current.done && current.id ? pitchOf(await $.store.get(pitchKey(ficheSource.name, current.id)).catch(() => undefined)) : undefined
    // Le morceau « livré : … » de la note d'une close va dans la carte Fin (#150) ; le reste de la note reste.
    const noteShown = current.done ? livreOfNote(current.note).rest : current.note
    // #278 : un projet en `mission: puces` montre le libellé un fait par puce (maquette A de Caroline) ;
    // un libellé sans « ; » qui coupe reste une phrase.
    const bulleted = !frame.recap && projectSettings(ficheSource).mission === 'puces' ? missionBullets(frame.text) : undefined
    // La mission toujours dépliée, son texte entier (#352, maquette A3 de BBR) : plus de coupe en signes (#146)
    // ni de fondu (#205) ; seul le récap garde son lien vers la ligne de la roadmap.
    const missionShown = missionOpen === current.key
    const toggleMission = () => void setView($, v => ({ missionOpen: v.missionOpen === current.key ? '' : current.key }))
    const s = short(current)
    const days = age(current)
    const line = Number(current.key.split(':').pop())
    // La fiche et la source ne s'ouvrent que si ce sont des documents du projet (#343, `srcFile`) : jamais un
    // programme, un chemin absolu ni un chemin qui sort du dossier par `..`.
    const fichePath = srcFile(current.fiche) ? `${source.dir}/${current.fiche!.trim()}` : undefined
    const srcPath = srcFile(current.src) ? `${source.dir}/${current.src!.trim()}` : undefined
    const due = current.due && !current.done ? dueLabel(current.due, today) : undefined
    const live = liveOf(current)
    const kept = doneSessionOf(current)
    // Close, sa session archivée (#206, #302) : l'icône d'archive dans la bande d'état, une confirmation
    // avant de désarchiver ; une recherche en panne se dit sous la bande.
    const sessionLook = !kept ? taskSessionOf($, source, current, now) : undefined
    const reopenRow = sessionLook?.row?.isArchived ? sessionLook.row : undefined
    const sessionFail = sessionLook?.fail
    const reopenAsking = reopenRow !== undefined && reopenAsk === taskKey(current)
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
    const unlocks = unlocksOf(current, allTasks, prereqsFor)
    // Sa place dans sa chaîne d'ouvertes : « étape 2 sur 4 ».
    const openSet = new Set(openTasks)
    const head = current.done ? current : chainHead(current, prereqFor, openSet)
    const chain = current.done ? [] : [head, ...unlockedBy(head, openTasks, prereqFor)]
    const steps = chain.length > 1 ? chainSteps(sortTasks(chain, sortOrder), prereqFor) : new Map<Task, ChainStep>()
    const stepOf = steps.get(current)
    const lastStep = Math.max(0, ...[...steps.values()].map(x => x.step))
    // L'état d'une close en étiquette, la forme de « en session » (#207) : « Done » violette et sa coche (#254),
    // « annulée » grise et son cercle barré ; dans la Chaîne comme dans les Détails.
    const donePill = (x: Task) =>
      isAbandoned(x)
        ? drawnPill({ text: 'annulée', bg: palette.sel, fg: palette.text2, mark: 'cancel', height: SIZE.pill.detail })
        : drawnPill({ text: stateBand({ state: 'done' }).word, bg: palette.finishedTint, fg: palette.finishedOn, mark: 'check', height: SIZE.pill.detail })
    // Un lien vers une tâche enchaînée : carré d'axe, titre (cliquable), et son état. Le titre rétrécit et
    // se coupe, l'état garde sa largeur : un titre long poussait la carte hors du panneau (#173).
    // `here` : la tâche de la fiche elle-même, en gras et sans lien (#246) ; `end` : ce qui remplace l'état au bout.
    const link = (x: Task, o: { here?: boolean; strong?: boolean; end?: RenderElement } = {}) => (
      <Box key={`link-row:${x.key}`} flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={1} minWidth={0}>
        {icon(squareIcon(axisHex(x.axis)), x.axis, 16, '■', axisTheme(x.axis))}
        {x.id && taskNumber(x.id)}
        <Box key={`link-title:${x.key}`} flexShrink={1} minWidth={0}>
          {/* Chez un enfant de Maestro, le titre se lit sans mener à sa fiche (#233). */}
          {o.here || (inSession && child) ? (
            <Text wrap="truncate-end" {...(o.here || o.strong ? { weight: 'semibold' as const } : {})}>{short(x).titre}</Text>
          ) : (
            <Button key={`link:${x.key}`} plain hover={{ underline: true }} onPress={select(selectionOf(x))}>
              <Text wrap="truncate-end" {...(o.strong ? { weight: 'semibold' as const } : {})}>{short(x).titre}</Text>
            </Button>
          )}
        </Box>
        <Box key={`link-state:${x.key}`} flexShrink={0} flexDirection="row" alignItems="center" gap={SPACE.row}>
          {o.end ??
            (x.done
              ? donePill(x)
              : isLive(x)
                ? drawnPill({ text: 'en session', bg: palette.liveTint, fg: palette.liveOn, mark: 'spinner', height: SIZE.pill.detail })
                : drawnPill({ text: 'à faire', bg: palette.sel, fg: palette.text2, height: SIZE.pill.detail, weight: TEXT.weight.soft }))}
        </Box>
      </Box>
    )
    // Sa place parmi ses sœurs (#246, maquette B) : la mère, la jauge, « ici · 3e sur 6 » ; rien pour une tâche seule.
    const sisters = chainOf(current, allTasks, { isLive, prereqsOf: prereqsFor })
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
    // Un cadre coupé (#205, maquette A et choix de BBR) : le texte entier dans une Box de quatre lignes qui cache
    // la suite, un dégradé de la couleur du cadre sur la dernière, la flèche nette au bout de celle-ci, posés
    // après le texte (le kit n'a pas de zIndex : ce qui couvre vient en dernier). Ouvert : le texte entier, la
    // flèche vers le haut à droite, sur sa ligne. `arrow` faux : le fondu sans flèche (une autre cellule la porte).
    const foldArrow = (id: string, up: boolean, bg: string, onPress: () => void) =>
      Svg && (
        <Box key={`hit:${id}`} flexDirection="row" flexShrink={0}>
          <Svg source={foldArrowIcon({ fg: palette.text2, bg, up })} alt={up ? 'Replier' : 'Tout voir'} width={40} height={20} />
          {hit(id, onPress, 1)}
        </Box>
      )
    const fadeClip = (id: string, body: RenderElement, bg: string, onPress: () => void, arrow = true) => (
      <Box key={`clip:${id}`} flexDirection="column" height={4} overflow="hidden" flexShrink={0}>
        {body}
        {Svg && (
          <Box position="absolute" bottom={0} left={0} right={0}>
            <Svg source={fadeIcon(bg, fullWidth((e.props as { bodyColumns?: number }).bodyColumns ?? 48))} alt="fondu" height={30} />
          </Box>
        )}
        {arrow && (
          <Box position="absolute" bottom={0} right={0}>
            {foldArrow(id, false, bg, onPress)}
          </Box>
        )}
      </Box>
    )
    const foldedRow = (id: string, up: boolean, bg: string, onPress: () => void) => (
      <Box flexDirection="row" justifyContent="flex-end">
        {foldArrow(id, up, bg, onPress)}
      </Box>
    )
    // La mission en puces (#278, maquette A, choix de BBR) : la mission en gras, puis un fait par puce, sa date
    // à droite en gris ; au-delà de six, les cinq dernières, « N plus anciennes » au-dessus les ouvre.
    const missionList = (b: NonNullable<ReturnType<typeof missionBullets>>) => {
      const shown = missionVisible(b.items, missionShown)
      const start = b.items.length - shown.items.length
      const foldable = b.items.length > MISSION_FOLD.over
      return (
        <Box key="mission-bullets" flexDirection="column" gap={SPACE.tight}>
          <Text weight="semibold" wrap="wrap">{b.mission}</Text>
          {!editing && foldable && moreLink('mission-line', missionShown ? 'Replier' : `${shown.hidden} plus anciennes`, toggleMission)}
          {shown.items.map((item, i) => (
            <Box key={`mission-bullet:${start + i}`} flexDirection="row" gap={SPACE.row}>
              <Text color={palette.text2}>•</Text>
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                <Text wrap="wrap">{item.text}</Text>
              </Box>
              {item.date && <Text size="caption" color={palette.text3}>{item.date}</Text>}
            </Box>
          ))}
        </Box>
      )
    }
    // Le filet au-dessus de chaque ligne d'une carte (#199, maquette A), comme dans la carte Fin (#183).
    const rule = ruleIcon(palette.border, fullWidth((e.props as { bodyColumns?: number }).bodyColumns ?? 48))
    const ruleAbove = Svg ? <Svg source={rule} alt="séparateur" height={1} /> : null
    // Une carte de la fiche (#199, maquette A) : un cadre fin ; sa tête, le chevron, le titre, le résumé à
    // droite, se clique pour la replier ou la déplier. Repliée par son nom, pour toutes les tâches ; en
    // édition, toutes dépliées. Au terminal, la tête est un bouton de l'app.
    // Une Done ouvre ses Étapes repliées (#210) ; un choix fait à la main l'emporte.
    const folded = (id: string) => !editing && cardFolded(id, { foldedCards, openedCards }, current.done)
    const toggleCard = (id: string) => () => void setView($, v => toggleFold(id, v, current.done))
    const card = (id: string, name: string, summary: string, body: RenderElement, o: { before?: RenderElement | false | null; after?: RenderElement | false | null } = {}) => {
      const closed = folded(id)
      const head =
        graphic && Client && Svg ? (
          <Box key={`hit:card:${id}`} flexDirection="row" alignItems="center" gap={SPACE.row} hover={{ backgroundColor: palette.hover }}>
            {strut(SIZE.strut.row)}
            <Svg source={chevronIcon(palette.text2, !closed, SIZE.icon.sm)} alt={closed ? 'replié' : 'déplié'} width={SIZE.icon.sm} height={SIZE.icon.sm} />
            {o.before}
            <Text size="footnote" weight="semibold" color={palette.text2}>{name}</Text>
            {o.after}
            <Box flexGrow={1} flexShrink={1} minWidth={0} flexDirection="row" justifyContent="flex-end">
              {summary !== '' && <Text size="caption" color={palette.text3} wrap="truncate-end">{summary}</Text>}
            </Box>
            {hit(`card:${id}`, toggleCard(id))}
          </Box>
        ) : (
          <Button key={`card:${id}`} plain onPress={toggleCard(id)}>
            <Text>{closed ? '▸ ' : '▾ '}</Text>
            <Text weight="semibold">{name}</Text>
            {summary !== '' && <Text dimColor>{` · ${summary}`}</Text>}
          </Button>
        )
      return (
        <Box key={`card-box:${id}`} paddingX={SPACE.indent}>
          <Box key={`card-frame:${id}`} flexDirection="column" gap={SPACE.tight} paddingX={SPACE.indent} paddingY="xs" flexGrow={1} flexShrink={1} minWidth={0} borderStyle="round" borderColor={palette.border}>
            {head}
            {!closed && body}
          </Box>
        </Box>
      )
    }
    // Un champ : son nom sur 10 unités, la valeur à côté, un filet au-dessus ; absent, rien.
    const field = (name: string, value: RenderElement | undefined | false, key = name) =>
      value ? (
        <Box key={`field:${key}`} flexDirection="column">
          {ruleAbove}
          <Box key={`field-row:${key}`} flexDirection="row" alignItems="center">
            <Box width={10} flexShrink={0} flexDirection="row" alignItems="center">
              {strut(SIZE.strut.field)}
              <Text color={palette.text2}>{name}</Text>
            </Box>
            <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={1} minWidth={0}>
              {value}
            </Box>
          </Box>
        </Box>
      ) : null
    const plain = (text: string | undefined) => text !== undefined && text !== '' && <Text wrap="truncate-end">{text}</Text>
    const strong = (text: string) => <Text weight="semibold" tabular>{text}</Text>
    // La carte Chaîne d'une fille (#259, maquette A choisie par BBR) : l'arbre de la liste, à la ligne de la vue
    // de référence (#258). La mère : sa flèche grise, son # serré, son titre en gras et sa jauge juste après ;
    // ses sœurs dans l'ordre de la liste (#238), leur coude, leur carré sous le # de la mère, au bout leur
    // retard seul, leur prérequise ou « fait » ; la ligne de la fiche surlignée. Avant et Ensuite ne gardent que
    // les tâches hors des sœurs ; puis ses sous-tâches. Plus de jauge de cases ni de « Les 6 sœurs » (#246).
    const sisterCard = (c: NonNullable<typeof sisters>) => {
      const kin = new Set<Task>([c.mother, ...c.sisters.map(x => x.task)])
      const missing = missingPrereqs(current, allTasks)
      const before = prereqsFor(current).filter(x => !kin.has(x))
      const after = unlocks.filter(x => !kin.has(x))
      const treeLine = (x: Task, o: { mother?: boolean; last?: boolean }) => {
        const here = x === current
        const square = x.done ? squareCheckRowIcon(axisHex(x.axis), palette.onAxis) : squareRowIcon(axisHex(x.axis))
        const mark = o.mother ? treeMotherRowIcon(axisHex(x.axis), true, palette.text2) : treeChildRowIcon(square, o.last === true, palette.border)
        const blocker = x.done || o.mother ? undefined : blockerFor(x)
        const due = !x.done && !o.mother && blocker === undefined && x.due !== undefined ? duePill(x.due, today, { short: true }) : undefined
        const end = x.done ? (isAbandoned(x) ? 'annulée' : 'fait') : blocker?.pre ? `${blocker.parent ? 'parent ' : ''}après ${blocker.pre.id ? `#${blocker.pre.id}` : short(blocker.pre).titre}` : undefined
        const strong = o.mother || here
        const title = <Text wrap="truncate-end" {...(strong ? { weight: 'semibold' as const } : {})} {...(x.done ? { strikethrough: true, color: palette.text3 } : {})}>{short(x).titre}</Text>
        return (
          <Box key={`chain-row:${x.key}`} flexDirection="row" alignItems="center" gap={SPACE.row} {...(here ? { backgroundColor: palette.sel } : {})}>
            <Box flexShrink={0}>
              {Svg ? (
                <Svg source={x.done ? fade(mark, true) : mark} alt={o.mother ? 'mère' : x.done ? 'faite' : x.axis} width={o.mother ? TREE_MARK_PX : TREE_CHILD_PX} height={24} />
              ) : (
                <Text color={palette.text3}>{o.mother ? '⌄' : o.last ? '└' : '├'}</Text>
              )}
            </Box>
            {x.id && taskNumber(x.id, undefined, x.done)}
            <Box key={`chain-lead:${x.key}`} flexDirection="row" alignItems="center" flexGrow={1} flexShrink={1} minWidth={0}>
              {/* Chez un enfant de Maestro, le titre se lit sans mener à sa fiche (#233). */}
              {here || (inSession && child) ? title : (
                <Button key={`link:${x.key}`} plain hover={{ underline: true }} onPress={select(selectionOf(x))}>
                  {title}
                </Button>
              )}
              {o.mother && (
                <Box key={`chain-gauge:${x.key}`} flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0} paddingLeft={SPACE.row}>
                  {Svg ? <Svg source={progressIcon(c.done, c.total, palette.ok, palette.sel)} alt={`${c.done}/${c.total}`} width={34} height={SIZE.bar} /> : null}
                  <Text size="caption" tabular color={palette.text2}>{`${c.done}/${c.total}`}</Text>
                </Box>
              )}
            </Box>
            {due && (
              <Box key={`chain-due:${x.key}`} flexShrink={0}>
                <Text size="caption" tabular color={dueInk(due.kind, palette)} wrap="end">{due.text}</Text>
              </Box>
            )}
            {end !== undefined && (
              <Box key={`chain-end:${x.key}`} flexShrink={0}>
                <Text size="caption" color={x.done ? palette.text3 : palette.text2} wrap="end">{end}</Text>
              </Box>
            )}
          </Box>
        )
      }
      return (
        <Box flexDirection="column">
          {treeLine(c.mother, { mother: true })}
          {c.sisters.map(({ task: x }, i) => treeLine(x, { last: i === c.sisters.length - 1 }))}
          {before.map((x, i) => field(i === 0 ? 'Avant' : '', link(x), `Avant:${x.key}`))}
          {missing.map((n, i) => field(i === 0 && before.length === 0 ? 'Avant' : '', plain(`#${n} introuvable`), `Avant:#${n}`))}
          {after.map((d, i) => field(i === 0 ? 'Ensuite' : '', link(d), `Ensuite:${d.key}`))}
          {allTasks
            .filter(x => x !== current && current.id !== undefined && x.parent === current.id)
            .map((x, i) => field(i === 0 ? 'Sous-tâches' : '', link(x), `Sous-tâches:${x.key}`))}
        </Box>
      )
    }
    // La carte Fin (#150, maquette C) : la Conclusion (#264) et le récap de fin de sa session (#144) fondus,
    // tirés de la roadmap et du bilan quand la session n'a pas gardé sa fiche de fin.
    const bilan = current.done && current.id ? bilanData.bilans.get(current.id) : undefined
    const conclusionDue = current.done && current.id !== undefined && (current.fait ?? '').slice(0, 10) >= bilanData.config.depuis
    const fin = finCard({ ...(storedRecap ? { recap: storedRecap } : {}), task: current, ...(bilan ? { bilan } : {}), due: conclusionDue })
    const duration = storedTiming ? durationView(storedTiming, current.fait) : undefined
    const finValue = (r: { tone?: string }, md: string) =>
      r.tone === 'ok' ? <Text wrap="wrap" color={palette.ok}>{md}</Text> : <Markdown text={codeKeptWhole(md)} {...(r.tone === 'dim' ? { dimColor: true } : {})} />
    const finBox = (): RenderElement | null => {
      if (!fin) return null
      const opened = conclusionOpen === current.key
      // Le Fait, le Souci et la version livrée sont dans le carton (#291) : la carte Fin ne les redit pas.
      // #341 (A2) : la carte Bilan s'ouvre sur ce qui a accroché, « À essayer » suit ; close, ni État ni Fait.
      const own = bilanRows(fin.rows, { done: current.done }).filter(r => editing || !cartonFin.has(r.name))
      // « Ce qu'on a fait » d'une close est dans le carton.
      const recapHere = fin.recap && !current.done ? fin.recap : undefined
      // Une conclusion réclamée garde sa carte, ne serait-ce que pour sa pastille.
      if (own.length === 0 && fin.more.length === 0 && !recapHere && !fin.missing) return null
      const shown = [...own, ...(opened ? fin.more : [])].map(r => ({ ...r, fold: opened ? { md: r.md, cut: false } : foldCell(r.md) }))
      const canOpen = fin.more.length > 0 || shown.some(r => r.fold.cut)
      // Sur le bureau, une cellule longue garde son texte entier sous le fondu (#205), la flèche au bout de la
      // dernière si elle est coupée, sinon sur sa ligne sous le tableau ; au terminal, la coupe en signes.
      const fades = graphic && Client !== undefined && Svg !== undefined
      const toggleFin = () => void setView($, v => ({ conclusionOpen: v.conclusionOpen === current.key ? '' : current.key }))
      const lastCut = fades && !opened && shown.length > 0 && shown[shown.length - 1]!.fold.cut
      const tone =
        fin.ressenti === 'fluide'
          ? { bg: mixOver(palette.ok, palette.bg, MIX.smooth), fg: palette.ok }
          : fin.ressenti === 'bloqué'
            ? { bg: palette.lateTint, fg: palette.lateOn }
            : { bg: palette.sel, fg: palette.text }
      return card(
        'fin',
        'Bilan',
        fin.when,
        <Box flexDirection="column" gap={SPACE.tight}>
          {/* Le « Ce qu'on a fait » de la conclusion en tête, au-dessus du tableau (#307, maquette A). */}
          {recapHere && (
            <Box key="fin-recap" flexDirection="column">
              <Markdown text={codeKeptWhole(`**Ce qu'on a fait.** ${recapHere}`)} />
            </Box>
          )}
          {/* Le tableau : la colonne d'étiquettes des champs de la carte Détails, sans écart de plus, pour que
              les valeurs des deux cartes commencent au même endroit (#183) ; un filet au-dessus de chaque ligne (#199). */}
          {shown.map(r => (
            <Box key={`fin:${r.name}`} flexDirection="column" gap={SPACE.tight}>
              {ruleAbove}
              <Box key={`fin-row:${r.name}`} flexDirection="row">
                <Box width={10} flexShrink={0}>
                  <Text color={palette.text2}>{r.name}</Text>
                </Box>
                <Box flexShrink={1} minWidth={0} flexGrow={1}>
                  {fades && r.fold.cut
                    ? fadeClip(`fin:${r.name}`, finValue(r, r.md), palette.bg, toggleFin, lastCut && r === shown[shown.length - 1])
                    : finValue(r, r.fold.md)}
                </Box>
              </Box>
            </Box>
          ))}
          {canOpen && !fades && moreLink('fin', opened ? 'Replier' : 'Tout voir', toggleFin)}
          {canOpen && fades && !lastCut && foldedRow('fin', opened, palette.bg, toggleFin)}
        </Box>,
        {
          before: fin.emoji && <Text>{fin.emoji}</Text>,
          after: (
            <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
              {fin.ressenti && drawnPill({ text: fin.ressenti, ...tone, height: SIZE.pill.detail, weight: TEXT.weight.soft })}
              {fin.missing && drawnPill({ text: 'conclusion manquante', bg: palette.lateTint, fg: palette.lateOn, height: SIZE.pill.detail, weight: TEXT.weight.soft })}
            </Box>
          ),
        },
      )
    }
    // La carte « Ce qui a changé » (#269, maquette A) : la demande citée (mots de `src:`), puis une rangée par
    // zone, son point vert, son nom, ses fichiers et la phrase de la session ; quatre zones, le reste déplié.
    const changesShown = view.changesOpen === current.key
    const changes = changesCard(storedChanges, { done: current.done, open: changesShown })
    const toggleChanges = () => void setView($, v => ({ changesOpen: v.changesOpen === current.key ? '' : current.key }))
    const changesBox = (): RenderElement | null => {
      if (!changes) return null
      const asked = askedOf(current.src)
      const folds = changesShown && changes.shown.length > 4
      return card(
        'changes',
        'Ce qui a changé',
        changes.summary,
        <Box key="changes-body" flexDirection="column" gap={SPACE.tight}>
          {asked && <Text size="footnote" color={palette.text2} wrap="wrap">{asked}</Text>}
          {changes.shown.map(z => (
            <Box key={`changes-zone:${keyPart(z.name)}`} flexDirection="column">
              {ruleAbove}
              <Box flexDirection="row" alignItems="center" gap={SPACE.row} minWidth={0}>
                {strut(SIZE.strut.row)}
                <Text size="caption" color={z.why ? palette.ok : palette.text3}>●</Text>
                <Text weight="semibold">{z.name}</Text>
                {z.files.length > 0 && (
                  <Box flexShrink={1} minWidth={0}>
                    <Text size="caption" color={palette.text3} wrap="truncate-end">{z.files.join(', ')}</Text>
                  </Box>
                )}
              </Box>
              {z.why && <Text size="footnote" color={palette.text2} wrap="wrap">{z.why}</Text>}
            </Box>
          ))}
          {changes.more > 0 && moreLink('changes-more', `${changes.more} autre${changes.more > 1 ? 's' : ''} zone${changes.more > 1 ? 's' : ''}`, toggleChanges)}
          {folds && moreLink('changes-more', 'Replier', toggleChanges)}
        </Box>,
      )
    }
    const mono = (text: string | undefined) =>
      text !== undefined && text !== '' && (
        <Text mono size="caption" color={palette.text2} wrap="wrap">
          {text}
        </Text>
      )
    // Un texte libre de la ligne (`attend:`, note, `src:`) dont les chemins de fichiers du projet trouvés
    // s'écrivent par leur seul nom, en lien qui ouvre le fichier (#234, choix de BBR) ; sans chemin trouvé, le texte tel quel.
    type TextLook = { mono?: boolean; size?: 'caption'; color: string }
    const linked = (where: string, text: string, look: TextLook) => {
      const parts = fileLinks(text)
      const plainText = (t: string, key: string) => (
        <Text key={key} {...(look.mono ? { mono: true } : {})} {...(look.size ? { size: look.size } : {})} color={look.color} wrap="wrap">
          {t}
        </Text>
      )
      if (!parts.some(x => 'path' in x && fileHits.has(x.path))) return plainText(text, `text:${where}`)
      return (
        <Box key={`linked:${where}`} flexDirection="row" flexWrap="wrap" flexShrink={1} minWidth={0}>
          {parts.map((x, i) => {
            const path = 'path' in x ? fileHits.get(x.path) : undefined
            if (!('path' in x)) return x.text.trim() === '' ? null : plainText(x.text, `text:${where}:${i}`)
            if (path === undefined) return plainText(x.path, `text:${where}:${i}`)
            const id = `lien:${where}:${path}`
            return graphic && Client ? (
              <Box key={`link:${where}:${i}`} flexShrink={1} minWidth={0} hover={{ backgroundColor: palette.hover }}>
                <Text {...(look.size ? { size: look.size } : {})} color={palette.mine} wrap="truncate-end">{x.name}</Text>
                {hit(id, () => void openFile($, ficheSource, path), 1)}
              </Box>
            ) : (
              <Button key={`link:${where}:${i}`} plain label={x.name} onPress={() => void openFile($, ficheSource, path)} />
            )
          })}
        </Box>
      )
    }
    // Un bouton dessiné (Box et Svg), recouvert d'une zone de clic : un bouton de l'app ne porte
    // que du texte et ne s'étire pas. Au terminal, sans Svg, le bouton de l'app.
    const pressable = (id: string, onPress: () => void, look: RenderElement, fallback: RenderElement, grow = false) => {
      if (!Client || !Svg || !firstZone(id)) return fallback
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
    // l'entoure pour ses coins. L'encart de confirmation ouvert, son « Confirmer » est le seul plein :
    // le bouton plein passe en texte gris le temps de répondre (#256, maquette A).
    const primary = (
      id: string,
      mark: string,
      label: string,
      onPress: () => void,
      tone: { bg: string; fg: string; around: string } = { bg: palette.pri, fg: palette.priText, around: palette.bg },
    ) =>
      asking && !current.done ? (
        <Button key={id} plain dimColor label={label} onPress={onPress} />
      ) : pressable(
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
    // `small` : le bouton d'une ligne de texte, 24 px et une icône de 14 px, comme le crayon de la fiche (#193).
    // `small` : 24 px (le crayon) ; `chip` : 20 px, la hauteur d'une pastille, pour un bouton posé dans une
    // ligne de champ sans la grandir (#208, maquette B : les boutons de la ligne Fichiers).
    const action = (key: string, mark: string, label: string, onPress: () => void, scope?: string, small: boolean | 'chip' = false) => {
      const chip = small === 'chip'
      const iconSize = chip ? SIZE.icon.chip : small ? SIZE.icon.sm : SIZE.icon.md
      return pressable(
        key,
        onPress,
        <Box
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          paddingX={chip ? SPACE.tight : SPACE.indent}
          backgroundColor={palette.btn}
          hover={{ backgroundColor: palette.btnHover, ...(scope ? { scope } : {}) }}
        >
          {corners(chip ? RADIUS.chip : RADIUS.control, palette.bg)}
          {strut(chip ? SIZE.strut.chip : small ? SIZE.strut.row : SIZE.strut.control)}
          {Svg && <Svg source={mark} alt={label} width={iconSize} height={iconSize} />}
        </Box>,
        <Button key={key} plain label={label} onPress={onPress} />,
      )
    }
    // L'icône d'archive de la bande d'état (#302, maquette A, choix de BBR) : la boîte à flèche montante
    // seule, au filet de la bande ; armée, au filet orange. Un clic ouvre ou referme la confirmation, il ne
    // désarchive pas. Au terminal, un bouton à mot.
    const reopenArm = (fg: string) => {
      const press = () => void askReopen($, taskKey(current))
      const tone = reopenAsking ? palette.block : fg
      return pressable(
        'reopen-arm',
        press,
        // Une Box à filet pose son paddingY, 0 compris : sinon la marge d'office du bureau en fait une pilule
        // haute qui déborde de la bande (#352 ; capture de BBR au test de #341 en 0.232.0).
        <Box flexDirection="row" alignItems="center" paddingX={SPACE.tight} paddingY={0} borderStyle="round" borderColor={tone}>
          {strut(SIZE.strut.row)}
          {Svg && <Svg source={unarchiveIcon(reopenAsking ? palette.blockOn : fg, SIZE.icon.sm)} alt="Désarchiver la session" width={SIZE.icon.sm} height={SIZE.icon.sm} />}
        </Box>,
        <Button key="reopen-arm" plain label="Désarchiver la session" onPress={press} />,
      )
    }
    // La confirmation (#302) : l'encart du rond (#184), filet orange arrondi sur le fond du panneau, la
    // question en orange, le détail en gris ; « Désarchiver et ouvrir » désarchive puis ouvre, « Annuler »
    // referme (un clic ailleurs aussi).
    const reopenConfirm = (row: TaskSessionRow) => {
      const confirm = () => void reopenSession($, source, current, row, now)
      const cancel = () => void askReopen($, taskKey(current))
      return (
        <Box key="reopen-confirm" flexDirection="column" gap={SPACE.block} padding="sm" flexGrow={1} borderStyle="round" borderColor={palette.block}>
          <Text weight="semibold" color={palette.blockOn} wrap="wrap">{`Attention\u00a0: désarchiver la session de #${current.id}\u00a0?`}</Text>
          <Text size="caption" color={palette.text2} wrap="wrap">{`« ${row.title} » revient dans la liste de l'app et s'ouvre, avec tout son historique.`}</Text>
          <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
            {pressable(
              'reopen-session',
              confirm,
              <Box flexDirection="row" alignItems="center" paddingX={SPACE.indent} backgroundColor={palette.pri}>
                {corners(RADIUS.control, palette.bg)}
                {strut(SIZE.strut.row)}
                <Text weight="semibold" color={palette.priText}>Désarchiver et ouvrir</Text>
              </Box>,
              <Button key="reopen-session" variant="primary" label="Désarchiver et ouvrir" onPress={confirm} />,
            )}
            <Button key="reopen-cancel" plain dimColor label="Annuler" onPress={cancel} />
          </Box>
        </Box>
      )
    }
    // Le bloc Brouillon (#236, maquette A1 « L'enveloppe », choix de BBR) : sous la bande d'état, le plus
    // récent des livrables texte. Un bandeau teinté (tuile, mot, fraîcheur) qui replie le bloc au clic ;
    // l'objet, puis une ligne par champ (À, Cc, Cci, PJ en jetons qui ouvrent le fichier : maquette B1 de
    // #264, sans filet), le corps coupé à puces « • » en retrait pendant, sa dernière ligne grise ;
    // « Ouvrir », « Voir tout · +N lignes », le statut. Au terminal, du texte et des boutons.
    const draftBlock = () => {
      if (!draft || editing) return null
      const p = draft.preview
      const key = current.key
      const folded = draftFolded === key
      const opened = draftOpen === key
      const sent = p?.status?.tone === 'sent'
      const label = sent ? 'Envoyé' : current.done ? 'Livrable' : p?.kind === 'email' ? 'Brouillon à relire' : 'Brouillon'
      const ago = now - draft.mtime
      const fresh = `à jour · ${ago < 60_000 ? "à l'instant" : `il y a ${durationLabel(ago)}`}`
      const openIt = () => void openFile($, ficheSource, draft.path, { at: 'brouillon:ouvrir' })
      const toggleOpen = () => void setView($, v => ({ draftOpen: v.draftOpen === key ? '' : key }))
      const toggleFold = () => void setView($, v => ({ draftFolded: v.draftFolded === key ? '' : key }))
      const lines = p ? (opened ? p.body : p.short).split('\n') : []
      const dimLast = !opened && (p?.more ?? 0) > 0
      const headerRow = (id: string, label: string, value: RenderElement | RenderElement[]) => (
        <Box key={`draft-${id}`} flexDirection="row" gap={SPACE.tight}>
          <Box width={DRAFT_LABEL_CELLS} flexShrink={0}>
            <Text size="footnote" color={palette.text3}>{label}</Text>
          </Box>
          <Box flexDirection="row" flexWrap="wrap" gap={SPACE.tight} flexShrink={1} minWidth={0}>
            {value}
          </Box>
        </Box>
      )
      const people = (
        [
          ['to', 'À', p?.fields.to],
          ['cc', 'Cc', p?.fields.cc],
          ['bcc', 'Cci', p?.fields.bcc],
        ] as const
      ).flatMap(([id, label, value]) =>
        value ? [headerRow(id, label, <Text size="footnote" wrap="wrap" {...(id === 'to' ? {} : { color: palette.text2 })}>{value}</Text>)] : [],
      )
      const files = (p?.attachments ?? []).map((written, i) =>
        pressable(
          `brouillon:pj:${i}`,
          () => void openWritten($, ficheSource, written, `brouillon:pj:${i}`),
          <Box flexDirection="row" alignItems="center" gap={SPACE.tight} paddingX={SPACE.tight} backgroundColor={palette.btn} hover={{ backgroundColor: palette.btnHover }} minWidth={0}>
            {corners(RADIUS.chip, palette.bg)}
            {Svg && <Svg source={documentIcon(palette.text2, SIZE.icon.xs)} alt="pièce jointe" width={SIZE.icon.xs} height={SIZE.icon.xs} />}
            <Text size="caption" wrap="truncate-end">{written.split('/').pop() || written}</Text>
          </Box>,
          <Button key={`brouillon:pj:${i}`} plain label={written.split('/').pop() || written} onPress={() => void openWritten($, ficheSource, written, `brouillon:pj:${i}`)} />,
        ),
      )
      const statusPill = p?.status && (
        <Box key="draft-status" flexDirection="row" alignItems="center" paddingX={SPACE.tight} backgroundColor={sent ? palette.sel : palette.blockTint}>
          {corners(RADIUS.chip, palette.bg)}
          <Text size="caption" weight="semibold" color={sent ? palette.ok : palette.blockOn} wrap="truncate-end">
            {p.status.tone === 'todo' ? 'non envoyé' : sent ? 'envoyé' : p.status.text}
          </Text>
        </Box>
      )
      const button = (id: string, text: string, onPress: () => void, primary: boolean) =>
        pressable(
          id,
          onPress,
          <Box flexDirection="row" alignItems="center" gap={SPACE.tight} paddingX={SPACE.indent} backgroundColor={primary ? palette.pri : palette.btn} hover={{ backgroundColor: primary ? palette.pri : palette.btnHover }}>
            {corners(RADIUS.control, palette.bg)}
            {strut(SIZE.strut.row)}
            {primary && Svg && <Svg source={externalIcon(palette.priText, SIZE.icon.sm)} alt={text} width={SIZE.icon.sm} height={SIZE.icon.sm} />}
            <Text weight="semibold" color={primary ? palette.priText : palette.text}>{text}</Text>
          </Box>,
          <Button key={id} plain label={text} onPress={onPress} />,
        )
      const bodyText = lines.map((l, i) => {
        const dim = dimLast && i === lines.length - 1 ? { color: palette.text3 } : {}
        // Une puce (#264) : « • » à part, le texte qui déborde s'aligne sous le texte, pas sous la puce.
        const bullet = /^(\s*)• (.*)$/.exec(l)
        if (bullet)
          return (
            <Box key={`draft-line:${i}`} flexDirection="row" gap={SPACE.tight} paddingLeft={bullet[1]!.length > 0 ? SPACE.indent : undefined}>
              <Text size="footnote" color={palette.text2}>•</Text>
              <Box flexShrink={1} minWidth={0}>
                <Text size="footnote" wrap="wrap" {...dim}>{bullet[2]!}</Text>
              </Box>
            </Box>
          )
        return (
          <Text key={`draft-line:${i}`} size="footnote" wrap="wrap" {...dim}>
            {l === '' ? ' ' : l}
          </Text>
        )
      })
      return (
        <Box key="draft" paddingX={SPACE.indent}>
          <Box flexDirection="column" flexGrow={1} minWidth={0} borderStyle="round" borderColor={mixOver(palette.live, palette.border, MIX.draftBorder)}>
            <Box key="draft-top" flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent} paddingY="xs" backgroundColor={palette.liveTint}>
              {Svg && <Svg source={envelopeTile(palette.live, palette.onAxis, 24)} alt="brouillon" width={24} height={24} />}
              <Text weight="semibold" color={palette.liveOn}>{label}</Text>
              <Box flexGrow={1} flexShrink={1} minWidth={0} flexDirection="row" justifyContent="flex-end">
                <Text size="caption" color={palette.text2} wrap="truncate-end">{fresh}</Text>
              </Box>
              {hit('brouillon:plier', toggleFold)}
            </Box>
            {!folded && (
              <Box key="draft-body" flexDirection="column" gap={SPACE.block} paddingX={SPACE.indent} paddingY="sm">
                <Text weight="semibold" wrap="wrap">{p?.title ?? draft.name}</Text>
                {(people.length > 0 || files.length > 0) && (
                  <Box key="draft-head" flexDirection="column" gap={SPACE.tight}>
                    {people}
                    {files.length > 0 && headerRow('pj', 'PJ', files)}
                    {(p?.attachments ?? []).map((_, i) => noteUnder(`brouillon:pj:${i}`))}
                  </Box>
                )}
                {draft.tooBig ? (
                  <Text size="footnote" color={palette.text2}>trop long pour l'aperçu</Text>
                ) : p === undefined ? (
                  <Text size="footnote" color={palette.text2}>illisible</Text>
                ) : p.body === '' ? (
                  <Text size="footnote" color={palette.text2}>{p.kind === 'email' ? '(corps vide)' : 'fichier vide'}</Text>
                ) : (
                  <Box key="draft-text" flexDirection="column">
                    {bodyText}
                  </Box>
                )}
                <Box key="draft-actions" flexDirection="row" alignItems="center" gap={SPACE.row} flexWrap="wrap">
                  {button('brouillon:ouvrir', 'Ouvrir', openIt, true)}
                  {p && p.more > 0 && button('brouillon:voir', opened ? 'Réduire' : `Voir tout · +${p.more} lignes`, toggleOpen, false)}
                  <Box flexGrow={1} />
                  {statusPill}
                </Box>
                {noteUnder('brouillon:ouvrir')}
              </Box>
            )}
          </Box>
        </Box>
      )
    }
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
      attachments: attachments.length,
      deliverables: deliverables.length,
      editing,
    })
    // L'état en pastille : celui que Maestro voit dans sa session, celui de la session qui y travaille ailleurs.
    const ownRunning = focusBrand && ownBrand?.data.own.id !== undefined ? runningBySession.get(ownBrand.data.own.id) : undefined
    const waitState: BrandTask['state'] | undefined = current.done
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
    // #191 : à l'arrêt, sans question, sa branche en avance sur sa base : « à fusionner », pas « t'attend ».
    const stepsSession = inSession ? ownBrand?.data.own.id : liveOf(current)?.entry.sessionId
    const stepsNote = await readSteps($, stepsSession)
    if (!inSession) await refreshAhead($, source, [stepsSession], now)
    const aheadNow = stepsSession ? aheadBySession.get(stepsSession)?.ahead : undefined
    const headState: BrandTask['state'] | undefined =
      waitState === 'wait' && stepsNote?.question === undefined && (aheadNow ?? 0) > 0 ? 'merge' : waitState
    const fullBrand = focusBrand ?? taskBrandOf(current, source, allTasks, { label: s.titre, prereqs: prereqsFor })
    // #291 : la voie (stations d'avant et d'après) quitte l'en-tête ; la jauge de chaîne, au pied, la remplace.
    // En édition, l'en-tête garde la sienne : la fiche d'édition ne change pas.
    const { before: _before, next: _next, ...bareBrand } = fullBrand
    const headBrand = editingKey === taskKey(current) && !current.done ? fullBrand : bareBrand
    // Le résumé de la tête de chaque carte, ce qu'elle garde repliée (#199).
    const summaries: Record<FicheCard, string> = {
      avancement: cardSummary('avancement', {
        ...(facts ? { branch: facts.branch } : {}),
        ...(current.attend !== undefined ? { attend: attendWho(current.attend) } : {}),
      }),
      lancer: '',
      chaine: cardSummary('chaine', {
        ...(sisters?.mother.id ? { mother: { id: sisters.mother.id, done: sisters.done, total: sisters.total } } : {}),
        after: prereqsFor(current).flatMap(x => (x.id ? [x.id] : [])),
        unlocks: unlocks.flatMap(x => (x.id ? [x.id] : [])),
        ...(current.parent !== undefined ? { parent: current.parent } : {}),
      }),
      details: cardSummary('details', { details: detailCount }),
      pj: cardSummary('pj', { attachments: attachments.length }),
      livrables: cardSummary('livrables', { deliverables: deliverables.length }),
    }
    const stepsPart = ficheSteps($, e, palette, stepsNote, now, current.done, stepsSession, headState)
    // L'état sous l'en-tête (#199, choix de Bertrand) : une bande teintée, son icône, son mot et pourquoi ;
    // il a quitté la ligne « Tâche lancée par Maestro », où il flottait à droite.
    const band = headState
      ? stateBand({
          state: headState,
          abandoned,
          ...(stepsNote?.question ? { question: stepsNote.question.text } : {}),
          ...(stepsNote?.steps.find(x => x.status === 'in_progress') ? { current: stepsNote.steps.find(x => x.status === 'in_progress')!.content } : {}),
          ...(aheadNow ? { ahead: aheadNow } : {}),
          ...(current.fait ? { fait: current.fait } : {}),
        })
      : undefined
    const stateBox = () => {
      if (!band) return null
      const [bg, fg] = {
        wait: [palette.blockTint, palette.blockOn],
        live: [palette.liveTint, palette.liveOn],
        merge: [palette.waitTint, palette.waitOn],
        done: [palette.finishedTint, palette.finishedOn],
        cancel: [palette.sel, palette.text2],
      }[band.tone]
      const mark =
        band.mark === 'person'
          ? personIcon(fg, SIZE.icon.sm)
          : band.mark === 'merge'
            ? mergeIcon(fg, SIZE.icon.sm)
            : band.mark === 'check'
              ? checkIcon(fg, SIZE.icon.sm, STROKE.pill)
              : band.mark === 'spinner'
                ? spinnerIcon(fg, SIZE.icon.sm, undefined, false, now)
                : undefined
      const row = (
        <Box key="state-band-row" paddingX={SPACE.indent}>
          <Box key="state-band" flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent} flexGrow={1} backgroundColor={bg}>
            {corners(RADIUS.control, palette.bg)}
            {strut(SIZE.strut.field)}
            {Svg && mark && <Svg source={mark} alt={BAND_MARK_WORDS[band.mark!]} width={SIZE.icon.sm} height={SIZE.icon.sm} {...(band.mark === 'spinner' ? { isInteractive: true } : {})} />}
            {band.tone === 'cancel' && <Text color={fg}>⊘</Text>}
            <Text weight="semibold" color={fg}>{band.word}</Text>
            {band.why !== '' && (
              <Box flexShrink={1} minWidth={0}>
                <Text color={palette.text} wrap="truncate-end">{band.why}</Text>
              </Box>
            )}
            {reopenRow && <Box flexGrow={1} />}
            {reopenRow && reopenArm(fg)}
          </Box>
        </Box>
      )
      // Close, sa session archivée (#302) : la confirmation sous la bande ; une recherche en panne s'y dit.
      if (!reopenAsking && !sessionFail) return row
      return (
        <Box key="state-band-wrap" flexDirection="column" gap={SPACE.block}>
          {row}
          {reopenAsking && reopenRow && (
            <Box key="reopen-confirm-row" paddingX={SPACE.indent}>
              {reopenConfirm(reopenRow)}
            </Box>
          )}
          {sessionFail && !reopenRow && (
            <Box key="session-fail-row" paddingX={SPACE.indent}>
              <Text size="caption" color={palette.text2} wrap="wrap">{`Session non retrouvée : ${sessionFail}`}</Text>
            </Box>
          )}
        </Box>
      )
    }
    // Le bouton des maquettes (#306, maquette A plus visible) : une bande bleue sous l'état, « Voir les
    // maquettes » en grand et le nom de la page ; ouverte, grise, « Fermer les maquettes ».
    const mockupBand = () => {
      if (!mockupPage) return null
      const shown = mockupOpened === mockupPage.path
      const word = shown ? 'Fermer les maquettes' : 'Voir les maquettes'
      const press = () => void toggleMockup($, mockupPage.path)
      if (!Svg) {
        return (
          <Box key="mockup-row" paddingX={SPACE.indent}>
            <Button key="mockup-btn" label={`${word} · ${mockupPage.name}`} onPress={press} />
          </Box>
        )
      }
      // #291 (fiche finale) : en gris, pour que seul « Ouvrir la session » soit bleu ; l'icône garde le bleu.
      const fg = shown ? palette.text : palette.liveOn
      return (
        <Box key="mockup-row" paddingX={SPACE.indent}>
          <Box
            key="mockup-band"
            flexDirection="row"
            alignItems="center"
            gap={SPACE.row}
            paddingX={SPACE.indent}
            flexGrow={1}
            minWidth={0}
            backgroundColor={palette.btn}
            hover={{ backgroundColor: palette.btnHover }}
          >
            {corners(RADIUS.control, palette.bg)}
            {strut(SIZE.strut.control)}
            <Svg source={shown ? closeIcon(fg, SIZE.icon.md) : browserIcon(fg, SIZE.icon.md)} alt="" width={SIZE.icon.md} height={SIZE.icon.md} />
            <Text size="footnote" weight="semibold" color={palette.text}>{word}</Text>
            <Box flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-end">
              <Text size="caption" color={palette.text2} wrap="truncate-end">{shown ? 'ouvertes dans le volet' : mockupPage.name}</Text>
            </Box>
            {!shown && <Svg source={externalIcon(fg, SIZE.icon.xs)} alt="" width={SIZE.icon.xs} height={SIZE.icon.xs} />}
            {hit('mockup', press)}
          </Box>
        </Box>
      )
    }
    // Les pièces jointes (#204, maquette B, vignettes plus petites) et les livrables (#234) : les images en
    // vignettes de 48 × 64, un clic les ouvre en grand dans le panneau Fichiers ; dessous, une ligne par autre
    // fichier, un absent grisé (`missing`), sans clic. Au terminal, sans Svg, des boutons.
    const fileCard = (id: 'pj' | 'livrables', title: string, list: Attachment[], missing: string) => {
        const prefix = id === 'pj' ? 'pj' : 'livrable'
        const shown = list.filter(a => a.thumb && a.path && Svg && graphic)
        const rows = list.filter(a => !shown.includes(a))
        const open = (a: Attachment) => () => void openFile($, ficheSource, a.path!, { at: `${prefix}:${a.path}` })
        const kindWord = (a: Attachment) => (a.path === undefined ? missing : a.kind === 'image' ? 'image' : a.kind === 'pdf' ? 'PDF' : 'fichier')
        return card(
          id,
          title,
          summaries[id],
          <Box flexDirection="column">
            {shown.length > 0 && (
              <Box key={`${prefix}-thumbs`} flexDirection="row" flexWrap="wrap" gap={SPACE.row} paddingY="xs">
                {shown.map(a => (
                  <Box key={`${prefix}-thumb:${a.path}`} flexShrink={0} hover={{ backgroundColor: palette.hover }}>
                    <Svg source={a.thumb!} alt={a.name} width={THUMB.width} height={THUMB.height} />
                    {hit(`${prefix}:${a.path}`, open(a))}
                  </Box>
                ))}
              </Box>
            )}
            {shown.map(a => noteUnder(`${prefix}:${a.path}`))}
            {rows.map(a => {
              const tone = a.path ? palette.text2 : palette.text3
              const mark = a.kind === 'image' ? imageIcon(tone, SIZE.icon.sm) : documentIcon(tone, SIZE.icon.sm)
              return (
                <Box key={`${prefix}-row:${a.written}`} flexDirection="column">
                  {ruleAbove}
                  {graphic ? (
                    <Box key={`${prefix}-line:${a.written}`} flexDirection="row" alignItems="center" gap={SPACE.row} {...(a.path ? { hover: { backgroundColor: palette.hover } } : {})}>
                      {strut(SIZE.strut.field)}
                      {icon(mark, kindWord(a), SIZE.icon.sm, '▫', tone)}
                      <Box flexGrow={1} flexShrink={1} minWidth={0}>
                        <Text wrap="truncate-end" {...(a.path ? {} : { color: palette.text3 })}>{a.name}</Text>
                      </Box>
                      <Text size="caption" color={palette.text3}>{kindWord(a)}</Text>
                      {a.path && hit(`${prefix}:${a.path}`, open(a))}
                    </Box>
                  ) : a.path ? (
                    <Button key={`${prefix}-open:${a.written}`} plain label={`${a.name} · ${kindWord(a)}`} onPress={open(a)} />
                  ) : (
                    <Text dimColor>{`${a.name} · ${missing}`}</Text>
                  )}
                  {noteUnder(`${prefix}:${a.path}`)}
                </Box>
              )
            })}
          </Box>,
        )
    }
    // --- La fiche finale (#291, choix de BBR du 2026-11-04) -----------------------------------------------
    // Le geste du moment en tête : en session, « Ouvrir la session », la roue et la durée à droite (la bande
    // d'état et la carte de la session ne font plus qu'un) ; à lancer, « Lancer » et « Vérifier », et le message
    // au brief derrière « + Ajouter un message au brief ».
    const launchable = !current.done && !live && !launched.includes(taskKey(current))
    const launchNow = () => void (isRoutine(current) ? launchRoutine($, source, current, s.titre) : launchSession($, source, current, s.titre, launchExtra))
    const toggleBrief = () => void setView($, v => ({ briefOpen: v.briefOpen === taskKey(current) ? '' : taskKey(current) }))
    const topAction = (): RenderElement | null => {
      if (editing || current.done) return null
      if (live) {
        // La durée et la roue montent dans la tête du carton (#341, B1).
        const openIt = () => void openSession($, live.entry)
        // Une vérification se distingue d'une réalisation (#291) : le mot du bouton dit laquelle il ouvre.
        const openWord = sessionTitleKind(live.entry.title) === 'check' ? 'Ouvrir la vérification' : 'Ouvrir la session'
        return (
          <Box key="top-action" paddingX={SPACE.indent} flexDirection="row">
            {pressable(
              'open-session',
              openIt,
              <Box flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent} flexGrow={1} backgroundColor={palette.live} hover={{ backgroundColor: mixOver(palette.live, palette.bg, MIX.primaryHover) }}>
                {corners(RADIUS.control, palette.bg)}
                {strut(SIZE.strut.control)}
                {Svg && <Svg source={externalIcon(palette.bg, 14)} alt="Ouvrir" width={SIZE.icon.sm} height={SIZE.icon.sm} />}
                <Text weight="semibold" color={palette.bg}>{openWord}</Text>
                <Box flexGrow={1} />
              </Box>,
              <Button key="open-session" variant="primary" label={openWord} onPress={openIt} />,
              true,
            )}
          </Box>
        )
      }
      const briefShown = briefOpen === taskKey(current)
      return (
        <Box key="top-action" flexDirection="column" gap={SPACE.block} paddingX={SPACE.indent}>
          <Box flexDirection="row" alignItems="stretch" gap={SPACE.row}>
            {launched.includes(taskKey(current)) && requested()}
            {/* Un clic lance : plus de confirmation (2026-10-25) ; une routine (#280) fait le geste de son ▶. */}
            {launchable && primary('launch', playIcon(palette.priText, 14), 'Lancer', launchNow)}
            {/* « Vérifier » : une session qui dit si la tâche est encore à jour, sans la faire. */}
            {launchable && (
              <Box key="check-row" flexDirection="row" alignItems="center">
                <Button key="check" plain dimColor label="Vérifier" onPress={() => void launchSession($, source, current, s.titre, launchExtra, 'check')} />
              </Box>
            )}
          </Box>
          {/* Bloquée : une ligne, la jauge de chaîne au pied dit le reste ; « Lancer » reste possible. */}
          {holder && (
            <Text size="caption" color={palette.blockOn} wrap="wrap">
              {holder.parent
                ? `Bloquée : son parent « ${short(holder.parent).titre} » attend « ${short(holder.pre).titre} ».`
                : `Bloquée : « ${short(holder.pre).titre} » n'est pas encore faite.`}
            </Text>
          )}
          {launchable && Input && !briefShown && moreLink('brief-open', '+ Ajouter un message au brief', toggleBrief)}
          {/* Un message en plus du brief, facultatif ; Entrée lance comme « Lancer ». Sa clé suit la tâche. */}
          {launchable && Input && briefShown && (
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
          )}
          {launched.includes(taskKey(current)) &&
            waitBand(
              'launched-note',
              waitNote('launched'),
              <Button key="launch-again" plain label="Relancer" onPress={() => void setView($, v => ({ launched: v.launched.filter(k => k !== taskKey(current)) }))} />,
            )}
          {launchNote === LAUNCHED ? (
            <Box flexDirection="row" alignItems="center" gap={SPACE.row} padding="sm" borderStyle="round" borderColor={palette.border}>
              {icon(checkIcon(palette.ok), 'lancée', 16, '✓', 'success')}
              <Text>{LAUNCHED}</Text>
            </Box>
          ) : (
            launchNote !== '' && launchNote !== LAUNCHING && <Text color={palette.text2}>{launchNote}</Text>
          )}
          {/* La carte refusée par le mode auto : le geste qui passe la session en bypass (#248). */}
          {launchNote === AUTO_BLOCKED && <Button key="auto-bypass" label="Passer en bypass" onPress={() => void switchToBypass($, taskKey(current))} />}
        </Box>
      )
    }
    // Le carton (#291) : la mission dans une Box teintée de l'état. Close, il prend le Fait et le Souci de la
    // carte Fin, qui ne les redit pas, et son titre la version livrée.
    const livreRow = fin?.rows.find(r => r.name === 'Livré')
    const version = livreRow ? /\b\d+\.\d+\.\d+\b/.exec(livreRow.md)?.[0] : undefined
    // La ligne Livré quitte la carte Fin quand elle ne dit que la version, que le titre du carton reprend.
    const versionOnly = livreRow !== undefined && /^\s*(roadmap\s+)?v?\d+\.\d+\.\d+\.?\s*$/.test(livreRow.md)
    // #341 (A2) : le souci quitte le carton pour la carte Bilan ; le Fait y reste, ou « Ce qu'on a fait » à sa place.
    const cartonFin = new Set(current.done ? ['Fait', ...(versionOnly ? ['Livré'] : [])] : [])
    // Une session qui tourne sans état de bande (une session « #N · … » hors Maestro) reste « en session ».
    const cartonState = headState ?? (live ? 'live' : undefined)
    const carton = cartonOf({
      ...(cartonState ? { state: cartonState } : {}),
      done: current.done,
      abandoned,
      ...(version ? { version } : {}),
      ...(current.due ? { due: current.due } : {}),
      ...(current.ouvert ? { ouvert: current.ouvert } : {}),
      ...(current.fait ? { fait: current.fait } : {}),
      today,
    })
    const cartonLook = {
      plan: { bg: palette.planTint, edge: palette.planEdge, on: palette.pri },
      live: { bg: palette.liveTint, edge: mixOver(palette.liveOn, palette.bg, MIX.sessionBorder), on: palette.liveOn },
      wait: { bg: palette.blockTint, edge: mixOver(palette.blockOn, palette.bg, MIX.sessionBorder), on: palette.blockOn },
      merge: { bg: palette.waitTint, edge: mixOver(palette.waitOn, palette.bg, MIX.sessionBorder), on: palette.waitOn },
      done: { bg: palette.finishedTint, edge: mixOver(palette.finishedOn, palette.bg, MIX.sessionBorder), on: palette.finishedOn },
      cancel: { bg: palette.sel, edge: palette.border, on: palette.text2 },
    }[carton.tone]
    // La mission telle que la fiche la montrait (#146, #205, #278), sur le fond du carton.
    const missionBody = (bg: string, dim: boolean) => (
      <Box key="mission-body" flexDirection="column" gap={SPACE.tight}>
        {bulleted ? missionList(bulleted) : <Text wrap="wrap" {...(dim ? { color: palette.text2 } : {})}>{frame.text}</Text>}
        {frame.recap && moreLink('mission-line', missionShown ? 'Replier' : 'La ligne de la roadmap', toggleMission)}
        {frame.recap && missionShown && <Text size="caption" wrap="wrap">{current.label}</Text>}
        {noteShown && (bulleted || !frame.recap || missionShown) && linked('note', noteShown, { color: palette.text2 })}
      </Box>
    )
    // La durée (#314), montée en haut à droite du carton (#341, A2) : le temps total à gauche du petit donut ;
    // un clic sur une part ne montre que sa ligne, son nom et son temps, sa précision sous la tête du carton ;
    // un second clic, sur la part ou sur sa ligne, revient au total.
    const dureePrefix = `duree:${taskKey(current)}:`
    const dureePick = gaugePick.startsWith(dureePrefix) && gaugePick.length > dureePrefix.length ? Number(gaugePick.slice(dureePrefix.length)) : undefined
    const dureePart = duration && dureePick !== undefined ? duration.parts[dureePick] : undefined
    const dureeToggle = (i: number) => () => void setView($, v => ({ gaugePick: v.gaugePick === `${dureePrefix}${i}` ? '' : `${dureePrefix}${i}` }))
    const drawsDonut = Boolean(Svg && graphic && Client)
    // Le haut d'une tâche en cours (#341, B1) : depuis quand elle tourne, son étape et depuis quand, sa question.
    // Calculé au dessin du carton : les étapes de la session se lisent plus bas.
    const liveTopOf = () => live && !current.done && !editing
      ? liveHead({ startedAt: live.entry.startedAt, now, steps: stepsStatus?.steps ?? [], ...(stepsStatus?.question ? { question: stepsStatus.question } : {}) })
      : undefined
    const timeSide = (big: string, small: string, pick?: () => void) => (
      <Box key="carton-time-side" flexDirection="column" alignItems="flex-end">
        <Text weight="semibold" tabular>{big}</Text>
        <Text size="caption" color={palette.text2}>{small}</Text>
        {pick && hit('duree-part', pick)}
      </Box>
    )
    const timeBox = (liveTop: ReturnType<typeof liveTopOf>): RenderElement | null => {
      if (editing) return null
      if (current.done && duration) {
        const total = spanLabel(duration.total)
        return (
          <Box key="carton-time" flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0}>
            {dureePart && dureePick !== undefined ? timeSide(spanLabel(dureePart.ms), dureePart.label, dureeToggle(dureePick)) : timeSide(total, 'au total')}
            {Svg && (
              <Box key="duree-donut" flexDirection="column" flexShrink={0}>
                <Svg source={donutIcon(palette, duration.parts, DURATION_DONUT, dureePart ? dureePick : undefined)} alt={`Durée ${total}`} width={DURATION_DONUT} height={DURATION_DONUT} />
                {drawsDonut && (
                  <Box position="absolute" top={0} left={0} right={0} bottom={0}>
                    <Client key={zoneKey(DONUT_HIT, 'donut-hit')} module="./donut-hit.tsx" props={{ shares: duration.parts.map(p => p.ms), pick: dureePrefix }} width="100%" height="100%" />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )
      }
      if (liveTop && live) {
        const waiting = live.state === 'open' && live.entry.sessionId !== undefined && runningBySession.get(live.entry.sessionId) === false
        const spinning = live.state === 'open' && !waiting
        return (
          <Box key="carton-time" flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0}>
            {timeSide(liveTop.total, 'tourne depuis')}
            {Svg && spinning && <Svg source={spinnerIcon(cartonLook.on, 14, undefined, false, now)} alt="en cours" width={SIZE.icon.sm} height={SIZE.icon.sm} isInteractive />}
          </Box>
        )
      }
      return null
    }
    const finLine = (r: FinRow) => (
      <Box key={`carton-fin:${r.name}`} flexDirection="row" gap={SPACE.row}>
        <Box flexGrow={1} flexShrink={1} minWidth={0}>{finValue(r, r.md)}</Box>
      </Box>
    )
    // Le texte du carton (#341) : close, « Ce qu'on a fait » à la place du Fait du bilan (A2) ; à lancer ou en
    // cours, « Ce qu'on va lancer » (C1). La ligne de la roadmap passe alors sous l'étiquette « ▸ Mission ».
    const lead = current.done ? (fin?.recap ? `**Ce qu'on a fait.** ${fin.recap}` : undefined) : storedPitch ? `**Ce qu'on va lancer.** ${storedPitch.text}` : undefined
    const missionTag = () => {
      const label = `${missionShown ? '▾' : '▸'} Mission`
      return graphic && Client ? (
        <Box key="mission-tag-row" flexDirection="row">
          <Box key="hit:mission-tag" flexDirection="row" alignItems="center" paddingX="xs" backgroundColor={mixOver(palette.bg, cartonLook.bg, MIX.tag)} hover={{ backgroundColor: mixOver(palette.bg, cartonLook.bg, MIX.tagHover) }}>
            {corners(RADIUS.chip, cartonLook.bg)}
            {strut(SIZE.strut.chip)}
            <Text size="caption" weight="medium" color={palette.text2}>{label}</Text>
            {hit('mission-tag', toggleMission, 1)}
          </Box>
        </Box>
      ) : (
        <Button key="mission-tag" plain dimColor label={label} onPress={toggleMission} />
      )
    }
    const cartonBox = () => {
      const liveTop = liveTopOf()
      const finShown = fin && !(current.done && lead) ? fin.rows.filter(r => cartonFin.has(r.name) && r.name !== 'Livré') : []
      return (
        <Box key="carton-row" paddingX={SPACE.indent}>
          <Box key="carton" flexDirection="column" gap={SPACE.tight} padding="sm" flexGrow={1} borderStyle="round" borderColor={cartonLook.edge} backgroundColor={cartonLook.bg}>
            <Box key="carton-head" flexDirection="row" alignItems="flex-start" gap={SPACE.row}>
              <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
                <Text size="heading" weight="semibold" color={cartonLook.on}>{carton.title}</Text>
                {carton.meta !== '' && <Text size="caption" tabular color={palette.text2} wrap="truncate-end">{carton.meta}</Text>}
              </Box>
              {timeBox(liveTop)}
            </Box>
            {dureePart && <Text key="duree-note" size="caption" color={palette.text2} wrap="wrap">{dureePart.note}</Text>}
            {/* Sans dessin (le terminal), les parts du donut en boutons. */}
            {current.done && duration && !editing && !drawsDonut && (
              <Box flexDirection="row" flexWrap="wrap" gap={SPACE.row}>
                {duration.parts.map((p, i) => <Button key={`duree:${p.kind}`} plain dimColor={dureePick !== i} label={p.label} onPress={dureeToggle(i)} />)}
              </Box>
            )}
            {liveTop?.step && <Text key="live-step" size="footnote" tabular color={palette.liveOn} wrap="wrap">{liveTop.step}</Text>}
            {liveTop?.ask && (
              <Box key="live-ask" flexDirection="row" gap={SPACE.row}>
                <Text size="footnote" color={palette.block}>●</Text>
                <Box flexShrink={1} minWidth={0}><Text size="footnote" tabular color={palette.blockOn} wrap="wrap">{liveTop.ask}</Text></Box>
              </Box>
            )}
            {finShown.map(finLine)}
            {lead ? (
              <Box key="carton-lead" flexDirection="column" gap={SPACE.tight}>
                <Markdown text={codeKeptWhole(lead)} />
                {missionTag()}
                {missionShown && <Text key="mission-line" size="caption" wrap="wrap">{current.label}</Text>}
                {missionShown && noteShown && linked('note', noteShown, { color: palette.text2 })}
              </Box>
            ) : (
              missionBody(cartonLook.bg, current.done)
            )}
          </Box>
        </Box>
      )
    }
    // Les deux jauges (#291), de la même forme : sa tête et son compte, un segment par étape ou par tâche,
    // dessous la ligne de gauche ; un clic sur un segment y met le sien, un second la rend.
    const bodyWidth = fullWidth((e.props as { bodyColumns?: number }).bodyColumns ?? 48)
    // #341 (B1) : sous la barre, la liste des étapes, chacune avec sa durée ; elle remplace la ligne du segment.
    const stepRows = (steps: readonly ChildStep[], times: readonly string[]) => (
      <Box key="step-rows" flexDirection="column">
        {steps.map((x, i) => {
          const cur = x.status === 'in_progress' && !current.done
          const ok = x.status === 'completed' || current.done
          return (
            <Box key={`step-row:${i}`} flexDirection="row" alignItems="center" gap={SPACE.row} minWidth={0}>
              <Text size="caption" color={cur ? palette.liveOn : ok ? palette.ok : palette.text3}>{cur ? '●' : ok ? '✓' : '○'}</Text>
              <Box flexGrow={1} flexShrink={1} minWidth={0}>
                <Text size="footnote" wrap="truncate-end" {...(cur ? { weight: 'semibold' as const } : { color: ok ? palette.text2 : palette.text3 })}>{x.content}</Text>
              </Box>
              {/* La durée ne se coupe jamais : c'est le nom qui cède sa place (fidélité de #341). */}
              {times[i] !== '' && (
                <Box key={`step-time:${i}`} flexShrink={0}>
                  <Text size="caption" tabular wrap="truncate-end" color={cur ? palette.liveOn : palette.text2}>{times[i]}</Text>
                </Box>
              )}
            </Box>
          )
        })}
      </Box>
    )
    const gaugeBlock = (kind: 'steps', g: Gauge | undefined, colors: Record<GaugeKind | 'ring', string>, list?: { steps: readonly ChildStep[]; times: readonly string[]; spent: string }) => {
      if (!g || editing) return null
      const prefix = `${kind}:${taskKey(current)}:`
      const pickN = gaugePick.startsWith(prefix) ? Number(gaugePick.slice(prefix.length)) : undefined
      const line = gaugeLine(g, pickN)
      const picked = pickN !== undefined && line !== g.line
      const pickSeg = (i: number) => () => void setView($, v => ({ gaugePick: v.gaugePick === `${prefix}${i}` ? '' : `${prefix}${i}` }))
      return (
        <Box key={`gauge:${kind}`} flexDirection="column" paddingX={SPACE.indent}>
          {/* Au retrait du carton (#352, maquette A3) : le compte sur le bord droit du carton et du bloc du bas. */}
          <Box key={`gauge-inset:${kind}`} flexDirection="column" gap={SPACE.tight} paddingX="sm" minWidth={0}>
          <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
            <Text size="footnote" weight="semibold" color={kind === 'steps' ? palette.text : palette.text2} wrap="truncate-end">{g.head}</Text>
            <Box flexGrow={1} flexShrink={1} minWidth={0} flexDirection="row" justifyContent="flex-end">
              <Text size="caption" tabular color={palette.text2}>{list && list.spent !== '' ? `${g.count} · ${list.spent}` : g.count}</Text>
            </Box>
          </Box>
          {Svg ? (
            <Box key={`gauge-bar:${kind}`} flexDirection="column">
              <Svg source={gaugeIcon(g.segs.map(x => x.kind), colors, bodyWidth)} alt={`${g.head} · ${g.count}`} height={10} />
              {graphic && Client && !list && (
                <Box position="absolute" top={0} left={0} right={0} flexDirection="row">
                  {g.segs.map((x, i) => (
                    <Box key={`gauge-seg:${kind}:${i}`} flexGrow={1} flexShrink={1} minWidth={0}>
                      {hit(`gauge:${kind}:${i}`, pickSeg(i), 1)}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          ) : (
            <Box flexDirection="row" flexWrap="wrap" gap={SPACE.row}>
              {g.segs.map((x, i) => (
                <Button key={`gauge:${kind}:${i}`} plain dimColor label={x.kind === 'here' ? `[${i + 1}]` : `${i + 1}`} onPress={pickSeg(i)} />
              ))}
            </Box>
          )}
          {list ? (
            stepRows(list.steps, list.times)
          ) : (
            <Box key={`gauge-line:${kind}`} flexDirection="column">
              <Text size="footnote" weight="semibold" wrap="truncate-end" color={line.tone === 'live' ? palette.liveOn : line.tone === 'block' && picked ? palette.blockOn : palette.text}>{line.title}</Text>
              <Text size="caption" wrap="truncate-end" color={line.tone === 'block' && !picked ? palette.blockOn : palette.text2}>{line.sub}</Text>
            </Box>
          )}
          </Box>
        </Box>
      )
    }
    const stepsStatus = stepsNote ? shownStatus(stepsNote, stepsSession, current.done) : undefined
    const stepsAge = stepsStatus ? stepsView(stepsStatus.steps, { now, at: stepsStatus.at, fold: Infinity, closed: current.done })?.age ?? '' : ''
    const stepsGauge = stepsStatus ? stepGauge(stepsStatus.steps, { closed: current.done, age: stepsAge }) : undefined
    const stepsColors = { done: current.done ? palette.finished : palette.live, here: palette.text, pre: palette.block, next: palette.live, open: palette.sel, none: palette.text3, cancelled: palette.sel, ring: palette.text }
    const axisInk = axisHex(current.axis)
    const chainColors = { done: axisInk, here: palette.text, pre: palette.block, next: axisInk, open: palette.sel, none: palette.text3, cancelled: palette.sel, ring: palette.text }
    // La question de la session qui attend, sous la jauge des étapes, comme dans la carte Étapes (#214).
    const stepsQuestion = stepsStatus?.question?.text
    // La carte Détails qui raconte la tâche (#291), repliée d'office ; ses rangées d'avant qui ne racontent rien
    // (Attend, Dossier, Spec, Fichiers) viennent après.
    const story = detailsStory(current, {
      today,
      ...(s.sujet !== '…' ? { sujet: s.sujet } : {}),
      ...(facts ? { branch: facts.branch } : {}),
      ...(live ? { workMs: now - live.entry.startedAt } : {}),
      cles: Object.keys(cles),
      ...(fichePath ? { fichePath } : {}),
    })
    // Le bas de la fiche (#343, maquette A2 alignée, choix de BBR) : un bloc soudé, un cadre arrondi, une section
    // par contenu (la famille, puis Détails) et un filet entre elles. Trois guides : une colonne gauche de 24 px
    // commune au chevron, au carré de la mère et au tronc de l'arbre ; un bord droit commun aux comptes et aux
    // dates ; les boutons calés sur le bord du cadre. Une cellule n'a pas de largeur sûre en px (#172, #282) : la
    // colonne se fait en dessins, sans écart en cellules entre la marque de 24 px et ce qui la suit.
    const family = editing
      ? undefined
      : familyOf(current, allTasks, { isLive, prereqsOf: prereqsFor, unlocksOf: t => unlocksOf(t, allTasks, prereqsFor), titleOf: t => short(t).titre, today })
    const blankMark = `<svg xmlns="http://www.w3.org/2000/svg" width="${FAMILY_MARK_PX}" height="24"/>`
    const sectionHead = (id: string, name: string, summary: string) => {
      const closed = folded(id)
      return graphic && Client && Svg ? (
        <Box key={`hit:card:${id}`} flexDirection="row" alignItems="center" paddingX="sm" minWidth={0} hover={{ backgroundColor: palette.hover }}>
          <Svg source={familyChevronIcon(palette.text2, !closed)} alt={closed ? 'replié' : 'déplié'} width={FAMILY_MARK_PX} height={24} />
          <Text size="footnote" weight="semibold" color={palette.text2}>{name}</Text>
          <Box flexGrow={1} flexShrink={1} minWidth={0} flexDirection="row" justifyContent="flex-end">
            {summary !== '' && <Text size="caption" color={palette.text3} wrap="truncate-end">{summary}</Text>}
          </Box>
          {hit(`card:${id}`, toggleCard(id))}
        </Box>
      ) : (
        <Button key={`card:${id}`} plain onPress={toggleCard(id)}>
          <Text>{closed ? '▸ ' : '▾ '}</Text>
          <Text weight="semibold">{name}</Text>
          {summary !== '' && <Text dimColor>{` · ${summary}`}</Text>}
        </Button>
      )
    }
    // Une ligne de la famille : sa marque (24 px, puis le carré de 14 px), son titre, à droite ce qu'elle dit.
    // La ligne de la fiche est surlignée ; un clic sur une autre ouvre sa tâche (sauf chez un enfant de Maestro, #233).
    const familyLine = (key: string, x: Task, o: { here: boolean; marks: RenderElement; title: RenderElement; right: RenderElement; flush?: boolean }) => {
      const opens = !o.here && !(inSession && child)
      const press = graphic && Client && opens
      return (
        <Box
          key={`family:${key}`}
          flexDirection="row"
          alignItems="center"
          paddingX="sm"
          minWidth={0}
          {...(o.here ? { backgroundColor: palette.hover } : press ? { hover: { backgroundColor: palette.hover } } : {})}
        >
          {o.marks}
          {/* Le titre de la mère colle à sa marque (`flush`), au guide du nom de section ; celui d'une ligne suit son carré. */}
          <Box flexShrink={1} minWidth={0} {...(o.flush ? {} : { paddingLeft: SPACE.row })}>
            {opens && !press ? (
              <Button key={`link:${x.key}`} plain hover={{ underline: true }} onPress={select(selectionOf(x))}>{o.title}</Button>
            ) : (
              o.title
            )}
          </Box>
          <Box flexGrow={1} flexShrink={0} flexDirection="row" justifyContent="flex-end" alignItems="center" gap={SPACE.row} paddingLeft={SPACE.row}>
            {o.right}
          </Box>
          {press && hit(`family:${x.key}`, select(selectionOf(x)))}
        </Box>
      )
    }
    const familySection = (f: NonNullable<typeof family>) => {
      const closed = folded('chaine')
      const lead = f.lead
      return (
        <Box key="family-section" flexDirection="column" paddingY="xs">
          {sectionHead('chaine', f.head, f.count)}
          {!closed && lead &&
            familyLine('lead', lead.task, {
              here: lead.here,
              flush: true,
              marks: Svg ? (
                <Svg source={familyLeadIcon(axisHex(lead.task.axis))} alt="mère" width={FAMILY_MARK_PX} height={24} />
              ) : (
                <Text color={palette.text2}>■</Text>
              ),
              title: <Text weight="semibold" wrap="truncate-end">{lead.title}</Text>,
              right: (
                <>
                  {Svg && <Svg source={gaugeIcon(lead.kinds, chainColors, 56, 6)} alt={`${f.count}`} width={56} height={6} />}
                  <Text size="caption" tabular color={palette.text2}>{lead.right}</Text>
                </>
              ),
            })}
          {!closed &&
            f.rows.map((r, i) => {
              const sq: 'open' | 'done' | 'cancelled' = r.state === 'done' ? 'done' : r.state === 'cancelled' ? 'cancelled' : 'open'
              const square = Svg ? (
                <Svg source={familySquareIcon(axisHex(r.task.axis), sq, palette.onAxis)} alt={sq === 'done' ? 'faite' : r.task.axis} width={14} height={24} />
              ) : (
                <Text color={palette.text3}>{sq === 'done' ? '✓' : '□'}</Text>
              )
              const lead24 = f.tree
                ? Svg ? (
                    <Svg source={familyElbowIcon(palette.text3, i === f.rows.length - 1)} alt="lien" width={FAMILY_MARK_PX} height={24} />
                  ) : (
                    <Text color={palette.text3}>{i === f.rows.length - 1 ? '└ ' : '├ '}</Text>
                  )
                : Svg && <Svg source={blankMark} alt="" width={FAMILY_MARK_PX} height={24} />
              return familyLine(r.task.key, r.task, {
                here: r.here,
                marks: (
                  <>
                    {lead24}
                    {square}
                  </>
                ),
                title: (
                  <Text
                    wrap="truncate-end"
                    {...(r.here ? { weight: 'semibold' as const } : {})}
                    {...(r.state === 'done' || r.state === 'cancelled' ? { strikethrough: true, color: palette.text3 } : {})}
                  >
                    {r.title}
                  </Text>
                ),
                right: <Text size="caption" tabular color={r.tone === 'block' ? palette.blockOn : palette.text2} wrap="end">{r.right}</Text>,
              })
            })}
        </Box>
      )
    }
    // Une rangée de Détails : l'étiquette sur 10 unités, la valeur à côté ; sans filet (le filet sépare les groupes).
    // Au retrait du carton (#352) ; la valeur et son appoint sur une seule ligne (« dans 7 j » à côté des dates),
    // la rangée bornée à la largeur du cadre (`minWidth={0}`) : une source en prose passe à la ligne.
    const detailRow = (name: string, value: RenderElement, key: string) => (
      <Box key={`detail:${key}`} flexDirection="row" alignItems="center" paddingX="sm" minWidth={0}>
        <Box width={10} flexShrink={0} flexDirection="row" alignItems="center">
          {strut(SIZE.strut.row)}
          <Text size="caption" color={palette.text3}>{name}</Text>
        </Box>
        <Box key={`detail-value:${key}`} flexDirection="row" flexWrap="nowrap" alignItems="center" gap={SPACE.row} flexShrink={1} minWidth={0}>
          {value}
        </Box>
      </Box>
    )
    const detailsSection = () => {
      const closed = folded('details')
      // Les rangées du récit, puis celles que le récit ne dit pas : prérequise introuvable, Attend, Dossier, Spec.
      const extras: [string, RenderElement | false | undefined, string][] = [
        ...missingPrereqs(current, allTasks).map((n, i): [string, RenderElement, string] => [i === 0 ? 'Avant' : '', <Text key={`missing:${n}`} size="footnote" wrap="truncate-end">{`#${n} introuvable`}</Text>, `missing:${n}`]),
        [
          'Attend',
          current.attend !== undefined &&
            (me.includes(attendWho(current.attend)) && current.attend === attendWho(current.attend) ? plain(current.attend) : linked('attend', current.attend, { size: 'caption', color: palette.text2 })),
          'attend',
        ],
        [
          'Dossier',
          docs.length > 0 && (
            <Box key="detail-docs" flexDirection="column" minWidth={0}>
              <Box flexDirection="row" gap={SPACE.row}>
                {docs.map(d => (
                  <Button key={`focus-doc:${d.label}`} plain dimColor label={d.label} onPress={() => void openFile($, ficheSource, d.path, { at: `focus-doc:${d.label}` })} />
                ))}
              </Box>
              {docs.map(d => noteUnder(`focus-doc:${d.label}`))}
            </Box>
          ),
          'dossier',
        ],
        ['Spec', current.spec !== undefined && mono(current.spec), 'spec'],
      ]
      const tail = extras.filter(([, v]) => v)
      const groups = [
        ...story.groups.map((g, gi) =>
          g.map((r, ri) => {
            const text = (
              <>
                <Box key={`detail-main:${gi}:${ri}`} flexShrink={r.sub ? 0 : 1} minWidth={0}>
                  {r.mono ? mono(r.value) : <Text size="footnote" wrap={r.file ? 'truncate-end' : 'wrap'}>{r.value}</Text>}
                </Box>
                {r.sub && (
                  <Box key={`detail-sub:${gi}:${ri}`} flexShrink={1} minWidth={0}>
                    <Text size="caption" color={palette.text2} wrap="truncate-end">{r.sub}</Text>
                  </Box>
                )}
              </>
            )
            const file = r.file && (r.icon === 'document' ? r.file : `${source.dir}/${r.file}`)
            const rowAt = `open:${r.icon}:${r.file}`
            const opener = file
              ? pressable(
                  `open:${r.icon}:${r.file}`,
                  () => void openFile($, source, file, { at: `open:${r.icon}:${r.file}` }),
                  <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
                    {Svg && (
                      <Svg
                        source={r.icon === 'document' ? documentIcon(palette.text2, SIZE.icon.chip) : externalIcon(palette.text2, SIZE.icon.chip)}
                        alt={r.icon === 'document' ? 'fiche' : 'source'}
                        width={SIZE.icon.chip}
                        height={SIZE.icon.chip}
                      />
                    )}
                    {text}
                  </Box>,
                  <Button key={`open:${r.icon}`} plain label={r.value} onPress={() => void openFile($, source, file, { at: rowAt })} />,
                )
              : text
            const note = noteUnder(rowAt)
            const value = file && note ? (
              <Box key={`detail-open:${rowAt}`} flexDirection="column" minWidth={0}>
                {opener}
                {note}
              </Box>
            ) : (
              opener
            )
            return detailRow(r.name, value, `${gi}:${ri}`)
          }),
        ),
        ...(tail.length > 0 ? [tail.map(([name, v, key]) => detailRow(name, v as RenderElement, key))] : []),
      ]
      return (
        <Box key="details-section" flexDirection="column" paddingY="xs">
          {sectionHead('details', 'Détails', story.summary)}
          {!closed &&
            groups.map((g, gi) => (
              <Box key={`detail-group:${gi}`} flexDirection="column">
                {gi > 0 && <Box key="detail-rule" paddingY="xs">{ruleAbove}</Box>}
                {g}
              </Box>
            ))}
        </Box>
      )
    }
    const bottomBlock = (): RenderElement | null => {
      if (editing) return null
      const sections = [family && familySection(family), layout.cards.includes('details') && detailsSection()].filter((x): x is RenderElement => Boolean(x))
      if (sections.length === 0) return null
      return (
        <Box key="bottom-block" paddingX={SPACE.indent}>
          <Box key="bottom-frame" flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0} paddingX={0} paddingY={0} borderStyle="round" borderColor={palette.border}>
            {sections.map((x, i) => (i === 0 ? x : <Box key={`bottom-rule:${i}`} flexDirection="column">{ruleAbove}{x}</Box>))}
          </Box>
        </Box>
      )
    }
    // La confirmation d'une clôture (#73) : faite ou annulée, sa raison, ce qui pourrait la contredire.
    const closeAsk = () => (
      <Box key="cancel-box" flexDirection="column" gap={SPACE.block} padding="sm" borderStyle="round" borderColor={palette.border}>
        <Text weight="semibold" wrap="wrap">
          {closeKind === 'done'
            ? kidsOpen > 0
              ? `Clore #${current.id} « ${s.titre} » et ${kidsOpen > 1 ? `ses ${kidsOpen} étapes ouvertes` : 'son étape ouverte'} ?`
              : `Marquer${current.id ? ` #${current.id}` : ''} « ${s.titre} » faite ?`
            : `Annuler${current.id ? ` #${current.id}` : ''} « ${s.titre} » ?`}
        </Text>
        <Text size="caption" color={palette.text2} wrap="wrap">
          {closeCaption(closeKind, { ecriture: source.ecriture, cowork: bilanData.viaCowork })}
        </Text>
        {(live || launched.includes(taskKey(current))) && <Text size="caption" color={palette.lateOn} wrap="wrap">Une session tient cette tâche : elle peut encore l'écrire.</Text>}
        {closeKind === 'done' && unsentNow !== undefined && cancelNote !== unsentNow && <Text size="caption" color={palette.lateOn} wrap="wrap">{unsentNow}</Text>}
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
              variant="primary"
              label={cancelNote === CANCEL_BUSY ? 'Écriture…' : kidsOpen > 0 ? 'Tout clore' : 'Confirmer'}
              onPress={kidsOpen > 0 ? closeAll : () => void confirmClose($, source, current, 'done')}
            />
          ) : (
            <Button key="cancel-confirm" variant="primary" label={cancelNote === CANCEL_BUSY ? 'Annulation…' : "Confirmer l'annulation"} onPress={() => void confirmClose($, source, current, 'abandon')} />
          )}
          <Button key="cancel-keep" plain dimColor label="Garder" onPress={() => void setView($, () => ({ cancelAsk: '', cancelNote: '' }))} />
        </Box>
        {cancelNote !== '' && cancelNote !== CANCEL_BUSY && <Text color={palette.lateOn} wrap="wrap">{cancelNote}</Text>}
      </Box>
    )
    // Le pied (#291) : « Marquer faite », « Annuler la tâche » et leur confirmation ; close, sa session gardée.
    const closeRow = (): RenderElement | null => {
      if (editing) return null
      if (current.done)
        return kept ? (
          <Box key="kept-row" flexDirection="row" alignItems="stretch" gap={SPACE.row} paddingX={SPACE.indent}>
            {primary('open-session', externalIcon(palette.priText, 14), 'Ouvrir la session', () => void openSession($, kept.entry))}
            {action('archive-session', archiveIcon(palette.text), 'Archiver la session', () => void archiveSession($, kept.key, kept.entry))}
          </Box>
        ) : null
      return (
        <Box key="close-block" flexDirection="column" gap={SPACE.block} paddingX={SPACE.indent}>
          {!(asking && cancelNote === CANCEL_BUSY) && (
            <Box key="close-row" flexDirection="row" alignItems="center" gap={SPACE.row}>
              {(['done', 'abandon'] as const)
                .filter(kind => !(asking && closeKind === kind))
                .map(kind => {
                  const ask = () => {
                    cancelReason = ''
                    void setView($, () => ({ cancelAsk: taskKey(current), closeKind: kind, cancelNote: '' }))
                  }
                  const label = kind === 'done' ? 'Marquer faite' : 'Annuler la tâche'
                  // Deux boutons dessinés (#343) : « Marquer faite » plein, coche `ok` ; « Annuler la tâche » au filet.
                  // Même forme (#352, maquette A3) : chacun son filet (celui du plein à la couleur de son fond), sans la
                  // marge d'office d'une Box à filet, sur le même étai de 28 px.
                  const look = kind === 'done' ? 'done' : 'cancel'
                  const struck = Svg && <Svg key={`close-strut:${look}`} source={`<svg xmlns="http://www.w3.org/2000/svg" width="1" height="${SIZE.strut.field}"/>`} alt="espace" width={1} height={SIZE.strut.field} />
                  return pressable(
                    look,
                    ask,
                    kind === 'done' ? (
                      <Box key="close-look:done" flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent} paddingY={0} borderStyle="round" borderColor={palette.btn} backgroundColor={palette.btn} hover={{ backgroundColor: palette.btnHover, borderColor: palette.btnHover }}>
                        {corners(RADIUS.control, palette.bg)}
                        {struck}
                        {Svg && <Svg source={checkIcon(palette.ok, SIZE.icon.sm)} alt="icône" width={SIZE.icon.sm} height={SIZE.icon.sm} />}
                        <Text weight="semibold">{label}</Text>
                      </Box>
                    ) : (
                      <Box key="close-look:cancel" flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent} paddingY={0} borderStyle="round" borderColor={palette.border}>
                        {struck}
                        {Svg && <Svg source={closeIcon(palette.text2, SIZE.icon.sm)} alt="icône" width={SIZE.icon.sm} height={SIZE.icon.sm} />}
                        <Text color={palette.text2}>{label}</Text>
                      </Box>
                    ),
                    <Button key={kind === 'done' ? 'done' : 'cancel'} plain dimColor label={label} onPress={ask} />,
                  )
                })}
            </Box>
          )}
          {asking && closeAsk()}
          {!asking && cancelNote !== '' && cancelNote !== CANCEL_BUSY && <Text size="caption" color={palette.lateOn} wrap="wrap">{cancelNote}</Text>}
        </Box>
      )
    }
    const cards: Record<FicheCard, () => RenderElement> = {
      avancement: () =>
        card(
          'avancement',
          'Avancement',
          summaries.avancement,
          <Box flexDirection="column" gap={SPACE.block}>
            <Box flexDirection="column">
              {docs.length > 0 &&
                field(
                  'Dossier',
                  <Box flexDirection="column" minWidth={0}>
                    <Box flexDirection="row" gap={SPACE.row}>
                      {docs.map(d => (
                        <Button key={`focus-doc:${d.label}`} plain dimColor label={d.label} onPress={() => void openFile($, ficheSource, d.path, { at: `focus-doc:${d.label}` })} />
                      ))}
                    </Box>
                    {docs.map(d => noteUnder(`focus-doc:${d.label}`))}
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
                        linked('attend', current.attend, { size: 'caption', color: palette.text2 })
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
                            ? kidsOpen > 0
                              ? `Clore #${current.id} « ${s.titre} » et ${kidsOpen > 1 ? `ses ${kidsOpen} étapes ouvertes` : 'son étape ouverte'} ?`
                              : `Marquer${current.id ? ` #${current.id}` : ''} « ${s.titre} » faite ?`
                            : `Annuler${current.id ? ` #${current.id}` : ''} « ${s.titre} » ?`}
                        </Text>
                        <Text size="caption" color={palette.text2} wrap="wrap">
                          {closeCaption(closeKind, { ecriture: source.ecriture, cowork: bilanData.viaCowork })}
                        </Text>
                        {(live || launched.includes(taskKey(current))) && (
                          <Text size="caption" color={palette.lateOn} wrap="wrap">Une session tient cette tâche : elle peut encore l'écrire.</Text>
                        )}
                        {closeKind === 'done' && unsentNow !== undefined && cancelNote !== unsentNow && (
                          <Text size="caption" color={palette.lateOn} wrap="wrap">{unsentNow}</Text>
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
                              variant="primary"
                              label={cancelNote === CANCEL_BUSY ? 'Écriture…' : kidsOpen > 0 ? 'Tout clore' : 'Confirmer'}
                              onPress={kidsOpen > 0 ? closeAll : () => void confirmClose($, source, current, 'done')}
                            />
                          ) : (
                            <Button
                              key="cancel-confirm"
                              variant="primary"
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
          'lancer',
          'Lancer',
          summaries.lancer,
          <Box flexDirection="column" gap={SPACE.block}>
              <Box flexDirection="row" alignItems="stretch" gap={SPACE.row}>
                {!current.done && !live && launched.includes(taskKey(current)) && requested()}
                {/* Un clic lance : plus de confirmation (2026-10-25) ; le message additionnel suit. */}
                {!current.done &&
                  !live &&
                  !launched.includes(taskKey(current)) &&
                  // Une routine (#280) : « Lancer » fait le geste de son ▶ (coche, redate, carte).
                  primary('launch', playIcon(palette.priText, 14), 'Lancer', () =>
                    void (isRoutine(current) ? launchRoutine($, source, current, s.titre) : launchSession($, source, current, s.titre, launchExtra)),
                  )}
                {/* « Vérifier » : une session qui dit si la tâche est encore à jour, sans la faire. Un
                    bouton de l'app, sans zone de clic : le dessin en compte au plus ZONE_LIMIT. */}
                {!current.done && !live && !launched.includes(taskKey(current)) && (
                  <Box key="check-row" flexDirection="row" alignItems="center">
                    <Button key="check" plain dimColor label="Vérifier" onPress={() => void launchSession($, source, current, s.titre, launchExtra, 'check')} />
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
              {/* La carte refusée par le mode auto : le geste qui passe la session en bypass (#248). */}
              {!live && launchNote === AUTO_BLOCKED && (
                <Button key="auto-bypass" label="Passer en bypass" onPress={() => void switchToBypass($, taskKey(current))} />
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
                      ? kidsOpen > 0
                              ? `Clore #${current.id} « ${s.titre} » et ${kidsOpen > 1 ? `ses ${kidsOpen} étapes ouvertes` : 'son étape ouverte'} ?`
                              : `Marquer${current.id ? ` #${current.id}` : ''} « ${s.titre} » faite ?`
                      : `Annuler${current.id ? ` #${current.id}` : ''} « ${s.titre} » ?`}
                  </Text>
                  <Text size="caption" color={palette.text2} wrap="wrap">
                    {closeCaption(closeKind, { ecriture: source.ecriture, cowork: bilanData.viaCowork })}
                  </Text>
                  {(live || launched.includes(taskKey(current))) && (
                    <Text size="caption" color={palette.lateOn} wrap="wrap">Une session tient cette tâche : elle peut encore l'écrire.</Text>
                  )}
                  {closeKind === 'done' && unsentNow !== undefined && cancelNote !== unsentNow && (
                    <Text size="caption" color={palette.lateOn} wrap="wrap">{unsentNow}</Text>
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
                        variant="primary"
                        label={cancelNote === CANCEL_BUSY ? 'Écriture…' : kidsOpen > 0 ? 'Tout clore' : 'Confirmer'}
                        onPress={kidsOpen > 0 ? closeAll : () => void confirmClose($, source, current, 'done')}
                      />
                    ) : (
                      <Button
                        key="cancel-confirm"
                        variant="primary"
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
          'chaine',
          'Chaîne',
          summaries.chaine,
          sisters ? (
            sisterCard(sisters)
          ) : (
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
          </Box>
          ),
        ),
      details: () =>
        card(
          'details',
          'Détails',
          summaries.details,
          <Box flexDirection="column">
            {/* Close : l'étiquette « Completed » violette, le mot de la bande (#199, #207), ou « annulée » grise. */}
            {current.done && field('État', donePill(current))}
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
                    {strong(shortDate(current.due))}
                    {due && current.due && tag(due.text, due.late ? 'late' : isDueSoon(current, today) ? 'soon' : 'soft')}
                  </Box>
                ),
              )}
              {field(abandoned ? 'Annulée le' : 'Faite le', current.fait !== undefined && strong(doneLabel(current.fait)))}
              {field('Source', current.src !== undefined && current.src !== '' && linked('src', current.src, { mono: true, size: 'caption', color: palette.text2 }))}
              {field('Spec', mono(current.spec))}
            {(fichePath || srcPath) &&
              field(
                'Fichiers',
                <Box key="files-buttons" flexDirection="row" alignItems="center" gap={SPACE.row}>
                  {fichePath && action('open-fiche', documentIcon(palette.text, SIZE.icon.chip), 'Fiche', () => void openFile($, source, fichePath), undefined, 'chip')}
                  {srcPath && action('open-src', externalIcon(palette.text, SIZE.icon.chip), 'Source', () => void openFile($, source, srcPath), undefined, 'chip')}
                </Box>,
              )}
            {current.ouvert !== undefined &&
              field(
                'Ouverte le',
                <Box key="opened" flexDirection="row" alignItems="center" gap={SPACE.row}>
                  <Text weight="semibold" tabular>{shortDate(current.ouvert)}</Text>
                  {days !== undefined && <Text color={palette.text2}>{`· ${openedLabel(days)}`}</Text>}
                </Box>,
              )}
          </Box>,
        ),
      // Les pièces jointes (#204, maquette B, vignettes plus petites) : les images en vignettes de 48 × 64,
      // un clic les ouvre en grand dans le panneau Fichiers ; dessous, une ligne par autre fichier, une
      // absente grisée, « introuvable », sans clic. Au terminal, sans Svg, des boutons.
      pj: () => fileCard('pj', 'Pièces jointes', attachments, 'introuvable'),
      // Les livrables (#234) : la carte des pièces jointes, pour les sorties ; un absent n'est pas encore écrit.
      livrables: () => fileCard('livrables', 'Livrables', deliverables, 'pas encore écrit'),
    }
    // L'édition (#161, maquette C) : un champ par ligne éditable, à côté de son étiquette ; un menu sur
    // bureau quand le projet liste ses valeurs (`—` : vide). Le refus rougit l'étiquette et se dit dessous.
    const saveBusy = editNote === SAVE_BUSY
    // Le champ « Nom » vide montre en attente le nom que le panneau tire du libellé (#235).
    const drawnTitle = titles[hashLabel(current.label)]?.titre ?? fallbackTitle(current.label)
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
          placeholder={spec.field === 'nom' ? drawnTitle : spec.field === 'due' ? 'AAAA-MM-JJ' : spec.options ? spec.options.join(', ') : spec.field === 'apres' || spec.field === 'parent' ? 'N, ou -' : ''}
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
              {ruleAbove}
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
          avancement: () => card('avancement', 'Avancement', '', editRows('avancement')),
          chaine: () => card('chaine', 'Chaîne', '', editRows('chaine')),
          details: () => card('details', 'Détails', '', editRows('details')),
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
    // Le crayon, à droite du titre d'une ouverte (#161) : « Modifier » ferme l'encart de clôture. Un petit
    // bouton gris d'une ligne, 24 px, sous un titre de 22 px (#193, maquette B).
    const pencil =
      !current.done && !editing
        ? action(
            'edit-task',
            pencilIcon(palette.text, SIZE.icon.sm),
            'Modifier',
            () => {
              clearDrafts(editKey)
              void setView($, () => ({ editing: editKey, editNote: '', editField: '', editCount: 0, cancelAsk: '', cancelNote: '' }))
            },
            undefined,
            true,
          )
        : undefined
    // Le drapeau de priorité (#300, F1, choix de BBR) : à gauche du crayon, le réglage « Priorités »
    // allumé, sur une ouverte hors édition ; posé, carré rouge et drapeau blanc ; ôté, carré gris clair.
    const priorityOn = isPriority(current)
    const priorityLabel = priorityOn ? 'Retirer la priorité' : 'Marquer prioritaire'
    const pressPriority = () => void togglePriority($, source, current)
    const priorityFlag =
      settings.priorities && !current.done && !editing
        ? pressable(
            'prio-task',
            pressPriority,
            <Box flexDirection="row" alignItems="center">
              {strut(SIZE.strut.row)}
              {Svg && <Svg source={priorityIcon(priorityOn, palette, PRIORITY_PX.fiche)} alt={priorityLabel} width={PRIORITY_PX.fiche} height={PRIORITY_PX.fiche} />}
            </Box>,
            <Button key="prio-task" plain label={priorityLabel} onPress={pressPriority} />,
          )
        : undefined
    const titleEnd =
      priorityFlag && pencil ? (
        <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
          {priorityFlag}
          {pencil}
        </Box>
      ) : (
        priorityFlag ?? pencil
      )
    const openLine = () => void openFile($, source, current.done ? paths.done : paths.open, { line })
    const labelSpec = editSpecs.find(spec => spec.field === 'label')
    const nameSpec = editSpecs.find(spec => spec.field === 'nom')
    return (
      <Box flexDirection="column" gap={SPACE.root} paddingX={SPACE.indent}>
        {/* L'en-tête Voies (#137) ; son titre ouvre la ligne dans la roadmap, sa flèche ramène à la
            roadmap entière (#165) : dans la session, la vue d'ensemble ; au clic, la liste d'où l'on vient.
            Chez un enfant de Maestro, pas de flèche : la marque à sa place, la liste reste à Maestro (#233). */}
        <Box paddingX={SPACE.indent}>
          {brandTree(
            $,
            e,
            headBrand,
            palette,
            'focus',
            today,
            { key: 'open-line', press: openLine, hit: hit('open-line', openLine) },
            undefined,
            false,
            titleEnd,
            inSession && child
              ? undefined
              : {
                  key: 'back',
                  press: inSession
                    ? () => void setView($, () => ({ whole: true, editing: '', editNote: '', editField: '' }))
                    : select(''),
                },
          )}
        </Box>
        {/* La fiche finale (#291) : en session, la bande d'état se fond dans « Ouvrir la session ». */}
        {(editing || headState !== 'live' || !live) && stateBox()}
        {!editing && topAction()}
        {mockupBand()}
        {draftBlock()}
        {/* En édition (#161) : la barre sous l'en-tête, à la place du crayon. */}
        {editing && editBar()}
        {!editing && cartonBox()}
        {!editing && gaugeBlock('steps', stepsGauge, stepsColors, stepsStatus ? { steps: stepsStatus.steps, times: stepTimes(stepsStatus.steps, { now, closed: current.done, at: stepsStatus.at }), spent: stepsSpent(stepsStatus.steps, { now, closed: current.done, at: stepsStatus.at }) } : undefined)}
        {/* La question en attente monte dans le carton d'une tâche en cours (#341, B1). */}
        {!editing && stepsQuestion && !(live && !current.done) && (
          <Box key="steps-question" paddingX={SPACE.indent}>
            <Box paddingX="sm" minWidth={0}><Text size="caption" color={palette.blockOn} wrap="wrap">{stepsQuestion}</Text></Box>
          </Box>
        )}
        {/* En édition, la mission dans son cadre (#150) et ses champs (#161, #235). */}
        {editing && <Box paddingX={SPACE.indent}>
          <Box flexDirection="column" gap={SPACE.tight} paddingX={SPACE.indent} paddingY="sm" flexGrow={1} backgroundColor={palette.note}>
            {corners(RADIUS.control, palette.bg)}
            {/* En édition, le nom court au-dessus du libellé (#235) : vide, le panneau tire le sien. */}
            {nameSpec && <Text size="caption" weight="medium" color={editBad(nameSpec) ? palette.lateOn : palette.text2}>Nom</Text>}
            {nameSpec && editInput(nameSpec)}
            {nameSpec && editBad(nameSpec) && <Text size="caption" color={palette.lateOn} wrap="wrap">{editNote}</Text>}
            <Text size="caption" weight="medium" color={labelSpec && editBad(labelSpec) ? palette.lateOn : palette.text2}>Mission</Text>
            {labelSpec
              ? editInput(labelSpec)
              : bulleted
                ? missionList(bulleted)
                : <Text wrap="wrap">{frame.text}</Text>}
            {labelSpec && editBad(labelSpec) && <Text size="caption" color={palette.lateOn} wrap="wrap">{editNote}</Text>}
            {!editing && frame.recap && moreLink('mission-line', missionShown ? 'Replier' : 'La ligne de la roadmap', toggleMission)}
            {!editing && frame.recap && missionShown && <Text size="caption" wrap="wrap">{current.label}</Text>}
            {!editing && noteShown && (bulleted || !frame.recap || missionShown) && linked('note', noteShown, { color: palette.text2 })}
          </Box>
        </Box>}
        {finBox()}
        {changesBox()}
        {editing && stepsPart && card('etapes', 'Étapes', stepsPart.summary, stepsPart.body)}
        {layout.cards.filter(c => editing || c !== 'details').map(c => (editing ? (editCards[c] ?? cards[c])() : cards[c]()))}
        {bottomBlock()}
        {closeRow()}
        <Box flexDirection="column" gap={SPACE.block} paddingX={SPACE.indent}>
          {openNote !== '' && openAt === '' && <Text size="caption" color={palette.text2}>{openNote}</Text>}
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
  // Les filtres de temps (#268) : toute l'équipe, comme Cette semaine ; Ma journée et Demain, le seul jour.
  const todayAll = inAxis.filter(t => isToday(t, today))
  const tomorrowAll = inAxis.filter(t => isDueTomorrow(t, today))
  const soonAll = inAxis.filter(t => isDueSoon(t, today))
  const relaunchAll = inAxis.filter(t => isToRelaunch(t, today, me, relanceDays))
  const lateAll = inAxis.filter(t => isOverdue(t, today))
  // « En cours » : les tâches qu'une session travaille (roue, ou main quand elle t'attend) et
  // celles bloquées par leur prérequise (cadenas).
  const liveAll = inAxis.filter(t => isLive(t) || blocked(t))
  // « Retours » : les tâches nées d'un retour de l'app, ou qui en ont reçu.
  const feedbackAll = inAxis.filter(t => t.feedback !== undefined)
  const maestroBrand = ownBrand?.brand.kind === 'maestro' ? ownBrand.brand : undefined
  // Le bloc « En cours » de Maestro (#160) : ses sessions qui tournent ou t'attendent, puis les tâches
  // qu'une autre session travaille (#187), en lignes ; la liste de la roadmap dessous ne les redit pas.
  // Toutes rangées par premier lancement (#195) : celles des autres sessions aussi, par la date de la leur.
  if (maestroBrand) await learnCreated($, openTasks.filter(isLive).map(t => liveOf(t)?.entry.sessionId).filter((id): id is string => id !== undefined), now)
  // Une session close et pas archivée y garde sa ligne, « Completed », comme dans la bande (#218).
  const blockRows = maestroBrand ? liveBlockRows(maestroBrand.tasks, openTasks, isLive, t => launchOf(t, liveOf(t)?.entry.sessionId, now), doneTasks) : []
  const blockOf = new Map(blockRows.flatMap(r => (r.brand ? [[r.brand.id, r.brand] as const] : [])))
  const blockKeys = new Set(blockRows.map(r => taskKey(r.task)))
  // Une tâche en file (#345) quitte la liste tant qu'elle attend : le centre de contrôle la montre (#367).
  const queuedIds = new Set(maestroBrand && doseView ? doseView.queue.map(q => q.id) : [])
  const inBlock = (t: Task) => blockKeys.has(taskKey(t)) || (t.id !== undefined && queuedIds.has(String(t.id)))
  const blockTasks = blockRows.map(r => r.task)
  // La file des tests lourds (#321, maquette C) : la pastille de chaque branche prend la place de la barre
  // d'étapes sur la ligne de sa session ; les suites d'une branche sans ligne (main, Maestro) ont la leur.
  queueWanted = maestroBrand !== undefined
  const heavy = maestroBrand ? await readQueue($) : undefined
  const nowSec = Math.floor(now / 1000)
  const heavyMarks: Map<string, QueueMark> = heavy ? queueMarks(heavy, nowSec) : new Map()
  // Les tâches qui attendent leur place (#324, maquette A), lues par la relève au dernier pas.
  const dose = maestroBrand ? doseView : undefined
  // Une tâche qu'on vient de cocher reste à sa place le temps de son mouvement (#182, maquette A), puis
  // part dans les Done ; une fille d'une mère ouverte y reste de toute façon, sous sa mère.
  const openIds = new Set(openTasks.map(t => t.id))
  const stepLingers = (t: Task) => checkLingers(checkMoves.get(taskKey(t)), now)
  const lingering = showDone ? [] : doneTasks.filter(t => stepLingers(t) && !(t.parent !== undefined && openIds.has(t.parent)))
  const blockSteps = new Map<string, ChildStatus>()
  await Promise.all(
    [...blockOf.values()].map(async bt => {
      const found = await readSteps($, bt.sessionId)
      if (found) blockSteps.set(bt.id, shownStatus(found, bt.sessionId, bt.closed === true))
    }),
  )
  const attend =
    // Chez Maestro, « En cours » n'est plus un filtre (#160) : une vue gardée dessus montre toutes les tâches.
    attendRaw === 'live' && maestroBrand
      ? 'all'
      : // `auto`, d'une vue gardée d'avant l'ouverture sur « Toutes » (#188), ou l'ancien filtre
        // « Récentes », devenu le rangement par numéro (#192) : toutes les tâches.
        attendRaw === 'auto' || attendRaw === 'recent'
        ? OPENING_VIEW.attend
        : attendRaw
  // Le bloc « En cours » de Maestro (#149, #160) remplace le filtre « En cours », même avant sa première
  // tâche lancée (#187) : un Maestro neuf y voit ce qui tourne ailleurs, et rien quand rien ne tourne.
  const maestroLine = maestroBrand !== undefined
  const mineCount = inAxis.filter(t => isMine(t, me)).length
  const thirdParties = countBy(inAxis.filter(t => !isMine(t, me)), t => (t.attend === undefined ? undefined : attendWho(t.attend)))
  const tierChosen = thirdParties.some(([who]) => who === attend)

  const shown = (
    attend === 'late'
      ? lateAll
      : attend === 'today'
        ? todayAll
        : attend === 'tomorrow'
        ? tomorrowAll
        : attend === 'soon'
          ? soonAll
          : attend === 'relaunch'
            ? relaunchAll
      : attend === 'live'
          ? liveAll
          : attend === 'feedback'
            ? feedbackAll
            : [...openTasks, ...lingering].filter(t => matches(t, axis, attend, me) && matchesWho(t, who, me))
  ).filter(t => !inBlock(t))
  const filtered = axis !== 'all' || attend !== 'all' || who !== 'all' || showDone || searching
  // Un titre court pas encore calculé : la ligne garde son titre provisoire, estompé ; un nom posé (#235) ne l'est pas.
  const titled = (t: Task) => cachedTitle(t, titles) !== undefined
  // Par sujet, par jour, par échéance ou par responsable (#76, #176, #189) : le même choix dans
  // toutes les vues. La vue que le projet déclare l'emporte ; sans elle, par sujet. Le jour et
  // l'échéance seulement si la roadmap a des `due:`, le responsable des `resp:` (#176).
  const rangeable = groupingData(openTasks)
  const by = groupingOf(groupBy, showDone, rangeable)
  // Les ouvertes sont toujours en arbre (#189) : le rangement trie des arbres entiers. L'arbre
  // garde les tâches en retard à leur place (une mère en retard garde ses filles) : la pastille de
  // retard reste sur la ligne. Une recherche (#318, choix de Bertrand) : ses résultats en arbre aussi, rangés
  // comme la liste ; une tâche trouvée d'une chaîne amène toute sa chaîne (`searchTree`), ses faites comprises.
  // Ma journée (#268) : ses récurrentes qui tombent quittent l'arbre pour leur section à part, au bas.
  const recurringToday = attend === 'today' ? shown.filter(t => isRecurringSoon(t, today)) : []
  const treeShown = recurringToday.length > 0 ? shown.filter(t => !recurringToday.includes(t)) : shown
  // La recherche : ouvertes puis faites, toutes, quels que soient les filtres.
  const titleOf = (t: Task) => cachedTitle(t, titles)
  const foundOpen = searching ? sortTasks(searchTasks(openTasks.filter(t => !inBlock(t)), search, titleOf), sortOrder) : []
  const foundDone = searching
    ? searchTasks(doneTasks.filter(t => !inBlock(t)), search, titleOf).sort((a, b) => (b.fait ?? '').localeCompare(a.fait ?? ''))
    : []
  const foundCount = foundOpen.length + foundDone.length
  const foundShown = foundOpen.slice(0, SEARCH_MAX)
  const foundDoneShown = foundDone.slice(0, Math.max(0, SEARCH_MAX - foundShown.length))
  const tree = searching
    ? searchTree([...foundShown, ...foundDoneShown], allTasks, t => short(t).titre, prereqsFor)
    : !showDone
    ? // Une mère close du jour (#163) passe le filtre de la vue, elle ou une de ses filles (#339).
      byTree(sortTasks(treeShown, sortOrder), allTasks, t => short(t).titre, prereqsFor, today, true, viewKeeps({ axis, attend, who }, me, today, relanceDays, t => isLive(t) || blocked(t)))
    : []

  const setAxis = (a: string) => () => pressAxis($, a)
  const toggleDone = () => pressDone($, showDone)
  // Un tiers choisi revient, au second clic, à « Attend un tiers ».
  const setAttend = (v: string, back = 'all') => () => {
    void setView($, () => ({ attend: attend === v ? back : v, showDone: false, closedGroups: [], moreGroups: [] }))
  }
  const showAll = () => {
    void setView($, () => ({ axis: 'all', attend: 'all', who: 'all', showDone: false, closedGroups: [], moreGroups: [] }))
  }
  // Sous un filtre tout est déplié et l'on replie ; sans filtre tout est replié et l'on déplie.
  // Une mère de la vue Done (#203, maquette C) : repliée tant qu'on ne l'a pas dépliée, filtre ou non.
  const doneMother = (name: string) => name.startsWith(DONE_TREE_PREFIX)
  const isOpenGroup = (name: string) => (filtered && !doneMother(name) ? !closedGroups.includes(name) : openGroups.includes(name))
  const toggleIn = (list: string[], name: string) => (list.includes(name) ? list.filter(g => g !== name) : [...list, name])
  const toggleGroup = (name: string) => () =>
    void setView($, v => (filtered && !doneMother(name) ? { closedGroups: toggleIn(v.closedGroups, name) } : { openGroups: toggleIn(v.openGroups, name) }))

  // --- Éditer un axe (#286, maquette B choisie par Bertrand le 2026-11-04) ---------------------------
  // Au survol de sa ligne de légende ou de sa tête de section, un crayon ; au clic, la ligne devient
  // l'édition : le nom en champ et Enregistrer, dessous les 8 couleurs, l'aperçu du renommage et Annuler.
  const axisEditKey = (where: 'legend' | 'head', a: string) => `${where}:${a}`
  // Le crayon : caché dans sa Box sans clé, que montre le survol de la ligne à clé qui la porte ; un bouton
  // sans encre le couvre, peint après la zone de clic de la ligne, qui ne reçoit donc pas ce clic. Au terminal, rien.
  const axisPen = (where: 'legend' | 'head', a: string) =>
    Svg ? (
      <Box width={2} flexShrink={0} flexDirection="row" justifyContent="center" alignItems="center">
        <Box display="none" hover={{ display: 'flex' }}>
          <Svg source={rowMark(pencilIcon(palette.text2, SIZE.icon.sm), SIZE.icon.sm, 24)} alt="Modifier l'axe" width={SIZE.icon.sm} height={24} />
        </Box>
        <Box position="absolute" top={0} left={0} right={0} bottom={0} flexDirection="row" justifyContent="center" alignItems="center">
          <Button
            key={`axis-pen:${where}:${keyPart(a)}`}
            plain
            onPress={() => void setView($, () => ({ axisEdit: axisEditKey(where, a), axisDraft: undefined, axisPick: '', axisNote: '' }))}
          >
            {CHECK_OVERLAY}
          </Button>
        </Box>
      </Box>
    ) : null
  // Ce que dira l'enregistrement : « N lignes : a → b », ou le refus d'un nom sans slug ou déjà pris.
  const axisPreview = (a: string, draft: string): { text: string; refused: boolean } => {
    const to = axisSlug(draft)
    if (to === '') return { text: 'Ce nom ne donne aucun slug : mets-y au moins une lettre ou un chiffre.', refused: true }
    if (to === a) return { text: '', refused: false }
    if (order.includes(to)) return { text: `L'axe « ${to} » existe déjà : choisis un autre nom.`, refused: true }
    const n = allTasks.filter(t => t.axis === a).length
    return { text: `${n} ligne${n > 1 ? 's' : ''} : ${a} → ${to}`, refused: false }
  }
  const axisEditor = (a: string) => {
    const draft = view.axisDraft ?? axisShown(a)
    const chosen = AXIS_NAMES.find(n => n === view.axisPick) ?? source.axes?.[a]?.color ?? AXIS_NAMES[(ranks.get(a) ?? 0) % AXIS_NAMES.length] ?? 'bleu'
    const hex = axisColor(palette, AXIS_NAMES.indexOf(chosen))
    const preview = axisPreview(a, draft)
    const note = view.axisNote ?? ''
    // Ne s'écrit que la couleur choisie (ici ou avant) : celle du rang reste libre de suivre l'ordre.
    const kept = AXIS_NAMES.find(n => n === view.axisPick) ?? source.axes?.[a]?.color
    const save = () => void saveAxisEdit($, source, a, view.axisDraft ?? axisShown(a), kept)
    return (
      <Box key={`axis-edit:${keyPart(a)}`} flexDirection="column" gap={SPACE.tight} paddingX={SPACE.indent} paddingY="xs">
        <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
          {tallIcon(squareIcon(hex), a, 16, '■', axisTheme(a))}
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            {Input ? (
              <Input
                key="axis-name"
                placeholder="Nom de l'axe"
                value={draft}
                submitLabel="↵"
                onInput={(value: string) => void setView($, () => ({ axisDraft: value, axisNote: '' }))}
                onSubmit={(value: string) => void setView($, () => ({ axisDraft: value, axisNote: '' })).then(() => saveAxisEdit($, source, a, value, kept))}
              />
            ) : (
              <Text weight="semibold" wrap="truncate-end">{draft}</Text>
            )}
          </Box>
          <Box flexShrink={0}>
            <Button key="axis-save" variant="primary" label={note === SAVE_BUSY ? 'Enregistrement…' : 'Enregistrer'} onPress={save} />
          </Box>
        </Box>
        <Box flexDirection="row" alignItems="center" gap={SPACE.row} paddingLeft={2}>
          {AXIS_NAMES.map((n, i) => (
            <Box key={`axis-swatch:${n}`} flexShrink={0}>
              {Svg ? (
                <Svg source={axisSwatchIcon(axisColor(palette, i), n === chosen, palette.text)} alt={n === chosen ? `${n}, choisie` : n} width={20} height={20} />
              ) : null}
              {Svg ? (
                <Box position="absolute" top={0} left={0} right={0} bottom={0} flexDirection="row" justifyContent="center" alignItems="center">
                  <Button key={`axis-color:${n}`} plain onPress={() => void setView($, () => ({ axisPick: n, axisNote: '' }))}>
                    {CHECK_OVERLAY}
                  </Button>
                </Box>
              ) : (
                <Button key={`axis-color:${n}`} plain dimColor={n !== chosen} label={n} onPress={() => void setView($, () => ({ axisPick: n, axisNote: '' }))} />
              )}
            </Box>
          ))}
        </Box>
        <Box flexDirection="row" justifyContent="space-between" alignItems="center" gap={SPACE.row} paddingLeft={2}>
          <Box flexShrink={1} minWidth={0}>
            {(note !== '' && note !== SAVE_BUSY) || preview.text !== '' ? (
              <Text size="caption" color={(note !== '' && note !== SAVE_BUSY) || preview.refused ? palette.lateOn : palette.text2} wrap="wrap">
                {note !== '' && note !== SAVE_BUSY ? note : preview.text}
              </Text>
            ) : null}
          </Box>
          <Box flexShrink={0}>
            <Button key="axis-cancel" plain label="Annuler" onPress={() => void setView($, () => ({ axisEdit: '', axisDraft: undefined, axisPick: '', axisNote: '' }))} />
          </Box>
        </Box>
      </Box>
    )
  }

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
    /** L'axe de la ligne (#286) : son crayon au survol, et l'édition à sa place quand elle est ouverte. */
    axis?: string
  }) => {
    if (o.axis !== undefined && view.axisEdit === axisEditKey('legend', o.axis)) return axisEditor(o.axis)
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
        {/* Dans un panneau étroit, c'est le nom qui se tronque : l'icône, le crayon et les chiffres gardent leur place. */}
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
        {/* La zone de clic de la ligne, puis le crayon juste après le nom (#326), peint par-dessus elle (#286). */}
        {o.onPress && hit(o.key, o.onPress)}
        {o.axis !== undefined && axisPen('legend', o.axis)}
        <Box flexGrow={1} />
        <Box flexDirection="row" flexShrink={0}>
          {/* La part d'abord, puis le nombre de tâches en petite pastille, comme le compte des sections ; chacun
              calé à droite de sa case, en rangée (#326) : sans elle, `flex-end` calait en hauteur, pas à droite. */}
          <Box width={shareCol} flexDirection="row" justifyContent="flex-end">
            <Text tabular color={o.muted ? palette.text3 : faded(palette.text, o.dim)}>{o.share}</Text>
          </Box>
          <Box width={numCol} flexDirection="row" justifyContent="flex-end">
            {countPill(o.n, o.dim || Boolean(o.muted), ink2)}
          </Box>
        </Box>
      </Box>
    )
  }

  // Une pastille : échéance dépassée (horloge), échéance à venir, tiers attendu et responsable (personne), « à revoir ».
  const pillColors: Record<Pill['kind'], { bg: string; fg: string; strong: boolean }> = {
    late: { bg: palette.lateTint, fg: palette.lateOn, strong: true },
    due: { bg: palette.sel, fg: palette.text2, strong: false },
    // Dans les 7 jours (#99) : orange.
    soon: { bg: palette.blockTint, fg: palette.blockOn, strong: true },
    // Rose, avec ses flèches en boucle (#280).
    recur: { bg: palette.recurTint, fg: palette.recurOn, strong: false },
    // La skill d'une routine (#280) : grise.
    skill: { bg: palette.sel, fg: palette.text2, strong: false },
    wait: { bg: palette.waitTint, fg: palette.waitOn, strong: true },
    // Une attente qui dort (#99) : orange à 7 jours, rouge à 14.
    waitAging: { bg: palette.blockTint, fg: palette.blockOn, strong: true },
    waitOld: { bg: palette.lateTint, fg: palette.lateOn, strong: true },
    stale: { bg: palette.sel, fg: palette.text2, strong: false },
    // Le responsable quand ce n'est pas moi (#76) : la teinte d'une attente, sans gras, avec la personne
    // (#247, BBR : « remettre de la couleur sur la personne », grise depuis #224).
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
  const mergeMark = () =>
    Svg ? (
      <Svg source={mergeIcon(palette.wait, 14, STROKE.pill, 'À fusionner')} alt="À fusionner" width={SIZE.icon.sm} height={SIZE.icon.sm} isInteractive />
    ) : (
      <Text color="suggestion">⑂</Text>
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

  // Le dessin d'une pastille de la liste ; sa largeur compte aussi dans les colonnes (#198).
  const rowPillSpec = (p: Pill) => {
    const c = pillColors[p.kind]
    const mark: PillMark | undefined = p.kind === 'late' ? 'clock' : p.kind === 'recur' ? 'repeat' : p.kind === 'wait' || p.kind === 'waitAging' || p.kind === 'waitOld' || p.kind === 'owner' ? 'person' : undefined
    return { text: p.text, bg: c.bg, fg: c.fg, ...(mark ? { mark } : {}), weight: (c.strong ? 600 : 500) as 500 | 600 }
  }
  type PillSpec = Parameters<typeof drawnPill>[0]
  // Les pastilles d'une ligne (#198) : les tags (retour, récurrence, responsable, puis les clés
  // montrées ; un enfant de l'arbre ne reprend pas celles de son parent) et l'échéance à part, chacun
  // dans sa colonne. Une faite ou une mère grise n'en a aucune ; en session ou bloquée, ni échéance ni
  // responsable : la roue ou le cadenas le disent. Dans l'arbre, une seule clé : le département (#163).
  // La section de chaque ligne dessinée (#265) : rempli avec les groupes, lu par `rowParts`.
  const sectionOf = new Map<Task, string>()
  const dayQuiet = (t: Task) => !searching && !showDone && dayFilterQuiet(attend, today, t)
  const rowParts = (t: Task, o: { tree: boolean; ghost: boolean; inSession: boolean; locked: boolean; parent?: Parameters<typeof keyPills>[3] }) => {
    if (o.ghost || t.done) return { feedback: false, keys: [] as PillSpec[], tags: [] as PillSpec[], due: undefined as PillSpec | undefined }
    const feedback = t.feedback !== undefined
    // Une ligne ne redit pas sa tête (#265) : ni le jour de sa section, ni la personne de sa section.
    const quiet = bandQuiet(sectionOf.get(t), t)
    // Sous Ma journée ou Demain (#268), le jour que le filtre dit déjà.
    if (dayQuiet(t)) quiet.due = true
    const split: { due?: Pill; tags: Pill[] } = !o.inSession && !o.locked ? splitRowPills(listPills(t, today, me)) : { tags: [] }
    const listed: { due?: Pill; tags: Pill[] } = {
      ...(split.due && !quiet.due ? { due: split.due } : {}),
      tags: quiet.who ? split.tags.filter(p => p.kind !== 'owner') : split.tags,
    }
    const keys: PillSpec[] = !clesVisibles
      ? []
      : o.tree
        ? [treeDepartment(t, { enabled: settings.axisPill, axisFilter: axis, clesVisibles })].filter((x): x is string => x !== undefined).map(text => ({ text, bg: palette.sel, fg: palette.text2, weight: 600 as const }))
        : keyPills(t, clesVisibles, cles, o.parent).map(p => ({ text: p.text, bg: palette.sel, fg: palette.text2, weight: 600 as const }))
    const tags: PillSpec[] = [...(feedback ? [{ text: 'Retour', bg: palette.waitTint, fg: palette.waitOn, weight: TEXT.weight.soft }] : []), ...listed.tags.map(rowPillSpec), ...keys]
    // Comme dans l'arbre (#258, vue de référence), dans toute vue (#259) : un retard se dit seul, « 1 j de retard ».
    const due = listed.due !== undefined && t.due !== undefined ? duePill(t.due, today, { short: true }) : listed.due
    return { feedback, keys, tags, due }
  }

  // Une tâche en session (#143) : la roue (ou la main qui t'attend), la mini-barre et le compte, dans une
  // colonne de largeur fixe (#145) : d'une ligne à l'autre, la roue et la barre gardent leur place et leur
  // taille, quels que soient le titre, le compte (« 2/7 », « 8/11 ») ou l'absence de note ; seule la
  // découpe de la barre change. Pas de carte au survol (#145) : la ligne la coupait ; la fiche montre les étapes.
  // Une ligne du bloc « En cours » de Maestro (#160) lit les étapes et l'attente de sa session à lui.
  // La colonne tient tout son contenu, à la largeur du plus long compte montré (#177) : jamais coupé.
  const stepsCells = rowStepsCells([
    ...[...blockSteps].map(([id, st]) => stepsView(st.steps, { now, at: st.at, closed: blockOf.get(id)?.closed === true })?.count ?? ''),
    ...[...rowSteps.values()].map(st => stepsView(st.steps, { now, at: st.at, closed: false })?.count ?? ''),
  ])
  // Une session close du bloc (#218) : « Completed » et l'icône d'archivage après la colonne des étapes,
  // dans une case que toutes les lignes du bloc gardent, pour que les barres restent alignées.
  const blockDone = [...blockOf.values()].some(bt => bt.state === 'done')
  // Le mot du panneau, « Done » (#254) ; la bande au-dessus de la saisie garde le sien.
  const completedWord = stateBand({ state: 'done' }).word
  const blockEndCells = blockDone ? [...completedWord].length + 1 + 2 : 0
  const blockEnd = (t: Task, block: BrandTask) => {
    if (!blockDone) return null
    const done = block.state === 'done'
    return (
      <Box key={`end:${t.key}`} flexDirection="row" alignItems="center" justifyContent="flex-end" gap={SPACE.row} flexShrink={0} {...(Svg ? { width: blockEndCells } : {})}>
        {done && <Text size="caption" color={block.finished ? palette.finishedOn : palette.text2}>{completedWord}</Text>}
        {done && block.archivable && block.sessionId && (
          <Box key={`ba:${t.key}`} flexDirection="row" alignItems="center" flexShrink={0}>
            {Svg ? <Svg source={archiveIcon(palette.text2, 14)} alt="Archiver la session" width={SIZE.icon.sm} height={SIZE.icon.sm} /> : null}
            {graphic ? hit(`block-archive:${block.id}`, () => void archiveBandSession($, block, now), 1) : <Button key={`block-archive:${block.id}`} plain dimColor label="Archiver" onPress={() => void archiveBandSession($, block, now)} />}
          </Box>
        )}
      </Box>
    )
  }
  // La pastille d'une suite de la file (#321) : son texte au dessin, sa commande dans son alt.
  const queuePill = (m: QueueMark) => {
    const tone = m.tone === 'block' ? { bg: palette.blockTint, fg: palette.blockOn } : m.tone === 'live' ? { bg: palette.liveTint, fg: palette.liveOn } : { bg: palette.sel, fg: palette.text2 }
    const alt = m.command ? `${m.text}, ${m.command}` : m.text
    if (Svg) {
      const pill = pillIcon({ text: m.text, ...tone, weight: TEXT.weight.soft })
      return <Svg source={pill.source} alt={alt} width={pill.width} height={pill.height} />
    }
    return <Text size="caption" color={tone.fg}>{m.text}</Text>
  }
  const sessionColumn = (t: Task, block?: BrandTask) => {
    const status = block ? blockSteps.get(block.id) : rowSteps.get(taskKey(t))
    // #191 : finie, sa branche en avance, sans question : à fusionner, ni la main ni la roue.
    const sid = liveOf(t)?.entry.sessionId
    const merging = block ? block.state === 'merge' : waitingOn(t) && status?.question === undefined && (sid ? (aheadBySession.get(sid)?.ahead ?? 0) : 0) > 0
    const waiting = (block ? block.state === 'wait' : waitingOn(t)) && !merging
    // Close (#218) : la coche, violette quand la session ne tourne plus, et sa jauge pleine, comme la bande.
    const completed = block?.state === 'done'
    const view = status ? stepsView(status.steps, { now, at: status.at, closed: t.done }) : undefined
    const bar = status && view ? stepsBarIcon(palette, view.segments, { width: ROW_STEPS.bar, height: 4, waiting: waiting || status.question !== undefined, merging, finished: block?.finished === true }) : undefined
    const checkHex = block?.finished ? palette.finished : palette.done
    // Sa suite dans la file des tests lourds (#321, maquette C) : la pastille à la place de la barre et du compte.
    const queued = block && t.branche !== undefined ? heavyMarks.get(t.branche) : undefined
    return (
      <Box key={`steps:${t.key}`} flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0} {...(Svg ? { width: stepsCells.columns } : {})}>
        <Box width={ROW_STEPS.icon} flexShrink={0} flexDirection="row" justifyContent="center">
          {completed ? (Svg ? <Svg source={checkIcon(checkHex, 14, STROKE.pill)} alt={completedWord} width={SIZE.icon.sm} height={SIZE.icon.sm} /> : <Text size="caption" color={checkHex}>✓</Text>) : merging ? mergeMark() : waiting ? hand() : spinner()}
        </Box>
        {queued ? (
          <Box flexGrow={1} flexShrink={1} minWidth={0} flexDirection="row" justifyContent="flex-end">
            {queuePill(queued)}
          </Box>
        ) : Svg &&
          (bar && view ? (
            <Svg source={bar.source} alt={`étapes ${view.count}`} width={bar.width} height={bar.height} />
          ) : (
            <Svg source={`<svg xmlns="http://www.w3.org/2000/svg" width="${ROW_STEPS.bar}" height="4"/>`} alt="espace" width={ROW_STEPS.bar} height={4} />
          ))}
        {!queued && (
          <Box width={stepsCells.count} flexShrink={0} flexDirection="row" justifyContent="flex-end">
            {view && <Text size="caption" tabular color={palette.text3}>{view.count}</Text>}
          </Box>
        )}
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
    // Grise seulement dans les Done (#203) : une mère ouverte parmi les faites. Sous un filtre des ouvertes
    // (Ma journée…), la mère gardée pour ses filles est une ouverte : pleine encre, comme dans Toutes (#296).
    const greyed = ghost && showDone
    // La case (#198 ; sélection, #316, maquette C) : le carré d'axe de toute ligne, ouverte ou faite,
    // dans toutes les vues, choisit sa tâche (fond bleu, filet bleu autour du carré) ; la barre de
    // sélection l'édite. La mère de l'arbre aussi, avec ses étapes : sa flèche, à part, la replie. Ni
    // une mère hors de l'arbre (sa flèche est dans son carré), ni une mère grise, ni une ligne du bloc de Maestro.
    const checkable = !ghost && block === undefined && (!head || (tree !== undefined && !chain && Svg !== undefined))
    const chosen = checkable && pickedSet.has(taskKey(t))
    // Dans la question d'une coche (#355) : la case cerclée du vert de la coche, à la place du bleu de la sélection.
    const asked = checkable && askedSet.has(taskKey(t))
    const kids = head && t.id !== undefined ? allTasks.filter(k => k.parent === t.id && k.id !== t.id) : []
    // La case coche ou rouvre ; le numéro choisit, puis la case ajoute tant que la barre est ouverte (#355).
    const pick = () => void caseClick($, source, t, kids, 'case')
    const pickByNumber = () => void caseClick($, source, t, kids, 'number')
    // Une marque de 16 × 24 tient la hauteur de la ligne : ni cale ni coins arrondis par ligne de
    // tâche (sur une roadmap de 120 tâches dépliées, 870 dessins figeaient le panneau).
    // Une tâche d'une chaîne : le trait et son étape font partie de la marque, un seul dessin.
    // Une faite (#180, maquette C) : le carré de son axe, à pleine couleur, coché de blanc ; on le
    // reclique pour la rouvrir. Une mère faite garde sa flèche.
    const checkedMark = t.done && !head && Svg !== undefined
    // La case qui vient d'être cochée ou rouverte joue son mouvement (#182, maquette A), une fois, dans
    // le cadre interactif qui seul joue le SMIL ; ensuite, le dessin fixe.
    const moving = Svg !== undefined && !head && !ghost ? checkMoveOf($, taskKey(t), t.done, now) : undefined
    // Une tâche faite qui reste dans les ouvertes le temps de sa tenue (#351) : sa ligne se teinte.
    const lingering = t.done && !head && !ghost && checkLingers(checkMoves.get(taskKey(t)), now)
    const markSource =
      moving !== undefined
        ? squareCheckMoveIcon(axisHex(t.axis), palette.onAxis, t.done, moving, palette.ok)
        : asked || chosen
          ? squareArmedRowIcon(axisHex(t.axis), asked ? palette.ok : palette.live, palette.onAxis, checkedMark)
          : checkedMark
            ? squareCheckRowIcon(axisHex(t.axis), palette.onAxis)
            : squareRowIcon(axisHex(t.axis))
    // L'arbre par axe (#168) : la mère porte sa flèche dans son carré, une fille son coude.
    // La vue de référence (#258, maquette A) : la flèche de la mère sort de son carré, grise, devant le # ;
    // une tâche seule garde sa place vide, une fille pose son carré sous le # de sa mère. Hors de l'arbre aussi
    // (#259 : recherche, « À relancer », bloc « En cours ») : la place vide, pour que les # s'alignent.
    // Dans l'arbre, la marque rapprochée (#265) : 24 px, une fille 45 ; hors de lui, 32 (#259).
    // Dans l'arbre, la mère et la tâche seule (#282) : la marque n'est que le carré (16 px) ; la flèche a son
    // dessin, centré dans la place qui va de la marque au #, dans un groupe sans écart (`grouped`).
    const grouped = tree !== undefined && !child && !chain && Svg !== undefined
    const markWidth = child ? TREE_CHILD_PX : grouped ? MARK_SQUARE_PX : tree ? TREE_MARK_PX : 32
    const drawn = head
      ? grouped
        ? asked || chosen
          ? squareArmedRowIcon(axisHex(t.axis), asked ? palette.ok : palette.live, palette.onAxis, false)
          : squareRowIcon(axisHex(t.axis))
        : treeMotherRowIcon(axisHex(t.axis), head.open, palette.text2)
      : child
        ? treeChildRowIcon(markSource, child.last, palette.border)
        : chain
          ? chainRowIcon(markSource, chain.pos, chain.step, palette.text3, palette.text2)
          : grouped
            ? markSource
            : treeAloneRowIcon(markSource, markWidth)
    const markAlt = `${isAbandoned(t) ? 'annulée' : t.done ? 'faite' : t.axis}${chosen ? ', choisie' : ''}${asked ? ', à confirmer' : ''}${chain ? `, étape ${chain.step}` : ''}${head ? (head.open ? ', replier' : ', déplier') : ''}`
    const checkKey = `check:${t.id ?? keyPart(t.key)}`
    const markFaded = greyed || (t.done && !checkedMark)
    const mark = Svg ? (
      <Svg source={markFaded ? fade(drawn, true) : drawn} alt={markAlt} width={markWidth} height={24} {...(moving !== undefined ? { isInteractive: true } : {})} />
    ) : head ? (
      <Text color={axisTheme(t.axis)}>{head.open ? '⌄' : '›'}</Text>
    ) : checkable ? (
      // Au terminal, sans dessin : le carré est le bouton lui-même.
      <Button key={checkKey} plain onPress={pick}>{chosen ? '▣' : '■'}</Button>
    ) : (
      <Text color={axisTheme(t.axis)}>■</Text>
    )
    // Sur le bureau, un bouton sans encre couvre le carré : un bouton ne porte pas de dessin, et une
    // zone de clic par ligne dépasserait ZONE_LIMIT (#180). Peint après le carré, il reçoit le clic.
    // Son survol tombe sur le carré (#282) : une Box en % de la marque, dont le centre est celui du carré
    // (après un trait de chaîne, après un coude), le centre ; un décalage en cellules glissait d'une app à
    // l'autre (une cellule de ~7,8 ou ~9 pt), et le bouton posé par la gauche débordait à droite.
    const ghostRing = squareGhostRingIcon(mixOver(palette.live, palette.bg, MIX.ring))
    const squareCenter = child ? MARK_SQUARE_CENTER.child : chain ? MARK_SQUARE_CENTER.chain : MARK_SQUARE_CENTER.mark
    if (checkable && Svg) ghostPressKeys.add(checkKey)
    if (Svg) ghostPressKeys.add(t.key)
    const squareHit = checkable && Svg ? (
      // L'anneau fantôme du survol (#351, maquette C) : cette Box est sa propre portée de survol (sa clé). Sans
      // filet : un filet `transparent` se peignait en blanc au bureau, haut comme la ligne (#364). L'anneau est
      // le dessin de la sélection en `live` pâle, dans une Box cachée que le survol montre, centrée sur le carré.
      // Vu au banc du bureau (#364) : un Svg à `alt` vide n'y est jamais dessiné, d'où son alt ; et une Box
      // absolue se peint au-dessus d'un frère qui ne l'est pas, d'où le bouton dans sa Box absolue, après l'anneau.
      <Box key={`ring:${t.id ?? keyPart(t.key)}`} position="absolute" top={0} bottom={0} left={0} width={squareHitWidth(squareCenter, markWidth)}>
        <Box position="absolute" top={0} bottom={0} left={0} right={0} flexDirection="row" justifyContent="center" alignItems="center" display="none" hover={{ display: 'flex' }}>
          <Svg source={ghostRing} alt="Anneau de survol" width={16} height={24} />
        </Box>
        <Box position="absolute" top={0} bottom={0} left={0} right={0} flexDirection="row" justifyContent="center" alignItems="center">
          <Button key={checkKey} plain onPress={pick}>
            {CHECK_OVERLAY}
          </Button>
        </Box>
      </Box>
    ) : null
    // Le repli d'une mère, sur sa marque : la zone de l'en-tête quand le dessin en a la place ; sans zone de
    // clic (un gros projet, #224), un bouton sans encre posé dessus, centré dans l'arbre (#282).
    const foldHit = (id: string, align: 'left' | 'center') =>
      !Svg ? null : headZones ? hit(`group:${id}`, toggleGroup(id), 1) : (
        <Box position="absolute" top={0} bottom={0} left={0} right={0} flexDirection="row" alignItems="center" justifyContent={align === 'center' ? 'center' : 'flex-start'}>
          <Button key={`group:${keyPart(id)}`} plain onPress={toggleGroup(id)}>
            {CHECK_OVERLAY}
          </Button>
        </Box>
      )
    // Une date tue sous sa tête (#265) ne laisse pas l'âge prendre sa place : le bout reste vide.
    const dueQuiet = !t.done && (bandQuiet(sectionOf.get(t), t).due || dayQuiet(t))
    const right = dueQuiet ? '' : doneRights.get(t) ?? (tree ? (t.done ? 'fait' : days === undefined ? '' : ageLabel(days)) : t.done ? axisShown(t.axis) : days === undefined ? '' : ageLabel(days))
    // Une tâche faite dont la session reste ouverte : y retourner, ou l'archiver, d'un clic.
    const kept = block === undefined && sessionRows.has(taskKey(t)) ? doneSessionOf(t) : undefined
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
    const parts = rowParts(t, { tree: tree !== undefined, ghost, inSession, locked, ...(child?.parent ? { parent: child.parent } : {}) })
    // En session, la ligne tient dans la largeur (#177, #248 de Splitmybill) : une pastille qui ne laisse
    // pas sa place au titre part, avant que la colonne de session ne soit poussée hors du panneau. Ses
    // pastilles sont la Feedback et les clés (sans `listPills`), dans cet ordre. Le retrait compte les
    // marges du panneau, du cadre du bloc et de la ligne.
    // Dans l'arbre aussi (#258, la ligne la plus chargée de la vue de référence) : sa marque, son # serré,
    // la jauge de la mère, le département et l'échéance comptent dans ce qui ne rétrécit pas.
    const gaugeCells = head ? pxCells(34) + 1 + pxCells(7.3 * `${head.block.done}/${head.block.total}`.length) + 1 : 0
    const dueCells = parts.due ? Math.max(AGE_CELLS, pxCells(6.5 * [...parts.due.text].length)) : AGE_CELLS
    // Jamais dans « En cours » (#177) : le bloc de Maestro ou le filtre ; le carré d'axe suffit.
    // La priorité (#300, maquette D1) : le drapeau blanc dans son carré rouge, juste devant le titre, le
    // réglage « Priorités » allumé, sur une ouverte ; il compte dans ce qui ne rétrécit pas.
    const prioritized = settings.priorities && !t.done && isPriority(t)
    const priorityCells = prioritized && Svg ? pxCells(PRIORITY_PX.row) + 1 : 0
    const department = ghost ? undefined : axisPillText(t, { enabled: settings.axisPill, axisFilter: axis, live: block !== undefined || attend === 'live', groupedByAxis: tree !== undefined && !rangerPar && (by === 'subject' || attend === 'relaunch'), clesVisibles })
    // Le département ne part pas : il compte dans ce qui ne rétrécit pas (#259, la recherche le montre).
    const departmentCells = department !== undefined && Svg ? pxCells(pillIcon({ text: department, bg: palette.sel, fg: palette.text2, weight: 600 }).width) + 1 : 0
    // Hors de l'arbre (#259), la même ligne : la marque de 32 px et le # serré, en session comme hors session.
    const shownTags =
      !inSession && Svg
        ? parts.tags.slice(
            0,
            fitRowPills({
              columns: (e.props as { bodyColumns?: number }).bodyColumns ?? 56,
              inset: 4,
              steps: gaugeCells + dueCells + departmentCells + priorityCells,
              pills: parts.tags.map(spec => pxCells(pillIcon(spec).width)),
              mark: grouped ? 0 : markWidth,
              number: grouped ? treeNumCells + TREE_LEAD_CELLS : treeNumCells,
            }).kept,
          )
        : inSession && Svg
        ? parts.tags.slice(
            0,
            fitRowPills({
              columns: (e.props as { bodyColumns?: number }).bodyColumns ?? 56,
              inset: 6,
              steps: stepsCells.columns + (block ? blockEndCells : 0) + priorityCells,
              pills: parts.tags.map(spec => pxCells(pillIcon(spec).width)),
              mark: grouped ? 0 : markWidth,
              number: grouped ? treeNumCells + TREE_LEAD_CELLS : treeNumCells,
            }).kept,
          )
        : parts.tags
    const pills = shownTags.map(spec => drawnPill(spec))
    // L'échéance en texte, de la couleur de son urgence (#203, maquette C des étiquettes).
    const due = parts.due && !t.done ? (
      <Box key={`dl:${t.key}`} flexShrink={0}>
        <Text size="caption" tabular color={dueInk(parts.due.kind, palette)} wrap="end">
          {parts.due.text}
        </Text>
      </Box>
    ) : null
    const number = t.id ? taskNumber(t.id, rowSession ? () => void openSession($, rowSession.entry) : undefined, t.done, grouped ? (head ? 'content' : 'grow') : undefined, checkable ? { press: pickByNumber, chosen } : undefined) : undefined
    return (
      <Box
        key={`hit:${t.key}`}
        flexDirection="row"
        alignItems="center"
        gap={SPACE.row}
        paddingX={SPACE.indent}
        {...(chosen ? { backgroundColor: palette.liveTint } : lingering ? { backgroundColor: palette.doneTint, hover: { backgroundColor: palette.hover } } : { hover: { backgroundColor: palette.hover } })}
      >
        {/* Une tâche d'une chaîne, au terminal : le trait en glyphe et son étape (1 pour la tête). */}
        {(chain || child) && !Svg && (
          <Box key={`c:${t.key}`} flexDirection="row" alignItems="center" flexShrink={0}>
            <Text color={palette.text3}>{child ? (child.last ? '└' : '├') : chain?.pos === 'first' ? '┌' : chain?.pos === 'last' ? '└' : '├'}</Text>
            {chain && <Text size="caption" tabular color={palette.text2}>{String(chain.step)}</Text>}
          </Box>
        )}
        {/* La mère (#168) : sa flèche suit son carré (#258) ; la marque la replie, par la zone de
            l'en-tête quand le dessin en a la place, sinon par un bouton en glyphe. */}
        {head && !Svg ? (
          <Button key={`group:${keyPart(head.id)}`} plain dimColor onPress={toggleGroup(head.id)}>
            {head.open ? '⌄' : '›'}
          </Button>
        ) : grouped ? (
          // Dans l'arbre (#282) : le carré, la place de la flèche, puis le # calé à droite, sans écart entre eux.
          // La place grandit jusqu'au # : la flèche y est centrée, au milieu du carré et du #, quelle que soit
          // la largeur d'une cellule ou du numéro ; une tâche seule la garde vide. La mère se replie par le
          // carré et la flèche.
          // Une tâche seule : sa marque, puis son # qui prend la place qui reste, calé à droite (une Box de
          // moins par ligne : le poids d'un dessin est borné).
          <Box flexDirection="row" alignItems="center" flexShrink={0} width={treeNumCells + TREE_LEAD_CELLS}>
            {head ? (
              <Box flexDirection="row" alignItems="center" flexGrow={1} flexShrink={1}>
                {/* Le carré de la mère la choisit avec ses étapes (#316) ; la flèche, à côté, la replie. */}
                <Box flexShrink={0}>
                  {mark}
                  {squareHit}
                </Box>
                <Box flexDirection="row" alignItems="center" flexGrow={1} justifyContent="center">
                  <Svg source={fade(treeFoldIcon(head.open, palette.text2), markFaded)} alt={head.open ? 'Replier' : 'Déplier'} width={TREE_FOLD_PX} height={24} />
                  {foldHit(head.id, 'center')}
                </Box>
              </Box>
            ) : (
              <Box flexShrink={0}>
                {mark}
                {squareHit}
              </Box>
            )}
            {number}
          </Box>
        ) : (
          <Box flexShrink={0}>
            {mark}
            {head && foldHit(head.id, 'left')}
            {squareHit}
          </Box>
        )}
        {/* Le titre suit le numéro (#203, maquette C des étiquettes) : plus de colonne réservée devant
            lui ; les tags viennent à droite du titre, l'échéance au bout, en texte, à la place de l'âge. */}
        {!grouped && number}
        <Box key={`lead:${t.key}`} flexDirection="row" alignItems="center" flexGrow={1} flexShrink={1} minWidth={0}>
          {prioritized &&
            (Svg ? (
              <Box key={`prio:${t.key}`} flexShrink={0} paddingRight={SPACE.row}>
                <Svg source={priorityIcon(true, palette, PRIORITY_PX.row)} alt="Prioritaire" width={PRIORITY_PX.row} height={PRIORITY_PX.row} />
              </Box>
            ) : (
              <Text key={`prio:${t.key}`} color={palette.lateOn}>{'⚑ '}</Text>
            ))}
          {/* Sur le bureau (#224, maquette C de #212), le titre est un texte : la mère en gras, une faite grise
              et barrée (#198), un titre provisoire estompé ; un bouton natif imposerait son encre, sa
              graisse et sa marge. Un bouton sans encre le couvre et ouvre la fiche. Au terminal, le bouton. */}
          {Svg ? (
            <Text wrap="truncate-end" {...(head ? { weight: 'semibold' as const } : {})} {...(t.done ? { strikethrough: true, color: lingering ? palette.text2 : palette.text3 } : greyed || !titled(t) ? { color: palette.text2 } : {})}>
              {s.titre}
            </Text>
          ) : null}
          {Svg ? (
            <Box position="absolute" top={0} left={0}>
              <Button key={t.key} plain onPress={select(selectionOf(t))}>
                {titleOverlay(s.titre)}
              </Button>
            </Box>
          ) : (
            <Button key={t.key} plain dimColor={greyed || (!t.done && !titled(t))} onPress={select(selectionOf(t))}>
              <Text wrap="truncate-end" {...(t.done ? { strikethrough: true, color: palette.text3 } : {})}>{s.titre}</Text>
            </Button>
          )}
          {/* L'avancement de la mère (#163) : sa barre et ses filles faites sur leur total, juste après son
              titre (#258, maquette A) ; le titre se coupe avant elle. */}
          {head && (
            <Box key={`gauge:${t.key}`} flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0} paddingLeft={SPACE.row}>
              {Svg ? <Svg source={progressIcon(head.block.done, head.block.total, palette.ok, palette.sel)} alt={`${head.block.done}/${head.block.total}`} width={34} height={SIZE.bar} /> : null}
              <Text size="caption" tabular color={palette.text2}>{`${head.block.done}/${head.block.total}`}</Text>
            </Box>
          )}
        </Box>
        {pills.length > 0 && (
          <Box key={`tags:${t.key}`} flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0}>
            {pills}
          </Box>
        )}
        {/* Le département (#156, maquette A) : l'axe en pastille, à droite du titre, avant l'âge ; un réglage. */}
        {department !== undefined && (
          <Box key={`axis:${t.key}`} flexShrink={0}>
            {drawnPill({ text: department, bg: palette.sel, fg: palette.text2, weight: 600 })}
          </Box>
        )}
        {/* En session : la roue ou la main qui t'attend, la barre et le compte (#143, #145), chez Maestro
            aussi, dans son bloc « En cours », sans arbre (#160). */}
        {(inSession || locked) && due}
        {inSession && sessionColumn(t, block)}
        {block && blockEnd(t, block)}
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
        {/* L'âge, à sa colonne calée à droite (#198) : les départements restent alignés. Une échéance
            prend sa place, en texte coloré (#203, maquette C des étiquettes). */}
        {/* Une mère y met sa date (#224), sa barre restée après son titre (#258) : alignée sur celles des autres lignes. */}
        {!kept && !inSession && !locked && (
          <Box key={`age:${t.key}`} minWidth={AGE_CELLS} flexShrink={0} flexDirection="row" justifyContent="flex-end">
            {due ?? (!head && right !== '' && (
              <Text size="caption" tabular color={t.done ? palette.text3 : palette.text2} wrap="end">
                {right}
              </Text>
            ))}
          </Box>
        )}
        {/* Le ▶ au bout de la ligne, à la place du chevron (#149) : le titre ouvre la fiche. Sa colonne
            reste, vide, sur une faite (#198) : les âges restent alignés. */}
        {(
          <Box key={`p:${t.key}`} width={3} flexShrink={0} flexDirection="row" justifyContent="center">
            {playable && (
              <Button key={`play:${t.key}`} plain dimColor onPress={() => void (isRoutine(t, head !== undefined) ? launchRoutine($, source, t, s.titre) : launchSession($, source, t, s.titre))}>
                {/* Une routine due (#280, maquette A) : le ▶ bleu, son clic la coche et la redate. */}
                {!head && routineDue(t, today) ? <Text color={palette.live}>▶</Text> : '▶'}
              </Button>
            )}
          </Box>
        )}
      </Box>
    )
  }

  // La barre de sélection (#316, maquette C ; calendrier C1 avec « Répéter », choix de Bertrand du
  // 2026-11-04 ; bandeau 2 de #355, choix du 2026-11-06) : « N choisies · K sujets », « ✎ Éditer » seul bouton
  // plein, « Annuler » qui vide la sélection ; plus de « Faites » : la case d'une choisie coche le lot, après
  // la question. Éditée, Date ▾ et Statut ▾ ; une date s'écrit aussitôt, « Faite » passe par la question.
  // Ses boutons sont ceux de l'app : aucune zone de clic de plus (ZONE_LIMIT).
  const batchBar = () => {
    const n = picked.length
    const subjects = new Set(allTasks.filter(t => pickedSet.has(taskKey(t))).map(t => t.axis)).size
    const editing = (view.batchMenu ?? '') !== ''
    const dateOpen = view.batchMenu === 'date'
    const run = (change: BatchChange, what: string) => () => void applyBatch($, source, change, what)
    return (
      <Box key="batch" flexDirection="column" gap={SPACE.tight}>
        <Box key="batch-bar" flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent} backgroundColor={palette.liveTint}>
          <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexGrow={1} flexShrink={1} minWidth={0}>
            <Text weight="semibold" color={palette.text} wrap="truncate-end">{editing ? `${n} choisie${n > 1 ? 's' : ''}` : `${n} choisie${n > 1 ? 's' : ''} · ${subjects} sujet${subjects > 1 ? 's' : ''}`}</Text>
          </Box>
          {editing ? (
            <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0}>
              <Button key="batch-date" {...(dateOpen ? { variant: 'primary' as const } : {})} label="Date ▾" onPress={() => void setView($, () => ({ batchMenu: dateOpen ? 'edit' : 'date' }))} />
              {Select ? (
                <Select
                  key="batch-status"
                  label="Statut"
                  options={[{ value: 'Faite' }, { value: 'Ouverte' }]}
                  onSelect={(v: string) => (v === 'Ouverte' ? run({ status: 'open' }, 'rouvertes')() : void askDone($, picked))}
                />
              ) : (
                <Button key="batch-status" label="Rouvrir" onPress={run({ status: 'open' }, 'rouvertes')} />
              )}
            </Box>
          ) : (
            <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0}>
              <Button key="batch-edit" variant="primary" label="✎ Éditer" onPress={() => void setView($, () => ({ batchMenu: 'edit', batchNote: '' }))} />
            </Box>
          )}
          <Button key="batch-clear" plain dimColor label="Annuler" onPress={() => void clearPick($)} />
        </Box>
        {dateOpen && batchCalendar(run)}
      </Box>
    )
  }

  // La question d'une coche (#355, bandeau 2 choisi par Bertrand le 2026-11-06) : en haut, à la place de la
  // barre de sélection ou de la ligne de la liste, sur la teinte des faites ; « Annuler » en lien, « ✓ Faites »
  // en pastille `ok` couverte d'un bouton sans encre (un bouton de l'app ne prend pas de couleur).
  const confirmBar = () => {
    const n = asking.length
    const one = n === 1 ? allTasks.find(t => taskKey(t) === asking[0]) : undefined
    const question = one ? `${one.id ? `#${one.id}` : `« ${clip(one.label, 30)} »`} faite ?` : `${n} tâches faites ?`
    const okLabel = n === 1 ? '✓ Faite' : '✓ Faites'
    const ok = () => void applyBatch($, source, { status: 'done' }, n === 1 ? 'faite' : 'faites', asking)
    const pill = Svg ? pillIcon({ text: okLabel, bg: palette.ok, fg: palette.onAxis, height: SIZE.pill.detail }) : undefined
    if (pill) ghostPressKeys.add('confirm-ok')
    return (
      <Box key="confirm-bar" flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent} backgroundColor={palette.doneTint}>
        <Box flexDirection="row" alignItems="center" flexGrow={1} flexShrink={1} minWidth={0}>
          <Text weight="semibold" color={palette.text} wrap="truncate-end">{question}</Text>
        </Box>
        <Button key="confirm-cancel" plain dimColor label="Annuler" onPress={() => void setView($, () => ({ confirmDone: [] }))} />
        {pill ? (
          <Box flexShrink={0}>
            <Svg source={pill.source} alt={okLabel} width={pill.width} height={pill.height} />
            <Box position="absolute" top={0} bottom={0} left={0} right={0} flexDirection="row" justifyContent="center" alignItems="center">
              <Button key="confirm-ok" plain onPress={ok}>
                {CHECK_OVERLAY.repeat(3)}
              </Button>
            </Box>
          </Box>
        ) : (
          <Button key="confirm-ok" variant="primary" label={okLabel} onPress={ok} />
        )}
      </Box>
    )
  }

  // L'encart de Date ▾ (#316, maquette C1) : les raccourcis, le mois (aujourd'hui cerclé, un point sous
  // les jours où une choisie est due, les jours passés en texte), puis « Répéter ». Une case est un
  // dessin couvert d'un bouton sans encre : pas de zone de clic.
  const batchCalendar = (run: (change: BatchChange, what: string) => () => void) => {
    const month = view.batchMonth && /^\d{4}-\d{2}$/.test(view.batchMonth) ? view.batchMonth : today.slice(0, 7)
    const quick = batchDays(today)
    const dues = new Set(allTasks.filter(t => pickedSet.has(taskKey(t)) && !t.done && t.due).map(t => t.due as string))
    const grid = monthGrid(month)
    const weeks = Array.from({ length: grid.length / 7 }, (_, i) => grid.slice(i * 7, i * 7 + 7))
    const [y, m] = month.split('-').map(Number) as [number, number]
    const monthName = `${['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'][m - 1]} ${y}`
    const setDay = (day: string) => run({ due: day }, batchDueWord(day))
    const toMonth = (k: number) => () => void setView($, () => ({ batchMonth: shiftMonth(month, k) }))
    const cell = (day: string, inMonth: boolean, col: number) => {
      const n = Number(day.slice(8))
      const past = day < today
      const ink = past || !inMonth ? palette.text3 : col >= 5 ? palette.text2 : palette.text
      const key = `batch-day:${day}`
      return (
        <Box key={`cell:${day}`} width="14%" flexDirection="row" justifyContent="center" alignItems="center">
          {Svg ? (
            <Svg
              source={calendarDayIcon({ day: n, ink, ...(day === today ? { ring: palette.text2, bold: true } : {}), ...(dues.has(day) ? { dot: palette.blockOn } : {}) })}
              alt={day}
              width={DAY_CELL_PX.width}
              height={DAY_CELL_PX.height}
            />
          ) : past ? (
            <Text size="caption" color={palette.text3}>{String(n)}</Text>
          ) : null}
          {!past &&
            (Svg ? (
              <Box position="absolute" top={0} bottom={0} left={0} right={0} flexDirection="row" justifyContent="center" alignItems="center">
                <Button key={key} plain onPress={setDay(day)}>
                  {CHECK_OVERLAY}
                </Button>
              </Box>
            ) : (
              <Button key={key} plain label={String(n)} onPress={setDay(day)} />
            ))}
        </Box>
      )
    }
    const recur = (value: 'none' | 'jour' | 'semaine' | 'mois', label: string) => (
      <Button key={`batch-recur:${value}`} label={label} onPress={run({ tous: value === 'none' ? '' : value }, value === 'none' ? 'sans récurrence' : `récurrence : ${label.toLowerCase()}`)} />
    )
    return (
      <Box key="batch-cal" flexDirection="column" gap={SPACE.tight} paddingX={SPACE.indent} paddingY="sm" backgroundColor={palette.note}>
        <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexWrap="wrap">
          <Button key={`batch-day:${quick.today}`} label="Aujourd’hui" onPress={setDay(quick.today)} />
          <Button key={`batch-day:${quick.tomorrow}`} label="Demain" onPress={setDay(quick.tomorrow)} />
          <Button key={`batch-day:${quick.monday}`} label="Lundi prochain" onPress={setDay(quick.monday)} />
          <Box flexGrow={1} />
          <Button key="batch-day:none" plain dimColor label="Sans date" onPress={setDay('')} />
        </Box>
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <Button key="batch-month:-1" plain dimColor label="‹" onPress={toMonth(-1)} />
          <Text weight="semibold">{monthName}</Text>
          <Button key="batch-month:+1" plain dimColor label="›" onPress={toMonth(1)} />
        </Box>
        <Box flexDirection="row">
          {['lu', 'ma', 'me', 'je', 've', 'sa', 'di'].map(d => (
            <Box key={`wd:${d}`} width="14%" flexDirection="row" justifyContent="center">
              <Text size="caption" color={palette.text3}>{d}</Text>
            </Box>
          ))}
        </Box>
        {weeks.map(week => (
          <Box key={`week:${week[0]?.day ?? ''}`} flexDirection="row">
            {week.map((c, i) => cell(c.day, c.inMonth, i))}
          </Box>
        ))}
        <Text size="caption" color={palette.text2}>↻ Répéter</Text>
        <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexWrap="wrap">
          {recur('none', 'Jamais')}
          {recur('jour', 'Chaque jour')}
          {recur('semaine', 'Chaque semaine')}
          {recur('mois', 'Chaque mois')}
        </Box>
      </Box>
    )
  }

  // Une section repliable : chevron, nom, et à droite le compte (et le disque rouge d'« En retard »).
  // `shownRows` : les lignes que le budget du dessin lui laisse ; au-delà, « Voir les N autres ».
  // `id` tient l'état de la section (dépliée, repliée, « Voir les N autres ») ; `name` est son libellé.
  const section = (id: string, name: string, tasks: Task[], shownRows: number, lead?: RenderElement, mark?: RenderElement, block?: TreeBlock, bare = false, focus?: Task) => {
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
    // niveau des tâches seules, sa flèche dans son carré et son avancement (« Tout clore » passe par
    // sa fiche, #198) ; ses filles, ouvertes et faites, par rang, un cran à droite, reliées par leur coude.
    if (block?.head) {
      const mother = block.head
      const shown = tasks.slice(0, shownRows)
      // Par jour, la mère repliée garde sous elle son étape du jour (#189, maquette B) ; « + N étapes »,
      // ses autres étapes ouvertes, la déplie.
      const others = focus ? block.tasks.filter(t => t !== focus).length : 0
      // La place fixe (#266, retour de Bertrand) : pliée ou dépliée, la mère garde sa place au pixel près,
      // au pas serré d'une tâche seule (#231) ; ses filles viennent juste sous elle, et seul l'écart sous la
      // dernière (la marge basse de leur boîte) s'ajoute, puis part au repli.
      return (
        <Box key={`section:${id}`} flexDirection="column">
          <Box key={`hit:group:${id}`} flexDirection="column">
            {row(mother, undefined, { kind: 'head', id, open: isOpen, ghost: block.ghost, block })}
          </Box>
          {!isOpen && focus && (
            <Box flexDirection="column" paddingBottom="sm">
              {row(focus, undefined, { kind: 'child', last: true, parent: mother })}
              {others > 0 && (
                <Box key={`unfold-row:${id}`} flexDirection="row" paddingX={SPACE.indent} paddingLeft={SPACE.nest}>
                  <Button key={`unfold:${keyPart(id)}`} plain dimColor label={`+ ${others} étape${others > 1 ? 's' : ''}`} onPress={toggleGroup(id)} />
                </Box>
              )}
            </Box>
          )}
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
            {/* Sur le bureau, le nom est toujours un texte (#295) : sans zone de clic, un bouton sans encre le
                couvre ; un bouton natif lui imposait sa marge. Au terminal, le bouton. */}
            {Svg ? (
              <Box flexDirection="row" alignItems="center" flexShrink={1} minWidth={0}>
                <Text wrap="truncate-end">{name}</Text>
                {!headZones && (
                  <Box position="absolute" top={0} left={0}>
                    <Button key={`group:${keyPart(id)}`} plain onPress={toggleGroup(id)}>
                      {titleOverlay(name)}
                    </Button>
                  </Box>
                )}
              </Box>
            ) : (
              <Button key={`group:${keyPart(id)}`} plain label={name} onPress={toggleGroup(id)} />
            )}
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
              const chains = block ? new Map<Task, ChainStep>() : chainSteps(tasks, prereqFor)
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
  // Une close du bloc « En cours » (#218) n'y est pas redite : sa ligne est dans le bloc.
  const doneShown = doneTasks
    .filter(t => matches(t, axis, 'all', me) && !inBlock(t))
    .sort((a, b) => (b.fait ?? '').localeCompare(a.fait ?? ''))
  // Les faites en familles (#203, maquette C) : une sous-tâche sous sa mère, par jour ou par sujet ;
  // à droite, ce que le rangement ne dit pas (le sujet, ou le jour de clôture).
  const doneMode = by === 'subject' ? 'subject' : 'day'
  const doneSections = showDone && !searching ? doneTree(doneShown, allTasks, doneMode, today, t => short(t).titre, t => (short(t).sujet === '…' ? 'À classer' : short(t).sujet)) : []
  const doneRights = new Map<Task, string>()
  for (const sec of doneSections)
    for (const it of sec.items)
      for (const t of it.kind === 'alone' ? [it.task] : [it.block.head as Task, ...it.block.doneTasks])
        doneRights.set(t, doneRight(t, doneMode, sec.day, today, axisShown(t.axis)))
  // Une faite trouvée, ou dans une chaîne trouvée (#318) : sa date de fin au bout de sa ligne.
  if (searching)
    for (const b of tree)
      for (const t of [...(b.head ? [b.head] : []), ...b.tasks, ...b.doneTasks]) if (t.done) doneRights.set(t, doneRight(t, 'subject', undefined, today, ''))

  // L'arbre, rangé en bandes par la valeur de `ranger_par` (#125) : une bande par valeur, les blocs
  // sous la valeur de leur tête, les tâches seules coupées par bande. Une bande se replie à part.
  // Sans `ranger_par`, par sujet, l'arbre se range par axe (#168) : une bande par axe, dans l'ordre de
  // la légende, la flèche dans son carré ; par jour, par échéance ou par responsable (#189), une
  // bande par section ; par numéro (#192), une seule bande, « Récentes ». Dedans, les arbres entiers : les mères en blocs, chaque suite de tâches seules
  // en groupe sans en-tête (`bare`). Par jour, une mère porte la tâche du jour de son arbre (`focus`).
  type BandLookOf = ReturnType<typeof bandLook>
  type ListGroup = { key?: string; name: string; tasks: Task[]; lead?: RenderElement; mark?: RenderElement; block?: TreeBlock; focus?: Task; band?: { count: number; lead?: RenderElement; axis?: string; look?: BandLookOf }; under?: string; bare?: boolean }
  const bandValue = (t: Task) => (rangerPar ? t.extra?.[rangerPar]?.[0] : undefined)
  const aloneBlock = (key: string, tasks: Task[]): TreeBlock => ({ key, label: '', ghost: false, tasks, rank: new Map(), done: 0, total: 0, doneTasks: [], closed: false })
  const lateLead = () => icon(discIcon(palette.late), 'en retard', 16, '●', 'error')
  // Une section de l'arbre en groupes : sa bande, puis ses mères et ses suites de tâches seules.
  const sectionGroups = (id: string, name: string, count: number, items: readonly AxisItem[], band: { lead?: RenderElement; axis?: string; look?: BandLookOf } = {}): ListGroup[] => {
    const out: ListGroup[] = [{ key: id, name, tasks: [], band: { count, ...band } }]
    let run: Task[] = []
    const flush = () => {
      if (run.length === 0) return
      const key = `${id}:seules:${out.length}`
      out.push({ key, name: '', tasks: run, block: aloneBlock(key, run), under: id, bare: true })
      run = []
    }
    for (const it of items) {
      if (it.kind === 'alone') run.push(it.task)
      else {
        flush()
        out.push({ key: it.block.key, name: it.block.label, tasks: treeSteps(it.block, isLive, stepLingers), block: it.block, ...(it.focus ? { focus: it.focus } : {}), under: id })
      }
    }
    flush()
    return out
  }
  const rangedSections =
    by === 'day' ? dayTree(tree, today, isLive) : by === 'deadline' ? deadlineTree(tree, today, isLive) : by === 'owner' ? ownerTree(tree, me, isLive) : by === 'number' ? numberTree(tree) : undefined
  const treeGroups: ListGroup[] = rangedSections
    ? rangedSections.flatMap(sec => sectionGroups(sec.key, sec.label, searching ? shownLines(sec.items) : sec.count, sec.items, { look: bandLook(sec.key, today, me), ...(sec.late ? { lead: lateLead() } : {}) }))
    : !rangerPar
    ? axisTree(tree, order, isLive).flatMap(sec => sectionGroups(`axe:${sec.axis}`, axisShown(sec.axis), searching ? shownLines(sec.items) : sec.count, sec.items, { axis: sec.axis }))
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
        const count = band.items.reduce((n, u) => n + (u.block.head && !u.block.ghost ? 1 : 0) + u.block.tasks.length + (searching ? u.block.doneTasks.length : 0), 0)
        return [
          { key: id, name: band.label, tasks: [], band: { count } },
          ...band.items.map(u => ({ key: u.block.key, name: u.block.label, tasks: u.block.head ? treeSteps(u.block, isLive, stepLingers) : u.block.tasks, block: u.block, under: id })),
        ]
      })
  const bandOpen = (id: string) => !closedGroups.includes(id)
  const toggleBand = (id: string) => () => void setView($, v => ({ closedGroups: toggleIn(v.closedGroups, id) }))
  // La tête d'une section (#265, maquette B3 choisie par Bertrand) : sa marque dans la colonne des carrés
  // (le carré de l'axe par sujet, l'icône du ton ailleurs), son nom en demi-gras, son compte au bout, et
  // dessous le trait stylé à sa couleur ; ni fond ni flèche, toute la tête replie la section.
  // Le trait sous le nom (#266, choix de Bertrand) : le nom et son trait partagent une colonne à droite de la
  // marque, si bien que le trait commence pile sous sa première lettre ; la rangée du nom ne tient plus la
  // hauteur de la marque, et le nom remonte d'un rien ; `SIZE.headGap` d'air sépare le nom (et le carré) du trait.
  const toneColors = (tone: BandLookOf['tone']) =>
    tone === 'neutral'
      ? { ink: palette.text2, accent: palette.text3 }
      : tone === 'mine'
      ? { ink: palette.liveOn, accent: palette.live }
      : { ink: palette[`${tone}On`], accent: palette[tone] }
  const headRow = (id: string, name: string, count: number, mark: string, nameInk: string, accent: string, axisOf?: string) => (
    <Box key={`band:${id}`} flexDirection="column" paddingX={SPACE.indent} paddingTop="md" paddingBottom="xs">
      <Box key={`hit:bande:${keyPart(name)}`} flexDirection="row" alignItems="flex-start" gap={SPACE.row}>
        {Svg && <Svg source={mark} alt="" width={16} height={24} />}
        <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
          <Box flexDirection="row" justifyContent="space-between" alignItems="center">
            <Box flexDirection="row" alignItems="center" flexShrink={1} minWidth={0}>
              {/* Le nom est toujours un texte (#295) : sans zone de clic (un gros projet, « Toutes »), un bouton
                  natif lui imposait sa marge et sa graisse ; un bouton sans encre le couvre, comme le titre d'une ligne (#224). */}
              <Text weight="semibold" color={nameInk} wrap="truncate-end">{name}</Text>
              {!headZones && (
                <Box position="absolute" top={0} left={0}>
                  <Button key={`bande:${keyPart(name)}`} plain onPress={toggleBand(id)}>
                    {titleOverlay(name)}
                  </Button>
                </Box>
              )}
            </Box>
            <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0}>
              {pickAllOf(id) && Svg && <Text size="caption" weight="semibold" color={palette.liveOn}>Tout choisir</Text>}
              {pickAllOf(id) && !Svg && <Button key={`pick-all:${keyPart(id)}`} plain label="Tout choisir" onPress={pickAllOf(id) as () => void} />}
              {countPill(count, false, palette.text2)}
            </Box>
          </Box>
          {/* L'air sous le nom (#266, retour de Bertrand) : les jambages et le bas du carré ne touchent plus le trait. */}
          {Svg && <Svg source={`<svg xmlns="http://www.w3.org/2000/svg" width="1" height="${SIZE.headGap}"/>`} alt="espace" width={1} height={SIZE.headGap} />}
          {Svg && <Svg source={sectionRuleIcon(accent, palette.border, wide)} alt="trait" height={2} />}
        </Box>
        {headZones && hit(`band:${id}`, toggleBand(id))}
        {axisOf !== undefined && axisPen('head', axisOf)}
        {/* « Tout choisir » (#355) : un bouton sans encre peint après la zone de la tête, qui sinon prendrait le
            clic ; calé à droite comme l'étiquette, devant la place du compte, que tient un dessin vide de sa largeur (avec son alt : un Svg à alt vide n'est pas dessiné au bureau, #364). */}
        {pickAllOf(id) && Svg && (
          <Box position="absolute" top={0} left={0} right={0} flexDirection="row" justifyContent="flex-end" alignItems="center" gap={SPACE.row}>
            <Button key={`pick-all:${keyPart(id)}`} plain onPress={pickAllOf(id) as () => void}>
              {CHECK_OVERLAY.repeat(4)}
            </Button>
            <Svg source={`<svg xmlns="http://www.w3.org/2000/svg" width="${countPillWidth(count)}" height="${SIZE.pill.count}"/>`} alt="place du compte" width={countPillWidth(count)} height={SIZE.pill.count} />
          </Box>
        )}
      </Box>
    </Box>
  )
  // « Tout choisir » (#355, choix de Bertrand du 2026-11-06 : le bloc en cours) : tant qu'une tâche est
  // choisie, sur la tête du bloc de la dernière choisie ; il choisit toutes les tâches de ce bloc, et se tait
  // quand le bloc est tout choisi. Rend son geste, ou rien.
  function pickAllOf(id: string): (() => void) | undefined {
    const last = picked.at(-1)
    if (last === undefined) return undefined
    const lastTask = allTasks.find(t => taskKey(t) === last)
    if (lastTask === undefined || sectionOf.get(lastTask) !== id) return undefined
    const keys = allGroups
      .filter(g => g.under === id)
      .flatMap(g => [...(g.block?.head && !g.block.ghost ? [g.block.head as Task] : []), ...g.tasks])
      .map(taskKey)
    if (keys.every(k => pickedSet.has(k))) return undefined
    return () => void setView($, v => ({ picked: [...new Set([...(v.picked ?? []), ...keys])], confirmDone: [], batchNote: '' }))
  }
  const bandRow = (id: string, name: string, count: number, lead?: RenderElement, axisOf?: string, look?: BandLookOf) =>
    Svg && axisOf !== undefined && view.axisEdit === axisEditKey('head', axisOf)
      ? <Box key={`band:${id}`} flexDirection="column" paddingTop="md">{axisEditor(axisOf)}</Box>
      : Svg && axisOf !== undefined
      ? headRow(id, name, count, axisHeadIcon(axisHex(axisOf)), palette.text, axisHex(axisOf), axisOf)
      : Svg && look
      ? // Une seule tête hors sujet (#353, maquette A choisie par Bertrand) : le nom et le trait en blanc, le ton dans l'icône seule.
        headRow(id, name, count, bandGlyphIcon(look.glyph, toneColors(look.tone).ink), palette.text, palette.text)
      : (
    <Box key={`band:${id}`} flexDirection="row" justifyContent="space-between" alignItems="center" paddingX={SPACE.indent} paddingTop="sm">
      {/* Au terminal, sans dessin : la flèche en texte devant le nom. */}
      <Button key={`bande:${keyPart(name)}`} plain label={`${bandOpen(id) ? '⌄' : '›'} ${name}`} onPress={toggleBand(id)} />
      <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0}>
        {lead}
        {countPill(count, false, palette.text2)}
      </Box>
    </Box>
  )

  // Les groupes de la liste : « En retard » d'abord, puis les sujets ; les faites par jour.
  // `key` suit l'état d'une section quand son libellé bouge (l'avancement d'un arbre) ; sans lui, son nom.
  // Une recherche (#318) : rangée comme la liste, sous ses sujets.
  const allGroups: ListGroup[] = searching
    ? treeGroups
    : showDone
    ? // Par jour, la tête des ouvertes (#353) ; par sujet, l'en-tête à chevron.
      doneSections.flatMap(sec => sectionGroups(sec.key, sec.label, sec.count, sec.items, sec.key.startsWith('fait-jour:') ? { look: bandLook(sec.key, today, me) } : {}))
    : attend === 'relaunch'
    ? // À relancer (#99, #268) : par sujet, quel que soit le rangement, les attentes les plus vieilles en haut.
      relaunchSections(shown, order, today, me).flatMap(sec =>
        sectionGroups(`axe:${sec.axis}`, axisShown(sec.axis), sec.tasks.length, sec.tasks.map(task => ({ kind: 'alone' as const, task })), { axis: sec.axis }),
      )
    : attend === 'today' && recurringToday.length > 0
    ? // Ma journée (#268) : rangée comme Cette semaine, puis ses récurrentes qui tombent, à part (choix de BBR).
      [
        ...treeGroups,
        ...sectionGroups(TODAY_RECURRING, 'Récurrentes qui tombent', recurringToday.length, sortTasks(recurringToday, sortOrder).map(task => ({ kind: 'alone' as const, task })), {
          look: bandLook(TODAY_RECURRING, today, me),
        }),
      ]
    : treeGroups
  // Le budget de lignes du dessin : les sections ouvertes, dans l'ordre, en prennent tant qu'il en
  // reste ; une section dépliée en entier (« Voir les N autres ») prend toutes les siennes. Sans
  // lui, une vue filtrée ou « Tout déplier » posait ~2 000 éléments et ~330 Svg par clic (260 Ko),
  // au seuil où le panneau gèle (2026-10-23).
  // Les groupes d'une bande repliée ne se dessinent pas, et ne prennent rien au budget.
  const groups = allGroups.filter(g => g.under === undefined || bandOpen(g.under))
  for (const g of groups)
    if (g.under !== undefined) for (const t of [...(g.block?.head ? [g.block.head as Task] : []), ...g.tasks, ...(g.focus ? [g.focus] : [])]) sectionOf.set(t, g.under)
  // Par sujet, la bande d'axe tait la pastille d'axe : le budget plein (#168).
  let budget = settings.axisPill && attend !== 'live' && !showDone && !clesVisibles?.length && axis === 'all' && (by !== 'subject' || rangerPar) ? ROW_BUDGET_AXIS_PILL : ROW_BUDGET
  const rowsOf = new Map<string, number>()
  const idOf = (g: { key?: string; name: string }) => g.key ?? g.name
  for (const g of groups) {
    // Une mère repliée qui montre son étape du jour (#189) : une ligne.
    if (!g.bare && !isOpenGroup(idOf(g)) && g.focus) budget -= 1
    if (!g.bare && !isOpenGroup(idOf(g))) continue
    const n = moreGroups.includes(idOf(g)) ? g.tasks.length : Math.min(g.tasks.length, Math.max(budget, 0))
    rowsOf.set(idOf(g), n)
    budget -= n
  }
  // La tête d'un bloc de l'arbre est une ligne de tâche dessinée, comme ses enfants (#125).
  const drawnTasks = groups.flatMap(g => [
    ...(g.block?.head ? [g.block.head] : []),
    ...(rowsOf.has(idOf(g)) ? g.tasks.slice(0, rowsOf.get(idOf(g))) : g.focus ? [g.focus] : []),
  ])
  // Les sections qui se déplient, celles des bandes repliées comprises. Un arbre sans mère (#168) :
  // « Tout replier » replie ses bandes d'axe ; avec des mères, il ne replie qu'elles (#163).
  const names = allGroups.filter(g => !g.band && !g.bare).map(idOf)
  const bandIds = !searching && !showDone && names.length === 0 ? allGroups.filter(g => g.band).map(idOf) : []
  // Les mères de l'arbre (#163) : « Tout replier » les ferme toutes, « Tout déplier » les rouvre.
  const motherKeys = !searching ? groups.filter(g => g.block?.head !== undefined).map(idOf) : []
  const subtasks = subtaskFold(motherKeys, isOpenGroup)
  // Avec des mères (#224, #203 C) : l'action replie les sections, le bouton des sous-tâches les mères.
  // Les bandes s'ouvrent par défaut (`closedGroups`), les sections à en-tête sans mère (« Tâches seules ») non (`openGroups`).
  const withMothers = !searching && !showDone && allGroups.some(g => g.block?.head !== undefined)
  const sectionBands = withMothers ? allGroups.filter(g => g.band).map(idOf) : []
  const sectionHeads = withMothers ? allGroups.filter(g => !g.band && !g.bare && g.block?.head === undefined).map(idOf) : []
  const sections = sectionFold([...sectionBands, ...sectionHeads], id => (sectionBands.includes(id) ? bandOpen(id) : isOpenGroup(id)))
  const allOpen = bandIds.length > 0 ? bandIds.every(b => !closedGroups.includes(b)) : names.length > 0 && names.every(n => openGroups.includes(n))
  const action = searching
    ? { label: 'Effacer', run: () => void update($, searchAtom, () => '') }
    : filtered
    ? { label: 'Tout afficher', run: showAll }
    : sections
    ? {
        label: sections.label,
        run: () =>
          void setView($, v => ({
            closedGroups: [...v.closedGroups.filter(c => !sectionBands.includes(c)), ...(sections.fold ? sectionBands : [])],
            openGroups: [...v.openGroups.filter(g => !sectionHeads.includes(g)), ...(sections.fold ? [] : sectionHeads)],
          })),
      }
    : allOpen
      ? {
          label: 'Tout replier',
          run: () => void setView($, v => ({ openGroups: [], moreGroups: [], closedGroups: [...v.closedGroups.filter(c => !bandIds.includes(c)), ...bandIds] })),
        }
      : { label: 'Tout déplier', run: () => void setView($, v => ({ openGroups: names, closedGroups: v.closedGroups.filter(c => !bandIds.includes(c)) })) }

  const anyAxis = axis !== 'all' || showDone
  const axisOn = (a: string) => axis === a && !showDone
  // La barre (#180, maquette C) : les seules ouvertes, par axe ; en vue Done, pleine, du vert des Done,
  // et un clic dessus revient aux ouvertes.
  const segments = showDone
    ? [{ name: DONE_SEGMENT, hex: palette.done, theme: 'success', n: doneTasks.length, dim: false }]
    : axes.map(a => ({ name: a, hex: axisHex(a), theme: axisTheme(a), n: axisCount(openTasks, a), dim: anyAxis && !axisOn(a) }))
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
    tomorrow: tomorrowAll.length,
    late: lateAll.length,
    soon: soonAll.length,
    relaunch: relaunchAll.length,
    live: liveAll.length,
    feedback: feedbackAll.length,
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
  const moreForced = moreFiltersForced({ attend, who, tierChosen })
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
  if (graphic) sessionRows = new Set(doneTasks.filter(t => !inBlock(t) && doneSessionOf(t) !== undefined).slice(0, SESSION_ROWS).map(taskKey))
  // Seules les lignes cliquables de « À traiter » ont une zone ; les filtres repliés sont des boutons de l'app (#115).
  // Les axes toujours dépliés (#160) : plus de ligne repliée (#149) ; les faites s'ouvrent par le lien de l'en-tête (#152).
  // Les zones fixes : le compte des faites, les axes, le chevron du bloc « En cours », la roue, les
  // pastilles cliquables et « Plus › » (#115), les boutons de session des faites.
  const showLive = blockTasks.length > 0 || (dose?.queued ?? 0) > 0
  const fixedZones = 1 + axes.length + (showLive ? 1 : 0) + 1 + todo.filter(todoClickable).length + (todoBlock && (secondary.length > 0 || people.length > 0) ? 1 : 0) + 2 * sessionRows.size
  if (graphic) {
    const shownWithSession = [...drawnTasks.filter(t => t.id && (liveOf(t) ?? doneSessionOf(t)))]
    numberZones = new Set(shownWithSession.slice(0, Math.max(0, ZONE_LIMIT - fixedZones)).map(t => t.id as string))
  }
  headZones = graphic && fixedZones + numberZones.size + groups.filter(g => !g.bare).length <= ZONE_LIMIT

  // Le bloc « En cours » de Maestro (#367, choix 1 de la maquette) : une ligne encadrée de compteurs, « N ici »,
  // « Mac X/Y » (orange quand le Mac retient la file), « N en file », puis l'icône du centre de contrôle. Toute la
  // ligne l'ouvre ; ses sessions et sa file y vivent, plus ici. La liste dessous ne redit toujours pas ces tâches.
  const openControlPane = () => void openControl($)
  // Sans pas de relève encore (la minuterie y vient dans les 3 s) : ses sessions comptent seules pour le Mac.
  const counters = countersLine({
    here: blockTasks.length,
    macTaken: dose?.macTaken ?? blockTasks.length,
    macMax: dose?.macMax ?? doseMaxes().macMax,
    queued: dose?.queued ?? 0,
    hot: dose !== undefined && dose.why !== 'project',
  })
  const counterPill = (c: { text: string; tone: 'live' | 'block' | 'neutral' }) => {
    const tone = c.tone === 'block' ? { bg: palette.blockTint, fg: palette.blockOn } : c.tone === 'live' ? { bg: palette.liveTint, fg: palette.liveOn } : { bg: palette.sel, fg: palette.text2 }
    return drawnPill({ text: c.text, bg: tone.bg, fg: tone.fg, weight: TEXT.weight.soft })
  }
  const liveBlock =
    showLive ? (
      <Box flexDirection="column" borderStyle="round" borderColor={dose && dose.why !== 'project' ? palette.block : palette.border} paddingX={0} paddingY="xs">
        <Box key="hit:live-open" flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent} hover={{ backgroundColor: palette.hover }}>
          <Box flexDirection="row" alignItems="center" flexShrink={0}>
            {spinner()}
          </Box>
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            <Text size="footnote" weight="semibold" color={palette.text2}>En cours</Text>
          </Box>
          <Box flexShrink={0}>{counterPill(counters.here)}</Box>
          <Box flexShrink={0}>{counterPill(counters.mac)}</Box>
          <Box flexShrink={0}>{counterPill(counters.queued)}</Box>
          {graphic && Svg ? (
            <Box flexDirection="row" alignItems="center" flexShrink={0}>
              <Svg source={controlIcon(palette.text3, 16)} alt="Centre de contrôle" width={SIZE.icon.md} height={SIZE.icon.md} />
            </Box>
          ) : (
            <Button key="live-open" plain dimColor label="Centre de contrôle" onPress={openControlPane} />
          )}
          {graphic && hit('live-open', openControlPane)}
        </Box>
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
        {/* « N Done » (#174) est le lien vers les faites (#152, maquette C) : souligné, en gras et en vert une fois choisi (#180). */}
        <Box key="hit:done-count" flexDirection="row" flexShrink={1} minWidth={0} marginLeft={1} hover={{ backgroundColor: palette.hover }}>
          {graphic && (
            <Text size="caption" tabular underline color={showDone ? palette.done : palette.text2} weight={showDone ? 'semibold' : undefined} wrap="truncate-end">
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
          <Svg source={barIcon(segments, palette.sel, wide)} alt={`${pct(doneTasks.length, total)} % fait`} height={6} />
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


      {/* Les axes toujours dépliés (#160) ; les faites s'ouvrent par « N faites » de l'en-tête (#152). */}
      <Box flexDirection="column">
        {axes.map(a => {
          const n = axisCount(openTasks, a)
          const dim = anyAxis && !axisOn(a)
          return legend({
            key: `axis:${a}`,
            mark: d => tallIcon(fade(squareIcon(axisHex(a)), d), a, 16, '■', axisTheme(a)),
            name: axisShown(a),
            n,
            share: `${pct(n, total)} %`,
            dim,
            onPress: setAxis(a),
            axis: a,
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
        {/* La barre de sélection (#316, maquette C) : à la place de la ligne de la liste tant qu'une tâche est
            choisie ; « Faites » coche les choisies, Éditer ouvre Date ▾ et Statut ▾ ; l'encart du calendrier et le bilan dessous. */}
        {/* Sinon, la ligne de la liste, discrète : ce qui est montré, et une seule action selon le cas. */}
        {asking.length > 0 ? confirmBar() : picked.length > 0 ? batchBar() : (
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" paddingX={SPACE.indent}>
            <Text size="caption" color={palette.text2} wrap="truncate-end">
              {searching
                ? searchSummary(foundOpen.length, foundDone.length, search, SEARCH_MAX)
                : filterSummary({ axis, attend, showDone, shown: shown.length, doneShown: doneShown.length, groupBy: by, who })}
            </Text>
            {/* Le bouton des sous-tâches (#203, choix de Bertrand du 2026-11-01) : dans toutes les vues dès
                qu'une mère est dessinée, Done compris, il les déplie ou les replie toutes, à côté de l'action
                de la liste. Les mères Done se tiennent dans `openGroups`, filtre ou non. */}
            <Box flexDirection="row" gap={SPACE.row} flexShrink={0}>
              {subtasks && (
                <Button
                  key="subtasks-fold"
                  plain
                  dimColor
                  label={subtasks.label}
                  onPress={() => void setView($, v => foldAllView(v, filtered && !showDone, motherKeys, subtasks.open))}
                />
              )}
              <Button key="list-action" plain dimColor label={action.label} onPress={action.run} />
            </Box>
          </Box>
        )}
        {/* Le bilan du dernier lot (#316), sous la barre ou sous la ligne de la liste quand la sélection s'est vidée. */}
        {(view.batchNote ?? '') !== '' && (
          <Box key="batch-note" paddingX={SPACE.indent}>
            <Text size="caption" color={palette.text2} wrap="wrap">{view.batchNote}</Text>
          </Box>
        )}
      </Box>

      {titleNote !== '' && <Text color={palette.text2}>{titleNote}</Text>}
      {scanNote !== '' && <Text color={palette.text2}>{scanNote}</Text>}
      {searching && foundCount === 0 && <Text color={palette.text2}>Aucune tâche ne correspond.</Text>}
      {!searching && !showDone && shown.length === 0 && (
        <Text color={palette.text2}>{attend === 'today' ? "Rien d'urgent aujourd'hui." : attend === 'tomorrow' ? 'Rien de prévu demain.' : 'Aucune tâche ouverte pour ce filtre.'}</Text>
      )}

      <Box flexDirection="column">{groups.map(g => (g.band ? bandRow(idOf(g), g.name, g.band.count, g.band.lead, g.band.axis, g.band.look) : section(idOf(g), g.name, g.tasks, rowsOf.get(idOf(g)) ?? 0, g.lead, g.mark, g.block, g.bare, g.focus)))}</Box>

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
