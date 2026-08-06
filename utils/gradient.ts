/** Pure gradient-building helpers for the gradient background generator. */

export type GradientType = "linear" | "radial" | "conic";

export const gradientTypeLabels: Record<GradientType, string> = {
  linear: "線形（リニア）",
  radial: "放射状（ラジアル）",
  conic: "円錐状（コニック）",
};

export interface ColorStop {
  id: string;
  color: string;
  /** 0-100 */
  position: number;
}

export interface GradientConfig {
  type: GradientType;
  /** 角度（度）。linearは進行方向、conicは開始角度に使用。 */
  angle: number;
  stops: ColorStop[];
}

function stopsToCss(stops: ColorStop[]): string {
  return [...stops]
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.color} ${s.position}%`)
    .join(", ");
}

/** Builds the CSS `<gradient>` function value (usable directly as `backgroundImage`). */
export function buildCssGradientValue(config: GradientConfig): string {
  const stopsCss = stopsToCss(config.stops);
  switch (config.type) {
    case "linear":
      return `linear-gradient(${config.angle}deg, ${stopsCss})`;
    case "radial":
      return `radial-gradient(ellipse at center, ${stopsCss})`;
    case "conic":
      return `conic-gradient(from ${config.angle}deg at center, ${stopsCss})`;
  }
}

export function buildCssBackgroundDeclaration(config: GradientConfig): string {
  return `background: ${buildCssGradientValue(config)};`;
}

/**
 * Draws the gradient onto a canvas using the native Canvas 2D gradient APIs
 * (not a re-implementation of CSS gradient math), so the exported PNG stays
 * crisp at any resolution. Angle conventions are converted to match the CSS
 * preview as closely as each API allows.
 */
export function drawGradientOnCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, config: GradientConfig): void {
  const sortedStops = [...config.stops].sort((a, b) => a.position - b.position);
  let gradient: CanvasGradient;

  if (config.type === "linear") {
    const angleRad = ((config.angle % 360) * Math.PI) / 180;
    const length = Math.abs(width * Math.sin(angleRad)) + Math.abs(height * Math.cos(angleRad));
    const halfW = (length * Math.sin(angleRad)) / 2;
    const halfH = (length * Math.cos(angleRad)) / 2;
    const cx = width / 2;
    const cy = height / 2;
    gradient = ctx.createLinearGradient(cx - halfW, cy + halfH, cx + halfW, cy - halfH);
    sortedStops.forEach((s) => gradient.addColorStop(s.position / 100, s.color));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  if (config.type === "radial") {
    const cx = width / 2;
    const cy = height / 2;
    const rx = width / 2;
    const ry = height / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(rx || 1, ry || 1);
    gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    sortedStops.forEach((s) => gradient.addColorStop(s.position / 100, s.color));
    ctx.fillStyle = gradient;
    ctx.fillRect(-1, -1, 2, 2);
    ctx.restore();
    return;
  }

  // conic — canvas' 0 rad points right (3 o'clock); CSS "from 0deg" points up, so offset by -90deg to match the preview.
  const startAngleRad = (((config.angle - 90) % 360) * Math.PI) / 180;
  gradient = ctx.createConicGradient(startAngleRad, width / 2, height / 2);
  sortedStops.forEach((s) => gradient.addColorStop(s.position / 100, s.color));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

export function createStopId(): string {
  return `stop-${Math.random().toString(36).slice(2)}`;
}

export const gradientPresets: { name: string; config: Omit<GradientConfig, "stops"> & { colors: string[] } }[] = [
  { name: "サンセット", config: { type: "linear", angle: 135, colors: ["#FF8FA3", "#4F8EF7"] } },
  { name: "オーシャン", config: { type: "linear", angle: 120, colors: ["#4F8EF7", "#59C3C3"] } },
  { name: "パステル", config: { type: "linear", angle: 100, colors: ["#FFD6E8", "#C9E4FF"] } },
  { name: "モノクローム", config: { type: "linear", angle: 180, colors: ["#1F2937", "#64748B"] } },
  { name: "オーロラ", config: { type: "linear", angle: 60, colors: ["#59C3C3", "#4F8EF7", "#FF8FA3"] } },
  { name: "サイバー", config: { type: "radial", angle: 0, colors: ["#4F8EF7", "#1F2937"] } },
];

export function buildStopsFromColors(colors: string[]): ColorStop[] {
  if (colors.length === 1) return [{ id: createStopId(), color: colors[0], position: 0 }];
  return colors.map((color, i) => ({
    id: createStopId(),
    color,
    position: Math.round((i / (colors.length - 1)) * 100),
  }));
}

export function randomHexColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 30);
  const lightness = 45 + Math.floor(Math.random() * 20);
  // Small local HSL->RGB->HEX conversion to avoid a circular import with utils/color.ts's richer API.
  const s = saturation / 100;
  const l = lightness / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
