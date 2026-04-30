import peerDepsExternal from 'rollup-plugin-peer-deps-external'

import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'

import pkg from './package.json'

const input = 'src/index.ts'

const outputOptions = {
  exports: 'named',
  sourcemap: true,
}

const plugins = [
  peerDepsExternal(),
  json(),
  resolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  }),
  commonjs(),
  babel({
    exclude: 'node_modules/**',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    babelHelpers: 'bundled',
    presets: [
      ['@babel/preset-env', { modules: false }],
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
  }),
]

export default [
  {
    input,
    output: [
      {
        ...outputOptions,
        file: pkg.module,
        format: 'esm',
      },
      {
        ...outputOptions,
        file: pkg.main,
        format: 'cjs',
      },
    ],
    external: ['schema-dts'],
    plugins,
  },
]
