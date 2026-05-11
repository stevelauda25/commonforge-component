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
    <div className="code-block group relative my-4 overflow-hidden rounded-md border border-border-default bg-muted">
      {language && (
        <span className="absolute left-3 top-2 text-[10px] font-mono uppercase tracking-wider text-text-muted">
          {language}
        </span>
      )}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy code"
        className={cn(
          'absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded',
          'text-text-muted opacity-0 transition-opacity hover:bg-canvas hover:text-text-primary',
          'group-hover:opacity-100 focus-visible:opacity-100',
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <pre className={cn('overflow-x-auto p-4 pt-7 text-[13px] leading-snug', className)} {...rest}>
        {children}
      </pre>
    </div>
  );
}
