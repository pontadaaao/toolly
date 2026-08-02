"use client";

import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface BirthDateValue {
  year: number;
  month: number;
  day: number;
}

interface BirthDateInputProps {
  value: BirthDateValue;
  onChange: (value: BirthDateValue) => void;
  label?: string;
  error?: string;
}

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 110 }, (_, i) => currentYear - i);
const yearItems = Object.fromEntries(yearOptions.map((y) => [String(y), `${y}年`]));
const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
const monthItems = Object.fromEntries(monthOptions.map((m) => [String(m), `${m}月`]));

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** 生年月日入力（年/月/日プルダウン）。graduation-dateツールと同じUIパターンを共通化したもの。 */
export function BirthDateInput({ value, onChange, label = "生年月日", error }: BirthDateInputProps) {
  const { year, month, day } = value;
  const dayOptions = useMemo(() => Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1), [year, month]);
  const dayItems = useMemo(() => Object.fromEntries(dayOptions.map((d) => [String(d), `${d}日`])), [dayOptions]);
  const clampedDay = Math.min(day, dayOptions.length);

  return (
    <div className="space-y-2">
      <Label id="birth-date-label">{label}</Label>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-labelledby="birth-date-label">
        <Select
          items={yearItems}
          value={String(year)}
          onValueChange={(v) => v && onChange({ year: Number(v), month, day: clampedDay })}
        >
          <SelectTrigger className="w-28" aria-label="生まれ年" aria-invalid={Boolean(error)}>
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

        <Select
          items={monthItems}
          value={String(month)}
          onValueChange={(v) => v && onChange({ year, month: Number(v), day: clampedDay })}
        >
          <SelectTrigger className="w-24" aria-label="生まれ月" aria-invalid={Boolean(error)}>
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
          value={String(clampedDay)}
          onValueChange={(v) => v && onChange({ year, month, day: Number(v) })}
        >
          <SelectTrigger className="w-24" aria-label="生まれ日" aria-invalid={Boolean(error)}>
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
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
