// Gin rummy rules, shared by the page and gin.test.js.
// Card id 0..51: suit = id / 13 (0 spades, 1 hearts, 2 clubs, 3 diamonds), rank = id % 13 + 1 (ace low).
// The host's browser owns the state; view() is all the guest ever receives.
(function (root) {
  const rank = c => (c % 13) + 1, suit = c => (c / 13) | 0, val = c => Math.min(rank(c), 10);
  const sum = cs => cs.reduce((a, c) => a + val(c), 0);
  const WIN = 100, KNOCK_MAX = 10, GIN_BONUS = 25;

  // Every legal meld in a hand, as arrays of hand indices.
  function melds(hand) {
    const out = [], byRank = {}, bySuit = [[], [], [], []];
    hand.forEach((c, i) => { (byRank[rank(c)] = byRank[rank(c)] || []).push(i); bySuit[suit(c)].push(i); });
    for (const g of Object.values(byRank)) {
      if (g.length === 3) out.push(g);
      if (g.length === 4) { out.push(g); g.forEach(k => out.push(g.filter(x => x !== k))); }
    }
    for (const s of bySuit) {
      s.sort((a, b) => rank(hand[a]) - rank(hand[b]));
      for (let i = 0; i < s.length; i++)
        for (let j = i + 1; j < s.length && rank(hand[s[j]]) === rank(hand[s[j - 1]]) + 1; j++)
          if (j - i >= 2) out.push(s.slice(i, j + 1));
    }
    return out;
  }

  // The meld split that leaves the least deadwood.
  function best(hand) {
    const ms = melds(hand), masks = ms.map(m => m.reduce((a, i) => a | (1 << i), 0));
    const worth = ms.map(m => sum(m.map(i => hand[i])));
    let top = { s: -1, ch: [] };
    (function go(k, used, s, ch) {
      if (s > top.s) top = { s, ch };
      for (let m = k; m < ms.length; m++) if (!(used & masks[m])) go(m + 1, used | masks[m], s + worth[m], ch.concat(m));
    })(0, 0, 0, []);
    const taken = new Set(top.ch.flatMap(m => ms[m]));
    const dead = hand.filter((_, i) => !taken.has(i)).sort((a, b) => rank(a) - rank(b));
    return { melds: top.ch.map(m => ms[m].map(i => hand[i])), dead, dw: sum(dead) };
  }

  const isSet = m => rank(m[0]) === rank(m[1]);
  function fits(c, m) {
    if (isSet(m)) return m.length === 3 && rank(c) === rank(m[0]);
    const lo = rank(m[0]), hi = rank(m[m.length - 1]);
    return suit(c) === suit(m[0]) && (rank(c) === lo - 1 || rank(c) === hi + 1);
  }
  // The knocker's melds grow with whatever deadwood the other player can lay off.
  function layoff(dead, ms) {
    ms = ms.map(m => m.slice()); dead = dead.slice();
    for (let again = true; again;) {
      again = false;
      for (const c of dead.slice()) {
        const m = ms.find(x => fits(c, x));
        if (!m) continue;
        m.push(c); m.sort((a, b) => rank(a) - rank(b));
        dead.splice(dead.indexOf(c), 1); again = true;
      }
    }
    return { melds: ms, dead };
  }

  function shuffle(a, rng) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const cryptoRng = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;

  function deal(scores, dealer, rng) {
    const d = shuffle([...Array(52).keys()], rng || cryptoRng);
    const nd = 1 - dealer;
    return {
      scores, dealer, turn: nd, phase: 'first', passes: 0, stockOnly: false, taken: null, result: null,
      hands: [d.splice(0, 10), d.splice(0, 10)], discard: [d.pop()], stock: d,
    };
  }

  // phases: first (upcard offer) -> draw -> discard -> ... -> over. Returns an error string, or null on success.
  function act(st, seat, a) {
    if (a.t === 'next') {
      if (st.phase !== 'over') return 'Hand is not over.';
      const done = st.result.gameWinner != null;
      Object.assign(st, deal(done ? [0, 0] : st.scores, done ? st.dealer : 1 - st.dealer, st.rng));
      return null;
    }
    if (st.turn !== seat || st.phase === 'over') return 'Not your turn.';
    const hand = st.hands[seat];
    if (st.phase === 'first') {
      if (a.t === 'take') { st.taken = st.discard.pop(); hand.push(st.taken); st.phase = 'discard'; return null; }
      if (a.t === 'pass') {
        if (++st.passes === 1) st.turn = 1 - seat;
        else { st.phase = 'draw'; st.turn = 1 - st.dealer; st.stockOnly = true; }
        return null;
      }
      return 'Take the upcard or pass.';
    }
    if (st.phase === 'draw') {
      if (a.t !== 'draw') return 'Draw a card first.';
      if (a.from === 'discard' && !st.stockOnly) { st.taken = st.discard.pop(); hand.push(st.taken); }
      else if (a.from === 'stock') { st.taken = null; hand.push(st.stock.pop()); }
      else return 'Draw from the stock.';
      st.stockOnly = false; st.phase = 'discard'; return null;
    }
    // discard phase
    if (a.t !== 'discard' && a.t !== 'knock') return 'Discard a card.';
    const i = hand.indexOf(a.card);
    if (i < 0) return 'That card is not in your hand.';
    if (a.card === st.taken) return 'You cannot discard the card you just took.';
    const rest = hand.filter(c => c !== a.card);
    if (a.t === 'knock' && best(rest).dw > KNOCK_MAX) return 'Deadwood is over 10.';
    st.hands[seat] = rest; st.discard.push(a.card); st.taken = null;
    if (a.t === 'knock') return finish(st, seat), null;
    if (st.stock.length <= 2) { st.phase = 'over'; st.result = { draw: true }; return null; }
    st.turn = 1 - seat; st.phase = 'draw'; return null;
  }

  function finish(st, k) {
    const o = 1 - k, kb = best(st.hands[k]), ob = best(st.hands[o]), gin = kb.dw === 0;
    const lay = gin ? { melds: kb.melds, dead: ob.dead } : layoff(ob.dead, kb.melds);
    const odw = sum(lay.dead);
    let winner = k, pts;
    if (gin) pts = GIN_BONUS + odw;
    else if (kb.dw < odw) pts = odw - kb.dw;
    else { winner = o; pts = kb.dw - odw + GIN_BONUS; }
    const bySeat = (mine, theirs) => (k === 0 ? [mine, theirs] : [theirs, mine]);
    st.scores[winner] += pts;
    st.phase = 'over';
    st.result = {
      knocker: k, gin, undercut: !gin && winner === o, winner, pts,
      melds: bySeat(lay.melds, ob.melds), dead: bySeat(kb.dead, lay.dead), dw: bySeat(kb.dw, odw),
      gameWinner: st.scores[winner] >= WIN ? winner : null,
    };
  }

  // What one seat may see: its own hand, counts for the rest, and everything once the hand ends.
  function view(st, seat) {
    const over = st.phase === 'over', r = st.result;
    return {
      you: seat, phase: st.phase, turn: st.turn, dealer: st.dealer, scores: st.scores, stockOnly: st.stockOnly,
      hand: st.hands[seat], oppCount: st.hands[1 - seat].length, oppHand: over ? st.hands[1 - seat] : null,
      stock: st.stock.length, top: st.discard.length ? st.discard[st.discard.length - 1] : null, taken: st.taken,
      result: r && !r.draw ? { ...r, melds: seat ? [r.melds[1], r.melds[0]] : r.melds, dead: seat ? [r.dead[1], r.dead[0]] : r.dead, dw: seat ? [r.dw[1], r.dw[0]] : r.dw } : r,
    };
  }

  const api = { rank, suit, val, best, layoff, deal, act, view, melds, WIN };
  if (typeof module !== 'undefined') module.exports = api; else root.Gin = api;
})(this);
