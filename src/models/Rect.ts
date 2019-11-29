import Position from './Position'
import Size from './Size'
import { Origins } from './enums'

export default class Rect {
  size: Size
  position: Position // left-top position

  constructor (input?: { size?: Size, position?: Position }) {
    this.size = new Size()
    this.position = new Position()
    if (input) {
      this.update(input)
    }
  }

  update (input: { size?: Size, position?: Position }) {
    Object.assign(this, input)
  }

  toString (): string {
    return `Rect ${this.position} ${this.size}`
  }

  scale (ratio: number, origin: Origins): Rect {
    const newSize = this.size.clone().scale(ratio)
    const newPosition = this.position.clone()
    return this
  }
}
