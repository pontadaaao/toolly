"use client";

import { useMemo, useRef, useState } from "react";
import { ResultCard } from "@/components/shared/result-card";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { BirthDateInput, type BirthDateValue } from "@/components/shared/birth-date-input";
import { calcAge, calcKazoedoshi, isValidBirthDate } from "@/utils/age";

const kazoedoshiExplanation =
  "数え年は、生まれた年を1歳とし、それ以降は誕生日に関係なく元日（1月1日）を迎えるたびに1歳を加えていく、日本の伝統的な年齢の数え方です。誕生日を基準に1年ごと歳を重ねる「満年齢」とは異なり、生まれてすぐに1歳と数えるのが特徴です。厄年・七五三・長寿祝いなど、伝統行事の多くは今も数え年を基準にしています。";

export function KazoedoshiCalculator() {
  const [birth, setBirth] = useState<BirthDateValue>({ year: 1990, month: 1, day: 1 });
  const resultRef = useRef<HTMLDivElement>(null);

  const birthDate = useMemo(() => new Date(birth.year, birth.month - 1, birth.day), [birth]);
  const error = isValidBirthDate(birthDate)
    ? undefined
    : "生年月日を正しく入力してください(未来の日付は指定できません)。";

  const result = useMemo(() => {
    if (!isValidBirthDate(birthDate)) return null;
    return { age: calcAge(birthDate), kazoedoshi: calcKazoedoshi(birthDate) };
  }, [birthDate]);

  const shareText = result ? `【数え年計算】\n数え年: ${result.kazoedoshi}歳\n満年齢: ${result.age}歳` : "";

  return (
    <div className="space-y-6">
      <BirthDateInput value={birth} onChange={setBirth} error={error} />

      {result && (
        <div ref={resultRef} className="space-y-6">
          <ResultCard
            items={[
              { label: "数え年", value: `${result.kazoedoshi}歳`, highlight: true },
              { label: "満年齢", value: `${result.age}歳` },
            ]}
          />
          <p className="text-sm text-muted-foreground">{kazoedoshiExplanation}</p>
          <ResultShareActions shareText={shareText} title="数え年計算" resultRef={resultRef} />
        </div>
      )}
    </div>
  );
}
