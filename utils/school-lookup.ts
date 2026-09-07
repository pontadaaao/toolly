import { calcSchoolTimeline, schoolLabels } from "@/utils/date";

export interface EnrollmentStage {
  key: string;
  label: string;
  entranceDate: Date | null;
  graduationDate: Date | null;
  note?: string;
}

/** 就学前にどこへ通うかで、早見表の最初の数行が変わる。 */
export const preschoolOptions = {
  kindergarten3: { label: "幼稚園（3年保育）", years: 3 },
  kindergarten2: { label: "幼稚園（2年保育）", years: 2 },
  nursery: { label: "保育園・認定こども園", years: 0 },
} as const;

export type PreschoolKey = keyof typeof preschoolOptions;

/**
 * 年度の初日（4月1日）時点で満0歳になる年度。保育園・こども園のクラス編成も、
 * 小学校の学年も同じ4月2日カットオフで決まるため、ここを起点に数えれば
 * 「◯歳児クラス」と入学年度が必ず整合する。
 */
function zeroYearOldFiscalYear(birthDate: Date): number {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const bornBeforeCutoff = month < 4 || (month === 4 && day === 1);
  return birthDate.getFullYear() + (bornBeforeCutoff ? 0 : 1);
}

/**
 * 幼稚園の入園日。満3歳（3年保育）または満4歳（2年保育）になった年度の4月に
 * 入園する前提で算出する。
 */
function calcKindergartenEntranceDate(birthDate: Date, years: number): Date {
  const entranceYear = zeroYearOldFiscalYear(birthDate) + (6 - years);
  return new Date(entranceYear, 3, 1);
}

export interface NurseryClass {
  /** 4月1日時点の満年齢。 */
  age: number;
  label: string;
  /** クラスが始まる年度（西暦）。 */
  fiscalYear: number;
}

/**
 * 保育園・認定こども園の0歳児クラス〜5歳児クラスが、それぞれ何年度にあたるかを返す。
 * クラスは「その年度の4月1日時点の満年齢」で決まる。
 */
export function calcNurseryClasses(birthDate: Date): NurseryClass[] {
  const base = zeroYearOldFiscalYear(birthDate);
  return Array.from({ length: 6 }, (_, age) => ({
    age,
    label: `${age}歳児クラス`,
    fiscalYear: base + age,
  }));
}

/** 就学前〜大学卒業までの入園・入学・卒業予定日をまとめて算出する。 */
export function calcEnrollmentTimeline(
  birthDate: Date,
  preschool: PreschoolKey = "kindergarten3"
): EnrollmentStage[] {
  const stages: EnrollmentStage[] = [];
  const option = preschoolOptions[preschool];

  if (option.years > 0) {
    const entrance = calcKindergartenEntranceDate(birthDate, option.years);
    stages.push({
      key: "kindergarten",
      label: option.label,
      entranceDate: entrance,
      graduationDate: new Date(entrance.getFullYear() + option.years, 2, 31),
    });
  } else {
    // 保育園・こども園は年度ごとのクラスで進むため、0歳児クラスの開始から
    // 5歳児クラスの終了までを1行にまとめて示す。
    const classes = calcNurseryClasses(birthDate);
    const first = classes[0];
    const last = classes[classes.length - 1];
    stages.push({
      key: "nursery",
      label: option.label,
      entranceDate: new Date(first.fiscalYear, 3, 1),
      graduationDate: new Date(last.fiscalYear + 1, 2, 31),
    });
  }

  for (const period of calcSchoolTimeline(birthDate)) {
    stages.push({
      key: period.type,
      label: schoolLabels[period.type],
      entranceDate: period.entranceDate,
      graduationDate: period.graduationDate,
    });
  }

  return stages;
}
