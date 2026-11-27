import {
  ENDINGS, FRIENDS, NEEDS, PLACES, PLANS, RESPONSES, SPECIALS, THINGS, TWISTS,
  type EndingId, type FriendId, type NeedId, type ObjectId, type PlaceId, type PlanId, type ResponseId, type SpecialId, type Trait, type TwistId,
} from './content.ts';
import { MAYA, heroize, restoreHero, type Hero } from './hero.ts';

export type Who = 'child' | 'grownup' | 'together';
export type StepId = 'place' | 'object' | 'special' | 'twist' | 'response' | 'friend' | 'need' | 'plan' | 'ending' | 'title';
export const STEPS: StepId[] = ['place', 'object', 'special', 'twist', 'response', 'friend', 'need', 'plan', 'ending', 'title'];

export type Choice = { id: string; text?: string };
export type Authors = { child: string; grownup: string };
export type Story = {
  v: 2;
  id: string;
  createdAt: number;
  updatedAt: number;
  authors: Authors;
  /** The little author, drawn as the hero of the book. */
  hero: Hero;
  picks: Partial<Record<StepId, Choice>>;
  finishedAt?: number;
};

export const ROUNDS = ['Where shall we go?', 'A little discovery', 'Something unexpected', 'A new friend', 'What shall we do?', 'Until next time'] as const;

type StepMeta = { round: number; who: Who; custom: boolean; world: boolean };
export const STEP_META: Record<StepId, StepMeta> = {
  place: { round: 1, who: 'child', custom: false, world: true },
  object: { round: 2, who: 'child', custom: false, world: true },
  special: { round: 2, who: 'grownup', custom: true, world: false },
  twist: { round: 3, who: 'grownup', custom: false, world: false },
  response: { round: 3, who: 'child', custom: false, world: false },
  friend: { round: 4, who: 'child', custom: false, world: true },
  need: { round: 4, who: 'grownup', custom: true, world: false },
  plan: { round: 5, who: 'together', custom: true, world: false },
  ending: { round: 6, who: 'together', custom: true, world: false },
  title: { round: 6, who: 'together', custom: true, world: false },
};

/** After which step each page of the book is complete. */
export const PAGE_AFTER: StepId[] = ['place', 'special', 'response', 'need', 'plan', 'ending'];

export type OptionArt =
  | { kind: 'place'; id: PlaceId } | { kind: 'object'; id: ObjectId } | { kind: 'look'; id: SpecialId; object: ObjectId }
  | { kind: 'twist'; id: TwistId; place: PlaceId } | { kind: 'pose'; id: ResponseId } | { kind: 'friend'; id: FriendId }
  | { kind: 'need'; id: NeedId; friend: FriendId; object: ObjectId } | { kind: 'plan'; id: PlanId; object: ObjectId; friend: FriendId }
  | { kind: 'ending'; id: EndingId } | { kind: 'title' };
export type Option = { id: string; label: string; art: OptionArt };

/* ------------------------------------------------------------------ */
/* small text helpers                                                   */

export function clean(text: string, max = 140) {
  return text.replace(/[<>{}]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}
export function cleanName(text: string) {
  return clean(text, 24);
}
const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const sentence = (s: string) => { const c = cap(clean(s)); return /[.!?…”"’)]$/.test(c) ? c : `${c}.`; };

export function newStory(authors: Authors, now = Date.now(), hero: Hero = MAYA): Story {
  return { v: 2, id: `b${now.toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`, createdAt: now, updatedAt: now, authors: { child: cleanName(authors.child), grownup: cleanName(authors.grownup) }, hero: restoreHero(hero, cleanName), picks: {} };
}

export function authorNames(s: Story) {
  return { child: s.authors.child || 'Little author', grownup: s.authors.grownup || 'Grown-up' };
}

/* ------------------------------------------------------------------ */
/* progress                                                             */

export function progress(s: Story) {
  let n = 0;
  while (n < STEPS.length && s.picks[STEPS[n]]) n++;
  return n;
}
export function currentStep(s: Story): StepId | null {
  return STEPS[progress(s)] ?? null;
}
export function isComplete(s: Story) {
  return progress(s) === STEPS.length;
}
export function pageCount(s: Story) {
  const n = progress(s);
  return PAGE_AFTER.filter((step) => STEPS.indexOf(step) < n).length;
}
/** The story as it stood after `steps` choices — used to draw earlier pages. */
export function upTo(s: Story, steps: number): Story {
  const picks: Story['picks'] = {};
  STEPS.slice(0, steps).forEach((k) => { if (s.picks[k]) picks[k] = s.picks[k]; });
  return { ...s, picks };
}

/* ------------------------------------------------------------------ */
/* resolved world                                                       */

export type World = {
  place?: PlaceId; object?: ObjectId; special?: SpecialId | 'custom'; specialText?: string; twist?: TwistId; response?: ResponseId; trait?: Trait;
  friend?: FriendId; need?: NeedId | 'custom'; needText?: string; plan?: PlanId | 'custom'; planText?: string; ending?: EndingId | 'custom'; endingText?: string; title?: string;
};

export function world(s: Story): World {
  const p = s.picks;
  const w: World = {};
  if (p.place) w.place = p.place.id as PlaceId;
  if (p.object) w.object = p.object.id as ObjectId;
  if (p.special) { w.special = p.special.id as World['special']; w.specialText = p.special.text; }
  if (p.twist) w.twist = p.twist.id as TwistId;
  if (p.response && w.twist) { w.response = p.response.id as ResponseId; w.trait = RESPONSES[w.twist].find((r) => r.id === w.response)?.trait; }
  if (p.friend) w.friend = p.friend.id as FriendId;
  if (p.need) { w.need = p.need.id as World['need']; w.needText = p.need.text; }
  if (p.plan) { w.plan = p.plan.id as World['plan']; w.planText = p.plan.text; }
  if (p.ending) { w.ending = p.ending.id as World['ending']; w.endingText = p.ending.text; }
  if (p.title) w.title = p.title.id === 'custom' ? p.title.text : p.title.text ?? p.title.id;
  return w;
}

/* ------------------------------------------------------------------ */
/* the questions                                                        */

export function prompt(s: Story, step: StepId) {
  const q = promptRaw(s, step);
  return { ...q, ask: heroize(q.ask, s.hero) };
}

function promptRaw(s: Story, step: StepId) {
  const { child, grownup } = authorNames(s);
  const w = world(s);
  const t = w.object ? THINGS[w.object] : null;
  const f = w.friend ? FRIENDS[w.friend] : null;
  switch (step) {
    case 'place': return { ask: 'Where shall {N} go today?', hint: 'Tap a place in the picture', name: child };
    case 'object': return { ask: 'What has {N} spotted?', hint: 'Tap something in the picture', name: child };
    case 'special': return { ask: `What makes ${t?.the ?? 'it'} special?`, hint: 'Pick one, or write your own', name: grownup };
    case 'twist': return { ask: 'Then something unexpected happens…', hint: 'What is it?', name: grownup };
    case 'response': return { ask: 'What does {N} do?', hint: 'Pick one', name: child };
    case 'friend': return { ask: 'Who did {N} meet?', hint: 'Tap someone in the picture', name: child };
    case 'need': return { ask: f?.isDog ? 'What’s the matter with Biscuit?' : `What is ${f?.name ?? 'our new friend'} worried about?`, hint: 'Pick one, or write your own', name: grownup };
    case 'plan': return { ask: `How can {N} help ${f?.name ?? '{pos} friend'}?`, hint: 'Talk it over and choose together', name: `${child} & ${grownup}` };
    case 'ending': return { ask: 'How should our story end?', hint: 'Choose together', name: `${child} & ${grownup}` };
    case 'title': return { ask: 'What shall we call our book?', hint: 'Choose together, or make one up', name: `${child} & ${grownup}` };
  }
}

export function options(s: Story, step: StepId = currentStep(s) ?? 'title'): Option[] {
  return optionsRaw(s, step).map((o) => ({ ...o, label: heroize(o.label, s.hero) }));
}

function optionsRaw(s: Story, step: StepId): Option[] {
  const w = world(s);
  const place = w.place ?? 'park';
  const obj = w.object ?? PLACES[place].objects[0];
  const t = THINGS[obj];
  const friend = w.friend ?? 'otis';
  const f = FRIENDS[friend];
  switch (step) {
    case 'place': return (['bakery', 'park', 'station'] as PlaceId[]).map((id) => ({ id, label: PLACES[id].label, art: { kind: 'place', id } }));
    case 'object': return PLACES[place].objects.map((id) => ({ id, label: cap(THINGS[id].the), art: { kind: 'object', id } }));
    case 'special': return (['note', 'old', 'curious'] as SpecialId[]).map((id) => ({ id, label: SPECIALS[id].label(t), art: { kind: 'look', id, object: obj } }));
    case 'twist': return (['wind', 'animal', 'rain'] as TwistId[]).map((id) => ({ id, label: id === 'animal' ? `A cheeky ${PLACES[place].animalName}!` : TWISTS[id].label, art: { kind: 'twist', id, place } }));
    case 'response': return RESPONSES[w.twist ?? 'wind'].map((r) => ({ id: r.id, label: r.label, art: { kind: 'pose', id: r.id } }));
    case 'friend': return (['otis', 'juniper', 'biscuit'] as FriendId[]).map((id) => ({ id, label: FRIENDS[id].label, art: { kind: 'friend', id } }));
    case 'need': return (['lost', 'lonely', 'searching'] as NeedId[]).map((id) => ({ id, label: NEEDS[id].label(f, t), art: { kind: 'need', id, friend, object: obj } }));
    case 'plan': {
      const need = w.need && w.need !== 'custom' ? w.need : 'lonely';
      return PLANS[need].map((id) => ({ id, label: planLabel(id, place, obj, friend), art: { kind: 'plan', id, object: obj, friend } }));
    }
    case 'ending': return (['picnic', 'home', 'tomorrow'] as EndingId[]).map((id) => ({ id, label: ENDINGS[id].label, art: { kind: 'ending', id } }));
    case 'title': return titles(s).map((title) => ({ id: title, label: title, art: { kind: 'title' } }));
  }
}

function planLabel(id: PlanId, place: PlaceId, obj: ObjectId, friend: FriendId) {
  const f = FRIENDS[friend];
  switch (id) {
    case 'map': return 'Draw a map together';
    case 'ask': return 'Ask Mrs. Penny, who knows everyone';
    case 'follow': return PLACES[place].followLabel;
    case 'play': return 'Play hopscotch together';
    case 'introduce': return `Introduce ${f.him} to the neighbors`;
    case 'share': return THINGS[obj].shareLabel;
    case 'giveback': return 'Give it back right away';
    case 'guess': return 'Play “which hand?” first';
    case 'party': return 'Have a welcome-home party';
  }
}

/** Is `choice` a legal answer to `step`, given the story so far? */
export function isValidChoice(s: Story, step: StepId, choice: Choice) {
  if (!choice || typeof choice.id !== 'string') return false;
  if (choice.id === 'custom') return STEP_META[step].custom && typeof choice.text === 'string' && clean(choice.text).length > 0;
  if (step === 'title') return typeof choice.text === 'string' ? clean(choice.text, 80).length > 0 : titles(s).includes(choice.id);
  return optionsRaw(s, step).some((o) => o.id === choice.id);
}

export function choose(s: Story, choice: Choice, now = Date.now()): Story {
  const step = currentStep(s);
  if (!step || !isValidChoice(s, step, choice)) return s;
  const c: Choice = { id: choice.id };
  if (choice.text !== undefined) c.text = clean(choice.text, step === 'title' ? 80 : 140);
  if (step === 'title' && choice.id !== 'custom') c.text = choice.id;
  const next: Story = { ...s, picks: { ...s.picks, [step]: c }, updatedAt: now };
  if (step === 'title') next.finishedAt = now;
  return next;
}

/** Undo the most recent choice (and anything after it). */
export function undo(s: Story, now = Date.now()): Story {
  const n = progress(s);
  if (n === 0) return s;
  const r = upTo(s, n - 1);
  delete r.finishedAt;
  return { ...r, updatedAt: now };
}

/* ------------------------------------------------------------------ */
/* the prose                                                            */

export type Page = { n: number; round: number; heading: string; text: string; steps: number };

export function pages(s: Story): Page[] {
  const out: Page[] = [];
  const n = progress(s);
  PAGE_AFTER.forEach((step, i) => {
    const steps = STEPS.indexOf(step) + 1;
    if (steps <= n) out.push({ n: i + 1, round: i + 1, heading: ROUNDS[i], text: pageText(upTo(s, steps), i + 1), steps });
  });
  return out;
}

export function pageText(s: Story, page: number): string {
  return heroize(pageTextRaw(s, page), s.hero);
}

function pageTextRaw(s: Story, page: number): string {
  const w = world(s);
  if (!w.place) return '';
  const pl = PLACES[w.place];
  const t = w.object ? THINGS[w.object] : THINGS[pl.objects[0]];
  const f = w.friend ? FRIENDS[w.friend] : FRIENDS.otis;
  const He = cap(f.he);
  const animal = pl.animalName;
  switch (page) {
    case 1: return pl.opening;
    case 2: {
      const special = w.special === 'custom' ? `{N} could tell straight away that it was special. ${sentence(w.specialText ?? '')}` : w.special ? SPECIALS[w.special].line(t) : '';
      return `${t.found} ${special} {N} held it carefully. “Hello,” {sub} whispered. “Where did you come from?”`;
    }
    case 3: {
      const intro = w.twist === 'wind' ? `Just then, a great gust of wind came whooshing down Maple Street ${t.wind}`
        : w.twist === 'animal' ? `Just then, a cheeky ${animal} darted out from nowhere, ${t.animal}`
        : 'Just then — plip, plop, plip — it began to rain! Big round drops bounced on the pavement, and everyone on Maple Street ran for cover.';
      const resp: Record<ResponseId, string> = {
        run: '{N} ran after it as fast as {pos} legs would go, {pos} satchel bumping behind {obj}.',
        jump: '{N} jumped as high as {sub} could — higher than {sub} had ever jumped before — and missed it by a whisker.',
        watch: '{N} stood very still and watched. Up it went… along… and down, down, down.',
        chase: `“Hey!” laughed {N}, and off {sub} ran after the ${animal}, round the lamp post and back again.`,
        call: `“Come back!” called {N}, in {pos} very biggest voice. The ${animal} did not come back. ${cap(animal)}s hardly ever do.`,
        trick: `{N} crouched down and held out a crumb from {pos} pocket. The ${animal} stopped. It sniffed. Then it dropped ${t.the} to take the crumb.`,
        dash: `{N} dashed under the ${pl.shelter}, quick as a wink, holding ${t.the} close.`,
        splash: `{N} did not run. {N} splashed — in every single puddle, all the way to the ${pl.shelter}.`,
        cover: `{N} held {pos} satchel over {pos} head like a very small roof and hurried under the ${pl.shelter}.`,
      };
      const cliff = w.twist === 'rain' ? 'But {N} was not the only one sheltering there.' : `And where did ${t.the} end up? Right at the feet of someone {N} had never met before.`;
      return `${intro} ${w.response ? resp[w.response] : ''} ${cliff}`;
    }
    case 4: {
      const rain = w.twist === 'rain';
      const holding = rain
        ? (f.id === 'biscuit' ? 'He shook the rain from his coat — all over {N}, which made {obj} giggle.' : f.id === 'otis' ? 'He shook the raindrops from his cap.' : 'She was squeezing the rain out of her braids.')
        : (f.isDog ? `He had ${t.the} in his mouth, very gently, as if he knew it mattered — and he dropped it right at {N’s} feet.` : `${He} had caught ${t.the}, and was holding it out to {N}.`);
      return `${f.intro} ${holding} ${needLine(w, f.id, t.the, rain)}`;
    }
    case 5: {
      const pre = w.twist === 'rain' ? 'By now the rain had stopped, and the pavements shone. ' : '';
      return pre + planLine(w, f.id, pl.id, t.id);
    }
    case 6: {
      const end = endingLine(w, f.id, pl.id);
      const trait = w.trait === 'quick' ? 'It had been a day for being quick on your feet, and {N} had been quick when it mattered.'
        : w.trait === 'cheerful' ? 'It had been a surprising sort of day, and {N} had laughed {pos} way through every bit of it.'
        : '{N} had stopped, and looked, and thought — and that had made all the difference.';
      return `${end} ${trait} That night, {N} drew ${t.the} in {pos} notebook, so {sub} would never forget the day it brought {obj} a new friend.`;
    }
  }
  return '';
}

function needLine(w: World, friend: FriendId, the: string, rain: boolean) {
  const f = FRIENDS[friend];
  const The = cap(the);
  if (w.need === 'custom') return `${f.name} had a worry. ${sentence(w.needText ?? '')}`;
  if (w.need === 'lost') {
    if (friend === 'otis') return rain ? 'But Otis looked worried. “Everything looks different in the rain,” he said. “I’m afraid I can’t remember the way home.”' : 'But Otis looked worried. “I came out for a little walk,” he said, “and now I can’t remember which way is home.”';
    if (friend === 'juniper') return '“We only moved here last week,” said Juniper, “and now I can’t find my way back to my new house.” Her chin wobbled, just a little.';
    return 'Biscuit gave a small, sad whine. He had wandered too far from home, and every street looked the same to him.';
  }
  if (w.need === 'lonely') {
    if (friend === 'otis') return '“My old friends have all moved away,” said Otis quietly. “It’s been a long time since anyone stopped to say good morning.”';
    if (friend === 'juniper') return '“I’m new here,” said Juniper, looking down at her boots. “I don’t know anybody yet.”';
    return 'Biscuit looked up at {N} and wagged — just the tip of his tail. He didn’t have anyone to play with.';
  }
  if (w.need === 'searching') {
    const sp = w.special;
    if (f.isDog) {
      const cb = sp === 'old' ? ' It had belonged to his family for years and years.' : sp === 'note' ? ' The note had worked: {N} had looked after it beautifully.' : sp === 'curious' ? ' Perhaps that was why it had been behaving so strangely — it had been trying to find him.' : '';
      return `Biscuit barked and spun round three times. ${The} belonged to his family, and he had been searching for it everywhere!${cb}`;
    }
    const first = friend === 'otis' ? '“Well, I never!” said Otis, and his eyes went round behind his glasses. “That’s mine! I’ve been looking for it all morning.”' : '“That’s mine!” gasped Juniper. “I’ve looked everywhere for it!”';
    const hug = friend === 'otis' ? ' He looked at it very closely.' : ' She looked at it very closely.';
    const cb = sp === 'old' ? hug + (friend === 'otis' ? ' “I’ve had it since I was a boy no bigger than you.”' : ' “It was my grandma’s, when she was little.”')
      : sp === 'note' ? `${hug} “I wrote that note myself,” ${f.he} said, “just in case.”`
      : sp === 'curious' ? `${hug} “It always does that,” ${f.he} said. “I think it was trying to find me.”` : '';
    return first + cb;
  }
  return '';
}

function planLine(w: World, friend: FriendId, place: PlaceId, obj: ObjectId) {
  const f = FRIENDS[friend];
  const t = THINGS[obj];
  const pl = PLACES[place];
  const dog = f.isDog;
  switch (w.plan) {
    case 'map': return `“Let’s draw a map!” said {N}. {Sub} took a pencil from {pos} satchel, and together they drew all of Maple Street: Little Crumb, the park, the station on the hill.${dog ? ' Biscuit put his paw right on one little house and barked. That was the one!' : ` ${f.name} pointed. “There! The house with the blue door!”`} And off they went, with the map leading the way.`;
    case 'ask': return `“Mrs. Penny knows everybody,” said {N}. So they went to Little Crumb, where Mrs. Penny wiped her floury hands on her apron. “Why, of course!” she said. “Down Maple Street, past the lamp post — the house with the blue door.” She even gave them a bun each for the journey.`;
    case 'follow': return `“I know,” said {N}. “Let’s follow ${pl.follow}.” So they did — around one corner, and then another, and then one more — until ${dog ? 'Biscuit stopped, sniffed, and barked and barked.' : `${f.name} stopped. “Here! I know this street!”`} There was the blue door, and there was home.`;
    case 'play': return `{N} took a piece of chalk from {pos} satchel and drew a hopscotch on the pavement. One, two, three — hop! ${friend === 'otis' ? 'Otis was surprisingly good at it. Soon they were both laughing too hard to hop at all.' : friend === 'juniper' ? 'Juniper could hop all the way to five on one foot. Soon they were both laughing too hard to hop at all.' : 'Biscuit didn’t know the rules, so he made up his own. They mostly involved jumping on {N}.'}`;
    case 'introduce': return `So {N} took ${f.name} all the way along Maple Street. They said hello to Mrs. Penny at Little Crumb, to the ducks in the park and to the station master, who tipped his cap. By the end of the morning, everybody on Maple Street knew ${f.name}’s name.`;
    case 'share': return `“We could share it,” said {N}. ${t.share}`;
    case 'giveback': return `{N} held out ${t.the}. “I think this belongs to you,” {sub} said. ${dog ? 'Biscuit took it ever so gently, and his whole back end wagged.' : `${f.name}’s face lit up like a lamp at teatime. “Thank you,” ${f.he} said. “You’ve made my whole day.”`}`;
    case 'guess': return `{N} put ${t.the} behind {pos} back. “Before I give it back,” {sub} said, “you have to guess which hand!” ${dog ? 'Biscuit sniffed one hand, then the other, and found it in two seconds flat.' : `${f.name} guessed the left hand, then the right hand, then both hands, then the left again. They laughed until their tummies hurt — and then ${f.name} got ${t.the} back.`}`;
    case 'party': return `“Something lost has come home,” said {N}. “That calls for a party!” So Mrs. Penny hung paper flags across Maple Street, and everybody shared a slice of lemon cake.${dog ? ' Biscuit had two slices. Nobody minded.' : ''}`;
    case 'custom': return `{N} and ${f.name} put their heads together, and this is what they decided: ${sentence(w.planText ?? '')} And would you believe it? It worked.`;
  }
  return '';
}

function endingLine(w: World, friend: FriendId, place: PlaceId) {
  const f = FRIENDS[friend];
  switch (w.ending) {
    case 'picnic': return `Afterwards, they sat on ${PLACES[place].seat} and shared warm buns from Little Crumb, still sticky with sugar.${f.isDog ? ' Biscuit ate his in one bite.' : ''}`;
    case 'home': return `By the time they were done, the sky had turned the color of apricot jam, and the streetlamps blinked on one by one. {N} and ${f.name} walked home together along Maple Street.`;
    case 'tomorrow': return f.isDog ? '“Will you come back tomorrow?” asked {N}. Biscuit barked once, which everybody knows means yes. {N} waved all the way to the corner.' : `“Will you come back tomorrow?” asked ${f.name}. “Same time, same place,” said {N}, and {sub} waved all the way to the corner.`;
    case 'custom': return `And here is how the day ended: ${sentence(w.endingText ?? '')}`;
  }
  return '';
}

/* ------------------------------------------------------------------ */
/* titles                                                               */

export function titles(s: Story): string[] {
  const w = world(s);
  if (!w.object || !w.friend) return [heroize('{N’s} Big Day', s.hero)];
  const t = THINGS[w.object];
  const f = FRIENDS[w.friend];
  const first = w.twist === 'rain' ? `The Rainy-Day ${t.title}` : `The Runaway ${t.title}`;
  const second = w.need === 'lost' ? `${f.name} Finds the Way Home` : w.need === 'lonely' ? `A Friend for ${f.name}` : w.need === 'searching' ? `The ${t.title} That Found ${f.name}` : `{N} and ${f.name}`;
  const third = w.need === 'searching' ? `{N} and ${f.name}` : `The ${t.title} That Found a Friend`;
  return Array.from(new Set([first, second, third].map((t) => heroize(t, s.hero))));
}

export function bookTitle(s: Story) {
  return world(s).title || 'Our Maple Street Adventure';
}

/* ------------------------------------------------------------------ */
/* persistence and sharing                                              */

/** Rebuild a story from untrusted data, replaying every choice through the rules. */
export function restore(value: unknown): Story | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Partial<Story>;
  if (v.v !== 2 || typeof v.id !== 'string' || !v.authors || typeof v.authors !== 'object' || !v.picks || typeof v.picks !== 'object') return null;
  const a = v.authors as Partial<Authors>;
  if (typeof a.child !== 'string' || typeof a.grownup !== 'string') return null;
  const createdAt = typeof v.createdAt === 'number' ? v.createdAt : Date.now();
  let s: Story = { v: 2, id: v.id.slice(0, 40), createdAt, updatedAt: createdAt, authors: { child: cleanName(a.child), grownup: cleanName(a.grownup) }, hero: restoreHero(v.hero, cleanName), picks: {} };
  for (const step of STEPS) {
    const c = (v.picks as Record<string, Choice | undefined>)[step];
    if (!c) break;
    const next = choose(s, c, typeof v.updatedAt === 'number' ? v.updatedAt : createdAt);
    if (next === s) return null;
    s = next;
  }
  if (typeof v.finishedAt === 'number' && isComplete(s)) s.finishedAt = v.finishedAt;
  if (typeof v.updatedAt === 'number') s.updatedAt = v.updatedAt;
  return s;
}

function b64urlEncode(text: string) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(text: string) {
  const bin = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

/** A compact, self-contained encoding of a finished book for a private link. */
export function encodeBook(s: Story) {
  const p = STEPS.map((k) => { const c = s.picks[k]; return c ? (c.text !== undefined ? [c.id, c.text] : c.id) : null; });
  const { name, pronoun, look: l } = s.hero;
  const h = [name, pronoun, l.skin, l.hair, l.hairColor, l.coat, l.glasses ? 1 : 0];
  return b64urlEncode(JSON.stringify({ a: [s.authors.child, s.authors.grownup], h, p, t: s.finishedAt ?? s.updatedAt, i: s.id }));
}

function heroFromArray(h: unknown) {
  if (!Array.isArray(h)) return undefined;
  const [name, pronoun, skin, hair, hairColor, coat, glasses] = h;
  return { name, pronoun, look: { skin, hair, hairColor, coat, glasses: glasses === 1 } };
}

export function decodeBook(code: string): Story | null {
  try {
    const d = JSON.parse(b64urlDecode(code));
    if (!d || !Array.isArray(d.a) || !Array.isArray(d.p)) return null;
    const picks: Record<string, Choice> = {};
    STEPS.forEach((k, i) => { const c = d.p[i]; if (typeof c === 'string') picks[k] = { id: c }; else if (Array.isArray(c)) picks[k] = { id: String(c[0]), text: String(c[1]) }; });
    const t = typeof d.t === 'number' ? d.t : Date.now();
    return restore({ v: 2, id: typeof d.i === 'string' ? d.i : `shared${t}`, createdAt: t, updatedAt: t, finishedAt: t, authors: { child: String(d.a[0] ?? ''), grownup: String(d.a[1] ?? '') }, hero: heroFromArray(d.h), picks });
  } catch {
    return null;
  }
}
