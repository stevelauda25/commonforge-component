import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@commonforge/ui';
import { TableOfContents } from './TableOfContents.js';

// TOC auto-shows on every /components/* and /foundations/* page.
// Standalone pages (Home, Getting Started, Changelog) skip it.
const TOC_PREFIXES = ['/components/', '/foundations/'];

export function MdxLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const showToc = TOC_PREFIXES.some((p) => pathname.startsWith(p));
  // Every component page documents a SPARC atom, so they all get the SPARC theme.
  const isSparc = pathname.startsWith('/components/');
  const contentClass = cn('mdx-content', isSparc && 'sparc-theme');

  if (!showToc) {
    return <div className={cn(contentClass, 'mx-auto')}>{children}</div>;
  }

  return (
    <div className="flex justify-center gap-8">
      <div className={contentClass}>{children}</div>
      <TableOfContents />
    </div>
  );
}
