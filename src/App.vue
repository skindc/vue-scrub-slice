<template>
  <div class='container' id="app">
    <scrub-slice
      :totalLength='media.length'
      :sliceMaximum=30000
      :sliceMinimum=3000
      :sliceSnap=100
      :sliceHeadSnap=50
    />
  </div>
</template>

<script>
import ScrubSlice from './ScrubSlice'

export default {
  name: 'app',
  components: {
    ScrubSlice
  },
  data() {
    return {
      media: {
        length: 120000
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
