<template>
  <div
    class="frame"
    :class="{
      highlight: focused
    }"
    :style="{
      transform: `translate(${framePos.x}px, ${framePos.y}px)`,
      width: `${frame.outerSize.width}px`,
      height: `${frame.outerSize.height}px`,
      padding: `${frame.padding}px`
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
        :style="{
          transform: `translate(${frame.offset.x}px, ${frame.offset.y}px)`,
          width: `${frame.innerSize.width}px`,
          height: `${frame.innerSize.height}px`,
        }"
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
import Size from '../models/Size'
import { IPosition } from '../utils/interfaces'
import { cornerStyles } from '../utils/helpers'
import { corners } from '../utils/constants'
import Position from '../models/Position'

@Component
export default class App extends Vue {
  @Prop(FrameModel) frame: FrameModel
  @Prop({ default: false }) readonly focused: boolean

  @Ref('img') readonly imgRef!: HTMLImageElement

  get framePos (): Position {
    return this.frame.outerPosition
  }

  get resizeNodes () {
    return cornerStyles(this.frame.size, this.frame.padding)
  }

  // resize image after loaded
  handleImgLoad (frame: FrameModel) {
    const naturalSize = new Size({
      width: this.imgRef.naturalWidth,
      height: this.imgRef.naturalHeight
    })
    this.$store.commit('updateFrame', {
      frame,
      input: {
        size: naturalSize.clone(),
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
      left: 0;
      top: 0;
      position: absolute;
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
