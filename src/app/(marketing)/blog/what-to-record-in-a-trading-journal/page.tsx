import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What to Record in a Trading Journal: 15 Fields That Actually Matter (2026)",
  description:
    "A comprehensive breakdown of the 15 essential data points every serious trader must track to optimize win rate, profit factor, and execution hygiene.",
};

export default function WhatToRecordInATradingJournalPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What to Record in a Trading Journal: 15 Fields That Actually Matter",
    description:
      "A comprehensive breakdown of the 15 essential data points every serious trader must track to optimize win rate, profit factor, and execution hygiene.",
    author: {
      "@type": "Organization",
      name: "IoSnapChart Research",
    },
    publisher: {
      "@type": "Organization",
      name: "IoSnapChart",
      url: "https://iosnapchart.com",
    },
    datePublished: "2026-10-28",
    dateModified: "2026-10-28",
  };

  const FIELDS = [
    { num: 1, name: "Trade Date (YYYY-MM-DD)", type: "Temporal", purpose: "Enables calendar heatmap grouping and day-of-week performance analysis." },
    { num: 2, name: "Symbol / Ticker", type: "Categorical", purpose: "Identifies whether profitability is concentrated in 1-2 instruments or scattered." },
    { num: 3, name: "Market Category", type: "Categorical", purpose: "Separates Forex, Crypto, Equities, Indices, and Options to avoid cross-asset skew." },
    { num: 4, name: "Direction (Long / Short)", type: "Categorical", purpose: "Detects structural directional biases (e.g. inability to profit on short setups)." },
    { num: 5, name: "Entry Price", type: "Quantitative", purpose: "Baseline for calculating slippage against planned limit orders." },
    { num: 6, name: "Exit Price", type: "Quantitative", purpose: "Verifies whether exits were captured at planned targets or chopped prematurely." },
    { num: 7, name: "Planned Stop Loss", type: "Quantitative", purpose: "The foundation of risk accounting; mandatory for R-multiple derivation." },
    { num: 8, name: "Planned Target (T1/T2)", type: "Quantitative", purpose: "Tracks whether realized reward matches the theoretical risk-to-reward ratio." },
    { num: 9, name: "Position Size / Quantity", type: "Quantitative", purpose: "Exposes revenge trading and impulsive over-leveraging after losing streaks." },
    { num: 10, name: "Net Realized P&L", type: "Financial", purpose: "Actual bottom-line return after all broker commissions and exchange fees." },
    { num: 11, name: "R-Multiple Realized", type: "Mathematical", purpose: "Normalized unit of return (P&L ÷ Initial Risk). Eliminates capital sizing distortion." },
    { num: 12, name: "Setup / Strategy Tag", type: "Taxonomy", purpose: "Groups trades by technical thesis (e.g., Pullback, Breakout, Range Reversal)." },
    { num: 13, name: "Mistake / Execution Tag", type: "Psychological", purpose: "Flags unforced errors: FOMO, revenge, moving stops, or oversized positions." },
    { num: 14, name: "Plan Adherence (Boolean)", type: "Binary", purpose: "Did you execute the pre-trade plan exactly as written? Yes or No." },
    { num: 15, name: "Daily Mindset / Mood (1-5)", type: "Biometric", purpose: "Correlates fatigue and emotional tilt with negative equity drawdowns." },
  ];

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-[var(--text-1)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-4 border-b border-[var(--line)] pb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-2)]">
          <Link href="/blog" className="hover:text-[var(--candle)] transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-[var(--candle)]">System Architecture</span>
          <span>·</span>
          <span>8 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-0)] font-sans leading-tight">
          What to Record in a Trading Journal: 15 Fields That Actually Matter
        </h1>
        <p className="text-base text-[var(--text-2)] leading-relaxed">
          Tracking too little data leaves you blind to bad habits. Tracking too much creates spreadsheet fatigue. Here is the exact 15-field schema that isolates your statistical edge without turning your trading day into tedious data entry.
        </p>
      </div>

      <div className="p-5 rounded-xl border border-[var(--candle)]/30 bg-[var(--candle)]/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--candle)]">
            Ready-to-Use Schema
          </span>
          <span className="text-xs text-[var(--text-2)] font-mono">Standard CSV Format</span>
        </div>
        <p className="text-xs text-[var(--text-1)] leading-relaxed">
          These 15 fields are pre-built into IoSnapChart’s free browser tool and downloadable CSV template:
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href="/downloads/trading-journal-template.csv"
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--candle)] text-black hover:opacity-90 transition-opacity font-mono"
          >
            Download CSV Template →
          </a>
          <Link
            href="/tools/trading-journal"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--line)] bg-[var(--bg-1)] text-[var(--text-0)] hover:bg-[var(--bg-2)] transition-colors font-mono"
          >
            Open Interactive Journal
          </Link>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-0)]">
          1. The 15 Core Journal Fields
        </h2>
        <p className="leading-relaxed">
          Every field in your journal must serve a diagnostic purpose. If a data point doesn’t directly inform risk adjustments, strategy elimination, or psychology training, eliminate it. Here is the canonical 15-field framework:
        </p>

        <div className="overflow-x-auto border border-[var(--line)] rounded-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[var(--bg-2)] border-b border-[var(--line)] text-[var(--text-0)]">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Field Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Diagnostic Function</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] text-[var(--text-1)]">
              {FIELDS.map((f) => (
                <tr key={f.num} className="hover:bg-[var(--bg-2)]/40 transition-colors">
                  <td className="p-3 text-[var(--candle)] font-bold">{f.num}</td>
                  <td className="p-3 font-semibold text-[var(--text-0)]">{f.name}</td>
                  <td className="p-3 text-[var(--text-2)]">{f.type}</td>
                  <td className="p-3 text-xs leading-normal">{f.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-0)]">
          2. The Diagnostic Power of Mistake Tags
        </h2>
        <p className="leading-relaxed">
          A common tragedy in active trading is having a profitable technical strategy completely neutralized by two or three behavioral leakages. Without mistake tagging, a trader will conclude, <em>&quot;My strategy doesn’t work,&quot;</em> and jump to another indicator, repeating the cycle endlessly.
        </p>
        <p className="leading-relaxed">
          In our schema, we standardize four primary behavioral mistake categories:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-lg border border-[var(--down)]/30 bg-[var(--down)]/5 space-y-1">
            <div className="font-bold text-[var(--down)]">Chasing / FOMO</div>
            <div className="text-[var(--text-2)]">Entering after the price has already extended past the favorable risk-reward zone.</div>
          </div>
          <div className="p-3.5 rounded-lg border border-[var(--down)]/30 bg-[var(--down)]/5 space-y-1">
            <div className="font-bold text-[var(--down)]">Moved Stop Loss</div>
            <div className="text-[var(--text-2)]">Widening or deleting a stop loss to avoid realizing a loss, turning 1R risk into -3R catastrophe.</div>
          </div>
          <div className="p-3.5 rounded-lg border border-[var(--down)]/30 bg-[var(--down)]/5 space-y-1">
            <div className="font-bold text-[var(--down)]">Early Exit</div>
            <div className="text-[var(--text-2)]">Closing a winning position prematurely out of fear, capping the upside before target R is reached.</div>
          </div>
          <div className="p-3.5 rounded-lg border border-[var(--down)]/30 bg-[var(--down)]/5 space-y-1">
            <div className="font-bold text-[var(--down)]">Oversized Position</div>
            <div className="text-[var(--text-2)]">Risking more than the planned account percentage (often after a prior loss or during high conviction).</div>
          </div>
        </div>
        <p className="leading-relaxed text-sm">
          When you filter your equity curve by <code>followed_plan: true</code> vs <code>followed_plan: false</code>, the reality is almost universally startling: the strategy was net profitable, but undisciplined trades dragged the balance negative.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-0)]">
          3. Quantifying Psychology: The 1–5 Mood Score
        </h2>
        <p className="leading-relaxed">
          Psychology is not ethereal; it has direct physiological and biometric correlations. When you are sleep-deprived, arguing with a spouse, or trading after a major personal stressor, your prefrontal cortex operates with reduced executive control.
        </p>
        <p className="leading-relaxed">
          By recording a simple daily mood rating from <strong>1 (Tilted / Exhausted)</strong> to <strong>5 (Calm / Focused)</strong>, you can plot your win rate against emotional condition. Over 50+ trades, almost every trader discovers that their worst losing streaks occur exclusively on days scored 1 or 2. The solution is straightforward: on low-score days, trade in demo mode or do not trade at all.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-0)]">
          4. How to Audit Your Journal Monthly
        </h2>
        <p className="leading-relaxed">
          At the conclusion of each calendar month, run the following three queries across your dataset:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-sm leading-relaxed text-[var(--text-1)]">
          <li><strong>Gross Strategy P&L vs Mistake Drag:</strong> Sum the P&L of all trades where <code>followed_plan === true</code>. Then calculate the total loss incurred on trades tagged with mistakes. This represents your quantifiable cost of indiscipline.</li>
          <li><strong>Top 20% Setup Extraction:</strong> Group your trades by <code>setup_tag</code>. Sort by Profit Factor and Expectancy. Double down on setups with high expectancy, and completely prune setups with negative R.</li>
          <li><strong>Weekday Clustering:</strong> Look at your day-of-week win rate. Many discretionary equity traders discover that Friday afternoon trading consistently loses money due to end-of-week liquidity contractions.</li>
        </ol>
      </section>

      <div className="pt-6 border-t border-[var(--line)]">
        <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-base font-bold text-[var(--text-0)]">Start Tracking These 15 Fields Today</div>
            <div className="text-xs text-[var(--text-2)]">Free offline web tool, zero setup, stores data in local browser storage.</div>
          </div>
          <Link
            href="/tools/trading-journal"
            className="px-4 py-2 rounded-lg bg-[var(--candle)] text-black font-semibold text-xs font-mono hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Launch Trading Journal →
          </Link>
        </div>
      </div>

      <footer className="pt-8 border-t border-[var(--line)] text-xs text-[var(--text-2)] space-y-2">
        <p>
          <strong>Transparency Notice:</strong> Self-reported results. Not verified. Not investment advice or a recommendation to buy or sell securities.
        </p>
        <p>
          Published by IoSnapChart Research · Updated for October 2026.
        </p>
      </footer>
    </article>
  );
}
