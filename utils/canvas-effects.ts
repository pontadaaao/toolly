/** Pure Canvas 2D pixel operations shared by the mosaic and blur editors. */

export type SelectionShape =
  | { kind: "rect"; x: number; y: number; width: number; height: number }
  | { kind: "circle"; cx: number; cy: number; r: number };

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getBoundingBox(shape: SelectionShape): BoundingBox {
  if (shape.kind === "rect") return { x: shape.x, y: shape.y, width: shape.width, height: shape.height };
  return { x: shape.cx - shape.r, y: shape.cy - shape.r, width: shape.r * 2, height: shape.r * 2 };
}

function isInsideShape(shape: SelectionShape, px: number, py: number): boolean {
  if (shape.kind === "rect") return true;
  const dx = px - shape.cx;
  const dy = py - shape.cy;
  return dx * dx + dy * dy <= shape.r * shape.r;
}

/** Pixelates the pixels within `shape` by averaging each blockSize×blockSize block. */
export function applyMosaic(ctx: CanvasRenderingContext2D, shape: SelectionShape, blockSize: number): void {
  const box = getBoundingBox(shape);
  const x = Math.max(0, Math.round(box.x));
  const y = Math.max(0, Math.round(box.y));
  const width = Math.max(0, Math.round(Math.min(box.width, ctx.canvas.width - x)));
  const height = Math.max(0, Math.round(Math.min(box.height, ctx.canvas.height - y)));
  if (width <= 0 || height <= 0) return;

  const imageData = ctx.getImageData(x, y, width, height);
  const { data, width: w, height: h } = imageData;
  const block = Math.max(2, Math.round(blockSize));

  for (let by = 0; by < h; by += block) {
    for (let bx = 0; bx < w; bx += block) {
      const bw = Math.min(block, w - bx);
      const bh = Math.min(block, h - by);
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let count = 0;
      for (let iy = 0; iy < bh; iy++) {
        for (let ix = 0; ix < bw; ix++) {
          if (!isInsideShape(shape, x + bx + ix, y + by + iy)) continue;
          const idx = ((by + iy) * w + (bx + ix)) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          a += data[idx + 3];
          count++;
        }
      }
      if (count === 0) continue;
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      a = Math.round(a / count);
      for (let iy = 0; iy < bh; iy++) {
        for (let ix = 0; ix < bw; ix++) {
          if (!isInsideShape(shape, x + bx + ix, y + by + iy)) continue;
          const idx = ((by + iy) * w + (bx + ix)) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = a;
        }
      }
    }
  }
  ctx.putImageData(imageData, x, y);
}

/**
 * Blurs the pixels within `shape`. Renders a blurred copy of the *whole*
 * canvas onto a scratch canvas (so the blur samples correctly from just
 * outside the shape's edge, avoiding a hard seam) and copies back only the
 * clipped region.
 */
export function applyBlur(ctx: CanvasRenderingContext2D, shape: SelectionShape, radius: number): void {
  const box = getBoundingBox(shape);
  const x = Math.max(0, box.x);
  const y = Math.max(0, box.y);
  const width = Math.min(box.width, ctx.canvas.width - x);
  const height = Math.min(box.height, ctx.canvas.height - y);
  if (width <= 0 || height <= 0) return;

  const temp = document.createElement("canvas");
  temp.width = ctx.canvas.width;
  temp.height = ctx.canvas.height;
  const tctx = temp.getContext("2d");
  if (!tctx) return;
  tctx.filter = `blur(${Math.max(1, radius)}px)`;
  tctx.drawImage(ctx.canvas, 0, 0);

  ctx.save();
  ctx.beginPath();
  if (shape.kind === "rect") {
    ctx.rect(x, y, width, height);
  } else {
    ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2);
  }
  ctx.clip();
  ctx.drawImage(temp, 0, 0);
  ctx.restore();
}
