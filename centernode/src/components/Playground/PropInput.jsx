
import React from 'react';

// =============================================================
export default function PropInput({ propKey, schema, value, onChange }) {
  if (schema.type === "boolean") {
    return (
      <div className="flex items-center justify-between py-2">
        <div className="text-[12px] text-neutral-700 font-medium">{propKey}</div>
        <button
          onClick={() => onChange(!value)}
          className={`relative w-8 h-4 rounded-full transition-colors ${value ? "bg-neutral-900" : "bg-neutral-200"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${value ? "translate-x-4" : "translate-x-0"}`} />
        </button>
      </div>
    );
  }
  if (schema.type === "enum") {
    return (
      <div className="py-2">
        <label className="text-[11px] text-neutral-500 font-medium mb-1.5 block">{propKey}</label>
        <div className="flex flex-wrap gap-1">
          {schema.options.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`text-[11px] px-2 py-1 rounded border transition-all ${
                value === opt
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (schema.type === "number") {
    return (
      <div className="py-2">
        <label className="text-[11px] text-neutral-500 font-medium mb-1.5 block">{propKey}</label>
        <input
          type="number"
          value={value ?? 0}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full text-[12px] px-2 py-1.5 bg-white border border-neutral-200 rounded-md focus:border-neutral-400 outline-none"
        />
      </div>
    );
  }
  if (schema.type === "color") {
    return (
      <div className="py-2">
        <label className="text-[11px] text-neutral-500 font-medium mb-1.5 block">{propKey}</label>
        <div className="flex gap-2">
          <div className="relative shrink-0">
            <div 
              className="w-8 h-8 rounded-md border border-neutral-200 shadow-sm cursor-pointer"
              style={{ backgroundColor: value }}
              onClick={(e) => e.currentTarget.nextSibling.click()}
            />
            <input 
              type="color" 
              className="absolute opacity-0 pointer-events-none"
              value={value?.startsWith('#') && value.length === 7 ? value : "#000000"}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 text-[12px] px-2 py-1.5 bg-white border border-neutral-200 rounded-md focus:border-neutral-400 outline-none font-mono"
            placeholder="#000000"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="py-2">
      <label className="text-[11px] text-neutral-500 font-medium mb-1.5 block">{propKey}</label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-[12px] px-2 py-1.5 bg-white border border-neutral-200 rounded-md focus:border-neutral-400 outline-none"
      />
    </div>
  );
}
