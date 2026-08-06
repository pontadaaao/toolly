"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { ToolSkeleton } from "@/components/shared/tool-skeleton";

/**
 * Maps a tool slug (defined in data/tools.ts) to the client component that
 * implements its interactive UI. Every entry is lazy-loaded with next/dynamic
 * so a visitor only downloads the JS for the one tool they came to use
 * (pdf-lib, qrcode, browser-image-compression, etc. never leak into other
 * tool pages' bundles). Adding a new tool means adding one entry here and one
 * entry in data/tools.ts.
 */
export const toolComponents: Record<string, ComponentType> = {
  "graduation-date": dynamic(
    () => import("@/features/graduation-date/graduation-date-calculator").then((m) => m.GraduationDateCalculator),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  bmi: dynamic(() => import("@/features/bmi/bmi-calculator").then((m) => m.BmiCalculator), {
    loading: () => <ToolSkeleton />,
    ssr: false,
  }),
  "consumption-tax": dynamic(
    () => import("@/features/consumption-tax/consumption-tax-calculator").then((m) => m.ConsumptionTaxCalculator),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "char-counter": dynamic(() => import("@/features/char-counter/char-counter").then((m) => m.CharCounter), {
    loading: () => <ToolSkeleton />,
    ssr: false,
  }),
  "qr-code": dynamic(() => import("@/features/qr-code/qr-code-generator").then((m) => m.QrCodeGenerator), {
    loading: () => <ToolSkeleton />,
    ssr: false,
  }),
  "image-compress": dynamic(
    () => import("@/features/image-compress/image-compressor").then((m) => m.ImageCompressor),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "pdf-merge": dynamic(() => import("@/features/pdf-merge/pdf-merger").then((m) => m.PdfMerger), {
    loading: () => <ToolSkeleton />,
    ssr: false,
  }),
  "image-resize": dynamic(() => import("@/features/image-resize/image-resizer").then((m) => m.ImageResizer), {
    loading: () => <ToolSkeleton />,
    ssr: false,
  }),
  "sns-size": dynamic(() => import("@/features/sns-size/sns-size-converter").then((m) => m.SnsSizeConverter), {
    loading: () => <ToolSkeleton />,
    ssr: false,
  }),
  "webp-convert": dynamic(() => import("@/features/webp-convert/webp-converter").then((m) => m.WebpConverter), {
    loading: () => <ToolSkeleton />,
    ssr: false,
  }),
  "take-home-pay": dynamic(
    () => import("@/features/take-home-pay/take-home-pay-calculator").then((m) => m.TakeHomePayCalculator),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "bg-remove": dynamic(() => import("@/features/bg-remove/bg-remover").then((m) => m.BgRemover), {
    loading: () => <ToolSkeleton />,
    ssr: false,
  }),
  "yakudoshi-checker": dynamic(
    () => import("@/features/yakudoshi-checker/yakudoshi-checker").then((m) => m.YakudoshiChecker),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "age-calculator": dynamic(() => import("@/features/age-calculator/age-calculator").then((m) => m.AgeCalculator), {
    loading: () => <ToolSkeleton />,
    ssr: false,
  }),
  "kazoedoshi-calculator": dynamic(
    () => import("@/features/kazoedoshi-calculator/kazoedoshi-calculator").then((m) => m.KazoedoshiCalculator),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "shichigosan-checker": dynamic(
    () => import("@/features/shichigosan-checker/shichigosan-checker").then((m) => m.ShichigosanChecker),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "longevity-celebration-checker": dynamic(
    () =>
      import("@/features/longevity-celebration-checker/longevity-celebration-checker").then(
        (m) => m.LongevityCelebrationChecker
      ),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "coming-of-age-calculator": dynamic(
    () => import("@/features/coming-of-age-calculator/coming-of-age-calculator").then((m) => m.ComingOfAgeCalculator),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "school-year-lookup": dynamic(
    () => import("@/features/school-year-lookup/school-year-lookup").then((m) => m.SchoolYearLookup),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "age-reference-table": dynamic(
    () => import("@/features/age-reference-table/age-reference-table").then((m) => m.AgeReferenceTable),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "eto-checker": dynamic(() => import("@/features/eto-checker/eto-checker").then((m) => m.EtoChecker), {
    loading: () => <ToolSkeleton />,
    ssr: false,
  }),
  "rokuyo-checker": dynamic(() => import("@/features/rokuyo-checker/rokuyo-checker").then((m) => m.RokuyoChecker), {
    loading: () => <ToolSkeleton />,
    ssr: false,
  }),
  "instagram-hashtag-generator": dynamic(
    () =>
      import("@/features/instagram-hashtag-generator/instagram-hashtag-generator").then(
        (m) => m.InstagramHashtagGenerator
      ),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "url-encode-decode": dynamic(
    () => import("@/features/url-encode-decode/url-encode-decode").then((m) => m.UrlEncodeDecode),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "barcode-generator": dynamic(
    () => import("@/features/barcode-generator/barcode-generator").then((m) => m.BarcodeGenerator),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "jpg-png-converter": dynamic(
    () => import("@/features/jpg-png-converter/jpg-png-converter").then((m) => m.JpgPngConverter),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "gif-maker": dynamic(() => import("@/features/gif-maker/gif-maker").then((m) => m.GifMaker), {
    loading: () => <ToolSkeleton />,
    ssr: false,
  }),
  "image-mosaic": dynamic(() => import("@/features/image-mosaic/image-mosaic").then((m) => m.ImageMosaic), {
    loading: () => <ToolSkeleton />,
    ssr: false,
  }),
  "image-blur": dynamic(() => import("@/features/image-blur/image-blur").then((m) => m.ImageBlur), {
    loading: () => <ToolSkeleton />,
    ssr: false,
  }),
  "gasoline-cost-calculator": dynamic(
    () => import("@/features/gasoline-cost-calculator/gasoline-cost-calculator").then((m) => m.GasolineCostCalculator),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "point-return-calculator": dynamic(
    () => import("@/features/point-return-calculator/point-return-calculator").then((m) => m.PointReturnCalculator),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "annual-income-hourly-wage": dynamic(
    () =>
      import("@/features/annual-income-hourly-wage/annual-income-hourly-wage").then((m) => m.AnnualIncomeHourlyWage),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "color-code-converter": dynamic(
    () => import("@/features/color-code-converter/color-code-converter").then((m) => m.ColorCodeConverter),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "gradient-background-generator": dynamic(
    () =>
      import("@/features/gradient-background-generator/gradient-background-generator").then(
        (m) => m.GradientBackgroundGenerator
      ),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "warikan-calculator": dynamic(
    () => import("@/features/warikan-calculator/warikan-calculator").then((m) => m.WarikanCalculator),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "hensachi-calculator": dynamic(
    () => import("@/features/hensachi-calculator/hensachi-calculator").then((m) => m.HensachiCalculator),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
  "gpa-calculator": dynamic(
    () => import("@/features/gpa-calculator/gpa-calculator").then((m) => m.GpaCalculator),
    { loading: () => <ToolSkeleton />, ssr: false }
  ),
};
