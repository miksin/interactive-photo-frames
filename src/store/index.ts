import Vue from 'vue'
import Vuex from 'vuex'
import Uuid from 'uuid/v4'
import FrameModel from '../models/Frame'
import MouseWrapperModel from '../models/MouseWrapper'
import KeyboardWrapper from '../models/KeyboardWrapper'
import { menuItems } from '../utils/constants'
import { menuKeys } from '../models/enums'
import { IFrameInput, IMenuInfo, IPosition, IMenuItem, IMouseWrapperInput } from '../models/interfaces'
import { Diagonals } from '@/models/types'

Vue.use(Vuex)

interface IState {
  frames: FrameModel[],
  focusFrame: FrameModel | null,
  menu: IMenuInfo,
  mouseWrapper: MouseWrapperModel,
  keyboardWrapper: KeyboardWrapper
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
    mouseWrapper: new MouseWrapperModel(),
    keyboardWrapper: new KeyboardWrapper()
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
    moveFrame (state: IState, { frame, pos }: { frame: FrameModel, pos: IPosition }) {
      frame.move(pos)
    },
    resizeFrame (state: IState, { frame, val }: { frame: FrameModel, val: Diagonals }) {
      frame.diagonals = val
    },
    swapFrames (state: IState, { posA, posB }: { posA: number, posB: number }) {
      if (posA < 0 || posA >= state.frames.length) return
      if (posB < 0 || posB >= state.frames.length) return
      const frames = state.frames.slice()
      const tempFrame: FrameModel = frames[posA]
      frames[posA] = frames[posB]
      frames[posB] = tempFrame
      state.frames = frames
    },
    bringFrameTop (state: IState, { frame }: { frame: FrameModel }) {
      const index: number = state.frames.findIndex((f: FrameModel) => f === frame)
      state.frames.splice(index, 1)
      state.frames.splice(state.frames.length, 0, frame)
    },
    bringFrameBottom (state: IState, { frame }: { frame: FrameModel }) {
      const index: number = state.frames.findIndex((f: FrameModel) => f === frame)
      state.frames.splice(index, 1)
      state.frames.unshift(frame)
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
    setMenuIcon (state: IState, { item, url }: { item: IMenuItem, url: string }) {
      const index = state.menu.items.findIndex(d => d === item)
      if (index !== -1) {
        state.menu.items[index].icon = url
      }
    },
    setMouseWrapper (state: IState, val: IMouseWrapperInput) {
      state.mouseWrapper.update(val)
    },
    resetMouseWrapper (state: IState) {
      state.mouseWrapper.reset()
    },
    activateKey (state: IState, { code }: { code: number }) {
      state.keyboardWrapper.activate(code)
    },
    deactivateKey (state: IState, { code }: { code: number }) {
      state.keyboardWrapper.deactivate(code)
    },
    resetKey (state: IState) {
      state.keyboardWrapper.reset()
    }
  },
  actions: {
    // To reduce icon loading times,
    // but it must exist some approach to solve this problem clearly.
    async initMenuIcons ({ state, commit }) {
      const { items } = state.menu
      for (let i = 0; i < items.length; i++) {
        if (items[i].icon) {
          const result = await fetch(`${items[i].icon}`).then((r: any) => r.blob())
          const reader = new FileReader()
          reader.onload = (readerEvent: any) => {
            commit('setMenuIcon', {
              item: items[i],
              url: readerEvent.target.result
            })
          }
          reader.readAsDataURL(result)
        }
      }
    },
    executeMenu ({ state, commit }, { key }: { key: string }) {
      let posA, posB
      switch (key) {
        case menuKeys.Delete:
          commit('deleteFrame', { frame: state.menu.target })
          break
        case menuKeys.Top:
          commit('bringFrameTop', { frame: state.menu.target })
          break
        case menuKeys.Bottom:
          commit('bringFrameBottom', { frame: state.menu.target })
          break
        case menuKeys.Forward:
          posA = state.frames.findIndex(f => f === state.menu.target)
          posB = posA + 1
          commit('swapFrames', { posA, posB })
          break
        case menuKeys.Backward:
          posA = state.frames.findIndex(f => f === state.menu.target)
          posB = posA - 1
          commit('swapFrames', { posA, posB })
          break
        default:
          break
      }
      commit('changeMenuTarget', { target: null })
    }
  },
  modules: {
  }
})
