#!/usr/bin/env python3
"""Build preview/index.html: a copy of index.html where the project reel is a hand of cards.

The copy is derived, never edited by hand. The original reel stays in the page (hidden, id
"reel-src") as the single source for titles, text and figures; the fan reads it at load.
Run from anywhere:  python3 scripts/build_preview.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = (ROOT / "app" / "legacy-source.html").read_text(encoding="utf-8")


def sub1(old, new, text):
    assert text.count(old) == 1, (text.count(old), old[:70])
    return text.replace(old, new)


# 1. The copy lives one level down, so root-relative assets and demos need "../".
out = re.sub(r"""(["'`(])((?:assets|demos)/)""", r"\1../\2", src)
out = sub1('href="favicon.svg"', 'href="../favicon.svg"', out)

# 2. Unlisted: keep it out of search and off the canonical URL.
out = sub1('<link rel="canonical" href="https://ethansimon.me/">',
           '<meta name="robots" content="noindex, nofollow">', out)

# 3. Hide the original reel (kept as the data source) and put the fan in its place.
out = sub1('<section id="reel" aria-labelledby="projects-title">',
           '<section id="reel-src" hidden aria-hidden="true">', out)
out = sub1('#reel a[href^=\'#\']', '#reel-src a[href^=\'#\']', out)
out = sub1('<section id="reel-src" hidden', '''<section id="reel" class="fan-sec" aria-labelledby="projects-title">
  <div class="sheet-head fan-head">
    <div>
      <h2 id="projects-title">Projects</h2>
      <p>Thirteen projects, dealt as a hand. Hover a card to lift it, click to play it.</p>
    </div>
    <div class="fan-search">
      <label for="fanSearch" class="sr-only">Search projects</label>
      <input id="fanSearch" type="search" placeholder="Search projects" autocomplete="off" spellcheck="false">
      <span class="fan-count" id="fanCount" aria-live="polite"></span>
    </div>
  </div>
  <div class="stage" id="stage">
    <section class="fan-panel" id="fanPanel" aria-live="polite" aria-label="Selected project"></section>
    <div class="fan" id="fan" role="group" aria-label="Project cards"></div>
  </div>
</section>

<section id="reel-src" hidden''', out)

# 4. Figures on cards are decorative thumbnails, same as the reel's.
out = sub1('if (el.closest(".frame"))', 'if (el.closest(".frame, .fan"))', out)

# 5. CSS
out = sub1("</style>", (ROOT / "scripts" / "preview_fan.css").read_text(encoding="utf-8") + "\n</style>", out)

# 6. JS, run after each project write-up has its spec strip and before figures are drawn.
out = sub1("\n  buildFigures();\n  buildToc();",
           "\n" + (ROOT / "scripts" / "preview_fan.js").read_text(encoding="utf-8") + "\n  buildFigures();\n  buildToc();", out)

out = sub1("<title>", "<title>Preview: ", out)

dest = ROOT / "preview" / "index.html"
dest.parent.mkdir(exist_ok=True)
dest.write_text(out, encoding="utf-8")
print("wrote", dest, len(out), "bytes")
