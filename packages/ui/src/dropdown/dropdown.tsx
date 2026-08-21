import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent as ReactChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "../lib/cn.js"
import { ListBase } from "../list-base/index.js"

export type DropdownSize = "sm" | "md"

export interface DropdownOption {
  /** the value handed to onChange */
  value: string
  /** the label shown in the list and in the closed field */
  label: string
  /** disabled options use the ListBase disabled state and cannot be chosen */
  disabled?: boolean
}

export interface DropdownProps {
  /**
   * md = 12px padding / 14px text (regular), sm = fixed 32px height / px-2 /
   * 12px text (small). The ListBase option rows follow the same size.
   */
  size?: DropdownSize
  /** the options shown in the open list */
  options: DropdownOption[]
  /** controlled selected value */
  value?: string
  /** uncontrolled initial value */
  defaultValue?: string
  /** called with the value of the chosen option */
  onChange?: (value: string) => void
  /** shown in the field when nothing is selected (input placeholder grey) */
  placeholder?: string
  /** leading icon inside the field */
  leading?: ReactNode
  /** error styling (red border) */
  error?: boolean
  disabled?: boolean
  /** force the list open (e.g. for docs); overrides the internal open state */
  open?: boolean
  /**
   * type-to-filter mode: the closed field becomes an editable input — clicking
   * focuses it, typing opens the list and live-filters the options by a
   * case-insensitive substring match on the option label, Enter selects the
   * active option, and Escape clears the query (then closes the list). Defaults
   * to false, keeping the classic button trigger.
   */
  filterable?: boolean
  className?: string
  "aria-label"?: string
}

/**
 * dropdown — select-style closed field + open list panel. Dependency-free.
 *
 * The closed field mirrors text-input: fill gray-50 (#F5F5F5), 0.5px black/10
 * border, 6px radius. Focus (via focus-within) turns the border black and adds
 * a 3px black/10 ring; error uses the red-500 border; disabled uses #EBEBEB
 * fill with #8F8F8F text and a not-allowed cursor. The field shows the
 * selected option label, or the placeholder in the input's #525252 placeholder
 * colour. The trailing ChevronDown rotates 180° while open.
 *
 * The open panel reuses the repo's popover recipe (white fill, 0.5px black/10
 * hairline, 6px radius, the shared popover shadow from breadcrumb /
 * search-field) and its rows are composed from ListBase — the row size follows
 * the dropdown's size prop, the selected row gets a trailing Check, and
 * disabled options use the ListBase disabled state.
 *
 * Behaviour: opens on click, closes on Escape and outside pointer-down.
 * Keyboard: ArrowUp/ArrowDown move the active option (wrapping, skipping
 * disabled), Enter/Space selects the active option.
 *
 * With `filterable` the trigger swaps from a button to an editable text input
 * on the same field recipe (same sizes, focus ring, error and disabled states,
 * same chevron). Typing opens the list and filters options by a
 * case-insensitive substring match on the label; an empty result renders a
 * single "No results" row. Enter picks the active option (the field text
 * becomes its label and onChange fires); Escape first clears the query, then
 * closes the list; closing the list always drops the query so the field falls
 * back to the selected label. Accessibility switches to the ARIA combobox
 * pattern (role="combobox" + aria-autocomplete="list" on the input,
 * aria-expanded, aria-controls and aria-activedescendant pointing at the
 * listbox); the classic mode keeps its button + listbox roles untouched.
 */
export function Dropdown({
  size = "md",
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select…",
  leading,
  error = false,
  disabled = false,
  open,
  filterable = false,
  className,
  "aria-label": ariaLabel,
}: DropdownProps) {
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue)
  const selectedValue = value !== undefined ? value : internalValue
  const selected = options.find((o) => o.value === selectedValue)

  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = !disabled && (open ?? internalOpen)

  // filterable: the live filter text; null = the field shows the selected label
  const [query, setQuery] = useState<string | null>(null)

  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()

  const filterOptions = (q: string) =>
    q === "" ? options : options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()))
  // classic mode never filters, so the list (and every index below) is unchanged
  const visibleOptions = filterable && query != null ? filterOptions(query) : options

  // close on outside pointer-down and Escape (the breadcrumb EllipsisMenu pattern)
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

  // closing the list drops the filter query, so the field falls back to the
  // selected option label
  useEffect(() => {
    if (!isOpen) setQuery(null)
  }, [isOpen])

  // keep the keyboard-active row in view
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return
    document.getElementById(`${listboxId}-option-${activeIndex}`)?.scrollIntoView({ block: "nearest" })
  }, [activeIndex, isOpen, listboxId])

  const enabledIndexes = visibleOptions.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0)

  const initialActive = (dir: 1 | -1) => {
    const selectedIndex = visibleOptions.findIndex((o) => o.value === selectedValue && !o.disabled)
    if (selectedIndex >= 0) return selectedIndex
    if (enabledIndexes.length === 0) return -1
    return dir === 1 ? enabledIndexes[0]! : enabledIndexes[enabledIndexes.length - 1]!
  }

  const moveActive = (dir: 1 | -1) => {
    setActiveIndex((prev) => {
      if (enabledIndexes.length === 0) return -1
      const pos = enabledIndexes.indexOf(prev)
      if (pos < 0) return dir === 1 ? enabledIndexes[0]! : enabledIndexes[enabledIndexes.length - 1]!
      return enabledIndexes[(pos + dir + enabledIndexes.length) % enabledIndexes.length]!
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

  const selectOption = (option: DropdownOption) => {
    if (option.disabled) return
    if (value === undefined) setInternalValue(option.value)
    onChange?.(option.value)
    setQuery(null)
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
          const option = activeIndex >= 0 ? visibleOptions[activeIndex] : undefined
          if (option) selectOption(option)
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

  const onInputChange = (e: ReactChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    setInternalOpen(true)
    // activate the first enabled match so Enter picks it without an arrow key
    setActiveIndex(filterOptions(q).findIndex((o) => !o.disabled))
  }

  const onInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (disabled) return
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        // keep the text caret at the end of the input while moving the option
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
      case "Enter": {
        if (isOpen) {
          e.preventDefault()
          const option = activeIndex >= 0 ? visibleOptions[activeIndex] : undefined
          if (option) selectOption(option)
          else setInternalOpen(false)
        }
        break
      }
      case "Escape": {
        if (query) {
          // first Escape clears the query and shows the full list again
          e.stopPropagation()
          setQuery(null)
          setActiveIndex(-1)
        } else if (isOpen) {
          e.stopPropagation()
          setInternalOpen(false)
        }
        break
      }
    }
  }

  const iconSize = size === "sm" ? 12 : 18

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {/* closed field — the text-input recipe */}
      <div
        className={cn(
          "flex w-full items-center rounded-[6px] border-[0.5px]",
          size === "sm" && "h-8",
          disabled
            ? "border-black/10 bg-[#EBEBEB]"
            : error
              ? "border-red-500 bg-white focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]"
              : "border-black/10 bg-white focus-within:border-black focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]",
        )}
      >
        {filterable ? (
          <div
            onClick={() => {
              if (disabled) return
              inputRef.current?.focus()
              if (!isOpen) openList()
            }}
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2 bg-transparent",
              size === "sm" ? "px-2 text-[12px] leading-[16px]" : "p-3 text-sm leading-5",
              disabled && "cursor-not-allowed",
            )}
          >
            {leading != null && (
              <span
                className={cn(
                  "flex shrink-0 items-center",
                  disabled ? "text-[#8F8F8F]" : "text-[#525252]",
                )}
              >
                {leading}
              </span>
            )}
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={isOpen}
              aria-controls={isOpen ? listboxId : undefined}
              aria-autocomplete="list"
              aria-activedescendant={
                isOpen && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
              }
              aria-label={ariaLabel}
              disabled={disabled}
              value={query ?? selected?.label ?? ""}
              placeholder={placeholder}
              onChange={onInputChange}
              onKeyDown={onInputKeyDown}
              className={cn(
                "min-w-0 flex-1 bg-transparent text-black outline-none placeholder:text-[#525252]",
                disabled && "cursor-not-allowed text-[#8F8F8F] placeholder:text-[#8F8F8F]",
              )}
            />
            <ChevronDown
              size={iconSize}
              aria-hidden
              className={cn(
                "shrink-0 transition-transform duration-150",
                isOpen && "rotate-180",
                disabled ? "text-[#8F8F8F]" : "text-[#525252]",
              )}
            />
          </div>
        ) : (
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
              "flex min-w-0 flex-1 items-center gap-2 bg-transparent text-left outline-none",
              size === "sm" ? "px-2 text-[12px] leading-[16px]" : "p-3 text-sm leading-5",
              disabled && "cursor-not-allowed",
            )}
          >
            {leading != null && (
              <span
                className={cn(
                  "flex shrink-0 items-center",
                  disabled ? "text-[#8F8F8F]" : "text-[#525252]",
                )}
              >
                {leading}
              </span>
            )}
            <span
              className={cn(
                "min-w-0 flex-1 truncate",
                disabled ? "text-[#8F8F8F]" : selected ? "text-black" : "text-[#525252]",
              )}
            >
              {selected ? selected.label : placeholder}
            </span>
            <ChevronDown
              size={iconSize}
              aria-hidden
              className={cn(
                "shrink-0 transition-transform duration-150",
                isOpen && "rotate-180",
                disabled ? "text-[#8F8F8F]" : "text-[#525252]",
              )}
            />
          </button>
        )}
      </div>

      {/* open list — the repo popover recipe, rows composed from ListBase */}
      {isOpen && (
        <div
          role="listbox"
          id={listboxId}
          aria-label={ariaLabel}
          className={cn(
            "absolute left-0 top-full z-50 mt-1 flex max-h-60 w-full flex-col gap-1 overflow-y-auto",
            "rounded-[6px] border-[0.5px] border-black/10 bg-white p-1",
            "shadow-[0_1px_1px_0_rgba(0,0,0,0.05),0_4px_8px_0_rgba(0,0,0,0.05),0_2px_4px_0_rgba(0,0,0,0.05)]",
          )}
        >
          {visibleOptions.length === 0 ? (
            <ListBase size={size} state="disabled" className="cursor-default" aria-hidden="true">
              No results
            </ListBase>
          ) : (
            visibleOptions.map((option, i) => {
              const isSelected = option.value === selectedValue
              return (
                <ListBase
                  key={option.value}
                  id={`${listboxId}-option-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  size={size}
                  state={
                    option.disabled
                      ? "disabled"
                      : i === activeIndex
                        ? "hover"
                        : isSelected
                          ? "selected"
                          : "default"
                  }
                  trailing={isSelected ? <Check aria-hidden /> : undefined}
                  className={option.disabled ? undefined : "cursor-pointer"}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => {
                    if (!option.disabled) setActiveIndex(i)
                  }}
                >
                  {option.label}
                </ListBase>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
