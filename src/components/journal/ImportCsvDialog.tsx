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
import { parseAndValidateCsv, type CsvImportResult } from "@/lib/journal/csv";
import type { Trade } from "@/lib/journal/schema";

interface ImportCsvDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: (trades: Omit<Trade, "id" | "user_id">[]) => Promise<void>;
}

export function ImportCsvDialog({
  open,
  onOpenChange,
  onImportSuccess,
}: ImportCsvDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvText, setCsvText] = useState("");
  const [parsedResult, setParsedResult] = useState<CsvImportResult | null>(null);
  const [importing, setImporting] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = String(event.target?.result || "");
      setCsvText(content);
      const res = parseAndValidateCsv(content);
      setParsedResult(res);
    };
    reader.readAsText(file);
  }

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setCsvText(val);
    if (val.trim()) {
      const res = parseAndValidateCsv(val);
      setParsedResult(res);
    } else {
      setParsedResult(null);
    }
  }

  async function handleImport() {
    if (!parsedResult || parsedResult.validTrades.length === 0) return;
    setImporting(true);
    try {
      await onImportSuccess(parsedResult.validTrades);
      onOpenChange(false);
      setCsvText("");
      setParsedResult(null);
    } finally {
      setImporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Import Trades from CSV</DialogTitle>
          <DialogDescription>
            Import historical trades from any spreadsheet or broker export.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-xs">
          {/* File Picker or Paste */}
          <div className="flex items-center justify-between">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs"
            >
              Choose CSV File 📁
            </Button>

            <a
              href="/downloads/trading-journal-template.csv"
              download="trading-journal-template.csv"
              className="text-xs text-[var(--candle)] hover:underline font-mono"
            >
              Download Sample Template ↗
            </a>
          </div>

          {/* Paste area */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-2)]">
              Or Paste CSV Data Directly
            </label>
            <textarea
              value={csvText}
              onChange={handleTextChange}
              placeholder="Date,Symbol,P&L,R,Direction...&#10;2026-10-24,NIFTY,450.00,2.25,long..."
              rows={4}
              className="w-full text-xs font-mono rounded-lg bg-[var(--bg-2)] border border-[var(--line)] p-2.5 text-[var(--text-0)] focus:border-[var(--candle)] focus:outline-none"
            />
          </div>

          {/* Validation Result Preview */}
          {parsedResult && (
            <div className="p-3.5 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-[var(--text-0)]">
                  Valid Rows Ready:{" "}
                  <span className="text-[var(--candle)]">{parsedResult.validTrades.length}</span>
                </span>
                {parsedResult.errors.length > 0 && (
                  <span className="text-[var(--bear)] text-[11px]">
                    {parsedResult.errors.length} row error(s)
                  </span>
                )}
              </div>

              {parsedResult.errors.length > 0 && (
                <div className="max-h-28 overflow-y-auto space-y-1 text-[11px] font-mono text-[var(--bear)] border-t border-[var(--line)] pt-2">
                  {parsedResult.errors.slice(0, 10).map((err, idx) => (
                    <div key={idx}>
                      Row {err.row} [{err.field}]: {err.reason}
                    </div>
                  ))}
                  {parsedResult.errors.length > 10 && (
                    <div className="text-[var(--text-2)] italic">
                      + {parsedResult.errors.length - 10} more errors
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

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
            onClick={handleImport}
            disabled={!parsedResult || parsedResult.validTrades.length === 0 || importing}
            className="text-xs font-semibold"
          >
            {importing
              ? "Importing..."
              : `Import ${parsedResult?.validTrades.length || 0} Trades`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
