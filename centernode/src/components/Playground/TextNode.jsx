"use client";
import React, { useRef, useEffect, memo, useState } from "react";

// =============================================================
// TextNode — free-form text on the canvas. No LiveComponent, no schema.
// Sits next to PreviewNode in the render dispatcher.
//
// Selection / drag chrome mirrors PreviewNode (label above, amber ring,
// resize handles, zoom-invariant stroke). Double-click flips into inline
// edit mode using contentEditable so the user can type directly on the
// canvas.

function TextNode({ node, onUpdate, onSelect, onMeasure, selected, multiSelected = false, zoom }) {
  const showChrome = selected && !multiSelected;
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [editing, setEditing] = useState(false);

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

  // Drive the contentEditable as an UNCONTROLLED node — React never
  // touches its children, so typed-in characters (especially spaces) can
  // never be clobbered by an unrelated re-render. We push text in only
  // when (a) the node mounts or (b) `node.content` changes externally
  // while NOT editing (e.g. inspector textarea edit).
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    if (editing) return;
    if (el.innerText !== (node.content || "")) {
      el.innerText = node.content || "";
    }
  }, [node.content, editing]);

  const handleMouseDown = (e) => {
    if (editing) return;
    if (e.target.closest("[data-resize-handle]")) return;
    if (e.button !== 0) return;
    e.stopPropagation();
    const startScreenX = e.clientX;
    const startScreenY = e.clientY;
    const startNodeX = node.x;
    const startNodeY = node.y;
    let dragging = false;
    onSelect(node.id, e.shiftKey);
    const handleMove = (ev) => {
      const dx = (ev.clientX - startScreenX) / zoom;
      const dy = (ev.clientY - startScreenY) / zoom;
      if (!dragging && Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
      dragging = true;
      onUpdate(node.id, { x: startNodeX + dx, y: startNodeY + dy });
    };
    const handleUp = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setEditing(true);
    requestAnimationFrame(() => {
      const el = textRef.current;
      if (!el) return;
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });
  };

  const commitText = () => {
    setEditing(false);
    const next = textRef.current?.innerText ?? "";
    if (next !== node.content) onUpdate(node.id, { content: next });
  };

  const textStyle = {
    fontFamily: node.fontFamily || "system-ui, -apple-system, sans-serif",
    fontSize: `${node.fontSize || 16}px`,
    fontWeight: node.fontWeight || 400,
    lineHeight: node.lineHeight || 1.4,
    letterSpacing: typeof node.letterSpacing === "number" ? `${node.letterSpacing}px` : undefined,
    color: node.color || "#fafafa",
    textAlign: node.textAlign || "left",
    fontStyle: node.fontStyle || "normal",
  };

  return (
    <div
      data-node-id={node.id}
      data-node-type="text"
      className="select-none group absolute"
      style={{ left: node.x, top: node.y }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {zoom >= 1 && (
        <div
          className={`node-drag absolute cursor-move whitespace-nowrap font-medium tracking-tight transition-opacity ${
            multiSelected
              ? "opacity-0 pointer-events-none"
              : showChrome
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
          } ${selected ? "text-cn-selection" : "text-cn-text-muted"}`}
          style={{
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

      <div
        className="relative inline-block"
        onClick={(e) => e.stopPropagation()}
        ref={containerRef}
      >
        <div
          ref={textRef}
          contentEditable={editing}
          suppressContentEditableWarning
          spellCheck={false}
          onBlur={commitText}
          onKeyDown={(e) => {
            // Stop global shortcuts from reaching the canvas while a key
            // is being typed (defence-in-depth on top of isContentEditable
            // checks at the window level).
            e.stopPropagation();
            if (e.key === "Escape") {
              e.preventDefault();
              if (textRef.current) textRef.current.innerText = node.content || "";
              setEditing(false);
            }
          }}
          style={{
            outline: "none",
            cursor: editing ? "text" : "default",
            minWidth: editing ? 20 : undefined,
            // `pre` preserves spaces + line breaks but never auto-wraps on
            // spaces (which a `pre-wrap` + fit-content combo does — that
            // is what was causing "every space → line break"). User-typed
            // Enter inserts an explicit \n and renders on a new line.
            whiteSpace: "pre",
            display: "inline-block",
            ...textStyle,
          }}
        />
        {/* Children DELIBERATELY omitted — innerText is driven from the
            ref via useEffect so React never reconciles the editable
            text and accidentally wipes typed chars (esp. spaces). */}

        <div
          className={`absolute pointer-events-none transition-colors ${
            !multiSelected && !showChrome
              ? "group-hover:[--ring-color:rgb(251_191_36_/_0.5)]"
              : ""
          }`}
          style={{
            inset: 0,
            borderRadius: 0,
            boxShadow: multiSelected
              ? "none"
              : `0 0 0 ${1 / zoom}px ${
                  showChrome ? "var(--cn-selection)" : "var(--ring-color, transparent)"
                }`,
          }}
        />
      </div>
    </div>
  );
}

export default memo(TextNode);
