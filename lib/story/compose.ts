import { PLACES, type FriendId, type ObjectId, type PlaceId } from './content.ts';
import { progress, world, upTo, PAGE_AFTER, STEPS, type StepId, type Story } from './engine.ts';

/**
 * Scene composition: turns story state into positioned, layered actors on a
 * 1000×700 stage. Pure data, no drawing — the same function feeds the live
 * canvas, every book page and the cover, so the book always matches the world.
 */

export type BackdropId = 'street' | 'bakery' | 'park' | 'station' | 'vignette';
export type ActorKind = 'maya' | 'otis' | 'juniper' | 'biscuit' | 'baker' | 'cat' | 'squirrel' | 'pigeon' | 'object' | 'thought' | 'prop' | 'rain' | 'wind' | 'hotspot';
export type Look = 'plain' | 'note' | 'old' | 'curious';
export type Anim = 'bob' | 'float' | 'flutter' | 'tumble' | 'walk' | 'hop' | 'run' | 'idle';
export type Tap = { step: StepId; id: string; label: string };

export type Actor = {
  key: string; kind: ActorKind; x: number; y: number; w: number; h: number; z: number;
  flip?: boolean; pose?: string; expr?: string; object?: ObjectId; look?: Look; show?: string; prop?: string; anim?: Anim; tap?: Tap;
};
export type Scene = { backdrop: BackdropId; place?: PlaceId; time: 'day' | 'dusk'; weather: 'clear' | 'wind' | 'rain'; actors: Actor[] };

const BOX: Record<string, [number, number, number, number]> = {
  maya: [160, 230, 80, 214], otis: [170, 300, 85, 292], juniper: [160, 240, 80, 232], biscuit: [150, 120, 75, 112],
  baker: [180, 290, 90, 282], cat: [130, 100, 65, 94], squirrel: [110, 110, 55, 102], pigeon: [100, 90, 50, 86],
};
export const OBJECT_SIZE: Record<ObjectId, [number, number]> = {
  letter: [80, 60], balloon: [70, 160], scarf: [130, 60], kite: [110, 170], boat: [90, 96], key: [76, 40], suitcase: [96, 84], ticket: [74, 44], hat: [104, 64],
};
/** The point of each object that sits in a hand. */
const GRIP: Record<ObjectId, [number, number]> = {
  letter: [40, 50], balloon: [37, 158], scarf: [65, 34], kite: [55, 96], boat: [46, 80], key: [18, 22], suitcase: [48, 10], ticket: [12, 22], hat: [52, 46],
};
/** Hands, in each character's own box. */
const HANDS: Record<string, [number, number]> = { maya: [104, 120], otis: [104, 170], juniper: [92, 128], biscuit: [140, 64], baker: [128, 186] };

type Pt = [number, number];
type Layout = { s: number; maya: Pt; spots: Partial<Record<ObjectId, Pt>>; friend: Pt; shelter: Pt; landing: Pt; animalFrom: Pt };

export const LAYOUT: Record<PlaceId, Layout> = {
  bakery: { s: 1.1, maya: [560, 642], spots: { letter: [452, 586], balloon: [628, 382], scarf: [824, 566] }, friend: [860, 654], shelter: [300, 640], landing: [800, 646], animalFrom: [80, 650] },
  park: { s: 1.06, maya: [540, 668], spots: { kite: [300, 196], key: [416, 572], boat: [790, 584] }, friend: [880, 680], shelter: [250, 652], landing: [800, 676], animalFrom: [190, 600] },
  station: { s: 1.0, maya: [480, 606], spots: { suitcase: [905, 560], ticket: [300, 592], hat: [680, 552] }, friend: [790, 606], shelter: [440, 606], landing: [760, 604], animalFrom: [60, 560] },
};

export const STREET_SPOTS: Record<PlaceId, { rect: [number, number, number, number]; walk: Pt }> = {
  bakery: { rect: [20, 236, 330, 330], walk: [250, 616] },
  station: { rect: [362, 150, 276, 200], walk: [505, 600] },
  park: { rect: [646, 170, 354, 400], walk: [780, 616] },
};

function figure(key: string, kind: string, foot: Pt, s: number, extra: Partial<Actor> = {}): Actor {
  const [w, h, ax, ay] = BOX[kind];
  return { key, kind: kind as ActorKind, x: foot[0] - ax * s, y: foot[1] - ay * s, w: w * s, h: h * s, z: foot[1], ...extra };
}
function thing(obj: ObjectId, center: Pt, s: number, extra: Partial<Actor> = {}): Actor {
  const [w, h] = OBJECT_SIZE[obj];
  return { key: `thing-${obj}`, kind: 'object', object: obj, x: center[0] - (w * s) / 2, y: center[1] - (h * s) / 2, w: w * s, h: h * s, z: center[1] + 20, ...extra };
}
/** Put an object in a figure's hand. */
function held(obj: ObjectId, who: Actor, s: number, extra: Partial<Actor> = {}): Actor {
  const [hx, hy] = HANDS[who.kind] ?? [100, 120];
  const k = who.w / BOX[who.kind][0];
  const handX = who.flip ? who.x + who.w - hx * k : who.x + hx * k;
  const handY = who.y + hy * k;
  const [w, h] = OBJECT_SIZE[obj];
  const [gx, gy] = GRIP[obj];
  return { key: `thing-${obj}`, kind: 'object', object: obj, x: handX - gx * s, y: handY - gy * s, w: w * s, h: h * s, z: who.z + 1, flip: who.flip, ...extra };
}
function bubble(over: Actor, show: string): Actor {
  const w = 150, h = 130;
  return { key: 'thought', kind: 'thought', show, x: Math.min(840, over.x + over.w * 0.45), y: Math.max(10, over.y - h * 0.85), w, h, z: 900, anim: 'bob' };
}
function prop(id: string, x: number, y: number, w: number, h: number, z = 1, key = `prop-${id}`): Actor {
  return { key, kind: 'prop', prop: id, x, y, w, h, z };
}

export const FRIEND_KINDS: FriendId[] = ['otis', 'juniper', 'biscuit'];

export function scene(story: Story, opts: { interactive?: boolean } = {}): Scene {
  const interactive = !!opts.interactive;
  const n = progress(story);
  const w = world(story);
  const actors: Actor[] = [];

  if (!w.place) {
    actors.push(figure('maya', 'maya', [480, 616], 0.8, { pose: 'wave', expr: 'happy', anim: 'idle' }));
    actors.push(figure('pigeon-street', 'pigeon', [140, 616], 0.55, {}));
    if (interactive) {
      (Object.keys(STREET_SPOTS) as PlaceId[]).forEach((id) => {
        const [x, y, rw, rh] = STREET_SPOTS[id].rect;
        actors.push({ key: `spot-${id}`, kind: 'hotspot', x, y, w: rw, h: rh, z: 2000, tap: { step: 'place', id, label: PLACES[id].label } });
      });
    }
    return { backdrop: 'street', time: 'day', weather: 'clear', actors };
  }

  const place = w.place;
  const L = LAYOUT[place];
  const S = L.s;
  const pl = PLACES[place];
  const sc: Scene = { backdrop: place, place, time: 'day', weather: 'clear', actors };
  const flying = (o: ObjectId): Anim => (o === 'balloon' ? 'bob' : o === 'boat' ? 'float' : o === 'kite' ? 'flutter' : 'idle');

  // Round 1 — arrived; three things to notice.
  if (!w.object) {
    actors.push(figure('maya', 'maya', L.maya, S, { pose: 'stand', expr: 'curious', anim: 'idle' }));
    pl.objects.forEach((o) => {
      const spot = L.spots[o]!;
      const a = thing(o, spot, o === 'kite' ? 0.85 : 1, { anim: flying(o) });
      if (interactive) a.tap = { step: 'object', id: o, label: o };
      actors.push(a);
    });
    return sc;
  }

  const obj = w.object;
  const look: Look = w.special && w.special !== 'custom' ? w.special : 'plain';

  // Round 2 — discovery.
  if (!w.twist) {
    const maya = figure('maya', 'maya', L.maya, S, { pose: 'hold', expr: w.special ? 'delighted' : 'surprised' });
    actors.push(maya, held(obj, maya, 0.9, { look }));
    return sc;
  }

  // Round 3 — something unexpected.
  const rain = w.twist === 'rain';
  if (w.twist === 'wind') sc.weather = 'wind';
  if (rain) sc.weather = 'rain';
  if (w.twist === 'wind') actors.push({ key: 'wind', kind: 'wind', x: 0, y: 0, w: 1000, h: 700, z: 950 });
  if (rain) actors.push({ key: 'rain', kind: 'rain', x: 0, y: 0, w: 1000, h: 700, z: 960 });

  const animalKind = pl.animal;
  if (!w.response) {
    if (rain) {
      const maya = figure('maya', 'maya', L.maya, S, { pose: 'hold', expr: 'surprised' });
      actors.push(maya, held(obj, maya, 0.9, { look }));
    } else if (w.twist === 'wind') {
      actors.push(figure('maya', 'maya', L.maya, S, { pose: 'surprised', expr: 'surprised' }));
      actors.push(thing(obj, [L.maya[0] + 190, 250], 0.9, { look, anim: 'tumble' }));
    } else {
      actors.push(figure('maya', 'maya', L.maya, S, { pose: 'surprised', expr: 'surprised' }));
      const an = figure('animal', animalKind, [L.maya[0] + 230, L.maya[1] + 4], 0.95, { anim: 'run', pose: 'run' });
      actors.push(an, thing(obj, [an.x + an.w * 0.86, an.y + an.h * 0.5], 0.55, { look, z: an.z + 1 }));
    }
    return sc;
  }

  // the response
  const resp = w.response;
  const landed = (): Actor => { const [ow, oh] = OBJECT_SIZE[obj]; const k = 0.8; return thing(obj, [L.landing[0], L.landing[1] - (oh * k) / 2], k, { look }); };
  const mayaFor = (): Actor[] => {
    const toward: Pt = [Math.min(L.landing[0] - 210, L.maya[0] + 80), L.maya[1]];
    switch (resp) {
      case 'run': case 'chase': return [figure('maya', 'maya', toward, S, { pose: 'run', expr: 'determined', anim: 'run' })];
      case 'jump': return [figure('maya', 'maya', L.maya, S, { pose: 'jump', expr: 'delighted', anim: 'hop' })];
      case 'watch': return [figure('maya', 'maya', L.maya, S, { pose: 'think', expr: 'curious' })];
      case 'call': return [figure('maya', 'maya', L.maya, S, { pose: 'call', expr: 'calling' })];
      case 'trick': {
        const m = figure('maya', 'maya', toward, S, { pose: 'crouch', expr: 'calm' });
        return [m, prop('crumb', m.x + m.w * 0.76, m.y + m.h * 0.62, 30, 20, m.z + 2)];
      }
      case 'dash': { const m = figure('maya', 'maya', L.shelter, S, { pose: 'hold', expr: 'delighted' }); return [m, held(obj, m, 0.9, { look })]; }
      case 'splash': {
        const at: Pt = [L.shelter[0] + 210, L.shelter[1]];
        const m = figure('maya', 'maya', at, S, { pose: 'splash', expr: 'delighted', anim: 'hop' });
        return [m, prop('puddle', at[0] - 90, at[1] - 16, 180, 34, 5), prop('splash', at[0] - 70, at[1] - 70, 140, 70, m.z + 2)];
      }
      case 'cover': return [figure('maya', 'maya', L.shelter, S, { pose: 'satchelHat', expr: 'happy' })];
    }
  };

  // Round 3 page / round 4 choice — who is there?
  if (!w.friend) {
    actors.push(...mayaFor());
    if (!rain) {
      actors.push(landed());
      if (w.twist === 'animal') actors.push(figure('animal', animalKind, [L.landing[0] + 110, L.landing[1] + 2], 0.95, resp === 'trick' ? { flip: true } : { anim: 'run' }));
    }
    if (interactive) {
      const cx = rain ? Math.min(L.shelter[0] + 330, 820) : Math.min(L.friend[0] - 40, 830);
      const foot = rain ? L.shelter[1] + 4 : L.friend[1];
      FRIEND_KINDS.forEach((f, i) => {
        const fx = cx + (i - 1) * 120;
        actors.push(figure(`friend-${f}`, f, [fx, foot + (i === 1 ? 6 : 0)], S * (f === 'biscuit' ? 1 : 0.9), { flip: true, expr: 'happy', anim: 'idle', tap: { step: 'friend', id: f, label: f } }));
      });
    }
    return sc;
  }

  // Round 4 — a new friend.
  const fid = w.friend;
  const friendFoot: Pt = rain ? [Math.min(L.shelter[0] + 210, 900), L.shelter[1] + 6] : L.friend;
  if (!w.plan) {
    const needExpr = w.need === 'lost' ? 'worried' : w.need === 'lonely' ? 'shy' : w.need === 'searching' ? (fid === 'biscuit' ? 'delighted' : 'surprised') : w.need === 'custom' ? 'worried' : 'surprised';
    const friend = figure('friend', fid, friendFoot, S, { flip: true, expr: needExpr, pose: !rain ? 'hold' : w.need === 'lost' ? 'search' : 'stand' });
    if (fid === 'otis' && w.need === 'lost' && !rain) friend.pose = 'hold';
    const mayaFoot: Pt = rain ? L.shelter : [Math.min(L.maya[0] + 40, friendFoot[0] - 190), L.maya[1]];
    const maya = figure('maya', 'maya', mayaFoot, S, { pose: rain ? 'hold' : 'stand', expr: w.need ? (w.need === 'lost' ? 'worried' : 'curious') : 'happy' });
    actors.push(maya, friend);
    actors.push(rain ? held(obj, maya, 0.9, { look }) : held(obj, friend, fid === 'biscuit' ? 0.6 : 0.85, { look }));
    if (w.need && w.need !== 'custom') actors.push(bubble(friend, w.need === 'lost' ? 'house' : w.need === 'lonely' ? 'friends' : obj));
    return sc;
  }

  // Round 5 — what shall we do?  Round 6 — until next time.
  sc.weather = 'clear';
  sc.actors = actors.filter((a) => a.kind !== 'rain' && a.kind !== 'wind');
  const A = sc.actors;
  const fx = Math.min(L.maya[0] + 230, 900);
  const mFoot: Pt = [fx - 230, L.maya[1]];
  const fFoot: Pt = [fx, L.maya[1] + 4];

  if (!w.ending) {
    const maya = figure('maya', 'maya', mFoot, S, { pose: 'stand', expr: 'happy' });
    const friend = figure('friend', fid, fFoot, S, { flip: true, expr: 'happy', pose: 'stand' });
    switch (w.plan) {
      case 'map': maya.pose = 'hold'; A.push(maya, friend, prop('map', mFoot[0] + 40, maya.y + maya.h * 0.4, 130, 100, 1500)); break;
      case 'ask': maya.pose = 'point'; A.push(figure('baker', 'baker', [mFoot[0] - 230 < 60 ? fFoot[0] + 170 : mFoot[0] - 210, L.maya[1]], S, { pose: 'wave', expr: 'happy', flip: mFoot[0] - 230 < 60 }), maya, friend); break;
      case 'follow': maya.pose = 'point'; friend.expr = 'delighted'; A.push(prop('path', 120, L.maya[1] - 110, 760, 140, 4), maya, friend); break;
      case 'play': maya.pose = 'jump'; maya.expr = 'delighted'; maya.anim = 'hop'; friend.expr = 'delighted'; A.push(prop('hopscotch', mFoot[0] - 150, L.maya[1] - 20, 330, 80, 4), maya, friend); break;
      case 'introduce': maya.pose = 'wave'; friend.expr = 'delighted'; A.push(figure('baker', 'baker', [Math.max(110, mFoot[0] - 230), L.maya[1]], S * 0.95, { pose: 'wave', expr: 'delighted' }), figure('animal', pl.animal, [Math.min(fFoot[0] + 110, 950), L.maya[1] + 6], 0.9, { flip: true }), maya, friend); break;
      case 'share': {
        maya.expr = 'delighted'; friend.expr = 'delighted';
        if (obj === 'kite' || obj === 'balloon') { maya.pose = 'point'; A.push(maya, friend, thing(obj, [(mFoot[0] + fFoot[0]) / 2, 170], 0.8, { look, anim: obj === 'kite' ? 'flutter' : 'bob' })); }
        else { friend.pose = 'hold'; A.push(maya, friend, held(obj, friend, fid === 'biscuit' ? 0.6 : 0.85, { look })); }
        break;
      }
      case 'giveback': friend.pose = 'hold'; friend.expr = 'delighted'; A.push(maya, friend, held(obj, friend, fid === 'biscuit' ? 0.6 : 0.85, { look })); break;
      case 'guess': maya.expr = 'delighted'; friend.expr = 'surprised'; A.push(thing(obj, [mFoot[0] - 70, L.maya[1] - 90], 0.7, { look, z: maya.z - 1 }), maya, friend, bubble(friend, 'search')); break;
      case 'party': maya.pose = 'jump'; maya.expr = 'delighted'; friend.expr = 'delighted'; A.push(prop('bunting', 0, 20, 1000, 120, 980), figure('baker', 'baker', [Math.max(110, mFoot[0] - 230), L.maya[1]], S * 0.95, { pose: 'wave', expr: 'delighted' }), maya, friend); break;
      default: friend.pose = 'hold'; maya.expr = 'delighted'; friend.expr = 'delighted'; A.push(maya, friend, held(obj, friend, fid === 'biscuit' ? 0.6 : 0.85, { look }));
    }
    return sc;
  }

  switch (w.ending) {
    case 'picnic': {
      A.push(prop('picnic', mFoot[0] - 120, L.maya[1] - 92, 320, 118, 3));
      const maya = figure('maya', 'maya', [mFoot[0] + 10, L.maya[1] - 20], S, { pose: 'sit', expr: 'delighted' });
      A.push(maya, figure('friend', fid, fFoot, S, { flip: true, expr: 'delighted', pose: 'stand' }), thing(obj, [mFoot[0] - 120, L.maya[1] - 40], 0.7, { look, z: 2 }));
      break;
    }
    case 'home': {
      sc.time = 'dusk';
      const maya = figure('maya', 'maya', [mFoot[0] + 40, L.maya[1]], S, { pose: 'walk', expr: 'happy', anim: 'walk' });
      const airy = obj === 'kite' || obj === 'balloon';
      A.push(maya, figure('friend', fid, [fFoot[0] + 20, fFoot[1]], S, { expr: 'happy', pose: 'stand', anim: 'walk' }), held(obj, maya, airy ? 0.75 : 0.85, { look, anim: airy ? 'bob' : undefined }));
      break;
    }
    case 'tomorrow': {
      const maya = figure('maya', 'maya', [Math.max(200, mFoot[0] - 60), L.maya[1]], S, { pose: 'wave', expr: 'delighted' });
      A.push(maya, figure('friend', fid, [Math.min(fFoot[0] + 60, 920), fFoot[1]], S * 0.92, { flip: true, expr: 'happy', pose: fid === 'biscuit' ? 'stand' : 'wave' }));
      break;
    }
    default: {
      const maya = figure('maya', 'maya', mFoot, S, { pose: 'hold', expr: 'delighted' });
      A.push(maya, figure('friend', fid, fFoot, S, { flip: true, expr: 'delighted', pose: fid === 'biscuit' ? 'stand' : 'wave' }), held(obj, maya, 0.85, { look }));
    }
  }
  return sc;
}

/** The scene for page `n` (1-based) of the book. */
export function pageScene(story: Story, n: number): Scene {
  const steps = STEPS.indexOf(PAGE_AFTER[n - 1]) + 1;
  return scene(upTo(story, steps));
}

/** A cover vignette: Maya, the friend and the object, with one landmark of the place. */
export function coverScene(story: Story): Scene {
  const w = world(story);
  const place = w.place ?? 'park';
  const obj = w.object ?? 'kite';
  const fid = w.friend ?? 'otis';
  const look: Look = w.special && w.special !== 'custom' ? w.special : 'plain';
  const S = 1.25;
  const maya = figure('maya', 'maya', [400, 640], S, { pose: obj === 'kite' || obj === 'balloon' ? 'point' : 'hold', expr: 'delighted' });
  const friend = figure('friend', fid, [fid === 'biscuit' ? 600 : 620, 646], S * (fid === 'biscuit' ? 1.05 : 0.95), { flip: true, expr: 'delighted', pose: fid === 'biscuit' ? 'stand' : 'wave' });
  const actors: Actor[] = [maya, friend];
  if (obj === 'kite' || obj === 'balloon') actors.push(thing(obj, [520, 210], 1.1, { look, anim: obj === 'kite' ? 'flutter' : 'bob' }));
  else actors.push(held(obj, maya, 1.05, { look }));
  return { backdrop: 'vignette', place, time: w.ending === 'home' ? 'dusk' : 'day', weather: 'clear', actors };
}
