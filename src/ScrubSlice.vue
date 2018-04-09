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

  //Apply this on future release.
  //const SLICE_ABS_MINIMUM = 1
  //
  //https://alligator.io/vuejs/component-lifecycle/

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
      sliceStart: {
        type: Number,
        default: 0
      },
      sliceEnd: {
        type: Number,
        default: 500
      },
      sliceLength: {
        type: Number,
        default: 500
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

      //We need to make sure any props that are set are controlled within the
      //boundaries of the full length and maximum and minimum boaundaries

      //Move all of this calculation into range module

      //Values are at this time all resticted by the startValue
      //Should we have some way of detecting if props have been changed
      //Maybe have default of -1 so that sliceEnd or sliceLength can take presidence

      //Except slice maximum and slice minimum they should always be set
      //
      const fitNumberInRange = (value, start, end) => {
        return Math.max(start, Math.min(end, value))
      }

      const sliceStartValue = fitNumberInRange(this.sliceStart, 0, this.totalLength - this.sliceMinimum),
        sliceEndValue = fitNumberInRange(this.sliceEnd, sliceStartValue + this.sliceMinimum, sliceStartValue + this.sliceMaximum),
        sliceLengthValue = Math.min(this.sliceLength, sliceEndValue - sliceStartValue)

      return {
        sliceStartValue: sliceStartValue,
        sliceStartPercent: Math.round((sliceStartValue / this.totalLength) * 100),
        sliceEndValue: sliceEndValue,
        sliceEndPercent: Math.round((sliceEndValue / this.totalLength) * 100),
        sliceLengthValue: sliceLengthValue,
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
          sliceLengthValue: this.sliceLengthValue,
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
        this.setValuesFromDragState(e.state)
      },

      onDragStop (e) {
        this.setValuesFromDragState(e.state, true)
        //Detect if has event listener
        //if so emit event rather than set model
        //Question this for next release
      },

      setValuesFromDragState(state, emit = false) {
        const {
            sliceStartValue,
            sliceStartPercent,
            sliceEndValue,
            sliceEndPercent,
            sliceLengthValue,
            sliceHeadValue,
            dragging
          } = state

        this.sliceStartValue = sliceStartValue
        this.sliceStartPercent = sliceStartPercent
        this.sliceEndValue = sliceEndValue
        this.sliceEndPercent = sliceEndPercent
        this.sliceLengthValue = sliceLengthValue
        this.sliceHeadValue = sliceHeadValue
        this.dragging = dragging

        if(emit) {
          this.$emit('change', {
            sliceStartValue,
            sliceStartPercent,
            sliceEndValue,
            sliceEndPercent,
            sliceLengthValue,
            sliceHeadValue,
            dragging
          })
        }
      }
    },

    mounted() {
      this.$emit('change', {
        sliceStartValue: this.sliceStartValue,
        sliceStartPercent: this.sliceStartPercent,
        sliceEndValue: this.sliceEndValue,
        sliceEndPercent: this.sliceEndPercent,
        sliceLengthValue: this.sliceLengthValue,
        sliceHeadValue: this.sliceHeadValue,
        dragging: false
      })
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
