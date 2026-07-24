// src/button/button.tsx
import {
  forwardRef
} from "react";
import { LoaderCircle } from "lucide-react";
import { cva } from "class-variance-authority";

// src/lib/cn.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/button/button.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var BUTTON_SHADOW = "shadow-[0_4px_8px_-4px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1),inset_0_0.5px_1px_0_rgba(255,255,255,0.25)]";
var DISABLED_SHADOW = "disabled:shadow-[0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1)]";
var buttonVariants = cva(
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
          // Disabled/loading: flat fill (bg-none kills the gradient layers,
          // which would otherwise paint over the flat color), white/50 label.
          "disabled:bg-none disabled:bg-[#F9766C] disabled:text-white/50",
          DISABLED_SHADOW
        ),
        // Backwards-compatible alias for the previous "default" variant.
        default: cn(
          "text-[#FFFFFF]",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#C0180C_0%,#C0180C_100%)]",
          BUTTON_SHADOW,
          "hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#C0180C_0%,#C0180C_100%)] hover:text-white/80",
          "active:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#C0180C_0%,#C0180C_100%)]",
          "disabled:bg-none disabled:bg-[#F9766C] disabled:text-white/50",
          DISABLED_SHADOW
        ),
        danger: cn(
          "text-[#FFFFFF]",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)]",
          BUTTON_SHADOW,
          "hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)] hover:text-white/80",
          "active:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)]",
          "disabled:bg-none disabled:bg-[#F65B68] disabled:text-white/50",
          DISABLED_SHADOW
        ),
        // Backwards-compatible alias for the previous "destructive" variant.
        destructive: cn(
          "text-[#FFFFFF]",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)]",
          BUTTON_SHADOW,
          "hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)] hover:text-white/80",
          "active:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)]",
          "disabled:bg-none disabled:bg-[#F65B68] disabled:text-white/50",
          DISABLED_SHADOW
        ),
        secondary: cn(
          "border-[0.5px] border-white/10 bg-white text-primary",
          BUTTON_SHADOW,
          "hover:bg-[#F5F5F5] hover:text-primary/80",
          "active:bg-[#F0F0F0] active:text-primary/60",
          // The Figma gray disabled button represents both light variants:
          // like outline, secondary disabled shows a 1px #C2C2C2 border and
          // no container shadow.
          "disabled:border disabled:border-[#C2C2C2] disabled:bg-[#E0E0E0] disabled:text-primary/30 disabled:shadow-none"
        ),
        outline: cn(
          "border border-[#8F8F8F] bg-white text-primary",
          "hover:border-[#666666] hover:bg-[#F5F5F5] hover:text-primary/80",
          "active:border-[#666666] active:bg-[#F0F0F0] active:text-primary/60",
          "disabled:border-[#C2C2C2] disabled:bg-[#E0E0E0] disabled:text-primary/30"
        ),
        ghost: cn(
          "bg-transparent text-[#525252]",
          "hover:bg-[#F5F5F5] hover:text-primary/80",
          "active:bg-[#F0F0F0] active:text-primary/60",
          "disabled:text-primary/30"
        ),
        inverse: cn(
          "border border-white/10 text-white",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#26201C_0%,#26201C_100%)]",
          BUTTON_SHADOW,
          "hover:text-white/80",
          "active:text-white/60",
          // Disabled/loading: flat #26201C (no gradient), white/30 label, the
          // white/10 border stays (width is size-dependent, see below).
          "disabled:bg-none disabled:bg-[#26201C] disabled:text-white/30",
          DISABLED_SHADOW
        )
      },
      size: {
        xs: "h-[26px] gap-1 px-2 py-1.5 text-2xs",
        sm: "h-9 gap-2 px-3 py-2.5 text-xs leading-4",
        md: "h-11 gap-2 px-4 py-3 text-sm leading-5",
        default: "h-11 gap-2 px-4 py-3 text-sm leading-5",
        lg: "h-14 gap-2 px-6 py-4 text-base leading-6"
      }
    },
    compoundVariants: [
      // Inverse border width is size-dependent per the Figma matrix:
      // 1px at lg/md, 0.5px at sm/xs.
      { variant: "inverse", size: ["xs", "sm"], class: "border-[0.5px]" }
    ],
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);
var leftIconSizes = {
  xs: "w-3.5 h-3.5",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  default: "w-5 h-5",
  lg: "w-6 h-6"
};
var rightIconSizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  default: "w-5 h-5",
  lg: "w-6 h-6"
};
var contentGaps = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-2",
  default: "gap-2",
  lg: "gap-2"
};
var Button = forwardRef(
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
    const resolvedSize = size ?? "md";
    const leftIconSize = leftIconSizes[resolvedSize];
    const rightIconSize = rightIconSizes[resolvedSize];
    const contentGap = contentGaps[resolvedSize];
    return /* @__PURE__ */ jsx(
      "button",
      {
        ref,
        type: "button",
        className: cn(buttonVariants({ variant, size }), className),
        disabled: isDisabled,
        "aria-busy": loading || void 0,
        "data-loading": loading || void 0,
        ...props,
        children: /* @__PURE__ */ jsxs(
          "span",
          {
            className: cn(
              "inline-flex items-center justify-center",
              contentGap
            ),
            children: [
              loading ? /* @__PURE__ */ jsx("span", { className: cn("flex shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full", leftIconSize), children: /* @__PURE__ */ jsx(LoaderCircle, { "aria-hidden": "true", className: "animate-spin motion-reduce:animate-none" }) }) : leftIcon ? /* @__PURE__ */ jsx("span", { className: cn("flex shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full", leftIconSize), children: leftIcon }) : null,
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: cn(
                    // The label (and the icons) inherit the button's text color, so
                    // hover/active dimming and the disabled/loading dimming reach
                    // them uniformly. The text drop-shadow is pinned to the label
                    // because filters don't inherit: light-text variants keep it in
                    // every state per Figma — including disabled/loading on the red
                    // variants — except inverse, which drops it when dimmed.
                    isLightText && "drop-shadow-[0_4px_2px_rgba(0,0,0,0.08)]",
                    isLightText && isDisabled && resolvedVariant === "inverse" && "drop-shadow-none"
                  ),
                  children
                }
              ),
              rightIcon && /* @__PURE__ */ jsx("span", { className: cn("flex shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full", rightIconSize), children: rightIcon })
            ]
          }
        )
      }
    );
  }
);
Button.displayName = "Button";

// src/badge/badge.tsx
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var badge = cva2(
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
  return /* @__PURE__ */ jsxs2("span", { className: cn(badge({ variant, size }), className), children: [
    icon != null && /* @__PURE__ */ jsx2("span", { className: "flex shrink-0 items-center", children: icon }),
    dot && /* @__PURE__ */ jsx2("span", { className: "size-1.5 shrink-0 rounded-full bg-current", "aria-hidden": true }),
    children
  ] });
}

// src/checkbox/checkbox.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx3(
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
      children: checked && /* @__PURE__ */ jsx3("svg", { viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", className: s.check, children: /* @__PURE__ */ jsx3(
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
import { useState } from "react";
import { jsx as jsx4 } from "react/jsx-runtime";
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
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checked ?? internalChecked;
  const isSmall = size === "sm";
  function toggle() {
    if (disabled) return;
    const next = !isChecked;
    if (checked === void 0) setInternalChecked(next);
    onCheckedChange?.(next);
  }
  return /* @__PURE__ */ jsx4(
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
      children: /* @__PURE__ */ jsx4(
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
import { Plus, X } from "lucide-react";
import { jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
function Tag({ variant = "default", children, className, ...props }) {
  const isPlaceholder = variant === "placeholder";
  const isSelected = variant === "selected";
  const hasPlus = variant === "add" || isPlaceholder;
  return /* @__PURE__ */ jsxs3(
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
        hasPlus && /* @__PURE__ */ jsx5(Plus, { size: 8, "aria-hidden": "true" }),
        /* @__PURE__ */ jsx5("span", { children }),
        variant === "removable" && /* @__PURE__ */ jsx5(X, { size: 8, "aria-hidden": "true" })
      ]
    }
  );
}

// src/text-input/text-input.tsx
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs4(
    "div",
    {
      className: cn(
        "flex items-stretch overflow-hidden rounded-[6px] border-[0.5px]",
        sizeClass,
        disabled ? "border-black/10 bg-[#EBEBEB]" : error ? "border-red-500 bg-[#F5F5F5] focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]" : "border-black/10 bg-[#F5F5F5] focus-within:border-black focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]",
        containerClassName
      ),
      children: [
        prefix != null && /* @__PURE__ */ jsx6("div", { className: cn("flex shrink-0 items-center gap-2 border-r border-black/10 bg-surface", addonPad), children: prefix }),
        /* @__PURE__ */ jsxs4("div", { className: cn("flex min-w-0 flex-1 items-center gap-2", fieldPad, fieldClassName), children: [
          leading != null && /* @__PURE__ */ jsx6("span", { className: "flex shrink-0 items-center text-[#525252]", children: leading }),
          /* @__PURE__ */ jsx6(
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
          trailing != null && /* @__PURE__ */ jsx6("span", { className: "flex shrink-0 items-center text-[#525252]", children: trailing })
        ] }),
        suffix != null && /* @__PURE__ */ jsx6("div", { className: cn("flex shrink-0 items-center gap-2 border-l border-black/10 bg-surface", addonPad), children: suffix })
      ]
    }
  );
}
var Input = TextInput;

// src/text-area/text-area.tsx
import { forwardRef as forwardRef2, useId, useState as useState2 } from "react";
import { jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
var Textarea = forwardRef2(
  ({
    size = "md",
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
    const [internalValue, setInternalValue] = useState2(String(defaultValue ?? ""));
    const currentValue = value === void 0 ? internalValue : String(value);
    const counterId = useId();
    const containerPad = size === "sm" ? "px-2 py-2" : "p-3";
    const inputText = size === "sm" ? "text-[12px] leading-[16px]" : "text-sm leading-5";
    return /* @__PURE__ */ jsxs5(
      "div",
      {
        className: cn(
          "flex min-h-[136px] w-full flex-col rounded-[6px] border-[0.5px] bg-[#F5F5F5] transition-shadow focus-within:border-black focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]",
          containerPad,
          error ? "border-red-500" : "border-black/10",
          disabled && "border-black/10 bg-[#EBEBEB] focus-within:shadow-none",
          containerClassName
        ),
        children: [
          /* @__PURE__ */ jsx7(
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
                "min-h-24 flex-1 resize-none bg-transparent text-[#525252] outline-none placeholder:text-[#8F8F8F]",
                inputText,
                disabled && "text-[#8F8F8F] placeholder:text-[#8F8F8F]",
                className
              )
            }
          ),
          /* @__PURE__ */ jsxs5(
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
import { cva as cva3 } from "class-variance-authority";
import { jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
var listBase = cva3(
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
  return /* @__PURE__ */ jsxs6("div", { className: cn(listBase({ size, state, tone }), className), ...props, children: [
    /* @__PURE__ */ jsxs6("span", { className: "flex min-w-0 flex-1 items-center gap-2", children: [
      leading != null && /* @__PURE__ */ jsx8("span", { className: "flex shrink-0 items-center", children: leading }),
      /* @__PURE__ */ jsx8("span", { className: "truncate", children })
    ] }),
    trailing != null && /* @__PURE__ */ jsx8("span", { className: "flex shrink-0 items-center", children: trailing })
  ] });
}

// src/separator/separator.tsx
import { jsx as jsx9 } from "react/jsx-runtime";
function Separator({ className }) {
  return /* @__PURE__ */ jsx9(
    "div",
    {
      role: "separator",
      "aria-orientation": "horizontal",
      className: cn("flex h-3 items-center px-2", className),
      children: /* @__PURE__ */ jsx9("span", { className: "h-[0.5px] w-full bg-black/10" })
    }
  );
}

// src/loading-spinner/loading-spinner.tsx
import { jsx as jsx10 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx10("span", { role: "status", "aria-label": label, className: cn("inline-flex", className), children: /* @__PURE__ */ jsx10(
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
import { useState as useState3 } from "react";
import { jsx as jsx11, jsxs as jsxs7 } from "react/jsx-runtime";
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
  const [internalStart, setInternalStart] = useState3(defaultValue);
  const [internalEnd, setInternalEnd] = useState3(defaultValueEnd);
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
  return /* @__PURE__ */ jsxs7("div", { className: cn("w-[200px]", className), children: [
    /* @__PURE__ */ jsx11("style", { children: SLIDER_CSS }),
    /* @__PURE__ */ jsxs7("div", { className: "relative h-[10px]", children: [
      /* @__PURE__ */ jsx11("div", { className: "absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full border-[0.5px] border-black/10 bg-black/[0.08]", children: variant !== "no-value" && /* @__PURE__ */ jsx11(
        "div",
        {
          className: "absolute inset-y-0 bg-[#C0180C]",
          style: { left: `${startPercent}%`, right: `${100 - endPercent}%` }
        }
      ) }),
      variant === "no-value" && /* @__PURE__ */ jsx11(
        "span",
        {
          "aria-hidden": "true",
          className: cn(
            "absolute left-0 top-1/2 z-10 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.5px] border-black/20 bg-[#FAFAFA]",
            HANDLE_SHADOW_CLASS
          )
        }
      ),
      variant !== "no-value" && /* @__PURE__ */ jsx11(
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
      variant === "range" && /* @__PURE__ */ jsx11(
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
    showValue && variant !== "no-value" && /* @__PURE__ */ jsx11("div", { className: "mt-1 text-[10px] leading-[14px] text-secondary tabular-nums", children: variant === "range" ? `${start}\u2013${end}` : start })
  ] });
}

// src/tooltip/tooltip.tsx
import { useState as useState4 } from "react";
import { jsx as jsx12, jsxs as jsxs8 } from "react/jsx-runtime";
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
  const [internalOpen, setInternalOpen] = useState4(defaultOpen);
  const isOpen = open ?? internalOpen;
  const resolvedPlacement = placement ?? side ?? "top";
  return /* @__PURE__ */ jsxs8(
    "span",
    {
      className: "relative inline-flex",
      onMouseEnter: () => open === void 0 && setInternalOpen(true),
      onMouseLeave: () => open === void 0 && setInternalOpen(false),
      onFocusCapture: () => open === void 0 && setInternalOpen(true),
      onBlurCapture: () => open === void 0 && setInternalOpen(false),
      children: [
        children,
        isOpen && /* @__PURE__ */ jsxs8(
          "span",
          {
            role: "tooltip",
            className: cn(
              "absolute z-50 w-max max-w-72 rounded-[12px] bg-white px-4 py-2.5 text-left shadow-[0_4px_8px_-4px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0.5px_1px_0_rgba(255,255,255,0.25)]",
              positionClasses[resolvedPlacement],
              className
            ),
            children: [
              /* @__PURE__ */ jsxs8("span", { className: cn("flex flex-col", title != null && "gap-1"), children: [
                title != null && /* @__PURE__ */ jsx12("span", { className: "text-[13px] font-medium leading-[18px] text-black", children: title }),
                /* @__PURE__ */ jsx12(
                  "span",
                  {
                    className: cn(
                      "block text-[#525252]",
                      title != null ? "text-xs leading-4" : "text-[13px] leading-[18px]"
                    ),
                    children: body
                  }
                )
              ] }),
              /* @__PURE__ */ jsx12(
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
import { jsx as jsx13 } from "react/jsx-runtime";
function Avatar({ src, alt, size = 24, fallback, className }) {
  const rem = (px) => `${px / 16}rem`;
  return /* @__PURE__ */ jsx13(
    "span",
    {
      className: cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-neutral-200 font-medium leading-none text-neutral-700 uppercase select-none",
        className
      ),
      style: { width: rem(size), height: rem(size), fontSize: rem(Math.round(size * 0.42)) },
      "aria-label": src ? void 0 : alt,
      children: src ? /* @__PURE__ */ jsx13("img", { src, alt, className: "h-full w-full object-cover" }) : fallback
    }
  );
}

// src/segmented-button/segmented-button.tsx
import { Fragment, useLayoutEffect, useRef, useState as useState5 } from "react";
import { jsx as jsx14, jsxs as jsxs9 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx14(
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
  const rootRef = useRef(null);
  const buttonRefs = useRef([]);
  const [pill, setPill] = useState5(null);
  const selectedIndex = options.findIndex((o) => o.value === value);
  useLayoutEffect(() => {
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
  return /* @__PURE__ */ jsxs9(
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
        pill && /* @__PURE__ */ jsx14(
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
          return /* @__PURE__ */ jsxs9(Fragment, { children: [
            i > 0 && dividers && /* @__PURE__ */ jsx14("span", { "aria-hidden": "true", className: cn("relative z-10 w-0 shrink-0 border-l border-black/10", s.sep) }),
            /* @__PURE__ */ jsxs9(
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
                  option.count != null && /* @__PURE__ */ jsx14(CountBadge, { count: option.count, selected, cls: s.badge })
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
import { jsx as jsx15 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx15(
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
      children: checked && /* @__PURE__ */ jsx15(
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
import { ChevronDown, ChevronRight } from "lucide-react";
import { jsx as jsx16 } from "react/jsx-runtime";
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
  const Chevron = expanded ? ChevronDown : ChevronRight;
  return /* @__PURE__ */ jsx16(
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
      leading: !sub && Icon ? /* @__PURE__ */ jsx16(Icon, { className: NAV_ICON_CLASS }) : void 0,
      trailing: expandable ? /* @__PURE__ */ jsx16(Chevron, { className: cn(NAV_ICON_CLASS, "text-[#525252]") }) : void 0,
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
import { jsx as jsx17, jsxs as jsxs10 } from "react/jsx-runtime";
function NavSection({ label, children, className }) {
  return /* @__PURE__ */ jsxs10("div", { role: "group", "aria-label": label, className: cn("space-y-0.5", className), children: [
    label != null && /* @__PURE__ */ jsx17(ListBase, { className: "min-h-0 py-0.5 text-[0.625rem] leading-[0.875rem] text-[#8F8F8F] uppercase hover:bg-transparent cursor-default", children: label }),
    children
  ] });
}

// src/search-field/search-field.tsx
import { useState as useState6 } from "react";
import { Search } from "lucide-react";
import { jsx as jsx18, jsxs as jsxs11 } from "react/jsx-runtime";
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
  const [focused, setFocused] = useState6(false);
  const showResults = (open ?? focused) && results != null && results.length > 0;
  const resolvedIconSize = iconSize ?? (size === "sm" ? 12 : 18);
  return /* @__PURE__ */ jsxs11("div", { className: "relative", children: [
    /* @__PURE__ */ jsx18(
      TextInput,
      {
        size,
        leading: /* @__PURE__ */ jsx18(Search, { style: { width: `${resolvedIconSize / 16}rem`, height: `${resolvedIconSize / 16}rem` } }),
        trailing: shortcut ? /* @__PURE__ */ jsx18("kbd", { className: "flex min-w-5 items-center justify-center rounded-[3px] border-[0.6px] border-black/10 py-0.5 pr-0.5 pl-1 font-sans text-[0.625rem] leading-[0.875rem] tracking-[0.2px] text-[#8F8F8F]", children: shortcut }) : void 0,
        placeholder,
        containerClassName,
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
        ...props
      }
    ),
    showResults && /* @__PURE__ */ jsx18(
      "div",
      {
        role: "listbox",
        className: cn(
          "absolute left-0 top-full z-10 mt-1.5 w-full rounded-[6px] border-[0.5px] border-[#E0E0E0] bg-surface p-2",
          "shadow-[0_1px_1px_0_rgba(0,0,0,0.05),0_4px_8px_0_rgba(0,0,0,0.05),0_2px_4px_0_rgba(0,0,0,0.05)]"
        ),
        children: /* @__PURE__ */ jsx18("div", { className: "flex flex-col gap-2", children: results.map((r) => /* @__PURE__ */ jsx18(
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
import { ChevronDown as ChevronDown2, PanelLeft } from "lucide-react";
import { jsx as jsx19, jsxs as jsxs12 } from "react/jsx-runtime";
function AccountSwitcher({
  name,
  avatarSrc,
  initials,
  role,
  onClick,
  onToggleSidebar,
  className
}) {
  return /* @__PURE__ */ jsxs12("div", { className: cn("flex h-10 w-full items-center gap-2 rounded-[6px] bg-[#FBFAF9] pl-1 pr-[6px]", className), children: [
    /* @__PURE__ */ jsxs12("div", { className: "flex min-w-0 flex-1 items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs12(
        "button",
        {
          type: "button",
          onClick,
          className: "-ml-1 flex min-w-0 items-center gap-1 rounded-sm px-1 py-0.5 outline-none hover:bg-[#F5F5F5] focus-visible:ring-2 focus-visible:ring-[#CFC7BC]",
          children: [
            /* @__PURE__ */ jsx19(Avatar, { src: avatarSrc, fallback: initials, alt: name, size: 20 }),
            /* @__PURE__ */ jsx19("span", { className: "truncate text-sm leading-5 text-black", children: name }),
            /* @__PURE__ */ jsx19(ChevronDown2, { className: "size-3 shrink-0 text-subtle" })
          ]
        }
      ),
      role && /* @__PURE__ */ jsx19(Badge, { variant: "purple", size: "sm", className: "shrink-0 px-1.5 py-0.5", children: role })
    ] }),
    /* @__PURE__ */ jsx19(
      "button",
      {
        type: "button",
        onClick: onToggleSidebar,
        "aria-label": "Collapse sidebar",
        className: "flex shrink-0 items-center justify-center rounded-sm p-1 text-subtle outline-none hover:bg-[#F5F5F5] hover:text-black focus-visible:ring-2 focus-visible:ring-[#CFC7BC]",
        children: /* @__PURE__ */ jsx19(PanelLeft, { className: "size-4" })
      }
    )
  ] });
}

// src/breadcrumb/breadcrumb.tsx
import { Fragment as Fragment2, useEffect, useRef as useRef2, useState as useState7 } from "react";
import { ChevronRight as ChevronRight2, MoreHorizontal } from "lucide-react";
import { jsx as jsx20, jsxs as jsxs13 } from "react/jsx-runtime";
var CRUMB = "text-[12px] leading-[16px] font-normal whitespace-nowrap";
function Crumb({ item, current }) {
  if (current) {
    return /* @__PURE__ */ jsx20("span", { "aria-current": "page", className: cn(CRUMB, "text-black"), children: item.label });
  }
  const cls = cn(
    CRUMB,
    "rounded-sm text-[#8f8f8f] outline-none hover:text-black focus-visible:ring-2 focus-visible:ring-[#CFC7BC]",
    (item.href || item.onClick) && "cursor-pointer"
  );
  return item.href ? /* @__PURE__ */ jsx20("a", { href: item.href, className: cls, children: item.label }) : /* @__PURE__ */ jsx20("button", { type: "button", onClick: item.onClick, className: cls, children: item.label });
}
function ChevronSep() {
  return /* @__PURE__ */ jsx20(ChevronRight2, { size: 12, className: "shrink-0 text-[#8f8f8f]", "aria-hidden": true });
}
function EllipsisMenu({ items }) {
  const [open, setOpen] = useState7(false);
  const ref = useRef2(null);
  useEffect(() => {
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
  return /* @__PURE__ */ jsxs13("div", { ref, className: "relative flex items-center", children: [
    /* @__PURE__ */ jsx20(
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
        children: /* @__PURE__ */ jsx20(MoreHorizontal, { size: 16 })
      }
    ),
    open && /* @__PURE__ */ jsx20(
      "div",
      {
        role: "menu",
        className: "absolute left-0 top-full z-20 mt-1 flex w-[216px] flex-col gap-1 rounded-[6px] border-[0.5px] border-black/10 bg-white px-1 py-2 shadow-[0_1px_1px_0_rgba(0,0,0,0.05),0_4px_8px_0_rgba(0,0,0,0.05),0_2px_4px_0_rgba(0,0,0,0.05)]",
        children: items.map((item, i) => /* @__PURE__ */ jsx20(
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
  return /* @__PURE__ */ jsx20("nav", { "aria-label": "Breadcrumb", className: cn("flex items-center gap-[10px]", className), children: nodes.map((node, i) => {
    const last = i === nodes.length - 1;
    return /* @__PURE__ */ jsxs13(Fragment2, { children: [
      node === "ellipsis" ? /* @__PURE__ */ jsx20(EllipsisMenu, { items: hidden }) : /* @__PURE__ */ jsx20(Crumb, { item: node, current: last }),
      !last && /* @__PURE__ */ jsx20(ChevronSep, {})
    ] }, i);
  }) });
}

// src/kpi-card/kpi-card.tsx
import { jsx as jsx21, jsxs as jsxs14 } from "react/jsx-runtime";
var LABEL = "text-[12px] leading-[16px] font-normal text-[#525252]";
var VALUE = "font-sans text-[20px] leading-[1.2] font-medium tracking-normal text-black tabular-nums";
var DESC = "text-[11px] leading-[15px] font-normal text-[#525252]";
function Triangle({ down }) {
  return /* @__PURE__ */ jsx21("svg", { width: "8", height: "8", viewBox: "0 0 8 8", "aria-hidden": true, className: cn("shrink-0", down && "rotate-180"), children: /* @__PURE__ */ jsx21("path", { d: "M4 0.5L7.5 7.5L0.5 7.5Z", fill: "currentColor" }) });
}
function ValueRow({ value, trend, suffix }) {
  return /* @__PURE__ */ jsxs14("div", { className: cn("flex shrink-0", trend ? "items-center gap-2" : "items-end gap-[2px]"), children: [
    /* @__PURE__ */ jsx21("p", { className: VALUE, children: value }),
    trend ? /* @__PURE__ */ jsxs14(
      "span",
      {
        className: cn(
          "flex items-center gap-1 text-[14px] leading-[1.2] font-normal",
          trend.direction === "up" ? "text-[#129457]" : "text-[#e51d31]"
        ),
        children: [
          /* @__PURE__ */ jsx21(Triangle, { down: trend.direction === "down" }),
          trend.value
        ]
      }
    ) : suffix != null && /* @__PURE__ */ jsx21("span", { className: "py-[2px] text-[12px] leading-[1.2] font-normal text-[#525252]", children: suffix })
  ] });
}
function IconSlot({ icon }) {
  return /* @__PURE__ */ jsx21("span", { className: "flex size-5 shrink-0 items-center justify-center", children: icon });
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
    return /* @__PURE__ */ jsxs14("article", { className: cn(CARD, "flex items-center gap-3 rounded-[8px]", className), children: [
      icon != null && /* @__PURE__ */ jsx21(IconSlot, { icon }),
      /* @__PURE__ */ jsxs14("div", { className: "flex min-w-0 flex-col items-start gap-1", children: [
        /* @__PURE__ */ jsx21("p", { className: LABEL, children: label }),
        /* @__PURE__ */ jsx21(ValueRow, { value, trend, suffix })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs14("article", { className: cn(CARD, "flex items-start gap-4 rounded-[6px]", className), children: [
    /* @__PURE__ */ jsxs14("div", { className: "flex h-20 min-w-0 flex-1 flex-col items-start justify-between", children: [
      /* @__PURE__ */ jsx21("p", { className: LABEL, children: label }),
      /* @__PURE__ */ jsxs14("div", { className: "flex flex-col items-start gap-[6px]", children: [
        /* @__PURE__ */ jsx21(ValueRow, { value, trend, suffix }),
        description != null && /* @__PURE__ */ jsx21("p", { className: DESC, children: description })
      ] })
    ] }),
    icon != null && /* @__PURE__ */ jsx21(IconSlot, { icon })
  ] });
}

// src/legend/legend.tsx
import { jsx as jsx22, jsxs as jsxs15 } from "react/jsx-runtime";
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
    return /* @__PURE__ */ jsx22(
      "svg",
      {
        "aria-hidden": "true",
        width: "16",
        height: "2",
        viewBox: "0 0 16 2",
        className: "shrink-0",
        children: /* @__PURE__ */ jsx22(
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
  return /* @__PURE__ */ jsx22(
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
  return /* @__PURE__ */ jsxs15(
    "span",
    {
      className: cn(
        "flex items-center whitespace-nowrap text-[11px] leading-[15px] font-normal",
        hasValue ? "gap-2" : "gap-1",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs15("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx22(LegendSwatch, { variant, color, dashed, lineStyle, bordered }),
          /* @__PURE__ */ jsx22("span", { className: "text-[#525252]", children: label })
        ] }),
        hasValue && /* @__PURE__ */ jsxs15("span", { className: "flex items-center gap-[2px]", children: [
          value != null && /* @__PURE__ */ jsx22("span", { className: "text-[#525252]", children: value }),
          percent != null && /* @__PURE__ */ jsx22("span", { className: "text-[#8f8f8f]", children: percent })
        ] })
      ]
    }
  );
}

// src/chart-tooltip/chart-tooltip.tsx
import { jsx as jsx23, jsxs as jsxs16 } from "react/jsx-runtime";
var CHART_TOOLTIP_SHADOW = "0px 4px 8px 0px rgba(0,0,0,0.1),0px 2px 8px 0px rgba(0,0,0,0.15),0px 1px 2px 0px rgba(0,0,0,0.25),inset 0px 0px 0px 1px rgba(0,0,0,0.1),inset 0px -1px 1px 0px rgba(0,0,0,0.1),inset 0px 1px 2px 0px rgba(255,255,255,0.25)";
function ChartTooltip({ title, items, children, className, style }) {
  return /* @__PURE__ */ jsxs16(
    "div",
    {
      className: cn(
        "pointer-events-none w-[168px] rounded-[6px] border-[0.5px] border-white/10 bg-[#211d1a] px-3 py-2.5 text-white",
        className
      ),
      style: { boxShadow: CHART_TOOLTIP_SHADOW, ...style },
      children: [
        /* @__PURE__ */ jsx23("div", { className: "mb-2 truncate text-[13px] leading-[18px] font-medium text-white", children: title }),
        /* @__PURE__ */ jsx23("div", { className: "flex flex-col gap-1.5", children: items.map((item, index) => /* @__PURE__ */ jsxs16("div", { className: "flex min-w-0 items-center gap-2 text-[12px] leading-4", children: [
          item.color != null && /* @__PURE__ */ jsx23(
            "span",
            {
              "aria-hidden": "true",
              className: cn("size-2.5 shrink-0 rounded-[3px]", item.markerClassName),
              style: { backgroundColor: item.color }
            }
          ),
          /* @__PURE__ */ jsx23("span", { className: "min-w-0 flex-1 truncate text-[#b8b8b8]", children: item.label }),
          item.value != null && /* @__PURE__ */ jsx23("span", { className: "shrink-0 text-right text-white", children: item.value })
        ] }, index)) }),
        children
      ]
    }
  );
}

// src/progress-bar-base/progress-bar-base.tsx
import { jsx as jsx24 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx24(
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
      children: /* @__PURE__ */ jsx24(
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
import { jsx as jsx25, jsxs as jsxs17 } from "react/jsx-runtime";
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
    return /* @__PURE__ */ jsx25("div", { className: cn("w-full", className), ...props, children: /* @__PURE__ */ jsx25(
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
    return /* @__PURE__ */ jsxs17("div", { className: cn("w-full", className), ...props, children: [
      /* @__PURE__ */ jsxs17(
        "div",
        {
          className: cn(
            "mb-0.5 flex items-center justify-between gap-3 text-xs leading-4 text-subtle",
            labelRowClassName
          ),
          children: [
            /* @__PURE__ */ jsx25("span", { className: cn("min-w-0 truncate", labelClassName), children: label }),
            /* @__PURE__ */ jsx25("span", { className: cn("shrink-0", valueClassName), children: valueFormatter(value, max) })
          ]
        }
      ),
      /* @__PURE__ */ jsx25(
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
  return /* @__PURE__ */ jsx25("div", { className: cn("w-full", className), ...props, children: /* @__PURE__ */ jsx25(
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
import { jsx as jsx26, jsxs as jsxs18 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs18(
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
        /* @__PURE__ */ jsx26(
          "div",
          {
            "aria-hidden": "true",
            className: "absolute inset-y-0 left-0 z-20 overflow-hidden rounded-[6px]",
            style: { width: `${width}%`, backgroundColor: color },
            children: /* @__PURE__ */ jsx26(
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
        /* @__PURE__ */ jsxs18(
          "div",
          {
            className: cn(
              "relative z-10 flex h-full items-center justify-between px-2 text-xs leading-4 font-normal text-black",
              trackTextClassName
            ),
            children: [
              /* @__PURE__ */ jsx26("span", { className: "min-w-0 truncate", children: label }),
              /* @__PURE__ */ jsx26("span", { className: cn("shrink-0 text-black", valueClassName), children: valueLabel })
            ]
          }
        )
      ]
    }
  );
}

// src/toast/toast.tsx
import { AlertCircle, CheckCircle, Info, X as X2 } from "lucide-react";
import { cva as cva4 } from "class-variance-authority";
import { jsx as jsx27, jsxs as jsxs19 } from "react/jsx-runtime";
var toastTitle = cva4("text-[13px] font-medium leading-[18px]", {
  variants: {
    variant: {
      neutral: "text-black",
      // Backwards-compatible alias for the previous "default" variant.
      default: "text-black",
      error: "text-[#E51D31]",
      success: "text-[#129457]",
      warning: "text-[#D18B0C]"
    }
  },
  defaultVariants: { variant: "neutral" }
});
var toastDescription = cva4("text-xs font-normal leading-4", {
  variants: {
    variant: {
      neutral: "text-[#525252]",
      // Backwards-compatible alias for the previous "default" variant.
      default: "text-[#525252]",
      error: "text-[#F13546]",
      success: "text-[#1FB06B]",
      warning: "text-[#E59C0E]"
    }
  },
  defaultVariants: { variant: "neutral" }
});
var toastIcon = cva4("flex size-4 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4", {
  variants: {
    variant: {
      neutral: "text-black",
      // Backwards-compatible alias for the previous "default" variant.
      default: "text-black",
      error: "text-[#E51D31]",
      success: "text-[#129457]",
      warning: "text-[#D18B0C]"
    }
  },
  defaultVariants: { variant: "neutral" }
});
var TOAST_SHADOW = "shadow-[0_4px_8px_0_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_0.5px_2px_0_rgba(0,0,0,0.1),inset_0_0.5px_1px_0_rgba(255,255,255,0.25)]";
var ACTION_BUTTON = "shrink-0 rounded-md border-[0.5px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#26201C_0%,#26201C_100%)] px-2 py-1.5 text-[10px] font-medium leading-[14px] text-white shadow-[0_4px_8px_-4px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1),inset_0_0.5px_1px_0_rgba(255,255,255,0.25)] transition-colors hover:text-white/80 active:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25";
var toneIcons = {
  neutral: /* @__PURE__ */ jsx27(Info, { "aria-hidden": "true" }),
  error: /* @__PURE__ */ jsx27(AlertCircle, { "aria-hidden": "true" }),
  success: /* @__PURE__ */ jsx27(CheckCircle, { "aria-hidden": "true" }),
  warning: /* @__PURE__ */ jsx27(AlertCircle, { "aria-hidden": "true" })
};
function Toast({
  variant = "neutral",
  loading = true,
  title = "Plan saved",
  description = "Your staffing plan was saved to Holly Hills.",
  actionLabel = "View plan",
  onAction,
  onDismiss,
  icon,
  className
}) {
  const tone = variant === "default" ? "neutral" : variant;
  const role = tone === "error" ? "alert" : "status";
  return /* @__PURE__ */ jsxs19(
    "div",
    {
      role,
      className: cn(
        "flex w-fit max-w-[427px] items-center gap-4 rounded-xl bg-white p-3",
        TOAST_SHADOW,
        className
      ),
      children: [
        /* @__PURE__ */ jsxs19("div", { className: "flex min-w-0 flex-1 items-center gap-3", children: [
          /* @__PURE__ */ jsx27("span", { className: toastIcon({ variant }), children: icon ?? toneIcons[tone] }),
          loading && /* @__PURE__ */ jsx27(LoadingSpinner, { size: "s", variant: "stroke", label: "Loading", className: "shrink-0" }),
          /* @__PURE__ */ jsxs19("div", { className: "flex min-w-0 flex-col gap-1", children: [
            /* @__PURE__ */ jsx27("p", { className: toastTitle({ variant }), children: title }),
            /* @__PURE__ */ jsx27("p", { className: cn(toastDescription({ variant }), "truncate"), children: description })
          ] })
        ] }),
        (onAction != null || onDismiss != null) && /* @__PURE__ */ jsxs19("div", { className: "flex shrink-0 items-center gap-3", children: [
          onAction != null && /* @__PURE__ */ jsx27("button", { type: "button", onClick: onAction, className: ACTION_BUTTON, children: actionLabel }),
          onDismiss != null && /* @__PURE__ */ jsx27(
            "button",
            {
              type: "button",
              onClick: onDismiss,
              "aria-label": "Dismiss notification",
              className: "flex shrink-0 items-center justify-center rounded-md p-1.5 text-[#525252] transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
              children: /* @__PURE__ */ jsx27(X2, { className: "size-3.5", "aria-hidden": "true" })
            }
          )
        ] })
      ]
    }
  );
}

// src/drop-zone/drop-zone.tsx
import { useRef as useRef3, useState as useState8 } from "react";
import { CloudUpload } from "lucide-react";
import { jsx as jsx28, jsxs as jsxs20 } from "react/jsx-runtime";
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
  const inputRef = useRef3(null);
  const [isDragging, setIsDragging] = useState8(false);
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
  return /* @__PURE__ */ jsx28(
    "div",
    {
      className: cn(
        "h-[148px] w-full rounded-md border-[0.5px] border-black/5 bg-[#F5F5F5] p-0.5",
        disabled && "bg-[#EBEBEB]",
        className
      ),
      children: /* @__PURE__ */ jsxs20(
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
            /* @__PURE__ */ jsx28(
              CloudUpload,
              {
                className: cn("h-8 w-8 opacity-80", disabled ? "text-[#CCCCCC]" : "text-[#8F8F8F]"),
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ jsxs20("span", { className: "flex flex-col items-center gap-1", children: [
              /* @__PURE__ */ jsx28("span", { className: "text-xs leading-[14px] opacity-80", children: headline }),
              /* @__PURE__ */ jsx28("span", { className: "text-[10px] leading-3 text-[#525252] opacity-80", children: activeState === "dragging" ? "Drop your files" : description })
            ] }),
            /* @__PURE__ */ jsx28(
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
import { Fragment as Fragment3 } from "react";
import { FileText, X as X3 } from "lucide-react";
import { jsx as jsx29, jsxs as jsxs21 } from "react/jsx-runtime";
var statusBorder = {
  ready: "border-dashed border-black/20",
  uploading: "border-black/20",
  uploaded: "border-black/20",
  error: "border-error"
};
var statusMetaColor = {
  ready: "text-gray-500",
  uploading: "text-subtle",
  uploaded: "text-subtle",
  error: "text-error"
};
function FileList({
  status = "ready",
  name = "selected-file.pdf",
  size = "1.68 MB",
  progress = 68,
  onRemove,
  onRetry,
  className
}) {
  const percent = Math.min(100, Math.max(0, Math.round(progress)));
  const metaSegments = status === "ready" ? [size, "Ready to upload"] : status === "uploading" ? ["Uploading", `${percent}%`] : status === "uploaded" ? ["File uploaded", size] : ["Upload failed. Try again"];
  return /* @__PURE__ */ jsxs21(
    "div",
    {
      className: cn(
        "flex h-16 w-full max-w-[520px] items-center justify-between rounded-md border bg-white p-2",
        statusBorder[status],
        className
      ),
      children: [
        /* @__PURE__ */ jsxs21("div", { className: "flex min-w-0 items-center gap-3", children: [
          /* @__PURE__ */ jsx29(
            "span",
            {
              className: cn(
                "flex size-12 shrink-0 items-center justify-center rounded-xxs",
                status === "error" ? "bg-error-subtle" : "bg-gray-75"
              ),
              children: /* @__PURE__ */ jsx29(FileText, { size: 24, "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ jsxs21("div", { className: "flex min-w-0 flex-col gap-1", children: [
            /* @__PURE__ */ jsx29("p", { className: "truncate text-sm font-normal leading-5 text-strong", children: name }),
            /* @__PURE__ */ jsx29(
              "div",
              {
                className: cn(
                  "flex items-center gap-1 text-xs font-normal leading-4",
                  statusMetaColor[status]
                ),
                children: metaSegments.map((segment, index) => /* @__PURE__ */ jsxs21(Fragment3, { children: [
                  index > 0 && /* @__PURE__ */ jsx29("span", { "aria-hidden": "true", children: "\xB7" }),
                  /* @__PURE__ */ jsx29("span", { children: segment })
                ] }, segment))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs21("div", { className: "flex shrink-0 items-center gap-1", children: [
          status === "error" && onRetry && /* @__PURE__ */ jsx29(
            "button",
            {
              type: "button",
              onClick: onRetry,
              className: "inline-flex items-center rounded-full px-3 py-2.5 text-xs font-medium leading-4 text-error outline-none hover:bg-error-subtle focus-visible:ring-2 focus-visible:ring-red-500/20",
              children: "Retry"
            }
          ),
          onRemove && /* @__PURE__ */ jsx29(
            "button",
            {
              type: "button",
              onClick: onRemove,
              className: "flex size-9 items-center justify-center rounded-full text-subtle outline-none hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-black/20",
              "aria-label": `Remove ${name}`,
              children: /* @__PURE__ */ jsx29(X3, { size: 16, "aria-hidden": "true" })
            }
          )
        ] })
      ]
    }
  );
}

// src/progress-ring/progress-ring.tsx
import { jsx as jsx30, jsxs as jsxs22 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs22(
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
        /* @__PURE__ */ jsxs22("svg", { width: spec.size, height: spec.size, className: "-rotate-90", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsx30(
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
          /* @__PURE__ */ jsx30(
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
        /* @__PURE__ */ jsx30(
          "span",
          {
            "aria-hidden": "true",
            className: "absolute rounded-full bg-white",
            style: { inset: spec.stroke }
          }
        ),
        /* @__PURE__ */ jsxs22("span", { className: cn("absolute font-medium text-black tabular-nums", spec.text), children: [
          Math.round(normalizedValue),
          showPercent ? "%" : ""
        ] })
      ]
    }
  );
}

// src/skill-level/skill-level.tsx
import { jsx as jsx31 } from "react/jsx-runtime";
var levelColors = {
  1: "bg-red-400",
  2: "bg-amber-400",
  3: "bg-amber-400",
  4: "bg-green-400",
  5: "bg-green-400"
};
function SkillLevel({ level = 3, max = 5, className, label = `Skill level ${level} of ${max}` }) {
  return /* @__PURE__ */ jsx31("span", { className: cn("inline-flex items-center gap-[3px]", className), role: "img", "aria-label": label, children: Array.from({ length: max }, (_, i) => i + 1).map((dot) => /* @__PURE__ */ jsx31(
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
import { Bell, User } from "lucide-react";
import { cva as cva5 } from "class-variance-authority";
import { jsx as jsx32, jsxs as jsxs23 } from "react/jsx-runtime";
var ACTION_SHADOW = "shadow-[0_4px_8px_-4px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1),inset_0_0.5px_1px_0_rgba(255,255,255,0.25)]";
var emptyStateAction = cva5(
  [
    "inline-flex items-center gap-1 rounded-[6px] px-2 py-1.5",
    "text-2xs font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25",
    "[&>svg]:h-3.5 [&>svg]:w-3.5"
  ],
  {
    variants: {
      variant: {
        secondary: cn(
          "border border-white/10 bg-white text-black",
          ACTION_SHADOW,
          "hover:bg-[#F5F5F5] active:bg-[#F0F0F0]"
        ),
        primary: cn(
          "border-[0.5px] border-white/10 text-white",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#26201C_0%,#26201C_100%)]",
          ACTION_SHADOW,
          "hover:text-white/80 active:text-white/60"
        )
      }
    },
    defaultVariants: { variant: "secondary" }
  }
);
function EmptyState({
  media = "icon",
  icon,
  avatarSrc,
  avatarAlt = "",
  title,
  description,
  actionLabel,
  actionIcon,
  actionVariant = "secondary",
  onAction,
  className
}) {
  return /* @__PURE__ */ jsxs23("div", { className: cn("flex flex-col items-center gap-4 text-center", className), children: [
    media === "icon" && /* @__PURE__ */ jsx32("span", { className: "flex items-center justify-center rounded-xs bg-black/5 p-1 text-black [&>svg]:h-4 [&>svg]:w-4", children: icon ?? /* @__PURE__ */ jsx32(Bell, { "aria-hidden": "true" }) }),
    media === "avatar" && (avatarSrc ? /* @__PURE__ */ jsx32(
      "img",
      {
        src: avatarSrc,
        alt: avatarAlt,
        className: "h-6 w-6 rounded-full border border-black/10 object-cover"
      }
    ) : /* @__PURE__ */ jsx32("span", { className: "flex h-6 w-6 items-center justify-center rounded-full border border-black/10 bg-black/5 text-black [&>svg]:h-3.5 [&>svg]:w-3.5", children: /* @__PURE__ */ jsx32(User, { "aria-hidden": "true" }) })),
    /* @__PURE__ */ jsxs23("div", { className: "flex flex-col items-center gap-0.5", children: [
      /* @__PURE__ */ jsx32("p", { className: "text-body font-medium text-strong", children: title }),
      description && /* @__PURE__ */ jsx32("p", { className: "text-body-sm text-subtle", children: description })
    ] }),
    actionLabel && /* @__PURE__ */ jsxs23(
      "button",
      {
        type: "button",
        onClick: onAction,
        className: emptyStateAction({ variant: actionVariant }),
        children: [
          actionIcon,
          /* @__PURE__ */ jsx32("span", { children: actionLabel })
        ]
      }
    )
  ] });
}

// src/gantt-bar/gantt-bar.tsx
import { jsx as jsx33 } from "react/jsx-runtime";
function GanttBar({ state = "default", children = "2 workers", className, ...props }) {
  const disabled = state === "disabled";
  return /* @__PURE__ */ jsx33(
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

// src/text-field/text-field.tsx
import { useId as useId2 } from "react";
import { Info as Info2 } from "lucide-react";
import { jsx as jsx34, jsxs as jsxs24 } from "react/jsx-runtime";
function TextField(props) {
  const {
    label,
    required = false,
    info,
    hint,
    error = false,
    id,
    className,
    ...rest
  } = props;
  const generatedId = useId2();
  const fieldId = id ?? generatedId;
  const hintId = `${fieldId}-hint`;
  const { multiline = false, ...fieldProps } = rest;
  const describedBy = hint != null ? hintId : void 0;
  const field = multiline ? /* @__PURE__ */ jsx34(
    Textarea,
    {
      ...fieldProps,
      id: fieldId,
      error,
      "aria-describedby": describedBy
    }
  ) : /* @__PURE__ */ jsx34(
    TextInput,
    {
      ...fieldProps,
      id: fieldId,
      error,
      "aria-invalid": error || void 0,
      "aria-describedby": describedBy
    }
  );
  return /* @__PURE__ */ jsxs24("div", { className: cn("flex w-full flex-col gap-2", className), children: [
    /* @__PURE__ */ jsxs24("div", { className: "flex items-center gap-0.5", children: [
      /* @__PURE__ */ jsx34("label", { htmlFor: fieldId, className: "text-sm font-medium leading-5 text-black", children: label }),
      required ? /* @__PURE__ */ jsx34("span", { "aria-hidden": "true", className: "text-sm font-medium leading-5 text-[#C0180C]", children: "*" }) : /* @__PURE__ */ jsx34("span", { className: "text-sm leading-5 text-[#8F8F8F]", children: "(Optional)" }),
      info != null && /* @__PURE__ */ jsx34(Tooltip, { body: info, children: /* @__PURE__ */ jsx34(Info2, { size: 14, className: "text-[#8F8F8F]", "aria-hidden": "true" }) })
    ] }),
    field,
    hint != null && /* @__PURE__ */ jsxs24("div", { className: cn("flex items-center gap-1", error ? "text-red-500" : "text-black"), children: [
      /* @__PURE__ */ jsx34(Info2, { size: 12, className: "shrink-0", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx34("span", { id: hintId, className: "text-xs leading-4", children: hint })
    ] })
  ] });
}

// src/timeline/timeline.tsx
import { cva as cva6 } from "class-variance-authority";
import { Check } from "lucide-react";
import { jsx as jsx35, jsxs as jsxs25 } from "react/jsx-runtime";
var timeline = cva6("relative inline-flex items-center justify-between", {
  variants: {
    orientation: {
      vertical: "h-[197px] w-4 flex-col",
      horizontal: "h-4 w-[199px] flex-row"
    }
  },
  defaultVariants: { orientation: "vertical" }
});
var lineClasses = {
  vertical: "absolute top-0 bottom-0 left-1/2 w-[1.5px] -translate-x-1/2",
  horizontal: "absolute left-0 right-0 top-1/2 h-[1.5px] -translate-y-1/2"
};
var progressLineClasses = {
  vertical: "absolute top-0 left-1/2 w-[1.5px] -translate-x-1/2",
  horizontal: "absolute left-0 top-1/2 h-[1.5px] -translate-y-1/2"
};
function StepMarker({ status }) {
  if (status === "completed") {
    return /* @__PURE__ */ jsx35(
      "span",
      {
        "aria-hidden": "true",
        className: "flex size-2.5 items-center justify-center rounded-full bg-green-500",
        children: /* @__PURE__ */ jsx35(Check, { size: 7, strokeWidth: 3.5, className: "text-white", "aria-hidden": "true" })
      }
    );
  }
  if (status === "current") {
    return /* @__PURE__ */ jsx35(
      "span",
      {
        "aria-hidden": "true",
        className: "flex size-2.5 items-center justify-center rounded-full border-2 border-green-500 bg-white",
        children: /* @__PURE__ */ jsx35("span", { className: "size-1 rounded-full bg-green-500" })
      }
    );
  }
  return /* @__PURE__ */ jsx35(
    "span",
    {
      "aria-hidden": "true",
      className: "size-2 rounded-full bg-[rgb(207_199_188)]"
    }
  );
}
function Timeline({
  orientation = "vertical",
  steps = 4,
  label = "Progress",
  className,
  ...props
}) {
  const resolvedSteps = typeof steps === "number" ? Array.from({ length: Math.max(0, Math.round(steps)) }, () => ({})) : steps;
  const lastActiveIndex = resolvedSteps.reduce(
    (acc, step, index) => (step.status ?? "completed") !== "upcoming" ? index : acc,
    -1
  );
  const progressPercent = resolvedSteps.length > 1 && lastActiveIndex > 0 ? lastActiveIndex / (resolvedSteps.length - 1) * 100 : 0;
  return /* @__PURE__ */ jsxs25(
    "div",
    {
      role: "list",
      "aria-label": label,
      className: cn(timeline({ orientation }), className),
      ...props,
      children: [
        /* @__PURE__ */ jsx35(
          "span",
          {
            "aria-hidden": "true",
            className: cn("bg-[rgb(226_220_212)]", lineClasses[orientation ?? "vertical"])
          }
        ),
        progressPercent > 0 && /* @__PURE__ */ jsx35(
          "span",
          {
            "aria-hidden": "true",
            className: cn(
              "bg-green-500",
              progressLineClasses[orientation ?? "vertical"]
            ),
            style: (orientation ?? "vertical") === "horizontal" ? { width: `${progressPercent}%` } : { height: `${progressPercent}%` }
          }
        ),
        resolvedSteps.map((step, index) => {
          const status = step.status ?? "completed";
          return /* @__PURE__ */ jsx35(
            "span",
            {
              role: "listitem",
              "aria-label": step.label ?? `Step ${index + 1}: ${status}`,
              "aria-current": status === "current" ? "step" : void 0,
              title: step.label,
              className: "relative flex size-2.5 shrink-0 items-center justify-center",
              children: /* @__PURE__ */ jsx35(StepMarker, { status })
            },
            index
          );
        })
      ]
    }
  );
}

// src/dropdown/dropdown.tsx
import {
  useEffect as useEffect2,
  useId as useId3,
  useRef as useRef4,
  useState as useState9
} from "react";
import { Check as Check2, ChevronDown as ChevronDown3 } from "lucide-react";
import { jsx as jsx36, jsxs as jsxs26 } from "react/jsx-runtime";
function Dropdown({
  size = "md",
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select\u2026",
  leading,
  error = false,
  disabled = false,
  open,
  filterable = false,
  className,
  "aria-label": ariaLabel
}) {
  const [internalValue, setInternalValue] = useState9(defaultValue);
  const selectedValue = value !== void 0 ? value : internalValue;
  const selected = options.find((o) => o.value === selectedValue);
  const [internalOpen, setInternalOpen] = useState9(false);
  const isOpen = !disabled && (open ?? internalOpen);
  const [query, setQuery] = useState9(null);
  const [activeIndex, setActiveIndex] = useState9(-1);
  const rootRef = useRef4(null);
  const inputRef = useRef4(null);
  const listboxId = useId3();
  const filterOptions = (q) => q === "" ? options : options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));
  const visibleOptions = filterable && query != null ? filterOptions(query) : options;
  useEffect2(() => {
    if (!internalOpen) return;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setInternalOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setInternalOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [internalOpen]);
  useEffect2(() => {
    if (!isOpen) setQuery(null);
  }, [isOpen]);
  useEffect2(() => {
    if (!isOpen || activeIndex < 0) return;
    document.getElementById(`${listboxId}-option-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen, listboxId]);
  const enabledIndexes = visibleOptions.map((o, i) => o.disabled ? -1 : i).filter((i) => i >= 0);
  const initialActive = (dir) => {
    const selectedIndex = visibleOptions.findIndex((o) => o.value === selectedValue && !o.disabled);
    if (selectedIndex >= 0) return selectedIndex;
    if (enabledIndexes.length === 0) return -1;
    return dir === 1 ? enabledIndexes[0] : enabledIndexes[enabledIndexes.length - 1];
  };
  const moveActive = (dir) => {
    setActiveIndex((prev) => {
      if (enabledIndexes.length === 0) return -1;
      const pos = enabledIndexes.indexOf(prev);
      if (pos < 0) return dir === 1 ? enabledIndexes[0] : enabledIndexes[enabledIndexes.length - 1];
      return enabledIndexes[(pos + dir + enabledIndexes.length) % enabledIndexes.length];
    });
  };
  const openList = () => {
    if (disabled) return;
    setInternalOpen(true);
    setActiveIndex(initialActive(1));
  };
  const toggleList = () => {
    if (disabled) return;
    if (isOpen) setInternalOpen(false);
    else openList();
  };
  const selectOption = (option) => {
    if (option.disabled) return;
    if (value === void 0) setInternalValue(option.value);
    onChange?.(option.value);
    setQuery(null);
    setInternalOpen(false);
  };
  const onTriggerKeyDown = (e) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        const dir = e.key === "ArrowDown" ? 1 : -1;
        if (isOpen) {
          moveActive(dir);
        } else {
          setInternalOpen(true);
          setActiveIndex(initialActive(dir));
        }
        break;
      }
      case "Enter":
      case " ": {
        if (isOpen) {
          e.preventDefault();
          const option = activeIndex >= 0 ? visibleOptions[activeIndex] : void 0;
          if (option) selectOption(option);
          else setInternalOpen(false);
        }
        break;
      }
      case "Escape": {
        if (isOpen) {
          e.stopPropagation();
          setInternalOpen(false);
        }
        break;
      }
    }
  };
  const onInputChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    setInternalOpen(true);
    setActiveIndex(filterOptions(q).findIndex((o) => !o.disabled));
  };
  const onInputKeyDown = (e) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        const dir = e.key === "ArrowDown" ? 1 : -1;
        if (isOpen) {
          moveActive(dir);
        } else {
          setInternalOpen(true);
          setActiveIndex(initialActive(dir));
        }
        break;
      }
      case "Enter": {
        if (isOpen) {
          e.preventDefault();
          const option = activeIndex >= 0 ? visibleOptions[activeIndex] : void 0;
          if (option) selectOption(option);
          else setInternalOpen(false);
        }
        break;
      }
      case "Escape": {
        if (query) {
          e.stopPropagation();
          setQuery(null);
          setActiveIndex(-1);
        } else if (isOpen) {
          e.stopPropagation();
          setInternalOpen(false);
        }
        break;
      }
    }
  };
  const iconSize = size === "sm" ? 12 : 18;
  return /* @__PURE__ */ jsxs26("div", { ref: rootRef, className: cn("relative", className), children: [
    /* @__PURE__ */ jsx36(
      "div",
      {
        className: cn(
          "flex w-full items-center rounded-[6px] border-[0.5px]",
          size === "sm" && "h-8",
          disabled ? "border-black/10 bg-[#EBEBEB]" : error ? "border-red-500 bg-[#F5F5F5] focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]" : "border-black/10 bg-[#F5F5F5] focus-within:border-black focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]"
        ),
        children: filterable ? /* @__PURE__ */ jsxs26(
          "div",
          {
            onClick: () => {
              if (disabled) return;
              inputRef.current?.focus();
              if (!isOpen) openList();
            },
            className: cn(
              "flex min-w-0 flex-1 items-center gap-2 bg-transparent",
              size === "sm" ? "px-2 text-[12px] leading-[16px]" : "p-3 text-sm leading-5",
              disabled && "cursor-not-allowed"
            ),
            children: [
              leading != null && /* @__PURE__ */ jsx36(
                "span",
                {
                  className: cn(
                    "flex shrink-0 items-center",
                    disabled ? "text-[#8F8F8F]" : "text-[#525252]"
                  ),
                  children: leading
                }
              ),
              /* @__PURE__ */ jsx36(
                "input",
                {
                  ref: inputRef,
                  type: "text",
                  role: "combobox",
                  "aria-expanded": isOpen,
                  "aria-controls": isOpen ? listboxId : void 0,
                  "aria-autocomplete": "list",
                  "aria-activedescendant": isOpen && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : void 0,
                  "aria-label": ariaLabel,
                  disabled,
                  value: query ?? selected?.label ?? "",
                  placeholder,
                  onChange: onInputChange,
                  onKeyDown: onInputKeyDown,
                  className: cn(
                    "min-w-0 flex-1 bg-transparent text-black outline-none placeholder:text-[#525252]",
                    disabled && "cursor-not-allowed text-[#8F8F8F] placeholder:text-[#8F8F8F]"
                  )
                }
              ),
              /* @__PURE__ */ jsx36(
                ChevronDown3,
                {
                  size: iconSize,
                  "aria-hidden": true,
                  className: cn(
                    "shrink-0 transition-transform duration-150",
                    isOpen && "rotate-180",
                    disabled ? "text-[#8F8F8F]" : "text-[#525252]"
                  )
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxs26(
          "button",
          {
            type: "button",
            disabled,
            "aria-haspopup": "listbox",
            "aria-expanded": isOpen,
            "aria-controls": isOpen ? listboxId : void 0,
            "aria-activedescendant": isOpen && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : void 0,
            "aria-label": ariaLabel,
            onClick: toggleList,
            onKeyDown: onTriggerKeyDown,
            className: cn(
              "flex min-w-0 flex-1 items-center gap-2 bg-transparent text-left outline-none",
              size === "sm" ? "px-2 text-[12px] leading-[16px]" : "p-3 text-sm leading-5",
              disabled && "cursor-not-allowed"
            ),
            children: [
              leading != null && /* @__PURE__ */ jsx36(
                "span",
                {
                  className: cn(
                    "flex shrink-0 items-center",
                    disabled ? "text-[#8F8F8F]" : "text-[#525252]"
                  ),
                  children: leading
                }
              ),
              /* @__PURE__ */ jsx36(
                "span",
                {
                  className: cn(
                    "min-w-0 flex-1 truncate",
                    disabled ? "text-[#8F8F8F]" : selected ? "text-black" : "text-[#525252]"
                  ),
                  children: selected ? selected.label : placeholder
                }
              ),
              /* @__PURE__ */ jsx36(
                ChevronDown3,
                {
                  size: iconSize,
                  "aria-hidden": true,
                  className: cn(
                    "shrink-0 transition-transform duration-150",
                    isOpen && "rotate-180",
                    disabled ? "text-[#8F8F8F]" : "text-[#525252]"
                  )
                }
              )
            ]
          }
        )
      }
    ),
    isOpen && /* @__PURE__ */ jsx36(
      "div",
      {
        role: "listbox",
        id: listboxId,
        "aria-label": ariaLabel,
        className: cn(
          "absolute left-0 top-full z-50 mt-1 flex max-h-60 w-full flex-col gap-1 overflow-y-auto",
          "rounded-[6px] border-[0.5px] border-black/10 bg-white p-1",
          "shadow-[0_1px_1px_0_rgba(0,0,0,0.05),0_4px_8px_0_rgba(0,0,0,0.05),0_2px_4px_0_rgba(0,0,0,0.05)]"
        ),
        children: visibleOptions.length === 0 ? /* @__PURE__ */ jsx36(ListBase, { size, state: "disabled", className: "cursor-default", "aria-hidden": "true", children: "No results" }) : visibleOptions.map((option, i) => {
          const isSelected = option.value === selectedValue;
          return /* @__PURE__ */ jsx36(
            ListBase,
            {
              id: `${listboxId}-option-${i}`,
              role: "option",
              "aria-selected": isSelected,
              "aria-disabled": option.disabled || void 0,
              size,
              state: option.disabled ? "disabled" : i === activeIndex ? "hover" : isSelected ? "selected" : "default",
              trailing: isSelected ? /* @__PURE__ */ jsx36(Check2, { "aria-hidden": true }) : void 0,
              className: option.disabled ? void 0 : "cursor-pointer",
              onClick: () => selectOption(option),
              onMouseEnter: () => {
                if (!option.disabled) setActiveIndex(i);
              },
              children: option.label
            },
            option.value
          );
        })
      }
    )
  ] });
}

// src/combobox/combobox.tsx
import { useId as useId4 } from "react";
import { Info as Info3 } from "lucide-react";
import { jsx as jsx37, jsxs as jsxs27 } from "react/jsx-runtime";
function Combobox({
  label,
  required = false,
  info,
  hint,
  error = false,
  id,
  className,
  ...dropdownProps
}) {
  const generatedId = useId4();
  const fieldId = id ?? generatedId;
  const labelId = `${fieldId}-label`;
  const hintId = `${fieldId}-hint`;
  const describedBy = hint != null ? hintId : void 0;
  const triggerLabel = dropdownProps["aria-label"] ?? (typeof label === "string" ? label : void 0);
  return /* @__PURE__ */ jsxs27(
    "div",
    {
      role: "group",
      "aria-labelledby": labelId,
      "aria-describedby": describedBy,
      className: cn("flex w-full flex-col gap-2", className),
      children: [
        /* @__PURE__ */ jsxs27("div", { className: "flex items-center gap-0.5", children: [
          /* @__PURE__ */ jsx37("span", { id: labelId, className: "text-sm font-medium leading-5 text-black", children: label }),
          required ? /* @__PURE__ */ jsx37("span", { "aria-hidden": "true", className: "text-sm font-medium leading-5 text-[#C0180C]", children: "*" }) : /* @__PURE__ */ jsx37("span", { className: "text-sm leading-5 text-[#8F8F8F]", children: "(Optional)" }),
          info != null && /* @__PURE__ */ jsx37(Tooltip, { body: info, children: /* @__PURE__ */ jsx37(Info3, { size: 14, className: "text-[#8F8F8F]", "aria-hidden": "true" }) })
        ] }),
        /* @__PURE__ */ jsx37(Dropdown, { ...dropdownProps, "aria-label": triggerLabel, error }),
        hint != null && /* @__PURE__ */ jsxs27("div", { className: cn("flex items-center gap-1", error ? "text-red-500" : "text-black"), children: [
          /* @__PURE__ */ jsx37(Info3, { size: 12, className: "shrink-0", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx37("span", { id: hintId, className: "text-xs leading-4", children: hint })
        ] })
      ]
    }
  );
}
export {
  AccountSwitcher,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  CHART_TOOLTIP_SHADOW,
  ChartTooltip,
  Checkbox,
  Combobox,
  DropZone,
  Dropdown,
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
  TextField,
  TextInput,
  Textarea,
  Timeline,
  Toast,
  Tooltip,
  buttonVariants,
  cn
};
