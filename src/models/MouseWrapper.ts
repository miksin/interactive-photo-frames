import { IPosition, ISize, IMouseWrapperInput, IQuadrants, IDiagonals } from '../utils/interfaces'
import { mouseEvents, corners, quadrants } from '../utils/constants'

export default class MouseWrapper {
  event: number
  pos: IPosition // absolute position of the mouse
  basis: IPosition // for [position]: relative position
  trackCorner: corners // for [position]: relative position

  constructor () {
    this.reset()
  }

  reset () {
    this.event = mouseEvents.None
    this.pos = { x: 0, y: 0 }
    this.basis = { x: 0, y: 0 }
    this.trackCorner = corners.LeftTop
  }

  update (input: IMouseWrapperInput) {
    Object.assign(this, input)
  }

  // the mouse position relate to basis and trackCorner
  get position (): IPosition {
    return {
      x: (this.pos.x - this.basis.x) * quadrants[this.trackCorner].x,
      y: (this.pos.y - this.basis.y) * quadrants[this.trackCorner].y
    }
  }

  get diagonals (): IDiagonals {
    switch (this.trackCorner) {
      case corners.LeftTop:
        return {
          [corners.LeftTop]: this.basis,
          [corners.RightBottom]: this.pos
        }
      case corners.Left:
      case corners.Top:
        return {
          [corners.LeftTop]: this.basis,
          [corners.RightBottom]: this.pos
        }
      case corners.RightBottom:
      case corners.Right:
      case corners.Bottom:
        return {
          [corners.LeftTop]: this.pos,
          [corners.RightBottom]: this.basis
        }
      case corners.LeftBottom:
        return {
          [corners.LeftTop]: {
            x: this.basis.x,
            y: this.pos.y
          },
          [corners.RightBottom]: {
            x: this.pos.x,
            y: this.basis.y
          }
        }
      case corners.RightTop:
        return {
          [corners.LeftTop]: {
            x: this.pos.x,
            y: this.basis.y
          },
          [corners.RightBottom]: {
            x: this.basis.x,
            y: this.pos.y
          }
        }
      default:
        return {
          [corners.LeftTop]: this.basis,
          [corners.RightBottom]: this.pos
        }
    }
  }
}
