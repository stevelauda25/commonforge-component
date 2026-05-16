"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback, createElement, Fragment } from "react";
import {
  Plus, Download, Upload, Trash2, Copy, Code2, X, ZoomIn, ZoomOut, Maximize2,
  Sparkles, ChevronLeft, Check, MousePointer2, Hand, Palette,
  Smartphone, Tablet, Monitor, Frame, SlidersHorizontal, RotateCcw, FileCode, Info,
  Layers, Ruler, Package, Sun, Moon,
  AlignHorizontalDistributeCenter, AlignVerticalDistributeCenter,
  ArrowRight, ArrowDown,
} from "lucide-react";
import { DEFAULT_TOKENS, FRAME_PRESETS, TEMPLATES, DEMO_CODE } from "@/constants/playground";
import { parseSchemaFromCode, extractComponentName, updateCodeWithProp, isJsxSnippet, extractJsxTag, parseJsxSnippetSchema } from "@/utils/parser";
import { tokensToCSS, tokensToTailwind, nodeToJSXFile, downloadFile, groupToCode } from "@/utils/exportHelpers";
import { POD_SCOPE_NAMES, POD_SCOPE_VALUES, transformIfJSX, canvasManifest } from "@/utils/podRuntime";
import { POD_DEFAULT_TOKENS, podTokensToCSS } from "@/utils/podTokens";
import CodeEditor from "./CodeEditor";
import LiveComponent from "./LiveComponent";
import PropInput from "./PropInput";
import PreviewNode from "./PreviewNode";
import MeasureOverlay from "./MeasureOverlay";
import ResizeHandles from "./ResizeHandles";
import ScrubInput from "./ScrubInput";
import TokenEditor from "./TokenEditor";
import SizeInput from "./SizeInput";
import PodLibraryPanel from "./PodLibraryPanel";
import ChangelogPopup from "./ChangelogPopup";

const h = createElement;

/**
 * Per-composite prop visibility — hides props that don't apply for the
 * currently-selected variant. Keyed by the COMPOSITE function name from
 * node.code (e.g. `CheckboxExample`), not the underlying primitive.
 *
 * See CENTERNODE-RULES.md "Conditional prop visibility".
 */
function isPropVisibleForVariant(componentName, propKey, currentProps) {
  if (componentName === "CheckboxExample") {
    const variant = currentProps.variant;
    if (propKey === "description" && variant !== "withDescription") return false;
    if (propKey === "label" && variant === "only") return false;
  }
  return true;
}

// =============================================================
// Inject `:root { --color-* }` overrides for POD design system tokens.
// These override pod-test-tokens/theme.css at runtime, so every POD component
// on the canvas (Button, Checkbox, TextInput…) reflects the change instantly.
export function usePodTokensCSS(tokens) {
  useEffect(() => {
    let styleEl = document.getElementById("playground-pod-tokens");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "playground-pod-tokens";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = podTokensToCSS(tokens);
  }, [tokens]);
}

// =============================================================
export function useGlobalTokensCSS(tokens) {
  useEffect(() => {
    let styleEl = document.getElementById("playground-global-tokens");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "playground-global-tokens";
      document.head.appendChild(styleEl);
    }
    let css = ":root {";
    for (const [category, values] of Object.entries(tokens)) {
      for (const [key, val] of Object.entries(values)) {
        css += `--token-${category}-${key}: ${val};`;
      }
    }
    css += "}";
    // inside stretch to fill that width. Works regardless of whether the user's
    // component code sets width:100% explicitly or not.
    // Using double class (.pg-stretch-child.pg-stretch-child) for specificity boost.
    css += `
      .pg-stretch-child-w.pg-stretch-child-w > * {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      .pg-stretch-child-h.pg-stretch-child-h > * {
        height: 100% !important;
        max-height: 100% !important;
        box-sizing: border-box !important;
      }
      .pg-stretch-child-w.pg-stretch-child-w > button,
      .pg-stretch-child-w.pg-stretch-child-w > input,
      .pg-stretch-child-w.pg-stretch-child-w > textarea,
      .pg-stretch-child-w.pg-stretch-child-w > select,
      .pg-stretch-child-w.pg-stretch-child-w > a {
        display: block !important;
      }
      .is-panning iframe,
      .is-resizing iframe,
      .space-held iframe {
        pointer-events: none !important;
      }
    `;
    styleEl.textContent = css;
  }, [tokens]);
}

// =============================================================
// Centernode theme toggle — flips the `.dark` class on <html>. Default is
// dark (set by layout.tsx); user can switch to light. Choice persists to
// localStorage so reloads keep the picked theme.
function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof document === "undefined") return true;
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("centernode-theme", dark ? "dark" : "light");
    } catch {
      /* private mode / quota — ignore */
    }
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 p-1.5 rounded-md flex items-center justify-center transition-colors"
    >
      {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
    </button>
  );
}

// =============================================================
// Bulk-edit panel — shown in the right inspector when ≥2 nodes are selected.
// Holds the auto-layout / distribute / delete-all / duplicate-all actions
// plus a Gap input that drives the layout calls.
function MultiSelectPanel({
  count,
  selectedNodeIds,
  nodes,
  onPickNode,
  onDuplicateAll,
  onDeleteAll,
  onAutoArrange,
  onDistribute,
}) {
  const [gap, setGap] = useState(12);
  const selected = nodes.filter((n) => selectedNodeIds.has(n.id));

  return (
    <div className="p-6 flex flex-col gap-4 overflow-y-auto">
      <div className="text-center">
        <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
          <Layers className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
        </div>
        <div className="text-xs text-neutral-600 dark:text-neutral-300 font-medium mb-1">
          {count} components selected
        </div>
        <div className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
          Shift-click to add or remove · Esc to clear
        </div>
      </div>

      {/* Auto-layout section */}
      <div className="flex flex-col gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Auto layout
        </div>
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => onAutoArrange("row", gap)}
            className="text-[11px] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors border border-neutral-200 dark:border-neutral-700"
            title="Arrange selection in a horizontal row with the chosen gap"
          >
            <ArrowRight className="w-3 h-3" />
            Row
          </button>
          <button
            onClick={() => onAutoArrange("column", gap)}
            className="text-[11px] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors border border-neutral-200 dark:border-neutral-700"
            title="Stack selection vertically with the chosen gap"
          >
            <ArrowDown className="w-3 h-3" />
            Column
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[11px] text-neutral-500 dark:text-neutral-400 shrink-0">Gap</label>
          <input
            type="number"
            value={gap}
            min={0}
            max={400}
            onChange={(e) => setGap(parseInt(e.target.value, 10) || 0)}
            className="flex-1 text-[11px] px-2 py-1 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-md focus:border-neutral-400 dark:focus:border-neutral-500 outline-none"
          />
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">px</span>
        </div>
        {count >= 3 && (
          <div className="grid grid-cols-2 gap-1 pt-1">
            <button
              onClick={() => onDistribute("row")}
              className="text-[11px] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors border border-neutral-200 dark:border-neutral-700"
              title="Equalize horizontal spacing between selected nodes (keeps first + last)"
            >
              <AlignHorizontalDistributeCenter className="w-3 h-3" />
              Distribute H
            </button>
            <button
              onClick={() => onDistribute("column")}
              className="text-[11px] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors border border-neutral-200 dark:border-neutral-700"
              title="Equalize vertical spacing between selected nodes (keeps first + last)"
            >
              <AlignVerticalDistributeCenter className="w-3 h-3" />
              Distribute V
            </button>
          </div>
        )}
      </div>

      {/* Bulk actions */}
      <div className="grid grid-cols-2 gap-1 pt-2 border-t border-neutral-200 dark:border-neutral-800">
        <button
          onClick={onDuplicateAll}
          className="text-[11px] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors border border-neutral-200 dark:border-neutral-700"
        >
          <Copy className="w-3 h-3" />
          Duplicate all
        </button>
        <button
          onClick={onDeleteAll}
          className="text-[11px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 px-2 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors border border-red-200 dark:border-red-900/50"
        >
          <Trash2 className="w-3 h-3" />
          Delete all
        </button>
      </div>

      {/* Selected list */}
      <div className="text-left pt-2 border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider mb-2">Selected</div>
        <div className="space-y-0.5">
          {selected.map((n) => (
            <button
              key={n.id}
              onClick={() => onPickNode(n.id)}
              className="w-full text-left text-[11px] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 py-1.5 rounded flex items-center gap-2 transition-colors"
            >
              <div className="w-1 h-1 rounded-full bg-blue-500" />
              <span className="font-medium truncate">{n.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================
// Scale-invariant label for selection / edit-mode frames. Uses the same
// positioning math as the single-component label so the visual rhythm is
// identical across all selection chrome:
//   • top = -(fontSize + 8) / zoom — places the label's bottom exactly
//     8px on-screen above the frame's top edge
//   • lineHeight 1 keeps the text box exactly font-size tall (no
//     descender leading inflating the gap)
//   • plain text, no background chip
function ChromeLabel({ zoom = 1, side = "left", tone = "solid", children }) {
  const color = tone === "dashed" ? "rgb(96 165 250)" : "rgb(59 130 246)";
  return (
    <div
      className="absolute font-medium whitespace-nowrap pointer-events-none"
      style={{
        [side]: 0,
        top: `-${(11 + 8) / zoom}px`,
        fontSize: `${11 / zoom}px`,
        lineHeight: 1,
        color,
      }}
    >
      {children}
    </div>
  );
}

// =============================================================
// Group container — renders the autolayout flex frame, drives selection /
// drag / dblclick-enter, and shows resize handles when the group is the
// sole selection. Group width/height default to "hug" (auto-fit content);
// flipping to fixed-size renders explicit width/height + reveals the
// resize handles.
function GroupContainer({
  group,
  isSelected,
  isEditing,
  selectedNodeIds,
  children: groupChildren, // resolved child node objects
  onSelect,
  onUpdate,
  onEnterGroup,
  onChildUpdate,
  onChildDelete,
  onChildDuplicate,
  onChildMeasure,
  registry,
  measureMode,
  zoom,
}) {
  const ref = useRef(null);
  const direction = group.autolayout?.direction || "row";
  const gap = group.autolayout?.gap ?? 0;
  const align = group.autolayout?.align || "start";
  const padding = group.autolayout?.padding ?? 0;
  const alignItems =
    { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch" }[align] ||
    "flex-start";

  // customSize on a group: width/height ∈ ("auto" hug, fixed number).
  const wMode = group.customSize?.widthMode || "auto";
  const hMode = group.customSize?.heightMode || "auto";
  const wVal = typeof group.customSize?.width === "number" ? group.customSize.width : null;
  const hVal = typeof group.customSize?.height === "number" ? group.customSize.height : null;
  const isWidthHug = wMode === "auto";
  const isHeightHug = hMode === "auto";

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    // Skip drag when the press lands on a resize handle — that has its
    // own move logic and would otherwise fight this one.
    if (e.target.closest("[data-resize-handle]")) return;
    // Skip when pressing on a clearly-interactive control inside a child.
    if (e.target.closest("button, a, input, textarea, select")) return;

    // In edit-mode, clicks on a child PreviewNode should select that
    // child individually (Figma-style "drill into the group"). The drag
    // path is reserved for empty area + the group's own bounding chrome.
    const childEl = e.target.closest("[data-node-id]");
    if (isEditing && childEl) {
      e.stopPropagation();
      const childId = childEl.getAttribute("data-node-id");
      onSelect(childId, e.shiftKey);
      return;
    }

    e.stopPropagation();
    onSelect(group.id, e.shiftKey);
    const startX = e.clientX;
    const startY = e.clientY;
    const startGroupX = group.x;
    const startGroupY = group.y;
    let dragging = false;
    const onMove = (ev) => {
      const dx = (ev.clientX - startX) / zoom;
      const dy = (ev.clientY - startY) / zoom;
      if (!dragging && Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
      dragging = true;
      onUpdate(group.id, { x: startGroupX + dx, y: startGroupY + dy });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Show resize handles only on plain single-group selection. Suppress
  // while editing — children take focus then.
  const showResize = isSelected && !isEditing && selectedNodeIds.size === 1;

  return (
    <div
      ref={ref}
      data-group-id={group.id}
      className="absolute select-none"
      style={{
        left: group.x,
        top: group.y,
        display: "flex",
        flexDirection: direction === "row" ? "row" : "column",
        gap: `${gap}px`,
        alignItems,
        padding: padding ? `${padding}px` : undefined,
        // border-box so the resize-handle drag distance equals the visual
        // width/height the user sees (otherwise padding would push the
        // outer box past the dragged size by 2 * padding).
        boxSizing: "border-box",
        ...(isWidthHug ? null : { width: wVal ?? undefined }),
        ...(isHeightHug ? null : { height: hVal ?? undefined }),
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        e.stopPropagation();
        onSelect(group.id, e.shiftKey);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onEnterGroup(group.id);
      }}
    >
      {/* Selection / edit-mode indicators live inside so CSS keeps them
          perfectly aligned with the actual rendered group rect. Strokes
          use 1/zoom widths so the line stays a constant ~1px on screen
          regardless of canvas zoom (Tailwind border-2 would inflate). */}
      {isSelected && (
        <div
          className="pointer-events-none absolute z-10"
          style={{
            inset: 0,
            borderRadius: 0,
            boxShadow: `0 0 0 ${1 / zoom}px rgb(59 130 246)`,
          }}
        >
          <ChromeLabel zoom={zoom} side="left" tone="solid">
            {group.name}
          </ChromeLabel>
        </div>
      )}
      {isEditing && (
        <div
          className="pointer-events-none absolute z-10"
          style={{
            inset: -4,
            borderRadius: 0,
            borderStyle: "dashed",
            borderColor: "rgb(96 165 250 / 0.7)",
            borderWidth: `${1 / zoom}px`,
          }}
        >
          <ChromeLabel zoom={zoom} side="right" tone="dashed">
            editing · Esc to exit
          </ChromeLabel>
        </div>
      )}
      {showResize && (
        <ResizeHandles
          containerRef={ref}
          zoom={zoom}
          offset={6}
          onResize={(size) => {
            // Dragging a handle locks width / height to fixed mode. The
            // user can flip back to Hug via the SizeInput dropdown.
            const patch = { ...(group.customSize || {}) };
            if (typeof size.width === "number") {
              patch.width = size.width;
              patch.widthMode = "fixed";
            }
            if (typeof size.height === "number") {
              patch.height = size.height;
              patch.heightMode = "fixed";
            }
            onUpdate(group.id, { customSize: patch });
          }}
        />
      )}
      {groupChildren.map((child) => {
        const childSelected = selectedNodeIds.has(child.id);
        return (
          <PreviewNode
            key={child.id}
            node={child}
            inFlex
            parentDirection={direction}
            selected={childSelected}
            multiSelected={
              (isSelected && !isEditing) ||
              (childSelected && selectedNodeIds.size > 1)
            }
            onUpdate={onChildUpdate}
            onDelete={onChildDelete}
            onDuplicate={onChildDuplicate}
            onSelect={onSelect}
            onMeasure={onChildMeasure}
            registry={registry}
            measureMode={measureMode}
            zoom={zoom}
          />
        );
      })}
    </div>
  );
}

// =============================================================
// Properties panel for the GroupInspector. Sections are visually grouped
// with subtle backgrounds + consistent row layout — no random horizontal
// dividers between unrelated controls.
function GroupProperties({
  group,
  childCount,
  direction,
  gap,
  align,
  padding,
  allNodes,
  isEditing,
  onRename,
  onUpdateAutolayout,
  onEnter,
  onUngroup,
  onDelete,
  onUpdateSize, // (patch) => void — group-level customSize update
}) {
  const wMode = group.customSize?.widthMode || "auto";
  const hMode = group.customSize?.heightMode || "auto";
  const wVal = typeof group.customSize?.width === "number" ? group.customSize.width : 240;
  const hVal = typeof group.customSize?.height === "number" ? group.customSize.height : 120;
  const children = (group.children || [])
    .map((cid) => allNodes?.find((n) => n.id === cid))
    .filter(Boolean);

  // Shared input-row visual: 8ch label column + flexible input + optional
  // unit/suffix. Lets each row line up perfectly without per-row overrides.
  const Row = ({ label, children: rowChildren, suffix }) => (
    <div className="flex items-center gap-2">
      <label className="text-[11px] text-neutral-500 dark:text-neutral-400 shrink-0 w-12">
        {label}
      </label>
      {rowChildren}
      {suffix && (
        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 w-4 shrink-0">
          {suffix}
        </span>
      )}
    </div>
  );

  const segBtn = (active) =>
    `text-[11px] px-2 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
      active
        ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
        : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800"
    }`;

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto flex-1 min-h-0">
      {/* Header card — icon + name input + child count + editing badge.
          Single visual block instead of disconnected label / input / text. */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900 p-3 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-md bg-blue-500/15 text-blue-500 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Layers className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <input
            value={group.name}
            onChange={(e) => onRename(e.target.value)}
            className="w-full text-[13px] font-semibold bg-transparent text-neutral-900 dark:text-neutral-100 outline-none border-b border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 pb-0.5"
          />
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
              {childCount} child{childCount === 1 ? "" : "ren"}
            </span>
            <span className="text-[9px] text-neutral-400 dark:text-neutral-500">·</span>
            <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
              {direction === "row" ? "→" : "↓"} {direction}
            </span>
            {isEditing && (
              <>
                <span className="text-[9px] text-neutral-400 dark:text-neutral-500">·</span>
                <span className="text-[10px] text-blue-500 dark:text-blue-400 font-medium">
                  editing
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Size card — Hug (default) or Fixed per axis. Dragging the group's
          resize handles on canvas auto-flips the axis to Fixed; the
          dropdown is the manual path back to Hug. */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900 p-3 flex flex-col gap-2.5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
          <Frame className="w-3 h-3" /> Size
        </div>
        <div className="flex gap-1.5">
          <SizeInput
            type="width"
            value={wVal}
            mode={wMode}
            onChange={(next) =>
              onUpdateSize({ width: next.value, widthMode: next.mode })
            }
          />
          <SizeInput
            type="height"
            value={hVal}
            mode={hMode}
            onChange={(next) =>
              onUpdateSize({ height: next.value, heightMode: next.mode })
            }
          />
        </div>
      </div>

      {/* Auto layout card — all flex props in one consistent block. */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900 p-3 flex flex-col gap-2.5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Auto layout
        </div>
        <div className="grid grid-cols-2 gap-1 bg-neutral-200/50 dark:bg-neutral-800/60 p-0.5 rounded-md">
          <button
            type="button"
            onClick={() => onUpdateAutolayout({ direction: "row" })}
            className={segBtn(direction === "row")}
          >
            <ArrowRight className="w-3 h-3" /> Row
          </button>
          <button
            type="button"
            onClick={() => onUpdateAutolayout({ direction: "column" })}
            className={segBtn(direction === "column")}
          >
            <ArrowDown className="w-3 h-3" /> Column
          </button>
        </div>
        <ScrubInput
          label="Gap"
          value={gap}
          min={0}
          max={400}
          onChange={(n) => onUpdateAutolayout({ gap: n })}
          labelWidth={48}
        />
        <ScrubInput
          label="Padding"
          value={padding}
          min={0}
          max={400}
          onChange={(n) => onUpdateAutolayout({ padding: n })}
          labelWidth={48}
        />
        <Row label="Align">
          <div className="grid grid-cols-4 gap-0.5 flex-1 bg-neutral-200/50 dark:bg-neutral-800/60 p-0.5 rounded-md">
            {[
              { id: "start", label: direction === "row" ? "↑" : "←", title: "Start" },
              { id: "center", label: "•", title: "Center" },
              { id: "end", label: direction === "row" ? "↓" : "→", title: "End" },
              { id: "stretch", label: "↔", title: "Stretch" },
            ].map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onUpdateAutolayout({ align: a.id })}
                title={a.title}
                className={`${segBtn(align === a.id)} font-mono`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </Row>
      </div>

      {/* Children list — compact, click to select child (no need to switch
          to Layers tab for a quick jump). Group must already be in edit
          mode for selection to land on the child rather than bubble up;
          when not editing, this is informational only. */}
      {children.length > 0 && (
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            Children
          </div>
          <div className="flex flex-col gap-0.5">
            {children.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2 px-1.5 py-1 rounded text-[11px] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
              >
                <span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                <span className="truncate flex-1">{c.name}</span>
                <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 shrink-0">
                  {c.type === "group" ? "group" : "component"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions — primary (edit + dissolve) and destructive (delete). */}
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={onEnter}
          className="text-[11px] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 transition-colors"
        >
          Enter group
        </button>
        <button
          type="button"
          onClick={onUngroup}
          className="text-[11px] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 transition-colors"
        >
          Ungroup
        </button>
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="text-[11px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 px-2 py-2 rounded-md border border-red-200 dark:border-red-900/50 transition-colors"
      >
        Delete group + children
      </button>
    </div>
  );
}

// =============================================================
// Inspector shown when the selected node is a group (autolayout frame).
// Direction toggle + Gap input are LIVE — typing in Gap immediately reflows
// children via `onUpdateAutolayout({ gap })`. Enter / Ungroup actions on the
// right give the user a quick path into the children or out of the group.
function GroupInspector({
  group,
  childCount,
  onRename,
  onUpdateAutolayout,
  onUpdateSize,
  onEnter,
  onUngroup,
  onDelete,
  isEditing,
  // All canvas nodes — needed to resolve the group's children when
  // generating the code preview live.
  allNodes,
}) {
  const { direction = "row", gap = 12 } = group.autolayout || {};
  // Inspector mode — Properties or Code. Top-level tab, NOT an extra
  // panel hidden below other controls. Code gets the full inspector
  // height so it actually feels like an editor surface.
  const [tab, setTab] = useState("properties");
  const [codeFormat, setCodeFormat] = useState("jsx-inline");
  const [copied, setCopied] = useState(false);
  // Live regen on every render — group inspector re-renders whenever the
  // selected group's autolayout / children / name change.
  const generatedCode = groupToCode(group, allNodes || [], codeFormat);
  const copyCode = async () => {
    try {
      await navigator.clipboard?.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard may be denied — ignore */
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Tab bar — Properties / Code. Tab content fills the rest of the
          inspector column with min-h-0 so the Code tab can use the full
          available height without a manual max-height. */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        {[
          { id: "properties", label: "Properties" },
          { id: "code", label: "Code" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 px-3 py-2.5 text-[11px] font-semibold transition-colors relative ${
              tab === t.id
                ? "text-neutral-900 dark:text-neutral-100"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            }`}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-neutral-900 dark:bg-neutral-100 rounded-t" />
            )}
          </button>
        ))}
      </div>

      {tab === "properties" ? (
        <GroupProperties
          group={group}
          childCount={childCount}
          direction={direction}
          gap={gap}
          align={group.autolayout?.align || "start"}
          padding={group.autolayout?.padding ?? 0}
          allNodes={allNodes}
          isEditing={isEditing}
          onRename={onRename}
          onUpdateAutolayout={onUpdateAutolayout}
          onUpdateSize={onUpdateSize}
          onEnter={onEnter}
          onUngroup={onUngroup}
          onDelete={onDelete}
        />
      ) : (
        // Code tab — segmented format toggle + copy on a flat strip,
        // then the code body fills the rest of the inspector. No drop
        // shadows, no card chrome, no filename pills — just a clean
        // code pane that integrates with the panel.
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
            <div className="inline-flex rounded-md bg-neutral-100 dark:bg-neutral-800 p-0.5">
              {[
                { id: "jsx-inline", label: "JSX" },
                { id: "jsx-tailwind", label: "Tailwind" },
                { id: "html", label: "HTML" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCodeFormat(f.id)}
                  className={`text-[10px] font-medium px-2.5 py-1 rounded transition-colors ${
                    codeFormat === f.id
                      ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={copyCode}
              className="ml-auto text-[10px] font-medium px-2 py-1 rounded text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <CodeEditor value={generatedCode} readOnly theme="dark" />
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================
export default function ComponentPlayground() {
  const [initialized, setInitialized] = useState(false);
  const [nodes, setNodes] = useState([]);
  // Multi-select: Set of node ids. selectedNodeId stays as a derived
  // single-id (only when EXACTLY one is selected) for existing call sites
  // that show props for one node at a time.
  const [selectedNodeIds, setSelectedNodeIds] = useState(() => new Set());
  const [globalTokens, setGlobalTokens] = useState(DEFAULT_TOKENS);
  const [globalPodTokens, setGlobalPodTokens] = useState(POD_DEFAULT_TOKENS);
  const [tokensPanelOpen, setTokensPanelOpen] = useState(false);
  const [tokensTab, setTokensTab] = useState("pod"); // "pod" | "legacy"
  const [inspectorTab, setInspectorTab] = useState("props");
  const [showSyntaxHint, setShowSyntaxHint] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [spaceHeld, setSpaceHeld] = useState(false);
  // Marquee = drag-rectangle selection on empty canvas. World-space coords.
  // null when not actively marquee-selecting.
  const [marquee, setMarquee] = useState(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [measureMode, setMeasureMode] = useState(false);
  const canvasRef = useRef(null);
  const addMenuRef = useRef(null);
  const exportMenuRef = useRef(null);
  const [saveStatus, setSaveStatus] = useState("");

  // Undo/redo history — debounced snapshot of the `nodes` array. Rapid
  // changes (drag-move, scrubbing gap) all share one trailing snapshot
  // because the timeout below resets on every change; only the final
  // resting state survives the 250ms idle window and gets recorded.
  // Stored as JSON strings to deep-decouple from React state.
  const historyRef = useRef([]);
  const historyIdxRef = useRef(-1);
  const skipNextHistoryRef = useRef(false);
  const lastSnapshotRef = useRef("");

  const undo = useCallback(() => {
    if (historyIdxRef.current <= 0) return;
    historyIdxRef.current -= 1;
    const snap = historyRef.current[historyIdxRef.current];
    skipNextHistoryRef.current = true;
    lastSnapshotRef.current = snap;
    setNodes(JSON.parse(snap));
  }, []);

  const redo = useCallback(() => {
    if (historyIdxRef.current >= historyRef.current.length - 1) return;
    historyIdxRef.current += 1;
    const snap = historyRef.current[historyIdxRef.current];
    skipNextHistoryRef.current = true;
    lastSnapshotRef.current = snap;
    setNodes(JSON.parse(snap));
  }, []);

  // Per-node measured render rect (world coords, pre-zoom). PreviewNode
  // reports {offsetX, offsetY, width, height} of the content wrapper relative
  // to the outer wrapper — outer wrapper anchors at (node.x, node.y) but also
  // hosts the floating label row above the component, so the content's
  // visible position is (node.x + offsetX, node.y + offsetY). Without the
  // offset, the group bounding frame draws around the label-padded outer
  // bbox and ghost-floats above the real badge.
  // Ref-backed for synchronous reads by auto-layout / distribute; the tick
  // state triggers re-render so the group frame updates when sizes change.
  const measuredSizesRef = useRef(new Map());
  const [, bumpMeasureTick] = useState(0);
  const onNodeMeasure = useCallback((id, rect) => {
    const cur = measuredSizesRef.current.get(id);
    if (
      cur &&
      cur.offsetX === rect.offsetX &&
      cur.offsetY === rect.offsetY &&
      cur.width === rect.width &&
      cur.height === rect.height
    ) return;
    measuredSizesRef.current.set(id, rect);
    bumpMeasureTick((t) => t + 1);
  }, []);
  // World-space rect of a node's visible content. Anchored at
  // (node.x + offsetX, node.y + offsetY) and sized to the rendered component.
  // Falls back to the outer anchor + customSize when no measurement exists
  // yet (e.g. first frame after spawn).
  const nodeRect = useCallback((n) => {
    const x = n.x ?? 0;
    const y = n.y ?? 0;
    const m = measuredSizesRef.current.get(n.id);
    if (m && m.width > 0 && m.height > 0) {
      const offX = m.offsetX ?? 0;
      const offY = m.offsetY ?? 0;
      return { x: x + offX, y: y + offY, w: m.width, h: m.height };
    }
    const cw = n.customSize?.width;
    const ch = n.customSize?.height;
    return {
      x, y,
      w: typeof cw === "number" ? cw : 0,
      h: typeof ch === "number" ? ch : 0,
    };
  }, []);

  // Group containers are real DOM flex divs — measure each one so the
  // selection frame / marquee can use the group's real rendered bbox.
  // Re-attach observers when the set of group IDs changes; child resizes
  // inside the group also fire the observer because flex parents resize
  // with their content.
  const groupIdsKey = nodes.filter((n) => n.type === "group").map((n) => n.id).join(",");
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const elements = canvas.querySelectorAll("[data-group-id]");
    if (elements.length === 0) return;
    const observers = [];
    const report = (el, id) => {
      const r = el.getBoundingClientRect();
      const z = zoomRef.current > 0 ? zoomRef.current : 1;
      onNodeMeasure(id, {
        offsetX: 0,
        offsetY: 0,
        width: r.width / z,
        height: r.height / z,
      });
    };
    elements.forEach((el) => {
      const id = el.getAttribute("data-group-id");
      if (!id) return;
      report(el, id);
      const ro = new ResizeObserver(() => report(el, id));
      ro.observe(el);
      observers.push(ro);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [groupIdsKey, onNodeMeasure]);
  // Compact w/h accessor for auto-layout cursors — they only need to know
  // how far to advance, not where the content sits within the outer.
  const nodeSize = useCallback((n) => {
    const r = nodeRect(n);
    return { w: r.w, h: r.h };
  }, [nodeRect]);

  // Group-edit mode. When non-null, clicks on a child of that group select
  // the child directly instead of bubbling to the group (Figma "enter group"
  // semantic). Escape exits.
  const [editingGroupId, setEditingGroupId] = useState(null);

  // Mirror nodes into a ref so selection routing (handleSelect) can read the
  // current node tree without re-binding on every keystroke.
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  const editingGroupIdRef = useRef(editingGroupId);
  editingGroupIdRef.current = editingGroupId;

  // Walk up the parent chain to find the topmost selectable target. If we're
  // editing a group, stop at any node whose parent IS that group (so children
  // of the open group are individually selectable). Otherwise resolve all
  // the way up so a click on a child selects the outermost group.
  const resolveSelectionTarget = useCallback((id) => {
    const all = nodesRef.current;
    const editingId = editingGroupIdRef.current;
    let cur = all.find((n) => n.id === id);
    if (!cur) return id;
    while (cur.parent) {
      if (cur.parent === editingId) return cur.id;
      const parent = all.find((n) => n.id === cur.parent);
      if (!parent) return cur.id;
      cur = parent;
    }
    return cur.id;
  }, []);

  // Derived selection helpers. selectedNodeId resolves only when exactly
  // ONE node is selected — so the inspector panel only shows when there's
  // a single unambiguous target. Multi-selection shows a count + bulk actions.
  const selectedNodeId = selectedNodeIds.size === 1 ? [...selectedNodeIds][0] : null;
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const setSelectedNodeId = useCallback((id) => {
    setSelectedNodeIds(id == null ? new Set() : new Set([id]));
  }, []);
  const toggleNodeSelection = useCallback((id) => {
    setSelectedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const handleSelect = useCallback(
    (id, shiftKey) => {
      const target = resolveSelectionTarget(id);
      if (shiftKey) toggleNodeSelection(target);
      else setSelectedNodeId(target);
    },
    [toggleNodeSelection, setSelectedNodeId, resolveSelectionTarget],
  );

  // Double-click on a node (typically a group) → enter group-edit mode.
  // No-op for non-group nodes; clears the current selection so the user can
  // immediately click a child without it being absorbed by the group.
  const enterGroup = useCallback((id) => {
    const node = nodesRef.current.find((n) => n.id === id);
    if (!node || node.type !== "group") return;
    setEditingGroupId(id);
    setSelectedNodeIds(new Set());
  }, []);
  const exitGroupEdit = useCallback(() => setEditingGroupId(null), []);

  // Build component registry — compile each node's code into a callable component
  // We only depend on the id and code of nodes, so dragging/resizing doesn't rebuild the registry
  const nodesCodeSignature = nodes.map(n => n.id + ":" + n.code).join("||");
  const registry = useMemo(() => {
    const reg = {};
    for (const node of nodes) {
      // Group nodes are metadata — they don't have code at all and shouldn't
      // contribute to the registry. Skipping before isJsxSnippet keeps the
      // parser from crashing on `undefined.replace`.
      if (node.type === "group" || typeof node.code !== "string") continue;
      // JSX snippet nodes (POD instances) — they USE a component, don't DEFINE one.
      // Skip — they don't contribute to the registry.
      if (isJsxSnippet(node.code)) continue;
      const name = extractComponentName(node.code);
      if (!name || name === "Component") continue; // skip generic / unnamed
      try {
        const transformed = transformIfJSX(node.code);
        // Skip POD scope params that would clash with a function declared in user code.
        const userNames = new Set(
          Array.from(transformed.matchAll(/function\s+([A-Z]\w*)\s*\(/g)).map((m) => m[1])
        );
        const podNames = [];
        const podValues = [];
        for (let i = 0; i < POD_SCOPE_NAMES.length; i++) {
          if (userNames.has(POD_SCOPE_NAMES[i])) continue;
          podNames.push(POD_SCOPE_NAMES[i]);
          podValues.push(POD_SCOPE_VALUES[i]);
        }
        // eslint-disable-next-line no-new-func
        const factory = new Function(
          "React", "h", "useState", "useEffect", "useRef", "useCallback", "useMemo", "Fragment",
          ...podNames,
          `${transformed}\nreturn typeof ${name} !== "undefined" ? ${name} : null;`
        );
        const Comp = factory(
          { createElement, Fragment },
          h,
          useState, useEffect, useRef, useCallback, useMemo, Fragment,
          ...podValues,
        );
        if (typeof Comp === "function") {
          reg[name] = Comp;
        }
      } catch {
        // Skip nodes that fail to compile — they're being edited
      }
    }
    return reg;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodesCodeSignature]);

  useGlobalTokensCSS(globalTokens);
  usePodTokensCSS(globalPodTokens);

  const updateGlobalPodToken = (category, key, value) => {
    setGlobalPodTokens((prev) => ({
      ...prev,
      [category]: { ...(prev[category] || {}), [key]: value },
    }));
  };
  const resetPodTokens = () => setGlobalPodTokens(POD_DEFAULT_TOKENS);

  useEffect(() => {
    (async () => {
      try {
        const saved = await window.storage?.get("playground:v20");
        if (saved?.value) {
          const data = JSON.parse(saved.value);
          // Sanity: reset any node with broken customSize
          const safeNodes = (data.nodes || [])
            .filter((n) => n.id !== "demo" && n.code !== DEMO_CODE)
            .map((n) => {
            // Group nodes are metadata only — they don't have code / props /
            // customSize and would crash the legacy migration path below.
            // Pass them through unchanged.
            if (n.type === "group") return n;
            let wMode = "fixed";
            let hMode = "auto";
            let wVal = 400;
            let hVal = 200;

            if (n.customSize) {
              wVal = typeof n.customSize.width === "number" ? Math.max(40, n.customSize.width) : wVal;
              wMode = n.customSize.widthMode || n.customSize.mode || "fixed";
              hVal = typeof n.customSize.height === "number" ? Math.max(24, n.customSize.height) : hVal;
              hMode = n.customSize.heightMode || (n.customSize.height === "auto" ? "auto" : "fixed");
            } else if (n.frame && n.frame !== "custom" && n.frame !== "auto") {
              const preset = FRAME_PRESETS[n.frame];
              if (preset && preset.width) {
                wVal = preset.width;
                hVal = preset.height;
                hMode = "fixed";
              }
            } else if (n.frame === "auto") {
              wMode = "auto";
              hMode = "auto";
            }
            
            // Re-parse schema so new parser logic applies to old nodes
            const reParsedSchema = isJsxSnippet(n.code)
              ? parseJsxSnippetSchema(n.code, canvasManifest.components.find((c) => c.name === extractJsxTag(n.code)))
              : parseSchemaFromCode(n.code);
            const mergedProps = { ...n.props };
            for (const [k, v] of Object.entries(reParsedSchema)) {
              if (!(k in mergedProps)) mergedProps[k] = v.default;
            }
            
            return {
              ...n,
              frame: undefined,
              schema: reParsedSchema,
              props: mergedProps,
              customSize: { width: wVal, widthMode: wMode, height: hVal, heightMode: hMode }
            };
          });
          setNodes(safeNodes);
          if (data.globalTokens) setGlobalTokens(data.globalTokens);
          setInitialized(true);
          return;
        }
      } catch {}
      // Empty canvas by default — user picks from POD Library or "Add component".
      // No auto-spawn (DEMO_CODE removed; its `function Button` shadowed POD scope).
      setNodes([]);
      setInitialized(true);
    })();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const t = setTimeout(async () => {
      try {
        await window.storage?.set("playground:v20", JSON.stringify({ nodes, globalTokens }));
        if (nodes.length > 0) {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus(""), 1500);
        }
      } catch {}
    }, 800);
    return () => clearTimeout(t);
  }, [nodes, globalTokens, initialized]);

  const addNode = (templateKey = "blank") => {
    const template = TEMPLATES[templateKey] || TEMPLATES.blank;
    const id = `n${Date.now()}`;
    const cx = (-pan.x + (canvasRef.current?.clientWidth || 800) / 2) / zoom;
    const cy = (-pan.y + (canvasRef.current?.clientHeight || 600) / 2) / zoom;
    const schema = parseSchemaFromCode(template.code);
    const props = {};
    for (const [k, v] of Object.entries(schema)) props[k] = v.default;
    const newNode = {
      id,
      name: `${template.name.toLowerCase()}-${nodes.length + 1}`,
      code: template.code,
      schema,
      props,
      customSize: template.defaultSize || { width: 400, widthMode: "auto", height: 200, heightMode: "auto" },
      tokenOverrides: {},
      x: cx - 80, y: cy - 60,
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeId(id);
  };

  // Spawn a node from a POD canvasManifest pick (variant × size cell or example).
  // Emits a single-line JSX snippet — LiveComponent transpiles via sucrase at render.
  // `dark` (bool) is locked at spawn-time: comes from sidebar's preview mode.
  // Toggling sidebar later does NOT mutate already-placed nodes.
  const addPodNode = ({ componentName, code, dark = false }) => {
    const id = `n${Date.now()}`;
    const cx = (-pan.x + (canvasRef.current?.clientWidth || 800) / 2) / zoom;
    const cy = (-pan.y + (canvasRef.current?.clientHeight || 600) / 2) / zoom;
    const manifestEntry = canvasManifest.components.find((c) => c.name === componentName);
    // Some POD examples ship a composite `function Foo({prop = "..."}) { ... }` snippet
    // (e.g. Dropdown's interactive composite). For those, use parseSchemaFromCode which
    // extracts destructured function params. For plain `<Component .../>` snippets,
    // parseJsxSnippetSchema reads attrs + augments enums via manifest.
    const schema = isJsxSnippet(code)
      ? parseJsxSnippetSchema(code, manifestEntry)
      : parseSchemaFromCode(code);
    const props = {};
    for (const [k, v] of Object.entries(schema)) props[k] = v.default;
    const newNode = {
      id,
      name: `${componentName.toLowerCase()}-${nodes.length + 1}`,
      code,
      schema,
      props,
      customSize: { width: 240, widthMode: "auto", height: 80, heightMode: "auto" },
      tokenOverrides: {},
      dark, // per-node theme override (POD .dark scope on wrapper)
      x: cx - 80,
      y: cy - 40,
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeId(id);
  };

  // Stable callbacks so memo'd PreviewNode / GroupContainer don't re-render
  // on every parent update. setNodes is already a stable React setter, so
  // empty deps are safe here.
  const updateNode = useCallback((id, updates) => {
    setNodes((p) => p.map((n) => n.id === id ? { ...n, ...updates } : n));
  }, []);
  const updateNodeProp = (id, k, v) => setNodes((p) => p.map((n) => {
    if (n.id === id) {
      const newCode = updateCodeWithProp(n.code, k, v);
      return { ...n, code: newCode, props: { ...n.props, [k]: v } };
    }
    return n;
  }));
  const updateNodeCode = (id, newCode) => {
    const newSchema = isJsxSnippet(newCode)
      ? parseJsxSnippetSchema(newCode, canvasManifest.components.find((c) => c.name === extractJsxTag(newCode)))
      : parseSchemaFromCode(newCode);
    setNodes((p) => p.map((n) => {
      if (n.id !== id) return n;
      const newProps = { ...n.props };
      for (const [k, v] of Object.entries(newSchema)) if (!(k in newProps)) newProps[k] = v.default;
      for (const k of Object.keys(newProps)) if (!(k in newSchema)) delete newProps[k];
      return { ...n, code: newCode, schema: newSchema, props: newProps };
    }));
  };
  const updateNodeTokenOverride = (id, category, key, value) => {
    setNodes((p) => p.map((n) => {
      if (n.id !== id) return n;
      const overrides = { ...(n.tokenOverrides || {}) };
      if (!overrides[category]) overrides[category] = {};
      if (value === undefined) {
        delete overrides[category][key];
        if (Object.keys(overrides[category]).length === 0) delete overrides[category];
      } else {
        overrides[category] = { ...overrides[category], [key]: value };
      }
      return { ...n, tokenOverrides: overrides };
    }));
  };
  const deleteNode = useCallback((id) => {
    setNodes((p) => {
      const target = p.find((n) => n.id === id);
      if (!target) return p;
      // Deleting a group cascades to its children — keeps the model
      // consistent (no orphan children pointing at a deleted parent).
      const idsToRemove = new Set([id]);
      if (target.type === "group" && Array.isArray(target.children)) {
        for (const cid of target.children) idsToRemove.add(cid);
      }
      return p.filter((n) => !idsToRemove.has(n.id));
    });
    setSelectedNodeIds((prev) => (prev.has(id) ? new Set([...prev].filter((x) => x !== id)) : prev));
    setEditingGroupId((cur) => (cur === id ? null : cur));
  }, []);
  const duplicateNode = useCallback((id) => {
    setNodes((prev) => {
      const node = prev.find((n) => n.id === id);
      if (!node) return prev;
      const newId = `n${Date.now()}`;
      return [...prev, { ...node, id: newId, name: `${node.name}-copy`, x: (node.x ?? 0) + 40, y: (node.y ?? 0) + 40 }];
    });
  }, []);

  // Create a Group node from the current multi-selection. Children become
  // flex children of the group via CSS — no imperative position math; the
  // browser handles direction + gap natively.
  //
  // Compute the group + new id SYNCHRONOUSLY from the current closure so
  // the two state updates (setNodes + setSelectedNodeIds) batch with a
  // known id. Putting the id assignment inside the setNodes callback used
  // to race the read in `if (newGroupId)` — React's batched updater may
  // run the callback later, leaving `newGroupId` null and the new group
  // unselected. Symptom: multi-select frame stays on the stale children
  // (now x/y = 0,0) and draws at canvas origin.
  const createGroupFromSelection = useCallback((direction = "row", gap = 12) => {
    if (selectedNodeIds.size < 2) return;
    // Only group top-level nodes — already-grouped nodes skip to keep the
    // model single-level for now.
    const selected = nodes.filter(
      (n) => selectedNodeIds.has(n.id) && !n.parent,
    );
    if (selected.length < 2) return;
    // Preserve source-order intent by sorting along the dominant axis.
    const sorted = [...selected].sort((a, b) =>
      direction === "row" ? (a.x ?? 0) - (b.x ?? 0) : (a.y ?? 0) - (b.y ?? 0),
    );
    const anchorX = Math.min(...sorted.map((n) => n.x ?? 0));
    const anchorY = Math.min(...sorted.map((n) => n.y ?? 0));
    const id = `g${Date.now()}`;
    const childIds = new Set(sorted.map((n) => n.id));
    // Auto-numbered short name — direction-aware so the user can tell
    // at a glance, but compact enough for the layer panel and the
    // selection-frame label. Counts existing groups of the same
    // direction so duplicates don't all read "Row 1".
    const sameDirCount = nodes.filter(
      (n) => n.type === "group" && (n.autolayout?.direction || "row") === direction,
    ).length;
    const baseName = direction === "row" ? "Row" : "Column";
    const name = `${baseName} ${sameDirCount + 1}`;
    const group = {
      id,
      name,
      type: "group",
      parent: null,
      x: anchorX,
      y: anchorY,
      children: sorted.map((n) => n.id),
      autolayout: { direction, gap, align: "start", padding: 0 },
    };
    setNodes((prev) => {
      // Children inside a flex parent don't use their own x/y — clear them
      // so a future "ungroup" doesn't restore stale coords. The parent ref
      // is the contract that says "I'm laid out by my parent".
      const updated = prev.map((n) =>
        childIds.has(n.id) ? { ...n, parent: id, x: 0, y: 0 } : n,
      );
      return [...updated, group];
    });
    setSelectedNodeIds(new Set([id]));
  }, [nodes, selectedNodeIds]);

  // Update a group's autolayout config — pure state write. CSS picks up
  // the new flexDirection / gap and reflows children synchronously on the
  // next paint. No measurement, no cursor math, no stale positions.
  const updateGroupAutolayout = useCallback((groupId, partial) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === groupId && n.type === "group"
          ? { ...n, autolayout: { ...n.autolayout, ...partial } }
          : n,
      ),
    );
  }, []);

  // Dissolve a group — children become top-level absolute nodes again.
  // We approximate world positions by snapshotting the rendered DOM rect of
  // each child (since flex layout was driving them) before removing the
  // group, then converting screen px back to world coords via the current
  // zoom + canvas origin.
  const ungroup = useCallback((groupId) => {
    setNodes((prev) => {
      const group = prev.find((n) => n.id === groupId && n.type === "group");
      if (!group) return prev;
      const childIds = new Set(group.children || []);
      // Snapshot each child's current screen rect, then translate to world.
      const positions = new Map();
      const canvas = canvasRef.current;
      const canvasRect = canvas?.getBoundingClientRect();
      const z = zoom > 0 ? zoom : 1;
      for (const cid of childIds) {
        const el = canvas?.querySelector(`[data-node-id="${cid}"]`);
        if (!el || !canvasRect) continue;
        const r = el.getBoundingClientRect();
        positions.set(cid, {
          x: (r.left - canvasRect.left) / z - pan.x / z,
          y: (r.top - canvasRect.top) / z - pan.y / z,
        });
      }
      return prev
        .filter((n) => n.id !== groupId)
        .map((n) => {
          if (!childIds.has(n.id)) return n;
          const p = positions.get(n.id);
          return { ...n, parent: null, x: p?.x ?? group.x, y: p?.y ?? group.y };
        });
    });
    setEditingGroupId((cur) => (cur === groupId ? null : cur));
  }, [pan.x, pan.y, zoom]);

  // Back-compat shim — the multi-select panel still calls `onAutoArrange`,
  // which now creates a real group instead of one-shot rearranging.
  const autoArrangeSelected = createGroupFromSelection;

  // Distribute spacing — equalize gaps between selected nodes along their
  // dominant axis. Keeps first + last in place, redistributes middle. Useful
  // when nodes are roughly arranged but spacing is uneven.
  const distributeSelected = useCallback((direction = "row") => {
    if (selectedNodeIds.size < 3) return; // need ≥3 for "distribute" to mean anything
    setNodes((prev) => {
      const selected = prev.filter((n) => selectedNodeIds.has(n.id));
      const sorted = [...selected].sort((a, b) =>
        direction === "row" ? (a.x ?? 0) - (b.x ?? 0) : (a.y ?? 0) - (b.y ?? 0)
      );
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      const firstSize = nodeSize(first);
      const startEdge = direction === "row" ? (first.x ?? 0) + firstSize.w : (first.y ?? 0) + firstSize.h;
      const endEdge = direction === "row" ? (last.x ?? 0) : (last.y ?? 0);
      const totalMidWidth = sorted
        .slice(1, -1)
        .reduce((s, n) => s + (direction === "row" ? nodeSize(n).w : nodeSize(n).h), 0);
      const gap = (endEdge - startEdge - totalMidWidth) / (sorted.length - 1);
      let cursor = startEdge + gap;
      const newPos = new Map();
      for (let i = 1; i < sorted.length - 1; i++) {
        const n = sorted[i];
        const size = nodeSize(n);
        if (direction === "row") {
          newPos.set(n.id, { x: cursor, y: n.y ?? 0 });
          cursor += size.w + gap;
        } else {
          newPos.set(n.id, { x: n.x ?? 0, y: cursor });
          cursor += size.h + gap;
        }
      }
      return prev.map((n) => (newPos.has(n.id) ? { ...n, ...newPos.get(n.id) } : n));
    });
  }, [selectedNodeIds, nodeSize]);

  // Close add menu on click outside
  useEffect(() => {
    if (!addMenuOpen) return;
    const handler = (e) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target)) {
        setAddMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [addMenuOpen]);

  // Close export menu on click outside
  useEffect(() => {
    if (!exportMenuOpen) return;
    const handler = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [exportMenuOpen]);

  // Debounced history snapshotter — runs 250ms after the last `nodes`
  // change. During a drag / scrub, the effect re-runs on every update and
  // the timer keeps resetting; only the final at-rest state lands in the
  // history stack.
  useEffect(() => {
    if (skipNextHistoryRef.current) {
      skipNextHistoryRef.current = false;
      return;
    }
    const t = setTimeout(() => {
      const snap = JSON.stringify(nodes);
      if (snap === lastSnapshotRef.current) return;
      lastSnapshotRef.current = snap;
      // Drop any forward history after the current index — making a new
      // change after undo invalidates the redo branch (standard UX).
      historyRef.current = historyRef.current.slice(0, historyIdxRef.current + 1);
      historyRef.current.push(snap);
      historyIdxRef.current = historyRef.current.length - 1;
      if (historyRef.current.length > 50) {
        historyRef.current.shift();
        historyIdxRef.current -= 1;
      }
    }, 250);
    return () => clearTimeout(t);
  }, [nodes]);

  useEffect(() => {
    const down = (e) => {
      const isInput = e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA";
      // Undo / Redo — Cmd/Ctrl+Z and Cmd/Ctrl+Shift+Z. Skip when an input
      // has focus so the browser's native field-level undo still works
      // (e.g. correcting a typo in the Gap field).
      if (!isInput && (e.metaKey || e.ctrlKey) && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      // Cmd+Y as an alternative redo (Windows-style).
      if (!isInput && (e.metaKey || e.ctrlKey) && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        redo();
        return;
      }
      if (e.code === "Space" && !spaceHeld && !isInput) {
        e.preventDefault();
        setSpaceHeld(true);
        document.body.classList.add("space-held");
      }
      if (e.key === "d" && selectedNodeIds.size > 0 && !isInput) {
        [...selectedNodeIds].forEach((id) => duplicateNode(id));
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedNodeIds.size > 0 && !isInput) {
        [...selectedNodeIds].forEach((id) => deleteNode(id));
      }
      if (e.key === "Escape") {
        // Escape priority: close add menu → exit group-edit → clear selection.
        // Mirrors Figma's nested-modality feel.
        if (addMenuOpen) {
          setAddMenuOpen(false);
        } else if (editingGroupId) {
          setEditingGroupId(null);
        } else {
          setSelectedNodeIds(new Set());
        }
      }
      if (e.key === "0" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setZoom(1); setPan({ x: 0, y: 0 });
      }
    };
    const up = (e) => {
      if (e.code === "Space") {
        setSpaceHeld(false);
        document.body.classList.remove("space-held");
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [spaceHeld, selectedNodeIds, nodes, duplicateNode, deleteNode, editingGroupId, addMenuOpen, undo, redo]);

  const handleCanvasMouseDown = (e) => {
    const isCanvasBg = e.target === canvasRef.current || e.target.classList?.contains("canvas-bg");
    if (!isCanvasBg) return;

    // Pan: spacebar held OR middle-click. Everything else on canvas-bg
    // starts a marquee selection.
    const isPan = spaceHeld || e.button === 1;

    if (isPan) {
      const startX = e.clientX - pan.x;
      const startY = e.clientY - pan.y;
      document.body.classList.add("is-panning");
      const handleMove = (ev) => setPan({ x: ev.clientX - startX, y: ev.clientY - startY });
      const handleUp = () => {
        document.body.classList.remove("is-panning");
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      return;
    }

    // Marquee selection. Translate screen → world coords using current
    // pan + zoom, drag a rectangle, then intersect with each node's bbox
    // on mouseup. Shift-held preserves prior selection (additive).
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const startWorldX = (e.clientX - rect.left - pan.x) / zoom;
    const startWorldY = (e.clientY - rect.top - pan.y) / zoom;
    const shiftAtStart = e.shiftKey;
    const baseSelection = shiftAtStart ? new Set(selectedNodeIds) : new Set();

    setMarquee({ x1: startWorldX, y1: startWorldY, x2: startWorldX, y2: startWorldY });
    if (!shiftAtStart && selectedNodeIds.size > 0) setSelectedNodeIds(new Set());

    const handleMove = (ev) => {
      const curWorldX = (ev.clientX - rect.left - pan.x) / zoom;
      const curWorldY = (ev.clientY - rect.top - pan.y) / zoom;
      setMarquee({ x1: startWorldX, y1: startWorldY, x2: curWorldX, y2: curWorldY });
    };
    const handleUp = (ev) => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      const endWorldX = (ev.clientX - rect.left - pan.x) / zoom;
      const endWorldY = (ev.clientY - rect.top - pan.y) / zoom;
      const xMin = Math.min(startWorldX, endWorldX);
      const xMax = Math.max(startWorldX, endWorldX);
      const yMin = Math.min(startWorldY, endWorldY);
      const yMax = Math.max(startWorldY, endWorldY);
      // Tiny drag (< 4 world units) = treated as plain click, clears selection.
      const dragged = Math.abs(endWorldX - startWorldX) > 4 || Math.abs(endWorldY - startWorldY) > 4;
      if (dragged) {
        const hit = new Set(baseSelection);
        // Marquee hit-tests TOP-LEVEL nodes only (groups + ungrouped). For
        // groups we use their measured DOM rect; for children inside a
        // group, the group is the addressable target. The user can enter a
        // group first to address children individually.
        for (const n of nodes) {
          if (n.parent) continue;
          const r = nodeRect(n);
          if (r.w <= 0 || r.h <= 0) continue;
          const overlaps = r.x < xMax && r.x + r.w > xMin && r.y < yMax && r.y + r.h > yMin;
          if (overlaps) hit.add(n.id);
        }
        setSelectedNodeIds(hit);
      }
      setMarquee(null);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  // Latest zoom/pan held in refs so the wheel listener can read fresh values
  // without re-subscribing on every change. Re-subscribing during a rapid
  // pinch leaves micro-gaps where the listener doesn't exist → browser zoom
  // leaks through and the whole UI scales.
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { panRef.current = pan; }, [pan]);

  useEffect(() => {
    // Figma-style wheel handling — ONE listener on window, attached once.
    // ctrl/meta wheel always preventDefaults (blocks browser zoom completely).
    // Canvas zoom/pan only fires when the cursor is inside the canvas rect;
    // wheel over the sidebar / top bar leaves React state alone.
    const onWheel = (e) => {
      const isZoomGesture = e.ctrlKey || e.metaKey;
      const rect = canvasRef.current?.getBoundingClientRect();
      const overCanvas =
        !!rect &&
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top  && e.clientY <= rect.bottom;

      // Always block browser zoom on pinch / ⌘+wheel, even when the cursor
      // is outside the canvas. Centernode never wants the UI shell to scale.
      if (isZoomGesture) e.preventDefault();

      if (!overCanvas) return;

      // Inside canvas → also block native scroll, then drive zoom/pan.
      e.preventDefault();
      const z = zoomRef.current;
      const p = panRef.current;
      if (isZoomGesture) {
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const worldX = (cx - p.x) / z;
        const worldY = (cy - p.y) / z;
        const newZoom = Math.max(0.1, Math.min(4, z * (1 + -e.deltaY * 0.01)));
        setZoom(newZoom);
        setPan({ x: cx - worldX * newZoom, y: cy - worldY * newZoom });
      } else {
        setPan((prev) => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
      }
    };

    // Wheel events forwarded from preview iframes — synthesize a minimal
    // event shape so the same handler can drive canvas zoom/pan.
    const onMessage = (msg) => {
      if (!msg.data || msg.data.type !== "canvas-wheel") return;
      onWheel({
        preventDefault: () => {},
        clientX: msg.data.clientX,
        clientY: msg.data.clientY,
        deltaX: msg.data.deltaX,
        deltaY: msg.data.deltaY,
        ctrlKey: msg.data.ctrlKey,
        metaKey: msg.data.metaKey,
      });
    };

    // Safari/iPad pinch arrives as gesture events instead of ctrl-wheel.
    const blockGesture = (e) => e.preventDefault();

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("message", onMessage);
    document.addEventListener("gesturestart", blockGesture);
    document.addEventListener("gesturechange", blockGesture);
    document.addEventListener("gestureend", blockGesture);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("message", onMessage);
      document.removeEventListener("gesturestart", blockGesture);
      document.removeEventListener("gesturechange", blockGesture);
      document.removeEventListener("gestureend", blockGesture);
    };
  }, []);

  const handleExport = () => {
    const data = { nodes, globalTokens };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "playground.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.nodes) setNodes(data.nodes);
        if (data.globalTokens) setGlobalTokens(data.globalTokens);
      } catch { alert("Invalid file"); }
    };
    reader.readAsText(file);
  };

  const updateGlobalToken = (category, key, value) => {
    setGlobalTokens((prev) => ({ ...prev, [category]: { ...prev[category], [key]: value } }));
  };

  if (!initialized) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-5 h-5 border-2 border-neutral-200 border-t-neutral-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 overflow-hidden" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* TOP BAR */}
      <header className="h-12 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between px-4 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-[5px] bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white dark:text-neutral-900" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Playground</span>
          </div>
          <span className="text-neutral-300 dark:text-neutral-700">/</span>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500">{nodes.length} component{nodes.length !== 1 ? "s" : ""}</span>
          {saveStatus && (
            <span className="text-[10px] text-green-600 font-medium ml-1 flex items-center gap-1">
              <Check className="w-2.5 h-2.5" /> saved
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-800 mx-1" />
          <button
            onClick={() => setShowSyntaxHint(!showSyntaxHint)}
            className="text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            Syntax
          </button>
          <button
            onClick={() => setChangelogOpen(true)}
            className="text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
            title="What's new in centernode"
          >
            <Sparkles className="w-3.5 h-3.5" />
            What's new
          </button>
          <button
            onClick={() => setTokensPanelOpen(!tokensPanelOpen)}
            className={`text-xs px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              tokensPanelOpen
                ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Tokens
          </button>
          <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-800 mx-1" />
          <label className="text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2.5 py-1.5 rounded-md cursor-pointer flex items-center gap-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Import
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <div ref={exportMenuRef} className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className={`text-xs text-neutral-600 hover:bg-neutral-100 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                exportMenuOpen ? "bg-neutral-100" : ""
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            {exportMenuOpen && (
              <div className="absolute top-full mt-1 right-0 w-[280px] bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden z-50">
                <div className="px-3 py-2 border-b border-neutral-100 bg-neutral-50/50">
                  <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Handoff</div>
                </div>
                <div className="p-1.5">
                  {selectedNode && (
                    <button
                      onClick={() => {
                        downloadFile(
                          `${selectedNode.name}.jsx`,
                          nodeToJSXFile(selectedNode),
                          "text/javascript"
                        );
                        setExportMenuOpen(false);
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                        <FileCode className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-neutral-900">Selected as JSX</div>
                        <div className="text-[10px] text-neutral-500 leading-snug mt-0.5">
                          {selectedNode.name}.jsx — paste-ready React
                        </div>
                      </div>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const all = nodes.map((n) => `// ${n.name}\n${nodeToJSXFile(n)}`).join("\n\n// ==========\n\n");
                      downloadFile("components.jsx", all, "text/javascript");
                      setExportMenuOpen(false);
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-neutral-900">All components as JSX</div>
                      <div className="text-[10px] text-neutral-500 leading-snug mt-0.5">
                        components.jsx — all {nodes.length} components in one file
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      downloadFile("tokens.css", tokensToCSS(globalTokens), "text/css");
                      setExportMenuOpen(false);
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-md bg-violet-50 flex items-center justify-center shrink-0">
                      <Palette className="w-3.5 h-3.5 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-neutral-900">Tokens as CSS</div>
                      <div className="text-[10px] text-neutral-500 leading-snug mt-0.5">
                        tokens.css — import into your stylesheet
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      downloadFile("tailwind.tokens.js", tokensToTailwind(globalTokens), "text/javascript");
                      setExportMenuOpen(false);
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-md bg-violet-50 flex items-center justify-center shrink-0">
                      <Palette className="w-3.5 h-3.5 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-neutral-900">Tokens as Tailwind</div>
                      <div className="text-[10px] text-neutral-500 leading-snug mt-0.5">
                        tailwind.tokens.js — merge into config
                      </div>
                    </div>
                  </button>
                </div>
                <div className="px-3 py-2 border-t border-neutral-100 bg-neutral-50/50">
                  <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Project</div>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => {
                      const data = { nodes, globalTokens };
                      downloadFile("playground.json", JSON.stringify(data, null, 2), "application/json");
                      setExportMenuOpen(false);
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-md bg-neutral-100 flex items-center justify-center shrink-0">
                      <Download className="w-3.5 h-3.5 text-neutral-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-neutral-900">Backup as JSON</div>
                      <div className="text-[10px] text-neutral-500 leading-snug mt-0.5">
                        Re-import later to restore state
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <PodLibraryPanel
          manifest={canvasManifest}
          onAddPodNode={addPodNode}
          nodes={nodes}
          selectedNodeIds={selectedNodeIds}
          editingGroupId={editingGroupId}
          onSelectNode={handleSelect}
          onEnterGroup={enterGroup}
        />
        {tokensPanelOpen && (
          <div className="w-[300px] border-r border-neutral-200 bg-white flex flex-col shrink-0 z-20">
            <div className="h-9 px-3 flex items-center gap-2 border-b border-neutral-200 bg-neutral-50/50">
              <Palette className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider">Global Tokens</span>
              <button onClick={() => setTokensPanelOpen(false)} className="ml-auto p-1 hover:bg-neutral-200 rounded transition-colors">
                <ChevronLeft className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            </div>
            <div className="flex border-b border-neutral-200 bg-neutral-50/50">
              <button
                onClick={() => setTokensTab("pod")}
                className={`flex-1 px-3 py-2 text-[11px] font-semibold transition-colors ${
                  tokensTab === "pod"
                    ? "text-neutral-900 border-b-2 border-neutral-900 -mb-px"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                POD Design System
              </button>
              <button
                onClick={() => setTokensTab("legacy")}
                className={`flex-1 px-3 py-2 text-[11px] font-semibold transition-colors ${
                  tokensTab === "legacy"
                    ? "text-neutral-900 border-b-2 border-neutral-900 -mb-px"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Component
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {tokensTab === "pod" ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-neutral-500">Live override of pod-test-tokens</span>
                    <button
                      onClick={resetPodTokens}
                      className="text-[10px] text-neutral-500 hover:text-neutral-900 underline"
                    >
                      Reset all
                    </button>
                  </div>
                  <TokenEditor tokens={globalPodTokens} onChange={updateGlobalPodToken} />
                  <div className="text-[10px] text-neutral-400 leading-relaxed pt-4 mt-4 border-t border-neutral-200">
                    In code: <span className="font-mono text-neutral-600">var(--color-accent-default)</span>
                  </div>
                </>
              ) : (
                <>
                  <TokenEditor tokens={globalTokens} onChange={updateGlobalToken} />
                  <div className="text-[10px] text-neutral-400 leading-relaxed pt-4 mt-4 border-t border-neutral-200">
                    In code: <span className="font-mono text-neutral-600">var(--token-colors-brand)</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div
          ref={canvasRef}
          className={`canvas-bg flex-1 relative overflow-hidden ${spaceHeld ? "cursor-grab active:cursor-grabbing" : ""}`}
          style={{
            // backgroundImage lives in globals.css (.canvas-bg) so it swaps
            // automatically with the .dark class. Only the size + position
            // are dynamic and need inline style.
            backgroundSize: `24px 24px`,
            backgroundPosition: `${pan.x % 24}px ${pan.y % 24}px`,
          }}
          onMouseDown={handleCanvasMouseDown}
        >
          {/* Outer layer: pan (screen-space translate) */}
          <div
            className="absolute top-0 left-0"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: "0 0",
              willChange: "transform",
            }}
          >
            {/* Inner layer: zoom (re-renders DOM at new size, keeps text crisp) */}
            <div
              style={{
                zoom: zoom,
              }}
            >
            {/* Top-level nodes only — children of groups render INSIDE the
                group's flex container below, not at canvas root. */}
            {nodes.filter((n) => !n.parent).map((node) => {
              if (node.type === "group") {
                const isSelected = selectedNodeIds.has(node.id);
                const isEditing = editingGroupId === node.id;
                const groupChildren = (node.children || [])
                  .map((cid) => nodes.find((n) => n.id === cid))
                  .filter(Boolean);
                return (
                  <GroupContainer
                    key={node.id}
                    group={node}
                    isSelected={isSelected}
                    isEditing={isEditing}
                    selectedNodeIds={selectedNodeIds}
                    children={groupChildren}
                    onSelect={handleSelect}
                    onUpdate={updateNode}
                    onEnterGroup={enterGroup}
                    onChildUpdate={updateNode}
                    onChildDelete={deleteNode}
                    onChildDuplicate={duplicateNode}
                    onChildMeasure={onNodeMeasure}
                    registry={registry}
                    measureMode={measureMode}
                    zoom={zoom}
                  />
                );
              }
              const isSelected = selectedNodeIds.has(node.id);
              const groupMultiSelected = isSelected && selectedNodeIds.size > 1;
              return (
                <PreviewNode
                  key={node.id}
                  node={node}
                  selected={isSelected}
                  multiSelected={groupMultiSelected}
                  onUpdate={updateNode}
                  onDelete={deleteNode}
                  onDuplicate={duplicateNode}
                  onSelect={handleSelect}
                  onMeasure={onNodeMeasure}
                  registry={registry}
                  measureMode={measureMode}
                  zoom={zoom}
                />
              );
            })}
            {/* Bounding frames — two cases:
                 1) ≥2 nodes multi-selected → frame around the union bbox.
                 2) A single GROUP node is selected → frame around its
                    children (groups themselves don't render, so this is
                    their visual selection indicator + double-click target).
                Plus a faint dashed frame around the group that's currently
                in edit-mode so the user knows where they are. */}
            {(() => {
              // Multi-select frame — draws when ≥2 nodes are selected and
              // any of them is NOT a group (group's own inner indicator is
              // sufficient when it's the sole selection). Uses nodeRect for
              // a screen-space bbox over the selected items.
              if (selectedNodeIds.size < 2) return null;
              const items = [...selectedNodeIds]
                .map((id) => nodes.find((n) => n.id === id))
                .filter(Boolean);
              let xMin = Infinity, yMin = Infinity, xMax = -Infinity, yMax = -Infinity;
              for (const n of items) {
                const r = nodeRect(n);
                if (r.w <= 0 || r.h <= 0) continue;
                if (r.x < xMin) xMin = r.x;
                if (r.y < yMin) yMin = r.y;
                if (r.x + r.w > xMax) xMax = r.x + r.w;
                if (r.y + r.h > yMax) yMax = r.y + r.h;
              }
              if (!Number.isFinite(xMin) || xMax <= xMin || yMax <= yMin) return null;
              return (
                <div
                  className="pointer-events-none absolute"
                  style={{
                    left: xMin,
                    top: yMin,
                    width: xMax - xMin,
                    height: yMax - yMin,
                    borderRadius: 0,
                    boxShadow: `0 0 0 ${1 / zoom}px rgb(59 130 246)`,
                  }}
                >
                  <ChromeLabel zoom={zoom} side="left" tone="solid">
                    {items.length} selected
                  </ChromeLabel>
                </div>
              );
            })()}
            {marquee && (
              <div
                className="pointer-events-none absolute bg-blue-500/10 dark:bg-blue-400/15"
                style={{
                  left: Math.min(marquee.x1, marquee.x2),
                  top: Math.min(marquee.y1, marquee.y2),
                  width: Math.abs(marquee.x2 - marquee.x1),
                  height: Math.abs(marquee.y2 - marquee.y1),
                  boxShadow: `0 0 0 ${1 / zoom}px rgb(59 130 246 / 0.8)`,
                }}
              />
            )}
            </div>
          </div>

          <div ref={addMenuRef} className="absolute top-4 left-4 z-10">
            <button
              onClick={() => setAddMenuOpen(!addMenuOpen)}
              className={`bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium px-3 py-2 rounded-lg shadow-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 flex items-center gap-1.5 transition-all ${
                addMenuOpen ? "ring-2 ring-neutral-900/20 dark:ring-neutral-100/20 ring-offset-2 dark:ring-offset-neutral-900" : ""
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Add component
            </button>

            {addMenuOpen && (
              <div className="absolute top-full mt-2 left-0 w-[300px] bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <div className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Start with</div>
                </div>
                <div className="p-1.5 max-h-[400px] overflow-y-auto">
                  {Object.entries(TEMPLATES).map(([key, tpl]) => (
                    <button
                      key={key}
                      onClick={() => { addNode(key); setAddMenuOpen(false); }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 text-neutral-500 dark:text-neutral-300 text-lg font-light group-hover:bg-white dark:group-hover:bg-neutral-700 group-hover:shadow-sm transition-all">
                        {tpl.icon}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">{tpl.name}</div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug mt-0.5">{tpl.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center max-w-sm px-6">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <Package className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <div className="text-sm text-neutral-700 dark:text-neutral-200 font-medium mb-1">Canvas is empty</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Pick a component from the <span className="font-semibold text-neutral-700 dark:text-neutral-200">POD Components</span> sidebar on the left.
                </div>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 right-4 flex items-center gap-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm p-1">
            <button
              onClick={() => setMeasureMode(!measureMode)}
              className={`p-1.5 rounded transition-colors ${
                measureMode ? "bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900" : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
              }`}
              title="Measure mode — hover elements to inspect"
            >
              <Ruler className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800 mx-0.5" />
            <button onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors">
              <ZoomOut className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
            </button>
            <div className="text-[11px] font-mono text-neutral-600 dark:text-neutral-300 w-10 text-center tabular-nums">
              {Math.round(zoom * 100)}%
            </div>
            <button onClick={() => setZoom((z) => Math.min(4, z + 0.1))} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors">
              <ZoomIn className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
            </button>
            <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800 mx-0.5" />
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors" title="Reset (⌘0)">
              <Maximize2 className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400 font-mono bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800">
            {measureMode ? (
              <><Ruler className="w-3 h-3 text-pink-600" /> <span className="text-pink-700">measure mode</span> · hover elements</>
            ) : spaceHeld ? (
              <><Hand className="w-3 h-3" /> panning</>
            ) : (
              <><MousePointer2 className="w-3 h-3" /> scroll to pan · ⌘+scroll to zoom</>
            )}
          </div>
        </div>

        <div className="w-[360px] border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col shrink-0 z-20">
          {selectedNode?.type === "group" ? (
            <GroupInspector
              group={selectedNode}
              childCount={(selectedNode.children || []).length}
              onRename={(name) => updateNode(selectedNode.id, { name })}
              onUpdateAutolayout={(partial) => updateGroupAutolayout(selectedNode.id, partial)}
              onUpdateSize={(partial) =>
                updateNode(selectedNode.id, {
                  customSize: { ...(selectedNode.customSize || {}), ...partial },
                })
              }
              onEnter={() => enterGroup(selectedNode.id)}
              onUngroup={() => ungroup(selectedNode.id)}
              onDelete={() => deleteNode(selectedNode.id)}
              isEditing={editingGroupId === selectedNode.id}
              allNodes={nodes}
            />
          ) : selectedNode ? (
            <>
              <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <label className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider block mb-1">Component</label>
                <input
                  value={selectedNode.name}
                  onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                  className="w-full text-sm font-medium px-2 py-1 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-md focus:border-neutral-400 dark:focus:border-neutral-500 focus:bg-white dark:focus:bg-neutral-800 outline-none transition-colors"
                />
                <div className="mt-3">
                  <label className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Frame className="w-3 h-3" /> Size
                  </label>
                  {selectedNode.customSize && (
                    <div className="flex gap-1.5 w-full">
                      <SizeInput
                        type="width"
                        value={selectedNode.customSize.width}
                        mode={selectedNode.customSize.widthMode || "fixed"}
                        showFill={!!selectedNode.parent}
                        onChange={(next) => updateNode(selectedNode.id, {
                          customSize: { ...selectedNode.customSize, width: next.value, widthMode: next.mode }
                        })}
                      />
                      <SizeInput
                        type="height"
                        value={selectedNode.customSize.height}
                        mode={selectedNode.customSize.heightMode || "auto"}
                        showFill={!!selectedNode.parent}
                        onChange={(next) => updateNode(selectedNode.id, {
                          customSize: { ...selectedNode.customSize, height: next.value, heightMode: next.mode }
                        })}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 shrink-0">
                {[
                  { id: "props", icon: SlidersHorizontal, label: "Props" },
                  { id: "code", icon: Code2, label: "Code" },
                  { id: "tokens", icon: Palette, label: "Tokens" },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = inspectorTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setInspectorTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium transition-colors border-b-2 ${
                        active
                          ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
                          : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                {inspectorTab === "props" && (
                  <div className="flex-1 overflow-y-auto p-4">
                    {Object.keys(selectedNode.schema || {}).length === 0 ? (
                      <div className="text-[11px] text-neutral-400 dark:text-neutral-500 italic py-8 text-center">
                        No props defined.<br />
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Add props to <span className="font-mono">function Component(&#123;...&#125;)</span> in Code tab.
                        </span>
                      </div>
                    ) : (
                      Object.entries(selectedNode.schema)
                        .filter(([key]) =>
                          isPropVisibleForVariant(
                            extractComponentName(selectedNode.code),
                            key,
                            selectedNode.props,
                          ),
                        )
                        .map(([key, s]) => (
                          <PropInput
                            key={key}
                            propKey={key}
                            schema={s}
                            value={selectedNode.props[key] ?? s.default}
                            onChange={(v) => updateNodeProp(selectedNode.id, key, v)}
                          />
                        ))
                    )}
                  </div>
                )}

                {inspectorTab === "code" && (
                  <div className="flex-1 flex flex-col min-h-0">
                    {(() => {
                      const selfName = extractComponentName(selectedNode.code);
                      const available = Object.keys(registry).filter((n) => n !== selfName);
                      if (available.length === 0) return null;
                      return (
                        <div className="px-3 py-2 bg-blue-50/50 border-b border-blue-100 text-[10px] text-blue-900 flex items-start gap-1.5">
                          <Layers className="w-3 h-3 mt-0.5 shrink-0 text-blue-600" />
                          <div className="leading-relaxed">
                            <span className="text-blue-600/70">Compose with: </span>
                            {available.map((name, i) => (
                              <span key={name}>
                                <code className="font-mono font-semibold text-blue-700">{name}</code>
                                {i < available.length - 1 && <span className="text-blue-600/50">, </span>}
                              </span>
                            ))}
                            <span className="text-blue-600/70"> — use </span>
                            <code className="font-mono text-blue-700">h({available[0]}, &#123;...&#125;)</code>
                          </div>
                        </div>
                      );
                    })()}
                    <div className="flex-1 min-h-0">
                      <CodeEditor
                        value={selectedNode.code}
                        onChange={(v) => updateNodeCode(selectedNode.id, v)}
                      />
                    </div>
                  </div>
                )}

                {inspectorTab === "tokens" && (() => {
                  // Scope tokens to those the SELECTED VARIANT of the POD component actually
                  // consumes. Common tokens (entry.tokens) merge with variant-specific
                  // (entry.variantTokens[currentVariant]). Fallback to full palette for
                  // unknown components / non-JSX nodes.
                  const isJsx = isJsxSnippet(selectedNode.code);
                  const podRef = globalPodTokens;
                  let refTokens = isJsx ? podRef : globalTokens;
                  let scopeNote = null;
                  if (isJsx) {
                    const tag = extractJsxTag(selectedNode.code);
                    const entry = canvasManifest.components.find((c) => c.name === tag);
                    const hasAllowlist = entry?.tokens?.length || entry?.variantTokens;
                    if (hasAllowlist) {
                      const currentVariant = selectedNode.props?.variant;
                      const common = entry.tokens || [];
                      const variantSpecific = currentVariant && entry.variantTokens?.[currentVariant]
                        ? entry.variantTokens[currentVariant]
                        : [];
                      const allowed = new Set([...common, ...variantSpecific]);
                      const filteredColors = Object.fromEntries(
                        Object.entries(podRef.colors || {}).filter(([k]) => allowed.has(k))
                      );
                      refTokens = { ...podRef, colors: filteredColors };
                      scopeNote = currentVariant
                        ? `${allowed.size} tokens · ${entry.name} / ${currentVariant}`
                        : `${allowed.size} tokens · ${entry.name}`;
                    }
                  }
                  return (
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4 p-2.5 bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 rounded-md">
                        Override tokens for this component only. Click the reset icon to revert.
                        {scopeNote && (
                          <div className="mt-1 text-violet-700 dark:text-violet-300 font-medium">{scopeNote}</div>
                        )}
                      </div>
                      <TokenEditor
                        tokens={selectedNode.tokenOverrides || {}}
                        referenceTokens={refTokens}
                        isOverride
                        onChange={(cat, key, val) => updateNodeTokenOverride(selectedNode.id, cat, key, val)}
                      />
                    </div>
                  );
                })()}
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-800 p-2 shrink-0">
                <div className="grid grid-cols-2 gap-1">
                  <button onClick={() => duplicateNode(selectedNode.id)} className="text-[11px] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors">
                    <Copy className="w-3 h-3" />
                    Duplicate
                  </button>
                  <button onClick={() => deleteNode(selectedNode.id)} className="text-[11px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 px-2 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors">
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </>
          ) : selectedNodeIds.size > 1 ? (
            <MultiSelectPanel
              count={selectedNodeIds.size}
              selectedNodeIds={selectedNodeIds}
              nodes={nodes}
              onPickNode={setSelectedNodeId}
              onDuplicateAll={() => [...selectedNodeIds].forEach((id) => duplicateNode(id))}
              onDeleteAll={() => [...selectedNodeIds].forEach((id) => deleteNode(id))}
              onAutoArrange={autoArrangeSelected}
              onDistribute={distributeSelected}
            />
          ) : (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <MousePointer2 className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-300 font-medium mb-1">Nothing selected</div>
                <div className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
                  Click a component to edit. Drag to marquee-select. Shift-click for multi.
                </div>
              </div>
              {nodes.filter((n) => !n.parent).length > 0 && (
                <div className="text-left">
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider mb-2">Components</div>
                  <div className="space-y-0.5">
                    {nodes.filter((n) => !n.parent).map((n) => (
                      <button key={n.id} onClick={() => setSelectedNodeId(n.id)} className="w-full text-left text-[11px] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 py-1.5 rounded flex items-center gap-2 transition-colors">
                        <div className={`w-1 h-1 rounded-full ${n.type === "group" ? "bg-blue-400" : "bg-neutral-400 dark:bg-neutral-500"}`} />
                        <span className="font-medium truncate">{n.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showSyntaxHint && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowSyntaxHint(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Component syntax</h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">Uses h() helper — alias for React.createElement</p>
              </div>
              <button onClick={() => setShowSyntaxHint(false)} className="p-1 hover:bg-neutral-100 rounded transition-colors">
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-[12px]">
              <div>
                <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-1.5">Signature</div>
                <pre className="bg-neutral-50 p-3 rounded-md font-mono text-[11px] leading-relaxed overflow-x-auto">{`h(tag, props, ...children)`}</pre>
              </div>
              <div>
                <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-1.5">Simple element</div>
                <pre className="bg-neutral-50 p-3 rounded-md font-mono text-[11px] leading-relaxed overflow-x-auto">{`h('div', null, 'Hello')
// same as: <div>Hello</div>`}</pre>
              </div>
              <div>
                <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-1.5">With handlers & style</div>
                <pre className="bg-neutral-50 p-3 rounded-md font-mono text-[11px] leading-relaxed overflow-x-auto">{`h('button', {
  onClick: () => alert('hi'),
  style: { padding: 10 }
}, 'Click me')`}</pre>
              </div>
              <div>
                <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-1.5">Nested</div>
                <pre className="bg-neutral-50 p-3 rounded-md font-mono text-[11px] leading-relaxed overflow-x-auto">{`h('div', null,
  h('h1', null, 'Title'),
  h('p', null, 'Description')
)`}</pre>
              </div>
              <div>
                <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-1.5">Design tokens</div>
                <pre className="bg-neutral-50 p-3 rounded-md font-mono text-[11px] leading-relaxed overflow-x-auto">{`style: {
  color: "var(--token-colors-brand)",
  padding: "var(--token-spacing-btn-y-md)",
  borderRadius: "var(--token-radius-btn)"
}`}</pre>
              </div>
              <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-200 leading-relaxed">
                Hooks available: <code className="font-mono bg-neutral-100 px-1 rounded">useState</code>, <code className="font-mono bg-neutral-100 px-1 rounded">useEffect</code>, <code className="font-mono bg-neutral-100 px-1 rounded">useRef</code>, <code className="font-mono bg-neutral-100 px-1 rounded">useCallback</code>, <code className="font-mono bg-neutral-100 px-1 rounded">useMemo</code>
              </div>
            </div>
          </div>
        </div>
      )}

      <ChangelogPopup open={changelogOpen} onClose={() => setChangelogOpen(false)} />
    </div>
  );
}