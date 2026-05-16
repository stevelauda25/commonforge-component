
import React from 'react';
import { Palette, RotateCcw } from "lucide-react";

// =============================================================
export default function TokenEditor({ tokens, onChange, referenceTokens, isOverride }) {
  return (
    <div className="space-y-5">
      {Object.entries(referenceTokens || tokens).map(([category, values]) => (
        <div key={category}>
          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider mb-2">{category}</div>
          <div className="space-y-1.5">
            {Object.entries(values).map(([key, defaultVal]) => {
              const overrideVal = tokens?.[category]?.[key];
              const effective = overrideVal ?? defaultVal;
              const hasOverride = isOverride && overrideVal !== undefined;
              const inputBase =
                "flex-1 min-w-0 text-[11px] font-mono px-1.5 py-1 border rounded outline-none transition-colors";
              const inputCls = `${inputBase} ${
                hasOverride
                  ? "bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-900/50 text-violet-900 dark:text-violet-200 focus:border-violet-400 dark:focus:border-violet-700"
                  : "bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 focus:border-neutral-400 dark:focus:border-neutral-500 focus:bg-white dark:focus:bg-neutral-800"
              }`;
              return (
                <div key={key} className="flex items-center gap-2 group">
                  <label className={`text-[11px] font-mono w-24 shrink-0 truncate ${
                    hasOverride
                      ? "text-violet-700 dark:text-violet-300 font-semibold"
                      : "text-neutral-600 dark:text-neutral-300"
                  }`}>
                    {key}
                  </label>
                  {category === "colors" ? (
                    <>
                      <input
                        type="color"
                        value={effective}
                        onChange={(e) => onChange(category, key, e.target.value)}
                        className="w-6 h-6 rounded border border-neutral-200 dark:border-neutral-700 cursor-pointer shrink-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={effective}
                        onChange={(e) => onChange(category, key, e.target.value)}
                        className={inputCls}
                      />
                    </>
                  ) : (
                    <input
                      type="text"
                      value={effective}
                      onChange={(e) => onChange(category, key, e.target.value)}
                      className={inputCls}
                    />
                  )}
                  {isOverride && hasOverride && (
                    <button
                      onClick={() => onChange(category, key, undefined)}
                      className="p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors shrink-0"
                      title="Remove override"
                    >
                      <RotateCcw className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}


