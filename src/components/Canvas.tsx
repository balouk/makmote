import { useEffect, useRef } from "react";
import type Konva from "konva";
import { Layer as KonvaLayer, Stage, Transformer } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { CANVAS_SIZE, useEditor } from "../store/editorStore";
import { BaseImage } from "../layers/BaseImage";
import { LaserBeam } from "../layers/LaserBeam";
import { SignPlacard } from "../layers/SignPlacard";
import { TextLabel } from "../layers/TextLabel";
import { EmojiSticker } from "../layers/EmojiSticker";
import { ImageSticker } from "../layers/ImageSticker";
import type { Layer } from "../types";

function renderLayer(layer: Layer) {
  if (!layer.visible) return null;
  switch (layer.type) {
    case "base":
      return <BaseImage key={layer.id} layer={layer} />;
    case "laser":
      return <LaserBeam key={layer.id} layer={layer} />;
    case "sign":
      return <SignPlacard key={layer.id} layer={layer} />;
    case "text":
      return <TextLabel key={layer.id} layer={layer} />;
    case "emoji":
      return <EmojiSticker key={layer.id} layer={layer} />;
    case "image":
      return <ImageSticker key={layer.id} layer={layer} />;
  }
}

export function Canvas({ stageRef }: { stageRef: React.RefObject<Konva.Stage> }) {
  const layers = useEditor((s) => s.layers);
  const selectedId = useEditor((s) => s.selectedId);
  const select = useEditor((s) => s.select);
  const remove = useEditor((s) => s.remove);
  const duplicate = useEditor((s) => s.duplicate);

  const trRef = useRef<Konva.Transformer>(null);

  // Attach the Transformer to whichever node is selected.
  useEffect(() => {
    const tr = trRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;
    const node = selectedId ? stage.findOne(`#${selectedId}`) : null;
    tr.nodes(node ? [node] : []);
    tr.getLayer()?.batchDraw();
  }, [selectedId, layers, stageRef]);

  // Keyboard shortcuts (ignored while typing in a form field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el as HTMLElement)?.isContentEditable;
      if (typing || !selectedId) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        remove(selectedId);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        duplicate(selectedId);
      } else if (e.key === "Escape") {
        select(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, remove, duplicate, select]);

  // Click on empty canvas to deselect.
  const onStageMouseDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (e.target === e.target.getStage()) select(null);
  };

  return (
    <div className="canvas-frame">
      <Stage
        ref={stageRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onMouseDown={onStageMouseDown}
        onTouchStart={onStageMouseDown}
      >
        <KonvaLayer>
          {layers.map(renderLayer)}
          <Transformer
            ref={trRef}
            rotateEnabled
            keepRatio={false}
            anchorSize={10}
            borderStroke="#5b8cff"
            anchorStroke="#5b8cff"
            anchorFill="#ffffff"
            boundBoxFunc={(oldBox, newBox) =>
              newBox.width < 12 || newBox.height < 12 ? oldBox : newBox
            }
          />
        </KonvaLayer>
      </Stage>
    </div>
  );
}
