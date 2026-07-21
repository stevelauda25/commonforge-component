import { cn } from "../lib/cn.js"

export type LegendVariant = "square" | "line"

export interface LegendProps {
  variant?: LegendVariant
  color: string
  label: string
  value?: string
  percent?: string
  dashed?: boolean
  bordered?: boolean
  className?: string
}

function LegendSwatch({
  variant,
  color,
  dashed,
  bordered,
}: Pick<LegendProps, "variant" | "color" | "dashed" | "bordered">) {
  if (variant === "line") {
    return (
      <span
        aria-hidden="true"
        className="h-px w-2.5 shrink-0 border-t"
        style={{ borderColor: color, borderTopStyle: dashed ? "dashed" : "solid" }}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className={cn("size-2.5 shrink-0 rounded-[3px]", bordered && "border border-white/10")}
      style={{ backgroundColor: color }}
    />
  )
}

export function Legend({
  variant = "square",
  color,
  label,
  value,
  percent,
  dashed = true,
  bordered = false,
  className,
}: LegendProps) {
  const hasValue = value != null || percent != null
  return (
    <span
      className={cn(
        "flex items-center whitespace-nowrap text-[11px] leading-[15px] font-normal",
        hasValue ? "gap-2" : "gap-1",
        className,
      )}
    >
      <span className="flex items-center gap-1">
        <LegendSwatch variant={variant} color={color} dashed={dashed} bordered={bordered} />
        <span className="text-[#525252]">{label}</span>
      </span>
      {hasValue && (
        <span className="flex items-center gap-[2px]">
          {value != null && <span className="text-[#525252]">{value}</span>}
          {percent != null && <span className="text-[#8f8f8f]">{percent}</span>}
        </span>
      )}
    </span>
  )
}
