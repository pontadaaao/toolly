import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getIcon } from "@/lib/icon-map";
import type { ToolDefinition } from "@/types/tool";

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

export function ToolCard({ tool, showBadge }: { tool: ToolDefinition; showBadge?: "popular" | "new" }) {
  const Icon = getIcon(tool.icon);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg"
    >
      <div className="flex items-start justify-between">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
          <Icon className="size-6" />
        </span>
        {showBadge === "popular" && <Badge className="bg-accent text-accent-foreground">人気</Badge>}
        {showBadge === "new" && <Badge className="bg-secondary text-secondary-foreground">新着</Badge>}
      </div>
      <div>
        <h3 className="font-semibold">{tool.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{tool.shortDescription}</p>
      </div>
      <span className="mt-auto text-xs font-medium text-muted-foreground">
        {categoryLabel[tool.category]}
      </span>
    </Link>
  );
}
