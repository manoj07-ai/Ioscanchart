"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Scale, BookOpen, Trash2 } from "lucide-react";
import { LogTradeDialog } from "./LogTradeDialog";
import { CumulativeRChart } from "./CumulativeRChart";
import type { JournalStats, JournalEntryRecord } from "@/server/journal/stats";

export function JournalView() {
  const [entries, setEntries] = useState<JournalEntryRecord[]>([]);
  const [stats, setStats] = useState<JournalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchJournal = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/journal");
      if (!res.ok) throw new Error("Failed to load journal");
      const data = await res.json();
      setEntries(data.entries || []);
      setStats(data.stats || null);
    } catch (err) {
      console.error("Journal fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJournal();
  }, [fetchJournal]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/journal/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchJournal();
      }
    } catch (err) {
      console.error("Error deleting journal entry:", err);
    } finally {
      setDeletingId(null);
    }
  }

  function handleExportCsv() {
    if (entries.length === 0) return;

    const headers = ["Date", "Instrument", "Market", "Timeframe", "Outcome", "R Multiple", "Notes"];
    const rows = entries.map((e) => [
      `"${e.createdAt.slice(0, 10)}"`,
      `"${e.instrument || "Discretionary"}"`,
      `"${e.marketPack || "other"}"`,
      `"${e.timeframe || "-"}"`,
      `"${e.outcome}"`,
      e.rMultiple !== null ? e.rMultiple : "",
      `"${(e.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `iosnapchart-journal-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-0)]">
            Trade Journal
          </h1>
          <p className="text-xs text-[var(--text-2)] mt-1">
            Log your executions, track cumulative R growth, and audit discipline against your analysis plans.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {entries.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportCsv}
              className="text-xs font-mono"
            >
              Export CSV ↗
            </Button>
          )}
          <Button
            variant="primary-gradient"
            size="sm"
            onClick={() => setLogDialogOpen(true)}
            className="text-xs font-semibold"
          >
            + Log Trade
          </Button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Trades */}
        <div className="p-4 rounded-xl bg-[var(--bg-1)] border border-[var(--line)] space-y-1">
          <span className="text-[11px] font-mono text-[var(--text-2)] uppercase block">Total Logged</span>
          <span className="text-2xl font-bold font-mono text-[var(--text-0)] block">
            {stats?.totalCount ?? 0}
          </span>
          <span className="text-[10px] text-[var(--text-2)] block font-mono">
            {stats?.skipped ?? 0} skipped setups
          </span>
        </div>

        {/* Win Rate (guarded against small samples) */}
        <div className="p-4 rounded-xl bg-[var(--bg-1)] border border-[var(--line)] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[var(--text-2)] uppercase">Win Rate</span>
            {(stats?.decidedCount ?? 0) < 10 && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-mono">
                Sample &lt; 10
              </span>
            )}
          </div>
          <span className="text-2xl font-bold font-mono text-[var(--text-0)] block">
            {stats?.winRatePercent !== null ? `${stats?.winRatePercent}%` : stats?.winRateDisplay || "—"}
          </span>
          <span className="text-[10px] text-[var(--text-2)] block font-mono">
            {stats?.winRatePercent !== null
              ? stats?.winRateDisplay
              : (stats?.decidedCount ?? 0) > 0
              ? "Percentage hidden until 10 trades"
              : "0 decided trades"}
          </span>
        </div>

        {/* Average R */}
        <div className="p-4 rounded-xl bg-[var(--bg-1)] border border-[var(--line)] space-y-1">
          <span className="text-[11px] font-mono text-[var(--text-2)] uppercase block">Average R</span>
          <span
            className={`text-2xl font-bold font-mono block ${
              (stats?.averageR ?? 0) >= 0 ? "text-[var(--candle)]" : "text-[var(--bear)]"
            }`}
          >
            {(stats?.averageR ?? 0) >= 0 ? "+" : ""}
            {stats?.averageR ?? 0}R
          </span>
          <span className="text-[10px] text-[var(--text-2)] block font-mono">
            Net: {(stats?.totalR ?? 0) >= 0 ? "+" : ""}
            {stats?.totalR ?? 0}R
          </span>
        </div>

        {/* Best / Worst Market */}
        <div className="p-4 rounded-xl bg-[var(--bg-1)] border border-[var(--line)] space-y-1">
          <span className="text-[11px] font-mono text-[var(--text-2)] uppercase block">Best Market</span>
          <span className="text-sm font-semibold font-mono text-[var(--text-0)] truncate block">
            {stats?.bestMarket ? `${stats.bestMarket.market} (+${stats.bestMarket.avgR}R)` : "—"}
          </span>
          <span className="text-[10px] text-[var(--text-2)] block truncate font-mono">
            Worst: {stats?.worstMarket ? `${stats.worstMarket.market} (${stats.worstMarket.avgR}R)` : "—"}
          </span>
        </div>
      </div>

      {/* Prominent Legal Clarity Notice */}
      <div className="p-3 rounded-lg bg-[var(--bg-2)]/50 border border-[var(--line)] flex items-center justify-between text-xs font-mono text-[var(--text-2)]">
        <span className="flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5 text-[var(--candle)] shrink-0" />
          <span>Your results, not a prediction. Past performance does not guarantee future outcomes.</span>
        </span>
        <span className="text-[10px] hidden sm:inline">Self-reported execution log</span>
      </div>

      {/* Cumulative R Chart */}
      <CumulativeRChart series={stats?.cumulativeSeries || []} />

      {/* Journal Entries Table */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-[var(--text-0)]">Execution Log</h3>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-[var(--bg-1)] border border-[var(--line)] animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-dashed border-[var(--line)] bg-[var(--bg-1)] space-y-3">
            <BookOpen className="w-8 h-8 text-[var(--candle)] mx-auto mb-1" />
            <div className="text-sm font-semibold text-[var(--text-0)]">No journal entries logged yet</div>
            <p className="text-xs text-[var(--text-2)] max-w-sm mx-auto">
              Whenever you execute or skip an analysis plan, record the outcome here to calculate real R-multiples.
            </p>
            <Button
              variant="primary-gradient"
              size="sm"
              onClick={() => setLogDialogOpen(true)}
              className="text-xs font-semibold mt-2"
            >
              Log your first trade
            </Button>
          </div>
        ) : (
          <div className="border border-[var(--line)] rounded-xl overflow-x-auto bg-[var(--bg-1)]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--line)] bg-[var(--bg-2)]/60 text-[var(--text-2)] font-mono">
                  <th className="py-3 px-4 font-medium">Date</th>
                  <th className="py-3 px-4 font-medium">Setup</th>
                  <th className="py-3 px-4 font-medium">Outcome</th>
                  <th className="py-3 px-4 font-medium">R Multiple</th>
                  <th className="py-3 px-4 font-medium">Reflections / Notes</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {entries.map((entry) => {
                  const isWin = entry.outcome === "win";
                  const isLoss = entry.outcome === "loss";
                  const isBE = entry.outcome === "breakeven";

                  return (
                    <tr key={entry.id} className="hover:bg-[var(--bg-2)]/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-[var(--text-2)] whitespace-nowrap">
                        {entry.createdAt.slice(0, 10)}
                      </td>
                      <td className="py-3 px-4">
                        {entry.analysisId ? (
                          <Link
                            href={`/app/analysis/${entry.analysisId}`}
                            className="font-mono font-semibold text-[var(--candle)] hover:underline flex items-center gap-1"
                          >
                            <span>{entry.instrument || "Analysis"}</span>
                            <span className="text-[10px] text-[var(--text-2)]">({entry.timeframe})</span>
                          </Link>
                        ) : (
                          <span className="font-mono text-[var(--text-0)]">Discretionary</span>
                        )}
                        <span className="text-[10px] text-[var(--text-2)] block font-mono capitalize">
                          {entry.marketPack?.replace("-", " ") || "Other"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            isWin
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : isLoss
                              ? "bg-red-500/10 text-red-400 border border-red-500/30"
                              : isBE
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              : "bg-[var(--bg-3)] text-[var(--text-2)] border border-[var(--line)]"
                          }`}
                        >
                          {entry.outcome}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">
                        {entry.rMultiple !== null ? (
                          <span className={entry.rMultiple >= 0 ? "text-[var(--candle)]" : "text-[var(--bear)]"}>
                            {entry.rMultiple >= 0 ? "+" : ""}
                            {entry.rMultiple}R
                          </span>
                        ) : (
                          <span className="text-[var(--text-2)]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[var(--text-1)] max-w-xs break-words">
                        {entry.notes || <span className="text-[var(--text-2)]/40 italic">No notes</span>}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          disabled={deletingId === entry.id}
                          className="text-xs text-[var(--text-2)] hover:text-red-400 transition-colors p-1"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Trade Dialog */}
      <LogTradeDialog
        open={logDialogOpen}
        onOpenChange={setLogDialogOpen}
        onSuccess={fetchJournal}
      />
    </div>
  );
}
