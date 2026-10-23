import * as React from "react";
import { Badge } from "@/components/ui/Badge";

export function MarketTickerStrip() {
  const markets = [
    { label: "US Stocks & ETFs", icon: "🇺🇸", tickers: "AAPL, NVDA, SPY, QQQ" },
    { label: "Forex", icon: "💱", tickers: "EURUSD, GBPJPY, USDINR" },
    { label: "Crypto", icon: "₿", tickers: "BTC, ETH, SOL, Altcoins" },
    { label: "Gold & Commodities", icon: "🥇", tickers: "XAUUSD, Crude Oil, Silver" },
    { label: "Global Indices", icon: "🌐", tickers: "S&P 500, DAX, FTSE, Nikkei" },
    {
      label: "NIFTY & BANKNIFTY",
      icon: "🇮🇳",
      tickers: "NIFTY, BANKNIFTY, FINNIFTY, SENSEX",
      highlight: true,
      badge: "New",
    },
    {
      label: "NSE & BSE Stocks",
      icon: "📈",
      tickers: "RELIANCE, HDFCBANK, TCS, Midcaps",
      highlight: true,
      badge: "New",
    },
    {
      label: "India Options & OI",
      icon: "⛓️",
      tickers: "Max Pain, PCR, Option Chain, Payoffs",
      highlight: true,
      badge: "Beta",
    },
  ];

  return (
    <section className="w-full border-y border-[var(--line)] bg-[var(--bg-1)]/60 py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-[var(--text-2)] mb-4">
          Broad Market Coverage Across Wall Street &amp; Dalal Street
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {markets.map((m) => (
            <div
              key={m.label}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs transition-all ${
                m.highlight
                  ? "bg-[var(--candle-dim)]/20 border-[var(--candle)]/40 text-[var(--text-0)] shadow-sm shadow-[var(--candle-glow)]"
                  : "bg-[var(--bg-2)] border-[var(--line)] text-[var(--text-1)] hover:border-[var(--line-strong)]"
              }`}
            >
              <span>{m.icon}</span>
              <span className="font-medium">{m.label}</span>
              {m.badge && (
                <Badge
                  variant={m.badge === "New" ? "bull" : "amber"}
                  size="sm"
                  showIcon={false}
                >
                  {m.badge}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
