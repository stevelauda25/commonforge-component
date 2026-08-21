import type { ButtonHTMLAttributes, ReactNode } from "react"
import { Plus, X } from "lucide-react"
import { cn } from "../lib/cn.js"

export type TagVariant = "default" | "add" | "removable" | "selected" | "placeholder"

export interface TagProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TagVariant
  children: ReactNode
}

export function Tag({ variant = "default", children, className, ...props }: TagProps) {
  const isPlaceholder = variant === "placeholder"
  const isSelected = variant === "selected"
  const hasPlus = variant === "add" || isPlaceholder

  return (
    <button
      {...props}
      type={props.type ?? "button"}
      className={cn(
        "inline-flex h-[21px] items-center gap-1 whitespace-nowrap rounded-[4px] border px-2 py-1 text-[10px] leading-[13px] outline-none focus-visible:ring-2 focus-visible:ring-[#CFC7BC]",
        isPlaceholder
          ? "border-dashed border-black/15 bg-transparent text-[#8F8F8F]"
          : isSelected
            ? "border-[#26201C] bg-[#26201C] text-white"
            : "border-[#A3A3A3] bg-white text-[#525252]",
        className,
      )}
    >
      {hasPlus && <Plus size={8} aria-hidden="true" />}
      <span>{children}</span>
      {variant === "removable" && <X size={8} aria-hidden="true" />}
    </button>
  )
}
