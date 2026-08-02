export type EtoSign = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";

export interface EtoInfo {
  sign: EtoSign;
  reading: string;
  animal: string;
  englishName: string;
}

const etoOrder: EtoInfo[] = [
  { sign: "子", reading: "ね", animal: "ねずみ", englishName: "Rat" },
  { sign: "丑", reading: "うし", animal: "うし", englishName: "Ox" },
  { sign: "寅", reading: "とら", animal: "とら", englishName: "Tiger" },
  { sign: "卯", reading: "う", animal: "うさぎ", englishName: "Rabbit" },
  { sign: "辰", reading: "たつ", animal: "たつ（りゅう）", englishName: "Dragon" },
  { sign: "巳", reading: "み", animal: "へび", englishName: "Snake" },
  { sign: "午", reading: "うま", animal: "うま", englishName: "Horse" },
  { sign: "未", reading: "ひつじ", animal: "ひつじ", englishName: "Sheep" },
  { sign: "申", reading: "さる", animal: "さる", englishName: "Monkey" },
  { sign: "酉", reading: "とり", animal: "とり", englishName: "Rooster" },
  { sign: "戌", reading: "いぬ", animal: "いぬ", englishName: "Dog" },
  { sign: "亥", reading: "い", animal: "いのしし", englishName: "Boar" },
];

/** 三合（相性が良いとされる4年おきの干支の組み合わせ）。参考情報として扱う。 */
const trineGroups: EtoSign[][] = [
  ["申", "子", "辰"],
  ["巳", "酉", "丑"],
  ["寅", "午", "戌"],
  ["亥", "卯", "未"],
];

export function calcEtoIndex(year: number): number {
  return (((year - 4) % 12) + 12) % 12;
}

export function calcEto(year: number): EtoInfo {
  return etoOrder[calcEtoIndex(year)];
}

/** 三合の関係にある、相性が良いとされる干支（参考情報）。 */
export function calcEtoCompatibility(sign: EtoSign): EtoInfo[] {
  const group = trineGroups.find((g) => g.includes(sign));
  if (!group) return [];
  return group.filter((s) => s !== sign).map((s) => etoOrder.find((e) => e.sign === s)!);
}

export const etoExplanation =
  "十二支は、子・丑・寅・卯・辰・巳・午・未・申・酉・戌・亥の12種の動物で年を数える中国由来の暦法で、日本でも年賀状や方角、時刻の表現などに広く使われています。生まれた年の干支は12年に一度巡ってきます。";
