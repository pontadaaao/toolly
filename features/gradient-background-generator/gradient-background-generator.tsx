"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, Download, Plus, Shuffle, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnitInput } from "@/components/shared/unit-input";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { ResetButton } from "@/components/shared/reset-button";
import { ErrorMessage } from "@/components/shared/error-message";
import { isValidHex, normalizeHex } from "@/utils/color";
import {
  buildCssBackgroundDeclaration,
  buildCssGradientValue,
  buildStopsFromColors,
  createStopId,
  drawGradientOnCanvas,
  gradientPresets,
  gradientTypeLabels,
  randomHexColor,
  type ColorStop,
  type GradientType,
} from "@/utils/gradient";
import { canvasToBlob, downloadBlob } from "@/utils/image";

const colorSwatchClass =
  "block h-8 w-10 shrink-0 cursor-pointer rounded-lg bg-transparent align-bottom [&::-moz-color-swatch]:rounded-lg [&::-moz-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch-wrapper]:rounded-lg [&::-webkit-color-swatch-wrapper]:border-none [&::-webkit-color-swatch-wrapper]:p-0";

interface StopEditorProps {
  stop: ColorStop;
  onChange: (patch: Partial<ColorStop>) => void;
  onRemove: () => void;
  removeDisabled: boolean;
}

function StopEditor({ stop, onChange, onRemove, removeDisabled }: StopEditorProps) {
  const [hexInput, setHexInput] = useState(stop.color);

  // Keep the text field in sync when the color changes from elsewhere (picker, preset, randomize).
  useEffect(() => {
    setHexInput(stop.color);
  }, [stop.color]);

  function handleHexInputChange(value: string) {
    setHexInput(value);
    if (isValidHex(value)) onChange({ color: normalizeHex(value) });
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-2.5">
      <input
        type="color"
        value={stop.color}
        onChange={(e) => onChange({ color: e.target.value })}
        className={colorSwatchClass}
        aria-label="色を選択"
      />
      <Input
        value={hexInput}
        onChange={(e) => handleHexInputChange(e.target.value)}
        placeholder="#000000"
        aria-invalid={!isValidHex(hexInput)}
        aria-label="カラーコード（HEX）"
        className="w-24 shrink-0 font-mono text-xs"
      />
      <div className="flex min-w-32 flex-1 items-center gap-2">
        <input
          type="range"
          min={0}
          max={100}
          value={stop.position}
          onChange={(e) => onChange({ position: Number(e.target.value) })}
          className="w-full cursor-pointer"
          aria-label="色の位置（%）"
        />
        <span className="w-12 shrink-0 text-right text-sm text-muted-foreground">{stop.position}%</span>
      </div>
      <Button type="button" size="icon-sm" variant="ghost" onClick={onRemove} disabled={removeDisabled} aria-label="この色を削除">
        <X className="size-3.5" />
      </Button>
    </div>
  );
}

const sizePresets = [
  { id: "instagram-post", label: "Instagram投稿（1080×1080）", width: 1080, height: 1080 },
  { id: "instagram-story", label: "Instagramストーリー（1080×1920）", width: 1080, height: 1920 },
  { id: "youtube-thumbnail", label: "YouTubeサムネイル（1280×720）", width: 1280, height: 720 },
  { id: "x-header", label: "Xヘッダー（1500×500）", width: 1500, height: 500 },
  { id: "wallpaper", label: "デスクトップ壁紙（1920×1080）", width: 1920, height: 1080 },
  { id: "custom", label: "カスタム", width: 0, height: 0 },
] as const;

const initialStops: ColorStop[] = buildStopsFromColors(["#4F8EF7", "#59C3C3"]);

export function GradientBackgroundGenerator() {
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>(initialStops);
  const [sizePreset, setSizePreset] = useState<(typeof sizePresets)[number]["id"]>("instagram-post");
  const [width, setWidth] = useState("1080");
  const [height, setHeight] = useState("1080");
  const resultRef = useRef<HTMLDivElement>(null);

  const widthNum = Number(width);
  const heightNum = Number(height);
  const error =
    stops.length < 2
      ? "色は2つ以上指定してください。"
      : !widthNum || widthNum <= 0 || !heightNum || heightNum <= 0
        ? "出力サイズは0より大きい値を入力してください。"
        : widthNum > 4000 || heightNum > 4000
          ? "出力サイズは4000pxまでです。"
          : undefined;

  const config = useMemo(() => ({ type, angle, stops }), [type, angle, stops]);
  const cssValue = useMemo(() => buildCssGradientValue(config), [config]);
  const cssDeclaration = useMemo(() => buildCssBackgroundDeclaration(config), [config]);

  function updateStop(id: string, patch: Partial<ColorStop>) {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function addStop() {
    if (stops.length >= 6) return;
    const lastPosition = stops.length > 0 ? stops[stops.length - 1].position : 0;
    setStops((prev) => [...prev, { id: createStopId(), color: randomHexColor(), position: Math.min(lastPosition + 20, 100) }]);
  }

  function removeStop(id: string) {
    if (stops.length <= 2) return;
    setStops((prev) => prev.filter((s) => s.id !== id));
  }

  function applyPreset(preset: (typeof gradientPresets)[number]) {
    setType(preset.config.type);
    setAngle(preset.config.angle);
    setStops(buildStopsFromColors(preset.config.colors));
  }

  function handleRandomize() {
    const count = 2 + Math.floor(Math.random() * 2);
    const colors = Array.from({ length: count }, () => randomHexColor());
    setStops(buildStopsFromColors(colors));
    setType((["linear", "radial", "conic"] as const)[Math.floor(Math.random() * 3)]);
    setAngle(Math.floor(Math.random() * 360));
  }

  function handleSizePresetChange(id: string) {
    const preset = sizePresets.find((p) => p.id === id);
    if (!preset) return;
    setSizePreset(preset.id);
    if (preset.id !== "custom") {
      setWidth(String(preset.width));
      setHeight(String(preset.height));
    }
  }

  function handleReset() {
    setType("linear");
    setAngle(135);
    setStops(initialStops);
    setSizePreset("instagram-post");
    setWidth("1080");
    setHeight("1080");
  }

  async function handleCopyCss() {
    await navigator.clipboard.writeText(cssDeclaration);
    toast.success("CSSコードをコピーしました");
  }

  function handleDownload() {
    if (error) return;
    const canvas = document.createElement("canvas");
    canvas.width = widthNum;
    canvas.height = heightNum;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawGradientOnCanvas(ctx, widthNum, heightNum, config);
    canvasToBlob(canvas, "image/png").then((blob) => downloadBlob(blob, "gradient-background.png"));
  }

  const shareText = `【グラデーション背景メーカー】\n${cssDeclaration}`;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground">プリセット</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {gradientPresets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              title={preset.name}
              className="h-10 w-16 shrink-0 rounded-xl border border-border transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              style={{
                backgroundImage: buildCssGradientValue({
                  type: preset.config.type,
                  angle: preset.config.angle,
                  stops: buildStopsFromColors(preset.config.colors),
                }),
              }}
              aria-label={`${preset.name}のプリセットを適用`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>グラデーションの種類</Label>
        <Tabs value={type} onValueChange={(v) => v && setType(v as GradientType)}>
          <TabsList className="grid !h-auto w-full grid-cols-1 gap-1 sm:!h-8 sm:grid-cols-3">
            <TabsTrigger value="linear">{gradientTypeLabels.linear}</TabsTrigger>
            <TabsTrigger value="radial">{gradientTypeLabels.radial}</TabsTrigger>
            <TabsTrigger value="conic">{gradientTypeLabels.conic}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {type !== "radial" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="gradient-angle">{type === "linear" ? "角度" : "開始角度"}</Label>
            <span className="text-sm text-muted-foreground">{angle}°</span>
          </div>
          <input
            id="gradient-angle"
            type="range"
            min={0}
            max={360}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>色の位置</Label>
          <Button type="button" size="sm" variant="outline" onClick={addStop} disabled={stops.length >= 6} className="gap-1.5">
            <Plus className="size-3.5" />
            色を追加
          </Button>
        </div>
        <div className="space-y-2">
          {stops.map((stop) => (
            <StopEditor
              key={stop.id}
              stop={stop}
              onChange={(patch) => updateStop(stop.id, patch)}
              onRemove={() => removeStop(stop.id)}
              removeDisabled={stops.length <= 2}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-1">
          <Label htmlFor="size-preset">出力サイズ</Label>
          <Select
            items={Object.fromEntries(sizePresets.map((p) => [p.id, p.label]))}
            value={sizePreset}
            onValueChange={(v) => v && handleSizePresetChange(v)}
          >
            <SelectTrigger id="size-preset" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizePresets.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <UnitInput id="gradient-width" label="幅" unit="px" value={width} onChange={setWidth} min={1} max={4000} />
        <UnitInput id="gradient-height" label="高さ" unit="px" value={height} onChange={setHeight} min={1} max={4000} />
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div ref={resultRef} className="space-y-4">
        <div
          className="aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-soft"
          style={{ backgroundImage: cssValue }}
          role="img"
          aria-label="グラデーションのプレビュー"
        />

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-2.5">
          <p className="min-w-0 flex-1 truncate font-mono text-sm">{cssDeclaration}</p>
          <Button type="button" size="icon-sm" variant="ghost" onClick={handleCopyCss} aria-label="CSSコードをコピー">
            <Copy className="size-3.5" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleDownload} disabled={Boolean(error)} className="gap-1.5">
            <Download className="size-4" />
            PNGでダウンロード
          </Button>
          <Button type="button" variant="outline" onClick={handleRandomize} className="gap-1.5">
            <Shuffle className="size-4" />
            ランダム生成
          </Button>
        </div>

        <ResultShareActions shareText={shareText} title="グラデーション背景メーカー" resultRef={resultRef} />
      </div>

      <ResetButton onReset={handleReset} />
    </div>
  );
}
