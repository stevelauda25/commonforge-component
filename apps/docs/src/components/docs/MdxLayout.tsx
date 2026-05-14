import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { TableOfContents } from './TableOfContents.js';

// TOC auto-shows on every /components/* and /foundations/* page.
// Standalone pages (Home, Getting Started, Changelog, Figma Status) skip it.
const TOC_PREFIXES = ['/components/', '/foundations/'];

export function MdxLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const showToc = TOC_PREFIXES.some((p) => pathname.startsWith(p));

  if (!showToc) {
    return <div className="mdx-content mx-auto">{children}</div>;
  }

  return (
    <div className="flex justify-center gap-8">
      <div className="mdx-content">{children}</div>
      <TableOfContents />
    </div>
  );
}
