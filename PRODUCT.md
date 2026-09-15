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

Mechanical engineering student, Case Western Reserve University (Michelson-Morley Scholar, B.S. Aug 2024 – May 2028). Confirmed from his resume (`~/Downloads/Ethan_Simon_Resume.docx`):

- **VTOL Mechanical Team Lead, CWRU VTOL Team** (Aug 2024 – Present, current/active role) — frame and payload-mechanism design across Tail Sitter (heavy-lift), Hexacopter, Quadcopter, and Tiltrotor airframes; SolidWorks CAD/simulation; MATLAB/Python scripts to inform design decisions; project planning, safety documents, work instructions.
- **Mechanical Engineering Co-Op, Tylok International** (Jan – Aug 2026) — designed/built a flexural fatigue test machine to ASTM standards, plus thermal/flow/tensile/pressure test apparatus; Dewesoft data-acquisition integration (DewesoftX + C++).
- **Liquid Propulsion Team, CWRU** (Aug 2025 – Jan 2026) — designed the solenoid/servo mechanical thrust-control hardware and built the original PyQt5 hot-fire control GUI (`main_v2.py` in `exs783/Liquid-Rocket`) — this is the real origin of the Liquid Rocket project featured on the site.
- **University of Michigan Battery Lab** (2022–2024) — physical testing + Python analysis (Pandas, scikit-learn, SciPy, hdbscan) of battery cells.

## Capabilities and Constraints

Featured projects, confirmed in scope (engineering only — explicitly excludes his fintech/software side projects buffer-hedgey, Hedgey, VectOres):

- **Mission Model** — VTOL mission-performance simulator (`Mission_Model.py`): motor/prop/battery sweep over a real fleet of tailsitter/multirotor configs. Airframe list (Hexacopter/Quadcopter/x8/Tail Sitter) mirrors his real VTOL-team vehicle classes. Lives in the public repo `exs783/Log_Reader`.
- **Wing Optimizer** — standalone wing-sizing tool (`wing_optimizer.py`) with mass/drag/energy objectives; split out from Mission Model into its own project when three paper-inspired additions (aerodynamic-center reporting, a beam-bending mass model, joint taper search) made it substantial enough to stand alone. Same repo (`exs783/Log_Reader`).
- **Log Dashboard** — a Flask + Plotly dashboard (`log_dashboard.html` / `python_backend.py`) that parses Pixhawk/ArduCopter `.BIN` flight logs: frame-type detection, vibration FFT, MAVExplorer-style analysis, an overall flight-quality score. Also lives in `exs783/Log_Reader`. Live static demo at `demos/log-dashboard.html`, running the real backend's output against a real sample log.
- **Liquid Rocket** — ground-station software for the CWRU Liquid Propulsion Team, rebuilt from two prototypes (his own original PyQt5 hot-fire GUI + a separate PyQt6 P&ID valve-control page) into one PyQt6 app. Public repo `exs783/Liquid-Rocket`. Live JS-ported demo at `demos/liquid-rocket.html`.
- **CAD** — real files now on hand from `~/Desktop/Projects` (Tylok and VTOL folders): the full CompDrone2025 SolidWorks assembly (7 subassemblies: ARM/FRM/LGR/BATT/CAM/PAYLOAD/ELEC) and a real photo of the Tylok ASTM F1387 A6 flexural fatigue test machine. The `.glb` export of CompDrone2025 was 192MB as delivered — compressed via `gltf-transform optimize` (Draco geometry + WebP textures) to ~2MB and embedded live via `<model-viewer>` (real, rotatable, not a static render). No public repo for either (SolidWorks files stay local, GitHub Pages only serves the exported assets), so no CTA link — the card is the evidence.

## Evidence on Hand

- Mission Model: `mission_model_best_hover_by_vehicle.png`, `mission_model_best_energy_margin_by_vehicle.png`, `mission_model_hover_vs_mass_tradespace.html` (Plotly), and real fleet mission-sweep results (`mission_model_results.csv`).
- Wing Optimizer: the real (cl × AR) energy-search grid embedded in `index.html`, and a real `--objective combined --taper-min/--taper-max` run's output geometry (root/tip chord, span, MAC, aerodynamic-center location) used for the planform figure.
- Liquid Rocket: `Rocket_P&ID_GUI1.svg`, `BallValveSchematic.svg` in the repo; a from-scratch JS port of the real Python gauge/valve/sensor logic for the live demo.
- Log Dashboard: `flight-analysis.json`, the literal output of running the real `python_backend.py` against the real sample flight log (`my_flight.bin`) — 65/100 flight quality score, QUAD frame, 7 stability issues, real vibration/GPS data.
- CAD: `assets/compdrone2025.glb` (2.2MB, compressed from a 192MB SolidWorks export), `assets/compdrone2025-render.png` (real product render), `assets/tylok-fatigue-machine.jpg` (real photo of the actual machine, HEIC→JPEG, resized).

## Product Principles

1. Every project card shows something real (a plot, a schematic, a live tool) — never a stock icon standing in for actual work.
2. Depth over breadth: 4 focused projects with real technical detail beat a long list of shallow entries.
3. Recruiter-first scan: what it is and why it's hard should read in under 10 seconds before anyone clicks in.
4. Never claim a repo is browsable if it's private — the card must be honest about what a visitor can actually reach.

## Accessibility & Inclusion

No project-specific requirement established; follow standard web accessibility practice (contrast, keyboard nav, alt text on real images).
