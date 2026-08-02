import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

/** Visual breadcrumb trail. Pair with `buildBreadcrumbSchema` for JSON-LD on the page. */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="パンくずリスト" className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
      <Link href="/" className="flex items-center gap-1 hover:text-foreground">
        <Home className="size-3.5" />
        <span className="sr-only">ホーム</span>
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.name}-${index}`} className="flex items-center gap-1">
            <ChevronRight className="size-3.5" />
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-foreground">
                {item.name}
              </Link>
            ) : (
              <span className={isLast ? "font-medium text-foreground" : ""}>{item.name}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
