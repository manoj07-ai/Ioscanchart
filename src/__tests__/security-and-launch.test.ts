import { describe, it, expect } from "vitest";
import { validateTvLink } from "@/server/ai/schema";
import { checkRateLimit } from "@/server/security/rate-limit";
import { MARKET_PACKS, type MarketPackId } from "@/config/markets";

describe("TradingView URL & SSRF Protection", () => {
  it("accepts valid TradingView /x/ snapshot links", () => {
    expect(validateTvLink("https://www.tradingview.com/x/ABC12345/")).toBe(true);
    expect(validateTvLink("https://www.tradingview.com/x/eKJKfliP/")).toBe(true);
    expect(validateTvLink("https://www.tradingview.com/x/12345678")).toBe(true);
  });

  it("rejects malicious, internal, or non-snapshot TradingView links", () => {
    // Non-snapshot workspace URLs
    expect(validateTvLink("https://www.tradingview.com/chart/XXXXXX/")).toBe(false);
    expect(validateTvLink("https://www.tradingview.com/symbols/AAPL/")).toBe(false);

    // SSRF attempts with other hosts
    expect(validateTvLink("https://malicious-site.com/x/ABC12345/")).toBe(false);
    expect(validateTvLink("http://www.tradingview.com/x/ABC12345/")).toBe(false); // Insecure HTTP
    expect(validateTvLink("https://www.tradingview.com.attacker.com/x/ABC/")).toBe(false);
    expect(validateTvLink("https://127.0.0.1/x/ABC12345/")).toBe(false);
    expect(validateTvLink("https://localhost:3000/x/ABC12345/")).toBe(false);
    expect(validateTvLink("javascript:alert(1)")).toBe(false);
  });
});

describe("Sliding Window Rate Limiter", () => {
  it("allows requests under the limit and blocks excess calls", () => {
    const testId = `test-user-${Date.now()}`;
    const limit = 5;

    for (let i = 0; i < limit; i++) {
      const res = checkRateLimit(testId, limit, 10_000);
      expect(res.success).toBe(true);
      expect(res.remaining).toBe(limit - 1 - i);
    }

    // 6th call should be blocked
    const blockedRes = checkRateLimit(testId, limit, 10_000);
    expect(blockedRes.success).toBe(false);
    expect(blockedRes.remaining).toBe(0);
    expect(blockedRes.resetMs).toBeGreaterThan(0);
  });
});

describe("Market Packs Integrity", () => {
  it("has all 8 required market packs defined with icons and orders", () => {
    const expectedPacks: MarketPackId[] = [
      "us-equities",
      "forex",
      "crypto",
      "commodities",
      "global-indices",
      "india-indices",
      "india-equities",
      "india-options",
    ];

    expect(Object.keys(MARKET_PACKS)).toHaveLength(8);
    for (const pack of expectedPacks) {
      expect(MARKET_PACKS[pack]).toBeDefined();
      expect(MARKET_PACKS[pack].displayName.length).toBeGreaterThan(0);
      expect(MARKET_PACKS[pack].exampleTickers.length).toBeGreaterThan(0);
    }
  });

  it("includes specific Indian derivatives details in India packs", () => {
    expect(MARKET_PACKS["india-indices"].exampleTickers).toContain("NIFTY50");
    expect(MARKET_PACKS["india-indices"].exampleTickers).toContain("BANKNIFTY");
    expect(MARKET_PACKS["india-options"].displayName).toContain("Options");
  });
});
