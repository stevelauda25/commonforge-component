import { createBrowserRouter } from 'react-router-dom';
import App from '../App.js';
import { routes, type RouteEntry } from './routes.js';
import { MdxLayout } from '../components/docs/MdxLayout.js';

function needsMdxLayout(r: RouteEntry): boolean {
  return (
    r.category === 'foundation' ||
    r.category === 'component' ||
    r.path === '/getting-started' ||
    r.path === '/changelog'
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      ...routes.map((r) => ({
        path: r.path === '/' ? undefined : r.path.replace(/^\//, ''),
        index: r.path === '/',
        lazy: r.load
          ? async () => {
              const mod = await r.load!();
              const Inner = mod.default;
              const Wrapped = needsMdxLayout(r)
                ? () => (
                    <MdxLayout>
                      <Inner />
                    </MdxLayout>
                  )
                : Inner;
              return { Component: Wrapped };
            }
          : undefined,
      })),
      {
        path: '*',
        lazy: async () => {
          const mod = await import('../pages/NotFound.js');
          return { Component: mod.default };
        },
      },
    ],
  },
]);
