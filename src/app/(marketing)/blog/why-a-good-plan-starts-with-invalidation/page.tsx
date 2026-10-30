import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why a Good Trading Plan Starts With Invalidation, Not Entry | IoSnapChart",
  description:
    "Amateur traders obsess over finding the perfect entry price. Professional traders begin with the invalidation point. Here is why structural invalidation dictates longevity.",
};

export default function WhyAGoodPlanStartsWithInvalidationPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Why a Good Trading Plan Starts With Invalidation, Not Entry",
    description:
      "Amateur traders obsess over finding the perfect entry price. Professional traders begin with the invalidation point. Here is why structural invalidation dictates longevity.",
    author: {
      "@type": "Organization",
      name: "IoSnapChart Research",
    },
    publisher: {
      "@type": "Organization",
      name: "IoSnapChart",
      url: "https://iosnapchart.com",
    },
    datePublished: "2026-10-30",
    dateModified: "2026-10-30",
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-[var(--text-1)] text-xs sm:text-sm leading-relaxed">
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
          <span className="text-[var(--candle)]">Risk Philosophy</span>
          <span>·</span>
          <span>6 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-0)] font-sans leading-tight">
          Why a Good Trading Plan Starts With Invalidation, Not Entry
        </h1>
        <p className="text-base text-[var(--text-2)] leading-relaxed">
          The natural cognitive impulse of retail traders is to ask: <em>&quot;Where do I buy to get rich?&quot;</em> A professional risk manager asks: <em>&quot;At what exact price is my trade hypothesis completely dead?&quot;</em>
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-0)] font-sans">
          1. The Illusion of the Perfect Entry
        </h2>
        <p>
          Retail trading media is obsessed with entry indicators: double golden crosses, RSI divergence arrows, or holy-grail candlestick signals. However, entering a trade is effortless. Anyone can click the buy button.
        </p>
        <p>
          The profitability of a trading strategy is determined not by where you get in, but by <strong>how much capital you surrender when the market disagrees with you</strong>. If you enter with no clear thesis on where the setup fails, your exit will be governed by emotional pain rather than technical logic.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-0)] font-sans">
          2. Defining Structural Invalidation
        </h2>
        <p>
          An <strong>invalidation point</strong> is not an arbitrary dollar amount or random percentage drop (e.g. &quot;I will exit if I lose $200&quot;). A true invalidation level is an objective technical price boundary that shatters the underlying reason for entering the trade.
        </p>
        <div className="p-4 rounded-lg bg-[var(--bg-1)] border border-[var(--line)] space-y-2 text-xs font-mono">
          <div className="font-bold text-[var(--text-0)]">Examples of Structural Invalidation:</div>
          <ul className="list-disc pl-4 space-y-1.5 text-[var(--text-1)]">
            <li><strong>Trend Pullback Long:</strong> Invalidation occurs if price closes below the higher-low swing pivot that established the uptrend.</li>
            <li><strong>Breakout &amp; Retest:</strong> Invalidation occurs if price breaks back into the prior trading range and prints acceptance below former resistance.</li>
            <li><strong>Opening Drive:</strong> Invalidation occurs if the 15-minute opening candle low is breached with expanding volume.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-0)] font-sans">
          3. How Invalidation Dictates Position Sizing
        </h2>
        <p>
          Once your invalidation boundary is identified on the chart, position sizing becomes purely mechanical:
        </p>
        <div className="p-4 rounded-lg bg-[var(--bg-0)] border border-[var(--line)] text-center font-mono text-xs font-bold text-[var(--candle)]">
          Shares / Contracts = Maximum Allowed Dollar Risk / (Entry Price − Invalidation Price)
        </div>
        <p>
          If your account risk limit is $500 per trade, and the distance between your entry price and your invalidation point is $5.00, your maximum position size is exactly 100 shares. If the distance is $2.50, your position size is 200 shares.
        </p>
        <p>
          By defining invalidation first, your risk is always identical (1.0R), regardless of market volatility or asset class.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-0)] font-sans">
          4. The Invalidation Callout in IoSnapChart
        </h2>
        <p>
          Every trade plan generated by IoSnapChart features a dedicated, prominent <strong>Invalidation Box</strong> highlighted in amber above the trade summary. It explicitly writes out the exact condition that cancels the trade:
        </p>
        <div className="p-4 rounded-xl border border-[var(--amber)]/30 bg-[var(--amber)]/10 text-xs font-mono space-y-1">
          <div className="font-bold text-[var(--amber)]">⚠️ Invalidation Condition Example:</div>
          <div className="text-[var(--text-1)] italic">
            &quot;A 15-minute candle close below 24,120 breaks local market structure and cancels the bullish flag continuation thesis.&quot;
          </div>
        </div>
        <p>
          When price crosses that line, there is no hope, no bargaining, and no moving the stop. The trade is dead, you exit at 1R loss, and your capital remains intact for the next opportunity.
        </p>
      </section>

      <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-base font-bold text-[var(--text-0)]">Get Automated Invalidation Rules on Every Chart</div>
          <div className="text-xs text-[var(--text-2)]">Upload any screenshot or TradingView link to receive an immediate trade plan.</div>
        </div>
        <Link
          href="/app"
          className="px-4 py-2 rounded-lg bg-[var(--candle)] text-black font-semibold text-xs font-mono hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Try It Free →
        </Link>
      </div>

      <footer className="pt-8 border-t border-[var(--line)] text-xs text-[var(--text-2)] space-y-2">
        <p>Published by IoSnapChart Research · Practical Technical Analysis Guides</p>
      </footer>
    </article>
  );
}
