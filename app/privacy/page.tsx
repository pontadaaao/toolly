import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "プライバシーポリシー",
  description: `${siteConfig.name}における個人情報の取り扱いについて説明します。`,
  path: "/privacy",
});

const sections = [
  {
    title: "画像・PDFなどのファイルについて",
    body: "画像圧縮、PDF結合、画像リサイズ、SNSサイズ変換、WebP変換などのツールでアップロードされる画像・PDFファイルは、すべてお使いのブラウザ内で処理され、当サイトのサーバーに送信・保存されることはありません。",
  },
  {
    title: "アクセス解析について",
    body: "当サイトは、サービス改善を目的として、アクセス解析ツールを利用する場合があります。アクセス解析ツールは、Cookie等を利用して個人を特定しない範囲の情報（閲覧ページ、滞在時間など）を収集することがあります。",
  },
  {
    title: "広告について",
    body: "当サイトでは、第三者配信の広告サービスを利用する場合があります。広告配信事業者は、利用者の興味に応じた広告を表示するためにCookieを使用することがあります。",
  },
  {
    title: "お問い合わせフォームについて",
    body: "お問い合わせの際にご提供いただいたメールアドレス等の情報は、お問い合わせへの回答以外の目的では利用いたしません。",
  },
  {
    title: "プライバシーポリシーの変更について",
    body: "当サイトは、必要に応じて本ポリシーの内容を変更することがあります。変更後のプライバシーポリシーは、当サイトに掲載した時点から効力を生じるものとします。",
  },
];

export default function PrivacyPage() {
  return (
    <Container className="max-w-3xl py-8 sm:py-12">
      <Breadcrumb items={[{ name: "プライバシーポリシー" }]} />

      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">プライバシーポリシー</h1>
      <p className="mt-3 text-sm text-muted-foreground">最終更新日：2026年8月1日</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 text-base font-semibold text-foreground">{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
    </Container>
  );
}
