"use client";

import { forwardRef, useId, useState, type TextareaHTMLAttributes } from "react"
import { cn } from "../lib/cn.js"

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** md = 12px padding / 14px text (regular), sm = 8px padding / 12px text (compact, mirrors TextInput sm) */
  size?: "sm" | "md"
  error?: boolean
  containerClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = "md",
      error = false,
      disabled,
      maxLength = 250,
      value,
      defaultValue,
      onChange,
      className,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(String(defaultValue ?? ""))
    const currentValue = value === undefined ? internalValue : String(value)
    const counterId = useId()

    // sm = 8px padding + 12px/16px text (TextInput's sm recipe, minus the fixed
    // h-8 height — multiline keeps the min-height/rows behavior); md = 12px
    // padding / 14px/20px text, the original behavior.
    const containerPad = size === "sm" ? "px-2 py-2" : "p-3"
    const inputText = size === "sm" ? "text-[12px] leading-[16px]" : "text-sm leading-5"

    return (
      <div
        className={cn(
          "flex min-h-[136px] w-full flex-col rounded-[6px] border-[0.5px] bg-white transition-shadow focus-within:border-black focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]",
          containerPad,
          error ? "border-red-500" : "border-black/10",
          disabled && "border-black/10 bg-[#EBEBEB] focus-within:shadow-none",
          containerClassName,
        )}
      >
        <textarea
          {...props}
          ref={ref}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          aria-invalid={error || undefined}
          aria-describedby={[props["aria-describedby"], counterId].filter(Boolean).join(" ")}
          onChange={(event) => {
            if (value === undefined) setInternalValue(event.target.value)
            onChange?.(event)
          }}
          className={cn(
            "min-h-24 flex-1 resize-none bg-transparent text-[#525252] outline-none placeholder:text-[#8F8F8F]",
            inputText,
            disabled && "text-[#8F8F8F] placeholder:text-[#8F8F8F]",
            className,
          )}
        />
        <span
          id={counterId}
          className={cn("text-right text-xs leading-3 text-[#8F8F8F] tabular-nums", disabled && "text-[#CCCCCC]")}
        >
          {currentValue.length}/{maxLength}
        </span>
      </div>
    )
  },
)
Textarea.displayName = "Textarea"

/** Legacy aliases kept for compatibility. */
export type TextAreaProps = TextareaProps
export const TextArea = Textarea
