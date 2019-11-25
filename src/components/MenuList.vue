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
        @click.stop="handleExecuteMenu(item.key)"
      >
        <img
          v-if="item.icon !== undefined"
          :style="{ height: `${itemHeight * 0.7}px` }"
          :src="item.icon"
          :alt="item.name"
        >
        <p v-else>
          {{ item.name }}
        </p>
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
    this.$emit('click-item', key)
  }

  mounted () {
    // Using v-if or v-show with the wrapper might cause $refs.wrapper to undefined.
    // Bind these conditions outside rather than on the wrapper directly
    this.wrapper = this.$refs.wrapper as HTMLDivElement
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
    @include flex();
    @include flex-align();
    cursor: pointer;
    padding: 8px 0;

    &:hover {
      background-color: $danger;
      color: $white;

      img {
        filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
      }
    }
  }
}
</style>
