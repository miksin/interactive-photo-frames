<template>
  <div class="home">
    <Playground />
    <FrameControl />
    <MenuList
      v-if="menu.target !== null"
      :pos="menu.pos"
      :items="menu.items"
    />
    <MouseWrapper />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import Playground from '../components/Playground.vue'
import FrameControl from '../components/FrameControl.vue'
import MenuList from '../components/MenuList.vue'
import MouseWrapper from '../components/MouseWrapper.vue'
import FrameModel from '../models/Frame'
import { IPosition } from '../utils/interfaces'

@Component({
  components: {
    Playground,
    FrameControl,
    MenuList,
    MouseWrapper
  }
})
export default class Home extends Vue {
  get menu () {
    return this.$store.state.menu
  }
}
</script>

<style lang="scss" scoped>
.home {
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
