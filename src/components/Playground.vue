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
    <div
      class="phantom"
      :class="{ show: isDragging }"
      :style="{
        width: `${phantomSize.width}px`,
        height: `${phantomSize.height}px`,
        transform: `translate(${phantomPos.x}px, ${phantomPos.y}px)`
      }"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import FlexibleFrame from './FlexibleFrame.vue'
import FrameModel from '../models/Frame'
import { IPosition, ISize } from '../utils/interfaces'
import { mouseEvents, corners } from '../utils/constants'

@Component({
  components: {
    FlexibleFrame
  }
})
export default class Playground extends Vue {
  framePadding: number = 6
  mutatedFrame: FrameModel | null = null
  offset: IPosition = { x: 0, y: 0 }
  resizeCorner: string = corners.LeftTop

  get mousePos (): IPosition {
    return this.$store.state.mouseWrapper.pos
  }

  get dragActive (): boolean {
    return this.$store.state.mouseWrapper.event === mouseEvents.DragFrame
  }

  set dragActive (val: boolean) {
    const event = val ? mouseEvents.DragFrame : mouseEvents.None
    this.$store.commit('setMouseWrapper', { event })
  }

  get isDragging (): boolean {
    return this.dragActive && this.mutatedFrame !== null
  }

  get resizeActive (): boolean {
    return this.$store.state.mouseWrapper.event === mouseEvents.ResizeFrame
  }

  set resizeActive (val: boolean) {
    const event = val ? mouseEvents.ResizeFrame : mouseEvents.None
    this.$store.commit('setMouseWrapper', { event })
  }

  get isResizing (): boolean {
    return this.resizeActive && this.mutatedFrame !== null
  }

  get basisPos (): IPosition {
    if (this.mutatedFrame === null) return { x: 0, y: 0 }

    const { position, size } = this.mutatedFrame

    switch (this.resizeCorner) {
      case corners.Left:
      case corners.LeftTop:
      case corners.Top:
        return {
          x: position.x + size.width + 2 * this.framePadding,
          y: position.y + size.height + 2 * this.framePadding
        }
      case corners.RightTop:
        return {
          x: position.x,
          y: position.y + size.height + 2 * this.framePadding
        }
      case corners.LeftBottom:
        return {
          x: position.x + size.width + 2 * this.framePadding,
          y: position.y
        }
      default:
        return position
    }
  }

  get phantomPos (): IPosition {
    if (this.mutatedFrame === null) return { x: 0, y: 0 }

    // original position of frame
    const pos = {
      x: this.mutatedFrame.position.x,
      y: this.mutatedFrame.position.y
    }

    if (this.isDragging) {
      pos.x = this.mousePos.x - this.offset.x
      pos.y = this.mousePos.y - this.offset.y
    }

    if (this.isResizing) {
      switch (this.resizeCorner) {
        case corners.Left:
        case corners.LeftBottom:
          pos.x = this.mousePos.x - this.offset.x
          break
        case corners.Top:
        case corners.RightTop:
          pos.y = this.mousePos.y - this.offset.y
          break
        case corners.LeftTop:
          pos.x = this.mousePos.x - this.offset.x
          pos.y = this.mousePos.y - this.offset.y
          break
        default:
          break
      }
    }

    return pos
  }

  get phantomSize (): ISize {
    if (this.mutatedFrame === null) return { width: 0, height: 0 }

    // original size of frame
    const size: ISize = {
      width: this.mutatedFrame.size.width + 2 * this.framePadding,
      height: this.mutatedFrame.size.height + 2 * this.framePadding
    }

    const adjustMouse = {
      x: this.mousePos.x,
      y: this.mousePos.y
    }

    if (this.isResizing) {
      switch (this.resizeCorner) {
        case corners.Left:
        case corners.Right:
          size.width = Math.abs(this.basisPos.x - adjustMouse.x)
          break
        case corners.Top:
        case corners.Bottom:
          size.height = Math.abs(this.basisPos.y - adjustMouse.y)
          break
        case corners.LeftTop:
        case corners.LeftBottom:
        case corners.RightTop:
        case corners.RightBottom:
          size.width = Math.abs(this.basisPos.x - adjustMouse.x)
          size.height = Math.abs(this.basisPos.y - adjustMouse.y)
          break
        default:
          break
      }
    }

    return size
  }

  handleDragFrame ({ frame, offset }: { frame: FrameModel, offset: IPosition }) {
    this.mutatedFrame = frame
    this.offset = offset
    this.dragActive = true
  }

  @Watch('dragActive')
  handleDragActive (val: boolean) {
    if (!val) {
      console.log(this.phantomPos)
      this.$store.commit('moveFrame', {
        frame: this.mutatedFrame,
        pos: this.phantomPos
      })
      this.mutatedFrame = null
      this.offset = { x: 0, y: 0 }
    }
  }

  handleResizeFrame (e: { frame: FrameModel, corner: string, offset: IPosition }) {
    const { frame, corner, offset } = e
    this.mutatedFrame = frame
    this.offset = offset
    this.resizeCorner = corner
    this.resizeActive = true
  }

  @Watch('resizeActive')
  handleResizeActive (val: boolean) {
    if (!val) {
      this.$store.commit('updateFrame', {
        frame: this.mutatedFrame,
        input: {
          position: this.phantomPos,
          size: this.phantomSize
        }
      })
      this.mutatedFrame = null
      this.offset = { x: 0, y: 0 }
      this.resizeCorner = corners.LeftTop
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
