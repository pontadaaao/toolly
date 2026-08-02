"use client";

import { useMemo, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultCard } from "@/components/shared/result-card";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { BirthDateInput, type BirthDateValue } from "@/components/shared/birth-date-input";
import { isValidBirthDate } from "@/utils/age";
import {
  calcShichigosan,
  shichigosanExplanation,
  shichigosanCelebrationTiming,
  shichigosanShrineTiming,
  type Gender,
} from "@/utils/shichigosan";
import { cn } from "@/lib/utils";

export function ShichigosanChecker() {
  const [birth, setBirth] = useState<BirthDateValue>({ year: 2021, month: 4, day: 1 });
  const [gender, setGender] = useState<Gender>("male");
  const resultRef = useRef<HTMLDivElement>(null);

  const birthDate = useMemo(() => new Date(birth.year, birth.month - 1, birth.day), [birth]);
  const error = isValidBirthDate(birthDate)
    ? undefined
    : "生年月日を正しく入力してください(未来の日付は指定できません)。";

  const checks = useMemo(
    () => (isValidBirthDate(birthDate) ? calcShichigosan(birthDate, gender) : null),
    [birthDate, gender]
  );

  const targetThisYear = checks?.find((c) => c.applicable && c.isTargetThisYear);

  const shareText = checks
    ? `【七五三チェッカー】\n${
        targetThisYear ? `今年は${targetThisYear.age}歳の七五三の対象です` : "今年は七五三の対象年齢ではありません"
      }`
    : "";

  return (
    <div className="space-y-6">
      <BirthDateInput value={birth} onChange={setBirth} error={error} />

      <div className="space-y-2">
        <Tabs value={gender} onValueChange={(v) => v && setGender(v as Gender)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="male">男の子</TabsTrigger>
            <TabsTrigger value="female">女の子</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {checks && (
        <div ref={resultRef} className="space-y-6">
          <ResultCard title={targetThisYear ? "今年が七五三の対象です" : "今年の七五三対象状況"}>
            <div className="grid gap-3 sm:grid-cols-3">
              {checks.map((check) => (
                <div
                  key={check.age}
                  className={cn(
                    "rounded-xl border p-4 text-center",
                    check.applicable && check.isTargetThisYear
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-card",
                    !check.applicable && "opacity-50"
                  )}
                >
                  <p className="text-2xl font-bold">{check.age}歳</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {!check.applicable ? "対象外" : check.isTargetThisYear ? "今年が対象" : `${check.targetYear}年が対象`}
                  </p>
                </div>
              ))}
            </div>
          </ResultCard>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">七五三とは：</span>
              {shichigosanExplanation}
            </p>
            <p>
              <span className="font-semibold text-foreground">お祝い時期：</span>
              {shichigosanCelebrationTiming}
            </p>
            <p>
              <span className="font-semibold text-foreground">神社へ行く時期：</span>
              {shichigosanShrineTiming}
            </p>
          </div>

          <ResultShareActions shareText={shareText} title="七五三チェッカー" resultRef={resultRef} />
        </div>
      )}
    </div>
  );
}
