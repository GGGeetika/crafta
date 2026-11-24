'use client';
import { memo } from 'react';
import type { Actor, Scene, Tap } from '@/lib/story/compose';
import type { ObjectId } from '@/lib/story/content';
import { Backdrop } from './backdrops';
import { Vignette } from './vignette';
import { Maya, type Expression, type MayaPose } from './Maya';
import { Baker, Biscuit, Cat, Juniper, Otis, Pigeon, Squirrel, type CastExpr, type CastPose } from './cast';
import { Prop, Rain, Thing, Thought, Wind, type BubbleId, type PropId } from './objects';

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

function Figure({ a }: { a: Actor }) {
  const expr = a.expr as CastExpr | undefined;
  const pose = a.pose as CastPose | undefined;
  switch (a.kind) {
    case 'maya': return <Maya pose={a.pose as MayaPose} expr={a.expr as Expression} />;
    case 'otis': return <Otis expr={expr} pose={pose} />;
    case 'juniper': return <Juniper expr={expr} pose={pose} />;
    case 'biscuit': return <Biscuit expr={expr} pose={pose} />;
    case 'baker': return <Baker expr={expr} pose={pose} />;
    case 'cat': return <Cat run={a.anim === 'run'} />;
    case 'squirrel': return <Squirrel />;
    case 'pigeon': return <Pigeon />;
    case 'object': return <Thing id={a.object as ObjectId} look={a.look} />;
    case 'thought': return <Thought show={a.show as BubbleId} />;
    case 'prop': return <Prop id={a.prop as PropId} />;
    case 'rain': return <Rain />;
    case 'wind': return <Wind />;
    default: return null;
  }
}

const ActorLayer = memo(function ActorLayer({ a }: { a: Actor }) {
  return (
    <div
      className={`actor actor-${a.kind}`}
      data-actor={a.kind}
      data-x={a.x} data-y={a.y} data-w={a.w} data-h={a.h} data-flip={a.flip ? 1 : 0}
      style={{ left: pct(a.x, 1000), top: pct(a.y, 700), width: pct(a.w, 1000), height: pct(a.h, 700), zIndex: Math.round(a.z) }}
    >
      <div className={`actor-in${a.anim ? ` anim-${a.anim}` : ''}`}>
        <div className={`fig${a.flip ? ' flip' : ''}`}><Figure a={a} /></div>
      </div>
    </div>
  );
});

function HitArea({ a, onTap, label }: { a: Actor; onTap: (t: Tap) => void; label: string }) {
  // Generous, forgiving targets: at least 130×130 world units around the thing.
  const w = Math.max(a.w + 30, 130), h = Math.max(a.h + 30, 130);
  const x = a.x + a.w / 2 - w / 2, y = a.y + a.h / 2 - h / 2;
  const place = a.kind === 'hotspot';
  return (
    <div
      role="button"
      tabIndex={0}
      className={`hit${place ? ' hit-place' : ''}`}
      aria-label={label}
      style={{ left: pct(x, 1000), top: pct(y, 700), width: pct(w, 1000), height: pct(h, 700) }}
      onClick={() => onTap(a.tap!)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(a.tap!); } }}
    >
      <span className="hit-ring" aria-hidden="true" />
      {place && <span className="hit-label">{label}</span>}
    </div>
  );
}

export function Stage({ scene, onTap, labels = {}, still = false, className = '', describe }: { scene: Scene; onTap?: (t: Tap) => void; labels?: Record<string, string>; still?: boolean; className?: string; describe?: string }) {
  const sway = !still && scene.weather === 'wind';
  const actors = scene.actors.filter((a) => a.kind !== 'hotspot');
  const taps = onTap ? scene.actors.filter((a) => a.tap) : [];
  return (
    <div className={`stage${still ? ' still' : ''} ${className}`} role="group" aria-label={describe}>
      <div className="stage-back" key={`${scene.backdrop}-${scene.place}`} data-layer="backdrop">
        {scene.backdrop === 'vignette'
          ? <Vignette place={scene.place ?? 'park'} time={scene.time} />
          : <Backdrop id={scene.backdrop} time={scene.time} weather={scene.weather} sway={sway} />}
      </div>
      {actors.map((a) => <ActorLayer key={a.key} a={a} />)}
      {taps.map((a) => <HitArea key={`hit-${a.key}`} a={a} onTap={onTap!} label={labels[a.tap!.id] ?? a.tap!.label} />)}
    </div>
  );
}
