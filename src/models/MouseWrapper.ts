import Position from './Position'
import { Diagonals } from './types'
import { IPosition, ISize, IMouseWrapperInput, IQuadrants, IDiagonals } from '../utils/interfaces'
import { mouseEvents, corners, quadrants } from '../utils/constants'

export default class MouseWrapper {
  event: number
  pos: Position // absolute position of the mouse
  basis: Position // for [position]: relative position
  trackCorner: corners // for [position]: relative position

  constructor () {
    this.reset()
  }

  reset () {
    this.event = mouseEvents.None
    this.pos = new Position({ x: 0, y: 0 })
    this.basis = new Position({ x: 0, y: 0 })
    this.trackCorner = corners.LeftTop
  }

  update (input: IMouseWrapperInput) {
    Object.assign(this, input)
  }

  // the mouse position relate to basis and trackCorner
  get position (): Position {
    return new Position({
      x: (this.pos.x - this.basis.x) * quadrants[this.trackCorner].x,
      y: (this.pos.y - this.basis.y) * quadrants[this.trackCorner].y
    })
  }

  get diagonals (): Diagonals {
    switch (this.trackCorner) {
      case corners.LeftTop:
      case corners.Left:
      case corners.Top:
        return [
          this.basis.clone(),
          this.pos.clone()
        ]
      case corners.RightBottom:
      case corners.Right:
      case corners.Bottom:
        return [
          this.pos.clone(),
          this.basis.clone()
        ]
      case corners.LeftBottom:
        return [
          new Position({
            x: this.basis.x,
            y: this.pos.y
          }),
          new Position({
            x: this.pos.x,
            y: this.basis.y
          })
        ]
      case corners.RightTop:
        return [
          new Position({
            x: this.pos.x,
            y: this.basis.y
          }),
          new Position({
            x: this.basis.x,
            y: this.pos.y
          })
        ]
      default:
        return [
          this.basis.clone(),
          this.pos.clone()
        ]
    }
  }
}
