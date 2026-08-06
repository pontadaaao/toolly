/** GPA（大学）・評定平均（高校）の共通計算ロジック。 */

export type GpaGrade = "S" | "A" | "B" | "C" | "D";

/** 文部科学省のGPAガイドラインで広く採用されている4段階のグレードポイント。 */
export const gpaGradePoints: Record<GpaGrade, number> = {
  S: 4,
  A: 3,
  B: 2,
  C: 1,
  D: 0,
};

export const gpaGradeLabels: Record<GpaGrade, string> = {
  S: "S（秀・90点以上）",
  A: "A（優・80〜89点）",
  B: "B（良・70〜79点）",
  C: "C（可・60〜69点）",
  D: "D（不可・59点以下）",
};

export interface GpaCourse {
  id: string;
  name: string;
  credits: number;
  grade: GpaGrade;
}

export interface GpaResult {
  gpa: number;
  totalCredits: number;
  totalGradePoints: number;
}

/** GPA = Σ(グレードポイント × 単位数) ÷ Σ(単位数) */
export function calcGpa(courses: GpaCourse[]): GpaResult {
  const validCourses = courses.filter((c) => c.credits > 0);
  const totalCredits = validCourses.reduce((sum, c) => sum + c.credits, 0);
  const totalGradePoints = validCourses.reduce((sum, c) => sum + gpaGradePoints[c.grade] * c.credits, 0);
  const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

  return { gpa, totalCredits, totalGradePoints };
}

export interface HyoteiSubject {
  id: string;
  name: string;
  /** 単位数（重み付け平均を使う場合のみ参照）。 */
  weight: number;
  /** 5段階評定（1〜5）。 */
  rating: number;
}

export interface HyoteiResult {
  average: number;
  subjectCount: number;
  totalWeight: number;
}

/**
 * 評定平均 = Σ評定 ÷ 科目数（単純平均、推薦入試などで一般的な方式）。
 * weighted=true の場合は Σ(評定 × 単位数) ÷ Σ単位数 で計算する。
 */
export function calcHyoteiHeikin(subjects: HyoteiSubject[], weighted: boolean): HyoteiResult {
  const subjectCount = subjects.length;

  if (weighted) {
    const totalWeight = subjects.reduce((sum, s) => sum + s.weight, 0);
    const totalPoints = subjects.reduce((sum, s) => sum + s.rating * s.weight, 0);
    return { average: totalWeight > 0 ? totalPoints / totalWeight : 0, subjectCount, totalWeight };
  }

  const total = subjects.reduce((sum, s) => sum + s.rating, 0);
  return { average: subjectCount > 0 ? total / subjectCount : 0, subjectCount, totalWeight: subjectCount };
}
