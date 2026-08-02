"use client";

import { useMemo, useRef, useState } from "react";
import { ResultCard } from "@/components/shared/result-card";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { BirthDateInput, type BirthDateValue } from "@/components/shared/birth-date-input";
import { isValidBirthDate } from "@/utils/age";
import { calcSeijin, seijinAgeExplanation, seijinCeremonyExplanation } from "@/utils/seijin";
import { formatDateJa, formatDateWareki } from "@/utils/date";

export function ComingOfAgeCalculator() {
  const [birth, setBirth] = useState<BirthDateValue>({ year: 2008, month: 4, day: 1 });
  const resultRef = useRef<HTMLDivElement>(null);

  const birthDate = useMemo(() => new Date(birth.year, birth.month - 1, birth.day), [birth]);
  const error = isValidBirthDate(birthDate)
    ? undefined
    : "生年月日を正しく入力してください(未来の日付は指定できません)。";

  const result = useMemo(() => (isValidBirthDate(birthDate) ? calcSeijin(birthDate) : null), [birthDate]);

  const shareText = result
    ? `【成人年計算】\n成人した年: ${result.legalAdultYear}年（${formatDateJa(result.legalAdultDate)}）\n成人式(二十歳のつどい)の目安: ${result.ceremonyYear}年1月`
    : "";

  return (
    <div className="space-y-6">
      <BirthDateInput value={birth} onChange={setBirth} error={error} />

      {result && (
        <div ref={resultRef} className="space-y-6">
          <ResultCard
            items={[
              { label: "成人した年（満18歳）", value: `${result.legalAdultYear}年`, highlight: true },
              {
                label: "成人した日",
                value: `${formatDateJa(result.legalAdultDate)}（${formatDateWareki(result.legalAdultDate)}）`,
              },
              { label: "成人式（二十歳のつどい）の目安年度", value: `${result.ceremonyYear}年1月頃` },
            ]}
          />
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>{seijinAgeExplanation}</p>
            <p>{seijinCeremonyExplanation}</p>
          </div>
          <ResultShareActions shareText={shareText} title="成人年計算" resultRef={resultRef} />
        </div>
      )}
    </div>
  );
}
