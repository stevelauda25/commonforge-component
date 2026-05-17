
import React, { useRef, useMemo, useEffect, memo } from 'react';
import { FRAME_PRESETS } from '@/constants/playground';
import { extractComponentName } from '@/utils/parser';
import { buildNodeTokenStyle } from '@/utils/styles';
import LiveComponent from './LiveComponent';
import MeasureOverlay from './MeasureOverlay';
import ResizeHandles from './ResizeHandles';

// =============================================================
function PreviewNode({ node, onUpdate, onDelete, onDuplicate, onSelect, onMeasure, selected, multiSelected = false, registry, measureMode, zoom, inFlex = false, parentDirection = "row" }) {
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
    // Skip drag when the press lands on a resize handle (those have their
    // own logic) or any interactive element inside LiveComponent that
    // wants to handle its own clicks.
    if (e.target.closest("[data-resize-handle]")) return;
    // Skip drag inside controls that should be clickable (links, buttons
    // declared by the rendered component) — but allow drag from the
    // component body itself.
    if (e.target.closest("button, a, input, textarea, select")) return;
    // Only left mouse button.
    if (e.button !== 0) return;

    e.stopPropagation();
    // Pre-move threshold — counts the drag as a "real drag" only after the
    // pointer moves >3px in world coords. Below that it's treated as a
    // plain click (select only, no jitter from a tiny mouse twitch).
    const startScreenX = e.clientX;
    const startScreenY = e.clientY;
    const startNodeX = node.x;
    const startNodeY = node.y;
    let dragging = false;
    // Defer selection until we know it's a click vs. a shift-aware select.
    onSelect(node.id, e.shiftKey);

    const handleMove = (ev) => {
      const dx = (ev.clientX - startScreenX) / zoom;
      const dy = (ev.clientY - startScreenY) / zoom;
      if (!dragging && Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
      dragging = true;
      // requestAnimationFrame keeps drag updates aligned to paint frames,
      // smoothing perceived motion (cheaper than setNodes-per-mousemove).
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

  // When inside an autolayout group, the parent flex container positions
  // this node — we render as a normal (non-absolute) flex child so CSS
  // handles direction + gap. Outside a group we keep the legacy absolute
  // canvas positioning anchored at (node.x, node.y).
  //
  // Sizing inside a flex parent supports three modes per axis:
  //   • auto   — hug content (default)
  //   • fixed  — explicit px (locks the wrapper to wVal / hVal)
  //   • fill   — flex-grow on the main axis OR align-self: stretch on the
  //              cross axis (mirrors Figma autolayout "Fill" semantics)
  let flexOuterStyle = null;
  if (inFlex) {
    flexOuterStyle = {};
    // Width
    if (wMode === "fill") {
      if (parentDirection === "row") {
        flexOuterStyle.flexGrow = 1;
        flexOuterStyle.flexBasis = 0;
        flexOuterStyle.minWidth = 0;
      } else {
        flexOuterStyle.alignSelf = "stretch";
        flexOuterStyle.width = "100%";
      }
    } else if (wMode === "fixed") {
      flexOuterStyle.width = wVal;
      flexOuterStyle.flexShrink = 0;
    }
    // Height
    if (hMode === "fill") {
      if (parentDirection === "column") {
        flexOuterStyle.flexGrow = 1;
        flexOuterStyle.flexBasis = 0;
        flexOuterStyle.minHeight = 0;
      } else {
        flexOuterStyle.alignSelf = "stretch";
        flexOuterStyle.height = "100%";
      }
    } else if (hMode === "fixed") {
      flexOuterStyle.height = hVal;
      flexOuterStyle.flexShrink = 0;
    }
  }

  return (
    <div
      data-node-id={node.id}
      className={`select-none group ${inFlex ? "relative" : "absolute"}`}
      style={
        inFlex
          ? flexOuterStyle
          : { left: node.x, top: node.y }
      }
      onMouseDown={inFlex ? undefined : handleMouseDown}
    >
      {/* Label — absolute-positioned ABOVE the content wrapper so it
          doesn't push the content down and doesn't affect outer
          wrapper's bbox. Position offset, dot size, font size are all
          inverse-scaled by zoom so the gap to the indicator stays a
          constant 8px on screen no matter how zoomed.
          Hidden entirely when canvas zoom < 100% — chrome would be
          visually noisy at low zoom and is rarely useful there. */}
      {!inFlex && zoom >= 1 && (
        <div
          className={`node-drag absolute cursor-move whitespace-nowrap font-medium tracking-tight transition-opacity ${
            multiSelected
              ? "opacity-0 pointer-events-none"
              : showChrome
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
          } ${selected ? "text-cn-selection" : "text-cn-text-muted"}`}
          style={{
            // top = -(text height + 8px gap) places the label's bottom
            // exactly 8px on-screen above the content wrapper. Both
            // values are divided by zoom so they stay constant on
            // screen regardless of canvas zoom. lineHeight 1 keeps the
            // text box exactly font-size tall — no descender leading.
            left: 0,
            top: `-${(11 + 8) / zoom}px`,
            fontSize: `${11 / zoom}px`,
            lineHeight: 1,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {node.name}
        </div>
      )}

      {/* Content wrapper — NO bg, NO padding. Component renders naked.
          Sized by explicit frame OR auto-sized (inline-block shrinks to
          content). When inside a flex parent with width/height in fill or
          fixed mode, the OUTER wrapper handles the sizing (flexGrow or px)
          and the content here fills it via 100% so the badge / dropdown /
          etc. actually stretches to the wrapper's bounds. */}
      <div
        className="relative"
        style={{
          // Block-level FLEX with fit-content for hug — eliminates the
          // baseline descender that `inline-block` would otherwise add
          // above/below the badge (visible as a ghost gap inside the
          // selection ring). Flex shrinks to content cleanly.
          display: "flex",
          ...(isWidthHug && isHeightHug
            ? { width: "fit-content", height: "fit-content" }
            : null),
          ...(isWidthHug
            ? null
            : inFlex
              ? { width: "100%" }
              : { width: wVal }),
          ...(isHeightHug
            ? null
            : inFlex
              ? { height: "100%" }
              : { height: hVal }),
          ...tokenStyle,
        }}
        onClick={(e) => e.stopPropagation()}
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
            // Flex (instead of default block) so the wrapper sizes to the
            // child component's actual rendered box — no line-height padding
            // above/below text-based children like Badge / Tab.
            display: "flex",
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

        {/* Ring overlay — hugs the component bounds (inset 0) so the
            selection visualisation matches the group treatment: the ring
            sits on the actual edge, resize handles sit clearly OUTSIDE it.
            Hidden when this node is part of a multi-selection (group
            frame substitutes). */}
        {/* Stroke width inverse-scaled by zoom so the indicator stays a
            constant ~1px on screen regardless of canvas zoom. Using
            box-shadow (instead of Tailwind ring / border) avoids the
            fixed-size CSS units that would otherwise inflate at zoom>1.
            Hover state piggybacks via the parent's `.group` modifier — a
            second box-shadow appears via CSS variable only on hover. */}
        <div
          className={`absolute pointer-events-none transition-colors ${
            !multiSelected && !showChrome
              ? "group-hover:[--ring-color:rgb(251_191_36_/_0.5)]"
              : ""
          }`}
          style={{
            inset: 0,
            borderRadius: 0,
            // Amber selection ring matches the rest of the chrome — the
            // hover ring is a softer amber tint via CSS variable.
            boxShadow: multiSelected
              ? "none"
              : `0 0 0 ${1 / zoom}px ${
                  showChrome ? "var(--cn-selection)" : "var(--ring-color, transparent)"
                }`,
          }}
        />

        {measureMode && <MeasureOverlay containerRef={containerRef} zoom={zoom} />}
        {showChrome && (
          <ResizeHandles
            containerRef={containerRef}
            zoom={zoom}
            offset={6}
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

// Memo so re-rendering ComponentPlayground (e.g. on drag of a sibling
// node) doesn't reflow every PreviewNode. Default shallow compare is
// sufficient because the parent already passes stable callbacks
// (useCallback) and only swaps `node` references for the node that
// actually changed.
export default memo(PreviewNode);
