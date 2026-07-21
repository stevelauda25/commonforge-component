"use client";

import { forwardRef, useId, useState, type TextareaHTMLAttributes } from "react"
import { cn } from "../lib/cn.js"

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  containerClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
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

    return (
      <div
        className={cn(
          "flex h-[136px] w-full flex-col rounded-[6px] border bg-[#F5F5F5] p-3 transition-shadow focus-within:border-black focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]",
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
            "min-h-0 flex-1 resize-none bg-transparent text-sm leading-5 text-black outline-none placeholder:text-[#525252]",
            disabled && "text-[#8F8F8F] placeholder:text-[#8F8F8F]",
            className,
          )}
        />
        <span
          id={counterId}
          className={cn("mt-2 text-right text-xs leading-3 text-[#8F8F8F]", disabled && "text-[#CCCCCC]")}
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
