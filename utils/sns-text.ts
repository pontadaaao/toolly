/**
 * Text helpers for the SNS/creator tools.
 *
 * Instagram (and several other apps) collapse blank lines and lines that end in
 * whitespace when a caption is pasted into the composer. The usual workaround is
 * to put one invisible-but-not-whitespace character on each otherwise empty
 * line, which the app then has to keep.
 */

export const invisibleChars = {
  braille: { char: "⠀", label: "ブライユ空白（推奨）" },
  hangul: { char: "ㅤ", label: "ハングル・フィラー" },
  ideographic: { char: "　", label: "全角スペース" },
} as const;

export type InvisibleCharKey = keyof typeof invisibleChars;

export interface FormatCaptionOptions {
  /** Put an invisible character on blank lines so the app keeps them. */
  keepBlankLines: boolean;
  /** Strip whitespace at the end of each line, which also eats line breaks. */
  trimLineEnds: boolean;
  /** Collapse runs of 3+ blank lines down to 2. */
  limitConsecutiveBlanks: boolean;
  invisibleChar: InvisibleCharKey;
}

export interface FormatCaptionResult {
  text: string;
  /** How many blank lines were filled with an invisible character. */
  filledLines: number;
  /** How many lines had trailing whitespace removed. */
  trimmedLines: number;
  /** How many surplus blank lines were dropped. */
  removedLines: number;
}

/** True when a line has nothing but whitespace (or one of our invisible chars). */
function isBlankLine(line: string): boolean {
  const invisible = Object.values(invisibleChars).map((c) => c.char);
  const stripped = [...line].filter((c) => !invisible.includes(c as never)).join("");
  return stripped.trim() === "";
}

/** Rewrites a caption so its line breaks survive being pasted into Instagram. */
export function formatCaption(input: string, options: FormatCaptionOptions): FormatCaptionResult {
  if (!input) return { text: "", filledLines: 0, trimmedLines: 0, removedLines: 0 };

  // Normalise CRLF/CR so the line count matches what the user sees.
  let lines = input.replace(/\r\n?/g, "\n").split("\n");

  let removedLines = 0;
  if (options.limitConsecutiveBlanks) {
    const capped: string[] = [];
    let blankRun = 0;
    for (const line of lines) {
      if (isBlankLine(line)) {
        blankRun++;
        if (blankRun > 2) {
          removedLines++;
          continue;
        }
      } else {
        blankRun = 0;
      }
      capped.push(line);
    }
    lines = capped;
  }

  let trimmedLines = 0;
  let filledLines = 0;
  const filler = invisibleChars[options.invisibleChar].char;

  const output = lines.map((line) => {
    let next = line;

    if (options.trimLineEnds) {
      const trimmed = next.replace(/[ \t　]+$/, "");
      if (trimmed !== next) trimmedLines++;
      next = trimmed;
    }

    if (options.keepBlankLines && isBlankLine(next)) {
      filledLines++;
      return filler;
    }

    return next;
  });

  return { text: output.join("\n"), filledLines, trimmedLines, removedLines };
}

/**
 * Counts characters the way most SNS composers do: by Unicode code point, so a
 * surrogate-pair emoji counts as 1 rather than 2. Multi-part emoji (families,
 * skin tones) still count as several — apps differ here, which the tool's FAQ
 * calls out.
 */
export function countCharacters(text: string): number {
  return [...text].length;
}

export function countLines(text: string): number {
  if (!text) return 0;
  return text.replace(/\r\n?/g, "\n").split("\n").length;
}

export interface SnsLimit {
  /** Service name shown in the UI. */
  name: string;
  /** Character limit for this field. */
  limit: number;
  /** What the limit applies to, e.g. 自己紹介欄. */
  field: string;
}

/** Profile/bio limits. Kept in one place so they are easy to revise. */
export const profileLimits: SnsLimit[] = [
  { name: "TikTok", field: "自己紹介", limit: 80 },
  { name: "Facebook", field: "自己紹介", limit: 101 },
  { name: "Instagram", field: "自己紹介", limit: 150 },
  { name: "Threads", field: "自己紹介", limit: 150 },
  { name: "X（旧Twitter）", field: "自己紹介", limit: 160 },
  { name: "LINE", field: "ステータスメッセージ", limit: 500 },
  { name: "YouTube", field: "チャンネル説明", limit: 1000 },
];

/** Post/caption limits. */
export const postLimits: SnsLimit[] = [
  { name: "X（旧Twitter）", field: "投稿本文（無料プラン）", limit: 140 },
  { name: "Threads", field: "投稿本文", limit: 500 },
  { name: "Instagram", field: "キャプション", limit: 2200 },
  { name: "TikTok", field: "キャプション", limit: 2200 },
  { name: "YouTube", field: "動画の説明欄", limit: 5000 },
];
