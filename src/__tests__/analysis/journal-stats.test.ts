import { describe, it, expect } from "vitest";
import { calculateJournalStats, type JournalEntryRecord } from "@/server/journal/stats";

describe("calculateJournalStats", () => {
  it("handles empty entries safely", () => {
    const stats = calculateJournalStats([]);
    expect(stats.totalCount).toBe(0);
    expect(stats.decidedCount).toBe(0);
    expect(stats.wins).toBe(0);
    expect(stats.losses).toBe(0);
    expect(stats.winRatePercent).toBeNull();
    expect(stats.averageR).toBe(0);
    expect(stats.totalR).toBe(0);
    expect(stats.bestMarket).toBeNull();
    expect(stats.cumulativeSeries).toHaveLength(1);
    expect(stats.cumulativeSeries[0].cumulativeR).toBe(0);
  });

  it("suppresses win-rate percentage when sample size is under 10 trades (<10)", () => {
    const entries: JournalEntryRecord[] = [
      {
        id: "1",
        userId: "u1",
        outcome: "win",
        rMultiple: 2.5,
        createdAt: "2026-10-01T10:00:00Z",
      },
      {
        id: "2",
        userId: "u1",
        outcome: "win",
        rMultiple: 2.0,
        createdAt: "2026-10-02T10:00:00Z",
      },
      {
        id: "3",
        userId: "u1",
        outcome: "loss",
        rMultiple: -1.0,
        createdAt: "2026-10-03T10:00:00Z",
      },
      {
        id: "4",
        userId: "u1",
        outcome: "skipped",
        rMultiple: null,
        createdAt: "2026-10-04T10:00:00Z",
      },
    ];

    const stats = calculateJournalStats(entries);
    expect(stats.totalCount).toBe(4);
    expect(stats.decidedCount).toBe(3);
    expect(stats.wins).toBe(2);
    expect(stats.losses).toBe(1);
    expect(stats.skipped).toBe(1);
    // Crucial rule: winRatePercent MUST be null
    expect(stats.winRatePercent).toBeNull();
    expect(stats.winRateDisplay).toContain("2W / 1L");
    expect(stats.winRateDisplay).toContain("3/10 sample");
  });

  it("calculates win rate percentage when decidedCount >= 10", () => {
    const entries: JournalEntryRecord[] = [];
    // 7 wins
    for (let i = 0; i < 7; i++) {
      entries.push({
        id: `w-${i}`,
        userId: "u1",
        outcome: "win",
        rMultiple: 2.0,
        createdAt: `2026-10-0${i + 1}T10:00:00Z`,
      });
    }
    // 3 losses
    for (let i = 0; i < 3; i++) {
      entries.push({
        id: `l-${i}`,
        userId: "u1",
        outcome: "loss",
        rMultiple: -1.0,
        createdAt: `2026-10-1${i}T10:00:00Z`,
      });
    }

    const stats = calculateJournalStats(entries);
    expect(stats.decidedCount).toBe(10);
    expect(stats.wins).toBe(7);
    expect(stats.losses).toBe(3);
    expect(stats.winRatePercent).toBe(70);
    expect(stats.winRateDisplay).toBe("70% (7/10 trades)");
  });

  it("calculates average R and cumulative R series chronologically", () => {
    // Pass out-of-order dates to verify sorting
    const entries: JournalEntryRecord[] = [
      {
        id: "trade-3",
        userId: "u1",
        outcome: "win",
        rMultiple: 3.0,
        createdAt: "2026-10-03T10:00:00Z",
      },
      {
        id: "trade-1",
        userId: "u1",
        outcome: "win",
        rMultiple: 2.0,
        createdAt: "2026-10-01T10:00:00Z",
      },
      {
        id: "trade-2",
        userId: "u1",
        outcome: "loss",
        rMultiple: -1.0,
        createdAt: "2026-10-02T10:00:00Z",
      },
      {
        id: "trade-4",
        userId: "u1",
        outcome: "skipped",
        rMultiple: null,
        createdAt: "2026-10-04T10:00:00Z",
      },
    ];

    const stats = calculateJournalStats(entries);

    // Total R = 2.0 - 1.0 + 3.0 = 4.0
    expect(stats.totalR).toBe(4.0);
    // Average R = 4.0 / 3 decided trades with R = 1.33
    expect(stats.averageR).toBe(1.33);

    // Cumulative trajectory checks
    // index 0: initial baseline (0, 0R)
    // index 1: trade 1 (2026-10-01) -> +2.0R
    // index 2: trade 2 (2026-10-02) -> +1.0R
    // index 3: trade 3 (2026-10-03) -> +4.0R
    // trade 4 skipped, not added to cumulative
    expect(stats.cumulativeSeries).toHaveLength(4);
    expect(stats.cumulativeSeries[0].cumulativeR).toBe(0);
    expect(stats.cumulativeSeries[1].cumulativeR).toBe(2.0);
    expect(stats.cumulativeSeries[2].cumulativeR).toBe(1.0);
    expect(stats.cumulativeSeries[3].cumulativeR).toBe(4.0);
  });

  it("ranks best and worst performing markets correctly", () => {
    const entries: JournalEntryRecord[] = [
      {
        id: "1",
        userId: "u1",
        marketPack: "india-indices",
        outcome: "win",
        rMultiple: 3.0,
        createdAt: "2026-10-01T10:00:00Z",
      },
      {
        id: "2",
        userId: "u1",
        marketPack: "india-indices",
        outcome: "win",
        rMultiple: 2.0,
        createdAt: "2026-10-02T10:00:00Z",
      },
      {
        id: "3",
        userId: "u1",
        marketPack: "crypto",
        outcome: "loss",
        rMultiple: -1.0,
        createdAt: "2026-10-03T10:00:00Z",
      },
      {
        id: "4",
        userId: "u1",
        marketPack: "crypto",
        outcome: "loss",
        rMultiple: -1.0,
        createdAt: "2026-10-04T10:00:00Z",
      },
    ];

    const stats = calculateJournalStats(entries);
    expect(stats.bestMarket).not.toBeNull();
    expect(stats.bestMarket?.market).toBe("india-indices");
    expect(stats.bestMarket?.avgR).toBe(2.5);

    expect(stats.worstMarket).not.toBeNull();
    expect(stats.worstMarket?.market).toBe("crypto");
    expect(stats.worstMarket?.avgR).toBe(-1.0);
  });
});
