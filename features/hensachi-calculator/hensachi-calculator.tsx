"use client";

import { useMemo, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X } from "lucide-react";
import { UnitInput } from "@/components/shared/unit-input";
import { ResultCard } from "@/components/shared/result-card";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { ResetButton } from "@/components/shared/reset-button";
import { ErrorMessage } from "@/components/shared/error-message";
import {
  calcHensachi,
  calcScoreListHensachi,
  calcSubjectsHensachi,
  calcTopPercentage,
  createSubjectId,
  parseScoreList,
  type SubjectInput,
} from "@/utils/hensachi";

type Mode = "subjects" | "quick" | "list";

interface SubjectRowState {
  id: string;
  name: string;
  score: string;
  average: string;
  stdDev: string;
}

function formatNumber(n: number, digits = 1): string {
  return n.toLocaleString("ja-JP", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

const numberInputClass =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

function isRowEmpty(row: SubjectRowState): boolean {
  return row.score === "" && row.average === "" && row.stdDev === "";
}

function isRowComplete(row: SubjectRowState): boolean {
  if (row.score === "" || row.average === "" || row.stdDev === "") return false;
  if (Number.isNaN(Number(row.score)) || Number.isNaN(Number(row.average)) || Number.isNaN(Number(row.stdDev))) return false;
  return Number(row.stdDev) > 0;
}

interface SubjectRowProps {
  index: number;
  row: SubjectRowState;
  onChange: (patch: Partial<SubjectRowState>) => void;
  onRemove: () => void;
  removeDisabled: boolean;
}

function SubjectRow({ index, row, onChange, onRemove, removeDisabled }: SubjectRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border bg-card p-2.5">
      <Input
        value={row.name}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder={`教科${index + 1}`}
        aria-label="教科名"
        className="w-full sm:w-24 sm:shrink-0"
      />
      <Input
        type="number"
        inputMode="decimal"
        value={row.score}
        onChange={(e) => onChange({ score: e.target.value })}
        placeholder="得点"
        aria-label="得点"
        className={`w-20 flex-1 sm:flex-none ${numberInputClass}`}
      />
      <Input
        type="number"
        inputMode="decimal"
        value={row.average}
        onChange={(e) => onChange({ average: e.target.value })}
        placeholder="平均点"
        aria-label="平均点"
        className={`w-20 flex-1 sm:flex-none ${numberInputClass}`}
      />
      <Input
        type="number"
        inputMode="decimal"
        value={row.stdDev}
        onChange={(e) => onChange({ stdDev: e.target.value })}
        placeholder="標準偏差"
        aria-label="標準偏差"
        className={`w-20 flex-1 sm:flex-none ${numberInputClass}`}
      />
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        onClick={onRemove}
        disabled={removeDisabled}
        aria-label="この教科を削除"
        className="ml-auto sm:ml-0"
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}

const initialSubjectRows: SubjectRowState[] = [
  { id: createSubjectId(), name: "国語", score: "68", average: "58", stdDev: "12" },
  { id: createSubjectId(), name: "数学", score: "55", average: "52", stdDev: "15" },
  { id: createSubjectId(), name: "英語", score: "72", average: "60", stdDev: "10" },
];

export function HensachiCalculator() {
  const [mode, setMode] = useState<Mode>("subjects");

  const [subjectRows, setSubjectRows] = useState<SubjectRowState[]>(initialSubjectRows);

  const [score, setScore] = useState("65");
  const [average, setAverage] = useState("55");
  const [stdDev, setStdDev] = useState("10");

  const [scoreListText, setScoreListText] = useState("");

  const resultRef = useRef<HTMLDivElement>(null);

  const subjectsError = useMemo(() => {
    if (mode !== "subjects") return undefined;
    const nonEmptyRows = subjectRows.filter((r) => !isRowEmpty(r));
    if (nonEmptyRows.length === 0) return undefined;
    if (nonEmptyRows.some((r) => !isRowComplete(r))) {
      return "すべての教科について、得点・平均点・標準偏差（0より大きい値）を入力してください。";
    }
    return undefined;
  }, [mode, subjectRows]);

  const subjectsResult = useMemo(() => {
    if (mode !== "subjects" || subjectsError) return null;
    const completeRows = subjectRows.filter(isRowComplete);
    if (completeRows.length === 0) return null;
    const subjects: SubjectInput[] = completeRows.map((r, i) => ({
      id: r.id,
      name: r.name.trim() || `教科${i + 1}`,
      score: Number(r.score),
      average: Number(r.average),
      stdDev: Number(r.stdDev),
    }));
    return calcSubjectsHensachi(subjects);
  }, [mode, subjectRows, subjectsError]);

  const quickError = useMemo(() => {
    if (mode !== "quick") return undefined;
    if (score === "" || average === "" || stdDev === "") return undefined;
    const stdDevNum = Number(stdDev);
    if (stdDevNum <= 0) return "標準偏差は0より大きい値を入力してください。";
    return undefined;
  }, [mode, score, average, stdDev]);

  const quickResult = useMemo(() => {
    if (mode !== "quick" || quickError) return null;
    if (score === "" || average === "" || stdDev === "") return null;
    const scoreNum = Number(score);
    const averageNum = Number(average);
    const stdDevNum = Number(stdDev);
    const hensachi = calcHensachi(scoreNum, averageNum, stdDevNum);
    const topPercentage = calcTopPercentage(hensachi);
    return { hensachi, topPercentage };
  }, [mode, score, average, stdDev, quickError]);

  const scores = useMemo(() => (mode === "list" ? parseScoreList(scoreListText) : []), [mode, scoreListText]);

  const listError = useMemo(() => {
    if (mode !== "list" || scores.length === 0) return undefined;
    if (scores.length < 2) return "得点は2つ以上入力してください。";
    return undefined;
  }, [mode, scores]);

  const listResult = useMemo(() => {
    if (mode !== "list" || listError || scores.length < 2) return null;
    return calcScoreListHensachi(scores);
  }, [mode, scores, listError]);

  function addSubjectRow() {
    if (subjectRows.length >= 10) return;
    setSubjectRows((prev) => [...prev, { id: createSubjectId(), name: "", score: "", average: "", stdDev: "" }]);
  }

  function removeSubjectRow(id: string) {
    if (subjectRows.length <= 1) return;
    setSubjectRows((prev) => prev.filter((r) => r.id !== id));
  }

  function updateSubjectRow(id: string, patch: Partial<SubjectRowState>) {
    setSubjectRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function handleReset() {
    setSubjectRows(initialSubjectRows);
    setScore("65");
    setAverage("55");
    setStdDev("10");
    setScoreListText("");
  }

  const shareText = subjectsResult
    ? `【偏差値計算機】\n総合偏差値: ${formatNumber(subjectsResult.overallHensachi)}（上位${formatNumber(subjectsResult.topPercentage)}%相当）\n合計得点: ${formatNumber(subjectsResult.totalScore, 0)}点`
    : quickResult
      ? `【偏差値計算機】\n偏差値: ${formatNumber(quickResult.hensachi)}（上位${formatNumber(quickResult.topPercentage)}%相当）`
      : listResult
        ? `【偏差値計算機】\n人数: ${listResult.count}人 / 平均点: ${formatNumber(listResult.average)}点 / 標準偏差: ${formatNumber(listResult.stdDev)}`
        : "";

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => v && setMode(v as Mode)}>
        <TabsList className="grid !h-auto w-full grid-cols-1 gap-1 sm:!h-8 sm:grid-cols-3">
          <TabsTrigger value="subjects">教科別の合計から計算</TabsTrigger>
          <TabsTrigger value="quick">平均点・標準偏差から計算</TabsTrigger>
          <TabsTrigger value="list">得点一覧から計算</TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === "subjects" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>教科ごとの得点・平均点・標準偏差</Label>
              <Button type="button" size="sm" variant="outline" onClick={addSubjectRow} disabled={subjectRows.length >= 10} className="gap-1.5">
                <Plus className="size-3.5" />
                教科を追加
              </Button>
            </div>
            <div className="hidden gap-2.5 px-1 text-xs text-muted-foreground sm:flex">
              <span className="w-24 shrink-0">教科名</span>
              <span className="w-20">得点</span>
              <span className="w-20">平均点</span>
              <span className="w-20">標準偏差</span>
            </div>
            <div className="space-y-2">
              {subjectRows.map((row, index) => (
                <SubjectRow
                  key={row.id}
                  index={index}
                  row={row}
                  onChange={(patch) => updateSubjectRow(row.id, patch)}
                  onRemove={() => removeSubjectRow(row.id)}
                  removeDisabled={subjectRows.length <= 1}
                />
              ))}
            </div>
          </div>
          {subjectsError && <ErrorMessage>{subjectsError}</ErrorMessage>}

          {subjectsResult && (
            <div ref={resultRef} className="space-y-4">
              <ResultCard
                title="総合結果"
                items={[
                  { label: "総合偏差値", value: formatNumber(subjectsResult.overallHensachi), highlight: true },
                  { label: "推定順位", value: `上位${formatNumber(subjectsResult.topPercentage)}%相当` },
                  { label: "合計得点", value: `${formatNumber(subjectsResult.totalScore, 0)}点` },
                  { label: "合計平均点", value: `${formatNumber(subjectsResult.totalAverage, 0)}点` },
                ]}
              />
              <div className="overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium">教科</th>
                      <th className="px-4 py-2.5 text-left font-medium">得点</th>
                      <th className="px-4 py-2.5 text-left font-medium">偏差値</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {subjectsResult.subjects.map((subject, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2.5">{subject.name}</td>
                        <td className="px-4 py-2.5">{subject.score}点</td>
                        <td className="px-4 py-2.5 font-semibold">{formatNumber(subject.hensachi)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ResultShareActions shareText={shareText} title="偏差値計算機" resultRef={resultRef} />
            </div>
          )}
        </div>
      )}

      {mode === "quick" && (
        <div className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-3">
            <UnitInput id="hensachi-score" label="自分の得点" unit="点" value={score} onChange={setScore} />
            <UnitInput id="hensachi-average" label="平均点" unit="点" value={average} onChange={setAverage} />
            <UnitInput id="hensachi-stddev" label="標準偏差" value={stdDev} onChange={setStdDev} />
          </div>
          {quickError && <ErrorMessage>{quickError}</ErrorMessage>}

          {quickResult && (
            <div ref={resultRef} className="space-y-4">
              <ResultCard
                items={[
                  { label: "偏差値", value: formatNumber(quickResult.hensachi), highlight: true },
                  { label: "推定順位", value: `上位${formatNumber(quickResult.topPercentage)}%相当` },
                ]}
              />
              <ResultShareActions shareText={shareText} title="偏差値計算機" resultRef={resultRef} />
            </div>
          )}
        </div>
      )}

      {mode === "list" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hensachi-score-list">得点一覧</Label>
            <Textarea
              id="hensachi-score-list"
              value={scoreListText}
              onChange={(e) => setScoreListText(e.target.value)}
              placeholder={"クラス全員分の得点を入力してください\n例: 65, 72, 58, 80, 45\n（カンマ・改行・スペース区切りに対応）"}
              className="min-h-32"
            />
          </div>
          {listError && <ErrorMessage>{listError}</ErrorMessage>}

          {listResult && (
            <div ref={resultRef} className="space-y-4">
              <ResultCard
                title="集計結果"
                items={[
                  { label: "人数", value: `${listResult.count}人` },
                  { label: "平均点", value: `${formatNumber(listResult.average)}点` },
                  { label: "標準偏差", value: formatNumber(listResult.stdDev) },
                ]}
              />
              <div className="overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium">順位</th>
                      <th className="px-4 py-2.5 text-left font-medium">得点</th>
                      <th className="px-4 py-2.5 text-left font-medium">偏差値</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {listResult.entries.map((entry, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2.5 text-muted-foreground">{index + 1}</td>
                        <td className="px-4 py-2.5">{entry.score}点</td>
                        <td className="px-4 py-2.5 font-semibold">{formatNumber(entry.hensachi)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ResultShareActions shareText={shareText} title="偏差値計算機" resultRef={resultRef} />
            </div>
          )}
        </div>
      )}

      <ResetButton onReset={handleReset} />
    </div>
  );
}
