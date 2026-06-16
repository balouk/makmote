import { Image as KonvaImage } from "react-konva";
import type { ImageLayer } from "../types";
import { useImage } from "../lib/useImage";
import { useNodeProps } from "./useNodeProps";

/** A PNG sticker (built-in pack or user upload), centered on (x, y). */
export function ImageSticker({ layer }: { layer: ImageLayer }) {
  const props = useNodeProps(layer);
  const image = useImage(layer.src);
  if (!image) return null;

  return (
    <KonvaImage
      {...props}
      image={image}
      width={layer.naturalWidth}
      height={layer.naturalHeight}
      offsetX={layer.naturalWidth / 2}
      offsetY={layer.naturalHeight / 2}
    />
  );
}
