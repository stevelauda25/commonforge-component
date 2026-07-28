import { Fragment } from "react"
import { FileText, X } from "lucide-react"
import { cn } from "../lib/cn.js"

export type FileListStatus = "ready" | "uploading" | "uploaded" | "error"

export interface FileListProps {
  status?: FileListStatus
  name?: string
  size?: string
  progress?: number
  onRemove?: () => void
  onRetry?: () => void
  className?: string
}

const statusBorder: Record<FileListStatus, string> = {
  ready: "border-dashed border-black/20",
  uploading: "border-black/20",
  uploaded: "border-black/20",
  error: "border-error",
}

const statusMetaColor: Record<FileListStatus, string> = {
  ready: "text-gray-500",
  uploading: "text-subtle",
  uploaded: "text-subtle",
  error: "text-error",
}

export function FileList({
  status = "ready",
  name = "selected-file.pdf",
  size = "1.68 MB",
  progress = 68,
  onRemove,
  onRetry,
  className,
}: FileListProps) {
  const percent = Math.min(100, Math.max(0, Math.round(progress)))
  const metaSegments =
    status === "ready"
      ? [size, "Ready to upload"]
      : status === "uploading"
        ? ["Uploading", `${percent}%`]
        : status === "uploaded"
          ? ["File uploaded", size]
          : ["Upload failed. Try again"]

  return (
    <div
      className={cn(
        "flex h-16 w-full max-w-[520px] items-center justify-between rounded-md border bg-white p-2",
        statusBorder[status],
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xxs",
            status === "error" ? "bg-error-subtle" : "bg-gray-75",
          )}
        >
          <FileText size={24} aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate text-sm font-normal leading-5 text-strong">{name}</p>
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-normal leading-4",
              statusMetaColor[status],
            )}
          >
            {metaSegments.map((segment, index) => (
              <Fragment key={segment}>
                {index > 0 && <span aria-hidden="true">·</span>}
                <span>{segment}</span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {status === "error" && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center rounded-full px-3 py-2.5 text-xs font-medium leading-4 text-error outline-none hover:bg-error-subtle focus-visible:ring-2 focus-visible:ring-red-500/20"
          >
            Retry
          </button>
        )}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex size-9 items-center justify-center rounded-full text-subtle outline-none hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-black/20"
            aria-label={`Remove ${name}`}
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
