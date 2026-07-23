import type { ReactNode } from "react"
import { AlertCircle, CheckCircle, Info, X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { LoadingSpinner } from "../loading-spinner/index.js"
import { cn } from "../lib/cn.js"

/**
 * toast — dismissible status notification.
 *
 * Figma recipe: white surface, radius 12, padding 12, horizontal flex with
 * 16px gaps, three stacked drop shadows plus a white inset top highlight.
 * The four tones are identical except for the title, description and status
 * icon colors. The component sizes to its content; the 427px Figma frame is
 * treated as the maximum width, not a fixed width.
 */

const toastTitle = cva("text-[13px] font-medium leading-[18px]", {
  variants: {
    variant: {
      neutral: "text-black",
      // Backwards-compatible alias for the previous "default" variant.
      default: "text-black",
      error: "text-[#E51D31]",
      success: "text-[#129457]",
      warning: "text-[#D18B0C]",
    },
  },
  defaultVariants: { variant: "neutral" },
})

const toastDescription = cva("text-xs font-normal leading-4", {
  variants: {
    variant: {
      neutral: "text-[#525252]",
      // Backwards-compatible alias for the previous "default" variant.
      default: "text-[#525252]",
      error: "text-[#F13546]",
      success: "text-[#1FB06B]",
      warning: "text-[#E59C0E]",
    },
  },
  defaultVariants: { variant: "neutral" },
})

/** Leading 16px status-icon slot; takes the tone's title color. */
const toastIcon = cva("flex size-4 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4", {
  variants: {
    variant: {
      neutral: "text-black",
      // Backwards-compatible alias for the previous "default" variant.
      default: "text-black",
      error: "text-[#E51D31]",
      success: "text-[#129457]",
      warning: "text-[#D18B0C]",
    },
  },
  defaultVariants: { variant: "neutral" },
})

/** Figma toast container shadow: three drop shadows + inset top highlight. */
const TOAST_SHADOW =
  "shadow-[0_4px_8px_0_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_0.5px_2px_0_rgba(0,0,0,0.1),inset_0_0.5px_1px_0_rgba(255,255,255,0.25)]"

/**
 * Dark action button — same gradient/border/shadow recipe as the Button
 * "inverse" variant, sized down to the Figma toast spec (10px label,
 * 6px/8px padding).
 */
const ACTION_BUTTON =
  "shrink-0 rounded-md border-[0.5px] border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#26201C_0%,#26201C_100%)] px-2 py-1.5 text-[10px] font-medium leading-[14px] text-white shadow-[0_4px_8px_-4px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1),inset_0_0.5px_1px_0_rgba(255,255,255,0.25)] transition-colors hover:text-white/80 active:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25"

export type ToastVariant = NonNullable<VariantProps<typeof toastTitle>["variant"]>

/** The four canonical tones; `"default"` is accepted as an alias of `"neutral"`. */
export type ToastTone = "neutral" | "error" | "success" | "warning"

const toneIcons: Record<ToastTone, ReactNode> = {
  neutral: <Info aria-hidden="true" />,
  error: <AlertCircle aria-hidden="true" />,
  success: <CheckCircle aria-hidden="true" />,
  warning: <AlertCircle aria-hidden="true" />,
}

export interface ToastProps {
  /** tone of the notification; `"default"` is kept as an alias of `"neutral"` */
  variant?: ToastVariant
  /** show the 16px loading-spinner slot (default true, matching the Figma frame) */
  loading?: boolean
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  onDismiss?: () => void
  /** override the leading status-icon slot */
  icon?: ReactNode
  className?: string
}

export function Toast({
  variant = "neutral",
  loading = true,
  title = "Plan saved",
  description = "Your staffing plan was saved to Holly Hills.",
  actionLabel = "View plan",
  onAction,
  onDismiss,
  icon,
  className,
}: ToastProps) {
  const tone: ToastTone = variant === "default" ? "neutral" : variant
  const role = tone === "error" ? "alert" : "status"

  return (
    <div
      role={role}
      className={cn(
        "flex w-fit max-w-[427px] items-center gap-4 rounded-xl bg-white p-3",
        TOAST_SHADOW,
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className={toastIcon({ variant })}>{icon ?? toneIcons[tone]}</span>
        {loading && <LoadingSpinner size="s" variant="stroke" label="Loading" className="shrink-0" />}
        <div className="flex min-w-0 flex-col gap-1">
          <p className={toastTitle({ variant })}>{title}</p>
          <p className={cn(toastDescription({ variant }), "truncate")}>{description}</p>
        </div>
      </div>
      {(onAction != null || onDismiss != null) && (
        <div className="flex shrink-0 items-center gap-3">
          {onAction != null && (
            <button type="button" onClick={onAction} className={ACTION_BUTTON}>
              {actionLabel}
            </button>
          )}
          {onDismiss != null && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss notification"
              className="flex shrink-0 items-center justify-center rounded-md p-1.5 text-[#525252] transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
