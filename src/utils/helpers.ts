import { corners } from '../models/enums'
import { ISize } from '../models/interfaces'

export function cornerStyles (size: ISize,
  cornerSize: number = 0, cursor: boolean = false) {
  return [
    {
      key: corners.Left,
      style: {
        position: 'absolute',
        width: `${cornerSize}px`,
        height: `${size.height}px`,
        left: `${-cornerSize}px`,
        top: `${0}px`,
        cursor: cursor ? 'ew-resize' : 'default'
      }
    },
    {
      key: corners.LeftTop,
      style: {
        position: 'absolute',
        width: `${cornerSize}px`,
        height: `${cornerSize}px`,
        left: `${-cornerSize}px`,
        top: `${-cornerSize}px`,
        cursor: cursor ? 'nwse-resize' : 'default'
      }
    },
    {
      key: corners.Top,
      style: {
        position: 'absolute',
        width: `${size.width}px`,
        height: `${cornerSize}px`,
        left: `${0}px`,
        top: `${-cornerSize}px`,
        cursor: cursor ? 'ns-resize' : 'default'
      }
    },
    {
      key: corners.RightTop,
      style: {
        position: 'absolute',
        width: `${cornerSize}px`,
        height: `${cornerSize}px`,
        right: `${-cornerSize}px`,
        top: `${-cornerSize}px`,
        cursor: cursor ? 'nesw-resize' : 'default'
      }
    },
    {
      key: corners.Right,
      style: {
        position: 'absolute',
        width: `${cornerSize}px`,
        height: `${size.height}px`,
        right: `${-cornerSize}px`,
        top: `${0}px`,
        cursor: cursor ? 'ew-resize' : 'default'
      }
    },
    {
      key: corners.RightBottom,
      style: {
        position: 'absolute',
        width: `${cornerSize}px`,
        height: `${cornerSize}px`,
        right: `${-cornerSize}px`,
        bottom: `${-cornerSize}px`,
        cursor: cursor ? 'nwse-resize' : 'default'
      }
    },
    {
      key: corners.Bottom,
      style: {
        position: 'absolute',
        width: `${size.width}px`,
        height: `${cornerSize}px`,
        left: `${0}px`,
        bottom: `${-cornerSize}px`,
        cursor: cursor ? 'ns-resize' : 'default'
      }
    },
    {
      key: corners.LeftBottom,
      style: {
        position: 'absolute',
        width: `${cornerSize}px`,
        height: `${cornerSize}px`,
        left: `${-cornerSize}px`,
        bottom: `${-cornerSize}px`,
        cursor: cursor ? 'nesw-resize' : 'default'
      }
    }
  ]
}
