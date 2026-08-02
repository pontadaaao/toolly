"use client";

import imageCompression from "browser-image-compression";
import { Download, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { EmptyState } from "@/components/shared/empty-state";
import { downloadBlob, formatBytes, stripExtension } from "@/utils/image";
import { cn } from "@/lib/utils";

interface CompressedItem {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number | null;
  compressedBlob: Blob | null;
  previewUrl: string;
  status: "pending" | "done" | "error";
}

export function ImageCompressor() {
  const [items, setItems] = useState<CompressedItem[]>([]);
  const [quality, setQuality] = useState(0.7);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleFiles(files: File[]) {
    const newItems: CompressedItem[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      originalSize: file.size,
      compressedSize: null,
      compressedBlob: null,
      previewUrl: URL.createObjectURL(file),
      status: "pending",
    }));

    setItems((prev) => [...prev, ...newItems]);
    setIsProcessing(true);

    await Promise.all(
      files.map(async (file, index) => {
        const item = newItems[index];
        try {
          const compressed = await imageCompression(file, {
            maxSizeMB: 20,
            maxWidthOrHeight: 4096,
            initialQuality: quality,
            useWebWorker: true,
          });
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, compressedBlob: compressed, compressedSize: compressed.size, status: "done" } : i
            )
          );
        } catch {
          setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "error" } : i)));
        }
      })
    );

    setIsProcessing(false);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function downloadItem(item: CompressedItem) {
    if (!item.compressedBlob) return;
    downloadBlob(item.compressedBlob, `${stripExtension(item.name)}-compressed.jpg`);
  }

  function downloadAll() {
    items.forEach((item) => item.compressedBlob && downloadItem(item));
  }

  return (
    <div className="space-y-6">
      <FileDropzone
        accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
        onFiles={handleFiles}
        label="画像をドラッグ&ドロップ、またはクリックしてアップロード"
        hint="JPEG・PNG・WebPに対応。複数枚まとめて圧縮できます。"
      />

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
        />
      </div>

      {items.length === 0 ? (
        <EmptyState title="まだ画像がアップロードされていません" description="上のエリアに画像を追加すると、ここに一覧が表示されます。" />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.previewUrl} alt={item.name} className="size-14 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(item.originalSize)}
                  {item.status === "done" && item.compressedSize !== null && (
                    <>
                      {" "}
                      →{" "}
                      <span className={cn("font-medium text-secondary")}>{formatBytes(item.compressedSize)}</span>{" "}
                      （-{Math.round((1 - item.compressedSize / item.originalSize) * 100)}%）
                    </>
                  )}
                  {item.status === "pending" && " 圧縮中…"}
                  {item.status === "error" && " 圧縮に失敗しました"}
                </p>
              </div>
              {item.status === "done" && (
                <Button size="icon" variant="outline" onClick={() => downloadItem(item)} aria-label="ダウンロード">
                  <Download className="size-4" />
                </Button>
              )}
              <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)} aria-label="削除">
                <X className="size-4" />
              </Button>
            </div>
          ))}

          <Button onClick={downloadAll} disabled={isProcessing || !items.some((i) => i.compressedBlob)} className="gap-1.5">
            <Download className="size-4" />
            すべてダウンロード
          </Button>
        </div>
      )}
    </div>
  );
}
