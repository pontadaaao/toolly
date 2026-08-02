/**
 * Year-only (no month/day) Gregorian ↔ Japanese era conversion, used by tools
 * that only deal with a birth *year* (age-reference-table) rather than a full
 * date. For full dates, prefer `formatDateWareki` in `utils/date.ts`, which
 * uses `Intl` and is precise to the day.
 */

export type Era = "明治" | "大正" | "昭和" | "平成" | "令和";

interface EraBoundary {
  era: Era;
  /** First Gregorian calendar year touched by this era (a partial year for every era but Meiji). */
  startYear: number;
}

const eraBoundaries: EraBoundary[] = [
  { era: "明治", startYear: 1868 },
  { era: "大正", startYear: 1912 },
  { era: "昭和", startYear: 1926 },
  { era: "平成", startYear: 1989 },
  { era: "令和", startYear: 2019 },
];

export interface WarekiYear {
  era: Era;
  /** 元年 is represented as 1. */
  year: number;
}

/**
 * Converts a Gregorian year to its Japanese era year(s). Era-change years
 * (1912, 1926, 1989, 2019) genuinely belong to two eras depending on the
 * month, so those return two entries; every other year returns one.
 */
export function toWarekiYears(gregorianYear: number): WarekiYear[] {
  const results: WarekiYear[] = [];
  for (let i = 0; i < eraBoundaries.length; i++) {
    const { era, startYear } = eraBoundaries[i];
    const nextStartYear = eraBoundaries[i + 1]?.startYear ?? Infinity;
    if (gregorianYear < startYear || gregorianYear > nextStartYear) continue;
    results.push({ era, year: gregorianYear - startYear + 1 });
  }
  return results;
}

export function formatWarekiYear(w: WarekiYear): string {
  return `${w.era}${w.year === 1 ? "元" : w.year}年`;
}

export function formatWarekiYears(gregorianYear: number): string {
  const years = toWarekiYears(gregorianYear);
  if (years.length === 0) return `${gregorianYear}年`;
  return years.map(formatWarekiYear).join(" / ");
}
