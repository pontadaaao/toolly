import { applyRounding, type RoundingMode } from "@/utils/tax";

export interface WarikanResult {
  /** 1人あたりの支払額（端数処理後）。 */
  perPerson: number;
  /** 実際に支払う人数（幹事を無料にする場合は全体人数−1）。 */
  payingCount: number;
  /** 1人あたり金額 × 支払い人数。 */
  totalCollected: number;
  /**
   * 合計金額 − 実際の徴収額。
   * 正の値 = 端数処理により不足（誰か・幹事が追加負担）。
   * 負の値 = 端数処理により超過（お釣りが出る）。
   */
  difference: number;
}

export function calcWarikan(
  totalAmount: number,
  peopleCount: number,
  rounding: RoundingMode,
  organizerFree: boolean
): WarikanResult {
  const payingCount = organizerFree ? Math.max(peopleCount - 1, 1) : peopleCount;
  const perPerson = applyRounding(totalAmount / payingCount, rounding);
  const totalCollected = perPerson * payingCount;
  const difference = totalAmount - totalCollected;

  return { perPerson, payingCount, totalCollected, difference };
}
