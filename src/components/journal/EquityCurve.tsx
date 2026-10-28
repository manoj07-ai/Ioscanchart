"use client";

import React, { useState } from "react";
import { formatMoney } from "@/lib/journal/format";
import { buildEquityCurve, type EquityPoint, type EquityRange } from "@/lib/journal/equity";
import type { Trade } from "@/lib/journal/schema";

interface EquityCurveProps {
  trades: Trade[];
  currency: string;
  viewMode: "pnl" | "r";
  privacyBlur?: boolean;
}

export function EquityCurve({
  trades,
  currency,
  viewMode,
  privacyBlur = false,
}: EquityCurveProps) {
  const [range, setRange] = useState<EquityRange>("month");
  const [hoveredPoint, setHoveredPoint] = useState<EquityPoint | null>(null);

  const points = buildEquityCurve(trades, range);
  const hasData = trades.length > 0;

  // Values based on viewMode
  const values = points.map((p) => (viewMode === "r" ? p.cumulativeR : p.cumulativePnl));
  const currentTotal = values[values.length - 1] ?? 0;

  // Determine min & max for SVG coordinates
  const rawMin = Math.min(0, ...values);
  const rawMax = Math.max(0, ...values);
  const padding = Math.max(1, (rawMax - rawMin) * 0.15);
  const minY = rawMin - padding;
  const maxY = rawMax + padding;
  const rangeY = maxY - minY || 1;

  // SVG dimensions
  const width = 800;
  const height = 220;
  const zeroY = height - ((0 - minY) / rangeY) * height;

  function getY(val: number): number {
    return height - ((val - minY) / rangeY) * height;
  }

  function getX(idx: number): number {
    if (points.length <= 1) return width / 2;
    return (idx / (points.length - 1)) * (width - 40) + 20;
  }

  // Construct SVG path coordinates
  const pathCoordinates = points.map((p, idx) => {
    const val = viewMode === "r" ? p.cumulativeR : p.cumulativePnl;
    return `${getX(idx)},${getY(val)}`;
  });

  const linePath = pathCoordinates.length > 0 ? `M ${pathCoordinates.join(" L ")}` : "";
  const areaPath =
    pathCoordinates.length > 0
      ? `M ${getX(0)},${zeroY} L ${pathCoordinates.join(" L ")} L ${getX(
          points.length - 1
        )},${zeroY} Z`
      : "";

  let totalDisplay: string;
  if (privacyBlur) {
    totalDisplay = "••••";
  } else if (viewMode === "r") {
    totalDisplay = currentTotal > 0 ? `+${currentTotal}R` : `${currentTotal}R`;
  } else {
    totalDisplay = formatMoney(currentTotal, currency, {
      signDisplay: "always",
      privacyBlur,
    });
  }

  const isPositive = currentTotal >= 0;

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-5 space-y-4 shadow-xs">
      {/* Header with Title, Range Chips, and Current Total */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-2)] font-mono">
            {viewMode === "r" ? "Running R-Multiple Curve" : "Running P&L Curve"}
          </h3>
          <div
            className={`font-mono text-xl sm:text-2xl font-bold tracking-tight ${
              isPositive ? "text-[var(--candle)]" : "text-[var(--bear)]"
            }`}
          >
            {totalDisplay}
          </div>
        </div>

        {/* Range selectors */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] text-xs font-mono">
          {(["month", "3m", "ytd", "all"] as EquityRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                range === r
                  ? "bg-[var(--bg-3)] text-[var(--text-0)] shadow-2xs border border-[var(--line)]"
                  : "text-[var(--text-2)] hover:text-[var(--text-0)]"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-[220px] select-none">
        {!hasData ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <svg className="w-full h-full opacity-20 pointer-events-none">
              <line
                x1="0"
                y1={height / 2}
                x2="100%"
                y2={height / 2}
                stroke="var(--line-strong)"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />
            </svg>
            <div className="absolute text-xs text-[var(--text-2)] font-medium">
              Your curve will appear after your first trade.
            </div>
          </div>
        ) : (
          <>
            <svg
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="equity-pos-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--candle)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--candle)" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="equity-neg-grad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="var(--bear)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--bear)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Zero baseline */}
              <line
                x1="0"
                y1={zeroY}
                x2={width}
                y2={zeroY}
                stroke="var(--line-strong)"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />

              {/* Area gradient */}
              <path
                d={areaPath}
                fill={isPositive ? "url(#equity-pos-grad)" : "url(#equity-neg-grad)"}
              />

              {/* Main curve line */}
              <path
                d={linePath}
                fill="none"
                stroke={isPositive ? "var(--candle)" : "var(--bear)"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Point markers on hover */}
              {points.map((p, idx) => {
                const val = viewMode === "r" ? p.cumulativeR : p.cumulativePnl;
                const cx = getX(idx);
                const cy = getY(val);
                return (
                  <circle
                    key={p.date}
                    cx={cx}
                    cy={cy}
                    r={hoveredPoint?.date === p.date ? 5 : 2.5}
                    className="cursor-pointer transition-all fill-[var(--bg-0)] stroke-2"
                    stroke={val >= 0 ? "var(--candle)" : "var(--bear)"}
                    onMouseEnter={() => setHoveredPoint(p)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}
            </svg>

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div
                className="absolute z-10 p-2.5 rounded-lg border border-[var(--line-strong)] bg-[var(--bg-2)]/95 backdrop-blur-md shadow-xl text-xs space-y-1 pointer-events-none transform -translate-x-1/2 -translate-y-12"
                style={{
                  left: `${(points.indexOf(hoveredPoint) / (points.length - 1 || 1)) * 100}%`,
                  top: "20%",
                }}
              >
                <div className="font-mono text-[10px] text-[var(--text-2)]">
                  {hoveredPoint.date}
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[var(--text-2)]">Cumulative:</span>
                  <span
                    className={`font-bold ${
                      (viewMode === "r" ? hoveredPoint.cumulativeR : hoveredPoint.cumulativePnl) >=
                      0
                        ? "text-[var(--candle)]"
                        : "text-[var(--bear)]"
                    }`}
                  >
                    {privacyBlur
                      ? "••••"
                      : viewMode === "r"
                      ? `${hoveredPoint.cumulativeR > 0 ? "+" : ""}${hoveredPoint.cumulativeR}R`
                      : formatMoney(hoveredPoint.cumulativePnl, currency, {
                          signDisplay: "always",
                          privacyBlur,
                        })}
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-2)] font-mono">
                  Day:{" "}
                  {privacyBlur
                    ? "••••"
                    : viewMode === "r"
                    ? `${hoveredPoint.dayR > 0 ? "+" : ""}${hoveredPoint.dayR}R`
                    : formatMoney(hoveredPoint.dayPnl, currency, {
                        signDisplay: "always",
                        privacyBlur,
                      })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
