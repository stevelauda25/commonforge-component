import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "../lib/cn.js"

export type GanttBarState = "default" | "hover" | "focus" | "disabled"

export interface GanttBarProps extends HTMLAttributes<HTMLDivElement> {
  state?: GanttBarState
  children?: ReactNode
}

export function GanttBar({ state = "default", children = "2 workers", className, ...props }: GanttBarProps) {
  const disabled = state === "disabled"

  return (
    <div
      {...props}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex h-[20.233px] w-[204.651px] items-center rounded-[2.558px] p-[5.116px] text-[10.233px] leading-none shadow-[inset_0_0_0_0.64px_rgba(0,0,0,0.1),inset_0_-0.64px_0.64px_rgba(0,0,0,0.2),inset_0_0.64px_0.64px_rgba(255,255,255,0.2)]",
        disabled ? "bg-[#D3D2CF] text-[#8F8F8F]" : "bg-[#A2A19A] text-white",
        state === "hover" && "bg-[#92918B]",
        state === "focus" && "bg-[#92918B] ring-2 ring-black/25",
        className,
      )}
    >
      {children}
    </div>
  )
}
