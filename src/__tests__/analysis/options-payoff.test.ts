import { describe, it, expect } from "vitest";
import { calculatePayoff, type OptionLeg } from "@/components/analysis/OptionsView";

describe("OptionsView Payoff Calculator", () => {
  it("calculates payoff for a single long call", () => {
    const legs: OptionLeg[] = [
      { action: "buy", type: "call", strike: 100, premium: 5 },
    ];

    const prices = [90, 100, 105, 110];
    const payoffs = calculatePayoff(legs, prices);

    // At 90: 0 - 5 = -5
    // At 100: 0 - 5 = -5
    // At 105: 5 - 5 = 0 (breakeven)
    // At 110: 10 - 5 = +5
    expect(payoffs).toEqual([-5, -5, 0, 5]);
  });

  it("calculates payoff for a bull call debit spread", () => {
    const legs: OptionLeg[] = [
      { action: "buy", type: "call", strike: 100, premium: 6 },
      { action: "sell", type: "call", strike: 110, premium: 2 },
    ];
    // Net debit paid = 6 - 2 = 4 (max loss)

    const prices = [90, 100, 104, 110, 120];
    const payoffs = calculatePayoff(legs, prices);

    // At 90: -4
    // At 100: -4
    // At 104: (104-100) - 4 = 0 (breakeven)
    // At 110: (110-100) - 4 = +6 (max profit)
    // At 120: capped at +6
    expect(payoffs).toEqual([-4, -4, 0, 6, 6]);
  });

  it("calculates payoff for a short put (credit position)", () => {
    const legs: OptionLeg[] = [
      { action: "sell", type: "put", strike: 95, premium: 3 },
    ];

    const prices = [90, 92, 95, 100];
    const payoffs = calculatePayoff(legs, prices);

    // At 90: 3 - (95 - 90) = -2
    // At 92: 3 - (95 - 92) = 0 (breakeven)
    // At 95: +3 (max profit)
    // At 100: +3
    expect(payoffs).toEqual([-2, 0, 3, 3]);
  });
});
