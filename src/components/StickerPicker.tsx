import { useEffect, useRef, useState } from "react";
import { useEditor } from "../store/editorStore";
import type { StickerManifestEntry } from "../types";
import { measureImage, readImageFile } from "../lib/file";

export function StickerPicker({ onPick }: { onPick: () => void }) {
  const addImageSticker = useEditor((s) => s.addImageSticker);
  const [items, setItems] = useState<StickerManifestEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/stickers/manifest.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setItems)
      .catch(() => setError("Could not load sticker manifest"));
  }, []);

  const pick = async (entry: StickerManifestEntry) => {
    const { width, height } = await measureImage(entry.src);
    addImageSticker(entry.src, width, height, entry.name);
    onPick();
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { src, width, height } = await readImageFile(file);
    addImageSticker(src, width, height, file.name);
    onPick();
  };

  // Group by category for display.
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="popover popover-wide">
      {error && <p className="muted">{error}</p>}
      {categories.map((cat) => (
        <div key={cat} className="sticker-cat">
          <div className="sticker-cat-title">{cat}</div>
          <div className="sticker-grid">
            {items
              .filter((i) => i.category === cat)
              .map((i) => (
                <button
                  key={i.id}
                  className="sticker-cell"
                  onClick={() => pick(i)}
                  title={i.name}
                >
                  <img src={i.src} alt={i.name} />
                </button>
              ))}
          </div>
        </div>
      ))}
      <button className="btn btn-block" onClick={() => fileRef.current?.click()}>
        ⬆️ Upload sticker…
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={onUpload}
      />
    </div>
  );
}
