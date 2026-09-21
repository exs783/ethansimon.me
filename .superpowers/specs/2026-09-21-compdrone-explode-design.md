# CompDrone2025 scroll-driven exploded view

Date: 2026-09-21. Status: design approved in chat, awaiting spec review.

## Goal

A standalone page, `demos/compdrone-explode.html`, where scrolling pulls the real
CompDrone2025 CAD apart one subsystem at a time. Each subsystem gets a story panel
with a short first-person blurb, the real equations behind it, and links to the
real drawings and sim output. Linked from the CompDrone project card.

Success: a recruiter scrolling for under a minute sees the vehicle's real part
structure and at least one real calculation per subsystem that has one.

## Non-goals

- No edits to `index.html` beyond one link on the CompDrone card (done at plan time, not before).
- No autoplay, no scroll-hijacking, no video.
- No invented numbers, drawings, or part descriptions (site content policy).
- No new dependency for the rest of the site; libraries load on this page only.

## Decisions

| Question | Choice |
|---|---|
| Hero vehicle | CompDrone2025 (hexacopter VTOL) |
| Placement | Standalone `demos/compdrone-explode.html` |
| Per-part treatment | Story panel per subsystem (blurb + equations + figures + links) |
| Rendering | three.js renders the GLB; anime.js v4 `createTimeline` + `onScroll` drives it |
| Model source | `~/Desktop/Projects/VTOL/CompDrone2025.glb` (192 MB, 216 named nodes) |
| Look | Modernist system in `DESIGN.md`: Archivo, `#f3f2f2` ground, `#ec3013` accent, 2px rules, zero radius |

Rejected: `<model-viewer>` (no per-part transforms), pre-rendered frame sequence
(no interactivity, re-render per change; kept only as a fallback idea if phones
cannot handle the model).

## Asset pipeline

One-time script `scripts/build-explode-model.sh`, kept in the repo.

1. Input: the 192 MB source GLB, untouched.
2. `npx @gltf-transform/cli` pass: dedup, prune, Draco geometry, WebP textures.
   Do NOT run `join` or `flatten`; the existing `assets/compdrone2025.glb` (2.2 MB,
   16 meshes, mostly unnamed) shows that merging destroys the part names.
3. Output `assets/compdrone2025-parts.glb`, target under 5 MB, node names preserved.
4. Verify by re-reading the node list: every part number in the source still exists.

Known structure of the source: top node `CompDrone2025` with 26 subassembly
instances (6 `ARM-000-A-assembly`, 3 `LGR-000-A-assembly`, one `FRM-000-A-assembly`,
many `PAYLOAD-000-A-assembly`). Names repeat across instances, so code must group
by instance index / path and by part-number prefix, never by unique name.
Subsystem membership is by prefix (`FRM-`, `ARM-`, `BATT-`, `ELEC-`, `CAM-`,
`LGR-`, `PAYLOAD-`, plus `ELM-` mounts assigned to the subsystem they attach to),
not by tree position: `BATT-` and `ELEC-` parts were seen listed beside `FRM-`.
`CAM-` nodes were not seen in the first 70 named nodes; confirm they exist or
drop the CAM step.

## Scene

- three.js GLTFLoader with DRACOLoader; pinned versions from jsdelivr, page-only.
- Grayscale-leaning studio lighting; accent color used only for the active part
  highlight and leader lines.
- At load, record each subsystem group's rest position. Explode vector is
  outward from the airframe centroid: arms radial, battery/electronics along the
  stack axis, landing gear down. Distances tuned so groups do not intersect.
- The "current camera" node in the GLB is ignored; the page owns the camera.

## Choreography

One anime.js timeline, one segment per subsystem, scrubbed by `onScroll` on a
pinned stage. Order: FRM, ARM, BATT, ELEC, CAM (if present), LGR, PAYLOAD, then a
wide "all apart" shot.

Each segment: previous subsystem eases back and dims; active one lifts out and
takes the accent highlight; camera glides to frame it; a leader line draws to its
label; the matching panel fades in. Scroll position is the single source of truth,
so scrolling back reverses cleanly. Verify the exact anime.js v4 scroll API
(`onScroll` sync/`createTimeline` options) against the installed version at
implementation time, not from memory.

## Content model

`demos/compdrone-explode.content.json`, one entry per subsystem:
`id`, `title`, `parts[]` (GLB part numbers), `blurb`, `equations[]` (MathML
strings), `figures[]` (path + caption), `links[]` (label + href).

- Blurbs: Mission Model voice: direct, first person, mechanism first, why the
  choice was made, no marketing filler.
- Equations: native MathML in `.eqn-block`, one relation per line, taken only from
  Ethan's own calcs/scripts (`Desktop/VTOL/Mission-Model-Scripts`, sim output,
  drawings he supplies).
- Figures and links point at real files or pages only. Anything that cannot be
  sourced from his files is omitted and reported back to him, never invented.
- Changing copy never touches animation code.

## Fallbacks and accessibility

- `prefers-reduced-motion`: no scrubbing; each subsystem is a static step with
  parts already apart.
- Phone: stage pinned to the top half, panels scroll below, lower pixel ratio cap.
- Keyboard/screen reader: panels are real headings and the story reads fully
  without the canvas. Canvas is `aria-hidden` with a text alternative describing
  the exploded assembly.
- No WebGL or model load failure: show `assets/compdrone2025-render.webp` plus the
  panels as a plain page. No blank screen.
- Load: poster is the existing render while the model streams.

## Testing

- `scripts/check-explode-content.py` (stdlib only; reads the GLB JSON chunk, and for a Draco file the node names are still in that chunk): every part number in
  `content.json` exists in the GLB; every subsystem present in the GLB has an entry.
- Headless Chrome check: page loads, canvas is non-blank, scrolling to each panel
  puts the right subsystem in its exploded state. Screenshot each stop for review.
- Manual: reduced-motion, phone width, WebGL-disabled fallback.

## Open items

1. Content from Ethan: per-subsystem drawings, sims, calcs (folder convention to be
   agreed at plan time).
2. Whether `CAM-` parts exist in the GLB.
3. Output GLB size after Draco/WebP; if over budget, decimate the largest
   purchased-part meshes (motors, battery, Pixhawk) first.
4. Peak memory of `gltf-transform` on the 192 MB input; disk is 27 GB free, fine.

## Repo hygiene

Not committed or pushed (user rule: ask first; `main` deploys to GitHub Pages).
Spec lives in `.superpowers/specs/` because a `docs/` folder would be published.
