"use client";

import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { analyzeText } from "@/utils/text";

export function CharCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const stats = useMemo(() => analyzeText(text), [text]);

  const handleCopy = async () => {
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
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ここに文章を入力または貼り付けてください"
          rows={10}
          className="w-full resize-y rounded-xl border border-input bg-transparent p-4 pr-28 text-sm leading-relaxed shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!text}
          className="absolute top-3 right-3"
        >
          {copied ? (
            <>
              <Check className="text-primary" />
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBox label="文字数" value={stats.characterCount.toLocaleString()} highlight />
        <StatBox label="空白除外" value={stats.characterCountNoSpaces.toLocaleString()} />
        <StatBox label="改行数" value={stats.lineCount.toLocaleString()} />
        <StatBox label="読了時間" value={`約${stats.readingTimeMinutes}分`} />
      </div>
    </div>
  );
}

function StatBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 font-semibold ${highlight ? "text-2xl text-primary" : "text-lg"}`}>{value}</p>
    </div>
  );
}
