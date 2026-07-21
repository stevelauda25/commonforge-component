import { AlertCircle, CheckCircle2, FileText, RefreshCw, X } from "lucide-react"
import { cn } from "../lib/cn.js"

export type FileListState = "default" | "uploading" | "success" | "failed"

export interface FileListProps {
  state?: FileListState
  fileName?: string
  fileSize?: string
  progress?: number
  onRemove?: () => void
  onRetry?: () => void
  className?: string
}

export function FileList({
  state = "default",
  fileName = "selected-file.pdf",
  fileSize = "1.68 MB",
  progress = 68,
  onRemove,
  onRetry,
  className,
}: FileListProps) {
  const status = {
    default: "Ready to upload",
    uploading: `${Math.round(progress)}%`,
    success: "File uploaded",
    failed: "Upload failed. Try again",
  }[state]

  return (
    <div
      className={cn(
        "flex h-16 w-full max-w-[520px] items-center justify-between rounded-lg border bg-white p-2",
        state === "failed" ? "border-red-500" : "border-black/20",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-[2px]",
            state === "failed" ? "bg-red-25 text-red-500" : "bg-[#F0F0F0] text-black",
          )}
        >
          <FileText size={24} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm leading-5 text-black">{fileName}</p>
          <div
            className={cn(
              "mt-1 flex items-center gap-1 text-xs leading-4",
              state === "uploading" || state === "success" ? "text-[#525252]" : "text-[#8F8F8F]",
            )}
          >
            <span>{fileSize}</span>
            <span aria-hidden="true">·</span>
            <span className={cn(state === "failed" && "text-red-500")}>
              {status}
            </span>
          </div>
          {state === "uploading" && (
            <div className="mt-1 h-1 w-36 overflow-hidden rounded-full bg-black/8" aria-hidden="true">
              <div className="h-full rounded-full bg-crimson-500" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
            </div>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {state === "success" && <CheckCircle2 size={20} className="text-green-500" aria-label="Upload complete" />}
        {state === "failed" && <AlertCircle size={20} className="text-red-500" aria-label="Upload failed" />}
        {state === "failed" && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-9 items-center gap-1.5 rounded-[6px] px-2 text-xs font-medium text-red-500 outline-none hover:bg-red-25 focus-visible:ring-2 focus-visible:ring-red-500/20"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Retry
          </button>
        )}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex size-9 items-center justify-center rounded-full p-0 text-[#525252] outline-none hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-black/20"
            aria-label={`Remove ${fileName}`}
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
