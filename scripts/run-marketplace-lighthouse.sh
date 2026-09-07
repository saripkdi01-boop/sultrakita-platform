#!/usr/bin/env bash
set -euo pipefail
ROOT="/home/ubuntu/sultrakita-platform/next-app"
OUT="/home/ubuntu/sultrakita-platform/qa/lighthouse"
PORT="${LIGHTHOUSE_PORT:-3100}"
mkdir -p "$OUT"
cd "$ROOT"
rm -f "$OUT"/*.json "$OUT"/*.html /tmp/suki-lighthouse-server.log
if command -v fuser >/dev/null 2>&1; then fuser -k "$PORT/tcp" >/dev/null 2>&1 || true; sleep 1; fi
npm start -- -p "$PORT" > /tmp/suki-lighthouse-server.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT
for attempt in {1..20}; do
  if curl -fsS "http://localhost:$PORT/marketplace" >/dev/null; then break; fi
  sleep 1
done
if ! curl -fsS "http://localhost:$PORT/marketplace" >/dev/null; then cat /tmp/suki-lighthouse-server.log; exit 1; fi
npx --yes lighthouse "http://localhost:$PORT/marketplace" --preset=desktop --output=json --output-path="$OUT/marketplace-desktop.json" --chrome-flags="--headless --no-sandbox" --quiet --no-enable-error-reporting
npx --yes lighthouse "http://localhost:$PORT/marketplace" --output=json --output-path="$OUT/marketplace-mobile.json" --chrome-flags="--headless --no-sandbox" --quiet --no-enable-error-reporting
node -e "const fs=require('fs'); for(const mode of ['desktop','mobile']){const x=JSON.parse(fs.readFileSync('/home/ubuntu/sultrakita-platform/qa/lighthouse/marketplace-'+mode+'.json')); const c=x.categories; console.log(mode, Object.fromEntries(Object.entries(c).map(([k,v])=>[k,Math.round(v.score*100)])));}"
