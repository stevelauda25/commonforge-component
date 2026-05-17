"use client";
import React, { useRef } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Type,
  Trash2,
  Copy,
} from "lucide-react";
import FontPicker from "./FontPicker";

const WEIGHTS = [
  { value: 100, label: "Thin" },
  { value: 200, label: "Extra Light" },
  { value: 300, label: "Light" },
  { value: 400, label: "Regular" },
  { value: 500, label: "Medium" },
  { value: 600, label: "Semi Bold" },
  { value: 700, label: "Bold" },
  { value: 800, label: "Extra Bold" },
  { value: 900, label: "Black" },
];

function ColorField({ value, onChange }) {
  const colorRef = useRef(null);
  return (
    <div className="flex items-center h-7 bg-transparent border border-cn-border-subtle hover:border-cn-border-default focus-within:border-cn-accent rounded-md transition-colors">
      <button
        type="button"
        onClick={() => colorRef.current?.click()}
        className="flex items-center justify-center w-7 h-full shrink-0 cursor-pointer text-cn-text-muted hover:text-cn-text-primary transition-colors"
        title="Pick colour"
      >
        <span
          className="w-3.5 h-3.5 rounded-[3px] border border-cn-border-default shrink-0"
          style={{ background: value }}
        />
      </button>
      <input
        ref={colorRef}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-w-0 w-full h-full bg-transparent pr-2 cn-mono text-[11px] outline-none tabular-nums text-cn-text-primary"
        spellCheck={false}
      />
    </div>
  );
}

function NumField({ value, onChange, label, min, max, step = 1 }) {
  return (
    <div className="flex items-center h-7 bg-transparent border border-cn-border-subtle hover:border-cn-border-default focus-within:border-cn-accent rounded-md transition-colors px-2 gap-1.5">
      <span className="cn-mono-meta shrink-0">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          if (Number.isFinite(n)) onChange(n);
        }}
        className="flex-1 min-w-0 bg-transparent text-[11px] outline-none tabular-nums text-cn-text-primary text-right"
      />
    </div>
  );
}

function ToggleButton({ active, onClick, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex items-center justify-center h-7 flex-1 rounded-md border transition-colors ${
        active
          ? "border-cn-accent text-cn-accent bg-cn-accent-soft"
          : "border-cn-border-subtle text-cn-text-muted hover:text-cn-text-primary hover:border-cn-border-default"
      }`}
    >
      {children}
    </button>
  );
}

export default function TextInspector({ node, onUpdate, onDelete, onDuplicate }) {
  const update = (patch) => onUpdate(node.id, patch);
  const fontSize = node.fontSize ?? 16;
  const fontWeight = node.fontWeight ?? 400;
  const lineHeight = node.lineHeight ?? 1.4;
  const letterSpacing = node.letterSpacing ?? 0;
  const align = node.textAlign || "left";
  const italic = node.fontStyle === "italic";

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      <div className="px-4 py-3 flex flex-col gap-1 shrink-0">
        <div className="flex items-center gap-2">
          <Type className="w-3 h-3 text-cn-accent" />
          <input
            type="text"
            value={node.name || ""}
            onChange={(e) => update({ name: e.target.value })}
            className="flex-1 min-w-0 bg-transparent cn-label-strong outline-none"
            spellCheck={false}
          />
        </div>
        <div className="cn-mono-meta">Text node</div>
      </div>

      <div className="cn-divider mx-4" />

      <div className="px-4 py-3 flex flex-col gap-3">
        <div>
          <div className="cn-eyebrow mb-2">Content</div>
          <textarea
            value={node.content || ""}
            onChange={(e) => update({ content: e.target.value })}
            rows={3}
            spellCheck={false}
            className="w-full bg-transparent border border-cn-border-subtle hover:border-cn-border-default focus:border-cn-accent rounded-md px-2 py-1.5 text-[11px] outline-none text-cn-text-primary resize-y"
          />
        </div>

        <div>
          <div className="cn-eyebrow mb-2">Typography</div>
          <div className="flex flex-col gap-2">
            <FontPicker
              value={node.fontFamily}
              onChange={(family) => update({ fontFamily: family })}
            />
            <div className="grid grid-cols-2 gap-2">
              <NumField
                label="SIZE"
                value={fontSize}
                min={6}
                max={400}
                step={1}
                onChange={(v) => update({ fontSize: v })}
              />
              <select
                value={fontWeight}
                onChange={(e) => update({ fontWeight: parseInt(e.target.value, 10) })}
                className="h-7 bg-transparent border border-cn-border-subtle hover:border-cn-border-default focus:border-cn-accent rounded-md px-2 text-[11px] outline-none text-cn-text-primary appearance-none cursor-pointer"
              >
                {WEIGHTS.map((w) => (
                  <option key={w.value} value={w.value} style={{ background: "var(--cn-surface)" }}>
                    {w.label} ({w.value})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <NumField
                label="LH"
                value={lineHeight}
                min={0.5}
                max={4}
                step={0.05}
                onChange={(v) => update({ lineHeight: v })}
              />
              <NumField
                label="LS"
                value={letterSpacing}
                min={-10}
                max={40}
                step={0.1}
                onChange={(v) => update({ letterSpacing: v })}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="cn-eyebrow mb-2">Style</div>
          <div className="flex items-center gap-1.5">
            <ToggleButton
              active={fontWeight >= 600}
              onClick={() => update({ fontWeight: fontWeight >= 600 ? 400 : 700 })}
              title="Bold"
            >
              <Bold className="w-3 h-3" />
            </ToggleButton>
            <ToggleButton
              active={italic}
              onClick={() => update({ fontStyle: italic ? "normal" : "italic" })}
              title="Italic"
            >
              <Italic className="w-3 h-3" />
            </ToggleButton>
            <div className="cn-divider-vert mx-1" />
            <ToggleButton
              active={align === "left"}
              onClick={() => update({ textAlign: "left" })}
              title="Align left"
            >
              <AlignLeft className="w-3 h-3" />
            </ToggleButton>
            <ToggleButton
              active={align === "center"}
              onClick={() => update({ textAlign: "center" })}
              title="Align center"
            >
              <AlignCenter className="w-3 h-3" />
            </ToggleButton>
            <ToggleButton
              active={align === "right"}
              onClick={() => update({ textAlign: "right" })}
              title="Align right"
            >
              <AlignRight className="w-3 h-3" />
            </ToggleButton>
          </div>
        </div>

        <div>
          <div className="cn-eyebrow mb-2">Color</div>
          <ColorField
            value={node.color || "#fafafa"}
            onChange={(v) => update({ color: v })}
          />
        </div>
      </div>

      <div className="mt-auto border-t border-cn-border-subtle p-2 shrink-0 grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={() => onDuplicate(node.id)}
          className="cn-btn cn-btn-outline cn-btn-sm"
        >
          <Copy className="w-3 h-3" />
          Duplicate
        </button>
        <button
          type="button"
          onClick={() => onDelete(node.id)}
          className="cn-btn cn-btn-outline cn-btn-sm"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </div>
    </div>
  );
}
