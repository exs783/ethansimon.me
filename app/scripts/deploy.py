#!/usr/bin/env python3
"""Put the built React app at the site root.   cd app && npm run build && python3 scripts/deploy.py

- ../index.html and ../app-assets/ become the build in dist/.
- ../legacy/index.html is the original hand-built page (app/legacy-source.html), kept as a fallback.
Nothing else at the repo root is touched (assets/, demos/, preview/, solitaire/, CNAME, 404.html).
"""
import re
import shutil
from pathlib import Path

APP = Path(__file__).resolve().parent.parent
ROOT = APP.parent
dist = APP / "dist"
assert (dist / "index.html").exists(), "run npm run build first"

shutil.copyfile(dist / "index.html", ROOT / "index.html")
target = ROOT / "app-assets"
if target.exists():
    shutil.rmtree(target)
shutil.copytree(dist / "app-assets", target)

legacy = (APP / "legacy-source.html").read_text(encoding="utf-8")
legacy = re.sub(r"""(["'`(])((?:assets|demos)/)""", r"\1../\2", legacy)
legacy = legacy.replace('href="favicon.svg"', 'href="../favicon.svg"')
legacy = legacy.replace('<link rel="canonical" href="https://ethansimon.me/">', '<meta name="robots" content="noindex, nofollow">')
(ROOT / "legacy").mkdir(exist_ok=True)
(ROOT / "legacy" / "index.html").write_text(legacy, encoding="utf-8")
print("deployed: index.html, app-assets/, legacy/index.html")
