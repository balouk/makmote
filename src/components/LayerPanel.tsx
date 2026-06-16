import { useEditor } from "../store/editorStore";

const ICON: Record<string, string> = {
  base: "🖼️",
  laser: "🔴",
  sign: "🪧",
  text: "🔤",
  emoji: "😀",
  image: "⭐",
};

export function LayerPanel() {
  const layers = useEditor((s) => s.layers);
  const selectedId = useEditor((s) => s.selectedId);
  const select = useEditor((s) => s.select);
  const update = useEditor((s) => s.update);
  const remove = useEditor((s) => s.remove);
  const duplicate = useEditor((s) => s.duplicate);
  const reorder = useEditor((s) => s.reorder);

  if (layers.length === 0) {
    return <p className="muted">No layers yet.</p>;
  }

  // Show top-most layer first.
  const ordered = [...layers].reverse();

  return (
    <ul className="layer-list">
      {ordered.map((l) => {
        const active = l.id === selectedId;
        return (
          <li
            key={l.id}
            className={"layer-row" + (active ? " active" : "")}
            onClick={() => select(l.id)}
          >
            <span className="layer-icon">{ICON[l.type]}</span>
            <span className="layer-name">{l.name}</span>
            <span className="layer-actions">
              <button
                title={l.visible ? "Hide" : "Show"}
                onClick={(e) => {
                  e.stopPropagation();
                  update(l.id, { visible: !l.visible });
                }}
              >
                {l.visible ? "👁️" : "🚫"}
              </button>
              <button
                title="Bring forward"
                onClick={(e) => {
                  e.stopPropagation();
                  reorder(l.id, 1);
                }}
              >
                ⬆️
              </button>
              <button
                title="Send backward"
                onClick={(e) => {
                  e.stopPropagation();
                  reorder(l.id, -1);
                }}
              >
                ⬇️
              </button>
              {l.type !== "base" && (
                <button
                  title="Duplicate"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicate(l.id);
                  }}
                >
                  📑
                </button>
              )}
              <button
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(l.id);
                }}
              >
                ❌
              </button>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
