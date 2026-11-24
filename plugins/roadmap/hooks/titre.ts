// Le titre d'une carte de session (#436, #643) : la marque de lieu d'une tâche de code, la forme à axe d'une tâche
// `projet`. Fonctions pures, sans moteur : `register.tsx` les appelle (sorties de lui pour sa limite de taille).
import { clientTitle, sessionName, sessionTitleId, sessionTitleKind, targetTitle, taskWork, type Source, type Task, type Travail } from './parse'

/** #436 : la carte native avec sa cible au bout du titre (« · cloud » pour `target: 'cloud'`, « · local » sinon) ; aucune pour une tâche `projet` (#643). */
export function withTargetTitle(card: Record<string, unknown>, travail?: Travail): Record<string, unknown> {
  return typeof card.title === 'string' ? { ...card, title: targetTitle(card.title, card.target === 'cloud' ? 'cloud' : 'mac', travail) } : card
}

/**
 * #643 : la carte d'une tâche `projet` porte le titre « <axe> #N · nom », sans marque, même écrite « #N · nom » par
 * Claude ; sa cible reste dans `card.target` (le contrôle #465 la lit là). Projet de code, tâche absente ou close : rien ne change.
 */
export function clientCardOf(card: Record<string, unknown>, source: Source | undefined, open: readonly Task[] | undefined): { card: Record<string, unknown>; travail?: Travail } {
  const id = typeof card.title === 'string' ? sessionTitleId(card.title) : undefined
  const task = id === undefined || !source || !open ? undefined : open.find(t => t.id === id && !t.done)
  if (!task || !source || taskWork(source, task) !== 'projet') return { card }
  return { card: { ...card, title: clientTitle(card.title as string, task, 'projet') }, travail: 'projet' }
}

/** #643 : deux titres de la même carte, avec ou sans l'axe devant « #N · » (une entrée en file d'avant garde le titre d'avant). */
export function sameCardTitle(a: string, b: string): boolean {
  if (a === b) return true
  const id = sessionTitleId(a)
  return id !== undefined && id === sessionTitleId(b) && sessionName(a) === sessionName(b) && sessionTitleKind(a) === sessionTitleKind(b)
}
