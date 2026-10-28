"use client";

import React, { useMemo } from "react";
import { formatMoney } from "@/lib/journal/format";
import {
  buildMonthGrid,
  aggregateByDay,
  aggregateByWeek,
  formatDateOnly,
} from "@/lib/journal/calendar";
import { DayCell } from "./DayCell";
import { WeekCell } from "./WeekCell";
import { Button } from "@/components/ui/Button";
import type { Trade } from "@/lib/journal/schema";

interface MonthCalendarProps {
  year: number;
  month: number; // 1-12
  trades: Trade[];
  selectedDate: string; // YYYY-MM-DD
  currency: string;
  viewMode: "pnl" | "r";
  weekStart: 0 | 1;
  showWeekends: boolean;
  privacyBlur?: boolean;
  onSelectDate: (dateStr: string) => void;
  onAddTradeOnDate: (dateStr: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToday: () => void;
  onToggleWeekends: () => void;
  onOpenShare: () => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_HEADERS_MON = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAY_HEADERS_SUN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthCalendar({
  year,
  month,
  trades,
  selectedDate,
  currency,
  viewMode,
  weekStart,
  showWeekends,
  privacyBlur = false,
  onSelectDate,
  onAddTradeOnDate,
  onPrevMonth,
  onNextMonth,
  onGoToday,
  onToggleWeekends,
  onOpenShare,
}: MonthCalendarProps) {
  // Compute grid and day aggregates
  const grid = useMemo(() => {
    return buildMonthGrid(year, month, { weekStart, showWeekends });
  }, [year, month, weekStart, showWeekends]);

  const dayMap = useMemo(() => {
    return aggregateByDay(trades);
  }, [trades]);

  const weekAggregates = useMemo(() => {
    return aggregateByWeek(grid, dayMap);
  }, [grid, dayMap]);

  // Compute monthly P&L and R strictly for days in the current month
  const { monthlyPnl, monthlyR, maxDayAbsPnl } = useMemo(() => {
    let pnl = 0;
    let r = 0;
    let maxAbs = 0;

    for (const week of grid) {
      for (const cell of week) {
        if (cell.inMonth) {
          const d = dayMap.get(cell.dateString);
          if (d) {
            pnl += d.pnl;
            r += d.r;
            if (Math.abs(d.pnl) > maxAbs) maxAbs = Math.abs(d.pnl);
          }
        }
      }
    }

    return {
      monthlyPnl: Math.round(pnl * 100) / 100,
      monthlyR: Math.round(r * 1000) / 1000,
      maxDayAbsPnl: maxAbs,
    };
  }, [grid, dayMap]);

  // Today calculation in user's local context
  const todayDate = useMemo(() => {
    const d = new Date();
    return formatDateOnly(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }, []);

  // Headers based on weekStart and showWeekends
  const headers = useMemo(() => {
    const base = weekStart === 1 ? [...WEEKDAY_HEADERS_MON] : [...WEEKDAY_HEADERS_SUN];
    const filtered = showWeekends ? base : base.filter((h) => h !== "Sat" && h !== "Sun");
    return [...filtered, "Week"];
  }, [weekStart, showWeekends]);

  // Format monthly display
  let monthlyDisplay: string;
  if (privacyBlur) {
    monthlyDisplay = "••••";
  } else if (viewMode === "r") {
    monthlyDisplay = monthlyR > 0 ? `+${monthlyR}R` : `${monthlyR}R`;
  } else {
    monthlyDisplay = formatMoney(monthlyPnl, currency, {
      signDisplay: "always",
      privacyBlur,
    });
  }

  const isMonthlyPos = monthlyPnl > 0;
  const isMonthlyNeg = monthlyPnl < 0;

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-1)] p-4 sm:p-5 space-y-4 shadow-xs">
      {/* Calendar Top Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[var(--line)]">
        {/* Left: Navigation and Month title */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[var(--bg-2)] p-1 rounded-lg border border-[var(--line)]">
            <button
              onClick={onPrevMonth}
              className="p-1 rounded text-[var(--text-1)] hover:text-[var(--text-0)] hover:bg-[var(--bg-3)] transition-colors cursor-pointer"
              title="Previous month"
              aria-label="Previous month"
            >
              ‹
            </button>
            <button
              onClick={onNextMonth}
              className="p-1 rounded text-[var(--text-1)] hover:text-[var(--text-0)] hover:bg-[var(--bg-3)] transition-colors cursor-pointer"
              title="Next month"
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-[var(--text-0)] tracking-tight ml-1">
            {MONTH_NAMES[month - 1]} {year}
          </h2>

          <Button
            variant="secondary"
            size="sm"
            onClick={onGoToday}
            className="text-xs h-7 px-2.5 ml-1"
          >
            Today
          </Button>

          {/* Quick weekend toggle */}
          <button
            onClick={onToggleWeekends}
            className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-md border transition-colors cursor-pointer ${
              showWeekends
                ? "bg-[var(--candle)]/15 border-[var(--candle)]/40 text-[var(--candle)]"
                : "bg-[var(--bg-2)] border-[var(--line)] text-[var(--text-2)] hover:text-[var(--text-0)]"
            }`}
            title="Toggle weekends (Saturday & Sunday)"
          >
            <span>7D</span>
          </button>
        </div>

        {/* Right: Monthly total and share export */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[var(--text-2)] block">
              Monthly P&L
            </span>
            <div
              className={`font-mono text-base sm:text-xl font-bold tracking-tight truncate flex items-center justify-end ${
                isMonthlyPos
                  ? "text-[var(--candle)]"
                  : isMonthlyNeg
                  ? "text-[var(--bear)]"
                  : "text-[var(--text-0)]"
              }`}
            >
              <span className="text-xs mr-0.5">{isMonthlyPos ? "▲ " : isMonthlyNeg ? "▼ " : ""}</span>
              <span>{monthlyDisplay}</span>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenShare}
            className="text-xs h-8 px-2.5 shrink-0"
            title="Export Month Calendar image"
          >
            <span>Share ↗</span>
          </Button>
        </div>
      </div>

      {/* Weekday Column Headers */}
      <div
        className="grid gap-1.5 sm:gap-2 text-center"
        style={{
          gridTemplateColumns: `repeat(${headers.length - 1}, minmax(0, 1fr)) 72px`,
        }}
      >
        {headers.map((h, idx) => (
          <div
            key={h + idx}
            className={`text-[11px] font-mono font-bold uppercase tracking-wider py-1 select-none ${
              h === "Week"
                ? "text-[var(--candle)] border-b border-[var(--candle)]/30"
                : "text-[var(--text-2)]"
            }`}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Grid of Day Cells + Week Summary Column */}
      <div className="space-y-1.5 sm:space-y-2">
        {grid.map((week, wIdx) => {
          const weekAgg = weekAggregates[wIdx] || {
            weekNumber: wIdx + 1,
            pnl: 0,
            r: 0,
            count: 0,
            wins: 0,
            losses: 0,
          };

          return (
            <div
              key={`week-${wIdx}`}
              className="grid gap-1.5 sm:gap-2"
              style={{
                gridTemplateColumns: `repeat(${week.length}, minmax(0, 1fr)) 72px`,
              }}
            >
              {week.map((cell) => {
                const dayData = dayMap.get(cell.dateString);
                const isToday = cell.dateString === todayDate;
                const isSelected = cell.dateString === selectedDate;

                return (
                  <DayCell
                    key={cell.dateString}
                    dateString={cell.dateString}
                    dayNumber={cell.dayNumber}
                    inMonth={cell.inMonth}
                    isToday={isToday}
                    isSelected={isSelected}
                    data={dayData}
                    maxDayAbsPnl={maxDayAbsPnl}
                    currency={currency}
                    viewMode={viewMode}
                    privacyBlur={privacyBlur}
                    onClick={() => onSelectDate(cell.dateString)}
                    onAddTrade={() => onAddTradeOnDate(cell.dateString)}
                  />
                );
              })}

              {/* Week Summary Cell */}
              <WeekCell
                aggregate={weekAgg}
                currency={currency}
                viewMode={viewMode}
                privacyBlur={privacyBlur}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
