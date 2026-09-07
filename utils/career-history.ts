import { formatDateWareki } from "@/utils/date";

/**
 * 履歴書の学歴欄向けの進学タイムライン計算。
 *
 * `utils/school-lookup.ts` が「幼稚園・保育園から小学校まで、年度を見通す」
 * ための早見表を扱うのに対し、こちらは中学卒業以降の進路（大学・短大・専門
 * 学校・高専・大学院）と浪人・留年を織り込んで、履歴書にそのまま書ける年月を
 * 出すことを目的にしている。
 */

/** 中学卒業後の進路。高専だけは中学卒業直後に5年間通う課程。 */
export type AfterJuniorHigh = "high-school" | "kosen";

/** 高校卒業後の進路。値は修業年限（年）を兼ねる。 */
export const afterHighSchoolOptions = {
  none: { label: "進学しない（就職など）", years: 0, name: "" },
  university4: { label: "大学（4年制）", years: 4, name: "大学" },
  university6: { label: "大学（6年制：医・歯・薬・獣医）", years: 6, name: "大学" },
  juniorCollege: { label: "短期大学（2年）", years: 2, name: "短期大学" },
  vocational2: { label: "専門学校（2年）", years: 2, name: "専門学校" },
  vocational3: { label: "専門学校（3年）", years: 3, name: "専門学校" },
  vocational4: { label: "専門学校（4年）", years: 4, name: "専門学校" },
} as const;

export type AfterHighSchoolKey = keyof typeof afterHighSchoolOptions;

/** 大学院の課程。 */
export const graduateOptions = {
  none: { label: "進学しない", years: 0 },
  master: { label: "修士課程（2年）", years: 2 },
  doctor: { label: "修士・博士課程（5年）", years: 5 },
} as const;

export type GraduateKey = keyof typeof graduateOptions;

export interface CareerOptions {
  afterJuniorHigh: AfterJuniorHigh;
  afterHighSchool: AfterHighSchoolKey;
  graduate: GraduateKey;
  /** 浪人・予備校などで進学が遅れた年数。 */
  gapYears: number;
  /** 留年・休学で卒業が遅れた年数（高校卒業以降の課程に加算）。 */
  repeatYears: number;
}

export interface CareerEntry {
  /** 学校区分の表示名。履歴書では実際の学校名に置き換えて使う。 */
  school: string;
  /** 入学 / 卒業 / 修了 など。 */
  event: string;
  year: number;
  month: number;
}

const RESIGN_MONTH = 3;
const ENTER_MONTH = 4;

/** 4月2日を学年の区切りとして、小学校に入学する年を求める。 */
function elementaryEntranceYear(birthDate: Date): number {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const bornBeforeCutoff = month < 4 || (month === 4 && day === 1);
  return birthDate.getFullYear() + (bornBeforeCutoff ? 6 : 7);
}

/**
 * 生年月日と進路から、履歴書に書く順番どおりの学歴を組み立てる。
 * 入学は4月、卒業・修了は3月として計算する。
 */
export function buildCareerHistory(birthDate: Date, options: CareerOptions): CareerEntry[] {
  const entries: CareerEntry[] = [];
  const elementaryEnter = elementaryEntranceYear(birthDate);

  entries.push({ school: "小学校", event: "入学", year: elementaryEnter, month: ENTER_MONTH });
  entries.push({ school: "小学校", event: "卒業", year: elementaryEnter + 6, month: RESIGN_MONTH });

  const juniorEnter = elementaryEnter + 6;
  entries.push({ school: "中学校", event: "入学", year: juniorEnter, month: ENTER_MONTH });
  entries.push({ school: "中学校", event: "卒業", year: juniorEnter + 3, month: RESIGN_MONTH });

  const secondaryEnter = juniorEnter + 3;

  if (options.afterJuniorHigh === "kosen") {
    // 高専は中学卒業後に5年一貫。高校・その後の進学段階は表示しない。
    const kosenGraduate = secondaryEnter + 5 + options.repeatYears;
    entries.push({ school: "高等専門学校", event: "入学", year: secondaryEnter, month: ENTER_MONTH });
    entries.push({ school: "高等専門学校", event: "卒業", year: kosenGraduate, month: RESIGN_MONTH });
    return entries;
  }

  const highSchoolGraduate = secondaryEnter + 3;
  entries.push({ school: "高等学校", event: "入学", year: secondaryEnter, month: ENTER_MONTH });
  entries.push({ school: "高等学校", event: "卒業", year: highSchoolGraduate, month: RESIGN_MONTH });

  const higher = afterHighSchoolOptions[options.afterHighSchool];
  if (higher.years === 0) return entries;

  const higherEnter = highSchoolGraduate + options.gapYears;
  const higherGraduate = higherEnter + higher.years + options.repeatYears;
  entries.push({ school: higher.name, event: "入学", year: higherEnter, month: ENTER_MONTH });
  entries.push({ school: higher.name, event: "卒業", year: higherGraduate, month: RESIGN_MONTH });

  // 大学院は大学（4年制・6年制）からの進学のみを対象とする。
  const isUniversity =
    options.afterHighSchool === "university4" || options.afterHighSchool === "university6";
  const graduate = graduateOptions[options.graduate];
  if (!isUniversity || graduate.years === 0) return entries;

  entries.push({ school: "大学院", event: "入学", year: higherGraduate, month: ENTER_MONTH });
  entries.push({
    school: "大学院",
    event: options.graduate === "doctor" ? "博士課程 修了" : "修士課程 修了",
    year: higherGraduate + graduate.years,
    month: RESIGN_MONTH,
  });

  return entries;
}

/** 大学院の選択肢を出せる進路かどうか。 */
export function allowsGraduateSchool(options: Pick<CareerOptions, "afterJuniorHigh" | "afterHighSchool">) {
  return (
    options.afterJuniorHigh === "high-school" &&
    (options.afterHighSchool === "university4" || options.afterHighSchool === "university6")
  );
}

/** 「2025年4月」形式。 */
export function formatYearMonth(entry: CareerEntry): string {
  return `${entry.year}年${entry.month}月`;
}

/** 「令和7年4月」形式。 */
export function formatYearMonthWareki(entry: CareerEntry): string {
  // 元号の判定は年月で決まるため、日は1日で固定してよい。
  const full = formatDateWareki(new Date(entry.year, entry.month - 1, 1));
  return full.replace(/\d+日$/, "");
}

/** 履歴書の学歴欄にそのまま貼れる行のリストを組み立てる。 */
export function buildResumeLines(entries: CareerEntry[], era: "seireki" | "wareki"): string[] {
  return entries.map((entry) => {
    const date = era === "wareki" ? formatYearMonthWareki(entry) : formatYearMonth(entry);
    return `${date}　${entry.school}　${entry.event}`;
  });
}
