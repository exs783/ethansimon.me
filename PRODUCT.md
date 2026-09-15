# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

static HTML/CSS, deployed via GitHub Pages (repo `exs783/ethansimon.me`) with a custom domain (`ethansimon.me`) through Namecheap DNS. Already scaffolded and live; not re-asked.

## Users

Primary: recruiters and hiring managers evaluating Ethan for mechanical-engineering internships / new-grad roles. Secondary: anyone he sends the link to (professors, teammates) who wants a fast read on what he's built.

## Product Purpose

A personal portfolio site that demonstrates hands-on mechanical/aerospace engineering ability through real projects, not a resume restatement. Success = a recruiter can tell within a minute what he builds and how deep the work goes.

## Positioning

Cross-disciplinary systems work on real hardware: simulation/optimization tooling (mission performance + wing sizing math), flight-data analysis software (a real Pixhawk log dashboard), and physical vehicle systems (CWRU Liquid Rocket team instrumentation/controls) — not just coursework.

## Operating Context

Mechanical engineering student, Case Western Reserve University. Active on CWRU's Liquid Rocket team. Builds engineering software (simulation, optimization, data dashboards) alongside physical/CAD work.

## Capabilities and Constraints

Featured projects, confirmed in scope (engineering only — explicitly excludes his fintech/software side projects buffer-hedgey, Hedgey, VectOres):

- **Mission Model / wing optimizer** — VTOL mission-performance simulator (`Mission_Model.py`) and a wing-sizing optimizer (`wing_optimizer.py`) with a real combined mass/drag/energy objective. Real evidence on hand: a published write-up artifact (design-search visualization + before/after results) and generated tradespace plots (PNG + interactive Plotly HTML). Lives in the private repo `exs783/Log_Reader`.
- **Log Dashboard** — a Flask + Plotly dashboard (`log_dashboard.html` / `python_backend.py`) that parses Pixhawk/ArduCopter `.BIN` flight logs: frame-type detection, vibration FFT, MAVExplorer-style analysis. Also lives in `exs783/Log_Reader`. No screenshot exists yet — open item below.
- **CAD projects** — mentioned by the user as a category to feature, but no CAD files (STL/STEP/SLDPRT) or renders were found in any accessible repo. **Open / unconfirmed**: needs real files or screenshots from the user before this card can show real content; do not fabricate a render.
- **CWRU Liquid Rocket team** — instrumentation/GUI work in `exs783/Liquid-Rocket` (private): a P&ID control GUI, ball-valve schematic, Teensy-based sensor firmware. Real SVG schematics exist in-repo.

**Open constraint**: `Log_Reader` and `Liquid-Rocket` are currently **private** GitHub repos — a recruiter clicking through hits a 404/no-access page. Needs a decision (make public, or the card links to a write-up/demo instead of the repo) before ship.

## Evidence on Hand

- Mission Model: `mission_model_best_hover_by_vehicle.png`, `mission_model_best_energy_margin_by_vehicle.png`, `mission_model_hover_vs_mass_tradespace.html` (Plotly), and a published Claude Artifact write-up (search methodology + results) from this session.
- Liquid Rocket: `Rocket_P&ID_GUI1.svg`, `BallValveSchematic.svg` in the repo.
- Log Dashboard: no screenshot yet — plan is to capture one live from the running dashboard with the sample flight log already in `uploads/`.
- CAD: none found. State absence on the page rather than inventing a project.

## Product Principles

1. Every project card shows something real (a plot, a schematic, a live tool) — never a stock icon standing in for actual work.
2. Depth over breadth: 4 focused projects with real technical detail beat a long list of shallow entries.
3. Recruiter-first scan: what it is and why it's hard should read in under 10 seconds before anyone clicks in.
4. Never claim a repo is browsable if it's private — the card must be honest about what a visitor can actually reach.

## Accessibility & Inclusion

No project-specific requirement established; follow standard web accessibility practice (contrast, keyboard nav, alt text on real images).
