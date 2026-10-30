"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Check, Settings, Lightbulb, BarChart3, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { GuidedTour } from "@/components/app/GuidedTour";
import { EmptyExplainer } from "@/components/app/EmptyExplainer";
import { StagedProgress } from "@/components/app/StagedProgress";
import { UpgradeDialog } from "@/components/billing/UpgradeDialog";
import { TradingViewLogo } from "@/components/brand/TradingViewLogo";
import { validateTvLink } from "@/server/ai/schema";
import { MARKET_PACK_LIST } from "@/config/markets";
import { cn } from "@/lib/utils/cn";

interface RecentAnalysisItem {
  id: string;
  instrument: string;
  timeframe: string;
  stance?: "long" | "short" | "wait";
  createdAt: string;
}

interface UploadedItem {
  id: string;
  file: File;
  previewUrl: string;
  timeframe: string;
}

const TIMEFRAME_SUGGESTIONS = ["1D", "4H", "1H", "15m", "5m", "Weekly"];

export function ChartUploader() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload inputs
  const [images, setImages] = useState<UploadedItem[]>([]);
  const [tvLink, setTvLink] = useState("");
  const [tvLinkValid, setTvLinkValid] = useState<boolean | null>(null);

  // Fine-tune controls
  const [showFineTune, setShowFineTune] = useState(false);
  const [marketHint, setMarketHint] = useState<string>("auto");
  const [tradingStyle, setTradingStyle] = useState<string>(() => {
    if (typeof window === "undefined") return "swing";
    try {
      return localStorage.getItem("ioscan_style") || "swing";
    } catch {
      return "swing";
    }
  });
  const [accountSize, setAccountSize] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem("ioscan_acc_size") || "";
    } catch {
      return "";
    }
  });
  const [riskPercent, setRiskPercent] = useState<string>(() => {
    if (typeof window === "undefined") return "1";
    try {
      return localStorage.getItem("ioscan_risk_pct") || "1";
    } catch {
      return "1";
    }
  });

  // Interaction & submission states
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<"queued" | "reading" | "done" | "failed">("queued");

  // Error modals & alerts
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unreadableModalOpen, setUnreadableModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [paywallReason, setPaywallReason] = useState<"NO_CREDITS" | "DAILY_CAP">("NO_CREDITS");

  // Recent analyses & delete state
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysisItem[]>([]);
  const [itemToDelete, setItemToDelete] = useState<RecentAnalysisItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadRecent = useCallback(async () => {
    try {
      const res = await fetch("/api/analyses?limit=4");
      if (res.ok) {
        const data = await res.json();
        if (data.analyses) setRecentAnalyses(data.analyses.slice(0, 4));
      }
    } catch (err) {
      console.error("Failed to fetch recent analyses:", err);
    }
  }, []);

  useEffect(() => {
    loadRecent();
    const handleSync = () => loadRecent();
    window.addEventListener("analysis-created", handleSync);
    window.addEventListener("analysis-deleted", handleSync);
    return () => {
      window.removeEventListener("analysis-created", handleSync);
      window.removeEventListener("analysis-deleted", handleSync);
    };
  }, [loadRecent]);

  async function handleConfirmDelete() {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/analyses/${itemToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setRecentAnalyses((prev) => prev.filter((a) => a.id !== itemToDelete.id));
        window.dispatchEvent(
          new CustomEvent("analysis-deleted", { detail: { id: itemToDelete.id } })
        );
      }
    } catch (err) {
      console.error("Failed to delete recent analysis:", err);
    } finally {
      setDeleting(false);
      setItemToDelete(null);
      setDeleteDialogOpen(false);
    }
  }

  // Save account prefs on change
  const handleAccountSizeChange = (val: string) => {
    setAccountSize(val);
    try {
      localStorage.setItem("ioscan_acc_size", val);
    } catch {
      // Ignore
    }
  };

  const handleRiskPercentChange = (val: string) => {
    setRiskPercent(val);
    try {
      localStorage.setItem("ioscan_risk_pct", val);
    } catch {
      // Ignore
    }
  };

  const handleTradingStyleChange = (val: string) => {
    setTradingStyle(val);
    try {
      localStorage.setItem("ioscan_style", val);
    } catch {
      // Ignore
    }
  };

  // Add files
  const addFiles = useCallback((files: FileList | File[]) => {
    const list = Array.from(files);
    const validFiles: UploadedItem[] = [];

    for (const file of list) {
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
        setErrorMessage("Please upload PNG, JPG, or WebP images only.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File exceeds 10MB maximum limit.");
        return;
      }

      // Default suggested timeframes: first 1D, second 1H, third 5m
      const nextIdx = images.length + validFiles.length;
      const defaultTf = nextIdx === 0 ? "1D" : nextIdx === 1 ? "1H" : "5m";

      validFiles.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
        timeframe: defaultTf,
      });
    }

    setImages((prev) => {
      const combined = [...prev, ...validFiles];
      if (combined.length > 3) {
        setErrorMessage("Maximum 3 chart images allowed per multi-timeframe analysis.");
        return combined.slice(0, 3);
      }
      return combined;
    });
    setErrorMessage(null);
  }, [images.length]);

  // Remove image
  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  // Update timeframe label
  const updateTimeframe = (id: string, tf: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, timeframe: tf } : img))
    );
  };

  // TV Link validation
  const handleTvLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setTvLink(val);
    if (!val) {
      setTvLinkValid(null);
      return;
    }
    setTvLinkValid(validateTvLink(val));
  };

  // Drag & drop handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  // Paste from clipboard handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData?.items) return;
      const files: File[] = [];
      for (const item of Array.from(e.clipboardData.items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) {
        addFiles(files);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [addFiles]);

  // Submit analysis
  const handleStartAnalysis = async () => {
    if (images.length === 0 && (!tvLink || !tvLinkValid)) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      images.forEach((img) => {
        formData.append("images", img.file);
      });
      if (marketHint && marketHint !== "auto") {
        formData.append("marketHint", marketHint);
      }
      if (tvLink) {
        formData.append("tvLink", tvLink);
      }
      if (accountSize) {
        formData.append("accountSize", accountSize);
      }
      if (riskPercent) {
        formData.append("riskPercent", riskPercent);
      }

      const res = await fetch("/api/analyses", {
        method: "POST",
        body: formData,
      });

      if (res.status === 402) {
        setPaywallReason("NO_CREDITS");
        setUpgradeModalOpen(true);
        setSubmitting(false);
        return;
      }

      if (res.status === 429) {
        setPaywallReason("DAILY_CAP");
        setUpgradeModalOpen(true);
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Upload failed with status ${res.status}`);
      }

      const data = await res.json();
      setActiveAnalysisId(data.analysisId);
      setAnalysisStatus("reading");

      // Notify sidebar to refresh recent list
      window.dispatchEvent(new Event("analysis-created"));

      // Start polling status
      pollAnalysis(data.analysisId);
    } catch (err) {
      console.error("Start analysis error:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to start analysis");
      setSubmitting(false);
    }
  };

  // Poll analysis job
  const pollAnalysis = useCallback(
    (id: string) => {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/analyses/${id}`);
          if (!res.ok) return;

          const data = await res.json();
          setAnalysisStatus(data.status);

          if (data.status === "done") {
            clearInterval(interval);
            // Check if chart was flagged as unreadable
            if (data.result?.dataQuality && !data.result.dataQuality.readable) {
              setSubmitting(false);
              setUnreadableModalOpen(true);
            } else {
              router.push(`/app/analysis/${id}`);
            }
          } else if (data.status === "failed") {
            clearInterval(interval);
            setSubmitting(false);
            setErrorMessage(data.error || "Analysis failed to complete. Please try again.");
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);
    },
    [router]
  );

  const canSubmit = images.length > 0 || (tvLink.length > 0 && tvLinkValid === true);

  if (submitting && activeAnalysisId) {
    return (
      <StagedProgress
        status={analysisStatus}
        onCancel={() => {
          setSubmitting(false);
          setActiveAnalysisId(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Guided Tour banner */}
      <GuidedTour />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-0)]">
          Analyze a chart
        </h1>
        <p className="text-xs text-[var(--text-2)] mt-1">
          Drop any chart screenshot from any broker or platform. We map the key levels, scenarios, and trade plan.
        </p>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-6 rounded-lg border border-[var(--bear)]/40 bg-[var(--bear)]/10 p-3.5 text-xs text-[var(--bear)] flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-[var(--bear)] hover:underline ml-3 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-200",
          "focus-visible:outline-2 focus-visible:outline-[var(--candle)]",
          isDragging
            ? "border-[var(--candle)] bg-[var(--candle)]/5 scale-[1.01]"
            : "border-[var(--line)] bg-[var(--bg-1)] hover:border-[var(--line)]/80 hover:bg-[var(--bg-1)]/80"
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
          }}
        />

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-2)] border border-[var(--line)] text-[var(--candle)] mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <p className="text-sm font-semibold text-[var(--text-0)]">
          Drop your chart here, click to browse, or paste with <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-2)] text-[11px] font-mono border border-[var(--line)]">Ctrl+V</kbd>
        </p>
        <p className="text-xs text-[var(--text-2)] mt-1">
          PNG, JPG, WebP up to 10MB · Support up to 3 timeframes (e.g. Daily + 1H + 15m)
        </p>
      </div>

      {/* Thumbnails list (No layout shift) */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative rounded-lg border border-[var(--line)] bg-[var(--bg-1)] p-2.5 flex flex-col gap-2"
            >
              <div className="relative aspect-video w-full rounded overflow-hidden bg-[var(--bg-2)]">
                <Image
                  src={img.previewUrl}
                  alt="Chart preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center text-xs transition-colors"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center justify-between gap-2">
                <label className="text-[11px] text-[var(--text-2)] font-medium">Timeframe:</label>
                <div className="flex items-center gap-1">
                  <select
                    value={img.timeframe}
                    onChange={(e) => updateTimeframe(img.id, e.target.value)}
                    className="h-7 text-xs bg-[var(--bg-2)] border border-[var(--line)] rounded px-2 text-[var(--text-0)] focus:border-[var(--candle)] focus:outline-hidden"
                  >
                    {TIMEFRAME_SUGGESTIONS.map((tf) => (
                      <option key={tf} value={tf}>
                        {tf}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TradingView share link import */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-0)]">
          <TradingViewLogo className="w-4 h-4 text-[var(--text-1)]" />
          <span>TradingView chart link</span>
        </div>

        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-2)]">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>

          <input
            type="url"
            value={tvLink}
            onChange={handleTvLinkChange}
            placeholder="https://www.tradingview.com/x/..."
            className={cn(
              "w-full h-11 pl-10 pr-24 text-xs font-mono bg-[var(--bg-1)] border rounded-lg text-[var(--text-0)] transition-colors focus:outline-hidden",
              tvLinkValid === true
                ? "border-[var(--candle)] focus:border-[var(--candle)] ring-1 ring-[var(--candle)]/30"
                : tvLinkValid === false
                ? "border-[var(--bear)] focus:border-[var(--bear)] ring-1 ring-[var(--bear)]/30"
                : "border-[var(--line)] focus:border-[var(--candle)]"
            )}
          />

          {tvLink && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono">
              {tvLinkValid === true ? (
                <span className="text-[var(--candle)] font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Valid</span>
                </span>
              ) : tvLinkValid === false ? (
                <span className="text-[var(--bear)] font-semibold flex items-center gap-1">
                  <X className="w-3.5 h-3.5" />
                  <span>Invalid URL</span>
                </span>
              ) : null}
            </span>
          )}
        </div>

        <p className="text-[11px] text-[var(--text-2)]">
          Use the camera share link from TradingView to import your chart.
        </p>
      </div>

      {/* Collapsible Fine-Tune Controls */}
      <div className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--bg-1)] overflow-hidden">
        <button
          type="button"
          onClick={() => setShowFineTune(!showFineTune)}
          className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-[var(--text-0)] hover:bg-[var(--bg-2)] transition-colors"
        >
          <span className="flex items-center gap-2">
            <Settings className="w-3.5 h-3.5 text-[var(--text-2)]" />
            <span>Fine-tune analysis (optional)</span>
            <span className="text-[11px] text-[var(--text-2)] font-normal">
              Market pack, account size & risk %
            </span>
          </span>
          <ChevronDown
            className={cn("w-4 h-4 text-[var(--text-2)] transition-transform duration-200", showFineTune && "rotate-180")}
          />
        </button>

        {showFineTune && (
          <div className="p-4 border-t border-[var(--line)] bg-[var(--bg-0)]/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Market Pack */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[var(--text-2)]">Market</label>
              <select
                value={marketHint}
                onChange={(e) => setMarketHint(e.target.value)}
                className="w-full h-9 text-xs bg-[var(--bg-1)] border border-[var(--line)] rounded-md px-2 text-[var(--text-0)] focus:border-[var(--candle)] focus:outline-hidden"
              >
                <option value="auto">Auto-detect from ticker</option>
                {MARKET_PACK_LIST.map((pack) => (
                  <option key={pack.id} value={pack.id}>
                    {pack.displayName} {pack.coverage === "beta" ? "(Beta)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Trading Style */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[var(--text-2)]">Style</label>
              <select
                value={tradingStyle}
                onChange={(e) => handleTradingStyleChange(e.target.value)}
                className="w-full h-9 text-xs bg-[var(--bg-1)] border border-[var(--line)] rounded-md px-2 text-[var(--text-0)] focus:border-[var(--candle)] focus:outline-hidden"
              >
                <option value="scalp">Scalp (1m - 5m)</option>
                <option value="intraday">Intraday (15m - 1H)</option>
                <option value="swing">Swing (4H - Daily)</option>
                <option value="positional">Positional (Daily - Weekly)</option>
              </select>
            </div>

            {/* Account Size */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[var(--text-2)]">Account Size (USD/INR)</label>
              <input
                type="number"
                placeholder="e.g. 10000"
                value={accountSize}
                onChange={(e) => handleAccountSizeChange(e.target.value)}
                className="w-full h-9 text-xs bg-[var(--bg-1)] border border-[var(--line)] rounded-md px-3 text-[var(--text-0)] focus:border-[var(--candle)] focus:outline-hidden"
              />
            </div>

            {/* Risk % */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[var(--text-2)]">Risk % per trade</label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                max="10"
                placeholder="1.0"
                value={riskPercent}
                onChange={(e) => handleRiskPercentChange(e.target.value)}
                className="w-full h-9 text-xs bg-[var(--bg-1)] border border-[var(--line)] rounded-md px-3 text-[var(--text-0)] focus:border-[var(--candle)] focus:outline-hidden"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tip & Coverage lines */}
      <div className="mt-4 space-y-1.5">
        <p className="text-[11px] text-[var(--text-2)] flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-[var(--candle)] shrink-0" />
          <span>Tip: Keep the ticker, timeframe, and price scale visible for the clearest and most accurate analysis.</span>
        </p>
        <p className="text-[11px] text-[var(--text-2)]">
          Supported: US Equities, Forex, Crypto, Commodities, Global Indices, and{" "}
          <strong className="text-[var(--text-1)]">India indices & options (Beta)</strong>.
        </p>
      </div>

      {/* Action CTA */}
      <div className="mt-6 flex items-center justify-end gap-3">
        <Button
          variant="primary-gradient"
          size="lg"
          disabled={!canSubmit || submitting}
          onClick={handleStartAnalysis}
          className="w-full sm:w-auto px-8 font-semibold shadow-md"
        >
          {submitting ? "Starting..." : "Start analysis"}
        </Button>
      </div>

      {/* Recent Analyses Section with Delete Option */}
      {recentAnalyses.length > 0 && (
        <div className="mt-10 pt-8 border-t border-[var(--line)] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--text-0)] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[var(--candle)]" />
              <span>Recent Analyses</span>
            </h2>
            <Link
              href="/app/history"
              className="text-xs text-[var(--candle)] hover:underline font-medium"
            >
              View all history →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentAnalyses.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] hover:border-[var(--line-strong)] transition-all flex items-center justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[var(--text-0)] truncate">
                      {item.instrument}
                    </span>
                    <span className="text-[10px] text-[var(--text-2)] uppercase font-mono px-1.5 py-0.5 rounded bg-[var(--bg-2)] border border-[var(--line)]">
                      {item.timeframe}
                    </span>
                    {item.stance && (
                      <span
                        className={cn(
                          "text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase",
                          item.stance === "long"
                            ? "bg-[var(--candle)]/15 text-[var(--candle)]"
                            : item.stance === "short"
                            ? "bg-[var(--bear)]/15 text-[var(--bear)]"
                            : "bg-[var(--bg-3)] text-[var(--text-2)]"
                        )}
                      >
                        {item.stance}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[var(--text-2)]">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/app/analysis/${item.id}`}>
                    <Button variant="secondary" size="sm" className="text-xs h-8 px-3">
                      Open →
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setItemToDelete(item);
                      setDeleteDialogOpen(true);
                    }}
                    className="text-xs h-8 w-8 p-0 text-[var(--text-2)] hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                    title="Delete chart analysis"
                    aria-label={`Delete ${item.instrument}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3-Step Explainer for empty state / guidance */}
      <EmptyExplainer />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chart Analysis?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong className="text-[var(--text-0)] font-mono">
                {itemToDelete?.instrument} ({itemToDelete?.timeframe})
              </strong>{" "}
              from your analysis history?
            </DialogDescription>
          </DialogHeader>

          <p className="text-xs text-[var(--text-2)]">
            This action removes the analysis and its levels from your active workspace.
          </p>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setDeleteDialogOpen(false);
                setItemToDelete(null);
              }}
              disabled={deleting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="text-xs font-semibold"
            >
              {deleting ? "Deleting..." : "Delete Analysis"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Unreadable Image feedback */}
      <Dialog
        open={unreadableModalOpen}
        onOpenChange={setUnreadableModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unreadable Chart Screenshot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-xs text-[var(--text-1)] leading-relaxed">
              Our vision engine could not clearly identify the price scale or candlestick patterns on your chart.
              <strong className="text-[var(--text-0)] block mt-1">
                No credits have been deducted from your account.
              </strong>
            </p>

            <div className="rounded-lg border border-[var(--line)] bg-[var(--bg-2)] p-3 text-xs space-y-2">
              <div className="font-semibold text-[var(--text-0)]">What makes a good screenshot?</div>
              <ul className="list-disc pl-4 space-y-1 text-[var(--text-2)] text-[11px]">
                <li>The vertical price axis on the right side must be visible</li>
                <li>The timeframe and ticker name (top left) should be legible</li>
                <li>Avoid severe image compression or cropped price candles</li>
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setUnreadableModalOpen(false)}
              >
                Try another screenshot
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Upgrade Plan Paywall (Prompt 08) */}
      <UpgradeDialog
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        reason={paywallReason}
      />
    </div>
  );
}
