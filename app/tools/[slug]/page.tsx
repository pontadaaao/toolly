import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { tools } from "@/data/tools";
import { getToolBySlug } from "@/lib/tools";
import { ToolLayout } from "@/components/shared/tool-layout";
import { ToolRenderer } from "@/components/shared/tool-renderer";
import { buildBreadcrumbSchema, buildFaqSchema, buildMetadata, buildWebApplicationSchema } from "@/lib/seo";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return buildMetadata({
    title: tool.metaTitle ?? tool.name,
    description: tool.description,
    path: `/tools/${tool.slug}`,
    keywords: tool.keywords,
  });
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "ツール一覧", path: "/tools" },
    { name: tool.name, path: `/tools/${tool.slug}` },
  ]);
  const faqSchema = buildFaqSchema(tool.faq);
  const webApplicationSchema = buildWebApplicationSchema(tool);

  return (
    <>
      <Script
        id={`breadcrumb-schema-${tool.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id={`faq-schema-${tool.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id={`webapp-schema-${tool.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <ToolLayout tool={tool}>
        <ToolRenderer slug={tool.slug} />
      </ToolLayout>
    </>
  );
}
