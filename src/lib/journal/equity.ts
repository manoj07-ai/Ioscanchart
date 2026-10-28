import type { Trade } from "./schema";

export type EquityRange = "month" | "3m" | "ytd" | "all";

export interface EquityPoint {
  date: string; // YYYY-MM-DD
  dayPnl: number;
  cumulativePnl: number;
  dayR: number;
  cumulativeR: number;
}

/**
 * Filter trades by specified time range relative to a reference date.
 */
export function filterTradesByRange(
  trades: Trade[],
  range: EquityRange,
  referenceDateStr?: string
): Trade[] {
  if (range === "all" || trades.length === 0) return trades;

  const now = referenceDateStr ? new Date(referenceDateStr + "T00:00:00Z") : new Date();
  let cutoffDateStr: string;

  if (range === "month") {
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, "0");
    cutoffDateStr = `${y}-${m}-01`;
  } else if (range === "3m") {
    const d = new Date(now.getTime());
    d.setUTCMonth(d.getUTCMonth() - 3);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    cutoffDateStr = `${y}-${m}-${day}`;
  } else {
    // ytd
    cutoffDateStr = `${now.getUTCFullYear()}-01-01`;
  }

  return trades.filter((t) => t.trade_date >= cutoffDateStr);
}

/**
 * Builds cumulative equity curve data points per trading day, starting at zero.
 */
export function buildEquityCurve(
  trades: Trade[],
  range: EquityRange = "month",
  referenceDateStr?: string
): EquityPoint[] {
  const filtered = filterTradesByRange(trades, range, referenceDateStr);

  if (filtered.length === 0) {
    const today = referenceDateStr || new Date().toISOString().slice(0, 10);
    return [
      { date: today, dayPnl: 0, cumulativePnl: 0, dayR: 0, cumulativeR: 0 },
    ];
  }

  // Aggregate by calendar date
  const dayMap = new Map<string, { pnl: number; r: number }>();
  for (const t of filtered) {
    const current = dayMap.get(t.trade_date) || { pnl: 0, r: 0 };
    current.pnl += Number(t.pnl);
    if (t.r_multiple !== null && t.r_multiple !== undefined) {
      current.r += Number(t.r_multiple);
    }
    dayMap.set(t.trade_date, current);
  }

  // Sort dates chronologically
  const dates = Array.from(dayMap.keys()).sort();

  let cumPnl = 0;
  let cumR = 0;
  const points: EquityPoint[] = [];

  // Start with baseline 0 point before first trade day if desirable
  for (const date of dates) {
    const dayData = dayMap.get(date)!;
    cumPnl = Math.round((cumPnl + dayData.pnl) * 100) / 100;
    cumR = Math.round((cumR + dayData.r) * 1000) / 1000;

    points.push({
      date,
      dayPnl: Math.round(dayData.pnl * 100) / 100,
      cumulativePnl: cumPnl,
      dayR: Math.round(dayData.r * 1000) / 1000,
      cumulativeR: cumR,
    });
  }

  return points;
}
