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
  const isSelected = variant === "selected" || variant === "removable"

  return (
    <button
      {...props}
      type={props.type ?? "button"}
      className={cn(
        "inline-flex h-[21px] items-center gap-1 whitespace-nowrap rounded-[4px] border-[0.5px] px-2 py-1 text-[10px] leading-[13px] outline-none focus-visible:ring-2 focus-visible:ring-black/15",
        isPlaceholder
          ? "border-[#8F8F8F] bg-transparent text-[#8F8F8F]"
          : isSelected
            ? "border-black bg-white text-black"
            : "border-[#A3A3A3] bg-white text-[#525252]",
        className,
      )}
    >
      {variant === "add" && <Plus size={8} aria-hidden="true" />}
      <span>{children}</span>
      {variant === "removable" && <X size={8} aria-hidden="true" />}
    </button>
  )
}
