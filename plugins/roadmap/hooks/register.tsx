// L'enregistrement des hooks du plugin, seul (#646) : l'état et les aides sont dans socle.tsx, le dessin du panneau
// dans panneau.tsx. Une variable d'état de socle.tsx s'écrit par sa fonction `setX`.

import type { Register, RenderElement, ToolCallResult } from 'claude-code'
import type { LiveEntry } from '../types'
import { axisColor } from './icons'
import { SPACE } from './tokens'
import {
  BEFORE_KEY,
  CLOSED_KEY,
  NATIVE_KEY,
  beforeMap,
  closedKeys,
  drawWrittenMessage,
  keepClosed,
  nativeKeys,
  splitWritten,
  withoutClosed,
  withoutNative,
  writtenCards,
} from './cartes'
import type { WrittenLine, WrittenWho } from './cartes'
import { withTargetTitle } from './titre'
import { cardTargetOf } from './depart'
import { startedAtCall } from './prise-cloud'
import {
  PREFS_START_KEY,
  prefsHash,
  prefsStartMemoAfter,
  readPrefsStartMemo,
  resumePrefsLine,
  startPrefsKind,
  startSessionId,
} from './reprise'
import { gardienBandRow, gardienDeliveryNote, isGardienSession } from './gardien'
import { CONTROL_PANE, drawControl, openControl, redrawControl } from './controle'
import { SETTINGS_PANE, drawSettings, openSettings, redrawSettings, rememberLoadedOptions, watchSettings } from './reglages'
import {
  declaredAccount,
  briefTaskOf,
  bandInfo,
  sinceLabel,
  maestroBand,
  LEGACY_COMMANDS,
  ROADMAP_COMMAND_DESCRIPTION,
  openingBrand,
  axisOrder,
  proposeTaskText,
  planAsked,
  planShown,
  planUnshownRefusal,
  reviewLinkText,
  crossProjectText,
  localClockText,
  PANEL_SKILL,
  pinnedPaneToast,
  refusesPaneClose,
  SETTINGS_SKILL,
  isMockupCall,
  mockupApproval,
  formApproval,
  MOCKUP_TOOLS,
  othersArchiveAsk,
  othersArchiveRefusal,
  heavyTest,
  timingAsk,
  timingBash,
  timingTurnEnd,
  timingTurnStart,
  isRoutine,
  motherLaunchable,
  motherLaunchText,
  maestroCall,
  whyCall,
  archiveCall,
  maestroExecAction,
  hashLabel,
  ownLaunch,
  clip,
  splitNames,
  setDateFormat,
  Person,
  writesRoadmap,
  sessionTitleId,
  releaseTurnId,
  cardNotProposed,
  remoteHeldText,
  roadmapAxes,
  todayOf,
  deliveryPasses,
  cloudSessionLinkOf,
  cloudCardKeepsModel,
  zoneFault,
  zoneRedraw,
  zoneReady,
  noteHeldFocus,
  retireActedFocus,
  focusBase,
  retirePressedFocus,
  retireFocusKeys,
  retireHeldFocus,
  sessionPrefsText,
  sessionPrefsReminder,
  simpleModelReminder,
  maestroPrefsReminder,
  rulesPlan,
  shortRules,
  maestroWakeReminder,
  openListBox,
  openListRefusal,
  wakeTurn,
  prefsChangeText,
  contextShrank,
  contextUseOf,
  contextView,
  deferredReminder,
  deliveryReminder,
  isAutoModeRefusal,
  AUTO_BLOCKED,
  shellsAfterNotice,
  childWake,
  withWake,
  applyPlan,
  boxSteps,
  bandSquareDone,
  stepsView,
  boxQuestion,
  reportQuestions,
  reportRefusal,
  reportReminder,
  axisPalette,
  closedByTasksWrite,
  awaitsPerson,
} from './parse'
import type { Task, ChildWake } from './parse'
import {
  ARCHIVE_SESSION_TOOL,
  ASK_TOOL,
  BAR_HIT,
  BRAND_TASKS_SHOWN,
  DONE_SEGMENT,
  DONUT_HIT,
  GET_SESSION_TOOL,
  LINE_CAP_MIN,
  LIST_SESSIONS_TOOL,
  PANE,
  PANE_DEADLINE_MS,
  PANE_MAX_KB,
  PANE_TARGET_KB,
  PERF_BENCH_KEY,
  PERF_FLUSH_MS,
  PRESS,
  START_SESSION_TOOL,
  TICK_MS,
  UPDATE_PLAN_TOOL,
  VISUALIZE_README,
  VISUALIZE_WIDGET,
  WRAP_UP_TOOL,
  archiveTaskRow,
  archiveText,
  autoModeRefusal,
  awaitYes,
  backgroundShells,
  bandAsked,
  behindDraw,
  boxText,
  brandData,
  brandTree,
  capture,
  cardStarts,
  childAlertContext,
  classicSkips,
  clientCard,
  clockOrDate,
  clockTicks,
  closeReopenAsk,
  closeTurnWindow,
  closingTurn,
  cloudCardOf,
  cloudRead,
  cloudRowSteps,
  compactFromBand,
  compactPastThreshold,
  controlDeps,
  createdBySession,
  currentPr,
  delegation,
  delivered,
  deliveredBy,
  doseLaunch,
  endOfTurnBlock,
  ensurePane,
  focusHeld,
  forceBar,
  forgetGit,
  forgetGiven,
  forgetSessionReads,
  forwardProposal,
  freshReport,
  fromAgent,
  gardienCardNote,
  gardienHere,
  gardienTold,
  gesture,
  ghostPressKeys,
  gitHead,
  gitState,
  guardBash,
  handWarned,
  handWriteNote,
  holdUnlaunched,
  inCloud,
  inFlight,
  inQueue,
  joined,
  judgeRecos,
  keepFindings,
  keepPersonNote,
  knownAxes,
  knownSource,
  lastListRows,
  launchAsk,
  launchPending,
  launchRefusal,
  launchTargetOf,
  launchTurn,
  launchWithMode,
  learnCreated,
  listCall,
  listDenied,
  listDeniedTick,
  listReadTick,
  liveMemo,
  loadSessionVersion,
  maestroActionText,
  maestroBandTree,
  maestroExec,
  maestroHere,
  maestroIntroText,
  maestroText,
  maestrosMemo,
  markMaestro,
  markOwnRunning,
  matchSessions,
  missingSearch,
  missionCardOf,
  motherCardLaunches,
  nameMaestro,
  noteBox,
  noteChild,
  noteClassicSkip,
  noteCodeEdit,
  noteFocus,
  noteMockupDrawn,
  noteNativeCard,
  notePaneDraw,
  notePerf,
  notePress,
  noteScroll,
  noteSkill,
  noteTiming,
  noteWelcomeCard,
  noticeTurn,
  onTick,
  openCommand,
  openHttpsUrl,
  openLineAsk,
  openPane,
  openSession,
  openTaskFiche,
  openTurnWindow,
  ownMode,
  ownParent,
  ownRunningEvent,
  ownSession,
  ownSteps,
  paletteOf,
  paneCache,
  paneData,
  paneFailure,
  paneLineCap,
  paneRetryArmed,
  paneRetryMs,
  paneStage,
  parentIsMaestro,
  parsedFiles,
  pendingAsk,
  pendingClouds,
  pendingReminder,
  perfBench,
  perfCached,
  perfFlush,
  perfFlushNow,
  perfLoaded,
  planRefused,
  pollGen,
  pollStartedTick,
  pollTick,
  polling,
  pressAxis,
  pressDone,
  pressHandlers,
  projectBandOthers,
  prsOfDelivered,
  purgeChildNotes,
  questionsPath,
  queuePids,
  queueSeen,
  queueWanted,
  readBandContextAtom,
  readContextSeenAtom,
  readLiveVersionAtom,
  readOr,
  readPendingAsksAtom,
  readPrefsGivenAtom,
  readQueueAlertAtom,
  readRetryAtom,
  readRulesGivenAtom,
  readSessionPrefs,
  readStampAtom,
  readSteps,
  readThemeStampAtom,
  readTitlesVersionAtom,
  readVisibility,
  readWelcomeGridAtom,
  readZoneGenAtom,
  receiveFindings,
  receivePersonNotes,
  receiveProposals,
  recoCardRefusal,
  refreshFlushed,
  releaseTurn,
  reminderCarried,
  reportTurn,
  rereadBandContext,
  reserveCard,
  roadmapCommand,
  roadmapNow,
  rollDayStepsOnStart,
  runningBySession,
  saveChanges,
  saveEndFiche,
  noteAwaitsPerson,
  savePitches,
  saveWhys,
  sendLaunch,
  sendWake,
  noteLostMail,
  SEND_MESSAGE_TOOL,
  sessionBrandOf,
  sessionDeadline,
  sessionPrefsBlock,
  sessionPrefsShortBlock,
  sessionRows,
  setAutoModeRefusal,
  setBackgroundShells,
  setBandAsked,
  setClassicSkips,
  setClockTicks,
  setClosingTurn,
  setCloudRead,
  setDelegation,
  setDelivered,
  setGardienTold,
  setHandWarned,
  setKnownSource,
  setLastListRows,
  setLaunchPending,
  setLaunchTurn,
  setListCall,
  setListDenied,
  setListDeniedTick,
  setListReadTick,
  setLiveMemo,
  setMaestroExec,
  setMaestrosMemo,
  setMissingSearch,
  setNoticeTurn,
  setOwnRunningEvent,
  setOwnSession,
  setOwnSteps,
  setPaneCache,
  setPaneLineCap,
  setPaneRetryArmed,
  setPaneRetryMs,
  setPaneStage,
  setPendingReminder,
  setPerfBench,
  setPerfCached,
  setPerfFlush,
  setPerfFlushNow,
  setPerfLoaded,
  setPlanRefused,
  setPollGen,
  setPollStartedTick,
  setPollTick,
  setPolling,
  setQueuePids,
  setQueueSeen,
  setQueueWanted,
  setRefreshFlushed,
  setReleaseTurn,
  setReminderCarried,
  setReportTurn,
  setSessionDeadline,
  setSettings,
  setSkillPrompted,
  setSourceTitle,
  setStopTurn,
  setSubmitOpened,
  setTaskSourceMemo,
  setTimingAsked,
  setTitlesMemo,
  setToldMaestro,
  setTurnText,
  setView,
  setWakeBox,
  setWakeRefused,
  settings,
  settingsProject,
  settlePersonNotes,
  settleQueued,
  shownStatus,
  shownTitle,
  skillPaneNote,
  skillPrompted,
  sourceNow,
  sourceTitle,
  startCapture,
  startFromCard,
  stepList,
  stopTurn,
  storeGet,
  storeSet,
  submitOpened,
  submitWelcome,
  summarize,
  sweepAfterArchive,
  sweepBranches,
  takeMissionOnCard,
  takeStartedLines,
  taskSourceMemo,
  tellMaestro,
  testAfterRelease,
  testSessionText,
  tick,
  timingAsked,
  timingNow,
  titlesMemo,
  toldMaestro,
  trackedSession,
  turnReport,
  turnText,
  typedRelease,
  unsentAsk,
  updateBandContextAtom,
  updateContextSeenAtom,
  updateFindingsGivenAtom,
  updateMaestroAxisAtom,
  updatePendingAsksAtom,
  updatePrefsGivenAtom,
  updateRetryAtom,
  updateRulesGivenAtom,
  updateThemeStampAtom,
  wake,
  wakeBox,
  wakeRefused,
  watchCloudCard,
  weighTree,
  welcomeOf,
  whyText,
  withTaskCloudLaunch,
  withTree,
  withinMs,
  withoutQuestion,
  archiveClosedSessions,
  writePerf,
  written,
  yesNote,
  zones,
} from './socle'
import type { StoreValue } from './socle'
import { drawPane } from './panneau'

export const register: Register = (on, options) => {
  setCloudRead(undefined)
  // Les valeurs des options de ce chargement : le volet Réglages s'en sert quand /config n'en liste aucune (#356).
  rememberLoadedOptions(options as Readonly<Record<string, unknown>>)
  // Un chargement neuf relit tout : les données gardées en mémoire viennent du chargement d'avant.
  setPaneCache(undefined)
  parsedFiles.clear()
  setKnownSource(undefined)
  setTaskSourceMemo(undefined)
  setMissingSearch(undefined)
  setSourceTitle(undefined)
  // La session et le droit de lister les sessions se relisent aussi (un refus de la liste ne survit pas).
  setOwnSession(null)
  setGardienTold(false)
  setBandAsked(undefined)
  setListDenied(false)
  setLastListRows([])
  setListCall(undefined)
  setSessionDeadline(undefined)
  setPaneRetryMs(0)
  setPaneRetryArmed(false)
  setListReadTick(-1)
  setTitlesMemo(undefined)
  setLiveMemo(undefined)
  setMaestrosMemo(undefined)
  setListDeniedTick(0)
  setOwnRunningEvent(undefined)
  setPollTick(0)
  setPolling(false)
  setClockTicks(0)
  setPollStartedTick(0)
  setPollGen(pollGen + 1)
  setQueuePids({ key: '', at: 0 })
  setQueueSeen('')
  setQueueWanted(false)
  setRefreshFlushed(0)
  setAutoModeRefusal(undefined)
  setSettings({
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
    testSlots: typeof options.testSlots === 'string' && options.testSlots !== '' ? options.testSlots : '1',
    idleMinutes: typeof options.idleMinutes === 'string' && options.idleMinutes !== '' ? options.idleMinutes : '10',
    queueAlertMinutes: typeof options.queueAlertMinutes === 'string' && options.queueAlertMinutes !== '' ? options.queueAlertMinutes : '30',
    autoCompact: typeof options.autoCompact === 'boolean' ? options.autoCompact : true,
    compactAt: typeof options.compactAt === 'string' && options.compactAt !== '' ? options.compactAt : '350',
    compactAtLead: typeof options.compactAtLead === 'string' && options.compactAtLead !== '' ? options.compactAtLead : '250',
    axisPill: typeof options.axisPill === 'boolean' ? options.axisPill : false,
    priorities: options.priorities === true,
    dateFormat: options.dateFormat === 'fr' ? 'fr' : 'us',
    account: declaredAccount(options.account, options.classicHooks) ?? 'auto',
  })
  setClassicSkips({ skipped: 0, stopSeen: false, asked: false })
  setDateFormat(settings.dateFormat)

  // Le thème de Claude Code a changé : le panneau se redessine dans l'autre palette.
  on('config.set', { key: 'theme' }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    const result = await next(e)
    await updateThemeStampAtom($, v => v + 1)
    return result
  })

  // Le repos (#348) : une arrivée réveille la session ; un départ qui ne laisse aucune surface la met au repos.
  // La sonde de visibilité (#337), qui les notait au store, est coupée (#518).
  on('session.attach', async ($, e, next) => {
    if (await inCloud($)) return next(e)
    wake($)
    return next(e)
  })
  on('session.detach', async ($, e, next) => {
    if (await inCloud($)) return next(e)
    if (e.reason !== 'end') void readVisibility($)
    else perfFlushNow?.()
    return next(e)
  })

  on('session.start', async ($, e, next) => {
    if (await inCloud($)) return next(e)
    // Les relevés de mesure partent au store une demi-seconde après un dessin, jamais pendant un
    // clic : l'écriture relit d'abord le store, pour garder les relevés des autres sessions. #518 : ils
    // restent en mémoire et partent au plus une fois par minute (`PERF_FLUSH_MS`), le store entier se
    // réécrivant à chaque fois ; au banc (`perf-banc` au store), après chaque dessin, comme avant. Une
    // seule minuterie à la fois, d'une demi-seconde : aucune minuterie longue ne s'arme (une par dessin
    // s'armait, PR 112) ; un relevé retenu part avec la relecture suivante (`noteRefresh`, toutes les
    // 15 s) ou à la fin de la session.
    const bench = await storeGet($, PERF_BENCH_KEY).then(v => v === true, () => false)
    setPerfBench(bench)
    let armed = false
    let lastFlush = Number.NEGATIVE_INFINITY
    setPerfFlush(() => {
      if (armed) return
      armed = true
      void (async () => {
        const now = bench ? undefined : await $.clock.now().catch(() => undefined)
        if (now !== undefined && now - lastFlush < PERF_FLUSH_MS) {
          armed = false
          return
        }
        if (now !== undefined) lastFlush = now
        $.clock.after(500, () => {
          armed = false
          writePerf($)
        })
      })()
    })
    setPerfFlushNow(() => writePerf($))
    // La version de ce module, avant qu'une synchro de l'app ne réécrive son plugin.json (#138).
    void loadSessionVersion($).catch(() => undefined)
    // #378 : tout passe par /roadmap et son argument (settings, control, bar, help) ; les anciens noms restent,
    // marqués anciens. Réglages et centre de contrôle valent dans tout projet, roadmap ou non.
    await $.command.register({ name: 'roadmap', description: ROADMAP_COMMAND_DESCRIPTION })
    for (const c of LEGACY_COMMANDS) await $.command.register({ name: c.name, description: c.description })
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
      $.clock.every(TICK_MS, () => onTick($))
      void summarize($, source)
      void judgeRecos($, source)
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
      await updateThemeStampAtom($, v => v + 1)
    }

    return next(e)
  })

  // Réglages de session : ceux du projet de la session (#102), injectés comme contexte additionnel au
  // démarrage (startup, resume, clear, compact), dans tout projet, roadmap ou non. Une panne de lecture ne bloque jamais le démarrage.
  // Sous sec-default (compte Team ou Enterprise, #116), ce hook est sauté : le premier message les porte.
  // En Compte Team / Enterprise (#219, #223), il n'est pas enregistré, et l'app n'a plus de saut à dire.
  if (settings.account !== 'team') {
    on('classic.SessionStart', async ($, e, next) => {
      if (await inCloud($)) return next(e)
      const result = await next(e)
      const block = await sessionPrefsBlock($)
      // #663 : une reprise recharge le fil, qui porte déjà le bloc ; une ligne courte, ou ses lignes changées.
      // #665 : une compaction, dont le résumé ne garde pas les réglages fidèlement : le bloc court, une ligne par réglage.
      const source = (e as { source?: string }).source
      const id = startSessionId(e)
      let text = block
      if (block !== undefined) {
        try {
          const given = await readPrefsGivenAtom($).catch(() => '')
          const memo = id === undefined ? {} : readPrefsStartMemo(await storeGet($, PREFS_START_KEY))
          const kind = startPrefsKind({ source, block, given, stored: id === undefined ? undefined : memo[id]?.h })
          if (kind === 'short') text = resumePrefsLine()
          else if (kind === 'change') text = prefsChangeText(given, block)
          else if (kind === 'compact') text = (await sessionPrefsShortBlock($)) ?? block
          if (id !== undefined) await storeSet($, PREFS_START_KEY, prefsStartMemoAfter(memo, id, prefsHash(block), await $.clock.now().catch(() => Date.now())))
        } catch {
          // store illisible : le bloc entier, comme avant
        }
      }
      try {
        await updatePrefsGivenAtom($, () => block ?? '')
        await updateRulesGivenAtom($, () => '')
        await updateFindingsGivenAtom($, () => '')
      } catch {
        // état de session illisible : le premier message les redonnera aussi
      }
      return text === undefined ? result : { ...result, additionalContext: [...(result.additionalContext ?? []), text] }
    })
  }

  // /clear ou compaction : le démarrage classique qui suit redonne les réglages, sinon le message suivant
  // (sec-default saute la compaction, #116). Le contexte mesuré repart de zéro (#119).
  on('session.end', async ($, e, next) => {
    if (await inCloud($)) return next(e)
    if (e.reason === 'clear') {
      await forgetGiven($)
      await updateContextSeenAtom($, () => 0)
    }
    return next(e)
  })
  if (settings.account !== 'team') {
    on('session.compact', async ($, e, next) => {
      if (await inCloud($)) return next(e)
      // `precompute` n'installe rien, et la compaction d'un agent laisse la conversation principale.
      if (e.trigger !== 'precompute' && e.agentId === undefined) {
        await forgetGiven($)
        await updateContextSeenAtom($, () => 0)
        // #491 : la conversation compactée, le % de la bande se relit, sans attendre la fin d'un tour.
        const result = await next(e)
        await rereadBandContext($)
        return result
      }
      return next(e)
    })
  }

  // Le contexte à la fin de chaque tour (#157) : l'en-tête de la bande de Maestro le lit, et une
  // session lancée par Maestro l'écrit dans sa note, à côté de ses étapes, sans en changer l'heure.
  on('session.measure', async ($, e, next) => {
    if (await inCloud($)) return next(e)
    const result = await next(e)
    const use = contextUseOf(e.context)
    try {
      await updateBandContextAtom($, () => use ?? null)
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
    if (await inCloud($)) return next(e)
    // #522 : un message est un geste : la minuterie lente reprend son pas de 3 s.
    gesture($)
    // La fenêtre de tour s'ouvre avec le message (#523) ; le turn.start qui suit ne la rouvre pas.
    openTurnWindow()
    setSubmitOpened(true)
    // Le panneau toujours ouvert (#117) : le message de la personne rouvre le panneau qui manque ou attend.
    // Un seul hook prompt.submit par module (le moteur refuse le second) : l'appel vit ici.
    await ensurePane($)
    // #347 : le retour d'une tâche de fond relance la session ; ses commandes citées sont finies.
    if ((e.origin as { kind?: string } | undefined)?.kind === 'task-notification' || (typeof e.text === 'string' && e.text.includes('<task-notification>'))) {
      setBackgroundShells(shellsAfterNotice(backgroundShells, e.text ?? ''))
      setNoticeTurn(true)
    }
    // #510 (C4) : le message de départ d'une carte cloud prend sa ligne.
    if (typeof e.text === 'string' && e.text.includes('started your suggested background task')) await takeStartedLines($, e.text).catch(() => undefined)
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
      setLaunchPending(true)
    }
    // #382 : le mot tapé par la personne chez Maestro débloque l'entrée retenue par Remote Control (le tour est le sien, l'app accepte `user_asked`).
    try {
      const origin = (e.origin as { kind?: string } | undefined)?.kind
      const typed = typeof e.text === 'string' && (origin === undefined || origin === 'human') && !launch && !wakeTurn(e.text) && !e.text.includes('<task-notification>')
      // Pas de `maestroHere` (un get_session à chaque message) : seule une entrée retenue de ce Maestro, lue au store, fait partir.
      if (typed) {
        const released = await typedRelease($)
        if (released !== undefined) texts.push(released)
      }
    } catch {
      // file illisible : le message passe sans le départ
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
      setPendingReminder(undefined)
      setReminderCarried(true)
    }
    // Une compaction que sec-default cache à session.compact (#119) : le contexte a fondu depuis le
    // message précédent, et les réglages complets sont à redonner.
    try {
      const tokens = (await $.session.usage()).context.tokens
      if (contextShrank(await readContextSeenAtom($), tokens)) await forgetGiven($)
      await updateContextSeenAtom($, () => tokens ?? 0)
    } catch {
      // contexte non mesuré : les réglages suivent la seule règle du démarrage
    }
    // Réglages en entier si aucun démarrage ne les a donnés, sinon leurs seules lignes changées (#119, #654) ;
    // puis le rappel ADHD. Maestro tel que lu ici : les findings ne relisent pas la fiche (#531).
    let maestroSeen = false
    let rulesFull = false
    let wakeSeen = false
    try {
      const current = await readSessionPrefs($)
      const block = sessionPrefsText(current.prefs, current.error, current.project, current.design, current.roadmap)
      const given = await readPrefsGivenAtom($)
      if (block !== given) {
        texts.push(given === '' ? block : prefsChangeText(given, block))
        await updatePrefsGivenAtom($, () => block)
      }
      // Chez Maestro (#133) : au réveil, son rappel ; aux tours de la personne, l'en-tête stable.
      const maestro = await maestroHere($)
      maestroSeen = maestro
      const wake = maestro && wakeTurn(e.text)
      wakeSeen = wake
      if (wake) {
        texts.push(maestroWakeReminder(await readPendingAsksAtom($)))
      } else {
        const kind = maestro ? 'maestro' : current.roadmap && (await parentIsMaestro($)) ? 'child' : 'solo'
        const plan = rulesPlan(await readRulesGivenAtom($), `${kind}|${current.prefs.adhd}|${current.roadmap}`)
        await updateRulesGivenAtom($, () => plan.next)
        rulesFull = plan.full
        // #654 : règles en entier ou ligne courte (rulesPlan)
        if (plan.full) {
          const reminder = maestro ? maestroPrefsReminder(current.prefs) : sessionPrefsReminder(current.prefs)
          if (reminder !== undefined) texts.push(reminder)
          texts.push(simpleModelReminder())
          if (current.roadmap) texts.push(proposeTaskText(kind), reviewLinkText(kind), crossProjectText())
        } else texts.push(...shortRules(maestro, current.prefs, current.roadmap))
      }
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
    // Maestro : findings de ses sessions sans sort (#531).
    try {
      const findings = maestroSeen ? await receiveFindings($, rulesFull) : undefined
      if (findings !== undefined) texts.push(findings)
    } catch {
      // store ou registre illisible : ils attendent le message suivant
    }
    // Et leurs notes « Pour la personne » (#640).
    try {
      const notes = maestroSeen && !wakeSeen ? await receivePersonNotes($) : undefined
      if (notes !== undefined) texts.push(notes)
    } catch {
      // store illisible : elles attendent le message suivant
    }
    // Nouvelles des enfants qui coincent ou sont à archiver (#84).
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
      try {
        const rename = await nameMaestro($)
        if (rename !== undefined) texts.push(rename)
      } catch {
        // fiche illisible : le titre reste, le prochain « Maestro » réessaie
      }
      // Le titre ou la marque vient de changer : les fiches et la liste gardées pour le tour s'oublient (#523).
      forgetSessionReads()
      // L'appel nu ou d'axe pose l'axe de la session, et le panneau ouvert bascule tout de suite.
      if (!call.scan) {
        try {
          const axis = call.axis ?? ''
          await updateMaestroAxisAtom($, () => axis)
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
    // « why 527 », « pourquoi #527 », seul dans le message (#529) : la tâche et ses voisines, à expliquer au gabarit « La fiche ».
    const why = whyCall(e.text)
    if (why) {
      try {
        texts.push(await whyText($, why.id))
      } catch (err) {
        texts.push(`${Person()} demande d'expliquer la tâche #${why.id}, mais la roadmap n'a pas pu être lue (${err instanceof Error ? err.message : String(err)}) : dis-le en une phrase.`)
      }
    }
    // « quoi archiver », seul dans le message (#560) : chaque session du projet, son verdict tiré des faits, au gabarit A.
    if (archiveCall(e.text)) {
      try {
        texts.push(await archiveText($))
      } catch (err) {
        texts.push(`${Person()} demande quelles sessions archiver, mais les faits n'ont pas pu être lus (${err instanceof Error ? err.message : String(err)}) : dis-le en une phrase.`)
      }
    }
    const text = launch ? launch.line : e.text
    return next(texts.length === 0 ? e : { ...e, text, context: [...(e.context ?? []), ...texts] })
  })

  // Capture des tasks : la grammaire contrôlée à chaque écriture, le rappel en fin de tour.
  // #255 : chez Maestro, une ligne écrite à la main reçoit le rappel de la skill tasks.
  // #292 : une page de maquettes écrite se note pour le rappel de design.
  on('tool.call', { tool: 'Edit' }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    noteCodeEdit(e, e.file_path)
    noteMockupDrawn(e)
    return yesNote(e, await handWriteNote($, e, 'Edit', await written($, () => next(e), e.file_path)))
  })
  on('tool.call', { tool: 'Write' }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    noteCodeEdit(e, e.file_path)
    noteMockupDrawn(e)
    return yesNote(e, await handWriteNote($, e, 'Write', await written($, () => next(e), e.file_path)))
  })
  on('tool.call', { tool: 'NotebookEdit' }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    noteCodeEdit(e, e.notebook_path)
    return written($, () => next(e), e.notebook_path)
  })
  // #327 : un appel à un sous-agent dispense du rappel de déléguer.
  on('tool.call', { tool: 'Agent' }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    if (!fromAgent(e)) delegation.agentCalls += 1
    return next(e)
  })
  // La carte New task d'une sous-session remonte à son Maestro (#67).
  // Option « Lancer en bypass » : la carte qui reste ici demande le bypass (#87).
  on('tool.call', { tool: START_SESSION_TOOL }, async ($, raw, next) => {
    if (await inCloud($)) return next(raw)
    const byModel = next.origin.plugin === 'engine' && !fromAgent(raw)
    // #512 : la carte de mission part avec sa consigne seule : ni arbre, ni dossier, ni bypass, ni file du Mac.
    const mission = byModel ? await missionCardOf($, raw) : undefined
    // #515 : la carte d'un ▶ Cloud refusé au panneau part avec le brief que le panneau a écrit.
    const cloudAsked = byModel && !mission ? await cloudCardOf($, raw) : undefined
    // Une carte du modèle reçoit la section de l'arbre, comme le ▶ (#237).
    const treed = mission ? (mission.card as typeof raw) : byModel ? ((await withTree($, cloudAsked ? cloudAsked.card : raw)) as typeof raw) : raw
    // #575 : une carte cloud du modèle porte le modèle et l'effort de sa tâche, sans quoi elle prend ceux de cette session.
    // #575 (cas #579) : en `user_asked`, l'app perd le modèle et l'effort d'une carte cloud ; elle part en proposition.
    // Une mission garde sa voie directe (#510, cas AAFES #644) : ni modèle ajouté ni proposition.
    const e = byModel && !mission ? (cloudCardKeepsModel((await withTaskCloudLaunch($, treed)) as Record<string, unknown>) as typeof raw) : treed
    // #263 : la carte qui se pose ici (pas remontée à Maestro) part seulement si son titre vient de la ligne écrite.
    let titleRefused = false
    const ran = await forwardProposal($, e, next.origin.plugin, async () => {
      if (next.origin.plugin !== 'engine') return next(e)
      // #383 : Maestro a essayé de lancer la tâche de sa relève ; un refus de l'app se règle par `settleQueued`.
      const tried = (e as { title?: unknown }).title
      if (releaseTurn && typeof tried === 'string' && sessionTitleId(tried) === releaseTurn.id) releaseTurn.tried = true
      // #465 : la carte part au lieu de la reco de sa ligne, sinon elle se refuse avec l'appel juste.
      const misplaced = await recoCardRefusal($, e)
      if (misplaced !== undefined) {
        titleRefused = true
        return { deny: misplaced }
      }
      const refusal = await launchRefusal($, e)
      if (refusal !== undefined) {
        titleRefused = true
        // #374 : une entrée en vol de ce Maestro refusée par le contrôle du titre garde sa trace et rend sa place.
        const title = (e as { title?: unknown }).title
        if (ownSession?.id && typeof title === 'string') await settleQueued($, ownSession.id, title, { deny: refusal }).catch(() => undefined)
        return { deny: refusal }
      }
      // #324 : chez Maestro, la carte ne part que s'il reste une place ; sinon elle entre dans la file.
      const cardTitle = (e as { title?: unknown }).title
      // #510 : une mission tient sa place comme une session cloud (cible cloud : ni le Mac ni sa charge).
      const dose = fromAgent(e) || typeof cardTitle !== 'string' ? {} : await doseLaunch($, sessionTitleId(cardTitle), { title: cardTitle, card: e as Record<string, unknown> })
      if (dose.refusal !== undefined) {
        titleRefused = true
        return { deny: dose.refusal }
      }
      // #436 : la cible finit le titre de la carte posée ; le titre lu ici (file, réservation) reste celui de la ligne.
      // #643 : une tâche `projet` prend le titre « <axe> #N · nom », sans marque.
      const shown = mission ? { card: e as Record<string, unknown>, travail: 'projet' as const } : await clientCard($, e as Record<string, unknown>)
      const posted = mission ? await next(withTargetTitle(shown.card, shown.travail) as typeof e) : await launchWithMode($, shown.card as typeof e, card => next(withTargetTitle(card, shown.travail) as typeof e))
      if (dose.ownId && typeof cardTitle === 'string' && posted.deny === undefined && !posted.isError) await reserveCard($, cardTitle)
      // #374 : la réponse de l'app règle l'entrée en file : acceptée, elle sort ; refusée, elle reste avec sa trace.
      if (dose.ownId && typeof cardTitle === 'string') {
        const held = await settleQueued($, dose.ownId, cardTitle, posted).catch(() => false)
        // #382 : sous Remote Control, Maestro reçoit la consigne de dire le geste, à la place du refus de l'app.
        const heldId = sessionTitleId(cardTitle)
        if (held && heldId !== undefined) return { deny: remoteHeldText(heldId, await ownMode($)) }
      }
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
    if (id !== undefined && next.origin.plugin === 'engine' && ran.deny === undefined) await noteNativeCard($, title, { target: cardTargetOf(e as Record<string, unknown>), text: ran.text })
    // #515 : la carte du ▶ Cloud demandée à Claude est posée : la demande est servie.
    if (cloudAsked && ran.deny === undefined && !ran.isError && !cardNotProposed(ran)) pendingClouds.delete(cloudAsked.key)
    // #474 : la carte cloud de Maestro posée, le panneau guette sa branche sur origin pour prendre la ligne au départ.
    if (id !== undefined && next.origin.plugin === 'engine' && ran.deny === undefined && cardTargetOf(e as Record<string, unknown>) === 'cloud') {
      await watchCloudCard($, id, (e as { prompt?: unknown }).prompt)
    }
    // #512 : la carte de mission posée prend sa ligne, et sa réponse dit à Claude si elle est prise.
    if (mission && ran.deny === undefined && !ran.isError && !cardNotProposed(ran)) {
      return { ...ran, text: `${ran.text ?? ''}\n\n${await takeMissionOnCard($, mission, startedAtCall(e as { initiation?: unknown }, ran.text))}`.trim() }
    }
    // #615 : une carte refusée par l'app (« Nothing was proposed », Remote Control) n'est pas posée : rien ne se consomme.
    const cardPosted = ran.deny === undefined && !ran.isError && !cardNotProposed(ran)
    if (cardPosted && typeof title === 'string' && isGardienSession(title)) setGardienTold(true)
    // #528 : chaque carte de tâche posée par un Maestro de code sans gardien lui rappelle de poser celle du gardien.
    if (byModel && id !== undefined && cardPosted && !gardienTold) {
      const note = await gardienCardNote($, title as string).catch(() => undefined)
      if (note !== undefined) return { ...ran, context: [...(ran.context ?? []), note] }
    }
    return ran
  })
  // Un enfant note son état pour son parent (#84) : sa liste d'étapes, sa question, son récap.
  on('tool.call', { tool: UPDATE_PLAN_TOOL }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    if (!fromAgent(e)) {
      closingTurn.work = true
      stepList.planned = true
      // La liste renvoyée entière : la livraison est dite (#136).
      if (Array.isArray((e as { items?: unknown }).items)) setDelivered({ kinds: [], maestro: false })
      setOwnSteps(applyPlan(ownSteps, e as never))
      await noteChild($, (s, now) => ({ ...withoutQuestion(s), steps: applyPlan(s.steps, e as never, now) }))
    }
    return next(e)
  })
  // Une maquette montrée à Bertrand (#96) : le rappel de fin de tour se tait pour la session.
  for (const tool of MOCKUP_TOOLS) {
    on('tool.call', { tool }, async ($, e, next) => {
      if (await inCloud($)) return next(e)
      if (capture && !fromAgent(e) && isMockupCall(tool, e)) capture.mockupShown = true
      // #292 : un widget après un read_me du module mockup est une maquette dessinée.
      if (capture && !fromAgent(e) && tool === VISUALIZE_WIDGET && capture.mockupModule) {
        capture.mockupDrawn ??= 'un widget de maquette'
        awaitYes('un widget de maquette')
      }
      return next(e)
    })
  }
  // #675 : un message classé « undelivered » se suit (transcript du destinataire, renvoi une fois, réveil de l'envoyeur).
  for (const tool of ['SendMessage', SEND_MESSAGE_TOOL]) {
    on('tool.call', { tool }, async ($, e, next) => {
      if (await inCloud($)) return next(e)
      const ran = await next(e)
      if (next.origin.plugin !== 'engine' || fromAgent(e) || ran.deny !== undefined) return ran
      const body = (e as { message?: unknown }).message
      const note = await noteLostMail($, ran.text ?? JSON.stringify(ran.result ?? ''), typeof body === 'string' ? body : '').catch(() => undefined)
      return note === undefined ? ran : { ...ran, context: [...(ran.context ?? []), note] }
    })
  }
  // #313 : une session qui s'archive (« Oui, archiver »), ou qui archive une autre session : le ménage
  // des branches suit, si la session vit encore ; sinon le démarrage suivant s'en charge.
  on('tool.call', { tool: ARCHIVE_SESSION_TOOL }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    const result = await next(e)
    const ran = result as { deny?: string; isError?: boolean }
    if (next.origin.plugin === 'engine' && !fromAgent(e) && ran.deny === undefined && !ran.isError) {
      sweepAfterArchive($, await sourceNow($).catch(() => undefined))
    }
    return result
  })
  // #292 : le module que charge le visualiseur dit si le widget suivant est une maquette.
  on('tool.call', { tool: VISUALIZE_README }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    const modules = (e as { modules?: unknown }).modules
    if (capture && !fromAgent(e)) capture.mockupModule = Array.isArray(modules) && modules.includes('mockup')
    return next(e)
  })
  on('tool.call', { tool: ASK_TOOL }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    if (fromAgent(e)) return next(e)
    // #626 : un plan à valider que le tour n'a pas montré ; refusé une fois, renvoyé tel quel il passe.
    const planKey = JSON.stringify(((e as { questions?: { question?: unknown }[] }).questions ?? []).map(q => q?.question))
    if (planAsked(e) && !planShown(turnText) && !planRefused.has(planKey)) {
      planRefused.add(planKey)
      return { deny: planUnshownRefusal() }
    }
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
    if (await inCloud($)) return next(e)
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
    if (!fromAgent(e)) setOwnSteps(boxSteps(ownSteps))
    noteBox(e)
    if (!fromAgent(e)) setClosingTurn({ ...closingTurn, work: true, box: boxText(e), asked: boxText(e, false) })
    // La question de Maestro attend la personne : un réveil ne la reposera pas (#133).
    if (!fromAgent(e) && closingTurn.maestro && typeof ask === 'string' && ask.trim() !== '') {
      await updatePendingAsksAtom($, asks => (asks.includes(ask) ? asks : [...asks, ask])).catch(() => undefined)
    }
    const recap = (e as { recap?: unknown }).recap
    if (!fromAgent(e)) setWakeBox({ ...(typeof recap === 'string' ? { recap } : {}), ...(typeof ask === 'string' ? { ask } : {}) })
    // La question de la boîte, ou « attend une réponse : … » en tête du récap, attend jusqu'au tour suivant (#121).
    const asked = boxQuestion((e as { ask?: unknown }).ask, recap)
    if (!fromAgent(e)) setTimingAsked(asked !== undefined)
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
  on('tool.call', async ($, e, next) => {
    if (await inCloud($)) return next(e)
    const tool = (e as { tool?: unknown }).tool
    if (next.origin.plugin === 'engine' && !fromAgent(e) && tool !== UPDATE_PLAN_TOOL && tool !== WRAP_UP_TOOL) stepList.tools += 1
    // Maestro n'exécute pas (#250) : à un tour de la personne, un geste d'exécution se note pour la fin du tour.
    if (next.origin.plugin === 'engine' && !fromAgent(e) && closingTurn.maestro && !closingTurn.wake && typeof tool === 'string') {
      const done = maestroExecAction(tool, e, capture ? [questionsPath(capture.source)] : [])
      if (done !== undefined && !maestroExec.includes(done)) maestroExec.push(done)
    }
    // Git se relit avant et après chaque outil, qui peut le changer (#523) ; une session lancée, archivée ou
    // renommée change la liste des sessions : les lectures gardées de la fenêtre de tour s'oublient.
    // Seuls les outils du modèle (origine « engine ») changent le dépôt : les appels de ce plugin (fiches, liste) passent aussi par ce hook.
    const byEngine = next.origin.plugin === 'engine'
    if (byEngine) forgetGit()
    try {
      return await next(e)
    } finally {
      if (byEngine) forgetGit()
      if (typeof tool === 'string' && tool.startsWith('mcp__ccd_session_mgmt__') && tool !== GET_SESSION_TOOL && tool !== LIST_SESSIONS_TOOL) forgetSessionReads()
    }
  })
  // Garde-fou du dossier principal (#87) : une commande git interdite n'est pas lancée.
  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
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
    let ran = await handWriteNote($, e, 'Bash', await written($, async () => next(await inQueue($, e)), undefined, writesRoadmap(e.command, capture?.source.ecriture?.outil), tasksOut))
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
    // #669 : une écriture de la roadmap qui clôt des lignes archive d'office les sessions finies de ces lignes ; ce que le plugin
    // ne peut pas faire (mode Auto, refus), il le demande au modèle dans le résultat, dans le même tour.
    if (/tasks\.py\b.*\bwrite\b/.test(e.command) && /--apply\b/.test(e.command)) {
      const said = (ran.result as { stdout?: unknown } | undefined)?.stdout
      const lines = await archiveClosedSessions($, closedByTasksWrite(typeof said === 'string' ? said : (ran.text ?? '')), e.command)
      if (lines.length > 0) ran = { ...ran, context: [...(ran.context ?? []), ...lines] }
    }
    // Une fusion sur main ou une publication (#136) : la liste d'étapes se renvoie avant la commande suivante.
    try {
      const kinds = await deliveredBy($, e.command)
      if (kinds.length === 0) return ran
      // #528 : le gardien livre à la place de Maestro : mêmes rappels, plus sa ligne à Maestro.
      const gardienFor = await gardienHere($)
      const maestro = gardienFor !== undefined || (await maestroHere($))
      setDelivered({ kinds: [...new Set([...delivered.kinds, ...kinds])], maestro: maestro || delivered.maestro })
      // #634 : chez Maestro, la tâche publiée se clôt à sa publication ; le rappel porte la consigne de clôture.
      const said = (ran.result as { stdout?: unknown } | undefined)?.stdout
      const test = maestro && kinds.includes('publication')
        ? await testAfterRelease($, e.command, typeof said === 'string' ? said : (ran.text ?? '')).catch(() => undefined)
        : undefined
      return { ...ran, context: [...(ran.context ?? []), deliveryReminder(kinds, maestro, false, closingTurn.wake), ...(test ? [test] : []), ...(gardienFor !== undefined ? [gardienDeliveryNote(gardienFor)] : [])] }
    } catch {
      return ran
    }
  })

  // #626 : le texte des réponses du modèle principal, gardé pour le tour (les sous-agents n'y comptent pas).
  on('session.append', { door: 'response' }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    if (e.agentId === undefined) {
      const content = (e as { message?: { content?: unknown } }).message?.content
      const texts = Array.isArray(content) ? content.flatMap(b => (b?.type === 'text' && typeof b.text === 'string' ? [b.text as string] : [])) : []
      // Les 60 000 derniers signes suffisent : le plan se montre juste au-dessus du formulaire.
      if (texts.length > 0) setTurnText([turnText, ...texts].filter(t => t !== '').join('\n\n').slice(-60_000))
    }
    return next(e)
  })

  on('turn.start', async ($, e, next) => {
    if (await inCloud($)) return next(e)
    if (e.agentId === undefined) {
      setTurnText('')
      setPlanRefused(new Set())
    }
    if (e.agentId === undefined) {
      // La fenêtre de tour (#523) : ouverte par le message, ou ici quand aucun message ne l'a précédée ; git se relit.
      forgetGit()
      if (!submitOpened) openTurnWindow()
      setSubmitOpened(false)
      setStopTurn({ id: e.turnId, stopRan: false, fromReminder: reminderCarried })
      setReminderCarried(false)
      // Le même retour, quand le message ne passe pas par prompt.submit (#347).
      if (typeof e.text === 'string' && e.text.includes('<task-notification>')) {
        setBackgroundShells(shellsAfterNotice(backgroundShells, e.text))
        setNoticeTurn(true)
      }
    }
    if (e.agentId === undefined) {
      // Le genre du tour (#133) : un réveil de Maestro par une de ses sessions, ou un tour de la personne,
      // qui fait tomber les questions en attente.
      const maestro = await maestroHere($)
      const wake = maestro && wakeTurn(e.text)
      setClosingTurn({ work: false, box: '', asked: '', wake, maestro })
      setMaestroExec([])
      setHandWarned(false)
      setWakeRefused(false)
      if (maestro && !wake) await updatePendingAsksAtom($, () => []).catch(() => undefined)
    }
    if (e.agentId === undefined) stepList.tools = 0
    if (e.agentId === undefined) setDelegation({ files: new Set(), agentCalls: 0 })
    if (e.agentId === undefined) {
      setLaunchTurn({ cards: [], refused: false, fromPanel: launchPending })
      setLaunchPending(false)
      // #383 : le tour qu'ouvre la relève d'une tâche de la file.
      const released = releaseTurnId(e.text)
      setReleaseTurn(released !== undefined ? { id: released, tried: false } : undefined)
    }
    // Un vrai message (de Maestro ou de Bertrand) relance la session : sa réponse sera une nouvelle à dire (#131).
    if (e.agentId === undefined) setWakeBox({})
    // Sauf le tour relancé par le retour d'une tâche de fond, qui n'est pas un vrai message (#347).
    if (e.agentId === undefined && !noticeTurn) setToldMaestro(undefined)
    if (e.agentId === undefined) setNoticeTurn(false)
    if (e.agentId === undefined) {
      setReportTurn(freshReport())
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
      capture.mockupPage = undefined
      // #322 : le oui de la personne, sans correction, valide la dernière maquette dessinée.
      if (capture.mockupAwaiting !== undefined && mockupApproval(e.text ?? '')) capture.mockupAwaiting = undefined
    }
    // Le relevé des temps (#314) : le tour commence, une question de la boîte prend fin.
    if (e.agentId === undefined) {
      setTimingAsked(false)
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
    if (await inCloud($)) return next(e)
    const result = await next(e)
    if (e.agentId !== undefined) return result
    // La fin du tour relit git une fois (#523) : un commit fait hors des outils (un terminal) se voit.
    forgetGit()
    await markOwnRunning($, false)
    // #383 : la relève finie sans lancement : l'entrée est retenue, au lieu de revenir à chaque pas.
    if (releaseTurn && !releaseTurn.tried) await holdUnlaunched($, releaseTurn.id).catch(() => undefined)
    setReleaseTurn(undefined)
    // La fiche de fin de la session se garde pour la fiche de sa tâche (#144).
    if (!e.isAborted) await saveEndFiche($, e.answer)
    // #674 : son dernier message attend-il la personne ? Le repère garde la session ouverte à une clôture (le Stop relancé, #307, compris).
    if (!e.isAborted) await noteAwaitsPerson($, e.answer, wakeBox.ask, stopTurn.id === e.turnId ? stopTurn.awaits : undefined)
    // Et ce qu'elle va lancer, pour la fiche d'une tâche à lancer (#341).
    if (!e.isAborted) await savePitches($, e.answer)
    // Et la fiche de « why N », pour la carte « Pourquoi » de la fiche de sa tâche (#535).
    if (!e.isAborted) await saveWhys($, e.answer)
    // Et ce que la session a changé, zone par zone (#269).
    if (!e.isAborted) await saveChanges($, e.answer)
    // Et le temps du tour (#314), même interrompu.
    await noteTiming($, (t, now) => (t ? timingTurnEnd(t, now, { asked: timingAsked && !e.isAborted, ...(typeof e.answer === 'string' && !e.isAborted ? { answer: e.answer } : {}) }) : t))
    // Une session de Maestro prévient Maestro de l'état où elle s'arrête (#131) ; interrompue, la personne est là.
    // #384 : le même réveil dit à Maestro et noté (verdict, attente de fond) ; calculé une fois, pour une session qui a un parent.
    let wakeOnce: Promise<ChildWake> | undefined
    const wakeNow = () => (wakeOnce ??= (async () => childWake({ ...wakeBox, answer: e.answer, background: await inFlight($, e.turnId) }))())
    // Ses findings sont gardés pour Maestro avant qu'il soit réveillé (#531).
    if (!e.isAborted) await keepFindings($, e.answer)
    if (!e.isAborted) await keepPersonNote($, e.answer)
    await settlePersonNotes($, e.answer, !!e.isAborted)
    if (!e.isAborted) await tellMaestro($, wakeNow)
    try {
      const wake = e.isAborted ? undefined : (await ownParent($)) ? await wakeNow() : undefined
      await noteChild($, s => withWake(s, wake), { keepAt: true })
    } catch {
      // réveil illisible : la note garde son dernier verdict
    }
    // Un réveil de Maestro ne laisse pas de rappel, qui ferait écrire son fil (#133).
    if (e.turnId === stopTurn.id && !stopTurn.stopRan && e.reason === 'answer' && !closingTurn.wake) {
      const block = await endOfTurnBlock($, e.answer, stopTurn.fromReminder, false)
      if (block !== undefined) setPendingReminder(block)
    }
    // #657 : au-delà du seuil, la session se compacte, réveil de Maestro compris.
    if (e.reason === 'answer' && !e.isAborted) await compactPastThreshold($)
    // Stop sauté deux tours de suite, jamais vu tourner : sec-default, l'option s'éteint (#219).
    if (e.turnId === stopTurn.id && e.reason === 'answer') await noteClassicSkip($, stopTurn.stopRan)
    // Le tour est fini : ni git ni les faits de session gardés ne passent au suivant (#523).
    forgetGit()
    closeTurnWindow()
    return result
  })

  // Une skill de méthode superpowers, ou swiftui-pro, lancée (outil Skill, commande, préchargement) : notée pour le rappel.
  if (settings.account !== 'team') {
    on('skill.prompt', async ($, e, next) => {
      if (await inCloud($)) return next(e)
      setSkillPrompted(true)
      noteSkill(e.skill)
      return next(e)
    })
  }
  // Sous sec-default, skill.prompt est sauté (#116) : l'outil Skill et la commande tapée notent la skill
  // aussi, et l'outil ouvre le volet des skills Réglages et panneau, la note dans le contexte du résultat.
  on('tool.call', { tool: 'Skill' }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    noteSkill(e.skill)
    setSkillPrompted(false)
    const result = await next(e)
    if (result.deny !== undefined || result.isError === true || skillPrompted) return result
    const note = await skillPaneNote($, e.skill)
    return note === undefined ? result : { ...result, context: [...(result.context ?? []), note] }
  })
  on('command.run', async ($, e, next) => {
    if (await inCloud($)) return next(e)
    noteSkill(e.command)
    return next(e)
  })

  // #491 : /compact tapé, le % de la bande se relit à son retour ; le secours de `session.compact` sous sec-default.
  on('command.run', { command: 'compact' }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    const result = await next(e)
    await rereadBandContext($)
    return result
  })

  if (settings.account !== 'team') {
    on('classic.Stop', async ($, e, next) => {
      if (await inCloud($)) return next(e)
      stopTurn.stopRan = true
      stopTurn.background = (e as { background_tasks?: unknown }).background_tasks
      // La conclusion se garde ici (#307) : si ce Stop relance Claude, la fin de tour ne lira que la réponse relancée.
      await saveEndFiche($, e.last_assistant_message)
      stopTurn.awaits = awaitsPerson(e.last_assistant_message, wakeBox.ask)
      await savePitches($, e.last_assistant_message)
      await saveWhys($, e.last_assistant_message)
      const result = await next(e)
      // La fin du tour relit git une fois (#523), comme turn.complete.
      forgetGit()
      const block = await endOfTurnBlock($, e.last_assistant_message, e.stop_hook_active === true, result.block !== undefined)
      return block === undefined ? result : { ...result, block }
    })
  }

  // Une zone de clic démolie par l'app, même après son « prêt » (#152) : sa seule région change de clé (#516),
  // une nouvelle instance ; les autres zones restent montées. Un seul redessin par rafale de pannes.
  on('ui.fault', async ($, e, next) => {
    if (await inCloud($)) return next(e)
    const [gen, now] = await Promise.all([readZoneGenAtom($), $.clock.now()])
    if (zoneFault(zones, e.module, e.element, gen, now) && zoneRedraw(zones)) $.ui.invalidate('ui.render')
    return next(e)
  })

  // Un clic sur la barre : la zone de clic dit quel segment ; un second clic retire le filtre.
  on('ui.message', async ($, e, next) => {
    if (await inCloud($)) return next(e)
    const ready = (e.data as { ready?: unknown } | null)?.ready
    if (typeof ready === 'string') {
      zoneReady(zones, ready, await $.clock.now(), e.element)
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
    if (await inCloud($)) return next(e)
    if (e.plugin === 'roadmap') {
      gesture($)
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
    if (await inCloud($)) return next(e)
    gesture($)
    const result = await next(e)
    if (e.surface === 'desktop') retireActedFocus(focusHeld, e.element)
    return result
  })

  on('command.run', { command: 'roadmap' }, async ($, e) => roadmapCommand($, e.args ?? ''))

  // Sa fermeture à la main est refusée tant que le réglage est allumé ; un toast dit comment la permettre.
  on('ui.close', { id: PANE }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    if (!refusesPaneClose(settings.autoOpen, e.id, e.origin.kind)) return next(e)
    $.ui.toast(pinnedPaneToast())
  })

  // Les anciens noms (#378) : le même geste que leur sous-commande de /roadmap.
  on('command.run', { command: 'reglages' }, async $ => openSettings($))

  on('command.run', { command: 'controle' }, async $ => openControl($))

  on('command.run', { command: 'maestro-bar' }, async $ => forceBar($))

  // La skill des réglages tapée seule ouvre le volet sans passer par le modèle ; suivie d'une demande
  // (« coupe le mode ADHD »), la skill la traite. Lancée par le modèle, le volet s'ouvre aussi.
  // Suivie d'une demande, le volet s'ouvre dès la commande : sous sec-default, skill.prompt ne l'ouvre pas (#116).
  on('command.run', { command: SETTINGS_SKILL }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    if (e.args.trim() === '') return openSettings($)
    await skillPaneNote($, e.command)
    return next(e)
  })

  if (settings.account !== 'team') {
    on('skill.prompt', { skill: SETTINGS_SKILL }, async ($, e, next) => {
      if (await inCloud($)) return next(e)
      const result = await next(e)
      const note = await skillPaneNote($, e.skill)
      return note === undefined ? result : { ...result, text: `${note}\n\n${result.text}` }
    })
  }

  // /roadmap:roadmap-panel tapée seule (Splitmybill, 2026-10-28) : Bertrand la tape pour faire paraître
  // le panneau, et le modèle déroulait la skill jusqu'à un diagnostic. Elle répond comme /roadmap, sans
  // passer par le modèle ; suivie d'une demande (« change les sujets »), la skill la traite.
  on('command.run', { command: PANEL_SKILL }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    if (e.args.trim() === '') return openCommand($)
    await skillPaneNote($, e.command)
    return next(e)
  })

  // La même skill lancée par le modèle, ou tapée sous un nom que le hook ci-dessus n'a pas pris : le
  // panneau s'ouvre aussi, et le texte de la skill le dit en tête.
  if (settings.account !== 'team') {
    on('skill.prompt', { skill: PANEL_SKILL }, async ($, e, next) => {
      if (await inCloud($)) return next(e)
      const result = await next(e)
      const note = await skillPaneNote($, e.skill)
      return note === undefined ? result : { ...result, text: `${note}\n\n${result.text}` }
    })
  }

  // L'identité Roadmap à l'ouverture (#127, maquette A) : « Maestro » ou le brief d'une tâche lancée
  // deviennent la carte Roadmap ; le modèle lit toujours le message d'origine. Déplié (ctrl+o), le texte
  // entier d'un brief suit la carte. Tout autre message, ou une lecture en panne, garde sa rangée.
  on('ui.render', { component: 'UserMessage' }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
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
      if (welcome?.activity) welcome.activity = { ...welcome.activity, mode: await readWelcomeGridAtom($) }
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

  // Les lignes « - Roadmap : #N … » du compte rendu (#244), dessinées en une carte par tâche (#371, maquette A2 v3) :
  // l'échéance relative, qui tient la tâche, sa place dans la chaîne, l'avant → après (store `written-before`) et un clic
  // qui ouvre sa fiche. Sans ligne, résumé de bloc ou lecture en panne, le message garde son dessin : le texte reste lisible.
  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    if (e.props.isSummary) return next(e)
    const whole = splitWritten(e.props.text)
    if (!whole.some(part => part.kind === 'cards')) return next(e)
    try {
      const source = knownSource === undefined ? await sourceNow($) : (knownSource ?? undefined)
      if (!source) return next(e)
      const [stamp, titlesVersion, themeStamp, retry, liveVersion] = await Promise.all([readStampAtom($), readTitlesVersionAtom($), readThemeStampAtom($), readRetryAtom($), readLiveVersionAtom($)])
      const data = await paneData($, source, [stamp, titlesVersion, themeStamp, retry].join('|'), liveVersion)
      if (typeof data.open === 'string') return next(e)
      const tasks = [...data.open, ...data.done]
      const now = await $.clock.now()
      // L'avant : une seule lecture du store par message, et seulement si une ligne dit une mise à jour.
      // Les cartes fermées par la croix se lisent avec lui, dans la même passe : la lecture abonne le dessin, qui reprend à l'écriture.
      const [storedBefore, storedClosed, storedNative] = await Promise.all([storeGet($, BEFORE_KEY), storeGet($, CLOSED_KEY), storeGet($, NATIVE_KEY)].map(r => r.catch(() => undefined)))
      const fingerprint = hashLabel(e.props.text)
      // #436 : une Nouvelle dont la carte native est posée (par Claude, ou par Start : « proposée ») ne se dessine plus.
      const project = `${source.root ?? source.dir}|`
      const natives = new Set([...nativeKeys(storedNative)].filter(k => k.startsWith(project)).map(k => k.slice(project.length)))
      for (const [k, st] of cardStarts) if (st.state === 'proposed' && k.startsWith(project)) natives.add(k.slice(project.length))
      const parts = withoutNative(withoutClosed(whole, fingerprint, closedKeys(storedClosed)), natives)
      const updated = parts.some(part => part.kind === 'cards' && part.lines.some(l => l.kind === 'upd'))
      const before = updated ? beforeMap(storedBefore) : undefined
      // Qui tient la tâche : ce que le module sait déjà des sessions (jamais un nouvel appel d'outil).
      // La session qui tient chaque tâche : le bouton de sa carte l'ouvre, par le chemin de « Ouvrir la session » de la fiche.
      const sessions = new Map<string, LiveEntry>()
      const who = (t: Task): WrittenWho | undefined => {
        const found = t.done ? undefined : trackedSession(source, t, data.live, data.ignored, now)
        if (!found) return undefined
        if (t.id !== undefined) sessions.set(t.id, found.entry)
        return found.entry.sessionId !== undefined && runningBySession.get(found.entry.sessionId) === false ? { text: "t'attend", tone: 'soon', session: true } : { text: 'en session', tone: 'live', session: true }
      }
      // Les bilans : ce que le panneau a déjà en mémoire (`paneData`), jamais une nouvelle lecture.
      const cards = (lines: WrittenLine[]) => writtenCards(lines, tasks, { short: t => shownTitle(t, data.titles), today: todayOf(now), me: source.me, who, bilans: data.bilan.bilans, ...(before ? { before } : {}), reco: (t: Task) => (isRoutine(t) ? 'mac' : launchTargetOf(source, t)) })
      // #616 : « Lancer les filles » de la carte d'une mère, le geste de son ▶ du panneau (#552) : la consigne part dans la conversation.
      const launchDaughtersFromCard = (id: string) => {
        const mother = tasks.find(x => x.id === id)
        if (!mother) return
        const daughters = motherLaunchable(mother, tasks, x => who(x)?.session === true)
        if (daughters.length === 0) return
        motherCardLaunches.add(`${source.root ?? source.dir}|${id}`)
        void submitWelcome($, motherLaunchText(mother, daughters, x => shownTitle(x, data.titles))).then(() => updateRetryAtom($, v => v + 1))
      }
      const openSessionOf = (id: string) => {
        const entry = sessions.get(id)
        void (entry ? openSession($, entry) : openTaskFiche($, source, id))
      }
      return drawWrittenMessage($.ui.resolve(e), parts, cards, data.palette, { open: id => void openTaskFiche($, source, id), openSession: openSessionOf, start: id => { const t = tasks.find(x => x.id === id); if (t) void startFromCard($, source, id, shownTitle(t, data.titles)) }, started: id => cardStarts.get(`${source.root ?? source.dir}|${id}`), launchDaughters: id => launchDaughtersFromCard(id), launched: id => motherCardLaunches.has(`${source.root ?? source.dir}|${id}`), close: id => void storeGet($, CLOSED_KEY).catch(() => undefined).then(stored => storeSet($, CLOSED_KEY, keepClosed(stored, `${fingerprint}:${id}`) as StoreValue)).then(() => updateRetryAtom($, v => v + 1)) })
    } catch (err) {
      $.ui.log(`roadmap : cartes des tâches écrites non dessinées (${err instanceof Error ? err.message : String(err)})`, { to: 'debug' })
      return next(e)
    }
  })

  // L'arbre de Maestro au-dessus de la saisie (#147, style C) : toujours visible, chez Maestro avec au
  // moins une session, jamais pendant un sondage ; sinon la bande reste à l'app. La boîte de fin qui
  // pose une question prend sa place (l'app) : l'arbre revient quand elle est répondue.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    setBandAsked({ survey: e.props.hasSurvey })
    if (e.props.hasSurvey) return next(e)
    try {
      const found = await sessionBrandOf($)
      // #385 : la bande paraît dès que le projet a des sessions en cours, tous Maestro confondus.
      const others = found?.brand.kind === 'maestro' ? await projectBandOthers($, found.data) : []
      // #400 : les entrées de la file bloquées, que la relève a posées dans l'atome (aucune lecture du store ici).
      const stuck = found?.brand.kind === 'maestro' ? ((await readQueueAlertAtom($)) ?? []) : []
      // #561 : le gardien ouvert, d'après la liste des sessions que le dessin vient de lire ; sa note dit s'il pose une
      // question. Celui de CE Maestro d'abord, sinon (#577) le premier gardien ouvert du dossier du projet, quel que soit
      // le Maestro qui l'a lancé (même règle de dossier que le suivi des sessions). Aucune lecture de plus sans gardien.
      const ownId = found?.brand.kind === 'maestro' ? found.data.own.id : undefined
      const guardRow = ownId !== undefined ? gardienBandRow(sessionRows, ownId, { match: found?.data.source.match }) : undefined
      const guardAsking = guardRow !== undefined ? (await readSteps($, guardRow.sessionId))?.question !== undefined : false
      const gardien = guardRow !== undefined ? { ...guardRow, state: guardAsking ? ('wait' as const) : guardRow.state } : undefined
      const band = maestroBand({ brand: found?.brand, hasSurvey: e.props.hasSurvey, shown: BRAND_TASKS_SHOWN, others, alerts: stuck.length, guard: gardien !== undefined })
      if (!found || !band) return next(e)
      const now = await $.clock.now()
      // Sa durée : depuis sa création, apprise comme celle des filles, sans retenir le dessin (#539).
      if (gardien) await behindDraw($, learnCreated($, [gardien.sessionId], now))
      const statuses = await Promise.all(band.tasks.map(t => readSteps($, t.sessionId)))
      const views = statuses.map((status, i) => {
        const t = band.tasks[i]
        return status ? stepsView(shownStatus(status, t?.sessionId, t?.closed === true).steps, { now, at: status.at, closed: t?.closed === true }) : undefined
      })
      // Le contexte de Maestro (#157) : la mesure du dernier tour, ou celle du moment avant la première ;
      // celui de chaque session, noté à la fin de ses tours, sous sa jauge d'étapes (#157, revenu par #217).
      const mine = (await readBandContextAtom($)) ?? contextUseOf((await $.session.usage().catch(() => undefined))?.context)
      const contexts = { mine: contextView(mine ?? undefined), rows: statuses.map(status => contextView(status?.context)) }
      // La durée live de chaque ligne, puis son compte et son étape (#385, version corrigée 2).
      // Retour de test de #385 (maquette « version corrigée ») : « 6/7 · étape », la durée à part au bord droit ;
      // la case de l'axe du panneau, cochée quand la tâche est close.
      const { tasks: all, source: src, palette: pal } = found.data
      const ranks = axisPalette(axisOrder(all.filter(x => !x.done), all.filter(x => x.done)), src.axes)
      // #480 : les passes de ses livraisons, les PR de la lecture déjà gardée (60 s) , une ligne de la bande a sa session.
      const bandPrs = await prsOfDelivered($, src, all.filter(x => band.tasks.some(t => t.id === x.id)))
      const infos = band.tasks.map((t, i) => {
        const task = all.find(x => x.id === t.id)
        const pr = t.mission ? undefined : t.cloud ?? (task ? currentPr(bandPrs, task) : undefined) // #469 : une mission n'a pas de PR
        const working = t.cloud ? t.cloud.state !== 'delivered' : t.state !== 'done' // #480 : dans la bande, la ligne a sa session
        return {
          ...(task ? { passes: deliveryPasses(task, { working, ...(pr ? { pr } : {}) }) } : {}),
          since: sinceLabel(t.since, now),
          // #440 (maquette B6) : une ligne cloud a son compte d'étapes, tiré de sa PR ; #468 (bande v2) : et le numéro de sa PR.
          text: t.cloud ? `${cloudRowSteps({ cloud: t.cloud, ...(t.mission ? { mission: t.mission } : {}) }).count}${t.cloud.number !== undefined ? ` · PR ${t.cloud.number}` : ''}` : bandInfo({ view: views[i], finished: t.finished === true }),
          ...(task ? { square: { hex: axisColor(pal, ranks.get(task.axis) ?? 0), axis: task.axis, done: bandSquareDone(task.done === true, t) } } : {}),
        }
      })
      return maestroBandTree($, e, band, found.data.palette, views, infos, {
        // #583 : une ligne cloud ouvre sa conversation quand son lien est connu, sinon sa fiche.
        open: t => {
          const link = t.cloud ? cloudSessionLinkOf(t) : undefined
          void (link ? openHttpsUrl($, link).catch(() => openTaskFiche($, src, t.id)) : t.cloud ? openTaskFiche($, src, t.id) : t.sessionId ? openSession($, { sessionId: t.sessionId, startedAt: now, title: t.label }) : undefined)
        },
        archive: t => void archiveTaskRow($, t, now),
        compact: () => void compactFromBand($),
        openStuck: s => void (s.open ? openSession($, { sessionId: s.open, startedAt: now, title: `Maestro ${s.project}` }) : undefined),
      }, now, contexts, await readZoneGenAtom($), stuck, gardien ? { sessionId: gardien.sessionId, title: gardien.title, state: gardien.state, since: sinceLabel(createdBySession.get(gardien.sessionId), now) } : undefined)
    } catch {
      return next(e)
    }
  })

  // Le panneau ne reste jamais vide en silence (#220) : une erreur du dessin montre sa carte d'erreur ; un
  // dessin qui dépasse son temps ou un arbre refusé par l'app passe par `.catch`, qui montre la même.
  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    // Un lancement déposé par un bouton part d'ici, où le hook prompt.submit du plugin tourne (#140).
    sendLaunch($)
    // #496 : le réveil de Maestro par une PR cloud part d'ici aussi, pour la même raison.
    sendWake($)
    void notePaneDraw($, 'reachedAt')
    const t0 = tick()
    setPerfLoaded(t0)
    setPerfCached(false)
    let tree: RenderElement
    let weighed: ReturnType<typeof weighTree>
    try {
      setPaneStage('')
      const drawing = drawPane($, e)
      const drawn = await withinMs($, drawing, PANE_DEADLINE_MS)
      if (drawn === 'late') {
        // Le dessin continue en fond ; « Réessayer » le relance, ses lectures déjà faites gardées (#414).
        drawing.catch(() => undefined)
        return paneFailure($, e, { kind: 'timeout', message: '', stage: paneStage || 'le début du dessin' })
      }
      tree = retireFocusKeys(drawn, focusHeld.epochs)
      // Trop gros pour l'app (#414) : le même dessin, avec moins de lignes.
      weighed = weighTree(tree)
      let weight = weighed.kb
      for (let again = 0; again < 2 && weight > PANE_TARGET_KB && paneLineCap > LINE_CAP_MIN; again++) {
        setPaneLineCap(Math.max(LINE_CAP_MIN, Math.floor(((paneLineCap * PANE_TARGET_KB) / weight) * 0.9)))
        setPaneStage('un dessin plus léger')
        const lighter = await withinMs($, drawPane($, e), PANE_DEADLINE_MS)
        if (lighter === 'late') return paneFailure($, e, { kind: 'timeout', message: '', stage: paneStage })
        tree = retireFocusKeys(lighter, focusHeld.epochs)
        weighed = weighTree(tree)
        weight = weighed.kb
      }
      if (weight > PANE_MAX_KB) {
        return paneFailure($, e, { kind: 'heavy', message: `${Math.round(weight)} Ko dessinés, ${PANE_MAX_KB} au plus. Filtre par axe (un clic sur sa ligne, ou « Maestro <axe> »), puis « Réessayer ».` })
      }
    } catch (err) {
      return paneFailure($, e, { kind: 'throw', message: err instanceof Error ? err.message : String(err), ...(err instanceof Error && err.stack ? { stack: err.stack } : {}) })
    }
    notePerf(t0, weighed, e.props.scroll)
    setPaneRetryMs(0)
    void notePaneDraw($, 'drawnAt')
    return tree
  }).catch(async ($, e, next) => paneFailure($, e, { kind: next.error.kind, message: next.error.message ?? '' }))

  // Le défilement du panneau, relevé : le moteur pose la fenêtre (#106). Celui de la personne fait
  // quitter l'élément qu'elle tenait (#154) : sa clé change, l'app ne remonte plus jusqu'à lui.
  on('ui.scroll', { component: 'Pane', requestId: PANE }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    const t0 = tick()
    const result = await next(e)
    noteScroll(e, result, tick() - t0)
    // #522 : un défilement de la personne est un geste.
    if (e.origin.kind === 'person') gesture($)
    if (e.origin.kind === 'person' && result.deny === undefined) retireHeldFocus(focusHeld, e.by)
    return result
  })

  // Le focus du panneau, relevé avec la réponse du moteur (#111), et l'élément tenu retenu (#154).
  on('ui.focus', { component: 'Pane', requestId: PANE }, async ($, e, next) => {
    if (await inCloud($)) return next(e)
    const result = await next(e)
    noteFocus(e, result)
    if (result.deny === undefined) noteHeldFocus(focusHeld, e.element)
    return result
  })

  on('ui.render', { component: 'Pane', requestId: SETTINGS_PANE }, async ($, e) => drawSettings($, e, await paletteOf($), await settingsProject($)))
  on('ui.render', { component: 'Pane', requestId: CONTROL_PANE }, async ($, e) => drawControl($, e, await paletteOf($), controlDeps($)))
}
