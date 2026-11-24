import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STEPS, choose, currentStep, decodeBook, encodeBook, isComplete, newStory, options, pageCount, pages, prompt, restore, titles, undo, upTo, STEP_META, type Story } from '../lib/story/engine.ts';
import { scene, pageScene, coverScene } from '../lib/story/compose.ts';

const fresh = () => newStory({ child: 'Lyla', grownup: 'Mom' }, 1_700_000_000_000);

function* walk(s: Story): Generator<Story> {
  const step = currentStep(s);
  if (!step) { yield s; return; }
  const opts = options(s, step);
  // Titles don't branch the story; take the first to keep the walk tractable.
  for (const o of step === 'title' ? opts.slice(0, 1) : opts) yield* walk(choose(s, { id: o.id }));
}

function checkScene(label: string, sc: ReturnType<typeof scene>) {
  for (const a of sc.actors) {
    for (const k of ['x', 'y', 'w', 'h', 'z'] as const) assert.ok(Number.isFinite(a[k]), `${label}: ${a.key}.${k} is not finite`);
    assert.ok(a.x > -300 && a.x < 1100 && a.y > -300 && a.y < 800, `${label}: ${a.key} is off stage (${a.x}, ${a.y})`);
  }
  const keys = sc.actors.map((a) => a.key);
  assert.equal(new Set(keys).size, keys.length, `${label}: duplicate actor keys ${keys}`);
}

test('every built-in path makes a complete, coherent six-page book', () => {
  let count = 0;
  for (const s of walk(fresh())) {
    count++;
    assert.ok(isComplete(s));
    const book = pages(s);
    assert.equal(book.length, 6);
    const all = book.map((p) => p.text).join(' ');
    assert.doesNotMatch(all, /undefined|null|NaN|\{|\}/);
    assert.doesNotMatch(all, / {2}/, 'double spaces');
    for (const p of book) assert.ok(p.text.length > 60, `page ${p.n} is too short`);
    assert.ok(titles(s).length >= 2);
    if (count % 7 === 0) {
      for (let n = 1; n <= 6; n++) checkScene(`page ${n}`, pageScene(s, n));
      checkScene('cover', coverScene(s));
      assert.deepEqual(restore(JSON.parse(JSON.stringify(s))), s);
      const shared = decodeBook(encodeBook(s));
      assert.ok(shared);
      assert.deepEqual(pages(shared!), book);
    }
  }
  assert.equal(count, 3 ** 9);
});

test('interactive scenes offer exactly the tappable choices for world steps', () => {
  for (const pick of [0, 1, 2]) {
    let s = fresh();
    for (const step of STEPS) {
      const sc = scene(s, { interactive: true });
      checkScene(step, sc);
      const taps = sc.actors.filter((a) => a.tap?.step === step).map((a) => a.tap!.id).sort();
      if (STEP_META[step].world) assert.deepEqual(taps, options(s, step).map((o) => o.id).sort(), `${step} hotspots`);
      else assert.equal(taps.length, 0);
      const opts = options(s, step);
      s = choose(s, { id: opts[pick % opts.length].id });
    }
    assert.ok(isComplete(s));
  }
});

test('no illusion of choice: each decision changes the book', () => {
  const all = [...walk(fresh())];
  for (const base of [all[0], all[1234], all[9999], all[all.length - 1]]) {
    STEPS.slice(0, -1).forEach((step, i) => {
      const before = upTo(base, i);
      const texts = options(before, step).map((o) => {
        let s = choose(before, { id: o.id });
        while (!isComplete(s)) s = choose(s, { id: options(s)[0].id });
        return pages(s).map((p) => p.text).join('|');
      });
      assert.equal(new Set(texts).size, texts.length, `${step}: options lead to identical books`);
    });
  }
});

test('both authors are named and turns are shared', () => {
  const s = fresh();
  assert.equal(prompt(s, 'place').name, 'Lyla');
  assert.equal(prompt(s, 'special').name, 'Mom');
  assert.match(prompt(s, 'plan').name, /Lyla & Mom/);
  const whos = STEPS.map((k) => STEP_META[k].who);
  for (const who of ['child', 'grownup', 'together'] as const) assert.ok(whos.filter((w) => w === who).length >= 2, who);
});

test('custom contributions are cleaned and woven into the story', () => {
  let s = fresh();
  s = choose(s, { id: 'park' });
  s = choose(s, { id: 'kite' });
  s = choose(s, { id: 'custom', text: '  it belonged to   a <b>pirate</b> queen ' });
  assert.match(pages(s)[1].text, /It belonged to a bpirate\/b queen\./);
  s = choose(s, { id: 'rain' }); s = choose(s, { id: 'splash' }); s = choose(s, { id: 'juniper' });
  s = choose(s, { id: 'custom', text: 'She is scared of thunder' });
  s = choose(s, { id: 'custom', text: 'they sang a loud song together' });
  s = choose(s, { id: 'custom', text: 'Everyone had pancakes!' });
  s = choose(s, { id: 'custom', text: 'The Pirate Queen’s Kite' });
  assert.ok(isComplete(s));
  const text = pages(s).map((p) => p.text).join(' ');
  assert.match(text, /Juniper had a worry\. She is scared of thunder\./);
  assert.match(text, /They sang a loud song together\. And would you believe it\? It worked\./);
  assert.match(text, /Everyone had pancakes!/);
  assert.match(text, /By now the rain had stopped/);
  assert.equal(s.picks.title?.text, 'The Pirate Queen’s Kite');
  const shared = decodeBook(encodeBook(s))!;
  assert.deepEqual(shared.picks, s.picks);
  assert.deepEqual(shared.authors, s.authors);
  for (let n = 1; n <= 6; n++) checkScene(`custom page ${n}`, pageScene(s, n));
});

test('invalid choices and tampered saves are rejected', () => {
  const s = choose(fresh(), { id: 'bakery' });
  assert.equal(choose(s, { id: 'kite' }), s, 'kite is not at the bakery');
  assert.equal(choose(s, { id: 'custom', text: 'x' }), s, 'object step has no custom answers');
  assert.equal(choose(fresh(), { id: 'moon' }).picks.place, undefined);
  assert.equal(choose(choose(s, { id: 'letter' }), { id: 'custom', text: '   ' }).picks.special, undefined, 'blank custom answers are ignored');
  assert.equal(restore(null), null);
  assert.equal(restore({ ...s, v: 1 }), null);
  assert.equal(restore({ ...s, picks: { place: { id: 'bakery' }, object: { id: 'boat' } } }), null);
  assert.equal(decodeBook('not-a-book'), null);
});

test('pages grow as rounds complete, and undo steps back', () => {
  let s = fresh();
  const counts: number[] = [];
  while (!isComplete(s)) { s = choose(s, { id: options(s)[0].id }); counts.push(pageCount(s)); }
  assert.deepEqual(counts, [1, 1, 2, 2, 3, 3, 4, 5, 6, 6]);
  const back = undo(s);
  assert.equal(back.picks.title, undefined);
  assert.equal(back.finishedAt, undefined);
});

import { MAYA, PRONOUNS, type Hero } from '../lib/story/hero.ts';

test('the little author is the hero: name, pronouns and look carry through every path', () => {
  for (const pronoun of PRONOUNS) {
    const hero: Hero = { name: 'Sam', pronoun, look: { skin: 'tan', hair: 'curls', hairColor: 'auburn', coat: 'blue', glasses: true } };
    let n = 0;
    for (const s0 of walk(newStory({ child: 'Sam', grownup: 'Dad' }, 1_700_000_000_000, hero))) {
      n++;
      const book = pages(s0).map((p) => p.text).join(' ');
      assert.doesNotMatch(book, /\{|\}|Maya/, `${pronoun}: leftover token or Maya`);
      assert.match(book, /Sam/);
      assert.match(pages(s0)[0].text, /blue coat/);
      if (pronoun === 'they') assert.doesNotMatch(book, /\bthey (was|has|is|does)\b/i);
      const w = s0.picks;
      // Juniper and Mrs. Penny are "she" in their own lines; everywhere else she/her must be the hero's pronoun.
      if (pronoun !== 'she' && w.friend?.id !== 'juniper' && w.plan?.id !== 'ask') assert.doesNotMatch(book, /\b(she|her)\b/i, `${pronoun}: stray she/her`);
      if (n % 97 === 0) {
        assert.ok(titles(s0).every((t) => !/\{|Maya/.test(t)));
        const shared = decodeBook(encodeBook(s0))!;
        assert.deepEqual(shared.hero, hero);
        assert.deepEqual(restore(JSON.parse(JSON.stringify(s0)))!.hero, hero);
        assert.deepEqual(scene(s0).hero, hero.look);
      }
    }
    assert.equal(n, 3 ** 9);
  }
  assert.match(prompt(newStory({ child: 'Sam', grownup: 'Dad' }, 0, { ...MAYA, name: 'Sam', pronoun: 'he' }), 'place').ask, /Where shall Sam go today\?/);
});

test('books saved before heroes existed still open, starring Maya; bad hero data falls back safely', () => {
  const s = choose(fresh(), { id: 'park' });
  const { hero: _drop, ...old } = s;
  assert.deepEqual(restore(old)!.hero, MAYA);
  const odd = restore({ ...s, hero: { name: '<b>Zo</b>', pronoun: 'xe', look: { skin: 'green', hair: 'mohawk' } } })!;
  assert.equal(odd.hero.name, 'bZo/b');
  assert.equal(odd.hero.pronoun, 'she');
  assert.equal(odd.hero.look.hair, 'puffs');
});
