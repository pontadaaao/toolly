export type GifFitMode = "cover" | "pad" | "contain" | "stretch";

export const gifFitModeLabels: Record<GifFitMode, string> = {
  cover: "中央でトリミング",
  pad: "余白を追加",
  contain: "縦横比を維持して収める",
  stretch: "画面いっぱいに拡大",
};

/** Normalizes one source image onto a canvas of the shared GIF frame size. */
export function drawFrameToCanvas(
  img: HTMLImageElement,
  width: number,
  height: number,
  fit: GifFitMode,
  backgroundColor: string
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  if (fit === "pad") {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  if (fit === "stretch") {
    ctx.drawImage(img, 0, 0, width, height);
    return canvas;
  }

  const scale =
    fit === "cover"
      ? Math.max(width / img.naturalWidth, height / img.naturalHeight)
      : Math.min(width / img.naturalWidth, height / img.naturalHeight);
  const drawWidth = img.naturalWidth * scale;
  const drawHeight = img.naturalHeight * scale;
  ctx.drawImage(img, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
  return canvas;
}

export type GifLoopMode = "infinite" | "once" | number;

export interface GifFrameInput {
  canvas: HTMLCanvasElement;
  delay: number;
}

export interface GifEncodeOptions {
  width: number;
  height: number;
  frames: GifFrameInput[];
  loop: GifLoopMode;
  maxColors: number;
}

/**
 * Wraps `modern-gif`'s encoder. Runs on the main thread (no `workerUrl`) since
 * wiring a worker script through Next.js's webpack build is brittle; a
 * `LoadingIndicator` covers the wait instead.
 */
export async function encodeGif({ width, height, frames, loop, maxColors }: GifEncodeOptions): Promise<Blob> {
  const { encode } = await import("modern-gif");
  const looped = loop !== "once";
  const loopCount = loop === "infinite" || loop === "once" ? 0 : loop;

  return encode({
    width,
    height,
    frames: frames.map((f) => ({ data: f.canvas, delay: f.delay })),
    looped,
    loopCount,
    maxColors,
    format: "blob",
  });
}
