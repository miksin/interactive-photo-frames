import FrameModel from '../models/Frame'

export interface IFrameInput {
  name?: string,
  url?: string,
  position?: IPosition,
  size?: ISize
  naturalSize?: ISize
}

export interface ISize {
  width: number,
  height: number
}

export interface IPosition {
  x: number,
  y: number
}

export interface IMenuItem {
  key: string,
  name: string
}

export interface IMenuInfo {
  target: FrameModel | null,
  items: IMenuItem[],
  pos: IPosition
}
