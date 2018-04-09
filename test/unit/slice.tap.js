import test from 'tape'
import {
  setMouseDragTracking,
  setTouchDragTracking,
  setValuesFromNewSliceStartPoint,
  setValuesFromNewSliceEndPoint,
  setValuesFromNewSliceHeadPoint
}
from '../../src/slice'


test('Event Tracking Functions', t => {

  t.plan(2)

  const actualMouse = typeof setMouseDragTracking,
    actualTouch = typeof setTouchDragTracking,
    expected = 'function'

  t.equal(actualMouse, expected, 'Slice module default should have setMouseDragTracking function.')

  t.equal(actualTouch, expected, 'Slice module default should have setTouchDragTracking function.')

  t.end()
})

test('Slice Values Functions', t => {

  t.plan(3)

  const actualStartFunction = typeof setValuesFromNewSliceStartPoint,
    actualEndFunction = typeof setValuesFromNewSliceEndPoint,
    actualHeadFunction = typeof setValuesFromNewSliceHeadPoint,
    expected = 'function'

  t.equal(actualStartFunction, expected, 'Slice module default should have setValuesFromNewSliceStartPoint function.')

  t.equal(actualEndFunction, expected, 'Slice module default should have setValuesFromNewSliceEndPoint function.')

  t.equal(actualHeadFunction, expected, 'Slice module default should have setValuesFromNewSliceHeadPoint function.')

  t.end()

})
