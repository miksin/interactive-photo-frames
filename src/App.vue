<template>
  <div id="app">
    <div id="router-view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { routes } from './router'
import { KeyCodes } from './models/enums'

@Component
export default class App extends Vue {
  get routes (): { path: string, name: string }[] {
    return routes.map(r => ({
      path: r.path,
      name: r.name
    }))
  }

  created () {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (Object.keys(KeyCodes).includes(`${e.keyCode}`)) e.preventDefault()
      this.$store.commit('activateKey', { code: e.keyCode })
    })
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      e.preventDefault()
      this.$store.commit('deactivateKey', { code: e.keyCode })
    })
    window.addEventListener('blur', () => {
      this.$store.commit('resetKey')
    })
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
}

#nav {
  @include flex();
  @include flex-align();
  margin: auto;
  position: absolute;
  left: 0;
  top: 0;

  a {
    color: $primary;
    text-decoration: none;
  }

  a.router-link-exact-active {
    color: $success;
    cursor: default;
  }
}

#router-view {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
