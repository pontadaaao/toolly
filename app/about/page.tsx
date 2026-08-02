import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "サイトについて",
  description: "Toollyは、インストール不要・登録不要で使える無料の便利ツールをまとめて提供するWebサービスです。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container className="max-w-3xl py-8 sm:py-12">
      <Breadcrumb items={[{ name: "サイトについて" }]} />

      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">サイトについて</h1>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Toollyとは</h2>
          <p>
            Toollyは「毎日使える無料便利ツール」をコンセプトに、インストール不要・登録不要で使える便利ツールをまとめて提供するWebサービスです。画像圧縮やPDF結合、各種計算ツールなど、仕事や日常のちょっとした困りごとをその場で解決できることを目指しています。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">大切にしていること</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>登録・インストールなしで、誰でもすぐに使えること</li>
            <li>画像やPDFなどの処理はできる限りブラウザ内で完結させ、ファイルを外部サーバーに送らないこと</li>
            <li>シンプルで分かりやすい操作画面を提供すること</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">今後について</h2>
          <p>
            Toollyは現在も開発中のサービスです。今後も皆さまの声を参考にしながら、便利なツールを追加してまいります。
          </p>
        </section>
      </div>
    </Container>
  );
}
