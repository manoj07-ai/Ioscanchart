import React from "react";
import type { Metadata } from "next";
import { Shield, Calendar, Target, Tag } from "lucide-react";
import { JournalPage } from "@/components/journal/JournalPage";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "Free Trading Journal & P&L Calendar Tool (No Signup Required) | IoSnapChart",
  description:
    "Free interactive online trading journal and P&L calendar. Log trades, track your equity curve, review R-multiples, and export to CSV without creating an account.",
  keywords: [
    "free trading journal",
    "trading p&l calendar",
    "online trading log",
    "free trade tracker",
    "guest trading journal",
    "r multiple calculator",
  ],
  openGraph: {
    title: "Free Trading Journal & P&L Calendar Tool | IoSnapChart",
    description:
      "Free interactive trading journal with month calendar, running equity curve, and mistake tracking. No signup required.",
    url: `https://${brand.domain}/tools/trading-journal`,
    type: "website",
  },
  alternates: {
    canonical: `https://${brand.domain}/tools/trading-journal`,
  },
};

export default function GuestJournalToolPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "IoSnapChart Free Trading Journal Tool",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free browser-based trading journal featuring an interactive P&L calendar, running equity curve, mistake tags, and CSV import/export without requiring account creation.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen pb-16">
        {/* Tool Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[var(--bg-2)] border border-[var(--line)] text-[var(--candle)]">
            <Shield className="w-3.5 h-3.5 text-[var(--candle)] shrink-0" />
            <span>100% Client-Side · Private Guest Mode</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-0)] font-sans">
            Free Trading Journal & P&L Calendar
          </h1>
          <p className="text-sm text-[var(--text-2)] max-w-3xl leading-relaxed">
            Record executions, inspect day-by-day profit distribution, and uncover psychological leaks. All data is kept securely in your local browser storage.
          </p>
        </div>

        {/* Master Journal Component in Guest Mode */}
        <JournalPage mode="local" isGuest={true} />

        {/* SEO Explanatory Content Below the Tool */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-16 pt-12 border-t border-[var(--line)] space-y-10 text-xs sm:text-sm text-[var(--text-1)] leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-0)] tracking-tight">
              Why Keep a Trading Journal?
            </h2>
            <p>
              In professional proprietary trading desks and hedge funds, journaling is not an optional hobby—it is the single source of truth that distinguishes calculated risk-taking from compulsive gambling. Most retail market participants fail not because their chart setups are flawed, but because they have no objective record of their execution mistakes, risk sizing errors, and emotional overrides.
            </p>
            <p>
              By tracking your trades in an interactive P&L calendar, you immediately visualize trading clusters, win/loss patterns by day of the week, and whether your profitability stems from disciplined execution or random variance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] space-y-2">
              <Calendar className="w-5 h-5 text-[var(--candle)]" />
              <h3 className="text-sm font-bold text-[var(--text-0)]">P&L Calendar Visualization</h3>
              <p className="text-xs text-[var(--text-2)] leading-relaxed">
                Transform abstract numbers into intuitive daily profit-and-loss tinting. Spot consecutive losing streaks early and protect mental capital.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] space-y-2">
              <Target className="w-5 h-5 text-[var(--candle)]" />
              <h3 className="text-sm font-bold text-[var(--text-0)]">R-Multiple Consistency</h3>
              <p className="text-xs text-[var(--text-2)] leading-relaxed">
                Dollar figures distort discipline. Toggle between fiat P&L and risk-adjusted R-multiples to compare trades across different account balances.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] space-y-2">
              <Tag className="w-5 h-5 text-[var(--candle)]" />
              <h3 className="text-sm font-bold text-[var(--text-0)]">Mistake Tagging</h3>
              <p className="text-xs text-[var(--text-2)] leading-relaxed">
                Tag trades with common psychological leaks like FOMO, moved stops, or oversized positions to identify exactly which behavioral habits drain your capital.
              </p>
            </div>
          </div>

          <div className="space-y-3 p-6 rounded-xl border border-[var(--line)] bg-[var(--bg-1)]/60">
            <h3 className="text-sm font-bold text-[var(--text-0)]">Zero Signup & Full Data Portability</h3>
            <p className="text-xs text-[var(--text-2)] leading-relaxed">
              This free tool runs entirely on your machine. You can export your trades to standard CSV at any time or import existing trading logs from Microsoft Excel, Google Sheets, or your broker. When you are ready to sync across mobile devices and link automated AI chart breakdowns, you can seamlessly migrate your trades into an account.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
