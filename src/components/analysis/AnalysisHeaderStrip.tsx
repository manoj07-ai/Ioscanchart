"use client";

import React, { useState } from "react";
import { BiasPill } from "@/components/analysis/primitives/BiasPill";
import { Badge } from "@/components/ui/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Lightbulb, Check, X } from "lucide-react";
import { MARKET_PACKS, type MarketPackId } from "@/config/markets";

interface AnalysisHeaderStripProps {
  instrument: {
    symbol: string;
    market: MarketPackId;
    timeframe: string;
    lastPrice?: number;
    currency?: string;
  };
  overallBias?: "bull" | "bear" | "neutral";
  dataQuality: {
    readable: boolean;
    score: number;
    detected: {
      symbol?: string;
      market?: MarketPackId;
      timeframe?: string;
      priceScaleVisible: boolean;
      indicatorsSeen: string[];
    };
    issues: string[];
    userActionNeeded?: string;
  };
}

export function AnalysisHeaderStrip({
  instrument,
  overallBias = "neutral",
  dataQuality,
}: AnalysisHeaderStripProps) {
  const [qualityModalOpen, setQualityModalOpen] = useState(false);
  const pack = MARKET_PACKS[instrument.market] || {
    displayName: instrument.market,
    coverage: "full",
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-1)]">
        {/* Left: Ticker, market, TF */}
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-[var(--text-0)]">
                {instrument.symbol}
              </h1>
              <Badge variant="neutral" size="sm" className="font-mono text-xs">
                {instrument.timeframe}
              </Badge>
              <span className="text-xs text-[var(--text-2)] font-medium">
                {pack.displayName}
              </span>
            </div>
            {instrument.lastPrice !== undefined && (
              <div className="text-xs font-mono text-[var(--text-1)] mt-0.5">
                Last Price:{" "}
                <span className="font-bold text-[var(--text-0)]">
                  {instrument.currency ?? ""}{instrument.lastPrice}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: BiasPill & Data Quality Chip */}
        <div className="flex items-center gap-2">
          <BiasPill bias={overallBias} size="md" />

          {/* Clickable Data Quality Score Chip */}
          <button
            onClick={() => setQualityModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border transition-all cursor-pointer ${
              dataQuality.score >= 70
                ? "bg-[var(--candle)]/10 text-[var(--candle)] border-[var(--candle)]/30 hover:bg-[var(--candle)]/20"
                : dataQuality.score >= 40
                ? "bg-[var(--amber)]/10 text-[var(--amber)] border-[var(--amber)]/30 hover:bg-[var(--amber)]/20"
                : "bg-[var(--bear)]/10 text-[var(--bear)] border-[var(--bear)]/30 hover:bg-[var(--bear)]/20"
            }`}
            title="Click to view screenshot quality breakdown"
          >
            <span>Quality</span>
            <span className="font-bold">{dataQuality.score}/100</span>
          </button>
        </div>
      </div>

      {/* Quality Details Modal */}
      <Dialog open={qualityModalOpen} onOpenChange={setQualityModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Screenshot Data Quality Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--line)]">
              <div>
                <div className="font-semibold text-[var(--text-0)]">Readability Score</div>
                <div className="text-[11px] text-[var(--text-2)]">
                  {dataQuality.readable
                    ? "Chart is clear and legible for high-confidence technical mapping."
                    : "Chart has legibility issues; no credits deducted."}
                </div>
              </div>
              <span className="font-mono text-lg font-bold text-[var(--candle)]">
                {dataQuality.score}%
              </span>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-[var(--text-0)]">Detected Metadata</div>
              <ul className="grid grid-cols-2 gap-2 text-[11px]">
                <li className="p-2 rounded bg-[var(--bg-2)] border border-[var(--line)]">
                  <span className="text-[var(--text-2)] block">Symbol</span>
                  <span className="font-mono font-bold text-[var(--text-0)]">
                    {dataQuality.detected.symbol || "Auto-inferred"}
                  </span>
                </li>
                <li className="p-2 rounded bg-[var(--bg-2)] border border-[var(--line)]">
                  <span className="text-[var(--text-2)] block">Timeframe</span>
                  <span className="font-mono font-bold text-[var(--text-0)]">
                    {dataQuality.detected.timeframe || "Auto-inferred"}
                  </span>
                </li>
                <li className="p-2 rounded bg-[var(--bg-2)] border border-[var(--line)]">
                  <span className="text-[var(--text-2)] block">Price Scale</span>
                  <span className="font-mono font-bold text-[var(--text-0)] flex items-center gap-1">
                    {dataQuality.detected.priceScaleVisible ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[var(--candle)]" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5 text-[var(--bear)]" />
                        <span>Hidden</span>
                      </>
                    )}
                  </span>
                </li>
                <li className="p-2 rounded bg-[var(--bg-2)] border border-[var(--line)]">
                  <span className="text-[var(--text-2)] block">Indicators Seen</span>
                  <span className="font-mono font-bold text-[var(--text-0)] truncate block">
                    {dataQuality.detected.indicatorsSeen?.length
                      ? dataQuality.detected.indicatorsSeen.join(", ")
                      : "None"}
                  </span>
                </li>
              </ul>
            </div>

            {dataQuality.issues?.length > 0 && (
              <div className="p-3 rounded-lg bg-[var(--bear)]/10 border border-[var(--bear)]/20 text-[var(--bear)]">
                <div className="font-semibold mb-1">Detected Issues:</div>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  {dataQuality.issues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {dataQuality.userActionNeeded && (
              <div className="p-2.5 rounded bg-[var(--amber)]/10 border border-[var(--amber)]/20 text-[var(--amber)] text-[11px] flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                <span>{dataQuality.userActionNeeded}</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
