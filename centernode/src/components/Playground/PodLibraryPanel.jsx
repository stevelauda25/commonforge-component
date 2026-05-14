"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight, Package, Sun, Moon } from "lucide-react";
import { Button as PodButton } from "pod-test-ui/button";
import { Checkbox as PodCheckbox } from "pod-test-ui/checkbox";
import { TextInput as PodTextInput } from "pod-test-ui/text-input";
import { SearchInput as PodSearchInput } from "pod-test-ui/search-input";
import { Switch as PodSwitch } from "pod-test-ui/switch";
import { Dropdown as PodDropdown } from "pod-test-ui/dropdown";

const POD_PREVIEW = {
  Button: PodButton,
  Checkbox: PodCheckbox,
  TextInput: PodTextInput,
  SearchInput: PodSearchInput,
  Switch: PodSwitch,
  Dropdown: PodDropdown,
};

/**
 * Per-component preview hint:
 *   - `width`        — fixed preview width if component is naturally wide (TextInput, SearchInput).
 *                       Omit to let it size naturally.
 *   - `scale`        — visual scale (1 = real size; lower if component is way larger than sidebar).
 *   - `padded`       — extra outer padding so tiny components (Switch) don't feel cramped.
 */
const PREVIEW_HINTS = {
  Button:      { scale: 1 },
  Checkbox:    { scale: 1, padded: true },
  TextInput:   { width: 200, scale: 0.9 },
  SearchInput: { width: 200, scale: 0.9 },
  Switch:      { scale: 1.05, padded: true },
  Dropdown:    { width: 200, scale: 0.9 },
};

// Per-component preview adornments — sometimes the raw defaultProps don't
// visually differentiate variants (e.g. Dropdown tags with empty array looks
// identical to default). Inject sample data here so the sidebar shows the
// variant's distinguishing visual.
function decorateForPreview(name, props) {
  if (name === "Dropdown" && props.variant === "tags" && !props.tags) {
    return {
      ...props,
      tags: [
        { value: "a", label: "LABEL" },
        { value: "b", label: "LABEL" },
      ],
    };
  }
  if (name === "Checkbox") {
    // Strip synthetic props (variant, size) — Checkbox primitive doesn't
    // accept them. Also drop label/description when variant says they
    // shouldn't render (mirrors composite conditional logic).
    const { variant, size, label, description, ...rest } = props;
    return {
      ...rest,
      ...(variant !== "only" && label ? { label } : {}),
      ...(variant === "withDescription" && description ? { description } : {}),
    };
  }
  return props;
}

function MiniPreview({ name, props }) {
  const Comp = POD_PREVIEW[name];
  if (!Comp) return null;
  const hint = PREVIEW_HINTS[name] || { scale: 1 };
  const decorated = decorateForPreview(name, props);
  try {
    return (
      <div
        className={`pointer-events-none flex items-center justify-center w-full overflow-hidden ${hint.padded ? "py-1.5" : ""}`}
      >
        <div
          style={{
            transform: hint.scale !== 1 ? `scale(${hint.scale})` : undefined,
            transformOrigin: "center",
            width: hint.width || undefined,
          }}
        >
          <Comp {...decorated} />
        </div>
      </div>
    );
  } catch {
    return null;
  }
}

function variantPropsToJsx(componentName, props) {
  // Components with SYNTHETIC variants (no real `variant` API prop) spawn
  // as a function-component composite so the synthetic prop lives in code
  // and bidirectional sync works. See CENTERNODE-RULES.md "Variant prop rule".
  if (componentName === "Checkbox") {
    return buildCheckboxComposite(props);
  }

  const { children, ...rest } = props || {};
  // Skip only empty strings — they'd render ugly attributes like `label=""`.
  // ALL other prop values emit (including `false`) so the props panel
  // detects them and the dev sees the full API surface.
  const attrs = Object.entries(rest)
    .filter(([, v]) => !(typeof v === "string" && v === ""))
    .map(([k, v]) => {
      if (typeof v === "boolean") return `${k}={${v}}`;
      if (typeof v === "string") return `${k}="${v}"`;
      return `${k}={${JSON.stringify(v)}}`;
    })
    .join(" ");
  const inner = children == null ? "" : String(children);
  if (!inner) {
    return `<${componentName}${attrs ? ` ${attrs}` : ""} />`;
  }
  return `<${componentName}${attrs ? ` ${attrs}` : ""}>${inner}</${componentName}>`;
}

/**
 * Composite spawn for Checkbox — synthetic `variant` prop lives in code.
 * Pattern: function wrapper with destructured params + `variantStyles` enum
 * hint object. Parser picks these up so Props panel shows all editable
 * controls (variant pill, checked toggle, label/description text inputs).
 * See CENTERNODE-RULES.md.
 */
function buildCheckboxComposite(props) {
  const v = props || {};
  const variant = ["only", "withLabel", "withDescription"].includes(v.variant)
    ? v.variant
    : "withLabel";
  const checked = !!v.checked;
  const label = v.label ?? "I agree to the terms";
  const description = v.description ?? "Daily digest at 8am.";
  const disabled = !!v.disabled;

  return `function CheckboxExample({
  variant = "${variant}",
  checked = ${checked},
  label = "${label}",
  description = "${description}",
  disabled = ${disabled},
}) {
  // variantStyles — enum hint picked up by Props panel as a pill selector.
  const variantStyles = { only: 'checkbox only', withLabel: 'with label', withDescription: 'with description' };

  const [c, setC] = useState(checked);

  return (
    <Checkbox
      checked={c}
      onCheckedChange={setC}
      disabled={disabled}
      label={variant !== 'only' ? label : undefined}
      description={variant === 'withDescription' ? description : undefined}
    />
  );
}`;
}

function VariantCard({ name, label, props, onPick, title, darkPreview }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onPick(name, props)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPick(name, props);
        }
      }}
      title={title}
      className="group relative w-full rounded-md border border-neutral-200 bg-white hover:border-neutral-900 hover:shadow-sm focus:border-neutral-900 focus:outline-none transition-all cursor-pointer overflow-hidden"
    >
      {label && (
        <div className={`absolute top-1.5 left-2 text-[9px] uppercase tracking-wider font-medium pointer-events-none z-10 ${
          darkPreview ? "text-neutral-500 group-hover:text-neutral-300" : "text-neutral-400 group-hover:text-neutral-600"
        }`}>
          {label}
        </div>
      )}
      {/* Scoped POD theme: when darkPreview, `.dark` class makes children of POD use dark-mode tokens.
          bg-canvas flips automatically because it reads --color-bg-canvas which has .dark override. */}
      <div className={`${darkPreview ? "dark bg-canvas" : "bg-gradient-to-b from-neutral-50/40 to-white"} px-3 py-4 min-h-[64px] flex items-center justify-center`}>
        <MiniPreview name={name} props={props} />
      </div>
    </div>
  );
}

function ComponentRow({ component, onPick, defaultOpen = false, darkPreview = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const { name, variants, sizes, defaultProps, examples } = component;

  const defaultSize = sizes.includes("md")
    ? "md"
    : sizes[Math.min(Math.floor(sizes.length / 2), sizes.length - 1)];

  const hasVariants = variants.length > 1;
  const variantCount = variants.length;

  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-1.5 px-3 py-2.5 hover:bg-neutral-50 text-left transition-colors"
      >
        {open ? (
          <ChevronDown className="w-3 h-3 text-neutral-500" />
        ) : (
          <ChevronRight className="w-3 h-3 text-neutral-500" />
        )}
        <span className="text-[12px] font-semibold text-neutral-900 flex-1">{name}</span>
        {hasVariants && (
          <span className="text-[10px] text-neutral-400 font-mono">{variantCount}</span>
        )}
      </button>

      {open && (
        <div className="px-3 pb-3 pt-0 space-y-2">
          {hasVariants ? (
            variants.map((v) => {
              // variantPresets (synthetic variant) → overlay onto defaultProps
              //   AND inject `variant: v` so the composite spawn reads it.
              // No variantPresets (real variant prop) → just inject `variant: v`.
              const preset = component.variantPresets?.[v];
              const variantProps = preset
                ? { ...defaultProps, ...preset, variant: v, size: defaultSize }
                : { ...defaultProps, variant: v, size: defaultSize };
              return (
                <VariantCard
                  key={v}
                  name={name}
                  label={v}
                  props={variantProps}
                  onPick={onPick}
                  title={`Add ${name} (${v})`}
                  darkPreview={darkPreview}
                />
              );
            })
          ) : (
            <VariantCard
              name={name}
              props={{ ...defaultProps, size: defaultSize }}
              onPick={onPick}
              title={`Add ${name}`}
              darkPreview={darkPreview}
            />
          )}

          {examples && examples.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-2 mt-1 border-t border-neutral-100">
              <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-medium px-0.5">
                Examples
              </div>
              <div className="flex flex-wrap gap-1">
                {examples.map((ex) => (
                  <button
                    key={ex.label}
                    type="button"
                    onClick={() => onPick(name, { ...defaultProps, ...ex.props }, ex.code)}
                    className="text-[10px] px-2 py-1 rounded-md border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
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
  const [previewDark, setPreviewDark] = useState(false);

  const handlePick = (componentName, props, overrideCode) => {
    // If example provides a composite code snippet (function component with state),
    // use it verbatim. Otherwise generate a single JSX trigger from props.
    const code = overrideCode || variantPropsToJsx(componentName, props);
    // Lock spawn-time mode onto the node — toggling sidebar later doesn't
    // mutate already-placed nodes.
    onAddPodNode({ componentName, code, props, dark: previewDark });
  };

  const count = manifest?.components?.length ?? 0;

  return (
    <div className="w-[260px] bg-white border-r border-neutral-200 flex flex-col shrink-0">
      <div className="flex items-center gap-2 px-3 py-3 border-b border-neutral-200 shrink-0">
        <div className="w-6 h-6 rounded-md bg-neutral-900 text-white flex items-center justify-center shrink-0">
          <Package className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-semibold text-neutral-900 leading-tight">POD Components</div>
          <div className="text-[10px] text-neutral-500 leading-tight mt-0.5">
            {count} component{count === 1 ? "" : "s"} · v{manifest?.version ?? "?"}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPreviewDark((v) => !v)}
          title={`Preview mode: ${previewDark ? "dark" : "light"} (catalog only — canvas unaffected)`}
          aria-label={`Switch preview to ${previewDark ? "light" : "dark"} mode`}
          className={`shrink-0 w-7 h-7 rounded-md border flex items-center justify-center transition-colors ${
            previewDark
              ? "bg-neutral-900 border-neutral-900 text-amber-300 hover:bg-neutral-800"
              : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
          }`}
        >
          {previewDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {manifest?.components?.map((c, i) => (
          <ComponentRow
            key={c.name}
            component={c}
            onPick={handlePick}
            defaultOpen={i === 0}
            darkPreview={previewDark}
          />
        ))}
        {count === 0 && (
          <div className="p-4 text-[11px] text-neutral-500">No POD components available.</div>
        )}
      </div>

      <div className="px-3 py-2 border-t border-neutral-100 text-[10px] text-neutral-400 shrink-0">
        from <span className="font-mono">pod-test-ui</span> · click to add
      </div>
    </div>
  );
}
