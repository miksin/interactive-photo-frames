<template>
  <div class="frame">
    <div class="content">{{ frame.name }}</div>
  </div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator'
import FrameModel from '../models/Frame'

@Component()
export default class App extends Vue {
  @Prop(FrameModel) frame
}
</script>

<style lang="scss" scoped>
.frame {
  min-width: 100px;
  min-height: 100px;
  padding: 4px;
  background-color: $white;
  position: relative;

  .content {
    background-color: $grey;
    width: 100%;
    height: 100%;
    position: absolute;
    color: $white;
  }
}
</style>
