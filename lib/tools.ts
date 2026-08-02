import { categories } from "@/data/categories";
import { tools } from "@/data/tools";
import type { CategorySlug, ToolDefinition } from "@/types/tool";

export function getAllTools(): ToolDefinition[] {
  return tools;
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getPopularTools(limit = 6): ToolDefinition[] {
  return tools.filter((tool) => tool.isPopular).slice(0, limit);
}

export function getNewTools(limit = 8): ToolDefinition[] {
  return [...tools]
    .sort((a, b) => new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime())
    .slice(0, limit);
}

export function getToolsByCategory(category: CategorySlug): ToolDefinition[] {
  return tools.filter((tool) => tool.category === category);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getAllCategories() {
  return categories;
}

export function getRelatedTools(tool: ToolDefinition, limit = 4): ToolDefinition[] {
  if (tool.relatedSlugs?.length) {
    const related = tool.relatedSlugs
      .map((slug) => getToolBySlug(slug))
      .filter((t): t is ToolDefinition => Boolean(t));
    if (related.length >= limit) return related.slice(0, limit);
    const extra = getToolsByCategory(tool.category).filter(
      (t) => t.slug !== tool.slug && !related.some((r) => r.slug === t.slug)
    );
    return [...related, ...extra].slice(0, limit);
  }
  return getToolsByCategory(tool.category)
    .filter((t) => t.slug !== tool.slug)
    .slice(0, limit);
}

/** Simple client/server-safe search across name, description and keywords. */
export function searchTools(query: string): ToolDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return tools.filter((tool) => {
    const haystack = [tool.name, tool.shortDescription, tool.description, ...tool.keywords]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
