/**
 * POD design system tokens — color picker–friendly defaults for the Tokens panel.
 *
 * POD's theme.css stores colors as "R G B" triples (so Tailwind can apply alpha
 * via rgb(var(--color-x) / <alpha-value>)). The Tokens panel wants hex for the
 * native color picker. We keep two views:
 *   - default hex values here (read by the UI)
 *   - convert hex → "R G B" when emitting CSS overrides at runtime
 */

// Hex values mirror the .dark block of packages/tokens/src/theme.css —
// centernode's canvas always runs against the dark palette.
export const POD_DEFAULT_TOKENS = {
  colors: {
    "accent-default": "#16a34a",
    "accent-hover": "#15803d",
    "accent-active": "#166534",
    "accent-fg": "#fafafa",
    "accent-subtle": "#14532d",
    "danger-default": "#b91c1c",
    "danger-hover": "#991b1b",
    "danger-active": "#7f1d1d",
    "danger-fg": "#fafafa",
    "danger-subtle": "#7f1d1d",
    "border-subtle": "#27272a",
    "border-default": "#27272a",
    "border-strong": "#27272a",
    "border-focus": "#4ade80",
    "bg-canvas": "#09090b",
    "bg-surface": "#18181b",
    "bg-raised": "#27272a",
    "bg-muted": "#27272a",
    "text-primary": "#fafafa",
    "text-secondary": "#d4d4d8",
    "text-muted": "#a1a1aa",
    "text-disabled": "#52525b",
    "text-inverse": "#18181b",
    // Badge variant palette — each color trio is bg / tag / fg.
    "experiment-badge-orange-bg": "#431407",
    "experiment-badge-orange-tag": "#f97316",
    "experiment-badge-orange-fg": "#ffedd5",
    "experiment-badge-lime-bg": "#1a2e05",
    "experiment-badge-lime-tag": "#84cc16",
    "experiment-badge-lime-fg": "#ecfccb",
    "experiment-badge-purple-bg": "#3b0764",
    "experiment-badge-purple-tag": "#a855f7",
    "experiment-badge-purple-fg": "#f3e8ff",
    "experiment-badge-green-bg": "#0b2115",
    "experiment-badge-green-tag": "#22c55e",
    "experiment-badge-green-fg": "#dcfce7",
    "experiment-badge-indigo-bg": "#1e1b4b",
    "experiment-badge-indigo-tag": "#6366f1",
    "experiment-badge-indigo-fg": "#e0e7ff",
    "experiment-badge-sky-bg": "#082f49",
    "experiment-badge-sky-tag": "#0ea5e9",
    "experiment-badge-sky-fg": "#e0f2fe",
    "experiment-badge-blue-bg": "#172554",
    "experiment-badge-blue-tag": "#3b82f6",
    "experiment-badge-blue-fg": "#dbeafe",
    "experiment-badge-red-bg": "#260d0e",
    "experiment-badge-red-tag": "#ef4444",
    "experiment-badge-red-fg": "#fee2e2",
    "experiment-badge-yellow-bg": "#422006",
    "experiment-badge-yellow-tag": "#eab308",
    "experiment-badge-yellow-fg": "#fef9c3",
    // soft-gray / dark-gray Badge use tab tokens (dark palette).
    "experiment-tab-base": "#111113",
    "experiment-tab-chip": "#1c1c1f",
    "experiment-tab-border": "#18181b",
    "experiment-tab-text": "#7c7e84",
    "experiment-tab-text-disabled": "#3a3a3d",
    "experiment-tab-indigo": "#6366f1",
  },
};

export function hexToRgbTriple(hex) {
  if (!hex || typeof hex !== "string") return hex;
  const m = hex.replace("#", "").match(/^([a-f0-9]{6}|[a-f0-9]{3})$/i);
  if (!m) return hex; // already "R G B" or unparseable
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export function podTokensToCSS(tokens) {
  let css = ":root {";
  for (const [key, val] of Object.entries(tokens.colors || {})) {
    css += `--color-${key}: ${hexToRgbTriple(val)};`;
  }
  css += "}";
  return css;
}
