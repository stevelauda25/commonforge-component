import type { ComponentType, KeyboardEvent, MouseEvent, MouseEventHandler, SVGProps } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "../lib/cn.js"
import { ListBase } from "../list-base/index.js"

/** Any icon component that accepts `size` plus standard SVG props. */
export type IconComponent = ComponentType<{ size?: number } & SVGProps<SVGSVGElement>>

const NAV_ICON_CLASS = "size-3"

export interface NavItemProps {
  /** Icon for the row. Omit on sub-list rows. */
  icon?: IconComponent
  /** the row label */
  label: string
  /** current page — the selected treatment */
  current?: boolean
  /** show a chevron and mark the row expandable */
  expandable?: boolean
  /** chevron points down when expanded, right when collapsed */
  expanded?: boolean
  /** sub-list row: indented, no leading icon */
  sub?: boolean
  /** destructive tone (e.g. Log out) */
  danger?: boolean
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
  className?: string
}

export function NavItem({
  icon: Icon,
  label,
  current = false,
  expandable = false,
  expanded = false,
  sub = false,
  danger = false,
  disabled = false,
  onClick,
  className,
}: NavItemProps) {
  const Chevron = expanded ? ChevronDown : ChevronRight
  return (
    <ListBase
      role="button"
      tabIndex={disabled ? -1 : 0}
      size="sm"
      aria-current={current ? "page" : undefined}
      aria-expanded={expandable ? expanded : undefined}
      aria-disabled={disabled || undefined}
      tone={danger ? "danger" : undefined}
      state={disabled ? "disabled" : current ? "selected" : "default"}
      leading={!sub && Icon ? <Icon className={NAV_ICON_CLASS} /> : undefined}
      trailing={expandable ? <Chevron className={cn(NAV_ICON_CLASS, "text-[#525252]")} /> : undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={
        disabled
          ? undefined
          : // a div with role="button" doesn't activate on Enter/Space natively
            (event: KeyboardEvent<HTMLDivElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onClick?.(event as unknown as MouseEvent<HTMLDivElement>)
              }
            }
      }
      className={cn(
        "outline-none",
        !disabled && "cursor-pointer",
        !disabled &&
          "focus-visible:ring-2 focus-visible:ring-[#CFC7BC] focus-visible:ring-offset-0",
        sub && "pl-7",
        current && "bg-[#F0F0F0] text-[#000000]",
        className,
      )}
    >
      {label}
    </ListBase>
  )
}
