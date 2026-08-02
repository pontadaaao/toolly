"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ResultCard } from "@/components/shared/result-card";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { BirthDateInput, type BirthDateValue } from "@/components/shared/birth-date-input";
import { calcAge, calcElapsed, daysUntilNextBirthday, isValidBirthDate, weekdayJa } from "@/utils/age";

export function AgeCalculator() {
  const [birth, setBirth] = useState<BirthDateValue>({ year: 1990, month: 1, day: 1 });
  const [now, setNow] = useState(() => new Date());
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const birthDate = useMemo(() => new Date(birth.year, birth.month - 1, birth.day), [birth]);
  const error = isValidBirthDate(birthDate, now)
    ? undefined
    : "生年月日を正しく入力してください（未来の日付は指定できません）。";

  const result = useMemo(() => {
    if (!isValidBirthDate(birthDate, now)) return null;
    return {
      age: calcAge(birthDate, now),
      elapsed: calcElapsed(birthDate, now),
      daysUntilBirthday: daysUntilNextBirthday(birthDate, now),
      weekday: weekdayJa(birthDate),
    };
  }, [birthDate, now]);

  const shareText = result
    ? `【年齢計算】\n満年齢: ${result.age}歳\n生まれてからの日数: ${result.elapsed.totalDays.toLocaleString()}日\n次の誕生日まであと${result.daysUntilBirthday}日`
    : "";

  return (
    <div className="space-y-6">
      <BirthDateInput value={birth} onChange={setBirth} error={error} />

      {result && (
        <div ref={resultRef} className="space-y-6">
          <ResultCard
            items={[
              { label: "満年齢", value: `${result.age}歳`, highlight: true },
              { label: "生まれた曜日", value: result.weekday },
              { label: "次の誕生日まで", value: `あと${result.daysUntilBirthday}日` },
              { label: "生まれてからの日数", value: `${result.elapsed.totalDays.toLocaleString()}日` },
              { label: "生まれてからの時間", value: `${result.elapsed.totalHours.toLocaleString()}時間` },
              { label: "生まれてからの分", value: `${result.elapsed.totalMinutes.toLocaleString()}分` },
              {
                label: "生まれてからの秒",
                value: <span className="tabular-nums">{result.elapsed.totalSeconds.toLocaleString()}秒</span>,
              },
            ]}
          />
          <ResultShareActions shareText={shareText} title="年齢計算" resultRef={resultRef} />
        </div>
      )}
    </div>
  );
}
