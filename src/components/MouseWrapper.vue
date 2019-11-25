<template>
  <div
    v-show="active"
    class="mouse-wrapper"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IPosition } from '../utils/interfaces'

@Component
export default class MouseWrapper extends Vue {
  get active (): boolean {
    return this.$store.state.mouseWrapper.active
  }

  set active (val: boolean) {
    this.$store.commit('setMouseWrapper', { active: val })
  }

  get pos (): IPosition {
    return this.$store.state.mouseWrapper.pos
  }

  set pos (val: IPosition) {
    this.$store.commit('setMouseWrapper', { pos: val })
  }

  handleMouseMove (e: MouseEvent) {
    this.pos = {
      x: e.clientX,
      y: e.clientY
    }
  }

  handleMouseUp () {
    this.active = false
  }
}
</script>

<style lang="scss" scoped>
.mouse-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}
</style>
