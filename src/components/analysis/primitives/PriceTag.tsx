"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/formatters";

export interface PriceTagProps extends React.HTMLAttributes<HTMLButtonElement> {
  price: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  copyable?: boolean;
}

export function PriceTag({
  price,
  decimals,
  prefix = "",
  suffix = "",
  copyable = true,
  className,
  ...props
}: PriceTagProps) {
  const [copied, setCopied] = React.useState(false);
  const formatted = formatPrice(price, decimals);
  const displayString = `${prefix}${formatted}${suffix}`;

  const handleCopy = async () => {
    if (!copyable) return;
    try {
      await navigator.clipboard.writeText(displayString);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback or ignore
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copyable ? (copied ? "Copied!" : "Click to copy price") : undefined}
      disabled={!copyable}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono text-xs tabular-nums font-semibold tracking-tight",
        "bg-[var(--bg-3)] border border-[var(--line-strong)] text-[var(--text-0)] transition-all select-all",
        copyable && "cursor-pointer hover:border-[var(--candle)] hover:text-[var(--candle)] active:scale-95",
        copied && "border-[var(--candle)] bg-[var(--candle-dim)]/40 text-[var(--candle)]",
        className
      )}
      {...props}
    >
      <span>{displayString}</span>
      {copyable && (
        <span className="text-[10px] opacity-70" aria-hidden="true">
          {copied ? "✓" : "📋"}
        </span>
      )}
    </button>
  );
}
