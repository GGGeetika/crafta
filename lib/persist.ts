import { restore, type Story } from './story/engine.ts';

/** Local-only persistence. Nothing here ever leaves the device. */
const DRAFT = 'crafta.v2.draft';
const SHELF = 'crafta.v2.shelf';

function read(key: string): unknown {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}

export function loadDraft(): Story | null {
  return restore(read(DRAFT));
}
export function saveDraft(s: Story) {
  return write(DRAFT, s);
}
export function clearDraft() {
  try { localStorage.removeItem(DRAFT); } catch { /* private mode */ }
}

export function loadShelf(): Story[] {
  const raw = read(SHELF);
  if (!Array.isArray(raw)) return [];
  return raw.map(restore).filter((s): s is Story => !!s && !!s.finishedAt).sort((a, b) => (b.finishedAt ?? 0) - (a.finishedAt ?? 0));
}
export function shelveBook(s: Story) {
  const shelf = loadShelf().filter((b) => b.id !== s.id);
  return write(SHELF, [s, ...shelf].slice(0, 60));
}
export function removeBook(id: string) {
  return write(SHELF, loadShelf().filter((b) => b.id !== id));
}
