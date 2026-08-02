import {
  buildRegionalTags,
  catchAllTags,
  genericJapaneseTags,
  getToneFlavorTags,
  hashtagDictionary,
  type HashtagGenre,
  type Tone,
} from "@/utils/hashtag-dictionary";

export type HashtagCount = 5 | 10 | 15 | 20 | 30;

export interface HashtagGeneratorInput {
  theme: string;
  content: string;
  genre: HashtagGenre;
  targetAudience: string;
  region: string;
  count: HashtagCount;
  tone: Tone;
}

export interface HashtagCategory {
  key: "content" | "large" | "medium" | "small" | "regional" | "japanese" | "english";
  label: string;
  tags: string[];
}

/** Words that should never appear in a generated tag; guards the free-text keyword-extraction path. */
const ngWords = ["死ね", "殺す", "自殺", "薬物", "違法", "エロ", "出会い系", "アダルト", "反社"];

const stopWords = new Set([
  "の",
  "を",
  "は",
  "が",
  "に",
  "で",
  "と",
  "も",
  "や",
  "な",
  "です",
  "ます",
  "する",
  "した",
  "こと",
  "これ",
  "それ",
  "あの",
  "その",
  "この",
  "the",
  "and",
  "for",
  "with",
]);

function containsNgWord(tag: string): boolean {
  return ngWords.some((word) => tag.includes(word));
}

/** Very small, dependency-free keyword extraction from free-text theme/content/audience input. */
export function extractKeywordTags(text: string, max: number): string[] {
  const tokens = text
    .split(/[\s、。,.\n・/／]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !stopWords.has(t.toLowerCase()));

  const tags: string[] = [];
  const seen = new Set<string>();
  for (const token of tokens) {
    const tag = `#${token.replace(/[#\s]/g, "")}`;
    if (tag.length <= 1 || seen.has(tag) || containsNgWord(tag)) continue;
    seen.add(tag);
    tags.push(tag);
    if (tags.length >= max) break;
  }
  return tags;
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pick(pool: string[], n: number, used: Set<string>): string[] {
  if (n <= 0) return [];
  const available = shuffle(pool.filter((tag) => !used.has(tag) && !containsNgWord(tag)));
  const picked = available.slice(0, n);
  picked.forEach((tag) => used.add(tag));
  return picked;
}

interface Allocation {
  large: number;
  medium: number;
  small: number;
  regional: number;
  japanese: number;
  english: number;
}

function allocateCounts(total: number, hasRegion: boolean): Allocation {
  const regional = hasRegion ? Math.max(1, Math.round(total * 0.1)) : 0;
  const remaining = total - regional;
  const large = Math.round(remaining * 0.3);
  const medium = Math.round(remaining * 0.3);
  const english = Math.round(remaining * 0.15);
  const japanese = Math.round(remaining * 0.1);
  const small = Math.max(remaining - large - medium - english - japanese, 0);

  // Fix rounding drift so the total always matches exactly what was requested.
  const drift = total - (large + medium + small + regional + japanese + english);
  return { large, medium, small: small + drift, regional, japanese, english };
}

export interface HashtagResult {
  categories: HashtagCategory[];
  allTags: string[];
}

/** Composes a themed hashtag set from the local dictionary — no AI/external API involved. */
export function generateHashtags(input: HashtagGeneratorInput): HashtagResult {
  const pool = hashtagDictionary[input.genre];
  const used = new Set<string>();
  const categories: HashtagCategory[] = [];

  const contentTags = [
    ...extractKeywordTags(input.theme, 2),
    ...extractKeywordTags(input.content, 3),
    ...extractKeywordTags(input.targetAudience, 1),
  ]
    .filter((tag) => !used.has(tag))
    .slice(0, Math.max(1, Math.round(input.count * 0.15)));
  contentTags.forEach((tag) => used.add(tag));
  if (contentTags.length > 0) {
    categories.push({ key: "content", label: "投稿内容に関連するタグ", tags: contentTags });
  }

  const remainingCount = input.count - contentTags.length;
  const allocation = allocateCounts(Math.max(remainingCount, 0), Boolean(input.region.trim()));

  const large = pick(pool.large, allocation.large, used);
  const medium = pick(pool.medium, allocation.medium, used);
  const small = pick(pool.small, allocation.small, used);
  const regional = pick(buildRegionalTags(input.region), allocation.regional, used);
  let japanese = pick([...genericJapaneseTags, ...getToneFlavorTags(input.tone)], allocation.japanese, used);
  const english = pick(pool.english, allocation.english, used);

  // Top up from the shared fallback pool if a genre's own bucket ran short.
  const shortfall =
    input.count -
    (contentTags.length + large.length + medium.length + small.length + regional.length + japanese.length + english.length);
  if (shortfall > 0) {
    const topUp = pick(catchAllTags, shortfall, used);
    japanese = [...japanese, ...topUp];
  }

  if (large.length > 0) categories.push({ key: "large", label: "大規模ハッシュタグ", tags: large });
  if (medium.length > 0) categories.push({ key: "medium", label: "中規模ハッシュタグ", tags: medium });
  if (small.length > 0) categories.push({ key: "small", label: "小規模・ニッチなハッシュタグ", tags: small });
  if (regional.length > 0) categories.push({ key: "regional", label: "地域ハッシュタグ", tags: regional });
  if (japanese.length > 0) categories.push({ key: "japanese", label: "日本語ハッシュタグ", tags: japanese });
  if (english.length > 0) categories.push({ key: "english", label: "英語ハッシュタグ", tags: english });

  const allTags = categories.flatMap((c) => c.tags);
  return { categories, allTags };
}
