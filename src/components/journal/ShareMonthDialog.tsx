"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { brand } from "@/config/brand";
import { formatMoney } from "@/lib/journal/format";
import type { Trade } from "@/lib/journal/schema";
import { toPng } from "html-to-image";

interface ShareMonthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  year: number;
  month: number;
  trades: Trade[];
  currency: string;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function ShareMonthDialog({
  open,
  onOpenChange,
  year,
  month,
  trades,
  currency,
}: ShareMonthDialogProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [hideAmounts, setHideAmounts] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Filter trades for this month
  const monthStr = `${year}-${String(month).padStart(2, "0")}`;
  const monthTrades = trades.filter((t) => t.trade_date.startsWith(monthStr));

  const totalPnl = monthTrades.reduce((acc, t) => acc + Number(t.pnl), 0);
  const wins = monthTrades.filter((t) => t.pnl > 0).length;
  const losses = monthTrades.filter((t) => t.pnl < 0).length;
  const totalCount = monthTrades.length;

  async function handleDownloadImage() {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        backgroundColor: "#070c09",
      });
      const link = document.createElement("a");
      link.download = `${brand.name.toLowerCase()}-journal-${monthStr}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Share Month Performance</DialogTitle>
          <DialogDescription>
            Export a clean image card of your monthly journal. Includes standard compliance disclaimers.
          </DialogDescription>
        </DialogHeader>

        {/* Options */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] text-xs">
          <span className="font-medium text-[var(--text-1)]">Card Privacy Setting</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHideAmounts(false)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                !hideAmounts
                  ? "bg-[var(--bg-3)] border border-[var(--candle)] text-[var(--candle)] font-bold"
                  : "text-[var(--text-2)] hover:text-[var(--text-0)]"
              }`}
            >
              Show Amounts
            </button>
            <button
              onClick={() => setHideAmounts(true)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                hideAmounts
                  ? "bg-[var(--bg-3)] border border-[var(--candle)] text-[var(--candle)] font-bold"
                  : "text-[var(--text-2)] hover:text-[var(--text-0)]"
              }`}
            >
              Hide Amounts (Colors Only)
            </button>
          </div>
        </div>

        {/* Exportable Card Canvas */}
        <div
          ref={previewRef}
          className="p-6 rounded-xl border border-[var(--line)] bg-[#070c09] text-white space-y-5 select-none shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[var(--candle)] block">
                Monthly Trading Journal
              </span>
              <h2 className="text-xl font-bold font-mono">
                {MONTH_NAMES[month - 1]} {year}
              </h2>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-2)] block">
                Net P&L
              </span>
              <div
                className={`font-mono text-xl font-bold ${
                  totalPnl > 0
                    ? "text-[var(--candle)]"
                    : totalPnl < 0
                    ? "text-[var(--bear)]"
                    : "text-white"
                }`}
              >
                {hideAmounts
                  ? totalPnl > 0
                    ? "▲ Profit"
                    : "▼ Loss"
                  : formatMoney(totalPnl, currency, { signDisplay: "always" })}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <div className="p-2.5 rounded bg-[var(--bg-2)]/60 border border-[var(--line)]">
              <span className="text-[10px] text-[var(--text-2)] uppercase block">Total Trades</span>
              <span className="font-bold text-sm">{totalCount}</span>
            </div>
            <div className="p-2.5 rounded bg-[var(--bg-2)]/60 border border-[var(--line)]">
              <span className="text-[10px] text-[var(--text-2)] uppercase block">Win / Loss</span>
              <span className="font-bold text-sm">
                <span className="text-[var(--candle)]">{wins}W</span> ·{" "}
                <span className="text-[var(--bear)]">{losses}L</span>
              </span>
            </div>
            <div className="p-2.5 rounded bg-[var(--bg-2)]/60 border border-[var(--line)]">
              <span className="text-[10px] text-[var(--text-2)] uppercase block">Win Rate</span>
              <span className="font-bold text-sm">
                {totalCount >= 10 ? `${Math.round((wins / (wins + losses || 1)) * 100)}%` : "—"}
              </span>
            </div>
          </div>

          {/* Mandatory Transparency Notice & Brand Footer */}
          <div className="pt-3 border-t border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-[var(--text-2)]">
            <span>Self-reported results. Not verified. Not investment advice.</span>
            <span className="font-mono font-bold text-[var(--candle)]">{brand.name}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            variant="primary-gradient"
            size="sm"
            onClick={handleDownloadImage}
            disabled={downloading}
            className="text-xs font-semibold"
          >
            {downloading ? "Generating image..." : "Download PNG 💾"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
