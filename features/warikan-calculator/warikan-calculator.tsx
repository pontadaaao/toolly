"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UnitInput } from "@/components/shared/unit-input";
import { ResultCard } from "@/components/shared/result-card";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { ResetButton } from "@/components/shared/reset-button";
import { ErrorMessage } from "@/components/shared/error-message";
import { calcWarikan } from "@/utils/warikan";
import type { RoundingMode } from "@/utils/tax";

const roundingModes: { value: RoundingMode; label: string }[] = [
  { value: "floor", label: "切り捨て" },
  { value: "round", label: "四捨五入" },
  { value: "ceil", label: "切り上げ" },
];

const initialState = {
  totalAmount: "10000",
  peopleCount: "4",
  rounding: "floor" as RoundingMode,
  organizerFree: false,
};

export function WarikanCalculator() {
  const [form, setForm] = useState(initialState);
  const resultRef = useRef<HTMLDivElement>(null);

  function update<K extends keyof typeof initialState>(key: K, value: (typeof initialState)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const totalAmount = Number(form.totalAmount);
  const peopleCount = Number(form.peopleCount);
  const error =
    !form.totalAmount || totalAmount <= 0
      ? "合計金額は0より大きい値を入力してください。"
      : !form.peopleCount || peopleCount < 1 || !Number.isInteger(peopleCount)
        ? "人数は1以上の整数を入力してください。"
        : undefined;

  const result = useMemo(() => {
    if (error) return null;
    return calcWarikan(totalAmount, peopleCount, form.rounding, form.organizerFree);
  }, [error, totalAmount, peopleCount, form.rounding, form.organizerFree]);

  function handleReset() {
    setForm(initialState);
  }

  const shareText = result
    ? `【割り勘計算】\n合計金額: ¥${totalAmount.toLocaleString()}（${peopleCount}人）\n1人あたり: ¥${result.perPerson.toLocaleString()}${form.organizerFree ? "（幹事無料）" : ""}`
    : "";

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <UnitInput
          id="warikan-total"
          label="合計金額"
          unit="円"
          value={form.totalAmount}
          onChange={(v) => update("totalAmount", v)}
          min={0}
          placeholder="10000"
        />
        <UnitInput
          id="warikan-people"
          label="人数"
          unit="人"
          value={form.peopleCount}
          onChange={(v) => update("peopleCount", v)}
          min={1}
          step={1}
          placeholder="4"
        />
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className="space-y-2">
        <Label>端数処理</Label>
        <div className="flex flex-wrap gap-2">
          {roundingModes.map((r) => (
            <Button
              key={r.value}
              type="button"
              variant={form.rounding === r.value ? "default" : "outline"}
              className="rounded-full"
              onClick={() => update("rounding", r.value)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.organizerFree}
          onChange={(e) => update("organizerFree", e.target.checked)}
          className="size-4 rounded border-input"
        />
        幹事（1人）は無料にする
      </label>

      {result && (
        <div ref={resultRef} className="space-y-4">
          <ResultCard
            items={[
              { label: "1人あたりの金額", value: `¥${result.perPerson.toLocaleString()}`, highlight: true },
              { label: "支払い人数", value: `${result.payingCount}人` },
              { label: "合計徴収額", value: `¥${result.totalCollected.toLocaleString()}` },
              {
                label: result.difference >= 0 ? "端数（不足分）" : "端数（お釣り）",
                value: `¥${Math.abs(result.difference).toLocaleString()}`,
              },
            ]}
          />
          {result.difference !== 0 && (
            <p className="text-xs text-muted-foreground">
              {result.difference > 0
                ? `端数処理により ¥${result.difference.toLocaleString()} 不足します。幹事が追加で負担するか、誰か1人に多く払ってもらいましょう。`
                : `端数処理により ¥${Math.abs(result.difference).toLocaleString()} 多く集まります。お釣りとして幹事に渡しましょう。`}
            </p>
          )}
          <ResultShareActions shareText={shareText} title="割り勘計算" resultRef={resultRef} />
        </div>
      )}

      <ResetButton onReset={handleReset} />
    </div>
  );
}
