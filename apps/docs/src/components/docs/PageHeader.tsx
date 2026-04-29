import type { ReactNode } from 'react';

interface Props {
  title: string;
  description?: ReactNode;
}

export function PageHeader({ title, description }: Props) {
  return (
    <div className="mb-8 border-b border-border-default pb-6">
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-md text-text-secondary">{description}</p>
      )}
    </div>
  );
}
