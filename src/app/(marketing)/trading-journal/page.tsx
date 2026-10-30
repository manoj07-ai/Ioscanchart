import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { BookOpen, Download } from "lucide-react";
import { brand } from "@/config/brand";
import { SHORT_DISCLAIMER } from "@/config/legal";
import { CalendarPreview } from "@/components/journal/CalendarPreview";

export const metadata: Metadata = {
  title: "Free Trading Journal & P&L Calendar Template | IoSnapChart",
  description:
    "Master execution discipline with a modern trading journal and P&L calendar. Learn what to record, review trade expectancy, and access our free interactive journal tool.",
  keywords: [
    "trading journal",
    "free trading journal template",
    "trading p&l calendar",
    "how to keep a trading journal",
    "trading log template excel csv",
    "trade tracker",
  ],
  alternates: {
    canonical: `https://${brand.domain}/trading-journal`,
  },
};

const FAQ_ITEMS = [
  {
    q: "Why should I use a trading journal instead of just checking my broker statements?",
    a: "Broker statements only show financial transactions, commissions, and final profit/loss. They record *what* happened, but they reveal nothing about *why* it happened. A trading journal captures the qualitative context: your setup reasoning, emotional state, plan adherence, mistake triggers (such as FOMO or moving stops), and risk-to-reward ratios. You cannot systematically improve without this qualitative feedback loop.",
  },
  {
    q: "What is an R-multiple, and why is it better than tracking dollars?",
    a: "An R-multiple expresses trade profit or loss in units of planned risk rather than raw currency. If you risk $100 and gain $250, that trade is +2.5R. If you lose your planned $100, it is -1.0R. Tracking in R normalizes performance across fluctuating account balances, prevents emotional distortions from large dollar numbers, and allows you to measure mathematical expectancy accurately.",
  },
  {
    q: "Is the guest journal tool really free without signing up?",
    a: "Yes. Our guest journal tool runs 100% locally in your browser storage. You can log trades, inspect calendar heatmaps, review equity curves, and import/export CSV files without creating an account or providing an email address.",
  },
  {
    q: "How many trades do I need to calculate a statistically reliable win rate?",
    a: "In quantitative analysis and statistical sampling, small sample sizes produce massive variance. A trader who wins 4 out of their first 5 trades does not possess an 80% edge; they possess a tiny sample. IoSnapChart strictly suppresses win-rate percentages and profit factor metrics until you have logged at least 10 decided trades, preventing dangerous overconfidence.",
  },
  {
    q: "Can I import my existing trades from Excel or other platforms?",
    a: "Yes. Our journal provides a standard CSV import engine. You can upload any CSV containing Date, Symbol, and P&L columns, and our parser will automatically map and validate each row.",
  },
  {
    q: "How often should I review my trading journal?",
    a: "We recommend a quick 2-minute entry immediately after closing each position while your memory is fresh, followed by a dedicated 20-minute weekly review every Saturday or Sunday to analyze your mistake tags, best/worst setups, and rule adherence.",
  },
];

export default function TradingJournalPillarPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `https://${brand.domain}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Trading Journal",
        item: `https://${brand.domain}/trading-journal`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16 text-[var(--text-1)]">
        {/* 1. Hero Section */}
        <section className="text-center space-y-5 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[var(--bg-2)] border border-[var(--line)] text-[var(--candle)]">
            <BookOpen className="w-3.5 h-3.5 text-[var(--candle)]" />
            <span>Comprehensive Trading Journal Guide &amp; Tool</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-0)] max-w-4xl mx-auto leading-tight">
            The Complete Guide to Keeping a Professional Trading Journal
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-2)] max-w-2xl mx-auto leading-relaxed">
            Discover why elite traders treat their trade log as an operational balance sheet. Track risk, eliminate repetitive mistakes, and visualize your edge with a modern P&amp;L calendar.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link href="/tools/trading-journal">
              <Button variant="primary-gradient" size="lg" className="font-semibold px-6">
                Open Free Journal Tool →
              </Button>
            </Link>

            <a href="/downloads/trading-journal-template.csv" download>
              <Button variant="secondary" size="lg" className="font-medium px-5 flex items-center gap-2">
                <span>Download CSV Template</span>
                <Download className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </section>

        {/* 2. Interactive Calendar Sample Preview (Labelled Sample) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-[var(--candle)] uppercase tracking-wider">
              Sample Calendar Preview (Interactive Demo)
            </span>
            <span className="text-[var(--text-2)] italic text-[11px]">
              Sample data — not real financial results
            </span>
          </div>

          <CalendarPreview />
        </section>

        {/* 3. What Is a Trading Journal and Why It Matters */}
        <section className="space-y-4 text-xs sm:text-sm leading-relaxed">
          <h2 className="text-2xl font-bold text-[var(--text-0)] tracking-tight">
            What Is a Trading Journal?
          </h2>
          <p>
            A trading journal is an objective, systematic log of all your market activities, encompassing both quantitative execution data (entry prices, exit levels, stop losses, position sizes, commissions, and net returns) and qualitative behavioral metrics (setup categorization, thesis invalidation points, mindset ratings, and rule adherence).
          </p>
          <p>
            In retail trading culture, beginners routinely obsess over finding a &quot;holy grail&quot; technical indicator that predicts market direction with flawless precision. However, veteran market operators and trading psychologists consistently demonstrate that long-term survival is governed not by prophetic foresight, but by rigorous feedback loops. If you do not record your decisions, you cannot identify what works, eliminate what fails, or manage drawdown psychology.
          </p>
        </section>

        {/* 4. What to Record: The 15 Core Fields Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-0)] tracking-tight">
            What to Record in Every Trade Log
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            A comprehensive journal bridges mechanical price action and personal execution discipline. Here are the 15 essential data fields utilized by professional trading journals:
          </p>

          <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--bg-1)]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[var(--bg-2)] border-b border-[var(--line)] text-[var(--text-2)] uppercase">
                <tr>
                  <th className="py-3 px-4">Field Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Why It Matters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]/50 text-[var(--text-1)]">
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[var(--text-0)]">Date & Time</td>
                  <td className="py-2.5 px-4">Timestamp</td>
                  <td className="py-2.5 px-4">Establishes daily and hourly clustering; identifies day-of-week performance variance.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[var(--text-0)]">Instrument / Ticker</td>
                  <td className="py-2.5 px-4">Text</td>
                  <td className="py-2.5 px-4">Reveals which assets provide your true statistical edge versus which drain capital.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[var(--text-0)]">Direction</td>
                  <td className="py-2.5 px-4">Long / Short</td>
                  <td className="py-2.5 px-4">Detects directional bias (e.g., struggling to short in bull trends or buying falling knives).</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[var(--text-0)]">Entry & Exit Price</td>
                  <td className="py-2.5 px-4">Numeric</td>
                  <td className="py-2.5 px-4">Tracks slippage, execution quality, and precision relative to key technical levels.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[var(--text-0)]">Position Size & Fees</td>
                  <td className="py-2.5 px-4">Numeric</td>
                  <td className="py-2.5 px-4">Ensures adherence to fixed 1% account risk sizing and accounts for brokerage and transaction taxes.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[var(--text-0)]">Planned Stop Loss</td>
                  <td className="py-2.5 px-4">Numeric</td>
                  <td className="py-2.5 px-4">The structural market level where the trade idea was mathematically proven false.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[var(--text-0)]">R-Multiple</td>
                  <td className="py-2.5 px-4">Numeric (R)</td>
                  <td className="py-2.5 px-4">Normalizes trade outcome against risk (e.g., +2.5R gain vs -1.0R loss).</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[var(--text-0)]">Setup Tag</td>
                  <td className="py-2.5 px-4">Categorical</td>
                  <td className="py-2.5 px-4">Tags model pattern: Trend pullback, Breakout retest, Supply rejection, or Liquidity sweep.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[var(--text-0)]">Mistake Tag</td>
                  <td className="py-2.5 px-4">Categorical</td>
                  <td className="py-2.5 px-4">Flags errors: FOMO entry, widening stops, revenge trading, or cutting winners early.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[var(--text-0)]">Plan Followed?</td>
                  <td className="py-2.5 px-4">Yes / Partly / No</td>
                  <td className="py-2.5 px-4">Isolates pure execution discipline from random market luck.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. How to Conduct a High-Impact Weekly Review */}
        <section className="space-y-4 text-xs sm:text-sm leading-relaxed">
          <h2 className="text-2xl font-bold text-[var(--text-0)] tracking-tight">
            The 4-Step Weekly Review Ritual
          </h2>
          <p>
            Logging trades during market hours is only half the battle. The transformative power of journaling occurs during the quiet weekend review. Every Saturday or Sunday, execute this 4-step framework:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] space-y-1.5">
              <span className="font-mono text-xs font-bold text-[var(--candle)]">Step 1: Audit Plan Adherence</span>
              <p className="text-xs text-[var(--text-2)] leading-relaxed">
                Filter your journal for trades where &quot;Followed Plan&quot; was marked &quot;No&quot;. Calculate the net P&L of those undisciplined trades. In over 80% of accounts, eliminating non-plan trades immediately transforms an unprofitable trader into a breakeven or profitable operator.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] space-y-1.5">
              <span className="font-mono text-xs font-bold text-[var(--candle)]">Step 2: Review Mistake Frequency</span>
              <p className="text-xs text-[var(--text-2)] leading-relaxed">
                Inspect your mistake tags breakdown. Did you suffer 3 FOMO entries on Thursday? Did you move a stop loss on Tuesday? Identify the single most expensive error of the week and set a specific prevention rule for the upcoming Monday.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] space-y-1.5">
              <span className="font-mono text-xs font-bold text-[var(--candle)]">Step 3: Analyze Setup Expectancy</span>
              <p className="text-xs text-[var(--text-2)] leading-relaxed">
                Group your results by setup type. You may find that your &quot;15m Trend Pullback&quot; trades have a 60% win rate with a 2.4 average R, while your &quot;1m Breakout Chases&quot; have a 25% win rate. Double down on what works and prune what loses.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] space-y-1.5">
              <span className="font-mono text-xs font-bold text-[var(--candle)]">Step 4: Check Risk:Reward Math</span>
              <p className="text-xs text-[var(--text-2)] leading-relaxed">
                Ensure your average winner exceeds your average loss (typically 1.5R to 2.5R). If your losses average 1.5R while your wins average only 0.8R, you are cutting winners prematurely and letting losers run.
              </p>
            </div>
          </div>
        </section>

        {/* 6. How to Read a P&L Calendar */}
        <section className="space-y-4 text-xs sm:text-sm leading-relaxed">
          <h2 className="text-2xl font-bold text-[var(--text-0)] tracking-tight">
            How to Read and Interpret a P&L Calendar
          </h2>
          <p>
            A traditional spreadsheet displays trades as endless rows of disconnected text. A P&L calendar condenses your trading month into an intuitive chronological heatmap:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[var(--text-2)]">
            <li>
              <strong className="text-[var(--text-0)]">Green vs. Red Balance:</strong> Profitable days are tinted green, and losing days are tinted coral red. A sustainable trading career does not require 100% green days; it requires that red days remain small, controlled, and well within single-day loss limits.
            </li>
            <li>
              <strong className="text-[var(--text-0)]">Intensity Scaling:</strong> Visual shading dynamically deepens on days with outsized profit or loss. If a single red day exhibits extreme shading that wipes out five previous green days, your risk management parameters are dangerously asymmetrical.
            </li>
            <li>
              <strong className="text-[var(--text-0)]">Consecutive Red Clusters:</strong> Losing streaks are mathematically inevitable. When you observe two consecutive red days on your calendar, professional risk protocol dictates cutting position size by 50% until psychological clarity returns.
            </li>
          </ul>
        </section>

        {/* 7. Journal vs. Spreadsheet Comparison */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-0)] tracking-tight">
            Dedicated Trading Journal vs. Generic Spreadsheet
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            While many traders begin with Microsoft Excel or Google Sheets, manual spreadsheets quickly become cumbersome. Here is an honest, objective comparison:
          </p>

          <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--bg-1)]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[var(--bg-2)] border-b border-[var(--line)] text-[var(--text-2)] uppercase">
                <tr>
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4">Manual Spreadsheet (Excel/Sheets)</th>
                  <th className="py-3 px-4 text-[var(--candle)]">IoSnapChart Trading Journal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]/50 text-[var(--text-1)]">
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[var(--text-0)]">P&L Calendar Visualization</td>
                  <td className="py-2.5 px-4 text-[var(--text-2)]">Requires complex conditional formatting scripts.</td>
                  <td className="py-2.5 px-4 text-[var(--candle)] font-semibold">Automatic native month heatmap with 3-tier intensity.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[var(--text-0)]">AI Plan vs. Actual Tracking</td>
                  <td className="py-2.5 px-4 text-[var(--text-2)]">Impossible without manual note transcription.</td>
                  <td className="py-2.5 px-4 text-[var(--candle)] font-semibold">One-click linking directly to AI chart breakdowns.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[var(--text-0)]">Statistical Honesty Guard</td>
                  <td className="py-2.5 px-4 text-[var(--text-2)]">Shows misleading 100% win rate on 1 trade.</td>
                  <td className="py-2.5 px-4 text-[var(--candle)] font-semibold">Suppresses win rate percentages under 10 trades.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[var(--text-0)]">Privacy Mode for Socials</td>
                  <td className="py-2.5 px-4 text-[var(--text-2)]">Must manually hide rows or edit screenshots.</td>
                  <td className="py-2.5 px-4 text-[var(--candle)] font-semibold">Single-click toggle blurs all monetary figures.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[var(--text-0)]">Data Ownership & Portability</td>
                  <td className="py-2.5 px-4 text-[var(--candle)] font-semibold">Stored locally on your computer.</td>
                  <td className="py-2.5 px-4 text-[var(--candle)] font-semibold">Full CSV import & export + 100% offline guest mode.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 8. Frequently Asked Questions (FAQ) */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-0)] tracking-tight">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] space-y-2"
              >
                <h3 className="text-sm font-bold text-[var(--text-0)]">{item.q}</h3>
                <p className="text-xs text-[var(--text-2)] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Final CTA & Disclaimer */}
        <section className="p-8 rounded-2xl border border-[var(--line)] bg-[var(--bg-1)] text-center space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-0)]">
            Start Your Professional Trading Journal Today
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-2)] max-w-xl mx-auto">
            Take control of your execution discipline. Try our free guest-mode tool with zero signup, or download our standard CSV journal template.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/tools/trading-journal">
              <Button variant="primary-gradient" size="lg" className="font-semibold px-6">
                Launch Free Journal Tool →
              </Button>
            </Link>
            <Link href="/app">
              <Button variant="secondary" size="lg" className="font-medium px-5">
                Analyze a Chart First
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t border-[var(--line)] text-[11px] text-[var(--text-2)]">
            <p>{SHORT_DISCLAIMER}</p>
          </div>
        </section>
      </article>
    </>
  );
}
