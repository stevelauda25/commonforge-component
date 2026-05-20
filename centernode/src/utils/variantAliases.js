/**
 * Components where the conceptual "variant" maps to a real component prop
 * with a different name. The sidebar's synthetic `variant: <key>` is
 * rewritten under this prop name before the JSX is spawned, and the props
 * panel reads this map so the pill selector appears under the right key.
 *
 * Single source of truth — keep PodLibraryPanel.jsx and utils/parser.js
 * importing from here.
 */
export const VARIANT_PROP_ALIAS = {
  Badge: "color",     // 11 color variants → Badge.color
  Tab:   "tabType",   // 4 style variants  → Tab.tabType
  Tag:   "color",     // 2 color variants  → Tag.color
};
