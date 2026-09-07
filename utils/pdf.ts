/**
 * Helpers shared by the PDF tools (pdf-split / image-to-pdf).
 * All PDF work happens in the browser via pdf-lib; nothing here touches
 * the network.
 */

export interface PageRangeResult {
  /** 1-indexed page numbers, de-duplicated and in the order the user typed them. */
  pages: number[];
  error?: string;
}

/**
 * Parses a page selection like "1-3, 5, 8-10" into 1-indexed page numbers.
 * Accepts full-width digits, commas and hyphens because Japanese IMEs produce
 * them constantly, and reports the first problem it finds rather than silently
 * dropping the bad part.
 */
export function parsePageRanges(input: string, totalPages: number): PageRangeResult {
  const normalized = input
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[、，]/g, ",")
    .replace(/[ー―–—〜～]/g, "-")
    .replace(/\s/g, "");

  if (!normalized) return { pages: [], error: "抽出するページを入力してください。" };

  const pages: number[] = [];
  const seen = new Set<number>();

  for (const part of normalized.split(",")) {
    if (!part) continue;

    const range = part.match(/^(\d+)-(\d+)$/);
    if (range) {
      const from = Number(range[1]);
      const to = Number(range[2]);
      if (from < 1 || to < 1) return { pages: [], error: "ページ番号は1以上で指定してください。" };
      if (from > totalPages || to > totalPages) {
        return { pages: [], error: `このPDFは全${totalPages}ページです。${totalPages}以下で指定してください。` };
      }
      if (from > to) return { pages: [], error: `「${part}」の開始ページが終了ページより後になっています。` };
      for (let p = from; p <= to; p++) {
        if (!seen.has(p)) {
          seen.add(p);
          pages.push(p);
        }
      }
      continue;
    }

    const single = part.match(/^(\d+)$/);
    if (single) {
      const p = Number(single[1]);
      if (p < 1) return { pages: [], error: "ページ番号は1以上で指定してください。" };
      if (p > totalPages) {
        return { pages: [], error: `このPDFは全${totalPages}ページです。${totalPages}以下で指定してください。` };
      }
      if (!seen.has(p)) {
        seen.add(p);
        pages.push(p);
      }
      continue;
    }

    return { pages: [], error: `「${part}」を解釈できませんでした。「1-3,5」のように入力してください。` };
  }

  if (pages.length === 0) return { pages: [], error: "抽出するページを入力してください。" };
  return { pages };
}

/** Renders a selection back as a compact label, e.g. [1,2,3,5] → "1-3, 5". */
export function formatPageList(pages: number[]): string {
  if (pages.length === 0) return "";
  const sorted = [...pages].sort((a, b) => a - b);
  const groups: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i <= sorted.length; i++) {
    const current = sorted[i];
    if (current !== prev + 1) {
      groups.push(start === prev ? `${start}` : `${start}-${prev}`);
      start = current;
    }
    prev = current;
  }

  return groups.join(", ");
}

/** Page presets offered by the image→PDF tool. Sizes are in PDF points (1pt = 1/72inch). */
export const pageSizePresets = {
  auto: { label: "画像サイズに合わせる", width: 0, height: 0 },
  a4portrait: { label: "A4（縦）", width: 595.28, height: 841.89 },
  a4landscape: { label: "A4（横）", width: 841.89, height: 595.28 },
  b5portrait: { label: "B5（縦）", width: 498.9, height: 708.66 },
  letterPortrait: { label: "レター（縦）", width: 612, height: 792 },
} as const;

export type PageSizeKey = keyof typeof pageSizePresets;

/**
 * Fits `content` inside `box` without distortion (contain), returning the drawn
 * size and the offset that centres it.
 */
export function fitContain(
  contentWidth: number,
  contentHeight: number,
  boxWidth: number,
  boxHeight: number
): { width: number; height: number; x: number; y: number } {
  const scale = Math.min(boxWidth / contentWidth, boxHeight / contentHeight);
  const width = contentWidth * scale;
  const height = contentHeight * scale;
  return { width, height, x: (boxWidth - width) / 2, y: (boxHeight - height) / 2 };
}
