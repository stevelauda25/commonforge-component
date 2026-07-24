import type { ReactNode } from "react"
import { Bell, User } from "lucide-react"
import { cva } from "class-variance-authority"
import { cn } from "../lib/cn.js"

/**
 * empty-state — centered placeholder for empty lists, notifications, or
 * search results.
 *
 * Figma recipe: bare (transparent) column, 16px gaps between the three
 * blocks — media → text → action. No card chrome. The text block stacks the
 * title (14px/500/20px, #000000) and description (13px/400/18px, #525252)
 * with a 2px gap, both centered. Media is either a 16px icon in a 4px-padded
 * rgba(0,0,0,0.05) chip with 4px radius, or a 24px rounded-full avatar with
 * a 1px rgba(0,0,0,0.1) border; it can also be omitted entirely.
 */

/** Figma button shadow: three drop shadows + three inner shadows (shared with Button). */
const ACTION_SHADOW =
  "shadow-[0_4px_8px_-4px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1),inset_0_0.5px_1px_0_rgba(255,255,255,0.25)]"

/**
 * Action button — built inline via cva (same approach as the Toast
 * ACTION_BUTTON) because the repo Button has no size matching the Figma
 * recipe: 10px/500/14px label, 6px/8px padding, 4px gap, 14px icon. Primary
 * mirrors the Button "inverse" fill (white gradient over #26201C, 0.5px
 * border); secondary is the white chip (1px border, as spec'd).
 */
const emptyStateAction = cva(
  [
    "inline-flex items-center gap-1 rounded-[6px] px-2 py-1.5",
    "text-2xs font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25",
    "[&>svg]:h-3.5 [&>svg]:w-3.5",
  ],
  {
    variants: {
      variant: {
        secondary: cn(
          "border border-white/10 bg-white text-black",
          ACTION_SHADOW,
          "hover:bg-[#F5F5F5] active:bg-[#F0F0F0]",
        ),
        primary: cn(
          "border-[0.5px] border-white/10 text-white",
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%),linear-gradient(0deg,#26201C_0%,#26201C_100%)]",
          ACTION_SHADOW,
          "hover:text-white/80 active:text-white/60",
        ),
      },
    },
    defaultVariants: { variant: "secondary" },
  },
)

export type EmptyStateMedia = "icon" | "avatar" | "none"
export type EmptyStateActionVariant = "primary" | "secondary"

export interface EmptyStateProps {
  /** media block above the copy: a 16px icon chip, a 24px avatar, or nothing */
  media?: EmptyStateMedia
  /** override the media="icon" glyph (defaults to Bell) */
  icon?: ReactNode
  /** image URL for media="avatar"; falls back to a neutral User chip when omitted */
  avatarSrc?: string
  /** alt text for the avatar image */
  avatarAlt?: string
  title: string
  description?: string
  /** renders the action button when provided */
  actionLabel?: string
  /** optional 14px leading icon inside the action button */
  actionIcon?: ReactNode
  /** action button style: white "secondary" chip or dark "primary" chip */
  actionVariant?: EmptyStateActionVariant
  onAction?: () => void
  className?: string
}

export function EmptyState({
  media = "icon",
  icon,
  avatarSrc,
  avatarAlt = "",
  title,
  description,
  actionLabel,
  actionIcon,
  actionVariant = "secondary",
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4 text-center", className)}>
      {media === "icon" && (
        <span className="flex items-center justify-center rounded-xs bg-black/5 p-1 text-black [&>svg]:h-4 [&>svg]:w-4">
          {icon ?? <Bell aria-hidden="true" />}
        </span>
      )}
      {media === "avatar" &&
        (avatarSrc ? (
          <img
            src={avatarSrc}
            alt={avatarAlt}
            className="h-6 w-6 rounded-full border border-black/10 object-cover"
          />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black/10 bg-black/5 text-black [&>svg]:h-3.5 [&>svg]:w-3.5">
            <User aria-hidden="true" />
          </span>
        ))}
      <div className="flex flex-col items-center gap-0.5">
        <p className="text-body font-medium text-strong">{title}</p>
        {description && <p className="text-body-sm text-subtle">{description}</p>}
      </div>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className={emptyStateAction({ variant: actionVariant })}
        >
          {actionIcon}
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  )
}
