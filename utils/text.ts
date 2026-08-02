export interface TextStats {
  characterCount: number;
  characterCountNoSpaces: number;
  lineCount: number;
  readingTimeMinutes: number;
}

/** Roughly 400–600 Japanese characters are read per minute; 500 is used as the midpoint. */
const CHARS_PER_MINUTE_JA = 500;

export function analyzeText(text: string): TextStats {
  const characterCount = Array.from(text).length;
  const characterCountNoSpaces = Array.from(text.replace(/\s/g, "")).length;
  const lineCount = text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length;
  const readingTimeMinutes = characterCount === 0 ? 0 : Math.max(1, Math.ceil(characterCount / CHARS_PER_MINUTE_JA));

  return { characterCount, characterCountNoSpaces, lineCount, readingTimeMinutes };
}
