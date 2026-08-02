import type { Metadata } from "next";
import type { FaqItem, ToolDefinition } from "@/types/tool";

export const siteConfig = {
  name: "Toolly",
  tagline: "毎日使える無料便利ツール",
  description:
    "インストール不要・登録不要。仕事や日常で役立つ便利ツールを無料で利用できます。",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolly.example.com",
  ogImage: "/og-image.png",
  twitterHandle: "@toolly",
};

interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}

/** Builds full Next.js Metadata (title/description/OG/Twitter/canonical) for a page. */
export function buildMetadata({ title, description, path, keywords }: BuildMetadataOptions): Metadata {
  const url = `${siteConfig.url}${path}`;
  const fullTitle = path === "/" ? title : `${title} | ${siteConfig.name}`;

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: "ja_JP",
      type: "website",
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [siteConfig.ogImage],
      site: siteConfig.twitterHandle,
    },
  };
}

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

/** Builds a BreadcrumbList JSON-LD schema object. */
export function buildBreadcrumbSchema(entries: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: `${siteConfig.url}${entry.path}`,
    })),
  };
}

/** Builds an FAQPage JSON-LD schema object. */
export function buildFaqSchema(faq: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** Builds a WebApplication JSON-LD schema object for a free, browser-based tool page. */
export function buildWebApplicationSchema(tool: ToolDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `${siteConfig.url}/tools/${tool.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/tools?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
