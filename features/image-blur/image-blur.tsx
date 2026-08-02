"use client";

import { useRef, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { PrivacyNotice } from "@/components/shared/privacy-notice";
import { ResetButton } from "@/components/shared/reset-button";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { CanvasEditor } from "@/components/shared/canvas-editor";
import { downloadBlob, formatBytes } from "@/utils/image";

type OutputFormat = "png" | "jpeg";
const formatLabels: Record<OutputFormat, string> = { png: "PNG", jpeg: "JPG" };

export function ImageBlur() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutputFormat>("png");
  const [quality, setQuality] = useState(0.85);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleFiles(files: File[]) {
    const selected = files[0];
    if (!selected) return;
    setFile(selected);
    setResultBlob(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
  }

  function handleReset() {
    setFile(null);
    setResultBlob(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setFormat("png");
    setQuality(0.85);
  }

  function handleExport(blob: Blob) {
    setResultBlob(blob);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(URL.createObjectURL(blob));
  }

  function handleDownload() {
    if (resultBlob) downloadBlob(resultBlob, `blur.${format === "png" ? "png" : "jpg"}`);
  }

  return (
    <div className="space-y-6">
      <PrivacyNotice>アップロードした画像は端末内でのみ加工され、サーバーに送信されることはありません。</PrivacyNotice>

      {!file ? (
        <FileDropzone
          multiple={false}
          accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
          onFiles={handleFiles}
          label="ぼかしをかけたい画像をドラッグ&ドロップ、またはクリックしてアップロード"
          hint="JPG・PNG・WebPに対応。"
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="blur-format">保存形式</Label>
              <Select items={formatLabels} value={format} onValueChange={(v) => v && setFormat(v as OutputFormat)}>
                <SelectTrigger id="blur-format" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {format === "jpeg" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>JPG品質</Label>
                  <span className="text-sm text-muted-foreground">{Math.round(quality * 100)}</span>
                </div>
                <Slider value={[quality]} min={0.01} max={1} step={0.01} onValueChange={(v) => setQuality(Array.isArray(v) ? v[0] : v)} />
              </div>
            )}
          </div>

          <CanvasEditor effect="blur" file={file} outputFormat={format} jpgQuality={quality} onExport={handleExport} />

          {resultBlob && resultUrl && (
            <div ref={resultRef} className="space-y-4">
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="ぼかし加工後の画像" className="max-h-96 max-w-full rounded-lg" />
                <p className="text-sm text-muted-foreground">ファイルサイズ: {formatBytes(resultBlob.size)}</p>
                <Button type="button" onClick={handleDownload} className="gap-1.5">
                  <Download className="size-4" />
                  画像を保存
                </Button>
              </div>
              <ResultShareActions shareText="【画像ぼかし加工】写真にぼかしをかけました" title="画像ぼかし加工" resultRef={resultRef} />
            </div>
          )}

          <ResetButton onReset={handleReset} label="別の画像を選び直す" />
        </div>
      )}
    </div>
  );
}
