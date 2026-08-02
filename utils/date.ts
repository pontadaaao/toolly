export type SchoolType = "elementary" | "junior-high" | "high-school" | "university";

export const schoolDurations: Record<SchoolType, number> = {
  elementary: 6,
  "junior-high": 3,
  "high-school": 3,
  university: 4,
};

export const schoolLabels: Record<SchoolType, string> = {
  elementary: "小学校",
  "junior-high": "中学校",
  "high-school": "高校",
  university: "大学",
};

const schoolOrder: SchoolType[] = ["elementary", "junior-high", "high-school", "university"];

/**
 * Computes the graduation date given an enrollment year/month and school type.
 * Japanese schools typically run April–March, so graduation falls on the last
 * day of the month before the enrollment month, `duration` years later.
 */
export function calcGraduationDate(enrollmentYear: number, enrollmentMonth: number, schoolType: SchoolType): Date {
  const duration = schoolDurations[schoolType];
  const date = new Date(enrollmentYear + duration, enrollmentMonth - 1, 1);
  date.setDate(0); // rolls back to the last day of the previous month
  return date;
}

export interface SchoolPeriod {
  type: SchoolType;
  entranceDate: Date;
  graduationDate: Date;
}

/**
 * Computes elementary-through-university entrance/graduation dates from a birth date.
 * Japan's school-year cutoff is April 2: a child must turn 6 on or before
 * April 1 to enroll that April, so anyone born April 2 or later enrolls the
 * following year (this is what makes 早生まれ / 遅生まれ differ by a year).
 */
export function calcSchoolTimeline(birthDate: Date): SchoolPeriod[] {
  const birthYear = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const bornBeforeCutoff = month < 4 || (month === 4 && day === 1);
  let entranceYear = birthYear + (bornBeforeCutoff ? 6 : 7);

  return schoolOrder.map((type) => {
    const entranceDate = new Date(entranceYear, 3, 1); // April 1
    const graduationDate = calcGraduationDate(entranceYear, 4, type);
    entranceYear += schoolDurations[type];
    return { type, entranceDate, graduationDate };
  });
}

export function formatDateJa(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/** Formats a date using the Japanese imperial era calendar (令和/平成/昭和 etc.) */
export function formatDateWareki(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP-u-ca-japanese", {
    era: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
