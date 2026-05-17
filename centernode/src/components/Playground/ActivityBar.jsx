"use client";
import { useState } from "react";
import { Package, Layers, Search, Palette, Settings } from "lucide-react";

// =============================================================
// Activity bar — VSCode-style 44px icon rail on the far-left. Clicking
// an icon toggles the floating content panel on the right of the rail.
// Tooltips show on hover (chrome only, doesn't intercept clicks).
//
// `panels` is a map of id → { label, icon, content?, shortcut? }. The
// caller decides what to render inside the floating panel (Components,
// Layers, etc.) — this component just manages the rail UI and tells the
// parent which panel id is open.
export default function ActivityBar({
  items,
  activeId,
  onChange,
}) {
  const [hoverId, setHoverId] = useState(null);

  return (
    <div
      className="w-11 shrink-0 flex flex-col items-center py-2 gap-1 bg-cn-surface border-r border-cn-border-default relative z-30 cn-anim-fade"
      style={{ animationDuration: "var(--cn-dur-settled)" }}
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(isActive ? null : item.id)}
            onMouseEnter={() => setHoverId(item.id)}
            onMouseLeave={() => setHoverId(null)}
            title={`${item.label}${item.shortcut ? ` (${item.shortcut})` : ""}`}
            className={`w-8 h-8 rounded-md flex items-center justify-center relative cn-press transition-all duration-[var(--cn-dur-snappy)] ease-[var(--cn-ease-smooth)] ${
              isActive
                ? "bg-cn-accent-soft text-cn-accent"
                : "text-cn-text-muted hover:bg-cn-elevated hover:text-cn-text-primary"
            }`}
            aria-pressed={isActive}
            aria-label={item.label}
          >
            {/* Active indicator — left edge bar, animated in */}
            {isActive && (
              <span
                className="absolute -left-2 top-1.5 bottom-1.5 w-[2px] rounded-full bg-cn-accent cn-anim-fade"
                style={{
                  animationDuration: "var(--cn-dur-snappy)",
                  boxShadow: "0 0 8px var(--cn-accent-ring)",
                }}
              />
            )}
            <Icon className="w-[14px] h-[14px]" />
            {/* Tooltip */}
            {hoverId === item.id && !isActive && (
              <span
                className="absolute left-full ml-2 px-2 py-1 cn-mono text-[10px] bg-cn-overlay text-cn-text-primary border border-cn-border-default rounded shadow-lg whitespace-nowrap pointer-events-none z-50"
                style={{
                  animation: "cn-fade-up var(--cn-dur-snappy) var(--cn-ease-out) both",
                }}
              >
                {item.label}
                {item.shortcut && (
                  <span className="ml-1.5 text-cn-text-muted">{item.shortcut}</span>
                )}
              </span>
            )}
          </button>
        );
      })}
      <div className="flex-1" />
    </div>
  );
}

// Default item set — caller can override
export const DEFAULT_ACTIVITY_ITEMS = [
  { id: "components", label: "Components", icon: Package, shortcut: "1" },
  { id: "layers",     label: "Layers",     icon: Layers,  shortcut: "2" },
  { id: "search",     label: "Search",     icon: Search,  shortcut: "/" },
  { id: "tokens",     label: "Tokens",     icon: Palette, shortcut: "T" },
];
