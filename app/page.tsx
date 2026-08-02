import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { SearchBar } from "@/components/shared/search-bar";
import { ToolCard } from "@/components/shared/tool-card";
import { CategoryCard } from "@/components/shared/category-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { getAllCategories, getNewTools, getPopularTools } from "@/lib/tools";
import { buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
  keywords: ["無料ツール", "便利ツール", "画像圧縮", "BMI計算", "QRコード作成", "PDF結合"],
});

export default function Home() {
  const popularTools = getPopularTools(6);
  const newTools = getNewTools(8);
  const categories = getAllCategories();

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
        <Container className="flex flex-col items-center gap-6 py-20 text-center sm:py-28">
          <Reveal>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Toolly
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-xl font-bold sm:text-2xl">毎日使える無料便利ツール</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              インストール不要・登録不要。仕事や日常で役立つ便利ツールを無料で利用できます。
            </p>
          </Reveal>
          <Reveal delay={0.15} className="w-full flex justify-center">
            <SearchBar />
          </Reveal>
        </Container>
      </section>

      <Container className="mt-16 space-y-20 sm:mt-24">
        {/* Popular tools */}
        <section aria-labelledby="popular-heading">
          <SectionHeading title="人気ツール" description="よく使われている定番ツール" href="/tools" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} showBadge="popular" />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section aria-labelledby="category-heading">
          <SectionHeading title="カテゴリーから探す" description="目的に合わせてツールを探せます" href="/category" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </section>

        {/* New tools */}
        <section aria-labelledby="new-heading">
          <SectionHeading title="新着ツール" description="最近追加されたツール" href="/tools" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} showBadge="new" />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
