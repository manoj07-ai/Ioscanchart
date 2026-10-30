import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";
import { brand } from "@/config/brand";
import { MARKET_PACKS, type MarketPackId } from "@/config/markets";
import { DISCLAIMER_SHORT } from "@/config/legal";

interface MarketPageContent {
  slug: MarketPackId;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  subheadline: string;
  tradingHours: string;
  primaryExchange: string;
  tickInfo: string;
  keyDrivers: string[];
  technicalNuances: { title: string; desc: string }[];
  commonPitfalls: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

const MARKET_DETAILS: Record<MarketPackId, MarketPageContent> = {
  "india-indices": {
    slug: "india-indices",
    title: "AI Chart Analysis for NIFTY & Indian Indices",
    metaTitle: "AI Chart Analysis for NIFTY 50, BANKNIFTY & SENSEX | IoSnapChart",
    metaDescription:
      "Instant AI technical analysis for NIFTY 50, BANKNIFTY, FINNIFTY, and SENSEX. Get automated support/resistance levels, CPR pivots, and multi-timeframe trade plans.",
    heroHeadline: "Precision AI Technical Analysis for Dalal Street Indices",
    subheadline:
      "Engineered specifically for Indian index traders. Detects CPR pivots, opening drives, gap fills, and key institutional order blocks across NIFTY 50, BANKNIFTY, and SENSEX.",
    tradingHours: "09:15 - 15:30 IST (Pre-market: 09:00 - 09:15)",
    primaryExchange: "National Stock Exchange (NSE) & Bombay Stock Exchange (BSE)",
    tickInfo: "0.05 index points tick size. Standardized lot sizes: NIFTY (75), BANKNIFTY (30), FINNIFTY (65), SENSEX (20).",
    keyDrivers: [
      "HDFC Bank, Reliance, and ICICI Bank weightage movements dictating 35%+ of NIFTY trajectory",
      "RBI Monetary Policy Committee (MPC) rate announcements and bi-monthly repo revisions",
      "FII / DII net cash and derivative flow clustering during European session overlap (13:00 - 15:00 IST)",
      "Weekly expiry rotation rhythm across exchanges from Monday to Friday",
    ],
    technicalNuances: [
      {
        title: "Central Pivot Range (CPR) & Camariila Levels",
        desc: "Indian index participants trade heavily around virgin CPR levels and Camarilla H3/L3 pivots. IoSnapChart prioritizes clean tests of these structural boundaries over generic moving averages.",
      },
      {
        title: "Pre-Market Gap Accounting",
        desc: "NIFTY and BANKNIFTY open with significant overnight gaps due to GIFT Nifty price action. Our AI engine verifies whether the morning opening drive establishes acceptance outside prior balance or triggers a prompt mean-reversion gap fill.",
      },
      {
        title: "Round Strike Magnet Effect (OI Pinning)",
        desc: "Every 500 index points on BANKNIFTY and 100 points on NIFTY represent psychological call/put writing walls. Our engine maps structural support and resistance directly to heavy Open Interest strikes.",
      },
    ],
    commonPitfalls: [
      {
        title: "Trading 09:15 - 09:25 Market Orders",
        desc: "High bid-ask spreads and implied volatility spikes in the first 10 minutes often trap breakout traders before true trend direction is established.",
      },
      {
        title: "Ignoring Heavyweight Stock Divergence",
        desc: "Taking a NIFTY long while Reliance and HDFC Bank are exhibiting bear flags creates negative statistical expectancy.",
      },
    ],
    faqs: [
      {
        q: "Does IoSnapChart understand Indian market trading hours?",
        a: "Yes. Our India market pack incorporates IST market hours, including pre-open session dynamics, lunch lull (11:30 - 13:00 IST), and the high-volume closing run (14:30 - 15:30 IST).",
      },
      {
        q: "Can I paste TradingView snapshot links for NIFTY charts?",
        a: "Yes. Simply click TradingView's camera icon, copy the share link (e.g. tradingview.com/x/...), and paste it directly into our upload box.",
      },
    ],
  },

  "india-options": {
    slug: "india-options",
    title: "AI Chart & Open Interest Analysis for Indian Options (F&O)",
    metaTitle: "Indian Options (F&O) AI Chart Analysis: OI, PCR & Expiry | IoSnapChart",
    metaDescription:
      "Automated technical analysis for NIFTY and BANKNIFTY options. Evaluate Open Interest (OI), Put-Call Ratio (PCR), max pain levels, and defined-risk trade setups.",
    heroHeadline: "Derivatives-Aware Chart Analysis for Indian Option Traders",
    subheadline:
      "Stop trading naked options without structure. IoSnapChart pairs price action charts with strike support/resistance, PCR sentiment, and defined-risk spread frameworks.",
    tradingHours: "09:15 - 15:30 IST",
    primaryExchange: "NSE Equity Derivatives (F&O)",
    tickInfo: "Lot sizes: NIFTY 75, BANKNIFTY 30. Expiry settlements in cash at final 30-minute VWAP.",
    keyDrivers: [
      "Weekly expiry cycle: NIFTY (Thursday), BANKNIFTY (Wednesday), SENSEX (Friday)",
      "India VIX regime changes: high IV (>15) favors credit spreads; low IV (<12) favors debit breakout plays",
      "Put-Call Ratio (PCR) extremes (<0.7 oversold bounce, >1.3 overbought exhaustion)",
      "STT, exchange turnover fees, and brokerage impact on intraday option buying",
    ],
    technicalNuances: [
      {
        title: "Max Pain & Expiry Pinning",
        desc: "Option writers tend to defend strikes where the maximum amount of options expire worthless. The AI highlights when spot price is compressing into the prevailing max-pain zone.",
      },
      {
        title: "Defined-Risk Over Naked Speculation",
        desc: "Whenever an option plan is generated, IoSnapChart constructs vertical spreads or risk-defined combinations to protect against Theta decay and unexpected gap risk.",
      },
    ],
    commonPitfalls: [
      {
        title: "Holding Out-of-the-Money Calls Into 14:00 on Expiry Day",
        desc: "Theta decay becomes non-linear on zero-DTE expiry sessions. Holding decaying OTM options into the close almost universally results in total premium loss.",
      },
      {
        title: "Underestimating Transaction Costs & Slippage",
        desc: "Scalping 10-rupee option moves with full lot sizes often results in 25%+ of gross profit being consumed by statutory taxes and exchange levies.",
      },
    ],
    faqs: [
      {
        q: "Does the AI provide SEBI registered tips?",
        a: "No. IoSnapChart is strictly an automated educational software tool. It provides structural chart reading and does not issue financial advice or trading signals.",
      },
      {
        q: "How does the options payoff chart work?",
        a: "Our engine client-side models the defined-risk payoff profile (max gain, max loss, breakeven strikes) for suggested trade structures.",
      },
    ],
  },

  "india-equities": {
    slug: "india-equities",
    title: "AI Chart Analysis for Indian Stocks (NSE / BSE)",
    metaTitle: "AI Technical Analysis for Indian Stocks (NSE & BSE) | IoSnapChart",
    metaDescription:
      "Scan Indian equities from Reliance to smallcap leaders. AI-driven support, resistance, multi-day swing levels, and volume profile analysis.",
    heroHeadline: "Actionable Technical Structure for NSE & BSE Stocks",
    subheadline:
      "From NIFTY 100 blue chips to high-momentum midcaps. Evaluate breakout quality, institutional accumulation, and strict invalidation boundaries in seconds.",
    tradingHours: "09:15 - 15:30 IST",
    primaryExchange: "NSE & BSE India",
    tickInfo: "0.05 INR minimum tick size for most listed equities.",
    keyDrivers: [
      "Quarterly corporate earnings results and management conference call guidance",
      "Sector rotational flows (IT, Banking, Auto, Pharma, FMCG, Energy)",
      "FII & Mutual Fund block and bulk deals visible at daily market close",
      "Circuit limits (5%, 10%, 20%) applied to individual cash equities",
    ],
    technicalNuances: [
      {
        title: "Multi-Day Base Breakouts",
        desc: "NSE growth stocks frequently consolidate in 4-to-8 week stages before expanding. The AI identifies whether breakout volume confirms institutional participation.",
      },
      {
        title: "Volume Profile & Delivery Spikes",
        desc: "Cash equity moves backed by high delivery volume indicate genuine long-term position building rather than transient intraday scalping.",
      },
    ],
    commonPitfalls: [
      {
        title: "Chasing Upper Circuit Stocks",
        desc: "Buying illiquid stocks after multiple consecutive upper circuits leaves traders vulnerable to locked lower circuits with zero exit liquidity.",
      },
    ],
    faqs: [
      {
        q: "Can I analyze penny stocks or SME IPOs?",
        a: "Yes, provided your screenshot clearly displays the price scale and candlesticks. However, we recommend sticking to liquid NSE cash equities for reliable technical patterns.",
      },
    ],
  },

  "us-equities": {
    slug: "us-equities",
    title: "AI Chart Analysis for US Stocks & ETFs (NYSE / NASDAQ)",
    metaTitle: "AI Chart Analysis for US Stocks (AAPL, NVDA, TSLA, SPY) | IoSnapChart",
    metaDescription:
      "Instant AI technical analysis for NYSE & NASDAQ equities and major ETFs. Identify key demand zones, earnings gap levels, and risk-managed swing setups.",
    heroHeadline: "Wall Street Chart Analysis Powered by Multimodal AI",
    subheadline:
      "Analyze mega-cap tech, high-beta momentum, and market ETFs (SPY, QQQ, IWM) with automated scenario paths and clear invalidation boundaries.",
    tradingHours: "09:30 - 16:00 ET (Pre-market 04:00 - 09:30, After-hours 16:00 - 20:00)",
    primaryExchange: "NYSE & NASDAQ",
    tickInfo: "$0.01 standard tick size for US stocks.",
    keyDrivers: [
      "Federal Reserve interest rate decisions and CPI/PCE inflation releases",
      "Mega-cap tech earnings (Apple, Nvidia, Microsoft, Amazon, Alphabet, Meta)",
      "Options market maker gamma positioning around monthly OPEX",
      "Sector rotation between growth (QQQ) and value/smallcaps (IWM)",
    ],
    technicalNuances: [
      {
        title: "Pre-Market High/Low Liquidity Sweeps",
        desc: "During the first 30 minutes of NYSE cash open (09:30 - 10:00 ET), price often sweeps the pre-market high or low before continuing the primary trend.",
      },
      {
        title: "Earnings Gap & Go vs Gap & Crap",
        desc: "Our AI model checks whether post-earnings candles find support at the gap-day VWAP or breakdown below prior swing support.",
      },
    ],
    commonPitfalls: [
      {
        title: "Ignoring Macroeconomic Data Prints",
        desc: "Entering technical swing setups right before 08:30 ET Non-Farm Payrolls or CPI numbers exposes your trade to unpredictable spread slippage.",
      },
    ],
    faqs: [
      {
        q: "Can I analyze US leveraged ETFs like TQQQ and SOXL?",
        a: "Yes. Our engine handles high-beta leveraged ETFs and notes compounding volatility drag.",
      },
    ],
  },

  crypto: {
    slug: "crypto",
    title: "AI Chart Analysis for Bitcoin & Cryptocurrency",
    metaTitle: "AI Crypto Chart Analysis: BTC, ETH, Solana & Altcoins | IoSnapChart",
    metaDescription:
      "24/7 technical analysis for Bitcoin, Ethereum, and major altcoins. Detect liquidity sweeps, fair value gaps, and funding rate pressure points.",
    heroHeadline: "24/7 AI Technical Engine for Crypto & Digital Assets",
    subheadline:
      "Continuous market structure analysis for BTC, ETH, and altcoins. Identifies liquidity pools, weekend range deviations, and funding exhaustion zones.",
    tradingHours: "24/7/365 — Continuous global liquidity",
    primaryExchange: "Binance, Coinbase, Bybit, OKX, Kraken",
    tickInfo: "Sub-cent precision on altcoins, $0.10 to $1.00 ticks on BTC/ETH perpetuals.",
    keyDrivers: [
      "Bitcoin dominance (BTC.D) cycle rotations into altcoin seasons",
      "Perpetual futures funding rates and liquidation heatmaps",
      "Spot Bitcoin and Ethereum ETF inflows and institutional custody movements",
      "Weekend low-volume manipulation and CME futures gap creation",
    ],
    technicalNuances: [
      {
        title: "Liquidity Sweeps & Stop Hunts",
        desc: "Crypto markets frequently pierce obvious equal highs or equal lows to liquidate over-leveraged traders before reversing. The engine highlights these liquidity capture wicks.",
      },
      {
        title: "CME Gap Retests",
        desc: "Bitcoin price action regularly returns to fill price gaps created on the CME futures chart over weekend trading.",
      },
    ],
    commonPitfalls: [
      {
        title: "Trading High-Leverage Weekend Breakouts",
        desc: "Thin weekend order books allow market makers to easily fake breakouts that vanish once US/Asian institutional desks return Monday morning.",
      },
    ],
    faqs: [
      {
        q: "Does the AI support 4H and daily crypto timeframes?",
        a: "Yes. Multi-timeframe analysis (uploading both 1D and 15m/1H charts) provides the cleanest confluence for crypto setups.",
      },
    ],
  },

  forex: {
    slug: "forex",
    title: "AI Chart Analysis for Foreign Exchange (Forex)",
    metaTitle: "Forex AI Chart Analysis: EUR/USD, GBP/JPY & Majors | IoSnapChart",
    metaDescription:
      "High-precision technical analysis for major and cross currency pairs. Analyze session ranges, pip risk-reward, and key central bank levels.",
    heroHeadline: "Macro-Aware Forex Chart Analysis for Currency Traders",
    subheadline:
      "Master London and New York session overlaps. Automated support/resistance, pip-based risk targets, and liquidity sweep detection for major currency pairs.",
    tradingHours: "24/5 from Sunday 17:00 ET to Friday 17:00 ET",
    primaryExchange: "Interbank OTC / Major ECNs",
    tickInfo: "0.0001 (1 pip) standard; 0.00001 (fractional pipette) on major pairs.",
    keyDrivers: [
      "Central bank monetary policies (Federal Reserve, ECB, BOJ, BOE)",
      "Session liquidity handoffs (Asian 00:00-09:00 GMT, London 08:00-16:00 GMT, NY 13:00-21:00 GMT)",
      "US Dollar Index (DXY) inverse correlation with EUR/USD and GBP/USD",
      "Cross-market carry trade unwinds in Japanese Yen pairs (USD/JPY, GBP/JPY)",
    ],
    technicalNuances: [
      {
        title: "London Session Open Breakout (Judas Swing)",
        desc: "The London open (08:00 GMT) frequently generates a deceptive liquidity grab against the Asian range before launching the real day trend.",
      },
      {
        title: "Average Daily Range (ADR) Targets",
        desc: "Currency pairs have strict daily volatility ceilings. Our AI checks whether target levels are realistic within current ADR limits.",
      },
    ],
    commonPitfalls: [
      {
        title: "Trading During Major Central Bank Interest Rate Releases",
        desc: "Spreads on EUR/USD can widen from 0.2 pips to 10+ pips during live FOMC speeches, triggering stop losses on both sides.",
      },
    ],
    faqs: [
      {
        q: "Can I enter pip targets in the trade journal?",
        a: "Yes. Our journal supports Points/Pips mode with accurate negative formatting (-40.0 pts) and R-multiple tracking.",
      },
    ],
  },

  commodities: {
    slug: "commodities",
    title: "AI Chart Analysis for Gold, Oil & Commodities (XAU/USD, WTI, MCX)",
    metaTitle: "AI Chart Analysis for Gold (XAUUSD), Silver & Crude Oil | IoSnapChart",
    metaDescription:
      "Instant technical analysis for Gold (XAU/USD), Brent/WTI Crude Oil, Natural Gas, and MCX commodities. Clear support, resistance, and momentum levels.",
    heroHeadline: "Technical Precision for Precious Metals & Energy Futures",
    subheadline:
      "Analyze Gold (XAU/USD), Silver, and Crude Oil with AI-driven level mapping. Built for global futures and Indian MCX traders alike.",
    tradingHours: "Globally 23 hours/day; MCX India 09:00 - 23:30 IST",
    primaryExchange: "COMEX, NYMEX, ICE, and MCX India",
    tickInfo: "$0.01 on Gold/Silver, $0.01/barrel on Crude Oil. MCX contracts quoted in INR per 10g/barrel.",
    keyDrivers: [
      "Real interest rates and US Dollar strength directly inversely impacting Gold (XAU/USD)",
      "OPEC+ production quotas and Middle East geopolitical tensions driving Crude Oil volatility",
      "Seasonal weather patterns and EIA weekly inventory reports for Natural Gas",
      "Central bank reserve diversification purchases supporting physical gold demand",
    ],
    technicalNuances: [
      {
        title: "Gold (XAU/USD) Intraday Volatility Expansions",
        desc: "Gold moves in sharp, fast liquidity waves during NY morning trading. The AI highlights round psychological numbers ($2,600, $2,650, $2,700) where heavy stop clusters reside.",
      },
      {
        title: "Inventory Report Reaction Zones",
        desc: "Crude oil charts regularly experience severe whipsaws during Wednesday 10:30 ET EIA inventory announcements. The engine verifies post-release structure before recommending trend resumption.",
      },
    ],
    commonPitfalls: [
      {
        title: "Undersizing Risk on Natural Gas & Gold",
        desc: "Commodity volatility is often 2x to 3x that of equity indices. Using the same share/lot size as stocks leads to immediate account blow-ups.",
      },
    ],
    faqs: [
      {
        q: "Does IoSnapChart support MCX Gold and Silver contracts?",
        a: "Yes. Our commodities pack recognizes both international spot (XAU/USD) and MCX futures tickers.",
      },
    ],
  },

  "global-indices": {
    slug: "global-indices",
    title: "AI Chart Analysis for Global Index Futures (S&P 500, Nasdaq, DAX)",
    metaTitle: "Global Index Futures AI Analysis: ES, NQ, DAX & Nikkei | IoSnapChart",
    metaDescription:
      "Professional technical analysis for E-mini S&P 500 (ES), Nasdaq (NQ), DAX 40, and Nikkei 225 index futures. Identify overnight inventory imbalances and key pivot levels.",
    heroHeadline: "Index Futures Technical Analysis for Systematic Traders",
    subheadline:
      "Trade ES, NQ, DAX, and global benchmarks with institutional precision. Map overnight session highs/lows, VWAP extensions, and high-probability retracement zones.",
    tradingHours: "Globally 23 hours/day (CME globex session 18:00 - 17:00 ET next day)",
    primaryExchange: "CME, Eurex, Osaka Exchange",
    tickInfo: "ES: 0.25 points ($12.50/tick); NQ: 0.25 points ($5.00/tick); Micro contracts available.",
    keyDrivers: [
      "Overnight Globex inventory positioning (100% net long or net short at NY cash open)",
      "US Treasury yield curve shifts (10-Year yield inverse pressure on NQ tech valuations)",
      "Quarterly triple and quadruple witching expiration cycles",
      "Global macro risk-on/risk-off synchronicity across European and US markets",
    ],
    technicalNuances: [
      {
        title: "Overnight High/Low (ONH / ONL) Acceptance",
        desc: "If ES opens above the overnight high and holds, it signals intense institutional buyers. If it fails and rotates back into the range, a full test of the overnight low becomes probable.",
      },
      {
        title: "Session VWAP Confluence",
        desc: "Futures algorithms strictly monitor standard deviation bands around the volume-weighted average price (VWAP). The AI identifies when price reaches statistical exhaustion (+2 STD).",
      },
    ],
    commonPitfalls: [
      {
        title: "Over-Leveraging on Nasdaq (NQ) Futures",
        desc: "NQ routinely travels 200+ points in a single morning session. Trading mini contracts with sub-$25k accounts results in rapid margin liquidation.",
      },
    ],
    faqs: [
      {
        q: "Can I use Micro E-mini (MES and MNQ) charts?",
        a: "Yes. The technical price structures on Micro contracts are identical to the standard contracts.",
      },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(MARKET_PACKS).map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const market = MARKET_DETAILS[slug as MarketPackId];

  if (!market) {
    return { title: "Market Pack Not Found | IoSnapChart" };
  }

  return {
    title: market.metaTitle,
    description: market.metaDescription,
    alternates: {
      canonical: `https://${brand.domain}/markets/${market.slug}`,
    },
    openGraph: {
      title: market.metaTitle,
      description: market.metaDescription,
      url: `https://${brand.domain}/markets/${market.slug}`,
      type: "article",
    },
  };
}

export default async function ProgrammaticMarketPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const data = MARKET_DETAILS[slug as MarketPackId];

  if (!data) {
    notFound();
  }

  const packMeta = MARKET_PACKS[data.slug];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `IoSnapChart ${data.title}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16 text-[var(--text-1)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />

      {/* 1. Hero Header */}
      <section className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[var(--bg-2)] border border-[var(--line)] text-[var(--candle)]">
          <span>{packMeta.icon}</span>
          <span>{packMeta.displayName} Pack</span>
          {packMeta.coverage === "beta" && (
            <span className="px-1.5 py-0.5 rounded bg-[var(--amber)]/20 text-[var(--amber)] font-bold text-[10px]">
              BETA
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-0)] max-w-4xl mx-auto leading-tight">
          {data.heroHeadline}
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-2)] max-w-2xl mx-auto leading-relaxed">
          {data.subheadline}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <Link href="/app">
            <Button variant="primary-gradient" size="lg" className="font-semibold px-6 shadow-md">
              Analyze {packMeta.shortName} Chart Free →
            </Button>
          </Link>
          <Link href="/tools/trading-journal">
            <Button variant="secondary" size="lg" className="font-medium px-5">
              Open Trading Journal
            </Button>
          </Link>
        </div>
      </section>

      {/* 2. Market Specifications Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] text-xs font-mono">
        <div className="p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] space-y-1">
          <div className="text-[var(--text-2)] uppercase text-[10px] tracking-wider">Trading Sessions</div>
          <div className="font-bold text-[var(--text-0)]">{data.tradingHours}</div>
        </div>
        <div className="p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] space-y-1">
          <div className="text-[var(--text-2)] uppercase text-[10px] tracking-wider">Primary Venue</div>
          <div className="font-bold text-[var(--text-0)]">{data.primaryExchange}</div>
        </div>
        <div className="p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] space-y-1">
          <div className="text-[var(--text-2)] uppercase text-[10px] tracking-wider">Tick / Lot Profile</div>
          <div className="text-[var(--text-1)] text-[11px] leading-normal">{data.tickInfo}</div>
        </div>
      </section>

      {/* 3. Primary Market Drivers */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-0)] tracking-tight">
          Primary Liquidity &amp; Volatility Drivers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.keyDrivers.map((driver, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-[var(--candle)]/10 text-[var(--candle)] font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                {idx + 1}
              </span>
              <p className="text-xs text-[var(--text-1)] leading-relaxed">{driver}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Technical Nuances Evaluated by AI */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-0)] tracking-tight">
          Market-Specific Technical Mechanics
        </h2>
        <div className="space-y-3">
          {data.technicalNuances.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] space-y-1.5"
            >
              <h3 className="text-sm font-bold text-[var(--text-0)] font-sans">
                {item.title}
              </h3>
              <p className="text-xs text-[var(--text-2)] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Common Pitfalls to Avoid */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-0)] tracking-tight">
          Common Execution Traps in {packMeta.displayName}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.commonPitfalls.map((pitfall, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[var(--down)]/30 bg-[var(--down)]/5 space-y-1.5"
            >
              <h3 className="text-xs font-bold text-[var(--down)] font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{pitfall.title}</span>
              </h3>
              <p className="text-xs text-[var(--text-2)] leading-relaxed">
                {pitfall.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-0)] tracking-tight">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {data.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] space-y-2"
            >
              <h3 className="text-xs sm:text-sm font-semibold text-[var(--text-0)]">
                {faq.q}
              </h3>
              <p className="text-xs text-[var(--text-2)] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Explore Other Market Packs */}
      <section className="pt-8 border-t border-[var(--line)] space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-0)] uppercase tracking-wider font-mono">
          Explore Other Market Packs
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          {Object.values(MARKET_PACKS)
            .filter((p) => p.id !== data.slug)
            .map((p) => (
              <Link
                key={p.id}
                href={`/markets/${p.id}`}
                className="p-3 rounded-lg border border-[var(--line)] bg-[var(--bg-1)] hover:border-[var(--candle)] hover:bg-[var(--bg-2)] transition-all flex items-center gap-2 group"
              >
                <span>{p.icon}</span>
                <span className="truncate group-hover:text-[var(--candle)]">{p.shortName}</span>
              </Link>
            ))}
        </div>
      </section>

      {/* Mandatory Disclaimer Footer */}
      <footer className="pt-8 border-t border-[var(--line)] text-center text-xs text-[var(--text-2)] space-y-2">
        <p>{DISCLAIMER_SHORT}</p>
        <p className="text-[11px] font-mono">
          Published by {brand.name} · Institutional Technical Intelligence
        </p>
      </footer>
    </article>
  );
}
