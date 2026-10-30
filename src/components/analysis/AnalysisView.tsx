"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ImageViewer } from "@/components/analysis/ImageViewer";
import { AnalysisHeaderStrip } from "@/components/analysis/AnalysisHeaderStrip";
import { PlanCardHero } from "@/components/analysis/PlanCardHero";
import { ScenariosCard } from "@/components/analysis/ScenariosCard";
import { KeyLevelsTable } from "@/components/analysis/KeyLevelsTable";
import { StructureCard } from "@/components/analysis/StructureCard";
import { OptionsView } from "@/components/analysis/OptionsView";
import { LogTradeDialog } from "@/components/journal/LogTradeDialog";
import { SHORT_DISCLAIMER } from "@/config/legal";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { AlertTriangle } from "lucide-react";
import type { AnalysisResult } from "@/server/ai/schema";

interface AnalysisViewProps {
  analysisId: string;
}

export function AnalysisView({ analysisId }: AnalysisViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [journalOpen, setJournalOpen] = useState(false);
  const [data, setData] = useState<{
    id: string;
    status: string;
    result?: AnalysisResult;
    error?: string;
  } | null>(null);

  useEffect(() => {
    async function fetchResult() {
      try {
        const res = await fetch(`/api/analyses/${analysisId}`);
        if (res.status === 404) {
          setError("Analysis not found or unauthorized access.");
          setLoading(false);
          return;
        }
        if (!res.ok) {
          throw new Error(`Failed to load analysis (Status: ${res.status})`);
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analysis");
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [analysisId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-5 h-[450px] rounded-xl" />
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-[var(--amber)] mx-auto" />
        <h1 className="text-lg font-bold text-[var(--text-0)]">
          {error || "Unable to display analysis"}
        </h1>
        <p className="text-xs text-[var(--text-2)]">
          The requested technical breakdown could not be retrieved.
        </p>
        <Link href="/app">
          <Button variant="secondary" size="sm">
            ← Back to Uploader
          </Button>
        </Link>
      </div>
    );
  }

  const result = data.result;
  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-4xl">⏳</div>
        <h1 className="text-lg font-bold text-[var(--text-0)]">
          Analysis is {data.status}
        </h1>
        <p className="text-xs text-[var(--text-2)]">
          Your chart is being processed. Please refresh in a few moments.
        </p>
        <Button size="sm" onClick={() => window.location.reload()}>
          Refresh Status
        </Button>
      </div>
    );
  }

  // Determine overall bias
  const primaryScenario = result.scenarios?.[0];
  const overallBias =
    result.plan.stance === "long"
      ? "bull"
      : result.plan.stance === "short"
      ? "bear"
      : primaryScenario?.bias ?? "neutral";

  // Build image object list
  const images = [
    {
      url: `/api/placeholder/chart.png`,
      timeframe: result.instrument.timeframe,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Low data-quality notification banner if score < 50 */}
      {result.dataQuality && result.dataQuality.score < 50 && (
        <div className="rounded-xl border border-[var(--amber)]/40 bg-[var(--amber)]/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-[var(--amber)]">
              Low Image Quality Warning ({result.dataQuality.score}/100)
            </div>
            <p className="text-[var(--text-1)] text-[11px] mt-0.5">
              {result.dataQuality.userActionNeeded ||
                "Price levels or indicator axes are unclear. No credits were consumed."}
            </p>
          </div>
          <Link href="/app">
            <Button variant="secondary" size="sm" className="shrink-0 text-xs">
              Try again with a better screenshot
            </Button>
          </Link>
        </div>
      )}

      {/* 1. Header Strip */}
      <AnalysisHeaderStrip
        instrument={result.instrument}
        overallBias={overallBias}
        dataQuality={result.dataQuality}
      />

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Zoomable Image Viewer with Levels Drawer */}
        <div className="lg:col-span-5 w-full">
          <ImageViewer images={images} levels={result.levels} />
        </div>

        {/* Right Column: Scrollable cards */}
        <div className="lg:col-span-7 space-y-6">
          {/* 2. Hero Trade Plan Card */}
          <PlanCardHero
            plan={result.plan}
            symbol={result.instrument.symbol}
            timeframe={result.instrument.timeframe}
            onAddToJournal={() => setJournalOpen(true)}
          />

          {/* 3. Scenarios Card */}
          <ScenariosCard scenarios={result.scenarios} />

          {/* 4. Key Levels Table */}
          <KeyLevelsTable
            levels={result.levels}
            lastPrice={result.instrument.lastPrice}
          />

          {/* 5. Structure & Indicators Card */}
          <StructureCard
            structure={result.structure}
            indicators={result.indicators}
          />

          {/* 6. Indian Options & OI Payoff View (if options present) */}
          {result.options && <OptionsView data={result.options} />}

          {/* 7. Follow-up Ask Box (Stub) */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-4 flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-semibold text-[var(--text-0)] block">
                Ask about this analysis
              </span>
              <span className="text-[11px] text-[var(--text-2)]">
                Interactive follow-up questioning with full chart memory
              </span>
            </div>
            <Button variant="ghost" size="sm" disabled className="text-xs">
              Coming soon
            </Button>
          </div>

          {/* 8. Disclaimer Footer */}
          <div className="pt-4 border-t border-[var(--line)] text-center sm:text-left text-[11px] text-[var(--text-2)] leading-relaxed">
            <p>{SHORT_DISCLAIMER}</p>
          </div>
        </div>
      </div>

      <LogTradeDialog
        open={journalOpen}
        onOpenChange={setJournalOpen}
        analysisId={analysisId}
        instrument={result.instrument.symbol}
        market={result.instrument.market}
        timeframe={result.instrument.timeframe}
        plan={result.plan}
      />
    </div>
  );
}
