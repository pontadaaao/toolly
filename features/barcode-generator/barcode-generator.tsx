"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Copy, Download, Printer } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UnitInput } from "@/components/shared/unit-input";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { ResetButton } from "@/components/shared/reset-button";
import { ErrorMessage } from "@/components/shared/error-message";
import { barcodeFormats, getBarcodeFormatInfo, validateBarcodeValue, type BarcodeFormat } from "@/utils/barcode";
import { canvasToBlob, downloadBlob } from "@/utils/image";

const formatItems = Object.fromEntries(barcodeFormats.map((f) => [f.format, f.label]));

export function BarcodeGenerator() {
  const printAreaId = useId();
  const [format, setFormat] = useState<BarcodeFormat>("CODE128");
  const [value, setValue] = useState("ABC-12345");
  const [width, setWidth] = useState("2");
  const [height, setHeight] = useState("100");
  const [margin, setMargin] = useState("10");
  const [background, setBackground] = useState("#ffffff");
  const [lineColor, setLineColor] = useState("#000000");
  const [displayValue, setDisplayValue] = useState(true);
  const [fontSize, setFontSize] = useState("20");
  const [renderError, setRenderError] = useState<string | undefined>();

  const svgRef = useRef<SVGSVGElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const validationError = useMemo(() => validateBarcodeValue(format, value), [format, value]);
  const formatInfo = getBarcodeFormatInfo(format);

  useEffect(() => {
    if (validationError || !svgRef.current) return;
    let cancelled = false;
    import("jsbarcode").then(({ default: JsBarcode }) => {
      if (cancelled || !svgRef.current) return;
      try {
        JsBarcode(svgRef.current, value, {
          format,
          width: Number(width) || 2,
          height: Number(height) || 100,
          margin: Number(margin) || 0,
          background,
          lineColor,
          displayValue,
          fontSize: Number(fontSize) || 20,
          valid: (isValid) => setRenderError(isValid ? undefined : "この形式では入力値を正しく変換できませんでした。"),
        });
      } catch {
        setRenderError("バーコードの生成に失敗しました。入力内容を確認してください。");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [format, value, width, height, margin, background, lineColor, displayValue, fontSize, validationError]);

  function handleReset() {
    setFormat("CODE128");
    setValue("ABC-12345");
    setWidth("2");
    setHeight("100");
    setMargin("10");
    setBackground("#ffffff");
    setLineColor("#000000");
    setDisplayValue(true);
    setFontSize("20");
  }

  async function svgToCanvas(): Promise<HTMLCanvasElement | null> {
    const svg = svgRef.current;
    if (!svg) return null;
    const svgText = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("画像の生成に失敗しました"));
        el.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = svg.width.baseVal.value || img.width;
      canvas.height = svg.height.baseVal.value || img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      return canvas;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function downloadPng() {
    const canvas = await svgToCanvas();
    if (!canvas) return;
    const blob = await canvasToBlob(canvas, "image/png");
    downloadBlob(blob, `barcode-${format}.png`);
  }

  function downloadSvg() {
    if (!svgRef.current) return;
    const svgText = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    downloadBlob(blob, `barcode-${format}.svg`);
  }

  async function copyImage() {
    try {
      const canvas = await svgToCanvas();
      if (!canvas) return;
      const blob = await canvasToBlob(canvas, "image/png");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      toast.success("バーコード画像をコピーしました");
    } catch {
      toast.error("この端末・ブラウザでは画像コピーに対応していません");
    }
  }

  async function copyValue() {
    await navigator.clipboard.writeText(value);
    toast.success("バーコード番号をコピーしました");
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          body > * { visibility: hidden; }
          #${printAreaId}, #${printAreaId} * { visibility: visible; }
          #${printAreaId} { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; }
        }
      `}</style>

      <p className="rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
        本ツールで作成したバーコードは表示・印刷用の簡易生成であり、市販商品の正式な商品コード（JANコード等）登録を行うものではありません。
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="barcode-format">バーコード形式</Label>
          <Select items={formatItems} value={format} onValueChange={(v) => v && setFormat(v as BarcodeFormat)}>
            <SelectTrigger id="barcode-format" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {barcodeFormats.map((f) => (
                <SelectItem key={f.format} value={f.format}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="barcode-value">バーコード化する文字・数字</Label>
          <Input
            id="barcode-value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={formatInfo.placeholder}
            aria-invalid={Boolean(validationError)}
            aria-describedby="barcode-value-rule"
          />
          <p id="barcode-value-rule" className="text-xs text-muted-foreground">
            {formatInfo.rule}
          </p>
        </div>
      </div>

      {(validationError || renderError) && <ErrorMessage>{validationError ?? renderError}</ErrorMessage>}

      <div className="grid gap-5 sm:grid-cols-4">
        <UnitInput id="barcode-width" label="線の太さ" unit="px" value={width} onChange={setWidth} min={1} max={10} step={1} />
        <UnitInput id="barcode-height" label="高さ" unit="px" value={height} onChange={setHeight} min={20} max={400} step={1} />
        <UnitInput id="barcode-margin" label="余白" unit="px" value={margin} onChange={setMargin} min={0} max={100} step={1} />
        <UnitInput
          id="barcode-fontsize"
          label="文字サイズ"
          unit="px"
          value={fontSize}
          onChange={setFontSize}
          min={8}
          max={48}
          step={1}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="barcode-bg">背景色</Label>
          <Input id="barcode-bg" type="color" value={background} onChange={(e) => setBackground(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="barcode-line">線の色</Label>
          <Input id="barcode-line" type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={displayValue}
              onChange={(e) => setDisplayValue(e.target.checked)}
              className="size-4 rounded border-input"
            />
            文字を表示する
          </label>
        </div>
      </div>

      <div ref={resultRef} className="space-y-4">
        <div
          id={printAreaId}
          className="flex min-h-32 items-center justify-center overflow-x-auto rounded-2xl border border-border bg-card p-6"
        >
          <svg ref={svgRef} role="img" aria-label={`${formatInfo.label}形式のバーコード`} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={downloadPng} className="gap-1.5">
            <Download className="size-3.5" />
            PNG保存
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={downloadSvg} className="gap-1.5">
            <Download className="size-3.5" />
            SVG保存
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="size-3.5" />
            印刷
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={copyImage} className="gap-1.5">
            <Copy className="size-3.5" />
            画像をコピー
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={copyValue} className="gap-1.5">
            <Copy className="size-3.5" />
            番号をコピー
          </Button>
          <ResetButton onReset={handleReset} />
        </div>
      </div>

      <ResultShareActions
        shareText={`【バーコード作成】${formatInfo.label}: ${value}`}
        title="バーコード作成"
        resultRef={resultRef}
      />
    </div>
  );
}
