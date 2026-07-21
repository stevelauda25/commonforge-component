"use client";

import { useState, type ReactElement, type ReactNode } from "react"
import { cn } from "../lib/cn.js"

export type TooltipSide = "top" | "right" | "bottom" | "left"

export interface TooltipProps {
  children: ReactElement
  body: ReactNode
  title?: ReactNode
  side?: TooltipSide
  open?: boolean
  defaultOpen?: boolean
  className?: string
}

const positionClasses: Record<TooltipSide, string> = {
  top: "bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2",
  right: "left-[calc(100%+10px)] top-1/2 -translate-y-1/2",
  bottom: "left-1/2 top-[calc(100%+10px)] -translate-x-1/2",
  left: "right-[calc(100%+10px)] top-1/2 -translate-y-1/2",
}

const arrowClasses: Record<TooltipSide, string> = {
  top: "-bottom-[5px] left-1/2 -translate-x-1/2",
  right: "-left-[5px] top-1/2 -translate-y-1/2",
  bottom: "-top-[5px] left-1/2 -translate-x-1/2",
  left: "-right-[5px] top-1/2 -translate-y-1/2",
}

export function Tooltip({
  children,
  body,
  title,
  side = "top",
  open,
  defaultOpen = false,
  className,
}: TooltipProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = open ?? internalOpen

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => open === undefined && setInternalOpen(true)}
      onMouseLeave={() => open === undefined && setInternalOpen(false)}
      onFocusCapture={() => open === undefined && setInternalOpen(true)}
      onBlurCapture={() => open === undefined && setInternalOpen(false)}
    >
      {children}
      {isOpen && (
        <span
          role="tooltip"
          className={cn(
            "absolute z-50 w-max max-w-64 rounded-[12px] bg-white px-4 py-[10px] text-left shadow-[0_4px_8px_-4px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0.5px_1px_0_rgba(255,255,255,0.25)]",
            positionClasses[side],
            className,
          )}
        >
          <span className={cn("flex flex-col", title != null && "gap-1")}>
            {title != null && <span className="text-sm font-medium leading-5 text-black">{title}</span>}
            <span
              className={cn(
                "block text-black",
                title != null ? "text-xs leading-4 text-[#525252]" : "text-sm leading-5",
              )}
            >
              {body}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={cn("absolute size-[10px] rotate-45 bg-white", arrowClasses[side])}
          />
        </span>
      )}
    </span>
  )
}
