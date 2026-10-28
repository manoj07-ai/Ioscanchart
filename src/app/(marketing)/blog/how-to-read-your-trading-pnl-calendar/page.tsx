import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Read Your Trading P&L Calendar: Heatmaps, Streaks & Tilt Auditing (2026)",
  description:
    "Master the visual cues of a professional P&L calendar: intensity scaling, streak clustering, weekly boundaries, and psychological drawdown patterns.",
};

export default function HowToReadYourTradingPnlCalendarPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Read Your Trading P&L Calendar: Heatmaps, Streaks & Tilt Auditing",
    description:
      "Master the visual cues of a professional P&L calendar: intensity scaling, streak clustering, weekly boundaries, and psychological drawdown patterns.",
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
          <span className="text-[var(--candle)]">Visual Analytics</span>
          <span>·</span>
          <span>6 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-0)] font-sans leading-tight">
          How to Read Your Trading P&L Calendar: Visual Diagnostics for Real Traders
        </h1>
        <p className="text-base text-[var(--text-2)] leading-relaxed">
          A wall of numbers in a brokerage statement hides patterns. A calendar heatmap makes behavioral leaks glaringly obvious. Here is how professional prop desk risk managers read a trader&apos;s monthly P&L grid.
        </p>
      </div>

      {/* Visual Component Mock */}
      <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] space-y-4">
        <div className="text-xs font-mono uppercase text-[var(--candle)] font-bold">
          Visual Heatmap Anatomy
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs text-center">
          <div className="p-3 rounded-lg border border-[var(--up)]/20 bg-[var(--up)]/10 text-[var(--up)]">
            <div className="font-bold">+$120.00 ▲</div>
            <div className="text-[10px] opacity-75">1 trade · Mild Green</div>
          </div>
          <div className="p-3 rounded-lg border border-[var(--up)]/40 bg-[var(--up)]/25 text-[var(--up)]">
            <div className="font-bold">+$650.00 ▲</div>
            <div className="text-[10px] opacity-75">3 trades · Vivid Green</div>
          </div>
          <div className="p-3 rounded-lg border border-[var(--down)]/20 bg-[var(--down)]/10 text-[var(--down)]">
            <div className="font-bold">-$80.00 ▼</div>
            <div className="text-[10px] opacity-75">1 trade · Mild Red</div>
          </div>
          <div className="p-3 rounded-lg border border-[var(--down)]/50 bg-[var(--down)]/30 text-[var(--down)]">
            <div className="font-bold">-$920.00 ▼</div>
            <div className="text-[10px] opacity-75">6 trades · Deep Crimson</div>
          </div>
        </div>
        <p className="text-xs text-[var(--text-2)] leading-relaxed">
          Notice how the deep crimson cell on the right combined a heavy loss with <strong>6 trades</strong>. That is the visual fingerprint of intraday revenge trading.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-0)]">
          1. The 3-Tier Intensity Scaling Engine
        </h2>
        <p className="leading-relaxed">
          In IoSnapChart’s calendar engine, green and red backgrounds are not flat binary colors. They scale dynamically relative to your month&apos;s performance distribution:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed text-[var(--text-1)]">
          <li><strong>Tier 1 (Subtle Tint):</strong> Small wins or controlled single-R losses. These indicate disciplined adherence to routine risk management.</li>
          <li><strong>Tier 2 (Medium Intensity):</strong> Above-average winning days where multiple setups triggered, or multi-loss sessions that remained within risk parameters.</li>
          <li><strong>Tier 3 (Vivid / Deep Saturation):</strong> Outlier sessions. A Tier 3 green day represents a multi-target runner. A Tier 3 red day is an alarm bell requiring an immediate execution audit.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-0)]">
          2. The Anomaly of the Over-Traded Red Cell
        </h2>
        <p className="leading-relaxed">
          When examining your calendar, look at the <strong>trade count badge</strong> located in the top-right corner of each cell.
        </p>
        <p className="leading-relaxed">
          In a healthy trading journal, winning days typically feature 1 to 3 planned trades. If you notice a red day with <strong>5, 8, or 12 trades</strong>, you have discovered a tilt episode. The sequence almost always follows the same psychological pattern:
        </p>
        <div className="p-4 rounded-lg border border-[var(--line)] bg-[var(--bg-0)] font-mono text-xs space-y-2">
          <div className="text-[var(--text-2)]">09:35 AM · Trade 1: Stop out on planned NIFTY long (-1.0R)</div>
          <div className="text-[var(--text-2)]">09:42 AM · Trade 2: Impulsive market re-entry on lower timeframe (-1.0R)</div>
          <div className="text-[var(--text-2)]">09:55 AM · Trade 3: Frustrated reversal short against the trend (-1.2R)</div>
          <div className="text-[var(--down)] font-bold">10:15 AM · Trades 4-7: Rapid-fire scalping to &quot;get back to even&quot; (-3.5R)</div>
        </div>
        <p className="leading-relaxed">
          The calendar cell makes this pattern impossible to hide from yourself. It turns denial into documented data.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-0)]">
          3. Cross-Month Weekly Summaries
        </h2>
        <p className="leading-relaxed">
          A common design flaw in spreadsheet journals is how they handle calendar weeks that cross month boundaries. For example, if October ends on a Wednesday and November begins on a Thursday, should the week total include November&apos;s days?
        </p>
        <p className="leading-relaxed">
          IoSnapChart resolves this with a strict rule: <strong>Weekly summary cells only aggregate days belonging to the active month</strong>. This ensures that your monthly total exactly equals the sum of visible weekly totals, maintaining mathematical integrity across accounting periods.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-0)]">
          4. Auditing Winning and Losing Streaks
        </h2>
        <p className="leading-relaxed">
          Winning streaks are psychologically dangerous. After 4 or 5 consecutive green days, traders frequently experience euphoria, leading to oversized positions and careless entries on day 6.
        </p>
        <p className="leading-relaxed">
          By displaying <strong>Max Winning Streak</strong> and <strong>Max Losing Streak</strong> right above the calendar, you can proactively spot when you are approaching your historical streak limit and actively lower your risk percentage to protect accrued profits.
        </p>
      </section>

      <div className="pt-6 border-t border-[var(--line)]">
        <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-base font-bold text-[var(--text-0)]">See Your Trading in a P&L Calendar</div>
            <div className="text-xs text-[var(--text-2)]">Try our free web-based P&L calendar with zero installation.</div>
          </div>
          <Link
            href="/tools/trading-journal"
            className="px-4 py-2 rounded-lg bg-[var(--candle)] text-black font-semibold text-xs font-mono hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Launch P&L Calendar →
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
