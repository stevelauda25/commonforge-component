import { useId, type ReactNode } from "react"
import { Info } from "lucide-react"
import { cn } from "../lib/cn.js"
import { TextInput, type TextInputProps } from "../text-input/index.js"
import { Textarea, type TextareaProps } from "../text-area/index.js"
import { Tooltip } from "../tooltip/index.js"

interface TextFieldBaseProps {
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
  /** id for the inner input/textarea (auto-generated when omitted) */
  id?: string
  /** className for the outer wrapper (the field column) */
  className?: string
}

export type TextFieldProps = TextFieldBaseProps &
  (
    | ({ multiline?: false } & Omit<TextInputProps, "error">)
    | ({ multiline: true } & Omit<TextareaProps, "error">)
  )

/**
 * text-field — the complete form field: label row + field + hint row.
 *
 * Composes the existing TextInput (single-line) and Textarea (multiline); all
 * field sizes/variants/states pass straight through. From Figma: column flex
 * with 8px gaps; label row is a 2px-gap row (14px/500 label, red asterisk when
 * required, "(Optional)" #8F8F8F otherwise, trailing 14px info icon when the
 * field has tooltip content); hint row is a 4px-gap row (12px info icon + 12px
 * hint, #000000 default / red on error).
 *
 * NOTE: the asterisk uses the exact Figma red #C0180C; the error hint uses
 * red-500 to match the existing TextInput/Textarea error border.
 */
export function TextField(props: TextFieldProps) {
  const {
    label,
    required = false,
    info,
    hint,
    error = false,
    id,
    className,
    ...rest
  } = props

  const generatedId = useId()
  const fieldId = id ?? generatedId
  const hintId = `${fieldId}-hint`

  const { multiline = false, ...fieldProps } = rest
  const describedBy = hint != null ? hintId : undefined

  const field = multiline ? (
    <Textarea
      {...(fieldProps as Omit<TextareaProps, "error">)}
      id={fieldId}
      error={error}
      aria-describedby={describedBy}
    />
  ) : (
    <TextInput
      {...(fieldProps as Omit<TextInputProps, "error">)}
      id={fieldId}
      error={error}
      aria-invalid={error || undefined}
      aria-describedby={describedBy}
    />
  )

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <div className="flex items-center gap-0.5">
        <label htmlFor={fieldId} className="text-sm font-medium leading-5 text-black">
          {label}
        </label>
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

      {field}

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
