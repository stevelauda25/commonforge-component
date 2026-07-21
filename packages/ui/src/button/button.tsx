import {
  type ButtonHTMLAttributes,
  type ReactNode,
  forwardRef,
} from "react";
import { LoaderCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn.js";

/**
 * Figma button shadow recipe: three stacked drop shadows plus three inner
 * shadows. Shared by primary, danger, secondary, outline and inverse variants.
 */
const BUTTON_SHADOW =
  "shadow-[0_4px_8px_-4px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1),inset_0_0.5px_1px_0_rgba(255,255,255,0.25)]";

const buttonVariants = cva(
  [
    "group inline-flex items-center justify-center rounded-[6px] font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25",
    "disabled:pointer-events-none",
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
          "[&:disabled:not([data-loading=true])]:bg-[#FADBD8] [&:disabled:not([data-loading=true])]:text-[#7A1710] [&:disabled:not([data-loading=true])]:shadow-none",
          "[&:disabled:not([data-loading=true])]:shadow-[0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1)]"
        ),
        // Backwards-compatible alias for the previous "default" variant.
        default: cn(
          "text-[#FFFFFF]",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#C0180C_0%,#C0180C_100%)]",
          BUTTON_SHADOW,
          "hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#C0180C_0%,#C0180C_100%)] hover:text-white/80",
          "active:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#C0180C_0%,#C0180C_100%)]",
          "[&:disabled:not([data-loading=true])]:bg-[#FADBD8] [&:disabled:not([data-loading=true])]:text-[#7A1710] [&:disabled:not([data-loading=true])]:shadow-none",
          "[&:disabled:not([data-loading=true])]:shadow-[0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1)]"
        ),
        danger: cn(
          "text-[#FFFFFF]",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)]",
          BUTTON_SHADOW,
          "hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)] hover:text-white/80",
          "active:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)]",
          "[&:disabled:not([data-loading=true])]:bg-[#FAD7DB] [&:disabled:not([data-loading=true])]:text-[#7A1020] [&:disabled:not([data-loading=true])]:shadow-none",
          "[&:disabled:not([data-loading=true])]:shadow-[0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1)]"
        ),
        // Backwards-compatible alias for the previous "destructive" variant.
        destructive: cn(
          "text-[#FFFFFF]",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)]",
          BUTTON_SHADOW,
          "hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)] hover:text-white/80",
          "active:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#E51D31_0%,#E51D31_100%)]",
          "[&:disabled:not([data-loading=true])]:bg-[#FAD7DB] [&:disabled:not([data-loading=true])]:text-[#7A1020] [&:disabled:not([data-loading=true])]:shadow-none",
          "[&:disabled:not([data-loading=true])]:shadow-[0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1)]"
        ),
        secondary: cn(
          "border-[0.5px] border-white/10 bg-white text-primary",
          BUTTON_SHADOW,
          "hover:bg-[#F5F5F5] hover:text-primary/80",
          "active:bg-[#F0F0F0] active:text-primary/60",
          "[&:disabled:not([data-loading=true])]:bg-[#E0E0E0] [&:disabled:not([data-loading=true])]:text-primary/50",
          "[&:disabled:not([data-loading=true])]:shadow-[0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1)]"
        ),
        outline: cn(
          "border border-[#8F8F8F] bg-white text-primary",
          "hover:border-[#666666] hover:bg-[#F5F5F5] hover:text-primary/80",
          "active:border-[#666666] active:bg-[#F0F0F0] active:text-primary/60",
          "[&:disabled:not([data-loading=true])]:border-[#C2C2C2] [&:disabled:not([data-loading=true])]:bg-[#E0E0E0] [&:disabled:not([data-loading=true])]:text-primary/50"
        ),
        ghost: cn(
          "bg-transparent text-[#525252]",
          "hover:bg-[#F5F5F5] hover:text-primary/80",
          "active:bg-[#F0F0F0] active:text-primary/60",
          "[&:disabled:not([data-loading=true])]:text-primary/50"
        ),
        inverse: cn(
          "border border-white/10 text-white",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#26201C_0%,#26201C_100%)]",
          BUTTON_SHADOW,
          "hover:text-white/80",
          "active:text-white/60",
          "[&:disabled:not([data-loading=true])]:bg-[#26201C] [&:disabled:not([data-loading=true])]:text-white/50 [&:disabled:not([data-loading=true])]:shadow-none",
          "[&:disabled:not([data-loading=true])]:shadow-[0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1)]"
        ),
      },
      size: {
        xs: "h-[27px] gap-2 px-2 py-1.5 text-caption leading-caption",
        sm: "h-9 gap-2 px-3 py-2.5 text-xs leading-4",
        md: "h-11 gap-2 px-4 py-3 text-sm leading-5",
        default: "h-11 gap-2 px-4 py-3 text-sm leading-5",
        lg: "h-14 gap-2 px-6 py-4 text-base leading-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** leading icon (auto-sized: xs=12, sm=16, md=20, lg=24) */
  leftIcon?: ReactNode;
  /** trailing icon (auto-sized: xs=12, sm=16, md=20, lg=24) */
  rightIcon?: ReactNode;
  /** show a loading state and disable the button */
  loading?: boolean;
  className?: string;
}

/** Figma icon container sizes per button size. */
const iconSizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  default: "w-5 h-5",
  lg: "w-6 h-6",
};

/**
 * button — the base button atom.
 *
 * Built from the Figma "Button" component set. It supports
 * six visual types (primary, danger, secondary, outline, ghost, inverse) and
 * four sizes (lg, md, sm, xs). All states are driven by Tailwind pseudo
 * classes: hover, active (pressed) and disabled.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      leftIcon,
      rightIcon,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const resolvedVariant = variant ?? "primary";
    const isLightText =
      resolvedVariant === "primary" ||
      resolvedVariant === "default" ||
      resolvedVariant === "danger" ||
      resolvedVariant === "destructive" ||
      resolvedVariant === "inverse";

    const dimOnHover = resolvedVariant === "primary" || resolvedVariant === "default" ? "group-hover:opacity-80" : undefined;
    const dimWrapper = isDisabled && !["secondary", "ghost", "primary", "default", "danger", "destructive", "inverse", "outline"].includes(variant ?? "")
      ? "opacity-50"
      : dimOnHover;
    const iconSize = iconSizes[size ?? "md"];

    return (
      <button
        ref={ref}
        type="button"
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        data-loading={loading || undefined}
        {...props}
      >
        <span
          className={cn(
            "inline-flex items-center justify-center gap-2",
            dimWrapper,
          )}
        >
          {loading ? (
            <span className={cn("flex shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full", iconSize)}>
              <LoaderCircle aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
            </span>
          ) : leftIcon ? (
            <span className={cn("flex shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full", iconSize)}>
              {leftIcon}
            </span>
          ) : null}
          <span
            className={cn(
              isLightText && "text-[#FFFFFF] drop-shadow-[0_4px_2px_rgba(0,0,0,0.08)]",
              disabled && !loading &&
                (resolvedVariant === "primary" || resolvedVariant === "default") &&
                "text-[#7A1710] drop-shadow-none",
              disabled && !loading &&
                (resolvedVariant === "danger" || resolvedVariant === "destructive") &&
                "text-[#7A1020] drop-shadow-none",
            )}
          >
            {children}
          </span>
          {rightIcon && (
            <span className={cn("flex shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full", iconSize)}>
              {rightIcon}
            </span>
          )}
        </span>
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
