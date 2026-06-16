import { useEditor } from "../store/editorStore";

// A curated set of fun emojis for reactions/memes.
const EMOJIS = [
  "🔥", "💥", "✨", "💯", "👑", "😎", "🤡", "💀", "👀", "🧠",
  "🚀", "🎉", "❤️", "💔", "⚡", "🌈", "🍕", "🤖", "👻", "💩",
  "🙌", "👉", "👈", "🫡", "🤯", "😤", "🥲", "😭", "🤩", "🫠",
];

export function EmojiPicker({ onPick }: { onPick: () => void }) {
  const addEmoji = useEditor((s) => s.addEmoji);
  return (
    <div className="popover">
      <div className="emoji-grid">
        {EMOJIS.map((e) => (
          <button
            key={e}
            className="emoji-cell"
            onClick={() => {
              addEmoji(e);
              onPick();
            }}
            title={`Add ${e}`}
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}
