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
- **Detail view**: back link, title + tag, lede paragraph, optional amber
  caution block (Liquid Rocket's valve-control caveat), then three labeled
  sections — Method (prose, real technical explanation), Outcome (a bigger
  version of the tile's chart, captioned), Numbers (a 2-column fact grid).
  Ends in a CTA to the real GitHub repo.
- **Pill nav**: fixed bottom-center, dark pill, two buttons, active state is
  a white sub-pill. Never scrolls out of view.

## Charts (all inline SVG, generated in JS, no library)

- `arDialFigure` — semicircle dial, fixed left/mid/right tick positions,
  needle via `rotate()`. (Ticks and needle must share one angle convention —
  a mismatch here was a real bug in the prior direction's build.)
- `heatmapFigure` — the actual (cl × AR) energy grid `wing_optimizer.py`
  searched, gamma-compressed grayscale, accent-colored ring at the found
  optimum.
- `scopeFigure` — deterministic pseudo-random trace standing in for a real
  vibration waveform shape (seeded, not literally the decoded log samples).
- `flowFigure` — a 3-box pipeline diagram (Teensy → sensors.py → main.py)
  plus a 3-tab strip, for Liquid Rocket's architecture.
- `blankFigure` — dashed empty-state box, "NO FILES YET", for CAD.

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
