import { Group, Image as KonvaImage, Rect } from "react-konva";
import { CANVAS_SIZE } from "../store/editorStore";
import type { BaseImageLayer } from "../types";
import { useImage } from "../lib/useImage";
import { useNodeProps } from "./useNodeProps";

/**
 * The uploaded photo. Scaled to "cover" the square canvas by default and
 * centered on (x, y) via offset so scale/rotate pivot around its middle.
 *
 * An optional color tint is drawn on top with `globalCompositeOperation:
 * "source-atop"`. Because the base is always the bottom-most layer, that
 * composite paints the tint only over the photo's opaque pixels — so it never
 * leaks onto transparent areas or the overlays above it.
 */
export function BaseImage({ layer }: { layer: BaseImageLayer }) {
  const props = useNodeProps(layer);
  const image = useImage(layer.src);
  if (!image) return null;

  const cover = CANVAS_SIZE / Math.min(layer.naturalWidth, layer.naturalHeight);
  const width = layer.naturalWidth * cover;
  const height = layer.naturalHeight * cover;
  const offsetX = width / 2;
  const offsetY = height / 2;

  return (
    <Group {...props}>
      <KonvaImage
        image={image}
        width={width}
        height={height}
        offsetX={offsetX}
        offsetY={offsetY}
      />
      {layer.tintStrength > 0 && (
        <Rect
          width={width}
          height={height}
          offsetX={offsetX}
          offsetY={offsetY}
          fill={layer.tintColor}
          opacity={layer.tintStrength}
          globalCompositeOperation="source-atop"
          listening={false}
        />
      )}
    </Group>
  );
}
