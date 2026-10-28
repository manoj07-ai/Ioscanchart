"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { StatsStrip } from "./StatsStrip";
import { EquityCurve } from "./EquityCurve";
import { MonthCalendar } from "./MonthCalendar";
import { AddTradeForm } from "./AddTradeForm";
import { DayPanel } from "./DayPanel";
import { TradeLog } from "./TradeLog";
import { InsightsTabs } from "./InsightsTabs";
import { SampleDataBanner } from "./SampleDataBanner";
import { ShareMonthDialog } from "./ShareMonthDialog";
import { ImportCsvDialog } from "./ImportCsvDialog";
import { SettingsDialog } from "./SettingsDialog";
import { Button } from "@/components/ui/Button";
import { computeStats } from "@/lib/journal/stats";
import { generateSampleTrades } from "@/lib/journal/sample-data";
import { formatDateOnly } from "@/lib/journal/calendar";
import { ApiRepository, LocalRepository, type JournalRepository } from "@/lib/journal/repository";
import type { Trade, JournalDay, JournalSettings } from "@/lib/journal/schema";
import { DEFAULT_JOURNAL_SETTINGS } from "@/lib/journal/schema";

interface JournalPageProps {
  repository?: JournalRepository;
  mode?: "api" | "local";
  isGuest?: boolean;
}

export function JournalPage({ repository: propRepo, mode = "api", isGuest = false }: JournalPageProps) {
  const repository = useMemo(() => {
    if (propRepo) return propRepo;
    return mode === "local" ? new LocalRepository() : new ApiRepository();
  }, [propRepo, mode]);
  // Calendar date view state
  const today = useMemo(() => {
    const d = new Date();
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      dateStr: formatDateOnly(d.getFullYear(), d.getMonth() + 1, d.getDate()),
    };
  }, []);

  const [currentYear, setCurrentYear] = useState<number>(today.year);
  const [currentMonth, setCurrentMonth] = useState<number>(today.month);
  const [selectedDate, setSelectedDate] = useState<string>(today.dateStr);
  const [activeDayView, setActiveDayView] = useState<string | null>(null);

  // Core data states
  const [trades, setTrades] = useState<Trade[]>([]);
  const [settings, setSettings] = useState<JournalSettings>(DEFAULT_JOURNAL_SETTINGS);
  const [dayNoteData, setDayNoteData] = useState<JournalDay | null>(null);
  const [loading, setLoading] = useState(true);

  // View preferences
  const [viewMode, setViewMode] = useState<"pnl" | "r">("pnl");
  const [privacyBlur, setPrivacyBlur] = useState<boolean>(false);

  // Sample data mode
  const [isSampleData, setIsSampleData] = useState<boolean>(false);
  const [backupRealTrades, setBackupRealTrades] = useState<Trade[]>([]);

  // Dialogs
  const [shareOpen, setShareOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Edit trade state
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  // Undo delete state
  const [recentlyDeletedTrade, setRecentlyDeletedTrade] = useState<Trade | null>(null);
  const [undoTimeoutId, setUndoTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Load initial settings and trades
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedSettings, fetchedTrades] = await Promise.all([
        repository.getSettings(),
        repository.getTrades(),
      ]);
      setSettings(fetchedSettings);
      setViewMode(fetchedSettings.defaultView || "pnl");
      setPrivacyBlur(!!fetchedSettings.privacyBlur);
      setTrades(fetchedTrades);
    } catch (err) {
      console.error("Failed to load journal data:", err);
    } finally {
      setLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load day note when active day changes
  useEffect(() => {
    if (activeDayView) {
      repository.getDay(activeDayView).then(setDayNoteData).catch(() => setDayNoteData(null));
    } else {
      setDayNoteData(null);
    }
  }, [activeDayView, repository]);

  // Compute overall stats
  const stats = useMemo(() => {
    return computeStats(trades);
  }, [trades]);

  // Distinct symbols for autocomplete
  const previousSymbols = useMemo(() => {
    return Array.from(new Set(trades.map((t) => t.symbol))).filter(Boolean);
  }, [trades]);

  // Month navigation handlers
  function handlePrevMonth() {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  function handleGoToday() {
    setCurrentYear(today.year);
    setCurrentMonth(today.month);
    setSelectedDate(today.dateStr);
  }

  // Save Trade (Optimistic)
  async function handleSaveTrade(tradeData: Omit<Trade, "id" | "user_id"> & { id?: string }) {
    if (isSampleData) {
      // In sample data mode, update purely in memory
      if (tradeData.id) {
        setTrades((prev) =>
          prev.map((t) => (t.id === tradeData.id ? ({ ...t, ...tradeData } as Trade) : t))
        );
      } else {
        const newTrade: Trade = {
          ...tradeData,
          id: `sample-${Date.now()}`,
          created_at: new Date().toISOString(),
        };
        setTrades((prev) => [newTrade, ...prev]);
      }
      setEditingTrade(null);
      return;
    }

    if (tradeData.id) {
      // Update
      const updated = await repository.updateTrade(tradeData.id, tradeData);
      setTrades((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setEditingTrade(null);
    } else {
      // Create
      const created = await repository.saveTrade(tradeData);
      setTrades((prev) => [created, ...prev]);
    }
  }

  // Delete Trade with 6-Second Undo
  async function handleDeleteTrade(id: string) {
    const target = trades.find((t) => t.id === id);
    if (!target) return;

    // Optimistically remove from state
    setTrades((prev) => prev.filter((t) => t.id !== id));
    setRecentlyDeletedTrade(target);

    if (undoTimeoutId) clearTimeout(undoTimeoutId);

    // Set 6-second window before committing delete
    const timer = setTimeout(async () => {
      if (!isSampleData) {
        await repository.deleteTrade(id);
      }
      setRecentlyDeletedTrade(null);
    }, 6000);

    setUndoTimeoutId(timer);
  }

  // Undo delete
  function handleUndoDelete() {
    if (!recentlyDeletedTrade) return;
    if (undoTimeoutId) clearTimeout(undoTimeoutId);
    setTrades((prev) => [recentlyDeletedTrade, ...prev]);
    setRecentlyDeletedTrade(null);
  }

  // Duplicate trade
  function handleDuplicateTrade(trade: Trade) {
    const copy = { ...trade };
    delete copy.id;
    setEditingTrade(copy as Trade);
    setActiveDayView(null);
  }

  // Batch CSV Import
  async function handleImportSuccess(imported: Omit<Trade, "id" | "user_id">[]) {
    if (isSampleData) {
      const mock: Trade[] = imported.map((t, i) => ({
        ...t,
        id: `mock-import-${i}`,
        created_at: new Date().toISOString(),
      }));
      setTrades((prev) => [...mock, ...prev]);
      return;
    }
    await repository.importTrades(imported);
    await loadData();
  }

  // Save Settings
  async function handleSaveSettings(newSettings: Partial<JournalSettings>) {
    const updated = await repository.saveSettings(newSettings);
    setSettings(updated);
    if (updated.defaultView) setViewMode(updated.defaultView);
    setPrivacyBlur(!!updated.privacyBlur);
  }

  // Sample data controls
  function handleLoadSampleData() {
    setBackupRealTrades(trades);
    const sample = generateSampleTrades(new Date(currentYear, currentMonth - 1, 15));
    setTrades(sample);
    setIsSampleData(true);
  }

  function handleClearSampleData() {
    setTrades(backupRealTrades);
    setIsSampleData(false);
  }

  // Trades on currently active day view
  const activeDayTrades = useMemo(() => {
    if (!activeDayView) return [];
    return trades.filter((t) => t.trade_date === activeDayView);
  }, [trades, activeDayView]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Guest Mode Notice */}
      {isGuest && (
        <div className="p-4 rounded-xl border border-[var(--candle)]/30 bg-[var(--candle)]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-[var(--candle)] block">
              Guest Mode · Offline Trading Journal
            </span>
            <span className="text-[var(--text-1)] text-[11px]">
              Your trades and settings are stored locally in this browser. Create an account to sync across devices and link AI chart analyses.
            </span>
          </div>
          <Link href="/app">
            <Button variant="primary-gradient" size="sm" className="shrink-0 text-xs font-semibold">
              Create Free Account →
            </Button>
          </Link>
        </div>
      )}

      {/* Sample Data Active Banner */}
      {isSampleData && <SampleDataBanner onClear={handleClearSampleData} />}

      {/* 6-Second Undo Banner */}
      {recentlyDeletedTrade && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl border border-[var(--line-strong)] bg-[var(--bg-2)]/95 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <div>
            <span className="text-[var(--text-0)] font-semibold block">
              Trade for {recentlyDeletedTrade.symbol} removed.
            </span>
            <span className="text-[11px] text-[var(--text-2)]">You have 6 seconds to undo.</span>
          </div>
          <Button
            variant="primary-gradient"
            size="sm"
            onClick={handleUndoDelete}
            className="text-xs h-8 px-3 font-semibold"
          >
            Undo ↺
          </Button>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-0)] font-sans">
            Trading Journal
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-2)] mt-0.5">
            Log trades. Discover your mathematical edge. See your month at a glance.
          </p>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* P&L ($) vs R Toggle */}
          <div className="flex items-center p-1 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] text-xs font-mono">
            <button
              onClick={() => setViewMode("pnl")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "pnl"
                  ? "bg-[var(--bg-3)] text-[var(--candle)] border border-[var(--line)] shadow-2xs"
                  : "text-[var(--text-2)] hover:text-[var(--text-0)]"
              }`}
            >
              P&L ({settings.currency})
            </button>
            <button
              onClick={() => setViewMode("r")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "r"
                  ? "bg-[var(--bg-3)] text-[var(--candle)] border border-[var(--line)] shadow-2xs"
                  : "text-[var(--text-2)] hover:text-[var(--text-0)]"
              }`}
            >
              R-Multiple
            </button>
          </div>

          {/* Privacy Blur Toggle */}
          <button
            onClick={() => setPrivacyBlur(!privacyBlur)}
            className={`p-2 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
              privacyBlur
                ? "bg-[var(--candle)]/20 border-[var(--candle)]/40 text-[var(--candle)]"
                : "bg-[var(--bg-2)] border-[var(--line)] text-[var(--text-2)] hover:text-[var(--text-0)]"
            }`}
            title="Privacy Mode: Blur monetary figures"
          >
            {privacyBlur ? "👁️‍🗨️ Blurred" : "👁️ Visible"}
          </button>

          {/* Actions Menu */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setImportOpen(true)}
              className="text-xs h-9"
              title="Import trades from CSV"
            >
              Import CSV 📥
            </Button>

            <a
              href={`/api/journal/export.csv?from=${currentYear}-01-01&to=${currentYear}-12-31`}
              download
            >
              <Button
                variant="secondary"
                size="sm"
                className="text-xs h-9"
                title="Export trades to CSV"
              >
                Export CSV 📤
              </Button>
            </a>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSettingsOpen(true)}
              className="text-xs h-9 px-2.5"
              title="Journal settings"
            >
              ⚙️
            </Button>
          </div>
        </div>
      </div>

      {/* 1. Stats Strip (6 tiles) */}
      <StatsStrip
        stats={stats}
        currency={settings.currency}
        viewMode={viewMode}
        privacyBlur={privacyBlur}
        loading={loading}
      />

      {/* 2. Main 12-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns: Equity Curve & Month Calendar */}
        <div className="lg:col-span-8 space-y-6">
          {/* Running P&L Equity Curve */}
          <EquityCurve
            trades={trades}
            currency={settings.currency}
            viewMode={viewMode}
            privacyBlur={privacyBlur}
          />

          {/* Hero Month Calendar */}
          <MonthCalendar
            year={currentYear}
            month={currentMonth}
            trades={trades}
            selectedDate={selectedDate}
            currency={settings.currency}
            viewMode={viewMode}
            weekStart={settings.weekStart ?? 1}
            showWeekends={!!settings.showWeekends}
            privacyBlur={privacyBlur}
            onSelectDate={(d) => {
              setSelectedDate(d);
              setActiveDayView(d);
            }}
            onAddTradeOnDate={(d) => {
              setSelectedDate(d);
              setActiveDayView(null);
            }}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onGoToday={handleGoToday}
            onToggleWeekends={() =>
              handleSaveSettings({ showWeekends: !settings.showWeekends })
            }
            onOpenShare={() => setShareOpen(true)}
          />
        </div>

        {/* Right 4 Columns: Day Panel OR Add Trade Form + Trade Log */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          {activeDayView ? (
            <DayPanel
              dateString={activeDayView}
              trades={activeDayTrades}
              journalDay={dayNoteData}
              currency={settings.currency}
              viewMode={viewMode}
              privacyBlur={privacyBlur}
              onSaveDayNote={async (day, note, mood) => {
                await repository.saveDay(day, { note, mood });
                const updated = await repository.getDay(day);
                setDayNoteData(updated);
              }}
              onEditTrade={(t) => {
                setEditingTrade(t);
                setActiveDayView(null);
              }}
              onDeleteTrade={handleDeleteTrade}
              onQuickAddTrade={() => {
                setSelectedDate(activeDayView);
                setActiveDayView(null);
              }}
              onClose={() => setActiveDayView(null)}
            />
          ) : (
            <AddTradeForm
              initialDate={selectedDate}
              previousSymbols={previousSymbols}
              initialTrade={editingTrade}
              currency={settings.currency}
              onSaveTrade={handleSaveTrade}
              onCancelEdit={() => setEditingTrade(null)}
            />
          )}

          {/* Trade Log */}
          <TradeLog
            trades={trades}
            currency={settings.currency}
            viewMode={viewMode}
            privacyBlur={privacyBlur}
            onEditTrade={(t) => {
              setEditingTrade(t);
              setActiveDayView(null);
            }}
            onDuplicateTrade={handleDuplicateTrade}
            onDeleteTrade={handleDeleteTrade}
            onLoadSampleData={handleLoadSampleData}
          />
        </div>
      </div>

      {/* 3. Full-Width Insights Section */}
      <InsightsTabs
        trades={trades}
        currency={settings.currency}
        viewMode={viewMode}
        privacyBlur={privacyBlur}
      />

      {/* Dialogs */}
      <ShareMonthDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        year={currentYear}
        month={currentMonth}
        trades={trades}
        currency={settings.currency}
      />

      <ImportCsvDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImportSuccess={handleImportSuccess}
      />

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}
