/**
 * Markets configuration — all supported market packs.
 * `coverage: 'full'` = production-ready context; 'beta' = available but may have gaps.
 *
 * Each pack is used by the analysis engine to inject market-specific context:
 * sessions, expiry rhythm, lot sizes, tick sizes, circuit limits, volatility norms.
 */

export type MarketPackId =
  | "us-equities"
  | "forex"
  | "crypto"
  | "commodities"
  | "global-indices"
  | "india-indices"
  | "india-equities"
  | "india-options";

export interface MarketPack {
  id: MarketPackId;
  displayName: string;
  shortName: string;
  description: string;
  exampleTickers: string[];
  coverage: "full" | "beta";
  /** Emoji icon for UI */
  icon: string;
  /** Sorted display order */
  order: number;
}

export const MARKET_PACKS: Record<MarketPackId, MarketPack> = {
  "us-equities": {
    id: "us-equities",
    displayName: "US Stocks & ETFs",
    shortName: "US Equities",
    description: "NYSE, NASDAQ, AMEX stocks and major ETFs (SPY, QQQ, IWM…)",
    exampleTickers: ["AAPL", "TSLA", "NVDA", "SPY", "QQQ"],
    coverage: "full",
    icon: "",
    order: 1,
  },
  forex: {
    id: "forex",
    displayName: "Forex",
    shortName: "Forex",
    description: "Major, minor, and exotic currency pairs",
    exampleTickers: ["EURUSD", "GBPJPY", "USDINR", "AUDUSD"],
    coverage: "full",
    icon: "",
    order: 2,
  },
  crypto: {
    id: "crypto",
    displayName: "Crypto",
    shortName: "Crypto",
    description: "Bitcoin, Ethereum and major altcoins across all timeframes",
    exampleTickers: ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"],
    coverage: "full",
    icon: "",
    order: 3,
  },
  commodities: {
    id: "commodities",
    displayName: "Commodities",
    shortName: "Commodities",
    description: "Gold, silver, crude oil, natural gas, and agricultural futures",
    exampleTickers: ["XAUUSD", "XAGUSD", "CL1!", "NG1!", "MCX:GOLD"],
    coverage: "full",
    icon: "",
    order: 4,
  },
  "global-indices": {
    id: "global-indices",
    displayName: "Global Indices & Futures",
    shortName: "Indices",
    description: "US, European, Asian index futures and CFDs",
    exampleTickers: ["ES1!", "NQ1!", "DAX", "FTSE", "Nikkei225"],
    coverage: "full",
    icon: "",
    order: 5,
  },
  "india-indices": {
    id: "india-indices",
    displayName: "Indian Indices",
    shortName: "India Indices",
    description: "NIFTY 50, BANKNIFTY, FINNIFTY, MIDCPNIFTY, SENSEX and sector indices",
    exampleTickers: ["NIFTY50", "BANKNIFTY", "FINNIFTY", "SENSEX", "NIFTYMIDCAP150"],
    coverage: "beta",
    icon: "",
    order: 6,
  },
  "india-equities": {
    id: "india-equities",
    displayName: "Indian Stocks (NSE/BSE)",
    shortName: "India Stocks",
    description: "NSE and BSE listed stocks across all market caps",
    exampleTickers: ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK"],
    coverage: "beta",
    icon: "",
    order: 7,
  },
  "india-options": {
    id: "india-options",
    displayName: "Indian Options & Option Chain",
    shortName: "India Options",
    description:
      "Index & stock options: OI analysis, max pain, PCR, payoff diagrams, expiry context",
    exampleTickers: ["NIFTY CE/PE", "BANKNIFTY CE/PE", "FINNIFTY CE/PE", "Stock options"],
    coverage: "beta",
    icon: "",
    order: 8,
  },
};

export const MARKET_PACK_LIST = Object.values(MARKET_PACKS).sort((a, b) => a.order - b.order);

/** Auto-detected from chart; user can override in the uploader */
export type MarketHint = MarketPackId | "auto";
