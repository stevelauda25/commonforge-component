import { PageHeader } from '../components/docs/PageHeader.js';
import { ComponentGrid } from '../components/home/ComponentGrid.js';

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <PageHeader
        title="POD Design System"
        description="React components built on tokens. Light/dark, accessible."
      />
      <ComponentGrid />
    </div>
  );
}
