import { cn } from "../lib/cn.js"

export type LegendVariant = "square" | "line"

export type LegendLineStyle = "dashed" | "dotted" | "solid"

const LINE_STYLE_PROPS: Record<
  LegendLineStyle,
  { strokeDasharray?: string; strokeLinecap?: "round" }
> = {
  dashed: { strokeDasharray: "6 4" },
  dotted: { strokeDasharray: "1.5 3", strokeLinecap: "round" },
  solid: {},
}

export interface LegendProps {
  variant?: LegendVariant
  color: string
  label: string
  value?: string
  percent?: string
  dashed?: boolean
  lineStyle?: LegendLineStyle
  bordered?: boolean
  className?: string
}

function LegendSwatch({
  variant,
  color,
  dashed,
  lineStyle,
  bordered,
}: Pick<LegendProps, "variant" | "color" | "dashed" | "lineStyle" | "bordered">) {
  if (variant === "line") {
    const resolvedLineStyle = lineStyle ?? (dashed ? "dashed" : "solid")
    return (
      <svg
        aria-hidden="true"
        width="16"
        height="2"
        viewBox="0 0 16 2"
        className="shrink-0"
      >
        <line
          x1="0"
          y1="1"
          x2="16"
          y2="1"
          stroke={color}
          strokeWidth={2}
          {...LINE_STYLE_PROPS[resolvedLineStyle]}
        />
      </svg>
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
  lineStyle,
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
        <LegendSwatch variant={variant} color={color} dashed={dashed} lineStyle={lineStyle} bordered={bordered} />
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
