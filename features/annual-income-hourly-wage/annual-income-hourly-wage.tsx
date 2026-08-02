"use client";

import { useMemo, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnitInput } from "@/components/shared/unit-input";
import { ResultCard } from "@/components/shared/result-card";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { ResetButton } from "@/components/shared/reset-button";
import { ErrorMessage } from "@/components/shared/error-message";
import { calcAnnualFromHourly, calcHourlyFromAnnual } from "@/utils/wage-conversion";

type Mode = "annualToHourly" | "hourlyToAnnual";

const annualInitial = {
  annualIncome: "4000000",
  annualBonus: "400000",
  dailyHours: "8",
  weeklyDays: "5",
  annualHolidays: "120",
  annualPaidLeave: "10",
  monthlyOvertimeHours: "10",
  includeOvertime: true,
};

const hourlyInitial = {
  hourlyWage: "1200",
  dailyHours: "6",
  weeklyDays: "4",
  annualWorkingDays: "200",
  monthlyOvertimeHours: "0",
  overtimeHourlyWage: "1500",
  annualBonus: "0",
  allowances: "0",
};

export function AnnualIncomeHourlyWage() {
  const [mode, setMode] = useState<Mode>("annualToHourly");
  const [annualForm, setAnnualForm] = useState(annualInitial);
  const [hourlyForm, setHourlyForm] = useState(hourlyInitial);
  const resultRef = useRef<HTMLDivElement>(null);

  function updateAnnual<K extends keyof typeof annualInitial>(key: K, value: (typeof annualInitial)[K]) {
    setAnnualForm((prev) => ({ ...prev, [key]: value }));
  }
  function updateHourly<K extends keyof typeof hourlyInitial>(key: K, value: (typeof hourlyInitial)[K]) {
    setHourlyForm((prev) => ({ ...prev, [key]: value }));
  }

  const annualError = !annualForm.annualIncome || Number(annualForm.annualIncome) <= 0 ? "年収は0より大きい値を入力してください。" : undefined;
  const hourlyError = !hourlyForm.hourlyWage || Number(hourlyForm.hourlyWage) <= 0 ? "時給は0より大きい値を入力してください。" : undefined;

  const annualResult = useMemo(() => {
    if (annualError) return null;
    return calcHourlyFromAnnual({
      annualIncome: Number(annualForm.annualIncome) || 0,
      annualBonus: Number(annualForm.annualBonus) || 0,
      dailyHours: Number(annualForm.dailyHours) || 0,
      weeklyDays: Number(annualForm.weeklyDays) || 0,
      annualHolidays: Number(annualForm.annualHolidays) || 0,
      annualPaidLeave: Number(annualForm.annualPaidLeave) || 0,
      monthlyOvertimeHours: Number(annualForm.monthlyOvertimeHours) || 0,
      includeOvertime: annualForm.includeOvertime,
    });
  }, [annualForm, annualError]);

  const hourlyResult = useMemo(() => {
    if (hourlyError) return null;
    return calcAnnualFromHourly({
      hourlyWage: Number(hourlyForm.hourlyWage) || 0,
      dailyHours: Number(hourlyForm.dailyHours) || 0,
      weeklyDays: Number(hourlyForm.weeklyDays) || 0,
      annualWorkingDays: Number(hourlyForm.annualWorkingDays) || 0,
      monthlyOvertimeHours: Number(hourlyForm.monthlyOvertimeHours) || 0,
      overtimeHourlyWage: Number(hourlyForm.overtimeHourlyWage) || 0,
      annualBonus: Number(hourlyForm.annualBonus) || 0,
      allowances: Number(hourlyForm.allowances) || 0,
    });
  }, [hourlyForm, hourlyError]);

  function handleReset() {
    setAnnualForm(annualInitial);
    setHourlyForm(hourlyInitial);
  }

  const shareText =
    mode === "annualToHourly" && annualResult
      ? `【年収・時給換算】\n実質時給: ¥${Math.round(annualResult.hourlyWage).toLocaleString()}\n月収換算: ¥${Math.round(annualResult.monthlyIncome).toLocaleString()}`
      : hourlyResult
        ? `【年収・時給換算】\n年収目安: ¥${Math.round(hourlyResult.annualIncomeWithAllowances).toLocaleString()}\n月収目安: ¥${Math.round(hourlyResult.monthlyIncome).toLocaleString()}`
        : "";

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => v && setMode(v as Mode)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="annualToHourly">年収から時給を計算</TabsTrigger>
          <TabsTrigger value="hourlyToAnnual">時給から年収を計算</TabsTrigger>
        </TabsList>
      </Tabs>

      <p className="text-xs text-muted-foreground">
        年収は額面（税引き前）金額として計算しています。手取り額とは異なり、実際の金額は税金・社会保険料・勤務先の就業規則等によって変わる目安値です。
      </p>

      {mode === "annualToHourly" ? (
        <div className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <UnitInput id="ai-income" label="年収" unit="円" value={annualForm.annualIncome} onChange={(v) => updateAnnual("annualIncome", v)} min={0} />
            <UnitInput id="ai-bonus" label="年間ボーナス" unit="円" value={annualForm.annualBonus} onChange={(v) => updateAnnual("annualBonus", v)} min={0} />
          </div>
          {annualError && <ErrorMessage>{annualError}</ErrorMessage>}
          <div className="grid gap-5 sm:grid-cols-3">
            <UnitInput id="ai-daily-hours" label="1日の勤務時間" unit="時間" value={annualForm.dailyHours} onChange={(v) => updateAnnual("dailyHours", v)} min={0} step="0.5" />
            <UnitInput id="ai-weekly-days" label="週の勤務日数" unit="日" value={annualForm.weeklyDays} onChange={(v) => updateAnnual("weeklyDays", v)} min={0} max={7} />
            <UnitInput id="ai-overtime" label="月平均残業時間" unit="時間" value={annualForm.monthlyOvertimeHours} onChange={(v) => updateAnnual("monthlyOvertimeHours", v)} min={0} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <UnitInput id="ai-holidays" label="年間休日数" unit="日" value={annualForm.annualHolidays} onChange={(v) => updateAnnual("annualHolidays", v)} min={0} max={365} />
            <UnitInput id="ai-paidleave" label="年間有給取得日数" unit="日" value={annualForm.annualPaidLeave} onChange={(v) => updateAnnual("annualPaidLeave", v)} min={0} max={365} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={annualForm.includeOvertime}
              onChange={(e) => updateAnnual("includeOvertime", e.target.checked)}
              className="size-4 rounded border-input"
            />
            残業時間を実質時給の計算に含める
          </label>

          {annualResult && (
            <div ref={resultRef} className="space-y-4">
              <ResultCard
                items={[
                  { label: "実質時給", value: `¥${Math.round(annualResult.hourlyWage).toLocaleString()}`, highlight: true },
                  { label: "月収換算", value: `¥${Math.round(annualResult.monthlyIncome).toLocaleString()}` },
                  { label: "日給換算", value: `¥${Math.round(annualResult.dailyWage).toLocaleString()}` },
                  { label: "年間労働日数", value: `${annualResult.workingDaysPerYear}日` },
                  { label: "年間労働時間", value: `${Math.round(annualResult.annualWorkingHours).toLocaleString()}時間` },
                  { label: "ボーナスを除いた時給", value: `¥${Math.round(annualResult.hourlyExcludingBonus).toLocaleString()}` },
                  { label: "ボーナスを含めた時給", value: `¥${Math.round(annualResult.hourlyIncludingBonus).toLocaleString()}` },
                ]}
              />
              <ResultShareActions shareText={shareText} title="年収・時給換算" resultRef={resultRef} />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <UnitInput id="hi-wage" label="時給" unit="円" value={hourlyForm.hourlyWage} onChange={(v) => updateHourly("hourlyWage", v)} min={0} />
            <UnitInput id="hi-daily-hours" label="1日の勤務時間" unit="時間" value={hourlyForm.dailyHours} onChange={(v) => updateHourly("dailyHours", v)} min={0} step="0.5" />
          </div>
          {hourlyError && <ErrorMessage>{hourlyError}</ErrorMessage>}
          <div className="grid gap-5 sm:grid-cols-2">
            <UnitInput id="hi-weekly-days" label="週の勤務日数" unit="日" value={hourlyForm.weeklyDays} onChange={(v) => updateHourly("weeklyDays", v)} min={0} max={7} />
            <UnitInput id="hi-annual-days" label="年間勤務日数" unit="日" value={hourlyForm.annualWorkingDays} onChange={(v) => updateHourly("annualWorkingDays", v)} min={0} max={365} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <UnitInput id="hi-overtime-hours" label="月平均残業時間" unit="時間" value={hourlyForm.monthlyOvertimeHours} onChange={(v) => updateHourly("monthlyOvertimeHours", v)} min={0} />
            <UnitInput id="hi-overtime-wage" label="残業時給" unit="円" value={hourlyForm.overtimeHourlyWage} onChange={(v) => updateHourly("overtimeHourlyWage", v)} min={0} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <UnitInput id="hi-bonus" label="年間ボーナス" unit="円" value={hourlyForm.annualBonus} onChange={(v) => updateHourly("annualBonus", v)} min={0} />
            <UnitInput id="hi-allowances" label="各種手当（年間合計）" unit="円" value={hourlyForm.allowances} onChange={(v) => updateHourly("allowances", v)} min={0} />
          </div>

          {hourlyResult && (
            <div ref={resultRef} className="space-y-4">
              <ResultCard
                items={[
                  { label: "手当込み年収", value: `¥${Math.round(hourlyResult.annualIncomeWithAllowances).toLocaleString()}`, highlight: true },
                  { label: "年収目安（残業込み）", value: `¥${Math.round(hourlyResult.annualIncome).toLocaleString()}` },
                  { label: "ボーナス込み年収", value: `¥${Math.round(hourlyResult.annualIncomeWithBonus).toLocaleString()}` },
                  { label: "月収目安", value: `¥${Math.round(hourlyResult.monthlyIncome).toLocaleString()}` },
                  { label: "週給", value: `¥${Math.round(hourlyResult.weeklyWage).toLocaleString()}` },
                  { label: "日給", value: `¥${Math.round(hourlyResult.dailyWage).toLocaleString()}` },
                  { label: "残業代（年間）", value: `¥${Math.round(hourlyResult.overtimePay).toLocaleString()}` },
                ]}
              />
              <ResultShareActions shareText={shareText} title="年収・時給換算" resultRef={resultRef} />
            </div>
          )}
        </div>
      )}

      <ResetButton onReset={handleReset} />
    </div>
  );
}
