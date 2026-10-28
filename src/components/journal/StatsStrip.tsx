"use client";

import React from "react";
import { formatMoney } from "@/lib/journal/format";
import type { TradeStats } from "@/lib/journal/stats";
import { Skeleton } from "@/components/ui/Skeleton";

interface StatsStripProps {
  stats: TradeStats;
  currency: string;
  viewMode: "pnl" | "r";
  privacyBlur?: boolean;
  loading?: boolean;
}

export function StatsStrip({
  stats,
  currency,
  viewMode,
  privacyBlur = false,
  loading = false,
}: StatsStripProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 border-r border-[var(--line)] last:border-r-0 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    );
  }

  const isNetPositive = stats.netPnl > 0;
  const isNetNegative = stats.netPnl < 0;

  // Format net display based on viewMode
  let netDisplay: string;
  if (privacyBlur) {
    netDisplay = "••••";
  } else if (viewMode === "r") {
    const totalR = stats.totalR ?? 0;
    netDisplay = totalR > 0 ? `+${totalR}R` : `${totalR}R`;
  } else {
    netDisplay = formatMoney(stats.netPnl, currency, {
      signDisplay: "always",
      privacyBlur,
    });
  }

  const netGlyph = isNetPositive ? "▲ " : isNetNegative ? "▼ " : "";

  // Win rate formatting
  let winRateDisplay = "—";
  let winRateSubtext = "Need 10+ trades";
  if (stats.winRate !== null) {
    winRateDisplay = `${Math.round(stats.winRate * 100)}%`;
    const decided = stats.wins + stats.losses;
    winRateSubtext = `${stats.wins}W of ${decided} decided`;
  } else if (stats.winRateGatedReason) {
    winRateSubtext = stats.winRateGatedReason;
  }

  // Profit Factor
  let pfDisplay = "—";
  if (stats.profitFactor !== null) {
    pfDisplay = stats.profitFactor.toFixed(2);
  } else if (stats.losses === 0 && stats.wins >= 10) {
    pfDisplay = "∞";
  }

  // Best day display
  let bestDayDisplay = "—";
  let bestDayDate = "No trading days";
  if (stats.bestDay) {
    bestDayDisplay = formatMoney(stats.bestDay.amount, currency, {
      signDisplay: "always",
      privacyBlur,
      compact: true,
    });
    bestDayDate = stats.bestDay.dateString;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] overflow-hidden shadow-xs">
      {/* 1. Net P&L / R */}
      <div className="p-4 border-b sm:border-b-0 border-r border-[var(--line)] space-y-1">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[var(--text-2)] block">
          {viewMode === "r" ? "Net R-Multiple" : "Net P&L"}
        </span>
        <div
          className={`font-mono text-lg sm:text-xl font-bold tracking-tight truncate flex items-center gap-1 ${
            isNetPositive
              ? "text-[var(--candle)]"
              : isNetNegative
              ? "text-[var(--bear)]"
              : "text-[var(--text-0)]"
          }`}
        >
          <span>{netGlyph}</span>
          <span>{netDisplay}</span>
        </div>
        <div className="text-[11px] text-[var(--text-2)] truncate font-mono">
          {stats.tradeCount} trade{stats.tradeCount === 1 ? "" : "s"} logged
        </div>
      </div>

      {/* 2. Win Rate */}
      <div className="p-4 border-b sm:border-b-0 border-r border-[var(--line)] space-y-1">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[var(--text-2)] block">
          Win Rate
        </span>
        <div className="font-mono text-lg sm:text-xl font-bold text-[var(--text-0)] tracking-tight">
          {winRateDisplay}
        </div>
        <div className="text-[11px] text-[var(--text-2)] truncate font-mono" title={winRateSubtext}>
          {winRateSubtext}
        </div>
      </div>

      {/* 3. Profit Factor */}
      <div className="p-4 border-b sm:border-b-0 sm:border-r lg:border-r border-[var(--line)] space-y-1">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[var(--text-2)] block">
          Profit Factor
        </span>
        <div className="font-mono text-lg sm:text-xl font-bold text-[var(--text-0)] tracking-tight">
          {pfDisplay}
        </div>
        <div className="text-[11px] text-[var(--text-2)] truncate font-mono">
          Gross win / |loss|
        </div>
      </div>

      {/* 4. Avg Win / Avg Loss */}
      <div className="p-4 border-b lg:border-b-0 border-r border-[var(--line)] space-y-1">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[var(--text-2)] block">
          Avg Win / Loss
        </span>
        <div className="font-mono text-sm sm:text-base font-bold flex items-center gap-1.5 truncate">
          <span className="text-[var(--candle)] truncate">
            {formatMoney(stats.avgWin, currency, { privacyBlur, compact: true })}
          </span>
          <span className="text-[var(--text-2)] font-normal">/</span>
          <span className="text-[var(--bear)] truncate">
            {formatMoney(stats.avgLoss, currency, { privacyBlur, compact: true })}
          </span>
        </div>
        <div className="text-[11px] text-[var(--text-2)] truncate font-mono">
          Expectancy: {stats.expectancy !== null ? `${stats.expectancy > 0 ? "+" : ""}${stats.expectancy}` : "—"}
        </div>
      </div>

      {/* 5. Best Day */}
      <div className="p-4 border-r border-[var(--line)] space-y-1">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[var(--text-2)] block">
          Best Day
        </span>
        <div className="font-mono text-lg sm:text-xl font-bold text-[var(--candle)] tracking-tight truncate">
          {bestDayDisplay}
        </div>
        <div className="text-[11px] text-[var(--text-2)] truncate font-mono">
          {bestDayDate}
        </div>
      </div>

      {/* 6. Total Trades Breakdown */}
      <div className="p-4 space-y-1">
        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[var(--text-2)] block">
          W / L / BE Split
        </span>
        <div className="font-mono text-lg sm:text-xl font-bold text-[var(--text-0)] tracking-tight">
          <span className="text-[var(--candle)]">{stats.wins}W</span>
          <span className="text-[var(--text-2)] font-normal mx-1">·</span>
          <span className="text-[var(--bear)]">{stats.losses}L</span>
          <span className="text-[var(--text-2)] font-normal mx-1">·</span>
          <span className="text-[var(--text-2)]">{stats.breakeven}BE</span>
        </div>
        <div className="text-[11px] text-[var(--text-2)] truncate font-mono">
          Max DD: {formatMoney(stats.maxDrawdown, currency, { privacyBlur, compact: true })}
        </div>
      </div>
    </div>
  );
}
