"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RiskRewardBar } from "@/components/analysis/primitives/RiskRewardBar";
import { SHORT_DISCLAIMER } from "@/config/legal";
import { brand } from "@/config/brand";
import { toPng } from "html-to-image";

interface PlanCardHeroProps {
  plan: {
    stance: "long" | "short" | "wait";
    entry?: {
      type: string;
      priceOrZone: number | [number, number];
      reasoning: string;
    };
    stop?: {
      price: number;
      reasoning: string;
    };
    targets?: Array<{
      price: number;
      rr: number;
    }>;
    riskPercent?: number;
    invalidation: string;
    summary: string;
  };
  symbol: string;
  timeframe: string;
  onAddToJournal?: () => void;
}

export function PlanCardHero({
  plan,
  symbol,
  timeframe,
  onAddToJournal,
}: PlanCardHeroProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Compute primary target & RR
  const primaryTarget = plan.targets?.[0];
  const avgRR = primaryTarget?.rr ?? 2.0;

  // Format entry representation
  const formatEntry = () => {
    if (!plan.entry) return "Wait for setup confirmation";
    if (Array.isArray(plan.entry.priceOrZone)) {
      return `${plan.entry.priceOrZone[0]} – ${plan.entry.priceOrZone[1]}`;
    }
    return plan.entry.priceOrZone.toString();
  };

  // Copy plain text plan to clipboard
  const handleCopyPlan = async () => {
    const textPlan = `
${brand.name.toUpperCase()} TRADE PLAN
----------------------------------------
Instrument: ${symbol} (${timeframe})
Stance: ${plan.stance.toUpperCase()}
Entry: ${formatEntry()} (${plan.entry?.reasoning || "N/A"})
Stop Loss: ${plan.stop?.price ?? "N/A"} (${plan.stop?.reasoning || "N/A"})
Targets: ${plan.targets?.map((t, idx) => `T${idx + 1}: ${t.price} (R:R ${t.rr}R)`).join(" | ") || "N/A"}
Invalidation: ${plan.invalidation}
Summary: ${plan.summary}
----------------------------------------
${SHORT_DISCLAIMER}
    `.trim();

    try {
      await navigator.clipboard.writeText(textPlan);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (err) {
      console.error("Failed to copy plan:", err);
    }
  };

  // Export card as image
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: "#080c0a",
      });
      const link = document.createElement("a");
      link.download = `${symbol}-${timeframe}-plan.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export image error:", err);
    } finally {
      setDownloading(false);
    }
  };

  // If stance is 'wait', render clear intentional wait state
  if (plan.stance === "wait") {
    return (
      <div
        ref={cardRef}
        className="rounded-xl border border-[var(--line-strong)] bg-[var(--bg-1)] p-6 space-y-4 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⏸️</span>
            <div>
              <h2 className="text-base font-bold text-[var(--text-0)]">
                Stance: WAIT (No Clean Edge Yet)
              </h2>
              <p className="text-xs text-[var(--text-2)]">
                The chart currently lacks clear risk/reward confluence.
              </p>
            </div>
          </div>
          <Badge variant="neutral" size="md">
            PATIENCE
          </Badge>
        </div>

        <div className="p-4 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] space-y-2">
          <div className="text-xs font-semibold text-[var(--text-0)]">
            Conditions Required Before Taking a Position:
          </div>
          <p className="text-xs text-[var(--text-1)] leading-relaxed">
            {plan.summary || "Wait for a confirmed break above local supply or a clean retest of key demand."}
          </p>
        </div>

        <div className="p-3.5 rounded-lg border border-[var(--amber)]/30 bg-[var(--amber)]/10 text-xs text-[var(--amber)]">
          <strong>Invalidation rule: </strong>
          {plan.invalidation}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[var(--line)] text-xs text-[var(--text-2)]">
          <span>{SHORT_DISCLAIMER}</span>
          <Button variant="secondary" size="sm" onClick={handleCopyPlan}>
            {copySuccess ? "Copied! ✓" : "Copy condition"}
          </Button>
        </div>
      </div>
    );
  }

  const isLong = plan.stance === "long";

  return (
    <div
      ref={cardRef}
      className="rounded-xl border border-[var(--line-strong)] bg-[var(--bg-1)] p-6 space-y-6 shadow-2xl relative overflow-hidden"
    >
      {/* Decorative top border line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isLong ? "bg-[var(--candle)]" : "bg-[var(--bear)]"
        }`}
      />

      {/* Header with Stance badge and quick actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-md font-mono text-sm font-black uppercase tracking-wider ${
              isLong
                ? "bg-[var(--candle)]/20 text-[var(--candle)] border border-[var(--candle)]/40"
                : "bg-[var(--bear)]/20 text-[var(--bear)] border border-[var(--bear)]/40"
            }`}
          >
            {isLong ? "▲ Long Setup" : "▼ Short Setup"}
          </span>
          <span className="text-xs text-[var(--text-2)] font-mono">
            {symbol} · {timeframe}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopyPlan} className="text-xs h-8">
            {copySuccess ? "Copied! ✓" : "Copy plan"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadImage}
            disabled={downloading}
            className="text-xs h-8"
          >
            {downloading ? "Saving..." : "Save image"}
          </Button>
          {onAddToJournal && (
            <Button variant="secondary" size="sm" onClick={onAddToJournal} className="text-xs h-8">
              + Journal
            </Button>
          )}
        </div>
      </div>

      {/* Execution Levels: Entry, Stop, Targets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Entry */}
        <div className="p-3.5 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-2)]">
            Entry Trigger
          </span>
          <div className="font-mono text-base font-bold text-[var(--text-0)]">
            {formatEntry()}
          </div>
          <div className="text-[11px] text-[var(--text-2)] truncate">
            {plan.entry?.type.toUpperCase()} · {plan.entry?.reasoning || "At market structure"}
          </div>
        </div>

        {/* Stop Loss */}
        <div className="p-3.5 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--bear)]">
            Protective Stop
          </span>
          <div className="font-mono text-base font-bold text-[var(--bear)]">
            {plan.stop?.price ?? "N/A"}
          </div>
          <div className="text-[11px] text-[var(--text-2)] truncate">
            {plan.stop?.reasoning || "Technical invalidation boundary"}
          </div>
        </div>

        {/* Primary Target & RR */}
        <div className="p-3.5 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--candle)]">
            Targets (T1 / T2)
          </span>
          <div className="font-mono text-base font-bold text-[var(--candle)] flex items-center gap-2">
            <span>{primaryTarget?.price ?? "N/A"}</span>
            {plan.targets && plan.targets[1] && (
              <span className="text-xs text-[var(--text-2)]">/ {plan.targets[1].price}</span>
            )}
          </div>
          <div className="text-[11px] text-[var(--text-2)] truncate">
            {primaryTarget ? `R:R ~ ${primaryTarget.rr}R` : "Calculated targets"}
          </div>
        </div>
      </div>

      {/* Visual Risk:Reward Bar */}
      {plan.stop && primaryTarget && (
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs text-[var(--text-2)] font-mono">
            <span>Risk:Reward Profile</span>
            <span className="font-bold text-[var(--text-0)]">1 : {avgRR}R</span>
          </div>
          <RiskRewardBar riskReward={avgRR} />
        </div>
      )}

      {/* Invalidation Callout */}
      <div className="p-3.5 rounded-lg border border-[var(--amber)]/30 bg-[var(--amber)]/10 space-y-1 text-xs">
        <div className="font-bold text-[var(--amber)] flex items-center gap-1.5">
          <span>⚠️ Invalidation Condition</span>
        </div>
        <p className="text-[var(--text-1)] leading-relaxed text-xs">
          {plan.invalidation}
        </p>
      </div>

      {/* Summary */}
      <p className="text-xs text-[var(--text-1)] leading-relaxed italic border-l-2 border-[var(--candle)] pl-3">
        &quot;{plan.summary}&quot;
      </p>

      {/* Card footer disclaimer */}
      <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-[10px] text-[var(--text-2)]">
        <span>{SHORT_DISCLAIMER}</span>
        <span className="font-mono font-semibold">{brand.name}</span>
      </div>
    </div>
  );
}
