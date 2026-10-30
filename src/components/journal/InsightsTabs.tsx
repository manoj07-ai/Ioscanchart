"use client";

import React, { useState, useMemo } from "react";
import { Sparkles } from "lucide-react";
import { formatMoney } from "@/lib/journal/format";
import { groupInsights, type InsightGroupKey } from "@/lib/journal/insights";
import type { Trade } from "@/lib/journal/schema";

interface InsightsTabsProps {
  trades: Trade[];
  currency: string;
  viewMode: "pnl" | "r";
  privacyBlur?: boolean;
}

const TABS: { id: InsightGroupKey; label: string }[] = [
  { id: "weekday", label: "Weekday" },
  { id: "symbol", label: "Symbol" },
  { id: "setupTag", label: "Setup" },
  { id: "mistakeTag", label: "Mistakes" },
  { id: "followedPlan", label: "Plan Adherence" },
  { id: "market", label: "Market" },
];

export function InsightsTabs({
  trades,
  currency,
  viewMode,
  privacyBlur = false,
}: InsightsTabsProps) {
  const [activeTab, setActiveTab] = useState<InsightGroupKey>("weekday");

  const rows = useMemo(() => {
    return groupInsights(trades, activeTab);
  }, [trades, activeTab]);

  // Max absolute P&L for visual bar scaling
  const maxAbsPnl = useMemo(() => {
    return Math.max(1, ...rows.map((r) => Math.abs(r.netPnl)));
  }, [rows]);

  if (trades.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-5 space-y-4 shadow-xs">
      {/* Header and Tab Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--line)]">
        <div>
          <h3 className="text-sm font-bold text-[var(--text-0)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--candle)] shrink-0" />
            <span>Performance Insights &amp; Breakdown</span>
          </h3>
          <p className="text-[11px] text-[var(--text-2)] mt-0.5">
            Objective pattern detection based solely on your logged execution data.
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] text-xs font-mono">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[var(--bg-3)] text-[var(--candle)] border border-[var(--line)] shadow-2xs"
                  : "text-[var(--text-2)] hover:text-[var(--text-0)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Insights Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[var(--line)] text-[10px] uppercase font-bold text-[var(--text-2)] tracking-wider">
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 text-right">Trades</th>
              <th className="py-2.5 px-3 text-right">{viewMode === "r" ? "Net R" : "Net P&L"}</th>
              <th className="py-2.5 px-3 w-[180px]">Distribution</th>
              <th className="py-2.5 px-3 text-right">Win Rate</th>
              <th className="py-2.5 px-3 text-right">Avg R</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]/50">
            {rows.map((row) => {
              const displayVal = viewMode === "r" ? row.totalR : row.netPnl;
              const isProfit = displayVal > 0;
              const isLoss = displayVal < 0;
              const barWidth = Math.min(100, Math.round((Math.abs(row.netPnl) / maxAbsPnl) * 100));

              return (
                <tr key={row.label} className="hover:bg-[var(--bg-2)]/40 transition-colors">
                  {/* Category Label */}
                  <td className="py-3 px-3 font-semibold text-[var(--text-0)]">
                    {row.label}
                  </td>

                  {/* Trades Count */}
                  <td className="py-3 px-3 text-right text-[var(--text-1)]">
                    {row.count}
                  </td>

                  {/* Net P&L / Net R */}
                  <td
                    className={`py-3 px-3 text-right font-bold ${
                      isProfit
                        ? "text-[var(--candle)]"
                        : isLoss
                        ? "text-[var(--bear)]"
                        : "text-[var(--text-2)]"
                    }`}
                  >
                    {privacyBlur
                      ? "••••"
                      : viewMode === "r"
                      ? `${row.totalR >= 0 ? "+" : ""}${row.totalR.toFixed(2)}R`
                      : formatMoney(row.netPnl, currency, {
                          signDisplay: "always",
                          privacyBlur,
                        })}
                  </td>

                  {/* Visual Bar */}
                  <td className="py-3 px-3">
                    <div className="w-full h-2 rounded-full bg-[var(--bg-2)] overflow-hidden flex items-center">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isProfit ? "bg-[var(--candle)]" : isLoss ? "bg-[var(--bear)]" : "bg-[var(--line)]"
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </td>

                  {/* Win Rate (Gated) */}
                  <td className="py-3 px-3 text-right">
                    {row.winRate !== null ? (
                      <span className="font-bold text-[var(--text-0)]">{row.winRate}%</span>
                    ) : (
                      <span
                        className="text-[10px] text-[var(--text-2)] px-1.5 py-0.5 rounded bg-[var(--bg-2)] border border-[var(--line)]"
                        title="Need at least 10 trades for a statistically valid win rate"
                      >
                        Sample &lt;10
                      </span>
                    )}
                  </td>

                  {/* Avg R */}
                  <td className="py-3 px-3 text-right text-[var(--text-1)]">
                    {row.avgR !== null ? `${row.avgR > 0 ? "+" : ""}${row.avgR}R` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Honesty note */}
      <div className="pt-2 text-[11px] text-[var(--text-2)] border-t border-[var(--line)] flex items-center justify-between">
        <span>Your historical results, not a prediction or trading advice.</span>
        <span className="font-mono text-[10px]">Statistical threshold: 10 trades</span>
      </div>
    </div>
  );
}
