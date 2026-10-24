"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Tooltip } from "@/components/ui/Tooltip";

export interface ConfidenceMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Confidence score between 0 and 100, or a level string */
  confidence?: number;
  level?: "low" | "medium" | "high";
  note?: string;
  label?: string;
  showPercentage?: boolean;
}

export function ConfidenceMeter({
  confidence,
  level: levelProp,
  note,
  label = "Model confidence",
  showPercentage = true,
  className,
  ...props
}: ConfidenceMeterProps) {
  const numericConf =
    confidence !== undefined
      ? confidence
      : levelProp === "high"
      ? 85
      : levelProp === "medium"
      ? 55
      : 30;

  const clamped = Math.min(Math.max(numericConf, 0), 100);

  // Confidence category
  const level =
    levelProp !== undefined
      ? levelProp === "high"
        ? "High"
        : levelProp === "medium"
        ? "Moderate"
        : "Low"
      : clamped >= 75
      ? "High"
      : clamped >= 45
      ? "Moderate"
      : "Low";

  const levelColor =
    clamped >= 75
      ? "text-[var(--candle)]"
      : clamped >= 45
      ? "text-[var(--amber)]"
      : "text-[var(--text-2)]";

  return (
    <div className={cn("flex flex-col space-y-1.5", className)} {...props}>
      <div className="flex items-center justify-between text-xs">
        <Tooltip
          content={
            note ||
            "The model's own confidence in this scenario. Not a statistical probability or win rate."
          }
        >
          <span className="flex items-center gap-1.5 text-[var(--text-1)] cursor-help border-b border-dotted border-[var(--text-2)]">
            <span>{label}</span>
            <span className="text-[10px] text-[var(--text-2)]">ℹ️</span>
          </span>
        </Tooltip>

        <span className={cn("font-medium text-xs font-mono", levelColor)}>
          {level} {showPercentage && `(${clamped}%)`}
        </span>
      </div>

      <div
        className="h-2 w-full rounded-full bg-[var(--bg-3)] border border-[var(--line)] overflow-hidden"
        role="meter"
        aria-label="Model confidence level"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${clamped}%`,
            background:
              clamped >= 75
                ? "linear-gradient(90deg, var(--candle), var(--candle-hi))"
                : clamped >= 45
                ? "linear-gradient(90deg, var(--amber), var(--candle))"
                : "linear-gradient(90deg, var(--bear), var(--amber))",
          }}
        />
      </div>
    </div>
  );
}
