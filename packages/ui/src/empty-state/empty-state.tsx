import type { ReactNode } from "react"
import { Bell, UserPlus } from "lucide-react"
import { cn } from "../lib/cn.js"
import { Button } from "../button/index.js"

export type EmptyStateVariant = "default" | "avatar" | "compact"

export interface EmptyStateProps {
  variant?: EmptyStateVariant
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: ReactNode
  className?: string
}

const defaults: Record<EmptyStateVariant, { title: string; description: string; action: string }> = {
  default: {
    title: "No notifications yet",
    description: "Updates about staffing plans and assignments will appear here.",
    action: "Refresh",
  },
  avatar: {
    title: "No team members",
    description: "Invite people to start building your workforce.",
    action: "Invite team",
  },
  compact: {
    title: "Nothing to show",
    description: "Try adjusting your filters or search.",
    action: "Clear filters",
  },
}

export function EmptyState({
  variant = "default",
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
  const content = defaults[variant]
  const isAvatar = variant === "avatar"
  const isCompact = variant === "compact"
  const Icon = isAvatar ? UserPlus : Bell

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-md border-[0.5px] border-dashed border-black/10 bg-white text-center",
        isCompact ? "min-h-32 p-4" : "min-h-48 p-6",
        className,
      )}
    >
      {!isCompact && (
        <span
          className={cn(
            "mb-3 flex h-10 w-10 items-center justify-center rounded-full",
            isAvatar ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700",
          )}
        >
          {icon ?? <Icon size={20} aria-hidden="true" />}
        </span>
      )}
      <div>
        <h3 className="text-sm font-medium leading-5 text-black">{title ?? content.title}</h3>
        <p className="mt-1 max-w-72 text-xs leading-4 text-secondary">{description ?? content.description}</p>
      </div>
      <Button size="sm" variant="inverse" className="mt-4" onClick={onAction}>
        {actionLabel ?? content.action}
      </Button>
    </div>
  )
}
