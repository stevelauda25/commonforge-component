"use client";
import { useState } from "react";
import { ChevronRight, Sun, Moon, Eye } from "lucide-react";
import LayerPanel from "./LayerPanel";
import { Button as PodButton } from "cf-ui/button";
import { Checkbox as PodCheckbox } from "cf-ui/checkbox";
import { TextInput as PodTextInput } from "cf-ui/text-input";
import { SearchInput as PodSearchInput } from "cf-ui/search-input";
import { Switch as PodSwitch } from "cf-ui/switch";
import { Dropdown as PodDropdown } from "cf-ui/dropdown";
import { Badge as PodBadge } from "cf-ui/badges";
import { Tab as PodTab } from "cf-ui/tabs";
import { Radio as PodRadio } from "cf-ui/radio";
import { Tag as PodTag } from "cf-ui/tag";
import { ButtonGroup as PodButtonGroup } from "cf-ui/button-group";
import { VARIANT_PROP_ALIAS } from "../../utils/variantAliases.js";

// ButtonGroup composite — manifest examples use `quantity` to spawn N
// ButtonGroup.Item children. Default to 3 segments for the variant cell.
function ButtonGroupPreview({ quantity = 3, ...rest }) {
  const items = Array.from({ length: quantity });
  return (
    <PodButtonGroup {...rest}>
      {items.map((_, i) => (
        <PodButtonGroup.Item key={i} active={i === 0}>
          {`Item ${i + 1}`}
        </PodButtonGroup.Item>
      ))}
    </PodButtonGroup>
  );
}

const POD_PREVIEW = {
  Button: PodButton,
  Checkbox: PodCheckbox,
  TextInput: PodTextInput,
  SearchInput: PodSearchInput,
  Switch: PodSwitch,
  Dropdown: PodDropdown,
  Badge: PodBadge,
  Tab: PodTab,
  Radio: PodRadio,
  Tag: PodTag,
  ButtonGroup: ButtonGroupPreview,
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
  Radio:       { scale: 1, padded: true },
  Tag:         { scale: 1.05, padded: true },
  ButtonGroup: { scale: 0.85, padded: true },
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
  if (name === "Checkbox" || name === "Radio") {
    // Strip synthetic props (variant, size beyond what the primitive accepts).
    // Drop label/description when variant says they shouldn't render
    // (mirrors composite conditional logic).
    const { variant, label, description, ...rest } = props;
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
      className="group relative w-full rounded-md border border-cn-border-subtle bg-cn-elevated hover:border-cn-accent focus:border-cn-accent focus:outline-none cursor-pointer overflow-hidden cn-press"
      style={{
        transition: "border-color var(--cn-dur-snappy) var(--cn-ease-smooth), background-color var(--cn-dur-snappy) var(--cn-ease-smooth), box-shadow var(--cn-dur-normal) var(--cn-ease-out)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 0 0 1px var(--cn-accent-ring), 0 4px 16px -8px var(--cn-accent-ring)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {label && (
        <div className="absolute top-1.5 left-2 cn-mono pointer-events-none z-10 text-cn-text-muted group-hover:text-cn-accent" style={{ fontSize: "9px", transition: "color var(--cn-dur-snappy)" }}>
          {label}
        </div>
      )}
      {/* Scoped POD theme: when darkPreview, `.dark` class makes children of POD use dark-mode tokens. */}
      <div className={`${darkPreview ? "dark" : ""} px-3 py-4 min-h-[64px] flex items-center justify-center`} style={{ background: darkPreview ? "var(--cn-canvas)" : undefined }}>
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
    <div className="border-b border-cn-border-subtle last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-1.5 px-3 h-9 hover:bg-cn-elevated text-left cn-press"
        style={{ transition: "background-color var(--cn-dur-snappy)" }}
      >
        <span
          className="w-3 h-3 flex items-center justify-center text-cn-text-muted"
          style={{
            transition: "transform var(--cn-dur-snappy) var(--cn-ease-spring)",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          <ChevronRight className="w-3 h-3" />
        </span>
        <span className="cn-label-strong flex-1">{name}</span>
        {hasVariants && (
          <span className="cn-mono-meta">{variantCount}</span>
        )}
      </button>

      {open && (
        <div
          className="px-3 pb-3 pt-0 space-y-1.5 cn-anim-stagger"
          style={{ animationDuration: "var(--cn-dur-snappy)" }}
        >
          {hasVariants ? (
            variants.map((v) => {
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
            <div className="flex flex-col gap-1.5 pt-2 mt-1 border-t border-cn-border-subtle">
              <div className="cn-eyebrow px-0.5">Examples</div>
              <div className="flex flex-wrap gap-1">
                {examples.map((ex) => (
                  <button
                    key={ex.label}
                    type="button"
                    onClick={() => onPick(name, { ...defaultProps, ...ex.props }, ex.code)}
                    className="cn-btn cn-btn-outline cn-btn-sm"
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

export default function CfLibraryPanel({
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
  // Controlled-ish: parent ActivityBar can hand us a starting tab. We
  // keep local state too, so users can switch tabs within the panel
  // without round-tripping through the activity bar.
  initialTab = "components",
}) {
  // Default to dark previews since centernode itself runs dark by default —
  // shows the component in the theme it'll actually live in on the canvas.
  const [previewDark, setPreviewDark] = useState(true);
  // Active tab is now fully controlled by the parent ActivityBar — no
  // internal tab strip anymore. The prop is the source of truth.
  const activeTab = initialTab;

  const handlePick = (componentName, props, overrideCode) => {
    // If example provides a composite code snippet (function component with state),
    // use it verbatim. Otherwise generate a single JSX trigger from props.
    const code = overrideCode || variantPropsToJsx(componentName, props);
    // Lock spawn-time mode onto the node — toggling sidebar later doesn't
    // mutate already-placed nodes.
    onAddPodNode({ componentName, code, props, dark: previewDark });
  };

  // Tooltip is an interaction wrapper (focus/hover trigger), not a layout
  // primitive — excluded from the spawn-able library. Designers who want to
  // mock up an annotated tooltip can drop a static layout shape via Text
  // node + Badge, or wait for a dedicated TooltipLayout primitive.
  const INTERACTION_ONLY = new Set(["Tooltip"]);
  const visibleComponents = (manifest?.components || []).filter(
    (c) => !INTERACTION_ONLY.has(c.name),
  );
  const count = visibleComponents.length;
  const showLayers = activeTab === "layers";

  return (
    <div className="w-[272px] bg-cn-surface border-r border-cn-border-default flex flex-col shrink-0 min-h-0 h-full">
      {/* Panel header — single source of identity. The ActivityBar rail
          already owns "which panel". This row is just the title + a
          mono counter so the panel announces what's inside it. */}
      <div className="px-3 h-10 border-b border-cn-border-subtle shrink-0 flex items-center justify-between">
        <span className="cn-display flex items-center gap-2">
          {showLayers ? "Layers" : "Library"}
          <span className="cn-mono-meta">
            {showLayers
              ? `${nodes.filter((n) => !n.parent).length} root`
              : `${count} kit`}
          </span>
        </span>
        {showLayers && nodes.filter((n) => !n.parent).length > 0 && (
          <span className="cn-chip">
            {nodes.length} total
          </span>
        )}
      </div>

      <div
        key={activeTab}
        className="flex-1 overflow-y-auto cn-anim-fade"
        style={{ animationDuration: "var(--cn-dur-snappy)" }}
      >
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
            {/* Preview-theme strip — segmented control matching the rest
                of the inspector. Uses cn-segmented primitive. */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-cn-border-subtle">
              <div className="cn-eyebrow flex items-center gap-1.5">
                <Eye className="w-3 h-3" />
                Preview
              </div>
              <div className="cn-segmented">
                <button
                  type="button"
                  onClick={() => setPreviewDark(false)}
                  className={`flex items-center gap-1 ${!previewDark ? "is-active" : ""}`}
                  aria-pressed={!previewDark}
                >
                  <Sun className="w-3 h-3" /> Light
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDark(true)}
                  className={`flex items-center gap-1 ${previewDark ? "is-active" : ""}`}
                  aria-pressed={previewDark}
                >
                  <Moon className="w-3 h-3" /> Dark
                </button>
              </div>
            </div>
            {visibleComponents.map((c, i) => (
              <ComponentRow
                key={c.name}
                component={c}
                onPick={handlePick}
                defaultOpen={i === 0}
                darkPreview={previewDark}
              />
            ))}
            {count === 0 && (
              <div className="p-4 cn-caption">No POD components available.</div>
            )}
          </>
        )}
      </div>

      <div className="px-3 h-8 border-t border-cn-border-subtle shrink-0 flex items-center cn-mono-meta">
        {showLayers
          ? "double-click group → enter"
          : <>from <span className="text-cn-text-secondary">cf-ui</span> · click to add</>}
      </div>
    </div>
  );
}
