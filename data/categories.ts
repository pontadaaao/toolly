import type { CategoryDefinition } from "@/types/tool";

export const categories: CategoryDefinition[] = [
  {
    slug: "image",
    name: "画像",
    description: "画像の圧縮・リサイズ・変換など、画像まわりの便利ツール",
    icon: "Image",
  },
  {
    slug: "pdf",
    name: "PDF",
    description: "PDFの結合・編集がブラウザだけで完結するツール",
    icon: "FileText",
  },
  {
    slug: "calculator",
    name: "計算",
    description: "BMIや税金、手取り給与など日常で役立つ計算ツール",
    icon: "Calculator",
  },
  {
    slug: "text",
    name: "テキスト",
    description: "文字数カウントやQRコード作成などのテキスト系ツール",
    icon: "Type",
  },
  {
    slug: "life",
    name: "人生・暮らし",
    description: "厄年・年齢計算・七五三・六曜など、人生の節目や日々の暮らしに役立つツール",
    icon: "Heart",
  },
  {
    slug: "creator",
    name: "SNS・クリエイター",
    description: "ハッシュタグ生成など、SNS投稿やコンテンツ制作に役立つツール",
    icon: "Hash",
  },
  {
    slug: "web",
    name: "Web・開発",
    description: "URLエンコードやバーコード作成など、Web制作・開発に役立つツール",
    icon: "Code2",
  },
  {
    slug: "money",
    name: "お金・計算",
    description: "ガソリン代やポイント還元、年収換算など、お金にまつわる計算ツール",
    icon: "Coins",
  },
];
