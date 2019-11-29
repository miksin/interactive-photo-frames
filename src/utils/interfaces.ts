import FrameModel from '../models/Frame'
import { corners } from './constants'

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

export interface IMouseWrapperInput {
  event?: number,
  pos?: IPosition,
  offset?: IPosition
}

export interface IQuadrants {
  [corners.Left]: IPosition,
  [corners.LeftTop]: IPosition,
  [corners.Top]: IPosition,
  [corners.RightTop]: IPosition,
  [corners.Right]: IPosition,
  [corners.RightBottom]: IPosition,
  [corners.Bottom]: IPosition,
  [corners.LeftBottom]: IPosition
}

export interface IDiagonals {
  [corners.LeftTop]: IPosition,
  [corners.RightBottom]: IPosition
}
