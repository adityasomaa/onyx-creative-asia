#!/usr/bin/env bash
# Generate a short Y2K monochrome abstract loop for a portfolio cover.
#
# Three pre-baked patterns, parameterised so each project gets a distinct
# loop while staying tonally consistent ("Black Box" mono editorial).
# Output: <slug>.mp4 (H.264, 1280×720, ~6s) + <slug>.webp (first-frame poster).
#
# Usage:
#   scripts/generate-y2k-loop.sh <slug> <pattern>
#
# Patterns:
#   ripple    — concentric ripples expanding from centre (architectural)
#   scan      — horizontal CRT scanlines + slow data pulse (technical)
#   mercury   — diagonal liquid-metal flow (organic/luxe)
#
# Examples:
#   scripts/generate-y2k-loop.sh great-bali-properties     ripple
#   scripts/generate-y2k-loop.sh radcruiters               scan
#   scripts/generate-y2k-loop.sh the-hair-extensions-bali  mercury
#
# To loop perfectly the time-component multiplier is 2π/duration ≈ 1.0472
# for a 6-second clip. Change the geq formula if you want a different
# pattern, but keep the multiplier for clean looping.

set -euo pipefail

SLUG="${1:-}"
PATTERN="${2:-}"

if [ -z "$SLUG" ] || [ -z "$PATTERN" ]; then
  echo "Usage: $0 <slug> <ripple|scan|mercury>" >&2
  exit 1
fi

OUT_DIR="public/projects"
mkdir -p "$OUT_DIR"

case "$PATTERN" in
  ripple)
    GEQ="lum='90+60*sin(hypot(X-W/2,Y-H/2)*0.012 - T*1.0472)+25*sin(T*1.0472*2)':cb=128:cr=128"
    ;;
  scan)
    GEQ="lum='if(lt(mod(Y,6),1),200-Y*0.06,30+15*sin(T*1.0472*4+X*0.008))+40*sin(T*1.0472)':cb=128:cr=128"
    ;;
  mercury)
    GEQ="lum='100+55*sin((X*0.004+Y*0.0025)*PI+T*1.0472)+45*cos(Y*0.006+T*1.0472*0.6)':cb=128:cr=128"
    ;;
  *)
    echo "Unknown pattern: $PATTERN (choose ripple, scan, or mercury)" >&2
    exit 1
    ;;
esac

# Pick ffmpeg from PATH or known WinGet location
FFMPEG="$(command -v ffmpeg || true)"
if [ -z "$FFMPEG" ] && [ -x "/c/Users/User/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe" ]; then
  FFMPEG="/c/Users/User/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe"
fi
if [ -z "$FFMPEG" ]; then
  echo "ffmpeg not found on PATH" >&2
  exit 1
fi

echo "→ generating $OUT_DIR/$SLUG.mp4 with $PATTERN pattern"
"$FFMPEG" -y -f lavfi -i "nullsrc=s=1280x720:d=6:r=24" \
  -vf "geq=$GEQ,format=yuv420p" \
  -t 6 -c:v libx264 -preset slow -crf 28 -movflags +faststart -an \
  "$OUT_DIR/$SLUG.mp4" >/dev/null 2>&1

echo "→ generating $OUT_DIR/$SLUG.webp (first-frame poster)"
"$FFMPEG" -y -ss 0 -i "$OUT_DIR/$SLUG.mp4" -frames:v 1 -c:v libwebp -quality 75 \
  "$OUT_DIR/$SLUG.webp" >/dev/null 2>&1

ls -lh "$OUT_DIR/$SLUG.mp4" "$OUT_DIR/$SLUG.webp"
echo "✔ done — wire up in src/lib/data.ts:"
echo "    cover:     '/projects/$SLUG.webp',"
echo "    coverLoop: '/projects/$SLUG.mp4',"
