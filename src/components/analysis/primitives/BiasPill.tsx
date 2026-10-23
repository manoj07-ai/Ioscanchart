import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type MarketBias = "bullish" | "bearish" | "neutral";

export interface BiasPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  bias: MarketBias;
  size?: "sm" | "md" | "lg";
  /** Optional custom label override */
  label?: string;
}

export function BiasPill({
  bias,
  size = "md",
  label,
  className,
  ...props
}: BiasPillProps) {
  const configs = {
    bullish: {
      icon: "▲",
      defaultLabel: "Bullish",
      classes:
        "bg-[var(--candle-dim)]/30 text-[var(--candle)] border-[var(--candle)]/40 shadow-sm shadow-[var(--candle-glow)]",
    },
    bearish: {
      icon: "▼",
      defaultLabel: "Bearish",
      classes:
        "bg-[var(--bear-dim)]/30 text-[var(--bear)] border-[var(--bear)]/40 shadow-sm shadow-[var(--bear-dim)]/30",
    },
    neutral: {
      icon: "◆",
      defaultLabel: "Neutral",
      classes:
        "bg-[var(--bg-3)] text-[var(--text-1)] border-[var(--line-strong)]",
    },
  }[bias];

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3.5 py-1.5 gap-2 font-semibold",
  }[size];

  const textLabel = label ?? configs.defaultLabel;

  return (
    <span
      role="status"
      aria-label={`Market bias: ${textLabel}`}
      className={cn(
        "inline-flex items-center font-medium rounded-full border transition-colors select-none tracking-tight",
        sizeClasses,
        configs.classes,
        className
      )}
      {...props}
    >
      <span className="text-[10px] font-bold" aria-hidden="true">
        {configs.icon}
      </span>
      <span>{textLabel}</span>
    </span>
  );
}
