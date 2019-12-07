<template>
  <div
    class="modal"
    :class="{
      hidden: hidden && fold,
      fold: fold
    }"
    :style="{
      width: `${width}px`,
      transform: `translate(${pos.x}px, ${pos.y}px)`
    }"
  >
    <div
      class="appbar"
      :class="{
        hidden: hidden && fold,
        dragging: isDraggingModal
      }"
      @mouseover="handleFocusModal"
      @mouseleave="handleBlurModal"
    >
      <div
        class="modal-draggable"
        @mousedown.stop="handleDragModal"
      />
      <div class="icon-btn" @click.stop="fold = !fold">
        <img src="fold-icon.svg" alt="fold">
      </div>
    </div>
    <div
      class="frame-list"
      :style="{
        height: `${listHeight}px`
      }"
      v-show="!fold"
      ref="frameListRef"
    >
      <div
        v-for="frame in frames"
        :key="frame.id"
        class="frame-preview"
        :class="{ highlight: focusFrame === frame }"
        :style="{
          margin: `${itemMargin}px 0`,
          height: `${itemHeight}px`,
          minHeight: `${itemHeight}px`
        }"
        @mouseover="handleFocusFrame(frame)"
        @mouseout="handleFocusFrame(null)"
        @click="e => handleOpenMenu(e, frame)"
      >
        <div
          title="hidden/show"
          @click.stop="toggleDisplayFrame(frame)"
        >
          <img
            src="eye-icon.svg"
            alt="display"
            :class="{ show: frame.display }"
          >
        </div>
        <div :title="frame.name">{{ frame.name }}</div>
      </div>
    </div>
    <input
      id="upload-img-input"
      type="file"
      multiple
      accept="image/*"
      :style="{ display: 'none' }"
      @change="handleUpload"
    >
    <label
      for="upload-img-input"
      class="btn"
      v-show="!fold"
    >
      Add Image
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Ref, Watch } from 'vue-property-decorator'
import FrameModel from '../models/Frame'
import { mouseEvents, corners } from '../models/enums'
import Position from '../models/Position'

@Component
export default class FrameControl extends Vue {
  // appearance
  width: number = 150
  itemShowLimit: number = 10
  itemHeight: number = 30
  itemMargin: number = 4

  get listHeight (): number {
    return (this.itemHeight + 2 * this.itemMargin) * this.itemShowLimit
  }

  // local states
  pos: Position = new Position({ x: 8, y: 8 })
  fold: boolean = false
  hidden: boolean = false
  blurTimer: any = null

  @Ref() readonly frameListRef!: HTMLDivElement

  get frames (): FrameModel[] {
    return this.$store.state.frames.slice().reverse()
  }

  get focusFrame () {
    return this.$store.state.focusFrame
  }

  get mousePos (): Position {
    return this.$store.state.mouseWrapper.position
  }

  get isDraggingModal (): boolean {
    return this.$store.state.mouseWrapper.event === mouseEvents.DragFrameControlPanel
  }

  set isDraggingModal (val: boolean) {
    const event = val ? mouseEvents.DragFrameControlPanel : mouseEvents.None
    this.$store.commit('setMouseWrapper', { event })
  }

  handleDragModal (e: MouseEvent) {
    this.$store.commit('setMouseWrapper', {
      pos: new Position({ // update mouse position before active
        x: e.clientX,
        y: e.clientY
      }),
      basis: new Position({
        x: e.clientX - this.pos.x,
        y: e.clientY - this.pos.y
      }),
      event: mouseEvents.DragFrameControlPanel,
      trackCorner: corners.LeftTop
    })
  }

  @Watch('mousePos')
  handleDraggingModal (val: Position) {
    if (this.isDraggingModal) {
      this.pos = val
    }
  }

  handleDragPreview (e: MouseEvent) {
    if (this.frameListRef && this.frameListRef.childNodes.length > 0) {
      const firstNode = this.frameListRef.childNodes[0] as HTMLDivElement
      const targetNode = e.currentTarget as HTMLDivElement
      const topDiff = targetNode.offsetTop - firstNode.offsetTop
    }
  }

  handleFocusModal () {
    this.hidden = false
    clearTimeout(this.blurTimer)
  }

  handleBlurModal () {
    this.blurTimer = setTimeout(() => {
      this.hidden = true
    }, 1000)
  }

  handleFocusFrame (frame: FrameModel) {
    this.$store.commit('switchFocusFrame', { frame: frame })
  }

  handleOpenMenu (e: MouseEvent, frame: FrameModel) {
    const pos = {
      x: e.clientX,
      y: e.clientY
    }

    this.$store.commit('moveMenu', { pos })
    this.$store.commit('changeMenuTarget', { target: frame })
  }

  toggleDisplayFrame (frame: FrameModel) {
    this.$store.commit('updateFrame', {
      frame,
      input: {
        display: !frame.display
      }
    })
  }

  handleUpload (e: any) {
    const { files } = e.target
    let hasRead = 0

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader()
      reader.onload = (readerEvent: any) => {
        this.$store.commit('addFrame', { input: {
          name: files[i].name,
          url: readerEvent.target.result,
          position: new Position({
            x: this.frames.length * 20 + 20,
            y: this.frames.length * 20 + 20
          })
        } })

        // clear <input> after all processes has been done
        hasRead++
        if (hasRead === files.length) {
          e.target.value = ''
        }
      }
      reader.readAsDataURL(files[i])
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  @include flex(column);

  background-color: $white;
  box-shadow: 0px 1px 15px -5px rgba($color: $grey, $alpha: 0.3);
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
  height: auto;
  @include transition(
    $property: height,
    $duration: 0.2s
  );

  &.hidden {
    box-shadow: none;
  }

  &.fold {
    height: $appbar-height;
  }
}

.appbar {
  width: 100%;
  height: $appbar-height;
  background-color: $danger;
  padding: 4px 8px;
  @include flex();
  @include flex-align();

  opacity: 1;
  @include transition(opacity, 0.2s);
  &.hidden {
    opacity: 0.1;
  }

  .modal-draggable {
    height: 100%;
    flex-grow: 1;
    cursor: grab;
    &.dragging {
      cursor: grabbing;
    }
  }

  .icon-btn {
    @include flex();
    @include flex-align();
    cursor: pointer;
  }

  img {
    width: $appbar-height * 0.6;
  }
}

.frame-list {
  @include flex(column, nowrap);
  flex-grow: 1;
  overflow-y: scroll;
}

.frame-preview {
  @include flex();
  @include flex-align(flex-start, center);
  padding: 4px 0;
  box-shadow: 0px 0px 3px -1px rgba($color: $grey, $alpha: 0.3);
  cursor: pointer;
  overflow: hidden;

  div {
    white-space: nowrap;
    margin: auto 4px;
  }

  &.highlight {
    background-color: $danger;
    color: $white;
  }

  img {
    width: 18px;
    height: 18px;
    margin: auto;
    opacity: 0.2;

    &.show {
      opacity: 1;
    }
  }
}

.btn {
  @include btn($fill: true);
}
</style>
