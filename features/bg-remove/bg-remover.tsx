"use client";

import { Download, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { EmptyState } from "@/components/shared/empty-state";
import { downloadBlob, stripExtension } from "@/utils/image";

interface BgRemoveItem {
  id: string;
  name: string;
  originalUrl: string;
  resultUrl: string | null;
  resultBlob: Blob | null;
  status: "processing" | "done" | "error";
}

export function BgRemover() {
  const [items, setItems] = useState<BgRemoveItem[]>([]);

  async function handleFiles(files: File[]) {
    const newItems: BgRemoveItem[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      originalUrl: URL.createObjectURL(file),
      resultUrl: null,
      resultBlob: null,
      status: "processing",
    }));
    setItems((prev) => [...prev, ...newItems]);

    const { removeBackground } = await import("@imgly/background-removal");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const item = newItems[i];
      try {
        const blob = await removeBackground(file, { proxyToWorker: true });
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? { ...it, resultBlob: blob, resultUrl: URL.createObjectURL(blob), status: "done" }
              : it
          )
        );
      } catch {
        setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: "error" } : it)));
      }
    }
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function downloadItem(item: BgRemoveItem) {
    if (!item.resultBlob) return;
    downloadBlob(item.resultBlob, `${stripExtension(item.name)}-transparent.png`);
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
        hint="JPEG・PNG・WebPに対応。初回利用時はAIモデルのダウンロードのため少し時間がかかります。"
      />

      {items.length === 0 ? (
        <EmptyState
          title="まだ画像がアップロードされていません"
          description="上のエリアに画像を追加すると、AIが人物や物体を検出して背景を自動で透過します。"
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.originalUrl} alt={item.name} className="size-14 shrink-0 rounded-lg object-cover" />
              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-checkerboard">
                {item.status === "processing" && <Loader2 className="size-5 animate-spin text-muted-foreground" />}
                {item.resultUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.resultUrl}
                    alt={`${item.name}（背景透過後）`}
                    className="size-14 object-contain"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.status === "processing" && "背景を検出中…"}
                  {item.status === "done" && "背景の透過が完了しました"}
                  {item.status === "error" && "処理に失敗しました"}
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

          <Button onClick={downloadAll} disabled={!items.some((i) => i.resultBlob)} className="gap-1.5">
            <Download className="size-4" />
            すべてダウンロード
          </Button>
        </div>
      )}
    </div>
  );
}
