import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { buildMetadata, siteConfig } from "@/lib/seo";
import { ContactForm } from "@/app/contact/contact-form";

export const metadata: Metadata = buildMetadata({
  title: "お問い合わせ",
  description: "Toollyへのご意見・ご要望・不具合報告はこちらからお問い合わせください。",
  path: "/contact",
});

const formEndpoint = "https://formspree.io/f/mjgqaddg";

export default function ContactPage() {
  return (
    <Container className="max-w-3xl py-8 sm:py-12">
      <Breadcrumb items={[{ name: "お問い合わせ" }]} />

      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">お問い合わせ</h1>
      <p className="mt-3 text-sm text-muted-foreground sm:text-base">
        {siteConfig.name}に関するご意見・ご要望・不具合の報告など、お気軽にご連絡ください。
      </p>

      <ContactForm formEndpoint={formEndpoint} />

      <p className="mt-6 text-xs text-muted-foreground">
        送信いただいた内容は担当者に届きます。内容によってはご返信までお時間をいただく場合や、ご返信できない場合がございます。あらかじめご了承ください。
      </p>
    </Container>
  );
}
