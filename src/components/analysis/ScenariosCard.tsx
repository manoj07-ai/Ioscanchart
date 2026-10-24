import React from "react";
import { ConfidenceMeter } from "@/components/analysis/primitives/ConfidenceMeter";
import { BiasPill } from "@/components/analysis/primitives/BiasPill";

interface Scenario {
  name: string;
  bias: "bull" | "bear" | "neutral";
  trigger: string;
  path: string;
  targets: number[];
  modelConfidence: "low" | "medium" | "high";
  confidenceNote: string;
}

interface ScenariosCardProps {
  scenarios: Scenario[];
}

export function ScenariosCard({ scenarios }: ScenariosCardProps) {
  if (!scenarios || scenarios.length === 0) return null;

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[var(--text-0)] tracking-tight">
            Scenarios & Market Pathways
          </h2>
          <p className="text-xs text-[var(--text-2)]">
            Divergent bull/bear setups with explicit activation triggers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((sc, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-[var(--line)] bg-[var(--bg-2)] p-4 flex flex-col justify-between space-y-3"
          >
            {/* Scenario Header */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-xs text-[var(--text-0)]">
                {sc.name}
              </span>
              <BiasPill bias={sc.bias} size="sm" />
            </div>

            {/* Trigger & Path */}
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded bg-[var(--bg-0)]/70 border border-[var(--line)]">
                <span className="text-[10px] font-mono uppercase text-[var(--text-2)] block">
                  Activation Trigger:
                </span>
                <span className="text-[var(--text-0)] font-medium">
                  {sc.trigger}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--text-2)] block">
                  Expected Path:
                </span>
                <p className="text-[var(--text-1)] text-xs leading-relaxed">
                  {sc.path}
                </p>
              </div>

              {sc.targets?.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="text-[var(--text-2)] text-[10px]">Targets:</span>
                  <div className="flex flex-wrap gap-1">
                    {sc.targets.map((tgt, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-1.5 py-0.5 rounded bg-[var(--bg-3)] border border-[var(--line)] font-bold text-[var(--text-0)]"
                      >
                        {tgt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confidence */}
            <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-xs">
              <ConfidenceMeter level={sc.modelConfidence} note={sc.confidenceNote} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
