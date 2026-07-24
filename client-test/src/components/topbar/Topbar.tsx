import { Button, SearchInput, Tooltip } from '@commonforge/ui';
import { Bell, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export function Topbar() {
  const [query, setQuery] = useState('');

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border-default bg-canvas/80 px-6 backdrop-blur-md">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold tracking-tight text-text-primary">
          Dashboard
        </h1>
        <p className="text-xs text-text-muted">
          Last 12 months · refreshed 2 min ago
        </p>
      </div>

      <div className="ml-auto w-full max-w-[320px]">
        <SearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search metrics, customers…"
          size="sm"
        />
      </div>

      <nav className="flex items-center gap-1">
        <Tooltip content="Help & docs">
          <Button
            variant="outline"
            size="sm"
            iconOnly
            leftIcon={<HelpCircle size={16} />}
            aria-label="Help and docs"
          />
        </Tooltip>
        <Tooltip content="Notifications">
          <Button
            variant="outline"
            size="sm"
            iconOnly
            leftIcon={<Bell size={16} />}
            aria-label="Notifications"
          />
        </Tooltip>
      </nav>
    </header>
  );
}
