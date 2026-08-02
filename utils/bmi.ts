export interface BmiResult {
  bmi: number;
  judgment: string;
  standardWeight: number;
}

/** BMI and judgment based on the Japan Society for the Study of Obesity criteria. */
export function calcBmi(heightCm: number, weightKg: number): BmiResult {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const standardWeight = 22 * heightM * heightM;

  let judgment: string;
  if (bmi < 18.5) judgment = "低体重（やせ型）";
  else if (bmi < 25) judgment = "普通体重";
  else if (bmi < 30) judgment = "肥満（1度）";
  else if (bmi < 35) judgment = "肥満（2度）";
  else if (bmi < 40) judgment = "肥満（3度）";
  else judgment = "肥満（4度）";

  return { bmi, judgment, standardWeight };
}
