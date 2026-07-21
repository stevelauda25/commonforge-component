"use client";

import { useState, type CSSProperties } from "react"
import { cn } from "../lib/cn.js"

export type SliderMode = "default" | "range" | "empty"

export interface SliderProps {
  mode?: SliderMode
  min?: number
  max?: number
  value?: number
  defaultValue?: number
  startValue?: number
  defaultStartValue?: number
  onValueChange?: (value: number) => void
  onRangeChange?: (range: [number, number]) => void
  label?: string
  className?: string
}

export function Slider({
  mode = "default",
  min = 0,
  max = 100,
  value,
  defaultValue = 80,
  startValue,
  defaultStartValue = 16,
  onValueChange,
  onRangeChange,
  label = "Value",
  className,
}: SliderProps) {
  const [internalEnd, setInternalEnd] = useState(defaultValue)
  const [internalStart, setInternalStart] = useState(defaultStartValue)
  const end = value ?? internalEnd
  const start = startValue ?? internalStart
  const span = Math.max(1, max - min)
  const endPercent = ((end - min) / span) * 100
  const startPercent = mode === "range" ? ((start - min) / span) * 100 : 0

  function setEnd(next: number) {
    const constrained = mode === "range" ? Math.max(next, start) : next
    if (value === undefined) setInternalEnd(constrained)
    onValueChange?.(constrained)
    if (mode === "range") onRangeChange?.([start, constrained])
  }

  function setStart(next: number) {
    const constrained = Math.min(next, end)
    if (startValue === undefined) setInternalStart(constrained)
    onRangeChange?.([constrained, end])
  }

  return (
    <div className={cn("relative h-5 w-[200px]", className)}>
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full border-[0.5px] border-black/10 bg-black/[0.08]">
        {mode !== "empty" && (
          <div
            className="absolute inset-y-0 bg-crimson-500"
            style={{ left: `${startPercent}%`, right: `${100 - endPercent}%` }}
          />
        )}
      </div>
      {mode === "empty" && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 z-10 size-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.5px] border-black/20 bg-[#FAFAFA] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
        />
      )}
      {mode !== "empty" && (
        <input
          type="range"
          min={min}
          max={max}
          value={end}
          onChange={(event) => setEnd(Number(event.target.value))}
          aria-label={mode === "range" ? `${label} maximum` : label}
          className="cf-slider-input absolute inset-0 z-10 h-5 w-full appearance-none bg-transparent"
          style={{ "--thumb-z": 2 } as CSSProperties}
        />
      )}
      {mode === "range" && (
        <input
          type="range"
          min={min}
          max={max}
          value={start}
          onChange={(event) => setStart(Number(event.target.value))}
          aria-label={`${label} minimum`}
          className="cf-slider-input absolute inset-0 z-20 h-5 w-full appearance-none bg-transparent"
          style={{ "--thumb-z": 3 } as CSSProperties}
        />
      )}
    </div>
  )
}
