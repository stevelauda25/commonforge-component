"use client";
import { useEffect, useRef, useState } from "react";
import { MousePointer2, Hand, Ruler, Layers, Square } from "lucide-react";

// =============================================================
// Bottom status bar — thin (22px) horizontal strip pinned to the bottom
// of the canvas. Shows technical metrics in mono: viewport, zoom, mouse
// world coords, selection summary, current tool. Tap-target buttons
// double as quick toggles for measure mode + zoom.
//
// Visual character: glass surface, mono Geist for all numbers,
// monitoring caret (▌) blinking on the live coord readout so it reads
// like a status display in a flight HUD.
export default function StatusBar({
  zoom,
  pan,
  selectedNode,
  selectionCount,
  editingGroup,
  measureMode,
  spaceHeld,
  canvasRef,
  onZoomChange,
  onToggleMeasure,
}) {
  // Mouse position in world coords — sampled on mousemove from the
  // canvas element. Throttled via RAF so we don't re-render the bar at
  // mouse-event rate (~120fps on modern systems).
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const pendingRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const z = zoom > 0 ? zoom : 1;
      const x = Math.round((e.clientX - rect.left - pan.x) / z);
      const y = Math.round((e.clientY - rect.top - pan.y) / z);
      pendingRef.current = { x, y };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          if (pendingRef.current) setCoords(pendingRef.current);
          rafRef.current = 0;
        });
      }
    };
    canvas.addEventListener("mousemove", onMove);
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef, pan.x, pan.y, zoom]);

  const Tool =
    measureMode ? Ruler :
    spaceHeld   ? Hand :
                  MousePointer2;
  const toolLabel = measureMode ? "MEASURE" : spaceHeld ? "PAN" : "SELECT";
  const toolColor = measureMode ? "text-cn-accent" : "text-cn-text-muted";

  return (
    <div
      className="h-[22px] cn-glass flex items-center justify-between px-3 cn-mono shrink-0 border-t border-cn-border-default cn-anim-fade"
      style={{
        fontSize: "10px",
        animationDuration: "var(--cn-dur-settled)",
      }}
    >
      {/* Left cluster — tool state + coords */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMeasure}
          className={`flex items-center gap-1.5 cn-press transition-colors hover:text-cn-text-primary ${toolColor}`}
          title="Toggle measure mode"
        >
          <Tool className="w-3 h-3" />
          <span className="font-medium tracking-wider">{toolLabel}</span>
        </button>
        <span className="text-cn-border-strong">·</span>
        <span className="text-cn-text-muted flex items-center gap-2">
          <span className="text-cn-text-secondary">x</span>
          <span className="text-cn-text-primary tabular-nums w-10 text-right">{coords.x}</span>
          <span className="text-cn-text-secondary">y</span>
          <span className="text-cn-text-primary tabular-nums w-10 text-right">{coords.y}</span>
        </span>
        {editingGroup && (
          <>
            <span className="text-cn-border-strong">·</span>
            <span className="text-cn-accent flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span className="cn-caret">editing {editingGroup.name}</span>
            </span>
          </>
        )}
      </div>

      {/* Center cluster — selection summary */}
      <div className="flex items-center gap-2 text-cn-text-muted">
        {selectionCount === 0 ? (
          <span>—</span>
        ) : selectionCount === 1 ? (
          <span className="flex items-center gap-1.5">
            <Square className="w-3 h-3" />
            <span className="text-cn-text-primary">{selectedNode?.name ?? "node"}</span>
          </span>
        ) : (
          <span>
            <span className="text-cn-text-primary tabular-nums">{selectionCount}</span> selected
          </span>
        )}
      </div>

      {/* Right cluster — zoom controls (text + ± steppers) */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onZoomChange(Math.max(0.1, zoom - 0.1))}
          className="px-1 hover:text-cn-text-primary transition-colors cn-press"
          title="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => onZoomChange(1)}
          className="px-1.5 hover:text-cn-accent transition-colors cn-press tabular-nums"
          title="Reset zoom (⌘0)"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          onClick={() => onZoomChange(Math.min(4, zoom + 0.1))}
          className="px-1 hover:text-cn-text-primary transition-colors cn-press"
          title="Zoom in"
        >
          +
        </button>
      </div>
    </div>
  );
}
