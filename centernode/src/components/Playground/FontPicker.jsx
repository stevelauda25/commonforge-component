"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Check, Search } from "lucide-react";

// =============================================================
// FontPicker — combo dropdown listing fonts available on this machine.
//
// Priority order:
//   1. Local Font Access API (window.queryLocalFonts) — Chromium-only,
//      requires user permission. Surfaces every installed system font.
//   2. document.fonts iterable — fonts already loaded into the page (e.g.
//      Geist Mono / Geist Sans from Next.js).
//   3. Curated web-safe fallback list — always present so the picker is
//      never empty even on browsers without #1 and pages without #2.

const FALLBACK_FONTS = [
  "system-ui",
  "ui-sans-serif",
  "ui-serif",
  "ui-monospace",
  "Inter",
  "Geist",
  "Geist Mono",
  "Arial",
  "Helvetica",
  "Helvetica Neue",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Menlo",
  "Monaco",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Comic Sans MS",
  "Impact",
];

function dedupe(arr) {
  return Array.from(new Set(arr.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

export default function FontPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [fonts, setFonts] = useState(FALLBACK_FONTS);
  const [localFontsLoaded, setLocalFontsLoaded] = useState(false);
  const [localFontsError, setLocalFontsError] = useState(null);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  // Pull anything document.fonts already knows about (Next.js fonts, @import,
  // @font-face declared in globals.css). This is free — no permission needed.
  useEffect(() => {
    if (typeof document === "undefined" || !document.fonts) return;
    const fromDocument = [];
    document.fonts.forEach((f) => {
      if (f.family) fromDocument.push(f.family.replace(/^['"]|['"]$/g, ""));
    });
    setFonts((prev) => dedupe([...prev, ...fromDocument]));
  }, []);

  // Click-away.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Focus search input on open.
  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const loadLocalFonts = async () => {
    if (typeof window === "undefined" || typeof window.queryLocalFonts !== "function") {
      setLocalFontsError("not-supported");
      return;
    }
    try {
      const available = await window.queryLocalFonts();
      const families = available.map((f) => f.family);
      setFonts((prev) => dedupe([...prev, ...families]));
      setLocalFontsLoaded(true);
      setLocalFontsError(null);
    } catch (err) {
      setLocalFontsError(err?.name === "NotAllowedError" ? "denied" : "failed");
    }
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return fonts;
    const q = query.toLowerCase();
    return fonts.filter((f) => f.toLowerCase().includes(q));
  }, [fonts, query]);

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center h-7 bg-transparent border rounded-md transition-colors ${
          open
            ? "border-cn-accent"
            : "border-cn-border-subtle hover:border-cn-border-default"
        }`}
        style={open ? { boxShadow: "0 0 0 3px var(--cn-accent-ring)" } : undefined}
      >
        <span
          className="flex-1 min-w-0 truncate text-left pl-2 pr-1 text-[11px] text-cn-text-primary"
          style={{ fontFamily: value || "system-ui" }}
        >
          {value || "system-ui"}
        </span>
        <span className="flex items-center justify-center w-5 h-full text-cn-text-muted shrink-0">
          <ChevronDown className="w-3 h-3" />
        </span>
      </button>

      {open && (
        <div
          data-overlay
          className="absolute top-full left-0 right-0 mt-1 cn-glass rounded-lg shadow-xl z-50 cn-anim-in overflow-hidden"
          style={{ animationDuration: "var(--cn-dur-snappy)" }}
        >
          <div className="flex items-center gap-1.5 px-2 h-8 border-b border-cn-border-subtle">
            <Search className="w-3 h-3 text-cn-text-muted shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search font…"
              className="flex-1 min-w-0 bg-transparent text-[11px] outline-none text-cn-text-primary placeholder:text-cn-text-disabled"
            />
          </div>
          <div className="max-h-[260px] overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 cn-mono-meta">No matches</div>
            ) : (
              filtered.map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => {
                    onChange(font);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="w-full flex items-center gap-2 px-3 h-7 hover:bg-cn-elevated text-left group transition-colors"
                >
                  <span
                    className="flex-1 min-w-0 truncate text-[11px] text-cn-text-secondary group-hover:text-cn-text-primary"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </span>
                  {value === font && <Check className="w-3 h-3 text-cn-accent shrink-0" />}
                </button>
              ))
            )}
          </div>
          {!localFontsLoaded && (
            <div className="border-t border-cn-border-subtle px-2 py-1.5 flex items-center justify-between gap-2">
              <span className="cn-mono-meta truncate">
                {localFontsError === "not-supported"
                  ? "Local Font Access API not in this browser"
                  : localFontsError === "denied"
                    ? "Permission denied"
                    : localFontsError === "failed"
                      ? "Failed to load"
                      : "Want every installed font?"}
              </span>
              <button
                type="button"
                onClick={loadLocalFonts}
                disabled={localFontsError === "not-supported"}
                className="cn-btn cn-btn-outline cn-btn-sm shrink-0"
              >
                Load system fonts
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
