import { formatWarekiYears } from "@/utils/wareki";

export interface AgeTableRow {
  birthYear: number;
  warekiLabel: string;
  /** 誕生日を迎える前の満年齢（その年の誕生日がまだ来ていない場合）。 */
  ageBeforeBirthday: number;
  /** 誕生日を迎えた後の満年齢。 */
  ageAfterBirthday: number;
  /** 数え年（生まれた年を1歳とし、元日ごとに+1）。 */
  kazoedoshi: number;
}

/** 年齢早見表の全行を生成する。0歳（今年生まれ）〜maxAge歳分、生まれ年の新しい順。 */
export function buildAgeTable(currentYear: number, maxAge = 105): AgeTableRow[] {
  const rows: AgeTableRow[] = [];
  for (let ageAfterBirthday = 0; ageAfterBirthday <= maxAge; ageAfterBirthday++) {
    const birthYear = currentYear - ageAfterBirthday;
    rows.push({
      birthYear,
      warekiLabel: formatWarekiYears(birthYear),
      ageBeforeBirthday: Math.max(ageAfterBirthday - 1, 0),
      ageAfterBirthday,
      kazoedoshi: ageAfterBirthday + 1,
    });
  }
  return rows;
}
