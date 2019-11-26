import { corners } from './constants'
import { ISize } from './interfaces'

export function cornerStyles (size: ISize, cornerSize: number = 0) {
  return [
    {
      key: corners.Left,
      style: {
        position: 'absolute',
        width: `${cornerSize}px`,
        height: `${size.height}px`,
        left: `${-cornerSize}px`,
        top: `${0}px`,
        cursor: 'ew-resize'
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
        cursor: 'nwse-resize'
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
        cursor: 'ns-resize'
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
        cursor: 'nesw-resize'
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
        cursor: 'ew-resize'
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
        cursor: 'nwse-resize'
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
        cursor: 'ns-resize'
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
        cursor: 'nesw-resize'
      }
    }
  ]
}
