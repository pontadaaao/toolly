/** Pure statistics helpers for the hensachi (偏差値 / deviation score) calculator. */

export function mean(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** Population standard deviation (母集団標準偏差) — the convention used for 偏差値. */
export function populationStdDev(values: number[]): number {
  const m = mean(values);
  const variance = values.reduce((sum, v) => sum + (v - m) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

/** 偏差値 = (得点 − 平均点) ÷ 標準偏差 × 10 + 50 */
export function calcHensachi(score: number, avg: number, stdDev: number): number {
  return ((score - avg) / stdDev) * 10 + 50;
}

/** Abramowitz & Stegun 7.1.26 approximation of the error function (accurate to ~1.5e-7). */
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-ax * ax);
  return sign * y;
}

function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

/** Estimated "top N%" position for a given hensachi, assuming a normal distribution. */
export function calcTopPercentage(hensachi: number): number {
  const z = (hensachi - 50) / 10;
  return (1 - normalCdf(z)) * 100;
}

export interface ScoreListResult {
  count: number;
  average: number;
  stdDev: number;
  entries: { score: number; hensachi: number }[];
}

/** Computes the mean/std-dev for a whole score list, plus each score's own hensachi, sorted by score descending. */
export function calcScoreListHensachi(scores: number[]): ScoreListResult {
  const average = mean(scores);
  const stdDev = populationStdDev(scores);
  const entries = scores
    .map((score) => ({ score, hensachi: stdDev === 0 ? 50 : calcHensachi(score, average, stdDev) }))
    .sort((a, b) => b.score - a.score);
  return { count: scores.length, average, stdDev, entries };
}

/** Parses free-text input (comma/newline/space separated numbers) into a clean number array. */
export function parseScoreList(text: string): number[] {
  return text
    .split(/[,、\s\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

export interface SubjectInput {
  id: string;
  name: string;
  score: number;
  average: number;
  stdDev: number;
}

export interface SubjectResult {
  name: string;
  score: number;
  hensachi: number;
}

export interface SubjectsHensachiResult {
  totalScore: number;
  totalAverage: number;
  /** 総合偏差値 = 各教科の偏差値の平均（入試の合成偏差値でよく使われる方式）。 */
  overallHensachi: number;
  topPercentage: number;
  subjects: SubjectResult[];
}

/**
 * 高校・大学受験の「総合偏差値」を、各教科の偏差値の平均から算出する。
 * 教科ごとに母集団（平均点・標準偏差）が異なるため、素点を単純合計するのではなく
 * 教科ごとの偏差値をいったん求めてから平均する方式（合成偏差値の一般的な求め方）を採用している。
 */
export function calcSubjectsHensachi(subjects: SubjectInput[]): SubjectsHensachiResult {
  const totalScore = subjects.reduce((sum, s) => sum + s.score, 0);
  const totalAverage = subjects.reduce((sum, s) => sum + s.average, 0);
  const subjectResults = subjects.map((s) => ({
    name: s.name,
    score: s.score,
    hensachi: calcHensachi(s.score, s.average, s.stdDev),
  }));
  const overallHensachi = mean(subjectResults.map((s) => s.hensachi));
  return {
    totalScore,
    totalAverage,
    overallHensachi,
    topPercentage: calcTopPercentage(overallHensachi),
    subjects: subjectResults,
  };
}

export function createSubjectId(): string {
  return `subject-${Math.random().toString(36).slice(2)}`;
}
