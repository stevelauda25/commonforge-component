"use client";

import { useState, type ButtonHTMLAttributes } from "react"
import { cn } from "../lib/cn.js"

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  size?: "sm" | "md"
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function Switch({
  size = "md",
  checked,
  defaultChecked = false,
  disabled,
  onCheckedChange,
  className,
  ...props
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isChecked = checked ?? internalChecked
  const isSmall = size === "sm"

  function toggle() {
    if (disabled) return
    const next = !isChecked
    if (checked === undefined) setInternalChecked(next)
    onCheckedChange?.(next)
  }

  return (
    <button
      {...props}
      type={props.type ?? "button"}
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={toggle}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full border-[0.5px] border-white/5 p-0.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2",
        isSmall ? "h-5 w-9" : "h-6 w-11",
        isChecked ? "bg-green-600 hover:bg-green-800" : "bg-[#F5F5F5] hover:bg-[#EBEBEB]",
        disabled && "cursor-not-allowed bg-[#F5F5F5] hover:bg-[#F5F5F5]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "block rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.16)] transition-transform duration-150",
          isSmall ? "size-4" : "size-5",
          disabled ? "bg-[#D1D1D1]" : "bg-white",
          isChecked ? (isSmall ? "translate-x-4" : "translate-x-5") : "translate-x-0",
        )}
      />
    </button>
  )
}
