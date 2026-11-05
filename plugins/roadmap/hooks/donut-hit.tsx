// La zone de clic du donut de la durée (#314, maquette A1). Un Svg ne reçoit pas de clic : une région Client
// transparente, posée sur le donut, lit la position fine du clic, en tire la part par son angle (`donutPartAt`)
// et la dit au module de hooks. Elle ne dessine rien.
//
// L'écouteur s'inscrit une seule fois par instance et lit les props les plus récentes (voir bar-hit.tsx).
import type { ClientModule } from 'claude-code'

import { donutPartAt } from './parse'

export type DonutHitProps = {
  /** La part de chaque arc, dans l'ordre du donut (sens horaire depuis midi). */
  shares: number[]
  /** Le préfixe du choix dans la vue (`duree:<tâche>:`) : le message porte le préfixe et le numéro de la part. */
  pick: string
}

type Ref = { props: DonutHitProps }

// Le signal « prêt », une fois par chargement du cadre (voir press-hit.tsx).
let readySent = false

const DonutHit: ClientModule<DonutHitProps, Ref> = (props, surface) => {
  if (!readySent) {
    readySent = true
    surface.post({ ready: 'donut-hit' })
  }
  const ref = surface.state ?? { props }
  ref.props = props
  if (surface.state === undefined) {
    surface.setState(ref)
    surface.onPointer(event => {
      if (event.type !== 'down' || (event.button !== undefined && event.button !== 'left') || surface.columns <= 0 || surface.rows <= 0) return
      const x = (event.fine?.x ?? event.x + 0.5) / surface.columns
      const y = (event.fine?.y ?? event.y + 0.5) / surface.rows
      const part = donutPartAt(ref.props.shares, x, y)
      if (part !== undefined) surface.post({ donut: part === 'center' ? ref.props.pick : `${ref.props.pick}${part}` })
    })
  }
  const { Box } = surface.elements
  return <Box width="100%" height="100%" />
}

export default DonutHit
