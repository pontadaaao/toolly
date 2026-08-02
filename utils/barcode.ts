export type BarcodeFormat = "CODE128" | "CODE39" | "EAN13" | "EAN8" | "UPC" | "ITF" | "ITF14" | "codabar";

export interface BarcodeFormatInfo {
  format: BarcodeFormat;
  label: string;
  /** Human-readable rule shown under the input and used in validation error text. */
  rule: string;
  placeholder: string;
  validate: (value: string) => boolean;
}

const digitsOnly = (v: string) => /^[0-9]+$/.test(v);

export const barcodeFormats: BarcodeFormatInfo[] = [
  {
    format: "CODE128",
    label: "CODE128",
    rule: "英数字・記号に対応（1文字以上）。桁数の制限はありません。",
    placeholder: "ABC-12345",
    validate: (v) => v.length > 0 && /^[\x00-\x7F]+$/.test(v),
  },
  {
    format: "CODE39",
    label: "CODE39",
    rule: "英大文字・数字・一部の記号（- . $ / + % スペース）に対応（1文字以上）。",
    placeholder: "CODE-39",
    validate: (v) => /^[0-9A-Z\-. $/+%]+$/.test(v) && v.length > 0,
  },
  {
    format: "EAN13",
    label: "EAN-13",
    rule: "数字12桁（チェックデジット自動計算）または13桁で入力してください。",
    placeholder: "490123456789",
    validate: (v) => digitsOnly(v) && (v.length === 12 || v.length === 13),
  },
  {
    format: "EAN8",
    label: "EAN-8",
    rule: "数字7桁（チェックデジット自動計算）または8桁で入力してください。",
    placeholder: "4901234",
    validate: (v) => digitsOnly(v) && (v.length === 7 || v.length === 8),
  },
  {
    format: "UPC",
    label: "UPC-A",
    rule: "数字11桁（チェックデジット自動計算）または12桁で入力してください。",
    placeholder: "03600029145",
    validate: (v) => digitsOnly(v) && (v.length === 11 || v.length === 12),
  },
  {
    format: "ITF",
    label: "ITF",
    rule: "偶数桁の数字（2桁以上）で入力してください。",
    placeholder: "1234",
    validate: (v) => digitsOnly(v) && v.length >= 2 && v.length % 2 === 0,
  },
  {
    format: "ITF14",
    label: "ITF-14",
    rule: "数字13桁（チェックデジット自動計算）または14桁で入力してください。",
    placeholder: "1234567890123",
    validate: (v) => digitsOnly(v) && (v.length === 13 || v.length === 14),
  },
  {
    format: "codabar",
    label: "Codabar",
    rule: "開始・終了記号（A〜D）で数字・一部記号を挟んで入力してください（例：A1234B）。",
    placeholder: "A1234B",
    validate: (v) => /^[A-Da-d][0-9\-$:/.+]+[A-Da-d]$/.test(v),
  },
];

export function getBarcodeFormatInfo(format: BarcodeFormat): BarcodeFormatInfo {
  return barcodeFormats.find((f) => f.format === format) ?? barcodeFormats[0];
}

export function validateBarcodeValue(format: BarcodeFormat, value: string): string | undefined {
  if (!value) return "バーコードにする文字または数字を入力してください。";
  const info = getBarcodeFormatInfo(format);
  if (!info.validate(value)) return `入力形式が正しくありません。${info.rule}`;
  return undefined;
}
