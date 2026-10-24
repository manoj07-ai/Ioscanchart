"use client";

import React from "react";

export interface OptionLeg {
  action: "buy" | "sell";
  type: "call" | "put";
  strike: number;
  premium: number;
}

export interface OptionsViewData {
  maxPain?: number;
  pcr?: number;
  callOiWall?: number;
  putOiWall?: number;
  expiryDate?: string;
  impliedVolatility?: number;
  strikes?: Array<{
    strike: number;
    callOi: number;
    putOi: number;
  }>;
  strategyIdea?: {
    name: string;
    type: string;
    maxProfit: number;
    maxLoss: number;
    breakevens: number[];
    legs: OptionLeg[];
    caveats: string[];
  };
}

/**
 * Helper function to compute payoff curve across price points.
 * Exported for Vitest component testing!
 */
export function calculatePayoff(legs: OptionLeg[], prices: number[]): number[] {
  return prices.map((price) => {
    let total = 0;
    for (const leg of legs) {
      let intrinsic = 0;
      if (leg.type === "call") {
        intrinsic = Math.max(0, price - leg.strike);
      } else {
        intrinsic = Math.max(0, leg.strike - price);
      }

      if (leg.action === "buy") {
        total += intrinsic - leg.premium;
      } else {
        total += leg.premium - intrinsic;
      }
    }
    return Math.round(total * 100) / 100;
  });
}

export function OptionsView({ data }: { data?: OptionsViewData }) {
  if (!data) return null;

  // Render horizontal OI bars if strikes present
  const maxOi = Math.max(
    ...(data.strikes?.map((s) => Math.max(s.callOi, s.putOi)) ?? [100])
  );

  // Generate synthetic payoff points for visualization
  const legs = data.strategyIdea?.legs ?? [];
  const minStrike = legs.length > 0 ? Math.min(...legs.map((l) => l.strike)) : 100;
  const maxStrike = legs.length > 0 ? Math.max(...legs.map((l) => l.strike)) : 200;
  const step = Math.max(1, (maxStrike - minStrike) / 10);
  const priceRange: number[] = [];
  for (let p = minStrike - step * 3; p <= maxStrike + step * 3; p += step) {
    priceRange.push(p);
  }
  const payoffs = calculatePayoff(legs, priceRange);

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[var(--text-0)] tracking-tight">
            Indian Derivatives & Option Chain View
          </h2>
          <p className="text-xs text-[var(--text-2)]">
            Open Interest concentration, Max Pain, and defined-risk payoff profile
          </p>
        </div>
        {data.expiryDate && (
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg-2)] border border-[var(--line)] text-[var(--amber)]">
            Expiry: {data.expiryDate}
          </span>
        )}
      </div>

      {/* Metric badges: Max pain, PCR, OI Walls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--line)]">
          <span className="text-[10px] text-[var(--text-2)] block">Max Pain</span>
          <span className="text-sm font-bold text-[var(--candle)]">
            {data.maxPain ?? "N/A"}
          </span>
        </div>
        <div className="p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--line)]">
          <span className="text-[10px] text-[var(--text-2)] block">PCR (Put-Call)</span>
          <span className="text-sm font-bold text-[var(--text-0)]">
            {data.pcr ?? "N/A"}
          </span>
        </div>
        <div className="p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--line)]">
          <span className="text-[10px] text-[var(--text-2)] block">Call OI Wall (Resistance)</span>
          <span className="text-sm font-bold text-[var(--bear)]">
            {data.callOiWall ?? "N/A"}
          </span>
        </div>
        <div className="p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--line)]">
          <span className="text-[10px] text-[var(--text-2)] block">Put OI Wall (Support)</span>
          <span className="text-sm font-bold text-[var(--candle)]">
            {data.putOiWall ?? "N/A"}
          </span>
        </div>
      </div>

      {/* Horizontal strike OI bars */}
      {data.strikes && data.strikes.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-2)]">
            Strike Open Interest Heatmap
          </span>
          <div className="space-y-1.5 text-xs font-mono">
            {data.strikes.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-16 text-right font-bold text-[var(--text-0)] text-xs">
                  {s.strike}
                </span>
                <div className="flex-1 flex items-center h-4 bg-[var(--bg-2)] rounded overflow-hidden">
                  <div
                    className="h-full bg-[var(--bear)]/70 transition-all"
                    style={{ width: `${(s.callOi / maxOi) * 50}%` }}
                    title={`Call OI: ${s.callOi}`}
                  />
                  <div
                    className="h-full bg-[var(--candle)]/70 transition-all"
                    style={{ width: `${(s.putOi / maxOi) * 50}%` }}
                    title={`Put OI: ${s.putOi}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategy idea & Payoff diagram */}
      {data.strategyIdea && (
        <div className="p-4 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-[var(--text-0)]">
              {data.strategyIdea.name}
            </span>
            <span className="font-mono text-xs text-[var(--text-2)] uppercase">
              {data.strategyIdea.type.replace("_", " ")}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
            <div>
              <span className="text-[var(--text-2)] block">Max Profit:</span>
              <span className="text-[var(--candle)] font-bold">
                +{data.strategyIdea.maxProfit}
              </span>
            </div>
            <div>
              <span className="text-[var(--text-2)] block">Max Loss:</span>
              <span className="text-[var(--bear)] font-bold">
                -{data.strategyIdea.maxLoss}
              </span>
            </div>
            <div>
              <span className="text-[var(--text-2)] block">Breakeven(s):</span>
              <span className="text-[var(--text-0)] font-bold">
                {data.strategyIdea.breakevens.join(", ")}
              </span>
            </div>
          </div>

          {/* Payoff mini-chart sparkline */}
          {payoffs.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] font-mono text-[var(--text-2)] uppercase block mb-1">
                Payoff at Expiry
              </span>
              <div className="h-16 flex items-end gap-1 bg-[var(--bg-0)] p-2 rounded border border-[var(--line)]">
                {payoffs.map((val, pIdx) => {
                  const isGain = val >= 0;
                  const heightPercent = Math.min(100, Math.max(15, Math.abs(val) * 2));
                  return (
                    <div
                      key={pIdx}
                      className={`flex-1 rounded-xs transition-all ${
                        isGain ? "bg-[var(--candle)]/80" : "bg-[var(--bear)]/80"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                      title={`Price: ${priceRange[pIdx]} | P&L: ${val}`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {data.strategyIdea.caveats?.length > 0 && (
            <div className="pt-2 text-[11px] text-[var(--text-2)] space-y-0.5">
              <div className="font-semibold text-[var(--amber)]">Caveats:</div>
              <ul className="list-disc pl-4 space-y-0.5">
                {data.strategyIdea.caveats.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
