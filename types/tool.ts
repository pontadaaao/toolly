/**
 * Core data model for the tool catalog.
 * This is the single source of truth that every listing, search, SEO and
 * related-tools feature reads from. Adding a new tool should only require
 * appending an entry to `data/tools.ts` plus the page/feature component.
 */

export type CategorySlug = "image" | "pdf" | "calculator" | "text" | "life" | "creator" | "web" | "money";

export interface CategoryDefinition {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  /** URL slug, used as /tools/[slug] */
  slug: string;
  /** Display name */
  name: string;
  /** One-line summary shown on cards */
  shortDescription: string;
  /** Longer description shown at the top of the tool page and used for meta description */
  description: string;
  category: CategorySlug;
  /** lucide-react icon name, resolved via lib/icon-map.ts */
  icon: string;
  /** Shown in the "人気ツール" section on the homepage */
  isPopular?: boolean;
  /** ISO date string, used to sort the "新着ツール" section */
  releasedAt: string;
  /** Extra keywords for search matching and meta keywords */
  keywords: string[];
  /** Ordered steps shown in the "使い方" section */
  howToUse: string[];
  faq: FaqItem[];
  /** Explicit related tool slugs; falls back to same-category tools when omitted */
  relatedSlugs?: string[];
  /** Natural, search-intent-matching <title>. Falls back to `name` when omitted. */
  metaTitle?: string;
  /** "計算方法・変換方法" section, rendered between howToUse and FAQ when present. */
  calculationMethod?: string[];
  /** "利用例" section, rendered between calculationMethod and FAQ when present. */
  usageExamples?: string[];
  /** "注意事項" section, rendered between FAQ and RelatedTools when present. */
  cautions?: string[];
}
