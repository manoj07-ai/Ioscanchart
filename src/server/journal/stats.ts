export type JournalOutcome = "win" | "loss" | "breakeven" | "skipped";

export interface JournalEntryRecord {
  id: string;
  userId: string;
  analysisId?: string | null;
  outcome: JournalOutcome;
  rMultiple: number | null;
  notes?: string | null;
  createdAt: string;
  instrument?: string | null;
  marketPack?: string | null;
  timeframe?: string | null;
}

export interface CumulativeRPoint {
  index: number;
  date: string;
  rMultiple: number;
  cumulativeR: number;
}

export interface MarketStat {
  market: string;
  count: number;
  wins: number;
  totalR: number;
  avgR: number;
}

export interface JournalStats {
  totalCount: number;
  decidedCount: number; // win, loss, breakeven (excludes skipped)
  wins: number;
  losses: number;
  breakevens: number;
  skipped: number;
  /** Null if sample size < 10 trades to prevent misleading win-rate claims */
  winRatePercent: number | null;
  winRateDisplay: string;
  averageR: number;
  totalR: number;
  bestMarket: MarketStat | null;
  worstMarket: MarketStat | null;
  cumulativeSeries: CumulativeRPoint[];
}

/**
 * Computes trade journal statistics strictly from the user's logged entries.
 * Adheres to ethical trading transparency:
 * - Never shows statistical win rate percentages when sample size < 10 trades.
 * - Accurately factors negative, zero, and positive R-multiples.
 */
export function calculateJournalStats(entries: JournalEntryRecord[]): JournalStats {
  const totalCount = entries.length;
  if (totalCount === 0) {
    return {
      totalCount: 0,
      decidedCount: 0,
      wins: 0,
      losses: 0,
      breakevens: 0,
      skipped: 0,
      winRatePercent: null,
      winRateDisplay: "No trades logged yet",
      averageR: 0,
      totalR: 0,
      bestMarket: null,
      worstMarket: null,
      cumulativeSeries: [{ index: 0, date: new Date().toISOString(), rMultiple: 0, cumulativeR: 0 }],
    };
  }

  // Sort ascending by createdAt to compute accurate cumulative R trajectory
  const sorted = [...entries].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  let wins = 0;
  let losses = 0;
  let breakevens = 0;
  let skipped = 0;
  let totalR = 0;
  let rCount = 0;

  const marketMap = new Map<string, { count: number; wins: number; totalR: number }>();

  let runningR = 0;
  const cumulativeSeries: CumulativeRPoint[] = [
    { index: 0, date: sorted[0]?.createdAt || new Date().toISOString(), rMultiple: 0, cumulativeR: 0 },
  ];

  sorted.forEach((entry, idx) => {
    const outcome = entry.outcome;
    const r = entry.rMultiple !== null && !isNaN(Number(entry.rMultiple)) ? Number(entry.rMultiple) : null;

    if (outcome === "win") {
      wins++;
    } else if (outcome === "loss") {
      losses++;
    } else if (outcome === "breakeven") {
      breakevens++;
    } else if (outcome === "skipped") {
      skipped++;
    }

    if (outcome !== "skipped" && r !== null) {
      totalR += r;
      rCount++;
      runningR = Math.round((runningR + r) * 100) / 100;
      cumulativeSeries.push({
        index: idx + 1,
        date: entry.createdAt,
        rMultiple: r,
        cumulativeR: runningR,
      });
    }

    // Market grouping
    const market = entry.marketPack || "other";
    const currentMarket = marketMap.get(market) || { count: 0, wins: 0, totalR: 0 };
    currentMarket.count++;
    if (outcome === "win") currentMarket.wins++;
    if (r !== null) currentMarket.totalR += r;
    marketMap.set(market, currentMarket);
  });

  const decidedCount = wins + losses + breakevens;

  // Win rate rule: only show percentage when decidedCount >= 10
  let winRatePercent: number | null = null;
  let winRateDisplay: string;

  if (decidedCount < 10) {
    winRatePercent = null;
    winRateDisplay = `${wins}W / ${losses}L (${decidedCount}/10 sample)`;
  } else {
    winRatePercent = Math.round((wins / decidedCount) * 100);
    winRateDisplay = `${winRatePercent}% (${wins}/${decidedCount} trades)`;
  }

  const averageR = rCount > 0 ? Math.round((totalR / rCount) * 100) / 100 : 0;

  // Market rankings
  const marketStats: MarketStat[] = Array.from(marketMap.entries()).map(([market, m]) => ({
    market,
    count: m.count,
    wins: m.wins,
    totalR: Math.round(m.totalR * 100) / 100,
    avgR: m.count > 0 ? Math.round((m.totalR / m.count) * 100) / 100 : 0,
  }));

  marketStats.sort((a, b) => b.avgR - a.avgR);

  const bestMarket = marketStats.length > 0 ? marketStats[0] : null;
  const worstMarket = marketStats.length > 1 ? marketStats[marketStats.length - 1] : null;

  return {
    totalCount,
    decidedCount,
    wins,
    losses,
    breakevens,
    skipped,
    winRatePercent,
    winRateDisplay,
    averageR,
    totalR: Math.round(totalR * 100) / 100,
    bestMarket,
    worstMarket,
    cumulativeSeries,
  };
}
