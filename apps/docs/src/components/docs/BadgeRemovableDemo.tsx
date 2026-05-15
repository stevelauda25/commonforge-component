import { useState, useCallback } from 'react';
import { Badge, type BadgeColor } from 'pod-test-ui';

const INITIAL: Array<{ id: string; color: BadgeColor; label: string }> = [
  { id: 'indigo-1', color: 'indigo', label: 'FILTER' },
  { id: 'sky-1', color: 'sky', label: 'TAG' },
  { id: 'orange-1', color: 'orange', label: 'PRIORITY' },
  { id: 'green-1', color: 'green', label: 'READY' },
];

/**
 * Interactive demo for the "Removable" section of Badge docs.
 *
 * Since 0.1.9, `<Badge onClose>` plays the POD exit motion internally —
 * consumers just call `setItems(prev => prev.filter(...))` and the badge
 * handles the animation timing. This demo is now just state + Reset.
 */
export function BadgeRemovableDemo() {
  const [items, setItems] = useState(INITIAL);
  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((b) => b.id !== id));
  }, []);
  const reset = useCallback(() => setItems(INITIAL), []);

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {items.map((b) => (
        <Badge key={b.id} color={b.color} onClose={() => remove(b.id)}>
          {b.label}
        </Badge>
      ))}
      {items.length === 0 && (
        <button
          type="button"
          onClick={reset}
          className="text-xs font-medium text-text-muted underline-offset-4 hover:text-text-primary hover:underline transition-colors animate-fade-in"
        >
          Reset preview
        </button>
      )}
    </div>
  );
}
