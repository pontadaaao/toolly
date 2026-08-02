"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Download, FileArchive, X } from "lucide-react";
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
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { canvasToBlob, downloadBlob, formatBytes, loadImageFromFile, stripExtension } from "@/utils/image";

type TargetFormat = "png" | "jpeg";

const formatLabels: Record<TargetFormat, string> = { png: "PNG", jpeg: "JPG" };
const formatExt: Record<TargetFormat, string> = { png: "png", jpeg: "jpg" };
const MAX_FILE_SIZE = 20 * 1024 * 1024;

interface ConvertItem {
  id: string;
  file: File;
  previewUrl: string;
  resultBlob: Blob | null;
  error?: string;
}

const initialState = { format: "png" as TargetFormat, quality: 0.85, background: "#ffffff", suffix: "-converted" };

export function JpgPngConverter() {
  const [items, setItems] = useState<ConvertItem[]>([]);
  const [format, setFormat] = useState(initialState.format);
  const [quality, setQuality] = useState(initialState.quality);
  const [background, setBackground] = useState(initialState.background);
  const [suffix, setSuffix] = useState(initialState.suffix);
  const [isProcessing, setIsProcessing] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleFiles(files: File[]) {
    const accepted: File[] = [];
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} は上限（20MB）を超えているため追加できません`);
        continue;
      }
      accepted.push(file);
    }
    if (accepted.length === 0) return;
    setItems((prev) => [
      ...prev,
      ...accepted.map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        resultBlob: null as Blob | null,
      })),
    ]);
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }

  function handleReset() {
    items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    setItems([]);
    setFormat(initialState.format);
    setQuality(initialState.quality);
    setBackground(initialState.background);
    setSuffix(initialState.suffix);
  }

  function outputName(item: ConvertItem) {
    return `${stripExtension(item.file.name)}${suffix}.${formatExt[format]}`;
  }

  async function convertAll() {
    setIsProcessing(true);
    try {
      const results = await Promise.all(
        items.map(async (item) => {
          try {
            const img = await loadImageFromFile(item.file);
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) return { ...item, error: "変換に失敗しました" };
            if (format === "jpeg") {
              ctx.fillStyle = background;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.drawImage(img, 0, 0);
            const blob = await canvasToBlob(canvas, format === "png" ? "image/png" : "image/jpeg", format === "jpeg" ? quality : undefined);
            return { ...item, resultBlob: blob, error: undefined };
          } catch {
            return { ...item, error: "変換に失敗しました" };
          }
        })
      );
      setItems(results);
      toast.success("変換が完了しました");
    } finally {
      setIsProcessing(false);
    }
  }

  function downloadItem(item: ConvertItem) {
    if (item.resultBlob) downloadBlob(item.resultBlob, outputName(item));
  }

  async function downloadZip() {
    const done = items.filter((i) => i.resultBlob);
    if (done.length === 0) return;
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    done.forEach((item) => zip.file(outputName(item), item.resultBlob as Blob));
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, "converted-images.zip");
  }

  const convertedCount = items.filter((i) => i.resultBlob).length;
  const shareText = `【JPG・PNG変換】${items.length}枚の画像を${formatLabels[format]}に変換`;

  return (
    <div className="space-y-6">
      <PrivacyNotice />

      <FileDropzone
        accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
        onFiles={handleFiles}
        label="画像をドラッグ&ドロップ、またはクリックしてアップロード"
        hint="JPG・JPEG・PNGに対応。複数枚まとめて変換できます（1枚あたり20MBまで）。"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="target-format">出力形式</Label>
          <Select items={formatLabels} value={format} onValueChange={(v) => v && setFormat(v as TargetFormat)}>
            <SelectTrigger id="target-format" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPG</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="output-suffix">ファイル名の末尾</Label>
          <Input id="output-suffix" value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder="-converted" />
        </div>
      </div>

      {format === "jpeg" && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>JPG品質</Label>
              <span className="text-sm text-muted-foreground">{Math.round(quality * 100)}</span>
            </div>
            <Slider value={[quality]} min={0.01} max={1} step={0.01} onValueChange={(v) => setQuality(Array.isArray(v) ? v[0] : v)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jpg-bg">透過部分の背景色</Label>
            <Input id="jpg-bg" type="color" value={background} onChange={(e) => setBackground(e.target.value)} />
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        画像の縦横比・サイズは変換前のまま保持されます。ブラウザ内での再エンコード処理のため、Exif（撮影日時・位置情報など）のメタデータは変換後の画像には保持されません。
      </p>

      {items.length === 0 ? (
        <EmptyState title="まだ画像がアップロードされていません" description="上のエリアに画像を追加すると、ここに一覧が表示されます。" />
      ) : (
        <div ref={resultRef} className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.previewUrl} alt={item.file.name} className="size-14 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(item.file.size)}
                  {item.resultBlob && ` → ${formatBytes(item.resultBlob.size)}（${formatLabels[format]}）`}
                  {item.error && <span className="text-destructive"> {item.error}</span>}
                </p>
              </div>
              {item.resultBlob && (
                <Button size="icon" variant="outline" onClick={() => downloadItem(item)} aria-label="ダウンロード">
                  <Download className="size-4" />
                </Button>
              )}
              <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)} aria-label="削除">
                <X className="size-4" />
              </Button>
            </div>
          ))}

          {isProcessing && <LoadingIndicator label="変換中…" />}

          <div className="flex flex-wrap gap-2">
            <Button onClick={convertAll} disabled={isProcessing}>
              一括変換
            </Button>
            <Button
              variant="outline"
              onClick={() => items.forEach((item) => item.resultBlob && downloadItem(item))}
              disabled={convertedCount === 0}
              className="gap-1.5"
            >
              <Download className="size-4" />
              1枚ずつ保存
            </Button>
            <Button variant="outline" onClick={downloadZip} disabled={convertedCount === 0} className="gap-1.5">
              <FileArchive className="size-4" />
              ZIPで一括保存
            </Button>
            <ResetButton onReset={handleReset} />
          </div>
        </div>
      )}

      {convertedCount > 0 && <ResultShareActions shareText={shareText} title="JPG・PNG変換" resultRef={resultRef} />}
    </div>
  );
}
