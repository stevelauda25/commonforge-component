import { type ButtonHTMLAttributes } from "react"
import { cn } from "../lib/cn.js"

export type RadioSize = "sm" | "md" | "lg"

export interface RadioProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  size?: RadioSize
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const SIZES: Record<
  RadioSize,
  { outer: string; inner: string }
> = {
  sm: { outer: "size-3", inner: "size-2" },
  md: { outer: "size-4", inner: "size-2" },
  lg: { outer: "size-5", inner: "size-3" },
}

/**
 * radio — a single-select control.
 *
 * Figma spec:
 *   sm: 12px outer, 8px inner dot (2px ring)
 *   md: 16px outer, 8px inner dot (4px ring)
 *   lg: 20px outer, 12px inner dot (4px ring)
 * Unchecked: 1px #B8B8B8 border, transparent background.
 * Hover/selected unchecked: border #201B18.
 * Checked: border #201B18, inner dot #201B18.
 */
export function Radio({
  size = "md",
  checked = false,
  disabled = false,
  className,
  onCheckedChange,
  onClick,
  ...props
}: RadioProps) {
  const s = SIZES[size]

  return (
    <button
      {...props}
      type={props.type ?? "button"}
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      onClick={(event) => {
        onCheckedChange?.(!checked)
        onClick?.(event)
      }}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full border outline-none focus-visible:ring-2 focus-visible:ring-[#CFC7BC] motion-safe:transition-colors motion-reduce:transition-none",
        s.outer,
        checked
          ? "border-[#201B18] bg-transparent"
          : "border-[#B8B8B8] bg-transparent",
        !disabled && !checked && "hover:border-[#201B18]",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      )}
    >
      {checked && (
        <span
          aria-hidden="true"
          className={cn("rounded-full bg-[#201B18]", s.inner)}
        />
      )}
    </button>
  )
}
