"use client";

import React from "react";
import { formatMoney } from "@/lib/journal/format";
import type { DayAggregate } from "@/lib/journal/calendar";

interface DayCellProps {
  dateString: string;
  dayNumber: number;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  data?: DayAggregate;
  maxDayAbsPnl: number;
  currency: string;
  viewMode: "pnl" | "r";
  privacyBlur?: boolean;
  onClick: () => void;
  onAddTrade: () => void;
}

export function DayCell({
  dateString,
  dayNumber,
  inMonth,
  isToday,
  isSelected,
  data,
  maxDayAbsPnl,
  currency,
  viewMode,
  privacyBlur = false,
  onClick,
  onAddTrade,
}: DayCellProps) {
  if (!inMonth) {
    return (
      <div
        className="min-h-[72px] sm:min-h-[88px] rounded-xl border border-transparent bg-transparent opacity-20 p-2 select-none pointer-events-none"
        aria-hidden="true"
      >
        <span className="text-xs font-mono text-[var(--text-2)]">{dayNumber}</span>
      </div>
    );
  }

  const hasTrades = !!data && data.count > 0;
  const pnl = data?.pnl ?? 0;
  const r = data?.r ?? 0;
  const isProfit = pnl > 0;
  const isLoss = pnl < 0;
  const isBreakeven = hasTrades && pnl === 0;

  // 3-step intensity calculation
  let intensityStep = 1;
  if (hasTrades && maxDayAbsPnl > 0) {
    const ratio = Math.abs(pnl) / maxDayAbsPnl;
    if (ratio > 0.66) intensityStep = 3;
    else if (ratio > 0.33) intensityStep = 2;
  }

  // Styling based on outcome & intensity
  let bgClass = "bg-[var(--bg-1)] hover:bg-[var(--bg-2)] border-[var(--line)]";
  if (isProfit) {
    if (intensityStep === 3) {
      bgClass = "bg-[var(--candle)]/25 border-[var(--candle)]/50 hover:bg-[var(--candle)]/30";
    } else if (intensityStep === 2) {
      bgClass = "bg-[var(--candle)]/18 border-[var(--candle)]/40 hover:bg-[var(--candle)]/22";
    } else {
      bgClass = "bg-[var(--candle)]/12 border-[var(--candle)]/30 hover:bg-[var(--candle)]/16";
    }
  } else if (isLoss) {
    if (intensityStep === 3) {
      bgClass = "bg-[var(--bear)]/25 border-[var(--bear)]/50 hover:bg-[var(--bear)]/30";
    } else if (intensityStep === 2) {
      bgClass = "bg-[var(--bear)]/18 border-[var(--bear)]/40 hover:bg-[var(--bear)]/22";
    } else {
      bgClass = "bg-[var(--bear)]/12 border-[var(--bear)]/30 hover:bg-[var(--bear)]/16";
    }
  } else if (isBreakeven) {
    bgClass = "bg-[var(--bg-3)] border-[var(--line-strong)]";
  }

  // Outlines for today & selected
  let outlineClass = "";
  if (isSelected) {
    outlineClass = "ring-2 ring-[var(--text-0)] ring-offset-1 ring-offset-[var(--bg-0)] z-10";
  } else if (isToday) {
    outlineClass = "ring-1.5 ring-[var(--candle)] z-10";
  }

  // Display value
  let valueDisplay = "";
  let glyph = "";
  if (hasTrades) {
    glyph = isProfit ? "▲ " : isLoss ? "▼ " : "";
    if (privacyBlur) {
      valueDisplay = "••••";
    } else if (viewMode === "r") {
      valueDisplay = r > 0 ? `+${r}R` : `${r}R`;
    } else {
      valueDisplay = formatMoney(pnl, currency, {
        signDisplay: "always",
        privacyBlur,
        compact: true,
      });
    }
  }

  // Accessibility label
  const outcomeText = isProfit
    ? `profit ${Math.abs(pnl)}`
    : isLoss
    ? `loss ${Math.abs(pnl)}`
    : hasTrades
    ? "breakeven"
    : "no trades";
  const ariaLabel = `${dateString}, ${outcomeText}, ${data?.count || 0} trades`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`group relative flex flex-col justify-between min-h-[72px] sm:min-h-[88px] p-2 sm:p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer overflow-hidden ${bgClass} ${outlineClass}`}
    >
      {/* Top row: day number and today dot */}
      <div className="flex items-center justify-between w-full">
        <span
          className={`text-xs font-mono font-medium ${
            isToday ? "text-[var(--candle)] font-bold" : "text-[var(--text-2)]"
          }`}
        >
          {dayNumber}
        </span>
        {isToday && (
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--candle)] shadow-xs" title="Today" />
        )}
      </div>

      {/* Center / Bottom: Trades and P&L */}
      {hasTrades ? (
        <div className="mt-auto space-y-0.5 pt-1">
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
            {data.count} trade{data.count === 1 ? "" : "s"}
          </div>
        </div>
      ) : (
        /* Empty day: centered hover plus icon */
        <div className="mt-auto flex items-center justify-center h-8 opacity-0 group-hover:opacity-100 transition-opacity">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onAddTrade();
            }}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--bg-3)] border border-[var(--line-strong)] text-[var(--candle)] text-xs font-bold hover:scale-110 transition-transform"
            title="Log trade for this day"
          >
            +
          </span>
        </div>
      )}
    </button>
  );
}
