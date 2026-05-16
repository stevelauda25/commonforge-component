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
  label,
  suffix = "px",
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

  return (
    <div className="flex items-center gap-1.5">
      <span
        onMouseDown={startScrub}
        title="Drag to adjust · shift = fine"
        className="text-[11px] text-neutral-500 dark:text-neutral-400 shrink-0 cursor-ew-resize select-none hover:text-neutral-700 dark:hover:text-neutral-200"
        style={{ width: labelWidth }}
      >
        {label}
      </span>
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
          // Allow typing freely; commit on blur / Enter. Strip non-digit
          // chars except a leading minus.
          const v = e.target.value.replace(/[^\d-]/g, "");
          setLocal(v);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          } else if (e.key === "Escape") {
            setLocal(String(value));
            e.currentTarget.blur();
          } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            const bump = (e.key === "ArrowUp" ? 1 : -1) * (e.shiftKey ? 10 : 1);
            onChange(clamp((typeof value === "number" ? value : 0) + bump));
          }
        }}
        className="flex-1 min-w-0 text-[11px] px-2 py-1 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-md focus:border-neutral-400 dark:focus:border-neutral-500 outline-none tabular-nums"
      />
      {suffix && (
        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 w-4 shrink-0">
          {suffix}
        </span>
      )}
    </div>
  );
}
