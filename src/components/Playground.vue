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
        :padding="framePadding"
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
import { mouseEvents, corners, cornerDiagonals, framePadding } from '../utils/constants'

@Component({
  components: {
    FlexibleFrame
  }
})
export default class Playground extends Vue {
  framePadding: number = framePadding
  mutatedFrame: FrameModel | null = null
  offset: IPosition = { x: 0, y: 0 }
  resizeCorner: string = corners.LeftTop

  get mousePos (): IPosition {
    return this.$store.state.mouseWrapper.position
  }

  get mouseDiagonals (): IDiagonals {
    return this.$store.state.mouseWrapper.diagonals
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
      pos: {
        x: e.clientX,
        y: e.clientY
      },
      event: mouseEvents.DragFrame,
      basis: {
        x: e.clientX - frame.position.x,
        y: e.clientY - frame.position.y
      },
      trackCorner: corners.LeftTop
    })
  }

  @Watch('mousePos')
  handleMouseMove (val: IPosition) {
    if (this.isDragging) {
      this.$store.commit('moveFrame', {
        frame: this.mutatedFrame,
        pos: val
      })
    }

    if (this.isResizing) {
      this.$store.commit('resizeFrame', {
        frame: this.mutatedFrame,
        val: this.mouseDiagonals
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
      pos: {
        x: e.clientX,
        y: e.clientY
      },
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
