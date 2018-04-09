export function setValuesFromNewSliceStartPoint(percentage, state) {

  //Ensure range boundaries do not exceed each other
  const maximum = state.sliceMaximum,
    minimum = Math.min(maximum, state.sliceMinimum),
    sliceStartPoint = Math.min(state.totalLength - minimum, Math.floor((state.totalLength * percentage) / state.sliceSnap) * state.sliceSnap),
    sliceLength = Math.min(maximum, Math.max(minimum, state.sliceEndValue - sliceStartPoint))

  return {
    ...state,
    sliceStartValue: sliceStartPoint,
    sliceEndValue: Math.max(sliceStartPoint + state.sliceMinimum, sliceStartPoint + sliceLength),
    sliceLengthValue: sliceLength,
    sliceHeadValue: Math.min(sliceLength, state.sliceHeadValue)
  }
}

export function setValuesFromNewSliceEndPoint(percentage, state) {

  //Ensure range boundaries do not exceed each other
  const maximum = state.sliceMaximum,
    minimum = Math.min(maximum, state.sliceMinimum),
    sliceEndPoint = Math.max(minimum, Math.floor((state.totalLength * percentage) / state.sliceSnap) * state.sliceSnap),
    sliceLength = Math.min(maximum, Math.max(minimum, sliceEndPoint - state.sliceStartValue)),
    sliceStartValue = Math.min(sliceEndPoint - minimum, sliceEndPoint - sliceLength)

  return {
    ...state,
    sliceStartValue: sliceStartValue,
    sliceEndValue: sliceEndPoint,
    sliceLengthValue: sliceLength,
    sliceHeadValue: Math.min(sliceLength, state.sliceHeadValue)
  }
}

export function setValuesFromNewSliceHeadPoint(percentage, state) {

  //get play scrub handle position on bar
  const headPoint = Math.floor((state.totalLength * percentage) / state.sliceHeadSnap) * state.sliceHeadSnap
  let sliceHeadValue = Math.max(0, headPoint - state.sliceStartValue)
  return {
    ...state,
    sliceHeadValue: Math.min(state.sliceStartValue + sliceHeadValue, state.sliceEndValue) - state.sliceStartValue
  }
}
