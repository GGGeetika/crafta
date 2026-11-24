import { P } from './palette';
import { Shape } from './defs';
import { Bakery, Bush, Flowers, Grass, Lamp, Train, Tree } from './scenery';
import { scallop } from './shapes';
import type { PlaceId } from '@/lib/story/content';

/** A cover spot-illustration: a patch of ground and one landmark from where the story happened. */
export function Vignette({ place, time = 'day' }: { place: PlaceId; time?: 'day' | 'dusk' }) {
  const lit = time === 'dusk';
  const ground = place === 'park' ? P.sage : P.stone;
  return (
    <svg viewBox="0 0 1000 700" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g filter="url(#washy)">
        <path d={scallop(500, 330, 380, 300, 14, 0.06, 4)} fill={lit ? '#ecd2a6' : P.sky} opacity=".8" />
      </g>
      <g filter="url(#ink)">
        {place === 'park' && <>
          <Tree x={230} y={640} h={460} w={320} seed={44} />
          <Bush x={820} y={650} w={120} seed={12} flowers />
        </>}
        {place === 'bakery' && <>
          <Bakery x={60} y={640} s={0.62} lit={lit} />
          <Bush x={850} y={650} w={110} seed={9} flowers />
        </>}
        {place === 'station' && <>
          <Train x={90} y={560} s={0.62} lit={lit} />
          <path d="M60 566 H520" stroke={P.ink} strokeWidth="2.4" />
        </>}
        {place !== 'park' && <Lamp x={880} y={650} lit={lit} />}
        <Shape d="M120 650 Q300 610 520 622 T900 640 Q910 690 500 690 Q100 690 120 650Z" fill={ground} op={0.9} sw={2.2} />
        <Flowers x={150} y={660} n={4} seed={2} />
        <Grass x={700} y={676} seed={4} />
      </g>
    </svg>
  );
}
