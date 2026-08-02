"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResultCard } from "@/components/shared/result-card";
import { prefectures } from "@/data/prefectures";
import { calcTakeHomePay, employmentTypeLabels, type EmploymentType } from "@/utils/finance";

type IncomeUnit = "monthly" | "annual";

const prefectureItems = Object.fromEntries(prefectures.map((p) => [p.name, p.name]));

export function TakeHomePayCalculator() {
  const [unit, setUnit] = useState<IncomeUnit>("monthly");
  const [income, setIncome] = useState("300000");
  const [bonus, setBonus] = useState("0");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("full-time");
  const [prefectureName, setPrefectureName] = useState("東京都");

  const result = useMemo(() => {
    const incomeValue = Number(income);
    const bonusValue = Number(bonus) || 0;
    if (!incomeValue || incomeValue <= 0) return null;

    const annualGross = unit === "monthly" ? incomeValue * 12 + bonusValue : incomeValue + bonusValue;
    const prefecture = prefectures.find((p) => p.name === prefectureName) ?? prefectures[0];

    return calcTakeHomePay({
      annualGross,
      employmentType,
      healthInsuranceRate: prefecture.healthInsuranceRate,
    });
  }, [income, bonus, unit, employmentType, prefectureName]);

  return (
    <div className="space-y-6">
      <Tabs value={unit} onValueChange={(v) => setUnit(v as IncomeUnit)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="monthly">月収から計算</TabsTrigger>
          <TabsTrigger value="annual">年収から計算</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="income">{unit === "monthly" ? "月収（円）" : "年収（円）"}</Label>
          <Input
            id="income"
            type="number"
            inputMode="numeric"
            min={0}
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bonus">賞与（年間・円）</Label>
          <Input
            id="bonus"
            type="number"
            inputMode="numeric"
            min={0}
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="employment-type">雇用形態</Label>
          <Select
            items={employmentTypeLabels}
            value={employmentType}
            onValueChange={(v) => setEmploymentType(v as EmploymentType)}
          >
            <SelectTrigger id="employment-type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(employmentTypeLabels) as EmploymentType[]).map((type) => (
                <SelectItem key={type} value={type}>
                  {employmentTypeLabels[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="prefecture">都道府県</Label>
          <Select
            items={prefectureItems}
            value={prefectureName}
            onValueChange={(v) => v && setPrefectureName(v)}
          >
            <SelectTrigger id="prefecture" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {prefectures.map((p) => (
                <SelectItem key={p.name} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {result && (
        <ResultCard
          title="概算結果（年間）"
          items={[
            { label: "概算手取り額", value: `¥${result.takeHome.toLocaleString()}`, highlight: true },
            { label: "額面（年収）", value: `¥${result.annualGross.toLocaleString()}` },
            { label: "所得税", value: `¥${result.incomeTax.toLocaleString()}` },
            { label: "住民税", value: `¥${result.residentTax.toLocaleString()}` },
            { label: "社会保険料", value: `¥${result.socialInsurance.toLocaleString()}` },
            { label: "手取り月額目安", value: `¥${Math.round(result.takeHome / 12).toLocaleString()}` },
          ]}
        />
      )}
    </div>
  );
}
