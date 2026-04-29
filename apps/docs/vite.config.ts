import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';

export default defineConfig({
  plugins: [
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
  server: {
    port: 5174,
  },
});
