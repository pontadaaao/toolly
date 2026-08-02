import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrivacyNoticeProps {
  children?: React.ReactNode;
  className?: string;
}

/** Common notice for file/image tools, reassuring visitors that processing stays on-device. */
export function PrivacyNotice({ children, className }: PrivacyNoticeProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-xl bg-secondary/10 px-3 py-2.5 text-xs text-muted-foreground",
        className
      )}
    >
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
      <span>{children ?? "アップロードしたファイルは端末内で処理され、サーバーに送信されることはありません。"}</span>
    </div>
  );
}
