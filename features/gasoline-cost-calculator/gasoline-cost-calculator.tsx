"use client";

import { useMemo, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UnitInput } from "@/components/shared/unit-input";
import { ResultCard } from "@/components/shared/result-card";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { ResetButton } from "@/components/shared/reset-button";
import { ErrorMessage } from "@/components/shared/error-message";
import { calcGasolineCost, type TripType } from "@/utils/gasoline";
import type { RoundingMode } from "@/utils/tax";

const roundingModes: { value: RoundingMode; label: string }[] = [
  { value: "floor", label: "切り捨て" },
  { value: "round", label: "四捨五入" },
  { value: "ceil", label: "切り上げ" },
];

const initialState = {
  distance: "100",
  fuelEconomy: "15",
  pricePerLiter: "170",
  tripType: "round" as TripType,
  passengers: "1",
  highwayFee: "0",
  parkingFee: "0",
  otherFee: "0",
  rounding: "round" as RoundingMode,
  decimalPlaces: "2",
};

export function GasolineCostCalculator() {
  const [form, setForm] = useState(initialState);
  const resultRef = useRef<HTMLDivElement>(null);

  function update<K extends keyof typeof initialState>(key: K, value: (typeof initialState)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const distance = Number(form.distance);
  const fuelEconomy = Number(form.fuelEconomy);
  const error =
    !form.distance || distance <= 0
      ? "走行距離は0より大きい値を入力してください。"
      : !form.fuelEconomy || fuelEconomy <= 0
        ? "燃費は0より大きい値を入力してください。"
        : undefined;

  const result = useMemo(() => {
    if (error) return null;
    return calcGasolineCost({
      distance,
      fuelEconomy,
      pricePerLiter: Number(form.pricePerLiter) || 0,
      tripType: form.tripType,
      passengers: Number(form.passengers) || 1,
      highwayFee: Number(form.highwayFee) || 0,
      parkingFee: Number(form.parkingFee) || 0,
      otherFee: Number(form.otherFee) || 0,
      rounding: form.rounding,
    });
  }, [error, distance, fuelEconomy, form]);

  function handleReset() {
    setForm(initialState);
  }

  const decimals = Number(form.decimalPlaces);
  const shareText = result
    ? `【ガソリン代計算】\n走行距離: ${result.totalDistance}km（${form.tripType === "round" ? "往復" : "片道"}）\nガソリン代: ¥${result.gasolineCost.toLocaleString()}\n合計交通費: ¥${result.totalCost.toLocaleString()}\n1人あたり: ¥${result.perPerson.toLocaleString()}`
    : "";

  return (
    <div className="space-y-6">
      <Tabs value={form.tripType} onValueChange={(v) => v && update("tripType", v as TripType)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="oneway">片道</TabsTrigger>
          <TabsTrigger value="round">往復</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-5 sm:grid-cols-3">
        <UnitInput id="gas-distance" label="走行距離（片道）" unit="km" value={form.distance} onChange={(v) => update("distance", v)} min={0} placeholder="100" />
        <UnitInput id="gas-economy" label="燃費" unit="km/L" value={form.fuelEconomy} onChange={(v) => update("fuelEconomy", v)} min={0} placeholder="15" />
        <UnitInput id="gas-price" label="ガソリン単価" unit="円/L" value={form.pricePerLiter} onChange={(v) => update("pricePerLiter", v)} min={0} placeholder="170" />
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className="grid gap-5 sm:grid-cols-4">
        <UnitInput id="gas-passengers" label="乗車人数" unit="人" value={form.passengers} onChange={(v) => update("passengers", v)} min={1} placeholder="1" />
        <UnitInput id="gas-highway" label="高速道路料金" unit="円" value={form.highwayFee} onChange={(v) => update("highwayFee", v)} min={0} placeholder="0" />
        <UnitInput id="gas-parking" label="駐車料金" unit="円" value={form.parkingFee} onChange={(v) => update("parkingFee", v)} min={0} placeholder="0" />
        <UnitInput id="gas-other" label="その他の費用" unit="円" value={form.otherFee} onChange={(v) => update("otherFee", v)} min={0} placeholder="0" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>円未満の丸め方法</Label>
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
        <div className="space-y-2">
          <Label htmlFor="gas-decimals">使用量の表示桁数</Label>
          <Select
            items={{ "0": "0桁", "1": "1桁", "2": "2桁" }}
            value={form.decimalPlaces}
            onValueChange={(v) => v && update("decimalPlaces", v)}
          >
            <SelectTrigger id="gas-decimals" className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0桁</SelectItem>
              <SelectItem value="1">1桁</SelectItem>
              <SelectItem value="2">2桁</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {result && (
        <div ref={resultRef} className="space-y-4">
          <ResultCard
            items={[
              { label: "合計交通費", value: `¥${result.totalCost.toLocaleString()}`, highlight: true },
              { label: "1人あたり", value: `¥${result.perPerson.toLocaleString()}` },
              { label: "総走行距離", value: `${result.totalDistance}km` },
              { label: "使用ガソリン量", value: `${result.fuelUsed.toFixed(decimals)}L` },
              { label: "ガソリン代", value: `¥${result.gasolineCost.toLocaleString()}` },
              { label: "高速道路料金", value: `¥${result.highwayFee.toLocaleString()}` },
              { label: "駐車料金", value: `¥${result.parkingFee.toLocaleString()}` },
              { label: "その他費用", value: `¥${result.otherFee.toLocaleString()}` },
            ]}
          />
          <ResultShareActions shareText={shareText} title="ガソリン代計算" resultRef={resultRef} />
        </div>
      )}

      <ResetButton onReset={handleReset} />
    </div>
  );
}
