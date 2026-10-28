"use client";

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

interface ComparisonRow {
  feature: string;
  demo: string | boolean;
  paid: string | boolean;
  note?: string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Analyses Allowance",
    demo: "1 credit total",
    paid: "Unlimited (50/day fair use)",
    note: "Protects API infrastructure from automated scraping",
  },
  {
    feature: "Multi-Timeframe Confluence",
    demo: false,
    paid: "Up to 3 charts (e.g. 1D + 1H + 15m)",
  },
  {
    feature: "All 8 Market Packs",
    demo: true,
    paid: true,
    note: "US Equities, Forex, Crypto, Commodities, Indices, NSE/BSE",
  },
  {
    feature: "India Options Breakdown",
    demo: "Basic view",
    paid: "Full OI walls, Max Pain, PCR & Payoff curves",
  },
  {
    feature: "Trade Journal & Export",
    demo: false,
    paid: "Full journal with R:R tracking & PNG export",
  },
  {
    feature: "AI Processing Priority",
    demo: "Standard queue",
    paid: "Priority engine queue",
  },
];

export function UpgradeComparison() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[var(--text-0)]">
          Demo vs. Paid Breakdown
        </h3>
        <span className="text-xs font-mono text-[var(--text-2)]">
          Fair-use policy applies
        </span>
      </div>

      <div className="border border-[var(--line)] rounded-xl overflow-hidden bg-[var(--bg-1)]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[var(--bg-2)]/60 text-[var(--text-2)] font-mono">
              <th className="py-3 px-4 font-medium">Capability</th>
              <th className="py-3 px-4 font-medium w-1/3">Demo Plan</th>
              <th className="py-3 px-4 font-medium w-1/3 text-[var(--candle)]">Monthly &amp; Lifetime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {COMPARISON_ROWS.map((row, idx) => (
              <tr key={idx} className="hover:bg-[var(--bg-2)]/30 transition-colors">
                <td className="py-3 px-4 text-[var(--text-1)]">
                  <div className="font-medium text-[var(--text-0)]">{row.feature}</div>
                  {row.note && (
                    <div className="text-[10px] text-[var(--text-2)] mt-0.5">{row.note}</div>
                  )}
                </td>
                <td className="py-3 px-4 text-[var(--text-2)] font-mono">
                  {typeof row.demo === "boolean" ? (
                    row.demo ? (
                      <CheckIcon className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XIcon className="w-4 h-4 text-[var(--text-2)] opacity-50" />
                    )
                  ) : (
                    <span>{row.demo}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-[var(--text-0)] font-mono font-medium">
                  {typeof row.paid === "boolean" ? (
                    row.paid ? (
                      <CheckIcon className="w-4 h-4 text-[var(--candle)]" />
                    ) : (
                      <XIcon className="w-4 h-4 text-[var(--text-2)] opacity-50" />
                    )
                  ) : (
                    <span className="text-[var(--candle)]">{row.paid}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Money-honest notice */}
      <div className="p-4 rounded-xl bg-[var(--bg-2)]/60 border border-[var(--line)] space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--text-0)] uppercase tracking-wider font-mono">
            ⚖ Money-Honest Guarantee
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-3)] text-[var(--text-2)] font-mono">
            Transparency first
          </span>
        </div>
        <p className="text-xs text-[var(--text-2)] leading-relaxed">
          We will never promise that you will &quot;make back your subscription on your first trade.&quot;
          Trading financial assets carries substantial risk of loss. Iosnapchart is designed to be a disciplined,
          objective second pair of eyes that enforces your risk/reward rules and saves analysis time — not a magic predictor.
        </p>
      </div>
    </div>
  );
}
