"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Copy, RefreshCw, Sparkles, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResultCard } from "@/components/shared/result-card";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { ResetButton } from "@/components/shared/reset-button";
import { ErrorMessage } from "@/components/shared/error-message";
import { genreLabels, genreOrder, toneLabels, type HashtagGenre, type Tone } from "@/utils/hashtag-dictionary";
import { generateHashtags, type HashtagCategory, type HashtagCount } from "@/utils/hashtag-generator";

const genreItems = Object.fromEntries(genreOrder.map((g) => [g, genreLabels[g]]));
const countOptions: HashtagCount[] = [5, 10, 15, 20, 30];
const countItems = Object.fromEntries(countOptions.map((c) => [String(c), `${c}個`]));
const toneOrder: Tone[] = ["elegant", "casual", "energetic", "minimal"];
const toneItems = Object.fromEntries(toneOrder.map((t) => [t, toneLabels[t]]));

const initialState = {
  theme: "",
  content: "",
  genre: "other" as HashtagGenre,
  targetAudience: "",
  region: "",
  count: 10 as HashtagCount,
  tone: "casual" as Tone,
};

export function InstagramHashtagGenerator() {
  const [form, setForm] = useState(initialState);
  const [categories, setCategories] = useState<HashtagCategory[] | null>(null);
  const [error, setError] = useState<string | undefined>();
  const resultRef = useRef<HTMLDivElement>(null);

  function updateForm<K extends keyof typeof initialState>(key: K, value: (typeof initialState)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleGenerate() {
    if (!form.theme.trim() && !form.content.trim()) {
      setError("投稿テーマまたは投稿内容のどちらかを入力してください。");
      return;
    }
    setError(undefined);
    setCategories(generateHashtags(form).categories);
  }

  function handleReset() {
    setForm(initialState);
    setCategories(null);
    setError(undefined);
  }

  function removeTag(categoryKey: string, tag: string) {
    setCategories(
      (prev) =>
        prev?.map((c) => (c.key === categoryKey ? { ...c, tags: c.tags.filter((t) => t !== tag) } : c)) ?? null
    );
  }

  function moveTag(categoryKey: string, index: number, direction: -1 | 1) {
    setCategories((prev) => {
      if (!prev) return prev;
      return prev.map((c) => {
        if (c.key !== categoryKey) return c;
        const target = index + direction;
        if (target < 0 || target >= c.tags.length) return c;
        const tags = [...c.tags];
        [tags[index], tags[target]] = [tags[target], tags[index]];
        return { ...c, tags };
      });
    });
  }

  async function copyTag(tag: string) {
    await navigator.clipboard.writeText(tag);
    toast.success(`${tag} をコピーしました`);
  }

  const allTags = categories?.flatMap((c) => c.tags) ?? [];

  async function copyAll(separator: " " | "\n") {
    if (allTags.length === 0) return;
    await navigator.clipboard.writeText(allTags.join(separator));
    toast.success(separator === " " ? "スペース区切りでコピーしました" : "改行区切りでコピーしました");
  }

  return (
    <div className="space-y-6">
      <p className="rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
        本ツールはInstagram公式の機能・サービスとは関係のない非公式ツールです。生成されるハッシュタグはキーワード辞書に基づく候補であり、実際の投稿効果を保証するものではありません。
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hashtag-theme">投稿テーマ</Label>
          <Input
            id="hashtag-theme"
            value={form.theme}
            onChange={(e) => updateForm("theme", e.target.value)}
            placeholder="例：週末のカフェ巡り"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hashtag-genre">ジャンル</Label>
          <Select items={genreItems} value={form.genre} onValueChange={(v) => v && updateForm("genre", v as HashtagGenre)}>
            <SelectTrigger id="hashtag-genre" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {genreOrder.map((g) => (
                <SelectItem key={g} value={g}>
                  {genreLabels[g]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hashtag-content">投稿内容</Label>
        <Textarea
          id="hashtag-content"
          rows={4}
          value={form.content}
          onChange={(e) => updateForm("content", e.target.value)}
          placeholder="投稿の内容や伝えたいことを入力してください"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="hashtag-audience">ターゲット層</Label>
          <Input
            id="hashtag-audience"
            value={form.targetAudience}
            onChange={(e) => updateForm("targetAudience", e.target.value)}
            placeholder="例：20代女性"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hashtag-region">地域名</Label>
          <Input
            id="hashtag-region"
            value={form.region}
            onChange={(e) => updateForm("region", e.target.value)}
            placeholder="例：渋谷"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hashtag-count">個数</Label>
          <Select
            items={countItems}
            value={String(form.count)}
            onValueChange={(v) => v && updateForm("count", Number(v) as HashtagCount)}
          >
            <SelectTrigger id="hashtag-count" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countOptions.map((c) => (
                <SelectItem key={c} value={String(c)}>
                  {c}個
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hashtag-tone">ハッシュタグの雰囲気</Label>
        <Select items={toneItems} value={form.tone} onValueChange={(v) => v && updateForm("tone", v as Tone)}>
          <SelectTrigger id="hashtag-tone" className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {toneOrder.map((t) => (
              <SelectItem key={t} value={t}>
                {toneLabels[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={handleGenerate} className="gap-1.5">
          <Sparkles className="size-4" />
          ハッシュタグを生成
        </Button>
        {categories && (
          <Button type="button" variant="outline" onClick={handleGenerate} className="gap-1.5">
            <RefreshCw className="size-4" />
            再生成
          </Button>
        )}
        <ResetButton onReset={handleReset} />
      </div>

      {categories && categories.length > 0 && (
        <div ref={resultRef} className="space-y-6">
          <ResultCard title={`生成結果（${allTags.length}個）`}>
            <div className="space-y-5">
              {categories.map((category) => (
                <div key={category.key}>
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">{category.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.tags.map((tag, index) => (
                      <div
                        key={tag}
                        className="flex items-center gap-1 rounded-full border border-border bg-card py-1 pr-1 pl-3 text-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => moveTag(category.key, index, -1)}
                          disabled={index === 0}
                          aria-label={`${tag}を前に移動`}
                          className="rounded-full p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                        >
                          <ArrowUp className="size-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveTag(category.key, index, 1)}
                          disabled={index === category.tags.length - 1}
                          aria-label={`${tag}を後ろに移動`}
                          className="rounded-full p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                        >
                          <ArrowDown className="size-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => copyTag(tag)}
                          aria-label={`${tag}をコピー`}
                          className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                        >
                          <Copy className="size-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTag(category.key, tag)}
                          aria-label={`${tag}を削除`}
                          className="rounded-full p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => copyAll(" ")}>
                スペース区切りで一括コピー
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => copyAll("\n")}>
                改行区切りで一括コピー
              </Button>
            </div>
          </ResultCard>

          <ResultShareActions
            shareText={`【Instagramハッシュタグ】\n${allTags.join(" ")}`}
            title="Instagramハッシュタグ自動生成"
            resultRef={resultRef}
          />
        </div>
      )}
    </div>
  );
}
