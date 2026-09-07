"use client";

import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BirthDateInput, type BirthDateValue } from "@/components/shared/birth-date-input";
import { ErrorMessage } from "@/components/shared/error-message";
import { isValidBirthDate } from "@/utils/age";
import {
  afterHighSchoolOptions,
  allowsGraduateSchool,
  buildCareerHistory,
  buildResumeLines,
  formatYearMonth,
  formatYearMonthWareki,
  graduateOptions,
  type AfterHighSchoolKey,
  type AfterJuniorHigh,
  type GraduateKey,
} from "@/utils/career-history";

type Era = "seireki" | "wareki";

const juniorHighItems: Record<AfterJuniorHigh, string> = {
  "high-school": "高等学校（3年）",
  kosen: "高等専門学校（5年）",
};

const afterHighSchoolItems = Object.fromEntries(
  (Object.keys(afterHighSchoolOptions) as AfterHighSchoolKey[]).map((k) => [
    k,
    afterHighSchoolOptions[k].label,
  ])
);
const graduateItems = Object.fromEntries(
  (Object.keys(graduateOptions) as GraduateKey[]).map((k) => [k, graduateOptions[k].label])
);
const yearCountOptions = [0, 1, 2, 3];
const gapItems = Object.fromEntries(yearCountOptions.map((n) => [String(n), n === 0 ? "なし" : `${n}年`]));

export function GraduationDateCalculator() {
  const [birth, setBirth] = useState<BirthDateValue>({ year: 2000, month: 4, day: 2 });
  const [afterJuniorHigh, setAfterJuniorHigh] = useState<AfterJuniorHigh>("high-school");
  const [afterHighSchool, setAfterHighSchool] = useState<AfterHighSchoolKey>("university4");
  const [graduate, setGraduate] = useState<GraduateKey>("none");
  const [gapYears, setGapYears] = useState(0);
  const [repeatYears, setRepeatYears] = useState(0);
  const [era, setEra] = useState<Era>("seireki");
  const [copied, setCopied] = useState(false);

  const birthDate = useMemo(
    () => new Date(birth.year, birth.month - 1, birth.day),
    [birth]
  );
  const valid = isValidBirthDate(birthDate);
  const showGraduate = allowsGraduateSchool({ afterJuniorHigh, afterHighSchool });

  const entries = useMemo(
    () =>
      valid
        ? buildCareerHistory(birthDate, {
            afterJuniorHigh,
            afterHighSchool,
            graduate: showGraduate ? graduate : "none",
            gapYears,
            repeatYears,
          })
        : [],
    [valid, birthDate, afterJuniorHigh, afterHighSchool, graduate, showGraduate, gapYears, repeatYears]
  );

  const resumeText = useMemo(() => buildResumeLines(entries, era).join("\n"), [entries, era]);

  async function handleCopy() {
    if (!resumeText) return;
    try {
      await navigator.clipboard.writeText(resumeText);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = resumeText;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    toast.success("学歴欄をコピーしました");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <BirthDateInput
        value={birth}
        onChange={setBirth}
        error={valid ? undefined : "生年月日を正しく入力してください（未来の日付は指定できません）。"}
      />
      {!valid && <ErrorMessage>生年月日を正しく入力してください。</ErrorMessage>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>中学卒業後の進路</Label>
          <Select
            items={juniorHighItems}
            value={afterJuniorHigh}
            onValueChange={(v) => v && setAfterJuniorHigh(v as AfterJuniorHigh)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(juniorHighItems) as AfterJuniorHigh[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {juniorHighItems[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {afterJuniorHigh === "high-school" && (
          <div className="space-y-2">
            <Label>高校卒業後の進路</Label>
            <Select
              items={afterHighSchoolItems}
              value={afterHighSchool}
              onValueChange={(v) => v && setAfterHighSchool(v as AfterHighSchoolKey)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(afterHighSchoolOptions) as AfterHighSchoolKey[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {afterHighSchoolOptions[key].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showGraduate && (
          <div className="space-y-2">
            <Label>大学院</Label>
            <Select items={graduateItems} value={graduate} onValueChange={(v) => v && setGraduate(v as GraduateKey)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(graduateOptions) as GraduateKey[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {graduateOptions[key].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>浪人・進学の遅れ</Label>
          <Select
            items={gapItems}
            value={String(gapYears)}
            onValueChange={(v) => v && setGapYears(Number(v))}
            disabled={afterJuniorHigh === "kosen"}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearCountOptions.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n === 0 ? "なし" : `${n}年`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>留年・休学</Label>
          <Select items={gapItems} value={String(repeatYears)} onValueChange={(v) => v && setRepeatYears(Number(v))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearCountOptions.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n === 0 ? "なし" : `${n}年`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {entries.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[420px] text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-3 text-left font-medium text-muted-foreground">区分</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">西暦</th>
                  <th className="p-3 text-left font-medium text-muted-foreground">和暦</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entries.map((entry) => (
                  <tr key={`${entry.school}-${entry.event}-${entry.year}`}>
                    <td className="p-3 font-semibold whitespace-nowrap">
                      {entry.school}
                      <span className="ml-2 font-normal text-muted-foreground">{entry.event}</span>
                    </td>
                    <td className="p-3 whitespace-nowrap">{formatYearMonth(entry)}</td>
                    <td className="p-3 whitespace-nowrap text-muted-foreground">
                      {formatYearMonthWareki(entry)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label>履歴書の学歴欄にそのまま使える形式</Label>
              <div className="flex items-center gap-2">
                <Tabs value={era} onValueChange={(v) => setEra(v as Era)}>
                  <TabsList>
                    <TabsTrigger value="seireki">西暦</TabsTrigger>
                    <TabsTrigger value="wareki">和暦</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button type="button" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check />
                      コピー済み
                    </>
                  ) : (
                    <>
                      <Copy />
                      コピー
                    </>
                  )}
                </Button>
              </div>
            </div>
            <pre className="overflow-x-auto rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed">
              {resumeText}
            </pre>
            <p className="text-xs text-muted-foreground">
              「小学校」「高等学校」などの部分を、実際に在籍した学校名に置き換えてご利用ください。履歴書では西暦と和暦のどちらかに統一するのが基本です。
            </p>
          </div>
        </>
      )}
    </div>
  );
}
