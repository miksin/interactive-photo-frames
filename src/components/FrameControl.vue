<template>
  <div class="modal" :class="{ hidden: hidden }">
    <div class="frame-list">
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
            src="icon-eye.svg"
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
    >
      Add New
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import FrameModel from '../models/Frame'

@Component
export default class FrameControl extends Vue {
  @Prop({ default: false }) readonly hidden: boolean

  get frames () {
    return this.$store.state.frames
  }

  get focusFrame () {
    return this.$store.state.focusFrame
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
  position: fixed;
  right: 12px;
  top: 50%;
  width: 150px;
  height: 80vh;
  transform: translateY(-50%);
  @include transition(
    $property: transform,
    $duration: 0.2s
  );

  &.hidden {
    transform: translate(calc(100% + 8px), -50%);
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
  overflow-x: hidden;

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
