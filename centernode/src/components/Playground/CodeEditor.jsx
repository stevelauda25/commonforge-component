
import React, { useRef, useMemo } from 'react';
import { highlightCode, TOKEN_COLORS } from '@/utils/highlighter';

// =============================================================
export default function CodeEditor({ value, onChange, readOnly = false }) {
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const tokens = useMemo(() => highlightCode(value), [value]);
  const lineCount = useMemo(() => value.split("\n").length, [value]);

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
    fontFamily: "'JetBrains Mono', 'Menlo', 'Consolas', monospace",
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

  return (
    <div className="relative w-full h-full flex bg-white overflow-hidden">
      {/* Line numbers */}
      <div
        ref={lineNumbersRef}
        className="shrink-0 select-none overflow-hidden bg-neutral-50 border-r border-neutral-200"
        style={{
          ...sharedStyle,
          padding: "12px 8px 12px 12px",
          width: "42px",
          color: "#a3a3a3",
          textAlign: "right",
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
            <span key={i} style={{ color: TOKEN_COLORS[t.type] || TOKEN_COLORS.text }}>
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
            caretColor: readOnly ? "transparent" : "#171717",
          }}
        />
      </div>
    </div>
  );
}
