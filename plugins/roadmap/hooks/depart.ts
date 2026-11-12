// Le départ au lieu de la reco (#465, demande de BBR du 2026-11-11) : la carte que Maestro pose de lui-même part au lieu
// que dit la reco, cloud ou Mac ; le lieu que BBR choisit dans le panneau l'emporte (#479). Fonctions pures, sans
// moteur : `register.tsx` les appelle.

/** Le lieu d'une session : le cloud (une VM claude.ai) ou le Mac. */
export type Place = 'cloud' | 'mac'

/** L'outil de l'app qui retire une carte « New session » encore en attente de Start (#465). */
export const DISMISS_TASK_TOOL = 'mcp__ccd_session__dismiss_task'

/** L'attente bornée d'une carte posée par le panneau : au-delà, rien n'est parti et la fiche le dit (#465). */
export const CARD_DEADLINE_MS = 30_000

/** La note d'une carte à laquelle l'app n'a pas répondu dans `CARD_DEADLINE_MS`. */
export const CARD_LATE_WHY = `l'app n'a pas répondu en ${CARD_DEADLINE_MS / 1000} s ; rien n'est parti, relance d'un clic`

/** Le lieu d'une carte `start_session` : `target: "cloud"` en cloud, toute autre carte en local. */
export function cardTargetOf(card: Record<string, unknown>): Place {
  return card.target === 'cloud' ? 'cloud' : 'mac'
}

/**
 * #479 : le lieu que la personne a choisi dans le panneau, lu dans le brief de la carte : la ligne « Cible : en local,
 * choisi dans le panneau … » (ou « le cloud ») ; « le Mac » d'une carte d'avant (#509) se lit encore.
 * Le panneau l'écrit (`withTargetNote`) quand le ▶ contredit la reco et passe par Claude. Seule une ligne entière qui commence ainsi compte ; « comme recommandé » ou rien : `undefined`.
 */
export function panelChoiceIn(prompt: unknown): Place | undefined {
  if (typeof prompt !== 'string') return undefined
  const m = /^Cible : (?:le (Mac|cloud)|(en local)), choisi dans le panneau\b/m.exec(prompt)
  return m ? (m[1] === 'cloud' ? 'cloud' : 'mac') : undefined
}

/**
 * Le refus d'une carte dont le lieu contredit la reco de sa ligne #N, avec l'appel juste : `target`, titre de la ligne
 * (sans la marque de cible, que le hook ajoute), et pour le cloud la branche et le brief de `brief_cloud.py`. Même lieu,
 * ou lieu choisi dans le panneau (`chosen`, #479) : `undefined`. Seule la carte que Maestro pose de lui-même suit la reco ;
 * le lieu se change encore au Start de la carte, par la personne.
 */
export function recoTargetRefusal(o: { id: string; cardTarget: Place; reco: Place; why: string; title: string; branch: string; chosen?: Place }): string | undefined {
  if (o.cardTarget === o.reco || o.chosen === o.cardTarget) return undefined
  const why = o.why.trim() ? ` (${o.why.trim()})` : ''
  const head = `Carte refusée (#465) : la reco de #${o.id} dit ${o.reco === 'cloud' ? 'cloud' : 'local'}${why}, et une carte que tu poses de toi-même part au lieu de la reco (seul un choix fait dans le panneau, que son brief dit, l'emporte).`
  if (o.reco === 'cloud') {
    return `${head} Repose-la avec start_session, target: "cloud", le titre « ${o.title} » et pour prompt la sortie de brief_cloud.py <dossier principal> ${o.id} --branche ${o.branch} (reco_cloud.py <dossier principal> ${o.id} --carte donne la même carte). La personne peut encore choisir le local au Start de la carte.`
  }
  return `${head} Repose-la sans target, en local, avec le titre « ${o.title} » et le brief d'une session du Mac. La personne peut encore choisir le cloud au Start de la carte.`
}

/**
 * L'identifiant de la carte posée, lu dans la réponse de l'app : `task_id` ou `proposal_id` (en texte ou en JSON), sinon
 * un `task_…` nu, la forme que prend `dismiss_task` ; absent : `undefined`.
 */
export function proposalIdIn(text: string | undefined): string | undefined {
  if (!text) return undefined
  const named = /\b(?:task|proposal)_?id\b["']?\s*[:=]\s*["']?([A-Za-z0-9_.:-]+)/i.exec(text)
  return named?.[1] ?? /\btask_[A-Za-z0-9]+\b/.exec(text)?.[0]
}

/** L'appel qui retire la carte `id` encore en attente de Start (`dismiss_task`, son `task_id`). */
export function dismissCall(id: string, target: Place): { tool: string; task_id: string; reason: string } {
  return { tool: DISMISS_TASK_TOOL, task_id: id, reason: `remplacée par un départ ${target === 'cloud' ? 'en cloud' : 'en local'} (#465)` }
}
