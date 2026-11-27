'use client';
import { useState } from 'react';
import { Maya } from '../art/Maya';
import { Crayon, Icon, Pen } from '../ui/marks';

export function Authors({ initial, onStart, onBack }: { initial: { child: string; grownup: string }; onStart: (a: { child: string; grownup: string }) => void; onBack: () => void }) {
  const [child, setChild] = useState(initial.child);
  const [grownup, setGrownup] = useState(initial.grownup);
  return (
    <main className="authors">
      <button type="button" className="icon-btn authors-back" onClick={onBack} aria-label="Back"><Icon name="back" /></button>
      <form className="authors-page" onSubmit={(e) => { e.preventDefault(); onStart({ child, grownup }); }}>
        <div className="authors-art"><Maya pose="wave" expr="delighted" /></div>
        <p className="authors-kicker">A Maple Street story</p>
        <h1 className="authors-h">written by</h1>
        <label className="author-field author-child">
          <span className="author-icon"><Crayon size={30} /></span>
          <span className="sr">The little author’s name</span>
          <input value={child} onChange={(e) => setChild(e.target.value)} maxLength={24} placeholder="Little author" autoComplete="off" autoCapitalize="words" />
        </label>
        <span className="authors-and">and</span>
        <label className="author-field author-grownup">
          <span className="author-icon"><Pen size={30} /></span>
          <span className="sr">The grown-up author’s name</span>
          <input value={grownup} onChange={(e) => setGrownup(e.target.value)} maxLength={24} placeholder="Mom, Grandpa, Auntie Jo…" autoComplete="off" autoCapitalize="words" />
        </label>
        <button type="submit" className="btn btn-primary btn-big">Open to page one</button>
        <p className="authors-fine">First names or nicknames. They stay on this device.</p>
      </form>
    </main>
  );
}
