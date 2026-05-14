
import React from 'react';
import { Palette, RotateCcw } from "lucide-react";

// =============================================================
export default function TokenEditor({ tokens, onChange, referenceTokens, isOverride }) {
  return (
    <div className="space-y-5">
      {Object.entries(referenceTokens || tokens).map(([category, values]) => (
        <div key={category}>
          <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-2">{category}</div>
          <div className="space-y-1.5">
            {Object.entries(values).map(([key, defaultVal]) => {
              const overrideVal = tokens?.[category]?.[key];
              const effective = overrideVal ?? defaultVal;
              const hasOverride = isOverride && overrideVal !== undefined;
              return (
                <div key={key} className="flex items-center gap-2 group">
                  <label className={`text-[11px] font-mono w-24 shrink-0 truncate ${hasOverride ? "text-violet-700 font-semibold" : "text-neutral-600"}`}>
                    {key}
                  </label>
                  {category === "colors" ? (
                    <>
                      <input
                        type="color"
                        value={effective}
                        onChange={(e) => onChange(category, key, e.target.value)}
                        className="w-6 h-6 rounded border border-neutral-200 cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={effective}
                        onChange={(e) => onChange(category, key, e.target.value)}
                        className={`flex-1 min-w-0 text-[11px] font-mono px-1.5 py-1 border rounded focus:border-neutral-400 focus:bg-white outline-none ${
                          hasOverride ? "bg-violet-50 border-violet-200" : "bg-neutral-50 border-neutral-200"
                        }`}
                      />
                    </>
                  ) : (
                    <input
                      type="text"
                      value={effective}
                      onChange={(e) => onChange(category, key, e.target.value)}
                      className={`flex-1 min-w-0 text-[11px] font-mono px-1.5 py-1 border rounded focus:border-neutral-400 focus:bg-white outline-none ${
                        hasOverride ? "bg-violet-50 border-violet-200" : "bg-neutral-50 border-neutral-200"
                      }`}
                    />
                  )}
                  {isOverride && hasOverride && (
                    <button
                      onClick={() => onChange(category, key, undefined)}
                      className="p-0.5 hover:bg-neutral-200 rounded transition-colors shrink-0"
                      title="Remove override"
                    >
                      <RotateCcw className="w-3 h-3 text-neutral-500" />
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


