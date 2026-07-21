import { cn } from "../lib/cn.js"

export type LoadingSpinnerSize = "xs" | "sm" | "md" | "lg" | "xl"
export type LoadingSpinnerVariant = "solid" | "stroke"

export interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize
  variant?: LoadingSpinnerVariant
  label?: string
  className?: string
}

const sizes: Record<LoadingSpinnerSize, number> = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 }

export function LoadingSpinner({
  size = "md",
  variant = "solid",
  label = "Loading",
  className,
}: LoadingSpinnerProps) {
  const dimension = sizes[size]
  const strokeWidth = variant === "solid" ? 4 : 2

  return (
    <span role="status" aria-label={label} className={cn("inline-flex text-[#26201C]", className)}>
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="animate-spin motion-reduce:animate-none"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.12" strokeWidth={strokeWidth} />
        <path
          d="M12 3a9 9 0 0 1 8.78 7"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}
