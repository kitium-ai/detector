import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/detectors/platform.ts',
    'src/detectors/framework.ts',
    'src/detectors/capabilities.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  treeshake: true,
  target: 'es2020',
  outDir: 'dist',
  external: [
    // Exclude native Node.js modules and dependencies
    '@kitiumai/logger',
    '@kitiumai/config',
    '@kitiumai/lint',
    '@kitiumai/scripts',
    '@kitiumai/types',
    // Exclude native modules
    /^snappy$/,
    /\.node$/,
  ],
  noExternal: [],
});
