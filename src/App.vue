<template>
  <div id="app">
    <div v-if="routes.length > 0" id="nav">
      <router-link
        v-for="route in routes"
        :key="route.name"
        :to="route.path"
      >
        {{ route.name }}
      </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { routes } from './router'

@Component
export default class App extends Vue {
  get routes (): { path: string, name: string }[] {
    return routes.map(r => ({
      path: r.path,
      name: r.name
    }))
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
  margin-top: 60px;
}

#nav {
  @include flex();
  @include flex-align();
  margin: auto;

  a {
    color: $primary;
    text-decoration: none;
  }

  a.router-link-exact-active {
    color: $success;
    cursor: default;
  }
}
</style>
