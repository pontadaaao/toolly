/**
 * 年収 ⇄ 時給の相互換算。すべて額面（税引き前）金額として扱う（手取りではない）。
 * 実際の金額は税金・社会保険・勤務先の就業規則等により変動する目安値。
 */

export interface AnnualToHourlyInput {
  annualIncome: number;
  annualBonus: number;
  dailyHours: number;
  weeklyDays: number;
  annualHolidays: number;
  annualPaidLeave: number;
  monthlyOvertimeHours: number;
  includeOvertime: boolean;
}

export interface AnnualToHourlyResult {
  monthlyIncome: number;
  dailyWage: number;
  /** 表示上のメイン時給（includeOvertimeに応じて残業込み/除くを切り替え）。 */
  hourlyWage: number;
  workingDaysPerYear: number;
  annualWorkingHours: number;
  hourlyExcludingBonus: number;
  hourlyIncludingBonus: number;
}

export function calcHourlyFromAnnual(input: AnnualToHourlyInput): AnnualToHourlyResult {
  const workingDaysPerYear = Math.max(365 - input.annualHolidays - input.annualPaidLeave, 0);
  const baseAnnualHours = workingDaysPerYear * input.dailyHours;
  const overtimeAnnualHours = input.monthlyOvertimeHours * 12;
  const annualWorkingHours = baseAnnualHours + (input.includeOvertime ? overtimeAnnualHours : 0);

  const totalIncomeIncludingBonus = input.annualIncome + input.annualBonus;
  const hourlyExcludingBonus = baseAnnualHours > 0 ? input.annualIncome / baseAnnualHours : 0;
  const hourlyIncludingBonus = baseAnnualHours > 0 ? totalIncomeIncludingBonus / baseAnnualHours : 0;
  const hourlyWage = annualWorkingHours > 0 ? totalIncomeIncludingBonus / annualWorkingHours : 0;

  return {
    monthlyIncome: input.annualIncome / 12,
    dailyWage: workingDaysPerYear > 0 ? input.annualIncome / workingDaysPerYear : 0,
    hourlyWage,
    workingDaysPerYear,
    annualWorkingHours,
    hourlyExcludingBonus,
    hourlyIncludingBonus,
  };
}

export interface HourlyToAnnualInput {
  hourlyWage: number;
  dailyHours: number;
  weeklyDays: number;
  annualWorkingDays: number;
  monthlyOvertimeHours: number;
  overtimeHourlyWage: number;
  annualBonus: number;
  allowances: number;
}

export interface HourlyToAnnualResult {
  dailyWage: number;
  weeklyWage: number;
  monthlyIncome: number;
  annualIncome: number;
  overtimePay: number;
  annualIncomeWithBonus: number;
  annualIncomeWithAllowances: number;
}

export function calcAnnualFromHourly(input: HourlyToAnnualInput): HourlyToAnnualResult {
  const dailyWage = input.hourlyWage * input.dailyHours;
  const weeklyWage = dailyWage * input.weeklyDays;
  const baseAnnualIncome = input.hourlyWage * input.dailyHours * input.annualWorkingDays;
  const overtimePay = input.overtimeHourlyWage * input.monthlyOvertimeHours * 12;
  const annualIncome = baseAnnualIncome + overtimePay;
  const annualIncomeWithBonus = annualIncome + input.annualBonus;
  const annualIncomeWithAllowances = annualIncomeWithBonus + input.allowances;

  return {
    dailyWage,
    weeklyWage,
    monthlyIncome: baseAnnualIncome / 12,
    annualIncome,
    overtimePay,
    annualIncomeWithBonus,
    annualIncomeWithAllowances,
  };
}
