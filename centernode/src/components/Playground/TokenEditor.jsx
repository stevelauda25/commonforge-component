"use client";
import React, { useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

// =============================================================
// TokenEditor — flat row list of design tokens, grouped by category.
// Row chrome mirrors SizeInput precisely: bordered transparent field
// with leading swatch slot (w-7), free-typed value, trailing reset
// slot (w-5). Override state lights the border amber.

function ColorSwatch({ value, onChange }) {
  const ref = useRef(null);
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="flex items-center justify-center w-7 h-full shrink-0 cursor-pointer text-cn-text-muted hover:text-cn-text-primary transition-colors"
        title="Pick colour"
      >
        <span
          className="w-3.5 h-3.5 rounded-[3px] border border-cn-border-default shrink-0"
          style={{ background: value }}
        />
      </button>
      <input
        ref={ref}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
    </>
  );
}

function TokenRow({ category, name, value, hasOverride, onChange, onReset }) {
  const [focused, setFocused] = useState(false);
  const isColor = category === "colors";
  return (
    <div className="flex items-center gap-2 h-7">
      <span
        className={`cn-mono text-[11px] truncate ${
          hasOverride ? "text-cn-accent" : "text-cn-text-muted"
        }`}
        style={{ width: 96 }}
        title={name}
      >
        {name}
      </span>
      <div
        className={`relative flex-1 flex items-center h-7 bg-transparent border rounded-md transition-colors ${
          focused
            ? "border-cn-accent"
            : hasOverride
            ? "border-cn-accent"
            : "border-cn-border-subtle hover:border-cn-border-default"
        }`}
        style={focused ? { boxShadow: "0 0 0 3px var(--cn-accent-ring)" } : undefined}
      >
        {isColor ? (
          <ColorSwatch value={value} onChange={(v) => onChange(v)} />
        ) : (
          <span className="w-2" />
        )}
        <input
          type="text"
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 w-full h-full bg-transparent pr-1 cn-mono text-[11px] outline-none tabular-nums text-cn-text-primary"
          spellCheck={false}
        />
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center w-5 h-full text-cn-text-muted hover:text-cn-accent shrink-0 transition-colors"
            title="Reset to default"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}
      </div>
    </div>
  );
}

export default function TokenEditor({ tokens, onChange, referenceTokens, isOverride }) {
  const source = referenceTokens || tokens || {};
  const categories = Object.entries(source);
  if (categories.length === 0) {
    return (
      <div className="cn-mono-meta text-cn-text-muted">
        No tokens to display.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {categories.map(([category, values]) => (
        <div key={category}>
          <div className="cn-eyebrow mb-2">{category}</div>
          <div className="flex flex-col gap-1">
            {Object.entries(values).map(([key, defaultVal]) => {
              const overrideVal = tokens?.[category]?.[key];
              const effective = overrideVal ?? defaultVal;
              const hasOverride = isOverride && overrideVal !== undefined;
              return (
                <TokenRow
                  key={key}
                  category={category}
                  name={key}
                  value={effective}
                  hasOverride={hasOverride}
                  onChange={(v) => onChange(category, key, v)}
                  onReset={hasOverride ? () => onChange(category, key, undefined) : null}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
