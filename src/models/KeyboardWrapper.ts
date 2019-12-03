import { KeyCodes } from './enums'

export default class KeyboardWrapper {
  actives: number[]

  constructor () {
    this.reset()
  }

  reset () {
    this.actives = []
  }

  activate (code: number) {
    if (!this.actives.includes(code)) {
      this.actives.push(code)
    }
  }

  deactivate (code: number) {
    const index = this.actives.findIndex(n => n === code)
    if (index !== -1) {
      this.actives.splice(index, 1)
    }
  }

  get Ctrl (): boolean {
    return this.actives.includes(KeyCodes.Ctrl)
  }

  get Alt (): boolean {
    return this.actives.includes(KeyCodes.Alt)
  }

  get Shift (): boolean {
    return this.actives.includes(KeyCodes.Shift)
  }

  get Enter (): boolean {
    return this.actives.includes(KeyCodes.Enter)
  }

  get Esc (): boolean {
    return this.actives.includes(KeyCodes.Esc)
  }
}
