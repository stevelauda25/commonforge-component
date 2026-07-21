import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sparcUiRoot = resolve(__dirname, '../../packages/ui/src');

/**
 * The docs source uses TypeScript-style explicit `.js` extensions on relative
 * imports (e.g. `import App from '../App.js'` → App.tsx). tsc accepts these
 * under moduleResolution "Bundler", but Rollup does not, so rewrite them to
 * the real .tsx/.ts file before Vite's resolver runs.
 */
function tsJsExtensionPlugin(): Plugin {
  return {
    name: 'ts-js-extension',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      if (!importer || !source.startsWith('.') || !source.endsWith('.js')) return null;
      const base = resolve(dirname(importer), source.slice(0, -3));
      for (const ext of ['.tsx', '.ts', '.jsx']) {
        const candidate = base + ext;
        if (existsSync(candidate)) {
          const resolved = await this.resolve(candidate, importer, { ...options, skipSelf: true });
          return resolved ?? candidate;
        }
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [
    tsJsExtensionPlugin(),
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
            {
              theme: { light: 'github-light', dark: 'github-dark-dimmed' },
              keepBackground: false,
            },
          ],
        ],
      }),
    },
    react({ include: /\.(jsx|tsx|md|mdx)$/ }),
  ],
  resolve: {
    alias: {
      '@sparc-ui': sparcUiRoot,
    },
  },
  server: {
    port: 7100,
    strictPort: false,
  },
});
