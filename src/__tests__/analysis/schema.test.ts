import { describe, it, expect } from "vitest";
import {
  AnalysisResultSchema,
  TV_LINK_REGEX,
  validateTvLink,
} from "@/server/ai/schema";
import { PROMPT_VERSION } from "@/server/ai/gemini";

describe("AnalysisResultSchema Refinements", () => {
  const baseValidResult = {
    dataQuality: {
      readable: true,
      score: 90,
      detected: {
        symbol: "NVDA",
        market: "us-equities" as const,
        timeframe: "1D",
        priceScaleVisible: true,
        indicatorsSeen: ["200 SMA", "RSI"],
      },
      issues: [],
    },
    instrument: {
      symbol: "NVDA",
      market: "us-equities" as const,
      timeframe: "1D",
      currency: "USD",
      lastPrice: 120.0,
    },
    structure: {
      trend: "up" as const,
      phase: "expansion",
      summary: "Bullish trend continuation",
      keyObservations: ["Higher highs", "Above 200 SMA"],
    },
    levels: [
      {
        type: "support" as const,
        price: 115.0,
        strength: 4 as const,
        reason: "Confluence of prior high and 50 EMA",
        visibleEvidence: "Double bounce",
      },
    ],
    indicators: [
      {
        name: "RSI",
        reading: "62",
        implication: "Bullish momentum without being overbought",
        bias: "bull" as const,
      },
    ],
    scenarios: [
      {
        name: "Breakout",
        bias: "bull" as const,
        trigger: "Daily close above 125",
        path: "Rally to 140",
        targets: [140],
        modelConfidence: "high" as const,
        confidenceNote: "Model confidence based on strong volume.",
      },
    ],
    plan: {
      stance: "long" as const,
      entry: {
        type: "level" as const,
        priceOrZone: 120.0,
        reasoning: "Entry at current market price",
      },
      stop: {
        price: 114.0,
        reasoning: "Below key support at 115",
      },
      targets: [{ price: 132.0, rr: 2.0 }],
      invalidation: "Close below 114",
      summary: "Long setup targeting 132 with stop at 114",
    },
    meta: {
      promptVersion: PROMPT_VERSION,
      marketPack: "us-equities" as const,
      disclaimer: "Not financial advice.",
    },
  };

  it("accepts a fully valid structured analysis result", () => {
    const parsed = AnalysisResultSchema.safeParse(baseValidResult);
    expect(parsed.success).toBe(true);
  });

  it("enforces stance === 'wait' when dataQuality.readable is false", () => {
    const unreadable = {
      ...baseValidResult,
      dataQuality: {
        ...baseValidResult.dataQuality,
        readable: false,
        score: 30,
        issues: ["Price axis cropped"],
      },
      plan: {
        ...baseValidResult.plan,
        stance: "long" as const, // invalid: should be 'wait'
      },
    };

    const parsed = AnalysisResultSchema.safeParse(unreadable);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0].message).toContain(
        "When dataQuality.readable is false, plan.stance must be 'wait'"
      );
    }
  });

  it("passes when unreadable chart has stance === 'wait'", () => {
    const unreadableWait = {
      ...baseValidResult,
      dataQuality: {
        ...baseValidResult.dataQuality,
        readable: false,
        score: 25,
        issues: ["Chart resolution too low"],
      },
      plan: {
        ...baseValidResult.plan,
        stance: "wait" as const,
      },
    };

    const parsed = AnalysisResultSchema.safeParse(unreadableWait);
    expect(parsed.success).toBe(true);
  });

  it("fails if long stop is higher than entry price", () => {
    const invalidLongStop = {
      ...baseValidResult,
      plan: {
        ...baseValidResult.plan,
        stance: "long" as const,
        entry: {
          type: "level" as const,
          priceOrZone: 100.0,
          reasoning: "Support test",
        },
        stop: {
          price: 105.0, // Error: stop above entry for a long!
          reasoning: "Invalid stop placement",
        },
      },
    };

    const parsed = AnalysisResultSchema.safeParse(invalidLongStop);
    expect(parsed.success).toBe(false);
  });

  it("fails if short stop is lower than entry price", () => {
    const invalidShortStop = {
      ...baseValidResult,
      plan: {
        ...baseValidResult.plan,
        stance: "short" as const,
        entry: {
          type: "level" as const,
          priceOrZone: 100.0,
          reasoning: "Resistance test",
        },
        stop: {
          price: 95.0, // Error: stop below entry for a short!
          reasoning: "Invalid stop placement",
        },
      },
    };

    const parsed = AnalysisResultSchema.safeParse(invalidShortStop);
    expect(parsed.success).toBe(false);
  });

  it("recomputes R:R correctly from entry and stop", () => {
    const customResult = {
      ...baseValidResult,
      plan: {
        ...baseValidResult.plan,
        stance: "long" as const,
        entry: {
          type: "level" as const,
          priceOrZone: 100.0,
          reasoning: "Test entry",
        },
        stop: {
          price: 90.0, // Risk is 10.0
          reasoning: "Test stop",
        },
        targets: [
          { price: 120.0, rr: 999.0 }, // Target gain is 20.0 -> RR should be recomputed to 2.0
          { price: 130.0, rr: 0.1 },   // Target gain is 30.0 -> RR should be recomputed to 3.0
        ],
      },
    };

    const parsed = AnalysisResultSchema.safeParse(customResult);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.plan.targets?.[0].rr).toBe(2);
      expect(parsed.data.plan.targets?.[1].rr).toBe(3);
    }
  });
});

describe("TradingView Link Regex Allow-list", () => {
  it("allows valid TradingView snapshot URLs", () => {
    expect(validateTvLink("https://www.tradingview.com/x/abc123XYZ/")).toBe(true);
    expect(validateTvLink("https://www.tradingview.com/x/A1b2C3d4")).toBe(true);
    expect(TV_LINK_REGEX.test("https://www.tradingview.com/x/7Ghf90pQ/")).toBe(true);
  });

  it("rejects malicious or other host URLs (SSRF prevention)", () => {
    expect(validateTvLink("http://www.tradingview.com/x/abc123XYZ/")).toBe(false); // http not allowed
    expect(validateTvLink("https://tradingview.com/x/abc123XYZ/")).toBe(false); // must have www
    expect(validateTvLink("https://attacker.com/x/abc123XYZ/")).toBe(false);
    expect(validateTvLink("https://www.tradingview.com/chart/abc")).toBe(false); // only /x/ snapshots
    expect(validateTvLink("https://www.tradingview.com/x/abc/../../etc/passwd")).toBe(false);
  });
});
