import { IMenuItem } from './interfaces'

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
