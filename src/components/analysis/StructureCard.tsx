import React from "react";
import { BiasPill } from "@/components/analysis/primitives/BiasPill";

interface Indicator {
  name: string;
  reading: string;
  implication: string;
  bias: "bull" | "bear" | "neutral";
}

interface StructureCardProps {
  structure: {
    trend: "up" | "down" | "range" | "transition";
    phase: string;
    summary: string;
    keyObservations: string[];
  };
  indicators?: Indicator[];
}

export function StructureCard({ structure, indicators = [] }: StructureCardProps) {
  if (!structure) return null;

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-5 space-y-4">
      <div>
        <h2 className="text-sm font-bold text-[var(--text-0)] tracking-tight">
          Market Structure & Indicator Confluence
        </h2>
        <p className="text-xs text-[var(--text-2)]">
          Macro trend classification and indicator momentum readings
        </p>
      </div>

      {/* Structure summary */}
      <div className="p-3.5 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] space-y-2 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-[var(--text-2)]">Trend:</span>
            <span className="font-bold uppercase text-[var(--candle)]">
              {structure.trend}
            </span>
          </div>
          <span className="text-[var(--text-2)]">·</span>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-[var(--text-2)]">Phase:</span>
            <span className="font-semibold text-[var(--text-0)] capitalize">
              {structure.phase}
            </span>
          </div>
        </div>
        <p className="text-[var(--text-1)] leading-relaxed text-xs">
          {structure.summary}
        </p>
      </div>

      {/* Key observations bullet points */}
      {structure.keyObservations?.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-2)]">
            Key Structural Observations
          </span>
          <ul className="space-y-1 text-xs text-[var(--text-1)] list-disc pl-4">
            {structure.keyObservations.map((obs, idx) => (
              <li key={idx} className="leading-relaxed">
                {obs}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Indicators table/list */}
      {indicators.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[var(--line)]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-2)]">
            Visible Indicators ({indicators.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {indicators.map((ind, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded bg-[var(--bg-2)] border border-[var(--line)] text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--text-0)]">{ind.name}</span>
                  <BiasPill bias={ind.bias} size="sm" />
                </div>
                <div className="font-mono text-[11px] text-[var(--text-2)]">
                  Reading: <span className="text-[var(--text-1)] font-semibold">{ind.reading}</span>
                </div>
                <div className="text-[11px] text-[var(--text-2)] leading-tight">
                  {ind.implication}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
