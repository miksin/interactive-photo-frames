<template>
  <div class="home">
    <div
      v-for="frame in frames"
      :key="frame.id"
    >
      <FlexibleFrame :frame="frame" />
      <button @click="handleUpdateFrame(frame)">update</button>
    </div>
    <button @click="handleAddFrame">add</button>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import FlexibleFrame from '../components/FlexibleFrame'
import FrameModel from '../models/Frame'

@Component({
  components: {
    FlexibleFrame
  },
  computed: {
    ...mapState([
      'frames'
    ])
  },
  methods: {
    handleAddFrame () {
      this.$store.commit('addFrame', { input: {} })
    },
    handleUpdateFrame (frame) {
      this.$store.commit('updateFrame', {
        frame,
        input: { name: 'ok!' }
      })
    }
  }
})
export default class Home extends Vue {
}
</script>

<style lang="scss" scoped>
</style>
