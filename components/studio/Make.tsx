'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ROUNDS, STEP_META, authorNames, choose, currentStep, options, pageCount, pages, progress, prompt, undo, world,
  type Choice, type Story, type StepId,
} from '@/lib/story/engine';
import { STREET_SPOTS, pageScene, scene, type Scene, type Tap } from '@/lib/story/compose';
import { THINGS, FRIENDS, type PlaceId } from '@/lib/story/content';
import { track } from '@/lib/analytics';
import { Stage } from '../art/Stage';
import { ChoiceArt } from './ChoiceArt';
import { BrandMark, Crayon, Icon, Pen, Together } from '../ui/marks';

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function TurnCue({ who, name }: { who: 'child' | 'grownup' | 'together'; name: string }) {
  return (
    <div className={`cue cue-${who}`} key={`${who}-${name}`}>
      <span className="cue-icon">{who === 'child' ? <Crayon /> : who === 'grownup' ? <Pen /> : <Together />}</span>
      <span className="cue-text">
        <span className="cue-name">{who === 'together' ? 'Together' : `${name}’s turn`}</span>
        <span className="cue-role">{who === 'child' ? 'little author' : who === 'grownup' ? 'grown-up author' : name}</span>
      </span>
    </div>
  );
}

function BookStrip({ story, fresh, onOpen }: { story: Story; fresh: number; onOpen: (n: number) => void }) {
  const done = pageCount(story);
  return (
    <div className="strip" aria-label={`Our book: ${done} of 6 pages`}>
      <span className="strip-label">Our book</span>
      <ol className="strip-pages">
        {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            {n <= done ? (
              <button type="button" className={`leaf${n === fresh ? ' leaf-new' : ''}`} onClick={() => onOpen(n)} aria-label={`Look at page ${n}`}>
                <Stage scene={pageScene(story, n)} still />
                <span className="leaf-n">{n}</span>
              </button>
            ) : <span className="leaf leaf-empty" aria-hidden="true"><span className="leaf-n">{n}</span></span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

function PageView({ story, n, onClose }: { story: Story; n: number; onClose: () => void }) {
  const p = pages(story)[n - 1];
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  if (!p) return null;
  return (
    <div className="peek" role="dialog" aria-modal="true" aria-label={`Page ${n}`} onClick={onClose}>
      <div className="peek-page" onClick={(e) => e.stopPropagation()}>
        <Stage scene={pageScene(story, n)} still />
        <p className="peek-text">{p.text}</p>
        <button type="button" className="icon-btn peek-close" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
      </div>
    </div>
  );
}

export function Make({ story, onChange, onFinish, onHome }: { story: Story; onChange: (s: Story) => void; onFinish: (s: Story) => void; onHome: () => void }) {
  const step = currentStep(story);
  const [walking, setWalking] = useState<PlaceId | null>(null);
  const [moment, setMoment] = useState<number | null>(null);
  const [fresh, setFresh] = useState(0);
  const [peek, setPeek] = useState<number | null>(null);
  const [custom, setCustom] = useState(false);
  const [text, setText] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const { child, grownup } = authorNames(story);

  useEffect(() => { setCustom(false); setText(''); }, [step]);
  useEffect(() => { if (!moment) heading.current?.focus({ preventScroll: true }); }, [step, moment]);

  const live: Scene = useMemo(() => {
    const sc = scene(story, { interactive: !moment && !walking && !!step && STEP_META[step].world });
    if (walking) {
      const [fx, fy] = STREET_SPOTS[walking].walk;
      sc.actors = sc.actors.map((a) => (a.key === 'maya' ? { ...a, x: fx - 80 * 0.8, y: fy - 214 * 0.8, pose: 'walk', expr: 'delighted', anim: 'walk', flip: fx < 480 } : a));
    }
    return sc;
  }, [story, moment, walking, step]);

  if (!step) return null;
  const meta = STEP_META[step];
  const q = prompt(story, step);
  const opts = options(story, step);
  const round = meta.round;
  const labels: Record<string, string> = Object.fromEntries(opts.map((o) => [o.id, o.label]));

  function commit(c: Choice) {
    const s = step as StepId;
    track('first_interaction');
    track(meta.who === 'child' ? 'child_contribution' : meta.who === 'grownup' ? 'grownup_contribution' : 'joint_contribution', round);
    const next = choose(story, c);
    if (next === story) return;
    const before = pageCount(story), after = pageCount(next);
    onChange(next);
    if (s === 'title') { onFinish(next); return; }
    if (after > before) { track('round_completed', round); setFresh(after); setMoment(after); }
  }

  function pick(id: string, text?: string) {
    if (walking || moment) return;
    if (step === 'place') {
      setWalking(id as PlaceId);
      window.setTimeout(() => { setWalking(null); commit({ id }); }, reduced() ? 150 : 1100);
      return;
    }
    commit(text !== undefined ? { id, text } : { id });
  }

  const onTap = (t: Tap) => { if (t.step === step) pick(t.id); };
  const momentPage = moment ? pages(story)[moment - 1] : null;
  const w = world(story);
  const describe = momentPage?.text ?? `${q.ask} ${meta.world ? q.hint : ''}`;

  return (
    <div className="make">
      <section className="world" aria-label="Our story world">
        <div className="world-fit">
          <Stage scene={live} onTap={moment ? undefined : onTap} labels={labels} describe={describe} className={walking ? 'is-walking' : ''} />
        </div>
        {moment && <div className="fly-page" key={`fly${moment}`} aria-hidden="true"><div><Stage scene={pageScene(story, moment)} still /></div></div>}
      </section>

      <aside className={`turn turn-${meta.who}${moment ? ' turn-moment' : ''}`} aria-live="polite">
        <div className="turn-top">
          <button type="button" className="home-btn" onClick={onHome} aria-label="Back to our bookshelf (your book is saved)"><BrandMark size={30} /></button>
          <span className="round">Round {moment ?? round} of 6 <span className="round-name">· {ROUNDS[(moment ?? round) - 1]}</span></span>
          {progress(story) > 0 && !moment && (
            <button type="button" className="undo" onClick={() => onChange(undo(story))} aria-label="Change our last choice"><Icon name="undo" size={18} /><span>Change</span></button>
          )}
        </div>

        {momentPage ? (
          <div className="moment" key={`m${moment}`}>
            <p className="moment-kicker">Page {moment} is in our book</p>
            <p className="moment-text">{momentPage.text}</p>
            <button type="button" className="btn btn-primary" autoFocus onClick={() => setMoment(null)}>
              {moment === 6 ? 'Name our book' : 'Turn the page'} <Icon name="right" size={20} />
            </button>
          </div>
        ) : (
          <div className="ask" key={step}>
            <TurnCue who={meta.who} name={meta.who === 'together' ? `${child} & ${grownup}` : q.name} />
            <h1 ref={heading} tabIndex={-1} className="ask-q">{q.ask}</h1>
            {meta.world ? (
              <p className="ask-hint ask-hint-world"><span className="point-to-world"><Icon name="left" size={20} /></span> {q.hint}</p>
            ) : <p className="ask-hint">{q.hint}</p>}

            {step === 'title' ? (
              <div className="titles">
                {opts.map((o) => <button type="button" key={o.id} className="title-choice" onClick={() => pick(o.id)}>{o.label}</button>)}
              </div>
            ) : (
              <div className={`choices${meta.world ? ' choices-world' : ''}`}>
                {opts.map((o) => (
                  <button type="button" key={o.id} className="choice" onClick={() => pick(o.id)}>
                    <span className="choice-art"><ChoiceArt art={o.art} look={story.hero.look} /></span>
                    <span className="choice-label">{o.label}</span>
                  </button>
                ))}
              </div>
            )}

            {meta.custom && (custom ? (
              <form className="own" onSubmit={(e) => { e.preventDefault(); if (text.trim()) pick('custom', text); }}>
                <label className="sr" htmlFor="own-idea">{step === 'title' ? 'Our own title' : 'Our own idea'}</label>
                <input id="own-idea" autoFocus value={text} maxLength={step === 'title' ? 60 : 120} onChange={(e) => setText(e.target.value)}
                  placeholder={step === 'title' ? 'Our very own title…' : step === 'special' ? `e.g. it belonged to a pirate` : step === 'need' ? `e.g. ${w.friend ? FRIENDS[w.friend].he : 'they'} lost a shoe` : 'Our idea…'} />
                <button type="submit" className="btn btn-small" disabled={!text.trim()}>Use this</button>
              </form>
            ) : (
              <button type="button" className="own-open" onClick={() => setCustom(true)}><Icon name="pencil" size={16} /> {step === 'title' ? 'Make up our own title' : 'Or write our own idea'}</button>
            ))}
          </div>
        )}

        <BookStrip story={story} fresh={fresh} onOpen={setPeek} />
      </aside>
      {peek && <PageView story={story} n={peek} onClose={() => setPeek(null)} />}
      <span className="sr" aria-live="polite">{w.object ? `${story.hero.name} has ${THINGS[w.object].the}.` : ''}</span>
    </div>
  );
}
