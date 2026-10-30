import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import {
  TrendingUp,
  Globe,
  Coins,
  Flame,
  BarChart3,
  CircleDollarSign,
  Layers,
} from "lucide-react";

export function MarketTickerStrip() {
  const markets = [
    { label: "US Stocks & ETFs", Icon: BarChart3, tickers: "AAPL, NVDA, SPY, QQQ" },
    { label: "Forex", Icon: CircleDollarSign, tickers: "EURUSD, GBPJPY, USDINR" },
    { label: "Crypto", Icon: Coins, tickers: "BTC, ETH, SOL, Altcoins" },
    { label: "Gold & Commodities", Icon: Flame, tickers: "XAUUSD, Crude Oil, Silver" },
    { label: "Global Indices", Icon: Globe, tickers: "S&P 500, DAX, FTSE, Nikkei" },
    {
      label: "NIFTY & BANKNIFTY",
      Icon: TrendingUp,
      tickers: "NIFTY, BANKNIFTY, FINNIFTY, SENSEX",
      highlight: true,
      badge: "New",
    },
    {
      label: "NSE & BSE Stocks",
      Icon: BarChart3,
      tickers: "RELIANCE, HDFCBANK, TCS, Midcaps",
      highlight: true,
      badge: "New",
    },
    {
      label: "India Options & OI",
      Icon: Layers,
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
          {markets.map((m) => {
            const Icon = m.Icon;
            return (
              <div
                key={m.label}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs transition-all ${
                  m.highlight
                    ? "bg-[var(--candle-dim)]/20 border-[var(--candle)]/40 text-[var(--text-0)] shadow-sm shadow-[var(--candle-glow)]"
                    : "bg-[var(--bg-2)] border-[var(--line)] text-[var(--text-1)] hover:border-[var(--line-strong)]"
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[var(--candle)] shrink-0" />
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
