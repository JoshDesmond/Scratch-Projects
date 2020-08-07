// import resolve from '@rollup/plugin-node-resolve'
// import commonjs from '@rollup/plugin-commonjs'

import {
	chromeExtension,
	simpleReloader,
} from 'rollup-plugin-chrome-extension'

export default {
	input: [ 'app/manifest.json'],
	output: {
		dir: 'build',
		format: 'esm',
	},
	plugins: [
		// always put chromeExtension() before other plugins
		chromeExtension(),
		simpleReloader(),
		// the plugins below are optional
		// resolve(),
		// commonjs(),
	],
}
