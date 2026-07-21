import { useRef, useState, type DragEvent, type InputHTMLAttributes } from "react"
import { CloudUpload } from "lucide-react"
import { cn } from "../lib/cn.js"

export type DropZoneVisualState = "default" | "active" | "dragging"

export interface DropZoneProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  state?: DropZoneVisualState
  description?: string
  maxSizeLabel?: string
  onFiles?: (files: File[]) => void
  className?: string
}

export function DropZone({
  state = "default",
  maxSizeLabel = "max 10MB",
  description = `Supports .txt, .docx, .pdf (${maxSizeLabel})`,
  disabled,
  multiple,
  accept = ".txt,.docx,.pdf",
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
      : multiple
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
    <div
      className={cn(
        "h-[148px] w-full rounded-md border-[0.5px] border-black/5 bg-[#F5F5F5] p-0.5",
        disabled && "bg-[#EBEBEB]",
        className,
      )}
    >
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
          "flex h-full w-full flex-col items-center justify-center gap-2 rounded-[5px] border border-black/10 bg-white outline-none transition-colors focus-visible:ring-2 focus-visible:ring-crimson-500/30 focus-visible:ring-offset-1",
          (activeState === "active" || activeState === "dragging") && "border-crimson-500",
          disabled && "cursor-not-allowed bg-[#F5F5F5]",
        )}
      >
        <CloudUpload
          className={cn("h-8 w-8 opacity-80", disabled ? "text-[#CCCCCC]" : "text-[#8F8F8F]")}
          aria-hidden="true"
        />
        <span className="flex flex-col items-center gap-1">
          <span className="text-xs leading-[14px] opacity-80">{headline}</span>
          <span className="text-[10px] leading-3 text-[#525252] opacity-80">
            {activeState === "dragging" ? "Drop your files" : description}
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
    </div>
  )
}
