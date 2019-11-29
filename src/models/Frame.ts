import uuid from 'uuid/v4'
import {
  IFrameInput,
  IPosition,
  ISize,
  IQuadrants,
  IDiagonals
} from '../utils/interfaces'
import { framePadding, corners } from '../utils/constants'

export default class Frame {
  id: string
  name: string
  url?: string
  display: boolean
  position: IPosition
  size: ISize
  naturalSize: ISize

  constructor (input: IFrameInput) {
    this.id = uuid()
    this.name = input.name || 'new frame'
    this.url = input.url
    this.position = input.position || { x: 0, y: 0 }
    this.size = input.size || { width: 100, height: 100 }
    this.naturalSize = input.naturalSize || { width: 100, height: 100 }
    this.display = true
  }

  get aspectRatio (): number {
    const { width, height } = this.naturalSize
    if (height > 0) {
      return width / height
    }
    return 0.0
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
