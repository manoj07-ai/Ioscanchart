"use client";

import React from "react";
import { formatMoney } from "@/lib/journal/format";
import type { WeekAggregate } from "@/lib/journal/calendar";

interface WeekCellProps {
  aggregate: WeekAggregate;
  currency: string;
  viewMode: "pnl" | "r";
  privacyBlur?: boolean;
}

export function WeekCell({
  aggregate,
  currency,
  viewMode,
  privacyBlur = false,
}: WeekCellProps) {
  const hasTrades = aggregate.count > 0;
  const isProfit = aggregate.pnl > 0;
  const isLoss = aggregate.pnl < 0;

  let valueDisplay = "—";
  let glyph = "";

  if (hasTrades) {
    glyph = isProfit ? "▲ " : isLoss ? "▼ " : "";
    if (privacyBlur) {
      valueDisplay = "••••";
    } else if (viewMode === "r") {
      valueDisplay = aggregate.r > 0 ? `+${aggregate.r}R` : `${aggregate.r}R`;
    } else {
      valueDisplay = formatMoney(aggregate.pnl, currency, {
        signDisplay: "always",
        privacyBlur,
        compact: true,
      });
    }
  }

  return (
    <div className="min-h-[72px] sm:min-h-[88px] p-2 sm:p-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg-2)]/60 flex flex-col justify-between select-none">
      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-2)]">
        W{aggregate.weekNumber}
      </span>

      {hasTrades ? (
        <div className="mt-auto space-y-0.5">
          <div
            className={`font-mono text-xs sm:text-sm font-bold tracking-tight truncate flex items-center ${
              isProfit
                ? "text-[var(--candle)]"
                : isLoss
                ? "text-[var(--bear)]"
                : "text-[var(--text-0)]"
            }`}
          >
            <span className="text-[10px] mr-0.5">{glyph}</span>
            <span>{valueDisplay}</span>
          </div>

          <div className="text-[10px] text-[var(--text-2)] font-mono truncate">
            {aggregate.count} trade{aggregate.count === 1 ? "" : "s"}
          </div>
        </div>
      ) : (
        <div className="mt-auto text-xs font-mono text-[var(--text-2)]">—</div>
      )}
    </div>
  );
}
