import * as React from 'react';
import { cn } from '@commonforge/ui';

// LOCAL — Field wrapper provides label + error/help text + accessible
// linkage (htmlFor / aria-describedby). Used together with TextInput / Select.
// Tokens only: text-text-primary, text-text-muted, text-danger.

let fieldIdCounter = 0;
const nextId = () => `field-${++fieldIdCounter}`;

export interface FieldProps {
  label: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  description?: React.ReactNode;
  error?: string;
  className?: string;
  children: (renderProps: { id: string; describedBy: string | undefined; invalid: boolean }) => React.ReactNode;
}

export function Field({ label, htmlFor, required, description, error, className, children }: FieldProps) {
  const reactId = React.useId?.() ?? '';
  const id = htmlFor ?? reactId ?? nextId();
  const descId = description ? `${id}-desc` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [descId, errId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={id}
        className="text-sm font-medium text-text-primary"
      >
        {label}
        {required && <span className="ml-0.5 text-danger" aria-hidden="true">*</span>}
      </label>

      {children({ id, describedBy, invalid: !!error })}

      {description && !error && (
        <p id={descId} className="text-xs text-text-muted">
          {description}
        </p>
      )}
      {error && (
        <p id={errId} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
