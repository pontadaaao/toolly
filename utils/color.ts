/** Pure color-conversion helpers for the color picker / code converter tool. */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface CmykColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

const hexPattern = /^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

export function isValidHex(value: string): boolean {
  return hexPattern.test(value.trim());
}

/** Normalizes "#abc" / "abc" / "#AABBCC" into a lowercase "#aabbcc" form. */
export function normalizeHex(value: string): string {
  const trimmed = value.trim().replace(/^#/, "");
  const expanded =
    trimmed.length === 3
      ? trimmed
          .split("")
          .map((c) => c + c)
          .join("")
      : trimmed;
  return `#${expanded.toLowerCase()}`;
}

export function hexToRgb(hex: string): RgbColor | null {
  if (!isValidHex(hex)) return null;
  const normalized = normalizeHex(hex).slice(1);
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function toHexPart(n: number): string {
  return Math.round(clamp(n, 0, 255))
    .toString(16)
    .padStart(2, "0");
}

export function rgbToHex({ r, g, b }: RgbColor): string {
  return `#${toHexPart(r)}${toHexPart(g)}${toHexPart(b)}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case rn:
      h = (gn - bn) / d + (gn < bn ? 6 : 0);
      break;
    case gn:
      h = (bn - rn) / d + 2;
      break;
    default:
      h = (rn - gn) / d + 4;
  }
  h *= 60;

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb({ h, s, l }: HslColor): RgbColor {
  const hn = ((h % 360) + 360) % 360 / 360;
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;

  if (sn === 0) {
    const gray = Math.round(ln * 255);
    return { r: gray, g: gray, b: gray };
  }

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;

  const hueToRgb = (t: number): number => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  return {
    r: Math.round(hueToRgb(hn + 1 / 3) * 255),
    g: Math.round(hueToRgb(hn) * 255),
    b: Math.round(hueToRgb(hn - 1 / 3) * 255),
  };
}

export function rgbToCmyk({ r, g, b }: RgbColor): CmykColor {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  const c = (1 - rn - k) / (1 - k);
  const m = (1 - gn - k) / (1 - k);
  const y = (1 - bn - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

export function formatRgb(rgb: RgbColor): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function formatRgba(rgb: RgbColor, alpha = 1): string {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export function formatHsl(hsl: HslColor): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

export function formatHsla(hsl: HslColor, alpha = 1): string {
  return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha})`;
}

export function formatCmyk(cmyk: CmykColor): string {
  return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
}

/** Perceived brightness (0-255, YIQ formula) — used to pick readable text color over a swatch. */
export function getBrightness({ r, g, b }: RgbColor): number {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

export function getReadableTextColor(rgb: RgbColor): "#1F2937" | "#FFFFFF" {
  return getBrightness(rgb) > 150 ? "#1F2937" : "#FFFFFF";
}

/**
 * Generates a lightness ramp (shades = darker, tints = lighter) around the
 * given color's HSL lightness, for the shade/tint chart strip.
 */
export function generateLightnessRamp(hex: string, steps = 10): string[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];
  const hsl = rgbToHsl(rgb);
  const ramp: string[] = [];
  for (let i = 0; i < steps; i++) {
    const l = Math.round(((i + 1) / (steps + 1)) * 100);
    ramp.push(rgbToHex(hslToRgb({ h: hsl.h, s: hsl.s, l })));
  }
  return ramp;
}
