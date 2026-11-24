'use client';
import { Maya, HeroHead, type MayaPose, type Expression } from '@/components/art/Maya';
import { HAIRS, SKINS, HAIR_COLORS, COATS, type HeroLook } from '@/lib/story/hero';
const heroes: HeroLook[] = HAIRS.flatMap((hair, i) => [0, 1].map((k) => ({ hair, skin: SKINS[(i * 2 + k) % 5], hairColor: HAIR_COLORS[(i + k * 2) % 4], coat: COATS[(i + k) % 4], glasses: (i + k) % 3 === 0 })));
import { Backdrop, type BackdropId } from '@/components/art/backdrops';
import { Otis, Juniper, Biscuit, Baker, Cat, Squirrel, Pigeon, type CastExpr } from '@/components/art/cast';
import { Thing, Thought, Prop, OBJECT_BOX, type ObjectId, type PropId } from '@/components/art/objects';
const castExprs: CastExpr[] = ['happy', 'worried', 'shy', 'surprised', 'delighted'];
const objs = Object.keys(OBJECT_BOX) as ObjectId[];

const poses: MayaPose[] = ['stand', 'walk', 'wave', 'point', 'run', 'jump', 'crouch', 'call', 'surprised', 'hold', 'satchelHat', 'splash', 'sit', 'think'];
const exprs: Expression[] = ['happy', 'curious', 'surprised', 'delighted', 'worried', 'calling', 'calm', 'determined'];
const scenes: BackdropId[] = ['street', 'bakery', 'park', 'station'];

export default function ModelSheet() {
  return (
    <main className="sheet">
      <h1>Crafta studio — model sheet</h1>
      <p>Heroes — built from parts</p>
      <div className="sheet-row" style={{ alignItems: 'flex-end' }}>
        {heroes.map((l, i) => <figure key={i}><div style={{ width: 120, height: 172 }}><Maya look={l} pose={(['stand', 'wave', 'run', 'hold', 'jump'] as MayaPose[])[i % 5]} expr={(['happy', 'delighted', 'determined', 'curious', 'delighted'] as Expression[])[i % 5]} /></div><figcaption>{l.hair} · {l.skin}</figcaption></figure>)}
      </div>
      <div className="sheet-row">
        {heroes.map((l, i) => <div key={i} style={{ width: 90, height: 90 }}><HeroHead look={l} /></div>)}
      </div>
      <p>Maple Street</p>
      <div className="sheet-row">
        {scenes.map((s) => (
          <div key={s} style={{ position: 'relative', width: 640, height: 448 }}>
            <Backdrop id={s} />
            <div style={{ position: 'absolute', left: '44%', top: '57%', width: '16%' }}><div style={{ aspectRatio: '160/230' }}><Maya pose="wave" /></div></div>
          </div>
        ))}
      </div>
      <p>The cast</p>
      <div className="sheet-row" style={{ alignItems: 'flex-end' }}>
        {castExprs.map((e) => <figure key={'o' + e}><div style={{ width: 120, height: 212 }}><Otis expr={e} pose={e === 'worried' ? 'search' : e === 'delighted' ? 'wave' : 'stand'} /></div><figcaption>Otis {e}</figcaption></figure>)}
        {castExprs.map((e) => <figure key={'j' + e}><div style={{ width: 110, height: 165 }}><Juniper expr={e} pose={e === 'worried' ? 'search' : e === 'delighted' ? 'wave' : 'stand'} /></div><figcaption>Juniper {e}</figcaption></figure>)}
      </div>
      <div className="sheet-row" style={{ alignItems: 'flex-end' }}>
        {castExprs.map((e) => <figure key={'b' + e}><div style={{ width: 150, height: 120 }}><Biscuit expr={e} /></div><figcaption>Biscuit {e}</figcaption></figure>)}
        <figure><div style={{ width: 130, height: 210 }}><Baker pose="wave" /></div><figcaption>Mrs. Penny</figcaption></figure>
        <figure><div style={{ width: 130, height: 100 }}><Cat run /></div><figcaption>cat</figcaption></figure>
        <figure><div style={{ width: 110, height: 110 }}><Squirrel /></div><figcaption>squirrel</figcaption></figure>
        <figure><div style={{ width: 100, height: 90 }}><Pigeon /></div><figcaption>pigeon</figcaption></figure>
        <figure><div style={{ width: 120, height: 210 }}><Otis pose="sit" /></div><figcaption>Otis sit</figcaption></figure>
        <figure><div style={{ width: 110, height: 165 }}><Juniper pose="sit" /></div><figcaption>Juniper sit</figcaption></figure>
      </div>
      <p>Objects — plain / note / old / curious</p>
      <div className="sheet-row" style={{ alignItems: 'flex-end' }}>
        {objs.map((o) => <figure key={o}><div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>{(['plain', 'note', 'old'] as const).map((l) => <div key={l} style={{ width: OBJECT_BOX[o][0], height: OBJECT_BOX[o][1] }}><Thing id={o} look={l} /></div>)}</div><figcaption>{o}</figcaption></figure>)}
      </div>
      <p>Props</p>
      <div className="sheet-row" style={{ alignItems: 'flex-end', background: '#a3b392', padding: 10 }}>
        {(['house', 'friends', 'search', 'kite'] as const).map((b) => <div key={b} style={{ width: 150, height: 130 }}><Thought show={b} /></div>)}
        {(['map', 'hopscotch', 'picnic', 'puddle', 'splash'] as PropId[]).map((p) => <div key={p} style={{ width: 200, height: 90 }}><Prop id={p} /></div>)}
      </div>
      <p>Maya — poses</p>
      <div className="sheet-row">
        {poses.map((p) => (
          <figure key={p}><div style={{ width: 160, height: 230 }}><Maya pose={p} expr={p === 'surprised' ? 'surprised' : p === 'call' ? 'calling' : 'happy'} /></div><figcaption>{p}</figcaption></figure>
        ))}
      </div>
      <p>Maya — expressions</p>
      <div className="sheet-row">
        {exprs.map((e) => (
          <figure key={e}><div style={{ width: 160, height: 130, overflow: 'hidden' }}><div style={{ width: 320, height: 460, marginLeft: -80, marginTop: -40 }}><Maya expr={e} /></div></div><figcaption>{e}</figcaption></figure>
        ))}
      </div>
    </main>
  );
}
