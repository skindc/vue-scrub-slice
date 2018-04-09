// rollup.config.js
//const scss = require('rollup-plugin-scss')

module.exports = {
  banner: true,
  format: ['umd', 'umd-min', 'cjs', 'es'],
  plugins: ['vue2'],
  vue: {
    css: 'dist/sdc-scrub-slice.css'
  }
}
