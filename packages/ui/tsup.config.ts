import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'badges': 'src/badges/index.ts',
    'button': 'src/button/index.ts',
    'checkbox': 'src/checkbox/index.ts',
    'dropdown': 'src/dropdown/index.ts',
    'search-input': 'src/search-input/index.ts',
    'switch': 'src/switch/index.ts',
    'tabs': 'src/tabs/index.ts',
    'text-input': 'src/text-input/index.ts',
    'tooltip': 'src/tooltip/index.ts',
    canvas: 'src/canvas.ts',
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
