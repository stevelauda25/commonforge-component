import { MDXProvider } from '@mdx-js/react';
import type { ReactNode } from 'react';
import { CodeBlock } from './docs/CodeBlock.js';
import { PropsTable } from './docs/PropsTable.js';
import { PreviewCard } from './docs/PreviewCard.js';
import { EmptyComponentState } from './docs/EmptyComponentState.js';
import { PageHeader } from './docs/PageHeader.js';
import { Swatch, SwatchGrid } from './docs/Swatch.js';

const components = {
  pre: CodeBlock,
  table: PropsTable,
  PreviewCard,
  EmptyComponentState,
  PageHeader,
  Swatch,
  SwatchGrid,
};

export function MdxProvider({ children }: { children: ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
