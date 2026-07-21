import { MDXProvider } from '@mdx-js/react';
import type { ReactNode } from 'react';
import { CodeBlock } from './docs/CodeBlock.js';
import { PropsTable } from './docs/PropsTable.js';
import { PreviewCard } from './docs/PreviewCard.js';
import { PageHeader } from './docs/PageHeader.js';

const components = {
  pre: CodeBlock,
  table: PropsTable,
  PreviewCard,
  PageHeader,
};

export function MdxProvider({ children }: { children: ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
