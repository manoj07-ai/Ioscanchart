import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type LevelType = "support" | "resistance" | "zone" | "pivot";

export interface LevelChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: LevelType;
  /** Strength rating: 1 (weak), 2 (moderate), 3 (major / high confluence) */
  strength?: 1 | 2 | 3;
  label?: string;
}

export function LevelChip({
  type,
  strength = 2,
  label,
  className,
  ...props
}: LevelChipProps) {
  const typeConfig = {
    support: {
      defaultLabel: "Support",
      colorClass: "text-[var(--candle)] border-[var(--candle)]/30 bg-[var(--candle-dim)]/20",
    },
    resistance: {
      defaultLabel: "Resistance",
      colorClass: "text-[var(--bear)] border-[var(--bear)]/30 bg-[var(--bear-dim)]/20",
    },
    zone: {
      defaultLabel: "Key Zone",
      colorClass: "text-[var(--amber)] border-[var(--amber)]/30 bg-[#4a3411]/20",
    },
    pivot: {
      defaultLabel: "Pivot",
      colorClass: "text-[var(--info)] border-[var(--info)]/30 bg-[var(--bg-3)]",
    },
  }[type];

  const displayLabel = label ?? typeConfig.defaultLabel;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-medium tracking-tight select-none",
        typeConfig.colorClass,
        className
      )}
      {...props}
    >
      <span>{displayLabel}</span>
      {/* Strength indicator dots */}
      <span
        className="flex items-center gap-0.5 tracking-tighter"
        title={`Strength: ${strength}/3`}
        aria-label={`Strength ${strength} of 3`}
      >
        <span className={cn("text-[8px]", strength >= 1 ? "opacity-100" : "opacity-25")}>
          ●
        </span>
        <span className={cn("text-[8px]", strength >= 2 ? "opacity-100" : "opacity-25")}>
          ●
        </span>
        <span className={cn("text-[8px]", strength >= 3 ? "opacity-100" : "opacity-25")}>
          ●
        </span>
      </span>
    </span>
  );
}
