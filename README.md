# Vue Scrub Slice

A Vue 2 component for defining start and end of slice of specified length

<img
  width="500"
  src="./demo/images/ScrubSlice.png"
  alt="Screenshot of a ScrubSlice component"
  title="Screenshot of a ScrubSlice component"
/>

## Install

Install from npm.

```sh
npm install @skindc/vue-scrub-slice
```

With `Vue.use` function declare vue-scrub-slice components.

```js
import '@skindc/vue-scrub-slice/dist/vue-scrub-slice.css'
import Vue from 'vue'
import ScrubSlice from 'vue-scrub-slice'

Vue.use(ScrubSlice)
```

You can also import just components you need, without installing globally.

```vue
<template>
   <scrub-slice
      :totalLength=60000
      :sliceMaximum=30000
      :sliceMinimum=3000
      :sliceSnap=100
      :sliceHeadSnap=50
    />
</template>

<script>
import { ScrubSlice } from '@skindc/vue-scrub-slice'

export default {
  components: { ScrubSlice },
  ...
}
</script>
```

## Component Props

Name               | Type                                     | Default  | About
----               | ----                                     | -------  | -----
totalLength        | Number                                   | 1000     | The total length to be sliced
sliceMaximum       | Number                                   | 500      | The maximum value of the slice
sliceMinimum       | Number                                   | 100      | The maximum value of the slice
sliceStart         | Number                                   | 0        | The value of the slices's initial start position
sliceEnd           | Number                                   | 500      | The value of the slices's initial end position
sliceLength        | Number                                   | 500      | The value of the slices's initial length
sliceSnap          | Number                                   | 1        | The snap point unit for movement of slice start and end
sliceHeadSnap      | Number                                   | 1        | The snap point unit for movement of slice head

It is important to note that is any of these values are set and contradict boundary values they will be changed internally to ensure they are valid against other model values.

For example

If sliceEnd is greater than sliceStart and sliceMaximum it will be reduced to fit in the slice boundary.

## State Properties

The state object that is the payload of the change events only includes the properties that are mutable internally

Name               | Type                                     | About
----               | ----                                     | -----
sliceStartValue    | Number                                   | The value at which the slice now starts
sliceStartPercent  | Number                                   | The percentage value at which the slice now starts
sliceEndValue      | Number                                   | The value at which the slice now ends
sliceStartPercent  | Number                                   | The percentage value at which the slice now ends
sliceLengthValue   | Number                                   | The value of the slice's length
sliceHeadValue     | Number                                   | The value of the slice head position
dragging           | Boolean                                  | If any of the handles are being dragged


## Events

Name               | Payload           | About
-----              | -------           | -----
dragbegin          | `Event`           | Emitted when any of the handles drag starts.
dragend            | `Event`           | Emitted when any of the handles drag ends.
change             | `State`           | Emitted when mounted for real corrected values and when any of the handles drag ends.


## License

Released under [MIT license][1].

## Contributing

* Fork it!
* Create your feature branch: git checkout -b my-new-feature
* Commit your changes: git commit -am 'Add some feature'
* Push to the branch: git push origin my-new-feature
* Submit a pull request :D






