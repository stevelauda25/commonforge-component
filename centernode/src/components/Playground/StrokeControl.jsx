"use client";
import { useRef, useState } from "react";
import { X } from "lucide-react";

// =============================================================
// StrokeControl — single-row stroke property (color swatch + width).
// Mirrors the FillControl shape so Fill / Stroke read as siblings in
// the Appearance list.
//
// When `width === 0` the row collapses to a "None / click to add" state.
// Clicking the swatch promotes it: width → 1, color → white (or the
// last-used colour if we tracked one; not yet implemented).
export default function StrokeControl({ width, color, onChange }) {
  const colorInputRef = useRef(null);
  const [scrubbing, setScrubbing] = useState(false);
  const [local, setLocal] = useState(String(width));

  // Sync external width changes back into the local input when not editing.
  if (String(width) !== local && !scrubbing) {
    // small guard: only sync if the typed value isn't currently focused
    // (we use blur-driven commits so this is safe most of the time).
  }

  const hasStroke = width > 0;

  // Scrub the swatch (vertical bar metaphor — drag right to thicken).
  const startScrub = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX;
    const startW = width || 0;
    setScrubbing(true);
    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const next = Math.max(0, Math.min(64, startW + Math.round(dx / 2)));
      onChange?.({ width: next, color });
    };
    const onUp = () => {
      setScrubbing(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Empty / "no stroke" state — single faint row with a checker swatch.
  // Click anywhere on it to promote to a real stroke.
  if (!hasStroke) {
    return (
      <button
        type="button"
        onClick={() => onChange?.({ width: 1, color: color || "#ffffff" })}
        className="w-full flex items-center gap-2 h-7 px-2 rounded-md border border-cn-border-subtle hover:border-cn-border-default bg-transparent text-cn-text-muted transition-colors text-left"
      >
        <span
          className="w-4 h-4 rounded-sm border border-cn-border-subtle shrink-0"
          style={{
            background:
              "repeating-conic-gradient(var(--cn-border-default) 0% 25%, transparent 0% 50%) 50% / 8px 8px",
          }}
        />
        <span className="cn-mono text-[11px] flex-1">None</span>
        <span className="cn-mono-meta">add</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 h-7 px-2 rounded-md border border-cn-border-subtle hover:border-cn-border-default bg-transparent transition-colors">
      <button
        type="button"
        onMouseDown={startScrub}
        onClick={() => colorInputRef.current?.click()}
        className="w-4 h-4 rounded-sm border border-cn-border-subtle shrink-0 cursor-ew-resize"
        style={{ background: color || "#ffffff" }}
        title="Drag to adjust width · click to pick colour"
      />
      <input
        ref={colorInputRef}
        type="color"
        value={color || "#ffffff"}
        onChange={(e) => onChange?.({ width, color: e.target.value })}
        className="sr-only"
      />
      <span className="cn-mono text-[11px] text-cn-text-primary flex-1 truncate">
        {(color || "#ffffff").toUpperCase()}
      </span>
      {/* Width input — compact, mono, no label. The icon swatch is the
          scrubber; this is the typed-input fallback. */}
      <input
        type="text"
        inputMode="numeric"
        value={local}
        onFocus={(e) => { setScrubbing(true); e.target.select(); }}
        onBlur={() => {
          setScrubbing(false);
          const n = parseFloat(local);
          if (Number.isFinite(n)) onChange?.({ width: Math.max(0, Math.min(64, n)), color });
          else setLocal(String(width));
        }}
        onChange={(e) => {
          const v = e.target.value.replace(/[^\d-]/g, "");
          setLocal(v);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          else if (e.key === "Escape") { setLocal(String(width)); e.currentTarget.blur(); }
          else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            const bump = (e.key === "ArrowUp" ? 1 : -1) * (e.shiftKey ? 10 : 1);
            onChange?.({ width: Math.max(0, Math.min(64, (width || 0) + bump)), color });
          }
        }}
        className="w-8 text-right cn-mono text-[11px] text-cn-text-primary bg-transparent outline-none tabular-nums"
      />
      <button
        type="button"
        onClick={() => onChange?.({ width: 0, color })}
        className="text-cn-text-muted hover:text-cn-danger shrink-0 transition-colors"
        title="Remove stroke"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
