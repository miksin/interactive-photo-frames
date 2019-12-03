<template>
  <div
    class="frame"
    :class="{
      highlight: focused,
      draggable: frameMutable,
      movable: contentMutable
    }"
    :style="{
      transform: `translate(${framePos.x}px, ${framePos.y}px)`,
      width: `${frame.outerSize.width}px`,
      height: `${frame.outerSize.height}px`,
      padding: `${frame.padding}px`
    }"
    @mouseover="handleFocusFrame(frame)"
    @mouseout="handleFocusFrame(null)"
  >
    <div class="content"
      @mousedown.stop="handleDragFrame"
      @mousewheel="handleScrollFrame"
    >
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
        @load="handleImgLoad(frame)"
        @dragstart.prevent=""
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
import { cornerStyles } from '../utils/helpers'
import { corners, mouseEvents } from '../models/enums'
import Position from '../models/Position'
import Size from '../models/Size'

@Component
export default class App extends Vue {
  @Prop(FrameModel) frame: FrameModel
  @Prop({ default: false }) readonly focused: boolean
  @Prop() readonly frameMutable: boolean

  @Ref('img') readonly imgRef!: HTMLImageElement

  get framePos (): Position {
    return this.frame.outerPosition
  }

  get resizeNodes () {
    return cornerStyles(this.frame.size, this.frame.padding, this.frameMutable)
  }

  get contentMutable () {
    return !this.frameMutable
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
    if (this.frameMutable) {
      this.$emit('drag-frame', {
        frame: this.frame,
        e
      })
    }

    if (this.contentMutable) {
      this.$emit('drag-content', {
        frame: this.frame,
        e
      })
    }
  }

  handleResizeFrame (e: MouseEvent, corner: corners) {
    if (!this.frameMutable) return
    this.$emit('resize-frame', {
      frame: this.frame,
      corner,
      e
    })
  }

  handleScrollFrame (e: WheelEvent) {
    if (!this.contentMutable) return

    const zoomScale = e.deltaY < 0 ? 0.1 : -0.1
    const scale = Math.max(this.frame.scale + zoomScale, 0.1)
    this.$store.commit('updateFrame', {
      frame: this.frame,
      input: { scale }
    })
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

  &.draggable {
    cursor: grab;
  }

  &.movable {
    cursor: move;
  }

  &.dragging {
    opacity: 0.3;
  }
}
</style>
