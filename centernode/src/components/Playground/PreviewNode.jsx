
import React, { useRef, useMemo, useEffect } from 'react';
import { Copy, X } from "lucide-react";
import { FRAME_PRESETS } from '@/constants/playground';
import { extractComponentName } from '@/utils/parser';
import { buildNodeTokenStyle } from '@/utils/styles';
import LiveComponent from './LiveComponent';
import MeasureOverlay from './MeasureOverlay';
import ResizeHandles from './ResizeHandles';

// =============================================================
export default function PreviewNode({ node, onUpdate, onDelete, onDuplicate, onSelect, onMeasure, selected, multiSelected = false, registry, measureMode, zoom }) {
  // Group-frame mode: when the node is part of a >1 selection, the parent
  // playground renders a single bounding frame for all of them. Suppress the
  // per-node label / dot / chrome to keep the visual clean.
  const showChrome = selected && !multiSelected;
  const containerRef = useRef(null);

  // Report content rect + its offset within the outer wrapper to the parent.
  // The outer wrapper is anchored at (node.x, node.y) but ALSO contains the
  // floating label row above the component. Without the offset, the group
  // bounding frame would start at node.y (top of label area) yet only span
  // the content's height — leaving phantom padding above the visible badge
  // and clipping out the bottom. Reporting offsetX/Y lets the parent draw a
  // frame that hugs the real rendered component.
  useEffect(() => {
    if (!onMeasure) return;
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const id = node.id;
    const report = () => {
      const outer = el.parentElement;
      if (!outer) return;
      const c = el.getBoundingClientRect();
      const o = outer.getBoundingClientRect();
      const z = typeof zoom === "number" && zoom > 0 ? zoom : 1;
      onMeasure(id, {
        offsetX: (c.left - o.left) / z,
        offsetY: (c.top - o.top) / z,
        width: c.width / z,
        height: c.height / z,
      });
    };
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, [node.id, onMeasure, zoom]);

  const handleMouseDown = (e) => {
    // Drag from label area only (there's no padding space now)
    const isLabelDrag = e.target.closest(".node-drag");
    if (!isLabelDrag) return;

    e.stopPropagation();
    onSelect(node.id, e.shiftKey);
    // Capture starting screen position and current world position
    const startScreenX = e.clientX;
    const startScreenY = e.clientY;
    const startNodeX = node.x;
    const startNodeY = node.y;
    const handleMove = (ev) => {
      // Convert screen delta to world delta via zoom
      const dx = (ev.clientX - startScreenX) / zoom;
      const dy = (ev.clientY - startScreenY) / zoom;
      onUpdate(node.id, { x: startNodeX + dx, y: startNodeY + dy });
    };
    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  const customSize = node.customSize || { width: 400, widthMode: "auto", height: 200, heightMode: "auto" };
  const wVal = typeof customSize.width === "number" ? customSize.width : 400;
  const hVal = typeof customSize.height === "number" ? customSize.height : 200;
  const wMode = customSize.widthMode || "fixed";
  const hMode = customSize.heightMode || "auto";

  const isWidthHug = wMode === "auto";
  const isHeightHug = hMode === "auto";
  const isWidthFill = wMode === "fill";
  const isHeightFill = hMode === "fill";

  const componentName = useMemo(() => extractComponentName(node.code), [node.code]);

  const nodeRegistry = useMemo(() => {
    const reg = {};
    for (const [name, comp] of Object.entries(registry || {})) {
      if (name !== componentName) reg[name] = comp;
    }
    return reg;
  }, [registry, componentName]);
  
  const tokenStyle = useMemo(() => buildNodeTokenStyle(node.tokenOverrides), [node.tokenOverrides]);

  return (
    <div
      className="absolute select-none group"
      style={{ left: node.x, top: node.y }}
      onMouseDown={handleMouseDown}
    >
      {/* Label above — only visible on hover/select. Hidden entirely while
          this node is part of a multi-selection (parent renders group frame). */}
      <div
        className={`node-drag flex items-center justify-between gap-2 mb-1.5 cursor-move transition-opacity ${
          multiSelected ? "opacity-0 pointer-events-none" : showChrome ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        onClick={(e) => { e.stopPropagation(); onSelect(node.id, e.shiftKey); }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${selected ? "bg-blue-500" : "bg-neutral-300"}`} />
          <span className={`text-[11px] font-medium tracking-tight truncate ${selected ? "text-blue-600" : "text-neutral-500"}`}>
            {node.name}
          </span>
          <span className="text-[9px] text-neutral-400 font-mono bg-neutral-100 px-1.5 py-0.5 rounded shrink-0">
            {wMode === "auto" ? "Hug" : `${Math.round(wVal)}`} × {hMode === "auto" ? "Hug" : `${Math.round(hVal)}`}
          </span>
          {node.tokenOverrides && Object.keys(node.tokenOverrides).length > 0 && (
            <span className="text-[9px] text-violet-600 font-medium bg-violet-50 px-1 py-0.5 rounded shrink-0">
              overrides
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={(e) => { e.stopPropagation(); onDuplicate(node.id); }} className="p-1 hover:bg-neutral-200/70 rounded transition-colors" title="Duplicate (D)">
            <Copy className="w-3 h-3 text-neutral-500" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(node.id); }} className="p-1 hover:bg-red-100 rounded transition-colors" title="Delete">
            <X className="w-3 h-3 text-neutral-500" />
          </button>
        </div>
      </div>

      {/* Content wrapper — NO bg, NO padding. Component renders naked.
          Sized by explicit frame OR auto-sized (inline-block shrinks to content). */}
      <div
        className="relative"
        style={{
          display: (isWidthHug && isHeightHug) ? "inline-block" : "block",
          // No minWidth/minHeight in hug mode — selection ring (inset -6) is
          // already wide enough to grab even for tiny components like
          // Checkbox without label. Min would only add empty padding.
          ...(isWidthHug ? null : { width: wVal }),
          ...(isHeightHug ? null : { height: hVal }),
          ...tokenStyle,
        }}
        onClick={(e) => { e.stopPropagation(); onSelect(node.id, e.shiftKey); }}
        ref={containerRef}
      >
        {/* Inner component wrapper — FIXED/FILL mode forces stretch.
            AUTO mode just contains the component at its intrinsic size.
            `node.dark` flag scopes POD `.dark` CSS variables to this node.
            We intentionally DON'T fill the wrapper with bg-canvas: the canvas
            stays light and only the rendered component (button, dropdown,
            etc.) picks up its own dark bg. Transparent variants like Button
            outline will look light on light canvas — accepted trade-off. */}
        <div
          className={`${wMode === "fixed" || isWidthFill ? "pg-stretch-child-w " : ""}${hMode === "fixed" || isHeightFill ? "pg-stretch-child-h " : ""}${node.dark ? "dark" : ""}`}
          style={{
            ...(wMode === "fixed" || isWidthFill ? { width: "100%" } : {}),
            ...(hMode === "fixed" || isHeightFill ? { height: "100%" } : {}),
          }}
        >
          <LiveComponent
            code={node.code}
            componentName={componentName}
            props={node.props}
            registry={nodeRegistry}
          />
        </div>

        {/* Ring overlay — sits just outside component bounds with a small offset.
            Hidden when this node is part of a multi-selection (group frame above
            substitutes). */}
        <div
          className={`absolute rounded-md pointer-events-none transition-all ${
            multiSelected
              ? "ring-0"
              : showChrome
                ? "ring-2 ring-blue-500"
                : "ring-1 ring-transparent group-hover:ring-blue-300"
          }`}
          style={{
            inset: -6,
          }}
        />

        {measureMode && <MeasureOverlay containerRef={containerRef} />}
        {showChrome && (
          <ResizeHandles
            containerRef={containerRef}
            zoom={zoom}
            onResize={(size) => {
              onUpdate(node.id, {
                customSize: {
                  ...customSize,
                  width: size.width,
                  height: size.height ?? hVal,
                },
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
