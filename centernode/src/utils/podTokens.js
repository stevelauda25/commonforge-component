/**
 * POD design system tokens — color picker–friendly defaults for the Tokens panel.
 *
 * POD's theme.css stores colors as "R G B" triples (so Tailwind can apply alpha
 * via rgb(var(--color-x) / <alpha-value>)). The Tokens panel wants hex for the
 * native color picker. We keep two views:
 *   - default hex values here (read by the UI)
 *   - convert hex → "R G B" when emitting CSS overrides at runtime
 */

export const POD_DEFAULT_TOKENS = {
  colors: {
    "accent-default": "#16a34a",
    "accent-hover": "#15803d",
    "accent-active": "#166534",
    "accent-fg": "#fafafa",
    "accent-subtle": "#f0fdf4",
    "danger-default": "#b91c1c",
    "danger-hover": "#991b1b",
    "danger-active": "#7f1d1d",
    "danger-fg": "#fafafa",
    "border-default": "#e4e4e7",
    "border-focus": "#16a34a",
    "bg-canvas": "#ffffff",
    "bg-surface": "#fafafa",
    "bg-muted": "#f4f4f5",
    "text-primary": "#18181b",
    "text-secondary": "#52525b",
    "text-muted": "#71717a",
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
