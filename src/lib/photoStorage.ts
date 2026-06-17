import type { SavedPhoto } from "../types";

// Photos uploaded this session, mirrored to sessionStorage so they survive a
// reload within the same browser tab (but are gone once the tab closes — nothing
// is ever sent to a server). Data URLs are large, so we cap the library and fall
// back to in-memory only if the storage quota is exceeded.
const PHOTO_KEY = "makmote.photoLibrary.v1";
const STICKER_KEY = "makmote.stickerLibrary.v1";
export const MAX_PHOTOS = 12;
export const MAX_STICKERS = 24;

function load(key: string): SavedPhoto[] {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as SavedPhoto[]) : [];
  } catch {
    return [];
  }
}

function save(key: string, items: SavedPhoto[]): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Quota exceeded (too many / too large images) — keep them in memory only.
  }
}

export const loadLibrary = () => load(PHOTO_KEY);
export const saveLibrary = (photos: SavedPhoto[]) => save(PHOTO_KEY, photos);
export const loadStickers = () => load(STICKER_KEY);
export const saveStickers = (stickers: SavedPhoto[]) => save(STICKER_KEY, stickers);

/** Add an item to the front of a library, de-duped by src and capped. */
export function upsertPhoto(
  items: SavedPhoto[],
  item: SavedPhoto,
  max: number = MAX_PHOTOS
): SavedPhoto[] {
  const existing = items.find((p) => p.src === item.src);
  const without = items.filter((p) => p.src !== item.src);
  // Reuse the existing id if the same image was added before.
  const entry = existing ? { ...item, id: existing.id } : item;
  return [entry, ...without].slice(0, max);
}
