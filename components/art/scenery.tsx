import { P } from './palette';
import { Ink, Shape } from './defs';
import { leafMarks, ruled, scallop } from './shapes';

type G = { x?: number; y?: number; s?: number; flip?: boolean };
const tf = ({ x = 0, y = 0, s = 1, flip }: G) => `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`;

/** A broad-crowned street tree. Origin: base of trunk. */
export function Tree({ seed = 1, h = 300, w = 220, color = P.sage, sway = false, ...g }: G & { seed?: number; h?: number; w?: number; color?: string; sway?: boolean }) {
  const crown = scallop(0, -h + w * 0.42, w / 2, w * 0.42, 11, 0.2, seed);
  const t = Math.max(8, h * 0.032);
  const under = `M${-w * 0.36} ${-h + w * 0.62} q${w * 0.36} ${w * 0.16} ${w * 0.72} 0`;
  return (
    <g transform={tf(g)}>
      <Shape d={`M${-t} 0 q${t * 0.3} -${h * 0.3} ${-t * 0.35} -${h * 0.56} l${t * 1.3} 0 q-${t * 0.4} ${h * 0.3} ${t * 1.05} ${h * 0.56} z`} fill={P.wood} sw={2.2} />
      <Ink d={`M0 -${h * 0.45} q-20 -18 -34 -40 M3 -${h * 0.5} q18 -16 30 -36`} sw={2.2} />
      <g className={sway ? 'sway' : undefined} style={{ transformOrigin: `0px -${h * 0.5}px` }}>
        <Shape d={crown} fill={color} sw={2.3} op={1} />
        <Ink d={under} sw={1.6} op={0.5} />
        <Ink d={leafMarks(0, -h + w * 0.42, w * 0.42, w * 0.33, 16, seed + 2, 9)} sw={1.6} op={0.55} />
      </g>
    </g>
  );
}

/** A tall poplar / cypress for the distance. */
export function Poplar({ seed = 2, h = 160, ...g }: G & { seed?: number; h?: number }) {
  return (
    <g transform={tf(g)}>
      <Ink d={`M0 0 v-${h * 0.25}`} sw={2.4} />
      <Shape d={scallop(0, -h * 0.6, h * 0.17, h * 0.42, 9, 0.12, seed)} fill={P.forestLight} sw={2} op={0.8} />
    </g>
  );
}

export function Bush({ seed = 4, w = 90, color = P.sage, flowers = false, ...g }: G & { seed?: number; w?: number; color?: string; flowers?: boolean }) {
  return (
    <g transform={tf(g)}>
      <Shape d={scallop(0, -w * 0.28, w / 2, w * 0.32, 8, 0.25, seed, true)} fill={color} sw={2.1} />
      {flowers && [[-20, -30], [8, -42], [24, -22], [-4, -18]].map(([a, b], i) => <circle key={i} cx={a * w / 90} cy={b * w / 90} r="3.4" fill={P.terracotta} stroke={P.ink} strokeWidth="1.2" />)}
    </g>
  );
}

export function Lamp({ lit = false, ...g }: G & { lit?: boolean }) {
  return (
    <g transform={tf(g)}>
      {lit && <circle cx="0" cy="-232" r="46" fill={P.ochreLight} opacity=".35" />}
      <Shape d="M-14 0 h28 l-4 -14 h-20z" fill={P.forest} sw={2} />
      <Ink d="M0 -14 V-212" sw={5} color={P.ink} />
      <Ink d="M0 -14 V-212" sw={2.4} color={P.forestLight} />
      <Ink d="M0 -190 q-14 -6 -18 -22" sw={1.8} />
      <Shape d="M-13 -214 h26 l-5 -30 h-16z" fill={lit ? P.ochreLight : P.cream} sw={2} />
      <Shape d="M-17 -244 q17 -16 34 0z" fill={P.forest} sw={2} />
      <Ink d="M0 -256 v-6" sw={2} />
    </g>
  );
}

export function Bench({ ...g }: G) {
  return (
    <g transform={tf(g)}>
      <Ink d="M10 0 l4 -38 M150 0 l-4 -38 M18 -38 l-6 -40 M142 -38 l6 -40" sw={4} />
      <Shape d="M0 -38 h160 v-9 h-160z" fill={P.wood} sw={2} />
      <Shape d="M6 -62 h148 v-8 h-148z" fill={P.wood} sw={2} />
      <Shape d="M6 -80 h148 v-8 h-148z" fill={P.wood} sw={2} />
    </g>
  );
}

export function Cloud({ seed = 5, w = 130, ...g }: G & { seed?: number; w?: number }) {
  return (
    <g transform={tf(g)}>
      <Shape d={scallop(0, 0, w / 2, w * 0.2, 9, 0.35, seed, true)} fill={P.white} sw={1.8} lineOp={0.6} />
    </g>
  );
}

export function Flowers({ n = 5, seed = 1, color = P.terracotta, ...g }: G & { n?: number; seed?: number; color?: string }) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const x = i * 13 + ((seed * 7 + i * 5) % 6), h = 16 + ((seed + i * 3) % 9);
    out.push(<g key={i}><Ink d={`M${x} 0 q-2 -${h / 2} 0 -${h}`} sw={1.5} color={P.forest} /><circle cx={x} cy={-h} r="3.2" fill={i % 2 ? P.ochre : color} stroke={P.ink} strokeWidth="1.2" /></g>);
  }
  return <g transform={tf(g)}>{out}</g>;
}

/** A terraced townhouse on Maple Street. Origin: bottom-left. */
export function House({ w = 170, h = 250, wall = P.blueLight, door = P.terracotta, roof = P.stoneDark, seed = 1, chimney = true, ...g }: G & { w?: number; h?: number; wall?: string; door?: string; roof?: string; seed?: number; chimney?: boolean }) {
  const win = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <Shape d={`M${x} ${y} h34 v42 h-34z`} fill={P.white} sw={2} />
      <Ink d={`M${x + 17} ${y} v42 M${x} ${y + 20} h34`} sw={1.5} />
      <Shape d={`M${x - 4} ${y + 42} h42 v6 h-42z`} fill={P.cream} sw={1.6} />
    </g>
  );
  return (
    <g transform={tf(g)}>
      {chimney && <Shape d={`M${w * 0.7} ${-h - 16} v-34 h22 v34z`} fill={P.brick} sw={2} />}
      <Shape d={`M-6 ${-h} L${w / 2} ${-h - 60} L${w + 6} ${-h} z`} fill={roof} sw={2.2} />
      <Shape d={`M0 0 V${-h} H${w} V0z`} fill={wall} sw={2.3} />
      {win(22, -h + 28)}
      {win(w - 56, -h + 28)}
      {h > 200 && win(22, -h + 118)}
      <Shape d={`M${w - 66} 0 v-86 q22 -18 44 0 v86z`} fill={door} sw={2.2} />
      <circle cx={w - 30} cy={-42} r="2.2" fill={P.ochre} stroke={P.ink} strokeWidth="1.2" />
      <Ink d={ruled(w - 70, -2, w - 18, -2, seed)} sw={3} />
      <Ink d={`M${w * 0.18} ${-h + 100} q8 3 0 6 M${w * 0.6} ${-h + 150} q8 3 0 6`} sw={1.2} op={0.4} />
    </g>
  );
}

/** Little Crumb, the bakery on Maple Street. Origin: bottom-left, 520 wide × 500 tall. */
export function Bakery({ lit = false, ...g }: G & { lit?: boolean }) {
  const stripes = [];
  for (let i = 0; i < 8; i++) {
    const x = 34 + i * 57;
    stripes.push(<Shape key={i} d={`M${x} 262 h57 l3 46 q-31 20 -63 0z`} fill={i % 2 ? P.cream : P.terracotta} sw={2} />);
  }
  const loaf = (x: number, y: number, k: number) => <g key={`${x}${y}`}><Shape d={`M${x} ${y} q16 -18 34 0 q2 6 -4 6 h-26 q-6 0 -4 -6z`} fill={k ? P.ochre : P.ochreLight} sw={1.8} /><Ink d={`M${x + 9} ${y - 4} l4 -5 M${x + 17} ${y - 6} l4 -5 M${x + 25} ${y - 4} l3 -5`} sw={1.3} /></g>;
  return (
    <g transform={`${tf(g)} translate(0 -500)`}>
      <Shape d="M396 30 v-44 h40 v44z" fill={P.brick} sw={2.2} />
      <Shape d="M0 52 h520 v-22 h-520z" fill={P.stone} sw={2.2} />
      <Shape d="M12 52 H508 V500 H12z" fill="#e2b59a" sw={2.3} />
      {/* bricks, a few, the way an illustrator suggests rather than counts */}
      <Ink d="M40 92 h22 M70 104 h22 M440 88 h22 M455 100 h22 M230 180 h22 M250 192 h22 M30 170 h20" sw={1.4} op={0.45} />
      {[90, 330].map((x) => (
        <g key={x}>
          <Shape d={`M${x} 74 h100 v96 h-100z`} fill={lit ? P.ochreLight : P.white} sw={2.2} />
          <Ink d={`M${x + 50} 74 v96 M${x} 120 h100`} sw={1.6} />
          <Shape d={`M${x - 8} 170 h116 v14 h-116z`} fill={P.wood} sw={1.8} />
          <Flowers x={x + 4} y={170} n={8} seed={x} />
        </g>
      ))}
      <Shape d="M28 200 H492 V500 H28z" fill={P.forest} sw={2.4} />
      <Shape d="M48 210 H472 V258 H48z" fill="#284034" sw={2} />
      <text x="260" y="246" textAnchor="middle" fill={P.cream} style={{ fontFamily: 'var(--font-display), Georgia, serif', fontStyle: 'italic', fontSize: 34, letterSpacing: 0.5 }}>Little Crumb</text>
      <Ink d="M96 234 q-12 -6 -22 2 M424 234 q12 -6 22 2" sw={1.6} color={P.ochreLight} />
      {stripes}
      <Shape d="M56 340 H306 V468 H56z" fill={lit ? P.ochreLight : P.blueLight} op={0.8} sw={2.4} />
      <Ink d="M58 396 H304 M58 452 H304" sw={2.2} />
      {loaf(70, 392, 1)}{loaf(112, 392, 0)}{loaf(156, 392, 1)}
      <Shape d="M210 392 q0 -24 22 -24 q22 0 22 24z" fill={P.terracottaLight} sw={1.8} />
      <Ink d="M214 380 h36" sw={1.4} />
      <Shape d="M262 392 q12 -26 30 -10 l-4 10z" fill={P.ochre} sw={1.8} />
      {loaf(78, 448, 0)}{loaf(122, 448, 1)}{loaf(204, 448, 0)}{loaf(246, 448, 1)}
      <Ink d="M70 352 l28 30 M250 350 l40 42" sw={1.4} color={P.white} op={0.8} />
      {/* door */}
      <Shape d="M336 330 H450 V500 H336z" fill={P.forestLight} sw={2.3} />
      <Shape d="M352 346 H434 V420 H352z" fill={lit ? P.ochreLight : P.blueLight} op={0.8} sw={2} />
      <Shape d="M366 380 h54 v26 h-54z" fill={P.white} sw={1.4} />
      <text x="393" y="398" textAnchor="middle" fill={P.ink} style={{ fontFamily: 'var(--font-display), Georgia, serif', fontStyle: 'italic', fontSize: 15 }}>open</text>
      <Ink d="M380 380 l13 -14 l13 14" sw={1.2} />
      <circle cx="440" cy="440" r="3.5" fill={P.ochre} stroke={P.ink} strokeWidth="1.4" />
      <Shape d="M393 322 q-9 0 -9 9 h18 q0 -9 -9 -9z" fill={P.ochre} sw={1.6} />
      <Shape d="M326 500 h134 v-8 h-134z" fill={P.stone} sw={2} />
    </g>
  );
}

export function Pond({ w = 380, h = 90, ...g }: G & { w?: number; h?: number }) {
  return (
    <g transform={tf(g)}>
      <Shape d={`M0 0 q${w * 0.08} -${h * 0.55} ${w * 0.45} -${h * 0.5} q${w * 0.5} -${h * 0.1} ${w * 0.55} ${h * 0.45} q-${w * 0.05} ${h * 0.6} -${w * 0.55} ${h * 0.55} q-${w * 0.42} -${h * 0.05} -${w * 0.45} -${h * 0.5}z`} fill={P.blue} op={0.75} sw={2.3} />
      <Ink d={`M${w * 0.2} -${h * 0.1} h40 M${w * 0.55} ${h * 0.12} h56 M${w * 0.4} -${h * 0.28} h30`} sw={1.5} op={0.6} color={P.white} />
      <Ink d={`M${w * 0.02} ${-4} q-6 -26 4 -40 M${w * 0.06} 0 q2 -22 12 -30 M${w * 0.96} 0 q4 -26 -2 -36`} sw={1.8} color={P.forest} />
    </g>
  );
}

export function Duck({ ...g }: G) {
  return (
    <g transform={tf(g)}>
      <Shape d="M0 0 q-4 -16 14 -16 h12 q4 -16 16 -12 q6 4 2 12 l8 2 l-8 4 q2 14 -18 14 h-14 q-12 0 -12 -4z" fill={P.white} sw={2} />
      <circle cx="38" cy="-22" r="1.8" fill={P.ink} />
      <Ink d="M10 -6 q8 4 16 0" sw={1.4} />
    </g>
  );
}

export function Fence({ w = 300, ...g }: G & { w?: number }) {
  const posts = [];
  for (let x = 0; x <= w; x += 22) posts.push(`M${x} 0 v-46 l4 -6 l4 6`);
  return (
    <g transform={tf(g)}>
      <Ink d={posts.join(' ')} sw={2.2} color={P.ink} />
      <Ink d={`M-4 -14 H${w + 8} M-4 -34 H${w + 8}`} sw={2.2} />
    </g>
  );
}

/** A small steam train, carriage and engine. Origin: rail level, left. */
export function Train({ lit = false, ...g }: G & { lit?: boolean }) {
  return (
    <g transform={tf(g)}>
      <Shape d="M0 -20 h190 v-96 q-95 -18 -190 0z" fill={P.forestLight} sw={2.3} />
      {[16, 70, 124].map((x) => <Shape key={x} d={`M${x} -96 h44 v38 h-44z`} fill={lit ? P.ochreLight : P.cream} sw={1.8} />)}
      <Ink d="M0 -44 h190" sw={1.6} />
      <Shape d="M200 -20 h170 v-70 h-60 v-50 h-30 v50 h-80z" fill={P.terracotta} sw={2.3} />
      <Shape d="M226 -90 h-20 v-34 h20z" fill={P.ink} sw={2} op={0.85} />
      <Shape d="M310 -140 h64 v50 h-64z" fill={P.terracotta} sw={2.2} />
      <Shape d="M320 -132 h26 v24 h-26z" fill={lit ? P.ochreLight : P.cream} sw={1.8} />
      <Shape d="M302 -144 h80 v-8 h-80z" fill={P.forest} sw={2} />
      {[30, 100, 160, 236, 290, 344].map((x) => <g key={x}><circle cx={x} cy={-16} r="15" fill={P.ink} opacity=".88" /><circle cx={x} cy={-16} r="5" fill={P.stone} /></g>)}
      <Ink d="M190 -40 h12" sw={4} />
    </g>
  );
}

export function Puff({ seed = 1, w = 60, ...g }: G & { seed?: number; w?: number }) {
  return <g transform={tf(g)}><Shape d={scallop(0, 0, w / 2, w * 0.36, 7, 0.3, seed)} fill={P.white} sw={1.6} lineOp={0.5} /></g>;
}

export function Grass({ seed = 1, w = 60, ...g }: G & { seed?: number; w?: number }) {
  let d = '';
  for (let i = 0; i < 6; i++) { const x = (i * w) / 6 + ((seed * 13 + i * 7) % 8); d += `M${x} 0 q${2 + (i % 3)} -10 ${-2 + (i % 4)} -${12 + ((seed + i) % 9)} `; }
  return <g transform={tf(g)}><Ink d={d} sw={1.6} color={P.forest} op={0.8} /></g>;
}
