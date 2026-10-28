import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Win Rate vs Expectancy: Why a 40% Win Rate Can Be World-Class (2026)",
  description:
    "The mathematical reality of asymmetric risk-reward in trading. Why high win rate strategies often blow up and how to calculate trading expectancy in R-multiples.",
};

export default function WinRateVsExpectancyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Win Rate vs Expectancy: Why a 40% Win Rate Can Be World-Class",
    description:
      "The mathematical reality of asymmetric risk-reward in trading. Why high win rate strategies often blow up and how to calculate trading expectancy in R-multiples.",
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

  const MATRIX = [
    { winRate: "30%", rr1: "-0.40R", rr2: "-0.10R", rr25: "+0.05R", rr3: "+0.20R", viable: "Viable with ≥ 2.5R" },
    { winRate: "40%", rr1: "-0.20R", rr2: "+0.20R", rr25: "+0.40R", rr3: "+0.60R", viable: "Highly profitable with ≥ 2.0R" },
    { winRate: "50%", rr1: "0.00R", rr2: "+0.50R", rr25: "+0.75R", rr3: "+1.00R", viable: "Standard benchmark" },
    { winRate: "60%", rr1: "+0.20R", rr2: "+0.80R", rr25: "+1.10R", rr3: "+1.40R", viable: "Exceptional" },
    { winRate: "70%", rr1: "+0.40R", rr2: "+1.10R", rr25: "+1.45R", rr3: "+1.80R", viable: "Rare; high risk of curve-fitting" },
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
          <span className="text-[var(--candle)]">Risk Mathematics</span>
          <span>·</span>
          <span>6 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-0)] font-sans leading-tight">
          Win Rate vs Expectancy: Why a 40% Win Rate Can Still Work
        </h1>
        <p className="text-base text-[var(--text-2)] leading-relaxed">
          The natural human ego craves being right on every trade. But in financial markets, seeking a 90% win rate is the fastest road to catastrophic drawdown. Here is the mathematical framework behind positive expectancy.
        </p>
      </div>

      {/* Expectancy Formula Hero */}
      <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] space-y-4 font-mono text-xs">
        <div className="text-[var(--candle)] font-bold text-sm tracking-wide uppercase">
          The Expectancy Formula (Normalized in R-Units)
        </div>
        <div className="p-4 rounded-lg bg-[var(--bg-0)] border border-[var(--line)] text-center text-sm sm:text-base text-[var(--text-0)] font-bold">
          E = (Win Rate × Average Win R) − (Loss Rate × Average Loss R)
        </div>
        <p className="text-xs text-[var(--text-2)] leading-relaxed font-sans">
          Where <strong>E</strong> is the expected return per trade in R-multiples. If your planned risk is 1R ($500), an expectancy of <strong>+0.40R</strong> means that across a statistically valid sample, every trade you execute yields an average theoretical profit of $200, regardless of the individual trade outcome.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-0)]">
          1. The Siren Song of the 90% Win Rate
        </h2>
        <p className="leading-relaxed">
          Retail trading scams and social media algorithms exploit a cognitive weakness: people equate winning percentage with intelligence and safety. However, an 85% win rate system that takes profits at +0.2R but allows losers to run unmanaged to -5.0R will inevitably encounter a &quot;black swan&quot; sequence that eradicates months of gains in an afternoon.
        </p>
        <div className="p-4 rounded-lg border border-[var(--down)]/30 bg-[var(--down)]/5 space-y-2 text-xs font-mono">
          <div className="text-[var(--down)] font-bold">The Math of the High Win-Rate Blow-Up:</div>
          <div>• 100 Trades: 85 Wins (+0.2R) = +17.0R</div>
          <div>• 15 Losses (-3.0R due to widening stops) = -45.0R</div>
          <div className="text-[var(--down)] font-bold pt-1">• Net Result: -28.0R Total Loss despite an 85% win rate!</div>
        </div>
        <p className="leading-relaxed">
          High win-rate strategies frequently achieve their high score by holding underwater positions until they bounce back to breakeven. When a structural market shift occurs, those unresolved paper losses convert into total account liquidation.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-0)]">
          2. The 40% Win Rate Engine
        </h2>
        <p className="leading-relaxed">
          Consider a systematic breakout trader or momentum trend-follower operating at a modest <strong>40% win rate</strong>, but with strict risk management ensuring losses are capped at exactly -1.0R while runners reach +2.5R:
        </p>
        <div className="p-4 rounded-lg border border-[var(--up)]/30 bg-[var(--up)]/5 space-y-2 text-xs font-mono">
          <div className="text-[var(--up)] font-bold">The Math of Disciplined Asymmetry:</div>
          <div>• 100 Trades: 40 Wins (+2.5R) = +100.0R</div>
          <div>• 60 Losses (-1.0R capped stop) = -60.0R</div>
          <div className="text-[var(--up)] font-bold pt-1">• Net Realized Return: +40.0R Net Profit across 100 trades!</div>
          <div className="text-[var(--text-2)]">Expectancy E = (0.40 × 2.5) − (0.60 × 1.0) = 1.00 − 0.60 = +0.40R per trade.</div>
        </div>
        <p className="leading-relaxed">
          This trader is wrong 60% of the time, yet generates outstanding, compounding returns because their downside is capped while their upside is asymmetric.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-0)]">
          3. Expectancy Matrix: Win Rate vs Risk-Reward
        </h2>
        <p className="leading-relaxed">
          Use this lookup matrix to determine the minimum risk-to-reward ratio required to generate positive expectancy at your current win rate:
        </p>

        <div className="overflow-x-auto border border-[var(--line)] rounded-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[var(--bg-2)] border-b border-[var(--line)] text-[var(--text-0)]">
              <tr>
                <th className="p-3">Win Rate</th>
                <th className="p-3">At 1:1 RR</th>
                <th className="p-3">At 1:2 RR</th>
                <th className="p-3">At 1:2.5 RR</th>
                <th className="p-3">At 1:3 RR</th>
                <th className="p-3">Practitioner Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)] text-[var(--text-1)]">
              {MATRIX.map((row) => (
                <tr key={row.winRate} className="hover:bg-[var(--bg-2)]/40 transition-colors">
                  <td className="p-3 font-bold text-[var(--text-0)]">{row.winRate}</td>
                  <td className={`p-3 ${row.rr1.startsWith("-") ? "text-[var(--down)]" : "text-[var(--text-1)]"}`}>{row.rr1}</td>
                  <td className={`p-3 ${row.rr2.startsWith("-") ? "text-[var(--down)]" : "text-[var(--up)]"}`}>{row.rr2}</td>
                  <td className="p-3 text-[var(--up)] font-semibold">{row.rr25}</td>
                  <td className="p-3 text-[var(--up)] font-bold">{row.rr3}</td>
                  <td className="p-3 text-xs text-[var(--text-2)] font-sans">{row.viable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-0)]">
          4. How to Audit Your Expectancy in IoSnapChart
        </h2>
        <p className="leading-relaxed">
          In IoSnapChart’s trading journal, we calculate your true mathematical expectancy automatically once you reach a statistically valid sample of 10 or more trades:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed text-[var(--text-1)]">
          <li><strong>Sample Size Guardrails:</strong> We never display misleading win rate percentages or expectancy metrics when trade counts are under 10, protecting you from premature conclusions based on small sample variance.</li>
          <li><strong>Breakeven Exclusion:</strong> Breakeven trades (P&L = $0) are excluded from the win rate denominator, preventing artificial dilution of your win/loss statistics.</li>
          <li><strong>Cumulative R Equity Curve:</strong> View your equity curve measured in R-units rather than currency to verify that your edge is real and not an artifact of increasing position sizes.</li>
        </ul>
      </section>

      <div className="pt-6 border-t border-[var(--line)]">
        <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-base font-bold text-[var(--text-0)]">Calculate Your Trading Expectancy</div>
            <div className="text-xs text-[var(--text-2)]">Test your historical trades with our free, offline P&L calendar tool.</div>
          </div>
          <Link
            href="/tools/trading-journal"
            className="px-4 py-2 rounded-lg bg-[var(--candle)] text-black font-semibold text-xs font-mono hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Open Free Journal Tool →
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
