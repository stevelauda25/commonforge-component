"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight, Sun, Moon, Eye } from "lucide-react";
import LayerPanel from "./LayerPanel";
import { Button as PodButton } from "pod-test-ui/button";
import { Checkbox as PodCheckbox } from "pod-test-ui/checkbox";
import { TextInput as PodTextInput } from "pod-test-ui/text-input";
import { SearchInput as PodSearchInput } from "pod-test-ui/search-input";
import { Switch as PodSwitch } from "pod-test-ui/switch";
import { Dropdown as PodDropdown } from "pod-test-ui/dropdown";
import { Badge as PodBadge } from "pod-test-ui/badges";
import { Tab as PodTab } from "pod-test-ui/tabs";
import { VARIANT_PROP_ALIAS } from "../../utils/variantAliases.js";

const POD_PREVIEW = {
  Button: PodButton,
  Checkbox: PodCheckbox,
  TextInput: PodTextInput,
  SearchInput: PodSearchInput,
  Switch: PodSwitch,
  Dropdown: PodDropdown,
  Badge: PodBadge,
  Tab: PodTab,
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
  Badge:       { scale: 1.05, padded: true },
  Tab:         { scale: 1, padded: true },
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
  // Components where synthetic `variant` aliases to a real prop with a
  // different name (e.g. Badge → color, Tab → tabType). Strip variant/size
  // and re-emit under the correct prop name.
  const alias = VARIANT_PROP_ALIAS[name];
  if (alias) {
    const { variant, size, ...rest } = props;
    return variant !== undefined ? { ...rest, [alias]: variant } : rest;
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

  // Variant prop aliasing — rename `variant` → real prop (e.g. Badge.color,
  // Tab.tabType) before serializing. Also strip the synthetic `size` if the
  // component doesn't accept it (Badge, Tab default to "default" size only).
  const alias = VARIANT_PROP_ALIAS[componentName];
  if (alias) {
    const { variant, size, ...kept } = props || {};
    const remapped = variant !== undefined ? { ...kept, [alias]: variant } : kept;
    return variantPropsToJsxRaw(componentName, remapped);
  }

  return variantPropsToJsxRaw(componentName, props);
}

function variantPropsToJsxRaw(componentName, props) {
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
      className="group relative w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-900 dark:hover:border-neutral-100 hover:shadow-sm focus:border-neutral-900 dark:focus:border-neutral-100 focus:outline-none transition-all cursor-pointer overflow-hidden"
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
    <div className="border-b border-neutral-100 dark:border-neutral-900 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-1.5 px-3 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-left transition-colors"
      >
        {open ? (
          <ChevronDown className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
        ) : (
          <ChevronRight className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
        )}
        <span className="text-[12px] font-semibold text-neutral-900 dark:text-neutral-100 flex-1">{name}</span>
        {hasVariants && (
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">{variantCount}</span>
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
            <div className="flex flex-col gap-1.5 pt-2 mt-1 border-t border-neutral-100 dark:border-neutral-800">
              <div className="text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-medium px-0.5">
                Examples
              </div>
              <div className="flex flex-wrap gap-1">
                {examples.map((ex) => (
                  <button
                    key={ex.label}
                    type="button"
                    onClick={() => onPick(name, { ...defaultProps, ...ex.props }, ex.code)}
                    className="text-[10px] px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 hover:border-neutral-900 dark:hover:border-neutral-100 hover:bg-neutral-900 dark:hover:bg-neutral-100 hover:text-white dark:hover:text-neutral-900 transition-colors"
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

export default function PodLibraryPanel({
  manifest,
  onAddPodNode,
  // Layers tab inputs — when these are wired the sidebar shows a Layers tab
  // that mirrors the on-canvas hierarchy and lets the user select / enter
  // groups from the sidebar.
  nodes = [],
  selectedNodeIds,
  editingGroupId = null,
  onSelectNode,
  onEnterGroup,
}) {
  // Default to dark previews since centernode itself runs dark by default —
  // shows the component in the theme it'll actually live in on the canvas.
  const [previewDark, setPreviewDark] = useState(true);
  // Active tab. "components" = spawn catalog (default); "layers" = on-canvas
  // node tree. Tabs share the panel chrome (header + footer) so context
  // doesn't reset between tabs.
  const [activeTab, setActiveTab] = useState("components");

  const handlePick = (componentName, props, overrideCode) => {
    // If example provides a composite code snippet (function component with state),
    // use it verbatim. Otherwise generate a single JSX trigger from props.
    const code = overrideCode || variantPropsToJsx(componentName, props);
    // Lock spawn-time mode onto the node — toggling sidebar later doesn't
    // mutate already-placed nodes.
    onAddPodNode({ componentName, code, props, dark: previewDark });
  };

  const count = manifest?.components?.length ?? 0;
  const showLayers = activeTab === "layers";

  return (
    <div className="w-[260px] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col shrink-0">
      {/* Tab bar — flush at top, no header. Preview-theme toggle is a
          per-tab control (Components only) so it lives in that tab's body,
          not here. */}
      <div className="flex items-stretch border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        {[
          { id: "components", label: "Components" },
          { id: "layers", label: "Layers" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 px-3 py-2.5 text-[11px] font-semibold transition-colors relative ${
              activeTab === t.id
                ? "text-neutral-900 dark:text-neutral-100"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            }`}
          >
            {t.label}
            {activeTab === t.id && (
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-neutral-900 dark:bg-neutral-100 rounded-t" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {showLayers ? (
          <LayerPanel
            nodes={nodes}
            selectedNodeIds={selectedNodeIds || new Set()}
            editingGroupId={editingGroupId}
            onSelect={onSelectNode || (() => {})}
            onEnterGroup={onEnterGroup || (() => {})}
          />
        ) : (
          <>
            {/* Preview-theme strip — lives INSIDE the Components tab body so
                its presence implies it only affects this tab's previews. Not
                in the tab nav (would look global) or any header (removed). */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/40">
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">
                <Eye className="w-3 h-3" />
                Preview
              </div>
              <div className="inline-flex rounded-md border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setPreviewDark(false)}
                  className={`px-2 py-1 flex items-center gap-1 text-[10px] font-medium transition-colors ${
                    !previewDark
                      ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                      : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                  aria-pressed={!previewDark}
                >
                  <Sun className="w-3 h-3" /> Light
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDark(true)}
                  className={`px-2 py-1 flex items-center gap-1 text-[10px] font-medium transition-colors ${
                    previewDark
                      ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                      : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                  aria-pressed={previewDark}
                >
                  <Moon className="w-3 h-3" /> Dark
                </button>
              </div>
            </div>
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
              <div className="p-4 text-[11px] text-neutral-500 dark:text-neutral-400">No POD components available.</div>
            )}
          </>
        )}
      </div>

      <div className="px-3 py-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-400 dark:text-neutral-500 shrink-0">
        {showLayers
          ? "double-click a group to enter"
          : <>from <span className="font-mono">pod-test-ui</span> · click to add</>}
      </div>
    </div>
  );
}
