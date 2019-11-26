import uuid from 'uuid/v4'
import {
  IFrameInput,
  IPosition,
  ISize
} from '../utils/interfaces'

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

  update (input: IFrameInput): void {
    Object.assign(this, input)
  }

  move (pos: IPosition): void {
    this.position.x = pos.x
    this.position.y = pos.y
  }
}
