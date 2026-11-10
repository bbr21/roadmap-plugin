import { atom, read, update } from 'claude-code'
import type { ConfigKind, ConfigRow, ConfigValue, EngineInterface, RenderElement, RenderInput } from 'claude-code'

import { fullWidth, ruleIcon, type Palette } from './icons'
import { SPACE } from './tokens'
import {
  DEFAULT_SESSION_PREFS,
  SESSION_PREFS_FILE,
  SESSION_PREF_INFO,
  baseName,
  mainCheckout,
  ownOptions,
  projectKeyOf,
  sessionPrefsView,
  setProjectMission,
  setSessionPref,
  type MissionStyle,
  type PrefKey,
} from './parse'

// Le volet Réglages (#81, Bertrand, 2026-10-28) : chaque réglage de session et du panneau, son état
// et son explication, changé d'un clic, sans retenir de phrase. Il existe dans tout projet, roadmap
// ou non : `/reglages`, le bouton du panneau Roadmap et la skill reglages-session l'ouvrent.

export const SETTINGS_PANE = 'reglages'

/** Monte après chaque écriture du fichier (par le volet ou ailleurs) : le volet se redessine. */
export const prefsStampAtom = atom({ plugin: 'roadmap', key: 'prefsStamp' } as const, 0)

/** L'explication ouverte (#118) : la clé de sa ligne (`pref:adhd`, `opt:theme`), vide sinon. */
export const settingsInfoAtom = atom({ plugin: 'roadmap', key: 'settingsInfo' } as const, '')

/** Ce qu'a donné la dernière écriture quand elle a échoué ; vide sinon. */
let prefsNote = ''

/** Les écritures, l'une après l'autre : deux clics rapprochés ne s'écrasent pas. */
let writing: Promise<void> = Promise.resolve()

/** Le suivi du fichier tant que le volet est ouvert, et la date de modification vue en dernier. */
let watchTimer: { cancel: () => void } | undefined
let watchedMtime: number | undefined

/** Toutes les 2 secondes, tant que le volet est ouvert. */
const WATCH_MS = 2_000

/** Le plus long qu'attend `git worktree list` : un dépôt sur un volume lent ne bloque pas le démarrage. */
const GIT_MS = 5_000

/** Le fichier des réglages de session et le dossier personnel ; rien sans `HOME`. */
export async function prefsFile($: EngineInterface): Promise<{ path: string; home: string } | undefined> {
  const home = (await $.env.get('HOME')) ?? ''
  if (home === '') return undefined
  return { path: `${home.replace(/\/+$/, '')}/.claude/reglages-session.json`, home }
}

/** Le projet d'une session : sa clé sous `projets` et son nom ; ni l'une ni l'autre hors projet. */
export type SessionProject = { key?: string; name?: string; home: string }

/** Le dossier principal de chaque dossier de session que git a donné : un seul `git` par dossier. */
const mainDirs = new Map<string, string>()

/**
 * Le projet de la session (#102) : le dossier principal de son dépôt, le premier de `git worktree
 * list`, pour qu'un worktree compte pour son projet, sous `.claude/worktrees/` ou à côté ; hors dépôt,
 * le dossier de la session. Le dossier personnel ou `/` n'est pas un projet.
 */
export async function sessionProject($: EngineInterface): Promise<SessionProject> {
  const home = (await $.env.get('HOME')) ?? ''
  const root = (await $.session.root()).replace(/\/+$/, '')
  let dir = mainDirs.get(root)
  if (dir === undefined) {
    dir = mainCheckout(root)
    try {
      const list = await $.process.run(['git', '--no-optional-locks', '-C', root, 'worktree', 'list', '--porcelain'], { timeoutMs: GIT_MS })
      const first = list.exitCode === 0 ? list.stdout.split('\n').find(l => l.startsWith('worktree ')) : undefined
      // Seule la réponse de git se retient : un échec se retente au passage suivant.
      if (first !== undefined) {
        dir = first.slice('worktree '.length).trim()
        mainDirs.set(root, dir)
      }
    } catch {
      // git absent ou trop long : le dossier de la session
    }
  }
  const key = projectKeyOf(dir, home)
  return key === undefined ? { home } : { key, name: baseName(dir), home }
}

async function prefsText($: EngineInterface, path: string): Promise<string | undefined> {
  return (await $.fs.exists(path)) ? await $.fs.read(path) : undefined
}

/** Redessine le volet : après un rechargement du module, ou quand le fichier change sans lui. */
export async function redrawSettings($: EngineInterface): Promise<void> {
  await update($, prefsStampAtom, v => v + 1)
}

export async function openSettings($: EngineInterface): Promise<{ text: string }> {
  await $.ui.open({ id: SETTINGS_PANE, title: 'Réglages' })
  await watchSettings($)
  return { text: 'Volet des réglages ouvert.' }
}

/**
 * La skill et les autres sessions écrivent aussi le fichier : tant que le volet est ouvert, un seul
 * minuteur relit sa date de modification et redessine le volet quand elle change. Il s'arrête de
 * lui-même quand le volet n'est plus ouvert, quelle que soit la façon dont il s'est fermé.
 */
export async function watchSettings($: EngineInterface): Promise<void> {
  if (watchTimer) return
  const mtimeNow = async (): Promise<number | undefined> => {
    const file = await prefsFile($)
    if (!file) return undefined
    return (await $.fs.exists(file.path)) ? (await $.fs.stat(file.path)).mtimeMs : 0
  }
  watchTimer = $.clock.every(WATCH_MS, () => {
    void (async () => {
      if (!(await $.ui.panes()).some(p => p.id === SETTINGS_PANE)) {
        unwatchSettings()
        return
      }
      const mtime = await mtimeNow()
      if (mtime !== watchedMtime) {
        watchedMtime = mtime
        // Écrit ailleurs (la skill l'a réparé, une autre session l'a changé) : l'erreur d'une
        // écriture d'avant ne vaut plus.
        prefsNote = ''
        await redrawSettings($)
      }
    })().catch(() => undefined)
  })
  // Le premier relevé, à l'ouverture : un changement d'avant le premier tour se voit aussi.
  watchedMtime = await mtimeNow().catch(() => undefined)
}

function unwatchSettings(): void {
  watchTimer?.cancel()
  watchTimer = undefined
}

/**
 * Un clic sur un réglage de session : le fichier relu (une autre session ou la skill a pu l'écrire
 * depuis le dessin), réécrit par `setSessionPref` dans le bloc du projet de la session (#102).
 * Illisible, il n'est pas touché.
 */
function writePref($: EngineInterface, key: PrefKey, value: boolean, project: SessionProject): Promise<void> {
  writing = writing.then(async () => {
    try {
      const file = await prefsFile($)
      if (!file) throw new Error('dossier personnel inconnu')
      const next = setSessionPref(await prefsText($, file.path), key, value, project.key, project.home)
      await $.fs.write(file.path, next)
      prefsNote = ''
    } catch (err) {
      prefsNote = `Rien d'écrit : ${err instanceof Error ? err.message : String(err)}`
    }
    await update($, prefsStampAtom, v => v + 1)
  })
  return writing
}

/**
 * Le projet de la session, quand sa roadmap est déclarée par un `.claude/roadmap.json` (#278) : son nom, le
 * chemin du fichier, ses réglages lus, et de quoi redessiner le panneau après une écriture.
 */
export type SettingsProject = { name: string; path: string; mission: MissionStyle; changed?: () => Promise<unknown> }

/** Ce qu'a donné la dernière écriture de `.claude/roadmap.json` quand elle a échoué ; vide sinon. */
let projectNote = ''

/** Un clic sur un réglage du projet (#278) : le fichier relu, `mission` réécrite, les autres clés gardées. */
function writeMission($: EngineInterface, project: SettingsProject, value: MissionStyle): Promise<void> {
  writing = writing.then(async () => {
    try {
      await $.fs.write(project.path, setProjectMission(await $.fs.read(project.path), value))
      projectNote = ''
      await project.changed?.()
    } catch (err) {
      projectNote = `Rien d'écrit : ${err instanceof Error ? err.message : String(err)}`
    }
    await update($, prefsStampAtom, v => v + 1)
  })
  return writing
}

/** Les choix du rendu de la mission (#278), dans l'ordre du volet. */
const MISSION_CHOICES: readonly { value: MissionStyle; label: string }[] = [
  { value: 'phrase', label: 'Phrase' },
  { value: 'puces', label: 'Puces' },
]

/** Le dernier refus d'une option du panneau, par champ. */
const optionNotes = new Map<string, string>()

/** Une option du plugin : son champ, sa ligne de /config, et les clés de chaque plugin du même nom (#227). */
type PluginOption = { field: string; row: ConfigRow; keys: string[] }

/**
 * Un clic sur une option du panneau : changée comme dans le menu de configuration de Claude Code, sous chacune de
 * ses clés (deux plugins « roadmap » actifs ont chacun la leur, #227). Le changement recharge le plugin (ses options
 * sont fixes pour un chargement) ; un refus se garde pour s'afficher sous la ligne.
 */
function setOption($: EngineInterface, o: PluginOption, value: ConfigValue): Promise<void> {
  return (async () => {
    const refusals: string[] = []
    for (const key of o.keys) {
      try {
        const { deny } = await $.config.set({ key, value })
        if (deny !== undefined) refusals.push(deny)
      } catch (err) {
        refusals.push(err instanceof Error ? err.message : String(err))
      }
    }
    if (refusals.length > 0) optionNotes.set(o.field, `Refusé : ${refusals.join(' · ')}`)
    else optionNotes.delete(o.field)
    await update($, prefsStampAtom, v => v + 1)
  })()
}

/**
 * Les options du plugin, telles que le menu de configuration les montre ; aucune si la liste échoue.
 * Reconnues à leur fournisseur, `roadmap` ou `roadmap@<source>` (sonde de #91, 2026-10-29), et à leur clé,
 * `roadmap.<champ>`, ou `roadmap@<source>.<champ>` quand deux plugins « roadmap » sont actifs : chez Caroline,
 * le volet n'en trouvait alors aucune (#227).
 */
async function pluginOptions($: EngineInterface): Promise<PluginOption[]> {
  let listed: PluginOption[] = []
  try {
    listed = ownOptions(await $.config.list(), $.plugin.name)
  } catch {
    listed = []
  }
  return listed.length > 0 ? listed : manifestOptions($)
}

/** Les valeurs des options au chargement du plugin, telles que `register` les reçoit (#356). */
let loadedOptions: Readonly<Record<string, unknown>> = {}

/** Garde les valeurs des options du chargement : le volet s'en sert quand /config n'en liste aucune (#356). */
export function rememberLoadedOptions(options: Readonly<Record<string, unknown>> | undefined): void {
  loadedOptions = options ?? {}
}

/** Une entrée `userConfig` du `plugin.json`, ce que le volet en lit. */
type ManifestOption = { type?: unknown; title?: unknown; description?: unknown; default?: unknown; options?: unknown; sensitive?: unknown; multiple?: unknown }

/**
 * Les options d'après le `userConfig` du `plugin.json` (#356) : dans une session AAFES Cowork, le moteur ne listait
 * aucune ligne de /config pour le plugin (il les tire des plugins qu'il tient pour actifs, et l'app y voyait un plugin
 * chargé hors de cette liste), et le volet disait les options introuvables. Chaque option prend la valeur de ce
 * chargement, sinon son défaut ; un clic l'écrit sous la clé courte, et un refus du moteur se lit sous sa ligne.
 * Comme le moteur, ni option secrète ni liste multiple. Un fichier illisible : aucune.
 */
export function optionsFromManifest(text: string, name: string, loaded: Readonly<Record<string, unknown>>): PluginOption[] {
  let config: Record<string, ManifestOption>
  try {
    const parsed = JSON.parse(text) as { userConfig?: unknown }
    config = parsed.userConfig !== null && typeof parsed.userConfig === 'object' ? (parsed.userConfig as Record<string, ManifestOption>) : {}
  } catch {
    return []
  }
  const out: PluginOption[] = []
  for (const [field, spec] of Object.entries(config)) {
    if (spec === null || typeof spec !== 'object' || spec.sensitive === true || spec.multiple === true) continue
    const choices = Array.isArray(spec.options) ? spec.options.filter((o): o is string => typeof o === 'string') : undefined
    const kind: ConfigKind = spec.type === 'boolean' ? 'boolean' : spec.type === 'number' ? 'number' : choices && choices.length > 0 ? 'choice' : 'text'
    const raw = field in loaded ? loaded[field] : spec.default
    const value: ConfigValue = kind === 'boolean' ? raw === true : kind === 'number' ? Number(raw ?? 0) : raw === undefined || raw === null ? '' : String(raw)
    const key = `${name}.${field}`
    const row = {
      key,
      label: typeof spec.title === 'string' ? spec.title : field,
      ...(typeof spec.description === 'string' ? { description: spec.description } : {}),
      kind,
      value,
      ...(kind === 'choice' ? { options: choices } : {}),
      provider: { plugin: name, tier: 'user' },
      isLocked: false,
    } as unknown as ConfigRow
    out.push({ field, row, keys: [key] })
  }
  return out
}

async function manifestOptions($: EngineInterface): Promise<PluginOption[]> {
  try {
    return optionsFromManifest(await $.fs.read(`${$.plugin.root}/.claude-plugin/plugin.json`), $.plugin.name, loadedOptions)
  } catch {
    return []
  }
}

/** Une option du panneau dans sa section : son champ, son nom court, son défaut tel que le dit le `plugin.json`. */
type SectionOption = { field: string; name: string; def: string }

/** Une section du volet : réglages de session, ou options du panneau. */
type SettingsSection = { id: string; title: string; prefs?: readonly PrefKey[]; options?: readonly SectionOption[] }

/**
 * Les sections du volet (#118, maquette A1 choisie par Bertrand le 2026-10-29), par sujet et dans cet
 * ordre. Les réglages de session valent pour le projet, au prochain message de chacune de ses
 * sessions (#119) ; les options du panneau, partout et tout de suite. `def` suit le `default` du `plugin.json` : tools/test_reglages.py
 * le vérifie, comme la place de chaque option dans une section.
 */
export const SETTINGS_SECTIONS: readonly SettingsSection[] = [
  { id: 'claude', title: 'Claude et toi', prefs: ['francais', 'adhd', 'questions', 'autonome'] },
  {
    id: 'launch',
    title: 'Sessions lancées',
    options: [
      { field: 'launchEffort', name: 'Effort', def: 'high' },
      { field: 'launchModel', name: 'Modèle qui cadre', def: 'opus' },
      { field: 'codeModel', name: 'Modèle qui code', def: 'sonnet' },
      { field: 'launchBypass', name: 'Lancer en bypass', def: 'Off' },
      { field: 'pruneBranches', name: 'Branches nettoyées', def: 'On' },
      { field: 'launchQueue', name: 'File de lancement', def: 'On' },
      { field: 'projectSessions', name: 'Sessions par projet', def: '3' },
      { field: 'macSessions', name: 'Sessions sur le Mac', def: '12' },
      { field: 'testSlots', name: 'Suites de tests sur le Mac', def: '1' },
      { field: 'idleMinutes', name: 'Repos avant de rendre sa place', def: '10' },
    ],
  },
  {
    id: 'roadmap',
    title: 'Roadmap',
    options: [
      { field: 'capture', name: 'Capter les tasks', def: 'On' },
      { field: 'titleModel', name: 'Modèle des titres courts', def: 'sonnet' },
      { field: 'me', name: 'Tes noms', def: 'vide' },
      { field: 'account', name: 'Compte', def: 'auto' },
    ],
  },
  {
    id: 'panel',
    title: 'Panneau',
    options: [
      { field: 'autoOpen', name: 'Toujours ouvert', def: 'On' },
      { field: 'axisPill', name: 'Axe en pastille', def: 'Off' },
      { field: 'priorities', name: 'Priorités', def: 'Off' },
      { field: 'theme', name: 'Thème', def: 'auto' },
      { field: 'dateFormat', name: 'Format des dates', def: 'us' },
    ],
  },
]

/** Ce que le volet écrit pour une valeur de liste quand la valeur seule ne se lit pas (#223) ; `/config` montre la valeur. */
const CHOICE_LABELS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  account: { auto: 'Auto', perso: 'Perso', team: 'Team / Enterprise' },
}

/** Les choix d'une liste du volet : la valeur, et son libellé quand `CHOICE_LABELS` en a un. */
export function choiceOptions(field: string, values: readonly string[]): { value: string; label?: string }[] {
  const labels = CHOICE_LABELS[field]
  return values.map(value => (labels?.[value] ? { value, label: labels[value] } : { value }))
}

/** L'ordre des options qu'aucune section ne range, dans « Autres » (#91) : oui/non, puis listes, puis textes. */
const KIND_ORDER: Record<ConfigKind, number> = { boolean: 0, choice: 1, text: 2, number: 2 }

/** Ce que dit une explication : le texte, ce que fait Off, puis défaut et prise d'effet. */
type Explain = { text: string; off?: string; meta: string }

/** Quand une option du panneau prend effet, et la portée de ses sections. */
const NOW = 'tout de suite, dans tous les projets'
const OPTIONS_SCOPE = 'partout · tout de suite'

/**
 * Le volet, maquette A1 choisie par Bertrand (#118, 2026-10-29) : les réglages en sections par sujet,
 * un filet et un grand écart entre elles, chacune avec sa portée ; chaque ligne a son nom, son ⓘ et
 * son contrôle (On | Off, une liste ou un champ). Le ⓘ ouvre l'explication sous la ligne, une seule à
 * la fois : plus rien au survol (#91), qu'un écran tactile ne montre pas.
 */
export async function drawSettings($: EngineInterface, e: RenderInput<'Pane'>, palette: Palette, project?: SettingsProject): Promise<RenderElement> {
  const resolved = $.ui.resolve(e)
  const { Box, Text, Button } = resolved
  // L'application mobile ne dessine pas encore de choix ni de champ (sa table n'a ni Select ni
  // Input) : un bouton passe alors à la valeur suivante, et un texte se montre seulement. Le
  // terminal n'a pas de Svg : les sections s'y séparent par leur seul écart.
  const Select = e.surface !== 'mobile' && 'Select' in resolved ? resolved.Select : undefined
  const Input = e.surface !== 'mobile' && 'Input' in resolved ? resolved.Input : undefined
  const Svg = 'Svg' in resolved ? resolved.Svg : undefined
  const wide = fullWidth((e.props as { bodyColumns?: number }).bodyColumns ?? 48)
  await read($, prefsStampAtom)
  const openInfo = await read($, settingsInfoAtom)
  const options = await pluginOptions($)

  const file = await prefsFile($)
  let text: string | undefined
  let readError: string | undefined
  try {
    text = file ? await prefsText($, file.path) : undefined
  } catch (err) {
    readError = err instanceof Error ? err.message : String(err)
  }
  const session = await sessionProject($)
  const view = sessionPrefsView(text, session.key, session.home)
  const error = readError ?? view.error

  /** On | Off côte à côte : le choix actif en bouton principal ; un clic sur lui n'écrit rien. */
  const onOff = (key: string, value: boolean, set: (to: boolean) => void) => (
    <Box flexDirection="row" gap={SPACE.tight} flexShrink={0}>
      {([true, false] as const).map(to =>
        to === value ? (
          <Button key={`${key}:${to ? 'on' : 'off'}`} variant="primary" label={to ? 'On' : 'Off'} onPress={() => undefined} />
        ) : (
          <Button key={`${key}:${to ? 'on' : 'off'}`} plain dimColor label={to ? 'On' : 'Off'} onPress={() => set(to)} />
        ),
      )}
    </Box>
  )

  const caption = (t: string, color = palette.text2) => (
    <Text size="caption" color={color} wrap="wrap">
      {t}
    </Text>
  )

  /**
   * Une ligne : le nom et son ⓘ à gauche, le contrôle à droite ; dessous, un champ s'il y en a un, puis
   * l'explication quand son ⓘ l'a ouverte. Un second clic sur le ⓘ la referme. Le ⓘ n'a pas de `label` :
   * sur le bureau, un Button dessine son label à la place de ses enfants (« Explication : Mode ADHD », #356).
   */
  const line = (id: string, rowKey: string, name: string, control: RenderElement | false, explain: Explain, below: (RenderElement | false)[] = []) => {
    const open = openInfo === id
    return (
      <Box key={rowKey} flexDirection="column" gap={SPACE.tight} paddingX={SPACE.indent}>
        <Box flexDirection="row" justifyContent="space-between" alignItems="center" gap={SPACE.row}>
          <Box flexDirection="row" alignItems="center" gap={SPACE.row} flexShrink={1}>
            <Text weight="semibold">{name}</Text>
            <Button
              key={`info:${id}`}
              plain
              dimColor={!open}
              onPress={() => void update($, settingsInfoAtom, v => (v === id ? '' : id))}
            >
              {open ? 'ⓧ' : 'ⓘ'}
            </Button>
          </Box>
          {control}
        </Box>
        {below}
        {open && (
          <Box key={`detail:${id}`} flexDirection="column" gap={SPACE.tight} paddingX={SPACE.indent} paddingY="sm" backgroundColor={palette.note}>
            <Text size="footnote" wrap="wrap">
              {explain.text}
            </Text>
            {explain.off !== undefined && (
              <Text size="footnote" color={palette.text2} wrap="wrap">
                {`Off : ${explain.off}`}
              </Text>
            )}
            {caption(explain.meta)}
          </Box>
        )}
      </Box>
    )
  }

  /** Une section : un filet au-dessus (sauf la première), son titre, sa portée, puis ses lignes. */
  const section = (id: string, title: string, scope: string, body: (RenderElement | false)[], first = false) => (
    <Box key={`section:${id}`} flexDirection="column" gap={SPACE.block}>
      {!first && Svg && <Svg source={ruleIcon(palette.border, wide)} alt="séparateur" height={1} />}
      <Box flexDirection="column" paddingX={SPACE.indent}>
        <Text size="footnote" weight="semibold" color={palette.text2}>{title}</Text>
        <Text size="caption" color={palette.text3}>
          {scope}
        </Text>
      </Box>
      {body}
    </Box>
  )

  // Hors projet, un clic écrit les clés du haut : les valeurs de départ des projets jamais réglés.
  // Un changement revient au message suivant de chaque session ouverte (#119), sans attendre la suivante.
  const sessionScope = session.name === undefined ? 'hors projet · au prochain message' : `ce projet (${session.name}) · au prochain message`
  const sessionWhen =
    session.name === undefined
      ? 'au prochain message, dans chaque session hors projet et des projets jamais réglés'
      : `au prochain message, dans chaque session de ce projet (${session.name})`

  const prefRow = (key: PrefKey) => {
    const info = SESSION_PREF_INFO.find(i => i.key === key)!
    const value = view.rows.find(r => r.key === key)?.value ?? DEFAULT_SESSION_PREFS[key]
    return line(`pref:${key}`, `pref-row:${key}`, info.name, onOff(`pref:${key}`, value, to => void writePref($, key, to, session)), {
      text: info.detail,
      off: info.off,
      meta: `Par défaut : ${DEFAULT_SESSION_PREFS[key] ? 'On' : 'Off'} · Prend effet : ${sessionWhen}`,
    })
  }

  const control = (option: PluginOption) => {
    const { row: o, field } = option
    const key = `opt:${field}`
    if (o.isLocked) return <Text size="caption" color={palette.text2}>Fixé par ton organisation</Text>
    if (o.kind === 'boolean') return onOff(key, o.value === true, to => void setOption($, option, to))
    if (o.kind === 'choice' && o.options && o.options.length > 0) {
      const values = o.options
      const current = String(o.value)
      if (Select) {
        return (
          <Select
            key={key}
            options={choiceOptions(field, values)}
            value={current}
            onSelect={(value: string) => void setOption($, option, value)}
          />
        )
      }
      const next = values[(values.indexOf(current) + 1) % values.length] ?? values[0]!
      return <Button key={key} plain label={CHOICE_LABELS[field]?.[current] ?? current} onPress={() => void setOption($, option, next)} />
    }
    return <Text mono size="caption">{String(o.value)}</Text>
  }

  /** Une option : son nom court et son défaut si une section la range, son titre du menu sinon. */
  const optionRow = (option: PluginOption, known?: SectionOption) => {
    const { row: o, field } = option
    // Un texte se tape dans un champ à part, sous son titre : il ne tient pas à côté.
    const typed = Input !== undefined && (o.kind === 'text' || o.kind === 'number') && !o.isLocked
    return line(
      `opt:${field}`,
      `opt-row:${field}`,
      known?.name ?? o.label,
      !typed && <Box flexShrink={0}>{control(option)}</Box>,
      { text: o.description ?? o.label, meta: known ? `Par défaut : ${known.def} · Prend effet : ${NOW}` : `Prend effet : ${NOW}` },
      [
        typed && (
          <Input
            key={`opt:${field}`}
            value={String(o.value)}
            submitLabel="enregistrer"
            onSubmit={(value: string) => void setOption($, option, o.kind === 'number' ? Number(value) : value)}
          />
        ),
        optionNotes.has(field) && caption(optionNotes.get(field)!, palette.lateOn),
      ],
    )
  }

  /**
   * La section « Ce projet » (#278, maquette choisie par BBR) : Phrase | Puces comme On | Off, le choix actif en
   * bouton principal ; un clic sur lui n'écrit rien. Sa portée dit le fichier qu'elle écrit.
   */
  const projectSection = (p: SettingsProject) => {
    const choice = (
      <Box flexDirection="row" gap={SPACE.tight} flexShrink={0}>
        {MISSION_CHOICES.map(c =>
          c.value === p.mission ? (
            <Button key={`project:mission:${c.value}`} variant="primary" label={c.label} onPress={() => undefined} />
          ) : (
            <Button key={`project:mission:${c.value}`} plain dimColor label={c.label} onPress={() => void writeMission($, p, c.value)} />
          ),
        )}
      </Box>
    )
    return section('project', 'Ce projet', `${p.name} · tout de suite · .claude/roadmap.json`, [
      line('project:mission', 'project-row:mission', 'Mission de la fiche', choice, {
        text: "Le cadre Mission de la fiche de tâche. Phrase : le libellé entier, coupé quand il est long. Puces : le premier segment du libellé (jusqu'au premier « ; ») en mission, chaque segment suivant en puce, la date de sa parenthèse finale à droite.",
        meta: `Par défaut : Phrase · Prend effet : tout de suite, dans ce projet · Écrit dans ${p.path} (clé mission), à committer si le projet est un dépôt git`,
      }),
      projectNote !== '' && <Box key="project-note" paddingX={SPACE.indent}>{caption(projectNote, palette.lateOn)}</Box>,
    ])
  }

  const sections: RenderElement[] = []
  for (const s of SETTINGS_SECTIONS) {
    if (s.prefs) {
      sections.push(
        section(
          s.id,
          s.title,
          sessionScope,
          [
            ...(error !== undefined
              ? [
                  <Box key="prefs-error" flexDirection="column" paddingX={SPACE.indent}>
                    <Text color={palette.lateOn} wrap="wrap">{`Le fichier ${SESSION_PREFS_FILE} est illisible : ${error}`}</Text>
                    {caption("Rien ne s'écrit tant qu'il l'est : la skill reglages-session le répare, en gardant ses valeurs.")}
                  </Box>,
                ]
              : s.prefs.map(prefRow)),
            prefsNote !== '' && <Box key="prefs-note" paddingX={SPACE.indent}>{caption(prefsNote, palette.lateOn)}</Box>,
          ],
          sections.length === 0,
        ),
      )
      // #278 : juste après « Claude et toi », les réglages de `.claude/roadmap.json` du projet.
      if (project) sections.push(projectSection(project))
      continue
    }
    // Une section sans aucune de ses options listées ne se dessine pas.
    const rows = (s.options ?? []).flatMap(known => {
      const o = options.find(option => option.field === known.field)
      return o ? [optionRow(o, known)] : []
    })
    if (rows.length > 0) sections.push(section(s.id, s.title, OPTIONS_SCOPE, rows, sections.length === 0))
  }
  // Une option qu'aucune section ne range encore (ajoutée au plugin après le volet) : dans « Autres ».
  const ranged = new Set(SETTINGS_SECTIONS.flatMap(s => (s.options ?? []).map(o => o.field)))
  const others = options.filter(o => !ranged.has(o.field)).sort((a, b) => KIND_ORDER[a.row.kind] - KIND_ORDER[b.row.kind])
  if (others.length > 0) sections.push(section('other', 'Autres', OPTIONS_SCOPE, others.map(o => optionRow(o))))

  return (
    <Box flexDirection="column" gap={SPACE.section} paddingX={SPACE.indent} paddingTop="sm" paddingBottom="md">
      {sections}
      {options.length === 0 && (
        <Box key="options-missing" paddingX={SPACE.indent}>
          {caption('Options du panneau introuvables : le menu des plugins de Claude Code les change.')}
        </Box>
      )}
    </Box>
  )
}
