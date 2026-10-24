import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type MarketBias = "bullish" | "bearish" | "neutral" | "bull" | "bear";

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
  const normalizedBias: "bullish" | "bearish" | "neutral" =
    bias === "bull" ? "bullish" : bias === "bear" ? "bearish" : bias;

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
  }[normalizedBias];

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3.5 py-1.5 gap-2 font-semibold",
  }[size];

  const textLabel = label ?? configs.defaultLabel;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium select-none tracking-wide transition-colors",
        configs.classes,
        sizeClasses,
        className
      )}
      role="status"
      aria-label={`Market bias: ${textLabel}`}
      {...props}
    >
      <span aria-hidden="true" className="font-mono text-[0.8em]">
        {configs.icon}
      </span>
      <span>{textLabel}</span>
    </span>
  );
}
