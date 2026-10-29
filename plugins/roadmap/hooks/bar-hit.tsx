// La zone de clic de la barre de composition. Un Svg ne reçoit pas de clic et un bouton ne porte que
// du texte : une région Client transparente, posée sur la barre, lit le clic et dit au module de
// hooks quel segment il touche. Elle ne dessine rien.
//
// L'écouteur s'inscrit une seule fois par instance et lit les props les plus récentes : le
// réinscrire à chaque appel inonde la page de messages, et l'app démonte alors la région.
import type { ClientModule } from 'claude-code'

export type BarHitProps = {
  /** Bord droit de chaque segment, en part de la largeur (0 à 1), dans l'ordre de la barre. */
  cuts: number[]
  /** Le nom de chaque segment : un axe, ou `#faites`. */
  names: string[]
}

/** Le segment sous une abscisse, en part de la largeur ; le dernier au-delà du dernier bord. */
export function segmentAt(props: BarHitProps, at: number): string | undefined {
  const i = props.cuts.findIndex(cut => at < cut)
  return props.names[i < 0 ? props.names.length - 1 : i]
}

type Ref = { props: BarHitProps }

// Le signal « prêt », une fois par chargement du cadre (voir press-hit.tsx).
let readySent = false

const BarHit: ClientModule<BarHitProps, Ref> = (props, surface) => {
  if (!readySent) {
    readySent = true
    surface.post({ ready: 'bar-hit' })
  }
  const ref = surface.state ?? { props }
  ref.props = props
  if (surface.state === undefined) {
    surface.setState(ref)
    surface.onPointer(event => {
      if (event.type !== 'down' || (event.button !== undefined && event.button !== 'left') || surface.columns <= 0) return
      const name = segmentAt(ref.props, (event.fine?.x ?? event.x + 0.5) / surface.columns)
      if (name !== undefined) surface.post({ segment: name })
    })
  }
  const { Box } = surface.elements
  return <Box width="100%" height="100%" />
}

export default BarHit
