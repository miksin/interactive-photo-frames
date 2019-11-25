<template>
  <div class="home">
    <Playground />
    <FrameControl />
    <MenuList
      v-if="menuActive"
      :items="menuItems"
      :pos="menuPos"
      @click-item="handleMenuItem"
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
import { IPosition, IMenuItem } from '../utils/interfaces'
import { menuKeys } from '../utils/constants'

@Component({
  components: {
    Playground,
    FrameControl,
    MenuList,
    MouseWrapper
  }
})
export default class Home extends Vue {
  get menuTarget (): FrameModel | null {
    return this.$store.state.menu.target
  }

  get menuActive (): boolean {
    return this.menuTarget !== null
  }

  get menuItems (): IMenuItem[] {
    return this.$store.state.menu.items
  }

  get menuPos (): IPosition {
    return this.$store.state.menu.pos
  }

  handleMenuItem (key: string) {
    this.$store.dispatch('executeMenu', { key })
  }

  mounted () {
    this.$store.dispatch('initMenuIcons')
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
