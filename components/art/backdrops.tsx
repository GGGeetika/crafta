import { useId } from 'react';
import { P } from './palette';
import { Ink, Shape } from './defs';
import { Bakery, Bench, Bush, Cloud, Duck, Fence, Flowers, Grass, House, Lamp, Pond, Poplar, Puff, Train, Tree } from './scenery';
import { ruled, scallop } from './shapes';

export type BackdropId = 'street' | 'bakery' | 'park' | 'station';
export type Time = 'day' | 'dusk';
export type Weather = 'clear' | 'wind' | 'rain';
type Props = { time?: Time; weather?: Weather; sway?: boolean };

function Sky({ time = 'day', weather = 'clear' }: Props) {
  const top = weather === 'rain' ? '#c9d2d0' : time === 'dusk' ? '#e9c79a' : P.sky;
  const low = weather === 'rain' ? '#dcdfd6' : time === 'dusk' ? '#efd9b4' : P.paper;
  return (
    <g filter="url(#washy)">
      <rect x="-20" y="-20" width="1040" height="420" fill={top} opacity=".9" />
      <rect x="-20" y="250" width="1040" height="200" fill={low} opacity=".7" />
      {time === 'dusk' && <circle cx="820" cy="300" r="60" fill={P.terracottaLight} opacity=".6" />}
      {time === 'day' && weather !== 'rain' && <circle cx="860" cy="96" r="38" fill={P.ochreLight} opacity=".85" />}
    </g>
  );
}

/** The irregular, painted edge of a picture-book illustration, floating on paper. */
function Frame({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="-40" y="-40" width="1080" height="780">
          <rect x="-40" y="-40" width="1080" height="780" fill="black" />
          <path d="M18 26 Q250 8 500 18 T984 22 Q996 250 988 420 T980 682 Q750 694 500 686 T16 680 Q6 450 12 300 T18 26Z" fill="white" filter="url(#washy)" />
        </mask>
      </defs>
      <g mask={`url(#${id})`}>{children}</g>
    </>
  );
}

function Weather({ time, weather }: Props) {
  return (
    <>
      {time === 'dusk' && <rect width="1000" height="700" fill={P.terracotta} opacity=".09" />}
      {weather === 'rain' && <rect width="1000" height="700" fill={P.blue} opacity=".12" />}
    </>
  );
}

function Svg({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 1000 700" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

export function StreetBackdrop({ time = 'day', weather = 'clear', sway }: Props) {
  const id = useId().replace(/:/g, '');
  const lit = time === 'dusk';
  return (
    <Svg label="Maple Street: Little Crumb bakery on the left, the train station up on the hill, and the park on the right.">
      <Frame id={`f${id}`}>
        <rect width="1000" height="700" fill={P.paper} />
        <Sky time={time} weather={weather} />
        <g filter="url(#ink)">
          {weather !== 'rain' && <><Cloud x={210} y={96} w={150} seed={3} /><Cloud x={640} y={70} w={110} seed={8} /></>}
          <Shape d="M-10 340 Q120 270 260 300 T520 262 T780 286 T1010 270 V420 H-10Z" fill={P.sageLight} op={0.85} sw={2} />
          <Poplar x={110} y={310} h={110} seed={2} /><Poplar x={140} y={306} h={90} seed={5} /><Poplar x={850} y={290} h={100} seed={9} />
          {/* station on the hill */}
          <g>
            <Shape d="M382 338 V212 H618 V338Z" fill={P.cream} sw={2.2} />
            <Shape d="M366 214 L500 160 L634 214Z" fill={P.terracotta} sw={2.2} />
            <circle cx="500" cy="196" r="13" fill={P.white} stroke={P.ink} strokeWidth="2" />
            <Ink d="M500 188 v8 l6 4" sw={1.6} />
            {[404, 446, 532, 574].map((x) => <Shape key={x} d={`M${x} 290 v-44 q11 -12 22 0 v44z`} fill={lit ? P.ochreLight : P.blueLight} sw={1.8} />)}
            <Shape d="M478 338 v-60 q22 -18 44 0 v60z" fill={P.forestLight} sw={2} />
            <Shape d="M428 236 h144 v-16 h-144z" fill={P.forest} sw={1.6} />
            <text x="500" y="233" textAnchor="middle" fill={P.cream} style={{ fontFamily: 'var(--font-ui), sans-serif', fontWeight: 800, fontSize: 11, letterSpacing: 2 }}>MAPLE STREET</text>
          </g>
          <Ink d="M-10 350 H1010 M-10 358 H1010" sw={2} />
          <Train x={600} y={352} s={0.5} lit={lit} />
          <Puff x={790} y={258} w={44} seed={2} /><Puff x={826} y={232} w={34} seed={4} />
          {/* park lawn */}
          <Shape d="M640 560 V380 Q760 352 1010 372 V560Z" fill={P.sage} op={0.9} sw={2} />
          <Tree x={770} y={520} h={330} w={230} seed={12} sway={sway} />
          <Tree x={935} y={500} h={270} w={190} seed={21} color={P.sageLight} sway={sway} />
          <Pond x={660} y={500} w={130} h={34} />
          <Fence x={648} y={560} w={350} />
          {/* houses between */}
          <House x={346} y={560} w={150} h={150} wall={P.blueLight} door={P.forestLight} seed={1} chimney={false} />
          <House x={500} y={560} w={140} h={140} wall={P.ochreLight} door={P.terracotta} seed={2} />
          <Bush x={505} y={562} w={60} flowers seed={8} />
          {/* bakery */}
          <Bakery x={22} y={560} s={0.64} lit={lit} />
          {/* pavement and road */}
          <Shape d="M-10 560 H1010 V626 H-10Z" fill={P.stone} sw={2} />
          <Ink d={`${ruled(-10, 626, 1010, 626, 3)} M80 560 l-14 66 M260 560 l-14 66 M440 560 l-14 66 M620 560 l-14 66 M800 560 l-14 66`} sw={1.6} op={0.7} />
          <rect x="-10" y="628" width="1020" height="80" fill={P.stoneDark} opacity=".55" />
          <Ink d="M40 668 h60 M200 668 h60 M360 668 h60 M520 668 h60 M680 668 h60 M840 668 h60" sw={3} color={P.cream} op={0.9} />
          <Lamp x={330} y={598} lit={lit} s={0.95} />
          <Lamp x={652} y={598} lit={lit} s={0.95} />
          {/* street sign */}
          <Ink d="M600 598 v-120" sw={3} />
          <Shape d="M566 476 h70 v-22 h-70z" fill={P.forest} sw={1.8} />
          <text x="601" y="470" textAnchor="middle" fill={P.cream} style={{ fontFamily: 'var(--font-display), Georgia, serif', fontStyle: 'italic', fontSize: 14 }}>Maple St.</text>
          <Grass x={20} y={600} seed={2} /><Grass x={930} y={598} seed={5} />
        </g>
        <Weather time={time} weather={weather} />
      </Frame>
    </Svg>
  );
}

export function BakeryBackdrop({ time = 'day', weather = 'clear', sway }: Props) {
  const id = useId().replace(/:/g, '');
  const lit = time === 'dusk';
  return (
    <Svg label="Outside Little Crumb, the bakery, with its striped awning, a lamp post and a bench.">
      <Frame id={`f${id}`}>
        <rect width="1000" height="700" fill={P.paper} />
        <Sky time={time} weather={weather} />
        <g filter="url(#ink)">
          {weather !== 'rain' && <Cloud x={760} y={120} w={140} seed={14} />}
          <House x={872} y={596} w={200} h={420} wall={P.blueLight} door={P.forest} seed={4} />
          <Tree x={700} y={594} h={330} w={210} seed={31} sway={sway} />
          <Bakery x={30} y={596} s={1.06} lit={lit} />
          <Shape d="M-10 594 H1010 V660 H-10Z" fill={P.stone} sw={2} />
          <Ink d={`${ruled(-10, 660, 1010, 660, 8)} M130 594 l-10 66 M330 594 l-10 66 M560 594 l-10 66 M780 594 l-10 66`} sw={1.6} op={0.7} />
          <rect x="-10" y="662" width="1020" height="60" fill={P.stoneDark} opacity=".55" />
          <Bench x={744} y={630} />
          <Lamp x={640} y={634} lit={lit} />
          <Bush x={612} y={600} w={70} seed={9} flowers />
          <Flowers x={40} y={596} n={4} seed={3} />
        </g>
        <Weather time={time} weather={weather} />
      </Frame>
    </Svg>
  );
}

export function ParkBackdrop({ time = 'day', weather = 'clear', sway }: Props) {
  const id = useId().replace(/:/g, '');
  const lit = time === 'dusk';
  return (
    <Svg label="The park: a big old tree, a bench, a duck pond and soft green hills.">
      <Frame id={`f${id}`}>
        <rect width="1000" height="700" fill={P.paper} />
        <Sky time={time} weather={weather} />
        <g filter="url(#ink)">
          {weather !== 'rain' && <><Cloud x={540} y={90} w={160} seed={21} /><Cloud x={880} y={190} w={100} seed={6} /></>}
          <Shape d="M-10 360 Q200 300 420 330 T1010 310 V460 H-10Z" fill={P.sageLight} op={0.9} sw={2} />
          {[560, 600, 640, 900, 940].map((x, i) => <Poplar key={x} x={x} y={350 - (i % 2) * 8} h={110 + (i % 3) * 18} seed={x} />)}
          <Shape d="M-10 420 Q300 380 600 404 T1010 396 V710 H-10Z" fill={P.sage} op={0.92} sw={2} />
          <Fence x={420} y={430} w={560} s={0.8} />
          <Shape d="M380 710 Q470 600 560 560 T840 452 L880 456 Q700 540 640 600 T520 710Z" fill={P.cream} op={0.95} sw={2} />
          <Pond x={600} y={590} w={360} h={96} />
          <Duck x={650} y={588} s={0.9} /><Duck x={890} y={604} s={0.8} flip />
          <Tree x={190} y={560} h={470} w={360} seed={44} sway={sway} />
          <Bench x={330} y={580} />
          <Bush x={40} y={600} w={110} seed={12} flowers /><Bush x={960} y={460} w={90} seed={2} />
          <Flowers x={460} y={600} n={5} seed={6} />
          <Lamp x={560} y={560} lit={lit} s={0.9} />
          <Grass x={60} y={660} seed={1} /><Grass x={300} y={690} seed={3} /><Grass x={780} y={690} seed={4} /><Grass x={900} y={672} seed={9} />
        </g>
        <Weather time={time} weather={weather} />
      </Frame>
    </Svg>
  );
}

export function StationBackdrop({ time = 'day', weather = 'clear' }: Props) {
  const id = useId().replace(/:/g, '');
  const lit = time === 'dusk';
  const arch = (x: number) => <Shape key={x} d={`M${x} 470 V300 q60 -64 120 0 V470z`} fill={lit ? P.ochreLight : P.blueLight} op={0.85} sw={2.2} />;
  return (
    <Svg label="Maple Street station: a brick hall with a big clock, a bench on the platform and the railway beyond.">
      <Frame id={`f${id}`}>
        <rect width="1000" height="700" fill={P.paper} />
        <Sky time={time} weather={weather} />
        <g filter="url(#ink)">
          <Shape d="M-10 130 H1010 V580 H-10Z" fill="#d9a88c" sw={2} />
          <Ink d="M60 200 h24 M80 212 h24 M900 190 h24 M920 202 h24 M380 520 h24 M640 540 h24 M600 528 h24" sw={1.4} op={0.45} />
          {arch(60)}{arch(820)}
          <Ink d="M120 470 V300 M60 380 H180 M880 470 V300 M820 380 H940" sw={1.6} />
          <circle cx="500" cy="236" r="62" fill={P.white} stroke={P.ink} strokeWidth="3" />
          <circle cx="500" cy="236" r="54" fill="none" stroke={P.ink} strokeWidth="1.2" opacity=".5" />
          <Ink d="M500 236 V196 M500 236 l26 14" sw={3} />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => <path key={i} d={`M${(500 + 48 * Math.sin((i * Math.PI) / 6)).toFixed(1)} ${(236 - 48 * Math.cos((i * Math.PI) / 6)).toFixed(1)} l${(4 * Math.sin((i * Math.PI) / 6)).toFixed(1)} ${(-4 * Math.cos((i * Math.PI) / 6)).toFixed(1)}`} stroke={P.ink} strokeWidth="2" />)}
          <Shape d="M360 316 H640 V364 H360Z" fill={P.forest} sw={2.2} />
          <text x="500" y="349" textAnchor="middle" fill={P.cream} style={{ fontFamily: 'var(--font-ui), sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: 5 }}>MAPLE STREET</text>
          <Shape d="M220 560 V400 H340 V560Z" fill={P.cream} sw={2.2} />
          <Shape d="M236 470 V420 H324 V470Z" fill={lit ? P.ochreLight : P.blueLight} sw={2} />
          <Shape d="M226 470 h108 v8 h-108z" fill={P.wood} sw={1.6} />
          <text x="280" y="414" textAnchor="middle" fill={P.ink} style={{ fontFamily: 'var(--font-display), Georgia, serif', fontStyle: 'italic', fontSize: 15 }}>Tickets</text>
          {/* a travel poster and the timetable: small things to notice */}
          <Shape d="M660 404 H760 V530 H660Z" fill={P.white} sw={2} />
          <Shape d="M668 470 q20 -22 42 -6 q16 -14 42 0 V490 H668Z" fill={P.sage} sw={1.6} />
          <Shape d="M668 490 H752 V522 H668Z" fill={P.blue} sw={1.6} op={0.8} />
          <circle cx="736" cy="438" r="12" fill={P.ochre} stroke={P.ink} strokeWidth="1.6" />
          <Ink d="M684 506 q6 -6 12 0 M712 512 q6 -6 12 0" sw={1.4} color={P.white} />
          <text x="694" y="430" textAnchor="middle" fill={P.ink} style={{ fontFamily: 'var(--font-display), Georgia, serif', fontStyle: 'italic', fontSize: 13 }}>By the Sea</text>
          <Shape d="M384 420 H470 V520 H384Z" fill="#2c3a33" sw={2} />
          <Ink d="M396 440 h40 M396 456 h60 M396 472 h50 M396 488 h56 M396 504 h36" sw={2} color={P.cream} op={0.8} />
          {/* canopy */}
          <Shape d="M-10 -10 H1010 V96 H-10Z" fill={P.forestLight} sw={2.2} />
          <Shape d="M-10 96 H1010 l0 18 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 q-25 14 -50 0 z" fill={P.cream} sw={2} />
          {[160, 840].map((x) => (
            <g key={x}>
              <Ink d={`M${x} 110 V582`} sw={10} />
              <Ink d={`M${x} 110 V582`} sw={5} color={P.forestLight} />
              <Ink d={`M${x - 40} 112 q40 10 40 50 q0 -40 40 -50`} sw={2.4} />
            </g>
          ))}
          {[330, 670].map((x) => (
            <g key={x}>
              <Ink d={`M${x} 110 v40`} sw={1.8} />
              <Shape d={`M${x - 12} 150 h24 l-4 24 h-16z`} fill={lit ? P.ochreLight : P.cream} sw={1.8} />
              {lit && <circle cx={x} cy={170} r="30" fill={P.ochreLight} opacity=".3" />}
            </g>
          ))}
          {/* platform */}
          <Shape d="M-10 576 H1010 V610 H-10Z" fill={P.stone} sw={2} />
          <rect x="-10" y="598" width="1020" height="8" fill={P.ochre} opacity=".85" />
          <rect x="-10" y="612" width="1020" height="100" fill={P.stoneDark} opacity=".6" />
          <Ink d="M-10 640 H1010 M-10 676 H1010" sw={3} />
          <Ink d={Array.from({ length: 22 }, (_, i) => `M${i * 48 - 6} 630 l-6 56`).join(' ')} sw={2} op={0.5} />
          <Bench x={600} y={600} />
          <Bush x={410} y={584} w={56} seed={3} /><Bush x={960} y={584} w={56} seed={6} />
          <Shape d="M392 584 h36 l-4 -22 h-28z" fill={P.terracotta} sw={1.8} />
          <Shape d="M942 584 h36 l-4 -22 h-28z" fill={P.terracotta} sw={1.8} />
        </g>
        <Weather time={time} weather={weather} />
      </Frame>
    </Svg>
  );
}

export function Backdrop({ id, ...rest }: Props & { id: BackdropId }) {
  if (id === 'bakery') return <BakeryBackdrop {...rest} />;
  if (id === 'park') return <ParkBackdrop {...rest} />;
  if (id === 'station') return <StationBackdrop {...rest} />;
  return <StreetBackdrop {...rest} />;
}

export { scallop };
