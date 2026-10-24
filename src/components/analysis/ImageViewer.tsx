"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ImageViewerProps {
  images: Array<{
    url: string;
    timeframe?: string;
  }>;
  levels?: Array<{
    type: string;
    price?: number;
    zone?: [number, number];
    strength: number;
    reason: string;
  }>;
}

export function ImageViewer({ images, levels = [] }: ImageViewerProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showLevelsOverlay, setShowLevelsOverlay] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!images || images.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-8 text-center text-xs text-[var(--text-2)]">
        No chart image available for this analysis.
      </div>
    );
  }

  const currentImage = images[selectedIdx] || images[0];

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)] overflow-hidden flex flex-col h-fit sticky top-6">
      {/* Viewer toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--line)] bg-[var(--bg-2)]/50 text-xs">
        {/* Timeframe tabs */}
        <div className="flex items-center gap-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                selectedIdx === idx
                  ? "bg-[var(--bg-0)] text-[var(--candle)] border border-[var(--line)] shadow-xs"
                  : "text-[var(--text-2)] hover:text-[var(--text-0)]"
              }`}
            >
              {img.timeframe || `Chart ${idx + 1}`}
            </button>
          ))}
        </div>

        {/* View toggles & zoom */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLevelsOverlay(!showLevelsOverlay)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
              showLevelsOverlay
                ? "bg-[var(--candle)]/15 border-[var(--candle)]/30 text-[var(--candle)]"
                : "border-[var(--line)] text-[var(--text-2)] hover:text-[var(--text-0)]"
            }`}
          >
            {showLevelsOverlay ? "Hide Levels" : "Show Levels"}
          </button>

          <div className="flex items-center border border-[var(--line)] rounded overflow-hidden">
            <button
              onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
              className="px-2 py-0.5 text-xs text-[var(--text-2)] hover:bg-[var(--bg-2)]"
              title="Zoom out"
            >
              −
            </button>
            <span className="px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-1)] border-x border-[var(--line)]">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              className="px-2 py-0.5 text-xs text-[var(--text-2)] hover:bg-[var(--bg-2)]"
              title="Zoom in"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Main Image View */}
      <div className="relative overflow-auto max-h-[550px] flex items-center justify-center p-2 bg-[var(--bg-0)]">
        <div
          className="relative transition-transform duration-150 ease-out"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center" }}
        >
          <Image
            src={currentImage.url}
            alt="Analyzed chart"
            width={900}
            height={600}
            unoptimized
            className="rounded-lg object-contain w-full h-auto max-w-full"
          />
        </div>
      </div>

      {/* Collapsible Levels Side-Drawer / Footer Overlay */}
      {showLevelsOverlay && levels.length > 0 && (
        <div className="border-t border-[var(--line)] bg-[var(--bg-2)]/80 p-3 max-h-48 overflow-y-auto">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-2)] mb-2 font-semibold">
            Visible Levels Context ({levels.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {levels.map((lvl, idx) => {
              const isSupport = lvl.type.includes("support") || lvl.type.includes("demand");
              const isResist = lvl.type.includes("resistance") || lvl.type.includes("supply");
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs px-2 py-1 rounded bg-[var(--bg-1)] border border-[var(--line)]"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isSupport
                          ? "bg-[var(--candle)]"
                          : isResist
                          ? "bg-[var(--bear)]"
                          : "bg-[var(--amber)]"
                      }`}
                    />
                    <span className="font-mono font-bold text-[var(--text-0)]">
                      {lvl.price !== undefined
                        ? lvl.price
                        : lvl.zone
                        ? `${lvl.zone[0]}–${lvl.zone[1]}`
                        : "Zone"}
                    </span>
                    <span className="text-[10px] text-[var(--text-2)] capitalize truncate">
                      {lvl.type.replace("_", " ")}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-2)] shrink-0 ml-2">
                    {"★".repeat(lvl.strength)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
