import * as React from "react";
import { Globe, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

export function MarketsDeepDive() {
  const globalMarkets = [
    {
      name: "US Equities & ETFs",
      coverage: "Full",
      details: "NYSE, NASDAQ, AMEX, major market ETFs (SPY, QQQ, IWM), earnings releases and pre-market context.",
      tickers: ["AAPL", "NVDA", "TSLA", "MSFT", "SPY"],
    },
    {
      name: "Forex & Currencies",
      coverage: "Full",
      details: "Major, minor, and exotic currency pairs across London, New York, and Tokyo trading sessions.",
      tickers: ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD"],
    },
    {
      name: "Crypto & Altcoins",
      coverage: "Full",
      details: "Bitcoin, Ethereum, major Layer 1s and DeFi tokens across spot and perpetual futures charts.",
      tickers: ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNB"],
    },
    {
      name: "Commodities & Energy",
      coverage: "Full",
      details: "Spot gold, silver, Brent/WTI crude oil, natural gas, and global metals.",
      tickers: ["XAUUSD", "XAGUSD", "CL1!", "NG1!"],
    },
    {
      name: "Global Index Futures",
      coverage: "Full",
      details: "E-mini S&P (ES), Nasdaq (NQ), DAX, FTSE 100, and Nikkei 225 index contracts.",
      tickers: ["ES1!", "NQ1!", "DAX", "FTSE"],
    },
  ];

  const indiaMarkets = [
    {
      name: "Major Indian Indices",
      coverage: "Beta",
      details: "NIFTY 50, BANKNIFTY, FINNIFTY, MIDCPNIFTY, and BSE SENSEX across daily, hourly, and intraday frames.",
      tickers: ["NIFTY50", "BANKNIFTY", "FINNIFTY", "SENSEX"],
    },
    {
      name: "NSE & BSE Equities",
      coverage: "Beta",
      details: "All large-cap, mid-cap, and small-cap cash segment stocks listed on National & Bombay Stock Exchanges.",
      tickers: ["RELIANCE", "TCS", "HDFCBANK", "INFY", "TATAMOTORS"],
    },
    {
      name: "Option Chain & Open Interest",
      coverage: "Beta",
      details: "Screenshot an NSE option chain or payoff graph: extract Max Pain, Put-Call Ratio (PCR), and Call/Put OI barriers.",
      tickers: ["Index CE/PE", "Stock Options", "Max Pain", "PCR"],
    },
    {
      name: "Expiry Rhythm & Session Awareness",
      coverage: "Beta",
      details: "Context-aware of weekly index expiries, morning volatility spikes, European crossover, and closing auctions.",
      tickers: ["Thursday Weekly Expiry", "Monthly Expiry"],
    },
  ];

  return (
    <section id="markets" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="bull" size="sm" className="mb-3">
            Pluggable Market Packs
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-0)]">
            Markets Deep-Dive
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-1)]">
            Unlike tools locked to US mega-caps, our vision engine understands market-specific session rhythms, tick sizes, and expiry rules.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column 1: Global Markets */}
          <Card className="border-[var(--line-strong)] bg-[var(--bg-2)]">
            <CardHeader className="border-b border-[var(--line)] py-4 px-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-[var(--text-0)] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[var(--candle)] shrink-0" />
                  <span>Global Markets</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Wall Street, European bourses, Forex, and Crypto
                </CardDescription>
              </div>
              <Badge variant="neutral" size="sm">
                Full Production
              </Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {globalMarkets.map((m) => (
                <div key={m.name} className="p-3.5 rounded-xl bg-[var(--bg-1)] border border-[var(--line)] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-0)]">{m.name}</span>
                    <Badge variant="bull" size="sm" showIcon={false}>
                      {m.coverage}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-1)] leading-relaxed">{m.details}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.tickers.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-[var(--bg-3)] text-[10px] font-mono text-[var(--text-2)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Column 2: Indian Markets (Our Headline Differentiator) */}
          <Card className="border-[var(--candle)]/40 bg-[var(--bg-2)] shadow-xl shadow-[var(--candle-glow)]">
            <CardHeader className="border-b border-[var(--line)] py-4 px-6 flex flex-row items-center justify-between bg-[var(--candle-dim)]/10">
              <div>
                <CardTitle className="text-base font-bold text-[var(--text-0)] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[var(--candle)] shrink-0" />
                  <span>Indian Markets &amp; Options</span>
                </CardTitle>
                <CardDescription className="text-xs text-[var(--candle)]">
                  Our headline differentiator — Dalal Street first-class support
                </CardDescription>
              </div>
              <Badge variant="amber" size="sm">
                Public Beta
              </Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {indiaMarkets.map((m) => (
                <div key={m.name} className="p-3.5 rounded-xl bg-[var(--bg-1)] border border-[var(--line)] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-0)]">{m.name}</span>
                    <Badge variant="amber" size="sm" showIcon={false}>
                      {m.coverage}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-1)] leading-relaxed">{m.details}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.tickers.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-[var(--bg-3)] text-[10px] font-mono text-[var(--text-2)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
