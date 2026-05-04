// @ts-expect-error — node built-ins, no @types/node installed in this workspace
import { spawn } from 'node:child_process';
// @ts-expect-error — node built-ins
import { resolve, dirname } from 'node:path';
// @ts-expect-error — node built-ins
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Dev-only middleware: GET /api/figma-check runs scripts/figma/check.mjs --json
 * and streams the result. Lets the FigmaStatus page refresh from live Figma
 * data without the user having to drop to terminal.
 */
function figmaCheckPlugin(): Plugin {
  const scriptPath = resolve(__dirname, '../../scripts/figma/check.mjs');
  const repoRoot = resolve(__dirname, '../..');
  return {
    name: 'figma-check-endpoint',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/figma-check', (req: any, res: any) => {
        const slug = new URL(req.url || '', 'http://x').searchParams.get('slug');
        const args = ['--json'];
        if (slug) args.push(slug);
        const child = spawn('node', [scriptPath, ...args], { cwd: repoRoot });
        let stdout = '';
        let stderr = '';
        child.stdout.on('data', (d: any) => { stdout += d; });
        child.stderr.on('data', (d: any) => { stderr += d; });
        child.on('close', (code: number) => {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store');
          if (code !== 0 && code !== 1) {
            // 0 = in sync, 1 = drift detected (still valid JSON), other = error
            res.statusCode = 500;
            res.end(JSON.stringify({ error: stderr || `check.mjs exited with code ${code}` }));
            return;
          }
          res.end(stdout || '{}');
        });
      });
    },
  };
}

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
    figmaCheckPlugin(),
  ],
  server: {
    port: 5174,
  },
});
