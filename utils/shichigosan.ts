import { calcKazoedoshi } from "@/utils/age";

export type Gender = "male" | "female";

/** それぞれの性別で一般的にお祝いする年齢。地域や家庭によっては男児も3歳で祝うなど差がある。 */
const genderAges: Record<Gender, number[]> = {
  male: [3, 5],
  female: [3, 7],
};

export interface ShichigosanCheck {
  age: 3 | 5 | 7;
  /** この性別で一般的にお祝いする年齢かどうか。 */
  applicable: boolean;
  /** 今年が対象年齢（数え年）かどうか。 */
  isTargetThisYear: boolean;
  /** 数え年でその年齢を迎える西暦年。 */
  targetYear: number;
}

/** 生年月日・性別から、3・5・7歳それぞれが今年の七五三の対象かどうかを判定する。 */
export function calcShichigosan(birthDate: Date, gender: Gender, atDate: Date = new Date()): ShichigosanCheck[] {
  const applicableAges = new Set(genderAges[gender]);
  const currentKazoedoshi = calcKazoedoshi(birthDate, atDate);

  return ([3, 5, 7] as const).map((age) => ({
    age,
    applicable: applicableAges.has(age),
    isTargetThisYear: currentKazoedoshi === age,
    targetYear: birthDate.getFullYear() + age - 1,
  }));
}

export const shichigosanExplanation =
  "七五三は、子どもの成長を祝い、これからの健やかな成長を祈る日本の伝統行事です。3歳は「髪置き」、5歳は「袴着」、7歳は「帯解き」という儀式に由来し、現在は男の子が3歳・5歳、女の子が3歳・7歳で祝うのが一般的です。年齢は数え年で数えるのが伝統的ですが、近年は満年齢でお祝いする家庭も増えています。";

export const shichigosanCelebrationTiming =
  "正式な七五三の日は11月15日ですが、現在は11月中の都合の良い日や、10月〜12月の週末にお参りする家庭がほとんどです。";

export const shichigosanShrineTiming =
  "混雑を避けたい場合は11月15日の前後の平日や、10月上旬〜中旬の「お日柄」の良い日（大安など）を選ぶのがおすすめです。";
