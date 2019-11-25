<template>
  <div
    class="modal"
    :class="{
      hidden: hidden && fold,
      fold: fold
    }"
    :style="{
      transform: `translate(${pos.x}px, ${pos.y}px)`
    }"
  >
    <div
      class="appbar"
      :class="{
        hidden: hidden && fold,
        dragging: draggingModal
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
    <div class="frame-list" v-show="!fold">
      <div
        v-for="frame in frames"
        :key="frame.id"
        class="frame-preview"
        :class="{ highlight: focusFrame === frame }"
        @mouseover="handleFocusFrame(frame)"
        @mouseout="handleFocusFrame(null)"
        @click="e => handleOpenMenu(e, frame)"
      >
        <div @click.stop="toggleDisplayFrame(frame)">
          <img
            src="eye-icon.svg"
            alt="display"
            :class="{ show: frame.display }"
          >
        </div>
        <div>{{ frame.name }}</div>
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
      Add New
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, PropSync, Watch } from 'vue-property-decorator'
import FrameModel from '../models/Frame'
import { IPosition } from '../utils/interfaces'

@Component
export default class FrameControl extends Vue {
  pos: IPosition = { x: 8, y: 100 }
  fold: boolean = false
  hidden: boolean = false
  draggingModalF: boolean = false
  draggingOffset: IPosition = { x: 0, y: 0 }
  blurTimer: any = null

  get frames () {
    return this.$store.state.frames
  }

  get focusFrame () {
    return this.$store.state.focusFrame
  }

  get mousePos (): IPosition {
    return this.$store.state.mouseWrapper.pos
  }

  get mouseActive (): boolean {
    return this.$store.state.mouseWrapper.active
  }

  set mouseActive (val: boolean) {
    this.$store.commit('setMouseWrapper', { active: val })
  }

  get draggingModal () {
    return this.draggingModalF && this.mouseActive
  }

  set draggingModal (val: boolean) {
    this.draggingModalF = val
    this.mouseActive = val
  }

  handleDragModal (e: MouseEvent) {
    this.draggingModal = true
    this.draggingOffset = {
      x: e.clientX - this.pos.x,
      y: e.clientY - this.pos.y
    }
  }

  @Watch('mousePos')
  handleDraggingModal (mousePos: IPosition) {
    if (this.draggingModal) {
      this.pos.x = mousePos.x - this.draggingOffset.x
      this.pos.y = mousePos.y - this.draggingOffset.y
    }
  }

  @Watch('mouseActive')
  handleMouseActive (val: boolean) {
    if (val === false) {
      this.draggingModalF = val
      console.log(this.draggingModalF)
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

  handleAddFrame () {
    this.$store.commit('addFrame', { input: {
      url: 'example.png',
      position: {
        x: Math.floor(Math.random() * window.innerWidth),
        y: Math.floor(Math.random() * window.innerHeight)
      }
    } })
  }

  handleFocusFrame (frame: FrameModel) {
    this.$store.commit('switchFocusFrame', { frame: frame })
  }

  handleOpenMenu (e: any, frame: FrameModel) {
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
          position: {
            x: this.frames.length * 20 + 20,
            y: this.frames.length * 20 + 20
          }
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
  width: 150px;
  height: 80vh;
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
  margin: 4px;
  padding: 4px 0;
  box-shadow: 0px 0px 3px -1px rgba($color: $grey, $alpha: 0.3);
  cursor: pointer;

  div {
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
    opacity: 0;

    &.show {
      opacity: 1;
    }
  }
}

.btn {
  @include btn($fill: true);
}
</style>
