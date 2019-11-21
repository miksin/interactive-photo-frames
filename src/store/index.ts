import Vue from 'vue'
import Vuex from 'vuex'
import Uuid from 'uuid/v4'
import FrameModel from '../models/Frame'
import { IFrameInput } from '../utils/interfaces'

Vue.use(Vuex)

interface IState {
  frames: FrameModel[]
}

export default new Vuex.Store({
  state: {
    frames: Array<FrameModel>(0)
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
    }
  },
  actions: {
  },
  modules: {
  }
})
