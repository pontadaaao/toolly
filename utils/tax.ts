export type RoundingMode = "round" | "ceil" | "floor";

export function applyRounding(value: number, mode: RoundingMode): number {
  if (mode === "ceil") return Math.ceil(value);
  if (mode === "floor") return Math.floor(value);
  return Math.round(value);
}

export interface ConsumptionTaxResult {
  taxExcluded: number;
  taxIncluded: number;
  taxAmount: number;
}

export function calcFromTaxExcluded(amount: number, rate: number, mode: RoundingMode): ConsumptionTaxResult {
  const taxAmount = applyRounding(amount * rate, mode);
  return { taxExcluded: amount, taxIncluded: amount + taxAmount, taxAmount };
}

export function calcFromTaxIncluded(amount: number, rate: number, mode: RoundingMode): ConsumptionTaxResult {
  const taxExcluded = applyRounding(amount / (1 + rate), mode);
  return { taxExcluded, taxIncluded: amount, taxAmount: amount - taxExcluded };
}
