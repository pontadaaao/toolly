"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ResultCard } from "@/components/shared/result-card";
import { calcBmi } from "@/utils/bmi";

export function BmiCalculator() {
  const [height, setHeight] = useState("165");
  const [weight, setWeight] = useState("60");

  const result = useMemo(() => {
    const h = Number(height);
    const w = Number(weight);
    if (!h || !w || h <= 0 || w <= 0) return null;
    return calcBmi(h, w);
  }, [height, weight]);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="height">身長（cm）</Label>
          <Input
            id="height"
            type="number"
            inputMode="decimal"
            min={0}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="165"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">体重（kg）</Label>
          <Input
            id="weight"
            type="number"
            inputMode="decimal"
            min={0}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="60"
          />
        </div>
      </div>

      {result && (
        <ResultCard
          items={[
            { label: "BMI", value: result.bmi.toFixed(1), highlight: true },
            { label: "判定", value: result.judgment },
            { label: "標準体重", value: `${result.standardWeight.toFixed(1)} kg` },
          ]}
        />
      )}
    </div>
  );
}
