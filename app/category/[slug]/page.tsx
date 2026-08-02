import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ToolCard } from "@/components/shared/tool-card";
import { EmptyState } from "@/components/shared/empty-state";
import { categories } from "@/data/categories";
import { getCategoryBySlug, getPopularTools, getToolsByCategory } from "@/lib/tools";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  return buildMetadata({
    title: `${category.name}ツール一覧`,
    description: category.description,
    path: `/category/${category.slug}`,
  });
}

const popularSlugs = new Set(getPopularTools(20).map((t) => t.slug));

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const tools = getToolsByCategory(category.slug);

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumb items={[{ name: "カテゴリー", href: "/category" }, { name: category.name }]} />

      <header className="mt-4 max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{category.name}のツール</h1>
        <p className="mt-3 text-muted-foreground">{category.description}</p>
      </header>

      {tools.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} showBadge={popularSlugs.has(tool.slug) ? "popular" : undefined} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState title="このカテゴリーにはまだツールがありません" />
        </div>
      )}
    </Container>
  );
}
