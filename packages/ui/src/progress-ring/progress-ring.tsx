import { cn } from "../lib/cn.js"

export type ProgressRingSize = "sm" | "md" | "lg"

export interface ProgressRingProps {
  value?: number
  size?: ProgressRingSize
  showPercent?: boolean
  label?: string
  className?: string
}

const dimensions: Record<ProgressRingSize, { size: number; stroke: number; text: string }> = {
  sm: { size: 40, stroke: 5, text: "text-xs leading-4" },
  md: { size: 56, stroke: 7, text: "text-sm leading-5" },
  lg: { size: 72, stroke: 9, text: "text-base leading-5" },
}

export function ProgressRing({
  value = 50,
  size = "md",
  showPercent = size !== "sm",
  label = "Progress",
  className,
}: ProgressRingProps) {
  const spec = dimensions[size]
  const normalizedValue = Math.min(100, Math.max(0, value))
  const radius = (spec.size - spec.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - normalizedValue / 100)

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(normalizedValue)}
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: spec.size, height: spec.size }}
    >
      <svg width={spec.size} height={spec.size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={spec.size / 2}
          cy={spec.size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.10)"
          strokeWidth={spec.stroke}
        />
        <circle
          cx={spec.size / 2}
          cy={spec.size / 2}
          r={radius}
          fill="none"
          stroke="#26201C"
          strokeWidth={spec.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span
        aria-hidden="true"
        className="absolute rounded-full bg-white"
        style={{ inset: spec.stroke }}
      />
      <span className={cn("absolute font-medium text-black tabular-nums", spec.text)}>
        {Math.round(normalizedValue)}{showPercent ? "%" : ""}
      </span>
    </div>
  )
}
