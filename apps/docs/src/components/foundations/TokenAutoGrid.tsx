import { useEffect, useState } from 'react';
import preset from 'pod-test-tokens/tailwind-preset';

type Kind = 'radius' | 'shadow';
type Filter = 'core' | 'glow' | 'foundation' | 'all';

interface TokenEntry {
  name: string;     // 'sm', 'md', 'foundation-xs', 'glow-accent-inset'
  cssVar: string;   // '--radius-sm', '--shadow-foundation-xs'
  className: string; // 'rounded-sm', 'shadow-foundation-xs'
  computed: string; // resolved at mount via getComputedStyle
}

/**
 * Auto-renders foundation tokens (radius/shadow) by reading directly from
 * pod-test-tokens/tailwind-preset. When new tokens are added to the preset,
 * the docs page picks them up automatically — no manual MDX edits.
 *
 * Usage in MDX:
 *   <TokenAutoGrid kind="radius" />
 *   <TokenAutoGrid kind="shadow" filter="core" />
 *   <TokenAutoGrid kind="shadow" filter="glow" />
 */
export function TokenAutoGrid({
  kind,
  filter = 'all',
  variant = 'preview',
}: {
  kind: Kind;
  filter?: Filter;
  variant?: 'preview' | 'table';
}) {
  const [tokens, setTokens] = useState<TokenEntry[]>([]);

  useEffect(() => {
    const map = kind === 'radius'
      ? (preset.theme?.extend?.borderRadius ?? {})
      : (preset.theme?.extend?.boxShadow ?? {});

    const entries: TokenEntry[] = Object.entries(map).map(([name, varRef]) => {
      // varRef is "var(--radius-sm)" or "var(--shadow-foundation-xs)"
      const m = /var\((--[a-z0-9-]+)\)/.exec(String(varRef));
      const cssVar = m?.[1] ?? '';
      const classPrefix = kind === 'radius' ? 'rounded' : 'shadow';
      const className = `${classPrefix}-${name}`;
      const computed = cssVar
        ? getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
        : '';
      return { name, cssVar, className, computed };
    });

    // Filter by category
    const filtered = entries.filter((e) => {
      if (filter === 'all') return true;
      if (filter === 'glow') return e.name.startsWith('glow-');
      if (filter === 'foundation') return e.name.startsWith('foundation-');
      // 'core' = neither glow nor foundation
      return !e.name.startsWith('glow-') && !e.name.startsWith('foundation-');
    });

    setTokens(filtered);
  }, [kind, filter]);

  if (tokens.length === 0) return <p className="text-sm text-text-muted">Loading tokens…</p>;

  if (variant === 'table') {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border-default">
            <tr className="text-left text-xs uppercase tracking-wide text-text-muted">
              <th className="py-2 pr-4 font-medium">Token</th>
              <th className="py-2 pr-4 font-medium">Value</th>
              <th className="py-2 font-medium">Class</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((t) => (
              <tr key={t.name} className="border-b border-border-subtle">
                <td className="py-2 pr-4">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{t.cssVar}</code>
                </td>
                <td className="py-2 pr-4">
                  <code className="text-xs text-text-secondary">{t.computed || '—'}</code>
                </td>
                <td className="py-2">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{t.className}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Preview swatches — clean grid, just the visual + class name (no values).
  // For shadows: wrap in muted panel so white-ish swatches contrast clearly,
  // making the drop shadow visible in BOTH light and dark mode.
  const isShadow = kind === 'shadow';
  const inner = (
    <div className="grid grid-cols-2 gap-x-4 gap-y-14 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
      {tokens.map((t) => (
        <div key={t.name} className="flex flex-col items-center gap-3">
          {kind === 'radius' ? (
            <div className={`h-14 w-14 bg-accent ${t.className}`} />
          ) : (
            <div className={`h-20 w-20 rounded-lg border border-border-default bg-canvas ${t.className}`} />
          )}
          <code className="font-mono text-[11px] text-text-secondary text-center break-all">
            {t.className}
          </code>
        </div>
      ))}
    </div>
  );

  // Shadow preview: own wrapper with white bg (max contrast for subtle Figma
  // shadows) and EXTRA bottom padding (foundation-3xl reaches 72px below
  // swatch). Self-contained — DON'T wrap with PreviewCard since its
  // overflow-hidden clips large shadows.
  if (isShadow) {
    return (
      <div className="my-6 rounded-lg border border-border-default bg-canvas px-8 pt-12 pb-24">
        {inner}
      </div>
    );
  }
  return inner;
}
