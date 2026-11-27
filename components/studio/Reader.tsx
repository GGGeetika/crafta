'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { authorNames, bookTitle, pages, world, type Story } from '@/lib/story/engine';
import { pageScene } from '@/lib/story/compose';
import { THINGS } from '@/lib/story/content';
import { track } from '@/lib/analytics';
import { Stage } from '../art/Stage';
import { Maya } from '../art/Maya';
import { Thing } from '../art/objects';
import { Cover, byline } from './Cover';
import { BrandMark, Icon } from '../ui/marks';

type Leaf = { kind: 'cover' } | { kind: 'title' } | { kind: 'page'; n: number } | { kind: 'end' } | { kind: 'authors' };

export function madeOn(s: Story) {
  return new Date(s.finishedAt ?? s.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function Reader({ story, onClose, onAgain, onShare, shared = false, onKeep }: {
  story: Story; onClose: () => void; onAgain: () => void; onShare?: () => void; shared?: boolean; onKeep?: () => void;
}) {
  const leaves: Leaf[] = [{ kind: 'cover' }, { kind: 'title' }, ...pages(story).map((p) => ({ kind: 'page' as const, n: p.n })), { kind: 'end' }, { kind: 'authors' }];
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  const [size, setSize] = useState(1);
  const start = useRef<{ x: number; y: number } | null>(null);
  const { child, grownup } = authorNames(story);
  const text = pages(story);
  const w = world(story);

  useEffect(() => { track('book_opened'); try { setSize(Number(localStorage.getItem('crafta.v2.textsize')) || 1); } catch { /* */ } }, []);
  useEffect(() => { if (leaves[i]?.kind === 'authors') track('reading_completed'); }, [i]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = useCallback((d: number) => {
    setI((cur) => { const n = Math.max(0, Math.min(leaves.length - 1, cur + d)); if (n !== cur) setDir(d > 0 ? 'fwd' : 'back'); return n; });
  }, [leaves.length]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [go, onClose]);

  function cycleSize() {
    const n = size >= 3 ? 1 : size + 1;
    setSize(n);
    try { localStorage.setItem('crafta.v2.textsize', String(n)); } catch { /* */ }
  }

  function onPointerDown(e: React.PointerEvent) { start.current = { x: e.clientX, y: e.clientY }; }
  function onPointerUp(e: React.PointerEvent) {
    const s = start.current; start.current = null;
    if (!s || (e.target as HTMLElement).closest('button, a, input')) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { go(dx < 0 ? 1 : -1); return; }
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
      go(e.clientX - r.left < r.width * 0.33 ? -1 : 1);
    }
  }

  const leaf = leaves[i];
  let body: React.ReactNode = null;
  if (leaf.kind === 'cover') body = <div className="r-cover"><Cover story={story} still={false} /></div>;
  if (leaf.kind === 'title') body = (
    <div className="r-title">
      <div className="r-title-art"><Maya pose="wave" expr="delighted" look={story.hero.look} /></div>
      <h1>{bookTitle(story)}</h1>
      <p className="r-title-by">written by <strong>{child}</strong> and <strong>{grownup}</strong></p>
      <p className="r-title-small">A Maple Street story · {madeOn(story)}</p>
    </div>
  );
  if (leaf.kind === 'page') {
    const p = text[leaf.n - 1];
    body = (
      <div className={`r-page r-page-${leaf.n % 2 ? 'odd' : 'even'}`}>
        <div className="r-art"><Stage scene={pageScene(story, leaf.n)} still={false} describe={`Illustration for page ${leaf.n}`} /></div>
        <div className="r-words">
          <p className={leaf.n === 1 ? 'dropcap' : undefined}>{p.text}</p>
          <span className="r-folio">{leaf.n}</span>
        </div>
      </div>
    );
  }
  if (leaf.kind === 'end') body = (
    <div className="r-end">
      {w.object && <div className="r-end-art" style={{ aspectRatio: '1' }}><Thing id={w.object} look={w.special && w.special !== 'custom' ? w.special : 'plain'} /></div>}
      <p className="r-end-word">The End</p>
      <p className="r-end-small">…until next time, on Maple Street.</p>
    </div>
  );
  if (leaf.kind === 'authors') body = (
    <div className="r-authors">
      <p className="r-authors-kicker">This book was made by</p>
      <p className="r-authors-names">{child}<span>&amp;</span>{grownup}</p>
      <p className="r-authors-date">on {madeOn(story)}</p>
      <p className="r-authors-note">{w.object ? `Starring ${story.hero.name}, ${THINGS[w.object].the}, and two very fine authors.` : ''}</p>
      <div className="r-authors-actions">
        <button type="button" className="btn btn-primary" onClick={onAgain}>{shared ? 'Make your own book' : 'Make another adventure'}</button>
        {shared && onKeep && <button type="button" className="btn" onClick={onKeep}>Keep this book on our shelf</button>}
        {!shared && onShare && <button type="button" className="btn" onClick={onShare}><Icon name="share" size={18} /> Save or share</button>}
      </div>
      <p className="r-imprint"><BrandMark size={20} /> Crafta · Little books. Big memories.</p>
    </div>
  );

  return (
    <div className={`reader ts-${size}`} role="region" aria-label={`${bookTitle(story)}, by ${byline(story)}`}>
      <div className="reader-bar">
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close the book"><Icon name="close" /></button>
        <button type="button" className="icon-btn" onClick={cycleSize} aria-label={`Text size ${size} of 3`}><Icon name="text" /></button>
      </div>
      <div className="reader-book" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <div className={`reader-leaf leaf-${leaf.kind} turn-${dir}`} key={i} aria-live="polite">{body}</div>
      </div>
      <div className="reader-nav">
        <button type="button" className="icon-btn" onClick={() => go(-1)} disabled={i === 0} aria-label="Previous page"><Icon name="left" /></button>
        <span className="reader-count" aria-hidden="true">{leaves.map((_, k) => <i key={k} className={k === i ? 'on' : undefined} />)}</span>
        <button type="button" className="icon-btn" onClick={() => go(1)} disabled={i === leaves.length - 1} aria-label="Next page"><Icon name="right" /></button>
      </div>
    </div>
  );
}
