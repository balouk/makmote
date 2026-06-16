import type { KonvaEventObject } from "konva/lib/Node";
import { useEditor } from "../store/editorStore";
import type { Layer } from "../types";

/**
 * Common props every layer's root Konva node needs: a stable id (so the
 * Transformer can find it), selection on click, and write-back of the
 * transform to the store on drag/transform end.
 */
export function useNodeProps(layer: Layer) {
  const select = useEditor((s) => s.select);
  const update = useEditor((s) => s.update);

  const onSelect = () => select(layer.id);

  const onDragEnd = (e: KonvaEventObject<DragEvent>) => {
    update(layer.id, { x: e.target.x(), y: e.target.y() });
  };

  const onTransformEnd = (e: KonvaEventObject<Event>) => {
    const node = e.target;
    update(layer.id, {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
    });
  };

  return {
    id: layer.id,
    name: "layer",
    draggable: true,
    visible: layer.visible,
    x: layer.x,
    y: layer.y,
    rotation: layer.rotation,
    scaleX: layer.scaleX,
    scaleY: layer.scaleY,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd,
    onTransformEnd,
  };
}
