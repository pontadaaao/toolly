# Toolly

**毎日使える無料便利ツール** — インストール不要・登録不要で使える無料ツール集です。画像圧縮・PDF結合・各種計算ツールなど、仕事や日常で役立つツールをブラウザだけで完結して提供します。

## 主な特徴

- Next.js 15 (App Router) + TypeScript による静的生成中心の構成
- 画像圧縮・PDF結合・画像リサイズ・WebP変換などはすべて**ブラウザ内処理**（ファイルはサーバーに送信されません）
- ダークモード対応、レスポンシブ対応（スマホ最優先）
- ツールごとの SEO（title / description / OGP / Twitter Card / canonical / 構造化データ）を自動生成
- 100〜300 個以上のツール追加を見据えた、データ駆動のアーキテクチャ

## 起動方法

### 必要環境

- Node.js 20 以上
- npm

### セットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動（http://localhost:3000）
npm run dev
```

### その他のコマンド

```bash
# 本番ビルド
npm run build

# 本番ビルドの起動
npm run start

# Lint
npm run lint
```

## 使用ライブラリ

| カテゴリ | ライブラリ |
| --- | --- |
| フレームワーク | Next.js 15 (App Router), React 18, TypeScript |
| スタイリング | Tailwind CSS v4, tailwind-merge, class-variance-authority |
| UIコンポーネント | shadcn/ui（内部で `@base-ui/react` を使用） |
| アイコン | lucide-react |
| アニメーション | Framer Motion |
| ダークモード | next-themes |
| トースト通知 | sonner |
| ドラッグ&ドロップ | react-dropzone |
| 画像圧縮 | browser-image-compression |
| PDF結合 | pdf-lib |
| QRコード生成 | qrcode |

## ディレクトリ構成

```
Toolly/
├── app/                      # App Router のページ・レイアウト
│   ├── layout.tsx            # ルートレイアウト（Header/Footer/テーマ/構造化データ）
│   ├── page.tsx              # トップページ
│   ├── sitemap.ts            # サイトマップ自動生成
│   ├── robots.ts             # robots.txt 自動生成
│   ├── tools/
│   │   ├── page.tsx          # ツール一覧（検索対応）
│   │   └── [slug]/page.tsx   # ツール詳細ページ（全ツール共通レイアウト）
│   ├── category/
│   │   ├── page.tsx          # カテゴリー一覧
│   │   └── [slug]/page.tsx   # カテゴリー別ツール一覧
│   ├── about/ contact/ terms/ privacy/  # 静的ページ
│   └── globals.css           # デザイントークン（カラー・角丸・シャドウ）
│
├── components/
│   ├── ui/                   # shadcn/ui の基本コンポーネント（Button, Card, Select 等）
│   ├── layout/                # Header, Footer, ThemeProvider, ThemeToggle
│   └── shared/                 # ToolLayout, Breadcrumb, SearchBar, CategoryCard,
│                                # ToolCard, ResultCard, FAQ, RelatedTools,
│                                # FileDropzone, EmptyState, ToolSkeleton など
│
├── features/                 # ツールごとの実装（1ツール = 1ディレクトリ）
│   ├── graduation-date/  bmi/  consumption-tax/  char-counter/
│   ├── qr-code/  image-compress/  pdf-merge/  image-resize/
│   └── sns-size/  webp-convert/  take-home-pay/
│
├── data/                      # サイトのコンテンツデータ（ツール・カテゴリー情報の一元管理）
│   ├── tools.ts               # 全ツールの定義（名称・説明・FAQ・使い方など）
│   ├── categories.ts          # カテゴリー定義
│   ├── prefectures.ts         # 都道府県データ（手取り計算用）
│   └── sns-presets.ts         # SNSサイズプリセット
│
├── lib/                        # アプリ全体のロジック
│   ├── tools.ts                # ツール検索・絞り込みなどのクエリ関数
│   ├── seo.ts                  # メタデータ・構造化データ生成ヘルパー
│   ├── icon-map.ts             # アイコン名 → lucide-react コンポーネントの対応表
│   ├── tool-components.tsx     # ツールslug → 実装コンポーネントの対応表（動的import）
│   ├── config.ts               # サイト全体のフィーチャーフラグ（広告表示など）
│   └── utils.ts                # `cn()` などの汎用ユーティリティ
│
├── utils/                       # 純粋関数（各ツールの計算ロジック）
│   ├── date.ts                  # 卒業日計算・和暦変換
│   ├── bmi.ts                   # BMI計算
│   ├── tax.ts                   # 消費税計算
│   ├── text.ts                  # 文字数カウント
│   ├── finance.ts               # 手取り計算
│   └── image.ts                 # 画像読み込み・Canvas変換共通処理
│
├── types/                     # 型定義（ToolDefinition, CategoryDefinition 等）
├── hooks/                     # 汎用カスタムフック（今後追加予定）
└── public/                    # 静的アセット
```

### ツールを追加する方法

新しいツールは、以下の3ステップで追加できます。

1. `data/tools.ts` に `ToolDefinition` を1件追加する（名称・説明・カテゴリー・FAQ・使い方・関連ツールなど）
2. `features/<slug>/` に、そのツールの実装コンポーネント（Client Component）を追加する
3. `lib/tool-components.tsx` に `slug → コンポーネント` の対応（`next/dynamic` によるコード分割）を1行追加する

ページ（パンくずリスト・タイトル・説明文・使い方・FAQ・関連ツール・SEO・構造化データ）は `ToolLayout` と `app/tools/[slug]/page.tsx` が共通で処理するため、個別ページを作る必要はありません。

## デプロイ方法（Vercel）

1. GitHub 等にリポジトリをプッシュします。
2. [Vercel](https://vercel.com/new) で当リポジトリをインポートします。
3. Framework Preset は自動的に **Next.js** が検出されます（追加設定は不要です）。
4. 環境変数 `NEXT_PUBLIC_SITE_URL` に本番ドメイン（例: `https://toolly.example.com`）を設定します（未設定の場合は `lib/seo.ts` のデフォルト値が使われます）。
5. 「Deploy」を実行するとビルド・デプロイが完了します。

以降は `main` ブランチへの push で自動的に再デプロイされます。

### Vercel CLI を使う場合

```bash
npm i -g vercel
vercel        # プレビューデプロイ
vercel --prod # 本番デプロイ
```
