<template>
  <div class="home">
    <Playground />
    <FrameControl
      :hidden="isFcHidden"
    />
    <button
      class="toggle-btn"
      @click="handleToggleFc"
    >
    </button>
    <MenuList
      v-if="menu.target !== null"
      :pos="menu.pos"
      :items="menu.items"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import Playground from '../components/Playground.vue'
import FrameControl from '../components/FrameControl.vue'
import MenuList from '../components/MenuList.vue'
import FrameModel from '../models/Frame'

@Component({
  components: {
    Playground,
    FrameControl,
    MenuList
  }
})
export default class Home extends Vue {
  isFcHidden: boolean = false

  get menu () {
    return this.$store.state.menu
  }

  handleToggleFc () {
    this.isFcHidden = !this.isFcHidden
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

.toggle-btn {
  cursor: pointer;
  padding: 0;
  position: absolute;
  background-color: $danger;
  border-style: none;
  outline: none;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 80vh;

  &:hover {
    width: 24px;
  }
}
</style>
