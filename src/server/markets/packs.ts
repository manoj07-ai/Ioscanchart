/**
 * Market packs — rich context strings injected into Gemini system prompt.
 * Also exports detectMarket() for auto-detecting the market from a symbol.
 *
 * 🔒 SERVER ONLY — never import in client components.
 */

import type { MarketPackId } from "@/config/markets";
import indiaExpiry from "./data/india-expiry.json";
import indiaLotSizes from "./data/india-lot-sizes.json";
import marketHours from "./data/market-hours.json";

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface MarketPackContext {
  id: MarketPackId;
  systemContext: string; // rich context injected into Gemini system prompt
}

// ---------------------------------------------------------------------------
// Helpers — pull typed data from JSON files
// ---------------------------------------------------------------------------

const nseHours = marketHours.sessions.NSE_BSE;
const nyseHours = marketHours.sessions.NYSE_NASDAQ;
const forexHours = marketHours.sessions.FOREX;
const cryptoHours = marketHours.sessions.CRYPTO;
const mcxHours = marketHours.sessions.MCX;
const lots = indiaLotSizes.lots;

// ---------------------------------------------------------------------------
// Market pack context strings
// ---------------------------------------------------------------------------

const PACK_CONTEXTS: Record<MarketPackId, string> = {
  "us-equities": `
MARKET: US Equities (NYSE, NASDAQ, AMEX)
Trading Session (ET): Pre-market ${nyseHours.pre} | Regular ${nyseHours.regular} | After-hours ${nyseHours.post}
Timezone: ${nyseHours.tz}
Currency: USD
Key characteristics:
- Settlement: T+1 (SEC rule)
- Circuit breakers: S&P 500 halts at -7% (L1), -13% (L2), -20% (L3)
- Pattern Day Trader rule: <$25k account requires 3+ day restriction
- High liquidity during 09:30-11:30 ET and 14:30-16:00 ET (power hours)
- ETFs (SPY, QQQ, IWM) move with index futures (ES, NQ, RTY)
- Earnings announcements cause large overnight gaps — check earnings calendar
- Sector rotation is common; note if the chart is a sector ETF or individual stock
Technical notes:
- VWAP is widely used as intraday directional anchor
- Pre-market gaps above/below prior-day highs/lows are significant levels
- Volume climax near whole numbers ($100, $150, $200) is common
`.trim(),

  forex: `
MARKET: Forex (Foreign Exchange)
Trading Hours: ${forexHours.note}
Major Sessions: ${forexHours.majorSessions.join(" | ")}
Key characteristics:
- Most liquid market in the world; ~$7.5 trillion daily volume
- Major pairs (EURUSD, GBPUSD, USDJPY, USDCHF, AUDUSD, USDCAD, NZDUSD) — tightest spreads
- Minor pairs: no USD (EURGBP, EURJPY, GBPJPY, etc.) — moderate spreads
- Exotic pairs (USDINR, USDTRY, USDMXN): wide spreads, lower liquidity
- Pip values: For 4-decimal pairs (EURUSD), 1 pip = 0.0001. For JPY pairs, 1 pip = 0.01
- Standard lot = 100,000 units; Mini lot = 10,000; Micro lot = 1,000
- Leverage: up to 1:30 (EU/UK retail), 1:50 (US retail), higher offshore
Key price drivers:
- Central bank decisions (FOMC, ECB, BOE, BOJ) — major volatility events
- NFP (US Non-Farm Payrolls) first Friday of month — extreme volatility
- Session overlaps: London/NY (13:00-17:00 GMT) is highest volume window
Technical notes:
- Round numbers (1.1000, 1.2000) are strong psychological levels
- Liquidity hunts (stop raids) are common below/above prior swing lows/highs
- Asian session tends to be range-bound; breakouts often occur at London open
`.trim(),

  crypto: `
MARKET: Cryptocurrency
Trading Hours: ${cryptoHours.note}
Key characteristics:
- No official market close — trades continuously including weekends and holidays
- Major assets: BTC (Bitcoin), ETH (Ethereum), BNB, SOL, XRP, ADA, AVAX
- Most pairs quoted in USDT (Tether) or USDC on centralised exchanges (Binance, Coinbase, OKX)
- Perpetual futures with funding rates (positive = longs pay shorts; negative = shorts pay longs)
- Funding rate extremes signal crowded positioning and potential reversals
Volatility characteristics:
- Daily moves of 5-15% are normal for altcoins; 2-5% for BTC/ETH
- Weekends can have lower volume and exaggerated moves
- US market hours (09:30-16:00 ET) often drive directional moves
- CME Bitcoin futures expiry (monthly, quarterly) can influence spot price
Key price drivers:
- Bitcoin dominance affects altcoin correlation
- Macro risk-on/risk-off (similar to NASDAQ correlation for large caps)
- On-chain metrics: exchange inflows, whale movements, liquidation clusters
Technical notes:
- Round numbers ($10k, $50k, $100k for BTC) are strong psychological levels
- Liquidation clusters visible on heatmaps are key support/resistance zones
- High-timeframe structure is reliable; low-timeframe can be noisy due to 24/7 trading
`.trim(),

  commodities: `
MARKET: Commodities (Metals, Energy, Agriculture)
Key commodities and trading venues:
- Gold (XAUUSD): OTC spot + COMEX futures (GC). USD-denominated. 24-hour trading Mon-Fri.
- Silver (XAGUSD): OTC spot + COMEX (SI). More volatile than gold.
- Crude Oil (WTI/CL): NYMEX. Pit hours 09:00-14:30 ET; electronic 18:00-17:00 ET.
- Brent Crude (BRENT): ICE. Benchmark for international oil pricing.
- Natural Gas (NG): NYMEX. Highly seasonal and weather-dependent.
- MCX (India): Gold/Silver/CrudeoilM trading hours: ${mcxHours.regular} (${mcxHours.tz})
Key characteristics:
- Commodities are USD-denominated (mostly); USD strength → commodity prices fall
- Geopolitical events and supply disruptions drive large moves
- Seasonal patterns important for agricultural commodities
- OPEC decisions are major catalysts for crude oil
Technical notes:
- Gold/Silver ratio is a useful relative-strength metric
- Fibonacci retracements work well on commodity charts
- Volume and open interest data (when visible) provide conviction signals
- Long-term monthly/weekly charts often show multi-year cup-and-handle or channel patterns
`.trim(),

  "global-indices": `
MARKET: Global Indices & Futures
Key indices and trading hours:
- US Futures: ES (S&P 500), NQ (NASDAQ 100), RTY (Russell 2000) — CME. Nearly 24/5.
- European: DAX (Germany) 09:00-17:30 CET; FTSE 100 (UK) 08:00-16:30 GMT
- Asian: Nikkei 225 (Japan) 09:00-15:30 JST; Hang Seng (HK) 09:30-16:00 HKT; A50 (China)
- VIX (CBOE Volatility Index): Fear gauge for S&P 500. >30 = elevated fear; >40 = extreme.
Key characteristics:
- Index futures trade nearly 24/5; spot indices only during exchange hours
- Index options expiry (monthly OPEX, quarterly): major gamma events, pin risk
- Correlation: S&P 500 leads global risk appetite; DAX tracks European sentiment
- Economic data (GDP, CPI, PMI) is the primary catalyst for index moves
Technical notes:
- Key whole number levels (S&P 4000, 5000; Nifty 22000, 24000) act as magnets
- Fair value gap (FVG) and imbalance areas are significant for index futures
- Gap fills at market open are common, especially after overnight news
- Monthly/weekly pivots and VAH/VAL (Value Area High/Low) are widely used
`.trim(),

  "india-indices": `
MARKET: Indian Indices (NSE/BSE)
Trading Session (IST): Pre-open ${nseHours.pre} | Regular ${nseHours.regular} | Closing ${nseHours.post}
Timezone: ${nseHours.tz}
Key indices:
- NIFTY 50: Benchmark index of NSE (50 large-cap stocks). Lot size: ${lots.NIFTY} units.
- BANKNIFTY: Banking sector index. Lot size: ${lots.BANKNIFTY} units. More volatile than NIFTY.
- FINNIFTY: Financial services index. Lot size: ${lots.FINNIFTY} units.
- MIDCPNIFTY: Mid-cap 150 index. Lot size: ${lots.MIDCPNIFTY} units.
- SENSEX: BSE benchmark (30 stocks). Lot size: ${lots.SENSEX} units.
Expiry rhythm (derivatives):
- NIFTY: Weekly expiry ${indiaExpiry.nifty.weekly} | Monthly: ${indiaExpiry.nifty.monthly}
- BANKNIFTY: Weekly expiry ${indiaExpiry.banknifty.weekly} | Monthly: ${indiaExpiry.banknifty.monthly}
- FINNIFTY: Weekly expiry ${indiaExpiry.finnifty.weekly} | Monthly: ${indiaExpiry.finnifty.monthly}
- MIDCPNIFTY: Weekly expiry ${indiaExpiry.midcpnifty.weekly} | Monthly: ${indiaExpiry.midcpnifty.monthly}
- SENSEX: Weekly expiry ${indiaExpiry.sensex.weekly} | Monthly: ${indiaExpiry.sensex.monthly}
Key characteristics:
- Expiry days create pin risk around ATM strikes (max pain theory)
- SGX Nifty / Gift Nifty (IFSCA) provides pre-market direction before 09:15
- FII (Foreign Institutional Investor) flows heavily influence Nifty direction
- RBI monetary policy is the biggest domestic catalyst
- Budget (Union Budget, Feb 1) and quarterly results are major events
Technical notes:
- Previous day's high/low (PDH/PDL) are key intraday levels
- Opening range (09:15-09:30) breakout is a popular strategy
- CPR (Central Pivot Range) is widely used by Indian traders
- Orb (Opening Range Breakout) between 09:15-09:45 is a key setup
`.trim(),

  "india-equities": `
MARKET: Indian Equities (NSE/BSE)
Trading Session (IST): Pre-open ${nseHours.pre} | Regular ${nseHours.regular} | Closing ${nseHours.post}
Timezone: ${nseHours.tz}
Settlement: T+1 (rolling settlement since 2023)
Key characteristics:
- NSE (National Stock Exchange) has higher liquidity; BSE is older with broader listings
- F&O (Futures & Options) available for ~200 approved stocks (SEBI list)
- For F&O stocks: check lot size on NSE derivatives page (varies by stock)
- SEBI circuit limits: 2%, 5%, 10%, 20% daily price bands (varies by category)
- Delivery-based vs. intraday (MIS) margin requirements differ significantly
Sectors (key NSE indices):
- NIFTYBANK, NIFTYIT, NIFTYPHARMA, NIFTYFMCG, NIFTYAUTO, NIFTYMETAL
- Sector indices often lead individual stock moves in that sector
Key price drivers:
- Quarterly results (Q1: July, Q2: October, Q3: January, Q4: April)
- RBI policy, FII/DII flows, global cues (US futures, Asian markets)
- Promoter/institutional buying or pledging disclosures
Technical notes:
- EOD (end of day) charts are most reliable for swing setups
- Avoid trading illiquid small-caps on charts without volume confirmation
- Rights issues and bonus announcements cause adjusted price history — verify
- CPR (Central Pivot Range) and VWAP are popular among Indian retail traders
`.trim(),

  "india-options": `
MARKET: Indian Index Options (NSE F&O)
Trading Session (IST): Regular ${nseHours.regular}
Timezone: ${nseHours.tz}
Available instruments:
- NIFTY options: Lot size ${lots.NIFTY} units. Weekly (Thursday) + Monthly expiry.
- BANKNIFTY options: Lot size ${lots.BANKNIFTY} units. Weekly (Wednesday) + Monthly expiry.
- FINNIFTY options: Lot size ${lots.FINNIFTY} units. Weekly (Tuesday) + Monthly expiry.
- MIDCPNIFTY options: Lot size ${lots.MIDCPNIFTY} units. Weekly (Monday) + Monthly expiry.
- SENSEX options (BSE): Lot size ${lots.SENSEX} units. Weekly (Friday) + Monthly expiry.
Options-specific metrics visible on charts:
- OI (Open Interest): High OI at a strike = support/resistance or max pain zone
- PCR (Put-Call Ratio): >1 = more puts = bearish bias; <1 = bullish bias
- Max Pain: strike where option sellers' losses are minimised — index tends to pin here near expiry
- IV (Implied Volatility): high IV near events = expensive options, risk of IV crush post-event
Chart interpretation notes:
- Option chain heatmaps show heavy OI concentrations (these are key S/R levels)
- Premium decay (theta) accelerates in the last week before expiry
- Straddle/strangle charts: analyse the combined premium for range expectations
- On expiry day: index often pins near max pain, wide moves possible if stop hunts trigger
Key events causing IV spike:
- RBI policy (6 times/year), Budget, election results, global market crashes
- Monthly F&O expiry week: expect increased volatility and potential whipsaws
Risk management:
- Selling options requires higher margin; buying is capped at premium paid
- Adjust lot sizes per SEBI-mandated lot sizes (updated periodically)
`.trim(),
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get the rich market context string for a given market pack ID.
 */
export function getMarketPackContext(packId: MarketPackId): MarketPackContext {
  return {
    id: packId,
    systemContext: PACK_CONTEXTS[packId],
  };
}

// ---------------------------------------------------------------------------
// Symbol → market detection
// ---------------------------------------------------------------------------

/**
 * Detect the most likely MarketPackId from a symbol string.
 * Fallback: 'us-equities'
 */
export function detectMarket(symbol: string): MarketPackId {
  const s = symbol.toUpperCase().trim();

  // India indices
  if (
    /^(NIFTY|BANKNIFTY|FINNIFTY|MIDCPNIFTY|SENSEX|NIFTYMIDCAP|NIFTY50|NIFTYBANK|NIFTYFIN|NIFTYIT|NIFTYPHARMA|NIFTYAUTO|NIFTYFMCG|NIFTYMETAL|BANKEX)/.test(s)
  ) {
    // If it looks like an options symbol (contains CE or PE)
    if (/CE$|PE$|C$|P$/.test(s) || s.includes("CE ") || s.includes("PE ")) {
      return "india-options";
    }
    return "india-indices";
  }

  // India equities — NSE/BSE suffixes
  if (/\.(NS|BO|NSE|BSE)$/.test(s)) {
    return "india-equities";
  }

  // Crypto — common USDT/USD/BTC/ETH suffixes
  if (
    /(USDT|USDC|BUSD|PERP)$/.test(s) ||
    /^(BTC|ETH|BNB|SOL|XRP|ADA|AVAX|DOGE|MATIC|DOT|LINK|UNI|ATOM)/.test(s)
  ) {
    return "crypto";
  }

  // Forex — 6-letter currency pairs or known pairs
  if (
    /^(EUR|GBP|USD|JPY|CHF|AUD|NZD|CAD|HKD|SGD|INR|MXN|TRY|ZAR|NOK|SEK|DKK)(EUR|GBP|USD|JPY|CHF|AUD|NZD|CAD|HKD|SGD|INR|MXN|TRY|ZAR|NOK|SEK|DKK)$/.test(s) ||
    /^(EURUSD|GBPUSD|USDJPY|USDCHF|AUDUSD|USDCAD|NZDUSD|EURGBP|EURJPY|GBPJPY|USDINR)/.test(s)
  ) {
    return "forex";
  }

  // Commodities — gold, silver, oil, gas, MCX symbols
  if (
    /^(XAUUSD|XAGUSD|CL|NG|BRENT|WTI|GC|SI|HG|ZW|ZC|ZS|MCX:GOLD|MCX:SILVER|MCX:CRUDE|MCX:NG)/.test(s) ||
    /^(GOLD|SILVER|CRUDE|NATURALGAS|CRUDEOIL)$/.test(s)
  ) {
    return "commodities";
  }

  // Global indices & futures
  if (
    /^(ES|NQ|RTY|YM|DAX|FTSE|CAC|IBEX|STOXX|NIKKEI|HSI|KOSPI|ASX|A50|VIX|SPX|NDX|DJI|RUT)/.test(s) ||
    /1!$/.test(s) // continuous futures contract notation
  ) {
    return "global-indices";
  }

  // Default to US equities
  return "us-equities";
}
