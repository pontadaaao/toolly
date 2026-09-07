import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { getAllTools } from "@/lib/tools";
import { categories } from "@/data/categories";
import { buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "サイトについて・運営者情報",
  description:
    "Toollyの運営方針、ツールの作り方、安全性への考え方、広告掲載についてご説明します。運営者情報とお問い合わせ先もこちらに記載しています。",
  path: "/about",
  keywords: ["Toolly", "運営者情報", "サイトについて", "運営方針", "お問い合わせ"],
});

const toolCount = getAllTools().length;

export default function AboutPage() {
  return (
    <Container className="max-w-3xl py-8 sm:py-12">
      <Breadcrumb items={[{ name: "サイトについて" }]} />

      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">サイトについて・運営者情報</h1>

      <div className="mt-8 space-y-10 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Toollyとは</h2>
          <p className="mb-3">
            Toolly（トゥーリー）は、「毎日使える無料便利ツール」をコンセプトに運営している日本語のWebツールサイトです。
            画像の圧縮・リサイズ・背景透過といった画像編集、PDFの結合、消費税や手取り給与の計算、厄年や七五三といった暮らしの調べもの、
            文字数カウントやQRコード作成など、現在
            {toolCount}
            種類のツールを{categories.length}つのカテゴリーに分けて公開しています。すべて無料で、会員登録もソフトのインストールも必要ありません。
          </p>
          <p>
            「やりたいことは1つだけなのに、専用ソフトを入れたり、会員登録をしたり、使い方を調べたりしなければならない」——
            そうした小さな手間をなくすことがToollyの目的です。ページを開いた瞬間に目的の操作ができ、終わったらそのまま閉じられる。
            そんな道具のような使い心地を目指しています。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">ツールを作るときに大切にしていること</h2>
          <dl className="space-y-4">
            <div>
              <dt className="font-medium text-foreground">1. 開いてすぐ使えること</dt>
              <dd className="mt-1">
                会員登録・ログイン・メールアドレスの入力は一切求めません。ページを開いたその画面で、説明を読まなくても操作が完了することを基準に設計しています。
              </dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">2. ファイルを外部に送らないこと</dt>
              <dd className="mt-1">
                画像編集・PDF結合・背景透過などのファイルを扱うツールは、すべてお使いのブラウザ内（クライアントサイド）で処理しています。
                アップロードした画像やPDFがToollyのサーバーに送信されることはありません。仕事の書類や家族の写真も、外部に出すことなく扱えます。
              </dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">3. 計算の根拠を示すこと</dt>
              <dd className="mt-1">
                計算系のツールでは、結果の数字だけを出して終わりにせず、「どんな式で、何を根拠に計算しているか」を各ページの
                「計算方法・変換方法」欄に明記しています。数字の意味を理解したうえで判断していただくためです。
              </dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">4. 限界を隠さないこと</dt>
              <dd className="mt-1">
                手取り額の試算や厄年の判定のように、前提条件によって結果が変わるものや、地域・慣習によって扱いが異なるものがあります。
                各ページの「注意事項」欄で、どこまでが目安でどこからは公的機関等での確認が必要かを明示しています。
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">コンテンツの作成方針</h2>
          <p className="mb-3">
            各ツールページに掲載している解説（使い方・計算方法・利用例・注意事項・よくある質問）は、
            運営者がツールの実装内容と一次情報にあたって作成しています。制度や税率などが関わる内容については、
            省庁・自治体・業界団体などの公開情報を確認したうえで記述し、変更があった場合は随時見直します。
          </p>
          <p>
            誤りや古くなった記述を見つけられた場合は、
            <Link href="/contact" className="text-primary underline underline-offset-2">
              お問い合わせフォーム
            </Link>
            よりご指摘いただけますと幸いです。確認のうえ修正いたします。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">広告の掲載について</h2>
          <p className="mb-3">
            Toollyは、サーバー費用やツールの開発・保守にかかる費用をまかなうため、第三者配信の広告サービスを利用する場合があります。
            広告の表示にあたっては、ツールの操作の妨げにならないことを優先し、操作ボタンの近くに紛らわしい形で広告を配置することはいたしません。
          </p>
          <p>
            広告配信に伴うCookieの利用と、その無効化の方法については
            <Link href="/privacy" className="text-primary underline underline-offset-2">
              プライバシーポリシー
            </Link>
            に記載しています。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">運営者情報</h2>
          <dl className="divide-y divide-border rounded-xl border border-border">
            <div className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <dt className="font-medium text-foreground">サイト名</dt>
              <dd>{siteConfig.name}（トゥーリー）</dd>
            </div>
            <div className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <dt className="font-medium text-foreground">URL</dt>
              <dd className="break-all">{siteConfig.url}</dd>
            </div>
            <div className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <dt className="font-medium text-foreground">運営者</dt>
              <dd>{siteConfig.operator}</dd>
            </div>
            <div className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <dt className="font-medium text-foreground">運営開始</dt>
              <dd>{siteConfig.establishedAt}</dd>
            </div>
            <div className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <dt className="font-medium text-foreground">事業内容</dt>
              <dd>Webツールサイトの企画・開発・運営</dd>
            </div>
            <div className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <dt className="font-medium text-foreground">お問い合わせ</dt>
              <dd>
                <Link href="/contact" className="text-primary underline underline-offset-2">
                  お問い合わせフォーム
                </Link>
                （ご意見・ご要望・不具合報告・掲載内容に関するご指摘）
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">今後について</h2>
          <p>
            Toollyは現在も開発を続けています。お問い合わせフォームからいただいたご要望は、
            新しいツールの追加や既存ツールの改善の参考にさせていただいています。
            「こんなツールがあると助かる」というご意見がありましたら、ぜひお聞かせください。
          </p>
        </section>
      </div>
    </Container>
  );
}
