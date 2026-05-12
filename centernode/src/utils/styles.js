
export function buildNodeTokenStyle(overrides) {
  if (!overrides || Object.keys(overrides).length === 0) return {};
  const style = {};
  for (const [category, values] of Object.entries(overrides)) {
    for (const [key, val] of Object.entries(values)) {
      style[`--token-${category}-${key}`] = val;
    }
  }
  return style;
}
