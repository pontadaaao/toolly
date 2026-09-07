"use client";

import { useMemo, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { BirthDateInput, type BirthDateValue } from "@/components/shared/birth-date-input";
import { isValidBirthDate } from "@/utils/age";
import {
  calcEnrollmentTimeline,
  calcNurseryClasses,
  preschoolOptions,
  type PreschoolKey,
} from "@/utils/school-lookup";
import { formatDateJa, formatDateWareki } from "@/utils/date";

const preschoolItems = Object.fromEntries(
  (Object.keys(preschoolOptions) as PreschoolKey[]).map((k) => [k, preschoolOptions[k].label])
);

export function SchoolYearLookup() {
  const [birth, setBirth] = useState<BirthDateValue>({ year: 2015, month: 4, day: 2 });
  const [preschool, setPreschool] = useState<PreschoolKey>("kindergarten3");
  const resultRef = useRef<HTMLDivElement>(null);

  const birthDate = useMemo(() => new Date(birth.year, birth.month - 1, birth.day), [birth]);
  const error = isValidBirthDate(birthDate)
    ? undefined
    : "生年月日を正しく入力してください(未来の日付は指定できません)。";

  const stages = useMemo(
    () => (isValidBirthDate(birthDate) ? calcEnrollmentTimeline(birthDate, preschool) : null),
    [birthDate, preschool]
  );

  const nurseryClasses = useMemo(
    () => (isValidBirthDate(birthDate) && preschool === "nursery" ? calcNurseryClasses(birthDate) : null),
    [birthDate, preschool]
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

      <div className="space-y-2">
        <Label>就学前に通う施設</Label>
        <Select
          items={preschoolItems}
          value={preschool}
          onValueChange={(v) => v && setPreschool(v as PreschoolKey)}
        >
          <SelectTrigger className="w-full sm:w-72">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(preschoolOptions) as PreschoolKey[]).map((key) => (
              <SelectItem key={key} value={key}>
                {preschoolOptions[key].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          保育園・認定こども園を選ぶと、0歳児クラスから5歳児クラスまでが何年度にあたるかも表示されます。
        </p>
      </div>

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
          {nurseryClasses && (
            <section aria-labelledby="nursery-class-heading" className="space-y-3">
              <h3 id="nursery-class-heading" className="text-sm font-semibold">
                保育園・こども園のクラス年度
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {nurseryClasses.map((item) => (
                  <div key={item.age} className="rounded-xl border border-border bg-muted/30 p-3">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.fiscalYear}年度（{item.fiscalYear}年4月〜{item.fiscalYear + 1}年3月）
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                クラスは年度の初日（4月1日）時点の満年齢で決まります。年度途中の入園の扱いは自治体によって異なります。
              </p>
            </section>
          )}

          <ResultShareActions shareText={shareText} title="入学・卒業早見" resultRef={resultRef} />
        </div>
      )}
    </div>
  );
}
