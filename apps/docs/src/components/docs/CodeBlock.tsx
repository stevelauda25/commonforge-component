import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from 'pod-test-ui';

type Props = React.HTMLAttributes<HTMLPreElement> & {
  'data-language'?: string;
};

export function CodeBlock({ className, children, ...rest }: Props) {
  const [copied, setCopied] = useState(false);
  const language = (rest as Record<string, string>)['data-language'];

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const pre = event.currentTarget.closest('.code-block')?.querySelector('pre');
    const text = pre?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.warn('Failed to copy code:', err);
    }
  };

  return (
    <div className="code-block relative my-4 overflow-hidden rounded-md border border-default bg-surface">
      <div className="flex items-center justify-between border-b border-default px-3 py-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
          {language ?? ''}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className={cn(
            'inline-flex h-7 items-center gap-1.5 rounded px-2 text-xs',
            'text-muted transition-colors hover:bg-canvas hover:text-default',
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className={cn('overflow-x-auto p-4 text-[13px] leading-snug', className)} {...rest}>
        {children}
      </pre>
    </div>
  );
}
