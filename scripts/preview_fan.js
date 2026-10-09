  /* ============ preview: the reel as a hand of cards (injected by scripts/build_preview.py) ============ */
  (function initFan(){
    const stage = document.getElementById("stage"), fan = document.getElementById("fan"), panel = document.getElementById("fanPanel");
    const srcEl = document.getElementById("reel-src");
    if (!stage || !fan || !panel || !srcEl) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = matchMedia("(hover: none)").matches;
    const rand = (a, b) => a + Math.random() * (b - a);
    const esc = s => s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
    // Headline number on each card's corner, taken from that project's own result line.
    const STAT = {"tylok-fatigue-machine":"2,000","mission-model":"2,793","fly-brain-drone":"12/12","log-dashboard":"65/100",
      "wing-optimizer":"8.64","liquid-rocket":"9","naca-solidworks":"80","x8-tailsitter":"8"};
    // Rows have no reel figure of their own; these two have a real image in the figure map, the rest get a drawing grid.
    const ROW_FIG = {"hexacopter-drone":"cadPhotoFigure","quadcopter":"quadcopterOrthoFigure"};

    const P = [...srcEl.querySelectorAll("a.frame, a.row")].map(a => {
      const href = a.getAttribute("href");
      const id = href.startsWith("#") ? href.slice(1) : "hexacopter-drone";
      const isRow = a.classList.contains("row");
      const p = {id, href, title: a.querySelector("h4").textContent, desc: a.querySelector("p").textContent.trim()};
      if (isRow) {
        p.disc = a.querySelector(".row-meta").textContent.replace("→", "").trim();
        p.stat = STAT[id] || p.disc.split(" · ")[0];
        p.fig = ROW_FIG[id] || "";
      } else {
        const v = a.querySelectorAll(".frame-tb .tb-value");
        p.disc = v[0].textContent; p.built = v[1].textContent;
        p.result = a.querySelector(".tb-result").innerHTML;
        p.stat = STAT[id] || p.title;
        const f = a.querySelector(".frame-fig"); p.fig = f ? f.dataset.fig : "";
      }
      return p;
    });
    srcEl.querySelectorAll(".frame-fig").forEach(f => f.remove()); // drawn once, on the cards

    let W, H, cw, ch, tuck, hovered = null, played = null, phase = "pre", timers = [];
    const els = {}, pile = {}, away = {};
    P.forEach((p, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "fc"; b.dataset.id = p.id;
      const fig = p.fig ? `<div class="fc-fig" data-fig="${p.fig}"></div>` : `<div class="fc-fig grid"></div>`;
      b.innerHTML = `<div class="fc-flip">
        <div class="fc-back" aria-hidden="true"><span>ES</span></div>
        <div class="fc-face"><div class="fc-idx">${esc(p.stat)}</div>${fig}
          <div class="fc-body"><b>${esc(p.title)}</b><i>${esc(p.disc)}</i></div>
          <div class="fc-idx r" aria-hidden="true">${esc(p.stat)}</div></div></div>`;
      b.addEventListener("mouseenter", () => { if (phase === "dealt" && played !== p.id) { hovered = p.id; render(); } });
      b.addEventListener("mouseleave", () => { if (hovered === p.id) { hovered = null; render(); } });
      b.addEventListener("focus", () => { if (phase === "dealt" && played !== p.id) { hovered = p.id; render(); } });
      b.addEventListener("blur", () => { if (hovered === p.id) { hovered = null; render(); } });
      b.addEventListener("click", () => {
        if (phase !== "dealt") return;
        if (played === p.id) return back();
        if (coarse && hovered !== p.id) { hovered = p.id; render(); return; } // touch: first tap lifts, second plays
        played = p.id; hovered = null; render(); showPanel();
      });
      fan.appendChild(b);
      els[p.id] = b;
      pile[p.id] = {r: rand(-14, 14), x: rand(-16, 16), y: rand(-6, 6)};
      away[p.id] = {r: rand(-55, 55), x: rand(-120, 120)};
    });

    function metrics(){
      W = fan.clientWidth;
      cw = Math.max(96, Math.min(168, W * .13));
      ch = cw * 1.4; tuck = ch * .42; H = Math.round(ch * 1.75 + 40);
      stage.style.setProperty("--fc-w", cw + "px"); stage.style.setProperty("--fc-h", ch + "px");
      fan.style.height = H + "px";
    }
    function pose(index, count){
      const k = cw / 112, off = index - (count - 1) / 2;
      const step = count > 1 ? Math.min(9, 46 / (count - 1)) : 0, rot = off * step;
      const base = count > 5 ? 48 * k : 58 * k, maxOff = (count - 1) / 2;
      const half = W / 2 - cw * .8;
      const sp = maxOff > 0 ? Math.min(base, Math.max(cw * .17, half / maxOff)) : 0;
      return {r: rot, x: off * sp, y: Math.abs(rot) * 1.9 * k};
    }
    const tf = (x, y, r, s = 1) => `translate(${x}px,${y}px) rotate(${r}deg) scale(${s})`;
    function render(){
      const hand = P.filter(p => p.id !== played);
      const hi = hovered ? hand.findIndex(p => p.id === hovered) : -1;
      P.forEach((p, i) => {
        const el = els[p.id]; let t, z;
        if (phase === "pre") { t = tf(away[p.id].x, -(H + ch + 160), away[p.id].r); z = i; el.style.opacity = 0; }
        else if (phase === "pile") { t = tf(pile[p.id].x, -(H / 2 - ch / 2 + tuck) + pile[p.id].y, pile[p.id].r); z = i; el.style.opacity = 1; }
        else if (p.id === played) { t = tf(0, -(H - 8 - ch + tuck), pile[p.id].r * .25); z = 100; el.style.opacity = 1; }
        else {
          const idx = hand.findIndex(h => h.id === p.id), f = pose(idx, hand.length), on = p.id === hovered;
          const nb = hi !== -1 && !on ? Math.sign(idx - hi) * 24 / Math.max(1, Math.abs(idx - hi)) : 0;
          t = tf(f.x + nb, on ? -(tuck + 8) : f.y, on ? f.r * .3 : f.r, on ? 1.08 : 1);
          z = on ? 60 : 10 + idx; el.style.opacity = 1;
        }
        el.style.bottom = -tuck + "px"; el.style.transform = t; el.style.zIndex = z;
        el.classList.toggle("up", phase === "dealt");
        el.classList.toggle("sel", p.id === played);
        el.disabled = phase !== "dealt";
        el.setAttribute("aria-label", (p.id === played ? "Return the " : "Play the ") + p.title + " card");
      });
    }
    function showPanel(){
      const p = P.find(x => x.id === played);
      panel.classList.toggle("idle", !p);
      if (!p) {
        panel.innerHTML = `<p class="hint">${phase === "dealt" ? "Pick a card." : "Dealing the hand…"}</p><p>Each card is one project. The corner number is its headline result.</p>`;
        return;
      }
      const tb = p.built
        ? `<div><span class="tb-label">Discipline</span><span class="tb-value">${esc(p.disc)}</span></div>
           <div><span class="tb-label">Built with</span><span class="tb-value">${esc(p.built)}</span></div>
           <div class="tb-wide"><span class="tb-label">Result</span><span class="tb-result">${p.result}</span></div>`
        : `<div class="tb-wide"><span class="tb-label">Discipline</span><span class="tb-value">${esc(p.disc)}</span></div>`;
      panel.innerHTML = `<div class="pl"><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p></div><div aria-hidden="true"></div>
        <div class="pr"><div class="frame-tb">${tb}</div>
          <div class="actions"><a class="btn btn-primary" href="${p.href}">Open project <span aria-hidden="true">→</span></a>
          <button class="btn btn-secondary" type="button" id="fanReturn">Return card</button></div></div>`;
      document.getElementById("fanReturn").addEventListener("click", back);
    }
    function back(){ played = null; hovered = null; render(); showPanel(); }

    function deal(){
      timers.forEach(clearTimeout); timers = [];
      played = null; hovered = null; phase = "pre";
      P.forEach(p => els[p.id].style.transition = "none");
      metrics(); render(); showPanel();
      void fan.offsetWidth;
      P.forEach(p => els[p.id].style.transition = "");
      if (reduce) { phase = "dealt"; render(); showPanel(); return; }
      timers.push(setTimeout(() => { // 1. every card falls into the middle, face down
        phase = "pile";
        P.forEach((p, i) => els[p.id].style.transitionDelay = i * 70 + "ms");
        render();
      }, 60));
      const dealAt = 60 + P.length * 70 + 900;
      timers.push(setTimeout(() => { // 2. draw them into the fan, flipping face up
        phase = "dealt";
        P.forEach((p, i) => {
          els[p.id].style.transitionDelay = i * 80 + "ms";
          els[p.id].querySelector(".fc-flip").style.transitionDelay = i * 80 + 120 + "ms";
        });
        render(); showPanel();
      }, dealAt));
      timers.push(setTimeout(() => { // 3. clear the stagger so hover lifts answer at once
        P.forEach(p => { els[p.id].style.transitionDelay = ""; els[p.id].querySelector(".fc-flip").style.transitionDelay = ""; });
      }, dealAt + P.length * 80 + 900));
    }
    addEventListener("keydown", e => { if (e.key === "Escape" && played) back(); });
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { metrics(); render(); }, 100); });
    metrics(); render(); showPanel();
    // Deal when the section scrolls into view, not on load, so the fall is seen.
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); deal(); } }, {threshold: .3});
      io.observe(stage);
    } else deal();
  })();
