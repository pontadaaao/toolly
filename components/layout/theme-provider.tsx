"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * next-themes provider wrapper.
 *
 * Hydration warnings from the theme class are suppressed on <html> in
 * app/layout.tsx (`suppressHydrationWarning`), which is where the attribute
 * actually applies — it is a React DOM attribute and has no effect when passed
 * to a component like NextThemesProvider.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
