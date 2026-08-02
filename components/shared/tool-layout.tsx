import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { FAQ } from "@/components/shared/faq";
import { RelatedTools } from "@/components/shared/related-tools";
import { AdSlot } from "@/components/shared/ad-slot";
import { Badge } from "@/components/ui/badge";
import { getIcon } from "@/lib/icon-map";
import { ADS_ENABLED } from "@/lib/config";
import { getAllCategories, getCategoryBySlug, getRelatedTools } from "@/lib/tools";
import type { ToolDefinition } from "@/types/tool";
import { cn } from "@/lib/utils";

const categoryLabel: Record<string, string> = {
  image: "画像",
  pdf: "PDF",
  calculator: "計算",
  text: "テキスト",
  life: "人生・暮らし",
  creator: "SNS・クリエイター",
  web: "Web・開発",
  money: "お金・計算",
};

/**
 * Shared page shell for every /tools/[slug] page: breadcrumb, title/description,
 * the tool itself (passed as children), how-to-use steps, FAQ, related tools
 * and a dummy ad slot. Individual tool pages only need to supply the
 * ToolDefinition and their interactive feature component.
 */
export function ToolLayout({ tool, children }: { tool: ToolDefinition; children: React.ReactNode }) {
  const category = getCategoryBySlug(tool.category);
  const related = getRelatedTools(tool);
  const otherCategories = getAllCategories().filter((c) => c.slug !== tool.category);

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumb
        items={[
          { name: "ツール一覧", href: "/tools" },
          { name: category?.name ?? categoryLabel[tool.category], href: `/category/${tool.category}` },
          { name: tool.name },
        ]}
      />

      <header className="mt-4 max-w-2xl">
        <Badge variant="secondary" className="mb-3">
          {category?.name ?? categoryLabel[tool.category]}
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{tool.name}</h1>
        <p className="mt-3 text-muted-foreground">{tool.description}</p>
      </header>

      <div className={cn("mt-8 grid gap-10", ADS_ENABLED && "lg:grid-cols-[1fr_280px]")}>
        <div className="min-w-0 space-y-12">
          <section aria-label={tool.name} className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-8">
            {children}
          </section>

          {tool.howToUse.length > 0 && (
            <section aria-labelledby="how-to-heading">
              <h2 id="how-to-heading" className="text-xl font-bold">
                使い方
              </h2>
              <ol className="mt-4 space-y-3">
                {tool.howToUse.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {tool.calculationMethod && tool.calculationMethod.length > 0 && (
            <section aria-labelledby="calculation-method-heading">
              <h2 id="calculation-method-heading" className="text-xl font-bold">
                計算方法・変換方法
              </h2>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                {tool.calculationMethod.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}

          {tool.usageExamples && tool.usageExamples.length > 0 && (
            <section aria-labelledby="usage-examples-heading">
              <h2 id="usage-examples-heading" className="text-xl font-bold">
                利用例
              </h2>
              <ul className="mt-4 space-y-2">
                {tool.usageExamples.map((example) => (
                  <li key={example} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <FAQ items={tool.faq} />

          {tool.cautions && tool.cautions.length > 0 && (
            <section aria-labelledby="cautions-heading" className="rounded-2xl border border-border bg-muted/40 p-5">
              <h2 id="cautions-heading" className="text-base font-bold">
                注意事項
              </h2>
              <ul className="mt-3 space-y-2">
                {tool.cautions.map((caution) => (
                  <li key={caution} className="text-sm text-muted-foreground">
                    ・{caution}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <RelatedTools tools={related} />

          <section aria-labelledby="other-categories-heading">
            <h2 id="other-categories-heading" className="text-sm font-semibold text-muted-foreground">
              他のカテゴリを見る
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {otherCategories.map((c) => {
                const Icon = getIcon(c.icon);
                return (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Icon className="size-3.5" />
                    {c.name}
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {ADS_ENABLED && (
          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <AdSlot />
            <AdSlot className="min-h-64" />
          </aside>
        )}
      </div>
    </Container>
  );
}
