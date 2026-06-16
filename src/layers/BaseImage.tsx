import { Image as KonvaImage } from "react-konva";
import { CANVAS_SIZE } from "../store/editorStore";
import type { BaseImageLayer } from "../types";
import { useImage } from "../lib/useImage";
import { useNodeProps } from "./useNodeProps";

/**
 * The uploaded photo. Scaled to "cover" the square canvas by default and
 * centered on (x, y) via offset so scale/rotate pivot around its middle.
 */
export function BaseImage({ layer }: { layer: BaseImageLayer }) {
  const props = useNodeProps(layer);
  const image = useImage(layer.src);
  if (!image) return null;

  const cover = CANVAS_SIZE / Math.min(layer.naturalWidth, layer.naturalHeight);
  const width = layer.naturalWidth * cover;
  const height = layer.naturalHeight * cover;

  return (
    <KonvaImage
      {...props}
      image={image}
      width={width}
      height={height}
      offsetX={width / 2}
      offsetY={height / 2}
    />
  );
}
