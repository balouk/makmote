import { useEffect, useState } from "react";

/**
 * Load an HTMLImageElement from a url or data URL for use as a Konva <Image>.
 * Returns null until loaded. crossOrigin="anonymous" keeps the canvas
 * untainted so export (toBlob) keeps working for same-origin/public assets.
 */
export function useImage(src: string | undefined): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) {
      setImage(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    let cancelled = false;
    img.onload = () => {
      if (!cancelled) setImage(img);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return image;
}
