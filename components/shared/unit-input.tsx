"use client";

import type { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@/components/shared/error-message";
import { cn } from "@/lib/utils";

interface UnitInputProps {
  id: string;
  label: string;
  unit?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number | string;
  className?: string;
}

/** Common labeled numeric input with a trailing unit (km, 円, % etc). */
export function UnitInput({
  id,
  label,
  unit,
  value,
  onChange,
  error,
  placeholder,
  min,
  max,
  step,
  className,
}: UnitInputProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // Strip unnatural leading zeros (e.g. typing "5" after "0" giving "05")
    // while still allowing "0" itself and decimals like "0.5".
    const normalized = raw.length > 1 && raw.startsWith("0") && raw[1] !== "." ? raw.replace(/^0+/, "") || "0" : raw;
    onChange(normalized);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            unit && "pr-10"
          )}
        />
        {unit && (
          <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-xs text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      {error && <ErrorMessage id={`${id}-error`}>{error}</ErrorMessage>}
    </div>
  );
}
