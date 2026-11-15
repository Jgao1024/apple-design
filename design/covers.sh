#!/usr/bin/env bash
# Renders the index-card pictures: design/.covers/*.html (built by ./design/build.sh) are screenshotted
# at 1200x675 and saved as JPG into design/pages/assets/covers/, which the cards point at.
#
# Usage: ./design/covers.sh
set -euo pipefail
cd "$(dirname "$0")"

CHROME=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
[ -x "$CHROME" ] || { echo "chrome not found: $CHROME" >&2; exit 1; }

./build.sh >/dev/null
mkdir -p pages/assets/covers
PROFILE="$PWD/.chrome-tmp"

for file in .covers/*.html; do
  name=$(basename "$file" .html)
  "$CHROME" --headless=new --no-sandbox --disable-gpu --disable-breakpad --disable-crash-reporter \
    --no-first-run --no-default-browser-check --hide-scrollbars --force-device-scale-factor=1 \
    --user-data-dir="$PROFILE" --window-size=1200,675 \
    --screenshot="$PWD/pages/assets/covers/$name.png" "file://$PWD/$file" 2>/dev/null
  sips -Z 960 "$PWD/pages/assets/covers/$name.png" >/dev/null
  sips -s format jpeg -s formatOptions 82 "$PWD/pages/assets/covers/$name.png" \
    --out "$PWD/pages/assets/covers/$name.jpg" >/dev/null
  rm -f "$PWD/pages/assets/covers/$name.png"
  echo "pages/assets/covers/$name.jpg"
done
