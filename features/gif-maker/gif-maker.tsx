"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { EmptyState } from "@/components/shared/empty-state";
import { PrivacyNotice } from "@/components/shared/privacy-notice";
import { LoadingIndicator } from "@/components/shared/loading-indicator";
import { ResetButton } from "@/components/shared/reset-button";
import { UnitInput } from "@/components/shared/unit-input";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { drawFrameToCanvas, encodeGif, gifFitModeLabels, type GifFitMode, type GifLoopMode } from "@/utils/gif-encoder";
import { downloadBlob, formatBytes, loadImageFromFile } from "@/utils/image";

interface FrameItem {
  id: string;
  file: File;
  previewUrl: string;
  delay: number;
}

const fitModes: GifFitMode[] = ["cover", "pad", "contain", "stretch"];
const loopItems = { infinite: "無限ループ", once: "1回のみ再生", custom: "回数を指定" };

export function GifMaker() {
  const [frames, setFrames] = useState<FrameItem[]>([]);
  const [width, setWidth] = useState("400");
  const [height, setHeight] = useState("400");
  const [fit, setFit] = useState<GifFitMode>("cover");
  const [background, setBackground] = useState("#ffffff");
  const [uniformDelay, setUniformDelay] = useState(true);
  const [defaultDelay, setDefaultDelay] = useState("500");
  const [loopKind, setLoopKind] = useState<"infinite" | "once" | "custom">("infinite");
  const [loopCount, setLoopCount] = useState("3");
  const [quality, setQuality] = useState(200);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const cancelledRef = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleFiles(files: File[]) {
    setFrames((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        delay: Number(defaultDelay) || 500,
      })),
    ]);
  }

  function removeFrame(id: string) {
    setFrames((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  }

  function moveFrame(index: number, direction: -1 | 1) {
    setFrames((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function updateFrameDelay(id: string, delay: number) {
    setFrames((prev) => prev.map((f) => (f.id === id ? { ...f, delay } : f)));
  }

  function handleReset() {
    frames.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setFrames([]);
    setWidth("400");
    setHeight("400");
    setFit("cover");
    setBackground("#ffffff");
    setUniformDelay(true);
    setDefaultDelay("500");
    setLoopKind("infinite");
    setLoopCount("3");
    setQuality(200);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultBlob(null);
    setResultUrl(null);
  }

  function handleCancel() {
    cancelledRef.current = true;
    setIsGenerating(false);
    toast.info("生成を中止しました");
  }

  async function handleGenerate() {
    if (frames.length === 0) return;
    const w = Number(width) || 400;
    const h = Number(height) || 400;
    cancelledRef.current = false;
    setIsGenerating(true);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultBlob(null);
    setResultUrl(null);

    try {
      const canvases = await Promise.all(
        frames.map(async (frame) => {
          const img = await loadImageFromFile(frame.file);
          return {
            canvas: drawFrameToCanvas(img, w, h, fit, background),
            delay: uniformDelay ? Number(defaultDelay) || 500 : frame.delay,
          };
        })
      );
      if (cancelledRef.current) return;

      const loop: GifLoopMode = loopKind === "custom" ? Number(loopCount) || 1 : loopKind;
      const blob = await encodeGif({ width: w, height: h, frames: canvases, loop, maxColors: quality });
      if (cancelledRef.current) return;

      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
      toast.success("GIFを生成しました");
    } catch {
      if (!cancelledRef.current) toast.error("GIFの生成に失敗しました");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleDownload() {
    if (resultBlob) downloadBlob(resultBlob, "animation.gif");
  }

  return (
    <div className="space-y-6">
      <PrivacyNotice>アップロードした画像はすべて端末内でGIFに変換され、サーバーに送信されることはありません。</PrivacyNotice>

      <FileDropzone
        accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
        onFiles={handleFiles}
        label="画像をドラッグ&ドロップ、またはクリックしてアップロード"
        hint="JPG・PNG・WebPに対応。複数枚アップロードして並び順どおりにアニメーションになります。"
      />

      {frames.length === 0 ? (
        <EmptyState title="まだ画像がアップロードされていません" description="2枚以上の画像を追加するとGIFを作成できます。" />
      ) : (
        <div className="space-y-2">
          {frames.map((frame, index) => (
            <div key={frame.id} className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={frame.previewUrl} alt={frame.file.name} className="size-12 shrink-0 rounded-lg object-cover" />
              <p className="min-w-0 flex-1 truncate text-sm">{frame.file.name}</p>
              {!uniformDelay && (
                <Input
                  type="number"
                  inputMode="numeric"
                  min={10}
                  value={frame.delay}
                  onChange={(e) => updateFrameDelay(frame.id, Number(e.target.value) || 0)}
                  className="w-20"
                  aria-label={`${frame.file.name}の表示時間（ミリ秒）`}
                />
              )}
              <Button size="icon-sm" variant="ghost" onClick={() => moveFrame(index, -1)} disabled={index === 0} aria-label="上へ移動">
                <ArrowUp className="size-4" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => moveFrame(index, 1)}
                disabled={index === frames.length - 1}
                aria-label="下へ移動"
              >
                <ArrowDown className="size-4" />
              </Button>
              <Button size="icon-sm" variant="ghost" onClick={() => removeFrame(frame.id)} aria-label="削除">
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <UnitInput id="gif-width" label="GIFの横幅" unit="px" value={width} onChange={setWidth} min={16} max={1200} step={1} />
        <UnitInput id="gif-height" label="GIFの高さ" unit="px" value={height} onChange={setHeight} min={16} max={1200} step={1} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="gif-fit">サイズが異なる場合の処理</Label>
          <Select items={gifFitModeLabels} value={fit} onValueChange={(v) => v && setFit(v as GifFitMode)}>
            <SelectTrigger id="gif-fit" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fitModes.map((m) => (
                <SelectItem key={m} value={m}>
                  {gifFitModeLabels[m]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gif-bg">背景色</Label>
          <Input id="gif-bg" type="color" value={background} onChange={(e) => setBackground(e.target.value)} />
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border p-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={uniformDelay}
            onChange={(e) => setUniformDelay(e.target.checked)}
            className="size-4 rounded border-input"
          />
          全画像へ同じ表示時間を設定する
        </label>
        {uniformDelay && (
          <UnitInput
            id="gif-default-delay"
            label="1コマあたりの表示時間"
            unit="ミリ秒"
            value={defaultDelay}
            onChange={setDefaultDelay}
            min={10}
            step={10}
          />
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="gif-loop">繰り返し回数</Label>
          <Select items={loopItems} value={loopKind} onValueChange={(v) => v && setLoopKind(v as typeof loopKind)}>
            <SelectTrigger id="gif-loop" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="infinite">無限ループ</SelectItem>
              <SelectItem value="once">1回のみ再生</SelectItem>
              <SelectItem value="custom">回数を指定</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {loopKind === "custom" && (
          <UnitInput id="gif-loop-count" label="ループ回数" unit="回" value={loopCount} onChange={setLoopCount} min={1} step={1} />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>画質（色数）</Label>
          <span className="text-sm text-muted-foreground">{quality}色</span>
        </div>
        <Slider value={[quality]} min={2} max={255} step={1} onValueChange={(v) => setQuality(Array.isArray(v) ? v[0] : v)} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={handleGenerate} disabled={frames.length === 0 || isGenerating}>
          GIFを生成
        </Button>
        {isGenerating && (
          <Button type="button" variant="outline" onClick={handleCancel}>
            中止する
          </Button>
        )}
        <ResetButton onReset={handleReset} />
      </div>

      {isGenerating && <LoadingIndicator label="GIFを生成しています…（画像の枚数により数秒〜数十秒かかります）" />}

      {resultUrl && resultBlob && (
        <div ref={resultRef} className="space-y-4">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resultUrl} alt="生成されたGIFアニメーション" className="max-w-full rounded-lg bg-checkerboard" />
            <p className="text-sm text-muted-foreground">ファイルサイズ: {formatBytes(resultBlob.size)}</p>
            <Button type="button" onClick={handleDownload} className="gap-1.5">
              <Download className="size-4" />
              GIFを保存
            </Button>
          </div>
          <ResultShareActions
            shareText={`【GIF作成】${frames.length}枚の画像からアニメーションGIFを作成しました`}
            title="GIF作成"
            resultRef={resultRef}
          />
        </div>
      )}
    </div>
  );
}
