<template>
  <div class='container' id="app">
    <div class="tb-ma-controller tb-ma-block">
      <scrub-slice
        :totalLength='media.length'
        :sliceMaximum=5000
        :sliceMinimum=3000
        :sliceSnap=100
        :sliceHeadSnap=50
        :sliceEnd=8000
        @change='onScrubChange'/>
      <div class="tb-ma-controller-info">
        <p><span><small>{{sliceStartPercent}} : </small></span>
        <span><small>{{sliceEndPercent}} : </small></span>
        <span><small>{{sliceStartValue}} : </small></span>
        <span><small>{{sliceEndValue}} : </small></span>
        <span><small>{{sliceLength}} : </small></span>
        <span><small>{{sliceHeadValue}} : </small></span></p>
        <p><span><small>{{media.length}}</small></span></p>
      </div>
    </div>
  </div>
</template>

<script>
import ScrubSlice from './ScrubSlice'

export default {

    name: 'app',
    components: {
      ScrubSlice
    },
    props: {
      media: {
        type: Object,
        default() {
          return {
            length: 10000
          }
        }
      }
    },
    data() {
      return {
        sliceStartPercent: 0,
        sliceStartValue: 0,
        sliceEndPercent: 0,
        sliceEndValue: 0,
        sliceLength: 0,
        sliceHeadValue: 0
      }
    },
    methods: {
      onScrubChange(state) {
        this.sliceStartPercent = state.sliceStartPercent
        this.sliceStartValue = state.sliceStartValue
        this.sliceEndPercent = state.sliceEndPercent
        this.sliceEndValue = state.sliceEndValue
        this.sliceLength = state.sliceLength
        this.sliceHeadValue = state.sliceHeadValue
      }
    }
  }

</script>

<style lang='scss'>

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .tb-ma-controller {
    width: 100%;
    min-height: 50px;
    display: flex;
    flex-flow: column;
    padding: 10px;
  }

  .tb-ma-controller-info {
    margin-top: 1em;
    min-height: 1em;
  }

</style>
