import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    button: 'src/button/index.ts',
    checkbox: 'src/checkbox/index.ts',
    'search-input': 'src/search-input/index.ts',
    'text-input': 'src/text-input/index.ts',
    tooltip: 'src/tooltip/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: true,
  sourcemap: true,
  minify: false,
  outDir: 'dist',
  external: ['react', 'react-dom'],
});
