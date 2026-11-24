'use client';
import { useCallback, useEffect, useState } from 'react';
import { authorNames, decodeBook, newStory, type Story } from '@/lib/story/engine';
import { clearDraft, loadDraft, loadShelf, saveDraft, shelveBook } from '@/lib/persist';
import { track } from '@/lib/analytics';
import { Home } from './Home';
import { Authors } from './Authors';
import { Make } from './Make';
import { Reader } from './Reader';
import { ShareSheet } from './ShareSheet';
import { Cover, byline } from './Cover';
import { Icon } from '../ui/marks';

type Screen = 'home' | 'authors' | 'make' | 'reveal' | 'read';

function Reveal({ story, onRead, onShare, onHome }: { story: Story; onRead: () => void; onShare: () => void; onHome: () => void }) {
  return (
    <main className="reveal">
      <div className="reveal-book"><Cover story={story} still={false} /></div>
      <div className="reveal-words">
        <p className="reveal-kicker">A new book for your shelf</p>
        <p className="reveal-by">Written by {byline(story)}</p>
        <button type="button" className="btn btn-primary btn-big" onClick={onRead} autoFocus>Let’s read together</button>
        <div className="reveal-more">
          <button type="button" className="btn-link" onClick={onShare}><Icon name="share" size={16} /> Save or share</button>
          <button type="button" className="btn-link" onClick={onHome}><Icon name="shelf" size={16} /> Our bookshelf</button>
        </div>
      </div>
    </main>
  );
}

export function Studio() {
  const [screen, setScreen] = useState<Screen>('home');
  const [story, setStory] = useState<Story | null>(null);
  const [draft, setDraft] = useState<Story | null>(null);
  const [shelf, setShelf] = useState<Story[]>([]);
  const [reading, setReading] = useState<Story | null>(null);
  const [shared, setShared] = useState(false);
  const [sharing, setSharing] = useState<Story | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    track('session_started');
    setShelf(loadShelf());
    setDraft(loadDraft());
    const m = window.location.hash.match(/book=([\w-]+)/);
    if (m) {
      const b = decodeBook(m[1]);
      if (b) { setReading(b); setShared(true); setScreen('read'); }
      else setNotice('That book link seems to be incomplete.');
    }
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [screen]);

  const update = useCallback((s: Story) => {
    setStory(s);
    if (!saveDraft(s)) setNotice('This browser isn’t letting us save, so keep this page open until the book is finished.');
  }, []);

  function begin() {
    if (shelf.length > 0) track('second_book_started');
    setScreen('authors');
  }

  function start(authors: { child: string; grownup: string }) {
    const s = newStory(authors);
    update(s);
    setDraft(s);
    setScreen('make');
  }

  function finish(s: Story) {
    track('book_completed');
    if (shelveBook(s)) track('book_saved');
    clearDraft();
    setDraft(null);
    setShelf(loadShelf());
    setStory(s);
    setScreen('reveal');
  }

  function home() {
    if (window.location.hash) history.replaceState(null, '', window.location.pathname);
    setDraft(loadDraft());
    setShelf(loadShelf());
    setShared(false);
    setScreen('home');
  }

  function read(s: Story) { setReading(s); setScreen('read'); }

  const lastAuthors = story ? authorNames(story) : shelf[0] ? shelf[0].authors : draft ? draft.authors : { child: '', grownup: '' };
  const named = { child: lastAuthors.child === 'Little author' ? '' : lastAuthors.child, grownup: lastAuthors.grownup === 'Grown-up' ? '' : lastAuthors.grownup };

  return (
    <>
      {screen === 'home' && <Home draft={draft} shelf={shelf} onMake={begin} onContinue={() => { if (draft) { setStory(draft); setScreen('make'); } }} onRead={read} />}
      {screen === 'authors' && <Authors initial={named} onStart={start} onBack={home} />}
      {screen === 'make' && story && <Make story={story} onChange={update} onFinish={finish} onHome={home} />}
      {screen === 'reveal' && story && <Reveal story={story} onRead={() => read(story)} onShare={() => setSharing(story)} onHome={home} />}
      {screen === 'read' && reading && (
        <Reader
          story={reading}
          shared={shared}
          onClose={home}
          onAgain={() => { home(); begin(); }}
          onShare={() => setSharing(reading)}
          onKeep={() => { if (shelveBook(reading)) { setShelf(loadShelf()); setNotice('Added to your bookshelf.'); } }}
        />
      )}
      {sharing && <ShareSheet story={sharing} onClose={() => setSharing(null)} />}
      {notice && <div className="toast" role="status" onClick={() => setNotice('')}>{notice}</div>}
    </>
  );
}
