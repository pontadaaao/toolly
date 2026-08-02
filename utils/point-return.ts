import { applyRounding, type RoundingMode } from "@/utils/tax";

export type PointBasisMode = "beforeCoupon" | "afterCoupon";

export interface PointReturnInput {
  purchaseAmount: number;
  pointRate: number;
  pointMultiplier: number;
  pointValue: number;
  pointsUsed: number;
  couponAmount: number;
  basisMode: PointBasisMode;
  includeUsedPointsInBasis: boolean;
  rounding: RoundingMode;
}

export interface PointReturnResult {
  /** ポイント付与対象金額。 */
  basisAmount: number;
  /** 倍率適用前の獲得ポイント。 */
  normalPoints: number;
  /** 倍率適用後の獲得ポイント。 */
  earnedPoints: number;
  earnedPointsValue: number;
  couponAppliedAmount: number;
  actualPayment: number;
  effectiveBurden: number;
  effectiveReturnRate: number;
}

/**
 * 獲得ポイント = 付与対象金額 × 還元率 ÷ 100（倍率がある場合はさらに×倍率）
 * ポイントの金額換算 = 獲得ポイント × 1ポイントの価値
 * 実質負担額 = 実際の支払額 − 獲得ポイントの金額換算
 * 実質還元率 = 獲得ポイントの金額換算 ÷ 実際の支払額 × 100
 */
export function calcPointReturn(input: PointReturnInput): PointReturnResult {
  const couponAppliedAmount = Math.max(input.purchaseAmount - input.couponAmount, 0);
  const usedPointsValue = input.pointsUsed * input.pointValue;

  let basisAmount = input.basisMode === "beforeCoupon" ? input.purchaseAmount : couponAppliedAmount;
  if (!input.includeUsedPointsInBasis) {
    basisAmount = Math.max(basisAmount - usedPointsValue, 0);
  }

  const normalPoints = applyRounding((basisAmount * input.pointRate) / 100, input.rounding);
  const earnedPoints = applyRounding(normalPoints * input.pointMultiplier, input.rounding);
  const earnedPointsValue = earnedPoints * input.pointValue;

  const actualPayment = Math.max(couponAppliedAmount - usedPointsValue, 0);
  const effectiveBurden = actualPayment - earnedPointsValue;
  const effectiveReturnRate = actualPayment > 0 ? (earnedPointsValue / actualPayment) * 100 : 0;

  return {
    basisAmount,
    normalPoints,
    earnedPoints,
    earnedPointsValue,
    couponAppliedAmount,
    actualPayment,
    effectiveBurden,
    effectiveReturnRate,
  };
}

export const pointRateVsMultiplierExplanation =
  "「1%還元」は支払額そのものに対する還元率で、例えば10,000円の買い物なら100ポイント獲得します。一方「ポイント2倍」は普段の還元率（例：通常1%）を2倍にする仕組みで、通常1%の店舗なら2%相当（200ポイント）になります。倍率は「普段のポイント還元率」に掛け合わせるものなので、還元率そのものとは意味が異なります。";
