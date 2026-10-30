import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/config/brand";
import { LegalDraftBanner } from "@/components/legal/LegalDraftBanner";

export const metadata: Metadata = {
  title: "Risk Disclosure Statement | IoSnapChart",
  description:
    "Comprehensive risk disclosure statement regarding leverage, derivative trading, volatility, and capital loss.",
};

export default function RiskPage() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-[var(--text-1)] text-xs sm:text-sm leading-relaxed">
      <header className="space-y-3 border-b border-[var(--line)] pb-6">
        <div className="text-xs font-mono text-[var(--bear)] font-semibold uppercase tracking-wider">
          Capital Risk Disclosure
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-0)] font-sans">
          Risk Disclosure Statement
        </h1>
        <p className="text-xs text-[var(--text-2)] font-mono">
          Trading derivatives, equities, foreign exchange, and digital assets involves high risk of loss.
        </p>
      </header>

      <LegalDraftBanner />

      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--text-0)] font-sans">
          1. High-Risk Nature of Trading
        </h2>
        <p>
          Trading stocks, options, futures, foreign exchange (Forex), commodities, and cryptocurrencies carries a high level of risk and may not be suitable for all investors. A substantial percentage of retail client accounts lose money when trading derivatives or leveraged instruments.
        </p>
        <p>
          Before deciding to participate in financial markets, you should carefully consider your investment objectives, level of experience, and personal risk appetite. You could sustain a loss of some or all of your deposited capital; therefore, you should never speculate with money you cannot afford to lose.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--text-0)] font-sans">
          2. Specific Asset Class Risks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[var(--bg-1)] border border-[var(--line)] space-y-2">
            <h3 className="text-xs font-bold text-[var(--text-0)]">Options &amp; Futures (Derivatives)</h3>
            <p className="text-xs text-[var(--text-2)] leading-relaxed">
              Options have finite lifespans and are subject to Theta decay. Out-of-the-money options frequently expire worthless. Unhedged options selling involves potentially unlimited risk. In India, SEBI studies report that over 90% of individual traders in the equity F&amp;O segment incur net financial losses.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--bg-1)] border border-[var(--line)] space-y-2">
            <h3 className="text-xs font-bold text-[var(--text-0)]">Cryptocurrency &amp; Digital Tokens</h3>
            <p className="text-xs text-[var(--text-2)] leading-relaxed">
              Cryptocurrency markets trade 24/7/365 with extreme price volatility, liquidity fluctuations, and lack of statutory deposit insurance. Sudden flash crashes and exchange outages can prevent timely order execution.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--bg-1)] border border-[var(--line)] space-y-2">
            <h3 className="text-xs font-bold text-[var(--text-0)]">Foreign Exchange &amp; Commodities</h3>
            <p className="text-xs text-[var(--text-2)] leading-relaxed">
              Forex trading employs high leverage. A small price move in the underlying pair can lead to large proportional gains or rapid account liquidation. Geopolitical news and macroeconomic releases can create substantial gap risk.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--bg-1)] border border-[var(--line)] space-y-2">
            <h3 className="text-xs font-bold text-[var(--text-0)]">Slippage &amp; Execution Latency</h3>
            <p className="text-xs text-[var(--text-2)] leading-relaxed">
              Technical levels identified on screenshots (support, resistance, entries, stops) are static reference points. Actual live fills with your broker are subject to market spread widening, execution slippage, and gap-downs beyond your stop price.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--text-0)] font-sans">
          3. Technical Invalidation and Stop Loss Reality
        </h2>
        <p>
          While {brand.name} highlights structural invalidation levels, a stop loss does not guarantee total protection against gap risk (such as overnight earnings gaps or weekend geopolitical announcements). You must incorporate conservative position sizing (e.g. 1% to 2% account equity risk per trade) to prevent drawdown accumulation.
        </p>
      </section>

      <footer className="pt-6 border-t border-[var(--line)] flex flex-wrap gap-4 text-xs font-mono text-[var(--text-2)]">
        <Link href="/terms" className="hover:text-[var(--candle)]">Terms of Service</Link>
        <span>·</span>
        <Link href="/privacy" className="hover:text-[var(--candle)]">Privacy Policy</Link>
        <span>·</span>
        <Link href="/disclaimer" className="hover:text-[var(--candle)]">Full Disclaimer</Link>
      </footer>
    </article>
  );
}
