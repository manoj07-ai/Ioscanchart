"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatDateOnly } from "@/lib/journal/calendar";
import { MISTAKE_TAGS, COMMON_SETUP_TAGS } from "@/lib/journal/schema";
import type { AnalysisResult } from "@/server/ai/schema";

type Plan = AnalysisResult["plan"];

interface LogTradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysisId?: string | null;
  instrument?: string | null;
  market?: string | null;
  timeframe?: string | null;
  plan?: Plan | null;
  onSuccess?: () => void;
}

function getTodayString(): string {
  const now = new Date();
  return formatDateOnly(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function LogTradeDialog({
  open,
  onOpenChange,
  analysisId,
  instrument,
  market,
  timeframe,
  plan,
  onSuccess,
}: LogTradeDialogProps) {
  const [tradeDate, setTradeDate] = useState(() => getTodayString());
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [entryPrice, setEntryPrice] = useState<string>("");
  const [exitPrice, setExitPrice] = useState<string>("");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [pnl, setPnl] = useState<string>("");
  const [rMultiple, setRMultiple] = useState<string>("");
  const [followedPlan, setFollowedPlan] = useState<"yes" | "partly" | "no">("yes");
  const [selectedMistakes, setSelectedMistakes] = useState<string[]>([]);
  const [setupTag, setSetupTag] = useState<string>("From AI Plan");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Initialize/prefill when dialog opens with plan data
  useEffect(() => {
    if (open) {
      setSavedSuccess(false);
      setErrorMsg("");
      setTradeDate(getTodayString());

      if (plan) {
        if (plan.stance === "short") {
          setDirection("short");
        } else {
          setDirection("long");
        }

        if (plan.entry?.priceOrZone !== undefined) {
          const ep = Array.isArray(plan.entry.priceOrZone)
            ? plan.entry.priceOrZone[0]
            : plan.entry.priceOrZone;
          setEntryPrice(String(ep));
        }

        if (plan.stop?.price !== undefined) {
          setStopLoss(String(plan.stop.price));
        }

        if (plan.targets && plan.targets.length > 0 && plan.targets[0]?.price) {
          setTargetPrice(String(plan.targets[0].price));
        }

        setSetupTag(plan.entry?.type ? `AI ${plan.entry.type}` : "From AI Plan");
      }
    }
  }, [open, plan]);

  function toggleMistake(tag: string) {
    setSelectedMistakes((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const parsedPnl = parseFloat(pnl);
    if (isNaN(parsedPnl)) {
      setErrorMsg("Please enter a valid net P&L amount (e.g. 150 or -50).");
      setLoading(false);
      return;
    }

    const parsedR = rMultiple ? parseFloat(rMultiple) : null;
    const parsedEntry = entryPrice ? parseFloat(entryPrice) : null;
    const parsedExit = exitPrice ? parseFloat(exitPrice) : null;

    try {
      const res = await fetch("/api/journal/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis_id: analysisId || null,
          trade_date: tradeDate,
          symbol: (instrument || "CHART").toUpperCase(),
          market: market || null,
          direction,
          pnl: parsedPnl,
          currency: "USD",
          r_multiple: parsedR,
          entry_price: parsedEntry,
          exit_price: parsedExit,
          setup_tags: setupTag ? [setupTag] : [],
          mistake_tags: selectedMistakes,
          followed_plan: followedPlan,
          note: notes || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to log trade.");
      }

      setSavedSuccess(true);
      onSuccess?.();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error saving trade log");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-[var(--bg-1)] border-[var(--line)] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-[var(--candle)] font-semibold uppercase">
              Trading Journal
            </span>
            {instrument && (
              <span className="text-[11px] font-mono text-[var(--text-2)] bg-[var(--bg-2)] px-2 py-0.5 rounded border border-[var(--line)]">
                {instrument} {timeframe ? `• ${timeframe}` : ""} {market ? `(${market})` : ""}
              </span>
            )}
          </div>
          <DialogTitle className="text-lg font-bold text-[var(--text-0)]">
            Log Trade from Analysis Plan
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--text-2)] leading-relaxed">
            Record the actual execution of this setup to populate your P&amp;L calendar and track disciplined follow-through.
          </DialogDescription>
        </DialogHeader>

        {savedSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[var(--candle)]/20 text-[var(--candle)] border border-[var(--candle)]/40 flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[var(--text-0)]">Trade Logged Successfully!</h3>
              <p className="text-xs text-[var(--text-2)]">
                This execution has been saved to your trading journal calendar and equity stats.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Link href="/app/journal" onClick={() => onOpenChange(false)}>
                <Button size="sm" variant="primary-gradient" className="text-xs font-mono">
                  View in Journal →
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={() => onOpenChange(false)} className="text-xs">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Row 1: Date & Direction */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--text-1)]">Trade Date</label>
                <Input
                  type="date"
                  value={tradeDate}
                  onChange={(e) => setTradeDate(e.target.value)}
                  required
                  className="text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--text-1)]">Direction</label>
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setDirection("long")}
                    className={`py-1.5 text-xs font-mono font-bold rounded border transition-colors cursor-pointer ${
                      direction === "long"
                        ? "bg-[var(--candle)]/20 text-[var(--candle)] border-[var(--candle)]"
                        : "bg-[var(--bg-2)] text-[var(--text-2)] border-[var(--line)]"
                    }`}
                  >
                    LONG ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection("short")}
                    className={`py-1.5 text-xs font-mono font-bold rounded border transition-colors cursor-pointer ${
                      direction === "short"
                        ? "bg-[var(--bear)]/20 text-[var(--bear)] border-[var(--bear)]"
                        : "bg-[var(--bg-2)] text-[var(--text-2)] border-[var(--line)]"
                    }`}
                  >
                    SHORT ▼
                  </button>
                </div>
              </div>
            </div>

            {/* Row 2: Levels prefilled from plan */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] text-[var(--text-2)] font-mono">Entry Price</label>
                <Input
                  type="number"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="Planned"
                  className="text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-[var(--text-2)] font-mono">Exit Price</label>
                <Input
                  type="number"
                  step="any"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  placeholder="Actual"
                  className="text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-[var(--text-2)] font-mono">Stop Loss</label>
                <Input
                  type="number"
                  step="any"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="Planned"
                  className="text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-[var(--text-2)] font-mono">Target (T1)</label>
                <Input
                  type="number"
                  step="any"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="Planned"
                  className="text-xs font-mono"
                />
              </div>
            </div>

            {/* Row 3: Financials: Realized P&L & R-Multiple */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-[var(--line)] bg-[var(--bg-2)]/40">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--text-0)] flex items-center justify-between">
                  <span>Net Realized P&amp;L</span>
                  <span className="text-[10px] text-[var(--text-2)] font-mono">e.g. +250 or -100</span>
                </label>
                <Input
                  type="number"
                  step="any"
                  value={pnl}
                  onChange={(e) => setPnl(e.target.value)}
                  required
                  placeholder="+0.00"
                  className="text-xs font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--text-0)] flex items-center justify-between">
                  <span>Realized R</span>
                  <span className="text-[10px] text-[var(--text-2)] font-mono">e.g. 2.5 or -1.0</span>
                </label>
                <Input
                  type="number"
                  step="0.05"
                  value={rMultiple}
                  onChange={(e) => setRMultiple(e.target.value)}
                  placeholder="Optional R"
                  className="text-xs font-mono"
                />
              </div>
            </div>

            {/* Row 4: Plan Adherence */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-1)]">Did you follow the AI plan?</label>
              <div className="grid grid-cols-3 gap-2">
                {(["yes", "partly", "no"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFollowedPlan(opt)}
                    className={`py-1.5 text-xs font-mono capitalize rounded border transition-colors cursor-pointer ${
                      followedPlan === opt
                        ? opt === "yes"
                          ? "bg-[var(--up)]/20 text-[var(--up)] border-[var(--up)]"
                          : opt === "partly"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500"
                          : "bg-[var(--down)]/20 text-[var(--down)] border-[var(--down)]"
                        : "bg-[var(--bg-2)] text-[var(--text-2)] border-[var(--line)]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 5: Setup Tag & Mistake Tags */}
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--text-1)]">Setup Thesis Tag</label>
                <select
                  value={setupTag}
                  onChange={(e) => setSetupTag(e.target.value)}
                  aria-label="Setup Thesis Tag"
                  className="w-full text-xs p-2 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] text-[var(--text-0)]"
                >
                  <option value="From AI Plan">From AI Plan</option>
                  {COMMON_SETUP_TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-1)]">Mistake Tags (if any)</label>
                <div className="flex flex-wrap gap-1.5">
                  {MISTAKE_TAGS.map((tag) => {
                    const active = selectedMistakes.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleMistake(tag)}
                        className={`text-[10px] font-mono px-2 py-1 rounded border transition-colors cursor-pointer ${
                          active
                            ? "bg-[var(--down)]/20 text-[var(--down)] border-[var(--down)] font-semibold"
                            : "bg-[var(--bg-2)] text-[var(--text-2)] border-[var(--line)] hover:border-[var(--line-strong)]"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--text-1)]">Execution Reflection</label>
              <textarea
                rows={2}
                placeholder="What did you observe? Slippage, early target hit, emotional reaction?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] text-[var(--text-0)] placeholder:text-[var(--text-2)]/50 focus:border-[var(--candle)] focus:outline-hidden"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded bg-[var(--down)]/10 border border-[var(--down)]/30 text-[var(--down)] text-xs font-mono">
                {errorMsg}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={loading}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary-gradient"
                size="sm"
                disabled={loading}
                className="font-semibold text-xs"
              >
                {loading ? "Saving..." : "Save to Journal Calendar"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
