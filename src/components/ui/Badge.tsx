import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "bull" | "bear" | "amber" | "neutral";
  size?: "sm" | "md";
  showIcon?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "neutral",
      size = "md",
      showIcon = true,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      bull: "bg-[var(--candle-dim)]/40 text-[var(--candle)] border-[var(--candle)]/40 hover:bg-[var(--candle-dim)]/60",
      bear: "bg-[var(--bear-dim)]/40 text-[var(--bear)] border-[var(--bear)]/40 hover:bg-[var(--bear-dim)]/60",
      amber: "bg-[#4a3411]/50 text-[var(--amber)] border-[var(--amber)]/40 hover:bg-[#4a3411]/70",
      neutral: "bg-[var(--bg-3)] text-[var(--text-1)] border-[var(--line-strong)] hover:border-[var(--text-2)]",
    }[variant];

    const sizeStyles = {
      sm: "text-[11px] px-2 py-0.5 gap-1",
      md: "text-xs px-2.5 py-1 gap-1.5",
    }[size];

    const defaultIcon = {
      bull: "▲",
      bear: "▼",
      amber: "◆",
      neutral: "●",
    }[variant];

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium rounded-full border transition-colors select-none tracking-tight",
          sizeStyles,
          variantStyles,
          className
        )}
        {...props}
      >
        {showIcon && (
          <span className="text-[9px] opacity-90" aria-hidden="true">
            {defaultIcon}
          </span>
        )}
        <span>{children}</span>
      </span>
    );
  }
);

Badge.displayName = "Badge";
