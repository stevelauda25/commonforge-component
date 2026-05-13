import { MDXProvider } from '@mdx-js/react';
import type { ReactNode } from 'react';
import { CodeBlock } from './docs/CodeBlock.js';
import { PropsTable } from './docs/PropsTable.js';
import { PreviewCard } from './docs/PreviewCard.js';
import { EmptyComponentState } from './docs/EmptyComponentState.js';
import { PageHeader } from './docs/PageHeader.js';
import { Swatch, SwatchGrid } from './docs/Swatch.js';
import { TokenAutoGrid } from './foundations/TokenAutoGrid.js';
import { MotionAutoGrid } from './foundations/MotionAutoGrid.js';
import { MotionPatternDemo, MotionPatternGrid } from './foundations/MotionPatternDemos.js';

const components = {
  pre: CodeBlock,
  table: PropsTable,
  PreviewCard,
  EmptyComponentState,
  PageHeader,
  Swatch,
  SwatchGrid,
  TokenAutoGrid,
  MotionAutoGrid,
  MotionPatternDemo,
  MotionPatternGrid,
};

export function MdxProvider({ children }: { children: ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
