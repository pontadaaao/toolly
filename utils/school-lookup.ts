import { calcSchoolTimeline, schoolLabels } from "@/utils/date";

export interface EnrollmentStage {
  key: string;
  label: string;
  entranceDate: Date | null;
  graduationDate: Date | null;
  note?: string;
}

/**
 * 幼稚園（3年保育）の入園日。小学校と同じ4月2日カットオフで
 * 「満3歳になった年度の4月」に入園する前提で算出する。
 */
function calcKindergartenEntranceDate(birthDate: Date): Date {
  const birthYear = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const bornBeforeCutoff = month < 4 || (month === 4 && day === 1);
  const entranceYear = birthYear + (bornBeforeCutoff ? 3 : 4);
  return new Date(entranceYear, 3, 1);
}

/** 幼稚園〜大学卒業までの入園・入学・卒業予定日をまとめて算出する。 */
export function calcEnrollmentTimeline(birthDate: Date): EnrollmentStage[] {
  const kindergartenEntrance = calcKindergartenEntranceDate(birthDate);
  const kindergartenGraduation = new Date(kindergartenEntrance.getFullYear() + 3, 2, 31);

  const stages: EnrollmentStage[] = [
    {
      key: "kindergarten",
      label: "幼稚園",
      entranceDate: kindergartenEntrance,
      graduationDate: kindergartenGraduation,
    },
  ];

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
