import { Group, Rect, Text } from "react-konva";
import type { SignLayer } from "../types";
import { useNodeProps } from "./useNodeProps";

/**
 * A drawn "pancarte": a rounded placard on a stick with centered text.
 * The board auto-sizes to the text; the group is centered on (x, y).
 * Edit the text/colors from the properties panel.
 */
export function SignPlacard({ layer }: { layer: SignLayer }) {
  const props = useNodeProps(layer);
  const lines = layer.text.split("\n");
  const maxLen = Math.max(1, ...lines.map((l) => l.length));

  const boardW = Math.max(140, maxLen * layer.fontSize * 0.62 + 44);
  const boardH = lines.length * layer.fontSize * 1.25 + 32;
  const stickH = 80;

  return (
    <Group {...props}>
      {/* stick */}
      <Rect
        x={-9}
        y={boardH / 2 - 6}
        width={18}
        height={stickH}
        fill="#8a5a2b"
        cornerRadius={4}
      />
      {/* board */}
      <Rect
        x={-boardW / 2}
        y={-boardH / 2}
        width={boardW}
        height={boardH}
        fill={layer.bgColor}
        stroke="#00000033"
        strokeWidth={3}
        cornerRadius={12}
        shadowColor="#000000"
        shadowBlur={8}
        shadowOpacity={0.25}
        shadowOffsetY={3}
      />
      <Text
        x={-boardW / 2}
        y={-boardH / 2}
        width={boardW}
        height={boardH}
        text={layer.text}
        fontSize={layer.fontSize}
        fontStyle="bold"
        fontFamily="Arial, sans-serif"
        fill={layer.textColor}
        align="center"
        verticalAlign="middle"
        lineHeight={1.25}
        listening={false}
      />
    </Group>
  );
}
