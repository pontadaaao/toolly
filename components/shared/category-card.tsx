import Link from "next/link";
import type { CategoryDefinition } from "@/types/tool";
import { getIcon } from "@/lib/icon-map";
import { getToolsByCategory } from "@/lib/tools";

export function CategoryCard({ category }: { category: CategoryDefinition }) {
  const Icon = getIcon(category.icon);
  const count = getToolsByCategory(category.slug).length;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg"
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary transition-colors group-hover:bg-secondary/25">
        <Icon className="size-6" />
      </span>
      <div>
        <h3 className="font-semibold">{category.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
      </div>
      <span className="mt-auto text-xs font-medium text-primary">{count}個のツール</span>
    </Link>
  );
}
