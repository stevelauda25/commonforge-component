import { useState, useCallback, useRef, useLayoutEffect } from 'react';
import { Badge, type BadgeColor } from 'pod-test-ui';

const INITIAL: Array<{ id: string; color: BadgeColor; label: string }> = [
  { id: 'indigo-1', color: 'indigo', label: 'FILTER' },
  { id: 'sky-1', color: 'sky', label: 'TAG' },
  { id: 'orange-1', color: 'orange', label: 'PRIORITY' },
  { id: 'green-1', color: 'green', label: 'READY' },
];

const EXIT_MS = 280;
const GAP_PX = 8;

/**
 * Interactive demo for the "Removable" section of Badge docs.
 *
 * Exit motion: opacity fade + scale-down + soft blur + width collapse.
 * The width collapse is what makes neighboring badges glide together
 * instead of snapping the gap shut instantly. Width is measured once on
 * mount via useLayoutEffect (after first paint, before user sees it) and
 * animated to 0 along with margin-right on exit.
 */
export function BadgeRemovableDemo() {
  const [items, setItems] = useState(INITIAL);
  const [exiting, setExiting] = useState<Set<string>>(new Set());
  const [widths, setWidths] = useState<Map<string, number>>(new Map());
  const wrapperRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Measure each newly-mounted badge wrapper so we can animate its width
  // (computed → 0) on exit. `width: auto` is not animatable; a fixed pixel
  // value is.
  useLayoutEffect(() => {
    setWidths((prev) => {
      let changed = false;
      const next = new Map(prev);
      wrapperRefs.current.forEach((el, id) => {
        if (!next.has(id) && el) {
          next.set(id, el.offsetWidth);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [items]);

  const remove = useCallback((id: string) => {
    setExiting((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    const t = setTimeout(() => {
      setItems((prev) => prev.filter((b) => b.id !== id));
      setExiting((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setWidths((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
      wrapperRefs.current.delete(id);
      timersRef.current.delete(id);
    }, EXIT_MS);
    timersRef.current.set(id, t);
  }, []);

  const reset = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current.clear();
    setExiting(new Set());
    setWidths(new Map());
    wrapperRefs.current.clear();
    setItems(INITIAL);
  }, []);

  return (
    <div
      className="flex w-full flex-wrap items-center justify-center"
      style={{ minHeight: 28 }}
    >
      {items.map((b) => {
        const isExiting = exiting.has(b.id);
        const measuredWidth = widths.get(b.id);
        return (
          <span
            key={b.id}
            ref={(el) => {
              if (el) wrapperRefs.current.set(b.id, el);
              else wrapperRefs.current.delete(b.id);
            }}
            style={{
              display: 'inline-flex',
              overflow: 'hidden',
              transformOrigin: 'center',
              maxWidth: isExiting
                ? 0
                : measuredWidth != null
                  ? `${measuredWidth}px`
                  : 'none',
              marginRight: isExiting ? 0 : GAP_PX,
              opacity: isExiting ? 0 : 1,
              filter: isExiting ? 'blur(4px)' : 'blur(0)',
              transform: isExiting ? 'scale(0.85)' : 'scale(1)',
              transition: [
                `max-width ${EXIT_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                `margin-right ${EXIT_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                `opacity ${Math.round(EXIT_MS * 0.75)}ms ease-out`,
                `filter ${Math.round(EXIT_MS * 0.75)}ms ease-out`,
                `transform ${Math.round(EXIT_MS * 0.85)}ms ease-out`,
              ].join(', '),
              willChange: 'opacity, transform, filter, max-width, margin-right',
            }}
          >
            <Badge color={b.color} onClose={() => remove(b.id)}>
              {b.label}
            </Badge>
          </span>
        );
      })}
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
