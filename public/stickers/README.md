# Sticker pack

These are the built-in stickers shown in the **Stickers** picker.

## Add your own

1. Drop a transparent **PNG** (or **SVG**) into this folder, e.g. `glasses.png`.
2. Add an entry to `manifest.json`:

   ```json
   { "id": "glasses", "name": "Cool glasses", "category": "Face", "src": "/stickers/glasses.png" }
   ```

3. Reload the app — it appears in the picker, grouped by `category`.

Tips:
- Transparent backgrounds look best (PNG with alpha, or SVG).
- Square-ish art is easiest to place; you can scale/rotate it on the canvas.
- You can also use the **Upload sticker** button to add a one-off image without
  editing this file (it won't persist between sessions).
