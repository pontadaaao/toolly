export type UrlCodecMode = "full" | "param" | "japanese";

export const urlCodecModeLabels: Record<UrlCodecMode, string> = {
  full: "URL全体",
  param: "URLパラメータ",
  japanese: "日本語文字列",
};

export interface CodecResult {
  value: string;
  error?: string;
}

/**
 * URL全体モードは`encodeURI`/`decodeURI`（`: / ? & = #`などURLの構造記号は
 * 保持し、日本語やスペースなど安全でない文字だけを変換する）を、それ以外は
 * `encodeURIComponent`/`decodeURIComponent`（記号もすべて変換する）を使う。
 */
export function encodeText(text: string, mode: UrlCodecMode): CodecResult {
  try {
    return { value: mode === "full" ? encodeURI(text) : encodeURIComponent(text) };
  } catch {
    return { value: "", error: "エンコードできない文字が含まれています。" };
  }
}

export function decodeText(text: string, mode: UrlCodecMode): CodecResult {
  try {
    return { value: mode === "full" ? decodeURI(text) : decodeURIComponent(text) };
  } catch {
    return { value: "", error: "不正なエンコード文字列です。「%」の後に正しい16進数2桁が続いているか確認してください。" };
  }
}

export const urlCodecExamples: Record<UrlCodecMode, string> = {
  full: "https://example.com/検索?q=東京 タワー",
  param: "東京 タワー & カフェ",
  japanese: "こんにちは、世界！",
};

export const urlCodecModeExplanation: Record<UrlCodecMode, string> = {
  full: "「URL全体」は encodeURI/decodeURI を使用します。「://」「/」「?」「&」「=」「#」などURLの構造を表す記号はそのまま残し、日本語やスペースなど安全でない文字だけをエンコードします。URL全体をそのまま変換したいときに使います。",
  param: "「URLパラメータ」は encodeURIComponent/decodeURIComponent を使用します。&・=・?・#を含むすべての記号をエンコードするため、クエリパラメータの値などURLの一部品として安全に埋め込みたい文字列に使ってください。",
  japanese: "「日本語文字列」はURLパラメータと同じ encodeURIComponent/decodeURIComponent を使用する、日本語テキストの変換に特化したモードです。",
};
