"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeftRight, Copy, Wand2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { ResetButton } from "@/components/shared/reset-button";
import { ErrorMessage } from "@/components/shared/error-message";
import {
  decodeText,
  encodeText,
  urlCodecExamples,
  urlCodecModeExplanation,
  urlCodecModeLabels,
  type UrlCodecMode,
} from "@/utils/url-codec";

type Direction = "encode" | "decode";
const modes: UrlCodecMode[] = ["full", "param", "japanese"];

export function UrlEncodeDecode() {
  const [mode, setMode] = useState<UrlCodecMode>("full");
  const [direction, setDirection] = useState<Direction>("encode");
  const [input, setInput] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const result = useMemo(() => {
    if (!input) return { value: "", error: undefined };
    return direction === "encode" ? encodeText(input, mode) : decodeText(input, mode);
  }, [input, mode, direction]);

  function handleSwap() {
    if (result.error || !result.value) return;
    setInput(result.value);
    setDirection((d) => (d === "encode" ? "decode" : "encode"));
  }

  function handleSample() {
    const sample = urlCodecExamples[mode];
    setInput(direction === "encode" ? sample : encodeText(sample, mode).value);
  }

  function handleReset() {
    setInput("");
    setMode("full");
    setDirection("encode");
  }

  async function handleCopy() {
    if (!result.value) return;
    await navigator.clipboard.writeText(result.value);
    toast.success("結果をコピーしました");
  }

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => v && setMode(v as UrlCodecMode)}>
        <TabsList className="grid w-full grid-cols-3">
          {modes.map((m) => (
            <TabsTrigger key={m} value={m}>
              {urlCodecModeLabels[m]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <p className="text-xs text-muted-foreground">{urlCodecModeExplanation[mode]}</p>

      <Tabs value={direction} onValueChange={(v) => v && setDirection(v as Direction)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">エンコード</TabsTrigger>
          <TabsTrigger value="decode">デコード</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="url-codec-input">{direction === "encode" ? "変換前の文字列" : "デコードする文字列"}</Label>
          <Button type="button" variant="ghost" size="sm" onClick={handleSample} className="gap-1.5">
            <Wand2 className="size-3.5" />
            サンプルを挿入
          </Button>
        </div>
        <Textarea
          id="url-codec-input"
          rows={5}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ここに文字列を入力してください（改行・日本語・記号に対応）"
          aria-invalid={Boolean(result.error)}
        />
        {result.error && <ErrorMessage>{result.error}</ErrorMessage>}
      </div>

      <div className="flex justify-center">
        <Button type="button" variant="outline" size="sm" onClick={handleSwap} className="gap-1.5">
          <ArrowLeftRight className="size-4" />
          結果を入力欄に入れ替えて{direction === "encode" ? "デコード" : "エンコード"}
        </Button>
      </div>

      <div ref={resultRef} className="space-y-2">
        <Label htmlFor="url-codec-output">{direction === "encode" ? "エンコード後の文字列" : "デコード後の文字列"}</Label>
        <Textarea id="url-codec-output" readOnly rows={5} value={result.value} className="bg-muted/30" />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
            <Copy className="size-3.5" />
            結果をコピー
          </Button>
          <ResetButton onReset={handleReset} />
        </div>
      </div>

      {result.value && !result.error && (
        <ResultShareActions
          shareText={`【URLエンコード・デコード】\n${result.value}`}
          title="URLエンコード・デコード"
          resultRef={resultRef}
        />
      )}
    </div>
  );
}
