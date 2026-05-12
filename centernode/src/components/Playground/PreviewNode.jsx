
import React, { useRef, useMemo } from 'react';
import { Copy, X } from "lucide-react";
import { FRAME_PRESETS } from '@/constants/playground';
import { extractComponentName } from '@/utils/parser';
import { buildNodeTokenStyle } from '@/utils/styles';
import LiveComponent from './LiveComponent';
import MeasureOverlay from './MeasureOverlay';
import ResizeHandles from './ResizeHandles';

// =============================================================
export default function PreviewNode({ node, onUpdate, onDelete, onDuplicate, onSelect, selected, registry, measureMode, zoom }) {
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    // Drag from label area only (there's no padding space now)
    const isLabelDrag = e.target.closest(".node-drag");
    if (!isLabelDrag) return;

    e.stopPropagation();
    onSelect(node.id);
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
      {/* Label above — only visible on hover/select */}
      <div
        className={`node-drag flex items-center justify-between gap-2 mb-1.5 cursor-move transition-opacity ${
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
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
          ...(isWidthHug ? { minWidth: 40 } : { width: wVal }),
          ...(isHeightHug ? { minHeight: 24 } : { height: hVal }),
          ...tokenStyle,
        }}
        onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
        ref={containerRef}
      >
        {/* Inner component wrapper — FIXED/FILL mode forces stretch.
            AUTO mode just contains the component at its intrinsic size. */}
        <div
          className={`${wMode === "fixed" || isWidthFill ? "pg-stretch-child-w " : ""}${hMode === "fixed" || isHeightFill ? "pg-stretch-child-h" : ""}`}
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

        {/* Ring overlay — sits just outside component bounds with a small offset */}
        <div
          className={`absolute rounded-md pointer-events-none transition-all ${
            selected
              ? "ring-2 ring-blue-500"
              : "ring-1 ring-transparent group-hover:ring-blue-300"
          }`}
          style={{
            inset: -6,
          }}
        />

        {measureMode && <MeasureOverlay containerRef={containerRef} />}
        {selected && (
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
