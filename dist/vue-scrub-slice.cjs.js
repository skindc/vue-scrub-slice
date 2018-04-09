/*!
 * @skindc/vue-scrub-slice v0.0.1-beta.1
 * (c) 2018-present Gary Law <skin@skindc.co.uk>
 * Released under the MIT License.
 */
'use strict';

function setValuesFromNewSliceStartPoint(percentage, state) {
  //Ensure range boundaries do not exceed each other
  var maximum = state.sliceMaximum,
      minimum = Math.min(maximum, state.sliceMinimum),
      sliceStartPoint = Math.min(state.totalLength - minimum, Math.floor(state.totalLength * percentage / state.sliceSnap) * state.sliceSnap),
      sliceLength = Math.min(maximum, Math.max(minimum, state.sliceEndValue - sliceStartPoint));
  return Object.assign({}, state, {
    sliceStartValue: sliceStartPoint,
    sliceEndValue: Math.max(sliceStartPoint + state.sliceMinimum, sliceStartPoint + sliceLength),
    sliceLength: sliceLength,
    sliceHeadValue: Math.min(sliceLength, state.sliceHeadValue)
  });
}
function setValuesFromNewSliceEndPoint(percentage, state) {
  //Ensure range boundaries do not exceed each other
  var maximum = state.sliceMaximum,
      minimum = Math.min(maximum, state.sliceMinimum),
      sliceEndPoint = Math.max(minimum, Math.floor(state.totalLength * percentage / state.sliceSnap) * state.sliceSnap),
      sliceLength = Math.min(maximum, Math.max(minimum, sliceEndPoint - state.sliceStartValue)),
      sliceStartValue = Math.min(sliceEndPoint - minimum, sliceEndPoint - sliceLength);
  return Object.assign({}, state, {
    sliceStartValue: sliceStartValue,
    sliceEndValue: sliceEndPoint,
    sliceLength: sliceLength,
    sliceHeadValue: Math.min(sliceLength, state.sliceHeadValue)
  });
}
function setValuesFromNewSliceHeadPoint(percentage, state) {
  //get play scrub handle position on bar
  var headPoint = Math.floor(state.totalLength * percentage / state.sliceHeadSnap) * state.sliceHeadSnap;
  var sliceHeadValue = Math.max(0, headPoint - state.sliceStartValue);
  return Object.assign({}, state, {
    sliceHeadValue: Math.min(state.sliceStartValue + sliceHeadValue, state.sliceEndValue) - state.sliceStartValue
  });
}

function getElementViewLeft(document, element) {
  var actualLeft = element.offsetLeft,
      current = element.offsetParent,
      elementScrollLeft;

  while (current !== null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }

  elementScrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft;
  return actualLeft - elementScrollLeft;
}
function getThumbPercentagePosition(document, bar, element) {
  var barWidth = bar.clientWidth;
  var percentage = (element.clientX - getElementViewLeft(document, bar)) / barWidth;
  percentage = percentage > 0 ? percentage : 0;
  percentage = percentage < 1 ? percentage : 1;
  return percentage;
}
function setValuesForElementChange(e, percentage, state) {
  var action = {
    'vss-slice-start-handle': setValuesFromNewSliceStartPoint,
    'vss-slice-end-handle': setValuesFromNewSliceEndPoint,
    'vss-slice-head-handle': setValuesFromNewSliceHeadPoint
  }[e.srcElement.className];

  if (action) {
    return action(percentage, state);
  } else {
    return state;
  }
}
function setMouseDragTracking(document, bar, element, context, moveCallback, endCallback) {
  var state = Object.assign({}, context);

  var moveHandler = function moveHandler(e) {
    var percentage = getThumbPercentagePosition(document, bar, e);
    state = setValuesForElementChange(element, percentage, state);
    moveCallback({
      state: Object.assign({}, state)
    });
  },
      stopHandler = function stopHandler(e) {
    document.removeEventListener('mouseup', stopHandler);
    document.removeEventListener('mousemove', moveHandler);
    var percentage = getThumbPercentagePosition(document, bar, e); //context.dragging = false;

    state = setValuesForElementChange(element, percentage, state);
    state.dragging = false;
    endCallback({
      state: Object.assign({}, state)
    });
  };

  state.dragging = true;
  moveCallback({
    state: Object.assign({}, state)
  });
  document.addEventListener('mousemove', moveHandler);
  document.addEventListener('mouseup', stopHandler);
}
function setTouchDragTracking(document, bar, element, context, moveCallback, endCallback) {
  var state = Object.assign({}, context);

  state.dragging = true;
  moveCallback({
    state: Object.assign({}, state)
  });
  document.addEventListener('touchmove', this.moveHandler);
  document.addEventListener('touchend', this.stopHandler);
}

var ScrubSlice = {
  render: function render() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      ref: "controlContainer",
      staticClass: "vss-scrub",
      on: {
        "mousedown": _vm.onThumbMouseDown,
        "touchstart": _vm.onThumbTouchStart
      }
    }, [_c('div', {
      class: {
        'media-slice-bar': true,
        'dragging': _vm.dragging
      }
    }, [_c('div', {
      staticClass: "vss-bar-whole"
    }), _vm._v(" "), _c('div', {
      staticClass: "vss-bar-slice",
      style: {
        left: _vm.startPosition,
        width: _vm.clipWidth
      }
    }), _vm._v(" "), !_vm.sliced ? _c('div', {
      ref: "sliceStartThumbclass",
      staticClass: "vss-slice-start-handle",
      style: {
        left: _vm.startPosition
      }
    }) : _vm._e(), _vm._v(" "), !_vm.sliced ? _c('div', {
      ref: "sliceEndThumbclass",
      staticClass: "vss-slice-end-handle",
      style: {
        left: _vm.endPosition
      }
    }) : _vm._e(), _vm._v(" "), _c('div', {
      ref: "sliceHeadPositionThumbclass",
      staticClass: "vss-slice-head-handle",
      style: {
        left: _vm.sliceHeadPosition
      }
    })])]);
  },
  staticRenderFns: [],
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
  data: function data() {
    return {
      sliceStartValue: 0,
      sliceStartPercent: 0,
      sliceEndValue: Math.min(this.totalLength, this.sliceMaximum),
      sliceEndPercent: this.sliceEndValue / this.totalLength,
      sliceLength: Math.min(this.totalLength, this.sliceMaximum),
      sliceHeadValue: 0,
      dragging: false
    };
  },
  computed: {
    startPosition: function startPosition() {
      return this.sliceStartValue / this.totalLength * 100 + "%";
    },
    endPosition: function endPosition() {
      return this.sliceEndValue / this.totalLength * 100 + "%";
    },
    sliced: function sliced() {
      return this.actualSliceMinimum >= this.totalLength;
    },
    clipWidth: function clipWidth() {
      return this.actualSliceMinimum >= this.totalLength ? '100%' : (this.sliceEndValue - this.sliceStartValue) / this.totalLength * 100 + "%";
    },
    sliceHeadPosition: function sliceHeadPosition() {
      return (this.sliceStartValue + this.sliceHeadValue) / this.totalLength * 100 + "%";
    },
    //Add safety to ranges for props
    actualSliceMaximum: function actualSliceMaximum() {
      return Math.min(this.totalLength, this.sliceMaximum);
    },
    actualSliceMinimum: function actualSliceMinimum() {
      return Math.min(this.totalLength, this.sliceMinimum);
    },
    actualSliceSnap: function actualSliceSnap() {
      return Math.min(this.totalLength, this.sliceSnap);
    },
    actualSliceHeadSnap: function actualSliceHeadSnap() {
      return Math.min(this.totalLength, this.sliceHeadSnap);
    }
  },
  methods: {
    getContext: function getContext() {
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
      };
    },
    onThumbMouseDown: function onThumbMouseDown(e) {
      setMouseDragTracking(document, this.$refs.controlContainer, e, this.getContext(), this.onDrag, this.onDragStop);
      this.$emit('dragbegin');
    },
    onThumbTouchStart: function onThumbTouchStart(e) {
      setTouchDragTracking(document, this.$refs.controlContainer, e, this.getContext(), this.onDrag, this.onDragStop);
      this.$emit('dragbegin');
    },
    onDrag: function onDrag(e) {
      //Detect if has event listener
      //if so emit event rather than set model
      this.sliceStartValue = e.state.sliceStartValue;
      this.sliceEndValue = e.state.sliceEndValue;
      this.sliceLength = e.state.sliceLength;
      this.dragging = e.state.dragging;
      this.sliceHeadValue = e.state.sliceHeadValue;
      this.$emit('drag');
    },
    onDragStop: function onDragStop(e) {
      //Detect if has event listener
      //if so emit event rather than set model
      this.sliceStartValue = e.state.sliceStartValue;
      this.sliceEndValue = e.state.sliceEndValue;
      this.sliceLength = e.state.sliceLength;
      this.dragging = e.state.dragging;
      this.sliceHeadValue = e.state.sliceHeadValue;
      this.$emit('dragend');
      this.$emit('change', Object.assign({}, e.state));
    }
  },

  /**
   * Install ScrubSlice components.
   * @param {Vue} Vue
   * @param {{ name: string }} [options]
   */
  install: function install(Vue) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$name = _ref.name,
        name = _ref$name === void 0 ? 'scrub-slice' : _ref$name;

    Vue.component(name, this);
  }
};

module.exports = {
  install: function install(Vue) {
    Vue.component('scrub-slice', ScrubSlice);
  }
};
