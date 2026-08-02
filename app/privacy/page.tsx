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
    title: "1. 個人情報の利用目的",
    body: [
      "当サイトでは、お問い合わせ等の際に、お名前やメールアドレスなどの個人情報をご入力いただく場合があります。",
      "取得した個人情報は、お問い合わせへの回答や必要なご連絡のために利用し、それ以外の目的では利用いたしません。",
    ],
  },
  {
    title: "2. 広告について",
    body: [
      "当サイトでは、第三者配信の広告サービス（Google AdSense等）を利用する予定です。",
      "これらの広告配信事業者は、ユーザーの興味に応じた広告を表示するため、Cookie（クッキー）を使用する場合があります。",
      "Cookieを利用することで当サイトは利用者のコンピューターを識別できますが、個人を特定するものではありません。",
      "Google広告におけるCookieの利用方法や、パーソナライズ広告を無効にする方法については、Googleの広告設定をご確認ください。",
    ],
  },
  {
    title: "3. アクセス解析ツールについて",
    body: [
      "当サイトでは、サイト改善や利用状況の分析を目的として、Google Analyticsなどのアクセス解析ツールを利用する場合があります。",
      "これらのツールでは、トラフィックデータ収集のためにCookieを使用しています。",
      "収集される情報は匿名であり、個人を特定するものではありません。",
      "Cookieを無効にすることで収集を拒否することも可能です。お使いのブラウザの設定をご確認ください。",
    ],
  },
  {
    title: "4. Cookieについて",
    body: [
      "Cookieとは、利用者がサイトを閲覧した際にブラウザへ保存される情報です。",
      "Cookieには氏名・住所・メールアドレス・電話番号などの個人情報は含まれません。",
      "利用者はブラウザの設定によりCookieの利用を拒否することができます。",
    ],
  },
  {
    title: "5. 外部サービスについて",
    body: [
      "当サイトでは、SNSや外部サービスへのリンクを掲載する場合があります。",
      "リンク先のサイトで提供される情報・サービス等について、当サイトでは責任を負いかねます。",
    ],
  },
  {
    title: "6. 免責事項",
    body: [
      "当サイトに掲載している情報については、できる限り正確な内容を提供するよう努めていますが、その正確性・安全性・最新性を保証するものではありません。",
      "当サイトの情報を利用したことによって生じた損害等について、一切の責任を負いかねます。",
      "掲載内容は予告なく変更・削除することがあります。",
    ],
  },
  {
    title: "7. 著作権について",
    body: [
      "当サイトに掲載している文章・画像・デザイン等の著作権は、当サイトまたは正当な権利者に帰属します。",
      "法令で認められる引用の範囲を超えた無断転載・複製・配布を禁止します。",
    ],
  },
  {
    title: "8. プライバシーポリシーの変更",
    body: [
      "本ポリシーの内容は、法令の改正やサービス内容の変更等に応じて、予告なく変更することがあります。",
      "最新の内容は常に本ページにて公開いたします。",
    ],
  },
  {
    title: "9. お問い合わせ",
    body: ["当サイトに関するお問い合わせは、お問い合わせフォームよりお願いいたします。"],
  },
];

export default function PrivacyPage() {
  return (
    <Container className="max-w-3xl py-8 sm:py-12">
      <Breadcrumb items={[{ name: "プライバシーポリシー" }]} />

      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">プライバシーポリシー</h1>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
        Toolly（以下、「当サイト」といいます。）は、利用者の個人情報の保護を重要な責務と考え、以下のとおりプライバシーポリシーを定めます。
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 text-base font-semibold text-foreground">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="not-last:mb-2">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">制定日：2026年8月2日</p>
    </Container>
  );
}
