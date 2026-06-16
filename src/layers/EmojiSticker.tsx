import { Text } from "react-konva";
import type { EmojiLayer } from "../types";
import { useNodeProps } from "./useNodeProps";

/** A single Unicode emoji rendered large, centered on (x, y). */
export function EmojiSticker({ layer }: { layer: EmojiLayer }) {
  const props = useNodeProps(layer);
  const box = layer.fontSize * 1.2;

  return (
    <Text
      {...props}
      text={layer.emoji}
      fontSize={layer.fontSize}
      align="center"
      verticalAlign="middle"
      width={box}
      height={box}
      offsetX={box / 2}
      offsetY={box / 2}
    />
  );
}
