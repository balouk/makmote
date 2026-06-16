import { Circle, Group, Line } from "react-konva";
import type { LaserColor, LaserLayer } from "../types";
import { useNodeProps } from "./useNodeProps";

const COLORS: Record<LaserColor, string> = {
  red: "#ff2d2d",
  green: "#39ff14",
  blue: "#2d7bff",
  pink: "#ff4dd2",
};

/** hex (#rrggbb) -> rgba string with the given alpha. */
function rgba(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * A drawn laser-eye beam. The local origin (0,0) sits on the eye, the beam
 * shoots toward +x, so rotating the layer aims it. Add two — one per eye.
 */
export function LaserBeam({ layer }: { layer: LaserLayer }) {
  const props = useNodeProps(layer);
  const color = COLORS[layer.color];
  const L = layer.length;

  // Cone widening from the eye outward.
  const glowCone = [0, -8, L, -26, L, 26, 0, 8];
  const coreCone = [0, -3, L, -9, L, 9, 0, 3];

  return (
    <Group {...props}>
      {/* outer glow cone */}
      <Line
        points={glowCone}
        closed
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: L, y: 0 }}
        fillLinearGradientColorStops={[0, rgba(color, 0.95), 1, rgba(color, 0)]}
        shadowColor={color}
        shadowBlur={24}
        shadowOpacity={0.9}
        listening={true}
      />
      {/* bright core */}
      <Line
        points={coreCone}
        closed
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: L, y: 0 }}
        fillLinearGradientColorStops={[
          0,
          "rgba(255,255,255,0.95)",
          1,
          rgba(color, 0),
        ]}
      />
      {/* eye flare */}
      <Circle
        radius={16}
        fillRadialGradientStartPoint={{ x: 0, y: 0 }}
        fillRadialGradientEndPoint={{ x: 0, y: 0 }}
        fillRadialGradientStartRadius={0}
        fillRadialGradientEndRadius={16}
        fillRadialGradientColorStops={[
          0,
          "rgba(255,255,255,1)",
          0.4,
          rgba(color, 0.9),
          1,
          rgba(color, 0),
        ]}
      />
    </Group>
  );
}
