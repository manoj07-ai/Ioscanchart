import { describe, it, expect } from "vitest";
import { PLANS } from "@/config/plans";
import { MARKET_PACK_LIST } from "@/config/markets";
import { brand } from "@/config/brand";
import { DISCLAIMER_SHORT } from "@/config/legal";

describe("config: brand", () => {
  it("exports a non-empty name", () => {
    expect(brand.name.length).toBeGreaterThan(0);
  });

  it("does not hardcode the name as a string literal in tests", () => {
    // The name should only come from brand.ts
    expect(brand.name).toBeTruthy();
  });
});

describe("config: plans", () => {
  it("has exactly 3 plans", () => {
    expect(Object.keys(PLANS)).toHaveLength(3);
  });

  it("demo plan has 1 credit", () => {
    expect(PLANS.demo.initialCredits).toBe(1);
  });

  it("all plans have a dailyCap defined", () => {
    for (const plan of Object.values(PLANS)) {
      // dailyCap can be null (no cap) or a positive number
      if (plan.dailyCap !== null) {
        expect(plan.dailyCap).toBeGreaterThan(0);
      }
    }
  });
});

describe("config: markets", () => {
  it("has 8 market packs", () => {
    expect(MARKET_PACK_LIST).toHaveLength(8);
  });

  it("all packs have coverage set", () => {
    for (const pack of MARKET_PACK_LIST) {
      expect(["full", "beta"]).toContain(pack.coverage);
    }
  });

  it("india packs are coverage beta at launch", () => {
    const indiaPacks = MARKET_PACK_LIST.filter((p) => p.id.startsWith("india-"));
    expect(indiaPacks.length).toBeGreaterThan(0);
    for (const pack of indiaPacks) {
      expect(pack.coverage).toBe("beta");
    }
  });
});

describe("config: legal", () => {
  it("short disclaimer does not contain profit guarantee promises", () => {
    // These are phrases that would claim profits/accuracy — NOT the same as
    // "do not guarantee" which is the correct legal negation form
    const forbidden = [
      "guaranteed profits",
      "always profitable",
      "win rate",
      "100% accurate",
      "certain profit",
      "recover your investment",
    ];
    for (const phrase of forbidden) {
      expect(DISCLAIMER_SHORT.toLowerCase()).not.toContain(phrase);
    }
  });

  it("short disclaimer mentions it is not investment advice", () => {
    expect(DISCLAIMER_SHORT.toLowerCase()).toContain("not investment advice");
  });
});
