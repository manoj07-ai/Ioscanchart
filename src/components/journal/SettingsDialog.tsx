"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { CURRENCIES, type JournalSettings } from "@/lib/journal/schema";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: JournalSettings;
  onSaveSettings: (settings: Partial<JournalSettings>) => Promise<void>;
}

export function SettingsDialog({
  open,
  onOpenChange,
  settings,
  onSaveSettings,
}: SettingsDialogProps) {
  const [currency, setCurrency] = useState(settings.currency || "USD");
  const [weekStart, setWeekStart] = useState<0 | 1>(settings.weekStart ?? 1);
  const [showWeekends, setShowWeekends] = useState(!!settings.showWeekends);
  const [privacyBlur, setPrivacyBlur] = useState(!!settings.privacyBlur);
  const [defaultView, setDefaultView] = useState<"pnl" | "r">(settings.defaultView || "pnl");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSaveSettings({
        currency,
        weekStart,
        showWeekends,
        privacyBlur,
        defaultView,
      });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Journal Display Settings</DialogTitle>
          <DialogDescription>
            Configure default currency, calendar grouping, and privacy settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-xs">
          {/* Currency */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-2)]">
              Currency / Units
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full text-xs rounded-lg bg-[var(--bg-2)] border border-[var(--line)] text-[var(--text-0)] px-3 py-2 focus:border-[var(--candle)] focus:outline-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c === "INR"
                    ? "INR (₹ · Lakhs / Crores en-IN)"
                    : c === "POINTS"
                    ? "Points Mode (Index points / no symbol)"
                    : c}
                </option>
              ))}
            </select>
          </div>

          {/* Week Start */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-2)]">
              Calendar Week Starts On
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setWeekStart(1)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  weekStart === 1
                    ? "bg-[var(--bg-3)] border border-[var(--candle)] text-[var(--candle)] font-bold"
                    : "bg-[var(--bg-2)] border border-[var(--line)] text-[var(--text-2)]"
                }`}
              >
                Monday (Default)
              </button>
              <button
                type="button"
                onClick={() => setWeekStart(0)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  weekStart === 0
                    ? "bg-[var(--bg-3)] border border-[var(--candle)] text-[var(--candle)] font-bold"
                    : "bg-[var(--bg-2)] border border-[var(--line)] text-[var(--text-2)]"
                }`}
              >
                Sunday
              </button>
            </div>
          </div>

          {/* Default Metric View */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-2)]">
              Default Metric Display
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDefaultView("pnl")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  defaultView === "pnl"
                    ? "bg-[var(--bg-3)] border border-[var(--candle)] text-[var(--candle)] font-bold"
                    : "bg-[var(--bg-2)] border border-[var(--line)] text-[var(--text-2)]"
                }`}
              >
                P&L ($ / Currency)
              </button>
              <button
                type="button"
                onClick={() => setDefaultView("r")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  defaultView === "r"
                    ? "bg-[var(--bg-3)] border border-[var(--candle)] text-[var(--candle)] font-bold"
                    : "bg-[var(--bg-2)] border border-[var(--line)] text-[var(--text-2)]"
                }`}
              >
                R-Multiple (Discipline)
              </button>
            </div>
          </div>

          {/* Show Weekends Switch */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--line)]">
            <div className="space-y-0.5">
              <span className="font-semibold text-[var(--text-0)] block">Show Weekends (7 Days)</span>
              <span className="text-[11px] text-[var(--text-2)]">
                Displays Saturday & Sunday columns for crypto and 24/7 markets.
              </span>
            </div>
            <Switch checked={showWeekends} onCheckedChange={setShowWeekends} />
          </div>

          {/* Privacy Blur Switch */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--line)]">
            <div className="space-y-0.5">
              <span className="font-semibold text-[var(--text-0)] block">Privacy Mode</span>
              <span className="text-[11px] text-[var(--text-2)]">
                Blurs all dollar values across the journal for safe screenshots and screen-sharing.
              </span>
            </div>
            <Switch checked={privacyBlur} onCheckedChange={setPrivacyBlur} />
          </div>
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
            onClick={handleSave}
            disabled={saving}
            className="text-xs font-semibold"
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
