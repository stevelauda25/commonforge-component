import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { TableOfContents } from './TableOfContents.js';

const TOC_PATHS = new Set(['/components/button']);

export function MdxLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const showToc = TOC_PATHS.has(pathname);

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
