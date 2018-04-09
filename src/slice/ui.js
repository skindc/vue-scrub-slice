import {
  setValuesFromNewSliceStartPoint,
  setValuesFromNewSliceEndPoint,
  setValuesFromNewSliceHeadPoint
}
from './range'

export function getElementViewLeft(document, element) {
  let actualLeft = element.offsetLeft,
    current = element.offsetParent,
    elementScrollLeft
  while (current !== null) {
    actualLeft += current.offsetLeft
    current = current.offsetParent
  }
  elementScrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft
  return actualLeft - elementScrollLeft
}

export function getThumbPercentagePosition(document, bar, element) {
  const barWidth = bar.clientWidth
  let percentage = (element.clientX - getElementViewLeft(document, bar)) / barWidth
  percentage = percentage > 0 ? percentage : 0
  percentage = percentage < 1 ? percentage : 1
  return percentage
}

export function setValuesForElementChange(e, percentage, state) {

  const action = {
    'vss-slice-start-handle': setValuesFromNewSliceStartPoint,
    'vss-slice-end-handle': setValuesFromNewSliceEndPoint,
    'vss-slice-head-handle': setValuesFromNewSliceHeadPoint
  }[e.srcElement.className]

  if (action) {
    return action(percentage, state)
  }
  else {
    return state
  }
}

export function setMouseDragTracking(document, bar, element, context, moveCallback, endCallback) {

  let state = { ...context
  }

  var moveHandler = (e) => {
      const percentage = getThumbPercentagePosition(document, bar, e)
      state = setValuesForElementChange(element, percentage, state)
      moveCallback({
        state: { ...state
        }
      })
    },
    stopHandler = (e) => {
      document.removeEventListener('mouseup', stopHandler)
      document.removeEventListener('mousemove', moveHandler)
      const percentage = getThumbPercentagePosition(document, bar, e)
      //context.dragging = false;
      state = setValuesForElementChange(element, percentage, state)
      state.dragging = false
      endCallback({
        state: { ...state
        }
      })
    }

  state.dragging = true

  moveCallback({
    state: { ...state
    }
  })

  document.addEventListener('mousemove', moveHandler)
  document.addEventListener('mouseup', stopHandler)
}

export function setTouchDragTracking(document, bar, element, context, moveCallback, endCallback) {

  let state = { ...context
  }

  var moveHandler = (e) => {
      const touch = e.changedTouches[0],
        percentage = getThumbPercentagePosition(document, bar, touch)

      state = setValuesForElementChange(element, percentage, context)
      moveCallback({
        state: { ...state
        }
      })
    },

    stopHandler = (e) => {
      document.removeEventListener('touchend', stopHandler)
      document.removeEventListener('touchmove', moveHandler)

      const touch = e.changedTouches[0],
        percentage = getThumbPercentagePosition(document, bar, touch)

      state = setValuesForElementChange(element, percentage, state)
      state.dragging = false
      endCallback({
        state: { ...state
        }
      })
    }

  state.dragging = true

  moveCallback({
    state: { ...state
    }
  })

  document.addEventListener('touchmove', this.moveHandler)
  document.addEventListener('touchend', this.stopHandler)
}
