"use client";

import { PDFDocument } from "pdf-lib";
import { FileDown, GripVertical, ImageIcon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorMessage } from "@/components/shared/error-message";
import { PrivacyNotice } from "@/components/shared/privacy-notice";
import { ResultCard } from "@/components/shared/result-card";
import { fitContain, pageSizePresets, type PageSizeKey } from "@/utils/pdf";
import { downloadBlob, formatBytes } from "@/utils/image";
import { cn } from "@/lib/utils";

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

const marginOptions = {
  none: { label: "余白なし", ratio: 0 },
  small: { label: "細い余白", ratio: 0.04 },
  large: { label: "広い余白", ratio: 0.1 },
} as const;

type MarginKey = keyof typeof marginOptions;

const sizeItems = Object.fromEntries(
  (Object.keys(pageSizePresets) as PageSizeKey[]).map((k) => [k, pageSizePresets[k].label])
);
const marginItems = Object.fromEntries(
  (Object.keys(marginOptions) as MarginKey[]).map((k) => [k, marginOptions[k].label])
);

export function ImageToPdfConverter() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSizeKey>("a4portrait");
  const [margin, setMargin] = useState<MarginKey>("small");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  function handleFiles(files: File[]) {
    const images = files.filter((f) => f.type === "image/jpeg" || f.type === "image/png");
    if (images.length === 0) {
      setError("JPG・PNG形式の画像を選択してください。");
      return;
    }
    setError(undefined);
    setResultBlob(null);
    setItems((prev) => [
      ...prev,
      ...images.map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
    setResultBlob(null);
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    setItems((prev) => {
      const fromIndex = prev.findIndex((i) => i.id === draggedId);
      const toIndex = prev.findIndex((i) => i.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setDraggedId(null);
    setResultBlob(null);
  }

  async function convert() {
    if (items.length === 0) return;
    setIsWorking(true);
    setError(undefined);
    try {
      const doc = await PDFDocument.create();

      for (const item of items) {
        const bytes = await item.file.arrayBuffer();
        const embedded =
          item.file.type === "image/png" ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);

        if (pageSize === "auto") {
          // One page per image, exactly the image's pixel dimensions.
          const page = doc.addPage([embedded.width, embedded.height]);
          page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
          continue;
        }

        const preset = pageSizePresets[pageSize];
        const page = doc.addPage([preset.width, preset.height]);
        const pad = Math.min(preset.width, preset.height) * marginOptions[margin].ratio;
        const box = fitContain(
          embedded.width,
          embedded.height,
          preset.width - pad * 2,
          preset.height - pad * 2
        );
        page.drawImage(embedded, {
          x: pad + box.x,
          y: pad + box.y,
          width: box.width,
          height: box.height,
        });
      }

      const saved = await doc.save();
      setResultBlob(new Blob([saved as BlobPart], { type: "application/pdf" }));
    } catch {
      setError("PDFの作成に失敗しました。CMYKのJPGなど、一部の画像は変換できない場合があります。");
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <div className="space-y-6">
      <FileDropzone
        accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
        onFiles={handleFiles}
        label="画像をドラッグ&ドロップ、またはクリックしてアップロード"
        hint="JPG・PNGに対応。複数枚まとめて追加できます。"
      />
      <PrivacyNotice />

      {items.length === 0 ? (
        <EmptyState
          title="まだ画像がアップロードされていません"
          description="上のエリアに画像を追加すると、ここに一覧が表示されます。"
        />
      ) : (
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              ドラッグして順番を並び替えられます。上から順にPDFのページになります。
            </p>
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  draggable
                  onDragStart={() => setDraggedId(item.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(item.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3 transition-opacity",
                    draggedId === item.id && "opacity-50"
                  )}
                >
                  <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground" />
                  <span className="w-6 shrink-0 text-center text-xs font-semibold text-muted-foreground">
                    {index + 1}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt=""
                    className="size-12 shrink-0 rounded-lg border border-border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(item.file.size)}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)} aria-label="削除">
                    <X className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>ページサイズ</Label>
              <Select
                items={sizeItems}
                value={pageSize}
                onValueChange={(v) => {
                  if (v) setPageSize(v as PageSizeKey);
                  setResultBlob(null);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(pageSizePresets) as PageSizeKey[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {pageSizePresets[key].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>余白</Label>
              <Select
                items={marginItems}
                value={margin}
                onValueChange={(v) => {
                  if (v) setMargin(v as MarginKey);
                  setResultBlob(null);
                }}
                disabled={pageSize === "auto"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(marginOptions) as MarginKey[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {marginOptions[key].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {pageSize === "auto" && (
                <p className="text-xs text-muted-foreground">
                  「画像サイズに合わせる」では余白は付きません。
                </p>
              )}
            </div>
          </div>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button onClick={convert} disabled={isWorking} className="gap-1.5">
            <FileDown className="size-4" />
            {isWorking ? "作成中…" : "PDFを作成する"}
          </Button>

          {resultBlob && (
            <ResultCard title="作成結果">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon className="size-4 shrink-0 text-primary" />
                  {items.length}枚の画像から{items.length}ページのPDFを作成しました（
                  {formatBytes(resultBlob.size)}）
                </p>
                <Button className="shrink-0" onClick={() => downloadBlob(resultBlob, "images.pdf")}>
                  ダウンロード
                </Button>
              </div>
            </ResultCard>
          )}
        </div>
      )}
    </div>
  );
}
