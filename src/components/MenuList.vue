<template>
  <div class="wrapper" @click.stop="handleCloseMenu">
    <div
      class="menu-list"
      :style="{ transform: `translate(${pos.x - 150}px, ${pos.y}px)` }"
    >
      <div
        v-for="item in items"
        :key="item.key"
        class="menu-item"
        @click.stop="handleExecuteMenu"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IMenuItem, IPosition } from '../utils/interfaces'

@Component
export default class MenuList extends Vue {
  @Prop() items: IMenuItem[]
  @Prop() pos: IPosition

  handleCloseMenu () {
    this.$store.commit('changeMenuTarget', { target: null })
  }

  handleExecuteMenu (key: string) {
    console.log(key)
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}

.menu-list {
  @include flex(column, nowrap);
  position: absolute;
  left: 0;
  top: 0;

  background-color: $white;
  overflow: hidden;
  box-shadow: 0px 0px 5px 1px rgba($color: $grey, $alpha: 0.3);
  width: 150px;

  .menu-item {
    cursor: pointer;
    padding: 8px 0;

    &:hover {
      background-color: $danger;
      color: $white;
    }
  }
}
</style>
