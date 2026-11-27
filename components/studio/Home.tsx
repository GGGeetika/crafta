'use client';
import { useMemo } from 'react';
import { newStory, pageCount, type Story } from '@/lib/story/engine';
import { scene } from '@/lib/story/compose';
import { Stage } from '../art/Stage';
import { Cover, byline } from './Cover';
import { Wordmark } from '../ui/marks';

export function Home({ draft, shelf, onMake, onContinue, onRead }: {
  draft: Story | null; shelf: Story[]; onMake: () => void; onContinue: () => void; onRead: (s: Story) => void;
}) {
  const hero = useMemo(() => scene(newStory({ child: '', grownup: '' }, 0)), []);
  const draftPages = draft ? pageCount(draft) : 0;
  return (
    <main className="home">
      <section className="home-hero">
        <div className="home-art"><Stage scene={hero} describe="Maya waves from Maple Street, with the bakery, the station on the hill and the park." /></div>
        <div className="home-words">
          <Wordmark size={30} />
          <h1 className="home-h">A classic children’s book that you make together.</h1>
          <p className="home-sub">Sit side by side. Take turns. Watch your book grow, page by page.</p>
          <div className="home-actions">
            {draft ? (
              <>
                <button type="button" className="btn btn-primary btn-big" onClick={onContinue}>Continue our book</button>
                <span className="home-draft">{draftPages ? `${draftPages} of 6 pages made` : 'Just begun'} · by {byline(draft)}</span>
                <button type="button" className="btn-link" onClick={onMake}>Start a different book</button>
              </>
            ) : (
              <button type="button" className="btn btn-primary btn-big" onClick={onMake}>Make a book together</button>
            )}
          </div>
        </div>
      </section>

      {shelf.length > 0 && (
        <section className="shelf" aria-labelledby="shelf-h">
          <h2 id="shelf-h">Our bookshelf</h2>
          <ul className="shelf-row">
            {shelf.map((b) => (
              <li key={b.id}>
                <button type="button" className="shelf-book" onClick={() => onRead(b)} aria-label={`Read ${b.picks.title?.text ?? 'our book'}, by ${byline(b)}`}>
                  <Cover story={b} />
                </button>
              </li>
            ))}
          </ul>
          <div className="shelf-plank" aria-hidden="true" />
        </section>
      )}
      <footer className="home-foot">Little books. Big memories. · Everything stays on this device.</footer>
    </main>
  );
}
