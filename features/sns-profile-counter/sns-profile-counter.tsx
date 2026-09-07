"use client";

import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrivacyNotice } from "@/components/shared/privacy-notice";
import { countCharacters, countLines, postLimits, profileLimits, type SnsLimit } from "@/utils/sns-text";
import { cn } from "@/lib/utils";

type Mode = "profile" | "post";

const modeLabels: Record<Mode, string> = {
  profile: "プロフィール（自己紹介）",
  post: "投稿・キャプション",
};

const placeholders: Record<Mode, string> = {
  profile: "都内でカフェ巡りをしています☕\n週3でおすすめのお店を紹介中\n お仕事のご依頼はDMまで",
  post: "今日のカフェ巡り☕\n渋谷の隠れ家カフェに行ってきました。\n\n#カフェ巡り #渋谷カフェ",
};

export function SnsProfileCounter() {
  const [mode, setMode] = useState<Mode>("profile");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const limits = mode === "profile" ? profileLimits : postLimits;
  const charCount = useMemo(() => countCharacters(text), [text]);
  const lineCount = useMemo(() => countLines(text), [text]);

  async function handleCopy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <TabsList className="grid w-full grid-cols-2">
          {(Object.keys(modeLabels) as Mode[]).map((m) => (
            <TabsTrigger key={m} value={m}>
              {modeLabels[m]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="sns-text">
            {mode === "profile" ? "自己紹介文" : "投稿本文・キャプション"}
          </Label>
          <Button type="button" variant="outline" size="sm" onClick={handleCopy} disabled={!text}>
            {copied ? (
              <>
                <Check />
                コピー済み
              </>
            ) : (
              <>
                <Copy />
                コピー
              </>
            )}
          </Button>
        </div>
        <textarea
          id="sns-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholders[mode]}
          rows={7}
          className="w-full resize-y rounded-xl border border-input bg-transparent p-4 text-sm leading-relaxed shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-xs text-muted-foreground">文字数</p>
          <p className="mt-1 text-2xl font-semibold text-primary">{charCount.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-xs text-muted-foreground">行数</p>
          <p className="mt-1 text-lg font-semibold">{lineCount.toLocaleString()}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">各SNSの上限との比較</h3>
        <ul className="space-y-3">
          {limits.map((limit) => (
            <LimitRow key={`${limit.name}-${limit.field}`} limit={limit} count={charCount} />
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          上限は各SNSの仕様変更により変わることがあります。上限ぎりぎりの場合は、実際の入力画面でもご確認ください。
        </p>
      </section>

      <PrivacyNotice>
        入力した文章は端末内でのみ処理され、サーバーに送信・保存されることはありません。
      </PrivacyNotice>
    </div>
  );
}

function LimitRow({ limit, count }: { limit: SnsLimit; count: number }) {
  const ratio = limit.limit === 0 ? 0 : Math.min(count / limit.limit, 1);
  const over = count > limit.limit;
  const remaining = limit.limit - count;

  return (
    <li className="rounded-xl border border-border bg-card p-4 shadow-soft">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-sm font-medium">
          {limit.name}
          <span className="ml-2 text-xs font-normal text-muted-foreground">{limit.field}</span>
        </p>
        <p className={cn("text-sm tabular-nums", over ? "font-semibold text-destructive" : "text-muted-foreground")}>
          {count.toLocaleString()} / {limit.limit.toLocaleString()}
          <span className="ml-2">
            {over
              ? `（${Math.abs(remaining).toLocaleString()}文字オーバー）`
              : `（あと${remaining.toLocaleString()}文字）`}
          </span>
        </p>
      </div>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={count}
        aria-valuemin={0}
        aria-valuemax={limit.limit}
        aria-label={`${limit.name}の${limit.field}`}
      >
        <div
          className={cn("h-full rounded-full transition-all", over ? "bg-destructive" : "bg-primary")}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </li>
  );
}
