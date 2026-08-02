import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { CategoryCard } from "@/components/shared/category-card";
import { getAllCategories } from "@/lib/tools";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "カテゴリー一覧",
  description: "画像・PDF・計算・テキストなど、カテゴリーからToollyの便利ツールを探せます。",
  path: "/category",
});

export default function CategoryIndexPage() {
  const categories = getAllCategories();

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumb items={[{ name: "カテゴリー" }]} />

      <header className="mt-4 max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">カテゴリー</h1>
        <p className="mt-3 text-muted-foreground">目的に合わせてカテゴリーからツールを探せます。</p>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </Container>
  );
}
