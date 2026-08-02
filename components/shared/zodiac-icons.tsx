import type { ReactNode } from "react";
import type { EtoSign } from "@/utils/eto";
import { cn } from "@/lib/utils";

interface ZodiacIconProps {
  sign: EtoSign;
  className?: string;
}

/**
 * 十二支のオリジナル線画アイコン。既存イラストの流用ではなく、サイトの
 * トーンに合わせてSVG基本図形のみで新規に描き起こしたもの。
 */
export function ZodiacIcon({ sign, className }: ZodiacIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("size-full", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {zodiacPaths[sign]}
    </svg>
  );
}

const zodiacPaths: Record<EtoSign, ReactNode> = {
  子: (
    <>
      <circle cx="24" cy="26" r="12" />
      <circle cx="15" cy="16" r="5" />
      <circle cx="33" cy="16" r="5" />
      <circle cx="20" cy="26" r="1.5" fill="currentColor" />
      <circle cx="28" cy="26" r="1.5" fill="currentColor" />
      <path d="M22 31c1 1 3 1 4 0" />
      <path d="M36 30c4 1 7 4 7 7" />
    </>
  ),
  丑: (
    <>
      <circle cx="24" cy="28" r="11" />
      <path d="M14 20c-2-4-1-8 2-9" />
      <path d="M34 20c2-4 1-8-2-9" />
      <rect x="17" y="30" width="14" height="8" rx="4" />
      <circle cx="20" cy="34" r="1" fill="currentColor" />
      <circle cx="28" cy="34" r="1" fill="currentColor" />
    </>
  ),
  寅: (
    <>
      <circle cx="24" cy="26" r="12" />
      <path d="M13 15l6 6" />
      <path d="M35 15l-6 6" />
      <path d="M16 24c3 1 6 1 9 0" />
      <path d="M23 30c3 1 6 1 9 0" />
      <circle cx="20" cy="25" r="1" fill="currentColor" />
      <circle cx="28" cy="25" r="1" fill="currentColor" />
    </>
  ),
  卯: (
    <>
      <path d="M17 22c-3-6-2-13 2-15" />
      <path d="M31 22c3-6 2-13-2-15" />
      <circle cx="24" cy="29" r="11" />
      <circle cx="20" cy="28" r="1.2" fill="currentColor" />
      <circle cx="28" cy="28" r="1.2" fill="currentColor" />
      <path d="M21 33c1 1 5 1 6 0" />
    </>
  ),
  辰: (
    <>
      <path d="M10 30c4-10 12-16 20-14" />
      <path d="M30 16c4 1 8 5 8 10" />
      <path d="M14 24l-4-2" />
      <path d="M14 24l-2 4" />
      <circle cx="30" cy="22" r="1.4" fill="currentColor" />
      <path d="M34 20c1-2 3-3 5-2" />
    </>
  ),
  巳: (
    <>
      <path d="M14 34c4 4 10 4 12 0s-4-8 0-12 12-4 12 4" />
      <circle cx="36" cy="14" r="4" />
      <circle cx="37.5" cy="12.5" r="0.8" fill="currentColor" />
      <path d="M38 16l3 3" />
    </>
  ),
  午: (
    <>
      <path d="M18 36V22c0-7 5-12 11-12 4 0 6 3 5 6-3 0-6 1-6 5v15" />
      <path d="M18 24l-6-2" />
      <path d="M18 20l-5-3" />
      <circle cx="26" cy="18" r="1.2" fill="currentColor" />
      <path d="M22 26h4" />
    </>
  ),
  未: (
    <>
      <circle cx="24" cy="28" r="10" />
      <path d="M11 22c3-3 3-8 0-10" />
      <path d="M37 22c-3-3-3-8 0-10" />
      <circle cx="20" cy="27" r="1.1" fill="currentColor" />
      <circle cx="28" cy="27" r="1.1" fill="currentColor" />
      <path d="M20 33c1.5 1.5 6.5 1.5 8 0" />
    </>
  ),
  申: (
    <>
      <circle cx="24" cy="27" r="11" />
      <circle cx="13" cy="20" r="4.5" />
      <circle cx="35" cy="20" r="4.5" />
      <ellipse cx="24" cy="29" rx="6" ry="5" />
      <circle cx="21" cy="27" r="1" fill="currentColor" />
      <circle cx="27" cy="27" r="1" fill="currentColor" />
    </>
  ),
  酉: (
    <>
      <circle cx="22" cy="28" r="9" />
      <path d="M18 20c1-4 0-7-2-8 2-1 4 1 4 3 1-3 3-4 5-3-1 2-2 5-1 8" />
      <path d="M31 27l7-2-4 5z" />
      <circle cx="20" cy="26" r="1" fill="currentColor" />
      <path d="M15 32c-1 2-1 4 1 5" />
    </>
  ),
  戌: (
    <>
      <circle cx="24" cy="27" r="11" />
      <path d="M14 20c-3 1-4 6-2 10" />
      <path d="M34 20c3 1 4 6 2 10" />
      <circle cx="20" cy="26" r="1.2" fill="currentColor" />
      <circle cx="28" cy="26" r="1.2" fill="currentColor" />
      <path d="M22 32c1 1 3 1 4 0" />
      <path d="M24 34v3" />
    </>
  ),
  亥: (
    <>
      <circle cx="24" cy="27" r="11" />
      <circle cx="15" cy="19" r="3.5" />
      <circle cx="33" cy="19" r="3.5" />
      <rect x="19" y="28" width="10" height="6" rx="3" />
      <circle cx="22" cy="31" r="0.8" fill="currentColor" />
      <circle cx="26" cy="31" r="0.8" fill="currentColor" />
      <circle cx="19" cy="24" r="1" fill="currentColor" />
      <circle cx="29" cy="24" r="1" fill="currentColor" />
    </>
  ),
};
