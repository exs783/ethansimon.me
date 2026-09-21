#!/usr/bin/env bash
# Compress the per-part CompDrone2025 GLB, keeping every node name (no join/flatten).
set -euo pipefail
SRC="${1:-$HOME/Desktop/Projects/VTOL/CompDrone2025.glb}"
OUT="$(dirname "$0")/../assets/compdrone2025-parts.glb"
T="$(mktemp -d)"
G="npx --yes @gltf-transform/cli"
$G dedup   "$SRC"      "$T/a.glb"
$G prune   "$T/a.glb"  "$T/b.glb"
$G webp    "$T/b.glb"  "$T/c.glb" --slots "*"
$G draco   "$T/c.glb"  "$OUT"
ls -lh "$OUT"
