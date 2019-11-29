import { IMenuItem, IQuadrants } from './interfaces'

export const framePadding = 6

export enum menuKeys {
  Edit = 'edit',
  Delete = 'delete',
  Top = 'top',
  Forward = 'forward',
  Backward = 'backward',
  Bottom = 'bottom'
}

export enum mouseEvents {
  None,
  DragFrameControlPanel,
  DragFrame,
  ResizeFrame
}

export enum corners {
  Left = 'left',
  LeftTop = 'left-top',
  Top = 'top',
  RightTop = 'right-top',
  Right = 'right',
  RightBottom = 'right-bottom',
  Bottom = 'bottom',
  LeftBottom = 'left-bottom'
}

export const cornerDiagonals = {
  [corners.Left]: corners.Right,
  [corners.LeftTop]: corners.RightBottom,
  [corners.Top]: corners.Bottom,
  [corners.RightTop]: corners.LeftBottom,
  [corners.Right]: corners.Left,
  [corners.RightBottom]: corners.LeftTop,
  [corners.Bottom]: corners.Top,
  [corners.LeftBottom]: corners.RightTop
}

export const quadrants: IQuadrants = {
  [corners.Left]: { x: 1, y: 0 },
  [corners.LeftTop]: { x: 1, y: 1 },
  [corners.Top]: { x: 0, y: 1 },
  [corners.RightTop]: { x: -1, y: 1 },
  [corners.Right]: { x: -1, y: 0 },
  [corners.RightBottom]: { x: -1, y: -1 },
  [corners.Bottom]: { x: 0, y: -1 },
  [corners.LeftBottom]: { x: 1, y: -1 }
}

export const menuItems: IMenuItem[] = [
  {
    key: menuKeys.Delete,
    name: 'delete'
  },
  {
    key: menuKeys.Top,
    name: 'to top',
    icon: 'top-icon.svg'
  },
  {
    key: menuKeys.Forward,
    name: 'bring forward',
    icon: 'up-icon.svg'
  },
  {
    key: menuKeys.Backward,
    name: 'bring backward',
    icon: 'down-icon.svg'
  },
  {
    key: menuKeys.Bottom,
    name: 'to bottom',
    icon: 'bottom-icon.svg'
  }
].map(d => ({ ...d, disable: false }))
