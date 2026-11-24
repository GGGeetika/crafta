import { P } from './palette';
import { Ink, Limb, Shape } from './defs';

/**
 * MAYA — model sheet in code.
 *
 * Proportions: ~3.6 heads tall. Feet rest on y = 214 inside a 160 × 230 box.
 * Silhouette: two round hair puffs tied with terracotta ribbons, an A-line
 * ochre coat with a cream collar, forest-green tights, terracotta shoes, and
 * the green satchel she always carries across her body.
 * Face: dot eyes, small mouth, rosy cheeks. Never large or shiny eyes.
 * She faces right by default; flip the actor to face left.
 */
export type MayaPose =
  | 'stand' | 'walk' | 'wave' | 'point' | 'run' | 'jump' | 'crouch'
  | 'call' | 'surprised' | 'hold' | 'satchelHat' | 'splash' | 'sit' | 'think';
export type Expression = 'happy' | 'curious' | 'surprised' | 'delighted' | 'worried' | 'calling' | 'calm' | 'determined';

type PoseDef = {
  dy?: number; // torso drop (crouch/sit) or lift (jump)
  lean?: number; // degrees, about the hips
  tilt?: number; // head tilt in degrees
  legs: [string, string];
  shoes: [[number, number, number], [number, number, number]]; // x, y, rotation
  arms: [string, string]; // [back arm, front arm], in torso space
  hands?: 'default';
  satchel?: 'hip' | 'head';
};

// Torso space: shoulders ≈ (66,100) & (94,100), hem ≈ y 160.
const POSES: Record<MayaPose, PoseDef> = {
  stand: { legs: ['M72 158 L70 205', 'M88 158 L91 205'], shoes: [[68, 210, 0], [93, 210, 0]], arms: ['M66 101 Q57 121 55 141', 'M94 101 Q103 121 105 141'] },
  think: { tilt: -6, legs: ['M72 158 L70 205', 'M88 158 L91 205'], shoes: [[68, 210, 0], [93, 210, 0]], arms: ['M66 101 Q57 121 56 141', 'M94 101 Q110 112 96 84'] },
  walk: { legs: ['M72 158 L62 204', 'M88 158 L99 202'], shoes: [[59, 209, -8], [102, 207, 10]], arms: ['M66 101 Q56 118 50 134', 'M94 101 Q106 116 112 130'] },
  wave: { tilt: 5, legs: ['M72 158 L70 205', 'M88 158 L91 205'], shoes: [[68, 210, 0], [93, 210, 0]], arms: ['M66 101 Q57 121 55 141', 'M94 101 Q114 88 116 62'] },
  point: { legs: ['M72 158 L69 205', 'M88 158 L93 205'], shoes: [[67, 210, 0], [95, 210, 0]], arms: ['M66 101 Q57 121 55 141', 'M94 101 Q114 102 132 92'] },
  run: { lean: 9, legs: ['M72 158 Q58 176 46 188', 'M88 158 Q106 172 104 202'], shoes: [[43, 192, -35], [106, 207, 8]], arms: ['M66 101 Q52 110 44 124', 'M94 101 Q114 106 116 120'] },
  jump: { dy: -26, tilt: -4, legs: ['M72 158 Q62 178 70 194', 'M88 158 Q100 176 94 192'], shoes: [[69, 198, -20], [96, 196, 15]], arms: ['M66 99 Q50 78 48 56', 'M94 99 Q110 78 114 54'] },
  splash: { dy: -8, legs: ['M72 158 Q60 178 56 196', 'M88 158 Q102 176 108 196'], shoes: [[53, 201, -12], [111, 201, 12]], arms: ['M66 101 Q48 98 38 86', 'M94 101 Q112 98 122 86'] },
  crouch: { dy: 30, legs: ['M72 188 Q56 194 60 211', 'M88 188 Q108 192 104 211'], shoes: [[60, 214, 0], [104, 214, 0]], arms: ['M66 101 Q60 118 64 132', 'M94 101 Q112 110 126 114'] },
  call: { tilt: -3, legs: ['M72 158 L69 205', 'M88 158 L92 205'], shoes: [[67, 210, 0], [94, 210, 0]], arms: ['M66 101 Q60 98 76 82', 'M94 101 Q108 96 100 80'] },
  surprised: { legs: ['M72 158 L67 205', 'M88 158 L94 205'], shoes: [[65, 210, 0], [96, 210, 0]], arms: ['M66 101 Q50 92 44 72', 'M94 101 Q110 92 116 72'] },
  hold: { legs: ['M72 158 L70 205', 'M88 158 L91 205'], shoes: [[68, 210, 0], [93, 210, 0]], arms: ['M66 101 Q74 126 94 124', 'M94 101 Q108 112 106 122'] },
  satchelHat: { legs: ['M72 158 L66 205', 'M88 158 L95 205'], shoes: [[64, 210, 0], [97, 210, 0]], arms: ['M66 101 Q50 70 60 26', 'M94 101 Q110 70 100 26'], satchel: 'head' },
  sit: { dy: 44, legs: ['M72 200 Q90 206 108 210', 'M88 200 Q104 200 120 206'], shoes: [[112, 210, 70], [124, 205, 70]], arms: ['M66 101 Q58 120 62 136', 'M94 101 Q106 118 108 132'] },
};

/** Where Maya's hands are for a held object, in Maya's local box. */
export const MAYA_HOLD = { x: 100, y: 116 };
export const MAYA_BOX = { w: 160, h: 230 };

function Face({ expr, dx = 5 }: { expr: Expression; dx?: number }) {
  const ex = 75 + dx, ex2 = 92 + dx, ey = 63, mx = 84 + dx, my = 75;
  const cheeks = (
    <g fill={P.cheek} opacity=".42">
      <ellipse cx={ex - 7} cy={72} rx="5.5" ry="3.6" />
      <ellipse cx={ex2 + 6} cy={72} rx="5" ry="3.4" />
    </g>
  );
  const dot = (x: number, r = 2.5) => <circle cx={x} cy={ey} r={r} fill={P.ink} />;
  const nose = <Ink d={`M${mx + 3} ${68.5} q2 1.2 0 2.4`} sw={1.5} op={0.7} />;
  switch (expr) {
    case 'delighted':
      return <g>{cheeks}<Ink d={`M${ex - 3.5} ${ey + 1} q3.5 -4.5 7 0 M${ex2 - 3.5} ${ey + 1} q3.5 -4.5 7 0`} sw={2} />{nose}<path d={`M${mx - 6} ${my - 1} q6 8 12 0 z`} fill={P.terracotta} stroke={P.ink} strokeWidth="1.8" strokeLinejoin="round" /></g>;
    case 'surprised':
      return <g>{cheeks}{dot(ex, 3)}{dot(ex2, 3)}<Ink d={`M${ex - 4} ${ey - 8} q4 -3 8 0 M${ex2 - 4} ${ey - 8} q4 -3 8 0`} sw={1.6} />{nose}<ellipse cx={mx} cy={my + 1} rx="3.4" ry="4.2" fill={P.terracotta} stroke={P.ink} strokeWidth="1.8" /></g>;
    case 'curious':
      return <g>{cheeks}{dot(ex)}{dot(ex2)}<Ink d={`M${ex2 - 4} ${ey - 9} q4 -3 8 1`} sw={1.6} />{nose}<ellipse cx={mx} cy={my} rx="2.4" ry="2.6" fill={P.ink} /></g>;
    case 'worried':
      return <g>{cheeks}{dot(ex)}{dot(ex2)}<Ink d={`M${ex - 4} ${ey - 6} l7 -3 M${ex2 + 4} ${ey - 6} l-7 -3`} sw={1.6} />{nose}<Ink d={`M${mx - 5} ${my + 1} q2.5 -3 5 0 q2.5 3 5 0`} sw={1.8} /></g>;
    case 'calling':
      return <g>{cheeks}{dot(ex)}{dot(ex2)}<Ink d={`M${ex - 4} ${ey - 8} q4 -3 8 0 M${ex2 - 4} ${ey - 8} q4 -3 8 0`} sw={1.6} /><path d={`M${mx - 5} ${my - 2} q5 -2 10 0 q0 9 -5 9 q-5 0 -5 -9z`} fill={P.terracotta} stroke={P.ink} strokeWidth="1.8" strokeLinejoin="round" /></g>;
    case 'determined':
      return <g>{cheeks}{dot(ex)}{dot(ex2)}<Ink d={`M${ex - 4} ${ey - 8} l8 2 M${ex2 + 4} ${ey - 8} l-8 2`} sw={1.7} />{nose}<Ink d={`M${mx - 5} ${my} q5 3 10 -1`} sw={1.9} /></g>;
    case 'calm':
      return <g>{cheeks}<Ink d={`M${ex - 3} ${ey} h6 M${ex2 - 3} ${ey} h6`} sw={2} />{nose}<Ink d={`M${mx - 4} ${my} q4 3.5 8 0`} sw={1.9} /></g>;
    default:
      return <g>{cheeks}{dot(ex)}{dot(ex2)}{nose}<Ink d={`M${mx - 5} ${my - 1} q5 5.5 10 0`} sw={1.9} /></g>;
  }
}

function Satchel({ where }: { where: 'hip' | 'head' }) {
  if (where === 'head') {
    return (
      <g>
        <Shape d="M52 8 q28 -10 56 0 l-2 18 q-26 -5 -52 0z" fill={P.forestLight} />
        <Ink d="M56 12 q24 -6 48 0" sw={1.6} />
        <circle cx="80" cy="15" r="2.4" fill={P.ochre} stroke={P.ink} strokeWidth="1.4" />
      </g>
    );
  }
  return (
    <g>
      <path d="M95 99 L60 138" stroke={P.ink} strokeWidth="6" strokeLinecap="round" />
      <path d="M95 99 L60 138" stroke={P.forestLight} strokeWidth="3" strokeLinecap="round" />
      <Shape d="M42 134 h26 q2 0 2 2 v14 q0 6 -6 6 h-18 q-6 0 -6 -6 v-14 q0 -2 2 -2z" fill={P.forestLight} />
      <Shape d="M42 134 h28 l-3 10 q-11 4 -22 0z" fill={P.forest} sw={2} />
      <circle cx="56" cy="143" r="2" fill={P.ochre} stroke={P.ink} strokeWidth="1.3" />
    </g>
  );
}

function Head({ expr, tilt = 0 }: { expr: Expression; tilt?: number }) {
  return (
    <g transform={`rotate(${tilt} 80 92)`}>
      {/* hair puffs (behind head) */}
      <Shape d="M38 40 q-6 -14 6 -20 q4 -10 15 -5 q11 -2 12 10 q8 8 0 17 q-4 9 -14 7 q-8 6 -15 -1 q-9 -1 -4 -8z" fill={P.hair} op={1} />
      <Shape d="M122 40 q6 -14 -6 -20 q-4 -10 -15 -5 q-11 -2 -12 10 q-8 8 0 17 q4 9 14 7 q8 6 15 -1 q9 -1 4 -8z" fill={P.hair} op={1} />
      {/* ears */}
      <Shape d="M51 64 q-8 -2 -7 6 q1 7 9 5" fill={P.mayaSkin} sw={2} />
      <Shape d="M109 64 q8 -2 7 6 q-1 7 -9 5" fill={P.mayaSkin} sw={2} />
      {/* face */}
      <Shape d="M51 62 q0 -30 29 -30 q29 0 29 30 q0 27 -29 27 q-29 0 -29 -27z" fill={P.mayaSkin} />
      {/* hairline cap */}
      <Shape d="M51 60 q-1 -29 29 -29 q30 0 29 29 q-6 -11 -15 -13 q-4 6 -12 5 q-9 -1 -12 -6 q-12 3 -19 14z" fill={P.hair} op={1} sw={2} />
      {/* ribbons tie each puff */}
      <Shape d="M58 41 l-12 -9 q-3 7 1 15z M58 41 l12 -8 q2 8 -2 15z" fill={P.terracotta} sw={1.9} />
      <circle cx="58" cy="41" r="3" fill={P.terracotta} stroke={P.ink} strokeWidth="1.7" />
      <Shape d="M102 41 l-12 -8 q-2 8 2 15z M102 41 l12 -9 q3 7 -1 15z" fill={P.terracotta} sw={1.9} />
      <circle cx="102" cy="41" r="3" fill={P.terracotta} stroke={P.ink} strokeWidth="1.7" />
      <Face expr={expr} />
    </g>
  );
}

export function Maya({ pose = 'stand', expr = 'happy' }: { pose?: MayaPose; expr?: Expression }) {
  const d = POSES[pose];
  const dy = d.dy ?? 0;
  const satchel = d.satchel ?? 'hip';
  const [backArm, frontArm] = d.arms;
  return (
    <svg viewBox="0 0 160 230" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <g filter="url(#ink)">
        {/* ground shadow — a single soft pencil shading, not a glossy drop shadow */}
        {dy > -1 && <ellipse cx="80" cy="216" rx="34" ry="4" fill={P.ink} opacity=".1" />}
        {dy < -1 && <ellipse cx="80" cy="216" rx="24" ry="3" fill={P.ink} opacity=".08" />}
        {/* legs + shoes (not translated: feet stay on the ground) */}
        <g transform={dy < 0 ? `translate(0 ${dy})` : undefined}>
          <Limb d={d.legs[0]} color={P.forest} w={9} />
          <Limb d={d.legs[1]} color={P.forest} w={9} />
          {d.shoes.map(([x, y, r], i) => (
            <g key={i} transform={`rotate(${r} ${x} ${y})`}>
              <Shape d={`M${x - 9} ${y + 3} q-1 -10 9 -10 q9 0 11 7 q1 4 -3 4 z`} fill={P.terracotta} sw={2.1} />
            </g>
          ))}
        </g>
        <g transform={`translate(0 ${dy}) ${d.lean ? `rotate(${d.lean} 80 160)` : ''}`}>
          <Limb d={backArm} color={P.ochre} w={11} />
          <circle cx={endOf(backArm)[0]} cy={endOf(backArm)[1]} r="5.6" fill={P.mayaSkin} stroke={P.ink} strokeWidth="2.1" />
          {/* coat */}
          <Shape d="M66 95 q14 -7 28 0 l17 63 q-31 9 -62 0z" fill={P.ochre} />
          <Ink d="M80 101 L80 163" sw={1.8} op={0.85} />
          <Ink d="M56 150 q24 5 48 0" sw={1.2} op={0.35} />
          <circle cx="86" cy="118" r="2.2" fill={P.cream} stroke={P.ink} strokeWidth="1.4" />
          <circle cx="86" cy="136" r="2.2" fill={P.cream} stroke={P.ink} strokeWidth="1.4" />
          {/* pocket */}
          <Ink d="M93 138 h11 l1 9" sw={1.6} op={0.8} />
          {/* collar */}
          <Shape d="M66 96 q6 12 14 5 q8 7 14 -5 q-14 -6 -28 0z" fill={P.cream} sw={2} />
          {satchel === 'hip' && <Satchel where="hip" />}
          <Head expr={expr} tilt={d.tilt} />
          {satchel === 'head' && <Satchel where="head" />}
          <Limb d={frontArm} color={P.ochre} w={11} />
          <circle cx={endOf(frontArm)[0]} cy={endOf(frontArm)[1]} r="5.6" fill={P.mayaSkin} stroke={P.ink} strokeWidth="2.1" />
        </g>
      </g>
    </svg>
  );
}

export function endOf(path: string): [number, number] {
  const n = path.trim().split(/[\s,A-Za-z]+/).filter(Boolean).map(Number);
  return [n[n.length - 2], n[n.length - 1]];
}
