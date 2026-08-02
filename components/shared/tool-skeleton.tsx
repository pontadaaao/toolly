import { Skeleton } from "@/components/ui/skeleton";

export function ToolSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <Skeleton className="h-40 w-full rounded-2xl" />
    </div>
  );
}
