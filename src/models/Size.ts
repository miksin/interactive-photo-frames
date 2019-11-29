export default class Size {
  width: number
  height: number

  constructor (input?: { width: number, height: number }) {
    this.width = 0
    this.height = 0

    if (input) {
      Object.assign(this, input)
    }
  }

  toString (): string {
    return `Size: ${this.width} * ${this.height}`
  }

  clone (): Size {
    return Object.assign(new Size(), this)
  }

  get aspectRatio (): number {
    if (this.height === 0) return Infinity
    return this.width / this.height
  }

  get isPortrait (): boolean {
    return this.width <= this.height
  }

  get isLandscape (): boolean {
    return this.width >= this.height
  }

  scale (ratio: number): Size {
    this.width *= ratio
    this.height *= ratio
    return this
  }

  resize (size: Size): Size {
    this.width = size.width
    this.height = size.height
    return this
  }

  expand (pad: number): Size {
    this.width += 2 * pad
    this.height += 2 * pad
    return this
  }
}
