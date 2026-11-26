// Le dessin du panneau (#646) : `drawPane`, sorti de register.tsx, qui frôlait la limite de taille d'un module du
// moteur (1 048 576 octets). Il lit l'état et les aides de socle.tsx, et écrit l'état par ses fonctions `setX`.

import type { EngineInterface, RenderElement, RenderInput } from 'claude-code'
import type { ShortTitle } from '../types'
import {
  AXIS_THEME,
  axisColor,
  barCuts,
  barIcon,
  axisSwatchIcon,
  percentIcon,
  pillIcon,
  herePillIcon,
  filterPillIcon,
  checkIcon,
  clockIcon,
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
  cancelRowIcon,
  squareArmedRowIcon,
  squareGhostRingIcon,
  calendarDayIcon,
  DAY_CELL_PX,
  squareCheckMoveIcon,
  squareRowIcon,
  cornerIcon,
  rowMark,
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
  cloudIcon,
  computerIcon,
  bellIcon,
  cloudTints,
  unplugIcon,
  unarchiveIcon,
  pencilIcon,
  priorityIcon,
  PRIORITY_PX,
  gearIcon,
  discIcon,
  halfDiscIcon,
  mixOver,
  personIcon,
  ringIcon,
  ruleIcon,
  undoCountIcon,
  fullWidth,
  spinnerIcon,
  stepsBarIcon,
  deliveryRailIcon,
  squareIcon,
  STROKE,
  gaugeIcon,
  FAMILY_MARK_PX,
  familyChevronIcon,
  familyCase,
  familyLeadIcon,
  familyRowIcon,
  donutIcon,
  PANE_PILL_MAX,
  wrapPillIcon,
  textColumnPx,
} from './icons'
import type { PillMark } from './icons'
import { MIX, PX, RADIUS, SIZE, SPACE, TEXT } from './tokens'
import { openControl } from './controle'
import { openSettings } from './reglages'
import {
  squareHitWidth,
  TREE_LEAD_CELLS,
  ageLabel,
  sinceLabel,
  paneFocus,
  axisOrder,
  countBy,
  daysBetween,
  durationLabel,
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
  codeKeptWhole,
  foldCell,
  livreOfNote,
  missionFrame,
  recapKey,
  recapOf,
  pitchKey,
  pitchOf,
  liveHead,
  liveSince,
  missionShort,
  stepTimes,
  stepsSpent,
  bilanRows,
  columnLabel,
  askedOf,
  changesCard,
  changesKey,
  durationView,
  spanLabel,
  timingKey,
  timingOf,
  changesOf,
  batchDays,
  monthGrid,
  pickPrune,
  undoSay,
  undoDue,
  numberPickHover,
  numberLabel,
  shiftMonth,
  taskBrandOf,
  DONE_TREE_PREFIX,
  doneRight,
  DONE_DAYS_STEP,
  doneTree,
  doneWindow,
  doneWindowDays,
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
  blockerOf,
  closeCaption,
  isRoutine,
  isMother,
  routineDue,
  missionEditable,
  entrustedNote,
  editableFields,
  editPlace,
  declaredAxes,
  withParentDates,
  parentRowTask,
  motherLaunchable,
  motherLaunchText,
  bandsOf,
  keyPills,
  axisPillText,
  fitRowPills,
  pxCells,
  CLOUD_WORDS_CELLS,
  deliveredCount,
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
  missingPrereqs,
  projectSettings,
  chainHead,
  chainSteps,
  groupingData,
  unlockedBy,
  whyFresh,
  whyKey,
  whyOf,
  listPills,
  sortTasks,
  hashLabel,
  keyPart,
  fileLinks,
  integerShares,
  mainCheckout,
  clip,
  isMine,
  attendWho,
  shortAttend,
  isOverdue,
  matches,
  taskKey,
  searchSummary,
  searchTasks,
  searchTree,
  shownLines,
  sessionTitleId,
  sessionTitleKind,
  taskTitle,
  isMaestroSession,
  liveBlockRows,
  bareTitle,
  remotePill,
  countersLine,
  ficheQueuePill,
  queueMarks,
  OPENING_VIEW,
  doneViewOn,
  moreFiltersForced,
  todayOf,
  toggleFold,
  unlocksOf,
  sessionRowFit,
  deliveryPasses,
  passesShown,
  passLabel,
  passRow,
  blockWord,
  cloudPrOf,
  cloudSessionLinkOf,
  cloudWords,
  zoneDrawn,
  zoneKeyOf,
  closedWhen,
  finishedLabel,
  finishedOpenSessions,
  isAbandoned,
  CHECK_OVERLAY,
  checkLingers,
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
  AUTO_BLOCKED,
  taskSessionState,
  brandStateOf,
  stateBand,
  relaunchOf,
  stepsClosed,
  stepsView,
  isToday,
  isDueTomorrow,
  isRecurringSoon,
  dayFilterQuiet,
  relaunchSections,
  isDueSoon,
  isPriority,
  isToRelaunch,
  matchesWho,
  peopleOf,
  todoCounters,
  secondaryFilters,
  groupings,
  PLUGINS_LINK,
  PLUGINS_URL,
  footNote,
  waitNote,
  cartonOf,
  detailsStory,
  familyOf,
  batchFamily,
  withOpenKids,
  heldKids,
  heldKidsSay,
  familySay,
  srcFile,
  gaugeLine,
  stepGauge,
  AXIS_NAMES,
  axisName,
  axisPalette,
  axisSlug,
  verifiedLabel,
} from './parse'
import type {
  BrandTask,
  FinRow,
  FicheCard,
  EditField,
  EditPlace,
  BatchChange,
  DoneUndo,
  EditSpec,
  AxisItem,
  ChainStep,
  TreeBlock,
  Pill,
  TaskSessionRow,
  Sessions,
  CloudPr,
  Task,
  FinishedSession,
  ChildStatus,
  ChildStep,
  TodoCounter,
  WaitNote,
  Gauge,
  GaugeKind,
  QueueMark,
} from './parse'
import {
  BAND_MARK_WORDS,
  BAR_HIT,
  BUTTON_HIT_ROWS,
  CANCEL_BUSY,
  CORNERS,
  DONE_SEGMENT,
  DONUT_HIT,
  DRAFT_LABEL_CELLS,
  DURATION_DONUT,
  LAUNCHED,
  LAUNCHING,
  LINE_CAP,
  ROW_BUDGET,
  ROW_BUDGET_AXIS_PILL,
  SAVE_BUSY,
  SEARCH_MAX,
  SESSION_ROWS,
  THUMB,
  TODAY_RECURRING,
  ZONE_LIMIT,
  aheadBySession,
  applyAxisMoves,
  applyBatch,
  archiveFinished,
  archiveSelf,
  archiveSession,
  archiveTaskRow,
  archivedSessionIds,
  askDone,
  askJudge,
  askReopen,
  axisCount,
  axisKeepsState,
  batchDueWord,
  behindDraw,
  brandTree,
  cancelReason,
  cancelUndo,
  caseClick,
  checkMoveOf,
  checkMoves,
  clearDrafts,
  clearPick,
  cloudQuietWord,
  cloudReachable,
  cloudRowFiche,
  cloudRowSteps,
  cloudTasksOf,
  confirmClose,
  confirmField,
  createdBySession,
  currentPr,
  doseView,
  editDrafts,
  faint,
  ficheSteps,
  files,
  finishedBatch,
  finishedFolded,
  flushUndo,
  ghostPressKeys,
  knownSource,
  launchCloud,
  launchExtra,
  launchOf,
  launchRoutine,
  launchSession,
  launchTargetOf,
  learnCreated,
  listedSessionRows,
  loadMaestros,
  loadRecoDocs,
  loadRepoReach,
  loadSessionVersion,
  mergedIdsOf,
  missingSearch,
  openCloudPr,
  openFile,
  openHttpsUrl,
  openMockup,
  openSession,
  openWritten,
  ownSession,
  paletteOf,
  paneBrand,
  paneCapView,
  paneData,
  paneLineCap,
  paneStage,
  parentAsked,
  parentIsMaestro,
  parentMaestro,
  pendingFor,
  perfLoaded,
  pressAxis,
  pressDone,
  pressHandlers,
  pressKey,
  prsOfDelivered,
  queueSubmit,
  queueWanted,
  readAttachments,
  readCheckMoveAtom,
  readCloudPrs,
  readDraft,
  readFicheDocs,
  readFocusFacts,
  readLinks,
  readLiveVersionAtom,
  readMockupPage,
  readOr,
  readOwnSession,
  readQueue,
  readRecoStampAtom,
  readRemoteFacts,
  readRetryAtom,
  readScanNoteAtom,
  readSearchAtom,
  readStampAtom,
  readSteps,
  readThemeStampAtom,
  readTitleNoteAtom,
  readTitlesVersionAtom,
  readVersionNoteAtom,
  readViewAtom,
  readZoneGenAtom,
  recoOf,
  refreshAhead,
  refreshAll,
  reloadPlugin,
  reopenSession,
  repoReach,
  runningBySession,
  runningCloudTasksOf,
  saveAxisEdit,
  sessionBrandOf,
  setAxisKeepsState,
  setCancelReason,
  setFinishedFolded,
  setLaunchExtra,
  setLaunchTarget,
  setMissingSearch,
  setPaneCapView,
  setPaneLineCap,
  setPaneStage,
  setParentAsked,
  setPerfLoaded,
  setQueueWanted,
  setVerified,
  setView,
  settings,
  shownStatus,
  shownTitle,
  sinceOf,
  sourceNow,
  sourceTitle,
  startUndo,
  storeGet,
  submitWelcome,
  switchMaestroToBypass,
  switchToBypass,
  taskSessionOf,
  tick,
  togglePriority,
  trackedSession,
  undoAwaiting,
  undoWriting,
  unsentClose,
  updateLiveVersionAtom,
  updateLocal,
  updateRetryAtom,
  updateSearchAtom,
  zones,
} from './socle'
import type { Attachment, TreeMark } from './socle'

export async function drawPane($: EngineInterface, e: RenderInput<'Pane'>): Promise<RenderElement> {
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
  setPaneStage('la fiche de la session')
  const ownTitle = (await readOwnSession($)).title
  setPaneStage('la source de la roadmap')
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

  // #622 : le dépôt joignable se lit dès le premier dessin, une fois par projet : la fiche ouverte ensuite le sait déjà.
  void loadRepoReach($, source)

  // Toutes les lectures d'état d'un coup : une à une, chacune attendait la précédente. Les quatre
  // premières ne servent qu'à redessiner (empreinte des fichiers, titres courts, thème, « Réessayer »,
  // sessions suivies) et disent si les données gardées en mémoire valent encore.
  setPaneStage("l'état du panneau")
  const [stamp, titlesVersion, themeStamp, retry, liveVersion, view, search, titleNote, zoneGen, now, scanNote] = await Promise.all([
    readStampAtom($), readTitlesVersionAtom($), readThemeStampAtom($), readRetryAtom($), readLiveVersionAtom($),
    readViewAtom($), readSearchAtom($), readTitleNoteAtom($), readZoneGenAtom($), $.clock.now(), readScanNoteAtom($),
    // Lu pour être redessiné à la fin d'un mouvement de case (#182), sans relire les fichiers.
    readCheckMoveAtom($),
    // #416 : l'interrupteur Cloud | Mac et la reco lue redessinent sans relire les fichiers.
    readRecoStampAtom($),
  ])
  const {
    axis: axisRaw, attend: attendRaw, who: whoRaw = 'all', moreFilters = false, showDone: doneChosen, groupBy, selected, openGroups, closedGroups, moreGroups,
    launchNote, launched, openNote, openAt = '', conclusionOpen, missionOpen = '', whyAsked = '', draftOpen = '', draftFolded = '', reopenAsk = '', cancelAsk = '', closeKind = 'abandon', cancelNote = '',
    editing: editingKey = '', editOpen = '', editSaved = '', editNote = '', editField = '', foldedCards = [], openedCards = [], gaugePick = '', briefOpen = '',
  } = view
  // Le plafond de lignes (#414) repart quand les filtres changent : une vue plus légère reprend ses lignes.
  const capView = [view.axis, view.attend, view.who ?? 'all', view.showDone, view.groupBy, search.trim() !== '', view.selected ?? '', view.doneDays ?? DONE_DAYS_STEP].join('|')
  if (capView !== paneCapView) {
    setPaneCapView(capView)
    setPaneLineCap(LINE_CAP)
  }
  const lineCap = paneLineCap
  setPaneStage('les fichiers de la roadmap')
  const data = await paneData($, source, [stamp, titlesVersion, themeStamp, retry].join('|'), liveVersion)
  const { palette, bilan: bilanData, titles, live: liveEntries, ignored } = data
  const [versionKept, ownVersion] = await Promise.all([readVersionNoteAtom($), loadSessionVersion($)])
  // La note du dernier « Rafraîchir » vit dans l'état de la session, qui survit au rechargement du module :
  // seule celle que ce module a écrite se montre, sinon le pied dit la version du module chargé (#505).
  const versionCheck = footNote(versionKept, ownVersion)
  const searching = search.trim() !== ''
  const today = todayOf(now)
  const me = source.me
  // La clé d'une zone de clic, à la génération courante ; son premier dessin compte pour la relance.
  const zoneKey = (base: string, module: string) => {
    zoneDrawn(zones, module, now)
    return zoneKeyOf(zones, base, zoneGen)
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
            <Button key="retry" plain label="Réessayer" onPress={() => void updateRetryAtom($, v => v + 1)} />
          </Box>
          <Text size="caption" color={palette.text2}>Nouvel essai seul toutes les 15 s</Text>
        </Box>
      </Box>
    )
  }
  const done = data.done

  // Dans une session « #N · … » : la fiche de sa tâche plutôt que toute la roadmap (#137, #142) ; Maestro,
  // toujours la liste ; sa tâche introuvable partout, l'alerte, jamais la liste en silence (#213).
  setPaneStage('les sessions')
  const own = await readOwnSession($)
  const titleId = sessionTitleId(own.title)
  // Lancée par Maestro (#233) : sa fiche seule. Demandé une fois au premier dessin d'une session « #N · … »,
  // sans attendre le premier message ; ensuite, les hooks le tiennent.
  if (titleId !== undefined && !parentAsked) {
    setParentAsked(true)
    await behindDraw($, parentIsMaestro($))
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
      setMissingSearch(undefined)
      void sourceNow($).then(() => updateRetryAtom($, v => v + 1))
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
  // Les annulées à part des faites (#624) : elles restent dans `allTasks` (arbres, chaînes), hors de tout compte de faites.
  const doneTasks = done.filter(t => t.done && !isAbandoned(t))
  const cancelledTasks = done.filter(t => t.done && isAbandoned(t))
  // Le # de l'arbre (#258) : sa colonne à la largeur du plus long numéro, contre la flèche.
  const treeNumCells = treeNumberCells([...openTasks, ...doneTasks, ...cancelledTasks].flatMap(t => (t.id ? [t.id] : [])))
  // Toutes faites : les Done par jour, barre verte, plutôt qu'une liste vide (#202) ; la dernière
  // cochée compte encore le temps de son mouvement, dans les ouvertes (#182).
  const settling = doneTasks.filter(t => checkLingers(checkMoves.get(taskKey(t)), now)).length
  const showDone = doneViewOn(doneChosen, openTasks.length + settling, doneTasks.length)
  // Le nom posé à la main (`nom:`, #235) l'emporte sur le titre tiré ; le sujet vient toujours du modèle.
  const short = (t: Task): ShortTitle => ({ sujet: '…', ...titles[hashLabel(t.label)], titre: shownTitle(t, titles) })
  const age = (t: Task): number | undefined => (t.ouvert ? daysBetween(t.ouvert, today) : undefined)
  // Une tâche en session : lancée depuis le panneau, session pas archivée. Sans fiche lisible
  // (outil absent ou refusé), on la croit en session 12 heures, sans le garantir.
  setPerfLoaded(tick())
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
  setPaneStage('les étapes des sessions')
  await behindDraw($, refreshAhead($, source, openTasks.map(t => liveOf(t)?.entry.sessionId), now))
  await Promise.all(
    openTasks.map(async t => {
      const sid = liveOf(t)?.entry.sessionId
      const found = await readSteps($, sid)
      if (found) rowSteps.set(taskKey(t), shownStatus(found, sid, t.done))
    }),
  )
  // Tâches enchaînées : `après:` désigne la prérequise ; une tâche est bloquée tant qu'elle n'est pas faite.
  const allTasks = [...openTasks, ...doneTasks, ...cancelledTasks]
  // La sélection de la liste (#316) : les tâches choisies encore dans la roadmap.
  const picked = pickPrune(view.picked ?? [], allTasks)
  const pickedSet = new Set(picked)
  // La question d'une coche (#355) : ses tâches encore dans la roadmap.
  const asking = pickPrune(view.confirmDone ?? [], allTasks)
  const askedSet = new Set(asking)
  // Le sursis du dernier « Marquer faite » (#556) : ses lignes restent à leur place, cochées et barrées ; échu, le
  // dessin l'écrit (filet de sécurité d'une minuterie perdue : un module rechargé, une surface sans horloge).
  const undoNow = view.undo
  // Une coche confiée à Claude tient jusqu'à son écriture ; jamais venue dans le délai, elle se retire et le dit.
  const lapsed: string[] = []
  for (const [key, until] of undoAwaiting) {
    const task = allTasks.find(t => taskKey(t) === key)
    if (task === undefined || task.done) undoAwaiting.delete(key)
    else if (now >= until) {
      undoAwaiting.delete(key)
      lapsed.push(task.id ? `#${task.id}` : `« ${clip(task.label, 30)} »`)
    }
  }
  if (lapsed.length > 0) {
    const say = () => {
      try {
        $.ui.toast(`${lapsed.join(', ')} : pas encore cochée${lapsed.length > 1 ? 's' : ''} par Claude, la coche est retirée.`)
      } catch {
        // pas de toast sur cette surface : la ligne redevenue ouverte le montre
      }
    }
    if (typeof setTimeout === 'function') setTimeout(say, 0)
    else void Promise.resolve().then(say)
  }
  const heldKeys = new Set([...(undoNow?.keys ?? []), ...undoWriting, ...undoAwaiting.keys()])
  if (undoDue(undoNow, now)) {
    const run = () => void flushUndo($, source).catch(() => undefined)
    if (typeof setTimeout === 'function') setTimeout(run, 0)
    else void Promise.resolve().then(run)
  }
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
    setLaunchExtra('')
    void setView($, () => ({ selected: key, launchNote: '', openNote: '', openAt: '', cancelAsk: '', cancelNote: '', editing: '', editOpen: '', editSaved: '', editNote: '', editField: '' }))
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
  const taskNumber = (id: string, open?: () => void, done = false, fit?: 'grow', pickIt?: { press: () => void; chosen: boolean }) => {
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
      <Box key={`n:${id}`} {...(fit === 'grow' ? { flexGrow: 1 } : { width: treeNumCells })} flexDirection="row" justifyContent="flex-end" alignItems="center" flexShrink={0}>
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
  // #498 : une pastille qui passe à la ligne entre deux mots au-delà de `max` px (la pastille Remote Control).
  const wrappedPill = (o: { text: string; bg: string; fg: string; mark?: PillMark; weight?: 500 | 600 }, max: number) => {
    if (!Svg) return drawnPill(o)
    const pill = wrapPillIcon(o, max)
    return <Svg source={pill.source} alt={o.text} width={pill.width} height={pill.height} />
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

  // La moitié gauche du pied (#138, #162), reprise par la fiche (#380, maquette A) : la roue (#115), au terminal le
  // bouton « Réglages », qui ouvre le volet Réglages ; puis la version de cette session.
  const footLeft = () => (
    <Box flexDirection="row" alignItems="center" flexShrink={1} minWidth={0}>
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
          {versionCheck.foot}
        </Text>
      </Box>
    </Box>
  )

  // --- La fiche d'une tâche (#142) : celle de la session, ou celle du clic ---------
  // Sa tâche introuvable, la session a vu l'alerte plus haut (#213).
  const ownTask = focusBrand ? allTasks.find(t => t.id === focusBrand.id) : undefined
  const inSession = ownTask !== undefined
  const current = ownTask ?? findSelected([...openTasks, ...doneTasks, ...cancelledTasks], selected)
  if (current) {
    // Une mère à étapes ouvertes (#198) : « Marquer faite » la clôt avec elles, « Tout clore » (#163),
    // depuis que son carré, qui porte sa flèche, ne fait que la replier.
    const kidsOpen = current.id && !current.done ? openTasks.filter(t => t.parent === current.id && t.id !== current.id).length : 0
    // #596 : les étapes que « Tout clore » ferme sans qu'on l'ait demandé (prises par une session, ou en attente d'un tiers), nommées.
    const heldSay = closeKind === 'done' && kidsOpen > 0 ? heldKidsSay(heldKids(allTasks, withOpenKids(allTasks, [taskKey(current)]), me), current) : ''
    // #556 : « Tout clore » passe par le sursis : la mère et ses étapes ouvertes.
    const closeAll = () =>
      void startUndo($, source, [taskKey(current), ...openTasks.filter(t => t.parent === current.id && t.id !== current.id).map(taskKey)], 'famille', taskKey(current))
    // Dans sa session : le dossier, la branche et son écart, lus hors de la roadmap.
    setPaneStage('la fiche de la tâche')
    // Son dossier (Spec, Plan, Maquettes) et le récap de fin de sa session (#144), dans les deux contextes.
    const ficheSource = inSession && ownBrand ? ownBrand.data.source : source
    const noteForLinks = current.done ? livreOfNote(current.note).rest : current.note
    const stored = (key: string) => storeGet($, key).catch(() => undefined)
    // #387 : toutes les lectures de la fiche partent ensemble. L'une après l'autre, chacune un aller-retour, le
    // dessin d'une close dépassait son temps sur un Mac chargé (« Le dessin attendait encore : la fiche de la tâche »).
    const [facts, docs, mockupPage, attachments, deliverables, unsentNow, fileHits, recapRaw, changesRaw, timingRaw, pitchRaw, whyRaw] = await Promise.all([
      inSession && ownBrand ? readFocusFacts($, ownBrand.data.source, current, ownBrand.data.own.id, now) : undefined,
      readFicheDocs($, ficheSource, current, now),
      readMockupPage($, ficheSource, current, now),
      readAttachments($, ficheSource, current, now),
      readAttachments($, ficheSource, current, now, 'livrable'),
      current.done ? undefined : unsentClose($, ficheSource, current),
      readLinks($, ficheSource, [current.attend, noteForLinks, current.src], now),
      current.id ? stored(recapKey(ficheSource.name, current.id)) : undefined,
      current.id ? stored(changesKey(ficheSource.name, current.id)) : undefined,
      // Le relevé des temps de sa session (#314) : la durée d'une close et où elle est passée.
      current.done && current.id ? stored(timingKey(ficheSource.name, current.id)) : undefined,
      // Ce qu'on va lancer (#341, C1) : les phrases simples qu'a écrites Claude en ouvrant la ligne.
      !current.done && current.id ? stored(pitchKey(ficheSource.name, current.id)) : undefined,
      // L'explication de « why N » (#535), gardée à sa première demande : ouverte ou close.
      current.id ? stored(whyKey(ficheSource.name, current.id)) : undefined,
    ])
    const draft = await readDraft($, deliverables)
    // #435 : une tâche cloud prise a sa PR ; la fiche porte son lien, au motif de « Ouvrir la session ».
    const cloudPr = current.lieu === 'cloud' && current.branche ? cloudPrOf(await readCloudPrs($, source.root ?? source.dir, projectSettings(source).depot), current.branche) : undefined
    const prLink = cloudPr?.url !== undefined ? cloudPr : undefined
    const storedRecap = current.id ? recapOf(recapRaw) : undefined
    // #307 (maquette A) : la Mission garde la demande ; le récap de fin ouvre la carte Fin.
    const frame = missionFrame(current.label)
    const storedChanges = current.id ? changesOf(changesRaw) : undefined
    const storedTiming = current.done && current.id ? timingOf(timingRaw) : undefined
    const storedPitch = !current.done && current.id ? pitchOf(pitchRaw) : undefined
    // #535 : l'explication gardée d'une ouverte ne vaut que pour sa ligne d'alors ; une close garde la sienne.
    const keptWhy = current.id ? whyOf(whyRaw) : undefined
    const storedWhy = keptWhy && (current.done || whyFresh(keptWhy, current.label)) ? keptWhy : undefined
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
    // Depuis quand elle tourne (#341) : la date de création de sa session, apprise une fois, en fond ; sans elle,
    // une session repérée par son titre n'a que sa dernière activité.
    if (live?.entry.sessionId && !current.done) void learnCreated($, [live.entry.sessionId], now)
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
    // Le texte que la fiche montre : l'écriture en fond d'un champ précédent comprise (#354).
    const editText = editing ? pendingFor(source)?.open ?? (await readOr($, paths.open)) ?? '' : ''
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
        : relaunchOf(x)
          ? // #487 : close en partie, « à relancer » en orange (la pastille n'a pas de cloche).
            drawnPill({ text: stateBand({ state: 'done', relaunch: relaunchOf(x)! }).word, bg: palette.blockTint, fg: palette.blockOn, height: SIZE.pill.detail })
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
          {foldable && moreLink('mission-line', missionShown ? 'Replier' : `${shown.hidden} plus anciennes`, toggleMission)}
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
    const folded = (id: string) => !(editing && (id === 'chaine' || id === 'details')) && cardFolded(id, { foldedCards, openedCards }, current.done)
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
    // `grow` : la valeur prend le reste de la rangée, pour un texte au bord droit (#480, rangées « Livraison N »).
    const field = (name: string, value: RenderElement | undefined | false, key = name, grow = false) =>
      value ? (
        <Box key={`field:${key}`} flexDirection="column">
          {ruleAbove}
          <Box key={`field-row:${key}`} flexDirection="row" alignItems="center" gap={SPACE.row}>
            <Box width={10} flexShrink={0} flexDirection="row" alignItems="center">
              {strut(SIZE.strut.field)}
              <Text color={palette.text2}>{name}</Text>
            </Box>
            <Box key={`field-value:${key}`} flexDirection="row" alignItems="center" gap={SPACE.row} {...(grow ? { flexGrow: 1 } : {})} flexShrink={1} minWidth={0}>
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
        // Seule la tâche de la fiche en demi-gras : la mère au poids normal, comme dans la liste (#447).
        const strong = here
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
    // #535 (maquette A, version finale choisie par BBR le 2026-11-12) : l'explication de « why N » gardée, en carte
    // « Pourquoi » repliée d'office sous le carton : l'accroche, puis les quatre cases, l'étiquette au-dessus de son
    // texte (la colonne d'étiquettes coupe à 7 signes). Sans elle, sur une ouverte : le lien « Expliquer cette
    // tâche », qui envoie « why N » par la boîte d'envoi (le hook prompt.submit y joint le contexte, #140) ; une
    // ligne réécrite depuis propose de la refaire. Une close sans explication ne montre rien.
    const askWhy = () => {
      queueSubmit($, `why ${current.id}`)
      // La note redessine le panneau, et ce dessin envoie le message.
      void setView($, () => ({ whyAsked: current.key }))
    }
    const whyBox = (): RenderElement | null => {
      if (storedWhy)
        return card(
          'why',
          'Pourquoi',
          `expliquée le ${shortDate(todayOf(storedWhy.at))}`,
          <Box key="why-body" flexDirection="column" gap={SPACE.tight}>
            <Text key="why-hook" size="footnote" weight="semibold" wrap="wrap">{storedWhy.hook}</Text>
            {storedWhy.rows.map(r => (
              <Box key={`why:${keyPart(r.name)}`} flexDirection="column">
                {ruleAbove}
                <Text size="caption" color={palette.text2}>{r.name}</Text>
                <Text size="footnote" wrap="wrap">{r.text}</Text>
              </Box>
            ))}
          </Box>,
        )
      if (current.done || !current.id) return null
      if (whyAsked === current.key)
        return (
          <Box key="why-sent" paddingX={SPACE.indent}>
            <Box paddingX="sm" minWidth={0}><Text size="caption" color={palette.text2} wrap="wrap">{`« why ${current.id} » envoyé : la carte arrive ici dès que Claude a répondu.`}</Text></Box>
          </Box>
        )
      const label = keptWhy ? "La ligne a changé · Refaire l'explication" : 'Expliquer cette tâche'
      return (
        <Box key="why-ask-row" paddingX={SPACE.indent}>
          <Box paddingX="sm" flexDirection="row" minWidth={0}>
            {graphic && Client ? (
              <Box key="hit:why-ask" hover={{ backgroundColor: palette.hover }}>
                <Text size="footnote" color={palette.liveOn}>{label}</Text>
                {hit('why-ask', askWhy, 1)}
              </Box>
            ) : (
              <Button key="why-ask" plain dimColor label={label} onPress={askWhy} />
            )}
          </Box>
        </Box>
      )
    }
    const finBox = (): RenderElement | null => {
      if (!fin) return null
      const opened = conclusionOpen === current.key
      // Le Fait, le Souci et la version livrée sont dans le carton (#291) : la carte Fin ne les redit pas.
      // #341 (A2) : la carte Bilan s'ouvre sur le Souci, l'Essai suit (noms courts, #368) ; close, ni État ni Fait.
      const own = bilanRows(fin.rows, { done: current.done }).filter(r => !cartonFin.has(r.name))
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
                {/* Choix de BBR (#368) : la colonne des étiquettes de Détails, celle de la marque d'une fille. */}
                {Svg ? (
                  <Box flexShrink={0} flexDirection="row" alignItems="flex-start" alignSelf="flex-start">
                    <Svg source={`<svg xmlns="http://www.w3.org/2000/svg" width="${TREE_CHILD_PX}" height="${SIZE.strut.row}"/>`} alt="colonne des étiquettes" width={TREE_CHILD_PX} height={SIZE.strut.row} />
                    {/* Centrée sur la hauteur de la première ligne, comme dans Détails : calée en haut, elle passait au-dessus de sa valeur (#368). */}
                    <Box position="absolute" top={0} left={0} bottom={0} flexDirection="row" alignItems="center">
                      <Text size="caption" color={palette.text2}>{columnLabel(r.name)}</Text>
                    </Box>
                  </Box>
                ) : (
                  <Box width={10} flexShrink={0}>
                    <Text color={palette.text2}>{r.name}</Text>
                  </Box>
                )}
                <Box flexShrink={1} minWidth={0} flexGrow={1} paddingLeft={SPACE.row}>
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
      if (!draft) return null
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
    // L'état en pastille : celui que Maestro voit dans sa session, celui de la session qui y travaille ailleurs.
    const ownRunning = focusBrand && ownBrand?.data.own.id !== undefined ? runningBySession.get(ownBrand.data.own.id) : undefined
    // #191 : à l'arrêt, sans question, sa branche en avance sur sa base : « à fusionner », pas « t'attend ».
    const stepsSession = inSession ? ownBrand?.data.own.id : liveOf(current)?.entry.sessionId
    const stepsNote = await readSteps($, stepsSession)
    // #395 : close, mais sa session a repris du travail depuis (une étape commencée après fait:) : la fiche
    // la suit comme une tâche en session, ses vraies étapes, sans Done ni « Archiver cette session ».
    const stepsDone = stepsClosed(current.done, stepsNote?.steps, current.fait)
    const waitState: BrandTask['state'] | undefined = stepsDone
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
    if (!inSession) await behindDraw($, refreshAhead($, source, [stepsSession], now))
    const aheadNow = stepsSession ? aheadBySession.get(stepsSession)?.ahead : undefined
    // #468 (BBR) : à l'arrêt, sans question, sa PR fusionnée et sa ligne ouverte : « fusionnée · suite de main ».
    const ficheMerged = waitState === 'wait' && !current.done && stepsNote?.question === undefined && current.id !== undefined && (await mergedIdsOf($, source, [current])).has(current.id)
    const headState: BrandTask['state'] | undefined =
      waitState === 'wait' ? brandStateOf(taskSessionState({ asking: stepsNote?.question !== undefined, ahead: aheadNow ?? 0, ...(stepsNote ? { status: stepsNote } : {}), ...(ficheMerged ? { merged: true } : {}) })) : waitState
    // #440 : une ligne cloud n'a ni session locale ni étapes à lire ; sa fiche dit l'état de sa PR, celui de la bande.
    const cloudRow =
      !current.done && !headState && current.id !== undefined
        ? (await cloudTasksOf($, source, allTasks, t => t.label, now).catch(() => [] as BrandTask[])).find(c => c.id === current.id)
        : undefined
    const cloudNow = cloudRow?.cloud
    // #469 : une mission dit son état à elle (lancée, au travail, la phrase de fin), pas celui d'une PR.
    const cloudState = cloudNow ? cloudRowFiche({ cloud: cloudNow, ...(cloudRow?.mission ? { mission: cloudRow.mission } : {}) }) : undefined
    // #480 : les passes de ses livraisons, dès la deuxième ; la PR de la lecture déjà gardée (60 s), rien à lire sans `livré:`.
    const fichePr = cloudRow?.mission ? undefined : cloudNow ?? currentPr(await prsOfDelivered($, source, [current]), current)
    const fichePasses = (current.livre?.length ?? 0) > 0
      ? deliveryPasses(current, { working: cloudNow ? cloudNow.state !== 'delivered' : headState !== undefined && headState !== 'done', ...(fichePr ? { pr: fichePr } : {}) })
      : []
    const ficheLivraisons = passesShown(fichePasses) ? fichePasses : []
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
      ...(ficheLivraisons.length > 0 ? { deliveries: ficheLivraisons.length } : {}),
    })
    const fullBrand = focusBrand ?? taskBrandOf(current, source, allTasks, { label: s.titre, prereqs: prereqsFor })
    // #291 : la voie (stations d'avant et d'après) quitte l'en-tête ; la jauge de chaîne, au pied, la remplace.
    // En édition (#342), l'en-tête reste celui de la fiche : rien ne bouge.
    const { before: _before, next: _next, ...headBrand } = fullBrand
    // Le résumé de la tête de chaque carte, ce qu'elle garde repliée (#199).
    const summaries: Record<FicheCard, string> = {
      avancement: cardSummary('avancement', {
        ...(facts ? { branch: facts.branch } : {}),
        ...(current.attend !== undefined ? { attend: attendWho(current.attend) } : {}),
        ...(ficheLivraisons.length > 0 ? { deliveries: ficheLivraisons.length } : {}),
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
    const stepsPart = ficheSteps($, e, palette, stepsNote, now, stepsDone, stepsSession, headState)
    // L'état sous l'en-tête (#199, choix de Bertrand) : une bande teintée, son icône, son mot et pourquoi ;
    // il a quitté la ligne « Tâche lancée par Maestro », où il flottait à droite.
    const band = cloudState
      ? cloudState.band
      : headState
      ? stateBand({
          state: headState,
          abandoned,
          ...(stepsNote?.question ? { question: stepsNote.question.text } : {}),
          ...(stepsNote?.steps.find(x => x.status === 'in_progress') ? { current: stepsNote.steps.find(x => x.status === 'in_progress')!.content } : {}),
          ...(aheadNow ? { ahead: aheadNow } : {}),
          ...(current.fait ? { fait: current.fait } : {}),
          ...(ficheMerged ? { merged: true } : {}),
          ...(relaunchOf(current) ? { relaunch: relaunchOf(current)! } : {}),
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
                : band.mark === 'bell'
                  ? bellIcon(fg, SIZE.icon.sm)
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
            {current.done && current.verifie !== undefined && (
              <Box key="verified-pill" flexGrow={reopenRow ? 0 : 1} flexShrink={0} flexDirection="row" justifyContent="flex-end">
                {Svg
                  ? drawnPill({ text: verifiedLabel(current.verifie), bg: current.verifie === 'non' ? palette.blockTint : palette.doneTint, fg: current.verifie === 'non' ? palette.blockOn : palette.done, height: SIZE.pill.detail })
                  : <Text color={current.verifie === 'non' ? palette.blockOn : palette.done}>{verifiedLabel(current.verifie)}</Text>}
              </Box>
            )}
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
    // L'encart « À vérifier » (#635, fiche A) sous la bande d'une close publiée : l'essai, et « C'est bon, vérifiée »
    // (clé verify-task) ; vérifiée, le filet gris, l'essai en gris et « Repasser non vérifiée » (unverify-task).
    const verifyBox = () => {
      if (!current.done || current.verifie === undefined || isAbandoned(current) || !current.id) return null
      const id = current.id
      const ok = current.verifie !== 'non'
      const title = ok ? `✓ Vérifiée le ${shortDate(current.verifie)}` : 'À vérifier'
      const run = () => void setVerified($, ficheSource, [id], !ok)
      const label = ok ? 'Repasser non vérifiée' : "C'est bon, vérifiée"
      const key = ok ? 'unverify-task' : 'verify-task'
      return (
        <Box key="verify-row" paddingX={SPACE.indent}>
          <Box key="verify-box" flexDirection="column" gap={SPACE.tight} paddingX={SPACE.indent} paddingY="xs" flexGrow={1} flexShrink={1} minWidth={0} borderStyle="round" borderColor={ok ? palette.border : palette.block}>
            <Text weight="semibold" color={ok ? palette.done : palette.blockOn} wrap="wrap">{title}</Text>
            {current.essai !== undefined && <Text size="caption" color={ok ? palette.text2 : palette.text} wrap="wrap">{current.essai}</Text>}
            <Box flexDirection="row" alignItems="center" gap={SPACE.row}>
              {ok ? (
                <Button key={key} plain dimColor label={label} onPress={run} />
              ) : (
                pressable(
                  key,
                  run,
                  <Box flexDirection="row" alignItems="center" paddingX={SPACE.indent} backgroundColor={palette.pri}>
                    {corners(RADIUS.control, palette.bg)}
                    {strut(SIZE.strut.row)}
                    <Text weight="semibold" color={palette.priText}>{label}</Text>
                  </Box>,
                  <Button key={key} variant="primary" label={label} onPress={run} />,
                )
              )}
            </Box>
          </Box>
        </Box>
      )
    }
    // Le bouton des maquettes (#306, maquette A plus visible) : une bande sous l'état, « Tester les maquettes »
    // en grand et le nom de la page ; il ouvre à chaque clic, jamais « Fermer » (#401, BBR au formulaire).
    const mockupBand = () => {
      if (!mockupPage) return null
      const word = 'Tester les maquettes'
      const press = () => void openMockup($, mockupPage.path, ficheSource.root ?? ficheSource.dir)
      if (!Svg) {
        return (
          <Box key="mockup-row" paddingX={SPACE.indent}>
            <Button key="mockup-btn" label={`${word} · ${mockupPage.name}`} onPress={press} />
          </Box>
        )
      }
      // #291 (fiche finale) : en gris, pour que seul « Ouvrir la session » soit bleu ; l'icône garde le bleu.
      const fg = palette.liveOn
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
            <Svg source={browserIcon(fg, SIZE.icon.md)} alt="Navigateur" width={SIZE.icon.md} height={SIZE.icon.md} />
            <Text size="footnote" weight="semibold" color={palette.text}>{word}</Text>
            <Box flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-end">
              <Text size="caption" color={palette.text2} wrap="truncate-end">{mockupPage.name}</Text>
            </Box>
            <Svg source={externalIcon(fg, SIZE.icon.xs)} alt="Ouvrir dans le volet" width={SIZE.icon.xs} height={SIZE.icon.xs} />
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
    // Une mère (#447) : ni « Lancer » ni l'interrupteur Cloud | Mac ; ses étapes se lancent une à une.
    const launchable = !current.done && !live && !launched.includes(taskKey(current)) && !isMother(current, allTasks)
    // #416 (maquette B) : une routine n'a pas de cible ; une autre tâche lance vers la cible de l'interrupteur.
    const targeted = !isRoutine(current)
    if (targeted && launchable) {
      void loadRepoReach($, source)
      if (!repoReach.known) repoReach.redraw = true
      loadRecoDocs($, source, current)
      askJudge($, source, current)
    }
    const reco = recoOf(source, current)
    const target = launchTargetOf(source, current)
    const launchNow = () =>
      void (isRoutine(current)
        ? launchRoutine($, source, current, s.titre)
        : targeted && target === 'cloud'
          ? launchCloud($, source, current, s.titre)
          : launchSession($, source, current, s.titre, launchExtra))
    // L'interrupteur Local | Cloud, posé sur la reco (« conseillé ») ; au terminal, deux boutons.
    const targetSwitch = (): RenderElement => {
      const seg = (t: Sessions) => {
        // #622 (choix de BBR du 2026-11-16, « Cloud grisé ») : sans dépôt joignable, Cloud reste à sa place, grisé et
        // inerte ; la ligne sous « Lancer » dit pourquoi.
        if (t === 'cloud' && !cloudReachable(source)) {
          return Svg ? (
            <Box key="launch-target:cloud" flexDirection="row" alignItems="center" gap={SPACE.tight} paddingX={SPACE.indent} backgroundColor={palette.btn}>
              {corners(RADIUS.chip, palette.btn)}
              {strut(SIZE.strut.field)}
              <Svg source={cloudIcon(palette.text3, SIZE.icon.sm)} alt="Cloud indisponible : aucun dépôt joignable" width={SIZE.icon.sm} height={SIZE.icon.sm} />
              <Text size="footnote" color={palette.text3}>Cloud</Text>
            </Box>
          ) : (
            <Text key="launch-target:cloud" dimColor>Cloud (sans dépôt)</Text>
          )
        }
        const on = t === target
        const word = t === 'cloud' ? 'Cloud' : 'Local'
        const ink = on ? palette.text : palette.text2
        return pressable(
          `launch-target:${t}`,
          () => void setLaunchTarget($, current, t),
          <Box flexDirection="row" alignItems="center" gap={SPACE.tight} paddingX={SPACE.indent} backgroundColor={on ? palette.bg : palette.btn} hover={{ backgroundColor: on ? palette.bg : palette.btnHover }}>
            {corners(RADIUS.chip, palette.btn)}
            {strut(SIZE.strut.field)}
            {Svg && <Svg source={t === 'cloud' ? cloudIcon(ink, SIZE.icon.sm) : playIcon(ink, SIZE.icon.sm)} alt={word} width={SIZE.icon.sm} height={SIZE.icon.sm} />}
            <Text size="footnote" weight={on ? 'semibold' : 'regular'} color={ink}>{word}</Text>
            {t === reco.lieu && <Text size="caption" color={palette.text3}>conseillé</Text>}
          </Box>,
          <Button key={`launch-target:${t}`} plain dimColor={!on} label={`${on ? '● ' : ''}${word}${t === reco.lieu ? ' (conseillé)' : ''}`} onPress={() => void setLaunchTarget($, current, t)} />,
        )
      }
      return (
        <Box key="launch-target" flexDirection="row">
          <Box flexDirection="row" backgroundColor={palette.btn}>
            {corners(RADIUS.control, palette.bg)}
            {seg('cloud')}
            {seg('mac')}
          </Box>
        </Box>
      )
    }
    // La raison de la reco, en une ligne sous « Lancer ».
    const recoLine = (): RenderElement => (
      <Box key="launch-reco" flexDirection="row" gap={SPACE.tight} alignItems="flex-start" minWidth={0}>
        {Svg && <Svg source={reco.lieu === 'cloud' ? cloudIcon(palette.live, SIZE.icon.sm) : playIcon(palette.text3, SIZE.icon.sm)} alt={reco.lieu === 'cloud' ? 'cloud' : 'local'} width={SIZE.icon.sm} height={SIZE.icon.sm} />}
        {/* Le mot ne se coupe pas (capture de BBR, 0.259.0) : seule la raison passe à la ligne. */}
        <Box flexShrink={0}>
          <Text size="caption" weight="semibold" color={palette.text} wrap="truncate-end">{`Recommandé : ${reco.lieu === 'cloud' ? 'cloud' : 'local'}`}</Text>
        </Box>
        <Box flexGrow={1} flexShrink={1} minWidth={0}>
          <Text size="caption" color={palette.text2} wrap="wrap">{`· ${reco.why}`}</Text>
        </Box>
      </Box>
    )
    const toggleBrief = () => void setView($, v => ({ briefOpen: v.briefOpen === taskKey(current) ? '' : taskKey(current) }))
    // #336 (maquette A) : dans la session de sa tâche close, la bande grise « Archiver cette session » ; relue au clic.
    const archiveSelfBand = (): RenderElement => {
      const press = () => void archiveSelf($, ficheSource, current, own)
      if (!Svg) {
        return (
          <Box key="top-action" paddingX={SPACE.indent}>
            <Button key="archive-self" label="Archiver cette session" onPress={press} />
          </Box>
        )
      }
      return (
        <Box key="top-action" paddingX={SPACE.indent} flexDirection="row">
          {pressable(
            'archive-self',
            press,
            <Box flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent} flexGrow={1} minWidth={0} backgroundColor={palette.btn} hover={{ backgroundColor: palette.btnHover }}>
              {corners(RADIUS.control, palette.bg)}
              {strut(SIZE.strut.control)}
              <Svg source={archiveIcon(palette.text, SIZE.icon.md)} alt="Archiver" width={SIZE.icon.md} height={SIZE.icon.md} />
              <Text size="footnote" weight="semibold" color={palette.text}>Archiver cette session</Text>
              <Box flexGrow={1} flexShrink={1} minWidth={0} alignItems="flex-end">
                <Text size="caption" color={palette.text2} wrap="truncate-end">réversible</Text>
              </Box>
            </Box>,
            <Button key="archive-self" label="Archiver cette session" onPress={press} />,
            true,
          )}
        </Box>
      )
    }
    // Le lien de la PR d'une tâche cloud (#435) : le bouton à icône externe de « Ouvrir la session ».
    const prAction = (pr: CloudPr): RenderElement => (
      <Box key="top-action" paddingX={SPACE.indent} flexDirection="row">
        {primary('open-pr', externalIcon(palette.priText, 14), pr.number !== undefined ? `Ouvrir la PR ${pr.number}` : 'Ouvrir la PR', () => void openCloudPr($, pr))}
      </Box>
    )
    const topAction = (): RenderElement | null => {
      if (current.done && inSession && stepsDone) return archiveSelfBand()
      if (prLink && !live) return prAction(prLink)
      if (current.done) return null
      // Dans sa propre session, « Ouvrir la session » n'a pas de sens (#336) : la bande d'état suffit.
      if (live && inSession) return null
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
          {targeted && launchable && targetSwitch()}
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
          {targeted && launchable && recoLine()}
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
                setLaunchExtra(value)
              }}
              onSubmit={(value: string) => {
                setLaunchExtra(value)
                void launchSession($, source, current, s.titre, value)
              }}
            />
          )}
          {/* #465 : « Carte de session posée » seulement une fois la carte posée, jamais pendant « Lancement… ». */}
          {launched.includes(taskKey(current)) &&
            launchNote !== LAUNCHING &&
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
    const cartonState = headState ?? cloudState?.state ?? (live ? 'live' : undefined)
    const carton = cartonOf({
      ...(cartonState ? { state: cartonState } : {}),
      done: current.done,
      abandoned,
      ...(version ? { version } : {}),
      ...(current.due ? { due: current.due } : {}),
      ...(current.ouvert ? { ouvert: current.ouvert } : {}),
      ...(current.fait ? { fait: current.fait } : {}),
      ...(cloudNow ? { cloud: cloudNow.state } : ficheMerged ? { cloud: 'merged' as const } : {}),
      ...(relaunchOf(current) ? { relaunch: relaunchOf(current)! } : {}),
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
    // #385 : une seule origine, le lancement de la session, celle de la ligne En cours et de la bande (`sinceOf`),
    // pour le haut de la fiche, l'en-tête des Étapes et la durée de chaque étape.
    const liveOrigin = live && !current.done ? (sinceOf(live.entry.sessionId, live.entry, live.inferred) ?? liveSince(live.entry.startedAt, live.entry.sessionId ? createdBySession.get(live.entry.sessionId) : undefined)) : undefined
    const liveTopOf = () => live && !current.done && liveOrigin !== undefined
      ? liveHead({ startedAt: liveOrigin, now, steps: stepsStatus?.steps ?? [], ...(stepsStatus?.question ? { question: stepsStatus.question } : {}) })
      : undefined
    const timeSide = (big: string, small: string, pick?: () => void) => (
      <Box key="carton-time-side" flexDirection="column" alignItems="flex-end">
        <Text weight="semibold" tabular>{big}</Text>
        <Text size="caption" color={palette.text2}>{small}</Text>
        {pick && hit('duree-part', pick)}
      </Box>
    )
    const timeBox = (liveTop: ReturnType<typeof liveTopOf>): RenderElement | null => {
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
      // #532 : la durée seule, sans roue à sa droite : elle sortait coupée par le bord du volet.
      if (liveTop && live) {
        return (
          <Box key="carton-time" flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0}>
            {timeSide(liveTop.total, 'tourne depuis')}
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
    // « Oui coupe les anciennes ! » (BBR, 2026-11-08) : sans phrases, un libellé long se coupe à trois lignes.
    const shortLabel = lead || bulleted ? { text: frame.text, cut: false } : missionShort(frame.text)
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
            </Box>
            {dureePart && <Text key="duree-note" size="caption" color={palette.text2} wrap="wrap">{dureePart.note}</Text>}
            {/* Sans dessin (le terminal), les parts du donut en boutons. */}
            {current.done && duration && !drawsDonut && (
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
            {/* En édition (#342), le texte du carton « À lancer » s'ouvre en champ : le libellé de la mission. Celui de la session, non. */}
            {editSlot(
              missionEditable(carton.tone) ? editSpecs.find(spec => spec.field === 'label') : undefined,
              lead ? (
                <Box key="carton-lead" flexDirection="column" gap={SPACE.tight}>
                  <Markdown text={codeKeptWhole(lead)} />
                  {missionTag()}
                  {missionShown && <Text key="mission-line" size="caption" wrap="wrap">{current.label}</Text>}
                  {missionShown && noteShown && linked('note', noteShown, { color: palette.text2 })}
                </Box>
              ) : shortLabel.cut ? (
                // Une ligne sans phrases (#341, retour de test) : trois lignes du libellé, le reste sous « ▸ Mission ».
                <Box key="carton-lead" flexDirection="column" gap={SPACE.tight}>
                  <Text key="mission-short" wrap="wrap" {...(current.done ? { color: palette.text2 } : {})}>{missionShown ? frame.text : shortLabel.text}</Text>
                  {missionTag()}
                  {missionShown && noteShown && linked('note', noteShown, { color: palette.text2 })}
                </Box>
              ) : (
                missionBody(cartonLook.bg, current.done)
              ),
              clip(current.label, 80),
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
      if (!g) return null
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
    const stepsStatus = stepsNote ? shownStatus(stepsNote, stepsSession, stepsDone) : undefined
    const stepsAge = stepsStatus ? stepsView(stepsStatus.steps, { now, at: stepsStatus.at, fold: Infinity, closed: stepsDone })?.age ?? '' : ''
    const stepsGauge = stepsStatus ? stepGauge(stepsStatus.steps, { closed: stepsDone, age: stepsAge }) : undefined
    const stepsColors = { done: stepsDone ? palette.finished : palette.live, here: palette.text, pre: palette.block, next: palette.live, open: palette.sel, none: palette.text3, cancelled: palette.sel, ring: palette.text }
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
    // #368 (maquette A) : rien n'y est un groupe sans boîte (`<>…</>`), qui devient une colonne au bureau : la marque
    // est un seul dessin, ce qui va à droite est une liste d'éléments posés dans la rangée de droite.
    const familyLine = (key: string, x: Task, o: { here: boolean; marks: RenderElement; title: RenderElement; right: RenderElement[] }) => {
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
          {/* Le titre suit sa marque d'une cellule : celui de la mère tombe au-dessus de la case de ses filles, comme dans la liste. */}
          <Box flexShrink={1} minWidth={0} paddingLeft={SPACE.row}>
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
              marks: Svg ? (
                <Svg source={familyLeadIcon(axisHex(lead.task.axis))} alt="mère" width={FAMILY_MARK_PX} height={24} />
              ) : (
                <Text color={palette.text2}>■</Text>
              ),
              // #488 : au poids normal, comme ses filles ; la ligne de la fiche se dit par son fond et son « ici ».
              title: <Text wrap="truncate-end">{lead.title}</Text>,
              right: [
                ...(Svg ? [<Svg key="family-gauge" source={gaugeIcon(lead.kinds, chainColors, 56, 6)} alt={`${f.count}`} width={56} height={6} />] : []),
                <Text key="family-count" size="caption" tabular color={palette.text2}>{lead.right}</Text>,
              ],
            })}
          {!closed &&
            f.rows.map((r, i) => {
              // La marque de la liste (#368, maquette A) : coude et case en un seul dessin, la case sous le titre de la mère.
              const last = i === f.rows.length - 1
              const alt = r.state === 'cancelled' ? 'annulée' : r.state === 'done' ? 'faite' : r.task.axis
              const marks = Svg ? (
                <Svg
                  source={familyRowIcon(familyCase(axisHex(r.task.axis), r.state, palette.onAxis), f.tree ? (last ? 'last' : 'mid') : 'none', palette.border)}
                  alt={alt}
                  width={TREE_CHILD_PX}
                  height={24}
                />
              ) : (
                <Text color={palette.text3}>{`${f.tree ? (last ? '└ ' : '├ ') : '  '}${r.state === 'done' || r.state === 'cancelled' ? '✓' : '■'}`}</Text>
              )
              return familyLine(r.task.key, r.task, {
                here: r.here,
                marks,
                title: (
                  <Text
                    wrap="truncate-end"
                    {...(r.state === 'done' || r.state === 'cancelled' ? { strikethrough: true, color: palette.text3 } : {})}
                  >
                    {r.title}
                  </Text>
                ),
                right: [<Text key="family-right" size="caption" tabular color={r.tone === 'block' ? palette.blockOn : palette.text2} wrap="end">{r.right}</Text>],
              })
            })}
        </Box>
      )
    }
    // Une rangée de Détails : l'étiquette sur 10 unités, la valeur à côté ; sans filet (le filet sépare les groupes).
    // Au retrait du carton (#352) ; la valeur et son appoint sur une seule ligne (« dans 7 j » à côté des dates),
    // la rangée bornée à la largeur du cadre (`minWidth={0}`) : une source en prose passe à la ligne.
    // #368 (retour de test de BBR, capture annotée) : la valeur tombe sur le guide des titres de la famille. Sa
    // colonne a la largeur de la marque d'une fille (`TREE_CHILD_PX`), tenue par un dessin (une cellule n'a pas de
    // largeur sûre en px, #282) ; l'étiquette s'y pose par-dessus, et la valeur suit à une cellule, comme un titre.
    const detailColumn = `<svg xmlns="http://www.w3.org/2000/svg" width="${TREE_CHILD_PX}" height="${SIZE.strut.row}"/>`
    const detailRow = (name: string, value: RenderElement, key: string) => (
      <Box key={`detail:${key}`} flexDirection="row" alignItems="center" paddingX="sm" minWidth={0}>
        {Svg ? (
          <Box flexShrink={0} flexDirection="row" alignItems="center" alignSelf="flex-start">
            <Svg source={detailColumn} alt="colonne des étiquettes" width={TREE_CHILD_PX} height={SIZE.strut.row} />
            <Box position="absolute" top={0} left={0} bottom={0} flexDirection="row" alignItems="center">
              <Text size="caption" color={palette.text3}>{columnLabel(name)}</Text>
            </Box>
          </Box>
        ) : (
          <Box width={10} flexShrink={0} flexDirection="row" alignItems="center">
            <Text size="caption" color={palette.text3}>{name}</Text>
          </Box>
        )}
        <Box key={`detail-value:${key}`} flexDirection="row" flexWrap="nowrap" alignItems="center" gap={SPACE.row} paddingLeft={SPACE.row} flexShrink={1} minWidth={0}>
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
            // La valeur et son appoint dans une rangée à eux : un `<>…</>` deviendrait une colonne au bureau (#391).
            const text = (
              <Box key={`detail-text:${gi}:${ri}`} flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={1} minWidth={0}>
                <Box key={`detail-main:${gi}:${ri}`} flexShrink={r.sub ? 0 : 1} minWidth={0}>
                  {r.mono ? mono(r.value) : <Text size="footnote" wrap={r.file ? 'truncate-end' : 'wrap'}>{r.value}</Text>}
                </Box>
                {r.sub && (
                  <Box key={`detail-sub:${gi}:${ri}`} flexShrink={1} minWidth={0}>
                    <Text size="caption" color={palette.text2} wrap="truncate-end">{r.sub}</Text>
                  </Box>
                )}
              </Box>
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
      // En édition (#342), les deux cartes qui portent les champs du pied prennent la place du bloc.
      if (editing) return editFootCards()
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
        {heldSay !== '' && <Text size="caption" color={palette.lateOn} wrap="wrap">{heldSay}</Text>}
        {closeKind === 'done' && unsentNow !== undefined && cancelNote !== unsentNow && <Text size="caption" color={palette.lateOn} wrap="wrap">{unsentNow}</Text>}
        {closeKind === 'abandon' && Input && (
          <Input
            key={`cancel-reason:${current.key}`}
            rows={2}
            placeholder="Raison (facultatif)"
            submitLabel="annuler"
            onInput={(value: string) => {
              setCancelReason(value)
            }}
            onSubmit={(value: string) => {
              setCancelReason(value)
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
      if (current.done)
        return kept && !inSession ? (
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
                    setCancelReason('')
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
    // Le pied de la fiche (#380, maquette A) : celui de la liste, la roue et la version à gauche ; à droite,
    // « N en file » quand Maestro a une file (#345), puis l'icône du centre de contrôle, qui l'ouvre (#367).
    const ficheFoot = () => {
      const queuedText = ficheQueuePill(ownBrand?.brand.kind === 'maestro' ? (doseView?.queued ?? 0) : 0)
      const openControlPane = () => void openControl($)
      return (
        <Box key="fiche-foot-block" flexDirection="column" gap="xs">
          {Svg && <Svg source={ruleIcon(palette.border, fullWidth((e.props as { bodyColumns?: number }).bodyColumns ?? 48))} alt="séparateur" height={1} />}
          <Box key="fiche-foot" flexDirection="row" justifyContent="space-between" alignItems="center" paddingX={SPACE.indent}>
            {footLeft()}
            <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0} marginLeft={1}>
              {queuedText !== undefined && drawnPill({ text: queuedText, bg: palette.sel, fg: palette.text2, weight: TEXT.weight.soft })}
              {graphic && Svg ? (
                <Box key="hit:fiche-control" flexDirection="row" alignItems="center" flexShrink={0} hover={{ backgroundColor: palette.hover }}>
                  {strut(SIZE.strut.row)}
                  <Svg source={controlIcon(palette.text2, 16)} alt="Centre de contrôle" width={SIZE.icon.md} height={SIZE.icon.md} />
                  {hit('fiche-control', openControlPane, 1)}
                </Box>
              ) : (
                <Button key="fiche-control" plain label="Centre de contrôle" onPress={openControlPane} />
              )}
            </Box>
          </Box>
        </Box>
      )
    }
    // #480 (maquette V2, « le fil ») : la carte Avancement ne revient que pour les livraisons, dès la deuxième passe : une
    // rangée par livraison, de la hauteur des autres champs, le fil reliant leurs points à travers le filet.
    const livraisonRows = (
      <Box key="livraisons" flexDirection="column">
        {ficheLivraisons.map((p, i) => {
          const words = passRow(p, i)
          const rail = Svg ? deliveryRailIcon(p.tone, i === 0 ? 'first' : i === ficheLivraisons.length - 1 ? 'last' : 'mid', ficheLivraisons[i + 1]?.tone === 'next', palette) : undefined
          return field(
            `Livraison ${i + 1}`,
            <Box key={`livraison-row:${i}`} flexGrow={1} flexShrink={1} minWidth={0} flexDirection="row" alignItems="center" gap={SPACE.row}>
              {rail && Svg ? <Svg source={rail.source} alt={passLabel(p)} width={rail.width} height={rail.height} /> : <Text color={palette.text3}>•</Text>}
              <Text tabular wrap="truncate-end">{words.name}</Text>
              <Box flexGrow={1} flexShrink={1} minWidth={0} flexDirection="row" justifyContent="flex-end">
                <Text size="caption" color={palette.text3} wrap="truncate-end">{words.words}</Text>
              </Box>
            </Box>,
            `livraison:${i}`,
            true,
          )
        })}
      </Box>
    )
    const cards: Record<FicheCard, () => RenderElement> = {
      avancement: () =>
        card(
          'avancement',
          'Avancement',
          summaries.avancement,
          ficheLivraisons.length > 0 ? (
            livraisonRows
          ) : (
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
                                setCancelReason('')
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
                        {heldSay !== '' && <Text size="caption" color={palette.lateOn} wrap="wrap">{heldSay}</Text>}
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
                              setCancelReason(value)
                            }}
                            onSubmit={(value: string) => {
                              setCancelReason(value)
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
          </Box>
          ),
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
                  !isMother(current, allTasks) &&
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
                      setLaunchExtra(value)
                    }}
                    onSubmit={(value: string) => {
                      setLaunchExtra(value)
                      void launchSession($, source, current, s.titre, value)
                    }}
                  />
                </Box>
              )}
              {!current.done && !live && launched.includes(taskKey(current)) && launchNote !== LAUNCHING && (
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
                          setCancelReason('')
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
                  {heldSay !== '' && <Text size="caption" color={palette.lateOn} wrap="wrap">{heldSay}</Text>}
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
                        setCancelReason(value)
                      }}
                      onSubmit={(value: string) => {
                        setCancelReason(value)
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
    const specOf = (field: EditField) => editSpecs.find(spec => spec.field === field)
    const editId = (spec: EditSpec) => `edit-open:${keyPart(editKey)}:${keyPart(spec.field)}`
    // Le champ ouvert : un champ de saisie, ou un menu quand le projet liste ses valeurs. Entrée enregistre ce
    // seul champ, un menu s'enregistre au choix (#342) ; la frappe garde le brouillon hors de l'état.
    const editInput = (spec: EditSpec) => {
      const draftKey = `${editKey}|${spec.field}`
      const value = editDrafts.get(draftKey) ?? spec.value
      const key = `edit:${keyPart(editKey)}:${keyPart(spec.field)}`
      if (Select && spec.options) {
        const none = '—'
        const options = [...(value === '' ? [none] : []), ...(spec.options.includes(value) || value === '' ? [] : [value]), ...spec.options]
        return (
          <Select
            key={key}
            label={spec.name}
            options={options.map(o => ({ value: o }))}
            value={value === '' ? none : value}
            onSelect={(v: string) => void confirmField($, source, current, spec, v === none ? '' : v)}
          />
        )
      }
      if (!Input) return <Text wrap="wrap">{value}</Text>
      return (
        <Input
          key={key}
          {...(spec.field === 'label' ? { rows: 3 } : {})}
          placeholder={spec.field === 'nom' ? drawnTitle : spec.field === 'due' ? 'AAAA-MM-JJ' : spec.options ? spec.options.join(', ') : spec.field === 'apres' || spec.field === 'parent' ? 'N, ou -' : ''}
          value={value}
          submitLabel="↵"
          onInput={(v: string) => void editDrafts.set(draftKey, v)}
          onSubmit={(v: string) => void confirmField($, source, current, spec, v)}
        />
      )
    }
    const editBad = (spec: EditSpec) => !saveBusy && editNote !== '' && editField === spec.field
    // Le V vert posé à côté d'une valeur qui vient d'être enregistrée, jusqu'au geste suivant (#342).
    const savedMark = (spec: EditSpec) =>
      editSaved === spec.field && (
        <Box key={`saved:${keyPart(spec.field)}`} flexDirection="row" alignItems="center" gap={SPACE.tight} flexShrink={0}>
          {Svg ? <Svg source={checkIcon(palette.ok, SIZE.icon.xs)} alt="coche" width={SIZE.icon.xs} height={SIZE.icon.xs} /> : <Text color={palette.ok}>✓</Text>}
          <Text size="caption" color={palette.ok}>enregistré</Text>
        </Box>
      )
    // Un élément éditable de la fiche (#342, maquette B′) : fermé, sa valeur telle que la fiche la montre, un fond
    // au survol, un clic l'ouvre ; ouvert, le champ à sa place avec le refus dessous. Un seul champ ouvert à la
    // fois ; l'ouvrir referme l'autre et efface son brouillon. `text` : la valeur au terminal, où le bouton la porte.
    const editSlot = (spec: EditSpec | undefined, shown: RenderElement, text: string): RenderElement => {
      if (!editing || !spec) return shown
      if (editOpen === spec.field) {
        return (
          <Box key={`edit-slot:${keyPart(spec.field)}`} flexDirection="column" gap={SPACE.tight} flexGrow={1} flexShrink={1} minWidth={0}>
            {editInput(spec)}
            {editBad(spec) && <Text size="caption" color={palette.lateOn} wrap="wrap">{editNote}</Text>}
            {saveBusy && editField === spec.field && <Text size="caption" color={palette.text2}>Enregistrement…</Text>}
          </Box>
        )
      }
      const id = editId(spec)
      const open = () => {
        editDrafts.delete(`${editKey}|${spec.field}`)
        void setView($, () => ({ editOpen: spec.field, editSaved: '', editNote: '', editField: '' }))
      }
      return (
        <Box key={`edit-slot:${keyPart(spec.field)}`} flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={1} minWidth={0}>
          {graphic && Client ? (
            <Box key={`hit:${id}`} flexShrink={1} minWidth={0} hover={{ backgroundColor: palette.hover }}>
              {shown}
              {hit(id, open)}
            </Box>
          ) : (
            <Button key={id} plain label={text} onPress={open} />
          )}
          {savedMark(spec)}
        </Box>
      )
    }
    // Les lignes « étiquette | valeur » d'une carte du pied : la valeur vide (ou `-`) dit « + ajouter » ; une
    // prérequise ou un parent se lit par son numéro et son titre, comme la maquette B′ (fidélité de #342).
    const shownValue = (spec: EditSpec): string => {
      const v = spec.value.trim()
      if (v === '' || v === '-') return ''
      if (spec.field !== 'apres' && spec.field !== 'parent') return v
      return v
        .split(',')
        .map(n => n.trim().replace(/^#/, ''))
        .filter(n => n !== '')
        .map(n => {
          const x = allTasks.find(y => y !== current && y.id === n)
          return x ? `#${n} ${short(x).titre}` : `#${n}`
        })
        .join(', ')
    }
    const editRows = (where: EditPlace) => (
      <Box flexDirection="column" gap={SPACE.tight}>
        {editSpecs
          .filter(spec => editPlace(spec.field) === where)
          .map(spec => {
            const shown = shownValue(spec)
            return field(
              spec.name,
              editSlot(
                spec,
                shown !== '' ? <Text wrap="truncate-end" hover={{ underline: true }}>{shown}</Text> : <Text color={palette.text3} hover={{ underline: true }}>+ ajouter</Text>,
                shown !== '' ? shown : '+ ajouter',
              ),
              keyPart(spec.field),
            )
          })}
      </Box>
    )
    // Au pied, en édition : « Sa chaîne » (Après, Parent) et « Détails » (Responsable, clés du projet), puis
    // ce que la fiche en édition doit encore dire.
    const editFootCards = (): RenderElement => (
      <Box key="edit-foot" flexDirection="column" gap={SPACE.root}>
        {card('chaine', 'Sa chaîne', '', editRows('chaine'))}
        {card('details', 'Détails', '', editRows('details'))}
        {(live || launched.includes(editKey) || (source.ecriture && !bilanData.viaCowork)) && (
          <Box key="edit-notes" flexDirection="column" gap={SPACE.tight} paddingX={SPACE.indent}>
            {(live || launched.includes(editKey)) && (
              <Text size="caption" color={palette.lateOn} wrap="wrap">Une session tient cette tâche : elle peut encore l'écrire.</Text>
            )}
            {source.ecriture && !bilanData.viaCowork && <Text size="caption" color={palette.text2} wrap="wrap">{entrustedNote(source.ecriture)}</Text>}
          </Box>
        )}
      </Box>
    )
    const stopEditing = () => {
      clearDrafts(editKey)
      void setView($, () => ({ editing: '', editOpen: '', editSaved: '', editNote: '', editField: '' }))
    }
    // Le crayon, à droite du titre d'une ouverte (#161) : « Modifier » ferme l'encart de clôture. En édition (#342), il devient
    // « Terminé », à la même place : un champ ouvert mais pas validé se perd.
    const pencil = current.done
      ? undefined
      : editing
        ? pressable(
            'edit-done',
            stopEditing,
            <Box
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              gap={SPACE.row}
              paddingX={SPACE.indent}
              backgroundColor={palette.pri}
              hover={{ backgroundColor: mixOver(palette.pri, palette.bg, MIX.primaryHover) }}
            >
              {corners(RADIUS.control, palette.bg)}
              {strut(SIZE.strut.row)}
              {Svg && <Svg source={checkIcon(palette.priText, SIZE.icon.sm)} alt="coche" width={SIZE.icon.sm} height={SIZE.icon.sm} />}
              <Text weight="semibold" color={palette.priText}>Terminé</Text>
            </Box>,
            <Button key="edit-done" variant="primary" label="Terminé" onPress={stopEditing} />,
          )
        : (() => {
            // Plus petit (#342, option 1, retour de BBR au test de #341) : le crayon gris de 12 px, sans fond ;
            // le fond du bouton n'apparaît qu'au survol.
            const startEditing = () => {
              clearDrafts(editKey)
              void setView($, () => ({ editing: editKey, editOpen: '', editSaved: '', editNote: '', editField: '', cancelAsk: '', cancelNote: '' }))
            }
            return pressable(
              'edit-task',
              startEditing,
              <Box flexDirection="row" justifyContent="center" alignItems="center" paddingX={SPACE.tight} hover={{ backgroundColor: palette.btnHover }}>
                {corners(RADIUS.chip, palette.bg)}
                {strut(SIZE.strut.row)}
                {Svg && <Svg source={pencilIcon(palette.text2, SIZE.icon.xs)} alt="Modifier" width={SIZE.icon.xs} height={SIZE.icon.xs} />}
              </Box>,
              <Button key="edit-task" plain label="Modifier" onPress={startEditing} />,
            )
          })()
    // Le drapeau de priorité (#300, F1, choix de BBR) : à gauche du crayon, le réglage « Priorités »
    // allumé, sur une ouverte hors édition ; posé, carré rouge et drapeau blanc ; ôté, carré gris clair.
    const priorityOn = isPriority(current)
    const priorityLabel = priorityOn ? 'Retirer la priorité' : 'Marquer prioritaire'
    const pressPriority = () => void togglePriority($, source, current)
    const priorityFlag =
      settings.priorities && !current.done
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
    // La durée tout en haut à droite, au bout de la ligne du titre (retour de test de #341, BBR le 2026-11-08) :
    // close, le donut et son total ; en cours, depuis quand elle tourne. En édition aussi : rien ne bouge (#342).
    const timeTop = timeBox(liveTopOf())
    const titleParts = [priorityFlag, pencil, timeTop].filter((x): x is NonNullable<typeof x> => Boolean(x))
    const titleEnd =
      titleParts.length > 1 || timeTop ? (
        <Box key="title-end" flexDirection="row" alignItems="center" gap={SPACE.row}>
          {titleParts}
        </Box>
      ) : (
        titleParts[0]
      )
    const openLine = () => void openFile($, source, current.done ? paths.done : paths.open, { line })
    const nameSpec = specOf('nom')
    const axisSpec = specOf('axis')
    const dueSpec = specOf('due')
    // Le titre et les pastilles de l'en-tête, éditables en place (#342) : le titre tiré du libellé tant qu'aucun
    // nom n'est posé ; l'échéance vide se pose par « + échéance ».
    const titleSlot = editing && nameSpec
      ? editSlot(
          nameSpec,
          <Text size="title" weight="semibold" wrap="wrap" hover={{ underline: true }}>{headBrand.kind === 'maestro' ? '' : headBrand.label}</Text>,
          headBrand.kind === 'maestro' ? '' : headBrand.label,
        )
      : undefined
    const pillsSlot = editing && axisSpec && dueSpec
      ? (p: { axis: RenderElement; meta: RenderElement[]; pill: (label: string) => RenderElement }) => (
          <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexWrap="wrap">
            {editSlot(axisSpec, p.axis, axisSpec.value || current.axis)}
            {editSlot(dueSpec, p.meta[0] ?? p.pill('+ échéance'), dueSpec.value !== '' ? dueSpec.value : '+ échéance')}
          </Box>
        )
      : undefined
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
                    ? () => void setView($, () => ({ whole: true, editing: '', editOpen: '', editSaved: '', editNote: '', editField: '' }))
                    : select(''),
                },
            { ...(titleSlot ? { title: titleSlot } : {}), ...(pillsSlot ? { pills: pillsSlot } : {}) },
          )}
        </Box>
        {/* La fiche finale (#291) : en session, la bande d'état se fond dans « Ouvrir la session ». */}
        {(headState !== 'live' || !live || inSession) && stateBox()}
        {verifyBox()}
        {topAction()}
        {mockupBand()}
        {draftBlock()}
        {cartonBox()}
        {gaugeBlock('steps', stepsGauge, stepsColors, stepsStatus ? { steps: stepsStatus.steps, times: stepTimes(stepsStatus.steps, { now, closed: stepsDone, at: stepsStatus.at, ...(liveOrigin !== undefined ? { origin: liveOrigin } : {}) }), spent: stepsSpent(stepsStatus.steps, { now, closed: stepsDone, at: stepsStatus.at, ...(liveOrigin !== undefined ? { origin: liveOrigin } : {}) }) } : undefined)}
        {/* La question en attente monte dans le carton d'une tâche en cours (#341, B1). */}
        {stepsQuestion && !(live && !current.done) && (
          <Box key="steps-question" paddingX={SPACE.indent}>
            <Box paddingX="sm" minWidth={0}><Text size="caption" color={palette.blockOn} wrap="wrap">{stepsQuestion}</Text></Box>
          </Box>
        )}
        {whyBox()}
        {finBox()}
        {changesBox()}
        {layout.cards.filter(c => c !== 'details').map(c => cards[c]())}
        {bottomBlock()}
        {closeRow()}
        <Box flexDirection="column" gap={SPACE.block} paddingX={SPACE.indent}>
          {openNote !== '' && openAt === '' && <Text size="caption" color={palette.text2}>{openNote}</Text>}
          {/* Après l'enregistrement : les avertissements du modèle (#125), ou ce qui n'est pas allé au bout. */}
          {editNote !== '' && !saveBusy && editField === '' && <Text size="caption" color={palette.lateOn} wrap="wrap">{editNote}</Text>}
        </Box>
        {ficheFoot()}
      </Box>
    )
  }

  // --- Vue d'ensemble, façon carte « Context » --------------------------------
  const total = openTasks.length + doneTasks.length
  const pct = (n: number, of: number) => (of === 0 ? 0 : Math.round((n * 100) / of))

  // Un seul mode (#176) : Ma journée à l'ouverture, les sept pastilles et le filtre « Qui » partout,
  // chacun caché quand il n'a rien ; un clic sur un axe garde le filtre choisi (#99).
  const { relanceDays, cles, clesVisibles, rangerPar } = projectSettings(source)
  setAxisKeepsState(true)
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
  // #385 : partout, la date de chaque session en cours dit depuis quand elle tourne (une lecture par session).
  await behindDraw($, learnCreated($, openTasks.filter(isLive).map(t => liveOf(t)?.entry.sessionId).filter((id): id is string => id !== undefined), now))
  // Une session close et pas archivée y garde sa ligne, « Completed », comme dans la bande (#218).
  // #408 : les lignes `lieu:cloud` prises entrent dans le bloc avec l'état de leur PR (aucune session locale à suivre).
  // #445 : et celles qu'une session cloud lancée par la carte native travaille, sans ligne prise, par le « #N » de leur PR.
  const cloudRows = maestroBrand
    ? (await runningCloudTasksOf($, source, [...openTasks, ...doneTasks], t => short(t).titre, now)).filter(c => !maestroBrand.tasks.some(b => b.id === c.id) && !openTasks.some(t => t.id === c.id && !t.branche && isLive(t)))
    : []
  // #468 (BBR) : les tâches du Mac dont la PR est fusionnée et la ligne ouverte disent « fusionnée · suite de main ».
  const mergedIds = maestroBrand ? await mergedIdsOf($, source, openTasks) : new Set<string>()
  const blockRows = maestroBrand ? liveBlockRows([...maestroBrand.tasks, ...cloudRows], openTasks, isLive, t => launchOf(t, liveOf(t)?.entry.sessionId, now), doneTasks) : []
  const blockOf = new Map(blockRows.flatMap(r => (r.brand ? [[r.brand.id, r.brand] as const] : [])))
  const blockKeys = new Set(blockRows.map(r => taskKey(r.task)))
  // Une tâche en file (#345) quitte la liste tant qu'elle attend : le centre de contrôle la montre (#367).
  const queuedIds = new Set(maestroBrand && doseView ? doseView.queue.map(q => q.id) : [])
  const inBlock = (t: Task) => blockKeys.has(taskKey(t)) || (t.id !== undefined && queuedIds.has(String(t.id)))
  const blockTasks = blockRows.map(r => r.task)
  // La file des tests lourds (#321, maquette C) : la pastille de chaque branche prend la place de la barre
  // d'étapes sur la ligne de sa session ; les suites d'une branche sans ligne (main, Maestro) ont la leur.
  setQueueWanted(maestroBrand !== undefined)
  const heavy = maestroBrand ? await readQueue($) : undefined
  const nowSec = Math.floor(now / 1000)
  const heavyMarks: Map<string, QueueMark> = heavy ? queueMarks(heavy, nowSec, (mainCheckout(await $.session.root()).split('/').filter(Boolean).pop() ?? '')) : new Map()
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
  // #486 : une tâche du bloc « En session » se trouve aussi : la recherche les prend toutes.
  const foundOpen = searching ? sortTasks(searchTasks(openTasks, search, titleOf), sortOrder) : []
  // Les annulées se trouvent comme les faites (#624), avec leur marque ; le résumé les compte à part.
  const foundDone = searching
    ? searchTasks([...doneTasks, ...cancelledTasks], search, titleOf).sort((a, b) => (b.fait ?? '').localeCompare(a.fait ?? ''))
    : []
  const foundCancelled = foundDone.filter(isAbandoned).length
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
  // Le sélecteur « Faites | Annulées » (#624, maquette B) : la vue des annulées, tant qu'il y en a.
  const showCancelled = showDone && view.doneKind === 'cancelled' && cancelledTasks.length > 0
  // La case « À vérifier » (#635, vue Faites A) : les closes `vérifié:non`, tant qu'il y en a ; la vue retombe sur Faites à 0.
  const unverifiedTasks = doneTasks.filter(t => t.verifie === 'non' && t.id !== undefined)
  const showVerify = showDone && view.doneKind === 'verify' && unverifiedTasks.length > 0
  const verifyPicked = (view.verifyPick ?? []).filter(id => unverifiedTasks.some(t => t.id === id))
  const pickKind = (kind: 'done' | 'cancelled' | 'verify') => () => void setView($, () => ({ doneKind: kind, doneDays: DONE_DAYS_STEP, closedGroups: [], moreGroups: [] }))
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
  // Un dessin resserré pour son poids (#414) se passe du crayon : une Box, un dessin et un bouton par axe, deux fois.
  const axisPen = (where: 'legend' | 'head', a: string) =>
    Svg && lineCap >= LINE_CAP ? (
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
  // Une mère ne montre aucune échéance (#552, choix de BBR) : ni la prochaine de ses filles, ni sa date finale
  // (#319), ni « en retard » ; ses filles disent les leurs. Son `due:` reste écrit sur sa ligne. La ligne se
  // lit sur `parentRowTask`, sa section sur la tâche elle-même.
  const rowParts = (row: Task, o: { tree: boolean; ghost: boolean; inSession: boolean; locked: boolean; open?: boolean; head?: boolean; parent?: Parameters<typeof keyPills>[3] }) => {
    if (o.ghost || row.done) return { feedback: false, keys: [] as PillSpec[], tags: [] as PillSpec[], due: undefined as PillSpec | undefined }
    const mother = o.head === true || row.isParent === true || isMother(row, allTasks)
    const t = parentRowTask(row, o.open === true)
    const feedback = t.feedback !== undefined
    // Une ligne ne redit pas sa tête (#265) : ni le jour de sa section, ni la personne de sa section.
    const quiet = bandQuiet(sectionOf.get(row), t)
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
    const due = mother ? undefined : listed.due !== undefined && t.due !== undefined ? duePill(t.due, today, { short: true }) : listed.due
    return { feedback, keys, tags, due }
  }

  // Une tâche en session (#143) : la roue (ou la main qui t'attend), la mini-barre et le compte, dans une
  // colonne de largeur fixe (#145) : d'une ligne à l'autre, la roue et la barre gardent leur place et leur
  // taille, quels que soient le titre, le compte (« 2/7 », « 8/11 ») ou l'absence de note ; seule la
  // découpe de la barre change. Pas de carte au survol (#145) : la ligne la coupait ; la fiche montre les étapes.
  // Une ligne du bloc « En cours » de Maestro (#160) lit les étapes et l'attente de sa session à lui.
  // La colonne tient tout son contenu, à la largeur du plus long compte montré (#177) : jamais coupé.
  // #385 : la colonne tient la plus longue durée montrée (« 2 h 10 »), l'horloge comptée à part.
  const sinceText = (t: Task, block?: BrandTask) => {
    const live = liveOf(t)
    const sid = block?.sessionId ?? live?.entry.sessionId
    return sinceLabel(block?.since ?? sinceOf(sid, live?.entry, live?.inferred ?? true), now)
  }
  const stepsCells = rowStepsCells([...blockTasks.map(t => sinceText(t, blockOf.get(t.id as string))), ...openTasks.filter(t => !inBlock(t) && (isLive(t))).map(t => sinceText(t))])
  // #408 : une ligne cloud écrit l'état de sa PR là où les autres ont leur barre : la colonne s'élargit à ces mots, et
  // la durée de chaque ligne reste au bord droit.
  const cloudColumn = [...blockOf.values()].some(bt => bt.cloud !== undefined)
  const wordsCells = cloudColumn ? CLOUD_WORDS_CELLS : 0
  // #440 (maquette B6) : une ligne cloud porte ses mots et sa jauge ; la colonne s'élargit des mots.
  const stepsColumns = wordsCells > 0 ? Math.max(stepsCells.columns, ROW_STEPS.icon + 1 + wordsCells + 1 + (cloudColumn ? pxCells(ROW_STEPS.bar) + 1 : 0) + ROW_STEPS.clock + stepsCells.count) : stepsCells.columns
  // L'icône d'état d'une ligne cloud, tirée de sa PR, et sa jauge (#440, maquette B6).
  const rowOf = (block: BrandTask): { cloud: CloudPr; mission?: BrandTask['mission'] } => ({ cloud: block.cloud as CloudPr, ...(block.mission ? { mission: block.mission } : {}) })
  const cloudStateMark = (row: { cloud: CloudPr; mission?: BrandTask['mission'] }) => {
    // #566 : sans nouvelles depuis 12 h, la prise débranchée à la place de la roue (maquette v4).
    if (cloudQuietWord(row, now)) return Svg ? <Svg source={unplugIcon(palette.block, 12, 'sans nouvelles')} alt="sans nouvelles" width={17} height={12} /> : <Text size="caption" color={palette.blockOn}>⚠</Text>
    const m = cloudRowFiche(row).band.mark
    const word = cloudRowFiche(row).band.word
    if (!Svg) return <Text size="caption" color={palette.text2}>{{ spinner: '◌', person: '✋', merge: '⑂', check: '✓' }[m]}</Text>
    const source = m === 'spinner' ? spinnerIcon(palette.live, 14, word, false, now) : m === 'person' ? handIcon(palette.block, 14, STROKE.pill, word) : m === 'merge' ? mergeIcon(palette.wait, 14, STROKE.pill, word) : checkIcon(palette.finished, 14, STROKE.pill)
    return <Svg source={source} alt={word} width={SIZE.icon.sm} height={SIZE.icon.sm} {...(m === 'spinner' ? { isInteractive: true } : {})} />
  }
  const cloudRowBar = (row: { cloud: CloudPr; mission?: BrandTask['mission'] }, key: string) => {
    const cloud = row.cloud
    const steps = cloudRowSteps(row)
    const bar = stepsBarIcon(palette, steps.segments, { width: ROW_STEPS.bar, height: 4, waiting: cloud.state === 'red' || cloud.state === 'closed', merging: cloud.state === 'ready' || cloud.state === 'merged', finished: cloud.state === 'delivered' })
    return <Svg key={key} source={bar.source} alt={`étapes ${steps.count}`} width={bar.width} height={bar.height} />
  }
  // Retour de test de #385 : plus de « Done » au bout d'une close du bloc, la coche et la jauge violette le disent.
  // #468 (maquette A v3) : son archive passe au bout de la ligne, à la place de la durée (`blockColumns`).
  const completedWord = stateBand({ state: 'done' }).word
  const blockArchivable = (bt: BrandTask | undefined) => bt?.state === 'done' && bt.archivable === true && (bt.sessionId !== undefined || bt.cloud !== undefined)
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
    // #384 : et prête (verdict ou étapes cochées) ; en attente de son travail de fond, la roue.
    // #383 : l'état unique (`taskSessionState`), la règle du centre de contrôle et de la bande.
    const stopped = !block && waitingOn(t) ? brandStateOf(taskSessionState({ asking: status?.question !== undefined, ahead: (sid ? aheadBySession.get(sid)?.ahead : undefined) ?? 0, ...(status ? { status } : {}) })) : undefined
    const merging = block ? block.state === 'merge' : stopped === 'merge'
    const waiting = block ? block.state === 'wait' : stopped === 'wait'
    // Close (#218) : la coche, violette quand la session ne tourne plus, et sa jauge pleine, comme la bande.
    const completed = block?.state === 'done'
    const view = status ? stepsView(status.steps, { now, at: status.at, closed: block ? block.closed === true : t.done }) : undefined
    // #385 (maquette 2) : depuis quand sa session tourne, l'horloge devant, à la place du compte « 6/8 ».
    const since = sinceText(t, block)
    const bar = status && view ? stepsBarIcon(palette, view.segments, { width: ROW_STEPS.bar, height: 4, waiting: waiting || status.question !== undefined, merging, finished: block?.finished === true }) : undefined
    const checkHex = block?.finished ? palette.finished : palette.done
    // Sa suite dans la file des tests lourds (#321, maquette C) : la pastille à la place de la barre et du compte.
    const queued = block && t.branche !== undefined ? heavyMarks.get(t.branche) : undefined
    const cloud = block?.cloud
    const tint = cloud ? (block && cloudQuietWord(block, now) ? { ...cloudTints(palette, cloud.state), word: palette.blockOn } : cloudTints(palette, cloud.state)) : undefined
    return (
      // Calée à droite (capture de 0.249.0, BBR : « Le temps doit être aligné à droite avec le bouton file d'attente ») :
      // la case est comptée en cellules, plus larges dans l'app que dans le compte ; le vide part à gauche, la durée
      // finit au bord, sous l'icône du centre de contrôle.
      <Box key={`steps:${t.key}`} flexDirection="row" alignItems="center" justifyContent="flex-end" gap={SPACE.row} flexShrink={0} {...(Svg ? { width: stepsColumns } : {})}>
        <Box width={ROW_STEPS.icon} flexShrink={0} flexDirection="row" justifyContent="center">
          {cloud && tint && block ? cloudStateMark(rowOf(block)) : completed ? (Svg ? <Svg source={checkIcon(checkHex, 14, STROKE.pill)} alt={completedWord} width={SIZE.icon.sm} height={SIZE.icon.sm} /> : <Text size="caption" color={checkHex}>✓</Text>) : merging ? mergeMark() : waiting ? hand() : spinner()}
        </Box>
        {cloud && tint ? (
          // #440 (maquette B6) : le mot court de sa PR, calé à droite devant sa jauge de six étapes ; la durée garde sa place.
          [
            <Box key={`cloud-words:${t.key}`} {...(Svg ? { width: CLOUD_WORDS_CELLS } : {})} flexShrink={0} minWidth={0} flexDirection="row" alignItems="center" justifyContent="flex-end">
              <Text size="caption" color={tint.word} wrap="truncate-end">{block ? cloudQuietWord(block, now) ?? blockWord({ state: block.state, cloud, ...(block.mission ? { mission: block.mission } : {}) }) : cloudWords(cloud.state).short}</Text>
            </Box>,
            ...(Svg && block ? [cloudRowBar(rowOf(block), `cloud-bar:${t.key}`)] : []),
          ]
        ) : queued ? (
          <Box flexGrow={1} flexShrink={1} minWidth={0} flexDirection="row" justifyContent="flex-end">
            {queuePill(queued)}
          </Box>
        ) : Svg &&
          (bar && view ? (
            <Svg source={bar.source} alt={`étapes ${view.count}`} width={bar.width} height={bar.height} />
          ) : (
            <Svg source={`<svg xmlns="http://www.w3.org/2000/svg" width="${ROW_STEPS.bar}" height="4"/>`} alt="espace" width={ROW_STEPS.bar} height={4} />
          ))}
        {wordsCells > 0 && !queued && <Box key={`cloud-gap:${t.key}`} flexGrow={1} />}
        {!queued && (
          <Box width={ROW_STEPS.clock + stepsCells.count} flexShrink={0} flexDirection="row" alignItems="center" justifyContent="flex-end" gap={0}>
            {since !== '' && (
              <Box width={ROW_STEPS.clock} flexShrink={0} flexDirection="row" alignItems="center">
                {Svg ? <Svg source={clockIcon(palette.text3, 12)} alt="lancée depuis" width={12} height={12} /> : <Text size="caption" color={palette.text3}>◷</Text>}
              </Box>
            )}
            {since !== '' && <Text size="caption" tabular color={palette.text3}>{since}</Text>}
          </Box>
        )}
      </Box>
    )
  }

  // #468 (maquette A v3, choisie par BBR le 2026-11-11) : une seule grille pour toutes les lignes du bloc « En session »,
  // du Mac comme du cloud : case, lieu, numéro, titre (le seul qui grandit), l'icône d'état collée à son mot, la jauge,
  // la durée (l'archive d'une livrée à sa place). Quand la place manque, le mot part d'abord, puis le titre ; le numéro
  // et la durée restent toujours, rien ne sort du cadre.
  // Une ligne du bloc sans BrandTask : une tâche qu'une autre session travaille (#187), lue par sa liste d'étapes.
  const blockStatus = (t: Task, block?: BrandTask) => (block ? blockSteps.get(block.id) : rowSteps.get(taskKey(t)))
  // #468 (BBR) : à l'arrêt, sans question, sa PR fusionnée et sa ligne ouverte : ni la main, ni « t'attend ».
  const blockMerged = (t: Task, block?: BrandTask) => (block ? block.merged === true : waitingOn(t) && blockStatus(t)?.question === undefined && t.id !== undefined && mergedIds.has(t.id))
  const blockState = (t: Task, block?: BrandTask): 'wait' | 'live' | 'merge' | 'done' => {
    const status = blockStatus(t, block)
    if (!block && blockMerged(t)) return 'live'
    if (block) {
      if (block.state === 'done') return 'done'
      if (block.state === 'merge') return 'merge'
      return block.state === 'wait' || status?.question !== undefined ? 'wait' : 'live'
    }
    const sid = liveOf(t)?.entry.sessionId
    const stopped = waitingOn(t) ? brandStateOf(taskSessionState({ asking: status?.question !== undefined, ahead: (sid ? aheadBySession.get(sid)?.ahead : undefined) ?? 0, ...(status ? { status } : {}) })) : undefined
    return stopped === 'merge' ? 'merge' : stopped === 'wait' || status?.question !== undefined ? 'wait' : 'live'
  }
  const blockWordOf = (t: Task, block?: BrandTask) => {
    return (block?.cloud ? cloudQuietWord(block, now) : undefined) ?? blockWord({ state: blockState(t, block), ...(block?.cloud ? { cloud: block.cloud } : {}), ...(block?.mission ? { mission: block.mission } : {}), ...(blockMerged(t, block) ? { merged: true } : {}) })
  }
  // #636 (maquette A) : le mot d'état et la durée ont la largeur en px de leur plus long texte, comme dans la bande ; les
  // cellules ci-dessous ne servent qu'au calcul de place (`sessionRowFit`).
  const blockWordPx = textColumnPx(blockTasks.map(t => blockWordOf(t, blockOf.get(t.id as string))))
  const blockWordCells = pxCells(blockWordPx)
  // #579 : la colonne de la durée du bloc suit le texte de ses durées, pas le plancher de la bande : l'horloge de 12 px,
  // 4 px d'écart, le texte ; l'archive de 16 px y tient.
  const blockEndPx = Math.max(SIZE.icon.md, 12 + 4 + textColumnPx(blockTasks.map(t => sinceText(t, blockOf.get(t.id as string)))))
  const blockEndCells = pxCells(blockEndPx)
  // Une colonne en px : une Box sans `width` qui tient une cale `Svg` (alt non vide) et porte son contenu par-dessus, en absolu.
  const pxColumn = (key: string, alt: string, px: number, children: any, justify: 'flex-start' | 'flex-end' = 'flex-start') =>
    Svg ? (
      <Box key={key} flexShrink={0} flexDirection="row" alignItems="center" justifyContent={justify}>
        <Svg source={`<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${SIZE.strut.row}"/>`} alt={alt} width={px} height={SIZE.strut.row} />
        <Box position="absolute" top={0} bottom={0} left={0} right={0} flexDirection="row" alignItems="center" justifyContent={justify} gap={0}>
          {children}
        </Box>
      </Box>
    ) : (
      <Box key={key} flexShrink={0} flexDirection="row" alignItems="center" justifyContent={justify} gap={0}>
        {children}
      </Box>
    )
  // #561 : les points des livraisons ne se dessinent plus au bloc (BBR les veut dans la bande seule) ; la case y fait
  // `MARK_SQUARE_PX`, comme dans la bande, et la jauge est une colonne facultative, qui part après le mot d'état.
  // Ce qui reste toujours : marges du panneau et du cadre, case, lieu, numéro, icône d'état, durée, et leurs écarts.
  const blockFixedCells = 6 + pxCells(MARK_SQUARE_PX) + 2 + treeNumCells + ROW_STEPS.icon + blockEndCells + 5
  const blockFit = sessionRowFit({ columns: (e.props as { bodyColumns?: number }).bodyColumns ?? 56, fixed: blockFixedCells, word: blockWordCells, gauge: pxCells(ROW_STEPS.bar) })
  const blockColumns = (t: Task, block?: BrandTask) => {
    const status = blockStatus(t, block)
    const state = blockState(t, block)
    const cloud = block?.cloud
    const word = blockWordOf(t, block)
    const merged = !cloud && blockMerged(t, block)
    const ink = cloud ? (block && cloudQuietWord(block, now) ? palette.blockOn : cloudTints(palette, cloud.state).word) : merged ? palette.waitOn : { live: palette.liveOn, wait: palette.blockOn, merge: palette.waitOn, done: palette.finishedOn }[state]
    const checkHex = block?.finished ? palette.finished : palette.done
    const icon = cloud && block
      ? cloudStateMark(rowOf(block))
      : state === 'done'
          ? Svg ? <Svg source={checkIcon(checkHex, 14, STROKE.pill)} alt={word} width={SIZE.icon.sm} height={SIZE.icon.sm} /> : <Text size="caption" color={checkHex}>✓</Text>
          : merged
            ? Svg ? <Svg source={spinnerIcon(palette.wait, 14, word, false, now)} alt={word} width={SIZE.icon.sm} height={SIZE.icon.sm} isInteractive /> : <Text size="caption" color={palette.waitOn}>◌</Text>
            : state === 'merge' ? mergeMark() : state === 'wait' ? hand() : spinner()
    const view = status ? stepsView(status.steps, { now, at: status.at, closed: block ? block.closed === true : t.done }) : undefined
    const queued = t.branche !== undefined ? heavyMarks.get(t.branche) : undefined
    const bar = cloud
      ? (() => {
          const steps = cloudRowSteps(rowOf(block as BrandTask))
          const drawn = stepsBarIcon(palette, steps.segments, { width: ROW_STEPS.bar, height: 4, waiting: cloud.state === 'red' || cloud.state === 'closed', merging: cloud.state === 'ready' || cloud.state === 'merged', finished: cloud.state === 'delivered' })
          return { source: drawn.source, width: drawn.width, height: drawn.height, alt: `étapes ${steps.count}` }
        })()
      : status && view
        ? (() => {
            const drawn = stepsBarIcon(palette, view.segments, { width: ROW_STEPS.bar, height: 4, waiting: state === 'wait', merging: state === 'merge' || merged, finished: block?.finished === true })
            return { source: drawn.source, width: drawn.width, height: drawn.height, alt: `étapes ${view.count}` }
          })()
        : undefined
    const since = sinceText(t, block)
    const archivable = block !== undefined && blockArchivable(block)
    const archiveId = `block-archive:${t.id ?? keyPart(t.key)}`
    return [
      // L'icône d'état collée au début de son mot (retour de BBR sur la v2) : les icônes en colonne, le mot à gauche.
      <Box key={`state:${t.key}`} flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0}>
        <Box width={ROW_STEPS.icon} flexShrink={0} flexDirection="row" justifyContent="center">
          {icon}
        </Box>
        {(blockFit.word || !Svg) &&
          pxColumn(`word-col:${t.key}`, 'colonne mot', blockWordPx, (
            <Text key={`word:${t.key}`} size="caption" color={ink} wrap="truncate-end">{word}</Text>
          ))}
      </Box>,
      // La jauge, ou la pastille de sa suite dans la file des tests lourds (#321), à la même place.
      // #561 : elle part avant le titre, après le mot ; la pastille qui prend sa place part avec elle.
      ...(blockFit.gauge || !Svg
        ? [
            <Box key={`gauge:${t.key}`} flexShrink={0} flexDirection="row" alignItems="center" justifyContent="flex-start" {...(Svg ? { width: pxCells(ROW_STEPS.bar) } : {})}>
              {queued ? queuePill(queued) : Svg && (bar ? <Svg source={bar.source} alt={bar.alt} width={bar.width} height={bar.height} /> : <Svg source={`<svg xmlns="http://www.w3.org/2000/svg" width="${ROW_STEPS.bar}" height="4"/>`} alt="espace" width={ROW_STEPS.bar} height={4} />)}
            </Box>,
          ]
        : []),
      // La durée au bord droit ; une livrée y met son archive (#468), qui n'a plus de durée à dire.
      pxColumn(
        `end:${t.key}`,
        'colonne durée',
        blockEndPx,
        archivable && block ? (
          Svg ? (
            <Box flexDirection="row" alignItems="center" flexShrink={0}>
              {strut(SIZE.strut.row)}
              <Svg source={archiveIcon(palette.text2, 16)} alt="Archiver la session" width={SIZE.icon.md} height={SIZE.icon.md} />
              {hit(archiveId, () => void archiveTaskRow($, block, now), 1)}
            </Box>
          ) : (
            <Button key={archiveId} plain dimColor label="Archiver" onPress={() => void archiveTaskRow($, block, now)} />
          )
        ) : since !== '' ? (
          // #468 (bande v2, BBR) : la durée à la couleur du mot de sa ligne, comme dans la bande.
          [
            <Box key={`clock:${t.key}`} flexShrink={0} flexDirection="row" alignItems="center">
              {Svg ? <Svg source={clockIcon(ink, 12)} alt="lancée depuis" width={12} height={12} /> : <Text size="caption" color={ink}>◷ </Text>}
            </Box>,
            Svg ? <Svg key={`clock-gap:${t.key}`} source={`<svg xmlns="http://www.w3.org/2000/svg" width="4" height="1"/>`} alt="espace" width={4} height={1} /> : null,
            <Text key={`since:${t.key}`} size="caption" tabular color={ink} wrap="truncate-end">{since}</Text>,
          ]
        ) : null,
        'flex-end',
      ),
    ]
  }

  // Une tâche, toujours sur une ligne : carré d'axe, pastilles, titre tronqué, âge, ▶ (#149).
  // Une tâche faite : la coche, le titre et son axe à droite.
  const row = (t: Task, chain?: ChainStep, tree?: TreeMark, block?: BrandTask, inLiveBlock = block !== undefined) => {
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
    // Une ligne du sursis de #556 (cochée, pas encore écrite) : sa case et son numéro ne répondent pas.
    const held = heldKeys.has(taskKey(t)) && !t.done
    const checkable = !ghost && block === undefined && !held && (!head || (tree !== undefined && !chain && Svg !== undefined))
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
    // #468 : une ligne cloud ne se coche et ne se barre qu'une fois livrée, sa ligne close dans ROADMAP-fait ; fusionnée,
    // sa ligne encore ouverte, elle attend la suite de main et la publication.
    const cloudMerged = block?.cloud?.state === 'delivered'
    const checkedMark = (t.done || cloudMerged || held) && !head && Svg !== undefined
    // La case qui vient d'être cochée ou rouverte joue son mouvement (#182, maquette A), une fois, dans
    // le cadre interactif qui seul joue le SMIL ; ensuite, le dessin fixe.
    const moving = Svg !== undefined && !head && !ghost ? checkMoveOf($, taskKey(t), t.done || held, now) : undefined
    // Une tâche faite qui reste dans les ouvertes le temps de sa tenue (#351) : sa ligne se teinte.
    const lingering = t.done && !head && !ghost && checkLingers(checkMoves.get(taskKey(t)), now)
    const markSource =
      moving !== undefined
        ? squareCheckMoveIcon(axisHex(t.axis), palette.onAxis, t.done || held, moving, palette.ok)
        : asked || chosen
          ? squareArmedRowIcon(axisHex(t.axis), asked ? palette.ok : palette.live, palette.onAxis, checkedMark)
          : checkedMark
            ? isAbandoned(t) && !head
              ? cancelRowIcon(palette.text3)
              : squareCheckRowIcon(axisHex(t.axis), palette.onAxis)
            : squareRowIcon(axisHex(t.axis))
    // L'arbre par axe (#168) : la mère porte sa flèche dans son carré, une fille son coude.
    // La vue de référence (#258, maquette A) : la flèche de la mère sort de son carré, grise, devant le # ;
    // une tâche seule garde sa place vide, une fille pose son carré sous le # de sa mère. Hors de l'arbre aussi
    // (#259 : recherche, « À relancer », bloc « En cours ») : la place vide, pour que les # s'alignent.
    // Dans l'arbre, la marque rapprochée (#265) : 24 px, une fille 45 ; hors de lui, 32 (#259).
    // Dans l'arbre, la mère et la tâche seule (#282) : la marque n'est que le carré (16 px) ; la flèche a son
    // dessin, centré dans la place qui va de la marque au #, dans un groupe sans écart (`grouped`).
    const grouped = tree !== undefined && !child && !chain && Svg !== undefined
    const markWidth = child ? TREE_CHILD_PX : grouped ? MARK_SQUARE_PX : inLiveBlock ? MARK_SQUARE_PX : tree ? TREE_MARK_PX : 32 // #561 : au bloc, la case de la bande
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
    const markAlt = `${isAbandoned(t) ? 'annulée' : t.done || held ? 'faite' : t.axis}${chosen ? ', choisie' : ''}${asked ? ', à confirmer' : ''}${chain ? `, étape ${chain.step}` : ''}${head ? (head.open ? ', replier' : ', déplier') : ''}`
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
    const shownRow = parentRowTask(t, head?.open === true)
    const dueQuiet = !t.done && (bandQuiet(sectionOf.get(t), shownRow).due || dayQuiet(shownRow))
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
    // Une mère (#447) n'a rien à livrer seule : son ▶ (#552) ne lance pas de session, il envoie à Maestro la
    // consigne de lancer ses filles ; il n'y en a que s'il en reste à lancer (ni en session, ni tenues).
    const motherDaughters = !t.done && !ghost && (head !== undefined || isMother(t, allTasks)) ? motherLaunchable(t, allTasks, isLive) : []
    const motherRow = head !== undefined || isMother(t, allTasks)
    const playable = !t.done && !held && !ghost && !inSession && !locked && !launched.includes(taskKey(t)) && (motherRow ? motherDaughters.length > 0 : true)
    const parts = rowParts(t, { tree: tree !== undefined, ghost, inSession, locked, open: head?.open === true, head: head !== undefined, ...(child?.parent ? { parent: child.parent } : {}) })
    // En session, la ligne tient dans la largeur (#177, #248 de Splitmybill) : une pastille qui ne laisse
    // pas sa place au titre part, avant que la colonne de session ne soit poussée hors du panneau. Ses
    // pastilles sont la Feedback et les clés (sans `listPills`), dans cet ordre. Le retrait compte les
    // marges du panneau, du cadre du bloc et de la ligne.
    // Dans l'arbre aussi (#258, la ligne la plus chargée de la vue de référence) : sa marque, son # serré,
    // la jauge de la mère (à droite, à la place de l'échéance), le département et l'échéance comptent dans ce qui ne rétrécit pas.
    const gaugeCells = head && head.block.total > 0 ? pxCells(34) + 1 + pxCells(7.3 * `${head.block.done}/${head.block.total}`.length) + 1 : 0
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
              steps: (head ? Math.max(AGE_CELLS, gaugeCells) : dueCells) + departmentCells + priorityCells,
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
              steps: (inLiveBlock ? ROW_STEPS.icon + (blockFit.word ? 1 + blockWordCells : 0) + (blockFit.gauge ? pxCells(ROW_STEPS.bar) + 1 : 0) + blockEndCells + 3 : stepsColumns) + priorityCells,
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
    // L'avancement de la mère (#163) : sa barre et ses filles faites sur leur total, calés à droite, à la place
    // de l'échéance que #552 lui a retirée (suite de #552, choix de BBR du 2026-11-13 ; #258 la posait juste
    // après le titre). Le titre gagne la place libérée.
    // Une mère des seules annulées (vue Annulées) se lirait 0/0 : sans jauge.
    const gauge = head && head.block.total > 0 ? (
      <Box key={`gauge:${t.key}`} flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={0}>
        {Svg ? <Svg source={progressIcon(head.block.done, head.block.total, palette.ok, palette.sel)} alt={`${head.block.done}/${head.block.total}`} width={34} height={SIZE.bar} /> : null}
        <Text size="caption" tabular color={palette.text2}>{`${head.block.done}/${head.block.total}`}</Text>
      </Box>
    ) : null
    // #583 : le numéro d'une ligne cloud du bloc ouvre sa conversation quand son lien est connu.
    const cloudLink = rowSession === undefined && block?.cloud ? cloudSessionLinkOf(block) : undefined
    const number = t.id ? taskNumber(t.id, rowSession ? () => void openSession($, rowSession.entry) : cloudLink ? () => void openHttpsUrl($, cloudLink).catch(() => undefined) : undefined, t.done || cloudMerged || held, grouped && !head ? 'grow' : undefined, checkable ? { press: pickByNumber, chosen } : undefined) : undefined
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
          // La place grandit jusqu'à la colonne du # : la flèche y est centrée, au milieu du carré et du # le
          // plus large, quelle que soit la largeur d'une cellule ; une tâche seule la garde vide. Le # d'une mère
          // tient la colonne entière (`treeNumCells`), calé à droite : à sa seule largeur, la place de la flèche
          // changeait avec ses chiffres et #9 sortait à droite de #52 (#618). La mère se replie par le carré et
          // la flèche.
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
        {/* #440 (maquette B6) : au bloc « En cours », où tourne la session, en gris, devant son numéro. */}
        {inLiveBlock && Svg && (
          <Box key={`place:${t.key}`} flexShrink={0} flexDirection="row" alignItems="center">
            <Svg source={block?.cloud ? cloudIcon(palette.text3, 14, 'Dans le cloud') : computerIcon(palette.text3, 14, 'En local')} alt={block?.cloud ? 'Dans le cloud' : 'En local'} width={SIZE.icon.sm} height={SIZE.icon.sm} />
          </Box>
        )}
        {!grouped && number}
        {/* #468 : en très étroit, le titre du bloc part avant la durée ; sa place reste, vide, et le numéro ouvre la session. */}
        {inLiveBlock && Svg && !blockFit.title ? <Box key={`lead:${t.key}`} flexGrow={1} flexShrink={1} minWidth={0} /> : (
        <Box key={`lead:${t.key}`} flexDirection="row" alignItems="center" flexGrow={1} flexShrink={1} minWidth={0}>
          {prioritized &&
            (Svg ? (
              <Box key={`prio:${t.key}`} flexShrink={0} paddingRight={SPACE.row}>
                <Svg source={priorityIcon(true, palette, PRIORITY_PX.row)} alt="Prioritaire" width={PRIORITY_PX.row} height={PRIORITY_PX.row} />
              </Box>
            ) : (
              <Text key={`prio:${t.key}`} color={palette.lateOn}>{'⚑ '}</Text>
            ))}
          {/* Sur le bureau (#224, maquette C de #212), le titre est un texte : la mère au poids d'une tâche seule (#447), une faite grise
              et barrée (#198), un titre provisoire estompé ; un bouton natif imposerait son encre, sa
              graisse et sa marge. Un bouton sans encre le couvre et ouvre la fiche. Au terminal, le bouton. */}
          {Svg ? (
            <Text wrap="truncate-end" {...(t.done || cloudMerged || held ? { strikethrough: true, color: lingering ? palette.text2 : palette.text3 } : greyed || !titled(t) ? { color: palette.text2 } : {})}>
              {s.titre}
            </Text>
          ) : null}
          {/* Une ligne cloud aussi (#435, demande de BBR) : le titre ouvre la fiche, qui porte le lien de la PR. */}
          {Svg ? (
            <Box position="absolute" top={0} left={0}>
              <Button key={t.key} plain onPress={select(selectionOf(t))}>
                {titleOverlay(s.titre)}
              </Button>
            </Box>
          ) : (
            <Button key={t.key} plain dimColor={greyed || (!t.done && !titled(t))} onPress={select(selectionOf(t))}>
              <Text wrap="truncate-end" {...(t.done || held ? { strikethrough: true, color: palette.text3 } : {})}>{s.titre}</Text>
            </Button>
          )}
        </Box>
        )}
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
        {inSession && (inLiveBlock ? blockColumns(t, block) : sessionColumn(t, block))}
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
        {/* Une mère y met sa jauge (suite de #552, #258) : calée à droite, avant le ▶, alignée sur les échéances de ses filles. */}
        {!kept && !inSession && !locked && (
          <Box key={`age:${t.key}`} minWidth={AGE_CELLS} flexShrink={0} flexDirection="row" justifyContent="flex-end">
            {gauge ?? due ?? (!head && right !== '' && (
              <Text size="caption" tabular color={t.done ? palette.text3 : palette.text2} wrap="end">
                {right}
              </Text>
            ))}
          </Box>
        )}
        {/* Une mère en session, tenue ou bloquée n'a pas de colonne de l'âge : sa jauge garde sa place à droite, avant le ▶. */}
        {(kept || inSession || locked) && gauge && (
          <Box key={`age:${t.key}`} minWidth={AGE_CELLS} flexShrink={0} flexDirection="row" justifyContent="flex-end">
            {gauge}
          </Box>
        )}
        {/* #635 : une close non vérifiée porte un petit rond orange au bout de sa ligne. */}
        {t.done && t.verifie === 'non' && Svg && (
          <Box key={`unverified:${t.key}`} flexShrink={0}>
            <Svg source={ringIcon(palette.block, SIZE.icon.sm)} alt="non vérifiée" width={SIZE.icon.sm} height={SIZE.icon.sm} />
          </Box>
        )}
        {/* Le ▶ au bout de la ligne, à la place du chevron (#149) : le titre ouvre la fiche. Sa colonne
            reste, vide, sur une faite (#198) : les âges restent alignés. */}
        {/* Dans le bloc « En cours », pas de colonne du ▶ : la main, la barre et la durée finissent au bord droit de
            la carte (retour de test de #385), pour toutes ses lignes, celles d'un autre Maestro comprises (0.251.0). */}
        {!inLiveBlock && (
          <Box key={`p:${t.key}`} width={3} flexShrink={0} flexDirection="row" justifyContent="center">
            {playable && (
              <Button key={`play:${t.key}`} plain dimColor onPress={() => void (motherRow ? submitWelcome($, motherLaunchText(t, motherDaughters, x => taskTitle(x, titles))) : isRoutine(t, head !== undefined) ? launchRoutine($, source, t, s.titre) : launchSession($, source, t, s.titre))}>
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
                  onSelect={(v: string) => (v === 'Ouverte' ? run({ status: 'open' }, 'rouvertes')() : void askDone($, withOpenKids(allTasks, picked)))}
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
    // #596 : une mère et ses filles se disent d'un trait, et ce que la mère ferme sans qu'on l'ait demandé se nomme.
    const family = batchFamily(allTasks, asking)
    const held = heldKids(allTasks, asking, me)
    const question = family ? `${familySay(family.mother, family.kids)} ?` : one ? `${one.id ? `#${one.id}` : `« ${clip(one.label, 30)} »`} faite ?` : `${n} tâches faites ?`
    const okLabel = n === 1 ? '✓ Faite' : '✓ Faites'
    // #556 : rien ne s'écrit avant la fin du sursis de 10 s, que « Annuler » de l'encart coupe.
    const ok = () => void startUndo($, source, asking, 'lot')
    const pill = Svg ? pillIcon({ text: okLabel, bg: palette.ok, fg: palette.onAxis, height: SIZE.pill.detail }) : undefined
    if (pill) ghostPressKeys.add('confirm-ok')
    return (
      <Box key="confirm" flexDirection="column">
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
        {held.length > 0 && (
          <Box key="confirm-held" paddingX={SPACE.indent}>
            <Text size="caption" color={palette.lateOn} wrap="wrap">{heldKidsSay(held, family?.mother)}</Text>
          </Box>
        )}
      </Box>
    )
  }

  // L'encart du sursis (#556, maquette A corrigée, choix du 2026-11-12) : à la place de la ligne de la liste, sur la
  // teinte des faites, derrière une question posée entre-temps et devant la barre de sélection ; « Annuler »
  // (un bouton de l'app) rend les lignes et la sélection, et le compteur « 8 s » le précède (#596).
  const undoBar = () => {
    const undo = undoNow as DoneUndo
    const left = Math.max(0, undo.until - now)
    return (
      <Box key="undo-bar" flexDirection="column" backgroundColor={palette.doneTint}>
        <Box key="undo-line" flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent}>
          <Box flexDirection="row" alignItems="center" flexGrow={1} flexShrink={1} minWidth={0}>
            <Text weight="semibold" color={palette.text} wrap="truncate-end">{undoSay(undo, allTasks)}</Text>
          </Box>
          {Svg && (
            <Box flexShrink={0}>
              <Svg source={undoCountIcon(palette.text2, left)} alt="Secondes restantes pour annuler" width={28} height={16} isInteractive />
            </Box>
          )}
          <Button key="undo-cancel" label="Annuler" onPress={() => void cancelUndo($)} />
        </Box>
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
  const doneAll = (showVerify ? [] : showCancelled ? cancelledTasks : doneTasks)
    .filter(t => matches(t, axis, 'all', me) && !inBlock(t))
    .sort((a, b) => (b.fait ?? '').localeCompare(a.fait ?? ''))
  // La fenêtre des faites (#497, maquette A) : les 14 derniers jours, 14 de plus par clic ; un dessin trop
  // lourd la resserre avec le plafond de lignes, au lieu de tomber en panne : chaque jour a sa tête.
  const doneDaysChosen = Math.max(DONE_DAYS_STEP, view.doneDays ?? DONE_DAYS_STEP)
  const doneDaysShown = doneWindowDays(doneDaysChosen, lineCap, LINE_CAP)
  const doneWin = showDone && !searching ? doneWindow(doneAll, doneDaysShown) : { shown: doneAll, rest: 0, restDays: 0 }
  const doneShown = doneWin.shown
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
  // Les bandes repliées d'office (#414) : passé le plafond de lignes, une bande attend qu'on l'ouvre ; ouverte
  // à la main (`openGroups`), elle passe devant les autres dans le budget.
  const autoFolded = new Set<string>()
  const bandOpen = (id: string) => !closedGroups.includes(id) && !autoFolded.has(id)
  const toggleBand = (id: string) => () =>
    void setView($, v =>
      bandOpen(id)
        ? { closedGroups: [...v.closedGroups.filter(c => c !== id), id], openGroups: v.openGroups.filter(o => o !== id) }
        : { closedGroups: v.closedGroups.filter(c => c !== id), openGroups: v.openGroups.includes(id) ? v.openGroups : [...v.openGroups, id] },
    )
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
        {Svg && <Svg source={mark} alt={`Section ${name}`} width={16} height={24} />}
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
  const idOf = (g: { key?: string; name: string }) => g.key ?? g.name
  // Par sujet, la bande d'axe tait la pastille d'axe : le budget plein (#168).
  let budget = Math.min(settings.axisPill && attend !== 'live' && !showDone && !clesVisibles?.length && axis === 'all' && (by !== 'subject' || rangerPar) ? ROW_BUDGET_AXIS_PILL : ROW_BUDGET, lineCap)
  const rowsOf = new Map<string, number>()
  // Le plafond de lignes (#414) : une tête de mère et son étape du jour sont des lignes dessinées, que le budget
  // ne comptait pas (56 lignes pour un budget de 20 sur AAFES, 270 Ko). Les bandes ouvertes à la main d'abord,
  // puis les autres dans l'ordre : celle dont le tour vient une fois le plafond atteint se replie d'office.
  const bandOf = (g: ListGroup) => (g.band ? idOf(g) : g.under)
  const chosen = (g: ListGroup) => {
    const band = bandOf(g)
    return band === undefined || openGroups.includes(band)
  }
  const ranked = searching ? allGroups : [...allGroups.filter(chosen), ...allGroups.filter(g => !chosen(g))]
  let lines = 0
  for (const g of ranked) {
    if (g.band) {
      if (!searching && lines >= lineCap && !openGroups.includes(idOf(g)) && !closedGroups.includes(idOf(g))) autoFolded.add(idOf(g))
      continue
    }
    if (g.under !== undefined && !bandOpen(g.under)) continue
    if (g.block?.head) lines += 1
    // Une mère repliée qui montre son étape du jour (#189) : une ligne.
    if (!g.bare && !isOpenGroup(idOf(g)) && g.focus) {
      budget -= 1
      lines += 1
    }
    if (!g.bare && !isOpenGroup(idOf(g))) continue
    // Une section dépliée en entier (« Voir les N autres ») prend les siennes, dans la limite du plafond.
    const n = moreGroups.includes(idOf(g)) ? Math.min(g.tasks.length, lineCap) : Math.min(g.tasks.length, Math.max(budget, 0))
    rowsOf.set(idOf(g), n)
    budget -= n
    lines += n
  }
  // Les groupes d'une bande repliée ne se dessinent pas, et ne prennent rien au budget.
  const groups = allGroups.filter(g => g.under === undefined || bandOpen(g.under))
  for (const g of groups)
    if (g.under !== undefined) for (const t of [...(g.block?.head ? [g.block.head as Task] : []), ...g.tasks, ...(g.focus ? [g.focus] : [])]) sectionOf.set(t, g.under)
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
    ? { label: 'Effacer', run: () => void updateSearchAtom($, () => '') }
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

  // La case « À vérifier » (#635, vue Faites A) : la barre « N choisies · Tout choisir · Marquer vérifiées », puis
  // les closes non vérifiées, chacune avec sa case, son titre et son essai en une ligne grise. Un seul écrit pour le lot.
  const verifyView = () => {
    if (!showVerify) return null
    const n = verifyPicked.length
    const run = () => void setVerified($, source, verifyPicked, true)
    const all = () => void setView($, () => ({ verifyPick: unverifiedTasks.map(t => t.id as string) }))
    const toggle = (id: string) => () => void setView($, v => ({ verifyPick: (v.verifyPick ?? []).includes(id) ? (v.verifyPick ?? []).filter(x => x !== id) : [...(v.verifyPick ?? []), id] }))
    return (
      <Box key="verify-view" flexDirection="column" gap={SPACE.tight}>
        <Box key="verify-bar" flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent} {...(n > 0 ? { backgroundColor: palette.liveTint } : {})}>
          <Box flexGrow={1} flexShrink={1} minWidth={0}>
            <Text weight="semibold" color={n > 0 ? palette.text : palette.text2} wrap="truncate-end">{n > 0 ? `${n} choisie${n > 1 ? 's' : ''}` : 'Choisis les tâches essayées'}</Text>
          </Box>
          <Button key="verify-all" plain dimColor label="Tout choisir" onPress={all} />
          {n > 0 && <Button key="verify-batch" variant="primary" label="Marquer vérifiées" onPress={run} />}
        </Box>
        {unverifiedTasks.map(t => {
          const id = t.id as string
          const on = verifyPicked.includes(id)
          return (
            <Box key={`verify-row:${keyPart(id)}`} flexDirection="row" alignItems="flex-start" gap={SPACE.row} paddingX={SPACE.indent} {...(on ? { backgroundColor: palette.liveTint } : { hover: { backgroundColor: palette.hover } })}>
              <Text color={on ? palette.live : palette.text3}>{on ? '☑' : '☐'}</Text>
              <Box flexDirection="column" flexGrow={1} flexShrink={1} minWidth={0}>
                <Text wrap="truncate-end">{`#${id} ${short(t).titre}`}</Text>
                {t.essai !== undefined && <Text size="caption" color={palette.text2} wrap="truncate-end">{t.essai}</Text>}
              </Box>
              {graphic ? hit(`verify-pick:${keyPart(id)}`, toggle(id)) : <Button key={`verify-pick:${keyPart(id)}`} plain dimColor label={on ? 'Retirer' : 'Choisir'} onPress={toggle(id)} />}
            </Box>
          )
        })}
      </Box>
    )
  }
  // Le sélecteur à deux cases (#624, maquette B) : « Faites N | Annulées M » à la place du résumé de la liste.
  const kindSelector = () => {
    const seg = (kind: 'done' | 'cancelled' | 'verify', word: string, n: number) => {
      const on = kind === 'verify' ? showVerify : kind === 'cancelled' ? showCancelled : !showCancelled && !showVerify
      const text = `${word} ${n}`
      return graphic && kind === 'verify' ? (
        <Box key={`hit:done-kind:${kind}`} flexDirection="row" gap={SPACE.row} paddingX={SPACE.indent} paddingY={0} alignItems="center" {...(on ? { backgroundColor: palette.bg } : { hover: { backgroundColor: palette.hover } })}>
          <Text size="caption" color={on ? palette.text : palette.text2} {...(on ? { weight: 'semibold' as const } : {})}>{word}</Text>
          <Text size="caption" tabular weight="semibold" color={palette.blockOn}>{String(n)}</Text>
          {hit(`done-kind:${kind}`, pickKind(kind))}
        </Box>
      ) : graphic ? (
        <Box key={`hit:done-kind:${kind}`} paddingX={SPACE.indent} paddingY={0} alignItems="center" {...(on ? { backgroundColor: palette.bg } : { hover: { backgroundColor: palette.hover } })}>
          <Text size="caption" tabular color={on ? palette.text : palette.text2} {...(on ? { weight: 'semibold' as const } : {})}>{text}</Text>
          {hit(`done-kind:${kind}`, pickKind(kind))}
        </Box>
      ) : (
        <Button key={`done-kind:${kind}`} plain dimColor={!on} label={text} onPress={pickKind(kind)} />
      )
    }
    return (
      <Box key="done-kinds" flexDirection="row" gap={SPACE.row} paddingX={0} paddingY={0} {...(graphic ? { backgroundColor: palette.btn } : {})}>
        {graphic && corners(RADIUS.control, palette.bg)}
        {seg('done', 'Faites', doneTasks.length)}
        {unverifiedTasks.length > 0 && seg('verify', 'À vérifier', unverifiedTasks.length)}
        {cancelledTasks.length > 0 && seg('cancelled', 'Annulées', cancelledTasks.length)}
      </Box>
    )
  }
  const anyAxis = axis !== 'all' || showDone
  const axisOn = (a: string) => axis === a && !showDone
  // La barre (#180, maquette C) : les seules ouvertes, par axe ; en vue Done, pleine, du vert des Done,
  // et un clic dessus revient aux ouvertes.
  const segments = showDone
    ? [showCancelled
      ? { name: DONE_SEGMENT, hex: palette.text3, theme: 'subtle', n: cancelledTasks.length, dim: false }
      : { name: DONE_SEGMENT, hex: palette.done, theme: 'success', n: doneTasks.length, dim: false }]
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
  // #522 (maquette A, BBR le 2026-11-12) : la bande « Finies » en tête de la liste : les sessions du projet dont la ligne est
  // close et qui restent ouvertes (`finishedOpenSessions`), leur compte, « Archiver les N » (le clic de BBR, jamais seul) ;
  // le chevron déplie une ligne par session. Chez Maestro, ses sessions restent dans son bloc « En session ».
  const finishedSkip = new Set<string>([...archivedSessionIds, ...blockTasks.map(t => liveOf(t)?.entry.sessionId).filter((s): s is string => s !== undefined)])
  const finished = finishedOpenSessions(listedSessionRows(), {
    done: new Set(doneTasks.map(t => t.id).filter((x): x is string => x !== undefined)),
    open: new Set(openTasks.map(t => t.id).filter((x): x is string => x !== undefined)),
    match: source.match,
    ...(ownSession?.id ? { selfId: ownSession.id } : {}),
    skip: finishedSkip,
  })
  const finishedRefused = finished.filter(s => finishedBatch?.refused.has(s.sessionId) || finishedBatch?.asked.has(s.sessionId))
  const finishedAfter = finishedBatch !== undefined && finishedRefused.length > 0
  const toggleFinished = () => {
    setFinishedFolded(!finishedFolded)
    void updateLiveVersionAtom($, v => v + 1)
  }
  const finishedRow = (s: FinishedSession) => {
    const task = doneTasks.find(t => t.id === s.id)
    // #601 : le motif en mots simples, ou « demandée à Claude » quand la demande est partie dans la conversation.
    const refusedWhy = finishedBatch?.refused.get(s.sessionId)
    const asked = finishedBatch?.asked.has(s.sessionId) === true
    return (
      <Box key={`finished:${s.sessionId}`} flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent} hover={{ backgroundColor: palette.hover }}>
        {/* #544 (écarts de la preuve #541) : au gabarit d'une ligne de la liste, comme la maquette A. La marque du carré se
            pose à sa taille (16 × 24 : rétrécie à 14 × 14, son carré de 10 px tombait à 6) et tient la hauteur de la ligne ;
            sans tâche lue, la cale la tient. Le numéro en `caption` comme `taskNumber`, le titre à la taille du corps. */}
        {Svg && task ? <Svg source={squareRowIcon(axisHex(task.axis))} alt={`axe ${task.axis}`} width={MARK_SQUARE_PX} height={SIZE.strut.row} /> : strut(SIZE.strut.row)}
        <Box flexShrink={0}>
          <Text size="caption" tabular color={palette.text2}>{`#${s.id}`}</Text>
        </Box>
        <Box flexShrink={1} minWidth={0}>
          <Text wrap="truncate-end">{task ? short(task).titre : bareTitle(s.title)}</Text>
        </Box>
        <Box flexGrow={1} />
        <Box flexShrink={0}>
          {refusedWhy !== undefined ? (
            <Text size="caption" color={palette.lateOn}>{`refusée : ${refusedWhy}`}</Text>
          ) : asked ? (
            <Text size="caption" color={palette.text2}>demandée à Claude</Text>
          ) : (
            <Text size="caption" tabular color={palette.text2}>{closedWhen(task?.fait, today)}</Text>
          )}
        </Box>
      </Box>
    )
  }
  const finishedCount = finishedAfter ? finishedRefused.length : finished.length
  const finishedBand =
    finished.length > 0 ? (
      <Box key="finished-band" flexDirection="column" borderStyle="round" borderColor={palette.border} paddingX={0} paddingY={0}>
        <Box flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent} paddingY={SPACE.tight}>
          {Svg && (
            <Box flexDirection="row" alignItems="center" flexShrink={0}>
              <Svg source={archiveIcon(palette.finished, 16)} alt="Sessions finies" width={SIZE.icon.md} height={SIZE.icon.md} />
            </Box>
          )}
          <Box key="hit:finished-fold" flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={1} minWidth={0} hover={{ backgroundColor: palette.hover }}>
            <Box flexShrink={0}>{drawnPill({ text: String(finishedCount), bg: palette.finishedTint, fg: palette.finishedOn, weight: TEXT.weight.soft })}</Box>
            <Box flexShrink={1} minWidth={0}>
              <Text color={palette.text} wrap="truncate-end">{finishedLabel(finishedCount, finishedAfter)}</Text>
            </Box>
            {graphic && Svg ? (
              <Box flexDirection="row" alignItems="center" flexShrink={0}>
                <Svg source={rowMark(chevronIcon(palette.text3, !finishedFolded, 14), 14, 24)} alt={finishedFolded ? 'déplier' : 'replier'} width={SIZE.icon.sm} height={24} />
              </Box>
            ) : (
              <Button key="finished-fold" plain dimColor label={finishedFolded ? '›' : '⌄'} onPress={toggleFinished} />
            )}
            {graphic && hit('finished-fold', toggleFinished)}
          </Box>
          <Box flexGrow={1} />
          <Box flexShrink={0}>
            {finishedAfter ? (
              <Text size="footnote" color={palette.text2}>{`${finishedBatch?.archived ?? 0} archivée${(finishedBatch?.archived ?? 0) > 1 ? 's' : ''}`}</Text>
            ) : (
              <Button key="finished-archive" label={finished.length === 1 ? 'Archiver' : `Archiver les ${finished.length}`} onPress={() => void archiveFinished($, finished)} />
            )}
          </Box>
        </Box>
        {!finishedFolded && Svg && <Svg source={ruleIcon(palette.border, wide)} alt="séparateur" height={1} />}
        {!finishedFolded && (
          <Box key="finished-rows" flexDirection="column" paddingY={SPACE.tight}>
            {finished.map(finishedRow)}
          </Box>
        )}
      </Box>
    ) : null
  // Pliée tant que Bertrand ne l'a pas dépliée (#251, #381).
  const liveOpen = !(view.liveFolded ?? true)
  const fixedZones = 1 + axes.length + (showLive ? 2 : 0) + (finishedBand ? 1 : 0) + 1 + todo.filter(todoClickable).length + (todoBlock && (secondary.length > 0 || people.length > 0) ? 1 : 0) + 2 * sessionRows.size
  if (graphic) {
    // Les lignes dépliées de « En cours » d'abord (#160, #381) : leur numéro ouvre leur session.
    const shownWithSession = [...(liveOpen ? blockTasks : []), ...drawnTasks.filter(t => t.id && (liveOf(t) ?? doneSessionOf(t)))]
    numberZones = new Set(shownWithSession.slice(0, Math.max(0, ZONE_LIMIT - fixedZones)).map(t => t.id as string))
  }
  headZones = graphic && fixedZones + numberZones.size + groups.filter(g => !g.bare).length <= ZONE_LIMIT

  // La ligne « En session » de Maestro (#381, choix 1 de la maquette, après #367 ; « En session » depuis #464) : encadrée, la roue, « En session » et son
  // chevron, qui la déplient ; puis « N ici » et l'icône du centre de contrôle, qui l'ouvre. « N ici » compte les sessions
  // du projet, tous Maestro du même dossier confondus (`liveBlockRows`) : autant que de lignes dépliées. « Mac X/Y » et
  // « N en file » vivent dans le centre de contrôle ; quand le Mac retient la file, le filet du cadre reste orange.
  // Pliée tant que Bertrand ne l'a pas dépliée (#251). La liste dessous ne redit pas ces tâches.
  const openControlPane = () => void openControl($)
  const toggleLive = () => void setView($, v => ({ liveFolded: !(v.liveFolded ?? true) }))
  const counters = countersLine({ here: blockTasks.length, macTaken: 0, macMax: 0, queued: 0, hot: false })
  const counterPill = (c: { text: string; tone: 'live' | 'block' | 'neutral' }) => {
    const tone = c.tone === 'block' ? { bg: palette.blockTint, fg: palette.blockOn } : c.tone === 'live' ? { bg: palette.liveTint, fg: palette.liveOn } : { bg: palette.sel, fg: palette.text2 }
    return drawnPill({ text: c.text, bg: tone.bg, fg: tone.fg, weight: TEXT.weight.soft })
  }
  // #390 (maquette C2) : sous Remote Control, la pastille et, en mode Auto, « Passer en bypass », sur une rangée au-dessus
  // du cadre « En session » ; sans Remote Control, rien. #464 (maquette B) : hors mode Auto, seulement quand une tâche
  // de ce Maestro attend en file (`doseView.queue` : ni reprise, ni départ en vol) ; #472 : « Tape go dans Maestro »,
  // son numéro (ou leur nombre) et la cause ; #498 : le libellé de l'aperçu validé, son nom compris, qui passe à la
  // ligne dans la pastille quand il dépasse le panneau.
  const remoteShown = maestroBrand ? remotePill({ ...(await readRemoteFacts($, now)), waiting: dose?.queue ?? [] }) : undefined
  const remoteRow = remoteShown ? (
    <Box key="remote-row" flexDirection="row" alignItems="center" gap={SPACE.row} flexWrap="wrap" paddingX={SPACE.indent}>
      {wrappedPill({ text: remoteShown.text, bg: palette.blockTint, fg: palette.blockOn, mark: 'warn', weight: TEXT.weight.soft }, PANE_PILL_MAX)}
      {remoteShown.bypass && <Button key="remote-bypass" label="Passer en bypass" onPress={() => void switchMaestroToBypass($)} />}
    </Box>
  ) : null
  const liveBlock =
    showLive ? (
      // #513 (captures de BBR, 0.286.1) : l'en-tête porte lui-même ses marges, la même boîte plié comme déplié ; le
      // cadre n'en pose aucune, sinon déplié la rangée collait au séparateur et remontait sous le filet du haut.
      <Box flexDirection="column" borderStyle="round" borderColor={dose && dose.why !== 'project' ? palette.block : palette.border} paddingX={0} paddingY={0}>
        <Box flexDirection="row" alignItems="center" gap={SPACE.row} paddingX={SPACE.indent} paddingY={SPACE.tight}>
          <Box key="hit:live-fold" flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={1} minWidth={0} hover={{ backgroundColor: palette.hover }}>
            <Box flexDirection="row" alignItems="center" flexShrink={0}>
              {spinner()}
            </Box>
            <Box flexShrink={1} minWidth={0}>
              <Text weight="semibold" color={palette.text}>En session</Text>
            </Box>
            {graphic && Svg ? (
              <Box flexDirection="row" alignItems="center" flexShrink={0}>
                <Svg source={rowMark(chevronIcon(palette.text3, liveOpen, 14), 14, 24)} alt={liveOpen ? 'replier' : 'déplier'} width={SIZE.icon.sm} height={24} />
              </Box>
            ) : (
              <Button key="live-fold" plain dimColor label={liveOpen ? '⌄' : '›'} onPress={toggleLive} />
            )}
            {graphic && hit('live-fold', toggleLive)}
          </Box>
          <Box flexGrow={1} />
          {/* #468 (maquette A du compte, BBR) : « 6 ici · ☁ 4 · 🖥 2 », le compte par lieu dans la pastille ; en étroit, sans « ici ». */}
          <Box flexShrink={0}>
            {Svg
              ? (() => {
                  const cloudHere = blockTasks.filter(t => blockOf.get(t.id as string)?.cloud !== undefined).length
                  const pill = herePillIcon({ cloud: cloudHere, mac: blockTasks.length - cloudHere, bg: palette.liveTint, fg: palette.liveOn, short: ((e.props as { bodyColumns?: number }).bodyColumns ?? 56) < 44 })
                  return <Svg source={pill.source} alt={pill.alt} width={pill.width} height={pill.height} />
                })()
              : counterPill(counters.here)}
          </Box>
          <Box key="hit:live-open" flexDirection="row" alignItems="center" flexShrink={0} hover={{ backgroundColor: palette.hover }}>
            {graphic && Svg ? (
              <Svg source={controlIcon(palette.text3, 16)} alt="Centre de contrôle" width={SIZE.icon.md} height={SIZE.icon.md} />
            ) : (
              <Button key="live-open" plain dimColor label="Centre de contrôle" onPress={openControlPane} />
            )}
            {graphic && hit('live-open', openControlPane)}
          </Box>
        </Box>
        {liveOpen && Svg && <Svg source={ruleIcon(palette.border, wide)} alt="séparateur" height={1} />}
        {liveOpen && (
          <Box key="live-rows" flexDirection="column" paddingY={SPACE.tight}>
            {blockTasks.map(t => row(t, undefined, undefined, blockOf.get(t.id as string), true))}
          </Box>
        )}
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
        {/* « N livrées » (#174, #509) est le lien vers les faites (#152, maquette C) : souligné, en gras et en vert une fois choisi (#180). */}
        <Box key="hit:done-count" flexDirection="row" flexShrink={1} minWidth={0} marginLeft={1} hover={{ backgroundColor: palette.hover }}>
          {graphic && (
            <Text size="caption" tabular underline color={showDone ? palette.done : palette.text2} weight={showDone ? 'semibold' : undefined} wrap="truncate-end">
              {tight ? `${doneTasks.length}` : deliveredCount(doneTasks.length)}
            </Text>
          )}
          {graphic && <Text size="caption" tabular color={palette.text2} wrap="truncate-end">{tight ? `/${total}` : ` sur ${total}`}</Text>}
          {!graphic && (
            <Button key="done-count" plain dimColor={!showDone} label={tight ? `${doneTasks.length}/${total}` : `${deliveredCount(doneTasks.length)} sur ${total}`} onPress={toggleDone} />
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

      {remoteRow}

      {liveBlock}

      {finishedBand}

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
                onInput={(value: string) => void updateSearchAtom($, () => value)}
                onSubmit={(value: string) => void updateSearchAtom($, () => value)}
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
        {asking.length > 0 ? confirmBar() : undoNow !== undefined ? undoBar() : picked.length > 0 ? batchBar() : (
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" paddingX={SPACE.indent}>
            {showDone && !searching && (cancelledTasks.length > 0 || unverifiedTasks.length > 0) ? (
              kindSelector()
            ) : (
            <Text size="caption" color={palette.text2} wrap="truncate-end">
              {searching
                ? searchSummary(foundOpen.length, foundDone.length - foundCancelled, search, SEARCH_MAX, foundCancelled)
                : filterSummary({ axis, attend, showDone, shown: shown.length, doneShown: doneShown.length, groupBy: by, who })}
            </Text>
            )}
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

      {verifyView()}
      <Box flexDirection="column">{groups.map(g => (g.band ? bandRow(idOf(g), g.name, g.band.count, g.band.lead, g.band.axis, g.band.look) : section(idOf(g), g.name, g.tasks, rowsOf.get(idOf(g)) ?? 0, g.lead, g.mark, g.block, g.bare, g.focus)))}</Box>

      {/* La fin de la fenêtre des faites (#497, maquette A) : ce qui reste, et 14 jours de plus ; un dessin
          allégé par le plafond le dit dessous, au lieu de la carte d'erreur. */}
      {doneWin.rest > 0 && (
        <Box key="done-older" flexDirection="column" gap="xs">
          {Svg && <Svg source={ruleIcon(palette.border, wide)} alt="séparateur" height={1} />}
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap={SPACE.row} paddingX={SPACE.indent}>
            <Text color={palette.text2} wrap="wrap">{`Plus anciennes : ${doneWin.rest} ${showCancelled ? 'annulée' : 'faite'}${doneWin.rest > 1 ? 's' : ''} sur ${doneWin.restDays} jour${doneWin.restDays > 1 ? 's' : ''}`}</Text>
            <Box key="done-older-row" flexShrink={0} paddingX={SPACE.indent} alignItems="center" backgroundColor={palette.btn} hover={{ backgroundColor: palette.btnHover }}>
              {corners(RADIUS.control, palette.bg)}
              <Button key="done-older" plain label={`Voir ${DONE_DAYS_STEP} jours de plus`} onPress={() => void setView($, () => ({ doneDays: doneDaysChosen + DONE_DAYS_STEP }))} />
            </Box>
          </Box>
          {doneDaysShown < doneDaysChosen && (
            <Box paddingX={SPACE.indent}>
              <Text size="caption" color={palette.text3} wrap="wrap">{`Dessin allégé pour l'app : ${doneDaysShown} jours au lieu de ${doneDaysChosen}.`}</Text>
            </Box>
          )}
        </Box>
      )}

      {/* Le pied (#138, puis #162, maquette B) : la roue des réglages, la version de cette session, et à droite
          « Rafraîchir », qui relit tout et la compare à la publiée, « Recharger » quand seule la session retarde, ou « Mettre à jour » quand l'app retarde sur le catalogue local (#178). */}
      <Box flexDirection="column" gap="xs">
        {Svg && <Svg source={ruleIcon(palette.border, wide)} alt="séparateur" height={1} />}
        <Box key="pane-foot" flexDirection="row" justifyContent="space-between" alignItems="center" paddingX={SPACE.indent}>
          {footLeft()}
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
