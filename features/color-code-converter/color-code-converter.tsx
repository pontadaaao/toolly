"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResultShareActions } from "@/components/shared/result-share-actions";
import { ResetButton } from "@/components/shared/reset-button";
import { ErrorMessage } from "@/components/shared/error-message";
import {
  formatCmyk,
  formatHsl,
  formatHsla,
  formatRgb,
  formatRgba,
  generateLightnessRamp,
  getReadableTextColor,
  hexToRgb,
  isValidHex,
  normalizeHex,
  rgbToCmyk,
  rgbToHsl,
} from "@/utils/color";
import { cn } from "@/lib/utils";

const DEFAULT_HEX = "#4f8ef7";

interface CodeRowProps {
  label: string;
  value: string;
}

function CodeRow({ label, value }: CodeRowProps) {
  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    toast.success(`${label}をコピーしました`);
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-2.5">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate font-mono text-sm">{value}</p>
      </div>
      <Button type="button" size="icon-sm" variant="ghost" onClick={handleCopy} aria-label={`${label}をコピー`}>
        <Copy className="size-3.5" />
      </Button>
    </div>
  );
}

export function ColorCodeConverter() {
  const [hexInput, setHexInput] = useState(DEFAULT_HEX);
  const [committedHex, setCommittedHex] = useState(DEFAULT_HEX);
  const resultRef = useRef<HTMLDivElement>(null);

  const error = isValidHex(hexInput) ? undefined : "正しいカラーコードを入力してください（例：#4F8EF7）。";

  function handleHexInputChange(value: string) {
    setHexInput(value);
    if (isValidHex(value)) setCommittedHex(normalizeHex(value));
  }

  function handlePickerChange(value: string) {
    setHexInput(value);
    setCommittedHex(value);
  }

  async function handleCopyHexInput() {
    if (!isValidHex(hexInput)) return;
    await navigator.clipboard.writeText(normalizeHex(hexInput).toUpperCase());
    toast.success("カラーコード（HEX）をコピーしました");
  }

  function handleReset() {
    setHexInput(DEFAULT_HEX);
    setCommittedHex(DEFAULT_HEX);
  }

  function selectRampColor(hex: string) {
    setHexInput(hex);
    setCommittedHex(hex);
  }

  const { rgb, hsl, cmyk, textColor, ramp } = useMemo(() => {
    const rgbValue = hexToRgb(committedHex)!;
    return {
      rgb: rgbValue,
      hsl: rgbToHsl(rgbValue),
      cmyk: rgbToCmyk(rgbValue),
      textColor: getReadableTextColor(rgbValue),
      ramp: generateLightnessRamp(committedHex, 10),
    };
  }, [committedHex]);

  const shareText = `【カラーコード変換】\nHEX: ${committedHex}\nRGB: ${formatRgb(rgb)}\nHSL: ${formatHsl(hsl)}`;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="color-picker">色を選ぶ</Label>
          <input
            id="color-picker"
            type="color"
            value={isValidHex(hexInput) ? normalizeHex(hexInput) : committedHex}
            onChange={(e) => handlePickerChange(e.target.value)}
            className="h-8 w-16 cursor-pointer rounded-lg bg-transparent"
            aria-label="カラーピッカー"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color-hex">カラーコード（HEX）</Label>
          <div className="relative">
            <Input
              id="color-hex"
              value={hexInput}
              onChange={(e) => handleHexInputChange(e.target.value)}
              placeholder="#4F8EF7"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "color-hex-error" : undefined}
              className="pr-9 font-mono"
            />
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={handleCopyHexInput}
              disabled={Boolean(error)}
              aria-label="カラーコード（HEX）をコピー"
              className="absolute inset-y-0 right-1 my-auto"
            >
              <Copy className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
      {error && <ErrorMessage id="color-hex-error">{error}</ErrorMessage>}

      <div ref={resultRef} className="space-y-6">
        <div
          className="flex h-28 items-center justify-center rounded-2xl border border-border font-mono text-lg font-semibold shadow-soft"
          style={{ backgroundColor: committedHex, color: textColor }}
        >
          {committedHex.toUpperCase()}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <CodeRow label="HEX" value={committedHex.toUpperCase()} />
          <CodeRow label="RGB" value={formatRgb(rgb)} />
          <CodeRow label="RGBA" value={formatRgba(rgb)} />
          <CodeRow label="HSL" value={formatHsl(hsl)} />
          <CodeRow label="HSLA" value={formatHsla(hsl)} />
          <CodeRow label="CMYK" value={formatCmyk(cmyk)} />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">色合いチャート（濃淡）</h3>
          <div role="group" aria-label="濃淡チャート" className="mt-3 flex overflow-hidden rounded-xl border border-border">
            {ramp.map((swatch) => (
              <button
                key={swatch}
                type="button"
                onClick={() => selectRampColor(swatch)}
                aria-label={`${swatch} を選択`}
                title={swatch}
                className={cn(
                  "h-12 flex-1 transition-transform hover:z-10 hover:scale-110 focus-visible:z-10 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  swatch === committedHex && "ring-2 ring-inset ring-primary"
                )}
                style={{ backgroundColor: swatch }}
              />
            ))}
          </div>
        </div>

        <ResultShareActions shareText={shareText} title="カラーコード変換" resultRef={resultRef} />
      </div>

      <ResetButton onReset={handleReset} />
    </div>
  );
}
