"use client";
import { useEffect, useRef, useState } from "react";

// =============================================================
// Number input with Figma-style drag-to-scrub. The LABEL is the scrubber:
// hover it, the cursor becomes ew-resize, and dragging horizontally bumps
// the value. The input itself still accepts typing + arrow keys, so power
// users get keyboard precision and quick clicks both work.
//
// Props:
//   value     — current number
//   onChange  — (next: number) => void
//   label     — text shown as the scrubber (e.g. "Gap")
//   suffix    — small unit hint (e.g. "px")
//   min/max   — clamping bounds (defaults 0 / 1000)
//   step      — increment per pixel during scrub (default 1)
export default function ScrubInput({
  value,
  onChange,
  // Either `icon` (compact Figma-style input with leading icon) OR
  // `label` (text on the left). Mutually exclusive — icon wins.
  icon,
  label,
  suffix = "px",
  showSuffix = false,
  min = 0,
  max = 1000,
  step = 1,
  // Optional: custom width for the label column so multiple ScrubInputs
  // can line up.
  labelWidth = 56,
}) {
  const [local, setLocal] = useState(String(value));
  const [focused, setFocused] = useState(false);
  const startRef = useRef(null);

  // Keep local string in sync when the external value changes (e.g. from
  // a drag-resize), but never overwrite while the user is typing.
  useEffect(() => {
    if (!focused) setLocal(String(value));
  }, [value, focused]);

  const clamp = (n) => Math.max(min, Math.min(max, n));

  const startScrub = (e) => {
    // Only left-click + on the label (not on the input).
    if (e.button !== 0) return;
    e.preventDefault();
    startRef.current = { x: e.clientX, base: typeof value === "number" ? value : 0 };
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";

    const onMove = (ev) => {
      if (!startRef.current) return;
      const dx = ev.clientX - startRef.current.x;
      // ~2px of drag per step keeps the scrub feeling neither sluggish nor
      // hair-trigger. Hold shift for finer 1px-per-step control.
      const pxPerStep = ev.shiftKey ? 4 : 2;
      const delta = Math.round(dx / pxPerStep) * step;
      onChange(clamp(startRef.current.base + delta));
    };
    const onUp = () => {
      startRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const commit = () => {
    const n = parseFloat(local);
    if (Number.isFinite(n)) onChange(clamp(n));
    else setLocal(String(value));
  };

  // Input variant — when `icon` is provided, the input renders as a
  // single compact field with a leading icon (Figma-style). When `label`
  // is provided instead, the legacy label-on-the-side layout kicks in.
  const Icon = typeof icon === "function" ? icon : null;
  const inputEl = (
    <input
      type="text"
      inputMode="numeric"
      value={local}
      onFocus={(e) => {
        setFocused(true);
        e.target.select();
      }}
      onBlur={() => {
        setFocused(false);
        commit();
      }}
      onChange={(e) => {
        const v = e.target.value.replace(/[^\d-]/g, "");
        setLocal(v);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        else if (e.key === "Escape") {
          setLocal(String(value));
          e.currentTarget.blur();
        } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
          const bump = (e.key === "ArrowUp" ? 1 : -1) * (e.shiftKey ? 10 : 1);
          onChange(clamp((typeof value === "number" ? value : 0) + bump));
        }
      }}
      className="w-full text-[11px] bg-transparent text-cn-text-primary outline-none tabular-nums"
    />
  );

  // Icon-prefixed compact variant — transparent bg, just a border. On
  // hover the border lights up; on focus it becomes accent with a soft
  // ring. Optional `label` shows as a tiny mono prefix between the icon
  // and the value so the field's purpose is glanceable (Gap, Pad, etc).
  if (Icon) {
    return (
      <div
        className={`flex items-center gap-2 h-7 px-2 rounded-md border bg-transparent transition-colors ${
          focused ? "border-cn-accent" : "border-cn-border-subtle hover:border-cn-border-default"
        }`}
        style={focused ? { boxShadow: "0 0 0 3px var(--cn-accent-ring)" } : undefined}
      >
        <button
          type="button"
          onMouseDown={startScrub}
          title={label ? `${label} — drag to adjust · shift = fine` : "Drag to adjust · shift = fine"}
          className="text-cn-text-muted hover:text-cn-text-secondary shrink-0 cursor-ew-resize flex items-center gap-1.5"
        >
          <Icon className="w-3 h-3" />
          {label && (
            <span className="cn-mono text-[10px] tracking-wide uppercase">
              {label}
            </span>
          )}
        </button>
        {inputEl}
      </div>
    );
  }

  // Label-on-the-side variant — same transparent treatment.
  return (
    <div className="flex items-center gap-1.5">
      <span
        onMouseDown={startScrub}
        title="Drag to adjust · shift = fine"
        className="text-[11px] text-cn-text-muted shrink-0 cursor-ew-resize select-none hover:text-cn-text-secondary"
        style={{ width: labelWidth }}
      >
        {label}
      </span>
      <div
        className={`flex-1 flex items-center h-7 px-2 rounded-md border bg-transparent transition-colors ${
          focused ? "border-cn-accent" : "border-cn-border-subtle hover:border-cn-border-default"
        }`}
        style={focused ? { boxShadow: "0 0 0 3px var(--cn-accent-ring)" } : undefined}
      >
        {inputEl}
      </div>
      {suffix && showSuffix && (
        <span className="text-[10px] text-cn-text-muted w-4 shrink-0">
          {suffix}
        </span>
      )}
    </div>
  );
}
