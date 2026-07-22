import { hexToRgbTriple } from "./cfTokens";

/**
 * Build inline CSS variables for a node's tokenOverrides object.
 *
 * Two namespaces are supported:
 *   - legacy/centernode tokens (key has no dash):   --token-${category}-${key}
 *   - POD design system tokens (key is dash-cased): --color-${key} as `R G B`
 *
 * Both can coexist on the same node — POD components react to --color-* and
 * legacy templates react to --token-*. Color values for POD vars are converted
 * from hex (color picker output) to the "R G B" triple POD theme.css expects.
 */
export function buildNodeTokenStyle(overrides) {
  if (!overrides || Object.keys(overrides).length === 0) return {};
  const style = {};
  for (const [category, values] of Object.entries(overrides)) {
    for (const [key, val] of Object.entries(values)) {
      if (category === "colors" && key.includes("-")) {
        // POD token (e.g. accent-default, danger-hover) → RGB triple
        style[`--color-${key}`] = hexToRgbTriple(val);
      } else {
        // Legacy centernode token
        style[`--token-${category}-${key}`] = val;
      }
    }
  }
  return style;
}
