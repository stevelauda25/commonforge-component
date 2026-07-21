import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sparcUiRoot = resolve(__dirname, '../../../design-system-testing-abdillah/packages/ui/src');

/**
 * Dev-only endpoints for FigmaStatus page:
 *   GET /api/figma-manifest  → serves .figma/manifest.json so frontend can
 *                              render skeleton cards immediately without
 *                              waiting for Figma fetch.
 *   GET /api/figma-check     → runs scripts/figma/check.mjs --json. Result
 *                              cached in-memory for 30s to avoid hammering
 *                              Figma API on rapid refreshes.
 *   GET /api/figma-check?slug=<x> → per-slug check, also 30s cached.
 */
function figmaCheckPlugin(): Plugin {
  const scriptPath = resolve(__dirname, '../../scripts/figma/check.mjs');
  const manifestPath = resolve(__dirname, '../../.figma/manifest.json');
  const repoRoot = resolve(__dirname, '../..');

  type CacheEntry = { at: number; body: string; status: number };
  const cache = new Map<string, CacheEntry>();
  const CACHE_TTL_MS = 30_000;

  return {
    name: 'figma-check-endpoint',
    apply: 'serve',
    configureServer(server) {
      // Manifest endpoint — instant, reads local file.
      server.middlewares.use('/api/figma-manifest', (_req: any, res: any) => {
        try {
          const body = readFileSync(manifestPath, 'utf8');
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store');
          res.end(body);
        } catch (e: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: e.message }));
        }
      });

      server.middlewares.use('/api/figma-check', (req: any, res: any) => {
        const slug = new URL(req.url || '', 'http://x').searchParams.get('slug');
        const cacheKey = slug || '__all__';

        // Serve from cache if fresh.
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store');
          res.setHeader('X-Cache', 'HIT');
          res.setHeader('X-Cache-Age', String(Math.floor((Date.now() - cached.at) / 1000)));
          res.statusCode = cached.status;
          res.end(cached.body);
          return;
        }

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
          res.setHeader('X-Cache', 'MISS');
          if (code !== 0 && code !== 1) {
            // 0 = in sync, 1 = drift detected (still valid JSON), other = error
            res.statusCode = 500;
            const body = JSON.stringify({ error: stderr || `check.mjs exited with code ${code}` });
            res.end(body);
            return;
          }
          const body = stdout || '{}';
          cache.set(cacheKey, { at: Date.now(), body, status: 200 });
          res.end(body);
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
  resolve: {
    alias: {
      '@sparc-ui': sparcUiRoot,
    },
  },
  server: {
    port: 5174,
  },
});
