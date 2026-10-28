import type { Trade } from "./schema";

export type InsightGroupKey =
  | "weekday"
  | "symbol"
  | "setupTag"
  | "mistakeTag"
  | "followedPlan"
  | "market";

export interface InsightRow {
  label: string;
  count: number;
  netPnl: number;
  totalR: number;
  winRate: number | null; // Null if count < 10
  avgR: number | null;
  wins: number;
  losses: number;
}

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Computes grouped insights per parameter.
 * Strictly gates win rate calculation at < 10 trades per bucket.
 */
export function groupInsights(trades: Trade[], key: InsightGroupKey): InsightRow[] {
  const buckets = new Map<
    string,
    { count: number; netPnl: number; wins: number; losses: number; totalR: number; rCount: number }
  >();

  function addToBucket(label: string, trade: Trade) {
    let b = buckets.get(label);
    if (!b) {
      b = { count: 0, netPnl: 0, wins: 0, losses: 0, totalR: 0, rCount: 0 };
      buckets.set(label, b);
    }
    b.count += 1;
    b.netPnl += Number(trade.pnl);
    if (trade.pnl > 0) b.wins += 1;
    else if (trade.pnl < 0) b.losses += 1;

    if (trade.r_multiple !== null && trade.r_multiple !== undefined) {
      b.totalR += Number(trade.r_multiple);
      b.rCount += 1;
    }
  }

  for (const trade of trades) {
    if (key === "weekday") {
      // Parse day of week without timezone shift
      const [y, m, d] = trade.trade_date.split("-").map((v) => parseInt(v, 10));
      const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
      addToBucket(WEEKDAY_NAMES[dow], trade);
    } else if (key === "symbol") {
      addToBucket(trade.symbol || "UNKNOWN", trade);
    } else if (key === "market") {
      addToBucket(trade.market || "General", trade);
    } else if (key === "followedPlan") {
      const label =
        trade.followed_plan === "yes"
          ? "Followed Plan"
          : trade.followed_plan === "partly"
          ? "Partly Followed"
          : trade.followed_plan === "no"
          ? "Deviated from Plan"
          : "Not Specified";
      addToBucket(label, trade);
    } else if (key === "setupTag") {
      const tags = trade.setup_tags && trade.setup_tags.length > 0 ? trade.setup_tags : ["Untagged"];
      for (const tag of tags) {
        addToBucket(tag, trade);
      }
    } else if (key === "mistakeTag") {
      const tags = trade.mistake_tags && trade.mistake_tags.length > 0 ? trade.mistake_tags : ["No Mistake Logged"];
      for (const tag of tags) {
        addToBucket(tag, trade);
      }
    }
  }

  const rows: InsightRow[] = Array.from(buckets.entries()).map(([label, b]) => {
    const decided = b.wins + b.losses;
    const winRate =
      b.count >= 10 && decided > 0
        ? Math.round((b.wins / decided) * 100)
        : null;

    const avgR = b.rCount > 0 ? Math.round((b.totalR / b.rCount) * 100) / 100 : null;

    return {
      label,
      count: b.count,
      netPnl: Math.round(b.netPnl * 100) / 100,
      totalR: Math.round(b.totalR * 100) / 100,
      winRate,
      avgR,
      wins: b.wins,
      losses: b.losses,
    };
  });

  // Sort rows: by default by netPnl descending (best to worst), or by weekday order if weekday
  if (key === "weekday") {
    rows.sort((a, b) => WEEKDAY_NAMES.indexOf(a.label) - WEEKDAY_NAMES.indexOf(b.label));
  } else {
    rows.sort((a, b) => b.netPnl - a.netPnl);
  }

  return rows;
}
