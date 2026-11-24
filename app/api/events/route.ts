import { EVENTS } from '@/lib/analytics';

/** Receives anonymous event names and writes them to the server log. No storage, no personal data. */
export async function POST(request: Request) {
  try {
    const { e, d, r, t } = await request.json();
    if (typeof e !== 'string' || !(EVENTS as readonly string[]).includes(e)) return new Response(null, { status: 204 });
    console.log(JSON.stringify({ crafta: e, device: String(d).slice(0, 12), round: Number.isInteger(r) ? r : undefined, at: Number.isFinite(t) ? t : Date.now() }));
  } catch { /* ignore malformed beacons */ }
  return new Response(null, { status: 204 });
}
