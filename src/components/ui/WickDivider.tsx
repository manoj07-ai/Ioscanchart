import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface WickDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  withGlyph?: boolean;
}

export function WickDivider({
  withGlyph = true,
  className,
  ...props
}: WickDividerProps) {
  return (
    <div
      role="separator"
      className={cn("wick-divider my-8 select-none opacity-80", className)}
      {...props}
    >
      {withGlyph && (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--line-strong)] bg-[var(--bg-1)]">
          {/* Miniature wick + candle */}
          <span className="w-0.5 h-3 bg-[var(--candle)] rounded-full" />
          <span className="w-2 h-3.5 rounded-sm bg-gradient-to-b from-[var(--candle-hi)] to-[var(--candle)]" />
          <span className="w-0.5 h-2 bg-[var(--candle)] rounded-full" />
        </div>
      )}
    </div>
  );
}
