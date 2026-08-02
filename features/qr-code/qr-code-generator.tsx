"use client";

import { Download } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultCard } from "@/components/shared/result-card";

type QrType = "url" | "text" | "tel" | "email";

const typeLabels: Record<QrType, string> = {
  url: "URL",
  text: "文字",
  tel: "電話番号",
  email: "メールアドレス",
};

const placeholders: Record<QrType, string> = {
  url: "https://example.com",
  text: "QRコードにしたい文章を入力",
  tel: "090-1234-5678",
  email: "example@toolly.jp",
};

function buildPayload(type: QrType, value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  switch (type) {
    case "tel":
      return `tel:${trimmed.replace(/[^0-9+]/g, "")}`;
    case "email":
      return `mailto:${trimmed}`;
    case "url":
      return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    default:
      return trimmed;
  }
}

export function QrCodeGenerator() {
  const [type, setType] = useState<QrType>("url");
  const [value, setValue] = useState("");
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);

  const payload = useMemo(() => buildPayload(type, value), [type, value]);

  useEffect(() => {
    if (!payload) {
      setPngDataUrl(null);
      setSvgMarkup(null);
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(payload, { width: 320, margin: 1 }).then((url) => {
      if (!cancelled) setPngDataUrl(url);
    });
    QRCode.toString(payload, { type: "svg", width: 320, margin: 1 }).then((svg) => {
      if (!cancelled) setSvgMarkup(svg);
    });
    return () => {
      cancelled = true;
    };
  }, [payload]);

  function downloadPng() {
    if (!pngDataUrl) return;
    const a = document.createElement("a");
    a.href = pngDataUrl;
    a.download = "qrcode.png";
    a.click();
  }

  function downloadSvg() {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <Tabs value={type} onValueChange={(v) => setType(v as QrType)}>
        <TabsList className="grid w-full grid-cols-4">
          {(Object.keys(typeLabels) as QrType[]).map((t) => (
            <TabsTrigger key={t} value={t}>
              {typeLabels[t]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        <Label htmlFor="qr-value">{typeLabels[type]}</Label>
        <Input
          id="qr-value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholders[type]}
          type={type === "email" ? "email" : type === "tel" ? "tel" : "text"}
        />
      </div>

      {pngDataUrl && (
        <ResultCard>
          <div className="flex flex-col items-center gap-4">
            {/* Generated locally in the browser, so a plain img tag avoids next/image's remote-loader constraints */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pngDataUrl} alt="生成されたQRコード" width={200} height={200} className="rounded-xl border border-border bg-white p-3" />
            <div className="flex gap-2">
              <Button type="button" onClick={downloadPng} className="gap-1.5">
                <Download className="size-4" />
                PNGダウンロード
              </Button>
              <Button type="button" variant="outline" onClick={downloadSvg} className="gap-1.5">
                <Download className="size-4" />
                SVGダウンロード
              </Button>
            </div>
          </div>
        </ResultCard>
      )}
    </div>
  );
}
