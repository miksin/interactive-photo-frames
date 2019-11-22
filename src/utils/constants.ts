import { IMenuItem } from './interfaces'

export enum menuKeys {
  Edit = 'edit',
  Delete = 'delete',
  Swap = 'swap'
}

export const menuItems: IMenuItem[] = [
  {
    key: menuKeys.Edit,
    name: 'edit'
  },
  {
    key: menuKeys.Delete,
    name: 'delete'
  },
  {
    key: menuKeys.Swap,
    name: 'swap'
  }
]
