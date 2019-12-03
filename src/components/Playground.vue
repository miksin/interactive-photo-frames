<template>
  <div class="playground grid">
    <div
      v-for="frame in frames"
      :key="frame.id"
    >
      <FlexibleFrame
        :class="{
          dragging: isDragging && mutatedFrame === frame,
          highlight: isDragging && mutatedFrame === frame
        }"
        :frame="frame"
        :focused="focusFrame === frame"
        @drag-frame="handleDragFrame"
        @resize-frame="handleResizeFrame"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import FlexibleFrame from './FlexibleFrame.vue'
import FrameModel from '../models/Frame'
import { IPosition, ISize, IQuadrants, IDiagonals } from '../utils/interfaces'
import { Diagonals } from '../models/types'
import { mouseEvents, corners, cornerDiagonals } from '../utils/constants'
import Position from '../models/Position'

@Component({
  components: {
    FlexibleFrame
  }
})
export default class Playground extends Vue {
  mutatedFrame: FrameModel | null = null

  get mousePos (): Position {
    return this.$store.state.mouseWrapper.position
  }

  get mouseDiagonals (): Diagonals {
    return this.$store.state.mouseWrapper.diagonals
  }

  get mouseTrackCorner (): corners {
    return this.$store.state.mouseWrapper.trackCorner
  }

  get dragActive (): boolean {
    return this.$store.state.mouseWrapper.event === mouseEvents.DragFrame
  }

  get isDragging (): boolean {
    return this.dragActive && this.mutatedFrame !== null
  }

  get resizeActive (): boolean {
    return this.$store.state.mouseWrapper.event === mouseEvents.ResizeFrame
  }

  get isResizing (): boolean {
    return this.resizeActive && this.mutatedFrame !== null
  }

  handleDragFrame ({ frame, e }: { frame: FrameModel, e: MouseEvent }) {
    this.mutatedFrame = frame
    this.$store.commit('setMouseWrapper', {
      pos: new Position({
        x: e.clientX,
        y: e.clientY
      }),
      basis: new Position({
        x: e.clientX - frame.position.x,
        y: e.clientY - frame.position.y
      }),
      event: mouseEvents.DragFrame,
      trackCorner: corners.LeftTop
    })
  }

  @Watch('mousePos')
  handleMouseMove (val: Position) {
    const frame = this.mutatedFrame || new FrameModel()

    if (this.isDragging) {
      this.$store.commit('moveFrame', {
        frame,
        pos: val
      })
    }

    if (this.isResizing) {
      const diagonals = this.mouseDiagonals

      // fix horizontal or vertical changes
      switch (this.mouseTrackCorner) {
        case corners.Left:
        case corners.Right:
          diagonals[0].y = frame.position.y
          diagonals[1].y = frame.diagonals[1].y
          break
        case corners.Top:
        case corners.Bottom:
          diagonals[0].x = frame.position.x
          diagonals[1].x = frame.diagonals[1].x
          break
      }

      this.$store.commit('resizeFrame', {
        frame,
        val: diagonals
      })
    }
  }

  @Watch('dragActive')
  handleDragActive (val: boolean) {
    if (!val) {
      this.mutatedFrame = null
      this.$store.commit('resetMouseWrapper')
    }
  }

  handleResizeFrame (input: { frame: FrameModel, corner: corners, e: MouseEvent }) {
    const { frame, corner, e } = input
    this.mutatedFrame = frame
    this.$store.commit('setMouseWrapper', {
      pos: new Position({
        x: e.clientX,
        y: e.clientY
      }),
      event: mouseEvents.ResizeFrame,
      basis: frame.cornerPositions[cornerDiagonals[corner]],
      trackCorner: cornerDiagonals[corner]
    })
  }

  @Watch('resizeActive')
  handleResizeActive (val: boolean) {
    if (!val) {
      this.mutatedFrame = null
      this.$store.commit('resetMouseWrapper')
    }
  }

  get frames () {
    return this.$store.state.frames.filter((f: FrameModel) => f.display)
  }

  get focusFrame () {
    return this.$store.state.focusFrame
  }
}
</script>

<style lang="scss" scoped>
.playground {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  &.grid {
    @include bg-grid();
  }

  .phantom {
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba($color: $grey, $alpha: 0.3);
    &.show {
      box-shadow: 0px 0px 0px 3px rgba($color: $success, $alpha: 1.0);
    }
  }
}
</style>
