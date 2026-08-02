"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultCard } from "@/components/shared/result-card";
import { calcFromTaxExcluded, calcFromTaxIncluded, type RoundingMode } from "@/utils/tax";
import { cn } from "@/lib/utils";

type Mode = "excluded-to-included" | "included-to-excluded";

const rates = [
  { value: 0.08, label: "8%" },
  { value: 0.1, label: "10%" },
];

const roundingModes: { value: RoundingMode; label: string }[] = [
  { value: "round", label: "四捨五入" },
  { value: "ceil", label: "切り上げ" },
  { value: "floor", label: "切り捨て" },
];

export function ConsumptionTaxCalculator() {
  const [mode, setMode] = useState<Mode>("excluded-to-included");
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState(0.1);
  const [rounding, setRounding] = useState<RoundingMode>("round");

  const result = useMemo(() => {
    const value = Number(amount);
    if (!amount || Number.isNaN(value) || value < 0) return null;
    return mode === "excluded-to-included"
      ? calcFromTaxExcluded(value, rate, rounding)
      : calcFromTaxIncluded(value, rate, rounding);
  }, [amount, mode, rate, rounding]);

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="excluded-to-included">税抜→税込</TabsTrigger>
          <TabsTrigger value="included-to-excluded">税込→税抜</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        <Label htmlFor="amount">金額（円）</Label>
        <Input
          id="amount"
          type="number"
          inputMode="decimal"
          min={0}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1000"
        />
      </div>

      <div className="space-y-2">
        <Label>税率</Label>
        <div className="flex gap-2">
          {rates.map((r) => (
            <Button
              key={r.value}
              type="button"
              variant={rate === r.value ? "default" : "outline"}
              className={cn("rounded-full")}
              onClick={() => setRate(r.value)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>端数処理</Label>
        <div className="flex flex-wrap gap-2">
          {roundingModes.map((r) => (
            <Button
              key={r.value}
              type="button"
              variant={rounding === r.value ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setRounding(r.value)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      {result && (
        <ResultCard
          items={[
            {
              label: mode === "excluded-to-included" ? "税込金額" : "税抜金額",
              value: `¥${(mode === "excluded-to-included" ? result.taxIncluded : result.taxExcluded).toLocaleString()}`,
              highlight: true,
            },
            { label: "消費税額", value: `¥${result.taxAmount.toLocaleString()}` },
            {
              label: mode === "excluded-to-included" ? "税抜金額" : "税込金額",
              value: `¥${(mode === "excluded-to-included" ? result.taxExcluded : result.taxIncluded).toLocaleString()}`,
            },
          ]}
        />
      )}
    </div>
  );
}
