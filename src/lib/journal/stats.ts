import type { Trade } from "./schema";

export interface TradeStats {
  netPnl: number;
  tradeCount: number;
  wins: number;
  losses: number;
  breakeven: number;
  /** Null if tradeCount < 10 to enforce statistical honesty */
  winRate: number | null;
  winRateGatedReason?: string;
  avgWin: number;
  avgLoss: number;
  /** Null if tradeCount < 10 or if there are no losses */
  profitFactor: number | null;
  /** Null if tradeCount < 10 */
  expectancy: number | null;
  bestDay: { amount: number; dateString: string } | null;
  worstDay: { amount: number; dateString: string } | null;
  bestTrade: Trade | null;
  worstTrade: Trade | null;
  maxDrawdown: number;
  longestWinStreak: number;
  longestLossStreak: number;
  avgR: number | null;
  totalR: number | null;
}

/**
 * Computes comprehensive trading statistics from an array of trades.
 * Strictly adheres to ethical stats display rules:
 * - Breakeven trades (pnl = 0) are excluded from the win-rate denominator.
 * - Win rate, profit factor, and expectancy return `null` when tradeCount < 10.
 */
export function computeStats(trades: Trade[]): TradeStats {
  const tradeCount = trades.length;

  if (tradeCount === 0) {
    return {
      netPnl: 0,
      tradeCount: 0,
      wins: 0,
      losses: 0,
      breakeven: 0,
      winRate: null,
      winRateGatedReason: "No trades logged yet",
      avgWin: 0,
      avgLoss: 0,
      profitFactor: null,
      expectancy: null,
      bestDay: null,
      worstDay: null,
      bestTrade: null,
      worstTrade: null,
      maxDrawdown: 0,
      longestWinStreak: 0,
      longestLossStreak: 0,
      avgR: null,
      totalR: null,
    };
  }

  // Sort trades chronologically for streaks and equity curve
  const sorted = [...trades].sort((a, b) => {
    if (a.trade_date !== b.trade_date) {
      return a.trade_date.localeCompare(b.trade_date);
    }
    return (a.created_at || "").localeCompare(b.created_at || "");
  });

  let netPnl = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let wins = 0;
  let losses = 0;
  let breakeven = 0;
  let totalR = 0;
  let rCount = 0;

  let bestTrade: Trade | null = null;
  let worstTrade: Trade | null = null;

  // Day P&L aggregation for best/worst day
  const dayPnlMap = new Map<string, number>();

  // Streaks
  let currentWinStreak = 0;
  let longestWinStreak = 0;
  let currentLossStreak = 0;
  let longestLossStreak = 0;

  // Drawdown tracking on cumulative curve
  let runningPnl = 0;
  let peak = 0;
  let maxDrawdown = 0;

  for (const trade of sorted) {
    const pnl = Number(trade.pnl);
    netPnl += pnl;

    // Track best and worst individual trade
    if (!bestTrade || pnl > bestTrade.pnl) bestTrade = trade;
    if (!worstTrade || pnl < worstTrade.pnl) worstTrade = trade;

    // Day aggregation
    const prevDayPnl = dayPnlMap.get(trade.trade_date) || 0;
    dayPnlMap.set(trade.trade_date, prevDayPnl + pnl);

    // Drawdown computation
    runningPnl += pnl;
    if (runningPnl > peak) {
      peak = runningPnl;
    }
    const currentDrawdown = peak - runningPnl;
    if (currentDrawdown > maxDrawdown) {
      maxDrawdown = currentDrawdown;
    }

    // Win/Loss/BE counts and streaks
    if (pnl > 0) {
      wins += 1;
      grossProfit += pnl;
      currentWinStreak += 1;
      currentLossStreak = 0;
      if (currentWinStreak > longestWinStreak) longestWinStreak = currentWinStreak;
    } else if (pnl < 0) {
      losses += 1;
      grossLoss += Math.abs(pnl);
      currentLossStreak += 1;
      currentWinStreak = 0;
      if (currentLossStreak > longestLossStreak) longestLossStreak = currentLossStreak;
    } else {
      breakeven += 1;
      currentWinStreak = 0;
      currentLossStreak = 0;
    }

    if (trade.r_multiple !== null && trade.r_multiple !== undefined) {
      totalR += Number(trade.r_multiple);
      rCount += 1;
    }
  }

  // Best and worst day
  let bestDay: { amount: number; dateString: string } | null = null;
  let worstDay: { amount: number; dateString: string } | null = null;

  for (const [day, dayNet] of dayPnlMap.entries()) {
    if (!bestDay || dayNet > bestDay.amount) {
      bestDay = { amount: Math.round(dayNet * 100) / 100, dateString: day };
    }
    if (!worstDay || dayNet < worstDay.amount) {
      worstDay = { amount: Math.round(dayNet * 100) / 100, dateString: day };
    }
  }

  // Averages
  const avgWin = wins > 0 ? Math.round((grossProfit / wins) * 100) / 100 : 0;
  const avgLoss = losses > 0 ? Math.round((grossLoss / losses) * 100) / 100 : 0;

  // Gating rule: Need >= 10 decided trades for win rate, profit factor, and expectancy
  const decidedTrades = wins + losses;
  let winRate: number | null = null;
  let winRateGatedReason: string | undefined;
  let profitFactor: number | null = null;
  let expectancy: number | null = null;

  if (tradeCount < 10) {
    winRateGatedReason = `Need 10+ trades (you have ${tradeCount})`;
  } else {
    // Breakeven excluded from win rate denominator
    const rawWinRate = decidedTrades > 0 ? wins / decidedTrades : 0;
    winRate = Math.round(rawWinRate * 1000) / 1000;

    if (grossLoss > 0) {
      profitFactor = Math.round((grossProfit / grossLoss) * 100) / 100;
    } else if (grossProfit > 0) {
      profitFactor = null; // Spec: null if no losses
    }

    const exp = rawWinRate * avgWin - (1 - rawWinRate) * avgLoss;
    expectancy = Math.round(exp * 100) / 100;
  }

  const avgR = rCount > 0 ? Math.round((totalR / rCount) * 100) / 100 : null;

  return {
    netPnl: Math.round(netPnl * 100) / 100,
    tradeCount,
    wins,
    losses,
    breakeven,
    winRate,
    winRateGatedReason,
    avgWin,
    avgLoss,
    profitFactor,
    expectancy,
    bestDay,
    worstDay,
    bestTrade,
    worstTrade,
    maxDrawdown: Math.round(maxDrawdown * 100) / 100,
    longestWinStreak,
    longestLossStreak,
    avgR,
    totalR: rCount > 0 ? Math.round(totalR * 100) / 100 : null,
  };
}
