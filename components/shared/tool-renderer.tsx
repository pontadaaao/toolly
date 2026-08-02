"use client";

import { toolComponents } from "@/lib/tool-components";

/**
 * Thin client boundary that resolves a tool slug to its feature component.
 * Kept separate from the Server Component tool page so that only a plain
 * `slug` string crosses the server/client boundary (passing the component
 * map itself across that boundary does not work reliably with RSC).
 */
export function ToolRenderer({ slug }: { slug: string }) {
  const Component = toolComponents[slug];
  if (!Component) return null;
  return <Component />;
}
