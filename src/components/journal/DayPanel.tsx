"use client";

import React, { useState, useEffect } from "react";
import { formatMoney } from "@/lib/journal/format";
import { Button } from "@/components/ui/Button";
import { X, Check, Edit2, Trash2 } from "lucide-react";
import type { Trade, JournalDay } from "@/lib/journal/schema";

interface DayPanelProps {
  dateString: string; // YYYY-MM-DD
  trades: Trade[];
  journalDay: JournalDay | null;
  currency: string;
  viewMode: "pnl" | "r";
  privacyBlur?: boolean;
  onSaveDayNote: (day: string, note: string, mood?: number | null) => Promise<void>;
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (id: string) => void;
  onQuickAddTrade: () => void;
  onClose: () => void;
}

const MOOD_RATINGS = [
  { value: 1, label: "Tilted / Distressed", short: "1" },
  { value: 2, label: "Frustrated", short: "2" },
  { value: 3, label: "Neutral / Balanced", short: "3" },
  { value: 4, label: "Calm & Disciplined", short: "4" },
  { value: 5, label: "Flow State", short: "5" },
];

export function DayPanel({
  dateString,
  trades,
  journalDay,
  currency,
  viewMode,
  privacyBlur = false,
  onSaveDayNote,
  onEditTrade,
  onDeleteTrade,
  onQuickAddTrade,
  onClose,
}: DayPanelProps) {
  const [note, setNote] = useState(journalDay?.note || "");
  const [mood, setMood] = useState<number | null>(journalDay?.mood || null);
  const [savingNote, setSavingNote] = useState(false);
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  useEffect(() => {
    setNote(journalDay?.note || "");
    setMood(journalDay?.mood || null);
  }, [journalDay, dateString]);

  // Compute daily totals
  const dayPnl = trades.reduce((acc, t) => acc + Number(t.pnl), 0);
  const dayR = trades.reduce((acc, t) => acc + Number(t.r_multiple || 0), 0);

  const isProfit = dayPnl > 0;
  const isLoss = dayPnl < 0;

  let pnlDisplay: string;
  if (privacyBlur) {
    pnlDisplay = "••••";
  } else if (viewMode === "r") {
    pnlDisplay = dayR > 0 ? `+${dayR}R` : `${dayR}R`;
  } else {
    pnlDisplay = formatMoney(dayPnl, currency, { signDisplay: "always", privacyBlur });
  }

  async function handleSaveNote() {
    setSavingNote(true);
    setNoteSavedFeedback(false);
    try {
      await onSaveDayNote(dateString, note, mood);
      setNoteSavedFeedback(true);
      setTimeout(() => setNoteSavedFeedback(false), 2500);
    } finally {
      setSavingNote(false);
    }
  }

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-5 space-y-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-2)] block">
            Day Overview
          </span>
          <h3 className="text-base font-bold text-[var(--text-0)] font-mono">{dateString}</h3>
        </div>

        <button
          onClick={onClose}
          className="text-xs text-[var(--text-2)] hover:text-[var(--text-0)] p-1 rounded hover:bg-[var(--bg-2)] cursor-pointer"
          title="Close day view"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Day Net Stats Card */}
      <div className="p-3.5 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-2)] block">
            Daily Net
          </span>
          <div
            className={`font-mono text-lg font-bold ${
              isProfit ? "text-[var(--candle)]" : isLoss ? "text-[var(--bear)]" : "text-[var(--text-0)]"
            }`}
          >
            {pnlDisplay}
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-2)] block">
            Executions
          </span>
          <div className="font-mono text-sm font-bold text-[var(--text-0)]">
            {trades.length} trade{trades.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      {/* Day Psychological Reflection & Mood */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-2)]">
            Daily Reflection & Mindset Note
          </label>
          <div className="flex items-center gap-1">
            {MOOD_RATINGS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className={`w-6 h-6 rounded-md font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                  mood === m.value
                    ? "bg-[var(--candle)] text-[#04120A] shadow-xs"
                    : "bg-[var(--bg-2)] text-[var(--text-2)] hover:text-[var(--text-0)] hover:bg-[var(--bg-3)] border border-[var(--line)]"
                }`}
                title={m.label}
              >
                {m.short}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How was your focus, execution discipline, and patience today?"
          rows={3}
          className="w-full text-xs rounded-lg bg-[var(--bg-2)] border border-[var(--line)] p-2.5 text-[var(--text-0)] focus:border-[var(--candle)] focus:outline-none resize-none"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-[var(--candle)] font-mono flex items-center gap-1">
            {noteSavedFeedback ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Reflection saved</span>
              </>
            ) : null}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveNote}
            disabled={savingNote}
            className="text-xs h-7 px-3"
          >
            {savingNote ? "Saving..." : "Save Reflection"}
          </Button>
        </div>
      </div>

      {/* Trades logged on this day */}
      <div className="space-y-2.5 pt-2 border-t border-[var(--line)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--text-0)]">
            Trades on this Day ({trades.length})
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={onQuickAddTrade}
            className="text-xs h-7 px-2.5"
          >
            + Add Trade
          </Button>
        </div>

        {trades.length === 0 ? (
          <p className="text-xs text-[var(--text-2)] italic py-2">
            No trades logged for {dateString}. Click above to add one.
          </p>
        ) : (
          <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
            {trades.map((trade) => {
              const tradeProfit = Number(trade.pnl) > 0;
              const tradeLoss = Number(trade.pnl) < 0;

              return (
                <div
                  key={trade.id}
                  className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg-2)]/60 flex items-center justify-between gap-2 group text-xs"
                >
                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="font-bold text-[var(--text-0)]">{trade.symbol}</span>
                      {trade.direction && (
                        <span
                          className={`text-[9px] uppercase px-1 rounded ${
                            trade.direction === "long"
                              ? "bg-[var(--candle)]/20 text-[var(--candle)]"
                              : "bg-[var(--bear)]/20 text-[var(--bear)]"
                          }`}
                        >
                          {trade.direction}
                        </span>
                      )}
                    </div>
                    {trade.note && (
                      <p className="text-[11px] text-[var(--text-2)] truncate max-w-[160px]">
                        {trade.note}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`font-mono font-bold text-xs ${
                        tradeProfit
                          ? "text-[var(--candle)]"
                          : tradeLoss
                          ? "text-[var(--bear)]"
                          : "text-[var(--text-0)]"
                      }`}
                    >
                      {privacyBlur
                        ? "••••"
                        : formatMoney(trade.pnl, currency, { signDisplay: "always", privacyBlur })}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditTrade(trade)}
                        className="p-1 text-[var(--text-2)] hover:text-[var(--text-0)] hover:bg-[var(--bg-3)] rounded cursor-pointer"
                        title="Edit trade"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => trade.id && onDeleteTrade(trade.id)}
                        className="p-1 text-[var(--text-2)] hover:text-red-400 hover:bg-[var(--bg-3)] rounded cursor-pointer"
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
        )}
      </div>
    </div>
  );
}
