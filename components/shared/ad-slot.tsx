/** Placeholder ad slot. Swap the inner content for a real ad tag when monetization is wired up. */
export function AdSlot({ className }: { className?: string }) {
  return (
    <div
      className={`flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 text-xs text-muted-foreground ${className ?? ""}`}
      aria-hidden="true"
    >
      広告エリア（Ad）
    </div>
  );
}
