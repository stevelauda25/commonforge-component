import { useRef, useState, type DragEvent, type InputHTMLAttributes } from "react"
import { CloudUpload } from "lucide-react"
import { cn } from "../lib/cn.js"

export type DropZoneState = "default" | "hover" | "multiple" | "dragging"

export interface DropZoneProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  state?: DropZoneState
  description?: string
  onFiles?: (files: File[]) => void
  className?: string
}

export function DropZone({
  state = "default",
  description = "Supports .txt, .docx, .pdf (max 10MB)",
  disabled,
  multiple,
  accept,
  onFiles,
  className,
  ...inputProps
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const activeState = isDragging ? "dragging" : state
  const headline =
    activeState === "dragging"
      ? "Release to drop"
      : activeState === "multiple" || multiple
        ? "Drop files here, or click to browse"
        : "Drop file here, or click to browse"

  function handleFiles(files: FileList | null) {
    if (files && files.length > 0) onFiles?.(Array.from(files))
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setIsDragging(false)
    if (!disabled) handleFiles(event.dataTransfer.files)
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => inputRef.current?.click()}
      onDragEnter={(event) => {
        event.preventDefault()
        if (!disabled) setIsDragging(true)
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex h-[148px] w-full max-w-[422px] items-center justify-center rounded-[6px] border border-dashed border-black/20 bg-[#F5F5F5] p-0.5 outline-none transition-colors focus-visible:border-black focus-visible:ring-4 focus-visible:ring-black/10",
        activeState === "hover" && "bg-[#EBEBEB]",
        activeState === "dragging" && "border-solid border-crimson-500 bg-crimson-25",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <span className="flex h-[144px] w-full flex-col items-center justify-center gap-2 rounded-[5px]">
        <CloudUpload size={24} className="text-[#525252]" aria-hidden="true" />
        <span className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium leading-[14px] text-black">{headline}</span>
          <span className="text-[10px] leading-3 text-[#8F8F8F]">
            {activeState === "dragging" ? "Drop your files" : description}
          </span>
        </span>
      </span>
      <input
        {...inputProps}
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
        tabIndex={-1}
      />
    </button>
  )
}
