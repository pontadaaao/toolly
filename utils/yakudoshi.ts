export type Gender = "male" | "female";

/** 本厄の年齢（数え年）。神社や地域によって多少異なる場合がある一般的な基準値。 */
const honyakuAges: Record<Gender, number[]> = {
  male: [25, 42, 61],
  female: [19, 33, 37, 61],
};

function isDaiyaku(gender: Gender, honyakuAge: number): boolean {
  return (gender === "male" && honyakuAge === 42) || (gender === "female" && honyakuAge === 33);
}

export interface YakudoshiPeriod {
  /** 本厄の数え年齢。 */
  honyakuAge: number;
  maeyakuYear: number;
  honyakuYear: number;
  atoyakuYear: number;
  /** 大厄（男性42歳・女性33歳）かどうか。 */
  isDaiyaku: boolean;
}

/** 生まれ年・性別から、生涯の前厄・本厄・後厄（西暦年）一覧を算出する。 */
export function calcYakudoshiPeriods(birthYear: number, gender: Gender): YakudoshiPeriod[] {
  return honyakuAges[gender].map((honyakuAge) => {
    // 数え年 = 対象年 - birthYear + 1 なので、本厄の年は birthYear + honyakuAge - 1
    const honyakuYear = birthYear + honyakuAge - 1;
    return {
      honyakuAge,
      maeyakuYear: honyakuYear - 1,
      honyakuYear,
      atoyakuYear: honyakuYear + 1,
      isDaiyaku: isDaiyaku(gender, honyakuAge),
    };
  });
}

export type YakudoshiPhase = "前厄" | "本厄" | "後厄";

export interface YakudoshiStatus {
  periods: YakudoshiPeriod[];
  current: { period: YakudoshiPeriod; phase: YakudoshiPhase } | null;
  next: YakudoshiPeriod | null;
}

export function calcYakudoshiStatus(birthDate: Date, gender: Gender, atDate: Date = new Date()): YakudoshiStatus {
  const periods = calcYakudoshiPeriods(birthDate.getFullYear(), gender);
  const currentYear = atDate.getFullYear();

  let current: YakudoshiStatus["current"] = null;
  for (const period of periods) {
    if (period.maeyakuYear === currentYear) current = { period, phase: "前厄" };
    else if (period.honyakuYear === currentYear) current = { period, phase: "本厄" };
    else if (period.atoyakuYear === currentYear) current = { period, phase: "後厄" };
  }

  const next = periods.find((p) => p.maeyakuYear > currentYear) ?? null;

  return { periods, current, next };
}

export const yakudoshiExplanation =
  "厄年とは、人生の節目で体調や環境の変化が起こりやすいとされる、日本古来の風習に基づく年齢の目安です。本厄の前後1年を「前厄」「後厄」と呼び、あわせて3年間は無理をせず過ごすと良いとされています。科学的な根拠はなく、必ず良くないことが起こるという意味ではありません。平安時代から続く風習として、今も神社仏閣での厄払い・厄除けを受ける人がいます。";

export const yakudoshiRecommendedTiming =
  "正月から節分（2月3日頃）までにお祓いを受けるのが良いとされていますが、誕生日など区切りの良い日に受ける方も増えています。";

export const yakudoshiCaution =
  "厄年の年齢や考え方は地域・神社・寺院・宗派によって異なる場合があります。気になる場合は、無理に不安を感じる必要はありませんが、お近くの神社・寺院へ相談されることをおすすめします。";
