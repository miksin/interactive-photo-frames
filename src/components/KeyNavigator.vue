<template>
  <div class="key-navigator">
    <div
      v-for="keyCode in keyCodes"
      :key="keyCode.key"
      class="key-item"
    >
      {{ keyCode.key }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { KeyCodes } from '../models/enums'

@Component
export default class KeyNavigator extends Vue {
  get actives (): number[] {
    return this.$store.state.keyboardWrapper.actives
  }

  get keyCodes (): { key: string, code: number }[] {
    return this.actives.map(code => ({
      key: KeyCodes[code],
      code
    })).filter(d => Object.keys(KeyCodes).includes(d.key))
  }
}
</script>

<style lang="scss" scoped>
.key-navigator {
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
  left: 50%;
  top: 90%;
  transform: translate(-50%, -50%);

  @include flex();
  @include flex-align();

  .key-item {
    color: $white;
    padding: 24px;
    margin: auto 4px;
    border-radius: 10px;
    background-color: rgba($color: $grey, $alpha: 0.5);
  }
}
</style>
