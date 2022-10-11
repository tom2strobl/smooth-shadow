import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'

const config = {
  input: 'docs/index.js',
  output: {
    file: `docs/index-bundle.js`,
    format: 'iife'
  },
  plugins: [
    nodeResolve({
      extensions: ['.js']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    babel({ babelHelpers: 'bundled' }),
    commonjs()
  ]
}

export default config
