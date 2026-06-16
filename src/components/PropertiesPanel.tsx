import { useEditor } from "../store/editorStore";
import type { LaserColor, Layer } from "../types";

const LASER_SWATCHES: { color: LaserColor; hex: string }[] = [
  { color: "red", hex: "#ff2d2d" },
  { color: "green", hex: "#39ff14" },
  { color: "blue", hex: "#2d7bff" },
  { color: "pink", hex: "#ff4dd2" },
];

const FONTS = ["Impact, sans-serif", "Arial, sans-serif", "Comic Sans MS, cursive", "Georgia, serif"];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="prop-row">
      <span className="prop-label">{label}</span>
      {children}
    </label>
  );
}

export function PropertiesPanel() {
  const layers = useEditor((s) => s.layers);
  const selectedId = useEditor((s) => s.selectedId);
  const update = useEditor((s) => s.update);

  const layer = layers.find((l) => l.id === selectedId);
  if (!layer) {
    return <p className="muted">Select a layer to edit its properties.</p>;
  }

  const set = (patch: Partial<Layer>) => update(layer.id, patch);

  return (
    <div className="props">
      {layer.type === "laser" && (
        <>
          <Row label="Color">
            <span className="swatches">
              {LASER_SWATCHES.map((s) => (
                <button
                  key={s.color}
                  className={"swatch" + (layer.color === s.color ? " on" : "")}
                  style={{ background: s.hex }}
                  onClick={() => set({ color: s.color })}
                />
              ))}
            </span>
          </Row>
          <Row label="Length">
            <input
              type="range"
              min={80}
              max={360}
              value={layer.length}
              onChange={(e) => set({ length: Number(e.target.value) })}
            />
          </Row>
        </>
      )}

      {layer.type === "sign" && (
        <>
          <Row label="Text">
            <textarea
              rows={2}
              value={layer.text}
              onChange={(e) => set({ text: e.target.value })}
            />
          </Row>
          <Row label="Board">
            <input
              type="color"
              value={layer.bgColor}
              onChange={(e) => set({ bgColor: e.target.value })}
            />
          </Row>
          <Row label="Text color">
            <input
              type="color"
              value={layer.textColor}
              onChange={(e) => set({ textColor: e.target.value })}
            />
          </Row>
          <Row label="Font size">
            <input
              type="range"
              min={18}
              max={80}
              value={layer.fontSize}
              onChange={(e) => set({ fontSize: Number(e.target.value) })}
            />
          </Row>
        </>
      )}

      {layer.type === "text" && (
        <>
          <Row label="Text">
            <textarea
              rows={2}
              value={layer.text}
              onChange={(e) => set({ text: e.target.value })}
            />
          </Row>
          <Row label="Fill">
            <input
              type="color"
              value={layer.fill}
              onChange={(e) => set({ fill: e.target.value })}
            />
          </Row>
          <Row label="Outline">
            <input
              type="color"
              value={layer.stroke}
              onChange={(e) => set({ stroke: e.target.value })}
            />
          </Row>
          <Row label="Font">
            <select
              value={layer.fontFamily}
              onChange={(e) => set({ fontFamily: e.target.value })}
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>
                  {f.split(",")[0]}
                </option>
              ))}
            </select>
          </Row>
          <Row label="Font size">
            <input
              type="range"
              min={20}
              max={160}
              value={layer.fontSize}
              onChange={(e) => set({ fontSize: Number(e.target.value) })}
            />
          </Row>
        </>
      )}

      {layer.type === "emoji" && (
        <Row label="Size">
          <input
            type="range"
            min={32}
            max={300}
            value={layer.fontSize}
            onChange={(e) => set({ fontSize: Number(e.target.value) })}
          />
        </Row>
      )}

      {/* Rotation applies to every layer type. */}
      <Row label="Rotation">
        <input
          type="range"
          min={-180}
          max={180}
          value={Math.round(layer.rotation)}
          onChange={(e) => set({ rotation: Number(e.target.value) })}
        />
      </Row>
      <button className="btn btn-block" onClick={() => set({ rotation: 0 })}>
        Reset rotation
      </button>
    </div>
  );
}
