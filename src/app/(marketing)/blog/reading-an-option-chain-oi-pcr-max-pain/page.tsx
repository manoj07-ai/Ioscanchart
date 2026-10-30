import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reading an Option Chain: Open Interest (OI), PCR & Max Pain | IoSnapChart",
  description:
    "A practitioner's guide to deciphering option chains in Indian and US markets. Learn how Open Interest build-up, Put-Call Ratio (PCR), and Max Pain identify institutional support and resistance.",
};

export default function ReadingAnOptionChainPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Reading an Option Chain: Open Interest (OI), PCR & Max Pain",
    description:
      "A practitioner's guide to deciphering option chains in Indian and US markets. Learn how Open Interest build-up, Put-Call Ratio (PCR), and Max Pain identify institutional support and resistance.",
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
          <span className="text-[var(--candle)]">Derivatives &amp; OI</span>
          <span>·</span>
          <span>7 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-0)] font-sans leading-tight">
          Reading an Option Chain: Open Interest, PCR, and Max Pain
        </h1>
        <p className="text-base text-[var(--text-2)] leading-relaxed">
          While retail traders focus strictly on candlestick wicks, institutional market makers leave heavy footprints in the derivative order book. Here is how to read Open Interest (OI) build-up, Put-Call Ratio (PCR), and Max Pain across Indian (NSE) and US options markets.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-0)] font-sans">
          1. Understanding Open Interest (OI) vs Volume
        </h2>
        <p>
          Volume represents the total number of option contracts traded during a single session. Once the trade is executed, volume counts reset to zero at the next morning open.
        </p>
        <p>
          <strong>Open Interest (OI)</strong> represents the total cumulative number of open, unsettled derivative contracts currently held by market participants. When OI grows, institutional money is committing capital and writing positions. When OI drops, positions are being squared off.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-lg border border-[var(--bear)]/30 bg-[var(--bear)]/5 space-y-1">
            <div className="font-bold text-[var(--bear)]">Heavy Call OI Strike = Resistance</div>
            <div className="text-[var(--text-2)]">Large institutional option sellers have written call options and will defend that strike from closing above their breakeven.</div>
          </div>
          <div className="p-3.5 rounded-lg border border-[var(--candle)]/30 bg-[var(--candle)]/5 space-y-1">
            <div className="font-bold text-[var(--candle)]">Heavy Put OI Strike = Support</div>
            <div className="text-[var(--text-2)]">Substantial put writing establishes a solid floor where option sellers expect prices to remain supported.</div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-0)] font-sans">
          2. The Put-Call Ratio (PCR) Contrarian Indicator
        </h2>
        <p>
          The Put-Call Ratio is calculated by dividing total open interest of Put options by total open interest of Call options across an expiry cycle:
        </p>
        <div className="p-4 rounded-lg bg-[var(--bg-1)] border border-[var(--line)] font-mono text-xs text-center font-bold text-[var(--candle)]">
          PCR = Total Put Open Interest / Total Call Open Interest
        </div>
        <p>
          Because option writers are predominantly well-capitalized institutions, extreme readings act as powerful contrarian signals:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>PCR &lt; 0.65 (Deeply Oversold):</strong> Retail market participants are panicking and purchasing expensive puts. Institutional writers have saturated call writing. Often precedes sharp short-covering rallies.</li>
          <li><strong>PCR between 0.90 and 1.10 (Neutral Equilibrium):</strong> Balanced two-sided market. Technical price action rules dictate directional bias.</li>
          <li><strong>PCR &gt; 1.40 (Overbought / Frothy):</strong> Excessive put writing and retail euphoria. The market becomes vulnerable to sudden long-liquidation flushes.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-0)] font-sans">
          3. Max Pain Theory on Weekly &amp; Monthly Expiries
        </h2>
        <p>
          The <strong>Max Pain</strong> strike is the specific price point where the maximum number of outstanding option contracts (both calls and puts) expire completely worthless.
        </p>
        <p>
          As expiry approaches (especially during the final 2 hours of Thursday NIFTY expiries or Friday US monthly OPEX), spot price frequently gravitates toward the Max Pain cluster like a magnet. Option sellers delta-hedge their books to push spot toward this strike to retain the maximum accrued premium.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-0)] font-sans">
          4. How IoSnapChart Integrates OI With Price Charts
        </h2>
        <p>
          Whenever our engine detects an options-eligible instrument (like NIFTY, BANKNIFTY, or SPY), it pairs visual candlestick charts with an interactive <strong>Options View</strong>:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Visual horizontal bars representing primary Call and Put open interest strikes.</li>
          <li>Live Put-Call Ratio (PCR) sentiment evaluation.</li>
          <li>A client-side interactive <strong>defined-risk payoff diagram</strong> (max gain, max loss, and breakeven boundaries) for suggested vertical spreads.</li>
        </ul>
      </section>

      <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-base font-bold text-[var(--text-0)]">Analyze Options Structure on Your Chart</div>
          <div className="text-xs text-[var(--text-2)]">Instant technical scenarios with built-in options &amp; open interest mapping.</div>
        </div>
        <Link
          href="/markets/india-options"
          className="px-4 py-2 rounded-lg bg-[var(--candle)] text-black font-semibold text-xs font-mono hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          View Options Pack →
        </Link>
      </div>

      <footer className="pt-8 border-t border-[var(--line)] text-xs text-[var(--text-2)] space-y-2">
        <p>Published by IoSnapChart Research · Practical Technical Analysis Guides</p>
      </footer>
    </article>
  );
}
