<template>
  <div
    class="wrapper"
    @click.stop="handleCloseMenu"
    ref="wrapper"
  >
    <div
      class="menu-list"
      :style="{
        width: `${width}px`,
        transform: `translate(${nicelyPos.x}px, ${nicelyPos.y}px)`
      }"
    >
      <div
        v-for="item in items"
        :key="item.key"
        class="menu-item"
        :style="{ height: `${itemHeight}px` }"
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

  wrapper: HTMLDivElement | null = null
  width: number = 150;
  itemHeight: number = 34;

  mounted () {
    this.wrapper = this.$refs.wrapper as HTMLDivElement
  }

  get nicelyPos () {
    const pos: IPosition = {
      ...this.pos
    }
    if (this.wrapper) {
      if (pos.x + this.width > this.wrapper.clientWidth) {
        pos.x -= this.width
      }

      const height = this.itemHeight * this.items.length
      if (pos.y + height > this.wrapper.clientHeight) {
        pos.y -= height
      }
    }
    return pos
  }

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
