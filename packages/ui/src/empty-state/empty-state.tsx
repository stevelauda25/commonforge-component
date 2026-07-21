import type { ReactNode } from "react"
import { Bell, Plus, RefreshCw, UserPlus } from "lucide-react"
import { cn } from "../lib/cn.js"

export type EmptyStateVariant = "notifications" | "team" | "compact"

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
  notifications: {
    title: "No notifications yet",
    description: "Updates about staffing plans and assignments will appear here.",
    action: "Refresh",
  },
  team: {
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
  variant = "notifications",
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
  const content = defaults[variant]
  const isTeam = variant === "team"
  const isCompact = variant === "compact"
  const Icon = isTeam ? UserPlus : Bell
  const ActionIcon = isTeam ? Plus : RefreshCw

  return (
    <div className={cn("flex max-w-[277px] flex-col items-center text-center", className)}>
      {!isCompact && (
        <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-neutral-50 text-neutral-700">
          {icon ?? <Icon size={20} aria-hidden="true" />}
        </span>
      )}
      <div>
        <h3 className="text-lg font-medium leading-7 text-black">{title ?? content.title}</h3>
        <p className="mt-0.5 text-base leading-6 text-[#525252]">{description ?? content.description}</p>
      </div>
      <button
        type="button"
        onClick={onAction}
        className={cn(
          "mt-4 inline-flex h-9 items-center gap-2 rounded-[6px] border-[0.5px] px-4 py-2 text-sm font-medium leading-5 outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2",
          isTeam
            ? "border-white/10 bg-[#26201C] text-white hover:bg-neutral-800"
            : "border-black/10 bg-white text-black hover:bg-neutral-50",
        )}
      >
        <ActionIcon size={20} aria-hidden="true" />
        {actionLabel ?? content.action}
      </button>
    </div>
  )
}
