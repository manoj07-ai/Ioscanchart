"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface CandleBackdropProps {
  className?: string;
  opacity?: number; // default <= 0.08
}

/**
 * Reusable ambient background with faint drifting candlestick patterns.
 * Opacity is kept <= 8% to ensure WCAG AA contrast.
 * Animation respects prefers-reduced-motion.
 */
export function CandleBackdrop({
  className,
  opacity = 0.05,
}: CandleBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden select-none z-0",
        className
      )}
      style={{ opacity }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="bg-bull" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5BE38C" />
            <stop offset="100%" stopColor="#1E6B3F" />
          </linearGradient>
          <linearGradient id="bg-bear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor="#6B2A2A" />
          </linearGradient>
        </defs>

        {/* Slow drifting group of stylized candles */}
        <g className="animate-[pulse_10s_ease-in-out_infinite] motion-reduce:animate-none">
          {/* Cluster 1 - Bull run */}
          <line x1="120" y1="180" x2="120" y2="340" stroke="#5BE38C" strokeWidth="2" />
          <rect x="110" y="210" width="20" height="90" rx="3" fill="url(#bg-bull)" />

          <line x1="180" y1="160" x2="180" y2="310" stroke="#5BE38C" strokeWidth="2" />
          <rect x="170" y="190" width="20" height="85" rx="3" fill="url(#bg-bull)" />

          <line x1="240" y1="190" x2="240" y2="360" stroke="#FF6B6B" strokeWidth="2" />
          <rect x="230" y="220" width="20" height="110" rx="3" fill="url(#bg-bear)" />

          <line x1="300" y1="130" x2="300" y2="280" stroke="#5BE38C" strokeWidth="2" />
          <rect x="290" y="150" width="20" height="95" rx="3" fill="url(#bg-bull)" />

          {/* Cluster 2 - Mid chart consolidation */}
          <line x1="580" y1="380" x2="580" y2="520" stroke="#FF6B6B" strokeWidth="2" />
          <rect x="570" y="410" width="20" height="70" rx="3" fill="url(#bg-bear)" />

          <line x1="640" y1="360" x2="640" y2="500" stroke="#5BE38C" strokeWidth="2" />
          <rect x="630" y="390" width="20" height="60" rx="3" fill="url(#bg-bull)" />

          <line x1="700" y1="340" x2="700" y2="480" stroke="#5BE38C" strokeWidth="2" />
          <rect x="690" y="360" width="20" height="80" rx="3" fill="url(#bg-bull)" />

          <line x1="760" y1="310" x2="760" y2="440" stroke="#5BE38C" strokeWidth="2" />
          <rect x="750" y="330" width="20" height="75" rx="3" fill="url(#bg-bull)" />

          {/* Cluster 3 - Right expansion */}
          <line x1="1100" y1="120" x2="1100" y2="290" stroke="#5BE38C" strokeWidth="2" />
          <rect x="1090" y="150" width="20" height="100" rx="3" fill="url(#bg-bull)" />

          <line x1="1160" y1="100" x2="1160" y2="260" stroke="#5BE38C" strokeWidth="2" />
          <rect x="1150" y="120" width="20" height="105" rx="3" fill="url(#bg-bull)" />

          <line x1="1220" y1="140" x2="1220" y2="300" stroke="#FF6B6B" strokeWidth="2" />
          <rect x="1210" y="160" width="20" height="90" rx="3" fill="url(#bg-bear)" />

          <line x1="1280" y1="90" x2="1280" y2="240" stroke="#5BE38C" strokeWidth="2" />
          <rect x="1270" y="110" width="20" height="100" rx="3" fill="url(#bg-bull)" />
        </g>
      </svg>
    </div>
  );
}
