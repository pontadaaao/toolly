"use client";

import { UploadCloud } from "lucide-react";
import { useDropzone, type Accept } from "react-dropzone";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  accept?: Accept;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  hint?: string;
}

/** Reusable drag & drop file picker shared by every image/PDF tool. */
export function FileDropzone({ accept, multiple = true, onFiles, label, hint }: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple,
    onDrop: (accepted) => {
      if (accepted.length > 0) onFiles(accepted);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border p-10 text-center transition-colors",
        isDragActive ? "border-primary bg-primary/5" : "hover:border-primary/50 hover:bg-muted/40"
      )}
    >
      <input {...getInputProps()} />
      <UploadCloud className="size-8 text-muted-foreground" />
      <p className="text-sm font-medium">{label ?? "ファイルをドラッグ&ドロップ、またはクリックして選択"}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
