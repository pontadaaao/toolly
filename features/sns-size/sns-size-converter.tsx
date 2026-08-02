"use client";

import { Download } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { ResultCard } from "@/components/shared/result-card";
import { snsPresets } from "@/data/sns-presets";
import { canvasToBlob, downloadBlob, loadImageFromFile, stripExtension } from "@/utils/image";

const presetItems = Object.fromEntries(
  snsPresets.map((p) => [p.id, `${p.platform} — ${p.label}（${p.width}×${p.height}）`])
);

const PREVIEW_MAX_WIDTH = 360;
const PREVIEW_MAX_HEIGHT = 480;

interface Offset {
  x: number;
  y: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getBoxSize(width: number, height: number) {
  const aspect = width / height;
  if (PREVIEW_MAX_WIDTH / aspect <= PREVIEW_MAX_HEIGHT) {
    return { width: PREVIEW_MAX_WIDTH, height: PREVIEW_MAX_WIDTH / aspect };
  }
  return { width: PREVIEW_MAX_HEIGHT * aspect, height: PREVIEW_MAX_HEIGHT };
}

export function SnsSizeConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [presetId, setPresetId] = useState(snsPresets[0].id);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });

  const imgRef = useRef<HTMLImageElement>(null);
  const dragState = useRef<{ pointerId: number; start: { x: number; y: number }; startOffset: Offset } | null>(null);

  const preset = snsPresets.find((p) => p.id === presetId) ?? snsPresets[0];
  const box = useMemo(() => getBoxSize(preset.width, preset.height), [preset.width, preset.height]);

  const baseScale = naturalSize
    ? Math.max(box.width / naturalSize.width, box.height / naturalSize.height)
    : 0;
  const drawWidth = naturalSize ? naturalSize.width * baseScale * zoom : 0;
  const drawHeight = naturalSize ? naturalSize.height * baseScale * zoom : 0;

  function clampOffset(next: Offset, w: number, h: number): Offset {
    return {
      x: clamp(next.x, Math.min(box.width - w, 0), 0),
      y: clamp(next.y, Math.min(box.height - h, 0), 0),
    };
  }

  function centerImage(w: number, h: number) {
    return { x: (box.width - w) / 2, y: (box.height - h) / 2 };
  }

  function handleFiles(files: File[]) {
    const selected = files[0];
    if (!selected) return;
    setFile(selected);
    setFileUrl(URL.createObjectURL(selected));
    setNaturalSize(null);
    setZoom(1);
  }

  function handleImageLoad() {
    const img = imgRef.current;
    if (!img) return;
    const size = { width: img.naturalWidth, height: img.naturalHeight };
    setNaturalSize(size);
    const scale = Math.max(box.width / size.width, box.height / size.height);
    setOffset(centerImage(size.width * scale, size.height * scale));
  }

  function handlePresetChange(id: string | null) {
    if (!id) return;
    setPresetId(id);
    if (!naturalSize) return;
    const nextPreset = snsPresets.find((p) => p.id === id) ?? snsPresets[0];
    const nextBox = getBoxSize(nextPreset.width, nextPreset.height);
    const scale = Math.max(nextBox.width / naturalSize.width, nextBox.height / naturalSize.height);
    const w = naturalSize.width * scale * zoom;
    const h = naturalSize.height * scale * zoom;
    setOffset({
      x: clamp((nextBox.width - w) / 2, Math.min(nextBox.width - w, 0), 0),
      y: clamp((nextBox.height - h) / 2, Math.min(nextBox.height - h, 0), 0),
    });
  }

  function handleZoomChange(value: number | readonly number[]) {
    const nextZoom = Array.isArray(value) ? value[0] : value;
    if (!naturalSize) {
      setZoom(nextZoom);
      return;
    }
    const cx = box.width / 2;
    const cy = box.height / 2;
    const fracX = drawWidth > 0 ? (cx - offset.x) / drawWidth : 0.5;
    const fracY = drawHeight > 0 ? (cy - offset.y) / drawHeight : 0.5;
    const nextW = naturalSize.width * baseScale * nextZoom;
    const nextH = naturalSize.height * baseScale * nextZoom;
    setZoom(nextZoom);
    setOffset(clampOffset({ x: cx - fracX * nextW, y: cy - fracY * nextH }, nextW, nextH));
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!naturalSize) return;
    dragState.current = { pointerId: e.pointerId, start: { x: e.clientX, y: e.clientY }, startOffset: offset };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Capture is a nice-to-have (keeps the drag going if the pointer leaves the frame);
      // dragging still works within the frame bounds without it.
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const delta = { x: e.clientX - drag.start.x, y: e.clientY - drag.start.y };
    setOffset(
      clampOffset({ x: drag.startOffset.x + delta.x, y: drag.startOffset.y + delta.y }, drawWidth, drawHeight)
    );
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (dragState.current?.pointerId === e.pointerId) dragState.current = null;
  }

  async function download() {
    if (!naturalSize || !file) return;
    // Draw from a freshly-loaded, off-DOM image rather than the live preview
    // <img> — that element is positioned far outside its clipped container
    // (left can be well beyond -1000px), and some browsers only rasterize
    // the visible portion of such an off-screen-positioned element, which
    // silently truncates canvas output drawn from it.
    const sourceImg = await loadImageFromFile(file);
    const canvas = document.createElement("canvas");
    canvas.width = preset.width;
    canvas.height = preset.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const outputScale = preset.width / box.width;
    ctx.drawImage(
      sourceImg,
      offset.x * outputScale,
      offset.y * outputScale,
      drawWidth * outputScale,
      drawHeight * outputScale
    );

    const blob = await canvasToBlob(canvas, "image/png");
    downloadBlob(blob, `${stripExtension(file.name)}-${preset.id}.png`);
  }

  return (
    <div className="space-y-6">
      <FileDropzone
        multiple={false}
        accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
        onFiles={handleFiles}
        label="画像をドラッグ&ドロップ、またはクリックしてアップロード"
      />

      <div className="space-y-2">
        <Label htmlFor="sns-preset">変換先のサイズ</Label>
        <Select items={presetItems} value={presetId} onValueChange={handlePresetChange}>
          <SelectTrigger id="sns-preset" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {snsPresets.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.platform} — {p.label}（{p.width}×{p.height}）
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {fileUrl && (
        <ResultCard title={`プレビュー（${preset.width}×${preset.height}）`}>
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-muted-foreground">画像をドラッグすると枠内の位置を調整できます</p>
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative touch-none overflow-hidden rounded-xl border border-border bg-muted/40 select-none"
              style={{ width: box.width, height: box.height, cursor: naturalSize ? "grab" : "default" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={fileUrl}
                alt="変換プレビュー"
                onLoad={handleImageLoad}
                draggable={false}
                className="absolute max-w-none"
                style={{
                  left: offset.x,
                  top: offset.y,
                  width: drawWidth || undefined,
                  height: drawHeight || undefined,
                  opacity: naturalSize ? 1 : 0,
                }}
              />
            </div>

            <div className="w-full max-w-xs space-y-2">
              <div className="flex items-center justify-between">
                <Label>拡大</Label>
                <span className="text-sm text-muted-foreground">{Math.round(zoom * 100)}%</span>
              </div>
              <Slider value={[zoom]} min={1} max={3} step={0.01} onValueChange={handleZoomChange} />
            </div>

            <Button onClick={download} disabled={!naturalSize} className="gap-1.5">
              <Download className="size-4" />
              ダウンロード
            </Button>
          </div>
        </ResultCard>
      )}
    </div>
  );
}
