import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Button } from "@/components/ui/Button";
import { BiasPill } from "@/components/analysis/primitives/BiasPill";
import { PriceTag } from "@/components/analysis/primitives/PriceTag";
import { LevelChip } from "@/components/analysis/primitives/LevelChip";

describe("UI Primitives: Button", () => {
  it("renders with children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeDefined();
  });

  it("applies primary-gradient variant classes", () => {
    const { container } = render(
      <Button variant="primary-gradient">Primary CTA</Button>
    );
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("btn-primary-gradient");
  });

  it("handles loading state and disables the button", () => {
    render(<Button isLoading>Submitting</Button>);
    const btn = screen.getByRole("button") as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.querySelector("svg")).toBeDefined();
  });

  it("respects disabled prop", () => {
    render(<Button disabled>Disabled Action</Button>);
    const btn = screen.getByRole("button", { name: "Disabled Action" }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});

describe("Trading Primitives: BiasPill", () => {
  it("renders bullish bias with mandatory icon and text label", () => {
    render(<BiasPill bias="bullish" />);
    const pill = screen.getByRole("status");
    expect(pill.textContent).toContain("▲");
    expect(pill.textContent).toContain("Bullish");
  });

  it("renders bearish bias with icon and text label", () => {
    render(<BiasPill bias="bearish" />);
    const pill = screen.getByRole("status");
    expect(pill.textContent).toContain("▼");
    expect(pill.textContent).toContain("Bearish");
  });

  it("renders neutral bias with icon and text label", () => {
    render(<BiasPill bias="neutral" />);
    const pill = screen.getByRole("status");
    expect(pill.textContent).toContain("◆");
    expect(pill.textContent).toContain("Neutral");
  });

  it("supports custom label override while preserving icon", () => {
    render(<BiasPill bias="bullish" label="Strong Uptrend" />);
    const pill = screen.getByRole("status");
    expect(pill.textContent).toContain("▲");
    expect(pill.textContent).toContain("Strong Uptrend");
  });
});

describe("Trading Primitives: PriceTag", () => {
  it("formats price with tabular numerals and prefix", () => {
    render(<PriceTag price={24500.5} prefix="₹" copyable={false} />);
    const btn = screen.getByRole("button");
    expect(btn.textContent).toContain("₹24,500.50");
  });
});

describe("Trading Primitives: LevelChip", () => {
  it("renders support type and strength dots", () => {
    const { container } = render(<LevelChip type="support" strength={3} />);
    expect(container.textContent).toContain("Support");
    // Should have 3 dots
    expect(container.textContent).toContain("●●●");
  });
});
