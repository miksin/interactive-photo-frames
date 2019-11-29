<template>
  <div
    class="frame"
    :class="{
      highlight: focused
    }"
    :style="{
      transform: `translate(${framePos.x}px, ${framePos.y}px)`,
      width: `${frame.size.width + 2 * padding}px`,
      height: `${frame.size.height + 2 * padding}px`,
      padding: `${padding}px`
    }"
    @mouseover="handleFocusFrame(frame)"
    @mouseout="handleFocusFrame(null)"
    @mousewheel="handleScrollFrame"
  >
    <div class="content">
      <img
        :title="frame.name"
        :src="frame.url"
        :alt="frame.name"
        ref="img"
        @mousedown.stop="handleDragFrame"
        @load="handleImgLoad(frame)"
      >
      <div
        v-for="node in resizeNodes"
        :key="node.key"
        :style="node.style"
        @mousedown.stop="e => handleResizeFrame(e, node.key)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import FrameModel from '../models/Frame'
import { IPosition } from '../utils/interfaces'
import { cornerStyles } from '../utils/helpers'
import { corners } from '../utils/constants'

@Component
export default class App extends Vue {
  @Prop(FrameModel) frame: FrameModel
  @Prop({ default: false }) readonly focused: boolean
  @Prop({ default: 0 }) readonly padding: number

  @Ref('img') readonly imgRef!: HTMLImageElement

  get framePos (): IPosition {
    return {
      x: this.frame.position.x - this.padding,
      y: this.frame.position.y - this.padding
    }
  }

  get resizeNodes () {
    return cornerStyles(this.frame.size, this.padding)
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
    this.$emit('drag-frame', {
      frame: this.frame,
      e
    })
  }

  handleResizeFrame (e: MouseEvent, corner: corners) {
    this.$emit('resize-frame', {
      frame: this.frame,
      corner,
      e
    })
  }

  handleScrollFrame (e: WheelEvent) {
    console.log(e.deltaMode, e.deltaY)
  }
}
</script>

<style lang="scss" scoped>
.frame {
  @include flex();
  @include flex-align();

  left: 0;
  top: 0;
  box-shadow: 1px 1px 5px -1px rgba($color: $grey, $alpha: 0.3);
  background-color: $white;
  position: absolute;
  overflow: hidden;

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
    opacity: 0.3;
  }
}
</style>
