import { useId, type ReactNode } from "react"
import { Info } from "lucide-react"
import { cn } from "../lib/cn.js"
import { Dropdown, type DropdownProps } from "../dropdown/index.js"
import { Tooltip } from "../tooltip/index.js"

interface ComboboxChromeProps {
  /** label text shown above the field (14px / 500) */
  label: ReactNode
  /** shows a red asterisk after the label; otherwise an "(Optional)" caption */
  required?: boolean
  /** tooltip content — when present a trailing info icon (14px) appears in the label row */
  info?: ReactNode
  /** hint text below the field (turns red when error) */
  hint?: ReactNode
  /** error styling — red field border + red hint */
  error?: boolean
  /** base id for the label/hint ids (auto-generated when omitted) */
  id?: string
  /** className for the outer wrapper (the field column) */
  className?: string
}

export type ComboboxProps = ComboboxChromeProps &
  Omit<DropdownProps, "error" | "className">

/**
 * combobox — the complete select-style form field: label row + dropdown + hint
 * row.
 *
 * Composes the existing Dropdown; every Dropdown prop (size, options,
 * value/defaultValue/onChange, placeholder, leading, disabled, open,
 * aria-label) passes straight through, so size="sm" renders the sm field AND
 * the sm list rows, and error renders Dropdown's red field border.
 *
 * The chrome mirrors text-field exactly: column flex with 8px gaps; label row
 * is a 2px-gap row (14px/500 label, red asterisk when required, "(Optional)"
 * #8F8F8F otherwise, trailing 14px info icon when the field has tooltip
 * content); hint row is a 4px-gap row (12px info icon + 12px hint, #000000
 * default / red on error).
 *
 * Accessibility: Dropdown's trigger is a button and (unlike TextInput) accepts
 * no id, so the text-field htmlFor pattern cannot target it. Instead the
 * wrapper is a role="group" labelled by the visible label and described by the
 * hint, and — when the label is a plain string — it is also passed to Dropdown
 * as aria-label so the trigger button itself gets the label as its accessible
 * name (an explicit aria-label prop always wins).
 */
export function Combobox({
  label,
  required = false,
  info,
  hint,
  error = false,
  id,
  className,
  ...dropdownProps
}: ComboboxProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const labelId = `${fieldId}-label`
  const hintId = `${fieldId}-hint`
  const describedBy = hint != null ? hintId : undefined

  const triggerLabel =
    dropdownProps["aria-label"] ?? (typeof label === "string" ? label : undefined)

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      aria-describedby={describedBy}
      className={cn("flex w-full flex-col gap-2", className)}
    >
      <div className="flex items-center gap-0.5">
        <span id={labelId} className="text-sm font-medium leading-5 text-black">
          {label}
        </span>
        {required ? (
          <span aria-hidden="true" className="text-sm font-medium leading-5 text-[#C0180C]">
            *
          </span>
        ) : (
          <span className="text-sm leading-5 text-[#8F8F8F]">(Optional)</span>
        )}
        {info != null && (
          <Tooltip body={info}>
            <Info size={14} className="text-[#8F8F8F]" aria-hidden="true" />
          </Tooltip>
        )}
      </div>

      <Dropdown {...dropdownProps} aria-label={triggerLabel} error={error} />

      {hint != null && (
        <div className={cn("flex items-center gap-1", error ? "text-red-500" : "text-black")}>
          <Info size={12} className="shrink-0" aria-hidden="true" />
          <span id={hintId} className="text-xs leading-4">
            {hint}
          </span>
        </div>
      )}
    </div>
  )
}
