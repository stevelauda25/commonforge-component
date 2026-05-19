/**
 * Shared focus-ring classes so every interactive component has identical
 * keyboard focus affordance. Uses the semantic `ring-brand` token so the
 * ring colour automatically swaps in dark mode.
 */
export const focusRing =
  'focus-visible:outline-none ' +
  'focus-visible:ring-2 ' +
  'focus-visible:ring-brand ' +
  'focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-bg-canvas';
