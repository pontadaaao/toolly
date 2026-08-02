import { applyRounding, type RoundingMode } from "@/utils/tax";

export type TripType = "oneway" | "round";

export interface GasolineInput {
  distance: number;
  fuelEconomy: number;
  pricePerLiter: number;
  tripType: TripType;
  passengers: number;
  highwayFee: number;
  parkingFee: number;
  otherFee: number;
  rounding: RoundingMode;
}

export interface GasolineResult {
  totalDistance: number;
  fuelUsed: number;
  gasolineCost: number;
  highwayFee: number;
  parkingFee: number;
  otherFee: number;
  totalCost: number;
  perPerson: number;
}

/**
 * 使用ガソリン量 = 走行距離 ÷ 燃費
 * ガソリン代 = 使用ガソリン量 × ガソリン単価
 * 合計交通費 = ガソリン代 + 高速道路料金 + 駐車料金 + その他の費用
 * 1人あたり = 合計交通費 ÷ 乗車人数
 */
export function calcGasolineCost(input: GasolineInput): GasolineResult {
  const totalDistance = input.tripType === "round" ? input.distance * 2 : input.distance;
  const fuelUsed = totalDistance / input.fuelEconomy;
  const gasolineCost = applyRounding(fuelUsed * input.pricePerLiter, input.rounding);
  const totalCost = gasolineCost + input.highwayFee + input.parkingFee + input.otherFee;
  const perPerson = applyRounding(totalCost / Math.max(input.passengers, 1), input.rounding);

  return {
    totalDistance,
    fuelUsed,
    gasolineCost,
    highwayFee: input.highwayFee,
    parkingFee: input.parkingFee,
    otherFee: input.otherFee,
    totalCost,
    perPerson,
  };
}
