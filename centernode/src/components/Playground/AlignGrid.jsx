"use client";

// =============================================================
// 3×3 alignment picker — Figma-style. Each dot represents a flex
// alignment combination (cross-axis row × main-axis column).
// Mapping for direction = "row":
//   • column = justify-content (start | center | end on main axis)
//   • row    = align-items (start | center | end on cross axis)
// For direction = "column", axes flip — the component swaps the
// mapping so the visual hit-target stays intuitive ("top-left" always
// means "top-left").
//
// We currently expose only `align` (alignItems). Clicks on any column
// resolve to the same `align` row. A future justify-content prop can
// hook into the column index.
export default function AlignGrid({
  direction = "row",
  align = "start", // "start" | "center" | "end" | "stretch"
  onChange,
}) {
  const isRow = direction === "row";
  // alignItems controls the CROSS axis:
  //   • direction=row    → cross is vertical   → row index (0=top, 2=bottom)
  //   • direction=column → cross is horizontal → column index (0=left, 2=right)
  // Map align value → cross-axis slot index (0/1/2).
  const alignIdx = align === "end" ? 2 : align === "center" ? 1 : 0;
  const slotForIdx = ["start", "center", "end"];

  return (
    <div
      className="grid grid-cols-3 grid-rows-3 gap-0 p-1.5 rounded-md border border-cn-border-subtle bg-cn-elevated"
      style={{ width: 72, height: 56 }}
    >
      {[0, 1, 2].flatMap((rowI) =>
        [0, 1, 2].map((colI) => {
          // Cross-axis slot for THIS cell, based on direction.
          const cellCrossIdx = isRow ? rowI : colI;
          const isActiveCross = cellCrossIdx === alignIdx;
          // Active dot sits on the center of the main axis (the other
          // index = 1) so it visually anchors the chosen alignment.
          const mainIdx = isRow ? colI : rowI;
          const isActiveDot = isActiveCross && mainIdx === 1;
          const slot = slotForIdx[cellCrossIdx];
          return (
            <button
              key={`${rowI}-${colI}`}
              type="button"
              onClick={() => onChange?.(slot)}
              title={`align ${slot}`}
              className="flex items-center justify-center hover:bg-cn-overlay/50 rounded-sm transition-colors"
              aria-pressed={isActiveDot}
            >
              <span
                className="rounded-full transition-all"
                style={{
                  width: isActiveDot ? 5 : 3,
                  height: isActiveDot ? 5 : 3,
                  background: isActiveDot
                    ? "var(--cn-accent)"
                    : isActiveCross
                      ? "var(--cn-text-secondary)"
                      : "var(--cn-text-muted)",
                  opacity: isActiveDot ? 1 : isActiveCross ? 0.7 : 0.4,
                  boxShadow: isActiveDot ? "0 0 6px var(--cn-accent-ring)" : "none",
                }}
              />
            </button>
          );
        }),
      )}
    </div>
  );
}
