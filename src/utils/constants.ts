import { IMenuItem } from './interfaces'

export enum menuKeys {
  Edit = 'edit',
  Delete = 'delete',
  Top = 'top',
  Forward = 'forward',
  Backward = 'backward',
  Bottom = 'bottom'
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
