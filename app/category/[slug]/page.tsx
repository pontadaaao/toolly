import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ToolCard } from "@/components/shared/tool-card";
import { EmptyState } from "@/components/shared/empty-state";
import { categories } from "@/data/categories";
import { getCategoryBySlug, getPopularTools, getToolsByCategory } from "@/lib/tools";
import { buildBreadcrumbSchema, buildMetadata, siteConfig } from "@/lib/seo";

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

  const tools = getToolsByCategory(category.slug);
  const keywords = [
    category.name,
    `${category.name} ツール`,
    ...new Set(tools.flatMap((tool) => [tool.name, ...tool.keywords])),
  ].slice(0, 30);

  return buildMetadata({
    title: `${category.name}ツール一覧`,
    description: category.description,
    path: `/category/${category.slug}`,
    keywords,
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

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "カテゴリー", path: "/category" },
    { name: category.name, path: `/category/${category.slug}` },
  ]);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${siteConfig.url}/tools/${tool.slug}`,
    })),
  };

  return (
    <Container className="py-8 sm:py-12">
      <Script
        id={`category-breadcrumb-schema-${category.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {tools.length > 0 && (
        <Script
          id={`category-itemlist-schema-${category.slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}

      <Breadcrumb items={[{ name: "カテゴリー", href: "/category" }, { name: category.name }]} />

      <header className="mt-4 max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{category.name}のツール</h1>
        <p className="mt-3 text-muted-foreground">{category.description}</p>
        {category.longDescription && category.longDescription.length > 0 && (
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {category.longDescription.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}
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

      {category.selectionTips && category.selectionTips.length > 0 && (
        <section aria-labelledby="selection-tips-heading" className="mt-12 max-w-3xl">
          <h2 id="selection-tips-heading" className="text-xl font-bold">
            目的別の選び方
          </h2>
          <ul className="mt-4 space-y-2">
            {category.selectionTips.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="other-categories-heading" className="mt-12">
        <h2 id="other-categories-heading" className="text-sm font-semibold text-muted-foreground">
          他のカテゴリーを見る
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories
            .filter((c) => c.slug !== category.slug)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-primary/40 hover:text-primary"
              >
                {c.name}
              </Link>
            ))}
        </div>
      </section>
    </Container>
  );
}
