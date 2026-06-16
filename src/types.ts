// Layer model for the editor. Every layer shares a common transform; the `type`
// discriminator carries the type-specific props. Render order = array order in the
// store (index 0 is drawn first / bottom-most).

export type LayerType = "base" | "laser" | "sign" | "text" | "emoji" | "image";

export interface BaseTransform {
  id: string;
  type: LayerType;
  name: string;
  visible: boolean;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
}

/** The uploaded photo. There is at most one base layer, always at the bottom. */
export interface BaseImageLayer extends BaseTransform {
  type: "base";
  src: string; // data URL
  /** natural pixel size of the source image, used for fit-to-canvas math */
  naturalWidth: number;
  naturalHeight: number;
}

export type LaserColor = "red" | "green" | "blue" | "pink";

/** A drawn laser-eye beam (cone + glow). Add two, one per eye. */
export interface LaserLayer extends BaseTransform {
  type: "laser";
  color: LaserColor;
  /** beam length in canvas px (before scale) */
  length: number;
}

/** A drawn "pancarte" placard on a stick with editable text. */
export interface SignLayer extends BaseTransform {
  type: "sign";
  text: string;
  bgColor: string;
  textColor: string;
  fontSize: number;
}

/** Freeform text label with optional outline. */
export interface TextLayer extends BaseTransform {
  type: "text";
  text: string;
  fill: string;
  stroke: string;
  fontSize: number;
  fontFamily: string;
}

/** A Unicode emoji rendered large. */
export interface EmojiLayer extends BaseTransform {
  type: "emoji";
  emoji: string;
  fontSize: number;
}

/** A PNG sticker (built-in pack or user upload). */
export interface ImageLayer extends BaseTransform {
  type: "image";
  src: string; // url or data URL
  naturalWidth: number;
  naturalHeight: number;
}

export type Layer =
  | BaseImageLayer
  | LaserLayer
  | SignLayer
  | TextLayer
  | EmojiLayer
  | ImageLayer;

export interface StickerManifestEntry {
  id: string;
  name: string;
  category: string;
  src: string;
}
