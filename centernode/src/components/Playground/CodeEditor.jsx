
import React, { useRef, useMemo } from 'react';
import { highlightCode, TOKEN_COLORS, TOKEN_COLORS_DARK } from '@/utils/highlighter';

// =============================================================
// Shared code surface — used both by the single-component editor (full
// edit, light theme) and the autolayout group code preview (read-only,
// dark theme). One implementation, one syntax highlighter, one font →
// the two surfaces stay visually consistent.
export default function CodeEditor({ value, onChange, readOnly = false, theme = "dark" }) {
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const isDark = theme === "dark";
  const palette = isDark ? TOKEN_COLORS_DARK : TOKEN_COLORS;

  const tokens = useMemo(() => highlightCode(value || ""), [value]);
  const lineCount = useMemo(() => (value || "").split("\n").length, [value]);

  // Sync scroll
  const handleScroll = () => {
    if (preRef.current && textareaRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Tab handling
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);
      // Restore cursor
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const sharedStyle = {
    // Geist Mono — wired in app/layout.tsx as a `--font-geist-mono`
    // CSS variable. Falls back to system mono if unloaded.
    fontFamily: "var(--font-geist-mono), 'JetBrains Mono', 'Menlo', 'Consolas', monospace",
    fontSize: "12px",
    lineHeight: "1.6",
    tabSize: 2,
    whiteSpace: "pre",
    wordWrap: "normal",
    padding: "12px 12px 12px 0",
    margin: 0,
    border: "none",
    overflow: "auto",
  };

  const surfaceBg = isDark ? "#0a0c10" : "#ffffff";
  const gutterBg = isDark ? "#0a0c10" : "#fafafa";
  const gutterFg = isDark ? "#525252" : "#a3a3a3";
  const gutterBorder = isDark ? "rgba(255,255,255,0.06)" : "#e5e5e5";
  const caretColor = readOnly ? "transparent" : (isDark ? "#e5e5e5" : "#171717");

  return (
    <div
      className="relative w-full h-full flex overflow-hidden"
      style={{ background: surfaceBg }}
    >
      {/* Line numbers */}
      <div
        ref={lineNumbersRef}
        className="shrink-0 select-none overflow-hidden"
        style={{
          ...sharedStyle,
          padding: "12px 8px 12px 12px",
          width: "42px",
          color: gutterFg,
          textAlign: "right",
          background: gutterBg,
          borderRight: `1px solid ${gutterBorder}`,
        }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      {/* Code area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Highlighted code (background) */}
        <pre
          ref={preRef}
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ ...sharedStyle, paddingLeft: "12px" }}
        >
          {tokens.map((t, i) => (
            <span key={i} style={{ color: palette[t.type] || palette.text }}>
              {t.text}
            </span>
          ))}
          <span>{"\n"}</span>
        </pre>

        {/* Transparent textarea (foreground) — disabled when readOnly so the
            composite source can be hidden behind a clean usage view. */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => !readOnly && onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={readOnly ? undefined : handleKeyDown}
          spellCheck={false}
          readOnly={readOnly}
          className="absolute inset-0 w-full h-full resize-none outline-none bg-transparent"
          style={{
            ...sharedStyle,
            paddingLeft: "12px",
            color: "transparent",
            caretColor,
          }}
        />
      </div>
    </div>
  );
}
