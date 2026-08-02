import { calcAge } from "@/utils/age";

export interface LongevityMilestone {
  key: string;
  name: string;
  /** 満年齢での基準。近年は満年齢で祝うのが一般的なため満年齢を採用（地域により数え年の場合もある）。 */
  age: number;
  description: string;
}

export const longevityMilestones: LongevityMilestone[] = [
  {
    key: "kanreki",
    name: "還暦",
    age: 60,
    description: "生まれた年の干支に60年で一巡して戻ることから「暦が還る」として祝う長寿祝い。",
  },
  { key: "koki", name: "古希", age: 70, description: "唐の詩人・杜甫の詩「人生七十古来稀なり」に由来する長寿祝い。" },
  { key: "kiju", name: "喜寿", age: 77, description: "「喜」の草書体が七十七のように見えることに由来する長寿祝い。" },
  { key: "sanju", name: "傘寿", age: 80, description: "「傘」の略字が八十のように見えることに由来する長寿祝い。" },
  { key: "beiju", name: "米寿", age: 88, description: "「米」の字を分解すると八十八になることに由来する長寿祝い。" },
  { key: "sotsuju", name: "卒寿", age: 90, description: "「卒」の略字「卆」が九十のように見えることに由来する長寿祝い。" },
  { key: "hakuju", name: "白寿", age: 99, description: "「百」から一を引くと「白」になることに由来する長寿祝い。" },
  { key: "hyakuju", name: "百寿（紀寿）", age: 100, description: "満100歳を迎える節目の長寿祝い。1世紀にちなみ「紀寿」とも呼ばれる。" },
];

export interface LongevityStatus {
  milestone: LongevityMilestone;
  reached: boolean;
  targetYear: number;
}

/** 生年月日から、8つの長寿祝いそれぞれについて到達済みかどうかを算出する。 */
export function calcLongevityStatuses(birthDate: Date, atDate: Date = new Date()): LongevityStatus[] {
  const currentAge = calcAge(birthDate, atDate);
  return longevityMilestones.map((milestone) => ({
    milestone,
    reached: currentAge >= milestone.age,
    targetYear: birthDate.getFullYear() + milestone.age,
  }));
}

export function findNextLongevityMilestone(statuses: LongevityStatus[]): LongevityStatus | null {
  return statuses.find((s) => !s.reached) ?? null;
}
