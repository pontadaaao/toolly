"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UnitInput } from "@/components/shared/unit-input";
import { ResultCard } from "@/components/shared/result-card";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { ResetButton } from "@/components/shared/reset-button";
import {
  calcGpa,
  calcHyoteiHeikin,
  gpaGradeLabels,
  type GpaCourse,
  type GpaGrade,
  type HyoteiSubject,
} from "@/utils/gpa";

type Mode = "gpa" | "hyotei";

const ratingItems: Record<string, string> = { "5": "5", "4": "4", "3": "3", "2": "2", "1": "1" };

function makeId(): string {
  return Math.random().toString(36).slice(2);
}

const initialCourses: GpaCourse[] = [
  { id: "course-1", name: "微分積分学", credits: 2, grade: "A" },
  { id: "course-2", name: "英語コミュニケーション", credits: 2, grade: "S" },
  { id: "course-3", name: "プログラミング基礎", credits: 2, grade: "B" },
];

const initialSubjects: HyoteiSubject[] = [
  { id: "subject-1", name: "国語", weight: 1, rating: 4 },
  { id: "subject-2", name: "数学", weight: 1, rating: 5 },
  { id: "subject-3", name: "英語", weight: 1, rating: 4 },
];

export function GpaCalculator() {
  const [mode, setMode] = useState<Mode>("gpa");
  const [courses, setCourses] = useState<GpaCourse[]>(initialCourses);
  const [subjects, setSubjects] = useState<HyoteiSubject[]>(initialSubjects);
  const [weighted, setWeighted] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  function updateCourse(id: string, patch: Partial<GpaCourse>) {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function addCourse() {
    setCourses((prev) => [...prev, { id: makeId(), name: "", credits: 2, grade: "A" }]);
  }

  function removeCourse(id: string) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  function updateSubject(id: string, patch: Partial<HyoteiSubject>) {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function addSubject() {
    setSubjects((prev) => [...prev, { id: makeId(), name: "", weight: 1, rating: 3 }]);
  }

  function removeSubject(id: string) {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  }

  const gpaResult = useMemo(() => calcGpa(courses), [courses]);
  const hyoteiResult = useMemo(() => calcHyoteiHeikin(subjects, weighted), [subjects, weighted]);

  function handleReset() {
    if (mode === "gpa") {
      setCourses(initialCourses);
    } else {
      setSubjects(initialSubjects);
      setWeighted(false);
    }
  }

  const shareText =
    mode === "gpa"
      ? `【GPA計算】\n登録科目数: ${courses.length}科目\n総単位数: ${gpaResult.totalCredits}単位\nGPA: ${gpaResult.gpa.toFixed(2)}`
      : `【評定平均計算】\n登録科目数: ${subjects.length}科目\n評定平均: ${hyoteiResult.average.toFixed(1)}`;

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => v && setMode(v as Mode)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gpa">GPA計算（大学）</TabsTrigger>
          <TabsTrigger value="hyotei">評定平均計算（高校）</TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === "gpa" ? (
        <div className="space-y-4">
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/30 p-3 sm:grid-cols-[1fr_120px_180px_auto] sm:items-end"
              >
                <div className="space-y-2">
                  <Label htmlFor={`course-name-${course.id}`}>科目名</Label>
                  <Input
                    id={`course-name-${course.id}`}
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                    placeholder="科目名（任意）"
                  />
                </div>
                <UnitInput
                  id={`course-credits-${course.id}`}
                  label="単位数"
                  unit="単位"
                  value={String(course.credits)}
                  onChange={(v) => updateCourse(course.id, { credits: Number(v) || 0 })}
                  min={0}
                  step={1}
                />
                <div className="space-y-2">
                  <Label htmlFor={`course-grade-${course.id}`}>成績</Label>
                  <Select
                    items={gpaGradeLabels}
                    value={course.grade}
                    onValueChange={(v) => v && updateCourse(course.id, { grade: v as GpaGrade })}
                  >
                    <SelectTrigger id={`course-grade-${course.id}`} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(gpaGradeLabels) as GpaGrade[]).map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {gpaGradeLabels[grade]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCourse(course.id)}
                  aria-label="この科目を削除"
                  className="sm:mb-0.5"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" onClick={addCourse} className="gap-1.5">
            <Plus className="size-4" />
            科目を追加
          </Button>

          <div ref={mode === "gpa" ? resultRef : undefined} className="space-y-4">
            <ResultCard
              items={[
                { label: "GPA", value: gpaResult.gpa.toFixed(2), highlight: true },
                { label: "総単位数", value: `${gpaResult.totalCredits}単位` },
                { label: "合計グレードポイント", value: gpaResult.totalGradePoints.toFixed(1) },
              ]}
            />
            <ResultShareActions shareText={shareText} title="GPA計算" resultRef={resultRef} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={weighted}
              onChange={(e) => setWeighted(e.target.checked)}
              className="size-4 rounded border-input"
            />
            単位数で重み付けする
          </label>

          <div className="space-y-3">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className={`grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/30 p-3 sm:items-end ${
                  weighted ? "sm:grid-cols-[1fr_120px_140px_auto]" : "sm:grid-cols-[1fr_140px_auto]"
                }`}
              >
                <div className="space-y-2">
                  <Label htmlFor={`subject-name-${subject.id}`}>科目名</Label>
                  <Input
                    id={`subject-name-${subject.id}`}
                    value={subject.name}
                    onChange={(e) => updateSubject(subject.id, { name: e.target.value })}
                    placeholder="科目名（任意）"
                  />
                </div>
                {weighted && (
                  <UnitInput
                    id={`subject-weight-${subject.id}`}
                    label="単位数"
                    unit="単位"
                    value={String(subject.weight)}
                    onChange={(v) => updateSubject(subject.id, { weight: Number(v) || 0 })}
                    min={0}
                    step={1}
                  />
                )}
                <div className="space-y-2">
                  <Label htmlFor={`subject-rating-${subject.id}`}>評定</Label>
                  <Select
                    items={ratingItems}
                    value={String(subject.rating)}
                    onValueChange={(v) => v && updateSubject(subject.id, { rating: Number(v) })}
                  >
                    <SelectTrigger id={`subject-rating-${subject.id}`} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((r) => (
                        <SelectItem key={r} value={String(r)}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSubject(subject.id)}
                  aria-label="この科目を削除"
                  className="sm:mb-0.5"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" onClick={addSubject} className="gap-1.5">
            <Plus className="size-4" />
            科目を追加
          </Button>

          <div ref={mode === "hyotei" ? resultRef : undefined} className="space-y-4">
            <ResultCard
              items={[
                { label: "評定平均", value: hyoteiResult.average.toFixed(1), highlight: true },
                { label: "科目数", value: `${hyoteiResult.subjectCount}科目` },
                ...(weighted ? [{ label: "合計単位数", value: `${hyoteiResult.totalWeight}単位` }] : []),
              ]}
            />
            <ResultShareActions shareText={shareText} title="評定平均計算" resultRef={resultRef} />
          </div>
        </div>
      )}

      <ResetButton onReset={handleReset} />
    </div>
  );
}
