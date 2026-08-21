import { Link } from 'react-router-dom';
import { Menu, Github } from 'lucide-react';
import { Button } from '@commonforge/ui';

interface Props {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-default bg-canvas/90 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="md:hidden"
          leftIcon={<Menu className="h-4 w-4" />}
        />
        <Link to="/" className="flex items-center gap-2">
          <span className="text-sm font-semibold text-default">CommonForge</span>
          <span className="text-sm text-muted">Design System</span>
          <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-muted">
            v0.1.4
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <a
          href="https://github.com/stevelauda25/commonforge-component"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-default bg-surface px-2.5 py-1 text-xs font-medium text-subtle transition-colors hover:border-strong hover:text-default"
        >
          <Github className="h-3.5 w-3.5" />
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
}
