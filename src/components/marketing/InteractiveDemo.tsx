"use client";

import * as React from "react";
import { SAMPLE_PLANS, SamplePlan } from "./sampleData";
import { Badge } from "@/components/ui/Badge";
import { BiasPill } from "@/components/analysis/primitives/BiasPill";
import { LevelChip } from "@/components/analysis/primitives/LevelChip";
import { PriceTag } from "@/components/analysis/primitives/PriceTag";
import { RiskRewardBar } from "@/components/analysis/primitives/RiskRewardBar";
import { ConfidenceMeter } from "@/components/analysis/primitives/ConfidenceMeter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { track } from "@/lib/analytics/track";

export function InteractiveDemo() {
  const [selectedId, setSelectedId] = React.useState<string>("nifty");
  const plan: SamplePlan = SAMPLE_PLANS[selectedId] || SAMPLE_PLANS.nifty;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    track("demo_instrument_switched", { instrument: id });
  };

  return (
    <section id="demo" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="neutral" size="sm" className="mb-3">
            Interactive Product Tour
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-0)]">
            Before &amp; After: From Raw Screenshot to Actionable Plan
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-1)]">
            Explore 3 real chart examples. Toggle between instruments to see how the analysis engine breaks down market structure, key levels, scenarios, and invalidations.
          </p>

          {/* Instrument Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              type="button"
              onClick={() => handleSelect("nifty")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedId === "nifty"
                  ? "bg-[var(--candle)] text-[#04120A] shadow-md shadow-[var(--candle-glow)]"
                  : "bg-[var(--bg-2)] text-[var(--text-1)] border border-[var(--line)] hover:border-[var(--line-strong)]"
              }`}
            >
              🇮🇳 NIFTY 50 (India Index)
            </button>
            <button
              type="button"
              onClick={() => handleSelect("aapl")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedId === "aapl"
                  ? "bg-[var(--candle)] text-[#04120A] shadow-md shadow-[var(--candle-glow)]"
                  : "bg-[var(--bg-2)] text-[var(--text-1)] border border-[var(--line)] hover:border-[var(--line-strong)]"
              }`}
            >
              🇺🇸 AAPL (US Equities)
            </button>
            <button
              type="button"
              onClick={() => handleSelect("xauusd")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedId === "xauusd"
                  ? "bg-[var(--candle)] text-[#04120A] shadow-md shadow-[var(--candle-glow)]"
                  : "bg-[var(--bg-2)] text-[var(--text-1)] border border-[var(--line)] hover:border-[var(--line-strong)]"
              }`}
            >
              🥇 XAUUSD (Gold Spot)
            </button>
          </div>
        </div>

        {/* Demo Grid: Left (Uploaded Chart) / Right (AI Analysis Output) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Simulated Uploaded Chart (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="overflow-hidden border-[var(--line-strong)]">
              <CardHeader className="bg-[var(--bg-1)] border-b border-[var(--line)] py-3 px-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xs font-mono">{plan.ticker} • {plan.timeframe}</CardTitle>
                  <CardDescription className="text-[11px]">{plan.name}</CardDescription>
                </div>
                <Badge variant="neutral" size="sm">
                  Uploaded Input
                </Badge>
              </CardHeader>
              <CardContent className="p-4 bg-[var(--bg-0)]">
                {/* SVG Simulated Chart Representation */}
                <div className="relative aspect-[4/3] w-full rounded-xl bg-[#080f0a] border border-[var(--line)] p-4 flex flex-col justify-between overflow-hidden">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[var(--text-2)] border-b border-[var(--line)]/50 pb-2">
                    <span>O: {plan.currentPrice - 40} H: {plan.currentPrice + 60} L: {plan.currentPrice - 75} C: {plan.currentPrice}</span>
                    <span className="text-[var(--candle)] font-bold">LIVE READ</span>
                  </div>

                  {/* Visual Candlesticks */}
                  <svg className="w-full h-44 my-auto" viewBox="0 0 360 140" fill="none">
                    {/* Grid lines */}
                    <line x1="0" y1="35" x2="360" y2="35" stroke="#1F2E24" strokeDasharray="3 3" />
                    <line x1="0" y1="70" x2="360" y2="70" stroke="#1F2E24" strokeDasharray="3 3" />
                    <line x1="0" y1="105" x2="360" y2="105" stroke="#1F2E24" strokeDasharray="3 3" />

                    {/* Resistance level overlay */}
                    <line x1="0" y1="28" x2="360" y2="28" stroke="#FF6B6B" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="240" y="24" fill="#FF6B6B" fontSize="9" fontFamily="monospace">
                      RES: {plan.levels[0]?.price}
                    </text>

                    {/* Support level overlay */}
                    <line x1="0" y1="112" x2="360" y2="112" stroke="#5BE38C" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="240" y="124" fill="#5BE38C" fontSize="9" fontFamily="monospace">
                      SUP: {plan.levels[1]?.price}
                    </text>

                    {/* Candlestick sequence */}
                    <g>
                      <line x1="40" y1="50" x2="40" y2="100" stroke="#5BE38C" strokeWidth="1.5" />
                      <rect x="35" y="60" width="10" height="30" fill="#5BE38C" rx="1" />

                      <line x1="80" y1="40" x2="80" y2="90" stroke="#FF6B6B" strokeWidth="1.5" />
                      <rect x="75" y="55" width="10" height="25" fill="#FF6B6B" rx="1" />

                      <line x1="120" y1="65" x2="120" y2="120" stroke="#5BE38C" strokeWidth="1.5" />
                      <rect x="115" y="80" width="10" height="30" fill="#5BE38C" rx="1" />

                      <line x1="160" y1="60" x2="160" y2="110" stroke="#5BE38C" strokeWidth="1.5" />
                      <rect x="155" y="70" width="10" height="30" fill="#5BE38C" rx="1" />

                      <line x1="200" y1="45" x2="200" y2="95" stroke="#FF6B6B" strokeWidth="1.5" />
                      <rect x="195" y="55" width="10" height="20" fill="#FF6B6B" rx="1" />

                      <line x1="240" y1="35" x2="240" y2="85" stroke="#5BE38C" strokeWidth="1.5" />
                      <rect x="235" y="45" width="10" height="30" fill="#5BE38C" rx="1" />

                      <line x1="280" y1="30" x2="280" y2="75" stroke="#5BE38C" strokeWidth="1.5" />
                      <rect x="275" y="38" width="10" height="25" fill="#5BE38C" rx="1" />

                      <line x1="320" y1="20" x2="320" y2="60" stroke="#5BE38C" strokeWidth="1.5" />
                      <rect x="315" y="28" width="10" height="22" fill="#5BE38C" rx="1" />
                    </g>
                  </svg>

                  <div className="flex justify-between items-center text-[10px] text-[var(--text-2)] border-t border-[var(--line)]/50 pt-2">
                    <span>Timeframe: {plan.timeframe}</span>
                    <span className="text-[var(--text-1)] font-mono">{plan.currency}{plan.currentPrice}</span>
                  </div>
                </div>

                {/* Quality gate audit */}
                <div className="mt-3 p-3 rounded-xl bg-[var(--bg-2)] border border-[var(--line)] text-xs space-y-1.5">
                  <div className="font-semibold text-[var(--text-0)] text-[11px] flex items-center justify-between">
                    <span>1. Data-Quality Gate</span>
                    <span className="text-[var(--candle)] font-mono text-[10px]">VERIFIED</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-2)] leading-relaxed">
                    {plan.dataQuality.note}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {plan.dataQuality.indicators.map((ind) => (
                      <span key={ind} className="px-2 py-0.5 rounded bg-[var(--bg-3)] text-[10px] text-[var(--text-1)]">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: AI Structured Analysis Output (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border-[var(--line-strong)] bg-[var(--bg-1)]">
              <CardHeader className="py-3 px-6 flex flex-row items-center justify-between border-b border-[var(--line)]">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-bold text-[var(--text-0)]">
                      Structured Trade Plan
                    </CardTitle>
                    <Badge variant="bull" size="sm">
                      Illustrative Sample
                    </Badge>
                  </div>
                  <CardDescription className="text-xs mt-0.5">
                    Every level has a reason • Every scenario has an invalidation
                  </CardDescription>
                </div>
                <BiasPill bias={plan.plan.bias} size="md" />
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* 1. Market Structure */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider">
                    Market Structure &amp; Phase
                  </span>
                  <div className="p-3 rounded-xl bg-[var(--bg-2)] border border-[var(--line)] text-xs leading-relaxed">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-[var(--text-0)]">{plan.structure.trend} Trend</span>
                      <span className="text-[var(--candle)] font-mono text-[11px]">{plan.structure.phase}</span>
                    </div>
                    <p className="text-[var(--text-1)]">{plan.structure.summary}</p>
                  </div>
                </div>

                {/* 2. Key Levels with Reasons */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider">
                    Key Levels with Reasoning (Why It Matters)
                  </span>
                  <div className="space-y-2">
                    {plan.levels.map((lvl) => (
                      <div
                        key={lvl.price}
                        className="p-3 rounded-xl bg-[var(--bg-2)] border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <LevelChip type={lvl.type} strength={lvl.strength} />
                          <PriceTag price={lvl.price} prefix={plan.currency} />
                        </div>
                        <p className="text-[var(--text-1)] text-xs sm:text-right flex-1 sm:pl-4">
                          {lvl.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Scenarios (Bull & Bear) */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider">
                    Scenarios with Model Confidence
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-[var(--bg-2)] border border-[var(--candle)]/30 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <BiasPill bias="bullish" size="sm" />
                        <span className="font-mono text-[11px] text-[var(--candle)] font-semibold">
                          Confidence: {plan.scenarios.bull.modelConfidence}%
                        </span>
                      </div>
                      <p className="text-[var(--text-1)] text-[11px]">
                        <span className="font-semibold text-[var(--text-0)]">Trigger:</span> {plan.scenarios.bull.trigger}
                      </p>
                      <ConfidenceMeter confidence={plan.scenarios.bull.modelConfidence} showPercentage={false} />
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-2)] border border-[var(--bear)]/30 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <BiasPill bias="bearish" size="sm" />
                        <span className="font-mono text-[11px] text-[var(--bear)] font-semibold">
                          Confidence: {plan.scenarios.bear.modelConfidence}%
                        </span>
                      </div>
                      <p className="text-[var(--text-1)] text-[11px]">
                        <span className="font-semibold text-[var(--text-0)]">Trigger:</span> {plan.scenarios.bear.trigger}
                      </p>
                      <ConfidenceMeter confidence={plan.scenarios.bear.modelConfidence} showPercentage={false} />
                    </div>
                  </div>
                </div>

                {/* 4. Actionable Plan + Options (if available) */}
                <div className="p-4 rounded-xl bg-[var(--bg-3)] border border-[var(--line-strong)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[var(--text-0)]">Execution Plan:</span>
                      <span className="text-xs font-bold text-[var(--candle)]">{plan.plan.direction}</span>
                    </div>
                    <span className="font-mono text-xs text-[var(--candle)] font-bold">
                      R:R 1:{plan.plan.rr.toFixed(1)}
                    </span>
                  </div>

                  <RiskRewardBar riskReward={plan.plan.rr} />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                    <div className="p-2 rounded-lg bg-[var(--bg-2)] border border-[var(--line)]">
                      <span className="text-[10px] text-[var(--text-2)] block">Entry Zone</span>
                      <span className="font-mono text-xs font-semibold text-[var(--text-0)]">{plan.plan.entry}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[var(--bg-2)] border border-[var(--line)]">
                      <span className="text-[10px] text-[var(--bear)] block">Stop Loss</span>
                      <span className="font-mono text-xs font-semibold text-[var(--bear)]">{plan.currency}{plan.plan.stop}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[var(--bg-2)] border border-[var(--line)]">
                      <span className="text-[10px] text-[var(--candle)] block">Target 1 &amp; 2</span>
                      <span className="font-mono text-xs font-semibold text-[var(--candle)]">
                        {plan.plan.targets.map((t) => `${plan.currency}${t}`).join(" → ")}
                      </span>
                    </div>
                  </div>

                  {plan.plan.optionsView && (
                    <div className="pt-2 border-t border-[var(--line)] text-xs space-y-1">
                      <div className="text-[11px] font-semibold text-[var(--info)] flex items-center gap-1.5">
                        <span>⛓️ Options OI View:</span>
                        <span className="font-mono text-[var(--text-0)]">Max Pain: {plan.plan.optionsView.maxPain} | PCR: {plan.plan.optionsView.pcr}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-2)] leading-relaxed">
                        {plan.plan.optionsView.expiryInsight}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[var(--line)] text-xs text-[var(--amber)] flex items-start gap-1.5 leading-snug">
                    <span className="font-bold shrink-0">⚠️ Invalidation:</span>
                    <span>{plan.plan.invalidation}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
