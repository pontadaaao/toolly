export type EmploymentType = "full-time" | "contract" | "temp-staff" | "part-time" | "freelance";

export const employmentTypeLabels: Record<EmploymentType, string> = {
  "full-time": "正社員",
  contract: "契約社員",
  "temp-staff": "派遣",
  "part-time": "パート・アルバイト",
  freelance: "フリーランス",
};

export interface TakeHomeInput {
  annualGross: number;
  employmentType: EmploymentType;
  healthInsuranceRate: number;
}

export interface TakeHomeResult {
  annualGross: number;
  socialInsurance: number;
  incomeTax: number;
  residentTax: number;
  takeHome: number;
}

const PENSION_RATE_EMPLOYEE = 0.183 / 2; // 厚生年金 employee share
const EMPLOYMENT_INSURANCE_RATE = 0.006;
const FREELANCE_NATIONAL_PENSION_ANNUAL = 200000; // 国民年金 flat annual amount (approx)
const BASIC_DEDUCTION = 480000;
const RECONSTRUCTION_SURTAX = 1.021;
const RESIDENT_TAX_RATE = 0.1;
const RESIDENT_TAX_FLAT = 5000; // 均等割 approx

/** 給与所得控除 (2020年分以降の速算表) */
function employmentIncomeDeduction(gross: number): number {
  if (gross <= 1_625_000) return 550_000;
  if (gross <= 1_800_000) return Math.max(gross * 0.4 - 100_000, 550_000);
  if (gross <= 3_600_000) return gross * 0.3 + 80_000;
  if (gross <= 6_600_000) return gross * 0.2 + 440_000;
  if (gross <= 8_500_000) return gross * 0.1 + 1_100_000;
  return 1_950_000;
}

/** 所得税の速算表（復興特別所得税を含まない） */
function progressiveIncomeTax(taxableIncome: number): number {
  const brackets = [
    { limit: 1_950_000, rate: 0.05, deduction: 0 },
    { limit: 3_300_000, rate: 0.1, deduction: 97_500 },
    { limit: 6_950_000, rate: 0.2, deduction: 427_500 },
    { limit: 9_000_000, rate: 0.23, deduction: 636_000 },
    { limit: 18_000_000, rate: 0.33, deduction: 1_536_000 },
    { limit: 40_000_000, rate: 0.4, deduction: 2_796_000 },
    { limit: Infinity, rate: 0.45, deduction: 4_796_000 },
  ];
  const bracket = brackets.find((b) => taxableIncome <= b.limit) ?? brackets[brackets.length - 1];
  return Math.max(taxableIncome * bracket.rate - bracket.deduction, 0);
}

/**
 * A simplified take-home pay estimate. Real amounts vary with dependents,
 * deductions and specific insurance plans — treat this as a rough guide only.
 */
export function calcTakeHomePay({ annualGross, employmentType, healthInsuranceRate }: TakeHomeInput): TakeHomeResult {
  const isFreelance = employmentType === "freelance";

  const socialInsurance = isFreelance
    ? annualGross * 0.1 + FREELANCE_NATIONAL_PENSION_ANNUAL
    : annualGross * (healthInsuranceRate / 2 + PENSION_RATE_EMPLOYEE + EMPLOYMENT_INSURANCE_RATE);

  const deduction = isFreelance ? 0 : employmentIncomeDeduction(annualGross);
  const taxableIncome = Math.max(annualGross - socialInsurance - deduction - BASIC_DEDUCTION, 0);

  const incomeTax = progressiveIncomeTax(taxableIncome) * RECONSTRUCTION_SURTAX;
  const residentTax = taxableIncome > 0 ? taxableIncome * RESIDENT_TAX_RATE + RESIDENT_TAX_FLAT : 0;

  const takeHome = annualGross - socialInsurance - incomeTax - residentTax;

  return {
    annualGross,
    socialInsurance: Math.round(socialInsurance),
    incomeTax: Math.round(incomeTax),
    residentTax: Math.round(residentTax),
    takeHome: Math.round(takeHome),
  };
}
