"use client";

import { PDFDocument } from "pdf-lib";
import { Combine, FileText, GripVertical, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { EmptyState } from "@/components/shared/empty-state";
import { ResultCard } from "@/components/shared/result-card";
import { downloadBlob, formatBytes } from "@/utils/image";
import { cn } from "@/lib/utils";

interface PdfItem {
  id: string;
  file: File;
}

export function PdfMerger() {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  function handleFiles(files: File[]) {
    const pdfFiles = files.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    setItems((prev) => [
      ...prev,
      ...pdfFiles.map((file) => ({ id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`, file })),
    ]);
    setResultBlob(null);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
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
  }

  async function mergePdfs() {
    if (items.length < 2) return;
    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const item of items) {
        const bytes = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }
      const mergedBytes = await mergedPdf.save();
      setResultBlob(new Blob([mergedBytes as BlobPart], { type: "application/pdf" }));
    } finally {
      setIsMerging(false);
    }
  }

  return (
    <div className="space-y-6">
      <FileDropzone
        accept={{ "application/pdf": [".pdf"] }}
        onFiles={handleFiles}
        label="PDFファイルをドラッグ&ドロップ、またはクリックしてアップロード"
        hint="複数のPDFをまとめて追加できます。"
      />

      {items.length === 0 ? (
        <EmptyState title="まだPDFがアップロードされていません" description="上のエリアにPDFを追加すると、ここに一覧が表示されます。" />
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">ドラッグして順番を並び替えられます。</p>
          <ul className="space-y-2">
            {items.map((item) => (
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
                <FileText className="size-5 shrink-0 text-primary" />
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

          <Button onClick={mergePdfs} disabled={items.length < 2 || isMerging} className="gap-1.5">
            <Combine className="size-4" />
            {isMerging ? "結合中…" : "結合する"}
          </Button>
          {items.length < 2 && <p className="text-xs text-muted-foreground">結合には2つ以上のPDFが必要です。</p>}
        </div>
      )}

      {resultBlob && (
        <ResultCard title="結合結果">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {items.length}個のPDFを結合しました（{formatBytes(resultBlob.size)}）
            </p>
            <Button onClick={() => downloadBlob(resultBlob, "merged.pdf")}>ダウンロード</Button>
          </div>
        </ResultCard>
      )}
    </div>
  );
}
