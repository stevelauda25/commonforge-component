"use client";
import { useEffect, useRef, useState } from "react";

// =============================================================
// Modal wrapper — owns the open/close orchestration so every popup in
// centernode has the same entrance + exit motion. Two phases:
//
//   open=true  → mount, next-frame flip visible=true → CSS transitions
//                slide the backdrop opacity from 0 → 1 and lift the
//                panel from (scale 0.96, translateY 6) to (1, 0).
//   open=false → flip visible=false → CSS transitions run in reverse,
//                unmount after the animation duration so the DOM stays
//                clean and re-opens get a fresh entrance.
//
// `align`:
//   "center" — vertically centered (default — changelog, syntax)
//   "top"    — pinned ~16vh from the top (palette / command-style)
//
// Background of the panel matches the sidebar (`cn-surface`) so the two
// surfaces read as the same layer — the backdrop dim + blur is what
// separates the modal from the canvas, not a brighter panel color.
export default function Modal({
  open,
  onClose,
  align = "center",
  width = 560,
  ariaLabel,
  children,
}) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const closingTimerRef = useRef(0);

  useEffect(() => {
    if (open) {
      // Mount → next paint frame → flip to visible so CSS transitions fire.
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      // Hold the DOM long enough for the exit transition to play out.
      // 280ms = `--cn-dur-settled` + tiny buffer for ease-out tail.
      closingTimerRef.current = window.setTimeout(() => setMounted(false), 280);
      return () => window.clearTimeout(closingTimerRef.current);
    }
  }, [open]);

  // Esc to close — bind only while mounted to keep the listener pool small.
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, onClose]);

  if (!mounted) return null;

  const justify = align === "top" ? "items-start pt-[16vh]" : "items-center";

  return (
    <div
      data-overlay
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className={`fixed inset-0 z-50 flex justify-center px-4 ${justify}`}
      // Disable pointer events while exiting so quick re-clicks don't
      // bounce off a phantom backdrop after the user already closed it.
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      {/* Backdrop — its own transition layer so opacity / blur can ease
          independently of the panel motion. */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: "rgba(0, 0, 0, 0.55)",
          backdropFilter: "blur(10px) saturate(120%)",
          WebkitBackdropFilter: "blur(10px) saturate(120%)",
          opacity: visible ? 1 : 0,
          transition:
            "opacity var(--cn-dur-normal) var(--cn-ease-out), backdrop-filter var(--cn-dur-normal) var(--cn-ease-out)",
        }}
      />
      {/* Panel — surface color matches the inspector sidebar so the
          modal reads as the same layer. Springy scale + lift on open. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-h-[80vh] flex flex-col rounded-xl shadow-2xl overflow-hidden"
        style={{
          maxWidth: width,
          background: "var(--cn-surface)",
          border: "1px solid var(--cn-border-default)",
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0) scale(1)"
            : "translateY(6px) scale(0.97)",
          transformOrigin: align === "top" ? "top center" : "center",
          transition:
            "opacity var(--cn-dur-normal) var(--cn-ease-out)," +
            " transform var(--cn-dur-settled) var(--cn-ease-spring)",
          willChange: "opacity, transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
