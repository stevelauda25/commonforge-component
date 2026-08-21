import { PageHeader } from '../components/docs/PageHeader.js';
import { foundationRoutes, componentRoutes } from '../lib/routes.js';
import { ComponentTile } from '../components/home/ComponentTile.js';

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <PageHeader
        title="CommonForge Design System"
        description="React components built on tokens. Light/dark, accessible."
      />

      <div className="flex flex-col gap-12">
        {foundationRoutes.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-default">Foundations</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {foundationRoutes.map((entry) => (
                <ComponentTile key={entry.path} entry={entry} />
              ))}
            </div>
          </section>
        )}

        {componentRoutes.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-default">Components</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {componentRoutes.map((entry) => (
                <ComponentTile key={entry.path} entry={entry} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
