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
    // Backgrounds
    "bg-canvas":   "#09090b",
    "bg-surface":  "#111113",
    "bg-elevated": "#1c1c1f",
    "bg-muted":    "#18181b",
    "bg-subtle":   "#111113",
    "bg-disabled": "#1c1c1f",
    "bg-inverse":  "#fafafa",
    "bg-neutral":  "#7c7e84",
    "bg-brand":             "#15803d",
    "bg-brand-hover":       "#15803d",
    "bg-brand-subtle":      "#0b2115",
    "bg-destructive":       "#991b1b",
    "bg-destructive-hover": "#991b1b",
    "bg-destructive-subtle":"#260d0e",
    "bg-error":          "#ef4444",
    "bg-error-subtle":   "#260d0e",
    "bg-success":        "#22c55e",
    "bg-success-subtle": "#0b2115",
    "bg-warning":        "#eab308",
    "bg-warning-subtle": "#422006",
    "bg-info":           "#3b82f6",
    "bg-info-subtle":    "#172554",

    // Borders
    "border-default":            "#18181b",
    "border-subtle":             "#3a3a3d",
    "border-strong":             "#1c1c1f",
    "border-brand":              "#16a34a",
    "border-destructive":        "#b91c1c",
    "border-destructive-subtle": "#7f1d1d",
    "border-disabled":           "#3a3a3d",
    "border-error":              "#ef4444",
    "border-info":               "#3b82f6",
    "border-inverse":            "#fafafa",
    "border-success":            "#22c55e",
    "border-warning":            "#eab308",

    // Text
    "text-default":     "#f4f4f5",
    "text-strong":      "#fafafa",
    "text-subtle":      "#7c7e84",
    "text-muted":       "#a1a1aa",
    "text-disabled":    "#3a3a3d",
    "text-placeholder": "#3a3a3d",
    "text-inverse":     "#09090b",
    "text-brand":       "#4ade80",
    "text-success":     "#4ade80",
    "text-destructive": "#f87171",
    "text-error":       "#ef4444",
    "text-warning":     "#facc15",
    "text-info":        "#60a5fa",
    "text-on-brand":       "#fafafa",
    "text-on-destructive": "#fafafa",
    "text-on-success":     "#fafafa",
    "text-on-warning":     "#09090b",
    "text-on-info":        "#fafafa",

    // Icon (parallel to text)
    "icon-default":     "#f4f4f5",
    "icon-strong":      "#fafafa",
    "icon-subtle":      "#7c7e84",
    "icon-muted":       "#a1a1aa",
    "icon-disabled":    "#3a3a3d",
    "icon-placeholder": "#3a3a3d",
    "icon-inverse":     "#09090b",
    "icon-brand":       "#4ade80",
    "icon-success":     "#4ade80",
    "icon-destructive": "#f87171",
    "icon-error":       "#ef4444",
    "icon-warning":     "#facc15",
    "icon-info":        "#60a5fa",
    "icon-on-brand":       "#fafafa",
    "icon-on-destructive": "#fafafa",
    "icon-on-success":     "#fafafa",
    "icon-on-warning":     "#09090b",
    "icon-on-info":        "#fafafa",

    // Foreground (decorative)
    "fg-default":   "#f4f4f5",
    "fg-subtle":    "#3a3a3d",
    "fg-disabled":  "#3a3a3d",
    "fg-brand":     "#22c55e",
    "fg-on-brand":  "#fafafa",

    // Badges — pill bg (dark in dark mode)
    "bg-badge-green":   "#0b2115",
    "bg-badge-blue":    "#172554",
    "bg-badge-orange":  "#431407",
    "bg-badge-lime":    "#1a2e05",
    "bg-badge-indigo":  "#1e1b4b",
    "bg-badge-red":     "#260d0e",
    "bg-badge-purple":  "#3b0764",
    "bg-badge-sky":     "#082f49",
    "bg-badge-yellow":  "#422006",

    // Badge text — pastel in dark mode
    "text-badge-green":  "#dcfce7",
    "text-badge-blue":   "#dbeafe",
    "text-badge-orange": "#ffedd5",
    "text-badge-lime":   "#ecfccb",
    "text-badge-indigo": "#e0e7ff",
    "text-badge-red":    "#fee2e2",
    "text-badge-purple": "#f3e8ff",
    "text-badge-sky":    "#e0f2fe",
    "text-badge-yellow": "#fef9c3",

    // Badge middle-ring accent — primitive {color}/500, same in both modes
    "badge-orange-accent": "#f97316",
    "badge-lime-accent":   "#84cc16",
    "badge-purple-accent": "#a855f7",
    "badge-green-accent":  "#22c55e",
    "badge-indigo-accent": "#6366f1",
    "badge-sky-accent":    "#0ea5e9",
    "badge-blue-accent":   "#3b82f6",
    "badge-red-accent":    "#ef4444",
    "badge-yellow-accent": "#eab308",
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

export function cfTokensToCSS(tokens) {
  let css = ":root {";
  for (const [key, val] of Object.entries(tokens.colors || {})) {
    css += `--color-${key}: ${hexToRgbTriple(val)};`;
  }
  css += "}";
  return css;
}
