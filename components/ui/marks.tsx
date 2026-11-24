import { P } from '../art/palette';

/**
 * The Crafta mark: a little book, open, with a sprig growing from its spine.
 * Books that grow — drawn in the same pen as the rest of the world.
 */
export function BrandMark({ size = 40, title }: { size?: number; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 21 C40 13 50 12 54 14 L52 22" fill="none" stroke={P.forest} strokeWidth="2.4" />
        <path d="M32 33 V16" stroke={P.forest} strokeWidth="2.6" fill="none" />
        <path d="M32 22 q-11 -4 -13 -14 q11 1 13 14z" fill={P.sage} stroke={P.forest} strokeWidth="2.2" />
        <path d="M32 19 q8 -9 17 -8 q-4 10 -17 8z" fill={P.sage} stroke={P.forest} strokeWidth="2.2" />
        <circle cx="49" cy="20" r="3.2" fill={P.terracotta} stroke={P.forest} strokeWidth="1.8" />
        <path d="M32 36 C24 30 14 30 7 33 V54 C14 51 24 51 32 57 Z" fill={P.cream} stroke={P.forest} strokeWidth="2.6" />
        <path d="M32 36 C40 30 50 30 57 33 V54 C50 51 40 51 32 57 Z" fill={P.cream} stroke={P.forest} strokeWidth="2.6" />
        <path d="M13 39 q8 -2 14 1 M13 45 q8 -2 14 1 M38 40 q7 -3 13 -1" stroke={P.forest} strokeWidth="1.6" fill="none" opacity=".55" />
      </g>
    </svg>
  );
}

export function Wordmark({ size = 28 }: { size?: number }) {
  return (
    <span className="wordmark" style={{ fontSize: size }}>
      <BrandMark size={size * 1.35} />
      <span>Crafta</span>
    </span>
  );
}

/** Whose turn: a crayon for the little author, a pen for the grown-up. */
export function Crayon({ size = 34 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <g strokeLinecap="round" strokeLinejoin="round" stroke={P.ink} strokeWidth="2.2">
        <path d="M12 38 L34 10 l6 5 L18 43z" fill={P.ochre} />
        <path d="M12 38 l-3 7 l9 -2" fill={P.terracotta} />
        <path d="M17 32 l6 5 M27 19 l6 5" fill="none" />
      </g>
    </svg>
  );
}
export function Pen({ size = 34 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <g strokeLinecap="round" strokeLinejoin="round" stroke={P.ink} strokeWidth="2.2">
        <path d="M30 8 l10 10 L20 38 l-10 -10z" fill={P.forestLight} />
        <path d="M10 28 l10 10 l-12 4z" fill={P.cream} />
        <path d="M8 42 l6 -6" fill="none" />
        <path d="M26 12 l10 10" fill="none" />
      </g>
    </svg>
  );
}
export function Together({ size = 34 }: { size?: number }) {
  return (
    <svg viewBox="0 0 56 48" width={size * 1.15} height={size} aria-hidden="true">
      <g strokeLinecap="round" strokeLinejoin="round" stroke={P.ink} strokeWidth="2.2">
        <path d="M10 40 L30 10 l6 4 L16 44z" fill={P.ochre} />
        <path d="M10 40 l-2 6 l8 -2" fill={P.terracotta} />
        <path d="M24 12 l8 -6 l20 28 l-8 6z" fill={P.forestLight} />
        <path d="M44 40 l8 -6 l-1 10z" fill={P.cream} />
      </g>
    </svg>
  );
}

type IconName = 'back' | 'close' | 'left' | 'right' | 'share' | 'download' | 'text' | 'shelf' | 'undo' | 'pencil' | 'image' | 'link';
/** Small hand-drawn interface icons. */
export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const d: Record<IconName, string> = {
    back: 'M15 5 L8 12 L15 19',
    close: 'M6 6 L18 18 M18 6 L6 18',
    left: 'M14 5 L7 12 L14 19',
    right: 'M10 5 L17 12 L10 19',
    share: 'M12 15 V3 M7 8 l5 -5 l5 5 M5 12 v7 q0 2 2 2 h10 q2 0 2 -2 v-7',
    download: 'M12 3 v12 M7 10 l5 5 l5 -5 M5 20 h14',
    text: 'M4 19 L9 6 L14 19 M6 14 h6 M15 19 l3 -8 l3 8 M16 16 h4',
    shelf: 'M3 20 h18 M5 20 V6 h3 v14 M9 20 V4 h3 v16 M14 20 l2 -14 l3 1 l-2 13',
    undo: 'M8 7 L4 11 L8 15 M4 11 h10 q6 0 6 5 q0 3 -3 4',
    pencil: 'M4 20 l1 -5 L16 4 l4 4 L9 19z M14 6 l4 4',
    image: 'M3 5 h18 v14 h-18z M3 16 l5 -5 l5 5 l3 -3 l5 5 M15 9 h.1',
    link: 'M10 14 l4 -4 M8 11 l-2 2 q-3 3 0 6 q3 3 6 0 l2 -2 M16 13 l2 -2 q3 -3 0 -6 q-3 -3 -6 0 l-2 2',
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={d[name]} fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
