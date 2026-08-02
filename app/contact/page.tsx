import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "お問い合わせ",
  description: "Toollyへのご意見・ご要望・不具合報告はこちらからお問い合わせください。",
  path: "/contact",
});

const contactEmail = "support@toolly.example.com";

export default function ContactPage() {
  return (
    <Container className="max-w-3xl py-8 sm:py-12">
      <Breadcrumb items={[{ name: "お問い合わせ" }]} />

      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">お問い合わせ</h1>
      <p className="mt-3 text-sm text-muted-foreground sm:text-base">
        {siteConfig.name}に関するご意見・ご要望・不具合の報告など、お気軽にご連絡ください。
      </p>

      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Mail className="size-5" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">メールでのお問い合わせ</p>
          <a href={`mailto:${contactEmail}`} className="font-medium text-primary hover:underline">
            {contactEmail}
          </a>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        内容によってはご返信までお時間をいただく場合や、ご返信できない場合がございます。あらかじめご了承ください。
      </p>
    </Container>
  );
}
