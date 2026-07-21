import { cn } from "../lib/cn.js"

export type LoadingSpinnerSize = "xs" | "s" | "md" | "lg" | "xl"
export type LoadingSpinnerVariant = "filled" | "stroke" | "ring" | "dot"

export interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize
  variant?: LoadingSpinnerVariant
  label?: string
  className?: string
}

const sizes: Record<LoadingSpinnerSize, string> = {
  xs: "h-3 w-3",
  s: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
}

const filledThickness: Record<LoadingSpinnerSize, number> = { xs: 3, s: 4, md: 5, lg: 6, xl: 7 }
const strokeThickness: Record<LoadingSpinnerSize, number> = { xs: 1.4, s: 1.7, md: 2, lg: 2.4, xl: 3 }

export function LoadingSpinner({
  size = "md",
  variant = "filled",
  label = "Loading",
  className,
}: LoadingSpinnerProps) {
  // Spec quirk: `isStroke = stroke || dot`, so `ring` falls into the filled branch.
  const isStroke = variant === "stroke" || variant === "dot"
  const thickness = (isStroke ? strokeThickness : filledThickness)[size]
  const track = isStroke ? "transparent" : "rgba(0,0,0,0.10)"

  return (
    <span role="status" aria-label={label} className={cn("inline-flex", className)}>
      <span
        aria-hidden="true"
        className={cn("animate-spin rounded-full motion-reduce:animate-none", sizes[size])}
        style={{
          background: `conic-gradient(from 15deg, #26201C 0deg 255deg, ${track} 255deg 360deg)`,
          maskImage: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`,
          WebkitMaskImage: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`,
        }}
      />
    </span>
  )
}
