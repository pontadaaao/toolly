"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Circle, Maximize2, Paintbrush, Redo2, Square, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { LoadingIndicator } from "@/components/shared/loading-indicator";
import { applyBlur, applyMosaic, type SelectionShape } from "@/utils/canvas-effects";
import { canvasToBlob, loadImageFromFile } from "@/utils/image";
import { cn } from "@/lib/utils";

const MAX_EDIT_DIMENSION = 1600;
const MAX_HISTORY = 20;

type SelectionMode = "whole" | "rect" | "circle" | "brush";

const selectionModeLabels: Record<SelectionMode, string> = {
  whole: "画像全体",
  rect: "四角形選択",
  circle: "円形選択",
  brush: "ブラシ",
};

interface Point {
  x: number;
  y: number;
}

interface CanvasEditorProps {
  effect: "mosaic" | "blur";
  file: File;
  outputFormat: "png" | "jpeg";
  jpgQuality: number;
  onExport: (blob: Blob) => void;
}

/**
 * Shared interactive Canvas editor for the mosaic and blur tools. Owns the
 * working canvas, selection tools (whole/rect/circle/brush), undo/redo
 * history, before/after compare, and PNG/JPG export. `effect` swaps which
 * pixel operation (`applyMosaic`/`applyBlur`, both in utils/canvas-effects.ts)
 * gets applied — everything else is shared.
 */
export function CanvasEditor({ effect, file, outputFormat, jpgQuality, onExport }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<ImageData[]>([]);
  const redoRef = useRef<ImageData[]>([]);
  const originalImageDataRef = useRef<ImageData | null>(null);
  const compareBackupRef = useRef<ImageData | null>(null);
  const paintingRef = useRef(false);
  const dragStartRef = useRef<Point | null>(null);

  const [ready, setReady] = useState(false);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number } | null>(null);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("brush");
  const [strength, setStrength] = useState(effect === "mosaic" ? 14 : 12);
  const [brushSize, setBrushSize] = useState(40);
  const [zoom, setZoom] = useState(100);
  // Bumped whenever the undo/redo stacks change, purely to force a re-render
  // so `canUndo`/`canRedo` (read from the refs below) reflect the latest state.
  const [, forceHistoryRerender] = useState(0);
  const [previewBox, setPreviewBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    loadImageFromFile(file).then((img) => {
      if (cancelled || !canvasRef.current) return;
      const scale = Math.min(1, MAX_EDIT_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = canvasRef.current;
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      originalImageDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      historyRef.current = [];
      redoRef.current = [];
      forceHistoryRerender((v) => v + 1);
      setCanvasSize({ width: canvas.width, height: canvas.height });
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [file]);

  function getCtx(): CanvasRenderingContext2D | null {
    return canvasRef.current?.getContext("2d") ?? null;
  }

  function pushHistory() {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift();
    redoRef.current = [];
    forceHistoryRerender((v) => v + 1);
  }

  function undo() {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas || historyRef.current.length === 0) return;
    redoRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    const prev = historyRef.current.pop() as ImageData;
    ctx.putImageData(prev, 0, 0);
    forceHistoryRerender((v) => v + 1);
  }

  function redo() {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas || redoRef.current.length === 0) return;
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    const next = redoRef.current.pop() as ImageData;
    ctx.putImageData(next, 0, 0);
    forceHistoryRerender((v) => v + 1);
  }

  function resetAll() {
    const ctx = getCtx();
    if (!ctx || !originalImageDataRef.current) return;
    pushHistory();
    ctx.putImageData(originalImageDataRef.current, 0, 0);
  }

  function applyEffectToShape(shape: SelectionShape) {
    const ctx = getCtx();
    if (!ctx) return;
    if (effect === "mosaic") applyMosaic(ctx, shape, strength);
    else applyBlur(ctx, shape, strength);
  }

  function applyToWholeImage() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    pushHistory();
    applyEffectToShape({ kind: "rect", x: 0, y: 0, width: canvas.width, height: canvas.height });
  }

  function getCanvasPoint(e: ReactPointerEvent<HTMLCanvasElement>): Point {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (!ready) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const point = getCanvasPoint(e);
    if (selectionMode === "brush") {
      pushHistory();
      paintingRef.current = true;
      applyEffectToShape({ kind: "circle", cx: point.x, cy: point.y, r: brushSize / 2 });
    } else if (selectionMode === "rect" || selectionMode === "circle") {
      dragStartRef.current = point;
      setPreviewBox({ x: point.x, y: point.y, width: 0, height: 0 });
    }
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (!ready) return;
    const point = getCanvasPoint(e);
    if (selectionMode === "brush" && paintingRef.current) {
      applyEffectToShape({ kind: "circle", cx: point.x, cy: point.y, r: brushSize / 2 });
      return;
    }
    const start = dragStartRef.current;
    if (!start) return;
    if (selectionMode === "rect") {
      setPreviewBox({
        x: Math.min(start.x, point.x),
        y: Math.min(start.y, point.y),
        width: Math.abs(point.x - start.x),
        height: Math.abs(point.y - start.y),
      });
    } else if (selectionMode === "circle") {
      const r = Math.hypot(point.x - start.x, point.y - start.y);
      setPreviewBox({ x: start.x - r, y: start.y - r, width: r * 2, height: r * 2 });
    }
  }

  function handlePointerUp() {
    if (selectionMode === "brush") {
      paintingRef.current = false;
      return;
    }
    const start = dragStartRef.current;
    if (start && previewBox && (previewBox.width > 1 || previewBox.height > 1)) {
      pushHistory();
      if (selectionMode === "rect") {
        applyEffectToShape({ kind: "rect", x: previewBox.x, y: previewBox.y, width: previewBox.width, height: previewBox.height });
      } else {
        applyEffectToShape({
          kind: "circle",
          cx: previewBox.x + previewBox.width / 2,
          cy: previewBox.y + previewBox.height / 2,
          r: previewBox.width / 2,
        });
      }
    }
    dragStartRef.current = null;
    setPreviewBox(null);
  }

  function startCompare() {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas || !originalImageDataRef.current) return;
    compareBackupRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(originalImageDataRef.current, 0, 0);
  }

  function endCompare() {
    const ctx = getCtx();
    if (!ctx || !compareBackupRef.current) return;
    ctx.putImageData(compareBackupRef.current, 0, 0);
    compareBackupRef.current = null;
  }

  async function handleExport() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const output = document.createElement("canvas");
    output.width = canvas.width;
    output.height = canvas.height;
    const octx = output.getContext("2d");
    if (!octx) return;
    if (outputFormat === "jpeg") {
      octx.fillStyle = "#ffffff";
      octx.fillRect(0, 0, output.width, output.height);
    }
    octx.drawImage(canvas, 0, 0);
    const blob = await canvasToBlob(output, outputFormat === "png" ? "image/png" : "image/jpeg", outputFormat === "jpeg" ? jpgQuality : undefined);
    onExport(blob);
  }

  const canUndo = historyRef.current.length > 0;
  const canRedo = redoRef.current.length > 0;
  const baseDisplayWidth = canvasSize ? Math.min(canvasSize.width, 560) : 0;
  const displayWidth = baseDisplayWidth * (zoom / 100);
  const strengthLabel = effect === "mosaic" ? "モザイクの強さ" : "ぼかしの強さ";
  const modes: SelectionMode[] = ["whole", "rect", "circle", "brush"];
  const modeIcons: Record<SelectionMode, typeof Square> = { whole: Maximize2, rect: Square, circle: Circle, brush: Paintbrush };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="選択ツール">
        {modes.map((m) => {
          const Icon = modeIcons[m];
          return (
            <Button
              key={m}
              type="button"
              size="sm"
              variant={selectionMode === m ? "default" : "outline"}
              onClick={() => setSelectionMode(m)}
              className="gap-1.5"
            >
              <Icon className="size-3.5" />
              {selectionModeLabels[m]}
            </Button>
          );
        })}
        {selectionMode === "whole" && (
          <Button type="button" size="sm" onClick={applyToWholeImage} disabled={!ready}>
            画像全体に適用
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{strengthLabel}</Label>
            <span className="text-sm text-muted-foreground">{strength}</span>
          </div>
          <Slider value={[strength]} min={2} max={40} step={1} onValueChange={(v) => setStrength(Array.isArray(v) ? v[0] : v)} />
        </div>
        {selectionMode === "brush" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>ブラシサイズ</Label>
              <span className="text-sm text-muted-foreground">{brushSize}px</span>
            </div>
            <Slider value={[brushSize]} min={10} max={150} step={2} onValueChange={(v) => setBrushSize(Array.isArray(v) ? v[0] : v)} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" variant="outline" onClick={undo} disabled={!canUndo} className="gap-1.5">
          <Undo2 className="size-3.5" />
          元に戻す
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={redo} disabled={!canRedo} className="gap-1.5">
          <Redo2 className="size-3.5" />
          やり直す
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={resetAll} disabled={!ready}>
          全体リセット
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onPointerDown={startCompare}
          onPointerUp={endCompare}
          onPointerLeave={endCompare}
          disabled={!ready}
        >
          押している間だけ加工前を表示
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <Label htmlFor="canvas-zoom" className="text-xs text-muted-foreground">
            拡大・縮小
          </Label>
          <input
            id="canvas-zoom"
            type="range"
            min={50}
            max={200}
            step={10}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-24"
          />
          <span className="w-10 text-xs text-muted-foreground">{zoom}%</span>
        </div>
      </div>

      <div className="flex justify-center overflow-auto rounded-2xl border border-border bg-checkerboard p-4">
        {!ready && <LoadingIndicator label="画像を読み込んでいます…" />}
        <div className="relative inline-block" style={{ display: ready ? "inline-block" : "none" }}>
          <canvas
            ref={canvasRef}
            style={{ width: displayWidth, height: "auto", touchAction: "none" }}
            className="block max-w-none rounded-lg"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            role="img"
            aria-label="編集中の画像"
          />
          {previewBox && canvasRef.current && (
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute border-2 border-primary bg-primary/10",
                selectionMode === "circle" && "rounded-full"
              )}
              style={{
                left: `${(previewBox.x / canvasRef.current.width) * 100}%`,
                top: `${(previewBox.y / canvasRef.current.height) * 100}%`,
                width: `${(previewBox.width / canvasRef.current.width) * 100}%`,
                height: `${(previewBox.height / canvasRef.current.height) * 100}%`,
              }}
            />
          )}
        </div>
      </div>

      <Button type="button" onClick={handleExport} disabled={!ready}>
        この内容で保存する
      </Button>
    </div>
  );
}
