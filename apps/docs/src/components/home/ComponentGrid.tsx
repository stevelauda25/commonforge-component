import { componentRoutes } from '../../lib/routes.js';
import { ComponentTile } from './ComponentTile.js';

export function ComponentGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {componentRoutes.map((entry) => (
        <ComponentTile key={entry.path} entry={entry} />
      ))}
    </div>
  );
}
