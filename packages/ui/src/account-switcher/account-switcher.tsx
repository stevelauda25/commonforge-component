import { ChevronDown, PanelLeft } from "lucide-react"
import { cn } from "../lib/cn.js"
import { Avatar } from "../avatar/index.js"
import { Badge } from "../badge/index.js"

export interface AccountSwitcherProps {
  /** display name, e.g. "Jason Heim" */
  name: string
  /** avatar image url; falls back to initials */
  avatarSrc?: string
  /** initials for the avatar fallback, e.g. "JH" */
  initials?: string
  /** role badge text, e.g. "Admin". Omit to hide the pill. */
  role?: string
  /** profile menu trigger */
  onClick?: () => void
  /** collapse-sidebar toggle (the panel icon) */
  onToggleSidebar?: () => void
  className?: string
}

export function AccountSwitcher({
  name,
  avatarSrc,
  initials,
  role,
  onClick,
  onToggleSidebar,
  className,
}: AccountSwitcherProps) {
  return (
    <div className={cn("flex w-[calc(100%+2px)] items-center gap-2 rounded-sm py-2 pl-1 pr-0", className)}>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <button
          type="button"
          onClick={onClick}
          className="-ml-1 flex min-w-0 items-center gap-1 rounded-sm px-1 py-0.5 outline-none hover:bg-[#F5F5F5] focus-visible:ring-2 focus-visible:ring-[#CFC7BC]"
        >
          <Avatar src={avatarSrc} fallback={initials} alt={name} size={20} />
          <span className="truncate text-sm leading-5 text-black">{name}</span>
          <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
        </button>
        {role && (
          <Badge variant="purple" size="sm" className="shrink-0 px-1.5 py-0.5">
            {role}
          </Badge>
        )}
      </div>
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Collapse sidebar"
        className="flex shrink-0 items-center justify-center rounded-sm p-1 text-muted-foreground outline-none hover:bg-[#F5F5F5] hover:text-foreground focus-visible:ring-2 focus-visible:ring-[#CFC7BC]"
      >
        <PanelLeft className="size-4" />
      </button>
    </div>
  )
}
