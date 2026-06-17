import { useEditor } from "../store/editorStore";

/** Popover listing photos uploaded this session; click one to reuse it as the base. */
export function PhotoLibrary({ onPick }: { onPick: () => void }) {
  const photos = useEditor((s) => s.photoLibrary);
  const useSavedPhoto = useEditor((s) => s.useSavedPhoto);
  const removeSavedPhoto = useEditor((s) => s.removeSavedPhoto);

  if (photos.length === 0) {
    return (
      <div className="popover">
        <p className="muted small" style={{ margin: 0, maxWidth: 180 }}>
          No photos yet. Upload one and it'll be saved here for this session so you
          can reuse it.
        </p>
      </div>
    );
  }

  return (
    <div className="popover popover-wide">
      <div className="sticker-grid">
        {photos.map((p) => (
          <div key={p.id} className="photo-cell">
            <button
              className="photo-thumb"
              title={`Use “${p.name}”`}
              onClick={() => {
                useSavedPhoto(p.id);
                onPick();
              }}
            >
              <img src={p.src} alt={p.name} />
            </button>
            <button
              className="photo-remove"
              title="Remove from library"
              onClick={(e) => {
                e.stopPropagation();
                removeSavedPhoto(p.id);
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <p className="muted small">Saved for this session only — cleared when you close the tab.</p>
    </div>
  );
}
