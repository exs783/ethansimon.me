# Design

<!-- impeccable:design-schema 1 -->

## Direction

Redesign, user-pinned: a "Modernist" design system pulled from a Claude
Design canvas project (`claude.ai/design`, project
`db6ac8f0-9726-460b-adf8-af38389fa281`, file `Personal Website.dc.html`).
The user asked to match that canvas's style while keeping this site's own
real content — not the canvas's fictional "J. Rivera" placeholder bio and
projects.

Flat, architectural, set entirely in Archivo: a near-mono red accent on a
warm off-white ground, a visible modular grid, zero corner radius anywhere,
strong 2px divider rules, flush-left labels (never centered, even inside
wide buttons), and grayscale-only photography. Nothing floats and nothing
is decorated — alignment and the strength of the dividers do the
organizing.

Kept from the reference canvas: sticky top nav, a big bold hero statement,
a scroll-driven horizontal "reel" of project frames pinned full-viewport
while the track shifts sideways, per-project detail sections below the
reel, a dark near-black résumé/contact CTA band, zero-radius flat buttons
and tags.

Not kept: the canvas's own fictional content (bio, project list, headshot)
and its Design-Canvas-editor-specific templating (`{{ }}` expressions,
`sc-for` loops, `<image-slot>`, the `DCLogic` component framework,
`support.js`/`image-slot.js`) — none of that is deployable to a static
host, so the whole page was rebuilt as plain dependency-free HTML/CSS/JS.
Also dropped: the reference's non-functional mock contact form, replaced
with real mailto/LinkedIn/GitHub links, per this site's own content policy
of never showing a control that doesn't actually do anything.

Superseded: the previous kenjpena.com-pinned near-monochrome direction
(pill nav, soft-shadow cards, Inter/IBM Plex Mono, blue accent — see git
history for its DESIGN.md) — replaced wholesale, not polished, per
new-work.md's redesign rule.

## Palette

| Token | Hex | Role |
|---|---|---|
| `--color-bg` | `#f3f2f2` | page ground |
| `--color-surface` | `#eae9e9` | card / figure-card fill |
| `--color-text` | `#201e1d` | primary text |
| `--color-accent` | `#ec3013` | the one accent — category tags, focus ring, chart accent marks; used sparingly |
| `--color-divider` | `color-mix(in srgb, #201e1d 40%, transparent)` | 2px section rules, card borders |
| `--color-neutral-100…900` | OKLCH tonal ramp | tag fills, muted text, the dark résumé band (`--color-neutral-900`) |

Mono scheme: one accent, used sparingly (tags, focus rings, a handful of
chart marker dots) — primary CTA buttons deliberately use ink
(`--color-neutral-900`) rather than the accent, matching the reference
canvas's own local override of the design system's default red-fill
primary button. Single light theme, zero radius everywhere
(`--radius-md: 0`), matching the reference exactly.

Legacy alias tokens `--ink`/`--ink-2`/`--line`/`--accent` map onto this
palette so every existing chart-generation function (`missionProfileFigure`,
`attitudeTrackFigure`, etc. — all of which read colors live via
`getComputedStyle` rather than hardcoding hex) repaints correctly with zero
changes to their drawing code.

## Type

- **Archivo** (400/600/800) — everything, heading and body alike, per the
  Modernist system. Weight 800 for all headings, 400 for body.

## Components

- **Nav**: sticky top, brand wordmark left, text links (Projects/About/
  Skills/Contact) plus one outlined LinkedIn button, 2px bottom divider.
- **Hero**: large bold headline + tagline, two CTAs (primary ink button to
  the reel, secondary outlined GitHub link), a real grayscale-filtered
  headshot photo (bordered, zero radius, matching the figure-card treatment).
- **Reel**: `#reel` is a tall (260vh) scroll track; `.reel-sticky` pins at
  `position: sticky; top:0; height:100vh` while JS (`onReelScroll`)
  computes scroll progress through that tall track and applies
  `translateX` to `.reel-track`, hand-ported from the reference canvas's
  own `componentDidMount()`/`onScroll` logic (no framework). Sprocket-hole
  bars (`radial-gradient` repeating background) top and bottom of the dark
  reel body, matching the canvas's film-reel conceit. 5 real project
  frames (down from the canvas's 8 fictional ones), each linking to its
  detail section anchor and reusing that project's existing tile-emblem
  chart function as its thumbnail.
- **Detail sections**: one per project, `scroll-margin-top` so the sticky
  nav doesn't cover the anchor target. Same Overview/Method/Outcome/Numbers
  structure as the prior direction, restyled flush-left with the
  Modernist figure-card/eqn-block/factgrid components instead of the prior
  soft-shadow cards.
- **About / Skills / Résumé band / Contact / Footer**: new sections not
  present in the prior direction's IA, matching the reference canvas's page
  structure. Résumé band and contact are merged into one section (see
  Content policy below): a single blurb line plus large `.btn-lg`
  LinkedIn/GitHub/email/Resume links — the Resume link now points to a
  real PDF (`assets/Ethan_Simon_Resume.pdf`), no longer omitted.

## Charts

Unchanged from the prior direction — every chart-generation function
(`missionProfileFigure`, `wingPlanformFigure`, `heatmapFigure`,
`bendingReliefFigure`, `nacaAirfoilFigure`, `attitudeTrackFigure`,
`scopeFigure`, `flowFigure`, `sensorPanelFigure`, `groupedBarFigure`,
`hbarFigure`, `missionCourseFigure`) carried over byte-for-byte from the
kenjpena-era build. They already read every color through
`getComputedStyle(document.documentElement)` rather than hardcoding hex,
so repointing the `--ink`/`--ink-2`/`--line`/`--accent` aliases at the
Modernist palette was the only change needed for them to repaint
correctly.

## CAD assets (real media, not generated)

Unchanged from the prior direction: `assets/compdrone2025.glb` (real
CompDrone2025 SolidWorks assembly, Draco+WebP compressed to ~2.2MB),
`assets/compdrone2025-render.png` (real product render, reel thumbnail),
`assets/tylok-fatigue-machine.jpg` (real photo of the ASTM F1387 A6
machine, grayscale-filtered per the Modernist system's photography rule).

## Layout

Full-bleed sections (no centered max-width container, unlike the prior
direction) with `clamp()`-based side padding — matches the reference
canvas's edge-to-edge modular-grid feel. Facts render as a 2-column
`factgrid` with divider rules between cells rather than the prior
direction's soft cards. Figures live inside `.figure-card` (divider
border, surface fill, zero radius).

## Content policy

Unchanged: every number on the page is real, sourced from an actual repo,
test run, or data file. CAD stays honest; the contact section offers only
real, reachable links. The hero headshot is now a real photo
(`assets/ethan-simon-headshot.jpg`, grayscale-filtered per the Modernist
system's photography rule) rather than the earlier "Photo on request"
placeholder — supersedes the prior empty-state approach now that a real
photo is on hand.
