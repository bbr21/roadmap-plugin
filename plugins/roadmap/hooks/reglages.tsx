import { atom, read, update } from 'claude-code'
import type { ConfigKind, ConfigRow, ConfigValue, EngineInterface, RenderElement, RenderInput } from 'claude-code'

import type { Palette } from './icons'
import { SESSION_PREFS_FILE, SESSION_PREF_INFO, sessionPrefsView, setSessionPref, type PrefKey, type PrefRow } from './parse'

// Le volet Réglages (#81, Bertrand, 2026-10-28) : chaque réglage de session et du panneau, son état
// et une ligne d'explication, changé d'un clic, sans retenir de phrase. Il existe dans tout projet,
// roadmap ou non : `/reglages`, le bouton du panneau Roadmap et la skill reglages-session l'ouvrent.

export const SETTINGS_PANE = 'reglages'

/** Monte après chaque écriture du fichier (par le volet ou ailleurs) : le volet se redessine. */
export const prefsStampAtom = atom({ plugin: 'roadmap', key: 'prefsStamp' } as const, 0)

/** Ce qu'a donné la dernière écriture quand elle a échoué ; vide sinon. */
let prefsNote = ''

/** Les écritures, l'une après l'autre : deux clics rapprochés ne s'écrasent pas. */
let writing: Promise<void> = Promise.resolve()

/** Le suivi du fichier tant que le volet est ouvert, et la date de modification vue en dernier. */
let watchTimer: { cancel: () => void } | undefined
let watchedMtime: number | undefined

/** Toutes les 2 secondes, tant que le volet est ouvert. */
const WATCH_MS = 2_000

/** Le fichier des réglages de session et le dossier personnel ; rien sans `HOME`. */
export async function prefsFile($: EngineInterface): Promise<{ path: string; home: string } | undefined> {
  const home = (await $.env.get('HOME')) ?? ''
  if (home === '') return undefined
  return { path: `${home.replace(/\/+$/, '')}/.claude/reglages-session.json`, home }
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
 * depuis le dessin), réécrit par `setSessionPref`. Illisible, il n'est pas touché.
 */
function writePref($: EngineInterface, key: PrefKey, value: boolean): Promise<void> {
  writing = writing.then(async () => {
    try {
      const file = await prefsFile($)
      if (!file) throw new Error('dossier personnel inconnu')
      const next = setSessionPref(await prefsText($, file.path), key, value)
      await $.fs.write(file.path, next)
      prefsNote = ''
    } catch (err) {
      prefsNote = `Rien d'écrit : ${err instanceof Error ? err.message : String(err)}`
    }
    await update($, prefsStampAtom, v => v + 1)
  })
  return writing
}

/** Le dernier refus d'une option du panneau, par clé de la ligne. */
const optionNotes = new Map<string, string>()

/**
 * Un clic sur une option du panneau : changée comme dans le menu de configuration de Claude Code.
 * Le changement recharge le plugin (ses options sont fixes pour un chargement) ; un refus se garde
 * pour s'afficher sous la ligne.
 */
function setOption($: EngineInterface, key: string, value: ConfigValue): Promise<void> {
  return (async () => {
    try {
      const { deny } = await $.config.set({ key, value })
      if (deny !== undefined) optionNotes.set(key, `Refusé : ${deny}`)
      else optionNotes.delete(key)
    } catch (err) {
      optionNotes.set(key, `Refusé : ${err instanceof Error ? err.message : String(err)}`)
    }
    await update($, prefsStampAtom, v => v + 1)
  })()
}

/**
 * Les options du plugin, telles que le menu de configuration les montre ; aucune si la liste échoue.
 * Reconnues à leur clé, `<plugin>.<champ>` : dans l'app, leur fournisseur s'écrit `roadmap@inline`,
 * pas `roadmap` (sonde de #91, 2026-10-29), et le volet n'en trouvait aucune.
 */
async function pluginOptions($: EngineInterface): Promise<ConfigRow[]> {
  try {
    return (await $.config.list()).filter(row => row.provider.plugin !== 'engine' && row.key.startsWith(`${$.plugin.name}.`))
  } catch {
    return []
  }
}

/** L'ordre des options du panneau dans le volet (#91) : oui/non, puis listes, puis textes. */
const KIND_ORDER: Record<ConfigKind, number> = { boolean: 0, choice: 1, text: 2, number: 2 }

/**
 * Le volet, maquette C choisie par Bertrand (#91, 2026-10-29) : les réglages de session, puis les
 * options du panneau, chacun avec On | Off côte à côte, une liste ou un champ ; l'explication d'une
 * ligne s'affiche quand le pointeur la survole.
 */
export async function drawSettings($: EngineInterface, e: RenderInput<'Pane'>, palette: Palette): Promise<RenderElement> {
  const resolved = $.ui.resolve(e)
  const { Box, Text, Button } = resolved
  // L'application mobile ne dessine pas encore de choix ni de champ (sa table n'a ni Select ni
  // Input) : un bouton passe alors à la valeur suivante, et un texte se montre seulement. Sans
  // pointeur, rien ne se survole : les explications y restent affichées.
  const Select = e.surface !== 'mobile' && 'Select' in resolved ? resolved.Select : undefined
  const Input = e.surface !== 'mobile' && 'Input' in resolved ? resolved.Input : undefined
  const hover = e.surface !== 'mobile'
  await read($, prefsStampAtom)
  const options = [...(await pluginOptions($))].sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind])

  const file = await prefsFile($)
  let text: string | undefined
  let readError: string | undefined
  try {
    text = file ? await prefsText($, file.path) : undefined
  } catch (err) {
    readError = err instanceof Error ? err.message : String(err)
  }
  const view = sessionPrefsView(text)
  const error = readError ?? view.error

  /** On | Off côte à côte : le choix actif en bouton principal ; un clic sur lui n'écrit rien. */
  const onOff = (key: string, value: boolean, set: (to: boolean) => void) => (
    <Box flexDirection="row" gap="xs" flexShrink={0}>
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

  /** Une ligne : le nom à gauche, le contrôle à droite, puis l'explication, cachée hors survol. */
  const line = (key: string, name: string, help: string | undefined, control: RenderElement | false, below: (RenderElement | false)[] = []) => (
    <Box key={key} flexDirection="column" paddingX={1}>
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" gap={1}>
        <Text weight="semibold">{name}</Text>
        {control}
      </Box>
      {help !== undefined &&
        (hover ? (
          <Box display="none" hover={{ display: 'flex' }}>
            {caption(help)}
          </Box>
        ) : (
          caption(help)
        ))}
      {below}
    </Box>
  )

  const group = (title: string, body: RenderElement) => (
    <Box flexDirection="column" gap="sm">
      <Box paddingX={1}>
        <Text size="footnote" weight="semibold" color={palette.text2}>
          {title}
        </Text>
      </Box>
      {body}
    </Box>
  )

  const prefRow = (r: PrefRow) => {
    const info = SESSION_PREF_INFO.find(i => i.key === r.key)!
    return line(`pref-row:${r.key}`, info.name, info.help, onOff(`pref:${r.key}`, r.value, to => void writePref($, r.key, to)))
  }

  const control = (o: ConfigRow, field: string) => {
    const key = `opt:${field}`
    if (o.isLocked) return <Text size="caption" color={palette.text2}>Fixé par ton organisation</Text>
    if (o.kind === 'boolean') return onOff(key, o.value === true, to => void setOption($, o.key, to))
    if (o.kind === 'choice' && o.options && o.options.length > 0) {
      const values = o.options
      const current = String(o.value)
      if (Select) {
        return (
          <Select
            key={key}
            options={values.map(value => ({ value }))}
            value={current}
            onSelect={(value: string) => void setOption($, o.key, value)}
          />
        )
      }
      const next = values[(values.indexOf(current) + 1) % values.length] ?? values[0]!
      return <Button key={key} plain label={current} onPress={() => void setOption($, o.key, next)} />
    }
    return <Text mono size="caption">{String(o.value)}</Text>
  }

  const optionRow = (o: ConfigRow) => {
    const field = o.key.slice(o.key.indexOf('.') + 1)
    // Un texte se tape dans un champ à part, sous son titre : il ne tient pas à côté.
    const typed = (o.kind === 'text' || o.kind === 'number') && !o.isLocked && Input
    return line(
      `opt-row:${field}`,
      o.label,
      o.description,
      !typed && <Box flexShrink={0}>{control(o, field)}</Box>,
      [
        typed && (
          <Input
            key={`opt:${field}`}
            value={String(o.value)}
            submitLabel="enregistrer"
            onSubmit={(value: string) => void setOption($, o.key, o.kind === 'number' ? Number(value) : value)}
          />
        ),
        optionNotes.has(o.key) && caption(optionNotes.get(o.key)!, palette.lateOn),
      ],
    )
  }

  const footer = `${hover ? 'Survole une ligne pour lire son explication. ' : ''}Session : vaut pour les sessions ouvertes ensuite, ou après /clear. Panneau : tout de suite.`

  return (
    <Box flexDirection="column" gap="md" paddingX={1} paddingTop="sm">
      {group(
        'Session',
        <Box flexDirection="column" gap="sm">
          {error !== undefined ? (
            <Box flexDirection="column" paddingX={1}>
              <Text color={palette.lateOn} wrap="wrap">{`Le fichier ${SESSION_PREFS_FILE} est illisible : ${error}`}</Text>
              {caption("Rien ne s'écrit tant qu'il l'est : la skill reglages-session le répare, en gardant ses valeurs.")}
            </Box>
          ) : (
            view.rows.map(prefRow)
          )}
          {prefsNote !== '' && <Box paddingX={1}>{caption(prefsNote, palette.lateOn)}</Box>}
        </Box>,
      )}
      {group(
        'Panneau Roadmap',
        <Box flexDirection="column" gap="sm">
          {options.length === 0 ? (
            <Box paddingX={1}>{caption('Options du panneau introuvables : le menu des plugins de Claude Code les change.')}</Box>
          ) : (
            options.map(optionRow)
          )}
        </Box>,
      )}
      <Box paddingX={1}>{caption(footer, palette.text3)}</Box>
    </Box>
  )
}
