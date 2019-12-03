<template>
  <div class="playground grid" @keydown="handleKeyDown">
    <div
      v-for="frame in frames"
      :key="frame.id"
    >
      <FlexibleFrame
        :class="{
          highlight: (isDragging || isResizing) && mutatedFrame === frame
        }"
        :frame="frame"
        :focused="focusFrame === frame"
        :frameMutable="!isAlt"
        @drag-frame="handleDragFrame"
        @drag-content="handleDragFrameContent"
        @resize-frame="handleResizeFrame"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import FlexibleFrame from './FlexibleFrame.vue'
import FrameModel from '../models/Frame'
import { Diagonals } from '../models/types'
import { cornerDiagonals } from '../utils/constants'
import { mouseEvents, corners } from '../models/enums'
import Position from '../models/Position'

@Component({
  components: {
    FlexibleFrame
  }
})
export default class Playground extends Vue {
  mutatedFrame: FrameModel | null = null

  get isAlt (): boolean {
    return this.$store.state.keyboardWrapper.Alt
  }

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

  get dragContentActive (): boolean {
    return this.$store.state.mouseWrapper.event === mouseEvents.DragFrameContent
  }

  get isDraggingContent (): boolean {
    return this.dragContentActive && this.mutatedFrame !== null
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

  handleDragFrameContent ({ frame, e }: { frame: FrameModel, e: MouseEvent }) {
    this.mutatedFrame = frame
    this.$store.commit('setMouseWrapper', {
      pos: new Position({
        x: e.clientX,
        y: e.clientY
      }),
      event: mouseEvents.DragFrameContent,
      basis: new Position({
        x: e.clientX - frame.offset.x,
        y: e.clientY - frame.offset.y
      })
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

    if (this.isDraggingContent) {
      this.$store.commit('updateFrame', {
        frame,
        input: {
          offset: val.clone()
        }
      })
    }

    if (this.isResizing) {
      const frameDiagonals = frame.diagonals
      const diagonals = this.mouseDiagonals

      // fix horizontal or vertical changes
      switch (this.mouseTrackCorner) {
        case corners.Left:
        case corners.Right:
          diagonals[0].y = frame.diagonals[0].y
          diagonals[1].y = frame.diagonals[1].y
          break
        case corners.Top:
        case corners.Bottom:
          diagonals[0].x = frame.diagonals[0].x
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

  handleKeyDown (e: any) {
    console.log(e)
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
