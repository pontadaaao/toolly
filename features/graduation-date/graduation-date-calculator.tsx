"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calcSchoolTimeline, formatDateJa, formatDateWareki, schoolLabels } from "@/utils/date";

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);
const yearItems = Object.fromEntries(yearOptions.map((y) => [String(y), `${y}年`]));

const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
const monthItems = Object.fromEntries(monthOptions.map((m) => [String(m), `${m}月`]));

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function GraduationDateCalculator() {
  const [year, setYear] = useState(2010);
  const [month, setMonth] = useState(4);
  const [day, setDay] = useState(2);

  const dayOptions = useMemo(
    () => Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1),
    [year, month]
  );
  const dayItems = useMemo(
    () => Object.fromEntries(dayOptions.map((d) => [String(d), `${d}日`])),
    [dayOptions]
  );

  const timeline = useMemo(() => {
    const clampedDay = Math.min(day, dayOptions.length);
    return calcSchoolTimeline(new Date(year, month - 1, clampedDay));
  }, [year, month, day, dayOptions.length]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>生年月日</Label>
        <div className="flex flex-wrap items-center gap-2">
          <Select items={yearItems} value={String(year)} onValueChange={(v) => v && setYear(Number(v))}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}年
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select items={monthItems} value={String(month)} onValueChange={(v) => v && setMonth(Number(v))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {m}月
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            items={dayItems}
            value={String(Math.min(day, dayOptions.length))}
            onValueChange={(v) => v && setDay(Number(v))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dayOptions.map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {d}日
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {timeline && (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="p-3 text-left font-medium text-muted-foreground">学校種別</th>
                <th className="p-3 text-left font-medium text-muted-foreground">入学</th>
                <th className="p-3 text-left font-medium text-muted-foreground">卒業予定</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {timeline.map((period) => (
                <tr key={period.type}>
                  <td className="p-3 font-semibold">{schoolLabels[period.type]}</td>
                  <td className="p-3">
                    <div>{formatDateJa(period.entranceDate)}</div>
                    <div className="text-xs text-muted-foreground">{formatDateWareki(period.entranceDate)}</div>
                  </td>
                  <td className="p-3">
                    <div>{formatDateJa(period.graduationDate)}</div>
                    <div className="text-xs text-muted-foreground">{formatDateWareki(period.graduationDate)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
