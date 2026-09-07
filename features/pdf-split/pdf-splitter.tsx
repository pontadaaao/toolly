"use client";

import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { FileText, Scissors, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { ErrorMessage } from "@/components/shared/error-message";
import { PrivacyNotice } from "@/components/shared/privacy-notice";
import { ResultCard } from "@/components/shared/result-card";
import { formatPageList, parsePageRanges } from "@/utils/pdf";
import { downloadBlob, formatBytes, stripExtension } from "@/utils/image";

type Mode = "extract" | "each" | "half";

const modeLabels: Record<Mode, string> = {
  extract: "ページを抽出",
  each: "1ページずつ分割",
  half: "指定位置で2分割",
};

interface LoadedPdf {
  file: File;
  bytes: ArrayBuffer;
  pageCount: number;
}

interface SplitResult {
  blob: Blob;
  filename: string;
  description: string;
}

export function PdfSplitter() {
  const [pdf, setPdf] = useState<LoadedPdf | null>(null);
  const [mode, setMode] = useState<Mode>("extract");
  const [rangeInput, setRangeInput] = useState("1-3");
  const [splitAfter, setSplitAfter] = useState("1");
  const [error, setError] = useState<string | undefined>();
  const [isWorking, setIsWorking] = useState(false);
  const [results, setResults] = useState<SplitResult[]>([]);

  async function handleFiles(files: File[]) {
    const file = files.find((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!file) return;

    setError(undefined);
    setResults([]);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const pageCount = doc.getPageCount();
      setPdf({ file, bytes, pageCount });
      setRangeInput(pageCount >= 3 ? "1-3" : "1");
      setSplitAfter(String(Math.max(1, Math.floor(pageCount / 2))));
    } catch {
      setPdf(null);
      setError("PDFを読み込めませんでした。パスワードで保護されたPDFは、保護を解除してからお試しください。");
    }
  }

  function reset() {
    setPdf(null);
    setResults([]);
    setError(undefined);
  }

  /** Builds a new PDF containing only `pages` (1-indexed) of the loaded document. */
  async function buildPdf(pages: number[]): Promise<Blob> {
    const source = await PDFDocument.load(pdf!.bytes);
    const output = await PDFDocument.create();
    const copied = await output.copyPages(
      source,
      pages.map((p) => p - 1)
    );
    copied.forEach((page) => output.addPage(page));
    const saved = await output.save();
    return new Blob([saved as BlobPart], { type: "application/pdf" });
  }

  async function run() {
    if (!pdf) return;
    setError(undefined);
    setIsWorking(true);
    try {
      const base = stripExtension(pdf.file.name);

      if (mode === "extract") {
        const { pages, error: parseError } = parsePageRanges(rangeInput, pdf.pageCount);
        if (parseError) {
          setError(parseError);
          setResults([]);
          return;
        }
        const blob = await buildPdf(pages);
        // 昇順に並んでいるときだけ「1-3」形式にまとめる。並べ替えを指示された
        // ときは入力どおりの順番で出力しているので、表示もその順番を保つ。
        const ascending = pages.every((p, i) => i === 0 || p > pages[i - 1]);
        const label = ascending ? formatPageList(pages) : pages.join(", ");
        setResults([
          {
            blob,
            filename: `${base}_p${label.replace(/,\s*/g, "-")}.pdf`,
            description: `${label}ページ（全${pages.length}ページ）`,
          },
        ]);
        return;
      }

      if (mode === "half") {
        const at = Number(splitAfter.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)));
        if (!Number.isInteger(at) || at < 1 || at >= pdf.pageCount) {
          setError(`区切る位置は1以上${pdf.pageCount - 1}以下で指定してください。`);
          setResults([]);
          return;
        }
        const front = Array.from({ length: at }, (_, i) => i + 1);
        const back = Array.from({ length: pdf.pageCount - at }, (_, i) => at + i + 1);
        const [frontBlob, backBlob] = await Promise.all([buildPdf(front), buildPdf(back)]);
        setResults([
          { blob: frontBlob, filename: `${base}_1.pdf`, description: `${formatPageList(front)}ページ` },
          { blob: backBlob, filename: `${base}_2.pdf`, description: `${formatPageList(back)}ページ` },
        ]);
        return;
      }

      // mode === "each": every page becomes its own PDF, delivered as one ZIP.
      const zip = new JSZip();
      const digits = String(pdf.pageCount).length;
      for (let p = 1; p <= pdf.pageCount; p++) {
        const blob = await buildPdf([p]);
        zip.file(`${base}_${String(p).padStart(digits, "0")}.pdf`, blob);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      setResults([
        {
          blob: zipBlob,
          filename: `${base}_split.zip`,
          description: `${pdf.pageCount}個のPDFをZIPにまとめました`,
        },
      ]);
    } catch {
      setError("分割処理に失敗しました。別のPDFでお試しください。");
      setResults([]);
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <div className="space-y-6">
      {!pdf ? (
        <>
          <FileDropzone
            accept={{ "application/pdf": [".pdf"] }}
            multiple={false}
            onFiles={handleFiles}
            label="PDFファイルをドラッグ&ドロップ、またはクリックしてアップロード"
            hint="1ファイルずつ処理します。"
          />
          <PrivacyNotice />
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
            <FileText className="size-5 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{pdf.file.name}</p>
              <p className="text-xs text-muted-foreground">
                全{pdf.pageCount}ページ・{formatBytes(pdf.file.size)}
              </p>
            </div>
            <Button size="icon" variant="ghost" onClick={reset} aria-label="別のPDFを選ぶ">
              <X className="size-4" />
            </Button>
          </div>

          <Tabs
            value={mode}
            onValueChange={(v) => {
              setMode(v as Mode);
              setResults([]);
              setError(undefined);
            }}
          >
            <TabsList className="grid w-full grid-cols-3">
              {(Object.keys(modeLabels) as Mode[]).map((m) => (
                <TabsTrigger key={m} value={m}>
                  {modeLabels[m]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {mode === "extract" && (
            <div className="space-y-2">
              <Label htmlFor="pdf-range">抽出するページ</Label>
              <Input
                id="pdf-range"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="例：1-3,5,8-10"
                inputMode="text"
              />
              <p className="text-xs text-muted-foreground">
                「1-3,5」のように、範囲はハイフン、複数指定はカンマで区切ります（全{pdf.pageCount}ページ）。
              </p>
            </div>
          )}

          {mode === "half" && (
            <div className="space-y-2">
              <Label htmlFor="pdf-split-at">何ページ目の後ろで区切るか</Label>
              <Input
                id="pdf-split-at"
                value={splitAfter}
                onChange={(e) => setSplitAfter(e.target.value)}
                inputMode="numeric"
              />
              <p className="text-xs text-muted-foreground">
                1〜{pdf.pageCount - 1}の範囲で指定します。前半と後半の2つのPDFに分かれます。
              </p>
            </div>
          )}

          {mode === "each" && (
            <p className="rounded-xl bg-muted/40 p-3 text-sm text-muted-foreground">
              全{pdf.pageCount}ページを1ページずつのPDFに分割し、まとめてZIPでダウンロードします。
            </p>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button onClick={run} disabled={isWorking} className="gap-1.5">
            <Scissors className="size-4" />
            {isWorking ? "処理中…" : "分割する"}
          </Button>

          {results.length > 0 && (
            <ResultCard title="分割結果">
              <ul className="space-y-3">
                {results.map((result) => (
                  <li
                    key={result.filename}
                    className="flex flex-col gap-3 rounded-xl bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{result.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {result.description}・{formatBytes(result.blob.size)}
                      </p>
                    </div>
                    <Button className="shrink-0" onClick={() => downloadBlob(result.blob, result.filename)}>
                      ダウンロード
                    </Button>
                  </li>
                ))}
              </ul>
            </ResultCard>
          )}
        </div>
      )}
    </div>
  );
}
