export default class Position {
  x: number
  y: number

  constructor (input?: { x: number, y: number }) {
    this.x = 0
    this.y = 0

    if (input) {
      Object.assign(this, input)
    }
  }

  toString (): string {
    return `(${this.x}, ${this.y})`
  }

  clone (): Position {
    return Object.assign(new Position(), this)
  }

  move (xOffset: number, yOffset: number): Position {
    this.x += xOffset
    this.y += yOffset
    return this
  }

  move (to: Position): Position {
    this.x = to.x
    this.y = to.y
    return this
  }
}
