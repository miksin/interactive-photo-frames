<template>
  <div class="playground grid">
    <div
      v-for="frame in frames"
      :key="frame.id"
    >
      <FlexibleFrame
        :frame="frame"
        :focused="focusFrame === frame"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import FlexibleFrame from './FlexibleFrame.vue'
import FrameModel from '../models/Frame'

@Component({
  components: {
    FlexibleFrame
  }
})
export default class Playground extends Vue {
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
}
</style>
