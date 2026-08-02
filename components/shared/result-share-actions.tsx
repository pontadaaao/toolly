"use client";

import { useState, type RefObject } from "react";
import { toast } from "sonner";
import { Copy, Download, Loader2, MessageCircle, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResultShareActionsProps {
  /** コピー・SNS共有用の結果サマリーテキスト。 */
  shareText: string;
  /** 画像保存時のファイル名やWeb Share APIのタイトルに使う。 */
  title: string;
  /** 画像として保存する対象のDOM要素。 */
  resultRef: RefObject<HTMLElement>;
  className?: string;
}

function buildSnsUrl(network: "x" | "line", pageUrl: string, text: string): string {
  switch (network) {
    case "x":
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`;
    case "line":
      return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(text)}`;
  }
}

/**
 * 全「人生・暮らし」ツール共通の結果アクション（結果コピー・画像保存・
 * X/LINE共有）。アイコンボタンのみで構成。ResultCardの下に差し込んで使う。
 */
export function ResultShareActions({ shareText, title, resultRef, className }: ResultShareActionsProps) {
  const [isSavingImage, setIsSavingImage] = useState(false);

  function getPageUrl(): string {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  async function handleCopyResult() {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("結果をコピーしました");
    } catch {
      toast.error("コピーに失敗しました");
    }
  }

  async function handleSaveImage() {
    if (!resultRef.current) return;
    setIsSavingImage(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(resultRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `${title}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      toast.error("画像の保存に失敗しました");
    } finally {
      setIsSavingImage(false);
    }
  }

  function openShareWindow(url: string) {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  }

  const pageUrl = getPageUrl();

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="結果をコピー"
        title="結果をコピー"
        onClick={handleCopyResult}
      >
        <Copy />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={isSavingImage ? "画像を保存中" : "画像として保存"}
        title="画像として保存"
        onClick={handleSaveImage}
        disabled={isSavingImage}
      >
        {isSavingImage ? <Loader2 className="animate-spin" /> : <Download />}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Xで共有"
        title="Xで共有"
        onClick={() => openShareWindow(buildSnsUrl("x", pageUrl, shareText))}
      >
        <XIcon />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="LINEで共有"
        title="LINEで共有"
        onClick={() => openShareWindow(buildSnsUrl("line", pageUrl, shareText))}
      >
        <MessageCircle />
      </Button>
    </div>
  );
}
