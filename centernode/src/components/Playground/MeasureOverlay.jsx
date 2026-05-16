
import React, { useState, useEffect, useRef } from 'react';

// =============================================================
export default function MeasureOverlay({ containerRef, zoom = 1 }) {
  const [info, setInfo] = useState(null);
  // Hold latest zoom in a ref so the listeners (attached once) read the
  // current value without us having to re-subscribe on every zoom change.
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // getBoundingClientRect returns screen pixels POST-zoom (the CSS `zoom`
    // wrapper around the canvas scales descendant rects). But the overlay is
    // rendered inside that same wrapper, so an inline `left: N px` is
    // multiplied by zoom AGAIN during layout. To land on the right spot we
    // divide rect-derived deltas by the current zoom factor, recovering the
    // pre-zoom CSS coordinate the overlay needs.
    const onMove = (e) => {
      const target = e.target;
      if (!target || target === container) {
        setInfo(null);
        return;
      }
      // Skip overlay elements
      if (target.closest(".measure-overlay")) return;

      const rect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const styles = window.getComputedStyle(target);
      const z = zoomRef.current > 0 ? zoomRef.current : 1;

      setInfo({
        tag: target.tagName.toLowerCase(),
        x: (rect.left - containerRect.left) / z,
        y: (rect.top - containerRect.top) / z,
        width: Math.round(rect.width / z),
        height: Math.round(rect.height / z),
        padding: styles.padding,
        margin: styles.margin,
        borderRadius: styles.borderRadius,
        background: styles.backgroundColor,
        color: styles.color,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        display: styles.display,
      });
    };
    const onLeave = () => setInfo(null);

    const onMessage = (e) => {
      if (e.data && e.data.type === 'canvas-measure') {
        const frameId = e.data.frameId;
        const iframe = container.querySelector(`iframe[data-frame-id="${frameId}"]`);

        if (!iframe) {
          return; // Came from another component's iframe
        }

        if (!e.data.info) {
          setInfo(null);
        } else {
          // Iframe-internal info.x/y/width/height are already in CSS pixels
          // (iframe is its own document — parent's `zoom` doesn't propagate
          // inside). Only the iframe-vs-container offset needs un-zooming,
          // because that delta IS measured in post-zoom screen pixels.
          const containerRect = container.getBoundingClientRect();
          const iframeRect = iframe.getBoundingClientRect();
          const z = zoomRef.current > 0 ? zoomRef.current : 1;

          const info = e.data.info;
          info.x = info.x + (iframeRect.left - containerRect.left) / z;
          info.y = info.y + (iframeRect.top - containerRect.top) / z;
          setInfo(info);
        }
      }
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    window.addEventListener("message", onMessage);

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("message", onMessage);
    };
  }, [containerRef]);

  if (!info) return null;

  const copyCSS = (e) => {
    e.stopPropagation();
    const css = [
      `width: ${info.width}px;`,
      `height: ${info.height}px;`,
      `padding: ${info.padding};`,
      info.margin !== "0px" ? `margin: ${info.margin};` : null,
      info.borderRadius !== "0px" ? `border-radius: ${info.borderRadius};` : null,
      info.background !== "rgba(0, 0, 0, 0)" ? `background: ${info.background};` : null,
      `color: ${info.color};`,
      `font-size: ${info.fontSize};`,
      `font-weight: ${info.fontWeight};`,
    ].filter(Boolean).join("\n");
    navigator.clipboard?.writeText(css);
  };

  return (
    <>
      {/* Highlight bounds */}
      <div
        className="measure-overlay absolute pointer-events-none border border-pink-500 bg-pink-500/5"
        style={{
          left: info.x,
          top: info.y,
          width: info.width,
          height: info.height,
          zIndex: 50,
        }}
      />
      {/* Info panel */}
      <div
        className="measure-overlay absolute bg-neutral-900 text-white rounded-md shadow-xl text-[10px] font-mono px-2.5 py-2 pointer-events-auto"
        style={{
          left: info.x,
          top: info.y + info.height + 6,
          zIndex: 51,
          minWidth: 180,
          maxWidth: 240,
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-white/10">
          <span className="text-pink-400 font-semibold">{info.tag}</span>
          <button
            onClick={copyCSS}
            className="text-[9px] text-neutral-300 hover:text-white bg-white/10 hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors"
          >
            copy CSS
          </button>
        </div>
        <div className="space-y-0.5 text-neutral-300">
          <div><span className="text-neutral-500">size</span> {info.width}×{info.height}</div>
          <div><span className="text-neutral-500">padding</span> {info.padding}</div>
          {info.margin !== "0px" && <div><span className="text-neutral-500">margin</span> {info.margin}</div>}
          {info.borderRadius !== "0px" && <div><span className="text-neutral-500">radius</span> {info.borderRadius}</div>}
          {info.background !== "rgba(0, 0, 0, 0)" && (
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500">bg</span>
              <span className="w-2.5 h-2.5 rounded-sm border border-white/20" style={{ background: info.background }} />
              <span className="truncate">{info.background}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">color</span>
            <span className="w-2.5 h-2.5 rounded-sm border border-white/20" style={{ background: info.color }} />
            <span className="truncate">{info.color}</span>
          </div>
          <div><span className="text-neutral-500">font</span> {info.fontSize} / {info.fontWeight}</div>
        </div>
      </div>
    </>
  );
}
