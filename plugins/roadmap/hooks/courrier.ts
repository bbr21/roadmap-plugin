// Le message perdu d'une session en pause (#675). Sous pression mémoire, l'app met en pause les sessions au
// repos (`governor_evict`) ; un message vers l'une d'elles la relance à froid (45 s à 5 min), et l'app peut le
// classer « undelivered » sans que le CLI le lise jamais (Splitmybill, 2026-11-27 02:22-02:24 : le gardien n'a rien
// reçu, son Maestro a fusionné lui-même). L'app dit alors « ne le renvoie pas » : elle ne sait pas s'il arrivera.
// Le plugin le sait : un message lu laisse son `message_id` comme `uuid` d'une ligne du transcript du
// destinataire. Fonctions pures, sans import : `socle.tsx` lit les fichiers, renvoie et prévient l'envoyeur.

/** Ce que suit l'envoyeur, par message classé « undelivered ». */
export type LostMail = {
  to: string
  title: string
  messageId: string
  body: string
  sentAt: number
  /** L'instant du renvoi, et l'identifiant du message renvoyé : jamais deux renvois. */
  resentAt?: number
  resentId?: string
  /** Les renvois refusés par l'outil d'envoi (F135), et l'instant du dernier : rien n'est parti. */
  refused?: number
  refusedAt?: number
}

/** Ce que le plugin a vu chez le destinataire. */
export type LostMailProbe = {
  /** Le transcript porte le message (ou son renvoi). */
  traced: boolean
  /** Un tour tourne chez lui : le message peut attendre dans sa file. */
  running: boolean
  /** Son transcript a bougé depuis l'envoi : son CLI est revenu à la vie. */
  wroteSince: boolean
}

export type LostMailStep = 'wait' | 'arrived' | 'resend' | 'lost'

/** Le délai avant tout renvoi : l'app remet encore des envois différés une à trois minutes après (« drained »). */
export const LOST_MAIL_GRACE_MS = 2 * 60_000
/** Sans trace 30 min après le renvoi : perdu. */
export const LOST_MAIL_AFTER_RESEND_MS = 30 * 60_000
/** Jamais revenue à la vie en deux heures : perdu, sans renvoi. */
export const LOST_MAIL_MAX_MS = 2 * 3_600_000
/** Le pas de la vérification, par message suivi. */
export const LOST_MAIL_EVERY_MS = 30_000
/** Un renvoi refusé se retente au plus toutes les 10 min (F135) : un refus du mode auto se répète au pas suivant. */
export const LOST_MAIL_REFUSED_EVERY_MS = 10 * 60_000
/** Trois renvois refusés : perdu, sans attendre les deux heures. */
export const LOST_MAIL_MAX_REFUSALS = 3
/** La clé du store : par session qui envoie, ses messages suivis. */
export const LOST_MAIL_KEY = 'lost-mail'

/** La réponse de l'outil d'envoi qui dit « undelivered » : son destinataire et son message ; sinon rien. */
export function undeliveredSend(text: string): { to: string; messageId: string } | undefined {
  const m = /\(delivery: undelivered; message_id: ([0-9a-f-]{36})\)/.exec(text)
  if (!m) return undefined
  const to = /\bsession (local_[0-9a-f-]{36})\b/.exec(text)
  return to ? { to: to[1], messageId: m[1] } : undefined
}

/** Le titre que l'app donne au destinataire, entre guillemets après son identifiant. */
export function undeliveredTitle(text: string, to: string): string {
  const m = new RegExp(`${to} \\(\\\\?"([^"\\\\]+)\\\\?"\\)`).exec(text)
  return m ? m[1] : ''
}

/** Le dossier où Claude Code range les transcripts d'un dossier de travail : chaque signe hors lettre et chiffre devient « - ». */
export function transcriptDirOf(home: string, cwd: string): string {
  return `${home.replace(/\/+$/, '')}/.claude/projects/${cwd.replace(/[^A-Za-z0-9]/g, '-')}`
}

/** Le transcript porte-t-il ce message ? Le CLI l'écrit sous son `message_id` comme `uuid`. */
export function transcriptHasMessage(text: string, messageId: string): boolean {
  return text.includes(`"uuid":"${messageId}"`)
}

/** Le pas suivant pour un message suivi. */
export function lostMailStep(mail: LostMail, probe: LostMailProbe, now: number): LostMailStep {
  if (probe.traced) return 'arrived'
  if (mail.resentAt !== undefined) return now - mail.resentAt >= LOST_MAIL_AFTER_RESEND_MS ? 'lost' : 'wait'
  if ((mail.refused ?? 0) >= LOST_MAIL_MAX_REFUSALS) return 'lost'
  if (now - mail.sentAt >= LOST_MAIL_MAX_MS) return 'lost'
  if (now - mail.sentAt < LOST_MAIL_GRACE_MS) return 'wait'
  if (mail.refusedAt !== undefined && now - mail.refusedAt < LOST_MAIL_REFUSED_EVERY_MS) return 'wait'
  return probe.wroteSince && !probe.running ? 'resend' : 'wait'
}

/** La vraie cause d'un « perdu » : renvoi lu nulle part, renvoi refusé, ou session restée en pause. */
function lostCause(mail: LostMail): string {
  if (mail.resentAt !== undefined) return ', renvoi compris'
  if ((mail.refused ?? 0) > 0) return `, et le renvoi refusé ${mail.refused} fois par l'outil d'envoi (rien n'est reparti)`
  return ", la session n'est pas revenue à la vie"
}

function who(mail: LostMail): string {
  return mail.title !== '' ? `« ${mail.title} » (${mail.to})` : mail.to
}

/**
 * Les textes : `track`, la note jointe à l'envoi refusé ; `resend` et `lost`, le réveil de l'envoyeur ; `body`,
 * le message renvoyé au destinataire. `someone` : la personne, par `person()` (aucun nom en dur, test_neutre).
 */
export function lostMailText(kind: 'track' | 'resend' | 'lost' | 'body', mail: LostMail, someone = "l'utilisateur"): string {
  switch (kind) {
    case 'track':
      return `Plugin roadmap (#675) : ce message à ${who(mail)} n'est pas confirmé (session sans doute en pause). Le plugin suit son transcript : s'il n'y laisse aucune trace, il le renvoie une fois quand la session est de nouveau vivante, et te le dit. Ne le renvoie pas toi-même, et ne fais pas son geste à sa place (une fusion qui revient au gardien attend).`
    case 'resend':
      return `Plugin roadmap (#675) : ton message à ${who(mail)} (${mail.messageId}) n'avait laissé aucune trace dans son transcript ; la session est de nouveau vivante, il lui est renvoyé une fois. Rien à faire de ton côté : sa réponse suivra, et le plugin te dira s'il se perd encore.`
    case 'lost':
      return `Plugin roadmap (#675) : ton message à ${who(mail)} (${mail.messageId}) est perdu : aucune trace dans son transcript${lostCause(mail)}. Relis l'état de la session (get_session), puis renvoie-le toi-même ou dis-le à ${someone} ; ne fusionne pas à la place du gardien.`
    case 'body':
      return `Renvoi du plugin roadmap (#675) : ce message d'une autre session n'a laissé aucune trace dans ton transcript (tu étais en pause). S'il t'est déjà arrivé, ignore ce double.\n\n${mail.body}`
  }
}
