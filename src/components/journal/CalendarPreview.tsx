"use client";

import React, { useState, useMemo } from "react";
import { MonthCalendar } from "./MonthCalendar";
import { generateSampleTrades } from "@/lib/journal/sample-data";

interface CalendarPreviewProps {
  currency?: string;
  defaultShowWeekends?: boolean;
}

export function CalendarPreview({
  currency = "USD",
  defaultShowWeekends = false,
}: CalendarPreviewProps) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(10);
  const [showWeekends, setShowWeekends] = useState(defaultShowWeekends);
  const [selectedDate, setSelectedDate] = useState("2026-10-15");

  const sampleTrades = useMemo(() => {
    return generateSampleTrades(new Date(year, month - 1, 15));
  }, [year, month]);

  return (
    <div className="pointer-events-auto">
      <MonthCalendar
        year={year}
        month={month}
        trades={sampleTrades}
        selectedDate={selectedDate}
        currency={currency}
        viewMode="pnl"
        weekStart={1}
        showWeekends={showWeekends}
        onSelectDate={setSelectedDate}
        onAddTradeOnDate={() => {}}
        onPrevMonth={() => setMonth((m) => (m === 1 ? 12 : m - 1))}
        onNextMonth={() => setMonth((m) => (m === 12 ? 1 : m + 1))}
        onGoToday={() => {
          setYear(2026);
          setMonth(10);
        }}
        onToggleWeekends={() => setShowWeekends((prev) => !prev)}
        onOpenShare={() => {}}
      />
    </div>
  );
}
