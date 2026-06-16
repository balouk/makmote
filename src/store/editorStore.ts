import { create } from "zustand";
import type {
  BaseImageLayer,
  EmojiLayer,
  ImageLayer,
  LaserColor,
  LaserLayer,
  Layer,
  SignLayer,
  TextLayer,
} from "../types";

export const CANVAS_SIZE = 512;

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-${++idCounter}`;

interface EditorState {
  layers: Layer[];
  selectedId: string | null;

  select: (id: string | null) => void;
  update: (id: string, patch: Partial<Layer>) => void;
  remove: (id: string) => void;
  duplicate: (id: string) => void;
  clear: () => void;

  /** z-order: move a layer up/down in the array (1 = toward top). */
  reorder: (id: string, direction: -1 | 1) => void;

  setBaseImage: (src: string, naturalWidth: number, naturalHeight: number) => void;
  addLaser: (color?: LaserColor) => void;
  addSign: (text?: string) => void;
  addText: (text?: string) => void;
  addEmoji: (emoji: string) => void;
  addImageSticker: (
    src: string,
    naturalWidth: number,
    naturalHeight: number,
    name?: string
  ) => void;
}

const center = CANVAS_SIZE / 2;

const baseTransform = (type: Layer["type"], name: string, id: string) => ({
  id,
  type,
  name,
  visible: true,
  x: center,
  y: center,
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
});

export const useEditor = create<EditorState>((set, get) => ({
  layers: [],
  selectedId: null,

  select: (id) => set({ selectedId: id }),

  update: (id, patch) =>
    set((s) => ({
      layers: s.layers.map((l) =>
        l.id === id ? ({ ...l, ...patch } as Layer) : l
      ),
    })),

  remove: (id) =>
    set((s) => ({
      layers: s.layers.filter((l) => l.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),

  duplicate: (id) => {
    const src = get().layers.find((l) => l.id === id);
    if (!src || src.type === "base") return;
    const copy = {
      ...src,
      id: nextId(src.type),
      x: src.x + 24,
      y: src.y + 24,
      name: `${src.name} copy`,
    } as Layer;
    set((s) => ({ layers: [...s.layers, copy], selectedId: copy.id }));
  },

  clear: () => set({ layers: [], selectedId: null }),

  reorder: (id, direction) =>
    set((s) => {
      const i = s.layers.findIndex((l) => l.id === id);
      if (i === -1) return s;
      const j = i + direction;
      if (j < 0 || j >= s.layers.length) return s;
      // Never move anything below the base layer (it stays at index 0).
      if (s.layers[j].type === "base") return s;
      const layers = [...s.layers];
      [layers[i], layers[j]] = [layers[j], layers[i]];
      return { layers };
    }),

  setBaseImage: (src, naturalWidth, naturalHeight) =>
    set((s) => {
      const base: BaseImageLayer = {
        ...baseTransform("base", "Photo", "base"),
        type: "base",
        src,
        naturalWidth,
        naturalHeight,
        // BaseImage component centers via offset; place at canvas center.
        x: center,
        y: center,
      };
      const rest = s.layers.filter((l) => l.type !== "base");
      return { layers: [base, ...rest], selectedId: "base" };
    }),

  addLaser: (color = "red") => {
    const id = nextId("laser");
    const laser: LaserLayer = {
      ...baseTransform("laser", "Laser eye", id),
      type: "laser",
      color,
      length: 180,
      x: center - 60,
      y: center - 40,
    };
    set((s) => ({ layers: [...s.layers, laser], selectedId: id }));
  },

  addSign: (text = "FREE\nHUGS") => {
    const id = nextId("sign");
    const sign: SignLayer = {
      ...baseTransform("sign", "Sign", id),
      type: "sign",
      text,
      bgColor: "#ffd54a",
      textColor: "#222222",
      fontSize: 40,
      y: center + 80,
    };
    set((s) => ({ layers: [...s.layers, sign], selectedId: id }));
  },

  addText: (text = "wow") => {
    const id = nextId("text");
    const t: TextLayer = {
      ...baseTransform("text", "Text", id),
      type: "text",
      text,
      fill: "#ffffff",
      stroke: "#000000",
      fontSize: 64,
      fontFamily: "Impact, sans-serif",
    };
    set((s) => ({ layers: [...s.layers, t], selectedId: id }));
  },

  addEmoji: (emoji) => {
    const id = nextId("emoji");
    const e: EmojiLayer = {
      ...baseTransform("emoji", emoji, id),
      type: "emoji",
      emoji,
      fontSize: 96,
    };
    set((s) => ({ layers: [...s.layers, e], selectedId: id }));
  },

  addImageSticker: (src, naturalWidth, naturalHeight, name = "Sticker") => {
    const id = nextId("image");
    // Fit sticker to ~40% of the canvas on its longest side.
    const target = CANVAS_SIZE * 0.4;
    const scale = target / Math.max(naturalWidth, naturalHeight);
    const img: ImageLayer = {
      ...baseTransform("image", name, id),
      type: "image",
      src,
      naturalWidth,
      naturalHeight,
      scaleX: scale,
      scaleY: scale,
    };
    set((s) => ({ layers: [...s.layers, img], selectedId: id }));
  },
}));
