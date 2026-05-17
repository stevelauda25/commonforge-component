"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react";
import Modal from "./Modal";

// =============================================================
// Command palette — ⌘K (or Ctrl+K) opens a centered glass overlay with
// fuzzy search across registered actions. Mouse + keyboard navigation;
// Enter executes, Esc closes. The list is virtualized via simple
// max-height scroll for now — typical action sets are small.
//
// Action shape: { id, label, hint?, shortcut?, run: () => void, group? }
export default function CommandPalette({
  open,
  onClose,
  actions,
}) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus input on open + clear state on close.
  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      // wait a frame for animation to mount the input
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Fuzzy match — character-in-order with case-insensitive matching.
  // Score = how tightly matched chars cluster + bonus for label prefix.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    const scored = [];
    for (const a of actions) {
      const target = (a.label + " " + (a.hint || "") + " " + (a.group || "")).toLowerCase();
      let qi = 0;
      let lastIdx = -1;
      let score = 0;
      let allMatched = true;
      for (let i = 0; i < target.length && qi < q.length; i++) {
        if (target[i] === q[qi]) {
          score += (i === 0 || lastIdx === i - 1) ? 3 : 1;
          lastIdx = i;
          qi++;
        }
      }
      if (qi < q.length) allMatched = false;
      if (allMatched) {
        if (target.startsWith(q)) score += 10;
        scored.push({ a, score });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.a);
  }, [query, actions]);

  // Reset cursor to top whenever filtered list changes.
  useEffect(() => {
    setCursor(0);
  }, [query]);

  // Keyboard nav.
  const onKeyDown = (e) => {
    if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
    if (e.key === "Enter") {
      e.preventDefault();
      const action = filtered[cursor];
      if (action) {
        action.run();
        onClose();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(filtered.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    }
  };

  // Scroll cursor into view.
  useEffect(() => {
    if (!listRef.current) return;
    const row = listRef.current.querySelector(`[data-cmd-idx="${cursor}"]`);
    row?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  return (
    <Modal open={open} onClose={onClose} align="top" width={560} ariaLabel="Command palette">
        {/* Input row */}
        <div className="flex items-center gap-2 px-4 h-12 border-b border-cn-border-subtle">
          <Search className="w-3.5 h-3.5 text-cn-text-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a command, search for nodes or actions…"
            className="flex-1 bg-transparent outline-none text-cn-text-primary text-[13px] placeholder:text-cn-text-muted"
          />
          <span className="cn-mono-meta px-1.5 py-0.5 rounded border border-cn-border-default bg-cn-elevated">
            esc
          </span>
        </div>

        {/* Result list */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-cn-text-muted text-[12px]">
              No matching commands
            </div>
          ) : (
            (() => {
              const groups = [];
              let lastGroup = null;
              filtered.forEach((a, idx) => {
                if (a.group !== lastGroup) {
                  groups.push({ type: "header", label: a.group || "Other" });
                  lastGroup = a.group;
                }
                groups.push({ type: "row", action: a, idx });
              });
              return groups.map((g, gi) =>
                g.type === "header" ? (
                  <div
                    key={`h-${gi}`}
                    className="cn-eyebrow px-4 pt-2 pb-1"
                  >
                    {g.label}
                  </div>
                ) : (
                  <button
                    key={g.action.id}
                    type="button"
                    data-cmd-idx={g.idx}
                    onMouseEnter={() => setCursor(g.idx)}
                    onClick={() => { g.action.run(); onClose(); }}
                    className={`w-full flex items-center gap-3 px-4 h-9 text-left relative transition-colors ${
                      cursor === g.idx
                        ? "bg-cn-elevated text-cn-text-primary"
                        : "text-cn-text-secondary hover:bg-cn-elevated/60"
                    }`}
                  >
                    {/* Active row left-bar — narrow amber accent indicator
                        instead of full-row tint. Same vibe as VSCode /
                        Linear keyboard menus. */}
                    {cursor === g.idx && (
                      <span
                        className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r-full bg-cn-accent"
                        style={{ boxShadow: "0 0 6px var(--cn-accent-ring)" }}
                      />
                    )}
                    {g.action.icon ? (
                      <g.action.icon
                        className={`w-3.5 h-3.5 shrink-0 ${cursor === g.idx ? "text-cn-accent" : "text-cn-text-muted"}`}
                      />
                    ) : (
                      <span className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="flex-1 text-[12px]">{g.action.label}</span>
                    {g.action.hint && (
                      <span className="text-[11px] text-cn-text-muted truncate max-w-[180px]">
                        {g.action.hint}
                      </span>
                    )}
                    {g.action.shortcut && (
                      <span className="cn-mono-meta px-1.5 py-0.5 rounded border border-cn-border-subtle bg-cn-elevated shrink-0">
                        {g.action.shortcut}
                      </span>
                    )}
                  </button>
                )
              );
            })()
          )}
        </div>

        {/* Footer — keyboard hint strip */}
        <div className="flex items-center gap-3 px-3 py-1.5 border-t border-cn-border-subtle cn-mono-meta">
          <span className="flex items-center gap-1">
            <ArrowUp className="w-2.5 h-2.5" />
            <ArrowDown className="w-2.5 h-2.5" />
            <span className="ml-1">navigate</span>
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-2.5 h-2.5" />
            <span>open</span>
          </span>
          <span className="ml-auto">⌘K to toggle</span>
        </div>
    </Modal>
  );
}
