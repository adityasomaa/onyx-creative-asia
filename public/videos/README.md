# Hero video assets

Drop these three files in this folder to power the home hero:

| File | Purpose | Specs |
|---|---|---|
| `hero.mp4` | Universal H.264 video (Safari, all browsers) | 1920×1080, 24fps, ~3 MB target |
| `hero.webm` | VP9/AV1 fallback (Chrome/Firefox, ~30% smaller) | Same resolution, ~2 MB target |
| `hero-poster.jpg` | First-frame still — instant first paint | 1920×1080, WebP or JPG, ~50 KB |

The video tag automatically picks WebM first, falls back to MP4 if unsupported.

If files are missing the section still renders (black background + headline + scroll cue) — no broken-state UI.

## Compress workflow

### Option A — ffmpeg (one-liner per format)

```bash
# MP4 (H.264) — universal
ffmpeg -i source.mp4 -c:v libx264 -preset slow -crf 28 \
  -vf "scale=1920:-2,fps=24" -an -movflags +faststart hero.mp4

# WebM (VP9) — smaller, modern browsers
ffmpeg -i source.mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 \
  -vf "scale=1920:-2,fps=24" -an hero.webm

# Poster (single frame at t=0)
ffmpeg -i source.mp4 -vframes 1 -q:v 3 hero-poster.jpg
```

Notes:
- `-an` strips audio (we don't need it — video is muted anyway, saves bytes)
- `-movflags +faststart` puts MP4 metadata at the front so playback starts before the whole file is downloaded
- `-crf 28` for H.264 / `-crf 32` for VP9 are good balance points; lower = higher quality + bigger file

### Option B — Handbrake (GUI)

1. Open source video → Preset: **Web → Vimeo YouTube HQ 1080p30**
2. Video tab: Encoder `H.264`, Quality `RF 26`, Framerate `24`
3. Audio tab: remove all tracks
4. Filename: `hero.mp4` → start

## Sizing target

Total of all three files combined: **<5 MB**. Lighter is better for mobile; we already serve a poster image as the first paint, so video is for atmosphere only — being on the small side is fine.
