// Run: node gin-rummy/gin.test.js
const assert = require('node:assert');
const G = require('./gin.js');
const id = (r, s) => s * 13 + r - 1; // s: 0 spades, 1 hearts, 2 clubs, 3 diamonds

// melds and deadwood
let b = G.best([id(1,0), id(2,0), id(3,0), id(5,1), id(5,2), id(5,3), id(9,1), id(13,2), id(12,3), id(4,1)]);
assert.strictEqual(b.dw, 9 + 10 + 10 + 4, 'run + set leave 9,K,Q,4');
b = G.best([id(4,0), id(5,0), id(6,0), id(7,0), id(8,0), id(1,3), id(2,3), id(3,3), id(11,1), id(13,2)]);
assert.strictEqual(b.dw, 20, 'run 4-8 spades, run A-3 diamonds, J and K left over');
assert.strictEqual(G.best([id(4,0), id(4,1), id(4,2), id(5,0), id(6,0), id(7,0), id(8,0), id(1,3), id(2,3), id(3,3)]).dw, 0, 'a 4 can sit in the set while the run keeps 5-8');

// layoff: a set of three takes its fourth, a run extends at either end
assert.deepStrictEqual(G.layoff([id(7,1)], [[id(7,0), id(7,2), id(7,3)]]).dead, []);
assert.deepStrictEqual(G.layoff([id(7,1)], [[id(8,1), id(9,1), id(10,1)]]).dead, [], 'run extends low end');
assert.deepStrictEqual(G.layoff([id(11,1)], [[id(8,1), id(9,1), id(10,1)]]).dead, [], 'run extends high end');
assert.deepStrictEqual(G.layoff([id(13,0)], [[id(11,0), id(12,0), id(13,3)]]).dead, [id(13,0)], 'wrong suit stays');
assert.deepStrictEqual(G.layoff([id(7,1), id(6,1)], [[id(8,1), id(9,1), id(10,1)]]).dead, [], 'chained layoff');

// knock scoring: gin, knock, undercut
function rig(h0, h1, turn = 0) {
  const st = G.deal([0, 0], 1, () => 0.5);
  st.hands = [h0, h1]; st.phase = 'discard'; st.turn = turn; st.taken = null; st.passes = 0;
  st.stock = [...Array(20).keys()].map(i => 40 + (i % 12)); st.discard = [id(2, 2)];
  return st;
}
const ginHand = [id(1,0), id(2,0), id(3,0), id(4,0), id(5,1), id(5,2), id(5,3), id(9,1), id(9,2), id(9,3), id(13,0)];
let st = rig(ginHand, [id(1,1), id(8,0), id(10,2), id(12,2), id(3,3), id(6,1), id(7,3), id(11,3), id(4,2), id(13,1)]);
assert.strictEqual(G.act(st, 0, { t: 'knock', card: id(13,0) }), null);
assert.strictEqual(st.result.gin, true);
assert.strictEqual(st.scores[0], 25 + st.result.dw[1]);
assert.strictEqual(G.act(rig(ginHand, [], 1), 0, { t: 'discard', card: id(13,0) }), 'Not your turn.');

// undercut: opponent has less deadwood than the knocker
const knock = [id(1,0), id(2,0), id(3,0), id(5,1), id(5,2), id(5,3), id(9,1), id(9,2), id(9,3), id(12,0), id(6,2)]; // K left as deadwood after discarding 6c
st = rig(knock.slice(), [id(1,1), id(2,1), id(3,1), id(10,0), id(10,1), id(10,2), id(8,0), id(8,1), id(8,2), id(2,3)]);
assert.strictEqual(G.act(st, 0, { t: 'knock', card: id(6,2) }), null);
assert.ok(st.result.winner === 1 && st.result.undercut, 'opponent with less deadwood undercuts');
assert.strictEqual(st.scores[1], st.result.pts);

// knock over 10 deadwood is refused and the hand is untouched
st = rig([id(13,0), id(12,1), id(11,2), id(10,3), id(9,0), id(7,1), id(2,2), id(4,3), id(1,1), id(6,0), id(8,2)], ginHand.slice(0, 10));
assert.match(G.act(st, 0, { t: 'knock', card: id(2,2) }), /over 10/);
assert.strictEqual(st.hands[0].length, 11);

// first-turn offer: both pass -> non-dealer must draw from the stock
st = G.deal([0, 0], 1, () => 0.3);
assert.strictEqual(st.turn, 0);
G.act(st, 0, { t: 'pass' }); assert.strictEqual(st.turn, 1);
G.act(st, 1, { t: 'pass' }); assert.strictEqual(st.turn, 0);
assert.match(G.act(st, 0, { t: 'draw', from: 'discard' }), /stock/);
assert.strictEqual(G.act(st, 0, { t: 'draw', from: 'stock' }), null);
assert.match(G.act(st, 0, { t: 'discard', card: 99 }), /not in your hand/);

// the opponent's hand never appears in your view mid-hand
const v = G.view(st, 1);
assert.strictEqual(v.oppHand, null);
assert.strictEqual(JSON.stringify(v).includes(JSON.stringify(st.hands[0])), false);

// random play: every game ends, 52 cards are always accounted for, scores only rise
let hands = 0, draws = 0, games = 0;
for (let seed = 1; seed <= 300; seed++) {
  let x = seed * 2654435761 >>> 0;
  const rng = () => ((x = (x * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const g = G.deal([0, 0], seed % 2, rng); g.rng = rng;
  for (let step = 0; step < 6000; step++) {
    const all = [...g.hands[0], ...g.hands[1], ...g.stock, ...g.discard];
    assert.strictEqual(new Set(all).size, 52, 'card conservation');
    if (g.phase === 'over') {
      hands++; if (g.result.draw) draws++;
      if (g.result.gameWinner != null) { games++; assert.ok(g.scores[g.result.gameWinner] >= G.WIN); break; }
      assert.strictEqual(G.act(g, 0, { t: 'next' }), null); continue;
    }
    const s = g.turn, h = g.hands[s]; let a;
    if (g.phase === 'first') a = rng() < 0.3 ? { t: 'take' } : { t: 'pass' };
    else if (g.phase === 'draw') a = { t: 'draw', from: g.stockOnly || rng() < 0.6 ? 'stock' : 'discard' };
    else {
      const choices = h.filter(c => c !== g.taken);
      const dw = c => G.best(h.filter(y => y !== c)).dw;
      const c = choices.reduce((m, y) => (dw(y) < dw(m) ? y : m)); // greedy: shed the card that helps least
      a = dw(c) <= 10 ? { t: 'knock', card: c } : { t: 'discard', card: c };
    }
    assert.strictEqual(G.act(g, s, a), null, JSON.stringify(a) + ' in ' + g.phase);
  }
}
console.log(`ok (${hands} hands, ${draws} drawn, ${games} games finished)`);
