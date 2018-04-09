# Vue Scrub Slice

A Vue 2 component for defining start and end of slice of specified length

<img
  width="500"
  src="./demo/ScrubSlice.png"
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

Name             | Type                                     | Default  | About
----             | ----                                     | -------  | -----
totalLength      | Number                                   | 1000     | The total length to be sliced
sliceMaximum     | Number                                   | 500      | The maximum value of the slice
sliceMinimum     | Number                                   | 100      | The maximum value of the slice
sliceSnap        | Number                                   | 1        | The snap point unit for movement of slice start and end
sliceHeadSnap    | Number                                   | 1        | The snap point unit for movement of slice head

## State Properties

Name             | Type                                     | Default  | About
----             | ----                                     | -------  | -----
totalLength      | Number                                   | 1000     | The total length to be sliced
sliceMaximum     | Number                                   | 500      | The maximum value of the slice
sliceMinimum     | Number                                   | 100      | The maximum value of the slice
sliceSnap        | Number                                   | 1        | The snap point unit for movement of slice start and end
sliceHeadSnap    | Number                                   | 1        | The snap point unit for movement of slice head
sliceLength      | Number                                   | 500      | The length of of current slice
sliceStartValue  | Number                                   | 0        | The value at which the slice starts
sliceEndValue    | Number                                   | 500      | The value at which the slice ends
sliceHead        | Number                                   | 0        | The value of the slice head position


## Events

Name        | Payload                                                | About
-----       | -------                                                | -----
dragbegin   | `Event`                                                | Emitted when any of the handles drag starts.
dragend     | `Event`                                                | Emitted when any of the handles drag ends.
change      | `State`                                                | Emitted when any of the handles drag ends.


## License

Released under [MIT license][1].

## Contributing

* Fork it!
* Create your feature branch: git checkout -b my-new-feature
* Commit your changes: git commit -am 'Add some feature'
* Push to the branch: git push origin my-new-feature
* Submit a pull request :D

## Roadmap

• Change scrub and slice state to use ES7 Observables




