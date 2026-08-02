import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SearchBar } from "@/components/shared/search-bar";
import { ToolCard } from "@/components/shared/tool-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getAllTools, getPopularTools, searchTools } from "@/lib/tools";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "ツール一覧",
  description: "Toollyで公開しているすべての無料便利ツールの一覧です。画像・PDF・計算・テキストなど、目的に合わせてお選びいただけます。",
  path: "/tools",
});

const popularSlugs = new Set(getPopularTools(20).map((t) => t.slug));

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? searchTools(query) : getAllTools();

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumb items={[{ name: "ツール一覧" }]} />

      <header className="mt-4 max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">ツール一覧</h1>
        <p className="mt-3 text-muted-foreground">
          Toollyで公開しているすべての無料ツールです。インストール不要・登録不要ですぐに使えます。
        </p>
      </header>

      <div className="mt-6">
        <SearchBar />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {query ? `「${query}」の検索結果：${results.length}件` : `全${results.length}件`}
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} showBadge={popularSlugs.has(tool.slug) ? "popular" : undefined} />
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <EmptyState
            title="該当するツールが見つかりませんでした"
            description="別のキーワードで検索するか、ツール一覧からお探しください。"
          />
        </div>
      )}
    </Container>
  );
}
