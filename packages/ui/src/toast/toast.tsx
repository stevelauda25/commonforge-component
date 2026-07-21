import type { ReactNode } from "react"
import { X } from "lucide-react"
import { cn } from "../lib/cn.js"

export type ToastVariant = "default" | "error" | "success" | "warning"

export interface ToastProps {
  variant?: ToastVariant
  title: string
  description: string
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
  title,
  description,
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
        "flex min-h-20 w-full max-w-[540px] items-center gap-4 rounded-xl bg-white p-4 shadow-[0_4px_8px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.15),0_0.5px_2px_rgba(0,0,0,0.10),inset_0_0.5px_1px_rgba(255,255,255,0.25)]",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {icon ?? (
          <>
            <span className={cn("size-6 shrink-0 rounded-full border-2", palette.ring)} aria-hidden="true" />
            <span
              className="size-6 shrink-0 rounded-full border-[3px] border-black border-r-transparent"
              aria-hidden="true"
            />
          </>
        )}
        <div className="min-w-0">
          <p className={cn("text-base font-medium leading-6", palette.title)}>{title}</p>
          <p className={cn("text-sm leading-5", palette.body)}>{description}</p>
        </div>
      </div>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="h-8 shrink-0 rounded-[6px] border-[0.5px] border-white/10 bg-[#26201C] px-3 text-xs font-medium leading-4 text-white shadow-[0_4px_8px_-4px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_rgba(0,0,0,0.1),inset_0_0.5px_1px_rgba(255,255,255,0.25)] outline-none hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2"
        >
          {actionLabel}
        </button>
      )}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex size-8 shrink-0 items-center justify-center rounded-[4px] text-[#525252] outline-none hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-black/20"
          aria-label="Dismiss notification"
        >
          <X size={10} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
