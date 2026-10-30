"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { formatMoney } from "@/lib/journal/format";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BookOpen, Zap, FileText, Edit2, Copy, Trash2 } from "lucide-react";
import type { Trade } from "@/lib/journal/schema";

interface TradeLogProps {
  trades: Trade[];
  currency: string;
  viewMode: "pnl" | "r";
  privacyBlur?: boolean;
  onEditTrade: (trade: Trade) => void;
  onDuplicateTrade: (trade: Trade) => void;
  onDeleteTrade: (id: string) => void;
  onLoadSampleData: () => void;
}

export function TradeLog({
  trades,
  currency,
  viewMode,
  privacyBlur = false,
  onEditTrade,
  onDuplicateTrade,
  onDeleteTrade,
  onLoadSampleData,
}: TradeLogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState<"all" | "win" | "loss" | "breakeven">("all");
  const [tagFilter, setTagFilter] = useState<string>("all");

  // Collect all unique tags for the filter dropdown
  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const t of trades) {
      t.setup_tags?.forEach((tag) => s.add(tag));
      t.mistake_tags?.forEach((tag) => s.add(tag));
    }
    return Array.from(s).sort();
  }, [trades]);

  // Filter trades
  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {
      if (searchTerm && !t.symbol.includes(searchTerm.toUpperCase())) return false;
      if (outcomeFilter === "win" && t.pnl <= 0) return false;
      if (outcomeFilter === "loss" && t.pnl >= 0) return false;
      if (outcomeFilter === "breakeven" && t.pnl !== 0) return false;
      if (tagFilter !== "all") {
        const hasSetup = t.setup_tags?.includes(tagFilter);
        const hasMistake = t.mistake_tags?.includes(tagFilter);
        if (!hasSetup && !hasMistake) return false;
      }
      return true;
    });
  }, [trades, searchTerm, outcomeFilter, tagFilter]);

  // Group filtered trades by date (descending)
  const groupedByDay = useMemo(() => {
    const map = new Map<string, { date: string; dayPnl: number; dayR: number; trades: Trade[] }>();
    for (const t of filteredTrades) {
      let g = map.get(t.trade_date);
      if (!g) {
        g = { date: t.trade_date, dayPnl: 0, dayR: 0, trades: [] };
        map.set(t.trade_date, g);
      }
      g.dayPnl += Number(t.pnl);
      if (t.r_multiple) g.dayR += Number(t.r_multiple);
      g.trades.push(t);
    }
    return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredTrades]);

  if (trades.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-8 text-center space-y-3">
        <BookOpen className="w-8 h-8 text-[var(--candle)] mx-auto mb-1" />
        <h3 className="text-sm font-bold text-[var(--text-0)]">No trades yet</h3>
        <p className="text-xs text-[var(--text-2)] max-w-sm mx-auto leading-relaxed">
          Add your first trade above to start your journal and see your month come to life.
        </p>
        <div className="pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onLoadSampleData}
            className="text-xs flex items-center gap-1.5 mx-auto"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Preview with sample data</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-5 space-y-4 shadow-xs">
      {/* Header and Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--text-0)] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--candle)]" />
            <span>Trade Log ({filteredTrades.length})</span>
          </h3>
        </div>

        {/* Filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search symbol..."
            className="text-xs h-8 font-mono"
          />

          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value as "all" | "win" | "loss" | "breakeven")}
            className="text-xs rounded-md bg-[var(--bg-2)] border border-[var(--line)] text-[var(--text-0)] px-2.5 h-8 focus:border-[var(--candle)] focus:outline-none"
          >
            <option value="all">All Outcomes</option>
            <option value="win">Wins Only</option>
            <option value="loss">Losses Only</option>
            <option value="breakeven">Breakeven Only</option>
          </select>

          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="text-xs rounded-md bg-[var(--bg-2)] border border-[var(--line)] text-[var(--text-0)] px-2.5 h-8 focus:border-[var(--candle)] focus:outline-none"
          >
            <option value="all">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grouped Day Rows */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
        {groupedByDay.map((group) => {
          const isGroupProfit = group.dayPnl > 0;
          const isGroupLoss = group.dayPnl < 0;

          return (
            <div key={group.date} className="space-y-1.5">
              {/* Day Subtotal Header */}
              <div className="flex items-center justify-between px-2 py-1 rounded bg-[var(--bg-2)] border border-[var(--line)] text-xs font-mono">
                <span className="font-bold text-[var(--text-1)]">{group.date}</span>
                <div
                  className={`font-bold ${
                    isGroupProfit
                      ? "text-[var(--candle)]"
                      : isGroupLoss
                      ? "text-[var(--bear)]"
                      : "text-[var(--text-0)]"
                  }`}
                >
                  {privacyBlur
                    ? "••••"
                    : viewMode === "r"
                    ? `${group.dayR > 0 ? "+" : ""}${Math.round(group.dayR * 100) / 100}R`
                    : formatMoney(group.dayPnl, currency, { signDisplay: "always", privacyBlur })}
                </div>
              </div>

              {/* Trades in day */}
              <div className="space-y-1">
                {group.trades.map((trade) => {
                  const isProfit = Number(trade.pnl) > 0;
                  const isLoss = Number(trade.pnl) < 0;

                  return (
                    <div
                      key={trade.id}
                      className="p-3 rounded-lg border border-[var(--line)] bg-[var(--bg-1)] hover:bg-[var(--bg-2)]/60 transition-colors flex items-center justify-between gap-3 text-xs group"
                    >
                      {/* Left: symbol, pills, note */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 font-mono">
                          <span className="font-bold text-sm text-[var(--text-0)]">
                            {trade.symbol}
                          </span>

                          {trade.direction && (
                            <span
                              className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${
                                trade.direction === "long"
                                  ? "bg-[var(--candle)]/20 text-[var(--candle)]"
                                  : "bg-[var(--bear)]/20 text-[var(--bear)]"
                              }`}
                            >
                              {trade.direction}
                            </span>
                          )}

                          {trade.analysis_id && (
                            <Link
                              href={`/app/analysis/${trade.analysis_id}`}
                              className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[var(--candle)]/10 text-[var(--candle)] border border-[var(--candle)]/30 hover:underline"
                              title="Linked to AI chart analysis"
                            >
                              AI Plan ↗
                            </Link>
                          )}

                          {trade.followed_plan && (
                            <span
                              className={`text-[9px] font-mono px-1 rounded ${
                                trade.followed_plan === "yes"
                                  ? "text-[var(--candle)]"
                                  : trade.followed_plan === "partly"
                                  ? "text-[var(--amber)]"
                                  : "text-[var(--bear)]"
                              }`}
                            >
                              Plan: {trade.followed_plan}
                            </span>
                          )}
                        </div>

                        {/* Note & tags */}
                        {trade.note && (
                          <p className="text-[11px] text-[var(--text-2)] truncate">
                            {trade.note}
                          </p>
                        )}

                        {((trade.setup_tags && trade.setup_tags.length > 0) ||
                          (trade.mistake_tags && trade.mistake_tags.length > 0)) && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {trade.setup_tags?.map((t) => (
                              <span
                                key={t}
                                className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[var(--bg-2)] text-[var(--text-2)] border border-[var(--line)]"
                              >
                                {t}
                              </span>
                            ))}
                            {trade.mistake_tags?.map((t) => (
                              <span
                                key={t}
                                className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[var(--bear)]/10 text-[var(--bear)] border border-[var(--bear)]/30"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: P&L, R, Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div
                            className={`font-mono text-sm font-bold ${
                              isProfit
                                ? "text-[var(--candle)]"
                                : isLoss
                                ? "text-[var(--bear)]"
                                : "text-[var(--text-0)]"
                            }`}
                          >
                            <span>{isProfit ? "▲ " : isLoss ? "▼ " : ""}</span>
                            <span>
                              {privacyBlur
                                ? "••••"
                                : formatMoney(trade.pnl, currency, {
                                    signDisplay: "always",
                                    privacyBlur,
                                  })}
                            </span>
                          </div>

                          {trade.r_multiple !== null && trade.r_multiple !== undefined && (
                            <div className="text-[10px] font-mono text-[var(--text-2)]">
                              {trade.r_multiple > 0 ? `+${trade.r_multiple}R` : `${trade.r_multiple}R`}
                            </div>
                          )}
                        </div>

                        {/* Action buttons (Edit, Duplicate, Delete) */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditTrade(trade)}
                            className="p-1 rounded text-[var(--text-2)] hover:text-[var(--text-0)] hover:bg-[var(--bg-3)] cursor-pointer"
                            title="Edit trade"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDuplicateTrade(trade)}
                            className="p-1 rounded text-[var(--text-2)] hover:text-[var(--text-0)] hover:bg-[var(--bg-3)] cursor-pointer"
                            title="Duplicate trade"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => trade.id && onDeleteTrade(trade.id)}
                            className="p-1 rounded text-[var(--text-2)] hover:text-red-400 hover:bg-[var(--bg-3)] cursor-pointer"
                            title="Delete trade"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
