"use client";

import { Download, ImageIcon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { EmptyState } from "@/components/shared/empty-state";
import { canvasToBlob, downloadBlob, formatBytes, loadImageFromFile, stripExtension } from "@/utils/image";

interface ResizeItem {
  id: string;
  file: File;
  previewUrl: string;
  naturalWidth: number;
  naturalHeight: number;
  resultBlob: Blob | null;
}

export function ImageResizer() {
  const [items, setItems] = useState<ResizeItem[]>([]);
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
  const [lockRatio, setLockRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleFiles(files: File[]) {
    const loaded = await Promise.all(
      files.map(async (file) => {
        const img = await loadImageFromFile(file);
        return {
          id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
          file,
          previewUrl: img.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          resultBlob: null as Blob | null,
        };
      })
    );

    setItems((prev) => {
      const next = [...prev, ...loaded];
      if (prev.length === 0 && loaded[0]) {
        setWidth(loaded[0].naturalWidth);
        setHeight(loaded[0].naturalHeight);
      }
      return next;
    });
  }

  function handleWidthChange(value: number) {
    setWidth(value);
    if (lockRatio && items[0]) {
      const ratio = items[0].naturalHeight / items[0].naturalWidth;
      setHeight(Math.round(value * ratio));
    }
  }

  function handleHeightChange(value: number) {
    setHeight(value);
    if (lockRatio && items[0]) {
      const ratio = items[0].naturalWidth / items[0].naturalHeight;
      setWidth(Math.round(value * ratio));
    }
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function processAll() {
    setIsProcessing(true);
    try {
      const results = await Promise.all(
        items.map(async (item) => {
          const img = await loadImageFromFile(item.file);
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return item;
          ctx.drawImage(img, 0, 0, width, height);
          const blob = await canvasToBlob(canvas, item.file.type || "image/png", 0.92);
          return { ...item, resultBlob: blob };
        })
      );
      setItems(results);
    } finally {
      setIsProcessing(false);
    }
  }

  function downloadItem(item: ResizeItem) {
    if (!item.resultBlob) return;
    downloadBlob(item.resultBlob, `${stripExtension(item.file.name)}-${width}x${height}.png`);
  }

  return (
    <div className="space-y-6">
      <FileDropzone
        accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
        onFiles={handleFiles}
        label="画像をドラッグ&ドロップ、またはクリックしてアップロード"
        hint="複数枚まとめて同じサイズにリサイズできます。"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="width">横幅（px）</Label>
          <Input id="width" type="number" min={1} value={width} onChange={(e) => handleWidthChange(Number(e.target.value) || 0)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">縦幅（px）</Label>
          <Input id="height" type="number" min={1} value={height} onChange={(e) => handleHeightChange(Number(e.target.value) || 0)} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} className="size-4 rounded border-input" />
        縦横比を固定する（最初の画像を基準）
      </label>

      {items.length === 0 ? (
        <EmptyState icon={ImageIcon} title="まだ画像がアップロードされていません" />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.previewUrl} alt={item.file.name} className="size-14 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.naturalWidth}×{item.naturalHeight}
                  {item.resultBlob && ` → ${width}×${height}（${formatBytes(item.resultBlob.size)}）`}
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
          <Button onClick={processAll} disabled={isProcessing} className="gap-1.5">
            {isProcessing ? "処理中…" : "一括リサイズ"}
          </Button>
        </div>
      )}
    </div>
  );
}
