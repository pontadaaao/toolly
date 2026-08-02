"use client";

import { Download, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { EmptyState } from "@/components/shared/empty-state";
import { canvasToBlob, downloadBlob, formatBytes, loadImageFromFile, stripExtension } from "@/utils/image";

type TargetFormat = "webp" | "png" | "jpeg";

const formatMime: Record<TargetFormat, string> = {
  webp: "image/webp",
  png: "image/png",
  jpeg: "image/jpeg",
};

const formatLabels: Record<TargetFormat, string> = {
  webp: "WebP",
  png: "PNG",
  jpeg: "JPG",
};

const formatExt: Record<TargetFormat, string> = {
  webp: "webp",
  png: "png",
  jpeg: "jpg",
};

interface ConvertItem {
  id: string;
  file: File;
  resultBlob: Blob | null;
}

export function WebpConverter() {
  const [items, setItems] = useState<ConvertItem[]>([]);
  const [format, setFormat] = useState<TargetFormat>("webp");
  const [quality, setQuality] = useState(0.8);
  const [isProcessing, setIsProcessing] = useState(false);

  function handleFiles(files: File[]) {
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        resultBlob: null as Blob | null,
      })),
    ]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function convertAll() {
    setIsProcessing(true);
    try {
      const results = await Promise.all(
        items.map(async (item) => {
          const img = await loadImageFromFile(item.file);
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) return item;
          ctx.drawImage(img, 0, 0);
          const blob = await canvasToBlob(canvas, formatMime[format], quality);
          return { ...item, resultBlob: blob };
        })
      );
      setItems(results);
    } finally {
      setIsProcessing(false);
    }
  }

  function downloadItem(item: ConvertItem) {
    if (!item.resultBlob) return;
    downloadBlob(item.resultBlob, `${stripExtension(item.file.name)}.${formatExt[format]}`);
  }

  function downloadAll() {
    items.forEach((item) => item.resultBlob && downloadItem(item));
  }

  return (
    <div className="space-y-6">
      <FileDropzone
        accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
        onFiles={handleFiles}
        label="画像をドラッグ&ドロップ、またはクリックしてアップロード"
        hint="PNG・JPG・WebPを相互に変換できます。"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="target-format">変換先フォーマット</Label>
          <Select items={formatLabels} value={format} onValueChange={(v) => setFormat(v as TargetFormat)}>
            <SelectTrigger id="target-format" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="webp">WebP</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPG</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>画質</Label>
            <span className="text-sm text-muted-foreground">{Math.round(quality * 100)}%</span>
          </div>
          <Slider
            value={[quality]}
            min={0.1}
            max={1}
            step={0.05}
            onValueChange={(v) => setQuality(Array.isArray(v) ? v[0] : v)}
            disabled={format === "png"}
          />
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState title="まだ画像がアップロードされていません" />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(item.file.size)}
                  {item.resultBlob && ` → ${formatBytes(item.resultBlob.size)}（${formatExt[format].toUpperCase()}）`}
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
          <div className="flex gap-2">
            <Button onClick={convertAll} disabled={isProcessing}>
              {isProcessing ? "変換中…" : "一括変換"}
            </Button>
            <Button variant="outline" onClick={downloadAll} disabled={!items.some((i) => i.resultBlob)} className="gap-1.5">
              <Download className="size-4" />
              すべてダウンロード
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
