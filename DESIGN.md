# Design

<!-- impeccable:design-schema 1 -->

## Direction

Redesign, user-pinned: https://www.kenjpena.com. Concept-seed's direction
search was skipped per new-work.md ("a user- or brief-pinned direction beats
the roll, always") — the reference itself supplies the visual world.

Kept from the reference: near-monochrome light ground, restrained color (one
accent used only for an interactive marker), a floating pill nav
(Work/About) fixed bottom-center, big confident type with generous
whitespace, soft-shadow cards with no heavy chrome, an About page pairing a
short lede paragraph with a plain two-column timeline.

**Haptic pass** (user-pinned reference: ciridae.com, scoped deliberately):
that reference is dark/cinematic with particle-constellation animation and
text-scramble reveals — none of that carried over, by explicit user choice
(asked directly: keep the light kenjpena-era palette, borrow only the
tactile *feel*). What did carry over: a subtle film-grain texture
(`body::before`, SVG feTurbulence, 3.5% opacity, multiply blend) so flat
color fields read as slightly physical instead of flat-digital; a magnetic
hover pull on tiles/buttons (`addMagneticHover()`, a few px toward the
cursor via `--mx`/`--my` custom properties); a spring/overshoot easing
(`cubic-bezier(.34,1.56,.64,1)`) on hover and press transforms instead of
linear/ease; a `:active` press-down state (`--press` scaled down) on every
clickable surface. All gated behind `prefers-reduced-motion`.

Adapted for this content: the reference's product screenshots become real
data visualizations (an aspect-ratio dial, an oscilloscope trace, a
flow diagram, a heatmap of an actual optimizer search) since the subject is
engineering outcomes, not UI work. Added a third "detail" view (Method /
Outcome / Numbers) per project, since the brief asked to show both the
result and the framework behind it — the reference's own site presumably
does this via per-project pages; this single-page build does it via an
in-place view swap instead, to stay a static site with no router.

Superseded: the previous instrument-panel/stencil-placard direction (see
git history for its own DESIGN.md if needed) — replaced wholesale, not
polished, per new-work.md's redesign rule ("replace the old visual world
rather than polishing it").

## Palette

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#f4f4f5` | page ground |
| `--card` | `#ffffff` | tile / dialog surface |
| `--card-border` | `#e7e7ea` | card border |
| `--ink` | `#18181b` | primary text, pill nav, dark UI elements |
| `--ink-2` | `#6b6b70` | secondary text |
| `--ink-3` | `#a3a3a8` | tertiary / label text |
| `--line` | `#e2e2e5` | hairline rules, chart gridlines |
| `--accent` | `#3355ff` | the one saturated color — marks the found optimum on the Mission Model heatmap only |

Restrained strategy: neutrals plus one accent, used exactly once as a
marker, never as a UI color. Single light theme, no dark mode — matches the
reference's own commitment.

## Type

- **Inter** (400/500/600/700) — everything: headings, body, nav, links.
  Matches the reference's own single-family restraint; a characterful
  display face would work against the "quiet, get out of the way" brief.
- **IBM Plex Mono** (400/500/600) — all data: chart axis labels, fact
  values, code identifiers (`wing_optimizer.py`, `--objective combined`),
  the section eyebrows (METHOD / OUTCOME / NUMBERS).

## Components

- **Masthead**: name + role, GitHub link. No nav bar — navigation lives only
  in the floating pill.
- **Work tile** (`.tile`): name + category/year eyebrow, a real inline-SVG
  chart, a mono headline stat + a plain-text sub-stat. Hover lifts 2px with
  a soft shadow. The CAD tile is `.muted` — no hover, no click, a dashed
  empty-state chart instead of a real one.
- **Detail view**: a bordered pill "← back to work" button (not a bare text
  link — it needs to read as clickable at a glance), title + tag, lede
  paragraph, optional amber caution block (Liquid Rocket's valve-control
  caveat), then four labeled sections — Overview (plain-language: what the
  project is and who it's for), Method (prose, real technical explanation
  of how it works), Outcome (one or more real charts, each in its own
  `.figure-card`, optionally titled — Mission Model has three: the search
  heatmap, a before/after wing-area bar chart across all 3 tiers, and a
  12-vehicle fleet hover-time bar chart), Numbers (a 2-column fact grid).
  Ends in a CTA row: a live demo link where one exists, always a link to the
  real GitHub repo.
- **Routing**: hash-based (`#work`, `#about`, `#project/<id>`), read/written
  by one `route()` function on `hashchange` plus once on load — so the
  browser's own back/forward buttons work between the work grid, About, and
  a project detail, not just the in-page back button. Every nav action
  (pill click, tile click, back button) sets `location.hash` and lets the
  hashchange handler do the actual rendering, rather than each control
  managing view state itself.
- **Live demos** (`demos/log-dashboard.html`, `demos/liquid-rocket.html`):
  not new builds — the actual project frontends, adapted for static
  hosting. `log-dashboard.html` is the real `log_dashboard.html` with its
  Flask `/api/upload` call replaced by a `fetch()` of `flight-analysis.json`,
  which is the literal output of running the real `python_backend.py`'s
  `run_analysis()` against the real sample flight log — same charts, same
  flight-quality verdict, no reimplementation. `liquid-rocket.html` is a
  from-scratch JS port of `ground_station/`'s `sensors.py` (wire protocol +
  fake-source random walk), `svg_widgets.py` (gauge/valve SVG generation),
  and `main.py`'s three-tab structure, since a PyQt6 desktop app can't run
  in a browser at all — this one had no static-adaptation shortcut
  available, so fidelity to the real Python logic was the goal instead.
- **Pill nav**: fixed bottom-center, dark pill, two buttons, active state is
  a white sub-pill. Never scrolls out of view.

## Charts (all inline SVG, generated in JS, no library)

- `heatmapFigure` — the actual (cl × AR) energy grid `wing_optimizer.py`
  searched, gamma-compressed grayscale, accent-colored ring at the found
  optimum.
- `groupedBarFigure` — fixed pair of bars per group (gray=old, black=new)
  plus an accent-colored delta label; used for the 3-tier wing-area
  before/after comparison.
- `hbarFigure` — sorted horizontal bars with a value label. The value label
  is right-anchored to a fixed column (`x = W - 4, text-anchor: end`), not
  placed just past the bar's own end — anchoring it relative to bar length
  let the longest bar's label run past the viewBox's right edge, a real
  clipping bug caught in review.
- `scopeFigure` — deterministic pseudo-random trace standing in for a real
  vibration waveform shape (seeded, not literally the decoded log samples).
  `droneScopeFigure` overlays a small quadcopter glyph on it for the Log
  Dashboard *tile* emblem, naming the subject (a drone flight log) instead
  of leaving a generic waveform to speak for itself.
- `flowFigure` — a 3-box pipeline diagram (Teensy → sensors.py → main.py)
  plus a 3-tab strip, for Liquid Rocket's *architecture* (kept in the
  detail Outcome section).
- `missionProfileFigure` — the Mission Model tile emblem: an altitude-vs-
  distance silhouette of the actual leg sequence `Mission_Model.py`
  simulates (short/long/short cruise legs with landing dots) — replaced a
  generic AR gauge that didn't name the mission itself.
- `rocketFigure` — the Liquid Rocket tile emblem: a rocket silhouette with
  an accent-colored flame, naming the domain (hot-fire propulsion testing)
  rather than the code architecture, which `flowFigure` already covers in
  the detail view.
- `blankFigure` — the CAD tile/detail emblem: a dashed isometric wireframe
  block, "NO FILES YET" — reads as "a CAD model" while staying honestly
  unfilled/dashed, not a fabricated render.

Emblem-vs-chart split: each project's *tile* emblem now names its subject
(mission profile, rocket, drone) while richer real-data charts (heatmap,
bar charts, waveform, architecture diagram) live in the detail view's
Outcome section — the tile is a symbol, the detail page is the evidence.

## Layout

Single column, `max-width: 1080px`, generous top/bottom padding. Work view
is a 2-column tile grid (`repeat(2, 1fr)`, 1 column under 720px). Detail
figures are capped at `max-width: 460px` inside their card regardless of
card width — a 300×200 viewBox chart at 100% width with no cap was a real
bug (the chart filled almost the whole viewport height on a wide card).

## Content policy

Unchanged from the prior direction: every number is real, sourced from an
actual repo, test run, or data file. CAD stays an honest empty state, not a
fabricated screenshot.
