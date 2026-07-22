"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AccountSwitcher: () => AccountSwitcher,
  Avatar: () => Avatar,
  Badge: () => Badge,
  Breadcrumb: () => Breadcrumb,
  Button: () => Button,
  CHART_TOOLTIP_SHADOW: () => CHART_TOOLTIP_SHADOW,
  ChartTooltip: () => ChartTooltip,
  Checkbox: () => Checkbox,
  DropZone: () => DropZone,
  EmptyState: () => EmptyState,
  FileList: () => FileList,
  GanttBar: () => GanttBar,
  Input: () => Input,
  KpiCard: () => KpiCard,
  Legend: () => Legend,
  ListBase: () => ListBase,
  LoadingSpinner: () => LoadingSpinner,
  NavItem: () => NavItem,
  NavSection: () => NavSection,
  ProgressBar: () => ProgressBar,
  ProgressBarBase: () => ProgressBarBase,
  ProgressRing: () => ProgressRing,
  ProgressValueBar: () => ProgressValueBar,
  Radio: () => Radio,
  SearchField: () => SearchField,
  SegmentedButton: () => SegmentedButton,
  Separator: () => Separator,
  SkillLevel: () => SkillLevel,
  Slider: () => Slider,
  Switch: () => Switch,
  Tag: () => Tag,
  TextArea: () => TextArea,
  TextInput: () => TextInput,
  Textarea: () => Textarea,
  Toast: () => Toast,
  Tooltip: () => Tooltip,
  buttonVariants: () => buttonVariants,
  cn: () => cn
});
module.exports = __toCommonJS(index_exports);

// src/button/button.tsx
var import_react = require("react");
var import_lucide_react = require("lucide-react");
var import_class_variance_authority = require("class-variance-authority");

// src/lib/cn.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/button/button.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var BUTTON_SHADOW = "shadow-[0_4px_8px_-4px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1),inset_0_0.5px_1px_0_rgba(255,255,255,0.25)]";
var buttonVariants = (0, import_class_variance_authority.cva)(
  [
    "group inline-flex items-center justify-center rounded-[6px] font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25",
    "disabled:pointer-events-none"
  ],
  {
    variants: {
      variant: {
        primary: cn(
          "text-[#FFFFFF]",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#C0180C_0%,#C0180C_100%)]",
          BUTTON_SHADOW,
          "hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#C0180C_0%,#C0180C_100%)] hover:text-white/80",
          "active:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#C0180C_0%,#C0180C_100%)]",
          "[&:disabled:not([data-loading=true])]:bg-[#F9766C] [&:disabled:not([data-loading=true])]:text-white/50 [&:disabled:not([data-loading=true])]:shadow-none",
          "[&:disabled:not([data-loading=true])]:shadow-[0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1)]"
        ),
        // Backwards-compatible alias for the previous "default" variant.
        default: cn(
          "text-[#FFFFFF]",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#C0180C_0%,#C0180C_100%)]",
          BUTTON_SHADOW,
          "hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#C0180C_0%,#C0180C_100%)] hover:text-white/80",
          "active:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#C0180C_0%,#C0180C_100%)]",
          "[&:disabled:not([data-loading=true])]:bg-[#F9766C] [&:disabled:not([data-loading=true])]:text-white/50 [&:disabled:not([data-loading=true])]:shadow-none",
          "[&:disabled:not([data-loading=true])]:shadow-[0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1)]"
        ),
        danger: cn(
          "text-[#FFFFFF]",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)]",
          BUTTON_SHADOW,
          "hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)] hover:text-white/80",
          "active:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)]",
          "[&:disabled:not([data-loading=true])]:bg-[#F65B68] [&:disabled:not([data-loading=true])]:text-white/50 [&:disabled:not([data-loading=true])]:shadow-none",
          "[&:disabled:not([data-loading=true])]:shadow-[0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1)]"
        ),
        // Backwards-compatible alias for the previous "destructive" variant.
        destructive: cn(
          "text-[#FFFFFF]",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)]",
          BUTTON_SHADOW,
          "hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)] hover:text-white/80",
          "active:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)]",
          "[&:disabled:not([data-loading=true])]:bg-[#F65B68] [&:disabled:not([data-loading=true])]:text-white/50 [&:disabled:not([data-loading=true])]:shadow-none",
          "[&:disabled:not([data-loading=true])]:shadow-[0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1)]"
        ),
        secondary: cn(
          "border-[0.5px] border-white/10 bg-white text-primary",
          BUTTON_SHADOW,
          "hover:bg-[#F5F5F5] hover:text-primary/80",
          "active:bg-[#F0F0F0] active:text-primary/60",
          "[&:disabled:not([data-loading=true])]:bg-[#E0E0E0] [&:disabled:not([data-loading=true])]:text-primary/30",
          "[&:disabled:not([data-loading=true])]:shadow-[0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1)]"
        ),
        outline: cn(
          "border border-[#8F8F8F] bg-white text-primary",
          "hover:border-[#666666] hover:bg-[#F5F5F5] hover:text-primary/80",
          "active:border-[#666666] active:bg-[#F0F0F0] active:text-primary/60",
          "[&:disabled:not([data-loading=true])]:border-[#C2C2C2] [&:disabled:not([data-loading=true])]:bg-[#E0E0E0] [&:disabled:not([data-loading=true])]:text-primary/30"
        ),
        ghost: cn(
          "bg-transparent text-[#525252]",
          "hover:bg-[#F5F5F5] hover:text-primary/80",
          "active:bg-[#F0F0F0] active:text-primary/60",
          "[&:disabled:not([data-loading=true])]:text-primary/30"
        ),
        inverse: cn(
          "border border-white/10 text-white",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#26201C_0%,#26201C_100%)]",
          BUTTON_SHADOW,
          "hover:text-white/80",
          "active:text-white/60",
          "[&:disabled:not([data-loading=true])]:bg-[#26201C] [&:disabled:not([data-loading=true])]:text-white/30 [&:disabled:not([data-loading=true])]:shadow-none",
          "[&:disabled:not([data-loading=true])]:shadow-[0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1)]"
        )
      },
      size: {
        xs: "h-[27px] gap-2 px-2 py-1.5 text-caption leading-caption",
        sm: "h-9 gap-2 px-3 py-2.5 text-xs leading-4",
        md: "h-11 gap-2 px-4 py-3 text-sm leading-5",
        default: "h-11 gap-2 px-4 py-3 text-sm leading-5",
        lg: "h-14 gap-2 px-6 py-4 text-base leading-6"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);
var iconSizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  default: "w-5 h-5",
  lg: "w-6 h-6"
};
var Button = (0, import_react.forwardRef)(
  ({
    className,
    variant,
    size,
    leftIcon,
    rightIcon,
    loading = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;
    const resolvedVariant = variant ?? "primary";
    const isLightText = resolvedVariant === "primary" || resolvedVariant === "default" || resolvedVariant === "danger" || resolvedVariant === "destructive" || resolvedVariant === "inverse";
    const dimOnHover = resolvedVariant === "primary" || resolvedVariant === "default" ? "group-hover:opacity-80" : void 0;
    const dimWrapper = isDisabled && !["secondary", "ghost", "primary", "default", "danger", "destructive", "inverse", "outline"].includes(variant ?? "") ? "opacity-50" : dimOnHover;
    const iconSize = iconSizes[size ?? "md"];
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        ref,
        type: "button",
        className: cn(buttonVariants({ variant, size }), className),
        disabled: isDisabled,
        "aria-busy": loading || void 0,
        "data-loading": loading || void 0,
        ...props,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "span",
          {
            className: cn(
              "inline-flex items-center justify-center gap-2",
              dimWrapper
            ),
            children: [
              loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("flex shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full", iconSize), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.LoaderCircle, { "aria-hidden": "true", className: "animate-spin motion-reduce:animate-none" }) }) : leftIcon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("flex shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full", iconSize), children: leftIcon }) : null,
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "span",
                {
                  className: cn(
                    isLightText && "text-[#FFFFFF] drop-shadow-[0_4px_2px_rgba(0,0,0,0.08)]",
                    disabled && !loading && (resolvedVariant === "primary" || resolvedVariant === "default") && "text-white/50 drop-shadow-none",
                    disabled && !loading && (resolvedVariant === "danger" || resolvedVariant === "destructive") && "text-white/50 drop-shadow-none",
                    disabled && !loading && resolvedVariant === "inverse" && "text-white/30 drop-shadow-none"
                  ),
                  children
                }
              ),
              rightIcon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("flex shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full", iconSize), children: rightIcon })
            ]
          }
        )
      }
    );
  }
);
Button.displayName = "Button";

// src/badge/badge.tsx
var import_class_variance_authority2 = require("class-variance-authority");
var import_jsx_runtime2 = require("react/jsx-runtime");
var badge = (0, import_class_variance_authority2.cva)(
  "inline-flex items-center gap-1 whitespace-nowrap rounded-[4px] border-[0.5px] border-solid font-medium leading-[1.3]",
  {
    variants: {
      variant: {
        success: "border-green-200 bg-green-25 text-green-500",
        error: "border-red-200 bg-red-25 text-red-500",
        // Backwards-compatible alias for the previous "destructive" variant.
        destructive: "border-red-200 bg-red-25 text-red-500",
        warning: "border-amber-200 bg-amber-25 text-amber-500",
        neutral: "border-[#CFC7BC] bg-[#F6F4F1] text-[#525252]",
        // Backwards-compatible alias for the previous "default" variant.
        default: "border-[#CFC7BC] bg-[#F6F4F1] text-[#525252]",
        outline: "border-neutral-300 bg-surface text-foreground",
        purple: "border-[#BC97F7] bg-[#F7F1FF] text-[#7635D9]"
      },
      size: {
        sm: "px-1.5 py-1 text-[10px]",
        md: "px-2 py-1 text-xs"
      }
    },
    defaultVariants: { variant: "neutral", size: "sm" }
  }
);
function Badge({ variant, size, dot, icon, children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: cn(badge({ variant, size }), className), children: [
    icon != null && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "flex shrink-0 items-center", children: icon }),
    dot && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "size-1.5 shrink-0 rounded-full bg-current", "aria-hidden": true }),
    children
  ] });
}

// src/checkbox/checkbox.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var SIZES = {
  small: { box: "size-3", radius: "rounded-[3px]", check: "size-2" },
  medium: { box: "size-4", radius: "rounded-[4px]", check: "size-[10px]" },
  large: { box: "size-5", radius: "rounded-[5px]", check: "size-[13px]" }
};
function Checkbox({
  checked = false,
  size = "medium",
  disabled = false,
  className,
  onCheckedChange,
  onClick,
  ...props
}) {
  const s = SIZES[size];
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "button",
    {
      type: "button",
      role: "checkbox",
      "aria-checked": checked,
      disabled,
      onClick: (event) => {
        onCheckedChange?.(!checked);
        onClick?.(event);
      },
      className: cn(
        "inline-flex shrink-0 items-center justify-center border outline-none focus-visible:ring-2 focus-visible:ring-[#CFC7BC] motion-safe:transition-colors motion-reduce:transition-none",
        s.box,
        s.radius,
        checked ? "border-transparent bg-[#2b2b2b] text-white" : "border-[#b8b8b8] bg-white",
        !disabled && !checked && "hover:border-[#000000]",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className
      ),
      ...props,
      children: checked && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("svg", { viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", className: s.check, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "path",
        {
          d: "M4 8.5L6.75 11.25L12 5",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      ) })
    }
  );
}

// src/switch/switch.tsx
var import_react2 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
function Switch({
  size = "md",
  state = "default",
  checked,
  defaultChecked = false,
  disabled,
  onCheckedChange,
  className,
  ...props
}) {
  const [internalChecked, setInternalChecked] = (0, import_react2.useState)(defaultChecked);
  const isChecked = checked ?? internalChecked;
  const isSmall = size === "sm";
  function toggle() {
    if (disabled) return;
    const next = !isChecked;
    if (checked === void 0) setInternalChecked(next);
    onCheckedChange?.(next);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "button",
    {
      ...props,
      type: props.type ?? "button",
      role: "switch",
      "aria-checked": isChecked,
      disabled,
      onClick: toggle,
      className: cn(
        "relative inline-flex shrink-0 items-center rounded-full border-[0.5px] border-white/5 p-0.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
        isSmall ? "h-5 w-9" : "h-6 w-11",
        isChecked ? cn("bg-green-600 hover:bg-green-800", state === "hover" && "bg-green-800") : cn("border-black/10 bg-[#F5F5F5] hover:bg-[#EBEBEB]", state === "hover" && "bg-[#EBEBEB]"),
        disabled && "cursor-not-allowed border-black/5 bg-[#F5F5F5] hover:bg-[#F5F5F5]",
        className
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "span",
        {
          "aria-hidden": "true",
          className: cn(
            "block rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.18)] transition-transform duration-150",
            isSmall ? "size-4" : "size-5",
            disabled ? "bg-[#D4D4D4]" : "bg-white",
            isChecked ? isSmall ? "translate-x-4" : "translate-x-5" : "translate-x-0"
          )
        }
      )
    }
  );
}

// src/tag/tag.tsx
var import_lucide_react2 = require("lucide-react");
var import_jsx_runtime5 = require("react/jsx-runtime");
function Tag({ variant = "default", children, className, ...props }) {
  const isPlaceholder = variant === "placeholder";
  const isSelected = variant === "selected";
  const hasPlus = variant === "add" || isPlaceholder;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "button",
    {
      ...props,
      type: props.type ?? "button",
      className: cn(
        "inline-flex h-[21px] items-center gap-1 whitespace-nowrap rounded-[4px] border px-2 py-1 text-[10px] leading-[13px] outline-none focus-visible:ring-2 focus-visible:ring-[#CFC7BC]",
        isPlaceholder ? "border-dashed border-black/15 bg-transparent text-[#8F8F8F]" : isSelected ? "border-neutral-900 bg-neutral-900 text-white" : "border-[#A3A3A3] bg-white text-[#525252]",
        className
      ),
      children: [
        hasPlus && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react2.Plus, { size: 8, "aria-hidden": "true" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children }),
        variant === "removable" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react2.X, { size: 8, "aria-hidden": "true" })
      ]
    }
  );
}

// src/text-input/text-input.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
function TextInput({
  size = "md",
  error = false,
  disabled,
  leading,
  trailing,
  prefix,
  suffix,
  containerClassName,
  fieldClassName,
  className,
  ...props
}) {
  const sizeClass = size === "sm" ? "h-8" : "";
  const addonPad = size === "sm" ? "px-2" : "px-4 py-3";
  const fieldPad = size === "sm" ? "px-2" : "p-3";
  const inputText = size === "sm" ? "text-[12px] leading-[16px]" : "text-sm leading-5";
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    "div",
    {
      className: cn(
        "flex items-stretch overflow-hidden rounded-[6px] border-[0.5px]",
        sizeClass,
        disabled ? "border-black/10 bg-[#EBEBEB]" : error ? "border-red-500 bg-[#F5F5F5] focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]" : "border-black/10 bg-[#F5F5F5] focus-within:border-black focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]",
        containerClassName
      ),
      children: [
        prefix != null && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: cn("flex shrink-0 items-center gap-2 border-r border-black/10 bg-surface", addonPad), children: prefix }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: cn("flex min-w-0 flex-1 items-center gap-2", fieldPad, fieldClassName), children: [
          leading != null && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "flex shrink-0 items-center text-[#525252]", children: leading }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "input",
            {
              disabled,
              className: cn(
                "min-w-0 flex-1 bg-transparent text-black outline-none placeholder:text-[#525252]",
                inputText,
                disabled && "text-[#8F8F8F] placeholder:text-[#8F8F8F]",
                className
              ),
              ...props
            }
          ),
          trailing != null && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "flex shrink-0 items-center text-[#525252]", children: trailing })
        ] }),
        suffix != null && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: cn("flex shrink-0 items-center gap-2 border-l border-black/10 bg-surface", addonPad), children: suffix })
      ]
    }
  );
}
var Input = TextInput;

// src/text-area/text-area.tsx
var import_react3 = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
var Textarea = (0, import_react3.forwardRef)(
  ({
    error = false,
    disabled,
    maxLength = 250,
    value,
    defaultValue,
    onChange,
    className,
    containerClassName,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = (0, import_react3.useState)(String(defaultValue ?? ""));
    const currentValue = value === void 0 ? internalValue : String(value);
    const counterId = (0, import_react3.useId)();
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      "div",
      {
        className: cn(
          "flex min-h-[136px] w-full flex-col rounded-[6px] border-[0.5px] bg-[#F5F5F5] p-3 transition-shadow focus-within:border-black focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]",
          error ? "border-red-500" : "border-black/10",
          disabled && "border-black/10 bg-[#EBEBEB] focus-within:shadow-none",
          containerClassName
        ),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "textarea",
            {
              ...props,
              ref,
              disabled,
              maxLength,
              value,
              defaultValue: value === void 0 ? defaultValue : void 0,
              "aria-invalid": error || void 0,
              "aria-describedby": [props["aria-describedby"], counterId].filter(Boolean).join(" "),
              onChange: (event) => {
                if (value === void 0) setInternalValue(event.target.value);
                onChange?.(event);
              },
              className: cn(
                "min-h-24 flex-1 resize-none bg-transparent text-sm leading-5 text-[#525252] outline-none placeholder:text-[#8F8F8F]",
                disabled && "text-[#8F8F8F] placeholder:text-[#8F8F8F]",
                className
              )
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
            "span",
            {
              id: counterId,
              className: cn("text-right text-xs leading-3 text-[#8F8F8F] tabular-nums", disabled && "text-[#CCCCCC]"),
              children: [
                currentValue.length,
                "/",
                maxLength
              ]
            }
          )
        ]
      }
    );
  }
);
Textarea.displayName = "Textarea";
var TextArea = Textarea;

// src/list-base/list-base.tsx
var import_class_variance_authority3 = require("class-variance-authority");
var import_jsx_runtime8 = require("react/jsx-runtime");
var listBase = (0, import_class_variance_authority3.cva)(
  "flex min-h-6 items-center gap-2 rounded-sm select-none",
  {
    variants: {
      size: {
        sm: "px-2 py-1 text-xs leading-4 [&_svg]:size-3",
        md: "px-3 py-2 text-sm leading-5 [&_svg]:size-3.5"
      },
      state: {
        default: "text-[#525252] hover:bg-[#F5F5F5]",
        hover: "text-[#525252] bg-[#F5F5F5]",
        selected: "text-[#525252] bg-[#F5F5F5]",
        disabled: "text-[#A3A3A3] cursor-not-allowed"
      },
      tone: {
        default: "",
        // danger colours are applied per-state below: each destructive state
        // needs its own text + fill from the red (danger) ramp, which overrides
        // the neutral state colours via tailwind-merge (compounds come last).
        danger: ""
      }
    },
    compoundVariants: [
      { tone: "danger", state: "default", class: "text-red-500 hover:bg-red-25" },
      { tone: "danger", state: "hover", class: "text-red-500 bg-red-25" },
      { tone: "danger", state: "selected", class: "text-red-500 bg-red-50" },
      { tone: "danger", state: "disabled", class: "text-red-200" }
    ],
    defaultVariants: { size: "sm", state: "default", tone: "default" }
  }
);
function ListBase({
  size,
  leading,
  trailing,
  children,
  state,
  tone,
  className,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: cn(listBase({ size, state, tone }), className), ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("span", { className: "flex min-w-0 flex-1 items-center gap-2", children: [
      leading != null && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "flex shrink-0 items-center", children: leading }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "truncate", children })
    ] }),
    trailing != null && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "flex shrink-0 items-center", children: trailing })
  ] });
}

// src/separator/separator.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
function Separator({ className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
    "div",
    {
      role: "separator",
      "aria-orientation": "horizontal",
      className: cn("flex h-3 items-center px-2", className),
      children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "h-[0.5px] w-full bg-black/10" })
    }
  );
}

// src/loading-spinner/loading-spinner.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
var sizes = {
  xs: "h-3 w-3",
  s: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8"
};
var filledThickness = { xs: 3, s: 4, md: 5, lg: 6, xl: 7 };
var strokeThickness = { xs: 1.4, s: 1.7, md: 2, lg: 2.4, xl: 3 };
function LoadingSpinner({
  size = "md",
  variant = "filled",
  label = "Loading",
  className
}) {
  const isStroke = variant === "stroke" || variant === "dot";
  const thickness = (isStroke ? strokeThickness : filledThickness)[size];
  const track = isStroke ? "transparent" : "rgba(0,0,0,0.10)";
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { role: "status", "aria-label": label, className: cn("inline-flex", className), children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
    "span",
    {
      "aria-hidden": "true",
      className: cn("animate-spin rounded-full motion-reduce:animate-none", sizes[size]),
      style: {
        background: `conic-gradient(from 15deg, #26201C 0deg 255deg, ${track} 255deg 360deg)`,
        maskImage: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`,
        WebkitMaskImage: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`
      }
    }
  ) });
}

// src/slider/slider.tsx
var import_react4 = require("react");
var import_jsx_runtime11 = require("react/jsx-runtime");
var HANDLE_SHADOW = "0 4px 8px -4px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.15), 0 1px 2px -1px rgba(0,0,0,0.2), inset 0 0 0 0.5px rgba(0,0,0,0.1), inset 0 -0.5px 0.5px 0 rgba(0,0,0,0.1), inset 0 0.5px 1px 0 rgba(255,255,255,0.25)";
var HANDLE_SHADOW_CLASS = "shadow-[0_4px_8px_-4px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1),inset_0_0.5px_1px_0_rgba(255,255,255,0.25)]";
var SLIDER_CSS = `
.sparc-slider-input {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
  background: transparent;
  pointer-events: none;
}
.sparc-slider-input::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  background: transparent;
  border: none;
}
.sparc-slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  pointer-events: auto;
  height: 10px;
  width: 10px;
  border-radius: 9999px;
  border: 0.5px solid rgba(0, 0, 0, 0.2);
  background: #FAFAFA;
  box-shadow: ${HANDLE_SHADOW};
  cursor: pointer;
}
.sparc-slider-input::-moz-range-track {
  background: transparent;
  border: none;
}
.sparc-slider-input::-moz-range-thumb {
  pointer-events: auto;
  height: 10px;
  width: 10px;
  border-radius: 9999px;
  border: 0.5px solid rgba(0, 0, 0, 0.2);
  background: #FAFAFA;
  box-shadow: ${HANDLE_SHADOW};
  cursor: pointer;
}
`;
function Slider({
  variant = "default",
  min = 0,
  max = 100,
  value,
  defaultValue = 80,
  valueEnd,
  defaultValueEnd = 80,
  showValue = false,
  onValueChange,
  onRangeChange,
  label = "Value",
  className
}) {
  const [internalStart, setInternalStart] = (0, import_react4.useState)(defaultValue);
  const [internalEnd, setInternalEnd] = (0, import_react4.useState)(defaultValueEnd);
  const start = value ?? internalStart;
  const end = valueEnd ?? internalEnd;
  const span = Math.max(1, max - min);
  const startPercent = variant === "range" ? (start - min) / span * 100 : 0;
  const endPercent = ((variant === "range" ? end : start) - min) / span * 100;
  function setStart(next) {
    const constrained = variant === "range" ? Math.min(next, end) : next;
    if (value === void 0) setInternalStart(constrained);
    if (variant === "range") onRangeChange?.([constrained, end]);
    else onValueChange?.(constrained);
  }
  function setEnd(next) {
    const constrained = Math.max(next, start);
    if (valueEnd === void 0) setInternalEnd(constrained);
    onRangeChange?.([start, constrained]);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: cn("w-[200px]", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("style", { children: SLIDER_CSS }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "relative h-[10px]", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full border-[0.5px] border-black/10 bg-black/[0.08]", children: variant !== "no-value" && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "div",
        {
          className: "absolute inset-y-0 bg-[#C0180C]",
          style: { left: `${startPercent}%`, right: `${100 - endPercent}%` }
        }
      ) }),
      variant === "no-value" && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "span",
        {
          "aria-hidden": "true",
          className: cn(
            "absolute left-0 top-1/2 z-10 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.5px] border-black/20 bg-[#FAFAFA]",
            HANDLE_SHADOW_CLASS
          )
        }
      ),
      variant !== "no-value" && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "input",
        {
          type: "range",
          min,
          max,
          value: variant === "range" ? end : start,
          onChange: (event) => variant === "range" ? setEnd(Number(event.target.value)) : setStart(Number(event.target.value)),
          "aria-label": variant === "range" ? `${label} maximum` : label,
          className: "sparc-slider-input absolute inset-0 z-10 h-[10px] w-full"
        }
      ),
      variant === "range" && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "input",
        {
          type: "range",
          min,
          max,
          value: start,
          onChange: (event) => setStart(Number(event.target.value)),
          "aria-label": `${label} minimum`,
          className: "sparc-slider-input absolute inset-0 z-20 h-[10px] w-full"
        }
      )
    ] }),
    showValue && variant !== "no-value" && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "mt-1 text-[10px] leading-[14px] text-secondary tabular-nums", children: variant === "range" ? `${start}\u2013${end}` : start })
  ] });
}

// src/tooltip/tooltip.tsx
var import_react5 = require("react");
var import_jsx_runtime12 = require("react/jsx-runtime");
var positionClasses = {
  top: "bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2",
  right: "left-[calc(100%+10px)] top-1/2 -translate-y-1/2",
  bottom: "left-1/2 top-[calc(100%+10px)] -translate-x-1/2",
  left: "right-[calc(100%+10px)] top-1/2 -translate-y-1/2"
};
var arrowClasses = {
  top: "-bottom-[10px] left-1/2 -translate-x-1/2 [clip-path:polygon(0_0,100%_0,50%_100%)]",
  right: "-left-[10px] top-1/2 -translate-y-1/2 [clip-path:polygon(0_50%,100%_0,100%_100%)]",
  bottom: "-top-[10px] left-1/2 -translate-x-1/2 [clip-path:polygon(50%_0,0_100%,100%_100%)]",
  left: "-right-[10px] top-1/2 -translate-y-1/2 [clip-path:polygon(0_0,0_100%,100%_50%)]"
};
function Tooltip({
  children,
  body,
  title,
  placement,
  side,
  open,
  defaultOpen = false,
  className
}) {
  const [internalOpen, setInternalOpen] = (0, import_react5.useState)(defaultOpen);
  const isOpen = open ?? internalOpen;
  const resolvedPlacement = placement ?? side ?? "top";
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
    "span",
    {
      className: "relative inline-flex",
      onMouseEnter: () => open === void 0 && setInternalOpen(true),
      onMouseLeave: () => open === void 0 && setInternalOpen(false),
      onFocusCapture: () => open === void 0 && setInternalOpen(true),
      onBlurCapture: () => open === void 0 && setInternalOpen(false),
      children: [
        children,
        isOpen && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
          "span",
          {
            role: "tooltip",
            className: cn(
              "absolute z-50 w-max max-w-72 rounded-[12px] bg-white px-6 py-4 text-left shadow-[0_4px_8px_-4px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0.5px_1px_0_rgba(255,255,255,0.25)]",
              positionClasses[resolvedPlacement],
              className
            ),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("span", { className: cn("flex flex-col", title != null && "gap-1"), children: [
                title != null && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "text-xl font-medium leading-7 text-black", children: title }),
                /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                  "span",
                  {
                    className: cn(
                      "block text-[#525252]",
                      title != null ? "text-lg leading-7" : "text-xl leading-7"
                    ),
                    children: body
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                "span",
                {
                  "aria-hidden": "true",
                  className: cn("absolute h-[10px] w-5 bg-white", arrowClasses[resolvedPlacement])
                }
              )
            ]
          }
        )
      ]
    }
  );
}

// src/avatar/avatar.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
function Avatar({ src, alt, size = 24, fallback, className }) {
  const rem = (px) => `${px / 16}rem`;
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
    "span",
    {
      className: cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-neutral-200 font-medium leading-none text-neutral-700 uppercase select-none",
        className
      ),
      style: { width: rem(size), height: rem(size), fontSize: rem(Math.round(size * 0.42)) },
      "aria-label": src ? void 0 : alt,
      children: src ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("img", { src, alt, className: "h-full w-full object-cover" }) : fallback
    }
  );
}

// src/segmented-button/segmented-button.tsx
var import_react6 = require("react");
var import_jsx_runtime14 = require("react/jsx-runtime");
var SIZE = {
  medium: {
    button: "gap-2 rounded-[6px] py-2 text-[14px] leading-[20px]",
    hugPx: "px-3",
    indicator: "rounded-[6px]",
    badge: "size-5 text-[12px]",
    sep: "h-5"
  },
  small: {
    button: "gap-2 rounded-[4px] py-1 text-[12px] leading-[14px]",
    hugPx: "px-2",
    indicator: "rounded-[4px]",
    badge: "size-[14px] text-[10px]",
    // measured for the small size: keeps the button at 22px
    sep: "h-4"
  }
};
var ACTIVE_INDICATOR_SHADOW = "shadow-[0_4px_8px_-4px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1),inset_0_0.5px_1px_0_rgba(255,255,255,0.25)]";
function CountBadge({ count, selected, cls }) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    "span",
    {
      className: cn(
        "flex shrink-0 items-center justify-center rounded-full font-normal leading-none tabular-nums",
        cls,
        selected ? "bg-white/20 text-white" : "bg-black/5 text-[#8f8f8f] group-hover:bg-black/10 group-hover:text-black"
      ),
      children: count
    }
  );
}
function SegmentedButton({
  options,
  value,
  onChange,
  size = "small",
  fill = false,
  dividers = true,
  className
}) {
  const s = SIZE[size];
  const rootRef = (0, import_react6.useRef)(null);
  const buttonRefs = (0, import_react6.useRef)([]);
  const [pill, setPill] = (0, import_react6.useState)(null);
  const selectedIndex = options.findIndex((o) => o.value === value);
  (0, import_react6.useLayoutEffect)(() => {
    const root = rootRef.current;
    const active = buttonRefs.current[selectedIndex];
    if (!root || !active) return;
    const update = () => {
      setPill({
        left: active.offsetLeft,
        width: active.offsetWidth,
        height: active.offsetHeight
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    observer.observe(active);
    return () => observer.disconnect();
  }, [selectedIndex, options.length]);
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
    "div",
    {
      ref: rootRef,
      role: "tablist",
      className: cn(
        "relative items-center gap-[2px] rounded-[6px] border-[0.5px] border-black/10 bg-[#f5f5f5] p-[1.5px]",
        fill ? "flex w-full" : "inline-flex",
        className
      ),
      children: [
        pill && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "pointer-events-none absolute top-1/2 left-0 bg-[#3d3d3d] will-change-transform motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.455,0.03,0.515,0.955)] motion-reduce:transition-none",
              ACTIVE_INDICATOR_SHADOW,
              s.indicator
            ),
            style: {
              width: pill.width,
              height: pill.height,
              transform: `translate(${pill.left}px, -50%)`
            }
          }
        ),
        options.map((option, i) => {
          const selected = option.value === value;
          return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(import_react6.Fragment, { children: [
            i > 0 && dividers && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { "aria-hidden": "true", className: cn("relative z-10 w-0 shrink-0 border-l border-black/10", s.sep) }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
              "button",
              {
                ref: (el) => {
                  buttonRefs.current[i] = el;
                },
                type: "button",
                role: "tab",
                "aria-selected": selected,
                onClick: () => onChange(option.value),
                className: cn(
                  "group relative z-10 flex cursor-pointer items-center justify-center font-normal outline-none focus-visible:ring-2 focus-visible:ring-black/25 motion-safe:transition-colors",
                  s.button,
                  fill ? "min-w-0 flex-1 basis-0 px-0" : cn("shrink-0", s.hugPx),
                  selected ? "text-white" : "text-[#525252] hover:bg-black/5"
                ),
                children: [
                  option.label,
                  option.count != null && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(CountBadge, { count: option.count, selected, cls: s.badge })
                ]
              }
            )
          ] }, option.value);
        })
      ]
    }
  );
}

// src/radio/radio.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
var SIZES2 = {
  sm: { outer: "size-3", inner: "size-2" },
  md: { outer: "size-4", inner: "size-2" },
  lg: { outer: "size-5", inner: "size-3" }
};
function Radio({
  size = "md",
  checked = false,
  disabled = false,
  className,
  onCheckedChange,
  onClick,
  ...props
}) {
  const s = SIZES2[size];
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
    "button",
    {
      ...props,
      type: props.type ?? "button",
      role: "radio",
      "aria-checked": checked,
      disabled,
      onClick: (event) => {
        onCheckedChange?.(!checked);
        onClick?.(event);
      },
      className: cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full border outline-none focus-visible:ring-2 focus-visible:ring-[#CFC7BC] motion-safe:transition-colors motion-reduce:transition-none",
        s.outer,
        checked ? "border-[#201B18] bg-transparent" : "border-[#B8B8B8] bg-transparent",
        !disabled && !checked && "hover:border-[#201B18]",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className
      ),
      children: checked && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
        "span",
        {
          "aria-hidden": "true",
          className: cn("rounded-full bg-[#201B18]", s.inner)
        }
      )
    }
  );
}

// src/nav-item/nav-item.tsx
var import_lucide_react3 = require("lucide-react");
var import_jsx_runtime16 = require("react/jsx-runtime");
var NAV_ICON_CLASS = "size-3";
function NavItem({
  icon: Icon,
  label,
  current = false,
  expandable = false,
  expanded = false,
  sub = false,
  danger = false,
  disabled = false,
  onClick,
  className
}) {
  const Chevron = expanded ? import_lucide_react3.ChevronDown : import_lucide_react3.ChevronRight;
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
    ListBase,
    {
      role: "button",
      tabIndex: disabled ? -1 : 0,
      size: "sm",
      "aria-current": current ? "page" : void 0,
      "aria-expanded": expandable ? expanded : void 0,
      "aria-disabled": disabled || void 0,
      tone: danger ? "danger" : void 0,
      state: disabled ? "disabled" : current ? "selected" : "default",
      leading: !sub && Icon ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Icon, { className: NAV_ICON_CLASS }) : void 0,
      trailing: expandable ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Chevron, { className: cn(NAV_ICON_CLASS, "text-[#525252]") }) : void 0,
      onClick: disabled ? void 0 : onClick,
      onKeyDown: disabled ? void 0 : (
        // a div with role="button" doesn't activate on Enter/Space natively
        (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick?.(event);
          }
        }
      ),
      className: cn(
        "outline-none",
        !disabled && "cursor-pointer",
        !disabled && "focus-visible:ring-2 focus-visible:ring-[#CFC7BC] focus-visible:ring-offset-0",
        sub && "pl-7",
        current && "bg-[#F0F0F0] text-[#000000]",
        className
      ),
      children: label
    }
  );
}

// src/nav-section/nav-section.tsx
var import_jsx_runtime17 = require("react/jsx-runtime");
function NavSection({ label, children, className }) {
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { role: "group", "aria-label": label, className: cn("space-y-0.5", className), children: [
    label != null && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(ListBase, { className: "min-h-0 py-0.5 text-[0.625rem] leading-[0.875rem] text-[#8F8F8F] uppercase hover:bg-transparent cursor-default", children: label }),
    children
  ] });
}

// src/search-field/search-field.tsx
var import_react7 = require("react");
var import_lucide_react4 = require("lucide-react");
var import_jsx_runtime18 = require("react/jsx-runtime");
function SearchField({
  results,
  open,
  onSelectResult,
  placeholder = "Search projects",
  containerClassName,
  shortcut,
  size = "md",
  iconSize,
  ...props
}) {
  const [focused, setFocused] = (0, import_react7.useState)(false);
  const showResults = (open ?? focused) && results != null && results.length > 0;
  const resolvedIconSize = iconSize ?? (size === "sm" ? 12 : 18);
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "relative", children: [
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      TextInput,
      {
        size,
        leading: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(import_lucide_react4.Search, { style: { width: `${resolvedIconSize / 16}rem`, height: `${resolvedIconSize / 16}rem` } }),
        trailing: shortcut ? /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("kbd", { className: "flex min-w-5 items-center justify-center rounded-[3px] border-[0.6px] border-black/10 py-0.5 pr-0.5 pl-1 font-sans text-[0.625rem] leading-[0.875rem] tracking-[0.2px] text-[#8F8F8F]", children: shortcut }) : void 0,
        placeholder,
        containerClassName,
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
        ...props
      }
    ),
    showResults && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      "div",
      {
        role: "listbox",
        className: cn(
          "absolute left-0 top-full z-10 mt-1.5 w-full rounded-[6px] border-[0.5px] border-[#E0E0E0] bg-surface p-2",
          "shadow-[0_1px_1px_0_rgba(0,0,0,0.05),0_4px_8px_0_rgba(0,0,0,0.05),0_2px_4px_0_rgba(0,0,0,0.05)]"
        ),
        children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "flex flex-col gap-2", children: results.map((r) => /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
          ListBase,
          {
            role: "option",
            leading: r.leading,
            trailing: r.trailing,
            className: "cursor-pointer",
            onMouseDown: (e) => e.preventDefault(),
            onClick: () => onSelectResult?.(r),
            children: r.label
          },
          r.id
        )) })
      }
    )
  ] });
}

// src/account-switcher/account-switcher.tsx
var import_lucide_react5 = require("lucide-react");
var import_jsx_runtime19 = require("react/jsx-runtime");
function AccountSwitcher({
  name,
  avatarSrc,
  initials,
  role,
  onClick,
  onToggleSidebar,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: cn("flex h-10 w-full items-center gap-2 rounded-[6px] bg-[#FBFAF9] pl-1 pr-[6px]", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "flex min-w-0 flex-1 items-center justify-between gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
        "button",
        {
          type: "button",
          onClick,
          className: "-ml-1 flex min-w-0 items-center gap-1 rounded-sm px-1 py-0.5 outline-none hover:bg-[#F5F5F5] focus-visible:ring-2 focus-visible:ring-[#CFC7BC]",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Avatar, { src: avatarSrc, fallback: initials, alt: name, size: 20 }),
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "truncate text-sm leading-5 text-black", children: name }),
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react5.ChevronDown, { className: "size-3 shrink-0 text-subtle" })
          ]
        }
      ),
      role && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Badge, { variant: "purple", size: "sm", className: "shrink-0 px-1.5 py-0.5", children: role })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
      "button",
      {
        type: "button",
        onClick: onToggleSidebar,
        "aria-label": "Collapse sidebar",
        className: "flex shrink-0 items-center justify-center rounded-sm p-1 text-subtle outline-none hover:bg-[#F5F5F5] hover:text-black focus-visible:ring-2 focus-visible:ring-[#CFC7BC]",
        children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react5.PanelLeft, { className: "size-4" })
      }
    )
  ] });
}

// src/breadcrumb/breadcrumb.tsx
var import_react8 = require("react");
var import_lucide_react6 = require("lucide-react");
var import_jsx_runtime20 = require("react/jsx-runtime");
var CRUMB = "text-[12px] leading-[16px] font-normal whitespace-nowrap";
function Crumb({ item, current }) {
  if (current) {
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { "aria-current": "page", className: cn(CRUMB, "text-black"), children: item.label });
  }
  const cls = cn(
    CRUMB,
    "rounded-sm text-[#8f8f8f] outline-none hover:text-black focus-visible:ring-2 focus-visible:ring-[#CFC7BC]",
    (item.href || item.onClick) && "cursor-pointer"
  );
  return item.href ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("a", { href: item.href, className: cls, children: item.label }) : /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("button", { type: "button", onClick: item.onClick, className: cls, children: item.label });
}
function ChevronSep() {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react6.ChevronRight, { size: 12, className: "shrink-0 text-[#8f8f8f]", "aria-hidden": true });
}
function EllipsisMenu({ items }) {
  const [open, setOpen] = (0, import_react8.useState)(false);
  const ref = (0, import_react8.useRef)(null);
  (0, import_react8.useEffect)(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { ref, className: "relative flex items-center", children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      "button",
      {
        type: "button",
        "aria-label": "Show hidden breadcrumbs",
        "aria-expanded": open,
        onClick: () => setOpen((o) => !o),
        className: cn(
          "flex size-4 shrink-0 items-center justify-center rounded-[4px] text-[#8f8f8f] outline-none hover:bg-[#f5f5f5] focus-visible:ring-2 focus-visible:ring-[#CFC7BC]",
          open && "bg-[#f5f5f5]"
        ),
        children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(import_lucide_react6.MoreHorizontal, { size: 16 })
      }
    ),
    open && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      "div",
      {
        role: "menu",
        className: "absolute left-0 top-full z-20 mt-1 flex w-[216px] flex-col gap-1 rounded-[6px] border-[0.5px] border-black/10 bg-white px-1 py-2 shadow-[0_1px_1px_0_rgba(0,0,0,0.05),0_4px_8px_0_rgba(0,0,0,0.05),0_2px_4px_0_rgba(0,0,0,0.05)]",
        children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
          ListBase,
          {
            role: "menuitem",
            className: "w-full cursor-pointer",
            onClick: () => {
              setOpen(false);
              item.onClick?.();
            },
            children: item.label
          },
          i
        ))
      }
    )
  ] });
}
function Breadcrumb({ items, maxItems = 4, className }) {
  if (items.length === 0) return null;
  const collapsed = items.length > maxItems;
  const hidden = collapsed ? items.slice(1, -2) : [];
  const nodes = collapsed ? [items[0], "ellipsis", items[items.length - 2], items[items.length - 1]] : items;
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("nav", { "aria-label": "Breadcrumb", className: cn("flex items-center gap-[10px]", className), children: nodes.map((node, i) => {
    const last = i === nodes.length - 1;
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(import_react8.Fragment, { children: [
      node === "ellipsis" ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(EllipsisMenu, { items: hidden }) : /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Crumb, { item: node, current: last }),
      !last && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(ChevronSep, {})
    ] }, i);
  }) });
}

// src/kpi-card/kpi-card.tsx
var import_jsx_runtime21 = require("react/jsx-runtime");
var LABEL = "text-[12px] leading-[16px] font-normal text-[#525252]";
var VALUE = "font-sans text-[20px] leading-[1.2] font-medium tracking-normal text-black tabular-nums";
var DESC = "text-[11px] leading-[15px] font-normal text-[#525252]";
function Triangle({ down }) {
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("svg", { width: "8", height: "8", viewBox: "0 0 8 8", "aria-hidden": true, className: cn("shrink-0", down && "rotate-180"), children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("path", { d: "M4 0.5L7.5 7.5L0.5 7.5Z", fill: "currentColor" }) });
}
function ValueRow({ value, trend, suffix }) {
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: cn("flex shrink-0", trend ? "items-center gap-2" : "items-end gap-[2px]"), children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { className: VALUE, children: value }),
    trend ? /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(
      "span",
      {
        className: cn(
          "flex items-center gap-1 text-[14px] leading-[1.2] font-normal",
          trend.direction === "up" ? "text-[#129457]" : "text-[#e51d31]"
        ),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Triangle, { down: trend.direction === "down" }),
          trend.value
        ]
      }
    ) : suffix != null && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "py-[2px] text-[12px] leading-[1.2] font-normal text-[#525252]", children: suffix })
  ] });
}
function IconSlot({ icon }) {
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "flex size-5 shrink-0 items-center justify-center", children: icon });
}
var CARD = "overflow-hidden border-[0.5px] border-black/10 bg-white p-3 shadow-[0_2px_6px_-4px_rgba(0,0,0,0.05),0_1px_3px_-2px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1),inset_0_0.5px_0.5px_0_rgba(255,255,255,0.1)]";
function KpiCard({
  label,
  value,
  description,
  suffix,
  trend,
  icon,
  size = "default",
  className
}) {
  if (size === "compact") {
    return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("article", { className: cn(CARD, "flex items-center gap-3 rounded-[8px]", className), children: [
      icon != null && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(IconSlot, { icon }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex min-w-0 flex-col items-start gap-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { className: LABEL, children: label }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(ValueRow, { value, trend, suffix })
      ] })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("article", { className: cn(CARD, "flex items-start gap-4 rounded-[6px]", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex h-20 min-w-0 flex-1 flex-col items-start justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { className: LABEL, children: label }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex flex-col items-start gap-[6px]", children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(ValueRow, { value, trend, suffix }),
        description != null && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { className: DESC, children: description })
      ] })
    ] }),
    icon != null && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(IconSlot, { icon })
  ] });
}

// src/legend/legend.tsx
var import_jsx_runtime22 = require("react/jsx-runtime");
var LINE_STYLE_PROPS = {
  dashed: { strokeDasharray: "6 4" },
  dotted: { strokeDasharray: "1.5 3", strokeLinecap: "round" },
  solid: {}
};
function LegendSwatch({
  variant,
  color,
  dashed,
  lineStyle,
  bordered
}) {
  if (variant === "line") {
    const resolvedLineStyle = lineStyle ?? (dashed ? "dashed" : "solid");
    return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
      "svg",
      {
        "aria-hidden": "true",
        width: "16",
        height: "2",
        viewBox: "0 0 16 2",
        className: "shrink-0",
        children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
          "line",
          {
            x1: "0",
            y1: "1",
            x2: "16",
            y2: "1",
            stroke: color,
            strokeWidth: 2,
            ...LINE_STYLE_PROPS[resolvedLineStyle]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
    "span",
    {
      "aria-hidden": "true",
      className: cn("size-2.5 shrink-0 rounded-[3px]", bordered && "border border-white/10"),
      style: { backgroundColor: color }
    }
  );
}
function Legend({
  variant = "square",
  color,
  label,
  value,
  percent,
  dashed = true,
  lineStyle,
  bordered = false,
  className
}) {
  const hasValue = value != null || percent != null;
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
    "span",
    {
      className: cn(
        "flex items-center whitespace-nowrap text-[11px] leading-[15px] font-normal",
        hasValue ? "gap-2" : "gap-1",
        className
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(LegendSwatch, { variant, color, dashed, lineStyle, bordered }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: "text-[#525252]", children: label })
        ] }),
        hasValue && /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("span", { className: "flex items-center gap-[2px]", children: [
          value != null && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: "text-[#525252]", children: value }),
          percent != null && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: "text-[#8f8f8f]", children: percent })
        ] })
      ]
    }
  );
}

// src/chart-tooltip/chart-tooltip.tsx
var import_jsx_runtime23 = require("react/jsx-runtime");
var CHART_TOOLTIP_SHADOW = "0px 4px 8px 0px rgba(0,0,0,0.1),0px 2px 8px 0px rgba(0,0,0,0.15),0px 1px 2px 0px rgba(0,0,0,0.25),inset 0px 0px 0px 1px rgba(0,0,0,0.1),inset 0px -1px 1px 0px rgba(0,0,0,0.1),inset 0px 1px 2px 0px rgba(255,255,255,0.25)";
function ChartTooltip({ title, items, children, className, style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(
    "div",
    {
      className: cn(
        "pointer-events-none w-[168px] rounded-[6px] border-[0.5px] border-white/10 bg-[#211d1a] px-3 py-2.5 text-white",
        className
      ),
      style: { boxShadow: CHART_TOOLTIP_SHADOW, ...style },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "mb-2 truncate text-[13px] leading-[18px] font-medium text-white", children: title }),
        /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("div", { className: "flex flex-col gap-1.5", children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("div", { className: "flex min-w-0 items-center gap-2 text-[12px] leading-4", children: [
          item.color != null && /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
            "span",
            {
              "aria-hidden": "true",
              className: cn("size-2.5 shrink-0 rounded-[3px]", item.markerClassName),
              style: { backgroundColor: item.color }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { className: "min-w-0 flex-1 truncate text-[#b8b8b8]", children: item.label }),
          item.value != null && /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { className: "shrink-0 text-right text-white", children: item.value })
        ] }, index)) }),
        children
      ]
    }
  );
}

// src/progress-bar-base/progress-bar-base.tsx
var import_jsx_runtime24 = require("react/jsx-runtime");
var sizeClasses = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2"
};
function ProgressBarBase({
  percent,
  size = "md",
  color = "#2d251f",
  indeterminate = false,
  className,
  trackClassName,
  fillClassName,
  ...props
}) {
  const width = Math.min(100, Math.max(0, percent));
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
    "div",
    {
      ...props,
      role: "progressbar",
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": indeterminate ? void 0 : Math.round(width),
      "aria-label": props["aria-label"] ?? "Progress",
      className: cn(
        "relative w-full overflow-hidden rounded-full border-[0.5px] border-black/10 bg-black/[0.07]",
        sizeClasses[size],
        trackClassName,
        className
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        "div",
        {
          "aria-hidden": "true",
          className: cn("h-full rounded-full", fillClassName),
          style: { width: `${width}%`, backgroundColor: color }
        }
      )
    }
  );
}

// src/progress-bar/progress-bar.tsx
var import_jsx_runtime25 = require("react/jsx-runtime");
var sizeToBaseSize = {
  small: "sm",
  medium: "md",
  large: "lg"
};
function getPercent(value, max) {
  if (max <= 0) return 0;
  return Math.min(100, Math.max(0, value / max * 100));
}
function defaultValueFormatter(value, max) {
  return `${Math.round(getPercent(value, max))}%`;
}
function ProgressBar({
  value = 0,
  max = 100,
  variant = "default",
  size = "medium",
  label = "Progress",
  color = "#2d251f",
  valueFormatter = defaultValueFormatter,
  className,
  trackClassName,
  fillClassName,
  labelRowClassName,
  labelClassName,
  valueClassName,
  ...props
}) {
  const percent = getPercent(value, max);
  const baseSize = sizeToBaseSize[size];
  if (variant === "indeterminate") {
    return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: cn("w-full", className), ...props, children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
      ProgressBarBase,
      {
        "aria-label": label,
        percent: 35,
        size: baseSize,
        color,
        indeterminate: true,
        trackClassName,
        fillClassName: cn(
          "animate-[progress-bar-indeterminate_1.15s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:translate-x-0",
          fillClassName
        )
      }
    ) });
  }
  if (variant === "labeled") {
    return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: cn("w-full", className), ...props, children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
        "div",
        {
          className: cn(
            "mb-0.5 flex items-center justify-between gap-3 text-xs leading-4 text-subtle",
            labelRowClassName
          ),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: cn("min-w-0 truncate", labelClassName), children: label }),
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: cn("shrink-0", valueClassName), children: valueFormatter(value, max) })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
        ProgressBarBase,
        {
          "aria-label": label,
          percent,
          size: baseSize,
          color,
          trackClassName,
          fillClassName
        }
      )
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: cn("w-full", className), ...props, children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
    ProgressBarBase,
    {
      "aria-label": label,
      percent,
      size: baseSize,
      color,
      trackClassName,
      fillClassName
    }
  ) });
}

// src/progress-value-bar/progress-value-bar.tsx
var import_jsx_runtime26 = require("react/jsx-runtime");
function ProgressValueBar({
  label,
  valueLabel,
  percent,
  color,
  className,
  fillTextClassName,
  trackTextClassName,
  valueClassName
}) {
  const width = Math.min(100, Math.max(0, percent));
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
    "div",
    {
      role: "progressbar",
      "aria-label": label,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(width),
      className: cn(
        "relative h-6 w-full overflow-hidden rounded-[6px] border-[0.5px] border-black/10 bg-black/[0.05]",
        className
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
          "div",
          {
            "aria-hidden": "true",
            className: "absolute inset-y-0 left-0 z-20 overflow-hidden rounded-[6px]",
            style: { width: `${width}%`, backgroundColor: color },
            children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
              "span",
              {
                className: cn(
                  "absolute top-1/2 left-2 -translate-y-1/2 whitespace-nowrap text-xs leading-4 font-normal text-white",
                  fillTextClassName
                ),
                children: label
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
          "div",
          {
            className: cn(
              "relative z-10 flex h-full items-center justify-between px-2 text-xs leading-4 font-normal text-black",
              trackTextClassName
            ),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("span", { className: "min-w-0 truncate", children: label }),
              /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("span", { className: cn("shrink-0 text-black", valueClassName), children: valueLabel })
            ]
          }
        )
      ]
    }
  );
}

// src/toast/toast.tsx
var import_lucide_react7 = require("lucide-react");
var import_jsx_runtime27 = require("react/jsx-runtime");
var colors = {
  default: { title: "text-black", body: "text-[#525252]", ring: "border-black" },
  error: { title: "text-red-500", body: "text-red-400", ring: "border-red-500" },
  success: { title: "text-green-500", body: "text-green-400", ring: "border-green-500" },
  warning: { title: "text-amber-500", body: "text-amber-400", ring: "border-amber-500" }
};
function Toast({
  variant = "default",
  title = "Plan saved",
  description = "Your staffing plan was saved to Holly Hills.",
  actionLabel = "View plan",
  onAction,
  onDismiss,
  icon,
  className
}) {
  const palette = colors[variant];
  const role = variant === "error" ? "alert" : "status";
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
    "div",
    {
      role,
      className: cn(
        "flex h-20 w-[540px] max-w-full items-center gap-6 rounded-xl border-[0.5px] border-black/10 bg-white p-4 shadow-[0_4px_8px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.15),0_0.5px_2px_rgba(0,0,0,0.10),inset_0_0.5px_1px_rgba(255,255,255,0.25)]",
        className
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "flex min-w-0 flex-1 items-center gap-4", children: [
          icon ?? /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(import_jsx_runtime27.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { className: cn("size-6 shrink-0 rounded-full border-2 bg-white", palette.ring), "aria-hidden": "true" }),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("span", { "aria-hidden": "true", className: "shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(LoadingSpinner, { size: "lg", variant: "stroke" }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "min-w-0", children: [
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("p", { className: cn("text-base font-medium leading-6", palette.title), children: title }),
            /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("p", { className: cn("mt-1 whitespace-nowrap text-sm leading-5", palette.body), children: description })
          ] })
        ] }),
        onAction && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
          Button,
          {
            size: "xs",
            variant: "inverse",
            onClick: onAction,
            className: "h-8 shrink-0 px-3 py-2 text-xs leading-4",
            children: actionLabel
          }
        ),
        onDismiss && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
          "button",
          {
            type: "button",
            onClick: onDismiss,
            className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-[#525252] outline-none hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-black/20",
            "aria-label": "Dismiss notification",
            children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(import_lucide_react7.X, { className: "h-5 w-5", "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}

// src/drop-zone/drop-zone.tsx
var import_react9 = require("react");
var import_lucide_react8 = require("lucide-react");
var import_jsx_runtime28 = require("react/jsx-runtime");
function DropZone({
  state = "default",
  maxSizeLabel = "max 10MB",
  description = `Supports .txt, .docx, .pdf (${maxSizeLabel})`,
  disabled,
  multiple,
  accept = ".txt,.docx,.pdf",
  onFiles,
  className,
  ...inputProps
}) {
  const inputRef = (0, import_react9.useRef)(null);
  const [isDragging, setIsDragging] = (0, import_react9.useState)(false);
  const activeState = isDragging ? "dragging" : state;
  const headline = activeState === "dragging" ? "Release to drop" : multiple ? "Drop files here, or click to browse" : "Drop file here, or click to browse";
  function handleFiles(files) {
    if (files && files.length > 0) onFiles?.(Array.from(files));
  }
  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) handleFiles(event.dataTransfer.files);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
    "div",
    {
      className: cn(
        "h-[148px] w-full rounded-md border-[0.5px] border-black/5 bg-[#F5F5F5] p-0.5",
        disabled && "bg-[#EBEBEB]",
        className
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(
        "button",
        {
          type: "button",
          disabled,
          onClick: () => inputRef.current?.click(),
          onDragEnter: (event) => {
            event.preventDefault();
            if (!disabled) setIsDragging(true);
          },
          onDragOver: (event) => event.preventDefault(),
          onDragLeave: () => setIsDragging(false),
          onDrop: handleDrop,
          className: cn(
            "flex h-full w-full flex-col items-center justify-center gap-2 rounded-[5px] border border-black/10 bg-white outline-none transition-colors focus-visible:ring-2 focus-visible:ring-crimson-500/30 focus-visible:ring-offset-1",
            (activeState === "active" || activeState === "dragging") && "border-crimson-500",
            disabled && "cursor-not-allowed bg-[#F5F5F5]"
          ),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
              import_lucide_react8.CloudUpload,
              {
                className: cn("h-8 w-8 opacity-80", disabled ? "text-[#CCCCCC]" : "text-[#8F8F8F]"),
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("span", { className: "flex flex-col items-center gap-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { className: "text-xs leading-[14px] opacity-80", children: headline }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { className: "text-[10px] leading-3 text-[#525252] opacity-80", children: activeState === "dragging" ? "Drop your files" : description })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
              "input",
              {
                ...inputProps,
                ref: inputRef,
                type: "file",
                accept,
                multiple,
                disabled,
                className: "sr-only",
                onChange: (event) => handleFiles(event.target.files),
                tabIndex: -1
              }
            )
          ]
        }
      )
    }
  );
}

// src/file-list/file-list.tsx
var import_lucide_react9 = require("lucide-react");
var import_jsx_runtime29 = require("react/jsx-runtime");
function FileList({
  state = "default",
  fileName = "selected-file.pdf",
  fileSize = "1.68 MB",
  progress = 68,
  onRemove,
  onRetry,
  className
}) {
  const status = {
    default: "Ready to upload",
    uploading: `${Math.round(progress)}%`,
    success: "File uploaded",
    failed: "Upload failed. Try again"
  }[state];
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
    "div",
    {
      className: cn(
        "flex h-16 w-full max-w-[520px] items-center justify-between rounded-lg border bg-white p-2",
        state === "failed" ? "border-red-500" : "border-black/20",
        className
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "flex min-w-0 items-center gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
            "span",
            {
              className: cn(
                "flex size-12 shrink-0 items-center justify-center rounded-[2px]",
                state === "failed" ? "bg-red-25 text-red-500" : "bg-[#F0F0F0] text-black"
              ),
              children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react9.FileText, { size: 24, "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "min-w-0", children: [
            /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("p", { className: "truncate text-sm leading-5 text-black", children: fileName }),
            /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
              "div",
              {
                className: cn(
                  "mt-1 flex items-center gap-1 text-xs leading-4",
                  state === "uploading" || state === "success" ? "text-[#525252]" : "text-[#8F8F8F]"
                ),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { children: fileSize }),
                  /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { "aria-hidden": "true", children: "\xB7" }),
                  /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { className: cn(state === "failed" && "text-red-500"), children: status })
                ]
              }
            ),
            state === "uploading" && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "mt-1 h-1 w-36 overflow-hidden rounded-full bg-black/8", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "h-full rounded-full bg-crimson-500", style: { width: `${Math.min(100, Math.max(0, progress))}%` } }) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("div", { className: "flex shrink-0 items-center gap-1", children: [
          state === "success" && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react9.CheckCircle2, { size: 20, className: "text-green-500", "aria-label": "Upload complete" }),
          state === "failed" && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react9.AlertCircle, { size: 20, className: "text-red-500", "aria-label": "Upload failed" }),
          state === "failed" && onRetry && /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)(
            "button",
            {
              type: "button",
              onClick: onRetry,
              className: "inline-flex h-9 items-center gap-1.5 rounded-[6px] px-2 text-xs font-medium text-red-500 outline-none hover:bg-red-25 focus-visible:ring-2 focus-visible:ring-red-500/20",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react9.RefreshCw, { size: 16, "aria-hidden": "true" }),
                "Retry"
              ]
            }
          ),
          onRemove && /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
            "button",
            {
              type: "button",
              onClick: onRemove,
              className: "flex size-9 items-center justify-center rounded-full p-0 text-[#525252] outline-none hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-black/20",
              "aria-label": `Remove ${fileName}`,
              children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react9.X, { size: 16, "aria-hidden": "true" })
            }
          )
        ] })
      ]
    }
  );
}

// src/progress-ring/progress-ring.tsx
var import_jsx_runtime30 = require("react/jsx-runtime");
var dimensions = {
  sm: { size: 40, stroke: 5, text: "text-xs leading-4" },
  md: { size: 56, stroke: 7, text: "text-sm leading-5" },
  lg: { size: 72, stroke: 9, text: "text-base leading-5" }
};
function ProgressRing({
  value = 50,
  size = "md",
  showPercent = size !== "sm",
  label = "Progress",
  className
}) {
  const spec = dimensions[size];
  const normalizedValue = Math.min(100, Math.max(0, value));
  const radius = (spec.size - spec.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - normalizedValue / 100);
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)(
    "div",
    {
      role: "progressbar",
      "aria-label": label,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(normalizedValue),
      className: cn("relative inline-grid place-items-center", className),
      style: { width: spec.size, height: spec.size },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("svg", { width: spec.size, height: spec.size, className: "-rotate-90", "aria-hidden": "true", children: [
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
            "circle",
            {
              cx: spec.size / 2,
              cy: spec.size / 2,
              r: radius,
              fill: "none",
              stroke: "rgba(0,0,0,0.10)",
              strokeWidth: spec.stroke
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
            "circle",
            {
              cx: spec.size / 2,
              cy: spec.size / 2,
              r: radius,
              fill: "none",
              stroke: "#26201C",
              strokeWidth: spec.stroke,
              strokeDasharray: circumference,
              strokeDashoffset: offset
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
          "span",
          {
            "aria-hidden": "true",
            className: "absolute rounded-full bg-white",
            style: { inset: spec.stroke }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime30.jsxs)("span", { className: cn("absolute font-medium text-black tabular-nums", spec.text), children: [
          Math.round(normalizedValue),
          showPercent ? "%" : ""
        ] })
      ]
    }
  );
}

// src/skill-level/skill-level.tsx
var import_jsx_runtime31 = require("react/jsx-runtime");
var levelColors = {
  1: "bg-red-400",
  2: "bg-amber-400",
  3: "bg-amber-400",
  4: "bg-green-400",
  5: "bg-green-400"
};
function SkillLevel({ level = 3, max = 5, className, label = `Skill level ${level} of ${max}` }) {
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("span", { className: cn("inline-flex items-center gap-[3px]", className), role: "img", "aria-label": label, children: Array.from({ length: max }, (_, i) => i + 1).map((dot) => /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
    "span",
    {
      "aria-hidden": "true",
      className: cn(
        "size-2 rounded-full border-[0.5px] border-black/10",
        dot <= level ? levelColors[level] : "bg-transparent"
      )
    },
    dot
  )) });
}

// src/empty-state/empty-state.tsx
var import_lucide_react10 = require("lucide-react");
var import_jsx_runtime32 = require("react/jsx-runtime");
var defaults = {
  default: {
    title: "No notifications yet",
    description: "Updates about staffing plans and assignments will appear here.",
    action: "Refresh"
  },
  avatar: {
    title: "No team members",
    description: "Invite people to start building your workforce.",
    action: "Invite team"
  },
  compact: {
    title: "Nothing to show",
    description: "Try adjusting your filters or search.",
    action: "Clear filters"
  }
};
function EmptyState({
  variant = "default",
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className
}) {
  const content = defaults[variant];
  const isAvatar = variant === "avatar";
  const isCompact = variant === "compact";
  const Icon = isAvatar ? import_lucide_react10.UserPlus : import_lucide_react10.Bell;
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(
    "div",
    {
      className: cn(
        "flex flex-col items-center rounded-md border-[0.5px] border-dashed border-black/10 bg-white text-center",
        isCompact ? "min-h-32 p-4" : "min-h-48 p-6",
        className
      ),
      children: [
        !isCompact && /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
          "span",
          {
            className: cn(
              "mb-3 flex h-10 w-10 items-center justify-center rounded-full",
              isAvatar ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700"
            ),
            children: icon ?? /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Icon, { size: 20, "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("h3", { className: "text-sm font-medium leading-5 text-black", children: title ?? content.title }),
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { className: "mt-1 max-w-72 text-xs leading-4 text-secondary", children: description ?? content.description })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(Button, { size: "sm", variant: "inverse", className: "mt-4", onClick: onAction, children: actionLabel ?? content.action })
      ]
    }
  );
}

// src/gantt-bar/gantt-bar.tsx
var import_jsx_runtime33 = require("react/jsx-runtime");
function GanttBar({ state = "default", children = "2 workers", className, ...props }) {
  const disabled = state === "disabled";
  return /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
    "div",
    {
      ...props,
      "aria-disabled": disabled || void 0,
      className: cn(
        "flex h-[20.233px] w-[204.651px] items-center rounded-[2.558px] p-[5.116px] text-[10.233px] leading-none shadow-[inset_0_0_0_0.64px_rgba(0,0,0,0.1),inset_0_-0.64px_0.64px_rgba(0,0,0,0.2),inset_0_0.64px_0.64px_rgba(255,255,255,0.2)]",
        disabled ? "bg-[#D3D2CF] text-[#8F8F8F]" : "bg-[#A2A19A] text-white",
        state === "hover" && "bg-[#92918B]",
        state === "focus" && "bg-[#92918B] ring-2 ring-black/25",
        className
      ),
      children
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AccountSwitcher,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  CHART_TOOLTIP_SHADOW,
  ChartTooltip,
  Checkbox,
  DropZone,
  EmptyState,
  FileList,
  GanttBar,
  Input,
  KpiCard,
  Legend,
  ListBase,
  LoadingSpinner,
  NavItem,
  NavSection,
  ProgressBar,
  ProgressBarBase,
  ProgressRing,
  ProgressValueBar,
  Radio,
  SearchField,
  SegmentedButton,
  Separator,
  SkillLevel,
  Slider,
  Switch,
  Tag,
  TextArea,
  TextInput,
  Textarea,
  Toast,
  Tooltip,
  buttonVariants,
  cn
});
