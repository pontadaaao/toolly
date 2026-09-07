"use client";

import { Check, Copy, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrivacyNotice } from "@/components/shared/privacy-notice";
import {
  countCharacters,
  countLines,
  formatCaption,
  invisibleChars,
  type InvisibleCharKey,
} from "@/utils/sns-text";

/** Instagram's caption limit; the counter turns red past this. */
const CAPTION_LIMIT = 2200;

const charItems = Object.fromEntries(
  (Object.keys(invisibleChars) as InvisibleCharKey[]).map((k) => [k, invisibleChars[k].label])
);

export function InstagramLineBreakFormatter() {
  const [input, setInput] = useState("");
  const [keepBlankLines, setKeepBlankLines] = useState(true);
  const [trimLineEnds, setTrimLineEnds] = useState(true);
  const [limitConsecutiveBlanks, setLimitConsecutiveBlanks] = useState(false);
  const [invisibleChar, setInvisibleChar] = useState<InvisibleCharKey>("braille");
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () =>
      formatCaption(input, {
        keepBlankLines,
        trimLineEnds,
        limitConsecutiveBlanks,
        invisibleChar,
      }),
    [input, keepBlankLines, trimLineEnds, limitConsecutiveBlanks, invisibleChar]
  );

  const charCount = countCharacters(result.text);
  const overLimit = charCount > CAPTION_LIMIT;

  async function handleCopy() {
    if (!result.text) return;
    try {
      await navigator.clipboard.writeText(result.text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = result.text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    toast.success("整形後のテキストをコピーしました");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="caption-input">キャプション（元の文章）</Label>
        <textarea
          id="caption-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"今日のカフェ巡り☕\n\n渋谷の隠れ家カフェに行ってきました。\n\n・こだわりの自家焙煎\n・落ち着いた雰囲気\n\n#カフェ巡り #渋谷カフェ"}
          rows={10}
          className="w-full resize-y rounded-xl border border-input bg-transparent p-4 text-sm leading-relaxed shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <p className="text-xs text-muted-foreground">
          改行や空行をそのまま入力してください。整形後の文章がすぐ下に表示されます。
        </p>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
        <p className="text-sm font-medium">整形オプション</p>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={keepBlankLines}
            onChange={(e) => setKeepBlankLines(e.target.checked)}
            className="mt-0.5 size-4 rounded border-input"
          />
          <span>
            空行を維持する
            <span className="block text-xs text-muted-foreground">
              空行に見えない文字を1つ入れて、投稿時に詰められるのを防ぎます。
            </span>
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={trimLineEnds}
            onChange={(e) => setTrimLineEnds(e.target.checked)}
            className="mt-0.5 size-4 rounded border-input"
          />
          <span>
            行末の余分な空白を削除する
            <span className="block text-xs text-muted-foreground">
              行末のスペースは改行が消える原因になります。
            </span>
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={limitConsecutiveBlanks}
            onChange={(e) => setLimitConsecutiveBlanks(e.target.checked)}
            className="mt-0.5 size-4 rounded border-input"
          />
          <span>
            3行以上続く空行を2行にまとめる
            <span className="block text-xs text-muted-foreground">
              空きすぎた行間を整えたいときに使います。
            </span>
          </span>
        </label>

        {keepBlankLines && (
          <div className="space-y-2 pt-1">
            <Label>空行に入れる文字</Label>
            <Select
              items={charItems}
              value={invisibleChar}
              onValueChange={(v) => v && setInvisibleChar(v as InvisibleCharKey)}
            >
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(invisibleChars) as InvisibleCharKey[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {invisibleChars[key].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              うまく反映されないときは別の文字に切り替えてお試しください。
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="caption-output">整形後（これをコピーして貼り付け）</Label>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setInput("")} disabled={!input}>
              <RotateCcw />
              クリア
            </Button>
            <Button type="button" size="sm" onClick={handleCopy} disabled={!result.text}>
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
        </div>
        <textarea
          id="caption-output"
          value={result.text}
          readOnly
          rows={10}
          placeholder="ここに整形後のテキストが表示されます"
          className="w-full resize-y rounded-xl border border-input bg-muted/40 p-4 text-sm leading-relaxed shadow-xs outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBox
          label="文字数"
          value={`${charCount.toLocaleString()} / ${CAPTION_LIMIT.toLocaleString()}`}
          highlight
          warning={overLimit}
        />
        <StatBox label="行数" value={countLines(result.text).toLocaleString()} />
        <StatBox label="維持した空行" value={result.filledLines.toLocaleString()} />
        <StatBox label="削除した行末空白" value={result.trimmedLines.toLocaleString()} />
      </div>

      {overLimit && (
        <p role="alert" className="text-sm text-destructive">
          Instagramのキャプション上限（{CAPTION_LIMIT.toLocaleString()}文字）を
          {(charCount - CAPTION_LIMIT).toLocaleString()}文字超えています。
        </p>
      )}

      <PrivacyNotice>
        入力した文章は端末内でのみ処理され、サーバーに送信・保存されることはありません。
      </PrivacyNotice>
    </div>
  );
}

function StatBox({
  label,
  value,
  highlight,
  warning,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`mt-1 font-semibold ${
          warning ? "text-2xl text-destructive" : highlight ? "text-2xl text-primary" : "text-lg"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
