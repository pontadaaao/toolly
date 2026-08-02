"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarPickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

const weekdayLabels = ["日", "月", "火", "水", "木", "金", "土"];

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = new Date(year, month, 1).getDay();
  const cells: (Date | null)[] = Array.from({ length: startWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, month, day));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/**
 * 六曜チェッカー用の自前カレンダーUI。react-day-picker等は導入せず、既存の
 * Buttonコンポーネントの見た目に合わせた月表示グリッドとして実装している。
 */
export function CalendarPicker({ value, onChange, className }: CalendarPickerProps) {
  const [viewYear, setViewYear] = useState(value.getFullYear());
  const [viewMonth, setViewMonth] = useState(value.getMonth());
  const dayButtonRefs = useRef(new Map<string, HTMLButtonElement>());

  const today = new Date();
  const cells = buildMonthGrid(viewYear, viewMonth);

  function goToMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function handleGridKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const deltaByKey: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: 7,
      ArrowUp: -7,
    };
    const delta = deltaByKey[event.key];
    if (delta === undefined) return;
    event.preventDefault();
    const target = cells[index + delta];
    if (target) dayButtonRefs.current.get(target.toISOString())?.focus();
  }

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border bg-card p-4 shadow-soft", className)}>
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" size="icon-sm" onClick={() => goToMonth(-1)} aria-label="前の月">
          <ChevronLeft />
        </Button>
        <p className="text-sm font-semibold" aria-live="polite">
          {viewYear}年{viewMonth + 1}月
        </p>
        <Button type="button" variant="ghost" size="icon-sm" onClick={() => goToMonth(1)} aria-label="次の月">
          <ChevronRight />
        </Button>
      </div>

      <div role="grid" aria-label="日付を選択" className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
        {weekdayLabels.map((weekday) => (
          <div key={weekday} role="columnheader" className="py-1 font-medium text-muted-foreground">
            {weekday}
          </div>
        ))}
        {cells.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} aria-hidden="true" />;
          const selected = isSameDay(date, value);
          const isToday = isSameDay(date, today);
          const key = date.toISOString();
          return (
            <button
              key={key}
              ref={(el) => {
                if (el) dayButtonRefs.current.set(key, el);
                else dayButtonRefs.current.delete(key);
              }}
              type="button"
              role="gridcell"
              aria-selected={selected}
              aria-current={isToday ? "date" : undefined}
              onKeyDown={(e) => handleGridKeyDown(e, index)}
              onClick={() => onChange(date)}
              className={cn(
                "flex size-9 items-center justify-center rounded-full text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                selected && "bg-primary text-primary-foreground hover:bg-primary/90",
                !selected && isToday && "border border-primary/50 font-semibold text-primary"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
