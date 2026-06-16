/** Read an image File into a data URL plus its natural pixel dimensions. */
export function readImageFile(
  file: File
): Promise<{ src: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const src = reader.result as string;
      const img = new window.Image();
      img.onload = () =>
        resolve({ src, width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => reject(new Error("Could not decode image"));
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

/** Load an image url and resolve its natural dimensions (for built-in stickers). */
export function measureImage(
  src: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth || 200, height: img.naturalHeight || 200 });
    img.onerror = () => reject(new Error("Could not load image: " + src));
    img.src = src;
  });
}
