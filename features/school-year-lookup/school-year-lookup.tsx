"use client";

import { useMemo, useRef, useState } from "react";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { BirthDateInput, type BirthDateValue } from "@/components/shared/birth-date-input";
import { isValidBirthDate } from "@/utils/age";
import { calcEnrollmentTimeline } from "@/utils/school-lookup";
import { formatDateJa, formatDateWareki } from "@/utils/date";

export function SchoolYearLookup() {
  const [birth, setBirth] = useState<BirthDateValue>({ year: 2015, month: 4, day: 2 });
  const resultRef = useRef<HTMLDivElement>(null);

  const birthDate = useMemo(() => new Date(birth.year, birth.month - 1, birth.day), [birth]);
  const error = isValidBirthDate(birthDate)
    ? undefined
    : "生年月日を正しく入力してください(未来の日付は指定できません)。";

  const stages = useMemo(
    () => (isValidBirthDate(birthDate) ? calcEnrollmentTimeline(birthDate) : null),
    [birthDate]
  );

  const shareText = stages
    ? `【入学・卒業早見】\n${stages
        .filter((s) => s.entranceDate)
        .map((s) => `${s.label}入学: ${formatDateJa(s.entranceDate as Date)}`)
        .join("\n")}`
    : "";

  return (
    <div className="space-y-6">
      <BirthDateInput value={birth} onChange={setBirth} error={error} />

      {stages && (
        <div ref={resultRef} className="space-y-6">
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-3 text-left font-medium text-muted-foreground">区分</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">入園・入学</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">卒園・卒業予定</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stages.map((stage) => (
                  <tr key={stage.key}>
                    <td className="p-3 font-semibold">{stage.label}</td>
                    {stage.entranceDate && stage.graduationDate ? (
                      <>
                        <td className="p-3">
                          <div>{formatDateJa(stage.entranceDate)}</div>
                          <div className="text-xs text-muted-foreground">{formatDateWareki(stage.entranceDate)}</div>
                        </td>
                        <td className="p-3">
                          <div>{formatDateJa(stage.graduationDate)}</div>
                          <div className="text-xs text-muted-foreground">{formatDateWareki(stage.graduationDate)}</div>
                        </td>
                      </>
                    ) : (
                      <td className="p-3 text-muted-foreground" colSpan={2}>
                        {stage.note}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ResultShareActions shareText={shareText} title="入学・卒業早見" resultRef={resultRef} />
        </div>
      )}
    </div>
  );
}
