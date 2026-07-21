"use client";

import { useState } from "react"
import { cn } from "../lib/cn.js"

export type SliderVariant = "default" | "range" | "no-value"

export interface SliderProps {
  variant?: SliderVariant
  min?: number
  max?: number
  value?: number
  defaultValue?: number
  valueEnd?: number
  defaultValueEnd?: number
  showValue?: boolean
  onValueChange?: (value: number) => void
  onRangeChange?: (range: [number, number]) => void
  label?: string
  className?: string
}

/**
 * 6-layer button-style shadow recipe (BUTTON_SHADOW in the shared recipes):
 * three stacked drop shadows plus three inner shadows.
 */
const HANDLE_SHADOW =
  "0 4px 8px -4px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.15), 0 1px 2px -1px rgba(0,0,0,0.2), inset 0 0 0 0.5px rgba(0,0,0,0.1), inset 0 -0.5px 0.5px 0 rgba(0,0,0,0.1), inset 0 0.5px 1px 0 rgba(255,255,255,0.25)"

const HANDLE_SHADOW_CLASS =
  "shadow-[0_4px_8px_-4px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1),inset_0_0.5px_1px_0_rgba(255,255,255,0.25)]"

/**
 * Native range-input reset plus the spec'd handle (10px dot, #FAFAFA fill,
 * 0.5px black/20 border, button shadow). The input itself is click-through
 * and only the thumb receives pointer events, so the two stacked inputs in
 * range mode can each be dragged.
 */
const SLIDER_CSS = `
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
`

export function Slider({
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
  className,
}: SliderProps) {
  const [internalStart, setInternalStart] = useState(defaultValue)
  const [internalEnd, setInternalEnd] = useState(defaultValueEnd)
  const start = value ?? internalStart
  const end = valueEnd ?? internalEnd
  const span = Math.max(1, max - min)
  const startPercent = variant === "range" ? ((start - min) / span) * 100 : 0
  const endPercent = (((variant === "range" ? end : start) - min) / span) * 100

  function setStart(next: number) {
    const constrained = variant === "range" ? Math.min(next, end) : next
    if (value === undefined) setInternalStart(constrained)
    if (variant === "range") onRangeChange?.([constrained, end])
    else onValueChange?.(constrained)
  }

  function setEnd(next: number) {
    const constrained = Math.max(next, start)
    if (valueEnd === undefined) setInternalEnd(constrained)
    onRangeChange?.([start, constrained])
  }

  return (
    <div className={cn("w-[200px]", className)}>
      <style>{SLIDER_CSS}</style>
      <div className="relative h-[10px]">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full border-[0.5px] border-black/10 bg-black/[0.08]">
          {variant !== "no-value" && (
            <div
              className="absolute inset-y-0 bg-[#C0180C]"
              style={{ left: `${startPercent}%`, right: `${100 - endPercent}%` }}
            />
          )}
        </div>
        {variant === "no-value" && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-0 top-1/2 z-10 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.5px] border-black/20 bg-[#FAFAFA]",
              HANDLE_SHADOW_CLASS,
            )}
          />
        )}
        {variant !== "no-value" && (
          <input
            type="range"
            min={min}
            max={max}
            value={variant === "range" ? end : start}
            onChange={(event) =>
              variant === "range"
                ? setEnd(Number(event.target.value))
                : setStart(Number(event.target.value))
            }
            aria-label={variant === "range" ? `${label} maximum` : label}
            className="sparc-slider-input absolute inset-0 z-10 h-[10px] w-full"
          />
        )}
        {variant === "range" && (
          <input
            type="range"
            min={min}
            max={max}
            value={start}
            onChange={(event) => setStart(Number(event.target.value))}
            aria-label={`${label} minimum`}
            className="sparc-slider-input absolute inset-0 z-20 h-[10px] w-full"
          />
        )}
      </div>
      {showValue && variant !== "no-value" && (
        <div className="mt-1 text-[10px] leading-[14px] text-secondary tabular-nums">
          {variant === "range" ? `${start}–${end}` : start}
        </div>
      )}
    </div>
  )
}
