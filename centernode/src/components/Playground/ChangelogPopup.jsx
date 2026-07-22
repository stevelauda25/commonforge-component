"use client";
import { X, Sparkles } from "lucide-react";
import Modal from "./Modal";

/**
 * What's New popup — centernode-specific changelog.
 * Distinct from the design-system docs site changelog (which tracks cf-ui).
 * This one tracks the centernode playground app itself.
 */

const ENTRIES = [
  {
    version: "0.5",
    date: "2026-05-17",
    sections: [
      {
        title: "Full UI revamp — warm-dark + amber identity",
        items: [
          "Centernode now has its own visual identity instead of looking like a generic dark IDE. Layered warm-dark surfaces (canvas → surface → elevated → overlay) with amber as the signature accent across selection, primary actions, focus rings, and active states.",
          "Design primitives consolidated into CSS classes: `cn-btn`, `cn-input`, `cn-card`, `cn-chip`, `cn-segmented`, `cn-tabs-minimal`, `cn-row`, `cn-glass`. Every surface reaches for these instead of per-component Tailwind soups — one place to tweak, the whole app responds.",
          "Typography utilities in mono (`cn-mono-meta` for counts/IDs, `cn-eyebrow` for section headers, `cn-display` for titles). Geist Mono used decoratively in chrome so the tool reads designer-developer hybrid.",
          "Custom thin scrollbars that tint amber on hover. Border alphas warm-tinted so dividers read softer than typical cold-grey IDE chrome.",
        ],
      },
      {
        title: "Architectural restructure — Activity Bar + Status Bar + Command Palette",
        items: [
          "**Left rail** (44px) — VSCode-style icon dock with Components / Layers / Search / Tokens. Click to open the corresponding floating panel, click again to collapse (canvas gets full width).",
          "**Status Bar** at the bottom — 22px glass strip with live mouse world coords (RAF-throttled), current tool state, selection summary, and zoom controls. Live caret blinks when editing inside a group, like a debugger HUD.",
          "**Command Palette (⌘K)** — fuzzy-search every action with icons + keyboard shortcuts + grouped by category (Canvas, Panels, Tools, View, Edit, Selection, Help). Arrow keys + Enter to run. Always-visible search trigger in the top header.",
          "**Top header** thinned to 40px. Brand logo gets a subtle amber glow; node count + selection chip show in mono as breadcrumb-style metadata.",
        ],
      },
      {
        title: "Motion system — every interaction eases",
        items: [
          "Duration tokens (`--cn-dur-insta` 90ms → `--cn-dur-stage` 520ms) and easing tokens (`out-expo`, `in-expo`, `spring`, `smooth`) drive every transition in the app. Nothing snaps.",
          "Keyframe library: `cn-anim-fade`, `cn-anim-scale`, `cn-anim-left/right`, `cn-anim-pulse`, plus `cn-anim-stagger` that gives direct children sequential 30ms entrance delays.",
          "Press feedback baked into `cn-btn` — every button compresses to scale 0.97 on `:active` for tactile feel.",
          "`@media (prefers-reduced-motion: reduce)` collapses everything to 0.01ms — accessibility-respectful.",
        ],
      },
      {
        title: "Inspector — flat sectioned layout",
        items: [
          "Cards dropped from group / component / multi-select inspectors. Sections are now `cn-eyebrow` + content + `cn-divider` — reads like a doc, not nested boxes.",
          "Tabs use the minimal text + thin underline pattern (`cn-tabs-minimal`) across Properties / Code on groups, Props / Code / Tokens on components, and POD / Component in the Tokens panel. No chip, no glow.",
          "Identity rows: icon chip (amber-tinted) + inline-editable name + mono meta line (`2 children · ↓ column`) — same pattern across Group / Component / Multi-select for total visual consistency.",
          "Inputs transparent by default — just a thin border. Hover lights the border up; focus turns it amber with a soft ring. No filled chrome competing with the value.",
        ],
      },
      {
        title: "Autolayout — Figma-dense grid + Appearance",
        items: [
          "Autolayout section is now a tight grid: direction segmented at the top, then `AlignGrid` 3×3 picker next to gap + padding scrub inputs. Active dot in the grid context-aware — for Column groups, alignment maps to columns; for Row, to rows.",
          "`ScrubInput` icon variant — single bordered field with leading icon + tiny mono label (`GAP 12`, `PAD 0`). Click-and-drag the icon to scrub, or type. Arrow keys ↑↓ to bump (shift +10).",
          "**Appearance section** — fill (color picker or image upload via data URL), border radius, stroke (width + color). All optional; default to a transparent frame with 0 radius and no stroke. Code preview emits new props live in JSX / Tailwind / HTML formats.",
        ],
      },
      {
        title: "Modals — unified wrapper with proper enter/exit",
        items: [
          "New `<Modal>` wrapper owns the open/close orchestration so every popup (Changelog, Syntax hint, Command Palette) has the same motion. Panel scales 0.97 → 1 with spring easing, backdrop fades + blurs independently. Close runs in reverse before unmount.",
          "Modal panel background now matches the inspector sidebar (`cn-surface`) — visually the same layer, separation comes from the dimmed/blurred backdrop instead of a brighter panel color.",
          "`data-overlay` attribute on every modal — global wheel handler detects it and skips canvas pan/zoom, so scrolling inside a modal doesn't leak through to the canvas behind.",
          "Esc to close, listener bound only while mounted. Pointer events disable during the exit transition so quick clicks don't bounce off a phantom backdrop.",
        ],
      },
      {
        title: "Selection chrome — pixel-accurate + zoom-invariant",
        items: [
          "Selection ring stroke uses `box-shadow: 0 0 0 (1/zoom)px` so the line stays a constant ~1px on screen at any canvas zoom. No more fat blue lines when zoomed in.",
          "Resize handles always sit OUTSIDE the selection ring (`offset` prop on ResizeHandles), consistent on both single components and group containers.",
          "Single-component label: just the node name, no dot indicator, no chrome icons. 8px constant gap to the indicator regardless of zoom. Hidden entirely when canvas zoom < 100%.",
          "Group / Component identity ring color, edit-mode dashed ring, multi-select frame, marquee drag, hover ring — all amber, all 1px-on-screen. Cohesive selection language.",
        ],
      },
      {
        title: "⌘Z undo / redo",
        items: [
          "Cmd / Ctrl+Z reverts node changes; Cmd / Ctrl+Shift+Z (or Cmd+Y) redoes. History is debounced 250ms — drag and scrub mutations all share one snapshot per resting state, so undo unwinds in logical units instead of per-frame.",
          "Snapshot stack capped at 50. Skip when an input is focused so the browser's native field-level undo still works for typo correction.",
        ],
      },
      {
        title: "Misc fixes",
        items: [
          "Drag a single component from anywhere on its body (not just the label). 3px threshold before drag commits — tiny twitch = click, not jitter.",
          "Group drag works when padding = 0 (the old empty-area check meant zero-padding groups were undraggable).",
          "Performance — `useCallback` for the hot handlers + `React.memo` on `PreviewNode`. Dragging one node no longer re-renders all siblings.",
          "Layer panel + LayerRow: chevron rotates with spring easing; rows use `cn-row` primitive for uniform hover/active behaviour.",
          "Tokens panel: now matches Library/Layers panel structure (h-10 header, minimal tabs, flat sections with dividers) instead of looking like a different system.",
        ],
      },
    ],
  },
  {
    version: "0.4",
    date: "2026-05-15",
    sections: [
      {
        title: "Dark mode for centernode itself",
        items: [
          "Centernode app now starts in dark mode by default — matches the theme POD components actually live in on the canvas. Inspector, sidebar, top bar, props panel, code editor: all dark-aware.",
          "Theme toggle (sun / moon icon) in the top header flips the `.dark` class on `<html>`. Choice persists to `localStorage` so reloads keep the picked theme; bootstrap script in `layout.tsx` applies it before React mounts (no flash-of-wrong-theme).",
          "Canvas dot-grid swaps colour with theme — dots stay subtle in both modes instead of burning in dark.",
          "Previously: centernode was light-only, which clashed with dark POD components dropped onto canvas. Now: canvas chrome and component canvas-mode are independent — sidebar mini-previews still have their own light/dark toggle.",
        ],
      },
      {
        title: "Multi-select — shift-click + marquee drag",
        items: [
          "Shift-click any node on canvas to add/remove from selection. Click empty canvas → drag to draw a marquee rectangle; any node intersecting the marquee enters the selection.",
          "Esc clears selection. Single-select still works exactly as before — multi-select is purely additive.",
          "When ≥2 nodes are selected, the per-node blue ring + label dots disappear. A single group-bounding frame replaces them, so the canvas stays visually clean instead of cluttered with overlapping chrome.",
        ],
      },
      {
        title: "Auto-layout — Figma-style Row / Column arrangement",
        items: [
          "Right inspector shows an `Auto layout` panel when ≥2 nodes are selected. Pick `Row` (horizontal) or `Column` (vertical), set a `Gap` (px), click — selected nodes re-flow with uniform spacing.",
          "Anchored to the leftmost (Row) or topmost (Column) node — your sort order is preserved by current X/Y position, so you don't have to re-pick the order.",
          "Each node keeps its own size; only x/y change. No flexbox container — the layout is baked into node positions.",
        ],
      },
      {
        title: "Distribute spacing — equalize gaps for ≥3 nodes",
        items: [
          "`Distribute H` / `Distribute V` buttons appear in the multi-select panel when ≥3 nodes are selected. Pins first + last in place, redistributes the middle nodes so inter-node gaps are equal along the chosen axis.",
          "Useful when you've roughly arranged nodes but spacing is uneven — one click and they snap to even rhythm.",
        ],
      },
      {
        title: "Bulk actions on multi-selection",
        items: [
          "`Duplicate all` clones every selected node at an offset; `Delete all` removes them in one go. Both replace the previous flow of duplicate-one-then-the-next.",
          "Selected-list at the bottom of the multi-select panel shows every node in selection by name with a click-to-focus action — handy for picking one node out of a tight cluster.",
        ],
      },
    ],
  },
  {
    version: "0.3",
    date: "2026-05-14",
    sections: [
      {
        title: "Badge + Tab in the library",
        items: [
          "Badge spawns with 11 color variants (Green / Lime / Orange / Yellow / Red / Purple / Indigo / Sky / Blue / Soft Gray / Dark Gray). Each card shows the real badge with its tag-dot indicator + IBM Plex Mono label.",
          "Tab spawns with 4 style variants (Menu / Underline / ScreenNav / Pill). Underline active state shows the canonical green success bar (was missing in earlier sync due to `bg-success-default` class typo).",
          "Both pulled from `cf-ui@0.1.7` — published lockstep with `cf-tokens@0.1.7`.",
        ],
      },
      {
        title: "Variant prop aliasing — Props panel pills work for non-`variant` APIs",
        items: [
          "Badge uses `color` prop (not `variant`); Tab uses `tabType`. Centernode now treats those as the variant pill source via a shared `VARIANT_PROP_ALIAS` map (`utils/variantAliases.js`).",
          "Pill selector in Props panel renders 11 colors for Badge / 4 styles for Tab — same UX as Button/variant.",
          "Bidirectional sync intact: pick a pill → JSX in editor updates (`<Badge color=\"indigo\">`); edit code manually → pill highlights the new value.",
          "Single-option `size` arrays no longer render a useless 1-item size pill (Badge & Tab only have `size: ['default']`).",
        ],
      },
      {
        title: "Tab atom — Figma fidelity pass",
        items: [
          "Per-cell audit of the 16-state matrix (4 types × 4 states) against Figma node 2412:1375. Every fill / stroke / text / icon color matched cell by cell.",
          "Added `experiment-tab-border`, `experiment-tab-text`, `experiment-tab-text-disabled` tokens to match Figma `stroke/strong` (#18181b), `text/soft` (#7c7e84), `text/disabled` (#3a3a3d) — values that didn't map cleanly to existing semantic tokens.",
          "Underline indicator renders for Active state only (matched Figma `<div h-0>` invisibility for inactive). Fixed `bg-success-default` → `bg-success` (the `-default` suffix is implicit when the color has a DEFAULT key in the preset).",
          "Restructured `tabs.tsx` into `inactiveClasses` / `activeClasses` maps — eliminates Tailwind cascade conflicts when default-bg and active-bg both exist on the same element.",
        ],
      },
      {
        title: "canvas-sync infra fix",
        items: [
          "`scripts/canvas/sync.mjs` now reads `name:` field from each `canvas.ts` instead of always deriving from `kebabToPascal(dir)`. Fixes plural-folder / singular-export mismatch (`badges/` → `Badge`, `tabs/` → `Tab`).",
          "Regenerated `centernode/src/utils/cfRuntime.js` — imports now correctly reference `Badge` and `Tab` (was `Badges` / `Tabs`, breaking build).",
        ],
      },
    ],
  },
  {
    version: "0.2",
    date: "2026-05-13",
    sections: [
      {
        title: "POD Components live in the canvas",
        items: [
          "Left sidebar lists every POD primitive from `cf-ui` (Button, Checkbox, TextInput, SearchInput, Switch).",
          "Each variant has a live mini-preview rendered with the actual component — click to spawn at canvas center.",
          "Examples row per component (Loading / Disabled / With error / etc.) — preset variants ready to drop.",
          "Sidebar auto-discovers new POD components via `cf-ui/canvas` manifest. No manual wiring.",
        ],
      },
      {
        title: "Light / Dark preview toggle",
        items: [
          "Theme toggle in sidebar header (sun / moon icon).",
          "Affects sidebar previews. Dropped nodes lock the mode they were spawned in — toggling later doesn't ripple to existing nodes on canvas.",
          "Scope uses POD's `.dark` class on the preview wrapper. CSS variables cascade correctly.",
        ],
      },
      {
        title: "Inspector improvements (right panel)",
        items: [
          "Props panel — variant + size show as enum pills (Primary / Outline / Error). Change variant → re-renders + tokens scope updates.",
          "Code panel — JSX (`<Button variant=\"primary\">Save</Button>`) instead of raw `h()` calls. Sucrase transpiles on the fly.",
          "Tokens panel — scoped per variant. Selecting Button / primary shows only accent-*; Button / error shows danger-*. No noise.",
        ],
      },
      {
        title: "Font & visual parity",
        items: [
          "Centernode body now uses Inter via `next/font/google` — matches POD docs visually.",
          "POD's compiled CSS no longer ships `@tailwind base` (was leaking element-level preflight). Centernode UI restored.",
        ],
      },
      {
        title: "Bug fixes",
        items: [
          "HTML templates (Switch / Knob / Slider HTML demos) no longer fail on JSX transform — Sucrase now skips the iframe branch.",
          "Duplicate parameter conflict resolved (when both user code and POD scope declare `Button` etc.).",
          "Demo \"Click me\" node no longer auto-spawns on startup. Canvas starts empty with sidebar prompt.",
          "Stale storage entries from older versions get filtered on load.",
        ],
      },
      {
        title: "Slash commands (terminal-side)",
        items: [
          "`/run [docs|centernode|client-test|all]` — idempotent dev-server launcher.",
          "`/restart-server [docs|centernode|all]` — force kill + cache clear + restart.",
          "`/verify-component <slug>` — post-sync fidelity audit per (variant, state, size).",
        ],
      },
    ],
  },
  {
    version: "0.1",
    date: "2026-05-12",
    sections: [
      {
        title: "Initial playground scaffold",
        items: [
          "Infinite canvas with pan / zoom / measure / resize handles.",
          "Add component menu (templates: Button, Knob, Slider, Switch HTML, etc.).",
          "Per-node props + token override panels (legacy centernode tokens).",
          "Save / restore via local storage. JSON import/export.",
        ],
      },
    ],
  },
];

export default function ChangelogPopup({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} width={560} ariaLabel="What's new">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-cn-border-subtle shrink-0">
        <div
          className="w-8 h-8 rounded-md bg-cn-accent-soft text-cn-accent flex items-center justify-center shrink-0"
          style={{ boxShadow: "0 0 12px -2px var(--cn-accent-ring)" }}
        >
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="cn-display">What's new</div>
          <div className="cn-mono-meta mt-0.5">Centernode playground changelog</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close changelog"
          className="cn-btn cn-btn-ghost cn-btn-icon cn-btn-sm"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body — internal scroll, doesn't leak to canvas behind */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 cn-anim-stagger">
        {ENTRIES.map((entry, idx) => (
          <div key={entry.version}>
            <div className="flex items-center gap-2 mb-3">
              <span className="cn-display">v{entry.version}</span>
              <span className="cn-mono-meta">·</span>
              <span className="cn-mono-meta">{entry.date}</span>
              {idx === 0 && (
                <span className="cn-chip cn-chip-accent">LATEST</span>
              )}
            </div>

            <div className="space-y-4">
              {entry.sections.map((section) => (
                <div key={section.title}>
                  <div className="cn-label-strong mb-1.5">{section.title}</div>
                  <ul className="space-y-1.5 ml-3">
                    {section.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-[12px] leading-relaxed text-cn-text-secondary relative pl-3 before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:rounded-full before:bg-cn-text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {idx < ENTRIES.length - 1 && <div className="cn-divider mt-6" />}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-cn-border-subtle flex items-center justify-between shrink-0 cn-mono-meta">
        <span className="flex items-center gap-1.5">
          Press <span className="cn-chip">Esc</span> to close
        </span>
        <span>POD design system tracks separately</span>
      </div>
    </Modal>
  );
}
