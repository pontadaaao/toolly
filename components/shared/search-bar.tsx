"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getIcon } from "@/lib/icon-map";
import { searchTools } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const suggestions = useMemo(() => searchTools(query).slice(0, 6), [query]);
  const showDropdown = focused && query.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/tools?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className={cn("relative w-full max-w-xl", className)}>
      <form onSubmit={handleSubmit} role="search">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft transition-shadow focus-within:shadow-soft-lg">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="ツールを検索（例：BMI、QRコード、圧縮）"
            aria-label="ツールを検索"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:text-base"
          />
          {query && (
            <button
              type="button"
              aria-label="検索をクリア"
              onClick={() => setQuery("")}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </form>

      {showDropdown && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-soft-lg">
          {suggestions.length > 0 ? (
            <ul className="divide-y divide-border">
              {suggestions.map((tool) => {
                const Icon = getIcon(tool.icon);
                return (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted"
                    >
                      <Icon className="size-4 text-primary" />
                      <span className="font-medium">{tool.name}</span>
                      <span className="truncate text-muted-foreground">{tool.shortDescription}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-muted-foreground">該当するツールが見つかりませんでした。</p>
          )}
        </div>
      )}
    </div>
  );
}
