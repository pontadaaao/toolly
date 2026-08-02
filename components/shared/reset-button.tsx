"use client";

import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ResetButtonProps {
  onReset: () => void;
  label?: string;
  className?: string;
}

/** Common "入力をリセット" button — clears a tool's state and confirms via toast. */
export function ResetButton({ onReset, label = "リセット", className }: ResetButtonProps) {
  function handleClick() {
    onReset();
    toast.success("リセットしました");
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={handleClick} className={className}>
      <RotateCcw />
      {label}
    </Button>
  );
}
