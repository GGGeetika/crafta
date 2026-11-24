/**
 * Privacy-preserving instrumentation for the Thanksgiving test.
 * Records event names only, with an anonymous random device id.
 * Never records names, story choices, text or anything a child typed.
 */
export const EVENTS = [
  'session_started', 'first_interaction', 'child_contribution', 'grownup_contribution', 'joint_contribution',
  'round_completed', 'book_completed', 'book_opened', 'reading_completed', 'book_saved', 'book_shared', 'second_book_started',
] as const;
export type EventName = (typeof EVENTS)[number];

function deviceId() {
  try {
    let id = localStorage.getItem('crafta.v2.anon');
    if (!id) { id = Math.random().toString(36).slice(2, 12); localStorage.setItem('crafta.v2.anon', id); }
    return id;
  } catch { return 'anon'; }
}

let firstSent = false;
export function track(event: EventName, round?: number) {
  if (typeof window === 'undefined') return;
  if (event === 'first_interaction') { if (firstSent) return; firstSent = true; }
  try {
    const counts = JSON.parse(localStorage.getItem('crafta.v2.events') || '{}');
    counts[event] = (counts[event] || 0) + 1;
    localStorage.setItem('crafta.v2.events', JSON.stringify(counts));
  } catch { /* storage unavailable */ }
  try {
    const body = JSON.stringify({ e: event, d: deviceId(), r: typeof round === 'number' ? round : undefined, t: Date.now() });
    if (navigator.sendBeacon) navigator.sendBeacon('/api/events', new Blob([body], { type: 'application/json' }));
  } catch { /* offline is fine */ }
}
