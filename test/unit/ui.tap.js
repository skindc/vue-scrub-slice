import test from 'tape'
import {
  setTouchDragTracking
}
from '../../src/slice/ui'


test('Event Tracking Function', t => {
  const actual = typeof setTouchDragTracking,
    expected = 'function'

  t.equal(actual, expected, 'Range module default should have setTouchDragTracking function.')
  t.end()
})
