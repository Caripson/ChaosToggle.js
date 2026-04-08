import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

const banner = `/* ChaosToggle.js v1.2.0
 * https://github.com/Caripson/ChaosToggle.js
 * (c) ${new Date().getFullYear()} Caripson - MIT License
 */`;

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/chaos-toggle.esm.js',
        format: 'esm',
        banner,
        sourcemap: true,
        inlineDynamicImports: true,
      },
      {
        file: 'dist/chaos-toggle.cjs.js',
        format: 'cjs',
        banner,
        sourcemap: true,
        exports: 'named',
        inlineDynamicImports: true,
      },
      {
        file: 'dist/chaos-toggle.js',
        format: 'iife',
        name: 'ChaosToggle',
        banner,
        sourcemap: true,
        exports: 'named',
        inlineDynamicImports: true,
        footer: 'if(typeof ChaosToggle!=="undefined"&&ChaosToggle.ChaosToggle){ChaosToggle=ChaosToggle.ChaosToggle;}',
      },
      {
        file: 'dist/chaos-toggle.min.js',
        format: 'iife',
        name: 'ChaosToggle',
        banner,
        sourcemap: true,
        exports: 'named',
        inlineDynamicImports: true,
        plugins: [terser()],
        footer: 'if(typeof ChaosToggle!=="undefined"&&ChaosToggle.ChaosToggle){ChaosToggle=ChaosToggle.ChaosToggle;}',
      },
    ],
    plugins: [
      typescript({ tsconfig: './tsconfig.json', declaration: false }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
    plugins: [dts()],
  },
];
