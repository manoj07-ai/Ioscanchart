"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { JournalOutcome } from "@/server/journal/stats";

interface LogTradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysisId?: string | null;
  instrument?: string | null;
  market?: string | null;
  timeframe?: string | null;
  onSuccess?: () => void;
}

export function LogTradeDialog({
  open,
  onOpenChange,
  analysisId,
  instrument,
  market,
  timeframe,
  onSuccess,
}: LogTradeDialogProps) {
  const [outcome, setOutcome] = useState<JournalOutcome>("win");
  const [rMultiple, setRMultiple] = useState<string>("2.0");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function handleOutcomeChange(newOutcome: JournalOutcome) {
    setOutcome(newOutcome);
    if (newOutcome === "win") setRMultiple("2.0");
    else if (newOutcome === "loss") setRMultiple("-1.0");
    else if (newOutcome === "breakeven") setRMultiple("0.0");
    else if (newOutcome === "skipped") setRMultiple("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId: analysisId || null,
          outcome,
          rMultiple: outcome !== "skipped" ? parseFloat(rMultiple) || 0 : null,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to log trade.");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error saving trade log");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[var(--bg-1)] border-[var(--line)]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-[var(--candle)] font-semibold uppercase">
              Trade Journal
            </span>
            {instrument && (
              <span className="text-[11px] font-mono text-[var(--text-2)] bg-[var(--bg-2)] px-2 py-0.5 rounded border border-[var(--line)]">
                {instrument} {timeframe ? `• ${timeframe}` : ""} {market ? `(${market})` : ""}
              </span>
            )}
          </div>
          <DialogTitle className="text-lg font-bold text-[var(--text-0)]">
            Log Trade Outcome
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--text-2)] leading-relaxed">
            Track your executed setups to build real statistical edge and observe discipline patterns.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Outcome Pills */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-1)]">Trade Result</label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleOutcomeChange("win")}
                className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                  outcome === "win"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm"
                    : "bg-[var(--bg-2)] text-[var(--text-2)] border-[var(--line)] hover:border-[var(--line-strong)]"
                }`}
              >
                WIN
              </button>
              <button
                type="button"
                onClick={() => handleOutcomeChange("loss")}
                className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                  outcome === "loss"
                    ? "bg-red-500/20 text-red-400 border-red-500/50 shadow-sm"
                    : "bg-[var(--bg-2)] text-[var(--text-2)] border-[var(--line)] hover:border-[var(--line-strong)]"
                }`}
              >
                LOSS
              </button>
              <button
                type="button"
                onClick={() => handleOutcomeChange("breakeven")}
                className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                  outcome === "breakeven"
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-sm"
                    : "bg-[var(--bg-2)] text-[var(--text-2)] border-[var(--line)] hover:border-[var(--line-strong)]"
                }`}
              >
                BE
              </button>
              <button
                type="button"
                onClick={() => handleOutcomeChange("skipped")}
                className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                  outcome === "skipped"
                    ? "bg-[var(--bg-3)] text-[var(--text-0)] border-[var(--line-strong)]"
                    : "bg-[var(--bg-2)] text-[var(--text-2)] border-[var(--line)] hover:border-[var(--line-strong)]"
                }`}
              >
                SKIPPED
              </button>
            </div>
          </div>

          {/* R-Multiple */}
          {outcome !== "skipped" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[var(--text-1)]">R Multiple Achieved</label>
                <span className="text-[10px] font-mono text-[var(--text-2)]">e.g. +2.5R or -1.0R</span>
              </div>
              <Input
                type="number"
                step="0.1"
                value={rMultiple}
                onChange={(e) => setRMultiple(e.target.value)}
                required
                className="text-xs font-mono"
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-1)]">Execution Notes &amp; Reflections</label>
            <textarea
              rows={3}
              placeholder="What went well? Did you exit early? Did price respect the structural invalidation?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] text-[var(--text-0)] placeholder:text-[var(--text-2)]/50 focus:border-[var(--candle)] focus:outline-hidden"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
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
              {loading ? "Saving..." : "Save Journal Entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
