# ethansimon.me, React port (staged)

Vite + React + TypeScript + Tailwind v4 + shadcn. Builds to `../preview-react/`, served at
https://ethansimon.me/preview-react/ (noindex). The live site at `/` is still the hand-built `../index.html`.

## Commands
- `python3 scripts/port.py` re-splits `../index.html` into `src/site/` (css, page script, HTML parts). Run it after editing `index.html` while the port is staged.
- `npm run build` writes `../preview-react/`. Commit that folder to publish.
- To look at it locally: `python3 -m http.server` from the repo root, then open `/preview-react/`. Site assets and demos load from the root (`/assets/`, `/demos/`).

## State of the port
- Components: `Nav`, `Hero`, `Contact`, `Footer` (`src/components/Shell.tsx`).
- Still HTML from `index.html`: the project reel, the 13 write-ups, About and Skills (`src/site/parts/*.html`), plus the page script (`src/site/legacy.js`: charts, 3D viewers, hash routing, contents rail).
- shadcn `shift-card` is installed (`src/components/ui/shift-card.tsx`) but not used on a page yet.
- Tailwind runs without its reset; the site brings its own base styles.

## Cutover
Root `index.html` stays live until the port matches it. Cutover means deploying `app/` through GitHub Actions to Pages and retiring `index.html`.
