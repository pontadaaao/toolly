"use client";

import { useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import { ResultCard } from "@/components/shared/result-card";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { BirthDateInput, type BirthDateValue } from "@/components/shared/birth-date-input";
import { isValidBirthDate } from "@/utils/age";
import { calcLongevityStatuses, findNextLongevityMilestone } from "@/utils/longevity";
import { cn } from "@/lib/utils";

export function LongevityCelebrationChecker() {
  const [birth, setBirth] = useState<BirthDateValue>({ year: 1960, month: 1, day: 1 });
  const resultRef = useRef<HTMLDivElement>(null);

  const birthDate = useMemo(() => new Date(birth.year, birth.month - 1, birth.day), [birth]);
  const error = isValidBirthDate(birthDate)
    ? undefined
    : "生年月日を正しく入力してください(未来の日付は指定できません)。";

  const statuses = useMemo(
    () => (isValidBirthDate(birthDate) ? calcLongevityStatuses(birthDate) : null),
    [birthDate]
  );
  const next = statuses ? findNextLongevityMilestone(statuses) : null;

  const shareText = statuses
    ? `【長寿祝いチェッカー】\n${
        next
          ? `次のお祝いは「${next.milestone.name}」（${next.milestone.age}歳・${next.targetYear}年）です`
          : "すべてのお祝いを迎えられています"
      }`
    : "";

  return (
    <div className="space-y-6">
      <BirthDateInput value={birth} onChange={setBirth} error={error} />

      {statuses && (
        <div ref={resultRef} className="space-y-6">
          <ResultCard
            title={next ? `次のお祝い：${next.milestone.name}（${next.milestone.age}歳）` : "すべての長寿祝いを迎えています"}
          >
            <ul className="divide-y divide-border">
              {statuses.map(({ milestone, reached, targetYear }) => (
                <li key={milestone.key} className="flex items-center gap-4 py-3">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      reached ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {reached ? (
                      <Check className="size-4" />
                    ) : (
                      <span className="text-xs font-semibold">{milestone.age}</span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      {milestone.name}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        満{milestone.age}歳・{targetYear}年
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{milestone.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </ResultCard>

          <ResultShareActions shareText={shareText} title="長寿祝いチェッカー" resultRef={resultRef} />
        </div>
      )}
    </div>
  );
}
