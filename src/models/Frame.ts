import uuid from 'uuid/v4'
import {
  IFrameInput,
  IQuadrants,
  IDiagonals
} from '../utils/interfaces'
import Size from './Size'
import Position from './Position'
import { Diagonals } from './types'
import { framePadding, corners } from '../utils/constants'

export default class Frame {
  id: string
  name: string
  url?: string
  display: boolean
  mirror: boolean
  position: Position
  size: Size
  naturalSize: Size
  padding: number
  scale: number // scaling relative to naturalSize
  offset: Position // position relative to position

  constructor (input?: IFrameInput) {
    this.id = uuid()
    this.name = 'new frame'
    this.url = ''
    this.position = new Position()
    this.size = new Size()
    this.naturalSize = new Size()
    this.display = true
    this.mirror = false
    this.padding = framePadding
    this.scale = 1
    this.offset = new Size()

    if (input) {
      this.update(input)
    }
  }

  get outerSize (): Size {
    return this.size.clone().expand(this.padding)
  }

  get innerSize (): ISize {
    return this.size.clone().scale(this.scale)
  }

  get aspectRatio (): number {
    return this.naturalSize.aspectRatio
  }

  get outerPosition (): Position {
    return this.position.clone().move(-this.padding, -this.padding)
  }

  get cornerPositions (): IQuadrants {
    const diagonal = {
      x: this.position.x + this.size.width + framePadding * 2,
      y: this.position.y + this.size.height + framePadding * 2
    }

    return {
      [corners.Left]: this.position,
      [corners.LeftTop]: this.position,
      [corners.Top]: this.position,
      [corners.RightTop]: {
        x: diagonal.x,
        y: this.position.y
      },
      [corners.Right]: diagonal,
      [corners.RightBottom]: diagonal,
      [corners.Bottom]: diagonal,
      [corners.LeftBottom]: {
        x: this.position.x,
        y: diagonal.y
      }
    }
  }

  get diagonals (): IDiagonals {
    return {
      [corners.LeftTop]: this.position,
      [corners.RightBottom]: {
        x: this.position.x + this.size.width + framePadding * 2,
        y: this.position.y + this.size.height + framePadding * 2
      }
    }
  }

  set diagonals (val: IDiagonals) {
    this.position = val[corners.LeftTop]
    this.size = {
      width: val[corners.RightBottom].x - val[corners.LeftTop].x - 2 * framePadding,
      height: val[corners.RightBottom].y - val[corners.LeftTop].y - 2 * framePadding
    }
  }

  update (input: IFrameInput): void {
    Object.assign(this, input)
  }

  move (pos: IPosition): void {
    this.position.x = pos.x
    this.position.y = pos.y
  }
}
