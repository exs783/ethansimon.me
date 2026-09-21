# CompDrone2025 Exploded View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `demos/compdrone-explode.html`, a scroll-driven exploded view of the real CompDrone2025 CAD, one subsystem per story panel.

**Architecture:** A one-time script compresses the 192 MB per-part GLB (Draco + WebP, no join/flatten). The page loads it in three.js, groups nodes by part-number prefix, and drives per-group offsets with one anime.js timeline scrubbed by `onScroll`. Panel copy comes from a JSON file; panels render only fields that exist.

**Tech Stack:** three.js + GLTFLoader/DRACOLoader, anime.js v4 (both from cdn.jsdelivr.net, this page only), `@gltf-transform/cli` via npx, stdlib Python for checks, static HTML/CSS/JS.

**Spec:** `.superpowers/specs/2026-09-21-compdrone-explode-design.md`

## Global Constraints

- Every number, equation, figure and link on the page is real and sourced from Ethan's files. Nothing invented; a missing field is omitted, not filled.
- Style: Archivo, `#f3f2f2` ground, `#201e1d` text, `#ec3013` accent (highlights/leader lines only), 2px dividers, zero radius, flush-left labels.
- No autoplay; scroll position is the only source of truth.
- Do not run gltf-transform `join` or `flatten`.
- `prefers-reduced-motion`, phone layout, and WebGL-failure fallback all required.
- Libraries load from cdn.jsdelivr.net on this page only; `index.html` is not modified in this plan.
- Push to `main` deploys to GitHub Pages; only push after checks pass.

---

### Task 1: Compressed per-part model

**Files:**
- Create: `scripts/build-explode-model.sh`
- Create: `assets/compdrone2025-parts.glb`
- Create: `scripts/check-explode-content.py`

**Interfaces:**
- Produces: `assets/compdrone2025-parts.glb` with named nodes; `check-explode-content.py <glb> <content.json>` exits 0 iff every part number in the JSON exists in the GLB.

- [ ] Write `check-explode-content.py` (reads GLB JSON chunk, prints node-name counts by prefix, validates content parts).
- [ ] Write and run `build-explode-model.sh` (dedup, prune, draco, webp; no join/flatten).
- [ ] Confirm output size and that all prefixes present in source are present in output.
- [ ] Commit.

### Task 2: Content file (real facts only)

**Files:**
- Create: `demos/compdrone-explode.content.json`

**Interfaces:**
- Consumes: part-number list from Task 1 check output.
- Produces: array of `{id, title, prefixes[], parts[], blurb?, equations?[], figures?[], links?[]}`; page treats `blurb/equations/figures/links` as optional.

- [ ] Generate `parts` per subsystem from the GLB (unique part numbers, instance counts).
- [ ] Run the check script against it; expect exit 0.
- [ ] Commit.

### Task 3: Page

**Files:**
- Create: `demos/compdrone-explode.html`

**Interfaces:**
- Consumes: GLB (Task 1), content JSON (Task 2).
- Produces: pinned stage + panels; `window.__explode = { progress(): number, active(): string }` for the headless check.

- [ ] Layout + CSS in site style; panels rendered from JSON.
- [ ] three.js scene, grouping by prefix, rest positions, explode vectors.
- [ ] anime.js timeline + `onScroll`; camera framing; leader line.
- [ ] Reduced-motion, phone, no-WebGL fallbacks.
- [ ] Commit.

### Task 4: Verify in a real browser

- [ ] Serve locally, load in Chrome, screenshot each panel stop, confirm canvas non-blank and `__explode.active()` matches the panel.
- [ ] Check reduced-motion and narrow width.
- [ ] Fix defects found; re-run.

### Task 5: Publish

- [ ] Run the check script one last time.
- [ ] Commit, `git push origin main` (user authorized).
- [ ] Confirm the deployed URL loads the model.
