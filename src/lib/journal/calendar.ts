import type { Trade } from "./schema";

export interface DayCellData {
  dateString: string; // 'YYYY-MM-DD'
  dayNumber: number;
  inMonth: boolean;
  isWeekend: boolean;
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
}

export interface DayAggregate {
  dateString: string;
  pnl: number;
  r: number;
  count: number;
  wins: number;
  losses: number;
  breakevens: number;
  trades: Trade[];
}

export interface WeekAggregate {
  weekNumber: number; // 1-based index in the rendered month
  pnl: number;
  r: number;
  count: number;
  wins: number;
  losses: number;
}

export interface MonthGridOptions {
  weekStart: 0 | 1; // 0 = Sunday, 1 = Monday
  showWeekends: boolean;
}

/**
 * Parses YYYY-MM-DD string into year, month (1-12), and day without timezone shifts.
 */
export function parseDateOnly(dateStr: string): { year: number; month: number; day: number } {
  const [y, m, d] = dateStr.split("-").map((v) => parseInt(v, 10));
  return { year: y, month: m, day: d };
}

/**
 * Formats year, month (1-12), day into standard YYYY-MM-DD string.
 */
export function formatDateOnly(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

/**
 * Returns number of days in a given year and month (1-12).
 * Correctly accounts for leap years (e.g. Feb 2028 has 29 days).
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Builds the month calendar grid.
 * Generates rows (weeks) of day cells, including leading/trailing days from adjacent months.
 * Days outside the current month are flagged with `inMonth: false`.
 * If `showWeekends === false`, weekend days (Saturday & Sunday) are omitted.
 */
export function buildMonthGrid(
  year: number,
  month: number, // 1-based (1 = Jan, 12 = Dec)
  opts: MonthGridOptions = { weekStart: 1, showWeekends: false }
): DayCellData[][] {
  const { weekStart, showWeekends } = opts;
  const daysInMonth = getDaysInMonth(year, month);

  // Day of week for 1st of month: 0 (Sun) to 6 (Sat)
  const firstDayOfWeek = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();

  // Calculate leading days needed from previous month
  // If weekStart is 1 (Monday): Sun(0)->6, Mon(1)->0, Tue(2)->1, etc.
  // If weekStart is 0 (Sunday): Sun(0)->0, Mon(1)->1, etc.
  const leadingDaysCount = (firstDayOfWeek - weekStart + 7) % 7;

  // Previous month details
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  // Next month details
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  const rawCells: DayCellData[] = [];

  // 1. Leading days
  for (let i = leadingDaysCount - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const dow = (weekStart + rawCells.length) % 7;
    const isWeekend = dow === 0 || dow === 6;
    rawCells.push({
      dateString: formatDateOnly(prevYear, prevMonth, day),
      dayNumber: day,
      inMonth: false,
      isWeekend,
      dayOfWeek: dow,
    });
  }

  // 2. Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = (weekStart + rawCells.length) % 7;
    const isWeekend = dow === 0 || dow === 6;
    rawCells.push({
      dateString: formatDateOnly(year, month, d),
      dayNumber: d,
      inMonth: true,
      isWeekend,
      dayOfWeek: dow,
    });
  }

  // 3. Trailing days to complete standard 7-day rows
  const remaining = (7 - (rawCells.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const dow = (weekStart + rawCells.length) % 7;
    const isWeekend = dow === 0 || dow === 6;
    rawCells.push({
      dateString: formatDateOnly(nextYear, nextMonth, d),
      dayNumber: d,
      inMonth: false,
      isWeekend,
      dayOfWeek: dow,
    });
  }

  // Group raw cells into full 7-day weeks first
  const weeks7: DayCellData[][] = [];
  for (let i = 0; i < rawCells.length; i += 7) {
    weeks7.push(rawCells.slice(i, i + 7));
  }

  // Filter weekends per row if showWeekends is false
  if (!showWeekends) {
    return weeks7
      .map((week) => week.filter((cell) => !cell.isWeekend))
      .filter((week) => week.length > 0);
  }

  return weeks7;
}

/**
 * Aggregates a list of trades by calendar date (YYYY-MM-DD).
 */
export function aggregateByDay(trades: Trade[]): Map<string, DayAggregate> {
  const map = new Map<string, DayAggregate>();

  for (const trade of trades) {
    const dateStr = trade.trade_date;
    let entry = map.get(dateStr);
    if (!entry) {
      entry = {
        dateString: dateStr,
        pnl: 0,
        r: 0,
        count: 0,
        wins: 0,
        losses: 0,
        breakevens: 0,
        trades: [],
      };
      map.set(dateStr, entry);
    }

    entry.pnl = Math.round((entry.pnl + trade.pnl) * 100) / 100;
    if (trade.r_multiple !== null && trade.r_multiple !== undefined) {
      entry.r = Math.round((entry.r + Number(trade.r_multiple)) * 1000) / 1000;
    }

    entry.count += 1;
    if (trade.pnl > 0) entry.wins += 1;
    else if (trade.pnl < 0) entry.losses += 1;
    else entry.breakevens += 1;

    entry.trades.push(trade);
  }

  return map;
}

/**
 * Aggregates weekly totals for each week row in the month grid.
 * CRITICAL SPEC RULE:
 * Only days that are in the visible month (`inMonth: true`) are counted toward
 * the week's P&L and trade count. A week spanning two months shows two partial
 * weeks, one per respective month view.
 */
export function aggregateByWeek(
  grid: DayCellData[][],
  dayMap: Map<string, DayAggregate>
): WeekAggregate[] {
  return grid.map((week, idx) => {
    let weekPnl = 0;
    let weekR = 0;
    let weekCount = 0;
    let weekWins = 0;
    let weekLosses = 0;

    for (const cell of week) {
      // Only count days belonging to the active month
      if (cell.inMonth) {
        const dayData = dayMap.get(cell.dateString);
        if (dayData) {
          weekPnl += dayData.pnl;
          weekR += dayData.r;
          weekCount += dayData.count;
          weekWins += dayData.wins;
          weekLosses += dayData.losses;
        }
      }
    }

    return {
      weekNumber: idx + 1,
      pnl: Math.round(weekPnl * 100) / 100,
      r: Math.round(weekR * 1000) / 1000,
      count: weekCount,
      wins: weekWins,
      losses: weekLosses,
    };
  });
}
