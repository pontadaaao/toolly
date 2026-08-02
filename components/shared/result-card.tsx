"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ResultItem {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}

interface ResultCardProps {
  title?: string;
  items?: ResultItem[];
  children?: React.ReactNode;
  className?: string;
}

/** Standard "result" surface shown below a tool's inputs. */
export function ResultCard({ title, items, children, className }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "rounded-2xl border border-border bg-muted/40 p-6",
        className
      )}
    >
      {title && <h3 className="mb-4 text-sm font-semibold text-muted-foreground">{title}</h3>}
      {items && items.length > 0 && (
        <dl className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.label}
              className={cn(
                "rounded-xl bg-card p-4 shadow-soft",
                item.highlight && "sm:col-span-2 border border-primary/20"
              )}
            >
              <dt className="text-xs text-muted-foreground">{item.label}</dt>
              <dd
                className={cn(
                  "mt-1 font-semibold",
                  item.highlight ? "text-2xl text-primary" : "text-lg"
                )}
              >
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {children}
    </motion.div>
  );
}
