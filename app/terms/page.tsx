import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "利用規約",
  description: `${siteConfig.name}のご利用にあたっての規約です。`,
  path: "/terms",
});

const sections: { title: string; body: string[]; list?: string[] }[] = [
  {
    title: "第1条（適用）",
    body: [
      "本規約は、本サービスの利用に関する当サイトと利用者との間の一切の関係に適用されます。",
      "当サイトは、本規約のほか、本サービスに関する個別のルールやガイドラインを定める場合があります。これらは本規約の一部を構成するものとします。",
    ],
  },
  {
    title: "第2条（サービス内容）",
    body: [
      "当サイトは、各種便利ツール、計算ツール、画像編集ツールその他関連サービスを提供します。",
      "当サイトは、サービス内容を予告なく変更、追加、停止または終了することがあります。",
    ],
  },
  {
    title: "第3条（禁止事項）",
    body: ["利用者は、本サービスの利用にあたり、以下の行為を行ってはなりません。"],
    list: [
      "法令または公序良俗に反する行為",
      "犯罪行為に関連する行為",
      "当サイトまたは第三者の知的財産権を侵害する行為",
      "当サイトまたは第三者のサーバー・ネットワークに過度な負荷をかける行為",
      "プログラムやシステムへの不正アクセスまたはその試み",
      "自動化ツール等を用いた過度なアクセス",
      "当サイトの運営を妨害する行為",
      "他の利用者または第三者に損害を与える行為",
      "その他、当サイトが不適切と判断する行為",
    ],
  },
  {
    title: "第4条（知的財産権）",
    body: [
      "当サイトに掲載される文章、画像、デザイン、ロゴ、プログラムその他のコンテンツに関する著作権その他の知的財産権は、当サイトまたは正当な権利者に帰属します。",
      "法令により認められる場合を除き、無断で複製、転載、改変、配布等を行うことを禁止します。",
    ],
  },
  {
    title: "第5条（免責事項）",
    body: [
      "当サイトは、本サービスの正確性、完全性、有用性、最新性、安全性について保証するものではありません。",
      "本サービスの利用または利用できなかったことにより生じた損害について、当サイトは一切の責任を負いません。",
      "当サイトで提供する計算結果や変換結果は参考情報であり、その内容について保証するものではありません。重要な手続きや契約等に利用する場合は、必ず公的機関や関係機関の情報をご確認ください。",
      "利用者と第三者との間で生じたトラブルについて、当サイトは責任を負いません。",
    ],
  },
  {
    title: "第6条（広告）",
    body: [
      "当サイトでは、第三者配信による広告を掲載する場合があります。",
      "広告先の商品・サービス等については、各広告主の責任により提供されるものであり、当サイトはその内容について責任を負いません。",
    ],
  },
  {
    title: "第7条（外部リンク）",
    body: [
      "当サイトには外部サイトへのリンクが含まれる場合があります。",
      "リンク先サイトで提供される情報、サービス等について、当サイトは責任を負いません。",
    ],
  },
  {
    title: "第8条（サービスの停止）",
    body: ["当サイトは、以下の場合、事前の通知なく本サービスの全部または一部を停止または中断することがあります。"],
    list: [
      "システム保守を行う場合",
      "システム障害が発生した場合",
      "災害、停電、通信障害等によりサービス提供が困難となった場合",
      "その他、当サイトが必要と判断した場合",
    ],
  },
  {
    title: "第9条（規約の変更）",
    body: [
      "当サイトは、必要と判断した場合、本規約を予告なく変更できるものとします。",
      "変更後の利用規約は、本ページに掲載した時点で効力を生じるものとします。",
    ],
  },
  {
    title: "第10条（準拠法・裁判管轄）",
    body: [
      "本規約は日本法に準拠します。",
      "本サービスに関して紛争が生じた場合には、当サイト運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。",
    ],
  },
];

export default function TermsPage() {
  return (
    <Container className="max-w-3xl py-8 sm:py-12">
      <Breadcrumb items={[{ name: "利用規約" }]} />

      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">利用規約</h1>

      <div className="mt-6 space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <p>
          この利用規約（以下、「本規約」といいます。）は、Toolly（以下、「当サイト」といいます。）が提供する各種サービス（以下、「本サービス」といいます。）の利用条件を定めるものです。
        </p>
        <p>本サービスをご利用いただくことで、本規約に同意したものとみなします。</p>
      </div>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 text-base font-semibold text-foreground">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="not-last:mb-2">
                {paragraph}
              </p>
            ))}
            {section.list && (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">制定日：2026年8月2日</p>
    </Container>
  );
}
