import type Konva from "konva";

export interface ExportOptions {
  size: number; // output px (square), e.g. 128
  transparent: boolean;
  bgColor: string; // used when not transparent
}

export interface ExportResult {
  blob: Blob;
  bytes: number;
  size: number;
  dataUrl: string;
}

/** Slack custom-emoji file-size limit. */
export const SLACK_MAX_BYTES = 128 * 1024;

/**
 * Render the editor stage to a square PNG at the requested size.
 * Hides any Transformer handles during capture so they don't end up baked in.
 */
export async function renderEmoji(
  stage: Konva.Stage,
  opts: ExportOptions
): Promise<ExportResult> {
  const transformers = stage.find("Transformer");
  transformers.forEach((t) => t.hide());
  let srcCanvas: HTMLCanvasElement;
  try {
    // pixelRatio maps the 512 working stage onto the desired output size.
    const pixelRatio = opts.size / stage.width();
    srcCanvas = stage.toCanvas({ pixelRatio });
  } finally {
    transformers.forEach((t) => t.show());
    stage.getLayers().forEach((l) => l.batchDraw());
  }

  const out = document.createElement("canvas");
  out.width = opts.size;
  out.height = opts.size;
  const ctx = out.getContext("2d")!;
  if (!opts.transparent) {
    ctx.fillStyle = opts.bgColor;
    ctx.fillRect(0, 0, opts.size, opts.size);
  }
  ctx.drawImage(srcCanvas, 0, 0, opts.size, opts.size);

  const blob = await new Promise<Blob>((resolve, reject) =>
    out.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/png"
    )
  );

  return {
    blob,
    bytes: blob.size,
    size: opts.size,
    dataUrl: out.toDataURL("image/png"),
  };
}

/** Trigger a browser download for a blob. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
