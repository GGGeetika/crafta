import { P } from './palette';
import { Ink, Limb, Shape } from './defs';
import { endOf } from './Maya';

export type CastExpr = 'happy' | 'worried' | 'shy' | 'surprised' | 'delighted' | 'sad';
export type CastPose = 'stand' | 'wave' | 'hold' | 'search' | 'sit';

/** Faces share Maya's grammar: dot eyes, small mouths, cheeks. */
function Face({ cx, cy, expr, dx = 4, spread = 8, cheek = true }: { cx: number; cy: number; expr: CastExpr; dx?: number; spread?: number; cheek?: boolean }) {
  const l = cx - spread + dx, r = cx + spread + dx, m = cx + dx, my = cy + 12;
  const eyes =
    expr === 'delighted' ? <Ink d={`M${l - 3} ${cy + 1} q3 -4 6 0 M${r - 3} ${cy + 1} q3 -4 6 0`} sw={1.9} />
    : expr === 'shy' ? <Ink d={`M${l - 3} ${cy} q3 3 6 0 M${r - 3} ${cy} q3 3 6 0`} sw={1.9} />
    : <><circle cx={l} cy={cy} r={expr === 'surprised' ? 2.8 : 2.3} fill={P.ink} /><circle cx={r} cy={cy} r={expr === 'surprised' ? 2.8 : 2.3} fill={P.ink} /></>;
  const brows =
    expr === 'worried' || expr === 'sad' ? <Ink d={`M${l - 4} ${cy - 6} l7 -3 M${r + 4} ${cy - 6} l-7 -3`} sw={1.5} />
    : expr === 'surprised' ? <Ink d={`M${l - 4} ${cy - 8} q4 -3 8 0 M${r - 4} ${cy - 8} q4 -3 8 0`} sw={1.5} /> : null;
  const mouth =
    expr === 'delighted' ? <path d={`M${m - 6} ${my - 1} q6 8 12 0z`} fill={P.terracotta} stroke={P.ink} strokeWidth="1.7" strokeLinejoin="round" />
    : expr === 'surprised' ? <ellipse cx={m} cy={my + 1} rx="3" ry="3.8" fill={P.terracotta} stroke={P.ink} strokeWidth="1.6" />
    : expr === 'worried' ? <Ink d={`M${m - 5} ${my + 1} q2.5 -3 5 0 q2.5 3 5 0`} sw={1.7} />
    : expr === 'sad' ? <Ink d={`M${m - 5} ${my + 2} q5 -5 10 0`} sw={1.7} />
    : expr === 'shy' ? <Ink d={`M${m - 3} ${my} q3 2.5 6 0`} sw={1.7} />
    : <Ink d={`M${m - 5} ${my - 1} q5 5 10 0`} sw={1.8} />;
  return (
    <g>
      {cheek && <g fill={P.cheek} opacity={expr === 'shy' ? 0.6 : 0.38}><ellipse cx={l - 6} cy={cy + 9} rx="5" ry="3.3" /><ellipse cx={r + 6} cy={cy + 9} rx="5" ry="3.3" /></g>}
      {eyes}{brows}{mouth}
    </g>
  );
}

const Hand = ({ at, skin }: { at: string; skin: string }) => { const [x, y] = endOf(at); return <circle cx={x} cy={y} r="5.6" fill={skin} stroke={P.ink} strokeWidth="2" />; };

/** GRANDPA OTIS — tall, gentle, flat cap, round glasses, white moustache, a cane. Box 170×300. */
export function Otis({ expr = 'happy', pose = 'stand' }: { expr?: CastExpr; pose?: CastPose }) {
  const back = pose === 'search' ? 'M62 128 Q50 104 72 82' : pose === 'sit' ? 'M62 128 Q56 160 70 182' : 'M62 128 Q52 160 56 196';
  const front = pose === 'wave' ? 'M108 128 Q128 108 128 74' : pose === 'hold' ? 'M108 128 Q118 154 104 170' : 'M108 128 Q118 160 120 190';
  const sit = pose === 'sit';
  return (
    <svg viewBox="0 0 170 300" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <g filter="url(#ink)">
        <ellipse cx="85" cy="294" rx="40" ry="4" fill={P.ink} opacity=".1" />
        {sit ? <><Limb d="M74 214 Q104 222 114 286" color={P.wood} w={13} /><Limb d="M94 214 Q126 220 134 284" color={P.wood} w={13} /></>
          : <><Limb d="M76 212 L74 284" color={P.wood} w={13} /><Limb d="M94 212 L97 284" color={P.wood} w={13} /></>}
        <Shape d={sit ? 'M100 292 q0 -10 12 -10 q14 0 16 10z M122 290 q0 -10 12 -10 q14 0 16 10z' : 'M62 292 q0 -10 12 -10 q14 0 16 10z M88 292 q0 -10 12 -10 q14 0 16 10z'} fill={P.ink} op={0.85} sw={1.8} />
        <g transform={sit ? 'translate(0 18)' : undefined}>
          <Limb d={back} color={P.blue} w={13} />
          <Hand at={back} skin={P.otisSkin} />
          <Shape d="M60 120 q25 -10 50 0 l9 96 q-34 7 -68 0z" fill={P.blue} />
          <Shape d="M76 118 l9 22 l9 -22z" fill={P.cream} sw={1.8} />
          <Ink d="M85 140 V214" sw={1.6} />
          {[156, 176, 196].map((y) => <circle key={y} cx="90" cy={y} r="2.2" fill={P.cream} stroke={P.ink} strokeWidth="1.3" />)}
          <Ink d="M64 196 h14 v12 M100 196 h12 v12" sw={1.4} op={0.7} />
          {/* head */}
          <Shape d="M58 86 q-7 -2 -6 6 q1 6 8 5 M112 86 q7 -2 6 6 q-1 6 -8 5" fill={P.otisSkin} sw={1.8} />
          <Shape d="M60 86 q0 -28 25 -28 q25 0 25 28 q0 26 -25 26 q-25 0 -25 -26z" fill={P.otisSkin} />
          <Shape d="M60 84 q-2 -10 6 -14 l2 14z M110 84 q2 -10 -6 -14 l-2 14z" fill={P.white} sw={1.6} />
          <Face cx={85} cy={86} expr={expr} spread={9} />
          <circle cx={80} cy={86} r="7" fill="none" stroke={P.ink} strokeWidth="1.6" />
          <circle cx={98} cy={86} r="7" fill="none" stroke={P.ink} strokeWidth="1.6" />
          <Ink d="M87 86 h4" sw={1.4} />
          <Shape d="M89 101 q-9 -4 -14 3 q8 3 14 -1 q6 4 14 1 q-5 -7 -14 -3z" fill={P.white} sw={1.6} />
          <Shape d="M58 74 q0 -24 28 -24 q26 0 28 18 l16 5 q-4 6 -16 6 q-28 4 -56 -5z" fill={P.sage} sw={2} />
          <Ink d="M64 66 q20 -8 44 0" sw={1.3} op={0.6} />
          <Limb d={front} color={P.blue} w={13} />
          <Hand at={front} skin={P.otisSkin} />
          {pose !== 'wave' && pose !== 'hold' && !sit && <Ink d="M120 192 L126 290 M120 192 q-1 -14 10 -12 q9 2 6 12" sw={4} color={P.wood} />}
        </g>
      </g>
    </svg>
  );
}

/** JUNIPER — Maya's age, red coat with toggles, auburn braids, freckles, blue scarf. Box 160×240. */
export function Juniper({ expr = 'happy', pose = 'stand' }: { expr?: CastExpr; pose?: CastPose }) {
  const back = pose === 'search' ? 'M64 104 Q50 88 70 68' : 'M64 104 Q55 124 54 146';
  const front = pose === 'wave' ? 'M96 104 Q114 92 116 64' : pose === 'hold' ? 'M96 104 Q108 118 92 128' : pose === 'sit' ? 'M96 104 Q106 122 102 134' : 'M96 104 Q105 124 107 146';
  const sit = pose === 'sit';
  const hair = '#7a4128';
  return (
    <svg viewBox="0 0 160 240" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <g filter="url(#ink)">
        <ellipse cx="80" cy="234" rx="34" ry="4" fill={P.ink} opacity=".1" />
        {sit ? <><Limb d="M70 200 Q92 204 108 214" color={P.blueLight} w={9} /><Limb d="M88 200 Q104 200 122 208" color={P.blueLight} w={9} /></>
          : <><Limb d="M71 168 L69 222" color={P.blueLight} w={9} /><Limb d="M89 168 L92 222" color={P.blueLight} w={9} /></>}
        <Shape d={sit ? 'M104 222 q-2 -14 8 -14 h6 v14z M118 216 q-2 -14 8 -14 h6 v14z' : 'M60 228 v-16 h18 v12 q0 4 -4 4z M84 228 v-16 h18 v16z'} fill={P.forest} sw={1.9} />
        <g transform={sit ? 'translate(0 34)' : undefined}>
          {/* braids behind */}
          <Limb d="M54 70 Q48 100 52 118" color={hair} w={10} />
          <Limb d="M106 70 Q112 100 108 118" color={hair} w={10} />
          <circle cx="52" cy="120" r="4" fill={P.ochre} stroke={P.ink} strokeWidth="1.4" />
          <circle cx="108" cy="120" r="4" fill={P.ochre} stroke={P.ink} strokeWidth="1.4" />
          <Limb d={back} color={P.terracotta} w={11} />
          <Hand at={back} skin={P.juniperSkin} />
          <Shape d="M64 98 q16 -8 32 0 l18 72 q-34 9 -68 0z" fill={P.terracotta} />
          {[118, 136, 154].map((y) => <Shape key={y} d={`M84 ${y} h8 v3 h-8z`} fill={P.cream} sw={1.3} />)}
          <Ink d="M80 104 V172" sw={1.6} />
          <Shape d="M62 98 q18 10 36 0 l2 8 q-20 10 -40 0z" fill={P.blue} sw={1.8} />
          <Shape d="M90 104 l8 26 l8 -4 l-8 -24z" fill={P.blue} sw={1.6} />
          {/* head */}
          <Shape d="M53 64 q0 -29 27 -29 q27 0 27 29 q0 26 -27 26 q-27 0 -27 -26z" fill={P.juniperSkin} />
          <Shape d="M52 62 q-2 -30 28 -30 q30 0 28 30 q-10 -14 -28 -14 q-18 0 -28 14z" fill={hair} sw={2} op={1} />
          <Ink d="M64 50 q8 -8 18 -4 M84 46 q10 -2 16 6" sw={1.4} op={0.6} />
          <Face cx={80} cy={66} expr={expr} />
          <g fill={P.wood} opacity=".7">{[[68, 74], [72, 77], [66, 78], [96, 74], [100, 77], [94, 78]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="1" />)}</g>
          <Limb d={front} color={P.terracotta} w={11} />
          <Hand at={front} skin={P.juniperSkin} />
        </g>
      </g>
    </svg>
  );
}

/** BISCUIT — a small scruffy dog, one floppy ear, blue collar. Box 150×120, faces right. */
export function Biscuit({ expr = 'happy', pose = 'stand' }: { expr?: CastExpr; pose?: CastPose }) {
  const down = expr === 'worried' || expr === 'sad' || expr === 'shy';
  const coat = '#efd9a8';
  return (
    <svg viewBox="0 0 150 120" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <g filter="url(#ink)">
        <ellipse cx="75" cy="114" rx="44" ry="4" fill={P.ink} opacity=".1" />
        <g className={expr === 'happy' || expr === 'delighted' ? 'wag' : undefined} style={{ transformOrigin: '40px 64px' }}>
          <Ink d={down ? 'M40 66 q-18 6 -24 20' : 'M40 62 q-16 -8 -18 -28 q6 8 10 4'} sw={7} />
          <Ink d={down ? 'M40 66 q-18 6 -24 20' : 'M40 62 q-16 -8 -18 -28 q6 8 10 4'} sw={3.4} color={coat} />
        </g>
        {[46, 60, 88, 100].map((x, i) => <Limb key={x} d={`M${x} 88 L${x + (i % 2 ? 2 : -2)} 110`} color={coat} w={7} sw={2} />)}
        <Shape d="M36 66 q2 -18 30 -20 h28 q16 0 18 22 q0 22 -22 24 h-34 q-22 0 -20 -26z" fill={coat} />
        <Shape d="M58 58 q10 -6 18 2 q-2 12 -14 10 q-8 -2 -4 -12z" fill={P.wood} op={0.7} noLine />
        <Ink d="M46 70 l4 -3 M52 78 l4 -3 M84 76 l4 -3" sw={1.3} op={0.6} />
        <g transform={pose === 'search' ? 'rotate(10 112 54)' : down ? 'rotate(8 112 54)' : undefined}>
          <Shape d="M92 52 q0 -24 22 -24 q22 0 22 22 q0 8 -6 12 q2 12 -14 14 q-24 2 -24 -24z" fill={coat} />
          <Shape d="M132 52 q8 2 8 8 q-6 4 -10 0z" fill={coat} sw={1.8} />
          <circle cx="138" cy="56" r="3.6" fill={P.ink} />
          <Shape d={down ? 'M98 36 q-12 6 -10 30 q8 -2 12 -12z' : 'M98 36 q-14 2 -14 26 q8 0 14 -10z'} fill={P.wood} sw={1.9} />
          <Shape d="M118 30 l4 -16 l10 14z" fill={coat} sw={1.9} />
          {expr === 'delighted' ? <Ink d="M116 46 q4 -4 8 0" sw={1.9} /> : <circle cx="120" cy="45" r="2.6" fill={P.ink} />}
          {down && <Ink d="M114 38 l9 2" sw={1.5} />}
          {(expr === 'happy' || expr === 'delighted') && <Shape d="M128 66 q2 10 -4 10 q-4 -2 -2 -10z" fill={P.terracottaLight} sw={1.5} />}
          <Ink d={down ? 'M122 66 q4 -2 8 0' : 'M120 64 q6 4 12 0'} sw={1.7} />
        </g>
        <Ink d="M96 70 q8 6 16 2" sw={5} />
        <Ink d="M96 70 q8 6 16 2" sw={3} color={P.blue} />
        <circle cx="106" cy="78" r="3.6" fill={P.ochre} stroke={P.ink} strokeWidth="1.4" />
      </g>
    </svg>
  );
}

/** MRS. PENNY — the baker at Little Crumb. Round, warm, floury. Box 180×290. */
export function Baker({ expr = 'happy', pose = 'stand' }: { expr?: CastExpr; pose?: CastPose }) {
  const front = pose === 'wave' ? 'M122 130 Q142 112 140 80' : 'M122 130 Q138 160 128 186';
  const back = pose === 'search' ? 'M58 130 Q44 120 62 96' : 'M58 130 Q42 160 52 186';
  return (
    <svg viewBox="0 0 180 290" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <g filter="url(#ink)">
        <ellipse cx="90" cy="284" rx="44" ry="4" fill={P.ink} opacity=".1" />
        <Limb d="M78 230 L76 274" color={P.bakerSkin} w={11} />
        <Limb d="M102 230 L104 274" color={P.bakerSkin} w={11} />
        <Shape d="M62 282 q0 -10 12 -10 q14 0 16 10z M92 282 q0 -10 12 -10 q14 0 16 10z" fill={P.forest} sw={1.8} />
        <Limb d={back} color={P.ochreLight} w={14} />
        <Hand at={back} skin={P.bakerSkin} />
        <Shape d="M62 124 q28 -12 56 0 q24 50 16 110 q-44 10 -88 0 q-8 -60 16 -110z" fill={P.ochreLight} />
        <Shape d="M70 140 h40 q14 40 8 92 q-28 6 -56 0 q-6 -52 8 -92z" fill={P.white} sw={2} />
        <Ink d="M70 142 q-8 -8 -2 -16 M110 142 q8 -8 2 -16" sw={1.6} />
        <Ink d="M78 180 h24 v16 h-24z" sw={1.4} op={0.7} />
        <Shape d="M62 92 q0 -32 28 -32 q28 0 28 32 q0 28 -28 28 q-28 0 -28 -28z" fill={P.bakerSkin} />
        <Face cx={90} cy={94} expr={expr} spread={9} />
        <circle cx="70" cy="106" r="2" fill={P.white} opacity=".9" /><circle cx="74" cy="110" r="1.4" fill={P.white} opacity=".9" />
        <Shape d="M60 84 q0 -32 30 -32 q30 0 30 32 q-30 -12 -60 0z" fill={P.terracotta} sw={2} />
        <Shape d="M114 66 q14 -6 18 4 q-8 4 -16 2z M114 70 q12 6 10 18 q-8 -4 -12 -14z" fill={P.terracotta} sw={1.8} />
        <g fill={P.white} opacity=".85">{[[74, 66], [94, 60], [104, 72], [84, 72]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="2.2" />)}</g>
        <Limb d={front} color={P.ochreLight} w={14} />
        <Hand at={front} skin={P.bakerSkin} />
      </g>
    </svg>
  );
}

/** Cheeky animals, one per place. Each box ~130×100, facing right. */
export function Cat({ run = false }: { run?: boolean }) {
  const fur = '#a8a294';
  return (
    <svg viewBox="0 0 130 100" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <g filter="url(#ink)">
        <Ink d="M24 58 q-20 -6 -18 -30" sw={7} /><Ink d="M24 58 q-20 -6 -18 -30" sw={3.6} color={fur} />
        {(run ? ['M36 70 L22 90', 'M48 72 L44 94', 'M84 72 L98 92', 'M94 70 L108 86'] : ['M38 72 L36 94', 'M50 72 L50 94', 'M84 72 L84 94', 'M94 72 L96 94']).map((d) => <Limb key={d} d={d} color={fur} w={7} sw={2} />)}
        <Shape d="M26 62 q2 -20 30 -20 h32 q14 0 14 16 q0 18 -18 18 h-40 q-20 0 -18 -14z" fill={fur} />
        <Ink d="M50 46 l4 10 M62 44 l3 12 M74 44 l2 12" sw={1.6} op={0.65} />
        <Shape d="M90 46 q0 -20 18 -20 q18 0 18 18 q0 16 -18 16 q-18 0 -18 -14z" fill={fur} />
        <Shape d="M94 34 l2 -16 l10 10z M114 28 l10 -10 l2 16z" fill={fur} sw={1.8} />
        <circle cx="104" cy="42" r="2.2" fill={P.ink} /><circle cx="118" cy="42" r="2.2" fill={P.ink} />
        <Ink d="M108 50 q3 3 6 0 M100 50 h-12 M100 54 l-11 4 M122 50 h12 M122 54 l11 4" sw={1.2} />
      </g>
    </svg>
  );
}

export function Squirrel() {
  const fur = P.brick;
  return (
    <svg viewBox="0 0 110 110" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <g filter="url(#ink)">
        <Shape d="M40 90 q-36 -4 -34 -40 q2 -30 26 -36 q-8 20 6 34 q10 12 2 42z" fill={fur} op={0.9} />
        <Shape d="M38 92 q-4 -30 18 -38 q18 -6 24 12 q6 20 -10 28 q-16 6 -32 -2z" fill={fur} />
        <Shape d="M62 52 q0 -20 16 -20 q16 0 16 16 q0 12 -14 14 q-18 2 -18 -10z" fill={fur} />
        <Shape d="M68 36 l2 -12 l8 8z" fill={fur} sw={1.6} />
        <circle cx="84" cy="44" r="2.4" fill={P.ink} />
        <circle cx="93" cy="50" r="1.6" fill={P.ink} />
        <Shape d="M56 70 q10 4 18 -2" fill="none" />
        <Limb d="M50 92 L48 102 M70 90 L74 102" color={fur} w={6} sw={1.8} />
        <Shape d="M60 70 q10 -2 14 4 q-6 6 -14 2z" fill={P.cream} sw={1.4} />
      </g>
    </svg>
  );
}

export function Pigeon() {
  return (
    <svg viewBox="0 0 100 90" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <g filter="url(#ink)">
        <Ink d="M44 70 l-4 16 M56 70 l2 16 M36 86 h10 M54 86 h10" sw={2} color={P.terracotta} />
        <Shape d="M14 50 q0 -22 32 -22 h12 q22 0 22 20 q0 22 -26 24 h-18 q-22 0 -22 -22z" fill={P.blueLight} />
        <Shape d="M18 46 q20 -10 40 4 q-18 14 -40 -4z" fill={P.blue} sw={1.8} />
        <Shape d="M62 32 q0 -18 14 -18 q14 0 14 14 q0 10 -10 14 l-18 2z" fill={P.blue} />
        <path d="M64 40 q10 6 22 -4" fill="none" stroke={P.sage} strokeWidth="4" opacity=".8" />
        <circle cx="80" cy="26" r="2.2" fill={P.ink} />
        <Shape d="M90 26 l8 3 l-8 3z" fill={P.ochre} sw={1.4} />
      </g>
    </svg>
  );
}
