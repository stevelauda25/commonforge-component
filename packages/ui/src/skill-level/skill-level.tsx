import { cn } from "../lib/cn.js"

export interface SkillLevelProps {
  level: 1 | 2 | 3 | 4 | 5
  className?: string
  label?: string
}

const levelColors = {
  1: "bg-red-400",
  2: "bg-amber-400",
  3: "bg-amber-400",
  4: "bg-green-400",
  5: "bg-green-400",
} as const

export function SkillLevel({ level, className, label = `Skill level ${level} of 5` }: SkillLevelProps) {
  return (
    <span className={cn("inline-flex items-center gap-[3px]", className)} role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((dot) => (
        <span
          key={dot}
          aria-hidden="true"
          className={cn(
            "size-2 rounded-full border-[0.5px] border-black/10",
            dot <= level ? levelColors[level] : "bg-transparent",
          )}
        />
      ))}
    </span>
  )
}
