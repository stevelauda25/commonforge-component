import { useEffect, useState } from 'react';
import { cn } from '@pod/ui';

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const found: Heading[] = [];
    document
      .querySelectorAll<HTMLElement>('.mdx-content h2[id], .mdx-content h3[id]')
      .forEach((el) => {
        found.push({
          id: el.id,
          text: el.textContent?.trim() ?? '',
          level: el.tagName === 'H2' ? 2 : 3,
        });
      });
    setHeadings(found);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;
    const first = headings[0];
    if (first) setActiveId(first.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        const top = visible[0];
        if (top) setActiveId(top.target.id);
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block w-56 shrink-0 sticky top-14 self-start max-h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        On this page
      </p>
      <ul className="relative flex flex-col gap-1 border-l border-border-default">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li key={h.id} className="relative">
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute left-[-1px] top-0 h-full w-[2px] bg-accent"
                />
              )}
              <a
                href={`#${h.id}`}
                className={cn(
                  'block py-1 text-sm transition-colors duration-fast',
                  h.level === 3 ? 'pl-6' : 'pl-3',
                  isActive
                    ? 'font-medium text-text-primary'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
