<template>
  <div
    v-show="active"
    class="mouse-wrapper"
    :class="{ dragging: active }"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Position from '../models/Position'
import { mouseEvents, corners } from '../models/enums'

@Component
export default class MouseWrapper extends Vue {
  get active (): boolean {
    return this.$store.state.mouseWrapper.event !== mouseEvents.None
  }

  set active (val: boolean) {
    if (!val) {
      this.$store.commit('setMouseWrapper', { event: mouseEvents.None })
    }
  }

  get trackCorner (): corners {
    return this.$store.state.mouseWrapper.trackCorner
  }

  get pos (): Position {
    return this.$store.state.mouseWrapper.pos
  }

  set pos (val: Position) {
    this.$store.commit('setMouseWrapper', { pos: val })
  }

  handleMouseMove (e: MouseEvent) {
    this.pos = new Position({
      x: e.clientX,
      y: e.clientY
    })
  }

  handleMouseUp () {
    this.$store.commit('resetMouseWrapper')
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

  &.dragging {
    cursor: grabbing;
  }

  .phantom {
    left: 0;
    top: 0;
    position: absolute;
    box-shadow: 0px 0px 0px 3px rgba($color: $success, $alpha: 1.0);
  }
}
</style>
