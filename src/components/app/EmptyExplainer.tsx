import React from "react";

export function EmptyExplainer() {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)]/50 p-6 my-6">
      <h3 className="text-sm font-semibold text-[var(--text-0)] mb-3">
        How it works
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--bg-2)] border border-[var(--line)] text-xs font-mono font-bold text-[var(--candle)]">
            1
          </div>
          <div>
            <h4 className="text-xs font-medium text-[var(--text-0)]">Drop any chart</h4>
            <p className="text-[11px] text-[var(--text-2)] mt-0.5 leading-relaxed">
              Screenshot your TradingView or broker chart. Upload up to 3 timeframes for confluence.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--bg-2)] border border-[var(--line)] text-xs font-mono font-bold text-[var(--candle)]">
            2
          </div>
          <div>
            <h4 className="text-xs font-medium text-[var(--text-0)]">Data-quality check</h4>
            <p className="text-[11px] text-[var(--text-2)] mt-0.5 leading-relaxed">
              We verify price scale and ticker visibility. If blurry or cropped, 0 credits are used.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--bg-2)] border border-[var(--line)] text-xs font-mono font-bold text-[var(--candle)]">
            3
          </div>
          <div>
            <h4 className="text-xs font-medium text-[var(--text-0)]">Get full trade plan</h4>
            <p className="text-[11px] text-[var(--text-2)] mt-0.5 leading-relaxed">
              Structured support/resistance with visual reasons, bull/bear triggers, entry, stop, and R:R.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
