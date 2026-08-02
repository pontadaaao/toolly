"use client";

import { useMemo, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResultCard } from "@/components/shared/result-card";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { ResetButton } from "@/components/shared/reset-button";
import { BirthDateInput, type BirthDateValue } from "@/components/shared/birth-date-input";
import { isValidBirthDate } from "@/utils/age";
import {
  calcYakudoshiStatus,
  yakudoshiCaution,
  yakudoshiExplanation,
  yakudoshiRecommendedTiming,
  type Gender,
} from "@/utils/yakudoshi";
import { formatWarekiYears } from "@/utils/wareki";

const currentYear = new Date().getFullYear();
const judgmentYearOptions = Array.from({ length: 121 }, (_, i) => currentYear + 50 - i);
const judgmentYearItems = Object.fromEntries(judgmentYearOptions.map((y) => [String(y), `${y}年`]));

const initialBirth: BirthDateValue = { year: 1990, month: 1, day: 1 };

export function YakudoshiChecker() {
  const [birth, setBirth] = useState<BirthDateValue>(initialBirth);
  const [gender, setGender] = useState<Gender>("male");
  const [judgmentYear, setJudgmentYear] = useState(currentYear);
  const resultRef = useRef<HTMLDivElement>(null);

  const birthDate = useMemo(() => new Date(birth.year, birth.month - 1, birth.day), [birth]);
  const error = isValidBirthDate(birthDate)
    ? undefined
    : "生年月日を正しく入力してください（未来の日付は指定できません）。";

  const result = useMemo(() => {
    if (!isValidBirthDate(birthDate)) return null;
    const age = judgmentYear - birthDate.getFullYear();
    const kazoedoshi = age + 1;
    const status = calcYakudoshiStatus(birthDate, gender, new Date(judgmentYear, 0, 1));
    const pastPeriods = status.periods.filter((p) => p.atoyakuYear < judgmentYear);
    return { age, kazoedoshi, status, pastPeriods };
  }, [birthDate, gender, judgmentYear]);

  function handleReset() {
    setBirth(initialBirth);
    setGender("male");
    setJudgmentYear(currentYear);
  }

  const shareText = result
    ? `【厄年チェッカー】\n${judgmentYear}年時点の満年齢: ${result.age}歳（数え年 ${result.kazoedoshi}歳）\n${
        result.status.current ? `${judgmentYear}年は${result.status.current.phase}です` : `${judgmentYear}年は厄年ではありません`
      }`
    : "";

  return (
    <div className="space-y-6">
      <BirthDateInput value={birth} onChange={setBirth} error={error} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>性別</Label>
          <Tabs value={gender} onValueChange={(v) => v && setGender(v as Gender)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="male">男性</TabsTrigger>
              <TabsTrigger value="female">女性</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="space-y-2">
          <Label htmlFor="judgment-year">判定する年</Label>
          <Select
            items={judgmentYearItems}
            value={String(judgmentYear)}
            onValueChange={(v) => v && setJudgmentYear(Number(v))}
          >
            <SelectTrigger id="judgment-year" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {judgmentYearOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}年
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {result && (
        <div ref={resultRef} className="space-y-6">
          <ResultCard
            items={[
              {
                label: `${judgmentYear}年の厄年判定`,
                value: result.status.current
                  ? `${result.status.current.phase}${result.status.current.period.isDaiyaku ? "（大厄）" : ""}`
                  : "厄年ではありません",
                highlight: true,
              },
              { label: `${judgmentYear}年時点の満年齢`, value: `${result.age}歳` },
              { label: `${judgmentYear}年時点の数え年`, value: `${result.kazoedoshi}歳` },
              {
                label: "次の厄年",
                value: result.status.next ? `${result.status.next.maeyakuYear}年（前厄）〜` : "対象年齢を超えています",
              },
            ]}
          >
            <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[520px] text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="p-3 text-left font-medium text-muted-foreground">年齢</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">前厄</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">本厄</th>
                    <th className="p-3 text-left font-medium text-muted-foreground">後厄</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {result.status.periods.map((period) => (
                    <tr key={period.honyakuAge}>
                      <td className="p-3 font-semibold">
                        {period.honyakuAge}歳
                        {period.isDaiyaku && <Badge className="ml-2 bg-accent text-accent-foreground">大厄</Badge>}
                      </td>
                      <td className="p-3">
                        {period.maeyakuYear}年
                        <div className="text-xs text-muted-foreground">{formatWarekiYears(period.maeyakuYear)}</div>
                      </td>
                      <td className="p-3">
                        {period.honyakuYear}年
                        <div className="text-xs text-muted-foreground">{formatWarekiYears(period.honyakuYear)}</div>
                      </td>
                      <td className="p-3">
                        {period.atoyakuYear}年
                        <div className="text-xs text-muted-foreground">{formatWarekiYears(period.atoyakuYear)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ResultCard>

          {result.pastPeriods.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground">
                {judgmentYear}年より前に終えた厄年
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.pastPeriods.map((p) => (
                  <span key={p.honyakuAge} className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs">
                    {p.honyakuAge}歳の厄年（{p.maeyakuYear}〜{p.atoyakuYear}年）
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>{yakudoshiExplanation}</p>
            <p>
              <span className="font-semibold text-foreground">厄払いにおすすめの時期：</span>
              {yakudoshiRecommendedTiming}
            </p>
          </div>

          <p className="rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">{yakudoshiCaution}</p>

          <ResultShareActions shareText={shareText} title="厄年チェッカー" resultRef={resultRef} />
        </div>
      )}

      <ResetButton onReset={handleReset} />
    </div>
  );
}
