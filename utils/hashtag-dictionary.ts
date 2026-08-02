/**
 * Keyword dictionary powering the Instagram hashtag generator. This is the
 * sole generation strategy (no external/AI API is called — this app has no
 * server-side credential store to keep an API key off the client), organized
 * by genre so the generator can compose a themed set without any network
 * request.
 */

export type HashtagGenre =
  | "beauty"
  | "cosme"
  | "fashion"
  | "romance"
  | "gourmet"
  | "cafe"
  | "travel"
  | "childcare"
  | "pet"
  | "diet"
  | "health"
  | "business"
  | "sidejob"
  | "photo"
  | "illustration"
  | "other";

export const genreLabels: Record<HashtagGenre, string> = {
  beauty: "美容",
  cosme: "コスメ",
  fashion: "ファッション",
  romance: "恋愛",
  gourmet: "グルメ",
  cafe: "カフェ",
  travel: "旅行",
  childcare: "育児",
  pet: "ペット",
  diet: "ダイエット",
  health: "健康",
  business: "ビジネス",
  sidejob: "副業",
  photo: "写真",
  illustration: "イラスト",
  other: "その他",
};

export const genreOrder: HashtagGenre[] = [
  "beauty",
  "cosme",
  "fashion",
  "romance",
  "gourmet",
  "cafe",
  "travel",
  "childcare",
  "pet",
  "diet",
  "health",
  "business",
  "sidejob",
  "photo",
  "illustration",
  "other",
];

export interface GenrePool {
  large: string[];
  medium: string[];
  small: string[];
  english: string[];
}

export type Tone = "elegant" | "casual" | "energetic" | "minimal";

export const toneLabels: Record<Tone, string> = {
  elegant: "おしゃれ・上品",
  casual: "カジュアル・親しみやすい",
  energetic: "元気・ポップ",
  minimal: "シンプル・ミニマル",
};

const toneFlavorTags: Record<Tone, string[]> = {
  elegant: ["#丁寧な暮らし", "#おしゃれさんと繋がりたい", "#上品コーデ", "#大人女子"],
  casual: ["#今日のコーデ", "#日常", "#ゆるっと", "#気軽に"],
  energetic: ["#元気いっぱい", "#テンション上がる", "#笑顔", "#ハッピー"],
  minimal: ["#シンプルライフ", "#ミニマリスト", "#シンプルコーデ", "#無駄なく"],
};

export function getToneFlavorTags(tone: Tone): string[] {
  return toneFlavorTags[tone];
}

/** Generic, genre-independent "つながり系" tags used to round out the 日本語タグ bucket. */
export const genericJapaneseTags: string[] = [
  "#写真好きな人と繋がりたい",
  "#いいね返し",
  "#フォロバ100",
  "#インスタ映え",
  "#今日のコーデ",
  "#日常のかけら",
  "#暮らしを楽しむ",
  "#丁寧な暮らし",
  "#instagood",
  "#おうち時間",
  "#その瞬間を切り取る",
  "#休日の過ごし方",
];

/** Fallback pool used to top up a request when a genre's own pool runs short. */
export const catchAllTags: string[] = [
  "#japan",
  "#instalike",
  "#instadaily",
  "#follow",
  "#like4like",
  "#photooftheday",
  "#日本",
  "#シェア",
  "#おすすめ",
  "#今日の一枚",
];

export function buildRegionalTags(region: string): string[] {
  const clean = region.trim();
  if (!clean) return [];
  return [`#${clean}`, `#${clean}カフェ`, `#${clean}グルメ`, `#${clean}観光`, `#${clean}旅行`, `#${clean}スポット`];
}

export const hashtagDictionary: Record<HashtagGenre, GenrePool> = {
  beauty: {
    large: ["#美容", "#スキンケア", "#美容好きな人と繋がりたい", "#美肌", "#コスメ好き", "#美容垢さんと繋がりたい"],
    medium: ["#美容オタク", "#毛穴レス肌", "#美容マニア", "#透明感肌", "#エステ", "#韓国美容"],
    small: ["#毛穴ケア", "#乾燥肌ケア", "#朝スキンケア", "#夜スキンケア", "#美容成分", "#敏感肌ケア"],
    english: ["#skincare", "#beauty", "#skincareroutine", "#glowingskin"],
  },
  cosme: {
    large: ["#コスメ", "#コスメ好き", "#プチプラコスメ", "#デパコス", "#コスメ紹介", "#新作コスメ"],
    medium: ["#韓国コスメ", "#リップコスメ", "#メイク好きさんと繋がりたい", "#ベースメイク", "#限定コスメ", "#コスメレビュー"],
    small: ["#優秀コスメ", "#崩れないメイク", "#時短メイク", "#プチプラメイク", "#コスメ収納", "#新色コスメ"],
    english: ["#cosmetics", "#makeup", "#koreancosmetics", "#beautyproducts"],
  },
  fashion: {
    large: ["#ファッション", "#コーデ", "#今日のコーデ", "#ootd", "#プチプラファッション", "#ファッション好きな人と繋がりたい"],
    medium: ["#秋コーデ", "#冬コーデ", "#カジュアルコーデ", "#きれいめコーデ", "#古着コーデ", "#大人カジュアル"],
    small: ["#一枚で様になる", "#骨格ストレート", "#骨格ウェーブ", "#骨格ナチュラル", "#今日の服", "#ワンピースコーデ"],
    english: ["#fashion", "#ootd", "#outfitoftheday", "#style"],
  },
  romance: {
    large: ["#恋愛", "#カップル", "#恋バナ", "#夫婦", "#恋活", "#カップルフォト"],
    medium: ["#遠距離恋愛", "#社会人カップル", "#結婚したい", "#恋人", "#デート", "#カップルグラム"],
    small: ["#復縁", "#片思い", "#マッチングアプリ", "#プロポーズ", "#記念日デート", "#カップルコーデ"],
    english: ["#couple", "#love", "#couplegoals", "#relationship"],
  },
  gourmet: {
    large: ["#グルメ", "#food", "#foodstagram", "#ランチ", "#ディナー", "#美味しいものが好き"],
    medium: ["#グルメ好きな人と繋がりたい", "#おうちごはん", "#今日のごはん", "#手作り料理", "#食べ歩き", "#週末ランチ"],
    small: ["#隠れ家レストラン", "#一人ランチ", "#テイクアウトグルメ", "#季節の食材", "#ご当地グルメ", "#簡単レシピ"],
    english: ["#foodie", "#foodphotography", "#yummy", "#delicious"],
  },
  cafe: {
    large: ["#カフェ", "#カフェ巡り", "#カフェ好きな人と繋がりたい", "#カフェ活", "#coffee", "#cafe"],
    medium: ["#カフェ部", "#カフェ好き", "#おしゃれカフェ", "#隠れ家カフェ", "#コーヒー好きな人と繋がりたい", "#カフェ時間"],
    small: ["#古民家カフェ", "#猫カフェ", "#朝カフェ", "#ひとりカフェ", "#カフェ飯", "#カフェスタグラム"],
    english: ["#coffeetime", "#cafehopping", "#coffeelover", "#coffeeholic"],
  },
  travel: {
    large: ["#旅行", "#travel", "#旅行好きな人と繋がりたい", "#旅行記", "#travelgram", "#旅"],
    medium: ["#国内旅行", "#海外旅行", "#一人旅", "#週末旅行", "#絶景", "#旅行好き"],
    small: ["#穴場スポット", "#秘境", "#温泉旅行", "#弾丸旅行", "#カメラ旅", "#旅の記録"],
    english: ["#wanderlust", "#travelphotography", "#trip", "#vacation"],
  },
  childcare: {
    large: ["#育児", "#育児日記", "#子育て", "#ママリ", "#新生児", "#育児あるある"],
    medium: ["#育児記録", "#男の子ママ", "#女の子ママ", "#ワンオペ育児", "#新米ママ", "#子供のいる暮らし"],
    small: ["#離乳食記録", "#寝かしつけ", "#イヤイヤ期", "#成長記録", "#双子育児", "#育児グッズ"],
    english: ["#parenting", "#babylife", "#momlife", "#newborn"],
  },
  pet: {
    large: ["#犬", "#猫", "#ペット", "#いぬすたぐらむ", "#ねこすたぐらむ", "#ペットのいる暮らし"],
    medium: ["#愛犬", "#愛猫", "#犬好きな人と繋がりたい", "#猫好きな人と繋がりたい", "#保護犬", "#保護猫"],
    small: ["#子犬", "#子猫", "#多頭飼い", "#老犬", "#ペット服", "#動物好き"],
    english: ["#dog", "#cat", "#dogsofinstagram", "#catsofinstagram"],
  },
  diet: {
    large: ["#ダイエット", "#ダイエット記録", "#ダイエット仲間募集", "#痩せたい", "#ボディメイク", "#ダイエット垢"],
    medium: ["#宅トレ", "#筋トレ女子", "#食事管理", "#ダイエット日記", "#産後ダイエット", "#糖質制限"],
    small: ["#朝トレ", "#美尻トレーニング", "#くびれ作り", "#ダイエットレシピ", "#体重公開", "#ながらトレーニング"],
    english: ["#weightloss", "#fitness", "#workout", "#fitgirl"],
  },
  health: {
    large: ["#健康", "#健康的な生活", "#ヘルシー", "#健康管理", "#ウェルネス", "#健康志向"],
    medium: ["#腸活", "#睡眠の質", "#ストレッチ", "#マインドフルネス", "#温活", "#免疫力アップ"],
    small: ["#朝活習慣", "#冷え性改善", "#自律神経を整える", "#発酵食品", "#ヘルシーレシピ", "#むくみ改善"],
    english: ["#health", "#wellness", "#healthylifestyle", "#selfcare"],
  },
  business: {
    large: ["#ビジネス", "#起業", "#経営者", "#マーケティング", "#ビジネス好きな人と繋がりたい", "#経営"],
    medium: ["#フリーランス", "#個人事業主", "#スタートアップ", "#ビジネス書", "#自己投資", "#働き方"],
    small: ["#朝活ビジネス", "#経営者仲間", "#SNS運用", "#ブランディング", "#事業戦略", "#ビジネス勉強"],
    english: ["#business", "#entrepreneur", "#startup", "#marketing"],
  },
  sidejob: {
    large: ["#副業", "#副業初心者", "#在宅ワーク", "#副業サラリーマン", "#副業主婦", "#複業"],
    medium: ["#せどり", "#ブログ副業", "#動画編集", "#webライター", "#ハンドメイド販売", "#副業探し中"],
    small: ["#スキマ時間副業", "#副業ノウハウ", "#副業日記", "#不用品販売", "#フリマアプリ", "#副業初心者と繋がりたい"],
    english: ["#sidehustle", "#workfromhome", "#freelance", "#passiveincome"],
  },
  photo: {
    large: ["#写真", "#写真好きな人と繋がりたい", "#カメラ", "#photography", "#ファインダー越しの私の世界", "#写真部"],
    medium: ["#ポートレート", "#風景写真", "#スナップ写真", "#フィルムカメラ", "#カメラ女子", "#写真日和"],
    small: ["#光と影", "#構図", "#モノクロ写真", "#フィルム風", "#写真教室", "#カメラのある生活"],
    english: ["#photography", "#photographer", "#portraitphotography", "#igphoto"],
  },
  illustration: {
    large: ["#イラスト", "#イラスト好きな人と繋がりたい", "#illustration", "#イラストレーター", "#絵描きさんと繋がりたい", "#デジタルイラスト"],
    medium: ["#イラスト日記", "#キャラクターデザイン", "#アナログイラスト", "#落書き", "#創作イラスト", "#pixiv"],
    small: ["#模写", "#クリスタ", "#プロクリエイト", "#イラスト練習", "#線画", "#色塗り"],
    english: ["#illustration", "#digitalart", "#artistsoninstagram", "#drawing"],
  },
  other: {
    large: ["#日常", "#暮らし", "#instagood", "#写真", "#今日の一枚", "#シェア"],
    medium: ["#休日", "#趣味", "#お気に入り", "#日記", "#記録", "#ライフスタイル"],
    small: ["#つぶやき", "#日々の記録", "#気ままに投稿", "#マイペース", "#備忘録", "#ふと思ったこと"],
    english: ["#instagood", "#instadaily", "#dailylife", "#lifestyle"],
  },
};
