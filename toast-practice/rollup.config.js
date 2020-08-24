import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: ['src/index.js'],
    output: {
        dir: 'build',
        format: 'esm'
    },
    plugins: [
        resolve(), // tells Rollup how to find date-fns in node_modules
        commonjs(), // converts date-fns to ES modules
    ]
};