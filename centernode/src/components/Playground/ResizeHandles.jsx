import React from 'react';

// =============================================================
export default function ResizeHandles({ containerRef, onResize, zoom = 1, offset = 0 }) {
  const startResize = (direction) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const startW = rect.width / zoom;
    const startH = rect.height / zoom;
    const startX = e.clientX;
    const startY = e.clientY;

    const onMove = (ev) => {
      const dx = (ev.clientX - startX) / zoom;
      const dy = (ev.clientY - startY) / zoom;

      let w = undefined;
      let h = undefined;

      if (direction.includes("e") || direction.includes("w")) {
        w = startW + (direction.includes("w") ? -dx : dx);
        w = Math.max(40, w);
      }
      
      if (direction.includes("n") || direction.includes("s")) {
        h = startH + (direction.includes("n") ? -dy : dy);
        h = Math.max(24, h);
      }

      onResize({ width: w, height: h });
    };
    
    document.body.classList.add("is-resizing");
    const onUp = () => {
      document.body.classList.remove("is-resizing");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const s = 10 / zoom;
  const half = s / 2;
  const border = 2 / zoom;
  // Push handles further outward by `offset` (in screen px) so they sit
  // OUTSIDE any selection ring drawn on the container's edge — prevents
  // the dots from overlapping the frame and feels closer to Figma's
  // detached-handle look.
  const off = offset / zoom;
  const out = half + off;

  const handles = [
    { dir: "w",  style: { top: `calc(50% - ${half}px)`, left: -out, cursor: "ew-resize" } },
    { dir: "e",  style: { top: `calc(50% - ${half}px)`, right: -out, cursor: "ew-resize" } },
    { dir: "n",  style: { left: `calc(50% - ${half}px)`, top: -out, cursor: "ns-resize" } },
    { dir: "s",  style: { left: `calc(50% - ${half}px)`, bottom: -out, cursor: "ns-resize" } },
    { dir: "nw", style: { top: -out, left: -out, cursor: "nwse-resize" } },
    { dir: "ne", style: { top: -out, right: -out, cursor: "nesw-resize" } },
    { dir: "sw", style: { bottom: -out, left: -out, cursor: "nesw-resize" } },
    { dir: "se", style: { bottom: -out, right: -out, cursor: "nwse-resize" } },
  ];

  return (
    <>
      {handles.map((handle) => (
        <div
          key={handle.dir}
          data-resize-handle
          className="absolute bg-white rounded-sm shadow-sm"
          // Border color uses the same amber as the selection ring so
          // the dots read as part of the same selection chrome.
          data-handle-tone="accent"
          style={{
            ...handle.style,
            width: s,
            height: s,
            borderWidth: border,
            borderStyle: "solid",
            borderColor: "var(--cn-selection)",
            zIndex: 60,
          }}
          onMouseDown={startResize(handle.dir)}
          onClick={(e) => e.stopPropagation()}
        />
      ))}
    </>
  );
}
