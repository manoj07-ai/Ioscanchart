"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { BiasPill } from "@/components/analysis/primitives/BiasPill";
import { LevelChip } from "@/components/analysis/primitives/LevelChip";
import { PriceTag } from "@/components/analysis/primitives/PriceTag";
import { ConfidenceMeter } from "@/components/analysis/primitives/ConfidenceMeter";
import { RiskRewardBar } from "@/components/analysis/primitives/RiskRewardBar";
import { Check, AlertTriangle } from "lucide-react";

/**
 * Animated sample analysis card for the hero section.
 * Clearly marked as an "Illustrative example".
 * Simulates the live output generated in ~30s.
 */
export function HeroSampleCard() {
  const [activeTab, setActiveTab] = React.useState<"bull" | "bear">("bull");

  return (
    <div className="relative w-full rounded-2xl border border-[var(--line-strong)] bg-[var(--bg-1)] p-4 sm:p-6 shadow-2xl shadow-black/60 card-highlight">
      {/* Example Banner Header */}
      <div className="flex items-center justify-between border-b border-[var(--line)]/60 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--candle)] animate-pulse" />
          <span className="text-xs font-semibold text-[var(--text-0)] tracking-tight">
            NIFTY 50 • 1D/1H
          </span>
          <Badge variant="amber" size="sm">
            Example Analysis
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <PriceTag price={24395.5} prefix="₹" />
          <BiasPill bias="bullish" size="sm" />
        </div>
      </div>

      {/* Data Quality Report Bar */}
      <div className="mb-4 rounded-xl bg-[var(--bg-2)] border border-[var(--line)] p-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[var(--text-2)]">
          <Check className="w-3.5 h-3.5 text-[var(--candle)] shrink-0" />
          <span>Data quality: Ticker, 120 candles, right axis verified</span>
        </div>
        <span className="font-mono text-[10px] text-[var(--text-2)]">India Pack</span>
      </div>

      {/* Market Structure Summary */}
      <div className="mb-4 text-xs text-[var(--text-1)] leading-relaxed">
        <span className="text-[var(--text-0)] font-semibold">Structure:</span> Ascending
        continuation shelf. Higher lows formed above 20 EMA with bullish volatility compression.
      </div>

      {/* Key Levels with Reasons */}
      <div className="space-y-2 mb-4">
        <div className="text-[11px] font-semibold text-[var(--text-2)] uppercase tracking-wider">
          Key Levels &amp; Reasoning:
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-start justify-between gap-3 p-2 rounded-lg bg-[var(--bg-2)]/60 border border-[var(--line)]/50">
            <div className="flex items-center gap-2">
              <LevelChip type="resistance" strength={3} label="24,520" />
              <span className="text-[var(--text-1)] text-[11px]">Prior swing rejection &amp; Call OI ceiling</span>
            </div>
          </div>
          <div className="flex items-start justify-between gap-3 p-2 rounded-lg bg-[var(--bg-2)]/60 border border-[var(--line)]/50">
            <div className="flex items-center gap-2">
              <LevelChip type="support" strength={3} label="24,260" />
              <span className="text-[var(--text-1)] text-[11px]">Confluence of 20 EMA &amp; Point of Control</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Switcher */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={() => setActiveTab("bull")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === "bull"
                ? "bg-[var(--candle-dim)]/40 text-[var(--candle)] border border-[var(--candle)]/40"
                : "text-[var(--text-2)] hover:text-[var(--text-0)] bg-[var(--bg-2)]"
            }`}
          >
            ▲ Bullish Scenario (78%)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bear")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === "bear"
                ? "bg-[var(--bear-dim)]/40 text-[var(--bear)] border border-[var(--bear)]/40"
                : "text-[var(--text-2)] hover:text-[var(--text-0)] bg-[var(--bg-2)]"
            }`}
          >
            ▼ Bearish Scenario (48%)
          </button>
        </div>

        {activeTab === "bull" ? (
          <div className="p-3 rounded-xl bg-[var(--bg-2)] border border-[var(--line)] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-2)]">Trigger:</span>
              <span className="text-[var(--text-0)] font-medium text-right">
                15m candle close above 24,420
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-2)]">Targets:</span>
              <span className="font-mono text-[var(--candle)]">24,520 → 24,680</span>
            </div>
            <ConfidenceMeter confidence={78} />
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-[var(--bg-2)] border border-[var(--line)] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-2)]">Trigger:</span>
              <span className="text-[var(--text-0)] font-medium text-right">
                Break below 24,250 during session
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-2)]">Targets:</span>
              <span className="font-mono text-[var(--bear)]">24,250 → 24,150</span>
            </div>
            <ConfidenceMeter confidence={48} />
          </div>
        )}
      </div>

      {/* Trade Plan & Invalidation */}
      <div className="p-3.5 rounded-xl bg-[var(--bg-3)] border border-[var(--line-strong)] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--text-0)] flex items-center gap-1.5">
            <span>Primary Plan:</span>
            <span className="text-[var(--candle)] font-bold">Long on Pullback</span>
          </span>
          <span className="font-mono text-xs text-[var(--candle)] font-bold">R:R 1:2.8</span>
        </div>

        <RiskRewardBar riskReward={2.8} />

        <div className="pt-1 border-t border-[var(--line)]/50 text-[11px] text-[var(--amber)] flex items-start gap-1.5 leading-snug">
          <AlertTriangle className="w-3.5 h-3.5 text-[var(--amber)] shrink-0 mt-0.5" />
          <span className="font-bold shrink-0">Invalidation:</span>
          <span>Hourly close below 24,230 cancels this idea immediately.</span>
        </div>
      </div>
    </div>
  );
}
