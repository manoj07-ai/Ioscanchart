import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";
import { brand } from "@/config/brand";
import { SHORT_DISCLAIMER } from "@/config/legal";
import { CalendarPreview } from "@/components/journal/CalendarPreview";

export interface MarketJournalData {
  slug: string;
  name: string;
  headline: string;
  badge: string;
  description: string;
  specificFields: { field: string; purpose: string }[];
  marketPitfalls: { title: string; explanation: string }[];
  faqs: { q: string; a: string }[];
  contentSections: { title: string; text: string }[];
}

export const MARKET_PAGES: Record<string, MarketJournalData> = {
  forex: {
    slug: "forex",
    name: "Forex Trading Journal",
    headline: "Track Pips, Spreads, and Session Overlaps with Precision",
    badge: "Foreign Exchange (FX)",
    description:
      "A specialized trading journal built for currency traders. Track pip values, major trading sessions (London, New York, Tokyo), overnight rollover swap rates, and high-impact macroeconomic news releases.",
    specificFields: [
      { field: "Session Overlap", purpose: "Records whether trade occurred in London/NY peak liquidity or low-volume Asian range." },
      { field: "Pip Multiplier & Slippage", purpose: "Measures exact spread widening during news releases like US NFP or CPI." },
      { field: "Swap / Financing Fee", purpose: "Tracks carry trade costs or credits on multi-day swing positions." },
    ],
    marketPitfalls: [
      {
        title: "Ignoring Spread Widening at 5 PM New York Roll",
        explanation: "During the 5:00 PM ET bank rollover, liquidity evaporates and broker spreads on major pairs like EURUSD can widen 5x to 10x, triggering stops on otherwise sound technical ideas.",
      },
      {
        title: "Trading Through Tier-1 Red Folder News Events",
        explanation: "Holding tight stop losses through Non-Farm Payrolls (NFP) or Central Bank interest rate releases exposes your account to devastating slippage and order rejection.",
      },
      {
        title: "Over-Trading Correlated Currency Pairs",
        explanation: "Entering Long on EURUSD, GBPUSD, and AUDUSD simultaneously is not diversification—it is a 3x leveraged short dollar bet that amplifies drawdown exponentially.",
      },
    ],
    faqs: [
      {
        q: "How should I record pip value in a forex journal?",
        a: "In standard lots (100,000 units), 1 pip on EURUSD equals $10.00. Our journal allows you to enter both your cash P&L and your R-multiple, standardizing pip risk across standard, mini, or micro lots.",
      },
      {
        q: "Why is session timing critical for forex logging?",
        a: "Currency pairs exhibit distinct volatility regimes. Breakout strategies on GBPJPY excel during the London open (08:00–12:00 GMT) but routinely chop into false breakouts during late Asian hours.",
      },
    ],
    contentSections: [
      {
        title: "Mastering the Forex Execution Rhythm",
        text: "The decentralized foreign exchange market operates 24 hours a day, 5 days a week. Unlike equities with distinct opening bells, FX liquidity ebbs and flows as financial hubs open across Frankfurt, London, New York, Tokyo, and Sydney. Successful currency journaling requires tracking not just price levels, but the exact session regime in which setups are initiated.",
      },
      {
        title: "Managing Currency Correlation and Macro Spillovers",
        text: "Every currency trade involves two sovereign currencies influenced by interest rate differentials, bond yields, and geopolitical risk. By logging macroeconomic catalysts and monitoring pair correlations in your journal, you prevent unintentional leverage buildup across intertwined currency pairs.",
      },
    ],
  },

  crypto: {
    slug: "crypto",
    name: "Crypto Trading Journal",
    headline: "24/7 Volatility, Funding Rates, and Liquidity Sweep Tracking",
    badge: "Cryptocurrency & Derivatives",
    description:
      "Built for Bitcoin, Ethereum, and altcoin spot and perpetual futures traders. Log funding rates, weekend range sweeps, maker/taker exchange fees, and high-beta liquidation momentum.",
    specificFields: [
      { field: "Perpetual Funding Rate", purpose: "Tracks 8-hour funding payments between long and short contract holders." },
      { field: "Weekend vs. Weekday Flag", purpose: "Isolates thin weekend order book manipulation from institutional weekday volume." },
      { field: "Leverage & Margin Type", purpose: "Records cross vs isolated margin parameters and precise liquidation distance." },
    ],
    marketPitfalls: [
      {
        title: "The Weekend Liquidity Trap",
        explanation: "CME Bitcoin futures close on Friday afternoon, leaving crypto order books thin over Saturday and Sunday. Weekend breakouts frequently act as liquidity bait that mean-reverts violently on Sunday evening.",
      },
      {
        title: "Unaccounted Perpetual Funding Drain",
        explanation: "Holding leveraged long positions in raging bull markets can bleed 0.1% to 0.3% per day in funding payments, rapidly eroding swing profit margins.",
      },
      {
        title: "Trading Low-Liquidity Altcoins with Market Orders",
        explanation: "Market orders on lower-cap tokens suffer severe price impact and exchange slippage that can instantly eliminate a planned 1:2 risk/reward ratio.",
      },
    ],
    faqs: [
      {
        q: "Does this journal support weekend calendar views?",
        a: "Yes. Simply toggle on the '7D' switch in the calendar header to view full Saturday and Sunday columns, ensuring 24/7 crypto executions are fully accounted for.",
      },
      {
        q: "How should I record crypto exchange fees?",
        a: "Taker fees on crypto exchanges typically range from 0.04% to 0.075%. Our detailed fills accordion includes a dedicated fees input to calculate true net P&L after fees.",
      },
    ],
    contentSections: [
      {
        title: "Surviving the 24/7 Digital Asset Crucible",
        text: "Cryptocurrency markets never close. While perpetual availability offers freedom, it introduces extreme trader fatigue and emotional burnout. A disciplined crypto journal forces you to audit your screen time, compare weekday profitability against weekend chops, and verify whether late-night trades yield positive mathematical expectancy.",
      },
      {
        title: "Liquidation Cascades and Order Book Dynamics",
        text: "Crypto price discovery is uniquely driven by forced margin liquidations. When stop orders cluster around prior swing highs or lows, algorithmic market makers engineer liquidity sweeps. Tagging your setups with 'Liquidity sweep' or 'Range reversal' reveals your true edge in high-beta regimes.",
      },
    ],
  },

  stocks: {
    slug: "stocks",
    name: "Stock & ETF Trading Journal",
    headline: "Pre-Market Gaps, Earnings Catalysts, and Sector Rotation Logging",
    badge: "Equities & ETFs",
    description:
      "Designed for NYSE and NASDAQ swing and day traders. Track earnings announcements, pre-market relative volume, sector rotation, market breadth internals, and multi-day momentum.",
    specificFields: [
      { field: "Relative Volume (RVOL)", purpose: "Measures whether trading volume is above average to validate institutional sponsorship." },
      { field: "Earnings Date Proximity", purpose: "Prevents holding unhedged positions into high-volatility quarterly earnings releases." },
      { field: "Sector ETF Correlation", purpose: "Tracks whether stock movement is supported by sector tailwinds (e.g. XLK, SMH, XLE)." },
    ],
    marketPitfalls: [
      {
        title: "Holding Unhedged Overnight Earnings Gaps",
        explanation: "Earnings announcements frequently create 10% to 20% overnight price dislocations that bypass standard stop orders, causing catastrophic capital destruction.",
      },
      {
        title: "Fighting the Prevailing Sector Trend",
        explanation: "Attempting to buy a single semiconductor stock while the semiconductor sector ETF (SMH) is experiencing institutional distribution is a low-probability endeavor.",
      },
      {
        title: "Overtrading the Choppy Mid-Day Lunch Lull",
        explanation: "Between 11:30 AM and 1:30 PM ET, institutional volume dries up. Entering breakout setups during this window results in frequent whipsaws and false breaks.",
      },
    ],
    faqs: [
      {
        q: "Can I log pre-market and after-hours stock trades?",
        a: "Yes. Enter your executed fill price and note the extended-hours context in the notes field to track pre-market execution efficacy.",
      },
      {
        q: "Can I track share position sizing automatically?",
        a: "Yes. Enter your planned stop distance and account risk percentage, and the journal calculates your exact share allocation.",
      },
    ],
    contentSections: [
      {
        title: "Institutional Sponsorship and Stock Selection",
        text: "Individual stocks do not move in isolation. Over 70% of a stock's daily trajectory is dictated by general market direction and its sector peer group. Keeping an equities journal trains you to distinguish genuine institutional accumulation from speculative retail noise.",
      },
      {
        title: "The Importance of Risk-to-Reward in Swing Trading",
        text: "Successful stock swing traders often win only 40% to 50% of their trades. Longevity is achieved by taking 2R to 4R profits on leaders while cutting underperforming laggards at 1R loss without hesitation.",
      },
    ],
  },

  options: {
    slug: "options",
    name: "Options Trading Journal",
    headline: "Greeks, Implied Volatility (IV), and Defined-Risk Payoff Tracking",
    badge: "Equity & Index Options",
    description:
      "Built for option buyers and sellers across US and Indian markets. Track implied volatility rank (IVR), Theta decay, Delta positioning, max pain expiry strikes, and defined-risk spread performance.",
    specificFields: [
      { field: "Implied Volatility Rank (IVR)", purpose: "Dictates whether market conditions favor buying premium (low IV) or selling credit (high IV)." },
      { field: "Days to Expiration (DTE)", purpose: "Monitors non-linear Theta decay curve acceleration in the final 30 days." },
      { field: "Contract Multiplier / Lot Size", purpose: "Accurately scales 100-share US contracts or custom NSE derivative lot sizes." },
    ],
    marketPitfalls: [
      {
        title: "The Implied Volatility (IV) Crush Trap",
        explanation: "Buying out-of-the-money options right before earnings releases causes instant 40%–60% premium collapse post-event, even if the underlying stock moves in your direction.",
      },
      {
        title: "Ignoring Accelerated Theta Decay Near Expiry",
        explanation: "Holding long options with under 7 DTE exposes your capital to rapid non-linear decay that requires massive underlying momentum just to break even.",
      },
      {
        title: "Over-Leveraging Naked Option Writes",
        explanation: "Selling unhedged call or put options yields high win rates until a single black swan tail-risk event obliterates months of accumulated premiums.",
      },
    ],
    faqs: [
      {
        q: "Does this journal support multi-leg option spreads?",
        a: "Yes. You can log net debit/credit premium, contract multiplier, and link directly to our AI options payoff mini-chart breakdown.",
      },
      {
        q: "How does the journal handle option lot sizes?",
        a: "The multiplier field defaults to 100 for standard US equity options, or custom lot sizes (such as 75 for Nifty or 30 for Bank Nifty).",
      },
    ],
    contentSections: [
      {
        title: "Trading the Four Dimensions of Options",
        text: "While stock traders navigate price and direction, option traders must conquer four distinct variables simultaneously: underlying price, time decay (Theta), implied volatility changes (Vega), and interest rate regimes (Rho). Your journal is the essential compass that keeps these multidimensional forces aligned.",
      },
      {
        title: "Defined-Risk Spreads vs. Speculative Gambling",
        text: "Elite options practitioners prioritize defined-risk structures (vertical credit/debit spreads, iron condors, calendar spreads) where maximum potential loss is strictly capped before entry.",
      },
    ],
  },

  futures: {
    slug: "futures",
    name: "Futures & Commodities Trading Journal",
    headline: "Tick Sizes, Point Multipliers, and Margin Discipline",
    badge: "Futures & Commodities",
    description:
      "A high-leverage trading journal for E-mini S&P (ES), Nasdaq (NQ), Crude Oil (CL), Gold (GC), and agricultural contracts. Track point values, tick slippage, and rollover dates.",
    specificFields: [
      { field: "Point Multiplier", purpose: "Scales futures contracts correctly ($50/pt for ES, $20/pt for NQ, $1000/pt for CL)." },
      { field: "Contract Month Rollover", purpose: "Ensures timely rollover before physical delivery or liquidity transfer occurs." },
      { field: "Intraday vs. Overnight Margin", purpose: "Guards against margin liquidation during extended maintenance windows." },
    ],
    marketPitfalls: [
      {
        title: "Failure to Respect NQ Micro-Structure Speed",
        explanation: "Trading Nasdaq futures (NQ) without hard stop orders can lead to 100-point drawdowns in seconds during economic data releases.",
      },
      {
        title: "Over-Sizing on Cheap Intraday Margin",
        explanation: "Discount broker margin allows traders to hold contracts with only $500 equity, creating dangerous 100:1 leverage that invites rapid account blow-ups.",
      },
      {
        title: "Ignoring Commodity Inventory Reports",
        explanation: "Trading crude oil or natural gas directly into EIA weekly inventory prints introduces massive slippage and chaotic wick expansion.",
      },
    ],
    faqs: [
      {
        q: "Can I track futures in points instead of dollars?",
        a: "Yes. Select 'POINTS' mode in the journal settings to track raw index or commodity points without currency distortions.",
      },
      {
        q: "Does the journal support Micro E-mini contracts (MES, MNQ)?",
        a: "Yes. Simply adjust the multiplier field (e.g. $5 per point for MES, $2 per point for MNQ).",
      },
    ],
    contentSections: [
      {
        title: "The Math of Futures Leverage",
        text: "Futures contracts offer unmatched capital efficiency, centralized exchange order matching, and transparent liquidity. However, high leverage cuts both ways. Recording your point risk and strict R-multiples ensures you exploit futures efficiency without succumbing to oversized destruction.",
      },
      {
        title: "Session VWAP and Liquidity Frameworks",
        text: "Futures markets revolve around Institutional Volume-Weighted Average Price (VWAP) and daily volume profiles. Tracking whether your trades initiated above or below daily VWAP yields immediate clarity on your directional edge.",
      },
    ],
  },

  "nifty-banknifty": {
    slug: "nifty-banknifty",
    name: "Nifty & Bank Nifty Trading Journal",
    headline: "India Expiry Rhythms, Lot Sizes, and SEBI-Compliant Risk Tracking",
    badge: "Indian Index Derivatives (NSE / BSE)",
    description:
      "Specifically crafted for Indian index options and futures traders. Built around weekly and monthly expiry cycles, official NSE lot sizes, STT and turnover charges, and Indian numbering (₹ Lakhs & Crores).",
    specificFields: [
      { field: "NSE Expiry Cycle", purpose: "Tags Wednesday Bank Nifty, Thursday Nifty, or Friday Sensex weekly expiry days." },
      { field: "Lot Size Multiplier", purpose: "Seamlessly scales official NSE lots (e.g. 75 for Nifty, 30 for Bank Nifty)." },
      { field: "STT & Exchange Turnover Tax", purpose: "Deducts Securities Transaction Tax (STT), GST, and stamp duty from gross gains." },
    ],
    marketPitfalls: [
      {
        title: "Buying Cheap Hero-Zero Expiry Options",
        explanation: "Pouring capital into ₹5 or ₹10 out-of-the-money strike options on expiry afternoon is pure lottery gambling with negative mathematical expectancy.",
      },
      {
        title: "Ignoring STT on ITM Option Exercise",
        explanation: "Allowing in-the-money (ITM) index options to expire without squaring off triggers substantial STT liabilities on full contract notional value.",
      },
      {
        title: "Overtrading Morning Gap-Ups and 9:15 AM Volatility",
        explanation: "Placing aggressive market orders during the opening 15-minute candle often traps retail traders against institutional opening auction positioning.",
      },
    ],
    faqs: [
      {
        q: "Does the journal support Indian Rupee (INR) formatting?",
        a: "Yes. Our journal natively formats currency using the Indian numbering system (e.g. ₹1,50,000 using en-IN grouping).",
      },
      {
        q: "Are NSE lot sizes updated automatically?",
        a: "Yes. Our system references current NSE circular parameters and allows full manual override for any exchange adjustments.",
      },
    ],
    contentSections: [
      {
        title: "Navigating Dalal Street's Weekly Expiry Rhythm",
        text: "The Indian derivatives market is unique globally with rolling weekly expiries across NIFTY, BANKNIFTY, FINNIFTY, and SENSEX. By tagging each trade with its corresponding expiry day, our journal helps you verify whether your edge thrives in trending mid-week moves or range-bound expiry mornings.",
      },
      {
        title: "The Reality of Brokerage and STT Impact in F&O",
        text: "In active Indian option buying and scalping, turnover charges, STT, SEBI turnover fees, and stamp duties can consume 20% to 40% of gross profits. Accurately entering transaction fees reveals your true net bottom-line performance.",
      },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(MARKET_PAGES).map((slug) => ({ market: slug }));
}

export async function generateMetadata(props: { params: Promise<{ market: string }> }): Promise<Metadata> {
  const { market } = await props.params;
  const data = MARKET_PAGES[market];
  if (!data) return { title: "Market Journal Not Found | IoSnapChart" };

  return {
    title: `${data.name} — Free Log & P&L Calendar | IoSnapChart`,
    description: data.description,
    alternates: {
      canonical: `https://${brand.domain}/trading-journal/${data.slug}`,
    },
  };
}

export default async function MarketJournalPage(props: { params: Promise<{ market: string }> }) {
  const { market } = await props.params;
  const data = MARKET_PAGES[market];

  if (!data) {
    notFound();
  }

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16 text-[var(--text-1)]">
      {/* 1. Header & Hero */}
      <section className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[var(--bg-2)] border border-[var(--line)] text-[var(--candle)]">
          <span>{data.badge}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-0)] max-w-4xl mx-auto leading-tight">
          {data.name}
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-2)] max-w-2xl mx-auto leading-relaxed">
          {data.headline}. {data.description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <Link href="/tools/trading-journal">
            <Button variant="primary-gradient" size="lg" className="font-semibold px-6">
              Launch {data.name.split(" ")[0]} Journal Tool →
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

      {/* 2. Interactive Sample Calendar */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono font-bold text-[var(--candle)] uppercase tracking-wider">
            {data.name} Sample Calendar
          </span>
          <span className="text-[var(--text-2)] italic text-[11px]">
            Interactive demo — click any day to preview
          </span>
        </div>

        <CalendarPreview
          currency={data.slug === "nifty-banknifty" ? "INR" : "USD"}
          defaultShowWeekends={data.slug === "crypto"}
        />
      </section>

      {/* 3. Deep Dive Content Sections */}
      <section className="space-y-8 text-xs sm:text-sm leading-relaxed">
        {data.contentSections.map((sec, idx) => (
          <div key={idx} className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-0)] tracking-tight">
              {sec.title}
            </h2>
            <p className="text-[var(--text-1)] leading-relaxed">{sec.text}</p>
          </div>
        ))}
      </section>

      {/* 4. Specialized Market Fields Table */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-0)] tracking-tight">
          Specialized Tracking Fields for {data.name.split(" ")[0]}
        </h2>

        <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--bg-1)]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[var(--bg-2)] border-b border-[var(--line)] text-[var(--text-2)] uppercase">
              <tr>
                <th className="py-3 px-4">Specialized Metric</th>
                <th className="py-3 px-4">Why Professional {data.name.split(" ")[0]} Traders Track It</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]/50 text-[var(--text-1)]">
              {data.specificFields.map((f, i) => (
                <tr key={i}>
                  <td className="py-2.5 px-4 font-bold text-[var(--text-0)]">{f.field}</td>
                  <td className="py-2.5 px-4">{f.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Costly Market Pitfalls to Avoid */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-0)] tracking-tight">
          3 Expensive Mistakes Common in {data.name.split(" ")[0]}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.marketPitfalls.map((p, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-[var(--bear)]/30 bg-[var(--bear)]/5 space-y-2"
            >
              <h3 className="text-xs font-bold text-[var(--bear)] uppercase tracking-wider font-mono">
                {p.title}
              </h3>
              <p className="text-xs text-[var(--text-2)] leading-relaxed">{p.explanation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Market FAQs */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-0)] tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {data.faqs.map((faq, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] space-y-2"
            >
              <h3 className="text-sm font-bold text-[var(--text-0)]">{faq.q}</h3>
              <p className="text-xs text-[var(--text-2)] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Explore other markets navigation */}
      <section className="space-y-4 pt-4 border-t border-[var(--line)]">
        <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-[var(--text-2)]">
          Explore Other Market Journals
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.values(MARKET_PAGES)
            .filter((m) => m.slug !== data.slug)
            .map((m) => (
              <Link
                key={m.slug}
                href={`/trading-journal/${m.slug}`}
                className="px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg-2)] hover:border-[var(--candle)] text-xs text-[var(--text-1)] hover:text-[var(--text-0)] font-medium transition-colors"
              >
                {m.name} →
              </Link>
            ))}
        </div>
      </section>

      {/* 8. Mandatory Disclaimer */}
      <div className="pt-4 border-t border-[var(--line)] text-center text-[11px] text-[var(--text-2)]">
        <p>{SHORT_DISCLAIMER}</p>
      </div>
    </article>
  );
}
