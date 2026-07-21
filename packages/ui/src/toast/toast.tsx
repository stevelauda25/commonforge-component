import type { ReactNode } from "react"
import { X } from "lucide-react"
import { Button } from "../button/index.js"
import { LoadingSpinner } from "../loading-spinner/index.js"
import { cn } from "../lib/cn.js"

export type ToastVariant = "default" | "error" | "success" | "warning"

export interface ToastProps {
  variant?: ToastVariant
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  onDismiss?: () => void
  icon?: ReactNode
  className?: string
}

const colors: Record<ToastVariant, { title: string; body: string; ring: string }> = {
  default: { title: "text-black", body: "text-[#525252]", ring: "border-black" },
  error: { title: "text-red-500", body: "text-red-400", ring: "border-red-500" },
  success: { title: "text-green-500", body: "text-green-400", ring: "border-green-500" },
  warning: { title: "text-amber-500", body: "text-amber-400", ring: "border-amber-500" },
}

export function Toast({
  variant = "default",
  title = "Plan saved",
  description = "Your staffing plan was saved to Holly Hills.",
  actionLabel = "View plan",
  onAction,
  onDismiss,
  icon,
  className,
}: ToastProps) {
  const palette = colors[variant]
  const role = variant === "error" ? "alert" : "status"

  return (
    <div
      role={role}
      className={cn(
        "flex h-20 w-[540px] max-w-full items-center gap-6 rounded-xl border-[0.5px] border-black/10 bg-white p-4 shadow-[0_4px_8px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.15),0_0.5px_2px_rgba(0,0,0,0.10),inset_0_0.5px_1px_rgba(255,255,255,0.25)]",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {icon ?? (
          <>
            <span className={cn("size-6 shrink-0 rounded-full border-2 bg-white", palette.ring)} aria-hidden="true" />
            <span aria-hidden="true" className="shrink-0">
              <LoadingSpinner size="lg" variant="stroke" />
            </span>
          </>
        )}
        <div className="min-w-0">
          <p className={cn("text-base font-medium leading-6", palette.title)}>{title}</p>
          <p className={cn("mt-1 whitespace-nowrap text-sm leading-5", palette.body)}>{description}</p>
        </div>
      </div>
      {onAction && (
        <Button
          size="xs"
          variant="inverse"
          onClick={onAction}
          className="h-8 shrink-0 px-3 py-2 text-xs leading-4"
        >
          {actionLabel}
        </Button>
      )}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-[#525252] outline-none hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-black/20"
          aria-label="Dismiss notification"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
