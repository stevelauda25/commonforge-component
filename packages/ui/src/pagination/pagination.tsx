import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "../lib/cn.js"

/**
 * pagination — page navigation, rows-per-page selector, summary text, and
 * their full-width composition. From Figma node 96:2316.
 *
 * All text is 12px/16px regular. Colours: #000000 primary, #525252 secondary,
 * #F5F5F5 hover fill, rgba(0,0,0,0.1) hairlines, 6px radius — the same
 * hardcoded neutral recipe the newest components (dropdown / list-base) use,
 * pending reconciliation into gray-* tokens.
 *
 * Decisions documented in SPEC.md:
 * - the boxed (bordered) number page is the CURRENT page state; hover is the
 *   #F5F5F5 fill (the isolated Figma cells were ambiguous).
 * - number pages use secondary #525252 text, switching to primary #000000 on
 *   the current page (mirrors the rows-per-page option rows).
 * - the selected rows-per-page option does NOT get the Figma's leading
 *   users-01 icon — that is a placeholder artefact; selected = #000000 text +
 *   trailing 12px check.
 */

/* -------------------------------------------------------------------------- */
/* Number page button                                                          */
/* -------------------------------------------------------------------------- */

const pageButton = cva(
  "flex h-7 w-7 items-center justify-center rounded-[6px] text-[12px] leading-[16px] outline-none transition-colors focus-visible:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]",
  {
    variants: {
      state: {
        default: "bg-white text-[#525252] hover:bg-[#F5F5F5]",
        // forced hover visual — used by the docs to show the hover state
        hover: "bg-[#F5F5F5] text-[#525252]",
        current: "border border-black/10 bg-white text-black",
      },
    },
    defaultVariants: { state: "default" },
  },
)

export interface PaginationPageButtonProps extends VariantProps<typeof pageButton> {
  /** the 1-based page number shown in the button */
  page: number
  onClick?: (page: number) => void
  className?: string
}

export function PaginationPageButton({ page, state = "default", onClick, className }: PaginationPageButtonProps) {
  const isCurrent = state === "current"
  return (
    <button
      type="button"
      aria-label={`Page ${page}`}
      aria-current={isCurrent ? "page" : undefined}
      onClick={() => onClick?.(page)}
      className={cn(pageButton({ state }), className)}
    >
      {page}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* Pagination — previous / numbers / next                                      */
/* -------------------------------------------------------------------------- */

const ELLIPSIS = "…" as const
type PageItem = number | typeof ELLIPSIS

/**
 * Ellipsis rule (siblingCount = s, edgeSize = 2s+1):
 * - pageCount <= edgeSize*2 + 1 → every page, no ellipsis.
 * - near an edge (current within the edge block) →
 *   `1 … edgeSize … N-edgeSize+1 … N`, e.g. the Figma `1 2 3 … 21 22 23`
 *   with s=1, page=1, pageCount=23. The edge block grows to keep the current
 *   page and its siblings visible.
 * - mid-range → `1 … page-s … page+s … N`.
 */
export function getPaginationItems(page: number, pageCount: number, siblingCount = 1): PageItem[] {
  const edgeSize = 2 * siblingCount + 1
  if (pageCount <= edgeSize * 2 + 1) {
    return Array.from({ length: pageCount }, (_, i) => i + 1)
  }

  const leftSibling = Math.max(page - siblingCount, 1)
  const rightSibling = Math.min(page + siblingCount, pageCount)
  const showLeftEllipsis = leftSibling > edgeSize
  const showRightEllipsis = rightSibling < pageCount - edgeSize + 1

  const range = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i)

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, Math.max(edgeSize, rightSibling)), ELLIPSIS, ...range(pageCount - edgeSize + 1, pageCount)]
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    return [...range(1, edgeSize), ELLIPSIS, ...range(Math.min(pageCount - edgeSize + 1, leftSibling), pageCount)]
  }
  if (showLeftEllipsis && showRightEllipsis) {
    return [1, ELLIPSIS, ...range(leftSibling, rightSibling), ELLIPSIS, pageCount]
  }
  // edge blocks overlap the middle — no ellipsis needed after all
  return range(1, pageCount)
}

const navButton =
  "flex h-7 items-center gap-1 rounded-[6px] py-1.5 text-[12px] leading-[16px] outline-none transition-colors focus-visible:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]"

export interface PaginationProps {
  /** controlled 1-based current page */
  page: number
  /** total number of pages (>= 1) */
  pageCount: number
  /** called with the requested 1-based page */
  onPageChange?: (page: number) => void
  /** pages shown on each side of the current page; also sets the edge block
   *  size (2*siblingCount+1) and the ellipsis jump distance (default 1) */
  siblingCount?: number
  previousLabel?: string
  nextLabel?: string
  className?: string
  "aria-label"?: string
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  previousLabel = "Previous",
  nextLabel = "Next",
  className,
  "aria-label": ariaLabel = "Pagination",
}: PaginationProps) {
  const safePageCount = Math.max(1, Math.floor(pageCount))
  const current = Math.min(Math.max(1, Math.floor(page)), safePageCount)
  const items = getPaginationItems(current, safePageCount, siblingCount)
  const jump = 2 * siblingCount + 1

  const go = (target: number) => {
    const clamped = Math.min(Math.max(1, target), safePageCount)
    if (clamped !== current) onPageChange?.(clamped)
  }

  const isFirst = current <= 1
  const isLast = current >= safePageCount

  return (
    <nav aria-label={ariaLabel} className={cn("flex h-7 items-center gap-4", className)}>
      <button
        type="button"
        disabled={isFirst}
        onClick={() => go(current - 1)}
        className={cn(
          navButton,
          "pl-1.5 pr-2",
          isFirst ? "cursor-not-allowed text-[#A3A3A3]" : "text-black hover:bg-[#F5F5F5]",
        )}
      >
        <ChevronLeft size={16} aria-hidden />
        {previousLabel}
      </button>

      <div className="flex items-center gap-2">
        {items.map((item, i) =>
          item === ELLIPSIS ? (
            <button
              key={`ellipsis-${i}`}
              type="button"
              aria-label={i < items.length / 2 ? "Show earlier pages" : "Show later pages"}
              onClick={() => go(i < items.length / 2 ? current - jump : current + jump)}
              className="flex h-5 w-5 items-center justify-center rounded-[6px] text-[#525252] outline-none transition-colors hover:bg-[#F5F5F5] focus-visible:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]"
            >
              <MoreHorizontal size={16} aria-hidden />
            </button>
          ) : (
            <PaginationPageButton
              key={item}
              page={item}
              state={item === current ? "current" : "default"}
              onClick={go}
            />
          ),
        )}
      </div>

      <button
        type="button"
        disabled={isLast}
        onClick={() => go(current + 1)}
        className={cn(
          navButton,
          "pl-2 pr-1.5",
          isLast ? "cursor-not-allowed text-[#A3A3A3]" : "text-black hover:bg-[#F5F5F5]",
        )}
      >
        {nextLabel}
        <ChevronRight size={16} aria-hidden />
      </button>
    </nav>
  )
}

/* -------------------------------------------------------------------------- */
/* Rows per page                                                               */
/* -------------------------------------------------------------------------- */

export interface PaginationRowsPerPageProps {
  /** controlled selected rows-per-page value */
  value: number
  /** selectable values (default [10, 25, 50, 100]) */
  options?: number[]
  /** called with the chosen value */
  onChange?: (value: number) => void
  /** leading label text (default "Rows per page") */
  label?: string
  disabled?: boolean
  /** force the panel open (e.g. for docs); overrides the internal open state */
  open?: boolean
  className?: string
  "aria-label"?: string
}

/**
 * rows-per-page — label + 64x28 select-style trigger whose panel opens
 * UPWARD. Panel + rows follow the Figma spec (143px panel, 8px-padding rows,
 * hairline separators, trailing 12px check on the selected row) on the repo's
 * popover recipe (white, 0.5px black/10 hairline, 6px radius, the shared
 * popover shadow). Interaction mirrors Dropdown: click toggles, outside
 * pointer-down and Escape close, ArrowUp/ArrowDown move the active option,
 * Enter/Space selects.
 */
export function PaginationRowsPerPage({
  value,
  options = [10, 25, 50, 100],
  onChange,
  label = "Rows per page",
  disabled = false,
  open,
  className,
  "aria-label": ariaLabel = "Rows per page",
}: PaginationRowsPerPageProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = !disabled && (open ?? internalOpen)
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  // close on outside pointer-down and Escape (the dropdown pattern)
  useEffect(() => {
    if (!internalOpen) return
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setInternalOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInternalOpen(false)
    }
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [internalOpen])

  // keep the keyboard-active row in view
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return
    document.getElementById(`${listboxId}-option-${activeIndex}`)?.scrollIntoView({ block: "nearest" })
  }, [activeIndex, isOpen, listboxId])

  const selectedIndex = options.indexOf(value)

  const initialActive = (dir: 1 | -1) => {
    if (selectedIndex >= 0) return selectedIndex
    if (options.length === 0) return -1
    return dir === 1 ? 0 : options.length - 1
  }

  const moveActive = (dir: 1 | -1) => {
    setActiveIndex((prev) => {
      if (options.length === 0) return -1
      if (prev < 0) return dir === 1 ? 0 : options.length - 1
      return (prev + dir + options.length) % options.length
    })
  }

  const openList = () => {
    if (disabled) return
    setInternalOpen(true)
    setActiveIndex(initialActive(1))
  }

  const toggleList = () => {
    if (disabled) return
    if (isOpen) setInternalOpen(false)
    else openList()
  }

  const selectOption = (option: number) => {
    onChange?.(option)
    setInternalOpen(false)
  }

  const onTriggerKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault()
        const dir = e.key === "ArrowDown" ? 1 : -1
        if (isOpen) {
          moveActive(dir)
        } else {
          setInternalOpen(true)
          setActiveIndex(initialActive(dir))
        }
        break
      }
      case "Enter":
      case " ": {
        if (isOpen) {
          // stop the native button click that would re-toggle the list
          e.preventDefault()
          const option = activeIndex >= 0 ? options[activeIndex] : undefined
          if (option !== undefined) selectOption(option)
          else setInternalOpen(false)
        }
        break
      }
      case "Escape": {
        if (isOpen) {
          e.stopPropagation()
          setInternalOpen(false)
        }
        break
      }
    }
  }

  return (
    <div ref={rootRef} className={cn("flex h-7 items-center gap-3", className)}>
      {label != null && label !== "" && (
        <span className="text-[12px] leading-[16px] text-black">{label}</span>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listboxId : undefined}
          aria-activedescendant={
            isOpen && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          aria-label={ariaLabel}
          onClick={toggleList}
          onKeyDown={onTriggerKeyDown}
          className={cn(
            "flex h-7 w-16 items-center justify-between rounded-[6px] border border-black/10 bg-white py-1.5 pl-2 pr-1.5 text-[12px] leading-[16px] text-black outline-none transition-colors",
            disabled
              ? "cursor-not-allowed text-[#A3A3A3]"
              : "hover:bg-[#F5F5F5] focus-visible:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]",
          )}
        >
          <span>{value}</span>
          <ChevronDown
            size={12}
            aria-hidden
            className={cn(
              "shrink-0 transition-transform duration-150",
              isOpen && "rotate-180",
              disabled ? "text-[#A3A3A3]" : "text-[#525252]",
            )}
          />
        </button>

        {/* open panel — repo popover recipe, opens upward */}
        {isOpen && (
          <div
            role="listbox"
            id={listboxId}
            aria-label={ariaLabel}
            className={cn(
              "absolute bottom-full left-0 z-50 mb-1 flex w-[143px] flex-col overflow-y-auto",
              "rounded-[6px] border-[0.5px] border-black/10 bg-white",
              "shadow-[0_1px_1px_0_rgba(0,0,0,0.05),0_4px_8px_0_rgba(0,0,0,0.05),0_2px_4px_0_rgba(0,0,0,0.05)]",
            )}
          >
            {options.map((option, i) => {
              const isSelected = option === value
              return (
                <div
                  key={option}
                  id={`${listboxId}-option-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    "flex cursor-pointer select-none items-center justify-between p-2 text-[12px] leading-[16px]",
                    i < options.length - 1 && "border-b-[0.5px] border-black/10",
                    i === activeIndex && "bg-[#F5F5F5]",
                    isSelected ? "text-black" : "text-[#525252]",
                  )}
                >
                  <span>{option}</span>
                  {isSelected && <Check size={12} aria-hidden className="shrink-0" />}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Summary — "Showing X-Y of Z"                                                */
/* -------------------------------------------------------------------------- */

export interface PaginationSummaryProps {
  /** controlled 1-based current page */
  page: number
  /** rows per page */
  pageSize: number
  /** total number of rows */
  total: number
  className?: string
}

export function PaginationSummary({ page, pageSize, total, className }: PaginationSummaryProps) {
  const safeTotal = Math.max(0, total)
  const start = safeTotal === 0 ? 0 : (Math.max(1, page) - 1) * pageSize + 1
  const end = Math.min(Math.max(1, page) * pageSize, safeTotal)
  return (
    <span className={cn("text-[12px] leading-[16px] text-[#525252]", className)}>
      {safeTotal === 0 ? `Showing 0 of ${safeTotal}` : `Showing ${start}-${end} of ${safeTotal}`}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Full composition                                                            */
/* -------------------------------------------------------------------------- */

export interface PaginationFullProps extends Omit<PaginationProps, "className"> {
  /** rows-per-page value (rows per page selector) */
  pageSize: number
  /** called with the chosen rows-per-page value */
  onPageSizeChange?: (value: number) => void
  /** rows-per-page options (default [10, 25, 50, 100]) */
  pageSizeOptions?: number[]
  /** total number of rows (summary text) */
  total: number
  /**
   * summary-start = Figma arrangement A (left: summary + "•" + rows-per-page,
   * right: pagination). summary-end = arrangement B (left: rows-per-page,
   * right: pagination + summary). Default "summary-start".
   */
  layout?: "summary-start" | "summary-end"
  rowsPerPageLabel?: string
  className?: string
}

export function PaginationFull({
  layout = "summary-start",
  page,
  pageCount,
  onPageChange,
  siblingCount,
  previousLabel,
  nextLabel,
  "aria-label": ariaLabel,
  pageSize,
  onPageSizeChange,
  pageSizeOptions,
  total,
  rowsPerPageLabel,
  className,
}: PaginationFullProps) {
  const pagination = (
    <Pagination
      page={page}
      pageCount={pageCount}
      onPageChange={onPageChange}
      siblingCount={siblingCount}
      previousLabel={previousLabel}
      nextLabel={nextLabel}
      aria-label={ariaLabel}
    />
  )
  const rowsPerPage = (
    <PaginationRowsPerPage
      value={pageSize}
      options={pageSizeOptions}
      onChange={onPageSizeChange}
      label={rowsPerPageLabel}
    />
  )
  const summary = <PaginationSummary page={page} pageSize={pageSize} total={total} />

  return (
    <div className={cn("flex h-7 w-full items-center justify-between gap-4", className)}>
      {layout === "summary-start" ? (
        <>
          <div className="flex items-center gap-3">
            {summary}
            <span aria-hidden className="text-[12px] leading-[16px] text-[#525252]">
              •
            </span>
            {rowsPerPage}
          </div>
          {pagination}
        </>
      ) : (
        <>
          {rowsPerPage}
          <div className="flex items-center gap-4">
            {pagination}
            <span className="text-right">{summary}</span>
          </div>
        </>
      )}
    </div>
  )
}
