import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";
export const ogImageAlt = `${siteConfig.name} - ${siteConfig.tagline}`;

/** lucide-react's "Wrench" icon path — matches the header logo mark. */
const wrenchPath =
  "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z";

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
  const fontData = await loadNotoSansJP(siteConfig.tagline);

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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 100,
              height: 100,
              borderRadius: 30,
              background: "linear-gradient(135deg, #4F8EF7 0%, #59C3C3 100%)",
            }}
          >
            <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d={wrenchPath} />
            </svg>
          </div>
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
