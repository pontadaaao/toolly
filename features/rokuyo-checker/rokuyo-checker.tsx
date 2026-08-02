"use client";

import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Check, Minus, X } from "lucide-react";
import { ResultCard } from "@/components/shared/result-card";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { CalendarPicker } from "@/components/shared/calendar-picker";
import {
  calcRokuyo,
  rokuyoActivityLabels,
  rokuyoDetails,
  type RokuyoActivity,
  type Suitability,
} from "@/utils/rokuyo";
import { formatDateJa, formatDateWareki } from "@/utils/date";
import { cn } from "@/lib/utils";

const suitabilityIcon: Record<Suitability, ReactNode> = {
  good: <Check className="size-4" />,
  caution: <Minus className="size-4" />,
  bad: <X className="size-4" />,
};

const suitabilityLabel: Record<Suitability, string> = {
  good: "向いている",
  caution: "やや注意",
  bad: "避けた方が良い",
};

const suitabilityColor: Record<Suitability, string> = {
  good: "bg-primary/10 text-primary",
  caution: "bg-accent/15 text-accent-foreground dark:text-accent",
  bad: "bg-destructive/10 text-destructive",
};

function todayAtMidnight(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function RokuyoChecker() {
  const [date, setDate] = useState<Date>(() => todayAtMidnight());
  const resultRef = useRef<HTMLDivElement>(null);

  const rokuyo = useMemo(() => calcRokuyo(date), [date]);
  const detail = rokuyoDetails[rokuyo];

  const shareText = `【六曜確認】\n${formatDateJa(date)}は「${detail.name}」です\n${detail.meaning}`;

  return (
    <div className="space-y-6">
      <CalendarPicker value={date} onChange={setDate} />

      <div ref={resultRef} className="space-y-6">
        <ResultCard
          items={[
            { label: "選択した日", value: `${formatDateJa(date)}（${formatDateWareki(date)}）` },
            { label: "六曜", value: `${detail.name}（${detail.reading}）`, highlight: true },
          ]}
        >
          <p className="mt-4 text-sm text-muted-foreground">{detail.meaning}</p>
        </ResultCard>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">用途別の目安</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {(Object.keys(rokuyoActivityLabels) as RokuyoActivity[]).map((activity) => {
              const suitability = detail.suitability[activity];
              return (
                <div
                  key={activity}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-3"
                >
                  <span className="text-sm font-medium">{rokuyoActivityLabels[activity]}</span>
                  <span
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                      suitabilityColor[suitability]
                    )}
                  >
                    {suitabilityIcon[suitability]}
                    {suitabilityLabel[suitability]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <ResultShareActions shareText={shareText} title="六曜確認" resultRef={resultRef} />
      </div>
    </div>
  );
}
