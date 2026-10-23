import { describe, it, expect } from "vitest";
import { detectMarket } from "@/server/markets/packs";

describe("Market Detection", () => {
  it("detects Indian indices", () => {
    expect(detectMarket("NIFTY")).toBe("india-indices");
    expect(detectMarket("NIFTY50")).toBe("india-indices");
    expect(detectMarket("BANKNIFTY")).toBe("india-indices");
    expect(detectMarket("FINNIFTY")).toBe("india-indices");
    expect(detectMarket("SENSEX")).toBe("india-indices");
  });

  it("detects Indian options from CE/PE notation", () => {
    expect(detectMarket("NIFTY24OCT25000CE")).toBe("india-options");
    expect(detectMarket("BANKNIFTY 52000 PE")).toBe("india-options");
  });

  it("detects Indian equities from exchange suffix", () => {
    expect(detectMarket("RELIANCE.NS")).toBe("india-equities");
    expect(detectMarket("TCS.BO")).toBe("india-equities");
    expect(detectMarket("INFY.NSE")).toBe("india-equities");
  });

  it("detects Crypto pairs", () => {
    expect(detectMarket("BTCUSDT")).toBe("crypto");
    expect(detectMarket("ETHUSDT")).toBe("crypto");
    expect(detectMarket("SOLPERP")).toBe("crypto");
    expect(detectMarket("BTC")).toBe("crypto");
  });

  it("detects Forex pairs", () => {
    expect(detectMarket("EURUSD")).toBe("forex");
    expect(detectMarket("GBPJPY")).toBe("forex");
    expect(detectMarket("USDINR")).toBe("forex");
    expect(detectMarket("AUDCAD")).toBe("forex");
  });

  it("detects Commodities", () => {
    expect(detectMarket("XAUUSD")).toBe("commodities");
    expect(detectMarket("XAGUSD")).toBe("commodities");
    expect(detectMarket("BRENT")).toBe("commodities");
    expect(detectMarket("MCX:GOLD")).toBe("commodities");
  });

  it("detects Global Indices & Futures", () => {
    expect(detectMarket("ES1!")).toBe("global-indices");
    expect(detectMarket("NQ1!")).toBe("global-indices");
    expect(detectMarket("DAX")).toBe("global-indices");
    expect(detectMarket("SPX")).toBe("global-indices");
  });

  it("falls back to US equities for unknown symbols", () => {
    expect(detectMarket("AAPL")).toBe("us-equities");
    expect(detectMarket("TSLA")).toBe("us-equities");
    expect(detectMarket("UNKNOWN_TICKER_123")).toBe("us-equities");
  });
});
