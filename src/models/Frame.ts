import uuid from 'uuid/v4'
import { IFrameInput } from '../utils/interfaces'

export default class Frame {
  id: string
  name: string

  constructor (input: IFrameInput) {
    this.id = uuid()
    this.name = input.name || 'new frame'
  }

  update (input: IFrameInput): void {
    Object.assign(this, input)
  }
}
