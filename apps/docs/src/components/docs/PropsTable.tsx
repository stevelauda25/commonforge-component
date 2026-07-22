import type { TableHTMLAttributes } from 'react';
import { cn } from 'cf-ui';

export function PropsTable({
  className,
  children,
  ...rest
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 overflow-x-auto rounded-md border border-default">
      <table
        className={cn(
          'w-full border-collapse text-left text-sm',
          '[&_th]:bg-muted [&_th]:px-4 [&_th]:py-2 [&_th]:font-semibold [&_th]:text-default',
          '[&_td]:border-t [&_td]:border-subtle [&_td]:px-4 [&_td]:py-2 [&_td]:text-subtle',
          '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[12px]',
          className,
        )}
        {...rest}
      >
        {children}
      </table>
    </div>
  );
}
