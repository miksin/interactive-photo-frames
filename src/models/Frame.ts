import uuid from 'uuid/v4'
import {
  IPosition,
  IFrameInput,
  IQuadrants
} from '../models/interfaces'
import Size from './Size'
import Position from './Position'
import { Diagonals } from './types'
import { framePadding } from '../utils/constants'
import { corners } from '../models/enums'

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
    this.offset = new Position()

    if (input) {
      this.update(input)
    }
  }

  get outerSize (): Size {
    return this.size.clone().expand(this.padding)
  }

  set outerSize (val: Size) {
    this.size = val.clone().expand(-this.padding)
  }

  get innerSize (): Size {
    return this.naturalSize.clone().scale(this.scale)
  }

  set innerSize (val: Size) {
    this.scale = val.width / this.naturalSize.width
  }

  get aspectRatio (): number {
    return this.naturalSize.aspectRatio
  }

  set aspectRatio (val: number) {
    this.naturalSize.height = this.naturalSize.width / val
  }

  get outerPosition (): Position {
    return this.position.clone().move(-this.padding, -this.padding)
  }

  set outerPosition (val: Position) {
    this.position.moveTo(val.clone().move(this.padding, this.padding))
  }

  get cornerPositions (): IQuadrants {
    const diagonal = this.diagonals[1]

    return {
      [corners.Left]: this.position.clone(),
      [corners.LeftTop]: this.position.clone(),
      [corners.Top]: this.position.clone(),
      [corners.RightTop]: new Position({
        x: diagonal.x,
        y: this.position.y
      }),
      [corners.Right]: diagonal,
      [corners.RightBottom]: diagonal,
      [corners.Bottom]: diagonal,
      [corners.LeftBottom]: new Position({
        x: this.position.x,
        y: diagonal.y
      })
    }
  }

  get diagonals (): Diagonals {
    const pos = this.outerPosition
    const size = this.outerSize
    return [
      pos.clone(),
      pos.clone().move(size.width, size.height)
    ]
  }

  set diagonals (val: Diagonals) {
    this.outerPosition = val[0]
    this.outerSize = new Size({
      width: val[1].x - val[0].x,
      height: val[1].y - val[0].y
    })
  }

  update (input: IFrameInput): void {
    Object.assign(this, input)
  }

  move (pos: IPosition): void {
    this.position.x = pos.x
    this.position.y = pos.y
  }
}
