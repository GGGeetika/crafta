'use client';
import { useState } from 'react';
import { COATS, HAIRS, HAIR_COLORS, MAYA, PRONOUNS, SKINS, type Hero, type HeroLook, type Pronoun } from '@/lib/story/hero';
import { COAT_COLOR, HAIR_COLOR, HeroHead, Maya, SKIN_COLOR } from '../art/Maya';
import { Crayon, Icon, Pen } from '../ui/marks';

const HAIR_NAME: Record<string, string> = { puffs: 'Puffs', curls: 'Curls', braids: 'Braids', bob: 'Bob', short: 'Short' };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="hb-row" role="radiogroup" aria-label={label}>
      <span className="hb-label">{label}</span>
      <div className="hb-opts">{children}</div>
    </div>
  );
}

function Swatch({ color, on, label, onPick }: { color: string; on: boolean; label: string; onPick: () => void }) {
  return <button type="button" role="radio" aria-checked={on} aria-label={label} className={`hb-swatch${on ? ' on' : ''}`} style={{ background: color }} onClick={onPick} />;
}

function Thumb({ look, on, label, onPick }: { look: HeroLook; on: boolean; label: string; onPick: () => void }) {
  return <button type="button" role="radio" aria-checked={on} aria-label={label} className={`hb-thumb${on ? ' on' : ''}`} onClick={onPick}><HeroHead look={look} /></button>;
}

/** The little author draws themself into the book. */
export function HeroBuilder({ childName, initial, onDone, onBack }: { childName: string; initial: Hero; onDone: (h: Hero) => void; onBack: () => void }) {
  const name = childName.trim() || 'Maya';
  const [look, setLook] = useState<HeroLook>(initial.look);
  const [pronoun, setPronoun] = useState<Pronoun>(initial.pronoun);
  const [bump, setBump] = useState(0);
  const set = (patch: Partial<HeroLook>) => { setLook((l) => ({ ...l, ...patch })); setBump((b) => b + 1); };

  return (
    <main className="herob">
      <button type="button" className="icon-btn authors-back" onClick={onBack} aria-label="Back"><Icon name="back" /></button>
      <section className="hb-preview" aria-live="polite">
        <div className="hb-figure" key={bump}><Maya look={look} pose="wave" expr="delighted" /></div>
        <p className="hb-name">{name}</p>
        <p className="hb-caption">the hero of our book</p>
      </section>

      <section className="hb-panel">
        <div className="cue cue-child">
          <span className="cue-icon"><Crayon /></span>
          <span className="cue-text"><span className="cue-name">{childName.trim() ? `${name}’s turn` : 'Little author’s turn'}</span><span className="cue-role">little author</span></span>
        </div>
        <h1 className="hb-h">Who’s the hero?</h1>
        <p className="hb-hint">Tap to make {name} look just right</p>

        <Row label="Hair">
          {HAIRS.map((h) => <Thumb key={h} look={{ ...look, hair: h, glasses: false }} on={look.hair === h} label={`${HAIR_NAME[h]} hair`} onPick={() => set({ hair: h })} />)}
        </Row>
        <Row label="Hair colour">
          {HAIR_COLORS.map((c) => <Swatch key={c} color={HAIR_COLOR[c]} on={look.hairColor === c} label={`${c} hair`} onPick={() => set({ hairColor: c })} />)}
        </Row>
        <Row label="Skin">
          {SKINS.map((c) => <Swatch key={c} color={SKIN_COLOR[c]} on={look.skin === c} label={`${c} skin`} onPick={() => set({ skin: c })} />)}
        </Row>
        <Row label="Coat">
          {COATS.map((c) => <Swatch key={c} color={COAT_COLOR[c]} on={look.coat === c} label={`${c} coat`} onPick={() => set({ coat: c })} />)}
        </Row>
        <Row label="Glasses">
          <Thumb look={{ ...look, glasses: false }} on={!look.glasses} label="No glasses" onPick={() => set({ glasses: false })} />
          <Thumb look={{ ...look, glasses: true }} on={look.glasses} label="Glasses" onPick={() => set({ glasses: true })} />
        </Row>

        <div className="hb-grownup" role="radiogroup" aria-label={`In our story, ${name} is`}>
          <Pen size={24} />
          <span className="hb-label">{name} is</span>
          {PRONOUNS.map((p) => <button key={p} type="button" role="radio" aria-checked={pronoun === p} className={`hb-pro${pronoun === p ? ' on' : ''}`} onClick={() => setPronoun(p)}>{p}</button>)}
        </div>

        <div className="hb-actions">
          <button type="button" className="btn btn-primary btn-big" onClick={() => onDone({ name, pronoun, look })}>That’s our hero!</button>
          {name !== 'Maya' && <button type="button" className="btn-link" onClick={() => onDone(MAYA)}>Use Maya instead</button>}
        </div>
      </section>
    </main>
  );
}
