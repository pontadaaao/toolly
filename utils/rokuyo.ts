import { Solar } from "lunar-javascript";

export type Rokuyo = "先勝" | "友引" | "先負" | "仏滅" | "大安" | "赤口";

/** (旧暦の月+日) % 6 の余りに対応する六曜。0=大安〜5=仏滅。 */
const rokuyoByRemainder: Rokuyo[] = ["大安", "赤口", "先勝", "友引", "先負", "仏滅"];

export type RokuyoActivity = "wedding" | "moving" | "carDelivery" | "businessOpening" | "shrineVisit" | "contract";
export type Suitability = "good" | "caution" | "bad";

export const rokuyoActivityLabels: Record<RokuyoActivity, string> = {
  wedding: "結婚",
  moving: "引越し",
  carDelivery: "納車",
  businessOpening: "開業",
  shrineVisit: "お参り",
  contract: "契約",
};

export interface RokuyoDetail {
  name: Rokuyo;
  reading: string;
  meaning: string;
  suitability: Record<RokuyoActivity, Suitability>;
}

export const rokuyoDetails: Record<Rokuyo, RokuyoDetail> = {
  先勝: {
    name: "先勝",
    reading: "せんしょう",
    meaning: "「先んずれば即ち勝つ」という意味の日。午前中は吉、午後2時〜6時は凶とされ、急ぎごとに向いています。",
    suitability: {
      wedding: "good",
      moving: "good",
      carDelivery: "good",
      businessOpening: "good",
      shrineVisit: "good",
      contract: "good",
    },
  },
  友引: {
    name: "友引",
    reading: "ともびき",
    meaning: "「友を引く」に由来し慶事に好まれる日。葬儀は「友を引く」として避けられます。朝夕は吉、正午は凶とされます。",
    suitability: {
      wedding: "good",
      moving: "good",
      carDelivery: "good",
      businessOpening: "good",
      shrineVisit: "good",
      contract: "good",
    },
  },
  先負: {
    name: "先負",
    reading: "せんぶ",
    meaning: "「先んずれば負ける」という意味の日。午前は凶、午後は吉とされ、控えめに過ごすのが良いとされる日です。",
    suitability: {
      wedding: "caution",
      moving: "caution",
      carDelivery: "caution",
      businessOpening: "caution",
      shrineVisit: "caution",
      contract: "caution",
    },
  },
  仏滅: {
    name: "仏滅",
    reading: "ぶつめつ",
    meaning: "六曜の中で最も凶とされる日。「仏も滅するほどの凶日」とされ、祝い事は避けられる傾向にあります。",
    suitability: {
      wedding: "bad",
      moving: "bad",
      carDelivery: "bad",
      businessOpening: "bad",
      shrineVisit: "bad",
      contract: "bad",
    },
  },
  大安: {
    name: "大安",
    reading: "たいあん",
    meaning: "六曜の中で最も吉とされる日。何事も成功しやすいとされ、結婚式や契約ごとに人気の日です。",
    suitability: {
      wedding: "good",
      moving: "good",
      carDelivery: "good",
      businessOpening: "good",
      shrineVisit: "good",
      contract: "good",
    },
  },
  赤口: {
    name: "赤口",
    reading: "しゃっこう",
    meaning: "「赤」が火や血を連想させ、凶事に注意すべき日とされています。正午前後のみ吉で、それ以外の時間は凶とされます。",
    suitability: {
      wedding: "bad",
      moving: "bad",
      carDelivery: "caution",
      businessOpening: "bad",
      shrineVisit: "caution",
      contract: "bad",
    },
  },
};

/**
 * 指定した日の六曜を算出する。伝統的な六曜は旧暦の月+日の合計を6で割った
 * 余りで決まるため、まず`lunar-javascript`で旧暦（太陰太陽暦）の月日に
 * 変換してから判定する（閏月は`getMonth()`が負値を返すため絶対値を使う）。
 */
export function calcRokuyo(date: Date): Rokuyo {
  const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const lunar = solar.getLunar();
  const lunarMonth = Math.abs(lunar.getMonth());
  const lunarDay = lunar.getDay();
  const remainder = (lunarMonth + lunarDay) % 6;
  return rokuyoByRemainder[remainder];
}
