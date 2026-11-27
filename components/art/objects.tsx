import { P } from './palette';
import { Ink, Shape } from './defs';

export type ObjectId = 'letter' | 'balloon' | 'scarf' | 'kite' | 'boat' | 'key' | 'suitcase' | 'ticket' | 'hat';
export type ObjectLook = 'plain' | 'note' | 'old' | 'curious';

/** Natural size of each object in world units (w × h). */
export const OBJECT_BOX: Record<ObjectId, [number, number]> = {
  letter: [80, 60], balloon: [70, 160], scarf: [130, 60], kite: [110, 170], boat: [90, 96],
  key: [76, 40], suitcase: [96, 84], ticket: [74, 44], hat: [104, 64],
};

function Tag({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Ink d={`M${x} ${y} q-6 8 -2 16`} sw={1.3} />
      <Shape d={`M${x - 12} ${y + 15} h20 v14 h-20z`} fill={P.white} sw={1.5} />
      <Ink d={`M${x - 8} ${y + 21} h12 M${x - 8} ${y + 25} h8`} sw={1} op={0.7} />
    </g>
  );
}

function Draw({ id }: { id: ObjectId }) {
  switch (id) {
    case 'letter':
      return <>
        <Shape d="M6 12 h68 v42 h-68z" fill={P.cream} />
        <Ink d="M6 12 l34 24 l34 -24" sw={1.8} />
        <Shape d="M56 18 h12 v14 h-12z" fill={P.terracotta} sw={1.4} />
        <circle cx="40" cy="36" r="5" fill={P.terracotta} stroke={P.ink} strokeWidth="1.4" />
        <Ink d="M14 46 h22" sw={1.2} op={0.5} />
      </>;
    case 'balloon':
      return <>
        <Ink d="M35 72 q-8 20 4 40 q10 20 -2 46" sw={1.4} />
        <Shape d="M35 72 q-30 -6 -30 -38 q0 -30 30 -30 q30 0 30 30 q0 32 -30 38z" fill={P.blue} />
        <Shape d="M31 72 l4 6 l4 -6z" fill={P.blue} sw={1.4} />
        <Ink d="M20 22 q4 -8 12 -10" sw={2.4} color={P.white} op={0.7} />
      </>;
    case 'scarf':
      return <>
        <Shape d="M6 26 q60 -20 118 0 l-2 16 q-58 -18 -114 0z" fill={P.terracotta} />
        {[22, 44, 66, 88, 108].map((x) => <path key={x} d={`M${x} ${x < 60 ? 22 : 18} l2 18`} stroke={P.ochre} strokeWidth="7" opacity=".9" />)}
        <Ink d="M6 26 l-2 10 M6 42 l-4 8 M124 26 l4 10 M122 42 l4 8 M10 44 l0 10 M120 44 l2 10" sw={1.4} />
      </>;
    case 'kite':
      return <>
        <Ink d="M55 104 q-16 18 4 34 q20 14 -2 32" sw={1.4} />
        {[[44, 122], [62, 146]].map(([x, y]) => <Shape key={x} d={`M${x} ${y} l-8 -5 v10z M${x} ${y} l8 -5 v10z`} fill={P.ochre} sw={1.2} />)}
        <Shape d="M55 4 L100 46 L55 104 L10 46Z" fill={P.terracotta} />
        <Shape d="M55 4 L100 46 L55 46Z M55 46 L10 46 L55 104Z" fill={P.cream} sw={1.4} />
        <Ink d="M55 4 V104 M10 46 H100" sw={1.6} />
      </>;
    case 'boat':
      return <>
        <Shape d="M44 12 L44 64 L76 64Z" fill={P.white} />
        <Shape d="M40 22 L40 62 L16 62Z" fill={P.cream} sw={1.8} />
        <Ink d="M42 8 V68" sw={2.4} />
        <Shape d="M42 8 l14 4 l-14 4z" fill={P.terracotta} sw={1.4} />
        <Shape d="M8 68 h76 l-10 18 h-56z" fill={P.wood} />
        <Ink d="M14 76 h64" sw={1.3} op={0.6} />
      </>;
    case 'key':
      return <>
        <circle cx="18" cy="20" r="13" fill={P.ochre} stroke={P.ink} strokeWidth="2.2" />
        <circle cx="18" cy="20" r="5" fill={P.paper} stroke={P.ink} strokeWidth="1.8" />
        <Shape d="M30 17 h40 v6 h-40z" fill={P.ochre} sw={2} />
        <Shape d="M58 23 v8 h5 v-8z M66 23 v6 h4 v-6z" fill={P.ochre} sw={1.6} />
        <Shape d="M8 8 q-8 -6 -6 -2 q2 6 8 6z" fill={P.blue} sw={1.4} />
      </>;
    case 'suitcase':
      return <>
        <Shape d="M34 18 v-10 h28 v10" fill="none" />
        <Ink d="M34 18 v-10 h28 v10" sw={3} />
        <Shape d="M6 18 h84 v58 h-84z" fill={P.cream} />
        {[20, 40, 60, 78].map((x) => <path key={x} d={`M${x} 19 v56`} stroke={P.terracotta} strokeWidth="9" opacity=".9" />)}
        <Ink d="M6 18 h84 v58 h-84z" sw={2.3} />
        <Shape d="M14 30 q0 -6 8 -6 q8 0 8 6 q0 8 -8 8 q-8 0 -8 -8z" fill={P.blueLight} sw={1.4} />
        <circle cx="16" cy="80" r="4" fill={P.ink} /><circle cx="80" cy="80" r="4" fill={P.ink} />
      </>;
    case 'ticket':
      return <>
        <Shape d="M4 6 h66 v32 h-66z" fill={P.white} />
        <rect x="4" y="12" width="66" height="7" fill={P.blue} opacity=".85" />
        <circle cx="58" cy="30" r="3.4" fill={P.paper} stroke={P.ink} strokeWidth="1.3" />
        <Ink d="M10 28 h28 M10 33 h18" sw={1.2} op={0.6} />
        <Ink d="M4 6 h66 v32 h-66z" sw={2} />
      </>;
    case 'hat':
      return <>
        <Shape d="M4 50 q48 -14 96 0 q-48 14 -96 0z" fill={P.forest} />
        <Shape d="M24 48 q-2 -40 28 -40 q30 0 28 40 q-28 -8 -56 0z" fill={P.forestLight} />
        <Shape d="M26 40 q26 -6 52 0 v6 q-26 -6 -52 0z" fill={P.terracotta} sw={1.6} />
        <Shape d="M74 40 q18 -30 26 -36 q-2 22 -22 38z" fill={P.ochre} sw={1.5} />
        <Ink d="M76 40 q10 -16 22 -32" sw={1.2} />
      </>;
  }
}

/** An object, drawn at its natural size. `look` shows what the grown-up decided makes it special. */
export function Thing({ id, look = 'plain' }: { id: ObjectId; look?: ObjectLook }) {
  const [w, h] = OBJECT_BOX[id];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" overflow="visible" aria-hidden="true">
      <g filter="url(#ink)" className={look === 'curious' ? 'wiggle' : undefined} style={{ transformOrigin: `${w / 2}px ${h / 2}px` }}>
        <g opacity={look === 'old' ? 0.78 : 1} style={look === 'old' ? { filter: 'sepia(.45)' } : undefined}><Draw id={id} /></g>
        {look === 'old' && <>
          <Shape d={`M${w * 0.62} ${h * 0.42} h${Math.min(16, w * 0.2)} v${Math.min(12, h * 0.2)} h-${Math.min(16, w * 0.2)}z`} fill={P.sageLight} sw={1.2} />
          <Ink d={`M${w * 0.62} ${h * 0.42} l3 3 M${w * 0.62 + 6} ${h * 0.42} l3 3`} sw={1} />
        </>}
        {look === 'note' && <Tag x={w * 0.25} y={h * 0.55} />}
        {look === 'curious' && <Ink d={`M${w + 6} ${h * 0.3} q6 4 0 8 M${w + 12} ${h * 0.24} q9 8 0 18 M-6 ${h * 0.3} q-6 4 0 8`} sw={1.6} op={0.7} />}
      </g>
    </svg>
  );
}

/* ---------- story props ---------- */

export type BubbleId = 'house' | 'friends' | 'search' | 'idea' | ObjectId;
/** A thought bubble with a tiny pencil drawing inside: a picture-book way to show a feeling. Box 150×130. */
export function Thought({ show }: { show: BubbleId }) {
  return (
    <svg viewBox="0 0 150 130" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <g filter="url(#ink)">
        <circle cx="22" cy="122" r="5" fill={P.white} stroke={P.ink} strokeWidth="1.8" />
        <circle cx="36" cy="104" r="8" fill={P.white} stroke={P.ink} strokeWidth="1.8" />
        <path d="M30 60 q-8 -36 30 -40 q16 -22 44 -6 q36 -2 32 32 q14 24 -14 36 q-14 18 -40 8 q-30 10 -42 -8 q-24 -4 -10 -22z" fill={P.white} stroke={P.ink} strokeWidth="2" />
        <g transform="translate(46 26) scale(.62)">
          {show === 'house' && <><Shape d="M10 90 V40 L50 10 L90 40 V90Z" fill={P.blueLight} sw={2.4} /><Shape d="M40 90 v-26 h20 v26z" fill={P.terracotta} sw={2} /><Ink d="M66 26 v-14 h10 v22" sw={2.4} /></>}
          {show === 'friends' && <><circle cx="30" cy="34" r="14" fill={P.ochreLight} stroke={P.ink} strokeWidth="2.4" /><Shape d="M14 90 q0 -38 16 -38 q16 0 16 38z" fill={P.ochre} sw={2.4} /><circle cx="76" cy="34" r="14" fill={P.terracottaLight} stroke={P.ink} strokeWidth="2.4" /><Shape d="M60 90 q0 -38 16 -38 q16 0 16 38z" fill={P.terracotta} sw={2.4} /><Ink d="M44 66 h18" sw={2.4} /></>}
          {show === 'search' && <><circle cx="42" cy="42" r="26" fill={P.blueLight} stroke={P.ink} strokeWidth="3" /><Ink d="M60 60 L90 90" sw={7} /></>}
          {show === 'idea' && <><Ink d="M50 6 v16 M18 20 l10 10 M82 20 l-10 10 M10 54 h14 M76 54 h14" sw={3} /><circle cx="50" cy="58" r="22" fill={P.ochreLight} stroke={P.ink} strokeWidth="2.6" /></>}
          {(['letter', 'balloon', 'scarf', 'kite', 'boat', 'key', 'suitcase', 'ticket', 'hat'] as string[]).includes(show) && <g transform="translate(6 0) scale(.75)"><Draw id={show as ObjectId} /></g>}
        </g>
      </g>
    </svg>
  );
}

/** Rain across the whole stage. 1000×700. */
export function Rain() {
  const drops = [];
  for (let i = 0; i < 70; i++) {
    const x = (i * 149) % 1000, y = (i * 263) % 640;
    drops.push(`M${x} ${y} l-6 18`);
  }
  return (
    <svg viewBox="0 0 1000 700" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g className="rain" filter="url(#ink)"><Ink d={drops.join(' ')} sw={2} color={P.blue} /></g>
      <g filter="url(#ink)" opacity=".85">
        <ellipse cx="260" cy="640" rx="70" ry="9" fill={P.blue} opacity=".45" />
        <ellipse cx="720" cy="652" rx="90" ry="10" fill={P.blue} opacity=".45" />
      </g>
    </svg>
  );
}

/** Wind: a few drawn gusts and tumbling leaves, as an illustrator would show it. 1000×700. */
export function Wind() {
  return (
    <svg viewBox="0 0 1000 700" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g filter="url(#ink)" className="gust">
        <Ink d="M80 220 q120 -40 240 0 q60 20 90 -10 q12 -16 -4 -22 M140 320 q160 -30 300 4 M560 180 q140 -30 260 10 q40 14 56 -6" sw={2} op={0.55} />
        {[[260, 260], [420, 200], [620, 300], [760, 230], [880, 330]].map(([x, y], i) => (
          <g key={x} className="blow-leaf" style={{ animationDelay: `${i * 0.25}s` }}>
            <Shape d={`M${x} ${y} q10 -12 22 -4 q-6 14 -22 4z`} fill={i % 2 ? P.ochre : P.sage} sw={1.4} />
          </g>
        ))}
      </g>
    </svg>
  );
}

export type PropId = 'map' | 'hopscotch' | 'bunting' | 'picnic' | 'crumb' | 'path' | 'puddle' | 'splash' | 'stars';
export const PROP_BOX: Record<PropId, [number, number]> = {
  map: [130, 100], hopscotch: [300, 80], bunting: [1000, 120], picnic: [300, 110], crumb: [30, 20], path: [600, 120], puddle: [160, 30], splash: [120, 60], stars: [1000, 260],
};

export function Prop({ id }: { id: PropId }) {
  const [w, h] = PROP_BOX[id];
  let body: React.ReactNode = null;
  switch (id) {
    case 'map':
      body = <>
        <Shape d="M6 14 l38 -8 l40 8 l40 -8 v80 l-40 8 l-40 -8 l-38 8z" fill={P.cream} />
        <Ink d="M44 6 v80 M84 14 v80" sw={1.3} op={0.6} />
        <Ink d="M18 76 q20 -30 44 -20 q24 10 46 -30" sw={2} color={P.terracotta} />
        <Ink d="M102 20 l8 8 M110 20 l-8 8" sw={2} color={P.terracotta} />
        <Shape d="M16 70 h10 v10 h-10z" fill={P.blueLight} sw={1.2} />
      </>; break;
    case 'hopscotch':
      body = <>
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${20 + i * 54} 20 h50 v44 h-50z`} fill="none" stroke={P.white} strokeWidth="4" strokeLinejoin="round" opacity=".95" />)}
        {[1, 2, 3, 4, 5].map((n, i) => <text key={n} x={45 + i * 54} y="50" textAnchor="middle" fill={P.white} style={{ fontFamily: 'var(--font-display), Georgia, serif', fontSize: 22 }}>{n}</text>)}
      </>; break;
    case 'bunting': {
      const flags = [];
      for (let i = 0; i < 16; i++) { const x = 30 + i * 60, y = 30 + Math.sin(i / 2.5) * 12 + (i % 2) * 2; flags.push(<Shape key={i} d={`M${x} ${y} h40 l-20 36z`} fill={[P.terracotta, P.ochre, P.blue, P.cream][i % 4]} sw={1.6} />); }
      body = <><Ink d="M0 26 Q250 60 500 30 T1000 30" sw={1.6} />{flags}</>; break;
    }
    case 'picnic':
      body = <>
        <Shape d="M10 80 L60 30 H290 L250 80Z" fill={P.terracottaLight} />
        <Ink d="M40 50 H275 M25 65 H262 M110 30 L80 80 M170 30 L150 80 M230 30 L215 80" sw={1.6} color={P.white} op={0.9} />
        <Shape d="M140 52 h40 v-34 h-40z" fill="#e4cfa4" sw={1.8} />
        <text x="160" y="40" textAnchor="middle" fill={P.forest} style={{ fontFamily: 'var(--font-display), Georgia, serif', fontStyle: 'italic', fontSize: 8 }}>Little Crumb</text>
        <Shape d="M196 56 q0 -14 14 -14 q14 0 14 14z" fill={P.ochre} sw={1.6} />
        <Shape d="M100 58 q12 -14 26 0z" fill={P.ochreLight} sw={1.6} />
        <Shape d="M230 52 h16 v10 h-16z" fill={P.white} sw={1.4} />
      </>; break;
    case 'crumb':
      body = <Shape d="M4 14 q2 -10 12 -10 q10 2 10 10 q-10 4 -22 0z" fill={P.ochre} sw={1.4} />; break;
    case 'path':
      body = <Ink d="M10 100 q120 -80 260 -40 q140 40 320 -40" sw={3} color={P.terracotta} op={0.7} />; break;
    case 'puddle':
      body = <ellipse cx="80" cy="15" rx="76" ry="11" fill={P.blue} opacity=".6" stroke={P.ink} strokeWidth="1.6" />; break;
    case 'splash':
      body = <Ink d="M20 50 q-6 -20 -16 -26 M40 44 q-2 -22 -8 -36 M60 44 v-40 M80 44 q2 -22 10 -36 M100 50 q6 -20 16 -26" sw={2.2} color={P.blue} />; break;
    case 'stars':
      body = <g>{[[120, 60], [300, 30], [520, 80], [700, 40], [880, 90], [200, 140], [620, 150]].map(([x, y]) => <Ink key={x} d={`M${x - 6} ${y} h12 M${x} ${y - 6} v12`} sw={1.6} color={P.cream} />)}</g>; break;
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" overflow="visible" aria-hidden="true">
      <g filter="url(#ink)">{body}</g>
    </svg>
  );
}
