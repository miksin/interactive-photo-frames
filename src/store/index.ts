import Vue from 'vue'
import Vuex from 'vuex'
import Uuid from 'uuid/v4'
import FrameModel from '../models/Frame'
import { menuItems } from '../utils/constants'
import { IFrameInput, ISize, IMenuInfo, IMouseWrapper, IPosition } from '../utils/interfaces'

Vue.use(Vuex)

interface IState {
  frames: FrameModel[],
  focusFrame: FrameModel | null,
  menu: IMenuInfo,
  mouseWrapper: IMouseWrapper
}

export default new Vuex.Store({
  state: {
    frames: [],
    focusFrame: null,
    menu: {
      target: null,
      items: menuItems,
      pos: {
        x: 0,
        y: 0
      }
    },
    mouseWrapper: {
      active: false,
      pos: {
        x: 0,
        y: 0
      }
    }
  },
  mutations: {
    addFrame (state: IState, { input }: { input: IFrameInput }) {
      state.frames.push(new FrameModel(input))
    },
    updateFrame (state: IState, { frame, input }: { frame: FrameModel, input: IFrameInput }) {
      frame.update(input)
    },
    deleteFrame (state: IState, { frame }: { frame: FrameModel }) {
      const index: number = state.frames.findIndex(f => f === frame)
      if (index !== -1) {
        state.frames.splice(index, 1)
      }
    },
    swapFrames (state: IState, { frameA, frameB }: { frameA: FrameModel, frameB: FrameModel }) {
      const i = state.frames.findIndex((f: FrameModel) => f === frameA)
      const j = state.frames.findIndex((f: FrameModel) => f === frameB)
      const tempFrame: FrameModel = state.frames[i]
      state.frames[i] = state.frames[j]
      state.frames[j] = tempFrame
    },
    moveFrameOrder (state: IState, { frame, pos }: { frame: FrameModel, pos: number }) {
      const index: number = state.frames.findIndex((f: FrameModel) => f === frame)
      state.frames.splice(index, 1)
      state.frames.splice(pos, 0, frame)
    },
    switchFocusFrame (state: IState, { frame }: { frame: FrameModel | null }) {
      state.focusFrame = frame
    },
    moveMenu (state: IState, { pos }: { pos: IPosition }) {
      state.menu.pos = pos
    },
    changeMenuTarget (state: IState, { target }: { target: FrameModel | null }) {
      state.menu.target = target
    },
    setMouseWrapper (state: IState, val: { active?: boolean, pos?: IPosition }) {
      Object.assign(state.mouseWrapper, val)
    }
  },
  actions: {
  },
  modules: {
  }
})
