"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface StagedProgressProps {
  status: "queued" | "reading" | "done" | "failed";
  onCancel: () => void;
}

const STAGES = [
  { id: "reading", label: "Reading your chart", desc: "Verifying price scale, ticker and indicators" },
  { id: "mapping", label: "Mapping key levels", desc: "Detecting support, resistance and liquidity zones" },
  { id: "building", label: "Building scenarios", desc: "Modeling bullish and bearish market paths" },
  { id: "writing", label: "Writing your plan", desc: "Calculating precise entries, stops, and targets" },
];

export function StagedProgress({ status, onCancel }: StagedProgressProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine active stage based on elapsed time if backend is queued/reading
  let currentStageIndex = 0;
  if (status === "reading") {
    if (elapsedSeconds < 6) currentStageIndex = 0;
    else if (elapsedSeconds < 14) currentStageIndex = 1;
    else if (elapsedSeconds < 24) currentStageIndex = 2;
    else currentStageIndex = 3;
  } else if (status === "done") {
    currentStageIndex = 3;
  }

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-8 shadow-xl max-w-xl mx-auto my-12 text-center animate-in fade-in zoom-in-95 duration-200">
      {/* Animated Candle Loader */}
      <div className="flex items-center justify-center gap-2 mb-6 h-12">
        <div className="w-2 bg-[var(--candle)] rounded-xs animate-bounce [animation-delay:-0.3s] h-8" />
        <div className="w-2 bg-[var(--candle-hi)] rounded-xs animate-bounce [animation-delay:-0.15s] h-11" />
        <div className="w-2 bg-[var(--candle)] rounded-xs animate-bounce [animation-delay:-0.45s] h-6" />
        <div className="w-2 bg-[var(--bear)] rounded-xs animate-bounce h-10" />
      </div>

      <h2 className="text-lg font-semibold text-[var(--text-0)] mb-1">
        Analyzing your chart
      </h2>
      <p className="text-xs text-[var(--text-2)] mb-6">
        Usually takes 15–40 seconds. Elapsed: <span className="font-mono text-[var(--text-1)]">{elapsedSeconds}s</span>
      </p>

      {/* 4 Stages List */}
      <div className="space-y-3 text-left max-w-md mx-auto mb-8">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex || status === "done";
          const isCurrent = idx === currentStageIndex && status !== "done";

          return (
            <div
              key={stage.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                isCurrent
                  ? "border-[var(--candle)]/50 bg-[var(--candle)]/5"
                  : isDone
                  ? "border-[var(--line)] bg-[var(--bg-2)]/40 opacity-80"
                  : "border-transparent opacity-40"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--candle)]/20 text-[var(--candle)] text-xs font-bold">
                    ✓
                  </span>
                ) : isCurrent ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--candle)]/30 text-[var(--candle)] text-xs animate-pulse">
                    ●
                  </span>
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--bg-3)] text-[var(--text-2)] text-xs font-mono">
                    {idx + 1}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[var(--text-0)] flex items-center gap-2">
                  <span>{stage.label}</span>
                  {isCurrent && (
                    <span className="text-[10px] text-[var(--candle)] font-normal animate-pulse">
                      Processing...
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[var(--text-2)] truncate">
                  {stage.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onCancel}
        className="text-xs text-[var(--text-2)] hover:text-[var(--text-0)]"
      >
        Cancel analysis
      </Button>
    </div>
  );
}
