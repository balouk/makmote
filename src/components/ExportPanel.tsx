import { useState } from "react";
import type Konva from "konva";
import { useEditor } from "../store/editorStore";
import {
  downloadBlob,
  formatBytes,
  renderEmoji,
  SLACK_MAX_BYTES,
  type ExportResult,
} from "../lib/export";

const SIZES = [128, 256, 512];

export function ExportPanel({ stageRef }: { stageRef: React.RefObject<Konva.Stage> }) {
  const hasLayers = useEditor((s) => s.layers.length > 0);
  const [size, setSize] = useState(128);
  const [transparent, setTransparent] = useState(true);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [name, setName] = useState("my-emoji");
  const [result, setResult] = useState<ExportResult | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (): Promise<ExportResult | null> => {
    const stage = stageRef.current;
    if (!stage) return null;
    setBusy(true);
    try {
      const r = await renderEmoji(stage, { size, transparent, bgColor });
      setResult(r);
      return r;
    } finally {
      setBusy(false);
    }
  };

  const onDownload = async () => {
    const r = (await run()) ?? result;
    if (r) downloadBlob(r.blob, `${name || "emoji"}.png`);
  };

  const tooBig = result ? result.bytes > SLACK_MAX_BYTES : false;

  return (
    <div className="export">
      <div className="prop-row">
        <span className="prop-label">Size</span>
        <span className="seg">
          {SIZES.map((s) => (
            <button
              key={s}
              className={"seg-btn" + (size === s ? " on" : "")}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </span>
      </div>

      <label className="prop-row">
        <span className="prop-label">Transparent</span>
        <input
          type="checkbox"
          checked={transparent}
          onChange={(e) => setTransparent(e.target.checked)}
        />
      </label>

      {!transparent && (
        <label className="prop-row">
          <span className="prop-label">Background</span>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </label>
      )}

      <label className="prop-row">
        <span className="prop-label">Name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="my-emoji"
        />
      </label>

      <div className="export-actions">
        <button className="btn" disabled={!hasLayers || busy} onClick={run}>
          Preview
        </button>
        <button
          className="btn btn-primary"
          disabled={!hasLayers || busy}
          onClick={onDownload}
        >
          ⬇️ Download PNG
        </button>
      </div>

      {result && (
        <div className="export-preview">
          <div
            className="preview-box"
            style={{ width: 128, height: 128 }}
          >
            <img src={result.dataUrl} alt="preview" width={128} height={128} />
          </div>
          <div className={"export-size" + (tooBig ? " warn" : " ok")}>
            {result.size}×{result.size} · {formatBytes(result.bytes)}
            {tooBig
              ? ` ⚠️ over Slack's 128 KB limit — try size 128 or fewer details`
              : " ✓ Slack-ready"}
          </div>
        </div>
      )}

      <p className="muted small">
        Slack custom emoji: 128×128, max 128 KB, PNG/GIF.
      </p>
    </div>
  );
}
