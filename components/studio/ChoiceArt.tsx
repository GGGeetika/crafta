'use client';
import type { OptionArt } from '@/lib/story/engine';
import { PLACES } from '@/lib/story/content';
import { P } from '../art/palette';
import { Ink, Shape } from '../art/defs';
import { Maya, type Expression, type MayaPose } from '../art/Maya';
import { Baker, Biscuit, Cat, Juniper, Otis, Pigeon, Squirrel } from '../art/cast';
import { Prop, Thing, Thought } from '../art/objects';
import { Bakery, Cloud, Lamp, Train, Tree } from '../art/scenery';

const POSE: Record<string, [MayaPose, Expression]> = {
  run: ['run', 'determined'], jump: ['jump', 'delighted'], watch: ['think', 'curious'], chase: ['run', 'delighted'], call: ['call', 'calling'],
  trick: ['crouch', 'calm'], dash: ['run', 'happy'], splash: ['splash', 'delighted'], cover: ['satchelHat', 'happy'],
};

function Box({ children, vb }: { children: React.ReactNode; vb: string }) {
  return <svg viewBox={vb} width="100%" height="100%" aria-hidden="true" overflow="visible"><g filter="url(#ink)">{children}</g></svg>;
}

export function ChoiceArt({ art }: { art: OptionArt }) {
  switch (art.kind) {
    case 'place':
      if (art.id === 'bakery') return <Box vb="0 0 520 500"><Bakery x={0} y={500} /></Box>;
      if (art.id === 'park') return <Box vb="-200 -440 400 450"><Tree x={0} y={0} h={420} w={330} seed={44} /></Box>;
      return <Box vb="-10 -170 400 180"><Train x={0} y={0} /></Box>;
    case 'object': return <Thing id={art.id} />;
    case 'look': return <Thing id={art.object} look={art.id} />;
    case 'twist':
      if (art.id === 'wind') return <Box vb="0 0 120 100"><Ink d="M10 34 q34 -14 64 0 q16 8 24 -4 q4 -8 -4 -10 M16 58 q40 -10 84 2 M24 80 q24 -8 50 0" sw={4} /><Shape d="M86 66 q8 -10 18 -3 q-5 11 -18 3z" fill={P.ochre} sw={2.4} /></Box>;
      if (art.id === 'rain') return <Box vb="-70 -40 140 120"><Cloud x={0} y={0} w={120} seed={3} /><Ink d="M-34 26 l-6 16 M-6 30 l-6 16 M22 26 l-6 16 M-20 54 l-6 16 M10 56 l-6 16 M38 52 l-6 16" sw={4} color={P.blue} /></Box>;
      { const a = PLACES[art.place].animal; return a === 'cat' ? <Cat run /> : a === 'squirrel' ? <Squirrel /> : <Pigeon />; }
    case 'pose': { const [p, e] = POSE[art.id] ?? ['stand', 'happy']; return <Maya pose={p} expr={e} />; }
    case 'friend':
      return <div className="portrait">{art.id === 'otis' ? <Otis /> : art.id === 'juniper' ? <Juniper /> : <Biscuit />}</div>;
    case 'need':
      return <Thought show={art.id === 'lost' ? 'house' : art.id === 'lonely' ? 'friends' : art.object} />;
    case 'plan':
      switch (art.id) {
        case 'map': return <Prop id="map" />;
        case 'ask': case 'introduce': return <div className="portrait"><Baker pose="wave" /></div>;
        case 'follow': return <Box vb="0 0 120 100"><Ink d="M10 80 q30 -40 60 -20 q20 14 40 -30" sw={4} color={P.terracotta} /><Ink d="M98 30 l12 0 l-2 12" sw={4} color={P.terracotta} /></Box>;
        case 'play': return <Box vb="0 0 120 100"><Ink d="M20 70 h80 v-24 h-80z M47 46 v24 M74 46 v24 M47 46 v-24 h27 v24" sw={4} color={P.forest} /></Box>;
        case 'guess': return <Thought show="search" />;
        case 'party': return <Box vb="0 0 120 100"><Ink d="M4 30 Q60 56 116 30" sw={2.4} />{[16, 40, 64, 88].map((x, i) => <Shape key={x} d={`M${x} ${36 + (i % 2) * 6} h18 l-9 22z`} fill={[P.terracotta, P.ochre, P.blue, P.cream][i]} sw={2} />)}</Box>;
        default: return <Thing id={art.object} />;
      }
    case 'ending':
      if (art.id === 'picnic') return <Prop id="picnic" />;
      if (art.id === 'home') return <Box vb="-60 -280 120 290"><Lamp x={0} y={0} lit /></Box>;
      return <Maya pose="wave" expr="delighted" />;
    default: return null;
  }
}
