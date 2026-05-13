"use client";
import { useEffect } from "react";
import { X, Sparkles } from "lucide-react";

/**
 * What's New popup — centernode-specific changelog.
 * Distinct from the design-system docs site changelog (which tracks pod-test-ui).
 * This one tracks the centernode playground app itself.
 */

const ENTRIES = [
  {
    version: "0.2",
    date: "2026-05-13",
    sections: [
      {
        title: "POD Components live in the canvas",
        items: [
          "Left sidebar lists every POD primitive from `pod-test-ui` (Button, Checkbox, TextInput, SearchInput, Switch).",
          "Each variant has a live mini-preview rendered with the actual component — click to spawn at canvas center.",
          "Examples row per component (Loading / Disabled / With error / etc.) — preset variants ready to drop.",
          "Sidebar auto-discovers new POD components via `pod-test-ui/canvas` manifest. No manual wiring.",
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
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[520px] max-h-[80vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 shrink-0">
          <div className="w-8 h-8 rounded-md bg-neutral-900 text-amber-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-neutral-900 leading-tight">What's new</div>
            <div className="text-[11px] text-neutral-500 leading-tight mt-0.5">Centernode playground changelog</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close changelog"
            className="w-7 h-7 rounded-md flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body — scroll if content overflows */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {ENTRIES.map((entry, idx) => (
            <div key={entry.version}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[12px] font-semibold text-neutral-900">v{entry.version}</span>
                <span className="text-[10px] font-mono text-neutral-400">·</span>
                <span className="text-[11px] text-neutral-500">{entry.date}</span>
                {idx === 0 && (
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                    Latest
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {entry.sections.map((section) => (
                  <div key={section.title}>
                    <div className="text-[11px] font-semibold text-neutral-700 mb-1.5">{section.title}</div>
                    <ul className="space-y-1 ml-3">
                      {section.items.map((item, i) => (
                        <li
                          key={i}
                          className="text-[12px] leading-relaxed text-neutral-600 relative pl-3 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:rounded-full before:bg-neutral-400"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {idx < ENTRIES.length - 1 && <div className="mt-6 border-t border-neutral-100" />}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-100 text-[10px] text-neutral-400 flex items-center justify-between shrink-0">
          <span>Press <kbd className="font-mono bg-neutral-100 border border-neutral-200 rounded px-1 py-0.5 text-[9px]">Esc</kbd> to close</span>
          <span>POD design system tracks separately at <span className="font-mono">/changelog</span> in docs</span>
        </div>
      </div>
    </div>
  );
}
