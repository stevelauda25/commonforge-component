"use client";

import { useState, type ReactElement, type ReactNode } from "react"
import { cn } from "../lib/cn.js"

export type TooltipPlacement = "top" | "right" | "bottom" | "left"

/** @deprecated Use TooltipPlacement. */
export type TooltipSide = TooltipPlacement

export interface TooltipProps {
  children: ReactElement
  body: ReactNode
  title?: ReactNode
  placement?: TooltipPlacement
  /** @deprecated Use placement. */
  side?: TooltipSide
  open?: boolean
  defaultOpen?: boolean
  className?: string
}

const positionClasses: Record<TooltipPlacement, string> = {
  top: "bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2",
  right: "left-[calc(100%+10px)] top-1/2 -translate-y-1/2",
  bottom: "left-1/2 top-[calc(100%+10px)] -translate-x-1/2",
  left: "right-[calc(100%+10px)] top-1/2 -translate-y-1/2",
}

const arrowClasses: Record<TooltipPlacement, string> = {
  top: "-bottom-[10px] left-1/2 -translate-x-1/2 [clip-path:polygon(0_0,100%_0,50%_100%)]",
  right: "-left-[10px] top-1/2 -translate-y-1/2 [clip-path:polygon(0_50%,100%_0,100%_100%)]",
  bottom: "-top-[10px] left-1/2 -translate-x-1/2 [clip-path:polygon(50%_0,0_100%,100%_100%)]",
  left: "-right-[10px] top-1/2 -translate-y-1/2 [clip-path:polygon(0_0,0_100%,100%_50%)]",
}

export function Tooltip({
  children,
  body,
  title,
  placement,
  side,
  open,
  defaultOpen = false,
  className,
}: TooltipProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = open ?? internalOpen
  const resolvedPlacement = placement ?? side ?? "top"

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
            "absolute z-50 w-max max-w-72 rounded-[12px] bg-white px-4 py-2.5 text-left shadow-[0_4px_8px_-4px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0.5px_1px_0_rgba(255,255,255,0.25)]",
            positionClasses[resolvedPlacement],
            className,
          )}
        >
          <span className={cn("flex flex-col", title != null && "gap-1")}>
            {title != null && <span className="text-[13px] font-medium leading-[18px] text-black">{title}</span>}
            <span
              className={cn(
                "block text-[#525252]",
                title != null ? "text-xs leading-4" : "text-[13px] leading-[18px]",
              )}
            >
              {body}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={cn("absolute h-[10px] w-5 bg-white", arrowClasses[resolvedPlacement])}
          />
        </span>
      )}
    </span>
  )
}
