import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlanCardHero } from "@/components/analysis/PlanCardHero";

describe("PlanCardHero Component Tests", () => {
  it("renders a LONG stance setup correctly with entry, stop and target", () => {
    const longPlan = {
      stance: "long" as const,
      entry: {
        type: "breakout",
        priceOrZone: 150,
        reasoning: "Above resistance",
      },
      stop: {
        price: 145,
        reasoning: "Below pivot low",
      },
      targets: [{ price: 160, rr: 2 }],
      invalidation: "Daily close below 145",
      summary: "Bullish breakout opportunity",
    };

    render(
      <PlanCardHero plan={longPlan} symbol="AAPL" timeframe="1D" />
    );

    expect(screen.getByText(/▲ Long Setup/i)).toBeDefined();
    expect(screen.getByText("150")).toBeDefined();
    expect(screen.getByText("145")).toBeDefined();
    expect(screen.getByText("160")).toBeDefined();
    expect(screen.getByText(/Daily close below 145/i)).toBeDefined();
  });

  it("renders a WAIT stance setup gracefully showing patience instructions", () => {
    const waitPlan = {
      stance: "wait" as const,
      invalidation: "Wait for clear boundary test",
      summary: "Market is chopping in the middle of the range",
    };

    render(
      <PlanCardHero plan={waitPlan} symbol="NIFTY" timeframe="15m" />
    );

    expect(
      screen.getByText(/Stance: WAIT \(No Clean Edge Yet\)/i)
    ).toBeDefined();
    expect(
      screen.getByText(/Market is chopping in the middle of the range/i)
    ).toBeDefined();
    expect(
      screen.getByText(/Wait for clear boundary test/i)
    ).toBeDefined();
  });
});
