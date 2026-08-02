import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "利用規約",
  description: `${siteConfig.name}のご利用にあたっての規約です。`,
  path: "/terms",
});

const sections = [
  {
    title: "第1条（適用）",
    body: "本規約は、Toolly（以下「当サイト」）が提供する各種便利ツール（以下「本サービス」）の利用条件を定めるものです。利用者は本規約に同意の上、本サービスをご利用いただくものとします。",
  },
  {
    title: "第2条（利用登録）",
    body: "本サービスは登録不要でご利用いただけます。アカウント登録の仕組みは提供していません。",
  },
  {
    title: "第3条（禁止事項）",
    body: "利用者は、法令または公序良俗に違反する行為、当サイトのサーバーやネットワークに過度な負荷をかける行為、本サービスの運営を妨害する行為などを行ってはならないものとします。",
  },
  {
    title: "第4条（免責事項）",
    body: "当サイトは、本サービスの計算結果・生成物の正確性、完全性、有用性等について、いかなる保証も行いません。本サービスの利用により生じた損害について、当サイトは一切の責任を負わないものとします。",
  },
  {
    title: "第5条（サービス内容の変更・停止）",
    body: "当サイトは、利用者への事前の告知なく、本サービスの内容を変更、追加、または停止することができるものとします。",
  },
  {
    title: "第6条（規約の変更）",
    body: "当サイトは、必要と判断した場合には、利用者への個別の通知なく本規約を変更できるものとします。変更後の規約は、当サイトに掲載した時点から効力を生じるものとします。",
  },
];

export default function TermsPage() {
  return (
    <Container className="max-w-3xl py-8 sm:py-12">
      <Breadcrumb items={[{ name: "利用規約" }]} />

      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">利用規約</h1>
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
