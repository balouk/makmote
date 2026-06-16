import { Text } from "react-konva";
import type { TextLayer } from "../types";
import { useNodeProps } from "./useNodeProps";

/** Freeform meme-style text with an outline, centered on (x, y). */
export function TextLabel({ layer }: { layer: TextLayer }) {
  const props = useNodeProps(layer);
  const lines = layer.text.split("\n");
  const maxLen = Math.max(1, ...lines.map((l) => l.length));
  const width = Math.max(40, maxLen * layer.fontSize * 0.62);
  const height = lines.length * layer.fontSize * 1.15;

  return (
    <Text
      {...props}
      text={layer.text}
      fontSize={layer.fontSize}
      fontFamily={layer.fontFamily}
      fontStyle="bold"
      fill={layer.fill}
      stroke={layer.stroke}
      strokeWidth={Math.max(1, layer.fontSize * 0.06)}
      lineJoin="round"
      align="center"
      width={width}
      height={height}
      offsetX={width / 2}
      offsetY={height / 2}
    />
  );
}
