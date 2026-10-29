// La zone de clic d'un bouton dessiné. Un bouton de l'app ne porte que du texte et ne s'étire pas :
// les boutons du détail se dessinent en Box et Svg, et cette région Client transparente, posée
// dessus, dit au module de hooks lequel a été cliqué. Elle ne dessine rien.
//
// L'écouteur s'inscrit une seule fois par instance : chaque appel de la fonction (nouvelles props,
// redessin) en réinscrivait un, et l'app démonte les régions qui inondent la page de messages
// (« flooded the page with messages », 2026-10-22).
import type { ClientModule } from 'claude-code'

export type PressHitProps = {
  /** Le bouton, tel que le module de hooks le connaît (`launch`, `open-line`…). */
  id: string
}

type Ref = { props: PressHitProps; down: boolean }

// Le signal « prêt » : posté une fois par chargement du cadre, au premier appel, et partagé par
// toutes les instances de ce cadre (un message par instance inonderait la page). Le module de
// hooks relance les zones quand il ne l'a pas reçu (cadre jamais chargé, 2026-10-23).
let readySent = false

const PressHit: ClientModule<PressHitProps, Ref> = (props, surface) => {
  if (!readySent) {
    readySent = true
    surface.post({ ready: 'press-hit' })
  }
  const ref = surface.state ?? { props, down: false }
  ref.props = props
  if (surface.state === undefined) {
    surface.setState(ref)
    // Le clic part à l'appui ; si l'appui n'est pas arrivé (premier clic sur une région qui vient
    // d'apparaître, 2026-10-22), il part au relâchement. Jamais les deux pour un même clic.
    surface.onPointer(event => {
      if (event.button !== undefined && event.button !== 'left') return
      if (event.type === 'down') {
        ref.down = true
        surface.post({ press: ref.props.id })
      } else if (event.type === 'up') {
        if (!ref.down) surface.post({ press: ref.props.id })
        ref.down = false
      }
    })
  }
  const { Box } = surface.elements
  return <Box width="100%" height="100%" />
}

export default PressHit
