"use client";

import { useMemo, useRef, useState } from "react";
import { ResultCard } from "@/components/shared/result-card";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { BirthDateInput, type BirthDateValue } from "@/components/shared/birth-date-input";
import { ZodiacIcon } from "@/components/shared/zodiac-icons";
import { isValidBirthDate } from "@/utils/age";
import { calcEto, calcEtoCompatibility, etoExplanation } from "@/utils/eto";

export function EtoChecker() {
  const [birth, setBirth] = useState<BirthDateValue>({ year: 1990, month: 1, day: 1 });
  const resultRef = useRef<HTMLDivElement>(null);

  const birthDate = useMemo(() => new Date(birth.year, birth.month - 1, birth.day), [birth]);
  const error = isValidBirthDate(birthDate)
    ? undefined
    : "生年月日を正しく入力してください(未来の日付は指定できません)。";

  const result = useMemo(() => {
    if (!isValidBirthDate(birthDate)) return null;
    const eto = calcEto(birthDate.getFullYear());
    return { eto, compatible: calcEtoCompatibility(eto.sign) };
  }, [birthDate]);

  const shareText = result
    ? `【干支チェッカー】\n${birthDate.getFullYear()}年生まれの干支: ${result.eto.sign}（${result.eto.animal}）`
    : "";

  return (
    <div className="space-y-6">
      <BirthDateInput value={birth} onChange={setBirth} error={error} />

      {result && (
        <div ref={resultRef} className="space-y-6">
          <ResultCard>
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <span className="flex size-24 shrink-0 items-center justify-center rounded-full bg-primary/10 p-4 text-primary">
                <ZodiacIcon sign={result.eto.sign} />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">{birthDate.getFullYear()}年生まれの干支</p>
                <p className="text-3xl font-bold">
                  {result.eto.sign}（{result.eto.animal}）
                </p>
                <p className="text-sm text-muted-foreground">{result.eto.englishName}</p>
              </div>
            </div>
          </ResultCard>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground">相性が良い干支（参考情報）</h3>
            <div className="mt-3 flex flex-wrap gap-4">
              {result.compatible.map((c) => (
                <div key={c.sign} className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-secondary/15 p-2 text-secondary">
                    <ZodiacIcon sign={c.sign} />
                  </span>
                  <span className="text-sm font-medium">
                    {c.sign}（{c.animal}）
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              三合（相性が良いとされる4年おきの組み合わせ）をもとにした参考情報です。
            </p>
          </div>

          <p className="text-sm text-muted-foreground">{etoExplanation}</p>

          <ResultShareActions shareText={shareText} title="干支チェッカー" resultRef={resultRef} />
        </div>
      )}
    </div>
  );
}
