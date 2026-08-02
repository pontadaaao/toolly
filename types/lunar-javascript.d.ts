/**
 * `lunar-javascript` ships no TypeScript types. This declares only the
 * minimal surface used by `utils/rokuyo.ts` (solar → lunar month/day for the
 * 六曜 calculation).
 */
declare module "lunar-javascript" {
  export class Lunar {
    getMonth(): number;
    getDay(): number;
  }

  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    getLunar(): Lunar;
  }
}
