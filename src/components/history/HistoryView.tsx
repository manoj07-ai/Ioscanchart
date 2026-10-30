"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { MARKET_PACK_LIST } from "@/config/markets";
import { LogTradeDialog } from "@/components/journal/LogTradeDialog";
import { BarChart3 } from "lucide-react";

export interface HistoryItem {
  id: string;
  instrument: string;
  marketPack: string;
  timeframe: string;
  status: "queued" | "reading" | "done" | "failed";
  createdAt: string;
  stance?: "long" | "short" | "wait";
  thumbnailUrl?: string | null;
  journal?: {
    id: string;
    outcome: "win" | "loss" | "breakeven" | "skipped";
    rMultiple: number | null;
  } | null;
}

export function HistoryView() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [marketFilter, setMarketFilter] = useState("all");
  const [stanceFilter, setStanceFilter] = useState("all");
  const [outcomeFilter, setOutcomeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Journal log dialog state
  const [logTarget, setLogTarget] = useState<HistoryItem | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        market: marketFilter,
        stance: stanceFilter,
        outcome: outcomeFilter,
        page: String(page),
        limit: "12",
      });

      const res = await fetch(`/api/analyses?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load history");

      const data = await res.json();
      setAnalyses(data.analyses || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  }, [search, marketFilter, stanceFilter, outcomeFilter, page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  async function handleDeleteConfirm() {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/analyses/${deleteTargetId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteTargetId(null);
        fetchHistory();
      }
    } catch (err) {
      console.error("Failed to delete analysis:", err);
    } finally {
      setDeleting(false);
    }
  }

  function formatTime(iso: string) {
    try {
      const date = new Date(iso);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(date);
    } catch {
      return iso;
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-0)]">
            Analysis History
          </h1>
          <p className="text-xs text-[var(--text-2)] mt-1">
            Browse, filter, and review your previous chart breakdowns and logged trade outcomes.
          </p>
        </div>

        <Link href="/app">
          <Button variant="primary-gradient" size="sm" className="font-semibold text-xs shrink-0">
            + New Analysis
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[var(--bg-1)] border border-[var(--line)] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Symbol Search */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[var(--text-2)]">Search Ticker</label>
            <Input
              placeholder="e.g. NIFTY, AAPL, BTC"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="text-xs h-9"
            />
          </div>

          {/* Market Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[var(--text-2)]">Market</label>
            <select
              value={marketFilter}
              onChange={(e) => {
                setMarketFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 text-xs bg-[var(--bg-2)] border border-[var(--line)] rounded-md px-2 text-[var(--text-0)] focus:border-[var(--candle)] focus:outline-hidden"
            >
              <option value="all">All Markets</option>
              {MARKET_PACK_LIST.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.displayName}
                </option>
              ))}
            </select>
          </div>

          {/* Stance Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[var(--text-2)]">Stance</label>
            <select
              value={stanceFilter}
              onChange={(e) => {
                setStanceFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 text-xs bg-[var(--bg-2)] border border-[var(--line)] rounded-md px-2 text-[var(--text-0)] focus:border-[var(--candle)] focus:outline-hidden"
            >
              <option value="all">All Stances</option>
              <option value="long">Long</option>
              <option value="short">Short</option>
              <option value="wait">Wait</option>
            </select>
          </div>

          {/* Journal Outcome Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[var(--text-2)]">Journal Outcome</label>
            <select
              value={outcomeFilter}
              onChange={(e) => {
                setOutcomeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 text-xs bg-[var(--bg-2)] border border-[var(--line)] rounded-md px-2 text-[var(--text-0)] focus:border-[var(--candle)] focus:outline-hidden"
            >
              <option value="all">All Entries</option>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
              <option value="breakeven">Breakeven</option>
              <option value="skipped">Skipped</option>
              <option value="unlogged">Unlogged only</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--text-2)] font-mono pt-1">
          <span>
            Showing {analyses.length} of {total} {total === 1 ? "record" : "records"}
          </span>
          {(search || marketFilter !== "all" || stanceFilter !== "all" || outcomeFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setMarketFilter("all");
                setStanceFilter("all");
                setOutcomeFilter("all");
                setPage(1);
              }}
              className="text-[var(--candle)] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of Analysis Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-4 animate-pulse"
            />
          ))}
        </div>
      ) : analyses.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--bg-1)] space-y-4">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-2)] text-[var(--candle)] mx-auto flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-[var(--candle)]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-[var(--text-0)]">No analyses found</h3>
            <p className="text-xs text-[var(--text-2)] max-w-sm mx-auto">
              {total === 0
                ? "You haven't analyzed any charts yet. Drop a screenshot in the workspace to get an objective trade plan."
                : "No analyses match the current filter criteria. Try resetting your search or filters."}
            </p>
          </div>
          <Link href="/app">
            <Button variant="primary-gradient" size="sm" className="font-semibold text-xs mt-2">
              Analyze your first chart
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyses.map((item) => {
            const isLong = item.stance === "long";
            const isShort = item.stance === "short";

            return (
              <div
                key={item.id}
                className="group relative rounded-xl border border-[var(--line)] bg-[var(--bg-1)] hover:border-[var(--line-strong)] hover:shadow-lg transition-all p-4 flex flex-col justify-between"
              >
                {/* Header Strip */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-sm font-bold text-[var(--text-0)]">
                          {item.instrument}
                        </span>
                        <span className="text-[11px] font-mono text-[var(--text-2)] px-1.5 py-0.5 rounded bg-[var(--bg-2)]">
                          {item.timeframe}
                        </span>
                      </div>
                      <div className="text-[10px] text-[var(--text-2)] font-mono capitalize mt-0.5">
                        {item.marketPack.replace("-", " ")}
                      </div>
                    </div>

                    {/* Stance Pill */}
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                          isLong
                            ? "bg-[var(--candle)]/15 text-[var(--candle)] border border-[var(--candle)]/30"
                            : isShort
                            ? "bg-[var(--bear)]/15 text-[var(--bear)] border border-[var(--bear)]/30"
                            : "bg-[var(--bg-3)] text-[var(--text-2)] border border-[var(--line)]"
                        }`}
                      >
                        {item.stance ? item.stance.toUpperCase() : "WAIT"}
                      </span>
                    </div>
                  </div>

                  {/* Created timestamp */}
                  <div className="text-[11px] font-mono text-[var(--text-2)] mt-3">
                    {formatTime(item.createdAt)}
                  </div>
                </div>

                {/* Outcome Chip & Action Controls */}
                <div className="pt-4 mt-4 border-t border-[var(--line)] flex items-center justify-between gap-2">
                  {/* Journal Outcome Chip */}
                  {item.journal ? (
                    <div
                      className={`inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                        item.journal.outcome === "win"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : item.journal.outcome === "loss"
                          ? "bg-red-500/10 text-red-400 border border-red-500/30"
                          : item.journal.outcome === "breakeven"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : "bg-[var(--bg-2)] text-[var(--text-2)] border border-[var(--line)]"
                      }`}
                    >
                      <span className="uppercase">{item.journal.outcome}</span>
                      {item.journal.rMultiple !== null && (
                        <span>
                          {item.journal.rMultiple >= 0 ? "+" : ""}
                          {item.journal.rMultiple}R
                        </span>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setLogTarget(item)}
                      className="text-[11px] font-mono text-[var(--text-2)] hover:text-[var(--candle)] transition-colors cursor-pointer"
                    >
                      + Add to journal
                    </button>
                  )}

                  {/* Right side: View & Delete */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/app/analysis/${item.id}`)}
                      className="text-xs h-7 px-2"
                    >
                      View →
                    </Button>
                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(item.id)}
                      className="text-[var(--text-2)] hover:text-red-400 p-1 rounded transition-colors"
                      title="Delete analysis"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="text-xs"
          >
            ← Previous
          </Button>
          <span className="text-xs font-mono text-[var(--text-2)] px-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="text-xs"
          >
            Next →
          </Button>
        </div>
      )}

      {/* Soft-delete confirmation dialog */}
      <Dialog open={Boolean(deleteTargetId)} onOpenChange={() => setDeleteTargetId(null)}>
        <DialogContent className="max-w-md bg-[var(--bg-1)] border-[var(--line)]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[var(--text-0)]">
              Remove Analysis from History?
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--text-2)] leading-relaxed">
              This analysis will be hidden from your history immediately. Stored chart images are permanently deleted after 30 days.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              variant="ghost"
              size="sm"
              disabled={deleting}
              onClick={() => setDeleteTargetId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={deleting}
              onClick={handleDeleteConfirm}
            >
              {deleting ? "Deleting..." : "Delete Analysis"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add to Journal Dialog */}
      {logTarget && (
        <LogTradeDialog
          open={Boolean(logTarget)}
          onOpenChange={(open) => !open && setLogTarget(null)}
          analysisId={logTarget.id}
          instrument={logTarget.instrument}
          market={logTarget.marketPack}
          timeframe={logTarget.timeframe}
          onSuccess={() => {
            setLogTarget(null);
            fetchHistory();
          }}
        />
      )}
    </div>
  );
}
