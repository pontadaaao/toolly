import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Container } from "@/components/shared/container";
import { SearchBar } from "@/components/shared/search-bar";
import { ToolCard } from "@/components/shared/tool-card";
import { CategoryCard } from "@/components/shared/category-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { FAQ } from "@/components/shared/faq";
import { getAllCategories, getAllTools, getNewTools, getPopularTools } from "@/lib/tools";
import { buildFaqSchema, buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
  keywords: ["無料ツール", "便利ツール", "画像圧縮", "BMI計算", "QRコード作成", "PDF結合"],
});

const homeFaq = [
  {
    question: "利用に会員登録や料金は必要ですか？",
    answer:
      "必要ありません。すべてのツールが登録不要・無料でご利用いただけます。メールアドレスの入力を求めることもありません。",
  },
  {
    question: "アップロードした画像やPDFは外部に送信されますか？",
    answer:
      "送信されません。画像の圧縮・リサイズ・背景透過、PDFの結合といったファイルを扱うツールは、すべてお使いのブラウザ内で処理しています。ファイルがToollyのサーバーに保存されることはないため、仕事の書類や個人的な写真も安心してお使いいただけます。",
  },
  {
    question: "スマートフォンでも使えますか？",
    answer:
      "はい。すべてのツールがスマートフォン・タブレット・パソコンに対応しています。ブラウザさえあればアプリのインストールは不要です。",
  },
  {
    question: "計算結果は公的な手続きに使えますか？",
    answer:
      "手取り額や消費税などの計算結果は目安としてご利用ください。申告や契約など正式な手続きに使用する場合は、公的機関の情報や専門家にご確認ください。各ツールページの「注意事項」欄に、確認が必要な範囲を記載しています。",
  },
  {
    question: "希望するツールを追加してもらえますか？",
    answer:
      "お問い合わせフォームからご要望をお寄せください。いただいたご意見は、新しいツールの追加や既存ツールの改善の参考にさせていただいています。",
  },
];

const homeFaqSchema = buildFaqSchema(homeFaq);

const features = [
  {
    title: "登録不要・すべて無料",
    body: "会員登録もインストールも必要ありません。ページを開いたその場で操作でき、終わったらそのまま閉じられます。",
  },
  {
    title: "ファイルは端末内で処理",
    body: "画像やPDFを扱うツールは、すべてブラウザ内で処理しています。ファイルが外部のサーバーに送信されることはありません。",
  },
  {
    title: "計算の根拠を明示",
    body: "計算系のツールでは、どんな式で何を根拠に算出しているかを各ページに明記しています。目安にとどまる部分も隠しません。",
  },
  {
    title: "スマホでもそのまま",
    body: "スマートフォン・タブレット・パソコンのいずれでも同じ操作で使えます。外出先での急な調べものにも対応します。",
  },
];

export default function Home() {
  const popularTools = getPopularTools(6);
  const newTools = getNewTools(8);
  const categories = getAllCategories();
  const allTools = getAllTools();

  return (
    <div className="pb-24">
      <Script
        id="home-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
        <Container className="flex flex-col items-center gap-6 py-20 text-center sm:py-28">
          <Reveal>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Toolly
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-xl font-bold sm:text-2xl">毎日使える無料便利ツール</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base sm:max-w-none sm:whitespace-nowrap">
              インストール不要・登録不要。仕事や日常で役立つ便利ツールを無料で利用できます。
            </p>
          </Reveal>
          <Reveal delay={0.15} className="w-full flex justify-center">
            <SearchBar />
          </Reveal>
        </Container>
      </section>

      <Container className="mt-16 space-y-20 sm:mt-24">
        {/* Popular tools */}
        <section aria-labelledby="popular-heading">
          <SectionHeading title="人気ツール" description="よく使われている定番ツール" href="/tools" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} showBadge="popular" />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section aria-labelledby="category-heading">
          <SectionHeading title="カテゴリーから探す" description="目的に合わせてツールを探せます" href="/category" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </section>

        {/* New tools */}
        <section aria-labelledby="new-heading">
          <SectionHeading title="新着ツール" description="最近追加されたツール" href="/tools" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} showBadge="new" />
            ))}
          </div>
        </section>

        {/* What Toolly is */}
        <section aria-labelledby="about-heading" className="max-w-3xl">
          <SectionHeading title="Toollyについて" description="どんなサイトで、何ができるのか" />
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              Toolly（トゥーリー）は、仕事や暮らしの中で「ちょっとだけ必要になる作業」をその場で片づけるための、
              日本語のWebツールサイトです。現在{allTools.length}種類のツールを{categories.length}
              つのカテゴリーに分けて公開しており、すべて無料・登録不要でご利用いただけます。
            </p>
            <p>
              画像を1枚だけ小さくしたい、PDFを2つつなげたい、税込価格から本体価格を知りたい、今年が厄年かどうか調べたい。
              こうした用件のために専用ソフトを入れたり、会員登録をしたり、使い方を調べたりするのは負担です。
              Toollyは、ページを開いた瞬間に目的の操作ができ、終わったらそのまま閉じられることを目指してつくられています。
            </p>
            <p>
              各ツールのページには、操作手順に加えて、計算や変換の根拠、具体的な利用例、そして
              「どこまでが目安で、どこからは公的機関での確認が必要か」という注意事項を記載しています。
              数字や判定の意味を理解したうえで使っていただくためです。運営方針の詳細は
              <Link href="/about" className="text-primary underline underline-offset-2">
                サイトについて
              </Link>
              をご覧ください。
            </p>
          </div>
        </section>

        {/* Features */}
        <section aria-labelledby="features-heading">
          <SectionHeading title="Toollyの特徴" description="安心して使っていただくために" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <h3 className="font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl">
          <FAQ items={homeFaq} />
        </section>
      </Container>
    </div>
  );
}
