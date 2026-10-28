"use client";

import React from "react";
import type { CumulativeRPoint } from "@/server/journal/stats";

interface CumulativeRChartProps {
  series: CumulativeRPoint[];
  height?: number;
}

export function CumulativeRChart({ series, height = 180 }: CumulativeRChartProps) {
  if (series.length <= 1) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-xl bg-[var(--bg-2)]/40 border border-[var(--line)] flex flex-col items-center justify-center text-xs text-[var(--text-2)] font-mono p-4 text-center"
      >
        <span>No equity trajectory yet.</span>
        <span className="text-[10px] mt-1 text-[var(--text-2)]/70">
          Log at least 2 trades to chart cumulative R performance over time.
        </span>
      </div>
    );
  }

  const values = series.map((s) => s.cumulativeR);
  const minVal = Math.min(0, ...values);
  const maxVal = Math.max(1, ...values);
  const range = maxVal - minVal || 1;

  const width = 600;
  const padding = { top: 20, bottom: 25, left: 40, right: 20 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const getY = (val: number) => {
    return padding.top + graphHeight - ((val - minVal) / range) * graphHeight;
  };

  const getX = (idx: number) => {
    return padding.left + (idx / (series.length - 1)) * graphWidth;
  };

  // Build path coordinates
  const points = series.map((pt, i) => `${getX(i)},${getY(pt.cumulativeR)}`);
  const linePath = `M ${points.join(" L ")}`;

  // Area path closed down to 0 baseline
  const zeroY = getY(0);
  const areaPath = `${linePath} L ${getX(series.length - 1)},${zeroY} L ${getX(0)},${zeroY} Z`;

  const isNetPositive = series[series.length - 1].cumulativeR >= 0;

  return (
    <div className="w-full rounded-xl bg-[var(--bg-1)] border border-[var(--line)] p-4 space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-[var(--text-2)]">Cumulative R Trajectory</span>
        <span
          className={`font-bold ${
            isNetPositive ? "text-[var(--candle)]" : "text-[var(--bear)]"
          }`}
        >
          {isNetPositive ? "+" : ""}
          {series[series.length - 1].cumulativeR}R
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          <linearGradient id="rGreenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--candle)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--candle)" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="rRedGradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--bear)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--bear)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Zero baseline horizontal rule */}
        <line
          x1={padding.left}
          y1={zeroY}
          x2={width - padding.right}
          y2={zeroY}
          stroke="var(--line-strong)"
          strokeDasharray="3 3"
          strokeWidth="1"
        />
        <text
          x={padding.left - 8}
          y={zeroY + 3}
          fill="var(--text-2)"
          fontSize="9"
          fontFamily="monospace"
          textAnchor="end"
        >
          0R
        </text>

        {/* Max label */}
        <text
          x={padding.left - 8}
          y={getY(maxVal) + 3}
          fill="var(--text-2)"
          fontSize="9"
          fontFamily="monospace"
          textAnchor="end"
        >
          +{maxVal}R
        </text>

        {/* Min label if negative */}
        {minVal < 0 && (
          <text
            x={padding.left - 8}
            y={getY(minVal) + 3}
            fill="var(--bear)"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="end"
          >
            {minVal}R
          </text>
        )}

        {/* Area fill */}
        <path
          d={areaPath}
          fill={isNetPositive ? "url(#rGreenGradient)" : "url(#rRedGradient)"}
        />

        {/* Trajectory stroke line */}
        <path
          d={linePath}
          fill="none"
          stroke={isNetPositive ? "var(--candle)" : "var(--bear)"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {series.map((pt, i) => (
          <circle
            key={i}
            cx={getX(i)}
            cy={getY(pt.cumulativeR)}
            r="3"
            fill="var(--bg-0)"
            stroke={pt.rMultiple >= 0 ? "var(--candle)" : "var(--bear)"}
            strokeWidth="2"
          >
            <title>{`Trade #${i}: ${pt.rMultiple >= 0 ? "+" : ""}${pt.rMultiple}R (Cumulative: ${pt.cumulativeR}R)`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}
