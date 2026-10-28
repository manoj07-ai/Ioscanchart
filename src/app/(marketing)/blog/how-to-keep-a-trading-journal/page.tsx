import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Keep a Trading Journal: Complete Practitioner Framework (2026)",
  description:
    "A deep-dive guide to logging trades, auditing execution errors, building feedback loops, and tracking edge. Includes free CSV template download.",
};

export default function HowToKeepATradingJournalPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Keep a Trading Journal: Complete Practitioner Framework",
    description:
      "A deep-dive guide to logging trades, auditing execution errors, building feedback loops, and tracking edge. Includes free CSV template download.",
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
          <span className="text-[var(--candle)]">Execution Discipline</span>
          <span>·</span>
          <span>7 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-0)] font-sans leading-tight">
          How to Keep a Trading Journal: The Practitioner’s Operating Manual
        </h1>
        <p className="text-base text-[var(--text-2)] leading-relaxed">
          Most traders stop journaling after two weeks because they record the wrong data. Here is the operational architecture professional prop firms and disciplined discretionary traders use to isolate actual edge from statistical noise.
        </p>
      </div>

      {/* Quick Action Callout */}
      <div className="p-5 rounded-xl border border-[var(--candle)]/30 bg-[var(--candle)]/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--candle)]">
            Quick Resource
          </span>
          <span className="text-xs text-[var(--text-2)] font-mono">No sign-up required</span>
        </div>
        <p className="text-xs text-[var(--text-1)] leading-relaxed">
          You can test your logs instantly using our client-side interactive tool or download the clean starter spreadsheet:
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="/tools/trading-journal"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--candle)] text-black hover:opacity-90 transition-opacity font-mono"
          >
            Launch Free Web Journal →
          </Link>
          <a
            href="/downloads/trading-journal-template.csv"
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--line)] bg-[var(--bg-1)] text-[var(--text-0)] hover:bg-[var(--bg-2)] transition-colors font-mono"
          >
            Download CSV Template (.csv)
          </a>
        </div>
      </div>

      {/* Main Content Sections */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-0)]">
          1. Why Most Trading Journals Fail Within Two Weeks
        </h2>
        <p className="leading-relaxed">
          The typical amateur journal is an emotional diary disguised as a ledger. It consists of lines like: <em>&quot;Bought EURUSD because it looked oversold. Got stopped out. Market was rigged by market makers today.&quot;</em>
        </p>
        <p className="leading-relaxed">
          This contains zero reproducible information. You cannot query feelings from last Tuesday. You cannot run an expected value calculation on frustration. When a trader logs unstructured qualitative sentiment, the friction of entry increases after every losing session, leading to abandonment during drawdowns—precisely when rigorous auditing is most crucial.
        </p>
        <p className="leading-relaxed">
          A functional trading journal is not an emotional diary; it is a <strong>risk-accounting and behavioral audit system</strong>. Its sole objective is to answer three binary questions at the end of every 30-trade sample:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed text-[var(--text-1)]">
          <li><strong>Did the setup have positive mathematical expectancy when executed faithfully?</strong></li>
          <li><strong>How many basis points of P&L were forfeited to unforced behavioral mistakes (FOMO, revenge, moving stops)?</strong></li>
          <li><strong>Which specific market conditions, instruments, or session windows generated 80% of net drawdowns?</strong></li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-0)]">
          2. The Two-Phase Recording Workflow
        </h2>
        <p className="leading-relaxed">
          To maintain zero friction during fast-paced intraday sessions, split your journaling routine into two distinct phases: <strong>Execution Ingestion</strong> and <strong>Post-Close Review</strong>.
        </p>
        
        <div className="p-4 rounded-lg border border-[var(--line)] bg-[var(--bg-1)] space-y-3">
          <h3 className="text-sm font-semibold text-[var(--text-0)] uppercase tracking-wider font-mono">
            Phase 1: Real-Time Execution Capture (Under 20 seconds)
          </h3>
          <p className="text-xs text-[var(--text-2)] leading-relaxed">
            Immediately upon entering or exiting, capture only the immutable execution parameters:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-[var(--bg-2)] border border-[var(--line)]">Date & Time</div>
            <div className="p-2 rounded bg-[var(--bg-2)] border border-[var(--line)]">Symbol & Side</div>
            <div className="p-2 rounded bg-[var(--bg-2)] border border-[var(--line)]">Planned Risk ($/R)</div>
            <div className="p-2 rounded bg-[var(--bg-2)] border border-[var(--line)]">Setup Tag</div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-[var(--line)] bg-[var(--bg-1)] space-y-3">
          <h3 className="text-sm font-semibold text-[var(--text-0)] uppercase tracking-wider font-mono">
            Phase 2: Post-Market Behavioral Audit (5 minutes post-close)
          </h3>
          <p className="text-xs text-[var(--text-2)] leading-relaxed">
            After the market closes and heart rate returns to resting baseline:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[var(--text-2)] leading-relaxed">
            <li>Did you follow the planned invalidation rule? (Yes/No boolean)</li>
            <li>Tag any mistake: Early Exit, Chasing / FOMO, Widening Stop, Position Oversized.</li>
            <li>Log day mental state: 1 (Tilted / Exhausted) to 5 (Sharp / Composed).</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-0)]">
          3. Tracking R-Multiples Instead of Absolute Currency
        </h2>
        <p className="leading-relaxed">
          Tracking only nominal dollars, euros, or rupees obscures your actual competence. If you win $500 risking $1,000 on one trade (a 0.5R return) and lose $1,000 risking $200 on another because you removed your stop loss (-5.0R), your dollar balance will show -$500, but your risk distribution shows catastrophic negative asymmetry.
        </p>
        <div className="p-4 rounded-lg border border-[var(--line)] bg-[var(--bg-0)] font-mono text-xs space-y-2">
          <div className="text-[var(--text-2)]">{"// Standard R-Multiple Formula:"}</div>
          <div className="text-[var(--candle)] font-bold">R = Net Realized Profit or Loss / Initial Planned Dollar Risk</div>
          <div className="text-[var(--text-2)] pt-1">
            Example: Bought NIFTY with ₹10,000 risk. Closed at ₹25,000 net profit. Return = +2.5R.
          </div>
        </div>
        <p className="leading-relaxed">
          When you normalize every single trade into R, your equity curve reveals true edge invariant to account size, compounding, or market volatility spikes.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-0)]">
          4. The Weekly Audit Cadence
        </h2>
        <p className="leading-relaxed">
          A journal is useless without a scheduled retrospection. Every weekend, open your P&L calendar and filter your journal by mistake tags:
        </p>
        <div className="overflow-x-auto border border-[var(--line)] rounded-lg">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[var(--bg-2)] border-b border-[var(--line)] text-[var(--text-0)]">
              <tr>
                <th className="p-3">Audit Metric</th>
                <th className="p-3">Target Threshold</th>
                <th className="p-3">Corrective Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] text-[var(--text-1)]">
              <tr>
                <td className="p-3 font-semibold text-[var(--text-0)]">Plan Adherence</td>
                <td className="p-3 text-[var(--up)]">&gt; 85%</td>
                <td className="p-3">Reduce daily trade limit to 2 trades maximum if &lt;80%</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--text-0)]">Mistake Drain</td>
                <td className="p-3 text-[var(--up)]">&lt; 0.5R per week</td>
                <td className="p-3">Identify recurring tag (e.g. FOMO) and write pre-market checklist rule</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[var(--text-0)]">Worst Day Cluster</td>
                <td className="p-3 text-[var(--text-2)]">Isolated &lt; 2R</td>
                <td className="p-3">Implement a mandatory hard stop: shutdown platform after 2 consecutive losses</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-0)]">
          5. Next Steps: Setting Up Your Workspace
        </h2>
        <p className="leading-relaxed">
          Do not overcomplicate your infrastructure on Day 1. You don’t need high-latency enterprise software to achieve positive expectancy. Start by downloading our clean CSV template, or use our zero-friction offline web tool that runs entirely in your browser memory:
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Link
            href="/tools/trading-journal"
            className="flex-1 p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] hover:border-[var(--candle)] transition-all group"
          >
            <div className="text-sm font-bold text-[var(--text-0)] group-hover:text-[var(--candle)]">
              Interactive Web Journal →
            </div>
            <div className="text-xs text-[var(--text-2)] mt-1">
              Zero login required. Stores your executions safely in client localStorage.
            </div>
          </Link>
          <Link
            href="/trading-journal"
            className="flex-1 p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] hover:border-[var(--candle)] transition-all group"
          >
            <div className="text-sm font-bold text-[var(--text-0)] group-hover:text-[var(--candle)]">
              Explore Feature Overview →
            </div>
            <div className="text-xs text-[var(--text-2)] mt-1">
              See how IoSnapChart links your daily P&L calendar with AI chart analysis.
            </div>
          </Link>
        </div>
      </section>

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
