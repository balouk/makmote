# 🛠️ Makmote

A **local** web app to turn a photo into a funny **Slack custom emoji** — add laser
eyes, a "pancarte" sign with text, big text, Unicode emoji, and stickers, then export
a Slack-ready PNG. Everything runs in your browser; your photos never leave your machine.

Inspired by [bufo.fun](https://github.com/tfritzy/bufo.fun), but as an *editor*.

> Status: **Part 1 — fixed (static) emojis.** The GIF maker is planned next.

## Run it

```bash
pnpm install
pnpm dev
```

Vite opens `http://localhost:5173` automatically.

## How to use

1. **Upload photo** — your base image (scaled to fill the square canvas). Uploaded
   photos are remembered for the session under **🕑 Recent**, so you can reuse the
   same image without re-uploading (kept in your browser only, gone when the tab closes).
2. Add overlays from the toolbar:
   - **Laser eyes** — drawn beams; drag one onto each eye, rotate to aim, pick a color.
   - **Sign** — a placard on a stick; edit the text/colors in the Properties panel.
   - **Text** — meme-style outlined text.
   - **Emoji** — pick a Unicode emoji.
   - **Stickers** — built-in pack (crown, sunglasses, hats…) or **Upload sticker**.
     Uploaded stickers are remembered for the session under **Your uploads** in the
     picker, so you can reuse them without re-uploading (✕ to remove one).
3. **Drag / resize / rotate** any layer with the on-canvas handles.
   `Delete` removes the selection · `Cmd/Ctrl+D` duplicates · `Esc` deselects.
4. Tweak the selected layer in **Properties** — every layer has an **Opacity** slider,
   and the photo has a **Red tint** (color + strength) to wash it red for that
   laser-eyes glow.
5. Use the **Layers** panel to reorder (⬆️⬇️), hide (👁️), or delete (❌).
6. **Export** at 128×128 (Slack's size). The panel shows the file size and warns if
   it's over Slack's 128 KB limit, then **Download PNG**.

## Add your own stickers

Drop transparent PNG/SVG files into `public/stickers/` and list them in
`public/stickers/manifest.json`. See `public/stickers/README.md` for details.

## Slack custom emoji limits

128×128 px recommended · **max 128 KB** · PNG / JPG / GIF.

## Tech

Vite · React · TypeScript · [react-konva](https://konvajs.org/) (canvas editor) · zustand (state).

## Build

```bash
pnpm build      # type-check + production build into dist/
pnpm preview    # serve the production build
```
