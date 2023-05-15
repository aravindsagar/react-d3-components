const autoExternal = require('rollup-plugin-auto-external');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const postcss = require('rollup-plugin-postcss');
const terser = require('@rollup/plugin-terser');

const packageJson = require('./package.json');

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    autoExternal(),
    resolve.nodeResolve(),
    typescript({ useTsconfigDeclarationDir: true }),
    postcss({ extract: false, modules: { localsConvention: 'dashes' } }),
    commonjs(),
    terser(),
  ],
};
