import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";
export const ogImageAlt = `${siteConfig.name} - ${siteConfig.tagline}`;

/** Reads the brand mark (public/logo.png) as a data URI — satori (the renderer behind `next/og`) can't fetch local paths. */
async function loadLogoDataUri(): Promise<string> {
  const filePath = path.join(process.cwd(), "public", "logo.png");
  const buffer = await readFile(filePath);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

/**
 * satori (the renderer behind `next/og`) ships no CJK glyphs, so Japanese
 * text renders blank without an explicit font. Google Fonts' CSS2 endpoint
 * serves a legacy truetype `@font-face` src (instead of woff2) to
 * non-browser user agents, which is what an untouched `fetch()` from the
 * Next.js server counts as — this is the standard workaround for non-Latin
 * text in `next/og` images.
 */
async function loadNotoSansJP(text: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700;900&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(cssUrl)).text();
  const match = css.match(/src: url\(([^)]+)\)/);
  if (!match) throw new Error("Could not find a font source in the Google Fonts response");
  const fontResponse = await fetch(match[1]);
  return fontResponse.arrayBuffer();
}

/** Shared branded OG/Twitter card image, reused by app/opengraph-image.tsx and app/twitter-image.tsx. */
export async function generateOgImage(): Promise<ImageResponse> {
  const [fontData, logoDataUri] = await Promise.all([
    loadNotoSansJP(siteConfig.tagline),
    loadLogoDataUri(),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #F8FAFC 0%, #EEF2F7 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- satori (next/og) requires a plain <img>, not next/image */}
          <img src={logoDataUri} width={100} height={100} style={{ borderRadius: 26 }} alt="" />
          <div style={{ display: "flex", fontSize: 108, fontWeight: 900, color: "#1F2937" }}>{siteConfig.name}</div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 42,
            fontWeight: 700,
            color: "#4F8EF7",
            fontFamily: "Noto Sans JP",
          }}
        >
          {siteConfig.tagline}
        </div>
      </div>
    ),
    {
      ...ogImageSize,
      fonts: [{ name: "Noto Sans JP", data: fontData, style: "normal", weight: 700 }],
    }
  );
}
