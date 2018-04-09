<template>
  <div
    ref="controlContainer"
    @mousedown="onThumbMouseDown"
    @touchstart="onThumbTouchStart"
    class="vss-scrub">

    <div v-bind:class="{'media-slice-bar': true, 'dragging': dragging}">
      <div
        class="vss-bar-whole"
      />
      <div
        class="vss-bar-slice"
        v-bind:style="{left: startPosition, width: clipWidth}"/>
      <div
        v-if="!sliced"
        ref="sliceStartThumbclass"
        class="vss-slice-start-handle"
        v-bind:style="{left: startPosition}"/>
      <div
        v-if="!sliced"
        ref="sliceEndThumbclass"
        class="vss-slice-end-handle"
        v-bind:style="{left: endPosition}"/>
      <div
        ref="sliceHeadPositionThumbclass"
        class="vss-slice-head-handle"
        v-bind:style="{left: sliceHeadPosition}"/>
    </div>
  </div>
</template>

<script>

  import {setMouseDragTracking, setTouchDragTracking} from './slice'

  export default {
    props: {
      totalLength: {
        type: Number,
        default: 1000
      },
      sliceMaximum: {
        type: Number,
        default: 500
      },
      sliceMinimum: {
        type: Number,
        default: 100
      },
      sliceSnap: {
        type: Number,
        default: 1
      },
      sliceHeadSnap: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        sliceStartValue: 0,
        sliceStartPercent: 0,
        sliceEndValue: Math.min(this.totalLength, this.sliceMaximum),
        sliceEndPercent: this.sliceEndValue / this.totalLength,
        sliceLength: Math.min(this.totalLength, this.sliceMaximum),
        sliceHeadValue: 0,
        dragging: false
      }
    },
    computed: {
      startPosition () {
        return ((this.sliceStartValue / this.totalLength) * 100) + "%"
      },
      endPosition () {
        return ((this.sliceEndValue / this.totalLength) * 100) + "%"
      },
      sliced () {
        return this.actualSliceMinimum >= this.totalLength
      },
      clipWidth () {
        return this.actualSliceMinimum >= this.totalLength ? '100%' : (((this.sliceEndValue - this.sliceStartValue) / this.totalLength) * 100) + "%"
      },
      sliceHeadPosition () {
        return (((this.sliceStartValue + this.sliceHeadValue) / this.totalLength) * 100) + "%"
      },
      //Add safety to ranges for props
      actualSliceMaximum () {
        return Math.min(this.totalLength, this.sliceMaximum)
      },
      actualSliceMinimum () {
        return Math.min(this.totalLength, this.sliceMinimum)
      },
      actualSliceSnap () {
        return Math.min(this.totalLength, this.sliceSnap)
      },
      actualSliceHeadSnap () {
        return Math.min(this.totalLength, this.sliceHeadSnap)
      }
    },
    methods: {
      getContext () {
        return {
          totalLength: this.totalLength,
          sliceMaximum: this.actualSliceMaximum,
          sliceMinimum: this.actualSliceMinimum,
          sliceLength: this.sliceLength,
          sliceSnap: this.actualSliceSnap,
          sliceStartValue: this.sliceStartValue,
          sliceStartPercent: this.sliceStartPercent,
          sliceEndValue: this.sliceEndValue,
          sliceEndPercent: this.sliceEndPercent,
          sliceHeadValue: this.sliceHeadValue,
          sliceHeadSnap: this.actualSliceHeadSnap
        }
      },
      onThumbMouseDown (e) {
        setMouseDragTracking(document, this.$refs.controlContainer, e, this.getContext(), this.onDrag, this.onDragStop)
        this.$emit('dragbegin')
      },
      onThumbTouchStart (e) {
        setTouchDragTracking(document, this.$refs.controlContainer, e, this.getContext(), this.onDrag, this.onDragStop)
        this.$emit('dragbegin')
      },
      onDrag(e) {
        //Detect if has event listener
        //if so emit event rather than set model
        this.sliceStartValue = e.state.sliceStartValue
        this.sliceEndValue = e.state.sliceEndValue
        this.sliceLength = e.state.sliceLength
        this.dragging = e.state.dragging
        this.sliceHeadValue = e.state.sliceHeadValue
        this.$emit('drag')
      },
      onDragStop (e) {
        //Detect if has event listener
        //if so emit event rather than set model
        if(this.$listeners.change) {
          this.$emit('change', {...e.state})
        } else {
          this.sliceStartValue = e.state.sliceStartValue
          this.sliceEndValue = e.state.sliceEndValue
          this.sliceLength = e.state.sliceLength
          this.dragging = e.state.dragging
          this.sliceHeadValue = e.state.sliceHeadValue
        }
      }
    },

    /**
     * Install ScrubSlice components.
     * @param {Vue} Vue
     * @param {{ name: string }} [options]
     */
    install (Vue, { name = 'scrub-slice' } = {}) {
      Vue.component(name, this)
    }
  }

</script>

<style lang='scss'>

  .vss-slice-start-handle {
    position: absolute;
    width: 0.5em;
    height: 1em;
    &:after {
      content: "";
      position: absolute;
      width: .5em;
      height: 1em;
      border-bottom-left-radius: 1em;
      background: #DDD;
      cursor: pointer;
      left: -.5em;
      top: 1em;
    }
    &:before {
      content: "";
      position: absolute;
      width:1px;
      height: 2em;
      background: #DDD;
      left: 0;

    }
  }

  .vss-slice-end-handle {
    position: absolute;
    width: 0.5em;
    height: 1em;
    &:after {
      content: "";
      position: absolute;
      width: .5em;
      height: 1em;
      border-bottom-right-radius: 1em;
      background: #DDD;
      cursor: pointer;
      left: 0;
      top: 1em;
    }
    &:before {
      content: "";
      position: absolute;
      width:1px;
      height: 2em;
      background: #DDD;
      left: 0;

    }
  }

  .vss-slice-head-handle {
    position: absolute;
    width: 1em;
    height: 1em;
    &:after {
      content: "";
      position: absolute;
      width: .5em;
      height: 1em;
      background: #CFC;
      cursor: pointer;
      left: -.25em;
      top: 0;
    }
    &:before {
      content: "";
      position: absolute;
      width:1px;
      height: 2em;
      background: #CFC;
      left: 0;

    }
  }

  .media-slice-bar{
    position: relative;
    width: 100%;
    &.dragging {
      cursor: pointer;
    }
  }

  .vss-bar-slice{
    position:absolute;
    height: 2px;
    top: 50%;
    background: #CFC;
  }

  .vss-bar-whole{
    position:absolute;
    width: 100%;
    height: 2px;
    top: 50%;
    background: #CCC;
  }

  .tb-ma-controller {
    width: 100%;
    min-height: 50px;
    display: flex;
    flex-flow: column;
    padding: 10px;
  }

  .vss-scrub {
    display: flex;
    min-height: 2em;
    margin: 10px;
  }

</style>
