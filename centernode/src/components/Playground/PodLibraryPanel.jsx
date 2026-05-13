"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight, Package } from "lucide-react";
import { Button as PodButton } from "pod-test-ui/button";
import { Checkbox as PodCheckbox } from "pod-test-ui/checkbox";
import { TextInput as PodTextInput } from "pod-test-ui/text-input";

const POD_PREVIEW = { Button: PodButton, Checkbox: PodCheckbox, TextInput: PodTextInput };

function MiniPreview({ name, props }) {
  const Comp = POD_PREVIEW[name];
  if (!Comp) return null;
  try {
    // Force preview scale-down so even `lg` size fits in the narrow sidebar
    return (
      <div className="pointer-events-none flex items-center justify-center w-full overflow-hidden">
        <div style={{ transform: "scale(0.75)", transformOrigin: "left center" }}>
          <Comp {...props} />
        </div>
      </div>
    );
  } catch {
    return null;
  }
}

/**
 * POD Library Panel — left sidebar that surfaces npm-installed POD components.
 * Reads canvasManifest from pod-test-ui (single source of truth).
 *
 * UX: each component expands to a variant × size matrix (Figma-style).
 *     Click a cell → spawn a new canvas node with that variant pre-configured.
 */

function variantPropsToJsx(componentName, props) {
  const { children, ...rest } = props || {};
  const attrs = Object.entries(rest)
    .map(([k, v]) => {
      if (typeof v === "boolean") return v ? k : null;
      if (typeof v === "string") return `${k}="${v}"`;
      return `${k}={${JSON.stringify(v)}}`;
    })
    .filter(Boolean)
    .join(" ");
  const inner = children == null ? "" : String(children);
  if (!inner && rest.placeholder !== undefined) {
    // Self-closing for inputs / inputs-like components with no children
    return `<${componentName} ${attrs} />`;
  }
  return `<${componentName}${attrs ? ` ${attrs}` : ""}>${inner}</${componentName}>`;
}

function ComponentRow({ component, onPick }) {
  const [open, setOpen] = useState(true);
  const { name, variants, sizes, defaultProps, examples } = component;

  // Pick a sensible default size: prefer "md" if available, else middle of list.
  const defaultSize = sizes.includes("md")
    ? "md"
    : sizes[Math.min(Math.floor(sizes.length / 2), sizes.length - 1)];

  const hasVariants = variants.length > 1;

  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-1.5 px-3 py-2 hover:bg-neutral-50 text-left transition-colors"
      >
        {open ? <ChevronDown className="w-3 h-3 text-neutral-500" /> : <ChevronRight className="w-3 h-3 text-neutral-500" />}
        <span className="text-[12px] font-semibold text-neutral-900 flex-1">{name}</span>
        <span className="text-[10px] text-neutral-400">{variants.length} {variants.length === 1 ? "variant" : "variants"}</span>
      </button>

      {open && (
        <div className="px-3 pb-3 pt-0.5 space-y-2">
          {hasVariants ? (
            variants.map((v) => (
              <div
                key={v}
                role="button"
                tabIndex={0}
                onClick={() => onPick(name, { ...defaultProps, variant: v, size: defaultSize })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onPick(name, { ...defaultProps, variant: v, size: defaultSize });
                  }
                }}
                className="w-full flex items-center gap-3 rounded-md bg-neutral-50/40 border border-neutral-200 hover:border-neutral-900 hover:bg-white focus:border-neutral-900 focus:outline-none transition-colors px-2.5 py-2 text-left cursor-pointer"
                title={`Add ${name} (${v})`}
              >
                <div className="flex-1 min-w-0">
                  <MiniPreview name={name} props={{ ...defaultProps, variant: v, size: defaultSize }} />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium shrink-0">{v}</span>
              </div>
            ))
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={() => onPick(name, { ...defaultProps, size: defaultSize })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPick(name, { ...defaultProps, size: defaultSize });
                }
              }}
              className="w-full rounded-md bg-neutral-50/40 border border-neutral-200 hover:border-neutral-900 hover:bg-white focus:border-neutral-900 focus:outline-none transition-colors px-2.5 py-2 cursor-pointer"
              title={`Add ${name}`}
            >
              <MiniPreview name={name} props={{ ...defaultProps, size: defaultSize }} />
            </div>
          )}

          {examples && examples.length > 0 && (
            <div className="flex flex-col gap-1 pt-1 mt-1 border-t border-neutral-100">
              <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">Examples</div>
              <div className="flex flex-wrap gap-1">
                {examples.map((ex) => (
                  <button
                    key={ex.label}
                    type="button"
                    onClick={() => onPick(name, { ...defaultProps, ...ex.props })}
                    className="text-[10px] px-1.5 py-0.5 rounded border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PodLibraryPanel({ manifest, onAddPodNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const handlePick = (componentName, props) => {
    const code = variantPropsToJsx(componentName, props);
    onAddPodNode({ componentName, code, props });
  };

  return (
    <div className="w-[240px] bg-white border-r border-neutral-200 flex flex-col shrink-0">
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="flex items-center gap-2 px-3 py-2.5 border-b border-neutral-200 hover:bg-neutral-50 transition-colors text-left"
      >
        <Package className="w-3.5 h-3.5 text-neutral-600" />
        <span className="text-[12px] font-semibold text-neutral-900 flex-1">POD Components</span>
        <span className="text-[10px] font-mono text-neutral-400">v{manifest?.version ?? "?"}</span>
      </button>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto">
          {manifest?.components?.map((c) => (
            <ComponentRow key={c.name} component={c} onPick={handlePick} />
          ))}
          {(!manifest?.components || manifest.components.length === 0) && (
            <div className="p-4 text-[11px] text-neutral-500">No POD components available.</div>
          )}
        </div>
      )}

      <div className="px-3 py-2 border-t border-neutral-100 text-[10px] text-neutral-400 font-mono">
        from pod-test-ui · drag to canvas
      </div>
    </div>
  );
}
