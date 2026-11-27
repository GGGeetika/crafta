import { P } from './palette';

/**
 * Shared filters for the whole Crafta universe, rendered once per document.
 *
 * - `ink`: a slow, low-amplitude wobble that turns geometric paths into a
 *   steady-handed pen line, plus fine grain so lines and washes pick up the
 *   tooth of the paper.
 * - `washy`: a looser wobble used on large background washes (sky, hills,
 *   walls) so their edges bloom irregularly like watercolour.
 *
 * Every asset is drawn in the same world units (the stage is 1000×700), so
 * the wobble and grain read the same on a building, a child and a teacup.
 */
export function ArtDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        <filter id="ink" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed="7" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="3.4" xChannelSelector="R" yChannelSelector="G" result="drawn" />
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="3" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.38 1.12" result="tooth" />
          <feComposite in="drawn" in2="tooth" operator="in" />
        </filter>
        <filter id="washy" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="3" seed="11" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="9" xChannelSelector="R" yChannelSelector="G" result="bloom" />
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="5" result="mottle" />
          <feColorMatrix in="mottle" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.35 1.12" result="pool" />
          <feComposite in="bloom" in2="pool" operator="in" />
        </filter>
        <filter id="paperGrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="9" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.16  0 0 0 0 0.1  0 0 0 0.55 -0.18" />
        </filter>
        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <path d="M0 0v7" stroke={P.ink} strokeWidth="1" opacity=".35" />
        </pattern>
      </defs>
    </svg>
  );
}

/** Line style shared by every drawing. */
export const line = {
  stroke: P.ink,
  strokeWidth: 2.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
};

/** A filled shape with its own pen outline, washes sitting slightly off-register. */
export function Shape({ d, fill, sw = 2.4, op = 0.94, off = true, noLine = false, lineOp = 1 }: { d: string; fill: string; sw?: number; op?: number; off?: boolean; noLine?: boolean; lineOp?: number }) {
  return (
    <>
      <path d={d} fill={fill} opacity={op} transform={off ? 'translate(1.4 1.1)' : undefined} />
      {!noLine && <path d={d} {...line} strokeWidth={sw} opacity={lineOp} />}
    </>
  );
}

/** A limb: a thick coloured stroke with a pen outline around it. */
export function Limb({ d, color, w = 11, sw = 2.3 }: { d: string; color: string; w?: number; sw?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={P.ink} strokeWidth={w + sw * 2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

export function Ink({ d, sw = 2.4, op = 1, color = P.ink }: { d: string; sw?: number; op?: number; color?: string }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" opacity={op} />;
}
