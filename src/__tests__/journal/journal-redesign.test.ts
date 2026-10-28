import { describe, it, expect } from "vitest";
import {
  buildMonthGrid,
  aggregateByDay,
  aggregateByWeek,
  parseDateOnly,
  formatDateOnly,
} from "@/lib/journal/calendar";
import { computeStats } from "@/lib/journal/stats";
import { buildEquityCurve } from "@/lib/journal/equity";
import {
  formatMoney,
  parseAmountInput,
  deriveFromFills,
  deriveR,
} from "@/lib/journal/format";
import { parseAndValidateCsv, generateCsvTemplate, CSV_HEADER } from "@/lib/journal/csv";
import type { Trade } from "@/lib/journal/schema";

describe("Calendar Grid & Leap Year Handling", () => {
  it("handles leap year February 2028 with exactly 29 active days", () => {
    const grid = buildMonthGrid(2028, 2, {
      weekStart: 1, // Mon-Sun
      showWeekends: true,
    });

    const allCells = grid.flat();
    const feb2028Days = allCells.filter((c) => c.inMonth);
    expect(feb2028Days).toHaveLength(29);
    expect(feb2028Days[28].dateString).toBe("2028-02-29");
    expect(grid.length).toBeGreaterThanOrEqual(4);
  });

  it("handles non-leap year February 2027 with exactly 28 active days", () => {
    const grid = buildMonthGrid(2027, 2, {
      weekStart: 1,
      showWeekends: true,
    });

    const allCells = grid.flat();
    const feb2027Days = allCells.filter((c) => c.inMonth);
    expect(feb2027Days).toHaveLength(28);
    expect(feb2027Days[27].dateString).toBe("2027-02-28");
  });

  it("handles weekStart: 0 (Sunday) vs weekStart: 1 (Monday)", () => {
    // Oct 2026: Oct 1 is a Thursday
    const sundayStartGrid = buildMonthGrid(2026, 10, {
      weekStart: 0,
      showWeekends: true,
    });
    // First column is Sunday (dayOfWeek 0)
    expect(sundayStartGrid[0][0].dayOfWeek).toBe(0);

    const mondayStartGrid = buildMonthGrid(2026, 10, {
      weekStart: 1,
      showWeekends: true,
    });
    // First column is Monday (dayOfWeek 1)
    expect(mondayStartGrid[0][0].dayOfWeek).toBe(1);
  });

  it("excludes weekends when showWeekends toggle is false (Mon-Fri 5 columns)", () => {
    const grid = buildMonthGrid(2026, 10, {
      weekStart: 1,
      showWeekends: false,
    });

    for (const week of grid) {
      expect(week).toHaveLength(5);
      for (const cell of week) {
        expect(cell.dayOfWeek).not.toBe(0); // No Sunday
        expect(cell.dayOfWeek).not.toBe(6); // No Saturday
      }
    }
  });

  it("parses and formats dates without timezone shifting", () => {
    const parsed = parseDateOnly("2026-10-28");
    expect(parsed.year).toBe(2026);
    expect(parsed.month).toBe(10);
    expect(parsed.day).toBe(28);

    const formatted = formatDateOnly(2026, 10, 28);
    expect(formatted).toBe("2026-10-28");
  });
});

describe("Weekly Aggregation Boundary Rules", () => {
  it("only counts days in the active month for weekly totals", () => {
    // Oct 2026 grid with weekends
    const grid = buildMonthGrid(2026, 10, {
      weekStart: 1,
      showWeekends: true,
    });

    const trades: Trade[] = [
      { trade_date: "2026-10-31", symbol: "NIFTY", pnl: 500, currency: "USD", r_multiple: 2 },
      { trade_date: "2026-11-01", symbol: "NIFTY", pnl: 1000, currency: "USD", r_multiple: 4 }, // Outside active month (Nov 1)
    ];

    const dayMap = aggregateByDay(trades);
    const weeklyTotals = aggregateByWeek(grid, dayMap);

    // The last week in October grid contains Oct 31 and Nov 1
    // The weekly total must strictly include only Oct 31 (+500), excluding Nov 1 (+1000)
    const lastWeek = weeklyTotals[weeklyTotals.length - 1];
    expect(lastWeek.pnl).toBe(500);
    expect(lastWeek.count).toBe(1);
  });
});

describe("Statistical Engine & Gating", () => {
  const sampleTrades: Trade[] = [
    { trade_date: "2026-10-01", symbol: "AAPL", pnl: 100, currency: "USD", r_multiple: 1.0 },
    { trade_date: "2026-10-02", symbol: "AAPL", pnl: 200, currency: "USD", r_multiple: 2.0 },
    { trade_date: "2026-10-03", symbol: "AAPL", pnl: -100, currency: "USD", r_multiple: -1.0 },
    { trade_date: "2026-10-04", symbol: "AAPL", pnl: 0, currency: "USD", r_multiple: 0.0 }, // Breakeven
    { trade_date: "2026-10-05", symbol: "AAPL", pnl: 150, currency: "USD", r_multiple: 1.5 },
    { trade_date: "2026-10-06", symbol: "AAPL", pnl: -100, currency: "USD", r_multiple: -1.0 },
    { trade_date: "2026-10-07", symbol: "AAPL", pnl: 300, currency: "USD", r_multiple: 3.0 },
    { trade_date: "2026-10-08", symbol: "AAPL", pnl: -50, currency: "USD", r_multiple: -0.5 },
    { trade_date: "2026-10-09", symbol: "AAPL", pnl: 250, currency: "USD", r_multiple: 2.5 },
  ];

  it("gates win rate and expectancy when trade count is under 10", () => {
    // 9 trades (<10 threshold)
    const stats = computeStats(sampleTrades);
    expect(stats.tradeCount).toBe(9);
    expect(stats.netPnl).toBe(750); // 100+200-100+0+150-100+300-50+250 = 750
    expect(stats.winRate).toBeNull();
    expect(stats.profitFactor).toBeNull();
    expect(stats.expectancy).toBeNull();
  });

  it("calculates win rate, profit factor, and expectancy when sample size >= 10", () => {
    const tenTrades: Trade[] = [
      ...sampleTrades,
      { trade_date: "2026-10-10", symbol: "AAPL", pnl: 100, currency: "USD", r_multiple: 1.0 },
    ];

    const stats = computeStats(tenTrades);
    expect(stats.tradeCount).toBe(10);
    expect(stats.winRate).not.toBeNull();
    expect(stats.profitFactor).not.toBeNull();
    expect(stats.expectancy).not.toBeNull();

    // Wins: 6 (100, 200, 150, 300, 250, 100)
    // Losses: 3 (-100, -100, -50)
    // Breakeven: 1 (0) -> Excluded from win rate denominator!
    // Win rate = 6 / (6 + 3) = 6 / 9 = 0.667 (66.7%)
    expect(stats.wins).toBe(6);
    expect(stats.losses).toBe(3);
    expect(stats.breakeven).toBe(1);
    expect(stats.winRate).toBeCloseTo(0.667, 2);

    // Total Gains = 1100, Total Losses = 250 -> Profit Factor = 1100 / 250 = 4.4
    expect(stats.profitFactor).toBeCloseTo(4.4, 1);
  });

  it("handles zero losses gracefully without crashing", () => {
    const allWins: Trade[] = Array.from({ length: 12 }, (_, i) => ({
      trade_date: `2026-10-${String(i + 1).padStart(2, "0")}`,
      symbol: "NVDA",
      pnl: 100,
      currency: "USD",
      r_multiple: 1.0,
    }));

    const stats = computeStats(allWins);
    expect(stats.winRate).toBe(1); // 1.0 = 100%
    expect(stats.profitFactor).toBeNull(); // No losses -> profit factor is null
  });
});

describe("Equity Curve Calculations", () => {
  it("builds cumulative P&L and R points ordered chronologically", () => {
    const trades: Trade[] = [
      { trade_date: "2026-10-02", symbol: "ES", pnl: 500, currency: "USD", r_multiple: 2.0 },
      { trade_date: "2026-10-01", symbol: "ES", pnl: 250, currency: "USD", r_multiple: 1.0 },
      { trade_date: "2026-10-03", symbol: "ES", pnl: -100, currency: "USD", r_multiple: -0.5 },
    ];

    const points = buildEquityCurve(trades, "all");
    expect(points.length).toBeGreaterThanOrEqual(3);
    // Find the date entries
    const p1 = points.find((p) => p.date === "2026-10-01");
    const p2 = points.find((p) => p.date === "2026-10-02");
    const p3 = points.find((p) => p.date === "2026-10-03");

    expect(p1?.cumulativePnl).toBe(250);
    expect(p2?.cumulativePnl).toBe(750);
    expect(p3?.cumulativePnl).toBe(650);
  });
});

describe("Formatters & Parsing Utilities", () => {
  it("strictly places the negative sign before the currency symbol", () => {
    const formattedNeg = formatMoney(-150, "USD");
    expect(formattedNeg).toBe("-$150.00");
    expect(formattedNeg).not.toBe("$-150.00");

    const formattedPosWithSign = formatMoney(250, "USD", { signDisplay: "always" });
    expect(formattedPosWithSign).toBe("+$250.00");
  });

  it("formats Indian Rupees with en-IN grouping", () => {
    const formattedInr = formatMoney(125000, "INR");
    expect(formattedInr).toContain("1,25,000.00");
  });

  it("handles points mode correctly", () => {
    const formattedPts = formatMoney(42.5, "POINTS", { signDisplay: "always" });
    expect(formattedPts).toBe("+42.50 pts");
  });

  it("respects privacy mode by rendering bullet glyphs", () => {
    const privateMoney = formatMoney(1500, "USD", { privacyBlur: true });
    expect(privateMoney).toBe("••••");
  });

  it("parses diverse amount formats including parenthesis and signs", () => {
    const p1 = parseAmountInput("+250");
    expect(p1.ok).toBe(true);
    if (p1.ok) expect(p1.value).toBe(250);

    const p2 = parseAmountInput("-80");
    expect(p2.ok).toBe(true);
    if (p2.ok) expect(p2.value).toBe(-80);

    const p3 = parseAmountInput("(80)");
    expect(p3.ok).toBe(true);
    if (p3.ok) expect(p3.value).toBe(-80);

    const p4 = parseAmountInput("1,250.75");
    expect(p4.ok).toBe(true);
    if (p4.ok) expect(p4.value).toBe(1250.75);

    const p5 = parseAmountInput("invalid");
    expect(p5.ok).toBe(false);
  });

  it("derives P&L from execution fills accurately", () => {
    // Long 100 shares from 150 to 155 with $2 fee
    const longPnl = deriveFromFills({
      direction: "long",
      entry: 150,
      exit: 155,
      quantity: 100,
      multiplier: 1,
      fees: 2,
    });
    // (155 - 150) * 100 * 1 - 2 = 500 - 2 = 498
    expect(longPnl).toBe(498);

    // Short 2 contracts from 4000 to 3950 with $10 fee
    const shortPnl = deriveFromFills({
      direction: "short",
      entry: 4000,
      exit: 3950,
      quantity: 2,
      multiplier: 5,
      fees: 10,
    });
    // (4000 - 3950) * 2 * 5 - 10 = 50 * 10 - 10 = 490
    expect(shortPnl).toBe(490);
  });

  it("derives R-multiple correctly", () => {
    expect(deriveR(500, 200)).toBe(2.5);
    expect(deriveR(-200, 200)).toBe(-1.0);
    expect(deriveR(100, 0)).toBeNull();
  });
});

describe("CSV Export & Import Validation", () => {
  it("generates valid CSV template headers", () => {
    const template = generateCsvTemplate();
    expect(template).toContain("Date");
    expect(template).toContain("Symbol");
    expect(template).toContain("P&L");
    expect(template).toContain(CSV_HEADER);
  });

  it("parses valid CSV text and flags invalid rows", () => {
    const csvContent = `${CSV_HEADER}
2026-10-01,AAPL,150.00,1.5,long,us-equities,230.00,233.00,50,1,2.00,100.00,"Breakout",,yes,Good entry
invalid-date,TSLA,not-a-number,1.0,short,us-equities,,,,,,,,"",,no,
2026-10-03,EURUSD,-80.00,-1.0,short,forex,1.0850,1.0870,10000,1,1.00,80.00,"Pullback","Early exit",no,Tilt`;

    const result = parseAndValidateCsv(csvContent);
    expect(result.validTrades).toHaveLength(2);
    expect(result.validTrades[0].symbol).toBe("AAPL");
    expect(result.validTrades[1].symbol).toBe("EURUSD");
    expect(result.errors.length).toBeGreaterThanOrEqual(1);
  });
});
