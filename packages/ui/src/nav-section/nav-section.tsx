import type { ReactNode } from "react"
import { cn } from "../lib/cn.js"
import { ListBase } from "../list-base/index.js"

export interface NavSectionProps {
  /** section caption, rendered uppercase. Omit for an unlabeled group. */
  label?: string
  /** the nav-items belonging to this section */
  children?: ReactNode
  className?: string
}

export function NavSection({ label, children, className }: NavSectionProps) {
  return (
    <div role="group" aria-label={label} className={cn("space-y-0.5", className)}>
      {label != null && (
        <ListBase className="min-h-0 py-0.5 text-[0.625rem] leading-[0.875rem] text-[#8F8F8F] uppercase hover:bg-transparent cursor-default">
          {label}
        </ListBase>
      )}
      {children}
    </div>
  )
}
