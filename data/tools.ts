import type { ToolDefinition } from "@/types/tool";

/**
 * The tool catalog. This array is the single source of truth for:
 * - the homepage (popular / new sections)
 * - /tools and /category/[slug] listings
 * - each /tools/[slug] page (content, SEO, FAQ schema, related tools)
 * - search
 *
 * To add a new tool: append an entry here, add its feature component under
 * `features/<slug>/`, and render it from `app/tools/[slug]/page.tsx`'s
 * tool→component map. Nothing else needs to change.
 */
export const tools: ToolDefinition[] = [
  {
    slug: "graduation-date",
    name: "卒業日計算",
    shortDescription: "生年月日から小学校〜大学の入学・卒業日をまとめて計算",
    description:
      "生年月日を入力するだけで、小学校・中学校・高校・大学の入学日と卒業予定日をまとめて自動計算します。西暦・和暦の両方に対応しているので、経歴書や年表の作成にもそのまま使えます。",
    category: "calculator",
    icon: "GraduationCap",
    isPopular: false,
    releasedAt: "2026-07-20",
    keywords: ["卒業日", "入学日", "生年月日", "早生まれ", "和暦", "西暦", "小学校", "中学校", "高校", "大学"],
    howToUse: [
      "生年月日を入力します。",
      "日本の学校制度（4月入学・4月2日基準の学年区分）に沿って、小学校から大学までの入学日・卒業予定日が自動で一覧表示されます。",
    ],
    faq: [
      {
        question: "浪人・留年している場合は使えますか？",
        answer:
          "本ツールは、生年月日から算出した標準の学年進行（留年・浪人なし、大学4年で卒業）で計算します。実際に浪人や留年がある場合は目安としてご利用ください。",
      },
      {
        question: "早生まれ（1〜3月生まれ）でも正しく計算できますか？",
        answer:
          "はい。日本の学校制度に合わせて4月2日を学年の区切りとしているため、早生まれの方も正しい学年で入学・卒業日が計算されます。",
      },
    ],
    relatedSlugs: ["bmi", "take-home-pay"],
  },
  {
    slug: "bmi",
    name: "BMI計算",
    shortDescription: "身長と体重からBMIと標準体重を自動判定",
    description:
      "身長と体重を入力するだけでBMI値、肥満度判定、標準体重をすぐに確認できます。健康管理やダイエットの目標設定にお役立てください。",
    category: "calculator",
    icon: "Activity",
    isPopular: true,
    releasedAt: "2026-06-01",
    keywords: ["BMI", "体重", "身長", "標準体重", "肥満度", "健康"],
    howToUse: [
      "身長（cm）を入力します。",
      "体重（kg）を入力します。",
      "BMI値・判定・標準体重が自動的に表示されます。",
    ],
    faq: [
      {
        question: "BMIの計算式は何ですか？",
        answer: "BMI = 体重(kg) ÷ (身長(m) × 身長(m)) で計算しています。",
      },
      {
        question: "標準体重はどう計算していますか？",
        answer: "日本肥満学会の基準に基づき、BMI22を標準として標準体重を算出しています。",
      },
    ],
    relatedSlugs: ["consumption-tax", "take-home-pay"],
  },
  {
    slug: "consumption-tax",
    name: "消費税計算",
    shortDescription: "税込・税抜を8%/10%で相互に変換",
    description:
      "金額を入力するだけで税込・税抜金額を相互に計算します。税率8%・10%に対応し、端数処理（四捨五入・切り上げ・切り捨て）も選択可能です。",
    category: "calculator",
    icon: "Percent",
    isPopular: false,
    releasedAt: "2026-07-05",
    keywords: ["消費税", "税込", "税抜", "8%", "10%", "端数処理"],
    howToUse: [
      "金額を入力します。",
      "税込→税抜、または税抜→税込を選択します。",
      "税率（8%・10%）と端数処理方法を選び、結果を確認します。",
    ],
    faq: [
      {
        question: "軽減税率8%はどんな時に使いますか？",
        answer: "飲食料品のテイクアウトや新聞など、軽減税率対象品目の計算に8%をご利用ください。",
      },
      {
        question: "端数処理はどれを選べばいいですか？",
        answer: "会計処理のルールに合わせて選択してください。一般的な小売では四捨五入が多く使われます。",
      },
    ],
    relatedSlugs: ["take-home-pay", "bmi"],
  },
  {
    slug: "char-counter",
    name: "文字数カウント",
    shortDescription: "文字数・空白除外・改行数・読了時間をリアルタイム表示",
    description:
      "テキストを貼り付けるだけで、文字数、空白を除いた文字数、改行数、読了時間の目安をリアルタイムに表示します。SNS投稿や原稿の文字数確認に便利です。",
    category: "text",
    icon: "Type",
    isPopular: true,
    releasedAt: "2026-05-10",
    keywords: ["文字数カウント", "文字数", "読了時間", "文字数チェック"],
    howToUse: [
      "テキストエリアに文章を入力または貼り付けます。",
      "文字数・空白除外文字数・改行数がリアルタイムに更新されます。",
      "読了時間の目安も自動で表示されます。",
    ],
    faq: [
      {
        question: "入力したテキストは保存されますか？",
        answer: "いいえ。すべての処理はブラウザ内で完結し、サーバーには送信・保存されません。",
      },
      {
        question: "読了時間はどう計算していますか？",
        answer: "日本語は1分あたり約400〜600文字を目安に算出しています。",
      },
    ],
    relatedSlugs: ["qr-code"],
  },
  {
    slug: "qr-code",
    name: "QRコード作成",
    shortDescription: "URL・文字・電話番号・メールからQRコードを生成",
    description:
      "URL、テキスト、電話番号、メールアドレスからその場でQRコードを生成できます。PNG・SVG形式でのダウンロードにも対応しています。",
    category: "text",
    icon: "QrCode",
    isPopular: true,
    releasedAt: "2026-04-15",
    keywords: ["QRコード", "QRコード作成", "QR generator", "URL QR"],
    howToUse: [
      "作成したい種類（URL・文字・電話番号・メール）を選択します。",
      "内容を入力すると、QRコードがその場で生成されます。",
      "PNGまたはSVG形式でダウンロードします。",
    ],
    faq: [
      {
        question: "生成したQRコードは商用利用できますか？",
        answer: "はい、生成されたQRコードは自由にご利用いただけます。",
      },
      {
        question: "有効期限はありますか？",
        answer: "QRコード自体に有効期限はありません。ただしリンク先のURLが無効になると読み取れなくなります。",
      },
    ],
    relatedSlugs: ["char-counter"],
  },
  {
    slug: "image-compress",
    name: "画像圧縮",
    shortDescription: "ドラッグ&ドロップで画像を一括圧縮、容量を比較",
    description:
      "画像をドラッグ&ドロップするだけでブラウザ内で圧縮できます。画質を調整しながら圧縮前後の容量を比較し、複数枚まとめてダウンロードできます。",
    category: "image",
    icon: "FileArchive",
    isPopular: true,
    releasedAt: "2026-03-01",
    keywords: ["画像圧縮", "画像 軽量化", "容量削減", "画像 サイズ縮小"],
    howToUse: [
      "画像をドラッグ&ドロップ、または選択してアップロードします。",
      "画質スライダーで圧縮率を調整します。",
      "圧縮前後の容量を比較し、ダウンロードします。",
    ],
    faq: [
      {
        question: "アップロードした画像は外部に送信されますか？",
        answer: "いいえ。すべての圧縮処理はブラウザ内で行われ、サーバーには送信されません。",
      },
      {
        question: "対応している画像形式は？",
        answer: "JPEG・PNG・WebPに対応しています。",
      },
    ],
    relatedSlugs: ["image-resize", "webp-convert", "sns-size"],
  },
  {
    slug: "pdf-merge",
    name: "PDF結合",
    shortDescription: "複数のPDFをドラッグ&ドロップで並び替えて結合",
    description:
      "複数のPDFファイルをドラッグ&ドロップで読み込み、順番を並び替えてから1つのPDFに結合できます。すべてブラウザ内で処理されるため安心です。",
    category: "pdf",
    icon: "Combine",
    isPopular: true,
    releasedAt: "2026-02-10",
    keywords: ["PDF結合", "PDF 結合", "PDFまとめる", "PDF マージ"],
    howToUse: [
      "結合したいPDFファイルをドラッグ&ドロップでアップロードします。",
      "一覧から順番をドラッグで並び替えます。",
      "「結合する」を押して1つのPDFとしてダウンロードします。",
    ],
    faq: [
      {
        question: "ファイルはサーバーにアップロードされますか？",
        answer: "いいえ。結合処理はすべてブラウザ内（クライアントサイド）で完結します。",
      },
      {
        question: "パスワード付きPDFは結合できますか？",
        answer: "パスワードで保護されたPDFは非対応です。事前に解除してからご利用ください。",
      },
    ],
    relatedSlugs: ["image-compress", "image-resize"],
  },
  {
    slug: "image-resize",
    name: "画像リサイズ",
    shortDescription: "横幅・縦幅を指定して画像を一括リサイズ",
    description:
      "横幅・縦幅を指定するだけで画像をリサイズできます。縦横比を固定したまま複数枚をまとめて処理することも可能です。",
    category: "image",
    icon: "Ratio",
    isPopular: false,
    releasedAt: "2026-07-25",
    keywords: ["画像リサイズ", "画像 サイズ変更", "縦横比固定"],
    howToUse: [
      "画像をアップロードします。",
      "横幅・縦幅を入力します（比率固定もON/OFFできます）。",
      "一括処理して、リサイズ後の画像をダウンロードします。",
    ],
    faq: [
      {
        question: "画質は劣化しますか？",
        answer: "リサイズの倍率によって多少の劣化はありますが、高品質な補間処理を行っています。",
      },
      {
        question: "複数枚まとめて処理できますか？",
        answer: "はい。複数枚の画像を一括でアップロードし、同じ設定でリサイズできます。",
      },
    ],
    relatedSlugs: ["image-compress", "sns-size", "webp-convert"],
  },
  {
    slug: "sns-size",
    name: "SNSサイズ変換",
    shortDescription: "Instagram・TikTok・X・LINEなど投稿サイズに一発変換",
    description:
      "Instagram（1:1・4:5・ストーリー）、TikTok、YouTube、X、LINEなど、各SNSの推奨投稿サイズに画像を一発変換できます。",
    category: "image",
    icon: "Layers",
    isPopular: true,
    releasedAt: "2026-01-20",
    keywords: ["SNSサイズ", "Instagramサイズ", "TikTokサイズ", "投稿サイズ変換"],
    howToUse: [
      "画像をアップロードします。",
      "変換したいSNSとサイズ（例：Instagram 1:1）を選択します。",
      "プレビュー枠内で画像をドラッグして位置を調整し、必要に応じて拡大率も変更します。",
      "枠内に表示されている内容がそのままダウンロードされます。",
    ],
    faq: [
      {
        question: "対応しているSNSは？",
        answer: "Instagram（1:1・4:5・ストーリー）、TikTok、YouTube、X、LINEに対応しています。",
      },
      {
        question: "画像がはみ出す場合はどうなりますか？",
        answer: "はみ出した部分は自動でトリミングされます。プレビュー枠内で画像をドラッグ・拡大して、見せたい部分を自由に調整できます。",
      },
    ],
    relatedSlugs: ["image-resize", "image-compress", "webp-convert"],
  },
  {
    slug: "webp-convert",
    name: "WebP変換",
    shortDescription: "PNG・JPGとWebPを相互に一括変換",
    description:
      "PNG⇔WebP、JPG⇔WebPの相互変換に対応。画質を調整しながら複数枚まとめて変換できます。",
    category: "image",
    icon: "RefreshCw",
    isPopular: false,
    releasedAt: "2026-07-28",
    keywords: ["WebP変換", "PNG WebP", "JPG WebP", "画像形式変換"],
    howToUse: [
      "変換したい画像をアップロードします。",
      "変換先の形式（WebP・PNG・JPG）と画質を選択します。",
      "一括変換して、まとめてダウンロードします。",
    ],
    faq: [
      {
        question: "WebPに対応していないブラウザでも使えますか？",
        answer: "変換処理自体はモダンブラウザで動作します。生成したWebP画像の閲覧は対応ブラウザをご利用ください。",
      },
      {
        question: "画質はどれくらい下がりますか？",
        answer: "画質スライダーで調整可能です。同程度の見た目でファイルサイズを大幅に削減できます。",
      },
    ],
    relatedSlugs: ["image-compress", "image-resize"],
  },
  {
    slug: "take-home-pay",
    name: "手取り計算",
    shortDescription: "月収・年収・雇用形態から概算の手取り額を計算",
    description:
      "月収または年収、雇用形態、都道府県、賞与の有無を入力するだけで、税金・社会保険料を差し引いた概算の手取り額を計算します。",
    category: "calculator",
    icon: "Wallet",
    isPopular: false,
    releasedAt: "2026-07-30",
    keywords: ["手取り計算", "手取り", "年収", "月収", "社会保険料", "所得税"],
    howToUse: [
      "月収または年収を入力します。",
      "雇用形態・都道府県・賞与の有無を選択します。",
      "概算の手取り額、税金、社会保険料の内訳が表示されます。",
    ],
    faq: [
      {
        question: "この計算結果は正確な金額ですか？",
        answer: "概算値です。控除や扶養状況などにより実際の金額とは差が生じます。目安としてご利用ください。",
      },
      {
        question: "都道府県によって金額が変わるのはなぜですか？",
        answer: "健康保険料率が都道府県ごとに異なるため、手取り額の概算に反映しています。",
      },
    ],
    relatedSlugs: ["consumption-tax", "bmi"],
  },
  {
    slug: "bg-remove",
    name: "背景透過",
    shortDescription: "AIが自動で人物や物体を検出して画像の背景を透過",
    description:
      "画像をアップロードするだけで、AIが人物や物体を自動検出して背景を透過したPNG画像を生成します。処理はすべてブラウザ内で完結し、画像がサーバーに送信されることはありません。",
    category: "image",
    icon: "Eraser",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["背景透過", "背景削除", "背景除去", "透過png", "切り抜き"],
    howToUse: [
      "背景を透過したい画像をアップロードします。",
      "AIが自動で被写体を検出し、背景を透過処理します。",
      "透過済みのPNG画像をダウンロードします。",
    ],
    faq: [
      {
        question: "画像はサーバーにアップロードされますか？",
        answer: "されません。AIモデルをブラウザにダウンロードし、処理はすべて端末内で完結します。画像データが外部に送信されることはありません。",
      },
      {
        question: "初回の処理に時間がかかるのはなぜですか？",
        answer: "初回利用時のみ、背景検出に使うAIモデル（数十MB）をダウンロードするため、多少時間がかかります。2回目以降は高速に処理されます。",
      },
      {
        question: "複雑な背景でも綺麗に透過できますか？",
        answer: "人物や物体の輪郭をAIが自動判定しますが、髪の毛の細部や背景と被写体の色が近い場合など、被写体によっては仕上がりに差が出ることがあります。",
      },
    ],
    relatedSlugs: ["image-compress", "image-resize", "webp-convert"],
  },
  {
    slug: "yakudoshi-checker",
    name: "厄年チェッカー",
    metaTitle: "厄年チェッカー｜生年月日から前厄・本厄・後厄を確認",
    shortDescription: "生年月日と性別、判定する年から前厄・本厄・後厄を自動判定",
    description:
      "生年月日・性別・判定する年を入力するだけで、その年の満年齢・数え年、前厄・本厄・後厄・大厄の判定、次の厄年、過去に終えた厄年をまとめて確認できます。判定年は初期値で今年が選ばれています。",
    category: "life",
    icon: "ShieldAlert",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["厄年", "厄年 早見表", "前厄", "本厄", "後厄", "大厄", "厄払い", "数え年", "厄年 年齢"],
    howToUse: [
      "生年月日を入力します。",
      "性別を選択します。",
      "判定したい年を選択します（初期値は今年です）。",
      "前厄・本厄・後厄の年と、その年が厄年かどうかが自動で表示されます。",
    ],
    calculationMethod: [
      "厄年は数え年（生まれた年を1歳とし、元日ごとに1歳加える数え方）を基準に判定します。",
      "本厄の年齢は、男性が数え25・42・61歳、女性が数え19・33・37・61歳を採用しています。本厄の前年を「前厄」、翌年を「後厄」として表示し、男性42歳・女性33歳は特に「大厄」として目立たせています。",
    ],
    faq: [
      {
        question: "厄年の年齢は数え年と満年齢のどちらで数えますか？",
        answer:
          "伝統的な厄年は数え年（生まれた年を1歳とし、元日ごとに1歳加える数え方）で数えます。本ツールも数え年を基準に算出しています。",
      },
      {
        question: "厄年の年齢は神社によって違いますか？",
        answer:
          "はい。本ツールでは広く一般的とされる年齢（男性25・42・61歳、女性19・33・37・61歳）を基準にしていますが、神社や地域によって多少異なる場合があります。",
      },
      {
        question: "厄年になると必ず良くないことが起こるのですか？",
        answer:
          "いいえ。厄年は科学的な根拠のある予測ではなく、人生の節目に無理をしすぎず過ごすための伝統的な目安です。必要以上に不安に感じる必要はありません。",
      },
    ],
    cautions: [
      "厄年の年齢や考え方は地域・神社・寺院・宗派によって異なる場合があります。",
      "厄年は伝統的な風習に基づく目安であり、必ず災いが起こることを意味するものではありません。気になる場合は、お近くの神社・寺院へご確認ください。",
    ],
    relatedSlugs: ["kazoedoshi-calculator", "age-calculator", "shichigosan-checker"],
  },
  {
    slug: "age-calculator",
    name: "年齢計算",
    shortDescription: "生年月日から満年齢・経過日数・次の誕生日をリアルタイム表示",
    description:
      "生年月日を入力するだけで、満年齢、生まれてからの日数・時間・分・秒、次の誕生日までの日数、生まれた曜日をまとめて計算します。経過秒数はリアルタイムで更新されます。",
    category: "life",
    icon: "Cake",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["年齢計算", "満年齢", "生まれてから何日", "誕生日 計算", "生まれた曜日"],
    howToUse: [
      "生年月日を入力します。",
      "満年齢・経過日数・次の誕生日までの日数などが自動で表示されます。",
      "経過秒数はリアルタイムでカウントアップし続けます。",
    ],
    faq: [
      {
        question: "満年齢はどのように計算していますか？",
        answer: "誕生日を迎えた時点で1歳加算する、日本の法律上の標準的な満年齢の数え方で計算しています。",
      },
      {
        question: "うるう年生まれでも正しく計算できますか？",
        answer: "はい。2月29日生まれの方も、うるう年でない年は2月28日を誕生日として正しく計算されます。",
      },
    ],
    relatedSlugs: ["kazoedoshi-calculator", "age-reference-table", "eto-checker"],
  },
  {
    slug: "kazoedoshi-calculator",
    name: "数え年計算",
    shortDescription: "生年月日から数え年と満年齢を同時に計算",
    description:
      "生年月日を入力するだけで、数え年と満年齢を同時に確認できます。厄年や七五三、長寿祝いなど、数え年を基準にした行事の年齢確認にお使いいただけます。",
    category: "life",
    icon: "CalendarDays",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["数え年", "数え年 計算", "数え年 満年齢 違い", "数え年とは"],
    howToUse: ["生年月日を入力します。", "数え年と満年齢が自動で計算されます。"],
    faq: [
      {
        question: "数え年と満年齢はどう違いますか？",
        answer: "満年齢は誕生日を迎えるたびに1歳加算するのに対し、数え年は生まれた時点を1歳とし、誕生日に関係なく元日を迎えるたびに1歳を加える日本の伝統的な数え方です。",
      },
      {
        question: "数え年はどんな場面で使われますか？",
        answer: "厄年、七五三、長寿祝い（還暦・古希など）といった、日本の伝統行事の年齢の基準として今も広く使われています。",
      },
    ],
    relatedSlugs: ["yakudoshi-checker", "shichigosan-checker", "longevity-celebration-checker"],
  },
  {
    slug: "shichigosan-checker",
    name: "七五三チェッカー",
    shortDescription: "生年月日と性別から今年が七五三の対象かを判定",
    description:
      "生年月日と性別を入力するだけで、今年が3歳・5歳・7歳の七五三の対象かどうかを判定します。七五三の由来やお祝い時期、神社へ行くのにおすすめの時期もあわせて確認できます。",
    category: "life",
    icon: "PartyPopper",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["七五三", "七五三 年齢", "七五三 何歳", "七五三 お祝い"],
    howToUse: [
      "子どもの生年月日を入力します。",
      "性別を選択します。",
      "今年が3歳・5歳・7歳のいずれかの対象かどうかが表示されます。",
    ],
    faq: [
      {
        question: "七五三は数え年と満年齢のどちらで祝いますか？",
        answer: "伝統的には数え年で祝いますが、近年は満年齢でお祝いする家庭も増えています。本ツールは数え年を基準に判定しています。",
      },
      {
        question: "男の子と女の子でお祝いする年齢は違いますか？",
        answer: "一般的に男の子は3歳・5歳、女の子は3歳・7歳でお祝いします。地域によっては男の子も3歳を祝わない場合があります。",
      },
    ],
    relatedSlugs: ["kazoedoshi-calculator", "age-calculator", "school-year-lookup"],
  },
  {
    slug: "longevity-celebration-checker",
    name: "長寿祝いチェッカー",
    shortDescription: "還暦から百寿まで、長寿祝いの到達状況を一覧チェック",
    description:
      "生年月日を入力するだけで、還暦・古希・喜寿・傘寿・米寿・卒寿・白寿・百寿の8つの長寿祝いについて、到達済みかどうかと次のお祝いの年をまとめて確認できます。",
    category: "life",
    icon: "Award",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["長寿祝い", "還暦", "古希", "喜寿", "米寿", "傘寿", "卒寿", "白寿", "百寿", "長寿祝い 年齢"],
    howToUse: ["生年月日を入力します。", "8つの長寿祝いの到達状況と、次に迎えるお祝いが一覧で表示されます。"],
    faq: [
      {
        question: "長寿祝いは満年齢と数え年のどちらで祝いますか？",
        answer: "近年は満年齢で祝うのが一般的なため、本ツールは満年齢を基準にしています。地域や家庭によっては数え年（+1歳）で祝う場合もあります。",
      },
      {
        question: "還暦はなぜ60歳（数え61歳）で祝うのですか？",
        answer: "干支は60年で一巡し、生まれた年の干支に戻ることから「暦が還る」として、還暦のお祝いをする風習が生まれました。",
      },
    ],
    relatedSlugs: ["age-calculator", "kazoedoshi-calculator", "eto-checker"],
  },
  {
    slug: "coming-of-age-calculator",
    name: "成人年計算",
    shortDescription: "生年月日から成人した年と成人式の目安年度を計算",
    description:
      "生年月日を入力するだけで、法律上の成人年齢（18歳）に達する年と、多くの自治体で開催される成人式（二十歳のつどい）の目安年度をまとめて計算します。",
    category: "life",
    icon: "UserCheck",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["成人年齢", "成人式 いつ", "18歳 成人", "二十歳のつどい", "成人年 計算"],
    howToUse: ["生年月日を入力します。", "成人した年（満18歳）と、成人式（二十歳のつどい）の目安年度が表示されます。"],
    faq: [
      {
        question: "成人年齢はなぜ18歳になったのですか？",
        answer: "2022年4月1日の民法改正により、成人年齢が20歳から18歳に引き下げられたためです。ただし飲酒・喫煙などは従来どおり20歳までできません。",
      },
      {
        question: "成人式も18歳で行われるのですか？",
        answer: "多くの自治体では、受験や就職活動の時期と重なる18歳ではなく、従来どおり20歳を対象に「成人式」（近年は「二十歳のつどい」）を開催しています。",
      },
    ],
    relatedSlugs: ["age-calculator", "school-year-lookup", "kazoedoshi-calculator"],
  },
  {
    slug: "school-year-lookup",
    name: "入学・卒業早見",
    shortDescription: "生年月日から保育園〜大学までの入学・卒業予定日を一覧表示",
    description:
      "生年月日を入力するだけで、日本の学校制度に沿って保育園・幼稚園・小学校・中学校・高校・大学の入園・入学日と卒園・卒業予定日をまとめて計算します。4月2日生まれを基準にした早生まれの学年判定にも対応しています。",
    category: "life",
    icon: "School",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["入学 卒業 早見表", "何年生 生まれ年", "早生まれ 学年", "入学年度", "卒業年度"],
    howToUse: ["生年月日を入力します。", "保育園から大学までの入園・入学日、卒園・卒業予定日が一覧で表示されます。"],
    faq: [
      {
        question: "早生まれ（1〜3月生まれ）でも正しく計算できますか？",
        answer: "はい。日本の学校制度に合わせて4月2日を学年の区切りとしているため、早生まれの方も正しい学年で入学・卒業日が計算されます。",
      },
      {
        question: "保育園の入園日も計算されますか？",
        answer: "保育園は0歳から就学前まで利用でき、入園時期がご家庭や自治体の状況によって異なるため、具体的な入園日ではなく利用可能時期の目安を表示しています。",
      },
    ],
    relatedSlugs: ["shichigosan-checker", "coming-of-age-calculator", "age-calculator"],
  },
  {
    slug: "age-reference-table",
    name: "年齢早見表",
    shortDescription: "生まれ年から満年齢・数え年をすぐ調べられる一覧表",
    description:
      "生まれ年（西暦・和暦）から満年齢・数え年をすぐに調べられる早見表です。キーワード検索で目的の年や年齢にすぐアクセスできます。",
    category: "life",
    icon: "Table2",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["年齢早見表", "生まれ年 早見表", "西暦 和暦 早見表", "満年齢 一覧"],
    howToUse: [
      "西暦・和暦の表示を切り替えられます。",
      "検索欄に生まれ年や年齢を入力すると、該当する行だけに絞り込めます。",
      "一覧をスクロールして目的の生まれ年を確認します。",
    ],
    faq: [
      {
        question: "「誕生日前」「誕生日後」の年齢はどう違いますか？",
        answer: "同じ生まれ年でも、今年の誕生日をまだ迎えていない人と迎えた人とでは満年齢が1歳異なります。本表では両方の年齢を並べて表示しています。",
      },
      {
        question: "何歳まで調べられますか？",
        answer: "今年生まれの0歳から105歳まで、生まれ年ごとに一覧で確認できます。",
      },
    ],
    relatedSlugs: ["age-calculator", "kazoedoshi-calculator", "longevity-celebration-checker"],
  },
  {
    slug: "eto-checker",
    name: "干支チェッカー",
    shortDescription: "生年月日から干支と相性の良い干支を確認",
    description:
      "生年月日を入力するだけで、生まれ年の干支（十二支）をイラスト付きで確認できます。三合の関係にある相性が良いとされる干支も参考情報として表示します。",
    category: "life",
    icon: "Sparkles",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["干支", "干支 調べる", "十二支", "生まれ年 干支", "干支 相性"],
    howToUse: ["生年月日を入力します。", "生まれ年の干支と十二支の説明、相性の良い干支が表示されます。"],
    faq: [
      {
        question: "干支は西暦から簡単に計算できますか？",
        answer: "はい。西暦年を12で割った余りから、規則的に十二支を求めることができます。本ツールは生年月日からその計算を自動で行います。",
      },
      {
        question: "相性が良い干支はどのように決まりますか？",
        answer: "「三合」と呼ばれる、4年おきに巡る3つの干支の組み合わせをもとにした、占いの参考情報として表示しています。",
      },
    ],
    relatedSlugs: ["age-calculator", "longevity-celebration-checker", "rokuyo-checker"],
  },
  {
    slug: "rokuyo-checker",
    name: "六曜確認",
    shortDescription: "カレンダーから日付を選んで大安・仏滅などの六曜を確認",
    description:
      "カレンダーUIから日付を選ぶだけで、その日の六曜（先勝・友引・先負・仏滅・大安・赤口）と、結婚・引越し・納車・開業・お参り・契約それぞれへの向き不向きの目安を確認できます。",
    category: "life",
    icon: "CalendarCheck",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["六曜", "大安", "仏滅", "友引", "六曜カレンダー", "今日の六曜"],
    howToUse: [
      "カレンダーから確認したい日付を選択します。",
      "その日の六曜と意味が表示されます。",
      "結婚・引越し・納車・開業・お参り・契約それぞれの向き不向きの目安を確認します。",
    ],
    faq: [
      {
        question: "六曜はどうやって決まるのですか？",
        answer: "旧暦（太陰太陽暦）の月と日を足した数を6で割った余りによって、先勝・友引・先負・仏滅・大安・赤口の6種類が規則的に決まります。",
      },
      {
        question: "仏滅の日は何をしても良くないのですか？",
        answer: "仏滅は六曜の中で最も凶とされ、伝統的に祝い事は避けられる傾向にありますが、迷信であり科学的な根拠はありません。最終的な判断はご自身の考え方に合わせてご利用ください。",
      },
    ],
    relatedSlugs: ["eto-checker", "age-calculator", "yakudoshi-checker"],
  },
  {
    slug: "instagram-hashtag-generator",
    name: "Instagramハッシュタグ自動生成",
    metaTitle: "Instagramハッシュタグ自動生成｜投稿に合うタグを無料作成",
    shortDescription: "テーマやジャンルを入力するだけで投稿に合うハッシュタグを自動生成",
    description:
      "投稿テーマ・内容・ジャンル・ターゲット層・地域名を入力するだけで、大規模〜ニッチ・地域・日本語・英語のハッシュタグをバランス良く自動生成します。個別コピーや並び替え、再生成にも対応した非公式ツールです。",
    category: "creator",
    icon: "Hash",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["Instagram ハッシュタグ", "インスタ タグ 自動生成", "ハッシュタグ 生成", "インスタグラム タグ 無料"],
    howToUse: [
      "投稿テーマ・投稿内容・ジャンル・ターゲット層・地域名を入力します。",
      "ハッシュタグの個数と雰囲気を選択します。",
      "「ハッシュタグを生成」を押すと、規模別に分類されたハッシュタグが表示されます。不要なタグは削除、並び替え、再生成もできます。",
    ],
    calculationMethod: [
      "本ツールはAI（外部API）を使用せず、ジャンル別に整理したキーワード辞書から候補を組み合わせて生成しています。入力したテーマ・内容・ターゲット層からもキーワードを抽出し、大規模・中規模・小規模ニッチ・地域・日本語・英語のバランスを取りながら指定個数を選出します。",
    ],
    usageExamples: [
      "カフェ巡りの投稿：ジャンル「カフェ」、地域名「渋谷」を入力すると、カフェ関連タグと地域タグが組み合わさって生成されます。",
      "コスメレビュー投稿：ジャンル「コスメ」、ターゲット層「20代女性」で生成すると、コスメ好きに刺さるタグ中心の構成になります。",
    ],
    faq: [
      {
        question: "これはInstagram公式のツールですか？",
        answer: "いいえ、非公式のツールです。Instagram社やMeta社とは関係のない、独自のキーワード辞書に基づくハッシュタグ生成ツールです。",
      },
      {
        question: "生成されたハッシュタグの効果は保証されますか？",
        answer: "いいえ。生成されるハッシュタグはキーワード辞書に基づく候補であり、実際の投稿の閲覧数やいいね数などの効果を保証するものではありません。",
      },
      {
        question: "不適切な単語が生成されることはありますか？",
        answer: "投稿内容から抽出したキーワードに対してNGワードフィルタを適用していますが、生成結果は必ずご自身で確認してからご利用ください。",
      },
    ],
    relatedSlugs: ["qr-code", "char-counter"],
  },
  {
    slug: "url-encode-decode",
    name: "URLエンコード・デコード",
    metaTitle: "URLエンコード・デコード｜日本語URLを無料変換",
    shortDescription: "日本語や記号を含むURL・文字列をエンコード・デコード",
    description:
      "URL全体・URLパラメータ・日本語文字列の3モードでencodeURIComponent／encodeURIによる変換をリアルタイムに行えます。不正なパーセントエンコーディングはエラー表示で分かりやすく通知します。",
    category: "web",
    icon: "Link2",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["URLエンコード", "URLデコード", "encodeURIComponent", "日本語 URL 変換", "パーセントエンコーディング"],
    howToUse: [
      "「URL全体」「URLパラメータ」「日本語文字列」からモードを選びます。",
      "「エンコード」または「デコード」を選び、テキストエリアに文字列を入力します。",
      "入力するとリアルタイムに変換結果が表示されます。結果はワンクリックでコピーできます。",
    ],
    calculationMethod: [
      "「URL全体」はencodeURI/decodeURIを使用し、「://」「/」「?」「&」「=」「#」などURLの構造を表す記号はそのまま残し、日本語やスペースなど安全でない文字だけをエンコードします。",
      "「URLパラメータ」「日本語文字列」はencodeURIComponent/decodeURIComponentを使用し、&・=・?・#を含むすべての記号をエンコードします。クエリパラメータの値など、URLの部品として安全に埋め込みたい文字列に向いています。",
    ],
    faq: [
      {
        question: "URL全体とURLパラメータ、どちらを使えばいいですか？",
        answer:
          "URLをそのままブラウザに貼り付けて使いたい場合は「URL全体」、他のURLのクエリパラメータの値として埋め込みたい場合は「URLパラメータ」を選んでください。",
      },
      {
        question: "デコードでエラーが出るのはなぜですか？",
        answer: "「%」の後に正しい16進数2桁が続いていない不正なエンコード文字列が入力されると、decodeURIComponent等がエラーになります。入力内容をご確認ください。",
      },
    ],
    relatedSlugs: ["barcode-generator", "qr-code"],
  },
  {
    slug: "barcode-generator",
    name: "バーコード作成",
    metaTitle: "バーコード作成｜CODE128・EAN対応の無料生成ツール",
    shortDescription: "CODE128・EAN-13など8形式に対応したバーコードをその場で生成",
    description:
      "CODE128・CODE39・EAN-13・EAN-8・UPC-A・ITF・ITF-14・Codabarの8形式に対応。文字を入力するとリアルタイムにプレビューされ、PNG・SVG保存、印刷、画像・番号コピーができます。",
    category: "web",
    icon: "Barcode",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["バーコード作成", "バーコード 生成", "CODE128", "EAN13", "JANコード 生成 無料"],
    howToUse: [
      "バーコード形式を選択します。",
      "バーコード化する文字・数字を入力します（形式ごとの桁数ルールに従ってください）。",
      "線の太さ・高さ・余白・色などを調整し、PNG・SVG保存や印刷を行います。",
    ],
    calculationMethod: [
      "バーコードの描画にはJavaScriptライブラリ「JsBarcode」を使用しています。EAN-13・EAN-8・UPC-A・ITF-14はチェックデジット（誤り検出用の末尾の数字）を自動計算・検証し、形式ごとの桁数もあわせてチェックします。",
    ],
    faq: [
      {
        question: "どの形式を選べばいいですか？",
        answer:
          "商品バーコード風の表示にはEAN-13、物流・梱包用途にはITF-14、汎用的な英数字にはCODE128が広く使われています。用途に合わせてお選びください。",
      },
      {
        question: "このバーコードは実際の商品に使えますか？",
        answer:
          "本ツールで作成したバーコードは表示・印刷用の簡易生成であり、市販商品の正式な商品コード（JANコード等）の登録を行うものではありません。実際の商品登録には、GS1 Japan等の公式機関での手続きが必要です。",
      },
    ],
    relatedSlugs: ["url-encode-decode", "qr-code"],
  },
  {
    slug: "jpg-png-converter",
    name: "JPG・PNG変換",
    metaTitle: "JPG・PNG変換｜画像形式をブラウザで無料変換",
    shortDescription: "JPG・JPEGとPNGを相互に変換、複数枚まとめてZIP保存も可能",
    description:
      "JPG・JPEGとPNGを相互に変換できます。複数枚まとめてアップロードし、透過PNGをJPGに変換する際の背景色指定やJPG品質調整、ZIPでの一括保存にも対応。すべてブラウザ内で処理されます。",
    category: "image",
    icon: "FileImage",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["JPG PNG 変換", "画像 形式変換", "PNG JPG 変換 無料", "画像変換 ブラウザ"],
    howToUse: [
      "画像をドラッグ&ドロップ、またはクリックしてアップロードします（複数枚可、1枚20MBまで）。",
      "出力形式（PNG・JPG）とファイル名の末尾を設定します。JPG変換時は品質と透過部分の背景色も選べます。",
      "「一括変換」を押し、1枚ずつ、またはZIPでまとめて保存します。",
    ],
    calculationMethod: [
      "アップロードした画像をCanvasに描画し、指定した形式・品質で再エンコードして書き出しています。処理はすべてブラウザ内で完結し、サーバーに画像が送信されることはありません。",
    ],
    faq: [
      {
        question: "変換後もExif（撮影日時や位置情報）は残りますか？",
        answer: "いいえ。Canvas経由での再エンコードのため、Exifなどのメタデータは変換後の画像には保持されません。",
      },
      {
        question: "透過PNGをJPGに変換するとどうなりますか？",
        answer: "JPGは透過に対応していないため、指定した背景色で透過部分を塗りつぶしたうえで変換します。",
      },
    ],
    relatedSlugs: ["webp-convert", "image-compress", "image-resize"],
  },
  {
    slug: "gif-maker",
    name: "GIF作成",
    metaTitle: "GIF作成｜複数画像からアニメーションGIFを作成",
    shortDescription: "複数の画像から表示時間・ループ回数を指定してアニメーションGIFを作成",
    description:
      "複数の画像をアップロードし、並び順・1コマあたりの表示時間・ループ回数・画質を指定してアニメーションGIFを作成できます。サイズが異なる画像はトリミングや余白追加で自動調整され、すべてブラウザ内で処理されます。",
    category: "image",
    icon: "Film",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["GIF作成", "アニメーションGIF 作成 無料", "画像 GIF 変換", "GIFメーカー"],
    howToUse: [
      "アニメーションにしたい画像を複数枚アップロードし、順番を並び替えます。",
      "GIFの横幅・高さ・表示時間・繰り返し回数・画質を設定します。",
      "「GIFを生成」を押し、プレビューを確認してから保存します。",
    ],
    calculationMethod: [
      "GIFエンコードにはメンテナンスされているJavaScriptライブラリ「modern-gif」を使用しています。処理はブラウザのメインスレッドで実行されるため、生成中はローディング表示が続きます（画像枚数が多いほど時間がかかります）。",
    ],
    faq: [
      {
        question: "画像のサイズがバラバラでも作成できますか？",
        answer:
          "はい。「サイズが異なる場合の処理」で中央トリミング・余白追加・縦横比を維持して収める・拡大のいずれかを選ぶことで、指定したGIFサイズに自動調整されます。",
      },
      {
        question: "生成を途中で止められますか？",
        answer: "「中止する」ボタンで生成結果の反映をキャンセルできます。ただし内部処理そのものは直前まで進んでいるため、複数回連続で試す場合は少し時間をおくことをおすすめします。",
      },
    ],
    relatedSlugs: ["jpg-png-converter", "image-mosaic", "image-blur"],
  },
  {
    slug: "image-mosaic",
    name: "画像モザイク加工",
    metaTitle: "画像モザイク加工｜写真の一部を無料で隠す",
    shortDescription: "顔やナンバープレートなど、写真の一部にブラシや範囲選択でモザイクをかける",
    description:
      "画像全体、またはブラシ・四角形・円形で指定した範囲だけにモザイクをかけられます。元に戻す・やり直す・全体リセットに対応し、保存時は新しいCanvasから出力するため元画像の情報は残りません。",
    category: "image",
    icon: "Grid3x3",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["モザイク 加工 無料", "画像 モザイク", "顔 モザイク", "写真 隠す ツール"],
    howToUse: [
      "モザイクをかけたい画像をアップロードします。",
      "「画像全体」「四角形選択」「円形選択」「ブラシ」から加工方法を選び、モザイクの強さを調整します。",
      "マウスやタッチ操作で加工したい範囲をなぞり、保存形式を選んで画像を保存します。",
    ],
    calculationMethod: [
      "選択した範囲をブロックに分割し、各ブロックの平均色で塗りつぶすことでモザイクを再現しています。処理はCanvas APIのみでブラウザ内で完結し、画像がサーバーに送信されることはありません。",
    ],
    usageExamples: ["集合写真で背景に写り込んだ人の顔だけにモザイクをかけたいとき。", "書類の画像から個人情報の一部を隠したいとき。"],
    faq: [
      {
        question: "モザイクをかけた部分から元の画像は復元できますか？",
        answer:
          "いいえ。保存時は新しいCanvasに最終的なピクセル情報のみを描画して書き出すため、元画像のピクセル情報がファイルに残ることはありません。",
      },
      {
        question: "スマートフォンでも操作できますか？",
        answer: "はい。タッチ操作でのブラシ塗り・範囲選択に対応しています。",
      },
    ],
    relatedSlugs: ["image-blur", "jpg-png-converter"],
  },
  {
    slug: "image-blur",
    name: "画像ぼかし加工",
    metaTitle: "画像ぼかし加工｜写真の顔や背景を簡単ぼかし",
    shortDescription: "写真の背景や顔など、指定した範囲だけを自然にぼかす",
    description:
      "画像全体、またはブラシ・四角形・円形で指定した範囲だけを自然にぼかせます。境界が滑らかになるよう周囲のピクセルも考慮して処理し、元に戻す・やり直すにも対応しています。",
    category: "image",
    icon: "Droplets",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["ぼかし 加工 無料", "画像 ぼかし", "背景 ぼかし ツール", "写真 顔 ぼかし"],
    howToUse: [
      "ぼかしをかけたい画像をアップロードします。",
      "「画像全体」「四角形選択」「円形選択」「ブラシ」から加工方法を選び、ぼかしの強さを調整します。",
      "マウスやタッチ操作で加工したい範囲をなぞり、保存形式を選んで画像を保存します。",
    ],
    calculationMethod: [
      "Canvas 2D APIの`filter: blur()`を使い、画像全体を一度ぼかしたうえで選択範囲だけをクリップして重ね直すことで、境界が不自然にならない自然なぼかしを実現しています。",
    ],
    usageExamples: ["ポートレート写真の背景だけをぼかして被写体を目立たせたいとき。", "SNSに投稿する前に写り込んだ人の顔をぼかしたいとき。"],
    faq: [
      {
        question: "モザイクとぼかしはどちらを使えばいいですか？",
        answer: "しっかり隠したい場合はモザイク、自然な見た目を保ちつつ目立たなくしたい場合はぼかしがおすすめです。",
      },
      {
        question: "処理は端末内で完結しますか？",
        answer: "はい。Canvas APIによる処理はすべてブラウザ内で行われ、画像がサーバーに送信されることはありません。",
      },
    ],
    relatedSlugs: ["image-mosaic", "jpg-png-converter"],
  },
  {
    slug: "gasoline-cost-calculator",
    name: "ガソリン代計算",
    metaTitle: "ガソリン代計算｜距離・燃費・単価から交通費を計算",
    shortDescription: "走行距離・燃費・単価から交通費と1人あたりの負担額を計算",
    description:
      "走行距離・燃費・ガソリン単価・高速道路料金・駐車料金から、ガソリン代と合計交通費、乗車人数で割った1人あたりの負担額を計算します。片道・往復の切り替えやLINEで共有しやすい結果コピーに対応しています。",
    category: "money",
    icon: "Fuel",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["ガソリン代 計算", "旅費 割り勘", "ドライブ 費用 計算", "燃費 計算"],
    howToUse: [
      "片道・往復を選び、走行距離・燃費・ガソリン単価を入力します。",
      "乗車人数や高速道路料金・駐車料金・その他費用を入力します。",
      "合計交通費と1人あたりの負担額が自動で計算されます。",
    ],
    calculationMethod: [
      "使用ガソリン量 = 走行距離 ÷ 燃費",
      "ガソリン代 = 使用ガソリン量 × ガソリン単価",
      "合計交通費 = ガソリン代 + 高速道路料金 + 駐車料金 + その他の費用",
      "1人あたり = 合計交通費 ÷ 乗車人数",
    ],
    faq: [
      {
        question: "往復にするとどう計算されますか？",
        answer: "往復を選ぶと、入力した走行距離（片道分）を2倍にしてから計算します。",
      },
      {
        question: "計算結果をLINEで友達と共有できますか？",
        answer: "はい。結果表示エリアの「URLを共有」や「LINEで共有」ボタンから、そのまま共有できます。",
      },
    ],
    relatedSlugs: ["point-return-calculator", "annual-income-hourly-wage", "take-home-pay"],
  },
  {
    slug: "point-return-calculator",
    name: "ポイント還元計算",
    metaTitle: "ポイント還元計算｜還元率から獲得ポイントを計算",
    shortDescription: "還元率・倍率・クーポンから獲得ポイントと実質還元率を計算",
    description:
      "購入金額・還元率・ポイント倍率・クーポン金額などから、獲得予定ポイントと実質負担額、実質還元率を計算します。2つのパターンを並べて比較することもできます。",
    category: "money",
    icon: "BadgePercent",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["ポイント還元 計算", "実質還元率", "ポイント 何%還元", "ポイ活 計算"],
    howToUse: [
      "購入金額・ポイント還元率・ポイント倍率・1ポイントの価値を入力します。",
      "利用するポイント数やクーポン金額、付与対象金額の計算方法を設定します。",
      "獲得予定ポイントと実質負担額、実質還元率が自動で計算されます。",
    ],
    calculationMethod: [
      "獲得ポイント = ポイント付与対象金額 × 還元率 ÷ 100（ポイント倍率がある場合はさらに倍率を掛けます）",
      "ポイントの金額換算 = 獲得ポイント × 1ポイントの価値",
      "実質負担額 = 実際の支払額 − 獲得ポイントの金額換算",
      "実質還元率 = 獲得ポイントの金額換算 ÷ 実際の支払額 × 100",
    ],
    faq: [
      {
        question: "「1%還元」と「ポイント2倍」はどう違いますか？",
        answer:
          "「1%還元」は支払額に対する還元率そのものです。「ポイント2倍」は普段の還元率を2倍にする仕組みで、普段の還元率が1%の店舗なら2%相当になります。倍率は普段の還元率に掛け合わせるものである点にご注意ください。",
      },
      {
        question: "実際に付与されるポイント数と一致しますか？",
        answer:
          "店舗やサービスによって付与条件・端数処理・ポイントの価値が異なるため、実際の付与ポイントを保証するものではありません。目安としてご利用ください。",
      },
    ],
    relatedSlugs: ["gasoline-cost-calculator", "consumption-tax"],
  },
  {
    slug: "annual-income-hourly-wage",
    name: "年収・時給換算",
    metaTitle: "年収・時給換算｜年収から実質時給を自動計算",
    shortDescription: "年収から実質時給を、時給から年収目安を自動計算",
    description:
      "年収・勤務時間・休日数・残業時間から実質時給を計算する「年収→時給」と、時給・勤務日数・残業時給・ボーナス・手当から年収目安を計算する「時給→年収」の両方向に対応した計算ツールです。",
    category: "money",
    icon: "BriefcaseBusiness",
    isPopular: false,
    releasedAt: "2026-08-01",
    keywords: ["年収 時給 換算", "実質時給 計算", "時給 年収 計算 無料", "残業込み 時給"],
    howToUse: [
      "「年収から時給を計算」または「時給から年収を計算」を選びます。",
      "年収（またはは時給）、勤務時間・日数、残業時間、ボーナスなどを入力します。",
      "月収換算・日給換算・実質時給（または年収目安）が自動で計算されます。",
    ],
    calculationMethod: [
      "年間労働日数は「365日 − 年間休日数 − 年間有給取得日数」から算出し、年間労働時間は「年間労働日数 × 1日の勤務時間」に残業時間を加えて計算します。",
      "実質時給は、ボーナスを含めた年収を年間労働時間（残業を含める設定の場合は残業時間も加算）で割って算出します。",
      "時給から年収を計算する場合は、時給 × 1日の勤務時間 × 年間勤務日数を基本年収とし、残業代・ボーナス・各種手当を加算します。",
    ],
    faq: [
      {
        question: "この年収は手取り額ですか？",
        answer: "いいえ。本ツールで扱う年収は額面（税引き前）の金額です。実際の手取り額は税金・社会保険料などによって異なります。",
      },
      {
        question: "「残業を含めた実質時給」とは何ですか？",
        answer:
          "固定の年収に対して残業時間が増えるほど、1時間あたりの実質的な対価は下がります。残業時間を加味した年間労働時間で年収を割ることで、その実感に近い時給を算出しています。",
      },
    ],
    relatedSlugs: ["take-home-pay", "gasoline-cost-calculator"],
  },
];
