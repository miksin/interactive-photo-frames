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
  name: string,
  icon?: string,
  disable: boolean
}

export interface IMenuInfo {
  target: FrameModel | null,
  items: IMenuItem[],
  pos: IPosition
}

export interface IMouseWrapper {
  event: number,
  pos: IPosition
}
