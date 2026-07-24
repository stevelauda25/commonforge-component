import type { ComponentPropsWithoutRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check } from "lucide-react"
import { cn } from "../lib/cn.js"

/**
 * timeline — a step/track indicator with a connecting line and step dots.
 *
 * Figma recipe: a 16px cross-axis frame (197px tall vertical / 199px wide
 * horizontal) holding four ~10px green-500 filled circles distributed along
 * the frame's length and joined by a green-500 connecting line (in Figma the
 * line plus circles are a single 'Union' vector); each circle carries a small
 * white check glyph centered on top. The line renders first (behind); the
 * dots lay directly over it with no surrounding box or padding.
 *
 * Implementation: a full-length ~1.5px neutral-200 track plus a green-500
 * progress overlay reaching the last completed/current step. Steps are spaced
 * with justify-between, so step i's center sits at i/(n-1) of the track and
 * the overlay is sized with that percentage (n=1 renders no overlay).
 * Completed dots are green-500 (the same value as the success token, matching
 * badge/file-list); current is a white dot with a green-500 ring and center
 * dot; upcoming is a quiet neutral dot.
 *
 * Note: the neutral track/dot use arbitrary values (rgb(226 220 212) /
 * rgb(207 199 188), i.e. neutral-200/300) because the tailwind preset's
 * backgroundColor.neutral semantic key shadows the neutral ramp — the
 * bg-neutral-<shade> utilities never generate.
 */
const timeline = cva("relative inline-flex items-center justify-between", {
  variants: {
    orientation: {
      vertical: "h-[197px] w-4 flex-col",
      horizontal: "h-4 w-[199px] flex-row",
    },
  },
  defaultVariants: { orientation: "vertical" },
})

const lineClasses: Record<TimelineOrientation, string> = {
  vertical: "absolute top-0 bottom-0 left-1/2 w-[1.5px] -translate-x-1/2",
  horizontal: "absolute left-0 right-0 top-1/2 h-[1.5px] -translate-y-1/2",
}

/** Green progress overlay: anchored to the track start, sized via inline style. */
const progressLineClasses: Record<TimelineOrientation, string> = {
  vertical: "absolute top-0 left-1/2 w-[1.5px] -translate-x-1/2",
  horizontal: "absolute left-0 top-1/2 h-[1.5px] -translate-y-1/2",
}

export type TimelineOrientation = "vertical" | "horizontal"
export type TimelineStepStatus = "completed" | "current" | "upcoming"

export interface TimelineStep {
  /** Step state. Defaults to "completed" (the Figma depicts all-completed tracks). */
  status?: TimelineStepStatus
  /** Accessible name for the step; also shown as a tooltip. */
  label?: string
}

export interface TimelineProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children">,
    VariantProps<typeof timeline> {
  /** Number of steps, or an array of per-step descriptors. Defaults to 4 (per the Figma). */
  steps?: number | TimelineStep[]
  /** Accessible label for the whole track. */
  label?: string
  className?: string
}

function StepMarker({ status }: { status: TimelineStepStatus }) {
  if (status === "completed") {
    return (
      <span
        aria-hidden="true"
        className="flex size-2.5 items-center justify-center rounded-full bg-green-500"
      >
        <Check size={7} strokeWidth={3.5} className="text-white" aria-hidden="true" />
      </span>
    )
  }
  if (status === "current") {
    return (
      <span
        aria-hidden="true"
        className="flex size-2.5 items-center justify-center rounded-full border-2 border-green-500 bg-white"
      >
        <span className="size-1 rounded-full bg-green-500" />
      </span>
    )
  }
  return (
    <span
      aria-hidden="true"
      // neutral-300 as an arbitrary value: the preset's backgroundColor.neutral
      // (bg-neutral) shadows the neutral ramp, so bg-neutral-300 never generates.
      className="size-2 rounded-full bg-[rgb(207_199_188)]"
    />
  )
}

export function Timeline({
  orientation = "vertical",
  steps = 4,
  label = "Progress",
  className,
  ...props
}: TimelineProps) {
  const resolvedSteps: TimelineStep[] =
    typeof steps === "number"
      ? Array.from({ length: Math.max(0, Math.round(steps)) }, () => ({}))
      : steps

  // Green progress overlay: reaches the last completed/current step. With
  // justify-between spacing, step i's center sits at i/(n-1) of the track.
  const lastActiveIndex = resolvedSteps.reduce(
    (acc, step, index) => ((step.status ?? "completed") !== "upcoming" ? index : acc),
    -1,
  )
  const progressPercent =
    resolvedSteps.length > 1 && lastActiveIndex > 0
      ? (lastActiveIndex / (resolvedSteps.length - 1)) * 100
      : 0

  return (
    <div
      role="list"
      aria-label={label}
      className={cn(timeline({ orientation }), className)}
      {...props}
    >
      <span
        aria-hidden="true"
        // neutral-200 as an arbitrary value — same preset shadowing as above;
        // bg-neutral-200 does not exist in the generated utilities.
        className={cn("bg-[rgb(226_220_212)]", lineClasses[orientation ?? "vertical"])}
      />
      {progressPercent > 0 && (
        <span
          aria-hidden="true"
          className={cn(
            "bg-green-500",
            progressLineClasses[orientation ?? "vertical"],
          )}
          style={
            (orientation ?? "vertical") === "horizontal"
              ? { width: `${progressPercent}%` }
              : { height: `${progressPercent}%` }
          }
        />
      )}
      {resolvedSteps.map((step, index) => {
        const status = step.status ?? "completed"
        return (
          <span
            key={index}
            role="listitem"
            aria-label={step.label ?? `Step ${index + 1}: ${status}`}
            aria-current={status === "current" ? "step" : undefined}
            title={step.label}
            className="relative flex size-2.5 shrink-0 items-center justify-center"
          >
            <StepMarker status={status} />
          </span>
        )
      })}
    </div>
  )
}
