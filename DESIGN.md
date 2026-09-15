# Design

<!-- impeccable:design-schema 1 -->

## Direction

A small aircraft's night instrument panel. Chosen via concept-seed direction
search (mode: experience) against PRODUCT.md — assigned candidate #6 from a
self-authored list of 7 aerospace/engineering visual worlds (aircraft
placard/stencil systems) was beaten on both audience-identification and
product-clarity axes by catalog challenger `signals-instruments-night-flight-
six-pack`, which became the actual build. One raise was borrowed back from
the assigned direction: project identifiers ride on riveted hazard-yellow
stencil placards, so the panel reads as cataloged real hardware rather than
a generic dashboard mockup.

Each project is an instrument with one real number, not a card with a
description — the panel's whole mechanism.

## Palette

| Token | Hex | Role |
|---|---|---|
| `--panel` | `#0a0c0a` | page ground, matte near-black |
| `--panel-2` | `#0f1512` | masthead / dialog surface |
| `--bezel` | `#171f1a` | instrument card surface |
| `--hairline` | `#2c3a30` | borders, dividers |
| `--ink` | `#d7d9d4` | primary text |
| `--ink-dim` | `#8a8f86` | secondary text |
| `--ink-faint` | `#5c635d` | muted / blanked-instrument text |
| `--phosphor` | `#8fffb0` | primary readout glow, section labels |
| `--amber` | `#f5c518` | stencil placards, needles, caution lamps |
| `--caution` | `#ff4d4d` | reserved — closed-valve/error states only |

Single-theme, deliberately: this is a committed dark instrument panel, not a
light/dark toggle surface. Background and every text color are painted
explicitly so the page holds regardless of host theme.

## Type

- **Big Shoulders Stencil Text** (600/700) — nameplate, instrument placards.
  The direction's one borrowed identity mark; used nowhere else.
- **IBM Plex Sans** (400/500/600) — body copy, descriptions.
- **IBM Plex Mono** (400/500/600) — all data: readouts, facts, labels, links.

## Components

- **Instrument** (`.instrument`): bezel card, two corner rivets, a placard,
  an SVG gauge face, a mono readout, a mono subtitle. Blanked variant
  (`.blank`) desaturates the placard and readout for the CAD slot — a real
  avionics "blanking plate" convention for an uninstalled instrument, not a
  fake gauge.
- **Gauge faces** (inline SVG, generated in JS): AR dial, oscilloscope trace,
  pressure-style sweep gauge, blanking-plate cross-bolt pattern. Needle
  rotation and fixed tick-label positions must use the same left/top/right
  convention (see the AR-gauge fix in commit history — mixing a rotate()
  transform's clockwise convention with cos/sin tick placement pointed the
  needle at the wrong value).
- **Detail dialog** (`<dialog>`): placard header, optional amber caution
  block, description, mono fact table, CTA links. Opens via native
  `showModal()`, no JS dialog library.

## Layout

Single masthead bar (name/role/tail-number/GitHub link) above a 4-column
instrument grid (`repeat(4, 1fr)`, collapsing to 2 columns at 900px and 1
column at 480px). No hero section, no marketing copy above the fold — the
panel is the first viewport.

## Content policy

Every instrument shows a real number pulled from an actual repo, test run,
or data file (see each card's `facts` in `index.html`) — never an invented
metric. A project with no real material yet (CAD) ships as an honest
blanking plate instead of a placeholder screenshot or fabricated claim.
