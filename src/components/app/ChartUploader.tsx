"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { GuidedTour } from "@/components/app/GuidedTour";
import { EmptyExplainer } from "@/components/app/EmptyExplainer";
import { StagedProgress } from "@/components/app/StagedProgress";
import { validateTvLink } from "@/server/ai/schema";
import { MARKET_PACK_LIST } from "@/config/markets";
import { cn } from "@/lib/utils/cn";

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
                  ✕
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
      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <input
            type="url"
            value={tvLink}
            onChange={handleTvLinkChange}
            placeholder="Or paste TradingView link (https://www.tradingview.com/x/...)"
            className={cn(
              "w-full h-10 px-3.5 text-xs bg-[var(--bg-1)] border rounded-lg text-[var(--text-0)] transition-colors focus:outline-hidden",
              tvLinkValid === true
                ? "border-[var(--candle)] focus:border-[var(--candle)]"
                : tvLinkValid === false
                ? "border-[var(--bear)] focus:border-[var(--bear)]"
                : "border-[var(--line)] focus:border-[var(--candle)]"
            )}
          />
          {tvLink && (
            <span className="absolute right-3 top-2.5 text-xs">
              {tvLinkValid === true ? (
                <span className="text-[var(--candle)] font-bold">✓ Valid TV link</span>
              ) : tvLinkValid === false ? (
                <span className="text-[var(--bear)] font-bold">✕ Invalid URL</span>
              ) : null}
            </span>
          )}
        </div>
      </div>

      {/* Collapsible Fine-Tune Controls */}
      <div className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--bg-1)] overflow-hidden">
        <button
          type="button"
          onClick={() => setShowFineTune(!showFineTune)}
          className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-[var(--text-0)] hover:bg-[var(--bg-2)] transition-colors"
        >
          <span className="flex items-center gap-2">
            <span>⚙ Fine-tune analysis (optional)</span>
            <span className="text-[11px] text-[var(--text-2)] font-normal">
              Market pack, account size & risk %
            </span>
          </span>
          <span className={cn("transition-transform duration-200", showFineTune && "rotate-180")}>
            ▼
          </span>
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
          <span className="text-[var(--candle)]">💡</span>
          <span>Tip: Keep the ticker, timeframe, and price scale visible for the clearest and most accurate analysis.</span>
        </p>
        <p className="text-[11px] text-[var(--text-2)]">
          Supported: US Equities, Forex, Crypto, Commodities, Global Indices, and{" "}
          <strong className="text-[var(--text-1)]">India indices & options (Beta)</strong>.
        </p>
      </div>

      {/* Action CTA */}
      <div className="mt-8 flex items-center justify-end gap-3">
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

      {/* 3-Step Explainer for empty state / guidance */}
      <EmptyExplainer />

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

      {/* Modal: Upgrade Plan Paywall */}
      <Dialog
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Analysis Credits Exhausted</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-xs text-[var(--text-1)] leading-relaxed">
              You have used all available analysis credits on your current plan. Upgrade to the Monthly or Lifetime plan for unlimited chart breakdowns and all 8 market packs.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUpgradeModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="primary-gradient"
                size="sm"
                onClick={() => router.push("/app/upgrade")}
              >
                View Plans & Upgrade
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
