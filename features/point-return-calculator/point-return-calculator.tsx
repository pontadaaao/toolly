"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UnitInput } from "@/components/shared/unit-input";
import { ResultCard } from "@/components/shared/result-card";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { ResetButton } from "@/components/shared/reset-button";
import { calcPointReturn, pointRateVsMultiplierExplanation, type PointBasisMode } from "@/utils/point-return";
import type { RoundingMode } from "@/utils/tax";

interface PatternForm {
  purchaseAmount: string;
  pointRate: string;
  pointMultiplier: string;
  pointValue: string;
  pointsUsed: string;
  couponAmount: string;
  basisMode: PointBasisMode;
  includeUsedPointsInBasis: boolean;
  rounding: RoundingMode;
}

const initialPattern: PatternForm = {
  purchaseAmount: "10000",
  pointRate: "1",
  pointMultiplier: "1",
  pointValue: "1",
  pointsUsed: "0",
  couponAmount: "0",
  basisMode: "afterCoupon",
  includeUsedPointsInBasis: true,
  rounding: "floor",
};

const roundingModes: { value: RoundingMode; label: string }[] = [
  { value: "floor", label: "切り捨て" },
  { value: "round", label: "四捨五入" },
  { value: "ceil", label: "切り上げ" },
];

function PatternFields({
  label,
  form,
  onChange,
}: {
  label: string;
  form: PatternForm;
  onChange: (next: PatternForm) => void;
}) {
  function update<K extends keyof PatternForm>(key: K, value: PatternForm[K]) {
    onChange({ ...form, [key]: value });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border p-4">
      <p className="text-sm font-semibold">{label}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <UnitInput id={`${label}-amount`} label="購入金額" unit="円" value={form.purchaseAmount} onChange={(v) => update("purchaseAmount", v)} min={0} />
        <UnitInput id={`${label}-coupon`} label="クーポン金額" unit="円" value={form.couponAmount} onChange={(v) => update("couponAmount", v)} min={0} />
        <UnitInput id={`${label}-rate`} label="ポイント還元率" unit="%" value={form.pointRate} onChange={(v) => update("pointRate", v)} min={0} step="0.1" />
        <UnitInput id={`${label}-multiplier`} label="ポイント倍率" unit="倍" value={form.pointMultiplier} onChange={(v) => update("pointMultiplier", v)} min={0} step="0.5" />
        <UnitInput id={`${label}-value`} label="1ポイントの価値" unit="円" value={form.pointValue} onChange={(v) => update("pointValue", v)} min={0} step="0.1" />
        <UnitInput id={`${label}-used`} label="利用するポイント数" unit="pt" value={form.pointsUsed} onChange={(v) => update("pointsUsed", v)} min={0} />
      </div>

      <div className="space-y-2">
        <Label>ポイント付与対象金額の計算方法</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={form.basisMode === "beforeCoupon" ? "default" : "outline"}
            className="rounded-full"
            onClick={() => update("basisMode", "beforeCoupon")}
          >
            クーポン適用前の金額
          </Button>
          <Button
            type="button"
            size="sm"
            variant={form.basisMode === "afterCoupon" ? "default" : "outline"}
            className="rounded-full"
            onClick={() => update("basisMode", "afterCoupon")}
          >
            クーポン適用後の金額
          </Button>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.includeUsedPointsInBasis}
          onChange={(e) => update("includeUsedPointsInBasis", e.target.checked)}
          className="size-4 rounded border-input"
        />
        利用したポイント分も付与対象に含める
      </label>

      <div className="space-y-2">
        <Label>ポイント数の端数処理</Label>
        <div className="flex flex-wrap gap-2">
          {roundingModes.map((r) => (
            <Button
              key={r.value}
              type="button"
              size="sm"
              variant={form.rounding === r.value ? "default" : "outline"}
              className="rounded-full"
              onClick={() => update("rounding", r.value)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PointReturnCalculator() {
  const [patternA, setPatternA] = useState<PatternForm>(initialPattern);
  const [patternB, setPatternB] = useState<PatternForm>(initialPattern);
  const [compareEnabled, setCompareEnabled] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const resultA = useMemo(
    () =>
      calcPointReturn({
        purchaseAmount: Number(patternA.purchaseAmount) || 0,
        pointRate: Number(patternA.pointRate) || 0,
        pointMultiplier: Number(patternA.pointMultiplier) || 0,
        pointValue: Number(patternA.pointValue) || 0,
        pointsUsed: Number(patternA.pointsUsed) || 0,
        couponAmount: Number(patternA.couponAmount) || 0,
        basisMode: patternA.basisMode,
        includeUsedPointsInBasis: patternA.includeUsedPointsInBasis,
        rounding: patternA.rounding,
      }),
    [patternA]
  );

  const resultB = useMemo(
    () =>
      calcPointReturn({
        purchaseAmount: Number(patternB.purchaseAmount) || 0,
        pointRate: Number(patternB.pointRate) || 0,
        pointMultiplier: Number(patternB.pointMultiplier) || 0,
        pointValue: Number(patternB.pointValue) || 0,
        pointsUsed: Number(patternB.pointsUsed) || 0,
        couponAmount: Number(patternB.couponAmount) || 0,
        basisMode: patternB.basisMode,
        includeUsedPointsInBasis: patternB.includeUsedPointsInBasis,
        rounding: patternB.rounding,
      }),
    [patternB]
  );

  function handleReset() {
    setPatternA(initialPattern);
    setPatternB(initialPattern);
    setCompareEnabled(false);
  }

  function resultItems(result: ReturnType<typeof calcPointReturn>) {
    return [
      { label: "獲得予定ポイント", value: `${result.earnedPoints.toLocaleString()}pt`, highlight: true },
      { label: "ポイントの金額換算", value: `¥${result.earnedPointsValue.toLocaleString()}` },
      { label: "クーポン適用後金額", value: `¥${result.couponAppliedAmount.toLocaleString()}` },
      { label: "ポイント利用後の支払額", value: `¥${result.actualPayment.toLocaleString()}` },
      { label: "実質負担額", value: `¥${result.effectiveBurden.toLocaleString()}` },
      { label: "実質還元率", value: `${result.effectiveReturnRate.toFixed(2)}%` },
    ];
  }

  const shareText = `【ポイント還元計算】\n獲得予定ポイント: ${resultA.earnedPoints.toLocaleString()}pt\n実質負担額: ¥${resultA.effectiveBurden.toLocaleString()}\n実質還元率: ${resultA.effectiveReturnRate.toFixed(2)}%`;

  return (
    <div ref={resultRef} className="space-y-6">
      <div className={compareEnabled ? "grid gap-4 lg:grid-cols-2" : undefined}>
        <PatternFields label={compareEnabled ? "パターンA" : "入力"} form={patternA} onChange={setPatternA} />
        {compareEnabled && <PatternFields label="パターンB" form={patternB} onChange={setPatternB} />}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={() => setCompareEnabled((v) => !v)}>
        {compareEnabled ? "比較をやめる" : "他のパターンと比較する"}
      </Button>

      <div className={compareEnabled ? "grid gap-4 lg:grid-cols-2" : undefined}>
        <ResultCard title={compareEnabled ? "パターンAの結果" : undefined} items={resultItems(resultA)} />
        {compareEnabled && <ResultCard title="パターンBの結果" items={resultItems(resultB)} />}
      </div>

      <p className="rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">{pointRateVsMultiplierExplanation}</p>
      <p className="text-xs text-muted-foreground">
        店舗・サービスによって実際のポイント付与条件、端数処理、ポイントの価値は異なります。計算結果は目安であり、実際の付与ポイントを保証するものではありません。
      </p>

      <ResultShareActions shareText={shareText} title="ポイント還元計算" resultRef={resultRef} />
      <ResetButton onReset={handleReset} />
    </div>
  );
}
