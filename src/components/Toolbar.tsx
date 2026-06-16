import { useRef, useState } from "react";
import { useEditor } from "../store/editorStore";
import { readImageFile } from "../lib/file";
import { EmojiPicker } from "./EmojiPicker";
import { StickerPicker } from "./StickerPicker";

type Popover = "emoji" | "sticker" | null;

export function Toolbar() {
  const setBaseImage = useEditor((s) => s.setBaseImage);
  const addLaser = useEditor((s) => s.addLaser);
  const addSign = useEditor((s) => s.addSign);
  const addText = useEditor((s) => s.addText);
  const clear = useEditor((s) => s.clear);
  const hasLayers = useEditor((s) => s.layers.length > 0);

  const photoRef = useRef<HTMLInputElement>(null);
  const [popover, setPopover] = useState<Popover>(null);
  const toggle = (p: Popover) => setPopover((cur) => (cur === p ? null : p));

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { src, width, height } = await readImageFile(file);
    setBaseImage(src, width, height);
    e.target.value = "";
  };

  return (
    <div className="toolbar">
      <button className="btn btn-primary" onClick={() => photoRef.current?.click()}>
        🖼️ Upload photo
      </button>
      <input ref={photoRef} type="file" accept="image/*" hidden onChange={onPhoto} />

      <span className="toolbar-sep" />

      <button className="btn" onClick={() => addLaser("red")}>
        🔴 Laser eyes
      </button>
      <button className="btn" onClick={() => addSign()}>
        🪧 Sign
      </button>
      <button className="btn" onClick={() => addText()}>
        🔤 Text
      </button>

      <div className="popover-anchor">
        <button
          className={"btn" + (popover === "emoji" ? " btn-active" : "")}
          onClick={() => toggle("emoji")}
        >
          😀 Emoji
        </button>
        {popover === "emoji" && <EmojiPicker onPick={() => setPopover(null)} />}
      </div>

      <div className="popover-anchor">
        <button
          className={"btn" + (popover === "sticker" ? " btn-active" : "")}
          onClick={() => toggle("sticker")}
        >
          ⭐ Stickers
        </button>
        {popover === "sticker" && <StickerPicker onPick={() => setPopover(null)} />}
      </div>

      <span className="toolbar-sep" />

      <button
        className="btn btn-ghost"
        disabled={!hasLayers}
        onClick={() => {
          if (confirm("Clear the whole canvas?")) clear();
        }}
      >
        🗑️ Clear
      </button>
    </div>
  );
}
