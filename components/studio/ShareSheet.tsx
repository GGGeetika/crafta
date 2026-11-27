'use client';
import { useEffect, useRef, useState } from 'react';
import { bookTitle, pages, type Story } from '@/lib/story/engine';
import { coverScene, pageScene } from '@/lib/story/compose';
import { track } from '@/lib/analytics';
import { Stage } from '../art/Stage';
import { Icon } from '../ui/marks';
import { bookHtml, bookLink, coverPng, deliver, fileName } from './exporter';
import { byline } from './Cover';

/** Offscreen, static copies of every page — the source for exported files. */
function ExportRig({ story, rig }: { story: Story; rig: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={rig} className="export-rig" aria-hidden="true">
      <div data-export="cover"><Stage scene={coverScene(story)} still /></div>
      {pages(story).map((p) => <div key={p.n} data-export="page"><Stage scene={pageScene(story, p.n)} still /></div>)}
    </div>
  );
}

function HoldToOpen({ onOpen }: { onOpen: () => void }) {
  const [holding, setHolding] = useState(false);
  const t = useRef<number | null>(null);
  const start = () => { setHolding(true); t.current = window.setTimeout(onOpen, 1300); };
  const stop = () => { setHolding(false); if (t.current) window.clearTimeout(t.current); };
  return (
    <button type="button" className={`hold${holding ? ' holding' : ''}`}
      onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) start(); }} onKeyUp={stop}
      onContextMenu={(e) => e.preventDefault()}>
      <span className="hold-fill" aria-hidden="true" />
      <span className="hold-label">Grown-ups: press and hold</span>
    </button>
  );
}

export function ShareSheet({ story, onClose }: { story: Story; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const rig = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  async function sendLink() {
    const url = bookLink(story);
    const data = { title: `${bookTitle(story)} — by ${byline(story)}`, text: 'We made a book together today!', url };
    try {
      if (navigator.share) { await navigator.share(data); track('book_shared'); setNote('Sent. Anyone with the link can read your book — no sign-up needed.'); return; }
      await navigator.clipboard.writeText(url);
      track('book_shared');
      setNote('Link copied. Paste it into a message to send your book.');
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setNote('Couldn’t share just now. Try saving the book instead.');
    }
  }

  async function save(kind: 'book' | 'cover') {
    if (!rig.current || busy) return;
    setBusy(kind); setNote('');
    try {
      const cover = rig.current.querySelector('[data-export="cover"] .stage')!;
      let file: File;
      if (kind === 'book') {
        const stages = Array.from(rig.current.querySelectorAll('[data-export="page"] .stage'));
        file = new File([await bookHtml(story, cover, stages)], fileName(story, 'html'), { type: 'text/html' });
      } else {
        file = new File([await coverPng(story, cover)], fileName(story, 'png'), { type: 'image/png' });
      }
      const how = await deliver(file);
      if (how !== 'cancelled') { track(how === 'shared' ? 'book_shared' : 'book_saved'); setNote(kind === 'book' ? 'Saved! The book file opens in any web browser, even offline.' : 'Saved the cover picture.'); }
    } catch {
      setNote('Something went wrong saving. Please try again.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-labelledby="share-h" onClick={onClose}>
      <div className="sheet-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="icon-btn sheet-close" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        <h2 id="share-h">For grown-ups</h2>
        {!open ? (
          <>
            <p>Sharing sends your book — including the authors’ names — to whoever you choose. It is never posted publicly.</p>
            <HoldToOpen onOpen={() => setOpen(true)} />
          </>
        ) : (
          <>
            <p className="sheet-sub">“We wrote a book together today!”</p>
            <div className="sheet-actions">
              <button type="button" className="btn" onClick={sendLink}><Icon name="link" size={18} /> Send a private reading link</button>
              <button type="button" className="btn" onClick={() => save('book')} disabled={!!busy}><Icon name="download" size={18} /> {busy === 'book' ? 'Binding the book…' : 'Save the whole book'}</button>
              <button type="button" className="btn" onClick={() => save('cover')} disabled={!!busy}><Icon name="image" size={18} /> {busy === 'cover' ? 'Painting the cover…' : 'Save the cover picture'}</button>
            </div>
            <p className="sheet-fine">The link holds the whole book inside it, so nothing is stored on our servers. Anyone you send it to can read it, without an account.</p>
          </>
        )}
        {note && <p className="sheet-note" role="status">{note}</p>}
      </div>
      {open && <ExportRig story={story} rig={rig} />}
    </div>
  );
}
