<template>
  <div
    class="frame"
    :class="{
      highlight: focused,
      dragging: isDragging
    }"
    :style="{
      transform: `translate(${frame.position.x}px, ${frame.position.y}px)`,
      width: `${frame.size.width}px`,
      height: `${frame.size.height}px`,
    }"
    @mouseover="handleFocusFrame(frame)"
    @mouseout="handleFocusFrame(null)"
    @mousedown="handleDragFrame"
  >
    <div class="content">
      <img
        :class="{ dragging: isDragging }"
        :src="frame.url"
        :alt="frame.name"
        ref="img"
        @load="handleImgLoad(frame)"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import FrameModel from '../models/Frame'
import { IPosition } from '../utils/interfaces'

@Component
export default class App extends Vue {
  @Prop(FrameModel) frame: FrameModel
  @Prop({ default: false }) readonly focused: boolean

  @Ref('img') readonly imgRef!: HTMLImageElement

  dragging: boolean = false
  dragOffset: IPosition = { x: 0, y: 0 }

  get mousePos (): IPosition {
    return this.$store.state.mouseWrapper.pos
  }

  get mouseActive (): boolean {
    return this.$store.state.mouseWrapper.active
  }

  set mouseActive (val: boolean) {
    this.$store.commit('setMouseWrapper', { active: val })
  }

  get isDragging (): boolean {
    return this.mousePos && this.dragging
  }

  // resize image after loaded
  handleImgLoad (frame: FrameModel) {
    const naturalSize = {
      width: this.imgRef.naturalWidth,
      height: this.imgRef.naturalHeight
    }
    this.$store.commit('updateFrame', {
      frame,
      input: {
        size: naturalSize,
        naturalSize
      }
    })
  }

  handleFocusFrame (frame: FrameModel) {
    this.$store.commit('switchFocusFrame', { frame })
  }

  handleDragFrame (e: MouseEvent) {
    this.mouseActive = true
    this.dragging = true
    this.dragOffset = {
      x: e.clientX - this.frame.position.x,
      y: e.clientY - this.frame.position.y
    }
  }

  @Watch('mousePos')
  handleDragging (mousePos: IPosition) {
    if (this.isDragging) {
      this.$store.commit('moveFrame', {
        frame: this.frame,
        pos: {
          x: mousePos.x - this.dragOffset.x,
          y: mousePos.y - this.dragOffset.y
        }
      })
    }
  }

  @Watch('mouseActive')
  handleMouseActive (val: boolean) {
    if (val === false) {
      this.dragging = val
    }
  }
}
</script>

<style lang="scss" scoped>
.frame {
  @include flex();
  @include flex-align();
  @include transition(
    $property: transform,
    $duration: 0.3s,
    $timing-function: linear
  );

  left: 0;
  top: 0;
  padding: 4px;
  box-shadow: 1px 1px 5px -1px rgba($color: $grey, $alpha: 0.3);
  background-color: $white;
  position: absolute;

  .content {
    width: 100%;
    height: 100%;
    color: $white;
    position: relative;

    img {
      width: 100%;
    }
  }

  &.highlight {
    box-shadow: 0px 0px 0px 3px rgba($color: $danger, $alpha: 1);
  }

  cursor: grab;
  &.dragging {
    cursor: grabbing;
  }
}
</style>
