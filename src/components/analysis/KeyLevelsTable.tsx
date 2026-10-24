"use client";

import React, { useState } from "react";

interface Level {
  type: string;
  price?: number;
  zone?: [number, number];
  strength: 1 | 2 | 3 | 4 | 5;
  reason: string;
  visibleEvidence: string;
}

interface KeyLevelsTableProps {
  levels: Level[];
  lastPrice?: number;
}

export function KeyLevelsTable({ levels, lastPrice }: KeyLevelsTableProps) {
  const [filter, setFilter] = useState<"all" | "support" | "resistance" | "zone">("all");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  if (!levels || levels.length === 0) return null;

  // Filter levels
  const filteredLevels = levels.filter((lvl) => {
    if (filter === "support") return lvl.type.includes("support") || lvl.type.includes("demand");
    if (filter === "resistance") return lvl.type.includes("resistance") || lvl.type.includes("supply");
    if (filter === "zone") return lvl.zone !== undefined;
    return true;
  });

  // Sort by proximity to last price if present
  const sortedLevels = [...filteredLevels].sort((a, b) => {
    if (lastPrice === undefined) return b.strength - a.strength;
    const aPrice = a.price ?? (a.zone ? (a.zone[0] + a.zone[1]) / 2 : 0);
    const bPrice = b.price ?? (b.zone ? (b.zone[0] + b.zone[1]) / 2 : 0);
    return Math.abs(aPrice - lastPrice) - Math.abs(bPrice - lastPrice);
  });

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[var(--text-0)] tracking-tight">
            Key Technical Levels
          </h2>
          <p className="text-xs text-[var(--text-2)]">
            Ground-truth support and resistance levels with visible chart evidence
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-[var(--bg-2)] p-1 rounded-lg border border-[var(--line)] text-xs font-mono">
          {(["all", "support", "resistance", "zone"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded capitalize transition-colors ${
                filter === tab
                  ? "bg-[var(--bg-0)] text-[var(--candle)] font-bold shadow-xs"
                  : "text-[var(--text-2)] hover:text-[var(--text-0)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto rounded-lg border border-[var(--line)]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[var(--bg-2)] text-[10px] font-mono uppercase text-[var(--text-2)]">
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Price / Zone</th>
              <th className="py-2.5 px-3">Strength</th>
              <th className="py-2.5 px-3">Reasoning</th>
              <th className="py-2.5 px-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {sortedLevels.map((lvl, idx) => {
              const isSupport = lvl.type.includes("support") || lvl.type.includes("demand");
              const isResist = lvl.type.includes("resistance") || lvl.type.includes("supply");
              const isExpanded = expandedRow === idx;

              return (
                <React.Fragment key={idx}>
                  <tr
                    onClick={() => setExpandedRow(isExpanded ? null : idx)}
                    className="hover:bg-[var(--bg-2)]/60 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 font-semibold capitalize ${
                          isSupport
                            ? "text-[var(--candle)]"
                            : isResist
                            ? "text-[var(--bear)]"
                            : "text-[var(--amber)]"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {lvl.type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[var(--text-0)]">
                      {lvl.price !== undefined
                        ? lvl.price
                        : lvl.zone
                        ? `${lvl.zone[0]} – ${lvl.zone[1]}`
                        : "N/A"}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[var(--candle)]">
                      {"★".repeat(lvl.strength)}
                      <span className="text-[var(--text-2)] opacity-30">
                        {"★".repeat(5 - lvl.strength)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[var(--text-1)] max-w-xs truncate">
                      {lvl.reason}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-xs text-[var(--text-2)]">
                      {isExpanded ? "▲" : "▼"}
                    </td>
                  </tr>

                  {/* Expandable row: visible evidence */}
                  {isExpanded && (
                    <tr className="bg-[var(--bg-2)]/40 border-b border-[var(--line)]">
                      <td colSpan={5} className="p-3 text-xs space-y-1.5">
                        <div className="font-semibold text-[var(--text-0)]">
                          Visible Evidence in Screenshot:
                        </div>
                        <p className="text-[var(--text-1)] leading-relaxed italic">
                          &quot;{lvl.visibleEvidence}&quot;
                        </p>
                        <div className="text-[11px] text-[var(--text-2)] pt-1">
                          Full reasoning: {lvl.reason}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
