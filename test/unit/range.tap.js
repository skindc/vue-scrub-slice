import test from 'tape'
import {
  setValuesFromNewSliceStartPoint,
  setValuesFromNewSliceEndPoint,
  setValuesFromNewSliceHeadPoint
}
from '../../src/slice/range'


//Test Accessible API methods

test('Values From New Start Point Function', t => {
  const actual = typeof setValuesFromNewSliceStartPoint,
    expected = 'function'

  t.equal(actual, expected, 'Range module default should have setValuesFromNewSliceStartPoint function.')
  t.end()
})

test('Values From New End Point Function', t => {
  const actual = typeof setValuesFromNewSliceEndPoint,
    expected = 'function'

  t.equal(actual, expected, 'Range module default should have setValuesFromNewSliceEndPoint function.')
  t.end()
})

test('Values From New Head Point Function', t => {
  const actual = typeof setValuesFromNewSliceHeadPoint,
    expected = 'function'

  t.equal(actual, expected, 'Range module default should have setValuesFromNewSliceHeadPoint function.')
  t.end()
})


test('Correct clip length when start move ', t => {

  t.plan(5)

  const startState = {
      totalLength: 100, // Total length is 100 units
      sliceMaximum: 80, // The clip can be a maximum of 80 units
      sliceMinimum: 30, // The clip can be a minimum of 30 units
      sliceLength: 80, // The clip starts at its maximum 80 units
      sliceSnap: 1, // The clip change movements units are whole integers
      sliceStartValue: 0, // Clip is at start of full length
      sliceStartPercent: 0, // Currently not implemented
      sliceEndValue: 80, // Clip end is at the slices maximum value of units
      sliceEndPercent: 80, // Currently not implemented
      sliceHeadValue: 0, // The clip head is at the start of the clip
      sliceHeadSnap: 1 // The clip head change movements units are whole integers
    },

    //When the start position is moved in positive direction the clip should reduce until
    //it reaches its minimum value.
    expectedFirst = {
      totalLength: 100,
      sliceMaximum: 80,
      sliceMinimum: 30,
      sliceLength: 70, // The clip should reduce by 10 units ( 0.1 precent of total)
      sliceSnap: 1,
      sliceStartValue: 10, // The clip start moved is at 10 units (0.1 precent of total)
      sliceStartPercent: 0, // Currently not implemented
      sliceEndValue: 80, // The clip end should maintain its value
      sliceEndPercent: 80, // Currently not implemented
      sliceHeadValue: 0, //The clip head should maintain its unit value in at the start of the clip
      sliceHeadSnap: 1
    },
    actualFirst = setValuesFromNewSliceStartPoint(0.1, startState);

  t.deepEqual(actualFirst, expectedFirst, 'relative length, end and head units are correct when start move without impeaching minimum limit of clip.')

  const expectedSecond = {
      totalLength: 100,
      sliceMaximum: 80,
      sliceMinimum: 30,
      sliceLength: 30,
      sliceSnap: 1,
      sliceStartValue: 60, //Should be at 60 as per 0.6 percentage argument
      sliceStartPercent: 0,
      sliceEndValue: 90, //Should now be 90 becuas eof the minimum of 30
      sliceEndPercent: 80,
      sliceHeadValue: 0,
      sliceHeadSnap: 1
    },
    actualSecond = setValuesFromNewSliceStartPoint(0.6, startState);

  t.deepEqual(actualSecond, expectedSecond, 'length and end point are correct when start move past minimum.')

  const expectedThird = {
      totalLength: 100,
      sliceMaximum: 80,
      sliceMinimum: 30,
      sliceLength: 30,
      sliceSnap: 1,
      sliceStartValue: 70, //Should be at 70 as .9 percent will exceed length and minimum
      sliceStartPercent: 0,
      sliceEndValue: 100, //Should now be 100 becuas of the minimum of 30
      sliceEndPercent: 80,
      sliceHeadValue: 0,
      sliceHeadSnap: 1
    },
    actualThird = setValuesFromNewSliceStartPoint(0.9, startState);

  t.deepEqual(actualThird, expectedThird, 'length, start and end point are correct when start move past  full length.')

  // Slice at end of total, dragged should resize clip within maximum

  const startFromEnd = {
      totalLength: 100,
      sliceMaximum: 80,
      sliceMinimum: 30,
      sliceLength: 30,
      sliceSnap: 1,
      sliceStartValue: 70, //we start at 70 as this is the maximum start can be with max and min range
      sliceStartPercent: 0,
      sliceEndValue: 100, //we end at 100 as this is the end of the total length
      sliceEndPercent: 80,
      sliceHeadValue: 0,
      sliceHeadSnap: 1
    },

    expectedFourth = {
      totalLength: 100,
      sliceMaximum: 80,
      sliceMinimum: 30,
      sliceLength: 50,
      sliceSnap: 1,
      sliceStartValue: 50, //Should be at 60 as per 0.6 percentage argument
      sliceStartPercent: 0,
      sliceEndValue: 100, //Should stay at 100 until maximum reached
      sliceEndPercent: 80,
      sliceHeadValue: 0,
      sliceHeadSnap: 1
    },
    actualFourth = setValuesFromNewSliceStartPoint(0.5, startFromEnd);

  t.deepEqual(actualFourth, expectedFourth, 'length, start and end point are correct when start move back from past minimum and full length.')


  const expectedFifth = {
      totalLength: 100,
      sliceMaximum: 80,
      sliceMinimum: 30,
      sliceLength: 80,
      sliceSnap: 1,
      sliceStartValue: 10, //Should be at 20 as per 0.2 percentage argument
      sliceStartPercent: 0,
      sliceEndValue: 90, //Should be at 90 as drag is past maximum
      sliceEndPercent: 80,
      sliceHeadValue: 0,
      sliceHeadSnap: 1
    },
    actualFifth = setValuesFromNewSliceStartPoint(0.1, startFromEnd);

  t.deepEqual(actualFifth, expectedFifth, 'length, start and end point are correct when start move back past maximum from past maximum and full length.')

  t.end()

})


/// Test end point dragging

//Test play point

/// Test snap points


/// TEst that all intial values of state are corrected if out of bounds


test('Correct clip endValue if intials state out of bounds ', t => {

  //Test that values still come out correct even if intial state is out of bounds in regards to clip limits
  t.end()

})
