declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const MDXComponent: ComponentType<unknown>;
  export default MDXComponent;
}
