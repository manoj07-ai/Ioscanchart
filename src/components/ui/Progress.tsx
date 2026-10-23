import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0 to 100
  max?: number;
  indeterminate?: boolean;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, indeterminate = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-[var(--bg-3)] border border-[var(--line)]",
          className
        )}
        {...props}
      >
        {indeterminate ? (
          <div
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-[var(--candle)] to-[var(--candle-hi)] animate-[shimmer_1.5s_infinite]"
            style={{
              animation: "shimmer 1.5s infinite linear",
            }}
          />
        ) : (
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${percentage}%`,
              background: "linear-gradient(90deg, var(--candle), var(--candle-hi))",
            }}
          />
        )}
      </div>
    );
  }
);

Progress.displayName = "Progress";
