import tokens from '../../data/sparc-foundation.json';
import { PreviewCard } from '../docs/PreviewCard.js';
import { PropsTable } from '../docs/PropsTable.js';

/**
 * Renderers for the SPARC foundation tokens (src/data/sparc-foundation.json),
 * collected from the SPARC apps on 2026-07-21 and this repo's token source.
 * Every preview here uses inline styles with the raw collected values rather
 * than Tailwind token classes.
 */

type RampName = 'neutral' | 'crimson' | 'green' | 'amber' | 'red' | 'gray';

/** One color ramp (e.g. neutral-25 → neutral-950) as a swatch grid. */
export function SparcColorRamp({ ramp }: { ramp: RampName }) {
  const shades = tokens.color[ramp];
  return (
    <div className="my-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {Object.entries(shades).map(([shade, hex]) => (
        <div key={shade} className="flex min-w-0 flex-col gap-1.5">
          <div
            className="h-12 rounded-md border border-black/10"
            style={{ backgroundColor: hex }}
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-col">
            <span className="font-mono text-xs text-default">
              {ramp}-{shade}
            </span>
            <span className="text-[11px] text-muted">{hex}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Semantic color tokens, rendered as a labeled swatch list. */
export function SparcSemanticColors() {
  return (
    <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(tokens.color.semantic).map(([name, value]) => (
        <div
          key={name}
          className="flex items-center gap-3 rounded-md border border-default bg-surface p-3"
        >
          <div
            className="h-10 w-10 shrink-0 rounded-md border border-subtle"
            style={{ backgroundColor: value }}
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-col text-default">
            <span className="font-mono text-xs">{name}</span>
            <span className="truncate text-[11px] text-muted">{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Radius scale in the JSON's file order (none → full). NOTE: JS reorders
 * integer-like object keys ("10") ahead of string keys in Object.entries,
 * so the order is pinned explicitly here to match the file.
 */
const RADIUS_ORDER = ['none', '2xs', 'xs', 'sm', 'md', '10', 'lg', 'xl', 'full'] as const;

/** Radius scale as rows: chip + value + crimson sample box (36px, pill for `full`). */
export function SparcRadiusGrid() {
  return (
    <div className="my-6 flex flex-col divide-y divide-subtle rounded-lg border border-default bg-surface">
      {RADIUS_ORDER.map((name) => {
        const value = tokens.radius[name];
        return (
          <div key={name} className="flex items-center gap-4 px-4 py-3">
            <code className="w-24 shrink-0 font-mono text-xs text-default">
              radius-{name}
            </code>
            <span className="w-14 shrink-0 text-[11px] text-muted">{value}</span>
            <div
              className={name === 'full' ? 'h-9 w-20' : 'h-9 w-9'}
              style={{
                borderRadius: value,
                backgroundColor: tokens.color.crimson['500'],
              }}
              aria-hidden="true"
            />
          </div>
        );
      })}
    </div>
  );
}

/** Shadow tokens rendered on cards inside a bordered panel (max contrast). */
export function SparcShadowGrid() {
  return (
    <div className="my-6 rounded-lg border border-default bg-canvas px-8 pt-12 pb-16">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {Object.entries(tokens.shadow).map(([name, value]) => (
          <div key={name} className="flex flex-col items-center gap-4">
            <div
              className="flex h-24 w-full items-center justify-center rounded-lg border border-default bg-surface"
              style={{ boxShadow: value }}
            >
              <code className="font-mono text-xs text-default">
                shadow-{name}
              </code>
            </div>
            <code className="break-all text-center font-mono text-[11px] leading-relaxed text-muted">
              {value}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Font preview card — mirrors the POD Typography page: the pangram at ~24px
 * (text-2xl) medium weight inside a PreviewCard, rendered in the Geist stack
 * (falls back to Inter/system if Geist isn't installed).
 */
export function SparcFontPreview() {
  return (
    <PreviewCard>
      <p
        className="text-2xl font-medium"
        style={{ fontFamily: tokens.typography.fontFamily.sans }}
      >
        The quick brown fox jumps over the lazy dog
      </p>
    </PreviewCard>
  );
}

/**
 * Size/line-height pairing for the collected 7-token scale. `xs` (12px/16px),
 * `body` (14px/20px) and `body-lg` (16px/24px) equal Tailwind stock values
 * (text-xs/leading-4, text-sm, text-base) and are marked (stock); the
 * collected line-heights override Tailwind's stock leading-tight/snug.
 * The pairing map lives here; all values pull from the JSON.
 */
const SIZE_SCALE: Array<{
  token: string;
  size: string;
  lineHeight: string;
  sample: string;
  stock?: boolean;
}> = [
  { token: 'text-3xs',     size: tokens.typography.fontSize['3xs'],     lineHeight: tokens.typography.lineHeight.tight,      sample: 'Aa Tiny label' },
  { token: 'text-2xs',     size: tokens.typography.fontSize['2xs'],     lineHeight: tokens.typography.lineHeight.snug,       sample: 'Aa Micro text' },
  { token: 'text-caption', size: tokens.typography.fontSize.caption,    lineHeight: tokens.typography.lineHeight.caption,    sample: 'Aa Caption' },
  { token: 'text-xs',      size: tokens.typography.fontSize.xs,         lineHeight: tokens.typography.lineHeight.xs,         sample: 'Aa Fine print',      stock: true },
  { token: 'text-body-sm', size: tokens.typography.fontSize['body-sm'], lineHeight: tokens.typography.lineHeight['body-sm'], sample: 'Aa Dense table cell' },
  { token: 'text-body',    size: tokens.typography.fontSize.body,       lineHeight: tokens.typography.lineHeight.body,       sample: 'Aa Body default',    stock: true },
  { token: 'text-body-lg', size: tokens.typography.fontSize['body-lg'], lineHeight: tokens.typography.lineHeight['body-lg'], sample: 'Aa Lead',            stock: true },
];

/** Size scale table — same 4-column PropsTable style as the POD Typography page. */
export function SparcSizeScale() {
  return (
    <PropsTable>
      <thead>
        <tr>
          <th>Token</th>
          <th>Size</th>
          <th>Line height</th>
          <th>Sample</th>
        </tr>
      </thead>
      <tbody>
        {SIZE_SCALE.map((row) => (
          <tr key={row.token}>
            <td>
              <code>{row.token}</code>
              {row.stock ? (
                <span className="ml-1.5 text-[11px] text-muted">(stock)</span>
              ) : null}
            </td>
            <td>{row.size}</td>
            <td>{row.lineHeight}</td>
            <td>
              <span
                className="text-default"
                style={{ fontSize: row.size, lineHeight: row.lineHeight }}
              >
                {row.sample}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </PropsTable>
  );
}

const WEIGHTS: Array<{ className: string; weight: number }> = [
  { className: 'font-normal', weight: 400 },
  { className: 'font-medium', weight: 500 },
  { className: 'font-semibold', weight: 600 },
  { className: 'font-bold', weight: 700 },
];

/** Weights table — same 2-column PropsTable style as the POD Typography page. */
export function SparcWeights() {
  return (
    <PropsTable>
      <thead>
        <tr>
          <th>Class</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        {WEIGHTS.map((w) => (
          <tr key={w.className}>
            <td>
              <code>{w.className}</code>
            </td>
            <td>{w.weight}</td>
          </tr>
        ))}
      </tbody>
    </PropsTable>
  );
}

/**
 * Tailwind's default spacing scale — what both SPARC apps actually use.
 * NOT a SPARC token set and NOT in the JSON: this is Tailwind's documented
 * default (px = step × 4), shown so the page can visualize the convention.
 */
const SPACING_STEPS = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20,
  24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
] as const;

/** Spacing scale as horizontal bars (crimson-500 fill, like the radius boxes). */
export function SparcSpacingScale() {
  return (
    <div className="my-6 flex flex-col divide-y divide-subtle overflow-x-auto rounded-lg border border-default bg-surface">
      {SPACING_STEPS.map((step) => {
        const px = step * 4;
        return (
          <div key={step} className="flex items-center gap-4 px-4 py-2">
            <code className="w-14 shrink-0 font-mono text-xs text-default">
              p-{step}
            </code>
            <span className="w-12 shrink-0 text-right text-[11px] text-muted">
              {px}px
            </span>
            <div
              className="h-3 shrink-0 rounded-[2px]"
              style={{
                width: px,
                backgroundColor: tokens.color.crimson['500'],
              }}
              aria-hidden="true"
            />
          </div>
        );
      })}
    </div>
  );
}
